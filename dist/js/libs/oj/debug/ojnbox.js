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
 *   JET NBox
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#nBoxOverview-section"></a>
 * </h3>
 *
 * <p>NBox elements are used in HCM (Human Capital Management) applications
 * to measure employees across two dimensions (e.g. potential and performance). Each dimension
 * can be split into multiple ranges, whose intersections result in distinct cells which
 * employees can be placed into.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-n-box
 *   columns='[{"id":"low"}, {"id":"high"}]',
 *   rows='[{"id":"low"}, {"id":"high"}]',
 *   nodes='[{"column":"low", "row":"high", "label":"Employee 1"},
 *           {"column":"low", "row":"low", "label":"Employee 2"},
 *           {"column":"high", "row":"high", "label":"Employee 3"},
 *           {"column":"low", "row":"high", "label":"Employee 4"}]'>
 * &lt;/oj-n-box>
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
 * <p>Applications should avoid setting very large data densities on this element.
 *    Applications can enable progressive reveal of data through drilling or aggregate small nodes to reduce the
 *    displayed data set size.
 * </p>
 *
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">styleDefaults.nodeDefaults</code>, instead of styling properties
 *    on the individual nodes. The nbox can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojNBox', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",

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
 *       <td>Move focus to next element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
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

/**
 * Specifies the animation that is applied on data changes.
 * @expose
 * @name animationOnDataChange
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * Specifies the animation that is shown on initial display.
 * @expose
 * @name animationOnDisplay
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * The list of cells. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @expose
 * @name cells
 * @memberof oj.ojNBox
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The id of the column containing this cell.
 * @expose
 * @name cells[].column
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The id of the row containing this cell.
 * @expose
 * @name cells[].row
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the cell label.
 * @expose
 * @name cells[].label
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The halign value for the cell label.
 * @expose
 * @name cells[].labelHalign
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default <code class="prettyprint">"start"</code>
 */
/**
 * The CSS style object defining the style of the cell label.
 * @expose
 * @name cells[].labelStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The description of this cell. This is used for accessibility.
 * @expose
 * @name cells[].shortDesc
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Determines when to display the cell count label (extra info displayed after primary cell label). "off" never show the count label. "on" always show the count label. Show countLabel value if specified, otherwise use a simple node count. "auto" show the count label if countLabel attribute is defined.
 * @expose
 * @name cells[].showCount
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The CSS style string/object for this cell. Used for customizing the cell background and border.
 * @ignore
 * @name cells[].style
 * @memberof! oj.ojNBox
 * @instance
 * @type {string|object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class for this cell. Used for customizing the cell background and border.
 * @ignore
 * @name cells[].className
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style string/object for this cell. Used for customizing the maximized cell background and border.
 * @ignore
 * @name cells[].maximizedStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {string|object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class for this cell. Used for customizing the maximized cell background and border.
 * @ignore
 * @name cells[].maximizedClassName
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style string/object for this cell. Used for customizing the minimized cell background and border.
 * @ignore
 * @name cells[].minimizedStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {string|object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class for this cell. Used for customizing the minimized cell background and border.
 * @ignore
 * @name cells[].minimizedClassName
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object for this cell. Used for customizing the cell background and border.
 * @expose
 * @name cells[].svgStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class for this cell. Used for customizing the cell background and border.
 * @expose
 * @name cells[].svgClassName
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object for this cell. Used for customizing the maximized cell background and border.
 * @expose
 * @name cells[].maximizedSvgStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class for this cell. Used for customizing the maximized cell background and border.
 * @expose
 * @name cells[].maximizedSvgClassName
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object for this cell. Used for customizing the minimized cell background and border.
 * @expose
 * @name cells[].minimizedSvgStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class for this cell. Used for customizing the minimized cell background and border.
 * @expose
 * @name cells[].minimizedSvgClassName
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The list of columns. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @expose
 * @name columns
 * @memberof oj.ojNBox
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The id of the column. Used to identify this column.
 * @expose
 * @name columns[].id
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the column label.
 * @expose
 * @name columns[].label
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the column label.
 * @expose
 * @name columns[].labelStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the title on the column edge.
 * @expose
 * @name columnsTitle
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A function that returns custom text for the cell count labels (extra info displayed after primary labels). The function takes a dataContext argument, provided by the NBox, with the following properties: <ul>   <li>row: The row value of the cell.</li>    <li>column: The column value of the cell.</li>    <li>nodeCount: The number of non-hidden nodes in the cell.</li> <li>totalNodeCount: The number of non-hidden nodes in the NBox.</li> <li>highlightedNodeCount: The number of highlighted nodes in the cell.</li> </ul> The custom count label is shown by a cell when its showCount attribute is set "on" or "auto".
 * @expose
 * @name countLabel
 * @memberof oj.ojNBox
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies how nodes should be grouped.
 * @expose
 * @name groupBehavior
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "acrossCells"
 * @ojvalue {string} "none"
 * @ojvalue {string} "withinCell"
 * @default <code class="prettyprint">"withinCell"</code>
 */
