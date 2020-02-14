/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojmetadatautils'], function(MetadataUtils)
{
  "use strict";

/**
 * Internal module for VComponent related utility methods.
 * @private
 */
var DefaultsUtils;
(function (DefaultsUtils) {
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
    DefaultsUtils.getDefaults = getDefaults;
    function getStaticDefaults(constr, metadata, shouldFreeze) {
        // Defaults are created once and stashed on the constructor
        let defaults = constr['_staticDefaults'];
        if (defaults === undefined) {
            if (metadata) {
                const propertiesMetadata = metadata.properties;
                if (propertiesMetadata) {
                    defaults = Object.create(MetadataUtils.getDefaultValues(propertiesMetadata, shouldFreeze));
                }
            }
            else {
                defaults = null;
            }
            constr['_staticDefaults'] = defaults;
        }
        return defaults;
    }
    DefaultsUtils.getStaticDefaults = getStaticDefaults;
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
    DefaultsUtils.applyDynamicDefaults = applyDynamicDefaults;
})(DefaultsUtils || (DefaultsUtils = {}));

;return DefaultsUtils;
});