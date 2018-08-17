/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtToolkit', 'ojs/ojvalidation-datetime'], function(oj, $, comp, base, dvt)
{

/**This file is generated. Do not edit directly. Actual file located in 3rdparty/dvt/prebuild.**/
/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global Promise:true */

/**
 * @ojcomponent oj.dvtTimeComponent
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 * @ojtsimport ojtimeaxis
 * @abstract
 * @hideconstructor
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

    // Add cursors
    resources['grabbingCursor'] = oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/hand-closed.cur');
    resources['grabCursor'] = oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/hand-open.cur');

    // Create default converters
    var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
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
    resources['converterFactory'] = converterFactory;

    // first day of week; locale specific
    resources['firstDayOfWeek'] = oj.LocaleData.getFirstDayOfWeek();
  },

  //* * @inheritdoc */
  _ProcessTemplates: function (dataProperty, data, templateEngine) {
    var self = this;
    var seriesConfig = this._GetDataProviderSeriesConfig();
    var parentElement = this.element[0];
    return this._super(dataProperty, data, templateEngine).then(function (pathValues) {
      if (seriesConfig && dataProperty === seriesConfig.dataProperty) {
        var seriesArray = []; // The final series array
        var seriesObj;

        // derive series contexts for series templates, and populate barebones series array
        var seriesContexts = {};
        var seriesContext;
        var items = pathValues.values[0];
        var seriesIndex = 0;
        var i;
        var j;
        for (i = 0; i < items.length; i++) {
          var itemObj = items[i];
          var itemContext = {
            data: itemObj._itemData,
            key: itemObj.id,
            index: i,
            componentElement: parentElement
          };
          var idAttribute = seriesConfig.idAttribute;
          var itemsKey = seriesConfig.itemsKey;
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
        var seriesArrayPromise = Promise.resolve(seriesArray);

        var seriesTemplateName = seriesConfig.templateName;
        var seriesTemplateElementName = seriesConfig.templateElementName;
        var seriesTemplateSlot = self.getTemplates()[seriesTemplateName];

        // If provided, stamp out series templates, collect series nodes, and augment each series in the array with evaluated attributes
        if (seriesTemplateSlot) {
          var alias = self.options.as;
          var templateMetaData = oj.CustomElementBridge.getMetadata(seriesTemplateElementName);
          var seriesTemplateTopProperties = Object.keys(templateMetaData.properties);
          var nodes = [];
          var node;
          var nodeContainer = document.createElement('div');
          nodeContainer.setAttribute('data-oj-context', '');
          var fragment = document.createDocumentFragment();

          // stamp out series templates and collect series nodes
          for (i = 0; i < seriesArray.length; i++) {
            seriesContext = seriesContexts[seriesArray[i].id];
            try {
              var templateNodes = templateEngine.execute(parentElement,
                                                          seriesTemplateSlot[0],
                                                          seriesContext,
                                                          alias);
              for (j = 0; j < templateNodes.length; j++) {
                if (templateNodes[j].tagName &&
                    templateNodes[j].tagName.toLowerCase() === seriesTemplateElementName) {
                  node = templateNodes[j];
                  break;
                }
              }
            } catch (error) {
              oj.Logger.error(error);
            }
            nodes.push(node);
            fragment.appendChild(node);
          }
          // add to document for properties to be evaluated into attributes
          nodeContainer.appendChild(fragment);
          document.body.appendChild(nodeContainer);

          // Augment each series in the array with evaluted attributes from the nodes
          var busyContext = oj.Context.getContext(nodeContainer).getBusyContext();
          seriesArrayPromise = busyContext.whenReady().then(function () {
            for (i = 0; i < seriesArray.length; i++) {
              seriesObj = seriesArray[i];
              node = nodes[i];
              for (j = 0; j < seriesTemplateTopProperties.length; j++) {
                var propertyValue = node.getProperty(seriesTemplateTopProperties[j]); // safe to read off properties at this point
                if (propertyValue !== undefined) {
                  seriesObj[seriesTemplateTopProperties[j]] = propertyValue;
                }
              }
            }
            templateEngine.clean(nodeContainer);
            document.body.removeChild(nodeContainer);
            nodeContainer = null;
            return seriesArray;
          });
        }

        return seriesArrayPromise.then(function (finalSeriesArray) {
          return { paths: pathValues.paths, values: [finalSeriesArray] };
        });
      }
      return pathValues;
    });
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


(function () {
  var dvtTimeComponentMeta = {
    properties: {},
    methods: {
      getContextByNode: {}
    },
    extension: {
      _WIDGET_NAME: 'dvtTimeComponent'
    }
  };
  oj.CustomElementBridge.registerMetadata('dvtTimeComponent', 'dvtBaseComponent',
                                          dvtTimeComponentMeta);
}());

});