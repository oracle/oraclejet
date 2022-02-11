/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { useRef, useState, useMemo, useEffect, useCallback, useImperativeHandle, useContext } from 'preact/hooks';
import { createRef, h, cloneElement, Component, Fragment, createContext } from 'preact';
import { startAnimation } from 'ojs/ojanimation';
import { getTranslatedString } from 'ojs/ojtranslation';
import Context from 'ojs/ojcontext';
import { withDataProvider } from 'ojs/ojdataproviderhandler';
import { Root, customElement } from 'ojs/ojvcomponent';
import 'ojs/ojbutton';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const componentsMap = new Map();
const componentsOrder = [];
const priorFocusCache = new Map();
let hasDocumentListener = false;
let priorFocusedElement;
let currentFocusedMessage;
/**
 * Handles KeyDown event in the document element during the capture phase.
 *
 * @param event The keydown event object
 */
function handleDocumentKeyDownCapture(event) {
    // Do nothing if any of the following is true:
    // 1. No components are registered
    // 2. Pressed key is not F6
    // 3. Event is defaultPrevented
    if (componentsMap.size === 0 ||
        event.key !== 'F6' ||
        event.defaultPrevented) {
        return;
    }
    // Try cycling focus through the messages and if that fails
    // set the focus to the prior focused element.
    if (!cycleFocusThroughMessages(event)) {
        currentFocusedMessage && togglePreviousFocus(currentFocusedMessage, event);
    }
}
/**
 * Handles the blur event captured on the document
 * @param event Blur event object
 */
function handleDocumentBlurCapture(event) {
    priorFocusedElement = event.target;
}
/**
 * Handles the keydown event in the component
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param event The keydown event object
 */
function handleComponentKeyDown(id, event) {
    // Ignore the call if the comp is not registered anymore or event default is prevented
    if (!componentsMap.has(id) || event.defaultPrevented) {
        return;
    }
    // Additional checks for keydown event and recognized keys
    if (event.type === 'keydown' && ['Escape'].includes(event.key)) {
        // toggle focus to the previously focused element
        togglePreviousFocus(id, event);
    }
}
/**
 * Handles the focus event in the component
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param event The focus event object
 */
function handleComponentFocus(id, event) {
    var _a;
    // Ignore the call if the comp is not registered anymore or event default is prevented
    if (!componentsMap.has(id) || event.defaultPrevented) {
        return;
    }
    // Store the id of the current focused message
    currentFocusedMessage = id;
    // Track previous focus if the priorFocused element is not a part of this or any other
    // registered component
    const [, callbacks] = componentsMap.get(id);
    if (priorFocusedElement && !isPartOfRegisteredMessages(priorFocusedElement)) {
        priorFocusCache.set(id, priorFocusedElement);
        // since the focus moved to this component from outside, call the
        // onFocus callbacks if available
        (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onFocus) === null || _a === void 0 ? void 0 : _a.call(callbacks);
    }
}
/**
 * Handles the blur event in the component
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param event The focus event object
 */
function handleComponentBlur(id, event) {
    // Ignore the call if the comp is not registered anymore or event default is prevented
    if (!componentsMap.has(id) || event.defaultPrevented) {
        return;
    }
    // reset the current focus message ID
    currentFocusedMessage = undefined;
}
/**
 * Cycles the focus through the registered messages component from the previous message of current focused
 * message to the top of the hierarchy.
 *
 * @param event The event that initiated this action
 * @returns boolean indicating the result of this action
 */
function cycleFocusThroughMessages(event) {
    var _a, _b, _c;
    // At this point, we need to focus the previous message from the current focused
    // message
    const nextPosition = indexOfOrDefaultTo(componentsOrder, currentFocusedMessage, componentsOrder.length) - 1;
    for (let i = nextPosition; i > -1; i--) {
        const id = componentsOrder[i];
        const [ref] = (_a = componentsMap.get(id)) !== null && _a !== void 0 ? _a : [];
        if ((_c = (_b = ref === null || ref === void 0 ? void 0 : ref.current) === null || _b === void 0 ? void 0 : _b.focus) === null || _c === void 0 ? void 0 : _c.call(_b)) {
            // prevent default action as the event has transferred focus
            event.preventDefault();
            // Focus is set, so break the loop
            return true;
        }
    }
    return false;
}
/**
 * Checks if the provided element is a part of any of the registered messages
 *
 * @param element The candidate element
 * @returns true if is inside any of the registered messages
 */
function isPartOfRegisteredMessages(element) {
    var _a;
    for (const [ref] of componentsMap.values()) {
        if ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.contains(element)) {
            return true;
        }
    }
    return false;
}
/**
 * Finds the index of the item in the array, if it does not exist returns the
 * default value instead
 *
 * @param arr The array to perform the search
 * @param search The item to be searched
 * @param defaultIndex The default value if the item is not found
 * @returns The index of the item or the default value
 */
function indexOfOrDefaultTo(arr, search, defaultIndex = -1) {
    const index = arr.indexOf(search);
    if (index !== -1)
        return index;
    return defaultIndex;
}
/**
 * Traverses through the priorFocusCache to fetch the last focused
 * element outside of the messages region.
 *
 * @param id The current focused message's ID
 * @returns The closest prior focused element, null if not found
 */
function getClosestPriorFocusedElement(id) {
    // F6 navigation cycles through messages in reverse order
    // so to get the closest prior focused element we need to
    // traverse in natural order from the current message
    const index = componentsOrder.indexOf(id);
    for (let i = index; i < componentsOrder.length; i++) {
        if (priorFocusCache.has(componentsOrder[i])) {
            return priorFocusCache.get(componentsOrder[i]);
        }
    }
    // No prior cache found, so return null
    return null;
}
/**
 * Adds the component to the internal members.
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param ref A ref handle to the focusable component
 * @param callbacks Optional callbacks
 */
function addComponent(id, ref, callbacks) {
    componentsMap.set(id, [ref, callbacks]);
    componentsOrder.push(id);
}
/**
 * Removes the component from the internal members
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 */
function removeComponent(id) {
    if (!componentsMap.has(id)) {
        return;
    }
    componentsMap.delete(id);
    componentsOrder.splice(componentsOrder.indexOf(id), 1);
}
/**
 * Clears the priorFocusCache of the specified component
 *
 * @param id The id of the component whose cache is to be cleared
 */
function clearFocusCache(id) {
    priorFocusCache.delete(id);
}
/**
 * Adds event listeners to the document element
 */
function addDocumentListeners() {
    // Add the events in capture phase, as we do not want this to be stopped by the elements
    // in the DOM tree
    document.documentElement.addEventListener('keydown', handleDocumentKeyDownCapture, true);
    document.documentElement.addEventListener('blur', handleDocumentBlurCapture, true);
    hasDocumentListener = true;
}
/**
 * Removes event listeners from the document element
 */
function removeDocumentListeners() {
    document.documentElement.removeEventListener('keydown', handleDocumentKeyDownCapture, true);
    document.documentElement.removeEventListener('blur', handleDocumentBlurCapture, true);
    hasDocumentListener = false;
}
/**
 * Registers a component for its focus to be managed.
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param ref A ref handle to the focusable component
 * @param callbacks Optional callbacks
 *
 * @returns An object focus event listener and keydown event listener
 */
function register(id, ref, callbacks) {
    if (!hasDocumentListener) {
        addDocumentListeners();
    }
    addComponent(id, ref, callbacks);
    return {
        onfocusin: (event) => handleComponentFocus(id, event),
        onfocusout: (event) => handleComponentBlur(id, event),
        onKeyDown: (event) => handleComponentKeyDown(id, event)
    };
}
/**
 * Focuses the element which was focused prior to the passed component.
 * @param id A unique symbol that ids the component to be registered for managing focus
 * @param event The event that initiated the focus transfer. The event will be default prevented if the focus
 *              is transferred successfully.
 * @returns true, if focus is restored. false otherwise.
 */
