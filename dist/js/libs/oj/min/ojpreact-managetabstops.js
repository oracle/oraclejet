/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","preact","preact/hooks","@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode","ojs/ojkeyboardfocus-utils"],function(e,r,t,n,s,c){"use strict";e.ManageTabStops=function({children:e}){let o=n.useRef(null),l=n.useRef(!1);const{isTabbable:u}=s.useTabbableMode();n.useEffect(()=>{let e;if(o.current)return l.current&&u||(c.disableAllFocusableElements(o.current,!1,!1,!0),l.current=!0),u?c.enableAllFocusableElements(o.current,!0):(e=new MutationObserver(e=>{if(!u&&o.current){if(!o.current.isConnected)return;for(const r of e){const e=r.addedNodes;for(let r=0;r<e.length;r++)1===e[r].nodeType&&c.disableAllFocusableElements(e[r],!1,!1,!0)}}}),e.observe(o.current,{subtree:!0,childList:!0})),()=>{e&&e.disconnect()}},[u]);const a=e;if(a.ref){const e=a.ref;a.ref=r=>{o.current=r,"function"==typeof e?e(r):e.current=r}}else a.ref=o;return r.jsx(t.Fragment,{children:e})},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojpreact-managetabstops.js.map