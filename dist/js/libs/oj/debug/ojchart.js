/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtChart'], function(oj, $, comp, base, dvt)
{
/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */


 /**
 * Handler for DataProvider generated content for chart
 * @constructor
 * @ignore
 */
oj.ChartDataProviderHandler = function(component, data, templateEngine)
{
  this._component = component;
  this._templateEngine = templateEngine;
  this._templates = component.getTemplates();
  this._data = data;

  if (!this._templates.itemTemplate)
    oj.Logger.error('No itemTemplate slot specified.');
  else
    this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.ChartDataProviderHandler, oj.Object, "oj.ChartDataProviderHandler");


/**
 * Initializes the instance.
 * @protected
 */
oj.ChartDataProviderHandler.prototype.Init = function() {
  this._parentElement = this._component.element[0];
  this._itemTemplate = this._templates.itemTemplate[0];
  this._seriesTemplate = this._templates.seriesTemplate ? this._templates.seriesTemplate[0] : null;
  this._groupTemplate = this._templates.groupTemplate ? this._templates.groupTemplate[0] : null;
  this._alias = this._component.options.as;
  this._seriesComparator = this._component.options.seriesComparator;
  this._groupComparator = this._component.options.groupComparator;

  // item map. key: series+group ids, value: corresponding item
  this._itemMap = {};
  // seriesContexts: conatins series context for each series
  this._seriesContexts = {}; 
  // groupContexts: contains the group context for a each level of each group
  this._groupContexts = {};
  // itemContexts: contains the item context for a each item
  this._itemContexts = {};

  var rowData = this._data['data'];
  var rowKeys = this._data['keys'];
   
  // Generate chart data      
  var numSeries = 0;
  var numOuterGroups = 0;
    
  // get top level chart item property names
  var itemTagName = "oj-chart-item";
  var chartItemProperties = Object.keys(oj.CustomElementBridge.getMetadata(itemTagName).properties); // todo: remove change listener names

  var chartItemNodes = [];
  var itemsContainer = document.createElement("div");
  itemsContainer.setAttribute("data-oj-context", "");
  var fragment = document.createDocumentFragment();

  // stamp out chart item templates and collect chart item nodes
  for (var i = 0; i < rowData.length; i++) {
    var rowItem = rowData[i];
    var rowKey = rowKeys[i];
    var itemContext = {};
    itemContext = {'data': rowItem, 'key': rowKey, 'index': i, 'componentElement' : this._parentElement};

    var chartItemNode;
    try { 
      var templateNodes = this._templateEngine.execute(this._parentElement, this._itemTemplate , itemContext, this._alias);
      for (var j = 0; j < templateNodes.length; j++) {
        if (templateNodes[j].tagName && templateNodes[j].tagName.toLowerCase() === itemTagName) {
          chartItemNode = templateNodes[j];
          break;
        }
      }
    }
    catch (error) {
      oj.Logger.error(error);
      chartItemNodes = [];
      break;
    }

    this._itemContexts[i] = itemContext;
    chartItemNodes.push(chartItemNode);
    fragment.appendChild(chartItemNode);
  }
  // add to document.body for properties to be evaluated into attributes
  itemsContainer.appendChild(fragment);
  document.body.appendChild(itemsContainer); 

  var self = this;

  var chartData = oj.Context.getContext(itemsContainer).getBusyContext().whenReady().then(function () {
    var chartDataItems = [];
    // Iterate through fetched data and generate actual chart data items info from item nodes
    for (var i = 0; i < chartItemNodes.length; i++) {  
      var chartItemNode = chartItemNodes[i];
      var itemContext = self._itemContexts[i];

      var chartDataItem = {id: rowKeys[i], _itemData: rowData[i]};
      for (var k = 0; k < chartItemProperties.length; k++) {
        var propertyValue = chartItemNode.getProperty(chartItemProperties[k]); // safe to read off properties at this point
        if (propertyValue !== undefined)
          chartDataItem[chartItemProperties[k]] = propertyValue;
      }

      // only process unique rows. ie item keys not seen yet
      if (!self._itemMap[chartDataItem.seriesId] || !self._itemMap[chartDataItem.seriesId][chartDataItem.groupId]){
        chartDataItems.push(chartDataItem);

        delete itemContext.componentElement
        
        // While processing each data row, pull out each seriesId and generate/update seriesContext for that series
        var seriesId = chartDataItem['seriesId'];
        if (!self._seriesContexts[seriesId]) {
          var seriesContext = {};
          seriesContext = {'componentElement' : self._parentElement, 'id': seriesId, 'items': [itemContext], 'index': numSeries};
          self._seriesContexts[seriesId] = seriesContext;
          numSeries++;
        }
        else
          self._seriesContexts[seriesId]['items'].push(itemContext);
          

        // While processing each data row, pull out each groupId and generate/update groupContext for each group/nested group
        var groupId = chartDataItem['groupId'];
        var count = numOuterGroups;
        if (!self._groupContexts[groupId.slice(0, groupId.length - 1)])
          numOuterGroups++;
        self._groupContexts = self._addToGroupContexts(self._groupContexts, itemContext, groupId, 1, count);
        

        // make a map of series+group ids to their corresponding items 
        if (!self._itemMap[chartDataItem.seriesId]) 
          self._itemMap[chartDataItem.seriesId] = {};
        self._itemMap[chartDataItem.seriesId][chartDataItem.groupId] = chartDataItem;
      }
    }
    
    self._templateEngine.clean(itemsContainer);
    document.body.removeChild(itemsContainer);
    itemsContainer = null;

    return chartDataItems;
  });

  
  this._groups = chartData.then(function (chartDataItems) {
    // Create chart groups
    return self._createGroups(chartDataItems).then(function (chartGroups) {
      // Sort groups 
      if (self._groupComparator)
        chartGroups = self._sortGroups(chartGroups);

      return chartGroups;
    });
  }); 
  
  this._series = this._groups.then(function (chartGroups) {
    // Create chart series and add corresponding items
    return self._createSeries(chartGroups).then(function (chartSeries) {
      // Sort series
      if (self._seriesComparator) 
        chartSeries = self._sortSeries(chartSeries);
      return chartSeries;
    });
  });
};

/**
 * This returns a promise that resolves to a chart series array derived from the data provider
 * @return {Promise} A promise that resolves to series array
 */ 
oj.ChartDataProviderHandler.prototype.getSeries = function() {
  return this._series || Promise.resolve([]);
};

/**
 * This returns a promise that resolves to a chart groups array derived from the data provider
 * @return {Promise} A promise that resolves to group array
 */ 
oj.ChartDataProviderHandler.prototype.getGroups = function() {
  return this._groups || Promise.resolve([]);
};

/* GROUPS AND SERIES HELPERS */

/**
 * Update the groupContext of all groups at each depth in the groupId path, creating new groupContext if we have a new group
 * @param {Object} groupContexts The current groupContexts object
 * @param {Object} itemContext The item context for item to be added to the group context
 * @param {Array} groupId The array of groupIds that correspond to current group/nested group we are updating the context for
 * @param {number} depth The depth of the current group/nested group we are updating the context for
 * @param {number} count The index of the current group/nested group we are updating the context for, in relation to that group's parent
 * @private
 */
oj.ChartDataProviderHandler.prototype._addToGroupContexts = function(groupContexts, itemContext, groupId, depth, count) {
  var groupIndex = depth - 1;
  if (groupIndex < groupId.length) {
    var currentId = groupId[groupIndex]; // id for the group a the current depth
    var currentContext = groupContexts[currentId]
    if (!currentContext) {
      groupContexts[currentId] = {}
      groupContexts[currentId] = {'ids': groupId, 
                      'componentElement': this._parentElement,
                      'items': [itemContext],
                      'depth': depth,
                      'leaf': depth == groupId.length,
                      'index': count};
    }
    else {
      // a groupContext will have the data rows and keys for all of its descdendants 
      currentContext['items'].push(itemContext);
    }
    count = currentContext ? currentContext['items'].length - 1 : 0;
    groupContexts = this._addToGroupContexts(groupContexts, itemContext, groupId, depth + 1, count);
  }
  
  return groupContexts;
};

/**
 * Iterate through the previously created series ids, and create the series array
 * @param {Array} chartGroupsData The current chart groups array
 * @return {Promise} Promise that resolves into the series array
 * @private
 */ 
oj.ChartDataProviderHandler.prototype._createSeries = function(chartGroupsData) {
  var seriesIds = Object.keys(this._seriesContexts);
  // get top level chart series property names
  var seriesTagName = "oj-chart-series";
  var chartSeriesProperties = Object.keys(oj.CustomElementBridge.getMetadata(seriesTagName).properties); // todo: remove change listener names

  var seriesNodes = [];
  var seriesContainer;
  var busyContextPromise;

  if (this._seriesTemplate) {
    // stamp out chart series templates and collect chart series nodes
    seriesContainer = document.createElement("div");
    seriesContainer.setAttribute("data-oj-context", "");
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < seriesIds.length; i++) {
      var seriesId = seriesIds[i];
      var chartSeriesNode;
      var seriesContext = this._seriesContexts[seriesId];
      try {
        var templateNodes = this._templateEngine.execute(this._parentElement, this._seriesTemplate, seriesContext, this._alias);
        for (var j = 0; j < templateNodes.length; j++) {
          if (templateNodes[j].tagName && templateNodes[j].tagName.toLowerCase() === seriesTagName) {
            chartSeriesNode = templateNodes[j];
            break;
          }
        }
      }
      catch (error) {
        oj.Logger.error(error);
        seriesNodes = [];
        break;
      }
      seriesNodes.push(chartSeriesNode);
      fragment.appendChild(chartSeriesNode);
    }
    // add to document.body for properties to be evaluated into attributes
    seriesContainer.appendChild(fragment);
    document.body.appendChild(seriesContainer);
    busyContextPromise = oj.Context.getContext(seriesContainer).getBusyContext().whenReady();
  }
  else
    busyContextPromise = Promise.resolve();

  var self = this;
  var seriesArrayPromise = busyContextPromise.then(function () {
    var seriesArray = [];
    // Iterate through series ids and generate actual chart series info from series nodes
    for (var i = 0; i < seriesIds.length; i++) {
      var seriesId = seriesIds[i];
      var chartDataSeries = {'id': seriesId, 'name': seriesId};
      
      if (seriesNodes.length > 0) {
        var chartSeriesNode = seriesNodes[i];
        
        for (var k = 0; k < chartSeriesProperties.length; k++) {
          var propertyValue = chartSeriesNode.getProperty(chartSeriesProperties[k]); // safe to read off properties at this point
          if (propertyValue !== undefined){
            chartDataSeries[chartSeriesProperties[k]] = propertyValue;
          }
        }
      }
      seriesArray.push(chartDataSeries);
    }

    if (seriesContainer) {
      self._templateEngine.clean(seriesContainer);
      document.body.removeChild(seriesContainer);
      seriesContainer = null;
    }

    // add items to series since groups are sorted
    return self._addItemsToSeries(seriesArray, chartGroupsData);

  });

  
  return seriesArrayPromise;
}

/**
 * Populates the items into the various series.
 * @return {Array} The chart series array
 * @return {Array} The chart group array
 * @return {Array} The chart series array with their corresponding items placed in them
 * @private
 */ 
oj.ChartDataProviderHandler.prototype._addItemsToSeries = function (chartSeriesData, chartGroupsData) {
  var getGroupKeys = function (group) {
    if (!group.groups)
      return [group.id];
    else {
      var groupKeys = [];
      for (var i = 0; i < group.groups.length; i++) {
        groupKeys.push([group.id].concat(getGroupKeys(group.groups[i])));
      }
      return groupKeys;
    }
  }

  var groupKeys = [];
  // get group keys. the groupKeys indices corresponds to chart item indices
  for (var i = 0; i < chartGroupsData.length; i++) {
    var group = chartGroupsData[i];
    var subGroupKeys = getGroupKeys(group);
    groupKeys = groupKeys.concat(subGroupKeys);
  }

  for (var i = 0; i < chartSeriesData.length; i++) {
    var series = chartSeriesData[i];
    var seriesItems = [];
    for (var j = 0; j < groupKeys.length; j++) {
      var groupId = groupKeys[j];
      var item = this._itemMap[series.id][groupId] || null; // get corresponding item from map.
      if (item) {
        delete item["groupId"];
        delete item["seriesId"];
      }
      seriesItems.push(item);
    }
    chartSeriesData[i]["items"] = seriesItems;
  }
  return chartSeriesData;
}

/**
 * Iterate through the previously created chart data items, and create the groups array
 * @param {Array} chartDataItems The array of all the data items
 * @return {Promise} A promise that resolves into the groups array
 * @private
 */ 
oj.ChartDataProviderHandler.prototype._createGroups = function(chartDataItems) {
  // get top level chart group property names
  var groupTagName = "oj-chart-group";
  var chartGroupProperties = Object.keys(oj.CustomElementBridge.getMetadata(groupTagName).properties); // todo: remove change listener names
  var groupsContainer;
  var busyContextPromise;
  
  // create group nodes with templates and group contexts and attach to div so properties can be read
  var chartGroupNodes = {};
  if (this._groupTemplate) {   
    groupsContainer = document.createElement("div");
    groupsContainer.setAttribute("data-oj-context", "");
    var fragment = document.createDocumentFragment(); 
    var groupIds = Object.keys(this._groupContexts);
    for (var i = 0; i < groupIds.length; i++) {
      var currentGroupId = groupIds[i];
      var chartGroupNode;
      var groupContext = this._groupContexts[currentGroupId];
      try {
        var templateNodes = this._templateEngine.execute(this._parentElement, this._groupTemplate, groupContext, this._alias);
        for (var j = 0; j < templateNodes.length; j++) {
          if (templateNodes[j].tagName && templateNodes[j].tagName.toLowerCase() === groupTagName) {
            chartGroupNode = templateNodes[j];
            break;
          }
        }
      }
      catch (error) {
        oj.Logger.error(error);
        chartGroupNodes = {};
        break;
      }
      groupsContainer.appendChild(chartGroupNode);  
      chartGroupNodes[currentGroupId] = chartGroupNode; 
    }
    // add to document.body for properties to be evaluated into attributes
    groupsContainer.appendChild(fragment);
    document.body.appendChild(groupsContainer);
    busyContextPromise = oj.Context.getContext(groupsContainer).getBusyContext().whenReady();
  }
  else
    busyContextPromise = Promise.resolve();

  var self = this;
  var groupsArrayPromise = busyContextPromise.then(function () {
    var groupsArray = [];
    for (var i = 0; i < chartDataItems.length; i++) {
      var item = chartDataItems[i];
      groupsArray = self._addGroupItem(item, item['groupId'], groupsArray, chartGroupProperties, chartGroupNodes);
    }
    
    if (groupsContainer) {
      self._templateEngine.clean(groupsContainer);
      document.body.removeChild(groupsContainer);
      groupsContainer = null;
    }
    return groupsArray;
  });

  return groupsArrayPromise;
};

/**
 * Given a data item and its groupId array, we build the nested groups if needed, and add the item
 * to its leaf group
 * @param {Object} item The chart dataitem to add
 * @param {Array} groupId The array of groupIds for the leaf we will add the item to
 * @param {Array} groupsArray The current groups array object
 * @param {Object} templateEngine The template engine to be used to stamp out the groups properties.
 * @param {Object} chartGroupProperties The chart group attributes
 * @param {Object} chartGroupNodes A map of group ids to group nodes
 * @return {Array} The groups array, with the given item added to the proper group leaf
 * @private
 */
oj.ChartDataProviderHandler.prototype._addGroupItem = function(item, groupId, groupsArray, chartGroupProperties, chartGroupNodes) {  
  if (!groupsArray)
    groupsArray = [];
        
  var currentGroupId = groupId[0];
  
  // check to see if we're adding to an existing group
  var index = null;
  for (var i = 0; i < groupsArray.length; i++) { 
    if (groupsArray[i]['id'] == currentGroupId)
      index = i;
  }
  
  var groupItem;
  if(index != null) // we are adding to an existing group
    groupItem = groupsArray[index];
  else { // create new group   
    groupItem = {'id' : currentGroupId, 'name' : currentGroupId};

    var chartGroupNode = chartGroupNodes[currentGroupId];
    if (chartGroupNode) {   
      for (var j = 0; j < chartGroupProperties.length; j++) {
        var propertyValue = chartGroupNode.getProperty(chartGroupProperties[j]); // safe to read off properties at this point
        if (propertyValue !== undefined)
          groupItem[chartGroupProperties[j]] = propertyValue;
      }    
    }
    groupsArray.push(groupItem);
  }
  
  if(groupId.length > 1) // not a leaf, add the next level of groups
    groupItem['groups'] = this._addGroupItem(item, groupId.slice(1), groupItem['groups'], chartGroupProperties, chartGroupNodes);

  return groupsArray;
};

/**
 * Sort the series
 * @param {Array} seriesArray The current series array
 * @return {Array} The sorted series array
 * @private
 */
oj.ChartDataProviderHandler.prototype._sortSeries = function(seriesArray) {
  var sortFunction = function(seriesContexts, seriesComparator) {
    return function(a, b) {
      return seriesComparator(seriesContexts[a['id']], seriesContexts[b['id']]);
    }
  };        

  seriesArray.sort(sortFunction(this._seriesContexts, this._seriesComparator));
  // Update seriesContext indices after sort
  for (var i = 0; i < seriesArray.length; i++) {
    var seriesId = seriesArray[i]['id'];
    this._seriesContexts[seriesId]['index'] = i;
  } 

  return seriesArray;
}

/**
 * Sort the groups
 * @param {Array} groupsArray The current groups array
 * @return {Array} The sorted groups array
 * @private
 */
