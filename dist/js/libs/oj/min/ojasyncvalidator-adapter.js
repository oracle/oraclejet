/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function(){"use strict";return class{constructor(t){this.options=t}validate(t){let i=this;if(!this._validator)return this._InitLoadingPromise(),this._loadingPromise.then(function(e){i._validator=new e.default(i.options);try{i._validator.validate(t)}catch(t){return Promise.reject(t)}return null});try{this._validator.validate(t)}catch(t){return Promise.reject(t)}return Promise.resolve(null)}_GetHint(){let t=this;return this._validator?Promise.resolve(t._validator.getHint()):(this._InitLoadingPromise(),this._loadingPromise.then(function(i){return t._validator=new i.default(t.options),t._validator.getHint()}))}_InitLoadingPromise(){}}});
//# sourceMappingURL=ojasyncvalidator-adapter.js.map