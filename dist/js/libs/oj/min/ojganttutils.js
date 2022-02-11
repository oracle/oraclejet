/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojthemeutils"],function(e,t,a){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var n=function(){};n.computeTableColumnHeaderHeight=function(e,o,r){var i=0,l=r.majorAxis,s=r.minorAxis;function m(e,t){if(null==e)return 0;var a=e.height,r=n._getDefaultTimeAxisHeight(o,t);return isNaN(a)?r:Math.max(r,a)}return i+=m(l,"major"),i+=m(s,"minor"),t.AgentUtils.getAgentInfo().browser!==t.AgentUtils.BROWSER.EDGE&&t.AgentUtils.getAgentInfo().browser!==t.AgentUtils.BROWSER.IE||(i-=1),"alta"!==a.parseJSONFromFontFamily("oj-theme-json").behavior&&(i+=1),i},n._getDefaultTimeAxisHeight=function(e,t){var a=document.createElement("div");null!=e&&(a.className=e.className+" "),a.className=a.className+"oj-gantt oj-dvtbase";var n="oj-gantt-"+t+"-axis-label",o=document.createElement("div");o.className=n,o.innerHTML="FooBar",a.appendChild(o);var r="oj-gantt-"+t+"-axis",i=document.createElement("div");i.className=r,a.appendChild(i);var l=null!=e?e:document.body;l.appendChild(a);var s=parseInt(window.getComputedStyle(o).height,10),m=parseInt(window.getComputedStyle(i).height,10);l.removeChild(a);var u=Math.max(s+8,21);return Math.max(u,m-1)+1};const o=n.computeTableColumnHeaderHeight;e.computeTableColumnHeaderHeight=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojganttutils.js.map