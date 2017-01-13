/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtNBox'], function(oj, $, comp, base, dvt)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojNBox
 * @augments oj.dvtBaseComponent
 * @since 1.1.0
 *
 * @classdesc
 * <h3 id="nBoxOverview-section">
 *   JET NBox Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#nBoxOverview-section"></a>
 * </h3>
 *
 * <p>NBox components are used in HCM (Human Capital Management) applications
 * to measure employees across two dimensions (e.g. potential and performance). Each dimension
 * can be split into multiple ranges, whose intersections result in distinct cells which
 * employees can be placed into.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojNBox',
 *   columns: [{id:'low'}{id:'high'}],
 *   rows: [{id:'low'},{id:'high'}],
 *   nodes: [{column:'low', row:'high', label:'Employee 1'},
 *           {column:'low', row:'low', label:'Employee 2'},
 *           {column:'high', row:'high', label:'Employee 3'},
 *           {column:'low', row:'high', label:'Employee 4'}]
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
 * <h4>Animation</h4>
 * <p>Animation should only be enabled for visualizations of small to medium data sets. Alternate visualizations should
 *    be considered if identifying data changes is important, since all nodes will generally move and resize on any data
 *    change.
 * </p>
 *
 * <h4>Data Set Size</h4>
 * <p>Applications should avoid setting very large data densities on this component.
 *    Applications can enable progressive reveal of data through drilling or aggregate small nodes to reduce the
 *    displayed data set size.
 * </p>
 *
 * <h4>Style Attributes</h4>
 * <p>Use the highest level options property available. For example, consider using  attributes on
 *    <code class="prettyprint">styleDefaults.nodeDefaults</code>, instead of attributes on the individual nodes. The component can
 *    take advantage of these higher level attributes to apply the style properties on containers, saving expensive DOM
 *    calls.
 * </p>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 *
 * @desc Creates a JET NBox.
 *
 * @example <caption>Initialize the NBox:</caption>
 * $(".selector").ojNBox({columns: [{id:'low'}, {id:'high'}],
 *                        rows: [{id:'low'}, {id:'high'}],
 *                        maximizedColumn: 'high',
 *                        maximizedRow: 'low',
 *                        nodes: [{column:'low', row:'high', label:'Employee 1'},
 *                                {column:'low', row:'low', label:'Employee 2'},
 *                                {column:'high', row:'high', label:'Employee 3'},
 *                                {column:'low', row:'high', label:'Employee 4'}]});
 */
