/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import 'ojs/ojcomponentcore';
import oj from 'ojs/ojcore-base';
import DvtAttributeUtils from 'ojs/ojdvt-base';
import $ from 'jquery';
import { error } from 'ojs/ojlogger';
import * as ConverterUtils from 'ojs/ojconverterutils-i18n';
import * as NumberConverter from 'ojs/ojconverter-number';
import LabelledByUtils from 'ojs/ojlabelledbyutils';
import { LedGauge, RatingGauge, StatusMeterGauge } from 'ojs/ojgauge-toolkit';

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
var __oj_led_gauge_metadata = 
{
  "properties": {
    "borderColor": {
      "type": "string"
    },
    "color": {
      "type": "string"
    },
    "label": {
      "type": "object",
      "properties": {
        "style": {
          "type": "object",
          "value": {}
        },
        "text": {
          "type": "string",
          "value": ""
        }
      }
    },
    "markerSize": {
      "type": "string",
      "enumValues": [
        "fit",
        "lg",
        "md",
        "sm"
      ],
      "value": "fit"
    },
    "max": {
      "type": "number",
      "value": 100
    },
    "metricLabel": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object"
        },
        "rendered": {
          "type": "string",
          "enumValues": [
            "off",
            "on"
          ],
          "value": "off"
        },
        "scaling": {
          "type": "string",
          "enumValues": [
            "auto",
            "billion",
            "million",
            "none",
            "quadrillion",
            "thousand",
            "trillion"
          ],
          "value": "auto"
        },
        "style": {
          "type": "object",
          "value": {}
        },
        "text": {
          "type": "string",
          "value": ""
        },
        "textType": {
          "type": "string",
          "enumValues": [
            "number",
            "percent"
          ],
          "value": "number"
        }
      }
    },
    "min": {
      "type": "number",
      "value": 0
    },
    "rotation": {
      "type": "number",
      "enumValues": [
        "0",
        "180",
        "270",
        "90"
      ],
      "value": 0
    },
    "size": {
      "type": "number",
      "value": 1
    },
    "svgClassName": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object",
      "value": {}
    },
    "thresholds": {
      "type": "Array<Object>",
      "value": []
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
    },
    "trackResize": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleContainsControls": {
          "type": "string"
        },
        "componentName": {
          "type": "string"
        },
        "labelAndValue": {
          "type": "string"
        },
        "labelClearSelection": {
          "type": "string"
        },
        "labelCountWithTotal": {
          "type": "string"
        },
        "labelDataVisualization": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "stateCollapsed": {
          "type": "string"
        },
        "stateDrillable": {
          "type": "string"
        },
        "stateExpanded": {
          "type": "string"
        },
        "stateHidden": {
          "type": "string"
        },
        "stateIsolated": {
          "type": "string"
        },
        "stateMaximized": {
          "type": "string"
        },
        "stateMinimized": {
          "type": "string"
        },
        "stateSelected": {
          "type": "string"
        },
        "stateUnselected": {
          "type": "string"
        },
        "stateVisible": {
          "type": "string"
        }
      }
    },
    "type": {
      "type": "string",
      "value": "circle"
    },
    "value": {
      "type": "number",
      "writeback": true
    },
    "visualEffects": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "auto"
    }
  },
  "methods": {
    "getMetricLabel": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* global __oj_led_gauge_metadata:false */

(function () {
  __oj_led_gauge_metadata.extension._WIDGET_NAME = 'ojLedGauge';
  // Supported marker shapes for gauges
  var _LED_GAUGE_SHAPE_ENUMS = {
    arrow: true,
    square: true,
    rectangle: true,
    circle: true,
    diamond: true,
    triangle: true,
    human: true,
    star: true
  };
  oj.CustomElementBridge.register('oj-led-gauge', {
    metadata: __oj_led_gauge_metadata,
    parseFunction: DvtAttributeUtils.shapeParseFunction({ type: true }, _LED_GAUGE_SHAPE_ENUMS)
  });
})();

var __oj_rating_gauge_metadata = 
{
  "properties": {
    "changed": {
      "type": "boolean",
      "writeback": true,
      "value": false
    },
    "changedState": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string",
          "value": ""
        },
        "color": {
          "type": "string"
        },
        "shape": {
          "type": "string",
          "value": "star"
        },
        "source": {
          "type": "string",
          "value": ""
        },
        "svgClassName": {
          "type": "string",
          "value": ""
        },
        "svgStyle": {
          "type": "object",
          "value": {}
        }
      }
    },
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "hoverState": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string",
          "value": ""
        },
        "color": {
          "type": "string"
        },
        "shape": {
          "type": "string",
          "value": "star"
        },
        "source": {
          "type": "string",
          "value": ""
        },
        "svgClassName": {
          "type": "string",
          "value": ""
        },
        "svgStyle": {
          "type": "object",
          "value": {}
        }
      }
    },
    "labelledBy": {
      "type": "string"
    },
    "max": {
      "type": "number",
      "value": 5
    },
    "min": {
      "type": "number",
      "value": 0
    },
    "orientation": {
      "type": "string",
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "preserveAspectRatio": {
      "type": "string",
      "enumValues": [
        "meet",
        "none"
      ],
      "value": "meet"
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "selectedState": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string",
          "value": ""
        },
        "color": {
          "type": "string"
        },
        "shape": {
          "type": "string",
          "value": "star"
        },
        "source": {
          "type": "string",
          "value": ""
        },
        "svgClassName": {
          "type": "string",
          "value": ""
        },
        "svgStyle": {
          "type": "object",
          "value": {}
        }
      }
    },
    "size": {
      "type": "string",
      "enumValues": [
        "fit",
        "large",
        "lg",
        "md",
        "medium",
        "sm",
        "small"
      ],
      "value": "fit"
    },
    "step": {
      "type": "number",
      "value": 1
    },
    "thresholds": {
      "type": "Array<Object>",
      "value": []
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
    },
    "trackResize": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
    },
    "transientValue": {
      "type": "number",
      "writeback": true,
      "readOnly": true
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleContainsControls": {
          "type": "string"
        },
        "componentName": {
          "type": "string"
        },
        "labelAndValue": {
          "type": "string"
        },
        "labelClearSelection": {
          "type": "string"
        },
        "labelCountWithTotal": {
          "type": "string"
        },
        "labelDataVisualization": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "stateCollapsed": {
          "type": "string"
        },
        "stateDrillable": {
          "type": "string"
        },
        "stateExpanded": {
          "type": "string"
        },
        "stateHidden": {
          "type": "string"
        },
        "stateIsolated": {
          "type": "string"
        },
        "stateMaximized": {
          "type": "string"
        },
        "stateMinimized": {
          "type": "string"
        },
        "stateSelected": {
          "type": "string"
        },
        "stateUnselected": {
          "type": "string"
        },
        "stateVisible": {
          "type": "string"
        }
      }
    },
    "unselectedState": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string",
          "value": ""
        },
        "color": {
          "type": "string"
        },
        "shape": {
          "type": "string",
          "value": "star"
        },
        "source": {
          "type": "string",
          "value": ""
        },
        "svgClassName": {
          "type": "string",
          "value": ""
        },
        "svgStyle": {
          "type": "object",
          "value": {}
        }
      }
    },
    "value": {
      "type": "number",
      "writeback": true
    },
    "visualEffects": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "auto"
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* global __oj_rating_gauge_metadata:false */
(function () {
  __oj_rating_gauge_metadata.extension._WIDGET_NAME = 'ojRatingGauge';
  __oj_rating_gauge_metadata.extension._ALIASED_PROPS = { transientValue: 'rawValue' };

  // Consider a string with at least one digit a valid SVG path
  var _SHAPE_REGEXP = /\d/;
  var _RATING_GAUGE_SHAPE_ENUMS = {
    circle: true,
    square: true,
    diamond: true,
    triangle: true,
    human: true,
    star: true
  };
  var _UNSELECTED_RATING_GAUGE_SHAPE_ENUMS = {
    circle: true,
    square: true,
    diamond: true,
    triangle: true,
    human: true,
    star: true,
    dot: true,
    none: true
  };
  var _RATING_GAUGE_SHAPE_PROPS = {
    'changed-state.shape': true,
    'hover-state.shape': true,
    'selected-state.shape': true,
    'unselected-state.shape': true
  };
  function shapePropertyParser(value, name, meta, defaultParseFunction) {
    if (_RATING_GAUGE_SHAPE_PROPS[name] || name === 'unselected-state.shape') {
      if (_SHAPE_REGEXP.test(value)) {
        return value;
      } else if (_RATING_GAUGE_SHAPE_PROPS[name] && !_RATING_GAUGE_SHAPE_ENUMS[name]) {
        throw new Error('Found: ' + value + '. Expected: ' + _RATING_GAUGE_SHAPE_ENUMS.toString());
      } else if (name === 'unselected-state.shape' && !_UNSELECTED_RATING_GAUGE_SHAPE_ENUMS[name]) {
        throw new Error(
          'Found: ' + value + '. Expected: ' + _UNSELECTED_RATING_GAUGE_SHAPE_ENUMS.toString()
        );
      } else {
        return value;
      }
    }
    return defaultParseFunction(value);
  }
  oj.CustomElementBridge.register('oj-rating-gauge', {
    metadata: __oj_rating_gauge_metadata,
    parseFunction: shapePropertyParser
  });
})();

