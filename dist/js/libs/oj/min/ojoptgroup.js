/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a){a.J.$a("oj-optgroup",null,{properties:{disabled:{type:"boolean"},label:{type:"string"},customOptgroupRenderer:{}},extension:{Gq:function(a){var c=a.customOptgroupRenderer;c&&"function"===typeof c&&c(a)}}});a.J.register("oj-optgroup",{metadata:a.J.getMetadata("oj-optgroup")})});