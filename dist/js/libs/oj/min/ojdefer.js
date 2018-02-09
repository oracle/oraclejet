/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","jquery","knockout","ojs/ojkoshared","customElements"],function(a,g,c){c.bindingHandlers._ojDefer_={init:function(a,d,e,f,g){if(a._shown)c.applyBindingsToDescendants(g,a);else{if(!a._savedChildNodes){d=document.createDocumentFragment();for(e=a.childNodes;0<e.length;)d.appendChild(e[0]);a._savedChildNodes=d}Object.defineProperty(a,"_activateDescedantBindings",{value:function(){c.applyBindingsToDescendants(g,a);delete a._activateDescedantBindings},configurable:!0})}return{controlsDescendantBindings:!0}}};
(function(){a.Bca={};a.Bca.register=function(){function a(){var b=window.Reflect;return"undefined"!==typeof b?b.construct(HTMLElement,[],this.constructor):HTMLElement.call(this)}var c=Object.create(HTMLElement.prototype);Object.defineProperty(c,"_activate",{value:function(){this._activateDescedantBindings?(this._savedChildNodes&&(this.appendChild(this._savedChildNodes),delete this._savedChildNodes),this._activateDescedantBindings()):Object.defineProperty(this,"_shown",{configurable:!1,value:!0})},
writable:!1});Object.defineProperty(c,"constructor",{value:a,writable:!0,configurable:!0});a.prototype=c;Object.setPrototypeOf(a,HTMLElement);customElements.define("oj-defer",a)};a.Bca.register()})();(function(){a.HI.DM({nodeHasBindings:function(a,c){return c||1===a.nodeType&&"oj-defer"===a.nodeName.toLowerCase()},getBindingAccessors:function(a,c,e){1===a.nodeType&&"oj-defer"===a.nodeName.toLowerCase()&&(e=e||{},e._ojDefer_=function(){});return e}})})()});