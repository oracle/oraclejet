define(["exports"],(function(e){"use strict";function t(e,t="codeUnit"){if(!e)return 0;const n=e.length;let r,o=0;if("codePoint"===t){for(let t=0;t<n;t++)55296==(63488&e.charCodeAt(t))&&(o+=1);r=n-o/2}else r=n;return r}e.calcLength=t,e.filter=function(e,n,r){if(null==n)return e;if(n<1)throw new Error(`length filter's max option cannot be less than 1. max option is ${n}`);return t(e,r)<=n?e:e.slice(0,n)},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_lengthFilter.js.map
