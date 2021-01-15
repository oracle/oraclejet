!function(){function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */define(["exports","ojs/ojcore-base","ojs/ojconfig"],function(t,n,r){"use strict";n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;
/**
   * @license
   * Copyright (c) 2008 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var o={setBundle:function(e){o._bundle=e},getResource:function(e){return o._getResourceString(e)},applyParameters:function(e,t){return null==e?null:o._format(e,t)},getTranslatedString:function(t,n){var r=o._getResourceString(t);if(null==r)return t;var a={};return arguments.length>2?a=Array.prototype.slice.call(arguments,1):2===arguments.length&&("object"===e(a=arguments[1])||a instanceof Array||(a=[a])),o.applyParameters(r,a)},getComponentTranslations:function(e){var t=o._getBundle()[e];if(null==t)return{};for(var n={},r=Object.keys(t),a=0;a<r.length;a++){var u=r[a];n[u]=t[u]}return n},_getResourceString:function(e){var t=e?e.split("."):[],r=o._getBundle();n.Assert.assertObject(r);for(var a=0;a<t.length&&null!=r;a++){r=r[t[a]]}return null!=r?r:null},_format:function(e,t){var n,r,o=e.length,a=[],u=null,l=!1,s=!1,i=!1,c=!1;for(r=0;r<o;r++){var f=e.charAt(r),g=!1;if(l)g=!0,l=!1;else switch(f){case"$":l=!0;break;case"{":c||(s||(n=!1,u=[]),s=!0);break;case"}":if(s&&u.length>0){var p=t[u.join("")];a.push(void 0===p?"null":p)}s=!1;break;case"[":s||(i?c=!0:i=!0);break;case"]":c?c=!1:i=!1;break;default:g=!0}g&&(s?","===f||" "===f?n=!0:n||u.push(f):c||a.push(f))}return a.join("")},_getBundle:function(){var e=o._bundle;if(e)return e;if(n.__isAmdLoaderPresent()){var t=r.getConfigBundle();return n.Assert.assert(void 0!==t,"ojtranslations module must be defined"),t}return{}}},a=o.setBundle,u=o.getResource,l=o.applyParameters,s=o.getTranslatedString,i=o.getComponentTranslations;t.applyParameters=l,t.getComponentTranslations=i,t.getResource=u,t.getTranslatedString=s,t.setBundle=a,Object.defineProperty(t,"__esModule",{value:!0})})}();
//# sourceMappingURL=ojtranslation.js.map