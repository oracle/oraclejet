/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcustomelement","ojs/ojcustomelement-utils"],function(e,t){"use strict";return function(e,n){var r=e,o=n,s=t.CustomElementUtils.isElementRegistered(e.tagName)?t.CustomElementUtils.getElementState(e).getTrackChildrenOption():"none",i=function(e){var n=function(e){for(var n=[],o=0;o<e.length;o++)for(var i=e[o],l="childList"===i.type?i.target:i.target.parentNode;l;)l===r?(n.push(i),l=null):l="nearestCustomElement"!==s||t.ElementUtils.isValidCustomElementName(l.localName)?null:l.parentNode;return n}(e);n.length>0&&o(n)},l=new MutationObserver(i);return{observe:function(){"none"!==s&&l.observe(r,{attributes:!0,childList:!0,subtree:!0,characterData:!0})},disconnect:function(){var e=l.takeRecords();e&&e.length>0&&i(e),l.disconnect()}}}});
//# sourceMappingURL=ojchildmutationobserver.js.map