/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";const t=function(e){this.observers=[],this._value=e};t.prototype.subscribe=function(e,t,i){let o=e;"function"==typeof o?o={next:e,error:t,complete:i}:"object"!=typeof o&&(o={}),this.observers.push(o);let r=new s(this,o);return r&&!r.closed&&o.next(this._value),r},t.prototype.next=function(e){this._value=e;let{observers:t}=this,s=t.length,i=t.slice();for(let t=0;t<s;t++)i[t].next(e)};const s=function(e,t){this.subject=e,this.subscriber=t,this.closed=!1};s.prototype.unsubscribe=function(){if(this.closed)return;this.closed=!0;let e=this.subject.observers;if(this.subject=null,!e||0===e.length)return;let t=e.indexOf(this.subscriber);-1!==t&&e.splice(t,1)},s.prototype.closed=function(){return this.closed},e.BehaviorSubject=t,e.SubjectSubscription=s,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojobservable.js.map