/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
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
 * @class AsyncDateTimeRangeValidator
 * @final
 * @implements AsyncValidator
 * @classdesc Constructs an AsyncDateTimeRangeValidator ensures the value provided is within a given range.
 * @param {Object=} options an object literal used to provide the following properties
 * @ojtsmodule
 * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
 * @ojtsimport {module: "ojvalidator-datetimerange", type: "AMD", importName: "DateTimeRangeValidator"}
 * @ojsignature [{target: "Type",
 *                value: "class AsyncDateTimeRangeValidator<V> implements AsyncValidator<V>"},
 *               {target: "Type",
 *                value: "DateTimeRangeValidator.ValidatorOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @see oj.DateTimeRangeValidator
 */

/**
 * Validates the minimum + maximum conditions. Returns a
 * Promise which resolves when valid and rejects which invalid.
 *
 * @param {string} value that is being validated
 * @returns {Promise.<void>}
 * @ojsignature {target: "Type",
 *               value: "(value: V): Promise<void>"}
 * @memberof AsyncDateTimeRangeValidator
 * @instance
 * @export
 * @method validate
 */

/**
 * A message to be used as hint.
 *
 * @memberof AsyncDateTimeRangeValidator
 * @instance
 * @export
 * @name hint
 * @type {Promise.<string|null>}
 */

// end of jsdoc

class AsyncDateTimeRangeValidator extends SyncValidatorAdapter {
    constructor(options) {
        super(options);
        this.options = options;
    }
    get hint() {
        return super._GetHint();
    }
    _InitLoadingPromise() {
        if (!this._loadingPromise) {
            this._loadingPromise = import('ojs/ojvalidator-datetimerange');
        }
    }
}

export default AsyncDateTimeRangeValidator;
