/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['knockout'],
       function(ko)
{

/* global ko:false */

 
/**
 * Default JET Template engine iumplementation
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
function JetTemplateEngine() {
  this.execute = function (componentElement, node, properties, alias) {
    var tmpContainer = _createAndPopulateContainer(node);

 
    // Check to see if data-oj-as was defined on the template element as an additional 
    // alias to provide to the template children
    var templateAlias = node.getAttribute('data-oj-as');
    ko.applyBindingsToDescendants(_getContext(componentElement, properties, alias, templateAlias), tmpContainer);

 
    return Array.prototype.slice.call(tmpContainer.childNodes, 0);
  };

  this.clean = function (node) {
    return ko.cleanNode(node);
  };
 
  function _createAndPopulateContainer(node) {
    var div = document.createElement('div');

 
    if (node.nodeType === 1 && node.tagName.toLowerCase() === 'template') {
      var content = node.content;
      if (content) {
        div.appendChild(document.importNode(content, true /* deep clone*/));
      } else {
        Array.prototype.forEach.call(node.childNodes,
           function (child) {
             div.appendChild(child.cloneNode(true));
           }
         );
      }
    } else {
      throw new Error('Invalid template node ' + node);
    }

 
    return div;
  }

 
  function _getContext(componentElement, properties, alias, templateAlias) {    
    var extension = {'$current': properties}
    var bindingContext = ko.contextFor(componentElement);

 
    // The component provided properties will be made available on
    // $current, any alias passed in, and any alias defined on the 
    // template element via data-oj-as
    if (bindingContext) {
      if (alias) {
        extension[alias] = properties;
      }
      if (templateAlias) {
        extension[templateAlias] = properties;
      }
      return bindingContext.extend(extension);
    }

 
    return extension;
  }
}

return new JetTemplateEngine();
});
