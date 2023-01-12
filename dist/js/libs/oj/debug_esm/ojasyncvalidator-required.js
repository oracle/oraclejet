/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import SyncValidatorAdapter from 'ojs/ojasyncvalidator-adapter';

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 8.0.0
 * @export
 * @class AsyncRequiredValidator
 * @final
 * @implements AsyncValidator
 * @classdesc Constructs an AsyncRequiredValidator ensures that the value provided is not empty.
 * @param {Object=} options an object literal used to provide the following properties
 * @augments oj.AsyncValidator
 * @ojtsmodule
 * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
 * @ojtsimport {module: "ojvalidator-required", type: "AMD", importName: "RequiredValidator"}
 * @ojsignature [{target: "Type",
 *                value: "class AsyncRequiredValidator<V> implements AsyncValidator<V>"},
 *               {target: "Type",
 *                value: "RequiredValidator.ValidatorOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @see oj.RequiredValidator
 */

/**
 * Validates value to be non-empty
 *
 * @param {string} value that is being validated
 * @returns {Promise.<void>}
 * @throws {Error} when there is no match
 * @ojsignature {target: "Type",
 *               value: "(value: V): Promise<void>"}
 * @memberof AsyncRequiredValidator
 * @instance
 * @export
 * @method validate
 */

/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default
 * hint for this property.
 *
 * @memberof AsyncRequiredValidator
 * @instance
 * @export
 * @name hint
 * @type {Promise.<string|null>}
 */

// end of jsdoc

class AsyncRequiredValidator extends SyncValidatorAdapter {
    constructor(options) {
        super(options);
        this.options = options;
    }
    get hint() {
        return super._GetHint();
    }
    _InitLoadingPromise() {
        if (!this._loadingPromise) {
            this._loadingPromise = import('ojs/ojvalidator-required');
        }
    }
}

export default AsyncRequiredValidator;
