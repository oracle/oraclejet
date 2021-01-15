/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojconfig","ojs/ojcustomelement-utils"],function(e,t,r){"use strict";
/**
   * @license
   * Copyright (c) 2018 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */var n=function(){},o=n.getExpressionInfo=function(e){return r.AttributeUtils.getExpressionInfo(e)},i=n.createGenericExpressionEvaluator=function(e){var r,n=t.getExpressionEvaluator();if(n){var o=n.createEvaluator(e).evaluate;return function(e){return o([e])}}try{r=new Function("context","with(context){return "+e+";}")}catch(t){throw new Error(t.message+' in expression "'+e+'"')}return r};e.createGenericExpressionEvaluator=i,e.getExpressionInfo=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojexpressionutils.js.map