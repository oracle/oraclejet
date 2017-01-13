/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtTimeAxis'], function (oj, $, comp, base, dvt)
{
/**
 * @ojcomponent oj.ojTimeAxis
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 *
 * @classdesc
 * <h3 id="TimeAxisOverview-section">
 *   JET Time Axis Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#TimeAxisOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Time Axis is a themable, WAI-ARIA compliant component that displays a range of dates based on specified start and end date and time scale.  The Time Axis is intended to be placed in the header of ojDataGrid or ojTable.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojTimeAxis',
 *   scale: 'months',
 *   start: new Date("Jan 1, 2016").getTime(),
 *   end: new Date("Dec 31, 2016").getTime()
 * }"/>
 * </code>
 * </pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for supplying a meaningful <code class="prettyprint"><span class="pln">aria</span><span class="pun">-</span><span class="pln">label</span></code> to the component element.</p>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <p>The ojTimeAxis component is intended to be used inside of an ojTable or ojDataGrid component. All touch interactions are the same as those of the root components. See the <a href="oj.ojTable.html#touch-section">ojTable</a> and <a href="oj.ojDataGrid.html#touch-section">ojDataGrid</a> touch doc for more details.</p>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <p>The ojTimeAxis component is intended to be used inside of an ojTable or ojDataGrid component. All keyboard interactions are the same as those of the root components. See the <a href="oj.ojTable.html#keyboard-section">ojTable</a> and <a href="oj.ojDataGrid.html#keyboard-section">ojDataGrid</a> keyboard doc for more details.</p>
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Time Axis Span</h4>
 *
 * <p>It's recommended that applications limit the number of time intervals that are
 *    rendered by the Time Axis. For example, a Time Axis spanning one year with a scale
 *    of hours will display (365 * 24) 8,760 intervals. Rendering or rerendering this many intervals
 *    can cause severe performance degradation. Depending on the amount of space allocated,
 *    this many intervals can also cause visual clutteredness.
 *
 * @desc Creates a JET TimeAxis.
 * @example <caption>Initialize the time axis with some options:</caption>
 * $(".selector").ojTimeAxis({scale: 'weeks'});
 *
 * @example <caption>Initialize the time axis via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojTimeAxis'}">
 */
oj.__registerWidget('oj.ojTimeAxis', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix: "oj",

  //** @inheritdoc */
  _CreateDvtComponent: function(context, callback, callbackObj)
  {
    return dvt.TimeAxis.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-timeaxis');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetChildStyleClasses: function()
  {
    var styleClasses = this._super();
    styleClasses['oj-timeaxis-label'] = {'path': 'labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};

    return styleClasses;
  },

  //** @inheritdoc */
  _GetEventTypes : function() {
    return ['optionChange'];
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.TIMEAXIS'] = translations['componentName'];
    return ret;
  },

  //** @inheritdoc */
  _LoadResources: function()
  {
    // Ensure the resources object exists
    if (this.options['_resources'] == null)
      this.options['_resources'] = {};

    var resources = this.options['_resources'];

    // Create default converters
    var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
    var secondsConverter = converterFactory.createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'});
    var minutesConverter = converterFactory.createConverter({'hour': 'numeric', 'minute': '2-digit'});
    var hoursConverter = converterFactory.createConverter({'hour': 'numeric'});
    var daysConverter = converterFactory.createConverter({'month': 'numeric', 'day': '2-digit'});
    var monthsConverter = converterFactory.createConverter({'month': 'long'});
    var yearsConverter = converterFactory.createConverter({'year': 'numeric'});

    var monthsConverterVert = converterFactory.createConverter({'month': 'short'});
    var yearsConverterVert = converterFactory.createConverter({'year': '2-digit'});

    var converter = {
      'seconds': secondsConverter,
      'minutes': minutesConverter,
      'hours': hoursConverter,
      'days': daysConverter,
      'weeks': daysConverter,
      'months': monthsConverter,
      'quarters': monthsConverter,
      'years': yearsConverter
    };
    var converterVert = {
      'seconds': secondsConverter,
      'minutes': minutesConverter,
      'hours': hoursConverter,
      'days': daysConverter,
      'weeks': daysConverter,
      'months': monthsConverterVert,
      'quarters': monthsConverterVert,
      'years': yearsConverterVert
    };

    resources['converterFactory'] = converterFactory;
    resources['converter'] = converter;
    resources['converterVert'] = converterVert;

    // Class names to be set on appropriate svg elements
    resources['axisClass'] = 'oj-timeaxis-container';
    resources['axisLabelClass'] = 'oj-timeaxis-label';
    resources['axisSeparatorClass'] = 'oj-timeaxis-separator';

    // default disable all borders
    resources['borderTopVisible'] = false;
    resources['borderRightVisible'] = false;
    resources['borderBottomVisible'] = false;
    resources['borderLeftVisible'] = false;

    // first day of week; locale specific
    resources['firstDayOfWeek'] = oj.LocaleData.getFirstDayOfWeek();
  }
});
(function() {
var ojTimeAxisMeta = {
  "properties": {
    "converter": {
      "type": "object"
    },
    "end": {
      "type": "number"
    },
    "scale": {
      "type": "string"
    },
    "start": {
      "type": "number"
    }
  },
  "methods": {},
  "extension": {
    "_widgetName": "ojTimeAxis"
  }
};
oj.Components.registerMetadata('ojTimeAxis', 'dvtBaseComponent', ojTimeAxisMeta);
oj.Components.register('oj-time-axis', oj.Components.getMetadata('ojTimeAxis'));
})();
});
