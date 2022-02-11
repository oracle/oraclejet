/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojmetadatautils"],function(e,t){"use strict";function n(e,t,n){let l=e._defaults;if(void 0===l){const s=i(e,t,n);l=Object.create(s),a(e,l),e._defaults=l}return l}function i(e,n,i){var a;let l=e._staticDefaults;if(void 0===l){if(l=null,n){const e=n.properties,s=null===(a=n.extension)||void 0===a?void 0:a._DEFAULTS;if(s){const e=new s;l=Object.create(e)}else e&&(l=Object.create(t.getDefaultValues(e,i)))}e._staticDefaults=l}return l}function a(e,t){if(e.getDynamicDefaults){const n=e.getDynamicDefaults();if(n)for(let e in n)void 0===t[e]&&(t[e]=n[e])}}var l=Object.freeze({__proto__:null,getFrozenDefault:function(e,i,a){const l=n(i,a,!0);return t.deepFreeze(l[e])},getDefaults:n,getStaticDefaults:i,applyDynamicDefaults:a});e.DefaultsUtils=l,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdefaultsutils.js.map