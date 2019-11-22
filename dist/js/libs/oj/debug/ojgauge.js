/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojconfig', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 
'ojs/internal-deps/dvt/DvtGauge','ojs/ojlogger', 'ojs/ojconverterutils-i18n',
'ojs/ojconverter-number', 'ojs/ojvalidation-number'], 
function(oj, $, Config, comp, DvtAttributeUtils, dvt, Logger, ConverterUtils, NumberConverter)
{
  "use strict";
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
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
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
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
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
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};

/* global Logger:false, ConverterUtils:false, NumberConverter:false */

/**
 * @ojcomponent oj.dvtBaseGauge
 * @augments oj.dvtBaseComponent
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 * @since 0.7.0
 * @abstract
 */
oj.__registerWidget('oj.dvtBaseGauge', $.oj.dvtBaseComponent,
  {
    /**
     * @override
     * @memberof oj.dvtBaseGauge
     * @protected
     */
    _ComponentCreate: function () {
      this._super();
      this._SetLocaleHelpers(NumberConverter, ConverterUtils);
    },
    //* * @inheritdoc */
    _ProcessStyles: function () {
      // The superclass evaluates the style classes, including those in _GetChildStyleClasses
      this._super();

      // Transfer the threshold colors to the correct location
      this.options._thresholdColors = [
        this.options._threshold1,
        this.options._threshold2,
        this.options._threshold3
      ];
      this.options._threshold1 = null;
      this.options._threshold2 = null;
      this.options._threshold3 = null;
    },
    //* * @override */
    _AfterCreate: function () {
      this._super();
      var flags = {};
      flags._context = { writeback: true, internalSet: true, readOnly: true };
      this.option('rawValue', this.options.value, flags);
    },

    //* * @inheritdoc */
    _GetChildStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses['oj-gauge-metric-label'] = { path: 'metricLabel/style', property: 'TEXT' };
      styleClasses['oj-gauge-tick-label'] = { path: 'tickLabel/style', property: 'TEXT' };
      styleClasses['oj-gauge-threshold1'] = { path: '_threshold1', property: 'color' };
      styleClasses['oj-gauge-threshold2'] = { path: '_threshold2', property: 'color' };
      styleClasses['oj-gauge-threshold3'] = { path: '_threshold3', property: 'color' };
      return styleClasses;
    },

    //* * @inheritdoc */
    _GetEventTypes: function () {
      return ['input', 'optionChange'];
    },

    //* * @inheritdoc */
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
     * @override
     * @private
     */
    _setOption: function (key, value, flags) {
      if (key === 'rawValue') {
        // rawValue is a read-only option
        Logger.error("'rawValue' is a read-only option and cannot be set");
        return;
      }

      if (key === 'value') {
        var rawValueFlags = {};
        rawValueFlags._context = { writeback: true, internalSet: true, readOnly: true };
        this.option('rawValue', value, rawValueFlags);
      }

      this._super(key, value, flags);
    },

    //* * @inheritdoc */
    _ConvertLocatorToSubId: function (locator) {
      var subId = locator.subId;

      // Convert the supported locators
      if (subId === 'oj-dialgauge-tooltip'
          || subId === 'oj-ledgauge-tooltip'
          || subId === 'oj-ratinggauge-tooltip'
          || subId === 'oj-statusmetergauge-tooltip') {
        subId = 'tooltip';
      }
      if (subId === 'oj-ratinggauge-item' && locator.index != null) {
        subId = 'item[' + locator.index + ']';
      }

      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    }
  }, true);


/* global dvt:false, Config:false */

