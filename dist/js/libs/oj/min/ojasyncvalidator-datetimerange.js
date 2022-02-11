/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require","ojs/ojasyncvalidator-adapter"],function(e,t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
return class extends t{constructor(e){super(e),this.options=e}get hint(){return super._GetHint()}_InitLoadingPromise(){this._loadingPromise||(this._loadingPromise=new Promise(function(t,r){e(["ojs/ojvalidator-datetimerange"],function(e){t(function(e){if(e&&e.__esModule)return e;var t={};return e&&Object.keys(e).forEach(function(r){var n=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:function(){return e[r]}})}),t.default=e,t}(e))},r)}))}}});
//# sourceMappingURL=ojasyncvalidator-datetimerange.js.map