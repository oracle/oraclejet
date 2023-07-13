/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","jquery","ojs/ojdomutils","ojs/ojthemeutils","ojs/ojlogger"],function(e,t,n,i,a,o){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;const r="translate(",s=") translateZ(0)",l={};t._registerLegacyNamespaceProp("AnimationUtils",l),l._getName=function(e,t){if(!l._nameMap){l._nameMap={};var n=l._nameMap,i=e.style;n.backfaceVisibility=void 0!==i.webkitBackfaceVisibility?"webkitBackfaceVisibility":"backfaceVisibility",n.transform=void 0!==i.webkitTransform?"webkitTransform":"transform",n.transformOrigin=void 0!==i.webkitTransformOrigin?"webkitTransformOrigin":"transformOrigin",n.transition=void 0!==i.webkitTransition?"webkitTransition":"transition",n.transitionend=void 0!==i.webkitTransition?"webkitTransitionEnd":"transitionend"}return l._nameMap[t]||t},l._getElementStyle=function(e,t){return e.style[l._getName(e,t)]},l._setElementStyle=function(e,t,n){e.style[l._getName(e,t)]=n},l._animate=function(e,t,i,a,o,r){var s=[].concat(o),f=function(n,f){var d=function(e){var t=0===e.propertyName.indexOf("-webkit-")?e.propertyName.substr(8):e.propertyName;t=l._getCamelCasePropName(t);var n=s.indexOf(t);n>-1&&(s.length>1?s.splice(n,1):m())},c=0,u=!1;function m(){u||(c&&(window.cancelAnimationFrame(c),c=0),e.removeEventListener(l._getName(e,"transitionend"),d),n&&n(!0),u=!0)}null==i&&(i={}),null==i.css&&(i.css={}),i.css.transition=l._createTransitionValue(e,o,a);var p=l._saveStyle(e,t,i,a,r||o);l._applyState(e,t,p>1),e.addEventListener(l._getName(e,"transitionend"),d);var g=a.duration,h=a.delay,v=a._skipPromise;function _(){c=0,l._applyState(e,i,p>1)}null==t?_():(a._noReflow||(l._x=e.offsetWidth),c=window.requestAnimationFrame(_));var y=l._getTotalTiming(g,h);v||setTimeout(m,y+100)};return a._skipPromise?(f(null),null):new Promise(f).then(function(){t&&t.addClass&&n(e).removeClass(t.addClass),i&&i.addClass&&n(e).removeClass(i.addClass),l._restoreStyle(e)})},l._saveCssValues=function(e,t,n,i){for(var a=Object.keys(t),o=Object.prototype.hasOwnProperty,r=0;r<a.length;r++){var s=a[r];o.call(n,s)||i&&-1!==i.indexOf(s)||(n[s]=l._getElementStyle(e,s))}},l._saveStyle=function(e,t,n,i,a){var o=e._ojSavedStyle||{},r=t&&t.css?t.css:{},s=n&&n.css?n.css:{},f=a;i&&"all"===i.persist||(f=null),l._saveCssValues(e,r,o,f),l._saveCssValues(e,s,o,f),e._ojSavedStyle=o;var d=e._ojEffectCount||0;return d+=1,e._ojEffectCount=d,d},l._restoreStyle=function(e){var t=e,n=t._ojEffectCount;if(n>1)t._ojEffectCount=n-1;else{var i=t._ojSavedStyle;if(i){for(var a=Object.keys(i),o=0;o<a.length;o++){var r=a[o];l._setElementStyle(t,r,i[r])}delete t._ojSavedStyle,delete t._ojEffectCount}}},l._getCamelCasePropName=function(e){if(e.indexOf("-")>=0){for(var t="",n=e.split("-"),i=0;i<n.length;i++){var a=n[i];a&&(t?t+=a.charAt(0).toUpperCase()+a.slice(1):t=a)}return t}return e},l._getHyphenatedPropName=function(e){var t=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();return 0===t.indexOf("webkit")&&(t="-"+t),t},l._concatMultiValue=function(e,t,n,i,a){if(t.css[n]){var o=l._getElementStyle(e,n);o&&0!==o.indexOf(i)&&(t.css[n]=o+a+t.css[n])}},l._splitTransform=function(e){var t=[];if(e&&"none"!==e)for(var n=e,i=n.indexOf(")");i>0;){var a=n.substr(0,i+1);t.push(a.trim()),i=(n=n.slice(i+1)).indexOf(")")}return t},l._getTransformFuncName=function(e){var t=e.indexOf("(");return t>=1?e.substr(0,t):e},l._applyTransform=function(e,t){for(var n=l._getElementStyle(e,"transform"),i=l._splitTransform(n),a=l._splitTransform(t),o=[],r=0;r<a.length;r++){var s=l._getTransformFuncName(a[r]),f=!1;if(s)for(var d=0;d<i.length;d++)0===i[d].indexOf(s+"(")&&(i[d]=a[r],f=!0);f||o.push(a[r])}return(i=i.concat(o)).join(" ")},l._applyState=function(e,t,i){if(t){if(t.css){var a="transform";i&&l._concatMultiValue(e,t,"transition","all",", "),t.css[a]&&(t.css[a]=l._applyTransform(e,t.css[a]));for(var o=t.css,r=Object.keys(o),s=0;s<r.length;s++){var f=r[s];l._setElementStyle(e,f,o[f])}}t.addClass&&n(e).addClass(t.addClass),t.removeClass&&n(e).removeClass(t.removeClass)}},l._getTimingValue=function(e){var t=parseFloat(e);return isNaN(t)?0:e.indexOf("ms")>-1?t:1e3*t},l._getTotalTiming=function(e,t){var n=l._getTimingValue(e);return n>0?n+(t?l._getTimingValue(t):0):0},l._calcCssTime=function(e,t,n){for(var i=e.split(","),a=t.split(","),o=n.split(","),r=i.length,s=a.length,f=o.length,d=0,c=0;c<r;c++){var u=o[c%f],m=a[c%s],p=l._getTotalTiming(u,m);d=Math.max(d,p)}return d},l._calcEffectTime=function(e){var t,n,i,a=window.getComputedStyle(e);t=a.animationName||a.webkitAnimationName,n=a.animationDelay||a.webkitAnimationDelay,i=a.animationDuration||a.webkitAnimationDuration;var o=l._calcCssTime(t,n,i);t=a.transitionProperty||a.webkitTransitionProperty,n=a.transitionDelay||a.webkitTransitionDelay,i=a.transitionDuration||a.webkitTransitionDuration;var r=l._calcCssTime(t,n,i);return Math.max(o,r)},l._fillEmptyOptions=function(e,t){e.delay=e.delay||t.delay,e.duration=e.duration||t.duration,e.timingFunction=e.timingFunction||t.timingFunction,e.persist=e.persist||t.persist},l._triggerEvent=function(e,t,n,i){var a;if(i&&i._trigger)a=!i._trigger(t,null,n);else{var o="oj"+t.substr(0,1).toUpperCase()+t.substr(1),r=new CustomEvent(o,{detail:n,bubbles:!0,cancelable:!0}),s=i||e;s.dispatchEvent&&s.dispatchEvent(r),a=r.defaultPrevented}return a},l.startAnimation=function(e,t,i,a){return e=n(e)[0],new Promise(function(o,r){var s=n(e),f="oj-animate-"+t,d=f+"-active",c=!1,u=!1,m=function(){if(c&&u){s.removeClass(f),s.removeClass(d),l._restoreStyle(e),o(!0);var n={action:t,element:e};l._triggerEvent(e,"animateEnd",n,a)}},p=function(){c=!0,m()},g=function(){u=!0,m()};l._saveStyle(e,null,null,null,null);var h={action:t,element:e,endCallback:p};if(!l._triggerEvent(e,"animateStart",h,a)){for(var v=[].concat(i),_=[],y={},x=0;x<v.length;x++){var b,C=v[x],O="";null!=C&&"none"!==C&&("string"==typeof C?(O=C,b={}):"object"==typeof C&&(O=C.effect,b=n.extend({},C)),l._fillEmptyOptions(b,y),y=n.extend({},b)),O&&l[O]&&_.push(l[O](e,b))}_.length?Promise.all(_).then(p):p()}s.addClass(f);var w=window.requestAnimationFrame(function(){w=0,s.addClass(d);var t=l._calcEffectTime(e);t>0?setTimeout(g,t+100):g()});setTimeout(function(){w&&(window.cancelAnimationFrame(w),w=0,g())},1e3)})},l._mergeOptions=function(e,t){return null==l._defaultOptions&&(l._defaultOptions=a.parseJSONFromFontFamily("oj-animation-effect-default-options")),n.extend({duration:"400ms"},l._defaultOptions?l._defaultOptions[e]:null,t)},l._createTransitionValue=function(e,t,n){var i="";if(t)for(var a=0;a<t.length;a++){var o=l._getName(e,t[a]);i+=(a>0?", ":"")+l._getHyphenatedPropName(o)+" "+n.duration,n.timingFunction&&(i+=" "+n.timingFunction),n.delay&&(i+=" "+n.delay)}return i},l._fade=function(e,t,n,i,a){var o=l._mergeOptions(n,t),r={css:{opacity:i}},s={css:{opacity:a}};return o&&(o.startOpacity&&(r.css.opacity=o.startOpacity),o.endOpacity&&(s.css.opacity=o.endOpacity)),l._animate(e,r,s,o,["opacity"])},l.fadeIn=function(e,t){return l._fade(e,t,"fadeIn",0,1)},l.fadeOut=function(e,t){return l._fade(e,t,"fadeOut",1,0)},l.expand=function(e,t){return l._expandCollapse(e,t,!0)},l.collapse=function(e,t){return l._expandCollapse(e,t,!1)},l._wrapRowContent=function(e,t){var n,i,a=[],o=e.children,r=[],s=[];for(e._ojSavedHeight=e.style.height,i=0;i<o.length;i++){n=o[i];var l=window.getComputedStyle(n);r.push(l.padding),s.push(l.textAlign),n._ojSavedPadding=n.style.padding}for(i=0;i<o.length;i++){n=o[i];var f=document.createElement("div");f.style.overflow="hidden;";var d=document.createElement("div");for(d.style.display="table-cell",d.style.verticalAlign="middle",d.style.boxSizing="border-box",d.style.height=t,d.style.padding=r[i],d.style.textAlign=s[i],f.appendChild(d);n.firstChild;)d.appendChild(n.firstChild);n.appendChild(f),n.style.padding="0",a.push(f)}return e.style.height="0",a},l._unwrapRowContent=function(e){for(var t=e.children,n=0;n<t.length;n++){var i=t[n],a=i.children[0];if(a){var o=a.children[0];if(o)for(;o.firstChild;)i.appendChild(o.firstChild);i.removeChild(a)}i.style.padding=i._ojSavedPadding,delete i._ojSavedPadding}e.style.height=e._ojSavedHeight,delete e._ojSavedHeight},l._expandCollapseRow=function(e,t,i){var a=Promise.resolve(),o=e.offsetHeight+"px",r=l._wrapRowContent(e,o),s=n.extend({},t);if(i?s.endMaxHeight||(s.endMaxHeight=o):s.startMaxHeight||(s.startMaxHeight=o),s.persist="all",s._noReflow=!0,r.length)for(var f=0;f<r.length;f++)0===f?(s._skipPromise=!1,a=l._expandCollapse(r[f],s,i)):(s._skipPromise=!0,l._expandCollapse(r[f],s,i));return a.then(function(){null!=t&&"all"===t.persist||l._unwrapRowContent(e)})},l._getSizeLimit=function(e,t,n,i,a){var o=n;if(!o)if(i)o="0";else{var r=a?t.maxWidth:t.maxHeight;o="none"!==r?r:(a?e.offsetWidth:e.offsetHeight)+"px"}return o},l._expandCollapse=function(e,t,n){if(e&&"TR"===e.tagName)return l._expandCollapseRow(e,t,n);var i=l._mergeOptions(n?"expand":"collapse",t),a={css:{}},o={css:{}},r=i.direction||"height",s=a.css,f=o.css,d=window.getComputedStyle(e),c=[];if("both"===r||"height"===r){var u=l._getSizeLimit(e,d,i.startMaxHeight,n,!1),m=l._getSizeLimit(e,d,i.endMaxHeight,!n,!1);s.maxHeight=u,f.maxHeight=m,c.push("maxHeight")}if("both"===r||"width"===r){var p=l._getSizeLimit(e,d,i.startMaxWidth,n,!0),g=l._getSizeLimit(e,d,i.endMaxWidth,!n,!0);s.maxWidth=p,f.maxWidth=g,c.push("maxWidth")}s.overflow=i.overflow?i.overflow:"hidden";var h=[].concat(c);return h.push("overflow"),l._animate(e,a,o,i,c,h)},l.zoomIn=function(e,t){return l._zoom(e,t,!0)},l.zoomOut=function(e,t){return l._zoom(e,t,!1)},l._zoom=function(e,t,n){var i,a=l._mergeOptions(n?"zoomIn":"zoomOut",t),o={css:{}},r={css:{}},f=a.axis||"both";i="both"===f?"scale":"x"===f?"scaleX":"scaleY";var d=o.css,c=r.css,u="transform";return d[u]=i+"("+(n?0:1)+s,c[u]=i+"("+(n?1:0)+s,d.transformOrigin=a.transformOrigin||"center",l._animate(e,o,r,a,[u])},l.slideIn=function(e,t){return l._slide(e,t,!0)},l.slideOut=function(e,t){return l._slide(e,t,!1)},l._slide=function(e,t,n){var a=l._mergeOptions(n?"slideIn":"slideOut",t),o={css:{}},f={css:{}},d=a.direction||"start",c="0",u="0",m=o.css,p=f.css;if(a.offsetX||a.offsetY)a.offsetX&&(c=a.offsetX),a.offsetY&&(u=a.offsetY);else{var g="rtl"===i.getReadingDirection();switch(d){case"left":c=(n?e.offsetWidth:-e.offsetWidth)+"px";break;case"right":c=(n?-e.offsetWidth:e.offsetWidth)+"px";break;case"top":u=(n?e.offsetHeight:-e.offsetHeight)+"px";break;case"bottom":u=(n?-e.offsetHeight:e.offsetHeight)+"px";break;case"end":c=(n?-e.offsetWidth:e.offsetWidth)*(g?-1:1)+"px";break;default:c=(n?e.offsetWidth:-e.offsetWidth)*(g?-1:1)+"px"}}var h="transform";return n?(m[h]=r+c+","+u+s,p[h]="translate(0,0) translateZ(0)"):(m[h]="translate(0,0) translateZ(0)",p[h]=r+c+","+u+s),l._animate(e,o,f,a,[h])},l.ripple=function(e,t){var i=l._mergeOptions("ripple",t),a={css:{}},o={css:{}},r=e.offsetWidth,s=e.offsetHeight,f=n("<div>").css({position:"absolute",overflow:"hidden"}),d=n("<div class='oj-animation-effect-ripple oj-animation-rippler'>"),c="static"===window.getComputedStyle(e).position?{left:e.offsetLeft,top:e.offsetTop}:{left:0,top:0};e.insertBefore(f[0],e.firstChild),f.css({left:c.left+"px",top:c.top+"px",width:r+"px",height:s+"px"}),f.prepend(d);var u=a.css,m=o.css,p="transform";return l._setRippleOptions(u,d,f,i),u[p]="scale(0) translateZ(0)",u.opacity=i.startOpacity||d.css("opacity"),m[p]="scale(1) translateZ(0)",m.opacity=i.endOpacity||0,i.persist="all",l._animate(d[0],a,o,i,[p,"opacity"]).then(function(){f.remove()})},l._setRippleOptions=function(e,t,n,i){var a=e,o=t.width(),r=n.width(),s=n.height();if(i.diameter){var f=i.diameter,d=parseInt(f,10);isNaN(d)||(o="%"===f.charAt(f.length-1)?Math.floor(Math.min(r,s)*(d/100)):d,a.width=o+"px",a.height=o+"px")}var c,u="static"===n.css("position")?n.position():{left:0,top:0};null!=(c=l._calcRippleOffset(i.offsetX,o,r,u.left))&&(a.left=c+"px"),null!=(c=l._calcRippleOffset(i.offsetY,o,s,u.top))&&(a.top=c+"px"),i.color&&(a.backgroundColor=i.color)},l._calcRippleOffset=function(e,t,n,i){var a,o=e||"50%",r=parseInt(o,10);return isNaN(r)||(a="%"===o.charAt(o.length-1)?n*(r/100)-t/2:r-t/2,a=Math.floor(a+i)),a},l._removeRipple=function(e,t){var i=t||{},a=i.removeEffect||"fadeOut",r=n(".oj-animation-rippler",e);if(0!==r.length)return a in{fadeOut:1,collapse:1,zoomOut:1,slideOut:1}?l[a](r,i).then(function(){r.remove()}):r.remove();o.warn("No rippler so returning")},l._calcBackfaceAngle=function(e){var t,n=e.match(/^([+-]?\d*\.?\d*)(.*)$/),i=parseFloat(n[1]),a=n[2];switch(a){case"deg":t=i-180+a;break;case"grad":t=i-200+a;break;case"rad":t=i-3.1416+a;break;case"turn":t=i-.5+a;break;default:o.error("Unknown angle unit in flip animation: "+a)}return t},l._flip=function(e,t,i,a,o){if(t&&"children"===t.flipTarget){var r,s=[],f=n(e).children(),d=n.extend({},t);delete d.flipTarget;var c=n.extend({},d);c.startAngle=l._calcBackfaceAngle(t.startAngle||a),c.endAngle=l._calcBackfaceAngle(t.endAngle||o);for(var u=0;u<f.length;u++)r=n(f[u]).hasClass("oj-animation-backface")?c:d,s.push(l._flip(f[u],r,i,a,o));return Promise.all(s)}var m,p={},g={},h={css:p},v={css:g},_="rotateY(",y="2000px",x="hidden",b="center";(t=l._mergeOptions(i,t))&&("x"===t.axis&&(_="rotateX("),t.startAngle&&(a=t.startAngle),t.endAngle&&(o=t.endAngle),t.perspective&&(y=t.perspective),t.backfaceVisibility&&(x=t.backfaceVisibility),t.transformOrigin&&(b=t.transformOrigin)),m="perspective("+y+") "+_;var C="backfaceVisibility",O="transform",w="transformOrigin";return p[O]=m+a+")",p[C]=x,p[w]=b,g[O]=m+o+")",l._animate(e,h,v,t,[O],[O,C,w])},l.flipIn=function(e,t){return l._flip(e,t,"flipIn","-180deg","0deg")},l.flipOut=function(e,t){return l._flip(e,t,"flipOut","0deg","180deg")},l.addTransition=function(e,t){var n=l._mergeOptions("addTransition",t);return l._animate(e,null,null,n,n.transitionProperties)},l._createHeroParent=function(){var e=document.createElement("div"),t=document.body;t.appendChild(e),e.style.position="absolute",e.style.height=t.offsetHeight+"px",e.style.width=t.offsetWidth+"px",e.style.left=t.offsetLeft+"px",e.style.top=t.offsetTop+"px",e.style.zIndex=2e3,e.className="oj-animation-host-viewport";var n=document.createElement("div");return n.className="oj-animation-host",e.appendChild(n),n},l._removeHeroParent=function(e){if(e){var t=e.parentNode;t&&t.parentNode&&t.parentNode.removeChild(t)}},l._defaultHeroCreateClonedElement=function(e){return e.fromElement.cloneNode(!0)},l._defaultHeroHideFromAndToElements=function(e){var t=e.fromElement,n=e.toElement;t.style.visibility="hidden",n.style.visibility="hidden"},l._defaultHeroAnimateClonedElement=function(e){return new Promise(function(t){var n=e.clonedElement.style;n.transformOrigin="left top",n.transform="translate(0, 0) scale(1, 1)",requestAnimationFrame(function(){n.transitionDelay=e.delay,n.transitionDuration=e.duration,n.transitionTimingFunction=e.timingFunction,n.transitionProperty="transform";var i=r+e.translateX+"px,"+e.translateY+"px)";i+=" scale("+e.scaleX.toFixed(2)+","+e.scaleY.toFixed(2)+")",n.transform=i;var a=l._getTimingValue(e.delay)+l._getTimingValue(e.duration);setTimeout(function(){t()},a)})})},l._defaultHeroShowToElement=function(e){e.toElement.style.visibility="visible"},l._doAnimateHero=function(e,t,n,i,a,o){var r=document.querySelector(t);if(null!=r){var s=e.getBoundingClientRect(),f=r.getBoundingClientRect(),d=f.left-s.left,c=f.top-s.top,u=f.width/s.width,m=f.height/s.height,p={fromElement:e,toElement:r,clonedElement:null,translateX:d,translateY:c,scaleX:u,scaleY:m,toElementElapsedTime:i,delay:n.delay,duration:n.duration,timingFunction:n.timingFunction},g=n.createClonedElement(p);p.clonedElement=g;var h=l._createHeroParent(),v=h.getBoundingClientRect();h.appendChild(g),g.style.position="absolute",g.style.left=s.left-v.left+"px",g.style.top=s.top-v.top+"px",n.hideFromAndToElements(p),g.style.visibility="visible",n.animateClonedElement(p).then(function(){_(),a()}).catch(function(e){_(),o(e)})}else{i+100>n.toElementWaitTime?o("toElement not found in DOM after toElementWaitTime has expired"):setTimeout(function(){l._doAnimateHero(e,t,n,i+100,a,o)},100)}function _(){n.showToElement(p),l._removeHeroParent(h)}},l.animateHero=function(e,t){var n=e,i={toElementWaitTime:5e3,createClonedElement:l._defaultHeroCreateClonedElement,hideFromAndToElements:l._defaultHeroHideFromAndToElements,animateClonedElement:l._defaultHeroAnimateClonedElement,showToElement:l._defaultHeroShowToElement,delay:"0s",duration:"400ms",timingFunction:"ease"};return Object.assign(i,t),new Promise(function(e,a){n?t.toElementSelector?l._doAnimateHero(n,t.toElementSelector,i,0,e,a):a("No options.toElementSelector specified"):a("No element specified")})};const f=l.startAnimation,d=l.fadeIn,c=l.fadeOut,u=l.expand,m=l.collapse,p=l.zoomIn,g=l.zoomOut,h=l.slideIn,v=l.slideOut,_=l.ripple,y=l.flipIn,x=l.flipOut,b=l.addTransition,C=l.animateHero;e.addTransition=b,e.animateHero=C,e.collapse=m,e.expand=u,e.fadeIn=d,e.fadeOut=c,e.flipIn=y,e.flipOut=x,e.ripple=_,e.slideIn=h,e.slideOut=v,e.startAnimation=f,e.zoomIn=p,e.zoomOut=g,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojanimation.js.map