/**
 * @ojcomponent oj.ojDialGauge
 * @ignore
 * @augments oj.dvtBaseGauge
 * @since 0.7.0
 *
 * @classdesc
 * <h3 id="dialGaugeOverview-section">
 *   JET Dial Gauge Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dialGaugeOverview-section"></a>
 * </h3>
 *
 * <p>Dial gauge component for JET.  Dial gauges are used to display a metric value in relation to the minimum and
 * maximum possible values for that metric.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojDialGauge',
 *   value: 63, min: 0, max: 100,
 *   metricLabel: {rendered: 'on'}
 * }"/>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"rtl"}
 *
 * @desc Creates a JET Dial Gauge.
 * @example <caption>Initialize the Dial Gauge with no options specified:</caption>
 * $(".selector").ojDialGauge();
 *
 * @example <caption>Initialize the Dial Gauge with some options:</caption>
 * $(".selector").ojDialGauge({value: 63, min: 0, max: 100, metricLabel: {rendered: 'on'}});
 *
 * @example <caption>Initialize the Dial Gauge via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojDialGauge'}">
 */
oj.__registerWidget('oj.ojDialGauge', $.oj.dvtBaseGauge,
  {
    widgetEventPrefix: 'oj',
    options: {
    /**
     * <p>The <code class="prettyprint">rawValue</code> is the read-only option for retrieving
     * the transient value from the dial gauge.</p>
     *
     * <p>This is a read-only option so page authors cannot set or change it directly.</p>
     * @expose
     * @instance
     * @type {?number|undefined}
     * @memberof oj.ojDialGauge
     * @since 1.2
     * @readonly
     */
      rawValue: undefined
    },

    //* * @inheritdoc */
    _CreateDvtComponent: function (context, callback, callbackObj) {
      this._focusable({ element: this.element, applyHighlight: true });
      return dvt.DialGauge.newInstance(context, callback, callbackObj);
    },

    //* * @inheritdoc */
    _ConvertSubIdToLocator: function (subId) {
      var locator = {};

      if (subId === 'tooltip') {
        locator.subId = 'oj-dialgauge-tooltip';
      }
      return locator;
    },

    //* * @inheritdoc */
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-dialgauge');
      return styleClasses;
    },

    //* * @inheritdoc */
    _Render: function () {
      // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
      if (this.element.attr('title')) {
        this.options.shortDesc = this.element.attr('title');
        this.element.data(this.element, 'title', this.element.attr('title'));
        this.element.removeAttr('title');
      } else if (this.element.data('title')) {
        this.options.shortDesc = this.element.data('title');
      }

      // Set images for dial gauge
      this._setImages();

      // Call the super to render
      this._super();
    },

    /**
     * Applies image URLs to the options object passed into the dial gauge.
     * @private
     */
    _setImages: function () {
      // Pass the correct background image information set the default circleAlta and needleAlta.
      var backgroundImages = this.options.background;
      if (backgroundImages == null) {
        backgroundImages = 'circleAlta';
        this.options.background = 'circleAlta';
      }
      var indicatorImages = this.options.indicator;
      if (indicatorImages == null) {
        indicatorImages = 'needleAlta';
        this.options.indicator = 'needleAlta';
      }
      if (typeof backgroundImages === 'string') {
        var backgroundInfo = [
          { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-circle-200x200.png'),
            width: 200,
            height: 200 },
          { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-circle-400x400.png'),
            width: 400,
            height: 400 }
        ];
        if (backgroundImages === 'rectangleAlta') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-rectangle-200x200.png'),
              width: 200,
              height: 154 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-rectangle-400x400.png'),
              width: 400,
              height: 309 }];
        } else if (backgroundImages === 'domeAlta') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-dome-200x200.png'),
              width: 200,
              height: 154 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-dome-400x400.png'),
              width: 400,
              height: 309 }
          ];
        } else if (backgroundImages === 'circleAntique') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-circle-200x200.png'),
              width: 200,
              height: 200 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-circle-400x400.png'),
              width: 400,
              height: 400 }
          ];
        } else if (backgroundImages === 'rectangleAntique') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-rectangle-200x200.png'),
              width: 200,
              height: 168 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-rectangle-400x400.png'),
              width: 400,
              height: 335 }
          ];
        } else if (backgroundImages === 'domeAntique') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-dome-200x200.png'),
              width: 200,
              height: 176 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-dome-400x400.png'),
              width: 400,
              height: 352 }
          ];
        } else if (backgroundImages === 'circleLight') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-circle-200x200.png'),
              width: 200,
              height: 200 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-circle-400x400.png'),
              width: 400,
              height: 400 }
          ];
        } else if (backgroundImages === 'rectangleLight') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-rectangle-200x200.png'),
              width: 200,
              height: 154 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-rectangle-400x400.png'),
              width: 400,
              height: 307 }
          ];
        } else if (backgroundImages === 'domeLight') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-dome-200x200.png'),
              width: 200,
              height: 138 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-dome-400x400.png'),
              width: 400,
              height: 276 }
          ];
        } else if (backgroundImages === 'circleDark') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-circle-200x200.png'),
              width: 200,
              height: 200 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-circle-400x400.png'),
              width: 400,
              height: 400 }
          ];
        } else if (backgroundImages === 'rectangleDark') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-rectangle-200x200.png'),
              width: 200,
              height: 154 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-rectangle-400x400.png'),
              width: 400,
              height: 307 }
          ];
        } else if (backgroundImages === 'domeDark') {
          backgroundInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-dome-200x200.png'),
              width: 200,
              height: 138 },
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-dome-400x400.png'),
              width: 400,
              height: 276 }
          ];
        }
        this.options._backgroundImages = backgroundInfo;
      }
      if (typeof indicatorImages === 'string') {
        var indicatorInfo = [
          { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-needle-1600x1600.png'),
            width: 374,
            height: 575 }
        ];
        if (indicatorImages === 'needleAntique') {
          indicatorInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-needle-1600x1600.png'),
              width: 81,
              height: 734 }
          ];
        } else if (indicatorImages === 'needleDark') {
          indicatorInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-needle-1600x1600.png'),
              width: 454,
              height: 652 }
          ];
        } else if (indicatorImages === 'needleLight') {
          indicatorInfo = [
            { src: Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-needle-1600x1600.png'),
              width: 454,
              height: 652 }
          ];
        }
        this.options._indicatorImages = indicatorInfo;
      }
    },

    /**
     * Returns the gauge's metric label.
     * @return {Object} The metric label object
     * @expose
     * @instance
     * @memberof oj.ojDialGauge
     */
    getMetricLabel: function () {
      var auto = this._component.getAutomation();
      return auto.getMetricLabel();
    }
  });



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
 *       <td>Value change when <code class="prettyprint">readOnly</code> is <code class="prettyprint">false</code>.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojDialGauge
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
 *       <td>Move focus to next component and submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase rawValue. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease rawValue. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease rawValue in left-to-right locales. Increase rawValue in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase rawValue in left-to-right locales. Decrease rawValue in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojDialGauge
 */

