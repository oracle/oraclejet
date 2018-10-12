/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'ojs/ojkoshared'], function(oj)
{
/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @class
 * @since 6.0.0
 * @ignore
 * @hideconstructor
 */
function BindingProvider() { }

/**
 * @param {*} tagName
 * @param {*} preprocessor
 * @return {void}
 * @export
 */
BindingProvider.registerPreprocessor = function (tagName, preprocessor) {
  oj.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE.registerPreprocessor(tagName, preprocessor);
};

/**
 * Creates expression evaluator
 * @param {string} expressionText inner expression text not including any decorator characters
 * that identify the string as an expression
 * @return {Function} an evaluator function that will take binding (data) context as a parameter
 *
 */
BindingProvider.createBindingExpressionEvaluator = function (expressionText) {
    /* jslint evil:true */
    // eslint-disable-next-line no-new-func
  return new Function('$context', 'with($context){with($data||{}){return '
              + expressionText + ';}}'); // @HTMLUpdateOK; binding expression evaluation
};


return BindingProvider;

});