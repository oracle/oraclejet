define(["exports","./tslib.es6-6b9f8039","preact/jsx-runtime",'css!./UNSAFE_AspectRatio.css',"./utils/UNSAFE_interpolations/dimensions","./utils/UNSAFE_mergeInterpolations","./utils/UNSAFE_classNames","./utils/UNSAFE_arrayUtils","./classNames-b2629d24","./utils/UNSAFE_size","./utils/UNSAFE_stringUtils","./stringUtils-a3acea83","./_curry1-b1038181","./_curry2-de7435f6","./_has-f8addc41"],(function(s,t,i,e,r,a,n,l,c,o,d,_,u,m,A){"use strict";const N=l.stringLiteralArray(["9/16","1/1","6/5","5/4","4/3","11/8","1.43/1","3/2","14/9","16/10","1.6180/1","5/3","16/9","1.85/1","1.9/1","2/1","2.2/1","64/21","2.4/1","2.414/1","2.76/1","32/9","18/5","4/1"]),U=l.stringLiteralArray(["maxWidth","minWidth","width"]),g=Array.from(U,(s=>r.dimensionInterpolations[s])),p=a.mergeInterpolations(g);s.AspectRatio=function(s){var{children:e,ratio:r="1/1"}=s,a=t.__rest(s,["children","ratio"]);const n=p(a),{class:l}=n,o=t.__rest(n,["class"]),d=Object.assign(Object.assign({},o),{"--oj-c-PRIVATE-DO-NOT-USE-aspect-ratio":r});return i.jsx("div",Object.assign({class:c.classNames(["_atcn2l",l]),style:d},{children:e}))},s.ratios=N,Object.defineProperty(s,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_AspectRatio.js.map