/**
 * The metric value.
 * @expose
 * @name value
 * @memberof oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The minimum value of the gauge.
 * @expose
 * @name min
 * @memberof oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0</code>
 */
/**
 * The maximum value of the gauge.
 * @expose
 * @name max
 * @memberof oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">100</code>
 */
/**
 *  An object containing an optional callback function for tooltip customization.
 * @expose
 * @name tooltip
 * @memberof oj.ojDialGauge
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  A function that returns a custom tooltip. The function takes a dataContext argument, provided by the gauge, with the following properties: <ul> <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li> <li>label: The computed metric label.</li> <li>component: The widget constructor for the gauge. The 'component' is bound to the associated jQuery element so can be called directly as a function.</li> </ul> The function may return an HTML element, which will be appended to the tooltip, or a tooltip string.
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {function(Object)}
 * @default null
 */
/**
 * An object or string defining the background specification for the gauge. Acceptable string options are: circleAlta, domeAlta, rectangleAlta, circleLight, domeLight, rectangleLight, circleDark, domeDark, rectangleDark, circleAntique, domeAntique, rectangleAntique
 * @expose
 * @name background
 * @memberof oj.ojDialGauge
 * @instance
 * @type {object|string}
 * @default null
 */
/**
 * An array of objects with the following properties, used to the define the image for the background. Multiple versions of the same image to be specified for different resolutions and for right to left locales, and the first image with enough detail for the requested resolution will be used.
 * @expose
 * @name background.images
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {Array.<Object>}
 * @default null
 */