oj.ChartDataProviderHandler.prototype._sortGroups = function(groupsArray) {
   
  var sortFunction = function(groupContexts, groupComparator) {    
    return function(a, b) {
      var id1 = a['id'];
      var id2 = b['id'];
      var context1 = groupContexts[id1];
      var context2 = groupContexts[id2];
      return groupComparator(context1, context2);
    }
  };

  groupsArray.sort(sortFunction(this._groupContexts, this._groupComparator));
  for (var i = 0; i < groupsArray.length; i++) {
    var groupId = groupsArray[i]['id'];
    
    // Update group context indices after sorting
    this._groupContexts[groupId]['index'] = i;
    
    // Sort nested groups if they exist
    if(groupsArray[i]['groups'])
      groupsArray[i]['groups'] = this._sortGroups(groupsArray[i]['groups'])
  }
  
  return groupsArray;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
/* global dvt:false */

/**
 * @ojcomponent oj.ojChart
 * @augments oj.dvtBaseComponent
 * @since 0.7
 * @ojstatus preview
 * @ojtsignore
 * @ojshortdesc Displays information graphically, making relationships among the data easier to understand.
 * @ojrole application
 *
 * @classdesc
 * <h3 id="chartOverview-section">
 *   JET Chart
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#chartOverview-section"></a>
 * </h3>
 *
 * <p>JET Chart with support for bar, line, area, combination, pie, scatter, bubble, funnel, box plot, and stock
 * chart types.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-chart
 *   type='bar'
 *   series='[{"name": "Q1 Sales", "items": [50, 60, 20]}]'
 *   groups='["Phone", "Tablets", "Laptops"]'
 * >
 * &lt;/oj-chart>
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
 * <h4>Animation</h4>
 * <p>Animation should only be enabled for visualizations of small to medium data sets. When animating changes to larger
 *    data sets or when animating between data sets, it's recommended to turn off the
 *    <code class="prettyprint">styleDefaults.animationIndicators</code>, since they effectively double the amount of
 *    work required for the animation.
 * </p>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it's recommended that applications only set usable data densities on the chart. For example,
 *    it's not recommended to show more than 500 bars on a 500 pixel wide chart, since the  bars will be unusably thin.
 *    While there are several optimizations within the chart to deal with large data sets, it's always more efficient to
 *    reduce the data set size as early as possible. Future optimizations will focus on improving end user experience as
 *    well as developer productivity for common use cases.
 * </p>
 *
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">styleDefaults</code> or <code class="prettyprint">series</code>, instead of styling properties
 *    on the individual data items. The chart can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojChart', $.oj.dvtBaseComponent,
  {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * An object with the following properties, used to define the series and groups when using a DataProvider to provide data to the chart. Also accepts a Promise for deferred data rendering.
       * @ignore
       * @name data
       * @memberof oj.ojChart
       * @instance
       * @type {Object|Promise|null}
       * @ojsignature {target: "Accessor", value: {GetterType: "Promise<oj.ojChart.Data>|null", SetterType: "oj.ojChart.Data|Promise<oj.ojChart.Data>|null"}, jsdocOverride: true}
       * @default null
       */
      data: null,

      /**
       * Triggered during a selection gesture, such as a change in the marquee selection rectangle.
       *
       * @property {Array} items an array containing the string ids of the selected data items
       * @property {Array} selectionData an array containing objects describing the selected data items
       * @property {object} selectionData.data the data of the item, if one was specified
       * @property {object} selectionData.itemData the row data of the item, if one was specified. This will only be set if a DataProvider is used.
       * @property {Array} selectionData.groupData the group data of the item
       * @property {object} selectionData.seriesData the series data of the item
       * @property {string} endGroup the end group of a marquee selection on a chart with categorical axis
       * @property {string} startGroup the start group of a marquee selection on a chart with categorical axis
       * @property {number} xMax the maximum x value of a marquee selection
       * @property {number} xMin the minimum x value of a marquee selection
       * @property {number} yMax the maximum y value of a marquee selection
       * @property {number} yMin the minimum y value of a marquee selection
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       * @ojbubbles
       */
      selectInput: null,

      /**
       * Triggered after the viewport is changed due to a zoom or scroll operation.
       *
       * @property {string} endGroup the end group of the new viewport on a chart with categorical axis
       * @property {string} startGroup the start group of the new viewport on a chart with categorical axis
       * @property {number} xMax the maximum x value of the new viewport
       * @property {number} xMin the minimum x value of the new viewport
       * @property {number} yMax the maximum y value of the new viewport
       * @property {number} yMin the minimum y value of the new viewport
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       * @ojbubbles
       */
      viewportChange: null,

      /**
       * Triggered during a viewport change gesture, such as a drag operation on the overview window. Note: There are
       * situations where the chart cannot determine whether the viewport change gesture is still in progress, such
       * as with mouse wheel zoom interactions. Standard viewportChange events are fired in these cases.
       *
       * @property {string} endGroup the end group of the new viewport on a chart with categorical axis
       * @property {string} startGroup the start group of the new viewport on a chart with categorical axis
       * @property {number} xMax the maximum x value of the new viewport
       * @property {number} xMin the minimum x value of the new viewport
       * @property {number} yMax the maximum y value of the new viewport
       * @property {number} yMin the minimum y value of the new viewport
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       * @ojbubbles
       */
      viewportChangeInput: null,

      /**
       * Triggered during a drill gesture (double click if selection is enabled, single click otherwise).
       *
       * @property {string} id the id of the drilled object
       * @property {string} series the series id of the drilled object, if applicable
       * @property {string} group the group id of the drilled object, if applicable
       * @property {Object} data  the data object of the drilled item
       * @property {Object} itemData  the row data object of the drilled item. This will only be set if a DataProvider is being used.
       * @property {Object} seriesData the data for the series of the drilled object
       * @property {Array} groupData an array of data for the group the drilled object belongs to. For hierarchical groups, it will be an array of outermost to innermost group data related to the drilled object
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       * @ojbubbles
       */
      drill: null
    },

    //* * @inheritdoc */
    _CreateDvtComponent: function (context, callback, callbackObj) {
      return dvt.Chart.newInstance(context, callback, callbackObj);
    },

    //* * @inheritdoc */
    _ConvertLocatorToSubId: function (locator) {
      var subId = locator.subId;

      // Convert the supported locators
      if (subId === 'oj-chart-item') {
        // dataItem[seriesIndex][itemIndex]
        subId = 'dataItem[' + locator.seriesIndex + '][' + locator.itemIndex + ']';
      } else if (subId === 'oj-chart-group') {
        // group[index1][index2]...[indexN]
        subId = 'group' + this._GetStringFromIndexPath(locator.indexPath);
      } else if (subId === 'oj-chart-series') {
        // series[index]
        subId = 'series[' + locator.index + ']';
      } else if (subId === 'oj-chart-axis-title') {
        // xAxis/yAxis/y2Axis:title
        subId = locator.axis + ':title';
      } else if (subId === 'oj-chart-reference-object') {
        // xAxis/yAxis/y2Axis:referenceObject[index]
        subId = locator.axis + ':referenceObject[' + locator.index + ']';
      } else if (subId === 'oj-legend-item') {
        // legend:section[sectionIndex0][sectionIndex1]...[sectionIndexN]:item[itemIndex]
        subId = 'legend:section' + this._GetStringFromIndexPath(locator.sectionIndexPath);
        subId += ':item[' + locator.itemIndex + ']';
      } else if (subId === 'oj-chart-tooltip') {
        subId = 'tooltip';
      } else if (subId === 'oj-chart-pie-center-label') {
        subId = 'pieCenterLabel';
      }

      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    },

    //* * @inheritdoc */
    _ProcessTemplates : function (data, templateEngine) {
      var self = this;
      // Support for dataprovider and chart templates
      var chartOptions = new oj.ChartDataProviderHandler(self, data, templateEngine);

      return Promise.all([chartOptions.getSeries(), chartOptions.getGroups(), data]).then(function (values) {
        return {paths: ["series", "groups", "data"], values: values};
      });
    },

    //* * @inheritdoc */
    _ProcessOptions: function () {
      this._super();

      var center = this.options.pieCenter;
      if (center && center._renderer) {
        center.renderer = this._GetTemplateRenderer(center._renderer, 'center');
      }

      var selection = this.options.selection;
      // The array<object> type is deprecated since 2.1.0 so for custom elements and only supported for the data provider use case starting 5.1.0
      // we are breaking selection in order to push developers to use the correct syntax
      if (this._IsCustomElement() && selection && typeof selection[0] === 'object' && !this.options.data) {
        this.options.selection = null;
      }
    },

    //* * @inheritdoc */
    _ConvertSubIdToLocator: function (subId) {
      var locator = {};

      if (subId.indexOf('dataItem') === 0) {
        // dataItem[seriesIndex][itemIndex]
        var indexPath = this._GetIndexPath(subId);

        locator.subId = 'oj-chart-item';
        locator.seriesIndex = indexPath[0];
        locator.itemIndex = indexPath[1];
      } else if (subId.indexOf('group') === 0) {
        // group[index1][index2]...[indexN]
        locator.subId = 'oj-chart-group';
        locator.indexPath = this._GetIndexPath(subId);
      } else if (subId.indexOf('series') === 0) {
        // series[index]
        locator.subId = 'oj-chart-series';
        locator.index = this._GetFirstIndex(subId);
      } else if (subId.indexOf('Axis:title') > 0) {
        // xAxis/yAxis/y2Axis:title
        locator.subId = 'oj-chart-axis-title';
        locator.axis = subId.substring(0, subId.indexOf(':'));
      } else if (subId.indexOf('Axis:referenceObject') > 0) {
        // xAxis/yAxis/y2Axis:referenceObject[index]
        locator.subId = 'oj-chart-reference-object';
        locator.axis = subId.substring(0, subId.indexOf(':'));
        locator.index = this._GetFirstIndex(subId);
      } else if (subId.indexOf('legend') === 0) {
        if (subId.indexOf(':item') > 0) {
          // legend:section[sectionIndex0][sectionIndex1]...[sectionIndexN]:item[itemIndex]
          var itemStartIndex = subId.indexOf(':item');
          var sectionSubstr = subId.substring(0, itemStartIndex);
          var itemSubstr = subId.substring(itemStartIndex);

          locator.subId = 'oj-legend-item';
          locator.sectionIndexPath = this._GetIndexPath(sectionSubstr);
          locator.itemIndex = this._GetFirstIndex(itemSubstr);
        }
      } else if (subId === 'tooltip') {
        locator.subId = 'oj-chart-tooltip';
      } else if (subId === 'pieCenterLabel') {
        locator.subId = 'oj-chart-pie-center-label';
      }

      return locator;
    },

    //* * @inheritdoc */
    _ProcessStyles: function () {
      this._super();
      if (!this.options.styleDefaults) {
        this.options.styleDefaults = {};
      }
      if (!this.options.styleDefaults.colors) {
        var handler = new oj.ColorAttributeGroupHandler();
        // override default colors with css attribute group colors
        this.options.styleDefaults.colors = handler.getValueRamp();
      }
    },

    //* * @inheritdoc */
    _GetComponentRendererOptions: function () {
      return ['tooltip/renderer', 'pieCenter/renderer'];
    },

    //* * @inheritdoc */
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-chart');
      return styleClasses;
    },

    //* * @inheritdoc */
    _GetChildStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses['oj-chart-data-label'] =
        { path: 'styleDefaults/dataLabelStyle', property: 'TEXT' };
      styleClasses['oj-chart-data-cursor-line'] =
        { path: 'styleDefaults/dataCursor/lineColor', property: 'color' };
      styleClasses['oj-chart-stack-label'] =
        { path: 'styleDefaults/stackLabelStyle', property: 'TEXT' };
      styleClasses['oj-chart-pie-center-label'] =
        { path: 'pieCenter/labelStyle', property: 'TEXT' };
      styleClasses['oj-chart-slice-label'] =
        { path: 'styleDefaults/sliceLabelStyle', property: 'TEXT' };
      styleClasses['oj-chart-stock-falling'] =
        { path: 'styleDefaults/stockFallingColor', property: 'background-color' };
      styleClasses['oj-chart-stock-range'] =
        { path: 'styleDefaults/stockRangeColor', property: 'background-color' };
      styleClasses['oj-chart-stock-rising'] =
        { path: 'styleDefaults/stockRisingColor', property: 'background-color' };
      styleClasses['oj-chart-tooltip-label'] =
        { path: 'styleDefaults/tooltipLabelStyle', property: 'TEXT' };
      styleClasses['oj-chart-xaxis-tick-label'] =
        { path: 'xAxis/tickLabel/style', property: 'TEXT' };
      styleClasses['oj-chart-xaxis-title'] =
        { path: 'xAxis/titleStyle', property: 'TEXT' };
      styleClasses['oj-chart-yaxis-tick-label'] = { path: 'yAxis/tickLabel/style', property: 'TEXT' };
      styleClasses['oj-chart-yaxis-title'] =
        { path: 'yAxis/titleStyle', property: 'TEXT' };
      styleClasses['oj-chart-y2axis-tick-label'] =
        { path: 'y2Axis/tickLabel/style', property: 'TEXT' };
      styleClasses['oj-chart-y2axis-title'] =
        { path: 'y2Axis/titleStyle', property: 'TEXT' };

      // Legend
      styleClasses['oj-legend'] = { path: 'legend/textStyle', property: 'TEXT' };
      styleClasses['oj-legend-title'] = { path: 'legend/titleStyle', property: 'TEXT' };

      return styleClasses;
    },

    //* * @inheritdoc */
    _GetEventTypes: function () {
      return ['drill', 'optionChange', 'selectInput', 'viewportChange', 'viewportChangeInput'];
    },

    //* * @inheritdoc */
    _GetTranslationMap: function () {
      // The translations are stored on the options object.
      var translations = this.options.translations;

      // Safe to modify super's map because function guarentees a new map is returned
      var ret = this._super();
      ret['DvtChartBundle.DEFAULT_GROUP_NAME'] = translations.labelDefaultGroupName;
      ret['DvtChartBundle.LABEL_SERIES'] = translations.labelSeries;
      ret['DvtChartBundle.LABEL_GROUP'] = translations.labelGroup;
      ret['DvtChartBundle.LABEL_VALUE'] = translations.labelValue;
      ret['DvtChartBundle.LABEL_TARGET_VALUE'] = translations.labelTargetValue;
      ret['DvtChartBundle.LABEL_X'] = translations.labelX;
      ret['DvtChartBundle.LABEL_Y'] = translations.labelY;
      ret['DvtChartBundle.LABEL_Z'] = translations.labelZ;
      ret['DvtChartBundle.LABEL_PERCENTAGE'] = translations.labelPercentage;
      ret['DvtChartBundle.LABEL_LOW'] = translations.labelLow;
      ret['DvtChartBundle.LABEL_HIGH'] = translations.labelHigh;
      ret['DvtChartBundle.LABEL_OPEN'] = translations.labelOpen;
      ret['DvtChartBundle.LABEL_CLOSE'] = translations.labelClose;
      ret['DvtChartBundle.LABEL_VOLUME'] = translations.labelVolume;
      ret['DvtChartBundle.LABEL_Q1'] = translations.labelQ1;
      ret['DvtChartBundle.LABEL_Q2'] = translations.labelQ2;
      ret['DvtChartBundle.LABEL_Q3'] = translations.labelQ3;
      ret['DvtChartBundle.LABEL_MIN'] = translations.labelMin;
      ret['DvtChartBundle.LABEL_MAX'] = translations.labelMax;
      ret['DvtChartBundle.LABEL_OTHER'] = translations.labelOther;
      ret['DvtChartBundle.PAN'] = translations.tooltipPan;
      ret['DvtChartBundle.MARQUEE_SELECT'] = translations.tooltipSelect;
      ret['DvtChartBundle.MARQUEE_ZOOM'] = translations.tooltipZoom;
      ret['DvtUtilBundle.CHART'] = translations.componentName;
      return ret;
    },

    //* * @inheritdoc */
    _HandleEvent: function (event) {
      var type = event.type;
      if (type === 'selection') {
        var selection = event.selection;
        if (selection) {
          // Convert the graph selection context into the JET context
          var selectedItems = [];
          var selectionData = [];
          for (var i = 0; i < selection.length; i++) {
            var selectedItem;
            if (this._IsCustomElement()) {
              selectedItem = selection[i].id;
            } else {
              selectedItem = { id: selection[i].id,
                series: selection[i].series,
                group: selection[i].group };
            }
            var selectedItemData = { data: selection[i].data,
              seriesData: selection[i].seriesData,
              groupData: selection[i].groupData,
              itemData: selection[i].itemData};
            selectedItems.push(selectedItem);
            selectionData.push(selectedItemData);
          }

          var selectPayload = {
            endGroup: event.endGroup,
            startGroup: event.startGroup,
            xMax: event.xMax,
            xMin: event.xMin,
            yMax: event.yMax,
            yMin: event.yMin,
            y2Max: event.y2Max,
            y2Min: event.y2Min,
            selectionData: selectionData
          };

          if (!this._IsCustomElement()) {
            selectPayload.component = event.component;
          }

          // Update the options selection state if the user interaction is complete
          if (event.complete) {
            this._UserOptionChange('selection', selectedItems, selectPayload);
          } else {
            selectPayload.items = selectedItems;
            this._trigger('selectInput', null, selectPayload);
          }
        }
      } else if (type === 'viewportChange') {
        var viewportChangePayload = {
          endGroup: event.endGroup,
          startGroup: event.startGroup,
          xMax: event.xMax,
          xMin: event.xMin,
          yMax: event.yMax,
          yMin: event.yMin };

        // Maintain the viewport state
        // TODO we should be firing option change event for this, but it doesn't support nested props yet.
        if (event.complete) {
          // Ensure the axis options both exist
          if (!this.options.xAxis) {
            this.options.xAxis = {};
          }

          if (!this.options.yAxis) {
            this.options.yAxis = {};
          }

          // X-Axis: Clear the start and end group because min/max more accurate.
          this.options.xAxis.viewportStartGroup = null;
          this.options.xAxis.viewportEndGroup = null;
          if (event.xMin != null && event.xMax != null) {
            this.options.xAxis.viewportMin = event.xMin;
            this.options.xAxis.viewportMax = event.xMax;
          }

          // Y-Axis
          if (event.yMin != null && event.yMax != null) {
            this.options.yAxis.viewportMin = event.yMin;
            this.options.yAxis.viewportMax = event.yMax;
          }
        }

        this._trigger(event.complete ? 'viewportChange' : 'viewportChangeInput',
                      null, viewportChangePayload);
      } else if (type === 'drill') {
        this._trigger('drill', null, {
          id: event.id,
          series: event.series,
          group: event.group,
          data: event.data,
          seriesData: event.seriesData,
          groupData: event.groupData,
          itemData: event.itemData,
          component: event.component
        });
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

      // Add images
      // TODO these should be defined in the skin instead
      resources.overviewGrippy =
        oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/drag_horizontal.png');

      // Add cursors
      resources.panCursorDown =
        oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/hand-closed.cur');
      resources.panCursorUp =
        oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/hand-open.cur');

      // Drag button images
      resources.panUp = 'oj-chart-pan-icon';
      resources.panUpHover = 'oj-chart-pan-icon oj-hover';
      resources.panDown = 'oj-chart-pan-icon oj-active';
      resources.panDownHover = 'oj-chart-pan-icon oj-hover oj-active';
      resources.selectUp = 'oj-chart-select-icon';
      resources.selectUpHover = 'oj-chart-select-icon oj-hover';
      resources.selectDown = 'oj-chart-select-icon oj-active';
      resources.selectDownHover = 'oj-chart-select-icon oj-hover oj-active';
      resources.zoomUp = 'oj-chart-zoom-icon';
      resources.zoomUpHover = 'oj-chart-zoom-icon oj-hover';
      resources.zoomDown = 'oj-chart-zoom-icon oj-active';
      resources.zoomDownHover = 'oj-chart-zoom-icon oj-hover oj-active';
    },

    /**
     * Returns the chart title.
     * @ignore
     * @return {string} The chart title
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getTitle: function () {
      var auto = this._component.getAutomation();
      return auto.getTitle();
    },

    /**
     * Returns the group corresponding to the given index
     * @param {string} groupIndex the group index
     * @return {string} The group name corresponding to the given group index
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getGroup: function (groupIndex) {
      var auto = this._component.getAutomation();
      return auto.getGroup(groupIndex);
    },

    /**
     * Returns the series corresponding to the given index
     * @param {string} seriesIndex the series index
     * @return {string} The series name corresponding to the given series index
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getSeries: function (seriesIndex) {
      var auto = this._component.getAutomation();
      return auto.getSeries(seriesIndex);
    },

    /**
     * Returns number of groups in the chart data
     * @return {number} The number of groups
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getGroupCount: function () {
      var auto = this._component.getAutomation();
      return auto.getGroupCount();
    },

    /**
     * Returns number of series in the chart data
     * @return {number} The number of series
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getSeriesCount: function () {
      var auto = this._component.getAutomation();
      return auto.getSeriesCount();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the data item with
     * the specified series and group indices.
     *
     * @param {number} seriesIndex
     * @param {number} groupIndex
     * @property {string} borderColor
     * @property {string} color
     * @property {number} close The closing value for a stock item
     * @property {string} group The group id.
     * @property {number} high The high value for a range or stock item
     * @property {string} label
     * @property {number} low  The low value for a range or stock item
     * @property {number} open The opening value for a stock item
     * @property {boolean} selected
     * @property {string} series The series id.
     * @property {number} targetValue The target value for a funnel slice.
     * @property {string} tooltip
     * @property {number} value
     * @property {number} volume  The volume of a stock item
     * @property {number} x
     * @property {number} y
     * @property {number} z
     * @return {Object|null} An object containing properties for the data item, or null if none exists.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getDataItem: function (seriesIndex, groupIndex) {
      return this._component.getAutomation().getDataItem(seriesIndex, groupIndex);
    },

    /**
     * Returns an object with the following properties for automation testing verification of the chart legend.
     *
     * @property {Object} bounds An object containing the bounds of the legend.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {string} title
     * @return {Object} An object containing properties for the chart legend.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getLegend: function () {
      return this._component.getAutomation().getLegend();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the chart plot area.
     *
     * @property {Object} bounds An object containing the bounds of the plot area.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @return {Object} An object containing properties for the chart plot area.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getPlotArea: function () {
      return this._component.getAutomation().getPlotArea();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the x axis.
     *
     * @property {Object} bounds An object containing the bounds of the legend.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {string} title
     * @property {Function(number, number)} getPreferredSize Returns the preferred size of the axis, given the available
     *   width and height. This value can be passed into the <code class="prettyprint">size</code> and
     *   <code class="prettyprint">maxSize</code> options of the axis. A re-render must be triggered by calling
     *   <code class="prettyprint">refresh</code> after invoking this function.
     * @property {number} getPreferredSize.width
     * @property {number} getPreferredSize.height
     * @return {Object} An object containing properties for the x axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getXAxis: function () {
      return this._component.getAutomation().getXAxis();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the y axis.
     *
     * @property {Object} bounds An object containing the bounds of the legend.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {string} title
     * @property {Function(number, number)} getPreferredSize Returns the preferred size of the axis, given the available
     *   width and height. This value can be passed into the <code class="prettyprint">size</code> and
     *   <code class="prettyprint">maxSize</code> options of the axis. A re-render must be triggered by calling
     *   <code class="prettyprint">refresh</code> after invoking this function.
     * @property {number} getPreferredSize.width
     * @property {number} getPreferredSize.height
     * @return {Object} An object containing properties for the y axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getYAxis: function () {
      return this._component.getAutomation().getYAxis();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the y2 axis.
     *
     * @property {Object} bounds An object containing the bounds of the legend.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {string} title
     * @property {Function(number, number)} getPreferredSize Returns the preferred size of the axis, given the available
     *   width and height. This value can be passed into the <code class="prettyprint">size</code> and
     *   <code class="prettyprint">maxSize</code> options of the axis. A re-render must be triggered by calling
     *   <code class="prettyprint">refresh</code> after invoking this function.
     * @property {number} getPreferredSize.width
     * @property {number} getPreferredSize.height
     * @return {Object} An object containing properties for the y2 axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getY2Axis: function () {
      return this._component.getAutomation().getY2Axis();
    },

    /**
     * Returns the x, y, and y2 axis values at the specified X and Y coordinate.
     * @param {number} x The X coordinate relative to the component.
     * @param {number} y The Y coordinate relative to the component.
     * @return {Object} An object containing the "x", "y", and "y2" axis values.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getValuesAt: function (x, y) {
      return this._component.getValuesAt(x, y);
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
     * @memberof oj.ojChart
     */
    getContextByNode: function (node) {
      // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context && context.subId !== 'oj-chart-tooltip') {
        return context;
      }

      return null;
    },

    //* * @inheritdoc */
    _GetComponentDeferredDataPaths: function () {
      return { root: ['groups', 'series', 'data'] };
    },

    //* * @inheritdoc */
    _CompareOptionValues: function (option, value1, value2) {
      if (option === 'dataCursorPosition') {
        return oj.Object.compareValues(value1, value2);
      }
      return this._super(option, value1, value2);
    }
  });

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
 *     <tr>
 *       <td rowspan="5">Data Item</td>
 *       <td rowspan="2"><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled and <code class="prettyprint">selectionMode</code> is <code class="prettyprint">none</code>.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled and <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td>Categorical Axis Item</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Legend Item</td>
 *       <td rowspan="2"><kbd>Tap</kbd></td>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td>Filter when <code class="prettyprint">hideAndShowBehavior</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="4">Plot Area</td>
 *       <td rowspan="2"><kbd>Drag</kbd></td>
 *       <td>Pan when panning is enabled and toggled into that mode.</td>
 *     </tr>
 *     <tr>
 *       <td>Marquee select when <code class="prettyprint">selectionMode</code> is <code class="prettyprint">multiple</code> and toggled into that mode.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Pinch-close</kbd></td>
 *       <td>Zoom out when zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Spread-open</kbd></td>
 *       <td>Zoom in when zooming is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojChart
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
 *       <td>Move focus to next element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move focus and selection to previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus and selection to next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection to previous data item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection to next data item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>Move focus and multi-select next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and multi-select next data item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>Move focus to previous data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>Move focus to next data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus to previous data item (on left), without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus to next data item (on right), without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select data item with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>=</kbd> or <kbd>+</kbd></td>
 *       <td>Zoom in one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>-</kbd> or <kbd>_</kbd></td>
 *       <td>Zoom out one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Pan up if scrolling is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Pan down if scrolling is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageUp</kbd></td>
 *       <td>Pan left in left-to-right locales. Pan right in right-to-left locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageDown</kbd></td>
 *       <td>Pan right in left-to-right locales. Pan left in right-to-left locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Drill on data item, categorical axis label, or legend item when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojChart
 */

/**
 * An array of objects with the following properties, used to define series labels and override series styles. Only a single series is supported for stock charts. Also accepts a Promise for deferred data rendering.
 * @expose
 * @ojtsignore
 * @name series
 * @memberof oj.ojChart
 * @instance
 * @type {Array.<Object>|Promise}
 * @default null
 */
/**
 * The name of the series, displayed in the legend and tooltips.
 * @expose
 * @ojtsignore
 * @name series[].name
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An array of values or an array of objects with the following properties that defines the data items for the series.
 * @expose
 * @ojtsignore
 * @name series[].items
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>|Array.<number>}
 * @default null
 */
/**
 * An array of nested data items to be used for defining the markers for outliers or additional data items of a box plot.
 * @expose
 * @ojtsignore
 * @name series[].items[].items
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>|Array.<number>}
 * @default null
 */
/**
 * (Optional) The id of the data item. This id will be provided as part of the context for events on the chart. If the chart is using a data provider then the id type is an object and the row key will be used as the id, otherwise it is a string.
 * @expose
 * @ojtsignore
 * @name series[].items[].id
 * @memberof! oj.ojChart
 * @instance
 * @type {any}
 * @default null
 */
/**
 * The x value. Mainly used for scatter and bubble chart and to specify the date for mixed-frequency time axis.
 * For categorical axis, if the x value is not specified, it will default to the item index.
 * For regular time axis, if the x value is not specified, it will default to the group name of the item.
 * @expose
 * @ojtsignore
 * @name series[].items[].x
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The y value. Also the primary value for charts without a y-Axis, such as pie charts.
 * @expose
 * @ojtsignore
 * @name series[].items[].y
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The z value. Defines the bubble radius for a bubble chart, as well as the width of a bar or a box plot item.
 * @expose
 * @ojtsignore
 * @name series[].items[].z
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The low value for range bar/area, stock candlestick, or box plot item. Define 'low' and 'high' instead of 'value' or 'y' to create a range bar/area chart.
 * @expose
 * @ojtsignore
 * @name series[].items[].low
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The high value for range bar/area, stock candlestick, or box plot item. Define 'low' and 'high' instead of 'value' or 'y' to create a range bar/area chart.
 * @expose
 * @ojtsignore
 * @name series[].items[].high
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The open value for stock candlestick.
 * @expose
 * @ojtsignore
 * @name series[].items[].open
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The close value for stock candlestick. When bar, line, or area series type are used on a stock chart, this value is displayed.
 * @expose
 * @ojtsignore
 * @name series[].items[].close
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The value for stock volume bar. When this value is provided, the volume bar is displayed on the y2 axis.
 * @expose
 * @ojtsignore
 * @name series[].items[].volume
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The first quartile value for box plot.
 * @expose
 * @ojtsignore
 * @name series[].items[].q1
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The second quartile (median) value for box plot.
 * @expose
 * @ojtsignore
 * @name series[].items[].q2
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The third quartile value for box plot.
 * @expose
 * @ojtsignore
 * @name series[].items[].q3
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The description of this object. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @ojtsignore
 * @name series[].items[].shortDesc
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The color of the data item.
 * @expose
 * @ojtsignore
 * @name series[].items[].color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border color of the data item. For funnel and pyramid charts, it is used for the slice border.
 * @expose
 * @ojtsignore
 * @name series[].items[].borderColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border width of the data item. For funnel and pyramid charts, it is used for the slice border.
 * @expose
 * @ojtsignore
 * @name series[].items[].borderWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The pattern used to fill the data item. A solid fill is used by default, unless the seriesEffect is 'pattern'.
 * @expose
 * @ojtsignore
 * @name series[].items[].pattern
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "smallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The CSS style class to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @expose
 * @ojtsignore
 * @name series[].items[].svgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @expose
 * @ojtsignore
 * @name series[].items[].svgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
 * @expose
 * @ojtsignore
 * @name series[].items[].markerDisplayed
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
 * @expose
 * @ojtsignore
 * @name series[].items[].markerShape
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "square"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The size of the data markers. Does not apply to bubble charts, which calculate marker size based on the z values.
 * @expose
 * @ojtsignore
 * @name series[].items[].markerSize
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 *  The URI of the custom image. If specified, it takes precedence over shape.
 * @expose
 * @ojtsignore
 * @name series[].items[].source
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the hover state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name series[].items[].sourceHover
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The optional URI for the selected state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name series[].items[].sourceSelected
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the hover selected state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name series[].items[].sourceHoverSelected
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The label for the data item. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively. Not supported for box plot or candlestick.
 * @expose
 * @ojtsignore
 * @name series[].items[].label
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 * @ojtranslatable
 */
/**
 * The position of the data label. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively. The 'outsideSlice' value only applies to pie charts. The 'aboveMarker', 'belowMarker', 'beforeMarker', and 'afterMarker' values only apply to line, area, scatter, and bubble series. The 'insideBarEdge' and 'outsideBarEdge' values only apply to non-polar bar series. Stacked bars do not support 'outsideBarEdge'. The chart does not currently adjust layout to fit labels within the plot area or deal with any overlaps between labels.
 * @expose
 * @ojtsignore
 * @name series[].items[].labelPosition
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @ojvalue {string} "center"
 * @ojvalue {string} "outsideSlice"
 * @ojvalue {string} "aboveMarker"
 * @ojvalue {string} "belowMarker"
 * @ojvalue {string} "beforeMarker"
 * @ojvalue {string} "afterMarker"
 * @ojvalue {string} "insideBarEdge"
 * @ojvalue {string} "outsideBarEdge"
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The CSS style object defining the style of the data label. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively.
 * @expose
 * @ojtsignore
 * @name series[].items[].labelStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {object|Array.<Object>}
 * @default null
 */
/**
 * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend or other visualization elements. If not defined, series categories are used.
 * @expose
 * @ojtsignore
 * @name series[].items[].categories
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The value for this data item. Corresponding to the y value for bar, line, area, and combo charts and the slice values for pie, funnel and pyramid charts. Null can be specified to skip a data point.
 * @expose
 * @ojtsignore
 * @name series[].items[].value
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The target value for a funnel chart. When this is set, the value attribute defines the filled area within the slice and this represents the value of the whole slice.
 * @expose
 * @ojtsignore
 * @name series[].items[].targetValue
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 *  Whether drilling is enabled for the data item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all data items at once, use the drilling attribute in the top level.
 * @expose
 * @ojtsignore
 * @name series[].items[].drilling
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * An object containing the style properties of the box plot item.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The color of the Q2 segment of the box.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.q2Color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS style class to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.q2SvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS inline style to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.q2SvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The CSS inline style to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.q3SvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The CSS style class to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.q3SvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the whisker stems.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.whiskerSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the whisker stems.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.whiskerSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the whisker ends.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.whiskerEndSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the whisker ends.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.whiskerEndSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  Specifies the length of the whisker ends in pixels (e.g. '9px') or as a percentage of the box width (e.g. '50%'). The specified length will be rounded down to an odd number of pixels to ensure symmetry.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.whiskerEndLength
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the median line.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.medianSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the median line.
 * @expose
 * @ojtsignore
 * @name series[].items[].boxPlot.medianSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The id of the series. Defaults to the name or the series index if not specified.
 * @expose
 * @ojtsignore
 * @name series[].id
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The type of data objects to display for this series. Only applies to bar, line, area, stock, box plot, and combo charts.
 * @expose
 * @ojtsignore
 * @name series[].type
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "bar"
 * @ojvalue {string} "line"
 * @ojvalue {string} "area"
 * @ojvalue {string} "lineWithArea"
 * @ojvalue {string} "candlestick"
 * @ojvalue {string} "boxPlot"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The color of the series.
 * @expose
 * @ojtsignore
 * @name series[].color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border color of the series.
 * @expose
 * @ojtsignore
 * @name series[].borderColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border width of the series.
 * @expose
 * @ojtsignore
 * @name series[].borderWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The area color of the series. Only applies if series type is area or lineWithArea.
 * @expose
 * @ojtsignore
 * @name series[].areaColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply if series type is area or lineWithArea. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @ojtsignore
 * @name series[].areaSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply if series type is area or lineWithArea. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @ojtsignore
 * @name series[].areaSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the series. For series of type lineWithArea, this style will only be applied to the line if areaClassName is also specified. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @ojtsignore
 * @name series[].svgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the series. For series of type lineWithArea, this style will only be applied to the line if areaStyle is also specified.The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @ojtsignore
 * @name series[].svgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the data markers.The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the marker color attribute.
 * @expose
 * @ojtsignore
 * @name series[].markerSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the data markers. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the marker color attribute.
 * @expose
 * @ojtsignore
 * @name series[].markerSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The pattern used to fill the series. A solid fill is used by default, unless the seriesEffect is 'pattern'.
 * @expose
 * @ojtsignore
 * @name series[].pattern
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "smallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
 * @expose
 * @ojtsignore
 * @name series[].markerShape
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "square"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The color of the data markers, if different from the series color.
 * @expose
 * @ojtsignore
 * @name series[].markerColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the data markers should be displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
 * @expose
 * @ojtsignore
 * @name series[].markerDisplayed
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The size of the data markers.
 * @expose
 * @ojtsignore
 * @name series[].markerSize
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The width of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
 * @expose
 * @ojtsignore
 * @name series[].lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The line style of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
 * @expose
 * @ojtsignore
 * @name series[].lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The line type of the data line or area. Only applies to line, area, scatter, and bubble series. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
 * @expose
 * @ojtsignore
 * @name series[].lineType
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "straight"
 * @ojvalue {string} "curved"
 * @ojvalue {string} "stepped"
 * @ojvalue {string} "centeredStepped"
 * @ojvalue {string} "segmented"
 * @ojvalue {string} "centeredSegmented"
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 *  The URI of the custom image. If specified, it takes precedence over shape.
 * @expose
 * @ojtsignore
 * @name series[].source
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the hover state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name series[].sourceHover
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the selected state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name series[].sourceSelected
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the hover selected state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name series[].sourceHoverSelected
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * A number from 0 to 1 indicating the amount to explode the pie slice. Only applies to pie charts.
 * @expose
 * @ojtsignore
 * @name series[].pieSliceExplode
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default 0
 * @ojmin 0
 * @ojmax 1
 */
