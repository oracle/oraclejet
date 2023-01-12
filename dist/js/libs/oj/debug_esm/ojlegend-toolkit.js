/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { SelectionEffectUtils, IconButton, Displayable, Agent, MouseEvent, KeyboardHandler, Rectangle, Rect, Automation, BaseComponentDefaults, CSSStyle, TextUtils, EventManager, SimpleMarker, EventFactory, SimpleObjPeer, JsonUtils, ToolkitUtils, KeyboardEvent, SimpleScrollableContainer, Container, Dimension, LayoutUtils, OutputText, ImageMarker, PatternFill, Line, Stroke, BaseComponent, CategoryRolloverHandler, Obj, ResourceUtils, AriaUtils } from 'ojs/ojdvt-toolkit';

/**
 * Utility functions for Legend.
 * @class
 */
const DvtLegendUtils = {
  /**
   * Get the category from a legend item.
   * @param {object} item The legend item
   * @param {Legend} legend The legend being rendered.
   * @return {String}
   */
  getItemCategory: (item, legend) => {
    var category = null;
    var hasDataProvider = legend.getOptions()['data'] != null;
    if (item['categories'] && item['categories'].length > 0) category = item['categories'][0];
    else if (!hasDataProvider) category = item['id'] ? item['id'] : item['text'];

    return category;
  },

  /**
   * Helper function to check if category is hidden
   * @param {String} category the category string
   * @param {Legend} legend The legend being rendered.
   * @return {boolean} true if the category is in the hiddenCategories array
   */
  isCategoryHidden: (category, legend) => {
    var hiddenCategories = legend.getOptions()['hiddenCategories'];
    if (!hiddenCategories || hiddenCategories.length <= 0) return false;

    return hiddenCategories.indexOf(category) !== -1;
  },

  /**
   * Helper function to check if a section is collapsed
   * @param {object} section the legend section
   * @param {Legend} legend The legend being rendered.
   * @return {boolean} true if the section is collapsed
   */
  isSectionCollapsed: (section, legend) => {
    var options = legend.getOptions();
    return (
      section['expanded'] == 'off' ||
      section['expanded'] == false ||
      (options.expanded && options.expanded.has(section.id) == false)
    );
  }
};

/**
 * Logical object for legend data object displayables.
 * @param {Legend} legend The owning legend instance.
 * @param {array} displayables The array of associated DvtDisplayables.
 * @param {object} item The definition of the legend item.
 * @param {string} tooltip The tooltip of the legend item.
 * @param {string} datatip The datatip of the legend item.
 * @param {boolean} drillable Whether the legend item is drillable.
 * @class
 * @constructor
 * @implements {DvtLogicalObject}
 * @implements {DvtCategoricalObject}
 * @implements {DvtTooltipSource}
 */
class DvtLegendObjPeer {
  constructor(legend, displayables, item, tooltip, datatip, drillable) {
    /**
     * @param {Legend} legend The owning legend instance.
     * @param {array} displayables The array of associated DvtDisplayables.
     * @param {object} item The definition of the legend item.
     * @param {string} tooltip The tooltip of the legend item.
     * @param {string} datatip The datatip of the legend item.
     * @param {boolean} drillable Whether the legend item is drillable.
     */
    this._legend = legend;
    this._displayables = displayables;
    this._item = item;
    this._category = DvtLegendUtils.getItemCategory(this._item, this._legend); // section title is not category
    this._id = this._category ? this._category : item['title'];
    this._drillable = drillable;
    this._tooltip = tooltip;
    this._datatip = datatip;
    this._isShowingKeyboardFocusEffect = false;
    this._hoverBorderRadius = parseInt(legend.getOptions()['_hoverBorderRadius']);
    // Apply the cursor for drilling if specified
    if (this._drillable) {
      for (var i = 0; i < this._displayables.length; i++) {
        this._displayables[i].setCursor(SelectionEffectUtils.getSelectingCursor());
      }
    }
  }

  /**
   * Creates a data item to identify the specified displayable and registers it with the legend.
   * @param {array} displayables The displayables to associate.
   * @param {Legend} legend The owning legend instance.
   * @param {object} item The definition of the legend item.
   * @param {string} tooltip The tooltip of the legend item.
   * @param {string} datatip The datatip of the legend item.
   * @param {boolean} drillable Whether the legend item is drillable.
   * @return {DvtLegendObjPeer}
   */
  static associate(displayables, legend, item, tooltip, datatip, drillable) {
    // Item must have displayables and an id to be interactive.
    if (!displayables || !item) return null;

    // Create the logical object.
    var identObj = new DvtLegendObjPeer(legend, displayables, item, tooltip, datatip, drillable);

    // Register with the legend
    legend.__registerObject(identObj);

    // Finally associate using the event manager
    for (var i = 0; i < displayables.length; i++)
      legend.getEventManager().associate(displayables[i], identObj);

    return identObj;
  }

  /**
   * Returns the data object defining this legend item.
   * @return {object} The data object defining this legend item.
   */
  getData() {
    return this._item;
  }

  /**
   * Returns the primary data color for this legend item.
   * @return {string} The color string.
   */
  getColor() {
    return this._item['color'];
  }

  /**
   * Returns the id for this legend item.
   * @return {object} The id for this legend item.
   */
  getId() {
    return this._id;
  }

  //---------------------------------------------------------------------//
  // Rollover and Hide/Show Support: DvtLogicalObject impl               //
  //---------------------------------------------------------------------//

  /**
   * @override
   */
  getDisplayables() {
    return this._displayables;
  }

  //---------------------------------------------------------------------//
  // Rollover and Hide/Show Support: DvtCategoricalObject impl           //
  //---------------------------------------------------------------------//

  /**
   * @override
   */
  getCategories() {
    if (this._category != null) return [this._category];

    return null;
  }

  /**
   * Returns if the legend item is drillable.
   * @return {boolean}
   */
  isDrillable() {
    return this._drillable;
  }

  /**
   * @override
   */
  getAriaLabel() {
    var states = [];
    var options = this._legend.getOptions();
    var translations = options.translations;
    var hideAndShow = this._legend.getOptions()['hideAndShowBehavior'];
    var bHiddenCategory = DvtLegendUtils.isCategoryHidden(this._category, this._legend);
    var data = this.getData();

    if (this._displayables[0] instanceof IconButton) {
      states.push(
        translations[
          DvtLegendUtils.isSectionCollapsed(data, this._legend) ? 'stateCollapsed' : 'stateExpanded'
        ]
      );
      return Displayable.generateAriaLabel(data['title'], states);
    }

    if (hideAndShow != 'off' && hideAndShow != 'none')
      states.push(translations[bHiddenCategory ? 'stateHidden' : 'stateVisible']);
    if (this.isDrillable()) states.push(translations.stateDrillable);

    if (data['shortDesc'] != null) {
      return Displayable.generateAriaLabel(data['shortDesc'], states);
    } else if (states.length > 0) {
      return Displayable.generateAriaLabel(data['text'], states);
    }

    return null;
  }

  /**
   * Updates the aria label for a map data object
   */
  updateAriaLabel() {
    if (!Agent.deferAriaCreation() && this._displayables[0])
      this._displayables[0].setAriaProperty('label', this.getAriaLabel());
  }

  //---------------------------------------------------------------------//
  // Keyboard Support: DvtKeyboardNavigable impl                         //
  //---------------------------------------------------------------------//
  /**
   * @override
   */
  getNextNavigable(event) {
    if (event.type == MouseEvent.CLICK) return this;

    var navigables = this._legend.__getKeyboardObjects();
    return KeyboardHandler.getNextNavigable(this, event, navigables, true, this._legend, true);
  }

  /**
   * @override
   */
  getKeyboardBoundingBox(targetCoordinateSpace) {
    if (this._displayables[0]) return this._displayables[0].getDimensions(targetCoordinateSpace);
    else return new Rectangle(0, 0, 0, 0);
  }

  /**
   * @override
   */
  getTargetElem() {
    if (this._displayables[0]) return this._displayables[0].getElem();
    return null;
  }

  /**
   * @override
   */
  showKeyboardFocusEffect() {
    this._isShowingKeyboardFocusEffect = true;
    if (this._displayables[0]) {
      if (this._displayables[0] instanceof IconButton)
        this._displayables[0].showKeyboardFocusEffect();
      else this._displayables[0].setSolidStroke(Agent.getFocusColor());
    }
  }

  /**
   * @override
   */
  hideKeyboardFocusEffect() {
    this._isShowingKeyboardFocusEffect = false;
    if (this._displayables[0]) {
      if (this._displayables[0] instanceof IconButton)
        this._displayables[0].hideKeyboardFocusEffect();
      else this._displayables[0].setStroke(null);
    }
  }

  /**
   * @override
   */
  isShowingKeyboardFocusEffect() {
    return this._isShowingKeyboardFocusEffect;
  }

  //---------------------------------------------------------------------//
  // Tooltip Support: DvtTooltipSource impl                              //
  //---------------------------------------------------------------------//

  /**
   * @override
   */
  getTooltip() {
    return this._tooltip;
  }

  /**
   * @override
   */
  getDatatip() {
    return this._datatip;
  }

  /**
   * @override
   */
  getDatatipColor() {
    return this._item['color'];
  }

  //---------------------------------------------------------------------//
  // DnD Support: DvtDraggable impl                                      //
  //---------------------------------------------------------------------//

  /**
   * @override
   */
  isDragAvailable() {
    return true;
  }

  /**
   * @override
   */
  getDragTransferable() {
    return [this.getId()];
  }

  /**
   * @override
   */
  getDragFeedback() {
    return this.getDisplayables();
  }

  /**
   * @override
   */
  showHoverEffect() {
    if (this._displayables[0]) {
      if (this._displayables[0] instanceof Rect) {
        this._displayables[0].setClassName('oj-legend-hover');
        this._displayables[0].setRx(this._hoverBorderRadius);
      }
    }
  }

  /**
   * @override
   */
  hideHoverEffect() {
    if (this._displayables[0]) {
      if (this._displayables[0] instanceof Rect) {
        this._displayables[0].setClassName();
        this._displayables[0].setRx(0);
      }
    }
  }
}

/**
 *  Provides automation services for a DVT component.
 *  @class DvtLegendAutomation
 *  @param {Legend} dvtComponent
 *  @implements {dvt.Automation}
 *  @constructor
 */
class DvtLegendAutomation extends Automation {
  /**
   * Valid subIds inlcude:
   * <ul>
   * <li>section[sectionIndex0]:item[itemIndex]</li>
   * </ul>
   * @override
   */
  GetSubIdForDomElement(displayable) {
    var logicalObj = this._comp.getEventManager().GetLogicalObject(displayable);
    if (logicalObj && logicalObj instanceof DvtLegendObjPeer) {
      var item = logicalObj.getData();
      var indexList = this._getIndicesFromItem(item, this._comp.getOptions());
      if (indexList) return 'section' + indexList;
    }
    return null;
  }

