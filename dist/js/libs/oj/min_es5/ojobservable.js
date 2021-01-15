!function(){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */define(["exports"],function(e){"use strict";var o=function(t){this.observers=[],this._value=t};o.prototype.subscribe=function(e,o,r){var n=e;"function"==typeof n?n={next:e,error:o,complete:r}:"object"!==t(n)&&(n={}),this.observers.push(n);var i=new s(this,n);return i&&!i.closed&&n.next(this._value),i},o.prototype.next=function(t){this._value=t;for(var e=this.observers,o=e.length,s=e.slice(),r=0;r<o;r++)s[r].next(t)};var s=function(t,e){this.subject=t,this.subscriber=e,this.closed=!1};s.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var t=this.subject.observers;if(this.subject=null,t&&0!==t.length){var e=t.indexOf(this.subscriber);-1!==e&&t.splice(e,1)}}},s.prototype.closed=function(){return this.closed},e.BehaviorSubject=o,e.SubjectSubscription=s,Object.defineProperty(e,"__esModule",{value:!0})})}();
//# sourceMappingURL=ojobservable.js.map