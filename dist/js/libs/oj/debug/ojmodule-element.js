/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'ojs/ojmodule', 'ojs/ojcomposite'], function(oj, ko)
{

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
var moduleMetadata =
{
  "properties": 
  {
    "config": 
    {
      "type": "object",
      "properties": 
      {
        "viewModel": {"type": "object"},
        "view": {"type": "array<object>"},
        "cleanupMode": 
        {
          "type":"string",
          "enumValues": ["onDisconnect", "none"],
          "value": "onDisconnect"
        }
      }
    },
    "animation": {"type": "object"}
  },
  "events": 
  {
    "transitionStart": {},
    "transitionEnd": {},
    "viewConnected": {},
    "viewDisconnected": {}
  }
};

function moduleViewModel (context) 
{
  var element = context.element;
  var props;
  
  function isViewAttached(config) 
  {
    var view = config ? config['view'] : null;
    return view && view.length > 0 && element.contains(view[0]);
  };
  
  function invokeViewModelMethod(model, name) 
  {
    var handler = model && model[name];
    if (typeof handler === 'function') 
    {
      ko.ignoreDependencies(handler, model);
    }
  };
  
  context.props.then(function(properties) {
    props = properties;
  });
  
  this['connected'] = function(context) 
  {
    if(isViewAttached(props && props['config'])) 
    {
      var model = props['config'] ? props['config']['viewModel'] : null;
      invokeViewModelMethod(model, 'connected');
    }
  };
  
  this['disconnected'] = function(context) 
  {
    if(isViewAttached(props && props['config']))
    {
      var model = props['config'] ? props['config']['viewModel'] : null;
      invokeViewModelMethod(model, 'disconnected');
    }
  };
};

var moduleValue = '{\"view\":$props.config.view, \"viewModel\":$props.config.viewModel,' + 
                  '\"cleanupMode\":$props.config.cleanupMode,\"animation\":$props.animation}';

var moduleView = "<!-- ko ojModule: "+ moduleValue +" --><!-- /ko -->";

oj.Composite.register('oj-module',
{
  "view": {"inline": moduleView},
  "metadata": {"inline": moduleMetadata},
  "viewModel": {"inline": moduleViewModel}
});

});