/**
 * Defines whether the series is associated with the y2 axis. Only applies to Cartesian bar, line, area, and combo charts.
 * @expose
 * @ojtsignore
 * @name series[].assignedToY2
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * In stacked charts, groups series together for stacking. All series without a stackCategory will be assigned to the same stack.
 * @expose
 * @ojtsignore
 * @name series[].stackCategory
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the series should be shown in the legend. When set to 'auto', the series will not be displayed in the legend if it has null data or if it is a stock, funnel, or pyramid series.
 * @expose
 * @ojtsignore
 * @name series[].displayInLegend
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 *  Whether drilling is enabled on the series item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all series items at once, use the drilling attribute in the top level.
 * @expose
 * @ojtsignore
 * @name series[].drilling
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * An optional array of category strings corresponding to this series. This allows highlighting and filtering of a series through interactions with legend sections. If not defined, the series id is used.
 * @expose
 * @ojtsignore
 * @name series[].categories
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The description of this series. This is used for accessibility and for customizing the tooltip text on the corressponding legend item for the series.
 * @expose
 * @ojtsignore
 * @name series[].shortDesc
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * An object containing the style properties of the box plot series.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The color of the Q2 segment of the box.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.q2Color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS style class to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.q2SvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS inline style to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.q2SvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The color of the Q3 segment of the box.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.q3Color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS style class to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.q3SvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS inline style to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.q3SvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the whisker stems.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.whiskerSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the whisker stems.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.whiskerSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the whisker ends.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.whiskerEndSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the whisker ends.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.whiskerEndSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  Specifies the length of the whisker ends in pixels (e.g. '9px') or as a percentage of the box width (e.g. '50%').
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.whiskerEndLength
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the median line.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.medianSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the median line.
 * @expose
 * @ojtsignore
 * @name series[].boxPlot.medianSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * An array of strings identifying the group labels, or an array of objects with the following properties. Also accepts a Promise for deferred data rendering.
 * @expose
 * @name groups
 * @memberof oj.ojChart
 * @instance
 * @type {Array.<Object>|Array.<string>|Promise}
 * @default null
 */
/**
 * The name of the group.
 * @expose
 * @name groups[].name
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The id of the group. Defaults to the name if not specified.
 * @expose
 * @name groups[].id
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style object defining the style of the group label text. Supports color,
 * fontFamily, fontSize, fontStyle, fontWeight, textDecoration, cursor,
 * backgroundColor, borderColor, borderRadius, and borderWidth properties.
 * Only applies to a categorical axis.
 * @name groups[].labelStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The description of the group. This is used for customizing the tooltip text and only applies to a categorical axis.
 * @expose
 * @name groups[].shortDesc
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 *  Whether drilling is enabled on the group label. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all group labels at once, use the drilling attribute in the top level.
 * @expose
 * @name groups[].drilling
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * An array of nested group objects.
 * @expose
 * @name groups[].groups
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>|Array.<Object>}
 * @default null
 */
/**
 * An array used to define the ids of the initially selected objects.
 * When the selection is changed, the <code class="prettyprint">event.detail</code> of the <code class="prettyprint">selectionChanged</code> event will contain the following additional properties:<br><br>
 * <table class="props">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Type</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td class="name"><code>selectionData</code></td>
 *       <td class="type">Object</td>
 *       <td class="description">an array containing objects describing the selected data items
 *         <h6>Properties</h6>
 *         <table class="props">
 *           <thead>
 *             <tr>
 *               <th>Name</th>
 *               <th>Type</th>
 *               <th>Description</th>
 *             </tr>
 *           </thead>
 *           <tbody>
 *             <tr>
 *               <td class="name"><code>data</code></td>
 *               <td class="type">object</td>
 *               <td class="description">the data of the item, if one was specified</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>groupData</code></td>
 *               <td class="type">Array</td>
 *               <td class="description">the group data of the item</td>
 *             </tr>
 *             <tr>
 *               <td class="name"><code>seriesData</code></td>
 *               <td class="type">object</td>
 *               <td class="description">the series data of the item</td>
 *             </tr>
 *           </tbody>
 *         </table>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>endGroup</code></td>
 *       <td class="type">string</td>
 *       <td class="description">the end group of a marquee selection on a chart with categorical axis</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>startGroup</code></td>
 *       <td class="type">string</td>
 *       <td class="description">the start group of a marquee selection on a chart with categorical axis</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>xMax</code></td>
 *       <td class="type">number</td>
 *       <td class="description">the maximum x value of a marquee selection</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>xMin</code></td>
 *       <td class="type">number</td>
 *       <td class="description">the minimum x value of a marquee selection</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>yMax</code></td>
 *       <td class="type">number</td>
 *       <td class="description">the maximum y value of a marquee selection</td>
 *     </tr>
 *     <tr>
 *       <td class="name"><code>yMin</code></td>
 *       <td class="type">number</td>
 *       <td class="description">the minimum y value of a marquee selection</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @expose
 * @name selection
 * @memberof oj.ojChart
 * @instance
 * @type {Array.<any>}
 * @default []
 * @ojwriteback
 */
/**
 * Defines whether the plot area is split into two sections, so that sets of data assigned to the different Y-axes appear in different parts of the plot area. Stock charts do not support "off".
 * @expose
 * @name splitDualY
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * In a split dual-Y chart, specifies the fraction of the space that is given to the Y-axis subchart. Valid values are numbers from 0 to 1.
 * @expose
 * @name splitterPosition
 * @memberof oj.ojChart
 * @instance
 * @type {number}
 * @default 0.5
 * @ojmin 0
 * @ojmax 1
 */
/**
 * The type of time axis to display in the chart. Time axis is only supported for Cartesian bar, line, area, stock, box plot, and combo charts. If the type is "enabled" or "skipGaps", the time values must be provided through the "groups" attribute and stacking is supported. If the type is "skipGaps", the groups will be rendered at a regular interval regardless of any time gaps that may exist in the data. If the type is "mixedFrequency", the time values must be provided through the "x" attribute of the the data items and stacking is not supported.
 * @expose
 * @name timeAxisType
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "enabled"
 * @ojvalue {string} "mixedFrequency"
 * @ojvalue {string} "skipGaps"
 * @ojvalue {string} "disabled"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The type of selection behavior that is enabled on the chart.
 * @expose
 * @name selectionMode
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "single"
 * @ojvalue {string} "multiple"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * The action that is performed when a drag occurs on the chart. Pan and marquee zoom are only available if zoom and scroll is turned on. Marquee select is only available if multiple selection is turned on. If the value is set to "user" and multiple actions are available, buttons will be displayed on the plot area to let users switch between modes.
 * @expose
 * @name dragMode
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "pan"
 * @ojvalue {string} "zoom"
 * @ojvalue {string} "select"
 * @ojvalue {string} "off"
 * @ojvalue {string} "user"
 * @default "user"
 */
/**
 * The chart type.
 * @expose
 * @name type
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "line"
 * @ojvalue {string} "area"
 * @ojvalue {string} "lineWithArea"
 * @ojvalue {string} "stock"
 * @ojvalue {string} "boxPlot"
 * @ojvalue {string} "combo"
 * @ojvalue {string} "pie"
 * @ojvalue {string} "scatter"
 * @ojvalue {string} "bubble"
 * @ojvalue {string} "funnel"
 * @ojvalue {string} "pyramid"
 * @ojvalue {string} "bar"
 * @default "bar"
 */
/**
 * Defines whether the data items are stacked. Only applies to bar, line, area, and combo charts. Does not apply to range series.
 * @expose
 * @name stack
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * Defines whether or not the total values of stacked data items should be displayed. Only applies to bar charts. It can be formatted by the valueFormat of the type 'label'.
 * @expose
 * @name stackLabel
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * The chart orientation. Only applies to bar, line, area, combo, box plot, and funnel charts.
 * @expose
 * @name orientation
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "horizontal"
 * @ojvalue {string} "vertical"
 * @default "vertical"
 */
/**
 * Defines whether the grid shape of the polar chart is circle or polygon. Only applies to polar line and area charts.
 * @expose
 * @name polarGridShape
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "polygon"
 * @ojvalue {string} "circle"
 * @default "circle"
 */
/**
 * The coordinate system of the chart. Only applies to bar, line, area, combo, scatter, and bubble charts.
 * @expose
 * @name coordinateSystem
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "polar"
 * @ojvalue {string} "cartesian"
 * @default "cartesian"
 */
/**
 * Defines the hide and show behavior that is performed when clicking on a legend item. When data items are hidden, the y axes can be optionally rescaled to fit to the remaining data.
 * @expose
 * @name hideAndShowBehavior
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "withRescale"
 * @ojvalue {string} "withoutRescale"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * An array of category strings used for filtering. Series or data items with any category matching an item in this array will be filtered.
 * @expose
 * @name hiddenCategories
 * @memberof oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default []
 * @ojwriteback
 */
/**
 * Defines the behavior applied when hovering over data items.
 * @expose
 * @name hoverBehavior
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dim"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * An array of category strings used for highlighting. Series or data items matching all categories in this array will be highlighted.
 * @expose
 * @name highlightedCategories
 * @memberof oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default []
 * @ojwriteback
 */
/**
 * The matching condition for the highlightedCategories property. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
 * @expose
 * @name highlightMatch
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "any"
 * @ojvalue {string} "all"
 * @default "all"
 */
/**
 * Defines the animation that is applied on data changes. Animation is automatically disabled when there are a large number of data items.
 * @expose
 * @name animationOnDataChange
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "slideToLeft"
 * @ojvalue {string} "slideToRight"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * Defines the animation that is shown on initial display. Animation is automatically disabled when there are a large number of data items.
 * @expose
 * @name animationOnDisplay
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "alphaFade"
 * @ojvalue {string} "zoom"
 * @ojvalue {string} "none"
 * @default "none"
 */
 /**
 * An alias for the $current context variable when referenced inside the item, series or group templates when using a DataProvider.
 * @expose
 * @name as
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @default ""
 */
/**
 * The DataProvider for the chart. It should provide data rows where each row will map data for a single chart data item. If multiple rows map to the same group/series, only one of those rows will be rendered. The row key will be used as the id for chart items.
 * @expose
 * @name data
 * @memberof oj.ojChart
 * @instance
 * @type {oj.DataProvider|null}
 * @default null
 */
/**
 * A comparator function that determines the ordering of the chart series when using a DataProvider. If undefined, the series will follow the order in which they are found in the data. The series objects will have the same properties as the context for <a href="#seriesTemplate">seriesTemplate's $current</a>.
 * @expose
 * @name seriesComparator
 * @memberof oj.ojChart
 * @instance
 * @type {function(Object, Object)}
 * @default null
 */
/**
 * A comparator function that determines the ordering of the chart groups when using a DataProvider. If undefined, the group will follow the order in which they are found in the data. The group objects will have the same properties as the context for <a href="#groupTemplate">groupTemplate's $current</a>.
 * @expose
 * @name groupComparator
 * @memberof oj.ojChart
 * @instance
 * @type {function(Object, Object)}
 * @default null
 */
/**
 * Defines whether the data cursor is enabled. If set to "auto", the data cursor is shown only for line or area charts on touch devices. The data cursor is not shown when the tooltip is null and it is not supported on polar charts.
 * @expose
 * @name dataCursor
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Defines the behavior of the data cursor when moving between data items.
 * @expose
 * @name dataCursorBehavior
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "smooth"
 * @ojvalue {string} "snap"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Speficies the position of the data cursor. Used for synchronizing data cursors across multiple charts. Null if the data cursor is not displayed.
 * @expose
 * @name dataCursorPosition
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 * @ojwriteback
 */
/**
 * The x value of the data cursor.
 * @expose
 * @name dataCursorPosition.x
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The y value of the data cursor. If both y and y2 are defined, y will take precedence.
 * @expose
 * @name dataCursorPosition.y
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The y2 value of the data cursor. If both y and y2 are defined, y will take precedence.
 * @expose
 * @name dataCursorPosition.y2
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * Specifies the sorting of the data. It should only be used for pie charts, bar/line/area charts with one series, or stacked bar/area charts. Sorting will not apply when using a hierarchical group axis.
 * @expose
 * @name sorting
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "ascending"
 * @ojvalue {string} "descending"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * Specifies the fraction of the whole pie under which a slice would be aggregated into an "Other" slice. Valid values range from 0 (default) to 1. For example, a value of 0.1 would cause all slices which are less than 10% of the pie to be aggregated into the "Other" slice. Only applies to pie chart.
 * @expose
 * @name otherThreshold
 * @memberof oj.ojChart
 * @instance
 * @type {number}
 * @default 0
 * @ojmin 0
 * @ojmax 1
 */
/**
 * An object defining the center content of a pie chart. Either a label can be displayed at the center of the pie chart or custom HTML content.
 * @expose
 * @name pieCenter
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to format the label if it is numeric. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name pieCenter.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the label if it is numeric. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name pieCenter.scaling
 * @memberof! oj.ojChart
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
 * Specifies the text for the label. When a innerRadius is specified, the label will automatically be scaled to fit within the inner circle. If the innerRadius is 0, the default font size will be used.
 * @expose
 * @name pieCenter.label
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The CSS style object defining the style of the label.
 * @expose
 * @name pieCenter.labelStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * A function that returns custom center content. The function takes a dataContext argument,
 * provided by the chart, with the following properties:
 * <ul>
 *   <li>outerBounds: Object containing (x, y, width, height) of the rectangle
 *   circumscribing the center area. The x and y coordinates are relative to the top,
 *   left corner of the element.</li>
 *   <li>innerBounds: Object containing (x, y, width, height) of the rectangle
 *   inscribed in the center area. The x and y coordinates are relative to the top,
 *   left corner of the element.</li>
 *   <li>label: The pieCenter label.</li>
 *   <li>componentElement: The chart element.</li>
 * </ul>
 * The function should return an Object with the following property:
 * <ul>
 *   <li>insert: HTMLElement - An HTML element, which will be overlaid on top of the pie chart.
 *   This HTML element will block interactivity of the chart  by default, but the CSS pointer-events property
 *   can be set to 'none' on this element if the chart's interactivity is desired.
 *   </li>
 * </ul>
 * @expose
 * @name pieCenter.renderer
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Object)}
 * @default null
 */
/**
 * An object defining properties for the axis, tick marks, tick labels, and axis titles.
 * @expose
 * @name xAxis
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines whether the axis is rendered.
 * @expose
 * @name xAxis.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * Defines the size of the axis in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name xAxis.size
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines the maximum size of the axis in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name xAxis.maxSize
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The axis title. Does not apply to polar charts.
 * @expose
 * @name xAxis.title
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The array of reference objects associated with the axis.
 * @expose
 * @name xAxis.referenceObjects
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>}
 * @default []
 */
/**
 * The id of the reference object.
 * @expose
 * @name xAxis.referenceObjects[].id
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An optional array of category strings corresponding to this reference object. This allows highlighting and filtering of a reference object through interactions with legend sections. If not defined, the reference object id is used.
 * @expose
 * @name xAxis.referenceObjects[].categories
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The text displayed in the legend for the reference object.
 * @expose
 * @name xAxis.referenceObjects[].text
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The type of reference object being shown.
 * @expose
 * @name xAxis.referenceObjects[].type
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "area"
 * @ojvalue {string} "line"
 * @default "line"
 */
/**
 * The location of the reference object relative to the data items.
 * @expose
 * @name xAxis.referenceObjects[].location
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "front"
 * @ojvalue {string} "back"
 * @default "back"
 */
/**
 * The color of the reference object.
 * @expose
 * @name xAxis.referenceObjects[].color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of the reference line.
 * @expose
 * @name xAxis.referenceObjects[].lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The line style of the reference line.
 * @expose
 * @name xAxis.referenceObjects[].lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The line type of the reference line. Only applies if the line value is not constant. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
 * @expose
 * @name xAxis.referenceObjects[].lineType
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "curved"
 * @ojvalue {string} "stepped"
 * @ojvalue {string} "centeredStepped"
 * @ojvalue {string} "segmented"
 * @ojvalue {string} "centeredSegmented"
 * @ojvalue {string} "straight"
 * @default "straight"
 */
/**
 * The CSS style class to apply to the reference object. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the reference object color attribute.
 * @expose
 * @name xAxis.referenceObjects[].svgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the reference object. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the reference object color attribute.
 * @expose
 * @name xAxis.referenceObjects[].svgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The value of a reference line. For categorical axes, the value represents the group index. For example,   0 is the position of the first group, and 1.5 is the position half way between the second and the third group.
 * @expose
 * @name xAxis.referenceObjects[].value
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The low value of a reference area. For categorical axes, the value represents the group index. For example,   0 is the position of the first group, and 1.5 is the position half way between the second and the third group.
 * @expose
 * @name xAxis.referenceObjects[].low
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The high value of a reference area. For categorical axes, the value represents the group index. For example,    0 is the position of the first group, and 1.5 is the position half way between the second and the third group.
 * @expose
 * @name xAxis.referenceObjects[].high
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The description of this object. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name xAxis.referenceObjects[].shortDesc
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the reference object should be shown in the legend.
 * @expose
 * @name xAxis.referenceObjects[].displayInLegend
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * The minimum value of the axis. Defaults to null for automatic calculation based on the data. For categorical axes, the value represents the group index. For example, 0 is the position of the first group, and 1.5 is the position half way between the second and the third group.
 * @expose
 * @name xAxis.min
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The maximum value of the axis. Defaults to null for automatic calculation based on the data. For categorical axes, the value represents the group index. For example, 0 is the position of the first group, and 1.5 is the position half way between the second and the third group.
 * @expose
 * @name xAxis.max
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The minimum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value. Only applies to numerical axes.
 * @expose
 * @name xAxis.dataMin
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The maximum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value. Only applies to numerical axes.
 * @expose
 * @name xAxis.dataMax
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The increment between major tick marks. Defaults to null for automatic calculation based on the data. Only applies to time and numerical axes. For log axis, the step is a multiplier, so for example, if the step is 2, the major tick marks will be rendered at 1, 2, 4, 8, and so on.
 * @expose
 * @name xAxis.step
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * The minimum increment between major tick marks. This is typically used to prevent fractional axis values for discrete measures. Only applies to numerical axes.
 * @expose
 * @name xAxis.minStep
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * The increment between minor tick marks. Defaults to null for automatic calculation based on the data. Only applies to numerical axes. For log axis, the step is a multiplier, so for example, if the minorStep is 2, the minor tick marks will be rendered at 1, 2, 4, 8, and so on.
 * @expose
 * @name xAxis.minorStep
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * Defines the axis scale. Only applies to numerical axes.
 * @expose
 * @name xAxis.scale
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "log"
 * @ojvalue {string} "linear"
 * @default "linear"
 */
/**
 * The CSS style object defining the style of the axis title. The CSS white-space property can be defined with value "nowrap" to disable default text wrapping of the title.
 * @expose
 * @name xAxis.titleStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An object defining the properties of the tick labels.
 * @expose
 * @name xAxis.tickLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines whether the tick labels are rendered.
 * @expose
 * @name xAxis.tickLabel.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * The CSS style object defining the style of the labels. The CSS white-space property can be defined with value "nowrap" to disable default text wrapping of categorical labels.
 * @expose
 * @name xAxis.tickLabel.style
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name xAxis.tickLabel.scaling
 * @memberof! oj.ojChart
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
 * Defines whether the chart will automatically rotate the labels by 90 degrees in order to fit more labels on the axis. The rotation will only be applied to categorical labels for a horizontal axis.
 * @expose
 * @name xAxis.tickLabel.rotation
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to format the labels. When using a time axis, this attribute also takes an array of two converters, which apply respectively to the first and second label levels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name xAxis.tickLabel.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * An object defining properties for the axis line.
 * @expose
 * @name xAxis.axisLine
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the axis line.
 * @expose
 * @name xAxis.axisLine.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of the axis line.
 * @expose
 * @name xAxis.axisLine.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the axis line is rendered.
 * @expose
 * @name xAxis.axisLine.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * An object defining properties for the major tick marks.
 * @expose
 * @name xAxis.majorTick
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the major tick marks.
 * @expose
 * @name xAxis.majorTick.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The line style of the major tick marks.
 * @expose
 * @name xAxis.majorTick.lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The width of the major tick marks.
 * @expose
 * @name xAxis.majorTick.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The color of the major tick mark at the baseline (x = 0). Valid values are auto, inherit, or a custom color. If set to inherit, it will follow the lineColor attribute.
 * @expose
 * @name xAxis.majorTick.baselineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "inherit"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The line style of the major tick mark at the baseline (x = 0). If not specified, it will follow the lineStyle attribute.
 * @expose
 * @name xAxis.majorTick.baselineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The width of the major tick mark at the baseline (x = 0) If not specified, it will follow the lineWidth attribute.
 * @expose
 * @name xAxis.majorTick.baselineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the major tick marks are rendered.
 * @expose
 * @name xAxis.majorTick.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * An object defining properties for the minor tick marks.
 * @expose
 * @name xAxis.minorTick
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the minor tick marks.
 * @expose
 * @name xAxis.minorTick.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The line style of the minor tick marks.
 * @expose
 * @name xAxis.minorTick.lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The width of the minor tick marks.
 * @expose
 * @name xAxis.minorTick.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the minor tick marks are rendered.
 * @expose
 * @name xAxis.minorTick.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Defines whether the axis baseline starts at the minimum value of the data or at zero. Only applies to numerical data axes.
 * @expose
 * @name xAxis.baselineScaling
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "min"
 * @ojvalue {string} "zero"
 * @default "zero"
 */
/**
 * Specifies the minimum x coordinate of the current viewport for zoom and scroll. For group axis, the group index will be treated as the axis coordinate. If both viewportStartGroup and viewportMin are specified, then viewportMin takes precedence. If not specified, this value will be the axis min.
 * @expose
 * @name xAxis.viewportMin
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * Specifies the maximum x coordinate of the current viewport for zoom and scroll. For group axis, the group index will be treated as the axis coordinate. If both viewportEndGroup and viewportMax are specified, then viewportMax takes precedence. If not specified, this value will be the axis max.
 * @expose
 * @name xAxis.viewportMax
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * Specifies the start group of the current viewport. Only applies to charts with group or time axis. If not specified, the default start group is the first group in the data set.
 * @expose
 * @name xAxis.viewportStartGroup
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * Specifies the end group of the current viewport. Only applies to charts with group or time axis. If not specified, the default end group is the last group in the data set.
 * @expose
 * @name xAxis.viewportEndGroup
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * An object defining properties for the axis, tick marks, tick labels, and axis titles.
 * @expose
 * @name yAxis
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines whether the axis is rendered.
 * @expose
 * @name yAxis.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * Defines the size of the axis in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name yAxis.size
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines the maximum size of the axis in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name yAxis.maxSize
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The axis title. Does not apply to polar charts.
 * @expose
 * @name yAxis.title
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The position of the axis relative to its content. For vertical charts, only start and end apply. For horizontal charts, only top and bottom apply.
 * @expose
 * @name yAxis.position
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "start"
 * @ojvalue {string} "end"
 * @ojvalue {string} "top"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The array of reference objects associated with the axis.
 * @expose
 * @name yAxis.referenceObjects
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>}
 * @default []
 */
/**
 * The id of the reference object.
 * @expose
 * @name yAxis.referenceObjects[].id
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An optional array of category strings corresponding to this reference object. This allows highlighting and filtering of a reference object through interactions with legend sections. If not defined, the reference object id is used.
 * @expose
 * @name yAxis.referenceObjects[].categories
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The text displayed in the legend for the reference object.
 * @expose
 * @name yAxis.referenceObjects[].text
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The type of reference object being shown.
 * @expose
 * @name yAxis.referenceObjects[].type
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "area"
 * @ojvalue {string} "line"
 * @default "line"
 */
/**
 * The location of the reference object relative to the data items.
 * @expose
 * @name yAxis.referenceObjects[].location
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "front"
 * @ojvalue {string} "back"
 * @default "back"
 */
/**
 * The color of the reference object.
 * @expose
 * @name yAxis.referenceObjects[].color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of the reference line.
 * @expose
 * @name yAxis.referenceObjects[].lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The line style of the reference line.
 * @expose
 * @name yAxis.referenceObjects[].lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The line type of the reference line. Only applies if the line value is not constant. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
 * @expose
 * @name yAxis.referenceObjects[].lineType
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "curved"
 * @ojvalue {string} "stepped"
 * @ojvalue {string} "centeredStepped"
 * @ojvalue {string} "segmented"
 * @ojvalue {string} "centeredSegmented"
 * @ojvalue {string} "straight"
 * @default "straight"
 */
/**
 * The CSS style class to apply to the reference object. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the reference object color attribute.
 * @expose
 * @name yAxis.referenceObjects[].svgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the reference object. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the reference object color attribute.
 * @expose
 * @name yAxis.referenceObjects[].svgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The value of a reference line. This property defines a constant value across the entire reference line and is ignored if the items array is specified.
 * @expose
 * @name yAxis.referenceObjects[].value
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The low value of a reference area. This property defines a constant value across the entire reference area and is ignored if the items array is specified.
 * @expose
 * @name yAxis.referenceObjects[].low
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The high value of a reference area. This property defines a constant value across the entire reference area and is ignored if the items array is specified.
 * @expose
 * @name yAxis.referenceObjects[].high
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The description of this object. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name yAxis.referenceObjects[].shortDesc
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the reference object should be shown in the legend.
 * @expose
 * @name yAxis.referenceObjects[].displayInLegend
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * An array of values or an array of objects with the following properties that defines the data for a varying reference object. Only supported for y1 and y2 axes for all chart types.
 * @expose
 * @name yAxis.referenceObjects[].items
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>|Array.<number>}
 * @default null
 */
/**
 * The low value of this point of a reference area.
 * @expose
 * @name yAxis.referenceObjects[].items[].low
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The high value of this point of a reference area.
 * @expose
 * @name yAxis.referenceObjects[].items[].high
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The value of this point of a line object. Null can be specified to skip a data point.
 * @expose
 * @name yAxis.referenceObjects[].items[].value
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The x value of this point. Mainly used for scatter and bubble chart and to specify the date for mixed-frequency time axis.
 * For categorical axis, if the x value is not specified, it will default to the item index.
 * For regular time axis, if the x value is not specified, it will default to the group name of the item.
 * @expose
 * @name yAxis.referenceObjects[].items[].x
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The minimum value of the axis. Defaults to null for automatic calculation based on the data.
 * @expose
 * @name yAxis.min
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The maximum value of the axis. Defaults to null for automatic calculation based on the data.
 * @expose
 * @name yAxis.max
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The minimum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value.
 * @expose
 * @name yAxis.dataMin
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The maximum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value.
 * @expose
 * @name yAxis.dataMax
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The increment between major tick marks. Defaults to null for automatic calculation based on the data. For log axis, the step is a multiplier, so for example, if the step is 2, the major tick marks will be rendered at 1, 2, 4, 8, and so on.
 * @expose
 * @name yAxis.step
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * The minimum increment between major tick marks. This is typically used to prevent fractional axis values for discrete measures.
 * @expose
 * @name yAxis.minStep
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * The increment between minor tick marks. Defaults to null for automatic calculation based on the data. For log axis, the step is a multiplier, so for example, if the minorStep is 2, the minor tick marks will be rendered at 1, 2, 4, 8, and so on.
 * @expose
 * @name yAxis.minorStep
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * Defines the axis scale. Only applies to numerical axes.
 * @expose
 * @name yAxis.scale
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "log"
 * @ojvalue {string} "linear"
 * @default "linear"
 */
/**
 * The CSS style object defining the style of the axis title. The CSS white-space property can be defined with value "nowrap" to disable default text wrapping of the title.
 * @expose
 * @name yAxis.titleStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An object defining the properties of the tick labels.
 * @expose
 * @name yAxis.tickLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines whether the tick labels are rendered.
 * @expose
 * @name yAxis.tickLabel.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * Defines the position of the tick labels relative to the plot area. Inside position is not supported for scatter and bubble charts.
 * @expose
 * @name yAxis.tickLabel.position
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "inside"
 * @ojvalue {string} "outside"
 * @default "outside"
 */
