/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojconfig"],function(e,t,r){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2008 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const n={setBundle:function(e){n._bundle=e},getResource:function(e){return n._getResourceString(e)},applyParameters:function(e,t){return null==e?null:n._format(e,t)},getTranslatedString:function(e,t){var r=n._getResourceString(e);if(null==r)return e;var a={};return arguments.length>2?a=Array.prototype.slice.call(arguments,1):2===arguments.length&&("object"==typeof(a=arguments[1])||a instanceof Array||(a=[a])),n.applyParameters(r,a)},getComponentTranslations:function(e){var t=n._getBundle()[e];if(null==t)return{};for(var r={},a=Object.keys(t),s=0;s<a.length;s++){var l=a[s];r[l]=t[l]}return r},_getResourceString:function(e){var r=e?e.split("."):[],a=n._getBundle();t.Assert.assertObject(a);for(var s=0;s<r.length&&null!=a;s++){a=a[r[s]]}return null!=a?a:null},_format:function(e,t){var r,n,a=e.length,s=[],l=null,o=!1,u=!1,i=!1,c=!1;for(n=0;n<a;n++){var f=e.charAt(n),g=!1;if(o)g=!0,o=!1;else switch(f){case"$":o=!0;break;case"{":c||(u||(r=!1,l=[]),u=!0);break;case"}":if(u&&l.length>0){var d=t[l.join("")];s.push(void 0===d?"null":d)}u=!1;break;case"[":u||(i?c=!0:i=!0);break;case"]":c?c=!1:i=!1;break;default:g=!0}g&&(u?","===f||" "===f?r=!0:r||l.push(f):c||s.push(f))}return s.join("")},_getBundle:function(){var e=n._bundle;if(e)return e;if(t.__isAmdLoaderPresent()){var a=r.getConfigBundle();return t.Assert.assert(void 0!==a,"ojtranslations module must be defined"),a}return{}}},a=n.setBundle,s=n.getResource,l=n.applyParameters,o=n.getTranslatedString,u=n.getComponentTranslations;e.applyParameters=l,e.getComponentTranslations=u,e.getResource=s,e.getTranslatedString=o,e.setBundle=a,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtranslation.js.map