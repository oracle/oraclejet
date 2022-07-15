/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";
/**
    * @preserve Copyright 2013 jQuery Foundation and other contributors
    * Released under the MIT license.
    * http://jquery.org/license
    */function t(e,t,n,l="children"){const r=[...e];let h=r;const s=[];let c=t[t.length-1];for(let e=0;e<t.length-1;e++)s.push(t[e]),s.push(l);0===s.length&&h.splice(c,0,n);for(let e=0;e<s.length;e++){let t=s[e];e===s.length-1?(h[t]?h[t]=[...h[t]]:h[t]=[],-1===c&&(c=h[t].length-1),h[t].splice(c,0,n)):(Array.isArray(h[t])?h[t]=[...h[t]]:h[t]=Object.assign({},h[t]),h=h[t])}return r}function n(e,t,n,l="children"){const r=[...e];let h=r;const s=[];for(let e=0;e<t.length;e++)s.push(t[e]),s.push(l);s.pop();for(let e=0;e<s.length;e++){let t=s[e];e===s.length-1?(-1===t&&(t=h.length-1),h[t]=Object.assign({},n)):(Array.isArray(h[t])?h[t]=[...h[t]]:h[t]=Object.assign({},h[t]),h=h[t])}return r}function l(e,t,n="children"){const l=[...e];let r=l,h=t[t.length-1];const s=[];for(let e=0;e<t.length-1;e++)s.push(t[e]),s.push(n);0===s.length&&(1===r.length?r=[]:(-1===h&&(h=r.length-1),r=r.splice(h,1)));for(let e=0;e<s.length;e++){let t=s[e];e===s.length-1?1===r[t].length?delete r[t]:(r[t]=[...r[t]],-1===h&&(h=r[t].length-1),r[t].splice(h,1)):(Array.isArray(r[t])?r[t]=[...r[t]]:r[t]=Object.assign({},r[t]),r=r[t])}return l}e.addNode=t,e.findPathByData=function(e,t,n="children"){return function e(t,n,l="children",r){for(let h=0;h<t.length;h++){if(t[h]===n)return r.push(h),r;if(t[h][l]){r.push(h);const s=e(t[h][l],n,l,r);if(s)return s;r.pop()}}return null}(e,t,n,[])},e.removeNode=l,e.replaceNode=n,e.spliceNode=function(e,r,h,s=0,c=0,i="children"){return r.push(s),c>0&&!h?l(e,r,i):c>0?n(e,r,h,i):t(e,r,h,i)},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojimmutabletreedatautils.js.map