/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define([],function(){"use strict";function t(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(){function i(t){!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,i),this.options=t}var e,n,r;return e=i,(n=[{key:"validate",value:function(t){var i=this;if(!this._validator)return this._InitLoadingPromise(),this._loadingPromise.then(function(e){i._validator=new e(i.options);try{i._validator.validate(t)}catch(t){return Promise.reject(t)}return null});try{this._validator.validate(t)}catch(t){return Promise.reject(t)}return Promise.resolve(null)}},{key:"_GetHint",value:function(){var t=this;return this._validator?Promise.resolve(t._validator.getHint()):(this._InitLoadingPromise(),this._loadingPromise.then(function(i){return t._validator=new i(t.options),t._validator.getHint()}))}},{key:"_InitLoadingPromise",value:function(){}}])&&t(e.prototype,n),r&&t(e,r),i}()});