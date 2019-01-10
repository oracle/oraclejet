/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojconfig', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtToolkit', 'ojs/ojlocaledata', 'ojs/ojlogger', 'ojs/ojvalidation-datetime'], 
  function(oj, $, Config, comp, base, dvt, LocaleData, Logger)
{

/** This file is generated. Do not edit directly. Actual file located in 3rdparty/dvt/prebuild.**/
/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global Promise:true, LocaleData:false, Logger:false, Config:false */

/**
 * @ojcomponent oj.dvtTimeComponent
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 * @abstract
 * @hideconstructor
 */
oj.__registerWidget('oj.dvtTimeComponent', $.oj.dvtBaseComponent,
  {
    //* * @inheritdoc */
    _GetEventTypes: function () {
      return ['optionChange', 'viewportChange'];
    },

    //* * @inheritdoc */
    _GetTranslationMap: function () {
      var ret = this._super();
      // Add full month strings
      var monthNames = LocaleData.getMonthNames('wide');
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
      var dayNames = LocaleData.getDayNames('wide');
      ret['DvtUtilBundle.DAY_SUNDAY'] = dayNames[0];
      ret['DvtUtilBundle.DAY_MONDAY'] = dayNames[1];
      ret['DvtUtilBundle.DAY_TUESDAY'] = dayNames[2];
      ret['DvtUtilBundle.DAY_WEDNESDAY'] = dayNames[3];
      ret['DvtUtilBundle.DAY_THURSDAY'] = dayNames[4];
      ret['DvtUtilBundle.DAY_FRIDAY'] = dayNames[5];
      ret['DvtUtilBundle.DAY_SATURDAY'] = dayNames[6];

      // Add abbreviated day strings
      var dayShortNames = LocaleData.getDayNames('abbreviated');
      ret['DvtUtilBundle.DAY_SHORT_SUNDAY'] = dayShortNames[0];
      ret['DvtUtilBundle.DAY_SHORT_MONDAY'] = dayShortNames[1];
      ret['DvtUtilBundle.DAY_SHORT_TUESDAY'] = dayShortNames[2];
      ret['DvtUtilBundle.DAY_SHORT_WEDNESDAY'] = dayShortNames[3];
      ret['DvtUtilBundle.DAY_SHORT_THURSDAY'] = dayShortNames[4];
      ret['DvtUtilBundle.DAY_SHORT_FRIDAY'] = dayShortNames[5];
      ret['DvtUtilBundle.DAY_SHORT_SATURDAY'] = dayShortNames[6];

      return ret;
    },

    //* * @inheritdoc */
    _HandleEvent: function (event) {
      var type = event.type;
      if (type === 'viewportChange') {
        var viewportStart = new Date(event.viewportStart).toISOString();
        var viewportEnd = new Date(event.viewportEnd).toISOString();
        var minorAxisScale = event.minorAxisScale;
        var viewportChangePayload = {
          viewportStart: viewportStart,
          viewportEnd: viewportEnd,
          minorAxisScale: minorAxisScale
        };

        this._UserOptionChange('viewportStart', viewportStart);
        this._UserOptionChange('viewportEnd', viewportEnd);
        this._UserOptionChange('minorAxis.scale', minorAxisScale);
        this._trigger('viewportChange', null, viewportChangePayload);
      } else {
        this._super(event);
      }
    },

    //* * @inheritdoc */
    _LoadResources: function () {
      // Ensure the resources object exists
      if (this.options._resources == null) {
        this.options._resources = {};
      }

      var resources = this.options._resources;

      // Add cursors
      resources.grabbingCursor =
        Config.getResourceUrl('resources/internal-deps/dvt/chart/hand-closed.cur');
      resources.grabCursor =
        Config.getResourceUrl('resources/internal-deps/dvt/chart/hand-open.cur');

      // Create default converters
      // access Validation through the oj namespace (for backward compatibility)
      // other code is using the return value of the ojvalidation-base module
      var converterFactory =
          oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
      var secondsConverter = converterFactory.createConverter({
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
      var minutesConverter = converterFactory.createConverter({
        hour: 'numeric',
        minute: '2-digit'
      });
      var hoursConverter = converterFactory.createConverter({ hour: 'numeric' });
      var daysConverter = converterFactory.createConverter({ month: 'numeric', day: '2-digit' });
      var monthsConverter = converterFactory.createConverter({ month: 'long' });
      var yearsConverter = converterFactory.createConverter({ year: 'numeric' });

      var converter = {
        seconds: secondsConverter,
        minutes: minutesConverter,
        hours: hoursConverter,
        days: daysConverter,
        weeks: daysConverter,
        months: monthsConverter,
        quarters: monthsConverter,
        years: yearsConverter
      };

      resources.converter = converter;
      resources.converterFactory = converterFactory;

      // first day of week; locale specific
      // leave this line use the access to LocaleData via the oj namespace (to check backward compatibilty)
      // other references to LocaleData are resolved through direct access of the return value of ojlocaledata module
      resources.firstDayOfWeek = oj.LocaleData.getFirstDayOfWeek();
    },

    //* * @inheritdoc */
    _ProcessTemplates: function (dataProperty, data, templateEngine) {
      var self = this;
      var seriesConfig = this._GetDataProviderSeriesConfig();
      var parentElement = this.element[0];
      var pathValues = this._super(dataProperty, data, templateEngine);
      if (seriesConfig && dataProperty === seriesConfig.dataProperty) {
        var seriesArray = []; // The final series array
        var seriesObj;

        // derive series contexts for series templates, and populate barebones series array
        var seriesContexts = {};
        var seriesContext;
        var items = pathValues.values[0];
        var seriesIndex = 0;
        var idAttribute = seriesConfig.idAttribute;
        var itemsKey = seriesConfig.itemsKey;
        var i;
        for (i = 0; i < items.length; i++) {
          var itemObj = items[i];
          var itemContext = {
            data: itemObj._itemData,
            key: itemObj.id,
            index: i,
            componentElement: parentElement
          };
          // For Timeline, series id is required and so is always available
          // For Gantt, if no row id specified, then it's assumed to be one task per row; use task id as row id
          var seriesId = itemObj[idAttribute] != null ? itemObj[idAttribute] : itemObj.id;
          if (!seriesContexts[seriesId]) {
            seriesContext = {
              componentElement: parentElement,
              id: seriesId,
              index: seriesIndex
            };
            seriesContext[itemsKey] = [itemContext];

            seriesContexts[seriesId] = seriesContext;
            seriesIndex += 1;

            seriesObj = { id: seriesId };
            seriesObj[itemsKey] = [itemObj];
            seriesArray.push(seriesObj);
          } else {
            seriesContexts[seriesId][itemsKey].push(itemContext);
            seriesArray[seriesContexts[seriesId].index][itemsKey].push(itemObj);
          }
        }

        var seriesTemplateName = seriesConfig.templateName;
        var seriesTemplateElementName = seriesConfig.templateElementName;
        var seriesTemplate = self.getTemplates()[seriesTemplateName];

        // If provided, augment each series in the array with template evaluated properties
        if (seriesTemplate) {
          var alias = self.options.as;
          var seriesTemplateTopProperties = self.getElementPropertyNames(seriesTemplateElementName);
          var seriesPropertyValidator = this.getPropertyValidator(seriesTemplate[0],
            seriesTemplateElementName);
          for (i = 0; i < seriesArray.length; i++) {
            seriesObj = seriesArray[i];
            seriesContext = seriesContexts[seriesObj.id];
            try {
              var resolvedSeriesObj = templateEngine.resolveProperties(parentElement,
                seriesTemplate[0], seriesTemplateElementName, seriesTemplateTopProperties,
                seriesContext, alias, seriesPropertyValidator);
              resolvedSeriesObj.id = seriesObj.id;
              resolvedSeriesObj[itemsKey] = seriesObj[itemsKey];
              seriesArray[i] = resolvedSeriesObj;
            } catch (error) {
              Logger.error(error);
            }
          }
        }

        return { paths: pathValues.paths, values: [seriesArray] };
      }
      return pathValues;
    },

    /**
     * Returns an object containing information to process dataProvider data into data representing items/tasks within series/rows.
     * The returned object should contain the following properties:
     * dataProperty (e.g. 'taskData' in Gantt, 'data' in Timeline)
     * idAttribute (e.g. 'rowId' in Gantt, 'seriesId' in Timeline)
     * itemsKey (e.g. 'tasks' in Gantt, 'items' in Timeline)
     * templateName (e.g. 'rowTemplate' in Gantt, 'seriesTemplate' in Timeline)
     * templateElementName (e.g. 'oj-gantt-row' in Gantt, 'oj-timeline-series' in Timeline)
     * @return {object} Object of shape {dataProperty: '', idAttribute: '', itemsKey: '', templateName: '', templateElementName: ''}
     * @protected
     * @instance
     * @memberof oj.dvtTimeComponent
     */
    _GetDataProviderSeriesConfig: function () {
      return {};
    }
  });

});