  /**
   * Returns the index values of the given legend item
   * @param {Object} item the legend item to find the indices of within legendOptions
   * @param {Object} legendOptions the legend options object
   * @return {String} [sectionIndex0] or [sectionIndex0]:item[itemIndex]
   * @private
   */
  _getIndicesFromItem(item, legendOptions) {
    // If there are sections in this options object, recurse through the section object
    if (legendOptions['sections'] && legendOptions['sections'].length > 0) {
      for (var s = 0; s < legendOptions['sections'].length; s++) {
        if (legendOptions['sections'][s] == item) return '[' + s + ']';
        else {
          var itemIndex = this._getIndicesFromItem(item, legendOptions['sections'][s]);
          if (itemIndex) return '[' + s + ']' + itemIndex;
        }
      }
      return null;
    }
    // If we found the items list for a section, search the items of this section
    else if (legendOptions['items'] && legendOptions['items'].length > 0) {
      for (var i = 0; i < legendOptions['items'].length; i++) {
        if (legendOptions['items'][i] == item) return ':item[' + i + ']';
      }
      return null;
    }
    return null;
  }

  /**
   * Returns the index values of the legend item that corresponds to the given series
   * @param {Object} series the chart series object
   * @param {Object} legendOptions the legend options object
   * @return {String} [sectionIndex0] or [sectionIndex0]:item[itemIndex]
   */
  getIndicesFromSeries(series, legendOptions) {
    // If there are sections in this options object, recurse through the section object
    if (legendOptions['sections'] && legendOptions['sections'].length > 0) {
      for (var s = 0; s < legendOptions['sections'].length; s++) {
        var itemIndex = this.getIndicesFromSeries(series, legendOptions['sections'][s]);
        if (itemIndex) return '[' + s + ']' + itemIndex;
      }
      return null;
    }
    // If we found the items list for a section, search the items of this section
    else if (legendOptions['items'] && legendOptions['items'].length > 0) {
      for (var i = 0; i < legendOptions['items'].length; i++) {
        if (legendOptions['items'][i]['text'] == series['name']) return ':item[' + i + ']';
      }
      return null;
    }
    return null;
  }

  /**
   * Returns the legend item for the given subId
   * @param {Object} options the legend options object
   * @param {String} subId the subId of the desired legend item
   * @return {Object} the legend item corresponding to the given subId
   */
  getLegendItem(options, subId) {
    var openParen = subId.indexOf('[');
    var closeParen = subId.indexOf(']');
    if (openParen >= 0 && closeParen >= 0) {
      var index = subId.substring(openParen + 1, closeParen);
      var colonIndex = subId.indexOf(':');
      subId = subId.substring(closeParen + 1);
      var nextOpenParen = subId.indexOf('[');
      var nextCloseParen = subId.indexOf(']');
      // If there is another index layer recurse into the sections object at that index
      if (nextOpenParen >= 0 && nextCloseParen >= 0) {
        return this.getLegendItem(options['sections'][index], subId);
      } else {
        // If we are at the last index return the item/section object at that index
        if (colonIndex == 0) return options['items'][index];
        else return options['sections'][index];
      }
    }
    return undefined;
  }

  /**
   * Valid subIds inlcude:
   * <ul>
   * <li>section[sectionIndex0]:item[itemIndex]</li>
   * <li>tooltip</li>
   * </ul>
   * @override
   */
  getDomElementForSubId(subId) {
    // tooltip
    if (subId == Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._comp);

    var legendItem = this.getLegendItem(this._comp.getOptions(), subId);
    var legendPeers = this._comp.__getObjects();

    // Find the legend object peer for the item indexed by the subId and return the dom element of its displayable
    for (var i = 0; i < legendPeers.length; i++) {
      var item = legendPeers[i].getData();
      if (legendItem == item) return legendPeers[i].getDisplayables()[0].getElem();
    }
    return null;
  }

  /**
   * Returns the legend title. Used for verification.
   * @return {String} The legend title
   */
  getTitle() {
    return this._comp.getOptions()['title'];
  }

  /**
   * Returns an object containing data for a legend item. Used for verification.
   * Valid verification values inlcude:
   * <ul>
   * <li>text</li>
   * </ul>
   * @param {String} subIdPath The array of indices in the subId for the desired legend item
   * @return {Object|null} An object containing data for the legend item
   */
  getItem(subIdPath) {
    var item;
    var index = subIdPath.shift();
    var options = this._comp.getOptions();

    if (!options.sections || options.sections.length === 0) {
      return null;
    }

    while (index != undefined) {
      if (subIdPath.length > 0) options = options['sections'][index];
      else item = options['items'][index];
      index = subIdPath.shift();
    }
    if (item) return { text: item['text'] ? item['text'] : null };
    return null;
  }

  /**
   * Returns an object containing data for a legend section. Used for verification.
   * Valid verification values inlcude:
   * <ul>
   * <li>title</li>
   * <li>item</li>
   * <li>section</li>
   * </ul>
   * @param {String} subIdPath The array of indices in the subId for the desired legend section
   * @return {Object} An object containing data for the legend section
   */
  getSection(subIdPath) {
    var section;
    var index = subIdPath.shift();
    var options = this._comp.getOptions();

    if (!options.sections || options.sections.length === 0) {
      return null;
    }

    while (index != undefined) {
      if (subIdPath.length > 0) options = options['sections'][index];
      else section = options['sections'][index];
      index = subIdPath.shift();
    }
    return {
      title: section && section['title'] ? section['title'] : null,
      items: section && section['items'] ? this._generateItemObjects(section['items']) : null,
      sections:
        section && section['sections'] ? this._generateSectionObjects(section['sections']) : null
    };
  }

  /**
   * Returns an array containing data for an array of legend items
   * @param {Array} items The array of legend items
   * @return {Array} An array containing objects with data for each legend item
   * @private
   */
  _generateItemObjects(items) {
    var itemDataArray = [];

    for (var i = 0; i < items.length; i++) {
      itemDataArray.push({ text: items[i]['text'] });
    }

    return itemDataArray;
  }

  /**
   * Returns an array containing data for an array of legend sections
   * @param {Array} sections The array of legend sections
   * @return {Array} An array containing objects with data for each legend section
   * @private
   */
  _generateSectionObjects(sections) {
    var sectionDataArray = [];

    for (var i = 0; i < sections.length; i++) {
      sectionDataArray.push({
        title: sections[i]['title'] ? sections[i]['title'] : null,
        items: sections[i]['items'] ? this._generateItemObjects(sections[i]['items']) : null,
        sections: sections[i]['sections']
          ? this._generateSectionObjects(sections[i]['sections'])
          : null
      });
    }

    return sectionDataArray;
  }

  /**
   *
   * @param {string} id The id of legend item corresponding to logical object.
   * @returns {object | null} obj The logical object corresponding to legend item id.
   */
  _getLogicalObject(id) {
    var peers = this._comp._peers;
    for (var i = 0; i < peers.length; i++) {
      if (id === peers[i]._id) {
        return peers[i];
      }
    }
    return null;
  }

  /**
   * Dispatches synthetic drill event from legend item. Used by webdriver.
   * @param {string} id The id associated with the legend item.
   */
  dispatchDrillEvent(id) {
    var obj = this._getLogicalObject(id);
    this._comp.getEventManager().processDrillEvent(obj);
  }
}

/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @param {dvt.Context} context The rendering context.
 * @extends {dvt.BaseComponentDefaults}
 */
class DvtLegendDefaults extends BaseComponentDefaults {
  constructor(context) {
    /**
     * Defaults for version 1.
     */
    const SKIN_ALTA = {
      skin: CSSStyle.SKIN_ALTA,
      orientation: 'vertical',
      position: null,
      backgroundColor: null,
      borderColor: null,
      textStyle: new CSSStyle(
        BaseComponentDefaults.FONT_FAMILY_ALTA_11 + 'color: #333333;'
      ),
      titleStyle: new CSSStyle(
        BaseComponentDefaults.FONT_FAMILY_ALTA_11 + 'color: #737373;'
      ),
      _sectionTitleStyle: new CSSStyle(
        BaseComponentDefaults.FONT_FAMILY_ALTA_11 + 'color: #737373;'
      ),
      titleHalign: 'start',
      hiddenCategories: [],
      hideAndShowBehavior: 'off',
      hoverBehavior: 'none',
      hoverBehaviorDelay: 200,
      scrolling: 'asNeeded',
      halign: 'start',
      valign: 'top',
      drilling: 'off',
      dnd: {
        drag: {
          series: {}
        },
        drop: {
          legend: {}
        }
      },
      // default color, marker shape, and line width, for internal use
      _color: '#a6acb1',
      _markerShape: 'square',
      _lineWidth: 3,

      //*********** Internal Attributes *************************************************//
      layout: {
        outerGapWidth: 3,
        outerGapHeight: 3, // Used by Treemap for legend creation
        titleGapWidth: 17,
        titleGapHeight: 9,
        symbolGapWidth: 7,
        symbolGapHeight: 4,
        rowGap: 4,
        columnGap: 10,
        sectionGapHeight: 16,
        sectionGapWidth: 24
      },

      isLayout: false // true if rendering for layout purposes
    };
    super({ alta: SKIN_ALTA }, context);
  }

  /**
   * Adjusts the gap size based on the component options.
   * @param {Legend} legend The legend component.
   * @param {Number} defaultSize The default gap size.
   * @return {Number}
   */
  static getGapSize(legend, defaultSize) {
    // adjust based on legend text font size
    var scalingFactor = Math.min(
      TextUtils.getTextStringHeight(legend.getCtx(), legend.getOptions()['textStyle']) / 14,
      1
    );
    return Math.ceil(defaultSize * scalingFactor);
  }

  /**
   * @override
   */
  getNoCloneObject() {
    return { sections: { items: { _getDataContext: true } } };
  }
}

/**
 * Event Manager for Legend.
 * @param {Legend} legend
 * @class
 * @extends {dvt.EventManager}
 * @constructor
 */
class DvtLegendEventManager extends EventManager {
  constructor(legend) {
    super(legend.getCtx(), legend.processEvent, legend, legend);
    this._legend = legend;
  }

  /**
   * @override
   */
  OnClick(event) {
    super.OnClick(event);

    var obj = this.GetLogicalObject(event.target);
    if (!obj) return;

    var hideShow = this.processHideShowEvent(obj);
    var action = this.handleClick(obj, event);

    // If a hide/show or action occurs, the event should not bubble.
    if (hideShow || action) event.stopPropagation();
  }

