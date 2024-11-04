/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";
/**
   * @license
   * Copyright (c) 2019 2024, Oracle and/or its affiliates.
   * Licensed under The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   *
   * Portions of this code are based on on JSEP Parser
   * @license
   * JavaScript Expression Parser (JSEP) 1.3.8
   * https://github.com/EricSmekens/jsep
   */const n=function(e){return e.type===r?e.name:e.value},t="Compound",r="Identifier",i="MemberExpression",d="Literal",o="CallExpression",a="UnaryExpression",x="BinaryExpression",c="LogicalExpression",s="ConditionalExpression",p="ArrayExpression",u="ObjectExpression",f="FunctionExpression",l="NewExpression",h="Property",A="TemplateLiteral",E="TemplateElement",C="SequenceExpression",y="ArrowFunctionExpression",g="ReturnStatement",v="BlockStatement";e.ARRAY_EXP=p,e.ARROW_EXP=y,e.BINARY_EXP=x,e.BLOCK_STATEMENT=v,e.CALL_EXP=o,e.COMPOUND=t,e.CONDITIONAL_EXP=s,e.ExpParser=function(){function e(e,n){const t=e.expr,r=t.length,i=[];for(;e.index<r;){b(e);const d=t.charCodeAt(e.index);if(d===Y||d===M)e.index++;else{const o=m(e);if(o)i.push(o);else if(e.index<r){if(d===n)break;oe('Unexpected "'+t.charAt(e.index)+'"',e.index)}}}return i}function b(e){for(var n=e.expr,t=n.charCodeAt(e.index);32===t||9===t||10===t||13===t;)t=n.charCodeAt(++e.index)}function m(e){const n=e.expr;let t,r,i=function(e){const n=e.expr;let t,r=n.charCodeAt(e.index);if(r===X){const i=e.index;if(e.index++,b(e),r=n.charCodeAt(e.index),r===j){e.index++;const n=k(e);if("=>"===n){const r=R(e);r||oe("Expected expression after "+n),t={type:y,params:[],body:r}}}t||(e.index=i)}return t}(e)||function(e){var n,t,r,i,d,o,a,x,c,s;if(o=T(e),t=k(e),!t)return o;d={value:t,prec:ee(t)},a="=>"===t?R(e):T(e),a||oe("Expected expression after "+t,e.index);i=[o,d,a],c=t,s=d.prec;for(;(t=k(e))&&0!==(r=ee(t,c,s));){for(d={value:t,prec:r},c=t,s=r;i.length>2&&r<=i[i.length-2].prec;)a=i.pop(),n=ne(t=i.pop().value,o=i.pop(),a,e),i.push(n);(n=T(e))||oe("Expected expression after "+c,e.index),i.push(d,n)}x=i.length-1,n=i[x];for(;x>1;)n=ne(i[x-1].value,i[x-2],n,e),x-=2;return n}(e);return b(e),n.charCodeAt(e.index)===q&&(e.index++,t=m(e),t||oe("Expected expression",e.index),b(e),n.charCodeAt(e.index)===D?(e.index++,r=m(e),r||oe("Expected expression",e.index),i={type:s,test:i,consequent:t,alternate:r}):oe("Expected :",e.index)),N(i),i}function k(e){var n=e.expr;b(e);for(var t=n.substr(e.index,Q),r=t.length;r>0;){if(z[t]&&(!ie(n.charCodeAt(e.index))||e.index+t.length<n.length&&!de(n.charCodeAt(e.index+t.length))))return e.index+=r,t;t=t.substr(0,--r)}return!1}function T(t){var i,o,x,c=t.expr;if(b(t),re(i=c.charCodeAt(t.index))||i===O)return function(e){var n,t,r=e.expr,i="";for(;re(r.charCodeAt(e.index));)i+=r.charAt(e.index++);if(r.charCodeAt(e.index)===O)for(i+=r.charAt(e.index++);re(r.charCodeAt(e.index));)i+=r.charAt(e.index++);if(n=r.charAt(e.index),"e"===n||"E"===n){for(i+=r.charAt(e.index++),"+"!==(n=r.charAt(e.index))&&"-"!==n||(i+=r.charAt(e.index++));re(r.charCodeAt(e.index));)i+=r.charAt(e.index++);re(r.charCodeAt(e.index-1))||oe("Expected exponent ("+i+r.charAt(e.index)+")",e.index)}t=r.charCodeAt(e.index),ie(t)?oe("Variable names cannot start with a number ("+i+r.charAt(e.index)+")",e.index):t===O&&oe("Unexpected period",e.index);return{type:d,value:parseFloat(i),raw:i}}(t);if(i===I||i===S||i===B)return U(t);if(i===V)return function(e){var t=e.expr;e.index++;var i,d=[],o=0,a=t.length;for(;e.index<a&&!i;){b(e);var x=t.charCodeAt(e.index);if(x===W)i=!0,e.index++;else if(x===M)e.index++,++o!==d.length&&oe("Unexpected token ,",e.index);else{var c=x===I||x===S?_(e):P(e);if(b(e),x=t.charCodeAt(e.index),c.type!==r||x!==M&&x!==W)if(x===D){e.index++;var s=e.writer;"_ko_property_writers"===n(c)&&(e.writer=1);try{d.push({type:h,key:c,value:m(e),shorthand:!1})}finally{e.writer=s}}else oe("Expected ':'. Found "+String.fromCharCode(x),e.index);else d.push({type:h,key:c,value:c,shorthand:!0})}}i||oe("Expected "+String.fromCharCode(W),e.index);return{type:u,properties:d}}(t);if(i===K)return function(n){const t=n.expr;let r=t.charCodeAt(n.index);if(r===K){const i={type:A,quasis:[],expressions:[]};let d="",o="",a=!1;const x=t.length,c=()=>i.quasis.push({type:E,value:{raw:o,cooked:d},tail:a});for(;n.index<x;){let x=t.charAt(++n.index);if("`"===x)return n.index+=1,a=!0,c(),i;if("$"===x&&"{"===t.charAt(n.index+1)){n.index+=2,c(),o="",d="";try{i.expressions.push(...e(n,W))}finally{r=t.charCodeAt(n.index),r!==W&&oe("Unclosed ${ in template literal",t)}}else if("\\"===x)switch(o+=x,x=t.charAt(++n.index),o+=x,x){case"n":d+="\n";break;case"r":d+="\r";break;case"t":d+="\t";break;case"b":d+="\b";break;case"f":d+="\f";break;case"v":d+="\v";break;default:d+=x}else d+=x,o+=x}n.index===x&&oe("Unclosed backtick ` in template literal",t)}return!1}(t);for(x=(o=c.substr(t.index,H)).length;x>0;){if(o in J&&(!ie(c.charCodeAt(t.index))||t.index+o.length<c.length&&!de(c.charCodeAt(t.index+o.length))))return t.index+=x,{type:a,operator:o,argument:T(t),prefix:!0};o=o.substr(0,--x)}var s=t.index,p=t.index+8;return"function"!==c.substring(s,p)||de(c.charCodeAt(p))?!(!ie(i)&&i!==X)&&U(t):(t.index=p,function(e){var n=e.expr;b(e);var t=n.charCodeAt(e.index);t!==X&&oe("Expected (,",e.index);e.index++;var r=w(e,j,!0);b(e),t=n.charCodeAt(e.index),t!==V&&oe("Expected {,",e.index);return{type:f,params:r,body:L(e)}}(t))}function _(e){for(var n,t=e.expr,r="",i=t.charAt(e.index++),o=!1,a=t.length;e.index<a;){if((n=t.charAt(e.index++))===i){o=!0;break}if("\\"===n)switch(n=t.charAt(e.index++)){case"n":r+="\n";break;case"r":r+="\r";break;case"t":r+="\t";break;case"b":r+="\b";break;case"f":r+="\f";break;case"v":r+="\v";break;default:r+=n}else r+=n}return o||oe('Unclosed quote after "'+r+'"',e.index),{type:d,value:r,raw:i+r+i}}function P(e,n){var t,i=e.expr,a=i.charCodeAt(e.index),x=e.index;ie(a)?e.index++:oe("Unexpected "+i.charAt(e.index),e.index);for(var c=i.length;e.index<c&&de(a=i.charCodeAt(e.index));)e.index++;if("new"===(t=i.slice(x,e.index))&&!n){b(e);var s=U(e,o);return s.type!==o&&oe("Expression of type: "+s.type+" not supported for constructor expression"),{type:l,callee:s.callee,arguments:s.arguments}}return Z.has(t)?{type:d,value:Z.get(t),raw:t}:{type:r,name:t}}function w(e,n,t){for(var r,i,d=e.expr,o=d.length,a=[],x=!1,c=0;e.index<o;){if(b(e),(r=d.charCodeAt(e.index))===n){x=!0,e.index++,n===j&&c&&c>=a.length&&oe("Unexpected token "+String.fromCharCode(n),e.index);break}if(r===M){if(e.index++,++c!==a.length)if(n===j)oe("Unexpected token ,",e.index);else if(n===F)for(var s=a.length;s<c;s++)a.push(null)}else(!(i=t?P(e):m(e))||a.length>c)&&oe("Expected comma",e.index),a.push(i)}return x||oe("Expected "+String.fromCharCode(n),e.index),a}function U(n,t){var r,d,a=n.expr;for(d=(r=a.charCodeAt(n.index))===X?function(n){n.index++;let t=e(n,j);if(n.expr.charCodeAt(n.index)===j)return n.index++,1===t.length?t[0]:!!t.length&&{type:C,expressions:t};oe("Unclosed (",n.index)}(n):r===I||r===S?_(n):r===B?function(e){return e.index++,{type:p,elements:w(e,F)}}(n):P(n),b(n),r=a.charCodeAt(n.index);r===O||r===B||r===X||te(n);){if(n.index++,r===O?(b(n),d={type:i,computed:!1,object:d,property:P(n,!0)}):r===q?(n.index++,b(n),d={type:i,computed:!1,optional:!0,object:d,property:P(n,!0)}):r===B?(d={type:i,computed:!0,object:d,property:m(n)},b(n),(r=a.charCodeAt(n.index))!==F&&oe("Unclosed [",n.index),n.index++):r===X&&(d={type:o,arguments:w(n,j),callee:d}),t===d.type)return d;b(n),r=a.charCodeAt(n.index)}return d}function L(e){b(e);const n=e.expr;let t=n.charCodeAt(e.index);e.index++,b(e);let r=!1;const i=e.index;"return"===n.substring(i,i+6)&&(r=!0,e.index+=6),b(e);const d=m(e);return b(e),t=n.charCodeAt(e.index),t===Y&&(e.index++,b(e)),t=n.charCodeAt(e.index),t!==W&&oe("Expected },",e.index),e.index++,{type:v,expr:n.substring(i,e.index-1),body:r?{type:g,argument:d}:d}}function R(e){const n=e.expr;let t;if(b(e),n.charCodeAt(e.index)===V)t=L(e);else{const r=e.index;b(e);const i=m(e);b(e),e.index++,t={type:v,expr:n.substring(r,e.index-1),body:{type:g,argument:i}}}return t}function N(e){e&&(Object.values(e).forEach(e=>{e&&"object"==typeof e&&N(e)}),"=>"===e.operator&&(e.type=y,e.params=e.left?[e.left]:null,e.body=e.right,e.params&&e.params[0].type===C&&(e.params=e.params[0].expressions),delete e.left,delete e.right,delete e.operator))}this.parse=function(n){var r=e({index:0,expr:n});return 1===r.length?r[0]:{type:t,body:r}};var O=46,M=44,I=39,S=34,X=40,j=41,B=91,F=93,q=63,Y=59,D=58,K=96,V=123,W=125;function $(e){return Object.keys(e).reduce(function(e,n){return Math.max(e,n.length)},0)}var G=!0,J={"-":G,"!":G,"~":G,"+":G,typeof:G},z={"=":1,"||":2,"??":2,"&&":3,"|":4,"^":5,"&":6,"==":7,"!=":7,"===":7,"!==":7,"<":8,">":8,"<=":8,">=":8,instanceof:8,"<<":9,">>":9,">>>":9,"+":10,"-":10,"*":11,"/":11,"%":11,"**":12,"=>":.1},H=$(J),Q=$(z),Z=new Map;function ee(e,n,t){const r=z[e]||0;return 12!==r||void 0===n||e!==n?r:.5*(t+13)}function ne(e,n,t,r){return"="!==e||r.writer||oe("Unexpected operator '='",r.index),{type:"||"===e||"&&"===e||"??"===e?c:x,operator:e,left:n,right:t}}function te(e){var n=e.expr;return n.charCodeAt(e.index)===q&&n.charCodeAt(e.index+1)===O&&!re(n.charCodeAt(e.index+2))}function re(e){return e>=48&&e<=57}function ie(e){return 36===e||95===e||e>=65&&e<=90||e>=97&&e<=122||e>=128&&!z[String.fromCharCode(e)]}function de(e){return 36===e||95===e||e>=65&&e<=90||e>=97&&e<=122||e>=48&&e<=57||e>=128&&!z[String.fromCharCode(e)]}function oe(e,n){var t=new Error(e+" at character "+n);throw t.index=n,t.description=e,t}Z.set("true",!0),Z.set("false",!1),Z.set("null",null),Z.set("undefined",void 0)},e.FUNCTION_EXP=f,e.IDENTIFIER=r,e.LITERAL=d,e.LOGICAL_EXP=c,e.MEMBER_EXP=i,e.NEW_EXP=l,e.OBJECT_EXP=u,e.PROPERTY=h,e.RETURN_STATEMENT=g,e.TEMPLATE_ELEMENT=E,e.TEMPLATE_LITERAL=A,e.UNARY_EXP=a,e.getKeyValue=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojexpparser.js.map