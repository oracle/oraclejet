/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(t){"use strict";const e=function(t){this.observers=[],this._value=t};e.prototype.subscribe=function(t,e,o){let i=t;"function"==typeof i?i={next:t,error:e,complete:o}:"object"!=typeof i&&(i={}),this.observers.push(i);const n=new s(this,i);return n&&!n.closed&&i.next(this._value),n},e.prototype.next=function(t){this._value=t;const{observers:e}=this,s=e.length,o=e.slice();for(let e=0;e<s;e++)o[e].next(t)};const s=function(t,e){this.subject=t,this.subscriber=e,this.closed=!1};s.prototype.unsubscribe=function(){if(this.closed)return;this.closed=!0;const t=this.subject.observers;if(this.subject=null,!t||0===t.length)return;const e=t.indexOf(this.subscriber);-1!==e&&t.splice(e,1)},s.prototype.closed=function(){return this.closed},t.BehaviorSubject=e,t.SubjectSubscription=s,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojobservable.js.map