/**
 * An array of attributes to style the group nodes with. If sepcified, any attributes not listed will be ignored.
 * @expose
 * @name groupAttributes
 * @memberof oj.ojNBox
 * @instance
 * @type {Array.<string>}
 * @ojvalue {string} "color"
 * @ojvalue {string} "indicatorColor"
 * @ojvalue {string} "indicatorIconShape"
 * @ojvalue {string} "indicatorIconColor"
 * @ojvalue {string} "indicatorIconPattern"
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of category strings used for category filtering. Data items with a category in hiddenCategories will be filtered.
 * @expose
 * @name hiddenCategories
 * @memberof oj.ojNBox
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * Defines the behavior applied when hovering over data items.
 * @expose
 * @name hoverBehavior
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "dim"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * An array of category strings used for category highlighting. Data items with a category in highlightedCategories will be highlighted.
 * @expose
 * @name highlightedCategories
 * @memberof oj.ojNBox
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * The matching condition for the highlightedCategories property. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
 * @expose
 * @name highlightMatch
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "any"
 * @ojvalue {string} "all"
 * @default <code class="prettyprint">"all"</code>
 */
/**
 * The id of the column to be maximized.
 * @expose
 * @name maximizedColumn
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * The id of the row to be maximized.
 * @expose
 * @name maximizedRow
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * Whether or not the cell maximize/de-maximize gestures are enabled.
 * @expose
 * @name cellMaximize
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default <code class="prettyprint">"on"</code>
 */
/**
 * The content the cells will display. "auto" switches between nodes and cell counts based on available space. "counts" forces the NBox to always render cell counts.
 * @expose
 * @name cellContent
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "counts"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Determines node label truncation behavior. Labels are always truncated if limited by container (e.g. cell, dialog) width. Optionally, NBox can further truncate node labels to increase the number of nodes visible to the user. "on" allows label truncation to increase number of visible nodes. "ifRequired" only allows truncation when limited by container width.
 * @expose
 * @name labelTruncation
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "ifRequired"
 * @ojvalue {string} "on"
 * @default <code class="prettyprint">"on"</code>
 */
