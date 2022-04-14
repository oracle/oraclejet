define(['exports', 'preact', '@oracle/oraclejet-preact/utils/interpolations/dimensions', '@oracle/oraclejet-preact/utils/mergeInterpolations'], (function (exports, preact, dimensions, mergeInterpolations) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function _isPlaceholder(a) {
      return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
    }

    /**
     * Optimized internal one-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */

    function _curry1(fn) {
      return function f1(a) {
        if (arguments.length === 0 || _isPlaceholder(a)) {
          return f1;
        } else {
          return fn.apply(this, arguments);
        }
      };
    }

    function _has(prop, obj) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var toString = Object.prototype.toString;

    var _isArguments =
    /*#__PURE__*/
    function () {
      return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
        return toString.call(x) === '[object Arguments]';
      } : function _isArguments(x) {
        return _has('callee', x);
      };
    }();

    var hasEnumBug = !
    /*#__PURE__*/
    {
      toString: null
    }.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

    var hasArgsEnumBug =
    /*#__PURE__*/
    function () {

      return arguments.propertyIsEnumerable('length');
    }();

    var contains = function contains(list, item) {
      var idx = 0;

      while (idx < list.length) {
        if (list[idx] === item) {
          return true;
        }

        idx += 1;
      }

      return false;
    };
    /**
     * Returns a list containing the names of all the enumerable own properties of
     * the supplied object.
     * Note that the order of the output array is not guaranteed to be consistent
     * across different JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {k: v} -> [k]
     * @param {Object} obj The object to extract properties from
     * @return {Array} An array of the object's own properties.
     * @see R.keysIn, R.values
     * @example
     *
     *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
     */


    var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ?
    /*#__PURE__*/
    _curry1(function keys(obj) {
      return Object(obj) !== obj ? [] : Object.keys(obj);
    }) :
    /*#__PURE__*/
    _curry1(function keys(obj) {
      if (Object(obj) !== obj) {
        return [];
      }

      var prop, nIdx;
      var ks = [];

      var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

      for (prop in obj) {
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
          ks[ks.length] = prop;
        }
      }

      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;

        while (nIdx >= 0) {
          prop = nonEnumerableProps[nIdx];

          if (_has(prop, obj) && !contains(ks, prop)) {
            ks[ks.length] = prop;
          }

          nIdx -= 1;
        }
      }

      return ks;
    });
    var keys$1 = keys;

    const coerceArray = xs => Array.isArray(xs) ? xs : [xs]; // This will be themable in the future, but is hard coded for this initial release.  These are the Redwood values.


    const spaceStyles = {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '2.5rem'
    };
    const directionStyles = {
      row: "oj-flex-row-1r2r04x",
      column: "oj-flex-column-jvysn7"
    };
    const alignStyles = {
      baseline: "oj-flex-baseline-sn7vdu",
      center: "oj-flex-center-rpq1co",
      end: "oj-flex-end-1gkv0nk",
      start: "oj-flex-start-19zmlgk",
      inherit: "oj-flex-inherit-6cg1j7",
      initial: "oj-flex-initial-e73gk1",
      stretch: "oj-flex-stretch-pkf80b"
    };
    const justifyStyles = {
      center: "oj-flex-center-cz2ys",
      end: "oj-flex-end-vydaj5",
      start: "oj-flex-start-1bfjt7u",
      inherit: "oj-flex-inherit-1vx2ckm",
      initial: "oj-flex-initial-1kcnwum",
      around: "oj-flex-around-9r1l2k",
      between: "oj-flex-between-mpocno",
      evenly: "oj-flex-evenly-1iqacd2"
    };
    const wrapStyles = {
      nowrap: "oj-flex-nowrap-y59k8t",
      wrap: "oj-flex-wrap-fmpvou",
      reverse: "oj-flex-reverse-1b0qr8v",
      inherit: "oj-flex-inherit-1ij7eal",
      initial: "oj-flex-initial-3nzaji"
    };
    const styles = {
      direction: directionStyles,
      align: alignStyles,
      justify: justifyStyles,
      wrap: wrapStyles
    };
    const directions = keys$1(directionStyles);
    const aligns = keys$1(alignStyles);
    const justifies = keys$1(justifyStyles);
    const wraps = keys$1(wrapStyles);
    const spaces = keys$1(spaceStyles);
    const flexboxInterpolations = {
      direction: ({
        direction
      }) => direction === undefined ? {} : {
        class: directionStyles[direction]
      },
      align: ({
        align
      }) => align === undefined ? {} : {
        class: alignStyles[align]
      },
      justify: ({
        justify
      }) => justify === undefined ? {} : {
        class: justifyStyles[justify]
      },
      wrap: ({
        wrap
      }) => wrap === undefined ? {} : {
        class: wrapStyles[wrap]
      },
      flex: ({
        flex
      }) => flex === undefined ? {} : {
        flex
      },
      gap: ({
        gap
      }) => {
        if (gap === undefined) {
          return {};
        } else {
          const [rowGap, columnGap = rowGap] = coerceArray(gap);
          return {
            gap: `${spaceStyles[rowGap]} ${spaceStyles[columnGap]}`
          };
        }
      }
    };

    const baseStyles = "oj-flex-baseStyles-1fjajdl";
    const interpolations = [...Object.values(dimensions.dimensionInterpolations), ...Object.values(flexboxInterpolations)];
    const styleInterpolations = mergeInterpolations.mergeInterpolations(interpolations);
    const Flex = _a => {
      var {
        children
      } = _a,
          props = __rest(_a, ["children"]);

      const _b = styleInterpolations(props),
            {
        class: cls
      } = _b,
            styles = __rest(_b, ["class"]);

      return preact.h("div", {
        class: `${baseStyles} ${cls}`,
        style: styles
      }, children);
    };

    exports.Flex = Flex;
    exports.aligns = aligns;
    exports.directions = directions;
    exports.flexboxInterpolations = flexboxInterpolations;
    exports.justifies = justifies;
    exports.spaces = spaces;
    exports.styles = styles;
    exports.wraps = wraps;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
