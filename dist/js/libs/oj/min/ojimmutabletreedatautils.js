/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";
/**
    * @preserve Copyright 2013 jQuery Foundation and other contributors
    * Released under the MIT license.
    * http://jquery.org/license
    */function t(e,t,n,l="children"){const r=[...e];let s=r;const h=[];let c=t[t.length-1];for(let e=0;e<t.length-1;e++)h.push(t[e]),h.push(l);0===h.length&&s.splice(c,0,n);for(let e=0;e<h.length;e++){let t=h[e];e===h.length-1?(s[t]?s[t]=[...s[t]]:s[t]=[],-1===c&&(c=s[t].length-1),s[t].splice(c,0,n)):(Array.isArray(s[t])?s[t]=[...s[t]]:s[t]=Object.assign({},s[t]),s=s[t])}return r}function n(e,t,n,l="children"){const r=[...e];let s=r;const h=[];for(let e=0;e<t.length;e++)h.push(t[e]),h.push(l);h.pop();for(let e=0;e<h.length;e++){let t=h[e];e===h.length-1?(-1===t&&(t=s.length-1),s[t]=Object.assign({},n)):(Array.isArray(s[t])?s[t]=[...s[t]]:s[t]=Object.assign({},s[t]),s=s[t])}return r}function l(e,t,n="children"){const l=[...e];let r=l,s=t[t.length-1];const h=[];for(let e=0;e<t.length-1;e++)h.push(t[e]),h.push(n);0===h.length&&(1===r.length?r=r.splice(0,1):(-1===s&&(s=r.length-1),r=r.splice(s,1)));for(let e=0;e<h.length;e++){let t=h[e];e===h.length-1?1===r[t].length?delete r[t]:(r[t]=[...r[t]],-1===s&&(s=r[t].length-1),r[t].splice(s,1)):(Array.isArray(r[t])?r[t]=[...r[t]]:r[t]=Object.assign({},r[t]),r=r[t])}return l}e.addNode=t,e.findPathByData=function(e,t,n="children"){return function e(t,n,l="children",r){for(let s=0;s<t.length;s++){if(t[s]===n)return r.push(s),r;if(t[s][l]){r.push(s);const h=e(t[s][l],n,l,r);if(h)return h;r.pop()}}return null}(e,t,n,[])},e.removeNode=l,e.replaceNode=n,e.spliceNode=function(e,r,s,h=0,c=0,i="children"){return r.push(h),c>0&&!s?l(e,r,i):c>0?n(e,r,s,i):t(e,r,s,i)},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojimmutabletreedatautils.js.map