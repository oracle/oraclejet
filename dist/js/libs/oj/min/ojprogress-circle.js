/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","ojs/ojvcomponent","preact","ojs/ojtranslation"],function(e,r,t,s,a){"use strict";var n=function(e,r,t,s){var a,n=arguments.length,l=n<3?r:null===s?s=Object.getOwnPropertyDescriptor(r,t):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,r,t,s);else for(var c=e.length-1;c>=0;c--)(a=e[c])&&(l=(n<3?a(l):n>3?a(r,t,l):a(r,t))||l);return n>3&&l&&Object.defineProperty(r,t,l),l};e.ProgressCircle=class extends s.Component{render(e){return-1===e.value?this._renderIndeterminateCircle(e):this._renderDeterminateCircle(e)}_renderIndeterminateCircle(e){return r.jsx(t.Root,Object.assign({class:"oj-progress-circle oj-progress-circle-"+e.size,role:"progressbar","aria-valuetext":a.getTranslatedString("oj-ojProgressbar.ariaIndeterminateProgressText")},{children:r.jsx("div",Object.assign({class:"oj-progress-circle-indeterminate"},{children:r.jsx("div",{class:"oj-progress-circle-indeterminate-inner"})}))}))}_renderDeterminateCircle(e){let s=e.max,a=e.value;s<0&&(s=0),a<0&&-1!==a&&(a=0);const n=0===s?0:a>s?1:a/s,l=this._getClipPath(n);return r.jsxs(t.Root,Object.assign({class:"oj-progress-circle oj-progress-circle-"+e.size,role:"progressbar","aria-valuemin":"0","aria-valuemax":s,"aria-valuenow":a},{children:[r.jsx("div",{class:"oj-progress-circle-tracker"}),r.jsx("div",{class:"oj-progress-circle-value",style:{clipPath:l}})]}))}_getClipPath(e){let r;return e<.125?(r=this._calculateTangent(e)+50,`polygon(50% 0, ${r}% 0, 50% 50%)`):e<.375?(r=e<.25?50-this._calculateTangent(.25-e):this._calculateTangent(e-.25)+50,`polygon(50% 0, 100% 0, 100% ${r}%, 50% 50%)`):e<.625?(r=e<.5?50+this._calculateTangent(.5-e):50-this._calculateTangent(e-.5),`polygon(50% 0, 100% 0, 100% 100%, ${r}% 100%, 50% 50%)`):e<.875?(r=e<.75?50+this._calculateTangent(.75-e):50-this._calculateTangent(e-.75),`polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% ${r}%, 50% 50%)`):(r=50-this._calculateTangent(1-e),`polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% 0%, ${r}% 0%, 50% 50%)`)}_calculateTangent(e){return 50*Math.tan(2*e*Math.PI)}},e.ProgressCircle.defaultProps={max:100,value:0,size:"md"},e.ProgressCircle._metadata={properties:{max:{type:"number"},value:{type:"number"},size:{type:"string",enumValues:["lg","md","sm"]}}},e.ProgressCircle=n([t.customElement("oj-progress-circle")],e.ProgressCircle),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojprogress-circle.js.map