var __oj_status_meter_gauge_metadata = 
{
  "properties": {
    "angleExtent": {
      "type": "number",
      "value": 360
    },
    "animationDuration": {
      "type": "number"
    },
    "animationOnDataChange": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    },
    "borderColor": {
      "type": "string"
    },
    "borderRadius": {
      "type": "string",
      "value": "auto"
    },
    "center": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
    },
    "color": {
      "type": "string"
    },
    "describedBy": {
      "type": "string"
    },
    "indicatorSize": {
      "type": "number",
      "value": 1
    },
    "innerRadius": {
      "type": "number",
      "value": 0.7
    },
    "label": {
      "type": "object",
      "properties": {
        "position": {
          "type": "string",
          "enumValues": [
            "auto",
            "center",
            "start"
          ],
          "value": "auto"
        },
        "style": {
          "type": "object",
          "value": {}
        },
        "text": {
          "type": "string",
          "value": ""
        }
      }
    },
    "labelledBy": {
      "type": "string"
    },
    "max": {
      "type": "number",
      "value": 100
    },
    "metricLabel": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object"
        },
        "position": {
          "type": "string",
          "enumValues": [
            "auto",
            "center",
            "insideIndicatorEdge",
            "outsideIndicatorEdge",
            "outsidePlotArea",
            "withLabel"
          ],
          "value": "auto"
        },
        "rendered": {
          "type": "string",
          "enumValues": [
            "auto",
            "off",
            "on"
          ],
          "value": "auto"
        },
        "scaling": {
          "type": "string",
          "enumValues": [
            "auto",
            "billion",
            "million",
            "none",
            "quadrillion",
            "thousand",
            "trillion"
          ],
          "value": "auto"
        },
        "style": {
          "type": "object",
          "value": {}
        },
        "text": {
          "type": "string",
          "value": ""
        },
        "textType": {
          "type": "string",
          "enumValues": [
            "number",
            "percent"
          ],
          "value": "number"
        }
      }
    },
    "min": {
      "type": "number",
      "value": 0
    },
    "orientation": {
      "type": "string",
      "enumValues": [
        "circular",
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "plotArea": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "borderRadius": {
          "type": "string",
          "value": "auto"
        },
        "color": {
          "type": "string"
        },
        "rendered": {
          "type": "string",
          "enumValues": [
            "auto",
            "off",
            "on"
          ],
          "value": "auto"
        },
        "svgClassName": {
          "type": "string",
          "value": ""
        },
        "svgStyle": {
          "type": "object",
          "value": {}
        }
      }
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "referenceLines": {
      "type": "Array<Object>",
      "value": []
    },
    "size": {
      "type": "string",
      "enumValues": [
        "fit",
        "lg",
        "md",
        "sm"
      ],
      "value": "fit"
    },
    "startAngle": {
      "type": "number",
      "value": 90
    },
    "step": {
      "type": "number"
    },
    "svgClassName": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object",
      "value": {}
    },
    "thresholdDisplay": {
      "type": "string",
      "enumValues": [
        "all",
        "currentOnly",
        "onIndicator"
      ],
      "value": "onIndicator"
    },
    "thresholds": {
      "type": "Array<Object>",
      "value": []
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
    },
    "trackResize": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
    },
    "transientValue": {
      "type": "number",
      "writeback": true,
      "readOnly": true
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleContainsControls": {
          "type": "string"
        },
        "componentName": {
          "type": "string"
        },
        "labelAndValue": {
          "type": "string"
        },
        "labelClearSelection": {
          "type": "string"
        },
        "labelCountWithTotal": {
          "type": "string"
        },
        "labelDataVisualization": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "stateCollapsed": {
          "type": "string"
        },
        "stateDrillable": {
          "type": "string"
        },
        "stateExpanded": {
          "type": "string"
        },
        "stateHidden": {
          "type": "string"
        },
        "stateIsolated": {
          "type": "string"
        },
        "stateMaximized": {
          "type": "string"
        },
        "stateMinimized": {
          "type": "string"
        },
        "stateSelected": {
          "type": "string"
        },
        "stateUnselected": {
          "type": "string"
        },
        "stateVisible": {
          "type": "string"
        }
      }
    },
    "value": {
      "type": "number",
      "writeback": true
    },
    "visualEffects": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "auto"
    }
  },
  "methods": {
    "getMetricLabel": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* global __oj_status_meter_gauge_metadata:false */
(function () {
  __oj_status_meter_gauge_metadata.extension._WIDGET_NAME = 'ojStatusMeterGauge';
  __oj_status_meter_gauge_metadata.extension._ALIASED_PROPS = { transientValue: 'rawValue' };
  oj.CustomElementBridge.register('oj-status-meter-gauge', {
    metadata: __oj_status_meter_gauge_metadata
  });
})();

/**
 * @ojcomponent oj.dvtBaseGauge
 * @augments oj.dvtBaseComponent
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 * @since 0.7.0
 * @abstract
 */
oj.__registerWidget(
  'oj.dvtBaseGauge',
  $.oj.dvtBaseComponent,
  {
    /**
     * If custom element, get the labelledBy option, and set this
     * onto the root dom element as aria-labelledby. We append "|label" so it matches the id that
     * is on the oj-label's label element.
     * @memberof oj.dvtBaseGauge
     * @instance
     * @private
     *
     */
    _labelledByUpdatedForSet: LabelledByUtils._labelledByUpdatedForSet,
    /**
     * When describedBy changes, we need to update the aria-described attribute.
     * @memberof oj.dvtBaseGauge
     * @instance
     * @private
     */
    _describedByUpdated: LabelledByUtils._describedByUpdated,
    /**
     * @override
     * @memberof oj.dvtBaseGauge
     * @protected
     */
    _ComponentCreate: function () {
      this._SetSizeClass();
      this._super();
      this._SetLocaleHelpers(NumberConverter, ConverterUtils);
    },

    _OptionChangeHandler: function (options) {
      this._SetSizeClass();
      this._super(options);
    },

    _GetSizeClass: function () {
      // subcomponents should override
    },

    _SetSizeClass: function () {
      var newClass = this._GetSizeClass();
      if (newClass !== this._sizeClass) {
        this.element.removeClass(this._sizeClass);
        this._sizeClass = newClass;
        this.element.addClass(newClass);
      }
    },

    _ProcessStyles: function (optionsCopy) {
      var options = optionsCopy;
      // The superclass evaluates the style classes, including those in _GetChildStyleClasses
      this._super(options);

      // Transfer the threshold colors to the correct location
      options._thresholdColors = [options._threshold1, options._threshold2, options._threshold3];
      options._threshold1 = null;
      options._threshold2 = null;
      options._threshold3 = null;
    },
    _AfterCreate: function () {
      this._super();
      var flags = {
        _context: { writeback: true, internalSet: true, readOnly: true }
      };
      this.option('rawValue', this.options.value, flags);
      if (this._SupportsOjLabel()) {
        var labelledBy = this.options.labelledBy;
        this._labelledByUpdatedForSet(this.element[0].id, null, labelledBy, this.element);
      }
    },
    _GetContentElement: function () {
      return this.element;
    },

    _GetChildStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses['oj-gauge-metric-label'] = { path: 'metricLabel/style', property: 'TEXT' };
      styleClasses['oj-gauge-label'] = { path: 'label/style', property: 'TEXT' };
      styleClasses['oj-gauge-threshold1'] = { path: '_threshold1', property: 'color' };
      styleClasses['oj-gauge-threshold2'] = { path: '_threshold2', property: 'color' };
      styleClasses['oj-gauge-threshold3'] = { path: '_threshold3', property: 'color' };
      return styleClasses;
    },

    _GetEventTypes: function () {
      return ['input', 'optionChange'];
    },

    _HandleEvent: function (event) {
      var type = event.type;
      if (type === 'valueChange') {
        var newValue = event.newValue;
        if (event.complete) {
          this._UserOptionChange('value', newValue);
        } else {
          // Fired during the value change interaction for each change
          this._trigger('input', null, { value: newValue });
          this._UserOptionChange('rawValue', newValue);
        }
      } else {
        this._super(event);
      }
    },

    /**
     * @protected
     * @memberof oj.dvtBaseGauge
     */
    _SupportsOjLabel: function () {
      return false;
    },

    /**
     * @override
     * @private
     * @inheritdoc
     */
    _setOption: function (key, value, flags) {
      var oldValue = this.options[key];
      if (key === 'rawValue') {
        // rawValue is a read-only option
        error("'rawValue' is a read-only option and cannot be set");
        return;
      }

      if (key === 'value') {
        var rawValueFlags = {
          _context: { writeback: true, internalSet: true, readOnly: true }
        };
        this.option('rawValue', value, rawValueFlags);
      }

      if (this._SupportsOjLabel()) {
        var elem;

        if (key === 'labelledBy') {
          elem = this.element;
          this._labelledByUpdatedForSet(elem[0].id, oldValue, value, elem);
        }

        if (key === 'describedBy') {
          // This sets the aria-describedby on the correct dom node
          this._describedByUpdated(oldValue, value);
        }
      }
      this._super(key, value, flags);
    },

    _ConvertLocatorToSubId: function (locator) {
      var subId = locator.subId;

      // Convert the supported locators
      if (
        subId === 'oj-ledgauge-tooltip' ||
        subId === 'oj-ratinggauge-tooltip' ||
        subId === 'oj-statusmetergauge-tooltip'
      ) {
        subId = 'tooltip';
      }
      if (subId === 'oj-ratinggauge-item' && locator.index != null) {
        subId = 'item[' + locator.index + ']';
      }

      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    }
  },
  true
);

