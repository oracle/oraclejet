/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","jquery","ojs/ojcomponentcore"],function(t,e,n){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;const o={};return t._registerLegacyNamespaceProp("DataCollectionEditUtils",o),o.basicHandleEditEnd=function(t,o){null!=o&&null!=o.cellContext||(o=t.detail);var l=e(o.cellContext.parentElement).find(".oj-component-initnode")[0],a=n.__GetWidgetConstructor(l);o.cancelEdit?a("reset"):(a("validate"),a("isValid")||t.preventDefault())},o.basicHandleRowEditEnd=function(t,o){null!=o&&null!=o.rowContext||(o=t.detail);for(var l=e(o.rowContext.parentElement).find(".oj-component-initnode"),a=0;a<l.length;a++){var r=n.__GetWidgetConstructor(l[a]),i=o.cancelEdit;try{if(i)r("reset");else if(r("validate"),!r("isValid"))return!1}catch(t){}}return!0},o});
//# sourceMappingURL=ojdatacollection-utils.js.map