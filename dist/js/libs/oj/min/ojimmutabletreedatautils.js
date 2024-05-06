/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";
/**
    * @preserve Copyright 2013 jQuery Foundation and other contributors
    * Released under the MIT license.
    * http://jquery.org/license
    */function t(e,n,l="children",r){for(let h=0;h<e.length;h++){if(e[h]===n)return r.push(h),r;if(e[h][l]){r.push(h);const o=t(e[h][l],n,l,r);if(o)return o;r.pop()}}return null}function n(e,t,n,l="children"){const r=[...e];let h=r;const o=[];let c=t[t.length-1];for(let e=0;e<t.length-1;e++)o.push(t[e]),o.push(l);0===o.length&&h.splice(c,0,n);for(let e=0;e<o.length;e++){let t=o[e];e===o.length-1?(h[t]?h[t]=[...h[t]]:h[t]=[],-1===c&&(c=h[t].length-1),h[t].splice(c,0,n)):(Array.isArray(h[t])?h[t]=[...h[t]]:h[t]={...h[t]},h=h[t])}return r}function l(e,t,n,l="children"){const r=[...e];let h=r;const o=[];for(let e=0;e<t.length;e++)o.push(t[e]),o.push(l);o.pop();for(let e=0;e<o.length;e++){let t=o[e];e===o.length-1?(-1===t&&(t=h.length-1),h[t]={...n}):(Array.isArray(h[t])?h[t]=[...h[t]]:h[t]={...h[t]},h=h[t])}return r}function r(e,t,n="children"){const l=[...e];let r=l,h=t[t.length-1];const o=[];for(let e=0;e<t.length-1;e++)o.push(t[e]),o.push(n);0===o.length&&(1===r.length?r=r.splice(0,1):(-1===h&&(h=r.length-1),r=r.splice(h,1)));for(let e=0;e<o.length;e++){let t=o[e];e===o.length-1?1===r[t].length?delete r[t]:(r[t]=[...r[t]],-1===h&&(h=r[t].length-1),r[t].splice(h,1)):(Array.isArray(r[t])?r[t]=[...r[t]]:r[t]={...r[t]},r=r[t])}return l}e.addNode=n,e.findPathByData=function(e,n,l="children"){return t(e,n,l,[])},e.removeNode=r,e.replaceNode=l,e.spliceNode=function(e,t,h,o=0,c=0,i="children"){return t.push(o),c>0&&!h?r(e,t,i):c>0?l(e,t,h,i):n(e,t,h,i)},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojimmutabletreedatautils.js.map