/**
 * The CSS style object defining the style of the labels.
 * @expose
 * @name yAxis.tickLabel.style
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name yAxis.tickLabel.scaling
 * @memberof! oj.ojChart
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
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name yAxis.tickLabel.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * An object defining properties for the axis line.
 * @expose
 * @name yAxis.axisLine
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the axis line.
 * @expose
 * @name yAxis.axisLine.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of the axis line.
 * @expose
 * @name yAxis.axisLine.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the axis line is rendered.
 * @expose
 * @name yAxis.axisLine.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * An object defining properties for the major tick marks.
 * @expose
 * @name yAxis.majorTick
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the major tick marks.
 * @expose
 * @name yAxis.majorTick.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of the major tick marks.
 * @expose
 * @name yAxis.majorTick.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The line style of the major tick marks.
 * @expose
 * @name yAxis.majorTick.lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The color of the major tick mark at the baseline (y = 0). Valid values are auto, inherit, or a custom color. If set to inherit, it will follow the lineColor attribute.
 * @expose
 * @name yAxis.majorTick.baselineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "inherit"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The line style of the major tick mark at the baseline (y = 0). If not specified, it will follow the lineStyle attribute.
 * @expose
 * @name yAxis.majorTick.baselineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The width of the major tick mark at the baseline (y = 0) If not specified, it will follow the lineWidth attribute.
 * @expose
 * @name yAxis.majorTick.baselineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the major tick marks are rendered.
 * @expose
 * @name yAxis.majorTick.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * An object defining properties for the minor tick marks.
 * @expose
 * @name yAxis.minorTick
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the minor tick marks.
 * @expose
 * @name yAxis.minorTick.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The line style of the minor tick marks.
 * @expose
 * @name yAxis.minorTick.lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The width of the minor tick marks.
 * @expose
 * @name yAxis.minorTick.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the minor tick marks are rendered.
 * @expose
 * @name yAxis.minorTick.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Defines whether the axis baseline starts at the minimum value of the data or at zero. Only applies to numerical data axes.
 * @expose
 * @name yAxis.baselineScaling
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "min"
 * @ojvalue {string} "zero"
 * @default "zero"
 */
/**
 * Specifies the minimum y coordinate of the current viewport for zoom and scroll. Only applies to bubble and scatter charts. If not specified, this value will be the axis min.
 * @expose
 * @name yAxis.viewportMin
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * Specifies the maximum y coordinate of the current viewport for zoom and scroll. Only applies to bubble and scatter charts. If not specified, this value will be the axis max.
 * @expose
 * @name yAxis.viewportMax
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * An object defining properties for the axis, tick marks, tick labels, and axis titles. Y2 axis is only supported for Cartesian bar, line, area, and combo charts.
 * @expose
 * @name y2Axis
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines whether the axis is rendered.
 * @expose
 * @name y2Axis.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * Defines the size of the axis in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name y2Axis.size
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines the maximum size of the axis in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name y2Axis.maxSize
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The axis title.
 * @expose
 * @name y2Axis.title
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The position of the axis relative to its content. For vertical charts, only start and end apply. For horizontal charts, only top and bottom apply.
 * @expose
 * @name y2Axis.position
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "start"
 * @ojvalue {string} "end"
 * @ojvalue {string} "top"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The array of reference objects associated with the axis.
 * @expose
 * @name y2Axis.referenceObjects
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>}
 * @default []
 */
/**
 * The id of the reference object.
 * @expose
 * @name y2Axis.referenceObjects[].id
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An optional array of category strings corresponding to this reference object. This allows highlighting and filtering of a reference object through interactions with legend sections. If not defined, the reference object id is used.
 * @expose
 * @name y2Axis.referenceObjects[].categories
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The text displayed in the legend for the reference object.
 * @expose
 * @name y2Axis.referenceObjects[].text
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The type of reference object being shown.
 * @expose
 * @name y2Axis.referenceObjects[].type
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "area"
 * @ojvalue {string} "line"
 * @default "line"
 */
/**
 * The location of the reference object relative to the data items.
 * @expose
 * @name y2Axis.referenceObjects[].location
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "front"
 * @ojvalue {string} "back"
 * @default "back"
 */
/**
 * The color of the reference object.
 * @expose
 * @name y2Axis.referenceObjects[].color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of the reference line.
 * @expose
 * @name y2Axis.referenceObjects[].lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The line style of the reference line.
 * @expose
 * @name y2Axis.referenceObjects[].lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The line type of the reference line. Only applies if the line value is not constant. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
 * @expose
 * @name y2Axis.referenceObjects[].lineType
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "curved"
 * @ojvalue {string} "stepped"
 * @ojvalue {string} "centeredStepped"
 * @ojvalue {string} "segmented"
 * @ojvalue {string} "centeredSegmented"
 * @ojvalue {string} "straight"
 * @default "straight"
 */
/**
 * The CSS style class to apply to the reference object. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the reference object color attribute.
 * @expose
 * @name y2Axis.referenceObjects[].svgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the reference object. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the reference object color attribute.
 * @expose
 * @name y2Axis.referenceObjects[].svgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The value of a reference line. This property defines a constant value across the entire reference line and is ignored if the items array is specified.
 * @expose
 * @name y2Axis.referenceObjects[].value
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The low value of a reference area. This property defines a constant value across the entire reference area and is ignored if the items array is specified.
 * @expose
 * @name y2Axis.referenceObjects[].low
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The high value of a reference area. This property defines a constant value across the entire reference area and is ignored if the items array is specified.
 * @expose
 * @name y2Axis.referenceObjects[].high
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The description of this object. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name y2Axis.referenceObjects[].shortDesc
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the reference object should be shown in the legend.
 * @expose
 * @name y2Axis.referenceObjects[].displayInLegend
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * An array of values or an array of objects with the following properties that defines the data for a varying reference object. Only supported for y1 and y2 axes for all chart types.
 * @expose
 * @name y2Axis.referenceObjects[].items
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>|Array.<number>}
 * @default null
 */
/**
 * The low value of this point of a reference area.
 * @expose
 * @name y2Axis.referenceObjects[].items[].low
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The high value of this point of a reference area.
 * @expose
 * @name y2Axis.referenceObjects[].items[].high
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The value of this point of a line object. Null can be specified to skip a data point.
 * @expose
 * @name y2Axis.referenceObjects[].items[].value
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The x value of this point. Mainly used for scatter and bubble chart and to specify the date for mixed-frequency time axis.
 * For categorical axis, if the x value is not specified, it will default to the item index.
 * For regular time axis, if the x value is not specified, it will default to the group name of the item.
 * @expose
 * @name y2Axis.referenceObjects[].items[].x
 * @memberof! oj.ojChart
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The minimum value of the axis. Defaults to null for automatic calculation based on the data.
 * @expose
 * @name y2Axis.min
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The maximum value of the axis. Defaults to null for automatic calculation based on the data.
 * @expose
 * @name y2Axis.max
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The minimum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value.
 * @expose
 * @name y2Axis.dataMin
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The maximum data value corresponding to an axis. If specified, the automatic axis extent calculation will use this value.
 * @expose
 * @name y2Axis.dataMax
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The increment between major tick marks. Defaults to null for automatic calculation based on the data. For log axis, the step is a multiplier, so for example, if the step is 2, the major tick marks will be rendered at 1, 2, 4, 8, and so on.
 * @expose
 * @name y2Axis.step
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * The minimum increment between major tick marks. This is typically used to prevent fractional axis values for discrete measures.
 * @expose
 * @name y2Axis.minStep
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * The increment between minor tick marks. Defaults to null for automatic calculation based on the data. For log axis, the step is a multiplier, so for example, if the minorStep is 2, the minor tick marks will be rendered at 1, 2, 4, 8, and so on.
 * @expose
 * @name y2Axis.minorStep
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojexclusivemin 0
 */
/**
 * Defines the axis scale. Only applies to numerical axes.
 * @expose
 * @name y2Axis.scale
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "log"
 * @ojvalue {string} "linear"
 * @default "linear"
 */
/**
 * The CSS style object defining the style of the axis title. The CSS white-space property can be defined with value "nowrap" to disable default text wrapping of the title.
 * @expose
 * @name y2Axis.titleStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An object defining the properties of the tick labels.
 * @expose
 * @name y2Axis.tickLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines whether the tick labels are rendered.
 * @expose
 * @name y2Axis.tickLabel.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * Defines the position of the tick labels relative to the plot area.
 * @expose
 * @name y2Axis.tickLabel.position
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "inside"
 * @ojvalue {string} "outside"
 * @default "outside"
 */
/**
 * The CSS style object defining the style of the labels.
 * @expose
 * @name y2Axis.tickLabel.style
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name y2Axis.tickLabel.scaling
 * @memberof! oj.ojChart
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
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name y2Axis.tickLabel.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * An object defining properties for the axis line.
 * @expose
 * @name y2Axis.axisLine
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the axis line.
 * @expose
 * @name y2Axis.axisLine.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of the axis line.
 * @expose
 * @name y2Axis.axisLine.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the axis line is rendered.
 * @expose
 * @name y2Axis.axisLine.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * An object defining properties for the major tick marks.
 * @expose
 * @name y2Axis.majorTick
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the major tick marks.
 * @expose
 * @name y2Axis.majorTick.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The line style of the major tick marks.
 * @expose
 * @name y2Axis.majorTick.lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The width of the major tick marks.
 * @expose
 * @name y2Axis.majorTick.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The color of the major tick mark at the baseline (y = 0). Valid values are auto, inherit, or a custom color. If set to inherit, it will follow the lineColor attribute.
 * @expose
 * @name y2Axis.majorTick.baselineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "inherit"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The line style of the major tick mark at the baseline (y = 0). If not specified, it will follow the lineStyle attribute.
 * @expose
 * @name y2Axis.majorTick.baselineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The width of the major tick mark at the baseline (y = 0) If not specified, it will follow the lineWidth attribute.
 * @expose
 * @name y2Axis.majorTick.baselineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the major tick marks are rendered.
 * @expose
 * @name y2Axis.majorTick.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * An object defining properties for the minor tick marks.
 * @expose
 * @name y2Axis.minorTick
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The color of the minor tick marks.
 * @expose
 * @name y2Axis.minorTick.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The line style of the minor tick marks.
 * @expose
 * @name y2Axis.minorTick.lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The width of the minor tick marks.
 * @expose
 * @name y2Axis.minorTick.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * Defines whether the minor tick marks are rendered.
 * @expose
 * @name y2Axis.minorTick.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Defines whether the axis baseline starts at the minimum value of the data or at zero. Only applies to numerical data axes.
 * @expose
 * @name y2Axis.baselineScaling
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "min"
 * @ojvalue {string} "zero"
 * @default "zero"
 */
/**
 * Defines whether the tick marks of the y1 and y2 axes are aligned. Not supported for logarithmic axes.
 * @expose
 * @name y2Axis.alignTickMarks
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * An object defining the overview scrollbar. Only applies if zoomAndScroll is not off. Currently only supported for vertical bar, line, area, stock, and combo charts.
 * @expose
 * @name overview
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Specifies whether the overview scrollbar is rendered. If not, simple scrollbar will be used.
 * @expose
 * @name overview.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * Specifies the height of the overview scrollbar in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name overview.height
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An object containing the property override for the overview chart. The API is the same as the chart property API, and the property provided here will be merged on top of the default property of the overview chart. This can be used to customize the style or the type of the overview chart.
 * @expose
 * @name overview.content
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An object defining the style of the plot area.
 * @expose
 * @name plotArea
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The border color to be set on the chart's plot area.
 * @expose
 * @name plotArea.borderColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border width to be set on the chart's plot area.
 * @expose
 * @name plotArea.borderWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The color of the plot area background.
 * @expose
 * @name plotArea.backgroundColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Specifies whether the plot area is rendered.
 * @expose
 * @name plotArea.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * An object defining the style, positioning, and behavior of the legend.
 * @expose
 * @name legend
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The legend title.
 * @expose
 * @name legend.title
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * An array of objects with the following properties defining the additional legend sections, other than the default series and reference object sections.
 * @expose
 * @name legend.sections
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>}
 * @default []
 */
/**
 * The title of the legend section.
 * @expose
 * @name legend.sections[].title
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The horizontal alignment of the section title. If the section is collapsible or nested, only start alignment is supported.
 * @expose
 * @name legend.sections[].titleHalign
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default "start"
 */
/**
 * The CSS style object defining the style of the section title.
 * @expose
 * @name legend.sections[].titleStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * An array of nested legend sections.
 * @expose
 * @name legend.sections[].sections
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>}
 * @default null
 */
/**
 * An array of objects with the following properties defining the legend items. Also accepts a Promise for deferred data rendering.
 * @expose
 * @name legend.sections[].items
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<Object>|Promise}
 * @default null
 */
/**
 * The id of the legend item, which is provided as part of the context for events fired by this chart. If not specified, the id defaults to the text of the legend item.
 * @expose
 * @name legend.sections[].items[].id
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The legend item text.
 * @expose
 * @name legend.sections[].items[].text
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * An array of categories for the legend item. Legend items currently only support a single category. If no category is specified, this defaults to the id or text of the legend item.
 * @expose
 * @name legend.sections[].items[].categories
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The type of legend symbol to display.
 * @expose
 * @name legend.sections[].items[].symbolType
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "line"
 * @ojvalue {string} "lineWithMarker"
 * @ojvalue {string} "image"
 * @ojvalue {string} "marker"
 * @default "marker"
 */
/**
 * The URI of the image of the legend symbol.
 * @expose
 * @name legend.sections[].items[].source
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The color of the legend symbol (line or marker). When symbolType is "lineWithMarker", this attribute defines the line color and the markerColor attribute defines the marker color.
 * @expose
 * @name legend.sections[].items[].color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border color of the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @expose
 * @name legend.sections[].items[].borderColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The pattern used to fill the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @expose
 * @name legend.sections[].items[].pattern
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "smallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * The line style. Only applies when the symbolType is "line" or "lineWithMarker".
 * @expose
 * @name legend.sections[].items[].lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The line width in pixels. Only applies when the symbolType is "line" or "lineWithMarker".
 * @expose
 * @name legend.sections[].items[].lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The shape of the marker. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The legend will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and filter effects. Only applies if symbolType is "marker" or "lineWithMarker".
 * @expose
 * @name legend.sections[].items[].markerShape
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @ojvalue {string} "square"
 * @default "square"
 */
/**
 * The color of the marker, if different than the line color. Only applies if the symbolType is "lineWithMarker".
 * @expose
 * @name legend.sections[].items[].markerColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the legend item corresponds to visible data items. A hollow symbol is shown if the value is "hidden".
 * @expose
 * @name legend.sections[].items[].categoryVisibility
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "hidden"
 * @ojvalue {string} "visible"
 * @default "visible"
 */
/**
 * The description of this legend item. This is used for accessibility and for customizing the tooltip text.
 * @expose
 * @name legend.sections[].items[].shortDesc
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An object with the following properties for the series section in the legend.
 * @expose
 * @name legend.seriesSection
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The title of the series section.
 * @expose
 * @name legend.seriesSection.title
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The horizontal alignment of the section title. If the section is collapsible or nested, only start alignment is supported.
 * @expose
 * @name legend.seriesSection.titleHalign
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default "start"
 */
/**
 * The CSS style object defining the style of the section title.
 * @expose
 * @name legend.seriesSection.titleStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An object with the following properties for the reference object section in the legend.
 * @expose
 * @name legend.referenceObjectSection
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The title of the reference object section.
 * @expose
 * @name legend.referenceObjectSection.title
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The horizontal alignment of the section title. If the section is collapsible or nested, only start alignment is supported.
 * @expose
 * @name legend.referenceObjectSection.titleHalign
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default "start"
 */
/**
 * The CSS style object defining the style of the section title.
 * @expose
 * @name legend.referenceObjectSection.titleStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The position of the legend within the chart. By default, the legend will be placed on the side or bottom, based on the size of the chart and the legend contents.
 * @expose
 * @name legend.position
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "start"
 * @ojvalue {string} "end"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "top"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Defines whether the legend is displayed. If set to auto, the legend will be hidden for charts with a large number of series. To ensure that the legend is always displayed, set this attribute to 'on'. To turn on legend for stock, funnel and pyramid charts, set the displayInLegend property for the series items to 'on'.
 * @expose
 * @name legend.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Defines the size of the legend in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name legend.size
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines the maximum size of the legend in pixels (e.g. '50px') or percent (e.g. '15%').
 * @expose
 * @name legend.maxSize
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The color of the legend background.
 * @expose
 * @name legend.backgroundColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border color of the legend.
 * @expose
 * @name legend.borderColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style object defining the style of the legend text.
 * @expose
 * @name legend.textStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The width of the legend symbol (line or marker) in pixels.
 * @expose
 * @name legend.symbolWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The height of the legend symbol (line or marker) in pixels.
 * @expose
 * @name legend.symbolHeight
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The horizontal alignment of the title.
 * @expose
 * @name legend.titleHalign
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default "start"
 */
/**
 * The CSS style object defining the style of the title.
 * @expose
 * @name legend.titleStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines whether scrolling is enabled for the legend.
 * @expose
 * @name legend.scrolling
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "asNeeded"
 * @default "asNeeded"
 */
/**
 * An object defining the default styles for series colors, marker shapes, and other style attributes. Properties specified on this object may be overridden by specifications on the data object.
 * @expose
 * @name styleDefaults
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines the fill effect for the data items.
 * @expose
 * @name styleDefaults.seriesEffect
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "color"
 * @ojvalue {string} "pattern"
 * @ojvalue {string} "gradient"
 * @default "gradient"
 */
/**
 * The array defining the default color ramp for the series.
 * @expose
 * @name styleDefaults.colors
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The array defining the default pattern ramp for the series. This is used only when seriesEffect is 'pattern'.
 * @expose
 * @name styleDefaults.patterns
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * Specifies the color of the "Other" slice. Only applies to pie chart.
 * @expose
 * @name styleDefaults.otherColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The array defining the default shape ramp for the series. Valid values are defined in the markerShape attribute.
 * @expose
 * @name styleDefaults.shapes
 * @memberof! oj.ojChart
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The default border color for the data items. For funnel and pyramid charts, it is used for the slice border.
 * @expose
 * @name styleDefaults.borderColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The default border width for the data items. For funnel and pyramid charts, it is used for the slice border.
 * @expose
 * @name styleDefaults.borderWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The default background color of funnel slices that show actual/target values.
 * @expose
 * @name styleDefaults.funnelBackgroundColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the chart is displayed with a 3D effect. Only applies to pie, funnel and pyramid charts.
 * @expose
 * @name styleDefaults.threeDEffect
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * The selection effect that is applied to selected items. The values explode and highlightAndExplode only apply to pie charts.
 * @expose
 * @name styleDefaults.selectionEffect
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "explode"
 * @ojvalue {string} "highlightAndExplode"
 * @ojvalue {string} "highlight"
 * @default "highlight"
 */
/**
 * The duration of the animations, in milliseconds.
 * @expose
 * @name styleDefaults.animationDuration
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits milliseconds
 * @ojmin 0
 */
/**
 * Defines whether data change indicators are displayed during animation.
 * @expose
 * @name styleDefaults.animationIndicators
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "all"
 * @default "all"
 */
/**
 * The color of the indicator shown for an increasing data change animation.
 * @expose
 * @name styleDefaults.animationUpColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The color of the indicator shown for a decreasing data change animation.
 * @expose
 * @name styleDefaults.animationDownColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The fill color of the marquee. Applies to marquee selection and marquee zoom.
 * @expose
 * @name styleDefaults.marqueeColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border color of the marquee. Applies to marquee selection and marquee zoom.
 * @expose
 * @name styleDefaults.marqueeBorderColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  Specifies the radius of the inner circle that can be used to create a donut chart. Valid values range from 0 (default) to 1. Not supported if 3D effect is on.
 * @expose
 * @name styleDefaults.pieInnerRadius
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default 0
 * @ojmin 0
 * @ojmax 1
 */
/**
 * The width of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
 * @expose
 * @name styleDefaults.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The line type of the data line or area. Only applies to line, area, scatter, and bubble series. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
 * @expose
 * @name styleDefaults.lineType
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "straight"
 * @ojvalue {string} "curved"
 * @ojvalue {string} "stepped"
 * @ojvalue {string} "centeredStepped"
 * @ojvalue {string} "segmented"
 * @ojvalue {string} "centeredSegmented"
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The line style of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
 * @expose
 * @name styleDefaults.lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The color of the data markers, if different from the series color.
 * @expose
 * @name styleDefaults.markerColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the data markers should be displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
 * @expose
 * @name styleDefaults.markerDisplayed
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
 * @expose
 * @name styleDefaults.markerShape
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "square"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The size of the data markers in pixels.
 * @expose
 * @name styleDefaults.markerSize
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The color of the line extending from the pie slice to the slice label.
 * @expose
 * @name styleDefaults.pieFeelerColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Specifies the presence and size of the gaps between data items, such as bars, markers, and areas. Valid values are a percentage string from 0% to 100%, where 100% produces the maximum supported gaps.
 * @expose
 * @name styleDefaults.dataItemGaps
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * In stock charts, the color of the candlestick when the 'close' value is greater than the 'open' value.
 * @expose
 * @name styleDefaults.stockRisingColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * In stock charts, the color of the candlestick when the 'open' value is greater than the 'close' value.
 * @expose
 * @name styleDefaults.stockFallingColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * In stock charts, the color of the range bars for candlestick.
 * @expose
 * @name styleDefaults.stockRangeColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * In stock charts, the color of the volume bars. If specified, overrides the default rising and falling colors used by the volume bars.
 * @expose
 * @name styleDefaults.stockVolumeColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The position of the data label. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively. The 'outsideSlice' value only applies to pie charts. The 'aboveMarker', 'belowMarker', 'beforeMarker', and 'afterMarker' values only apply to line, area, scatter, and bubble series. The 'insideBarEdge' and 'outsideBarEdge' values only apply to non-polar bar series. Stacked bars do not support 'outsideBarEdge'. The chart does not currently adjust layout to fit labels within the plot area or deal with any overlaps between labels.
 * @expose
 * @name styleDefaults.dataLabelPosition
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @ojvalue {string} "center"
 * @ojvalue {string} "outsideSlice"
 * @ojvalue {string} "aboveMarker"
 * @ojvalue {string} "belowMarker"
 * @ojvalue {string} "beforeMarker"
 * @ojvalue {string} "afterMarker"
 * @ojvalue {string} "insideBarEdge"
 * @ojvalue {string} "outsideBarEdge"
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The CSS style object defining the style of the data label text. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively.
 * @expose
 * @name styleDefaults.dataLabelStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {object|Array.<Object>}
 * @default null
 */
/**
 * The CSS style object defining the style of the stack label. Only applies to stacked bar charts.
 * @expose
 * @name styleDefaults.stackLabelStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Specifies the width of the bar group gap as a ratio of the group width. The valid value is a number from 0 to 1.
 * @expose
 * @name styleDefaults.barGapRatio
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojmin 0
 * @ojmax 1
 */
/**
 * Specifies the maximum width of each bar in pixels.
 * @expose
 * @name styleDefaults.maxBarWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * Specifies initial hover delay in ms for highlighting items in chart.
 * @expose
 * @name styleDefaults.hoverBehaviorDelay
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits milliseconds
 * @ojmin 0
 */
/**
 * The CSS style object defining the style of the labels in the tooltip.
 * @expose
 * @name styleDefaults.tooltipLabelStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The CSS style object defining the style of the values in the tooltip.
 * @expose
 * @name styleDefaults.tooltipValueStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An object defining the data cursor style.
 * @expose
 * @name styleDefaults.dataCursor
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The width of the data cursor line in pixels.
 * @expose
 * @name styleDefaults.dataCursor.lineWidth
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The color of the data cursor line.
 * @expose
 * @name styleDefaults.dataCursor.lineColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The line style of the data cursor line.
 * @expose
 * @name styleDefaults.dataCursor.lineStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The color of the data cursor marker. Defaults to the data series color.
 * @expose
 * @name styleDefaults.dataCursor.markerColor
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The size of the data cursor marker in pixels.
 * @expose
 * @name styleDefaults.dataCursor.markerSize
 * @memberof! oj.ojChart
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * Whether the data cursor marker is displayed. Marker should only be hidden if the data cursor is displaying information for the entire group.
 * @expose
 * @name styleDefaults.dataCursor.markerDisplayed
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * An object defining the style for hierarchical label separators.
 * @expose
 * @name styleDefaults.groupSeparators
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Defines whether the group separators are displayed.
 * @expose
 * @name styleDefaults.groupSeparators.rendered
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The color of the separators lines.
 * @expose
 * @name styleDefaults.groupSeparators.color
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An object containing the style properties of the box plot items.
 * @expose
 * @name styleDefaults.boxPlot
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The CSS style class to apply to the whisker stems.
 * @expose
 * @name styleDefaults.boxPlot.whiskerSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default ""
 */
/**
 * The CSS inline style to apply to the whisker stems.
 * @expose
 * @name styleDefaults.boxPlot.whiskerSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The CSS style class to apply to the whisker ends.
 * @expose
 * @name styleDefaults.boxPlot.whiskerEndSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default ""
 */
/**
 * The CSS inline style to apply to the whisker ends.
 * @expose
 * @name styleDefaults.boxPlot.whiskerEndSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 *  Specifies the length of the whisker ends in pixels (e.g. '9px') or as a percentage of the box width (e.g. '50%').
 * @expose
 * @name styleDefaults.boxPlot.whiskerEndLength
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the median line.
 * @expose
 * @name styleDefaults.boxPlot.medianSvgClassName
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default ""
 */
