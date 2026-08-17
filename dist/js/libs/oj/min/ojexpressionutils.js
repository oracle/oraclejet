/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojconfig","ojs/ojcustomelement-utils","ojs/ojcspexpressionevaluator-internal"],function(e,r,t,n){"use strict";const o=function(){},a=o.getExpressionInfo=function(e){return t.AttributeUtils.getExpressionInfo(e)},s=o.createGenericExpressionEvaluator=function(e){var t=r.getExpressionEvaluator();if(t){var o=t.createEvaluator(e).evaluate;return function(e){return o([e])}}var a=r.getFallbackExpressionEvaluator();if(a)return a.createGenericExpressionEvaluator(e);var s=(new n.CspExpressionEvaluatorInternal).createEvaluator(e).evaluate;return function(e){return s([e])}};e.createGenericExpressionEvaluator=s,e.getExpressionInfo=a,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojexpressionutils.js.map