/**
 * The color for the "other" group nodes which aggregate any group nodes that fall below the otherThreshold, if specified.
 * @expose
 * @name otherColor
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A percentage (0-1) of the nodes collection size that determines the value beneath which any groups will be aggregated into an "other" node.
 * @expose
 * @name otherThreshold
 * @memberof oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 *  An object containing an optional callback function for tooltip customization. 
 * @expose
 * @name tooltip
 * @memberof oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A function that returns a custom tooltip for the NBox nodes. The function takes a dataContext argument,
 * provided by the NBox, with the following properties:
 * <ul>
 *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li>
 *   <li>id: The id of the hovered node.</li>
 *   <li>label: The label of the hovered node.</li>
 *   <li>secondaryLabel: The secondary label of the hovered node.</li>
 *   <li>color: The color of the hovered node.</li>
 *   <li>indicatorColor: The indicator color of the hovered node.</li>
 *   <li>row: The id of the row containing the hovered node.</li>
 *   <li>column: The id of the column containing the hovered node.</li>
 *   <li>componentElement: The NBox element.</li>
 * </ul>
 *  The function should return an Object that contains only one of the two properties:
 *  <ul>
 *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
 *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
 *  </ul>
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojNBox
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The list of nodes. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @name nodes
 * @memberof oj.ojNBox
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The id of this node.
 * @expose
 * @name nodes[].id
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The column id for this node.
 * @expose
 * @name nodes[].column
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The row id for this node.
 * @expose
 * @name nodes[].row
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the node border.
 * @expose
 * @name nodes[].borderColor
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The width of the node border.
 * @expose
 * @name nodes[].borderWidth
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the node label.
 * @expose
 * @name nodes[].label
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the secondary node label.
 * @expose
 * @name nodes[].secondaryLabel
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The description of this node. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name nodes[].shortDesc
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An optional array of additional category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with other visualization elements. Defaults to node's id if unspecified.
 * @expose
 * @name nodes[].categories
 * @memberof! oj.ojNBox
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The group category this node belongs to. Nodes with the same groupCategory will be grouped together.
 * @expose
 * @name nodes[].groupCategory
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of this node.
 * @ignore
 * @name nodes[].style
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class defining the style of this node.
 * @ignore
 * @name nodes[].className
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
 /**
  * The CSS style object defining the style of this node.
  * @expose
  * @name nodes[].svgStyle
  * @memberof! oj.ojNBox
  * @instance
  * @type {object}
  * @default <code class="prettyprint">null</code>
  */
 /**
  * The CSS style class defining the style of this node.
  * @expose
  * @name nodes[].svgClassName
  * @memberof! oj.ojNBox
  * @instance
  * @type {string}
  * @default <code class="prettyprint">null</code>
  */
/**
 * The background color of this node.
 * @expose
 * @name nodes[].color
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The background color for the indicator section of this node.
 * @expose
 * @name nodes[].indicatorColor
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines the primary icon for this node.
 * @expose
 * @name nodes[].icon
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of this icon.
 * @expose
 * @name nodes[].icon.borderColor
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border radius of this icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
 * @expose
 * @name nodes[].icon.borderRadius
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border width of this icon.
 * @expose
 * @name nodes[].icon.borderWidth
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The fill color of this icon.
 * @expose
 * @name nodes[].icon.color
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The fill pattern of this icon.
 * @expose
 * @name nodes[].icon.pattern
 * @memberof! oj.ojNBox
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
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * The opacity of this icon.
 * @expose
 * @name nodes[].icon.opacity
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The shape of this icon. Can take the name of a built-in shape or the svg path commands for a custom shape.
 * @expose
 * @name nodes[].icon.shape
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "ellipse"
 * @ojvalue {string} "square"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @default <code class="prettyprint">null</code>
 */
/**
 * The URL of an image to display for this icon.
 * @expose
 * @name nodes[].icon.source
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The width of this icon.
 * @expose
 * @name nodes[].icon.width
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of this icon.
 * @expose
 * @name nodes[].icon.height
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of this icon.
 * @ignore
 * @name nodes[].icon.style
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class defining the style of this icon.
 * @ignore
 * @name nodes[].icon.className
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of this icon.
 * @expose
 * @name nodes[].icon.svgStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class defining the style of this icon.
 * @expose
 * @name nodes[].icon.svgClassName
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines the indicator icon for this node.
 * @expose
 * @name nodes[].indicatorIcon
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.borderColor
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border radius of this indicator icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
 * @expose
 * @name nodes[].indicatorIcon.borderRadius
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border width of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.borderWidth
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The fill color of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.color
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The fill pattern of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.pattern
 * @memberof! oj.ojNBox
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
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * The opacity of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.opacity
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The shape of this indicator icon. Can take the name of a built-in shape or the svg path commands for a custom shape.
 * @expose
 * @name nodes[].indicatorIcon.shape
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "ellipse"
 * @ojvalue {string} "square"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @default <code class="prettyprint">null</code>
 */