/**
 * @ojcomponent oj.ojLedGauge
 * @ojdeprecated {since: '13.1.0', description: 'Use oj-badge classes or icons instead.'}
 * @augments oj.dvtBaseGauge
 * @since 0.7.0
 *
 * @ojshortdesc A LED gauge displays information graphically, highlighting a specific metric value in relation to its thresholds.
 * @ojrole img
 * @ojrole application
 *
 * @ojpropertylayout [ {propertyGroup: "common", items: ["type", "rotation", "metricLabel.rendered", "metricLabel.textType", "color", "style"]},
 *                     {propertyGroup: "data", items: ["value", "thresholds"]} ]
 * @ojvbdefaultcolumns 2
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-gauge-led'
 *
 * @classdesc
 * <h3 id="ledGaugeOverview-section">
 *   JET LED Gauge
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ledGaugeOverview-section"></a>
 * </h3>
 *
 * <p>LED gauges are used to highlight a specific metric value in relation to its
 * thresholds.<p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-led-gauge
 *   value='63'
 *   min='0'
 *   max='100'
 *   thresholds='[{"max": 33}, {"max": 67}, {}]'>
 * &lt;/oj-led-gauge>
 * </code>
 * </pre>
 *
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"a11y"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojLedGauge', $.oj.dvtBaseGauge, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * The border color of the gauge. Only applies when thresholds are not defined. The default value varies based on theme.
     * @expose
     * @name borderColor
     * @memberof oj.ojLedGauge
     * @instance
     * @type {string=}
     * @ojformat color
     */
    borderColor: '',

    /**
     * The color of the gauge. Only applies when thresholds are not defined. The default value varies based on theme.
     * @expose
     * @name color
     * @memberof oj.ojLedGauge
     * @instance
     * @type {string=}
     * @ojformat color
     */
    color: '#393737',

    /**
     * An object defining the label.
     * @expose
     * @name label
     * @memberof oj.ojLedGauge
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'This attribute is deprecated. Use metric-label instead.'}
     * @type {Object=}
     */
    label: {
      /**
       * The CSS style object defining the style of the label.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * @expose
       * @name label.style
       * @ojshortdesc The CSS style object defining the style of the label.
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      style: {},

      /**
       * The text for the label.
       * @expose
       * @name label.text
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       * @ojtranslatable
       */
      text: ''
    },

    /**
     * An object defining the value label.
     * @expose
     * @name metricLabel
     * @memberof oj.ojLedGauge
     * @instance
     * @type {Object=}
     */
    metricLabel: {
      /**
       * The converter used to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
       * @expose
       * @name metricLabel.converter
       * @ojshortdesc The converter used to format the labels. See the Help documentation for more information.
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?oj.Converter<string>"}
       * @default null
       */
      converter: null,

      /**
       * Defines if the label is rendered.
       * @expose
       * @name metricLabel.rendered
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @default "off"
       */
      rendered: 'off',

      /**
       * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
       * @expose
       * @name metricLabel.scaling
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "none"
       * @ojvalue {string} "thousand"
       * @ojvalue {string} "million"
       * @ojvalue {string} "billion"
       * @ojvalue {string} "trillion"
       * @ojvalue {string} "quadrillion"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      scaling: 'auto',

      /**
       * The CSS style object defining the style of the label.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * @expose
       * @name metricLabel.style
       * @ojshortdesc The CSS style object defining the style of the label.
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      style: {},

      /**
       * The text for the label. If specified, text will overwrite the numeric value that is displayed by default. The converter, scaling, and textType attributes are ignored when text is specified.
       * @expose
       * @name metricLabel.text
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       * @ojtranslatable
       */
      text: '',

      /**
       * Defines whether the label is a number or a percentage of the total value.
       * @expose
       * @name metricLabel.textType
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "percent"
       * @ojvalue {string} "number"
       * @default "number"
       */
      textType: 'number'
    },

    /** Specifies the size of the led gauge.
     * @expose
     * @name markerSize
     * @memberof oj.ojLedGauge
     * @ojshortdesc Specifies the led size.
     * @instance
     * @type {string=}
     * @ojvalue {string} "sm" {"description": "Small size, as determined by the theme, will be used for the gauge."}
     * @ojvalue {string} "md" {"description": "Medium size, as determined by the theme, will be used for the gauge."}
     * @ojvalue {string} "lg" {"description": "Large size, as determined by the theme, will be used for the gauge."}
     * @ojvalue {string} "fit" {"description": "The size of the led will be determined based on application styling. If no explicit component size is specified, a default size will be used."}
     * @default "fit"
     */
    markerSize: 'fit',

    /**
     * The maximum value of the gauge.
     * @expose
     * @name max
     * @memberof oj.ojLedGauge
     * @instance
     * @type {number=}
     * @default 100
     */
    max: 100,

    /**
     * The minimum value of the gauge.
     * @expose
     * @name min
     * @memberof oj.ojLedGauge
     * @instance
     * @type {number=}
     * @default 0
     */
    min: 0,

    /**
     * The rotation angle for the gauge. Useful for changing the direction of triangle or arrow gauges.
     * @expose
     * @name rotation
     * @memberof oj.ojLedGauge
     * @instance
     * @type {number=}
     * @ojvalue {number} 90
     * @ojvalue {number} 180
     * @ojvalue {number} 270
     * @ojvalue {number} 0
     * @ojunits degrees
     * @default 0
     */
    rotation: 0,

    /**
     * Fraction of area to use. Values range from 0 to 1.
     * @expose
     * @name size
     * @memberof oj.ojLedGauge
     * @instance
     * @type {number=}
     * @default 1
     * @ojmin 0
     * @ojmax 1
     */
    size: 1,

    /**
     * The CSS style class to apply to the gauge. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
     * @expose
     * @name svgClassName
     * @memberof oj.ojLedGauge
     * @ojshortdesc The CSS style class to apply to the gauge. See the Help documentation for more information.
     * @instance
     * @type {string=}
     * @default ""
     */
    svgClassName: '',

    /**
     * The inline style to apply to the gauge. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
     * Only SVG CSS style properties are supported.
     * @expose
     * @name svgStyle
     * @memberof oj.ojLedGauge
     * @ojshortdesc The inline style to apply to the gauge. See the Help documentation for more information.
     * @instance
     * @type {Object=}
     * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
     * @default {}
     */
    svgStyle: {},

    /**
     * An array of objects with the following properties defining the thresholds for the gauge.
     * @expose
     * @name thresholds
     * @memberof oj.ojLedGauge
     * @ojshortdesc An array of objects specifying the gauge thresholds.
     * @instance
     * @type {(Array.<Object>)=}
     * @ojsignature {target: "Type", value: "Array<oj.ojLedGauge.Threshold>", jsdocOverride: true}
     * @default []
     */
    thresholds: [],

    /**
     *  An object containing an optional callback function for tooltip customization.
     * @expose
     * @name tooltip
     * @memberof oj.ojLedGauge
     * @instance
     * @type {Object=}
     */
    tooltip: {
      /**
       * A function that returns a custom tooltip. The function takes a tooltip context argument,
       * provided by the gauge, and should return an object that contains only one of the two properties:
       *  <ul>
       *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
       *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li>
       *  </ul>
       * @expose
       * @name tooltip.renderer
       * @ojshortdesc A function that returns a custom tooltip for a gauge. The function takes a context argument, provided by the gauge. See the Help documentation for more information.
       * @memberof! oj.ojLedGauge
       * @instance
       * @type {function(Object):Object|null}
       * @ojsignature {target: "Type", value: "((context: oj.ojLedGauge.TooltipContext) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
       * @default null
       */
      renderer: null
    },

    /**
     * The shape of the LED gauge. Can take the name of a built-in shape or the SVG path commands for a custom shape.
     * @expose
     * @name type
     * @memberof oj.ojLedGauge
     * @instance
     * @type {string=}
     * @ojvalue {string=} "arrow"
     * @ojvalue {string=} "diamond"
     * @ojvalue {string=} "square"
     * @ojvalue {string=} "rectangle"
     * @ojvalue {string=} "triangle"
     * @ojvalue {string=} "star"
     * @ojvalue {string=} "human"
     * @ojvalue {string=} "circle"
     * @default "circle"
     */
    type: 'circle',

    /**
     * The metric value.
     * @expose
     * @name value
     * @memberof oj.ojLedGauge
     * @instance
     * @type {number|null}
     * @ojwriteback
     * @ojeventgroup common
     */
    value: null,

    /**
     * Defines whether the theme specific visual effects such as overlays and gradients are applied to the gauge.
     * @expose
     * @name visualEffects
     * @memberof oj.ojLedGauge
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'Overlays and gradients are not supported in Redwood theme and are not recommended. As such, this attribute is deprecated.'}
     * @type {string=}
     * @ojvalue {string} "none"
     * @ojvalue {string} "auto"
     * @default "auto"
     */
    visualEffects: 'auto'
  },

  _CreateDvtComponent: function (context, callback, callbackObj) {
    this._focusable({ element: this.element, applyHighlight: true });
    return new LedGauge(context, callback, callbackObj);
  },

  _ConvertSubIdToLocator: function (subId) {
    var locator = {};

    if (subId === 'tooltip') {
      locator.subId = 'oj-ledgauge-tooltip';
    }
    return locator;
  },

  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-ledgauge');
    styleClasses.push(this._sizeClass);
    return styleClasses;
  },

  _GetSizeClass: function () {
    // class is added to elemet in _GetComponentStyleClasses
    return `oj-ledgauge-${this.options.markerSize}`;
  },

  _Render: function () {
    // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
    if (this.element.attr('title')) {
      this.options.shortDesc = this.element.attr('title');
      this.element.data(this.element, 'title', this.element.attr('title'));
      this.element.removeAttr('title');
    } else if (this.element.data('title')) {
      this.options.shortDesc = this.element.data('title');
    }

    // Call the super to render
    this._super();
  },

  /**
   * Returns the gauge's formatted metric label.
   * @return {string} The formatted metric label.
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojLedGauge
   */
  getMetricLabel: function () {
    var auto = this._component.getAutomation();
    return auto.getMetricLabel();
  }
});

