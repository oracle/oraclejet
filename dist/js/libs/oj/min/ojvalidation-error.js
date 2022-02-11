/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore","ojs/ojmessaging"],function(e,r,t){"use strict";r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;const o=function(e,r){var o={summary:e,detail:r,severity:t.SEVERITY_LEVEL.ERROR};this.Init(o)};o.prototype=new Error,r._registerLegacyNamespaceProp("ValidatorError",o),o.prototype.Init=function(e){var r=e.detail,t=e.summary;this._message=e,this.name="Validator Error",this.message=r||t},o.prototype.getMessage=function(){return this._message};const s=function(e,r){var o={summary:e,detail:r,severity:t.SEVERITY_LEVEL.ERROR};this.Init(o)};s.prototype=new Error,r._registerLegacyNamespaceProp("ConverterError",s),s.prototype.Init=function(e){var r=e.detail,t=e.summary;this._message=e,this.name="Converter Error",this.message=r||t},s.prototype.getMessage=function(){return this._message},e.ConverterError=s,e.ValidatorError=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojvalidation-error.js.map