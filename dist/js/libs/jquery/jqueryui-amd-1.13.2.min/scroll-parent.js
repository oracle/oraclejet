/*!
 * jQuery UI Scroll Parent 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery","./version"],factory)}else if(typeof module==="object"&&module.exports){require("./version");module.exports=factory(require("jquery"))}else{factory(jQuery)}})((function($){"use strict";return $.fn.scrollParent=function(includeHidden){var position=this.css("position"),excludeStaticParent=position==="absolute",overflowRegex=includeHidden?/(auto|scroll|hidden)/:/(auto|scroll)/,scrollParent=this.parents().filter((function(){var parent=$(this);if(excludeStaticParent&&parent.css("position")==="static"){return false}return overflowRegex.test(parent.css("overflow")+parent.css("overflow-y")+parent.css("overflow-x"))})).eq(0);return position==="fixed"||!scrollParent.length?$(this[0].ownerDocument||document):scrollParent}}));
