/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","jquery","ojs/ojcomponentcore"],function(e,t,n){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var o={};return e._registerLegacyNamespaceProp("DataCollectionEditUtils",o),o.basicHandleEditEnd=function(e,o){null!=o&&null!=o.cellContext||(o=e.detail);var l=t(o.cellContext.parentElement).find(".oj-component-initnode")[0],a=n.__GetWidgetConstructor(l);o.cancelEdit?a("reset"):(a("validate"),a("isValid")||e.preventDefault())},o.basicHandleRowEditEnd=function(e,o){null!=o&&null!=o.rowContext||(o=e.detail);for(var l=t(o.rowContext.parentElement).find(".oj-component-initnode"),a=0;a<l.length;a++){var r=n.__GetWidgetConstructor(l[a]),i=o.cancelEdit;try{if(i)r("reset");else if(r("validate"),!r("isValid"))return!1}catch(e){}}return!0},o});
//# sourceMappingURL=ojdatacollection-utils.js.map