  /**
   * @override
   */
  OnMouseOver(event) {
    super.OnMouseOver(event);

    var obj = this.GetLogicalObject(event.target);
    if (!obj) return;

    // Accessibility Support
    this.UpdateActiveElement(obj);
  }

  /**
   * @override
   */
  HandleTouchClickInternal(evt) {
    var obj = this.GetLogicalObject(evt.target);
    if (!obj) return;

    // : if hideAndShow/action is enabled, it takes precedence over series highlighting
    // action is handled in handleClick
    var touchEvent = evt.touchEvent;
    var hideShow = this.processHideShowEvent(obj);
    var processEvt = this.handleClick(obj, evt);
    if ((hideShow || processEvt) && touchEvent) touchEvent.preventDefault();
  }

  /**
   * Processes a hide and show action on the specified legend item.  Returns true if a hide or
   * show has been performed.
   * @param {DvtLegendObjPeer} obj The legend item that was clicked.
   * @return {boolean} True if an event was fired.
   */
  processHideShowEvent(obj) {
    // Don't continue if not enabled
    var hideAndShow = this._legend.getOptions()['hideAndShowBehavior'];
    if (hideAndShow == 'none' || hideAndShow == 'off') return false;

    var categories = obj.getCategories ? obj.getCategories() : null;
    if (!categories || categories.length <= 0) return false;

    var category = obj.getCategories()[0];
    var hiddenCategories = this._legend.getOptions()['hiddenCategories'] || [];
    hiddenCategories = hiddenCategories.slice();

    // Update the legend markers
    var displayables = obj.getDisplayables();
    for (var i = 0; i < displayables.length; i++) {
      var displayable = displayables[i];
      if (displayable instanceof SimpleMarker)
        // setHollow is a toggle
        displayable.setHollow(obj.getColor());
      else if (displayable instanceof Rect) obj.updateAriaLabel();
    }

    // Update the state and create the event
    var id = categories[0];
    var event;
    if (DvtLegendUtils.isCategoryHidden(category, this._legend)) {
      hiddenCategories.splice(hiddenCategories.indexOf(category), 1);
      event = EventFactory.newCategoryShowEvent(id, hiddenCategories);
    } else {
      hiddenCategories.push(category);
      event = EventFactory.newCategoryHideEvent(id, hiddenCategories);
    }

    this._legend.getOptions()['hiddenCategories'] = hiddenCategories;
    this.FireEvent(event, this._legend);

    // Return true since an event was fired
    return true;
  }

  /**
   * Fires the drill event from the legend object.
   * @param { Object } obj The logical object coressponding to the displayable from which drill is to be fired.
   * @returns { boolean } Returns true if drill object is fired. Else returns false.
   */
  processDrillEvent(obj) {
    // Drill support
    if (obj && obj instanceof DvtLegendObjPeer && obj.isDrillable()) {
      var id = obj.getId();
      this.FireEvent(EventFactory.newDrillEvent(id), this._legend);
      return true;
    }
    return false;
  }

  /**
   * Helper for processing click event. Handles action, drilling and section collapse.  Returns true if click is handled.
   * @param {DvtLegendObjPeer} obj The legend item that was clicked.
   * @param {dvt.BaseEvent} event
   * @return {boolean} True if an event was fired.
   */
  handleClick(obj, event) {
    if (this.processDrillEvent(obj)) {
      return true;
    }

    var params = obj instanceof SimpleObjPeer ? obj.getParams() : null;
    if (params && params['isCollapsible']) {
      this.toggleSectionCollapse(event, params['id']);
      return true;
    }

    return false;
  }

  /**
   * @override
   */
  ProcessRolloverEvent(event, obj, bOver) {
    // Don't continue if not enabled
    var options = this._legend.getOptions();
    if (
      options['hoverBehavior'] === 'none' &&
      (options['hideAndShowBehavior'] === 'none' || options['hideAndShowBehavior'] === 'off')
    )
      return;

    // Do not fire rollover event for section collapse/expand button
    if (obj.getDisplayables && obj.getDisplayables()[0] instanceof IconButton) return;

    if (options['hoverBehavior'] !== 'none') {
      // Compute the new highlighted categories and update the options
      var categories = obj.getCategories ? obj.getCategories() : [];
      options['highlightedCategories'] = bOver && categories ? categories.slice() : null;

      // Fire the event to the rollover handler, who will fire to the component callback.
      var rolloverEvent = EventFactory.newCategoryHighlightEvent(
        options['highlightedCategories'],
        bOver
      );
      var hoverBehaviorDelay = CSSStyle.getTimeMilliseconds(options['hoverBehaviorDelay']);
      this.RolloverHandler.processEvent(
        rolloverEvent,
        this._legend.__getObjects(),
        hoverBehaviorDelay,
        true
      );
    }

    if (options['hideAndShowBehavior'] !== 'none' && options['hideAndShowBehavior'] !== 'off') {
      // Show hover effect
      bOver
        ? obj.showHoverEffect && obj.showHoverEffect()
        : obj.hideHoverEffect && obj.hideHoverEffect();
    }
  }

  /**
   * Collapses or expands a legend section when collapse button is clicked.
   * @param {dvt.BaseEvent} event
   * @param {dvt.IconButton} button The button that calls the method.
   */
  onCollapseButtonClick(event, button) {
    // Find the section based on the buttonId, which is an array of section indices
    var buttonId = button.getId();
    this.toggleSectionCollapse(event, buttonId);
  }

  /**
   * Collapses or expands a legend section.
   * @param {dvt.BaseEvent} event
   * @param {array} sectionIdArray The array of the id path of the section.
   */
  toggleSectionCollapse(event, sectionIdArray) {
    var options = this._legend.getOptions();
    var expandedKeySet = options.expanded;
    var section = this._legend.getOptions();
    var isExpand = null;
    for (var i = 0; i < sectionIdArray.length; i++)
      section = section['sections'][sectionIdArray[i]];

    // Expand or collapse the section
    if (expandedKeySet) {
      if (expandedKeySet.has(section.id)) {
        options.expanded = expandedKeySet.delete([section.id]);
        isExpand = false;
      } else {
        options.expanded = expandedKeySet.add([section.id]);
        isExpand = true;
      }
    } else {
      section['expanded'] = section['expanded'] == 'off' ? 'on' : 'off';
    }

    // Set the keyboard focus on a mouse click
    if (event.type == MouseEvent.CLICK) {
      var peer = this.GetLogicalObject(event.target);
      if (peer.getNextNavigable) this.setFocusObj(peer.getNextNavigable(event));
    }

    // Stores the current keyboard focus
    var focus = this._legend.getKeyboardFocus();
    var isShowingFocusEffect = focus ? focus.isShowingKeyboardFocusEffect() : false;

    this._legend.render();

    // Restores the keyboard focus after rerendering
    if (focus) this._legend.setKeyboardFocus(focus, isShowingFocusEffect);

    this.hideTooltip();

    // Fire expand/collapse event
    if (isExpand != null) {
      event = new EventFactory.newExpandCollapseEvent(
        isExpand ? 'expand' : 'collapse',
        section.id,
        section,
        this._legend.getOptions()['_widgetConstructor'],
        options.expanded
      );
      this.FireEvent(event, this._legend);
    }
  }

  /**
   * @override
   */
  GetTouchResponse() {
    if (this._legend.getOptions()['_isScrollingLegend'])
      return EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
    else return EventManager.TOUCH_RESPONSE_TOUCH_START;
  }

  /**
   * @override
   */
  isDndSupported() {
    return true;
  }

  /**
   * @override
   */
  GetDragSourceType(event) {
    var obj = this.DragSource.getDragObject();
    if (obj instanceof DvtLegendObjPeer && obj.getData()['_getDataContext'] != null)
      return 'series';
    return null;
  }

  /**
   * @override
   */
  GetDragDataContexts(bSanitize) {
    var obj = this.DragSource.getDragObject();
    if (obj instanceof DvtLegendObjPeer) {
      var dataContext = obj.getData()['_getDataContext']();
      if (bSanitize) {
        dataContext = JsonUtils.clone(dataContext, null, {
          component: true,
          componentElement: true
        });
        ToolkitUtils.cleanDragDataContext(dataContext);
      }
      return [dataContext];
    }
    return [];
  }

  /**
   * @override
   */
  GetDropTargetType(event) {
    var relPos = this._legend.stageToLocal(
      this.getCtx().pageToStageCoords(event.pageX, event.pageY)
    );
    var dropOptions = this._legend.getOptions()['dnd']['drop'];
    var bounds = this._legend.__getBounds();

    if (Object.keys(dropOptions['legend']).length > 0 && bounds.containsPoint(relPos.x, relPos.y))
      return 'legend';
    return null;
  }

  /**
   * @override
   */
  GetDropEventPayload(event) {
    return {};
  }

  /**
   * @override
   */
  ShowDropEffect(event) {
    var dropTargetType = this.GetDropTargetType(event);
    if (dropTargetType == 'legend') {
      var dropColor = this._legend.getOptions()['_dropColor'];
      var background = this._legend.getCache().getFromCache('background');
      if (background) {
        background.setSolidFill(dropColor);
        background.setClassName('oj-active-drop');
      }
    }
  }

  /**
   * @override
   */
  ClearDropEffect() {
    var background = this._legend.getCache().getFromCache('background');
    if (background) {
      var backgroundColor = this._legend.getOptions()['backgroundColor'];
      if (backgroundColor) background.setSolidFill(backgroundColor);
      else background.setInvisibleFill();
      ToolkitUtils.removeClassName(background.getElem(), 'oj-invalid-drop');
      ToolkitUtils.removeClassName(background.getElem(), 'oj-active-drop');
    }
  }

  /**
   * @override
   */
  ShowRejectedDropEffect(event) {
    var dropTargetType = this.GetDropTargetType(event);

    if (dropTargetType == 'legend') {
      var background = this._legend.getCache().getFromCache('background');
      if (background) background.setClassName('oj-invalid-drop');
    }
  }
}

/**
 *  @param {dvt.EventManager} manager The owning dvt.EventManager
 *  @param {Legend} legend
 *  @class DvtLegendKeyboardHandler
 *  @extends {dvt.KeyboardHandler}
 *  @constructor
 */
class DvtLegendKeyboardHandler extends KeyboardHandler {
  constructor(manager, legend) {
    super(manager);
    this._legend = legend;
  }

