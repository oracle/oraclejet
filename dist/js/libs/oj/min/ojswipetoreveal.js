/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","jquery","ojs/ojcontext","ojs/ojoffcanvas","touchr"],function(e,t,o,n,a,s){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;
/**
   * @license
   * Copyright (c) 2015 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const r={};t._registerLegacyNamespaceProp("SwipeToRevealUtils",r),r.setupSwipeActions=function(e,t){var s,r,i,l,c,p,u,d,h,f,v;(s=o(e)).hasClass("oj-swipetoreveal")||(s.addClass("oj-swipetoreveal"),r=s.hasClass("oj-offcanvas-start")?"end":"start",(i={}).selector=s,i._animateWrapperSelector="oj-offcanvas-inner-wrapper",a.setupPanToReveal(i),l=a._getOuterWrapper(s),u=!1,l.on("click.swipetoreveal",function(e){u&&(e.stopImmediatePropagation(),u=!1)}),l._touchStartListener=function(e){u=!1,s.hasClass("oj-offcanvas-open")&&s[0].offsetWidth>0&&!s[0].contains(e.target)&&e.preventDefault()},l[0].addEventListener("touchstart",l._touchStartListener,{passive:!1}),s.on("ojpanstart",function(e,o){o.direction!==r?e.preventDefault():(n.getContext(l.get(0)).getBusyContext().whenReady().then(function(){s.children().addClass("oj-swipetoreveal-action").css("min-width",""),f=s.children(".oj-swipetoreveal-default").get(0),null==p&&(null!=t&&(c=t.threshold),null!=c?(c=parseInt(c,10),/%$/.test(t.threshold)&&(c=c/100*l.outerWidth())):c=.55*l.outerWidth(),p=Math.min(.3*l.outerWidth(),s.outerWidth()))}),h=(new Date).getTime())}).on("ojpanmove",function(e,t){u||s.children().css("min-width",0),u=!0,null!=f&&(t.distance>c?s.children().each(function(){this!==f&&o(this).addClass("oj-swipetoreveal-hide-when-full")}):s.children().removeClass("oj-swipetoreveal-hide-when-full"))}).on("ojpanend",function(e,t){v=t.distance,null!=f&&v>c&&(d=o.Event("ojdefaultaction"),s.trigger(d,i),e.preventDefault()),v<p&&((new Date).getTime()-h>200||v<10)&&e.preventDefault()}))},r.tearDownSwipeActions=function(e){var t,n,s;(t=o(e)).removeClass("oj-swipetoreveal"),(n={}).selector=t,null!=(s=a._getOuterWrapper(t))&&s.off(".swipetoreveal"),a.tearDownPanToReveal(n),null!=s&&s.length>0&&(s[0].removeEventListener("touchstart",s._touchStartListener,{passive:!1}),delete s._touchStartListener)};const i=r.setupSwipeActions,l=r.tearDownSwipeActions;e.setupSwipeActions=i,e.tearDownSwipeActions=l,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojswipetoreveal.js.map