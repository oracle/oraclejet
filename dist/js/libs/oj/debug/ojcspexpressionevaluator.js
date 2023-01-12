/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcspexpressionevaluator-internal', 'ojs/ojkoshared'], function (ojcspexpressionevaluatorInternal, ojkoshared) { 'use strict';

  /**
   * @license
   * Copyright (c) 2019 2023, Oracle and/or its affiliates.
   * Licensed under The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   *
   * @license
   * Based on the Expression Evaluator 2.0.0
   * https://github.com/donmccurdy/expression-eval
   * under MIT License
   * @ignore
   */

  /**
   * @class oj.CspExpressionEvaluator
   * @since 7.1.0
   * @ojshortdesc Object representing CSP-compliant evaluator.
   * @ojtsmodule
   *
   * @classdesc A class for creating CSP-compliant evaluators of JavaScript expressions
   * <p> The default JET expression evaluator cannot be used when Content Security Policy
   * prohibits unsafe evaluations. In order to replace the default evaluator with the JET CSP-compliant evaluator,
   * create and pass an instance of CspExpressionEvaluator class to the
   * <a href="oj.Config.html#setExpressionEvaluator">Config.setExpressionEvaluator()</a> method.
   * This method must be called before applying knockout bindings in the application for the first time.
   * </p>
   *
   * <p>Any extra context required for evaluating expressions can be passed to the object constructor using <code>globalScope</code> property.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * Config.setExpressionEvaluator(new CspExpressionEvaluator());
   * </code>
   * </pre>
   *
   * <h2 id="validExpressions">Expressions supported by the JET CspExpressionEvaluator
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#validExpressions"></a>
   * </h2>
   * <p>
   * <ul>
   *  <li>Identifiers, e.g. <code>[[value]]</code>.</li>
   *  <li>Members, e.g. <code>[[router.stateId]]</code>.</li>
   *  <li>Literals, e.g. <code>[['abc']]</code>.</li>
   *  <li>Function callbacks, e.g. <code>[[getColor('customer', id)]]</code>.</li>
   *  <li>Unary operators are limited to '-', '+', '~', '!' and '...', e.g. <code>[[-100]]</code>.</li>
   *  <li>Binary operators, e.g. <code>[[value + '.png']]</code>.</li>
   *  <li>Logical operators, e.g. <code>[[a && b]]</code> or <code>[[a || b]]</code>.</li>
   *  <li>Conditional or ternary operators, e.g. <code>[[test ? consequent : alternate]]</code>.</li>
   *  <li>Optional chaining operators, e.g. <code>[[a?.b]]</code>.</li>
   *  <li>Array literals, e.g. <code>[a, b, c]</code>.</li>
   *  <li>Object literals, e.g. <code>[[{'selection_state': selected}]]</code>.</li>
   *  <li>Functions are limited to a single statement, e.g. <code>[[function(){return 'abc'}]]</code>.</li>
   *  <li>'new' operator such as <code>'new Object()'</code></li>
   *  <li>Regular expressions in the form of explicit RegExp objects such as <code>[[testString.match(new RegExp('abc', 'i'))]]</code></li>
   *</ul>
   * <h2 id="invalidExpressions">Expression limitations:
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#invalidExpressions"></a>
   * </h2>
   * <p> The following code is not supported in expressions:
   * <ul>
   *  <li>Arrow functions such as <code>'[1, 2, 3].map(item => item + 1)'</code></li>
   *  <li>Assignment operators of any types such as <code>'='</code> or <code>'+='</code> or <code>'|='</code></li>
   *  <li>Blocks of code such as <code>'if (...){}'</code></li>
   *  <li>Comma operator (,) such as <code>'(expr1, expr2)'</code></li>
   *  <li>Exponentiation (**) such as <code>' 3 ** 4'</code></li>
   *  <li>in operator such as <code>'prop in testObject'</code></li>
   *  <li>Increment/decrement operators such as <code>'x++'</code> or <code>'x--'</code></li>
   *  <li>Inline regular expressions such as <code>'testString.match(/abc/i)'</code></li>
   *  <li>Instanceof or typeof operators such as <code>'date instanceof Date'</code></li>
   *  <li>Nullish coalescing operator (??) such as <code>'value ?? "default value"'</code></li>
   *  <li>Spread operator (...) such as <code>'sum(...arrayValue)'</code></li>
   * <ul>
   * </h2>
   *
   * @param {Object} options
   * @param {any=} options.globalScope optional additional scope required for evaluating expressions.
   * The additional scope will be used to resolve the variables if they are not defined in the $data or $context.
   * <pre class="prettyprint"><code>Config.setExpressionEvaluator(new CspExpressionEvaluator({globalScope:extraScope}));</code></pre>
   * @constructor
   * @final
   * @export
   */
  // eslint-disable-next-line no-unused-vars
  const CspExpressionEvaluator = function (options) {
    var _evaluatorInternal = new ojcspexpressionevaluatorInternal.CspExpressionEvaluatorInternal(options);

    /**
     * Creates expression evaluator
     * @param {string} expressionText expression associated  with the returned evaluator
     * @return {Object} an object with the 'evaluate' key referencing a function that
     * will return the result of evaluation. The function will take an array of scoping contexts ordered from the
     * most specific to the least specific
     * @ignore
     */
    this.createEvaluator = function (expressionText) {
      return _evaluatorInternal.createEvaluator(expressionText);
    };

    /**
     * @param {object} ast an AST node
     * @param {object} context a context object to apply on expressions
     * @ignore
     */
    this.evaluate = function (ast, context) {
      return _evaluatorInternal.evaluate(ast, context);
    };
  };

  return CspExpressionEvaluator;

});