  /**
   * @override
   */
  processKeyDown(event) {
    var keyCode = event.keyCode;
    var currentNavigable = this._eventManager.getFocus();
    var isButton =
      currentNavigable && currentNavigable.getDisplayables()[0] instanceof IconButton;
    var nextNavigable = null;

    if (currentNavigable == null && keyCode == KeyboardEvent.TAB) {
      // navigate to the default
      var navigables = this._legend.__getKeyboardObjects();
      if (navigables.length > 0) {
        EventManager.consumeEvent(event);
        nextNavigable = this.getDefaultNavigable(navigables);
      }
    } else if (currentNavigable) {
      if (keyCode == KeyboardEvent.TAB) {
        EventManager.consumeEvent(event);
        nextNavigable = currentNavigable;
      } else if (keyCode == KeyboardEvent.ENTER || keyCode == KeyboardEvent.SPACE) {
        // Process driling and action events if enter
        if (keyCode == KeyboardEvent.ENTER) {
          this._eventManager.handleClick(currentNavigable, event);
        }

        if (isButton)
          this._eventManager.onCollapseButtonClick(event, currentNavigable.getDisplayables()[0]);
        else this._eventManager.processHideShowEvent(currentNavigable);
        EventManager.consumeEvent(event);
      } else if (
        isButton &&
        (keyCode == KeyboardEvent.LEFT_ARROW || keyCode == KeyboardEvent.RIGHT_ARROW)
      ) {
        this._eventManager.onCollapseButtonClick(event, currentNavigable.getDisplayables()[0]);
        EventManager.consumeEvent(event);
      } else nextNavigable = super.processKeyDown(event);
    }

    // Scroll the next element into view before returning it
    if (nextNavigable) this._legend.container.scrollIntoView(nextNavigable.getDisplayables()[0]);
    return nextNavigable;
  }
}

/**
 * Renderer for Legend.
 * @class
 */
