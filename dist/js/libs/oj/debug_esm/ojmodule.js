/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { bindingHandlers, utils, virtualElements, computed, ignoreDependencies, cleanNode, contextFor, bindingProvider, applyBindings } from 'knockout';
import { error } from 'ojs/ojlogger';
import Context from 'ojs/ojcontext';

/**
 * ojModule Conventions
 * @namespace
 * @ojtsmodule
 * @ojtsignore
 * @since 1.1
 * @ojdeprecated {since: '9.0.0', description: 'Replace ModuleBinding and ojModule with oj-module element.'}
 */
const ModuleBinding = {};
// Define a mapping variable that maps the return value of the module to the name used in the callback function of a require call.
// eslint-disable-next-line no-unused-vars
oj._registerLegacyNamespaceProp('ModuleBinding', ModuleBinding);

/**
 * Default configuration values
 * ojModule binding's conventions may be overridden for the entire application after the ojs/ojmodule
 * module is loaded. For example:
 * <p><code class="prettyprint">
 * ModuleBinding.defaults.modelPath = 'models/';
 * </code></p>
 * Note that the default names of the {@link ModuleBinding.ConventionMethods optional lifecycle methods}
 * on the ViewModel are different from their counterparts on the {@link ojModule.LifecycleListener LifecycleListener}
 * interface
 * @property {string} viewPath default View path. Defaults to 'text!views/'
 * @property {string} viewSuffix default View suffix. Defaults to '.html'
 * @property {string} modelPath default Model suffix. Defaults to 'viewModels/'
 * @property {string} initializeMethod name of the initialialization method
 * (see {@link ModuleBinding.ConventionMethods#initialize definition})
 * @property {string} disposeMethod name of the dispose method
 * (see {@link ModuleBinding.ConventionMethods#dispose definition})
 * @property {string} activatedHandler name of the 'activated' event handler
 * (see {@link ModuleBinding.ConventionMethods#handleActivated definition})
 * @property {string} attachedHandler name of the 'attached' event handler
 * (see {@link ModuleBinding.ConventionMethods#handleAttached definition})
 * @property {string} detachedHandler name of the 'detached' event handler
 * (see {@link ModuleBinding.ConventionMethods#handleDetached definition})
 * @property {string} bindingsAppliedHandler name of the 'bindingsApplied' event handler
 * (see {@link ModuleBinding.ConventionMethods#handleBindingsApplied definition})
 * @property {string} deactivatedHandler name of the 'deactivated' event handler
 * (see {@link ModuleBinding.ConventionMethods#handleDeactivated definition})
 * @property {string} transitionCompletedHandler name of the 'transitionCompleted' event handler
 * (see {@link ModuleBinding.ConventionMethods#handleTransitionCompleted definition})
 * @export
 * @memberof ModuleBinding
 */
