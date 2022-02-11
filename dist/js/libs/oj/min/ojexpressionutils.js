/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojconfig","ojs/ojcustomelement-utils"],function(e,t,n){"use strict";const r=function(){},o=r.getExpressionInfo=function(e){return n.AttributeUtils.getExpressionInfo(e)},s=r.createGenericExpressionEvaluator=function(e){var n,r=t.getExpressionEvaluator();if(r){var o=r.createEvaluator(e).evaluate;return function(e){return o([e])}}try{n=new Function("context","with(context){return "+e+";}")}catch(t){throw new Error(t.message+' in expression "'+e+'"')}return n};e.createGenericExpressionEvaluator=s,e.getExpressionInfo=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojexpressionutils.js.map