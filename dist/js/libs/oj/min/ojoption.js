/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,g){var c={DIa:function(a,c){g.each(c,function(c,d){a.appendChild(d)})},iXa:function(a,c){g.each(c,function(c,d){a.removeChild(d)})},JIa:function(b){var d=a.J.sl(b),e=["startIcon","","endIcon"];g.each(d,function(a,d){-1==e.indexOf(a)&&c.iXa(b,d)});g.each(e,function(a,e){d[e]&&c.DIa(b,d[e])})},render:function(a){var d=a.customOptionRenderer;c.JIa(a);d&&"function"===typeof d&&d(a)}};a.J.Ua("oj-option",null,{properties:{disabled:{type:"boolean",
value:!1},value:{type:"any",value:null},customOptionRenderer:{}},events:{action:{}},extension:{Gz:c.render}});a.J.register("oj-option",{metadata:a.J.getMetadata("oj-option")})});