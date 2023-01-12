/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['require', 'ojs/ojasyncvalidator-adapter'], function (require, SyncValidatorAdapter) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) { return e; } else {
            var n = {};
            if (e) {
                Object.keys(e).forEach(function (k) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                });
            }
            n['default'] = e;
            return n;
        }
    }

    SyncValidatorAdapter = SyncValidatorAdapter && Object.prototype.hasOwnProperty.call(SyncValidatorAdapter, 'default') ? SyncValidatorAdapter['default'] : SyncValidatorAdapter;

    /**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

    /* jslint browser: true,devel:true*/
    /**
     * @since 8.0.0
     * @export
     * @class AsyncLengthValidator
     * @final
     * @implements AsyncValidator
     * @classdesc Constructs an AsyncLengthValidator ensures the value entered is within a given length.
     * @param {Object=} options an object literal used to provide the following properties
     * @ojtsmodule
     * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
     * @ojtsimport {module: "ojvalidator-length", type: "AMD", importName: "LengthValidator"}
     * @ojsignature [{target: "Type",
     *                value: "class AsyncLengthValidator<V> implements AsyncValidator<V>"},
     *               {target: "Type",
     *                value: "LengthValidator.ValidatorOptions",
     *                for: "options", jsdocOverride: true}
     *              ]
     * @see oj.LengthValidator
     */

    /**
     * Validates the length of value is greater than minimum and/or less than maximum. Returns a
     * Promise which resolves when valid and rejects which invalid.
     *
     * @param {string} value that is being validated
     * @returns {Promise.<void>}
     * @ojsignature {target: "Type",
     *               value: "(value: V): Promise<void>"}
     * @memberof AsyncLengthValidator
     * @instance
     * @export
     * @method validate
     */

    /**
     * A message to be used as hint, when giving a hint about the expected length. There is no default
     * hint for this property.
     *
     * @memberof AsyncLengthValidator
     * @instance
     * @export
     * @name hint
     * @type {Promise.<string|null>}
     */

    // end of jsdoc

    class AsyncLengthValidator extends SyncValidatorAdapter {
        constructor(options) {
            super(options);
            this.options = options;
        }
        get hint() {
            return super._GetHint();
        }
        _InitLoadingPromise() {
            if (!this._loadingPromise) {
                this._loadingPromise = new Promise(function (resolve, reject) { require(['ojs/ojvalidator-length'], function (m) { resolve(_interopNamespace(m)); }, reject) });
            }
        }
    }

    return AsyncLengthValidator;

});
