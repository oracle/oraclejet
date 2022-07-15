/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Returns true if the key is contains in keys, false otherwise
 */
const containsKey = (keys, key) => {
    if (keys == null) {
        return false;
    }
    if (!keys.all) {
        return keys.keys.has(key);
    }
    return !keys.deletedKeys.has(key);
};
/**
 * Returns a new Keys that includes the specified key.
 * If the key is already in keys, then just return keys.
 */
const addKey = (keys, key) => {
    if (keys.all && keys.deletedKeys.has(key)) {
        const keySet = new Set(keys.deletedKeys);
        keySet.delete(key);
        keys = { all: true, deletedKeys: keySet };
    }
    else if (!keys.all && !keys.keys.has(key)) {
        const keySet = new Set(keys.keys);
        keySet.add(key);
        keys = { all: false, keys: keySet };
    }
    return keys;
};
/**
 * Returns a new Keys that excludes the specified key.
 * If the key is already in keys, then just return keys.
 * disallowEmpty if set to true, will ensure that the returning keys will not be empty.
 */
const removeKey = (keys, key, disallowEmpty) => {
    if (keys.all && !keys.deletedKeys.has(key)) {
        const keySet = new Set(keys.deletedKeys);
        keySet.add(key);
        keys = { all: true, deletedKeys: keySet };
    }
    else if (!keys.all && keys.keys.has(key) && (!disallowEmpty || keys.keys.size > 1)) {
        const keySet = new Set(keys.keys);
        keySet.delete(key);
        keys = { all: false, keys: keySet };
    }
    return keys;
};
/**
 * Helper function for checking for an undefined key
 * Keys can be null or undefined when not set, but falsey check is not appropriate for this as 0 is a legitimate key
 */
const isKeyDefined = (key) => key !== undefined && key !== null;

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.addKey = addKey;
exports.containsKey = containsKey;
exports.isKeyDefined = isKeyDefined;
exports.removeKey = removeKey;
/*  */
//# sourceMappingURL=UNSAFE_keys.js.map
