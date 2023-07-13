/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojdomutils","ojs/ojlogger","ojs/ojkeyboardfocus-utils"],function(e,t,n,i,l){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;const r=function(){};r._DATA_OJ_TABMOD="data-oj-tabmod",r._FOCUSABLE_ELEMENTS_TAG=["input","select","button","a","textarea","object"],r.CHECKVIEWPORT_THRESHOLD=3,r.applyRendererContent=function(e,t,n,i){if(null!=t){if(null===t.parentNode||t.parentNode instanceof DocumentFragment)return e.appendChild(t),i&&i(t),!0;if(null!=t.parentNode)return!1;if(t.toString){if(n){var l=document.createElement("span");l.appendChild(document.createTextNode(t.toString())),e.appendChild(l)}else e.appendChild(document.createTextNode(t.toString()));return!0}}return!1},r.getFocusableElementsInNode=function(e,t){return l.getFocusableElementsInNode(e,t)},r.checkVisibility=function(e){return l.checkVisibility(e)},r.disableElement=function(e){l.disableElement(e)},r.disableAllFocusableElements=function(e,t,n){return l.disableAllFocusableElements(e,t,n)},r.enableAllFocusableElements=function(e){return l.enableAllFocusableElements(e)},r.isFromDefaultSelector=function(e){return e.target.classList.contains("oj-selectorbox")},r.getActionableElementsInNode=function(e){return l.getActionableElementsInNode(e)},r.isElementOrAncestorFocusable=function(e,t){return!(null==e||t&&t(e))&&(!!e.hasAttribute(r._DATA_OJ_TABMOD)||(e.tabIndex>=0||(r._FOCUSABLE_ELEMENTS_TAG.indexOf(e.tagName.toLowerCase())>-1||r.isElementOrAncestorFocusable(e.parentElement,t))))},r.handleActionableTab=function(e,t){var n=r.getFocusableElementsInNode(t);return n.length>0&&e.target===n[n.length-1]&&(n[0].focus(),!0)},r.handleActionablePrevTab=function(e,t){var n=r.getFocusableElementsInNode(t);return n.length>0&&e.target===n[0]&&(n[n.length-1].focus(),!0)},r.isEventClickthroughDisabled=function(e,t){for(var n=e.target;null!=n&&n!==t;){if(r.isClickthroughDisabled(n))return!0;n=n.parentNode}return!1},r.isClickthroughDisabled=function(e){return"disabled"===e.dataset.ojClickthrough},r.getDefaultScrollBarWidth=function(e){var t;if(e&&e.style){var n=e.style.visibility,i=e.style.position,l=e.style.overflowY,r=e.style.height,s=e.style.width;e.style.visibility="hidden",e.style.position="absolute",e.style.overflowY="hidden",e.style.height="50px",e.style.width="50px";var o=e.offsetWidth-e.clientWidth;e.style.overflowY="scroll",t=e.offsetWidth-e.clientWidth-o,e.style.width=s,e.style.height=r,e.style.overflowY=l,e.style.position=i,e.style.visibility=n}return t},r.disableDefaultBrowserStyling=function(e){e.setAttribute("x-ms-format-detection","none")},r.applyMergedInlineStyles=function(e,t,n){var i=r.convertStringToStyleObj(n),l=r.convertStringToStyleObj(t),s=Object.assign({},i,l);r.applyStyleObj(e,s)},r.convertStringToStyleObj=function(e){var t={};if(e.split)for(var n=e.split(";"),i=0;i<n.length;i++){var l=n[i];if(""!==l){var r=l.split(":");2===r.length&&(t[r[0].trim()]=r[1].trim())}}return t},r.applyStyleObj=function(e,t){for(var n=Object.keys(t),i=Object.values(t),l=0;l<n.length;l++)e.style[n[l]]=i[l]},r.isMobileTouchDevice=function(){var e=t.AgentUtils.getAgentInfo();return e.os===t.AgentUtils.OS.IOS||e.os===t.AgentUtils.OS.ANDROID||e.os===t.AgentUtils.OS.WINDOWSPHONE},r.getNoJQFocusHandlers=function(e,t){return n.getNoJQFocusHandlers(e,t)},r.areKeySetsEqual=function(e,n){if(e===n)return!0;var i,l,r=e.isAddAll();if(r!==n.isAddAll())return!1;if(r?(i=e.deletedValues(),l=n.deletedValues()):(i=e.values(),l=n.values()),i.size!==l.size)return!1;for(var s=i.values(),o=l.values(),E=s.next(),a=o.next();!E.done;){if(!t.KeyUtils.equals(E.value,a.value))return!1;E=s.next(),a=o.next()}return!0},r.KEYBOARD_KEYS={_SPACEBAR:" ",_SPACEBAR_IE:"SpaceBar",_SPACEBAR_CODE:32,_ENTER:"Enter",_ENTER_CODE:13,_UP:"ArrowUp",_UP_IE:"Up",_UP_CODE:38,_DOWN:"ArrowDown",_DOWN_IE:"Down",_DOWN_CODE:40,_LEFT:"ArrowLeft",_LEFT_IE:"Left",_LEFT_CODE:37,_RIGHT:"ArrowRight",_RIGHT_IE:"Right",_RIGHT_CODE:39,_HOME:"Home",_HOME_CODE:36,_END:"End",_END_CODE:35,_TAB:"Tab",_TAB_CODE:9,_ESCAPE:"Escape",_ESCAPE_IE:"Esc",_ESCAPE_CODE:27,_F2:"F2",_F2_CODE:113,_NUM5_KEY:"5",_NUM5_KEY_CODE:53,_LETTER_A:"a",_LETTER_A_UPPERCASE:"A",_LETTER_A_CODE:65,_META:"Meta",_META_CODE:91},r.isEnterKeyEvent=function(e){return e===r.KEYBOARD_KEYS._ENTER||e===r.KEYBOARD_KEYS._ENTER_CODE},r.isSpaceBarKeyEvent=function(e){return e===r.KEYBOARD_KEYS._SPACEBAR||e===r.KEYBOARD_KEYS._SPACEBAR_IE||e===r.KEYBOARD_KEYS._SPACEBAR_CODE},r.isEscapeKeyEvent=function(e){return e===r.KEYBOARD_KEYS._ESCAPE||e===r.KEYBOARD_KEYS._ESCAPE_IE||e===r.KEYBOARD_KEYS._ESCAPE_CODE},r.isTabKeyEvent=function(e){return e===r.KEYBOARD_KEYS._TAB||e===r.KEYBOARD_KEYS._TAB_CODE},r.isF2KeyEvent=function(e){return e===r.KEYBOARD_KEYS._F2||e===r.KEYBOARD_KEYS._F2_CODE},r.isHomeKeyEvent=function(e){return e===r.KEYBOARD_KEYS._HOME||e===r.KEYBOARD_KEYS._HOME_CODE},r.isEndKeyEvent=function(e){return e===r.KEYBOARD_KEYS._END||e===r.KEYBOARD_KEYS._END_CODE},r.isArrowUpKeyEvent=function(e){return e===r.KEYBOARD_KEYS._UP||e===r.KEYBOARD_KEYS._UP_IE||e===r.KEYBOARD_KEYS._UP_CODE},r.isArrowDownKeyEvent=function(e){return e===r.KEYBOARD_KEYS._DOWN||e===r.KEYBOARD_KEYS._DOWN_IE||e===r.KEYBOARD_KEYS._DOWN_CODE},r.isArrowLeftKeyEvent=function(e){return e===r.KEYBOARD_KEYS._LEFT||e===r.KEYBOARD_KEYS._LEFT_IE||e===r.KEYBOARD_KEYS._LEFT_CODE},r.isArrowRightKeyEvent=function(e){return e===r.KEYBOARD_KEYS._RIGHT||e===r.KEYBOARD_KEYS._RIGHT_IE||e===r.KEYBOARD_KEYS._RIGHT_CODE},r.isNumberFiveKeyEvent=function(e){return e===r.KEYBOARD_KEYS._NUM5_KEY||e===r.KEYBOARD_KEYS._NUM5_KEY_CODE},r.isLetterAKeyEvent=function(e){return e===r.KEYBOARD_KEYS._LETTER_A||e===r.KEYBOARD_KEYS._LETTER_A_UPPERCASE||e===r.KEYBOARD_KEYS._LETTER_A_CODE},r.isMetaKeyEvent=function(e){return e===r.KEYBOARD_KEYS._META||e===r.KEYBOARD_KEYS._META_CODE},r.getAddEventKeysResult=function(e,t,n){var i,l,s,o,E;function a(e,t){return{key:e,index:t}}var u=e.slice(),c=[];t.keys.forEach(function(e){c.push(e)});var A=[],f=t.addBeforeKeys?t.addBeforeKeys:t.afterKeys;null!=f&&f.forEach(function(e){A.push(e)});var d=t.indexes;if(A.length===c.length)for(var _=0;c.length!==_;)for(_=c.length,i=c.length-1;i>=0;i--)s=c[i],r.containsKey(u,s)||(null!=(l=A[i])?-1!==(E=r._indexOfKey(u,l))&&(u.splice(E,0,s),A.splice(i,1),c.splice(i,1)):n&&(u.push(s),A.splice(i,1),c.splice(i,1)));else if(null!=d&&d.length===c.length){var g=[];for(i=0;i<c.length;i++)if(s=c[i],!r.containsKey(u,s))if(null!=(o=d[i])){for(var K=!1,y=0;y<g.length;y++)if(g[y].index>o){g.splice(y,0,a(s,o)),K=!0;break}K||g.push(a(s,o))}else n&&u.push(s);for(i=0;i<g.length;i++){var O=g[i];O.index<u.length?u.splice(O.index,0,O.key):O.index===u.length&&n&&u.push(O.key)}}else n&&c.forEach(function(e){u.push(e)});return u},r.containsKey=function(e,n){for(var i=0;i<e.length;i++)if(t.KeyUtils.equals(e[i],n))return!0;return!1},r._indexOfKey=function(e,n){for(var i=0;i<e.length;i++)if(t.KeyUtils.equals(e[i],n))return i;return-1},r.calculateOffsetTop=function(e,t){for(var n=0,i=t;i&&i!==e&&e.contains(i);)n+=i.offsetTop,i=i.offsetParent;return n},r.getLogicalChildPopup=function(e){return l.getLogicalChildPopup(e)},r.isElementIntersectingScrollerBounds=function(e,t){var n,i,l,r;if(t===document.documentElement)n=0,i=document.documentElement.clientHeight,l=0,r=document.documentElement.clientWidth;else{var s=t.getBoundingClientRect();n=s.top,i=s.bottom,l=s.left,r=s.right}var o=e.getBoundingClientRect();return o.top<=i&&o.bottom>=n&&o.left<=r&&o.right>=l},r.getEventDetail=function(e,t){return new Promise(n=>{if(t.data&&t.metadata)n(t);else{const l=e.getCapability("fetchByKeys");l&&"lookup"===l.implementation?e.fetchByKeys({keys:new Set(t.keys),scope:"global"}).then(e=>{t.data=[],t.metadata=[],t.keys.forEach(n=>{const i=e.results.get(n);t.data.push(i.data),t.metadata.push(i.metadata)}),n(t)},e=>{i.error("Error fetching event detail due to fetchByKeys: "+e),n(null)}):(i.error("Error fetching event detail due to fetchByKeys: capability"),n(null))}})},r.isIterateAfterDoneNotAllowed=function(e){if(e&&e.getCapability){var t=e.getCapability("fetchFirst");if(t&&"notAllowed"===t.iterateAfterDone)return!0}return!1},r.isRequestIdleCallbackSupported=function(){return null!=window.requestIdleCallback&&null!=window.cancelIdleCallback&&null!=window.IdleDeadline},r.isFetchAborted=function(e){var t=e.value.fetchParameters.signal;return null==t?(i.warn("Signal is missing from fetch parameters, which is set by collection component and should be present"),!1):t.aborted},r.isChrome=function(){return t.AgentUtils.getAgentInfo().browser===t.AgentUtils.BROWSER.CHROME},r.isFirefox=function(){return t.AgentUtils.getAgentInfo().browser===t.AgentUtils.BROWSER.FIREFOX},r.isIE=function(){return t.AgentUtils.getAgentInfo().browser===t.AgentUtils.BROWSER.IE},r.isEdge=function(){return t.AgentUtils.getAgentInfo().browser===t.AgentUtils.BROWSER.EDGE},r.isSafari=function(){return t.AgentUtils.getAgentInfo().browser===t.AgentUtils.BROWSER.SAFARI},r.isMac=function(){return t.AgentUtils.getAgentInfo().os===t.AgentUtils.OS.MAC},r.isWindows=function(){return t.AgentUtils.getAgentInfo().os===t.AgentUtils.OS.WINDOWS},r.isIos=function(){return t.AgentUtils.getAgentInfo().os===t.AgentUtils.OS.IOS},r.isAndroid=function(){return t.AgentUtils.getAgentInfo().os===t.AgentUtils.OS.ANDROID},r.isBlink=function(){return t.AgentUtils.getAgentInfo().engine===t.AgentUtils.ENGINE.BLINK};const s=r.applyMergedInlineStyles,o=r.applyRendererContent,E=r.applyStyleObj,a=r.areKeySetsEqual,u=r.containsKey,c=r.convertStringToStyleObj,A=r.disableElement,f=r.disableAllFocusableElements,d=r.disableDefaultBrowserStyling,_=r.enableAllFocusableElements,g=r.getActionableElementsInNode,K=r.getAddEventKeysResult,y=r.getDefaultScrollBarWidth,O=r.isElementOrAncestorFocusable,b=r.isIterateAfterDoneNotAllowed,D=r.getFocusableElementsInNode,S=r.getLogicalChildPopup,h=r.getNoJQFocusHandlers,v=r.handleActionablePrevTab,p=r.handleActionableTab,R=r.isArrowDownKeyEvent,B=r.isArrowLeftKeyEvent,C=r.isArrowRightKeyEvent,Y=r.isArrowUpKeyEvent,I=r.isClickthroughDisabled,m=r.isEndKeyEvent,T=r.isEnterKeyEvent,w=r.isEscapeKeyEvent,N=r.isEventClickthroughDisabled,F=r.isFetchAborted,U=r.isFromDefaultSelector,P=r.isF2KeyEvent,L=r.isHomeKeyEvent,M=r.isMobileTouchDevice,W=r.isSpaceBarKeyEvent,k=r.isTabKeyEvent,H=r.isNumberFiveKeyEvent,j=r.isLetterAKeyEvent,x=r.isMetaKeyEvent,G=r.KEYBOARD_KEYS,q=r.CHECKVIEWPORT_THRESHOLD,V=r.calculateOffsetTop,J=r.isElementIntersectingScrollerBounds,Q=r.getEventDetail,z=r.isRequestIdleCallbackSupported,X=r.isChrome,Z=r.isFirefox,$=r.isSafari,ee=r.isEdge,te=r.isIE,ne=r.isMac,ie=r.isWindows,le=r.isIos,re=r.isAndroid,se=r.isWebkit=function(){return t.AgentUtils.getAgentInfo().engine===t.AgentUtils.ENGINE.WEBKIT},oe=r.isBlink,Ee=r.getBrowserVersion=function(){return parseInt(t.AgentUtils.getAgentInfo().browserVersion,10)};e.CHECKVIEWPORT_THRESHOLD=q,e.KEYBOARD_KEYS=G,e.applyMergedInlineStyles=s,e.applyRendererContent=o,e.applyStyleObj=E,e.areKeySetsEqual=a,e.calculateOffsetTop=V,e.containsKey=u,e.convertStringToStyleObj=c,e.disableAllFocusableElements=f,e.disableDefaultBrowserStyling=d,e.disableElement=A,e.enableAllFocusableElements=_,e.getActionableElementsInNode=g,e.getAddEventKeysResult=K,e.getBrowserVersion=Ee,e.getDefaultScrollBarWidth=y,e.getEventDetail=Q,e.getFocusableElementsInNode=D,e.getLogicalChildPopup=S,e.getNoJQFocusHandlers=h,e.handleActionablePrevTab=v,e.handleActionableTab=p,e.isAndroid=re,e.isArrowDownKeyEvent=R,e.isArrowLeftKeyEvent=B,e.isArrowRightKeyEvent=C,e.isArrowUpKeyEvent=Y,e.isBlink=oe,e.isChrome=X,e.isClickthroughDisabled=I,e.isEdge=ee,e.isElementIntersectingScrollerBounds=J,e.isElementOrAncestorFocusable=O,e.isEndKeyEvent=m,e.isEnterKeyEvent=T,e.isEscapeKeyEvent=w,e.isEventClickthroughDisabled=N,e.isF2KeyEvent=P,e.isFetchAborted=F,e.isFirefox=Z,e.isFromDefaultSelector=U,e.isHomeKeyEvent=L,e.isIE=te,e.isIos=le,e.isIterateAfterDoneNotAllowed=b,e.isLetterAKeyEvent=j,e.isMac=ne,e.isMetaKeyEvent=x,e.isMobileTouchDevice=M,e.isNumberFiveKeyEvent=H,e.isRequestIdleCallbackSupported=z,e.isSafari=$,e.isSpaceBarKeyEvent=W,e.isTabKeyEvent=k,e.isWebkit=se,e.isWindows=ie,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdatacollection-common.js.map