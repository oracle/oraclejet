/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore-base'], function(oj)
{
  "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/**
 * Component Metadata utilities.
 * @class MetadataUtils
 * @export
 * @ignore
 */
var MetadataUtils = {};
/**
 * Default values can be specified at the top level or at leaf subproperties.
 * This utility walks complex property subproperties to generate default value.
 * @property {object} metadata property-level metadata
 * @property {boolean?} shouldFreeze Contol whether we copy or freeze Object/Array types
 * @memberof MetadataUtils
 * @ignore
 */

MetadataUtils.getDefaultValue = function (metadata, shouldFreeze) {
  var defaultValue = metadata.value;

  if (defaultValue === undefined) {
    // If top level metadata isn't specified, check subproperties.
    // Note that we are not handling cases where both top level and subproperty
    // default values are provided, leaving that to auditing and build tools to check.
    var subMeta = metadata.properties;

    if (subMeta) {
      var complexValue = {};
      var keys = Object.keys(subMeta);

      for (var i = 0; i < keys.length; i++) {
        var subpropDefault = MetadataUtils.getDefaultValue(subMeta[keys[i]]);

        if (subpropDefault !== undefined) {
          complexValue[keys[i]] = subpropDefault;
        }
      } // Cache the default value on the top level property. This is ok
      // because we make a copy of the metadata when we process it for
      // event listener properties


      if (Object.keys(complexValue).length > 0) {
        // eslint-disable-next-line no-param-reassign
        metadata.value = complexValue;
        defaultValue = complexValue;
      }
    }
  }

  if (defaultValue !== undefined) {
    // For object/array types, either freeze or make a copy of the value
    // to prevent modification
    if (Array.isArray(defaultValue)) {
      defaultValue = shouldFreeze ? MetadataUtils.deepFreeze(defaultValue) : defaultValue.slice();
    } else if (defaultValue !== null && _typeof(defaultValue) === 'object') {
      defaultValue = shouldFreeze ? MetadataUtils.deepFreeze(defaultValue) : oj.CollectionUtils.copyInto({}, defaultValue, undefined, true);
    }
  }

  return defaultValue;
};
/**
 * Default values can be specified at the top level or at leaf subproperties.
 * This utility creates an object containing the default values for all properties
 * in the metadata (including rolling up subproperty defaults).  Returns null if no
 * default values are found
 * @property {object} metadata properties metadata (i.e. the value of the 'properties' property in component.json)
 * @property {boolean?} shouldFreeze Contol whether we copy or freeze Object/Array types
 * @memberof MetadataUtils
 * @ignore
 */


MetadataUtils.getDefaultValues = function (metadata, shouldFreeze) {
  var defaults = {};
  var propNames = Object.keys(metadata);
  var hasDefaults = false;
  propNames.forEach(function (propName) {
    // would be nice if this could be done lazily via defineProperty, but this causes
    // Object.assign to fail because the property has no setter
    var defaultValue = MetadataUtils.getDefaultValue(metadata[propName], shouldFreeze);

    if (defaultValue !== undefined) {
      defaults[propName] = defaultValue;
      hasDefaults = true;
    }
  });
  return hasDefaults ? defaults : null;
};
/**
 * Helper to deep freeze object literals. This method will walk arrays and
 * freeze array contents as needed. If anything other than a plain old object,
 * we will not attempt to freeze it so the owner should ensure that the
 * object is immutable.
 * @param {any} value The value to freeze
 * @return {any}
 * @ignore
 */


MetadataUtils.deepFreeze = function (value) {
  if (Object.isFrozen(value)) {
    return value;
  } else if (Array.isArray(value)) {
    // eslint-disable-next-line no-param-reassign
    value = value.map(function (item) {
      return MetadataUtils.deepFreeze(item);
    });
  } else if (value !== null && _typeof(value) === 'object') {
    // We should only recurse/freeze if value is a pojo.
    // proto will be null if Object.create(null) was used
    var proto = Object.getPrototypeOf(value);

    if (proto === null || proto === Object.prototype) {
      // Retrieve the property names defined on object
      Object.keys(value).forEach(function (name) {
        // eslint-disable-next-line no-param-reassign
        value[name] = MetadataUtils.deepFreeze(value[name]);
      });
      Object.freeze(value);
    }
  }

  return value;
};

;return MetadataUtils;
});