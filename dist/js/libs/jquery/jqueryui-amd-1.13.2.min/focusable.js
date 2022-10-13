/*!
 * jQuery UI Focusable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery","./version"],factory)}else if(typeof module==="object"&&module.exports){require("./version");module.exports=factory(require("jquery"))}else{factory(jQuery)}})((function($){"use strict";$.ui.focusable=function(element,hasTabindex){var map,mapName,img,focusableIfVisible,fieldset,nodeName=element.nodeName.toLowerCase();if("area"===nodeName){map=element.parentNode;mapName=map.name;if(!element.href||!mapName||map.nodeName.toLowerCase()!=="map"){return false}img=$("img[usemap='#"+mapName+"']");return img.length>0&&img.is(":visible")}if(/^(input|select|textarea|button|object)$/.test(nodeName)){focusableIfVisible=!element.disabled;if(focusableIfVisible){fieldset=$(element).closest("fieldset")[0];if(fieldset){focusableIfVisible=!fieldset.disabled}}}else if("a"===nodeName){focusableIfVisible=element.href||hasTabindex}else{focusableIfVisible=hasTabindex}return focusableIfVisible&&$(element).is(":visible")&&visible($(element))};function visible(element){var visibility=element.css("visibility");while(visibility==="inherit"){element=element.parent();visibility=element.css("visibility")}return visibility==="visible"}$.extend($.expr.pseudos,{focusable:function(element){return $.ui.focusable(element,$.attr(element,"tabindex")!=null)}});return $.ui.focusable}));
