/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import $ from 'jquery';
import { makeFocusable } from 'ojs/ojdomutils';

/**
 * @class NocompButtonUtils
 * @classdesc JET Nocomp Button Utils
 * @export
 * @since 7.1.0
 * @hideconstructor
 * @ignore
 *
 */
const NocompButtonUtils = {};

/**
 * Takes in a nocompButton element and sets up the nocomp button workarounds
 * Workarounds include focus ring suppression adn action on ENTER-key
 * @param {Element} nocompButton the nocomp button element
 * @private
 * @ignore
 */
NocompButtonUtils.setup = function (nocompButton) {
  // Add conditional supression of focus ring
  makeFocusable({
    element: $(nocompButton),
    applyHighlight: true
  });
  // Add action on ENTER-key
  nocompButton.addEventListener('keydown', function (event) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      nocompButton.classList.add('oj-active');
    }
  });
  nocompButton.addEventListener('keyup', function (event) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      nocompButton.classList.remove('oj-active');
      nocompButton.click();
    }
  });
};

const setup = NocompButtonUtils.setup;

export { setup };
