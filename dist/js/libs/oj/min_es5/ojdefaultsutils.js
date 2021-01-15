/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojmetadatautils"],function(e,t){"use strict";function a(e,t,a){var u=e._defaults;if(void 0===u){var f=i(e,t,a);r(e,u=Object.create(f)),e._defaults=u}return u}function i(e,a,i){var r,u=e._staticDefaults;if(void 0===u){if(u=null,a){var f=a.properties,n=null===(r=a.extension)||void 0===r?void 0:r._DEFAULTS;if(n){var l=new n;u=Object.create(l)}else f&&(u=Object.create(t.getDefaultValues(f,i)))}e._staticDefaults=u}return u}function r(e,t){if(e.getDynamicDefaults){var a=e.getDynamicDefaults();if(a)for(var i in a)void 0===t[i]&&(t[i]=a[i])}}var u=Object.freeze({__proto__:null,getFrozenDefault:function(e,i,r){var u=a(i,r,!0);return t.deepFreeze(u[e])},getDefaults:a,getStaticDefaults:i,applyDynamicDefaults:r});e.DefaultsUtils=u,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdefaultsutils.js.map