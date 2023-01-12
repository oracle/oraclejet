/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

  /**
   * @license
   * This is a forked version of moment-timezone.js
   * The MIT License (MIT)
   * Copyright (c) 2014 Tim Wood
   * https://github.com/moment/moment-timezone/blob/develop/LICENSE
   * @ignore
   */

  /*
   DESCRIPTION
   OraTimeZone object implements timeZone support.

   PRIVATE CLASSES
   <list of private classes defined - with one-line descriptions>

   NOTES
   <other useful comments, qualifications, etc.>

   */

  /**
   * @ignore
   */
  // eslint-disable-next-line no-unused-vars
  const OraTimeZone = (function () {
    var _zones = {};
    var instance;

    var _GMT_REGEXP = /^Etc\/GMT/i;
    var _SECOND = 1000;
    var _MINUTE = 60 * _SECOND;
    var _HOUR = 60 * _MINUTE;
    var _MIN_OFFSET = -14 * 60;
    var _MAX_OFFSET = +12 * 60;

    /** **********************************
     Unpacking
     ************************************/

    var __BASE60 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX';
    var _EPSILON = 0.000001; // Used to fix floating point rounding errors

    function _packBase60Fraction(fraction, precision) {
      var buffer = '.';
      var output = '';

      while (precision > 0) {
        // eslint-disable-next-line no-param-reassign
        precision -= 1;
        // eslint-disable-next-line no-param-reassign
        fraction *= 60;
        var current = Math.floor(fraction + _EPSILON);
        buffer += __BASE60[current];
        // eslint-disable-next-line no-param-reassign
        fraction -= current;

        // Only add buffer to output once we have a non-zero value.
        // This makes '.000' output '', and '.100' output '.1'
        if (current) {
          output += buffer;
          buffer = '';
        }
      }

      return output;
    }

    function _packBase60(number, precision) {
      var output = '';
      var absolute = Math.abs(number);
      var whole = Math.floor(absolute);
      var fraction = _packBase60Fraction(absolute - whole, Math.min(precision, 10));

      while (whole > 0) {
        output = __BASE60[whole % 60] + output;
        whole = Math.floor(whole / 60);
      }

      if (number < 0) {
        output = '-' + output;
      }

      if (output && fraction) {
        return output + fraction;
      }

      if (!fraction && output === '-') {
        return '0';
      }

      return output || fraction || '0';
    }

    /** **********************************
     Unpacking
     ************************************/
    function _charCodeToInt(charCode) {
      if (charCode > 96) {
        return charCode - 87;
      } else if (charCode > 64) {
        return charCode - 29;
      }
      return charCode - 48;
    }

    function _unpackBase60(string) {
      var i = 0;
      var parts = string.split('.');
      var whole = parts[0];
      var fractional = parts[1] || '';
      var multiplier = 1;
      var num;
      var out = 0;
      var sign = 1;

      // handle negative numbers
      if (string.charCodeAt(0) === 45) {
        i = 1;
        sign = -1;
      }
      // handle digits before the decimal
      for (; i < whole.length; i++) {
        num = _charCodeToInt(whole.charCodeAt(i));
        out = 60 * out + num;
      }
      // handle digits after the decimal
      for (i = 0; i < fractional.length; i++) {
        multiplier /= 60;
        num = _charCodeToInt(fractional.charCodeAt(i));
        out += num * multiplier;
      }
      return out * sign;
    }

    function _arrayToInt(array) {
      for (var i = 0; i < array.length; i++) {
        // eslint-disable-next-line no-param-reassign
        array[i] = _unpackBase60(array[i]);
      }
    }

    function _intToUntil(array, length) {
      for (var i = 0; i < length; i++) {
        // eslint-disable-next-line no-param-reassign
        array[i] = Math.round((array[i - 1] || 0) + array[i] * _MINUTE); // minutes to milliseconds
      }

      // eslint-disable-next-line no-param-reassign
      array[length - 1] = Infinity;
    }

    function _mapIndices(source, indices) {
      var out = [];
      for (var i = 0; i < indices.length; i++) {
        out[i] = source[indices[i]];
      }
      return out;
    }

    function _unpack(id, string) {
      var data = string.split('|');
      var offsets = data[1].split(' ');
      var indices = data[2].split('');
      var untils = data[3].split(' ');

      _arrayToInt(offsets);
      _arrayToInt(indices);
      _arrayToInt(untils);
      _intToUntil(untils, indices.length);
      return {
        name: id,
        abbrs: _mapIndices(data[0].split(' '), indices),
        offsets: _mapIndices(offsets, indices),
        untils: untils
      };
    }

    /** **********************************
     Exceptions
     ************************************/
    function _throwInvalidtimeZoneID(str) {
      var msg = 'invalid timeZone ID: ' + str;
      var error = new Error(msg);
      var errorInfo = {
        errorCode: 'invalidTimeZoneID',
        parameterMap: {
          timeZoneID: str
        }
      };
      error.errorInfo = errorInfo;
      throw error;
    }

    function _throwNonExistingTime() {
      var msg =
        'The input time does not exist because it falls during the transition to daylight saving time.';
      var error = new Error(msg);
      var errorInfo = {
        errorCode: 'nonExistingTime'
      };
      error.errorInfo = errorInfo;
      throw error;
    }

    function _throwMissingTimeZoneData() {
      var msg =
        "TimeZone data is missing. Please call require 'ojs/ojtimezonedata' in order to load the TimeZone data.";
      var error = new Error(msg);
      var errorInfo = {
        errorCode: 'missingTimeZoneData'
      };
      error.errorInfo = errorInfo;
      throw error;
    }

    /** **********************************
     Zone object
     ************************************/

    /**
     * @ignore
     * @constructor
     */
    function Zone(name, tzData) {
      var data = tzData.zones[name];
      // Try  if name matches Etc/GMT offset
      if (_GMT_REGEXP.test(name)) {
        var offset = name.replace(_GMT_REGEXP, '');
        var parts = offset.split(':');
        var hours = parseInt(parts[0], 10) * 60;
        var minutes = 0;

        if (isNaN(hours)) {
          return;
        }
        if (parts.length === 2) {
          minutes = parseInt(parts[1], 10);
          if (isNaN(minutes)) {
            return;
          }
        }
        hours += hours >= 0 ? minutes : -minutes;
        // offset must be between -14 and +12
        if (hours < _MIN_OFFSET || hours > _MAX_OFFSET) {
          return;
        }
        hours = _packBase60(hours, 1);
        var gmtName = name.replace('/etc//i', '').toUpperCase();
        data = gmtName + '|' + hours + '|0|';
      }
      if (data !== undefined) {
        this._set(_unpack(name, data));
      }
    }

    Zone.prototype = {
      _set: function (unpacked) {
        this.name = unpacked.name;
        this.abbrs = unpacked.abbrs;
        this.untils = unpacked.untils;
        this.offsets = unpacked.offsets;
      },
      parse: function (target, dst, ignoreDst, throwException) {
        var offsets = this.offsets;
        var untils = this.untils;
        var max = untils.length - 1;

        for (var i = 0; i < max; i++) {
          var offset = offsets[i];
          var offset1 = offsets[i + 1];
          var until = untils[i];
          var transitionTime = until - offset * _MINUTE;
          var gapTime = transitionTime + _HOUR;
          var dupTime = transitionTime - _HOUR;
          // Transition to dst:
          // Test if the time falls during the non existing hour when trasition to
          // dst happens. The missing hour is between transitionTime and gapTime.
          // If we are converting from source timezone to target timezone, we do not
          // throw an exception if target timezone falls in non existing window,
          // we just skip one hour, throwException is passed as false in this scenario.
          if (target >= transitionTime && target < gapTime && offset > offset1) {
            if (throwException === true) {
              _throwNonExistingTime();
            } else {
              return i + 1;
            }
          }
          // Test if the time falls during the duplicate hour when dst ends.
          // The duplicate hour is between dupTime and transitionTime.
          // if dst is set to true, return dst offset.
          if (target >= dupTime && target < transitionTime && offset < offset1) {
            if (dst) {
              return i;
            }
            return i + 1;
          }
          // Time is outside transtition times.
          if (target < until - offset * _MINUTE) {
            if (ignoreDst === false) {
              if (dst) {
                if (offset < offset1) {
                  return i;
                }
                return i + 1;
              }

              if (offset < offset1) {
                return i + 1;
              }
              return i;
            }
            return i;
          }
        }
        return max;
      },
      // user first need to call pasre to get the index, then pass it to the
      // 2 functions below
      abbr: function (idx) {
        return this.abbrs[idx];
      },
      ofset: function (idx) {
        var len = this.offsets.length;
        if (len === 0) {
          return 0;
        }
        if (idx >= 0 && idx < len) {
          return parseInt(this.offsets[idx], 10);
        }
        return parseInt(this.offsets[len - 1], 10);
      },
      len: function () {
        return this.offsets.length;
      }
    };

    /** **********************************
     timeZOne functions
     ************************************/
    function _normalizeName(name) {
      return (name || '').toLowerCase().replace(/\//g, '_');
    }

    function _addZone(name, tzData) {
      var zone = new Zone(name, tzData);
      var zoneName = _normalizeName(zone.name);
      _zones[zoneName] = zone;
    }

    function _getZone(name, tzData) {
      var zoneName = _normalizeName(name);
      if (_zones[zoneName] === undefined) {
        _addZone(name, tzData);
      }
      return _zones[_normalizeName(name)] || null;
    }

    function _init() {
      return {
        getZone: function (name, localeElements) {
          var tzData = localeElements.supplemental.timeZoneData;
          if (tzData === undefined) {
            _throwMissingTimeZoneData();
          }
          var s = _getZone(name, tzData);
          // try the links
          if (!s) {
            var link = tzData.links[name];
            if (link) {
              s = _getZone(link, tzData);
            }
          }
          if (!s) {
            _throwInvalidtimeZoneID(name);
          }
          return s;
        }
      };
    }

    return {
      /**
       * getInstance.
       * Returns the singleton instance of OraTimeZone class.
       * @ignore
       * @memberof OraTimeZone
       * @return {Object} The singleton OraTimeZone instance.
       */
      getInstance: function () {
        if (!instance) {
          instance = _init();
        }
        return instance;
      }
    };
  })();

  exports.OraTimeZone = OraTimeZone;

  Object.defineProperty(exports, '__esModule', { value: true });

});
