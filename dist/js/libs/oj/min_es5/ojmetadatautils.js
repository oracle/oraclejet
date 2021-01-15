!function(){function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */define(["exports","ojs/ojcore-base"],function(t,r){"use strict";r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var o={getDefaultValue:function(t,u){var n=t.value;if(void 0===n){var l=t.properties;if(l){for(var a={},f=Object.keys(l),c=0;c<f.length;c++){var i=o.getDefaultValue(l[f[c]]);void 0!==i&&(a[f[c]]=i)}Object.keys(a).length>0&&(t.value=a,n=a)}}return void 0!==n&&(Array.isArray(n)?n=u?o.deepFreeze(n):n.slice():null!==n&&"object"===e(n)&&(n=u?o.deepFreeze(n):r.CollectionUtils.copyInto({},n,void 0,!0))),n},getDefaultValues:function(e,t){var r={},u=Object.keys(e),n=!1;return u.forEach(function(u){var l=o.getDefaultValue(e[u],t);void 0!==l&&(r[u]=l,n=!0)}),n?r:null},deepFreeze:function(t){if(Object.isFrozen(t))return t;if(Array.isArray(t))t=t.map(function(e){return o.deepFreeze(e)});else if(null!==t&&"object"===e(t)){var r=Object.getPrototypeOf(t);null!==r&&r!==Object.prototype||(Object.keys(t).forEach(function(e){t[e]=o.deepFreeze(t[e])}),Object.freeze(t))}return t}},u=o.getDefaultValue,n=o.getDefaultValues,l=o.deepFreeze;t.deepFreeze=l,t.getDefaultValue=u,t.getDefaultValues=n,Object.defineProperty(t,"__esModule",{value:!0})})}();
//# sourceMappingURL=ojmetadatautils.js.map