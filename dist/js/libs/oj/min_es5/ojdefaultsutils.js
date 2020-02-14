/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojmetadatautils"],function(t){"use strict";var e;return function(e){function a(e,a,i){var f=e._staticDefaults;if(void 0===f){if(a){var u=a.properties;u&&(f=Object.create(t.getDefaultValues(u,i)))}else f=null;e._staticDefaults=f}return f}function i(t,e){if(t.getDynamicDefaults){var a=t.getDynamicDefaults();if(a)for(var i in a)void 0===e[i]&&(e[i]=a[i])}}e.getDefaults=function(t,e,f){var u=t._defaults;if(void 0===u){var n=a(t,e,f);i(t,u=Object.create(n)),t._defaults=u}return u},e.getStaticDefaults=a,e.applyDynamicDefaults=i}(e||(e={})),e});