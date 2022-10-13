define(["exports","preact/jsx-runtime","preact/compat","preact/hooks","./hooks/UNSAFE_useFocusableTextField","./hooks/UNSAFE_useFormContext","./hooks/UNSAFE_useFormFieldContext","./hooks/UNSAFE_useTextField","./hooks/UNSAFE_useHover","./UNSAFE_Label","./UNSAFE_TextField","./UNSAFE_UserAssistance",'css!./UNSAFE_InputPassword.css',"./hooks/UNSAFE_useTranslationBundle","./hooks/UNSAFE_usePress","./index-8472e92c","./index-d0bde6b8","./hooks/UNSAFE_useClearIcon","./utils/UNSAFE_componentUtils","./ClearIcon-f75f5ad3","./hooks/UNSAFE_useToggle","./hooks/UNSAFE_useCurrentValueReducer","./TextFieldInput-878a4f6a","./tslib.es6-6b9f8039","./hooks/UNSAFE_useFocusWithin","./useFocusWithin-9c9c2ceb","preact","./hooks/UNSAFE_useId","./utils/UNSAFE_classNames","./classNames-b2629d24","./utils/UNSAFE_interpolations/text","./keys-9527ebf1","./_curry1-b1038181","./_has-f8addc41","./utils/UNSAFE_mergeInterpolations","./_curry2-de7435f6","./UNSAFE_LabelValueLayout","./UNSAFE_Flex","./Flex-ba68c691","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_arrayUtils","./utils/UNSAFE_size","./utils/UNSAFE_stringUtils","./stringUtils-a3acea83","./utils/UNSAFE_interpolations/boxalignment","./utils/UNSAFE_interpolations/flexbox","./flexbox-a1508bc2","./utils/UNSAFE_interpolations/flexitem","./flexitem-15df728b","./hooks/UNSAFE_useDebounce","./UNSAFE_LiveRegion","./UNSAFE_ComponentMessage","./ComponentMessage-773523b0","./UNSAFE_HiddenAccessible","./HiddenAccessible-9a62f23f","./UNSAFE_Message","./MessageCloseButton-104b16ed","./MessageDetail-d90dbb66","./MessageFormattingUtils-ce5ff913","./utils/UNSAFE_getLocale","./Message.types-a4166152","./MessageStartIcon-26ba679d","./MessageSummary-ab6ea303","./MessageTimestamp-f9e19dea","./MessageUtils-59029b39","./utils/UNSAFE_logger","./utils/UNSAFE_soundUtils","./MessagesManager-8ce3be5e","./UNSAFE_TransitionGroup","./UNSAFE_Icon","./Icon-c904953e","./hooks/UNSAFE_useUser","./UNSAFE_Environment","./UNSAFE_Layer","./hooks/UNSAFE_useTheme","./ComponentMessageContainer-0a82edf7","./hooks/UNSAFE_useTextFieldInputHandlers","./utils/PRIVATE_clientHints","./clientHints-c614d879"],(function(e,s,i,o,l,n,a,t,u,r,d,c,F,b,p,A,x,U,S,E,g,_,h,N,m,f,v,C,y,j,k,I,T,R,P,M,L,w,V,D,H,O,B,q,W,z,G,J,K,Q,X,Y,Z,$,ee,se,ie,oe,le,ne,ae,te,ue,re,de,ce,Fe,be,pe,Ae,xe,Ue,Se,Ee,ge,_e,he,Ne,me){"use strict";const fe="_f2rlos";function ve({isRevealed:e,onPress:i}){const{pressProps:o}=p.usePress(i),l=b.useTranslationBundle("@oracle/oraclejet-preact").inputPassword_hidden();return s.jsx("button",Object.assign({"aria-label":l,role:"switch","aria-checked":!e,class:fe,tabIndex:0},o,{children:e?s.jsx(x.SvgIcoViewHide,{}):s.jsx(x.SvgIcoView,{})}))}const Ce=i.forwardRef((({assistiveText:e,autoComplete:i="off",autoFocus:F=!1,hasClearIcon:b,hasRevealToggle:p="always",helpSourceLink:A,helpSourceText:x,id:N,isDisabled:m,isReadonly:f,isRequired:v=!1,isRequiredShown:C,label:y,labelEdge:j,messages:k,placeholder:I,textAlign:T,userAssistanceDensity:R,value:P,onInput:M,onCommit:L},w)=>{const{currentCommitValue:V,dispatch:D}=_.useCurrentValueReducer({value:P}),H=o.useCallback((e=>{D({type:"input",payload:e.value}),null==M||M(e)}),[M]),O=o.useCallback((e=>{D({type:"commit",payload:e.value}),null==L||L(e)}),[L]),{isDisabled:B,isReadonly:q,labelEdge:W,textAlign:z,userAssistanceDensity:G}=n.useFormContext(),J=null!=m?m:B,K=null!=f?f:q,Q=null!=j?j:W,X=null!=T?T:z,Y=null!=R?R:G,{bool:Z,setFalse:$,setTrue:ee}=g.useToggle(!1),{enabledElementRef:se,focusProps:ie,isFocused:oe,readonlyElementRef:le}=l.useFocusableTextField({isDisabled:J,isReadonly:K,ref:w,onBlurWithin:$}),{hoverProps:ne,isHover:ae}=u.useHover({isDisabled:K||J||!1}),{formFieldContext:te,inputProps:ue,labelProps:re,textFieldProps:de,userAssistanceProps:ce}=t.useTextField({id:N,isDisabled:J,isFocused:oe,isReadonly:K,labelEdge:Q,messages:k,value:P}),Fe=o.useCallback((()=>{Z?$():ee()}),[Z]),be=J||"always"!==p?null:s.jsx(ve,{onPress:Fe,isRevealed:Z}),pe=o.useCallback((()=>{var e;null===(e=se.current)||void 0===e||e.focus(),null==H||H({previousValue:P,value:""})}),[M,P]),Ae=U.useClearIcon({clearIcon:s.jsx(E.ClearIcon,{onClick:pe}),display:b,hasValue:te.hasValue,isFocused:oe,isEnabled:!K&&!J,isHover:ae}),xe=S.beforeVNode(be,Ae),Ue="none"!==Q?s.jsx(r.Label,Object.assign({},re,{children:y})):void 0,Se={label:"none"!==Q?Ue:void 0,labelEdge:"none"!==Q?Q:void 0},Ee="none"===Q?y:void 0,ge=J||K?"efficient"!==Y?void 0:s.jsx(c.InlineUserAssistance,Object.assign({userAssistanceDensity:Y},ce)):s.jsx(c.InlineUserAssistance,Object.assign({assistiveText:e,helpSourceLink:A,helpSourceText:x,messages:k,isRequiredShown:C,userAssistanceDensity:Y},ce));if(K)return s.jsx(a.FormFieldContext.Provider,Object.assign({value:te},{children:s.jsx(d.ReadonlyTextField,Object.assign({role:"presentation",inlineUserAssistance:ge},Se,{children:s.jsx(d.ReadonlyTextFieldInput,{ariaLabel:Ee,ariaLabelledby:re.id,as:"input",autoFocus:F,elementRef:le,id:N,textAlign:X,type:"password",value:P,hasInsideLabel:void 0!==y&&"inside"===Q})}))}));const _e=s.jsx(h.TextFieldInput,Object.assign({ariaLabel:Ee,autoComplete:i,autoFocus:F,currentCommitValue:V,hasInsideLabel:void 0!==Ue&&"inside"===Q,inputRef:se,isRequired:v,onInput:H,onCommit:O,placeholder:I,textAlign:X,value:P,type:Z?"text":"password"},ue));return s.jsx(a.FormFieldContext.Provider,Object.assign({value:te},{children:s.jsx(d.TextField,Object.assign({endContent:xe,inlineUserAssistance:ge,mainContent:_e,onBlur:ie.onfocusout,onFocus:ie.onfocusin},de,Se,ne))}))}));e.InputPassword=Ce,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_InputPassword.js.map