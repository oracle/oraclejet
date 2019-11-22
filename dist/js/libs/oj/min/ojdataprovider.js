/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","ojs/ojeventtarget"],function(t){"use strict";var e,r,i=t.GenericEvent;
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */!function(t){let e;!function(t){t.$co="$co",t.$eq="$eq",t.$ew="$ew",t.$pr="$pr",t.$gt="$gt",t.$ge="$ge",t.$lt="$lt",t.$le="$le",t.$ne="$ne",t.$regex="$regex",t.$sw="$sw"}(e=t.AttributeOperator||(t.AttributeOperator={}))}(e||(e={})),t.AttributeFilterOperator=e,t.AttributeFilterOperator.AttributeOperator=e.AttributeOperator,function(t){let e;!function(t){t.$and="$and",t.$or="$or"}(e=t.CompoundOperator||(t.CompoundOperator={}))}(r||(r={})),t.CompoundFilterOperator=r,t.CompoundFilterOperator.CompoundOperator=r.CompoundOperator;
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
class n extends i{constructor(t){let e={};e[n._DETAIL]=t,super("mutate",e)}}n._DETAIL="detail",t.DataProviderMutationEvent=n,t.DataProviderMutationEvent=n;
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
class a extends i{constructor(){super("refresh")}}t.DataProviderRefreshEvent=a,t.DataProviderRefreshEvent=a,
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
t.DataProvider=function(){};
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
class o{fetchByKeys(t){let e=0,r=this.getIterationLimit?this.getIterationLimit():-1,i={size:25},n=new Map,a=this.fetchFirst(i)[Symbol.asyncIterator]();return function t(i,n,a){return n.next().then(function(o){let s=o.value,l=s.data,f=s.metadata,u=f.map(function(t){return t.key}),p=!0;return i.keys.forEach(function(t){a.has(t)||u.map(function(e,r){e==t&&a.set(e,{metadata:f[r],data:l[r]})}),a.has(t)||(p=!1)}),e+=l.length,p||o.done?a:-1!=r&&e>=r?a:t(i,n,a)})}(t,a,n).then(function(e){let r=new Map;return e.forEach(function(t,e){let i=[t];r.set(e,i[0])}),{fetchParameters:t,results:r}})}containsKeys(t){return this.fetchByKeys(t).then(function(e){let r=new Set;return t.keys.forEach(function(t){null!=e.results.get(t)&&r.add(t)}),Promise.resolve({containsParameters:t,results:r})})}getCapability(t){if("fetchByKeys"==t)return{implementation:"iteration"};let e=null;if(!0!==this._ojSkipLastCapability){this._ojSkipLastCapability=!0;let r=1;for(;this["_ojLastGetCapability"+r];)++r;for(--r;r>0&&!(e=this["_ojLastGetCapability"+r](t));r--);delete this._ojSkipLastCapability}return e}static applyMixin(t){let e=t.prototype.getCapability;if([o].forEach(e=>{Object.getOwnPropertyNames(e.prototype).forEach(r=>{"constructor"!==r&&(t.prototype[r]=e.prototype[r])})}),e){let r=1;for(;t.prototype["_ojLastGetCapability"+r];)++r;t.prototype["_ojLastGetCapability"+r]=e}}}t.FetchByKeysMixin=o,t.FetchByKeysMixin.applyMixin=o.applyMixin;
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
class s{fetchByOffset(t){let e=t&&t.size>0?t.size:25,r=t?t.sortCriteria:null,i=t&&t.offset>0?t.offset:0,n=0,a=this.getIterationLimit?this.getIterationLimit():-1,o=!1,s={};s.size=e,s.sortCriteria=r;let l=new Array,f=this.fetchFirst(s)[Symbol.asyncIterator]();return function t(r,s,l){return s.next().then(function(f){o=f.done;let u=f.value,p=u.data,c=u.metadata,h=p.length;if(i<n+h)for(let t=i<=n?0:i-n;t<h&&l.length!=e;t++)l.push({metadata:c[t],data:p[t]});return n+=h,l.length<e&&!o?-1!=a&&n>=a?l:t(r,s,l):l})}(t,f,l).then(function(e){return{fetchParameters:t,results:e,done:o}})}getCapability(t){if("fetchByOffset"==t)return{implementation:"iteration"};let e=null;if(!0!==this._ojSkipLastCapability){this._ojSkipLastCapability=!0;let r=1;for(;this["_ojLastGetCapability"+r];)++r;for(--r;r>0&&!(e=this["_ojLastGetCapability"+r](t));r--);delete this._ojSkipLastCapability}return e}static applyMixin(t){let e=t.prototype.getCapability;if([s].forEach(e=>{Object.getOwnPropertyNames(e.prototype).forEach(r=>{"constructor"!==r&&(t.prototype[r]=e.prototype[r])})}),e){let r=1;for(;t.prototype["_ojLastGetCapability"+r];)++r;t.prototype["_ojLastGetCapability"+r]=e}}}t.FetchByOffsetMixin=s,t.FetchByOffsetMixin.applyMixin=s.applyMixin;
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
class l{constructor(t){t=t||{},this._textFilterAttributes=t.filterOptions?t.filterOptions.textFilterAttributes:null;let e=t.filterDef;e&&(e.op?(this.op=e.op,e.value?(this.value=e.value,e.attribute&&(this.attribute=e.attribute)):e.criteria&&(this.criteria=e.criteria)):e.text&&(this.text=e.text))}filter(e,r,i){return t.FilterUtils.satisfy(l._transformFilter(this),e)}static _transformFilter(t){let e;if(t){let r,i=t.op;if(t.text?i="$regex":"$le"===i?i="$lte":"$ge"===i?i="$gte":"$pr"===i&&(i="$exists"),"$and"!=i&&"$or"!=i){r=t.text?new RegExp(t.text,"i"):t.value,e={};let n=t.attribute;if(n){let t={};"$sw"!==i&&"$ew"!==i&&"$co"!==i||(i="$regex",r=l._fixStringExpr(i,r)),t[i]=r,e[n]=t}else if(t.text){let n={};n[i]=r,t._textFilterAttributes?t._textFilterAttributes.forEach(function(t){e[t]=n}):e["*"]=n}else{let t=[];l._transformObjectExpr(r,i,null,t),e.$and=t}}else{let r=[];t.criteria.forEach(function(t){r.push(l._transformFilter(t))}),(e={})[i]=r}}return e}static _transformObjectExpr(t,e,r,i){if(Object.keys(t).length>0)Object.keys(t).forEach(function(n){let a=t[n],o=r?r+"."+n:n;if(a instanceof Object)l._transformObjectExpr(a,e,o,i);else{let t={};"$sw"!==e&&"$ew"!==e&&"$co"!==e||(e="$regex",a=l._fixStringExpr(e,a)),t[e]=a;let r={};r[o]=t,i.push(r)}});else{let n={};n[e]=t;let a={};a[r]=n,i.push(a)}}static _fixStringExpr(t,e){return("string"==typeof e||e instanceof String)&&("$sw"===t?e="^"+e:"$ew"===t&&(e+="$")),e}}t.FilterFactory=class{static getFilter(t){return new l(t)}},
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
t.FilterUtils=function(){function t(t,e){var r=!1;for(var n in e)if(e.hasOwnProperty(n)){var a=e[n];if(r||!i(n))throw new Error("parsing error "+e);t.operator=n,t.right=a,r=!0}}function e(t,e,r){var i;if("$lt"===t)return(r=(i=a(r,e))[0])<(e=i[1]);if("$gt"===t)return(r=(i=a(r,e))[0])>(e=i[1]);if("$lte"===t)return(r=(i=a(r,e))[0])<=(e=i[1]);if("$gte"===t)return(r=(i=a(r,e))[0])>=(e=i[1]);if("$eq"===t)return r===e;if("$ne"===t)return r!==e;if("$regex"===t){if(r){if("string"!=typeof r&&!(r instanceof String))if(r instanceof Object){if("[object Object]"==(r=r.toString()))return!1}else r=new String(r);return null!==r.match(e)}return!1}if("$exists"===t)return e?null!=r:null==r;throw new Error("not a valid expression! "+expTree)}function r(t){return"$and"===t||"$or"===t}function i(t){return"$lt"===t||"$gt"===t||"$lte"===t||"$gte"===t||"$eq"===t||"$ne"===t||"$regex"===t||"$exists"===t}function n(t){return null!=t&&(t instanceof String||"string"==typeof t)}function a(t,e){return n(t)&&null==e?e="":n(e)&&null==t&&(t=""),[t,e]}function o(t,e){for(var r=t.split("."),i=e,n=0;n<r.length;n++)i=i[r[n]];return i}return{satisfy:function(n,a){return!n||function t(n,a){var s=n.operator;if(r(s)){if(!n.left&&n.array instanceof Array){for(var l,f=n.array,u=0;u<f.length;u++){var p=t(f[u],a);if("$or"===s&&!0===p)return!0;if("$and"===s&&!1===p)return!1;l=p}return l}throw new Error("invalid expression tree!"+n)}if(i(s)){var c,h=n.right;if("*"!=n.left)return c=o(n.left,a),e(s,h,c);var y,$=Object.keys(a);for(y=0;y<$.length;y++)if(c=o($[y],a),e(s,h,c))return!0;return!1}throw new Error("not a valid expression!"+n)}(function e(n){var a,o=[];for(var s in n)if(n.hasOwnProperty(s)){var l=n[s];if(0===s.indexOf("$")){if(r(s)){if(!(l instanceof Array))throw new Error("not a valid expression: "+n);a={operator:s,array:[]};for(var f=0;f<l.length;f++){var u=e(l[f]);a.array.push(u)}}else if(i(s))throw new Error("not a valid expression: "+n)}else if("object"!=typeof l)o.push({left:s,right:l,operator:"$eq"});else{var p={left:s};t(p,l),o.push(p)}}return o.length>1?a={operator:"$and",array:o}:1===o.length&&(a=o[0]),a}(n),a)},getValue:o,assembleObject:function(t,e){var r;if(e){r={};for(var i=0;i<e.length;i++)for(var n=r,a=t,o=e[i].split("."),s=0;s<o.length;s++)a=a[o[s]],!n[o[s]]&&s<o.length-1&&(n[o[s]]={}),s===o.length-1?n[o[s]]=a:n=n[o[s]]}else r=t;return r}}}();
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
var f={};return f.FetchByKeysMixin=t.FetchByKeysMixin,f.FetchByOffsetMixin=t.FetchByOffsetMixin,f.FilterFactory=t.FilterFactory,f});