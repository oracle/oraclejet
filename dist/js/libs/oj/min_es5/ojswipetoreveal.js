/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","jquery","ojs/ojcontext","ojs/ojoffcanvas","touchr"],function(e,t,o,a,n,r){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o,a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a;
/**
   * @license
   * Copyright (c) 2015 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var s={};t._registerLegacyNamespaceProp("SwipeToRevealUtils",s),s.setupSwipeActions=function(e,t){var r,s,i,l,c,p,u,d,h,f,v;(r=o(e)).hasClass("oj-swipetoreveal")||(r.addClass("oj-swipetoreveal"),s=r.hasClass("oj-offcanvas-start")?"end":"start",(i={}).selector=r,i._animateWrapperSelector="oj-offcanvas-inner-wrapper",n.setupPanToReveal(i),l=n._getOuterWrapper(r),u=!1,l.on("click.swipetoreveal",function(e){u&&(e.stopImmediatePropagation(),u=!1)}),l._touchStartListener=function(e){u=!1,r.hasClass("oj-offcanvas-open")&&r[0].offsetWidth>0&&!r[0].contains(e.target)&&e.preventDefault()},l[0].addEventListener("touchstart",l._touchStartListener,{passive:!1}),r.on("ojpanstart",function(e,o){o.direction!==s?e.preventDefault():(a.getContext(l.get(0)).getBusyContext().whenReady().then(function(){r.children().addClass("oj-swipetoreveal-action").css("min-width",""),f=r.children(".oj-swipetoreveal-default").get(0),null==p&&(null!=t&&(c=t.threshold),null!=c?(c=parseInt(c,10),/%$/.test(t.threshold)&&(c=c/100*l.outerWidth())):c=.55*l.outerWidth(),p=Math.min(.3*l.outerWidth(),r.outerWidth()))}),h=(new Date).getTime())}).on("ojpanmove",function(e,t){u||r.children().css("min-width",0),u=!0,null!=f&&(t.distance>c?r.children().each(function(){this!==f&&o(this).addClass("oj-swipetoreveal-hide-when-full")}):r.children().removeClass("oj-swipetoreveal-hide-when-full"))}).on("ojpanend",function(e,t){v=t.distance,null!=f&&v>c&&(d=o.Event("ojdefaultaction"),r.trigger(d,i),e.preventDefault()),v<p&&((new Date).getTime()-h>200||v<10)&&e.preventDefault()}))},s.tearDownSwipeActions=function(e){var t,a,r;(t=o(e)).removeClass("oj-swipetoreveal"),(a={}).selector=t,null!=(r=n._getOuterWrapper(t))&&r.off(".swipetoreveal"),n.tearDownPanToReveal(a),null!=r&&r.length>0&&(r[0].removeEventListener("touchstart",r._touchStartListener,{passive:!1}),delete r._touchStartListener)};var i=s.setupSwipeActions,l=s.tearDownSwipeActions;e.setupSwipeActions=i,e.tearDownSwipeActions=l,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojswipetoreveal.js.map