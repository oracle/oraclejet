/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore'], 
function(oj)
{
  "use strict";


/* jslint browser: true,devel:true*/

/**
 * Validator Contract
 * @ignore
 */

/**
 * The AsyncValidator interface is a duck-typing interface for creating
 * asynchronous validators that can be set on the EditableValue (aka JET form) components
 * that have the <code class="prettyprint">async-validators</code> attribute.
 * @example <caption>Create an Object that duck-types the AsyncValidator interface.
 * Bind the Object to the JET form component's async-validators attribute. The
 * validator's 'validate' method will be called when the user changes the input.</caption>
 *  self.asyncValidator1 = {
 *    // required validate method
 *    'validate': function(value) {
 *      return new Promise(function(resolve, reject) {
 *        var successful = someBackendMethod();
 *        if (successful) {
 *          resolve();
 *        } else {
 *          reject(new Error('The amount of purchase is too high. It is ' + value));
 *        }
 *      });
 *    },
 *    // optional hint attribute. hint shows up when user sets focus to input.
 *    'hint': new Promise(function (resolve, reject) {
 *      var formattedMaxPurchase = getSomeBackendFormattedMaxPurchase();
 *      resolve(maxPurchase + " is the maximum.");
 *    });
 *  };
 *  -- HTML --
 *  &lt;oj-input-text value="{{value1}}"
 *  async-validators="[[[asyncValidator1]]]">&lt;/oj-input-text>
 * @interface oj.AsyncValidator
 * @ojtsmodule
 * @ojsignature {target: "Type", value: "interface AsyncValidator<V>",
 *               genericParameters: [{"name": "V", "description": "Type of value to be validated"}]}
 * @export
 * @since 5.2.0
 *
 *
 */

/**
 * <p>A method that validates the value.
 * The function returns a Promise that resolves to void
 * if the validation passes or a Promise that rejects with an error if it fails. The error will
 * be shown on the component.
 * </p>
 * <p>
 * It is recommended that you show the value you are validating in the error message
 * because if the async operation takes a while, the user could be typing in a new
 * value when the error message comes back and might be confused what value the error is for.
 * </p>
 * <p>If you need to format the value for the error message, you
 * can use e.g. for number
 * <code class="prettyprint">new NumberConverter.IntlNumberConverter(converterOption)</code> to get the
 * converter instance, then call converter.format(value);
 * </p>
 *
 * @example <caption>Create an asynchronous validator and use it on an EditableValue
 * component. First, create an Object with 'validate' method that returns a Promise.
 * Then, bind it to the JET form component's async-validators attribute.</caption>
 *  self.asyncValidator1 = {
 *    'validate': function(value) {
 *      return new Promise(function(resolve, reject) {
 *        var successful = someBackendMethod();
 *        if (successful) {
 *          resolve();
 *        } else {
 *          //NOTE: if you need to format the value using a converter, you can call
 *          // e.g. for number
 *          // new NumberConverter.IntlNumberConverter(converterOption); to get the
 *          // converter instance, then call converter.format(value);
 *          reject(new Error('The amount of purchase ('+value+') is too high.'));
 *        }
 *      });
 *    }
 *  };
 *  -- HTML --
 *  &lt;oj-input-text value="{{value}}"
 *  async-validators="[[[asyncValidator1]]]">&lt;/oj-input-text>
 * @param {any} value to be validated
 * @return {Promise<void>} A Promise that resolves to nothing if validation passes or
 *  rejects with an Error if validation fails.
 * @method validate
 * @export
 * @expose
 * @ojsignature { target: "Type", value: "(value: V): Promise<void>" }
 * @memberof oj.AsyncValidator
 * @instance
 *
 */

/**
* hint is an optional attribute. It is a Promise that resolves to the hint string or null.
* @example <caption>Create an Object that duck-types the oj.AsyncValidator interface.
* Bind the Object to the JET form component's async-validators attribute. The
* validator's 'hint'  will be called when the user focuses on the input and it
* shows up as a notewindow giving the user a hint to what the validator will do.</caption>
*  self.asyncValidator1 = {
*    // required validate method
*    'validate': function(value) {
*      return new Promise(function(resolve, reject) {
*        var successful = someBackendMethod();
*        if (successful) {
*          resolve();
*        } else {
*          reject(new Error('The amount of purchase ' + value +' is too high.'));
*        }
*      });
*    },
*    // optional hint attribute. hint shows up when user tabs to input.
*    'hint': new Promise(function (resolve, reject) {
*      // resolve the credit score REST call, and figure out what
*      // is the maximum purchase dollar amount.
*      var formattedMaxPurchase = getFormattedMaxPurchase();
*      resolve('Your max purchase amount is ' + formattedMaxPurchase);
*    });
*  };
*  -- HTML --
*  &lt;oj-input-text value="{{value}}"
*  async-validators="[[[asyncValidator1]]]">&lt;/oj-input-text>
* @export
* @expose
* @memberof oj.AsyncValidator
* @instance
* @name hint
* @type {Promise<string|null>=}
*
*/

/**
* End of jsdoc
*/

});