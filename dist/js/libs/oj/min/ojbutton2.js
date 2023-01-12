/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","ojs/ojdomutils","ojs/ojgestureutils","ojs/ojvcomponent","preact","ojs/ojvmenu","ojs/ojvcomponent-binding","ojs/ojthemeutils"],function(t,e,n,s,o,i,r,a,l){"use strict";var u,c=function(t,e,n,s){var o,i=arguments.length,r=i<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,n):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,n,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(i<3?o(r):i>3?o(e,n,r):o(e,n))||r);return i>3&&r&&Object.defineProperty(e,n,r),r};t.Button2=u=class extends i.Component{constructor(t){super(t),this._rootRef=i.createRef(),this._handleContextMenuGesture=(t,e)=>{const n={event:t,eventType:e};t.preventDefault(),this.setState({contextMenuTriggerEvent:n})},this._handleTouchstart=t=>{this.setState({active:!0})},this._handleTouchend=t=>{this.setState({active:!1})},this._handleFocusIn=t=>{t.target===t.currentTarget&&this._handleFocus(t),this.setState({focus:!0}),this._rootRef.current&&this.focusInHandler(this._rootRef.current)},this._handleFocusOut=t=>{t.target===t.currentTarget&&this._handleBlur(t),this.setState({focus:!1}),this._rootRef.current&&this.focusOutHandler(this._rootRef.current)},this._handleMouseenter=t=>{n.recentTouchEnd()||(this===u._lastActive&&this.setState({active:!0}),this.setState({hover:!0}))},this._handleMouseleave=t=>{this.setState({hover:!1,active:!1})},this._handleMousedown=t=>{if(1===t.which&&!n.recentTouchEnd()){this.setState({active:!0}),u._lastActive=this;const t=()=>{u._lastActive=null,document.removeEventListener("mouseup",t,!0)};document.addEventListener("mouseup",t,!0)}},this._handleMouseup=t=>{this.setState({active:!1})},this._handleClick=t=>{var e,n;t.detail<=1&&(null===(n=(e=this.props).onOjAction)||void 0===n||n.call(e,{originalEvent:t}))},this._handleKeydown=t=>{32!==t.keyCode&&13!==t.keyCode||this.setState({active:!0})},this._handleKeyup=t=>{this.setState({active:!1})},this._handleFocus=t=>{var e,n;null===(n=null===(e=this._rootRef)||void 0===e?void 0:e.current)||void 0===n||n.dispatchEvent(new FocusEvent("focus",{relatedTarget:t.relatedTarget}))},this._handleBlur=t=>{var e;this.setState({active:!1}),null===(e=this._rootRef)||void 0===e||e.current.dispatchEvent(new FocusEvent("blur",{relatedTarget:t.relatedTarget}))},this._onCloseCallback=t=>{this.state.contextMenuTriggerEvent&&this.setState({contextMenuTriggerEvent:null})},this.state={},this.uniquePrefix=t.id?t.id+o.getUniqueId():o.getUniqueId()}render(t,n){const s=t.children;let i=this._processIcon(t.startIcon,"oj-button-icon oj-start"),r=this._processIcon(t.endIcon,"oj-button-icon oj-end"),a=t["aria-label"],l=t["aria-labelledby"],u=t["aria-describedby"];const c=a||l;let h=null,d=null,b=null,p=t.title;const _=t.label||s;_?(p=this.state.derivedTitle||p||t.label,"icons"===t.display&&(i||r)?t.label?(c||(a=t.label),h=e.jsx("span",Object.assign({ref:t=>this._defaultSlotRef=t},{children:h}))):(c||(b=this.uniquePrefix+"|text",l=b),h=e.jsx("span",Object.assign({ref:t=>this._defaultSlotRef=t,class:"oj-button-text oj-helper-hidden-accessible",id:b},{children:_}))):"label"===t.display?(t.startIcon&&(i=this._processIcon(t.startIcon,"oj-button-icon oj-helper-hidden oj-start")),t.endIcon&&(r=this._processIcon(t.endIcon,"oj-button-icon oj-helper-hidden oj-end")),c||(b=this.uniquePrefix+"|text",l=b),h=e.jsx("span",Object.assign({ref:t=>this._defaultSlotRef=t,class:"oj-button-text",id:b},{children:_}))):(c||(b=this.uniquePrefix+"|text",l=b),h=e.jsx("span",Object.assign({ref:t=>this._defaultSlotRef=t,class:"oj-button-text",id:b},{children:_})))):h=e.jsx("span",Object.assign({ref:t=>this._defaultSlotRef=t},{children:h}));const f=e.jsxs("div",Object.assign({class:"oj-button-label"},{children:[i,h,r]}));let v;t.disabled?v=e.jsx("button",Object.assign({class:"oj-button-button","aria-labelledby":l,"aria-describedby":u,"aria-label":a,disabled:!0},{children:f})):(d=this._handleClick,v=e.jsx("button",Object.assign({class:"oj-button-button",ref:t=>this._buttonRef=t,"aria-labelledby":l,"aria-describedby":u,"aria-label":a,onTouchStart:this._handleTouchstart,onTouchEnd:this._handleTouchend,onTouchCancel:this._handleTouchend,onMouseEnter:this._handleMouseenter,onMouseLeave:this._handleMouseleave,onMouseDown:this._handleMousedown,onMouseUp:this._handleMouseup,onfocusin:this._handleFocusIn,onfocusout:this._handleFocusOut,onKeyDown:this._handleKeydown,onKeyUp:this._handleKeyup},{children:f})));const j=this._getRootClasses(i,r);return e.jsxs(o.Root,Object.assign({class:j,id:t.id,title:p,onClick:d,ref:this._rootRef},{children:[v,this._renderContextMenu()]}))}_renderContextMenu(){return this.state.contextMenuTriggerEvent&&this.props.contextMenu?e.jsx(r.VMenu,Object.assign({eventObj:this.state.contextMenuTriggerEvent,launcherElement:this._buttonRef,onCloseCallback:this._onCloseCallback},{children:[this.props.contextMenu]})):null}_processIcon(t,n){let s;return Array.isArray(t)?s=t.map(t=>this._processIcon(t,n)):t&&(s=e.jsx("span",Object.assign({class:n},{children:t}))),s}_getRootClasses(t,e){let n=!0,s="oj-button "+u._chromingMap[this.props.chroming];return s+=" "+this._getDisplayOptionClass(t,e),this.props.disabled?(n=!1,s+=" oj-disabled"):(s+=" oj-enabled",this.state.hover&&(n=!1,s+=" oj-hover"),this.state.active&&(n=!1,s+=" oj-active")),n&&(s+=" oj-default"),s}_getDisplayOptionClass(t,e){const n=t&&e,s=t||e,o="icons"===this.props.display;let i;return i="label"===this.props.display?"oj-button-text-only":s?o?n?"oj-button-icons-only":"oj-button-icon-only":n?"oj-button-text-icons":t?"oj-button-text-icon-start":"oj-button-text-icon-end":"oj-button-text-only",i}_addMutationObserver(){if(this._mutationObserver)return;this._mutationObserver=new MutationObserver(()=>{const t=this._getTextContent();t!=this.state.derivedTitle&&this.setState({derivedTitle:t})}),this._mutationObserver.observe(this._defaultSlotRef,{subtree:!0,characterData:!0})}_needsContextMenuDetection(t){return t.contextMenu&&!t.disabled}componentDidMount(){this._updateDerivedTitle(),this._needsContextMenuDetection(this.props)&&s.startDetectContextMenuGesture(this._rootRef.current,this._handleContextMenuGesture),this._rootRef.current.addEventListener("touchstart",this._handleTouchstart,{passive:!0}),this._rootRef.current.addEventListener("touchend",this._handleTouchend,{passive:!1}),this._rootRef.current.addEventListener("touchcancel",this._handleTouchend,{passive:!0}),n.makeFocusable({applyHighlight:!0,setupHandlers:(t,e)=>{let s=n.getNoJQFocusHandlers(t,e);this.focusInHandler=s.focusIn,this.focusOutHandler=s.focusOut}})}componentDidUpdate(t){t.display!=this.props.display&&this._updateDerivedTitle(),this._updateContextMenuDetection(t)}_updateDerivedTitle(){const t=this.props;let e;"icons"!==t.display||!t.startIcon&&!t.endIcon||t.label||t.title||(e=this._getTextContent(),this._addMutationObserver()),e!=this.state.derivedTitle&&this.setState({derivedTitle:e})}_updateContextMenuDetection(t){const e=this._needsContextMenuDetection(t),n=this._needsContextMenuDetection(this.props);e!=n&&(n?s.startDetectContextMenuGesture(this._rootRef.current,this._handleContextMenuGesture):s.stopDetectContextMenuGesture(this._rootRef.current))}static getDerivedStateFromProps(t){return t.disabled?{contextMenuTriggerEvent:null}:null}_getTextContent(){let t=this._defaultSlotRef.textContent;return t=t.trim(),""!==t?t:null}componentWillUnmount(){this._mutationObserver&&(this._mutationObserver.disconnect(),this._mutationObserver=null),s.stopDetectContextMenuGesture(this._rootRef.current)}refresh(){this.setState({active:!1})}focus(){var t;null===(t=this._buttonRef)||void 0===t||t.focus()}blur(){var t;null===(t=this._buttonRef)||void 0===t||t.blur()}},t.Button2._chromingMap={solid:"oj-button-full-chrome",outlined:"oj-button-outlined-chrome",borderless:"oj-button-half-chrome",full:"oj-button-full-chrome",half:"oj-button-half-chrome",callToAction:"oj-button-cta-chrome",danger:"oj-button-danger-chrome oj-button-full-chrome"},t.Button2.defaultProps={disabled:!1,display:"all",chroming:l.getCachedCSSVarValues(["--oj-private-button-global-chroming-default"])[0]},t.Button2._metadata={slots:{"":{},startIcon:{},endIcon:{},contextMenu:{}},properties:{disabled:{type:"boolean"},display:{type:"string",enumValues:["all","label","icons"]},label:{type:"string"},translations:{type:"object"},chroming:{type:"string",enumValues:["full","borderless","callToAction","danger","half","outlined","solid"],binding:{consume:{name:"containerChroming"}}}},events:{ojAction:{bubbles:!0}},extension:{_OBSERVED_GLOBAL_PROPS:["id","title","aria-label","aria-labelledby","aria-describedby"]},methods:{refresh:{},focus:{},blur:{}}},t.Button2=u=c([o.customElement("oj-button")],t.Button2),Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojbutton2.js.map