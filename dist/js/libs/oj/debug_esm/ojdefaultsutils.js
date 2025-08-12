/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { deepFreeze, getDefaultValues } from 'ojs/ojmetadatautils';

/**
 * Utility methods for handling defaults coming from metadata,
 * Props classes, and dynamic defaults for various JET component
 * models.
 * @private
 */
function getFrozenDefault(property, constr, metadata) {
    const defaults = getDefaults(constr, metadata, true);
    // Default values must be either:
    // 1. primitives
    // 2. immutable classes, e.g. KeySetImpl
    // 3. Object/Arrays composed of #1 or #2
    return deepFreeze(defaults[property]);
}
function getDefaults(constr, metadata, shouldFreeze) {
    // Defaults are created once and stashed on the constructor
    let defaults = constr['_defaults'];
    if (defaults === undefined) {
        // Adding the optional shouldFreeze param for definitional elements so we don't break
        // backwards compatibility, but our preference is to freeze the defaults and clone internally
        // where needed instead (e.g. dot notation sets).
        const staticDefaults = getStaticDefaults(constr, metadata, shouldFreeze);
        // If staticDefaults is null Object.create will return an empty object
        defaults = Object.create(staticDefaults);
        // Metadata defaults always override dynamic defaults
        applyDynamicDefaults(constr, defaults);
        constr['_defaults'] = defaults;
    }
    return defaults;
}
function getStaticDefaults(constr, metadata, shouldFreeze) {
    // Defaults are created once and stashed on the constructor
    let defaults = constr['_staticDefaults'];
    if (defaults === undefined) {
        // Instantiate defaults to null in case we don't have metadata or properties
        // so when we call Object.create(null) we'll get an empty {} back vs an error for
        // Object.create(undefined);
        defaults = null;
        if (metadata) {
            const propertiesMetadata = metadata.properties;
            const PropDefaults = metadata.extension?._DEFAULTS;
            if (PropDefaults) {
                // For VComponents, use the Props class stashed in the metadata and instantiate
                // it in order to get the properties and default values.
                const defaultsInstance = new PropDefaults();
                defaults = Object.create(defaultsInstance);
            }
            else if (propertiesMetadata) {
                defaults = Object.create(
                // Adding the optional shouldFreeze param for definitional elements so we don't break
                // backwards compatibility, but our preference is to freeze the defaults and clone internally
                // where needed instead (e.g. dot notation sets).
                getDefaultValues(propertiesMetadata, shouldFreeze));
            }
        }
        constr['_staticDefaults'] = defaults;
    }
    return defaults;
}
// Keep for oj-form-layout which is the only usage
function applyDynamicDefaults(constr, props) {
    if (constr['getDynamicDefaults']) {
        const dynamicDefaults = constr['getDynamicDefaults']();
        if (dynamicDefaults) {
            // Dyanmic getters specified via the es6 get function() syntax
            // will be added to the object prototype instead of instance so we
            // use a for...in loop here instead of Object.keys
            // eslint-disable-next-line no-restricted-syntax
            for (let key in dynamicDefaults) {
                if (props[key] === undefined) {
                    props[key] = dynamicDefaults[key];
                }
            }
        }
    }
}

var DefaultsUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFrozenDefault: getFrozenDefault,
    getDefaults: getDefaults,
    getStaticDefaults: getStaticDefaults,
    applyDynamicDefaults: applyDynamicDefaults
});

export { DefaultsUtils };
