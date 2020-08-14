/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojeventtarget"],function(t){"use strict";var e,r,n=t.GenericEvent;
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
function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,r){return e&&o(t.prototype,e),r&&o(t,r),t}!function(t){!function(t){t.$co="$co",t.$eq="$eq",t.$ew="$ew",t.$pr="$pr",t.$gt="$gt",t.$ge="$ge",t.$lt="$lt",t.$le="$le",t.$ne="$ne",t.$regex="$regex",t.$sw="$sw"}(t.AttributeOperator||(t.AttributeOperator={}))}(e||(e={})),t.AttributeFilterOperator=e,t.AttributeFilterOperator.AttributeOperator=e.AttributeOperator,function(t){!function(t){t.$and="$and",t.$or="$or"}(t.CompoundOperator||(t.CompoundOperator={}))}(r||(r={})),t.CompoundFilterOperator=r,t.CompoundFilterOperator.CompoundOperator=r.CompoundOperator;var f=function(){function e(){i(this,e),this._handleMutationAdd=function(r){var n,i,o=this,a=r[e._BEFOREKEYS],f=r[e._KEYS],u=[];f.forEach(function(t){u.push(t)});var s=r[e._DATA],c=r[e._METADATA],l=r[e._INDEXES];if(u&&u.length>0)if(l)u.forEach(function(t,e){o._items.splice(l[e],0,new o.Item(c[e],s[e]))});else if(a){var p,h,y,v,m,b=Object.assign([],a),_=Object.assign(new Set,r[e._KEYS]),d=Object.assign([],r[e._DATA]),g=Object.assign([],r[e._METADATA]),E=[];for(p=0;p<a.length;p++){if(m=!0,null!=(y=a[p])){for(h=0;h<u.length;h++)if(t.Object.compareValues(u[h],y)){m=!1;break}if(m)for(h=0;h<o._items.length;h++)if(t.Object.compareValues(null===(i=null===(n=o._items[h])||void 0===n?void 0:n.metadata)||void 0===i?void 0:i.key,y)){m=!1;break}}else m=!1;m&&E.push(y)}for(var O=a.length;O>0;){for(p=0;p<a.length;p++)if(v=a[p],E.indexOf(v)>=0){E.push(v);break}O--}for(p=b.length-1;p>=0;p--)E.indexOf(b[p])>=0&&(delete b[p],_.delete(b[p]),delete d[p],delete g[p]);b.forEach(function(e,r){var n,i;if(null===e)o._items.push(new o.Item(c[r],s[r]));else for(p=0;p<o._items.length;p++)if(t.Object.compareValues(null===(i=null===(n=o._items[p])||void 0===n?void 0:n.metadata)||void 0===i?void 0:i.key,e)){o._items.splice(p,0,new o.Item(c[r],s[r]));break}})}else if(o._fetchParams&&null!=o._fetchParams.sortCriteria){var S=o._fetchParams.sortCriteria;if(S){var w,$,x=o._getSortComparator(S),T=[];s.forEach(function(t,e){for(w=0;w<o._items.length;w++)if($=o._items[w].data,x(t,$)<0){o._items.splice(w,0,new o.Item(c[e],s[e])),T.push(e);break}}),s.forEach(function(t,e){T.indexOf(e)<0&&o._items.push(new o.Item(c[e],s[e]))})}}else s.forEach(function(t,e){o._items.push(new o.Item(c[e],s[e]))})},this._handleMutationRemove=function(r){var n,i=this,o=r[e._KEYS];o&&o.size>0&&o.forEach(function(e){for(n=i._items.length-1;n>=0;n--)if(t.Object.compareValues(i._items[n].metadata.key,e)){i._items.splice(n,1);break}})},this._handleMutationUpdate=function(r){var n=this,i=r[e._KEYS],o=r[e._DATA],a=r[e._METADATA];if(o&&o.length>0){var f,u=0;i.forEach(function(e){for(f=n._items.length-1;f>=0;f--)if(t.Object.compareValues(n._items[f].metadata.key,e)){n._items.splice(f,1,new n.Item(a[u],o[u]));break}u++})}},this.Item=function(){return function t(r,n){i(this,t),this.metadata=r,this.data=n,this[e._METADATA]=r,this[e._DATA]=n}}(),this.FetchByKeysResults=function(){return function t(r,n){i(this,t),this.fetchParameters=r,this.results=n,this[e._FETCHPARAMETERS]=r,this[e._RESULTS]=n}}(),this.FetchByOffsetResults=function(){return function t(r,n,o){i(this,t),this.fetchParameters=r,this.results=n,this.done=o,this[e._FETCHPARAMETERS]=r,this[e._RESULTS]=n,this[e._DONE]=o}}(),this._items=[]}return a(e,[{key:"addListResult",value:function(t){var e=this,r=[];t.value.data.forEach(function(n,i){r.push(new e.Item(t.value.metadata[i],n))}),this._items=this._items.concat(r),this._done=t.done}},{key:"getDataList",value:function(t,e){this._fetchParams=t;var r=25;null!=t.size&&(r=-1==t.size?this.getSize():t.size);var n=this._items.slice(e,e+r),i=[],o=[];return n.forEach(function(t){i.push(t.data),o.push(t.metadata)}),{fetchParameters:t,data:i,metadata:o}}},{key:"getDataByKeys",value:function(t){var e,r=this,n=new Map;t&&t.keys&&t.keys.forEach(function(t){for(e=0;e<r._items.length;e++)if(r._items[e].metadata.key==t){n.set(t,r._items[e]);break}});return new this.FetchByKeysResults(t,n)}},{key:"getDataByOffset",value:function(t){var e=[];return t&&(e=this._items.slice(t.offset,t.offset+t.size)),new this.FetchByOffsetResults(t,e,!0)}},{key:"processMutations",value:function(t){null!=t.remove&&this._handleMutationRemove(t.remove),null!=t.add&&this._handleMutationAdd(t.add),null!=t.update&&this._handleMutationUpdate(t.update)}},{key:"reset",value:function(){this._items=[],this._done=!1}},{key:"getSize",value:function(){return this._items.length}},{key:"isDone",value:function(){return this._done}},{key:"_getSortComparator",value:function(t){var r=this;return function(n,i){var o,a,f,u,s;for(o=0;o<t.length;o++){a=t[o][e._DIRECTION],f=t[o][e._ATTRIBUTE],null,u=r._getVal(n,f),s=r._getVal(i,f);var c=0,l="string"==typeof u?u:new String(u).toString(),p="string"==typeof s?s:new String(s).toString();if(0!=(c="ascending"==a?l.localeCompare(p,void 0,{numeric:!0,sensitivity:"base"}):p.localeCompare(l,void 0,{numeric:!0,sensitivity:"base"})))return c}return 0}}},{key:"_getVal",value:function(t,e){if("string"==typeof e){var r=e.indexOf(".");if(r>0){var n=e.substring(0,r),i=e.substring(r+1),o=t[n];if(o)return this._getVal(o,i)}}return"function"==typeof t[e]?t[e]():t[e]}}]),e}();
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
function u(t){"@babel/helpers - typeof";return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=y();return function(){var r,n=v(t);if(e){var i=v(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return p(this,r)}}function p(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?h(t):e}function h(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function y(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function v(t){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}f._DATA="data",f._METADATA="metadata",f._ITEMS="items",f._BEFOREKEYS="addBeforeKeys",f._KEYS="keys",f._INDEXES="indexes",f._FROM="from",f._OFFSET="offset",f._REFRESH="refresh",f._MUTATE="mutate",f._SIZE="size",f._FETCHPARAMETERS="fetchParameters",f._SORTCRITERIA="sortCriteria",f._DIRECTION="direction",f._ATTRIBUTE="attribute",f._VALUE="value",f._DONE="done",f._RESULTS="results",f._CONTAINSPARAMETERS="containsParameters",f._DEFAULT_SIZE=25,f._CONTAINSKEYS="containsKeys",f._FETCHBYKEYS="fetchByKeys",f._FETCHBYOFFSET="fetchByOffset",f._FETCHFIRST="fetchFirst",f._FETCHATTRIBUTES="attributes",t.DataCache=f;var m=function(t){s(r,n);var e=l(r);function r(t){i(this,r);var n={};return n[r._DETAIL]=t,e.call(this,"mutate",n)}return r}();
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
function u(t){"@babel/helpers - typeof";return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=y();return function(){var r,n=v(t);if(e){var i=v(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return p(this,r)}}function p(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?h(t):e}function h(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function y(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function v(t){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}m._DETAIL="detail",t.DataProviderMutationEvent=m,t.DataProviderMutationEvent=m;var b=function(t){s(r,n);var e=l(r);function r(){return i(this,r),e.call(this,"refresh")}return r}();
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
function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,r){return e&&o(t.prototype,e),r&&o(t,r),t}t.DataProviderRefreshEvent=b,t.DataProviderRefreshEvent=b,
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
t.DataProvider=function(){};var _=function(){function t(){i(this,t)}return a(t,[{key:"fetchByKeys",value:function(t){var e=0,r=this.getIterationLimit?this.getIterationLimit():-1,n={size:25},i=new Map,o=this.fetchFirst(n)[Symbol.asyncIterator]();return function t(n,i,o){return i.next().then(function(a){var f=a.value,u=f.data,s=f.metadata,c=s.map(function(t){return t.key}),l=!0;return n.keys.forEach(function(t){o.has(t)||c.map(function(e,r){e==t&&o.set(e,{metadata:s[r],data:u[r]})}),o.has(t)||(l=!1)}),e+=u.length,l||a.done?o:-1!=r&&e>=r?o:t(n,i,o)})}(t,o,i).then(function(e){var r=new Map;return e.forEach(function(t,e){var n=[t];r.set(e,n[0])}),{fetchParameters:t,results:r}})}},{key:"containsKeys",value:function(t){return this.fetchByKeys(t).then(function(e){var r=new Set;return t.keys.forEach(function(t){null!=e.results.get(t)&&r.add(t)}),Promise.resolve({containsParameters:t,results:r})})}},{key:"getCapability",value:function(t){if("fetchByKeys"==t)return{implementation:"iteration"};var e=null;if(!0!==this._ojSkipLastCapability){this._ojSkipLastCapability=!0;for(var r=1;this["_ojLastGetCapability"+r];)++r;for(--r;r>0&&!(e=this["_ojLastGetCapability"+r](t));r--);delete this._ojSkipLastCapability}return e}}],[{key:"applyMixin",value:function(e){var r=e.prototype.getCapability;if([t].forEach(function(t){Object.getOwnPropertyNames(t.prototype).forEach(function(r){"constructor"!==r&&(e.prototype[r]=t.prototype[r])})}),r){for(var n=1;e.prototype["_ojLastGetCapability"+n];)++n;e.prototype["_ojLastGetCapability"+n]=r}}}]),t}();
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
function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,r){return e&&o(t.prototype,e),r&&o(t,r),t}t.FetchByKeysMixin=_,t.FetchByKeysMixin.applyMixin=_.applyMixin;var d=function(){function t(){i(this,t)}return a(t,[{key:"fetchByOffset",value:function(t){var e=t&&t.size>0?t.size:25,r=t?t.sortCriteria:null,n=t&&t.offset>0?t.offset:0,i=0,o=this.getIterationLimit?this.getIterationLimit():-1,a=!1,f={};f.size=e,f.sortCriteria=r;var u=new Array,s=this.fetchFirst(f)[Symbol.asyncIterator]();return function t(r,f,u){return f.next().then(function(s){a=s.done;var c=s.value,l=c.data,p=c.metadata,h=l.length;if(n<i+h)for(var y=n<=i?0:n-i;y<h&&u.length!=e;y++)u.push({metadata:p[y],data:l[y]});return i+=h,u.length<e&&!a?-1!=o&&i>=o?u:t(r,f,u):u})}(t,s,u).then(function(e){return{fetchParameters:t,results:e,done:a}})}},{key:"getCapability",value:function(t){if("fetchByOffset"==t)return{implementation:"iteration"};var e=null;if(!0!==this._ojSkipLastCapability){this._ojSkipLastCapability=!0;for(var r=1;this["_ojLastGetCapability"+r];)++r;for(--r;r>0&&!(e=this["_ojLastGetCapability"+r](t));r--);delete this._ojSkipLastCapability}return e}}],[{key:"applyMixin",value:function(e){var r=e.prototype.getCapability;if([t].forEach(function(t){Object.getOwnPropertyNames(t.prototype).forEach(function(r){"constructor"!==r&&(e.prototype[r]=t.prototype[r])})}),r){for(var n=1;e.prototype["_ojLastGetCapability"+n];)++n;e.prototype["_ojLastGetCapability"+n]=r}}}]),t}();
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
function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,r){return e&&o(t.prototype,e),r&&o(t,r),t}t.FetchByOffsetMixin=d,t.FetchByOffsetMixin.applyMixin=d.applyMixin;var g=function(){function e(t){i(this,e),t=t||{},this._textFilterAttributes=t.filterOptions?t.filterOptions.textFilterAttributes:null;var r=t.filterDef;r&&(r.op?(this.op=r.op,r.value?(this.value=r.value,r.attribute&&(this.attribute=r.attribute)):r.criteria&&(this.criteria=r.criteria)):r.text&&(this.text=r.text))}return a(e,[{key:"filter",value:function(r,n,i){return t.FilterUtils.satisfy(e._transformFilter(this),r)}}],[{key:"_transformFilter",value:function(t){var r;if(t){var n,i=t.op;if(t.text?i="$regex":"$le"===i?i="$lte":"$ge"===i?i="$gte":"$pr"===i&&(i="$exists"),"$and"!=i&&"$or"!=i){n=t.text?new RegExp(t.text.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),"i"):t.value,r={};var o=t.attribute;if(o){var a={};"$sw"!==i&&"$ew"!==i&&"$co"!==i||(i="$regex",n=e._fixStringExpr(i,n)),a[i]=n,r[o]=a}else if(t.text){var f={};if(f[i]=n,t._textFilterAttributes){var u=[];t._textFilterAttributes.forEach(function(t){var e={};e[t]=f,u.push(e)}),r.$or=u}else r["*"]=f}else{var s=[];e._transformObjectExpr(n,i,null,s),r.$and=s}}else{var c=[];t.criteria.forEach(function(t){c.push(e._transformFilter(t))}),(r={})[i]=c}}return r}},{key:"_transformObjectExpr",value:function(t,r,n,i){if(Object.keys(t).length>0)Object.keys(t).forEach(function(o){var a=t[o],f=n?n+"."+o:o;if(a instanceof Object)e._transformObjectExpr(a,r,f,i);else{var u={};"$sw"!==r&&"$ew"!==r&&"$co"!==r||(r="$regex",a=e._fixStringExpr(r,a)),u[r]=a;var s={};s[f]=u,i.push(s)}});else{var o={};o[r]=t;var a={};a[n]=o,i.push(a)}}},{key:"_fixStringExpr",value:function(t,e){return("string"==typeof e||e instanceof String)&&("$sw"===t?e="^"+e:"$ew"===t&&(e+="$")),e}}]),e}(),E=function(){function t(){i(this,t)}return a(t,null,[{key:"getFilter",value:function(t){return new g(t)}}]),t}();
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
function u(t){"@babel/helpers - typeof";return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}t.FilterFactory=E,t.FilterUtils=function(){function t(t,e){var r=!1;for(var i in e)if(e.hasOwnProperty(i)){var o=e[i];if(r||!n(i))throw new Error("parsing error "+e);t.operator=i,t.right=o,r=!0}}function e(t,e,r){var n;if("$lt"===t)return(r=(n=o(r,e))[0])<(e=n[1]);if("$gt"===t)return(r=(n=o(r,e))[0])>(e=n[1]);if("$lte"===t)return(r=(n=o(r,e))[0])<=(e=n[1]);if("$gte"===t)return(r=(n=o(r,e))[0])>=(e=n[1]);if("$eq"===t)return r===e;if("$ne"===t)return r!==e;if("$regex"===t){if(r){if("string"!=typeof r&&!(r instanceof String))if(r instanceof Object){if("[object Object]"==(r=r.toString()))return!1}else r=new String(r);return null!==r.match(e)}return!1}if("$exists"===t)return e?null!=r:null==r;throw new Error("not a valid expression! "+expTree)}function r(t){return"$and"===t||"$or"===t}function n(t){return"$lt"===t||"$gt"===t||"$lte"===t||"$gte"===t||"$eq"===t||"$ne"===t||"$regex"===t||"$exists"===t}function i(t){return null!=t&&(t instanceof String||"string"==typeof t)}function o(t,e){return i(t)&&null==e?e="":i(e)&&null==t&&(t=""),[t,e]}function a(t,e){for(var r=t.split("."),n=e,i=0;i<r.length;i++)n=n[r[i]];return n}return{satisfy:function(i,o){return!i||function t(i,o){var f=i.operator;if(r(f)){if(!i.left&&i.array instanceof Array){for(var u,s=i.array,c=0;c<s.length;c++){var l=t(s[c],o);if("$or"===f&&!0===l)return!0;if("$and"===f&&!1===l)return!1;u=l}return u}throw new Error("invalid expression tree!"+i)}if(n(f)){var p,h=i.right;if("*"!=i.left)return p=a(i.left,o),e(f,h,p);var y,v=Object.keys(o);for(y=0;y<v.length;y++)if(p=a(v[y],o),e(f,h,p))return!0;return!1}throw new Error("not a valid expression!"+i)}(function e(i){var o,a=[];for(var f in i)if(i.hasOwnProperty(f)){var s=i[f];if(0===f.indexOf("$")){if(r(f)){if(!(s instanceof Array))throw new Error("not a valid expression: "+i);o={operator:f,array:[]};for(var c=0;c<s.length;c++){var l=e(s[c]);o.array.push(l)}}else if(n(f))throw new Error("not a valid expression: "+i)}else if("object"!==u(s))a.push({left:f,right:s,operator:"$eq"});else{var p={left:f};t(p,s),a.push(p)}}return a.length>1?o={operator:"$and",array:a}:1===a.length&&(o=a[0]),o}(i),o)},getValue:a,assembleObject:function(t,e){var r;if(e){r={};for(var n=0;n<e.length;n++)for(var i=r,o=t,a=e[n].split("."),f=0;f<a.length;f++)o=o[a[f]],!i[a[f]]&&f<a.length-1&&(i[a[f]]={}),f===a.length-1?i[a[f]]=o:i=i[a[f]]}else r=t;return r}}}();
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
var O={};return O.FetchByKeysMixin=t.FetchByKeysMixin,O.FetchByOffsetMixin=t.FetchByOffsetMixin,O.FilterFactory=t.FilterFactory,O.DataProviderRefreshEvent=t.DataProviderRefreshEvent,O.DataProviderMutationEvent=t.DataProviderMutationEvent,O.AttributeFilterOperator=t.AttributeFilterOperator,O.CompoundFilterOperator=t.CompoundFilterOperator,O.DataCache=t.DataCache,O});