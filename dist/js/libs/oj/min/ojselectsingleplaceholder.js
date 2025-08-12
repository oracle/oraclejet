/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","preact","ojs/ojvcomponent"],function(e,t,l,o){"use strict";var n=function(e,t,l,o){var n,c=arguments.length,r=c<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,l):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,l,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(c<3?n(r):c>3?n(t,l,r):n(t,l))||r);return c>3&&r&&Object.defineProperty(t,l,r),r};e.SelectSinglePlaceholder=class extends l.Component{constructor(){super(...arguments),this._handleIconClick=e=>{e.preventDefault(),e.stopPropagation(),this.props?.onOjDropdownIconAction()}}render(e){return t.jsxs("div",{class:"oj-select-single-placeholder-container",children:[t.jsx("div",{className:"oj-text-field-middle",children:e.value}),t.jsx("span",{onClick:this._handleIconClick,class:"oj-text-field-end",children:t.jsx("span",{className:"oj-searchselect-arrow oj-searchselect-open-icon oj-component-icon","aria-hidden":"true"})})]})}},e.SelectSinglePlaceholder.defaultProps={value:null},e.SelectSinglePlaceholder._metadata={properties:{value:{type:"string"}},events:{ojDropdownIconAction:{}}},e.SelectSinglePlaceholder=n([o.customElement("oj-select-single-placeholder")],e.SelectSinglePlaceholder),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojselectsingleplaceholder.js.map