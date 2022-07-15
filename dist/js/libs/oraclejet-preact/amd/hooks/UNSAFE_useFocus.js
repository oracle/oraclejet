define(["exports","./UNSAFE_useToggle","preact/hooks"],(function(e,s,o){"use strict";e.useFocus=function(e={isDisabled:!1}){const{bool:o,setTrue:u,setFalse:i}=s.useToggle(!1),t=e.isDisabled?{}:{onFocus:u,onBlur:i};return{isFocus:!e.isDisabled&&o,focusProps:t}},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_useFocus.js.map