/**
 * @ojcomponent oj.ojRatingGauge
 * @augments oj.dvtBaseGauge
 * @since 0.7.0
 *
 * @ojshortdesc A rating gauge displays information graphically, typically displaying or accepting user feedback on a product or service.
 * @ojrole img
 * @ojrole application
 *
 * @ojpropertylayout [ {propertyGroup: "common", items: ["selectedState.shape", "unselectedState.shape", "hoverState.shape", "changedState.shape", "style"]},
 *                     {propertyGroup: "data", items: ["value", "min", "max", "step"]} ]
 * @ojvbdefaultcolumns 4
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-gauge-rating'
 * @ojuxspecs ['gauge']
 *
 * @classdesc
 * <h3 id="ratingGaugeOverview-section">
 *   JET Rating Gauge
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ratingGaugeOverview-section"></a>
 * </h3>
 *
 * <p>Rating gauges are typically used to display or accept user feedback on a product
 * or service.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-rating-gauge
 *   value='4' >
 * &lt;/oj-rating-gauge>
 * </code>
 * </pre>
 * {@ojinclude "name":"a11y"}
 *
 * {@ojinclude "name":"migrationDoc"}
 *
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
const OJ_RATING_GUAGE_FIT = 'oj-rating-gauge-fit';
oj.__registerWidget('oj.ojRatingGauge', $.oj.dvtBaseGauge, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * Whether there has been a value entered by the user.
     * @expose
     * @name changed
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {boolean=}
     * @default false
     * @ojwriteback
     */
    changed: false,

    /**
     * The changed shape for the gauge. Displayed after the user has set a value, or when the changed attribute of the data object is set to true.
     * @expose
     * @name changedState
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {Object=}
     */
    changedState: {
      /**
       * The border color for changed state. Does not apply if a custom image is specified. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name changedState.borderColor
       * @memberof! oj.ojRatingGauge
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      borderColor: '',

      /**
       * The color for changed state. Does not apply if a custom image is specified. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name changedState.color
       * @ojshortdesc The color for changed state. Does not apply if a custom image is specified.
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The color for changed state. Does not apply if a custom image is specified. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       */
      color: '',

      /**
       * The shape to be used. Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
       * @expose
       * @name changedState.shape
       * @memberof! oj.ojRatingGauge
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {"circle"|"diamond"|"human"|"square"|"star"|"triangle"|string}
       * @ojsignature {target: "Type", value: "?"}
       * @default "star"
       */
      shape: 'star',

      /**
       * The URI of the custom image. If specified, it takes precedence over shape. For SVG images, the width and height must be defined on the SVG element as pixels.
       * @expose
       * @name changedState.source
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The URI of the custom image. If specified, it takes precedence over shape. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      source: '',

      /**
       * The CSS style class to apply to the changed state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
       * @expose
       * @name changedState.svgClassName
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The CSS style class to apply to the changed state. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      svgClassName: '',

      /**
       * The inline style to apply to the changed state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
       * Only SVG CSS style properties are supported.
       * @expose
       * @name changedState.svgStyle
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The inline style to apply to the changed state. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      svgStyle: {}
    },

    /**
     * The shape that displays on hover.
     * @expose
     * @name hoverState
     * @memberof oj.ojRatingGauge
     * @instance
     * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
     * @type {Object=}
     */
    hoverState: {
      /**
       * The border color for hover state. Does not apply if a custom image is specified. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name hoverState.borderColor
       * @memberof! oj.ojRatingGauge
       * @instance
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      borderColor: '',

      /**
       * The color for hover state. Does not apply if a custom image is specified. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name hoverState.color
       * @ojshortdesc The color for hover state. Does not apply if a custom image is specified.
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The color for hover state. Does not apply if a custom image is specified. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       */
      color: '',

      /**
       * The shape to be used. Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
       * @expose
       * @name hoverState.shape
       * @memberof! oj.ojRatingGauge
       * @instance
       * @type {"circle"|"diamond"|"human"|"square"|"star"|"triangle"|string}
       * @ojsignature {target: "Type", value: "?"}
       * @default "star"
       */
      shape: 'star',

      /**
       * The URI of the custom image. If specified, it takes precedence over shape. For SVG images, the width and height must be defined on the SVG element as pixels.
       * @expose
       * @name hoverState.source
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The URI of the custom image. If specified, it takes precedence over shape. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      source: '',

      /**
       * The CSS style class to apply to the hover state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
       * @expose
       * @name hoverState.svgClassName
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The CSS style class to apply to the hover state. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      svgClassName: '',

      /**
       * The inline style to apply to the hover state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
       * Only SVG CSS style properties are supported.
       * @expose
       * @name hoverState.svgStyle
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The inline style to apply to the hover state. See the Help documentation for more information.
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      svgStyle: {}
    },

    /**
     * It is used to establish a relationship between this component and another element.
     * A common use is to tie the oj-label and the oj-rating-gauge together for accessibility.
     * The oj-label custom element has an id, and you use the labelled-by attribute
     * to tie the two components together to facilitate correct screen reader behavior.
     * @expose
     * @name labelledBy
     * @memberof oj.ojRatingGauge
     * @ojshortdesc Establishes a relationship between this component and another element, typically an oj-label custom element. See the Help documentation for more information.
     * @type {(string|null)=}
     * @public
     * @instance
     * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
     * // getter
     * var labelId = myRatingGauge.labelledBy;
     *
     * // setter
     * myRatingGauge.labelledBy = "labelId";
     *
     */
    labelledBy: null,

    /**
     * It is used to establish a relationship between this component and another element.
     * Typically this is not used by the application developer, but by the oj-label custom element's
     * code. One use case is where the oj-label custom element code writes described-by
     * on its form component for accessibility reasons.
     * To facilitate correct screen reader behavior, the described-by attribute is
     * copied to the aria-describedby attribute on the component's dom element.
     * @expose
     * @name describedBy
     * @memberof oj.ojRatingGauge
     * @ojshortdesc Specifies a relationship between this component and another element.
     * @type {(string|null)=}
     * @public
     * @instance
     * @example <caption>Get or set the <code class="prettyprint">describedBy</code> property after initialization:</caption>
     * // getter
     * var descById = myRatingGauge.describedBy;
     *
     * // setter
     * myRatingGauge.describedBy = "someId";
     *
     */
    describedBy: null,

    /**
     * Integer value specifying the maximum value of the gauge, which determines the number of shapes or images that are displayed.
     * @expose
     * @name max
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {number=}
     * @default 5
     * @ojmin 0
     */
    max: 5,

    /**
     * The minimum value that can be set on the gauge by the end user. Does not affect the value set on the gauge by API.
     * @expose
     * @name min
     * @memberof oj.ojRatingGauge
     * @instance
     * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
     * @type {number=}
     * @default 0
     * @ojmin 0
     */
    min: 0,

    /**
     * Defines the type of rating gauge to be rendered.
     * @expose
     * @name orientation
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {string=}
     * @ojvalue {string} "vertical"
     * @ojvalue {string} "horizontal"
     * @default "horizontal"
     * @ojdeprecated {since: '9.0.0', description: 'Usage of vertical rating gauges is not recommended.'}
     */
    orientation: 'horizontal',

    /**
     * Specifies whether the images provided should show up at their defined aspect ratios. With 'none', the space is allocated evenly, and shapes could be stretched. With 'meet', The aspect ratio of the shape or image is taken into account when space is allocated. When aspect ratios conflict, the aspect ratio of the selectedState will be used.
     * @expose
     * @name preserveAspectRatio
     * @memberof oj.ojRatingGauge
     * @ojshortdesc Specifies whether the images provided should show up at their defined aspect ratios. See the Help documentation for more information.
     * @instance
     * @type {string=}
     * @ojvalue {string} "none"
     * @ojvalue {string} "meet"
     * @default "meet"
     */
    preserveAspectRatio: 'meet',

    /**
     * <p>The <code class="prettyprint">transientValue</code> is the read-only property for retrieving
     * the transient value from the rating gauge. It is triggered when hovering over the rating gauge.</p>
     *
     * <p>This is a read-only property so page authors cannot set or change it directly.</p>
     * @expose
     * @alias transientValue
     * @instance
     * @type {(number|null)=}
     * @memberof oj.ojRatingGauge
     * @ojshortdesc Read-only property used for retrieving the transient value from the component. See the Help documentation for more information.
     * @since 4.2.0
     *
     * @readonly
     * @ojwriteback
     */
    rawValue: null,

    /**
     * Defines whether the value of the gauge can be changed by the end user.
     * @expose
     * @name readonly
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {boolean=}
     * @default false
     */
    readonly: false,

    /**
     * Defines whether the gauge is disabled or not. User interaction is prevented if set to <code>true</code>. Visual indication will not be present when custom image source is used. Other state specific <code>svg-class-name</code> and <code>svg-style</code> will be overridden by disabled default style.
     * @expose
     * @name disabled
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {boolean=}
     * @default false
     */
    disabled: false,

    /** Specifies the size of the individual rating gauge shapes. Note that small, medium and large were deprecated in 12.0.0. Use sm, md and lg instead.
     * @expose
     * @name size
     * @memberof oj.ojRatingGauge
     * @ojshortdesc Specifies the size of the rating gauge item. See the Help documentation for more information.
     * @instance
     * @type {string=}
     * @ojvalue {string} "sm" {"description": "Small size, as determined by the theme, will be used for the rating gauge shapes. The component size will be computed to fit the individual shapes. Not recommended for editable gauges."}
     * @ojvalue {string} "md" {"description": "Medium size, as determined by the theme, will be used for the rating gauge shapes. The component size will be computed to fit the individual shapes. Not recommended for editable gauges."}
     * @ojvalue {string} "lg" {"description": "Large size, as determined by the theme, will be used for the rating gauge shapes. The component size will be computed to fit the individual shapes."}
     * @ojvalue {string} "fit" {"description": "The size of the individual rating gauge shapes will be determined based on the component size and the value of <code>max</code>. If no explicit component size is specified, a theme-specific default will be used."}
     * @ojvalue {string} "small" {"description": "Small size, as determined by the theme, will be used for the rating gauge shapes. Deprecated in 12.0.0. Use sm instead."}
     * @ojvalue {string} "medium" {"description": "Medium size, as determined by the theme, will be used for the rating gauge shapes. Deprecated in 12.0.0. Use md instead."}
     * @ojvalue {string} "large" {"description": "Large size, as determined by the theme, will be used for the rating gauge shapes. Deprecated in 12.0.0. Use lg instead."}
     * @ojdeprecated [{target:'propertyValue', for:"small", since: "12.0.0", description: "This value will be removed in the future. Please use sm."},
     *                {target:'propertyValue', for:"medium", since: "12.0.0", description: "This value will be removed in the future. Please use md."},
     *                {target:'propertyValue', for:"large", since: "12.0.0", description: "This value will be removed in the future. Please use lg."}]
     * @default "fit"
     */
    size: 'fit',

    /**
     * The selected shape for the gauge.
     * @expose
     * @name selectedState
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {Object=}
     */
    selectedState: {
      /**
       * The border color for selected state. Does not apply if a custom image is specified. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name selectedState.borderColor
       * @memberof! oj.ojRatingGauge
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      borderColor: '',

      /**
       * The color for selected state. Does not apply if a custom image is specified. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name selectedState.color
       * @ojshortdesc The color for selected state. Does not apply if a custom image is specified.
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The color for selected state. Does not apply if a custom image is specified. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       */
      color: '',

      /**
       * The shape to be used. Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
       * @expose
       * @name selectedState.shape
       * @memberof! oj.ojRatingGauge
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {"circle"|"diamond"|"human"|"square"|"star"|"triangle"|string}
       * @ojsignature {target: "Type", value: "?"}
       * @default "star"
       */
      shape: 'star',

      /**
       * The URI of the custom image. If specified, it takes precedence over shape. For SVG images, the width and height must be defined on the SVG element as pixels.
       * @expose
       * @name selectedState.source
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The URI of the custom image. If specified, it takes precedence over shape. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      source: '',

      /**
       * The CSS style class to apply to the selected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
       * @expose
       * @name selectedState.svgClassName
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The CSS style class to apply to the selected state. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      svgClassName: '',

      /**
       * The inline style to apply to the selected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
       * Only SVG CSS style properties are supported.
       * @expose
       * @name selectedState.svgStyle
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The inline style to apply to the selected state. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      svgStyle: {}
    },

    /**
     * Specifies the increment by which values can be specified by the end user.
     * @expose
     * @name step
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {number=}
     * @ojvalue {number=} 0.5
     * @ojvalue {number=} 1
     * @default 1
     */
    step: 1,

    /**
     * An array of objects with the following properties defining the thresholds for the gauge.
     * @expose
     * @name thresholds
     * @memberof oj.ojRatingGauge
     * @ojshortdesc An array of objects specifying the gauge thresholds.
     * @instance
     * @type {(Array.<Object>)=}
     * @ojsignature {target: "Type", value: "Array<oj.ojRatingGauge.Threshold>", jsdocOverride: true}
     * @default []
     */
    thresholds: [],

    /**
     * An object containing an optional callback function for tooltip customization.
     * @expose
     * @name tooltip
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {Object=}
     */
    tooltip: {
      /**
       * A function that returns a custom tooltip. The function takes a tooltip context argument,
       * provided by the gauge, and should return an object that contains only one of the two properties:
       *  <ul>
       *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
       *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li>
       *  </ul>
       * @expose
       * @name tooltip.renderer
       * @ojshortdesc A function that returns a custom tooltip for a gauge. The function takes a context argument, provided by the gauge. See the Help documentation for more information.
       * @memberof! oj.ojRatingGauge
       * @instance
       * @type {function(Object):Object|null}
       * @ojsignature {target: "Type", value: "((context: oj.ojRatingGauge.TooltipContext) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
       * @default null
       */
      renderer: null
    },

    /**
     * The unselected shape for the gauge.
     * @expose
     * @name unselectedState
     * @memberof oj.ojRatingGauge
     * @instance
     * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
     * @type {Object=}
     */
    unselectedState: {
      /**
       * The border color for unselected state. Does not apply if a custom image is specified. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name unselectedState.borderColor
       * @memberof! oj.ojRatingGauge
       * @instance
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      borderColor: '',

      /**
       * The color for unselected state. Does not apply if a custom image is specified. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name unselectedState.color
       * @ojshortdesc The color for unselected state. Does not apply if a custom image is specified.
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The color for unselected state. Does not apply if a custom image is specified. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       */
      color: '',

      /**
       * The shape to be used. Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
       * @expose
       * @name unselectedState.shape
       * @memberof! oj.ojRatingGauge
       * @instance
       * @type {"circle"|"diamond"|"human"|"square"|"star"|"triangle"|string}
       * @ojsignature {target: "Type", value: "?"}
       * @default "star"
       */
      shape: 'star',

      /**
       * The URI of the custom image. If specified, it takes precedence over shape. For SVG images, the width and height must be defined on the SVG element as pixels.
       * @expose
       * @name unselectedState.source
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The URI of the custom image. If specified, it takes precedence over shape. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      source: '',

      /**
       * The CSS style class to apply to the unselected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
       * @expose
       * @name unselectedState.svgClassName
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The CSS style class to apply to the unselected state. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      svgClassName: '',

      /**
       * The inline style to apply to the unselected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
       * Only SVG CSS style properties are supported.
       * @expose
       * @name unselectedState.svgStyle
       * @memberof! oj.ojRatingGauge
       * @ojshortdesc The inline style to apply to the unselected state. See the Help documentation for more information.
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      svgStyle: {}
    },

    /**
     * The value set on the gauge.
     * @expose
     * @name value
     * @memberof oj.ojRatingGauge
     * @instance
     * @type {number|null}
     * @ojwriteback
     * @ojmin 0
     * @ojeventgroup common
     */
    value: null,

    /**
     * Defines whether theme specific visual effects such as overlays and gradients are applied to the gauge.
     * @expose
     * @name visualEffects
     * @memberof oj.ojRatingGauge
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'Overlays and gradients are not supported in Redwood theme and are not recommended. As such, this attribute is deprecated.'}
     * @type {string=}
     * @ojvalue {string} "none"
     * @ojvalue {string} "auto"
     * @default "auto"
     */
    visualEffects: 'auto'
  },

  _CreateDvtComponent: function (context, callback, callbackObj) {
    this._focusable({ element: this.element, applyHighlight: true });
    return new RatingGauge(context, callback, callbackObj);
  },

  _ConvertSubIdToLocator: function (subId) {
    var locator = {};

    if (subId === 'tooltip') {
      locator.subId = 'oj-ratinggauge-tooltip';
    } else if (subId.indexOf('item') === 0) {
      locator.subId = 'oj-ratinggauge-item';
      locator.index = this._GetFirstIndex(subId);
    }
    return locator;
  },

  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-ratinggauge');
    if (this.options.size === 'fit') {
      styleClasses.push(OJ_RATING_GUAGE_FIT);
    }
    // TODO  Add style classes for rating gauge selected/hover/unselected/changed
    return styleClasses;
  },

  _GetChildStyleClasses: function () {
    var styleClasses = this._super();

    styleClasses['oj-rating-gauge-hover'] = [
      { path: 'hoverState/color', property: 'fill' },
      { path: 'hoverState/borderColor', property: 'stroke' }
    ];

    styleClasses[
      `oj-rating-gauge-selected ${this.options.readonly ? 'oj-rating-gauge-readonly' : ''}`
    ] = [
      { path: 'selectedState/color', property: 'fill' },
      { path: 'selectedState/borderColor', property: 'stroke' }
    ];

    styleClasses[
      `oj-rating-gauge-unselected ${this.options.readonly ? 'oj-rating-gauge-readonly' : ''}`
    ] = [
      { path: 'unselectedState/color', property: 'fill' },
      { path: 'unselectedState/borderColor', property: 'stroke' }
    ];

    styleClasses['oj-rating-gauge-changed'] = [
      { path: 'changedState/color', property: 'fill' },
      { path: 'changedState/borderColor', property: 'stroke' }
    ];

    styleClasses['oj-rating-gauge-shape-sm'] = {
      path: '_shapeSize/sm',
      property: 'width'
    };
    styleClasses['oj-rating-gauge-shape-md'] = {
      path: '_shapeSize/md',
      property: 'width'
    };

    styleClasses['oj-rating-gauge-shape-lg'] = {
      path: '_shapeSize/lg',
      property: 'width'
    };
    return styleClasses;
  },

  _Render: function () {
    // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
    if (this.element.attr('title')) {
      this.options.shortDesc = this.element.attr('title');
      this.element.data(this.element, 'title', this.element.attr('title'));
      this.element.removeAttr('title');
    } else if (this.element.data('title')) {
      this.options.shortDesc = this.element.data('title');
    }

    // Call the super to render
    this._super();
  },

  /**
   * @private
   */
  _SupportsOjLabel: function () {
    return this._IsCustomElement();
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojRatingGauge
   */
  _GetTranslationsSectionName: function () {
    return 'oj-ojRatingGauge';
  },

  _ProcessStyles: function (optionsCopy) {
    var options = optionsCopy;
    this._super(options);
    var aliasedSizeValues = { small: 'sm', medium: 'md', large: 'lg' };
    var size = aliasedSizeValues[options.size] || options.size;
    if (size !== 'fit') {
      var shapeDim = parseInt(options._shapeSize[size], 10);
      var isHoriz = options.orientation === 'horizontal';
      options._width = isHoriz ? shapeDim * options.max : shapeDim;
      options._height = isHoriz ? shapeDim : shapeDim * options.max;
      this._width = options._width;
      this._height = options._height;
    }
  },

  _ProcessOptions: function () {
    this._super();

    if (this.options.size === 'fit') {
      this.element.addClass(OJ_RATING_GUAGE_FIT);
    } else {
      this.element.removeClass(OJ_RATING_GUAGE_FIT);
    }
  },

  // eslint-disable-next-line no-unused-vars
  _UserOptionChange: function (key, value) {
    this._superApply(arguments);

    // If this was a value change, also update the changed value
    if (key === 'value') {
      this._UserOptionChange('changed', true);
    }
  }
});

/**
 * @ojcomponent oj.ojStatusMeterGauge
 * @augments oj.dvtBaseGauge
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 * @since 0.7.0
 *
 * @ojshortdesc A status meter gauge displays information graphically, highlighting a specific metric value's progress in relation to its thresholds.  Horizontal, vertical, and circular formats are supported.
 * @ojrole img
 * @ojrole application
 *
 * @ojpropertylayout [ {propertyGroup: "common", items: ["orientation", "metricLabel.rendered", "metricLabel.textType", "metricLabel.text", "thresholdDisplay",
 *                                                       "animationOnDataChange", "animationOnDisplay", "plotArea.rendered", "color", "style"]},
 *                     {propertyGroup: "data", items: ["value", "min", "max", "step", "thresholds", "referenceLines"]} ]
 * @ojvbdefaultcolumns 4
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-linear-status'
 * @ojuxspecs ['gauge']
 *
 * @classdesc
 * <h3 id="statusMeterGaugeOverview-section">
 *   JET Status Meter Gauge
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#statusMeterGaugeOverview-section"></a>
 * </h3>
 *
 * <p>Status meter gauges support horizontal and circular status meters.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-status-meter-gauge
 *   value='63'
 *   min='0'
 *   max='100'
 *   thresholds='[{"max": 33}, {"max": 67}, {}]'>
 * &lt;/oj-status-meter-gauge>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
 * {@ojinclude "name":"migrationDoc"}
 *
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojStatusMeterGauge', $.oj.dvtBaseGauge, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * Specifies the angle extent of a gauge with circular orientation. Value should be provided in degrees.
     * @expose
     * @name angleExtent
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {number=}
     * @default 360
     * @ojunits degrees
     * @ojmin 0
     * @ojmax 360
     */
    angleExtent: 360,

    /**
     * Defines the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     */
    animationOnDataChange: 'none',

    /**
     * Defines the animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     */
    animationOnDisplay: 'none',

    /**
     * The duration of the animations in milliseconds. The default value comes from the CSS and varies based on theme.
     * @expose
     * @name animationDuration
     * @ojshortdesc The duration of the animations in milliseconds.
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {number=}
     * @ojsignature {target: "Type", value: "?"}
     * @ojunits milliseconds
     * @ojmin 0
     */
    animationDuration: undefined,

    /**
     * The border color of the gauge. Only applies when thresholds are not defined. The default value varies based on theme.
     * @expose
     * @name borderColor
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
     * @type {string=}
     * @ojformat color
     */
    borderColor: '',

    /**
     * Defines the border radius of the indicator and plot area. When set to "auto", the border radius is set to a built-in default. Acceptable input follows CSS border-radius attribute specifications. The plot area border radius can be overwritten with the plotArea borderRadius atribute.
     * @expose
     * @name borderRadius
     * @memberof oj.ojStatusMeterGauge
     * @ojshortdesc Specifies the border radius of the indicator and plot area. See the Help documentation for more information.
     * @instance
     * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
     * @type {string=}
     * @default "auto"
     */
    borderRadius: 'auto',

    /**
     * An object defining the center content of a status meter with circular orientation.
     * @expose
     * @name center
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {Object=}
     */
    center: {
      /**
       * A function that returns custom center content. The function takes a center context argument,
       * provided by the gauge, and should return an object with the following property:
       * <ul>
       *   <li>insert: HTMLElement - HTML element, which will be overlaid on top of the gauge.
       *   This HTML element will block interactivity of the gauge by default, but the CSS pointer-events property
       *   can be set to 'none' on this element if the gauge's interactivity is desired.
       *   </li>
       * </ul>
       * @expose
       * @name center.renderer
       * @ojshortdesc A function that returns custom center content. The function takes a context argument, provided by the gauge. See the Help documentation for more information.
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {function(Object):Object|null}
       * @ojsignature {target: "Type", value: "((context: oj.ojStatusMeterGauge.CenterContext) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
       * @default null
       */
      renderer: null
    },

    /**
     * The color of the gauge. Only applies when thresholds are not defined. The default value varies based on theme.
     * @expose
     * @name color
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {string=}
     * @ojformat color
     */
    color: '#393737',

    /**
     * Defines the ratio of relative thickness of the indicator to the plot area.
     * @expose
     * @name indicatorSize
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {number=}
     * @default 1
     * @ojmin 0
     */
    indicatorSize: 1,

    /**
     * Specifies the inner radius of a gauge with circular orientation, defined by the distance from the center of the gauge to the innermost edge of the indicator and plot area. Valid values are a percent or ratio from 0 to 1.
     * @expose
     * @name innerRadius
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {number=}
     * @default .7
     * @ojmin 0
     * @ojmax 1
     */
    innerRadius: 0.7,

    /**
     * An object defining the label.
     * @expose
     * @name label
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'This attribute is deprecated. Use metric-label instead.'}
     * @type {Object=}
     */
    label: {
      /**
       * Defines the position of the label for horizontal and vertical gauges. The default position for horizontal gauges is 'start' and for vertical gauges is 'center'.
       * @expose
       * @name label.position
       * @memberof! oj.ojStatusMeterGauge
       * @ojshortdesc Specifies the label position for horizontal and vertical gauges. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "center"
       * @ojvalue {string} "start"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      position: 'auto',

      /**
       * The CSS style object defining the style of the label.
       * @expose
       * @name label.style
       * @ojshortdesc The CSS style object to apply to the label.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      style: {},

      /**
       * The text for the label.
       * @expose
       * @name label.text
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       * @ojtranslatable
       */
      text: ''
    },

    /**
     * It is used to establish a relationship between this component and another element.
     * A common use is to tie the oj-label and the oj-status-meter-gauge together for accessibility.
     * The oj-label custom element has an id, and you use the labelled-by attribute
     * to tie the two components together to facilitate correct screen reader behavior.
     * @expose
     * @name labelledBy
     * @ojshortdesc Establishes a relationship between this component and another element, typically an oj-label custom element. See the Help documentation for more information.
     * @memberof oj.ojStatusMeterGauge
     * @public
     * @instance
     * @type {(string|null)=}
     * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
     * // getter
     * var labelId = myStatusMeterGauge.labelledBy;
     *
     * // setter
     * myStatusMeterGauge.labelledBy = "labelId";
     *
     */
    labelledBy: null,

    /**
     * @expose
     * It is used to establish a relationship between this component and another element.
     * Typically this is not used by the application developer, but by the oj-label custom element's
     * code. One use case is where the oj-label custom element code writes described-by
     * on its form component for accessibility reasons.
     * To facilitate correct screen reader behavior, the described-by attribute is
     * copied to the aria-describedby attribute on the component's dom element.
     * @name describedBy
     * @ojshortdesc Specifies a relationship between this component and another element.
     * @memberof oj.ojStatusMeterGauge
     * @public
     * @instance
     * @type {(string|null)=}
     *
     * @example <caption>Get or set the <code class="prettyprint">describedBy</code> property after initialization:</caption>
     * // getter
     * var descById = myStatusMeterGauge.describedBy;
     *
     * // setter
     * myStatusMeterGauge.describedBy = "someId";
     *
     */
    describedBy: null,

    /**
     * The maximum value of the gauge.
     * @expose
     * @name max
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {number=}
     * @default 100
     */
    max: 100,

    /**
     * An object defining the value label.
     * @expose
     * @name metricLabel
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {Object=}
     */
    metricLabel: {
      /**
       * The converter used to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
       * @expose
       * @name metricLabel.converter
       * @memberof! oj.ojStatusMeterGauge
       * @ojshortdesc The converter used to format the labels. See the Help documentation for more information.
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?oj.Converter<string|number>"}
       * @default null
       */
      converter: null,

      /**
       * Defines the position of the metric label for horizontal and vertical gauges. The default position of the metric label is outside of the plot area. If the label is not rendered, then 'withLabel' will render the metric label outside the plot area. When the label is rendered, all positions are treated as 'withLabel' except 'auto' and 'outsidePlotArea' which render the metric label outside the plot area. When the metric label is rendered 'withLabel', the metric label is displayed with the same style as the label. The position in the 'withLabel' case is specified by the label position attribute.
       * @expose
       * @name metricLabel.position
       * @memberof! oj.ojStatusMeterGauge
       * @ojshortdesc Specifies the metric label position for horizontal and vertical gauges. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "center"
       * @ojvalue {string} "insideIndicatorEdge"
       * @ojvalue {string} "outsideIndicatorEdge"
       * @ojvalue {string} "outsidePlotArea"
       * @ojvalue {string} "withLabel"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      position: 'auto',

      /**
       * Defines if the label is rendered. If set to auto, the label is rendered if the orientation is circular.
       * @expose
       * @name metricLabel.rendered
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      rendered: 'auto',

      /**
       * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
       * @expose
       * @name metricLabel.scaling
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "none"
       * @ojvalue {string} "thousand"
       * @ojvalue {string} "million"
       * @ojvalue {string} "billion"
       * @ojvalue {string} "trillion"
       * @ojvalue {string} "quadrillion"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      scaling: 'auto',

      /**
       * The CSS style object defining the style of the label.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * @expose
       * @name metricLabel.style
       * @ojshortdesc The CSS style object to apply to the label.
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      style: {},

      /**
       * The text for the label. If specified, text will overwrite the numeric value that is displayed by default. The converter, scaling, and textType attributes are ignored when text is specified.
       * @expose
       * @name metricLabel.text
       * @memberof! oj.ojStatusMeterGauge
       * @ojshortdesc The text for the label. If specified, text will overwrite the numeric value that is displayed by default. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       * @ojtranslatable
       */
      text: '',

      /**
       * Defines whether the label is a number or a percentage of the total value.
       * @expose
       * @name metricLabel.textType
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "percent"
       * @ojvalue {string} "number"
       * @default "number"
       */
      textType: 'number'
    },

    /**
     * The minimum value of the gauge.
     * @expose
     * @name min
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {number=}
     * @default 0
     */
    min: 0,

    /**
     * Defines the type of status meter to be rendered.
     * @expose
     * @name orientation
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {string=}
     * @ojvalue {string} "circular"
     * @ojvalue {string} "vertical"
     * @ojvalue {string} "horizontal"
     * @default "horizontal"
     */
    orientation: 'horizontal',

    /** Specifies the size of the status meter gauge.
     * @expose
     * @name size
     * @memberof oj.ojStatusMeterGauge
     * @ojshortdesc Specifies the gauge size.
     * @instance
     * @type {string=}
     * @ojvalue {string} "sm" {"description": "Small size, as determined by the theme, will be used for the size of the gauge."}
     * @ojvalue {string} "md" {"description": "Medium size, as determined by the theme, will be used for the size of the gauge."}
     * @ojvalue {string} "lg" {"description": "Large size, as determined by the theme, will be used for the size of the gauge."}
     * @ojvalue {string} "fit" {"description": "The size of the gauge will be determined based on the application styling. If no explicit component size is specified, a default size will be used."}
     * @default "fit"
     */
    size: 'fit',

    /**
     * Plot Area for Status Meter Gauge
     * @expose
     * @name plotArea
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {Object=}
     */
    plotArea: {
      /**
       * The border color of the plot area.
       * @expose
       * @name plotArea.borderColor
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       */
      borderColor: undefined,

      /**
       * Defines the border radius of the plot area shape. When set to "auto", the border radius is the same as the top level border radius. Acceptable input follows CSS border-radius attribute specifications.
       * @expose
       * @name plotArea.borderRadius
       * @memberof! oj.ojStatusMeterGauge
       * @ojshortdesc Specifies the border radius of the plot area shape. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default "auto"
       */
      borderRadius: 'auto',

      /**
       * The color of the plot area.
       * @expose
       * @name plotArea.color
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       */
      color: undefined,

      /**
       * Defines if the plot area is to be rendered. If set to auto, the plot area is rendered if the orientation is circular or if the thresholdDisplay is not onIndicator.
       * @expose
       * @name plotArea.rendered
       * @memberof! oj.ojStatusMeterGauge
       * @ojshortdesc Specifies whether to render the plot area. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      rendered: 'auto',

      /**
       * The CSS style class to apply to the plot area. The style class and inline style will override any other styling specified through the properties.
       * @expose
       * @name plotArea.svgClassName
       * @memberof! oj.ojStatusMeterGauge
       * @ojshortdesc The CSS style class to apply to the plot area. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      svgClassName: '',

      /**
       * The inline style to apply to the plot area. The style class and inline style will override any other styling specified through the properties.
       * Only SVG CSS style properties are supported.
       * @expose
       * @name plotArea.svgStyle
       * @memberof! oj.ojStatusMeterGauge
       * @ojshortdesc The inline style to apply to the plot area. See the Help documentation for more information.
       * @instance
       * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      svgStyle: {}
    },

    /**
     * <p>The <code class="prettyprint">transientValue</code> is the read-only property for retrieving
     * the transient value from the status meter gauge. It is triggered when dragging over the status meter gauge.</p>
     *
     * <p>This is a read-only property so page authors cannot set or change it directly.</p>
     * @expose
     * @alias transientValue
     * @instance
     * @type {(number|null)=}
     * @memberof oj.ojStatusMeterGauge
     * @ojshortdesc Read-only property used for retrieving the transient value from the component. See the Help documentation for more information.
     * @since 4.2.0
     *
     * @readonly
     * @ojwriteback
     */
    rawValue: null,

    /**
     * Defines whether the value of the gauge can be changed by the end user.
     * @expose
     * @name readonly
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {boolean=}
     * @default false
     */
    readonly: false,

    /**
     * An array of objects with the following properties defining the reference lines for the gauge.
     * @expose
     * @name referenceLines
     * @memberof oj.ojStatusMeterGauge
     * @ojshortdesc An array of objects specifying the reference lines for the gauge.
     * @instance
     * @type {Array.<Object>=}
     * @ojsignature {target: "Type", value: "Array<oj.ojStatusMeterGauge.ReferenceLine>", jsdocOverride: true}
     * @default []
     */
    referenceLines: [],

    /**
     * Specifies the start angle of a gauge with circular orientation. Value should be provided in degrees.
     * @expose
     * @name startAngle
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {number=}
     * @default 90
     * @ojunits degrees
     * @ojmin 0
     * @ojmax 360
     */
    startAngle: 90,

    /**
     * Specifies the increment by which values can be changed by the end user when readonly is false. The step must be a positive value that is smaller than the difference between the min and max. If not specified, the default step is 1/100 if the difference between the min and max.
     * @expose
     * @name step
     * @memberof oj.ojStatusMeterGauge
     * @ojshortdesc Specifies the increment by which values can be changed by the end user. See the Help documentation for more information.
     * @instance
     * @type {(number|null)=}
     * @ojexclusivemin 0
     */
    step: null,

    /**
     * The CSS style class to apply to the gauge indicator. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
     * @expose
     * @name svgClassName
     * @memberof oj.ojStatusMeterGauge
     * @ojshortdesc The CSS style class to apply to the gauge indicator. See the Help documentation for more information.
     * @instance
     * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
     * @type {string=}
     * @default ""
     */
    svgClassName: '',

    /**
     * The inline style to apply to the gauge indicator. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
     * Only SVG CSS style properties are supported.
     * @expose
     * @name svgStyle
     * @memberof oj.ojStatusMeterGauge
     * @ojshortdesc The inline style to apply to the gauge indicator. See the Help documentation for more information.
     * @instance
     * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system.'}
     * @type {Object=}
     * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
     * @default {}
     */
    svgStyle: {},

    /**
     * An object containing an optional callback function for tooltip customization.
     * @expose
     * @name tooltip
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {Object=}
     */
    tooltip: {
      /**
       * A function that returns a custom tooltip. The function takes a tooltip context argument,
       * provided by the gauge, and should return an object that contains only one of the two properties:
       *  <ul>
       *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
       *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li>
       *  </ul>
       * @expose
       * @name tooltip.renderer
       * @ojshortdesc A function that returns a custom tooltip for a gauge. The function takes a context argument, provided by the gauge. See the Help documentation for more information.
       * @memberof! oj.ojStatusMeterGauge
       * @instance
       * @type {function(Object):Object|null}
       * @ojsignature {target: "Type", value: "((context: oj.ojStatusMeterGauge.TooltipContext) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
       * @default null
       */
      renderer: null
    },

    /**
     * Controls whether the current threshold is displayed on the indicator, in the plotArea, or if all the thresholds are displayed in the plot area.
     * @expose
     * @name thresholdDisplay
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {string=}
     * @ojvalue {string} "currentOnly"
     * @ojvalue {string} "all"
     * @ojvalue {string} "onIndicator"
     * @default "onIndicator"
     */
    thresholdDisplay: 'onIndicator',

    /**
     * An array of objects with the following properties defining the thresholds for the gauge.
     * @expose
     * @name thresholds
     * @memberof oj.ojStatusMeterGauge
     * @ojshortdesc An array of objects specifying the gauge thresholds.
     * @instance
     * @type {(Array.<Object>)=}
     * @ojsignature {target: "Type", value: "Array<oj.ojStatusMeterGauge.Threshold>", jsdocOverride: true}
     * @default []
     */
    thresholds: [],

    /**
     * The metric value.
     * @expose
     * @name value
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @type {number|null}
     * @ojwriteback
     * @ojeventgroup common
     */
    value: null,

    /**
     * Defines whether the theme specific visual effects such as overlays and gradients are applied to the gauge.
     * @expose
     * @name visualEffects
     * @memberof oj.ojStatusMeterGauge
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'Overlays and gradients are not supported in Redwood theme and are not recommended. As such, this attribute is deprecated.'}
     * @type {string=}
     * @ojvalue {string} "none"
     * @ojvalue {string} "auto"
     * @default "auto"
     */
    visualEffects: 'auto'
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojStatusMeterGauge
   */
  _GetTranslationsSectionName: function () {
    return 'oj-ojStatusMeterGauge';
  },

  _CreateDvtComponent: function (context, callback, callbackObj) {
    this._focusable({ element: this.element, applyHighlight: true });
    return new StatusMeterGauge(context, callback, callbackObj);
  },

  _ConvertSubIdToLocator: function (subId) {
    var locator = {};

    if (subId === 'tooltip') {
      locator.subId = 'oj-statusmetergauge-tooltip';
    }
    return locator;
  },

  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-statusmetergauge');
    styleClasses.push(this._sizeClass);
    return styleClasses;
  },

  _GetSizeClass: function () {
    // class is added to elemet in _GetComponentStyleClasses
    return `oj-statusmetergauge-${this.options.orientation}-${this.options.size}`;
  },

  _GetComponentRendererOptions: function () {
    return [
      { path: 'tooltip/renderer', slot: 'tooltipTemplate' },
      { path: 'center/renderer', slot: 'centerTemplate' }
    ];
  },

  /**
   * @private
   */
  _SupportsOjLabel: function () {
    return this._IsCustomElement();
  },

  _ProcessOptions: function () {
    this._super();
    var center = this.options.center;
    if (center && center._renderer) {
      center.renderer = this._GetTemplateRenderer(center._renderer, 'center');
    }
  },

  // @inheritdoc
  _GetChildStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-statusmetergauge'] = {
      path: 'animationDuration',
      property: 'ANIM_DUR'
    };
    styleClasses['oj-statusmeter-gauge-plotarea'] = [
      { path: 'plotArea/borderColor', property: 'border-color' },
      { path: 'plotArea/color', property: 'color' }
    ];
    return styleClasses;
  },

  _Render: function () {
    // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
    if (this.element.attr('title')) {
      this.options.shortDesc = this.element.attr('title');
      this.element.data(this.element, 'title', this.element.attr('title'));
      this.element.removeAttr('title');
    } else if (this.element.data('title')) {
      this.options.shortDesc = this.element.data('title');
    }

    // Call the super to render
    this._super();
  },

  /**
   * Returns the gauge's formatted metric label.
   * @return {string} The formatted metric label.
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojStatusMeterGauge
   */
  getMetricLabel: function () {
    var auto = this._component.getAutomation();
    return auto.getMetricLabel();
  }
});

