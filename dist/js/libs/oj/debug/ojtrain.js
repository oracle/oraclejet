/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery', 'ojs/ojcontext', 'ojs/ojthemeutils', 'ojs/ojcomponentcore'], function (oj, $, Context, ThemeUtils, ojcomponentcore) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

var __oj_train_metadata = 
{
  "properties": {
    "selectedStep": {
      "type": "string",
      "writeback": true
    },
    "steps": {
      "type": "Array<Object>"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "stepCurrent": {
          "type": "string"
        },
        "stepDisabled": {
          "type": "string"
        },
        "stepInfo": {
          "type": "string"
        },
        "stepMessageConfirmation": {
          "type": "string"
        },
        "stepMessageError": {
          "type": "string"
        },
        "stepMessageInfo": {
          "type": "string"
        },
        "stepMessageType": {
          "type": "string"
        },
        "stepMessageWarning": {
          "type": "string"
        },
        "stepNotVisited": {
          "type": "string"
        },
        "stepStatus": {
          "type": "string"
        },
        "stepVisited": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getNextSelectableStep": {},
    "getPreviousSelectableStep": {},
    "getProperty": {},
    "getStep": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "updateStep": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojBeforeDeselect": {},
    "ojBeforeSelect": {},
    "ojDeselect": {},
    "ojSelect": {}
  },
  "extension": {}
};
  /* global __oj_train_metadata:false */
  (function () {
    __oj_train_metadata.extension._WIDGET_NAME = 'ojTrain';
    oj.CustomElementBridge.register('oj-train', { metadata: __oj_train_metadata });
  })();

  /**
   * @ojcomponent oj.ojTrain
   * @augments oj.baseComponent
   *
   * @ojshortdesc A train allows a user to navigate between different steps of a process.
   * @since 1.0.0
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["selectedStep", "steps"]}
   * @ojvbdefaultcolumns 12
   * @ojvbmincolumns 6
   *
   * @ojoracleicon 'oj-ux-ico-train-control'
   * @ojuxspecs ['train']
   *
   * @classdesc
   * <h3 id="trainOverview-section">
   *   JET Train
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#trainOverview-section"></a>
   * </h3>
   *
   * <p>The JET Train element is a navigation visual that allows a user to go between different "steps".
   * Each step can display information about the state of the step("visited", "unvisited", "disabled")
   * and display a message type("error", "confirmation", "warning", "info", "fatal")</p>
   *
   * <pre class="prettyprint"><code>&lt;oj-train
   *   selected-step="{{currentStepValue}}"
   *   steps="{{stepArray}}">
   * &lt;/oj-train></code></pre>
   * <h3 id="touch-section">
   *   Touch End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"touchDoc"}
   *
   * <h3 id="keyboard-section">
   *   Keyboard End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"keyboardDoc"}
   */

  //-----------------------------------------------------
  //                   Fragments
  //-----------------------------------------------------
  /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Gesture</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *    <tr>
   *       <td>Step</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Move to the targeted step</td>
   *     </tr>
   *     <tr>
   *       <td>Step Label</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Move to the targeted step</td>
   *    </tr>
   *   </tbody>
   *  </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojTrain
   */

  /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Key</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td><kbd>Tab</kbd></td>
   *       <td> Move focus to the next selectable step. </tr>
   *     <tr>
   *       <td><kbd>Shift+Tab</kbd></td>
   *       <td> Move focus to the previous selectable step.</tr>
   *     <tr>
   *       <td><kbd>Enter</kbd></td>
   *       <td> Select the focused step.</tr>
   *   </tbody>
   *  </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojTrain
   */

  //-----------------------------------------------------
  //                   Sub-ids
  //-----------------------------------------------------
  /**
   * <p>Sub-ID for the specified train step.</p>
   *
   * @property {number} index The zero-based index of the train step.
   *
   * @ojsubid oj-train-step
   * @memberof oj.ojTrain
   *
   * @example <caption>Get the second step:</caption>
   * var node = myTrain.getNodeBySubId({'subId': 'oj-train-step', 'index': 1});
   */

  /**
   * <p>Sub-ID for the specified train step button.</p>
   *
   * @property {number} index The zero-based index of the train step.
   *
   * @ojsubid oj-train-button
   * @memberof oj.ojTrain
   *
   * @example <caption>Get the button of the second step:</caption>
   * var node = myTrain.getNodeBySubId({'subId': 'oj-train-button', 'index': 1});
   * @deprecated 1.2.0 This sub-id was deprecated please use oj-train-step instead.
   * @ignore
   */

  /**
   * <p>Sub-ID for the train step button connector background.</p>
   *
   * @property {number} index The zero-based index of the train step.
   *
   * @ojsubid oj-train-button-connector
   * @memberof oj.ojTrain
   *
   * @example <caption>Get the button connector background of the second step:</caption>
   * var node = myTrain.getNodeBySubId({'subId': 'oj-train-button-connector', 'index': 1});
   * @deprecated 1.2.0 This sub-id was deprecated because the returned node is not interactive.
   * @ignore
   */

  /**
   * <p>Sub-ID for the train background connector bar.</p>
   *
   * @ojsubid oj-train-connector
   * @memberof oj.ojTrain
   *
   * @example <caption>Get the background connector bar of the train:</caption>
   * var node = myTrain.getNodeBySubId({'subId': 'oj-train-connector'});
   * @deprecated 1.2.0 This sub-id was deprecated because the returned node is not interactive.
   * @ignore
   */

  /**
   * <p>Sub-ID for the train background connector bar fill inidcating the train progress.</p>
   *
   * @ojsubid oj-train-connector-fill
   * @memberof oj.ojTrain
   *
   * @example <caption>Get the train background connector bar fill:</caption>
   * var node = myTrain.getNodeBySubId({'subId': 'oj-train-connector-fill'});
   * @deprecated 1.2.0 This sub-id was deprecated because the returned node is not interactive.
   * @ignore
   */

  /**
   * <p>Sub-ID for the specified train step icon.</p>
   *
   * @property {number} index The zero-based index of the train step.
   *
   * @ojsubid oj-train-icon
   * @memberof oj.ojTrain
   *
   * @example <caption>Get the icon of the second step:</caption>
   * var node = myTrain.getNodeBySubId({'subId': 'oj-train-icon', 'index': 1});
   * @deprecated 1.2.0 This sub-id was deprecated please use oj-train-step instead.
   * @ignore
   */

  /**
   * <p>Sub-ID for the specified train step label.</p>
   *
   * @property {number} index The zero-based index of the train step.
   *
   * @ojsubid oj-train-label
   * @memberof oj.ojTrain
   *
   * @example <caption>Get the label of the second step:</caption>
   * var node = myTrain.getNodeBySubId({'subId': 'oj-train-label', 'index': 1});
   * @deprecated 1.2.0 This sub-id was deprecated please use oj-train-step instead.
   * @ignore
   */

  //-----------------------------------------------------
  //                   Styling
  //-----------------------------------------------------
  // ---------------- oj-train-stretch --------------
  /**
   * Optional class that may be added to the train div which will stretch the train to cover the full width of the container specified.
   * @ojstyleclass oj-train-stretch
   * @ojdisplayname Stretch
   * @memberof oj.ojTrain
   * @ojtsexample
   * &lt;oj-train selected-step="{{currentStepValue}}" steps="{{stepArray}}" class="oj-train-stretch">
   * &lt;/oj-train>
   */
  /**
   * @ojstylevariableset oj-train-css-set1
   * @ojstylevariable oj-train-step-width {description: "Train step width", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-train-step-border-radius {description: "Train step border radius", formats: ["length","percentage"], help: "#css-variables"}
   * @ojstylevariable oj-train-padding {description: "Train padding", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-train-label-font-size {description: "Train label font size", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-train-label-font-weight {description: "Train label font weight", formats: ["font_weight"], help: "#css-variables"}
   * @ojstylevariable oj-train-label-padding-top {description: "Train label padding top", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-train-button-diameter {description: "Train button diameter", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-train-button-font-size {description: "Train button font size", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-train-connector-height {description: "Train connector height", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-train-connector-padding {description: "Train connector padding", formats: ["length"], help: "#css-variables"}
   * @memberof oj.ojTrain
   */
  /**
   * @ojstylevariableset oj-train-css-set2
   * @ojdisplayname Default
   * @ojstylevariable oj-train-button-bg-color {description: "Default train button background color", formats: ["color"], help: "#oj-train-css-set2"}
   * @ojstylevariable oj-train-button-border-color {description: "Default train button border color", formats: ["color"], help: "#oj-train-css-set2"}
   * @ojstylevariable oj-train-button-text-color {description: "Default train button text color", formats: ["color"], help: "#oj-train-css-set2"}
   * @ojstylevariable oj-train-label-color {description: "Default label color", formats: ["color"], help: "#oj-train-css-set2"}
   * @ojstylevariable oj-train-connector-color {description: "Default train connector color", formats: ["color"], help: "#oj-train-css-set2"}
   * @memberof oj.ojTrain
   */
  /**
   * @ojstylevariableset oj-train-css-set3
   * @ojdisplayname Visited
   * @ojstylevariable oj-train-button-bg-color-visited {description: "Train button background color when visited", formats: ["color"], help: "#oj-train-css-set3"}
   * @ojstylevariable oj-train-button-border-color-visited {description: "Train button border color when visited",formats: ["color"], help: "#oj-train-css-set3"}
   * @ojstylevariable oj-train-button-text-color-visited {description: "Train button text color when visited", formats: ["color"], help: "#oj-train-css-set3"}
   * @ojstylevariable oj-train-label-color-visited {description: "Train label color when visited", formats: ["color"], help: "#oj-train-css-set3"}
   * @memberof oj.ojTrain
   */
  /**
   * @ojstylevariableset oj-train-css-set4
   * @ojdisplayname Hovered
   * @ojstylevariable oj-train-button-bg-color-hover {description: "Train button background color when hovered", formats: ["color"], help: "#oj-train-css-set4"}
   * @ojstylevariable oj-train-button-border-color-hover {description: "Train button border color when hovered", formats: ["color"], help: "#oj-train-css-set4"}
   * @ojstylevariable oj-train-button-text-color-hover {description: "Train button text color when hovered", formats: ["color"], help: "#oj-train-css-set4"}
   * @ojstylevariable oj-train-step-bg-color-hover {description: "Train step background color when hovered", formats: ["color"], help: "#oj-train-css-set4"}
   * @memberof oj.ojTrain
   */
  /**
   * @ojstylevariableset oj-train-css-set5
   * @ojdisplayname Active
   * @ojstylevariable oj-train-button-bg-color-active {description: "Train button background color when active", formats: ["color"], help: "#oj-train-css-set5"}
   * @ojstylevariable oj-train-button-border-color-active {description: "Train button border color when active", formats: ["color"], help: "#oj-train-css-set5"}
   * @ojstylevariable oj-train-button-text-color-active {description: "Train button text color when active", formats: ["color"], help: "#oj-train-css-set5"}
   * @ojstylevariable oj-train-label-font-weight-active {description: "Train label font weight when active", formats: ["font_weight"], help: "#oj-train-css-set5"}
   * @ojstylevariable oj-train-step-bg-color-active {description: "Train step background color when active", formats: ["color"], help: "#oj-train-css-set5"}
   * @memberof oj.ojTrain
   */
  /**
   * @ojstylevariableset oj-train-css-set6
   * @ojdisplayname Selected
   * @ojstylevariable oj-train-button-bg-color-selected {description: "Train button background color when selected", formats: ["color"], help: "#oj-train-css-set6"}
   * @ojstylevariable oj-train-button-border-color-selected {description: "Train button border color when selected", formats: ["color"], help: "#oj-train-css-set6"}
   * @ojstylevariable oj-train-button-text-color-selected {description: "Train button text color when selected", formats: ["color"], help: "#oj-train-css-set6"}
   * @ojstylevariable oj-train-label-font-weight-selected {description: "Train label font weight when selected", formats: ["font_weight"], help: "#oj-train-css-set6"}
   * @ojstylevariable oj-train-label-color-selected {description: "Train label color when selected",formats: ["color"], help: "#oj-train-css-set6"}
   * @ojstylevariable oj-train-connector-color-selected {description: "Train connector color when selected", formats: ["color"], help: "#oj-train-css-set6"}
   * @ojstylevariable oj-train-connector-padding-selected {description: "Train connector padding when selected", formats: ["length"], help: "#oj-train-css-set6"}
   * @memberof oj.ojTrain
   */
  /**
   * @ojstylevariableset oj-train-css-set7
   * @ojdisplayname Disabled
   * @ojstylevariable oj-train-button-bg-color-disabled {description: "Train button background color when disabled", formats: ["color"], help: "#oj-train-css-set7"}
   * @ojstylevariable oj-train-button-border-color-disabled {description: "Train button border color when disabled", formats: ["color"], help: "#oj-train-css-set7"}
   * @ojstylevariable oj-train-button-text-color-disabled {description: "Train button text color when disabled", formats: ["color"], help: "#oj-train-css-set7"}
   * @ojstylevariable oj-train-button-opacity-disabled {description: "Train button opacity when disabled", formats: ["number","percentage"], help: "#oj-train-css-set7"}
   * @ojstylevariable oj-train-label-color-disabled {description: "Train label color when disabled", formats: ["color"], help: "#oj-train-css-set7"}
   * @memberof oj.ojTrain
   */
  (function () {
    oj.__registerWidget('oj.ojTrain', $.oj.baseComponent, {
      version: '1.0.0',
      defaultElement: '<div>',
      widgetEventPrefix: 'oj',
      options: {
        /**
         * Object type that specifies the styling, messaging, and behavior for the Train step.
         * @ojtypedef oj.ojTrain.Step
         */
        /**
         * The id of the step
         * @expose
         * @name id
         * @ojtypedefmember
         * @memberof! oj.ojTrain.Step
         * @type {string}
         */
        /**
         * The label of the step
         * @expose
         * @name label
         * @ojtypedefmember
         * @memberof! oj.ojTrain.Step
         * @type {string}
         * @ojtranslatable
         */
        /**
         * Specifies whether the step is disabled
         * @expose
         * @name disabled
         * @ojtypedefmember
         * @memberof! oj.ojTrain.Step
         * @type {boolean=}
         */
        /**
         * Specifies whether the step has been visited
         * @expose
         * @name visited
         * @ojtypedefmember
         * @memberof! oj.ojTrain.Step
         * @type {boolean=}
         */
        /**
         * Specifies the type of message icon displayed on the step. A null value removes the message icon.
         * @expose
         * @name messageType
         * @ojtypedefmember
         * @memberof! oj.ojTrain.Step
         * @type {("info"|"error"|"fatal"|"warning"|"confirmation"|null)=}
         */

        /**
         * The array of step objects. Each <a href="#Step">oj.ojTrain.Step</a> must have an 'id' and 'label' property.
         *
         * @ojshortdesc The array of step objects.
         * @ojrequired
         * @expose
         * @public
         * @type {Array.<Object>}
         * @ojsignature {target: "Type", value:"Array<oj.ojTrain.Step>", jsdocOverride: true}
         * @instance
         * @memberof! oj.ojTrain
         * @example <caption>Initialize the Train with the <code class="prettyprint">steps</code> attribute specified</caption>
         * &lt;oj-train steps='[{"id":"id1", "label":"Label 1"}, {"id":"id2", "label":"Label 2", "disabled": false, "visited": true, "messageType":"info"}]'>&lt;/oj-train>
         * @example <caption>Get or set the <code class="prettyprint">steps</code> property after initialization</caption>
         * //Get one
         * var step = myTrain.steps[0];
         *
         * //Get all
         * var steps = myTrain.steps;
         *
         * //Set all.  Must list every resource key, as those not listed are lost.
         * myTrain.steps = [{
         *      'id':'id1',
         *      'label': 'Label 1'},
         *     {'id':'id2',
         *      'label': 'Label 2',
         *      "disabled": false,
         *      "visited": true,
         *      "messageType":"info"}];
         */
        steps: [],

        /**
         * The selected variable indicates the id of the current selected step.
         * @expose
         * @public
         * @type {string}
         * @deprecated 3.0.0 use selectedStep
         * @ignore
         * @instance
         * @memberof! oj.ojTrain
         */
        selected: '',

        /**
         * Indicates the id of the current selected step.  Default is the first step in the steps array.
         * @ojshortdesc Specifies the id of the current selected step.
         * @expose
         * @public
         * @type {string}
         * @instance
         * @ojwriteback
         * @memberof! oj.ojTrain
         * @example <caption>Initialize the Train with the <code class="prettyprint">selected-step</code> attribute specified</caption>
         * &lt;oj-train selected-step='{{selectedStepValue}}'>&lt;/oj-train>
         * @example <caption>Get or set the <code class="prettyprint">selectedStep</code> property after initialization</caption>
         * //Get train selected step
         * var selectedStep = myTrain.selectedStep;
         *
         * //Set train selected step
         * myTrain.selectedStep = 'stp1';
         */
        selectedStep: '',

        // Events

        /**
         * Triggered immediately before a step is deselected.
         * The ojBeforeDeselect can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
         * @ojshortdesc Triggered immediately before a step is deselected.
         * @ojcancelable
         * @expose
         * @event
         * @memberof oj.ojTrain
         * @instance
         * @property {Object} fromStep The step that is about to be deselected.
         * @ojsignature { target: "Type",value: "oj.ojTrain.Step",for: "fromStep", jsdocOverride:true}
         * @property {Object} toStep The step that is about to be selected.
         * @ojsignature { target: "Type",value: "oj.ojTrain.Step",for: "toStep", jsdocOverride:true}
         */
        beforeDeselect: null,

        /**
         * Triggered after a step has been deselected.
         * The ojDeselect can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
         * @ojshortdesc Triggered after a step has been deselected.
         * @expose
         * @event
         * @memberof oj.ojTrain
         * @instance
         * @property {Object} fromStep The step that is deselected.
         * @ojsignature { target: "Type",value: "oj.ojTrain.Step",for: "fromStep", jsdocOverride:true}
         * @property {Object} toStep The step that is selected.
         * @ojsignature { target: "Type",value: "oj.ojTrain.Step",for: "toStep", jsdocOverride:true}
         *
         */
        deselect: null,

        /**
         * Triggered immediately before a step is selected.
         * The ojBeforeSelect can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
         * @ojshortdesc Triggered immediately before a step is selected.
         * @ojcancelable
         * @expose
         * @event
         * @memberof oj.ojTrain
         * @instance
         * @property {Object} fromStep The step that is about to be deselected.
         * @ojsignature { target: "Type",value: "oj.ojTrain.Step",for: "fromStep", jsdocOverride:true}
         * @property {Object} toStep The step that is about to be selected.
         * @ojsignature { target: "Type",value: "oj.ojTrain.Step",for: "toStep", jsdocOverride:true}
         *
         */
        beforeSelect: null,

        /**
         * Triggered after a step has been selected.
         * @ojshortdesc Triggered after a step has been selected.
         * @expose
         * @event
         * @memberof oj.ojTrain
         * @instance
         * @property {Object} fromStep The step that is deselected.
         * @ojsignature { target: "Type",value: "oj.ojTrain.Step",for: "fromStep", jsdocOverride:true}
         * @property {Object} toStep The step that is selected.
         * @ojsignature { target: "Type",value: "oj.ojTrain.Step",for: "toStep", jsdocOverride:true}
         *
         */
        select: null
      },

      /**
       * Variable for storing the number of steps in the train
       *
       * @private
       */
      _stepNum: 0,

      /**
       * Variable for storing the train information about each step in 2D Array form
       *
       * @private
       */
      _stepArray: null,

      /**
       * Create the train
       * @override
       * @memberof oj.ojTrain
       * @return {void}
       * @protected
       */
      _ComponentCreate: function () {
        this._super();
        this._setupTrain();
      },

      /**
       * Set up the train component.
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _setupTrain: function () {
        // Constrain initial value
        var options = this.options;
        var steps = options.steps;
        this._stepNum = steps.length;

        // Train Wrapper
        this._wrapper = $("<div class='oj-train-wrapper'></div>");

        this._wrapper.appendTo(this.element); // @HTMLUpdateOK

        this._connectorWrapper = $("<div class='oj-train-connector-wrapper'></div>");

        this._connectorWrapper.appendTo(this._wrapper); // @HTMLUpdateOK

        var styleClass = this.element.attr('class');
        this._stretch = styleClass != null && styleClass.indexOf('oj-train-stretch') >= 0;
        if (this._stretch) {
          this._connectorWrapper.css('padding', '0 ' + 100 / (this._stepNum * 2) + '%');
        }

        // Draw the connector bar  for the train
        this._connector = $("<div class='oj-train-connector'></div>");

        this._connector.appendTo(this._connectorWrapper); // @HTMLUpdateOK

        this._stepList = $('<ul>');
        this._stepList.addClass('oj-train-step-list');

        // Initialize the background progress bar object that will be updated to have the correct width based on the current step.
        this._connectorFill = $("<div class='oj-train-connector-fill'></div>");

        this._connectorFill.appendTo(this._connectorWrapper); // @HTMLUpdateOK

        // Setup array that stores train information for each step.
        this._setupArray();
        this._selectedIndex = this._getStepIndex(options.selectedStep || options.selected);
        if (this._selectedIndex === -1 && steps[0] && steps[0].id) {
          this._selectedIndex = 0;
          options.selectedStep = steps[0].id;
          options.selected = steps[0].id;
        }

        // Draw each step. Visually each step consists of a background circle, a button, an icon, and a label.
        for (var i = 0; i < this._stepNum; i++) {
          // Create a list item to store each step.
          var stepId = this._stepArray[i][1];
          var stepTag = $('<li>').addClass('oj-train-step-list-item').attr({ id: stepId });

          // Add message information
          var disabled = this._stepArray[i][2];
          if (this._selectedIndex === i) {
            stepTag.addClass('oj-selected');
          } else if (disabled) {
            stepTag.addClass('oj-disabled');
          }
          var messageType = this._stepArray[i][4];
          if (messageType === 'confirmation') {
            stepTag.addClass('oj-confirmation');
          } else if (messageType === 'info') {
            stepTag.addClass('oj-info');
          } else if (messageType === 'error' || messageType === 'fatal') {
            stepTag.addClass('oj-invalid');
          } else if (messageType === 'warning') {
            stepTag.addClass('oj-warning');
          }

          stepTag.appendTo(this._stepList); // @HTMLUpdateOK

          this._drawLabel(i);
          this._drawStepFill(i);
          this._drawIndividualConnectorLine(i);
          this._drawButton(i);
          this._drawStepNumberLabel(i);
          this._drawMessageType(i);
          if (this._stretch) {
            stepTag.css('width', 100 / this._stepNum + '%');
          }

          var behavior = ThemeUtils.parseJSONFromFontFamily('oj-theme-json').behavior;

          if (behavior.includes('redwood') && !disabled && this._selectedIndex !== i) {
            this._AddHoverable(stepTag);
            this._AddActiveable(stepTag);

            stepTag.on(
              'click' + this.eventNamespace,
              this._preventDefaultAndFireSelectedStepOptionChange.bind(this, stepId)
            );
          }
        }

        // Update background progress bar width to show the progress.
        var connectorFillWidth =
          this._stepNum - 1 === this._selectedIndex
            ? 100
            : 100 / (2 * (this._stepNum - 1)) + (this._selectedIndex / (this._stepNum - 1)) * 100;
        this._connectorFill.css({ width: connectorFillWidth + '%' });

        this._stepList.appendTo(this._wrapper); // @HTMLUpdateOK

        this.element.addClass('oj-train');
      },

      _preventDefaultAndFireSelectedStepOptionChange(stepID, event) {
        if (event.keyCode === $.ui.keyCode.ENTER || event.type === 'click') {
          event.preventDefault();
          this._fireSelectedStepOptionChange(stepID, event);
        }
      },

      /**
       * Set up the _stepArray(). The first dimension indicates the step index and the second dimension indicates the step variables.
       * The order of the step variables are: label, id, selection, visited, messageType
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _setupArray: function () {
        var options = this.options;
        this._stepArray = [];
        for (var i = 0; i < this._stepNum; i++) {
          var step = options.steps[i];
          this._stepArray[i] = [];
          this._stepArray[i][0] = step.label ? step.label : null;
          this._stepArray[i][1] = step.id ? step.id : null;
          this._stepArray[i][2] = !!step.disabled;
          this._stepArray[i][3] = !!step.visited;
          this._stepArray[i][4] = step.messageType ? step.messageType : null;
        }
      },

      _newDivElement() {
        return $('<div></div>');
      },

      /**
       * Draw the button object for the step based on the index. If a button for that step alread exists remove it and draw the new one.
       * @param {number} index The index of the step for which the button is being drawn.
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _drawButton: function (index) {
        var button = this._newDivElement().addClass('oj-train-button');
        var scrnRead = $('<span></span>');
        var desc = '';
        var status = '';
        if (this._stepArray[index]) {
          var visited = this._stepArray[index][3];
          var disabled = this._stepArray[index][2];
          desc =
            ' ' +
            this.getTranslatedString('stepInfo', {
              index: index + 1,
              count: this._stepArray.length
            });

          if (this._selectedIndex === index) {
            button.addClass('oj-selected');
            status = this.getTranslatedString('stepCurrent');
          } else if (visited && !disabled) {
            button.addClass('oj-visited');
            status = this.getTranslatedString('stepVisited');
          } else if (!visited && !disabled) {
            button.addClass('oj-default');
            status = this.getTranslatedString('stepNotVisited');
          } else {
            button.addClass('oj-disabled');
            status = this.getTranslatedString('stepDisabled');
          }
          desc += ' ' + this.getTranslatedString('stepStatus', { status: status });

          if (!this._stepArray[index][2] && this._selectedIndex !== index) {
            this._AddHoverable(button);
            this._AddActiveable(button);
            var stepId = this._stepArray[index][1];
            button.on(
              'click' + this.eventNamespace,
              function (stepID, event) {
                this._fireSelectedStepOptionChange(stepID, event);
              }.bind(this, stepId)
            );
          }

          var stepBackground = this._stepList.children().eq(index).find('.oj-train-button-connector');

          // Check that there are at least 3 items in the list item indicating that a button has already been created for this step.
          // If there is remove it and insert the new button in the same position. If there isn't a preexsisting button, simply add one.
          if (stepBackground.length >= 1) {
            stepBackground.children().remove();
            stepBackground.append(button); // @HTMLUpdateOK
          } else {
            stepBackground.append(button); // @HTMLUpdateOK
          }
          scrnRead.text(desc);
          scrnRead.addClass('oj-helper-hidden-accessible');

          this._stepList.children().eq(index).find('a').append(scrnRead); // @HTMLUpdateOK
        }
      },

      /**
       * Draw the icon that displays the messageType for the step based on the index. If there already is an icon remove it and draw the new one.
       * @param {number} index The index of the step for which the icon is being drawn.
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _drawMessageType: function (index) {
        if (this._stepArray[index] && this._stepArray[index][4]) {
          var icon = this._newDivElement()
            .addClass('oj-train-icon oj-component-icon')
            .attr('aria-hidden', 'true');
          var scrnRead = $('<span></span>');
          var desc = '';
          var messageTypeStr = '';
          var messageType = this._stepArray[index][4];

          if (messageType === 'confirmation') {
            icon.addClass('oj-confirmation');
            messageTypeStr = this.getTranslatedString('stepMessageConfirmation');
          } else if (messageType === 'info') {
            icon.addClass('oj-info');
            messageTypeStr = this.getTranslatedString('stepMessageInfo');
          } else if (messageType === 'error' || messageType === 'fatal') {
            icon.addClass('oj-error');
            messageTypeStr = this.getTranslatedString('stepMessageError');
          } else if (messageType === 'warning') {
            icon.addClass('oj-warning');
            messageTypeStr = this.getTranslatedString('stepMessageWarning');
          }

          // Remove previous messageType
          var button = this._stepList.children().eq(index).find('.oj-train-button');
          if (button.children().length >= 2) {
            button.children()[1].remove();
          }
          // Make icon clickable
          if (!this._stepArray[index][2] && this._selectedIndex !== index) {
            var stepId = this._stepArray[index][1];
            icon.on(
              'click' + this.eventNamespace,
              function (stepID, event) {
                this._fireSelectedStepOptionChange(stepID, event);
              }.bind(this, stepId)
            );
          }
          // Add new message
          if (messageType != null) {
            // If there is remove it and insert the new icon in the same position.
            // Add description to span
            desc = this.getTranslatedString('stepMessageType', { messageType: messageTypeStr });
            scrnRead.text(desc);
            scrnRead.addClass('oj-helper-hidden-accessible');

            this._stepList.children().eq(index).find('a').append(scrnRead); // @HTMLUpdateOK
            button.append(icon); // @HTMLUpdateOK
          }
        }
      },

      /**
       * Fire optionChange event
       * @param {string} previousValue
       * @param {string} value
       * @param {Object} originalEvent
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _fireOptionChange: function (previousValue, value, originalEvent) {
        var eventData = {
          fromStep: this.getStep(previousValue),
          toStep: this.getStep(value),
          // (originalEvent is non-null) iff (option change is due to user interaction) iff (binding should write back the value)
          optionMetadata: { writeback: originalEvent ? 'shouldWrite' : 'shouldNotWrite' }
        };
        if (
          this._trigger('beforeDeselect', originalEvent, eventData) === false ||
          this._trigger('beforeSelect', originalEvent, eventData) === false
        ) {
          this._optionChangePrevented = true;
          return;
        }

        // Set the previous step to visited
        var stepIndex = this._getStepIndex(previousValue);
        if (stepIndex !== -1) {
          var oldStepProperties = this.options.steps[stepIndex];
          this._previousStepIndex = stepIndex;
          oldStepProperties.visited = true;
          this._optionChangePrevented = false;
        }

        this._trigger('deselect', originalEvent, eventData);

        if (this.options.selectedStep) {
          this.option('selectedStep', value, {
            _context: { originalEvent: originalEvent, internalSet: true }
          });
        }
        if (this.options.selected) {
          this.option('selected', value, {
            _context: { originalEvent: originalEvent, internalSet: true }
          });
        }

        this._trigger('select', originalEvent, eventData);
      },

      /**
       * Draw the number label that is displayed on the button of each step without a message type. This is only used for native mobile themes.
       * @param {number} index The index of the step for which the number label is being drawn.
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _drawStepNumberLabel: function (index) {
        var stepNumberLabel = this._newDivElement().addClass('oj-train-button-text');
        stepNumberLabel.append((index + 1).toString()); // @HTMLUpdateOK
        var stepBackground = this._stepList.children().eq(index).find('.oj-train-button');
        stepBackground.append(stepNumberLabel); // @HTMLUpdateOK
      },

      /**
       * Draws the individual connector line between each step.
       * @param {number} index The index of the step for which the icon is being drawn.
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _drawIndividualConnectorLine: function (index) {
        if (index !== this._stepNum - 1) {
          var stepConnector = this._newDivElement().addClass('oj-train-step-individual-connector');
          if (index < this._selectedIndex) {
            stepConnector.addClass('oj-train-connector-before-selected-step');
          }
          this._stepList.children().eq(index).prepend(stepConnector); // @HTMLUpdateOK
        }
      },

      /**
       * Draw the background circle for the step which is either light or dark base on if the step is before or after the selected step.
       * @param {number} index The index of the step for which the icon is being drawn.
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _drawStepFill: function (index) {
        var stepFill = this._newDivElement();
        stepFill.addClass('oj-train-button-connector');
        if (this._stepArray[index]) {
          if (index <= this._selectedIndex) {
            stepFill.addClass('oj-train-fill');
          }
          var stepLi = this._stepList.children().eq(index).children();
          stepFill.insertBefore(stepLi); // @HTMLUpdateOK
        }
      },

      /**
       * Draw the label for the step.
       * @param {number} index The index of the step for which the icon is being drawn.
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _drawLabel: function (index) {
        if (this._stepArray[index]) {
          var labelWrapper = this._newDivElement().addClass('oj-train-label-wrapper');
          var label = $('<a>');
          label.text(this._stepArray[index][0]);
          var disabled = this._stepArray[index][2];
          labelWrapper.append(label); // @HTMLUpdateOK
          label.addClass('oj-train-label');
          if (index === this._selectedIndex) {
            label.addClass('oj-selected');
          } else if (this._stepArray[index][3] && !disabled) {
            label.addClass('oj-visited');
          } else if (disabled) {
            label.addClass('oj-disabled');
            label.attr('aria-disabled', 'true');
          }
          if (!disabled) {
            label.attr('href', '#');
            this._focusable({
              element: label,
              applyHighlight: true
            });
            this._AddHoverable(label);
            this._AddActiveable(label);

            var stepId = this._stepArray[index][1];

            label.on(
              'click keydown' + this.eventNamespace,
              this._preventDefaultAndFireSelectedStepOptionChange.bind(this, stepId)
            );
          }
          var stepLi = this._stepList.children().eq(index).children();
          if (stepLi.length >= 2) {
            stepLi[1].remove();
          }
          this._stepList.children().eq(index).append(labelWrapper); // @HTMLUpdateOK
        }
      },

      /**
       * Return the index of the step
       * @param {string} id The id of the step whose index is returned.
       * @return {number} index of step. -1 for not valid ids.
       * @memberof oj.ojTrain
       * @private
       */
      _getStepIndex: function (id) {
        for (var i = 0; i < this._stepNum; i++) {
          if (this._stepArray[i] && this._stepArray[i][1] === id) {
            return i;
          }
        }
        return -1;
      },

      /**
       * Returns the step based on the id passed in. If the step doesn't exist, return null.
       * @ojshortdesc Returns the specified step.
       * @public
       * @param {string} id The id of the step.
       * @return {Object | null} step object.
       * @ojsignature { target: "Type",value: "oj.ojTrain.Step|null",for: "returns", jsdocOverride:true}
       * @expose
       * @instance
       * @memberof oj.ojTrain
       */
      getStep: function (id) {
        for (var i = 0; i < this._stepNum; i++) {
          if (this._stepArray[i] && this._stepArray[i][1] === id) {
            return $.extend({}, this.options.steps[i]);
          }
        }
        return null;
      },

      /**
       * <p>Returns the id of the next selectable step based on the selected id. If the current step is the last selectable step, returns null</p>
       * @public
       * @expose
       * @return {string} next selectable Id
       * @deprecated 3.0.0 Use getNextSelectableStep
       * @ignore
       * @instance
       * @memberof oj.ojTrain
       */
      nextSelectableStep: function () {
        return this.getNextSelectableStep();
      },

      /**
       * <p>Returns the id of the previous selectable step based on the selected id. If the current step is the first selectable step, returns null</p>
       * @public
       * @expose
       * @return {string} previous selectable Id
       * @ignore
       * @deprecated 3.0.0 Use getPreviousSelectableStep
       * @instance
       * @memberof oj.ojTrain
       */
      previousSelectableStep: function () {
        return this.getPreviousSelectableStep();
      },

      /**
       * Returns the id of the next selectable step based on the current selectedStep. If the current step is the last selectable step, the function returns null
       * @ojshortdesc Returns the id of the next selectable step based on the current selected step.
       * @public
       * @return {string | null} next selectable Id
       * @expose
       * @instance
       * @memberof oj.ojTrain
       */
      getNextSelectableStep: function () {
        var selectedIndex = this._getStepIndex(this.options.selectedStep || this.options.selected);
        for (var i = selectedIndex; i < this._stepNum; i++) {
          if (i + 1 < this._stepNum && this._stepArray[i + 1] && !this._stepArray[i + 1][2]) {
            return this._stepArray[i + 1][1];
          }
        }
        return null;
      },

      /**
       * Returns the id of the previous selectable step based on the current selectedStep. If the current step is the first selectable step, the function returns null
       * @ojshortdesc Returns the id of the previous selectable step based on the current selected step.
       * @public
       * @return {string | null} previous selectable Id
       * @expose
       * @instance
       * @memberof oj.ojTrain
       */
      getPreviousSelectableStep: function () {
        var selectedIndex = this._getStepIndex(this.options.selectedStep || this.options.selected);
        for (var i = selectedIndex; i >= 0; i--) {
          if (this._stepArray[i - 1] && !this._stepArray[i - 1][2]) {
            return this._stepArray[i - 1][1];
          }
        }
        return null;
      },

      /**
       * <p>Sets the properties for the step. Takes in the object conatining the properties for the step.</p>
       * @public
       * @expose
       * @deprecated 3.0.0 Use updateStep instead
       * @param {Object} stepProperties The property bag to overwrite properties on the step.
       * @ignore
       * @instance
       * @return {void}
       * @memberof oj.ojTrain
       */
      setStep: function (stepProperties) {
        if (stepProperties.id) {
          this.updateStep(stepProperties.id, stepProperties);
        }
      },

      /**
       * Update the step with the specified id with the provided property bag.
       * @ojshortdesc Update the specified step with a new set of properties.
       * @public
       * @param {string} id The id of the step to update
       * @param {Object} stepProperties The set of step properties to update. Will overwrite any previously set values.
       * @expose
       * @param {string} [stepProperties.id] id of step
       * @param {string} [stepProperties.label] label of step
       * @param {boolean} [stepProperties.disabled] whether step is disabled
       * @param {boolean} [stepProperties.visited] whether step has been visited
       * @param {"info"|"error"|"fatal"|"warning"|"confirmation"| null} [stepProperties.messageType] type of message displayed, null resets to default step without message
       * @instance
       * @memberof oj.ojTrain
       * @return {void}
       */
      updateStep: function (id, stepProperties) {
        if (id) {
          var stepInfo = this.getStep(id);
          var stepIndex = this._getStepIndex(id);
          if (stepIndex !== -1) {
            var stepObj = this.options.steps[stepIndex];
            if (stepProperties.label) {
              stepInfo[0] = stepProperties.label;
              stepObj.label = stepProperties.label;
            }
            if (typeof stepProperties.id === 'string') {
              stepInfo[1] = stepProperties.id;
              stepObj.id = stepProperties.id;
            }
            if (typeof stepProperties.disabled === 'boolean') {
              stepInfo[2] = stepProperties.disabled;
              stepObj.disabled = stepProperties.disabled;
            }
            if (typeof stepProperties.visited === 'boolean') {
              stepInfo[3] = stepProperties.visited;
              stepObj.visited = stepProperties.visited;
            }
            if (
              typeof stepProperties.messageType === 'string' ||
              (stepObj.messageType != null && stepProperties.messageType === null)
            ) {
              stepInfo[4] = stepProperties.messageType;
              stepObj.messageType = stepProperties.messageType;
            }

            this.refresh();
          }
        }
      },
      /**
       * <p>Sets the options</p>
       * @protected
       * @param {Object} options
       * @override
       * @memberof oj.ojTrain
       * @return {void}
       */
      _setOptions: function (options) {
        this._super(options);
        this.refresh();
      },
      /**
       * <p>Sets the options</p>
       * @protected
       * @param {string} key
       * @param {Object} value
       * @param {string} flags
       * @override
       * @memberof oj.ojTrain
       * @return {void}
       */
      _setOption: function (key, value, flags) {
        if (
          (key === 'selectedStep' || key === 'selected') &&
          this._stepArray &&
          this._stepArray[this._selectedIndex]
        ) {
          var prevSelected = this._stepArray[this._selectedIndex][1];
          if (value === prevSelected) {
            return;
          }

          this._fireOptionChange(this._stepArray[this._selectedIndex][1], value, null);
        } else {
          this._super(key, value, flags);
        }
      },

      _busyContextAnimatingDescription(msg) {
        return msg + "' is animating.";
      },

      /**
       * Refreshes the train.
       *
       * <p>This method does not accept any arguments.</p>
       * @ojshortdesc Refreshes the train.
       * @expose
       * @memberof oj.ojTrain
       * @return {void}
       * @instance
       */
      refresh: function () {
        this._super();
        this._destroy();
        this._setupTrain();

        var previousStepMessageType;
        if (this._previousStepIndex != null && this._stepArray[this._previousStepIndex] != null) {
          previousStepMessageType = this._stepArray[this._previousStepIndex][4];
        }
        var selectedStepMessageType;
        if (this._selectedIndex != null && this._stepArray[this._selectedIndex] != null) {
          selectedStepMessageType = this._stepArray[this._selectedIndex][4];
        }

        var selectedButton = this.getNodeBySubId({
          subId: 'oj-train-step',
          index: this._selectedIndex
        });
        if (selectedButton && selectedStepMessageType == null) {
          var selectedButtonBusyContext = Context.getContext(selectedButton).getBusyContext();
          selectedButton.classList.add('oj-train-button-selected-animation');
          var selectedAnimationDuration = parseFloat($(selectedButton).css('animationDuration'));
          if (selectedAnimationDuration > 0) {
            var selectedButtonAnimationResolve = selectedButtonBusyContext.addBusyState({
              description: this._busyContextAnimatingDescription(
                "The train selected button index='" + this._selectedIndex
              )
            });

            setTimeout(function () {
              selectedButtonAnimationResolve();
            }, selectedAnimationDuration);
          }
        }
        var visitedButton = this.getNodeBySubId({
          subId: 'oj-train-step',
          index: this._previousStepIndex
        });
        if (visitedButton && previousStepMessageType == null) {
          var visitedButtonBusyContext = Context.getContext(visitedButton).getBusyContext();
          visitedButton.classList.add('oj-train-button-visited-animation');
          var visitedAnimationDuration = parseFloat($(visitedButton).css('animationDuration'));
          if (visitedAnimationDuration > 0) {
            var visitedButtonAnimationResolve = visitedButtonBusyContext.addBusyState({
              description: this._busyContextAnimatingDescription(
                "The train visited button index='" + this._previousStepIndex
              )
            });

            setTimeout(function () {
              visitedButtonAnimationResolve();
            }, visitedAnimationDuration);
          }
        }
        var previousStepIcon = this._stepList
          .children()
          .eq(this._previousStepIndex)
          .find('.oj-train-icon')[0];
        if (previousStepIcon) {
          var iconBusyContext = Context.getContext(previousStepIcon).getBusyContext();
          previousStepIcon.classList.add('oj-train-button-messaging-icon-animation');
          var iconAnimationDuration = parseFloat($(previousStepIcon).css('animationDuration'));
          if (iconAnimationDuration > 0) {
            var iconAnimationResolve = iconBusyContext.addBusyState({
              description: this._busyContextAnimatingDescription(
                "The train icon index='" + this._previousStepIndex
              )
            });

            setTimeout(function () {
              iconAnimationResolve();
            }, iconAnimationDuration);
          }
        }
        var selectedStepIcon = this._stepList
          .children()
          .eq(this._selectedIndex)
          .find('.oj-train-icon')[0];
        if (selectedStepIcon) {
          var selectedIconBusyContext = Context.getContext(selectedStepIcon).getBusyContext();
          selectedStepIcon.classList.add('oj-train-button-messaging-icon-animation');
          var selectedIconAnimationDuration = parseFloat(
            $(selectedStepIcon).css('animationDuration')
          );
          if (selectedIconAnimationDuration > 0) {
            var selectedIconAnimationResolve = selectedIconBusyContext.addBusyState({
              description: this._busyContextAnimatingDescription(
                "The train icon index='" + this._selectedIndex
              )
            });

            setTimeout(function () {
              selectedIconAnimationResolve();
            }, selectedIconAnimationDuration);
          }
        }
      },

      /**
       * @override
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _destroy: function () {
        this._stepList.children().each(function () {
          $(this).remove();
        });
        this.element.removeClass('oj-train');
        this.element.find('.oj-train-wrapper').remove();
        this.element.find('.oj-train-connector-wrapper').remove();
        this.element.find('.oj-train-step-list').remove();
        this.element.find('.oj-train-step-list').remove();

        // Call super at the end for destroy.
        this._super();
      },

      /**
       * Fire option change event for selectedStep on click or keyboard action
       * @param {Object} event Original event
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _fireSelectedStepOptionChange: function (newSelectedStep, event) {
        var prevSelected = this._stepArray[this._selectedIndex][1];
        if (prevSelected !== newSelectedStep) {
          this._fireOptionChange(prevSelected, newSelectedStep, event);
          if (!this._optionChangePrevented) {
            this.refresh();
            this._setFocus(newSelectedStep);
          }
        }
        // JET-47535: stop propagating the original event
        event.stopPropagation();
      },

      /**
       * Set the focus on the step defined by the id.
       * @param {string} id The id of the step to focus
       *
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _setFocus: function (id) {
        var index = this._getStepIndex(id);
        this._stepList.children().eq(index).find('.oj-train-label').focus();
      },

      getNodeBySubId: function (locator) {
        if (locator === null) {
          return this.element ? this.element[0] : null;
        }

        var subId = locator.subId;
        var index = locator.index;

        if (typeof index !== 'number' || index < 0 || index >= this._stepNum) {
          return null;
        }

        switch (subId) {
          // returns the clickable button
          // QA automated tests need to click on selected step and button is clickable
          // while the whole step is not
          case 'oj-train-step':
            return this._stepList.children().eq(index).find('.oj-train-button')[0];

          // Deprecated sub-id
          case 'oj-train-button':
            return this._stepList.children().eq(index).find('.oj-train-button')[0];

          // Deprecated sub-id
          case 'oj-train-button-connector':
            return this._stepList.children().eq(index).find('.oj-train-button-connector')[0];

          // Deprecated sub-id
          case 'oj-train-connector':
            return this._connector;

          // Deprecated sub-id
          case 'oj-train-connector-fill':
            return this._connectorFill;

          // Deprecated sub-id
          case 'oj-train-icon':
            return this._stepList.children().eq(index).find('.oj-train-icon')[0];

          // Deprecated sub-id
          case 'oj-train-label':
            //  - OJ-TRAIN-LABEL DOES NOT RETURN THE RIGHT NODE
            return this._stepList.children().eq(index).find('.oj-train-label')[0];

          default:
            // Non-null locators have to be handled by the component subclasses
            return null;
        }
      },

      getSubIdByNode: function (node) {
        var currentNode = node;

        var stepNum = this._stepArray ? this._stepArray.length : 0;
        for (var stepIndex = 0; stepIndex < stepNum; stepIndex++) {
          var stepLocator = { subId: 'oj-train-step', index: stepIndex };
          // subIdNode should be button
          var subIdNode = this.getNodeBySubId(stepLocator);
          // Checking whether currentNode is a descendant of the button or label because
          // those two are only clickable things in the step so we only want to return a valid subIdNode
          // for those cases(and their children)
          if (
            $(currentNode).closest(subIdNode).length > 0 ||
            $(currentNode).closest($(subIdNode.parentNode.parentNode).find('.oj-train-label')[0])
              .length > 0
          ) {
            return stepLocator;
          }
        }
        return null;
      }
    });
  })();

});
