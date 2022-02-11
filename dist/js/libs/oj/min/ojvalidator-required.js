/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojtranslation","ojs/ojvalidator","ojs/ojvalidation-error"],function(t,e,o,r){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o;const i=function(t){this.Init(t)};return t.Object.createSubclass(i,o,"oj.RequiredValidator"),i._BUNDLE_KEY_DETAIL="oj-validator.required.detail",i._BUNDLE_KEY_SUMMARY="oj-validator.required.summary",i.prototype.Init=function(t){i.superclass.Init.call(this),this._options=t},i.prototype.validate=function(t){var o,i,a,n,s,l="";if(null==t||("string"==typeof t||t instanceof Array)&&0===t.length)throw this._options&&(o=this._options.messageDetail||this._options.message||null,n=this._options.messageSummary||null,l=this._options.label||""),s={label:l},a=n?e.applyParameters(n,s):e.getTranslatedString(this._getSummaryKey(),s),i=o?e.applyParameters(o,s):e.getTranslatedString(this._getDetailKey(),s),new r.ValidatorError(a,i)},i.prototype.getHint=function(){var t="";return this._options&&this._options.hint&&(t=e.getTranslatedString(this._options.hint)),t},i.prototype._getSummaryKey=function(){return i._BUNDLE_KEY_SUMMARY},i.prototype._getDetailKey=function(){return i._BUNDLE_KEY_DETAIL},i});
//# sourceMappingURL=ojvalidator-required.js.map