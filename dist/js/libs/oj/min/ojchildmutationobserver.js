/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcustomelement","ojs/ojcustomelement-utils","ojs/ojcustomelement-registry"],function(e,t,n){"use strict";return function(e,r){var o=e,s=r,i=n.isElementRegistered(e.tagName)?t.CustomElementUtils.getElementState(e).getTrackChildrenOption():"none",a=function(e){var n=function(e){for(var n=[],r=0;r<e.length;r++)for(var s=e[r],a="childList"===s.type?s.target:s.target.parentNode;a;)a===o?(n.push(s),a=null):a="nearestCustomElement"!==i||t.ElementUtils.isValidCustomElementName(a.localName)?null:a.parentNode;return n}(e);n.length>0&&s(n)},l=new MutationObserver(a);return{observe:function(){"none"!==i&&l.observe(o,{attributes:!0,childList:!0,subtree:!0,characterData:!0})},disconnect:function(){var e=l.takeRecords();e&&e.length>0&&a(e),l.disconnect()}}}});
//# sourceMappingURL=ojchildmutationobserver.js.map