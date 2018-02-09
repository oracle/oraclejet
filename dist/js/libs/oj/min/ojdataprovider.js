/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","ojs/ojeventtarget"],function(a){var g=a.Kca;a.uCa=function(){};o_("IteratingDataProvider",a.uCa,a);var c=function(b){function a(c){var f=this,f={};f[a.l_]=c;return f=b.call(this,"mutate",f)||this}__extends(a,b);return a}(g);c.l_="detail";a.P7a=c;a.IteratingDataProviderMutationEvent=c;a.YBa=function(){};o_("DataProvider",a.YBa,a);c=function(){function b(){}b.prototype.fetchByKeys=function(b){function a(b,d,k){return d.next().then(function(g){var l=g.value,q=l.data,r=l.metadata,
u=r.map(function(b){return b.key}),w=!0;b.keys.forEach(function(b){k.has(b)||u.map(function(a,c){a==b&&k.set(a,{metadata:r[c],data:q[c]})});k.has(b)||(w=!1)});c+=q.length;return w||g.done?k:-1!=h&&c>=h?k:a(b,d,k)})}var c=0,h=this.getIterationLimit?this.getIterationLimit():-1,k=new Map,g=this.fetchFirst({size:25})[Symbol.asyncIterator]();return a(b,g,k).then(function(a){var c=new Map;a.forEach(function(b,a){c.set(a,b)});return{fetchParameters:b,results:c}})};b.prototype.containsKeys=function(b){return this.fetchByKeys(b).then(function(a){var c=
new Set;b.keys.forEach(function(b){null!=a.results.get(b)&&c.add(b)});return Promise.resolve({containsParameters:b,results:c})})};b.prototype.getCapability=function(b){if("fetchByKeys"==b)return{implementation:"iteration"};var a=null;if(!0!==this._ojSkipLastCapability){this._ojSkipLastCapability=!0;for(var c=1;this["_ojLastGetCapability"+c];)++c;for(--c;0<c&&!(a=this["_ojLastGetCapability"+c](b));c--);delete this._ojSkipLastCapability}return a};b.Lx=function(a){var c=a.prototype.getCapability;[b].forEach(function(b){Object.getOwnPropertyNames(b.prototype).forEach(function(c){"constructor"!==
c&&(a.prototype[c]=b.prototype[c])})});if(c){for(var f=1;a.prototype["_ojLastGetCapability"+f];)++f;a.prototype["_ojLastGetCapability"+f]=c}};return b}();a.FetchByKeysMixin=c;a.FetchByKeysMixin.applyMixin=c.Lx;c=function(){function b(){}b.prototype.fetchByOffset=function(b){function a(b,d,h){return d.next().then(function(t){n=t.done;var u=t.value;t=u.data;var u=u.metadata,w=t.length;if(k<g+w)for(var v=k<=g?0:k-g;v<w&&h.length!=c;v++)h.push({metadata:u[v],data:t[v]});g+=w;return h.length<c&&!n?-1!=
m&&g>=m?h:a(b,d,h):h})}var c=b&&0<b.size?b.size:25,h=b?b.sortCriteria:null,k=b&&0<b.offset?b.offset:0,g=0,m=this.getIterationLimit?this.getIterationLimit():-1,n=!1,t={};t.size=c;t.sortCriteria=h;h=this.fetchFirst(t)[Symbol.asyncIterator]();return a(b,h,[]).then(function(a){return{fetchParameters:b,results:a,done:n}})};b.prototype.getCapability=function(b){if("fetchByOffset"==b)return{implementation:"iteration"};var a=null;if(!0!==this._ojSkipLastCapability){this._ojSkipLastCapability=!0;for(var c=
1;this["_ojLastGetCapability"+c];)++c;for(--c;0<c&&!(a=this["_ojLastGetCapability"+c](b));c--);delete this._ojSkipLastCapability}return a};b.Lx=function(a){var c=a.prototype.getCapability;[b].forEach(function(b){Object.getOwnPropertyNames(b.prototype).forEach(function(c){"constructor"!==c&&(a.prototype[c]=b.prototype[c])})});if(c){for(var f=1;a.prototype["_ojLastGetCapability"+f];)++f;a.prototype["_ojLastGetCapability"+f]=c}};return b}();a.FetchByOffsetMixin=c;a.FetchByOffsetMixin.applyMixin=c.Lx;
c=function(b){function a(){return b.call(this,"refresh")||this}__extends(a,b);return a}(g);a.FC=c;a.DataProviderRefreshEvent=c;g=function(b){function a(c){var f=this,f={};f[a.l_]=c;return f=b.call(this,"mutate",f)||this}__extends(a,b);return a}(g);g.l_="detail";a.tH=g;a.DataProviderMutationEvent=g});