/**
 * The CSS inline style to apply to the median line.
 * @expose
 * @name styleDefaults.boxPlot.medianSvgStyle
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An object specifying value formatting and tooltip behavior, whose keys generally correspond to the attribute names on the data items.
 * @name valueFormats
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Specifies tooltip behavior for the series.
 * @expose
 * @name valueFormats.series
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.series.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.series.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies tooltip behavior for the groups.
 * @expose
 * @name valueFormats.group
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * A string representing the label that is displayed before the value in the tooltip. This value can also take an array of strings to be applied to hierarchical group names, from outermost to innermost.
 * @expose
 * @name valueFormats.group.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.group.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the x values.
 * @expose
 * @name valueFormats.x
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.x.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.x.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.x.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.x.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the y values.
 * @expose
 * @name valueFormats.y
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.y.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.y.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.y.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.y.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the y2 values.
 * @expose
 * @name valueFormats.y2
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.y2.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.y2.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.y2.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.y2.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the z values.
 * @expose
 * @name valueFormats.z
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.z.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.z.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.z.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.z.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the values.
 * @expose
 * @name valueFormats.value
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.value.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.value.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.value.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.value.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the target values of a funnel chart.
 * @expose
 * @name valueFormats.targetValue
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.targetValue.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.targetValue.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.targetValue.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.targetValue.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the low values.
 * @expose
 * @name valueFormats.low
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.low.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.low.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.low.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.low.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the high values.
 * @expose
 * @name valueFormats.high
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.high.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.high.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.high.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.high.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the open values of a stock chart.
 * @expose
 * @name valueFormats.open
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.open.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.open.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.open.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.open.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the close values of a stock chart.
 * @expose
 * @name valueFormats.close
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.close.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.close.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.close.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.close.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the volume values of a stock chart.
 * @expose
 * @name valueFormats.volume
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.volume.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.volume.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.volume.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.volume.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the q1 values of a box plot.
 * @expose
 * @name valueFormats.q1
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.q1.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.q1.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.q1.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.q1.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the q2 values of a box plot.
 * @expose
 * @name valueFormats.q2
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.q2.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.q2.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.q2.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.q2.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting and tooltip behavior for the q3 values of a box plot.
 * @expose
 * @name valueFormats.q3
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.q3.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.q3.scaling
 * @memberof! oj.ojChart
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
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.q3.tooltipLabel
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.q3.tooltipDisplay
 * @memberof! oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies the value formatting for the data item labels.
 * @expose
 * @name valueFormats.label
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.label.converter
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The scaling behavior of the value. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name valueFormats.label.scaling
 * @memberof! oj.ojChart
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
 * Specifies the zoom and scroll behavior of the chart. "Live" behavior means that the chart will be updated continuously as it is being manipulated, while "delayed" means that the update will wait until the zoom/scroll action is done. While "live" zoom and scroll provides the best end user experience, no guarantess are made about the rendering performance or usability for large data sets or slow client environments. If performance is an issue, "delayed" zoom and scroll should be used instead.
 * @expose
 * @name zoomAndScroll
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "delayedScrollOnly"
 * @ojvalue {string} "liveScrollOnly"
 * @ojvalue {string} "delayed"
 * @ojvalue {string} "live"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * Specifies the zoom direction of bubble and scatter charts. "Auto" zooms in both x and y direction. Use "x" or "y" for single direction zooming.
 * @expose
 * @name zoomDirection
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "x"
 * @ojvalue {string} "y"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Whether automatic initial zooming is enabled. The valid values are "first" to initially zoom to the first data points (after the viewportMin) that can fit in the plot area, "last" to initially zoom to the last data points (before the viewportMax), and "none" to disable initial zooming. Only applies to bar, line, area, and combo charts with zoomAndScroll turned on.
 * @expose
 * @name initialZooming
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "first"
 * @ojvalue {string} "last"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 *  Whether drilling is enabled. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). Use "on" to enable drilling for all series objects (legend items), group objects (x-axis labels), and data items. Use "seriesOnly" or "groupsOnly" to enable drilling for series objects or group objects only. To enable or disable drilling on individual series, group, or data item, use the drilling attribute in each series, group, or data item.
 * @expose
 * @name drilling
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "seriesOnly"
 * @ojvalue {string} "groupsOnly"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * An object containing an optional callback function for tooltip customization.
 * @expose
 * @name tooltip
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 *  A function that returns a custom tooltip. The function takes a dataContext argument,
 *  provided by the chart, with the following properties:
 *  <ul>
 *    <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li>
 *    <li>id: The id of the hovered item.</li>
 *    <li>series: The id of the series the hovered item belongs to.</li>
 *    <li>group: The ids or an array of ids of the group(s) the hovered item belongs to.
 *        For hierarchical groups, it will be an array of outermost to innermost group ids.</li>
 *    <li>value, targetValue, x, y, z, low, high, open, close, volume: The values of the hovered item.</li>
 *    <li>label: The data label of the hovered item.</li>
 *    <li>data: The data object of the hovered item. For nested items, it will be an array containing
 *     the parent item data and nested item data.</li>
 *	  <li>itemData: The row data object for the hovered item. This will only be set if a DataProvider is being used.</li>
 *    <li>seriesData: The data for the series the hovered item belongs to.</li>
 *    <li>groupData: An array of data for the group the hovered item belongs to. For hierarchical groups,
 *     it will be an array of outermost to innermost group data related to the hovered item.</li>
 *    <li>componentElement: The chart element.</li>
 *    <li>color: The color of the hovered item.</li>
 *  </ul>
 *  For reference objects, this tooltip function is only called if the reference object has an id.
 *  Note: In future releases, tooltips may be fired for objects other than data items and reference objects.
 *  To know whether a hovered object is a data item, please check that the "series" and "group" properties are not null.
 *  The function should return an Object that contains only one of the two properties:
 *  <ul>
 *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
 *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li>
 *  </ul>
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Object)}
 * @default null
 */
/**
 * Data visualizations require a press and hold delay before triggering tooltips, marquee selection, and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events if the element does not require an internal feature that requires a touch start gesture like panning, zooming, or when marquee selection is initiated. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if panning is not available for those elements that support the feature.
 * @expose
 * @name touchResponse
 * @memberof oj.ojChart
 * @instance
 * @type {string}
 * @ojvalue {string} "touchStart"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 *  A function that returns a custom data label. The function takes a dataContext argument, provided by the chart, with the following properties: <ul> <li>id: The id of the data item.</li> <li>series: The id of the series the data item belongs to.</li> <li>group: The id or an array of ids of the group(s) the data item belongs to. For hierarchical groups, it will be an array of outermost to innermost group ids.</li> <li>value, targetValue, x, y, z, low, high, open, close, volume: The values of the data item.</li> <li>label: The label for the data item if the dataLabel callback is ignored. The dataLabel callback can concatenate this with another string to easily enhance the default label.</li> <li>totalValue: The total of all values in the chart. This will only be included for pie charts.</li> <li>data: The data object of the data item. For nested items, it will be an array containing the parent item data and nested item data.</li> <li>itemData: The row data object for the data item. This will only be set if a DataProvider is being used. </li> <li>seriesData: The data for the series the data item belongs to.</li> <li>groupData: An array of data for the group the data item belongs to. For hierarchical groups, it will be an array of outermost to innermost group data related to the data item.</li> <li>componentElement: The chart element.</li> </ul> The function may return a number or a string or in the case of range charts, an array of numbers or strings. If any label is a number, it will be formatted by the valueFormat of the type 'label' before being used as labels.
 * @expose
 * @name dataLabel
 * @memberof oj.ojChart
 * @instance
 * @type {function(Object)}
 * @default null
 */
/**
 * Provides support for HTML5 Drag and Drop events. Please refer to <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop">third party documentation</a> on HTML5 Drag and Drop to learn how to use it.
 * @expose
 * @name dnd
 * @memberof oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An object that describes drag functionality.
 * @expose
 * @name dnd.drag
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Allows dragging of chart data items, including bars, line/area/scatter markers, bubbles, and pie/funnel/pyramid slices.
 * @expose
 * @name dnd.drag.items
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one type, or an array of strings if multiple types are needed. For example, if selected employee data items are being dragged, dataTypes could be "application/employees+json". Drop targets can examine the data types and decide whether to accept the data. For each type in the array, dataTransfer.setData will be called with the specified type and the data. The data is an array of the dataContexts of the selected data items. The dataContext is the JSON version of the dataContext that we use for "tooltip" and "dataLabels" properties, excluding componentElement and parentElement. This property is required unless the application calls setData itself in a dragStart callback function.
 * @expose
 * @name dnd.drag.items.dataTypes
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 */
/**
 * An optional callback function that receives the "drag" event as argument.
 * @expose
 * @name dnd.drag.items.drag
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragend" event as argument.
 * @expose
 * @name dnd.drag.items.dragEnd
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragstart" event and context information as arguments. The context information is as follows: <ul> <li> item {Array.(object)}: An array of dataContexts of the dragged data items. The dataContext is the same as what we use for "tooltip" and "dataLabels" properties. </li> </ul> This function can set its own data and drag image as needed. When this function is called, event.dataTransfer is already populated with the default data and drag image.
 * @expose
 * @name dnd.drag.items.dragStart
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * Allows dragging of chart series from the legend items.
 * @expose
 * @name dnd.drag.series
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one type, or an array of strings if multiple types are needed. For example, if selected employee data items are being dragged, dataTypes could be "application/employees+json". Drop targets can examine the data types and decide whether to accept the data. For each type in the array, dataTransfer.setData will be called with the specified type and the data. The data is an array of the dataContexts of the selected series. The dataContext is the JSON version of the dataContext that we use for "tooltip" and "dataLabels" properties, excluding componentElement and parentElement. This property is required unless the application calls setData itself in a dragStart callback function.
 * @expose
 * @name dnd.drag.series.dataTypes
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 */
/**
 * An optional callback function that receives the "drag" event as argument.
 * @expose
 * @name dnd.drag.series.drag
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragend" event as argument.
 * @expose
 * @name dnd.drag.series.dragEnd
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragstart" event and context information as arguments. The context information is as follows: <ul> <li> series {Array.(object)}: An array of dataContexts of the dragged series. The dataContext is the same as what we use for "tooltip" and "dataLabels" properties. </li> </ul> This function can set its own data and drag image as needed. When this function is called, event.dataTransfer is already populated with the default data and drag image.
 * @expose
 * @name dnd.drag.series.dragStart
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * Allows dragging of chart groups from the categorical axis labels.
 * @expose
 * @name dnd.drag.groups
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one type, or an array of strings if multiple types are needed. For example, if selected employee data items are being dragged, dataTypes could be "application/employees+json". Drop targets can examine the data types and decide whether to accept the data. For each type in the array, dataTransfer.setData will be called with the specified type and the data. The data is an array of the dataContexts of the selected groups. The dataContext is the JSON version of the dataContext that we use for "tooltip" and "dataLabels" properties, excluding componentElement and parentElement. This property is required unless the application calls setData itself in a dragStart callback function.
 * @expose
 * @name dnd.drag.groups.dataTypes
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 */
/**
 * An optional callback function that receives the "drag" event as argument.
 * @expose
 * @name dnd.drag.groups.drag
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragend" event as argument.
 * @expose
 * @name dnd.drag.groups.dragEnd
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragstart" event and context information as arguments. The context information is as follows: <ul> <li> groups {Array.(object)}: An array of dataContexts of the dragged groups. The dataContext is the same as what we use for "tooltip" and "dataLabels" properties. </li> </ul> This function can set its own data and drag image as needed. When this function is called, event.dataTransfer is already populated with the default data and drag image.
 * @expose
 * @name dnd.drag.groups.dragStart
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An object that describes drop functionality.
 * @expose
 * @name dnd.drop
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * Allows dropping on the plot area.
 * @expose
 * @name dnd.drop.plotArea
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An array of MIME data types this element can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
 * @expose
 * @name dnd.drop.plotArea.dataTypes
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 */
/**
 * An optional callback function that receives the "dragenter" event and context information as arguments. The context information is as follows: <ul> <li>x {number}: The X axis value at the event position.</li> <li>y {number}: The Y axis value at the event position.</li> <li>y2 {number}: The Y2 axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.plotArea.dragEnter
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragover" event and context information as arguments. The context information is as follows: <ul> <li>x {number}: The X axis value at the event position.</li> <li>y {number}: The Y axis value at the event position.</li> <li>y2 {number}: The Y2 axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.plotArea.dragOver
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragleave" event and context information as arguments. The context information is as follows: <ul> <li>x {number}: The X axis value at the event position.</li> <li>y {number}: The Y axis value at the event position.</li> <li>y2 {number}: The Y2 axis value at the event position.</li> </ul>
 * @expose
 * @name dnd.drop.plotArea.dragLeave
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "drop" event and context information as arguments. The context information is as follows: <ul> <li>x {number}: The X axis value at the event position.</li> <li>y {number}: The Y axis value at the event position.</li> <li>y2 {number}: The Y2 axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
 * @expose
 * @name dnd.drop.plotArea.drop
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * Allows dropping on the X axis.
 * @expose
 * @name dnd.drop.xAxis
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An array of MIME data types this element can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
 * @expose
 * @name dnd.drop.xAxis.dataTypes
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 */
/**
 * An optional callback function that receives the "dragenter" event and context information as arguments. The context information is as follows: <ul> <li>x {number}: The X axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.xAxis.dragEnter
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragover" event and context information as arguments. The context information is as follows: <ul> <li>x {number}: The X axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.xAxis.dragOver
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragleave" event and context information as arguments. The context information is as follows: <ul> <li>x {number}: The X axis value at the event position.</li> </ul>
 * @expose
 * @name dnd.drop.xAxis.dragLeave
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "drop" event and context information as arguments. The context information is as follows: <ul> <li>x {number}: The X axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
 * @expose
 * @name dnd.drop.xAxis.drop
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * Allows dropping on the Y axis.
 * @expose
 * @name dnd.drop.yAxis
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An array of MIME data types this element can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
 * @expose
 * @name dnd.drop.yAxis.dataTypes
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 */
/**
 * An optional callback function that receives the "dragenter" event and context information as arguments. The context information is as follows: <ul> <li>y {number}: The Y axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.yAxis.dragEnter
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragover" event and context information as arguments. The context information is as follows: <ul> <li>y {number}: The Y axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.yAxis.dragOver
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragleave" event and context information as arguments. The context information is as follows: <ul> <li>y {number}: The Y axis value at the event position.</li> </ul>
 * @expose
 * @name dnd.drop.yAxis.dragLeave
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "drop" event and context information as arguments. The context information is as follows: <ul> <li>y {number}: The Y axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
 * @expose
 * @name dnd.drop.yAxis.drop
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * Allows dropping on the Y2 axis.
 * @expose
 * @name dnd.drop.y2Axis
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An array of MIME data types this element can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
 * @expose
 * @name dnd.drop.y2Axis.dataTypes
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 */
/**
 * An optional callback function that receives the "dragenter" event and context information as arguments. The context information is as follows: <ul> <li>y2 {number}: The Y2 axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.y2Axis.dragEnter
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragover" event and context information as arguments. The context information is as follows: <ul> <li>y2 {number}: The Y2 axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.y2Axis.dragOver
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragleave" event and context information as arguments. The context information is as follows: <ul> <li>y2 {number}: The Y2 axis value at the event position.</li> </ul>
 * @expose
 * @name dnd.drop.y2Axis.dragLeave
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "drop" event and context information as arguments. The context information is as follows: <ul> <li>y2 {number}: The Y2 axis value at the event position.</li> </ul> This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
 * @expose
 * @name dnd.drop.y2Axis.drop
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * Allows dropping on the legend.
 * @expose
 * @name dnd.drop.legend
 * @memberof! oj.ojChart
 * @instance
 * @type {Object}
 * @default {}
 */
/**
 * An array of MIME data types this element can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
 * @expose
 * @name dnd.drop.legend.dataTypes
 * @memberof! oj.ojChart
 * @instance
 * @type {string|Array.<string>}
 * @default null
 */
/**
 * An optional callback function that receives the "dragenter" event and empty context information as arguments. This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.legend.dragEnter
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragover" event and empty context information as arguments. This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
 * @expose
 * @name dnd.drop.legend.dragOver
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "dragleave" event and empty context information as arguments.
 * @expose
 * @name dnd.drop.legend.dragLeave
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */
/**
 * An optional callback function that receives the "drop" event and emtpy context information as arguments. This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
 * @expose
 * @name dnd.drop.legend.drop
 * @memberof! oj.ojChart
 * @instance
 * @type {function(Event, object)}
 * @default null
 */

/**
 * Object type that defines a chart series.
 * @ignore
 * @typedef {Object} oj.ojChart.Series
 * @property {string} id The id of the series. Defaults to the name or the series index if not specified.
 * @property {string} name The name of the series, displayed in the legend and tooltips.
 * @property {"bar"|"line"|"area"|"lineWithArea"|"candlestick"|"boxPlot"|"auto"} type The type of data objects to display for this series. Only applies to bar, line, area, stock, box plot, and combo charts.
 * @property {string} color The color of the series.
 * @property {string} borderColor The border color of the series.
 * @property {number} borderWidth The border width of the series.
 * @property {string} areaColor The area color of the series. Only applies if series type is area or lineWithArea.
 * @property {string} areaSvgClassNamer The CSS style class to apply if series type is area or lineWithArea. The style class and inline style will override any other styling specified through the properties.
 *            For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @property {object} areaSvgStyle The inline style to apply if series type is area or lineWithArea. The style class and inline style will override any other styling specified through the properties.
 *            For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @property {string} svgClassName The CSS style class to apply to the series. For series of type lineWithArea, this style will only be applied to the line if areaClassName is also specified.
 *            The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @property {object} svgStyle The inline style to apply to the series. For series of type lineWithArea, this style will only be applied to the line if areaStyle is also specified.
 *            The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @property {string} markerSvgClassName The CSS style class to apply to the data markers.The style class and inline style will override any other styling specified through the properties.
 *            For tooltips and hover interactivity, it's recommended to also pass a representative color to the marker color attribute.
 * @property {object} markerSvgStyle The inline style to apply to the data markers. The style class and inline style will override any other styling specified through the properties.
 *            For tooltips and hover interactivity, it's recommended to also pass a representative color to the marker color attribute.
 * @property {"smallChecker"|"smallCrosshatch"|"smallDiagonalLeft"|"smallDiagonalRight"|"smallDiamond"|"smallTriangle"|"largeChecker"|"largeCrosshatch"|"largeDiagonalLeft"|"largeDiagonalRight"|"largeDiamond"|"largeTriangle"} pattern
 *           The pattern used to fill the series. A solid fill is used by default, unless the seriesEffect is 'pattern'.
 * @property {"square"|"circle"|"diamond"|"plus"|"triangleDown"|"triangleUp"|"human"|"star"|"auto"} markerShape The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape.
 *            The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
 * @property {string} markerColor The color of the data markers, if different from the series color.
 * @property {"on"|"off"|"auto"} markerDisplayed Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
 * @property {number} markerSize The size of the data markers.
 * @property {number} lineWidth The width of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
 * @property {"dotted"|"dashed"|"solid"} lineStyle
 * @property {"straight"|"curved"|"stepped"|"centeredStepped"|"segmented"|"centeredSegmented"|"none"|"auto"} lineType
 *           The line type of the data line or area. Only applies to line, area, scatter, and bubble series. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
 * @property {string} source The URI of the custom image. If specified, it takes precedence over shape.
 * @property {string} sourceHover The optional URI for the hover state. If not specified, the source image will be used.
 * @property {string} sourceSelected The optional URI for the selected state. If not specified, the source image will be used.
 * @property {string} sourceHoverSelected The optional URI for the hover selected state. If not specified, the source image will be used.
 * @property {number} pieSliceExploded A number from 0 to 1 indicating the amount to explode the pie slice. Only applies to pie charts.
 * @property {"on"|"off"} assignedToY2 Defines whether the series is associated with the y2 axis. Only applies to Cartesian bar, line, area, and combo charts.
 * @property {string} stackCategory In stacked charts, groups series together for stacking. All series without a stackCategory will be assigned to the same stack.
 * @property {"on"|"off"|"auto"} displayInLegend Defines whether the series should be shown in the legend. When set to 'auto', the series will not be displayed in the legend if
 *            it has null data or if it is a stock, funnel, or pyramid series.
 * @property {"on"|"off"|"inherit"} drilling Whether drilling is enabled on the series item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click.
 *           To enable drilling for all series items at once, use the drilling attribute in the top level.
 * @property {Array.<string>} categories An optional array of category strings corresponding to this series.
 *           This allows highlighting and filtering of a series through interactions with legend sections. If not defined, the series id is used.
 * @property {string} shortDesc The description of this series. This is used for accessibility and for customizing the tooltip text on the corressponding legend item for the series.
 * @property {oj.ojChart.BoxPlotStyle} boxPlot An object containing the style properties of the box plot series.
 */

/**
 * Object type that defines a chart group.
 * @ignore
 * @typedef {Object} oj.ojChart.Group
 * @property {string} id The id of the group. Defaults to the name if not specified.
 * @property {string} name The name of the group
 * @property {object} labelStyle The CSS style object defining the style of the group label text. Supports color,
 *                    fontFamily, fontSize, fontStyle, fontWeight, textDecoration, cursor,
 *                    backgroundColor, borderColor, borderRadius, and borderWidth properties.
 *                    Only applies to a categorical axis.
 * @property {string} shortDesc The description of the group. This is used for customizing the tooltip text and only applies to a categorical axis.
 * @property {"on"|"off"|"auto"} drilling Whether drilling is enabled on the group label. Drillable objects will show a pointer cursor on hover and fire an
 *                    <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all group labels at once, use the drilling attribute in the top level.
 * @property {Array.<oj.ojChart.Group>} groups An array of nested group obects.
 * @property {Array.<oj.ojChart.DataItem>} items An array of chart data items.
 */

/**
 * Object type that defines a chart data item.
 * @ignore
 * @typedef {Object} oj.ojChart.DataItem
 * @property {Array.<oj.ojChart.DataItem>} items An array of nested data items to be used for defining the markers for outliers or additional data items of a box plot.
 * @property {string} id The id of the data item. This id will be provided as part of the context for events on the chart.
 * @property {number|string} x The x value for a scatter or bubble chart or the date on a time axis.
 * @property {number} y The y value. Also the primary value for charts without a y-Axis, such as pie charts.
 * @property {number} z The z value. Defines the bubble radius for a bubble chart, as well as the width of a bar or a box plot item.
 * @property {number} low The low value for range bar/area, stock candlestick, or box plot item. Define 'low' and 'high' instead of 'value' or 'y' to create a range bar/area chart.
 * @property {number} high The high value for range bar/area, stock candlestick, or box plot item. Define 'low' and 'high' instead of 'value' or 'y' to create a range bar/area chart.
 * @property {number} open The open value for stock candlestick.
 * @property {number} close The close value for stock candlestick. When bar, line, or area series type are used on a stock chart, this value is displayed.
 * @property {number} volume The value for stock volume bar. When this value is provided, the volume bar is displayed on the y2 axis.
 * @property {number} q1 The first quartile value for box plot.
 * @property {number} q2 The second quartile (median) value for box plot.
 * @property {number} q3 The third quartile value for box plot.
 * @property {string} shortDesc The description of this object. This is used for accessibility and also for customizing the tooltip text.
 * @property {string} color The color of the data item.
 * @property {string} borderColor The border color of the data item. For funnel and pyramid charts, it is used for the slice border.
 * @property {number} borderWidth The border width of the data item. For funnel and pyramid charts, it is used for the slice border.
 * @property {"smallChecker"|"smallCrosshatch"|"smallDiagonalLeft"|"smallDiagonalRight"|"smallDiamond"|"smallTriangle"|"largeChecker"|"largeCrosshatch"|"largeDiagonalLeft"|"largeDiagonalRight"|"largeDiamond"|"largeTriangle"} pattern
 *           The pattern used to fill the data item. A solid fill is used by default, unless the seriesEffect is 'pattern'.
 * @property {string} svgClassName The CSS style class to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @property {object} svgStyle The inline style to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @property {"on"|"off"|"auto"} markerDisplayed Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
 * @property {"square"|"circle"|"diamond"|"plus"|"triangleDown"|"triangleUp"|"human"|"star"|"auto"} markerShape The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape.
 *            The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
 * @property {number} markerSize The size of the data markers. Does not apply to bubble charts, which calculate marker size based on the z values.
 * @property {string} source The URI of the custom image. If specified, it takes precedence over shape.
 * @property {string} sourceHover The optional URI for the hover state. If not specified, the source image will be used.
 * @property {string} sourceSelected The optional URI for the selected state. If not specified, the source image will be used.
 * @property {string} sourceHoverSelected The optional URI for the hover selected state. If not specified, the source image will be used.
 * @property {string|Array.<string>} label The label for the data item. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively. Not supported for box plot or candlestick.
 * @property {string|Array.<string>} labelPosition The position of the data label. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively. The 'outsideSlice' value only applies to pie charts.
 *            The 'aboveMarker', 'belowMarker', 'beforeMarker', and 'afterMarker' values only apply to line, area, scatter, and bubble series. The 'insideBarEdge' and 'outsideBarEdge' values only apply to non-polar bar series. Stacked bars do not support 'outsideBarEdge'.
 *            The chart does not currently adjust layout to fit labels within the plot area or deal with any overlaps between labels.
 * @property {string|Array.<object>} labelStyle The CSS style object defining the style of the data label. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively.
 * @property {Array.<string>} categories An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend or other visualization elements. If not defined, series categories are used.
 * @property {number} value The value for this data item. Corresponding to the y value for bar, line, area, and combo charts and the slice values for pie, funnel and pyramid charts. Null can be specified to skip a data point.
 * @property {number} targetValue The target value for a funnel chart. When this is set, the value attribute defines the filled area within the slice and this represents the value of the whole slice.
 * @property {"on"|"off"|"drilling"} drilling Whether drilling is enabled for the data item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all data items at once, use the drilling attribute in the top level.
 * @property {oj.ojChart.BoxPlotStyle} boxPlot An object containing the style properties of the box plot item.
 */

/**
 * Object type that defines box plot style properties.
 * @ignore
 * @typedef {Object} oj.ojChart.BoxPlotStyle
 * @property {string} q2Color The color of the Q2 segment of the box.
 * @property {string} q2SvgClassName The CSS style class to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties.
 *            For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @property {object} q2SvgStyle The CSS inline style to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties.
 *            For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @property {string} q3Color The color of the Q3 segment of the box.
 * @property {string} q3SvgClassName The CSS style class to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties.            For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @property {string} q3SvgStyle The CSS inline style to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties.
 *            For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @property {string} whiskerSvgClassName The CSS style class to apply to the whisker stems.
 * @property {string} whiskerSvgStyle The CSS inline style to apply to the whisker stems.
 * @property {string} whiskerEndSvgClassName The CSS style class to apply to the whisker ends.
 * @property {string} whiskerEndSvgStyle The CSS inline style to apply to the whisker ends.
 * @property {string} whiskerEndLength Specifies the length of the whisker ends in pixels (e.g. '9px') or as a percentage of the box width (e.g. '50%').
 * @property {string} medianSvgClassName The CSS style class to apply to the median line.
 * @property {string} medianSvgStyle The CSS inline style to apply to the median line.
 */

 // Slots

/**
 * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for creating each item of the chart. The slot must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-chart-item> element. See the [oj-chart-item]{@link oj.ojChartItem} doc for more details. A <b>series-id</b> and <b>group-id</b> must be specified.</p>
 * <p>When the template is executed for each item, it will have access to the chart's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item. (See the table below for a list of properties available on $current) </li>
 *   <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 * @ojstatus preview
 * @ojslot itemTemplate
 * @memberof oj.ojChart
 * @property {Element} componentElement The &lt;oj-chart> custom element
 * @property {Object} data The data object for the current item
 * @property {number} index The zero-based index of the curent item
 * @property {any} key The key of the current item
 *
 * @example <caption>Initialize the Chart with an inline item template specified:</caption>
 * &lt;oj-chart data="[[dataProvider]]">
 *  &lt;template slot='itemTemplate'>
 *    &lt;oj-chart-item
 *      value="[[$current.data.value]]"
 *      series-id="[[$current.data.productName]]"
 *      group-id="[[ [$current.data.year] ]]">
 *    &lt;/oj-chart-item>
 *  &lt;/template>
 * &lt;/oj-chart>
 */

 /**
 * <p>The <code class="prettyprint">seriesTemplate</code> slot is used to specify the template for generating the series properties of the chart. The slot must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-chart-series> element.See the [oj-chart-series]{@link oj.ojChartSeries} doc for more details.</p>
 * <p>When the template is executed for each series, it will have access to the chart's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item. (See the table below for a list of properties available on $current) </li>
 *   <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 *
 *
 * @ojstatus preview
 * @ojslot seriesTemplate
 * @memberof oj.ojChart
 * @property {Element} componentElement The &lt;oj-chart> custom element
 * @property {number} index The series index
 * @property {string} id The series id
 * @property {Array<Object>} items The array of objects which are chart items that belong to this series. The objects will have the following properties
 * @property {Object} items.data The data object for the item
 * @property {number} items.index The zero-based index of the item
 * @property {any} items.key The key of the current item
 *
 * @example <caption>Initialize the Chart with an inline series template specified:</caption>
 * &lt;oj-chart data="[[dataProvider]]">
 *  &lt;template slot='seriesTemplate'>
 *    &lt;oj-chart-series
 *      drilling='on'
 *      marker-shape='[[ $current.id == "Series 1" ? "square" : "circle" ]]'>
 *    &lt;/oj-chart-series>
 *  &lt;/template>
 * &lt;/oj-chart>
 */

 /**
 * <p>The <code class="prettyprint">groupTemplate</code> slot is used to specify the template for generating the group properties of the chart. The slot must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-chart-group> element. See the [oj-chart-group]{@link oj.ojChartGroup} doc for more details.</p>
 * <p>When the template is executed for each group, it will have access to the chart's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item. (See the table below for a list of properties available on $current) </li>
 *   <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul> 
 *
 * @ojstatus preview
 * @ojslot groupTemplate
 * @memberof oj.ojChart
 * @property {Element} componentElement The &lt;oj-chart> custom element
 * @property {number} index The group index
 * @property {Array<string>} ids An array of group IDs, from the outermost group to the current group. For non-hierarchical group, the array will contain only one id.
 * @property {number} depth The depth of the group. The depth of the outermost group under the invisible root is 1.
 * @property {boolean} leaf True if the group is a leaf group.
 * @property {Array<Object>} items The array of objects which are chart items that belong to this group. The objects will have the following properties:
 * @property {Object} items.data The data object for the item
 * @property {number} items.index The zero-based index of the item
 * @property {any} items.key The key of the current item
 *
 * @example <caption>Initialize the Chart with an inline group template specified:</caption>
 * &lt;oj-chart data="[[dataProvider]]">
 *  &lt;template slot='groupTemplate'>
 *    &lt;oj-chart-group
 *      drilling='on'
 *      label-style='[[$current.depth == 1 ? {"fontWeight":"bold"} : {"fontStyle":"italic"}]]'>
 *    &lt;/oj-chart-group>
 *  &lt;/template>
 * &lt;/oj-chart>
 */




