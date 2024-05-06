/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojconfig', 'ojs/ojcustomelement-utils'], function (exports, Config, ojcustomelementUtils) { 'use strict';

  /**
   * @namespace
   * @name ExpressionUtils
   * @ojtsmodule
   * @since 6.0.0
   * @hideconstructor
   */
  const ExpressionUtils = function () {};

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
    return ojcustomelementUtils.AttributeUtils.getExpressionInfo(expression);
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
    var factory = Config.getExpressionEvaluator();
    if (factory) {
      var evaluate = factory.createEvaluator(expressionText).evaluate;
      return function (context) {
        return evaluate([context]);
      };
    }

    var evaluator;
    try {
      /* jslint evil:true */
      // eslint-disable-next-line no-new-func
      evaluator = new Function('context', 'with(context){return ' + expressionText + ';}'); // @HTMLUpdateOK binding expression evaluation
    } catch (e) {
      throw new Error(e.message + ' in expression "' + expressionText + '"');
    }
    return evaluator;
  };

  const getExpressionInfo = ExpressionUtils.getExpressionInfo;
  const createGenericExpressionEvaluator = ExpressionUtils.createGenericExpressionEvaluator;

  exports.createGenericExpressionEvaluator = createGenericExpressionEvaluator;
  exports.getExpressionInfo = getExpressionInfo;

  Object.defineProperty(exports, '__esModule', { value: true });

});