/**
 * The URL of an image to display for this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.source
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The width of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.width
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.height
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of this indicator icon.
 * @ignore
 * @name nodes[].indicatorIcon.style
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class defining the style of this indicator icon.
 * @ignore
 * @name nodes[].indicatorIcon.className
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.svgStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class defining the style of this indicator icon.
 * @expose
 * @name nodes[].indicatorIcon.svgClassName
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An optional horizontal position (as a percentage) to be used in the average position calculation when grouping across cells.
 * @expose
 * @name nodes[].xPercentage
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An optional vertical position (as a percentage) to be used in the average position calculation when grouping across cells.
 * @expose
 * @name nodes[].yPercentage
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The list of rows. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @expose
 * @name rows
 * @memberof oj.ojNBox
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The id of the row. Used to identify this row.
 * @expose
 * @name rows[].id
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the row label.
 * @expose
 * @name rows[].label
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the row label.
 * @expose
 * @name rows[].labelStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the title on the row edge.
 * @expose
 * @name rowsTitle
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array containing the ids of the selected nodes.
 * @expose
 * @name selection
 * @memberof oj.ojNBox
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * Specifies the selection mode.
 * @expose
 * @name selectionMode
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "single"
 * @ojvalue {string} "multiple"
 * @default <code class="prettyprint">"multiple"</code>
 */
/**
 * An object defining the style defaults for this NBox.
 * @expose
 * @name styleDefaults
 * @memberof oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The duration of the animations in milliseconds.
 * @expose
 * @name styleDefaults.animationDuration
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the column labels.
 * @expose
 * @name styleDefaults.columnLabelStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the columns title.
 * @expose
 * @name styleDefaults.columnsTitleStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies initial hover delay in ms for highlighting data items.
 * @expose
 * @name styleDefaults.hoverBehaviorDelay
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the row labels.
 * @expose
 * @name styleDefaults.rowLabelStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the rows title.
 * @expose
 * @name styleDefaults.rowsTitleStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the style defaults for cells.
 * @expose
 * @name styleDefaults.cellDefaults
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the cell labels.
 * @expose
 * @name styleDefaults.cellDefaults.labelStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The halign value for the cell label.
 * @expose
 * @name styleDefaults.cellDefaults.labelHalign
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default <code class="prettyprint">"start"</code>
 */
/**
 * The CSS style object for this cell. Used for customizing the cell background and border.
 * @ignore
 * @name styleDefaults.cellDefaults.style
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Determines when to display the cell count label (extra info displayed after primary cell label). "off" never show the count label. "on" always show the count label. Show countLabel value if specified, otherwise use a simple node count. "auto" show the count label if countLabel attribute is defined.
 * @expose
 * @name styleDefaults.cellDefaults.showCount
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * An object defining the style defaults for nodes.
 * @expose
 * @name styleDefaults.nodeDefaults
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default color of the node borders.
 * @expose
 * @name styleDefaults.nodeDefaults.borderColor
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default width of the node borders.
 * @expose
 * @name styleDefaults.nodeDefaults.borderWidth
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default background color of the nodes.
 * @expose
 * @name styleDefaults.nodeDefaults.color
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default background color of the node indicator sections.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorColor
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the node labels.
 * @expose
 * @name styleDefaults.nodeDefaults.labelStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style object defining the style of the node secondary labels.
 * @expose
 * @name styleDefaults.nodeDefaults.secondaryLabelStyle
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the style defaults for the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default border color of the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.borderColor
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default border radius of the node icons. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.borderRadius
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default border width of the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.borderWidth
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default fill color of the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.color
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default fill pattern of the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.pattern
 * @memberof! oj.ojNBox
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
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * The default opacity of the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.opacity
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default shape of the node icons. Can take the name of a built-in shape or the svg path commands for a custom shape.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.shape
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "ellipse"
 * @ojvalue {string} "square"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @default <code class="prettyprint">null</code>
 */
/**
 * The URL of an image to display by default for the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.source
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default width of the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.width
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default height of the node icons.
 * @expose
 * @name styleDefaults.nodeDefaults.iconDefaults.height
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the style defaults for the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults
 * @memberof! oj.ojNBox
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default border color of the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.borderColor
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default border radius of the node indicator icons. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.borderRadius
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default border width of the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.borderWidth
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default fill color of the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.color
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default fill pattern of the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.pattern
 * @memberof! oj.ojNBox
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
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * The default opacity of the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.opacity
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default shape of the node indicator icons. Can take the name of a built-in shape or the svg path commands for a custom shape.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.shape
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "ellipse"
 * @ojvalue {string} "square"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @default <code class="prettyprint">null</code>
 */