/**
 * <p>This element has no touch interaction.  </p>
 *
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojLedGauge
 */

/**
 * <p>This element has no keyboard interaction.  </p>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojLedGauge
 */

// TYPEDEFS

/**
 * @typedef {Object} oj.ojLedGauge.Threshold
 * @property {string} [borderColor] The border color of the threshold.
 * @property {string} [color] The color of the threshold.
 * @property {number} [max] The upper bound of the threshold. This value is ignored for the final threshold, which uses the maximum value of the gauge.
 * @property {string} [shortDesc] Specific description for the threshold and overwrites the shortDesc specified on gauge. This is used for accessibility and also for customizing the tooltip text.
 */
/**
 * @typedef {Object} oj.ojLedGauge.TooltipContext
 * @property {string} color The indicator color of the gauge.
 * @property {Element} componentElement The LED gauge HTML element.
 * @property {string} label The computed metric label.
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the LED gauge tooltip.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @ojsubid
 * @member
 * @name oj-ledgauge-tooltip
 * @memberof oj.ojLedGauge
 * @instance
 *
 * @example <caption>Get the tooltip object of the gauge, if displayed:</caption>
 * var nodes = myLedGauge.getNodeBySubId({'subId': 'oj-ledgauge-tooltip'});
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content. The slot content must be a single &lt;template> element.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the gauge. (See [oj.ojLedGauge.TooltipContext]{@link oj.ojLedGauge.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojmaxitems 1
 * @ojtemplateslotprops oj.ojLedGauge.TooltipContext
 * @memberof oj.ojLedGauge
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 *
 * @example <caption>Initialize the LedGauge with a tooltip template specified:</caption>
 * &lt;oj-led-gauge>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span class="label">&lt;oj-bind-text value="[[$current.label]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-led-gauge>
 */
