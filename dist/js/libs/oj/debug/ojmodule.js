/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'knockout', 'ojs/ojlogger', 'ojs/ojcontext'], function(oj, ko, Logger, Context)
{
  "use strict";


/* global ko:false, Promise:false, Logger:false, Context:false */

/**
 * ojModule Conventions
 * @namespace
 * @ojtsmodule
 * @ojtsignore
 * @since 1.1
 */
oj.ModuleBinding = {};
// Define a mapping variable that maps the return value of the module to the name used in the callback function of a require call.
// eslint-disable-next-line no-unused-vars
var ModuleBinding = oj.ModuleBinding;

/**
 * Default configuration values
 * ojModule binding's conventions may be overridden for the entire application after the ojs/ojmodule
 * module is loaded. For example:
 * <p><code class="prettyprint">
 * oj.ModuleBinding.defaults.modelPath = 'models/';
 * </code></p>
 * Note that the default names of the {@link oj.ModuleBinding.ConventionMethods optional lifecycle methods}
 * on the ViewModel are different from their counterparts on the {@link ojModule.LifecycleListener LifecycleListener}
 * interface
 * @property {string} viewPath default View path. Defaults to 'text!views/'
 * @property {string} viewSuffix default View suffix. Defaults to '.html'
 * @property {string} modelPath default Model suffix. Defaults to 'viewModels/'
 * @property {string} initializeMethod name of the initialialization method
 * (see {@link oj.ModuleBinding.ConventionMethods#initialize definition})
 * @property {string} disposeMethod name of the dispose method
 * (see {@link oj.ModuleBinding.ConventionMethods#dispose definition})
 * @property {string} activatedHandler name of the 'activated' event handler
 * (see {@link oj.ModuleBinding.ConventionMethods#handleActivated definition})
 * @property {string} attachedHandler name of the 'attached' event handler
 * (see {@link oj.ModuleBinding.ConventionMethods#handleAttached definition})
 * @property {string} detachedHandler name of the 'detached' event handler
 * (see {@link oj.ModuleBinding.ConventionMethods#handleDetached definition})
 * @property {string} bindingsAppliedHandler name of the 'bindingsApplied' event handler
 * (see {@link oj.ModuleBinding.ConventionMethods#handleBindingsApplied definition})
 * @property {string} deactivatedHandler name of the 'deactivated' event handler
 * (see {@link oj.ModuleBinding.ConventionMethods#handleDeactivated definition})
 * @property {string} transitionCompletedHandler name of the 'transitionCompleted' event handler
 * (see {@link oj.ModuleBinding.ConventionMethods#handleTransitionCompleted definition})
 * @export
 * @memberof oj.ModuleBinding
 */
oj.ModuleBinding.defaults =
{
  viewPath: 'text!views/',
  viewSuffix: '.html',
  modelPath: 'viewModels/',
  initializeMethod: 'initialize',
  disposeMethod: 'dispose',
  activatedHandler: 'handleActivated',
  attachedHandler: 'handleAttached',
  detachedHandler: 'handleDetached',
  bindingsAppliedHandler: 'handleBindingsApplied',
  deactivatedHandler: 'handleDeactivated',
  transitionCompletedHandler: 'handleTransitionCompleted'
};

/**
 * @ignore
 */
oj.ModuleBinding._EMPTY_MODULE = 'oj:blank';

(function () {
  ko.bindingHandlers.ojModule =
  {
    init: function (element, valueAccessor, allBindingsAccessor, koViewModel, bindingContext) {
      var currentViewModel;
      var currentAnimationPromise;
      var cache = {};
      var currentCacheKey;
      var pendingViewId = -1;
      var cacheHolder;
      var endCommentNode;
      var busyStateResolver;
      var currentEmpty;
      var currentCleanupMode;
      var isCustomElement = element.parentNode && element.parentNode.nodeName === 'OJ-MODULE'; // custom element check

      var legacyViewModelMethodFunc = isCustomElement ? function () {} : _invokeViewModelMethod;
      var legacyLifecycleListenerFunc = isCustomElement ? function () {} : _invokeLifecycleListener;
      var viewModelMethodFunc = isCustomElement ? _invokeViewModelMethodOnElement : function () {};
      var dispatchLifecycleEventFunc = isCustomElement ? _dispatchLifecycleEvent : function () {};

      function resolveBusyState() {
        if (busyStateResolver) {
          busyStateResolver();
          busyStateResolver = null;
        }
      }

      var invokeModelDispose = function (model) {
        legacyViewModelMethodFunc(model, 'disposeMethod', [element, valueAccessor]);
      };

      var disposeAssociatedComponentViewModel = function () {
        invokeModelDispose(currentViewModel);
      };

      var nodeDispose = function () {
        disposeAssociatedComponentViewModel();

        // call dispose() on cached models
        var keys = Object.keys(cache);
        for (var i = 0; i < keys.length; i++) {
          var model = cache[keys[i]].model;
          invokeModelDispose(model);
        }
        resolveBusyState();

        // Knockout will call ko.cleanNode on all child nodes including the cacheHolder
      };

      ko.utils.domNodeDisposal.addDisposeCallback(element, nodeDispose);

      var _IGNORE_PROMISE =
          new Error('Promise cancelled because ojModule is fetching new View and ViewModel');

      // This function is used to interrupt Promise chains when the new view/viewModel combination is being loaded
      var checkPendingId = function (id) {
        if (id !== pendingViewId) {
          throw _IGNORE_PROMISE;
        }
      };

      var initCacheHolder = function () {
        if (!cacheHolder) {
          cacheHolder = document.createElement('div');
          cacheHolder.className = 'oj-helper-module-cache';
          // it is Ok to insert the cache holder as the first element because
          // all current children of the element will be moved to the cache holder
          ko.virtualElements.prepend(element, cacheHolder); // @HTMLUpdateOK cacheHolder is constructed above
        }
      };

      var contextElement = element;

      if (element.nodeType === 8) { // comment
        contextElement = element.parentNode;
        ko.virtualElements.setDomNodeChildren(element, []); // remove all child nodes of the virtual element
        endCommentNode = element.nextSibling;
      }

      ko.computed(function () {
        pendingViewId += 1;

        if (!busyStateResolver) {
          var busyContext = Context.getContext(contextElement).getBusyContext();
          busyStateResolver = busyContext.addBusyState(
            { description: 'ojModule binding on a node with the Id ' + element.id +
                   'is loading the module. Binding evaluator: ' + valueAccessor.toString() });
        }

        var isInitial = pendingViewId === 0;

        var unwrap = ko.utils.unwrapObservable;
        var value = unwrap(valueAccessor());

        var moduleName;
        var viewName;
        var params;
        var modelFactory;
        var viewFunction;
        var cacheKey;
        var lifecycleListener;
        var animation;
        var requireFunc;
        var modelPath;
        var viewPath;
        var accessorView;
        var accessorViewModel;
        var cleanupMode;

        if (typeof value === 'string') {
          moduleName = value;
        } else {
          moduleName = unwrap(value.name);
          viewName = unwrap(value.viewName);
          params = unwrap(value.params);
          modelFactory = unwrap(value.viewModelFactory);
          viewFunction = unwrap(value.createViewFunction);
          cacheKey = unwrap(value.cacheKey);
          lifecycleListener = unwrap(value.lifecycleListener);
          animation = unwrap(value.animation);
          accessorView = unwrap(value.view);
          accessorViewModel = unwrap(value.viewModel);
          requireFunc = unwrap(value.require);
          cleanupMode = unwrap(value.cleanupMode);
        }

        if (requireFunc != null && !(requireFunc instanceof Function)) {
          viewPath = requireFunc.viewPath;
          modelPath = requireFunc.modelPath;
          requireFunc = requireFunc.instance;
        }

        viewName = viewName == null ? moduleName : viewName;

        var empty = (oj.ModuleBinding._EMPTY_MODULE === viewName);

        var attachPromise =
            legacyLifecycleListenerFunc(lifecycleListener, 'activated', [element, valueAccessor]);
        dispatchLifecycleEventFunc(contextElement, 'ojTransitionStart', [accessorViewModel]);

        var viewPromise;
        var modelPromise;
        var cached;

        if (empty) {
          viewPromise = Promise.resolve([]);
          modelPromise = Promise.resolve(null);
        } else {
          cached = cacheKey == null ? null : cache[cacheKey];

          if (cached != null) {
            delete cache[cacheKey];
            viewPromise = Promise.resolve(cached.view);
            modelPromise = Promise.resolve(cached.model);
          }
        }

        if (viewPromise == null && accessorView != null) {
          viewPromise = Promise.resolve(accessorView);
        }

        if (modelPromise == null) {
          if (accessorViewModel != null) {
            modelPromise = Promise.resolve(accessorViewModel);
          } else if (modelFactory != null) {
            modelPromise = ko.ignoreDependencies(modelFactory.createViewModel,
                                                 modelFactory,
                                                 [params, valueAccessor]);
          }

          if (modelPromise == null && moduleName != null) {
            if (modelPath == null) {
              modelPath = oj.ModuleBinding.defaults.modelPath;
            }
            modelPromise = _getOjModuleRequirePromise(requireFunc, 'viewModel', modelPath + moduleName);
          }

          if (modelPromise != null) {
            // Wrap model promise to perform initialization
            modelPromise = modelPromise.then(
              function (id, viewModel) {
                checkPendingId(id);

                if (typeof viewModel === 'function') {
                  // eslint-disable-next-line no-param-reassign,new-cap
                  viewModel = new viewModel(params);
                } else {
                  // If the function returns a value, use it as the new model instance
                  // eslint-disable-next-line no-param-reassign
                  viewModel = legacyViewModelMethodFunc(viewModel,
                                                        'initializeMethod',
                                                        [element, valueAccessor])
                    || viewModel;
                }

                return viewModel;
              }.bind(null, pendingViewId)
            );

            // Handle the case where the Model is responsible for creating a View
            if (viewPromise == null && viewFunction != null) {
              viewPromise = modelPromise.then(
                function (id, model) {
                  checkPendingId(id);

                  if (model == null) {
                    resolveBusyState();
                    throw new Error('createViewFunction option cannot be used when the ViewModel is null');
                  }

                  var viewMethod = model[viewFunction];

                  if (viewMethod == null) {
                    resolveBusyState();
                    throw new Error('function specified by the createViewFunction option was not found on the ViewModel');
                  }

                  return viewMethod.call(model);
                }.bind(null, pendingViewId)
              );
            }
          }
          if (viewPromise == null) {
            if (viewName != null) {
              if (viewPath == null) {
                viewPath = oj.ModuleBinding.defaults.viewPath;
              }
              viewPromise =
              _getOjModuleRequirePromise(requireFunc, 'view',
                                   viewPath + viewName + oj.ModuleBinding.defaults.viewSuffix);
            } else {
              resolveBusyState();
              throw new Error('View name or view instance must be specified');
            }
          }
        }

        if (viewPromise == null) {
          resolveBusyState();
          throw new Error('ojModule is missing a View');
        }

        var modelAttachPromise;

        if (modelPromise != null) {
          modelAttachPromise = modelPromise.then(
              function (id, viewModel) {
                checkPendingId(id);
                return legacyViewModelMethodFunc(viewModel,
                                                 'activatedHandler',
                                                 [element, valueAccessor]);
              }.bind(null, pendingViewId)
          );
        }

        // We will ahve to wait for any module animation that has already started. Allowing a new View to be loaded while
        // animation is in progress would potentially leave the DOM in
        var masterPromise = Promise.all(
          [viewPromise, modelPromise, attachPromise, modelAttachPromise, currentAnimationPromise]
        );

        masterPromise.then(
          function (id, values) {
            if (id !== pendingViewId) {
              return;
            }

            var view = values[0];

            if (view == null) {
              resolveBusyState();
              throw new Error("The module's View was resolved to null");
            }

            var nodes = _getDomNodes(view, resolveBusyState);
            var model = values[1];
            _checkForReusedView(element, nodes, model, isCustomElement, resolveBusyState);

            var saveInCache = false;
            var cachedNodeArray;

            var oldDomNodes = _getContainedNodes(element, cacheHolder, endCommentNode);
            var oldKoNodes = _getKoNodes(element, cacheHolder);


            if (currentCacheKey != null && !currentEmpty) {
              saveInCache = true;
              cachedNodeArray = oldDomNodes;
              initCacheHolder();
            } else if (isCustomElement) { // need view nodes for the event payload
              cachedNodeArray = oldDomNodes;
            }


            var oldNodesRemoved = false;

            var removeOldDomNodes = function (oldViewParent) {
              if (oldNodesRemoved) {
                return;
              }

              oldNodesRemoved = true;

              if (saveInCache) { // legacy cache case - move the node into cacheHolder, then detach
                // Keep the cached nodes connected as a workaround for the Knockout removing observable subscriptions when
                // they fire on disconnected nodes
                _moveDomNodes(oldDomNodes, cacheHolder);
                _detachOldView(element, oldViewParent || element, cacheHolder);
              } else if (isCustomElement && currentCleanupMode === 'none') { // external cache case
                // detach from DOM by simply removing to preserve applied binding on the nodes
                for (var i = 0; i < cachedNodeArray.length; i++) {
                  var cachedNode = cachedNodeArray[i];
                  cachedNode.parentNode.removeChild(cachedNode);
                }
              } else { // cache is not involved - clean up and detach
                oldKoNodes.forEach(
                  function (n) {
                    ko.cleanNode(n);
                  }
                );
                _detachOldView(element, oldViewParent || element, cacheHolder);
              }

              if (!isInitial) { // ensure that this is not the very first view displayed by the binding
                legacyLifecycleListenerFunc(
                  lifecycleListener,
                  'detached',
                  [element, valueAccessor, currentViewModel, cachedNodeArray]);
                legacyViewModelMethodFunc(currentViewModel,
                                          'detachedHandler',
                                          [element, valueAccessor, cachedNodeArray]);
                viewModelMethodFunc(currentViewModel, 'disconnected');
                dispatchLifecycleEventFunc(contextElement,
                                           'ojViewDisconnected',
                                           [currentViewModel, cachedNodeArray]);

                legacyLifecycleListenerFunc(lifecycleListener,
                                            'deactivated',
                                            [element, valueAccessor, currentViewModel]);
                legacyViewModelMethodFunc(currentViewModel,
                                          'deactivatedHandler',
                                          [element, valueAccessor]);
              }

              if (saveInCache) {
                // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
                _invokeOnSubtree(cachedNodeArray,
                                 oj.Components ? oj.Components.subtreeHidden : null);
                cache[currentCacheKey] = { model: currentViewModel, view: cachedNodeArray };
              } else if (isCustomElement && currentCleanupMode === 'none') {
                _invokeOnSubtree(cachedNodeArray,
                                 oj.Components ? oj.Components.subtreeDetached : null);
              } else {
                disposeAssociatedComponentViewModel();
              }
              currentViewModel = model;
              currentCacheKey = cacheKey;
              currentEmpty = empty;
              currentCleanupMode = cleanupMode;
            };


            function insertAndActivateNewNodes(_targetElement) {
              var targetElement = _targetElement || element;

              // For custom elements check whether the binding is already applied to nodes
              // before attaching nodes to DOM. This helps in a scenario when knockout
              // uses parent nodes to find applied binding and returns parent binding as a result.
              // E.g. knockout might return incorrect binding for comment nodes that are attached to DOM.
              var bindingApplied = isCustomElement && _isBindingApplied(nodes, model);

              _insertNodes(targetElement, nodes);

              var fromCache = cached != null;

              // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
              if (fromCache) {
                _invokeOnSubtree(nodes, oj.Components ? oj.Components.subtreeShown : null);
              } else if (bindingApplied) {
                _invokeOnSubtree(nodes, oj.Components ? oj.Components.subtreeAttached : null);
              }

              legacyLifecycleListenerFunc(lifecycleListener, 'attached',
                                          [targetElement, valueAccessor, model, fromCache]);
              legacyViewModelMethodFunc(model, 'attachedHandler',
                                        [targetElement, valueAccessor, fromCache]);
              viewModelMethodFunc(model, 'connected');
              dispatchLifecycleEventFunc(contextElement, 'ojViewConnected', [model]);

              if (!fromCache && !bindingApplied) {
                var childBindingContext = bindingContext.createChildContext(model,
                undefined, function (ctx) {
                  ctx.$module = model;
                  ctx.$params = params;
                });

                if (isCustomElement) {
                  // nulling out the composite binding context props from the contained module
                  childBindingContext.$parent = undefined;
                  childBindingContext.$parents = undefined;
                  childBindingContext.$parentContext = undefined;
                  childBindingContext.$props = undefined;
                  childBindingContext.$properties = undefined;
                  childBindingContext.$slotNodeCounts = undefined;
                  childBindingContext.$slotCounts = undefined;
                  childBindingContext.$unique = undefined;
                  childBindingContext.$uniqueId = undefined;
                }

                _applyBindingsToNodes(targetElement, nodes[0], childBindingContext, cacheHolder);

                legacyLifecycleListenerFunc(lifecycleListener, 'bindingsApplied',
                                            [targetElement, valueAccessor, model]);
                legacyViewModelMethodFunc(model, 'bindingsAppliedHandler',
                                          [targetElement, valueAccessor]);
              }
            }

            var transitionComplete = function () {
              legacyLifecycleListenerFunc(lifecycleListener, 'transitionCompleted',
                                          [element, valueAccessor, model]);
              legacyViewModelMethodFunc(model, 'transitionCompletedHandler',
                                        [element, valueAccessor]);
              viewModelMethodFunc(model, 'transitionCompleted');
              dispatchLifecycleEventFunc(contextElement, 'ojTransitionEnd', [model]);
              resolveBusyState();
            };


            if (animation != null) {
              var actx = _createAnimationContext(element, valueAccessor, isInitial,
                                                 currentViewModel, model, isCustomElement);
              var promise = _animate(actx, animation, element, oldDomNodes,
                                     insertAndActivateNewNodes, removeOldDomNodes,
                                     transitionComplete);
              // wrap currentAnimationPromise is a promise that never gets rejected, so that the ojModule can still
              // navigate to a new View
              currentAnimationPromise = _createNoFailPromise(promise);
            } else {
              currentAnimationPromise = undefined;
            }

            if (!currentAnimationPromise) {
              removeOldDomNodes(null);
              insertAndActivateNewNodes(null);
              transitionComplete();
            }
          }.bind(null, pendingViewId),

          /* reject callback */
          function (id, reason) {
            if (reason === _IGNORE_PROMISE) {
              return;
            }

            if (reason != null) {
              resolveBusyState();

              Logger.error(reason);
              // Additionally log the stack trace for the original error
              /* if (reason instanceof Error)
              {
                Logger.error(reason.stack);
              }*/
            }
          }.bind(null, pendingViewId)

        );
      },
      null,
      { disposeWhenNodeIsRemoved: element }
      );

      return { controlsDescendantBindings: true };
    }
  };

  // Allow ojModule binding on virtual elements (comment nodes)
  ko.virtualElements.allowedBindings.ojModule = true;


  /**
   * @ignore
   */
  function _animate(
    _actx, animation, element, oldDomNodes, insertAndActivateFunc,
    removeOldDomNodes, transitionComplete
  ) {
    var actx = _actx;
    var canAnimateFunc = animation.canAnimate;
    var animating = canAnimateFunc == null || canAnimateFunc.call(animation, actx);

    if (!animating) {
      return undefined;
    }

    var newViewParent;
    var oldViewParent;

    var settings = animation.prepareAnimation.call(animation, actx);
    if (settings) {
      newViewParent = settings.newViewParent;
      oldViewParent = settings.oldViewParent;
    }

    var targetElement = newViewParent || element;

    if (oldViewParent && oldViewParent !== element) {
      _moveDomNodes(oldDomNodes, oldViewParent);
    } else if (targetElement === element) {
      removeOldDomNodes(null);
    }
    // remove all nodes from the target element if it is not the main element managed by ojModule (that one is cleaned
    // separately, and it also contains cached views
    if (targetElement !== element) {
      ko.virtualElements.setDomNodeChildren(targetElement, []);
    }

    insertAndActivateFunc(targetElement);

    var newDomNodes = Array.prototype.slice.call(targetElement.childNodes);

    var viewInserted = false;

    var insertNewView = function () {
      if (viewInserted) {
        return;
      }
      viewInserted = true;
      if (element !== targetElement) {
        _insertNodes(element, newDomNodes);

        var isCustomElement = element.parentNode
            && element.parentNode.nodeName === 'OJ-MODULE'; // custom element check
        // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
        if (oj.Components && !isCustomElement) {
           // The subtree just got moved to a new parent, so notify components
           // of the 'detach' imeddiately followed by the 'attach'
          _invokeOnSubtree(newDomNodes, oj.Components.subtreeDetached);
          _invokeOnSubtree(newDomNodes, oj.Components.subtreeAttached);
        }
      }
    };

    var removeOldView = removeOldDomNodes.bind(null, oldViewParent); // pass oldViewParent as the first parameter

    actx.newViewParent = newViewParent;
    actx.oldViewParent = oldViewParent;
    actx.oldViewNodes = oldDomNodes;
    actx.removeOldView = removeOldView;
    actx.insertNewView = insertNewView;

    var postAnimation = function () {
      removeOldView();
      insertNewView();
      transitionComplete();
    };

    var animationPromise = animation.animate.call(animation, actx).then(
      postAnimation, // success
      function () { // failure
        postAnimation();
        Logger.error('ojModule animation promise was rejected');
      }
    );

    return animationPromise;
  }

  /**
   * @ignore
   */
  function _detachOldView(element, _oldViewParent, cacheHolder) {
    var oldViewParent = _oldViewParent || element;
    var empty = [];
    // If the node being emptied is the ojModule host node, ensure that the cacheHolder stays
    if (cacheHolder && element === oldViewParent) {
      // Remove cacheHolder to avoid bindoings being deactivated
      cacheHolder.parentNode.removeChild(cacheHolder);
      empty.push(cacheHolder);
    }
    ko.virtualElements.setDomNodeChildren(oldViewParent, empty);
  }

  /**
   * @ignore
   */
  function _moveDomNodes(nodes, target) {
    nodes.forEach(
      function (n) {
        target.appendChild(n); // @HTMLUpdateOK child nodes are module view
      }
    );
  }

  /**
   * @ignore
   */
  function _isBindingApplied(nodes, model) {
    var bindingContext;
    for (var i = 0; i < nodes.length; i++) {
      bindingContext = ko.contextFor(nodes[i]);
      if (bindingContext) {
        break;
      }
    }
    return bindingContext && bindingContext.$module && bindingContext.$module === model;
  }

  /**
   * @ignore
   */
  function _isDocumentFragment(content) {
    if (window.DocumentFragment) {
      return content instanceof DocumentFragment;
    }

    return content && content.nodeType === 11;
  }

  /**
   * @ignore
   */
  function _dispatchLifecycleEvent(element, eventName, params) {
    var detail = {};
    if (params[0]) {
      detail.viewModel = params[0];
    }
    if (params[1]) {
      detail.view = params[1];
    }
    var customEvent = new CustomEvent(eventName, { detail: detail });
    element.dispatchEvent(customEvent);
  }

  /**
   * @ignore
   */
  function _invokeLifecycleListener(listener, method, params) {
    if (listener && listener[method]) {
      var data = { element: params[0], valueAccessor: params[1] };
      if (params.length > 2) {
        data.viewModel = params[2];
        if (params.length > 3) {
          data[typeof params[3] === 'boolean' ? 'fromCache' : 'cachedNodes'] = params[3];
        }
      }
      // : suspend dependency detection while listeners are invoked
      var ret = ko.ignoreDependencies(listener[method], listener, [data]);
      return ret;
    }
    return undefined;
  }

  /**
   * @ignore
   * @param {?Object} model
   * @param {string} key
   * @param {Array=} params
   * @return {Object|undefined}
   */
  function _invokeViewModelMethod(model, key, params) {
    if (model == null) {
      return undefined;
    }
    var name = oj.ModuleBinding.defaults[key];
    if (name != null && model) {
      var handler = model[name];
      if (typeof handler === 'function') {
        var data;
        if (params) {
          data = { element: params[0], valueAccessor: params[1] };
          if (params.length > 2) {
            data[typeof params[2] === 'boolean' ? 'fromCache' : 'cachedNodes'] = params[2];
          }
        }
        // : suspend dependency detection while listeners are invoked
        var ret = ko.ignoreDependencies(handler, model, [data]);
        return ret;
      }
    }
    return undefined;
  }

  /**
   * @ignore
   * @param {?Object} model
   * @param {string} name
   */
  function _invokeViewModelMethodOnElement(model, name) {
    if (model && name) {
      var handler = model[name];
      if (typeof handler === 'function') {
        // suspend dependency detection while listeners are invoked
        ko.ignoreDependencies(handler, model);
      }
    }
  }

  /**
   * @ignore
   */
  function _getContainedNodes(container, cacheHolder, endCommentNode) {
    var childList = [];
    var firstChild = ko.virtualElements.firstChild(container);

    for (var node = firstChild; node != null && node !== endCommentNode; node = node.nextSibling) {
      if (node !== cacheHolder) {
        childList.push(node);
      }
    }

    return childList;
  }

  /**
   * @ignore
   */
  function _getKoNodes(container, cacheHolder) {
    var nodes = [];
    var firstChild = ko.virtualElements.firstChild(container);

    _koNodesForEach(firstChild, cacheHolder,
      function (node) {
        nodes.push(node);
      }
    );

    return nodes;
  }


  /**
   * @ignore
   */
  function _koNodesForEach(first, cacheHolder, callback) {
    var node = first;
    while (node != null) {
      var next = ko.virtualElements.nextSibling(node);
      var type = node.nodeType;
      if (node !== cacheHolder && (type === 1 || type === 8)) {
        callback(node);
      }
      node = next;
    }
  }

  /**
   * @ignore
   */
  function _applyBindingsToNodes(parentNode, first, bindingContext, cacheHolder) {
    // Workaround for KO not calling preprocessNode() on the node where .applyBindings() is called
    var provider = ko.bindingProvider.instance;
    var preprocessNode = provider.preprocessNode;

    if (preprocessNode) {
      _koNodesForEach(first, cacheHolder,
        function (node) {
          preprocessNode.call(provider, node);
        }
      );

      // Get the new first node since a new node could have been inserted at the very top
      // eslint-disable-next-line no-param-reassign
      first = ko.virtualElements.firstChild(parentNode);
    }

    _koNodesForEach(first, cacheHolder,
      function (node) {
        ko.applyBindings(bindingContext, node);
      }
    );
  }

  /**
   * @ignore
   */
  function _insertNodes(container, nodes) {
    var nodeCount = nodes.length;
    for (var i = nodeCount - 1; i >= 0; i--) {
      ko.virtualElements.prepend(container, nodes[i]); // @HTMLUpdateOK nodes are the module view
    }
  }

  /**
   * @ignore
   */
  function _createAnimationContext(
    node, valueAccessor, isInitial, oldViewModel, newViewModel, isCustomElement
  ) {
    return {
      node: isCustomElement ? node.parentNode : node,
      valueAccessor: isCustomElement ? null : valueAccessor,
      isInitial: isInitial,
      oldViewModel: oldViewModel,
      newViewModel: newViewModel
    };
  }

  /**
   * @ignore
   */
  function _invokeOnSubtree(nodeArray, method) {
    if (method) {
      for (var i = 0; i < nodeArray.length; i++) {
        var node = nodeArray[i];
        if (node.nodeType === 1/* element*/) {
          method(node);
        }
      }
    }
  }

  /**
   * @ignore
   */
  function _getDomNodes(_content, resolveBusyState) {
    var content = _content;
    if (typeof content === 'string') {
      content = ko.utils.parseHtmlFragment(content, document);
    } else if (_isDocumentFragment(content)) {
      content = ko.utils.arrayPushAll([], content.childNodes);
    } else if (Array.isArray(content)) {
      content = ko.utils.arrayPushAll([], content);
    } else {
      resolveBusyState();
      throw new Error('The View (' + content + ') has an unsupported type');
    }
    return content;
  }

  /**
   * This method gets replaced by JET's Webpack plugin to implement dynamic module loading under Webpack.
   * @ignore
   */
  function _getOjModuleRequirePromise(_requireFunc, type, module) {
    // Note that the 'type' parameter is not used by the implementation below.
    // It is, however, used by the Webpack-specific implementation of this function.
    var requireFunc = _requireFunc || require;
    var p = new Promise(
      function (resolve, reject) {
        requireFunc([module], resolve, reject);
      }
    );

    p = p.catch(function (e) {
      Logger.error('ojModule failed to load ' + module);
      throw e;
    });

    return p;
  }

  /**
   * @ignore
   */
  function _createNoFailPromise(promise) {
    if (!promise) {
      return promise;
    }
    var noFail = new Promise(
      // eslint-disable-next-line no-unused-vars
      function (resolve, reject) {
        promise.then(
          resolve,
          resolve
        );
      }

    );
    return noFail;
  }

  /**
   * @ignore
   */
  function _checkForReusedView(element, nodes, model, isCustomElement, resolveBusyState) {
    //   - <oj-module> does not give any indication to the page author if the previously cleaned view is being reused
    // Throw an error if the view is being reused, else set a non-enumerable property for the next time check
    if (isCustomElement && nodes.length > 0 && !_isBindingApplied(nodes, model)) {
      if (nodes[0]._oj_module_used_view) {
        resolveBusyState();
        throw new Error('The oj-module with id \'' + element.id + '\' cannot apply binding on a previously cleaned view.');
      } else {
        Object.defineProperty(nodes[0], '_oj_module_used_view', { value: true });
      }
    }
  }
}());

/**
 * A duck-typing interface that defines optional ViewModel methods that the ojModule binding will invoke by convention
 * @interface
 * @ojtsignore
 * @ojtsnoexport
 * @ojtsmodule
 * @name ConventionMethods
 * @memberof oj.ModuleBinding
 * @ojtsimport knockout
 */

/**
 * This method may be implemented on the ViewModel to perform initialization tasks. The method will be invoked only
 * if the ViewModel factory or the AMD module returns a ViewModel instance (as opposed to a constructor function).
 * Note that this method will be invoked only once when the ViewModel is created, i.e. it will not be called when the
 * View is being brought from cache
 *
 * @method initialize
 * @instance
 * @param {Object} info  - an object with the following key-value pairs:
 * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
 * @param {Function} info.valueAccessor binding's value accessor
 * To retrieve the object passed as the 'params' option on the binding, use
 * <code>ko.utils.unwrapObservable(info.valueAccessor()).params</code> if the entire binding value is an observable or
 * <code>ko.utils.unwrapObservable(info.valueAccessor().params)</code> if the bidning value is a plain object literal.
 * @return {Object|undefined} - optional return value that will be used as the new ViewModel instance
 * @memberof oj.ModuleBinding.ConventionMethods
 */

/**
 * This method may be implemented by the ViewModel to perform cleanup tasks. Note that this method will be invoked only
 * once before all binding's refernces to the ViewModel are released.
 * @method dispose
 * @instance
 * @param {Object} info  - an object with the following key-value pairs:
 * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
 * @param {Function} info.valueAccessor binding's value accessor
 * @return {void}
 * @memberof oj.ModuleBinding.ConventionMethods
 */

/**
  * Optional ViewModel method invoked when this ViewModel is about to be used for the View transition
  * @method handleActivated
  * @instance
  * @param {Object} info  - an object with the following key-value pairs:
  * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
  * @param {Function} info.valueAccessor binding's value accessor
  * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
  * the promise is resolved
  * @memberof oj.ModuleBinding.ConventionMethods
  */

 /**
  * Optional ViewModel method invoked after the View is inserted into the document DOM
  * @method handleAttached
  * @instance
  * @param {Object} info  - an object with the following key-value pairs:
  * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
  * @param {Function} info.valueAccessor binding's value accessor
  * @param {boolean} info.fromCache - a boolean indicating whether the module was retrieved from cache
  * @return {void}
  * @memberof oj.ModuleBinding.ConventionMethods
  */

 /**
  * Optional ViewModel method invoked after the bidnings are applied on this View.
  * If the current View is retrieved from cache, the bindings will not be re-applied,
  * and this callback will not be invoked.
  * @method handleBindingsApplied
  * @instance
  * @param {Object} info  - an object with the following key-value pairs:
  * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
  * @param {Function} info.valueAccessor binding's value accessor
  * @return {void}
  * @memberof oj.ModuleBinding.ConventionMethods
  */

  /**
  * Optional ViewModel method invoked after transition to the new View is complete. That includes any possible animation
  * between the old and the new View
  * @method handleTransitionCompleted
  * @instance
  * @param {Object} info  - an object with the following key-value pairs:
  * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
  * @param {Function} info.valueAccessor binding's value accessor
  * @return {void}
  * @memberof oj.ModuleBinding.ConventionMethods
  */

 /**
  * Optional ViewModel method invoked after the View is removed from the document DOM
  * @method handleDetached
  * @instance
  * @param {Object} info  - an object with the following key-value pairs:
  * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
  * @param {Function} info.valueAccessor binding's value accessor
  * @param {Array} info.cachedNodes an Array containing cached nodes for the View (if the cache is enabled)
  * @return {void}
  * @memberof oj.ModuleBinding.ConventionMethods
  */

 /**
  * Optional ViewModel method invoked when the View/ViewModel combination becomes inactive
  * @method handleDeactivated
  * @instance
  * @param {Object} info  - an object with the following key-value pairs:
  * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
  * @param {Function} info.valueAccessor binding's value accessor
  * @return {void}
  * @memberof oj.ModuleBinding.ConventionMethods
  */

  /**
   * <p>ojModule binding for Knockout.js manages content replacement within a particular region of the page. The binding
   * can be used to implement navigation within a region of a single-page application.</p>
   *
   * <p>
   * <h2>Terminology</h2>
   * <ul>
   * <li>View - the HTML markup to be displayed within the page fragment. The markup can contain Knockout bindings, which
   * will be automatically activated after the View is attached to its container.</li>
   * <li>ViewModel - optional ViewModel that will be applied by Knockout to the View</li>
   * <li>Module - a combination of View and ViewModel</li>
   * </ul>
   * </p>
   *
   * <p>
   * <h2>Supported Features</h2>
   * <ul>
   * <li>ViewModel and View definitions loaded using require.js</li>
   * <li>Ability to provide a ViewModel by supplying a factory instance</li>
   * <li>View Caching</li>
   * <li>Ability for a ViewModel to create a View</li>
   * <li>Notifications about the lifecycle events (Module activation and deactivation, attaching and detaching DOM,
   * applying bindings)</li>
   * </ul>
   * </p>
   *
   * <p>
   * <h2>Examples</h2>
   * <pre class="prettyprint">
   * &lt;!-- Simple module binding with the currentCenter observable containing the name of the ViewModel,
   *      which is also used as the name of the View -->
   * &lt;div data-bind="ojModule: currentCenter">&lt;/div>
   *
   * &lt;!-- Module binding on the comment node -->
   * &lt;!-- ko data-bind="ojModule: currentCenter" -->&lt!-- /ko -->
   *
   * &lt;!-- Module binding with a LifecycleListener -->
   * &lt;div data-bind="ojModule: {name: currentCenter, lifecycleListener: moduleLifecycle}">&lt;/div>
   *
   * &lt;!-- Module binding with caching -->
   * &lt;div data-bind="ojModule: {name: currentName, cacheKey: currentName}">&lt;/div>
   *
   * &lt;!-- View-only module binding -->
   * &lt;div data-bind="ojModule: {viewName: currentName}">&lt;/div>
   * </pre>
   * </p>
   *
   * <p>
   * <h2>Conventions</h2>
   * <ul>
   * <li>ViewModel modules will have .js extension, and Views will have .html extension</li>
   * <li>ViewModel modules are expected to be found under the 'viewModels/' folder, and Views are expected to be found
   * under the 'views/' folder. Both viewModels and /views folders are expected to be in the 'base' RequireJs folder
   * (usually js/)</li>
   * <li>Optional 'initialize' and 'dispose' functions will be invoked on the ViewModel after it is created or before
   * it is destroyed respectively. See {@link oj.ModuleBinding.ConventionMethods ConventionMethods} for method definitions</li>
   * <li>Optional lifecycle event handlers can be implemented by the ViewModel as well.
   * See {@link oj.ModuleBinding.ConventionMethods  ConventionMethods} for method definitions</li>.
   * </ul>
   * For information to modifying the convention defaults see {@link oj.ModuleBinding}
   * </p>
   *
   * <p>
   * <h2>ViewModel's Lifecycle</h2>
   * The instance of the ViewModel is established as follows:
   * <ol>
   * <li>If the viewModelFactory is provided, the 'starter' object is determined by resolving a Promise returned
   * by the factory's createViewModel() method. Otherwise, the 'starter' object will be assigned the return value
   * of the AMD module specified by the 'name' option on the binding (if present)</li>
   * <li>If the 'starter' object is a function, it will be treated as a constructor that will be invoked to create the
   * ViewModel instance, and the 'params' object specified by the binding's 'params' option will be passed into the constructor
   * function as a parameter. Otherwise, the {@link oj.ModuleBinding.ConventionMethods#initialize initialize convention method}
   * will be invoked on the 'starter' instance. If the method does not return anything, the 'starter' object will be treated
   * as the ViewModel instance. Otherwise, the return value will become the ViewModel instance.</li>
   * </ol>
   * ViewModel's {@link oj.ModuleBinding.ConventionMethods#dispose dispose convention method} will be invoked before binding's
   * references to the ViewModel instance are released.
   * The following lifecycle listeners are supported on a ViewModel instance as convention methods:
   * <ul>
   * <li>{@link oj.ModuleBinding.ConventionMethods#handleActivated handleActivated}</li>
   * <li>{@link oj.ModuleBinding.ConventionMethods#handleDetached handleDetached}</li>
   * <li>{@link oj.ModuleBinding.ConventionMethods#handleDeactivated handleDeactivated}</li>
   * <li>{@link oj.ModuleBinding.ConventionMethods#handleAttached handleAttached}</li>
   * <li>{@link oj.ModuleBinding.ConventionMethods#handleBindingsApplied handleBindingsApplied}</li>
   * <li>{@link oj.ModuleBinding.ConventionMethods#handleTransitionCompleted handleTransitionCompleted}</li>
   * </ul>
   * </p>
   *
   * <p>
   * <h2>Acessing ViewModel Data</h2>
   * The instance of the ViewModel will be applied to the View, i.e. it will serve as View's default data object. The same
   * instance will also be available as $module within Knockout binding expressions (this may be useful for accessing
   * module's ViewModel in foreach iterators).
   * For the View-only modules, the default data object will be null. Parent ViewModel will be available as $parent.
   * </p>
   *
   * <p>
   * <h2>Avoiding Mutiple re-renders</h2>
   * This binding keeps track of changes to each of its options. If an observable holding an option value is mutated,
   * the view will be re-rendered. One of the following approaches may be used to avoid unnecessary re-renders:
   * <ul>
   * <li>Use a single observable to store the entire binding value with all attributes:
   * <p>
   * <pre class="prettyprint">
   * this.moduleValue = ko.observable({name: 'acc_details', cacheKey:'acc'});
   * ...
   * &lt;div data-bind="ojModule: moduleValue">&lt;/div>
   * </pre>
   * </p>
   * </li>
   * <li>Use the same observable for the name and cacheKey attributes:
   * <p>
   * <pre class="prettyprint">
   * this.moduleName = ko.observable('acc_details');
   * ...
   * &lt;div data-bind="ojModule: {name: moduleName, cacheKey: moduleName}}">&lt;/div>
   * </pre>
   * </p>
   * </li>
   * <li>Use rate-limiting for the observables referenced by the binding:
   * <p>
   * <pre class="prettyprint">
   * this.moduleName = ko.observable('acc_details').extend({ rateLimit: 1 });
   * this.cKey = ko.observable('acc').extend({ rateLimit: 1 });
   * this.vName = ko.observable('accView').extend({ rateLimit: 1 });
   * ...
   * &lt;div data-bind="ojModule: {name: moduleName, cacheKey: cKey, viewName: vName}}">&lt;/div>
   * ...
   * // Mutating multiple observables independently is OK when they use a rate limit extender
   * this.moduleName('preferences');
   * this.cKey('prefs');
   * this.vName('prefsView);
   * </pre>
   * </p>
   * </li>
   * </ul>
   * </p>
   *
   * <p>
   * <h2>Id Uniqueness for View Content</h2>ß
   * ojModule does not modify any HTML Ids specified within the Views. The application is responsible for avoiding Id
   * conflicts. Possible cases to consider are:
   * <ol>
   * <li>Conflicts with Ids used on the hosting page</li>
   * <li>Conflicts caused by multiple instances of the same View within the HTML document</li>
   * <li>Conflicts during animated View transitions (both Views are attached to the document for the duration of transition)</li>
   * <li>Conflicts with the cached View content when ojModule's 'cacheKey' option is set. ojModule currently keeps cached Views
   * in the hidden subtree within the same HTML document</li>
   * </ol>
   * All cases above except case (2) can be solved by adopting a convention-based prefix for each View. For example, all
   * Ids in the 'Accounts' View would start with 'ac_', all Ids in the 'Preferences' View would start with 'pr_', etc.
   * Case (2) would require the use of Ids that would dynamically bound at runtime. The application could pass a unique
   * Id prefix to each incarnation of the View using the 'params' option.
   * </p>
   *
   * <p>
   * <h2>Using ojModule with Require.js</h2>
   * Request <code>ojs/ojmodule</code> module before Knockout bindings are applied
   * </p>
   *
   * @namespace
   * @ojtsnoexport
   * @ojtsignore
   * @ojtsmodule
   * @name ojModule
   */

   /**
   * @name Options
   * @property {Promise|string|Array<Node>|DocumentFragment} view the View or a Promise for the View.
   * A value has to be a document fragment, an array of DOM nodes, or a string containing the HTML. This option takes
   * precedence over all other ways to load a View. Note that ojModule will not be cloning the document fragment or the node array provided
   * by the function before using it as the module's View and applying bindings to it. If the application needs to have access to the original
   * document fragment or node array, it should be setting the 'view' property to a cloned copy.
   * @property {Promise|Function|Object} viewModel the ViewModel(constrcutor or instance) or a Promise for the ViewModel.
   * This option takes precedence over all other ways to load a ViewModel
   * @property {string} name ViewModel name. The name will be
   * used to load an AMD module containing the definition of the ViewModel. If the module returns a function, it will be used
   * as a ViewModel constructor, and any other return value (including null) will be treated as a ViewModel instance.
   * If the entire binding's value is a string, it will be treated as a 'name' option. If the name is set to "oj:blank",
   * an empty View will be displayed, and no ViewModel will be loaded
   * If you need to create a view-only module, use the <code>viewName</code> option
   * @property {string} viewName View name. If omitted, the name of the View is assumed to be the same as the name of the
   * VewModel. If the name is set to "oj:blank", an empty View will be displayed, and no ViewModel will be loaded
   * @property {Function|{instance: Function, viewPath: string, modelPath: string}} require an instance of the require()
   * function to be used by this ojModule, or an object optionally defining the require instance, the View path prefix and
   * the ViewModel path prefix. It is recommended that the instance, the viewPath and the modelPath be defined if you are
   * using ojModule within a Composite component, and you are not passing the View and ViewModel instances to ojModule directly.
   * @property {Object} viewModelFactory instance of the factory that implements <code>createViewModel(params, valueAccessor)</code>
   * method. The method has to a return a Promise that will resolve to the ViewModel instance or constructor.
   * @property {Object} params object that will be passed into the ViewModel constructor or the
   * createViewModel method of the View Model factory as a parameter. The object will be available as $params within the View's
   * Knockout binding expressions.
   * @property {string} createViewFunction name of the ViewModel function used to create a View. If this parameter is
   * specified, the ViewModel will be responsible for providing the definition of the View. The function has to return
   * a Promise that will be resolved to document fragment, an array of DOM nodes, or a string containing the HTML. Note that ojModule will not
   * be cloning the document fragment or the node array provided by the function before using it as the module's View and applying bindings to it.
   * If the application needs to have access to the original document fragment or node array, it should be returning a cloned copy.
   * @property {string} cacheKey The key used to cache the View after it is no longer displayed. Setting this parameter will
   * enable View caching. When the View is about t be cached, its Knockout bindings will not be deactivated when
   * the View is removed from DOM tree. The cache will be discarded after when the window object is destroyed or
   * when the ojModule binding instance is deactivated. Since changes to any binding option will re-render the view,
   * it is very important that cacheKey and the rest of the options are applied atomically. Failure to do so will result in
   * a wrong cached view being retrieved. See the 'Avoiding Multiple Re-renders' section above.
   * @property {Object} lifecycleListener An instance of the object implementing one or more methods defined by the
   * {@link ojModule.LifecycleListener LifecycleListener} duck-typing interface.
   * @property {Object} animation instance of the {@link ojModule.ModuleAnimation ModuleAnimation} duck-typing interface that will
   * manage animation effects during View transitions.
   *
   * @instance
   * @memberof ojModule
   */

   /**
   * A duck-typing interface that defines methods for the ojModule binding's lifecycle listener.
   * Use 'lifecycleListener' option on the ojModule binding to set the listener.
   * @interface
   * @name LifecycleListener
   * @memberof ojModule
   * @ojtsignore
   */

   /**
    * Invoked when the binding starts loading a new View and ViewModel
    * @function activated
    * @param {Object} info  - an object with the following key-value pairs:
    * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
    * @param {Function} info.valueAccessor binding's value accessor
    * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
    * the promise is resolved
    * @memberof ojModule.LifecycleListener
    * @instance
    */


   /**
    * Invoked after the View is inserted into the document DOM
    * @method attached
    * @param {Object} info  - an object with the following key-value pairs:
    * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
    * @param {Function} info.valueAccessor binding's value accessor
    * @param {Object} info.viewModel ViewModel for the View being attached
    * @param {boolean} info.fromCache a boolean indicating the view was retrieved from cache
    * @return {void}
    * @memberof ojModule.LifecycleListener
    * @instance
    */

   /**
    * Invoked after the bidnings for the new View are applied.
    * If the current View is retrieved from cache, the bindings will not be re-applied, and this callback will not be invoked.
    * @method bindingsApplied
    * @param {Object} info  - an object with the following key-value pairs:
    * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
    * @param {Function} info.valueAccessor binding's value accessor
    * @param {Object} info.viewMode ViewModel for the new View
    * @return {void}
    * @memberof ojModule.LifecycleListener
    * @instance
    */

   /**
    * Invoked after transition to the new View is complete. That includes any possible animation
    * between the old and the new View
    * @method transitionCompleted
    * @param {Object} info  - an object with the following key-value pairs:
    * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
    * @param {Function} info.valueAccessor binding's value accessor
    * @param {Object} info.viewMode ViewModel for the new View
    * @return {void}
    * @memberof ojModule.LifecycleListener
    * @instance
    */


   /**
    * Invoked after the View is removed from the document DOM
    * @method detached
    * @param {Object} info  - an object with the following key-value pairs:
    * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
    * @param {Function} info.valueAccessor binding's value accessor
    * @param {Object} info.viewModel ViewModel for the View being attached
    * @param {Array} info.cachedNodes an Array containing cached nodes for the View (if the cache is enabled)
    * @return {void}
    * @memberof ojModule.LifecycleListener
    * @instance
    */

   /**
    * Invoked when the View/ViewModel combination becomes inactive
    * @method deactivated
    * @param {Object} info  - an object with the following key-value pairs:
    * @param {Node} info.element DOM element or where the binding is attached. This may be a 'virtual' element (comment node)
    * @param {Function} info.valueAccessor binding's value accessor
    * @param {Object} info.viewModel ViewModel for the View being attached
    * @return {void}
    * @memberof ojModule.LifecycleListener
    * @instance
    */

  /**
   * A duck-typing interface that defines a contract for managing animations during ojModule View transitions.
   * Use 'animation' option on the ojModule binding to set ModuleAnimation instance.
   * @interface
   * @name ModuleAnimation
   * @memberof ojModule
   * @ojtsignore
   */

   /**
   * Optional method that determines whether the animated transition should proceed. If the method is not implemented, all
   * transitions will be allowed to proceed
   * @function canAnimate
   *
   * @param {Object} context a context object with the keys detailed below
   * @param {Node} context.node a DOM node where the ojModule binding is attached. This may be a virtual/comment node
   * @param {Function} context.valueAccessor value accessor for the binding
   * @param {boolean} context.isInitial true if the initial View is about to be displayed, false otherwise
   * @param {Object} context.oldViewModel the instance of the ViewModel for the old View
   * @param {Object} context.newViewModel the instance of the ViewModel for the new View
   *
   * @return {boolean} true if animation should proceed, false otherwise
   * @memberof ojModule.ModuleAnimation
   * @instance
   */

   /**
   * Prepares animation by designating where the new View should be inserted and optionally specifying where the old View
   * should be moved
   * @function prepareAnimation
   *
   * @param {Object} context a context object with the keys detailed below
   * @param {Node} context.node a DOM node where the ojModule binding is attached. This may be a virtual/comment node
   * @param {Function} context.valueAccessor value accessor for the binding
   * @param {boolean} context.isInitial true if the initial View is about to be displayed, false otherwise
   * @param {Object} context.oldViewModel the instance of the ViewModel for the old View
   * @param {Object} context.newViewModel the instance of the ViewModel for the new View
   *
   * @return {?Object} an object that may contain values for the following keys:
   * <ul>
   * <li>'newViewParent' - a DOM node where the new View should be inserted. If this parameter is not specified, the new View
   * will be inserted into the node associated with the ojModule binding</li>
   * <li>'oldViewParent' - a DOM node where the old View should be moved. If this parameter is not specified, the old View
   * will not be moved</li>
   * </ul>
   * @memberof ojModule.ModuleAnimation
   * @instance
   */

   /**
   * Prepares animation by designating where the new View should be inserted and optionally specifying where the old View
   * should be moved
   * @function animate
   *
   * @param {Object} context a context object with the keys detailed below
   * @param {Node} context.node a DOM node where the ojModule binding is attached. This may be a virtual/comment node
   * @param {Function} context.valueAccessor value accessor for the binding
   * @param {boolean} context.isInitial true if the initial View is about to be displayed, false otherwise
   * @param {Object} context.oldViewModel the instance of the ViewModel for the old View
   * @param {Object} context.newViewModel the instance of the ViewModel for the new View
   * @param {Node} context.newViewParent the 'newViewParent' parameter returned by the prepareAnimation() method
   * @param {Node} context.oldViewParent the 'oldViewParent' parameter returned by the prepareAnimation() method
   * @param {Function} context.removeOldView calling this function will remove the DOM nodes representing the old View. If this
   * function is not invoked by the ModuleAnimation implementation, and the old View is still connected when the Promise is
   * resolved, the old View will be removed by ojModule.
   * @param {Function} context.insertNewView calling this function will insert new View's DOM nodes into the location
   * managed by the ojModule. If this function is not invoked by the ModuleAnimation implementation, and the new View is not at
   * its intended location when the Promise is resolved, the View will be moved by ojModule.
   * @param {Array} context.oldDomNodes an array of DOM nodes representing the old View
   * @return {Promise} - a Promise that should be resolved when the animation, moving/removing of DOM nodes and the
   * cleanup are complete. Note that ojModule will not be able to navigate to a new View until the Promise is resolved.
   *
   * @memberof ojModule.ModuleAnimation
   * @instance
   */


  ;return oj.ModuleBinding;
});