define(["exports","preact/hooks"],(function(e,t){"use strict";e.useToggle=function(e=!1){const[s,o]=t.useState(e),u=t.useMemo((()=>({toggle:()=>o((e=>!e)),setTrue:()=>o(!0),setFalse:()=>o(!1)})),[]);return Object.assign({bool:s},u)},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_useToggle.js.map
