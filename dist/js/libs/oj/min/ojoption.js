/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,g){var c={GDa:function(a,c){g.each(c,function(c,d){a.appendChild(d)})},HRa:function(a,c){g.each(c,function(c,d){a.removeChild(d)})},LDa:function(b){var d=a.J.lo(b),e=["startIcon","","endIcon"];g.each(d,function(a,d){-1==e.indexOf(a)&&c.HRa(b,d)});g.each(e,function(a,e){d[e]&&c.GDa(b,d[e])})},render:function(a){var d=a.customOptionRenderer;c.LDa(a);d&&"function"===typeof d&&d(a)}};a.J.$a("oj-option",null,{properties:{disabled:{type:"boolean"},
value:{type:"any"},customOptionRenderer:{}},events:{action:{}},extension:{Gq:c.render}});a.J.register("oj-option",{metadata:a.J.getMetadata("oj-option")})});