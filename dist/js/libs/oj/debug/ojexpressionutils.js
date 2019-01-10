/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore'], function(oj)
{
/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @namespace
 * @name ExpressionUtils
 * @ojtsmodule
 * @since 6.0.0
 * @hideconstructor
 */
function ExpressionUtils() { }

/**
 * Analyzes a string for a possible JET expression
 * @param {string} expression a string to be analyzed
 * @return {{expr: (null|string), downstreamOnly: boolean}} an object with two keys:
 * use the 'expr' key to get the expression text, and the 'downstreamOnly' to get a boolean
 * indicating whether the expression is downstream-only, i.e. the flag will be true if
 * the expression should not be used for writeback
 * @memberof! ExpressionUtils
 * @static
 */
ExpressionUtils.getExpressionInfo = function (expression) {
  return oj.__AttributeUtils.getExpressionInfo(expression);
};

/**
 * Creates generic expression evaluator
 * @param {string} expressionText inner expression text not including any decorator characters
 * that identify the string as an expression
 * @return {Function} an evaluator function that will take data context as a parameter
 * @ojsignature {target: "Type", for: "returns",
 *              value: "(context: any)=> any"}
 * @memberof! ExpressionUtils
 * @static
 */
ExpressionUtils.createGenericExpressionEvaluator = function (expressionText) {
    /* jslint evil:true */
    // eslint-disable-next-line no-new-func
  return new Function('context', 'with(context){return '
              + expressionText + ';}'); // @HTMLUpdateOK; binding expression evaluation
};


return ExpressionUtils;

});