// SubId Locators **************************************************************

/**
 * <p>Sub-ID for chart data items indexed by series and group indices. The group index is not required for pie and
 * funnel charts.</p>
 *
 * @property {number} seriesIndex
 * @property {number} itemIndex
 *
 * @ojsubid oj-chart-item
 * @memberof oj.ojChart
 *
 * @example <caption>Get the data item from the first series and second group:</caption>
 * var nodes = myChart.getNodeBySubId({'subId': 'oj-chart-item', 'seriesIndex': 0, 'itemIndex': 1});
 */

/**
 * <p>Sub-ID for a legend item that represents the series with the specified index.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-chart-series
 * @memberof oj.ojChart
 *
 * @example <caption>Get the legend item that represents the first series:</caption>
 * var nodes = myChart.getNodeBySubId({'subId': 'oj-chart-series', 'index': 0});
 */

/**
 * <p>Sub-ID for a categorical axis label that represents the group with the specified index.</p>
 *
 * @property {Array} indexPath The array of indices corresponding to the position of the group in the properties array.
 *
 * @ojsubid oj-chart-group
 * @memberof oj.ojChart
 * @instance
 *
 * @example <caption>Get the categorical axis label that represents the first group:</caption>
 * var nodes = myChart.getNodeBySubId({'subId': 'oj-chart-group', 'indexPath': [0]});
 */

/**
 * <p>Sub-ID for the title of the specified axis.</p>
 *
 * @property {string} axis <code class="prettyprint">xAxis</code>, <code class="prettyprint">yAxis</code>, or <code class="prettyprint">y2Axis</code>
 *
 * @ojsubid oj-chart-axis-title
 * @memberof oj.ojChart
 *
 * @example <caption>Get the title for the x-axis:</caption>
 * var nodes = myChart.getNodeBySubId({'subId': 'oj-chart-axis-title', 'axis': 'xAxis'});
 */

/**
 * <p>Sub-ID for the reference object of the specified axis with the given index.</p>
 *
 * @property {string} axis <code class="prettyprint">xAxis</code>, <code class="prettyprint">yAxis</code>, or <code class="prettyprint">y2Axis</code>
 * @property {number} index The index of the reference object for the specified axis.
 *
 * @ojsubid oj-chart-reference-object
 * @memberof oj.ojChart
 *
 * @example <caption>Get the first reference object of the y-axis:</caption>
 * var nodes = myChart.getNodeBySubId({'subId': 'oj-chart-reference-object', 'axis': 'yAxis', 'index': 0});
 */

/**
 * <p>Sub-ID for the the chart tooltip.</p>
 *
 * @ojsubid oj-chart-tooltip
 * @memberof oj.ojChart
 *
 * @example <caption>Get the tooltip object of the chart, if displayed:</caption>
 * var nodes = myChart.getNodeBySubId({'subId': 'oj-chart-tooltip'});
 */

/**
 * <p>Sub-ID for a legend item indexed by its position in its parent section's
 * item array and its parent's sectionIndex.</p>
 *
 * @property {Array} sectionIndexPath The array of numerical indices for the section.
 * @property {number} itemIndex The index of the item within the specified section.
 *
 * @ojsubid oj-legend-item
 * @memberof oj.ojChart
 *
 * @example <caption>Get the first legend item from the first legend section:</caption>
 * var nodes = myChart.getNodeBySubId({'subId': 'oj-legend-item', sectionIndexPath: [0], itemIndex: 1});
 */

// Node Context Objects ********************************************************

/**
* <p>Context for chart data items indexed by series and group indices.</p>
*
* @property {number} seriesIndex
* @property {number} itemIndex
*
* @ojnodecontext oj-chart-item
* @memberof oj.ojChart
*/

/**
 * <p>Context for a legend item that represents the series with the specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-chart-series
 * @memberof oj.ojChart
 */

/**
 * <p>Context for a categorical axis label that represents the group with the specified index.</p>
 *
 * @property {Array} indexPath The array of indices corresponding to the position of the group in the properties array.
 *
 * @ojnodecontext oj-chart-group
 * @memberof oj.ojChart
 */

/**
 * <p>Context for the title of the specified axis.</p>
 *
 * @property {string} axis <code class="prettyprint">xAxis</code>, <code class="prettyprint">yAxis</code>, or <code class="prettyprint">y2Axis</code>
 *
 * @ojnodecontext oj-chart-axis-title
 * @memberof oj.ojChart
 */

/**
 * <p>Context for the center label of a pie chart.</p>
 *
 * @ojnodecontext oj-chart-pie-center-label
 * @memberof oj.ojChart
 */

/**
 * <p>Context for the reference object of the specified axis with the given index.</p>
 *
 * @property {string} axis <code class="prettyprint">xAxis</code>, <code class="prettyprint">yAxis</code>, or <code class="prettyprint">y2Axis</code>
 * @property {number} index The index of the reference object for the specified axis.
 *
 * @ojnodecontext oj-chart-reference-object
 * @memberof oj.ojChart
 */

/**
 * <p>Context for a legend item indexed by its position in its parent section's
 * item array and its parent's sectionIndex.</p>
 *
 * @property {Array} sectionIndexPath The array of numerical indices for the section.
 * @property {number} itemIndex The index of the item within the specified section.
 *
 * @ojnodecontext oj-legend-item
 * @memberof oj.ojChart
 */

/**
 * @ojcomponent oj.ojChartGroup
 * @ojslotcomponent
 * @ojtsignore
 * @since 5.1.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="chartGroupOverview-section">
 *   JET Chart Group
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#chartGroupOverview-section"></a>
 * </h3>
 *
 * <p>The oj-chart-group element is used to declare group properties in the groupTemplate slot of [oj-chart]{@link oj.ojChart#groupTemplate}.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-chart data="[[dataProvider]]">
 *  &lt;template slot='groupTemplate'>
 *    &lt;oj-chart-group
 *      drilling='on'
 *      label-style='[[$current.depth == 1 ? {"fontWeight":"bold"} : {"fontStyle":"italic"}]]'>
 *    &lt;/oj-chart-group>
 *  &lt;/template>
 * &lt;/oj-chart>
 * </code>
 * </pre>
 */

/**
 * The name of the group.
 * @expose
 * @name name
 * @memberof! oj.ojChartGroup
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style object defining the style of the group label text. Supports color,
 * fontFamily, fontSize, fontStyle, fontWeight, textDecoration, cursor,
 * backgroundColor, borderColor, borderRadius, and borderWidth properties.
 * Only applies to a categorical axis.
 * @name labelStyle
 * @memberof! oj.ojChartGroup
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The description of the group. This is used for customizing the tooltip text and only applies to a categorical axis.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojChartGroup
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 *  Whether drilling is enabled on the group label. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all group labels at once, use the drilling attribute in the top level.
 * @expose
 * @name drilling
 * @memberof! oj.ojChartGroup
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */

/**
 * @ojcomponent oj.ojChartItem
 * @ojslotcomponent
 * @ojtsignore
 * @since 5.1.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="chartItemOverview-section">
 *   JET Chart Item
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#chartItemOverview-section"></a>
 * </h3>
 *
 * <p>The oj-chart-item element is used to declare item properties in the itemTemplate slot of [oj-chart]{@link oj.ojChart#itemTemplate}.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-chart data="[[dataProvider]]">
 *  &lt;template slot='itemTemplate'>
 *    &lt;oj-chart-item
 *      value="[[$current.data.value]]"
 *      series-id="[[$current.data.productName]]"
 *      group-id="[[ [$current.data.year] ]]">
 *    &lt;/oj-chart-item>
 *  &lt;/template>
 * &lt;/oj-chart>
 * </code>
 * </pre>
 */

/**
 * An array of nested data items to be used for defining the markers for outliers or additional data items of a box plot.
 * @expose
 * @ojtsignore
 * @name items
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Array.<Object>|Array.<number>}
 * @default null
 */
/**
 * The x value. Mainly used for scatter and bubble chart and to specify the date for mixed-frequency time axis.
 * For categorical axis, if the x value is not specified, it will default to the item index.
 * For regular time axis, if the x value is not specified, it will default to the group name of the item.
 * @expose
 * @ojtsignore
 * @name x
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The y value. Also the primary value for charts without a y-Axis, such as pie charts.
 * @expose
 * @ojtsignore
 * @name y
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The z value. Defines the bubble radius for a bubble chart, as well as the width of a bar or a box plot item.
 * @expose
 * @ojtsignore
 * @name z
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The low value for range bar/area, stock candlestick, or box plot item. Define 'low' and 'high' instead of 'value' or 'y' to create a range bar/area chart.
 * @expose
 * @ojtsignore
 * @name low
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The high value for range bar/area, stock candlestick, or box plot item. Define 'low' and 'high' instead of 'value' or 'y' to create a range bar/area chart.
 * @expose
 * @ojtsignore
 * @name high
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The open value for stock candlestick.
 * @expose
 * @ojtsignore
 * @name open
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The close value for stock candlestick. When bar, line, or area series type are used on a stock chart, this value is displayed.
 * @expose
 * @ojtsignore
 * @name close
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The value for stock volume bar. When this value is provided, the volume bar is displayed on the y2 axis.
 * @expose
 * @ojtsignore
 * @name volume
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The first quartile value for box plot.
 * @expose
 * @ojtsignore
 * @name q1
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The second quartile (median) value for box plot.
 * @expose
 * @ojtsignore
 * @name q2
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The third quartile value for box plot.
 * @expose
 * @ojtsignore
 * @name q3
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
 /**
 * The id for the series the item belongs to.
 * @expose
 * @ojtsignore
 * @ojrequired
 * @name seriesId
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
 /**
 * The array of id(s) for the group(s) the item belongs to. For hierarchical groups, it will be an array of outermost to innermost group ids.
 * @expose
 * @ojtsignore
 * @ojrequired
 * @name groupId
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The description of this object. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @ojtsignore
 * @name shortDesc
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * The color of the data item.
 * @expose
 * @ojtsignore
 * @name color
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border color of the data item. For funnel and pyramid charts, it is used for the slice border.
 * @expose
 * @ojtsignore
 * @name borderColor
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border width of the data item. For funnel and pyramid charts, it is used for the slice border.
 * @expose
 * @ojtsignore
 * @name borderWidth
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The pattern used to fill the data item. A solid fill is used by default, unless the seriesEffect is 'pattern'.
 * @expose
 * @ojtsignore
 * @name pattern
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @ojvalue {string} "smallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The CSS style class to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @expose
 * @ojtsignore
 * @name svgClassName
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @expose
 * @ojtsignore
 * @name svgStyle
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
 * @expose
 * @ojtsignore
 * @name markerDisplayed
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
 * @expose
 * @ojtsignore
 * @name markerShape
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @ojvalue {string} "square"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The size of the data markers. Does not apply to bubble charts, which calculate marker size based on the z values.
 * @expose
 * @ojtsignore
 * @name markerSize
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 *  The URI of the custom image. If specified, it takes precedence over shape.
 * @expose
 * @ojtsignore
 * @name source
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the hover state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name sourceHover
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The optional URI for the selected state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name sourceSelected
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the hover selected state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name sourceHoverSelected
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The label for the data item. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively. Not supported for box plot or candlestick.
 * @expose
 * @ojtsignore
 * @name label
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string|Array.<string>}
 * @default null
 * @ojtranslatable
 */
/**
 * The position of the data label. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively. The 'outsideSlice' value only applies to pie charts. The 'aboveMarker', 'belowMarker', 'beforeMarker', and 'afterMarker' values only apply to line, area, scatter, and bubble series. The 'insideBarEdge' and 'outsideBarEdge' values only apply to non-polar bar series. Stacked bars do not support 'outsideBarEdge'. The chart does not currently adjust layout to fit labels within the plot area or deal with any overlaps between labels.
 * @expose
 * @ojtsignore
 * @name labelPosition
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string|Array.<string>}
 * @ojvalue {string} "center"
 * @ojvalue {string} "outsideSlice"
 * @ojvalue {string} "aboveMarker"
 * @ojvalue {string} "belowMarker"
 * @ojvalue {string} "beforeMarker"
 * @ojvalue {string} "afterMarker"
 * @ojvalue {string} "insideBarEdge"
 * @ojvalue {string} "outsideBarEdge"
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The CSS style object defining the style of the data label. For range series, if an array of two values are provided, the first and second value will apply to the low and high point respectively.
 * @expose
 * @ojtsignore
 * @name labelStyle
 * @memberof! oj.ojChartItem
 * @instance
 * @type {object|Array.<Object>}
 * @default null
 */
/**
 * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend or other visualization elements. If not defined, series categories are used.
 * @expose
 * @ojtsignore
 * @name categories
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The value for this data item. Corresponding to the y value for bar, line, area, and combo charts and the slice values for pie, funnel and pyramid charts. Null can be specified to skip a data point.
 * @expose
 * @ojtsignore
 * @name value
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The target value for a funnel chart. When this is set, the value attribute defines the filled area within the slice and this represents the value of the whole slice.
 * @expose
 * @ojtsignore
 * @name targetValue
 * @memberof! oj.ojChartItem
 * @instance
 * @type {number}
 * @default null
 */
/**
 *  Whether drilling is enabled for the data item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all data items at once, use the drilling attribute in the top level.
 * @expose
 * @ojtsignore
 * @name drilling
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * An object containing the style properties of the box plot item.
 * @expose
 * @ojtsignore
 * @name boxPlot
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The color of the Q2 segment of the box.
 * @expose
 * @ojtsignore
 * @name boxPlot.q2Color
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS style class to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @expose
 * @ojtsignore
 * @name boxPlot.q2SvgClassName
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS inline style to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @expose
 * @ojtsignore
 * @name boxPlot.q2SvgStyle
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The CSS inline style to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @expose
 * @ojtsignore
 * @name boxPlot.q3SvgStyle
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The CSS style class to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @expose
 * @ojtsignore
 * @name boxPlot.q3SvgClassName
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the whisker stems.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerSvgClassName
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the whisker stems.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerSvgStyle
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the whisker ends.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerEndSvgClassName
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the whisker ends.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerEndSvgStyle
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  Specifies the length of the whisker ends in pixels (e.g. '9px') or as a percentage of the box width (e.g. '50%'). The specified length will be rounded down to an odd number of pixels to ensure symmetry.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerEndLength
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the median line.
 * @expose
 * @ojtsignore
 * @name boxPlot.medianSvgClassName
 * @memberof! oj.ojChartItem
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the median line.
 * @expose
 * @ojtsignore
 * @name boxPlot.medianSvgStyle
 * @memberof! oj.ojChartItem
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * @ojcomponent oj.ojChartSeries
 * @ojslotcomponent
 * @ojtsignore
 * @since 5.1.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="chartSeriesOverview-section">
 *   JET Chart Series
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#chartSeriesOverview-section"></a>
 * </h3>
 *
 * <p>The oj-chart-series element is used to declare series properties in the seriesTemplate slot of [oj-chart]{@link oj.ojChart#seriesTemplate}.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-chart data="[[dataProvider]]">
 *  &lt;template slot='seriesTemplate'>
 *    &lt;oj-chart-series
 *      drilling='on'
 *      marker-shape='[[ $current.id == "Series 1" ? "square" : "circle" ]]'>
 *    &lt;/oj-chart-series>
 *  &lt;/template>
 * &lt;/oj-chart>
 * </code>
 * </pre>
 */

/**
 * The name of the series, displayed in the legend and tooltips.
 * @expose
 * @ojtsignore
 * @name name
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The type of data objects to display for this series. Only applies to bar, line, area, stock, box plot, and combo charts.
 * @expose
 * @ojtsignore
 * @name type
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "bar"
 * @ojvalue {string} "line"
 * @ojvalue {string} "area"
 * @ojvalue {string} "lineWithArea"
 * @ojvalue {string} "candlestick"
 * @ojvalue {string} "boxPlot"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The color of the series.
 * @expose
 * @ojtsignore
 * @name color
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border color of the series.
 * @expose
 * @ojtsignore
 * @name borderColor
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border width of the series.
 * @expose
 * @ojtsignore
 * @name borderWidth
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The area color of the series. Only applies if series type is area or lineWithArea.
 * @expose
 * @ojtsignore
 * @name areaColor
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply if series type is area or lineWithArea. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @ojtsignore
 * @name areaSvgClassName
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply if series type is area or lineWithArea. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @ojtsignore
 * @name areaSvgStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the series. For series of type lineWithArea, this style will only be applied to the line if areaClassName is also specified. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @ojtsignore
 * @name svgClassName
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the series. For series of type lineWithArea, this style will only be applied to the line if areaStyle is also specified.The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @ojtsignore
 * @name svgStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the data markers.The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the marker color attribute.
 * @expose
 * @ojtsignore
 * @name markerSvgClassName
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the data markers. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the marker color attribute.
 * @expose
 * @ojtsignore
 * @name markerSvgStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The pattern used to fill the series. A solid fill is used by default, unless the seriesEffect is 'pattern'.
 * @expose
 * @ojtsignore
 * @name pattern
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "smallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
 * @expose
 * @ojtsignore
 * @name markerShape
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "square"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The color of the data markers, if different from the series color.
 * @expose
 * @ojtsignore
 * @name markerColor
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the data markers should be displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
 * @expose
 * @ojtsignore
 * @name markerDisplayed
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The size of the data markers.
 * @expose
 * @ojtsignore
 * @name markerSize
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 */
/**
 * The width of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
 * @expose
 * @ojtsignore
 * @name lineWidth
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {number}
 * @default null
 * @ojunits pixels
 * @ojmin 0
 */
/**
 * The line style of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
 * @expose
 * @ojtsignore
 * @name lineStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default "solid"
 */
/**
 * The line type of the data line or area. Only applies to line, area, scatter, and bubble series. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
 * @expose
 * @ojtsignore
 * @name lineType
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "straight"
 * @ojvalue {string} "curved"
 * @ojvalue {string} "stepped"
 * @ojvalue {string} "centeredStepped"
 * @ojvalue {string} "segmented"
 * @ojvalue {string} "centeredSegmented"
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 *  The URI of the custom image. If specified, it takes precedence over shape.
 * @expose
 * @ojtsignore
 * @name source
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the hover state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name sourceHover
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the selected state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name sourceSelected
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The optional URI for the hover selected state. If not specified, the source image will be used.
 * @expose
 * @ojtsignore
 * @name sourceHoverSelected
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * A number from 0 to 1 indicating the amount to explode the pie slice. Only applies to pie charts.
 * @expose
 * @ojtsignore
 * @name pieSliceExplode
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {number}
 * @default 0
 * @ojmin 0
 * @ojmax 1
 */
/**
 * Defines whether the series is associated with the y2 axis. Only applies to Cartesian bar, line, area, and combo charts.
 * @expose
 * @ojtsignore
 * @name assignedToY2
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * In stacked charts, groups series together for stacking. All series without a stackCategory will be assigned to the same stack.
 * @expose
 * @ojtsignore
 * @name stackCategory
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Defines whether the series should be shown in the legend. When set to 'auto', the series will not be displayed in the legend if it has null data or if it is a stock, funnel, or pyramid series.
 * @expose
 * @ojtsignore
 * @name displayInLegend
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 *  Whether drilling is enabled on the series item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all series items at once, use the drilling attribute in the top level.
 * @expose
 * @ojtsignore
 * @name drilling
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * An optional array of category strings corresponding to this series. This allows highlighting and filtering of a series through interactions with legend sections. If not defined, the series id is used.
 * @expose
 * @ojtsignore
 * @name categories
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The description of this series. This is used for accessibility and for customizing the tooltip text on the corressponding legend item for the series.
 * @expose
 * @ojtsignore
 * @name shortDesc
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 * @ojtranslatable
 */
