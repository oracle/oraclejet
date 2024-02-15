/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojthemeutils"],function(e,t,a){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var n=function(){};n.computeTableColumnHeaderHeight=function(e,o,r){var i=0,l=r.majorAxis,s=r.minorAxis;function m(e,t){if(null==e)return 0;var a=e.height,r=n._getDefaultTimeAxisHeight(o,t);return isNaN(a)?r:Math.max(r,a)}return i+=m(l,"major"),i+=m(s,"minor"),t.AgentUtils.getAgentInfo().browser!==t.AgentUtils.BROWSER.EDGE&&t.AgentUtils.getAgentInfo().browser!==t.AgentUtils.BROWSER.IE||(i-=1),"alta"!==a.parseJSONFromFontFamily("oj-theme-json").behavior&&(i+=1),i},n._getDefaultTimeAxisHeight=function(e,t){var a="oj-gantt",n=document.createElement("div");null!=e&&(n.className=e.className+" "),n.className=n.className+a+" oj-dvtbase";var o=a+"-"+t+"-axis-label",r=document.createElement("div");r.className=o,r.innerHTML="FooBar",n.appendChild(r);var i=a+"-"+t+"-axis",l=document.createElement("div");l.className=i,n.appendChild(l);var s=null!=e?e:document.body;s.appendChild(n);var m=parseInt(window.getComputedStyle(r).height,10),u=parseInt(window.getComputedStyle(l).height,10);s.removeChild(n);var d=Math.max(m+8,21);return Math.max(d,u-1)+1};const o=n.computeTableColumnHeaderHeight;e.computeTableColumnHeaderHeight=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojganttutils.js.map