/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import BindingProviderImpl from 'ojs/ojkoshared';

/**
 * Utility class with functions for interacting with the JET binding provider.
 * @namespace
 * @hideconstructor
 * @ojtsmodule
 *
 * @since 6.1.0
 */
const BindingProvider = function () {};

/**
 * Utility method to register a preprocessor for a specific tag name. The preprocessor
 * will be called with the DOM node matching the specified tag name and can modify, remove,
 * or replace node. Any new nodes must be inserted immediately before the DOM node, and if any
 * nodes were added or node was removed, the function must return an array of the new nodes
 * that are now in the document in place of node.
 * @param {string} tagName
 * @param {function(Node):Array<Node>} preprocessor
 * @return {void}
 * @ignore
 * @static
 */
BindingProvider.registerPreprocessor = function (tagName, preprocessor) {
  BindingProviderImpl.registerPreprocessor(tagName, preprocessor);
};

/**
 * Creates an expression evaluator.
 * @param {string} expressionText The inner expression text not including any decorator characters
 *                                that identifies the string as an expression.
 * @param {Object} binding context where the expression will be evaluated
 * @return {function(object):any} An evaluator function that will take binding (data) context as a parameter
 * @static
 */
BindingProvider.createBindingExpressionEvaluator = function (expressionText, bindingContext) {
  return BindingProviderImpl.createBindingExpressionEvaluator(expressionText, bindingContext);
};

const registerPreprocessor = BindingProvider.registerPreprocessor;
const createBindingExpressionEvaluator = BindingProvider.createBindingExpressionEvaluator;

export { createBindingExpressionEvaluator, registerPreprocessor };
