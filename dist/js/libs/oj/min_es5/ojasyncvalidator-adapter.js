!function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function(){"use strict";return function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.options=t}var i,n,r;return i=e,(n=[{key:"validate",value:function(t){var e=this;if(!this._validator)return this._InitLoadingPromise(),this._loadingPromise.then(function(i){e._validator=new i.default(e.options);try{e._validator.validate(t)}catch(t){return Promise.reject(t)}return null});try{this._validator.validate(t)}catch(t){return Promise.reject(t)}return Promise.resolve(null)}},{key:"_GetHint",value:function(){var t=this;return this._validator?Promise.resolve(t._validator.getHint()):(this._InitLoadingPromise(),this._loadingPromise.then(function(e){return t._validator=new e.default(t.options),t._validator.getHint()}))}},{key:"_InitLoadingPromise",value:function(){}}])&&t(i.prototype,n),r&&t(i,r),e}()})}();
//# sourceMappingURL=ojasyncvalidator-adapter.js.map