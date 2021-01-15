/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojlogger","hammerjs","jquery"],function(e,t,a){"use strict";var r;a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a,
/**
   * @license
   * Copyright (c) 2015 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
t?(a.fn.ojHammer=function(e){switch(e){case"instance":return this.data("ojHammer");case"destroy":return this.each(function(){var e=a(this),t=e.data("ojHammer");t&&(t.destroy(),e.removeData("ojHammer"))});default:return this.each(function(){var r=a(this);r.data("ojHammer")||r.data("ojHammer",new t.Manager(r[0],e))})}},t.Manager.prototype.emit=(r=t.Manager.prototype.emit,function(e,t){r.call(this,e,t),a(this.element).trigger({type:e,gesture:t})})):e.warn("Hammer jQuery extension loaded without Hammer.")});
//# sourceMappingURL=ojjquery-hammer.js.map