/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","jquery","hammerjs"],function(e,t,a){var r;a?(t.fn.ojHammer=function(e){switch(e){case"instance":return this.data("ojHammer");case"destroy":return this.each(function(){var e=t(this),a=e.data("ojHammer");a&&(a.destroy(),e.removeData("ojHammer"))});default:return this.each(function(){var r=t(this);r.data("ojHammer")||r.data("ojHammer",new a.Manager(r[0],e))})}},a.Manager.prototype.emit=(r=a.Manager.prototype.emit,function(e,a){r.call(this,e,a),t(this.element).trigger({type:e,gesture:a})})):e.Logger.warn("Hammer jQuery extension loaded without Hammer.")});