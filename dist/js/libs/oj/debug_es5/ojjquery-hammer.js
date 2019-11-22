/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'hammerjs', 'ojs/ojlogger'], function(oj, $, Hammer, Logger) 
{
  "use strict";

// Forked from Version 2.0.0 of https://github.com/hammerjs/jquery.hammer.js, retrieved 2/4/2015.

/* global Hammer:false, Logger:false */
if (Hammer) {
  /** @export */
  $.fn.ojHammer = function (options) {
    switch (options) {
      // $(...).ojHammer("instance") returns the Hammer instance previously instantiated on this element via $(...).ojHammer(options), or undefined if none.
      case 'instance':
        return this.data('ojHammer');
      // $(...).ojHammer("destroy") destroys the Hammer instance and removes it from the node's data store.

      case 'destroy':
        return this.each(function () {
          var $el = $(this);
          var hammer = $el.data('ojHammer');

          if (hammer) {
            hammer.destroy();
            $el.removeData('ojHammer');
          }
        });

      default:
        // $(...).ojHammer(options) instantiates Hammer on this element, and stores it for later retrieval via $(...).ojHammer("instance")
        return this.each(function () {
          var $el = $(this);

          if (!$el.data('ojHammer')) {
            $el.data('ojHammer', new Hammer.Manager($el[0], options));
          }
        });
    }
  }; // extend the emit method to also trigger jQuery events


  Hammer.Manager.prototype.emit = function (originalEmit) {
    return function (type, data) {
      originalEmit.call(this, type, data);
      $(this.element).trigger({
        type: type,
        gesture: data
      });
    };
  }(Hammer.Manager.prototype.emit);
} else {
  Logger.warn('Hammer jQuery extension loaded without Hammer.');
}

});