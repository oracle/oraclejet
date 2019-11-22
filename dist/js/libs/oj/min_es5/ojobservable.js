/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define([],function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}var e=function(t){this.observers=[],this._value=t};e.prototype.subscribe=function(e,s,r){var n=e;"function"==typeof n?n={next:e,error:s,complete:r}:"object"!==t(n)&&(n={}),this.observers.push(n);var i=new o(this,n);return i&&!i.closed&&n.next(this._value),i},e.prototype.next=function(t){this._value=t;for(var e=this.observers,o=e.length,s=e.slice(),r=0;r<o;r++)s[r].next(t)};var o=function(t,e){this.subject=t,this.subscriber=e,this.closed=!1};return o.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var t=this.subject.observers;if(this.subject=null,t&&0!==t.length){var e=t.indexOf(this.subscriber);-1!==e&&t.splice(e,1)}}},o.prototype.closed=function(){return this.closed},{BehaviorSubject:e}});