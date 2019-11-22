/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

 
define(['ojs/ojcore', 'ojs/ojfilter'], 
function(oj, Filter)
{
  "use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LengthFilter =
/*#__PURE__*/
function () {
  function LengthFilter(options) {
    _classCallCheck(this, LengthFilter);

    this.options = options;

    if (!options.max) {
      throw new Error("length filter's max option cannot be less than 1. max option is " + options.max);
    } // check that the max make sense, otherwise throw an error


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
          // if countBy is "codePoint", then count supplementary characters as length of one
          // For UTF-16, a "Unicode  surrogate pair" represents a single supplementary character.
          // The first (high) surrogate is a 16-bit code value in the range U+D800 to U+DBFF.
          // The second (low) surrogate is a 16-bit code value in the range U+DC00 to U+DFFF.
          // This code figures out if a charCode is a high or low surrogate and if so,
          // increments surrogateLength
          for (var i = 0; i < codeUnitLength; i++) {
            // eslint-disable-next-line no-bitwise
            if ((text.charCodeAt(i) & 0xF800) === 0xD800) {
              surrogateLength += 1;
            }
          } // e.g., if the string is two supplementary characters, codeUnitLength is 4, and the
          // surrogateLength is 4, so we will return two.
          // oj.Assert.assert(surrogateLength % 2 === 0,
          // 'the number of surrogate chars must be an even number.');


          length = codeUnitLength - surrogateLength / 2;
          break;

        case 'codeUnit':
        default:
          // Javascript's length function counts # of code units.
          // A supplementary character has a length of 2 code units.
          length = codeUnitLength;
      }

      return length;
    }
  }]);

  return LengthFilter;
}();

  return LengthFilter;
});