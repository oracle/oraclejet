/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","knockout","ojs/ojkeyset"],function(a,g){function c(b){b=b||new a.VY;b=g.observable(b);Object.setPrototypeOf(b,c.Lf);return b}c.Lf=Object.create(g.observable.fn);g.utils.arrayForEach(["add","addAll","clear","delete"],function(a){c.Lf[a]=function(){var c=this.peek();this(c[a].apply(c,arguments));return this}});return{ObservableExpandedKeySet:c}});