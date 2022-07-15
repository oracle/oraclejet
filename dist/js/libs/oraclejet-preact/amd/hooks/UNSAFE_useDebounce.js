define(["exports","preact/hooks"],(function(e,t){"use strict";e.useDebounce=function(e,u){const[o,n]=t.useState(e);return t.useEffect((()=>{const t=setTimeout((()=>{n(e)}),u);return()=>clearTimeout(t)}),[e,u]),o},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_useDebounce.js.map
