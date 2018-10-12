/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojlogger'], function(oj, ko, Logger)
{
/* global ko:false, Logger:false */

/**
 * @ignore
 * @constructor
 */
function _KoCustomBindingProvider() {
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
        custom[name] = _wrap(wrapped, name);
      }
    );
    custom.preprocessNode = _wrapPreprocessNode(wrapped);

    _patchKoRenderTemplateSource(ko);

    return this;
  };

  var _postprocessors = {};
  var _preprocessors = {};

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


  function _wrap(wrapped, name) {
    var delegate = wrapped[name];
    var isHasBindings = (name === 'nodeHasBindings');

    var impl = function (arg0) {
      if (isHasBindings) {
        var type = arg0.nodeType;
        if (type !== 1 && type !== 8) {
          return false;
        }
      }
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
}

/**
 * @ignore
 * @private
 */
oj.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE = new _KoCustomBindingProvider().install();

});