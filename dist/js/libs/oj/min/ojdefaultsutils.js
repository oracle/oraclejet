/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojmetadatautils"],function(t){"use strict";var e;return function(e){function a(e,a,i){let f=e._staticDefaults;if(void 0===f){if(a){const e=a.properties;e&&(f=Object.create(t.getDefaultValues(e,i)))}else f=null;e._staticDefaults=f}return f}function i(t,e){if(t.getDynamicDefaults){const a=t.getDynamicDefaults();if(a)for(let t in a)void 0===e[t]&&(e[t]=a[t])}}e.getDefaults=function(t,e,f){let n=t._defaults;if(void 0===n){const u=a(t,e,f);i(t,n=Object.create(u)),t._defaults=n}return n},e.getStaticDefaults=a,e.applyDynamicDefaults=i}(e||(e={})),e});