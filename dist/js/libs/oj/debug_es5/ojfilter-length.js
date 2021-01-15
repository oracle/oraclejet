(function() {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function () {
  'use strict';

  var LengthFilter = /*#__PURE__*/function () {
    function LengthFilter(options) {
      _classCallCheck(this, LengthFilter);

      this.options = options;

      if (!options.max) {
        throw new Error("length filter's max option cannot be less than 1. max option is " + options.max);
      }

      if (isNaN(options.max)) {
        throw new Error("length filter's max option is not a number. max option is " + options.max);
      }

      if (options.max !== null && options.max < 1) {
        throw new Error("length filter's max option cannot be less than 1. max option is " + options.max);
      }

      options.countBy = options.countBy === undefined ? 'codePoint' : options.countBy;
    }

    _createClass(LengthFilter, [{
      key: "filter",
      value: function filter(currentRawValue, proposedRawValue) {
        var proposedValueLength = this.calcLength(proposedRawValue);
        return proposedValueLength <= this.options.max ? proposedRawValue : currentRawValue.slice(0, this.options.max);
      }
    }, {
      key: "calcLength",
      value: function calcLength(text) {
        var countBy = this.options.countBy;

        if (text == '' || text == null || text == undefined) {
          return 0;
        }

        var codeUnitLength = text.length;
        var length;
        var surrogateLength = 0;

        switch (countBy) {
          case 'codePoint':
            for (var i = 0; i < codeUnitLength; i++) {
              if ((text.charCodeAt(i) & 0xf800) === 0xd800) {
                surrogateLength += 1;
              }
            }

            length = codeUnitLength - surrogateLength / 2;
            break;

          case 'codeUnit':
          default:
            length = codeUnitLength;
        }

        return length;
      }
    }]);

    return LengthFilter;
  }();

  return LengthFilter;
});

}())