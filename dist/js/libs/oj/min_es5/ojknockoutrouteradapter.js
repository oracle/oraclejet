!function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["knockout","ojs/ojlogger"],function(e,n){"use strict";
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */return function(){function r(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);var o=e.observable();this._observableState=e.pureComputed({read:function(){return o()},write:function(){throw Error('"state" observable cannot be written to')}}),this._observablePath=e.pureComputed({read:function(){return o()&&o().path},write:function(e){t.go({path:e||""}).catch(function(t){n.info("KnockoutRouterAdapter router.go() failed with: "+t),o.valueHasMutated()})}}),this._observablePath.equalityComparer=null,this._stateSubscription=t.currentState.subscribe(function(t){o(t.state)})}var o,a,u;return o=r,(a=[{key:"destroy",value:function(){this._stateSubscription.unsubscribe()}},{key:"state",get:function(){return this._observableState}},{key:"path",get:function(){return this._observablePath}}])&&t(o.prototype,a),u&&t(o,u),r}()})}();
//# sourceMappingURL=ojknockoutrouteradapter.js.map