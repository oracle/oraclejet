/*!
 * jQuery UI Labels 1.14.1
 * https://jqueryui.com
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","./version"],e):"object"==typeof module&&module.exports?(require("./version"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.fn.labels=function(){var e,t,s,i,n;return this.length?this[0].labels&&this[0].labels.length?this.pushStack(this[0].labels):(i=this.eq(0).parents("label"),(s=this.attr("id"))&&(n=(e=this.eq(0).parents().last()).add(e.length?e.siblings():this.siblings()),t="label[for='"+CSS.escape(s)+"']",i=i.add(n.find(t).addBack(t))),this.pushStack(i)):this.pushStack([])}}));