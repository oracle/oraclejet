/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","jquery"],function(t,e){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;const o=function(t){this.Init(t)};return t.Object.createSubclass(o,t.Object,"oj.Converter"),o.prototype.Init=function(t){o.superclass.Init.call(this),this._options=t},o.prototype.getOptions=function(){return this._options||{}},o.prototype.resolvedOptions=function(){var t={};return e.extend(t,this._options),t},o});
//# sourceMappingURL=ojconverter.js.map