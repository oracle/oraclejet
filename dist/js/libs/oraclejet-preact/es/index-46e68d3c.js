/* @oracle/oraclejet-preact: 13.1.0 */
import { useRef, useLayoutEffect, useState, useCallback, useMemo } from 'preact/hooks';
import { useUser } from './hooks/UNSAFE_useUser.js';

function t(t){return t.split("-")[0]}function e(t){return t.split("-")[1]}function n$1(e){return ["top","bottom"].includes(t(e))?"x":"y"}function r$1(t){return "y"===t?"height":"width"}function i$1(i,o,a){let{reference:l,floating:s}=i;const c=l.x+l.width/2-s.width/2,f=l.y+l.height/2-s.height/2,u=n$1(o),m=r$1(u),g=l[m]/2-s[m]/2,d="x"===u;let p;switch(t(o)){case"top":p={x:c,y:l.y-s.height};break;case"bottom":p={x:c,y:l.y+l.height};break;case"right":p={x:l.x+l.width,y:f};break;case"left":p={x:l.x-s.width,y:f};break;default:p={x:l.x,y:l.y};}switch(e(o)){case"start":p[u]-=g*(a&&d?-1:1);break;case"end":p[u]+=g*(a&&d?-1:1);}return p}const o$1=async(t,e,n)=>{const{placement:r="bottom",strategy:o="absolute",middleware:a=[],platform:l}=n,s=await(null==l.isRTL?void 0:l.isRTL(e));let c=await l.getElementRects({reference:t,floating:e,strategy:o}),{x:f,y:u}=i$1(c,r,s),m=r,g={},d=0;for(let n=0;n<a.length;n++){const{name:p,fn:h}=a[n],{x:y,y:x,data:w,reset:v}=await h({x:f,y:u,initialPlacement:r,placement:m,strategy:o,middlewareData:g,rects:c,platform:l,elements:{reference:t,floating:e}});f=null!=y?y:f,u=null!=x?x:u,g={...g,[p]:{...g[p],...w}},v&&d<=50&&(d++,"object"==typeof v&&(v.placement&&(m=v.placement),v.rects&&(c=!0===v.rects?await l.getElementRects({reference:t,floating:e,strategy:o}):v.rects),({x:f,y:u}=i$1(c,m,s))),n=-1);}return {x:f,y:u,placement:m,strategy:o,middlewareData:g}};function a$1(t){return "number"!=typeof t?function(t){return {top:0,right:0,bottom:0,left:0,...t}}(t):{top:t,right:t,bottom:t,left:t}}function l$1(t){return {...t,top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}async function s$1(t,e){var n;void 0===e&&(e={});const{x:r,y:i,platform:o,rects:s,elements:c,strategy:f}=t,{boundary:u="clippingAncestors",rootBoundary:m="viewport",elementContext:g="floating",altBoundary:d=!1,padding:p=0}=e,h=a$1(p),y=c[d?"floating"===g?"reference":"floating":g],x=l$1(await o.getClippingRect({element:null==(n=await(null==o.isElement?void 0:o.isElement(y)))||n?y:y.contextElement||await(null==o.getDocumentElement?void 0:o.getDocumentElement(c.floating)),boundary:u,rootBoundary:m,strategy:f})),w=l$1(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({rect:"floating"===g?{...s.floating,x:r,y:i}:s.reference,offsetParent:await(null==o.getOffsetParent?void 0:o.getOffsetParent(c.floating)),strategy:f}):s[g]);return {top:x.top-w.top+h.top,bottom:w.bottom-x.bottom+h.bottom,left:x.left-w.left+h.left,right:w.right-x.right+h.right}}const c$1=Math.min,f$1=Math.max;function u$1(t,e,n){return f$1(t,c$1(e,n))}const m$1=t=>({name:"arrow",options:t,async fn(i){const{element:o,padding:l=0}=null!=t?t:{},{x:s,y:c,placement:f,rects:m,platform:g}=i;if(null==o)return {};const d=a$1(l),p={x:s,y:c},h=n$1(f),y=e(f),x=r$1(h),w=await g.getDimensions(o),v="y"===h?"top":"left",b="y"===h?"bottom":"right",R=m.reference[x]+m.reference[h]-p[h]-m.floating[x],A=p[h]-m.reference[h],P=await(null==g.getOffsetParent?void 0:g.getOffsetParent(o));let T=P?"y"===h?P.clientHeight||0:P.clientWidth||0:0;0===T&&(T=m.floating[x]);const O=R/2-A/2,D=d[v],L=T-w[x]-d[b],k=T/2-w[x]/2+O,E=u$1(D,k,L),C=("start"===y?d[v]:d[b])>0&&k!==E&&m.reference[x]<=m.floating[x];return {[h]:p[h]-(C?k<D?D-k:L-k:0),data:{[h]:E,centerOffset:k-E}}}}),g$1={left:"right",right:"left",bottom:"top",top:"bottom"};function d$1(t){return t.replace(/left|right|bottom|top/g,(t=>g$1[t]))}function p$1(t,i,o){void 0===o&&(o=!1);const a=e(t),l=n$1(t),s=r$1(l);let c="x"===l?a===(o?"end":"start")?"right":"left":"start"===a?"bottom":"top";return i.reference[s]>i.floating[s]&&(c=d$1(c)),{main:c,cross:d$1(c)}}const h$1={start:"end",end:"start"};function y$1(t){return t.replace(/start|end/g,(t=>h$1[t]))}const x$1=["top","right","bottom","left"],w$1=x$1.reduce(((t,e)=>t.concat(e,e+"-start",e+"-end")),[]);const v$1=function(n){return void 0===n&&(n={}),{name:"autoPlacement",options:n,async fn(r){var i,o,a,l,c;const{x:f,y:u,rects:m,middlewareData:g,placement:d,platform:h,elements:x}=r,{alignment:v=null,allowedPlacements:b=w$1,autoAlignment:R=!0,...A}=n,P=function(n,r,i){return (n?[...i.filter((t=>e(t)===n)),...i.filter((t=>e(t)!==n))]:i.filter((e=>t(e)===e))).filter((t=>!n||e(t)===n||!!r&&y$1(t)!==t))}(v,R,b),T=await s$1(r,A),O=null!=(i=null==(o=g.autoPlacement)?void 0:o.index)?i:0,D=P[O];if(null==D)return {};const{main:L,cross:k}=p$1(D,m,await(null==h.isRTL?void 0:h.isRTL(x.floating)));if(d!==D)return {x:f,y:u,reset:{placement:P[0]}};const E=[T[t(D)],T[L],T[k]],C=[...null!=(a=null==(l=g.autoPlacement)?void 0:l.overflows)?a:[],{placement:D,overflows:E}],H=P[O+1];if(H)return {data:{index:O+1,overflows:C},reset:{placement:H}};const B=C.slice().sort(((t,e)=>t.overflows[0]-e.overflows[0])),V=null==(c=B.find((t=>{let{overflows:e}=t;return e.every((t=>t<=0))})))?void 0:c.placement,F=null!=V?V:B[0].placement;return F!==d?{data:{index:O+1,overflows:C},reset:{placement:F}}:{}}}};const b$1=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(n){var r;const{placement:i,middlewareData:o,rects:a,initialPlacement:l,platform:c,elements:f}=n,{mainAxis:u=!0,crossAxis:m=!0,fallbackPlacements:g,fallbackStrategy:h="bestFit",flipAlignment:x=!0,...w}=e,v=t(i),b=g||(v===l||!x?[d$1(l)]:function(t){const e=d$1(t);return [y$1(t),e,y$1(e)]}(l)),R=[l,...b],A=await s$1(n,w),P=[];let T=(null==(r=o.flip)?void 0:r.overflows)||[];if(u&&P.push(A[v]),m){const{main:t,cross:e}=p$1(i,a,await(null==c.isRTL?void 0:c.isRTL(f.floating)));P.push(A[t],A[e]);}if(T=[...T,{placement:i,overflows:P}],!P.every((t=>t<=0))){var O,D;const t=(null!=(O=null==(D=o.flip)?void 0:D.index)?O:0)+1,e=R[t];if(e)return {data:{index:t,overflows:T},reset:{placement:e}};let n="bottom";switch(h){case"bestFit":{var L;const t=null==(L=T.map((t=>[t,t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)])).sort(((t,e)=>t[1]-e[1]))[0])?void 0:L[0].placement;t&&(n=t);break}case"initialPlacement":n=l;}if(i!==n)return {reset:{placement:n}}}return {}}}};function R$1(t,e){return {top:t.top-e.height,right:t.right-e.width,bottom:t.bottom-e.height,left:t.left-e.width}}function A(t){return x$1.some((e=>t[e]>=0))}const P=function(t){let{strategy:e="referenceHidden",...n}=void 0===t?{}:t;return {name:"hide",async fn(t){const{rects:r}=t;switch(e){case"referenceHidden":{const e=R$1(await s$1(t,{...n,elementContext:"reference"}),r.reference);return {data:{referenceHiddenOffsets:e,referenceHidden:A(e)}}}case"escaped":{const e=R$1(await s$1(t,{...n,altBoundary:!0}),r.floating);return {data:{escapedOffsets:e,escaped:A(e)}}}default:return {}}}}};const T$1=function(r){return void 0===r&&(r=0),{name:"offset",options:r,async fn(i){const{x:o,y:a}=i,l=await async function(r,i){const{placement:o,platform:a,elements:l}=r,s=await(null==a.isRTL?void 0:a.isRTL(l.floating)),c=t(o),f=e(o),u="x"===n$1(o),m=["left","top"].includes(c)?-1:1,g=s&&u?-1:1,d="function"==typeof i?i(r):i;let{mainAxis:p,crossAxis:h,alignmentAxis:y}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return f&&"number"==typeof y&&(h="end"===f?-1*y:y),u?{x:h*g,y:p*m}:{x:p*m,y:h*g}}(i,r);return {x:o+l.x,y:a+l.y,data:l}}}};function O(t){return "x"===t?"y":"x"}const D$1=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(r){const{x:i,y:o,placement:a}=r,{mainAxis:l=!0,crossAxis:c=!1,limiter:f={fn:t=>{let{x:e,y:n}=t;return {x:e,y:n}}},...m}=e,g={x:i,y:o},d=await s$1(r,m),p=n$1(t(a)),h=O(p);let y=g[p],x=g[h];if(l){const t="y"===p?"bottom":"right";y=u$1(y+d["y"===p?"top":"left"],y,y-d[t]);}if(c){const t="y"===h?"bottom":"right";x=u$1(x+d["y"===h?"top":"left"],x,x-d[t]);}const w=f.fn({...r,[p]:y,[h]:x});return {...w,data:{x:w.x-i,y:w.y-o}}}}},L$1=function(e){return void 0===e&&(e={}),{options:e,fn(r){const{x:i,y:o,placement:a,rects:l,middlewareData:s}=r,{offset:c=0,mainAxis:f=!0,crossAxis:u=!0}=e,m={x:i,y:o},g=n$1(a),d=O(g);let p=m[g],h=m[d];const y="function"==typeof c?c({...l,placement:a}):c,x="number"==typeof y?{mainAxis:y,crossAxis:0}:{mainAxis:0,crossAxis:0,...y};if(f){const t="y"===g?"height":"width",e=l.reference[g]-l.floating[t]+x.mainAxis,n=l.reference[g]+l.reference[t]-x.mainAxis;p<e?p=e:p>n&&(p=n);}if(u){var w,v,b,R;const e="y"===g?"width":"height",n=["top","left"].includes(t(a)),r=l.reference[d]-l.floating[e]+(n&&null!=(w=null==(v=s.offset)?void 0:v[d])?w:0)+(n?0:x.crossAxis),i=l.reference[d]+l.reference[e]+(n?0:null!=(b=null==(R=s.offset)?void 0:R[d])?b:0)-(n?x.crossAxis:0);h<r?h=r:h>i&&(h=i);}return {[g]:p,[d]:h}}}},k=function(n){return void 0===n&&(n={}),{name:"size",options:n,async fn(r){const{placement:i,rects:o,platform:a,elements:l}=r,{apply:c,...u}=n,m=await s$1(r,u),g=t(i),d=e(i);let p,h;"top"===g||"bottom"===g?(p=g,h=d===(await(null==a.isRTL?void 0:a.isRTL(l.floating))?"start":"end")?"left":"right"):(h=g,p="end"===d?"top":"bottom");const y=f$1(m.left,0),x=f$1(m.right,0),w=f$1(m.top,0),v=f$1(m.bottom,0),b={availableHeight:o.floating.height-(["left","right"].includes(i)?2*(0!==w||0!==v?w+v:f$1(m.top,m.bottom)):m[p]),availableWidth:o.floating.width-(["top","bottom"].includes(i)?2*(0!==y||0!==x?y+x:f$1(m.left,m.right)):m[h])},R=await a.getDimensions(l.floating);null==c||c({...r,...b});const A=await a.getDimensions(l.floating);return R.width!==A.width||R.height!==A.height?{reset:{rects:!0}}:{}}}},E$1=function(e){return void 0===e&&(e={}),{name:"inline",options:e,async fn(r){var i;const{placement:o,elements:s,rects:u,platform:m,strategy:g}=r,{padding:d=2,x:p,y:h}=e,y=l$1(m.convertOffsetParentRelativeRectToViewportRelativeRect?await m.convertOffsetParentRelativeRectToViewportRelativeRect({rect:u.reference,offsetParent:await(null==m.getOffsetParent?void 0:m.getOffsetParent(s.floating)),strategy:g}):u.reference),x=null!=(i=await(null==m.getClientRects?void 0:m.getClientRects(s.reference)))?i:[],w=a$1(d);const v=await m.getElementRects({reference:{getBoundingClientRect:function(){var e;if(2===x.length&&x[0].left>x[1].right&&null!=p&&null!=h)return null!=(e=x.find((t=>p>t.left-w.left&&p<t.right+w.right&&h>t.top-w.top&&h<t.bottom+w.bottom)))?e:y;if(x.length>=2){if("x"===n$1(o)){const e=x[0],n=x[x.length-1],r="top"===t(o),i=e.top,a=n.bottom,l=r?e.left:n.left,s=r?e.right:n.right;return {top:i,bottom:a,left:l,right:s,width:s-l,height:a-i,x:l,y:i}}const e="left"===t(o),r=f$1(...x.map((t=>t.right))),i=c$1(...x.map((t=>t.left))),a=x.filter((t=>e?t.left===i:t.right===r)),l=a[0].top,s=a[a.length-1].bottom;return {top:l,bottom:s,left:i,right:r,width:r-i,height:s-l,x:i,y:l}}return y}},floating:s.floating,strategy:g});return u.reference.x!==v.reference.x||u.reference.y!==v.reference.y||u.reference.width!==v.reference.width||u.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};

function n(t){return t&&t.document&&t.location&&t.alert&&t.setInterval}function o(t){if(null==t)return window;if(!n(t)){const e=t.ownerDocument;return e&&e.defaultView||window}return t}function i(t){return o(t).getComputedStyle(t)}function r(t){return n(t)?"":t?(t.nodeName||"").toLowerCase():""}function l(){const t=navigator.userAgentData;return null!=t&&t.brands?t.brands.map((t=>t.brand+"/"+t.version)).join(" "):navigator.userAgent}function c(t){return t instanceof o(t).HTMLElement}function f(t){return t instanceof o(t).Element}function s(t){if("undefined"==typeof ShadowRoot)return !1;return t instanceof o(t).ShadowRoot||t instanceof ShadowRoot}function u(t){const{overflow:e,overflowX:n,overflowY:o}=i(t);return /auto|scroll|overlay|hidden/.test(e+o+n)}function d(t){return ["table","td","th"].includes(r(t))}function h(t){const e=/firefox/i.test(l()),n=i(t);return "none"!==n.transform||"none"!==n.perspective||"paint"===n.contain||["transform","perspective"].includes(n.willChange)||e&&"filter"===n.willChange||e&&!!n.filter&&"none"!==n.filter}function a(){return !/^((?!chrome|android).)*safari/i.test(l())}const g=Math.min,p=Math.max,m=Math.round;function w(t,e,n){var i,r,l,s;void 0===e&&(e=!1),void 0===n&&(n=!1);const u=t.getBoundingClientRect();let d=1,h=1;e&&c(t)&&(d=t.offsetWidth>0&&m(u.width)/t.offsetWidth||1,h=t.offsetHeight>0&&m(u.height)/t.offsetHeight||1);const g=f(t)?o(t):window,p=!a()&&n,w=(u.left+(p&&null!=(i=null==(r=g.visualViewport)?void 0:r.offsetLeft)?i:0))/d,v=(u.top+(p&&null!=(l=null==(s=g.visualViewport)?void 0:s.offsetTop)?l:0))/h,y=u.width/d,x=u.height/h;return {width:y,height:x,top:v,right:w+y,bottom:v+x,left:w,x:w,y:v}}function v(t){return (e=t,(e instanceof o(e).Node?t.ownerDocument:t.document)||window.document).documentElement;var e;}function y(t){return f(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function x(t){return w(v(t)).left+y(t).scrollLeft}function b(t,e,n){const o=c(e),i=v(e),l=w(t,o&&function(t){const e=w(t);return m(e.width)!==t.offsetWidth||m(e.height)!==t.offsetHeight}(e),"fixed"===n);let f={scrollLeft:0,scrollTop:0};const s={x:0,y:0};if(o||!o&&"fixed"!==n)if(("body"!==r(e)||u(i))&&(f=y(e)),c(e)){const t=w(e,!0);s.x=t.x+e.clientLeft,s.y=t.y+e.clientTop;}else i&&(s.x=x(i));return {x:l.left+f.scrollLeft-s.x,y:l.top+f.scrollTop-s.y,width:l.width,height:l.height}}function L(t){return "html"===r(t)?t:t.assignedSlot||t.parentNode||(s(t)?t.host:null)||v(t)}function R(t){return c(t)&&"fixed"!==getComputedStyle(t).position?t.offsetParent:null}function T(t){const e=o(t);let n=R(t);for(;n&&d(n)&&"static"===getComputedStyle(n).position;)n=R(n);return n&&("html"===r(n)||"body"===r(n)&&"static"===getComputedStyle(n).position&&!h(n))?e:n||function(t){let e=L(t);for(s(e)&&(e=e.host);c(e)&&!["html","body"].includes(r(e));){if(h(e))return e;e=e.parentNode;}return null}(t)||e}function W(t){if(c(t))return {width:t.offsetWidth,height:t.offsetHeight};const e=w(t);return {width:e.width,height:e.height}}function E(t){const e=L(t);return ["html","body","#document"].includes(r(e))?t.ownerDocument.body:c(e)&&u(e)?e:E(e)}function H(t,e){var n;void 0===e&&(e=[]);const i=E(t),r=i===(null==(n=t.ownerDocument)?void 0:n.body),l=o(i),c=r?[l].concat(l.visualViewport||[],u(i)?i:[]):i,f=e.concat(c);return r?f:f.concat(H(c))}function C(e,n,r){return "viewport"===n?l$1(function(t,e){const n=o(t),i=v(t),r=n.visualViewport;let l=i.clientWidth,c=i.clientHeight,f=0,s=0;if(r){l=r.width,c=r.height;const t=a();(t||!t&&"fixed"===e)&&(f=r.offsetLeft,s=r.offsetTop);}return {width:l,height:c,x:f,y:s}}(e,r)):f(n)?function(t,e){const n=w(t,!1,"fixed"===e),o=n.top+t.clientTop,i=n.left+t.clientLeft;return {top:o,left:i,x:i,y:o,right:i+t.clientWidth,bottom:o+t.clientHeight,width:t.clientWidth,height:t.clientHeight}}(n,r):l$1(function(t){var e;const n=v(t),o=y(t),r=null==(e=t.ownerDocument)?void 0:e.body,l=p(n.scrollWidth,n.clientWidth,r?r.scrollWidth:0,r?r.clientWidth:0),c=p(n.scrollHeight,n.clientHeight,r?r.scrollHeight:0,r?r.clientHeight:0);let f=-o.scrollLeft+x(t);const s=-o.scrollTop;return "rtl"===i(r||n).direction&&(f+=p(n.clientWidth,r?r.clientWidth:0)-l),{width:l,height:c,x:f,y:s}}(v(e)))}function S(t){const e=H(t),n=["absolute","fixed"].includes(i(t).position)&&c(t)?T(t):t;return f(n)?e.filter((t=>f(t)&&function(t,e){const n=null==e.getRootNode?void 0:e.getRootNode();if(t.contains(e))return !0;if(n&&s(n)){let n=e;do{if(n&&t===n)return !0;n=n.parentNode||n.host;}while(n)}return !1}(t,n)&&"body"!==r(t))):[]}const D={getClippingRect:function(t){let{element:e,boundary:n,rootBoundary:o,strategy:i}=t;const r=[..."clippingAncestors"===n?S(e):[].concat(n),o],l=r[0],c=r.reduce(((t,n)=>{const o=C(e,n,i);return t.top=p(o.top,t.top),t.right=g(o.right,t.right),t.bottom=g(o.bottom,t.bottom),t.left=p(o.left,t.left),t}),C(e,l,i));return {width:c.right-c.left,height:c.bottom-c.top,x:c.left,y:c.top}},convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{rect:e,offsetParent:n,strategy:o}=t;const i=c(n),l=v(n);if(n===l)return e;let f={scrollLeft:0,scrollTop:0};const s={x:0,y:0};if((i||!i&&"fixed"!==o)&&(("body"!==r(n)||u(l))&&(f=y(n)),c(n))){const t=w(n,!0);s.x=t.x+n.clientLeft,s.y=t.y+n.clientTop;}return {...e,x:e.x-f.scrollLeft+s.x,y:e.y-f.scrollTop+s.y}},isElement:f,getDimensions:W,getOffsetParent:T,getDocumentElement:v,getElementRects:t=>{let{reference:e,floating:n,strategy:o}=t;return {reference:b(e,T(n),o),floating:{...W(n),x:0,y:0}}},getClientRects:t=>Array.from(t.getClientRects()),isRTL:t=>"rtl"===i(t).direction};function N(t,e,n,o){void 0===o&&(o={});const{ancestorScroll:i=!0,ancestorResize:r=!0,elementResize:l=!0,animationFrame:c=!1}=o,s=i&&!c,u=r&&!c,d=s||u?[...f(t)?H(t):[],...H(e)]:[];d.forEach((t=>{s&&t.addEventListener("scroll",n,{passive:!0}),u&&t.addEventListener("resize",n);}));let h,a=null;l&&(a=new ResizeObserver(n),f(t)&&!c&&a.observe(t),a.observe(e));let g=c?w(t):null;return c&&function e(){const o=w(t);!g||o.x===g.x&&o.y===g.y&&o.width===g.width&&o.height===g.height||n();g=o,h=requestAnimationFrame(e);}(),l||n(),()=>{var t;d.forEach((t=>{s&&t.removeEventListener("scroll",n),u&&t.removeEventListener("resize",n);})),null==(t=a)||t.disconnect(),a=null,c&&cancelAnimationFrame(h);}}const z=(t,n,o)=>o$1(t,n,{platform:D,...o});

/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Floating UI contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const offset = (value) => {
    return {
        name: 'offset',
        options: value,
        async fn(middlewareArguments) {
            const newFn = (args) => {
                if (!value) {
                    return 0;
                }
                const rawValue = typeof value === 'function' ? value(Object.assign(Object.assign({}, args.rects), { placement: args.placement })) : value;
                return rawValue;
            };
            return T$1(newFn).fn(middlewareArguments);
        }
    };
};
// Fork of `fast-deep-equal` that only does the comparisons we need and compares
// functions
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (typeof a === 'function' && a.toString() === b.toString()) {
        return true;
    }
    let length, i, keys;
    if (a && b && typeof a == 'object') {
        if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length)
                return false;
            for (i = length; i-- !== 0;) {
                if (!deepEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) {
            return false;
        }
        for (i = length; i-- !== 0;) {
            if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
                return false;
            }
        }
        for (i = length; i-- !== 0;) {
            const key = keys[i];
            if (key === '_owner' && a.$$typeof) {
                continue;
            }
            if (!deepEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }
    return a !== a && b !== b;
}
function useLatestRef(value) {
    const ref = useRef(value);
    useLayoutEffect(() => {
        ref.current = value;
    });
    return ref;
}
const logicalSide = (placement, direction) => {
    const side = placement.split('-')[0];
    const alignment = placement.split('-')[1];
    const sideHashLtr = {
        start: 'left',
        end: 'right'
    };
    const sideHashRtl = {
        start: 'right',
        end: 'left'
    };
    let physicalSide;
    if (direction === 'rtl') {
        physicalSide = side.replace(/start|end/g, (matched) => sideHashRtl[matched]);
    }
    else {
        physicalSide = side.replace(/start|end/g, (matched) => sideHashLtr[matched]);
    }
    let alignmentSideHash;
    let alignmentMappedSide;
    if (alignment) {
        alignmentSideHash = {
            top: 'start',
            bottom: 'end'
        };
        alignmentMappedSide = alignment.replace(/top|bottom/g, (matched) => alignmentSideHash[matched]);
    }
    const placements = [
        'top',
        'right',
        'bottom',
        'left',
        'top-start',
        'right-start',
        'bottom-start',
        'left-start',
        'top-end',
        'right-end',
        'bottom-end',
        'left-end'
    ];
    const newPlacement = placements.filter((placement) => (alignmentMappedSide && placement === `${physicalSide}-${alignmentMappedSide}`) ||
        (!alignmentMappedSide && placement === `${physicalSide}`))[0];
    if (!newPlacement) {
        return 'bottom';
    }
    return newPlacement;
};
function useFloating({ middleware, placement, strategy, whileElementsMounted }) {
    const reference = useRef(null);
    const floating = useRef(null);
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const cleanupRef = useRef(null);
    const isMountedRef = useRef(false);
    const { direction } = useUser();
    const [data, setData] = useState({
        // Setting these to `null` will allow the consumer to determine if
        // `computePosition()` has run yet
        x: null,
        y: null,
        strategy: strategy !== null && strategy !== void 0 ? strategy : 'absolute',
        placement: 'bottom',
        middlewareData: {}
    });
    const [latestMiddleware, setLatestMiddleware] = useState(middleware);
    if (!deepEqual(latestMiddleware === null || latestMiddleware === void 0 ? void 0 : latestMiddleware.map(({ options }) => options), middleware === null || middleware === void 0 ? void 0 : middleware.map(({ options }) => options))) {
        setLatestMiddleware(middleware);
    }
    const update = useCallback(() => {
        if (!reference.current || !floating.current) {
            return;
        }
        const floatingUiPlacement = logicalSide(placement, direction);
        z(reference.current, floating.current, {
            middleware: latestMiddleware,
            placement: floatingUiPlacement,
            strategy
        }).then((data) => {
            if (isMountedRef.current) {
                setData(data);
            }
        });
    }, [latestMiddleware, placement, strategy]);
    useLayoutEffect(() => {
        // Skip first update
        if (isMountedRef.current) {
            update();
        }
    }, [update]);
    useLayoutEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    const runElementMountCallback = useCallback(() => {
        if (typeof cleanupRef.current === 'function') {
            cleanupRef.current();
            cleanupRef.current = null;
        }
        if (reference.current && floating.current) {
            if (whileElementsMountedRef.current) {
                const cleanupFn = whileElementsMountedRef.current(reference.current, floating.current, update);
                cleanupRef.current = cleanupFn;
            }
            else {
                update();
            }
        }
    }, [update, whileElementsMountedRef]);
    const setReference = useCallback((node) => {
        reference.current = node;
        runElementMountCallback();
    }, [runElementMountCallback]);
    const setFloating = useCallback((node) => {
        floating.current = node;
        runElementMountCallback();
    }, [runElementMountCallback]);
    const refs = useMemo(() => ({ reference, floating }), []);
    return useMemo(() => (Object.assign(Object.assign({}, data), { update,
        refs, reference: setReference, floating: setFloating })), [data, update, refs, setReference, setFloating]);
}

export { D$1 as D, E$1 as E, L$1 as L, N, P, b$1 as b, k, offset as o, s$1 as s, useFloating as u, v$1 as v };
/*  */
//# sourceMappingURL=index-46e68d3c.js.map
