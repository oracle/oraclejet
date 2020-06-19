/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define([], 
function()
{
  "use strict";


class SyncValidatorAdapter {
    constructor(options) {
        this.options = options;
    }
    validate(value) {
        let self = this;
        if (!this._validator) {
            this._InitLoadingPromise();
            return this._loadingPromise.then(function (validatorConstructor) {
                self._validator = new validatorConstructor(self.options);
                try {
                    self._validator.validate(value);
                }
                catch (e) {
                    // if throws an Error then we should reject
                    return Promise.reject(e);
                }
                return null;
            });
        }
        try {
            this._validator.validate(value);
        }
        catch (e) {
            // if throws an Error then we should reject
            return Promise.reject(e);
        }
        return Promise.resolve(null);
    }
    _GetHint() {
        let self = this;
        if (!this._validator) {
            this._InitLoadingPromise();
            return this._loadingPromise.then(function (validatorConstructor) {
                self._validator = new validatorConstructor(self.options);
                return self._validator.getHint();
            });
        }
        return Promise.resolve(self._validator.getHint());
    }
    _InitLoadingPromise() { }
}


  return SyncValidatorAdapter;
});