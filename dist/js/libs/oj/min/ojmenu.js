/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["jquery","ojs/ojjquery-hammer","ojs/ojpopupcore","ojs/ojoption","ojs/ojcore-base","hammerjs","ojs/ojcontext","ojs/ojthemeutils","ojs/ojcomponentcore","ojs/ojanimation","ojs/ojlogger","ojs/ojconfig","ojs/ojcustomelement-utils","ojs/ojcustomelement-registry"],function(e,t,i,n,s,o,r,a,l,u,c,h,m,d){"use strict";var p;e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,s=s&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s,r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r,function(){var t=[],n=!1,p="oj-menu-position";const f={dropdown:{open:"--oj-private-menu-global-drop-down-open-animation",close:"--oj-private-menu-global-drop-down-close-animation"},sheet:{open:"--oj-private-menu-global-sheet-open-animation",close:"--oj-private-menu-global-sheet-close-animation"},submenu:{open:"--oj-private-menu-global-submenu-open-animation",close:"--oj-private-menu-global-submenu-close-animation"}};var _=s.AgentUtils.getAgentInfo().os===s.AgentUtils.OS.MAC&&s.AgentUtils.getAgentInfo().browser===s.AgentUtils.BROWSER.SAFARI,v="menuItem"===a.getCachedCSSVarValues(["--oj-private-menu-global-sheet-cancel-affordance"])[0],g="dismiss"===a.getCachedCSSVarValues(["--oj-private-menu-global-sheet-swipe-down-behavior"])[0],b=a.getCachedCSSVarValues(["--oj-private-menu-global-drop-down-modality"])[0]||"modeless",j=a.getCachedCSSVarValues(["--oj-private-menu-global-sheet-modality"])[0]||"modal",O="bottom-"+(a.getCachedCSSVarValues(["oj-private-menu-global-sheet-margin-bottom"])[0]||0),S=g&&{recognizers:[[o.Swipe,{direction:o.DIRECTION_HORIZONTAL}]]};const y=-(.5*parseInt(window.getComputedStyle(document.documentElement).fontSize,10)+1);function E(t){var i,n=[],s=t.children("oj-defer").first();i=s.length>0?s.children(".oj-menu-item, oj-menu-select-many"):t.children(".oj-menu-item, oj-menu-select-many");for(var o=0;o<i.length;o++){var r=e(i[o]);r.is(".oj-menu-item")?n.push(r[0]):"OJ-MENU-SELECT-MANY"===r[0].nodeName&&(n=e.merge(n,r.children(".oj-menu-item")))}return n}s.__registerWidget("oj.ojMenu",e.oj.baseComponent,{defaultElement:"<ul>",delay:300,role:"menu",widgetEventPrefix:"oj",options:{menuSelector:"ul",openOptions:{display:"auto",initialFocus:"menu",launcher:null,position:{my:{horizontal:"start",vertical:"top"},offset:{x:0,y:0},at:{horizontal:"start",vertical:"bottom"},of:void 0,collision:"flipfit"}},submenuOpenOptions:{position:{my:"start top",at:"end top",collision:"flipfit"}},animateStart:null,animateEnd:null,beforeOpen:null,close:null,open:null,action:null,menuAction:null},_ComponentCreate:function(){if(this._super(),this._focusForTesting=this._focus,this._nextForTesting=this._next,this._selectForTesting=this._select,this._IsCustomElement()){this.element.hide();var e=this.options;e.openOptions.position=s.PositionUtils.coerceToJet(e.openOptions.position);var t=this.element[0].querySelector("oj-defer");t&&t.setAttribute("data-oj-context",!0)}else this._createAsTopLevelMenu()},_preventDefault:function(e){this.options.disabled&&e.preventDefault()},_createAsTopLevelMenu:function(){var t=this;this.activeMenu=this.element,this.mouseHandled=!1,this._setupSwipeBehavior(),this.element.uniqueId().addClass("oj-menu oj-component").hide().attr({role:this.role,tabIndex:"0","aria-hidden":"true"}),this._on(!0,{"mousedown .oj-menu-item":this._preventDefault,click:this._preventDefault,keydown:function(t){this.options.disabled&&(t.keyCode!==e.ui.keyCode.ESCAPE&&t.keyCode!==e.ui.keyCode.TAB||(t.keyCode===e.ui.keyCode.TAB&&t.preventDefault(),this._focusLauncherAndDismiss(t)))}}),this.options.disabled&&this.element.addClass("oj-disabled").attr("aria-disabled","true");var i=function(t){if(!this.focusHandled){this.focusHandled=!0;var i=e(t.currentTarget);try{this._focusIsFromPointer=!0,this._focus(t,i)}finally{this._focusIsFromPointer=!1}}}.bind(this),n=function(t){e(t.target).is(":visible")&&this._collapse(t,"eventSubtree")}.bind(this);this._touchStartHandler=function(t){this.focusHandled=!1;var i=e(t.currentTarget);this._focus(t,i)}.bind(this),this.element[0].addEventListener("touchstart",this._touchStartHandler,{passive:!0}),this._delegatedHandleMouseEnterMenuItem=function(t){const n=t.currentTarget,s=t.target.closest(".oj-menu-item");s&&n.contains(s)&&i(e.Event(t,{currentTarget:s}))},this.element[0].addEventListener("touchstart",this._delegatedHandleMouseEnterMenuItem,{passive:!0}),this._on({"click .oj-disabled > a":function(e){e.preventDefault()},click:function(){this.mouseHandled=!1},mouseover:function(){this.focusHandled=!1},"click .oj-menu-item:has(a)":function(t){var i=e(t.target).closest(".oj-menu-item");if(!this.mouseHandled&&i.not(".oj-disabled").length){if(this.mouseHandled=!0,t.preventDefault(),this.active&&this.active.closest(i).length&&this.active.get(0)!==i.get(0))return;i.has(".oj-menu").length?this._expand(t):(this._select(t),this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".oj-menu").length&&this._clearTimer&&this._clearTimer()))}},"mouseenter .oj-menu-item":i,mouseleave:n,"mouseleave .oj-menu":n,focus:function(t,i){if(!(i||t.target===this.element[0]||this._focusSkipLink&&t.target===this._focusSkipLink.getLink()[0])){var n=this.active||e(E(this.element)).first(0);this._focus(t,n)}},keydown:this._keydown,keyup:function(t){t.keyCode!==e.ui.keyCode.ENTER&&t.keyCode!==e.ui.keyCode.SPACE||(this.__spaceEnterDownInMenu=!1)}}),this._focusable({applyHighlight:!_,recentPointer:function(){return t._focusIsFromPointer},setupHandlers:function(e,i){t._focusInHandler=e,t._focusOutHandler=i}}),this._usingCallback=e.proxy(this._usingHandler,this),this._setup()},_createAsSubmenu:function(){this.element.attr(l._OJ_CONTAINER_ATTR,this.widgetName),this.element.uniqueId().addClass("oj-menu oj-component oj-menu-submenu oj-menu-dropdown").hide().attr({role:this.role,tabIndex:"0","aria-hidden":"true"}),this._setup()},__contextMenuPressHoldJustEnded:function(e){if(!arguments.length)return n;n=e},_processOjOptions:function(){this._maxEndIconCount=0,this._maxStartIconCount=0,this._startIconWidth=0,this._endIconWidth=0;var t=function(t){var i,n=[],s=t.children("oj-defer").first();i=s.length>0?s.children("oj-option, oj-menu-select-many"):t.children("oj-option, oj-menu-select-many");for(var o=0;o<i.length;o++){var r=e(i[o]);"OJ-OPTION"===r[0].nodeName?n.push(r[0]):"OJ-MENU-SELECT-MANY"===r[0].nodeName&&(n=e.merge(n,r.children("oj-option")))}return e(n)}(this.element);this._clearOption(t);for(var i=0;i<t.length;i++){t[i].customOptionRenderer=this._customOptionRenderer.bind(this)}},_customOptionRenderer:function(t){function i(e){if(e.previousElementSibling&&"OJ-OPTION"===e.previousElementSibling.nodeName)return e.previousElementSibling;if(e.previousElementSibling&&"OJ-MENU-SELECT-MANY"===e.previousElementSibling.nodeName){var t=e.previousElementSibling.lastElementChild;return"OJ-OPTION"===t.nodeName?t:t.previousElementSibling?t.previousElementSibling:i(t)}return e.previousElementSibling||"OJ-MENU-SELECT-MANY"!==e.parentElement.nodeName?void 0:i(e.parentElement)}function n(e){return e.nextElementSibling&&"OJ-OPTION"===e.nextElementSibling.nodeName?e.nextElementSibling:e.nextElementSibling&&"OJ-MENU-SELECT-MANY"===e.nextElementSibling.nodeName?e.nextElementSibling.firstElementChild:e.nextElementSibling&&"OJ-OPTION"===e.nextElementSibling.nodeName||"OJ-MENU-SELECT-MANY"!==e.parentElement.nodeName?void 0:n(e.parentElement)}var s=e(t),o="OJ-MENU-SELECT-MANY"===s.parent().prop("nodeName"),r=this;this._hasSubmenus=!1;for(var a,l,u,c,h=s.children('a[ojmenu="opt"]'),d=0;d<h.length;d++)(a=e(h[d])).children().removeClass("oj-menu-item-icon").removeClass("oj-menu-item-end-icon"),a.replaceWith(a.contents());if(s.children('span[ojmenu="opt"]').remove(),/[^\-\u2014\u2013\s]/.test(s.text())||0!==s.children().length){this._initMenuItems(s);var p=document.createElement("a");p.setAttribute("href","#"),p.setAttribute("ojmenu","opt"),(a=e(p)).uniqueId().attr({tabIndex:"-1",role:this._itemRole(s)}),o&&(a.attr("aria-checked","false"),(l=t).previousElementSibling||i(l)||e(l).addClass("oj-top"),l.nextElementSibling&&"OJ-OPTION"===l.nextElementSibling.nodeName||n(l)||e(l).addClass("oj-bottom")),s.prepend(p);var f=m.CustomElementUtils.getSlotMap(t),_=f.startIcon;if(_||o){if(o){var v=document.createElement("span");v.setAttribute("slot","startIcon"),v.setAttribute("ojmenu","opt"),v.setAttribute("class","oj-menucheckbox-icon"),_?_.splice(0,0,v):_=[v]}var g=_.length;r._maxStartIconCount=Math.max(r._maxStartIconCount,g),e.each(_,function(t,i){e(i).addClass("oj-menu-item-icon"),a.append(i),g>1&&r._positionStartIcon(i,t,g)})}var b=0,j=f.endIcon;j&&(b=j.length,r._maxEndIconCount=Math.max(r._maxEndIconCount,b));var O=f[""];e.each(O,function(t,i){e(i).is("oj-menu")?(r._setupSubmenu(a,e(i),0===b),r._hasSubmenus=!0):a.append(i)}),j&&e.each(j,function(t,i){e(i).addClass("oj-menu-item-end-icon"),a.append(i),b>1&&r._positionEndIcon(i,t,b)}),t.disabled?(s.addClass("oj-disabled"),a.attr("aria-disabled","true")):(s.removeClass("oj-disabled"),a.removeAttr("aria-disabled"))}else this._initDividers(s),(c=i(u=t))&&e(c).addClass("oj-menu-item-before-divider"),(c=n(u))&&e(c).addClass("oj-menu-item-after-divider");this._updateMenuPadding(this.element)},_positionStartIcon:function(t,i,n){var s;s=this.isRtl?"margin-right":"margin-left";var o=Number(e(t).attr("data-oj-default-margin"));isNaN(o)&&(o=parseInt(e(t).css(s),10),e(t).attr("data-oj-default-margin",o)),this._startIconWidth=-1*o,e(t).css(s,o*(n-i)+"px")},_positionEndIcon:function(t,i,n){var s,o;this.isRtl?(s="margin-left",o="margin-right"):(s="margin-right",o="margin-left");var r=Number(e(t).attr("data-oj-default-margin"));isNaN(r)&&(r=parseInt(e(t).css(s),10),e(t).attr("data-oj-default-margin",r)),this._endIconWidth=-1*parseInt(e(t).css(o),10),e(t).css(s,r+this._endIconWidth*(n-i-1)+"px")},_updateMenuPadding:function(t){var i=e(E(t)).children();i.each(function(){let t=e(this).children(".oj-menu-item-icon:not(.oj-menu-cancel-icon)").length,i=e(this).children(".oj-menu-item-end-icon").length||e(this).children(".oj-menu-submenu-icon").length;0===t&&0===i?e(this).addClass("oj-menu-option-text-only"):(t>0&&e(this).addClass("oj-menu-option-start-icon"),i>0&&e(this).addClass("oj-menu-option-end-icon"))}),this._maxStartIconCount&&this._maxStartIconCount>1&&this._applyAnchorIconPadding(i,this._startIconWidth,this._maxStartIconCount,!0),this._maxEndIconCount&&this._maxEndIconCount>1&&this._applyAnchorIconPadding(i,this._endIconWidth,this._maxEndIconCount,!1)},_applyAnchorIconPadding:function(t,i,n,s){var o;o=this.isRtl&&s||!this.isRtl&&!s?"padding-right":"padding-left",t.each(function(){var t=Number(e(this).attr("data-oj-default-padding"));isNaN(t)&&(t=parseInt(e(this).css(o),10),e(this).attr("data-oj-default-padding",t)),e(this).css(o,t+i*(n-1)+"px")})},_clickAwayHandler:function(i){if("focus"===i.type||"mousedown"===i.type||"touchstart"===i.type||121===i.keyCode&&i.shiftKey||93===i.keyCode){if("mousedown"===i.type&&n)return;var s=this,o=t.slice(0,t.length);e.each(o,function(t,n){if(!e(i.target).closest(n.element).length&&("keydown"===i.type||"mousedown"===i.type&&3===i.which||!e(i.target).closest(n._launcher).length||n._isContextMenu&&("mousedown"===i.type&&3!==i.which||"touchstart"===i.type))&&!n._dismissEvent){n._dismissEvent=i;var o=n._collapse(i,"eventSubtree");s._runOnPromise(o,function(){n.__dismiss(i),n._dismissEvent=null})}})}},_setOption:function(e,t){this._superApply(arguments),"translations"===e&&this._cancelAnchor&&this._cancelAnchor.text(this.options.translations.labelCancel)},_destroy:function(){this.element.is(":visible")&&this.__dismiss(),this._setWhenReady("none"),this._clearTimer&&this._clearTimer(),delete this._clearTimer,this.element[0].removeEventListener("touchstart",this._touchStartHandler,{passive:!0}),delete this._touchStartHandler,this.element[0].removeEventListener("touchstart",this._delegatedHandleMouseEnterMenuItem,{passive:!0}),delete this._delegatedHandleMouseEnterMenuItem,this.element.removeAttr("aria-activedescendant").removeClass("oj-component").find(".oj-menu").addBack().removeClass("oj-menu oj-menu-submenu oj-menu-icons oj-menu-end-icons oj-menu-text-only").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".oj-menu-item").removeClass("oj-menu-item").removeAttr("role").children("a").removeAttr("aria-disabled").removeUniqueId().removeClass("oj-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var t=e(this);t.data("oj-ojMenu-submenu-icon")&&t.remove()}),this.element.find("a").removeAttr("aria-expanded"),this.element.find(".oj-menu-divider").removeClass("oj-menu-divider").removeAttr("role"),delete this._popupServiceEvents,delete this._usingCallback;var t=this._clearCloseDelayTimer;delete this._clearCloseDelayTimer,t&&t(),this.element.ojHammer("destroy"),this._super()},_keydown:function(t){var i=!0;function n(e){return e.replace(/[-\[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}switch(t.keyCode){case e.ui.keyCode.HOME:this._move("first","first",t);break;case e.ui.keyCode.END:this._move("last","last",t);break;case e.ui.keyCode.UP:this._previous(t);break;case e.ui.keyCode.DOWN:this._next(t);break;case e.ui.keyCode.LEFT:case e.ui.keyCode.RIGHT:t.keyCode===e.ui.keyCode.RIGHT!==this.isRtl?this.active&&!this.active.is(".oj-disabled")&&this._expand(t):this._collapse(t,"active");break;case e.ui.keyCode.ENTER:case e.ui.keyCode.SPACE:this._handleEnterSpace(t),this.__spaceEnterDownInMenu=!0;var s=this;setTimeout(function(){s.__spaceEnterDownInMenu=!1},100);break;case e.ui.keyCode.TAB:t.preventDefault(),this._focusLauncherAndDismiss(t);break;case e.ui.keyCode.ESCAPE:if(this._launcher){var o=this.element.attr("aria-activedescendant"),r=e(document.getElementById(o)).parents(".oj-menu").first();r.length>0&&r[0]!==this.element[0]?this._collapse(t,"active"):this._focusLauncherAndDismiss(t)}else this._collapse(t,"active");break;default:i=!1;var a=this.previousFilter||"",l=String.fromCharCode(t.keyCode),u=!1;clearTimeout(this.filterTimer),l===a?u=!0:l=a+l;var c=new RegExp("^"+n(l),"i"),h=e(E(this.activeMenu)).filter(function(){return c.test(e(this).children("a").text())});(h=u&&-1!==h.index(this.active.next())?this.active.nextAll(".oj-menu-item"):h).length||(l=String.fromCharCode(t.keyCode),c=new RegExp("^"+n(l),"i"),h=e(E(this.activeMenu)).filter(function(){return c.test(e(this).children("a").text())})),h.length?(this._focus(t,h),h.length>1?(this.previousFilter=l,this.filterTimer=setTimeout(function(){delete this.previousFilter}.bind(this),1e3)):delete this.previousFilter):delete this.previousFilter}i&&t.preventDefault()},_handleEnterSpace:function(e){this.active&&!this.active.is(".oj-disabled")&&(this.active.children("a[aria-haspopup='true']").length?this._expand(e):this._select(e))},refresh:function(){function t(t){for(var i=t.element.find("oj-menu:not(.oj-menu-submenu)"),n=0;n<i.length;n++){e(i[n]).attr("aria-hidden","true").hide(),r.getContext(i[n]).getBusyContext().whenReady().then(function(e){e.refresh()}.bind(t,i[n]))}}(this._super(),this._IsCustomElement()&&!this._wasCreated)?(this.element.parent().is("oj-option")&&(this._isSubmenu=!0,this._createAsSubmenu()),this._isSubmenu||(l.subtreeShown(this.element[0]),this._createAsTopLevelMenu(),t(this)),this._wasCreated=!0):(t(this),this._setup());this._reposition()},_reposition:function(){var t=this.element;if(t.is(":visible")&&!(t[0].getBoundingClientRect().width>document.documentElement.clientWidth)){var i=t.data(p);t[0].style.maxHeight="",t[0].style.overflowY="",this._updateMenuMaxHeight(),t.position(i),t.find(".oj-menu").each(function(){var t=e(this);t.is(":visible")&&(i=t.data(p),t.position(i))})}},_setup:function(){this.isRtl="rtl"===this._GetReadingDirection(),this._IsCustomElement()?(this._processOjOptions(),this._isSubmenu&&(this.options.openOptions.launcher=this.element.parent()),this._updateMenuPadding(this.element)):this._setupWidgetMenus(),this.active&&!e.contains(this.element[0],this.active[0])&&this._blur()},_setupWidgetMenus:function(){var t=this,i=this.element.find(this.options.menuSelector),n=i.add(this.element),s=n.children();this._hasSubmenus=!!i.length,s.filter(".oj-menu-divider").has("a").removeClass("oj-menu-divider oj-menu-item").removeAttr("role");var o=s.filter(":not(.oj-menu-item):has(a)"),r=o.children("a");this._initMenuItems(o),this._initAnchors(r);var a=s.filter(function(t,i){var n=e(i);return n.is(":not(.oj-menu-item)")&&!/[^\-\u2014\u2013\s]/.test(n.text())});this._initDividers(a),this._initDividerNeighbors(s,a),s.filter(".oj-disabled").children("a").attr("aria-disabled","true"),s.filter(":not(.oj-disabled)").children("a").removeAttr("aria-disabled"),i.filter(":not(.oj-menu)").addClass("oj-menu oj-menu-submenu oj-menu-dropdown").hide().attr({role:this.role,"aria-hidden":"true"}).each(function(){var i=e(this);t._setupSubmenu(t._getSubmenuAnchor(i),i,!0)}),n.each(function(){t._updateMenuPadding(e(this))})},_setupSubmenu:function(t,i,n){var s=0!==t[0].querySelectorAll(".oj-menu-submenu-icon.oj-component-icon").length;if(t.attr("aria-haspopup","true").attr("role","menuitem").attr("aria-expanded","false"),n&&!s){var o=e("<span>");o.addClass("oj-menu-submenu-icon oj-component-icon").data("oj-ojMenu-submenu-icon",!0),t.append(o)}this._clearTimer=this._setTimer(function(){delete this._clearTimer,t[0].parentElement&&t[0].parentElement.disabled&&i.find("oj-option").attr("disabled",!0)},this._getSubmenuBusyStateDescription("enable or disable submenu"),0),i.attr("aria-labelledby",t.attr("id"))},_initMenuItems:function(e){e.addClass("oj-menu-item").attr("role","presentation")},_initAnchors:function(t){for(var i=0;i<t.length;i++){var n=e(t[i]);n.uniqueId().attr({tabIndex:"-1",role:this._itemRole(n.parent())})}},_initDividers:function(e){e.addClass("oj-menu-divider").attr("role","separator")},_initDividerNeighbors:function(e,t){e.removeClass("oj-menu-item-before-divider oj-menu-item-after-divider"),t.prev().addClass("oj-menu-item-before-divider"),t.next().addClass("oj-menu-item-after-divider")},_clearOption:function(e){e.removeClass("oj-menu-item-before-divider oj-menu-item-after-divider oj-menu-divider oj-menu-item").removeAttr("role")},_getSubmenuAnchor:function(e){return e.prev("a")},_getSubmenuWidget:function(e){return l.__GetWidgetConstructor(e,"ojMenu")("instance")},_itemRole:function(e){return"OJ-MENU-SELECT-MANY"===e.parent().prop("nodeName")?"menuitemcheckbox":"menuitem"},_getAdjacentDividers:function(e,t){var i=e.prev(".oj-menu-divider").add(e.next(".oj-menu-divider"));return t&&(i=i.add(e)),i},_focus:function(t,i){var n=this.active?this.active:e();if(!i.is(n)){t&&"focus"===t.type||this._clearTimer&&this._clearTimer(),i=i.first(),this._makeActive(i,t);var s=i.parents(".oj-menu").first(),o=s.closest(".oj-menu-item");s.find(".oj-focus-ancestor").removeClass("oj-focus-ancestor"),this._getAdjacentDividers(o,!0).addClass("oj-focus-ancestor"),t&&"keydown"===t.type?this._close():this._clearTimer=this._setTimer(function(){return delete this._clearTimer,this._close()},this._getSubmenuBusyStateDescription("closing"),this.delay);var r=this._IsCustomElement()?i.children("oj-menu"):i.children(".oj-menu"),a=r.length>0&&n.length>0&&e.contains(r[0],n[0]);r.length&&t&&/^mouse|click/.test(t.type)&&!a&&this._startOpening(t,r),this.activeMenu=i.parents(".oj-menu").first()}},_makeActive:function(t,i){if(!t.is(this.active)){var n,s,o,r,a=this.active?this.active:e(),l=t.children("a");this.active=t,this.element.attr("aria-activedescendant",l.attr("id")),this._focusOutHandler(a),this._focusInHandler(t),this._getAdjacentDividers(a).removeClass("oj-focus"),this._getAdjacentDividers(t).addClass("oj-focus"),this._trigger("_activeItem",i,{previousItem:a,item:t,privateNotice:"The _activeItem event is private.  Do not use."}),i&&/^key/.test(i.type)&&(n=l[0],s=n.closest("[role=menu]"),o=n.getBoundingClientRect(),r=s.getBoundingClientRect(),o.top<0||o.bottom>document.documentElement.clientHeight||r.top>o.top||r.bottom<o.bottom||o.left<0||o.right>document.documentElement.clientWidth)&&l[0].scrollIntoView()}},_removeActive:function(t){if(this.active){var i=this.active;this.active=null,this.element.removeAttr("aria-activedescendant"),this._focusOutHandler(i),this._getAdjacentDividers(i).removeClass("oj-focus"),this._trigger("_activeItem",t,{previousItem:i,item:e(),privateNotice:"The _activeItem event is private.  Do not use."})}},_blur:function(e){this._clearTimer&&this._clearTimer(),this._removeActive(e)},_focusLauncherAndDismiss:function(e,t){this._launcher&&this._launcher.focus(),this.__dismiss(e,t)},close:function(){this.__dismiss()},__dismiss:function(e,t){if(!this._isOperationPending("close","__dismiss",[e,t])&&s.ZOrderUtils.getStatus(this.element)===s.ZOrderUtils.STATUS.OPEN){var i=this.element.is(":visible");this._setWhenReady("close");var n={};n[s.PopupService.OPTION.POPUP]=this.element,n[s.PopupService.OPTION.CONTEXT]={event:e,selectUi:t,isOpen:i},s.PopupService.getInstance().close(n)}},_getDefaultAnimation:function(e,t){var i=f,n=a.getCachedCSSVarValues([i[e][t]])[0];return JSON.parse(n)},_isAnimationDisabled:function(){return!this._IsCustomElement()||this._disableAnimation},_replaceAnimationOptions:function(e,t){var i=e;if(t&&e&&"string"!=typeof e){for(var n=JSON.stringify(e),s=Object.keys(t),o=0;o<s.length;o++){var r=s[o];n=n.replace(new RegExp(r,"g"),t[r])}i=JSON.parse(n)}return i},_runOnPromise:function(e,t){return e?e.then(t):t()},_beforeCloseHandler:function(e){var t=e[s.PopupService.OPTION.POPUP];if(this._IsCustomElement()){var i=e[s.PopupService.OPTION.CONTEXT],n=i.selectUi;if(n&&n.item.length){var o={},r=n.item[0],a=i.event;o.originalEvent=a.originalEvent;var l={detail:o,cancelable:!0,bubbles:!0},c=new CustomEvent("ojAction",l);r.dispatchEvent(c),l.detail.selectedValue=r.value;var h=new CustomEvent("ojMenuAction",l);this.element[0].dispatchEvent(h),i.event=h}}if(!this._isAnimationDisabled()){var m=this._getDefaultAnimation(this._sheetMenuIsOpen?"sheet":"dropdown","close"),d=u.startAnimation(t[0],"close",s.PositionUtils.addTransformOriginAnimationEffectsOption(t,m),this);return d.then(function(){t.attr("aria-hidden","true").hide()}),d}t.attr("aria-hidden","true").hide()},_afterCloseHandler:function(e){var i=e[s.PopupService.OPTION.CONTEXT],n=i.event,o=i.selectUi,r=i.isOpen;(this.element.removeData(p),this._launcher=null,this._sheetMenuIsOpen=!1,!this._IsCustomElement()&&o)&&(n=this._trigger2("select",n,o).event);r&&this._trigger("close",n,{}),this._currentOpenOptions=null;var a=t.indexOf(this);t.splice(a,1),this._destroyVoiceOverAssist()},getCurrentOpenOptions:function(){return e.extend(!0,{},this._currentOpenOptions||this.options.openOptions)},_closeMenuIfOpen:function(e,t,i){s.ZOrderUtils.getStatus(this.element)===s.ZOrderUtils.STATUS.OPEN&&(this._disableAnimation=!0,this._currentOpenOptions=e,this.__dismiss(t.event),this._dismissEvent=null,this._currentOpenOptions=i)},open:function(i,n){var o=arguments[2];if(!this._isOperationPending("open","open",[i,n,o])){var l=function(i,n){this._IsCustomElement()&&this.refresh(),this.element.removeAttr("aria-activedescendant"),this.element.find(".oj-focus").removeClass("oj-focus"),this.focusHandled=!1,this._focusIsFromPointer=!1,this.mouseHandled=!1,this.activeMenu=this.element,this.active=null,(n=e.extend({},this.options.openOptions,n)).position=e.extend({},n.position),i&&"keydown"===i.type&&121===i.which&&(n.initialFocus="firstItem"),this._IsCustomElement()&&this._setPosition(n.position),o=e.extend({},this.options.submenuOpenOptions,o);var r=this._currentOpenOptions;this._currentOpenOptions=n,s.PositionUtils._normalizeEventForPosition(i),this._isContextMenu=this.element[0].slot&&"contextMenu"===this.element[0].slot;var l=this._trigger2("beforeOpen",i,{openOptions:n});if(!l.proceed)return this._currentOpenOptions=r,void(this._disableAnimation=!1);this._closeMenuIfOpen(r,l,n);var u=n.launcher;if(!(u=this._IsCustomElement()?"string"===e.type(u)?e(document.getElementById(u)):e(u):"string"===e.type(u)?e(u):u)||!u.length)return c.warn("When calling Menu.open(), must specify openOptions.launcher via the component option, method param, or beforeOpen listener.  Ignoring the call."),this._currentOpenOptions=null,void(this._disableAnimation=!1);var h,m,d=this._isDropDown(n.display);if(this._toggleCancelDom(d),d){this.element.addClass("oj-menu-dropdown").removeClass("oj-menu-sheet"),m=b;var f=s.PositionUtils.normalizeHorizontalAlignment(n.position,this.isRtl);if(!f.of&&f.offset&&0===f.offset.x&&0===f.offset.y){const e=a.getCachedCSSVarValues(["--oj-private-core-global-dropdown-offset"])[0]||0;f.offset={x:0,y:e}}this._IsCustomElement()?(f=s.PositionUtils.coerceToJet(f,this.options.openOptions.position),this._referenceOpenPosition=f,h=s.PositionUtils.coerceToJqUi(f)):(this._referenceOpenPosition=f,h=f),h.of=s.PositionUtils.normalizePositionOf(h.of,u,i)}else this.element.addClass("oj-menu-sheet").removeClass("oj-menu-dropdown"),m=j,h={my:"bottom",at:O,of:window,collision:"flipfit"};var _=this.element[0],v=t.slice(0,t.length);e.each(v,function(e,t){t.element[0]!==_&&(t._collapse(i,"eventSubtree"),t.__dismiss(i))}),this._submenuPosition=s.PositionUtils.normalizeHorizontalAlignment(o.position,this.isRtl);var g=this._usingCallback;e.isFunction(h.using)&&(h.origUsing=h.using),h.using=g,this.element.data(p,h),this._setWhenReady("open");var S={};S[s.PopupService.OPTION.POPUP]=this.element,S[s.PopupService.OPTION.LAUNCHER]=u,S[s.PopupService.OPTION.POSITION]=h,S[s.PopupService.OPTION.EVENTS]=this._getPopupServiceEvents(),S[s.PopupService.OPTION.LAYER_SELECTORS]="oj-menu-layer",S[s.PopupService.OPTION.MODALITY]=m,S[s.PopupService.OPTION.CONTEXT]={event:i,initialFocus:n.initialFocus,launcher:u,isDropDown:d},S[s.PopupService.OPTION.CUSTOM_ELEMENT]=this._IsCustomElement();var y=s.PopupService.getInstance(),E=y.open.bind(y,S),C=this.element[0].querySelector("oj-defer");C?s.Context.getContext(C).getBusyContext().whenReady().then(E):E();this._disableAnimation=!1}.bind(this,i,n);if(this._dismissEvent){var u=r.getContext(this.element[0]).getBusyContext();u.whenReady().then(l)}else l()}},_setPosition:function(e){var t=this.options;t.openOptions.position=s.PositionUtils.coerceToJet(e,t.openOptions.position)},_beforeOpenHandler:function(e){var t,i=e[s.PopupService.OPTION.POPUP],n=e[s.PopupService.OPTION.POSITION],o=e[s.PopupService.OPTION.CONTEXT],r=o.event,a=o.isDropDown,l=o.initialFocus;if(i[0].style.maxHeight="",i[0].style.overflowY="",i.show(),a&&(n=this._checkBrowserVerticalScollBar(o,n)),this.rootHeight=i[0].offsetHeight,"click"===n.of.type?this.launcherHeight=n.of.clientY:this.launcherHeight=o.launcher[0].getBoundingClientRect().bottom,this._updateMenuMaxHeight(),i.position(n),this._initVoiceOverAssist(l),"firstItem"===l){var c=this._getFirstItem();this._focus(r,c)}if(!this._isAnimationDisabled()){var h=this._getDefaultAnimation(a?"dropdown":"sheet","open");t=u.startAnimation(i[0],"open",s.PositionUtils.addTransformOriginAnimationEffectsOption(i,h),this)}return t},_checkBrowserVerticalScollBar:function(t,i){var n=t.launcher,o=e.position.scrollbarWidth(),r=window.innerWidth>document.documentElement.clientWidth,a=window.innerWidth-n[0].offsetLeft-this.element[0].offsetWidth<o;if(!r||!a)return i;if(this._referenceOpenPosition.offset.x=-1*o,this._IsCustomElement()){var l=s.PositionUtils.coerceToJqUi(this._referenceOpenPosition);return Object.assign(i,{my:l.my})}return Object.assign(i,{offset:{my:-1*o}})},_updateMenuMaxHeight:function(e){var t=e?e[0]:this.element[0],i=this._isDropDown(this.options.openOptions.display);if(!(t.querySelectorAll("oj-menu").length||!i||this.rootHeight<window.innerHeight)){var n=window.innerHeight-this.launcherHeight-25;n<25&&(n=25),t.style.maxHeight=n+"px",t.style.overflowY="auto"}},_afterOpenHandler:function(e){var i,n=e[s.PopupService.OPTION.CONTEXT],o=n.event,r=n.launcher,a=n.isDropDown,l=n.initialFocus;(this._launcher=r,this._sheetMenuIsOpen=!a,t.push(this),"firstItem"===l||"menu"===l)&&(i=this._focusSkipLink&&"menu"===l?this._focusSkipLink.getLink():this.element,this._IsCustomElement()?window.setImmediate(function(){i.focus()}):i.focus());this._trigger("open",o,{})},_initVoiceOverAssist:function(e){if("menu"===e&&(s.AgentUtils.getAgentInfo().os===s.AgentUtils.OS.IOS||s.AgentUtils.getAgentInfo().os===s.AgentUtils.OS.ANDROID)){var t=this._getFirstItem();if(!(t.length<1)){var n=this.element.attr("id");s.StringUtils.isEmptyOrUndefined(n)&&(n=this.uuid);var o=[n,"focusSkipLink"].join("_"),r=function(){window.setImmediate(function(e,t){t.find("a").first().focus(),e._focus(null,t)}.bind(this,this,t))}.bind(this),a=this.options.translations.ariaFocusSkipLink;this._focusSkipLink=new i.PopupSkipLink(t,a,r,o,{insertBefore:!0,preventKeyEvents:!1})}}},_destroyVoiceOverAssist:function(){this._focusSkipLink&&(this._focusSkipLink.destroy(),delete this._focusSkipLink)},_getFirstItem:function(){return this.element.find(".oj-menu-item").first()},_startOpening:function(e,t){this._clearTimer&&this._clearTimer(),this._IsCustomElement()&&t[0].refresh(),this._clearTimer=this._setTimer(function(){return delete this._clearTimer,this._close().then(function(){this._open(e,t)}.bind(this))},this._getSubmenuBusyStateDescription("closing and opening"),this.delay)},_open:function(t,i){if("true"===i.attr("aria-hidden")&&this.active){var n;if(this._IsCustomElement()){var o=this._getSubmenuWidget(i);if(!o._trigger2("beforeOpen",t).proceed)return;let e=Object.assign(o.options.openOptions.position,{offset:{x:0,y:y}});n=s.PositionUtils.coerceToJqUi(e),n=s.PositionUtils.normalizeHorizontalAlignment(n,this.isRtl)}else n=this._submenuPosition;if(n=e.extend({of:this.active},n),this._clearTimer&&this._clearTimer(),this.element.find(".oj-menu").not(i.parents(".oj-menu")).hide().attr("aria-hidden","true").removeData(p),i.show().removeAttr("aria-hidden").position(n).data(p,n),this._getSubmenuAnchor(i).attr("aria-expanded","true"),!this._isAnimationDisabled()){var a=r.getContext(this.element[0]).getBusyContext().addBusyState({description:this._getSubmenuBusyStateDescription("opening")}),l=this._getDefaultAnimation("submenu","open"),c=n.my.slice();!this.isRtl&&parseFloat(i[0].style.left)<0?c="right top":this.isRtl&&parseFloat(i[0].style.left)>0&&(c="left top"),l=this._replaceAnimationOptions(l,{"#myPosition":c}),u.startAnimation(i[0],"open",l,this).then(a)}this._updateMenuMaxHeight(i)}},__collapseAll:function(t,i,n){var s;this._clearTimer&&this._clearTimer();var o=this,a=function(){delete o._clearTimer;var n=i?o.element:e(t&&t.target).closest(o.element.find(".oj-menu"));n.length||(n=o.element);var s=o._close(n);return s=o._runOnPromise(s,function(){o._blur(t),o.activeMenu=n})};if(n?this._isAnimationDisabled()?o._clearTimer=o._setTimer(a,o._getSubmenuBusyStateDescription("closing"),n):s=new Promise(function(e){o._clearTimer=o._setTimer(a,o._getSubmenuBusyStateDescription("closing"),n,function(){e(!0)})}):s=a(),s){var l=r.getContext(this.element[0]).getBusyContext().addBusyState({description:"closing submenus"});s.then(l)}return s},_close:function(t){var i;t||(t=this.active?this.active.parents(".oj-menu").first():this.element);var n=this,s=n._getDefaultAnimation("submenu","close"),o=t.find(".oj-menu"),r=function(e){e.hide().attr("aria-hidden","true").removeData(p),n._getSubmenuAnchor(e).attr("aria-expanded","false")};if(this._isAnimationDisabled())r(o),t.find(".oj-focus-ancestor").removeClass("oj-focus-ancestor"),i=Promise.resolve(!0);else{var a=function(t){var i=null;return e(E(t)).children(".oj-menu").each(function(t,o){var l=e(o);if(l.is(":visible")){var c=a(l);i=n._runOnPromise(c,function(){var e=l.data(p),t=n._replaceAnimationOptions(s,{"#myPosition":e.my});return u.startAnimation(o,"close",t,n).then(function(){r(l)})})}else r(l),i=Promise.resolve(!0)}),i};i=a(t),i=this._runOnPromise(i,function(){t.find(".oj-focus-ancestor").removeClass("oj-focus-ancestor")})}return i},_collapse:function(e,t){var i;if(null==t||"active"===t){var n=this.activeMenu&&this.activeMenu.closest(".oj-menu-item",this.element);if(n&&n.length){var s=this;i=this._close(),i=this._runOnPromise(i,function(){s._focus(e,n)})}}else"all"===t||"eventSubtree"===t?i=this.__collapseAll(e,"all"===t,this.delay):c.warn("Invalid param "+t+" passed to Menu._collapse().  Ignoring the call.");return i},_expand:function(t){var i,n;if(this.active){var s=E(n=this.active.children(".oj-menu ").first());s.length>0&&(i=e(s[0]))}i&&i.length&&(this._open(t,n),this._clearTimer&&this._clearTimer(),this._clearTimer=this._setTimer(function(){delete this._clearTimer,this._focus(t,i)},this._getBusyStateDescription("focusing an item")))},_next:function(e){this._move("next","first",e)},_previous:function(e){this._move("prev","last",e)},_move:function(t,i,n){var s,o=E(this.activeMenu),r=o.indexOf(this.active?this.active[0]:null);r>-1?"first"===t?s=o[0]:"last"===t?s=o[o.length-1]:"next"===t?s=r+1<o.length?o[r+1]:o[0]:"prev"===t&&(s=r-1>-1?o[r-1]:o[o.length-1]):s="first"===i?o[0]:o[o.length-1],this._focus(n,e(s))},_select:function(t){if(!this.active&&t&&t.target){var i=e(t.target).closest(".oj-menu-item");i.closest(this.element).length&&this._makeActive(i,t)}var n=this.active.is(this._cancelItem)?void 0:{item:this.active},s=this.__collapseAll(t,!0);this._runOnPromise(s,function(){this._focusLauncherAndDismiss(t,n)}.bind(this))},_surrogateRemoveHandler:function(){var e=this.element;s.ZOrderUtils.getStatus(e)===s.ZOrderUtils.STATUS.OPEN&&e.remove()},_getPopupServiceEvents:function(){if(!this._popupServiceEvents){var e={};this._popupServiceEvents=e,e[s.PopupService.EVENT.POPUP_CLOSE]=this._closeAll.bind(this),e[s.PopupService.EVENT.POPUP_REMOVE]=this._surrogateRemoveHandler.bind(this),e[s.PopupService.EVENT.POPUP_REFRESH]=this._reposition.bind(this),e[s.PopupService.EVENT.POPUP_AUTODISMISS]=this._clickAwayHandler.bind(this),e[s.PopupService.EVENT.POPUP_BEFORE_OPEN]=this._beforeOpenHandler.bind(this),e[s.PopupService.EVENT.POPUP_AFTER_OPEN]=this._afterOpenHandler.bind(this),e[s.PopupService.EVENT.POPUP_BEFORE_CLOSE]=this._beforeCloseHandler.bind(this),e[s.PopupService.EVENT.POPUP_AFTER_CLOSE]=this._afterCloseHandler.bind(this)}return this._popupServiceEvents},_closeAll:function(){this._disableAnimation=!0,this._close(this.element),this.__dismiss(null),this._setWhenReady("none")},_usingHandler:function(e,t){var i=t.element.element;i.css(e),s.PositionUtils.captureTransformOriginAnimationEffectsOption(i,t);var n=i.data(p).origUsing;n&&n(e,t),s.PositionUtils.isAligningPositionClipped(t)&&(this._clearCloseDelayTimer=this._setTimer(this._closeAll,this._getSubmenuBusyStateDescription("closing"),1))},getNodeBySubId:function(e){return e&&"oj-menu-cancel-command"===e.subId?this._cancelDomAttached?this._cancelItem[0]:null:this._super(e)},getSubIdByNode:function(t){return this._cancelItem&&this._cancelItem.is(e(t).parents().addBack(t))?{subId:"oj-menu-cancel-command"}:this._super(t)},_isDropDown:function(e){if(this._hasSubmenus)return!0;switch(e){case"dropDown":return!0;case"sheet":return!1;default:return"phone"!==h.getDeviceRenderMode()}},_toggleCancelDom:function(t){function i(t,i){var n=E(t),s=n.indexOf(i[1]);return e(n[s-1])}if(v)if(t)this._cancelDomAttached&&(i(this.element,this._getCancelDom()).removeClass("oj-menu-item-before-divider"),this._getCancelDom().detach(),this._cancelDomAttached=!1);else{var n=this._getCancelDom();n.appendTo(this.element),i(this.element,n).addClass("oj-menu-item-before-divider"),this._cancelDomAttached=!0}},_getCancelDom:function(){if(!this._cancelDom){var t=e("<li></li>",this.document[0]),i=e("<a href='#'></a>",this.document[0]).text(this.options.translations.labelCancel);e("<span class='oj-menu-item-icon oj-component-icon oj-menu-cancel-icon'></span>",this.document[0]).prependTo(i);var n=e("<li></li>",this.document[0]).addClass("oj-menu-item-cancel oj-menu-item-after-divider").append(i);this._initDividers(t),this._initAnchors(i),this._initMenuItems(n),this._cancelAnchor=i,this._cancelItem=n,this._cancelDom=e([t[0],n[0]])}return this._cancelDom},_setupSwipeBehavior:function(){g&&(this.element.ojHammer(S),this._on({swipedown:function(e){this._sheetMenuIsOpen&&"touch"===e.gesture.pointerType&&(this.__collapseAll(e,!0),this._focusLauncherAndDismiss(e))}}))},_setWhenReady:function(e){var t=this._whenReadyMediator;t&&(t.destroy(),delete this._whenReadyMediator),["open","close"].indexOf(e)<0||(this._whenReadyMediator=new i.PopupWhenReadyMediator(this.element,e,"ojMenu",this._IsCustomElement()))},_isOperationPending:function(e,t,i){var n=this._whenReadyMediator;return!!n&&n.isOperationPending(this,e,t,i)},_setTimer:function(e,t,i,n){var s=r.getContext(this.element[0]).getBusyContext().addBusyState({description:t}),o=function(){s&&(s(),s=null,n&&n())},a=this,l=setTimeout(function(){var t=e.bind(a)();t&&t instanceof Promise?t.then(o):o()},i||0);return function(){clearTimeout(l),o()}},_getBusyStateDescription:function(e){return"Menu with id '"+this.element.attr("id")+"' is busy "+e+"."},_getSubmenuBusyStateDescription:function(e){return this._getBusyStateDescription(e+" a submenu")},_NotifyDetached:function(){s.ZOrderUtils.getStatus(this.element)===s.ZOrderUtils.STATUS.OPEN&&this._closeAll(),this._super()}}),l.setDefaultOptions({ojMenu:{openOptions:l.createDynamicPropertyGetter(function(e){return{position:d.isElementRegistered(e.element.tagName)?e.containers.indexOf("ojMenu")>=0?{my:{horizontal:"start",vertical:"top"},at:{horizontal:"end",vertical:"top"},offset:{x:0,y:0},collision:"flipfit"}:{my:{horizontal:"start",vertical:"top"},at:{horizontal:"start",vertical:"bottom"},offset:{x:0,y:0},collision:"flipfit"}:{my:"start top",at:"start bottom",collision:"flipfit"}}})}})}(),(p={properties:{disabled:{type:"boolean",value:!1},openOptions:{type:"object",properties:{display:{type:"string",enumValues:["auto","dropDown","sheet"],value:"auto"},initialFocus:{type:"string",enumValues:["firstItem","menu","none"],value:"menu"},launcher:{type:"string|Element"},position:{type:"object",properties:{at:{type:"object",properties:{horizontal:{type:"string",enumValues:["center","end","left","right","start"]},vertical:{type:"string",enumValues:["bottom","center","top"]}}},collision:{type:"string",enumValues:["fit","flip","flipcenter","flipfit","none"],value:"flipfit"},my:{type:"object",properties:{horizontal:{type:"string",enumValues:["center","end","left","right","start"],value:"start"},vertical:{type:"string",enumValues:["bottom","center","top"],value:"top"}}},of:{type:"string|object"},offset:{type:"object",properties:{x:{type:"number",value:0},y:{type:"number",value:0}}}}}}},translations:{type:"object",value:{},properties:{ariaFocusSkipLink:{type:"string"},labelCancel:{type:"string"}}}},methods:{close:{},getProperty:{},open:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},events:{ojAction:{},ojAnimateEnd:{},ojAnimateStart:{},ojBeforeOpen:{},ojClose:{},ojMenuAction:{},ojOpen:{}},extension:{}}).extension._WIDGET_NAME="ojMenu",s.CustomElementBridge.register("oj-menu",{metadata:p})});
//# sourceMappingURL=ojmenu.js.map