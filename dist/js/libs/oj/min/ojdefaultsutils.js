/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojmetadatautils"],function(e,t){"use strict";function n(e,t,n){let s=e._defaults;if(void 0===s){const f=a(e,t,n);s=Object.create(f),i(e,s),e._defaults=s}return s}function a(e,n,a){let i=e._staticDefaults;if(void 0===i){if(i=null,n){const e=n.properties,s=n.extension?._DEFAULTS;if(s){const e=new s;i=Object.create(e)}else e&&(i=Object.create(t.getDefaultValues(e,a)))}e._staticDefaults=i}return i}function i(e,t){if(e.getDynamicDefaults){const n=e.getDynamicDefaults();if(n)for(let e in n)void 0===t[e]&&(t[e]=n[e])}}var s=Object.freeze({__proto__:null,getFrozenDefault:function(e,a,i){const s=n(a,i,!0);return t.deepFreeze(s[e])},getDefaults:n,getStaticDefaults:a,applyDynamicDefaults:i});e.DefaultsUtils=s,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdefaultsutils.js.map