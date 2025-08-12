/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","preact","preact/hooks","@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode","ojs/ojkeyboardfocus-utils"],function(e,t,r,n,s,o){"use strict";e.ManageTabStops=function({children:e}){let c=n.useRef(null),l=n.useRef(!1);const{isTabbable:a}=s.useTabbableMode();n.useEffect(()=>{let e;if(c.current)return l.current&&a||(o.disableAllFocusableElements(c.current,!1,!1,!0),l.current=!0),a?o.enableAllFocusableElements(c.current,!0):(e=new MutationObserver(e=>{if(!a&&c.current?.isConnected){const t=new Set;for(const r of e){const e=r.addedNodes;for(let t=0;t<e.length;t++)1===e[t].nodeType&&o.disableAllFocusableElements(e[t],!1,!1,!0);"attributes"===r.type&&r.target.tabIndex>-1&&t.add(r.target)}t.forEach(e=>o.disableAllFocusableElements(e,!1,!1,!0))}}),e.observe(c.current,{subtree:!0,childList:!0,attributeFilter:["tabindex"]})),()=>{e&&e.disconnect()}},[a]);const u=e;if(u.ref){const e=u.ref;u.ref=t=>{c.current=t,"function"==typeof e?e(t):e.current=t}}else u.ref=c;return t.jsx(r.Fragment,{children:e})},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojpreact-managetabstops.js.map