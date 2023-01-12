/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojlocaledata', 'ojL10n!ojtranslations/nls/timezoneData'], function (oj, LocaleData, ojtd) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  ojtd = ojtd && Object.prototype.hasOwnProperty.call(ojtd, 'default') ? ojtd['default'] : ojtd;

  /**
   * Internal utilities for dealing with timezone data
   * @ignore
   */
  const TimezoneData = {};
  oj._registerLegacyNamespaceProp('TimezoneData', TimezoneData);

  /**
   * Merges timezone data bundle into the LocaleElements bundle
   * @param {Object} timezoneBundle bundle to merge into the LocaleElements bundle
   * @ignore
   */
  TimezoneData.__mergeIntoLocaleElements = function (timezoneBundle) {
    var localeElements = LocaleData.__getBundle();
    oj.CollectionUtils.copyInto(localeElements, timezoneBundle, undefined, true);
  };

  /**
   * @return {Array.<string>} names of the timezone bundles
   * @ignore
   */
  TimezoneData.__getBundleNames = function () {
    return TimezoneData._bundleNames;
  };

  /**
   * @param {string} name bundle name
   * @ignore
   */
  TimezoneData.__registerBundleName = function (name) {
    TimezoneData._bundleNames.push(name);
  };

  /**
   * @ignore
   */
  TimezoneData._bundleNames = [];

  (function () {
    TimezoneData.__registerBundleName('/timezoneData');
    TimezoneData.__mergeIntoLocaleElements(typeof ojtd === 'undefined' ? {} : ojtd);
  })();

  return TimezoneData;

});