ModuleBinding.defaults = {
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
ModuleBinding._EMPTY_MODULE = 'oj:blank';

(function () {
  bindingHandlers.ojModule = {
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

      utils.domNodeDisposal.addDisposeCallback(element, nodeDispose);

      var _IGNORE_PROMISE = new Error(
        'Promise cancelled because ojModule is fetching new View and ViewModel'
      );

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
          virtualElements.prepend(element, cacheHolder); // @HTMLUpdateOK cacheHolder is constructed above
        }
      };

      var contextElement = element;

      if (element.nodeType === 8) {
        // comment
        contextElement = element.parentNode;
        virtualElements.setDomNodeChildren(element, []); // remove all child nodes of the virtual element
        endCommentNode = element.nextSibling;
      }

      computed(
        function () {
          pendingViewId += 1;

          if (!busyStateResolver) {
            var busyContext = Context.getContext(contextElement).getBusyContext();
            busyStateResolver = busyContext.addBusyState({
              description:
                'ojModule binding on a node with the Id ' +
                element.id +
                'is loading the module. Binding evaluator: ' +
                valueAccessor.toString()
            });
          }

          var isInitial = pendingViewId === 0;

          var unwrap = utils.unwrapObservable;
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

          var empty = ModuleBinding._EMPTY_MODULE === viewName;

          var attachPromise = legacyLifecycleListenerFunc(lifecycleListener, 'activated', [
            element,
            valueAccessor
          ]);
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
              modelPromise = ignoreDependencies(modelFactory.createViewModel, modelFactory, [
                params,
                valueAccessor
              ]);
            }

            if (modelPromise == null && moduleName != null) {
              if (modelPath == null) {
                modelPath = ModuleBinding.defaults.modelPath;
              }
              modelPromise = _getOjModuleRequirePromise(
                requireFunc,
                'viewModel',
                modelPath + moduleName
              );
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
                    viewModel =
                      legacyViewModelMethodFunc(viewModel, 'initializeMethod', [
                        element,
                        valueAccessor
                      ]) || viewModel;
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
                      throw new Error(
                        'createViewFunction option cannot be used when the ViewModel is null'
                      );
                    }

                    var viewMethod = model[viewFunction];

                    if (viewMethod == null) {
                      resolveBusyState();
                      throw new Error(
                        'function specified by the createViewFunction option was not found on the ViewModel'
                      );
                    }

                    return viewMethod.call(model);
                  }.bind(null, pendingViewId)
                );
              }
            }
            if (viewPromise == null) {
              if (viewName != null) {
                if (viewPath == null) {
                  viewPath = ModuleBinding.defaults.viewPath;
                }
                viewPromise = _getOjModuleRequirePromise(
                  requireFunc,
                  'view',
                  viewPath + viewName + ModuleBinding.defaults.viewSuffix
                );
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
                return legacyViewModelMethodFunc(viewModel, 'activatedHandler', [
                  element,
                  valueAccessor
                ]);
              }.bind(null, pendingViewId)
            );
          }

          // We will ahve to wait for any module animation that has already started. Allowing a new View to be loaded while
          // animation is in progress would potentially leave the DOM in
          var masterPromise = Promise.all([
            viewPromise,
            modelPromise,
            attachPromise,
            modelAttachPromise,
            currentAnimationPromise
          ]);

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
              } else if (isCustomElement) {
                // need view nodes for the event payload
                cachedNodeArray = oldDomNodes;
              }

              var oldNodesRemoved = false;

              var removeOldDomNodes = function (oldViewParent) {
                if (oldNodesRemoved) {
                  return;
                }

                oldNodesRemoved = true;

                if (saveInCache) {
                  // legacy cache case - move the node into cacheHolder, then detach
                  // Keep the cached nodes connected as a workaround for the Knockout removing observable subscriptions when
                  // they fire on disconnected nodes
                  _moveDomNodes(oldDomNodes, cacheHolder);
                  _detachOldView(element, oldViewParent || element, cacheHolder);
                } else if (isCustomElement && currentCleanupMode === 'none') {
                  // external cache case
                  // detach from DOM by simply removing to preserve applied binding on the nodes
                  for (var i = 0; i < cachedNodeArray.length; i++) {
                    var cachedNode = cachedNodeArray[i];
                    cachedNode.parentNode.removeChild(cachedNode);
                  }
                } else {
                  // cache is not involved - clean up and detach
                  oldKoNodes.forEach(function (n) {
                    cleanNode(n);
                  });
                  _detachOldView(element, oldViewParent || element, cacheHolder);
                }

                if (!isInitial) {
                  // ensure that this is not the very first view displayed by the binding
                  legacyLifecycleListenerFunc(lifecycleListener, 'detached', [
                    element,
                    valueAccessor,
                    currentViewModel,
                    cachedNodeArray
                  ]);
                  legacyViewModelMethodFunc(currentViewModel, 'detachedHandler', [
                    element,
                    valueAccessor,
                    cachedNodeArray
                  ]);
                  viewModelMethodFunc(currentViewModel, 'disconnected', cachedNodeArray);
                  dispatchLifecycleEventFunc(contextElement, 'ojViewDisconnected', [
                    currentViewModel,
                    cachedNodeArray
                  ]);

                  legacyLifecycleListenerFunc(lifecycleListener, 'deactivated', [
                    element,
                    valueAccessor,
                    currentViewModel
                  ]);
                  legacyViewModelMethodFunc(currentViewModel, 'deactivatedHandler', [
                    element,
                    valueAccessor
                  ]);
                }

                if (saveInCache) {
                  // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
                  _invokeOnSubtree(
                    cachedNodeArray,
                    oj.Components ? oj.Components.subtreeHidden : null
                  );
                  cache[currentCacheKey] = { model: currentViewModel, view: cachedNodeArray };
                } else if (isCustomElement && currentCleanupMode === 'none') {
                  _invokeOnSubtree(
                    cachedNodeArray,
                    oj.Components ? oj.Components.subtreeDetached : null
                  );
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

                legacyLifecycleListenerFunc(lifecycleListener, 'attached', [
                  targetElement,
                  valueAccessor,
                  model,
                  fromCache
                ]);
                legacyViewModelMethodFunc(model, 'attachedHandler', [
                  targetElement,
                  valueAccessor,
                  fromCache
                ]);
                viewModelMethodFunc(model, 'connected', nodes);
                dispatchLifecycleEventFunc(contextElement, 'ojViewConnected', [model]);

                if (!fromCache && !bindingApplied) {
                  var childBindingContext = bindingContext.createChildContext(
                    model,
                    undefined,
                    function (ctx) {
                      ctx.$module = model;
                      ctx.$params = params;
                    }
                  );

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
                    childBindingContext.$provided = undefined;
                  }

                  _applyBindingsToNodes(targetElement, nodes[0], childBindingContext, cacheHolder);

                  legacyLifecycleListenerFunc(lifecycleListener, 'bindingsApplied', [
                    targetElement,
                    valueAccessor,
                    model
                  ]);
                  legacyViewModelMethodFunc(model, 'bindingsAppliedHandler', [
                    targetElement,
                    valueAccessor
                  ]);
                }
              }

              var transitionComplete = function () {
                legacyLifecycleListenerFunc(lifecycleListener, 'transitionCompleted', [
                  element,
                  valueAccessor,
                  model
                ]);
                legacyViewModelMethodFunc(model, 'transitionCompletedHandler', [
                  element,
                  valueAccessor
                ]);
                viewModelMethodFunc(model, 'transitionCompleted', nodes);
                dispatchLifecycleEventFunc(contextElement, 'ojTransitionEnd', [model]);
                resolveBusyState();
              };

              if (animation != null) {
                var actx = _createAnimationContext(
                  element,
                  valueAccessor,
                  isInitial,
                  currentViewModel,
                  model,
                  isCustomElement
                );
                var promise = _animate(
                  actx,
                  animation,
                  element,
                  oldDomNodes,
                  insertAndActivateNewNodes,
                  removeOldDomNodes,
                  transitionComplete
                );
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

                error(reason);
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
  virtualElements.allowedBindings.ojModule = true;

  /**
   * @ignore
   */
  function _animate(
    _actx,
    animation,
    element,
    oldDomNodes,
    insertAndActivateFunc,
    removeOldDomNodes,
    transitionComplete
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
      virtualElements.setDomNodeChildren(targetElement, []);
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

        var isCustomElement = element.parentNode && element.parentNode.nodeName === 'OJ-MODULE'; // custom element check
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
      function () {
        // failure
        postAnimation();
        error('ojModule animation promise was rejected');
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
    virtualElements.setDomNodeChildren(oldViewParent, empty);
  }

  /**
   * @ignore
   */
  function _moveDomNodes(nodes, target) {
    nodes.forEach(function (n) {
      target.appendChild(n); // @HTMLUpdateOK child nodes are module view
    });
  }

  /**
   * @ignore
   */
  function _isBindingApplied(nodes, model) {
    var bindingContext;
    for (var i = 0; i < nodes.length; i++) {
      bindingContext = contextFor(nodes[i]);
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
      var ret = ignoreDependencies(listener[method], listener, [data]);
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
    var name = ModuleBinding.defaults[key];
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
        var ret = ignoreDependencies(handler, model, [data]);
        return ret;
      }
    }
    return undefined;
  }

  /**
   * @ignore
   * @param {?Object} model
   * @param {string} name
   * @param {Array} params
   */
  function _invokeViewModelMethodOnElement(model, name, params) {
    if (model && name) {
      var handler = model[name];
      if (typeof handler === 'function') {
        // suspend dependency detection while listeners are invoked
        ignoreDependencies(handler, model, [params]);
      }
    }
  }

  /**
   * @ignore
   */
  function _getContainedNodes(container, cacheHolder, endCommentNode) {
    var childList = [];
    var firstChild = virtualElements.firstChild(container);

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
    var firstChild = virtualElements.firstChild(container);

    _koNodesForEach(firstChild, cacheHolder, function (node) {
      nodes.push(node);
    });

    return nodes;
  }

  /**
   * @ignore
   */
  function _koNodesForEach(first, cacheHolder, callback) {
    var node = first;
    while (node != null) {
      var next = virtualElements.nextSibling(node);
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
    var provider = bindingProvider.instance;
    var preprocessNode = provider.preprocessNode;

    if (preprocessNode) {
      _koNodesForEach(first, cacheHolder, function (node) {
        preprocessNode.call(provider, node);
      });

      // Get the new first node since a new node could have been inserted at the very top
      // eslint-disable-next-line no-param-reassign
      first = virtualElements.firstChild(parentNode);
    }

    _koNodesForEach(first, cacheHolder, function (node) {
      applyBindings(bindingContext, node);
    });
  }

  /**
   * @ignore
   */
  function _insertNodes(container, nodes) {
    var nodeCount = nodes.length;
    for (var i = nodeCount - 1; i >= 0; i--) {
      virtualElements.prepend(container, nodes[i]); // @HTMLUpdateOK nodes are the module view
    }
  }

  /**
   * @ignore
   */
  function _createAnimationContext(
    node,
    valueAccessor,
    isInitial,
    oldViewModel,
    newViewModel,
    isCustomElement
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
        if (node.nodeType === 1 /* element*/) {
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
      content = utils.parseHtmlFragment(content, document);
    } else if (_isDocumentFragment(content)) {
      content = utils.arrayPushAll([], content.childNodes);
    } else if (Array.isArray(content)) {
      content = utils.arrayPushAll([], content);
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
    var p = new Promise(function (resolve, reject) {
      requireFunc([module], resolve, reject);
    });

    p = p.catch(function (e) {
      error('ojModule failed to load ' + module);
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
        promise.then(resolve, resolve);
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
        throw new Error(
          "The oj-module with id '" +
            element.id +
            "' cannot apply binding on a previously cleaned view."
        );
      } else {
        Object.defineProperty(nodes[0], '_oj_module_used_view', { value: true });
      }
    }
  }
})();

export default ModuleBinding;
