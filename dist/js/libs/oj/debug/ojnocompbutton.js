/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore'], 
  /*        
    * @param {Object} oj         
    * @param {jQuery} $        
  */
function(oj, $)
{
  "use strict";


/**
 * @class oj.NocompButtonUtils
 * @classdesc JET Nocomp Button Utils
 * @export
 * @since 7.1.0
 * @hideconstructor
 * @ignore
 *
 */
var NocompButtonUtils = {};

/**
 * Takes in a nocompButton element and sets up the nocomp button workarounds
 * Workarounds include focus ring suppression adn action on ENTER-key
 * @param {Element} nocompButton the nocomp button element
 * @private
 * @ignore
 */
NocompButtonUtils.setup = function (nocompButton) {
  // Add conditional supression of focus ring
  oj.DomUtils.makeFocusable({
    element: $(nocompButton),
    applyHighlight: true
  });
  // Add action on ENTER-key
  nocompButton.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
      nocompButton.classList.add('oj-active');
    }
  });
  nocompButton.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      nocompButton.classList.remove('oj-active');
      nocompButton.click();
    }
  });
};


  ;return NocompButtonUtils;
});