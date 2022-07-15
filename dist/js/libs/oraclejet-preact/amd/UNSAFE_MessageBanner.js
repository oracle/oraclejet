define(["exports","preact/jsx-runtime","./hooks/UNSAFE_useMessagesFocusManager","./UNSAFE_LiveRegion","./UNSAFE_Message","preact/hooks","./UNSAFE_Flex","./Flex-9b35c77b","./MessagesManager-ecd5a2ae","./MessageUtils-1eb80ddc",'module',"./utils/UNSAFE_classNames","./classNames-f6826ecb","./MessageCloseButton-231e3c7b","./MessageDetail-b4b813e9","preact","./MessageFormattingUtils-84e373f3","./utils/UNSAFE_getLocale","./utils/UNSAFE_stringUtils","./stringUtils-b43463af","./Message.types-a9665334","./utils/UNSAFE_arrayUtils","./MessageStartIcon-1713759b","./index-4eb38329","./UNSAFE_Icon","./Icon-98711b2d","./tslib.es6-15721dfa","./hooks/UNSAFE_useUser","./UNSAFE_Environment","./UNSAFE_Layer","preact/compat","./hooks/UNSAFE_useTheme","./index-8d9161f9","./MessageSummary-6ff59bf6","./MessageTimestamp-ac62b704","./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_size","./_curry1-28c749e4","./utils/UNSAFE_mergeInterpolations","./_curry2-2b58ec36","./_has-d3e8a510","./utils/UNSAFE_interpolations/boxalignment","./keys-20e26f7c","./utils/UNSAFE_interpolations/flexbox","./flexbox-f4630ff2","./utils/UNSAFE_interpolations/flexitem","./flexitem-aa368397","./utils/UNSAFE_logger","./utils/UNSAFE_soundUtils","./UNSAFE_TransitionGroup"],(function(e,s,n,t,a,i,o,r,l,c,u,g,d,f,m,F,b,U,h,E,M,_,S,v,x,p,A,N,R,y,k,j,C,I,T,B,L,O,P,w,z,W,D,G,H,K,q,J,Q,V){"use strict";const X={enter:[{effect:"expand",duration:"0.25s",direction:"height"}],exit:[{effect:"collapse",duration:"0.25s",direction:"height"}]},Y={close:"Close",navigationFromMessagesRegion:"Entering messages region. Press F6 to navigate back to prior focused element.",navigationToMessagesRegion:"Messages region has new messages. Press F6 to navigate to the most recent message region.",error:"Error",warning:"Warning",info:"Info",confirmation:"Confirmation"};e.MessageBanner=function({closeButtonRenderer:e,detailRendererKey:o,data:u,onClose:g,renderers:d,startAnimation:f,translations:m=Y,type:F="section"}){const b=i.useRef(new Map),U=i.useRef(null),h=i.useRef(null),[E,M]=i.useState(),[_,S]=i.useState(u.length>0),v=i.useRef(u.length),x=i.useRef(0);v.current=u.length;const p=i.useCallback((e=>s=>b.current.set(e,s)),[]);i.useImperativeHandle(h,(()=>({focus:()=>{var e;if(u.length){const s=u[0].key;return null===(e=b.current.get(s))||void 0===e||e.focus(),!0}return!1},contains:e=>{var s,n;return!(!u.length||!e)&&(null!==(n=null===(s=U.current)||void 0===s?void 0:s.contains(e))&&void 0!==n&&n)}})),[u,b]);const{controller:A,handlers:N}=n.useMessageFocusManager(h,{onFocus:i.useCallback((()=>{M(m.navigationFromMessagesRegion)}),[M])}),R=i.useCallback((e=>{null==g||g(e)}),[g]),y=i.useCallback(((e,s,n)=>{var t;const a=null==n?void 0:n.contains(document.activeElement);if(0===v.current)return S(!1),void(a&&A.restorePriorFocus());const i=s+1<u.length?s+1:s-1;if(i>-1&&a){const e=u[i].key;null===(t=b.current.get(e))||void 0===t||t.focus()}}),[A,u]);return i.useEffect((()=>{u.length?(S(!0),u.length>x.current&&M(m.navigationToMessagesRegion),A.prioritize()):M(""),x.current=u.length}),[u,A]),_||0!==u.length?s.jsx("div",Object.assign({ref:U,class:"oj-c-messagebanner",tabIndex:-1},N,{children:s.jsxs(r.Flex,Object.assign({direction:"column",gap:"section"===F?"1x":void 0},{children:[s.jsx(l.MessagesManager,Object.assign({animations:X,data:u,startAnimation:f,onMessageWillRemove:y},{children:({index:n,item:t})=>s.jsx(a.Message,{messageRef:p(t.key),item:t,closeButtonRenderer:e,detailRenderer:c.getRenderer(t,o,d),index:n,translations:m,type:F,onClose:R},t.key)})),s.jsx(t.LiveRegion,{children:E})]}))})):null},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_MessageBanner.js.map
