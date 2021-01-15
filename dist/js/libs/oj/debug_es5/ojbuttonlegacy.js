(function() {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcomponentcore', 'ojs/ojcore-base'], function (exports, ojcomponentcore, oj) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  var ButtonLegacy = function ButtonLegacy() {
    _classCallCheck(this, ButtonLegacy);
  };

  oj._registerLegacyNamespaceProp('ButtonLegacy', ButtonLegacy);

  exports.ButtonLegacy = ButtonLegacy;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())