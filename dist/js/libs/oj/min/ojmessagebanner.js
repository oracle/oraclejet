/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/hooks","preact","ojs/ojanimation","ojs/ojtranslation","ojs/ojcontext","ojs/ojdataproviderhandler","ojs/ojvcomponent","ojs/ojbutton"],function(e,t,n,r,o,i,a,s,l){"use strict";i=i&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i;
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
const c=new Map,u=[],d=new Map;let f,h,g=!1;function p(e){0===c.size||"F6"!==e.key||e.defaultPrevented||function(e){var t,n,r;for(let o=function(e,t,n=-1){const r=e.indexOf(t);return-1!==r?r:n}(u,h,u.length)-1;o>-1;o--){const i=u[o],[a]=null!==(t=c.get(i))&&void 0!==t?t:[];if(null===(r=null===(n=null==a?void 0:a.current)||void 0===n?void 0:n.focus)||void 0===r?void 0:r.call(n))return e.preventDefault(),!0}return!1}(e)||h&&j(h,e)}function m(e){f=e.target}function v(e,t){var n;if(!c.has(e)||t.defaultPrevented)return;h=e;const[,r]=c.get(e);f&&!function(e){var t;for(const[n]of c.values())if(null===(t=n.current)||void 0===t?void 0:t.contains(e))return!0;return!1}(f)&&(d.set(e,f),null===(n=null==r?void 0:r.onFocus)||void 0===n||n.call(r))}function y(e,t,n){c.set(e,[t,n]),u.push(e)}function b(e){c.has(e)&&(c.delete(e),u.splice(u.indexOf(e),1))}function j(e,t){const n=function(e){for(let t=u.indexOf(e);t<u.length;t++)if(d.has(u[t]))return d.get(u[t]);return null}(e);return!(!n||!document.body.contains(n))&&(n.focus(),d.clear(),null==t||t.preventDefault(),!0)}const x={prioritize:function(e){if(!c.has(e))return;const[t,n]=c.get(e);b(e),y(e,t,n)},register:function(e,t,n){return g||(document.documentElement.addEventListener("keydown",p,!0),document.documentElement.addEventListener("blur",m,!0),g=!0),y(e,t,n),{onfocusin:t=>v(e,t),onfocusout:t=>function(e,t){c.has(e)&&!t.defaultPrevented&&(h=void 0)}(e,t),onKeyDown:t=>function(e,t){c.has(e)&&!t.defaultPrevented&&"keydown"===t.type&&["Escape"].includes(t.key)&&j(e,t)}(e,t)}},togglePreviousFocus:j,unregister:function(e){b(e),function(e){d.delete(e)}(e),g&&0===c.size&&(document.documentElement.removeEventListener("keydown",p,!0),document.documentElement.removeEventListener("blur",m,!0),g=!1)}};function w({atomic:e="false",text:r="",timeout:o=100,type:i="polite"}){const a=function(e,n){const[r,o]=t.useState(),i=t.useCallback(()=>o(e),[e]),a=t.useCallback(()=>setTimeout(i,n),[i,n]);return t.useEffect(()=>{const e=a();return()=>clearTimeout(e)},[a]),r}(r,o);return n.h("span",{"aria-live":i,"aria-atomic":e,class:"oj-live-region-offScreenStyle-14cpbki"},a)}const k=e=>t=>null!=t&&t.constructor===e||t instanceof e,C=k(Number),E=k(String),M=new RegExp(`(${["px","%","em","rem","vh","vw"].join("|")})$`),S=(_="px",e=>{return(e=>0===e||"0"===e)(e)||E(t=e)&&M.test(t)||!(e=>!isNaN(parseFloat(e))&&!isNaN(e-0))(e)?e:e+_;var t});var _;function O(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]}function P(e){return function t(n){return 0===arguments.length||O(n)?t:e.apply(this,arguments)}}var R=P(function(e){return null==e});const T=e=>t=>{const n=t[e];return R(t[e])?{}:{[e]:(r=n,!C(r)||r>1?S(r):0===r?"0":100*r+"%")};var r},B=["height","maxHeight","maxWidth","minHeight","minWidth","width"].reduce((e,t)=>Object.assign(e,{[t]:T(t)}),{});function A(e){return e.filter(Boolean).join(" ")}function D(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]}function $(e){return function t(n){return 0===arguments.length||D(n)?t:e.apply(this,arguments)}}function F(e){return function t(n,r){switch(arguments.length){case 0:return t;case 1:return D(n)?t:$(function(t){return e(n,t)});default:return D(n)&&D(r)?t:D(n)?$(function(t){return e(t,r)}):D(r)?$(function(t){return e(n,t)}):e(n,r)}}}function z(e){return function t(n,r,o){switch(arguments.length){case 0:return t;case 1:return D(n)?t:F(function(t,r){return e(n,t,r)});case 2:return D(n)&&D(r)?t:D(n)?F(function(t,n){return e(t,r,n)}):D(r)?F(function(t,r){return e(n,t,r)}):$(function(t){return e(n,r,t)});default:return D(n)&&D(r)&&D(o)?t:D(n)&&D(r)?F(function(t,n){return e(t,n,o)}):D(n)&&D(o)?F(function(t,n){return e(t,r,n)}):D(r)&&D(o)?F(function(t,r){return e(n,t,r)}):D(n)?$(function(t){return e(t,r,o)}):D(r)?$(function(t){return e(n,t,o)}):D(o)?$(function(t){return e(n,r,t)}):e(n,r,o)}}}function I(e,t){return Object.prototype.hasOwnProperty.call(t,e)}function N(e){return"[object Object]"===Object.prototype.toString.call(e)}var U=z(function(e,t,n){var r,o={};for(r in t)I(r,t)&&(o[r]=I(r,n)?e(r,t[r],n[r]):t[r]);for(r in n)I(r,n)&&!I(r,o)&&(o[r]=n[r]);return o}),W=z(function e(t,n,r){return U(function(n,r,o){return N(r)&&N(o)?e(t,r,o):t(n,r,o)},n,r)});const L=(e,t,n)=>"class"===e?A([t,n]):n;function Y(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n}function q(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]}function H(e){return function t(n){return 0===arguments.length||q(n)?t:e.apply(this,arguments)}}function K(e,t){return Object.prototype.hasOwnProperty.call(t,e)}var V=Object.prototype.toString,J=function(){return"[object Arguments]"===V.call(arguments)?function(e){return"[object Arguments]"===V.call(e)}:function(e){return K("callee",e)}}(),X=!{toString:null}.propertyIsEnumerable("toString"),Z=["constructor","valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],G=function(){return arguments.propertyIsEnumerable("length")}(),Q=function(e,t){for(var n=0;n<e.length;){if(e[n]===t)return!0;n+=1}return!1},ee="function"!=typeof Object.keys||G?H(function(e){if(Object(e)!==e)return[];var t,n,r=[],o=G&&J(e);for(t in e)!K(t,e)||o&&"length"===t||(r[r.length]=t);if(X)for(n=Z.length-1;n>=0;)K(t=Z[n],e)&&!Q(r,t)&&(r[r.length]=t),n-=1;return r}):H(function(e){return Object(e)!==e?[]:Object.keys(e)});const te={none:"0",xs:"0.25rem",sm:"0.5rem",md:"1rem",lg:"1.5rem",xl:"2rem",xxl:"2.5rem"},ne={row:"oj-flex-row-1r2r04x",column:"oj-flex-column-jvysn7"},re={baseline:"oj-flex-baseline-sn7vdu",center:"oj-flex-center-rpq1co",end:"oj-flex-end-1gkv0nk",start:"oj-flex-start-19zmlgk",inherit:"oj-flex-inherit-6cg1j7",initial:"oj-flex-initial-e73gk1",stretch:"oj-flex-stretch-pkf80b"},oe={center:"oj-flex-center-cz2ys",end:"oj-flex-end-vydaj5",start:"oj-flex-start-1bfjt7u",inherit:"oj-flex-inherit-1vx2ckm",initial:"oj-flex-initial-1kcnwum",around:"oj-flex-around-9r1l2k",between:"oj-flex-between-mpocno",evenly:"oj-flex-evenly-1iqacd2"},ie={nowrap:"oj-flex-nowrap-y59k8t",wrap:"oj-flex-wrap-fmpvou",reverse:"oj-flex-reverse-1b0qr8v",inherit:"oj-flex-inherit-1ij7eal",initial:"oj-flex-initial-3nzaji"},ae=(ee(ne),ee(re),ee(oe),ee(ie),ee(te),{direction:({direction:e})=>void 0===e?{}:{class:ne[e]},align:({align:e})=>void 0===e?{}:{class:re[e]},justify:({justify:e})=>void 0===e?{}:{class:oe[e]},wrap:({wrap:e})=>void 0===e?{}:{class:ie[e]},flex:({flex:e})=>void 0===e?{}:{flex:e},gap:({gap:e})=>{if(void 0===e)return{};{const[n,r=n]=(t=e,Array.isArray(t)?t:[t]);return{gap:`${te[n]} ${te[r]}`}}var t}}),se=(e=>t=>e.reduce((e,n)=>W(L,e,n(t)),{}))([...Object.values(B),...Object.values(ae)]),le=e=>{var{children:t}=e,r=Y(e,["children"]);const o=se(r),{class:i}=o,a=Y(o,["class"]);return n.h("div",{class:"oj-flex-baseStyles-1fjajdl "+i,style:a},t)};
/**
     * @license
     * Copyright (c) 2004 %CURRENT_YEAR%, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
const ce=/^\s*|\s*$/g;function ue(e){if(null===e)return!0;var t=function(e){if(t=e,null!==t&&("string"==typeof t||t instanceof String))return e.replace(ce,"");var t;return e}(e);return!(null==t?void 0:t.hasOwnProperty("length"))||0===t.length}function de(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]}function fe(e){return function t(n){return 0===arguments.length||de(n)?t:e.apply(this,arguments)}}function he(e){return function t(n,r){switch(arguments.length){case 0:return t;case 1:return de(n)?t:fe(function(t){return e(n,t)});default:return de(n)&&de(r)?t:de(n)?fe(function(t){return e(t,r)}):de(r)?fe(function(t){return e(n,t)}):e(n,r)}}}
/**
     * @license
     * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
const ge=he(function(e,t){for(var n={},r=0;r<e.length;)e[r]in t&&(n[e[r]]=t[e[r]]),r+=1;return n})(["error","warn","info","log"],console);
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */let pe=void 0;function me(){if(pe)return pe;if(null===pe)throw new Error("Browser does not support WebAudio API");try{pe=new(window.AudioContext||window.webkitAudioContext)}catch(e){throw pe=null,new Error("Browser does not support WebAudio API")}return pe}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
class ve{static getChildMapping(e,t=new Map,r=(()=>{})){const o=Symbol();let i={};0!==t.size&&(i=ve._getMappedDeletions(e,t,o));const a=e.reduce((e,o)=>{if(i[o.key]){const r=i[o.key];for(const o of r){const r=t.get(o);e.set(o,n.cloneElement(r,{in:!1}))}const a=t.get(o.key);e.set(o.key,n.cloneElement(o,{in:a.props.in}))}else{const t=n.cloneElement(o,{onExited:r.bind(null,o),in:!0});e.set(o.key,t)}return e},new Map);for(const e of i[o]||[]){const r=t.get(e);a.set(e,n.cloneElement(r,{in:!1}))}return a}static _getMappedDeletions(e,t,n){const r=new Set(e.map(e=>e.key));return[...t.keys()].reduce((e,t)=>{if(r.has(t))e[t]=e[n],delete e[n];else{const r=e[n]?[...e[n],t]:[t];e[n]=r}return e},{})}}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */class ye extends n.Component{constructor(e){super(e),this._handleExited=(e,t)=>{var n,r;const{children:o}=this.props;ve.getChildMapping(o).has(e.key)||(null===(r=(n=e.props).onExited)||void 0===r||r.call(n,t),this._mounted&&this.setState(t=>{const n=new Map(t.childMapping);return n.delete(e.key),{childMapping:n}}))},this.state={childMapping:void 0,handleExited:this._handleExited},this._mounted=!1}static getDerivedStateFromProps(e,t){const{childMapping:n,handleExited:r}=t;return{childMapping:ve.getChildMapping(e.children,n,r)}}componentDidMount(){this._mounted=!0}componentWillUnmount(){this._mounted=!1}render(){const e=this.props.elementType,{childMapping:t}=this.state,r=[...t.values()];return n.h(e,null,r)}}ye.defaultProps={elementType:"div"};
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
class be extends n.Component{constructor(e){let t;super(e),t=e.in?"entering":null,this._appearStatus=t,this.state={status:"exited"},this._nextCallback=null}componentDidMount(){this._updateStatus(this._appearStatus)}componentDidUpdate(e){let t=null;if(e!==this.props){const{status:e}=this.state;this.props.in?"entering"!==e&&"entered"!==e&&(t="entering"):"entering"!==e&&"entered"!==e||(t="exiting")}this._updateStatus(t)}componentWillUnmount(){this._cancelNextCallback()}render(e){return null==e?void 0:e.children}_setNextCallback(e){let t=!0;return this._nextCallback=(...n)=>{t&&(t=!1,this._nextCallback=null,e(...n))},this._nextCallback.cancel=()=>{t=!1},this._nextCallback}_cancelNextCallback(){var e,t;null===(t=null===(e=this._nextCallback)||void 0===e?void 0:e.cancel)||void 0===t||t.call(e),this._nextCallback=null}_updateStatus(e){null!=e&&(this._cancelNextCallback(),"entering"===e?this._performEnter(this.base):this._performExit(this.base))}_performEnter(e){var t,n;null===(n=(t=this.props).onEnter)||void 0===n||n.call(t,e,this.props.metadata),this.setState({status:"entering"},()=>{var t,n;null===(n=(t=this.props).onEntering)||void 0===n||n.call(t,e,this._setNextCallback(()=>{this.setState({status:"entered"},()=>{var t,n;null===(n=(t=this.props).onEntered)||void 0===n||n.call(t,e,this.props.metadata)})}),this.props.metadata)})}_performExit(e){var t,n;null===(n=(t=this.props).onExit)||void 0===n||n.call(t,e,this.props.metadata),this.setState({status:"exiting"},()=>{var t,n;null===(n=(t=this.props).onExiting)||void 0===n||n.call(t,e,this._setNextCallback(()=>{this.setState({status:"exited"},()=>{var t,n;null===(n=(t=this.props).onExited)||void 0===n||n.call(t,e,this.props.metadata)})}),this.props.metadata)})}}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */const je={banner:"oj-message-banner-2rbena"};function xe({onAction:e,buttonRenderer:t,title:r="Close",variant:o="banner"}){const i=t?t(r,e,o):n.h("button",{"aria-label":r,onClick:e,title:r},"X"),a=`oj-message${o}-close-icon ${je[o]}`;return n.h("div",{class:a},i)}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */const we=["error","warning","confirmation","info","none"],ke=Object.freeze({TODAY:{hour:"2-digit",minute:"2-digit",hour12:!0},DEFAULT:{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!0}}),Ce=/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */function Ee(e,t="string"){switch(t){case"severity":return"string"==typeof e&&we.includes(e);case"timestamp":return"string"==typeof e&&Ce.test(e);case"string":default:return"string"==typeof e&&!function(e){return!(void 0!==e&&!ue(e))}(e)}}function Me(e){return function(e){const{DateTimeFormat:t}=Intl;return new t("en",e?ke.TODAY:ke.DEFAULT)}(function(e){const t=new Date,n=new Date(e);return t.getUTCFullYear()===n.getUTCFullYear()&&t.getUTCMonth()===n.getUTCMonth()&&t.getUTCDate()===n.getUTCDate()}(e)).format(new Date(e))}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */const Se={base:"oj-message-base-14kwy8x",banner:"oj-message-banner-takd8k"};function _e(e){const{detail:t}=e.data;return Ee(t)?n.h(n.Fragment,null,t):null}function Oe({item:e,renderer:t=_e,variant:r="banner"}){const o=t(e);if(null==o)return null;const i=`oj-message${r}-detail ${Se.base} ${Se[r]}`;return n.h("div",{class:i},o)}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
let Pe=0;const Re=({class:e,children:r,height:o=24,width:i=24,title:a})=>{const s=t.useRef("svg-"+ ++Pe).current;return n.h("svg",{class:A(["oj-message-svgStyles-8z03w3",e]),height:o,viewBox:"0 0 24 24",width:i,xmlns:"http://www.w3.org/2000/svg","aria-labelledby":s},n.h("title",{id:s},a),r)},Te={banner:"oj-message-banner-zjhpfj"},Be={confirmation:({class:e,height:t,width:r,title:o,fill:i="currentColor"})=>n.h(Re,{class:e,height:t,width:r,title:o},n.h("path",{d:"m12 23c-6.07513225 0-11-4.9248677-11-11 0-6.07513225 4.92486775-11 11-11 6.0751323 0 11 4.92486775 11 11 0 6.0751323-4.9248677 11-11 11zm-4.29289322-10.7071068c-.39052429-.3905243-1.02368927-.3905243-1.41421356 0s-.39052429 1.0236893 0 1.4142136l3 3c.39052429.3905243 1.02368928.3905243 1.41421358 0l7-7.00000002c.3905243-.39052429.3905243-1.02368927 0-1.41421356s-1.0236893-.39052429-1.4142136 0l-6.2928932 6.29289318z",fill:i})),error:({class:e,height:t=24,width:r=24,title:o,fill:i="currentColor"})=>n.h(Re,{class:e,height:t,width:r,title:o},n.h("path",{d:"m12 1c6.0751322 0 11 4.92486775 11 11 0 6.0751322-4.9248678 11-11 11-6.07513225 0-11-4.9248678-11-11 0-6.07513225 4.92486775-11 11-11zm-3.29289322 6.29289322-1.41421356 1.41421356 7.99999998 8.00000002 1.4142136-1.4142136z",fill:i})),info:({class:e,height:t=24,width:r=24,title:o,fill:i="currentColor"})=>n.h(Re,{class:e,height:t,width:r,title:o},n.h("path",{d:"m12 1c6.0751322 0 11 4.92486775 11 11 0 6.0751322-4.9248678 11-11 11-6.07513225 0-11-4.9248678-11-11 0-6.07513225 4.92486775-11 11-11zm.0245053 9h-.0490003c-.5365027 0-.975505.439-.975505.9755v6.0485c0 .537.4390023.976.975505.976h.0490003c.5365027 0 .975505-.439.975505-.976v-6.0485c0-.5365-.4390023-.9755-.975505-.9755zm.975505-4h-2v2h2z",fill:i})),warning:({class:e,height:t=24,width:r=24,title:o,fill:i="currentColor"})=>n.h(Re,{class:e,height:t,width:r,title:o},n.h("path",{d:"m12 .85290895 11.6563637 22.14709105h-23.31272741zm1 17.14709105h-2v2h2zm0-9h-2v7h2z",fill:i}))
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */};function Ae({severity:e,variant:t="banner",translations:r}){const o=Be[e];return n.h("div",{class:(i=[`oj-message${t}-start-icon`,"oj-message-messageStartIconStyles-iuvtfp"],i.filter(Boolean).join(" ")),role:"presentation"},n.h(o,{class:Te[t],title:null==r?void 0:r[e]}));var i}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */const De={base:"oj-message-base-bowowq",banner:"oj-message-banner-vxm2jp"};function $e({text:e,variant:t="banner"}){const r=`oj-message${t}-summary ${De.base} ${De[t]}`;return n.h("div",{role:"heading",class:r},e)}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */const Fe={banner:"oj-message-banner-18frmp1"};function ze({value:e,variant:t="banner"}){const r=`oj-message${t}-timestamp ${Fe[t]}`,o=Me(e);return n.h("div",{class:r},o)}const Ie=(e,t="common")=>ge.warn(`JET Message(${t}): ${e}`);async function Ne(e){if("none"!==e)if("default"!==e)try{await function(e){let t,n;const r=new Promise((e,r)=>{t=e,n=r}),o=document.createElement("audio");return o.src=e,o.addEventListener("error",n),(o.play()||Promise.resolve()).then(t,n).catch(n),r}(e)}catch(t){Ie(`Failed to play the audio from the url ${e}. ${t}.`)}else try{!function(){const e=me(),t=e.createOscillator();t.connect(e.destination),t.start(0),t.stop(e.currentTime+.1)}()}catch(e){Ie(`Failed to play the default sound. ${e}.`)}}function Ue(e,t,n,r){if(!t||!n)return;const o="function"==typeof t?t(e):t;return null!=o?(o in n||function(e,t="common"){throw new Error(`JET Message(${t}) - ${e}`)}(`${o} is not a valid template name for the message with key=${e.key}`,r),n[o]):void 0}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */const We="oj-message-base-ph7f1",Le="oj-message-section-y709vw",Ye="oj-message-header-13ytxxv",qe="oj-message-content-1cvp4im";function He({children:e}){return n.h("div",{role:"presentation",class:Ye},e)}function Ke({closeButtonRenderer:e,detailRenderer:r,index:o=-1,item:i,onClose:a,messageRef:s=(()=>{}),translations:l,type:c}){const{closeAffordance:u="on",severity:d="error",sound:f,summary:h,timestamp:g}=i.data,p=function(e){return A([Ee(e,"severity")&&"none"!==e&&"oj-messagebanner-"+e])}(d),m=t.useRef(null);t.useImperativeHandle(s,()=>({focus:()=>{var e;return null===(e=m.current)||void 0===e?void 0:e.focus()},contains:e=>{var t,n;return m.current===e||null!==(n=e&&(null===(t=m.current)||void 0===t?void 0:t.contains(e)))&&void 0!==n&&n}}));const v=t.useCallback(()=>{null==a||a(i)},[i,a]),y=t.useCallback(e=>{"Escape"===e.key&&"on"===u&&(null==a||a(i))},[u,i,a]);t.useEffect(()=>{Ee(f)&&Ne(f)},[]);const b=A([We,p,"section"===c&&Le]);return n.h("div",{ref:m,class:b,role:"alert","aria-atomic":"true",tabIndex:0,onKeyDown:y},n.h("div",{class:qe},function(e){return Ee(e,"severity")&&"none"!==e}(d)&&n.h(Ae,{variant:"banner",severity:d,translations:l}),n.h(le,{direction:"column",flex:"1"},n.h(He,null,n.h($e,{variant:"banner",text:h}),Ee(g,"timestamp")&&n.h(ze,{variant:"banner",value:g})),n.h(Oe,{variant:"banner",item:Object.assign(Object.assign({},i),{index:o}),renderer:r})),"on"===u&&n.h(xe,{buttonRenderer:e,title:null==l?void 0:l.close,variant:"banner",onAction:v})))}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */const Ve=n.createContext({});
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
function Je(e){const{children:r,data:o}=e,{handleEntering:i,handleExiting:a}=function({animations:e,startAnimation:n=(()=>Promise.resolve(!1)),onMessageWillRemove:r}){const{addBusyState:o}=t.useContext(Ve),i=t.useCallback(e=>{var t;return null!==(t=null==o?void 0:o(e))&&void 0!==t?t:()=>{}},[o]),a=t.useCallback(async(t,r)=>{if(!r)return;const o=null==e?void 0:e[t];if(o){const e=i("performing message animation - "+t);await n(r,t,o),e()}},[e,n,i]),s=t.useCallback(async(e,t)=>{await a("enter",e),null==t||t()},[a]),l=t.useCallback(async(e,t,n)=>{await a("exit",e),n&&(null==r||r(n.key,n.index)),null==t||t()},[a,r]);return{handleEntering:s,handleExiting:l}}
/**
     * @license
     * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */(e);return n.h(ye,{elementType:n.Fragment},o.map((e,t)=>n.h(be,{key:e.key,metadata:{index:t,key:e.key},onEntering:i,onExiting:a},null==r?void 0:r({index:t,item:e}))))}const Xe={enter:[{effect:"expand",duration:"0.25s",direction:"height"}],exit:[{effect:"collapse",duration:"0.25s",direction:"height"}]},Ze={close:"Close",navigationFromMessagesRegion:"Entering messages region. Press F6 to navigate back to prior focused element.",navigationToMessagesRegion:"Messages region has new messages. Press F6 to navigate to the most recent message region.",error:"Error",warning:"Warning",info:"Info",confirmation:"Confirmation"};function Ge({closeButtonRenderer:e,detailRendererKey:r,data:o,onClose:i,renderers:a,startAnimation:s,translations:l=Ze,type:c="section"}){const u=function(e=0){return t.useMemo(()=>new Array(e).fill(void 0).map(()=>n.createRef()),[e])}(o.length),d=t.useRef(null),f=t.useRef(null),[h,g]=t.useState(),[p,m]=t.useState(o.length>0),[v,y]=t.useState(0),b=t.useRef(o.length);b.current=o.length,t.useImperativeHandle(f,()=>({focus:()=>{var e,t;return!!o.length&&(null===(t=null===(e=u[0])||void 0===e?void 0:e.current)||void 0===t||t.focus(),!0)},contains:e=>{var t,n;return!(!o.length||!e)&&(null!==(n=null===(t=d.current)||void 0===t?void 0:t.contains(e))&&void 0!==n&&n)}}),[o,u]);const{controller:j,handlers:k}=function(e,n){const r=t.useRef(Symbol()),o=t.useRef(x),[i,a]=t.useState({}),s=t.useMemo(()=>({prioritize:()=>o.current.prioritize(r.current),restorePriorFocus:()=>o.current.togglePreviousFocus(r.current)}),[o.current,r.current]);return t.useEffect(()=>(a(o.current.register(r.current,e,n)),()=>o.current.unregister(r.current)),[]),{handlers:i,controller:s}}(f,{onFocus:t.useCallback(()=>{g(l.navigationFromMessagesRegion)},[g])}),C=t.useCallback(e=>{null==i||i(e)},[i]),E=t.useCallback((e,t)=>{var n,r,o;const i=b.current,a=u.length,s=u[t],l=null===(n=null==s?void 0:s.current)||void 0===n?void 0:n.contains(document.activeElement);if(0===i)return m(!1),void(l&&j.restorePriorFocus());let c=-1;t+1<a?c=t+1:t-1>-1&&(c=t-1),c>-1&&l&&(null===(o=null===(r=u[c])||void 0===r?void 0:r.current)||void 0===o||o.focus())},[j,b,u,m]);return t.useEffect(()=>{o.length?(m(!0),o.length>v&&g(l.navigationToMessagesRegion),j.prioritize()):g(""),y(o.length)},[o,j,v,y,m]),p||0!==o.length?n.h("div",Object.assign({ref:d,class:"oj-messagebanner",tabIndex:-1},k),n.h(le,{direction:"column",gap:"section"===c?"xs":void 0},n.h(Je,{animations:Xe,data:o,startAnimation:s,onMessageWillRemove:E},({index:t,item:o})=>n.h(Ke,{messageRef:u[t],item:o,closeButtonRenderer:e,detailRenderer:Ue(o,r,a),index:t,key:o.key,translations:l,type:c,onClose:C})),n.h(w,{text:h}))):null}var Qe=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},et=function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function a(e){try{l(r.next(e))}catch(e){i(e)}}function s(e){try{l(r.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(a,s)}l((r=r.apply(e,t||[])).next())})};e.MessageBanner=class extends n.Component{constructor(e){super(e),this._addBusyState=e=>i.getContext(this._rootRef.current).getBusyContext().addBusyState({description:e}),this._handleCloseMessage=e=>{var t,n;null===(n=(t=this.props).onOjClose)||void 0===n||n.call(t,e)},this._handleAnimation=(e,t,n)=>et(this,void 0,void 0,function*(){yield r.startAnimation(e,t,n)}),this._renderCloseButton=(e,t)=>n.h("oj-button",{class:"oj-button-sm",display:"icons",chroming:"borderless",title:e,onojAction:t},n.h("span",{slot:"startIcon",class:"oj-fwk-icon oj-fwk-icon-cross"}),n.h("span",null,e)),this._rootRef=n.createRef(),this.state={dataProviderCount:0,previousDataProvider:e.data},this.WrapperMessagesContainer=a.withDataProvider(Ge,"data")}static getDerivedStateFromProps(e,t){const{data:n}=e,{dataProviderCount:r,previousDataProvider:o}=t;return n!==o?{dataProviderCount:r+1,previousDataProvider:n}:null}render(e,t){const{data:r,detailTemplateValue:i,messageTemplates:a,type:l}=e,{dataProviderCount:c}=this.state,u={addBusyState:this._addBusyState};return n.h(s.Root,{ref:this._rootRef},n.h(Ve.Provider,{value:u},n.h(this.WrapperMessagesContainer,{key:"dataProvider"+c,addBusyState:this._addBusyState,data:r,type:l,closeButtonRenderer:this._renderCloseButton,detailRendererKey:i,renderers:a,startAnimation:this._handleAnimation,onClose:this._handleCloseMessage,translations:{close:o.getTranslatedString("oj-ojMessageBanner.close"),navigationFromMessagesRegion:o.getTranslatedString("oj-ojMessageBanner.navigationFromMessagesRegion"),navigationToMessagesRegion:o.getTranslatedString("oj-ojMessageBanner.navigationToMessagesRegion"),error:o.getTranslatedString("oj-ojMessageBanner.error"),warning:o.getTranslatedString("oj-ojMessageBanner.warning"),info:o.getTranslatedString("oj-ojMessageBanner.info"),confirmation:o.getTranslatedString("oj-ojMessageBanner.confirmation")}})))}},e.MessageBanner.defaultProps={type:"section"},e.MessageBanner.metadata={properties:{data:{type:"object"},type:{type:"string",enumValues:["page","section"]},detailTemplateValue:{type:"string|function"}},extension:{_DYNAMIC_SLOT:{prop:"messageTemplates",isTemplate:1}},events:{ojClose:{}}},e.MessageBanner=Qe([s.customElement("oj-message-banner")],e.MessageBanner),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojmessagebanner.js.map