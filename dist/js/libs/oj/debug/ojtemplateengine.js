/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['knockout'],
       function(ko)
{

/**
 * Default JET Template engine iumplementation
 * @ignore
 */
 function JetTemplateEngine()
 {
   this.execute = function(componentElement, node, properties)
   { 
     var tmpContainer = _createAndPopulateContainer(node);
     
     ko.applyBindingsToDescendants(_getContext(componentElement, properties), tmpContainer);
     
     return Array.prototype.slice.call(tmpContainer.childNodes, 0);
   }
   
   function _createAndPopulateContainer(node)
   {
     var div = document.createElement("div");

     if (node.nodeType === 1 && node.tagName.toLowerCase() === 'template') 
     {
       var content = node.content;
       if (content)
       {
         div.appendChild(document.importNode(content, true /* deep clone*/));
       }
       else
       {
         Array.prototype.forEach.call(node.childNodes,
           function(child)
           {
             div.appendChild(child.cloneNode(true));
           }
         );
       }
     }
     else
     {
       throw "Invalid template node " + node;
     }
     
     return div;
   }
   
   function _getContext(componentElement, properties)
   {
     var bindingContext = ko.contextFor(componentElement);
     
     if (bindingContext)
     {
       return bindingContext['extend'](properties);
     }
     
     return properties;
   }
 }

return new JetTemplateEngine();
});
