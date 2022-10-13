/*!
 * jQuery UI Form Reset Mixin 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery","./form","./version"],factory)}else if(typeof module==="object"&&module.exports){require("./form");require("./version");module.exports=factory(require("jquery"))}else{factory(jQuery)}})((function($){"use strict";return $.ui.formResetMixin={_formResetHandler:function(){var form=$(this);setTimeout((function(){var instances=form.data("ui-form-reset-instances");$.each(instances,(function(){this.refresh()}))}))},_bindFormResetHandler:function(){this.form=this.element._form();if(!this.form.length){return}var instances=this.form.data("ui-form-reset-instances")||[];if(!instances.length){this.form.on("reset.ui-form-reset",this._formResetHandler)}instances.push(this);this.form.data("ui-form-reset-instances",instances)},_unbindFormResetHandler:function(){if(!this.form.length){return}var instances=this.form.data("ui-form-reset-instances");instances.splice($.inArray(this,instances),1);if(instances.length){this.form.data("ui-form-reset-instances",instances)}else{this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")}}}}));
