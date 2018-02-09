/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a){a.J.Ua("oj-optgroup",null,{properties:{disabled:{type:"boolean",value:!1},label:{type:"string",value:""},customOptgroupRenderer:{}},extension:{Gz:function(a){var c=a.customOptgroupRenderer;c&&"function"===typeof c&&c(a)}}});a.J.register("oj-optgroup",{metadata:a.J.getMetadata("oj-optgroup")})});