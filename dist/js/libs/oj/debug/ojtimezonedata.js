/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'ojL10n!ojtranslations/nls/timezoneData', 'ojs/ojvalidation'], function(oj, ojtd)
{
/*
** Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/

/*global ojtd:true*/


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
oj.TimezoneData.__mergeIntoLocaleElements = function(timezoneBundle)
{
  var localeElements = oj.LocaleData.__getBundle();
  oj.CollectionUtils.copyInto(localeElements, timezoneBundle, undefined, true);
}


/**
 * @return {Array.<string>} names of the timezone bundles
 * @ignore
 */
oj.TimezoneData.__getBundleNames = function()
{
  return oj.TimezoneData._bundleNames;
}

/**
 * @param {string} name bundle name
 * @ignore
 */
oj.TimezoneData.__registerBundleName = function(name)
{
  oj.TimezoneData._bundleNames.push(name);
}

/**
 * @ignore
 */
oj.TimezoneData._bundleNames = [];


(function()
{
  oj.TimezoneData.__registerBundleName('/timezoneData');
  oj.TimezoneData.__mergeIntoLocaleElements(ojtd||{});
})();
});