/**
 * An object containing the style properties of the box plot series.
 * @expose
 * @ojtsignore
 * @name boxPlot
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The color of the Q2 segment of the box.
 * @expose
 * @ojtsignore
 * @name boxPlot.q2Color
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS style class to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @expose
 * @ojtsignore
 * @name boxPlot.q2SvgClassName
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS inline style to apply to the Q2 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q2Color attribute.
 * @expose
 * @ojtsignore
 * @name boxPlot.q2SvgStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  The color of the Q3 segment of the box.
 * @expose
 * @ojtsignore
 * @name boxPlot.q3Color
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS style class to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @expose
 * @ojtsignore
 * @name boxPlot.q3SvgClassName
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The CSS inline style to apply to the Q3 segment of the box. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the q3Color attribute.
 * @expose
 * @ojtsignore
 * @name boxPlot.q3SvgStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the whisker stems.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerSvgClassName
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the whisker stems.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerSvgStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the whisker ends.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerEndSvgClassName
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the whisker ends.
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerEndSvgStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 *  Specifies the length of the whisker ends in pixels (e.g. '9px') or as a percentage of the box width (e.g. '50%').
 * @expose
 * @ojtsignore
 * @name boxPlot.whiskerEndLength
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the median line.
 * @expose
 * @ojtsignore
 * @name boxPlot.medianSvgClassName
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS inline style to apply to the median line.
 * @expose
 * @ojtsignore
 * @name boxPlot.medianSvgStyle
 * @memberof! oj.ojChartSeries
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * @ojcomponent oj.ojSparkChart
 * @augments oj.dvtBaseComponent
 * @ojtsignore
 * @since 0.7
 * @ojshortdesc Displays information graphically, typically highlighting the trend of a data set in a compact form factor.
 * @ojstatus preview
 * @ojrole application
 *
 * @classdesc
 * <h3 id="sparkChartOverview-section">
 *   JET Spark Chart
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sparkChartOverview-section"></a>
 * </h3>
 *
 * <p>Spark Chart component for JET with support for bar, line, area, and floating bar subtypes.  Spark Charts are
 * designed to visualize the trend of a data set in a compact form factor.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-spark-chart
 *   type='line'
 *   items='[5, 8, 2, 7, 0, 9]'
 * >
 * &lt;/oj-spark-chart>
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
oj.__registerWidget('oj.ojSparkChart', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * An array of <a href="/jsdocs/oj.ojSparkChart.html#Item">oj.ojSparkChart.Item</a> typed objects. Also accepts a Promise for deferred data rendering.
     * @ignore
     * @name data
     * @memberof oj.ojSparkChart
     * @instance
     * @type {Array.<Object>|Promise|null}
     * @ojsignature {target: "Accessor", value: {GetterType: "oj.DataProvider.<oj.ojSparkChart.Item>|null", SetterType: "oj.DataProvider.<oj.ojSparkChart.Item>|null"}, jsdocOverride: true}
     * @default null
     */  
     data: null,
     
    /**
     * An array of objects with the following properties that defines the data for the spark chart. Also accepts a Promise for deferred data rendering.</ul>
     * @name items
     * @memberof oj.ojSparkChart
     * @instance
     * @type {Array.<Object>|Array.<number>|Promise|null}
     * @default null
     * 
     * @example <caption>Initialize the spark chart with the 
     * <code class="prettyprint">items</code> attribute specified:</caption>
     * &lt;oj-spark-chart type="bar" items='[{"low": 4, "high": 20, "color": "red"}, 
     *                                    {"low": 9, "high": 20, "color": "yellow"}, 
     *                                    {"low": 0, "high": 7, "color": "green"}]'>
     * &lt;/oj-spark-chart>
     * 
     * &lt;oj-spark-chart items='[[itemsPromise]]'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">items</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = mySparkChart.items[0];
     * 
     * // Get all (The items getter always returns a Promise so there is no "get one" syntax)
     * var values = mySparkChart.items;
     * 
     * // Set all (There is no permissible "set one" syntax.)
     * mySparkChart.items = [{"low": 4, "high": 20, "color": "red"}, 
     *                       {"low": 9, "high": 20, "color": "yellow"}, 
     *                       {"low": 0, "high": 7, "color": "green"}];
     */
    items: null,
    
    /**
     * An array of objects with the following properties defining the reference objects associated with the y axis of the spark chart.
     * @expose
     * @name referenceObjects
     * @memberof oj.ojSparkChart
     * @instance
     * @type {Array.<Object>}
     * @ojsignature {target: "Accessor", value: {GetterType: "Array<oj.ojSparkChart.ReferenceObject>", SetterType: "Array<oj.ojSparkChart.ReferenceObject>"}, jsdocOverride: true}
     * @default []
     * 
     * @example <caption>Initialize the spark chart with the 
     * <code class="prettyprint">reference-objects</code> attribute specified:</caption>
     * &lt;oj-spark-chart reference-objects='[{"type": "area", "high": 10, "low": 2, "location": "front", "color": "red"},
     *                                     {"type": "line", "value": 9, "location": "front", "color": "yellow"}, 
     *                                     {"type": "area", "high": 10, "low": 0, "location": "back", "color": "green"}]'>&lt;/oj-spark-chart>
     *
     * 
     * &lt;oj-spark-chart reference-objects='[[referencePromise]]'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">referenceObjects</code>
     * property after initialization:</caption>
     * // Get one
     * var value = mySparkChart.referenceObjects[0];
     *
     * // Get all (The items getter always returns a Promise so there is no "get one" syntax)
     * var values = mySparkChart.referenceObjects;
     * 
     * // Set all (There is no permissible "set one" syntax.)
     * mySparkChart.referenceObjects=[{"type": "area", "high": 10, "low": 2, "location": "front", "color": "red"}, 
     *                                {"type": "line", "value": 9, "location": "front", "color": "yellow"}, 
     *                                {"type": "area", "high": 10, "low": 0, "location": "back", "color": "green"}];
     */
    referenceObjects: [],

    /**
     * An object containing an optional callback function for tooltip customization. 
     * @expose
     * @name tooltip
     * @memberof oj.ojSparkChart
     * @instance
     * @type {Object}
     * @default {"renderer": null}
     * 
     * @example <caption>Initialize the spark chart with the 
     * <code class="prettyprint">tooltip</code> attribute specified:</caption>
     * <!-- Using dot notation -->
     * &lt;oj-spark-chart tooltip.renderer='[[tooltipFun]]'>&lt;/oj-spark-chart>
     * 
     * &lt;oj-spark-chart tooltip='[[{"renderer": tooltipFun}]]'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">tooltip</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = mySparkChart.tooltip.renderer;
     * 
     * // Get all
     * var values = mySparkChart.tooltip;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for 
     * // subproperties rather than setting a subproperty directly.
     * mySparkChart.setProperty('tooltip.renderer', tooltipFun);
     * 
     * // Set all. Must list every resource key, as those not listed are lost.
     * mySparkChart.tooltip={'renderer': tooltipFun};
     */
    tooltip: {
      /**
       *  A function that returns a custom tooltip. The function takes a dataContext argument, 
       *  provided by the chart, with the following properties: 
       *  <ul>
       *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li>
       *   <li>color: The color of the chart.</li>
       *   <li>componentElement: The spark chart element.</li>
       *  </ul>
       *  The function should return an Object that contains only one of the two properties:
       *  <ul>
       *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
       *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
       *  </ul>
       * @expose
       * @name tooltip.renderer
       * @memberof! oj.ojSparkChart
       * @instance
       * @type {function(Object):Object|null}
       * @ojsignature {target: "Type", value: "((context: oj.ojSparkChart.TooltipContext) => ({insert: Element|string}|{preventDefault: boolean}))|null", jsdocOverride: true}
       * @example <caption>See the <a href="#tooltip">tooltip</a> attribute for usage examples.</caption>
       */
      renderer: null
    },
  
    /**
     * The chart type.
     * @expose
     * @name type
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @ojvalue {string} "area"
     * @ojvalue {string} "lineWithArea"
     * @ojvalue {string} "bar"
     * @ojvalue {string} "line"
     * @default "line"
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">type</code> attribute specified:</caption>
     * &lt;oj-spark-chart type='area'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">type</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.type;
     * 
     * // setter
     * mySparkChart.type="area";
     */
    type: "line",
    
    /**
     * The color of the data items. The default value varies based on theme.
     * @expose
     * @name color
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">color</code> attribute specified:</caption>
     * &lt;oj-spark-chart color='rgb(35, 123, 177)'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">color</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.color;
     * 
     * // setter
     * mySparkChart.color="rgb(35, 123, 177)";
     */
    color: "#267DB3",
    
    /**
     * The color of the area in area or lineWithArea spark chart.
     * @expose
     * @name areaColor
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @default ""
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">area-color</code> attribute specified:</caption>
     * &lt;oj-spark-chart type='area' area-color='red'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">areaColor</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.areaColor;
     * 
     * // setter
     * mySparkChart.areaColor="red";
     */
    areaColor: "", 
  
    /**
     * The CSS style class to apply if the type is area or lineWithArea. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
     * @expose
     * @name areaSvgClassName
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @default ""
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">area-svg-class-name</code> attribute specified:</caption>
     * &lt;oj-spark-chart type='lineWithArea' area-svg-class-name='svgClassName'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">areaSvgClassName</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.areaSvgClassName;
     * 
     * // setter
     * mySparkChart.areaSvgClassName = "svgClassName";
     */
    areaSvgClassName: "",
    
    /**
     * The inline style to apply if the type is area or lineWithArea. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
     * @expose
     * @name areaSvgStyle
     * @memberof oj.ojSparkChart
     * @instance
     * @type {Object}
     * @default {}
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">area-svg-style</code> attribute specified:</caption>
     * &lt;oj-spark-chart type='lineWithArea' area-svg-style='{"fill":"url(someURL#filterId)"}'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">areaSvgStyle</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.areaSvgStyle;
     * 
     * // setter
     * mySparkChart.areaSvgStyle = {"fill":"url(someURL#filterId)"};
     */
    areaSvgStyle: {},

    /**
     * The CSS style class to apply to the data items. For type lineWithArea, this style will only be applied to the line if areaClassName is also specified. The style class and inline style will override any other styling specified through the properties. For tooltips, it's recommended to also pass a representative color to the color attribute.
     * @expose
     * @name svgClassName
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @default ""
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
     * &lt;oj-spark-chart svg-class-name='className'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">svgClassName</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.svgClassName;
     * 
     * // setter
     * mySparkChart.svgClassName = "className";
     */
    svgClassName: "",
    
    /**
     * The inline style to apply to the data items. For type lineWithArea, this style will only be applied to the line if areaStyle is also specified. The style class and inline style will override any other styling specified through the properties. For tooltips, it's recommended to also pass a representative color to the color attribute.
     * @expose
     * @name svgStyle
     * @memberof oj.ojSparkChart
     * @instance
     * @type {Object}
     * @default {}
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">svg-style</code> attribute specified:</caption>
     * &lt;oj-spark-chart svg-style='{"fill":"url(someURL#filterId)"}'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">svgStyle</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.svgStyle;
     * 
     * // setter
     * mySparkChart.svgStyle = {"fill":"url(someURL#filterId)"};
     */
    svgStyle: {},
    
    /**
     * The color of the first data item.
     * @expose
     * @name firstColor
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @default ""
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">first-color</code> attribute specified:</caption>
     * &lt;oj-spark-chart first-color='yellow'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">firstColor</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.firstColor;
     * 
     * // setter
     * mySparkChart.firstColor = "yellow";
     */
    firstColor: "",
    
    /**
     * The color of the last data item.
     * @expose
     * @name lastColor
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @default ""
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">last-color</code> attribute specified:</caption>
     * &lt;oj-spark-chart last-color='red'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">lastColor</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.lastColor;
     * 
     * // setter
     * mySparkChart.lastColor = "red";
     */
    lastColor: "",  
    
    /**
     * The color of the data item with the greatest value.
     * @expose
     * @name highColor
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @default ""
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">high-color</code> attribute specified:</caption>
     * &lt;oj-spark-chart high-color='blue'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">highColor</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.highColor;
     * 
     * // setter
     * mySparkChart.highColor = "blue";
     */
    highColor: "",
    
    /**
     * The color of the data item with the lowest value.
     * @expose
     * @name lowColor
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @default ""
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">low-color</code> attribute specified:</caption>
     * &lt;oj-spark-chart low-color='blue'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">lowColor</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.lowColor;
     * 
     * // setter
     * mySparkChart.lowColor = "blue";
     */
    lowColor: "",
    
    /**
     * The duration of the animations in milliseconds. The default value comes from the CSS and varies based on theme.
     * @expose
     * @name animationDuration
     * @memberof oj.ojSparkChart
     * @instance
     * @type {?number}
     * @ojunits milliseconds
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">animation-duration</code> attribute specified:</caption>
     * &lt;oj-spark-chart animation-duration='50'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">animationDuration</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.animationDuration;
     * 
     * // setter
     * mySparkChart.animationDuration = 50;
     */
    animationDuration: undefined,
     
    /**
     * Defines the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">animation-on-data-change</code> attribute specified:</caption>
     * &lt;oj-spark-chart animation-on-data-change='auto'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">animationOnDataChange</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.animationOnDataChange;
     * 
     * // setter
     * mySparkChart.animationOnDataChange = "auto";
     */
    animationOnDataChange: "none",
    
    /**
     * Defines the animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">animation-on-display</code> attribute specified:</caption>
     * &lt;oj-spark-chart animation-on-display='auto'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">animationOnDisplay</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.animationOnDisplay;
     * 
     * // setter
     * mySparkChart.animationOnDisplay = "auto";
     */
    animationOnDisplay: "none",
     
    /**
     * Defines whether visual effects such as overlays are applied to the spark chart.
     * @expose
     * @name visualEffects
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @ojvalue {string} "none"
     * @ojvalue {string} "auto"
     * @default "auto"
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">visual-effects</code> attribute specified:</caption>
     * &lt;oj-spark-chart visual-effects='none'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">visualEffects</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.visualEffects;
     * 
     * // setter
     * mySparkChart.visualEffects = "none";
     */
    visualEffects: "auto",
    
    /**
     * Defines whether the axis baseline starts at the minimum value of the data or at zero.
     * @expose
     * @name baselineScaling
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @ojvalue {string} "zero"
     * @ojvalue {string} "min"
     * @default "min"
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">baseline-scaling</code> attribute specified:</caption>
     * &lt;oj-spark-chart baseline-scaling='zero'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">baselineScaling</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.baselineScaling;
     * 
     * // setter
     * mySparkChart.baselineScaling = "zero";
     */
    baselineScaling: "min",
     
    /**
     * The width of the data line. Only applies to line spark charts.
     * @expose
     * @name lineWidth
     * @memberof oj.ojSparkChart
     * @instance
     * @type {number}
     * @default 1
     * @ojunits pixels
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">line-width</code> attribute specified:</caption>
     * &lt;oj-spark-chart line-width='4'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">lineWidth</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.lineWidth;
     * 
     * // setter
     * mySparkChart.lineWidth = 4;
     */
    lineWidth: 1,
     
    /**
     * The line style of the data line. Only applies to line spark charts.
     * @expose
     * @name lineStyle
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @ojvalue {string} "dotted"
     * @ojvalue {string} "dashed"
     * @ojvalue {string} "solid"
     * @default "solid"
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">line-style</code> attribute specified:</caption>
     * &lt;oj-spark-chart type="line" line-style='dotted'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">lineStyle</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.lineStyle;
     * 
     * // setter
     * mySparkChart.lineStyle = "dotted";
     */
    lineStyle: "solid",
    
    /**
     * The line type of the data line or area. Only applies to line and area spark charts.
     * @expose
     * @name lineType
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @ojvalue {string} "curved"
     * @ojvalue {string} "stepped"
     * @ojvalue {string} "centeredStepped"
     * @ojvalue {string} "segmented"
     * @ojvalue {string} "centeredSegmented"
     * @ojvalue {string} "none"
     * @ojvalue {string} "straight"
     * @default "straight"
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">line-type</code> attribute specified:</caption>
     * &lt;oj-spark-chart type="line" line-type='curved'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">lineType</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.lineType;
     * 
     * // setter
     * mySparkChart.lineType = "curved";
     */
    lineType: "straight",
     
    /**
     * The shape of the data markers. Can take the name of a built-in shape or the svg path commands for a custom shape. Only applies to line and area spark charts.
     * @expose
     * @name markerShape
     * @memberof oj.ojSparkChart
     * @instance
     * @type {string}
     * @ojvalue {string} "square"
     * @ojvalue {string} "circle"
     * @ojvalue {string} "diamond"
     * @ojvalue {string} "plus"
     * @ojvalue {string} "triangleDown"
     * @ojvalue {string} "triangleUp"
     * @ojvalue {string} "human"
     * @ojvalue {string} "star"
     * @ojvalue {string} "auto"
     * @default "auto"
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">marker-shape</code> attribute specified:</caption>
     * &lt;oj-spark-chart type="area" marker-shape="triangleUp">&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">markerShape</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.markerShape;
     * 
     * // setter
     * mySparkChart.markerShape = "triangleUp";
     */
    markerShape: "auto",
     
    /**
     * The size of the data markers in pixels. Only applies to line and area spark charts.
     * @expose
     * @name markerSize
     * @memberof oj.ojSparkChart
     * @instance
     * @type {number}
     * @default 5
     * @ojunits pixels
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">marker-size</code> attribute specified:</caption>
     * &lt;oj-spark-chart type="area" marker-size='15'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">markerSize</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.markerSize;
     * 
     * // setter
     * mySparkChart.markerSize = 15;
     */
    markerSize: 5,
     
    /**
     * Specifies the width of the bar gap as a ratio of the item width. The valid value is a number from 0 to 1.
     * @expose
     * @name barGapRatio
     * @memberof oj.ojSparkChart
     * @instance
     * @type {number}
     * @default 0.25
     * 
     * @example <caption>Initialize the spark chart with the <code class="prettyprint">bar-gap-ratio</code> attribute specified:</caption>
     * &lt;oj-spark-chart type="bar" bar-gap-ratio='0.12'>&lt;/oj-spark-chart>
     * 
     * @example <caption>Get or set the <code class="prettyprint">barGapRatio</code> 
     * property after initialization:</caption>
     * // getter
     * var value = mySparkChart.barGapRatio;
     * 
     * // setter
     * mySparkChart.barGapRatio = 0.12;
     */
    barGapRatio: 0.25
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    this._focusable({'element': this.element, 'applyHighlight': true});
    return dvt.SparkChart.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-sparkchart');
    return styleClasses;
  },
  
  //** @inheritdoc */
  _GetChildStyleClasses: function() {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-sparkchart'] = {'path': 'animationDuration', 'property': 'ANIM_DUR'};
    return styleClasses;
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.CHART'] = translations['componentName'];
    return ret;
  },

  //** @inheritdoc */
  _Render : function() {
    // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
    if(this.element.attr('title'))
    {
      this.options['shortDesc'] =  this.element.attr('title');
      this.element.data( this.element,'title', this.element.attr('title'));
      this.element.removeAttr('title');
    }
    else if (this.element.data('title'))
      this.options['shortDesc'] =  this.element.data('title');

    // Call the super to render
    this._super();
  },

  /**
   * Returns an object with the following properties for automation testing verification of the data item with
   * the specified item index.
   * @param {number} itemIndex The item index
   * @property {string} borderColor The border color of the item	
   * @property {string} color The color of the item	
   * @property {Date} date The date (x value) of the item	
   * @property {number} high The high value for a range item	
   * @property {number} low  The low value for a range item	
   * @property {number} value The value of the item
   * @return {Object|null} An object containing properties for the data item, or null if none exists.
   * @ojsignature {target: "Type", value: "oj.ojSparkChart.ItemContext|null", jsdocOverride: true, for: "returns"}
   * @expose
   * @instance
   * @memberof oj.ojSparkChart
   */
  getDataItem: function(itemIndex) {
    var ret = this._component.getAutomation().getDataItem(itemIndex);

    // : Provide backwards compatibility for getters until 1.2.0.
    this._AddAutomationGetters(ret);
    if (ret)
      ret['getFloatValue'] = ret['getLow'];

    return ret;
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['items', 'data']};
  },

  /**
   * Adds getters for the properties on the specified map. 
   * @param {Object|null} map
   * @memberof oj.ojSparkChart
   * @instance
   * @protected
   */
  _AddAutomationGetters: function(map) {
    if(!map)
      return;

    // These getters are deprecated in 3.0.0
    var props = {};
    for (var key in map) {
      this._addGetter(map, key, props);
    }
    Object.defineProperties(map, props);
  },

  /**
   * Adds getter for the specified property on the specified properties map.
   * @param {Object} map
   * @param {string} key
   * @param {Object} props The properties map onto which the getter will be added.
   * @memberof oj.ojSparkChart
   * @instance
   * @private
   */
  _addGetter: function(map, key, props) {
    var prefix = (key == 'selected') ? 'is' : 'get';
    var getterName = prefix + key.charAt(0).toUpperCase() + key.slice(1);
    props[getterName] = {'value': function() { return map[key] }};
  },
});

/**
 * <p>This element has no touch interaction.  </p>
 *
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojSparkChart
 */

/**
 * <p>This element has no keyboard interaction.  </p>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojSparkChart
 */
 
/**
 * The value of the data item.
 * @expose
 * @name items[].value
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The low value for range bar/area. Define 'low' and 'high' instead of 'value' to create a range bar/area spark chart.
 * @expose
 * @name items[].low
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The high value for range bar/area. Define 'low' and 'high' instead of 'value' to create a range bar/area spark chart.
 * @expose
 * @name items[].high
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The date for the data item. The date should only be specified if the interval between data items is irregular.
 * @expose
 * @name items[].date
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The color of the bar or marker for the data item. This override can be used to highlight important values or thresholds.
 * @expose
 * @name items[].color
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @expose
 * @name items[].svgClassName
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @expose
 * @name items[].svgStyle
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {object}
 * @default null
 */
/**
 * Defines whether a marker should be displayed for the data item. Only applies to line and area spark charts.
 * @expose
 * @name items[].markerDisplayed
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */
/**
 * The default border color for the data items.
 * @expose
 * @name items[].borderColor
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The shape of the data markers. Can take the name of a built-in shape or the svg path commands for a custom shape. Only applies to line and area spark charts.
 * @expose
 * @name items[].markerShape
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {string}
 * @ojvalue {string} "square"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The size of the data markers in pixels. Only applies to line and area spark charts.
 * @expose
 * @name items[].markerSize
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {number}
 * @default null
 */
 /**
  * The type of reference object being shown.
  * @expose
  * @name referenceObjects[].type
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {string}
  * @ojvalue {string} "area"
  * @ojvalue {string} "line"
  * @default "line"
  */
 /**
  * The location of the reference object relative to the data items.
  * @expose
  * @name referenceObjects[].location
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {string}
  * @ojvalue {string} "front"
  * @ojvalue {string} "back"
  * @default "back"
  */
 /**
  * The color of the reference object.
  * @expose
  * @name referenceObjects[].color
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {string}
  * @default null
  */
 /**
  * The width of a reference line.
  * @expose
  * @name referenceObjects[].lineWidth
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {number}
  * @default null
  */
 /**
  * The line style of a reference line.
  * @expose
  * @name referenceObjects[].lineStyle
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {string}
  * @ojvalue {string} "dotted"
  * @ojvalue {string} "dashed"
  * @default null
  */
 /**
  * The CSS style class to apply to the reference object. The style class and inline style will override any other styling specified through the properties.
  * @expose
  * @name referenceObjects[].svgClassName
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {string}
  * @default null
  */
 /**
  * The inline style to apply to the reference object. The style class and inline style will override any other styling specified through the properties.
  * @expose
  * @name referenceObjects[].svgStyle
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {object}
  * @default null
  */
 /**
  * The value of a reference line.
  * @expose
  * @name referenceObjects[].value
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {number}
  * @default null
  */
 /**
  * The low value of a reference area.
  * @expose
  * @name referenceObjects[].low
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {number}
  * @default null
  */
 /**
  * The high value of a reference area.
  * @expose
  * @name referenceObjects[].high
  * @memberof! oj.ojSparkChart
  * @instance
  * @type {number}
  * @default null
  */

// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojSparkChart.Item
 * @ignore
 * @property {string} [borderColor] The default border color for the data items.
 * @property {string} [color] The color of the bar or marker for the data item. This override can be used to highlight important values or thresholds.
 * @property {Date} [date] The date for the data item. The date should only be specified if the interval between data items is irregular.
 * @property {number} [high] The high value for range bar/area. Define 'low' and 'high' instead of 'value' to create a range bar/area spark chart.
 * @property {number} [low] The low value for range bar/area. Define 'low' and 'high' instead of 'value' to create a range bar/area spark chart.
 * @property {"on"|"off"} [markerDisplayed="off"] Defines whether a marker should be displayed for the data item. Only applies to line and area spark charts.
 * @property {"square"|"circle"|"diamond"|"plus"|"triangleDown"|"triangleUp"|"human"|"star"|"auto"|string} [markerShape="auto"] The shape of the data markers. Can take the name of a built-in shape or the svg path commands for a custom shape. Only applies to line and area spark charts.
 * @property {number} [markerSize] The size of the data markers in pixels. Only applies to line and area spark charts.
 * @property {string} [svgClassName] The CSS style class to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @property {Object} [svgStyle] The inline style to apply to the data item. The style class and inline style will override any other styling specified through the properties. For tooltips and hover interactivity, it's recommended to also pass a representative color to the item color attribute.
 * @property {number} [value] The value of the data item.
 */
 
/**
 * @typedef {Object} oj.ojSparkChart.ReferenceObject
 * @ignore
 * @property {string} [color] The color of the reference object.
 * @property {number} [high] The high value of a reference area.
 * @property {number} [lineWidth] The width of a reference line.
 * @property {"dotted"|"dashed"|"solid"} [lineStyle="solid"] The line style of a reference line.
 * @property {"front"|"back"} [location="back"]  The location of the reference object relative to the data items.
 * @property {number} [low] The low value of a reference area.
 * @property {string} [svgClassName] The CSS style class to apply to the reference object. The style class and inline style will override any other styling specified through the properties.
 * @property {Object} [svgStyle] The inline style to apply to the reference object. The style class and inline style will override any other styling specified through the properties.
 * @property {"area"|"line"} [type="line"] The type of reference object being shown.
 * @property {number} [value] The value of a reference line.
 */

/**
 * @typedef {Object} oj.ojSparkChart.TooltipContext
 * @ignore
 * @property {string} color The color of the chart.
 * @property {Element} componentElement The spark chart element.
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 */
 
// METHOD TYPEDEFS

