function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?_arrayLikeToArray(e,t):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}define(["exports","./tslib.es6-6b9f8039","preact/jsx-runtime","./hooks/UNSAFE_useFormContext",'css!./UNSAFE_TextField.css',"./utils/UNSAFE_classNames","./utils/UNSAFE_interpolations/text","./utils/UNSAFE_mergeInterpolations","./hooks/UNSAFE_useFormFieldContext","./TextFieldInput-878a4f6a","./classNames-b2629d24","./UNSAFE_LabelValueLayout","preact","./UNSAFE_Flex","./_curry1-b1038181","./_curry2-de7435f6","./Flex-ba68c691","./hooks/UNSAFE_useDebounce","./hooks/UNSAFE_useTranslationBundle","./UNSAFE_LiveRegion","preact/hooks","./keys-9527ebf1","./_has-f8addc41","./hooks/UNSAFE_useTextFieldInputHandlers","./utils/PRIVATE_clientHints","./clientHints-c614d879","./utils/UNSAFE_size","./utils/UNSAFE_stringUtils","./stringUtils-a3acea83","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_arrayUtils","./utils/UNSAFE_interpolations/boxalignment","./utils/UNSAFE_interpolations/flexbox","./flexbox-a1508bc2","./utils/UNSAFE_interpolations/flexitem","./flexitem-15df728b","./UNSAFE_Environment","./UNSAFE_Layer","preact/compat"],(function(e,t,a,n,r,s,i,l,o,c,u,d,b,x,h,g,y,p,m,_,f,j,F,v,A,C,N,L,E,S,U,I,w,O,T,R,k,z,M){"use strict";const W="_n1b6om",D="znllbr",H="_psuy0h",q="_qrph7n",V="_eeetkl",$="_bmdju7",B="zr8b2q",P="wg3pte";const K=e=>{var{outerClassNames:n,innerClassNames:r,label:s,labelEdge:i,labelStartWidth:l,inlineUserAssistance:o,children:c}=e,u=t.__rest(e,["outerClassNames","innerClassNames","label","labelEdge","labelStartWidth","inlineUserAssistance","children"]);return a.jsxs("div",Object.assign({},u,{class:n},{children:[a.jsx(d.LabelValueLayout,Object.assign({label:s,labelEdge:i,labelStartWidth:l},{children:a.jsx("div",Object.assign({class:r},{children:c}))})),o]}))},G=e=>{var{outerClassNames:n,innerClassNames:r,inlineUserAssistance:s,children:i}=e,l=t.__rest(e,["outerClassNames","innerClassNames","inlineUserAssistance","children"]);return a.jsxs("div",Object.assign({},l,{class:n},{children:[a.jsx("div",Object.assign({class:r},{children:i})),s]}))};var X=function(e,t){switch(e){case 0:return function(){return t.apply(this,arguments)};case 1:return function(e){return t.apply(this,arguments)};case 2:return function(e,a){return t.apply(this,arguments)};case 3:return function(e,a,n){return t.apply(this,arguments)};case 4:return function(e,a,n,r){return t.apply(this,arguments)};case 5:return function(e,a,n,r,s){return t.apply(this,arguments)};case 6:return function(e,a,n,r,s,i){return t.apply(this,arguments)};case 7:return function(e,a,n,r,s,i,l){return t.apply(this,arguments)};case 8:return function(e,a,n,r,s,i,l,o){return t.apply(this,arguments)};case 9:return function(e,a,n,r,s,i,l,o,c){return t.apply(this,arguments)};case 10:return function(e,a,n,r,s,i,l,o,c,u){return t.apply(this,arguments)};default:throw new Error("First argument to _arity must be a non-negative integer no greater than ten")}},J=X,Q=h._isPlaceholder_1;var Y=function e(t,a,n){return function(){for(var r=[],s=0,i=t,l=0;l<a.length||s<arguments.length;){var o;l<a.length&&(!Q(a[l])||s>=arguments.length)?o=a[l]:(o=arguments[s],s+=1),r[l]=o,Q(o)||(i-=1),l+=1}return i<=0?n.apply(this,r):J(i,e(t,r,n))}},Z=X,ee=h._curry1_1,te=g._curry2_1,ae=Y,ne=te((function(e,t){return 1===e?ee(t):Z(e,ae(e,[],t))})),re=h._curry1_1,se=ne;const ie={base:"jrzml0",textarea:"_9mcyl0",labelInside:"j78ji5",focused:"_lxrr59",resize:{both:"_r7uwp3",horizontal:"_ungs9n",vertical:"_jpfde"},disabled:"_1fz7c7",error:"j6tnap",warning:"_qd3ih"},le={textarea:ie.textarea,textareaError:ie.textarea,textareaWarning:ie.textarea},oe={error:ie.error,textareaError:ie.error,warning:ie.warning,textareaWarning:ie.warning},ce=re((function(e){return se(e.length,e)}))(((e,t)=>t&&e[t])),ue=ce(le),de=ce(oe),be="vnnb98",xe="_wv3kzo",he="_pxtnet",ge="ftj5wx",ye="qnnx9f",pe=ce({textarea:ye,textareaError:ye,textareaWarning:ye}),me="_w86pwh",_e="_mlam0",fe=({insideLabel:e,mainContent:t,startContent:n,endContent:r,resize:s,variant:i,rootRef:l})=>{const{isDisabled:d,isFocused:b,isLoading:x}=o.useFormFieldContext();let h=null==i?void 0:i.toLowerCase().replace("textarea","");h=h||void 0;const g=u.classNames([ie.base,void 0!==e&&ie.labelInside,s&&ie.resize[s],b&&ie.focused,d?ie.disabled:u.classNames([de(i),i&&`oj-c-text-field-${h}`]),x&&c.loadingStyles,ue(i)]),p=u.classNames([be,null!=e&&xe,d&&he]),m=u.classNames([ge,pe(i)]),_=u.classNames([me,null!=e&&_e]);return a.jsxs("div",Object.assign({role:"presentation",class:g,ref:l},{children:[n&&a.jsx("span",Object.assign({class:p},{children:a.jsx(y.Flex,Object.assign({justify:"center",align:"center"},{children:n}))})),a.jsxs("div",Object.assign({class:m},{children:[e,t]})),r&&a.jsx("span",Object.assign({class:_},{children:a.jsx(y.Flex,Object.assign({justify:"center",align:"center"},{children:r}))}))]}))},je=e=>{var{hasInsideLabel:n=!1}=e,r=t.__rest(e,["hasInsideLabel"]);const{isReadonly:s}=o.useFormFieldContext(),i=c.getFormControlClasses(n),l=c.getTextFieldClasses(s),d=u.classNames([i,l]);return a.jsx("div",Object.assign({},r,{class:d}))};e.TextFieldInput=c.TextFieldInput,e.getInputId=c.getInputId,e.MaxLengthLiveRegion=function({isMaxLengthExceeded:e,maxLength:t,valueLength:n=0}){const r=p.useDebounce(t-n,500),s=m.useTranslationBundle("@oracle/oraclejet-preact"),i=s.formControl_maxLengthExceeded({MAX_LENGTH:`${t}`}),l=s.formControl_maxLengthRemaining({CHARACTER_COUNT:`${r}`});return a.jsxs(b.Fragment,{children:[a.jsx(_.LiveRegion,{children:l}),e&&a.jsx(_.LiveRegion,Object.assign({type:"assertive"},{children:i}))]})},e.ReadonlyTextField=e=>{var{label:r,labelEdge:s,children:i,variant:l}=e,d=t.__rest(e,["label","labelEdge","children","variant"]);const{isFormLayout:b,isReadonly:x}=n.useFormContext(),{isLoading:h}=o.useFormFieldContext(),g=void 0!==r&&"inside"===s,y=c.getFormControlClasses(g),p=c.getTextFieldClasses(!0),m=c.getReadonlyClasses(b&&!x,g,l),_=u.classNames([y,p]),f=u.classNames([m,h&&c.loadingStyles]);return void 0===r||"start"!==s&&"top"!==s?a.jsxs(G,Object.assign({outerClassNames:_,innerClassNames:f},d,{children:[r,i]})):a.jsx(K,Object.assign({outerClassNames:_,innerClassNames:f,label:r,labelEdge:s},d,{children:i}))},e.ReadonlyTextFieldInput=function(e){var{ariaLabel:r,ariaLabelledby:s,autoFocus:d,as:b="div",elementRef:x,hasInsideLabel:h=!1,id:g,inlineUserAssistance:y,innerReadonlyField:p,rows:m,type:_,value:f=""}=e,j=t.__rest(e,["ariaLabel","ariaLabelledby","autoFocus","as","elementRef","hasInsideLabel","id","inlineUserAssistance","innerReadonlyField","rows","type","value"]);const{isFormLayout:F,isReadonly:v}=n.useFormContext(),{isLoading:A}=o.useFormFieldContext(),C=A?c.getLoadingAriaLabel():r,N=_toConsumableArray(Object.values(i.textInterpolations)),L=l.mergeInterpolations(N),{class:E}=L(j),S=u.classNames(["textarea"!==b&&"oj-c-hide-scrollbar",W,"textarea"===b&&D,F&&!v&&H,"textarea"===b&&F&&!v&&q,F&&!v&&(h?V:B),"textarea"===b&&F&&!v&&h&&$,"textarea"!==b&&F&&!v&&P,E]);return"input"===b?a.jsx("input",{"aria-label":C,"aria-labelledby":s,autofocus:d,class:S,id:g,readonly:!0,ref:x,type:_,value:f}):"textarea"===b?a.jsx("textarea",Object.assign({"aria-label":C,"aria-labelledby":s,autofocus:d,class:S,id:g,readonly:!0,ref:x,rows:m},{children:f})):a.jsx("div",Object.assign({"aria-label":C,"aria-labelledby":s,"aria-readonly":!0,autofocus:d,class:S,ref:x,role:"textbox",tabIndex:0},{children:f}))},e.TextField=({id:e,endContent:t,mainContent:n,startContent:r,inlineUserAssistance:s,label:i,labelEdge:l,labelStartWidth:o,mainFieldRef:c,resize:u,variant:x,onFocus:h,onBlur:g,onKeyDown:y,onMouseDown:p,onMouseEnter:m,onMouseLeave:_})=>{const f=void 0===i||"start"!==l&&"top"!==l?a.jsxs(b.Fragment,{children:[a.jsx(fe,{insideLabel:i,startContent:r,mainContent:n,endContent:t,resize:u,variant:x,rootRef:c}),s]}):a.jsx(d.LabelValueLayout,Object.assign({label:i,labelEdge:l,labelStartWidth:o},{children:a.jsxs(b.Fragment,{children:[a.jsx(fe,{startContent:r,mainContent:n,endContent:t,resize:u,variant:x,rootRef:c}),s]})}));return a.jsx(je,Object.assign({id:e,hasInsideLabel:void 0!==i&&"inside"===l,onfocusin:h,onfocusout:g,onKeyDown:y,onMouseDown:p,onMouseEnter:m,onMouseLeave:_},{children:f}))},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_TextField.js.map