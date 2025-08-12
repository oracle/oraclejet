/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base"],function(e,t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;const n="__root_layer_host",o=(e,t,o)=>{let r=null;if("nearestAncestor"===t&&(r=e.closest("[data-oj-layer]")),r)return r;let l=document.getElementById(n);return l||(l=document.createElement("div"),l.setAttribute("id",n),l.setAttribute("data-oj-binding-provider","preact"),l.style.position="relative",l.style.zIndex="999",document.body.prepend(l)),l};e.getLayerContext=function(e){const n=t.VLayerUtils?t.VLayerUtils.getLayerHost:o,r=t.VLayerUtils?t.VLayerUtils.onLayerUnmount:null;return{getRootLayerHost:n.bind(null,e,"topLevel"),getLayerHost:n.bind(null,e,"nearestAncestor"),onLayerUnmount:r?.bind(null,e)}},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojlayerutils.js.map