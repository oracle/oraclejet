/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtToolkit'], function(oj, $, comp, base, dvt)
{

/**This file is generated. Do not edit directly. Actual file located in 3rdparty/dvt/prebuild.**/

/**
 * @ojcomponent oj.dvtTimeComponent
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 * @abstract
 */
oj.__registerWidget('oj.dvtTimeComponent', $['oj']['dvtBaseComponent'],
{
  //** @inheritdoc */
  _GetEventTypes : function() 
  {
    return ['optionChange', 'viewportChange'];
  },

  //** @inheritdoc */
  _GetTranslationMap: function() 
  {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    var ret = this._super();
    // Add full month strings
    var monthNames = oj.LocaleData.getMonthNames("wide");
    ret['DvtUtilBundle.MONTH_JANUARY'] = monthNames[0];
    ret['DvtUtilBundle.MONTH_FEBRUARY'] = monthNames[1];
    ret['DvtUtilBundle.MONTH_MARCH'] = monthNames[2];
    ret['DvtUtilBundle.MONTH_APRIL'] = monthNames[3];
    ret['DvtUtilBundle.MONTH_MAY'] = monthNames[4];
    ret['DvtUtilBundle.MONTH_JUNE'] = monthNames[5];
    ret['DvtUtilBundle.MONTH_JULY'] = monthNames[6];
    ret['DvtUtilBundle.MONTH_AUGUST'] = monthNames[7];
    ret['DvtUtilBundle.MONTH_SEPTEMBER'] = monthNames[8];
    ret['DvtUtilBundle.MONTH_OCTOBER'] = monthNames[9];
    ret['DvtUtilBundle.MONTH_NOVEMBER'] = monthNames[10];
    ret['DvtUtilBundle.MONTH_DECEMBER'] = monthNames[11];

    // Add full day strings
    var dayNames = oj.LocaleData.getDayNames("wide");
    ret['DvtUtilBundle.DAY_SUNDAY'] = dayNames[0];
    ret['DvtUtilBundle.DAY_MONDAY'] = dayNames[1];
    ret['DvtUtilBundle.DAY_TUESDAY'] = dayNames[2];
    ret['DvtUtilBundle.DAY_WEDNESDAY'] = dayNames[3];
    ret['DvtUtilBundle.DAY_THURSDAY'] = dayNames[4];
    ret['DvtUtilBundle.DAY_FRIDAY'] = dayNames[5];
    ret['DvtUtilBundle.DAY_SATURDAY'] = dayNames[6];

    // Add abbreviated day strings
    var dayShortNames = oj.LocaleData.getDayNames("abbreviated");
    ret['DvtUtilBundle.DAY_SHORT_SUNDAY'] = dayShortNames[0];
    ret['DvtUtilBundle.DAY_SHORT_MONDAY'] = dayShortNames[1];
    ret['DvtUtilBundle.DAY_SHORT_TUESDAY'] = dayShortNames[2];
    ret['DvtUtilBundle.DAY_SHORT_WEDNESDAY'] = dayShortNames[3];
    ret['DvtUtilBundle.DAY_SHORT_THURSDAY'] = dayShortNames[4];
    ret['DvtUtilBundle.DAY_SHORT_FRIDAY'] = dayShortNames[5];
    ret['DvtUtilBundle.DAY_SHORT_SATURDAY'] = dayShortNames[6];

    return ret;
  },

  //** @inheritdoc */
  _HandleEvent: function(event)
  {
    var type = event['type'];
    if(type === 'viewportChange')
    {
      var viewportStart = new Date(event['viewportStart']).toISOString();
      var viewportEnd = new Date(event['viewportEnd']).toISOString();
      var minorAxisScale = event['minorAxisScale'];
      var viewportChangePayload = {
        'viewportStart': viewportStart,
        'viewportEnd': viewportEnd,
        'minorAxisScale': minorAxisScale
      };

      this._UserOptionChange('viewportStart', viewportStart);
      this._UserOptionChange('viewportEnd', viewportEnd);
      this._UserOptionChange('minorAxis.scale', minorAxisScale);
      this._trigger('viewportChange', null, viewportChangePayload);
    }
    else
    {
      this._super(event);
    }
  },

  //** @inheritdoc */
  _LoadResources: function()
  {
    // Ensure the resources object exists
    if (this.options['_resources'] == null)
      this.options['_resources'] = {};

    var resources = this.options['_resources'];

    // Create default converters
    var converterFactory = oj.Validation.converterFactory("datetime");
    var secondsConverter = converterFactory.createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'});
    var minutesConverter = converterFactory.createConverter({'hour': 'numeric', 'minute': '2-digit'});
    var hoursConverter = converterFactory.createConverter({'hour': 'numeric'});
    var daysConverter = converterFactory.createConverter({'month': 'numeric', 'day': '2-digit'});
    var monthsConverter = converterFactory.createConverter({'month': 'long'});
    var yearsConverter = converterFactory.createConverter({'year': 'numeric'});

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

    resources['converter'] = converter;
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.dvtTimeComponent
   */
  getContextByNode: function(node)
  {
    // context objects are documented with @ojnodecontext
    return this.getSubIdByNode(node);
  }
});

(function() {
var dvtTimeComponentMeta = {
  "properties": {},
  "methods": {
    "getContextByNode": {}
  },
  "extension": {
    "_widgetName": "dvtTimeComponent"
  }
};
oj.Components.registerMetadata('dvtTimeComponent', 'dvtBaseComponent', dvtTimeComponentMeta);
})();
});
