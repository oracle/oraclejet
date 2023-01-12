/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'knockout', 'ojs/ojconfig', 'ojs/ojlogger', 'ojs/ojhtmlutils'], function (oj, ko, Config, Logger, HtmlUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  /**
   * @private
   * @constructor
   * Global Change Queue Implementation
   * The queue is used to delay component updates until all model changes have been propagated
   * This is a private class that does not need to be xported
   */
  const GlobalChangeQueue = function () {
    this.Init();
  };

  // Subclass from oj.Object
  oj.Object.createSubclass(GlobalChangeQueue, oj.Object, 'ComponentBinding.GlobalChangeQueue');

  GlobalChangeQueue.prototype.Init = function () {
    GlobalChangeQueue.superclass.Init.call(this);
    this._trackers = [];
    this._queue = [];
  };

  GlobalChangeQueue.prototype.registerComponentChanges = function (tracker) {
    if (this._trackers.indexOf(tracker) === -1) {
      this._trackers.push(tracker);
      if (!this._delayTimer) {
        this._delayTimer = setTimeout(oj.Object.createCallback(this, this._deliverChangesImpl), 1); // @HTMLUpdateOK delaying our own callback
        this._delayPromise = new Promise(
          function (resolve) {
            this._delayPromiseResolver = resolve;
          }.bind(this)
        );
      }
    }
  };

  GlobalChangeQueue.prototype.deliverChanges = function () {
    if (this._delayTimer) {
      clearTimeout(this._delayTimer);
    }
    this._deliverChangesImpl();
  };

  GlobalChangeQueue.prototype.getThrottlePromise = function () {
    return this._delayPromise || Promise.resolve();
  };

  GlobalChangeQueue.prototype._deliverChangesImpl = function () {
    this._delayTimer = null;
    this._resolveDelayPromise();
    var trackers = this._trackers;
    this._trackers = [];

    for (var i = 0; i < trackers.length; i++) {
      var tracker = trackers[i];
      this._queue.push({ tracker: tracker, changes: tracker.flushChanges() });
    }

    while (this._queue.length > 0) {
      var record = this._queue.shift();
      record.tracker.applyChanges(record.changes);
    }
  };

  GlobalChangeQueue.prototype._resolveDelayPromise = function () {
    if (this._delayPromise) {
      this._delayPromiseResolver();
      this._delayPromiseResolver = null;
      this._delayPromise = null;
    }
  };

  /**
   * @ignore
   * @constructor
   */
  function _KoCustomBindingProvider() {
    var _evaluatorCacheMap = new WeakMap();
    var _postprocessors = {};
    var _preprocessors = {};
    var _KoBindingCache = {};

    var _OJ_EXTENDED = '_ojExtended';
    var _OJ_CACHE_SCOPE = '_ojCacheScope';

    var _changeQueue = new GlobalChangeQueue();

    this.install = function () {
      var provider = ko.bindingProvider;
      var instanceName = 'instance';
      var wrapped = provider[instanceName];

      var getAccessors = 'getBindingAccessors';
      if (!wrapped[getAccessors]) {
        Logger.error(
          "JET's Knockout bindings are not compatible with the current binding " +
            'provider since it does not implement getBindingAccessors()'
        );
        return this;
      }

      var custom = {
        getWrapped: function () {
          return wrapped;
        }
      };
      provider[instanceName] = custom;

      var methodsToWrap = [];
      methodsToWrap.push(getAccessors, 'nodeHasBindings', 'getBindings');

      methodsToWrap.forEach(function (name) {
        custom[name] = _wrap(wrapped, name, function (n, original) {
          // _wrap() will be producing a function that always calls the 'wrapped'/original method first
          // to handle the binding postprocessor case.
          // Hovewer, for cases when the binding context has been created with  .extendBindingContext(),
          // we are replacing the binding evaluaror completely, and we do not need to call the original
          // getAccessors() method. _preWrapGetAccessors() will 'pre-wrap'/replace getAccessors() for that case,
          // so _wrap() will be wrapping the replaced method, and we will not be creating an evaluator in the original
          // getAccessors() method just to throw it away
          if (n !== getAccessors) {
            return original;
          }
          return _preWrapGetAccessors(original, wrapped);
        });
      });
      custom.preprocessNode = _wrapPreprocessNode(wrapped);

      _patchKoRenderTemplateSource();
      _patchKoTemplateSourceDomElement();
      _patchKoComponentsLoaders();
      _patchKoEvaluatorForCSP(_KoBindingCache);

      return this;
    };

    this.addPostprocessor = function (postprocessor) {
      var keys = Object.keys(postprocessor);
      keys.forEach(function (key) {
        _postprocessors[key] = _postprocessors[key] || [];
        _postprocessors[key].push(postprocessor[key]);
      });
    };

    this.registerPreprocessor = function (tagName, preprocessor) {
      _preprocessors[tagName] = preprocessor;
    };

    this.getBindingsString = function (node, wrapped, bindingContext) {
      return _getBindingsString(node, wrapped, bindingContext);
    };

    this.extendBindingContext = function (context, current, alias, templateAlias, cacheKey) {
      var extension = {
        $current: current,
        $root: undefined,
        $parent: undefined,
        $parents: undefined
      };

      if (alias) {
        extension[alias] = current;
      }
      if (templateAlias) {
        extension[templateAlias] = current;
      }
      if (context) {
        extension = context.extend(extension);
      } else {
        extension.$data = {}; // ensure that KO evaluator does not blow up when $context has no $data property
      }

      Object.defineProperty(extension, _OJ_CACHE_SCOPE, { value: cacheKey });
      Object.defineProperty(extension, _OJ_EXTENDED, { value: true });

      return extension;
    };

    this.createBindingExpressionEvaluator = function (expressionText, bindingContext) {
      if (bindingContext[_OJ_EXTENDED]) {
        return _createReplacementEvaluatorForExtend(expressionText);
      }
      var factory = Config.getExpressionEvaluator();
      if (factory) {
        var evaluate = factory.createEvaluator(expressionText).evaluate;
        return function ($context) {
          return evaluate([$context.$data || {}, $context]);
        };
      }

      var evaluator;
      try {
        /* jslint evil:true */
        // eslint-disable-next-line no-new-func
        evaluator = new Function( // @HTMLUpdateOK
          '$context',
          'with($context){with($data||{}){return ' + expressionText + ';}}'
        ); // binding expression evaluation
      } catch (e) {
        throw new Error(e.message + ' in expression "' + expressionText + '"');
      }
      return evaluator;
    };

    this.createEvaluator = function (expression, bindingContext) {
      return _createEvaluatorViaCache(
        this.createBindingExpressionEvaluator,
        expression,
        bindingContext
      );
    };

    this.getGlobalChangeQueue = function () {
      return _changeQueue;
    };

    function _wrap(wrapped, name, prewrap) {
      var isHasBindings = name === 'nodeHasBindings';

      return function (arg0) {
        if (isHasBindings) {
          var type = arg0.nodeType;
          if (type !== 1 && type !== 8) {
            return false;
          }
        }
        var delegate = prewrap(name, wrapped[name]);

        var ret = delegate ? delegate.apply(wrapped, arguments) : null;
        var postprocessHandlers = _postprocessors[name];

        if (postprocessHandlers != null) {
          var originalArgs = arguments;
          postprocessHandlers.forEach(function (handler) {
            var args = Array.prototype.slice.call(originalArgs);
            args.push(ret, wrapped);
            // Ignore dependencies here so that bindings don't get triggered due to contained evaluations
            ret = ko.ignoreDependencies(handler, null, args);
          });
        }
        return ret;
      };
    }

    function _wrapPreprocessNode(wrapped) {
      var originalPreprocessor = wrapped.preprocessNode;
      return function (node) {
        var preprocessor;
        var ret;
        var obj = null;
        if (node.nodeType === 1) {
          preprocessor = _preprocessors[node.nodeName.toLowerCase()];
        }
        if (!preprocessor) {
          preprocessor = originalPreprocessor;
          obj = wrapped;
        }
        if (preprocessor) {
          ret = ko.ignoreDependencies(preprocessor, obj, [node]);
        }
        if (Array.isArray(ret)) {
          ret = _preprocessNewNodes(node, ret);
        }
        return ret;
      };
    }

    function _preprocessNewNodes(originalNode, newNodes) {
      var provider = ko.bindingProvider.instance;
      var ret = newNodes.slice(0);
      var current = newNodes[0];
      var currentIndex = 0;
      var i = 0;

      while (currentIndex >= 0) {
        // get the next current element before preprocessing replaces current
        var next = ko.virtualElements.nextSibling(current);
        if (current !== originalNode) {
          var insertedNodes = provider.preprocessNode(current);
          if (Array.isArray(insertedNodes)) {
            // insert the nodes instead of the item at the index i
            ret.splice.apply(ret, [i, 1].concat(insertedNodes));
            // jump over the inserted nodes (-1 represents one node being replaced)
            i += insertedNodes.length - 1;
          }
        }
        current = next;
        i += 1;
        var nextIndex = currentIndex + 1;
        currentIndex = current ? newNodes.indexOf(current, nextIndex) : -1;
        // figure out how many virtual children we need to skip (they will be preprocessed after their container is entered)
        i += currentIndex - nextIndex; // this value is irrelevent if currentIndex is negative
      }

      return ret;
    }

    // Patches renderTemplateSource() to ensure that the template is parsed with the current document.
    // Otherwise, the custom elements are not being upgraded synchronously.
    // This method addresses an issue when JET components are defined inside of a <script> element.
    function _patchKoRenderTemplateSource() {
      var proto = ko.nativeTemplateEngine.prototype;
      var method = 'renderTemplateSource';
      var delegate = proto[method];

      proto[method] = function (templateSource, bindingContext, options, templateDocument) {
        return delegate.call(
          this,
          templateSource,
          bindingContext,
          options,
          templateDocument || document /* use current document if none is provided*/
        );
      };
    }

    // Patches ko.templateSources.domElement.nodes() method to ensure that custom elements are upgraded synchronously.
    // This method addresses an issue when JET components are defined inside of an external <template> element.
    function _patchKoTemplateSourceDomElement() {
      const proto = ko.templateSources.domElement.prototype;
      const method = 'nodes';
      const delegate = proto[method];

      proto[method] = function () {
        const nodes = delegate.apply(this, arguments);
        return nodes && nodes.nodeType === 11 ? document.importNode(nodes, true) : nodes;
      };
    }

    // This method adds custom KO component loader that overrides defaultLoader.loadTemplate().
    // This is done to ensure that the template is parsed with the current document in order
    // to upgrade custom elements synchronously
    // The custom loader takes precedence over the default loader.
    // This method addresses an issue when a knockout native component is used as a part of a JET component,
    // e.g. when items for oj-list-view contain a KO registered component.
    function _patchKoComponentsLoaders() {
      ko.components.loaders.unshift({
        loadTemplate: function (name, templateConfig, callback) {
          var nodes;
          if (typeof templateConfig === 'string') {
            nodes = ko.utils.parseHtmlFragment(templateConfig, document);
          } else if (templateConfig.element) {
            var element = templateConfig.element;
            if (element instanceof HTMLElement) {
              nodes = HtmlUtils.getTemplateContent(element);
            } else if (typeof element === 'string') {
              var template = document.getElementById(element);
              if (!template) {
                throw new Error(`Cannot find element with ID ${element}`);
              }
              nodes = HtmlUtils.getTemplateContent(template);
            } else {
              throw new Error(`Unknown element type: ${element}`);
            }
          }

          if (nodes) {
            ko.components.defaultLoader.loadTemplate(name, nodes, callback);
          } else {
            // Config type is not a string or an object. Let default loader handle it.
            callback(null);
          }
        }
      });
    }

    function _preWrapGetAccessors(original, wrappedProvider) {
      return function (node, bindingContext) {
        if (bindingContext[_OJ_EXTENDED]) {
          var bindingsString = _getBindingsString(node, wrappedProvider, bindingContext);
          // _createExtendAccessorsViaCache() returns a function that will produce a map of binding accessors.
          // Note that this function is immediately invoked with the bindingcontext and node as parameters.
          // That will pre-bind binding accessors to the values of $context and $element
          var accessors = bindingsString
            ? _createExtendAccessorsViaCache(bindingsString, bindingContext)(bindingContext, node)
            : null;

          // Check whether a node is a KO component. We will be using the default evaluator
          // to initialize component binding, while our own evaluator will be handling the
          // rest of the bindings specified with data-bind.
          // This means that in the inlikely case when a KO component is used in an inline
          // template or the oj-bind-foreach, the properties of component will be subject to a
          // possible collision between an aliased data object and a ViewModel property (avery unlikely scenario)
          if (node.nodeType === 1 && ko.components.isRegistered(node.tagName.toLowerCase())) {
            var originalAccessors = original.call(wrappedProvider, node, bindingContext);
            var componentEval = originalAccessors.component;
            if (componentEval) {
              // copy the component binding accessor from the original accessor map
              accessors = accessors || {};
              accessors.component = componentEval;
            }
          }
          return accessors;
        }
        return original.call(wrappedProvider, node, bindingContext);
      };
    }

    function _createExtendAccessorsViaCache(bindingsString, bindingContext) {
      var factory = function (expr) {
        // .preProcessBindings() will produce a string that defines a Function retrurning a map
        // with each key being the bidning name, and each value being an evalutor function for
        // binding value
        var rewrittenBindings = ko.expressionRewriting.preProcessBindings(expr, {
          valueAccessors: true
        });
        return _createReplacementEvaluatorForExtend('{' + rewrittenBindings + '}');
      };

      return _createEvaluatorViaCache(factory, bindingsString, bindingContext);
    }

    function _createReplacementEvaluatorForExtend(expressionText) {
      // Note that the priority order of the binding context and the ViewModel are reversed
      // in this evaluator. This is needed for allowing properties supplied in bindsingProvider.extend()
      // to obscure properties in the ViewModel, which is the behavior one would expect when .extend()
      // is used
      var factory = Config.getExpressionEvaluator();
      if (factory) {
        var evaluate = factory.createEvaluator(expressionText).evaluate;
        return function ($context, $element) {
          return evaluate([$context, $context.$data || {}, { $element: $element }]);
        };
      }

      var evaluator;
      try {
        /* jslint evil:true */
        // eslint-disable-next-line no-new-func
        evaluator = new Function( // @HTMLUpdateOK
          '$context',
          '$element',
          'with($context.$data||{}){with($context){return ' + expressionText + '}}'
        ); // binding expression evaluation
      } catch (e) {
        throw new Error(e.message + ' in expression "' + expressionText + '"');
      }
      return evaluator;
    }

    function _createEvaluatorViaCache(factory, expr, bindingContext) {
      // The absence of binding context indicates that no caching should occur
      if (!bindingContext) {
        return factory(expr, bindingContext);
      }

      var cacheScope;
      var scopeMap = _evaluatorCacheMap;

      var key = bindingContext[_OJ_CACHE_SCOPE] || bindingContext;

      cacheScope = scopeMap.get(key);
      if (!cacheScope) {
        cacheScope = {};
        scopeMap.set(key, cacheScope);
      }
      var func = cacheScope[expr];
      if (!func) {
        func = factory(expr, bindingContext);
        cacheScope[expr] = func;
      }
      return func;
    }

    function _getBindingsString(node, wrapped, bindingContext) {
      var func = wrapped.getBindingsString;
      if (func) {
        return func.call(wrapped, node, bindingContext);
      }

      switch (node.nodeType) {
        case 1: // Element
          return node.getAttribute('data-bind');

        case 8: // Comment node
          var match = node.nodeValue.match(/^\s*ko(?:\s+([\s\S]+))?\s*$/);
          return match ? match[1] : null;

        default:
          return null;
      }
    }
  }

  function _patchKoEvaluatorForCSP(cache) {
    var instance = ko.bindingProvider.instance;
    var patched;
    var parseMethod = 'parseBindingsString';
    while (instance && !patched) {
      var original = instance[parseMethod];
      if (original) {
        patched = true;
        instance[parseMethod] = _getParseBindingsReplacement(original.bind(instance), cache);
      } else {
        instance = instance.getWrapped ? instance.getWrapped() : null;
      }
    }
    if (!patched) {
      Logger.error(
        'Unable to patch KO expression evaluation implementation. ' +
          'If you have a custom binding provider, make sure it implements the getWrapped() method that returns the default binding provider instance.'
      );
    }
  }

  function _getParseBindingsReplacement(original, cache) {
    return function (bindingsString, bindingContext, node, options) {
      var factory = Config.getExpressionEvaluator();
      if (!factory) {
        return original(bindingsString, bindingContext, node, options);
      }
      var evaluate = _createKoEvaluatorViaCache(bindingsString, options, factory, cache);
      return evaluate([bindingContext.$data || {}, bindingContext, { $element: node }]);
    };
  }

  function _createKoEvaluatorViaCache(expression, options, factory, cache) {
    var evaluate = cache[expression];
    if (!evaluate) {
      var rewrittenBindings = ko.expressionRewriting.preProcessBindings(expression, options);
      evaluate = factory.createEvaluator('{' + rewrittenBindings + '}').evaluate;
      // eslint-disable-next-line no-param-reassign
      cache[expression] = evaluate;
    }
    return evaluate;
  }

  const BindingProviderImpl = new _KoCustomBindingProvider().install();

  return BindingProviderImpl;

});