//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-led-gauge-css-set1
 * @ojdisplayname metricLabel
 * @ojstylevariable --oj-gauge-metric-label-font-weight {description: "Font weight for metric label.", formats: ["font_weight"], help: "oj-led-gauge-css-set1"}
 * @memberof oj.ojLedGauge
 */
/**
 * @ojstylevariableset oj-led-gauge-css-set2
 * @ojdisplayname markerSize
 * @ojstylevariable oj-led-gauge-sm-size {description: "Led gauge small size", formats: ["length"], help: "oj-led-gauge-css-set2"}
 * @ojstylevariable oj-led-gauge-md-size {description: "Led gauge medium size",formats: ["length"], help: "oj-led-gauge-css-set2"}
 * @ojstylevariable oj-led-gauge-lg-size {description: "Led gauge large size", formats: ["length"], help: "oj-led-gauge-css-set2"}
 * @memberof oj.ojLedGauge
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Value change when <code class="prettyprint">readonly</code> is <code class="prettyprint">false</code>.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojRatingGauge
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for populating the <i>title</i> attribute on the element with meaningful descriptors as the oj-rating-gauge element does not provide a default descriptor.
 * Since component terminology for keyboard and touch shortcuts can conflict with those of the application, it is the application's responsibility to provide these shortcuts, possibly via a help popup.</p>
 *
 * @ojfragment a11y
 * @memberof oj.ojRatingGauge
 */
