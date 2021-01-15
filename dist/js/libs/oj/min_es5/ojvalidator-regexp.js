/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojtranslation","ojs/ojvalidator","ojs/ojvalidation-error"],function(t,o,e,a){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;
/**
   * @license
   * Copyright (c) 2008 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var r=function(t){this.Init(t)};return t.Object.createSubclass(r,e,"oj.RegExpValidator"),r._BUNDLE_KEY_DETAIL="oj-validator.regExp.detail",r._BUNDLE_KEY_SUMMARY="oj-validator.regExp.summary",r.prototype.Init=function(t){r.superclass.Init.call(this),this._options=t},r.prototype.validate=function(t){var e,r,i,n=this._options&&this._options.pattern||"";if(null!=t&&""!==t){var s=t.toString(),l="^("+n+")$",p=s.match(l);if(null===p||p[0]!==s){this._options&&(i=this._options.messageSummary||null,e=this._options.messageDetail||null,r=this._options&&this._options.label||"");var u={label:r,pattern:n,value:s},_=i?o.applyParameters(i,u):o.getTranslatedString(this._getSummaryKey(),u),h=e?o.applyParameters(e,u):o.getTranslatedString(this._getDetailKey(),u);throw new a.ValidatorError(_,h)}}},r.prototype.getHint=function(){var t=null,e={};return this._options&&this._options.hint&&(e={pattern:this._options.pattern},t=o.applyParameters(this._options.hint,e)),t},r.prototype._getSummaryKey=function(){return r._BUNDLE_KEY_SUMMARY},r.prototype._getDetailKey=function(){return r._BUNDLE_KEY_DETAIL},r});
//# sourceMappingURL=ojvalidator-regexp.js.map