/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","preact","ojs/ojvcomponent"],function(e,t,i,r){"use strict";var s=function(e,t,i,r){var s,h=arguments.length,n=h<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(n=(h<3?s(n):h>3?s(t,i,n):s(t,i))||n);return h>3&&n&&Object.defineProperty(t,i,n),n};e.HighlightText=class extends i.Component{constructor(){super(...arguments),this._HIGHLIGHT_TOKEN="__@@__"}render(e){const i=this._highlighter(e.text,e.matchText);return t.jsx(r.Root,Object.assign({class:"oj-highlighttext"},{children:i}))}_highlighter(e,i){if(i){const r=this._escapeRegExp(i),s=e.replace(new RegExp(r,"gi"),this._HIGHLIGHT_TOKEN+"$&"+this._HIGHLIGHT_TOKEN).split(this._HIGHLIGHT_TOKEN).map((e,i)=>i%2==0?e:t.jsx("span",Object.assign({class:"oj-highlighttext-highlighter"},{children:e})));return t.jsx("span",{children:s})}return t.jsx("span",{children:e})}_escapeRegExp(e){return e.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&")}},e.HighlightText.defaultProps={text:"",matchText:""},e.HighlightText.metadata={properties:{text:{type:"string"},matchText:{type:"string"}}},e.HighlightText=s([r.customElement("oj-highlight-text")],e.HighlightText),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojhighlighttext.js.map