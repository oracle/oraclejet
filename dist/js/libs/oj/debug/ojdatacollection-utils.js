/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery'], function(oj, $)
{
  "use strict";

/**
 * This class contains all utility methods used by the data grid collection model.
 * @export
 */
oj.DataCollectionEditUtils = {};

/**
 * @export
 * @param {Object} event
 * @param {Object|null=} ui
 */
oj.DataCollectionEditUtils.basicHandleEditEnd = function (event, ui) {
  if (ui == null || ui.cellContext == null) {
    // eslint-disable-next-line no-param-reassign
    ui = event.detail;
  }
  var input = $(ui.cellContext.parentElement).find('.oj-component-initnode')[0];
  // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
  var widgetConstructor = oj.Components.__GetWidgetConstructor(input);
  var cancel = ui.cancelEdit;
  if (cancel) {
    // an escape key was pressed so reset the data before we lose focus on the input
    widgetConstructor('reset');
  } else {
    widgetConstructor('validate');
    if (!widgetConstructor('isValid')) {
      // not valid so do not allow edit to end
      event.preventDefault();
    }
  }
};

/**
 *
 * @param {Event} event <code class="prettyprint">jQuery</code> event object
 * @param {Object} ui Parameters
 * @property {Object} ui.rowContext the row context
 * @property {number} ui.cancelEdit whether the edit was canceled
 * @return {boolean} Whether to veto the event
 * @export
 * @expose
 * @memberof! oj.DataCollectionEditUtils
 * @instance
 */
oj.DataCollectionEditUtils.basicHandleRowEditEnd = function (event, ui) {
  if (ui == null || ui.rowContext == null) {
    // eslint-disable-next-line no-param-reassign
    ui = event.detail;
  }
  var inputComponents = $(ui.rowContext.parentElement).find('.oj-component-initnode');
  for (var i = 0; i < inputComponents.length; i++) {
    // For upstream or indirect dependency we will still rely components being registered on the oj namespace.
    var widgetConsructor = oj.Components.__GetWidgetConstructor(inputComponents[i]);
    var cancel = ui.cancelEdit;
    try {
      if (cancel) {
        // an escape key was pressed so reset the data before we lose focus on the input
        widgetConsructor('reset');
      } else {
        widgetConsructor('validate');
        if (!widgetConsructor('isValid')) {
          // not valid so do not allow edit to end
          return false;
        }
      }
    } catch (e) {
      // Ignore errors
    }
  }
  return true;
};

  return oj.DataCollectionEditUtils;
});