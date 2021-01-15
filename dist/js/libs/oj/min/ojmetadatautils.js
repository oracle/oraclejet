/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base"],function(e,t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const r={getDefaultValue:function(e,l){var o=e.value;if(void 0===o){var a=e.properties;if(a){for(var u={},f=Object.keys(a),n=0;n<f.length;n++){var c=r.getDefaultValue(a[f[n]]);void 0!==c&&(u[f[n]]=c)}Object.keys(u).length>0&&(e.value=u,o=u)}}return void 0!==o&&(Array.isArray(o)?o=l?r.deepFreeze(o):o.slice():null!==o&&"object"==typeof o&&(o=l?r.deepFreeze(o):t.CollectionUtils.copyInto({},o,void 0,!0))),o},getDefaultValues:function(e,t){var l={},o=Object.keys(e),a=!1;return o.forEach(function(o){var u=r.getDefaultValue(e[o],t);void 0!==u&&(l[o]=u,a=!0)}),a?l:null},deepFreeze:function(e){if(Object.isFrozen(e))return e;if(Array.isArray(e))e=e.map(e=>r.deepFreeze(e));else if(null!==e&&"object"==typeof e){const t=Object.getPrototypeOf(e);null!==t&&t!==Object.prototype||(Object.keys(e).forEach(function(t){e[t]=r.deepFreeze(e[t])}),Object.freeze(e))}return e}},l=r.getDefaultValue,o=r.getDefaultValues,a=r.deepFreeze;e.deepFreeze=a,e.getDefaultValue=l,e.getDefaultValues=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojmetadatautils.js.map