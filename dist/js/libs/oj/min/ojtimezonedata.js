/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","ojL10n!ojtranslations/nls/timezoneData","ojs/ojvalidation-base"],function(e,a){e.TimezoneData={},e.TimezoneData.__mergeIntoLocaleElements=function(a){var n=e.LocaleData.__getBundle();e.CollectionUtils.copyInto(n,a,void 0,!0)},e.TimezoneData.__getBundleNames=function(){return e.TimezoneData._bundleNames},e.TimezoneData.__registerBundleName=function(a){e.TimezoneData._bundleNames.push(a)},e.TimezoneData._bundleNames=[],e.TimezoneData.__registerBundleName("/timezoneData"),e.TimezoneData.__mergeIntoLocaleElements(void 0===a?{}:a)});