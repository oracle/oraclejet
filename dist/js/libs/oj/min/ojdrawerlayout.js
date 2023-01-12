/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","ojs/ojvcomponent","preact","jquery","ojs/ojanimation","ojs/ojdomutils","ojs/ojcore-base","ojs/ojpopup","ojs/ojdrawerutils"],function(e,t,s,r,a,n,o,i,l,d){"use strict";a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a;var h,p=function(e,t,s,r){var a,n=arguments.length,o=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,s,r);else for(var i=e.length-1;i>=0;i--)(a=e[i])&&(o=(n<3?a(o):n>3?a(t,s,o):a(t,s))||o);return n>3&&o&&Object.defineProperty(t,s,o),o},D=function(e,t,s,r){return new(s||(s=Promise))(function(a,n){function o(e){try{l(r.next(e))}catch(e){n(e)}}function i(e){try{l(r.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?a(e.value):(t=e.value,t instanceof s?t:new s(function(e){e(t)})).then(o,i)}l((r=r.apply(e,t||[])).next())})};const w=oj,g=w.PopupService,c=w.ZOrderUtils;e.DrawerLayout=h=class extends r.Component{constructor(){super(...arguments),this.rootRef=r.createRef(),this.startWrapperRef=r.createRef(),this.startRef=r.createRef(),this.endWrapperRef=r.createRef(),this.endRef=r.createRef(),this.bottomWrapperRef=r.createRef(),this.bottomRef=r.createRef(),this.middleSectionRef=r.createRef(),this.mainSectionRef=r.createRef(),this.startClosedWithEsc=!1,this.endClosedWithEsc=!1,this.bottomClosedWithEsc=!1,this.overlayDrawerResizeHandler=null,this.reflowDrawerResizeHandler=null,this.windowResizeHandler=null,this.handleResize=!0,this.state={startOpened:this.props.startOpened,endOpened:this.props.endOpened,bottomOpened:this.props.bottomOpened,startDisplay:this.props.startDisplay,endDisplay:this.props.endDisplay,bottomDisplay:this.props.bottomDisplay,startShouldChangeDisplayMode:!1,endShouldChangeDisplayMode:!1,bottomShouldChangeDisplayMode:!1,startStateToChangeTo:null,endStateToChangeTo:null,bottomStateToChangeTo:null,viewportResolvedDisplayMode:this.getViewportResolvedDisplayMode(),viewportResolvedDisplayModeVertical:this.getViewportResolvedDisplayModeVertical(),lastlyOpenedDrawer:d.DrawerConstants.stringStart},this.handleKeyDown=(e,t)=>{const s=this.getDrawerResolvedDisplayMode(e);t.key!==d.DrawerConstants.keys.ESC||s!==d.DrawerConstants.stringOverlay&&s!==d.DrawerConstants.stringFullOverlay||(this[this.edgeToClosedWithEsc(e)]=!0,this.selfClose(e))},this.getRefToAnimate=e=>this.getDrawerResolvedDisplayMode(e)===d.DrawerConstants.stringReflow?this.getDrawerWrapperRef(e):this.getDrawerRef(e),this.overlayDrawerResizeCallback=e=>{a(this.getDrawerRef(e).current).position(this.getDrawerPosition(e))},this.reflowDrawerResizeCallback=e=>{[d.DrawerConstants.stringStart,d.DrawerConstants.stringEnd].indexOf(e)>-1&&this.setBottomOverlayDrawerWidth()},this.lockResizeListener=()=>{this.handleResize&&(this.handleResize=!1,setTimeout(()=>{this.handleResize=!0;const e={};if(this.state.viewportResolvedDisplayMode!==this.getViewportResolvedDisplayMode()){const e={};[d.DrawerConstants.stringStart,d.DrawerConstants.stringEnd].forEach(t=>{this.isDrawerOpened(t)&&"auto"===this.state[this.edgeToDisplayName(t)]&&(e[this.edgeToShouldChangeDisplayMode(t)]=!0)})}this.state.viewportResolvedDisplayModeVertical!==this.getViewportResolvedDisplayModeVertical()&&this.isDrawerOpened(d.DrawerConstants.stringBottom)&&"auto"===this.state[this.edgeToDisplayName(d.DrawerConstants.stringBottom)]&&(e[this.edgeToShouldChangeDisplayMode(d.DrawerConstants.stringBottom)]=!0),Object.keys(e).length>0&&this.setState(e)},d.DrawerConstants.animationDuration+50))},this.refreshHandler=e=>{const t=a(this.getDrawerRef(e).current);t.position(this.getDrawerPosition(e)),[d.DrawerConstants.stringStart,d.DrawerConstants.stringEnd].indexOf(e)>-1&&this.setStartEndOverlayDrawersHeight(),this.setBottomOverlayDrawerWidth(),g.getInstance().triggerOnDescendents(t,g.EVENT.POPUP_REFRESH)},this.destroyHandler=e=>{const t=a(this.getDrawerRef(e).current);c.getStatus(t)===c.STATUS.OPEN&&c.removeFromAncestorLayer(t)},this.windowResizeCallback=()=>{if(this.handleResize){const e=this.state.viewportResolvedDisplayMode,t=this.getViewportResolvedDisplayMode(),s=this.state.viewportResolvedDisplayModeVertical,r=this.getViewportResolvedDisplayModeVertical();this.setBottomOverlayDrawerWidth();let a=!1;const n={};e===t&&s===r||(this.lockResizeListener(),[d.DrawerConstants.stringStart,d.DrawerConstants.stringEnd].forEach(e=>{this.isDrawerOpened(e)&&"auto"===this.state[this.edgeToDisplayName(e)]&&(a=!0,n[this.edgeToShouldChangeDisplayMode(e)]=!0)}),this.isDrawerOpened(d.DrawerConstants.stringBottom)&&"auto"===this.state[this.edgeToDisplayName(d.DrawerConstants.stringBottom)]&&(a=!0,n[this.edgeToShouldChangeDisplayMode(d.DrawerConstants.stringBottom)]=!0),!1===a&&(n.viewportResolvedDisplayMode=t,n.viewportResolvedDisplayModeVertical=r)),Object.keys(n).length>0&&this.setState(n)}},this.getDrawerPosition=e=>{const t=`${e===d.DrawerConstants.stringBottom?d.DrawerConstants.stringStart:e} ${e===d.DrawerConstants.stringBottom?d.DrawerConstants.stringBottom:d.DrawerConstants.stringTop}`;let s={my:t,at:t,of:this.mainSectionRef.current,collision:"none"};return oj.PositionUtils.normalizeHorizontalAlignment(s,d.DrawerUtils.isRTL())}}static getDerivedStateFromProps(e,t){const s={};return t.startOpened&&e.startDisplay!==t.startDisplay?(s[`${d.DrawerConstants.stringStart}${d.DrawerConstants.stringStateToChangeTo}`]={startDisplay:e.startDisplay},s):t.endOpened&&e.endDisplay!==t.endDisplay?(s[`${d.DrawerConstants.stringEnd}${d.DrawerConstants.stringStateToChangeTo}`]={endDisplay:e.endDisplay},s):t.bottomOpened&&e.bottomDisplay!==t.bottomDisplay?(s[`${d.DrawerConstants.stringBottom}${d.DrawerConstants.stringStateToChangeTo}`]={bottomDisplay:e.bottomDisplay},s):(e.startOpened!==t.startOpened&&(s.startOpened=e.startOpened,e.startOpened&&(s.lastlyOpenedDrawer=d.DrawerConstants.stringStart)),e.endOpened!==t.endOpened&&(s.endOpened=e.endOpened,e.endOpened&&(s.lastlyOpenedDrawer=d.DrawerConstants.stringEnd)),e.bottomOpened!==t.bottomOpened&&(s.bottomOpened=e.bottomOpened,e.bottomOpened&&(s.lastlyOpenedDrawer=d.DrawerConstants.stringBottom)),e.startDisplay!==t.startDisplay&&(s.startDisplay=e.startDisplay),e.endDisplay!==t.endDisplay&&(s.endDisplay=e.endDisplay),e.bottomDisplay!==t.bottomDisplay&&(s.bottomDisplay=e.bottomDisplay),0===Object.keys(s).length?null:s)}render(e){let r=this.getDrawer(d.DrawerConstants.stringStart),a=this.getDrawer(d.DrawerConstants.stringEnd),n=this.getDrawer(d.DrawerConstants.stringBottom);return t.jsxs(s.Root,Object.assign({ref:this.rootRef},{children:[r,t.jsxs("div",Object.assign({ref:this.middleSectionRef,class:d.DrawerConstants.middleSectionSelector},{children:[t.jsx("div",Object.assign({ref:this.mainSectionRef,class:d.DrawerConstants.mainContentSelector},{children:e.children})),n]})),a]}))}getDrawer(e){const s=this.getDrawerResolvedDisplayMode(e),r=s===d.DrawerConstants.stringOverlay||s===d.DrawerConstants.stringFullOverlay,a=this.props.role||(r?"dialog":void 0),n=r?-1:void 0;return this.isDrawerOpened(e)||this.wasDrawerOpenedInPrevState(e)||this.wasDrawerClosedWithEsc(e)?t.jsx("div",Object.assign({ref:this.getDrawerWrapperRef(e),class:this.getDrawerWrapperStyleClasses(e)},{children:t.jsx("div",Object.assign({ref:this.getDrawerRef(e),role:a,tabIndex:n,class:this.getDrawerStyleClasses(e),onKeyDown:t=>this.handleKeyDown(e,t)},{children:this.getDrawerContent(e)}))})):null}isDrawerOpened(e){return this.state[this.edgeToStateOpenedName(e)]}wasDrawerOpenedInPrevState(e){return this[this.edgeToPrevStateOpenedName(e)]}wasDrawerClosedWithEsc(e){return this[this.edgeToClosedWithEsc(e)]}getDrawerWrapperRef(e){switch(e){case d.DrawerConstants.stringStart:return this.startWrapperRef;case d.DrawerConstants.stringEnd:return this.endWrapperRef;case d.DrawerConstants.stringBottom:return this.bottomWrapperRef}}getDrawerRef(e){switch(e){case d.DrawerConstants.stringStart:return this.startRef;case d.DrawerConstants.stringEnd:return this.endRef;case d.DrawerConstants.stringBottom:return this.bottomRef}}getDrawerContent(e){switch(e){case d.DrawerConstants.stringStart:return this.props.start;case d.DrawerConstants.stringEnd:return this.props.end;case d.DrawerConstants.stringBottom:return this.props.bottom}}getDrawerWrapperStyleClasses(e){return`${d.DrawerConstants.stringOjDrawer}${d.DrawerConstants.charDash}${d.DrawerConstants.stringReflow}-wrapper `+this.getDrawerStyleClasses(e)}getDrawerStyleClasses(e){let t;switch(this.getDrawerResolvedDisplayMode(e)){case d.DrawerConstants.stringReflow:t={[d.DrawerConstants.styleDisplayMode(d.DrawerConstants.stringReflow)]:!0};break;case d.DrawerConstants.stringOverlay:t={[d.DrawerConstants.styleDisplayMode(d.DrawerConstants.stringOverlay)]:!0};break;case d.DrawerConstants.stringFullOverlay:t={[d.DrawerConstants.styleDisplayMode(d.DrawerConstants.stringOverlay)]:!0,[d.DrawerConstants.styleDisplayMode(d.DrawerConstants.stringFullOverlay)]:!0}}return d.DrawerUtils.getStyleClassesMapAsString(Object.assign(t,d.DrawerUtils.getCommonStyleClasses(e)))}getDrawerResolvedDisplayMode(e){const t=this.edgeToDisplayName(e);if("auto"===this.state[t])return e===d.DrawerConstants.stringBottom?this.state.viewportResolvedDisplayModeVertical===d.DrawerConstants.stringFullOverlay||this.state.viewportResolvedDisplayMode===d.DrawerConstants.stringFullOverlay?d.DrawerConstants.stringFullOverlay:this.state.viewportResolvedDisplayModeVertical===d.DrawerConstants.stringOverlay||this.state.viewportResolvedDisplayMode===d.DrawerConstants.stringOverlay?d.DrawerConstants.stringOverlay:d.DrawerConstants.stringReflow:this.state.viewportResolvedDisplayMode;if(this.state[t]===d.DrawerConstants.stringReflow)return d.DrawerConstants.stringReflow;if(this.state[t]===d.DrawerConstants.stringOverlay){return(e===d.DrawerConstants.stringBottom?this.state.viewportResolvedDisplayModeVertical:this.state.viewportResolvedDisplayMode)===d.DrawerConstants.stringFullOverlay?d.DrawerConstants.stringFullOverlay:d.DrawerConstants.stringOverlay}}getViewportResolvedDisplayMode(){const e=d.DrawerUtils.getViewportWidth();return e>=d.DrawerConstants.displayTypeChangeThreshold?d.DrawerConstants.stringReflow:e<d.DrawerConstants.displayTypeChangeThreshold&&e>=d.DrawerConstants.fullWidthDrawerChangeThreshold?d.DrawerConstants.stringOverlay:d.DrawerConstants.stringFullOverlay}getViewportResolvedDisplayModeVertical(){return d.DrawerUtils.getViewportHeight()>=d.DrawerConstants.fullHeightDrawerChangeThreshold?d.DrawerConstants.stringReflow:d.DrawerConstants.stringFullOverlay}selfClose(e){var t,s,r,a,n,o,i,l;return D(this,void 0,void 0,function*(){try{yield null===(s=(t=this.props).onOjBeforeClose)||void 0===s?void 0:s.call(t,{edge:e})}catch(e){return}e===d.DrawerConstants.stringStart&&(null===(a=(r=this.props).onStartOpenedChanged)||void 0===a||a.call(r,!1)),e===d.DrawerConstants.stringEnd&&(null===(o=(n=this.props).onEndOpenedChanged)||void 0===o||o.call(n,!1)),e===d.DrawerConstants.stringBottom&&(null===(l=(i=this.props).onBottomOpenedChanged)||void 0===l||l.call(i,!1))})}setDrawerFocus(e){const t=this.getDrawerRef(e),s=t.current.querySelectorAll("[autofocus]"),{length:r,0:a}=s;if(r>0)return void a.focus({preventScroll:!0});const n=d.DrawerUtils.getFocusables(t.current);let o=t.current;n.length&&(o=n[0]),o.focus({preventScroll:!0})}componentDidUpdate(e,t){this.handleComponentUpdate(t)}componentDidMount(){if(this.startOpenedPrevState=this.props.startOpened,this.endOpenedPrevState=this.props.endOpened,this.bottomOpenedPrevState=this.props.bottomOpened,null===this.windowResizeHandler&&(this.windowResizeHandler=this.windowResizeCallback.bind(this)),window.addEventListener(d.DrawerConstants.stringResize,this.windowResizeHandler),h.defaultProps.startOpened!=this.props.startOpened||h.defaultProps.endOpened!=this.props.endOpened||h.defaultProps.bottomOpened!=this.props.bottomOpened){const e=Object.assign({},this.state);e.startOpened=!1,e.endOpened=!1,e.bottomOpened=!1,this.handleComponentUpdate(e)}}componentWillUnmount(){window.removeEventListener(d.DrawerConstants.stringResize,this.windowResizeHandler),this.windowResizeHandler=null}handleComponentUpdate(e){let t=[d.DrawerConstants.stringStart,d.DrawerConstants.stringEnd,d.DrawerConstants.stringBottom];t=t.filter(e=>e!=this.state.lastlyOpenedDrawer),this.openOrCloseDrawer(t[0],e),this.openOrCloseDrawer(t[1],e),this.openOrCloseDrawer(this.state.lastlyOpenedDrawer,e)}openOrCloseDrawer(e,t){const s=this.edgeToStateOpenedName(e);if(this.isDrawerOpened(e)!=t[s]||this.shouldDrawerChangeDisplayMode(e)||this.isDrawerOpened(e)&&t[s]){this.isDrawerOpened(e)!=t[s]&&(this[this.edgeToPrevStateOpenedName(e)]=this.isDrawerOpened(e));this.getDrawerResolvedDisplayMode(e)===d.DrawerConstants.stringReflow?this.openOrCloseReflowDrawer(e,t):this.openOrClosePopupDrawer(e,t)}}openOrCloseReflowDrawer(e,t){!1===this.isDrawerOpened(e)||this.shouldDrawerChangeDisplayMode(e)||this.getStateToChangeTo(e)?(this.elementWithFocusBeforeDrawerCloses=document.activeElement,this.animateClose(e).then(()=>{if(o.removeResizeListener(this.getDrawerRef(e).current,this.reflowDrawerResizeHandler),this.reflowDrawerResizeHandler,this.returnFocus(e),this.getStateToChangeTo(e)){const t={},s={};s[this.edgeToStateToChangeTo(e)]=null,Object.assign(t,this.getStateToChangeTo(e),s),this.setState(t)}else if(this.shouldDrawerChangeDisplayMode(e)){const t={};t[this.edgeToShouldChangeDisplayMode(e)]=!1,t.viewportResolvedDisplayMode=this.getViewportResolvedDisplayMode(),t.viewportResolvedDisplayModeVertical=this.getViewportResolvedDisplayModeVertical(),this.setState(t)}else this.wasDrawerOpenedInPrevState(e)||(this.addHiddenStyle(e),this.forceUpdate(),setTimeout(()=>{this.setBottomOverlayDrawerWidth()},0))}).then(()=>{this.setBottomOverlayDrawerWidth()})):this.isDrawerOpened(e)&&(!1===t[this.edgeToStateOpenedName(e)]||t[this.edgeToShouldChangeDisplayMode(e)]||t[this.edgeToDisplayName(e)]!=this.state[this.edgeToDisplayName(e)])&&(t[this.edgeToShouldChangeDisplayMode(e)]||(this.drawerOpener=document.activeElement),this.removeHiddenStyle(e),this.animateOpen(e).then(()=>{this.setBottomOverlayDrawerWidth(),null===this.reflowDrawerResizeHandler&&(this.reflowDrawerResizeHandler=this.reflowDrawerResizeCallback.bind(this,e)),o.addResizeListener(this.getDrawerRef(e).current,this.reflowDrawerResizeHandler,50,!0)}))}removeHiddenStyle(e){var t;null===(t=this.getDrawerWrapperRef(e).current)||void 0===t||t.classList.remove(d.DrawerConstants.styleDrawerHidden)}addHiddenStyle(e){this.getDrawerWrapperRef(e).current.classList.add(d.DrawerConstants.styleDrawerHidden)}returnFocus(e){const t=this.getDrawerRef(e).current;t&&t.contains(this.elementWithFocusBeforeDrawerCloses)&&d.DrawerUtils.moveFocusToElementOrNearestAncestor(this.drawerOpener)}animateOpen(e){return this.getDrawerResolvedDisplayMode(e)===d.DrawerConstants.stringReflow?n.expand(this.getRefToAnimate(e).current,d.DrawerUtils.getAnimationOptions("expand",e)):n.slideIn(this.getRefToAnimate(e).current,d.DrawerUtils.getAnimationOptions(d.DrawerConstants.stringSlideIn,e))}animateClose(e){return this.getDrawerResolvedDisplayMode(e)===d.DrawerConstants.stringReflow?n.collapse(this.getRefToAnimate(e).current,d.DrawerUtils.getAnimationOptions("collapse",e)):n.slideOut(this.getRefToAnimate(e).current,d.DrawerUtils.getAnimationOptions(d.DrawerConstants.stringSlideOut,e))}edgeToStateOpenedName(e){return`${e}${d.DrawerUtils.capitalizeFirstChar(d.DrawerConstants.stringOpened)}`}edgeToPrevStateOpenedName(e){return`${e}${d.DrawerUtils.capitalizeFirstChar(d.DrawerConstants.stringOpened)}${d.DrawerConstants.stringPrevState}`}edgeToShouldChangeDisplayMode(e){return`${e}${d.DrawerConstants.stringShouldChangeDisplayMode}`}edgeToClosedWithEsc(e){return`${e}${d.DrawerConstants.stringClosedWithEsc}`}edgeToDisplayName(e){return`${e}${d.DrawerConstants.stringDisplay}`}edgeToStateToChangeTo(e){return`${e}${d.DrawerConstants.stringStateToChangeTo}`}openOrClosePopupDrawer(e,t){const s=a(this.getDrawerRef(e).current),r=g.getInstance(),n=this.getPopupServiceOptions(e,t);!1===this.isDrawerOpened(e)||this.shouldDrawerChangeDisplayMode(e)||this.getStateToChangeTo(e)?c.getStatus(s)===c.STATUS.OPEN&&r.close(n):this.isDrawerOpened(e)&&[c.STATUS.CLOSE,c.STATUS.UNKNOWN].indexOf(c.getStatus(s)>-1)&&(this.removeHiddenStyle(e),r.open(n))}shouldDrawerChangeDisplayMode(e){return this.state[this.edgeToShouldChangeDisplayMode(e)]}getStateToChangeTo(e){return this.state[this.edgeToStateToChangeTo(e)]}getPopupServiceOptions(e,t){const s=a(this.getDrawerRef(e).current),r={},n=g.OPTION;r[n.POPUP]=s,r[n.LAUNCHER]=a(document.activeElement),r[n.LAYER_SELECTORS]=d.DrawerConstants.DrawerLayoutStyleSurrogate,r[n.LAYER_LEVEL]=g.LAYER_LEVEL.TOP_LEVEL,r[n.POSITION]=this.getDrawerPosition(e),r[n.CUSTOM_ELEMENT]=!0;const o=g.EVENT;return r[n.EVENTS]={[o.POPUP_BEFORE_OPEN]:()=>this.beforeOpenHandler(e,t,r),[o.POPUP_AFTER_OPEN]:()=>this.afterOpenHandler(e,t),[o.POPUP_BEFORE_CLOSE]:()=>this.beforeCloseHandler(e),[o.POPUP_AFTER_CLOSE]:()=>this.afterCloseHandler(e,t),[o.POPUP_REFRESH]:()=>this.refreshHandler(e),[o.POPUP_REMOVE]:()=>this.destroyHandler(e)},r}beforeOpenHandler(e,t,s){d.DrawerUtils.disableBodyOverflow(),t[this.edgeToShouldChangeDisplayMode(e)]||(this.drawerOpener=document.activeElement);const r=s[g.OPTION.POPUP],a=s[g.OPTION.POSITION];return e===d.DrawerConstants.stringBottom&&this.setBottomOverlayDrawerWidth(),r.show(),r.position(a),this.setStartEndOverlayDrawersHeight(),this.animateOpen(e)}setBottomOverlayDrawerWidth(){if(this.isDrawerOpened(d.DrawerConstants.stringBottom)&&this.getDrawerResolvedDisplayMode(d.DrawerConstants.stringBottom)!=d.DrawerConstants.stringReflow){const e=this.middleSectionRef.current.getBoundingClientRect().width;this.bottomRef.current.style.width=e+"px"}}afterOpenHandler(e,t){d.DrawerUtils.enableBodyOverflow(),this.handleFocus(t);const s=a(this.getDrawerRef(e).current),r=c.getStatus(s);if(null===this.overlayDrawerResizeHandler&&(this.overlayDrawerResizeHandler=this.overlayDrawerResizeCallback.bind(this,e)),o.addResizeListener(this.getDrawerRef(e).current,this.overlayDrawerResizeHandler,50,!0),r===c.STATUS.OPEN&&!this.isDrawerOpened(e)){const s=g.getInstance(),r=this.getPopupServiceOptions(e,t);s.close(r)}}handleFocus(e){this.state.startOpened&&e.startOpened!==this.state.startOpened&&this.setDrawerFocus(d.DrawerConstants.stringStart),this.state.endOpened&&e.endOpened!==this.state.endOpened&&this.setDrawerFocus(d.DrawerConstants.stringEnd),this.state.bottomOpened&&e.bottomOpened!==this.state.bottomOpened&&this.setDrawerFocus(d.DrawerConstants.stringBottom)}beforeCloseHandler(e){return d.DrawerUtils.disableBodyOverflow(),this.elementWithFocusBeforeDrawerCloses=document.activeElement,o.removeResizeListener(this.getDrawerRef(e).current,this.overlayDrawerResizeHandler),this.overlayDrawerResizeHandler,this.animateClose(e)}afterCloseHandler(e,t){this[this.edgeToClosedWithEsc(e)]&&(this[this.edgeToClosedWithEsc(e)]=!1),d.DrawerUtils.enableBodyOverflow(),this.returnFocus(e);const s=a(this.getDrawerRef(e).current),r=c.getStatus(s);if(this.getDrawerRef(e).current&&this.getDrawerRef(e).current.removeAttribute("style"),this.getStateToChangeTo(e)){const t={},s={};s[this.edgeToStateToChangeTo(e)]=null,Object.assign(t,this.getStateToChangeTo(e),s),this.setState(t)}else if(this.shouldDrawerChangeDisplayMode(e)){const t={};t[this.edgeToShouldChangeDisplayMode(e)]=!1,t.viewportResolvedDisplayMode=this.getViewportResolvedDisplayMode(),t.viewportResolvedDisplayModeVertical=this.getViewportResolvedDisplayModeVertical(),this.setState(t)}else if(r===c.STATUS.CLOSE&&this.isDrawerOpened(e)){const s=g.getInstance(),r=this.getPopupServiceOptions(e,t);s.open(r)}else this.wasDrawerOpenedInPrevState(e)||(this.addHiddenStyle(e),this.forceUpdate())}setStartEndOverlayDrawersHeight(){const e=d.DrawerUtils.getElementHeight(this.middleSectionRef.current)+"px",t=this.startRef.current;t&&(t.style.height=e);const s=this.endRef.current;s&&(s.style.height=e)}},e.DrawerLayout.defaultProps={startOpened:!1,endOpened:!1,bottomOpened:!1,startDisplay:"auto",endDisplay:"auto",bottomDisplay:"auto"},e.DrawerLayout._metadata={slots:{"":{},start:{},end:{},bottom:{}},properties:{startOpened:{type:"boolean",writeback:!0},endOpened:{type:"boolean",writeback:!0},bottomOpened:{type:"boolean",writeback:!0},startDisplay:{type:"string",enumValues:["auto","overlay","reflow"]},endDisplay:{type:"string",enumValues:["auto","overlay","reflow"]},bottomDisplay:{type:"string",enumValues:["auto","overlay","reflow"]}},events:{ojBeforeClose:{cancelable:!0}},extension:{_WRITEBACK_PROPS:["startOpened","endOpened","bottomOpened"],_READ_ONLY_PROPS:[],_OBSERVED_GLOBAL_PROPS:["role"]}},e.DrawerLayout=h=p([s.customElement("oj-drawer-layout")],e.DrawerLayout),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdrawerlayout.js.map