function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?_arrayLikeToArray(e,t):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}define(["exports","./tslib.es6-15721dfa","preact/jsx-runtime","./hooks/UNSAFE_useFormContext",'css!./UNSAFE_TextField.css',"./utils/UNSAFE_classNames","./utils/UNSAFE_interpolations/text","./utils/UNSAFE_mergeInterpolations","./hooks/UNSAFE_useFormFieldContext","./TextFieldInput-672b8754","./classNames-f6826ecb","./UNSAFE_LabelValueLayout","preact","./UNSAFE_Flex","./_curry1-28c749e4","./_curry2-2b58ec36","./Flex-9b35c77b","./hooks/UNSAFE_useDebounce","./hooks/UNSAFE_useTranslationBundle","./UNSAFE_LiveRegion","preact/hooks","./keys-20e26f7c","./_has-d3e8a510","./hooks/UNSAFE_useTextFieldInputHandlers","./utils/PRIVATE_clientHints","./clientHints-a200d3d9","./utils/UNSAFE_size","./utils/UNSAFE_stringUtils","./stringUtils-b43463af","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_arrayUtils","./utils/UNSAFE_interpolations/boxalignment","./utils/UNSAFE_interpolations/flexbox","./flexbox-f4630ff2","./utils/UNSAFE_interpolations/flexitem","./flexitem-aa368397","./UNSAFE_Environment","./UNSAFE_Layer","preact/compat"],(function(e,t,a,n,r,s,i,l,o,c,u,d,b,x,y,h,g,m,f,p,j,_,F,v,A,C,N,L,E,S,U,I,w,O,T,R,k,z,M){"use strict";const W="byczszj",D="to9zpcl",H="iuhxjs8",V="t1ch5h18",$="iol9fno",q="t15jwrza",B="t1y841pv",P="i1cijd50",K="i1of5qyc";const G=e=>{var{outerClassNames:n,innerClassNames:r,label:s,labelEdge:i,labelStartWidth:l,inlineUserAssistance:o,children:c}=e,u=t.__rest(e,["outerClassNames","innerClassNames","label","labelEdge","labelStartWidth","inlineUserAssistance","children"]);return a.jsxs("div",Object.assign({},u,{class:n},{children:[a.jsx(d.LabelValueLayout,Object.assign({label:s,labelEdge:i,labelStartWidth:l},{children:a.jsx("div",Object.assign({class:r},{children:c}))})),o]}))},X=e=>{var{outerClassNames:n,innerClassNames:r,inlineUserAssistance:s,children:i}=e,l=t.__rest(e,["outerClassNames","innerClassNames","inlineUserAssistance","children"]);return a.jsxs("div",Object.assign({},l,{class:n},{children:[a.jsx("div",Object.assign({class:r},{children:i})),s]}))};var J=function(e,t){switch(e){case 0:return function(){return t.apply(this,arguments)};case 1:return function(e){return t.apply(this,arguments)};case 2:return function(e,a){return t.apply(this,arguments)};case 3:return function(e,a,n){return t.apply(this,arguments)};case 4:return function(e,a,n,r){return t.apply(this,arguments)};case 5:return function(e,a,n,r,s){return t.apply(this,arguments)};case 6:return function(e,a,n,r,s,i){return t.apply(this,arguments)};case 7:return function(e,a,n,r,s,i,l){return t.apply(this,arguments)};case 8:return function(e,a,n,r,s,i,l,o){return t.apply(this,arguments)};case 9:return function(e,a,n,r,s,i,l,o,c){return t.apply(this,arguments)};case 10:return function(e,a,n,r,s,i,l,o,c,u){return t.apply(this,arguments)};default:throw new Error("First argument to _arity must be a non-negative integer no greater than ten")}},Q=J,Y=y._isPlaceholder_1;var Z=function e(t,a,n){return function(){for(var r=[],s=0,i=t,l=0;l<a.length||s<arguments.length;){var o;l<a.length&&(!Y(a[l])||s>=arguments.length)?o=a[l]:(o=arguments[s],s+=1),r[l]=o,Y(o)||(i-=1),l+=1}return i<=0?n.apply(this,r):Q(i,e(t,r,n))}},ee=J,te=y._curry1_1,ae=h._curry2_1,ne=Z,re=ae((function(e,t){return 1===e?te(t):ee(e,ne(e,[],t))})),se=y._curry1_1,ie=re;const le={base:"bpxth0a",textarea:"t1nwf48c",labelInside:"l1asas25",focused:"f1fkvmlv",resize:{both:"byvh15",horizontal:"haatqwl",vertical:"vnx52bj"},disabled:"de62cmy",error:"ewejuy9",warning:"w1ywmvcj"},oe={textarea:le.textarea,textareaError:le.textarea,textareaWarning:le.textarea},ce={error:le.error,textareaError:le.error,warning:le.warning,textareaWarning:le.warning},ue=se((function(e){return ie(e.length,e)}))(((e,t)=>t&&e[t])),de=ue(oe),be=ue(ce),xe="bwv846o",ye="l4zuwwr",he="deqisnl",ge="b1g2m4fu",me="ti5cls5",fe=ue({textarea:me,textareaError:me,textareaWarning:me}),pe="b1m9i38d",je="loikvln",_e=({insideLabel:e,mainContent:t,startContent:n,endContent:r,resize:s,variant:i,rootRef:l})=>{const{isDisabled:d,isFocused:b,isLoading:x}=o.useFormFieldContext();let y=null==i?void 0:i.toLowerCase().replace("textarea","");y=y||void 0;const h=u.classNames([le.base,void 0!==e&&le.labelInside,s&&le.resize[s],b&&le.focused,d?le.disabled:u.classNames([be(i),i&&`oj-c-text-field-${y}`]),x&&c.loadingStyles,de(i)]),m=u.classNames([xe,null!=e&&ye,d&&he]),f=u.classNames([ge,fe(i)]),p=u.classNames([pe,null!=e&&je]);return a.jsxs("div",Object.assign({role:"presentation",class:h,ref:l},{children:[n&&a.jsx("span",Object.assign({class:m},{children:a.jsx(g.Flex,Object.assign({justify:"center",align:"center"},{children:n}))})),a.jsxs("div",Object.assign({class:f},{children:[e,t]})),r&&a.jsx("span",Object.assign({class:p},{children:a.jsx(g.Flex,Object.assign({justify:"center",align:"center"},{children:r}))}))]}))},Fe=e=>{var{hasInsideLabel:n=!1}=e,r=t.__rest(e,["hasInsideLabel"]);const{isReadonly:s}=o.useFormFieldContext(),i=c.getFormControlClasses(n),l=c.getTextFieldClasses(s),d=u.classNames([i,l]);return a.jsx("div",Object.assign({},r,{class:d}))};e.TextFieldInput=c.TextFieldInput,e.getInputId=c.getInputId,e.MaxLengthLiveRegion=function({isMaxLengthExceeded:e,maxLength:t,valueLength:n=0}){const r=m.useDebounce(t-n,500),s=f.useTranslationBundle("@oracle/oraclejet-preact"),i=s.formControl_maxLengthExceeded({MAX_LENGTH:`${t}`}),l=s.formControl_maxLengthRemaining({CHARACTER_COUNT:`${r}`});return a.jsxs(b.Fragment,{children:[a.jsx(p.LiveRegion,{children:l}),e&&a.jsx(p.LiveRegion,Object.assign({type:"assertive"},{children:i}))]})},e.ReadonlyTextField=e=>{var{label:r,labelEdge:s,children:i,variant:l}=e,d=t.__rest(e,["label","labelEdge","children","variant"]);const{isFormLayout:b,isReadonly:x}=n.useFormContext(),{isLoading:y}=o.useFormFieldContext(),h=void 0!==r&&"inside"===s,g=c.getFormControlClasses(h),m=c.getTextFieldClasses(!0),f=c.getReadonlyClasses(b&&!x,h,l),p=u.classNames([g,m]),j=u.classNames([f,y&&c.loadingStyles]);return void 0===r||"start"!==s&&"top"!==s?a.jsxs(X,Object.assign({outerClassNames:p,innerClassNames:j},d,{children:[r,i]})):a.jsx(G,Object.assign({outerClassNames:p,innerClassNames:j,label:r,labelEdge:s},d,{children:i}))},e.ReadonlyTextFieldInput=function(e){var{ariaLabel:r,ariaLabelledby:s,autoFocus:d,as:b="div",elementRef:x,hasInsideLabel:y=!1,id:h,inlineUserAssistance:g,innerReadonlyField:m,rows:f,type:p,value:j=""}=e,_=t.__rest(e,["ariaLabel","ariaLabelledby","autoFocus","as","elementRef","hasInsideLabel","id","inlineUserAssistance","innerReadonlyField","rows","type","value"]);const{isFormLayout:F,isReadonly:v}=n.useFormContext(),{isLoading:A}=o.useFormFieldContext(),C=A?c.getLoadingAriaLabel():r,N=_toConsumableArray(Object.values(i.textInterpolations)),L=l.mergeInterpolations(N),{class:E}=L(_),S=u.classNames(["textarea"!==b&&"oj-c-hide-scrollbar",W,"textarea"===b&&D,F&&!v&&H,F&&!v&&"textarea"===b&&V,F&&!v&&(y?$:P),F&&!v&&"textarea"===b&&y&&q,F&&v&&"textarea"===b&&!y&&B,F&&!v&&"textarea"!==b&&K,E]);return"input"===b?a.jsx("input",{"aria-label":C,"aria-labelledby":s,autofocus:d,class:S,id:h,readonly:!0,ref:x,type:p,value:j}):"textarea"===b?a.jsx("textarea",Object.assign({"aria-label":C,"aria-labelledby":s,autofocus:d,class:S,id:h,readonly:!0,ref:x,rows:f},{children:j})):a.jsx("div",Object.assign({"aria-label":C,"aria-labelledby":s,"aria-readonly":!0,autofocus:d,class:S,ref:x,role:"textbox",tabIndex:0},{children:j}))},e.TextField=({id:e,endContent:t,mainContent:n,startContent:r,inlineUserAssistance:s,label:i,labelEdge:l,labelStartWidth:o,mainFieldRef:c,resize:u,variant:x,onFocus:y,onBlur:h,onKeyDown:g,onMouseDown:m,onMouseEnter:f,onMouseLeave:p})=>{const j=void 0===i||"start"!==l&&"top"!==l?a.jsxs(b.Fragment,{children:[a.jsx(_e,{insideLabel:i,startContent:r,mainContent:n,endContent:t,resize:u,variant:x,rootRef:c}),s]}):a.jsx(d.LabelValueLayout,Object.assign({label:i,labelEdge:l,labelStartWidth:o},{children:a.jsxs(b.Fragment,{children:[a.jsx(_e,{startContent:r,mainContent:n,endContent:t,resize:u,variant:x,rootRef:c}),s]})}));return a.jsx(Fe,Object.assign({id:e,hasInsideLabel:void 0!==i&&"inside"===l,onfocusin:y,onfocusout:h,onKeyDown:g,onMouseDown:m,onMouseEnter:f,onMouseLeave:p},{children:j}))},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_TextField.js.map
