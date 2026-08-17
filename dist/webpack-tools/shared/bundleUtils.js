/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Utility functions shared between the WebpackRequireFixupPlugin and the ojL10n-loader
 */


const {BundleFunction} = require('./bundleParser');

function stringifyWithFunctions(obj) {
  if (obj instanceof BundleFunction) {
    return obj.source;
  }
  if (Array.isArray(obj)) {
    const vals = obj.map((val) => {
      return stringifyWithFunctions(val);
    });
    return `[${vals.join(',')}]`;
  } else if (isObject(obj)) {
    const vals = Object.keys(obj).map((key) => {
      return `${JSON.stringify(key)}:${stringifyWithFunctions(obj[key])}`;
    });
    return `{${vals.join(',')}}`;
  } else if (typeof obj === 'function') {
    return String(obj);
  } else {
    return JSON.stringify(obj);
  }
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item) && !(item instanceof BundleFunction);
}

function isBlockedKey(key) {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (!isBlockedKey(key)) {
        const sourceValue = source[key];
        if (isObject(sourceValue)) {
          if (!Object.prototype.hasOwnProperty.call(target, key) || !target[key]) {
            target[key] = {};
          }
          if (isObject(target[key])) {
            mergeDeep(target[key], sourceValue);
          }
        } else {
          target[key] = sourceValue;
        }
      }
    });
  }

  return mergeDeep(target, ...sources);
}



module.exports = {stringifyWithFunctions, isObject, mergeDeep};
