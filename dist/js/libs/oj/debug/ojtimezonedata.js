/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojL10n!ojtranslations/nls/timezoneData', 'ojs/ojlocaledata'], function(oj, ojtd, LocaleData)
{
  "use strict";

/* global ojtd:true, LocaleData:false*/


/**
 * Internal utilities for dealing with timezone data
 * @ignore
 */
oj.TimezoneData = {};

/**
 * Merges timezone data bundle into the LocaleElements bundle
 * @param {Object} timezoneBundle bundle to merge into the LocaleElements bundle
 * @ignore
 */
oj.TimezoneData.__mergeIntoLocaleElements = function (timezoneBundle) {
  var localeElements = LocaleData.__getBundle();
  oj.CollectionUtils.copyInto(localeElements, timezoneBundle, undefined, true);
};


/**
 * @return {Array.<string>} names of the timezone bundles
 * @ignore
 */
oj.TimezoneData.__getBundleNames = function () {
  return oj.TimezoneData._bundleNames;
};

/**
 * @param {string} name bundle name
 * @ignore
 */
oj.TimezoneData.__registerBundleName = function (name) {
  oj.TimezoneData._bundleNames.push(name);
};

/**
 * @ignore
 */
oj.TimezoneData._bundleNames = [];


(function () {
  oj.TimezoneData.__registerBundleName('/timezoneData');
  oj.TimezoneData.__mergeIntoLocaleElements(typeof ojtd === 'undefined' ? {} : ojtd);
}());

});