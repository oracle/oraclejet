define(["exports","preact/jsx-runtime","preact",'module'],(function(e,n,t,r){"use strict";const c="hkkzuh9";const i="__@@__",s="__@@__$&__@@__";e.HighlightText=function({children:e="",matchText:r=""}){return function(e,r){if(r.length>0&&e.length>0){const a=r.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),l=e.replace(new RegExp(a,"gi"),s).split(i).map(((e,t)=>t%2==0?e:n.jsx("span",Object.assign({class:c},{children:e}))));return n.jsx(t.Fragment,{children:l})}return n.jsx(t.Fragment,{children:e})}(e,r)}}));
//# sourceMappingURL=HighlightText-e4b9d81e.js.map
