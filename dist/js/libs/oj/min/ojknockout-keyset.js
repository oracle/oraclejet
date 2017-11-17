/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","knockout","ojs/ojkeyset"],function(a,g){function c(b){b=b||new a.yba;b=g.observable(b);Object.setPrototypeOf(b,c.Zf);return b}c.Zf=Object.create(g.observable.fn);g.utils.arrayForEach(["add","addAll","clear","delete"],function(a){c.Zf[a]=function(){var c=this.peek();this(c[a].apply(c,arguments));return this}});return{ObservableExpandedKeySet:c}});