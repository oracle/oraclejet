/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojconfig', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtToolkit', 'ojs/ojlocaledata', 'ojs/ojlogger', 'ojs/ojvalidation-base', 'ojs/ojvalidation-datetime'], 
function(oj, $, Config, comp, base, dvt, LocaleData, Logger, __ValidationBase)
{
  "use strict";
/** This file is generated. Do not edit directly. Actual file located in 3rdparty/dvt/prebuild.**/
/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global LocaleData:false, Logger:false, Config:false, __ValidationBase:false */

/**
 * @ojcomponent oj.dvtTimeComponent
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 * @abstract
 * @hideconstructor
 */
oj.__registerWidget('oj.dvtTimeComponent', $.oj.dvtBaseComponent,
  {
    /**
     * @override
     * @memberof oj.dvtTimeComponent
     * @protected
     */
    _ComponentCreate: function () {
      this._super();
      this._SetLocaleHelpers(__ValidationBase);
    },
    //* * @inheritdoc */
    _GetEventTypes: function () {
      return ['optionChange', 'viewportChange'];
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
    _ProcessTemplates: function (dataProperty, data, templateEngine, isTreeData,
      parentKey, isRoot, updateChildren) {
      var results = isRoot ? this._TemplateHandler.getComponentResults(dataProperty) : null;
      if (!results) {
        var self = this;
        var seriesConfig = this._GetDataProviderSeriesConfig();
        var parentElement = this.element[0];
        var pathValues = this._super(dataProperty, data, templateEngine, isTreeData,
          parentKey, isRoot, updateChildren);
        if (seriesConfig && dataProperty === seriesConfig.dataProperty && !isTreeData) {
          var seriesArray = []; // The final series array
          var seriesObj;

          // derive series contexts for series templates, and populate barebones series array
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
            };

            // For Timeline, if no series id specified, then group all items into a single series with no id
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
          var seriesTemplate = self._TemplateHandler.getTemplates()[seriesTemplateName];

          // If provided, augment each series in the array with template evaluated properties
          if (seriesTemplate) {
            seriesTemplate = seriesTemplate[0];
            for (i = 0; i < seriesArray.length; i++) {
              seriesObj = seriesArray[i];
              seriesContext = seriesContexts[seriesObj.id];
              try {
                var resolvedSeriesObj = this._TemplateHandler.processNodeTemplate(dataProperty,
                  templateEngine, seriesTemplate, seriesTemplateElementName,
                  seriesContext, seriesObj.id);
                resolvedSeriesObj.id = seriesObj.id;
                resolvedSeriesObj[itemsKey] = seriesObj[itemsKey];
                seriesArray[i] = resolvedSeriesObj;
              } catch (error) {
                Logger.error(error);
              }
            }
          }

          results = { paths: pathValues.paths, values: [seriesArray] };
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
    _GetDataProviderSeriesConfig: function () {
      return {};
    }
  });

});