oj.__registerWidget('oj.ojNBox', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * Fired whenever a supported component option changes, whether due to user interaction or programmatic
     * intervention. If the new value is the same as the previous value, no event will be fired.
     *
     * @property {Object} data event payload
     * @property {string} data.option the name of the option that changed, i.e. "value"
     * @property {Object} data.previousValue an Object holding the previous value of the option
     * @property {Object} data.value an Object holding the current value of the option
     * @property {Object} ui.optionMetadata information about the option that is changing
     * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
     *                    <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">optionChange</code> callback:</caption>
     * $(".selector").ojNBox({
     *   'optionChange': function (event, data) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojoptionchange</code> event:</caption>
     * $(".selector").on({
     *   'ojoptionchange': function (event, data) {
     *       window.console.log("option changing is: " + data['option']);
     *   };
     * });
     *
     * @expose
     * @event
     * @memberof oj.ojNBox
     * @instance
     */
    optionChange: null
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    return dvt.NBox.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-nbox-cell') {
      // cell[row,column]
      subId = 'cell[' + locator['row'] + ',' + locator['column'] + ']';
    }
    else if(subId == 'oj-nbox-dialog') {
      subId = 'dialog';
    }
    else if(subId == 'oj-nbox-dialog-close-button') {
      subId = 'dialog#closeButton';
    }
    else if(subId == 'oj-nbox-dialog-node') {
      // dialog#node[index]
      subId = 'dialog#node[' + locator['index'] +']';
    }
    else if(subId == 'oj-nbox-group-node') {
      // groupNode[groupCategory] or cell[row,column]#groupNode[groupCategory]
      if(locator['row'] && locator['column'])
        subId = 'cell[' + locator['row'] + ',' + locator['column'] + ']#groupNode[';
      else
        subId = 'groupNode[';

      subId += locator['groupCategory'] +']';
    }
    else if(subId == 'oj-nbox-node') {
      var index;
      subId = '';

      var id = locator['id'];
      var auto = this._component.getAutomation();
      if(id && auto)
        index = auto.getNodeIndexFromId(id);
      else {
        index = locator['index'];
        if(locator['row'] && locator['column']) {
          // cell[row,column]#node[index]
          subId = 'cell[' + locator['row'] + ',' + locator['column'] + ']#';
        }
      }
      subId += 'node[' + index + ']';
    }
    else if(subId == 'oj-nbox-overflow') {
      // cell[row,col]#overflow
      subId = 'cell[' + locator['row'] + ',' + locator['column'] + ']#overflow';
    }
    else if(subId == 'oj-nbox-tooltip') {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  //** @inheritdoc */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if (subId.indexOf('node') == 0) {
      locator['subId'] = 'oj-nbox-node';

      var index = this._GetFirstIndex(subId);
      var auto = this._component.getAutomation();
      if (auto)
        locator['id'] = auto.getNodeIdFromIndex(index);
    }
    else if(subId.indexOf('cell') == 0) {
      // cell[row,column] or cell[row,column]#groupNode[groupCategory] or cell[row,column]#node[index]
      var cellIds = this._GetFirstBracketedString(subId);
      var commaIndex = cellIds.indexOf(',');
      locator['row'] = cellIds.substring(0, commaIndex);
      locator['column'] = cellIds.substring(commaIndex + 1);

      var poundIndex = subId.indexOf('#');
      if(subId.indexOf('#groupNode') > 0) {
        locator['subId'] = 'oj-nbox-group-node';
        locator['groupCategory'] = this._GetFirstBracketedString(subId.substring(poundIndex));
      }
      else if(subId.indexOf('#overflow') > 0) {
        locator['subId'] = 'oj-nbox-overflow';
      }
      else
        locator['subId'] = 'oj-nbox-cell';
    }
    else if(subId.indexOf('dialog') == 0) {
      if(subId.indexOf('#closeButton') > 0) {
        // dialog#closeButton
        locator['subId'] = 'oj-nbox-dialog-close-button';
      }
      else
        locator['subId'] = 'oj-nbox-dialog';
    }
    else if(subId.indexOf('groupNode') == 0) {
      // groupNode[groupCategory] or cell[row,column]#groupNode[groupCategory]
      locator['subId'] = 'oj-nbox-group-node';
      locator['groupCategory'] = this._GetFirstBracketedString(subId);
    }
    else if(subId == 'tooltip') {
      locator['subId'] = 'oj-nbox-tooltip';
    }

    return locator;
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-nbox');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetChildStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses['oj-nbox-columns-title'] = {'path': 'styleDefaults/columnsTitleStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-nbox-rows-title'] = {'path': 'styleDefaults/rowsTitleStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-nbox-column-label'] = {'path': 'styleDefaults/columnLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-nbox-row-label'] = {'path': 'styleDefaults/rowLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};

    styleClasses['oj-nbox-cell'] = {'path': 'styleDefaults/cellDefaults/style', 'property': 'CSS_BACKGROUND_PROPERTIES'};
    styleClasses['oj-nbox-cell oj-minimized'] = {'path': 'styleDefaults/cellDefaults/minimizedStyle', 'property': 'CSS_BACKGROUND_PROPERTIES'};
    styleClasses['oj-nbox-cell oj-maximized'] = {'path': 'styleDefaults/cellDefaults/maximizedStyle', 'property': 'CSS_BACKGROUND_PROPERTIES'};

    styleClasses['oj-nbox-cell-label'] = {'path': 'styleDefaults/cellDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-nbox-cell-countlabel'] = {'path': 'styleDefaults/cellDefaults/bodyCountLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-nbox-cell-countlabel oj-nbox-cell-header'] = {'path': 'styleDefaults/cellDefaults/countLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};

    styleClasses['oj-nbox-node'] = {'path': 'styleDefaults/nodeDefaults/color', 'property': 'background-color'};
    styleClasses['oj-nbox-node oj-hover'] = {'path': 'styleDefaults/nodeDefaults/hoverColor', 'property': 'border-color'};
    styleClasses['oj-nbox-node oj-selected'] = {'path': 'styleDefaults/nodeDefaults/selectionColor', 'property': 'border-color'};

    styleClasses['oj-nbox-node-label'] = {'path': 'styleDefaults/nodeDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-nbox-node-secondarylabel'] = {'path': 'styleDefaults/nodeDefaults/secondaryLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-nbox-node-categorylabel'] = {'path': 'styleDefaults/__categoryNodeDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};

    styleClasses['oj-nbox-dialog'] = [{'path': 'styleDefaults/__drawerDefaults/background', 'property': 'background-color'},
                                      {'path': 'styleDefaults/__drawerDefaults/borderColor', 'property': 'border-color'}];
    styleClasses['oj-nbox-dialog-label'] = {'path': 'styleDefaults/__drawerDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-nbox-dialog-countlabel'] = {'path': 'styleDefaults/__drawerDefaults/countLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};

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

    // Safe to modify super's map because function guarantees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.NBOX'] = translations['componentName'];
    ret['DvtNBoxBundle.HIGHLIGHTED_COUNT'] = translations['highlightedCount'];
    ret['DvtNBoxBundle.OTHER'] = translations['labelOther'];
    ret['DvtNBoxBundle.GROUP_NODE'] = translations['labelGroup'];
    ret['DvtNBoxBundle.SIZE'] = translations['labelSize'];
    ret['DvtNBoxBundle.ADDITIONAL_DATA'] = translations['labelAdditionalData'];
    return ret;
  },

  //** @inheritdoc */
  _HandleEvent : function(event) {
    var type = event['type'];
    if (type === 'adfPropertyChange') {
      var properties = event['properties'];
      for (var key in properties) {
        var value = properties[key];
        if (key == '_drawer')
          this.options[key] = value ? {'id': value} : null;
        else if (key == 'maximizedRow' || key == 'maximizedColumn')
          this._UserOptionChange(key, value);
      }
    }
    else {
      this._super(event);
    }
  },

  //** @inheritdoc */
  _LoadResources: function() {
    // Ensure the resources object exists
    if (this.options['_resources'] == null)
      this.options['_resources'] = {};

    var resources = this.options['_resources'];
    resources['overflow_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/nbox/overflow_dwn.png'), 'width':34, 'height':9};
    resources['overflow_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/nbox/overflow_ovr.png'), 'width':34, 'height':9};
    resources['overflow_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/nbox/overflow_ena.png'), 'width':34, 'height':9};
    resources['overflow_dis'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/nbox/overflow_dis.png'), 'width':34, 'height':9};
    resources['close_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/nbox/close_dwn.png'), 'width':16, 'height':16};
    resources['close_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/nbox/close_ovr.png'), 'width':16, 'height':16};
    resources['close_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/nbox/close_ena.png'), 'width':16, 'height':16};
  },

  //** @inheritdoc */
  getNodeBySubId : function(locator) {
    return this._super(locator);
  },

  //** @inheritdoc */
  getSubIdByNode:function(node) {
    return this._super(node);
  },

  /**
   * Get the NBox rows title.
   * @return {String} NBox rows title.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getRowsTitle: function() {
    var auto = this._component.getAutomation();
    return auto ? auto.getData('rowsTitle') : null;
  },

  /**
   * Get the NBox row count.
   * @return {Number} NBox row count.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getRowCount: function() {
    var auto = this._component.getAutomation();
    return auto ? auto.getData('rowCount') : null;
  },

  /**
   * Returns an object with the following properties for automation testing verification of the NBox row at the
   * specified value.
   *
   * @param {string} rowValue The id of the row.
   * @property {string} label The label of the row.
   * @return {Object|null} An object containing properties for the row, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getRow: function(rowValue) {
    var auto = this._component.getAutomation();
    return auto ? auto.getData('row', rowValue) : null;
  },


  /**
   * Get the NBox columns title.
   * @return {String} NBox columns title.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getColumnsTitle: function() {
    var auto = this._component.getAutomation();
    return auto ? auto.getData('columnsTitle') : null;
  },

  /**
   * Get the NBox column count.
   * @return {Number} NBox column count.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getColumnCount: function() {
    var auto = this._component.getAutomation();
    return auto ? auto.getData('columnCount') : -1;
  },

  /**
   * Returns an object with the following properties for automation testing verification of the NBox column at the
   * specified value.
   *
   * @param {string} columnValue The id of the column.
   * @property {string} label The label of the column.
   * @return {Object|null} An object containing properties for the column, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getColumn: function(columnValue) {
    var auto = this._component.getAutomation();
    return auto ? auto.getData('column', columnValue) : null;
  },

  /**
   * Returns an object with the following properties for automation testing verification of the NBox cell at the
   * specified row and column values.
   *
   * @param {string} rowValue The id of the containing row.
   * @param {string} columnValue The id of the containing column.
   * @property {string} background The background of the cell.
   * @property {string} label The label of the cell.
   * @property {Function(string)} getGroupNode A function taking a group category string and returning the corresponding group node.
   * @property {string} getGroupNode.color The color of the group node.
   * @property {string} getGroupNode.indicatorColor The color of the group node indicator section.
   * @property {Object} getGroupNode.indicatorIcon The indicator marker for the group node.
   * @property {string} getGroupNode.indicatorIcon.color The color of the indicator marker.
   * @property {string} getGroupNode.indicatorIcon.shape The shape of the indicator marker.
   * @property {boolean} getGroupNode.selected Whether or not the group node is selected.
   * @property {number} getGroupNode.size The number of nodes the group node represents.
   * @property {string} getGroupNode.tooltip The tooltip of the group node.
   * @property {Function(number)} getNode A function taking the node index that returns an object with properties for the specified node, or null if none exists.
   * @property {string} getNode.color The color of the node.
   * @property {Object} getNode.icon The icon marker for the node.
   * @property {string} getNode.icon.color The color of the icon marker.
   * @property {string} getNode.icon.shape The shape of the icon marker.
   * @property {string} getNode.indicatorColor The color of the node indicator section.
   * @property {Object} getNode.indicatorIcon The indicator marker for the node.
   * @property {string} getNode.indicatorIcon.color The color of the indicator marker.
   * @property {string} getNode.indicatorIcon.shape The shape of the indicator marker.
   * @property {string} getNode.label The label of the node.
   * @property {string} getNode.secondaryLabel The secondary label of the node.
   * @property {boolean} getNode.selected Whether or not the node is selected.
   * @property {string} getNode.tooltip The tooltip of the node.
   * @property {Function} getNodeCount A function that returns the number of nodes in the cell.
   * @return {Object|null} An object containing properties for the cell, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getCell: function(rowValue, columnValue) {
    var auto = this._component.getAutomation();
    var ret = auto ? auto.getCell(rowValue, columnValue) : null;
    if (ret) {
      ret['getGroupNode'] = function(groupMap) {
        return auto.getCellGroupNode(ret, groupMap);
      }
      ret['getNode'] = function(nodeIndex) {
        return auto.getCellNode(ret, nodeIndex);
      }
    }
    return ret;
  },

  /**
   * Get the NBox group behavior.
   * @return {String} group behavior The group behavior of the NBox ('withinCell', 'acrossCells', 'none').
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getGroupBehavior: function() {
    var auto = this._component.getAutomation();
    return auto ? auto.getData('groupBehavior') : null;
  },

  /**
   * Returns an object with the following properties for automation testing verification of the NBox group node with the
   * specified group category string.
   *
   * @param {String} groupCategory A string corresponding to the groupCategory value of the nodes represented by this group node.
   * @property {string} color The color of the group node.
   * @property {string} indicatorColor The indicator color of the group node.
   * @property {Object} indicatorIcon The indicator marker for the group node, or null if none exists.
   * @property {string} indicatorIcon.color The color of the indicator marker.
   * @property {string} indicatorIcon.shape The shape of the indicator marker.
   * @property {boolean} selected Whether or not the group node is selected.
   * @property {number} size The number of nodes the group node represents.
   * @property {string} tooltip The tooltip of the group node.
   * @return {Object|null} An object containing properties for the group node, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getGroupNode: function(groupCategory) {
    var auto = this._component.getAutomation();
    return auto.getGroupNode(groupCategory);
  },

  /**
   * Returns an object with the following properties for automation testing verification of the currently active NBox
   * dialog.
   *
   * @property {string} label The label of the dialog.
   * @property {Function(number)} getNode A function taking the node index that returns an object with properties for the specified node, or null if none exists.
   * @property {boolean} getNode.selected
   * @property {string} getNode.color The color of the node.
   * @property {Object} getNode.icon The icon marker for the node, or null if none exists.
   * @property {string} getNode.icon.color The color of the icon marker.
   * @property {string} getNode.icon.shape The shape of the icon marker.
   * @property {string} getNode.indicatorColor The indicator color of the node.
   * @property {Object} getNode.indicatorIcon The indicator icon for the node, or null if none exists.
   * @property {string} getNode.indicatorIcon.color The color of the indicator icon.
   * @property {string} getNode.indicatorIcon.shape The shape of the indicator icon.
   * @property {string} getNode.label The label of the node.
   * @property {string} getNode.secondaryLabel The secondary label of the node.
   * @property {string} getNode.tooltip The tooltip of the node.
   * @property {Function} getNodeCount A function that returns the number of nodes in the cell.
   * @return {Object|null} An object containing properties for the dialog, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @instance
   */
  getDialog: function() {
    var auto = this._component.getAutomation();
    var ret = auto ? auto.getDialog() : null;
    if (ret) {
      ret['getNode'] = function(nodeIndex) {
        return auto.getDialogNode(nodeIndex);
      }
    }
    return ret;
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
   * @memberof oj.ojNBox
   */
  getContextByNode: function(node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context['subId'] !== 'oj-nbox-tooltip' &&
                   context['subId'] !== 'oj-nbox-dialog-close-button' &&
                   context['subId'] !== 'oj-nbox-overflow')
      return context;

    return null;
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['cells', 'rows', 'columns', 'nodes']};
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
 *       <td>Cell</td>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Maximize/restore cell.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="3">Node</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td>Overflow Indicator</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Maximize cell.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="4">Group Node</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Open group node dialog.</td>
 *     </tr>
  *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td>Dialog</td>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Close dialog.</td>
 *     </tr>
 *     <tr>
 *       <td>Close Button</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Close dialog.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojNBox
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
 *       <td>Move focus to next component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Maximize focused cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Open dialog for focused group node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Escape</kbd></td>
 *       <td>Restore maximized cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Escape</kbd></td>
 *       <td>Close dialog.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>[</kbd></td>
 *       <td>Move to first node in cell or dialog</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>]</kbd></td>
 *       <td>Move to containing cell or dialog</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Left Arrow</kbd></td>
 *       <td>When cell focused, move to nearest cell to the left.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Right Arrow</kbd></td>
 *       <td>When cell focused, move to nearest cell to the right.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Up Arrow</kbd></td>
 *       <td>When cell focused, move to nearest cell above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Down Arrow</kbd></td>
 *       <td>When cell focused, move to nearest cell below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Left Arrow or Up Arrow</kbd></td>
 *       <td>When node focused, move to previous node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Right Arrow or Down Arrow</kbd></td>
 *       <td>When node focused, move to previous node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Left Arrow or Ctrl + Up Arrow</kbd></td>
 *       <td>When node focused, move to previous node but do not select.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Right Arrow or Ctrl + Down Arrow</kbd></td>
 *       <td>When node focused, move to previous node but do not select.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Select or Unselect focused node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Left Arrow or Shift + Up Arrow</kbd></td>
 *       <td>Move focus and multi-select previous node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Right Arrow or Down + Up Arrow</kbd></td>
 *       <td>Move focus and multi-select next node.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojNBox
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for NBox cell with specified row and column values.</p>
 *
 * @property {string} row The id of the row.
 * @property {string} column The id of the column.
 *
 * @ojsubid oj-nbox-cell
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the cell with row value 'low' and column value 'high':</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-cell', row: 'low', column: 'high'} );
 */