/**
 * The URI specifying the location of the image resource.
 * @expose
 * @name background.images[].src
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of this image resource. The size of the first image is considered the reference size, upon which the anchor and other coordinates are based.
 * @expose
 * @name background.images[].width
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The height of this image resource. The size of the first image is considered the reference size, upon which the anchor and other coordinates are based.
 * @expose
 * @name background.images[].height
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * Specifies the text direction for which this image is used.
 * @expose
 * @name background.images[].dir
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "rtl"
 * @ojvalue {string} "ltr"
 * @default <code class="prettyprint">"ltr"</code>
 */
/**
 * The x coordinate of the indicator anchor point. Defaults to the center of the background.
 * @expose
 * @name background.anchorX
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The y coordinate of the indicator anchor point. Defaults to the center of the background.
 * @expose
 * @name background.anchorY
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The start angle of the dial in degrees.
 * @expose
 * @name background.startAngle
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">180</code>
 */
/**
 * The angular extent of the dial in degrees.
 * @expose
 * @name background.angleExtent
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">180</code>
 */
/**
 * The distance from the anchor to the center of the tick labels.
 * @expose
 * @name background.radius
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The height bound for the tick labels.
 * @expose
 * @name background.tickLabelHeight
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The width bound for the tick labels.
 * @expose
 * @name background.tickLabelWidth
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The number of ticks that have labels. By default, no ticks are drawn.
 * @expose
 * @name background.majorTickCount
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0</code>
 */
/**
 * An object defining the bounds of the metric label. By default, the metric label is centered within the gauge.
 * @expose
 * @name background.metricLabelBounds
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The x coordinate of the bounding box.
 * @expose
 * @name background.metricLabelBounds.x
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The y coordinate of the bounding box.
 * @expose
 * @name background.metricLabelBounds.y
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The width of the bounding box.
 * @expose
 * @name background.metricLabelBounds.width
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The height of the bounding box.
 * @expose
 * @name background.metricLabelBounds.height
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The length of the indicator as a fraction of the background radius. Valid values are between 0 and 1.
 * @expose
 * @name background.indicatorLength
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0.7</code>
 */
/**
 * An object or string defining the indicator specification for the gauge. Acceptable string options are: needleAlta, needleLight, needleDark, needleAntique
 * @expose
 * @name indicator
 * @memberof oj.ojDialGauge
 * @instance
 * @type {object|string}
 * @default null
 */
/**
 * An array of objects with the following properties, used to the define the image for the indicator. Multiple versions of the same image to be specified for different resolutions, and the first image with enough detail for the requested resolution will be used.
 * @expose
 * @name indicator.images
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {Array.<Object>}
 * @default null
 */
/**
 * The URI specifying the location of the image resource. The image must be provided with the indicator at 90 degrees (pointing up).
 * @expose
 * @name indicator.images[].src
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of this image resource. The size of the first image is considered the reference size, upon which the anchor and other coordinates are based.
 * @expose
 * @name indicator.images[].width
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The height of this image resource. The size of the first image is considered the reference size, upon which the anchor and other coordinates are based.
 * @expose
 * @name indicator.images[].height
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The x coordinate of the indicator anchor point. Defaults to the center of the indicator.
 * @expose
 * @name indicator.anchorX
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The y coordinate of the indicator anchor point. Defaults to the bottom of the indicator.
 * @expose
 * @name indicator.anchorY
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * An object defining the value label.
 * @expose
 * @name metricLabel
 * @memberof oj.ojDialGauge
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style string defining the style of the label.
 * @expose
 * @name metricLabel.style
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines if the label is rendered.
 * @expose
 * @name metricLabel.rendered
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name metricLabel.scaling
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "thousand"
 * @ojvalue {string} "million"
 * @ojvalue {string} "billion"
 * @ojvalue {string} "trillion"
 * @ojvalue {string} "quadrillion"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The converter used to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name metricLabel.converter
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * An object defining the dial tick labels.
 * @expose
 * @name tickLabel
 * @memberof oj.ojDialGauge
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style string defining the style of the label.
 * @expose
 * @name tickLabel.style
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Define the label to be displayed as number or as a percentage of the total value.
 * @expose
 * @name tickLabel.textType
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "percent"
 * @ojvalue {string} "number"
 * @default <code class="prettyprint">"number"</code>
 */