const DvtLegendRenderer = {
  /** @private */
  _DEFAULT_LINE_WIDTH_WITH_MARKER: 2,
  /** @private */
  _LINE_MARKER_SIZE_FACTOR: 0.6,
  /** @private */
  _DEFAULT_SYMBOL_SIZE: 10,
  /** @private */
  _BUTTON_SIZE: 12,
  /** @private */
  _FOCUS_GAP: 2,

  /**
   * Renders the legend.
   * @param {Legend} legend The legend being rendered.
   * @param {dvt.Rectangle} availSpace The available space.
   * @return {dvt.Rectangle} The dimensions of the legend content.
   */
  render: (legend, availSpace) => {
    var options = legend.getOptions();
    var context = legend.getCtx();
    var isRTL = Agent.isRightToLeft(context);
    legend.__setBounds(availSpace);

    if (!options['isLayout']) DvtLegendRenderer._renderBackground(legend, availSpace);

    // setting scroll to 'always' in redwood
    var visibleScrolling = context.getThemeBehavior() === 'redwood' ? 'always' : 'asNeeded';
    var container = new SimpleScrollableContainer(
      context,
      availSpace.w,
      availSpace.h,
      visibleScrolling
    );
    var contentContainer = new Container(context);
    container.getScrollingPane().addChild(contentContainer);
    legend.addChild(container);
    legend.container = container;

    var gapWidth = DvtLegendDefaults.getGapSize(legend, options['layout']['outerGapWidth']);
    var gapHeight = DvtLegendDefaults.getGapSize(legend, options['layout']['outerGapHeight']);
    availSpace.x += gapWidth;
    availSpace.y += gapHeight;
    availSpace.w -= 2 * gapWidth;
    availSpace.h -= 2 * gapHeight;

    // Return if there's no space
    if (availSpace.w <= 0 || availSpace.h <= 0) return new Dimension(0, 0);

    var totalDim = DvtLegendRenderer._renderContents(
      legend,
      contentContainer,
      new Rectangle(availSpace.x, availSpace.y, availSpace.w, availSpace.h)
    );

    if (totalDim.w == 0 || totalDim.h == 0)
      // drop legend
      return new Dimension(0, 0);

    container.prepareContentPane();

    if (totalDim.h > availSpace.h) {
      totalDim.h = availSpace.h;
      options['_isScrollingLegend'] = true;
    } else options['_isScrollingLegend'] = false;

    // Compute the legend content position
    var translateX = 0,
      translateY = 0;
    var halign = options['hAlign'] != null ? options['hAlign'] : options['halign'];
    if (halign == 'center')
      translateX = availSpace.x - totalDim.x + (availSpace.w - totalDim.w) / 2;
    else if (halign == 'end') {
      if (isRTL) translateX = availSpace.x - totalDim.x;
      else translateX = availSpace.x - totalDim.x + availSpace.w - totalDim.w;
    }
    var valign = options['vAlign'] != null ? options['vAlign'] : options['valign'];
    if (valign == 'middle')
      translateY = availSpace.y - totalDim.y + (availSpace.h - totalDim.h) / 2;
    else if (valign == 'bottom') translateY = availSpace.y - totalDim.y + availSpace.h - totalDim.h;

    var contentDims = new Rectangle(
      totalDim.x + translateX - gapWidth,
      totalDim.y + translateY - gapHeight,
      totalDim.w + 2 * gapWidth,
      totalDim.h + 2 * gapHeight
    );
    if (options['isLayout']) return contentDims;

    // Align the legend content
    if (translateX || translateY) contentContainer.setTranslate(translateX, translateY);

    // Align the titles now after we know the total width
    var titles = legend.__getTitles();
    for (var i = 0; i < titles.length; i++)
      LayoutUtils.align(
        totalDim,
        titles[i].halign,
        titles[i].text,
        titles[i].text.getDimensions().w
      );

    return contentDims;
  },

  /**
   * Renders the legend title and sections.
   * @param {Legend} legend
   * @param {dvt.Container} container
   * @param {dvt.Rectangle} availSpace
   * @return {dvt.Rectangle} The total dimensions of the title and the sections.
   * @private
   */
  _renderContents: (legend, container, availSpace) => {
    var options = legend.getOptions();
    availSpace = availSpace.clone();

    var title = DvtLegendRenderer._renderTitle(
      legend,
      container,
      options['title'],
      availSpace,
      null,
      true
    );
    if (title) {
      var titleDim = title.getDimensions();
      var titleGap = DvtLegendDefaults.getGapSize(legend, options['layout']['titleGapHeight']);
      availSpace.y += titleDim.h + titleGap;
      availSpace.h -= Math.floor(titleDim.h + titleGap); // : IE9 attributes slightly too much height for the legend title
    }

    var sectionsDim = DvtLegendRenderer._renderSections(
      legend,
      container,
      options['sections'],
      availSpace,
      []
    );

    return title ? titleDim.getUnion(sectionsDim) : sectionsDim;
  },

  /**
   * Renders the legend background/border colors.
   * @param {Legend} legend The legend being rendered.
   * @param {dvt.Rectangle} availSpace The available space.
   * @private
   */
  _renderBackground: (legend, availSpace) => {
    var options = legend.getOptions();
    var backgroundColor = options['backgroundColor'];
    var borderColor = options['borderColor'];
    var legendDrop = options['dnd'] ? options['dnd']['drop']['legend'] : {}; // for drop effect
    var legendDrag = options['dnd'] ? options['dnd']['drag']['series'] : {}; // for draggable effect

    if (
      backgroundColor ||
      borderColor ||
      Object.keys(legendDrop).length > 0 ||
      Object.keys(legendDrag).length > 0
    ) {
      var rect = new Rect(
        legend.getCtx(),
        availSpace.x,
        availSpace.y,
        availSpace.w,
        availSpace.h
      );

      if (backgroundColor) rect.setSolidFill(backgroundColor);
      else rect.setInvisibleFill(); // otherwise the borderColor will fill the rect

      if (borderColor) {
        rect.setSolidStroke(borderColor);
        rect.setPixelHinting(true);
      }

      legend.addChild(rect);

      legend.getCache().putToCache('background', rect);
    }
  },

  /**
   * Renders the legend title and updates the available space.
   * @param {Legend} legend The legend being rendered.
   * @param {dvt.Container} container The title container.
   * @param {string} titleStr
   * @param {dvt.Rectangle} availSpace The available space.
   * @param {object} section The section attributes, if this is a section
   * @param {boolean} isAligned Whether the title supports halign (done at the end of render call).
   * @param {number} id The id of the section, if this is a section.
   * @param {dvt.IconButton} button The button associated with the legend title
   * @return {dvt.Rectangle} The dimension of the title.
   * @private
   */
  _renderTitle: (legend, container, titleStr, availSpace, section, isAligned, id, button) => {
    var options = legend.getOptions();
    var context = container.getCtx();
    var isRTL = Agent.isRightToLeft(context);

    if (!titleStr) return null;

    // Create the title object and add to legend
    var title = new OutputText(context, titleStr, availSpace.x, availSpace.y);
    var titleStyle = options['titleStyle'];

    if (section) {
      var defaultStyle = options['_sectionTitleStyle'].clone();
      titleStyle = section['titleStyle']
        ? defaultStyle.merge(new CSSStyle(section['titleStyle']))
        : defaultStyle;
    }

    title.setCSSStyle(titleStyle);

    if (TextUtils.fitText(title, availSpace.w, Infinity, container)) {
      if (isRTL)
        // align right first to get the dims for preferred size
        title.setX(availSpace.x + availSpace.w - title.getDimensions().w);

      if (!options['isLayout']) {
        // Associate with logical object to support tooltips
        var params = { id, button };
        params['isCollapsible'] =
          section &&
          (section['collapsible'] === 'on' ||
            (typeof section['collapsible'] === 'boolean' && section['collapsible']));
        legend
          .getEventManager()
          .associate(
            title,
            new SimpleObjPeer(title.getUntruncatedTextString(), null, null, params)
          );

        if (isAligned) {
          // title alignment will be deferred until we know the total width of the legend content
          var titleHalign =
            section && section['titleHalign'] ? section['titleHalign'] : options['titleHalign'];
          legend.__registerTitle({ text: title, halign: titleHalign });
        }
      } else container.removeChild(title);

      return title;
    }

    return null;
  },

  /**
   * Renders a legend section.
   * @param {Legend} legend The legend being rendered.
   * @param {dvt.Container} container The container of the section.
   * @param {Array} sections The array of section objects.
   * @param {dvt.Rectangle} availSpace The available space.
   * @param {Array} id The id of the parent section calling this method.
   * @return {dvt.Rectangle} The total dimension of the sections.
   * @private
   */
  _renderSections: (legend, container, sections, availSpace, id) => {
    if (!sections || sections.length == 0) return new Rectangle(0, 0, 0, 0);

    var options = legend.getOptions();

    // Apply default symbol dimensions. If only one dimension is defined, the other will copy its value.
    // Note that zero width/height should be treated the same as null or undefined.
    if (!options['symbolWidth'] && !options['symbolHeight']) {
      options['symbolWidth'] = DvtLegendRenderer._DEFAULT_SYMBOL_SIZE;
      options['symbolHeight'] = DvtLegendRenderer._DEFAULT_SYMBOL_SIZE;
    } else {
      if (!options['symbolWidth']) options['symbolWidth'] = options['symbolHeight'];
      else if (!options['symbolHeight']) options['symbolHeight'] = options['symbolWidth'];

      //  - Courtesy fix if values passed in as "x" vs. x
      options['symbolWidth'] = parseInt(options['symbolWidth']);
      options['symbolHeight'] = parseInt(options['symbolHeight']);
    }

    var sectionGapHeight = DvtLegendDefaults.getGapSize(
      legend,
      options['layout']['sectionGapHeight']
    );
    var titleGapHeight = DvtLegendDefaults.getGapSize(legend, options['layout']['titleGapHeight']);
    var gapWidth = DvtLegendDefaults.getGapSize(legend, options['layout']['sectionGapWidth']);
    var rowHeight = DvtLegendRenderer._getRowHeight(legend);
    var isHoriz = options['orientation'] != 'vertical';

    var totalDim = null;
    var horizAvailSpace = availSpace.clone();
    var sectionDim;
    for (var i = 0; i < sections.length; i++) {
      var sectionId = id.concat([i]);
      var gapHeight = DvtLegendUtils.isSectionCollapsed(sections[i], legend)
        ? titleGapHeight
        : sectionGapHeight;

      if (isHoriz) {
        // horizontal legend
        // first try to render horizontally in the current row
        sectionDim = DvtLegendRenderer._renderHorizontalSection(
          legend,
          container,
          sections[i],
          horizAvailSpace,
          rowHeight
        );

        if (sectionDim.w > horizAvailSpace.w) {
          if (horizAvailSpace.w < availSpace.w) {
            // form a new row
            availSpace.y += sectionDim.h + gapHeight;
            availSpace.h -= sectionDim.h + gapHeight;
          }

          if (sectionDim.w <= availSpace.w)
            // render horizontally in a new row
            sectionDim = DvtLegendRenderer._renderHorizontalSection(
              legend,
              container,
              sections[i],
              availSpace,
              rowHeight
            );
          // render vertically in columns
          else
            sectionDim = DvtLegendRenderer._renderVerticalSection(
              legend,
              container,
              sections[i],
              availSpace,
              rowHeight,
              sectionId,
              true
            );

          availSpace.y += sectionDim.h + gapHeight;
          availSpace.h -= sectionDim.h + gapHeight;
          horizAvailSpace = availSpace.clone();
        } else {
          horizAvailSpace.w -= sectionDim.w + gapWidth;
          if (!Agent.isRightToLeft(legend.getCtx()))
            horizAvailSpace.x += sectionDim.w + gapWidth;
        }
      } else {
        // vertical legend
        sectionDim = DvtLegendRenderer._renderVerticalSection(
          legend,
          container,
          sections[i],
          availSpace,
          rowHeight,
          sectionId,
          false
        );
        availSpace.y += sectionDim.h + gapHeight;
        availSpace.h -= sectionDim.h + gapHeight;
      }

      totalDim = totalDim ? totalDim.getUnion(sectionDim) : sectionDim;
    }

    return totalDim;
  },

  /**
   * Creates the legend button.
   * @param {dvt.Context} context
   * @param {Legend} legend
   * @param {object} item The relevant data object for the button peer.
   * @param {object} resources The object containing the button image resources.
   * @param {string} prefix The prefix of the image resource name.
   * @param {number} x The button x position.
   * @param {number} y The button y position.
   * @param {string} tooltip The button tooltip.
   * @param {string} id The button id.
   * @param {function} callback The button callback function.
   * @param {object} callbackObj The button callback object.
   * @return {dvt.IconButton} The button.
   * @private
   */
  _createButton: (
    context,
    legend,
    item,
    resources,
    prefix,
    x,
    y,
    tooltip,
    id,
    callback,
    callbackObj
  ) => {
    var iconStyle = ToolkitUtils.getIconStyle(context, resources[prefix]);
    var button = new IconButton(
      context,
      'borderless',
      { style: iconStyle, size: DvtLegendRenderer._BUTTON_SIZE },
      null,
      id,
      callback,
      callbackObj
    );
    button.setTranslate(x, y);

    var peer = DvtLegendObjPeer.associate([button], legend, item, tooltip, null, false);
    button.setAriaRole('button');
    peer.updateAriaLabel();

    return button;
  },

  /**
   * Renders a vertical legend section.
   * @param {Legend} legend The legend being rendered.
   * @param {dvt.Container} container The container of the section.
   * @param {object} section The section from the options object.
   * @param {dvt.Rectangle} availSpace The available space.
   * @param {Number} rowHeight The height of a row of legend items.
   * @param {Array} id The section id, in the form of section index array. For example, if id=[0,1], then this is
   *  the second nested section of the first section.
   * @param {boolean} minimizeNumRows Whether the number of rows should be minimized.
   * @return {dvt.Rectangle} The total dimension of the section.
   * @private
   */
  _renderVerticalSection: (
    legend,
    container,
    section,
    availSpace,
    rowHeight,
    id,
    minimizeNumRows
  ) => {
    if (!section) return undefined;

    var options = legend.getOptions();
    var symbolGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);
    var rowGap = DvtLegendDefaults.getGapSize(legend, options['layout']['rowGap']);
    var colGap = DvtLegendDefaults.getGapSize(legend, options['layout']['columnGap']);
    var context = legend.getCtx();
    var isRTL = Agent.isRightToLeft(context);
    var hasSections = section['sections'] != null && section['sections'].length > 0;
    var hasItems = section['items'] != null && section['items'].length > 0;

    var sectionSpace = availSpace.clone();
    if (options['scrolling'] != 'off') sectionSpace.h = Infinity;

    // Render collapse button
    var buttonDim;
    var isCollapsible =
      section['collapsible'] === 'on' ||
      (typeof section['collapsible'] === 'boolean' && section['collapsible']);
    var button;
    if (isCollapsible) {
      var buttonX = isRTL
        ? sectionSpace.x + sectionSpace.w - DvtLegendRenderer._BUTTON_SIZE
        : sectionSpace.x;
      if (!options['isLayout']) {
        var isCollapsed = DvtLegendUtils.isSectionCollapsed(section, legend);
        var buttonType = isCollapsed ? 'closed' : 'open';
        var buttonTooltip = options.translations[isCollapsed ? 'tooltipExpand' : 'tooltipCollapse'];
        var em = legend.getEventManager();

        button = DvtLegendRenderer._createButton(
          context,
          legend,
          section,
          options['_resources'],
          buttonType,
          buttonX,
          sectionSpace.y,
          buttonTooltip,
          id,
          em.onCollapseButtonClick,
          em
        );
        container.addChild(button);
      }
      buttonDim = new Rectangle(
        buttonX,
        sectionSpace.y,
        DvtLegendRenderer._BUTTON_SIZE,
        DvtLegendRenderer._BUTTON_SIZE
      );

      // Indent the section
      var buttonGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);
      if (!isRTL) sectionSpace.x += DvtLegendRenderer._BUTTON_SIZE + buttonGap;
      sectionSpace.w -= DvtLegendRenderer._BUTTON_SIZE + buttonGap;
    }

    // Render legend section title. Only support titleHalign if the section is not collapsible and not nested.
    var title = DvtLegendRenderer._renderTitle(
      legend,
      container,
      section['title'],
      sectionSpace,
      section,
      !isCollapsible && id.length <= 1,
      id,
      button
    );
    var sectionSpaceX = isRTL ? sectionSpace.x + sectionSpace.w : sectionSpace.x;
    var titleDim = title
      ? title.getDimensions()
      : new Rectangle(sectionSpaceX, sectionSpace.y, 0, 0);
    var sectionDim = buttonDim ? titleDim.getUnion(buttonDim) : titleDim;

    // See if this is a section group which contains more legend sections
    if ((!hasItems && !hasSections) || DvtLegendUtils.isSectionCollapsed(section, legend))
      return sectionDim;

    // Title+button should always be on its own row
    if (sectionDim.h > 0) {
      var titleGap = DvtLegendDefaults.getGapSize(legend, options['layout']['titleGapHeight']);
      sectionSpace.y += sectionDim.h + titleGap;
      sectionSpace.h -= sectionDim.h + titleGap;
    }

    // Render nested sections
    if (hasSections) {
      var nestedSectionDim = DvtLegendRenderer._renderSections(
        legend,
        container,
        section['sections'],
        sectionSpace,
        id
      );
      sectionDim = sectionDim.getUnion(nestedSectionDim);
    }

    if (!hasItems) return sectionDim;

    // Determine needed cols and rows
    var colInfo = DvtLegendRenderer._calcColumns(
      legend,
      sectionSpace,
      rowHeight,
      section['items'],
      minimizeNumRows
    );
    var numCols = colInfo['numCols'];
    var numRows = colInfo['numRows'];
    var colWidth = colInfo['width'];
    var colInitY = sectionSpace.y; // top y-coord of the columns

    // Don't render if not enough space
    if (numRows == 0 || numCols == 0) return sectionDim;

    var contentHeight = numRows * (rowHeight + rowGap) - rowGap;
    var contentWidth = Math.min(numCols * (colWidth + colGap) - colGap, sectionSpace.w);
    var contentDim = new Rectangle(
      isRTL ? sectionSpace.x + sectionSpace.w - contentWidth : sectionSpace.x,
      sectionSpace.y,
      contentWidth,
      contentHeight
    );
    sectionDim = sectionDim.getUnion(contentDim);

    // No need to render during layout pass
    if (options['isLayout']) return sectionDim;

    // For text truncation
    var textSpace = colWidth - options['symbolWidth'] - symbolGap;

    // Render the items one by one
    var currRow = 0;
    var currCol = 1;
    var numItems = section['items'].length;

    // iterate through items
    for (var i = 0; i < numItems; i++) {
      var item = section['items'][i];
      DvtLegendRenderer._createLegendItem(
        legend,
        container,
        item,
        sectionSpace,
        textSpace,
        rowHeight,
        i
      );

      // Update coordinates for next row
      sectionSpace.y += rowHeight + rowGap;
      currRow++;
      if (currRow === numRows && currCol !== numCols) {
        sectionSpace.y = colInitY;
        sectionSpace.w -= colWidth + colGap;
        if (!isRTL) sectionSpace.x += colWidth + colGap;
        currRow = 0;
        currCol++;
      }

      // End for loop if number of rows possible(numRows) is reached
      if (currRow === numRows) break;
    }

    return sectionDim;
  },

  /**
   * Renders a horizontal legend section.
   * @param {Legend} legend The legend being rendered.
   * @param {dvt.Container} container The container of the section.
   * @param {object} section The section from the options object.
   * @param {dvt.Rectangle} availSpace The available space.
   * @param {number} rowHeight The height of a row of legend items.
   * @return {dvt.Rectangle} The total dimension of the section.
   * @private
   */
  _renderHorizontalSection: (legend, container, section, availSpace, rowHeight) => {
    if (!section) return undefined;

    var options = legend.getOptions();
    var symbolWidth = options['symbolWidth'];
    var symbolGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);
    var colGap = DvtLegendDefaults.getGapSize(legend, options['layout']['columnGap']);
    var titleGap = DvtLegendDefaults.getGapSize(legend, options['layout']['titleGapWidth']);
    var hasItems = section['items'] != null && section['items'].length > 0;
    var isRTL = Agent.isRightToLeft(legend.getCtx());
    var sectionSpace = availSpace.clone();

    // Determine legend section title
    var title = DvtLegendRenderer._renderTitle(
      legend,
      container,
      section['title'],
      availSpace,
      section,
      false
    );
    var availSpaceX = isRTL ? availSpace.x + availSpace.w : availSpace.x;
    var titleDim = title
      ? title.getDimensions()
      : new Rectangle(availSpaceX, availSpace.y, 0, 0);
    if (!hasItems) return titleDim;
    else if (titleDim.w > 0) {
      sectionSpace.w -= titleDim.w + titleGap;
      if (!isRTL) sectionSpace.x += titleDim.w + titleGap;
    }

    // Compute the section width and cache the text widths of the items
    var textWidths = [];
    var totalWidth = availSpace.w - sectionSpace.w;
    var item, textWidth, i;
    var numItems = section['items'].length;
    for (i = 0; i < numItems; i++) {
      item = section['items'][i];
      textWidth = Math.ceil(
        TextUtils.getTextStringWidth(legend.getCtx(), item['text'], options['textStyle'])
      );
      totalWidth += textWidth + symbolWidth + symbolGap + colGap;
      textWidths.push(textWidth);
    }
    if (numItems > 0) totalWidth -= colGap;

    // Don't render during layout pass, or if the totalWidth exceeds the available space
    var sectionDim = new Rectangle(
      isRTL ? availSpace.x + availSpace.w - totalWidth : availSpace.x,
      availSpace.y,
      totalWidth,
      Math.max(rowHeight, titleDim.h)
    );
    if (options['isLayout'] || totalWidth > availSpace.w) {
      container.removeChild(title);
      return sectionDim;
    }

    if (title) {
      // no need to vertically align if there is no title
      legend.getCache().putToCache('horizRowAlign', true);
      legend.getCache().putToCache('sectionRect', sectionDim);

      var dims = title.getDimensions();
      var dy = sectionDim.y + sectionDim.h / 2 - dims.h / 2 - dims.y;
      title.setTranslate(0, dy);
    }

    var colWidth;
    for (i = 0; i < numItems; i++) {
      item = section['items'][i];
      DvtLegendRenderer._createLegendItem(
        legend,
        container,
        item,
        sectionSpace,
        textWidths[i],
        rowHeight,
        i
      );

      colWidth = textWidths[i] + symbolWidth + symbolGap;
      sectionSpace.w -= colWidth + colGap;
      if (!isRTL) sectionSpace.x += colWidth + colGap;
    }
    // Reset cached variables after legend items are created
    legend.getCache().putToCache('horizRowAlign', false);
    legend.getCache().putToCache('sectionRect', null);

    return sectionDim;
  },

  /**
   * Returns the space required for a legend section.
   * @param {Legend} legend The legend being rendered.
   * @param {dvt.Rectangle} availSpace The available space.
   * @param {number} rowHeight The height of a legend row.
   * @param {object} items The legend items to be rendered.
   * @param {boolean} minimizeNumRows Whether the number of rows should be minimized.
   * @return {object} Map containing width, rows and columns in the legend.
   * @private
   */
  _calcColumns: (legend, availSpace, rowHeight, items, minimizeNumRows) => {
    var options = legend.getOptions();

    // Use widest text since using # of chars can be wrong for unicode
    var itemTexts = [];
    for (var i = 0; i < items.length; i++) {
      itemTexts.push(items[i]['text']);
    }
    var textWidth = TextUtils.getMaxTextStringWidth(
      legend.getCtx(),
      itemTexts,
      options['textStyle']
    );

    // Row variables
    var symbolWidth = options['symbolWidth'];
    var symbolGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);
    var rowGap = DvtLegendDefaults.getGapSize(legend, options['layout']['rowGap']);
    var colGap = DvtLegendDefaults.getGapSize(legend, options['layout']['columnGap']);

    var numRows;
    var colWidth;
    var numCols;
    var fullColWidth = Math.ceil(symbolWidth + symbolGap + textWidth);

    if (minimizeNumRows) {
      // For horizontal layouts form as many columns as possible to minimize the height
      numCols = Math.min(
        Math.max(Math.floor((availSpace.w + colGap) / (fullColWidth + colGap)), 1),
        items.length
      ); // Get possible number of cols
      numRows = Math.min(
        Math.floor((availSpace.h + rowGap) / (rowHeight + rowGap)),
        Math.ceil(items.length / numCols)
      );

      // Adjust number of columns and rows to remove unused columns and even out columns
      numCols = Math.ceil(items.length / numRows);
      numRows = Math.ceil(items.length / numCols);
    } else if (availSpace.h == Infinity) {
      // For scrollable legends, don't wrap legend items into more than one column
      numCols = 1;
      numRows = items.length;
    } else {
      // For vertical layouts use full depth and then increase cols as necessary
      numRows = Math.min(Math.floor((availSpace.h + rowGap) / (rowHeight + rowGap)), items.length);
      numCols = Math.ceil(items.length / numRows);
      numRows = Math.ceil(items.length / numCols); // to get columns of roughly equal heights
    }

    var maxColWidth = (availSpace.w - colGap * (numCols - 1)) / numCols;
    colWidth = Math.min(fullColWidth, maxColWidth);

    if (colWidth < symbolWidth) return { width: 0, numCols: 0, numRows: 0 };

    return { width: colWidth, numCols, numRows };
  },

  /**
   * Returns the height of a single item in the legend.
   * @param {Legend} legend The legend being rendered.
   * @return {number} The height of a legend item.
   * @private
   */
  _getRowHeight: (legend) => {
    var options = legend.getOptions();

    // Figure out the legend item height
    var textHeight = TextUtils.getTextStringHeight(legend.getCtx(), options['textStyle']);
    var symbolHeight =
      options['symbolHeight'] +
      DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapHeight']);
    return Math.ceil(Math.max(textHeight, symbolHeight));
  },

  /**
   * Creates a legend item (symbol + text).
   * @param {Legend} legend The legend being rendered.
   * @param {dvt.Container} container The container of the legend item.
   * @param {object} item The item in the options object.
   * @param {dvt.Rectangle} availSpace The available space.
   * @param {number} textSpace The maximum text width.
   * @param {object} rowHeight The height of the legend item.
   * @param {number} i The item index.
   * @private
   */
  _createLegendItem: (legend, container, item, availSpace, textSpace, rowHeight, i) => {
    var options = legend.getOptions();
    var context = legend.getCtx();
    var isRTL = Agent.isRightToLeft(context);
    var symbolWidth = options['symbolWidth'];
    var symbolGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);

    var symbolX = isRTL ? availSpace.x + availSpace.w - symbolWidth : availSpace.x;
    var textX = isRTL
      ? availSpace.x + availSpace.w - symbolWidth - symbolGap
      : availSpace.x + symbolWidth + symbolGap;

    // Create legend marker
    var marker = DvtLegendRenderer._createLegendSymbol(
      legend,
      symbolX,
      availSpace.y,
      rowHeight,
      item,
      i
    );

    // Create legend text
    var label = item['text'];
    var text;
    if (label != null) {
      var style = options['textStyle'];
      text = DvtLegendRenderer._createLegendText(container, textSpace, label, style);
      if (text) {
        text.setX(textX);
        // Maintaining old behaviour for IE since dominant-baseline is buggy. 
        TextUtils.centerTextVertically(text, availSpace.y + rowHeight / 2);
        if (isRTL) text.alignRight();
      }

      // Vertically center the legend title and legend items of the horizontal section
      var sectionRect = legend.getCache().getFromCache('sectionRect');
      if (
        legend.getCache().getFromCache('horizRowAlign') &&
        sectionRect &&
        options['orientation'] != 'vertical'
      ) {
        var textH = text.getDimensions().h;
        var dy =
          sectionRect.y +
          sectionRect.h / 2 -
          Math.max(options['symbolHeight'], textH) / 2 -
          availSpace.y;
        marker.setTranslate(0, dy);
        text.setTranslate(0, dy);
      }
    }

    // Add legend marker to legend. Legend text has been added by _createLegendText.
    container.addChild(marker);

    // Draw a rectangle on top of the legend item.  This rectangle is used for interactivity and to ensure that
    // rollover is smooth when moving across legend items.
    var itemRect = new Rect(
      context,
      isRTL
        ? textX - textSpace - DvtLegendRenderer._FOCUS_GAP
        : symbolX - DvtLegendRenderer._FOCUS_GAP,
      availSpace.y - DvtLegendRenderer._FOCUS_GAP,
      symbolWidth + symbolGap + textSpace + 2 * DvtLegendRenderer._FOCUS_GAP,
      rowHeight + 2 * DvtLegendRenderer._FOCUS_GAP
    );
    itemRect.setInvisibleFill();
    var hideAndShow = options['hideAndShowBehavior'];
    if (hideAndShow != 'none' && hideAndShow != 'off') itemRect.setCursor('pointer');

    container.addChild(itemRect);

    // Associate for interactivity.
    var displayables = [itemRect, marker];
    if (text != null) displayables.push(text);

    var peer = DvtLegendObjPeer.associate(
      displayables,
      legend,
      item,
      text != null ? text.getUntruncatedTextString() : null,
      item['shortDesc'],
      DvtLegendRenderer._isItemDrillable(legend, item)
    );

    if (DvtLegendUtils.isCategoryHidden(DvtLegendUtils.getItemCategory(item, legend), legend)) {
      marker.setHollow(peer.getColor());
      // Don't apply style and className
      marker.setStyle().setClassName();
    }

    if ((hideAndShow != 'none' && hideAndShow != 'off') || item['shortDesc'] != null) {
      itemRect.setAriaRole('img');
      peer.updateAriaLabel();
    }
  },

  /**
   * Returns whether the item is drillable.
   * @param {Legend} legend
   * @param {Object} item
   * @return {boolean}
   * @private
   */
  _isItemDrillable: (legend, item) => {
    if (item['drilling'] == 'on') return true;
    if (item['drilling'] == 'off') return false;

    return legend.getOptions()['drilling'] == 'on';
  },

  /**
   * Creates a legend text. Adds the text to the legend if it's not empty.
   * @param {dvt.Container} container The text container.
   * @param {number} textSpace The width allowed for text.
   * @param {String} label The content of the text object.
   * @param {String} style The CSS style string to apply to the text object.
   * @return {dvt.Text}
   * @private
   */
  _createLegendText: (container, textSpace, label, style) => {
    // Draw the legend text.
    var text = new OutputText(container.getCtx(), label);
    text.setCSSStyle(style);
    text = TextUtils.fitText(text, textSpace, Infinity, container) ? text : null;
    return text;
  },

  /**
   * Creates a legend symbol.
   * @param {Legend} legend The legend being rendered.
   * @param {number} x The x coordinate of the legend symbol.
   * @param {number} y The y coordinate of the legend symbol.
   * @param {number} rowHeight The height of the legend item.
   * @param {object} item The data for the legend item.
   * @param {number} i The index of the legend item. Used for determining the default color.
   * @return {dvt.Shape}
   * @private
   */
  _createLegendSymbol: (legend, x, y, rowHeight, item, i) => {
    // Apply the default styles
    var legendOptions = legend.getOptions();
    var context = legend.getCtx();
    var symbolType = item['type'] != null ? item['type'] : item['symbolType'];

    if (!item['markerShape']) item['markerShape'] = legendOptions['_markerShape'];

    if (!item['color']) item['color'] = legendOptions['_color'];

    if (!item['lineWidth'])
      item['lineWidth'] =
        symbolType == 'lineWithMarker'
          ? DvtLegendRenderer._DEFAULT_LINE_WIDTH_WITH_MARKER
          : legendOptions['_lineWidth'];

    var symbolWidth = legendOptions['symbolWidth'];
    var symbolHeight = legendOptions['symbolHeight'];

    // Find the center of the markers
    var cy = y + rowHeight / 2;
    var cx = x + symbolWidth / 2;

    var symbol;
    if (symbolType == 'line') {
      symbol = DvtLegendRenderer._createLine(context, x, y, symbolWidth, rowHeight, item);
    } else if (symbolType == 'lineWithMarker') {
      symbol = DvtLegendRenderer._createLine(context, x, y, symbolWidth, rowHeight, item);

      // only if not found in hiddenCategories
      if (!DvtLegendUtils.isCategoryHidden(DvtLegendUtils.getItemCategory(item, legend), legend))
        symbol.addChild(
          DvtLegendRenderer._createMarker(
            legend,
            cx,
            cy,
            symbolWidth * DvtLegendRenderer._LINE_MARKER_SIZE_FACTOR,
            symbolHeight * DvtLegendRenderer._LINE_MARKER_SIZE_FACTOR,
            item
          )
        );
    } else if (symbolType == 'image') {
      symbol = DvtLegendRenderer._createImage(
        legend,
        x,
        y,
        symbolWidth,
        symbolHeight,
        rowHeight,
        item
      );
    } else if (symbolType == '_verticalBoxPlot') {
      symbolHeight = Math.max(Math.round(symbolHeight / 4) * 4, 4); // must be an integer multiple of 4 to ensure perfect rendering
      symbol = new Container(context);
      symbol.addChild(
        DvtLegendRenderer._createMarker(
          legend,
          cx,
          cy + symbolHeight / 4,
          symbolWidth,
          symbolHeight / 2,
          DvtLegendRenderer._getBoxPlotOptions(item, 'q2')
        )
      );
      symbol.addChild(
        DvtLegendRenderer._createMarker(
          legend,
          cx,
          cy - symbolHeight / 4,
          symbolWidth,
          symbolHeight / 2,
          DvtLegendRenderer._getBoxPlotOptions(item, 'q3')
        )
      );
    } else if (symbolType == '_horizontalBoxPlot') {
      var isRTL = Agent.isRightToLeft(context);
      symbolWidth = Math.max(Math.round(symbolWidth / 4) * 4, 4); // must be an integer multiple of 4 to ensure perfect rendering
      var xOffset = (symbolWidth / 4) * (isRTL ? 1 : -1);
      symbol = new Container(context);
      symbol.addChild(
        DvtLegendRenderer._createMarker(
          legend,
          cx + xOffset,
          cy,
          symbolWidth / 2,
          symbolHeight,
          DvtLegendRenderer._getBoxPlotOptions(item, 'q2')
        )
      );
      symbol.addChild(
        DvtLegendRenderer._createMarker(
          legend,
          cx - xOffset,
          cy,
          symbolWidth / 2,
          symbolHeight,
          DvtLegendRenderer._getBoxPlotOptions(item, 'q3')
        )
      );
    } else {
      symbol = DvtLegendRenderer._createMarker(legend, cx, cy, symbolWidth, symbolHeight, item);
    }
    return symbol;
  },

  /**
   * Creates a image symbol
   * @param {Legend} legend The legend being rendered.
   * @param {number} x The x coordinate of the legend symbol.
   * @param {number} y The y coordinate of the legend symbol.
   * @param {number} symbolWidth Image width.
   * @param {number} symbolHeight Image height.
   * @param {number} rowHeight Height of row (impacted by font size).
   * @param {object} item The data for the legend item.
   * @return {dvt.ImageMarker}
   * @private
   */
  _createImage: (legend, x, y, symbolWidth, symbolHeight, rowHeight, item) => {
    var context = legend.getCtx();

    var imageY = y + rowHeight / 2;
    var imageX = x + symbolWidth / 2;

    return new ImageMarker(
      context,
      imageX,
      imageY,
      symbolWidth,
      symbolHeight,
      null,
      item['source']
    );
  },

  /**
   * Creates a marker symbol.
   * @param {Legend} legend The legend being rendered.
   * @param {number} cx The x coordinate of the legend symbol.
   * @param {number} cy The y coordinate of the legend symbol.
   * @param {number} symbolWidth The column width allocated to the legend symbol.
   * @param {number} symbolHeight The height of the legend item.
   * @param {object} item The data for the legend item.
   * @return {dvt.SimpleMarker}
   * @private
   */
  _createMarker: (legend, cx, cy, symbolWidth, symbolHeight, item) => {
    var context = legend.getCtx();

    // Find the style values
    var shape = item['markerShape'];
    var isLineWithMarker = item['symbolType'] && item['symbolType'] == 'lineWithMarker';
    var color = isLineWithMarker && item['markerColor'] ? item['markerColor'] : item['color'];
    var style =
      item['markerStyle'] || item['markerSvgStyle']
        ? item['markerStyle'] || item['markerSvgStyle']
        : item['style'] || item['svgStyle'];
    var className =
      item['markerClassName'] || item['markerSvgClassName']
        ? item['markerClassName'] || item['markerSvgClassName']
        : item['className'] || item['svgClassName'];
    var pattern = item['pattern'];

    var legendMarker;
    if (pattern && pattern != 'none') {
      // Pattern markers must be translated, since the pattern starts at the origin of the shape
      legendMarker = new SimpleMarker(
        context,
        shape,
        0,
        0,
        symbolWidth,
        symbolHeight,
        null,
        null,
        true
      );
      legendMarker.setFill(new PatternFill(pattern, color, '#FFFFFF'));
      legendMarker.setTranslate(cx, cy);
    } else {
      legendMarker = new SimpleMarker(
        context,
        shape,
        cx,
        cy,
        symbolWidth,
        symbolHeight,
        null,
        null,
        true
      );
      legendMarker.setSolidFill(color);
    }

    if (item['borderColor']) {
      var borderWidth = item['_borderWidth'] ? item['_borderWidth'] : 1;
      legendMarker.setSolidStroke(item['borderColor'], null, borderWidth);
    }

    // Use pixel hinting for crisp squares
    if (shape == 'square' || shape == 'rectangle') legendMarker.setPixelHinting(true);

    legendMarker.setClassName(className).setStyle(style);

    return legendMarker;
  },

  /**
   * Creates a line symbol.
   * @param {dvt.Context} context The context in which to create the legend item.
   * @param {number} x The x coordinate of the legend symbol.
   * @param {number} y The y coordinate of the legend symbol.
   * @param {number} colWidth The column width allocated to the legend symbol.
   * @param {number} rowHeight The height of the legend item.
   * @param {object} item The data for the legend item.
   * @return {dvt.Line}
   * @private
   */
  _createLine: (context, x, y, colWidth, rowHeight, item) => {
    var lineY = y + rowHeight / 2;
    // For type lineWithMarker, marker parameters cx, cy, symbolHeight and symbolWidth are rounded up.
    // To make everything symmetrical, we round line parameters as well.
    colWidth = colWidth % 2 == 1 ? colWidth + 1 : colWidth; // colWidth is even-ed to make up for the rounding of cx in marker for lineWithMarker types.
    var line = new Line(context, x, Math.round(lineY), x + colWidth, Math.round(lineY));

    // Set the line style. The size and the spacing of the dash/dot has to be shrunk so that it's readable inside the 10px box.
    var style = item['lineStyle'];
    var dashProps;
    if (style == 'dashed') dashProps = { dashArray: '4,2,4' };
    else if (style == 'dotted') dashProps = { dashArray: '2' };

    var stroke = new Stroke(item['color'], 1, item['lineWidth'], false, dashProps);

    // set custom style and class
    line
      .setClassName(item['className'] || item['svgClassName'])
      .setStyle(item['style'] || item['svgStyle']);

    line.setStroke(stroke);
    line.setPixelHinting(true);

    return line;
  },

  /**
   * Return the item options for the half-shape of box plot symbol.
   * @param {object} item The legend item options
   * @param {string} prefix 'q2' or 'q3'
   * @return {object}
   * @private
   */
  _getBoxPlotOptions: (item, prefix) => {
    return {
      markerShape: 'rectangle',
      color: item['_boxPlot'][prefix + 'Color'],
      pattern: item['_boxPlot']['_' + prefix + 'Pattern'],
      className:
        item['_boxPlot'][prefix + 'ClassName'] || item['_boxPlot'][prefix + 'svgClassName'],
      style: item['_boxPlot'][prefix + 'Style'] || item['_boxPlot'][prefix + 'svgStyle']
    };
  }
};

