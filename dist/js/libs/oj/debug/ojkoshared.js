/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout'], function(oj, ko)
{
/**
 * @ignore
 * @constructor
 */
function _KoCustomBindingProvider()
{

  this.install = function()
  {
    var provider = ko.bindingProvider;
    var instance_name = "instance";
    var wrapped = provider[instance_name];

    var getAccessors = 'getBindingAccessors';
    if (!wrapped[getAccessors])
    {
      oj.Logger.error("JET's Knockout bindings are not compatible with the current binding provider since it does " +
                         "not implement getBindingAccessors()");
      return this;
    }

    var custom = provider[instance_name] = {};

    var methodsToWrap = [];
    methodsToWrap.push(getAccessors, "nodeHasBindings", "getBindings", "preprocessNode");

    methodsToWrap.forEach(
      function(name)
      {
        _wrap(wrapped, custom, name);
      }
    );

    return this;

  };

  this.addPostprocessor = function(postprocessor)
  {
    var keys = Object.keys(postprocessor);
    keys.forEach(
      function(key)
      {
        _postprocessors[key] = _postprocessors[key] || [];
        _postprocessors[key].push(postprocessor[key]);
      }
    );
  }

  var _postprocessors = {};

  function _wrap(wrapped, target, name)
  {
    var delegate = wrapped[name];
    target[name] = function()
    {
      var ret = delegate ? delegate.apply(wrapped, arguments) : null;
      var postprocessHandlers = _postprocessors[name];

      if (postprocessHandlers != null)
      {
        var originalArgs = arguments;
        postprocessHandlers.forEach(
          function(handler)
          {
            var args = Array.prototype.slice.call(originalArgs);
            args.push(ret, wrapped);
            // Ignore dependencies here so that bindings don't get triggered due to contained evaluations
            ret = ko.ignoreDependencies(handler, null, args);
          }
        );
      }
      return ret;
    }
  }
}

/**
 * @ignore
 * @private
 */
oj.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE = new _KoCustomBindingProvider().install();
});