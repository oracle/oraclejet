/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { warn } from 'ojs/ojlogger';
import * as Hammer from 'hammerjs';
import { Manager } from 'hammerjs';
import $ from 'jquery';

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
          $el.off('remove.ojHammer');
        });

      default:
        // $(...).ojHammer(options) instantiates Hammer on this element, and stores it for later retrieval via $(...).ojHammer("instance")
        return this.each(function () {
          var $el = $(this);
          if (!$el.data('ojHammer')) {
            const mgr = new Manager($el[0], options);
            $el.on('remove.ojHammer', (evt) => {
              if (evt.target === $el[0]) {
                mgr.destroy();
              }
            });
            $el.data('ojHammer', mgr);
          }
        });
    }
  };

  // extend the emit method to also trigger jQuery events
  Manager.prototype.emit = (function (originalEmit) {
    return function (type, data) {
      originalEmit.call(this, type, data);
      $(this.element).trigger({
        type: type,
        gesture: data
      });
    };
  })(Manager.prototype.emit);
} else {
  warn('Hammer jQuery extension loaded without Hammer.');
}
