/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit'], function (exports, dvt) { 'use strict';

  /**
   * @param {PictoChart} picto
   * @param {number} cx  The x position of the center of the marker.
   * @param {number} cy  The y position of the center of the marker.
   * @param {number} width  The width of the marker.
   * @param {number} height  The height of the marker.
   * @param {String} source Image URI for the default state.
   * @param {String} sourceSelected Image URI for the selected state.
   * @param {String} sourceHover Image URI for the hover state.
   * @param {String} sourceHoverSelected Image URI for the hover selected state.
   * @param {String} id The id of the marker.
   * @extends {dvt.ImageMarker}
   * @constructor
   */
  class DvtPictoChartImageMarker extends dvt.ImageMarker {
    constructor(
      picto,
      cx,
      cy,
      width,
      height,
      source,
      sourceSelected,
      sourceHover,
      sourceHoverSelected,
      id
    ) {
      super(
        picto.getCtx(),
        cx,
        cy,
        width,
        height,
        null,
        source,
        sourceSelected,
        sourceHover,
        sourceHoverSelected,
        id
      );
      this._picto = picto;
    }

    //---------------------------------------------------------------------//
    // Animation support: dvt.DataAnimationHandler                          //
    //---------------------------------------------------------------------//

    /**
     * @override
     */
    animateUpdate(handler, oldMarker) {
      var animation = new dvt.CustomAnimation(this.getCtx(), this, this._picto.getAnimDur() * 0.75);
      var animator = animation.getAnimator();

      // Position and size animation
      var endParams = this._getAnimParams();
      this._setAnimParams(oldMarker._getAnimParams());
      animator.addProp(
        dvt.Animator.TYPE_NUMBER_ARRAY,
        this,
        this._getAnimParams,
        this._setAnimParams,
        endParams
      );

      // Hide old item
      oldMarker.setAlpha(0);

      handler.add(animation, 1);
    }

    /**
     * @override
     */
    animateDelete(handler) {
      handler.add(new dvt.AnimFadeOut(this.getCtx(), this, this._picto.getAnimDur() * 0.5), 0);
    }

    /**
     * @override
     */
    animateInsert(handler) {
      this.setAlpha(0);
      handler.add(new dvt.AnimFadeIn(this.getCtx(), this, this._picto.getAnimDur() * 0.5), 2);
    }

    /**
     * Returns the animation params.
     * @return {Array}
     * @private
     */
    _getAnimParams() {
      return [this.getCx(), this.getCy(), this.getWidth(), this.getHeight()];
    }

    /**
     * Sets the animation params.
     * @param {Array} params
     * @private
     */
    _setAnimParams(params) {
      this.setCx(params[0]);
      this.setCy(params[1]);
      this.setWidth(params[2]);
      this.setHeight(params[3]);
    }
  }

  /**
   *  @param {DvtPictoChart} picto
   *  @param {String} shape Marker shape.
   *  @param {number} cx The x position of the center of the marker.
   *  @param {number} cy The y position of the center of the marker.
   *  @param {number} width The width of the marker.
   *  @param {number} height The height of the marker.
   *  @param {String} id The id of the marker.
   *  @extends {dvt.SimpleMarker}
   *  @constructor
   */
  class DvtPictoChartShapeMarker extends dvt.SimpleMarker {
    constructor(picto, shape, cx, cy, width, height, id) {
      super(
        picto.getCtx(),
        shape === 'none' ? null : shape,
        cx,
        cy,
        width,
        height,
        null,
        true,
        true,
        id
      );
      this._picto = picto;
    }

    //---------------------------------------------------------------------//
    // Animation support: dvt.DataAnimationHandler                          //
    //---------------------------------------------------------------------//

    /**
     * @override
     */
    animateUpdate(handler, oldMarker) {
      var animation = new dvt.CustomAnimation(this.getCtx(), this, this._picto.getAnimDur() * 0.75);
      var animator = animation.getAnimator();

      // Color animation
      var endFill = this.getFill();
      var startFill = oldMarker.getFill();
      if (!startFill.equals(endFill)) {
        this.setFill(startFill);
        animator.addProp(dvt.Animator.TYPE_FILL, this, this.getFill, this.setFill, endFill);
      }

      // Position and size animation
      var endParams = this._getAnimParams();
      this._setAnimParams(oldMarker._getAnimParams());
      animator.addProp(
        dvt.Animator.TYPE_NUMBER_ARRAY,
        this,
        this._getAnimParams,
        this._setAnimParams,
        endParams
      );

      // Hide old item
      oldMarker.setAlpha(0);

      handler.add(animation, 1);
    }

    /**
     * @override
     */
    animateDelete(handler) {
      handler.add(new dvt.AnimFadeOut(this.getCtx(), this, this._picto.getAnimDur() * 0.5), 0);
    }

    /**
     * @override
     */
    animateInsert(handler) {
      this.setAlpha(0);
      handler.add(new dvt.AnimFadeIn(this.getCtx(), this, this._picto.getAnimDur() * 0.5), 2);
    }

    /**
     * Returns the animation params.
     * @return {Array}
     * @private
     */
    _getAnimParams() {
      return [this.getCx(), this.getCy(), this.getWidth(), this.getHeight()];
    }

    /**
     * Sets the animation params.
     * @param {Array} params
     * @private
     */
    _setAnimParams(params) {
      this.setCenter(params[0], params[1]).setSize(params[2], params[3]);
    }

    /**
     * @override
     */
    setDataColor(dataColor, bSkipStroke) {
      var isRedwood = this.getCtx().getThemeBehavior() === 'redwood';
      if (isRedwood) {
        this._dataColor = dataColor;
        if (!bSkipStroke) {
          var hoverColor = dataColor;
          var innerColor = this._picto.getOptions()['_innerColor'];
          var outerColor = this._picto.getOptions()['_outerColor'];

          this.setHoverStroke(
            new dvt.Stroke(innerColor, 1, 1.5, true),
            new dvt.Stroke(hoverColor, 1, 4.5, true)
          );
          this.setSelectedStroke(
            new dvt.Stroke(innerColor, 1, 1.5, true),
            new dvt.Stroke(outerColor, 1, 4.5, true)
          );
          this.setSelectedHoverStroke(
            new dvt.Stroke(innerColor, 1, 1.5, true),
            new dvt.Stroke(outerColor, 1, 4.5, true)
          );
        }
      } else {
        super.setDataColor(dataColor, bSkipStroke);
      }
    }
  }

  /**
   * Utility functions for PictoChart.
   * @class
   */
  const DvtPictoChartUtils = {
    /**
     * Returns whether the pictoChart is vertical.
     * @param {PictoChart} picto
     * @return {boolean}
     */
    isVertical: (picto) => {
      return picto.getOptions()['layout'] === 'vertical';
    },

    /**
     * Returns whether the pictoChart is layout from bottom to top.
     * @param {PictoChart} picto
     * @return {boolean}
     */
    isOriginBottom: (picto) => {
      var origin = picto.getOptions()['layoutOrigin'];
      return origin === 'bottomStart' || origin === 'bottomEnd';
    },

    /**
     * Returns whether the pictoChart is layout from right to left.
     * @param {PictoChart} picto
     * @return {boolean}
     */
    isOriginRight: (picto) => {
      var origin = picto.getOptions()['layoutOrigin'];
      var isEnd = origin === 'topEnd' || origin === 'bottomEnd';
      return dvt.Agent.isRightToLeft(picto.getCtx()) ? !isEnd : isEnd;
    }
  };

  /**
   * @param {DvtPictoChartEventManager} eventManager The owning event manager.
   * @class DvtPictoChartKeyboardHandler
   * @extends {dvt.KeyboardHandler}
   * @constructor
   */
  class DvtPictoChartKeyboardHandler extends dvt.KeyboardHandler {
    /**
     * @override
     */
    isSelectionEvent(event) {
      return this.isNavigationEvent(event) && !event.ctrlKey;
    }

    /**
     * @override
     */
    isMultiSelectEvent(event) {
      return event.keyCode === dvt.KeyboardEvent.SPACE && event.ctrlKey;
    }

    /**
     * Finds next navigable item based on direction.
     * @param {dvt.PictoChart} picto The component.
     * @param {DvtKeyboardNavigable} currentNavigable The navigable item with current focus.
     * @param {dvt.KeyboardEvent} event The keyboard event.
     * @param {DvtKeyboardNavigable=} originalNavigable The original item that initaited navigation.
     * @return {DvtKeyboardNavigable} The next navigable.
     */
    static getNextNavigable(picto, currentNavigable, event, originalNavigable) {
      var navigableItems = picto.getItems();

      if (!originalNavigable) originalNavigable = currentNavigable;

      // Handle edge cases where shape==none is the first or last item
      if (currentNavigable.getShape() === 'none' && currentNavigable !== originalNavigable) {
        var currentIdx = navigableItems.indexOf(currentNavigable);
        if (currentIdx === 0 || currentIdx === navigableItems.length - 1) return originalNavigable;
      }

      var isOriginRight = DvtPictoChartUtils.isOriginRight(picto);
      var isOriginBottom = DvtPictoChartUtils.isOriginBottom(picto);
      var isVertical = DvtPictoChartUtils.isVertical(picto);
      var nextItem = currentNavigable; // Set it by default to the current item

      var isForward =
        (event.keyCode === dvt.KeyboardEvent.LEFT_ARROW && isOriginRight) ||
        (event.keyCode === dvt.KeyboardEvent.RIGHT_ARROW && !isOriginRight) ||
        (event.keyCode === dvt.KeyboardEvent.UP_ARROW && isOriginBottom) ||
        (event.keyCode === dvt.KeyboardEvent.DOWN_ARROW && !isOriginBottom);

      var isDirectional =
        (event.keyCode === dvt.KeyboardEvent.LEFT_ARROW && isVertical) ||
        (event.keyCode === dvt.KeyboardEvent.RIGHT_ARROW && isVertical) ||
        (event.keyCode === dvt.KeyboardEvent.UP_ARROW && !isVertical) ||
        (event.keyCode === dvt.KeyboardEvent.DOWN_ARROW && !isVertical);

      var nextIdx = navigableItems.indexOf(currentNavigable) + (isForward ? 1 : -1);

      if (isDirectional)
        nextItem = dvt.KeyboardHandler.getNextNavigable(currentNavigable, event, navigableItems);
      else if (nextIdx < navigableItems.length && nextIdx >= 0) nextItem = navigableItems[nextIdx];

      if (nextItem.getShape() === 'none') {
        // Recurse till next item in that direction that is not shape==none is found
        if (nextItem !== currentNavigable)
          nextItem = DvtPictoChartKeyboardHandler.getNextNavigable(
            picto,
            nextItem,
            event,
            originalNavigable
          );
        // Handle edge case where shape==none is on the border
        else nextItem = originalNavigable;
      }
      return nextItem;
    }

    /**
     * @override
     */
    processKeyDown(event) {
      var currentNavigable = this._eventManager.getFocus();
      if (currentNavigable && event.keyCode === dvt.KeyboardEvent.ENTER) {
        this._eventManager.processDrillEvent(currentNavigable);
        dvt.EventManager.consumeEvent(event);
        return currentNavigable;
      } else return super.processKeyDown(event);
    }
  }

  /**
   * PictoChartItem
   * @param {PictoChart} picto
   * @param {object} item The option object of the pictoChart item
   * @class
   * @constructor
   * @implements {DvtCategoricalObject}
   * @implements {DvtLogicalObject}
   * @implements {DvtSelectable}
   * @implements {DvtTooltipSource}
   * @implements {DvtKeyboardNavigable}
   */
  class DvtPictoChartItem extends dvt.Container {
    /**
     * @param {PictoChart} picto
     * @param {object} item The option object of the pictoChart item
     * @override
     */
    constructor(picto, item) {
      super(picto.getCtx(), null, item['id']);
      this._picto = picto;
      this._item = item;
      var itemName = item['name'] != null ? item['name'] : '_defaultId' + DvtPictoChartItem._counter;
      this._id = item['id'] != null ? item['id'] : itemName;
      DvtPictoChartItem._counter++;

      this._isNoneShape = item['shape'] === 'none';
      this._isSelected = false;
      this._isShowingKeyboardFocusEffect = false;
      this._keyboardTooltipLocation = new dvt.Point(0, 0);

      // Apply the selecting cursor if selectable or drillable
      if (this.isSelectable() || this.isDrillable())
        this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

      // Associate using the event manager
      picto.getEventManager().associate(this, this);
    }

    /**
     * Returns the column span of the item.
     * @return {number}
     */
    getColSpan() {
      var colSpan = this._item['columnSpan'];
      return colSpan != null && colSpan >= 0 ? Math.round(colSpan) : 1;
    }

    /**
     * Returns the row span of the item.
     * @return {number}
     */
    getRowSpan() {
      var rowSpan = this._item['rowSpan'];
      return rowSpan != null && rowSpan >= 0 ? Math.round(rowSpan) : 1;
    }

    /**
     * Returns the count of the item.
     * @return {number}
     */
    getCount() {
      var count = this._item['count'];
      return count != null ? Math.max(count, 0) : 1;
    }

    /**
     * Returns the shape of the item.
     * @return {string}
     */
    getShape() {
      return this._item['shape'] || this._picto.getOptions()['_defaultShape'];
    }

    /**
     * Returns the color of the item.
     * @return {string}
     */
    getColor() {
      if (this._isNoneShape) return this._picto.getOptions()['_noneShapeColor'];
      return this._item['color'] || this._picto.getOptions()['_defaultColor'];
    }

    /**
     * Returns the border color of the item.
     * @return {string}
     */
    getBorderColor() {
      return this._item['borderColor'];
    }

    /**
     * Returns the border width of the item.
     * @return {number}
     */
    getBorderWidth() {
      return this._item['borderWidth'];
    }

    /**
     * Returns the class name of the item.
     * @return {string}
     */
    getClassName() {
      return this._item['className'] || this._item['svgClassName'];
    }

    /**
     * Returns the style object of the item.
     * @return {object}
     */
    getStyle() {
      return this._item['style'] || this._item['svgStyle'];
    }

    /**
     * Returns the URI of the default state.
     * @return {string}
     */
    getSource() {
      return this._item['source'];
    }

    /**
     * Returns the URI of the selected state.
     * @return {string}
     */
    getSourceSelected() {
      return this._item['sourceSelected'];
    }

    /**
     * Returns the URI of the hover state.
     * @return {string}
     */
    getSourceHover() {
      return this._item['sourceHover'];
    }

    /**
     * Returns the URI of the hover selected state.
     * @return {string}
     */
    getSourceHoverSelected() {
      return this._item['sourceHoverSelected'];
    }

    /**
     * Returns the name of the item.
     * @return {string}
     */
    getName() {
      return this._item['name'];
    }

    /**
     * Returns the id of the item.
     * @return {string}
     */
    getId() {
      return this._id;
    }

    /**
     * Returns the short description of the item.
     * @return {string}
     */
    getShortDesc() {
      return this._item['shortDesc'];
    }

    /**
     * Returns whether the item is drillable
     * @return {boolean}
     */
    isDrillable() {
      if (this._isNoneShape) return false;
      var drilling = this._item['drilling'];
      if (drilling && drilling !== 'inherit') return drilling === 'on';
      else return this._picto.getOptions()['drilling'] === 'on';
    }

    /**
     * Returns whether the item is double clickable.
     * @return {boolean}
     */
    isDoubleClickable() {
      // : IE double clicking workaround in dvt.EventManager.
      return this.isSelectable() && this.isDrillable() && !this._isNoneShape;
    }

    /**
     * Updates the ARIA attributes. Must be called after all items have been registered with the component to ensure
     * that the accessibility string (total count) is correct.
     */
    updateAriaAttr() {
      this.setAriaRole('img');
      this._updateAriaLabel();
    }

    //---------------------------------------------------------------------//
    // Tooltip Support: DvtTooltipSource impl                              //
    //---------------------------------------------------------------------//
    /**
     * @override
     */
    getDatatip() {
      if (this._isNoneShape) return '';

      // Custom Tooltip via Function
      var options = this._picto.getOptions();
      var customTooltip = this._picto.getOptions()['tooltip'];
      var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
      if (tooltipFunc) {
        var tooltipManager = this._picto.getCtx().getTooltipManager();
        var dataContext = {
          id: this.getId(),
          name: this.getName(),
          count: this.getCount(),
          color: this.getColor()
        };
        return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
      }

      if (this.getShortDesc() != null)
        return dvt.Displayable.resolveShortDesc(this.getShortDesc(), () =>
          DvtPictoChartItem.getShortDescContext(this)
        );

      // Default Tooltip Support
      var tds = [];
      var name = this.getName();
      if (name)
        tds.push(
          dvt.HtmlTooltipManager.createElement('td', options['_tooltipLabelStyle'], name, [
            'oj-dvt-datatip-label'
          ])
        );
      tds.push(
        dvt.HtmlTooltipManager.createElement(
          'td',
          options['_tooltipValueStyle'],
          this._getCountString(),
          ['oj-dvt-datatip-value']
        )
      );
      var tr = dvt.HtmlTooltipManager.createElement('tr', null, tds);
      return dvt.HtmlTooltipManager.createElement('table', null, [tr], ['oj-dvt-datatip-table']);
    }

    /**
     * @override
     */
    getDatatipColor() {
      return this.getColor();
    }

    /**
     * Returns the item count and total count tooltip string.
     * @return {string}
     * @private
     */
    _getCountString() {
      return dvt.ResourceUtils.format(this._picto.getOptions().translations.labelCountWithTotal, [
        this.getCount(),
        this._picto.getTotalCount()
      ]);
    }

    //---------------------------------------------------------------------//
    // Selection Support: DvtSelectable impl                               //
    //---------------------------------------------------------------------//
    /**
     * @override
     */
    isSelectable() {
      return this._picto.getOptions()['selectionMode'] !== 'none' && !this._isNoneShape;
    }

    /**
     * @override
     */
    isSelected() {
      return this._isSelected;
    }

    /**
     * @override
     */
    setSelected(bSelected) {
      this._isSelected = bSelected;
      this._updateAriaLabel();

      for (var i = 0; i < this.getNumChildren(); i++) {
        var child = this.getChildAt(i);
        if (child instanceof DvtPictoChartShapeMarker || child instanceof DvtPictoChartImageMarker)
          child.setSelected(bSelected);
      }
    }

    /**
     * @override
     */
    showHoverEffect() {
      for (var i = 0; i < this.getNumChildren(); i++) {
        var child = this.getChildAt(i);
        if (child instanceof DvtPictoChartShapeMarker || child instanceof DvtPictoChartImageMarker)
          child.showHoverEffect();
      }
    }

    /**
     * @override
     */
    hideHoverEffect() {
      for (var i = 0; i < this.getNumChildren(); i++) {
        var child = this.getChildAt(i);
        if (child instanceof DvtPictoChartShapeMarker || child instanceof DvtPictoChartImageMarker)
          child.hideHoverEffect();
      }
    }

    //---------------------------------------------------------------------//
    // Rollover and Hide/Show Support: DvtLogicalObject impl               //
    //---------------------------------------------------------------------//

    /**
     * @override
     */
    getDisplayables() {
      return [this];
    }

    /**
     * @override
     */
    getAriaLabel() {
      var states = [];
      var translations = this._picto.getOptions().translations;
      if (this.isSelectable())
        states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
      if (this.isDrillable()) states.push(translations.stateDrillable);

      var shortDesc;
      var name = this.getName();
      if (this.getShortDesc() != null) shortDesc = this.getShortDesc();
      else if (name == null) shortDesc = this._getCountString();
      else
        shortDesc = dvt.ResourceUtils.format(translations.labelAndValue, [
          name,
          this._getCountString()
        ]);

      return dvt.Displayable.generateAriaLabel(shortDesc, states, () =>
        DvtPictoChartItem.getShortDescContext(this)
      );
    }

    /**
     * Returns the shortDesc Context of the item.
     * @param {DvtPictoChartItem} item
     * @return {object} The shortDesc Context object
     */
    static getShortDescContext(item) {
      return {
        id: item.getId(),
        name: item.getName(),
        count: item.getCount()
      };
    }

    /**
     * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
     * when the activeElement is set.
     * @private
     */
    _updateAriaLabel() {
      if (!dvt.Agent.deferAriaCreation()) this.setAriaProperty('label', this.getAriaLabel());
    }

    //---------------------------------------------------------------------//
    // Rollover and Hide/Show Support: DvtCategoricalObject impl           //
    //---------------------------------------------------------------------//

    /**
     * @override
     */
    getCategories() {
      if (this._item['_itemData']) return this._item['categories'];
      else return this._item['categories'] || [this.getId()];
    }

    //---------------------------------------------------------------------//
    // Keyboard Support: DvtKeyboardNavigable impl                        //
    //---------------------------------------------------------------------//

    /**
     * @override
     */
    getNextNavigable(event) {
      var keyboardHandler = this._picto.getEventManager().getKeyboardHandler();
      if (event.type === dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event))
        return this;
      else if (keyboardHandler.isNavigationEvent(event))
        return DvtPictoChartKeyboardHandler.getNextNavigable(this._picto, this, event);
      else return null;
    }

    /**
     * @override
     */
    getKeyboardBoundingBox(targetCoordinateSpace) {
      return this.getDimensions(targetCoordinateSpace);
    }

    /**
     * @override
     */
    getTargetElem() {
      return this.getElem();
    }

    /**
     * @override
     */
    showKeyboardFocusEffect() {
      if (!this._isNoneShape) {
        this._isShowingKeyboardFocusEffect = true;
        this.showHoverEffect();
      }
    }

    /**
     * @override
     */
    hideKeyboardFocusEffect() {
      if (!this._isNoneShape) {
        this._isShowingKeyboardFocusEffect = false;
        this.hideHoverEffect();
      }
    }

    /**
     * @override
     */
    isShowingKeyboardFocusEffect() {
      return this._isShowingKeyboardFocusEffect;
    }

    /**
     * Sets where the tooltip should appear on keyboard navigation.
     * @param {dvt.Point} location
     */
    setKeyboardTooltipLocation(location) {
      this._keyboardTooltipLocation = location;
    }

    /**
     * @override
     */
    getKeyboardTooltipLocation() {
      return this._keyboardTooltipLocation;
    }
  }

  /**
   * Counter for generating default id
   * @private
   */
  DvtPictoChartItem._counter = 0;

  /**
   * Provides automation services for PictoChart.
   * @class  DvtPictoChartAutomation
   * @param {PictoChart} picto
   * @implements {dvt.Automation}
   * @constructor
   */
  class DvtPictoChartAutomation extends dvt.Automation {
    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>item[index]</li>
     * <li>tooltip</li>
     * </ul>
     * @override
     */
    GetSubIdForDomElement(displayable) {
      var logicalObj = this._comp.getEventManager().GetLogicalObject(displayable);
      if (logicalObj && logicalObj instanceof DvtPictoChartItem) {
        var index = this._comp.getItems().indexOf(logicalObj);
        return 'item[' + index + ']';
      }
      return null;
    }

    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>item[index]</li>
     * <li>tooltip</li>
     * </ul>
     * @override
     */
    getDomElementForSubId(subId) {
      if (subId === dvt.Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._comp);

      var parenIdx = subId.indexOf('[');
      if (parenIdx > 0 && subId.substring(0, parenIdx) === 'item') {
        var index = parseInt(subId.substring(parenIdx + 1, subId.length - 1));
        var item = this._comp.getItems()[index];
        if (item) return item.getElem();
        else return null;
      }
      return null;
    }

    /**
     * Returns an object containing data for a pictoChart item. Used for verification.
     * Valid verification values inlcude:
     * <ul>
     * <li>color</li>
     * <li>tooltip</li>
     * <li>id</li>
     * <li>name</li>
     * <li>count</li>
     * <li>selected</li>
     * </ul>
     * @param {Number} index The index of the tag cloud item
     * @return {Object} An object containing data for the tag cloud item
     */
    getItem(index) {
      var item = this._comp.getItems()[index];
      if (item) {
        var data = {
          color: item.getDatatipColor(),
          tooltip: item.getDatatip(),
          id: item.getId(),
          name: item.getName(),
          count: item.getCount(),
          selected: item.isSelected()
        };
        return data;
      }
      return null;
    }

    /**
     * Returns the number of items in the pictoChart
     * @return {Number}
     */
    getItemCount() {
      return this._comp.getItems().length;
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {dvt.BaseComponentDefaults}
   */
  class DvtPictoChartDefaults extends dvt.BaseComponentDefaults {
    constructor(context) {
      /**
       * Contains overrides for version 1.
       * @const
       */
      const VERSION_1 = {
        animationOnDisplay: 'none',
        animationOnDataChange: 'none',
        animationDuration: 750,
        drilling: 'off',
        hiddenCategories: [],
        highlightedCategories: [],
        highlightMatch: 'all',
        hoverBehavior: 'none',
        hoverBehaviorDelay: 200,
        layout: 'horizontal',
        layoutOrigin: 'topStart',
        selection: [],
        selectionMode: 'none',
        _defaultColor: '#a6acb1',
        _noneShapeColor: 'rgba(255,255,255,0)',
        _defaultSize: 32,
        _defaultShape: 'rectangle',
        _gapRatio: 0.25,
        _textStyle: new dvt.CSSStyle(
          dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_13 + 'color: #252525;'
        ),
        _statusMessageStyle: new dvt.CSSStyle(
          dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_13 + 'color: #252525;'
        ),
        _tooltipLabelStyle: new dvt.CSSStyle(''),
        _tooltipValueStyle: new dvt.CSSStyle('')
      };
      super({ alta: VERSION_1 }, context);
    }
  }

  /**
   * Event Manager for pictoChart component.
   * @param {PictoChart} picto
   * @constructor
   */
  class DvtPictoChartEventManager extends dvt.EventManager {
    constructor(picto) {
      super(picto.getCtx(), picto.dispatchEvent, picto, picto);
      this._picto = picto;
    }

    /**
     * @override
     */
    ProcessRolloverEvent(event, obj, bOver) {
      var options = this._picto.getOptions();
      if (options['hoverBehavior'] === 'none') return;

      // Compute the new highlighted categories and update the options
      var categories = obj.getCategories ? obj.getCategories() : [];
      options['highlightedCategories'] = bOver ? categories.slice() : null;

      // Fire the event to the rollover handler, who will fire to the component callback.
      var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(
        options['highlightedCategories'],
        bOver
      );
      var hoverBehaviorDelay = dvt.CSSStyle.getTimeMilliseconds(options['hoverBehaviorDelay']);
      this.RolloverHandler.processEvent(
        rolloverEvent,
        this._picto.getItems(),
        hoverBehaviorDelay,
        options['highlightMatch'] === 'any'
      );
    }

    /**
     * @override
     */
    OnClickInternal(event) {
      var obj = this.GetLogicalObject(event.target);
      if (!obj) return;

      // Only drill if not selectable. If selectable, drill with double click.
      if (!(obj.isSelectable && obj.isSelectable())) this.processDrillEvent(obj);
    }

    /**
     * @override
     */
    OnDblClickInternal(event) {
      var obj = this.GetLogicalObject(event.target);
      if (!obj) return;

      // Only double click to drill if selectable. Otherwise, drill with single click.
      if (obj.isSelectable && obj.isSelectable()) this.processDrillEvent(obj);
    }

    /**
     * @override
     */
    HandleTouchHoverEndInternal(event) {
      var obj = this.GetLogicalObject(event.target);
      if (!obj) return;

      // Only drill if not selectable. If selectable, drill using double click.
      if (!(obj.isSelectable && obj.isSelectable())) this.processDrillEvent(obj);
    }

    /**
     * @override
     */
    HandleTouchClickInternal(event) {
      var obj = this.GetLogicalObject(event.target);
      if (!obj) return;

      // Only drill if not selectable. If selectable, drill using double click.
      if (!(obj.isSelectable && obj.isSelectable())) this.processDrillEvent(obj);
    }

    /**
     * @override
     */
    HandleTouchDblClickInternal(event) {
      var obj = this.GetLogicalObject(event.target);
      if (!obj) return;

      // Only double click to drill if selectable. Otherwise, drill with single click.
      if (obj.isSelectable && obj.isSelectable()) {
        event.preventDefault();
        event.stopPropagation();
        this.processDrillEvent(obj);
      }
    }

    /**
     * Processes an drill on the specified object.
     * @param {DvtLogicalObject} obj The object that was clicked.
     */
    processDrillEvent(obj) {
      if (obj instanceof DvtPictoChartItem && obj.isDrillable())
        this.FireEvent(dvt.EventFactory.newDrillEvent(obj.getId()));
    }
  }

  /**
   * Renderer for PictoChart.
   * @class
   */
  const DvtPictoChartRenderer = {
    /**
     * Renders the pictoChart contents into the available space.
     * @param {PictoChart} picto The pictoChart being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @param {Object=} info (optional) The pictoChart info, obtained from getInfo().
     */
    render: (picto, container, availSpace, info) => {
      // Add invisible background to allow interactivity (e.g. clear selection)
      var context = picto.getCtx();
      var background = new dvt.Rect(context, availSpace.x, availSpace.y, availSpace.w, availSpace.h);
      background.setInvisibleFill();
      container.addChild(background);

      if (!info) info = DvtPictoChartRenderer.getInfo(picto, availSpace.w, availSpace.h);

      if (!info.items) {
        DvtPictoChartRenderer.renderEmptyText(picto, container, availSpace);
        return;
      }

      // Register the items
      picto.registerItems(info.items);

      var options = picto.getOptions();
      var gapRatio = options['_gapRatio'] * info.minSpan;
      var isVert = DvtPictoChartUtils.isVertical(picto);
      var isOriginBottom = DvtPictoChartUtils.isOriginBottom(picto);
      var isOriginRight = DvtPictoChartUtils.isOriginRight(picto);

      // Use a 2D cell map to keep track of which cells are occupied
      var cellMap = new dvt.Map2D();

      var prevColSpan = 0;
      var prevRowSpan = 0;
      var remainder = 0; // fractional remainder of the previous item

      for (var i = 0; i < info.items.length; i++) {
        var item = info.items[i];
        var colSpan = item.getColSpan();
        var rowSpan = item.getRowSpan();

        if (colSpan <= 0 || rowSpan <= 0) continue;

        var w = colSpan * info.colWidth;
        var h = rowSpan * info.rowHeight;

        var count = item.getCount(); // number of markers left to be rendered
        var index = 0; // marker index for animation
        var isFirstMarker = true;
        var cell;

        while (count > 0) {
          // Fractional markers can't be combined if the colSpan and rowSpan don't match
          if (colSpan !== prevColSpan || rowSpan !== prevRowSpan) remainder = 0;

          // If there's no remainder, use a new cell. Otherwise, render on the previous cell
          if (remainder === 0)
            cell = DvtPictoChartRenderer._findNextAvailableCell(
              cellMap,
              colSpan,
              rowSpan,
              info.colCount,
              info.rowCount,
              isVert
            );

          if (cell == null) break;

          // Marker coords
          var xOffset = cell.col * info.colWidth + w / 2;
          var yOffset = cell.row * info.rowHeight + h / 2;
          var x = availSpace.x + (isOriginRight ? availSpace.w - xOffset : xOffset);
          var y = availSpace.y + (isOriginBottom ? availSpace.h - yOffset : yOffset);

          // Draw fractional marker if remaining count is less than one, or if there's a remainder from the previous item
          var fraction = Math.min(1 - remainder, count);

          // Coords for hit area and clip path
          var rectX, rectY, rectW, rectH;
          if (isVert) {
            rectX = x - w / 2;
            rectY = isOriginBottom ? y + h * (0.5 - fraction - remainder) : y + h * (remainder - 0.5);
            rectW = w;
            rectH = h * fraction;
          } else {
            rectX = isOriginRight ? x + w * (0.5 - fraction - remainder) : x + w * (remainder - 0.5);
            rectY = y - h / 2;
            rectW = w * fraction;
            rectH = h;
          }

          // Set the marker ID for data change animation
          var markerId;
          if (fraction === 1) {
            markerId = item.getId() + '_' + index;
            index++;
          } else {
            // Set a random ID so that fractional markers don't get animateUpdate (only animateInsert and animateDelete)
            // This is a workaround for not animating the clipPath
            markerId = Math.random(); // @RandomNumberOK
          }

          var marker;
          if (item.getSource()) {
            // Custom image marker
            marker = new DvtPictoChartImageMarker(
              picto,
              x,
              y,
              w,
              h,
              item.getSource(),
              item.getSourceSelected(),
              item.getSourceHover(),
              item.getSourceHoverSelected(),
              markerId + '_I'
            );
          } else {
            // Add hit area to remove gap between shapes (for selection, tooltip, etc)
            var hitArea = new dvt.Rect(context, rectX, rectY, rectW, rectH);
            hitArea.setInvisibleFill();
            item.addChild(hitArea);

            // Create shape marker
            marker = new DvtPictoChartShapeMarker(
              picto,
              item.getShape(),
              x,
              y,
              w - info.colWidth * gapRatio,
              h - info.rowHeight * gapRatio,
              markerId + '_S'
            );
            marker.setSolidFill(item.getColor());
            marker.setSolidStroke(item.getBorderColor(), null, item.getBorderWidth());
            marker.setDataColor(item.getColor());
            marker.setClassName(item.getClassName());
            marker.setStyle(item.getStyle());
          }

          // Draw clip path if the marker is fractional
          if (fraction < 1) {
            var clipPath = new dvt.ClipPath();
            clipPath.addRect(rectX, rectY, rectW, rectH);
            marker.setClipPath(clipPath);
          }

          // Set the keyboard tooltip to show up on the first marker
          if (isFirstMarker) {
            item.setKeyboardTooltipLocation(new dvt.Point(x, y));
            isFirstMarker = false;
          }

          item.addChild(marker);
          picto.registerMarker(marker);

          count -= fraction;
          remainder = (remainder + fraction) % 1;
        }

        container.addChild(item);
        item.updateAriaAttr();

        prevColSpan = colSpan;
        prevRowSpan = rowSpan;
      }
    },

    /**
     * Creates the pictoChart items and computes the layout variables.
     * @param {PictoChart} picto The pictoChart being rendered.
     * @param {number=} width The width, if fixed by user (optional)
     * @param {number=} height The height, if fixed by user (optional)
     * @return {Object} An object containing items, colCount, rowCount, colWidth, and rowHeight.
     */
    getInfo: (picto, width, height) => {
      var options = picto.getOptions();
      var itemObjs = options['items'];
      if (!itemObjs) return {};

      // Create a boolean map of hidden categories for better performance
      var categoryMap = dvt.ArrayUtils.createBooleanMap(options['hiddenCategories']);

      // Create items and compute the number of cells that are needed to fit all items
      var items = [];
      var numCells = 0;
      var maxColSpan = 1;
      var maxRowSpan = 1;
      var minSpan = Infinity;

      for (var i = 0; i < itemObjs.length; i++) {
        if (itemObjs[i] == null) continue;

        var item = new DvtPictoChartItem(picto, itemObjs[i]);
        if (categoryMap && dvt.ArrayUtils.hasAnyMapItem(categoryMap, item.getCategories())) continue;

        var colSpan = item.getColSpan();
        var rowSpan = item.getRowSpan();
        if (colSpan <= 0 || rowSpan <= 0) continue;

        // Compute the maximum colSpan and rowSpan
        if (colSpan > maxColSpan) maxColSpan = colSpan;
        if (rowSpan > maxRowSpan) maxRowSpan = rowSpan;

        // Compute minimum span for gap computation
        if (colSpan < minSpan) minSpan = colSpan;
        if (rowSpan < minSpan) minSpan = rowSpan;

        numCells += colSpan * rowSpan * item.getCount();
        items.push(item);
      }
      if (numCells === 0) return {};

      // Default colWidth and rowHeight for flowing layout
      var colWidth = options['columnWidth'];
      var rowHeight = options['rowHeight'];
      if (!width || !height) {
        if (!colWidth) colWidth = rowHeight ? rowHeight : options['_defaultSize'];
        if (!rowHeight) rowHeight = colWidth;
      }

      // Default colCount and rowCount for both layouts
      // We set the default colCount (or rowCount) to be an integer multiple of the maxColSpan (or maxRowSpan) to
      // ensure that all the items can find a spot to occupy in the mixed sizes case.
      var isVert = DvtPictoChartUtils.isVertical(picto);
      var colCount = options['columnCount'];
      var rowCount = options['rowCount'];
      if (!colCount && !rowCount) {
        // Try to achieve square cells, (width / colCount) = (height / rowCount)
        if (width && height) {
          if (isVert)
            rowCount = DvtPictoChartRenderer._ceil(
              Math.sqrt((numCells * height) / width),
              maxRowSpan
            );
          else
            colCount = DvtPictoChartRenderer._ceil(
              Math.sqrt((numCells * width) / height),
              maxColSpan
            );
        } else if (width) colCount = Math.max(Math.floor(width / colWidth), 1);
        else if (height) rowCount = Math.max(Math.floor(height / rowHeight), 1);
        else {
          if (isVert) rowCount = DvtPictoChartRenderer._ceil(Math.sqrt(numCells), maxRowSpan);
          else colCount = DvtPictoChartRenderer._ceil(Math.sqrt(numCells), maxColSpan);
        }
      }
      // Now only either colCount or rowCount is undefined
      if (!colCount) colCount = DvtPictoChartRenderer._ceil(numCells / rowCount, maxColSpan);
      else if (!rowCount) rowCount = DvtPictoChartRenderer._ceil(numCells / colCount, maxRowSpan);

      // Default colWidth and rowHeight for fixed layout
      if (width && height) {
        if (!colWidth)
          colWidth = rowHeight ? rowHeight : Math.min(width / colCount, height / rowCount);
        if (!rowHeight) rowHeight = colWidth;
      }

      if (colCount <= 0 || rowCount <= 0 || colWidth <= 0 || rowHeight <= 0) return {};

      return { items, colCount, rowCount, colWidth, rowHeight, minSpan };
    },

    /**
     * Round "a" up to the closest number that is an integer multiple of "b"
     * @param {number} a
     * @param {number} b
     * @return {number}
     * @private
     */
    _ceil: (a, b) => {
      return Math.ceil(a / b) * b;
    },

    /**
     * Returns the next available cell for the shape.
     * @param {dvt.Map2D} cellMap
     * @param {number} colSpan
     * @param {number} rowSpan
     * @param {number} colCount
     * @param {number} rowCount
     * @param {boolean} isVert Whether the layout is vertical.
     * @return {object} Contains the col and row of the next available cell.
     * @private
     */
    _findNextAvailableCell: (cellMap, colSpan, rowSpan, colCount, rowCount, isVert) => {
      if (isVert) {
        // For vertical layout, switch row and col in the computation, and switch the result back
        var cell = DvtPictoChartRenderer._findNextAvailableCell(
          cellMap,
          rowSpan,
          colSpan,
          rowCount,
          colCount,
          false
        );
        return cell ? { col: cell.row, row: cell.col } : null;
      }

      for (var r = 0; r < rowCount - rowSpan + 1; r++) {
        for (var c = 0; c < colCount - colSpan + 1; c++) {
          if (DvtPictoChartRenderer._areCellsAvailable(cellMap, c, r, colSpan, rowSpan)) {
            DvtPictoChartRenderer._occupyCells(cellMap, c, r, colSpan, rowSpan);
            return { col: c, row: r };
          }
        }
      }

      return null;
    },

    /**
     * Returns whether the cells are available.
     * @param {dvt.Map2D} cellMap
     * @param {number} col
     * @param {number} row
     * @param {number} colSpan
     * @param {number} rowSpan
     * @return {boolean}
     * @private
     */
    _areCellsAvailable: (cellMap, col, row, colSpan, rowSpan) => {
      for (var r = 0; r < rowSpan; r++) {
        for (var c = 0; c < colSpan; c++) {
          if (cellMap.get(col + c, row + r)) return false;
        }
      }
      return true;
    },

    /**
     * Occupies the specified cells.
     * @param {dvt.Map2D} cellMap
     * @param {number} col
     * @param {number} row
     * @param {number} colSpan
     * @param {number} rowSpan
     * @private
     */
    _occupyCells: (cellMap, col, row, colSpan, rowSpan) => {
      for (var r = 0; r < rowSpan; r++) {
        for (var c = 0; c < colSpan; c++) {
          cellMap.put(col + c, row + r, true);
        }
      }
    },

    /**
     * Renders the empty text for the component.
     * @param {PictoChart} picto The pictoChart being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     */
    renderEmptyText: (picto, container, availSpace) => {
      var options = picto.getOptions();
      var emptyTextStr = options.translations.labelNoData;
      var emptyText = picto.renderEmptyText(
        container,
        emptyTextStr,
        availSpace.clone(),
        picto.getEventManager(),
        options['_statusMessageStyle']
      );
      picto.registerEmptyText(emptyText);
    }
  };

  /**
   * PictoChart component.  The component should never be instantiated directly.  Use the newInstance function instead
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @class
   * @constructor
   */
  class PictoChart extends dvt.BaseComponent {
    constructor(context, callback, callbackObj) {
      /**
       * Initializes the component.
       * @param {dvt.Context} context The rendering context.
       * @param {string} callback The function that should be called to dispatch component events.
       * @param {object} callbackObj The optional object instance on which the callback function is defined.
       * @protected
       */
      super(context, callback, callbackObj);

      // Create the event handler and add event listeners
      this.EventManager = new DvtPictoChartEventManager(this);
      this.EventManager.addListeners(this);

      // Set up keyboard handler on non-touch devices
      if (!dvt.Agent.isTouchDevice())
        this.EventManager.setKeyboardHandler(new DvtPictoChartKeyboardHandler(this.EventManager));

      // Create the defaults object
      this.Defaults = new DvtPictoChartDefaults(context);

      // Create array of logical objects for pictoChart items
      this._items = [];

      // PictoChart sets the width and height of its svg so no need for fix for 
      if (dvt.Agent.engine === 'blink' || dvt.Agent.browser === 'safari') {
        this.getCtx().removeSizingSvg();
      }
    }

    /**
     * Calculates the preferred dimensions for this pictoChart.
     * @param {Number=} width The component width, if defined.
     * @param {Number=} height The component height, if defined.
     * @return {dvt.Dimension} The preferred dimensions.
     * @private
     */
    _getPreferredSize(width, height) {
      // Calculate the preferred width or height if not defined
      if (!width || !height) {
        var info = DvtPictoChartRenderer.getInfo(this, width, height);
        this._info = info; // store for use in render()

        if (!width) width = info.items ? info.colCount * info.colWidth : 0;
        if (!height) height = info.items ? info.rowCount * info.rowHeight : 0;
      }

      return new dvt.Dimension(width, height);
    }

    /**
     * @override
     */
    render(options, width, height) {
      // IMPORTANT: If width and height are passed, then flowing layout would be disabled.

      // Keep old references for animation
      this._oldContainer = this._container;
      var oldMarkers = this._markers;
      var oldWidth = this.Width ? this.Width : 0;
      var oldHeight = this.Height ? this.Height : 0;

      // Clean up
      this.EventManager.hideTooltip();
      this._items = [];
      this._markers = [];
      this._info = null;
      if (this._emptyText) {
        this._container.removeChild(this._emptyText);
        this._emptyText = null;
      }
      this.StopAnimation();

      // Update if a new options object has been provided or initialize with defaults if needed
      this.SetOptions(options);
      var context = this.getCtx();

      if (!width && !height) {
        // Set display=block to the SVG to enable flowing layout (removing extra gap in the outer div)
        context.getSvgDocument().style.display = 'block';

        // Determine whether the layout is fixed or flowing.
        // To find out, set the preferred dims on the SVG, and see if the outerDiv dims follow the SVG dims.
        var preferredSize = this._getPreferredSize();
        dvt.ToolkitUtils.setSvgSize(context, preferredSize.w, preferredSize.h);
        var outerDivSize = dvt.ToolkitUtils.getOuterDivSize(context);

        if (preferredSize.w === outerDivSize.w && preferredSize.h !== outerDivSize.h) {
          // Height is fixed, but width is probably flowing.
          // Relayout with fixed height to find the preferred width.
          this.Height = outerDivSize.h;
          preferredSize = this._getPreferredSize(null, this.Height);
          dvt.ToolkitUtils.setSvgSize(context, preferredSize.w, this.Height);
          this.Width = dvt.ToolkitUtils.getOuterDivSize(context).w;
        } else if (preferredSize.w !== outerDivSize.w && preferredSize.h === outerDivSize.h) {
          // Width is fixed, but height is probably flowing.
          // Relayout with fixed width to find the preferred height.
          this.Width = outerDivSize.w;
          preferredSize = this._getPreferredSize(this.Width, null);
          dvt.ToolkitUtils.setSvgSize(context, this.Width, preferredSize.h);
          this.Height = dvt.ToolkitUtils.getOuterDivSize(context).h;
        } else {
          // The width and height are either both fixed or both flowing.
          // In either case, we can render at the outerDivSize because:
          // - if both width and height are flowing, the outerDivSize matches the preferredSize,
          // - if both width and height are fixed, we're forced to render at the outerDivSize.
          this.Width = outerDivSize.w;
          this.Height = outerDivSize.h;
        }

        // If the width/height doesn't match the last computed preferredSize, the info has to be recomputed
        if (this.Width !== preferredSize.w || this.Height !== preferredSize.h) this._info = null;
      } else {
        // If width and height are passed, flowing layout is disabled.
        // Use this mode for unit tests and ADF printable pages.
        this.Width = width;
        this.Height = height;
      }

      // Render the component
      this._container = new dvt.Container(context);
      this.addChild(this._container);
      DvtPictoChartRenderer.render(
        this,
        this._container,
        new dvt.Rectangle(0, 0, this.Width, this.Height),
        this._info
      );

      // Construct the new animation playable
      if (!this._oldContainer) {
        this.Animation = this._getAnimOnDisplay();
      } else if (this.Options['animationOnDataChange'] !== 'none' && options) {
        // Treat layout changes as data change animations and animate to new positions
        var animHandler = new dvt.DataAnimationHandler(context, null);
        animHandler.constructAnimation(oldMarkers, this._markers);
        this.Animation = animHandler.getAnimation();
      }

      // If an animation was created, play it
      if (this.Animation) {
        // Temporarily set the SVG size to max(oldSize, newSize) to ensure that the animation isn't truncated
        dvt.ToolkitUtils.setSvgSize(
          context,
          Math.max(oldWidth, this.Width),
          Math.max(oldHeight, this.Height)
        );

        // Remove event listeners and empty text temporarily
        this.EventManager.removeListeners(this);
        if (this._emptyText) this._container.removeChild(this._emptyText);

        this.Animation.setOnEnd(this._onRenderEnd, this);
        this.Animation.play();
      } else this._onRenderEnd();
    }

    /**
     * @override
     */
    SetOptions(options) {
      super.SetOptions(options);
      // DataProvider Support : Must be done before setting this.Options
      // if (options['data'])
      //   options['items'] = options['data'];

      if (options) {
        // Combine the user options with the defaults and store
        this.Options = this.Defaults.calcOptions(options);
      } else if (!this.Options) this.Options = this.GetDefaults();

      if (dvt.Agent.isEnvironmentTest()) {
        this.Options['animationOnDisplay'] = 'none';
        this.Options['animationOnDataChange'] = 'none';
      }

      // Initialize the selection handler
      var selectionMode = this.Options['selectionMode'];
      if (selectionMode === 'single')
        this._selectionHandler = new dvt.SelectionHandler(
          this.getCtx(),
          dvt.SelectionHandler.TYPE_SINGLE
        );
      else if (selectionMode === 'multiple')
        this._selectionHandler = new dvt.SelectionHandler(
          this.getCtx(),
          dvt.SelectionHandler.TYPE_MULTIPLE
        );
      else this._selectionHandler = null;

      // Pass to event manager
      this.EventManager.setSelectionHandler(this._selectionHandler);
    }

    /**
     * Cleaning and processing at the end of the render call.
     * @private
     */
    _onRenderEnd() {
      // Clean up the old container used by black box updates
      if (this._oldContainer) {
        this.removeChild(this._oldContainer);
        this._oldContainer.destroy();
        this._oldContainer = null;
      }

      if (this.Animation) {
        // Restore event listeners and empty text
        this.EventManager.addListeners(this);
        if (this._emptyText) this._container.addChild(this._emptyText);
      }

      // Set the preferred size on the SVG element
      dvt.ToolkitUtils.setSvgSize(this.getCtx(), this.Width, this.Height);

      // Set the initial keyboard focus
      var initialFocus;
      for (var i = 0; i < this._items.length; i++) {
        initialFocus = this._items[i];
        if (initialFocus.getShape() !== 'none') break;
      }
      this.EventManager.setFocusObj(initialFocus);

      // Set initial selection
      if (this._selectionHandler)
        this._selectionHandler.processInitialSelections(this.Options['selection'], this._items);

      // Set initial highlighting
      dvt.CategoryRolloverHandler.highlight(
        this.Options['highlightedCategories'],
        this._items,
        this.Options['highlightMatch'] === 'any'
      );

      this.UpdateAriaAttributes();

      if (!this.AnimationStopped) this.RenderComplete();

      // Reset animation flags
      this.Animation = null;
      this.AnimationStopped = false;
    }

    /**
     * Registers the pictoChart items. The items must be registered to participate in interactivity.
     * @param {array} items Array of DvtPictoChartItem.
     */
    registerItems(items) {
      this._items = items;
    }

    /**
     * Returns the pictoChart items.
     * @return {array} Array of DvtPictoChartItem.
     */
    getItems() {
      return this._items;
    }

    /**
     * Registers the marker with the component. The marker must be registered to participate in animation.
     * @param {DvtPictoChartShapeMarker|DvtPictoChartImageMarker} marker
     */
    registerMarker(marker) {
      this._markers.push(marker);
    }

    /**
     * Registers the "no data" text.
     * @param {dvt.OutputText} text
     */
    registerEmptyText(text) {
      this._emptyText = text;
    }

    /**
     * Returns the total count of the all items.
     * @return {number}
     */
    getTotalCount() {
      var count = 0;
      for (var i = 0; i < this._items.length; i++) {
        count += this._items[i].getCount();
      }
      return count;
    }

    /**
     * Returns the animation duration.
     * @return {number}
     */
    getAnimDur() {
      return dvt.CSSStyle.getTimeMilliseconds(this.Options['animDuration']) / 1000;
    }

    /**
     * Returns the animation on display.
     * @return {dvt.Playable}
     * @private
     */
    _getAnimOnDisplay() {
      var animOnDisplay = this.Options['animationOnDisplay'];
      var duration = this.getAnimDur();
      var context = this.getCtx();
      var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);

      if (dvt.BlackBoxAnimationHandler.isSupported(animOnDisplay))
        return dvt.BlackBoxAnimationHandler.getInAnimation(
          context,
          animOnDisplay,
          this._container,
          bounds,
          duration
        );

      var playables = [];
      if (animOnDisplay === 'popIn') {
        for (var i = 0; i < this._markers.length; i++) {
          var marker = this._markers[i];
          playables.push(new dvt.AnimPopIn(context, marker, true, duration));
        }
      } else if (animOnDisplay !== 'none') {
        // Grow animation
        for (var k = 0; k < this._markers.length; k++) {
          var markerAnim = this._markers[k];
          var playable = new dvt.CustomAnimation(context, markerAnim, duration);
          var startState, endState;

          if (DvtPictoChartUtils.isVertical(this)) {
            startState = DvtPictoChartUtils.isOriginRight(this) ? this.Width : 0;
            endState = markerAnim.getCx();
            markerAnim.setCx(startState);
            playable
              .getAnimator()
              .addProp(
                dvt.Animator.TYPE_NUMBER,
                markerAnim,
                markerAnim.getCx,
                markerAnim.setCx,
                endState
              );
          } else {
            startState = DvtPictoChartUtils.isOriginBottom(this) ? this.Height : 0;
            endState = markerAnim.getCy();
            markerAnim.setCy(startState);
            playable
              .getAnimator()
              .addProp(
                dvt.Animator.TYPE_NUMBER,
                markerAnim,
                markerAnim.getCy,
                markerAnim.setCy,
                endState
              );
          }
          playables.push(playable);
        }
        // Add fade in to hide the ugly overlaps at the beginning
        playables.push(
          dvt.BlackBoxAnimationHandler.getInAnimation(
            context,
            dvt.BlackBoxAnimationHandler.ALPHA_FADE,
            this._container,
            bounds,
            duration
          )
        );
      }

      if (playables.length > 0) return new dvt.ParallelPlayable(context, playables);
      else return null;
    }

    /**
     * @override
     */
    highlight(categories) {
      // Update the options
      var options = this.getOptions();
      options['highlightedCategories'] = dvt.JsonUtils.clone(categories);

      // Perform the highlighting and propagate to children
      dvt.CategoryRolloverHandler.highlight(
        categories,
        this.getItems(),
        options['highlightMatch'] === 'any'
      );
    }

    /**
     * @override
     */
    select(selection) {
      // Update the options
      var options = this.getOptions();
      options['selection'] = dvt.JsonUtils.clone(selection);

      // Perform the selection
      if (this._selectionHandler)
        this._selectionHandler.processInitialSelections(selection, this.getItems());
    }

    /**
     * Returns the automation object for this component.
     * @return {DvtPictoChartAutomation} The automation object.
     */
    getAutomation() {
      if (!this._automation) this._automation = new DvtPictoChartAutomation(this);
      return this._automation;
    }
  }

  exports.PictoChart = PictoChart;

  Object.defineProperty(exports, '__esModule', { value: true });

});