/**
 * <p>Sub-ID for NBox group node dialog.</p>
 *
 * @ojsubid oj-nbox-dialog
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the group node dialog:</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-dialog'} );
 */

/**
 * <p>Deprecated Sub-ID for NBox node at specified index in group node dialog.</p>
 *
 * @property {number} index The index of the node in the dialog.
 *
 * @ojsubid oj-nbox-dialog-node
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the first node in the group node dialog:</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-dialog-node', index: 0} );
 * @deprecated Use 'id' based 'oj-nbox-node' Sub-ID below to avoid uncertainty from node reordering.
 */

/**
 * <p>Sub-ID for NBox group node dialog close button.</p>
 *
 * @ojsubid oj-nbox-dialog-close-button
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the close button for the group node dialog:</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-dialog-close-button'} );
 */

/**
 * <p>Sub-ID for NBox group node with specified groupCategory value. When grouping is enabled within cells rather than
 * across cells, the row and column ids of the cell should be provided.</p>
 *
 * @property {string} row The id of the row of the associated cell, if one exists.
 * @property {string} column The id of the column of the associated cell, if one exists.
 * @property {string} groupCategory The category represented by the returned group node.
 *
 * @ojsubid oj-nbox-group-node
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the group node with groupCategory value of 'group1' when grouping across cells:</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-group-node', groupCategory: 'group1'} );
 *
 * @example <caption>Get the group node with groupCategory value of 'group1' in the specified cell:</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-group-node', row: 'low', column: 'high', groupCategory: 'group1'} );
 */

