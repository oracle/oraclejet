/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";const t={};function n(e){return e.toLowerCase().match(/-(?<match>.*)/)[0].replace(/-(.)/g,(e,t)=>t.toUpperCase())+"Element"}function r(e){var n;return null!==(n=t[e])&&void 0!==n?n:null}function o(e){var t;return(null===(t=r(e))||void 0===t?void 0:t.descriptor)||{}}function i(e){var t,n;const r=o(e);return null!==(n=null!==(t=r._metadata)&&void 0!==t?t:r.metadata)&&void 0!==n?n:{}}function u(e){var t;return null!==(t=i(e).properties)&&void 0!==t?t:{}}e.getElementDescriptor=o,e.getElementProperties=function(e){return u(e.tagName)},e.getElementRegistration=r,e.getMetadata=i,e.getPropertiesForElementTag=u,e.isComposite=function(e){var t,n;return null!==(n=null===(t=r(e))||void 0===t?void 0:t.composite)&&void 0!==n&&n},e.isElementRegistered=function(e){return null!=t[e]},e.isVComponent=function(e){var t,n;return null!==(n=null===(t=r(e))||void 0===t?void 0:t.vcomp)&&void 0!==n&&n},e.registerElement=function(e,r,o){const i=e.toUpperCase();if(!t[i]){if(!r.descriptor)throw new Error(`Custom element ${e} must be registered with a descriptor.`);t[e]=r,t[i]=r,Object.defineProperty(o,"name",{value:n(e)}),customElements.define(e,o)}},e.tagNameToElementClassName=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojcustomelement-registry.js.map