function togglePreviousFocus(id, event) {
    const target = getClosestPriorFocusedElement(id);
    if (target && document.body.contains(target)) {
        target.focus();
        // As the prior focus is restored, empty the focus cache
        priorFocusCache.clear();
        event === null || event === void 0 ? void 0 : event.preventDefault();
        return true;
    }
    // Prior focused element does not exist or
    // Element does not exist in DOM.
    return false;
}
/**
 * Unregisters a component from focus management
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 */
function unregister(id) {
    removeComponent(id);
    clearFocusCache(id);
    if (hasDocumentListener && componentsMap.size === 0) {
        // no component is registered, so remove the document listeners
        removeDocumentListeners();
    }
}
/**
 * Moves the priority of the component with the specified id
 *
 * @param id A unique symbol that ids the component to be registered for managing focus
 */
function prioritize(id) {
    if (!componentsMap.has(id)) {
        // Do nothing if the component is not registered
        return;
    }
    // Remove and add the component with the same ref
    // to move it in the priority queue
    const [ref, callbacks] = componentsMap.get(id);
    removeComponent(id);
    addComponent(id, ref, callbacks);
}
/**
 * The focus manager object
 */
const messagesFocusManager = {
    prioritize,
    register,
    togglePreviousFocus,
    unregister
};
/**
 * A custom hook that handles focus management for the messages component.
 * @param ref The custom ref handle for the component
 * @param callbacks Optional callbacks
 * @returns The handlers and a controller
 */
function useMessageFocusManager(ref, callbacks) {
    const id = useRef(Symbol());
    const focusManager = useRef(messagesFocusManager);
    const [handlers, setHandlers] = useState({});
    const controller = useMemo(() => ({
        prioritize: () => focusManager.current.prioritize(id.current),
        restorePriorFocus: () => focusManager.current.togglePreviousFocus(id.current)
    }), [focusManager.current, id.current]);
    // Register handlers for focus management
    useEffect(() => {
        setHandlers(focusManager.current.register(id.current, ref, callbacks));
        return () => focusManager.current.unregister(id.current);
    }, []);
    return {
        handlers,
        controller
    };
}

/**
 * Creates an array of refs that can be mutated
 * @param length The number of refs needed. When updated, a new set of refs will be created
 * @returns An Array of refs
 */
function useMutableRefArray(length = 0) {
    return useMemo(() => new Array(length).fill(undefined).map(() => createRef()), [length]);
}

const offScreenStyle = "oj-live-region-offScreenStyle-o1xwg2xa";
/**
 * A helper component that renders an aria-live region
 *
 * TODO: Create a more centralized component that can handle aria-live region for
 * the whole application and use context api to communicate
 */

function LiveRegion({
  atomic = 'false',
  text = '',
  timeout = 100,
  type = 'polite'
}) {
  const ariaLiveText = useLiveText(text, timeout);
  return h("span", {
    "aria-live": type,
    "aria-atomic": atomic,
    class: offScreenStyle
  }, ariaLiveText);
}
/**
 * A custom hook for handling the aria-live region
 *
 * @param text The aria-live text to use
 * @param timeout The timeout for setting the aria-live text async
 * @returns The aria-live text
 */


function useLiveText(text, timeout) {
  const [liveText, setLiveText] = useState();
  const updateText = useCallback(() => setLiveText(text), [text]);
  const updateTextAsync = useCallback(() => setTimeout(updateText, timeout), [updateText, timeout]);
  useEffect(() => {
    const timeoutId = updateTextAsync();
    return () => clearTimeout(timeoutId);
  }, [updateTextAsync]);
  return liveText;
}

// By default TS will infer `string[]` for an array so use this function to
// extract string literal unions. This will automatically type your array.
// Example:
// const dimensions1 = ["height", "width"]; // dimensions1 type is string[].
// const dimensions = stringLiteralArray(["height", "width"]);
// dimensions type is ("height"|"width")[] (an array that can only have "height" and "width" in it)
const stringLiteralArray = (xs) => xs;

const is = (Ctor) => (val) => (val != null && val.constructor === Ctor) || val instanceof Ctor;
const isNumber = is(Number);
const isString = is(String);
const isNumeral = (n) => !isNaN(parseFloat(n)) && !isNaN(n - 0);
const isZero = (n) => n === 0 || n === "0";
const units = stringLiteralArray(["px", "%", "em", "rem", "vh", "vw"]);
const endsWithUnitRegExp = new RegExp(`(${units.join("|")})$`);
const hasUnit = (val) => isString(val) && endsWithUnitRegExp.test(val);
const toUnit = (unit) => (n) => isZero(n) || hasUnit(n) || !isNumeral(n) ? n : n + unit;
const px = toUnit("px");

/**
 * A function for coercing number or string input into a CSS dimension value where:
 *
 * - `0` is treated as a unitless value
 * - Numbers greater than `0` and less than or equal to `1` are converted to a percentage (e.g. `1/2` becomes "50%")
 * - Numbers greater than `1` are converted to pixels
 * - Strings can be used for other CSS values (e.g. `"50vw"` or `"1rem"`)
 *
 * @param {string | number } n - a value to coerce
 * @returns {string | number}
 */
const size = (n) => !isNumber(n) || n > 1 ? px(n) : n === 0 ? "0" : `${n * 100}%`;
//export default size;

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

/**
 * Checks if the input value is `null` or `undefined`.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Type
 * @sig * -> Boolean
 * @param {*} x The value to test.
 * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
 * @example
 *
 *      R.isNil(null); //=> true
 *      R.isNil(undefined); //=> true
 *      R.isNil(0); //=> false
 *      R.isNil([]); //=> false
 */

var isNil =
/*#__PURE__*/
_curry1(function isNil(x) {
  return x == null;
});

var isNil$1 = isNil;

// if we don't run this array through this stringLiteralArray function, then the type is string[].
// After running it through this stringLiteralArray function its type changes to be
// ("height" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "width")[].
// The typed dimensions array can be exported to show options in a test or storybook.
const dimensions = stringLiteralArray([
    "height",
    "maxHeight",
    "maxWidth",
    "minHeight",
    "minWidth",
    "width",
]);
// Pick<DimensionProps, Key> Constructs a type by picking the set of properties Keys (string literal or union
// of string literals ) from DimensionProps.
// TODO: Question for Urban. 
// We changed this from Props to DimensionProps since it made the code clearer to us, but now
// we see that in index.ts we have export {Props as DimensionProps}. Why not just call it DimensionProps here?
// TODO: This <Key extends Dimension> doesn't seem correct. Key could have a Key that isn't in DimensionProps, then we can't pick from it.
// This is the dimension interpolation function. pass in a key and it passes back out
// an object with the key and it passes out a function that takes the props.
// then when this returned function is called with a prop, it will pass out
// an object with key/size(prop);
const propToSize = (key) => (props) => {
    // Storing a local copy of the prop for proper type guarding in the ternary (conditional) below.
    const val = props[key];
    // casting val as Size because we know it can't be undefined
    return isNil$1(props[key]) ? {} : { [key]: size(val) };
};
// A map of dimension style props to size style interpolation functions.
// Since TS infers the return type of `reduce` from the `initialValue`,
// we need to manually write the type so is isn't cast as `{}` which is effectively `any`.
const interpolations = dimensions.reduce((acc, key) => Object.assign(acc, { [key]: propToSize(key) }), 
// The return type will be an object with the keys of our dimensions and a corresponding function that requires
// an object with that same dimension key and will return an empty object or the non-null CSS property and value.
{});

/**
 * Given a set of string arguments, join the values together into a string with
 * spaces. Falsey values will be omitted,
 * e.g. classNames(['A', 'B', false, 'D', false]) --> 'A B D'
 * @param values The set of values
 * @returns The values joined as a string, or blank string if no values
 */
function classNames(values) {
    return values.filter(Boolean).join(' ');
}

