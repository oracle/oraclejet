/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","knockout","ojs/ojkeyset"],function(e,t){var r=function(o){var n=o||new e.ExpandedKeySet,a=t.observable(n);return Object.setPrototypeOf(a,r.proto),a};return r.proto=Object.create(t.observable.fn),t.utils.arrayForEach(["add","addAll","clear","delete"],function(e){r.proto[e]=function(){var t=this.peek();return this(t[e].apply(t,arguments)),this}}),{ObservableExpandedKeySet:r}});