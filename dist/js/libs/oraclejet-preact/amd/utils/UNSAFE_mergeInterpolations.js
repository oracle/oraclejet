define(["exports","./UNSAFE_classNames","../_curry1-28c749e4","../_curry2-2b58ec36","../_has-d3e8a510","../classNames-f6826ecb"],(function(n,r,t,e,u,c){"use strict";var o=t._curry1_1,i=e._curry2_1,s=t._isPlaceholder_1;var f=function(n){return function r(t,e,u){switch(arguments.length){case 0:return r;case 1:return s(t)?r:i((function(r,e){return n(t,r,e)}));case 2:return s(t)&&s(e)?r:s(t)?i((function(r,t){return n(r,e,t)})):s(e)?i((function(r,e){return n(t,r,e)})):o((function(r){return n(t,e,r)}));default:return s(t)&&s(e)&&s(u)?r:s(t)&&s(e)?i((function(r,t){return n(r,t,u)})):s(t)&&s(u)?i((function(r,t){return n(r,e,t)})):s(e)&&s(u)?i((function(r,e){return n(t,r,e)})):s(t)?o((function(r){return n(r,e,u)})):s(e)?o((function(r){return n(t,r,u)})):s(u)?o((function(r){return n(t,e,r)})):n(t,e,u)}}};var a=function(n){return"[object Object]"===Object.prototype.toString.call(n)},_=f,l=u._has_1,d=a,b=_((function(n,r,t){var e,u={};for(e in r)l(e,r)&&(u[e]=l(e,t)?n(e,r[e],t[e]):r[e]);for(e in t)l(e,t)&&!l(e,u)&&(u[e]=t[e]);return u})),y=f((function n(r,t,e){return b((function(t,e,u){return d(e)&&d(u)?n(r,e,u):r(t,e,u)}),t,e)}));const h=(n,r,t)=>"class"===n?c.classNames([r,t]):t;n.mergeInterpolations=n=>r=>n.reduce(((n,t)=>y(h,n,t(r))),{}),Object.defineProperty(n,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_mergeInterpolations.js.map
