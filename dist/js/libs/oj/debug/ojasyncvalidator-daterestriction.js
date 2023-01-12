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
     * @class AsyncDateRestrictionValidator
     * @final
     * @implements AsyncValidator
     * @classdesc Constructs an AsyncDateRestrictionValidator that ensures the value provided is
     * not in a disabled entry of dayMetaData.
     * @param {Object=} options an object literal used to provide the following properties
     * @ojtsmodule
     * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
     * @ojtsimport {module: "ojvalidator-daterestriction", type: "AMD", importName: "DateRestrictionValidator"}
     * @ojsignature [{target: "Type",
     *                value: "class AsyncDateRestrictionValidator<V> implements AsyncValidator<V>"},
     *               {target: "Type",
     *                value: "DateRestrictionValidator.ValidatorOptions",
     *                for: "options", jsdocOverride: true}
     *              ]
     * @see oj.DateRestrictionValidator
     */

    /**
     * Validates whether the date provided is part of disabled date. Returns a
     * Promise which resolves when valid and rejects which invalid.
     *
     * @param {string} value that is being validated
     * @returns {Promise.<void>}
     * @ojsignature {target: "Type",
     *               value: "(value: V): Promise<void>"}
     * @memberof AsyncDateRestrictionValidator
     * @instance
     * @export
     * @method validate
     */

    /**
     * A message to be used as hint. As there exists no hint for AsyncDateRestrictionValidator, default is to return null.
     *
     * @memberof AsyncDateRestrictionValidator
     * @instance
     * @export
     * @name hint
     * @type {Promise.<string|null>}
     */

    // end of jsdoc

    class AsyncDateRestrictionValidator extends SyncValidatorAdapter {
        constructor(options) {
            super(options);
            this.options = options;
        }
        get hint() {
            return super._GetHint();
        }
        _InitLoadingPromise() {
            if (!this._loadingPromise) {
                this._loadingPromise = new Promise(function (resolve, reject) { require(['ojs/ojvalidator-daterestriction'], function (m) { resolve(_interopNamespace(m)); }, reject) });
            }
        }
    }

    return AsyncDateRestrictionValidator;

});
