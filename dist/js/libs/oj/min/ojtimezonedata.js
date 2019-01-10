/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","ojL10n!ojtranslations/nls/timezoneData","ojs/ojlocaledata","ojs/ojvalidation-base"],function(e,a,n){e.TimezoneData={},e.TimezoneData.__mergeIntoLocaleElements=function(a){var o=n.__getBundle();e.CollectionUtils.copyInto(o,a,void 0,!0)},e.TimezoneData.__getBundleNames=function(){return e.TimezoneData._bundleNames},e.TimezoneData.__registerBundleName=function(a){e.TimezoneData._bundleNames.push(a)},e.TimezoneData._bundleNames=[],e.TimezoneData.__registerBundleName("/timezoneData"),e.TimezoneData.__mergeIntoLocaleElements(void 0===a?{}:a)});