/**
 * Legend component.  This class should never be instantiated directly.  Use the
 * newInstance function instead.
 * @class
 * @constructor
 * @extends {dvt.BaseComponent}
 */
class Legend extends BaseComponent {
  /**
   * @override
   * @protected
   */
  constructor(context, callback, callbackObj) {
    super(context, callback, callbackObj);
    this.setId('legend' + 1000 + Math.floor(Math.random() * 1000000000)); //@RandomNumberOK
    // Create the defaults object
    this.Defaults = new DvtLegendDefaults(context);

    // Create the event handler and add event listeners
    this.EventManager = new DvtLegendEventManager(this);
    this.EventManager.addListeners(this);

    /**
     * The array of logical objects that corresponds to legend items.
     * @private
     */
    this._peers = [];
    /**
     * The array of logical objects that corresponds to section collapse buttons or legend items that are navigable.
     * @private
     */
    this._navigablePeers = [];
    /**
     * The object that stores the bounds for this legend
     * @private
     */
    this._bounds = null;
    /**
     * The object that stores the title objects for this legend
     * @private
     */
    this._titles = [];
  }
  /**
   * Returns a copy of the default options for the specified skin.
   * @param {string} skin The skin whose defaults are being returned.
   * @return {object} The object containing defaults for this component.
   */
  static getDefaults(skin) {
    return new DvtLegendDefaults().getDefaults(skin);
  }

