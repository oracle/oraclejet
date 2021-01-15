/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","knockout","jquery"],function(e,t,n){"use strict";n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var r={getRenderer:function(e,r){var a=function(a){var l=a._parentElement||a.parentElement,o=t.contextFor(a.componentElement);if(o){var c=o.createChildContext(a.data,null,function(e){e.$context=a});t.renderTemplate(e,c,{afterRender:function(e){n(e)._ojDetectCleanData()}},l,r?"replaceNode":"replaceChildren")}return null};return function(t){if(t.componentElement.classList&&t.componentElement.classList.contains("oj-dvtbase")){var r=document.createElement("div");r.style.display="none",r._dvtcontext=t._dvtcontext,t.componentElement.appendChild(r),Object.defineProperty(t,"_parentElement",{value:r,enumerable:!1}),Object.defineProperty(t,"_templateCleanup",{value:function(){n(r).remove()},enumerable:!1}),Object.defineProperty(t,"_templateName",{value:e,enumerable:!1}),a(t);var l=r.children[0];return l?(r.removeChild(l),n(r).remove(),{insert:l}):{preventDefault:!0}}return a(t)}}},a=r.getRenderer;e.getRenderer=a,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojknockouttemplateutils.js.map