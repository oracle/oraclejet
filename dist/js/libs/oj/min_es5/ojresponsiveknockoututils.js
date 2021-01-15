/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","knockout","jquery","ojs/ojresponsiveutils"],function(e,r,a,t,n){"use strict";r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var l={};r._registerLegacyNamespaceProp("ResponsiveKnockoutUtils",l),l.createMediaQueryObservable=function(e){if(null==e)throw new Error("ResponsiveKnockoutUtils.createMediaQueryObservable: aborting, queryString is null");var r=window.matchMedia(e),n=a.observable(r.matches);return r.addListener(function(e){n(e.matches)}),-1!==navigator.userAgent.indexOf("WebKit")&&-1===navigator.userAgent.indexOf("Chrome")&&t(window).resize(function(){var e="oj-webkit-bug-123293";0===t("body").has("."+e).length&&t("body").append('<div aria-hidden="true" class="oj-helper-hidden-accessible '+e+'">'),t("."+e).text((new Date).getMilliseconds().toString())}),n},l.createScreenRangeObservable=function(){var e=n.getFrameworkQuery(n.FRAMEWORK_QUERY_KEY.XXL_UP),r=n.getFrameworkQuery(n.FRAMEWORK_QUERY_KEY.XL_UP),t=n.getFrameworkQuery(n.FRAMEWORK_QUERY_KEY.LG_UP),u=n.getFrameworkQuery(n.FRAMEWORK_QUERY_KEY.MD_UP),i=n.getFrameworkQuery(n.FRAMEWORK_QUERY_KEY.SM_UP),o=null==e?null:l.createMediaQueryObservable(e),s=null==r?null:l.createMediaQueryObservable(r),c=null==t?null:l.createMediaQueryObservable(t),b=null==u?null:l.createMediaQueryObservable(u),d=null==i?null:l.createMediaQueryObservable(i);return a.computed(function(){if(o&&o())return n.SCREEN_RANGE.XXL;if(s&&s())return n.SCREEN_RANGE.XL;if(c&&c())return n.SCREEN_RANGE.LG;if(b&&b())return n.SCREEN_RANGE.MD;if(d&&d())return n.SCREEN_RANGE.SM;throw new Error(" NO MATCH in ResponsiveKnockoutUtils.createScreenRangeObservable")})};var u=l.createScreenRangeObservable,i=l.createMediaQueryObservable;e.createMediaQueryObservable=i,e.createScreenRangeObservable=u,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojresponsiveknockoututils.js.map