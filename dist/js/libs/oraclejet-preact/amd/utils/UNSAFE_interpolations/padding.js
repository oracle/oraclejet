define(["exports","../UNSAFE_arrayUtils","../UNSAFE_size","../UNSAFE_stringUtils","../../stringUtils-b43463af"],(function(n,d,i,a,t){"use strict";d.stringLiteralArray(["paddingBlockStart","paddingBlockEnd","paddingInlineStart","paddingInlineEnd"]);const e={padding:({padding:n})=>{if(void 0===n)return{};{const[a,t=a,e=a,o=t]=d.coerceArray(n);return{padding:`${i.sizeToCSS(a)} ${i.sizeToCSS(t)} \n        ${i.sizeToCSS(e)} ${i.sizeToCSS(o)}`}}},paddingBlockStart:({paddingBlockStart:n})=>void 0===n?{}:{paddingBlockStart:`${i.sizeToCSS(n)}`},paddingBlockEnd:({paddingBlockEnd:n})=>void 0===n?{}:{paddingBlockEnd:`${i.sizeToCSS(n)}`},paddingInlineStart:({paddingInlineStart:n})=>void 0===n?{}:{paddingInlineStart:`${i.sizeToCSS(n)}`},paddingInlineEnd:({paddingInlineEnd:n})=>void 0===n?{}:{paddingInlineEnd:`${i.sizeToCSS(n)}`}};n.paddingInterpolations=e,Object.defineProperty(n,"__esModule",{value:!0})}));
//# sourceMappingURL=padding.js.map
