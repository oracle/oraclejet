/*!
 * jQuery UI Disable Selection 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery","./version"],factory)}else if(typeof module==="object"&&module.exports){require("./version");module.exports=factory(require("jquery"))}else{factory(jQuery)}})((function($){"use strict";return $.fn.extend({disableSelection:function(){var eventType="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.on(eventType+".ui-disableSelection",(function(event){event.preventDefault()}))}}(),enableSelection:function(){return this.off(".ui-disableSelection")}})}));
