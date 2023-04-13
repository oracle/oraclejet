/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","jquery","knockout","ojs/ojanimation","ojs/ojcontext","ojs/ojthemeutils","ojs/ojtranslation","ojs/ojcomposite","ojs/ojcomponentcore","ojs/ojlogger","ojs/ojdomutils","ojs/ojknockout","ojs/ojpopupcore","ojs/ojmessage","ojs/ojdataprovider","ojs/ojcustomelement-utils"],function(e,t,i,s,n,o,a,r,l,p,d,c,h,u,g,m){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;function _(t){this._composite=t.element,this.containerId=[t.unique,"mc"].join("_"),this._messagesContainerId=this.containerId,this.handleOpen=this._handleOpen.bind(this),this.handleClose=this._handleClose.bind(this),this.handleAnimateStart=this._handleAnimateStart.bind(this),this.bindingsApplied=this._bindingsApplied.bind(this),this.disconnected=this._disconnected.bind(this),this.connected=this._connected.bind(this),this.close=this._close.bind(this),this.closeAll=this._closeAll.bind(this),this.propertyChanged=this._propertyChanged.bind(this),this._properties=t.properties,this._createObservables(),this._updateLandmark(),e.AgentUtils.getAgentInfo().os===e.AgentUtils.OS.IOS&&(this._composite.style.overflow="hidden")}function v(e){this.Init(e)}_.prototype._bindingsApplied=function(){var e=this._composite.querySelector("#"+this._messagesContainerId);if(e.addEventListener("ojFocus",this._navigationEventListener.bind(this),!1),this._properties.messages)e.addEventListener("ojBeforeOpen",this._handleBeforeOpen.bind(this),!1);else{var t=this._getDefaultSlotMessageElements();if(0!==t.length){var i=n.getContext(this._composite).getBusyContext();this._inlinedMessagesOpenBusyStateResolve=i.addBusyState({description:"oj-messages is busy opening inlined messages"}),this._showMessagesContainer();for(var s=0;s<t.length;s++)this._animateMessageAction(t[s].firstChild,"open",this._resolveInlinedMessagesOpenBusyState(t[s].getProperty("message"),t.length))}}},_.prototype._resolveInlinedMessagesOpenBusyState=function(e,t){this._updateLiveRegionAndContainer(e),this._numInlinedChildrenAnimated=this._numInlinedChildrenAnimated?this._numInlinedChildrenAnimated+1:1,this._numInlinedChildrenAnimated===t&&(this._numInlinedChildrenAnimated=0,this._inlinedMessagesOpenBusyStateResolve())},_.prototype._disconnected=function(){_.NAVIGATION_TRACKER.remove(this._messagesContainerId),e.ZOrderUtils.getStatus(this._composite)===e.ZOrderUtils.STATUS.OPEN&&this._closeOverlay()},_.prototype._connected=function(){_.NAVIGATION_TRACKER.add(this._messagesContainerId)},_.prototype._closeAll=function(e){if(this._isMessagesShown())for(var t=this._getDefaultSlotMessageElements(),i=0;i<t.length;i++){var s=t[i].message,n=!0;e&&(n=e(s)),n&&t[i].close()}},_.prototype._propertyChanged=function(e){"external"===e.updatedFrom&&"position"===e.property?e.previousValue&&e.value?this._refresh():!e.previousValue&&e.value?this._getDefaultSlotMessageElements().length>0&&(this._isMessagesShown()&&this._hideMessages(),this._openOverlay()):e.previousValue&&!e.value&&this._getDefaultSlotMessageElements().length>0&&(this._isOverlayOpen()&&this._closeOverlay(),this._showMessages()):"external"===e.updatedFrom&&"display"===e.property?this._getDefaultSlotMessageElements().length>0&&(this._isOverlayOpen()?(this._closeOverlay(),this._openOverlay(),this._refresh()):this._isMessagesShown()&&(this._hideMessages(),this._showMessages())):"external"===e.updatedFrom&&"translations"===e.property&&this._updateLandmark()},_.prototype._close=function(e){if(e&&this._isMessagesShown())for(var i=this._getDefaultSlotMessageElements(),s=0;s<i.length;s++){t(i[s]).prop("message")===e&&i[s].close()}},_.prototype._isEventPertaining=function(e){var t=e.target,i=document.getElementById(this._messagesContainerId);return!("OJ-MESSAGE"!==t.nodeName||!d.isAncestor(i,t))},_.prototype._handleBeforeOpen=function(e){e.defaultPrevented||!this._isEventPertaining(e)||this._isMessagesShown()||this._showMessagesContainer()},_.prototype._showMessagesContainer=function(){this._isPresentationInline()?this._showMessages():this._openOverlay()},_.prototype._handleOpen=function(e){!e.defaultPrevented&&this._isEventPertaining(e)&&this._updateLiveRegionAndContainer(e.detail.message)},_.prototype._updateLiveRegionAndContainer=function(e){const t=a.getComponentTranslations("oj-ojMessage").categories,i=("fatal"===e.severity?"error":e.severity)||"none",s={category:e.category?e.category:t[i],summary:e.summary,detail:e.detail||this._getTranslationsDefault("ariaLiveRegion.noDetail")},n=this._getLiveRegion(),o=this._getTranslationsDefault("ariaLiveRegion.newMessage",s);n.announce(o),this._refresh()},_.prototype._getTranslationsDefault=function(t,i){for(var s=this._properties.translations,n=t.split("."),o=0;o<n.length&&s;o++)s=s[n[o]];return e.StringUtils.isEmptyOrUndefined(s)?s=a.getTranslatedString(["oj-ojMessages",t].join("."),i):i&&(s=a.applyParameters(s,i)),s},_.prototype._handleClose=function(e){if(!e.defaultPrevented&&this._isEventPertaining(e)){var i,s=e.target;e._originalEvent&&(i=this._getNextFocus(s)),i&&i.focus(),t(s).remove(),0===this._getDefaultSlotMessageElements().length?(_.NAVIGATION_TRACKER.togglePreviousFocus(this._messagesContainerId),this._isOverlayOpen()?this._closeOverlay():this._hideMessages()):this._refresh()}},_.prototype._getNextFocus=function(e){var t,i,s=this._getDefaultSlotMessageElements(),n=s.indexOf(e);return n-1>-1?t=s[n-1]:n+1<=s.length-1&&(t=s[n+1]),t&&(i=t.querySelector('.oj-message-category[tabindex="-1"]')),i},_.prototype._handleAnimateStart=function(e){!e.defaultPrevented&&this._isEventPertaining(e)&&(e.preventDefault(),this._animateMessageAction(e.detail.element,e.detail.action,e.detail.endCallback))},_.prototype._animateMessageAction=function(e,t,i){var n=this._isPresentationInline()?"general":this._computeDisplay(),o=this._getThemedAnimateOptions(n,t);s[o.effect](e,o).then(i)},_._DEFAULTS={general:{animation:{open:{effect:"expand",duration:"300ms"},close:{effect:"collapse",duration:"300ms"}},position:{my:{horizontal:"center",vertical:"top"},at:{horizontal:"center",vertical:"top"},of:"window",collision:"none"}},notification:{animation:{open:{effect:"slideIn",duration:"300ms"},close:{effect:"slideOut",duration:"300ms",direction:"end"}},position:{my:{horizontal:"end",vertical:"top"},at:{horizontal:"end",vertical:"top"},of:"window",collision:"none"}}},_.prototype._getThemedAnimateOptions=function(e,t){var i=o.parseJSONFromFontFamily("oj-messages-option-defaults");return i&&i[e]&&i[e].animation&&i[e].animation[t]?i[e].animation[t]:_._DEFAULTS[e].animation[t]},_.prototype._computeDisplay=function(){return this._properties.display},_.prototype._isPresentationInline=function(){return!this._properties.position},_.prototype._computeContainerSelectors=function(){var e=this._computeDisplay(),i=t(this._composite);return i.removeClass("oj-messages-general oj-messages-notification oj-messages-inline"),this._isPresentationInline()?i.addClass("oj-messages-inline"):i.addClass(["oj-messages",e].join("-")),"oj-messages-container"},_.prototype._getThemedPosition=function(){var e=this._computeDisplay(),t=o.parseJSONFromFontFamily("oj-messages-option-defaults");return t[e]&&t[e].position?t[e].position:_._DEFAULTS[e].position},_.prototype._getPositionAsJqUi=function(){var t=e.PositionUtils.coerceToJqUi(this._computePosition()),i="rtl"===d.getReadingDirection();return t=e.PositionUtils.normalizeHorizontalAlignment(t,i)},_.prototype._computePosition=function(){var t=this._properties.position;return e.PositionUtils.coerceToJet(t,this._getThemedPosition())},_.prototype._getDefaultSlotMessageElements=function(){for(var e=this._composite.querySelector("#"+this._messagesContainerId),t=[],i=m.CustomElementUtils.getSlotMap(e)[""],s=0;i&&s<i.length;s++)"OJ-MESSAGE"!==i[s].nodeName?"OJ-BIND-IF"!==i[s].nodeName&&p.error(`JET oj-messages: can contain only oj-message children in its default slot. Found <${i[s].nodeName}> instead.`):t.push(i[s]);return t},_.prototype._isMessagesShown=function(){return t(this._composite).is(":visible")},_.prototype._showMessages=function(){this._isMessagesShown()||(t(this._composite).show(),l.subtreeShown(t(this._composite))),_.NAVIGATION_TRACKER.add(this._messagesContainerId),this._announceNavigation()},_.prototype._hideMessages=function(){this._isMessagesShown()&&(t(this._composite).hide(),l.subtreeHidden(this._composite),_.NAVIGATION_TRACKER.remove(this._messagesContainerId),this._liveRegion&&(this._liveRegion.destroy(),delete this._liveRegion))},_.prototype._openOverlay=function(){var i=t(this._composite),s={};s[e.PopupService.OPTION.POPUP]=i,s[e.PopupService.OPTION.LAUNCHER]=this._getLauncher(),s[e.PopupService.OPTION.POSITION]=this._getPositionAsJqUi(),s[e.PopupService.OPTION.EVENTS]=this._getPopupServiceEvents(),s[e.PopupService.OPTION.LAYER_SELECTORS]=["oj","messages","layer"].join("-"),s[e.PopupService.OPTION.MODALITY]=e.PopupService.MODALITY.MODELESS,s[e.PopupService.OPTION.CUSTOM_ELEMENT]=!0,e.PopupService.getInstance().open(s),this._showMessages(),this._overlayEventsCallback=_._overlayEventsListener.bind(this,i),i[0].addEventListener("keydown",this._overlayEventsCallback,!1)},_.prototype._getLauncher=function(){var e=this._composite.parentElement;return this._composite.previousElementSibling?e=this._composite.previousElementSibling:this._composite.nextElementSibling&&(e=this._composite.nextElementSibling),t(e)},_.prototype._closeOverlay=function(){this._hideMessages();var i=t(this._composite),s={};s[e.PopupService.OPTION.POPUP]=i,e.PopupService.getInstance().close(s);var n=this._overlayEventsCallback;delete this._overlayEventsCallback,i[0].removeEventListener("keydown",n,!1)},_.prototype._isOverlayOpen=function(){var t=this._composite,i=e.ZOrderUtils.getStatus(t);return i===e.ZOrderUtils.STATUS.OPENING||i===e.ZOrderUtils.STATUS.OPEN||i===e.ZOrderUtils.STATUS.CLOSING},_._overlayEventsListener=function(e,i){if(!i.defaultPrevented&&(i.keyCode===t.ui.keyCode.TAB||"Tab"===i.key)){var s=i.target,n=e.find(":tabbable");if(n.length>0){var o=n[0],a=n[n.length-1];o===a&&s===o?i.preventDefault():o===s&&i.shiftKey?(i.preventDefault(),a.focus()):a!==s||i.shiftKey||(i.preventDefault(),o.focus())}else i.preventDefault()}},_.prototype._navigationEventListener=function(e){e.target.id===this._messagesContainerId&&(e.preventDefault(),this._announceNavigation(!0))},_.prototype._announceNavigation=function(t){var i,s=e.AgentUtils.getAgentInfo().os===e.AgentUtils.OS.IOS||e.AgentUtils.getAgentInfo().os===e.AgentUtils.OS.ANDROID;if(i=t?s?void 0:"ariaLiveRegion.navigationFromKeyboard":s?"ariaLiveRegion.navigationToTouch":"ariaLiveRegion.navigationToKeyboard"){var n=this._getLiveRegion(),o=this._getTranslationsDefault(i);n.announce(o)}},_.prototype._getLiveRegion=function(){var e=this._messagesContainerId;return this._liveRegion||(this._liveRegion=new v(e)),this._liveRegion},_.prototype._getPopupServiceEvents=function(){var t={};return t[e.PopupService.EVENT.POPUP_CLOSE]=this._closeOverlay.bind(this),t[e.PopupService.EVENT.POPUP_REMOVE]=this._surrogateRemoveHandler.bind(this),t[e.PopupService.EVENT.POPUP_REFRESH]=this._refresh.bind(this),t},_.prototype._refresh=function(){if(this._isOverlayOpen()){var e=this._composite.getBoundingClientRect();if(e.height<document.documentElement.clientHeight&&e.width<document.documentElement.clientWidth){var i=this._getPositionAsJqUi();t(this._composite).position(i)}}},_.prototype._surrogateRemoveHandler=function(){this._closeOverlay(),this._composite.parentElement.removeChild(this._composite)},_.prototype._createObservables=function(){this.containerSelectors=i.pureComputed(this._computeContainerSelectors.bind(this),this)},_.prototype._computeLabelLandmark=function(){var t=this._properties;return e.StringUtils.isEmptyOrUndefined(t.translations.labelLandmark)?this._getTranslationsDefault("labelLandmark"):t.translations.labelLandmark},_.prototype._updateLandmark=function(){var e=this._computeLabelLandmark();this._composite.setAttribute("aria-label",e),this._composite.setAttribute("role","complementary")},_.NAVIGATION_TRACKER={_messagesContainerIds:[],_priorFocusCache:{},add:function(e){this.remove(e),this._messagesContainerIds.push(e),this._start(e)},remove:function(e){var t=this._messagesContainerIds,i=t.indexOf(e);i>-1&&t.splice(i,1),this._stop(e)},togglePreviousFocus:function(i){var s=this._priorFocusCache,n=s[i];return!!(n&&t(n).is(":visible")&&e.ZOrderUtils.isAboveTopModalLayer(n))&&(n.focus(),delete s[i],!0)},_addPriorFocusCache:function(e,t){this._priorFocusCache[e]=t},_start:function(e){var i=document.getElementById(e);if(i){var s=this._messageContainerListener.bind(this,e);if(i.addEventListener("focus",s,!0),i.addEventListener("keydown",s,!1),i.addEventListener("click",s,!1),t(i).data("oj_messages_nmtl",s),!this._documentCallback){this._documentCallback=this._documentListener.bind(this);var n=document.documentElement;n.addEventListener("keydown",this._documentCallback,!1),n.addEventListener("blur",this._documentCallback,!0)}}},_stop:function(e){var i=document.getElementById(e);if(i){var s=t(i).data("oj_messages_nmtl");s&&(i.removeEventListener("focus",s,!0),i.removeEventListener("keydown",s,!1),i.removeEventListener("click",s,!1))}if(this._documentCallback&&!(this._messagesContainerIds.length>0)){var n=document.documentElement;n.removeEventListener("keydown",this._documentCallback,!1),n.removeEventListener("blur",this._documentCallback,!0),delete this._documentCallback}},_indexOfFocusWithin:function(e){for(var t=this._messagesContainerIds,i=0;i<t.length;i++){var s=document.getElementById(t[i]);if(s&&d.isAncestorOrSelf(s,e))return i}return-1},_documentListener:function(i){if(!i.defaultPrevented){var s=this._messagesContainerIds;if("keydown"===i.type&&(117===i.keyCode||"F6"===i.key)&&s.length>0){var n=this._indexOfFocusWithin(i.target);if(n>-1)return;for(var o=n=s.length-1;o>-1;o--){var a=document.getElementById(s[o]);if(a&&t(a).is(":visible")&&e.ZOrderUtils.isAboveTopModalLayer(a)){var r=a.querySelector('.oj-message-title[tabindex="-1"]');i.preventDefault(),this._addPriorFocusCache(s[o],i.target),r.focus();var l=new CustomEvent("ojFocus",{bubbles:!1,cancelable:!0});a.dispatchEvent(l);break}}}else"blur"===i.type&&(this._prevActiveElement=i.target)}},_messageContainerListener:function(e,i){if(!i.defaultPrevented)if("focus"===i.type||"click"===i.type){var s=document.getElementById(e),n=this._prevActiveElement;n&&s&&!d.isAncestorOrSelf(s,n)&&this._addPriorFocusCache(e,n)}else"keydown"!==i.type||117!==i.keyCode&&i.keyCode!==t.ui.keyCode.ESCAPE&&"F6"!==i.key&&"Escape"!==i.key||this.togglePreviousFocus(e)&&i.preventDefault()}},v.prototype.Init=function(e){this._id=e},v.prototype.destroy=function(){var e=t(document.getElementById(v._LIVE_REGION_ID)),i=this._id;delete this._id,e.find('div[data-container-id="'+i+'"]').remove(),e.children("div").length<1&&e.remove()},v.prototype.announce=function(e){var i=v._getLiveRegion(),s=this._id;t("<div>").attr("data-container-id",s).text(e).appendTo(i)},v._getLiveRegion=function(){var e=t(document.getElementById(v._LIVE_REGION_ID));return 0===e.length&&((e=t("<div>")).attr({id:v._LIVE_REGION_ID,role:"log","aria-live":"polite","aria-relevant":"additions"}),e.addClass("oj-helper-hidden-accessible"),e.appendTo(document.body)),e},v._LIVE_REGION_ID="__oj_messages_arialiveregion";r.register("oj-messages",{view:'<div role="presentation" :id="[[containerId]]" :class="[[containerSelectors]]"      on-oj-open="[[handleOpen]]" on-oj-close="[[handleClose]]"      on-oj-animate-start="[[handleAnimateStart]]">  <oj-bind-if test="[[!$properties.messages]]">    <oj-bind-slot>    </oj-bind-slot>  </oj-bind-if>  <oj-bind-if test="[[$properties.messages]]">    <oj-bind-for-each data="[[$properties.messages]]" >      <template>        <oj-bind-template-slot name="messageTemplate"           data="[[{data:$current.data, componentElement:_composite}]]">          <template>            <oj-message message="[[$current.data]]" display-options="[[$properties.displayOptions]]">            </oj-message>          </template>        </oj-bind-template-slot>      </template>    </oj-bind-for-each>  </oj-bind-if></div>',viewModel:_,metadata:{properties:{display:{type:"string",enumValues:["general","notification"],value:"general"},displayOptions:{type:"object",properties:{category:{type:"string",enumValues:["auto","header","none"],value:"auto"}}},messages:{type:"Array<Object>|object"},position:{type:"object",properties:{at:{type:"object",properties:{horizontal:{type:"string",enumValues:["center","end","left","right","start"]},vertical:{type:"string",enumValues:["bottom","center","top"]}}},collision:{type:"string",enumValues:["fit","flip","flipfit","none"]},my:{type:"object",properties:{horizontal:{type:"string",enumValues:["center","end","left","right","start"]},vertical:{type:"string",enumValues:["bottom","center","top"]}}},of:{type:"string"},offset:{type:"object",properties:{x:{type:"number"},y:{type:"number"}}}}},translations:{type:"object",value:{},properties:{ariaLiveRegion:{type:"object",properties:{navigationFromKeyboard:{type:"string"},navigationToKeyboard:{type:"string"},navigationToTouch:{type:"string"},newMessage:{type:"string"},noDetail:{type:"string"}}},labelLandmark:{type:"string"}}}},methods:{close:{},closeAll:{},getProperty:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}}})});
//# sourceMappingURL=ojmessages.js.map