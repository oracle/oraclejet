define(['exports'], (function (exports) { 'use strict';

  /**
   * @license
   * Copyright (c) 2004 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * Licensed under The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
  /**
   * String utilities.
   */
  const _TRIM_ALL_RE = /^\s*|\s*$/g;
  /**
   * Returns true if the value is null or if the trimmed value is of zero length.
   *
   * @param {Object|string|null} value
   * @returns true if the string or Object (e.g., Array) is of zero length.
   */
  function isEmpty(value) {
      if (value === null) {
          return true;
      }
      var trimValue = trim(value);
      if (trimValue === null || trimValue === void 0 ? void 0 : trimValue.hasOwnProperty('length')) {
          return trimValue.length === 0;
      }
      return true;
  }
  /**
   * Returns true if the value is null, undefined or if the trimmed value is of zero length.
   *
   * @param {Object|string|null=} value
   * @returns true if the string or Object (e.g., Array) is of zero length.
   */
  function isEmptyOrUndefined(value) {
      if (value === undefined || isEmpty(value)) {
          return true;
      }
      return false;
  }
  /**
   * Test if an object is a string (either a string constant or a string object)
   * @param {Object|string|null} obj object to test
   * @return true if a string constant or string object
   */
  function isString(obj) {
      return obj !== null && ((typeof obj === 'string') || obj instanceof String);
  }
  /**
   * Remove leading and trailing whitespace
   * @param {Object|string|null} data to trim
   * @returns trimmed input
   */
  function trim(data) {
      if (isString(data)) {
          return data.replace(_TRIM_ALL_RE, '');
      }
      return data;
  }
  /**
   * Port of the Java String.hashCode method.
   * http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
   *
   * @param {string} str
   * @returns The hashCode of the string
   */
  function hashCode(str) {
      var hash = 0;
      if (str.length === 0) {
          return hash;
      }
      for (var i = 0; i < str.length; i++) {
          var c = str.charCodeAt(i);
          // eslint-disable-next-line no-bitwise
          hash = ((hash << 5) - hash) + c;
          // eslint-disable-next-line no-bitwise
          hash &= hash;
      }
      return hash;
  }

  exports.hashCode = hashCode;
  exports.isEmpty = isEmpty;
  exports.isEmptyOrUndefined = isEmptyOrUndefined;
  exports.isString = isString;
  exports.trim = trim;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
