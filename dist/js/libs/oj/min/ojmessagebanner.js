/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","@oracle/oraclejet-preact/UNSAFE_MessageBanner","@oracle/oraclejet-preact/UNSAFE_Message","ojs/ojanimation","ojs/ojtranslation","ojs/ojcontext","ojs/ojdataproviderhandler","ojs/ojvcomponent","preact","ojs/ojbutton"],function(e,t,a,n,s,o,r,i,d,l,c){"use strict";r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r;var g=function(e,t,a,n){var s,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(r=(o<3?s(r):o>3?s(t,a,r):s(t,a))||r);return o>3&&r&&Object.defineProperty(t,a,r),r},u=function(e,t,a,n){return new(a||(a=Promise))(function(s,o){function r(e){try{d(n.next(e))}catch(e){o(e)}}function i(e){try{d(n.throw(e))}catch(e){o(e)}}function d(e){var t;e.done?s(e.value):(t=e.value,t instanceof a?t:new a(function(e){e(t)})).then(r,i)}d((n=n.apply(e,t||[])).next())})};e.MessageBanner=class extends l.Component{constructor(e){super(e),this._addBusyState=e=>r.getContext(this._rootRef.current).getBusyContext().addBusyState({description:e}),this._handleCloseMessage=e=>{var t,a;null===(a=(t=this.props).onOjClose)||void 0===a||a.call(t,e)},this._handleAnimation=(e,t,a)=>u(this,void 0,void 0,function*(){yield s.startAnimation(e,t,a)}),this._renderCloseButton=(e,a)=>t.jsxs("oj-button",Object.assign({class:"oj-button-sm",display:"icons",chroming:"borderless",title:e,onojAction:a},{children:[t.jsx("span",{slot:"startIcon",class:"oj-fwk-icon oj-fwk-icon-cross"}),t.jsx("span",{children:e})]})),this._rootRef=l.createRef(),this.state={dataProviderCount:0,previousDataProvider:e.data},this.WrapperMessagesContainer=i.withDataProvider(a.MessageBanner,"data")}static getDerivedStateFromProps(e,t){const{data:a}=e,{dataProviderCount:n,previousDataProvider:s}=t;return a!==s?{dataProviderCount:n+1,previousDataProvider:a}:null}render(e,a){const{data:s,detailTemplateValue:r,messageTemplates:i,type:l}=e,{dataProviderCount:c}=this.state,g={addBusyState:this._addBusyState};return t.jsx(d.Root,Object.assign({ref:this._rootRef},{children:t.jsx(n.MessagesContext.Provider,Object.assign({value:g},{children:t.jsx(this.WrapperMessagesContainer,{addBusyState:this._addBusyState,data:s,type:l,closeButtonRenderer:this._renderCloseButton,detailRendererKey:r,renderers:i,startAnimation:this._handleAnimation,onClose:this._handleCloseMessage,translations:{close:o.getTranslatedString("oj-ojMessageBanner.close"),navigationFromMessagesRegion:o.getTranslatedString("oj-ojMessageBanner.navigationFromMessagesRegion"),navigationToMessagesRegion:o.getTranslatedString("oj-ojMessageBanner.navigationToMessagesRegion"),error:o.getTranslatedString("oj-ojMessageBanner.error"),warning:o.getTranslatedString("oj-ojMessageBanner.warning"),info:o.getTranslatedString("oj-ojMessageBanner.info"),confirmation:o.getTranslatedString("oj-ojMessageBanner.confirmation")}},"dataProvider"+c)}))}))}},e.MessageBanner.defaultProps={type:"section"},e.MessageBanner.metadata={properties:{data:{type:"object"},type:{type:"string",enumValues:["page","section"]},detailTemplateValue:{type:"string|function"}},extension:{_DYNAMIC_SLOT:{prop:"messageTemplates",isTemplate:1}},events:{ojClose:{}}},e.MessageBanner=g([d.customElement("oj-message-banner")],e.MessageBanner),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojmessagebanner.js.map