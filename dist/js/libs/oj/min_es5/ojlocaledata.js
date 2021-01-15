/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojL10n!ojtranslations/nls/localeElements"],function(e,t,n){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2008 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var a=n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n,r={};t._registerLegacyNamespaceProp("LocaleData",r),r.setBundle=function(e){r._bundle=e},r.getFirstDayOfWeek=function(){return r._getWeekData("firstDay")},r.getWeekendStart=function(){return r._getWeekData("weekendStart")},r.getWeekendEnd=function(){return r._getWeekData("weekendEnd")},r.getDayNames=function(e){(null==e||"abbreviated"!==e&&"narrow"!==e)&&(e="wide");var t=r._getCalendarData().days["stand-alone"][e];return[t.sun,t.mon,t.tue,t.wed,t.thu,t.fri,t.sat]},r.getMonthNames=function(e){(null==e||"abbreviated"!==e&&"narrow"!==e)&&(e="wide");var t=r._getCalendarData().months["stand-alone"][e];return[t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12]]},r.isMonthPriorToYear=function(){var e=r._getCalendarData().dateFormats.long.toUpperCase();return e.indexOf("M")<e.indexOf("Y")},r._getWeekData=function(e){var t=r.__getBundle(),n=r._getRegion()||"001",a=t.supplemental.weekData[e],o=a[n];return void 0===o&&(o=a["001"]),o},r._getCalendarData=function(){var e=r.__getBundle().main;return e[Object.keys(e)[0]].dates.calendars.gregorian},r._getRegion=function(){var e=t.Config.getLocale();if(e){var n=e.toUpperCase().split(/-|_/);if(n.length>=2){var a=n[1];if(4!==a.length)return a;if(n.length>=3)return n[2]}}return r.__getBundle().supplemental.defaultRegion[e]},r.__getBundle=function(){var e=r._bundle;return e||(t.__isAmdLoaderPresent()?(t.Assert.assert(void 0!==a,"LocaleElements module must be loaded"),a):{})},r.__updateBundle=function(e){a=e};var o=r.getDayNames,d=r.getFirstDayOfWeek,u=r.getMonthNames,l=r.getWeekendEnd,s=r.getWeekendStart,i=r.isMonthPriorToYear,g=r.setBundle,f=r.__getBundle;e.__getBundle=f,e.getDayNames=o,e.getFirstDayOfWeek=d,e.getMonthNames=u,e.getWeekendEnd=l,e.getWeekendStart=s,e.isMonthPriorToYear=i,e.setBundle=g,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojlocaledata.js.map