/**
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 * To migrate from oj-rating-gauge to oj-c-rating-gauge, you need to revise the import statement and references to oj-rating-gauge in your app. Please note the changes between the two components below.
 * <h5>selected-state.color and changed-state.color attributes are no longer supported. </h5>
 * <p>
 * oj-c-rating-gauge will not support state attributes. Use the color API in oj-c-rating-gauge instead of selected-state.color. changed-state.color can be achived by using the changed and color API.
 * </p>
 * <h5>size attribute enums</h5>
 * <p>
 * size attribute will only support standard sm, md and lg enums and <i>fit</i> is no longer supported.
 * </p>
 * <h5>track-resize attribute</h5>
 * <p>track-resize attribute is no longer supported. Rating gauges now have fixed sizes. Since we are not supporting the 'fit' enum value for the 'size' api, we no longer need 'track-resize'. </p>
 * <h5>thresholds attribute</h5>
 * <p>For the initial release of the oj-c-rating-gauge, we are not supporting thresholds. We plan on supporting this use case in a future release.</p>
 * <h5>tooltip attribute and tooltipTemplate slot </h5>
 * <p> The support for this feature has been split into two attributes, tooltip and datatip. The datatip will be used for interactive gauges only and it will be a function that takes datatipDetail as argument.
 * Tooltip attribute, which will be a string instead of a function, will be used for readonly rating gauge.
 * </p>
 * @ojfragment migrationDoc
 * @memberof oj.ojRatingGauge
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
 *       <td><kbd>Enter</kbd></td>
 *       <td>Submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next element and submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase the gauge's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease the gauge's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease the gauge's transient value in left-to-right locales. Increase the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase the gauge's transient value in left-to-right locales. Decrease the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojRatingGauge
 */

// TYPEDEFS

/**
 * @typedef {Object} oj.ojRatingGauge.Threshold
 * @property {string} [borderColor] The border color of the threshold.
 * @property {string} [color] The color of the threshold.
 * @property {number} [max] The upper bound of the threshold. This value is ignored for the final threshold, which uses the maximum value of the gauge.
 * @property {string} [shortDesc] Specific description for the threshold and overwrites the shortDesc specified on gauge. This is used for accessibility and also for customizing the tooltip text.
 * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system', target: 'property', for: 'borderColor' }
 */
/**
 * @typedef {Object} oj.ojRatingGauge.TooltipContext
 * @property {string} color The indicator color of the gauge.
 * @property {Element} componentElement The rating gauge HTML element.
 * @property {string} label The computed metric label.
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 */

// DEPRECATED OPTIONS FOR WIDGET SYNTAX

/**
 * Defines whether the value of the gauge can be changed by the end user.
 * @ignore
 * @expose
 * @name readOnly
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {boolean}
 * @default true
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the rating guage tooltip.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @ojsubid
 * @member
 * @name oj-ratinggauge-tooltip
 * @memberof oj.ojRatingGauge
 * @instance
 *
 * @example <caption>Get the tooltip object of the gauge, if displayed:</caption>
 * var nodes = myRatingGauge.getNodeBySubId('subId': 'oj-ratinggauge-tooltip'});
 */

/**
 * <p>Sub-ID for a rating gauge item indexed by its position.</p>
 *
 * @property {number} index The index of the item within the gauge.
 *
 * @ojsubid oj-ratinggauge-item
 * @memberof oj.ojRatingGauge
 *
 * @example <caption>Get the first item from the rating gauge:</caption>
 * var nodes = myRatingGauge.getNodeBySubId('subId': 'oj-ratinggauge-item', index: 0});
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the gauge. (See [oj.ojRatingGauge.TooltipContext]{@link oj.ojRatingGauge.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojtemplateslotprops oj.ojRatingGauge.TooltipContext
 * @memberof oj.ojRatingGauge
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 *
 * @example <caption>Initialize the RatingGauge with a tooltip template specified:</caption>
 * &lt;oj-rating-gauge>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span class="label">&lt;oj-bind-text value="[[$current.label]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-rating-gauge>
 */
