/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojlogger'], function(oj, ko, Logger)
{
/* global ko:false, Logger:false, WeakMap: false */

/**
 * @ignore
 * @constructor
 */
function _KoCustomBindingProvider() {
  var _evaluatorCacheMap = new WeakMap();
  var _postprocessors = {};
  var _preprocessors = {};

  var _OJ_EXTENDED = '_ojExtended';
  var _OJ_CACHE_SCOPE = '_ojCacheScope';

  this.install = function () {
    var provider = ko.bindingProvider;
    var instanceName = 'instance';
    var wrapped = provider[instanceName];

    var getAccessors = 'getBindingAccessors';
    if (!wrapped[getAccessors]) {
      Logger.error("JET's Knockout bindings are not compatible with the current binding " +
        'provider since it does not implement getBindingAccessors()');
      return this;
    }

    var custom = {};
    provider[instanceName] = custom;

    var methodsToWrap = [];
    methodsToWrap.push(getAccessors, 'nodeHasBindings', 'getBindings');

    methodsToWrap.forEach(
      function (name) {
        custom[name] = _wrap(wrapped, name,
          function (n, original) {
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
          }
        );
      }
    );
    custom.preprocessNode = _wrapPreprocessNode(wrapped);

    _patchKoRenderTemplateSource(ko);

    return this;
  };

  this.addPostprocessor = function (postprocessor) {
    var keys = Object.keys(postprocessor);
    keys.forEach(
      function (key) {
        _postprocessors[key] = _postprocessors[key] || [];
        _postprocessors[key].push(postprocessor[key]);
      }
    );
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
    /* jslint evil:true */
    // eslint-disable-next-line no-new-func
    return new Function('$context', 'with($context){with($data||{}){return '
      + expressionText + ';}}'); // @HTMLUpdateOK; binding expression evaluation
  };

  this.createEvaluator = function (expression, bindingContext) {
    return _createEvaluatorViaCache(this.createBindingExpressionEvaluator,
      expression, bindingContext);
  };


  function _wrap(wrapped, name, prewrap) {
    var isHasBindings = (name === 'nodeHasBindings');

    var impl = function (arg0) {
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
        postprocessHandlers.forEach(
          function (handler) {
            var args = Array.prototype.slice.call(originalArgs);
            args.push(ret, wrapped);
            // Ignore dependencies here so that bindings don't get triggered due to contained evaluations
            ret = ko.ignoreDependencies(handler, null, args);
          }
        );
      }
      return ret;
    };

    return impl;
  }

  function _wrapPreprocessNode(wrapped) {
    var originalPreprocessor = wrapped.preprocessNode;
    var impl = function (node) {
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
    return impl;
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
          i += (insertedNodes.length - 1);
        }
      }
      current = next;
      i += 1;
      var nextIndex = currentIndex + 1;
      currentIndex = current ? newNodes.indexOf(current, nextIndex) : -1;
      // figure out how many virtual children we need to skip (they will be preprocessed after their container is entered)
      i += (currentIndex - nextIndex); // this value is irrelevent if currentIndex is negative
    }

    return ret;
  }

  // Patches renderTemplateSource() to ensure that the template is parsed with the current document.
  // Otherwise, the custom elements are not being upgraded synchronously
  function _patchKoRenderTemplateSource(ko) {
    var proto = ko.nativeTemplateEngine.prototype;
    var method = 'renderTemplateSource';
    var delegate = proto[method];

    proto[method] =
      function (templateSource, bindingContext, options, templateDocument) {
        return delegate.call(this, templateSource, bindingContext,
          options, templateDocument || document/* use current document if none is provided*/);
      };
  }

  function _preWrapGetAccessors(original, wrappedProvider) {
    var impl = function (node, bindingContext) {
      if (bindingContext[_OJ_EXTENDED]) {
        var bindingsString = _getBindingsString(node, wrappedProvider, bindingContext);
        // _createExtendAccessorsViaCache() returns a function that will produce a map of binding accessors.
        // Note that this function is immediately invoked with the bindingcontext and node as parameters.
        // That will pre-bind binding accessors to the values of $context and $element
        var accessors = bindingsString ?
          _createExtendAccessorsViaCache(bindingsString,
            bindingContext)(bindingContext, node) : null;

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

    return impl;
  }

  function _createExtendAccessorsViaCache(bindingsString, bindingContext) {
    var factory = function (expr) {
      // .preProcessBindings() will produce a string that defines a Function retrurning a map
      // with each key being the bidning name, and each value being an evalutor function for
      // binding value
      var rewrittenBindings = ko.expressionRewriting.preProcessBindings(expr,
        { valueAccessors: true });
      return _createReplacementEvaluatorForExtend('{' + rewrittenBindings + '}');
    };

    return _createEvaluatorViaCache(factory, bindingsString, bindingContext);
  }

  function _createReplacementEvaluatorForExtend(expressionText) {
    // Note that the priority order of the binding context and the ViewModel are reversed
    // in this evaluator. This is needed for allowing properties supplied in bindsingProvider.extend()
    // to obscure properties in the ViewModel, which is the behavior one would expect when .extend()
    // is used
    /* jslint evil:true */
    // eslint-disable-next-line no-new-func
    return new Function('$context', '$element', 'with($context.$data||{}){with($context){return ' +
      expressionText + '}}'); // @HTMLUpdateOK; binding expression evaluation
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
        return (match ? match[1] : null);

      default:
        return null;
    }
  }
}

// eslint-disable-next-line no-unused-vars
var BindingProviderImpl = new _KoCustomBindingProvider().install();

    return BindingProviderImpl;
});