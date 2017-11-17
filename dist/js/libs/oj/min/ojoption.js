/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,g){var c={BHa:function(a,c){g.each(c,function(c,d){a.appendChild(d)})},eWa:function(a,c){g.each(c,function(c,d){a.removeChild(d)})},HHa:function(b){var d=a.J.Dn(b),e=["startIcon","","endIcon"];g.each(d,function(a,d){-1==e.indexOf(a)&&c.eWa(b,d)});g.each(e,function(a,e){d[e]&&c.BHa(b,d[e])})},render:function(a){var d=a.customOptionRenderer;c.HHa(a);d&&"function"===typeof d&&d(a)}};a.J.Ua("oj-option",null,{properties:{disabled:{type:"boolean",
value:!1},value:{type:"any",value:null},customOptionRenderer:{}},events:{action:{}},extension:{rp:c.render}});a.J.register("oj-option",{metadata:a.J.getMetadata("oj-option")})});