/**
 * <p>Sub-ID for NBox node with specified id.</p>
 *
 * @property {string} id The id of the node in the specified cell.
 *
 * @ojsubid oj-nbox-node
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the first node in the specified cell:</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-node', 'id': 'employee1'} );
 */

 /**
  * <p>Deprecated sub-ID for NBox node at specified index in specified cell.</p>
  *
  * @property {string} row The id of the row of the containing cell.
  * @property {string} column The id of the column of the containing cell.
  * @property {number} index The index of the node in the specified cell.
  *
  * @ojsubid oj-nbox-node
  * @memberof oj.ojNBox
  *
  * @example <caption>Get the first node in the specified cell:</caption>
  * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-node', row: 'low', column: 'high', index: 0} );
  * @deprecated Use 'id' based Sub-ID above to avoid uncertainty from node reordering.
  */

/**
 * <p>Sub-ID for NBox overflow button in specified cell.</p>
 *
 * @property {string} row The id of the row of the containing cell.
 * @property {string} column The id of the column of the containing cell.
 *
 * @ojsubid oj-nbox-overflow
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the overflow button in the specified cell:</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-overflow', row: 'low', column: 'high'} );
 */

/**
 * <p>Sub-ID for the the NBox tooltip.</p>
 *
 * @ojsubid oj-nbox-tooltip
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the tooltip object of the NBox, if displayed:</caption>
 * var nodes = $( ".selector" ).ojNBox( "getNodeBySubId", {'subId': 'oj-nbox-tooltip'} );
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for NBox cell with specified row and column values.</p>
 *
 * @property {string} row The id of the row.
 * @property {string} column The id of the column.
 *
 * @ojnodecontext oj-nbox-cell
 * @memberof oj.ojNBox
 */

