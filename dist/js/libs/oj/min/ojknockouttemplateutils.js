/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","knockout","jquery"],function(e,t,n){"use strict";n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;const r={getRenderer:function(e,r){var o=function(o){var a=o._parentElement||o.parentElement,l=t.contextFor(o.componentElement);if(l){var c=l.createChildContext(o.data,null,function(e){e.$context=o});t.renderTemplate(e,c,{afterRender:function(e){n(e)._ojDetectCleanData()}},a,r?"replaceNode":"replaceChildren")}return null};return function(t){if(t.componentElement.classList&&t.componentElement.classList.contains("oj-dvtbase")){var r=document.createElement("div");r.style.display="none",r._dvtcontext=t._dvtcontext,t.componentElement.appendChild(r),Object.defineProperty(t,"_parentElement",{value:r,enumerable:!1}),Object.defineProperty(t,"_templateCleanup",{value:function(){n(r).remove()},enumerable:!1}),Object.defineProperty(t,"_templateName",{value:e,enumerable:!1}),o(t);var a=r.children[0];return a?(r.removeChild(a),n(r).remove(),{insert:a}):{preventDefault:!0}}return o(t)}}},o=r.getRenderer;e.getRenderer=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojknockouttemplateutils.js.map