/*!
 * jQuery UI Effects Explode 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery","../version","../effect"],e):"object"==typeof module&&module.exports?(require("../version"),require("../effect"),module.exports=e(require("jquery"))):e(jQuery)}((function(e){"use strict";return e.effects.define("explode","hide",(function(i,t){var o,s,n,r,f,d,u=i.pieces?Math.round(Math.sqrt(i.pieces)):3,c=u,l=e(this),p="show"===i.mode,a=l.show().css("visibility","hidden").offset(),h=Math.ceil(l.outerWidth()/c),v=Math.ceil(l.outerHeight()/u),y=[];function b(){y.push(this),y.length===u*c&&(l.css({visibility:"visible"}),e(y).remove(),t())}for(o=0;o<u;o++)for(r=a.top+o*v,d=o-(u-1)/2,s=0;s<c;s++)n=a.left+s*h,f=s-(c-1)/2,l.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-s*h,top:-o*v}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:h,height:v,left:n+(p?f*h:0),top:r+(p?d*v:0),opacity:p?0:1}).animate({left:n+(p?0:f*h),top:r+(p?0:d*v),opacity:p?1:0},i.duration||500,i.easing,b)}))}));