/**
 * Defines if the label is rendered.
 * @expose
 * @name tickLabel.rendered
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name tickLabel.scaling
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "thousand"
 * @ojvalue {string} "million"
 * @ojvalue {string} "billion"
 * @ojvalue {string} "trillion"
 * @ojvalue {string} "quadrillion"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The converter used to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name tickLabel.converter
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The duration of the animations, in milliseconds. Also accepts CSS strings such as 1s and 1000ms.
 * @expose
 * @ignore
 * @name animationDuration
 * @memberof oj.ojDialGauge
 * @instance
 * @type {number}
 * @default null
 */
/**
 * Defines the animation that is applied on data changes.
 * @expose
 * @name animationOnDataChange
 * @memberof oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * Defines the animation that is shown on initial display.
 * @expose
 * @name animationOnDisplay
 * @memberof oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * Defines whether the value of the gauge can be changed by the end user.
 * @expose
 * @name readOnly
 * @memberof oj.ojDialGauge
 * @instance
 * @type {boolean}
 * @default <code class="prettyprint">true</code>
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the dial guage tooltip.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @ojsubid
 * @member
 * @name oj-dialgauge-tooltip
 * @memberof oj.ojDialGauge
 * @instance
 *
 * @example <caption>Get the tooltip object of the gauge, if displayed:</caption>
 * var nodes = $( ".selector" ).ojDialGauge( "getNodeBySubId", {'subId': 'oj-dialgauge-tooltip'} );
 */

/**
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul>
 *    <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li>
 *    <li>label: The computed metric label.</li>
 *    <li>component: The widget constructor for the gauge. The 'component' is bound to the associated jQuery element so can be called directly as a function.</li>
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string|null}
 * @default null
 */


/* global dvt:false */

