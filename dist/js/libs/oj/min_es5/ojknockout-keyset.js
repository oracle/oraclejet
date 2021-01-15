/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","knockout","ojs/ojkeyset"],function(e,t,r){"use strict";
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */var o=function e(o){var a=o||new r.ExpandedKeySet,n=t.observable(a);return Object.setPrototypeOf(n,e.proto),n};o.proto=Object.create(t.observable.fn),t.utils.arrayForEach(["add","addAll","clear","delete"],function(e){o.proto[e]=function(){var t=this.peek(),r=t[e].apply(t,arguments);return this(r),this}});
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var a=function e(o){var a=o||new r.KeySetImpl,n=t.observable(a);return Object.setPrototypeOf(n,e.proto),n};a.proto=Object.create(t.observable.fn),t.utils.arrayForEach(["add","addAll","clear","delete"],function(e){a.proto[e]=function(){var t=this.peek(),r=t[e].apply(t,arguments);return this(r),this}}),e.ObservableExpandedKeySet=o,e.ObservableKeySet=a,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojknockout-keyset.js.map