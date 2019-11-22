/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","ojL10n!ojtranslations/nls/timezoneData","ojs/ojlocaledata"],function(e,n,a){"use strict";e.TimezoneData={},e.TimezoneData.__mergeIntoLocaleElements=function(n){var o=a.__getBundle();e.CollectionUtils.copyInto(o,n,void 0,!0)},e.TimezoneData.__getBundleNames=function(){return e.TimezoneData._bundleNames},e.TimezoneData.__registerBundleName=function(n){e.TimezoneData._bundleNames.push(n)},e.TimezoneData._bundleNames=[],e.TimezoneData.__registerBundleName("/timezoneData"),e.TimezoneData.__mergeIntoLocaleElements(void 0===n?{}:n)});