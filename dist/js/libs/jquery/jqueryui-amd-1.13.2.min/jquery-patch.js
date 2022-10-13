/*!
 * jQuery UI Support for jQuery core 1.8.x and newer 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery","./version"],factory)}else if(typeof module==="object"&&module.exports){require("./version");module.exports=factory(require("jquery"))}else{factory(jQuery)}})((function($){"use strict";if(!$.expr.pseudos){$.expr.pseudos=$.expr[":"]}if(!$.uniqueSort){$.uniqueSort=$.unique}if(!$.escapeSelector){var rcssescape=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;var fcssescape=function(ch,asCodePoint){if(asCodePoint){if(ch==="\0"){return"�"}return ch.slice(0,-1)+"\\"+ch.charCodeAt(ch.length-1).toString(16)+" "}return"\\"+ch};$.escapeSelector=function(sel){return(sel+"").replace(rcssescape,fcssescape)}}if(!$.fn.even||!$.fn.odd){$.fn.extend({even:function(){return this.filter((function(i){return i%2===0}))},odd:function(){return this.filter((function(i){return i%2===1}))}})}}));
