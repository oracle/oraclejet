define(["exports","./UNSAFE_useToggle","preact/hooks"],(function(e,o,s){"use strict";e.useTouch=function(e={isDisabled:!1}){const{bool:s,setTrue:t,setFalse:u}=o.useToggle(!1),i=e.isDisabled?{}:{onTouchStart:t,onTouchEnd:u};return{isTouch:!e.isDisabled&&s,touchProps:i}},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_useTouch.js.map
