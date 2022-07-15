const _excluded=["alignment","allowedPlacements","autoAlignment"],_excluded2=["mainAxis","crossAxis","fallbackPlacements","fallbackStrategy","flipAlignment"],_excluded3=["strategy"],_excluded4=["mainAxis","crossAxis","limiter"],_excluded5=["apply"];function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,e):void 0}}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function _objectWithoutProperties(t,e){if(null==t)return{};var n,r,o=_objectWithoutPropertiesLoose(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function _objectWithoutPropertiesLoose(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}function ownKeys(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(n),!0).forEach((function(e){_defineProperty(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ownKeys(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}define(["exports","preact/hooks"],(function(t,e){"use strict";function n(t){return t.split("-")[0]}function r(t){return t.split("-")[1]}function o(t){return["top","bottom"].includes(n(t))?"x":"y"}function i(t){return"y"===t?"height":"width"}function l(t,e,l){let{reference:a,floating:c}=t;const s=a.x+a.width/2-c.width/2,f=a.y+a.height/2-c.height/2,u=o(e),d=i(u),p=a[d]/2-c[d]/2,m="x"===u;let h;switch(n(e)){case"top":h={x:s,y:a.y-c.height};break;case"bottom":h={x:s,y:a.y+a.height};break;case"right":h={x:a.x+a.width,y:f};break;case"left":h={x:a.x-c.width,y:f};break;default:h={x:a.x,y:a.y}}switch(r(e)){case"start":h[u]-=p*(l&&m?-1:1);break;case"end":h[u]+=p*(l&&m?-1:1)}return h}function a(t){return"number"!=typeof t?function(t){return _objectSpread({top:0,right:0,bottom:0,left:0},t)}(t):{top:t,right:t,bottom:t,left:t}}function c(t){return _objectSpread(_objectSpread({},t),{},{top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height})}async function s(t,e){var n;void 0===e&&(e={});const{x:r,y:o,platform:i,rects:l,elements:s,strategy:f}=t,{boundary:u="clippingAncestors",rootBoundary:d="viewport",elementContext:p="floating",altBoundary:m=!1,padding:h=0}=e,g=a(h),y=s[m?"floating"===p?"reference":"floating":p],b=c(await i.getClippingRect({element:null==(n=await(null==i.isElement?void 0:i.isElement(y)))||n?y:y.contextElement||await(null==i.getDocumentElement?void 0:i.getDocumentElement(s.floating)),boundary:u,rootBoundary:d,strategy:f})),w=c(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({rect:"floating"===p?_objectSpread(_objectSpread({},l.floating),{},{x:r,y:o}):l.reference,offsetParent:await(null==i.getOffsetParent?void 0:i.getOffsetParent(s.floating)),strategy:f}):l[p]);return{top:b.top-w.top+g.top,bottom:w.bottom-b.bottom+g.bottom,left:b.left-w.left+g.left,right:w.right-b.right+g.right}}const f=Math.min,u=Math.max;function d(t,e,n){return u(t,f(e,n))}const p={left:"right",right:"left",bottom:"top",top:"bottom"};function m(t){return t.replace(/left|right|bottom|top/g,(t=>p[t]))}function h(t,e,n){void 0===n&&(n=!1);const l=r(t),a=o(t),c=i(a);let s="x"===a?l===(n?"end":"start")?"right":"left":"start"===l?"bottom":"top";return e.reference[c]>e.floating[c]&&(s=m(s)),{main:s,cross:m(s)}}const g={start:"end",end:"start"};function y(t){return t.replace(/start|end/g,(t=>g[t]))}const b=["top","right","bottom","left"],w=b.reduce(((t,e)=>t.concat(e,e+"-start",e+"-end")),[]);function v(t,e){return{top:t.top-e.height,right:t.right-e.width,bottom:t.bottom-e.height,left:t.left-e.width}}function x(t){return b.some((e=>t[e]>=0))}function _(t){return"x"===t?"y":"x"}function j(t){return t&&t.document&&t.location&&t.alert&&t.setInterval}function A(t){if(null==t)return window;if(!j(t)){const e=t.ownerDocument;return e&&e.defaultView||window}return t}function R(t){return A(t).getComputedStyle(t)}function S(t){return j(t)?"":t?(t.nodeName||"").toLowerCase():""}function O(){const t=navigator.userAgentData;return null!=t&&t.brands?t.brands.map((t=>t.brand+"/"+t.version)).join(" "):navigator.userAgent}function P(t){return t instanceof A(t).HTMLElement}function L(t){return t instanceof A(t).Element}function T(t){return"undefined"!=typeof ShadowRoot&&(t instanceof A(t).ShadowRoot||t instanceof ShadowRoot)}function C(t){const{overflow:e,overflowX:n,overflowY:r}=R(t);return/auto|scroll|overlay|hidden/.test(e+r+n)}function E(t){return["table","td","th"].includes(S(t))}function k(t){const e=/firefox/i.test(O()),n=R(t);return"none"!==n.transform||"none"!==n.perspective||"paint"===n.contain||["transform","perspective"].includes(n.willChange)||e&&"filter"===n.willChange||e&&!!n.filter&&"none"!==n.filter}function W(){return!/^((?!chrome|android).)*safari/i.test(O())}const D=Math.min,H=Math.max,M=Math.round;function V(t,e,n){var r,o,i,l;void 0===e&&(e=!1),void 0===n&&(n=!1);const a=t.getBoundingClientRect();let c=1,s=1;e&&P(t)&&(c=t.offsetWidth>0&&M(a.width)/t.offsetWidth||1,s=t.offsetHeight>0&&M(a.height)/t.offsetHeight||1);const f=L(t)?A(t):window,u=!W()&&n,d=(a.left+(u&&null!=(r=null==(o=f.visualViewport)?void 0:o.offsetLeft)?r:0))/c,p=(a.top+(u&&null!=(i=null==(l=f.visualViewport)?void 0:l.offsetTop)?i:0))/s,m=a.width/c,h=a.height/s;return{width:m,height:h,top:p,right:d+m,bottom:p+h,left:d,x:d,y:p}}function I(t){return(e=t,(e instanceof A(e).Node?t.ownerDocument:t.document)||window.document).documentElement;var e}function N(t){return L(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function B(t){return V(I(t)).left+N(t).scrollLeft}function z(t,e,n){const r=P(e),o=I(e),i=V(t,r&&function(t){const e=V(t);return M(e.width)!==t.offsetWidth||M(e.height)!==t.offsetHeight}(e),"fixed"===n);let l={scrollLeft:0,scrollTop:0};const a={x:0,y:0};if(r||!r&&"fixed"!==n)if(("body"!==S(e)||C(o))&&(l=N(e)),P(e)){const t=V(e,!0);a.x=t.x+e.clientLeft,a.y=t.y+e.clientTop}else o&&(a.x=B(o));return{x:i.left+l.scrollLeft-a.x,y:i.top+l.scrollTop-a.y,width:i.width,height:i.height}}function F(t){return"html"===S(t)?t:t.assignedSlot||t.parentNode||(T(t)?t.host:null)||I(t)}function K(t){return P(t)&&"fixed"!==getComputedStyle(t).position?t.offsetParent:null}function $(t){const e=A(t);let n=K(t);for(;n&&E(n)&&"static"===getComputedStyle(n).position;)n=K(n);return n&&("html"===S(n)||"body"===S(n)&&"static"===getComputedStyle(n).position&&!k(n))?e:n||function(t){let e=F(t);for(T(e)&&(e=e.host);P(e)&&!["html","body"].includes(S(e));){if(k(e))return e;e=e.parentNode}return null}(t)||e}function X(t){if(P(t))return{width:t.offsetWidth,height:t.offsetHeight};const e=V(t);return{width:e.width,height:e.height}}function Y(t){const e=F(t);return["html","body","#document"].includes(S(e))?t.ownerDocument.body:P(e)&&C(e)?e:Y(e)}function q(t,e){var n;void 0===e&&(e=[]);const r=Y(t),o=r===(null==(n=t.ownerDocument)?void 0:n.body),i=A(r),l=o?[i].concat(i.visualViewport||[],C(r)?r:[]):r,a=e.concat(l);return o?a:a.concat(q(l))}function U(t,e,n){return"viewport"===e?c(function(t,e){const n=A(t),r=I(t),o=n.visualViewport;let i=r.clientWidth,l=r.clientHeight,a=0,c=0;if(o){i=o.width,l=o.height;const t=W();(t||!t&&"fixed"===e)&&(a=o.offsetLeft,c=o.offsetTop)}return{width:i,height:l,x:a,y:c}}(t,n)):L(e)?function(t,e){const n=V(t,!1,"fixed"===e),r=n.top+t.clientTop,o=n.left+t.clientLeft;return{top:r,left:o,x:o,y:r,right:o+t.clientWidth,bottom:r+t.clientHeight,width:t.clientWidth,height:t.clientHeight}}(e,n):c(function(t){var e;const n=I(t),r=N(t),o=null==(e=t.ownerDocument)?void 0:e.body,i=H(n.scrollWidth,n.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),l=H(n.scrollHeight,n.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0);let a=-r.scrollLeft+B(t);const c=-r.scrollTop;return"rtl"===R(o||n).direction&&(a+=H(n.clientWidth,o?o.clientWidth:0)-i),{width:i,height:l,x:a,y:c}}(I(t)))}function G(t){const e=q(t),n=["absolute","fixed"].includes(R(t).position)&&P(t)?$(t):t;return L(n)?e.filter((t=>L(t)&&function(t,e){const n=null==e.getRootNode?void 0:e.getRootNode();if(t.contains(e))return!0;if(n&&T(n)){let n=e;do{if(n&&t===n)return!0;n=n.parentNode||n.host}while(n)}return!1}(t,n)&&"body"!==S(t))):[]}const J={getClippingRect:function(t){let{element:e,boundary:n,rootBoundary:r,strategy:o}=t;const i=[].concat(_toConsumableArray("clippingAncestors"===n?G(e):[].concat(n)),[r]),l=i[0],a=i.reduce(((t,n)=>{const r=U(e,n,o);return t.top=H(r.top,t.top),t.right=D(r.right,t.right),t.bottom=D(r.bottom,t.bottom),t.left=H(r.left,t.left),t}),U(e,l,o));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}},convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{rect:e,offsetParent:n,strategy:r}=t;const o=P(n),i=I(n);if(n===i)return e;let l={scrollLeft:0,scrollTop:0};const a={x:0,y:0};if((o||!o&&"fixed"!==r)&&(("body"!==S(n)||C(i))&&(l=N(n)),P(n))){const t=V(n,!0);a.x=t.x+n.clientLeft,a.y=t.y+n.clientTop}return _objectSpread(_objectSpread({},e),{},{x:e.x-l.scrollLeft+a.x,y:e.y-l.scrollTop+a.y})},isElement:L,getDimensions:X,getOffsetParent:$,getDocumentElement:I,getElementRects:t=>{let{reference:e,floating:n,strategy:r}=t;return{reference:z(e,$(n),r),floating:_objectSpread(_objectSpread({},X(n)),{},{x:0,y:0})}},getClientRects:t=>Array.from(t.getClientRects()),isRTL:t=>"rtl"===R(t).direction};const Q=(t,e,n)=>(async(t,e,n)=>{const{placement:r="bottom",strategy:o="absolute",middleware:i=[],platform:a}=n,c=await(null==a.isRTL?void 0:a.isRTL(e));let s=await a.getElementRects({reference:t,floating:e,strategy:o}),{x:f,y:u}=l(s,r,c),d=r,p={},m=0;for(let n=0;n<i.length;n++){const{name:h,fn:g}=i[n],{x:y,y:b,data:w,reset:v}=await g({x:f,y:u,initialPlacement:r,placement:d,strategy:o,middlewareData:p,rects:s,platform:a,elements:{reference:t,floating:e}});f=null!=y?y:f,u=null!=b?b:u,p=_objectSpread(_objectSpread({},p),{},{[h]:_objectSpread(_objectSpread({},p[h]),w)}),v&&m<=50&&(m++,"object"==typeof v&&(v.placement&&(d=v.placement),v.rects&&(s=!0===v.rects?await a.getElementRects({reference:t,floating:e,strategy:o}):v.rects),({x:f,y:u}=l(s,d,c))),n=-1)}return{x:f,y:u,placement:d,strategy:o,middlewareData:p}})(t,e,_objectSpread({platform:J},n));function Z(t,e){if(t===e)return!0;if(typeof t!=typeof e)return!1;if("function"==typeof t&&t.toString()===e.toString())return!0;let n,r,o;if(t&&e&&"object"==typeof t){if(Array.isArray(t)){if(n=t.length,n!=e.length)return!1;for(r=n;0!=r--;)if(!Z(t[r],e[r]))return!1;return!0}if(o=Object.keys(t),n=o.length,n!==Object.keys(e).length)return!1;for(r=n;0!=r--;)if(!Object.prototype.hasOwnProperty.call(e,o[r]))return!1;for(r=n;0!=r--;){const n=o[r];if(("_owner"!==n||!t.$$typeof)&&!Z(t[n],e[n]))return!1}return!0}return t!=t&&e!=e}t.D=function(t){return void 0===t&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:i,placement:l}=e,{mainAxis:a=!0,crossAxis:c=!1,limiter:f={fn:t=>{let{x:e,y:n}=t;return{x:e,y:n}}}}=t,u=_objectWithoutProperties(t,_excluded4),p={x:r,y:i},m=await s(e,u),h=o(n(l)),g=_(h);let y=p[h],b=p[g];if(a){const t="y"===h?"bottom":"right";y=d(y+m["y"===h?"top":"left"],y,y-m[t])}if(c){const t="y"===g?"bottom":"right";b=d(b+m["y"===g?"top":"left"],b,b-m[t])}const w=f.fn(_objectSpread(_objectSpread({},e),{},{[h]:y,[g]:b}));return _objectSpread(_objectSpread({},w),{},{data:{x:w.x-r,y:w.y-i}})}}},t.E=function(t){return void 0===t&&(t={}),{name:"inline",options:t,async fn(e){var r;const{placement:i,elements:l,rects:s,platform:d,strategy:p}=e,{padding:m=2,x:h,y:g}=t,y=c(d.convertOffsetParentRelativeRectToViewportRelativeRect?await d.convertOffsetParentRelativeRectToViewportRelativeRect({rect:s.reference,offsetParent:await(null==d.getOffsetParent?void 0:d.getOffsetParent(l.floating)),strategy:p}):s.reference),b=null!=(r=await(null==d.getClientRects?void 0:d.getClientRects(l.reference)))?r:[],w=a(m),v=await d.getElementRects({reference:{getBoundingClientRect:function(){var t;if(2===b.length&&b[0].left>b[1].right&&null!=h&&null!=g)return null!=(t=b.find((t=>h>t.left-w.left&&h<t.right+w.right&&g>t.top-w.top&&g<t.bottom+w.bottom)))?t:y;if(b.length>=2){if("x"===o(i)){const t=b[0],e=b[b.length-1],r="top"===n(i),o=t.top,l=e.bottom,a=r?t.left:e.left,c=r?t.right:e.right;return{top:o,bottom:l,left:a,right:c,width:c-a,height:l-o,x:a,y:o}}const t="left"===n(i),e=u.apply(void 0,_toConsumableArray(b.map((t=>t.right)))),r=f.apply(void 0,_toConsumableArray(b.map((t=>t.left)))),l=b.filter((n=>t?n.left===r:n.right===e)),a=l[0].top,c=l[l.length-1].bottom;return{top:a,bottom:c,left:r,right:e,width:e-r,height:c-a,x:r,y:a}}return y}},floating:l.floating,strategy:p});return s.reference.x!==v.reference.x||s.reference.y!==v.reference.y||s.reference.width!==v.reference.width||s.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}},t.L=function(t){return void 0===t&&(t={}),{options:t,fn(e){const{x:r,y:i,placement:l,rects:a,middlewareData:c}=e,{offset:s=0,mainAxis:f=!0,crossAxis:u=!0}=t,d={x:r,y:i},p=o(l),m=_(p);let h=d[p],g=d[m];const y="function"==typeof s?s(_objectSpread(_objectSpread({},a),{},{placement:l})):s,b="number"==typeof y?{mainAxis:y,crossAxis:0}:_objectSpread({mainAxis:0,crossAxis:0},y);if(f){const t="y"===p?"height":"width",e=a.reference[p]-a.floating[t]+b.mainAxis,n=a.reference[p]+a.reference[t]-b.mainAxis;h<e?h=e:h>n&&(h=n)}if(u){var w,v,x,j;const t="y"===p?"width":"height",e=["top","left"].includes(n(l)),r=a.reference[m]-a.floating[t]+(e&&null!=(w=null==(v=c.offset)?void 0:v[m])?w:0)+(e?0:b.crossAxis),o=a.reference[m]+a.reference[t]+(e?0:null!=(x=null==(j=c.offset)?void 0:j[m])?x:0)-(e?b.crossAxis:0);g<r?g=r:g>o&&(g=o)}return{[p]:h,[m]:g}}}},t.N=function(t,e,n,r){void 0===r&&(r={});const{ancestorScroll:o=!0,ancestorResize:i=!0,elementResize:l=!0,animationFrame:a=!1}=r,c=o&&!a,s=i&&!a,f=c||s?[].concat(_toConsumableArray(L(t)?q(t):[]),_toConsumableArray(q(e))):[];f.forEach((t=>{c&&t.addEventListener("scroll",n,{passive:!0}),s&&t.addEventListener("resize",n)}));let u,d=null;l&&(d=new ResizeObserver(n),L(t)&&!a&&d.observe(t),d.observe(e));let p=a?V(t):null;return a&&function e(){const r=V(t);!p||r.x===p.x&&r.y===p.y&&r.width===p.width&&r.height===p.height||n(),p=r,u=requestAnimationFrame(e)}(),l||n(),()=>{var t;f.forEach((t=>{c&&t.removeEventListener("scroll",n),s&&t.removeEventListener("resize",n)})),null==(t=d)||t.disconnect(),d=null,a&&cancelAnimationFrame(u)}},t.P=function(t){let e=void 0===t?{}:t,{strategy:n="referenceHidden"}=e,r=_objectWithoutProperties(e,_excluded3);return{name:"hide",async fn(t){const{rects:e}=t;switch(n){case"referenceHidden":{const n=v(await s(t,_objectSpread(_objectSpread({},r),{},{elementContext:"reference"})),e.reference);return{data:{referenceHiddenOffsets:n,referenceHidden:x(n)}}}case"escaped":{const n=v(await s(t,_objectSpread(_objectSpread({},r),{},{altBoundary:!0})),e.floating);return{data:{escapedOffsets:n,escaped:x(n)}}}default:return{}}}}},t.b=function(t){return void 0===t&&(t={}),{name:"flip",options:t,async fn(e){var r;const{placement:o,middlewareData:i,rects:l,initialPlacement:a,platform:c,elements:f}=e,{mainAxis:u=!0,crossAxis:d=!0,fallbackPlacements:p,fallbackStrategy:g="bestFit",flipAlignment:b=!0}=t,w=_objectWithoutProperties(t,_excluded2),v=n(o),x=p||(v!==a&&b?function(t){const e=m(t);return[y(t),e,y(e)]}(a):[m(a)]),_=[a].concat(_toConsumableArray(x)),j=await s(e,w),A=[];let R=(null==(r=i.flip)?void 0:r.overflows)||[];if(u&&A.push(j[v]),d){const{main:t,cross:e}=h(o,l,await(null==c.isRTL?void 0:c.isRTL(f.floating)));A.push(j[t],j[e])}if(R=[].concat(_toConsumableArray(R),[{placement:o,overflows:A}]),!A.every((t=>t<=0))){var S,O;const t=(null!=(S=null==(O=i.flip)?void 0:O.index)?S:0)+1,e=_[t];if(e)return{data:{index:t,overflows:R},reset:{placement:e}};let n="bottom";switch(g){case"bestFit":{var P;const t=null==(P=R.map((t=>[t,t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)])).sort(((t,e)=>t[1]-e[1]))[0])?void 0:P[0].placement;t&&(n=t);break}case"initialPlacement":n=a}if(o!==n)return{reset:{placement:n}}}return{}}}},t.k=function(t){return void 0===t&&(t={}),{name:"size",options:t,async fn(e){const{placement:o,rects:i,platform:l,elements:a}=e,{apply:c}=t,f=_objectWithoutProperties(t,_excluded5),d=await s(e,f),p=n(o),m=r(o);let h,g;"top"===p||"bottom"===p?(h=p,g=m===(await(null==l.isRTL?void 0:l.isRTL(a.floating))?"start":"end")?"left":"right"):(g=p,h="end"===m?"top":"bottom");const y=u(d.left,0),b=u(d.right,0),w=u(d.top,0),v=u(d.bottom,0),x={availableHeight:i.floating.height-(["left","right"].includes(o)?2*(0!==w||0!==v?w+v:u(d.top,d.bottom)):d[h]),availableWidth:i.floating.width-(["top","bottom"].includes(o)?2*(0!==y||0!==b?y+b:u(d.left,d.right)):d[g])},_=await l.getDimensions(a.floating);null==c||c(_objectSpread(_objectSpread({},e),x));const j=await l.getDimensions(a.floating);return _.width!==j.width||_.height!==j.height?{reset:{rects:!0}}:{}}}},t.offset=t=>({name:"oraclePreactOffset",options:t,fn:async e=>function(t){return void 0===t&&(t=0),{name:"offset",options:t,async fn(e){const{x:i,y:l}=e,a=await async function(t,e){const{placement:i,platform:l,elements:a}=t,c=await(null==l.isRTL?void 0:l.isRTL(a.floating)),s=n(i),f=r(i),u="x"===o(i),d=["left","top"].includes(s)?-1:1,p=c&&u?-1:1,m="function"==typeof e?e(t):e;let{mainAxis:h,crossAxis:g,alignmentAxis:y}="number"==typeof m?{mainAxis:m,crossAxis:0,alignmentAxis:null}:_objectSpread({mainAxis:0,crossAxis:0,alignmentAxis:null},m);return f&&"number"==typeof y&&(g="end"===f?-1*y:y),u?{x:g*p,y:h*d}:{x:h*d,y:g*p}}(e,t);return{x:i+a.x,y:l+a.y,data:a}}}}((e=>{if(!t)return 0;return"function"==typeof t?t(Object.assign(Object.assign({},e.rects),{placement:e.placement})):t})).fn(e)}),t.s=s,t.useFloating=function({middleware:t,placement:n,strategy:r,whileElementsMounted:o}){const i=e.useRef(null),l=e.useRef(null),a=function(t){const n=e.useRef(t);return e.useLayoutEffect((()=>{n.current=t})),n}(o),c=e.useRef(null),s=e.useRef(!1),[f,u]=e.useState({x:null,y:null,strategy:null!=r?r:"absolute",placement:"bottom",middlewareData:{}}),[d,p]=e.useState(t);Z(null==d?void 0:d.map((({options:t})=>t)),null==t?void 0:t.map((({options:t})=>t)))||p(t);const m=e.useCallback((()=>{i.current&&l.current&&Q(i.current,l.current,{middleware:d,placement:n,strategy:r}).then((t=>{s.current&&u(t)}))}),[d,n,r]);e.useLayoutEffect((()=>{s.current&&m()}),[m]),e.useLayoutEffect((()=>(s.current=!0,()=>{s.current=!1})),[]);const h=e.useCallback((()=>{if("function"==typeof c.current&&(c.current(),c.current=null),i.current&&l.current)if(a.current){const t=a.current(i.current,l.current,m);c.current=t}else m()}),[m,a]),g=e.useCallback((t=>{i.current=t,h()}),[h]),y=e.useCallback((t=>{l.current=t,h()}),[h]),b=e.useMemo((()=>({reference:i,floating:l})),[]);return e.useMemo((()=>Object.assign(Object.assign({},f),{update:m,refs:b,reference:g,floating:y})),[f,m,b,g,y])},t.v=function(t){return void 0===t&&(t={}),{name:"autoPlacement",options:t,async fn(e){var o,i,l,a,c;const{x:f,y:u,rects:d,middlewareData:p,placement:m,platform:g,elements:b}=e,{alignment:v=null,allowedPlacements:x=w,autoAlignment:_=!0}=t,j=_objectWithoutProperties(t,_excluded),A=function(t,e,o){return(t?[].concat(_toConsumableArray(o.filter((e=>r(e)===t))),_toConsumableArray(o.filter((e=>r(e)!==t)))):o.filter((t=>n(t)===t))).filter((n=>!t||r(n)===t||!!e&&y(n)!==n))}(v,_,x),R=await s(e,j),S=null!=(o=null==(i=p.autoPlacement)?void 0:i.index)?o:0,O=A[S];if(null==O)return{};const{main:P,cross:L}=h(O,d,await(null==g.isRTL?void 0:g.isRTL(b.floating)));if(m!==O)return{x:f,y:u,reset:{placement:A[0]}};const T=[R[n(O)],R[P],R[L]],C=[].concat(_toConsumableArray(null!=(l=null==(a=p.autoPlacement)?void 0:a.overflows)?l:[]),[{placement:O,overflows:T}]),E=A[S+1];if(E)return{data:{index:S+1,overflows:C},reset:{placement:E}};const k=C.slice().sort(((t,e)=>t.overflows[0]-e.overflows[0])),W=null==(c=k.find((t=>{let{overflows:e}=t;return e.every((t=>t<=0))})))?void 0:c.placement,D=null!=W?W:k[0].placement;return D!==m?{data:{index:S+1,overflows:C},reset:{placement:D}}:{}}}}}));
//# sourceMappingURL=index-b2e1c21d.js.map
