/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","knockout","ojs/ojkeyset"],function(e,t,o){"use strict";e.ObservableExpandedKeySet=class{constructor(e){this._proto=Object.create(t.observable.fn);const r=e||new o.ExpandedKeySet,s=t.observable(r),n=this;return t.utils.arrayForEach(["add","addAll","clear","delete"],function(e){n._proto[e]=function(){const t=this.peek();return this(t[e].apply(t,arguments)),this}}),Object.setPrototypeOf(s,this._proto),s}},e.ObservableKeySet=class{constructor(e){this._proto=Object.create(t.observable.fn);const r=e||new o.KeySetImpl,s=t.observable(r),n=this;return t.utils.arrayForEach(["add","addAll","clear","delete"],function(e){n._proto[e]=function(){const t=this.peek();return this(t[e].apply(t,arguments)),this}}),Object.setPrototypeOf(s,this._proto),s}},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojknockout-keyset.js.map