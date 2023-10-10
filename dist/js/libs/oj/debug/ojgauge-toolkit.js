/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit', 'ojs/ojdvt-axis'], function (exports, dvt, ojdvtAxis) { 'use strict';

  /**
   * Style related utility functions for gauge components.
   * @class
   */
  const DvtGaugeDataUtils = {
    /**
     * Returns true if the specified chart has data.
     * @param {DvtGauge} gauge
     * @return {boolean}
     */
    hasData: (gauge) => {
      var options = gauge.getOptions();

      // Check that there is a data object with a valid value
      return options && options['value'] != null && DvtGaugeDataUtils.hasValidData(gauge);
    },

    /**
     * Returns true if the specified chart has valid data.
     * @param {DvtGauge} gauge
     * @return {boolean}
     */
    hasValidData: (gauge) => {
      var options = gauge.getOptions();

      // Check that the min and max are not equal to each other
      return Number(options['min']) < Number(options['max']);
    },

    /**
     * Returns the index of the threshold corresponding to the gauge value.
     * @param {DvtGauge} gauge
     * @param {number} value Optional parameter for thresholdIndex of value that isn't the gauge value
     * @return {number} The index of the threshold definition or null if none is available.
     */
    getValThresholdIdx: (gauge, value) => {
      var options = gauge.getOptions();
      var gaugeValue = value != null ? value : options['value'];
      var thresholds = options['thresholds'];

      // Return -1 if no thresholds exist
      if (!thresholds) return -1;

      // Loop through and find the threshold
      for (var i = 0; i < thresholds.length; i++) {
        if (gaugeValue <= thresholds[i]['max']) return i;
      }

      // None found, but thresholds exist, this means the last threshold
      return thresholds.length - 1;
    },

    /**
     * Returns the specified threshold.
     * @param {DvtGauge} gauge
     * @param {number} index The index of the threshold.
     * @return {object} The threshold definition or null if none is available.
     */
    getThreshold: (gauge, index) => {
      var thresholds = gauge.getOptions()['thresholds'];

      if (thresholds && index >= 0 && index < thresholds.length) return thresholds[index];
      else return null;
    },

    /**
     * Returns the specified referenceObject.
     * @param {DvtGauge} gauge
     * @param {number} index The index of the referenceObject.
     * @return {object} The referenceObject definition or null if none is available.
     */
    getReferenceObject: (gauge, index) => {
      var options = gauge.getOptions();
      var referenceObjects = options['referenceLines'];
      if (referenceObjects && index >= 0 && index < referenceObjects.length)
        return referenceObjects[index];
      else return null;
    }
  };

  /**
   * Renderer for DvtGauge.
   * @class
   */
  const DvtGaugeRenderer = {
    /**
     * Renders the empty text for the component.
     * @param {DvtGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     */
    renderEmptyText: (gauge, container, availSpace) => {
      // Get the empty text string
      var options = gauge.getOptions();
      var translations = options.translations;
      var emptyTextStr = options['emptyText'];
      if (!emptyTextStr) emptyTextStr = translations.labelNoData;
      if (!DvtGaugeDataUtils.hasValidData(gauge)) emptyTextStr = translations.labelInvalidData;

      // Set font size
      var metricLabelStyle = options['_statusMessageStyle'];
      if (!metricLabelStyle.getStyle('font-size')) metricLabelStyle.setStyle('font-size', '13px');

      if (gauge.type === 'statusMeter') {
        var metricLabelColor = metricLabelStyle.getStyle('color');
        metricLabelColor = metricLabelColor ? metricLabelColor : '#333333';
        metricLabelStyle.setStyle('color', metricLabelColor);
      }

      gauge.renderEmptyText(
        container,
        emptyTextStr,
        new dvt.Rectangle(availSpace.x, availSpace.y, availSpace.w, availSpace.h),
        gauge.getEventManager(),
        metricLabelStyle
      );
    },

    /**
     * Formats gauge metricLabel.
     * @param {float} value The value to render into.
     * @param {Object} gauge The gauge.
     * @return {string} The formatted metric label string
     */
    getFormattedMetricLabel: (value, gauge) => {
      var options = gauge.getOptions();
      if (options['metricLabel']['text']) return options['metricLabel']['text'];

      var converter = options['metricLabel']['converter'];
      var scaling = options['metricLabel']['scaling'];
      var autoPrecision = options['metricLabel']['autoPrecision']
        ? options['metricLabel']['autoPrecision']
        : 'on';
      var isPercent = options['metricLabel']['textType'] === 'percent';
      return DvtGaugeRenderer._formatMetricLabelValue(
        value,
        gauge,
        converter,
        scaling,
        autoPrecision,
        isPercent
      );
    },

    /**
     * Formats gauge metricLabel.
     * @param {float} value The value to render into.
     * @param {Object} gauge The gauge.
     * @param {object} converter The converter object to use for formatting
     * @param {string} scaling The scale used for formatting the number
     * @param {string} autoPrecision "on" if auto precision should be applied otherwise "off"; if null or undefined then auto precision is applied.
     * @param {boolean} isPercent Specifies whether we should use percent formatting for this metricLabel.
     * @return {string} The formatted string value for this metricLabel
     * @private
     */
    _formatMetricLabelValue: (value, gauge, converter, scaling, autoPrecision, isPercent) => {
      var options = gauge.getOptions();

      var minValue = options['min'];
      var maxValue = options['max'];
      var output;

      var difference = maxValue - minValue;
      var divider = difference < 1000 ? 100 : 1000;
      var increment = null;
      if (!isNaN(difference)) increment = difference / divider;

      if (isPercent) {
        value = DvtGaugeRenderer.getFillPercentage(
          options,
          options['min'],
          options['max'],
          value,
          true
        );
      }

      // when scaling is set then init formatter
      var formatter = new ojdvtAxis.LinearScaleAxisValueFormatter(
        minValue,
        maxValue,
        increment,
        scaling,
        autoPrecision,
        options.translations
      );
      if (converter && converter['format']) output = formatter.format(value, converter);
      else if (isPercent) {
        var percentConverter = gauge.getCtx().getNumberConverter({
          style: 'percent',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        });
        if (percentConverter && percentConverter['format']) {
          output = percentConverter['format'](value);
        } else {
          output = String(Math.round(value * 100)) + '%';
        }
      } else output = formatter.format(value);

      return output;
    },

    /**
     * Determine percent of total area to fill
     * @param {object} options The object containing the data.
     * @param {number} min Min value.
     * @param {number} max Max value.
     * @param {number} value Value to draw to.
     * @param {boolean} unbound Specifies whether to not bound the return value by 0 and 1
     * @return {number} Percent of the area filled
     */
    getFillPercentage: (options, min, max, value, unbound) => {
      var percentFill = (value - min) / (options['max'] - options['min']);
      percentFill = unbound ? percentFill : Math.min(Math.max(0, percentFill), 1);
      return percentFill;
    },

    /**
     * Returns the tooltip string for the specified gauge.
     * @param {DvtGauge} gauge
     * @return {string}
     */
    getTooltipString: (gauge) => {
      var options = gauge.getOptions();
      var thresholdIndex = DvtGaugeDataUtils.getValThresholdIdx(gauge);
      var threshold = DvtGaugeDataUtils.getThreshold(gauge, thresholdIndex);
      var metricValue = DvtGaugeRenderer.getFormattedMetricLabel(options['value'], gauge);
      // Tooltip is based on the threshold shortDesc, top level shortDesc, or metric label. Check null to allow suppression.
      if (threshold && threshold['shortDesc'] != null) return threshold['shortDesc'];
      else if (options['shortDesc'] != null) return options['shortDesc'];
      else if (options['label']['text'])
        return dvt.ResourceUtils.format(options.translations.labelAndValue, [
          options['label']['text'],
          metricValue
        ]);
      // Use the formatted metric label
      else return metricValue;
    },

    /**
     * Renders the metricLabel into the specified area.
     * @param {DvtGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {color} color MetricLabel color
     * @param {string} halign The horizontal alignment
     * @param {string} valign The vertical alignment
     * @param {boolean=} isRenderedByDefault Whether the metricLabel is rendered by default. Defaults to false.
     * @return {boolean} Return true if the label is rendered
     */
    renderMetricLabel: (gauge, container, bounds, color, halign, valign, isRenderedByDefault) => {
      var options = gauge.getOptions();
      var rendered = false;

      // Create and position the metricLabel
      if (
        options['metricLabel']['rendered'] === 'on' ||
        (isRenderedByDefault && options['metricLabel']['rendered'] !== 'off')
      ) {
        var metricLabelString = DvtGaugeRenderer.getFormattedMetricLabel(options['value'], gauge);
        var minString = DvtGaugeRenderer.getFormattedMetricLabel(options['min'], gauge);
        var maxString = DvtGaugeRenderer.getFormattedMetricLabel(options['max'], gauge);

        // Create the label and align
        var metricLabel = new dvt.OutputText(
          gauge.getCtx(),
          metricLabelString,
          bounds.x + bounds.w / 2,
          bounds.y + bounds.h / 2
        );
        metricLabel.setCSSStyle(options['metricLabel']['style']);
        var size = options['metricLabel']['style'].getStyle('font-size');
        if (!size) {
          size = DvtGaugeRenderer.calcLabelFontSize(
            [metricLabelString, minString, maxString],
            metricLabel,
            bounds
          );
          metricLabel.setTextString(metricLabelString);
          metricLabel.setFontSize(size);
        }

        if (valign === 'top') {
          metricLabel.setY(bounds.y);
          metricLabel.alignTop();
        } else if (valign === 'middle') {
          dvt.TextUtils.centerTextVertically(metricLabel, bounds.y + bounds.h / 2);
        } else if (valign === 'bottom') {
          metricLabel.setY(bounds.y + bounds.h);
          metricLabel.alignBottom();
        }

        if (halign === 'center') metricLabel.alignCenter();
        else if (halign == 'left') {
          metricLabel.setX(bounds.x);
          metricLabel.alignLeft();
        } else if (halign === 'right') {
          metricLabel.setX(bounds.x + bounds.w);
          metricLabel.alignRight();
        }

        // Set color
        if (color != null) metricLabel.setSolidFill(color);

        // Truncate if needed, null is returned if the label doesn't fit
        rendered = dvt.TextUtils.fitText(metricLabel, bounds.w, bounds.h, container);
      }
      return rendered;
    },

    /**
     * Renders the label into the specified area.
     * @param {DvtGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {color} color Label color
     * @param {string} valign The vertical alignment
     * @return {boolean} Return true if the label is rendered
     */
    renderLabel: (gauge, container, bounds, color, valign) => {
      var options = gauge.getOptions();
      var rendered = false;

      // Create and position the metricLabel
      if (options['label']['text']) {
        var labelString = options['label']['text'];
        var labelStyle = options['label']['style'];
        var label = new dvt.MultilineText(gauge.getCtx(), labelString);
        var fontStyle = labelStyle.clone();
        label.setCSSStyle(labelStyle);
        var size =
          labelStyle.getStyle('font-size') ||
          dvt.TextUtils.getOptimalFontSize(
            label.getCtx(),
            label.getTextString(),
            label.getCSSStyle(),
            bounds
          );
        fontStyle.setFontSize('font-size', size, gauge.getCtx());

        // Set color
        if (color != null) fontStyle.setStyle('color', color);

        label.setCSSStyle(fontStyle);
        rendered = dvt.TextUtils.fitText(label, bounds.w, bounds.h, gauge);

        var textHeight = label.getDimensions().h;
        if (valign === 'top') label.setY(bounds.y);
        else if (valign === 'bottom') label.setY(bounds.y + bounds.h - textHeight);
        else label.setY(bounds.y + bounds.h / 2 - textHeight / 2);

        label.setX(bounds.x + bounds.w / 2);
        label.alignCenter();
        container.addChild(label);
      }
      return rendered;
    },

    /**
     * Returns the optimal font size based on a list of labels and the available bounds
     * @param {Array} labels A list of label strings used to find the optimal string size for the label
     * @param {dvt.OutputText} label The text object used to get the optimal size
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @return {string} The optimal font size with the unit 'px'
     */
    calcLabelFontSize: (labels, label, bounds) => {
      var maxWidth = 0;
      var maxLabel = null;
      var width = 0;
      for (var i = 0; i < labels.length; i++) {
        label.setTextString(labels[i]);
        width = label.getDimensions().w;
        if (width > maxWidth) {
          maxLabel = labels[i];
          maxWidth = width;
        }
      }
      label.setTextString(maxLabel);
      return dvt.TextUtils.getOptimalFontSize(
        label.getCtx(),
        label.getTextString(),
        label.getCSSStyle(),
        bounds
      );
    },

    /**
     * Get step adjusted value.
     * @param {object} options The object containing the data.
     * @param {number} value Current value
     * @return {number} Adjusted value
     */
    adjustForStep: (options, value) => {
      var step = Number(options['step']);
      if (step && step > 0) {
        var stepNum = value / step;

        // If the min is 0 stars, we should allocate the first half of the star for the 0 value in order to give it
        // some selection space.
        if (stepNum < 0.5) return options['min'];
        else {
          var adjustedValue = Math.ceil(stepNum) * step;
          return Math.max(Math.min(options['max'], adjustedValue), options['min']);
        }
      }
      return value;
    }
  };

  /**
   *  Provides automation services for a DVT component.
   *  @class DvtGaugeAutomation
   *  @param {DvtGauge} dvtComponent
   *  @implements {dvt.Automation}
   *  @constructor
   */
  class DvtGaugeAutomation extends dvt.Automation {
    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>tooltip</li>
     * </ul>
     * @override
     */
    getDomElementForSubId(subId) {
      if (subId === dvt.Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._comp);
      else if (subId.indexOf('item') === 0) {
        var openParen = subId.indexOf('[');
        var closeParen = subId.indexOf(']');

        if (openParen > 0 && closeParen > 0) {
          var index = subId.substring(openParen + 1, closeParen);
          var item = this._comp.__getRatingGaugeItem(index);
          if (item) return item.getElem();
        }
      }
      return null;
    }

    /**
     * @override
     */
    GetSubIdForDomElement(displayable) {
      var gauge = this._comp;
      var options = gauge.getOptions();
      for (var i = 0; i < options['max']; i++) {
        var item = gauge.__getRatingGaugeItem(i);
        if (item === displayable) {
          return 'item[' + i + ']';
        }
      }
      return null;
    }

    /**
     * Returns the value of the gauge. Used for verification.
     * @return {Number} the value of the gauge
     */
    getValue() {
      return this._comp.getOptions()['value'];
    }

    /**
     * Returns the formatted metric label of the gauge. Used for verification.
     * Valid only for DialGauge, LedGauge, and StatusMeterGauge.
     * @return {String} the formatted metric label string
     */
    getMetricLabel() {
      return DvtGaugeRenderer.getFormattedMetricLabel(this.getValue(), this._comp);
    }
  }

  /**
   * Event Manager for DvtGauge.
   * @param {DvtGauge} gauge
   * @class
   * @extends {dvt.EventManager}
   * @constructor
   */
  class DvtGaugeEventManager extends dvt.EventManager {
    constructor(gauge) {
      super(gauge.getCtx(), gauge.dispatchEvent, gauge, gauge);
      this._gauge = gauge;
      this.IsMouseEditing = false;
    }

    /**
     * @override
     */
    OnMouseDown(event) {
      // Set the editing flag so moves are tracked
      if (this._gauge.IsInteractive()) {
        this.IsMouseEditing = true;
        this.hideTooltip();
        var coords = this.GetRelativePosition(event.pageX, event.pageY);
        this._gauge.__processValueChangeStart(coords.x, coords.y);
        //  - Need to prevent default because of firefox issue
        event.preventDefault();
      } // Don't call super if editing, just handle it in this subclass
      else super.OnMouseDown(event);
    }

    /**
     * @override
     */
    OnMouseUp(event) {
      // Reset the editing flag
      if (this.IsMouseEditing) {
        this.StopMouseEditing(event);
      } // Don't call super if editing, just handle it in this subclass
      else super.OnMouseUp(event);
    }

    /**
     * @override
     */
    OnMouseMove(event) {
      // Only process move events when editing
      if (this.IsMouseEditing) {
        var coords = this.GetRelativePosition(event.pageX, event.pageY);
        this._gauge.__processValueChangeMove(coords.x, coords.y);
      }
      if (this.IsShowingTooltipWhileEditing() || !this.IsMouseEditing) super.OnMouseMove(event);
    }

    /**
     * Controls whether the tooltip shows up on hover/mousemove
     * @return {boolean}
     */
    IsShowingTooltipWhileEditing() {
      return false;
    }

    /**
     * @override
     */
    PreEventBubble(event) {
      var coords;
      if (dvt.TouchEvent.TOUCHSTART === event.type && this._gauge.IsInteractive()) {
        // Set the editing flag so moves are tracked
        this.IsMouseEditing = true;
        coords = this.GetRelativePosition(event.touches[0].pageX, event.touches[0].pageY);
        this._gauge.__processValueChangeStart(coords.x, coords.y);

        // Prevent default action from occuring
        event.preventDefault();
      } else if (dvt.TouchEvent.TOUCHMOVE === event.type && this.IsMouseEditing) {
        coords = this.GetRelativePosition(event.touches[0].pageX, event.touches[0].pageY);
        this._gauge.__processValueChangeMove(coords.x, coords.y);

        // Prevent default action from occuring
        event.preventDefault();
      } else if (dvt.TouchEvent.TOUCHEND === event.type && this.IsMouseEditing) {
        this.IsMouseEditing = false;
        coords = this.GetRelativePosition(
          event.changedTouches[0].pageX,
          event.changedTouches[0].pageY
        );
        this._gauge.__processValueChangeEnd(coords.x, coords.y);

        // Prevent default action from occuring
        event.preventDefault();
      }
      // If editing, only show tooltip if it is enabled
      if (!this.IsMouseEditing || this.IsShowingTooltipWhileEditing()) super.PreEventBubble(event);
    }

    /**
     * @override
     */
    ProcessKeyboardEvent(event) {
      if (!this.KeyboardHandler) return false;

      this.KeyboardHandler.processKeyDown(event);
      var keyCode = event.keyCode;

      if (
        keyCode === dvt.KeyboardEvent.UP_ARROW ||
        keyCode === dvt.KeyboardEvent.LEFT_ARROW ||
        keyCode === dvt.KeyboardEvent.DOWN_ARROW ||
        keyCode === dvt.KeyboardEvent.RIGHT_ARROW ||
        keyCode === dvt.KeyboardEvent.TAB
      ) {
        var pos = this._gauge.getCtx().getStageAbsolutePosition();
        this.ProcessObjectTooltip(event, pos.x, pos.y, this._gauge.__getLogicalObject(), this._gauge);
      }

      return false;
    }

    /**
     * @override
     */
    OnBlur(event) {
      super.OnBlur(event);
      this.hideTooltip();
    }

    /**
     * Returns the position of the specified page coords, relative to the component.
     * @param {number} pageX
     * @param {number} pageY
     * @return {dvt.Point}
     * @protected
     */
    GetRelativePosition(pageX, pageY) {
      var stageCoords = this.getCtx().pageToStageCoords(pageX, pageY);
      return this._gauge.stageToLocal(stageCoords);
    }

    /**
     * @override
     */
    UpdateActiveElement(obj, displayable) {
      // noop: Gauges manage their own WAI-ARIA properties and should not participate in default event manager support.
    }

    /**
     * Returns whether we are currenctly editing by mouse or touch. Used to decide which tooltip to show for rating gauge.
     * @return {boolean}
     */
    __isMouseEditing() {
      return this.IsMouseEditing;
    }

    /**
     * Processes end of hover state and sets mouse edit flag to false
     * @param {event} event
     */
    StopMouseEditing(event) {
      this.IsMouseEditing = false;
      var coords = this.GetRelativePosition(event.pageX, event.pageY);
      this._gauge.__processValueChangeEnd(coords.x, coords.y);
    }
  }

  /**
   * @param {dvt.EventManager} manager The owning dvt.EventManager
   * @param {DvtGauge} gauge
   * @class DvtGaugeKeyboardHandler
   * @extends {dvt.KeyboardHandler}
   * @constructor
   */
  class DvtGaugeKeyboardHandler extends dvt.KeyboardHandler {
    constructor(manager, gauge) {
      super(manager);
      this._gauge = gauge;
    }

    /**
     * @override
     */
    processKeyDown(event) {
      // Note: Don't call superclass so that the arrow key behaviors are not overridden
      var keyCode = event.keyCode;
      var isR2L = dvt.Agent.isRightToLeft(this._gauge.getCtx());
      var value = this._gauge.getOptions()['value'];
      if (!this._gauge.getOptions()['readOnly']) {
        if (
          (keyCode === dvt.KeyboardEvent.ENTER || keyCode === dvt.KeyboardEvent.TAB) &&
          this._oldValue !== value
        ) {
          this._gauge.dispatchEvent(
            dvt.EventFactory.newValueChangeEvent(this._oldValue, value, true)
          );
          this._oldValue = null;
        } else if (
          keyCode === dvt.KeyboardEvent.UP_ARROW ||
          keyCode === (isR2L ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW)
        ) {
          this._gauge.__increaseValue();
          dvt.EventManager.consumeEvent(event);
        } else if (
          keyCode === dvt.KeyboardEvent.DOWN_ARROW ||
          keyCode === (isR2L ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW)
        ) {
          this._gauge.__decreaseValue();
          dvt.EventManager.consumeEvent(event);
        }

        if (this._oldValue === null) this._oldValue = value;
      }
    }
  }

  /**
   * Style related utility functions for gauge components.
   * @class
   */
  const DvtGaugeStyleUtils = {
    /**
     * Returns the color, taking into account the thresholds if specified.
     * @param {DvtGauge} gauge
     * @return {string} The color of the gauge.
     */
    getColor: (gauge) => {
      // Options Object
      var options = gauge.getOptions();

      // Thresholds
      var thresholdIndex = DvtGaugeDataUtils.getValThresholdIdx(gauge);
      var threshold = DvtGaugeDataUtils.getThreshold(gauge, thresholdIndex);
      if (
        threshold &&
        (!(gauge.type === 'statusMeter') ||
          (gauge.type === 'statusMeter' && options['thresholdDisplay'] === 'onIndicator'))
      ) {
        return DvtGaugeStyleUtils.getThresholdColor(gauge, threshold, thresholdIndex);
      }

      return options['color'];
    },

    /**
     * Returns the border color, taking into account the thresholds if specified.
     * @param {DvtGauge} gauge
     * @return {string} The border color of the gauge.
     */
    getBorderColor: (gauge) => {
      // Options Object
      var options = gauge.getOptions();

      // Thresholds
      var thresholdIndex = DvtGaugeDataUtils.getValThresholdIdx(gauge);
      var threshold = DvtGaugeDataUtils.getThreshold(gauge, thresholdIndex);

      if (
        threshold &&
        threshold['borderColor'] &&
        (!(gauge.type === 'statusMeter') ||
          (gauge.type === 'statusMeter' && options['thresholdDisplay'] === 'onIndicator'))
      )
        return threshold['borderColor'];

      return options['borderColor'];
    },

    /**
     * Returns the color, taking into account the thresholds if specified.
     * @param {DvtGauge} gauge
     * @return {string} The color of the gauge.
     */
    getPlotAreaColor: (gauge) => {
      // Options Object
      var options = gauge.getOptions();

      // Thresholds
      var thresholdIndex = DvtGaugeDataUtils.getValThresholdIdx(gauge);
      var threshold = DvtGaugeDataUtils.getThreshold(gauge, thresholdIndex);
      if (
        threshold &&
        (!(gauge.type === 'statusMeter') ||
          (gauge.type === 'statusMeter' && options['thresholdDisplay'] !== 'onIndicator'))
      ) {
        return DvtGaugeStyleUtils.getThresholdColor(gauge, threshold, thresholdIndex);
      }

      return options['plotArea']['color'];
    },

    /**
     * Returns the color, taking into account the thresholds if specified.
     * @param {DvtGauge} gauge
     * @return {string} The border color of the gauge.
     */
    getPlotAreaBorderColor: (gauge) => {
      // Options Object
      var options = gauge.getOptions();
      var borderColor = options['plotArea']['borderColor'];
      if (gauge.type === 'statusMeter' && options['orientation'] == 'circular') {
        return null;
      }
      return borderColor;
    },

    /**
     * Returns the defined threshold color or gets it from the threshold color ramp
     * @param {DvtGauge} gauge
     * @param {object} threshold
     * @param {number} thresholdIndex
     * @return {string} The Threshold color of the gauge.
     */
    getThresholdColor: (gauge, threshold, thresholdIndex) => {
      if (threshold['color']) return threshold['color'];
      // Style Defaults
      var options = gauge.getOptions();
      var defaultColors = options['_thresholdColors'];
      var colorIndex = thresholdIndex % defaultColors.length;
      return options['_thresholdColors'][colorIndex];
    }
  };

  /**
   * Abstract Base Class for Gauge component.
   * @class
   * @constructor
   * @extends {dvt.BaseComponent}
   */
  class DvtGauge extends dvt.BaseComponent {
    constructor(context, callback, callbackObj, bStaticRendering) {
      super(context, callback, callbackObj);

      //  - unable to get cursor on gauges
      context.getStage().setCursor('');

      // If non-interactive, we can skip the following
      this._bStaticRendering = bStaticRendering;
      if (!this._bStaticRendering) {
        // Create the event handler and add event listeners
        this.EventManager = this.CreateEventManager();
        this.EventManager.addListeners(this);

        // Set up keyboard handler on non-touch devices
        if (!dvt.Agent.isTouchDevice()) {
          this.EventManager.setKeyboardHandler(this.CreateKeyboardHandler(this.EventManager));
        }

        // Make sure the object has an id for clipRect naming
        this.setId('gauge' + 1000 + Math.floor(Math.random() * 1000000000)); //@RandomNumberOK

        // Create an editing overlay to prevent touch conflicts
        this._editingOverlay = new dvt.Rect(context, 0, 0);
        this._editingOverlay.setInvisibleFill();
        this.addChild(this._editingOverlay);
      }

      /** @private **/
      this._bEditing = false;

      /** @private **/
      this._bResizeRender = false;

      /** @private **/
      this._oldValue = null;
    }

    SetOptions(options) {
      super.SetOptions(options);
      this.Options = options;

      if (dvt.Agent.isEnvironmentTest()) {
        this.Options['animationOnDisplay'] = 'none';
        this.Options['animationOnDataChange'] = 'none';
      }

      //  - Disable gradient overlay by default for IE
      if (
        (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') &&
        this.Options['visualEffects'] === 'auto'
      ) {
        this.Options['visualEffects'] = 'none';
      }

      if (options['className']) {
        this.Options['svgClassName'] = options['className'];
      }

      if (options['style']) {
        this.Options['svgStyle'] = options['style'];
      }
    }

    render(options, width, height) {
      // Update if a new options object has been provided or initialize with defaults if needed.
      if (options) {
        this.SetOptions(options);
      } else if (!this.Options) {
        this.SetOptions(null);
      }

      // Sort the thresholds by value if defined
      if (this.Options['thresholds']) {
        var thresholds = this.Options['thresholds'];
        this.Options['thresholds'] = thresholds.sort(DvtGauge._thresholdComparator);
      }

      // Update the store width and height if provided
      if (typeof width === 'number' && typeof height === 'number') {
        // Turn off animation if the gauge is being resized
        if (
          (this.Width !== 0 && this.Width !== width) ||
          (this.Height !== 0 && this.Height !== height)
        ) {
          this._bResizeRender = true;
        } else {
          this._bResizeRender = false;
        }

        this.Width = width;
        this.Height = height;
      }

      this.__oldShapes = this.__shapes;
      this.__shapes = [];

      // Render the gauge.  Add the container at index 0 to avoid interfering with the editable overlay.
      var container = new dvt.Container(this.getCtx());
      this.addChildAt(container, 0);
      var isRenderComplete = this.Render(container, this.Width, this.Height) !== false;
      if (isRenderComplete) {
        this.PostRender(options, container);
      }
    }

    /**
     * Post processing after gauge is rendered.
     * @param {object} options component options
     * @param {dvt.Container} container The container to render within.
     * @protected
     */
    PostRender(options, container) {
      this._setAnimation(container, options != null, this.__oldShapes, this.Width, this.Height);

      // Set the size of the editing overlay if editable
      if (this._editingOverlay) {
        this._editingOverlay.setWidth(this.Width);
        this._editingOverlay.setHeight(this.Height);

        // Tooltip support
        this.getEventManager().associate(this._editingOverlay, this.__getLogicalObject(), true);
      }

      this.UpdateAriaAttributes();

      if (!this._bStaticRendering && !this.Options['readOnly']) {
        container.setAriaRole('slider');
        container.setAriaProperty('valuemin', this.Options['min']);
        container.setAriaProperty('valuemax', this.Options['max']);
        var value = DvtGaugeRenderer.getFormattedMetricLabel(this.Options['value'], this);
        container.setAriaProperty('valuenow', value);
        container.setAriaProperty('valuetext', value);
        var tooltip = DvtGaugeRenderer.getTooltipString(this);

        if (dvt.Agent.isTouchDevice()) {
          this._container.setAriaProperty('live', 'assertive');
          if (value !== tooltip) {
            tooltip = value + dvt.AriaUtils.ARIA_LABEL_DESC_DELIMITER + tooltip;
          }
        }
        if (value !== tooltip) {
          container.setAriaProperty('label', tooltip);
        }

        // Generate a unique id to force screen readers to update for each render (and potential value change)
        this._renderCount = this._renderCount != null ? this._renderCount + 1 : 0;
        var ariaId = this.getId() + '_' + this._renderCount;
        container.setId(ariaId);

        // Set as the active element that's read by the screen reader.
        this.getCtx().setActiveElement(container);
      }

      // . To support ADF action attribute
      if (this.Options['_selectingCursor']) {
        this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
      }

      if (!this.Animation) {
        // If not animating, that means we're done rendering, so fire the ready event.
        this.RenderComplete();
      }
    }

    /**
     * Creates and returns a logical object for this gauge.
     * @return {dvt.SimpleObjPeer}
     */
    __getLogicalObject() {
      var customTooltip = this.Options['tooltip'];
      var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
      var color = DvtGaugeStyleUtils.getColor(this);
      if (tooltipFunc) {
        var dataContext = {
          component: this.Options['_widgetConstructor'],
          label: DvtGaugeRenderer.getFormattedMetricLabel(this.Options['value'], this),
          color: color
        };
        return new dvt.CustomDatatipPeer(
          this.getCtx().getTooltipManager(),
          tooltipFunc,
          color,
          dataContext
        );
      }
      var tooltip = DvtGaugeRenderer.getTooltipString(this);
      return new dvt.SimpleObjPeer(null, tooltip, color);
    }

    /**
     * Renders the component at the specified size.
     * @param {dvt.Container} container The container to render within.
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     */
    Render(container, width, height) {
      // subclasses should override
    }

    /**
     * Checks animation settings for the gauge and creates and plays animation on display
     * or animation on data change.
     * @param {dvt.Container} container The container to render within.
     * @param {boolean} bData True if new data was provided to the gauge.
     * @param {Array} oldShapes The array of DvtShapes that can be animated
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     * @private
     */
    _setAnimation(container, bData, oldShapes, width, height) {
      // Stop any animation in progress before starting new animation
      this.StopAnimation();

      var bBlackBoxUpdate = false;
      var animationOnDataChange =
        this._bEditing || this._bResizeRender ? 'none' : this.getOptions()['animationOnDataChange'];
      var animationOnDisplay =
        this._bEditing || this._bResizeRender ? 'none' : this.getOptions()['animationOnDisplay'];
      var animationDuration =
        dvt.CSSStyle.getTimeMilliseconds(this.getOptions()['animationDuration']) / 1000;

      if (!animationOnDisplay && !animationOnDataChange) return;

      var bounds = new dvt.Rectangle(0, 0, width, height);
      var context = this.getCtx();

      if (!this._container && animationOnDisplay !== 'none' && this.__shapes[0] != null) {
        // animationOnDisplay
        this.Animation = dvt.BlackBoxAnimationHandler.getInAnimation(
          context,
          animationOnDisplay,
          container,
          bounds,
          animationDuration
        );
        if (!this.Animation)
          this.Animation = this.CreateAnimOnDisplay(
            this.__shapes,
            animationOnDisplay,
            animationDuration
          );
      } else if (
        this._container &&
        animationOnDataChange !== 'none' &&
        bData &&
        this.__shapes[0] != null
      ) {
        // animationOnDataChange
        this.Animation = dvt.BlackBoxAnimationHandler.getCombinedAnimation(
          context,
          animationOnDataChange,
          this._container,
          container,
          bounds,
          animationDuration
        );
        if (this.Animation) bBlackBoxUpdate = true;
        else
          this.Animation = this.CreateAnimOnDataChange(
            oldShapes,
            this.__shapes,
            animationOnDisplay,
            animationDuration
          );
      }

      if (!bBlackBoxUpdate && this._container) {
        this.removeChild(this._container);
        this._container.destroy();
      }

      if (this.Animation) {
        this.Animation.play();
        this.Animation.setOnEnd(this._onAnimEnd, this);
      }

      if (bBlackBoxUpdate) this._oldContainer = this._container;

      this._container = container;
    }

    /**
     * Creates a dvt.Playable that performs animation upon inital gauge display.
     * @param {Array} objs The array of DvtShapes to animate to.
     * @param {string} animationType The animation type.
     * @param {number} animationDuration The duration of the animation in seconds.
     * @return {dvt.Playable}
     * @protected
     */
    CreateAnimOnDisplay(objs, animationType, animationDuration) {
      // subclasses may implement
      return null;
    }

    /**
     * Creates a dvt.Playable that performs animation for a gauge update.
     * @param {Array} oldObjs The array of DvtShapes to animate from.
     * @param {Array} newObjs The array of DvtShapes to animate to.
     * @param {string} animationType The animation type.
     * @param {number} animationDuration The duration of the animation in seconds.
     * @return {dvt.Playable}
     * @protected
     */
    CreateAnimOnDataChange(oldObjs, newObjs, animationType, animationDuration) {
      var animatedObjs = [];
      for (var i = 0; i < oldObjs.length; i++) {
        var oldObj = oldObjs[i];
        var newObj = newObjs[i];
        var startState = oldObj.getAnimParams();
        var endState = newObj.getAnimParams();

        newObj.setAnimParams(startState);
        var animation = new dvt.CustomAnimation(this.getCtx(), newObj, animationDuration);
        animation
          .getAnimator()
          .addProp(
            dvt.Animator.TYPE_NUMBER_ARRAY,
            newObj,
            newObj.getAnimParams,
            newObj.setAnimParams,
            endState
          );
        animatedObjs.push(animation);
      }
      return new dvt.ParallelPlayable(this.getCtx(), animatedObjs);
    }

    /**
     * Returns the value at the specified coordinates.  Subclasses must override to support editing behavior.
     * @param {number} x The x coordinate of the value change.
     * @param {number} y The y coordinate of the value change.
     * @return {number}
     * @protected
     */
    GetValueAt(x, y) {
      return null;
    }

    /**
     * Wrapper for the render function to be overridden if subclasses want to behave differently during update events
     */
    renderUpdate() {
      this.render();
      this.UpdateAriaLiveValue(this._container);
    }

    /**
     * Helper function for updating the live values that are read out while editing for accessibility
     * @param {dvt.Container} container The slider container we are using.
     * @param {number} value The value of the gauge
     * @protected
     */
    UpdateAriaLiveValue(container, value) {
      value = DvtGaugeRenderer.getFormattedMetricLabel(value ? value : this.Options['value'], this);
      container.setAriaProperty('valuenow', value);
      container.setAriaProperty('valuetext', value);

      if (dvt.Agent.isTouchDevice()) container.setAriaProperty('label', value);
    }

    /**
     * Cleans up the old container used by black box updates.
     * @private
     */
    _onAnimEnd() {
      if (this._oldContainer) {
        this.removeChild(this._oldContainer);
        this._oldContainer.destroy();
        this._oldContainer = null;
      }

      // Fire ready event saying animation is finished.
      if (!this.AnimationStopped) this.RenderComplete();

      // Reset animation flags
      this.Animation = null;
      this.AnimationStopped = false;
    }

    /**
     * Handles the start of a value change update driven by a touch or mouse gesture at the specified coordinates.
     * @param {number} x The x coordinate of the value change.
     * @param {number} y The y coordinate of the value change.
     */
    __processValueChangeStart(x, y) {
      this._bEditing = true;
      this._oldValue = this.Options['value'];
      this.__processValueChangeMove(x, y);
    }

    /**
     * Handles the continuation of a value change update driven by a touch or mouse gesture at the specified coordinates.
     * @param {number} x The x coordinate of the value change.
     * @param {number} y The y coordinate of the value change.
     */
    __processValueChangeMove(x, y) {
      // Only process the update if there is data to update
      if (this._oldValue != null) {
        // Update the data value and re-render
        var newValue = DvtGaugeRenderer.adjustForStep(this.Options, this.GetValueAt(x, y));
        if (newValue !== this.Options['value']) {
          this.Options['value'] = newValue;
          this.renderUpdate();

          // Fire the value change input event
          this.dispatchEvent(
            dvt.EventFactory.newValueChangeEvent(this._oldValue, this.Options['value'], false)
          );
        }
      }
    }

    /**
     * Handles the end of a value change update driven by a touch or mouse gesture at the specified coordinates.
     * @param {number} x The x coordinate of the value change.
     * @param {number} y The y coordinate of the value change.
     */
    __processValueChangeEnd(x, y) {
      // Render again in case a move was skipped
      this.__processValueChangeMove(x, y);

      // Need to reset the tooltip value if overridden by UpdateAriaLiveValue
      if (dvt.Agent.isTouchDevice()) {
        var value = DvtGaugeRenderer.getFormattedMetricLabel(this.Options['value'], this);
        var tooltip = DvtGaugeRenderer.getTooltipString(this);
        if (value !== tooltip) {
          tooltip = value + dvt.AriaUtils.ARIA_LABEL_DESC_DELIMITER + tooltip;
          this._container.setAriaProperty('label', tooltip);
        }
      }

      // Fire the event and reset
      this.dispatchEvent(
        dvt.EventFactory.newValueChangeEvent(this._oldValue, this.Options['value'], true)
      );
      this._bEditing = false;
      this._oldValue = null;
    }

    /**
     * Increases the gauge value by one step.
     */
    __increaseValue() {
      if (this.Options['readOnly']) return;

      var oldValue = this.Options['value'];

      // Update the data value and re-render
      if (this.Options['step'] != null) {
        var newValue = this.Options['value'] + this.Options['step'];
        this.Options['value'] = DvtGaugeRenderer.adjustForStep(this.Options, newValue);
      } else {
        var step = (this.Options['max'] - this.Options['min']) / 100;
        this.Options['value'] = Math.min(
          Math.max(this.Options['value'] + step, this.Options['min']),
          this.Options['max']
        );
      }
      this.renderUpdate();

      // Fire the value change input event
      this.dispatchEvent(
        dvt.EventFactory.newValueChangeEvent(oldValue, this.Options['value'], false)
      );
    }

    /**
     * Decreases the gauge value by one step.
     */
    __decreaseValue() {
      if (this.Options['readOnly']) return;

      var oldValue = this.Options['value'];

      // Update the data value and re-render
      if (this.Options['step'] != null) {
        var newValue = this.Options['value'] - this.Options['step'];
        this.Options['value'] = DvtGaugeRenderer.adjustForStep(this.Options, newValue);
      } else {
        var step = (this.Options['max'] - this.Options['min']) / 100;
        this.Options['value'] = Math.min(
          Math.max(this.Options['value'] - step, this.Options['min']),
          this.Options['max']
        );
      }
      this.renderUpdate();

      // Fire the value change input event
      this.dispatchEvent(
        dvt.EventFactory.newValueChangeEvent(oldValue, this.Options['value'], false)
      );
    }

    /**
     * Creates the event manager for the gauge
     * @return {DvtGaugeEventManager} new event manager
     */
    CreateEventManager() {
      return new DvtGaugeEventManager(this);
    }

    /**
     * Comparison function
     * @param {object} a threshold object.
     * @param {object} b threshold object.
     * @return {number} Positive, negative, or 0 value indicating which threshold is larger.
     * @private
     */
    static _thresholdComparator(a, b) {
      if (a['max'] != null && b['max'] != null) {
        return a['max'] - b['max'];
      }

      return a['max'] ? -Infinity : Infinity;
    }

    /**
     * Returns the automation object for this gauge
     * @return {dvt.Automation} The automation object
     */
    getAutomation() {
      return new DvtGaugeAutomation(this);
    }

    /**
     * Creates the keyboard handler.
     * @param {DvtGaugeEventManager} manager Event manager.
     * @return {dvt.KeyboardHandler}
     * @protected
     */
    CreateKeyboardHandler(manager) {
      return new DvtGaugeKeyboardHandler(manager, this);
    }

    /**
     * @override
     */
    UpdateAriaAttributes() {
      if (!this._bStaticRendering) {
        var tooltip = DvtGaugeRenderer.getTooltipString(this);
        if (this.IsParentRoot()) {
          var translations = this.Options.translations;
          if (!this.IsInteractive()) {
            this.getCtx().setAriaRole('img');
            this.getCtx().setAriaLabel(
              dvt.ResourceUtils.format(translations.labelAndValue, [
                translations.labelDataVisualization,
                dvt.Displayable.generateAriaLabel(
                  dvt.AriaUtils.processAriaLabel(this.GetComponentDescription()),
                  tooltip ? [tooltip] : null
                )
              ])
            );
          } else {
            this.getCtx().setAriaRole('application');
            this.getCtx().setAriaLabel(
              dvt.ResourceUtils.format(translations.labelAndValue, [
                translations.labelDataVisualization,
                dvt.AriaUtils.processAriaLabel(this.GetComponentDescription())
              ])
            );
          }
        } else if (!this.IsInteractive()) {
          this.setAriaRole('img');
          this.setAriaProperty(
            'label',
            dvt.Displayable.generateAriaLabel(
              dvt.AriaUtils.processAriaLabel(this.GetComponentDescription()),
              tooltip ? [tooltip] : null
            )
          );
        }
      }
    }

    /**
     * Checks if the gauge is interactive.
     */
    IsInteractive() {
      return !this.Options.readOnly;
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @extends {dvt.BaseComponentDefaults}
   */
  class DvtGaugeDefaults extends dvt.BaseComponentDefaults {
    constructor(defaultsMap) {
      const SKIN_ALTA = {
        skin: dvt.CSSStyle.SKIN_ALTA,
        min: 0,
        max: 100,
        center: {},
        color: '#393737',
        borderColor: null,
        visualEffects: 'auto',
        emptyText: null,
        animationOnDataChange: 'none',
        animationOnDisplay: 'none',
        animationDuration: 500,
        readOnly: 'true',
        metricLabel: {
          rendered: 'auto',
          scaling: 'auto',
          style: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
          textType: 'number'
        },
        _statusMessageStyle: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
        label: {
          style: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
          position: 'auto'
        },

        _thresholdColors: ['#ed6647', '#fad55c', '#68c182'],
        // Internal layout constants
        __layout: { outerGap: 1, labelGap: 5 }
      };

      // This will only be called via subclasses.  Combine with defaults from this class before passing to super.
      super({
        alta: dvt.JsonUtils.merge(defaultsMap['alta'], SKIN_ALTA)
      });
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {DvtGaugeDefaults}
   */
  class DvtLedGaugeDefaults extends DvtGaugeDefaults {
    constructor(context) {
      const SKIN_ALTA = {
        type: 'circle'
      };

      super({ alta: SKIN_ALTA }, context);
    }
  }

  /**
   * Renderer for LedGauge.
   * @class
   */
  const DvtLedGaugeRenderer = {
    /** @private **/
    _SHAPE_TRIANGLE_CMDS: [-50, 36.6, 0, -50, 50, 36.6],

    /**
     * Polygon commands for star shape.  Centered at (0,0) with size of 100.
     * @private
     */
    _SHAPE_STAR_CMDS:
      'M 13.686617627555295 -14.844072859624454 L 0 -49.99999973529656 L -13.686617627555295 -14.844072859624454 L -49.21031057098533 -11.804119976838445 L -22.1446397569434 12.966333294730747 L -30.4142789122285 49.99999973529656 L 0 30.151376755728354 L 30.4142789122285 49.99999973529656 L 22.1446397569434 12.966333294730747 L 49.21031057098533 -11.804119976838445 Z ',
    /** @private **/
    _SHAPE_ARROW_CMDS: [25, 48, 25, 8, 47.5, 8, 0, -39, -47.5, 8, -25, 8, -25, 48],

    /** @private **/
    _SHAPE_HUMAN_CMDS:
      'M -0.06059525142297417 -50.86842065108466 C -11.4496388584463 -50.86842065108466 ' +
      '-20.708163169810554 -39.024253028220556 -20.708163169810554 -24.413724255650386 C -20.708163169810554 -9.803195483080515 ' +
      '-11.4496388584463 2.040972139783591 -0.06059525142297417 2.040972139783591 C 11.328499974520241 2.040972139783591 20.586972666964613 ' +
      '-9.803195483080515 20.586972666964613 -24.413724255650386 C 20.586972666964613 -39.024253028220556 11.328499974520241 -50.86842065108466 ' +
      '-0.06059525142297417 -50.86842065108466 z M -23.93434565705865 -2.959610715450779 C -30.908061721494278 3.3998402034127153 -42.00096758564793 ' +
      '18.817121073473572 -38.77478509839983 33.65756051481475 C -20.651382358034887 47.30044101688934 14.372054723529814 49.13162219665128 ' +
      '39.298831093003386 32.85101489300273 C 40.26410489318826 16.477493533721187 32.34060070450674 4.7883891459240715 23.167918656763206 ' +
      '-2.959610715450779 C 11.553661702670112 21.074158341552575 -11.029615708066558 16.237465556670102 -23.93434565705865 -2.959610715450779 z ',

    /**
     * Renders the gauge in the specified area.
     * @param {LedGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     */
    render: (gauge, container, width, height) => {
      if (DvtGaugeDataUtils.hasData(gauge)) {
        // Allocate the outer gap for the component
        var options = gauge.getOptions();
        var outerGap = options['__layout']['outerGap'];
        var size =
          options && (options['size'] >= 0 || options['size'] < 1) ? Math.sqrt(options['size']) : 1;
        var bounds = new dvt.Rectangle(
          outerGap + ((width - 2 * outerGap) * (1 - size)) / 2,
          outerGap + ((height - 2 * outerGap) * (1 - size)) / 2,
          (width - 2 * outerGap) * size,
          (height - 2 * outerGap) * size
        );

        // Render the LED shape first
        DvtLedGaugeRenderer._renderShape(gauge, container, bounds);

        // Render the label on top of the LED
        var bLabelRendered = false;
        var metricLabelColor = dvt.ColorUtils.getContrastingTextColor(
          DvtGaugeStyleUtils.getColor(gauge)
        );
        if (options['label']['text']) {
          var labelValign = 'middle';
          var labelBounds = DvtLedGaugeRenderer._getMetricLabelBounds(gauge, container, bounds);
          if (options['metricLabel']['rendered'] === 'on') {
            labelBounds.y = labelBounds.y + labelBounds.h * 0.6;
            labelBounds.h = labelBounds.h * 0.4;
            labelValign = 'top';
          }
          // Use the specified metricLabel color unless in high contrast mode
          if (!dvt.Agent.isHighContrast() && options['label']['style'].getStyle('color') != null) {
            bLabelRendered = DvtGaugeRenderer.renderLabel(
              gauge,
              container,
              labelBounds,
              null,
              labelValign
            );
          } else {
            bLabelRendered = DvtGaugeRenderer.renderLabel(
              gauge,
              container,
              labelBounds,
              metricLabelColor,
              labelValign
            );
          }
        }

        // Render the metricLabel on top of the LED
        if (options['metricLabel']['rendered'] === 'on') {
          var metricLabelBounds = DvtLedGaugeRenderer._getMetricLabelBounds(gauge, container, bounds);
          var valign = 'middle';
          if (bLabelRendered) {
            metricLabelBounds.h = metricLabelBounds.h * 0.55;
            valign = 'bottom';
          }

          // Use the specified metricLabel color unless in high contrast mode
          if (
            !dvt.Agent.isHighContrast() &&
            options['metricLabel']['style'].getStyle('color') != null
          ) {
            DvtGaugeRenderer.renderMetricLabel(
              gauge,
              container,
              metricLabelBounds,
              null,
              'center',
              valign
            );
          } else {
            DvtGaugeRenderer.renderMetricLabel(
              gauge,
              container,
              metricLabelBounds,
              metricLabelColor,
              'center',
              valign
            );
          }
        }
      } // Render the empty text
      else DvtGaugeRenderer.renderEmptyText(gauge, container, new dvt.Rectangle(0, 0, width, height));
    },

    /**
     * Renders the led shape into the specified area.
     * @param {LedGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @private
     */
    _renderShape: (gauge, container, bounds) => {
      var context = gauge.getCtx();
      var options = gauge.getOptions();

      // Find the styles
      var type = options['type'];
      var color = DvtGaugeStyleUtils.getColor(gauge);
      var borderColor = DvtGaugeStyleUtils.getBorderColor(gauge);

      // Calculate the center and radius for convenience
      var cx = bounds.x + bounds.w / 2;
      var cy = bounds.y + bounds.h / 2;
      var r = Math.min(bounds.w, bounds.h) / 2;

      // Initialize the cache if not done already.  The cache stores the paths centered at 0,0 and at scale 100.
      if (!DvtLedGaugeRenderer._cache) DvtLedGaugeRenderer._cache = new dvt.Cache(50);

      // Render the LED shape
      var shape;
      var cmds;

      // Scale is relative to reference size of 100
      var scale = Math.min(bounds.w / 100, bounds.h / 100);
      if (type === 'square') {
        shape = new dvt.Rect(context, cx - r, cy - r, 2 * r, 2 * r);
      } else if (type == 'rectangle') {
        shape = new dvt.Rect(context, bounds.x, bounds.y, bounds.w, bounds.h);
      } else if (type === 'diamond') {
        shape = new dvt.Polygon(context, [cx - r, cy, cx, cy - r, cx + r, cy, cx, cy + r]);
      } else if (type === 'circle') {
        shape = new dvt.Circle(context, cx, cy, r);
      } else {
        if (type === 'star') cmds = DvtLedGaugeRenderer._SHAPE_STAR_CMDS;
        else if (type === 'triangle') cmds = DvtLedGaugeRenderer._SHAPE_TRIANGLE_CMDS;
        else if (type === 'arrow') cmds = DvtLedGaugeRenderer._SHAPE_ARROW_CMDS;
        else if (type === 'human') cmds = DvtLedGaugeRenderer._SHAPE_HUMAN_CMDS;
        else {
          // Assume we're using a custom path
          cmds = DvtLedGaugeRenderer._cache.get(type);
          if (!cmds) {
            shape = new dvt.Path(context, type);
            // Calculate the dimensions and shift the shape to be centered at 0,0 within its containing rectangle
            var dim = dvt.DisplayableUtils.getDimForced(context, shape);
            var scaleTo100 = 100 / Math.max(dim.w, dim.h);
            cmds = dvt.PathUtils.transformPath(
              shape.getCommandsArray(),
              -scaleTo100 * (dim.x + dim.w / 2),
              -scaleTo100 * (dim.y + dim.h / 2),
              scaleTo100,
              scaleTo100
            );
            DvtLedGaugeRenderer._cache.put(type, cmds);
          }
        }

        // These shapes are defined as polygons
        if (type === 'triangle' || type === 'arrow') {
          cmds = dvt.PolygonUtils.scale(cmds, scale, scale);

          // Translate from center of (0,0)
          cmds = dvt.PolygonUtils.translate(cmds, bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
          shape = new dvt.Polygon(context, cmds);
        }
        // All others use paths
        else {
          // Translate from center of (0,0)
          cmds = dvt.PathUtils.transformPath(
            dvt.PathUtils.createPathArray(cmds),
            bounds.x + bounds.w / 2,
            bounds.y + bounds.h / 2,
            scale,
            scale
          );
          shape = new dvt.Path(context, cmds);
        }
      }

      var theme = gauge.getCtx().getThemeBehavior();
      // Apply the style properties
      if (options['visualEffects'] === 'none' || theme === 'redwood') shape.setSolidFill(color);
      else {
        var arColors = [
          dvt.ColorUtils.adjustHSL(color, 0, -0.09, 0.04),
          dvt.ColorUtils.adjustHSL(color, 0, -0.04, -0.05)
        ];
        var rotation = options && options['rotation'] % 90 == 0 ? options['rotation'] : 0;
        var gradientRotation =
          type === 'arrow' || type === 'star' || type === 'triangle' ? rotation - 90 : 270;
        shape.setFill(new dvt.LinearGradientFill(gradientRotation, arColors, [1, 1], [0, 1]));
      }
      if (borderColor) shape.setSolidStroke(borderColor);

      // Custom style and class
      shape.setClassName(options['svgClassName']);
      shape.setStyle(options['svgStyle']);

      // rotate the shape if needed
      rotation = options['rotation'];
      if (
        rotation &&
        (type === 'arrow' ||
          type === 'triangle' ||
          (shape instanceof dvt.Path && type !== 'human' && type !== 'star'))
      )
        shape = DvtLedGaugeRenderer._rotate(gauge, container, shape, bounds);

      // Add the shape to the container
      container.addChild(shape);
    },

    /**
     * Scales and rotates the shape into the specified bounds.
     * @param {LedGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Displayable} shape The shape for the gauge.
     * @param {dvt.Rectangle} bounds The bounds of the shape.
     * @return {dvt.Displayable} The scaled shape
     * @private
     */
    _rotate: (gauge, container, shape, bounds) => {
      var options = gauge.getOptions();

      // Add containers for the tranforms, add to display list to calc dimensions
      var translateGroup = new dvt.Container(gauge.getCtx());
      container.addChild(translateGroup);
      translateGroup.addChild(shape);

      // Rotate the shape, non-90 degree rotation values are ignored
      var rotation = options && options['rotation'] % 90 == 0 ? options['rotation'] : 0;
      var rotationMatrix = new dvt.Matrix();
      shape.setMatrix(rotationMatrix.rotate((Math.PI * rotation) / 180));

      // Translate the shape so that it's centered within the bounds
      var groupDims = translateGroup.getDimensions();
      var tx = bounds.x + bounds.w / 2 - (groupDims.x + groupDims.w / 2);
      var ty = bounds.y + bounds.h / 2 - (groupDims.y + groupDims.h / 2);

      var matrix = new dvt.Matrix();
      translateGroup.setMatrix(matrix.translate(tx, ty));

      // Return the group with its transform
      return translateGroup;
    },

    /**
     * Find correct metricLabel bounds
     * @param {LedGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The bounds of the shape.
     * @return {dvt.Rectangle} Bounds for the metricLabel
     * @private
     */
    _getMetricLabelBounds: (gauge, container, bounds) => {
      var options = gauge.getOptions();
      var type = options['type'];
      var rotation = options['rotation'] % 90 == 0 ? options['rotation'] : 0;
      var minDim = Math.min(bounds.w, bounds.h);
      var newX = bounds.x + bounds.w / 2 - minDim / 2;
      var newY = bounds.y + bounds.h / 2 - minDim / 2;
      var newWidth = minDim;
      var newHeight = minDim;
      if (type === 'triangle') {
        if (rotation === 0) {
          newX += minDim * 0.2;
          newY += minDim * 0.25;
          newWidth -= minDim * 0.4;
          newHeight -= minDim * 0.3;
        } else if (rotation === 90) {
          newX += minDim * 0.05;
          newY += minDim * 0.2;
          newWidth -= minDim * 0.3;
          newHeight -= minDim * 0.4;
        } else if (rotation === 180) {
          newX += minDim * 0.2;
          newY += minDim * 0.05;
          newWidth -= minDim * 0.4;
          newHeight -= minDim * 0.3;
        } else if (rotation === 270) {
          newX += minDim * 0.25;
          newY += minDim * 0.2;
          newWidth -= minDim * 0.3;
          newHeight -= minDim * 0.4;
        }
      } else if (type === 'arrow') {
        if (rotation === 0) {
          newX += minDim * 0.2;
          newY += minDim * 0.2;
          newWidth -= minDim * 0.4;
          newHeight -= minDim * 0.4;
        } else if (rotation === 90) {
          newX += minDim * 0.05;
          newY += minDim * 0.2;
          newWidth -= minDim * 0.28;
          newHeight -= minDim * 0.4;
        } else if (rotation === 180) {
          newX += minDim * 0.2;
          newY += minDim * 0.2;
          newWidth -= minDim * 0.4;
          newHeight -= minDim * 0.4;
        } else if (rotation === 270) {
          newX += minDim * 0.23;
          newY += minDim * 0.2;
          newWidth -= minDim * 0.28;
          newHeight -= minDim * 0.4;
        }
      } else if (type === 'star') {
        newX += minDim * 0.25;
        newY += minDim * 0.25;
        newWidth -= minDim * 0.5;
        newHeight -= minDim * 0.4;
      } else if (type === 'diamond') {
        newX += minDim * 0.15;
        newY += minDim * 0.15;
        newWidth -= minDim * 0.3;
        newHeight -= minDim * 0.3;
      } else if (type === 'rectangle') {
        newX += minDim * 0.1;
        newY += minDim * 0.1;
        newWidth -= minDim * 0.2;
        newHeight -= minDim * 0.2;
      } else {
        newX += minDim * 0.15;
        newY += minDim * 0.15;
        newWidth -= minDim * 0.3;
        newHeight -= minDim * 0.3;
      }
      return new dvt.Rectangle(newX, newY, newWidth, newHeight);
    }
  };

  /**
   * LED Gauge component.
   * @class
   * @constructor
   * @extends {DvtGauge}
   */
  class LedGauge extends DvtGauge {
    constructor(context, callback, callbackObj, bStaticRendering) {
      super(context, callback, callbackObj, bStaticRendering);

      this.type = 'led';
      // Create the defaults object
      this.Defaults = new DvtLedGaugeDefaults(context);
    }

    /**
     * @override
     */
    SetOptions(options) {
      // NOTE: This extra clone should be removed once we stop supporting the deprecated attrs
      options = dvt.JsonUtils.clone(options);

      if (options['title']) {
        options['label'] = options['title'];
      }

      // Combine the user options with the defaults and store
      super.SetOptions(this.Defaults.calcOptions(options));

      // animationOnDisplay="auto" will do "zoom"
      if (this.Options['animationOnDisplay'] === 'auto') {
        this.Options['animationOnDisplay'] = 'zoom';
      }

      // animationOnDataChange="auto" will do "alphaFade"
      if (this.Options['animationOnDataChange'] === 'auto') {
        this.Options['animationOnDataChange'] = 'alphaFade';
      }

      // readOnly="false" is not supported
      this.Options['readOnly'] = true;
    }

    /**
     * @override
     */
    Render(container, width, height) {
      DvtLedGaugeRenderer.render(this, container, width, height);
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {DvtGaugeDefaults}
   */
  class DvtRatingGaugeDefaults extends DvtGaugeDefaults {
    constructor(context) {
      /**
       * Defaults for version 1.
       */
      const SKIN_ALTA = {
        min: 0,
        max: 5,
        orientation: 'horizontal',
        unselectedState: { shape: 'star', color: '#C4CED7' },
        selectedState: { shape: 'star', color: '#F8C15A' },
        hoverState: { shape: 'star', color: '#007CC8' },
        changedState: { shape: 'star', color: '#ED2C02' },
        preserveAspectRatio: 'meet',
        step: 1
      };

      super({ alta: SKIN_ALTA }, context);
    }
  }

  /**
   * Event Manager for RatingGauge.
   * @param {DvtGauge} gauge
   * @class
   * @extends {dvt.EventManager}
   * @constructor
   */
  class DvtRatingGaugeEventManager extends DvtGaugeEventManager {
    constructor(gauge) {
      super(gauge);
      this._gauge = gauge;
    }

    /**
     * @override
     */
    OnMouseOver(event) {
      // Only editable gauges
      if (this._gauge.IsInteractive()) {
        var coords = this.GetRelativePosition(event.pageX, event.pageY);
        this._gauge.__processValueChangeStart(coords.x, coords.y);
        this.IsMouseEditing = true;
      }

      // Need to call the superclass here to support tooltips during hover.
      super.OnMouseOver(event);
    }

    /**
     * @override
     */
    OnMouseOut(event) {
      // Only editable gauges
      if (this._gauge.IsInteractive()) {
        var coords = this.GetRelativePosition(event.pageX, event.pageY);
        this._gauge.__processHoverEnd(coords.x, coords.y);
        this.IsMouseEditing = false;
      }
      // To dismiss the tooltip if it's showing.
      super.OnMouseOut(event);
    }

    /**
     * @override
     */
    OnMouseMove(event) {
      var coords = this.GetRelativePosition(event.pageX, event.pageY);
      var isDisabled = this._gauge.getOptions()['disabled'] === true;
      if (
        this._gauge.IsInteractive() &&
        !this.IsMouseEditing &&
        this._gauge.getOptions()['value'] !== this._gauge.GetValueAt(coords.x, coords.y)
      ) {
        this.IsMouseEditing = true;
      }

      if (!isDisabled) super.OnMouseMove(event);
    }

    /**
     * @override
     */
    OnMouseDown(event) {
      // Want to directly call the OnMouseDown from dvt.EventManager, so we don't go through the
      // default gauge behavior since it's already covered in OnMouseOver
      dvt.EventManager.prototype.OnMouseDown.call(this, event);
    }

    /**
     * @override
     */
    OnContextMenu(event) {
      // jet-32846; value change happens in mouseup event but chrome and
      // safari in mac do not fire mouseup on right click
      // change value after context menu in such case
      var engine = dvt.Agent.engine;
      if ((engine === 'webkit' || engine === 'blink') && dvt.Agent.os === 'mac') {
        // Reset the editing flag
        if (this.IsMouseEditing) {
          this.StopMouseEditing(event);
        }
      }
      super.OnContextMenu(event);
    }

    /**
     * @override
     */
    ProcessKeyboardEvent(event) {
      // Need to clear out the flag to make rating gauge tooltips work with keyboarding
      this.IsMouseEditing = false;
      return super.ProcessKeyboardEvent(event);
    }

    /**
     * @override
     */
    IsShowingTooltipWhileEditing() {
      return true;
    }
  }

  /**
   * Rating gauge tooltip support
   * @param {RatingGauge} gauge The rating gauge.
   * @class
   * @constructor
   * @implements {DvtTooltipSource}
   */
  class DvtRatingGaugePeer extends dvt.SimpleObjPeer {
    constructor(gauge) {
      super();
      this._gauge = gauge;
    }

    /**
     * @override
     */
    getDatatip(target, x, y) {
      var options = this._gauge.getOptions();
      var thresholdIndex;
      if (this._gauge.getEventManager().__isMouseEditing())
        thresholdIndex = DvtGaugeDataUtils.getValThresholdIdx(
          this._gauge,
          this._gauge.GetValueAt(x, y)
        );
      else thresholdIndex = DvtGaugeDataUtils.getValThresholdIdx(this._gauge);
      var threshold = DvtGaugeDataUtils.getThreshold(this._gauge, thresholdIndex);
      return threshold && threshold['shortDesc'] ? threshold['shortDesc'] : options['shortDesc'];
    }
  }

  /**
   * Renderer for RatingGauge.
   * @class
   */
  const DvtRatingGaugeRenderer = {
    /**
     * Renders the gauge in the specified area.
     * @param {RatingGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     */
    render: (gauge, container, width, height) => {
      if (DvtGaugeDataUtils.hasData(gauge)) {
        var options = gauge.getOptions();
        var thresholdIndex = DvtGaugeDataUtils.getValThresholdIdx(gauge);
        var threshold = DvtGaugeDataUtils.getThreshold(gauge, thresholdIndex);
        var selectedColor = options['selectedState']['color'];
        var changedColor = options['changedState']['color'];
        var selectedBorderColor = options['selectedState']['borderColor'];
        var changedBorderColor = options['changedState']['borderColor'];
        if (threshold && threshold['color']) {
          selectedColor = threshold['color'];
          changedColor = threshold['color'];
        }

        if (threshold && threshold['borderColor']) {
          selectedBorderColor = threshold['borderColor'];
          changedBorderColor = threshold['borderColor'];
        }

        // Create the options objects for the shapes
        var unselectedOptions = {
          value: 0,
          state: 'unselected',
          type: options['unselectedState']['shape'],
          color: options['unselectedState']['color'],
          borderColor: options['unselectedState']['borderColor'],
          visualEffects: options['visualEffects'],
          source: options['unselectedState']['source'],
          svgClassName: options['unselectedState']['svgClassName'],
          svgStyle: options['unselectedState']['svgStyle']
        };
        var selectedOptions = {
          value: 0,
          state: 'selected',
          type: options['selectedState']['shape'],
          color: selectedColor,
          borderColor: selectedBorderColor,
          visualEffects: options['visualEffects'],
          source: options['selectedState']['source'],
          svgClassName: options['selectedState']['svgClassName'],
          svgStyle: options['selectedState']['svgStyle']
        };
        var changedOptions = {
          value: 0,
          state: 'changed',
          type: options['changedState']['shape'],
          color: changedColor,
          borderColor: changedBorderColor,
          visualEffects: options['visualEffects'],
          source: options['changedState']['source'],
          svgClassName: options['changedState']['svgClassName'],
          svgStyle: options['changedState']['svgStyle']
        };
        var hoverOptions = {
          value: 0,
          state: 'hover',
          type: options['hoverState']['shape'],
          color: options['hoverState']['color'],
          borderColor: options['hoverState']['borderColor'],
          visualEffects: options['visualEffects'],
          source: options['hoverState']['source'],
          svgClassName: options['hoverState']['svgClassName'],
          svgStyle: options['hoverState']['svgStyle']
        };

        if (options['unselectedState']['shape'] == 'dot') {
          unselectedOptions['type'] = 'circle';
          unselectedOptions['visualEffects'] = 'none';
          unselectedOptions['size'] = 0.05;
        }

        DvtRatingGaugeRenderer._createShapes(gauge, container, unselectedOptions);
        DvtRatingGaugeRenderer._createShapes(
          gauge,
          container,
          options['changed'] ? changedOptions : selectedOptions
        );
        if (!(options.readOnly || options.disabled)) {
          DvtRatingGaugeRenderer._createShapes(gauge, container, hoverOptions);
        }

        gauge.__updateClipRects(options['value'], 'render', container);
      } // Render the empty text
      else DvtGaugeRenderer.renderEmptyText(gauge, container, new dvt.Rectangle(0, 0, width, height));
    },

    /**
     * Creates the shapes for the rating gauge at the given position
     * @param {RatingGauge} gauge
     * @param {dvt.Container} container The container to render into.
     * @param {object} stateOptions The options object for this state.
     * @private
     */
    _createShapes: (gauge, container, stateOptions) => {
      var context = gauge.getCtx();
      var shapesContainer = new dvt.Container(context);
      container.addChild(shapesContainer);
      var options = gauge.getOptions();
      var bounds = gauge.__bounds;
      var shapeWidth = gauge.__shapeWidth;
      var shapeHeight = gauge.__shapeHeight;

      var useShape =
        dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge'
          ? null
          : DvtRatingGaugeRenderer._createShape(
              context,
              0,
              0,
              shapeWidth,
              shapeHeight,
              stateOptions,
              options
            );

      for (var i = 0; i < options['max']; i++) {
        var x, y;
        if (options['orientation'] == 'vertical') {
          x = bounds.x + bounds.w / 2 - shapeWidth / 2;
          y = bounds.y + bounds.h - (i + 1) * shapeHeight;
        } else if (dvt.Agent.isRightToLeft(context)) {
          x = bounds.x + bounds.w - (i + 1) * shapeWidth;
          y = bounds.y + bounds.h / 2 - shapeHeight / 2;
        } else {
          x = bounds.x + i * shapeWidth;
          y = bounds.y + bounds.h / 2 - shapeHeight / 2;
        }

        if (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') {
          var shape = DvtRatingGaugeRenderer._createShape(
            context,
            x,
            y,
            shapeWidth,
            shapeHeight,
            stateOptions,
            options
          );

          if (shape) {
            shapesContainer.addChild(shape);
          }
        } else if (useShape) {
          var use = new dvt.Use(context, x, y, useShape);
          shapesContainer.addChild(use);
        }
      }
    },

    /**
     * Creates a shape used to create the rating gauge
     * @param {dvt.Context} context
     * @param {number} x  The x position of the marker.
     * @param {number} y  The y position of the marker.
     * @param {number} width  The width of the marker.
     * @param {number} height  The height of the marker.
     * @param {object} stateOptions The options object for this state.
     * @param {object} gaugeOptions The options object for the gauge.
     * @return {dvt.Obj} shape The led gauge or image marker shape
     * @private
     */
    _createShape: (context, x, y, width, height, stateOptions, gaugeOptions) => {
      var shape;
      if (stateOptions['source']) {
        shape = new dvt.ImageMarker(
          context,
          x + width / 2,
          y + height / 2,
          width,
          height,
          null,
          stateOptions['source']
        );
        if (gaugeOptions['preserveAspectRatio'] === 'none') shape.setPreserveAspectRatio('none');
      } else if (stateOptions['type'] != 'none') {
        shape = new LedGauge(context, null, null, true);
        if (x != 0 && y != 0) shape.setTranslate(x, y);

        if (gaugeOptions['disabled'] || dvt.Agent.isHighContrast()) {
          var className = `oj-rating-gauge-${
          stateOptions.state === 'unselected' ? 'unselected' : 'selected'
        }${gaugeOptions['disabled'] ? '-disabled' : ''}`;
          if (gaugeOptions['disabled']) {
            stateOptions.svgClassName = className;
            stateOptions.svgStyle = null;
          } else {
            stateOptions.svgClassName = `${stateOptions.svgClassName || ''} ${className}`.trim();
          }
          if (dvt.Agent.isHighContrast()) {
            shape.addClassName('oj-hicontrast');
          }
        }
        shape.render(stateOptions, width, height);
      }

      return shape;
    }
  };

  /**
   * Rating Gauge component.
   * @class
   * @constructor
   * @extends {DvtGauge}
   */
  class RatingGauge extends DvtGauge {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      this.type = 'rating';
      // Create the defaults object
      this.Defaults = new DvtRatingGaugeDefaults(context);
    }

    /**
     * @override
     */
    SetOptions(options) {
      // NOTE: This extra clone should be removed once we stop supporting the deprecated attrs
      options = dvt.JsonUtils.clone(options);

      if (options['changedState']) {
        if (options['changedState']['className'])
          options['changedState']['svgClassName'] = options['changedState']['className'];

        if (options['changedState']['style'])
          options['changedState']['svgStyle'] = options['changedState']['style'];
      }

      if (options['hoverState']) {
        if (options['hoverState']['className'])
          options['hoverState']['svgClassName'] = options['hoverState']['className'];

        if (options['hoverState']['style'])
          options['hoverState']['svgStyle'] = options['hoverState']['style'];
      }

      if (options['selectedState']) {
        if (options['selectedState']['className'])
          options['selectedState']['svgClassName'] = options['selectedState']['className'];

        if (options['selectedState']['style'])
          options['selectedState']['svgStyle'] = options['selectedState']['style'];
      }

      if (options['unselectedState']) {
        if (options['unselectedState']['className'])
          options['unselectedState']['svgClassName'] = options['unselectedState']['className'];

        if (options['unselectedState']['style'])
          options['unselectedState']['svgStyle'] = options['unselectedState']['style'];
      }

      // Map the custom element readonly attr to the widget readOnly option
      if (this.getCtx().isCustomElement()) {
        options['readOnly'] = options['readonly'];
      }

      var svg = this.getCtx().getSvgDocument();
      if (options['size'] !== 'fit') {
        this.getCtx().removeSizingSvg();
        svg.style.height = options._height + 'px';
        svg.style.width = options._width + 'px';
      } else {
        this.getCtx().addSizingSvg();
        svg.style.height = '';
        svg.style.width = '';
      }

      // Combine the user options with the defaults and store
      super.SetOptions(this.Defaults.calcOptions(options));
    }

    /**
     * @override
     */
    Render(container, width, height) {
      var outerGap = this.Options['__layout']['outerGap'];
      var maxValue = this.Options['max'];
      var size = this.Options['size'];
      var isVert = this.Options['orientation'] == 'vertical';
      var selectedSource = this.Options['selectedState']['source'];
      var preserveAspectRatio = this.Options['preserveAspectRatio'] != 'none';

      if (selectedSource && preserveAspectRatio && size === 'fit') {
        // Show images at the size of the selected shape if defined
        var onLoad = (imageInfo) => {
          // IE11 gives a size of 0x0 for loaded images: https://connect.microsoft.com/IE/feedbackdetail/view/925655/svg-image-has-0x0-size-in-ie11
          if (
            (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') &&
            dvt.Agent.version == 11 &&
            imageInfo &&
            imageInfo.width == 0 &&
            imageInfo.height == 0
          ) {
            imageInfo.width = 1;
            imageInfo.height = 1;
          }
          if (imageInfo && imageInfo.width && imageInfo.height) {
            var ratio = imageInfo.width / imageInfo.height;
            this.__shapeWidth = isVert
              ? Math.min(width - 2 * outerGap, ((height - 2 * outerGap) * ratio) / maxValue)
              : Math.min((height - 2 * outerGap) * ratio, (width - 2 * outerGap) / maxValue);
            this.__shapeHeight = this.__shapeWidth / ratio;
            this.__bounds = isVert
              ? new dvt.Rectangle(
                  outerGap,
                  (height - this.__shapeHeight * maxValue) / 2.0,
                  width - 2 * outerGap,
                  this.__shapeHeight * maxValue
                )
              : new dvt.Rectangle(
                  (width - this.__shapeWidth * maxValue) / 2.0,
                  outerGap,
                  this.__shapeWidth * maxValue,
                  height - 2 * outerGap
                );
            DvtRatingGaugeRenderer.render(this, container, width, height);
          }
          this.PostRender(this.Options, container);
        };
        dvt.ImageLoader.loadImage(this.Options['selectedState']['source'], onLoad);
        return false;
      }

      outerGap = size === 'fit' ? outerGap : 0;
      if (!preserveAspectRatio) {
        // Divide space evenly
        this.__shapeWidth = isVert ? width - 2 * outerGap : (width - 2 * outerGap) / maxValue;
        this.__shapeHeight = isVert ? (height - 2 * outerGap) / maxValue : height - 2 * outerGap;
      } else {
        // Show square shapes
        this.__shapeWidth = isVert
          ? Math.min(width - 2 * outerGap, (height - 2 * outerGap) / maxValue)
          : Math.min(height - 2 * outerGap, (width - 2 * outerGap) / maxValue);
        this.__shapeHeight = this.__shapeWidth;
      }
      this.__bounds = isVert
        ? new dvt.Rectangle(
            outerGap,
            (height - this.__shapeHeight * maxValue) / 2.0,
            width - 2 * outerGap,
            this.__shapeHeight * maxValue
          )
        : new dvt.Rectangle(
            (width - this.__shapeWidth * maxValue) / 2.0,
            outerGap,
            this.__shapeWidth * maxValue,
            height - 2 * outerGap
          );
      DvtRatingGaugeRenderer.render(this, container, width, height);
      return true;
    }

    /**
     * @override
     */
    __getLogicalObject() {
      var customTooltip = this.Options['tooltip'];
      var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
      var color = DvtGaugeStyleUtils.getColor(this);
      if (tooltipFunc) {
        var dataContext = {
          component: this.Options['_widgetConstructor'],
          label: DvtGaugeRenderer.getFormattedMetricLabel(this.Options['value'], this),
          color: color
        };
        return new dvt.CustomDatatipPeer(
          this.getCtx().getTooltipManager(),
          tooltipFunc,
          color,
          dataContext
        );
      }
      return new DvtRatingGaugePeer(this);
    }

    /**
     * @override
     */
    GetValueAt(x, y) {
      var size = this.Options['orientation'] == 'vertical' ? this.__shapeHeight : this.__shapeWidth;
      if (DvtGaugeDataUtils.hasData(this)) {
        var val;
        if (this.Options['orientation'] == 'vertical') {
          y = Math.max(Math.min(y, this.__bounds.y + this.__bounds.h), this.__bounds.y);

          val = Math.max((this.__bounds.y + this.__bounds.h - y) / size, this.Options['min']);
        } else {
          x = Math.max(Math.min(x, this.__bounds.x + this.__bounds.w), this.__bounds.x);

          // calculating the val depends on locale, but the rounding doesn't
          val = 0;
          if (!dvt.Agent.isRightToLeft(this.getCtx())) {
            val = Math.max((x - this.__bounds.x) / size, this.Options['min']);
          } else {
            val = Math.max((this.__bounds.x + this.__bounds.w - x) / size, this.Options['min']);
          }
        }

        return DvtGaugeRenderer.adjustForStep(this.Options, val);
      }
      return null;
    }

    /**
     * Handles the end of a hover event due to mouse out at the specified coordinates.
     * @param {number} x The x coordinate of the value change.
     * @param {number} y The y coordinate of the value change.
     */
    __processHoverEnd(x, y) {
      this.__updateClipRects(this.Options['value'], 'render');

      // Fire the value change event to reset to the real value
      this.dispatchEvent(
        dvt.EventFactory.newValueChangeEvent(this.Options['value'], this.Options['value'], false)
      );
    }

    /**
     * @override
     */
    __processValueChangeStart(x, y) {
      this.__processValueChangeMove(x, y);
    }

    /**
     * @override
     */
    __processValueChangeMove(x, y) {
      var value = this.GetValueAt(x, y);
      this.__updateClipRects(value, 'hover');

      // Fire the value change event
      this.dispatchEvent(dvt.EventFactory.newValueChangeEvent(this.Options['value'], value, false));
    }

    /**
     * @override
     */
    __processValueChangeEnd(x, y) {
      // Render again because a click was registerd
      var oldValue = this.Options['value'];
      this.Options['value'] = this.GetValueAt(x, y);
      this.Options['changed'] = true;
      this.render();

      // Fire the both the change and input events on complete
      this.dispatchEvent(
        dvt.EventFactory.newValueChangeEvent(oldValue, this.Options['value'], false)
      );
      this.dispatchEvent(dvt.EventFactory.newValueChangeEvent(oldValue, this.Options['value'], true));
    }

    /**
     * Updates the cliprects used in the rating gauge for hover and the different states.
     * @param {number} value The point at which the clips rects are drawn.
     * @param {string} proc The process being done- "hover" or "render"
     * @param {dvt.Container} container The container that holds this gauge- allowing us to access the three subcontainers with selected/changed, unselected, and hover shapes.
     */
    __updateClipRects(value, proc, container) {
      if (!DvtGaugeDataUtils.hasData(this)) {
        return;
      }

      if (!container) {
        container = this._container;
      }

      var isRTL = dvt.Agent.isRightToLeft(this.getCtx());
      var isVert = this.Options['orientation'] == 'vertical';
      var size = isVert ? this.__shapeHeight : this.__shapeWidth;

      // which  to show and which to hide based on whether we're hovering or not
      value = Math.max(Math.min(value, this.Options['max']), 0); //clipping the data value
      var a = 0;
      var b = value * size;
      var c = value * size;
      if (proc === 'render') {
        a = value * size;
        b = 0;
      }

      var unselContainer;
      var unselClip;
      var selContainer;
      var selClip;
      var hoverContainer;
      var hoverClip;
      if (isVert) {
        // Set the clip rect size.
        unselContainer = container.getChildAt(0);
        unselClip = new dvt.ClipPath();
        unselClip.addRect(this.__bounds.x, this.__bounds.y, this.__bounds.w, this.__bounds.h - c);
        unselContainer.setClipPath(unselClip);

        selContainer = container.getChildAt(1);
        selClip = new dvt.ClipPath();
        selClip.addRect(this.__bounds.x, this.__bounds.y + this.__bounds.h - a, this.__bounds.w, a);
        selContainer.setClipPath(selClip);

        hoverContainer = container.getChildAt(2);
        if (hoverContainer) {
          hoverClip = new dvt.ClipPath();
          hoverClip.addRect(
            this.__bounds.x,
            this.__bounds.y + this.__bounds.h - b,
            this.__bounds.w,
            b
          );
          hoverContainer.setClipPath(hoverClip);
        }
      } else if (!isRTL) {
        // Set the clip rect size.
        unselContainer = container.getChildAt(0);
        unselClip = new dvt.ClipPath();
        unselClip.addRect(this.__bounds.x + c, this.__bounds.y, this.__bounds.w - c, this.__bounds.h);
        unselContainer.setClipPath(unselClip);

        selContainer = container.getChildAt(1);
        selClip = new dvt.ClipPath();
        selClip.addRect(this.__bounds.x, this.__bounds.y, a, this.__bounds.h);
        selContainer.setClipPath(selClip);

        hoverContainer = container.getChildAt(2);
        if (hoverContainer) {
          hoverClip = new dvt.ClipPath();
          hoverClip.addRect(this.__bounds.x, this.__bounds.y, b, this.__bounds.h);
          hoverContainer.setClipPath(hoverClip);
        }
      } else {
        // Set the clip rect size.
        unselContainer = container.getChildAt(0);
        unselClip = new dvt.ClipPath();
        unselClip.addRect(this.__bounds.x, this.__bounds.y, this.__bounds.w - c, this.__bounds.h);
        unselContainer.setClipPath(unselClip);

        selContainer = container.getChildAt(1);
        selClip = new dvt.ClipPath();
        selClip.addRect(this.__bounds.x + this.__bounds.w - c, this.__bounds.y, a, this.__bounds.h);
        selContainer.setClipPath(selClip);

        hoverContainer = container.getChildAt(2);
        if (hoverContainer) {
          hoverClip = new dvt.ClipPath();
          hoverClip.addRect(
            this.__bounds.x + this.__bounds.w - c,
            this.__bounds.y,
            b,
            this.__bounds.h
          );
          hoverContainer.setClipPath(hoverClip);
        }
      }
      this.UpdateAriaLiveValue(container, value);
    }

    /**
     * Return the led gauge drawn at the given index.
     * Internal API used for Automation purposes.
     * @param {Number} index
     * @return {dvt.Displayable}
     */
    __getRatingGaugeItem(index) {
      // Returning the unselected shape at the given index.
      return this._container.getChildAt(0).getChildAt(index);
    }

    /**
     * @override
     */
    CreateEventManager() {
      return new DvtRatingGaugeEventManager(this);
    }

    /**
     * @override
     */
    IsInteractive() {
      if (this.Options.disabled) {
        return false;
      }
      return super.IsInteractive(this);
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {DvtGaugeDefaults}
   */
  class DvtStatusMeterGaugeDefaults extends DvtGaugeDefaults {
    constructor(context) {
      const SKIN_ALTA = {
        angleExtent: 360,
        borderRadius: 'auto',
        color: '#393737',
        indicatorSize: 1,
        innerRadius: 0.7,
        metricLabel: {
          style: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
          position: 'auto'
        },
        orientation: 'horizontal',
        plotArea: { color: '#E4E8EA', rendered: 'auto', borderRadius: 'auto' },
        startAngle: 90,
        thresholdDisplay: 'onIndicator'
      };
      super({ alta: SKIN_ALTA }, context);
    }
  }

  /**
   * Calculated axis information and drawable creation.
   * @class
   * @constructor
   * @extends {BaseAxisInfo}
   */
  class DvtGaugeDataAxisInfo extends ojdvtAxis.DataAxisInfoMixin(ojdvtAxis.BaseAxisInfo) {}

  /**
   * Utility functions for StatusMeter.
   * @class
   */
  const DvtStatusMeterGaugeUtils = {
    /**
     * Returns the location of the point on the arc with the specified radius
     * at the specified angle.
     * @param {dvt.Rectangle} bounds
     * @param {number} radius
     * @param {number} angle
     * @return {object} An object with x and y properties.
     * @private
     */
    calcPointOnArc: (bounds, radius, angle) => {
      var x = Math.cos(angle) * radius + bounds.w / 2 + bounds.x;
      var y = Math.sin(angle) * radius + bounds.h / 2 + bounds.y;
      return { x: x, y: y };
    },
    /**
     * Calculates and returns the path command for the circular shape.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {Number} startAngle
     * @param {Number} angleExtent
     * @param {Number} innerRadius
     * @param {Number} outerRadius
     * @return {string} The path command for the shape.
     */
    createCircularPathCmd: (bounds, startAngle, angleExtent, innerRadius, outerRadius) => {
      var cmd;
      var p1, p2, p3, p4;

      if (angleExtent < dvt.Math.TWO_PI) {
        // Calc the 4 points.  We will draw:
        // 1. Arc from p1 to p2
        // 2. Line/Move from p2 to p3
        // 3. Arc from p3 to p4
        // 4. Line from p4 to p1
        p1 = DvtStatusMeterGaugeUtils.calcPointOnArc(bounds, outerRadius, startAngle);
        p2 = DvtStatusMeterGaugeUtils.calcPointOnArc(bounds, outerRadius, startAngle + angleExtent);
        p3 = DvtStatusMeterGaugeUtils.calcPointOnArc(bounds, innerRadius, startAngle + angleExtent);
        p4 = DvtStatusMeterGaugeUtils.calcPointOnArc(bounds, innerRadius, startAngle);

        // Create the command and feed it into the path
        cmd =
          dvt.PathUtils.moveTo(p1.x, p1.y) +
          dvt.PathUtils.arcTo(outerRadius, outerRadius, angleExtent, 1, p2.x, p2.y) +
          dvt.PathUtils.lineTo(p3.x, p3.y) +
          dvt.PathUtils.arcTo(innerRadius, innerRadius, angleExtent, 0, p4.x, p4.y) +
          dvt.PathUtils.closePath();
      } else {
        // To work around a chrome/safari bug, we draw two segments around each of the outer and inner arcs
        p1 = DvtStatusMeterGaugeUtils.calcPointOnArc(bounds, outerRadius, startAngle);
        p2 = DvtStatusMeterGaugeUtils.calcPointOnArc(
          bounds,
          outerRadius,
          startAngle + angleExtent / 2
        );
        p3 = DvtStatusMeterGaugeUtils.calcPointOnArc(bounds, innerRadius, startAngle);
        p4 = DvtStatusMeterGaugeUtils.calcPointOnArc(
          bounds,
          innerRadius,
          startAngle + angleExtent / 2
        );

        // Create the command and return it
        cmd =
          dvt.PathUtils.moveTo(p1.x, p1.y) +
          dvt.PathUtils.arcTo(outerRadius, outerRadius, angleExtent / 2, 1, p2.x, p2.y) +
          dvt.PathUtils.arcTo(outerRadius, outerRadius, angleExtent / 2, 1, p1.x, p1.y);

        // Add the inner segment for a hollow center
        if (innerRadius > 0)
          cmd +=
            dvt.PathUtils.moveTo(p4.x, p4.y) +
            dvt.PathUtils.arcTo(innerRadius, innerRadius, angleExtent / 2, 0, p3.x, p3.y) +
            dvt.PathUtils.arcTo(innerRadius, innerRadius, angleExtent / 2, 0, p4.x, p4.y);

        cmd += dvt.PathUtils.closePath();
      }
      return cmd;
    }
  };

  /**
   * Indicator for the circular DvtStatusMetergauge.
   * @class
   * @constructor
   * @extends {dvt.Path}
   * @param {dvt.Context} context The rendering context
   * @param {dvt.Rectangle} bounds The available bounds for rendering.
   * @param {Number} startAngle
   * @param {Number} angleExtent
   * @param {Number} innerRadius
   * @param {Number} outerRadius
   */
  class DvtStatusMeterGaugeCircularIndicator extends dvt.Path {
    /**
     * Initializes the component.
     * @param {dvt.Context} context The rendering context
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {Number} startAngle
     * @param {Number} angleExtent
     * @param {Number} innerRadius
     * @param {Number} outerRadius
     * @protected
     * */
    constructor(context, bounds, startAngle, angleExtent, innerRadius, outerRadius) {
      super(context);
      this.setPath(bounds, startAngle, angleExtent, innerRadius, outerRadius);
    }

    /**
     * Specifies the coordinates for the indicator.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {Number} startAngle
     * @param {Number} angleExtent
     * @param {Number} innerRadius
     * @param {Number} outerRadius
     */
    setPath(bounds, startAngle, angleExtent, innerRadius, outerRadius) {
      if (bounds && bounds instanceof dvt.Rectangle) this._bounds = bounds;
      else bounds = this._bounds;
      this._startAngle = startAngle;
      this._angleExtent = angleExtent;
      this._innerRadius = innerRadius;
      this._outerRadius = outerRadius;

      this.setCmds(
        DvtStatusMeterGaugeUtils.createCircularPathCmd(
          bounds,
          startAngle,
          angleExtent,
          innerRadius,
          outerRadius
        )
      );
    }

    /**
     * Animation support.
     * @return {array}
     */
    getAnimParams() {
      return [
        this._bounds,
        this._startAngle,
        this._angleExtent,
        this._innerRadius,
        this._outerRadius
      ];
    }

    /**
     * Animation support.
     * @param {array} params
     */
    setAnimParams(params) {
      if (params && params.length == 5)
        this.setPath(params[0], params[1], params[2], params[3], params[4]);
    }
  }

  class DvtStatusMeterGaugeIndicator extends dvt.Path {
    /**
     * Initializes the component.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Context} context The rendering context
     * @param {number} x1
     * @param {number} x2
     * @param {number} y1
     * @param {number} y2
     * @protected
     */
    constructor(gauge, context, x1, x2, y1, y2) {
      super(context);
      this._gauge = gauge;

      // Set the coordinates of the shape based on the params
      this.setCoords(x1, x2, y1, y2);
    }

    /**
     * Specifies the coordinates for the indicator.
     * @param {number} x1
     * @param {number} x2
     * @param {number} y1
     * @param {number} y2
     */
    setCoords(x1, x2, y1, y2) {
      // Store these params
      this._x1 = x1;
      this._x2 = x2;
      this._y1 = y1;
      this._y2 = y2;

      // Convert into rectangle coordinates and set
      var x = Math.min(x1, x2);
      var y = Math.min(y1, y2);
      var width = Math.abs(x1 - x2);
      var height = Math.abs(y2 - y1);
      var options = this._gauge.getOptions();
      var multiplier = options['orientation'] == 'vertical' ? width : height;
      var defaultValue = '15%';

      var cmds = dvt.PathUtils.rectangleWithBorderRadius(
        x,
        y,
        width,
        height,
        options['borderRadius'],
        multiplier,
        defaultValue
      );
      this.setCmds(cmds);
    }

    /**
     * Animation support.
     * @return {array}
     */
    getAnimParams() {
      return [this._x1, this._x2, this._y1, this._y2];
    }

    /**
     * Animation support.
     * @param {array} params
     */
    setAnimParams(params) {
      if (params && params.length === 4) this.setCoords(params[0], params[1], params[2], params[3]);
    }
  }

  /**
   * Renderer for StatusMeterGauge.
   * @class
   */
  const DvtStatusMeterGaugeRenderer = {
    /**
     * Renders the gauge in the specified area.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     */
    render: (gauge, container, width, height) => {
      if (DvtGaugeDataUtils.hasData(gauge)) {
        // Allocate the outer gap for the component
        var options = gauge.getOptions();
        var outerGap = options['__layout']['outerGap'];
        var bounds = new dvt.Rectangle(
          outerGap,
          outerGap,
          width - 2 * outerGap,
          height - 2 * outerGap
        );

        if (options['orientation'] == 'horizontal' || options['orientation'] == 'vertical') {
          // Render metric label outside of plot area. Metric labels within the plot area are handled within
          // the renderShape function.
          if (DvtStatusMeterGaugeRenderer._hasMetricLabelOutsidePlotArea(options))
            DvtStatusMeterGaugeRenderer._renderMetricLabelOutsidePlotArea(gauge, container, bounds);

          DvtStatusMeterGaugeRenderer._renderShape(gauge, container, bounds);
        } else if (options['orientation'] == 'circular') {
          DvtStatusMeterGaugeRenderer._renderCircularGauge(gauge, container, bounds);
        }
      } // Render the empty text
      else DvtGaugeRenderer.renderEmptyText(gauge, container, new dvt.Rectangle(0, 0, width, height));
    },

    /**
     * Renders the circular shape into the specified area.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @private
     */
    _renderCircularGauge: (gauge, container, bounds) => {
      var options = gauge.getOptions();
      var containerBounds = bounds.clone();
      var isRTL = dvt.Agent.isRightToLeft(gauge.getCtx());
      var percentFill = 0;
      var metricLabelBounds = null;
      var value = options['value'];
      var innerRadius = options['innerRadius'];
      var thresholds = options['thresholds'];
      var maxDiameter,
        maxInnerDiameter = null;
      var startAngleRads = dvt.Math.TWO_PI - dvt.Math.degreesToRads(options['startAngle']);
      var angleExtentRads = dvt.Math.degreesToRads(options['angleExtent']);
      var endAngle = (startAngleRads + angleExtentRads) % (2 * Math.PI);

      // Store center for editable gauges
      gauge.cx = bounds.w / 2;
      gauge.cy = bounds.h / 2;
      // Determine start quadrant and end quadrent
      if (angleExtentRads != 2 * Math.PI) {
        metricLabelBounds = DvtStatusMeterGaugeRenderer._adjustCenterAndBounds(
          gauge,
          innerRadius,
          startAngleRads,
          angleExtentRads,
          endAngle,
          bounds,
          isRTL
        );
        maxInnerDiameter = gauge.maxInnerDiameter;
      }
      maxDiameter = Math.min(bounds.w, bounds.h);
      var innerRadiusLength = maxDiameter * 0.5 * innerRadius;
      var outerRadius = maxDiameter * 0.5;
      var indicatorSize = options['indicatorSize'];
      if (indicatorSize && indicatorSize > 1) {
        var spaceWidth = ((1 - 1 / indicatorSize) / 2) * (outerRadius - innerRadiusLength);
        innerRadiusLength += spaceWidth;
        outerRadius -= spaceWidth;
      }
      // Add metric label first
      var metricLabelHalign = 'center';
      var metricLabelValign = 'middle';
      if (!metricLabelBounds) {
        maxInnerDiameter = Math.min(bounds.w, bounds.h) * innerRadius;
        // Center label bounds within the space available.
        metricLabelBounds = new dvt.Rectangle(
          bounds.x + bounds.w / 2 - maxInnerDiameter * (3 / 7),
          bounds.y + bounds.h / 2 - maxInnerDiameter * (2.5 / 7),
          maxInnerDiameter * (6 / 7),
          maxInnerDiameter * (5 / 7)
        );
      }

      var bLabelRendered = false;
      if (options['label']['text']) {
        var labelValign = 'middle';
        var labelSpace = new dvt.Rectangle(
          metricLabelBounds.x,
          metricLabelBounds.y,
          metricLabelBounds.w,
          metricLabelBounds.h
        );
        // If both the label and metricLabel are rendered 1/3 of the available space is allocated for the label
        if (options['metricLabel']['rendered'] != 'off') {
          labelSpace.y = labelSpace.y + labelSpace.h * 0.6;
          labelSpace.h = labelSpace.h * 0.4;
          labelValign = 'top';
        }
        bLabelRendered = DvtGaugeRenderer.renderLabel(
          gauge,
          container,
          labelSpace,
          null,
          labelValign
        );
        if (bLabelRendered && options['metricLabel']['rendered'] != 'off') {
          metricLabelBounds.h = metricLabelBounds.h * 0.55;
          metricLabelValign = 'bottom';
        }
      }
      DvtGaugeRenderer.renderMetricLabel(
        gauge,
        container,
        metricLabelBounds,
        null,
        metricLabelHalign,
        metricLabelValign,
        true
      );

      var startAngle = startAngleRads;
      var angleExtent = percentFill * angleExtentRads;
      var plotAreaBorderColor = DvtGaugeStyleUtils.getPlotAreaBorderColor(gauge);
      if (
        thresholds &&
        options['plotArea']['rendered'] != 'off' &&
        options['thresholdDisplay'] == 'all'
      ) {
        for (
          var currentThresholdIndex = 0;
          currentThresholdIndex < thresholds.length;
          currentThresholdIndex++
        ) {
          var thresholdColor = DvtGaugeStyleUtils.getThresholdColor(
            gauge,
            thresholds[currentThresholdIndex],
            currentThresholdIndex
          );
          var max =
            thresholds[currentThresholdIndex]['max'] < options['max'] &&
            currentThresholdIndex != thresholds.length - 1
              ? thresholds[currentThresholdIndex]['max']
              : options['max'];
          var min =
            currentThresholdIndex == 0
              ? options['min']
              : thresholds[currentThresholdIndex - 1]['max'];
          startAngle =
            startAngleRads +
            angleExtentRads * DvtGaugeRenderer.getFillPercentage(options, options['min'], max, min);
          percentFill = DvtGaugeRenderer.getFillPercentage(options, min, max, max);
          angleExtent = percentFill * angleExtentRads;
          var thresholdborderColor = thresholds[currentThresholdIndex]['borderColor'];
          DvtStatusMeterGaugeRenderer._drawCircularArc(
            gauge,
            container,
            bounds,
            startAngle,
            angleExtent,
            innerRadiusLength,
            outerRadius,
            thresholdColor,
            true,
            thresholdborderColor ? thresholdborderColor : plotAreaBorderColor
          );
        }
      } else if (options['plotArea']['rendered'] != 'off' && options['thresholdDisplay'] != 'all') {
        var plotAreaColor = DvtGaugeStyleUtils.getPlotAreaColor(gauge);
        DvtStatusMeterGaugeRenderer._drawCircularArc(
          gauge,
          container,
          bounds,
          startAngleRads,
          angleExtentRads,
          innerRadiusLength,
          outerRadius,
          plotAreaColor,
          true,
          plotAreaBorderColor
        );
      }

      innerRadiusLength = maxDiameter * innerRadius * 0.5;
      outerRadius = maxDiameter * 0.5;
      if (indicatorSize && indicatorSize < 1) {
        var totalWidth = ((1 - indicatorSize) / 2) * (outerRadius - innerRadiusLength);
        innerRadiusLength += totalWidth;
        outerRadius -= totalWidth;
      }

      percentFill = DvtGaugeRenderer.getFillPercentage(
        options,
        options['min'],
        options['max'],
        value
      );
      angleExtent = percentFill * angleExtentRads;
      DvtStatusMeterGaugeRenderer._drawCircularArc(
        gauge,
        container,
        bounds,
        startAngleRads,
        angleExtent,
        innerRadiusLength,
        outerRadius,
        DvtGaugeStyleUtils.getColor(gauge),
        false
      );

      // Reference lines
      var referenceObjects = options['referenceLines'];
      if (referenceObjects) {
        for (var i = 0; i < referenceObjects.length; i++) {
          var referenceLineColor = referenceObjects[i]['color']
            ? referenceObjects[i]['color']
            : 'black';
          var referenceLineWidth = referenceObjects[i]['lineWidth']
            ? referenceObjects[i]['lineWidth']
            : 2;
          var referenceLineStyle = referenceObjects[i]['lineStyle'];
          value = referenceObjects[i]['value'];
          var angle =
            startAngleRads +
            DvtGaugeRenderer.getFillPercentage(options, options['min'], options['max'], value) *
              angleExtentRads;
          DvtStatusMeterGaugeRenderer._drawCircularReferenceLine(
            gauge,
            container,
            bounds,
            angle,
            referenceLineColor,
            referenceLineWidth,
            referenceLineStyle
          );
        }
      }
      if (options['center']['renderer'])
        DvtStatusMeterGaugeRenderer._renderCenterContent(
          gauge,
          options,
          bounds,
          containerBounds,
          maxInnerDiameter
        );
    },

    /**
     * Renders the status meter shape into the specified area.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @private
     */
    _renderShape: (gauge, container, bounds) => {
      var options = gauge.getOptions();
      var isRTL = dvt.Agent.isRightToLeft(gauge.getCtx());
      var isVert = options['orientation'] == 'vertical';

      // Create an axis info to find the coords of values.
      var axisOptions = {
        isRTL: isRTL,
        layout: {
          gapRatio: 0
        },
        timeAxisType: 'disabled',
        position: isVert ? 'left' : 'bottom',
        min: options['min'],
        max: options['max'],
        dataMin: options['min'],
        dataMax: options['max'],
        tickLabel: {
          rendered: 'off'
        },
        translations: options.translations
      };
      var axisInfo = new DvtGaugeDataAxisInfo(gauge.getCtx(), axisOptions, bounds);

      // Store the axisInfo on the gauge for editing support
      gauge.__axisInfo = axisInfo;

      // First calculate the baseline coordinate.
      var baseline = 0;
      if (options['max'] <= 0) baseline = options['max'];
      else if (options['min'] >= 0) baseline = options['min'];

      var baselineCoord = axisInfo.getCoordAt(baseline);
      // For statusmeters with plot area on, always draw from min value
      if (
        options['plotArea']['rendered'] != 'off' &&
        !(options['plotArea']['rendered'] == 'auto' && options['thresholdDisplay'] == 'onIndicator')
      )
        baselineCoord = axisInfo.getUnboundedCoordAt(options['min']);

      // Calculate the endCoord.  Adjust to keep within the axis.
      var endCoord = axisInfo.getUnboundedCoordAt(options['value']);
      endCoord = isVert
        ? Math.max(bounds.y, Math.min(bounds.y + bounds.h, endCoord))
        : Math.max(bounds.x, Math.min(bounds.x + bounds.w, endCoord));

      var indicatorSize = options['indicatorSize'];
      var indicatorX1,
        indicatorX2,
        indicatorY1,
        indicatorY2,
        plotX1,
        plotX2,
        plotY1,
        plotY2 = 0;

      // The variables drawnPlotSize and drawnIndicatorSize are used to specifiy the fraction
      // of the possible width that will be used for plotArea and the indicator
      var drawnPlotSize = indicatorSize < 1 ? 1 : indicatorSize;
      var drawnIndicatorSize = indicatorSize > 1 ? 1 : indicatorSize;
      var delta = Math.min(0.5, (Math.abs(endCoord - baselineCoord) - 0.5) / 2); // Indicator should be at least 0.5px
      var sign;
      if (isVert) {
        sign = endCoord > baselineCoord ? -1 : 1;
        indicatorX1 = bounds.x + ((1 - drawnIndicatorSize) / 2) * bounds.w + 0.5;
        indicatorX2 = bounds.x + (bounds.w * (1 + drawnIndicatorSize)) / 2 - 0.5;
        indicatorY2 = baselineCoord - sign * delta;
        indicatorY1 = endCoord + sign * delta;
        plotX1 = bounds.x + ((1 - 1 / drawnPlotSize) / 2) * bounds.w;
        plotX2 = bounds.x + (bounds.w * (1 + 1 / drawnPlotSize)) / 2;
        plotY1 = bounds.y;
        plotY2 = bounds.y + bounds.h;
      } else {
        var isNegative = isRTL ? endCoord > baselineCoord : endCoord < baselineCoord;
        sign = isNegative ? -1 : 1;
        indicatorX1 = isRTL ? baselineCoord - sign * delta : baselineCoord + sign * delta;
        indicatorX2 = isRTL ? endCoord + sign * delta : endCoord - sign * delta;
        indicatorY1 = bounds.y + ((1 - drawnIndicatorSize) / 2) * bounds.h + 0.5;
        indicatorY2 = bounds.y + (bounds.h * (1 + drawnIndicatorSize)) / 2 - 0.5;
        plotX1 = bounds.x;
        plotX2 = bounds.x + bounds.w;
        plotY1 = bounds.y + ((1 - 1 / drawnPlotSize) / 2) * bounds.h;
        plotY2 = bounds.y + (bounds.h * (1 + 1 / drawnPlotSize)) / 2;
      }

      var bRender = true;
      if (options['value'] == options['min']) {
        if (isVert) indicatorY1 = indicatorY2;
        else indicatorX1 = indicatorX2;
        bRender = false; // don't draw an empty bar
      }

      // Create plotArea
      var borderColor = DvtGaugeStyleUtils.getBorderColor(gauge);
      var plotAreaBorderColor = DvtGaugeStyleUtils.getPlotAreaBorderColor(gauge);
      var thresholds = options['thresholds'];
      var gradientAngle = isVert ? 0 : 270;

      // Case for plot area with all thresholds displayed
      var plotArea;
      var i;
      if (
        thresholds &&
        options['plotArea']['rendered'] != 'off' &&
        options['thresholdDisplay'] == 'all'
      ) {
        for (i = thresholds.length - 1; i >= 0; i--) {
          var currentThresholdIndex = i;
          plotArea = DvtStatusMeterGaugeRenderer._createShape(
            gauge,
            gauge.getCtx(),
            plotX1,
            plotX2,
            plotY1,
            plotY2
          );

          var cp = new dvt.ClipPath('pacp' + gauge.getId());

          // For each threshold clip everything above the particular threshold maximum from the plot area shape
          if (i == thresholds.length - 1) {
            if (!isVert && isRTL)
              cp.addRect(
                axisInfo.getUnboundedCoordAt(options['max']) + 1,
                0,
                bounds.w + 2,
                bounds.h + 2,
                0,
                0
              );
            else cp.addRect(0, 0, bounds.w + 2, bounds.h + 2, 0, 0);
          } else {
            if (isVert) {
              var h =
                options['max'] - thresholds[thresholds.length - 2 - currentThresholdIndex]['max'];
              cp.addRect(
                0,
                axisInfo.getUnboundedCoordAt(options['max']),
                bounds.w + 2,
                ((Math.max(0, h) * 1) / Math.abs(options['min'] - options['max'])) * bounds.h,
                0,
                0
              );
            } else {
              if (isRTL) {
                var thresholdMax =
                  thresholds[thresholds.length - 2 - currentThresholdIndex]['max'] == null
                    ? 100
                    : thresholds[thresholds.length - 2 - currentThresholdIndex]['max'];
                cp.addRect(
                  axisInfo.getUnboundedCoordAt(options['max']),
                  0,
                  ((Math.max(0, options['max'] - thresholdMax) * 1) /
                    Math.abs(options['min'] - options['max'])) *
                    bounds.w,
                  bounds.h + 2,
                  0,
                  0
                );
              } else {
                var w = thresholds[currentThresholdIndex]['max'] - options['min'];
                cp.addRect(
                  0,
                  0,
                  ((Math.max(0, w) * 1) / Math.abs(options['min'] - options['max'])) * bounds.w,
                  bounds.h + 2,
                  0,
                  0
                );
              }
            }
          }
          plotArea.setClipPath(cp);

          // Color threshold with defined color, or use the color ramp if possible
          if (isRTL || isVert) currentThresholdIndex = thresholds.length - 1 - i;

          plotArea.setSolidFill(
            DvtGaugeStyleUtils.getThresholdColor(
              gauge,
              thresholds[currentThresholdIndex],
              currentThresholdIndex
            )
          );
          var thresholdBorderColor = thresholds[currentThresholdIndex]['borderColor'];
          plotArea.setSolidStroke(thresholdBorderColor ? thresholdBorderColor : plotAreaBorderColor);
          DvtStatusMeterGaugeRenderer._renderPlotAreaVisualEffects(
            gauge,
            container,
            plotArea,
            DvtGaugeStyleUtils.getThresholdColor(
              gauge,
              thresholds[currentThresholdIndex],
              currentThresholdIndex
            ),
            gradientAngle
          );
        }
      } else if (
        options['plotArea']['rendered'] !== 'off' &&
        !(
          options['plotArea']['rendered'] == 'auto' && options['thresholdDisplay'] == 'onIndicator'
        ) &&
        options['thresholdDisplay'] != 'all'
      ) {
        plotArea = isVert
          ? DvtStatusMeterGaugeRenderer._createShape(
              gauge,
              gauge.getCtx(),
              plotX1,
              plotX2,
              axisInfo.getUnboundedCoordAt(options['max']),
              axisInfo.getUnboundedCoordAt(options['min'])
            )
          : DvtStatusMeterGaugeRenderer._createShape(
              gauge,
              gauge.getCtx(),
              axisInfo.getUnboundedCoordAt(options['min']),
              axisInfo.getUnboundedCoordAt(options['max']),
              plotY1,
              plotY2
            );
        var plotAreaColor = DvtGaugeStyleUtils.getPlotAreaColor(gauge);
        plotArea.setSolidFill(plotAreaColor);
        plotArea.setSolidStroke(plotAreaBorderColor);
        DvtStatusMeterGaugeRenderer._renderPlotAreaVisualEffects(
          gauge,
          container,
          plotArea,
          plotAreaColor,
          gradientAngle
        );
      }

      // Create the indicator.
      var shape = new DvtStatusMeterGaugeIndicator(
        gauge,
        gauge.getCtx(),
        indicatorX1,
        indicatorX2,
        indicatorY1,
        indicatorY2
      );
      gauge.__shapes.push(shape);

      // Apply style properties
      var color = DvtGaugeStyleUtils.getColor(gauge);
      if (gauge.getCtx().getThemeBehavior() === 'redwood' || options['visualEffects'] === 'none') {
        shape.setSolidFill(color);
      } else {
        var arColors = [
          dvt.ColorUtils.adjustHSL(color, 0, -0.09, 0.04),
          dvt.ColorUtils.adjustHSL(color, 0, -0.04, -0.05)
        ];
        var arAlphas = [1, 1];
        var arStops = [0, 1];
        var gradient = new dvt.LinearGradientFill(gradientAngle, arColors, arAlphas, arStops);
        shape.setFill(gradient);
      }

      if (borderColor) shape.setSolidStroke(borderColor);

      shape.setClassName(options['svgClassName']);
      shape.setStyle(options['svgStyle']);

      // Add the shape
      if (bRender) container.addChild(shape);

      // Render the visual effects
      DvtStatusMeterGaugeRenderer._createShape(
        gauge,
        gauge.getCtx(),
        indicatorX1,
        indicatorX2,
        indicatorY1,
        indicatorY2
      );

      // Render reference objects
      var xCoord, yCoord;
      var referenceLine, referenceLineSize;
      var referenceObjects = options['referenceLines'];
      if (referenceObjects) {
        for (i = 0; i < referenceObjects.length; i++) {
          var refColor = referenceObjects[i]['color'] ? referenceObjects[i]['color'] : 'white';
          var value = referenceObjects[i]['value'];
          indicatorSize = options['indicatorSize'];
          if (isVert) {
            referenceLineSize = ((1 - indicatorSize) / 2 + indicatorSize) * bounds.w;
            xCoord = bounds.x + ((1 - indicatorSize) / 4) * bounds.w;
            yCoord = axisInfo.getUnboundedCoordAt(value);
            referenceLine = new dvt.Line(
              gauge.getCtx(),
              xCoord,
              yCoord,
              xCoord + referenceLineSize,
              yCoord
            );
          } else {
            referenceLineSize = ((1 - indicatorSize) / 2 + indicatorSize) * bounds.h;
            xCoord = axisInfo.getUnboundedCoordAt(value);
            yCoord = bounds.y + ((1 - indicatorSize) / 4) * bounds.h;
            referenceLine = new dvt.Line(
              gauge.getCtx(),
              xCoord,
              yCoord,
              xCoord,
              yCoord + referenceLineSize
            );
          }
          var lineWidth = referenceObjects[i]['lineWidth'] ? referenceObjects[i]['lineWidth'] : 2;
          var lineStyle = referenceObjects[i]['lineStyle'];
          var stroke = new dvt.Stroke(
            refColor,
            1,
            lineWidth,
            false,
            dvt.Stroke.getDefaultDashProps(lineStyle, lineWidth)
          );
          referenceLine.setStroke(stroke);
          container.addChild(referenceLine);

          // Shadowing effect
          // Fix for : Shadow causes the reference line to disappear in IE11
          if (
            dvt.Agent.browser !== 'ie' &&
            dvt.Agent.browser !== 'edge' &&
            options['visualEffects'] != 'none'
          ) {
            var shadow = new dvt.Shadow(0.5, 0.5, 1, 'rgba(0, 0, 0, 0.8)');
            referenceLine.addDrawEffect(shadow);
          }
        }
      }

      // Render the metric label within the plot area bounds
      var metricLabelPosition = options['metricLabel']['position'];
      if (
        options['metricLabel']['rendered'] == 'on' &&
        !DvtStatusMeterGaugeRenderer._hasMetricLabelOutsidePlotArea(options) &&
        !options['label']['text']
      ) {
        var indicatorPoints = { x1: indicatorX1, x2: indicatorX2, y1: indicatorY1, y2: indicatorY2 };
        var plotAreaPoints = { x1: plotX1, x2: plotX2, y1: plotY1, y2: plotY2 };
        DvtStatusMeterGaugeRenderer._renderMetricLabelInsidePlotArea(
          gauge,
          container,
          bounds,
          color,
          metricLabelPosition,
          indicatorPoints,
          plotAreaPoints
        );
      }

      // Render the label
      else if (options['label']['text']) {
        DvtStatusMeterGaugeRenderer._renderLabel(gauge, container, bounds, metricLabelPosition);
      }
    },

    /**
     * Creates and returns the shape for the statusmeter.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Context} context
     * @param {number} x1
     * @param {number} x2
     * @param {number} y1
     * @param {number} y2
     * @return {dvt.Path}
     * @private
     */
    _createShape: (gauge, context, x1, x2, y1, y2) => {
      var x = Math.min(x1, x2);
      var y = Math.min(y1, y2);
      var width = Math.abs(x1 - x2);
      var height = Math.abs(y2 - y1);
      var options = gauge.getOptions();
      var multiplier = options['orientation'] == 'vertical' ? width : height;
      var defaultValue = '15%';
      var borderRadiusInput =
        options['plotArea']['borderRadius'] != 'auto'
          ? options['plotArea']['borderRadius']
          : options['borderRadius'];
      var cmds = dvt.PathUtils.rectangleWithBorderRadius(
        x,
        y,
        width,
        height,
        borderRadiusInput,
        multiplier,
        defaultValue
      );
      return new dvt.Path(context, cmds);
    },

    /**
     * Renders the visual effects for the plot area.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Shape} shape The plot area.
     * @param {string} color
     * @param {number} gradientAngle
     * @private
     */
    _renderPlotAreaVisualEffects: (gauge, container, shape, color, gradientAngle) => {
      var options = gauge.getOptions();
      shape.setMouseEnabled(false);
      container.addChild(shape);

      if (gauge.getCtx().getThemeBehavior() !== 'redwood' && options['visualEffects'] !== 'none') {
        // Gradient
        var arColors = [
          dvt.ColorUtils.adjustHSL(color, 0, -0.04, -0.05),
          dvt.ColorUtils.adjustHSL(color, 0, -0.09, 0.04)
        ];
        var gradient = new dvt.LinearGradientFill(gradientAngle, arColors, [1, 1], [0, 1]);
        shape.setFill(gradient);
      }
      shape.setClassName(options['plotArea']['svgClassName']);
      shape.setStyle(options['plotArea']['svgStyle']);
    },

    /**
     * Renders the metricLabel into the specified area for vertical/horizontal status meter gauges with the metricLabel outside the plotarea.
     * Updates the bounds after rendering to reserve space for the labels.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @private
     */
    _renderMetricLabelOutsidePlotArea: (gauge, container, bounds) => {
      var options = gauge.getOptions();
      var isRTL = dvt.Agent.isRightToLeft(gauge.getCtx());
      var isVert = options['orientation'] == 'vertical';
      var metricLabel = new dvt.OutputText(gauge.getCtx(), '');
      var metricLabelString = DvtGaugeRenderer.getFormattedMetricLabel(options['value'], gauge);
      var metricLabelGap = options['__layout']['labelGap'];
      var metricLabelStyle = options['metricLabel']['style'];

      // Backward compatibility
      var metricLabelColor = metricLabelStyle.getStyle('color');
      metricLabelColor = metricLabelColor ? metricLabelColor : '#333333';

      var maxMetricLabelDims = null;
      metricLabel.setCSSStyle(metricLabelStyle);
      metricLabel.setSolidFill(metricLabelColor);

      var size;
      var minMetricLabel;
      var maxMetricLabel;
      var bound;
      var maxValue;
      if (isVert && options['metricLabel']['rendered'] == 'on') {
        bound = options['max'] > 0 ? options['max'] : options['min'];
        maxValue = DvtGaugeRenderer.getFormattedMetricLabel(bound, gauge);
        maxMetricLabel = new dvt.OutputText(gauge.getCtx(), maxValue);
        maxMetricLabel.setCSSStyle(metricLabelStyle);
        var computedMetricLabelBounds = new dvt.Rectangle(
          bounds.x,
          bounds.y + 0.8 * bounds.h,
          bounds.w,
          0.2 * bounds.h
        );
        size =
          metricLabelStyle.getStyle('font-size') ||
          dvt.TextUtils.getOptimalFontSize(
            maxMetricLabel.getCtx(),
            maxMetricLabel.getTextString(),
            maxMetricLabel.getCSSStyle(),
            computedMetricLabelBounds
          );
        maxMetricLabel.setFontSize(size);
        maxMetricLabelDims = maxMetricLabel.getDimensions();
        bounds.h -= maxMetricLabelDims.h;
        //alignCoord = bounds.y - maxMetricLabelDims.h;
        //metricLabelSpace = maxMetricLabelDims.w;
        metricLabel.setFontSize(size);
        metricLabel.setTextString(metricLabelString);
        metricLabel.setX(bounds.x + bounds.w / 2);
        metricLabel.setY(bounds.y + bounds.h);
        bounds.h -= metricLabelGap;
        metricLabel.alignCenter();
        dvt.TextUtils.fitText(metricLabel, bounds.w, bounds.h, container);
      }
      // Allocate space for the horizontal metricLabel
      else if (!isVert && options['metricLabel']['rendered'] == 'on') {
        // Check if the metric label's height will fit
        size = metricLabelStyle.getStyle('font-size');
        minMetricLabel = DvtGaugeRenderer.getFormattedMetricLabel(options['min'], gauge);
        maxMetricLabel = DvtGaugeRenderer.getFormattedMetricLabel(options['max'], gauge);
        if (size === undefined && bounds.h < 18) {
          size = DvtGaugeRenderer.calcLabelFontSize(
            [metricLabelString, minMetricLabel, maxMetricLabel],
            metricLabel,
            bounds
          );
        }
        size = size ? parseInt(size) : 13;
        metricLabel.setFontSize(size);

        var alignCoord; // The horizontal alignment point for the metricLabel
        // Allocate space to the right for positive values and any values with plotArea
        if (
          options['max'] > 0 ||
          options['plotArea']['rendered'] != 'off' ||
          !(options['plotArea']['rendered'] == 'auto' && options['thresholdDisplay'] == 'onIndicator')
        ) {
          bound = options['max'] > 0 ? options['max'] : options['min'];
          maxValue = DvtGaugeRenderer.getFormattedMetricLabel(bound, gauge);
          maxMetricLabel = new dvt.OutputText(gauge.getCtx(), maxValue);
          maxMetricLabel.setCSSStyle(metricLabelStyle);
          maxMetricLabel.setFontSize(size);
          maxMetricLabelDims = maxMetricLabel.getDimensions();
          maxMetricLabelDims.w = Math.min(maxMetricLabelDims.w, bounds.w);
          // Align the metricLabel
          alignCoord = isRTL ? bounds.x + maxMetricLabelDims.w : bounds.x + bounds.w;
          var metricLabelSpace = maxMetricLabelDims.w;

          if (isRTL) {
            // Allocate to the left
            bounds.x += maxMetricLabelDims.w + metricLabelGap;
            bounds.w -= maxMetricLabelDims.w + metricLabelGap;
          } else {
            // Allocate to the right
            bounds.w -= maxMetricLabelDims.w + metricLabelGap;
          }
        }

        // Allocate space to the left for negative values
        if (
          options['min'] < 0 &&
          options['plotArea']['rendered'] != 'on' &&
          !(options['plotArea']['rendered'] == 'auto' && options['thresholdDisplay'] == 'onIndicator')
        ) {
          var minValue = DvtGaugeRenderer.getFormattedMetricLabel(options['min'], gauge);
          minMetricLabel = new dvt.OutputText(gauge.getCtx(), minValue);
          minMetricLabel.setCSSStyle(metricLabelStyle);
          minMetricLabel.setFontSize(size);
          var minMetricLabelDims = minMetricLabel.getDimensions();

          // Align the metricLabel
          if (options['value'] < 0 || options['max'] <= 0) {
            alignCoord = isRTL ? bounds.x + bounds.w : bounds.x + minMetricLabelDims.w;
            metricLabelSpace = minMetricLabelDims.w;
          }

          // Update the allocated space
          if (isRTL)
            // Allocate to the right
            bounds.w -= minMetricLabelDims.w + metricLabelGap;
          else {
            // Allocate to the left
            bounds.x += minMetricLabelDims.w + metricLabelGap;
            bounds.w -= minMetricLabelDims.w + metricLabelGap;
          }
        }
        // Create and position the text
        metricLabel.setTextString(metricLabelString);
        metricLabel.setX(alignCoord);
        dvt.TextUtils.centerTextVertically(metricLabel, bounds.y + bounds.h / 2);
        metricLabel.alignRight();

        // Truncate to fit
        // : fire fox reports a bigger height by 1/2px.
        var maxHeight = dvt.Agent.browser === 'firefox' ? bounds.h + 2 : bounds.h;
        dvt.TextUtils.fitText(metricLabel, metricLabelSpace, maxHeight, container);
      }
    },

    /**
     * Renders the metricLabel into the specified area for vertical/horizontal status meter gauges with the metricLabel inside the plotarea.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {string} color The color of the background
     * @param {string} metricLabelPosition The position of the metricLabel
     * @param {object} indicator An object containing the indicator x1, y1, x2, y2.
     * @param {object} plotArea An object containing the plotArea x1, y1, x2, y2.
     * @param {boolean} repeatedTry Specifies if this is the second try to fit the metricLabel into available space
     * @private
     */
    _renderMetricLabelInsidePlotArea: (
      gauge,
      container,
      bounds,
      color,
      metricLabelPosition,
      indicator,
      plotArea,
      repeatedTry
    ) => {
      var options = gauge.getOptions();
      var isRTL = dvt.Agent.isRightToLeft(gauge.getCtx());
      var isVert = options['orientation'] == 'vertical';
      var plotAreaRendered = options['plotArea']['rendered'] == 'on';
      var hAlignment = 'center';
      var vAlignment = 'middle';

      var metricLabelSpace = new dvt.Rectangle(
        Math.min(indicator.x1, indicator.x2),
        Math.min(indicator.y1, indicator.y2),
        Math.abs(indicator.x2 - indicator.x1),
        Math.abs(indicator.y2 - indicator.y1)
      );
      var metricLabelColor = options['metricLabel']['style'].getStyle('color');
      if (metricLabelPosition == 'center') {
        metricLabelColor = metricLabelColor
          ? metricLabelColor
          : dvt.ColorUtils.getContrastingTextColor(color);
        if (isVert) {
          metricLabelSpace.h -= metricLabelSpace.w;
          metricLabelSpace.y += metricLabelSpace.w / 2;
        } else {
          metricLabelSpace.w -= metricLabelSpace.h;
          metricLabelSpace.x += metricLabelSpace.h / 2;
        }
      } else if (metricLabelPosition == 'insideIndicatorEdge') {
        metricLabelColor = metricLabelColor
          ? metricLabelColor
          : dvt.ColorUtils.getContrastingTextColor(color);
        if (isVert) {
          metricLabelSpace.h -= metricLabelSpace.w;
          metricLabelSpace.y += metricLabelSpace.w / 2;
          if (!plotAreaRendered && indicator.y1 > indicator.y2) {
            vAlignment = 'bottom';
          } else {
            vAlignment = 'top';
          }
        } else {
          metricLabelSpace.w -= metricLabelSpace.h;
          metricLabelSpace.x += metricLabelSpace.h / 2;
          if (isRTL) {
            if (!plotAreaRendered && indicator.x1 < indicator.x2) {
              hAlignment = 'right';
            } else {
              hAlignment = 'left';
            }
          } else {
            if (!plotAreaRendered && indicator.x1 > indicator.x2) {
              hAlignment = 'left';
            } else {
              hAlignment = 'right';
            }
          }
        }
      } else if (metricLabelPosition == 'outsideIndicatorEdge') {
        if (isVert) {
          metricLabelSpace.h = Math.abs(plotArea.y1 - indicator.y1) - metricLabelSpace.w;
          metricLabelSpace.y = plotArea.y1 + metricLabelSpace.w / 2;
          vAlignment = 'bottom';
          if (!plotAreaRendered && indicator.y1 > indicator.y2) {
            metricLabelSpace.h = Math.abs(plotArea.y2 - indicator.y1) - metricLabelSpace.w;
            metricLabelSpace.y = indicator.y1 + metricLabelSpace.w / 2;
            vAlignment = 'top';
          }
        } else {
          if (isRTL) {
            if (!plotAreaRendered && indicator.x1 < indicator.x2) {
              metricLabelSpace.w = Math.abs(plotArea.x2 - indicator.x2) - metricLabelSpace.h;
              metricLabelSpace.x = indicator.x2 + metricLabelSpace.h / 2;
              hAlignment = 'left';
            } else {
              metricLabelSpace.w = Math.abs(plotArea.x1 - indicator.x2) - metricLabelSpace.h;
              metricLabelSpace.x = plotArea.x1 + metricLabelSpace.h / 2;
              hAlignment = 'right';
            }
          } else {
            if (!plotAreaRendered && indicator.x1 > indicator.x2) {
              metricLabelSpace.w = Math.abs(plotArea.x1 - indicator.x2) - metricLabelSpace.h;
              metricLabelSpace.x = plotArea.x1 + metricLabelSpace.h / 2;
              hAlignment = 'right';
            } else {
              metricLabelSpace.w = Math.abs(plotArea.x2 - indicator.x2) - metricLabelSpace.h;
              metricLabelSpace.x = indicator.x2 + metricLabelSpace.h / 2;
              hAlignment = 'left';
            }
          }
        }
      }
      var metricLabelRendered = DvtGaugeRenderer.renderMetricLabel(
        gauge,
        container,
        metricLabelSpace,
        metricLabelColor,
        hAlignment,
        vAlignment
      );
      // If the metricLabel didn't fit, try to fit it into another section
      if (!metricLabelRendered && !repeatedTry) {
        if (metricLabelPosition == 'outsideIndicatorEdge') {
          DvtStatusMeterGaugeRenderer._renderMetricLabelInsidePlotArea(
            gauge,
            container,
            bounds,
            color,
            'insideIndicatorEdge',
            indicator,
            plotArea,
            true
          );
        } else if (metricLabelPosition == 'insideIndicatorEdge' || metricLabelPosition == 'center') {
          DvtStatusMeterGaugeRenderer._renderMetricLabelInsidePlotArea(
            gauge,
            container,
            bounds,
            color,
            'outsideIndicatorEdge',
            indicator,
            plotArea,
            true
          );
        }
      }
    },

    /**
     * Renders the label for vertical/horizontal status meter gauges.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {string} metricLabelPosition The position of the metricLabel
     * @private
     */
    _renderLabel: (gauge, container, bounds, metricLabelPosition) => {
      var isRTL = dvt.Agent.isRightToLeft(gauge.getCtx());
      var options = gauge.getOptions();
      var isVert = options['orientation'] == 'vertical';
      var labelSpace = new dvt.Rectangle(
        bounds.x,
        bounds.y,
        isVert ? bounds.w : bounds.w - bounds.h,
        isVert ? bounds.h - bounds.w : bounds.h
      );
      var labelString = options['label']['text'];
      if (
        !DvtStatusMeterGaugeRenderer._hasMetricLabelOutsidePlotArea(options) &&
        options['metricLabel']['rendered'] == 'on'
      ) {
        var metricLabelString = DvtGaugeRenderer.getFormattedMetricLabel(options['value'], gauge);
        labelString = dvt.ResourceUtils.format(options.translations.labelAndValue, [
          labelString,
          metricLabelString
        ]);
      }
      var labelStyle = options['label']['style'];
      var fontStyle = labelStyle.clone();
      var size = labelStyle.getStyle('font-size');
      if (!size) {
        // Calculate font size
        var tempLabel = new dvt.OutputText(gauge.getCtx(), labelString, 0, 0);
        tempLabel.setCSSStyle(labelStyle);
        tempLabel.setTextString(labelString);
        // Make size calculations based on the available height not width to have consistent size on same sized gauges
        // for horizontal gauges. For vertical gauges make calculations based on width
        if (isVert)
          size = dvt.TextUtils.getOptimalFontSize(
            tempLabel.getCtx(),
            tempLabel.getTextString(),
            tempLabel.getCSSStyle(),
            new dvt.Rectangle(labelSpace.x, labelSpace.y, labelSpace.w, Number.MAX_VALUE)
          );
        else
          size = dvt.TextUtils.getOptimalFontSize(
            tempLabel.getCtx(),
            tempLabel.getTextString(),
            tempLabel.getCSSStyle(),
            new dvt.Rectangle(labelSpace.x, labelSpace.y, Number.MAX_VALUE, labelSpace.h)
          );
      }
      var label = new dvt.MultilineText(gauge.getCtx(), labelString);
      fontStyle.setFontSize('font-size', size, gauge.getCtx());
      label.setCSSStyle(fontStyle);
      dvt.TextUtils.fitText(label, labelSpace.w, labelSpace.h, gauge);
      if (
        options['label']['position'] == 'center' ||
        (options['label']['position'] == 'auto' && isVert)
      ) {
        dvt.TextUtils.centerTextVertically(label, bounds.y + bounds.h / 2);
        label.setX(bounds.x + bounds.w / 2);
        label.alignCenter();
      } else {
        dvt.TextUtils.centerTextVertically(label, bounds.y + bounds.h / 2);
        if (!isVert && isRTL) {
          label.setX(bounds.x + bounds.w - labelSpace.h / 2);
          label.alignRight();
        } else if (!isVert && !isRTL) {
          label.setX(bounds.x + labelSpace.h / 2);
          label.alignLeft();
        } else if (isVert) {
          label.setY(bounds.y + bounds.h - label.getDimensions().h - labelSpace.w / 2);
          label.setX(bounds.x + bounds.w / 2);
          label.alignCenter();
        }
      }
      container.addChild(label);
    },

    /**
     * Draw specified segment for circular status meter
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {Number} startAngle Start angle.
     * @param {Number} angleExtent Angle from start to end.
     * @param {Number} innerRadius Radius to inner border of arc.
     * @param {Number} outerRadius Radius to outer border of arc..
     * @param {color} color Color of the arc.
     * @param {Boolean} isPlotArea True if arc being drawn is the plot area.
     * @param {color} plotAreaBorderColor Color of the plot area border color
     * @private
     */
    _drawCircularArc: (
      gauge,
      container,
      bounds,
      startAngle,
      angleExtent,
      innerRadius,
      outerRadius,
      color,
      isPlotArea,
      plotAreaBorderColor
    ) => {
      var context = gauge.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(gauge.getCtx());
      if (isRTL) {
        startAngle = Math.PI - startAngle - angleExtent;
        startAngle = startAngle > 0 ? startAngle : startAngle + 2 * Math.PI;
      }

      var shape;
      if (isPlotArea) {
        shape = new dvt.Path(
          context,
          DvtStatusMeterGaugeUtils.createCircularPathCmd(
            bounds,
            startAngle,
            angleExtent,
            innerRadius,
            outerRadius
          )
        );
      } else {
        shape = new DvtStatusMeterGaugeCircularIndicator(
          context,
          bounds,
          startAngle,
          angleExtent,
          innerRadius,
          outerRadius
        );
        gauge.__shapes.push(shape);
      }
      shape.setSolidFill(color);
      var borderColor = DvtGaugeStyleUtils.getBorderColor(gauge);
      if (borderColor && !isPlotArea) {
        shape.setSolidStroke(borderColor);
      } else if (isPlotArea && plotAreaBorderColor) {
        shape.setSolidStroke(plotAreaBorderColor);
      }
      var options = gauge.getOptions();
      shape.setClassName(isPlotArea ? options['plotArea']['svgClassName'] : options['svgClassName']);
      shape.setStyle(isPlotArea ? options['plotArea']['svgStyle'] : options['svgStyle']);
      container.addChild(shape);
    },

    /**
     * Draw reference line
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {Number} angle Angle at which line is drawn.
     * @param {string} color Color of the arc.
     * @param {number} lineWidth
     * @param {string} lineStyle
     * @private
     */
    _drawCircularReferenceLine: (gauge, container, bounds, angle, color, lineWidth, lineStyle) => {
      var context = gauge.getCtx();
      var maxDiameter = Math.min(bounds.w, bounds.h);
      var innerRadius = maxDiameter * 0.275;
      var outerRadius = maxDiameter * 0.5;
      if (dvt.Agent.isRightToLeft(gauge.getCtx())) {
        angle = Math.PI - angle;
        angle = angle > 0 ? angle : angle + 2 * Math.PI;
      }
      var p1 = DvtStatusMeterGaugeUtils.calcPointOnArc(bounds, innerRadius, angle);
      var p2 = DvtStatusMeterGaugeUtils.calcPointOnArc(bounds, outerRadius, angle);
      var shape = new dvt.Line(context, p1.x, p1.y, p2.x, p2.y);
      var stroke = new dvt.Stroke(
        color,
        1,
        lineWidth,
        false,
        dvt.Stroke.getDefaultDashProps(lineStyle, lineWidth)
      );
      shape.setStroke(stroke);
      container.addChild(shape);
    },

    /**
     * Calculates which Quadrant the angle specified belongs to.
     * @param {Number} angle
     * @param {Boolean} bStart Indicates if the angle is a start angle.
     * @return {Number} The quadrant.
     */
    getAngleQuadrant: (angle, bStart) => {
      var quadrant = 1;
      if (bStart) {
        if (angle >= dvt.Math.HALF_PI && angle < Math.PI) quadrant = 2;
        else if (angle >= Math.PI && angle < Math.PI * 1.5) quadrant = 3;
        else if (angle >= Math.PI * 1.5 && angle < dvt.Math.TWO_PI) quadrant = 4;
      } else {
        if (angle > dvt.Math.HALF_PI && angle <= Math.PI) quadrant = 2;
        else if (angle > Math.PI && angle <= Math.PI * 1.5) quadrant = 3;
        else if ((angle > Math.PI * 1.5 && angle < dvt.Math.TWO_PI) || angle == 0) quadrant = 4;
      }
      return quadrant;
    },

    /**
     * Determines if the metric label is rendered outside the plot area
     * @param {object} options The options object
     * @return {Boolean} Returns true if the plotArea is rendered outside the plot area
     * @private
     */
    _hasMetricLabelOutsidePlotArea: (options) => {
      var metricLabelPosition = options['metricLabel']['position'];
      return (
        metricLabelPosition == 'auto' ||
        metricLabelPosition == 'outsidePlotArea' ||
        ((metricLabelPosition == 'withLabel' || metricLabelPosition == 'withTitle') &&
          !options['label']['text'])
      );
    },

    /**
     * Adjust the bounds of the rendered circular gauge shape when the angleExtent is less than 360. Returns the metricLabel bounds.
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {Number} innerRadius
     * @param {Number} startAngleRads
     * @param {Number} angleExtentRads
     * @param {Number} endAngle
     * @param {dvt.Rectangle} bounds The available bounds for rendering.
     * @param {Boolean} isRTL Indicates if the page is right to left.
     * @return {dvt.Rectangle} The bounds of the label.
     * @private
     */
    _adjustCenterAndBounds: (
      gauge,
      innerRadius,
      startAngleRads,
      angleExtentRads,
      endAngle,
      bounds,
      isRTL
    ) => {
      var labelBounds = null;
      var startQuadrant = DvtStatusMeterGaugeRenderer.getAngleQuadrant(startAngleRads, true);
      var endQuadrant = DvtStatusMeterGaugeRenderer.getAngleQuadrant(endAngle, false);
      var width = bounds.w;
      var height = bounds.h;
      var cx = width / 2;
      var cy = height / 2;
      var maxDiameter, maxInnerDiameter;

      // Arc is within one quadrant
      if (startQuadrant == endQuadrant && angleExtentRads <= dvt.Math.HALF_PI) {
        maxDiameter = Math.min(bounds.w, bounds.h) * 2;
        bounds.w = bounds.w + maxDiameter / 2;
        bounds.h = bounds.h + maxDiameter / 2;
        maxInnerDiameter = maxDiameter * innerRadius;

        // Start and end in first quadrant
        if ((!isRTL && startQuadrant == 1) || (isRTL && startQuadrant == 2)) {
          bounds.x -= maxDiameter / 2;
          bounds.y -= maxDiameter / 2;
          cx = width / 2 - maxDiameter / 4 + 1;
          cy = height / 2 - maxDiameter / 4 + 1;
          labelBounds = new dvt.Rectangle(
            bounds.x + bounds.w / 2 - 1,
            bounds.y + bounds.h / 2 - 1,
            maxInnerDiameter * (3 / 7) - 2,
            maxInnerDiameter * (2.5 / 7) - 2
          );
        }

        // Start and end in second quadrant
        else if ((!isRTL && startQuadrant == 2) || (isRTL && startQuadrant == 1)) {
          bounds.y -= maxDiameter / 2;
          cx = width / 2 + maxDiameter / 4 - 1;
          cy = height / 2 - maxDiameter / 4 + 1;
          labelBounds = new dvt.Rectangle(
            bounds.x + bounds.w / 2 - maxInnerDiameter * (3 / 7) + 1,
            bounds.y + bounds.h / 2 - 1,
            maxInnerDiameter * (3 / 7) - 2,
            maxInnerDiameter * (2.5 / 7) - 2
          );
        }

        // Start and end in third quadrant
        else if ((!isRTL && startQuadrant == 3) || (isRTL && startQuadrant == 4)) {
          cx = width / 2 + maxDiameter / 4 - 1;
          cy = height / 2 + maxDiameter / 4 - 1;
          labelBounds = new dvt.Rectangle(
            bounds.x + bounds.w / 2 - maxInnerDiameter * (3 / 7) + 1,
            bounds.y + bounds.h / 2 - maxInnerDiameter * (2.5 / 7) + 1,
            maxInnerDiameter * (3 / 7) - 2,
            maxInnerDiameter * (2.5 / 7) - 2
          );
        }

        // Start and end in fourth quadrant
        else if ((!isRTL && startQuadrant == 4) || (isRTL && startQuadrant == 3)) {
          bounds.x -= maxDiameter / 2;
          cx = width / 2 - maxDiameter / 4 + 1;
          cy = height / 2 + maxDiameter / 4 - 1;
          labelBounds = new dvt.Rectangle(
            bounds.x + bounds.w / 2 - 1,
            bounds.y + bounds.h / 2 - maxInnerDiameter * (2.5 / 7) + 1,
            maxInnerDiameter * (3 / 7) - 2,
            maxInnerDiameter * (2.5 / 7) - 2
          );
        }
      }

      // Arc spans 2 quadrants
      else if ((startQuadrant % 4) + 1 == endQuadrant && angleExtentRads <= Math.PI) {
        if (startQuadrant == 1 || startQuadrant == 3) {
          maxDiameter = Math.min(bounds.w, bounds.h * 2);
          maxInnerDiameter = maxDiameter * innerRadius;
          if (bounds.w > bounds.h) {
            labelBounds = new dvt.Rectangle(
              bounds.x + bounds.w / 2 - maxInnerDiameter * (3 / 7),
              bounds.y + bounds.h - (bounds.h - maxDiameter / 2) / 2 - maxInnerDiameter * (2.75 / 7),
              maxInnerDiameter * (6 / 7),
              maxInnerDiameter * (2.5 / 7)
            );
            if (startQuadrant == 1) {
              labelBounds.y =
                bounds.y + (bounds.h - maxDiameter / 2) / 2 + maxInnerDiameter * (0.5 / 7);
              bounds.y -= maxDiameter / 2 - (bounds.h - maxDiameter / 2) / 2;
              cy = height / 2 - maxDiameter / 4 + 1;
            } else {
              bounds.y += (bounds.h - maxDiameter / 2) / 2;
              cy = height / 2 + maxDiameter / 4 - 1;
            }
            bounds.h = maxDiameter;
          }
        } else {
          maxDiameter = Math.min(bounds.w * 2, bounds.h);
          maxInnerDiameter = maxDiameter * innerRadius;
          if (bounds.w < bounds.h) {
            labelBounds = new dvt.Rectangle(
              bounds.x + bounds.w - (bounds.w - maxDiameter / 2) / 2 - maxInnerDiameter * (3.25 / 7),
              bounds.y + bounds.h / 2 - maxInnerDiameter * (2.5 / 7),
              maxInnerDiameter * (3 / 7),
              maxInnerDiameter * (5 / 7)
            );
            if ((!isRTL && startQuadrant == 4) || (isRTL && startQuadrant == 2)) {
              labelBounds.x =
                bounds.x + (bounds.w - maxDiameter / 2) / 2 + maxInnerDiameter * (0.25 / 7);
              bounds.x -= maxDiameter / 2 - (bounds.w - maxDiameter / 2) / 2;
              cx = width / 2 - maxDiameter / 4 + 1;
            } else {
              bounds.x += (bounds.w - maxDiameter / 2) / 2;
              cx = width / 2 + maxDiameter / 4 - 1;
            }
            bounds.w = maxDiameter;
          }
        }
      }
      // Arc spans 3 quadrants
      else if ((endQuadrant % 4) + 1 == startQuadrant && angleExtentRads > Math.PI) {
        var labelCenterOffset;
        if (startQuadrant == 1 && bounds.h > bounds.w) {
          maxDiameter = Math.min(
            2 * (bounds.w / (Math.cos(startAngleRads) + 1)),
            2 * (bounds.w / (Math.sin(endAngle - Math.PI * 1.5) + 1)),
            bounds.h
          );
          maxInnerDiameter = maxDiameter * innerRadius;
          labelCenterOffset = maxInnerDiameter * (3 / 7) * ((2 * bounds.w) / maxDiameter - 1);
          if (!isRTL) {
            labelBounds = new dvt.Rectangle(
              bounds.x + maxDiameter / 2 - maxInnerDiameter * (3 / 7),
              bounds.y + bounds.h / 2 - maxInnerDiameter * (2.5 / 7),
              maxInnerDiameter * (3 / 7) * (1 + ((2 * bounds.w) / maxDiameter - 1)),
              maxInnerDiameter * (5 / 7)
            );
            cx = maxDiameter / 2;
          } else {
            labelBounds = new dvt.Rectangle(
              bounds.x + bounds.w - maxDiameter / 2 - labelCenterOffset,
              bounds.y + bounds.h / 2 - maxInnerDiameter * (2.5 / 7),
              maxInnerDiameter * (3 / 7) + labelCenterOffset,
              maxInnerDiameter * (5 / 7)
            );
            bounds.x -= maxDiameter - bounds.w;
            cx = -maxDiameter / 2 + width;
          }
          bounds.w = maxDiameter;
        } else if (startQuadrant == 2 && bounds.h < bounds.w) {
          maxDiameter = Math.min(
            2 * (bounds.h / (Math.cos(startAngleRads - dvt.Math.HALF_PI) + 1)),
            2 * (bounds.h / (Math.sin(endAngle) + 1)),
            bounds.w
          );
          maxInnerDiameter = maxDiameter * innerRadius;
          labelBounds = new dvt.Rectangle(
            bounds.x + bounds.w / 2 - maxInnerDiameter * (3 / 7),
            bounds.y + maxDiameter / 2 - maxInnerDiameter * (2.5 / 7),
            maxInnerDiameter * (6 / 7),
            maxInnerDiameter * (2.5 / 7) * (1 + ((2 * bounds.h) / maxDiameter - 1))
          );
          bounds.h = maxDiameter;
          cy = maxDiameter / 2;
        } else if (startQuadrant == 3 && bounds.h > bounds.w) {
          maxDiameter = Math.min(
            2 * (bounds.w / (Math.cos(startAngleRads - Math.PI) + 1)),
            2 * (bounds.w / (Math.sin(endAngle - dvt.Math.HALF_PI) + 1)),
            bounds.h
          );
          maxInnerDiameter = maxDiameter * innerRadius;
          labelCenterOffset = maxInnerDiameter * (3 / 7) * ((2 * bounds.w) / maxDiameter - 1);
          if (!isRTL) {
            labelBounds = new dvt.Rectangle(
              bounds.x + bounds.w - maxDiameter / 2 - labelCenterOffset,
              bounds.y + bounds.h / 2 - maxInnerDiameter * (2.5 / 7),
              maxInnerDiameter * (3 / 7) + labelCenterOffset,
              maxInnerDiameter * (5 / 7)
            );
            bounds.x -= maxDiameter - bounds.w;
            cx = -maxDiameter / 2 + width;
          } else {
            labelBounds = new dvt.Rectangle(
              bounds.x + maxDiameter / 2 - maxInnerDiameter * (3 / 7),
              bounds.y + bounds.h / 2 - maxInnerDiameter * (2.5 / 7),
              maxInnerDiameter * (3 / 7) * (1 + ((2 * bounds.w) / maxDiameter - 1)),
              maxInnerDiameter * (5 / 7)
            );
            cx = maxDiameter / 2;
          }
          bounds.w = maxDiameter;
        } else if (startQuadrant == 4 && bounds.h < bounds.w) {
          maxDiameter = Math.min(
            2 * (bounds.h / (Math.cos(startAngleRads - Math.PI * 1.5) + 1)),
            2 * (bounds.h / (Math.sin(dvt.Math.TWO_PI - endAngle) + 1)),
            bounds.w
          );
          maxInnerDiameter = maxDiameter * innerRadius;
          labelCenterOffset = maxInnerDiameter * (2.5 / 7) * ((2 * bounds.h) / maxDiameter - 1);
          labelBounds = new dvt.Rectangle(
            bounds.x + bounds.w / 2 - maxInnerDiameter * (3 / 7),
            bounds.y + bounds.h - maxDiameter / 2 - labelCenterOffset,
            maxInnerDiameter * (6 / 7),
            maxInnerDiameter * (2.5 / 7) + labelCenterOffset
          );
          bounds.y -= maxDiameter - bounds.h;
          bounds.h = maxDiameter;
          cy = -maxDiameter / 2 + height;
        }
      }
      gauge.cx = cx;
      gauge.cy = cy;
      gauge.maxInnerDiameter = maxInnerDiameter;
      return labelBounds;
    },

    /**
     * Renders the custom center content of circular status meter gauge
     * @param {StatusMeterGauge} gauge The gauge being rendered.
     * @param {object} options The options object.
     * @param {dvt.Rectangle} bounds The bounds of the 360 degree gauge.
     * @param {dvt.Rectangle} containerBounds The available bounds for rendering.
     * @param {number} innerDiameter The inner diameter of the gauge.
     * @private
     */
    _renderCenterContent: (gauge, options, bounds, containerBounds, innerDiameter) => {
      var outerBounds = new dvt.Rectangle(
        bounds.x + (bounds.w - innerDiameter) * 0.5,
        bounds.y + (bounds.h - innerDiameter) * 0.5,
        innerDiameter,
        innerDiameter
      );
      outerBounds = outerBounds.getIntersection(containerBounds);
      var innerBounds = new dvt.Rectangle(
        bounds.x + (bounds.w - innerDiameter / Math.sqrt(2)) * 0.5,
        bounds.y + (bounds.h - innerDiameter / Math.sqrt(2)) * 0.5,
        innerDiameter / Math.sqrt(2),
        innerDiameter / Math.sqrt(2)
      );
      innerBounds = innerBounds.getIntersection(containerBounds);
      var centerRenderer = options['center']['renderer'];
      if (centerRenderer) {
        var dataContext = {
          outerBounds: {
            x: outerBounds.x,
            y: outerBounds.y,
            width: outerBounds.w,
            height: outerBounds.h
          },
          innerBounds: {
            x: innerBounds.x,
            y: innerBounds.y,
            width: innerBounds.w,
            height: innerBounds.h
          },
          metricLabel: DvtGaugeRenderer.getFormattedMetricLabel(options['value'], gauge),
          component: options['_widgetConstructor']
        };
        var context = gauge.getCtx();
        dataContext = context.fixRendererContext(dataContext);

        var parentDiv = context.getContainer();

        // Remove existing overlay if there is one
        var existingOverlay = gauge.centerDiv;
        if (existingOverlay) parentDiv.removeChild(existingOverlay);

        var customContent = centerRenderer(dataContext);
        if (!customContent) return;
        var newOverlay = context.createOverlayDiv();
        if (Array.isArray(customContent)) {
          customContent.forEach((node) => {
            newOverlay.appendChild(node); // @HTMLUpdateOK
          });
        } else {
          newOverlay.appendChild(customContent); // @HTMLUpdateOK
        }
        gauge.centerDiv = newOverlay;
        parentDiv.appendChild(newOverlay); // @HTMLUpdateOK

        // Invoke the overlay attached callback if one is available.
        var callback = context.getOverlayAttachedCallback();
        if (callback) callback(newOverlay);
      }
    }
  };

  /**
   * Status Meter Gauge component.
   * @class
   * @constructor
   * @extends {DvtGauge}
   */
  class StatusMeterGauge extends DvtGauge {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      this.type = 'statusMeter';
      // Create the defaults object
      this.Defaults = new DvtStatusMeterGaugeDefaults(context);

      /**
       * The axis info of the chart. This will be set during render time and is used for editing support.
       * @type {dvt.AxisInfo}
       */
      this.__axisInfo = null;
    }

    /**
     * @override
     */
    SetOptions(options) {
      // NOTE: This extra clone should be removed once we stop supporting the deprecated attrs
      options = dvt.JsonUtils.clone(options);

      if (options['title']) options['label'] = options['title'];

      if (options['plotArea']) {
        if (options['plotArea']['className'])
          options['plotArea']['svgClassName'] = options['plotArea']['className'];

        if (options['plotArea']['style'])
          options['plotArea']['svgStyle'] = options['plotArea']['style'];
      }

      // Map the custom element readonly attr to the widget readOnly option
      if (this.getCtx().isCustomElement()) options['readOnly'] = options['readonly'];

      // Combine the user options with the defaults and store
      super.SetOptions(this.Defaults.calcOptions(options));
    }

    /**
     * @override
     */
    Render(container, width, height) {
      DvtStatusMeterGaugeRenderer.render(this, container, width, height);
    }

    /**
     * @override
     */
    CreateAnimOnDisplay(objs, animationType, animationDuration) {
      var animatedObjs = [];
      for (var i = 0; i < objs.length; i++) {
        var obj = objs[i];
        var endState = obj.getAnimParams();
        if (this.Options['orientation'] == 'horizontal')
          obj.setAnimParams([endState[0], endState[0], endState[2], endState[3]]);
        else if (this.Options['orientation'] == 'vertical')
          obj.setAnimParams([endState[0], endState[1], endState[3], endState[3]]);
        else if (this.Options['orientation'] == 'circular')
          obj.setAnimParams([endState[0], endState[1], 0, endState[3], endState[4]]);
        var animation = new dvt.CustomAnimation(this.getCtx(), obj, animationDuration);
        animation
          .getAnimator()
          .addProp(
            dvt.Animator.TYPE_NUMBER_ARRAY,
            obj,
            obj.getAnimParams,
            obj.setAnimParams,
            endState
          );
        animation.getAnimator().setEasing(function (progress) {
          return dvt.Easing.backOut(progress, 0.7);
        });
        animatedObjs.push(animation);
      }
      return new dvt.ParallelPlayable(this.getCtx(), animatedObjs);
    }

    /**
     * @override
     */
    GetValueAt(x, y) {
      var options = this.Options;
      var isRTL = dvt.Agent.isRightToLeft(this.getCtx());
      if (options['orientation'] == 'horizontal') {
        return this.__axisInfo.getBoundedValAt(x);
      } else if (options['orientation'] == 'vertical') {
        return this.__axisInfo.getBoundedValAt(y);
      } else if (options['orientation'] == 'circular') {
        var angleExtent = options['angleExtent'];
        var angleRads = Math.atan2(y - this.cy, x - this.cx);
        var angle = isRTL
          ? 180 - (dvt.Math.radsToDegrees(angleRads) - options['startAngle'])
          : dvt.Math.radsToDegrees(angleRads) - (360 - options['startAngle']);
        angle = (angle + 720) % 360;

        // Calculate and adjust ratio to keep in bounds
        var ratio = angle / angleExtent;
        var minValue = options['min'];
        var maxValue = options['max'];
        var value = ratio * (maxValue - minValue) + minValue;
        if (angle > angleExtent) {
          if ((angle - angleExtent) / (360 - angleExtent) > 0.5) value = 0;
          else value = maxValue;
        }
        return value;
      }
      return null;
    }
  }

  exports.LedGauge = LedGauge;
  exports.RatingGauge = RatingGauge;
  exports.StatusMeterGauge = StatusMeterGauge;

  Object.defineProperty(exports, '__esModule', { value: true });

});
