/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define([],function(){"use strict";var e=function(e){this.observers=[],this._value=e};e.prototype.subscribe=function(e,s,r){var i=e;"function"==typeof i?i={next:e,error:s,complete:r}:"object"!=typeof i&&(i={}),this.observers.push(i);var o=new t(this,i);return o&&!o.closed&&i.next(this._value),o},e.prototype.next=function(e){this._value=e;for(var t=this.observers,s=t.length,r=t.slice(),i=0;i<s;i++)r[i].next(e)};var t=function(e,t){this.subject=e,this.subscriber=t,this.closed=!1};return t.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var e=this.subject.observers;if(this.subject=null,e&&0!==e.length){var t=e.indexOf(this.subscriber);-1!==t&&e.splice(t,1)}}},t.prototype.closed=function(){return this.closed},{BehaviorSubject:e}});