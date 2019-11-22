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
      "value": {}
    }
  },
  "methods": {
    "getStep": {},
    "getNextSelectableStep": {},
    "getPreviousSelectableStep": {},
    "updateStep": {},
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojBeforeDeselect": {},
    "ojDeselect": {},
    "ojBeforeSelect": {},
    "ojSelect": {}
  },
  "extension": {}
};


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

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
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 */
(function () {
  oj.__registerWidget('oj.ojTrain', $.oj.baseComponent,
    {
      version: '1.0.0',
      defaultElement: '<div>',
      widgetEventPrefix: 'oj',
      options: {

        /**
         * @typedef {Object} oj.ojTrain.Step
         * @property {string} id id of the step
         * @property {string} label label of the step
         * @property {boolean} [disabled] indicates whether the step is disabled
         * @property {boolean} [visited] indicates whether the step has been visited
         * @property {"info"|"error"|"fatal"|"warning"} [messageType] the type of message icon displayed on the step
         *
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
         * @property {string} toStep The step that is about to be deselected.
         * @property {string} fromStep The step that is about to be selected.
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
         * @property {string} toStep The step that is about to be deselected.
         * @property {string} fromStep The step that is about to be selected.
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
         * @property {string} toStep The step that is about to be deselected.
         * @property {string} fromStep The step that is about to be selected.
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
         * @property {string} toStep The step that is about to be deselected.
         * @property {string} fromStep The step that is about to be selected.
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

        this._wrapper.appendTo(this.element);// @HTMLUpdateOK

        this._connectorWrapper = $("<div class='oj-train-connector-wrapper'></div>");

        this._connectorWrapper.appendTo(this._wrapper);// @HTMLUpdateOK

        var styleClass = this.element.attr('class');
        this._stretch = (styleClass != null && styleClass.indexOf('oj-train-stretch') >= 0);
        if (this._stretch) {
          this._connectorWrapper.css('padding', '0 ' + (100 / (this._stepNum * 2)) + '%');
        }

        // Draw the connector bar  for the train
        this._connector = $("<div class='oj-train-connector'></div>");

        this._connector.appendTo(this._connectorWrapper);// @HTMLUpdateOK

        this._stepList = $('<ul>');
        this._stepList.addClass('oj-train-step-list');


        // Initialize the background progress bar object that will be updated to have the correct width based on the current step.
        this._connectorFill = $("<div class='oj-train-connector-fill'></div>");

        this._connectorFill.appendTo(this._connectorWrapper);// @HTMLUpdateOK

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
          var stepTag = $('<li>').addClass('oj-train-step-list-item').attr({ id: this._stepArray[i][1] });

          // Add message information
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

          stepTag.appendTo(this._stepList);// @HTMLUpdateOK

          this._drawLabel(i);
          this._drawStepFill(i);
          this._drawIndividualConnectorLine(i);
          this._drawButton(i);
          this._drawStepNumberLabel(i);
          this._drawMessageType(i);
          if (this._stretch) {
            stepTag.css('width', (100 / (this._stepNum)) + '%');
          }
        }

        // Update background progress bar width to show the progress.
        var connectorFillWidth = this._stepNum - 1 === this._selectedIndex ? 100
            : ((100 / (2 * (this._stepNum - 1)))
               + ((this._selectedIndex / (this._stepNum - 1)) * 100));
        this._connectorFill.css({ width: connectorFillWidth + '%' });

        this._stepList.appendTo(this._wrapper);// @HTMLUpdateOK

        this.element.addClass('oj-train');
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
          this._stepArray[i] = new Array(5);
          this._stepArray[i][0] = step.label ? step.label : null;
          this._stepArray[i][1] = step.id ? step.id : null;
          this._stepArray[i][2] = !!step.disabled;
          this._stepArray[i][3] = !!step.visited;
          this._stepArray[i][4] = step.messageType ? step.messageType : null;
        }
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
        var button = $('<div/>')
            .addClass('oj-train-button');
        var scrnRead = $('<span/>');
        var self = this;
        var desc = '';
        if (this._stepArray[index]) {
          var visited = this._stepArray[index][3];
          var disabled = this._stepArray[index][2];
          if (this._selectedIndex === index) {
            button.addClass('oj-selected');
            desc = ' current ';
          } else if (visited && !disabled) {
            button.addClass('oj-visited');
            desc = ' visited ';
          } else if (!visited && !disabled) {
            button.addClass('oj-default');
            desc = ' not visited ';
          } else {
            button.addClass('oj-disabled');
          }

          if (!this._stepArray[index][2] && this._selectedIndex !== index) {
            this._AddHoverable(button);
            this._AddActiveable(button);

            button.on('click' + this.eventNamespace, function (event) {
              self._fireSelectedStepOptionChange(this.parentNode.parentNode.id, event);
              self.refresh();
              self._setFocus(this.parentNode.parentNode.id);
            });
          }

          var stepBackground = this._stepList.children().eq(index).find('.oj-train-button-connector');

          // Check that there are at least 3 items in the list item indicating that a button has already been created for this step.
          // If there is remove it and insert the new button in the same position. If there isn't a preexsisting button, simply add one.
          if (stepBackground.length >= 1) {
            stepBackground.children().remove();
            stepBackground.append(button);// @HTMLUpdateOK
          } else {
            stepBackground.append(button); // @HTMLUpdateOK
          }
          scrnRead.text(desc);
          scrnRead.addClass('oj-helper-hidden-accessible');

          this._stepList.children().eq(index).find('a').append(scrnRead);// @HTMLUpdateOK
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
          var icon = $('<div/>')
              .addClass('oj-train-icon oj-component-icon')
              .attr('aria-hidden', 'true');
          var scrnRead = $('<span/>');
          var desc = '';
          var self = this;
          var messageType = this._stepArray[index][4];

          if (messageType === 'confirmation') {
            icon.addClass('oj-confirmation');
            desc = ' Confirmation ';
          } else if (messageType === 'info') {
            icon.addClass('oj-info');
            desc = ' Info ';
          } else if (messageType === 'error') {
            icon.addClass('oj-error');
            desc = ' Error ';
          } else if (messageType === 'fatal') {
            icon.addClass('oj-error');
            desc = ' Error ';
          } else if (messageType === 'warning') {
            icon.addClass('oj-warning');
            desc = ' Warning ';
          }

          // Remove previous messageType
          var button = this._stepList.children().eq(index).find('.oj-train-button');
          if (button.children().length >= 2) {
            button.children()[1].remove();
          }
          // Make icon clickable
          if (!this._stepArray[index][2] && this._selectedIndex !== index) {
            icon.on('click' + this.eventNamespace, function (event) {
              self._fireSelectedStepOptionChange(this.parentNode.parentNode.parentNode.id, event);
              self.refresh();
              self._setFocus(this.parentNode.parentNode.parentNode.id);
            });
          }
          // Add new message
          if (messageType != null) {
            // If there is remove it and insert the new icon in the same position.
            // Add description to span
            scrnRead.text(desc);
            scrnRead.addClass('oj-helper-hidden-accessible');

            this._stepList.children().eq(index).find('a').append(scrnRead);// @HTMLUpdateOK
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
        if (this._trigger('beforeDeselect', originalEvent, eventData) === false
            || this._trigger('beforeSelect', originalEvent, eventData) === false) {
          return;
        }

        // Set the previous step to visited
        var stepIndex = this._getStepIndex(previousValue);
        if (stepIndex !== -1) {
          var oldStepProperties = this.options.steps[stepIndex];
          oldStepProperties.visited = true;
        }

        this._trigger('deselect', originalEvent, eventData);

        if (this.options.selectedStep) {
          this.option('selectedStep',
                      value,
                      { _context: { originalEvent: originalEvent, internalSet: true } });
        }
        if (this.options.selected) {
          this.option('selected',
                      value,
                      { _context: { originalEvent: originalEvent, internalSet: true } });
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
        var stepNumberLabel = $('<div/>')
               .addClass('oj-train-button-text');
        stepNumberLabel.append((index + 1).toString());// @HTMLUpdateOK
        var stepBackground = this._stepList.children().eq(index).find('.oj-train-button');
        stepBackground.append(stepNumberLabel);// @HTMLUpdateOK
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
          var stepConnector = $('<div/>')
              .addClass('oj-train-step-individual-connector');
          if (index < this._selectedIndex) {
            stepConnector.addClass('oj-train-connector-before-selected-step');
          }
          this._stepList.children().eq(index).prepend(stepConnector);// @HTMLUpdateOK
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
        var stepFill = $('<div/>');
        stepFill.addClass('oj-train-button-connector');
        if (this._stepArray[index]) {
          if (index <= this._selectedIndex) {
            stepFill.addClass('oj-train-fill');
          }
          var stepLi = this._stepList.children().eq(index).children();
          stepFill.insertBefore(stepLi);// @HTMLUpdateOK
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
        var self = this;
        if (this._stepArray[index]) {
          var labelWrapper = $('<div/>')
                .addClass('oj-train-label-wrapper');
          var label = $('<a>');
          label.text(this._stepArray[index][0]);
          var disabled = this._stepArray[index][2];
          labelWrapper.append(label);// @HTMLUpdateOK
          label.addClass('oj-train-label');
          if (index === this._selectedIndex) {
            label.addClass('oj-selected');
          } else if (this._stepArray[index][3] && !disabled) {
            label.addClass('oj-visited');
          } else if (disabled) {
            label.addClass('oj-disabled');
          }
          if (!disabled) {
            label.attr('href', '#');
            this._focusable({
              element: label,
              applyHighlight: true
            });
            this._AddHoverable(label);
            this._AddActiveable(label);

            label.on('click keydown' + this.eventNamespace,
            /**
             * @suppress {missingProperties}
             */
            function (event) {
              if (event.keyCode === $.ui.keyCode.ENTER || event.type === 'click') {
                event.preventDefault();
                self._fireSelectedStepOptionChange(this.parentNode.parentNode.id, event);
                self.refresh();
                self._setFocus(this.parentNode.parentNode.id);
              }
            });
          }
          var stepLi = this._stepList.children().eq(index).children();
          if (stepLi.length >= 2) {
            stepLi[1].remove();
          }
          this._stepList.children().eq(index).append(labelWrapper);// @HTMLUpdateOK
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
       * @param {"info"|"error"|"fatal"|"warning"} [stepProperties.messageType] type of message displayed
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
            if (typeof (stepProperties.id) === 'string') {
              stepInfo[1] = stepProperties.id;
              stepObj.id = stepProperties.id;
            }
            if (typeof (stepProperties.disabled) === 'boolean') {
              stepInfo[2] = stepProperties.disabled;
              stepObj.disabled = stepProperties.disabled;
            }
            if (typeof (stepProperties.visited) === 'boolean') {
              stepInfo[3] = stepProperties.visited;
              stepObj.visited = stepProperties.visited;
            }
            if (stepProperties.messageType) {
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
        if ((key === 'selectedStep' || key === 'selected')
            && this._stepArray
            && this._stepArray[this._selectedIndex]) {
          var prevSelected = this._stepArray[this._selectedIndex][1];
          if (value === prevSelected) {
            return;
          }

          this._fireOptionChange(this._stepArray[this._selectedIndex][1], value, null);
        } else {
          this._super(key, value, flags);
        }
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
        // TODO: Refresh should not call destroy.
        this._super();
        this._destroy();
        this._setupTrain();
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
       * @param {string} event
       * @memberof oj.ojTrain
       * @return {void}
       * @private
       */
      _fireSelectedStepOptionChange: function (newSelectedStep, event) {
        var prevSelected = this._stepArray[this._selectedIndex][1];
        if (prevSelected !== newSelectedStep) {
          this._fireOptionChange(prevSelected, newSelectedStep, event);
        }
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

      //* * @inheritdoc */
      getNodeBySubId: function (locator) {
        if (locator === null) {
          return this.element ? this.element[0] : null;
        }

        var subId = locator.subId;
        var index = locator.index;

        if ((typeof index !== 'number') ||
            index < 0 || index >= this._stepNum) {
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
            // return this._stepList.children().eq(index).find('.oj-train-button');

            //  - OJ-TRAIN-LABEL DOES NOT RETURN THE RIGHT NODE
            return this._stepList.children().eq(index).find('.oj-train-label')[0];
          default:
            // Non-null locators have to be handled by the component subclasses
            return null;
        }
      },

      //* * @inheritdoc */
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
          if ($(currentNode).closest(subIdNode).length > 0
              || ($(currentNode)
                  .closest($(subIdNode.parentNode.parentNode).find('.oj-train-label')[0])
                  .length > 0)) {
            return stepLocator;
          }
        }
        return null;
      }

    // Fragments:
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

    /**
     * {@ojinclude "name":"ojStylingDocIntro"}
     *
     * <table class="generic-table styling-table">
     *   <thead>
     *     <tr>
     *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
     *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td> oj-train-stretch</td>
     *       <td> Optional class that may be added to the train div which will stretch the train to cover the full width of the container specified. </td>
     *     </tr>
     *   </tbody>
     * </table>
     * <br>
     *
     * Train step label wrapping is controlled by the $trainLabelTextWrap SASS Variable. $trainLabelTextWrap accepts css white-space values such as normal or nowrap(default).
     *
     * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
     * @memberof oj.ojTrain
     */

    // Sub_IDs:

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
    });
}());


/* global __oj_train_metadata:false */
(function () {
  __oj_train_metadata.extension._WIDGET_NAME = 'ojTrain';
  oj.CustomElementBridge.register('oj-train', { metadata: __oj_train_metadata });
}());

});