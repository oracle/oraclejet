/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojconfig', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 
'ojs/internal-deps/dvt/DvtToolkit', 'ojs/ojlocaledata', 'ojs/ojlogger', 'ojs/ojconverter-datetime', 'ojs/ojconverterutils-i18n', 'ojs/ojconverter-number'], 
function(oj, $, Config, comp, base, dvt, LocaleData, Logger, __DateTimeConverter, ConverterUtils, NumberConverter)
{
  "use strict";


/** This file is generated. Do not edit directly. Actual file located in 3rdparty/dvt/prebuild.**/

/* global LocaleData:false, Logger:false, Config:false, __DateTimeConverter:false, ConverterUtils:false, NumberConverter:false */

/**
 * @ojcomponent oj.dvtTimeComponent
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 * @abstract
 * @hideconstructor
 */
oj.__registerWidget('oj.dvtTimeComponent', $.oj.dvtBaseComponent, {
  /**
   * @override
   * @memberof oj.dvtTimeComponent
   * @protected
   */
  _ComponentCreate: function _ComponentCreate() {
    this._super();

    this._SetLocaleHelpers(NumberConverter, ConverterUtils);
  },
  //* * @inheritdoc */
  _GetEventTypes: function _GetEventTypes() {
    return ['optionChange', 'viewportChange'];
  },
  //* * @inheritdoc */
  _HandleEvent: function _HandleEvent(event) {
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
  _LoadResources: function _LoadResources() {
    // Ensure the resources object exists
    if (this.options._resources == null) {
      this.options._resources = {};
    } // Create default converters


    var secondsConverter = new __DateTimeConverter.IntlDateTimeConverter({
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
    var minutesConverter = new __DateTimeConverter.IntlDateTimeConverter({
      hour: 'numeric',
      minute: '2-digit'
    });
    var hoursConverter = new __DateTimeConverter.IntlDateTimeConverter({
      hour: 'numeric'
    });
    var daysConverter = new __DateTimeConverter.IntlDateTimeConverter({
      month: 'numeric',
      day: '2-digit'
    });
    var monthsConverter = new __DateTimeConverter.IntlDateTimeConverter({
      month: 'long'
    });
    var yearsConverter = new __DateTimeConverter.IntlDateTimeConverter({
      year: 'numeric'
    });
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
    var resources = this.options._resources;
    resources.converter = converter;
    resources.defaultDateTimeConverter = new __DateTimeConverter.IntlDateTimeConverter({
      formatType: 'datetime',
      dateFormat: 'medium',
      timeFormat: 'medium'
    }); // e.g. Jan 1, 2016, 5:53:39 PM

    resources.defaultDateConverter = new __DateTimeConverter.IntlDateTimeConverter({
      formatType: 'date',
      dateFormat: 'medium'
    }); // e.g. Jan 1, 2016
    // first day of week; locale specific

    resources.firstDayOfWeek = LocaleData.getFirstDayOfWeek();
  },
  //* * @inheritdoc */
  _ProcessTemplates: function _ProcessTemplates(dataProperty, data, templateEngine, isTreeData, parentKey, isRoot, updateChildren) {
    var results = isRoot ? this._TemplateHandler.getComponentResults(dataProperty) : null;

    if (!results) {
      var self = this;

      var seriesConfig = this._GetDataProviderSeriesConfig();

      var parentElement = this.element[0];

      var pathValues = this._super(dataProperty, data, templateEngine, isTreeData, parentKey, isRoot, updateChildren);

      if (seriesConfig && dataProperty === seriesConfig.dataProperty && !isTreeData) {
        var seriesArray = []; // The final series array

        var seriesObj; // derive series contexts for series templates, and populate barebones series array

        var seriesContexts = {};
        var seriesContext;
        var items = pathValues.values[0];
        var seriesIndex = 0;
        var defaultSingleSeries = seriesConfig.defaultSingleSeries;
        var idAttribute = seriesConfig.idAttribute;
        var itemsKey = seriesConfig.itemsKey;
        var i;

        for (i = 0; i < items.length; i++) {
          var seriesId;
          var itemObj = items[i];
          var itemContext = {
            data: itemObj._itemData,
            key: itemObj.id,
            index: i
          }; // For Timeline, if no series id specified, then group all items into a single series with no id
          // For Gantt, if no row id specified, then it's assumed to be one task per row; use task id as row id

          if (itemObj[idAttribute] != null) {
            seriesId = itemObj[idAttribute];
          } else if (defaultSingleSeries) {
            seriesId = '';
          } else {
            seriesId = itemObj.id;
          }

          if (!seriesContexts[seriesId]) {
            seriesContext = {
              componentElement: parentElement,
              id: seriesId,
              index: seriesIndex
            };
            seriesContext[itemsKey] = [itemContext];
            seriesContexts[seriesId] = seriesContext;
            seriesIndex += 1;
            seriesObj = {
              id: seriesId
            };
            seriesObj[itemsKey] = [itemObj];
            seriesArray.push(seriesObj);
          } else {
            seriesContexts[seriesId][itemsKey].push(itemContext);
            seriesArray[seriesContexts[seriesId].index][itemsKey].push(itemObj);
          }
        }

        var seriesTemplateName = seriesConfig.templateName;
        var seriesTemplateElementName = seriesConfig.templateElementName;

        var seriesTemplate = self._TemplateHandler.getTemplates()[seriesTemplateName]; // If provided, augment each series in the array with template evaluated properties


        if (seriesTemplate) {
          seriesTemplate = seriesTemplate[0];

          for (i = 0; i < seriesArray.length; i++) {
            seriesObj = seriesArray[i];
            seriesContext = seriesContexts[seriesObj.id];

            try {
              var resolvedSeriesObj = this._TemplateHandler.processNodeTemplate(dataProperty, templateEngine, seriesTemplate, seriesTemplateElementName, seriesContext, seriesObj.id);

              resolvedSeriesObj.id = seriesObj.id;
              resolvedSeriesObj[itemsKey] = seriesObj[itemsKey];
              seriesArray[i] = resolvedSeriesObj;
            } catch (error) {
              Logger.error(error);
            }
          }
        }

        results = {
          paths: pathValues.paths,
          values: [seriesArray]
        };
      } else {
        results = pathValues;
      }

      if (isRoot) {
        this._TemplateHandler.setComponentResults(dataProperty, results);
      }
    }

    return results;
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
  _GetDataProviderSeriesConfig: function _GetDataProviderSeriesConfig() {
    return {};
  }
});

});