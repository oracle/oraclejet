/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojcomponentcore"],function(e,t){"use strict";function o(e){this.updateDOM=function(){var t=e.element.customOptgroupRenderer;t&&"function"==typeof t&&t(e.element)}}var r;e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,(r={properties:{disabled:{type:"boolean",value:!1},label:{type:"string"}},methods:{getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}}).properties.customOptgroupRenderer={},r.extension._CONSTRUCTOR=o,e.CustomElementBridge.register("oj-optgroup",{metadata:r})});
//# sourceMappingURL=ojoptgroup.js.map