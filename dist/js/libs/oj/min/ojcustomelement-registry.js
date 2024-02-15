/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";const t={};function n(e){return e.toLowerCase().match(/-(?<match>.*)/)[0].replace(/-(.)/g,(e,t)=>t.toUpperCase())+"Element"}function r(e){return t[e]??null}function o(e){return r(e)?.descriptor||{}}function i(e){const t=o(e);return t._metadata??t.metadata??{}}function s(e){return i(e).properties??{}}e.getElementDescriptor=o,e.getElementProperties=function(e){return s(e.tagName)},e.getElementRegistration=r,e.getMetadata=i,e.getPropertiesForElementTag=s,e.isComposite=function(e){return r(e)?.composite??!1},e.isElementRegistered=function(e){return null!=t[e]},e.isVComponent=function(e){return r(e)?.vcomp??!1},e.registerElement=function(e,r,o){const i=e.toUpperCase();if(!t[i]){if(!r.descriptor)throw new Error(`Custom element ${e} must be registered with a descriptor.`);t[e]=r,t[i]=r,Object.defineProperty(o,"name",{value:n(e)}),customElements.define(e,o)}},e.tagNameToElementClassName=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojcustomelement-registry.js.map