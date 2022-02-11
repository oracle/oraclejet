/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact","ojs/ojvcomponent"],function(t,e,h){"use strict";var i=function(t,e,h,i){var r,n=arguments.length,s=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,h):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,h,i);else for(var l=t.length-1;l>=0;l--)(r=t[l])&&(s=(n<3?r(s):n>3?r(e,h,s):r(e,h))||s);return n>3&&s&&Object.defineProperty(e,h,s),s};t.HighlightText=class extends e.Component{constructor(){super(...arguments),this._HIGHLIGHT_TOKEN="__@@__"}render(t){const i=this._highlighter(t.text,t.matchText);return e.h(h.Root,{class:"oj-highlighttext"},i)}_highlighter(t,h){if(h){const i=this._escapeRegExp(h),r=t.replace(new RegExp(i,"gi"),this._HIGHLIGHT_TOKEN+"$&"+this._HIGHLIGHT_TOKEN).split(this._HIGHLIGHT_TOKEN).map((t,h)=>h%2==0?t:e.h("span",{class:"oj-highlighttext-highlighter"},t));return e.h("span",null,r)}return e.h("span",null,t)}_escapeRegExp(t){return t.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&")}},t.HighlightText.defaultProps={text:"",matchText:""},t.HighlightText.metadata={properties:{text:{type:"string"},matchText:{type:"string"}}},t.HighlightText=i([h.customElement("oj-highlight-text")],t.HighlightText),Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojhighlighttext.js.map