/*!
 * jQuery UI Tabbable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery","./version","./focusable"],factory)}else if(typeof module==="object"&&module.exports){require("./version");require("./focusable");module.exports=factory(require("jquery"))}else{factory(jQuery)}})((function($){"use strict";return $.extend($.expr.pseudos,{tabbable:function(element){var tabIndex=$.attr(element,"tabindex"),hasTabindex=tabIndex!=null;return(!hasTabindex||tabIndex>=0)&&$.ui.focusable(element,hasTabindex)}})}));