//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-rating-gauge-css-set1
 * @ojstylevariable oj-rating-gauge-sm-size {description: "Rating gauge small size", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-rating-gauge-md-size {description: "Rating gauge medium size",formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-rating-gauge-lg-size {description: "Rating gauge large size", formats: ["length"], help: "#css-variables"}
 * @memberof oj.ojRatingGauge
 */
/**
 * @ojstylevariableset oj-rating-gauge-css-set2
 * @ojdisplayname Hovered
 * @ojstylevariable oj-rating-gauge-border-color-hover {description: "Rating gauge border color when hovered", formats: ["color"], help: "#oj-rating-gauge-css-set2"}
 * @ojstylevariable oj-rating-gauge-color-hover {description: "Rating gauge color when hovered", formats: ["color"], help: "#oj-rating-gauge-css-set2"}
 * @memberof oj.ojRatingGauge
 */
/**
 * @ojstylevariableset oj-rating-gauge-css-set3
 * @ojdisplayname Unselected
 * @ojstylevariable oj-rating-gauge-border-color-unselected {description: "Rating gauge border color when unselected", formats: ["color"], help: "#oj-rating-gauge-css-set3"}
 * @ojstylevariable oj-rating-gauge-color-unselected {description: "Rating gauge color when unselected", formats: ["color"], help: "oj-rating-gauge-css-set3"}
 * @memberof oj.ojRatingGauge
 */
/**
 * @ojstylevariableset oj-rating-gauge-css-set4
 * @ojdisplayname Selected
 * @ojstylevariable oj-rating-gauge-border-color-selected {description: "Rating gauge border color when selected", formats: ["color"], help: "#oj-rating-gauge-css-set4"}
 * @ojstylevariable oj-rating-gauge-color-selected {description: "Rating gauge color when selected", formats: ["color"], help: "oj-rating-gauge-css-set4"}
 * @memberof oj.ojRatingGauge
 */
/**
 * @ojstylevariableset oj-rating-gauge-css-set5
 * @ojdisplayname Changed
 * @ojstylevariable oj-rating-gauge-border-color-changed {description: "Rating gauge border color when changed", formats: ["color"], help: "#oj-rating-gauge-css-set5"}
 * @ojstylevariable oj-rating-gauge-color-changed {description: "Rating gauge color when changed", formats: ["color"], help: "oj-rating-gauge-css-set5"}
 * @memberof oj.ojRatingGauge
 */
/**
 * @ojstylevariableset oj-rating-gauge-css-set6
 * @ojdisplayname Selected and disabled
 * @ojstylevariable oj-rating-gauge-color-selected-disabled {description: "Rating gauge color when selected and disabled", formats: ["color"], help: "oj-rating-gauge-css-set6"}
 * @memberof oj.ojRatingGauge
 */
/**
 * @ojstylevariableset oj-rating-gauge-css-set7
 * @ojdisplayname Unselected and disabled
 * @ojstylevariable oj-rating-gauge-color-unselected-disabled {description: "Rating gauge color when unselected and disabled", formats: ["color"], help: "oj-rating-gauge-css-set7"}
 * @memberof oj.ojRatingGauge
 */

/**
 * @ojstylevariableset oj-rating-gauge-css-set8
 * @ojdisplayname Selected and readonly
 * @ojstylevariable oj-rating-gauge-color-selected-readonly {description: "Rating gauge color when selected and readonly", formats: ["color"], help: "oj-rating-gauge-css-set8"}
 * @ojstylevariable oj-rating-gauge-border-color-selected-readonly {description: "Rating gauge border color when selected and readonly", formats: ["color"], help: "oj-rating-gauge-css-set8"}
 * @memberof oj.ojRatingGauge
 */
/**
 * @ojstylevariableset oj-rating-gauge-css-set9
 * @ojdisplayname Unselected and readonly
 * @ojstylevariable oj-rating-gauge-color-unselected-readonly {description: "Rating gauge color when unselected and readonly", formats: ["color"], help: "oj-rating-gauge-css-set9"}
 * @ojstylevariable oj-rating-gauge-border-color-unselected-readonly {description: "Rating gauge border color when unselected and readonly", formats: ["color"], help: "oj-rating-gauge-css-set9"}
 * @memberof oj.ojRatingGauge
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Value change when <code class="prettyprint">readonly</code> is <code class="prettyprint">false</code>.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojStatusMeterGauge
 */
/**
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 * To migrate from oj-status-meter-gauge to oj-c-meter-bar or oj-c-meter-circle, you need to revise the import statement and references to oj-status-meter-gauge in your app.
 * oj-c-meter-bar is analogous to oj-status-meter-gauge with “horizontal” and “vertical” orientation while oj-c-meter-circle is analogous to oj-status-meter-gauge with “circular” orientation.
 * <h5>orientation attribute </h5>
 * <p>
 * oj-c-meter-bar will only support "horizontal" and "vertical" enums while oj-c-meter circle will not include the orientation attribute.
 * </p>
 * <h5>center attribute </h5>
 * <p>
 * oj-c-meter-bar and oj-c-meter-circle will not support center attribute. However, oj-c-meter-circle will continue to support centerTemplate. Use this instead.
 * </p>
 * <h5>metric-label attribute </h5>
 * <p>
 * oj-c-meter-bar and oj-c-meter-circle will not support metric-label attribute. Applications will be responsible for providing label(s) outside the component.
 * </p>
 * <h5>reference-lines attribute </h5>
 * <p>
 * oj-c-meter-bar and oj-c-meter-circle will not support reference-lines[].line-width attributes in this release.
 * </p>
 * <h5>thresholds attribute </h5>
 * <p>
 *  thresholds[].shortDesc is replaced by thresholds[].accessibleLabel in oj-c-meter-bar and oj-c-meter-circle.
 * </p>
 * <h5>thresholds-display enums </h5>
 * <p>
 *  "currentOnly" and "onIndicator" enums are replaced by new , more intuitive and descriptive names. "currentOnly" will be "plotArea" and "onIndicator" will just be "indicator".
 * </p>
 * <h5>step attribute </h5>
 * <p>
 * The default step value for oj-c-meter-bar and oj-c-meter-circle is 1 which is different from oj-status-meter-gauge which is 1/100.
 * </p>
 * <h5>inner-radius attribute </h5>
 * <p>
 * oj-c-meter-circle's default inner radius value is dependent on the size API which is different from the 0.7 value in oj-status-meter-gauge.
 * </p>
 * <h5>plot-area attribute </h5>
 * <p>
 * The 'auto' enum for plot-area.rendered will not be supported. Use the 'on' or 'off' enum values instead. 'on' is the default value for oj-c-meter-bar and oj-c-meter-circle.
 * </p>
 * <h5>start-angle attribute </h5>
 * <p>
 *  start-angle will only be supported in oj-c-meter-circle and will not be included in oj-c-meter-bar.
 * </p>
 * <h5>angle-extent attribute </h5>
 * <p>
 *  angle extent will only be supported in oj-c-meter-circle and will not be included in oj-c-meter-bar.
 * </p>
 * <h5>size attribute enums</h5>
 * <p>
 * size attribute will only support standard sm, md and lg enums and <i>fit</i> is no longer supported.
 * </p>
 * <h5>track-resize attribute</h5>
 * <p>track-resize attribute is no longer supported. oj-c-meter-bar and oj-c-meter-circle now have fixed sizes. Since we are not supporting the 'fit' enum value for the 'size' api, we no longer need 'track-resize'. </p>
 * <h5>tooltip attribute and tooltipTemplate slot</h5>
 * <p> tooltip attribute and the tooltipTemplate slot are no longer supported. datatip attribute has been introduced to support this feature. The datatip attribute takes a function that provides datatipContext as argument.
 * </p>
 * @ojfragment migrationDoc
 * @memberof oj.ojStatusMeterGauge
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
 *       <td><kbd>Enter</kbd></td>
 *       <td>Submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next element and submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase the gauge's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease the gauge's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease the gauge's transient value in left-to-right locales. Increase the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase the gauge's transient value in left-to-right locales. Decrease the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojStatusMeterGauge
 */

// TYPEDEFS

/**
 * @typedef {Object} oj.ojStatusMeterGauge.ReferenceLine
 * @property {string} [color]  The color of the reference line.
 * @property {number} [value] The value of the reference line.
 * @property {number=} lineWidth=2  The width of the reference line.
 * @property {("dashed"|"dotted"|"solid")=} lineStyle="solid" The line style of the reference line.
 * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system', target: 'property', for: 'lineStyle' }
 */
/**
 * @typedef {Object} oj.ojStatusMeterGauge.Threshold
 * @property {string} [borderColor] The border color of the threshold.
 * @property {string} [color] The color of the threshold.
 * @property {number} [max] The upper bound of the threshold. This value is ignored for the final threshold, which uses the maximum value of the gauge.
 * @property {string} [shortDesc] Specific description for the threshold and overwrites the shortDesc specified on gauge. This is used for accessibility and also for customizing the tooltip text.
 * @ojdeprecated {since: '14.0.0', description: 'This is not recommended in the Redwood design system', target: 'property', for: 'borderColor' }
 */
/**
 * @typedef {Object} oj.ojStatusMeterGauge.TooltipContext
 * @property {string} color The indicator color of the gauge.
 * @property {Element} componentElement The status meter gauge HTML element.
 * @property {string} label The computed metric label.
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 */
/**
 * @typedef {Object} oj.ojStatusMeterGauge.CenterContext
 * @property {Element} componentElement The status meter gauge HTML element.
 * @property {oj.ojStatusMeterGauge.Bounds} innerBounds Object containing (x, y, width, height) of the rectangle inscribed in the center area. The inner bounds are useful for inserting content that is guaranteed to fit within the center area. If the angleExtent isn't 360 then we will provide the clipped square.
 * @property {string} metricLabel The computed metric label.
 * @property {oj.ojStatusMeterGauge.Bounds} outerBounds Object containing (x, y, width, height) of the rectangle circumscribing the center area. The outer bounds are useful for creating background for the entire center area when used with a CSS border-radius. If the angleExtent isn't 360 then we will provide the clipped square.
 */
/**
 * @typedef {Object} oj.ojStatusMeterGauge.Bounds
 * @property {number} x The x position of the bounding rectangle.
 * @property {number} y The y position of the bounding rectangle.
 * @property {number} width The width of the bounding rectangle.
 * @property {number} height The height of the bounding rectangle.
 */

// DEPRECATED OPTIONS FOR WIDGET SYNTAX

/**
 * Defines whether the value of the gauge can be changed by the end user.
 * @ignore
 * @expose
 * @name readOnly
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {boolean}
 * @default true
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the status meter guage tooltip.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @ojsubid
 * @member
 * @name oj-statusmetergauge-tooltip
 * @memberof oj.ojStatusMeterGauge
 * @instance
 *
 * @example <caption>Get the tooltip object of the gauge, if displayed:</caption>
 * var nodes = myStatusMeterGauge.getNodeBySubId({'subId': 'oj-statusmetergauge-tooltip'});
 */

// Slots ***********************************************************************

/**
 * <p>The <code class="prettyprint">centerTemplate</code> slot is used to specify custom center content
 * for a circular status meter gauge.  This slot takes precedence over the center.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the gauge center. (See [oj.ojStatusMeterGauge.CenterContext]{@link oj.ojStatusMeterGauge.CenterContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot centerTemplate
 * @ojtemplateslotprops oj.ojStatusMeterGauge.CenterContext
 * @memberof oj.ojStatusMeterGauge
 * @ojshortdesc The centerTemplate slot is used to specify custom center content for a circular status meter gauge. This slot takes precedence over the center.renderer property if specified. See the Help documentation for more information.
 *
 * @example <caption>Initialize the Status Meter Gauge with a center template specified:</caption>
 * &lt;oj-status-meter-gauge orientation="circular">
 *  &lt;template slot="centerTemplate">
 *    &lt;div :style="[[{position: 'absolute',
 *                       top: $current.innerBounds.y + 'px',
 *                       left: $current.innerBounds.x + 'px',
 *                       height: $current.innerBounds.height + 'px',
 *                       width: $current.innerBounds.width + 'px'}]]">
 *      &lt;span class="metric">&lt;oj-bind-text value="[[$current.metricLabel]]">&lt;/oj-bind-text>&lt;/span>
 *    &lt;/div>
 *  &lt;/template>
 * &lt;/oj-status-meter-gauge>
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the gauge. (See [oj.ojStatusMeterGauge.TooltipContext]{@link oj.ojStatusMeterGauge.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojtemplateslotprops oj.ojStatusMeterGauge.TooltipContext
 * @memberof oj.ojStatusMeterGauge
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 *
 * @example <caption>Initialize the StatusMeterGauge with a tooltip template specified:</caption>
 * &lt;oj-status-meter-gauge>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span class="label">&lt;oj-bind-text value="[[$current.label]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-status-meter-gauge>
 */

//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-status-meter-gauge-css-set1
 * @ojdisplayname metricLabel
 * @ojstylevariable --oj-gauge-metric-label-font-weight {description: "Font weight for metric label.", formats: ["font_weight"], help: "oj-status-meter-gauge-css-set1"}
 * @memberof oj.ojStatusMeterGauge
 */

/**
 * @ojstylevariableset oj-statusmeter-gauge-css-set2
 * @ojdisplayname Horizontal and Vertical Status Meter Gauge Size
 * @ojstylevariable oj-statusmeter-gauge-bar-sm-size {description: "Vertical and horizontal status meter gauge small size", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-statusmeter-gauge-bar-md-size {description: "Vertical and horizontal status meter gauge medium size",formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-statusmeter-gauge-bar-lg-size {description: "Vertical and horizontal status meter gauge large size", formats: ["length"], help: "#css-variables"}
 * @memberof oj.ojStatusMeterGauge
 */

/**
 * @ojstylevariableset oj-statusmeter-gauge-css-set2
 * @ojdisplayname Circular Status Meter Gauge Size
 * @ojstylevariable oj-statusmeter-gauge-circular-sm-size {description: "Circular status meter gauge small size", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-statusmeter-gauge-circular-md-size {description: "Circular status meter gauge medium size",formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-statusmeter-gauge-circular-lg-size {description: "Circular status meter gauge large size", formats: ["length"], help: "#css-variables"}
 * @memberof oj.ojStatusMeterGauge
 */

/**
 * @ojstylevariableset oj-statusmeter-gauge-css-set3
 * @ojdisplayname Plot Area
 * @ojstylevariable --oj-statusmeter-gauge-bar-plotarea-border-color {description: "Border color for plot area in vertical and horizontal status meter gauges.", formats: ["color"], help: "#css-variables"}
 * @ojstylevariable --oj-statusmeter-gauge-bar-plotarea-color {description: "Color for plot area in vertical and horizontal status meter gauges.", formats: ["color"], help: "#css-variables"}
 * @memberof oj.ojStatusMeterGauge
 */
