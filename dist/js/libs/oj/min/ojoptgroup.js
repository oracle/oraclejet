/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(e,t){function o(e){this.updateDOM=function(){var t=e.element.customOptgroupRenderer;t&&"function"==typeof t&&t(e.element)}}var r;r={properties:{disabled:{type:"boolean",value:!1},label:{type:"string",value:""},customOptgroupRenderer:{}},extension:{_CONSTRUCTOR:o}},e.CustomElementBridge.registerMetadata("oj-optgroup",null,r),e.CustomElementBridge.register("oj-optgroup",{metadata:e.CustomElementBridge.getMetadata("oj-optgroup")})});