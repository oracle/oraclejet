/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore-base"],function(e){"use strict";var t={};function r(e){if(Array.isArray(e))e=e.map(e=>r(e));else{if(null==e||"object"!=typeof e)return e;var t=Object.getOwnPropertyNames(e);Object.keys(t).forEach(function(t){e[t]=r(e[t])})}return Object.freeze(e)}return t.getDefaultValue=function(a,o){var n=a.value;if(void 0===n){var u=a.properties;if(u){for(var i={},l=Object.keys(u),c=0;c<l.length;c++){var f=t.getDefaultValue(u[l[c]]);void 0!==f&&(i[l[c]]=f)}Object.keys(i).length>0&&(a.value=i,n=i)}}return void 0!==n&&(Array.isArray(n)?n=o?r(n):n.slice():null!==n&&"object"==typeof n&&(n=o?r(n):e.CollectionUtils.copyInto({},n,void 0,!0))),n},t.getDefaultValues=function(e,r){var a={},o=Object.keys(e),n=!1;return o.forEach(function(o){var u=t.getDefaultValue(e[o],r);void 0!==u&&(a[o]=u,n=!0)}),n?a:null},t});