/**
 * The URL of an image to display by default for the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.source
 * @memberof! oj.ojNBox
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default width of the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.width
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default height of the node indicator icons.
 * @expose
 * @name styleDefaults.nodeDefaults.indicatorIconDefaults.height
 * @memberof! oj.ojNBox
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events if the element does not require an internal feature that requires a touch start gesture like scrolling. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if panning is not available for those elements that support the feature. 
 * @expose
 * @name touchResponse
 * @memberof oj.ojNBox
 * @instance
 * @type {string}
 * @ojvalue {string} "touchStart"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
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
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-cell', row: 'low', column: 'high'} );
 */

/**
 * <p>Sub-ID for NBox group node dialog.</p>
 *
 * @ojsubid oj-nbox-dialog
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the group node dialog:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-dialog'} );
 */

/**
 * <p>Deprecated Sub-ID for NBox node at specified index in group node dialog.</p>
 *
 * @ignore
 * @property {number} index The index of the node in the dialog.
 *
 * @ojsubid oj-nbox-dialog-node
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the first node in the group node dialog:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-dialog-node', index: 0} );
 * @deprecated Use 'id' based 'oj-nbox-node' Sub-ID below to avoid uncertainty from node reordering.
 */

/**
 * <p>Sub-ID for NBox group node dialog close button.</p>
 *
 * @ojsubid oj-nbox-dialog-close-button
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the close button for the group node dialog:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-dialog-close-button'} );
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
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-group-node', groupCategory: 'group1'} );
 *
 * @example <caption>Get the group node with groupCategory value of 'group1' in the specified cell:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-group-node', row: 'low', column: 'high', groupCategory: 'group1'} );
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
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-node', 'id': 'employee1'} );
 */

 /**
  * <p>Deprecated sub-ID for NBox node at specified index in specified cell.</p>
  * 
  * @ignore
  * @property {string} row The id of the row of the containing cell.
  * @property {string} column The id of the column of the containing cell.
  * @property {number} index The index of the node in the specified cell.
  *
  * @ojsubid oj-nbox-node
  * @memberof oj.ojNBox
  *
  * @example <caption>Get the first node in the specified cell:</caption>
  * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-node', row: 'low', column: 'high', index: 0} );
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
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-overflow', row: 'low', column: 'high'} );
 */

