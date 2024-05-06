/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","preact","preact/hooks","@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode","ojs/ojkeyboardfocus-utils"],function(e,r,t,n,c,s){"use strict";e.ManageTabStops=function({children:e}){let o=n.useRef(null),u=n.useRef(!1);const{isTabbable:l}=c.useTabbableMode();n.useEffect(()=>{o.current&&(u.current&&l||(s.disableAllFocusableElements(o.current),u.current=!0),l&&s.enableAllFocusableElements(o.current))},[l]);const a=e;if(a.ref){const e=a.ref;a.ref=r=>{o.current=r,"function"==typeof e?e(r):e.current=r}}else a.ref=o;return r.jsx(t.Fragment,{children:e})},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojpreact-managetabstops.js.map