/*!
 * jQuery UI Form Reset Mixin 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./form","./version"],e):"object"==typeof module&&module.exports?(require("./form"),require("./version"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.ui.formResetMixin={_formResetHandler:function(){var t=e(this);setTimeout((function(){var r=t.data("ui-form-reset-instances");e.each(r,(function(){this.refresh()}))}))},_bindFormResetHandler:function(){if(this.form=this.element._form(),this.form.length){var e=this.form.data("ui-form-reset-instances")||[];e.length||this.form.on("reset.ui-form-reset",this._formResetHandler),e.push(this),this.form.data("ui-form-reset-instances",e)}},_unbindFormResetHandler:function(){if(this.form.length){var t=this.form.data("ui-form-reset-instances");t.splice(e.inArray(this,t),1),t.length?this.form.data("ui-form-reset-instances",t):this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")}}}}));