/**
 * <p>Sub-ID for the the NBox tooltip.</p>
 *
 * @ojsubid oj-nbox-tooltip
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the tooltip object of the NBox, if displayed:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-tooltip'} );
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
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojNBoxMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "cellContent": {
      "type": "string",
      "enumValues": ["counts", "auto"]
    },
    "cellMaximize": {
      "type": "string",
      "enumValues": ["off", "on"]
    },
    "cells": {
      "type": "Array<object>|Promise"
    },
    "columns": {
      "type": "Array<object>|Promise"
    },
    "columnsTitle": {
      "type": "string"
    },
    "countLabel": {},
    "groupAttributes": {
      "type": "Array<string>"
    },
    "groupBehavior": {
      "type": "string",
      "enumValues": ["acrossCells", "none", "withinCell"]
    },
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightedCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightMatch": {
      "type": "string",
      "enumValues": ["any", "all"]
    },
    "hoverBehavior": {
      "type": "string",
      "enumValues": ["dim", "none"]
    },
    "labelTruncation": {
      "type": "string",
      "enumValues": ["ifRequired", "on"]
    },
    "maximizedColumn": {
      "type": "string",
      "writeback": true
    },
    "maximizedRow": {
      "type": "string",
      "writeback": true
    },
    "nodes": {
      "type": "Array<object>|Promise"
    },
    "otherColor": {
      "type": "string"
    },
    "otherThreshold": {
      "type": "number"
    },
    "rows": {
      "type": "Array<object>|Promise"
    },
    "rowsTitle": {
      "type": "string"
    },
    "selection": {
      "type": "Array<string>",
      "writeback": true
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["none", "single", "multiple"]
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "cellDefaults": {
          "type": "object",
          "properties": {
            "labelHalign": {
              "type": "string",
              "enumValues": ["center", "end", "start"]
            },
            "labelStyle": {
              "type": "object"
            },
            "showCount": {
              "type": "string",
              "enumValues": ["on", "off", "auto"]
            },
            "svgStyle": {
              "type": "object"
            }
          }
        },
        "columnLabelStyle": {
          "type": "object"
        },
        "columnsTitleStyle": {
          "type": "object"
        },
        "hoverBehaviorDelay": {
          "type": "number"
        },
        "nodeDefaults": {
          "type": "object",
          "properties": {
            "borderColor": {
              "type": "string"
            },
            "borderWidth": {
              "type": "number"
            },
            "color": {
              "type": "string"
            },
            "iconDefaults": {
              "type": "object",
              "properties": {
                "borderColor": {
                  "type": "string"
                },
                "borderRadius": {
                  "type": "string"
                },
                "borderWidth": {
                  "type": "number"
                },
                "color": {
                  "type": "string"
                },
                "height": {
                  "type": "number"
                },
                "opacity": {
                  "type": "number"
                },
                "pattern": {
                  "type": "string",
                  "enumValues": ["smallChecker", "smallCrosshatch", "smallDiagonalLeft", "smallDiagonalRight", "smallDiamond", "smallTriangle",
                                 "largeChecker", "largeCrosshatch", "largeDiagonalLeft", "largeDiagonalRight", "largeDiamond", "largeTriangle", "none"]
                },
                "shape": {
                  "type": "string"
                },
                "source": {
                  "type": "string"
                },
                "width": {
                  "type": "number"
                }
              }
            },
            "indicatorColor": {
              "type": "string"
            },
            "indicatorIconDefaults": {
              "type": "object",
              "properties": {
                "borderColor": {
                  "type": "string"
                },
                "borderRadius": {
                  "type": "string"
                },
                "borderWidth": {
                  "type": "number"
                },
                "color": {
                  "type": "string"
                },
                "height": {
                  "type": "number"
                },
                "opacity": {
                  "type": "number"
                },
                "pattern": {
                  "type": "string",
                  "enumValues": ["smallChecker", "smallCrosshatch", "smallDiagonalLeft", "smallDiagonalRight", "smallDiamond", "smallTriangle",
                                 "largeChecker", "largeCrosshatch", "largeDiagonalLeft", "largeDiagonalRight", "largeDiamond", "largeTriangle", "none"]
                },
                "shape": {
                  "type": "string"
                },
                "source": {
                  "type": "string"
                },
                "width": {
                  "type": "number"
                }
              }
            },
            "labelStyle": {
              "type": "object"
            },
            "secondaryLabelStyle": {
              "type": "object"
            },
          }
        },
        "rowLabelStyle": {
          "type": "object"
        },
        "rowsTitleStyle": {
          "type": "object"
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "touchResponse": {
      "type": "string",
      "enumValues": ["touchStart", "auto"]
    },
    "translations": {
      "properties": {
        "componentName": {
          "type": "string"
        },
        "highlightedCount": {
          "type": "string"
        },
        "labelAdditionalData": {
          "type": "string"
        },
        "labelGroup": {
          "type": "string"
        },
        "labelOther": {
          "type": "string"
        },
        "labelSize": {
          "type": "string"
        }
      }
    }
  },
  "events": {},
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
    _WIDGET_NAME: "ojNBox"
  }
};
oj.CustomElementBridge.registerMetadata('oj-n-box', 'dvtBaseComponent', ojNBoxMeta);
// Get the combined meta of superclass which contains a shape parse function generator
var dvtMeta = oj.CustomElementBridge.getMetadata('oj-n-box');
oj.CustomElementBridge.register('oj-n-box', {
  'metadata': dvtMeta,
  'parseFunction': dvtMeta['extension']._DVT_PARSE_FUNC({
  	'style-defaults.node-defaults.icon-defaults.shape': true, 
  	'style-defaults.node-defaults.indicator-icon-defaults.shape': true
  })
});
})();
});
