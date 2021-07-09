/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojeventtarget"],function(e,t){"use strict";class r extends t.GenericEvent{constructor(){super("refresh",{})}}class s extends t.GenericEvent{constructor(e){let t={};t[s._DETAIL]=e,super("add",t)}}s._DETAIL="detail";class n extends t.GenericEvent{constructor(e){let t={};t[n._DETAIL]=e,super("remove",t)}}n._DETAIL="detail";class d extends t.GenericEvent{constructor(e){let t={};t[d._DETAIL]=e,super("update",t)}}d._DETAIL="detail",e.DataGridProviderAddEvent=s,e.DataGridProviderRefreshEvent=r,e.DataGridProviderRemoveEvent=n,e.DataGridProviderUpdateEvent=d,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdatagridprovider.js.map