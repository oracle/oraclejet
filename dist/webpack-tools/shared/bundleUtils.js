/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Utility functions shared between the WebpackRequireFixupPlugin and the ojL10n-loader
 */


function stringifyWithFunctions(obj) {
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
  return item && typeof item === 'object' && !Array.isArray(item);
}



module.exports = {stringifyWithFunctions, isObject};
