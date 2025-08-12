/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * A module responsible for mediating between the WebpackRequireFixupPlugin and the ojL10n-loader
 */
let _localizedBundles = new Map();

module.exports = {
  /**
   * Adds a new translation bundle reported by the ojL10n-loader
   * @param {string} id - bundle ID
   * @param {bundles} - Map<string, object> - a Map whose keys are supported locales (including root),
   * and the values are objects representing the merged translation bundles
   */
  setBundlesForId: (id, bundles) => _localizedBundles.set(id, bundles),
  getBundleMap: () => _localizedBundles
}
