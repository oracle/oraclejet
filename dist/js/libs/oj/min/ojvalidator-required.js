/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojtranslation","ojs/ojvalidator","ojs/ojvalidation-error"],function(t,e,o,i){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o;const r=function(t){this.Init(t)};return t.Object.createSubclass(r,o,"oj.RequiredValidator"),r._BUNDLE_KEY_DETAIL="oj-validator.required.detail",r._BUNDLE_KEY_SUMMARY="oj-validator.required.summary",r.prototype.Init=function(t){r.superclass.Init.call(this),this._options=t},r.prototype.validate=function(t){var o,r,n,a,s,l="";if(null==t||("string"==typeof t||t instanceof Array)&&0===t.length)throw this._options&&(o=this._options.messageDetail||this._options.message||null,a=this._options.messageSummary||null,l=this._options.label||""),s={label:l},n=a?e.applyParameters(a,s):e.getTranslatedString(this._getSummaryKey(),s),null==o||"string"==typeof o?r=o?e.applyParameters(o,s):e.getTranslatedString(this._getDetailKey(),s):"function"==typeof o&&(r=o(s)),new i.ValidatorError(n,r)},r.prototype.getHint=function(){var t="";return this._options&&this._options.hint&&(t=e.getTranslatedString(this._options.hint)),t},r.prototype._getSummaryKey=function(){return r._BUNDLE_KEY_SUMMARY},r.prototype._getDetailKey=function(){return r._BUNDLE_KEY_DETAIL},r});
//# sourceMappingURL=ojvalidator-required.js.map