  /**
   * @override
   */
  SetOptions(options) {
    super.SetOptions(options);
    if (options) {
      // Combine the user options with the defaults and store
      this.Options = this.Defaults.calcOptions(options);

      // Transfer the category visibility properties to the hiddenCategories.
      this._transferVisibilityProps(this.Options['sections']);
    } else if (!this.Options)
      // Create a default options object if none has been specified
      this.Options = this.GetDefaults();
  }

  /**
   * Returns the preferred dimensions for this component given the maximum available space.
   * @param {object} options The object containing specifications and data for this component.
   * @param {Number} maxWidth The maximum width available.
   * @param {Number} maxHeight The maximum height available.
   * @return {dvt.Dimension} The preferred dimensions for the object.
   */
  getPreferredSize(options, maxWidth, maxHeight) {
    // Update the options object.
    this.SetOptions(options);

    // Set the layout flag to indicate this is a layout pass only
    this.getOptions()['isLayout'] = true;

    // Ask the legend to render its contents in the max space and find the space used.
    var availSpace = new Rectangle(0, 0, maxWidth, maxHeight);
    var dim = DvtLegendRenderer.render(this, availSpace);

    // Clear the rendered contents and reset state
    this.getOptions()['isLayout'] = false;

    // Return the space used
    return new Dimension(dim.w, dim.h);
  }

