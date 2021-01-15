/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojlocaledata"],function(e,t,n){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2015 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var a={};t._registerLegacyNamespaceProp("TimeUtils",a),a.getPosition=function(e,t,n,a){var r=new Date(e).getTime(),g=new Date(t).getTime(),i=(r-g)*a,o=new Date(n).getTime()-g;return 0===i||0===o?0:i/o},a.getLength=function(e,t,n,r,g){var i=new Date(e).getTime(),o=new Date(t).getTime(),s=new Date(n).getTime(),c=new Date(r).getTime(),u=a.getPosition(i,s,c,g);return a.getPosition(o,s,c,g)-u},a.getDate=function(e,t,n,a){var r=new Date(t).getTime(),g=e*(new Date(n).getTime()-r);return 0===g||0===a?r:g/a+r},a.getWeekendReferenceObjects=function(e,t){var a=new Date(e),r=new Date(t),g=a.getTime(),i=r.getTime();if(i<=g)return[];for(var o=n.getWeekendStart(),s=n.getWeekendEnd(),c=864e5*(s>=o?s-o+1:s+7-o+1),u=a.getDay(),D=o>=u?o-u:o+7-u,f=[],w=a.setHours(0,0,0,0)+864e5*D;w<=i;w+=6048e5){var d=w+c-1;f.push({type:"area",start:new Date(w).toISOString(),end:new Date(d).toISOString()})}return f};var r=a.getPosition,g=a.getLength,i=a.getDate,o=a.getWeekendReferenceObjects;e.getDate=i,e.getLength=g,e.getPosition=r,e.getWeekendReferenceObjects=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtimeutils.js.map