/**
 * @typedef {Object} oj.ojSparkChart.ItemContext
 * @ignore
 * @property {string} borderColor The border color of the item
 * @property {string} color The color of the item
 * @property {Date} date The date (x value) of the item
 * @property {number} high The high value for a range item
 * @property {number} low  The low value for a range item
 * @property {number} value The value of the item
 */
 
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  var ojChartMeta = {
    properties: {
      animationOnDataChange: {
        type: 'string',
        enumValues: ['auto', 'slideToLeft', 'slideToRight', 'none']
      },
      animationOnDisplay: {
        type: 'string',
        enumValues: ['auto', 'alphaFade', 'zoom', 'none']
      },
      as: {
        type: 'string'
      },
      coordinateSystem: {
        type: 'string',
        enumValues: ['polar', 'cartesian']
      },
      data: {
        type: 'DataProvider'
      },
      dataCursor: {
        type: 'string',
        enumValues: ['on', 'off', 'auto']
      },
      dataCursorBehavior: {
        type: 'string',
        enumValues: ['smooth', 'snap', 'auto']
      },
      dataCursorPosition: {
        type: 'object',
        properties: {
          x: {
            type: 'number|string'
          },
          y: {
            type: 'number'
          },
          y2: {
            type: 'number'
          }
        },
        writeback: true
      },
      dataLabel: {},
      dnd: {
        type: 'object',
        properties: {
          drag: {
            type: 'object',
            properties: {
              groups: {
                type: 'object',
                properties: {
                  dataTypes: {
                    type: 'Array<string>'
                  },
                  drag: {},
                  dragEnd: {},
                  dragStart: {}
                }
              },
              items: {
                type: 'object',
                properties: {
                  dataTypes: {
                    type: 'Array<string>'
                  },
                  drag: {},
                  dragEnd: {},
                  dragStart: {}
                }
              },
              series: {
                type: 'object',
                properties: {
                  dataTypes: {
                    type: 'Array<string>'
                  },
                  drag: {},
                  dragEnd: {},
                  dragStart: {}
                }
              }
            }
          },
          drop: {
            type: 'object',
            properties: {
              legend: {
                type: 'object',
                properties: {
                  dataTypes: {
                    type: 'Array<string>'
                  },
                  dragEnter: {},
                  dragLeave: {},
                  dragOver: {},
                  drop: {}
                }
              },
              plotArea: {
                type: 'object',
                properties: {
                  dataTypes: {
                    type: 'Array<string>'
                  },
                  dragEnter: {},
                  dragLeave: {},
                  dragOver: {},
                  drop: {}
                }
              },
              xAxis: {
                type: 'object',
                properties: {
                  dataTypes: {
                    type: 'Array<string>'
                  },
                  dragEnter: {},
                  dragLeave: {},
                  dragOver: {},
                  drop: {}
                }
              },
              y2Axis: {
                type: 'object',
                properties: {
                  dataTypes: {
                    type: 'Array<string>'
                  },
                  dragEnter: {},
                  dragLeave: {},
                  dragOver: {},
                  drop: {}
                }
              },
              yAxis: {
                type: 'object',
                properties: {
                  dataTypes: {
                    type: 'Array<string>'
                  },
                  dragEnter: {},
                  dragLeave: {},
                  dragOver: {},
                  drop: {}
                }
              }
            }
          }
        }
      },
      dragMode: {
        type: 'string',
        enumValues: ['pan', 'zoom', 'select', 'off', 'user']
      },
      drilling: {
        type: 'string',
        enumValues: ['on', 'seriesOnly', 'groupsOnly', 'off']
      },
      groupComparator: {},
      groups: {
        type: 'Array<any>|Promise'
      },
      hiddenCategories: {
        type: 'Array<string>',
        writeback: true
      },
      hideAndShowBehavior: {
        type: 'string',
        enumValues: ['withRescale', 'withoutRescale', 'none']
      },
      highlightedCategories: {
        type: 'Array<string>',
        writeback: true
      },
      highlightMatch: {
        type: 'string',
        enumValues: ['any', 'all']
      },
      hoverBehavior: {
        type: 'string',
        enumValues: ['dim', 'none']
      },
      initialZooming: {
        type: 'string',
        enumValues: ['first', 'last', 'none']
      },
      legend: {
        type: 'object',
        properties: {
          backgroundColor: {
            type: 'string'
          },
          borderColor: {
            type: 'string'
          },
          maxSize: {
            type: 'string'
          },
          position: {
            type: 'string',
            enumValues: ['start', 'end', 'bottom', 'top', 'auto']
          },
          referenceObjectSection: {
            type: 'object',
            properties: {
              title: {
                type: 'string'
              },
              titleHalign: {
                type: 'string',
                enumValues: ['center', 'end', 'start']
              },
              titleStyle: {
                type: 'object'
              }
            }
          },
          rendered: {
            type: 'string',
            enumValues: ['on', 'off', 'auto']
          },
          scrolling: {
            type: 'string',
            enumValues: ['off', 'asNeeded']
          },
          sections: {
            type: 'Array<object>'
          },
          seriesSection: {
            type: 'object',
            properties: {
              title: {
                type: 'string'
              },
              titleHalign: {
                type: 'string',
                enumValues: ['center', 'end', 'start']
              },
              titleStyle: {
                type: 'object'
              }
            }
          },
          size: {
            type: 'string'
          },
          symbolHeight: {
            type: 'number'
          },
          symbolWidth: {
            type: 'number'
          },
          textStyle: {
            type: 'object'
          },
          title: {
            type: 'string'
          },
          titleHalign: {
            type: 'string',
            enumValues: ['center', 'end', 'start']
          },
          titleStyle: {
            type: 'object'
          }
        }
      },
      orientation: {
        type: 'string',
        enumValues: ['horizontal', 'vertical']
      },
      otherThreshold: {
        type: 'number'
      },
      overview: {
        type: 'object',
        properties: {
          content: {
            type: 'object'
          },
          height: {
            type: 'string'
          },
          rendered: {
            type: 'string',
            enumValues: ['on', 'off']
          }
        }
      },
      pieCenter: {
        type: 'object',
        properties: {
          converter: {
            type: 'object'
          },
          label: {
            type: 'string'
          },
          labelStyle: {
            type: 'object'
          },
          renderer: {},
          scaling: {
            type: 'string',
            enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
          }
        }
      },
      pieCenterLabel: {
        type: 'object',
        properties: {
          style: {
            type: 'object'
          },
          text: {
            type: 'string'
          }
        }
      },
      plotArea: {
        type: 'object',
        properties: {
          backgroundColor: {
            type: 'string'
          },
          borderColor: {
            type: 'string'
          },
          borderWidth: {
            type: 'number'
          },
          rendered: {
            type: 'string',
            enumValues: ['on', 'off']
          }
        }
      },
      polarGridShape: {
        type: 'string',
        enumValues: ['polygon', 'circle']
      },
      selection: {
        type: 'Array<any>',
        writeback: true
      },
      selectionMode: {
        type: 'string',
        enumValues: ['single', 'multiple', 'none']
      },
      seriesComparator: {},
      series: {
        type: 'Array<object>|Promise'
      },
      sorting: {
        type: 'string',
        enumValues: ['ascending', 'descending', 'off']
      },
      splitDualY: {
        type: 'string',
        enumValues: ['on', 'off', 'auto']
      },
      splitterPosition: {
        type: 'number'
      },
      stack: {
        type: 'string',
        enumValues: ['on', 'off']
      },
      stackLabel: {
        type: 'string',
        enumValues: ['on', 'off']
      },
      styleDefaults: {
        type: 'object',
        properties: {
          animationDownColor: {
            type: 'string'
          },
          animationDuration: {
            type: 'number'
          },
          animationIndicators: {
            type: 'string',
            enumValues: ['none', 'all']
          },
          animationUpColor: {
            type: 'string'
          },
          barGapRatio: {
            type: 'number'
          },
          borderColor: {
            type: 'string'
          },
          borderWidth: {
            type: 'number'
          },
          boxPlot: {
            type: 'object',
            properties: {
              medianSvgClassName: {
                type: 'string'
              },
              medianSvgStyle: {
                type: 'object'
              },
              whiskerSvgClassName: {
                type: 'string'
              },
              whiskerEndSvgClassName: {
                type: 'string'
              },
              whiskerEndLength: {
                type: 'string'
              },
              whiskerEndSvgStyle: {
                type: 'object'
              },
              whiskerSvgStyle: {
                type: 'object'
              }
            }
          },
          colors: {
            type: 'Array<string>'
          },
          dataCursor: {
            type: 'object',
            properties: {
              lineColor: {
                type: 'string'
              },
              lineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              lineWidth: {
                type: 'number'
              },
              markerColor: {
                type: 'string'
              },
              markerDisplayed: {
                type: 'string',
                enumValues: ['on', 'off']
              },
              markerSize: {
                type: 'number'
              }
            }
          },
          dataItemGaps: {
            type: 'string'
          },
          dataLabelPosition: {
            type: 'string|Array<string>',
            enumValues: ['center', 'outsideSlice', 'aboveMarker', 'belowMarker', 'beforeMarker',
              'afterMarker', 'insideBarEdge', 'outsideBarEdge', 'none', 'auto']
          },
          dataLabelStyle: {
            type: 'object|Array<object>'
          },
          funnelBackgroundColor: {
            type: 'string'
          },
          groupSeparators: {
            type: 'object',
            properties: {
              color: {
                type: 'string'
              },
              rendered: {
                type: 'string',
                enumValues: ['auto', 'off']
              }
            }
          },
          hoverBehaviorDelay: {
            type: 'number'
          },
          lineStyle: {
            type: 'string',
            enumValues: ['dotted', 'dashed', 'solid']
          },
          lineType: {
            type: 'string',
            enumValues: ['straight', 'curved', 'stepped', 'centeredStepped', 'segmented', 'centeredSegmented', 'none', 'auto']
          },
          lineWidth: {
            type: 'number'
          },
          markerColor: {
            type: 'string'
          },
          markerDisplayed: {
            type: 'string',
            enumValues: ['on', 'off', 'auto']
          },
          markerShape: {
            type: 'string'
          },
          markerSize: {
            type: 'number'
          },
          marqueeBorderColor: {
            type: 'string'
          },
          marqueeColor: {
            type: 'string'
          },
          maxBarWidth: {
            type: 'number'
          },
          otherColor: {
            type: 'string'
          },
          patterns: {
            type: 'Array<string>'
          },
          pieFeelerColor: {
            type: 'string'
          },
          pieInnerRadius: {
            type: 'number'
          },
          selectionEffect: {
            type: 'string',
            enumValues: ['explode', 'highlightAndExplode', 'highlight']
          },
          seriesEffect: {
            type: 'string',
            enumValues: ['color', 'pattern', 'gradient']
          },
          shapes: {
            type: 'Array<string>'
          },
          stackLabelStyle: {
            type: 'object'
          },
          stockFallingColor: {
            type: 'string'
          },
          stockRangeColor: {
            type: 'string'
          },
          stockRisingColor: {
            type: 'string'
          },
          stockVolumeColor: {
            type: 'string'
          },
          threeDEffect: {
            type: 'string',
            enumValues: ['on', 'off']
          },
          tooltipLabelStyle: {
            type: 'object'
          },
          tooltipValueStyle: {
            type: 'object'
          }
        }
      },
      timeAxisType: {
        type: 'string',
        enumValues: ['enabled', 'mixedFrequency', 'skipGaps', 'disabled', 'auto']
      },
      tooltip: {
        type: 'object',
        properties: {
          renderer: {}
        }
      },
      touchResponse: {
        type: 'string',
        enumValues: ['touchStart', 'auto']
      },
      translations: {
        type: 'Object',
        properties: {
          componentName: {
            type: 'string',
            value: 'Chart'
          },
          labelAndValue: {
            type: 'string',
            value: '{0}: {1}'
          },
          labelClearSelection: {
            type: 'string',
            value: 'Clear Selection'
          },
          labelClose: {
            type: 'string',
            value: 'Close'
          },
          labelCountWithTotal: {
            type: 'string',
            value: '{0} of {1}'
          },
          labelDataVisualization: {
            type: 'string',
            value: 'Data Visualization'
          },
          labelDate: {
            type: 'string',
            value: 'Value'
          },
          labelDefaultGroupName: {
            type: 'string',
            value: 'Group {0}'
          },
          labelGroup: {
            type: 'string',
            value: 'Group'
          },
          labelHigh: {
            type: 'string',
            value: 'High'
          },
          labelInvalidData: {
            type: 'string',
            value: 'Invalid data'
          },
          labelLow: {
            type: 'string',
            value: 'Low'
          },
          labelNoData: {
            type: 'string',
            value: 'No data to display'
          },
          labelOpen: {
            type: 'string',
            value: 'Open'
          },
          labelOther: {
            type: 'string',
            value: 'Other'
          },
          labelPercentage: {
            type: 'string',
            value: 'Percentage'
          },
          labelQ1: {
            type: 'string',
            value: 'Q1'
          },
          labelQ2: {
            type: 'string',
            value: 'Q2'
          },
          labelQ3: {
            type: 'string',
            value: 'Q3'
          },
          labelSeries: {
            type: 'string',
            value: 'Series'
          },
          labelTargetValue: {
            type: 'string',
            value: 'Target'
          },
          labelValue: {
            type: 'string',
            value: 'Value'
          },
          labelVolume: {
            type: 'string',
            value: 'Volume'
          },
          labelX: {
            type: 'string',
            value: 'X'
          },
          labelY: {
            type: 'string',
            value: 'Y'
          },
          labelZ: {
            type: 'string',
            value: 'Z'
          },
          stateCollapsed: {
            type: 'string',
            value: 'Collapsed'
          },
          stateDrillable: {
            type: 'string',
            value: 'Drillable'
          },
          stateExpanded: {
            type: 'string',
            value: 'Expanded'
          },
          stateHidden: {
            type: 'string',
            value: 'Hidden'
          },
          stateIsolated: {
            type: 'string',
            value: 'Isolated'
          },
          stateMaximized: {
            type: 'string',
            value: 'Maximized'
          },
          stateMinimized: {
            type: 'string',
            value: 'Minimized'
          },
          stateSelected: {
            type: 'string',
            value: 'Selected'
          },
          stateUnselected: {
            type: 'string',
            value: 'Unselected'
          },
          stateVisible: {
            type: 'string',
            value: 'Visible'
          },
          tooltipPan: {
            type: 'string',
            value: 'Pan'
          },
          tooltipSelect: {
            type: 'string',
            value: 'Marquee select'
          },
          tooltipZoom: {
            type: 'string',
            value: 'Marquee zoom'
          }
        }
      },
      type: {
        type: 'string',
        enumValues: ['line', 'area', 'lineWithArea', 'stock', 'boxPlot', 'combo', 'pie', 'scatter', 'bubble', 'funnel', 'pyramid', 'bar']
      },
      valueFormats: {
        type: 'object',
        properties: {
          series: {
            type: 'object',
            properties: {
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          group: {
            type: 'object',
            properties: {
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          x: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          y: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          y2: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          z: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          value: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          targetValue: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          low: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          high: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          open: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          close: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          volume: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          q1: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          q2: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          q3: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          },
          label: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              tooltipDisplay: {
                type: 'string',
                enumValues: ['auto', 'off']
              },
              tooltipLabel: {
                type: 'string'
              }
            }
          }
        }
      },
      xAxis: {
        type: 'object',
        properties: {
          axisLine: {
            type: 'object',
            properties: {
              lineColor: {
                type: 'string'
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['on', 'off']
              }
            }
          },
          baselineScaling: {
            type: 'string',
            enumValues: ['min', 'zero']
          },
          dataMax: {
            type: 'number'
          },
          dataMin: {
            type: 'number'
          },
          majorTick: {
            type: 'object',
            properties: {
              baselineColor: {
                type: 'string',
                enumValues: ['inherit', 'auto']
              },
              baselineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              baselineWidth: {
                type: 'number'
              },
              lineColor: {
                type: 'string'
              },
              lineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['on', 'off', 'auto']
              }
            }
          },
          max: {
            type: 'number|string'
          },
          maxSize: {
            type: 'string'
          },
          min: {
            type: 'number|string'
          },
          minorStep: {
            type: 'number'
          },
          minorTick: {
            type: 'object',
            properties: {
              lineColor: {
                type: 'string'
              },
              lineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['on', 'off', 'auto']
              }
            }
          },
          minStep: {
            type: 'number'
          },
          referenceObjects: {
            type: 'Array<object>'
          },
          rendered: {
            type: 'string',
            enumValues: ['off', 'on']
          },
          scale: {
            type: 'string',
            enumValues: ['log', 'linear']
          },
          size: {
            type: 'string'
          },
          step: {
            type: 'number'
          },
          tickLabel: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              rendered: {
                type: 'string',
                enumValues: ['off', 'on']
              },
              rotation: {
                type: 'string',
                enumValues: ['none', 'auto']
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              style: {
                type: 'object'
              }
            }
          },
          title: {
            type: 'string'
          },
          titleStyle: {
            type: 'object'
          },
          viewportEndGroup: {
            type: 'number|string'
          },
          viewportMax: {
            type: 'number|string'
          },
          viewportMin: {
            type: 'number|string'
          },
          viewportStartGroup: {
            type: 'number|string'
          }
        }
      },
      y2Axis: {
        type: 'object',
        properties: {
          alignTickMarks: {
            type: 'string',
            enumValues: ['off', 'on']
          },
          axisLine: {
            type: 'object',
            properties: {
              lineColor: {
                type: 'string'
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['on', 'off', 'auto']
              }
            }
          },
          baselineScaling: {
            type: 'string',
            enumValues: ['min', 'zero']
          },
          dataMax: {
            type: 'number'
          },
          dataMin: {
            type: 'number'
          },
          majorTick: {
            type: 'object',
            properties: {
              baselineColor: {
                type: 'string',
                enumValues: ['inherit', 'auto']
              },
              baselineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              baselineWidth: {
                type: 'number'
              },
              lineColor: {
                type: 'string'
              },
              lineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['off', 'on', 'auto']
              }
            }
          },
          max: {
            type: 'number'
          },
          maxSize: {
            type: 'string'
          },
          min: {
            type: 'number'
          },
          minorStep: {
            type: 'number'
          },
          minorTick: {
            type: 'object',
            properties: {
              lineColor: {
                type: 'string'
              },
              lineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['on', 'auto', 'off']
              }
            }
          },
          minStep: {
            type: 'number'
          },
          position: {
            type: 'string',
            enumValues: ['start', 'end', 'top', 'bottom', 'auto']
          },
          referenceObjects: {
            type: 'Array<object>'
          },
          rendered: {
            type: 'string',
            enumValues: ['off', 'on']
          },
          scale: {
            type: 'string',
            enumValues: ['log', 'linear']
          },
          size: {
            type: 'string'
          },
          step: {
            type: 'number'
          },
          tickLabel: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              position: {
                type: 'string',
                enumValues: ['inside', 'outside']
              },
              rendered: {
                type: 'string',
                enumValues: ['off', 'on']
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              style: {
                type: 'object'
              }
            }
          },
          title: {
            type: 'string'
          },
          titleStyle: {
            type: 'object'
          }
        }
      },
      yAxis: {
        type: 'object',
        properties: {
          axisLine: {
            type: 'object',
            properties: {
              lineColor: {
                type: 'string'
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['off', 'on', 'auto']
              }
            }
          },
          baselineScaling: {
            type: 'string',
            enumValues: ['min', 'zero']
          },
          dataMax: {
            type: 'number'
          },
          dataMin: {
            type: 'number'
          },
          majorTick: {
            type: 'object',
            properties: {
              baselineColor: {
                type: 'string',
                enumValues: ['inherit', 'auto']
              },
              baselineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              baselineWidth: {
                type: 'number'
              },
              lineColor: {
                type: 'string'
              },
              lineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['on', 'off', 'auto']
              }
            }
          },
          max: {
            type: 'number'
          },
          maxSize: {
            type: 'string'
          },
          min: {
            type: 'number'
          },
          minorStep: {
            type: 'number'
          },
          minorTick: {
            type: 'object',
            properties: {
              lineColor: {
                type: 'string'
              },
              lineStyle: {
                type: 'string',
                enumValues: ['dotted', 'dashed', 'solid']
              },
              lineWidth: {
                type: 'number'
              },
              rendered: {
                type: 'string',
                enumValues: ['on', 'off', 'auto']
              }
            }
          },
          minStep: {
            type: 'number'
          },
          position: {
            type: 'string',
            enumValues: ['start', 'end', 'top', 'bottom', 'auto']
          },
          referenceObjects: {
            type: 'Array<object>'
          },
          rendered: {
            type: 'string',
            enumValues: ['off', 'on']
          },
          scale: {
            type: 'string',
            enumValues: ['log', 'linear']
          },
          size: {
            type: 'string'
          },
          step: {
            type: 'number'
          },
          tickLabel: {
            type: 'object',
            properties: {
              converter: {
                type: 'object'
              },
              position: {
                type: 'string',
                enumValues: ['inside', 'outside']
              },
              rendered: {
                type: 'string',
                enumValues: ['off', 'on']
              },
              scaling: {
                type: 'string',
                enumValues: ['none', 'auto', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
              },
              style: {
                type: 'object'
              }
            }
          },
          title: {
            type: 'string'
          },
          titleStyle: {
            type: 'object'
          },
          viewportMax: {
            type: 'number'
          },
          viewportMin: {
            type: 'number'
          }
        }
      },
      zoomAndScroll: {
        type: 'string',
        enumValues: ['delayedScrollOnly', 'liveScrollOnly', 'delayed', 'live', 'off']
      },
      zoomDirection: {
        type: 'string',
        enumValues: ['x', 'y', 'auto']
      }
    },
    methods: {
      getContextByNode: {},
      getDataItem: {},
      getGroup: {},
      getGroupCount: {},
      getLegend: {},
      getPlotArea: {},
      getSeries: {},
      getSeriesCount: {},
      getValuesAt: {},
      getXAxis: {},
      getY2Axis: {},
      getYAxis: {}
    },
    events: {
      drill: {},
      viewportChange: {},
      selectInput: {},
      viewportChangeInput: {}
    },
    extension: {
      _WIDGET_NAME: 'ojChart'
    }
  };
  oj.CustomElementBridge.registerMetadata('oj-chart', 'dvtBaseComponent', ojChartMeta);
// Get the combined meta of superclass which contains a shape parse function generator
  var dvtMeta = oj.CustomElementBridge.getMetadata('oj-chart');
  var _CHART_SHAPE_ENUMS = {
    square: true,
    circle: true,
    diamond: true,
    plus: true,
    triangleDown: true,
    triangleUp: true,
    human: true,
    star: true,
    auto: true
  };
  var chartShapeParser = dvtMeta.extension._DVT_PARSE_FUNC({ 'style-defaults.marker-shape': true }, _CHART_SHAPE_ENUMS);
  var chartParseFunction = function (value, name, metadata, defaultParseFunction) {
    if (metadata.type === 'number|string') {
      return isNaN(value) ? value : Number(value);
    } else if (name === 'style-defaults.data-label-style') {
      return JSON.parse(value);
    }
    return chartShapeParser(value, name, metadata, defaultParseFunction);
  };
  oj.CustomElementBridge.register('oj-chart', {
    metadata: dvtMeta,
    parseFunction: chartParseFunction
  });
}());
 
(function () {
  var ojSparkChartMeta = {
    properties: {
      animationDuration: {
        type: 'number'
      },
      animationOnDataChange: {
        type: 'string',
        enumValues: ['auto', 'none']
      },
      animationOnDisplay: {
        type: 'string',
        enumValues: ['auto', 'none']
      },
      areaSvgClassName: {
        type: 'string'
      },
      areaColor: {
        type: 'string'
      },
      areaSvgStyle: {
        type: 'object'
      },
      barGapRatio: {
        type: 'number'
      },
      baselineScaling: {
        type: 'string',
        enumValues: ['zero', 'min']
      },
      svgClassName: {
        type: 'string'
      },
      color: {
        type: 'string'
      },
      firstColor: {
        type: 'string'
      },
      highColor: {
        type: 'string'
      },
      items: {
        type: 'Array<number>|Promise'
      },
      lastColor: {
        type: 'string'
      },
      lineStyle: {
        type: 'string',
        enumValues: ['dotted', 'dashed', 'solid']
      },
      lineType: {
        type: 'string',
        enumValues: ['curved', 'stepped', 'centeredStepped', 'segmented', 'centeredSegmented', 'none', 'straight']
      },
      lineWidth: {
        type: 'number'
      },
      lowColor: {
        type: 'string'
      },
      markerShape: {
        type: 'string'
      },
      markerSize: {
        type: 'number'
      },
      referenceObjects: {
        type: 'Array<object>'
      },
      svgStyle: {
        type: 'object'
      },
      tooltip: {
        type: 'object',
        properties: {
          renderer: {}
        }
      },
      translations: {
        type: 'Object',
        properties: {
          componentName: {
            type: 'string',
            value: 'Chart'
          },
          labelAndValue: {
            type: 'string',
            value: '{0}: {1}'
          },
          labelClearSelection: {
            type: 'string',
            value: 'Clear Selection'
          },
          labelCountWithTotal: {
            type: 'string',
            value: '{0} of {1}'
          },
          labelDataVisualization: {
            type: 'string',
            value: 'Data Visualization'
          },
          labelInvalidData: {
            type: 'string',
            value: 'Invalid data'
          },
          labelNoData: {
            type: 'string',
            value: 'No data to display'
          },
          stateCollapsed: {
            type: 'string',
            value: 'Collapsed'
          },
          stateDrillable: {
            type: 'string',
            value: 'Drillable'
          },
          stateExpanded: {
            type: 'string',
            value: 'Expanded'
          },
          stateHidden: {
            type: 'string',
            value: 'Hidden'
          },
          stateIsolated: {
            type: 'string',
            value: 'Isolated'
          },
          stateMaximized: {
            type: 'string',
            value: 'Maximized'
          },
          stateMinimized: {
            type: 'string',
            value: 'Minimized'
          },
          stateSelected: {
            type: 'string',
            value: 'Selected'
          },
          stateUnselected: {
            type: 'string',
            value: 'Unselected'
          },
          stateVisible: {
            type: 'string',
            value: 'Visible'
          }
        }
      },
      type: {
        type: 'string',
        enumValues: ['area', 'lineWithArea', 'bar', 'line']
      },
      visualEffects: {
        type: 'string',
        enumValues: ['none', 'auto']
      }
    },
    methods: {
      getDataItem: {}
    },
    extension: {
      _WIDGET_NAME: 'ojSparkChart'
    }
  };
  oj.CustomElementBridge.registerMetadata('oj-spark-chart', 'dvtBaseComponent', ojSparkChartMeta);
// Get the combined meta of superclass which contains a shape parse function generator
  var dvtMeta = oj.CustomElementBridge.getMetadata('oj-spark-chart');
  var _SPARK_SHAPE_ENUMS = {
    square: true,
    circle: true,
    diamond: true,
    plus: true,
    triangleDown: true,
    triangleUp: true,
    human: true,
    star: true,
    auto: true
  };
  oj.CustomElementBridge.register('oj-spark-chart', {
    metadata: dvtMeta,
    parseFunction: dvtMeta.extension._DVT_PARSE_FUNC({ 'marker-shape': true }, _SPARK_SHAPE_ENUMS)
  });
}());
 
(function () {
  var ojChartItemMeta = {
    properties: {
      borderColor: {
        type: 'string'
      },
      borderWidth: {
        type: 'number'
      },
      boxPlot: {
        type: 'object',
        properties: {
          medianSvgClassName: {
            type: 'string'
          },
          medianSvgStyle: {
            type: 'object'
          },
          q2Color: {
            type: 'string'
          },
          q2SvgClassName: {
            type: 'string'
          },
          q2SvgStyle: {
            type: 'object'
          },
          q3SvgClassName: {
            type: 'string'
          },
          q3SvgStyle: {
            type: 'object'
          },
          whiskerEndLength: {
            type: 'string'
          },
          whiskerEndSvgClassName: {
            type: 'string'
          },
          whiskerEndSvgStyle: {
            type: 'object'
          },
          whiskerSvgClassName: {
            type: 'string'
          },
          whiskerSvgStyle: {
            type: 'object'
          }
        }
      },
      categories: {
        type: 'Array<string>'
      },
      close: {
        type: 'number'
      },
      color: {
        type: 'string'
      },
      drilling: {
        type: 'string',
        enumValues: ['on', 'off', 'inherit']
      },
      groupId: {
        type: 'Array<string>'
      },
      high: {
        type: 'number'
      },
      items: {
        type: 'Array<object>|Array<number>'
      },
      label: {
        type: 'string|Array<string>'
      },
      labelPosition: {
        type: 'string|Array<string>',
        enumValues: ['center', 'outsideSlice', 'aboveMarker', 'belowMarker', 'beforeMarker',
              'afterMarker', 'insideBarEdge', 'outsideBarEdge', 'none', 'auto']
      },
      labelStyle: {
        type: 'object|Array<object>'
      },
      low: {
        type: 'number'
      },
      markerDisplayed: {
        type: 'string',
        enumValues: ['on', 'off', 'auto']
      },
      markerShape: {
        type: 'string'
      },
      markerSize: {
        type: 'number'
      },
      open: {
        type: 'number'
      },
      pattern: {
        type: 'string',
        enumValues: ['auto', 'largeChecker', 'largeCrosshatch', 'largeDiagonalLeft', 'largeDiagonalRight',
              'largeDiamond', 'largeTriangle', 'smallChecker', 'smallCrosshatch', 'smallDiagonalLeft', 'smallDiagonalRight', 'smallDiamond', 'smallTriangle']
      },
      q1: {
        type: 'number'
      },
      q2: {
        type: 'number'
      },
      q3: {
        type: 'number'
      },
      seriesId: {
        type: 'string'
      },
      shortDesc: {
        type: 'string'
      },
      source: {
        type: 'string'
      },
      sourceHover: {
        type: 'string'
      },
      sourceHoverSelected: {
        type: 'string'
      },
      sourceSelected: {
        type: 'string'
      },
      svgClassName: {
        type: 'string'
      },
      svgStyle: {
        type: 'object'
      },
      targetValue: {
        type: 'number'
      },
      value: {
        type: 'number'
      },
      volume: {
        type: 'number'
      },
      x: {
        type: 'number|string'
      },
      y: {
        type: 'number'
      },
      z: {
        type: 'number'
      }
    },
    extension: {
      _CONSTRUCTOR: function () {}
    }
  };
  oj.CustomElementBridge.registerMetadata('oj-chart-item', null, ojChartItemMeta);
  var _CHART_ITEM_SHAPE_ENUMS = {
    square: true,
    circle: true,
    diamond: true,
    plus: true,
    triangleDown: true,
    triangleUp: true,
    human: true,
    star: true,
    auto: true
  };
 
  var dvtBaseMetadata = oj.CustomElementBridge.getMetadata("dvtBaseComponent");
  oj.CustomElementBridge.register('oj-chart-item', {
    metadata: oj.CustomElementBridge.getMetadata('oj-chart-item'),
    parseFunction: dvtBaseMetadata.extension._DVT_PARSE_FUNC({ 'marker-shape': true }, _CHART_ITEM_SHAPE_ENUMS)
  });
}());
 
(function () {
  var ojChartSeriesMeta = {
    properties: {
      areaColor: {
        type: 'string'
      },
      areaSvgClassName: {
        type: 'string'
      },
      areaSvgStyle: {
        type: 'object'
      },
      assignedToY2: {
        type: 'string',
        enumValues: ['on', 'off']
      },
      borderColor: {
        type: 'string'
      },
      borderWidth: {
        type: 'number'
      },
      boxPlot: {
        type: 'object',
        properties: {
          medianSvgClassName: {
            type: 'string'
          },
          medianSvgStyle: {
            type: 'object'
          },
          q2Color: {
            type: 'string'
          },
          q2SvgClassName: {
            type: 'string'
          },
          q2SvgStyle: {
            type: 'object'
          },
          q3Color: {
            type: 'string'
          },
          q3SvgClassName: {
            type: 'string'
          },
          q3SvgStyle: {
            type: 'object'
          },
          whiskerEndLength: {
            type: 'string'
          },
          whiskerEndSvgClassName: {
            type: 'string'
          },
          whiskerEndSvgStyle: {
            type: 'object'
          },
          whiskerSvgClassName: {
            type: 'string'
          },
          whiskerSvgStyle: {
            type: 'object'
          }
        }
      },
      categories: {
        type: 'Array<string>'
      },
      color: {
        type: 'string'
      },
      displayInLegend: {
        type: 'string',
        enumValues: ['auto', 'off', 'on']
      },
      drilling: {
        type: 'string',
        enumValues: ['on', 'off', 'inherit']
      },
      lineStyle: {
        type: 'string',
        enumValues: ['dashed','dotted','solid'  ]
      },
      lineType: {
        type: 'string',
        enumValues: ['auto', 'centeredSegmented', 'centeredStepped','curved', 'none', 'segmented', 'stepped', 'straight']
      },
      lineWidth: {
        type: 'number'
      },
      markerColor: {
        type: 'string'
      },
      markerDisplayed: {
        type: 'string',
        enumValues: ['on', 'off', 'auto']
      },
      markerShape: {
        type: 'string'
      },
      markerSize: {
        type: 'number'
      },
      markerSvgClassName: {
        type: 'string'
      },
      markerSvgStyle: {
        type: 'object'
      },
      name: {
        type: 'string'
      },
      pattern: {
        type: 'string',
        enumValues: ['auto', 'largeChecker', 'largeCrosshatch', 'largeDiagonalLeft', 'largeDiagonalRight',
              'largeDiamond', 'largeTriangle', 'smallChecker', 'smallCrosshatch', 'smallDiagonalLeft', 'smallDiagonalRight', 'smallDiamond', 'smallTriangle']
      },
      pieSliceExplode: {
        type: 'number'
      },
      shortDesc: {
        type: 'string'
      },
      source: {
        type: 'string'
      },
      sourceHover: {
        type: 'string'
      },
      sourceHoverSelected: {
        type: 'string'
      },
      sourceSelected: {
        type: 'string'
      },
      stackCategory: {
        type: 'string'
      },
      svgClassName: {
        type: 'string'
      },
      svgStyle: {
        type: 'object'
      },
      type: {
        type: 'string',
        enumValues: ['area','auto','bar','boxPlot','candlestick','line','lineWithArea']
      }
    },
    extension: {
      _CONSTRUCTOR: function () {}
    }
  };
  oj.CustomElementBridge.registerMetadata('oj-chart-series', null, ojChartSeriesMeta);
  var _CHART_SERIES_SHAPE_ENUMS = {
    square: true,
    circle: true,
    diamond: true,
    plus: true,
    triangleDown: true,
    triangleUp: true,
    human: true,
    star: true,
    auto: true
  };
  var dvtBaseMetadata = oj.CustomElementBridge.getMetadata("dvtBaseComponent");
  oj.CustomElementBridge.register('oj-chart-series', {
    metadata: oj.CustomElementBridge.getMetadata('oj-chart-series'),
    parseFunction: dvtBaseMetadata.extension._DVT_PARSE_FUNC({ 'marker-shape': true }, _CHART_SERIES_SHAPE_ENUMS)
  });
}());
 
(function () {
  var ojChartGroupMeta = {
    properties: {
      drilling: {
        type: 'string',
        enumValues: ['on', 'inherit', 'off']
      },
      labelStyle: {
        type: 'object'
      },
      name: {
        type: 'string'
      },
      shortDesc: {
        type: 'string'
      }
    },
    extension: {
      _CONSTRUCTOR: function () {}
    }
  };
  oj.CustomElementBridge.registerMetadata('oj-chart-group', null, ojChartGroupMeta);
  oj.CustomElementBridge.register('oj-chart-group', {
    metadata: oj.CustomElementBridge.getMetadata('oj-chart-group')
  });
}());
});