/**
 * @ojcomponent oj.ojLedGauge
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
oj.__registerWidget('oj.ojLedGauge', $.oj.dvtBaseGauge,
  {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * The border color of the gauge. Only applies when thresholds are not defined. The default value varies based on theme.
       * @expose
       * @name borderColor
       * @memberof oj.ojLedGauge
       * @instance
       * @type {string}
       * @ojformat color
       */
      borderColor: '',

      /**
       * The color of the gauge. Only applies when thresholds are not defined. The default value varies based on theme.
       * @expose
       * @name color
       * @memberof oj.ojLedGauge
       * @instance
       * @type {string}
       * @ojformat color
       */
      color: '#393737',

      /**
       * An object defining the label.
       * @expose
       * @name label
       * @memberof oj.ojLedGauge
       * @instance
       * @type {Object}
       */
      label: {
        /**
         * The CSS style object defining the style of the label.
         * @expose
         * @name label.style
         * @memberof! oj.ojLedGauge
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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
       * @type {Object}
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
         * @expose
         * @name metricLabel.style
         * @memberof! oj.ojLedGauge
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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

      /**
       * The maximum value of the gauge.
       * @expose
       * @name max
       * @memberof oj.ojLedGauge
       * @instance
       * @type {number}
       * @default 100
       */
      max: 100,

      /**
       * The minimum value of the gauge.
       * @expose
       * @name min
       * @memberof oj.ojLedGauge
       * @instance
       * @type {number}
       * @default 0
       */
      min: 0,

      /**
       * The rotation angle for the gauge. Useful for changing the direction of triangle or arrow gauges.
       * @expose
       * @name rotation
       * @memberof oj.ojLedGauge
       * @instance
       * @type {number}
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
       * @type {number}
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
       * @type {string}
       * @default ""
       */
      svgClassName: '',

      /**
       * The inline style to apply to the gauge. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
       * @expose
       * @name svgStyle
       * @memberof oj.ojLedGauge
       * @ojshortdesc The inline style to apply to the gauge. See the Help documentation for more information.
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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
       * @type {Array.<Object>}
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
       * @type {Object}
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
       * @type {string}
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
       * Defines whether visual effects such as overlays are applied to the gauge.
       * @expose
       * @name visualEffects
       * @memberof oj.ojLedGauge
       * @instance
       * @type {string}
       * @ojvalue {string} "none"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      visualEffects: 'auto'
    },

    //* * @inheritdoc */
    _CreateDvtComponent: function (context, callback, callbackObj) {
      this._focusable({ element: this.element, applyHighlight: true });
      return dvt.LedGauge.newInstance(context, callback, callbackObj);
    },

    //* * @inheritdoc */
    _ConvertSubIdToLocator: function (subId) {
      var locator = {};

      if (subId === 'tooltip') {
        locator.subId = 'oj-ledgauge-tooltip';
      }
      return locator;
    },

    //* * @inheritdoc */
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-ledgauge');
      return styleClasses;
    },

    //* * @inheritdoc */
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
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the gauge. (See [oj.ojLedGauge.TooltipContext]{@link oj.ojLedGauge.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojslotitemprops oj.ojLedGauge.TooltipContext
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


/* global dvt:false */

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
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
oj.__registerWidget('oj.ojRatingGauge', $.oj.dvtBaseGauge,
  {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * Whether there has been a value entered by the user.
       * @expose
       * @name changed
       * @memberof oj.ojRatingGauge
       * @instance
       * @type {boolean}
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
       * @type {Object}
       */
      changedState: {
        /**
         * The border color for changed state. Does not apply if a custom image is specified.
         * @expose
         * @name changedState.borderColor
         * @memberof! oj.ojRatingGauge
         * @instance
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
        color: '#ED2C02',

        /**
         * The shape to be used. Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
         * @expose
         * @name changedState.shape
         * @memberof! oj.ojRatingGauge
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?'circle'|'diamond'|'human'|'square'|'star'|'triangle'|string", jsdocOverride: true}
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
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',

        /**
         * The inline style to apply to the changed state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
         * @expose
         * @name changedState.svgStyle
         * @memberof! oj.ojRatingGauge
         * @ojshortdesc The inline style to apply to the changed state. See the Help documentation for more information.
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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
       * @type {Object}
       */
      hoverState: {
        /**
         * The border color for hover state. Does not apply if a custom image is specified.
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
        color: '#007CC8',

        /**
         * The shape to be used. Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
         * @expose
         * @name hoverState.shape
         * @memberof! oj.ojRatingGauge
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?'circle'|'diamond'|'human'|'square'|'star'|'triangle'|string", jsdocOverride: true}
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
         * @expose
         * @name hoverState.svgStyle
         * @memberof! oj.ojRatingGauge
         * @ojshortdesc The inline style to apply to the hover state. See the Help documentation for more information.
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         * @default {}
         */
        svgStyle: {}
      },

      /**
       * Integer value specifying the maximum value of the gauge, which determines the number of shapes or images that are displayed.
       * @expose
       * @name max
       * @memberof oj.ojRatingGauge
       * @instance
       * @type {number}
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
       * @type {number}
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
       * @type {string}
       * @ojvalue {string} "vertical"
       * @ojvalue {string} "horizontal"
       * @default "horizontal"
       */
      orientation: 'horizontal',

      /**
       * Specifies whether the images provided should show up at their defined aspect ratios. With 'none', the space is allocated evenly, and shapes could be stretched. With 'meet', The aspect ratio of the shape or image is taken into account when space is allocated. When aspect ratios conflict, the aspect ratio of the selectedState will be used.
       * @expose
       * @name preserveAspectRatio
       * @memberof oj.ojRatingGauge
       * @ojshortdesc Specifies whether the images provided should show up at their defined aspect ratios. See the Help documentation for more information.
       * @instance
       * @type {string}
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
       * @type {number|null}
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
       * @type {boolean}
       * @default false
       */
      readonly: false,

      /**
       * The selected shape for the gauge.
       * @expose
       * @name selectedState
       * @memberof oj.ojRatingGauge
       * @instance
       * @type {Object}
       */
      selectedState: {
        /**
         * The border color for selected state. Does not apply if a custom image is specified.
         * @expose
         * @name selectedState.borderColor
         * @memberof! oj.ojRatingGauge
         * @instance
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
        color: '#F8C15A',

        /**
         * The shape to be used. Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
         * @expose
         * @name selectedState.shape
         * @memberof! oj.ojRatingGauge
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?'circle'|'diamond'|'human'|'square'|'star'|'triangle'|string", jsdocOverride: true}
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
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',

        /**
         * The inline style to apply to the selected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
         * @expose
         * @name selectedState.svgStyle
         * @memberof! oj.ojRatingGauge
         * @ojshortdesc The inline style to apply to the selected state. See the Help documentation for more information.
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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
       * @type {number}
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
       * @type {Array.<Object>}
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
       * @type {Object}
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
       * @type {Object}
       */
      unselectedState: {
        /**
         * The border color for unselected state. Does not apply if a custom image is specified.
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
        color: '#C4CED7',

        /**
         * The shape to be used. Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
         * @expose
         * @name unselectedState.shape
         * @memberof! oj.ojRatingGauge
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?'circle'|'diamond'|'human'|'square'|'star'|'triangle'|string", jsdocOverride: true}
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
         * @expose
         * @name unselectedState.svgStyle
         * @memberof! oj.ojRatingGauge
         * @ojshortdesc The inline style to apply to the unselected state. See the Help documentation for more information.
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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
       * Defines whether visual effects such as overlays are applied to the gauge.
       * @expose
       * @name visualEffects
       * @memberof oj.ojRatingGauge
       * @instance
       * @type {string}
       * @ojvalue {string} "none"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      visualEffects: 'auto'
    },

    //* * @inheritdoc */
    _CreateDvtComponent: function (context, callback, callbackObj) {
      this._focusable({ element: this.element, applyHighlight: true });
      return dvt.RatingGauge.newInstance(context, callback, callbackObj);
    },

    //* * @inheritdoc */
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

    //* * @inheritdoc */
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-ratinggauge');
      // TODO  Add style classes for rating gauge selected/hover/unselected/changed
      return styleClasses;
    },

  //* * @inheritdoc */
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

    //* * @inheritdoc */
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
 * @ojslotitemprops oj.ojRatingGauge.TooltipContext
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


/* global dvt:false */

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
oj.__registerWidget('oj.ojStatusMeterGauge', $.oj.dvtBaseGauge,
  {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * Specifies the angle extent of a gauge with circular orientation. Value should be provided in degrees.
       * @expose
       * @name angleExtent
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {number}
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
       * @type {string}
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
       * @type {string}
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
       * @type {number}
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
       * @type {string}
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
       * @type {string}
       * @default "auto"
       */
      borderRadius: 'auto',

      /**
       * An object defining the center content of a status meter with circular orientation.
       * @expose
       * @name center
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {Object}
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
       * @type {string}
       * @ojformat color
       */
      color: '#393737',

      /**
       * Defines the ratio of relative thickness of the indicator to the plot area.
       * @expose
       * @name indicatorSize
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {number}
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
       * @type {number}
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
       * @type {Object}
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
         * @memberof! oj.ojStatusMeterGauge
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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
       * The maximum value of the gauge.
       * @expose
       * @name max
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {number}
       * @default 100
       */
      max: 100,

      /**
       * An object defining the value label.
       * @expose
       * @name metricLabel
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {Object}
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
         * @ojsignature {target: "Type", value: "?oj.Converter<string>"}
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
         * @expose
         * @name metricLabel.style
         * @memberof! oj.ojStatusMeterGauge
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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
       * @type {number}
       * @default 0
       */
      min: 0,

      /**
       * Defines the type of status meter to be rendered.
       * @expose
       * @name orientation
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {string}
       * @ojvalue {string} "circular"
       * @ojvalue {string} "vertical"
       * @ojvalue {string} "horizontal"
       * @default "horizontal"
       */
      orientation: 'horizontal',

      /**
       * Plot Area for Status Meter Gauge
       * @expose
       * @name plotArea
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {Object}
       */
      plotArea: {
        /**
         * The border color of the plot area.
         * @expose
         * @name plotArea.borderColor
         * @memberof! oj.ojStatusMeterGauge
         * @instance
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
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default "auto"
         */
        borderRadius: 'auto',

        /**
         * The color of the plot area. Only applies when useThresholdFillColor is off.
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
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',

        /**
         * The inline style to apply to the plot area. The style class and inline style will override any other styling specified through the properties.
         * @expose
         * @name plotArea.svgStyle
         * @memberof! oj.ojStatusMeterGauge
         * @ojshortdesc The inline style to apply to the plot area. See the Help documentation for more information.
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
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
       * @type {number|null}
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
       * @type {boolean}
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
       * @type {Array.<Object>}
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
       * @type {number}
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
       * @type {number|null}
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
       * @type {string}
       * @default ""
       */
      svgClassName: '',

      /**
       * The inline style to apply to the gauge indicator. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
       * @expose
       * @name svgStyle
       * @memberof oj.ojStatusMeterGauge
       * @ojshortdesc The inline style to apply to the gauge indicator. See the Help documentation for more information.
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
       * @default {}
       */
      svgStyle: {},

      /**
       * An object containing an optional callback function for tooltip customization.
       * @expose
       * @name tooltip
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {Object}
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
       * @type {string}
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
       * @type {Array.<Object>}
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
       * Defines whether visual effects such as overlays are applied to the gauge.
       * @expose
       * @name visualEffects
       * @memberof oj.ojStatusMeterGauge
       * @instance
       * @type {string}
       * @ojvalue {string} "none"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      visualEffects: 'auto'
    },

    //* * @inheritdoc */
    _CreateDvtComponent: function (context, callback, callbackObj) {
      this._focusable({ element: this.element, applyHighlight: true });
      return dvt.StatusMeterGauge.newInstance(context, callback, callbackObj);
    },

    //* * @inheritdoc */
    _ConvertSubIdToLocator: function (subId) {
      var locator = {};

      if (subId === 'tooltip') {
        locator.subId = 'oj-statusmetergauge-tooltip';
      }
      return locator;
    },

    //* * @inheritdoc */
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-statusmetergauge');
      return styleClasses;
    },

    //* * @inheritdoc */
    _GetComponentRendererOptions: function () {
      return [{ path: 'tooltip/renderer', slot: 'tooltipTemplate' },
              { path: 'center/renderer', slot: 'centerTemplate' }];
    },

    //* * @inheritdoc */
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
      styleClasses['oj-dvtbase oj-statusmetergauge'] = { path: 'animationDuration', property: 'ANIM_DUR' };
      return styleClasses;
    },

    //* * @inheritdoc */
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
 */
/**
 * @typedef {Object} oj.ojStatusMeterGauge.Threshold
 * @property {string} [borderColor] The border color of the threshold.
 * @property {string} [color] The color of the threshold.
 * @property {number} [max] The upper bound of the threshold. This value is ignored for the final threshold, which uses the maximum value of the gauge.
 * @property {string} [shortDesc] Specific description for the threshold and overwrites the shortDesc specified on gauge. This is used for accessibility and also for customizing the tooltip text.
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
 * @ojslotitemprops oj.ojStatusMeterGauge.TooltipContext
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
 * @ojslotitemprops oj.ojStatusMeterGauge.CenterContext
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
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */

/* global __oj_led_gauge_metadata:false */
/* global DvtAttributeUtils */
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
}());

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
        throw new Error('Found: ' + value + '. Expected: '
                        + _RATING_GAUGE_SHAPE_ENUMS.toString());
      } else if (name === 'unselected-state.shape' && !_UNSELECTED_RATING_GAUGE_SHAPE_ENUMS[name]) {
        throw new Error('Found: ' + value + '. Expected: '
                        + _UNSELECTED_RATING_GAUGE_SHAPE_ENUMS.toString());
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
}());

/* global __oj_status_meter_gauge_metadata:false */
(function () {
  __oj_status_meter_gauge_metadata.extension._WIDGET_NAME = 'ojStatusMeterGauge';
  __oj_status_meter_gauge_metadata.extension._ALIASED_PROPS = { transientValue: 'rawValue' };
  oj.CustomElementBridge.register('oj-status-meter-gauge', { metadata: __oj_status_meter_gauge_metadata });
}());

});