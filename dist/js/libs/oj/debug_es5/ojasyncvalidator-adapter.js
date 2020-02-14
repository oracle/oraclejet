/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define([], 
function()
{
  "use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var SyncValidatorAdapter =
/*#__PURE__*/
function () {
  function SyncValidatorAdapter(options) {
    _classCallCheck(this, SyncValidatorAdapter);

    this.options = options;
  }

  _createClass(SyncValidatorAdapter, [{
    key: "validate",
    value: function validate(value) {
      var self = this;

      if (!this._validator) {
        this._InitLoadingPromise();

        return this._loadingPromise.then(function (validatorConstructor) {
          self._validator = new validatorConstructor(self.options);

          try {
            self._validator.validate(value);
          } catch (e) {
            // if throws an Error then we should reject
            return Promise.reject(e);
          }

          return null;
        });
      }

      try {
        this._validator.validate(value);
      } catch (e) {
        // if throws an Error then we should reject
        return Promise.reject(e);
      }

      return Promise.resolve(null);
    }
  }, {
    key: "_GetHint",
    value: function _GetHint() {
      var self = this;

      if (!this._validator) {
        this._InitLoadingPromise();

        return this._loadingPromise.then(function (validatorConstructor) {
          self._validator = new validatorConstructor(self.options);
          return self._validator.getHint();
        });
      }

      return Promise.resolve(self._validator.getHint());
    }
  }, {
    key: "_InitLoadingPromise",
    value: function _InitLoadingPromise() {}
  }]);

  return SyncValidatorAdapter;
}();



  return SyncValidatorAdapter;
});