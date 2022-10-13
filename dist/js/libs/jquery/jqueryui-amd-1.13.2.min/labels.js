/*!
 * jQuery UI Labels 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery","./version"],factory)}else if(typeof module==="object"&&module.exports){require("./version");module.exports=factory(require("jquery"))}else{factory(jQuery)}})((function($){"use strict";return $.fn.labels=function(){var ancestor,selector,id,labels,ancestors;if(!this.length){return this.pushStack([])}if(this[0].labels&&this[0].labels.length){return this.pushStack(this[0].labels)}labels=this.eq(0).parents("label");id=this.attr("id");if(id){ancestor=this.eq(0).parents().last();ancestors=ancestor.add(ancestor.length?ancestor.siblings():this.siblings());selector="label[for='"+$.escapeSelector(id)+"']";labels=labels.add(ancestors.find(selector).addBack(selector))}return this.pushStack(labels)}}));