function _isPlaceholder$1(a) {
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

function _curry1$1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder$1(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;

      case 1:
        return _isPlaceholder$1(a) ? f2 : _curry1$1(function (_b) {
          return fn(a, _b);
        });

      default:
        return _isPlaceholder$1(a) && _isPlaceholder$1(b) ? f2 : _isPlaceholder$1(a) ? _curry1$1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder$1(b) ? _curry1$1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;

      case 1:
        return _isPlaceholder$1(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });

      case 2:
        return _isPlaceholder$1(a) && _isPlaceholder$1(b) ? f3 : _isPlaceholder$1(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder$1(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1$1(function (_c) {
          return fn(a, b, _c);
        });

      default:
        return _isPlaceholder$1(a) && _isPlaceholder$1(b) && _isPlaceholder$1(c) ? f3 : _isPlaceholder$1(a) && _isPlaceholder$1(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder$1(a) && _isPlaceholder$1(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder$1(b) && _isPlaceholder$1(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder$1(a) ? _curry1$1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder$1(b) ? _curry1$1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder$1(c) ? _curry1$1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the key
 * and the values associated with the key in each object, with the result being
 * used as the value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWithKey, R.merge, R.mergeWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeWithKey(concatValues,
 *                     { a: true, thing: 'foo', values: [10, 20] },
 *                     { b: true, thing: 'bar', values: [15, 35] });
 *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
 * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
 */

var mergeWithKey =
/*#__PURE__*/
_curry3(function mergeWithKey(fn, l, r) {
  var result = {};
  var k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
});

/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to the key and associated values
 *   using the resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWithKey, R.mergeDeepWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeDeepWithKey(concatValues,
 *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
 *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
 *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
 */

var mergeDeepWithKey =
/*#__PURE__*/
_curry3(function mergeDeepWithKey(fn, lObj, rObj) {
  return mergeWithKey(function (k, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey(fn, lVal, rVal);
    } else {
      return fn(k, lVal, rVal);
    }
  }, lObj, rObj);
});

var mergeDeepWithKey$1 = mergeDeepWithKey;

const combineClassNames = (key, l, r) => key === "class" ? classNames([l, r]) : r;
const mergeInterpolations = (interpolations) => (props) => interpolations.reduce((acc, fn) => mergeDeepWithKey$1(combineClassNames, acc, fn(props)), {});

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

function _isPlaceholder$2(a) {
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

function _curry1$2(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder$2(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

function _has$1(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var toString = Object.prototype.toString;

var _isArguments =
/*#__PURE__*/
function () {
  return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
    return toString.call(x) === '[object Arguments]';
  } : function _isArguments(x) {
    return _has$1('callee', x);
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
_curry1$2(function keys(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) :
/*#__PURE__*/
_curry1$2(function keys(obj) {
  if (Object(obj) !== obj) {
    return [];
  }

  var prop, nIdx;
  var ks = [];

  var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

  for (prop in obj) {
    if (_has$1(prop, obj) && (!checkArgsLength || prop !== 'length')) {
      ks[ks.length] = prop;
    }
  }

  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;

    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];

      if (_has$1(prop, obj) && !contains(ks, prop)) {
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
  row: "oj-flex-row-r151dc5k",
  column: "oj-flex-column-cddvbr0"
};
const alignStyles = {
  baseline: "oj-flex-baseline-b1ym8cgx",
  center: "oj-flex-center-cr3firy",
  end: "oj-flex-end-e1hcihnh",
  start: "oj-flex-start-stv38ab",
  inherit: "oj-flex-inherit-ibuadas",
  initial: "oj-flex-initial-i1katjsf",
  stretch: "oj-flex-stretch-s1xclxyq"
};
const justifyStyles = {
  center: "oj-flex-center-c1k7idmt",
  end: "oj-flex-end-erzuzq6",
  start: "oj-flex-start-s1ampyci",
  inherit: "oj-flex-inherit-ikwzjla",
  initial: "oj-flex-initial-i1ee5clk",
  around: "oj-flex-around-a3eykku",
  between: "oj-flex-between-bdy9zkz",
  evenly: "oj-flex-evenly-ebf40gc"
};
const wrapStyles = {
  nowrap: "oj-flex-nowrap-nf2xa2o",
  wrap: "oj-flex-wrap-w1rqjeh6",
  reverse: "oj-flex-reverse-rgdkw82",
  inherit: "oj-flex-inherit-id777hd",
  initial: "oj-flex-initial-i1152ami"
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

const baseStyles = "oj-flex-baseStyles-b12c3cqv";
const interpolations$1 = [...Object.values(interpolations), ...Object.values(flexboxInterpolations)];
const styleInterpolations = mergeInterpolations(interpolations$1);
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

  return h("div", {
    class: `${baseStyles} ${cls}`,
    style: styles
  }, children);
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Retrieves the current locale
 * @returns current locale
 */
function getLocale() {
    // TODO: fully implement Config.getLocale
    return 'en';
}

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
function isString$1(obj) {
    return obj !== null && ((typeof obj === 'string') || obj instanceof String);
}
/**
 * Remove leading and trailing whitespace
 * @param {Object|string|null} data to trim
 * @returns trimmed input
 */
function trim(data) {
    if (isString$1(data)) {
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

function _isPlaceholder$3(a) {
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

function _curry1$3(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder$3(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry2$1(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;

      case 1:
        return _isPlaceholder$3(a) ? f2 : _curry1$3(function (_b) {
          return fn(a, _b);
        });

      default:
        return _isPlaceholder$3(a) && _isPlaceholder$3(b) ? f2 : _isPlaceholder$3(a) ? _curry1$3(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder$3(b) ? _curry1$3(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

/**
 * Returns a partial copy of an object containing only the keys specified. If
 * the key does not exist, the property is ignored.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> {k: v}
 * @param {Array} names an array of String property names to copy onto a new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties from `names` on it.
 * @see R.omit, R.props
 * @example
 *
 *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
 *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
 */

var pick =
/*#__PURE__*/
_curry2$1(function pick(names, obj) {
  var result = {};
  var idx = 0;

  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }

    idx += 1;
  }

  return result;
});

var pick$1 = pick;

/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
// TODO: fully implement Logger
const Logger = pick$1(['error', 'warn', 'info', 'log'], console);

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
let audioContext = undefined;
/**
 * Creates a new audioContext or reuses the existing audioContext.
 *
 * @returns The audioContext instance
 * @throws {Error} Throws an error if WebAudio is not supported
 */
function getAudioContext() {
    // If we have already created an instance, then return the stored instance
    if (audioContext) {
        return audioContext;
    }
    // If we have the stored instance as null (not undefined, which represents we have not tried
    // creating an instance of AudioContext yet), then WebAudio is not supported. Then throw an error
    if (audioContext === null) {
        throw new Error('Browser does not support WebAudio API');
    }
    // AudioContext is not created yet, try creating one.
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    catch (e) {
        // WebAudio is not supported, store the value as null and throw an error
        audioContext = null;
        throw new Error('Browser does not support WebAudio API');
    }
    // Return the successfully created audioContext
    return audioContext;
}
/**
 * Plays an audio using the URL specified.
 *
 * @param url The URL of the audio file
 * @returns A promise that resolves when the audio is play or rejects if there are any issues
 */
function playAudioFromURL(url) {
    let resolve;
    let reject;
    const returnPromise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    // Using an <audio> element is simple for our use case.
    const audioElement = document.createElement('audio');
    audioElement.src = url;
    // Attach a listener for Invalid URL
    audioElement.addEventListener('error', reject);
    // Play the audio
    // Some older browsers will not return a Promise, like IE. Though we do not have to support them
    // it is safe to handle to it.
    (audioElement.play() || Promise.resolve()).then(resolve, reject).catch(reject);
    return returnPromise;
}
/**
 * Plays a notification sound using WebAudio API
 *
 * @throws {Error} Throws an error if WebAudio is not supported
 */
function playDefaultNotificationSound() {
    const audioContext = getAudioContext();
    // Now that we know WebAudio API is supported, play a beep sound
    // We will be using the default gain node, so simply creating an
    // oscillator node should suffice.
    const oscillatorNode = audioContext.createOscillator();
    // For simple beep, we will be using the default values in the oscillator.
    // sine wave, with frequency 440Hz.
    // Connect the oscillatorNode to the default destination and play the sound
    // for 100ms
    oscillatorNode.connect(audioContext.destination);
    oscillatorNode.start(0);
    oscillatorNode.stop(audioContext.currentTime + 0.1); // 0.1 = 100ms
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @classdesc
 * A utility class consisting of helper functions for handling transitions
 * related operations.
 */
class TransitionUtils {
    /**
     * Creates a map of the children array with the calculated in prop
     *
     * @param children The newly received children
     * @param prevChildMapping The previous child mapping
     * @returns the newly created child mapping
     */
    static getChildMapping(children, prevChildMapping = new Map(), onExited = () => { }) {
        // A symbol to store trailing children
        const TRAILING = Symbol();
        let mappedDeletions = {};
        if (prevChildMapping.size !== 0) {
            // If previous children exists, get the mapped deleted children
            mappedDeletions = TransitionUtils._getMappedDeletions(children, prevChildMapping, TRAILING);
        }
        // Create a new Map with the new children along with the deletions inserted in their
        // respective positions
        const mergedChildrenMap = children.reduce((accumulator, currentChild) => {
            if (mappedDeletions[currentChild.key]) {
                // There are keys from prev that are deleted before the current
                // next key, so add them first
                const deletedChildren = mappedDeletions[currentChild.key];
                for (const key of deletedChildren) {
                    const previousChild = prevChildMapping.get(key);
                    // Set the in property to false, as this is children is removed
                    accumulator.set(key, cloneElement(previousChild, { in: false }));
                }
                // Then add the current key. Do not change the in property as this is a
                // retained children.
                const previousChild = prevChildMapping.get(currentChild.key);
                accumulator.set(currentChild.key, cloneElement(currentChild, { in: previousChild.props.in }));
            }
            else {
                // This is a new children. Set the in property to true
                const newChild = cloneElement(currentChild, {
                    // bind the original child so that the original callbacks can be
                    // called in the onExited callback from the argument.
                    onExited: onExited.bind(null, currentChild),
                    in: true
                });
                accumulator.set(currentChild.key, newChild);
            }
            return accumulator;
        }, new Map());
        // Finally add any trailing deleted children present in the mappedDeletions[TRAILING]
        for (const key of mappedDeletions[TRAILING] || []) {
            const previousChild = prevChildMapping.get(key);
            // Set the in property to false, as this is children is removed
            mergedChildrenMap.set(key, cloneElement(previousChild, { in: false }));
        }
        // Finally return the merged children map
        return mergedChildrenMap;
    }
    ////////////////////////////
    // Private helper methods //
    ////////////////////////////
    /**
     * Creates a map of deleted children wrt to the keys in the new data.
     *
     * @param children The newly received children
     * @param prevChildMapping The previous child mapping
     * @param TRAILING A unique symbol to be used for storing the trailing children
     * @returns A map containing deleted children
     */
    static _getMappedDeletions(children, prevChildMapping, TRAILING) {
        // Create a set with keys of next children
        const nextChildrenKeys = new Set(children.map((children) => children.key));
        return [...prevChildMapping.keys()].reduce((accumulator, currentKey) => {
            if (nextChildrenKeys.has(currentKey)) {
                // We have reached a point where the closest prevKey that
                // is in the next, so if there are any pending keys add them
                // to this key in mappedDeletions so that the pending keys will
                // be added before the current next key
                accumulator[currentKey] = accumulator[TRAILING];
                delete accumulator[TRAILING];
            }
            else {
                // If key is not found in next, then add it to the trailing keys.
                const trailingChildren = accumulator[TRAILING]
                    ? [...accumulator[TRAILING], currentKey]
                    : [currentKey];
                accumulator[TRAILING] = trailingChildren;
            }
            return accumulator;
        }, {});
    }
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @classdesc
 * The <TransitionGroup> component manages a set of components that involves animations.
 * This component does not handle any animation, rather just a state machine that manages
 * the mounting and unmounting of the components over the time. The actual animation needs
 * to be handled by the content component.
 *
 * Consider the example below:
 * <TransitionGroup>
 *   {
 *      messages.map(message => {
 *        <Transition key={message.key}>
 *          <Message
 *            type={type}
 *            index={index}
 *            item={data.message}
 *            onOjClose={onOjClose}
 *          />
 *        </Transition>
 *      });
 *   }
 * </TransitionGroup>
 * As the messages are added/removed, the TransitionGroup Component automatically
 * toggles the 'in' prop of the Transition Component.
 *
 * @ignore
 */
class TransitionGroup extends Component {
    ///////////////////////////
    // Handler functions end //
    ///////////////////////////
    /**
     * Instantiates Component
     *
     * @param props The component properties
     */
    constructor(props) {
        super(props);
        ////////////////////////////////////////////////////////////////////////
        // Handler functions are created as members to have them 'this' bound //
        ////////////////////////////////////////////////////////////////////////
        /**
         * Handles when a transition component exits
         *
         * @param child The child instance that exited
         * @param node The corresponding transition element
         * @param key The key of the corresponding transition component
         */
        this._handleExited = (child, node) => {
            var _a, _b;
            const { children } = this.props;
            // get the child mapping for the current children
            const currentChildMapping = TransitionUtils.getChildMapping(children);
            // if the exited child is added again, do nothing here
            if (currentChildMapping.has(child.key))
                return;
            // The child component has exited, call the original onExited callback
            (_b = (_a = child.props).onExited) === null || _b === void 0 ? void 0 : _b.call(_a, node);
            // Check if this component is still mounted, if so update the state
            if (this._mounted) {
                this.setState((state) => {
                    const childMapping = new Map(state.childMapping);
                    // delete the exited child
                    childMapping.delete(child.key);
                    return { childMapping };
                });
            }
        };
        this.state = {
            childMapping: undefined,
            handleExited: this._handleExited
        };
        this._mounted = false;
    }
    /**
     * Derives state from the current props
     *
     * @param props The current Props that will be used to get the new state
     * @param state The current state
     *
     * @returns The new state
     */
    static getDerivedStateFromProps(props, state) {
        const { childMapping, handleExited } = state;
        return {
            childMapping: TransitionUtils.getChildMapping(props.children, childMapping, handleExited)
        };
    }
    //////////////////////////////////////
    // Component Life Cycle Hooks Start //
    //////////////////////////////////////
    /**
     * Life cycle hook that gets called when the component is mounted on to
     * the DOM
     */
    componentDidMount() {
        this._mounted = true;
    }
    /**
     * Life cycle hook that gets called when the component is unmounted from
     * the DOM
     */
    componentWillUnmount() {
        this._mounted = false;
    }
    ////////////////////////////////////
    // Component Life Cycle Hooks End //
    ////////////////////////////////////
    /**
     * Renders the transition components
     */
    render() {
        const WrapperComponent = this.props.elementType;
        const { childMapping } = this.state;
        const children = [...childMapping.values()];
        return h(WrapperComponent, null, children);
    }
}
TransitionGroup.defaultProps = {
    elementType: 'div'
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @classdesc
 * The component that acts as a layer for handing transitions.
 *
 * @ignore
 */
class Transition extends Component {
    ////////////////////////////////////////////////////////////////////////
    // Handler functions are created as members to have them 'this' bound //
    ////////////////////////////////////////////////////////////////////////
    ///////////////////////////
    // Handler functions end //
    ///////////////////////////
    /**
     * Instantiates Component
     *
     * @param props The component properties
     */
    constructor(props) {
        super(props);
        let appearStatus;
        if (props.in) {
            appearStatus = 'entering';
        }
        else {
            appearStatus = null;
        }
        this._appearStatus = appearStatus;
        this.state = { status: 'exited' };
        this._nextCallback = null;
    }
    //////////////////////////////////////
    // Component Life Cycle Hooks Start //
    //////////////////////////////////////
    /**
     * Lifecycle hook that gets called when the component is mounted to the DOM
     */
    componentDidMount() {
        this._updateStatus(this._appearStatus);
    }
    /**
     * Lifecycle hook that gets called after each update to the component
     *
     * @param prevProps The props of the component before last update
     */
    componentDidUpdate(prevProps) {
        let nextStatus = null;
        if (prevProps !== this.props) {
            const { status } = this.state;
            if (this.props.in) {
                if (status !== 'entering' && status !== 'entered') {
                    // The component is just entering, so set the next status as Entering
                    nextStatus = 'entering';
                }
            }
            else {
                if (status === 'entering' || status === 'entered') {
                    // The component is not in the data anymore, so we need to do exit animation
                    // So, set the next status as Exiting
                    nextStatus = 'exiting';
                }
            }
        }
        this._updateStatus(nextStatus);
    }
    /**
     * Lifecycle hook that gets called right before the component unmounts
     */
    componentWillUnmount() {
        this._cancelNextCallback();
    }
    ////////////////////////////////////
    // Component Life Cycle Hooks End //
    ////////////////////////////////////
    /**
     * Renders the Transition component
     *
     * @param props The current props
     * @returns The rendered component child
     */
    render(props) {
        return props === null || props === void 0 ? void 0 : props.children;
    }
    ////////////////////////////
    // Private helper methods //
    ////////////////////////////
    /**
     * Creates a wrapper callback function, which can be cancelled.
     *
     * @param callback The current callback function
     * @returns The created cancellable callback
     */
    _setNextCallback(callback) {
        let active = true;
        this._nextCallback = (...args) => {
            if (active) {
                active = false;
                this._nextCallback = null;
                callback(...args);
            }
        };
        this._nextCallback.cancel = () => {
            active = false;
        };
        return this._nextCallback;
    }
    /**
     * Cancels the scheduled next callback
     */
    _cancelNextCallback() {
        var _a, _b;
        (_b = (_a = this._nextCallback) === null || _a === void 0 ? void 0 : _a.cancel) === null || _b === void 0 ? void 0 : _b.call(_a);
        this._nextCallback = null;
    }
    /**
     * Updates the status of the component. Performs corresponding Transitions.
     */
    _updateStatus(nextStatus) {
        if (nextStatus != null) {
            this._cancelNextCallback();
            if (nextStatus === 'entering') {
                this._performEnter(this.base); // In our component, base is always Element
            }
            else {
                this._performExit(this.base); // In our component, base is always Element
            }
        }
    }
    /**
     * Perform Entering transitions
     *
     * @param node The root DOM element of this component
     */
    _performEnter(node) {
        var _a, _b;
        (_b = (_a = this.props).onEnter) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.props.metadata);
        this.setState({ status: 'entering' }, () => {
            var _a, _b;
            (_b = (_a = this.props).onEntering) === null || _b === void 0 ? void 0 : _b.call(_a, node, this._setNextCallback(() => {
                this.setState({ status: 'entered' }, () => {
                    var _a, _b;
                    (_b = (_a = this.props).onEntered) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.props.metadata);
                });
            }), this.props.metadata);
        });
    }
    /**
     * Perform Exiting transitions
     *
     * @param node The root DOM element of this component
     */
    _performExit(node) {
        var _a, _b;
        (_b = (_a = this.props).onExit) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.props.metadata);
        this.setState({ status: 'exiting' }, () => {
            var _a, _b;
            (_b = (_a = this.props).onExiting) === null || _b === void 0 ? void 0 : _b.call(_a, node, this._setNextCallback(() => {
                this.setState({ status: 'exited' }, () => {
                    var _a, _b;
                    (_b = (_a = this.props).onExited) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.props.metadata);
                });
            }), this.props.metadata);
        });
    }
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const messageCloseButtonStyles = {
  banner: "oj-message-banner-b10cag1l"
};
/**
 * A Component for rendering the message close button
 */

function MessageCloseButton({
  onAction,
  buttonRenderer,
  title = 'Close',
  variant = 'banner'
}) {
  const renderedButton = buttonRenderer ? buttonRenderer(title, onAction, variant) : // we should ultimately be able to create an oj-button (or rather its preact
  // equivalent) here, but for now just create a regular HTML button if a renderer
  // is not passed in from the core JET layer
  h("button", {
    "aria-label": title,
    onClick: onAction,
    title: title
  }, "X");
  const classes = `oj-message${variant}-close-icon ${messageCloseButtonStyles[variant]}`; // Otherwise, render the close icon

  return h("div", {
    class: classes
  }, renderedButton);
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
stringLiteralArray([
    'banner'
]);
const severities = stringLiteralArray([
    'error',
    'warning',
    'confirmation',
    'info',
    'none'
]);

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Options for creating an Intl.DateTimeFormat instance.
 */
const DATE_FORMAT_OPTIONS = Object.freeze({
    TODAY: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    },
    DEFAULT: {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }
});
/**
 * Regex for validating ISO timestamp
 */
const ISO_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
/**
 * Checks if the provided date is today
 *
 * @param isoDate Date to be tested for today
 *
 * @returns boolean indicating if the provided date is today
 */
function isDateToday(isoDate) {
    const today = new Date();
    const provided = new Date(isoDate);
    return (today.getUTCFullYear() === provided.getUTCFullYear() &&
        today.getUTCMonth() === provided.getUTCMonth() &&
        today.getUTCDate() === provided.getUTCDate());
}
/**
 * Creates an instance of Intl.DateTimeFormat
 *
 * @param isToday A boolean to indicate whether a formatter is needed for the date
 *                that is the current day.
 *
 * @returns the formatter instance
 */
function getDateTimeFormatter(isToday) {
    const locale = getLocale();
    const { DateTimeFormat } = Intl;
    if (isToday) {
        return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.TODAY);
    }
    return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.DEFAULT);
}
/**
 * Checks if the provided value is valid for the prop specified.
 * By default, this method just checks for the value to be a valid string.
 *
 * @param value The value to be checked
 * @param prop The property for which the value needs to be evaluated
 *
 * @returns the result of the validation
 */
function isValidValueForProp(value, prop = 'string') {
    switch (prop) {
        case 'severity':
            // Should be one of the allowed severity
            return typeof value === 'string' && severities.includes(value);
        case 'timestamp':
            // Should be a valid ISO Datetime string
            return typeof value === 'string' && ISO_DATE_REGEX.test(value);
        case 'string':
        default:
            // anything other than null, undefined and '' is a valid string
            return typeof value === 'string' && !isEmptyOrUndefined(value);
    }
}
/**
 * Formats the timestamp in the required format based on the current
 * locale.
 *
 * @param isoTime Timestamp in ISO format
 */
function formatTimestamp(isoTime) {
    const isToday = isDateToday(isoTime);
    const formatter = getDateTimeFormatter(isToday);
    return formatter.format(new Date(isoTime));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const messageDetailStyles = {
  // TODO: Reevaluate once the TEXT component is available (JET-46891)
  base: "oj-message-base-bbznd28",
  banner: "oj-message-banner-b39ctpn"
};
/**
 * Default renderer for rendering the detail content.
 *
 * @param item The template item object
 * @returns Rendered detail content
 */

function defaultDetailRenderer(item) {
  const {
    detail
  } = item.data; // If the detail is null or an empty string, do not render the
  // content row

  if (!isValidValueForProp(detail)) {
    return null;
  }

  return h(Fragment, null, detail);
}
/**
 * Detail Component for rendering the detail content of the Message
 */


function MessageDetail({
  item,
  renderer = defaultDetailRenderer,
  variant = 'banner'
}) {
  const renderedContent = renderer(item);
  if (renderedContent == null) return null; // If detail content is rendered, then wrap it in a div with specified style classes

  const classes = `oj-message${variant}-detail ${messageDetailStyles.base} ${messageDetailStyles[variant]}`;
  return h("div", {
    class: classes
  }, renderedContent);
}

/**
 * Given a set of string arguments, join the values together into a string with
 * spaces. Falsey values will be omitted,
 * e.g. classNames(['A', 'B', false, 'D', false]) --> 'A B D'
 * @param values The set of values
 * @returns The values joined as a string, or blank string if no values
 */
function classNames$1(values) {
    return values.filter(Boolean).join(' ');
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

let counter = 0;

function useSvgId() {
  return useRef(`svg-${++counter}`).current;
} // TODO: replace with real image component when that is available
// tracked by JET-47348 - set images in a component


const svgStyles = "oj-message-svgStyles-s15seud3";

const Svg = ({
  class: className,
  children,
  height = 24,
  width = 24,
  title
}) => {
  const id = useSvgId();
  return h("svg", {
    class: classNames([svgStyles, className]),
    height: height,
    viewBox: "0 0 24 24",
    width: width,
    xmlns: "http://www.w3.org/2000/svg",
    "aria-labelledby": id
  }, h("title", {
    id: id
  }, title), children);
};

const ConfirmationIcon = ({
  class: className,
  height,
  width,
  title,
  fill = 'currentColor'
}) => h(Svg, {
  class: className,
  height: height,
  width: width,
  title: title
}, h("path", {
  d: "m12 23c-6.07513225 0-11-4.9248677-11-11 0-6.07513225 4.92486775-11 11-11 6.0751323 0 11 4.92486775 11 11 0 6.0751323-4.9248677 11-11 11zm-4.29289322-10.7071068c-.39052429-.3905243-1.02368927-.3905243-1.41421356 0s-.39052429 1.0236893 0 1.4142136l3 3c.39052429.3905243 1.02368928.3905243 1.41421358 0l7-7.00000002c.3905243-.39052429.3905243-1.02368927 0-1.41421356s-1.0236893-.39052429-1.4142136 0l-6.2928932 6.29289318z",
  fill: fill
}));

const ErrorIcon = ({
  class: className,
  height = 24,
  width = 24,
  title,
  fill = 'currentColor'
}) => h(Svg, {
  class: className,
  height: height,
  width: width,
  title: title
}, h("path", {
  d: "m12 1c6.0751322 0 11 4.92486775 11 11 0 6.0751322-4.9248678 11-11 11-6.07513225 0-11-4.9248678-11-11 0-6.07513225 4.92486775-11 11-11zm-3.29289322 6.29289322-1.41421356 1.41421356 7.99999998 8.00000002 1.4142136-1.4142136z",
  fill: fill
}));

const InfoIcon = ({
  class: className,
  height = 24,
  width = 24,
  title,
  fill = 'currentColor'
}) => h(Svg, {
  class: className,
  height: height,
  width: width,
  title: title
}, h("path", {
  d: "m12 1c6.0751322 0 11 4.92486775 11 11 0 6.0751322-4.9248678 11-11 11-6.07513225 0-11-4.9248678-11-11 0-6.07513225 4.92486775-11 11-11zm.0245053 9h-.0490003c-.5365027 0-.975505.439-.975505.9755v6.0485c0 .537.4390023.976.975505.976h.0490003c.5365027 0 .975505-.439.975505-.976v-6.0485c0-.5365-.4390023-.9755-.975505-.9755zm.975505-4h-2v2h2z",
  fill: fill
}));

const WarningIcon = ({
  class: className,
  height = 24,
  width = 24,
  title,
  fill = 'currentColor'
}) => h(Svg, {
  class: className,
  height: height,
  width: width,
  title: title
}, h("path", {
  d: "m12 .85290895 11.6563637 22.14709105h-23.31272741zm1 17.14709105h-2v2h2zm0-9h-2v7h2z",
  fill: fill
}));

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const messageStartIconStyles = "oj-message-messageStartIconStyles-mmmpf1e";
const severityIconStyles = {
  banner: "oj-message-banner-b1mv77e8"
};
const severityIcons = {
  confirmation: ConfirmationIcon,
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon
};
/**
 * StartIcon Component for rendering the severity based icon in Message
 */

function MessageStartIcon({
  severity,
  variant = 'banner',
  translations
}) {
  const IconComponent = severityIcons[severity];
  return h("div", {
    class: classNames$1([`oj-message${variant}-start-icon`, messageStartIconStyles]),
    role: "presentation"
  }, h(IconComponent, {
    class: severityIconStyles[variant],
    title: translations === null || translations === void 0 ? void 0 : translations[severity]
  }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const messageSummaryStyles = {
  // TODO: Reevaluate once the TEXT component is available (JET-46891)
  base: "oj-message-base-bczmanu",
  banner: "oj-message-banner-bonzci6"
};
/**
 * Summary Component for rendering the summary text of the Message
 */

function MessageSummary({
  text,
  variant = 'banner'
}) {
  const classes = `oj-message${variant}-summary ${messageSummaryStyles.base} ${messageSummaryStyles[variant]}`;
  return h("div", {
    role: "heading",
    class: classes
  }, text);
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const messageTimestampStyles = {
  banner: "oj-message-banner-b1i0o3vp"
};
/**
 * Timestamp Component for rendering timestamp in Message
 */

function MessageTimestamp({
  value,
  variant = 'banner'
}) {
  const classes = `oj-message${variant}-timestamp ${messageTimestampStyles[variant]}`; // Otherwise, render the timestamp

  const formattedTimestamp = formatTimestamp(value);
  return h("div", {
    class: classes
  }, formattedTimestamp);
}

/**
 * Logger that prepends the component name to the message
 */
const MessageLogger = {
    error: (message, type = 'common') => Logger.error(`JET Message(${type}): ${message}`),
    warn: (message, type = 'common') => Logger.warn(`JET Message(${type}): ${message}`),
    info: (message, type = 'common') => Logger.info(`JET Message(${type}): ${message}`),
    log: (message, type = 'common') => Logger.log(`JET Message(${type}): ${message}`)
};
/**
 * Plays a sound based on the provided argument. Supported keywords:
 * 1. default - plays the default beep sound
 * 2. none - no sound will be played
 *
 * @param sound Supported keywords or URL to an audio file
 */
async function playSound(sound) {
    if (sound === 'none') {
        // no need to play any audio
        return;
    }
    // For default, we play a beep sound using WebAudio API
    if (sound === 'default') {
        try {
            playDefaultNotificationSound();
        }
        catch (error) {
            // Default sound is not played due to some error
            // Log a message and return doing nothing else
            MessageLogger.warn(`Failed to play the default sound. ${error}.`);
        }
        return;
    }
    // If it is not a key word, then it is an URL
    try {
        await playAudioFromURL(sound);
    }
    catch (error) {
        // Playing audio using the URL failed.
        MessageLogger.warn(`Failed to play the audio from the url ${sound}. ${error}.`);
    }
}
/**
 * A helper function that throws an error
 *
 * @param message The error message
 * @param type The type of the message that is throwing an error
 * @throws {Error}
 */
function throwError(message, type = 'common') {
    throw new Error(`JET Message(${type}) - ${message}`);
}
/**
 * Fetches a renderer for the current message if one is provided
 *
 * @param message The item context for the current message
 * @param rendererIdentifier Identifier of the current renderer
 * @param renderers All available renderers
 * @returns The renderer for rendering the custom content
 */
function getRenderer(message, rendererIdentifier, renderers, type) {
    // If either detailRenderer function or record of renderers are not available,
    // return null
    if (!rendererIdentifier || !renderers) {
        return undefined;
    }
    const rendererKey = typeof rendererIdentifier === 'function' ? rendererIdentifier(message) : rendererIdentifier;
    // If rendererKey is null or undefined, then we need to use default rendering
    // so return null
    if (rendererKey == null) {
        return undefined;
    }
    // If the returned render key is a string but does not exist in the provided
    // record of dynamic template slots, throw an error
    if (!(rendererKey in renderers)) {
        throwError(`${rendererKey} is not a valid template name for the message with key=${message.key}`, type);
    }
    // Else, fetch and return the renderer
    return renderers[rendererKey];
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Generates a root style class based on the severity. For invalid severity and severity=none
 * no specific style class exists.
 *
 * @param severity The message severity
 * @returns calculated style class based on the severity
 */

function getSeverityStyleClass(severity) {
  const isValidSeverity = isValidValueForProp(severity, 'severity');
  return classNames([isValidSeverity && severity !== 'none' && `oj-messagebanner-${severity}`]);
}
/**
 * Determines if a severity icon is needed based on the component severity
 *
 * @param severity The component severity
 * @returns Whether or not to render the severity icon
 */


function isSeverityIconNeeded(severity) {
  const isValidSeverity = isValidValueForProp(severity, 'severity');
  return isValidSeverity && severity !== 'none';
}
/**
 * CSS styles for various components
 */


const messageStyles = {
  base: "oj-message-base-bb5rzqk",
  section: "oj-message-section-s1c5gur5",
  header: "oj-message-header-h1k6g34i",
  // TODO: Replace with Flex and View components to handle padding and flex
  content: "oj-message-content-cy2ssrz"
};
/**
 * A component that styles the header for the message component
 * @param param0 Props
 * @returns MessageHeader component instance
 */

function StyledMessageHeader({
  children
}) {
  return h("div", {
    role: "presentation",
    class: messageStyles.header
  }, children);
}
/**
 * Component that renders an individual message
 */


function Message({
  closeButtonRenderer,
  detailRenderer,
  index = -1,
  item,
  onClose,
  messageRef = () => {},
  translations,
  type
}) {
  const {
    closeAffordance = 'on',
    severity = 'error',
    sound,
    summary,
    timestamp
  } = item.data;
  const severityClass = getSeverityStyleClass(severity);
  const containerDivRef = useRef(null); // Add methods to the ref object

  useImperativeHandle(messageRef, () => ({
    focus: () => {
      var _a;

      return (_a = containerDivRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    },
    contains: element => {
      var _a, _b;

      return containerDivRef.current === element || ((_b = element && ((_a = containerDivRef.current) === null || _a === void 0 ? void 0 : _a.contains(element))) !== null && _b !== void 0 ? _b : false);
    }
  }));
  /**
   * Handles clicking on the close icon of the message
   */

  const handleClose = useCallback(() => {
    onClose === null || onClose === void 0 ? void 0 : onClose(item);
  }, [item, onClose]);
  /**
   * Handles closing the message on pressing Esc
   */

  const handleCloseOnEsc = useCallback(event => {
    // Close the message only when closeAffordance is on
    if (event.key === 'Escape' && closeAffordance === 'on') {
      onClose === null || onClose === void 0 ? void 0 : onClose(item);
    }
  }, [closeAffordance, item, onClose]);
  useEffect(() => {
    if (isValidValueForProp(sound)) {
      // It is sufficient to check for the value to be a
      // non-empty string. The playSound method takes care of the rest.
      playSound(sound);
    }
  }, []); // No deps to run this only on mount

  const rootClasses = classNames([messageStyles.base, severityClass, type === 'section' && messageStyles.section]); // We will be animating the root div, so add padding to an inner wrapper div so that
  // when animating height looks smooth. If padding were to be added to the root
  // div, the animation will not be smooth as height will never reach 0 due to the
  // padding.

  return h("div", {
    ref: containerDivRef,
    class: rootClasses,
    role: "alert",
    "aria-atomic": "true",
    tabIndex: 0,
    onKeyDown: handleCloseOnEsc
  }, h("div", {
    class: messageStyles.content
  }, isSeverityIconNeeded(severity) && h(MessageStartIcon, {
    variant: "banner",
    severity: severity,
    translations: translations
  }), h(Flex, {
    direction: "column",
    flex: "1"
  }, h(StyledMessageHeader, null, h(MessageSummary, {
    variant: "banner",
    text: summary
  }), isValidValueForProp(timestamp, 'timestamp') && h(MessageTimestamp, {
    variant: "banner",
    value: timestamp
  })), h(MessageDetail, {
    variant: "banner",
    item: Object.assign(Object.assign({}, item), {
      index
    }),
    renderer: detailRenderer
  })), closeAffordance === 'on' && h(MessageCloseButton, {
    buttonRenderer: closeButtonRenderer,
    title: translations === null || translations === void 0 ? void 0 : translations.close,
    variant: "banner",
    onAction: handleClose
  })));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Context which the parent custom element components can use for passing down
 * the busy context
 */
const MessagesContext = createContext({});
/**
 * Uses the MessagesContext if one is available.
 *
 * @returns The context from the closes provider
 */
function useMessagesContext() {
    return useContext(MessagesContext);
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * The component that renders individual messages for the provided data.
 */
function MessagesManager(props) {
    const { children, data } = props;
    const { handleEntering, handleExiting } = useMessagesManager(props);
    return (h(TransitionGroup, { elementType: Fragment }, data.map((item, index) => (h(Transition, { key: item.key, metadata: { index, key: item.key }, onEntering: handleEntering, onExiting: handleExiting }, children === null || children === void 0 ? void 0 : children({ index, item }))))));
}
/**
 * A custom hook for creating the listeners for the MessagesManager
 *
 * @param param0 The props for the messages
 * @returns The transition listeners
 */
function useMessagesManager({ animations, startAnimation = () => Promise.resolve(false), onMessageWillRemove }) {
    const { addBusyState } = useMessagesContext();
    /**
     * Adds busy state if available in the context
     *
     * @param description The description of the busyState
     * @returns The busyState resolver
     */
    const _addBusyState = useCallback((description) => {
        var _a;
        return (_a = addBusyState === null || addBusyState === void 0 ? void 0 : addBusyState(description)) !== null && _a !== void 0 ? _a : (() => { });
    }, [addBusyState]);
    /**
     * Performs animation.
     *
     * @param type The type of the animation
     * @param base The root DOM element
     */
    const performAnimation = useCallback(async (type, base) => {
        if (!base) {
            return;
        }
        const animation = animations === null || animations === void 0 ? void 0 : animations[type];
        if (animation) {
            const busyStateResolver = _addBusyState(`performing message animation - ${type}`);
            // If an animation is provided for the current transition, perform the animation
            await startAnimation(base, type, animation);
            busyStateResolver();
        }
    }, [animations, startAnimation, _addBusyState]);
    /**
     * Handles when a message is successfully entered.
     *
     * @param node The corresponding message element
     * @param callback A callback function to be called after the animation is complete
     */
    const handleEntering = useCallback(async (node, callback) => {
        await performAnimation('enter', node);
        callback === null || callback === void 0 ? void 0 : callback();
    }, [performAnimation]);
    /**
     * Handles when a message has started to exit.
     *
     * @param node The corresponding message element
     * @param callback A callback function to be called after the animation is complete
     */
    const handleExiting = useCallback(async (node, callback, metadata) => {
        await performAnimation('exit', node);
        metadata && (onMessageWillRemove === null || onMessageWillRemove === void 0 ? void 0 : onMessageWillRemove(metadata.key, metadata.index));
        callback === null || callback === void 0 ? void 0 : callback();
    }, [performAnimation, onMessageWillRemove]);
    return { handleEntering, handleExiting };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Animation config for banner messages.
 * TODO: Get this from theme context provider
 */
const DEFAULT_ANIMATIONS = {
    enter: [{ effect: 'expand', duration: '0.25s', direction: 'height' }],
    exit: [{ effect: 'collapse', duration: '0.25s', direction: 'height' }]
};
/**
 * Default translations for banner messages.
 * TODO: Replace this with preact translations
 */
const DEFAULT_TRANSLATIONS = {
    close: 'Close',
    navigationFromMessagesRegion: 'Entering messages region. Press F6 to navigate back to prior focused element.',
    navigationToMessagesRegion: 'Messages region has new messages. Press F6 to navigate to the most recent message region.',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    confirmation: 'Confirmation'
};
/**
 * Renders individual messages based on the provided data
 */
function MessageBanner({ closeButtonRenderer, detailRendererKey, data, onClose, renderers, startAnimation, translations = DEFAULT_TRANSLATIONS, type = 'section' }) {
    // Keyboard Navigation and Focus Management
    const messagesRef = useMutableRefArray(data.length);
    const containerDivRef = useRef(null);
    const focusHandleRef = useRef(null);
    const [liveRegionText, setLiveRegionText] = useState();
    const [shouldRender, setShouldRender] = useState(data.length > 0);
    const [prevDataLength, setPreviousDataLength] = useState(0);
    // We need a ref that holds the current data length, as the exiting
    // node will always call handleNextFocus with previous data.
    // As in TransitionGroup, when an item is removed from the data, a new vnode
    // will not be created instead previous vnode will be used. So, the new handleNextFocus
    // will not be called when the old vnode exits. Thus, we will be using a ref
    // to always get the correct current data length.
    const dataLengthRef = useRef(data.length);
    // Update the data length ref
    dataLengthRef.current = data.length;
    // Update the focusHandleRef
    useImperativeHandle(focusHandleRef, () => ({
        focus: () => {
            var _a, _b;
            // Only trigger focus if the component is rendering messages
            if (data.length) {
                (_b = (_a = messagesRef[0]) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.focus();
                return true;
            }
            return false;
        },
        contains: (element) => {
            var _a, _b;
            // Only invoke method if the component is rendering messages
            if (data.length && element) {
                return (_b = (_a = containerDivRef.current) === null || _a === void 0 ? void 0 : _a.contains(element)) !== null && _b !== void 0 ? _b : false;
            }
            return false;
        }
    }), [data, messagesRef]);
    // Register handlers for focus management
    const { controller, handlers } = useMessageFocusManager(focusHandleRef, {
        onFocus: useCallback(() => {
            setLiveRegionText(translations.navigationFromMessagesRegion);
        }, [setLiveRegionText])
    });
    /**
     * Emits onClose event for the provided message.
     * @param item The message which the user tried to close
     */
    const handleClose = useCallback((item) => {
        onClose === null || onClose === void 0 ? void 0 : onClose(item);
    }, [onClose]);
    /**
     * Handles focus when a message is closed and animated away from the DOM
     * @param key The key of the message
     * @param index The index of the message
     */
    const handleNextFocus = useCallback((_key, index) => {
        var _a, _b, _c;
        const currentDataCount = dataLengthRef.current;
        const currentMessagesCount = messagesRef.length;
        const message = messagesRef[index];
        const isCurrentMessageFocused = (_a = message === null || message === void 0 ? void 0 : message.current) === null || _a === void 0 ? void 0 : _a.contains(document.activeElement);
        // If there are no messages, do not render anything. As the old messages
        // are still in the DOM, use the data count to determine what to do next as it
        // represents the next state.
        if (currentDataCount === 0) {
            setShouldRender(false);
            // If the current message holds focus, then restore previous focus
            if (isCurrentMessageFocused) {
                controller.restorePriorFocus();
            }
            return;
        }
        let nextMessageToFocus = -1;
        // Now that this message is closed, focus the next message will take this index. If no
        // message will take this message's index, then it means that this is the last message. If
        // that is the case, focus the message at the previous index.
        // Use the count of the messages that are currently shown in the UI (current state including
        // the message that will be removed). This way we can get the correct element from the messagesRef
        // as it will contain the closing message as well.
        if (index + 1 < currentMessagesCount) {
            nextMessageToFocus = index + 1;
        }
        else if (index - 1 > -1) {
            nextMessageToFocus = index - 1;
        }
        // if next message is available then transfer the focus to the next element
        if (nextMessageToFocus > -1 && isCurrentMessageFocused) {
            (_c = (_b = messagesRef[nextMessageToFocus]) === null || _b === void 0 ? void 0 : _b.current) === null || _c === void 0 ? void 0 : _c.focus();
        }
    }, [controller, dataLengthRef, messagesRef, setShouldRender]);
    // Prioritize this component whenever the data changes and
    // the new data has atleast one message
    useEffect(() => {
        if (data.length) {
            // set state to render content whenever the data is not empty
            setShouldRender(true);
            if (data.length > prevDataLength) {
                // Only when having a new message, update the aria-live area with the
                // text to indicate how to get the focus to the new message.
                setLiveRegionText(translations.navigationToMessagesRegion);
            }
            controller.prioritize();
        }
        else {
            // When there are no messages, clear the live region so that
            // the navigation text will be read when a new message appear
            setLiveRegionText('');
        }
        setPreviousDataLength(data.length);
    }, [data, controller, prevDataLength, setPreviousDataLength, setShouldRender]);
    // When both shouldRender flag is false and no data to render, do not render
    // anything
    if (!shouldRender && data.length === 0) {
        return null;
    }
    return (h("div", Object.assign({ ref: containerDivRef, class: 'oj-messagebanner', tabIndex: -1 }, handlers),
        h(Flex, { direction: "column", gap: type === 'section' ? 'xs' : undefined },
            h(MessagesManager, { animations: DEFAULT_ANIMATIONS, data: data, startAnimation: startAnimation, onMessageWillRemove: handleNextFocus }, ({ index, item }) => {
                return (h(Message, { messageRef: messagesRef[index], item: item, closeButtonRenderer: closeButtonRenderer, detailRenderer: getRenderer(item, detailRendererKey, renderers), index: index, key: item.key, translations: translations, type: type, onClose: handleClose }));
            }),
            h(LiveRegion, { text: liveRegionText }))));
}

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (null && null.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let MessageBanner$1 = class MessageBanner$1 extends Component {
    constructor(props) {
        super(props);
        this._addBusyState = (description) => {
            const busyContext = Context.getContext(this._rootRef.current).getBusyContext();
            return busyContext.addBusyState({ description });
        };
        this._handleCloseMessage = (context) => {
            var _a, _b;
            (_b = (_a = this.props).onOjClose) === null || _b === void 0 ? void 0 : _b.call(_a, context);
        };
        this._handleAnimation = (element, action, options) => __awaiter(this, void 0, void 0, function* () {
            yield startAnimation(element, action, options);
        });
        this._renderCloseButton = (title, onAction) => {
            return (h("oj-button", { class: 'oj-button-sm', display: 'icons', chroming: 'borderless', title: title, onojAction: onAction },
                h("span", { slot: 'startIcon', class: 'oj-fwk-icon oj-fwk-icon-cross' }),
                h("span", null, title)));
        };
        this._rootRef = createRef();
        this.state = { dataProviderCount: 0, previousDataProvider: props.data };
        this.WrapperMessagesContainer = withDataProvider(MessageBanner, 'data');
    }
    static getDerivedStateFromProps(props, state) {
        const { data } = props;
        const { dataProviderCount, previousDataProvider } = state;
        if (data !== previousDataProvider) {
            return {
                dataProviderCount: dataProviderCount + 1,
                previousDataProvider: data
            };
        }
        return null;
    }
    render(props, state) {
        const { data, detailTemplateValue, messageTemplates, type } = props;
        const { dataProviderCount } = this.state;
        const messagesContext = { addBusyState: this._addBusyState };
        return (h(Root, { ref: this._rootRef },
            h(MessagesContext.Provider, { value: messagesContext },
                h(this.WrapperMessagesContainer, { key: `dataProvider${dataProviderCount}`, addBusyState: this._addBusyState, data: data, type: type, closeButtonRenderer: this._renderCloseButton, detailRendererKey: detailTemplateValue, renderers: messageTemplates, startAnimation: this._handleAnimation, onClose: this._handleCloseMessage, translations: {
                        close: getTranslatedString('oj-ojMessageBanner.close'),
                        navigationFromMessagesRegion: getTranslatedString('oj-ojMessageBanner.navigationFromMessagesRegion'),
                        navigationToMessagesRegion: getTranslatedString('oj-ojMessageBanner.navigationToMessagesRegion'),
                        error: getTranslatedString('oj-ojMessageBanner.error'),
                        warning: getTranslatedString('oj-ojMessageBanner.warning'),
                        info: getTranslatedString('oj-ojMessageBanner.info'),
                        confirmation: getTranslatedString('oj-ojMessageBanner.confirmation')
                    } }))));
    }
};
MessageBanner$1.defaultProps = {
    type: 'section'
};
MessageBanner$1.metadata = { "properties": { "data": { "type": "object" }, "type": { "type": "string", "enumValues": ["page", "section"] }, "detailTemplateValue": { "type": "string|function" } }, "extension": { "_DYNAMIC_SLOT": { "prop": "messageTemplates", "isTemplate": 1 } }, "events": { "ojClose": {} } };
MessageBanner$1 = __decorate([
    customElement('oj-message-banner')
], MessageBanner$1);

export { MessageBanner$1 as MessageBanner };
