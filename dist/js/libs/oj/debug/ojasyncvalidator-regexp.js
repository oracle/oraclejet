/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'require', 'ojs/ojasyncvalidator-adapter'], 
function(oj, localRequire, SyncValidatorAdapter)
{
  "use strict";
class AsyncRegExpValidator extends SyncValidatorAdapter {
    constructor(options) {
        super(options);
        this.options = options;
    }
    get hint() {
        return super._GetHint();
    }
    _InitLoadingPromise() {
        if (!this._loadingPromise) {
            this._loadingPromise = oj.__getRequirePromise('./ojvalidator-regexp', localRequire);
        }
    }
}



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 8.0.0
 * @export
 * @class AsyncRegExpValidator
 * @final
 * @implements AsyncValidator
 * @classdesc Constructs an AsyncRegExpValidator that ensures the value matches the provided pattern.
 * @param {Object=} options an object literal used to provide the following properties
 * @ojtsmodule
 * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
 * @ojtsimport {module: "ojvalidator-regexp", type: "AMD", importName: "RegExpValidator"}
 * @ojsignature [{target: "Type",
 *                value: "class AsyncRegExpValidator<V> implements AsyncValidator<V>"},
 *               {target: "Type",
 *                value: "RegExpValidator.ValidatorOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @see oj.RegExpValidator
 */

/**
 * Validates value for matches using the regular expression provided by the pattern. This method
 * does not raise an error when value is the empty string or null; the method returns a Promise
 * which resolves indicating that the validation was successful. If the application wants the empty string to fail validation,
 * then the application should chain in the required validator (e.g., set required on the input).
 *
 * @param {string} value that is being validated
 * @returns {Promise.<void>}
 * @ojsignature {target: "Type",
 *               value: "(value: V): Promise<void>"}
 * @memberof AsyncRegExpValidator
 * @instance
 * @export
 * @method validate
 */

/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default
 * hint for this property.
 *
 * @memberof AsyncRegExpValidator
 * @instance
 * @export
 * @name hint
 * @type {Promise.<string|null>}
 */

/**
 * End of jsdoc
 */

  return AsyncRegExpValidator;
});