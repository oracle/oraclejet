/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojcomponentcore","jquery","ojs/ojcustomelement","ojs/ojcustomelement-utils"],function(e,t,o,n,r){"use strict";function i(e){function t(e){var t=r.CustomElementUtils.getSlotMap(e),n=["startIcon","","endIcon"];o.each(t,function(t,r){-1===n.indexOf(t)&&function(e,t){o.each(t,function(t,o){e.removeChild(o)})}(e,r)}),o.each(n,function(n,r){t[r]&&function(e,t){o.each(t,function(t,o){e.appendChild(o)})}(e,t[r])})}this.updateDOM=function(){var o=e.element.customOptionRenderer;t(e.element),o&&"function"==typeof o&&o(e.element)}}var s;e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o,(s={properties:{disabled:{type:"boolean",value:!1},value:{type:"any"}},methods:{getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}}).properties.customOptionRenderer={},s.extension._CONSTRUCTOR=i,e.CustomElementBridge.register("oj-option",{metadata:s})});
//# sourceMappingURL=ojoption.js.map