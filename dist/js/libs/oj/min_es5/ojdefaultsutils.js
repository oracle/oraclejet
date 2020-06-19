/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojmetadatautils"],function(e){"use strict";var t;return function(t){function a(t,a,i){var u,f=t._staticDefaults;if(void 0===f){if(f=null,a){var n=a.properties,r=null===(u=a.extension)||void 0===u?void 0:u._DEFAULTS;if(r){var l=new r;f=Object.create(l)}else n&&(f=Object.create(e.getDefaultValues(n,i)))}t._staticDefaults=f}return f}function i(e,t){if(e.getDynamicDefaults){var a=e.getDynamicDefaults();if(a)for(var i in a)void 0===t[i]&&(t[i]=a[i])}}t.getFrozenDefault=function(a,i,u){var f=t.getDefaults(i,u,!0);return e.deepFreeze(f[a])},t.getDefaults=function(e,t,u){var f=e._defaults;if(void 0===f){var n=a(e,t,u);i(e,f=Object.create(n)),e._defaults=f}return f},t.getStaticDefaults=a,t.applyDynamicDefaults=i}(t||(t={})),{DefaultsUtils:t}});