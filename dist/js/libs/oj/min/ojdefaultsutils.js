/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojmetadatautils"],function(e,t){"use strict";function a(e,t,a){let l=e._defaults;if(void 0===l){const u=i(e,t,a);l=Object.create(u),n(e,l),e._defaults=l}return l}function i(e,a,i){var n;let l=e._staticDefaults;if(void 0===l){if(l=null,a){const e=a.properties,f=null===(n=a.extension)||void 0===n?void 0:n._DEFAULTS;if(f){var u=new f;l=Object.create(u)}else e&&(l=Object.create(t.getDefaultValues(e,i)))}e._staticDefaults=l}return l}function n(e,t){if(e.getDynamicDefaults){const a=e.getDynamicDefaults();if(a)for(let e in a)void 0===t[e]&&(t[e]=a[e])}}var l=Object.freeze({__proto__:null,getFrozenDefault:function(e,i,n){var l=a(i,n,!0);return t.deepFreeze(l[e])},getDefaults:a,getStaticDefaults:i,applyDynamicDefaults:n});e.DefaultsUtils=l,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdefaultsutils.js.map