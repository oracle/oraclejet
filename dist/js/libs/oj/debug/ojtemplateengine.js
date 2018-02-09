/**
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
     var nodes  = _getTemplateNodes(node);
     
     var tmpContainer = _createAndPopulateContainer(nodes);
     
     ko.applyBindingsToDescendants(_getContext(componentElement, properties), tmpContainer);
     
     return Array.prototype.slice.call(tmpContainer.childNodes, 0);
   }
   
   
   function _getTemplateNodes(node)
   {
     var nodes;
     if (node.nodeType === 1 && node.tagName.toLowerCase() === 'template') 
     {
       var content = node.content;
       if (content)
       {
         nodes = content.childNodes;
       }
       else
       {
         nodes = node.childNodes;
       }
     }
     else
     {
       throw "Invalid template node " + node;
     }
     
     var cloned  = Array.prototype.map.call(nodes, function(orig)
      {
        return orig.cloneNode(true);
      }
     );
     
     return cloned;
   }
   
   function _createAndPopulateContainer(nodes)
   {
     var div = document.createElement("div");
     
     nodes.forEach(
       function(child)
       {
         div.appendChild(child);
       }
     );
     
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

