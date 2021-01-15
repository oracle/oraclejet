(function() {
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojmetadatautils'], function (exports, MetadataUtils) {
  'use strict';

  function getFrozenDefault(property, constr, metadata) {
    var defaults = getDefaults(constr, metadata, true);
    return MetadataUtils.deepFreeze(defaults[property]);
  }

  function getDefaults(constr, metadata, shouldFreeze) {
    var defaults = constr['_defaults'];

    if (defaults === undefined) {
      var staticDefaults = getStaticDefaults(constr, metadata, shouldFreeze);
      defaults = Object.create(staticDefaults);
      applyDynamicDefaults(constr, defaults);
      constr['_defaults'] = defaults;
    }

    return defaults;
  }

  function getStaticDefaults(constr, metadata, shouldFreeze) {
    var _a;

    var defaults = constr['_staticDefaults'];

    if (defaults === undefined) {
      defaults = null;

      if (metadata) {
        var propertiesMetadata = metadata.properties;
        var PropDefaults = (_a = metadata.extension) === null || _a === void 0 ? void 0 : _a._DEFAULTS;

        if (PropDefaults) {
          var defaultsInstance = new PropDefaults();
          defaults = Object.create(defaultsInstance);
        } else if (propertiesMetadata) {
          defaults = Object.create(MetadataUtils.getDefaultValues(propertiesMetadata, shouldFreeze));
        }
      }

      constr['_staticDefaults'] = defaults;
    }

    return defaults;
  }

  function applyDynamicDefaults(constr, props) {
    if (constr['getDynamicDefaults']) {
      var dynamicDefaults = constr['getDynamicDefaults']();

      if (dynamicDefaults) {
        for (var key in dynamicDefaults) {
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
  exports.DefaultsUtils = DefaultsUtils;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())