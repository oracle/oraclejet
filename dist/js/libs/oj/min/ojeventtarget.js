/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base"],function(e,t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
class s{constructor(e,t){this.type=e,this.options=t,null!=t&&(this.detail=t.detail)}}t._registerLegacyNamespaceProp("GenericEvent",s);class r{addEventListener(e,t){this._eventListeners||(this._eventListeners=[]),this._eventListeners.push({type:e.toLowerCase(),listener:t})}removeEventListener(e,t){if(this._eventListeners){let s;for(s=this._eventListeners.length-1;s>=0;s--)this._eventListeners[s].type==e&&this._eventListeners[s].listener==t&&this._eventListeners.splice(s,1)}}dispatchEvent(e){if(this._eventListeners){var t,s=this._eventListeners.slice(0);for(t=0;t<s.length;t++){var r=s[t];if(e&&e.type&&r.type==e.type.toLowerCase()&&!1===r.listener.apply(this,[e]))return!1}}return!0}static applyMixin(e){[r].forEach(t=>{Object.getOwnPropertyNames(t.prototype).forEach(s=>{"constructor"!==s&&(e.prototype[s]=t.prototype[s])})})}}t._registerLegacyNamespaceProp("EventTargetMixin",r),e.EventTargetMixin=r,e.GenericEvent=s,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojeventtarget.js.map