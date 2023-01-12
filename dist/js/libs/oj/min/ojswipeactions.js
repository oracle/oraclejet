/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojoption","touchr","ojs/ojcore-base","jquery","ojs/ojdomutils","ojs/ojcontext","ojs/ojconfig","ojs/ojoffcanvas","ojs/ojswipetoreveal","ojs/ojcustomelement-utils"],function(e,t,n,s,o,a,i,c,r,l){"use strict";var u;n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n,s=s&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s,a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a,(u={properties:{translations:{type:"object",value:{},properties:{ariaHideActionsDescription:{type:"string"},ariaShowEndActionsDescription:{type:"string"},ariaShowStartActionsDescription:{type:"string"}}}},methods:{getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},events:{ojAction:{}},extension:{}}).extension._WIDGET_NAME="ojSwipeActions",n.CustomElementBridge.register("oj-swipe-actions",{metadata:u}),n.__registerWidget("oj.ojSwipeActions",s.oj.baseComponent,{version:"1.0.0",defaultElement:"<div>",widgetEventPrefix:"oj",options:{action:null},_ComponentCreate:function(){var e,t,n=this,o=!1,a=!1;this._super(),this.element.uniqueId(),this.element[0].classList.add("oj-swipeactions","oj-component"),this.element[0].setAttribute("tabIndex","-1"),this._on(!0,{keydown:function(t){27===t.keyCode?(e=t.target.parentNode.parentNode).classList.contains("oj-offcanvas-open")&&(n._close({selector:e,_animate:!1}),t.preventDefault()):13===t.keyCode&&t.target.classList.contains("oj-swipeactions-action-panel")&&(o=!0)},keyup:function(e){13===e.keyCode&&o&&n._handleAction(e),o=!1},mousedown:function(e){t=n._handleMouseDownorTouchStart(e)},touchstart:function(e){t=n._handleMouseDownorTouchStart(e)},click:function(e){n._handleAction(e,t)&&e.stopPropagation(),t=null},ojdefaultaction:function(e,t){var o=s(t.selector).children("oj-option.oj-swipetoreveal-default");o.length>0&&(n._fireActionEvent(o[0],null),a=!0)},ojopen:function(e,t){a&&n._close(t),a=!1,n._updateOptionClass(e.target,".oj-sm-align-self-center","oj-flex-bar-center-absolute"),n._releaseBusyState()},ojclose:function(e,t){var o=s(t.selector).children(".oj-swipeactions-hide-actions-link");o.length>0&&o[0].parentNode.removeChild(o[0]);var a=this._getOptionClass(e.target);n._updateOptionClass(e.target,".oj-flex-bar-center-absolute",a),n._releaseBusyState()}}),this._focusable({applyHighlight:!0,setupHandlers:function(e,t){n._focusInHandler=e,n._focusOutHandler=t}}),this._setup()},_releaseBusyState:function(){this.busyStateResolve&&(this.busyStateResolve(),this.busyStateResolve=null)},_close:function(e){var t=a.getContext(this.element[0]).getBusyContext().addBusyState({description:"closing offcanvas"});return c.close(e).then(function(){t()})},_handleMouseDownorTouchStart:function(e){return e.target.closest("oj-option")},_handleAction:function(e,t){var n;if(t)n=t;else{var o=s(e.target).parents("oj-option");o.length>0&&(n=o[0])}return!!n&&(this._close({selector:n.parentNode}).then(function(){this._fireActionEvent(n,e),null==t&&this.element[0].parentNode.focus()}.bind(this)),!0)},_SetupResources:function(){this._super(),this._setupOrReleaseOffcanvas(r.tearDownSwipeActions),this._setupOrReleaseOffcanvas(r.setupSwipeActions,{callback:()=>null!=this.busyStateResolve})},_ReleaseResources:function(){this._super(),this._setupOrReleaseOffcanvas(r.tearDownSwipeActions),this._releaseBusyState()},_setupOrReleaseOffcanvas:function(e,t){this._applyOffcanvas("oj-offcanvas-start",e,t),this._applyOffcanvas("oj-offcanvas-end",e,t)},_closeAllOffcanvas:function(){var e=this,t=function(t){e._close({selector:t})};this._applyOffcanvas("oj-offcanvas-start",t),this._applyOffcanvas("oj-offcanvas-end",t)},_applyOffcanvas:function(e,t,n){var s=this.element[0].querySelector("."+e);s&&t(s,n)},_fireActionEvent:function(e,t){var n={};t&&(n.originalEvent=t instanceof s.Event?t.originalEvent:t);var a={detail:n,cancelable:!0,bubbles:!0};o.dispatchEvent(e,new CustomEvent("ojAction",a))},refresh:function(){this._super(),this._releaseBusyState(),this._setupOrReleaseOffcanvas(r.tearDownSwipeActions),this._setup(),this._setupOrReleaseOffcanvas(r.setupSwipeActions,{callback:()=>null!=this.busyStateResolve})},_createOffcanvas:function(e,t){var n=e[t];if(n&&n.length>0&&"TEMPLATE"===n[0].tagName){var s=document.createElement("div");s.className="start"===t?"oj-offcanvas-start":"oj-offcanvas-end",this.element[0].appendChild(s),this._renderAccessibleLink(s)}},_setup:function(){var e=this;this.element[0].classList.add("oj-offcanvas-inner-wrapper"),this.element[0].parentNode.classList.add("oj-offcanvas-outer-wrapper");var t=l.CustomElementUtils.getSlotMap(this.element[0]);this._createOffcanvas(t,"start"),this._createOffcanvas(t,"end"),s(this.element).on("ojpanstart",function(t){t.isDefaultPrevented()||e._renderOffcanvas(t.target)}),s(this.element).on("ojpanend",function(){var t=a.getContext(e.element[0]).getBusyContext();e.busyStateResolve=t.addBusyState({description:"opening or closing offcanvas"})})},_renderOffcanvas:function(e,t){var n=this;e.setAttribute("role","toolbar"),e.setAttribute("data-oj-context","");var s=l.CustomElementUtils.getSlotMap(this.element[0]),o=e.classList.contains("oj-offcanvas-start")?s.start[0]:s.end[0],c=a.getContext(n.element[0]).getBusyContext(),r=c.addBusyState({description:"rendering ojoptions"});const u={customElement:this._GetCustomElement()};i.__getTemplateEngine(u).then(function(s){n._render(s,e,o),t?(c=a.getContext(e).getBusyContext()).whenReady().then(function(){t(),r()}):r()},function(e){throw r(),new Error("Error loading template engine: "+e)})},_showAccessibleLinks:function(){for(var e=0,t=this.element[0].querySelectorAll("a.oj-helper-hidden-accessible"),n=0;n<t.length;n++)t[n].style.left=e+"px",t[n].className="oj-swipeactions-accessible-link",e=e+t[n].offsetWidth+5},_hideAccessibleLinks:function(){for(var e=this.element[0].querySelectorAll("a.oj-swipeactions-accessible-link"),t=0;t<e.length;t++)e[t].className="oj-helper-hidden-accessible"},_renderAccessibleLink:function(e){var t=!1,i=this,r=document.createElement("a");r.setAttribute("tabIndex","0"),r.setAttribute("href","#"),r.textContent=this.getTranslatedString(e.classList.contains("oj-offcanvas-start")?"ariaShowStartActionsDescription":"ariaShowEndActionsDescription");var l=n.AgentUtils.getAgentInfo().os===n.AgentUtils.OS.ANDROID;l?(r.style.color="transparent",r.className="oj-swipeactions-accessible-link",e.classList.contains("oj-offcanvas-end")&&null!=this.element[0].querySelector("a.oj-swipeactions-accessible-link")&&(r.style.right="0px"),r.addEventListener("touchstart",function(e){t=e.touches[0].force>0},{passive:!0})):r.className="oj-helper-hidden-accessible",r.addEventListener("focus",function(){l||i._showAccessibleLinks(),i._closeAllOffcanvas()}),r.addEventListener("blur",function(e){null==e.relatedTarget||e.relatedTarget.classList.contains("oj-swipeactions-accessible-link")||setTimeout(function(){l||i._hideAccessibleLinks()},0)}),r.addEventListener("click",function(n){t||(n.preventDefault(),n.stopPropagation(),i._renderOffcanvas(e,function(){if(0!==e.childElementCount){s(e).children("oj-option").addClass("oj-swipetoreveal-action").children().attr("tabIndex",0);var t={};t.selector=e,t.autoDismiss="none",t._animate=!1,t.displayMode="push";var n=o.isTouchSupported(),r=null;n&&((r=document.createElement("a")).className="oj-swipeactions-hide-actions-link",r.setAttribute("tabIndex","0"),r.setAttribute("href","#"),r.setAttribute("aria-label",i.getTranslatedString("ariaHideActionsDescription")),r.addEventListener("touchend",function(){i._close(t)}));var l=a.getContext(i.element[0]).getBusyContext().addBusyState({description:"opening offcanvas"});c.open(t).then(function(){r&&e.appendChild(r),l()})}}))}),this.element[0].appendChild(r)},_render:function(e,t,n){var o=this;s(t).children("oj-option").remove();var a=[];e.execute(this.element[0],n,null).forEach(function(e){"OJ-OPTION"===e.tagName&&a.push(e)}),a.forEach(function(e){e.customOptionRenderer=o._customOptionRenderer.bind(o),t.appendChild(e)})},_customOptionRenderer:function(e){var t=this;if(!(s(e).children("div").length>0)){e.setAttribute("role","button"),e.dataset.ojAction=e.value,e.classList.contains("oj-swipeactions-default")&&e.classList.add("oj-swipetoreveal-default");var n=document.createElement("div");n.className="oj-flex-bar oj-swipeactions-action-panel",n.addEventListener("focus",function(){t._focusInHandler(s(n))}),n.addEventListener("blur",function(){t._focusOutHandler(s(n))});var o=document.createElement("div");o.className=this._getOptionClass(e.parentElement),n.appendChild(o);var a=document.createElement("div");a.className="oj-flex oj-sm-flex-direction-column",o.appendChild(a);var i=l.CustomElementUtils.getSlotMap(e),c=i.startIcon;c&&c.forEach(function(e){a.appendChild(e)});var r=i[""];if(r){var u=document.createElement("div");u.className="oj-flex-item oj-swipeactions-action-text",a.appendChild(u),r.forEach(function(e){u.appendChild(e)})}s(e).prepend(n)}},_updateOptionClass:function(e,t,n){e.querySelectorAll(t).forEach(function(e){e.className=n})},_getOptionClass:function(e){return e.classList.contains("oj-offcanvas-end")?"oj-flex-bar-start oj-sm-align-self-center":"oj-flex-bar-end oj-sm-align-self-center"},_doAction:function(e){return new Promise(function(t){var n=this.element[0].querySelector('oj-option[data-oj-action="'+e+'"');if(null!=n)this._fireActionEvent(n,null),t();else{var s=this.element[0].querySelector(".oj-offcanvas-start");null!=s&&0===s.childElementCount&&void 0===s._checked||null!=(s=this.element[0].querySelector(".oj-offcanvas-end"))&&0===s.childElementCount&&void 0===s._checked?(s._checked=!0,this._renderOffcanvas(s,function(){this._doAction(e),t()}.bind(this))):t()}}.bind(this))},_destroy:function(){this.element[0].removeEventListener("touchstart",this._touchstartListener,{passive:!1}),delete this._touchstartListener}})});
//# sourceMappingURL=ojswipeactions.js.map