/**
 * <p>Context for NBox group node dialog.</p>
 *
 * @ojnodecontext oj-nbox-dialog
 * @memberof oj.ojNBox
 */

/**
 * <p>Context for NBox group node with specified groupCategory value. When grouping is enabled within cells rather than
 * across cells, the row and column ids of the cell should be provided.</p>
 *
 * @property {string} row The id of the row of the associated cell, if one exists.
 * @property {string} column The id of the column of the associated cell, if one exists.
 * @property {string} groupCategory The category represented by the returned group node.
 *
 * @ojnodecontext oj-nbox-group-node
 * @memberof oj.ojNBox
 */

/**
 * <p>Context for NBox node with specified id.</p>
 *
 * @property {string} id The id of the node.
 *
 * @ojnodecontext oj-nbox-node
 * @memberof oj.ojNBox
 */

/**
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li> 
 *   <li>id: The id of the hovered node.</li> 
 *   <li>label: The label of the hovered node.</li> 
 *   <li>secondaryLabel: The secondary label of the hovered node.</li> 
 *   <li>color: The color of the hovered node.</li> 
 *   <li>indicatorColor: The indicator color of the hovered node.</li> 
 *   <li>row: The id of the row containing the hovered node.</li> 
 *   <li>column: The id of the column containing the hovered node.</li>
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojNBox
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojNBoxMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string"
    },
    "animationOnDisplay": {
      "type": "string"
    },
    "cellContent": {
      "type": "string"
    },
    "cellMaximize": {
      "type": "string"
    },
    "cells": {
      "type": "Array<object>"
    },
    "columns": {
      "type": "Array<object>"
    },
    "columnsTitle": {
      "type": "string"
    },
    "countLabel": {},
    "groupAttributes": {
      "type": "Array<string>"
    },
    "groupBehavior": {
      "type": "string"
    },
    "hiddenCategories": {
      "type": "Array<string>"
    },
    "highlightedCategories": {
      "type": "Array<string>"
    },
    "highlightMatch": {
      "type": "string"
    },
    "hoverBehavior": {
      "type": "string"
    },
    "labelTruncation": {
      "type": "string"
    },
    "maximizedColumn": {
      "type": "string"
    },
    "maximizedRow": {
      "type": "string"
    },
    "nodes": {
      "type": "Array<object>"
    },
    "otherColor": {
      "type": "string"
    },
    "otherThreshold": {
      "type": "number"
    },
    "rows": {
      "type": "Array<object>"
    },
    "rowsTitle": {
      "type": "object"
    },
    "selection": {
      "type": "Array<string>"
    },
    "selectionMode": {
      "type": "string"
    },
    "styleDefaults": {
      "type": "object"
    },
    "tooltip": {
      "type": "object"
    },
    "touchResponse": {
      "type": "string"
    }
  },
  "methods": {
    "getCell": {},
    "getColumn": {},
    "getColumnCount": {},
    "getColumnsTitle": {},
    "getContextByNode": {},
    "getDialog": {},
    "getGroupBehavior": {},
    "getGroupNode": {},
    "getRow": {},
    "getRowCount": {},
    "getRowsTitle": {}
  },
  "extension": {
    "_widgetName": "ojNBox"
  }
};
oj.Components.registerMetadata('ojNBox', 'dvtBaseComponent', ojNBoxMeta);
oj.Components.register('oj-n-box', oj.Components.getMetadata('ojNBox'));
})();
});
