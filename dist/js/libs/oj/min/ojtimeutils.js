/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojlocaledata"],function(e,t,n){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;const o={};t._registerLegacyNamespaceProp("TimeUtils",o),o.getPosition=function(e,t,n,o){var a=new Date(e).getTime(),g=new Date(t).getTime(),i=(a-g)*o,r=new Date(n).getTime()-g;return 0===i||0===r?0:i/r},o.getLength=function(e,t,n,a,g){var i=new Date(e).getTime(),r=new Date(t).getTime(),s=new Date(n).getTime(),c=new Date(a).getTime(),u=o.getPosition(i,s,c,g);return o.getPosition(r,s,c,g)-u},o.getDate=function(e,t,n,o){var a=new Date(t).getTime(),g=e*(new Date(n).getTime()-a);return 0===g||0===o?a:g/o+a},o.getWeekendReferenceObjects=function(e,t){const o=new Date(e),a=new Date(t),g=o.getTime(),i=a.getTime();if(i<=g)return[];const r=864e5,s=n.getWeekendStart(),c=n.getWeekendEnd(),u=(c>=s?c-s+1:c+7-s+1)*r,D=o.getDay(),f=s>=D?s-D:s+7-D,w=[];for(let e=o.setHours(0,0,0,0)+f*r;e<=i;e+=6048e5){const t=e+u-1;w.push({type:"area",start:new Date(e).toISOString(),end:new Date(t).toISOString()})}return w};const a=o.getPosition,g=o.getLength,i=o.getDate,r=o.getWeekendReferenceObjects;e.getDate=i,e.getLength=g,e.getPosition=a,e.getWeekendReferenceObjects=r,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtimeutils.js.map