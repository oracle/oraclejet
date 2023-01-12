/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
class SyncValidatorAdapter {
    constructor(options) {
        this.options = options;
    }
    validate(value) {
        let self = this;
        if (!this._validator) {
            this._InitLoadingPromise();
            return this._loadingPromise.then(function (validatorConstructor) {
                self._validator = new validatorConstructor.default(self.options);
                try {
                    self._validator.validate(value);
                }
                catch (e) {
                    return Promise.reject(e);
                }
                return null;
            });
        }
        try {
            this._validator.validate(value);
        }
        catch (e) {
            return Promise.reject(e);
        }
        return Promise.resolve(null);
    }
    _GetHint() {
        let self = this;
        if (!this._validator) {
            this._InitLoadingPromise();
            return this._loadingPromise.then(function (validatorConstructor) {
                self._validator = new validatorConstructor.default(self.options);
                return self._validator.getHint();
            });
        }
        return Promise.resolve(self._validator.getHint());
    }
    _InitLoadingPromise() { }
}

export default SyncValidatorAdapter;