  /**
   * @override
   */
  render(options, width, height) {
    this.getCache().clearCache();

    // Update the options object if provided.
    this.SetOptions(options);

    // Update the width and height if provided.
    if (!isNaN(width) && !isNaN(height)) {
      this.Width = width;
      this.Height = height;
    }

    // Set the render flag to indicate we are rendering. Not being read correctly in flash - 
    this.getOptions()['isLayout'] = false;

    // Clear any contents rendered previously
    var childCount = this.getNumChildren();
    for (var childIndex = 0; childIndex < childCount; childIndex++) {
      var child = this.getChildAt(childIndex);
      child.destroy();
    }

    this.removeChildren();
    this._peers = [];
    this._navigablePeers = [];
    this._bounds = null;
    this._titles = [];

    // Set up keyboard handler on non-touch devices if the legend is interactive
    if (!Agent.isTouchDevice())
      this.EventManager.setKeyboardHandler(new DvtLegendKeyboardHandler(this.EventManager, this));

    this.UpdateAriaAttributes();

    // Render the legend
    var availSpace = new Rectangle(0, 0, this.Width, this.Height);
    this._contentDimensions = DvtLegendRenderer.render(this, availSpace);

    // Process highlightedCategories
    var highlightedCategories = this.getOptions()['highlightedCategories'];
    if (highlightedCategories && highlightedCategories.length > 0)
      this.highlight(highlightedCategories);

    this.RenderComplete();
    return this._contentDimensions;
  }

  /**
   * @override
   */
  highlight(categories) {
    // Update the options. Legend checks for any category instead of all, so we need to convert empty to null.
    this.getOptions()['highlightedCategories'] =
      categories && categories.length > 0 ? categories.slice() : null;

    // Perform the highlighting
    CategoryRolloverHandler.highlight(categories, this.__getObjects(), true);
  }

  /**
   * Processes the specified event.
   * @param {object} event
   * @param {object} source The component that is the source of the event, if available.
   */
  processEvent(event, source) {
    var type = event['type'];
    if (type == 'categoryHighlight') {
      if (this.getOptions()['hoverBehavior'] == 'dim') {
        var peers = this.__getObjects();

        // If the legend is not the source of the event, perform highlighting.
        if (this != source) this.highlight(event['categories']);

        for (var i = 0; i < peers.length; i++) {
          if (Obj.compareValues(this.getCtx(), peers[i].getId(), event['categories'])) {
            this.container.scrollIntoView(peers[i].getDisplayables()[0]);
            break;
          }
        }
      }
    }

    // Dispatch the event to the callback if it originated from this component.
    if (this == source) {
      this.dispatchEvent(event);
    }
  }

  /**
   * Registers the object peer with the legend.  The peer must be registered to participate
   * in interactivity.
   * @param {DvtLegendObjPeer} peer
   */
  __registerObject(peer) {
    if (peer.getDisplayables()[0] instanceof IconButton)
      this._navigablePeers.push(peer); // peer is navigable if associated with button
    else {
      // peer is navigable if associated with legend item using datatip, action, drilling, or hideShow is enabled
      var hideAndShow = this.getOptions()['hideAndShowBehavior'];
      if (
        peer.getDatatip() != null ||
        peer.isDrillable() ||
        (hideAndShow != 'none' && hideAndShow != 'off')
      )
        this._navigablePeers.push(peer);

      this._peers.push(peer);
    }
  }

  /**
   * Returns the peers for all objects within the legend.
   * @return {array}
   */
  __getObjects() {
    return this._peers;
  }

  /**
   * Returns the keyboard navigables within the legend.
   * @return {array}
   */
  __getKeyboardObjects() {
    return this._navigablePeers;
  }

  /**
   * Stores the bounds for this legend
   * @param {Object} bounds
   */
  __setBounds(bounds) {
    this._bounds = bounds.clone();
  }

  /**
   * Returns the bounds for this legend
   * @return {Object} the object containing the bounds for this legend
   */
  __getBounds() {
    return this._bounds;
  }

  /**
   * Adds a title object to be stored by the legend
   * @param {object} title An object containing the text and the alignment
   */
  __registerTitle(title) {
    this._titles.push(title);
  }

  /**
   * Returns the title objects for this legend
   * @return {array} An array containing the title objects for this legend
   */
  __getTitles() {
    return this._titles;
  }

  /**
   * Returns the automation object for this chart
   * @return {dvt.Automation} The automation object
   */
  getAutomation() {
    return new DvtLegendAutomation(this);
  }

  /**
   * Returns the keyboard-focused object of the legend
   * @return {DvtKeyboardNavigable} The focused object.
   */
  getKeyboardFocus() {
    if (this.EventManager != null) return this.EventManager.getFocus();
    return null;
  }

  /**
   * Sets the navigable as the keyboard-focused object of the legend. It matches the id in case the legend
   * has been rerendered.
   * @param {DvtKeyboardNavigable} navigable The focused object.
   * @param {boolean} isShowingFocusEffect Whether the keyboard focus effect should be used.
   */
  setKeyboardFocus(navigable, isShowingFocusEffect) {
    if (this.EventManager == null) return;

    var peers = this.__getKeyboardObjects();
    for (var i = 0; i < peers.length; i++) {
      if (Obj.compareValues(this.getCtx(), peers[i].getId(), navigable.getId())) {
        this.EventManager.setFocusObj(peers[i]);
        if (isShowingFocusEffect) peers[i].showKeyboardFocusEffect();
        break;
      }
    }

    // Update the accessibility attributes
    var focus = this.getKeyboardFocus();
    if (focus) {
      var displayable = focus.getDisplayables()[0];
      displayable.setAriaProperty('label', focus.getAriaLabel());
      this.getCtx().setActiveElement(displayable);
    }
  }

  /**
   * @override
   */
  getDimensions(targetCoordinateSpace) {
    var bounds = new Rectangle(0, 0, this.Width, this.Height);
    if (!targetCoordinateSpace || targetCoordinateSpace === this) return bounds;
    else {
      // Calculate the bounds relative to the target space
      return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
    }
  }

  /**
   * Transfer categoryVisibility property from legend item to hiddenCategories on the legend.
   * @param {array} sections The array of legend section definitions
   * @private
   */
  _transferVisibilityProps(sections) {
    if (!sections || sections.length <= 0) return;

    var hiddenCategories = this.getOptions()['hiddenCategories'];
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];

      // If this section has nested sections, recurse.
      if (section['sections']) this._transferVisibilityProps(section['sections']);

      // Iterate through the items and transfer properties.
      var items = section['items'];
      if (!items || items.length <= 0) continue;

      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        var itemCategory = DvtLegendUtils.getItemCategory(item, this);

        if (item['categoryVisibility'] == 'hidden' && hiddenCategories.indexOf(itemCategory) < 0)
          hiddenCategories.push(itemCategory);

        item['categoryVisibility'] = null;
      }
    }
  }

  /**
   * @override
   */
  UpdateAriaAttributes() {
    if (this.IsParentRoot()) {
      var options = this.getOptions();
      var translations = options.translations;
      var hideAndShow = options['hideAndShowBehavior'];
      if ((hideAndShow != 'off' && hideAndShow != 'none') || options['hoverBehavior'] == 'dim') {
        this.getCtx().setAriaRole('application');
        this.getCtx().setAriaLabel(
          ResourceUtils.format(translations.labelAndValue, [
            translations.labelDataVisualization,
            AriaUtils.processAriaLabel(this.GetComponentDescription())
          ])
        );
      }
    }
  }

  /**
   * Returns whether or not the legend has navigable peers
   * @return {boolean}
   */
  isNavigable() {
    return this._navigablePeers.length > 0;
  }

  /**
   * Returns the number of items in the section
   * @param {object} section
   * @return {Number} number of items in section
   */
  static getSectionItemsCount(section) {
    var itemsCount = 0;
    if (section.items) {
      itemsCount += section.items.length;
    }
    if (section.sections) {
      var sections = section.sections;
      for (var i = 0; i < sections.length; i++) {
        itemsCount += Legend.getSectionItemsCount(sections[i]);
      }
    }
    return itemsCount;
  }
}

export { Legend };
