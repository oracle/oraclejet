/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["knockout","ojs/ojlogger"],function(t,e){"use strict";return class{constructor(r){var a=t.observable();this._observableState=t.pureComputed({read:()=>a(),write:()=>{throw Error('"state" observable cannot be written to')}}),this._observablePath=t.pureComputed({read:()=>a()&&a().path,write:t=>{r.go({path:t}).catch(function(t){e.info("KnockoutRouterAdapter router.go() failed with: "+t),a.valueHasMutated()})}}),this._observablePath.equalityComparer=null,this._stateSubscription=r.currentState.subscribe(t=>{a(t.state)})}destroy(){this._stateSubscription.unsubscribe()}get state(){return this._observableState}get path(){return this._observablePath}}});