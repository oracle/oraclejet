/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit'], function (exports, dvt) { 'use strict';

  /**
   * @param {dvt.EventManager} manager The owning dvt.EventManager
   * @class DvtTagCloudKeyboardHandler
   * @extends {dvt.KeyboardHandler}
   * @constructor
   */
  class DvtTagCloudKeyboardHandler extends dvt.KeyboardHandler {
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
     * Finds next navigable item based on direction
     * @param {DvtKeyboardNavigable} currentNavigable The DvtKeyboardNavigable item with current focus
     * @param {dvt.KeyboardEvent} event The keyboard event
     * @param {Array} navigableItems An array of items that could receive focus next
     * @return {DvtKeyboardNavigable} The next navigable
     */
    static getNextNavigable(currentNavigable, event, navigableItems) {
      var bNext =
        event.keyCode === dvt.KeyboardEvent.RIGHT_ARROW ||
        event.keyCode === dvt.KeyboardEvent.DOWN_ARROW
          ? true
          : false;
      var nextIdx = navigableItems.indexOf(currentNavigable) + (bNext ? 1 : -1);
      if (nextIdx < navigableItems.length && nextIdx >= 0) return navigableItems[nextIdx];
      else return null;
    }
  }

  /**
   * Logical object for tag cloud data object displayables.
   * @param {dvt.TagCloud} tagCloud The owning component
   * @param {dvt.Displayable} displayable The of associated dvt.Displayable.
   * @param {object} data The data associated with the tag cloud item.
   * @class
   * @constructor
   * @implements {DvtCategoricalObject}
   * @implements {DvtLogicalObject}
   * @implements {DvtSelectable}
   * @implements {DvtTooltipSource}
   * @implements {DvtDraggable}
   */
  class DvtTagCloudObjPeer {
    /**
     * @param {dvt.TagCloud} tagCloud The owning component
     * @param {dvt.Displayable} displayable The of associated dvt.Displayable.
     * @param {object} data The data associated with the tag cloud item.
     * @protected
     */
    constructor(tagCloud, displayable, data) {
      this._view = tagCloud;
      this._displayable = displayable;
      this._data = data;
      this._isSelected = false;
      this._bSelectable = false;

      // A11y
      if (data['url']) {
        displayable.setAriaRole('link');
        this._linkCallback = dvt.ToolkitUtils.getLinkCallback('_blank', data['url']);
      } else {
        displayable.setAriaRole('img');
      }

      this._updateAriaLabel();
    }

    /**
     * Returns the tag cloud item id
     * @return {String}
     */
    getId() {
      return this._data['id'];
    }

    /**
     * Returns the label of the tag cloud item
     * @return {String}
     */
    getLabel() {
      return this._data['label'];
    }

    /**
     * Returns the value of the tag cloud item
     * @return {Number}
     */
    getValue() {
      return this._data['value'];
    }

    /**
     * Returns the shortDesc of the data object
     * @return {string}
     */
    getShortDesc() {
      return this._data['shortDesc'];
    }

    /**
     * Implemented for DvtTooltipSource
     * @override
     */
    getDatatip() {
      // Custom Tooltip from Function
      var customTooltip = this._view.getOptions()['tooltip'];
      var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
      if (tooltipFunc)
        return this._view
          .getCtx()
          .getTooltipManager()
          .getCustomTooltip(tooltipFunc, this.getDataContext());

      // Custom Tooltip from ShortDesc
      return dvt.Displayable.resolveShortDesc(this.getShortDesc(), () =>
        DvtTagCloudObjPeer.getShortDescContext(this)
      );
    }

    /**
     * Returns the data context that will be passed to the tooltip function.
     * @return {object}
     */
    getDataContext() {
      return {
        id: this.getId(),
        label: this.getLabel(),
        color: this.getDatatipColor(),
        value: this.getValue()
      };
    }

    /**
     * Returns the shortDesc Context of the node.
     * @param {DvtTagCloudObjPeer} node
     * @return {object} The shortDesc Context object
     */
    static getShortDescContext(node) {
      return {
        id: node.getId(),
        label: node.getLabel(),
        value: node.getValue()
      };
    }

    /**
     * Returns the link callback
     * @return {function}
     */
    getLinkCallback() {
      return this._linkCallback;
    }

    /**
     * Implemented for DvtTooltipSource
     * @override
     */
    getDatatipColor() {
      return this._displayable.getItemStyle().getStyle(dvt.CSSStyle.COLOR);
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    setSelectable(bSelectable) {
      this._bSelectable = bSelectable;
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    isSelectable() {
      return this._bSelectable;
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    isSelected() {
      return this._isSelected;
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    setSelected(bSelected) {
      this._isSelected = bSelected;
      this._displayable.setSelected(bSelected);
      this._updateAriaLabel();
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    showHoverEffect() {
      this._displayable.showHoverEffect();
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    hideHoverEffect() {
      this._displayable.hideHoverEffect();
    }

    /**
     * Implemented for DvtKeyboardNavigable.
     * @override
     */
    getNextNavigable(event) {
      var keyboardHandler = this._view.EventManager.getKeyboardHandler();
      if (event.type === dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event)) {
        return this;
      } else if (keyboardHandler.isNavigationEvent(event)) {
        return DvtTagCloudKeyboardHandler.getNextNavigable(this, event, this._view.getObjects());
      } else {
        return null;
      }
    }

    /**
     * Implemented for DvtKeyboardNavigable.
     * @override
     */
    getKeyboardBoundingBox(targetCoordinateSpace) {
      return this._displayable.getDimensions(targetCoordinateSpace);
    }

    /**
     * Implemented for DvtKeyboardNavigable.
     * @override
     */
    getTargetElem() {
      return this._displayable.getElem();
    }

    /**
     * Implemented for DvtKeyboardNavigable.
     * @override
     */
    showKeyboardFocusEffect() {
      this._isShowingKeyboardFocusEffect = true;
      this.showHoverEffect();
    }

    /**
     * Implemented for DvtKeyboardNavigable.
     * @override
     */
    hideKeyboardFocusEffect() {
      if (this._isShowingKeyboardFocusEffect) {
        this._isShowingKeyboardFocusEffect = false;
        this.hideHoverEffect();
      }
    }

    /**
     * Implemented for DvtKeyboardNavigable.
     * @override
     */
    isShowingKeyboardFocusEffect() {
      return this._isShowingKeyboardFocusEffect;
    }

    /**
     * Implemented for DvtLogicalObject
     * @override
     */
    getDisplayables() {
      return [this._displayable];
    }

    /**
     * Implemented for DvtLogicalObject
     * @override
     */
    getAriaLabel() {
      var states = [];
      if (this.isSelectable())
        states.push(
          this._view.getOptions().translations[
            this.isSelected() ? 'stateSelected' : 'stateUnselected'
          ]
        );
      return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states, () =>
        DvtTagCloudObjPeer.getShortDescContext(this)
      );
    }

    /**
     * Implemented for DvtCategoricalObject
     * @override
     */
    getCategories() {
      return this._data['categories'];
    }

    /**
     * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
     * when the activeElement is set.
     * @private
     */
    _updateAriaLabel() {
      if (!dvt.Agent.deferAriaCreation()) {
        this._displayable.setAriaProperty('label', this.getAriaLabel());
      }
    }

    /**
     * Implemented for DvtDraggable
     * @override
     */
    isDragAvailable(clientIds) {
      return this._view.isDragSupported(clientIds);
    }

    /**
     * Implemented for DvtDraggable
     * @override
     */
    getDragTransferable() {
      return this._view.getDragRowKeys(this);
    }

    /**
     * Implemented for DvtDraggable
     * @override
     */
    getDragFeedback() {
      return this._view.getDragFeedback();
    }
  }

  /**
   * Provides automation services for a DVT component.
   * @class  DvtTagCloudAutomation
   * @param {dvt.TagCloud} dvtComponent
   * @implements {dvt.Automation}
   * @constructor
   */
  class DvtTagCloudAutomation extends dvt.Automation {
    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>item[index]</li>
     * <li>tooltip</li>
     * </ul>
     * @override
     */
    GetSubIdForDomElement(displayable) {
      var logicalObj = this._comp.EventManager.GetLogicalObject(displayable);
      if (logicalObj && logicalObj instanceof DvtTagCloudObjPeer) {
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
        var peer = this._comp.getItems()[index];
        if (peer) return peer.getDisplayables()[0].getElem();
        else return null;
      }
      return null;
    }

    /**
     * Returns an object containing data for a thematic map data object. Used for verification.
     * Valid verification values inlcude:
     * <ul>
     * <li>color</li>
     * <li>tooltip</li>
     * <li>label</li>
     * <li>value</li>
     * <li>selected</li>
     * </ul>
     * @param {Number} index The index of the tag cloud item
     * @return {Object} An object containing data for the tag cloud item
     */
    getItem(index) {
      var peer = this._comp.getItems()[index];
      if (peer) {
        var data = {
          color: peer.getDatatipColor(),
          currentColor: peer.getDisplayables()[0].getCSSStyle().getStyle('color'),
          backgroundColor: peer.getDisplayables()[0].getCSSStyle().getStyle('background-color'),
          tooltip: peer.getShortDesc(),
          label: peer.getLabel(),
          value: peer.getValue(),
          selected: peer.isSelected()
        };
        return data;
      }
      return null;
    }

    /**
     * Returns the number of items in the tag cloud
     * @return {Number}
     */
    getItemCount() {
      return this._comp.getObjects().length;
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {dvt.BaseComponentDefaults}
   */
  class DvtTagCloudDefaults extends dvt.BaseComponentDefaults {
    constructor(context) {
      /**
       * Contains overrides for version 1.
       * @const
       */
      const VERSION_1 = {
        animationOnDisplay: 'none',
        animationOnDataChange: 'none',
        emptyText: null,
        hiddenCategories: [],
        hideAndShowBehavior: 'none',
        highlightedCategories: [],
        highlightMatch: 'all',
        hoverBehavior: 'none',
        layout: 'rectangular',
        selectionMode: 'none',
        _statusMessageStyle: new dvt.CSSStyle(
          dvt.BaseComponentDefaults.FONT_FAMILY_ALTA + 'color: #333333;'
        ),
        styleDefaults: {
          animationDuration: 500,
          hoverBehaviorDelay: 200,
          _style: new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA + 'color: #333333;')
        },
        touchResponse: 'auto'
      };
      super({ alta: VERSION_1 }, context);
    }
  }

  /**
   * Event Manager for tree components.
   * @param {dvt.TagCloud} view
   * @param {dvt.Context} context
   * @param {function} callback A function that responds to component events.
   * @param {object} callbackObj The optional object instance that the callback function is defined on.
   * @constructor
   */
  class DvtTagCloudEventManager extends dvt.EventManager {
    constructor(view, context, callback, callbackObj) {
      super(context, callback, callbackObj, view);
      this._view = view;
    }

    /**
     * @override
     */
    OnClickInternal(event) {
      var obj = this.GetLogicalObject(event.target);
      this._handleLinkCallback(obj);
    }

    /**
     * @override
     */
    HandleTouchClickInternal(event) {
      var obj = this.GetLogicalObject(event.target);
      this._handleLinkCallback(obj);
    }

    /**
     * Opens the url associated with a tag cloud item
     * @param {DvtTagCloudObjPeer} obj The logical object for the tag cloud item
     * @private
     */
    _handleLinkCallback(obj) {
      if (obj instanceof DvtTagCloudObjPeer) {
        var callback = obj.getLinkCallback();
        if (callback) callback.call();
      }
    }

    /**
     * @override
     */
    ProcessKeyboardEvent(event) {
      var eventConsumed = true;
      var keyCode = event.keyCode;
      var focusObj = this.getFocus();

      if (keyCode === dvt.KeyboardEvent.ENTER) {
        this._handleLinkCallback(focusObj);
      } else {
        eventConsumed = super.ProcessKeyboardEvent(event);
      }

      return eventConsumed;
    }

    /**
     * @override
     */
    ProcessRolloverEvent(event, obj, bOver) {
      // Don't continue if not enabled
      var options = this._view.getOptions();
      if (options['hoverBehavior'] !== 'dim') return;

      // Compute the new highlighted categories and update the options
      var categories = obj.getCategories ? obj.getCategories() : [];
      options['highlightedCategories'] = bOver ? categories.slice() : null;

      // Fire the event to the rollover handler, who will fire to the component callback.
      var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(
        options['highlightedCategories'],
        bOver
      );
      var hoverBehaviorDelay = dvt.CSSStyle.getTimeMilliseconds(
        options['styleDefaults']['hoverBehaviorDelay']
      );
      this.RolloverHandler.processEvent(
        rolloverEvent,
        this._view.getObjects(),
        hoverBehaviorDelay,
        options['highlightMatch'] === 'any'
      );
    }

    /**
     * @override
     */
    GetTouchResponse() {
      return this._view.getOptions()['touchResponse'];
    }
  }

  /**
   * Creates an instance of DvtTagCloudItem which extends dvt.BackgroundOutputText with hover and selection feedback.
   * @extends {dvt.BackgroundOutputText}
   * @constructor
   * @param {dvt.TagCloud} tagCloud The tag cloud this item belongs to
   * @param {dvt.Context} context The rendering context
   * @param {string} textStr The string to display
   * @param {number} x The x coordinate position
   * @param {number} y The y coordinate position
   * @param {dvt.CSSStyle} style The CSS style to be applied to the text and background
   * @param {object=} itemStyle The optional style to be applied directly to the item text
   * @param {string=} styleClass The optional class to be applied directly to the item text
   */
  class DvtTagCloudItem extends dvt.BackgroundOutputText {
    /**
     * @param {dvt.TagCloud} tagCloud The tag cloud this item belongs to
     * @param {dvt.Context} context The rendering context
     * @param {string} textStr The string to display
     * @param {number} x The x coordinate position
     * @param {number} y The y coordinate position
     * @param {dvt.CSSStyle} style The CSS style to be applied to the text and background
     * @param {object=} itemStyle The optional style to be applied directly to the item text
     * @param {string=} styleClass The optional class to be applied directly to the item text
     * @protected
     */
    constructor(tagCloud, context, textStr, x, y, style, itemStyle, styleClass, id) {
      super(context, textStr, x, y, style, id);
      /**
       * @const
       * @private
       */
      this.HOVER_OPACITY = 0.3;
      /**
       * @const
       * @private
       */
      this.HOVER_SELECTED_OPACITY = 0.6;
      /**
       * The order in which the delete animation occurs
       * @protected
       */
      this.ANIM_DELETE_PRIORITY = 0;
      /**
       * The order in which the update animation occurs
       * @protected
       */
      this.ANIM_UPDATE_PRIORITY = 1;
      /**
       * The order in which the insert animation occurs
       * @protected
       */
      this.ANIM_INSERT_PRIORITY = 2;
      this._tagCloud = tagCloud;
      this.alignAuto();
      // If itemStyle or styleClass is specified, it will be directly applied to the tag cloud item SVG text
      // The itemStyle/styleClass will override any other styling specified through the options.
      this.TextInstance.setStyle(itemStyle);
      this.TextInstance.setClassName(styleClass);
      if (style) this._createFeedbackStyles(style);
    }
    /**
     * Sets whether the tag cloud item is currently selected and shows the seleciton effect
     * @param {boolean} bSelected True if the currently selected
     */
    setSelected(bSelected) {
      if (this._isSelected === bSelected) return;

      this._isSelected = bSelected;

      if (bSelected) {
        if (this._isShowingHoverEffect) this.setCSSStyle(this._hoverSelectedStyle);
        else this.setCSSStyle(this._selectedStyle);
      } else {
        this.setCSSStyle(this._normalStyle);
      }
    }

    /**
     * Shows the hover effect for the tag cloud item
     */
    showHoverEffect() {
      if (!this._isShowingHoverEffect) {
        this._isShowingHoverEffect = true;
        if (this._isSelected) this.setCSSStyle(this._hoverSelectedStyle);
        else this.setCSSStyle(this._hoverStyle);
      }
    }

    /**
     * Hides the hover effect for the tag cloud item
     */
    hideHoverEffect() {
      if (this._isSelected) this.setCSSStyle(this._selectedStyle);
      else this.setCSSStyle(this._normalStyle);
      this._isShowingHoverEffect = false;
    }

    /**
     * Returns the animation duration in seconds for the specified tag cloud.  This duration is
     * intended to be passed to the animation handler, and is not in the same units
     * as the API.
     * @param {dvt.TagCloud} tagCloud
     * @return {number} The animation duration in seconds.
     */
    getAnimDur(tagCloud) {
      return tagCloud.getOptions()['styleDefaults']['animationDuration'] / 1000;
    }

    /**
     * Creates the update animation for this data item.
     * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
     * @param {DvtTagCloudItem} oldObj The old data item state to animate from.
     */
    animateUpdate(handler, oldObj) {
      var anim = new dvt.CustomAnimation(this.getCtx(), this, this.getAnimDur(this._tagCloud));
      var style = this.getCSSStyle();
      var oldStyle = oldObj.getCSSStyle();
      var bSizeChange = false;

      // Color change
      var startColor = oldStyle.getStyle(dvt.CSSStyle.COLOR);
      var endColor = style.getStyle(dvt.CSSStyle.COLOR);
      if (startColor !== endColor) {
        var tag = this;
        var getColorStyle = () => {
          return tag.getCSSStyle().getStyle(dvt.CSSStyle.COLOR);
        };
        var setColorStyle = (value) => {
          tag.setCSSStyle(tag.getCSSStyle().setStyle(dvt.CSSStyle.COLOR, value));
        };
        this.setCSSStyle(style.setStyle(dvt.CSSStyle.COLOR, startColor));
        anim
          .getAnimator()
          .addProp(dvt.Animator.TYPE_COLOR, this, getColorStyle, setColorStyle, endColor);
      }

      // Size change
      var startSize = parseFloat(oldStyle.getStyle(dvt.CSSStyle.FONT_SIZE));
      var endSize = parseFloat(style.getStyle(dvt.CSSStyle.FONT_SIZE));
      if (startSize !== endSize) {
        bSizeChange = true;
        var tagSize = this;
        var getFontSize = () => {
          return parseFloat(tagSize.getCSSStyle().getStyle(dvt.CSSStyle.FONT_SIZE));
        };
        this.setFontSize(startSize);
        anim
          .getAnimator()
          .addProp(dvt.Animator.TYPE_NUMBER, this, getFontSize, this.setFontSize, endSize);
      }

      // Position change
      var startX = oldObj.getX();
      var endX = this.getX();

      var startAlign = oldObj.getHorizAlignment();
      var endAlign = this.getHorizAlignment();
      if (endX !== startX || (bSizeChange && endAlign !== startAlign)) {
        // Need to handle case where size change causes relayout
        if (endAlign !== startAlign) {
          startX = DvtTagCloudItem._adjustX(oldObj, startX, startAlign);
        }
        this.setX(startX);
        anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getX, this.setX, endX);
      }

      var startY = oldObj.getY();
      var endY = this.getY();
      if (endY !== startY) {
        this.setY(startY);
        anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getY, this.setY, endY);
      }

      // Hide old item
      oldObj.setAlpha(0);

      handler.add(anim, this.ANIM_UPDATE_PRIORITY);
    }

    /**
     * Creates the delete animation for this data item.
     * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
     */
    animateDelete(handler) {
      handler.add(
        new dvt.AnimFadeOut(this.getCtx(), this, this.getAnimDur(this._tagCloud)),
        this.ANIM_DELETE_PRIORITY
      );
    }

    /**
     * Creates the insert animation for this data item.
     * @param {dvt.DataAnimationHandler} handler The animation handler, which can be used to chain animations.
     */
    animateInsert(handler) {
      this.setAlpha(0);
      handler.add(
        new dvt.AnimFadeIn(this.getCtx(), this, this.getAnimDur(this._tagCloud)),
        this.ANIM_INSERT_PRIORITY
      );
    }

    /**
     * @override
     */
    setFontSize(size) {
      super.setFontSize(size);
      this._updateFeedbackFontStyles(String(size));
    }

    /**
     * Creates the hover and selection feedback styles
     * @param {dvt.CSSStyle} style This object's css style properties
     * @private
     */
    _createFeedbackStyles(style) {
      this._normalStyle = style.clone();
      var color = this._normalStyle.getStyle(dvt.CSSStyle.COLOR);
      this._normalStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, null);

      this._hoverStyle = this._normalStyle.clone();
      var hoverColor = DvtTagCloudItem._lightenColor(color, this.HOVER_OPACITY);
      this._hoverStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, hoverColor);
      this._hoverStyle.setStyle(
        dvt.CSSStyle.COLOR,
        dvt.ColorUtils.getContrastingTextColor(hoverColor)
      );

      this._selectedStyle = this._normalStyle.clone();
      this._selectedStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, color);
      this._selectedStyle.setStyle(dvt.CSSStyle.COLOR, dvt.ColorUtils.getContrastingTextColor(color));

      this._hoverSelectedStyle = this._normalStyle.clone();
      var hoverSelectedColor = DvtTagCloudItem._lightenColor(color, this.HOVER_SELECTED_OPACITY);
      this._hoverSelectedStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, hoverSelectedColor);
      this._hoverSelectedStyle.setStyle(
        dvt.CSSStyle.COLOR,
        dvt.ColorUtils.getContrastingTextColor(hoverSelectedColor)
      );
    }

    /**
     * Updates the hover and selection feedback font size only.
     * @param {dvt.CSSStyle} size This object's font size property.
     * @private
     */
    _updateFeedbackFontStyles(size) {
      this._normalStyle.setStyle(dvt.CSSStyle.FONT_SIZE, size);
      this._hoverStyle.setStyle(dvt.CSSStyle.FONT_SIZE, size);
      this._selectedStyle.setStyle(dvt.CSSStyle.FONT_SIZE, size);
      this._hoverSelectedStyle.setStyle(dvt.CSSStyle.FONT_SIZE, size);
    }

    /**
     * Returns the normal CSSStyle of this item.
     * @return {dvt.CSSStyle} the normal CSSStyle of this item.
     */
    getItemStyle() {
      return this._normalStyle;
    }

    /**
     * Adjusts the x coordinate of a DvtTagCloudItem for animating tags that have moved from one edge to another in the
     * rectangular layout.
     * @param {DvtTagCloudItem} tag The tag to adjust
     * @param {number} x The x coordinate to evaluate
     * @param {string} hAlign The tag's horizontal text alignment
     * @return {number}
     * @private
     */
    static _adjustX(tag, x, hAlign) {
      var dims = tag.getTextDimensions();
      if (hAlign === dvt.OutputText.H_ALIGN_LEFT) return x + dims.w;
      else if (hAlign === dvt.OutputText.H_ALIGN_RIGHT) return x - dims.w;
      else return x;
    }

    /**
     * Helper function to lighten a color by blending in white
     * @param {string} color The color to lighten
     * @param {number} opacity The decimal amount of white to blend into the color from 0-1
     * @return {string}
     * @private
     */
    static _lightenColor(color, opacity) {
      var r = dvt.ColorUtils.getRed(color);
      var g = dvt.ColorUtils.getGreen(color);
      var b = dvt.ColorUtils.getBlue(color);

      var lighterR = (1 - opacity) * 255 + opacity * r;
      var lighterG = (1 - opacity) * 255 + opacity * g;
      var lighterB = (1 - opacity) * 255 + opacity * b;
      return dvt.ColorUtils.makeRGB(Math.floor(lighterR), Math.floor(lighterG), Math.floor(lighterB));
    }
  }

  /**
   * Layout utility class for dvt.TagCloud
   */
  const DvtTagCloudLayoutUtils = {
    /**
     * TODO cleanup layout functions and add jsdoc
     * @param {number} minValue
     * @param {number} maxValue
     * @param {number} range
     * @return {number}
     */
    getFontSizeFunc: (minValue, maxValue, range) => {
      return (value) => {
        return minValue === maxValue
          ? 12
          : 12 + Math.ceil((((range - 1) * (value - minValue)) / (maxValue - minValue)) * 12);
      };
    },

    /**
     * Lays out tag cloud items in a cloud shape starting in the center and spiraling outwards.  Layout is same in bidi mode.
     * @param {dvt.Rectangle} availSpace The available space.
     * @param {Array} items
     */
    cloudLayout: (availSpace, items) => {
      var positions = [];
      var steps = 180;
      var xrStep = 10 / steps;
      var yrStep = 10 / steps;
      if (availSpace.w > availSpace.h) xrStep *= availSpace.w / availSpace.h;
      else yrStep *= availSpace.h / availSpace.w;
      var thetaStep = (2 * Math.PI) / steps;
      var bounds = null;
      var maxFontSize = 0;
      var cosCache = [];
      var sinCache = [];
      for (var i = 0; i < items.length; i++) {
        var placed = false;
        var step = 0;
        var stepIncrement = 4;
        var tag = items[i];
        var dims = tag.getDimensions();
        maxFontSize = Math.max(
          maxFontSize,
          parseFloat(tag.getCSSStyle().getStyle(dvt.CSSStyle.FONT_SIZE))
        );
        var lastCollisionIndex = -1;
        while (!placed) {
          // cache sin/cos values because Chrome is slow at these calculations
          var lookup = step % steps;
          if (cosCache[lookup] === undefined) cosCache[lookup] = Math.cos(step * thetaStep);
          if (sinCache[lookup] === undefined) sinCache[lookup] = Math.sin(step * thetaStep);

          var x = xrStep * step * cosCache[lookup];
          var y = yrStep * step * sinCache[lookup];
          var rect = new dvt.Rectangle(x, y, dims.w, dims.h);
          placed = true;
          if (lastCollisionIndex != -1) {
            if (positions[lastCollisionIndex].intersects(rect)) {
              placed = false;
            }
          }
          if (placed) {
            for (var j = 0; j < i; j++) {
              if (positions[j].intersects(rect)) {
                lastCollisionIndex = j;
                placed = false;
                break;
              }
            }
          }

          if (placed) {
            if (!bounds) {
              bounds = rect;
            } else {
              bounds = bounds.getUnion(rect);
            }
            lastCollisionIndex = -1;
            positions[i] = rect;
            tag.setX(x);
            tag.setY(-dims.y + y);
          }
          // Adjust stepIncrement so we check smaller degrees as spiral loops out
          if (step === 3600)
            // 20 loops
            stepIncrement = 3;
          else if (step === 5400)
            // 30 loops
            stepIncrement = 2;
          else if (step === 10800)
            // 60 loops
            stepIncrement = 1;

          step += stepIncrement;
        }
      }
      if (bounds) {
        var scale = Math.max(bounds.w / availSpace.w, bounds.h / availSpace.h);
        var cx = bounds.x + bounds.w / 2;
        var cy = bounds.y + bounds.h / 2;
        for (var k = 0; k < items.length; k++) {
          var tagItem = items[k];
          tagItem.setX(availSpace.x + tagItem.getX() / scale + (availSpace.w / 2 - cx / scale));
          tagItem.setY(availSpace.y + tagItem.getY() / scale + (availSpace.h / 2 - cy / scale));
          var fontSize = parseFloat(tagItem.getCSSStyle().getStyle(dvt.CSSStyle.FONT_SIZE));
          tagItem.setFontSize(fontSize / scale);
        }
      }
    },

    /**
     * Lays out tag cloud items in top to bottom lines from left to right or right to left in bidi mode.
     * @param {dvt.Rectangle} availSpace The available space.
     * @param {Array} items
     * @param {boolean} isBidi
     */
    rectangleLayout: (availSpace, items, isBidi) => {
      var arDims = [];
      var maxWidth = 0;
      var maxHeight = 0;
      var maxFontSize = 0;
      var vPadding = 2;
      var margin = 5;
      // Get the unscaled dimensions
      for (var i = 0; i < items.length; i++) {
        var tag = items[i];
        var dims = tag.getDimensions();
        maxWidth = Math.max(maxWidth, dims.w);
        maxHeight = Math.max(maxHeight, dims.h);
        maxFontSize = Math.max(
          maxFontSize,
          parseFloat(tag.getCSSStyle().getStyle(dvt.CSSStyle.FONT_SIZE))
        );
        arDims.push(new dvt.Dimension(dims.w, dims.h));
      }
      // Iteratively calculate the ideal font scale
      var minScale = 0;
      var maxScale = (availSpace.w - 2 * margin) / maxWidth; // This is the max scale that can be applied before the longest word will no longer fit
      var scale;
      var arLines;
      while (maxScale - minScale > 0.001) {
        scale = (minScale + maxScale) / 2;
        arLines = DvtTagCloudLayoutUtils._calculateLineBreaks(
          arDims,
          (availSpace.w - 2 * margin) / scale
        );
        var h = arLines.length * (scale * maxHeight + vPadding) - vPadding;
        if (h > availSpace.h - 2 * margin) {
          maxScale = scale;
        } else {
          minScale = scale;
        }
      }
      // Calculate final line breaks
      scale = minScale;
      arLines = DvtTagCloudLayoutUtils._calculateLineBreaks(
        arDims,
        (availSpace.w - 2 * margin) / scale
      );
      arLines.push(items.length);
      for (var k = 0; k < arLines.length - 1; k++) {
        var lineStart = arLines[k];
        var lineEnd = arLines[k + 1];
        var hPadding = 0;
        var maxLineHeight = 0;
        var justified = true;
        if (lineEnd - lineStart > 1) {
          var lineWidth = 0;
          for (var j = lineStart; j < lineEnd; j++) {
            lineWidth += arDims[j].w * scale;
            maxLineHeight = Math.max(maxLineHeight, arDims[j].h * scale);
          }
          hPadding = (availSpace.w - 2 * margin - lineWidth) / (lineEnd - lineStart - 1);
          if (k == arLines.length - 2) {
            // Don't justify the last line unless flowing it with a gap of .5 * maxLineHeight fills more than
            // 90% of the width
            var flowPadding = 0.5 * maxLineHeight;
            if (
              flowPadding < hPadding &&
              lineWidth + (lineEnd - lineStart) * flowPadding < 0.9 * (availSpace.w - 2 * margin)
            ) {
              hPadding = flowPadding;
              justified = false;
            }
          }
        }
        var bottomY = margin + (k + 1) * (maxHeight * scale + vPadding) - vPadding;
        var curX = isBidi ? availSpace.w - margin : margin;
        for (var m = lineStart; m < lineEnd; m++) {
          var tagLine = items[m];
          var fontSize = parseFloat(tagLine.getCSSStyle().getStyle(dvt.CSSStyle.FONT_SIZE));
          tagLine.setFontSize(fontSize * scale);
          tagLine.setY(availSpace.y + bottomY);
          if (justified && m === lineEnd - 1 && m !== lineStart) {
            if (isBidi) {
              tagLine.alignLeft();
              tagLine.setX(availSpace.x + margin);
            } else {
              tagLine.alignRight();
              tagLine.setX(availSpace.x + availSpace.w - margin);
            }
          } else {
            tagLine.setX(availSpace.x + curX);
            if (isBidi) {
              tagLine.alignRight();
              curX -= arDims[m].w * scale + hPadding;
            } else {
              tagLine.alignLeft();
              curX += arDims[m].w * scale + hPadding;
            }
          }
        }
      }
    },

    /**
     * Calculates the line breaks for rectangular layout
     * @param {Array} arDims an array of dvt.Dimension objects for each tag
     * @param {number} width the available width
     * @return {Array} an array containing the starting tag index for each line in the layout
     * @private
     */
    _calculateLineBreaks: (arDims, width) => {
      var hPadding = 2;
      var lines = [0];
      var curWidth = arDims[0].w + hPadding;
      if (arDims.length > 1) {
        for (var i = 1; i < arDims.length; i++) {
          if (curWidth + arDims[i].w > width) {
            lines.push(i);
            curWidth = 0;
          }
          curWidth += arDims[i].w + hPadding;
        }
      }
      return lines;
    }
  };

  /**
   * Renderer for dvt.TagCloud.
   * @class
   */
  const DvtTagCloudRenderer = {
    /**
     * Renders the tag cloud contents into the available space.
     * @param {dvt.TagCloud} tagCloud The tag cloud being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     */
    render: (tagCloud, container, availSpace) => {
      DvtTagCloudRenderer._renderBackground(tagCloud, container, availSpace);
      DvtTagCloudRenderer._renderLegend(tagCloud, container, availSpace);
      DvtTagCloudRenderer._adjustAvailSpace(availSpace);
      var options = tagCloud.getOptions();
      if (options['items'] && options['items'].length > 0) {
        var items = DvtTagCloudRenderer._renderItems(tagCloud, container, availSpace);
        if (items.length > 0) {
          tagCloud.registerItems(items);
          tagCloud.EventManager.setFocusObj(tagCloud.getObjects()[0]);
        } else {
          DvtTagCloudRenderer._renderEmptyText(tagCloud, container, availSpace);
        }
      } else {
        DvtTagCloudRenderer._renderEmptyText(tagCloud, container, availSpace);
      }
    },

    /**
     * Renders the empty text label
     * @param {dvt.TagCloud} tagCloud The tag cloud being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @private
     */
    _renderEmptyText: (tagCloud, container, availSpace) => {
      var options = tagCloud.getOptions();
      var emptyTextStr = options['emptyText'];
      if (!emptyTextStr) {
        emptyTextStr = options.translations.labelNoData;
      }
      tagCloud.renderEmptyText(
        container,
        emptyTextStr,
        new dvt.Rectangle(availSpace.x, availSpace.y, availSpace.w, availSpace.h),
        tagCloud.EventManager,
        options['_statusMessageStyle']
      );
    },

    /**
     * Renders the tag cloud background.
     * @param {dvt.TagCloud} tagCloud The tag cloud being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @private
     */
    _renderBackground: (tagCloud, container, availSpace) => {
      // Apply invisible background for interaction support
      var rect = new dvt.Rect(
        tagCloud.getCtx(),
        availSpace.x,
        availSpace.y,
        availSpace.w,
        availSpace.h
      );
      rect.setInvisibleFill();
      container.addChild(rect);
    },

    /**
     * Renders and returns the tag cloud items.
     * @param {dvt.TagCloud} tagCloud The tag cloud being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @return {Array}
     * @private
     */
    _renderItems: (tagCloud, container, availSpace) => {
      var options = tagCloud.getOptions();
      var items = [];
      var dataItems = options['items'];
      var minValue = Number.MAX_VALUE;
      var maxValue = -Number.MAX_VALUE;
      // First iterate thru data items to find the min and max values
      for (var i = 0; i < dataItems.length; i++) {
        minValue = Math.min(minValue, dataItems[i]['value']);
        maxValue = Math.max(maxValue, dataItems[i]['value']);
      }
      // Create data items
      var fontSizeFunction = DvtTagCloudLayoutUtils.getFontSizeFunc(minValue, maxValue, 3);
      // create a boolean map of hidden categories for better performance
      var categoryMap = dvt.ArrayUtils.createBooleanMap(options['hiddenCategories']);
      //Text measurement properties
      var textProperties = dvt.CSSStyle.getTextMeasurementProperties();
      //Public default style
      var styleDefaults = options['styleDefaults'];
      var defaultStyle = styleDefaults['svgStyle'] || styleDefaults['style'];
      if (defaultStyle && !(defaultStyle instanceof Object))
        defaultStyle = dvt.CSSStyle.cssStringToObject(defaultStyle);
      //Process tag cloud items
      for (var k = 0; k < dataItems.length; k++) {
        var data = dataItems[k];
        // Default categories array to array of tag label if none provided
        if (!data['categories']) data['categories'] = [data['label']];

        if (categoryMap && dvt.ArrayUtils.hasAnyMapItem(categoryMap, data['categories'])) continue;

        var style = styleDefaults['_style'].clone();
        var itemStyle = data['svgStyle'] || data['style'];
        if (itemStyle && !(itemStyle instanceof Object))
          itemStyle = dvt.CSSStyle.cssStringToObject(itemStyle);
        //Order of precedence of processing item color is,
        //Item style color > Data item color > Public default style color.
        var defaultStyleColor = defaultStyle && defaultStyle['color'] ? defaultStyle['color'] : null;
        var dataColor = data['color'] ? data['color'] : defaultStyleColor;
        var color = itemStyle && itemStyle['color'] ? itemStyle['color'] : dataColor;

        //Merge the item style and public default style
        itemStyle = dvt.JsonUtils.merge(itemStyle, defaultStyle);
        if (itemStyle) {
          //Pull the text measurement properties from item style object to CSSStyle
          for (var index = 0; index < textProperties.length; index++) {
            //translate css string property to object attribute
            var attribute = dvt.CSSStyle.cssStringToObjectProperty(textProperties[index]);
            if (itemStyle[attribute]) {
              style.setStyle(textProperties[index], itemStyle[attribute]);
              delete itemStyle[attribute]; //Text property will be applied from CSSStyle
            }
          }
          delete itemStyle['color']; //Item color will be applied from CSSStyle
        }

        //if there is a color in the data item / item style, it will overwrite the 'color' attribute in style
        if (color) style.setStyle(dvt.CSSStyle.COLOR, color);
        style.setStyle(dvt.CSSStyle.FONT_SIZE, fontSizeFunction(data['value']).toString());

        var className = data['svgClassName'] || data['className'];
        var item = new DvtTagCloudItem(
          tagCloud,
          tagCloud.getCtx(),
          data['label'],
          0,
          0,
          style,
          itemStyle,
          className,
          data['id']
        );
        var peer = new DvtTagCloudObjPeer(tagCloud, item, data);
        tagCloud.EventManager.associate(item, peer);
        tagCloud.registerObject(peer, k);

        if (options['selectionMode'] !== 'none') peer.setSelectable(true);

        if (peer.isSelectable() || data['url'])
          item.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

        items.push(item);
        container.addChild(item);
      }

      // Layout data items if they weren't all filtered out
      if (items.length > 0) {
        if (options['layout'] === 'cloud') DvtTagCloudLayoutUtils.cloudLayout(availSpace, items);
        else
          DvtTagCloudLayoutUtils.rectangleLayout(
            availSpace,
            items,
            dvt.Agent.isRightToLeft(tagCloud.getCtx())
          );
      }
      return items;
    },

    /**
     * Renders the legend component
     * @param {dvt.TagCloud} tagCloud The tag cloud being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @private
     */
    _renderLegend: (tagCloud, container, availSpace) => {
      var options = tagCloud.getOptions();
      var legendData = options['legend'];
      if (legendData && legendData['sections']) {
        var legendOptions = dvt.JsonUtils.clone(legendData);
        legendOptions['orientation'] = 'horizontal';
        legendOptions['halign'] = 'center';
        legendOptions['hoverBehavior'] = options['hoverBehavior'];
        legendOptions['hideAndShowBehavior'] = options['hideAndShowBehavior'];
        legendOptions['hiddenCategories'] = options['hiddenCategories'];

        var legend = new dvt.Legend(tagCloud.getCtx(), tagCloud.processEvent, tagCloud);
        container.addChild(legend);
        var preferredSize = legend.getPreferredSize(legendOptions, availSpace.w, availSpace.h / 3);
        legend.render(legendOptions, preferredSize.w, preferredSize.h);
        dvt.LayoutUtils.position(availSpace, 'bottom', legend, preferredSize.w, preferredSize.h, 0);
        // Destroy the legend and remove event listeners
        if (tagCloud.legend) {
          tagCloud.legend.destroy();
          container.removeChild(tagCloud.legend);
        }
        tagCloud.legend = legend;
      }
    },

    /**
     * Helper function that adjusts the input rectangle to the closest pixel.
     * @param {dvt.Rectangle} availSpace The available space.
     * @private
     */
    _adjustAvailSpace: (availSpace) => {
      availSpace.x = Math.round(availSpace.x);
      availSpace.y = Math.round(availSpace.y);
      availSpace.w = Math.round(availSpace.w);
      availSpace.h = Math.round(availSpace.h);
    }
  };

  /**
   * TagCloud component.  The component should never be instantiated directly.  Use the newInstance function instead
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @class
   * @constructor
   * @extends {dvt.Container}
   */
  class TagCloud extends dvt.BaseComponent {
    /**
     * Initializes the component.
     * @param {dvt.Context} context The rendering context.
     * @param {string} callback The function that should be called to dispatch component events.
     * @param {object} callbackObj The optional object instance on which the callback function is defined.
     * @protected
     */

    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      this.getCtx().getStage().getElem().setAttributeNS(null, 'text-rendering', 'geometricPrecision');

      // Create the event handler and add event listeners
      this.EventManager = new DvtTagCloudEventManager(this, context, this.processEvent, this);
      this.EventManager.addListeners(this);
      // Set up keyboard handler on non-touch devices
      if (!dvt.Agent.isTouchDevice())
        this.EventManager.setKeyboardHandler(new DvtTagCloudKeyboardHandler(this.EventManager));

      // Create the defaults object
      this.Defaults = new DvtTagCloudDefaults(context);

      this._items = [];
      this._peers = [];

      /**
       * The legend of the tagCloud.  This will be set during render time.
       * @type {dvt.Legend}
       */
      this.legend = null;
      // Drag and drop support - not used in JET
      // this._dragSource = new dvt.DragSource(this.getCtx());
      // this.EventManager.setDragSource(this._dragSource);
    }

    // TODO ADD TESTS: AUTOMATION & DVT-SHARED-JS
    /**
     * @override
     */
    render(options, width, height) {
      // Update the width and height if provided
      if (!isNaN(width) && !isNaN(height)) {
        this.Width = width;
        this.Height = height;
      }

      // Cleanup objects from the previous render
      this.__cleanUp();

      // Update if a new options object has been provided or initialize with defaults if needed.
      this.SetOptions(options);

      // Animation Support
      // Stop any animation in progress
      this.StopAnimation();

      // Update old references
      this._oldContainer = this._container;
      this._oldItems = this._items;
      this._items = [];
      this._itemCollection = [];

      this._container = new dvt.Container(this.getCtx());
      this.addChild(this._container);
      DvtTagCloudRenderer.render(
        this,
        this._container,
        new dvt.Rectangle(0, 0, this.Width, this.Height)
      );

      // Initial Selection
      if (this.SelectionHandler)
        this.SelectionHandler.processInitialSelections(this.Options['selection'], this.getObjects());

      // Construct the new animation playable
      var animationDuration = this.Options['animationDuration'];
      var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
      if (!this._oldContainer) {
        if (this.Options['animationOnDisplay'] !== 'none') {
          this.Animation = dvt.BlackBoxAnimationHandler.getInAnimation(
            this.getCtx(),
            dvt.BlackBoxAnimationHandler.ALPHA_FADE,
            this._container,
            bounds,
            animationDuration
          );
        }
      } else if (this.Options['animationOnDataChange'] !== 'none' && options) {
        // Treat layout changes as data change animations and animate to new positions
        this._deleteContainer = new dvt.Container(this.getCtx());
        this.addChild(this._deleteContainer);
        var ah = new dvt.DataAnimationHandler(this.getCtx(), this._deleteContainer);
        ah.constructAnimation(this._oldItems, this._items);
        this.Animation = ah.getAnimation();
      }

      // If an animation was created, play it
      if (this.Animation) {
        this.EventManager.hideTooltip();
        // Disable event listeners temporarily
        this.EventManager.removeListeners(this);
        this.Animation.setOnEnd(this.OnRenderEnd, this);
        this.Animation.play();
      } else {
        this.OnRenderEnd();
      }

      this.UpdateAriaAttributes();
    }

    /**
     * Registers the tag cloud data item.
     * @param {array} items The array of tag cloud items
     */
    registerItems(items) {
      this._items = items;
    }

    /**
     * Returns the automation object for this thematic map
     * @return {dvt.Automation} The automation object
     */
    getAutomation() {
      if (!this.Automation) this.Automation = new DvtTagCloudAutomation(this);
      return this.Automation;
    }

    /**
     * Registers the object peer with the component.  The peer must be registered to participate
     * in interactivity.
     * @param {DvtTagCloudObjPeer} peer The logical object
     * @param {number} index The collection index of the tag cloud item
     */
    registerObject(peer, index) {
      this._peers.push(peer);
      this._itemCollection[index] = peer;
    }

    /**
     * Returns the peers for all objects within the component.
     * @return {array}
     */
    getObjects() {
      return this._peers;
    }

    /**
     * Returns an array of logical objects indexed by collection order. Items not rendered will be undefined in the array.
     * @return {Array}
     */
    getItems() {
      return this._itemCollection;
    }

    /**
     * @override
     */
    highlight(categories) {
      // Update the options
      this.Options['highlightedCategories'] = dvt.JsonUtils.clone(categories);

      // Perform the highlighting
      dvt.CategoryRolloverHandler.highlight(
        categories,
        this.getObjects(),
        this.Options['highlightMatch'] === 'any'
      );

      if (this.legend) this.legend.highlight(categories);
    }

    /**
     * @override
     */
    select(selection) {
      // Update the options
      this.Options['selection'] = dvt.JsonUtils.clone(selection);

      // Perform the selection
      if (this.SelectionHandler)
        this.SelectionHandler.processInitialSelections(this.Options['selection'], this.getObjects());
    }

    /**
     * @override
     */
    SetOptions(options) {
      super.SetOptions(options);
      if (options) {
        // Combine the user options with the defaults and store
        this.Options = this.Defaults.calcOptions(options);
      } else if (!this.Options) {
        this.Options = this.GetDefaults();
      }

      // Initialize the selection handler
      var selectionMode = this.Options['selectionMode'];
      if (selectionMode === 'single')
        this.SelectionHandler = new dvt.SelectionHandler(
          this.getCtx(),
          dvt.SelectionHandler.TYPE_SINGLE
        );
      else if (selectionMode === 'multiple')
        this.SelectionHandler = new dvt.SelectionHandler(
          this.getCtx(),
          dvt.SelectionHandler.TYPE_MULTIPLE
        );
      else this.SelectionHandler = null;

      // Pass to event handler
      this.EventManager.setSelectionHandler(this.SelectionHandler);

      if (dvt.Agent.isEnvironmentTest()) {
        this.Options['animationOnDisplay'] = 'none';
        this.Options['animationOnDataChange'] = 'none';
      }
    }

    /**
     * Hook for cleaning and processing at the end of the render call.
     * @protected
     */
    OnRenderEnd() {
      // Clean up the old container used by black box updates
      if (this._oldContainer) {
        this.removeChild(this._oldContainer);
        this._oldContainer.destroy();
        this._oldContainer = null;
      }

      if (this._deleteContainer) {
        this.removeChild(this._deleteContainer);
        this._deleteContainer.destroy();
        this._deleteContainer = null;
      }

      if (this.Animation) {
        // Restore event listeners
        this.EventManager.addListeners(this);
      }

      // Initial Highlighting
      if (this.Options['highlightedCategories'] && this.Options['highlightedCategories'].length > 0)
        this.highlight(this.Options['highlightedCategories']);

      if (!this.AnimationStopped) {
        this.RenderComplete();
      }

      // Reset animation flags
      this.Animation = null;
      this.AnimationStopped = false;
    }

    /**
     * Performs cleanup of the previously rendered content.  Note that this doesn't cleanup anything needed for animation.
     * @protected
     */
    __cleanUp() {
      this.EventManager.hideTooltip();
      // Clear the list of registered peers
      this._peers.length = 0;
    }

    /**
     * Processes the specified event.
     * @param {object} event
     * @param {object} source The component that is the source of the event, if available.
     */
    processEvent(event, source) {
      var type = event['type'];
      if (type === 'categoryHide' || type === 'categoryShow') {
        var category = event['category'];
        var index = this.Options['hiddenCategories'].indexOf(category);

        if (type === 'categoryHide' && index < 0) this.Options['hiddenCategories'].push(category);
        if (type === 'categoryShow' && index >= 0) this.Options['hiddenCategories'].splice(index, 1);

        this.render(this.Options, this.Width, this.Height);
      } else if (type === 'selection') {
        this.getOptions()['selection'] = event['selection'];
      } else if (type === 'categoryHighlight') {
        // If the tag cloud is not the source of the event, perform highlighting.
        if (this !== source) this.highlight(event['categories']);
        else if (this.legend && this.legend !== source) this.legend.processEvent(event, source);
      }
      // Dispatch the event to the callback
      if (event) this.dispatchEvent(event);
    }

    /**
     * Returns the clientId of the drag source owner if dragging is supported.
     * @param {array} clientIds Array of client ids of the drag sources
     * @return {string} return the first drag source clientId if dragging is supported
     */
    isDragSupported(clientIds) {
      // Drag and drop supported when selection is enabled, only 1 drag source
      if (this.SelectionHandler) return clientIds[0];
      else return null;
    }

    /**
     * Returns the row keys for the current drag.
     * @param {DvtTagCloudObjPeer} peer The TagCloud Object peer where the drag was initiated.
     * @return {array} The row keys for the current drag.
     */
    getDragRowKeys(peer) {
      //Select the item if not already selected
      if (!peer.isSelected()) {
        this.SelectionHandler.processClick(peer, false);
        this.EventManager.fireSelectionEvent();
      }
      // Gather the rowKeys for the selected objects
      var rowKeys = [];
      var selection = this.SelectionHandler.getSelection();
      for (var i = 0; i < selection.length; i++) {
        var item = selection[i];
        if (item instanceof DvtTagCloudObjPeer) {
          rowKeys.push(item.getId());
        }
      }

      return rowKeys;
    }

    /**
     * Returns the displayables to use for drag feedback for the current drag.
     * @return {array} The displayables for the current drag.
     */
    getDragFeedback() {
      // Gather the displayables for the selected objects
      var displayables = [];
      var selection = this.SelectionHandler.getSelection();
      for (var i = 0; i < selection.length; i++) {
        displayables = displayables.concat(selection[i].getDisplayables());
      }
      return displayables;
    }
  }

  exports.TagCloud = TagCloud;

  Object.defineProperty(exports, '__esModule', { value: true });

});
