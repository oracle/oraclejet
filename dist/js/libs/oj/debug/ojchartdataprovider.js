/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'promise', 'ojs/ojdeferreddataprovider', 'ojs/ojarraydataprovider'], function(oj)
{
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @class ChartDataProviderUtils
 * @ojstatus preview
 * @classdesc 
 * <h3>Chart DataProvider Utilities</h3>
 *
 * <p> Utility for generating the <a href="../jsdocs/oj.ojChart.html#data">data</a> attribute for an <a href="../jsdocs/oj.ojChart.html">oj-chart</a> element. 
 * Given a data provider that implements {@link oj.DataProvider}  
 * with row data that corresponds to chart data items, as well as an options object containing mapping and sorting functions,
 * this utility will generate an object with a series array and a groups data provider that can be passed directly to the chart
 * data attribute. The series array will contain either strings or objects of the <a href="../jsdocs/oj.ojChart.html#ChartSeries">ChartSeries</a> type,
 * and the groups data provider will be a DataProvider that provides an array of objects of the <a href="../jsdocs/oj.ojChart.html#ChartGroup">ChartGroup</a> type.
 *
 * <h3> Usage : </h3>
 * <pre class="prettyprint"><code>
 * // an array of row data for each chart data item
 * var itemData = [
 *  {'id': 'iPad15', 'product': 'iPad', 'year': '2015', 'sold': '113000'},
 *  {'id': 'iPad16', 'product': 'iPad', 'year': '2016', 'sold': '110000'},
 *  {'id': 'Mac15', 'product': 'MacBook', 'year': '2015', 'sold': '150000'},
 *  {'id': 'Mac16', 'product': 'MacBook', 'year': '2016', 'sold': '157000'},
 *  {'id': 'iPhone15', 'product': 'iPhone', 'year': '2015', 'sold': '182000'},
 *  {'id': 'iPhone16', 'product': 'iPhone', 'year': '2016', 'sold': '197000'},
 * ];
 * // create a data provider with the row data
 * var itemDataProvider = new oj.ArrayDataProvider(itemData);
 *
 * // required: create an itemProperties callback that will map chart data item properties
 * // for each row, as well as set a required seriesId string and groupId array.
 * var itemPropertiesFunc = function(itemContext) {
 *  var data = itemContext.data;
 *  return {
 *    value: data['sold'],
 *    seriesId: data['product'],
 *    groupId: [data['year']]
 *  };
 * }
 * 
 * // Pass the data provider for the item rows and the object with mapping callbaks to createChartData(),
 * // and generate an object that can be used to set the chart data attrbute.
 * var data = oj.ChartDataProviderUtils.createChartData(itemDataProvider, {'itemProperties': itemPropertiesFunc});
 * </code></pre>
 * @hideconstructor
 * @since 4.2.0
 */
var ChartDataProviderUtils = {};

// Subclass from oj.Object 
oj.Object.createSubclass(ChartDataProviderUtils, oj.Object, "ChartDataProviderUtils");

// make it available internally
oj.ChartDataProviderUtils = ChartDataProviderUtils;

/**
 * 
 * Generates a chart data object from a data provider, where each row represents one chart data item.
 * @param {oj.DataProvider} dataProvider A data provider that implements {@link oj.DataProvider}, and provides data rows where each row will map data for a single chart data item.
 * @param {Object} options A set of options thats contains functions responsible for mapping values from the DataProvider rows to chart data items, chart series objects,
 *                         and chart group objects. Also contains functions responsible for determining the order of the series and group objects.
 * @param {Function} options.itemProperties A function that takes an itemContext object, provided by the utility, and returns an object for each data item that contains
 *                                          value and style property mappings, as well the seriesId and groupId for the data item. The seriesId is of type string, and the
 *                                          groupId is an array of strings. To establish hierarchical groups, the groupId array will contain more than one id, ordered from the
 *                                          outermost group to the innermost group.
 *                                          The itemContext object has the following properties:
 *                                          <ul>
 *                                            <li>data: The data row for the item</li> 
 *                                            <li>key: The data row key for the item</li>
 *                                            <li>datasource: A reference to the data provider object passed into createChartData().</li>
 *                                          </ul>
 *                                          The returned properties object can contain any of the properties defined on the <a href="../jsdocs/oj.ojChart.html#ChartDataItem">ChartDataItem</a> type, 
 *                                          and must also contain the following properties:
 *                                          <ul>
 *                                            <li>seriesId: The id for this data item's series.</li> 
 *                                            <li>groupId: An array of group ids for this data item's group, from the outermost group to the innermost group.</li>
 *                                          </ul>
 * @param {Function=} options.seriesProperties A function that takes a seriesContext object, provided by the utility, and returns the properties object for a particular series.
 *                                          The seriesContext object has the following properties:
 *                                          <ul>
 *                                            <li>id: The series id.</li> 
 *                                            <li>data: An array of data rows that have been mapped to this series.
 *                                            <li>keys: An array of keys for all the data rows that have been mapped to this series.</li>
 *                                            <li>datasource: A reference to the data provider object passed into createChartData().</li>
 *                                            <li>index: The position of this series within the current series order.</li>
 *                                          </ul>
 *                                          The returned properties object can contain any of the properties defined on the <a href="../jsdocs/oj.ojChart.html#ChartSeries">ChartSeries</a> type.
 * @param {Function=} options.groupProperties A function that takes a groupContext object, provided by the utility, and returns the properties object for a particular group.
 *                                          The groupContext object has the following properties:
 *                                          <ul>
 *                                            <li>id: An array of group ids, from the outermost group to the current group.</li> 
 *                                            <li>data: An array of data rows that have been mapped to this group.
 *                                            <li>keys: An array of keys for all the data rows that have been mapped to this group.</li>
 *                                            <li>datasource: A reference to the data provider object passed into createChartData().</li>
 *                                            <li>index: The position of this group relative to its parent.</li>
 *                                            <li>depth: The depth of this group. The depth of the outermost group under the invisible root is 1.</li>
 *                                            <li>leaf: A boolean value that expresses whether or not this group is a leaf.</li>
 *                                          </ul>
 *                                          The returned properties object can contain any of the properties defined on the <a href="../jsdocs/oj.ojChart.html#ChartGroup">ChartGroup</a> type.
 * @param {Function=} options.seriesComparator A comparator function that determines the ordering of the series. If undefined, the series will follow the order in which they are found in the data.
 *                                          <p>This function takes two seriesContext objects, seriesContext1 and seriesContext2, provided by the utility. A seriesContext object has the following properties:</p>
 *                                          <ul>
 *                                            <li>id: The series id.</li> 
 *                                            <li>data: An array of data rows that have been mapped to this series.
 *                                            <li>keys: An array of keys for all the data rows that have been mapped to this series.</li>
 *                                            <li>datasource: A reference to the data provider object passed into createChartData().</li>
 *                                            <li>index: The position of this series within the current series order.</li>
 *                                          </ul>
 *                                          <p>This function should use information to compare the two seriesContext objects with any desired metrics, and return a numerical value.</p>
 *                                          <ul>
 *                                            <li>If the returned value is less than 0, the series belonging to seriesContext1 will precede the series belonging to seriesContext2.</li> 
 *                                            <li>If the returned value is equal to 0, the order of the series for either seriesContext in respect to each other will not change.</li>
 *                                            <li>If the returned value is greater than 0, the series belonging to seriesContext2 will precede the series belonging to seriesContext1.</li>
 *                                          </ul>
 * @param {Function=} options.groupComparator A comparator function that determines the ordering of the groups. If undefined, the groups will follow the order in which they are found in the data.
 *                                            The function takes two groupContext objects, groupContext1 and groupContext2, provided by the utility. A groupContext object has the following properties:
 *                                          <ul>
 *                                            <li>id: An array of group ids, from the outermost group to the current group.</li> 
 *                                            <li>data: An array of data rows that have been mapped to this group.
 *                                            <li>keys: An array of keys for all the data rows that have been mapped to this group.</li>
 *                                            <li>datasource: A reference to the data provider object passed into createChartData().</li>
 *                                            <li>index: The position of this group relative to its parent.</li>
 *                                            <li>depth: The depth of this group. The depth of the outermost group under the invisible root is 1.</li>
 *                                            <li>leaf: A boolean value that expresses whether or not this group is a leaf.</li>
 *                                          </ul>
 *                                          <p>This function should use information to compare the two groupContext objects with any desired metrics, and return a numerical value.</p>
 *                                          <ul>
 *                                            <li>If the returned value is less than 0, the group belonging to groupContext1 will precede the group belonging to groupContext2.</li> 
 *                                            <li>If the returned value is equal to 0, the order of the group for either groupContext in respect to each other will not change.</li>
 *                                            <li>If the returned value is greater than 0, the group belonging to groupContext2 will precede the group belonging to groupContext1.</li>
 *                                          </ul>
 * @return {Object} An object that contains the series Promise<Array<oj.ojChart.ChartSeries>> and the groups DataProvider<String, oj.ojChart.ChartGroup>.
 * @static
 */
ChartDataProviderUtils.createChartData = function(dataProvider, options) {
  // seriesContexts: object where items are the series context for each series
  var seriesContexts = {}; 
  
  // groupContexts: flat object where items are the group context for a each level of each group
  var groupContexts = {};
  
  var itemProperties = options['itemProperties'];
  var seriesProperties = options['seriesProperties'];
  var seriesComparator= options['seriesComparator'];
  var groupProperties = options['groupProperties'];
  var groupComparator = options['groupComparator'];
  
  // Fetch all data and process result
  var fetchedData = dataProvider['fetchFirst']({size: -1})[Symbol.asyncIterator]()['next']()
  .then(function(result) {
    return new Promise(function(resolve, reject) 
    {
      var value = result['value'];
      var rowData = value['data'];
      var rowKeys = value.metadata.map(function(value) {
        return value['key'];
      });
      resolve({'data': rowData, 'keys': rowKeys})
    });    
  });
   
  // Generate chart data
  var chartData = fetchedData.then(function(result) {
      var rowData = result['data'];
      var rowKeys = result['keys'];
        
      var numSeries = 0;
      var numOuterGroups = 0;
        
      // Iterate through fetched data, get each item and pass to itemProperties() to get actual chart data items
      var chartDataItems = [];
      for (var i = 0; i < rowData.length; i++) {  
        var rowItem = rowData[i];
        var rowKey = rowKeys[i];
        var itemContext = {'data': rowItem, 'key': rowKey, 'datasource' : dataProvider};
        var chartDataItem = itemProperties(itemContext);
        chartDataItems.push(chartDataItem);
        
        // While processing each data row, pull out each seriesId and generate/update seriesContext for that series
        var seriesId = chartDataItem['seriesId'];
        if (!seriesContexts[seriesId]) {
          seriesContexts[seriesId] = {'id': seriesId, 'datasource': dataProvider, 'data': [rowItem], 'keys': [rowKey], 'index': numSeries};
          numSeries++;
        }
        else {
          seriesContexts[seriesId]['data'].push(rowItem);
          seriesContexts[seriesId]['keys'].push(rowKey);
        }        
        // While processing each data row, pull out each groupId and generate/update groupContext for each group/nested group
        var groupId = chartDataItem['groupId'];
        var count = numOuterGroups;
        if (!groupContexts[groupId.slice(0, groupId.length - 1)])
          numOuterGroups++;
        groupContexts = ChartDataProviderUtils._addToGroupContexts(groupContexts, rowItem, rowKey, groupId, dataProvider, 0, count);
      }
      
      return chartDataItems;
    });
        
    // Create a Promise that resolves to the chart series
    var chartSeriesData = chartData.then(function(result) {
      return new Promise(function(resolve, reject) { 
        var chartSeries = [];
        // Create series items with just id and name
        Object.keys(seriesContexts).forEach(function(seriesId) {
          chartSeries.push({'id': seriesId, 'name': seriesId});
        });  
        // Sort
        if (seriesComparator) { 
          // Performance: worth profiling native js sort
          var sortFunction = function(seriesContexts, seriesComparator) {
            return function(a, b) {
              return seriesComparator(seriesContexts[a['id']], seriesContexts[b['id']]);
            }
          };        
          chartSeries.sort(sortFunction(seriesContexts, seriesComparator));
        }  
        // Update seriesContext indices after sort, and pass through series properties to get our full series items
        if (seriesComparator || seriesProperties) {
          for (var i = 0; i < chartSeries.length; i++) {
            var seriesId = chartSeries[i]['id'];
            
            if (seriesComparator)
              seriesContexts[seriesId]['index'] = i;
            
            if (seriesProperties) {
              var seriesObject = seriesProperties(seriesContexts[seriesId]);
              // Make sure id and name are defined if seriesProperties() didn't set them
              if (!seriesObject['id'])
                seriesObject['id'] = seriesId;
              if (!seriesObject['name'])
                seriesObject['name'] = seriesId;
            
              chartSeries[i]  = seriesObject;
            }
          }    
        }
        resolve(chartSeries);
      });
    });
    
    var chartGroupsData = chartData.then(function(result) {
      // Create chart groups while adding items to leaf groups
      var chartGroups = ChartDataProviderUtils._createGroups(result, seriesContexts); 
      // Sort groups 
      if (groupComparator)
        chartGroups = ChartDataProviderUtils._sortGroups(chartGroups, groupContexts, groupComparator, []);
      // Add group properties
      if (groupProperties)
        chartGroups = ChartDataProviderUtils._setGroupProperties(chartGroups, groupContexts, groupProperties, []);
      
      return chartGroups;
    });
      
    var groupsDataProvider = chartGroupsData.then(function(groupData){
      return new oj['ArrayDataProvider'](groupData);
    });
    
    var deferredDataProvider = new oj['DeferredDataProvider'](groupsDataProvider, oj['ArrayDataProvider'].getCapability);
  
    return { 'series': chartSeriesData, 'groups': deferredDataProvider};
};

/* GROUPS HELPERS */
/**
 * Update the groupContext of all groups at each depth in the groupId path, creating new groupContext if we have a new group
 * @param {Object} groupContexts The current groupContexts object
 * @param {Object} rowItem The info for the data item, obtained from the dataProvider
 * @param {Object} rowKey The key for the data item, obtained from the dataProvider
 * @param {Array} groupId The array of groupIds that correspond to current group/nested group we are updating the context for
 * @param {Object} dataProvider The reference to the dataProvider
 * @param {number} depth The depth of the current group/nested group we are updating the context for
 * @param {number} count The index of the current group/nested group we are updating the context for, in relation to that group's parent
 * @return {Object} The update groupContexts object
 * @private
 */
ChartDataProviderUtils._addToGroupContexts = function(groupContexts, rowItem, rowKey, groupId, dataProvider, depth, count) {
  if (depth < groupId.length) {
    var currentId = groupId.slice(0, depth + 1); // id for the group a the current depth
    var currentContext = groupContexts[currentId]
    if (!currentContext) {
      groupContexts[currentId] = {'ids': currentId, 'datasource': dataProvider, 
                                'data': [rowItem], 'keys': [rowKey], 
                                'depth': depth, 'leaf': depth == groupId.length - 1,
                                'index': count };
    }
    else {
      // a groupContext will have the data rows and keys for all of its descdendants 
      currentContext['data'].push(rowItem);
      currentContext['keys'].push(rowKey);    
    }
    count = currentContext ? currentContext['data'].length - 1 : 0;
    groupContexts = ChartDataProviderUtils._addToGroupContexts(groupContexts, rowItem, rowKey, groupId, dataProvider, depth + 1, count);
  }
  
  return groupContexts;
};

/**
 * Iterate through the previously created chart data items, and create the groups array
 * @param {Array} chartDataItems The array of all the data items
 * @param {Object} seriesContexts The seriesContext objects. The index on the seriesContext objects will
                                  be used to push the data items to group.items in the correct positions.
 * @return {Array} The groups array
 * @private
 */
ChartDataProviderUtils._createGroups = function(chartDataItems, seriesContexts) {
  var groupsArray = [];
  
  for (var i = 0; i < chartDataItems.length; i++) {
    var item = chartDataItems[i];
    groupsArray = ChartDataProviderUtils._addGroupItem(item, item['groupId'], groupsArray, seriesContexts);
  }
  
  return groupsArray;
};

/**
 * Given a data item and its groupId array, we build the nested groups if needed, and add the item
 * to its leaf group
 * @param {Object} item The chart dataitem to add
 * @param {Array} groupId The array of groupIds for the leaf we will add the item to
 * @param {Array} groupsArray The current groups array object
 * @param {Object} seriesContexts The seriesContext objects. The index on the seriesContext objects will
                                  be used to push the data items to group.items in the correct positions.
 * @return {Array} The groups array, with the given item added to the proper group leaf
 * @private
 */
ChartDataProviderUtils._addGroupItem = function(item, groupId, groupsArray, seriesContexts) {  
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
  else { // create new group to add to
    groupItem = {'id' : currentGroupId, 'name' : currentGroupId};
    groupsArray.push(groupItem);
  }
  
  if(groupId.length > 1) // not a leaf, add the next level of groups
    groupItem['groups'] = ChartDataProviderUtils._addGroupItem(item, groupId.slice(1), groupItem['groups'], seriesContexts);
  else { // add the item to the items array of the leaf group we have found
    if (!groupItem['items']) {
      groupItem['items'] = [];
      var size = Object.keys(seriesContexts || {}).length; //"|| {}" fixes closure compiler warning
      for (var i = 0; i < size; i++) 
        groupItem['items'].push(null); // if there is no item for a specific series we will expect "null"
    }
      
    var itemIndex = seriesContexts[item['seriesId']]['index']; // data items are expected to be in the order of the series
    groupItem['items'][itemIndex] = item;
    
    // We no longer need these values set from itemProperties(), and don't need them passed to the toolkit layer
    delete item['seriesId'];
    delete item['groupId'];
  }

  return groupsArray;
};

/**
 * Sort the groups
 * @param {Array} groupsArray The current groups array
 * @param {Object} groupContexts The groupContext objects
 * @param {Function} groupComparator The group comparator function
 * @param {Array} id The array of groupIds for the current group/nested group that we are sorting
 * @return {Array} The sorted groups array
 * @private
 */
ChartDataProviderUtils._sortGroups = function(groupsArray, groupContexts, groupComparator, id) {
  if (!id)
    id = [];
    
  var sortFunction = function(groupContexts, groupComparator, id) {    
    return function(a, b) {
      var id1 = id.concat(a['id']);
      var id2 = id.concat(b['id']);
      var context1 = groupContexts[id1];
      var context2 = groupContexts[id2];
      return groupComparator(context1, context2);
    }
  };

  groupsArray.sort(sortFunction(groupContexts, groupComparator, id));
  for (var i = 0; i < groupsArray.length; i++) {
    var groupId = id.concat(groupsArray[i]['id']);
    
    // Update group context indices after sorting
    groupContexts[groupId]['index'] = i;
    
    // Sort nested groups if they exist
    if(groupsArray[i]['groups'])
      groupsArray[i]['groups'] = ChartDataProviderUtils._sortGroups(groupsArray[i]['groups'], groupContexts, groupComparator, groupId)
  }
  
  return groupsArray;
};

/**
 * Get the properties for each group, and add properties to the existing group items
 * @param {Array} groupsArray The current groups array
 * @param {Object} groupContexts The groupContext objects
 * @param {Function} groupsProperties The group properties function
 * @param {Array} parentId The array of groupIds for the parent of the current group/nested group that we are evaluating
 * @return {Array} The groups array with properties added to the group items
 * @private
 */
ChartDataProviderUtils._setGroupProperties = function(groupsArray, groupContexts, groupsProperties, parentId) {
  for (var i = 0; i < groupsArray.length; i++) {
    var groupItem = groupsArray[i];
    var groupId = parentId.concat(groupItem['id']);
    var properties = groupsProperties(groupContexts[groupId]);
    Object.keys(properties).forEach(function(key) {
      groupItem[key] = properties[key];
    });

    if (groupItem['groups'])
      groupItem['groups'] = ChartDataProviderUtils._setGroupProperties(groupItem['groups'], groupContexts, groupsProperties, groupId);
  }
  
  return groupsArray;
};
;return {
  'createChartData': ChartDataProviderUtils.createChartData,
}

});
