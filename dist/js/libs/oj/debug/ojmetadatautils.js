/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojcustomelement-utils'], function (exports, oj, ojcustomelementUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  /**
   * Component Metadata utilities.
   * @class MetadataUtils
   * @export
   * @ignore
   */
  const MetadataUtils = {};

  /**
   * Default values can be specified at the top level or at leaf subproperties.
   * This utility walks complex property subproperties to generate default value.
   * @property {object} metadata property-level metadata
   * @property {boolean?} shouldFreeze Contol whether we copy or freeze Object/Array types
   * @memberof MetadataUtils
   * @ignore
   */
  MetadataUtils.getDefaultValue = function (metadata, shouldFreeze) {
    let defaultValue = metadata.value;
    if (defaultValue === undefined) {
      // If top level metadata isn't specified, check subproperties.
      // Note that we are not handling cases where both top level and subproperty
      // default values are provided, leaving that to auditing and build tools to check.
      const subMeta = metadata.properties;
      if (subMeta) {
        const complexValue = {};
        const keys = Object.keys(subMeta);
        for (let i = 0; i < keys.length; i++) {
          const subpropDefault = MetadataUtils.getDefaultValue(subMeta[keys[i]]);
          if (subpropDefault !== undefined) {
            complexValue[keys[i]] = subpropDefault;
          }
        }
        // Cache the default value on the top level property. This is ok
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
      } else if (defaultValue !== null && typeof defaultValue === 'object') {
        defaultValue = shouldFreeze
          ? MetadataUtils.deepFreeze(defaultValue)
          : oj.CollectionUtils.copyInto({}, defaultValue, undefined, true);
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
    const defaults = {};
    const propNames = Object.keys(metadata);
    let hasDefaults = false;
    propNames.forEach(function (propName) {
      // would be nice if this could be done lazily via defineProperty, but this causes
      // Object.assign to fail because the property has no setter
      const defaultValue = MetadataUtils.getDefaultValue(metadata[propName], shouldFreeze);
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
      value = value.map((item) => MetadataUtils.deepFreeze(item));
      Object.freeze(value);
    } else if (value !== null && typeof value === 'object') {
      // We should only recurse/freeze if value is a pojo.
      // proto will be null if Object.create(null) was used
      const proto = Object.getPrototypeOf(value);
      // We want to freeze all POJOs except for VNodes
      if ((proto === null || proto === Object.prototype) && !isVNode(value)) {
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

  function isVNode(obj) {
    // we know preact/compat is in the stack and its options.vnode hook
    // injects a $$typeof property into every VNode so we'll use that
    // as a heuristic for identifying VNodes
    return Object.prototype.hasOwnProperty.call(obj, '$$typeof');
  }

  /**
   * Gets property metadata for the specified property or subproperty.
   * @param {*} propPath
   * @param {*} metadata
   * @returns {object}
   * @ignore
   */
  MetadataUtils.getPropertyMetadata = function (propPath, metadata) {
    const { subProp } = MetadataUtils.getComplexPropertyMetadata(propPath, metadata);
    return subProp;
  };

  /**
   * Retrieves an object that contains two values - metadata for the top level property and for the subproperty.
   * The top level property is needed for writeback and readonly checks for complex properties.
   * The values will be identical if the property is already top level.
   * @param {*} propPath
   * @param {*} metadata
   * @returns {object}
   * @ignore
   */
  MetadataUtils.getComplexPropertyMetadata = function (propPath, metadata) {
    let subProp = metadata;
    let prop = metadata;

    if (subProp && propPath) {
      const namePath = propPath.split('.');
      for (let i = 0; i < namePath.length; i++) {
        subProp = subProp[namePath[i]];
        if (i === 0) {
          prop = subProp;
        }
        if (!subProp || namePath.length === 1 || i === namePath.length - 1 || !subProp.properties) {
          break;
        }
        subProp = subProp.properties;
      }
    }
    return { prop, subProp };
  };

  /**
   * Checks to see whether a value is valid for an element property's enum and throws an error if not.
   * @param  {Element}  element The custom element
   * @param  {string}  property The property to check
   * @param  {string}  value The property value
   * @param  {Object}  metadata The property metadata
   * @ignore
   */
  MetadataUtils.checkEnumValues = function (element, property, value, metadata) {
    // Only check enum values for string types
    if (typeof value === 'string' && metadata) {
      const enums = metadata.enumValues;
      if (enums && enums.indexOf(value) === -1) {
        throw new Error(
          `Invalid value '${value}' found for property '${property}'.\
Expected one of the following '${enums.toString()}'.`
        );
      }
    }
  };

  /**
   * Returns the attributes including the flattened dot notation versions of all complex properties.
   * @param {Object} props The properties object
   * @return {Array}
   * @ignore
   */
  MetadataUtils.getFlattenedAttributes = function (props) {
    const attrs = [];
    MetadataUtils._getAttributesFromProperties('', props, attrs);
    return attrs;
  };

  /**
   * Helper method which returns the attributes including the dot notation versions of all complex attributes
   * stored on a bridge instance
   * @param {string} parentPath The path from any parent complex property or empty string if evaluating a top level property
   * @param {Object} props The properties metadata object
   * @param {Array} attrs The attribute array to add to
   * @ignore
   */
  MetadataUtils._getAttributesFromProperties = function (parentPath, props, attrs) {
    if (props) {
      const propKeys = Object.keys(props);
      propKeys.forEach((prop) => {
        const propMeta = props[prop];
        const concatName = parentPath + prop;
        attrs.push(ojcustomelementUtils.AttributeUtils.propertyNameToAttribute(concatName));
        if (propMeta.properties) {
          MetadataUtils._getAttributesFromProperties(concatName + '.', propMeta.properties, attrs);
        }
      });
    }
  };

  const getDefaultValue = MetadataUtils.getDefaultValue;
  const getDefaultValues = MetadataUtils.getDefaultValues;
  const deepFreeze = MetadataUtils.deepFreeze;
  const getPropertyMetadata = MetadataUtils.getPropertyMetadata;
  const getComplexPropertyMetadata = MetadataUtils.getComplexPropertyMetadata;
  const checkEnumValues = MetadataUtils.checkEnumValues;
  const getFlattenedAttributes = MetadataUtils.getFlattenedAttributes;

  exports.checkEnumValues = checkEnumValues;
  exports.deepFreeze = deepFreeze;
  exports.getComplexPropertyMetadata = getComplexPropertyMetadata;
  exports.getDefaultValue = getDefaultValue;
  exports.getDefaultValues = getDefaultValues;
  exports.getFlattenedAttributes = getFlattenedAttributes;
  exports.getPropertyMetadata = getPropertyMetadata;

  Object.defineProperty(exports, '__esModule', { value: true });

});
