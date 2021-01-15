/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcontext","ojs/ojvdom"],function(t,e,n){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;const s=n.h,r=n.classPropToObject;t.VComponent=
/**
     * @license
     * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
/**
     * @license
     * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
class{constructor(t){this._pendingPropsUpdate=!1,this._renderInterrupted=!1,this.props=t}updated(t,e){}mounted(){}unmounted(){}uniqueId(){return this._uniqueId}updateState(t){this._pendingStateUpdaters||(this._pendingStateUpdaters=[]),this._pendingStateUpdaters.push(t),this.queueRender(this._ref,"stateUpdate")}mount(t,e){return this._vnode=this._renderForMount(t,e),this._ref=n.mount(this._vnode,!0)}patch(t,e){const s=this.props,r=this.state,i=this._vnode,a=this._renderForPatch(t,e);this._vnode=n.patch(a,i,this._ref.parentNode,!0),this.updated(s,r)}notifyMounted(){this._renderIfNeeded(),n.mounted(this._vnode),this.mounted()}notifyUnmounted(){this._cancelQueuedRender(),n.unmount(this._vnode),this.unmounted()}queueRender(t,n){if(this._renderInterrupted=!1,"propsUpdate"===n&&(this._pendingPropsUpdate=!0),!this._busyStateCallbackForRender){const n=e.getContext(t).getBusyContext();this._busyStateCallbackForRender=n.addBusyState({description:this.uniqueId()+" is waiting to render."}),this._animation=window.requestAnimationFrame(()=>{const t=this._busyStateCallbackForRender,e=this._pendingPropsUpdate,n=this._pendingStateUpdaters;this._busyStateCallbackForRender=null,this._pendingPropsUpdate=!1,this._pendingStateUpdaters=null;try{const s=this._getCallback("getPropsForRender")(),r=this._doUpdateState(s,n);(e||r&&!this._areStatesEqual(this.state,r))&&(this._pendingState=r,this._getCallback("patch")(s,this._ref.parentNode))}catch(t){throw t}finally{this._cleanupRender(t)}})}}_cancelQueuedRender(){null!=this._animation&&(window.cancelAnimationFrame(this._animation),this._renderInterrupted=!0,this._cleanupRender(this._busyStateCallbackForRender),this._busyStateCallbackForRender=null)}_cleanupRender(t){t&&t(),this._pendingState=null,this._animation=null}_renderIfNeeded(){this._renderInterrupted&&this.queueRender(this._ref,"resume")}_renderForMount(t,e){if(this.state){const e=this.constructor.initStateFromProps;if(e){const n=e.call(this.constructor,t,this.state);this.state=this._getNewState(n)}}return this._render(t,e)}_renderForPatch(t,e){if(this.state){const e=this.constructor.updateStateFromProps;let n;e&&(n=e.call(this.constructor,t,this._pendingState||this.state,this.props)),this.state=this._getNewState(n,this._pendingState)}return this._render(t,e)}_render(t,e){return e&&e.length&&Object.assign(t,this._getCallback("convertChildrenToSlotProps")(e)),this.props=t,this.render()}_doUpdateState(t,e){if(!e||0===e.length)return null;return e.reduce((e,n)=>{const s="function"==typeof n?n(e,t):n;return Object.assign(e,s)},Object.assign({},this.state))}_areStatesEqual(t,e){return Object.keys(e).every(n=>t[n]===e[n])}_getCallback(t){return this._callbacks||(this._callbacks=this._getBuiltInCallbacks()),this._callbacks[t]}_getBuiltInCallbacks(){const t={getPropsForRender:()=>this.props,patch:(t,e)=>{this.patch(t,e)},convertChildrenToSlotProps:function(t){return{children:t}},_vcomp:!0};return t}_getNewState(t,e=null){return t||e?Object.assign({},e||this.state,t):this.state}},t.classPropToObject=r,t.dynamicDefault=function(t){return(e,n)=>{const s=Symbol();return{get(){const e=this[s];return void 0===e?t():e},set(t){this[s]=t}}}},t.flattenChildren=function(t){return n.flattenContent(t)},t.h=s,t.listener=function(t){return function(e,s,r){let i=null==r?void 0:r.value;return{configurable:!0,get(){const e=i.bind(this);return e[n.LISTENER_OPTIONS_SYMBOL]=t,Object.defineProperty(this,s,{configurable:!0,get:()=>e,set(t){i=t,delete this[s]}}),e},set(t){i=t}}}},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojvcomponent.js.map