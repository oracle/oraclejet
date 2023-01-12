/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit', 'ojs/ojdvt-timecomponent', 'ojs/ojtimeaxis-toolkit', 'ojs/ojkeyboardfocus-utils', 'ojs/ojdvt-overview'], function (exports, dvt, ojdvtTimecomponent, ojtimeaxisToolkit, ojkeyboardfocusUtils, ojdvtOverview) { 'use strict';

  /**
   * Timeline keyboard handler.
   * @param {dvt.EventManager} manager The owning dvt.EventManager.
   * @class DvtTimelineKeyboardHandler
   * @extends {TimeComponentKeyboardHandler}
   * @constructor
   */
  class DvtTimelineKeyboardHandler extends ojdvtTimecomponent.TimeComponentKeyboardHandler {
    /**
     * Whether keyboard event equates to initializing High level DnD Move
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to move initiation
     */
    isMoveInitiationEvent(event) {
      return event.keyCode === dvt.KeyboardEvent.M && event.ctrlKey;
    }

    /**
     * Whether keyboard event equates to initializing High level Start Resize
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to start resize initiation
     */
    isResizeStartInitiationEvent(event) {
      return event.keyCode === 83 && event.altKey; // alt + s
    }

    /**
     * Whether keyboard event equates to initializing High level End Resize
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to end resize initiation
     */
    isResizeEndInitiationEvent(event) {
      return event.keyCode === 69 && event.altKey; // alt + e
    }

    /**
     * Whether keyboard event equates to increasing navigation time scale during High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to increasing navigation time scale
     */
    isDnDScaleUpEvent(event) {
      return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.PAGE_UP;
    }

    /**
     * Whether keyboard event equates to decreasing navigation time scale during High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to decreasing navigation time scale
     */
    isDnDScaleDownEvent(event) {
      return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.PAGE_DOWN;
    }

    /**
     * Whether keyboard event equates to moving forward a unit of time scale during High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to moving forward a unit of time scale
     */
    isDnDForwardEvent(event) {
      var isRTL = dvt.Agent.isRightToLeft(this._eventManager._component.getCtx());
      return (
        this._eventManager.getKeyboardDnDMode() &&
        event.keyCode === (isRTL ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW)
      );
    }

    /**
     * Whether keyboard event equates to moving backward a unit of time scale during High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to moving backward a unit of time scale
     */
    isDnDBackwardEvent(event) {
      var isRTL = dvt.Agent.isRightToLeft(this._eventManager._component.getCtx());
      return (
        this._eventManager.getKeyboardDnDMode() &&
        event.keyCode === (isRTL ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW)
      );
    }

    /**
     * Whether keyboard event equates to finalizing High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to finalizing a drop
     */
    isDnDFinalizeEvent(event) {
      return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.ENTER;
    }

    /**
     * Whether keyboard event equates to cancelling a (high level) DnD dragging operation (dragging via keyboard)
     * Note that the cancelling a DnD drag (dragging via mouse) via keyboard Esc is detected in dragEnd event instead of
     * through keyboard events, which are not fired.
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to cancelling a move
     */
    isDnDCancelEvent(event) {
      return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.ESCAPE;
    }

    /**
     * @override
     */
    processKeyDown(event) {
      var keyboardUtils = this._eventManager._component.getOptions()._keyboardUtils;
      var currentNavigable = this._eventManager.getFocus();
      if (this.isMoveInitiationEvent(event)) {
        if (
          currentNavigable &&
          this._eventManager._component.isDnDMoveEnabled() &&
          !this._eventManager.isDnDDragging()
        ) {
          this._eventManager.handleKeyboardMoveInitiation(event, currentNavigable);
          dvt.EventManager.consumeEvent(event);
          return null;
        }
      }
      if (this.isResizeStartInitiationEvent(event)) {
        if (
          currentNavigable &&
          this._eventManager._component.isDnDResizeEnabled() &&
          !this._eventManager.isDnDDragging()
        ) {
          this._eventManager.handleKeyboardResizeStartInitiation(event, currentNavigable);
          dvt.EventManager.consumeEvent(event);
          return null;
        }
      }
      if (this.isResizeEndInitiationEvent(event)) {
        if (
          currentNavigable &&
          this._eventManager._component.isDnDResizeEnabled() &&
          !this._eventManager.isDnDDragging()
        ) {
          this._eventManager.handleKeyboardResizeEndInitiation(event, currentNavigable);
          dvt.EventManager.consumeEvent(event);
          return null;
        }
      }
      if (this.isDnDCancelEvent(event)) {
        this._eventManager.handleKeyboardDnDCancel();
        dvt.EventManager.consumeEvent(event);
        return null;
      }
      if (this.isDnDScaleUpEvent(event)) {
        this._eventManager.handleKeyboardDnDScaleUp(event);
        dvt.EventManager.consumeEvent(event);
        return null;
      }
      if (this.isDnDScaleDownEvent(event)) {
        this._eventManager.handleKeyboardDnDScaleDown(event);
        dvt.EventManager.consumeEvent(event);
        return null;
      }
      if (this.isDnDForwardEvent(event)) {
        this._eventManager.handleKeyboardDnDForward(event);
        dvt.EventManager.consumeEvent(event);
        return null;
      }
      if (this.isDnDBackwardEvent(event)) {
        this._eventManager.handleKeyboardDnDBackward(event);
        dvt.EventManager.consumeEvent(event);
        return null;
      }
      if (this.isDnDFinalizeEvent(event)) {
        this._eventManager.handleKeyboardDnDFinalize();
        dvt.EventManager.consumeEvent(event);
        return null;
      }

      const isActionableMode = this._eventManager._component.activeInnerElems;
      // F2 enters actionable mode
      if (!isActionableMode && currentNavigable && event.keyCode === dvt.KeyboardEvent.F2) {
        var enabled = keyboardUtils.enableAllFocusable(currentNavigable._displayable.getElem());
        if (enabled.length > 0) {
          enabled[0].focus();
          this._eventManager._component.activeInnerElems = enabled;
          currentNavigable.hasActiveInnerElems = true;
          this._eventManager._component.activeInnerElemsNode = currentNavigable;
        }
        return null;
      }
      // Esc or F2 key can be used to exit actionable mode
      if (
        isActionableMode &&
        currentNavigable &&
        (event.keyCode === dvt.KeyboardEvent.ESCAPE || event.keyCode === dvt.KeyboardEvent.F2)
      ) {
        this._eventManager._component.activeInnerElems = null;
        this._eventManager._component.activeInnerElemsNode = null;
        keyboardUtils.disableAllFocusable(currentNavigable._displayable.getElem());

        this._eventManager._component._context._parentDiv.focus();
        currentNavigable.hasActiveInnerElems = false;
        this._eventManager.ShowFocusEffect(event, currentNavigable);
        dvt.EventManager.consumeEvent(event);
        return null;
      }

      if (this._eventManager._component.isDiscreteNavigationMode()) {
        if (
          (event.keyCode && event.keyCode == dvt.KeyboardEvent.SPACE) ||
          event.keyCode == dvt.KeyboardEvent.ENTER
        ) {
          return this._eventManager.handleArrowPress(event);
        } else if (
          dvt.KeyboardEvent.isPlus(event) ||
          dvt.KeyboardEvent.isEquals(event) ||
          dvt.KeyboardEvent.isMinus(event) ||
          dvt.KeyboardEvent.isUnderscore(event)
        ) {
          // block zooming and horizontal panning.
          dvt.EventManager.consumeEvent(event);
        } else if (event.keyCode === dvt.KeyboardEvent.PAGE_UP && event.shiftKey) {
          this._eventManager.prevPage();
        } else if (event.keyCode === dvt.KeyboardEvent.PAGE_DOWN && event.shiftKey) {
          this._eventManager.nextPage();
        } else {
          return super.processKeyDown(event);
        }
      } else {
        return super.processKeyDown(event);
      }
    }

    /**
     * Finds the next navigable item based on direction.
     * @param {DvtTimelineSeriesNode} currentNavigable The item with current focus.
     * @param {dvt.KeyboardEvent} event The keyboard event.
     * @param {Array} navigableItems An array of items that could receive focus next.
     * @return {DvtTimelineSeriesNode} The next navigable item.
     */
    static getNextNavigable(currentNavigable, event, navigableItems) {
      var series = currentNavigable.getSeries();
      var seriesIndex = currentNavigable.getSeriesIndex();

      var isRTL = dvt.Agent.isRightToLeft(series.getCtx());
      var isVertical = series.isVertical();
      var isDualSeries = navigableItems.length > 1;

      // block normal navigation operations when actionable mode enabled.
      if (currentNavigable._timeline.activeInnerElems != null) {
        return;
      }

      if (
        (!isRTL && dvt.KeyboardEvent.RIGHT_ARROW === event.keyCode) ||
        (isRTL && dvt.KeyboardEvent.LEFT_ARROW === event.keyCode)
      ) {
        if (!isVertical)
          return DvtTimelineKeyboardHandler.getNextItem(
            currentNavigable,
            navigableItems[seriesIndex],
            true
          );
        else if (isDualSeries && seriesIndex !== 1)
          return DvtTimelineKeyboardHandler.getClosestItem(currentNavigable, navigableItems[1]);
      } else if (
        (!isRTL && dvt.KeyboardEvent.LEFT_ARROW === event.keyCode) ||
        (isRTL && dvt.KeyboardEvent.RIGHT_ARROW === event.keyCode)
      ) {
        if (!isVertical)
          return DvtTimelineKeyboardHandler.getNextItem(
            currentNavigable,
            navigableItems[seriesIndex],
            false
          );
        else if (isDualSeries && seriesIndex !== 0)
          return DvtTimelineKeyboardHandler.getClosestItem(currentNavigable, navigableItems[0]);
      } else if (dvt.KeyboardEvent.DOWN_ARROW === event.keyCode) {
        if (isVertical)
          return DvtTimelineKeyboardHandler.getNextItem(
            currentNavigable,
            navigableItems[seriesIndex],
            true
          );
        else if (isDualSeries && seriesIndex !== 1)
          return DvtTimelineKeyboardHandler.getClosestItem(currentNavigable, navigableItems[1]);
      } else if (dvt.KeyboardEvent.UP_ARROW === event.keyCode) {
        if (isVertical)
          return DvtTimelineKeyboardHandler.getNextItem(
            currentNavigable,
            navigableItems[seriesIndex],
            false
          );
        else if (isDualSeries && seriesIndex !== 0)
          return DvtTimelineKeyboardHandler.getClosestItem(currentNavigable, navigableItems[0]);
      }
      return null;
    }

    /**
     * Gets the next item in the given direction.
     * @param {DvtTimelineSeriesNode} item The current item.
     * @param {Array} navigableItems An array of items to traverse.
     * @param {Boolean} isNext - True iff going forward in time, false otherwise.
     * @return {DvtTimelineSeriesNode} The next item in the given direction.
     */
    static getNextItem(item, navigableItems, isNext) {
      var nextIndex = navigableItems.indexOf(item) + (isNext ? 1 : -1);
      if (nextIndex >= 0 && nextIndex < navigableItems.length) {
        return navigableItems[nextIndex];
        /* Remove keyboard nav arrow navigation
      } else if (nextIndex === -1 && item._timeline.isDiscreteNavigationMode()){
        // go back to next arrow if already at first item before
        return item._timeline._nextArrow;
      */
      } else {
        return null;
      }
    }

    /**
     * Finds the item with the closest start time to the start time of the given item.
     * @param {DvtTimelineSeriesNode} item The given item.
     * @param {Array} navigableItems An array of items to search through.
     * @return {DvtTimelineSeriesNode} The item with the closest start time.
     */
    static getClosestItem(item, navigableItems) {
      if (navigableItems.length > 0) {
        var closest = navigableItems[0];
        var itemLoc = item.getLoc();
        var dist = Math.abs(itemLoc - closest.getLoc());
        for (var i = 1; i < navigableItems.length; i++) {
          var testDist = Math.abs(itemLoc - navigableItems[i].getLoc());
          if (testDist < dist) {
            dist = testDist;
            closest = navigableItems[i];
          }
        }
        return closest;
      }
      return null;
    }
  }

  /**
   * Utility functions for Timeline tooltips.
   * @class
   */
  const DvtTimelineTooltipUtils = {
    /**
     * Returns the datatip color for the tooltip of the target item.
     * @param {DvtTimelineSeriesNode} seriesNode
     * @return {string} The datatip color.
     */
    getDatatipColor: (seriesNode) => {
      var fillColor = seriesNode.getDurationFillColor();
      if (fillColor) return fillColor;
      else return null;
    },

    /**
     * Returns the datatip string for the target item.
     * @param {DvtTimelineSeriesNode} seriesNode
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @param {boolean=} isAria whether the datatip is used for accessibility.
     * @return {string|Node|Array<Node>} The datatip string.
     */
    getDatatip: (seriesNode, isTabular, isAria) => {
      var timeline = seriesNode._timeline;

      // If performing DnD Move via keyboard and the navigation scale changed, show the scale change info instead of the normal tooltip
      if (timeline.getEventManager().isKeyboardDnDScaleChanged()) {
        // No valueFormats support for scale change info, so type is left as empty string for now
        var navigationScale = timeline.getEventManager().getKeyboardDnDNavigationScale();
        var defaultNavigationLabel =
          timeline.getEventManager().getKeyboardDnDMode() === 'move' ? 'MoveBy' : 'ResizeBy';
        var navigationScaleDesc = [];
        DvtTimelineTooltipUtils._addDatatipRow(
          navigationScaleDesc,
          timeline,
          defaultNavigationLabel,
          'MoveBy',
          navigationScale,
          isTabular
        );
        return DvtTimelineTooltipUtils._processDatatip(navigationScaleDesc, isTabular);
      }

      // Custom Tooltip via Function
      var customTooltip = timeline.getOptions()['tooltip'];
      var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;

      if (isTabular && tooltipFunc) {
        var tooltipManager = timeline.getCtx().getTooltipManager();
        var dataContext = seriesNode.getDataContext();
        return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
      }

      // Custom Tooltip via Short Desc
      var shortDesc = seriesNode.getShortDesc();
      if (shortDesc != null) return shortDesc;

      // Behavior: If someone upgrades from 5.0.0 to 6.0.0 with no code changes (ie, no shortDesc, valueFormat set),
      // old aria-label format with the translation options will work as before. If shortDesc or valueFormat is set,
      // then new behavior will override the old aria-label format and any translation settings.
      if (isAria && !timeline.getCtx().isCustomElement()) {
        var translations = timeline.getOptions().translations;
        var start = seriesNode.getDragStartTime();
        var formattedStart = timeline.getTimeAxis().formatDate(new Date(start), null, 'general');
        var itemDesc = dvt.ResourceUtils.format(translations.accessibleItemStart, [formattedStart]);

        var end = seriesNode.getDragEndTime();
        if (end && end !== start) {
          var formattedEnd = timeline.getTimeAxis().formatDate(new Date(end), null, 'general');
          itemDesc =
            itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemEnd, [formattedEnd]);
        }

        var title = seriesNode.getTitle();
        if (title != null && title !== '')
          itemDesc =
            itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemTitle, [title]);

        var description = seriesNode.getDescription();
        if (description != null && description !== '')
          itemDesc =
            itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemDesc, [description]);
        return itemDesc;
      }

      // Default Tooltip Support
      var datatipRows = [];
      DvtTimelineTooltipUtils._addItemDatatip(datatipRows, seriesNode, isTabular);

      return DvtTimelineTooltipUtils._processDatatip(datatipRows, isTabular);
    },

    /**
     * Final processing for the datatip.
     * @param {Array<string|Node>} datatipRows The current datatip.
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @return {string|Node} The processed datatip.
     * @private
     */
    _processDatatip: (datatipRows, isTabular) => {
      // Don't render tooltip if empty
      if (datatipRows.length === 0) return null;

      // Add outer table tags
      if (isTabular)
        return dvt.HtmlTooltipManager.createElement('table', null, datatipRows, [
          'oj-dvt-datatip-table'
        ]);
      else return datatipRows.join('');
    },

    /**
     * Adds the item strings to the datatip.
     * @param {Array<string|Node>} datatipRows The current datatip. This array will be mutated.
     * @param {DvtTimelineSeriesNode} seriesNode The item node.
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @private
     */
    _addItemDatatip: (datatipRows, seriesNode, isTabular) => {
      var timeline = seriesNode._timeline;

      var title = seriesNode.getTitle();
      if (title)
        DvtTimelineTooltipUtils._addDatatipRow(
          datatipRows,
          timeline,
          'title',
          'Title',
          title,
          isTabular
        );

      var description = seriesNode.getDescription();
      if (description)
        DvtTimelineTooltipUtils._addDatatipRow(
          datatipRows,
          timeline,
          'description',
          'Description',
          description,
          isTabular
        );

      var start = timeline.getEventManager()._isDndDragging
        ? seriesNode.getDragStartTime()
        : seriesNode.getStartTime();
      var end = timeline.getEventManager()._isDndDragging
        ? seriesNode.getDragEndTime()
        : seriesNode.getEndTime();
      if (start && end && end !== start) {
        DvtTimelineTooltipUtils._addDatatipRow(
          datatipRows,
          timeline,
          'start',
          'Start',
          start,
          isTabular
        );
        DvtTimelineTooltipUtils._addDatatipRow(datatipRows, timeline, 'end', 'End', end, isTabular);
      } else
        DvtTimelineTooltipUtils._addDatatipRow(
          datatipRows,
          timeline,
          'date',
          'Date',
          start,
          isTabular
        );

      var series = seriesNode._series.getLabel();
      if (series == null) series = seriesNode._series.getId();
      DvtTimelineTooltipUtils._addDatatipRow(
        datatipRows,
        timeline,
        'series',
        'Series',
        series,
        isTabular
      );
    },

    /**
     * Adds a row of item to the datatip string.
     * @param {Array<string|Node>} datatipRows The current datatip. This array will be mutated.
     * @param {Timeline} timeline The timeline instance.
     * @param {string} type The item type, e.g. series, start, end, title
     * @param {string} defaultLabel The bundle resource string for the default label.
     * @param {string|number} value The item value.
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @private
     */
    _addDatatipRow: (datatipRows, timeline, type, defaultLabel, value, isTabular) => {
      if (value == null || value === '') return;

      var options = timeline.getOptions()['styleDefaults'];
      var valueFormat = DvtTimelineTooltipUtils.getValueFormat(timeline, type);
      var tooltipDisplay = valueFormat['tooltipDisplay'];
      var translations = timeline.getOptions().translations;

      if (tooltipDisplay === 'off') return;

      // Create tooltip label
      var tooltipLabel;
      if (typeof valueFormat['tooltipLabel'] === 'string') tooltipLabel = valueFormat['tooltipLabel'];

      if (tooltipLabel == null) {
        if (defaultLabel == null) tooltipLabel = '';
        else tooltipLabel = translations['label' + defaultLabel];
      }

      // Create tooltip value
      value = DvtTimelineTooltipUtils.formatValue(timeline, type, valueFormat, value);

      if (isTabular) {
        var tds = [
          dvt.HtmlTooltipManager.createElement('td', options['tooltipLabelStyle'], tooltipLabel, [
            'oj-dvt-datatip-label'
          ]),
          dvt.HtmlTooltipManager.createElement('td', options['tooltipValueStyle'], value, [
            'oj-dvt-datatip-value'
          ])
        ];
        datatipRows.push(dvt.HtmlTooltipManager.createElement('tr', null, tds));
      } else {
        datatipRows.push(
          (datatipRows.length > 0 ? '<br>' : '') +
            dvt.ResourceUtils.format(translations.labelAndValue, [tooltipLabel, value])
        );
      }
    },

    /**
     * Returns the valueFormat of the specified type.
     * @param {Timeline} timeline
     * @param {string} type The valueFormat type, e.g. row, start, end, label.
     * @return {object} The valueFormat.
     */
    getValueFormat: (timeline, type) => {
      var valueFormats = timeline.getOptions()['valueFormats'];
      if (!valueFormats) return {};
      else if (valueFormats instanceof Array) {
        // TODO remove deprecated array support
        // Convert the deprecated array syntax to object syntax
        var obj = {};
        for (var i = 0; i < valueFormats.length; i++) {
          var valueFormat = valueFormats[i];
          obj[valueFormat['type']] = valueFormat;
        }
        timeline.getOptions()['valueFormats'] = obj;
        valueFormats = obj;
      }

      if (valueFormats[type]) return valueFormats[type];

      return {};
    },

    /**
     * Formats value with the converter from the valueFormat.
     * @param {Timeline} timeline
     * @param {string} type The item type, e.g. series, start, end, title
     * @param {object} valueFormat
     * @param {number} value The value to format.
     * @return {string} The formatted value string.
     */
    formatValue: (timeline, type, valueFormat, value) => {
      var converter = valueFormat['converter'];

      if (type === 'start' || type === 'end' || type === 'date')
        return timeline.getTimeAxis().formatDate(new Date(value), converter, 'general');

      if (converter && converter['format']) return converter['format'](value);

      return value;
    }
  };

  /**
   * Style related utility functions for Timeline.
   * @class
   */
  const DvtTimelineStyleUtils = {
    /**
     * The default zoom control diameter.
     * @const
     * @private
     */
    _DEFAULT_ZOOM_CONTROL_DIAMETER: 31,
    /**
     * The default zoom control padding.
     * @const
     * @private
     */
    _DEFAULT_ZOOM_CONTROL_PADDING: 10.5,

    /**
     * The default zoom control spacing.
     * @const
     * @private
     */
    _DEFAULT_ZOOM_CONTROL_SPACING: 9,

    /**
     * Gets the item description style.
     * @param {DvtTimelineSeriesNode} item The item to be styled.
     * @return {dvt.CSSStyle} The item description style.
     */
    getItemDescriptionStyle: (item) => {
      var options = item._series.getOptions();
      var descriptionStyle = options['styleDefaults']['item']['descriptionStyle'];
      var style = item.getStyle();
      if (style) {
        var cssStyle = new dvt.CSSStyle(style);
        descriptionStyle.parseInlineStyle(cssStyle);
      }
      return descriptionStyle;
    },

    /**
     * Gets the item title style.
     * @param {DvtTimelineSeriesNode} item The item to be styled.
     * @return {dvt.CSSStyle} The item title style.
     */
    getItemTitleStyle: (item) => {
      var options = item._series.getOptions();
      var titleStyle = options['styleDefaults']['item']['titleStyle'];
      var style = item.getStyle();
      if (style) {
        var cssStyle = new dvt.CSSStyle(style);
        titleStyle.parseInlineStyle(cssStyle);
      }
      return titleStyle;
    },

    /**
     * Gets the reference object color.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The reference object color.
     */
    getReferenceObjectColor: (options) => {
      return options['styleDefaults']['referenceObject']['color'];
    },

    /**
     * Gets the series label style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The series label style.
     */
    getSeriesLabelStyle: (options) => {
      //Style Defaults
      return options['styleDefaults']['series']['labelStyle'];
    },

    /**
     * Gets the series label background style.
     * @return {string} The series label background style.
     */
    getSeriesLabelBackgroundStyle: () => {
      return 'background-color:#f9f9f9';
    },

    /**
     * Gets the series label background opacity.
     * @return {number} The series label background opacity.
     */
    getSeriesLabelBackgroundOpacity: () => {
      return 0.8;
    },

    /**
     * Gets the series label padding.
     * @return {number} The series label padding.
     */
    getSeriesLabelPadding: () => {
      return 2;
    },

    /**
     * Gets the series label spacing.
     * @return {number} The series label spacing.
     */
    getSeriesLabelSpacing: () => {
      return 20;
    },

    /**
     * Gets the empty text style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The empty text style.
     */
    getEmptyTextStyle: (options) => {
      //Style Defaults
      return options['styleDefaults']['series']['emptyTextStyle'];
    },

    /**
     * Gets the item bubble offset.
     * @param {DvtTimeline} timeline to check if feelers enabled
     * @return {number} The item bubble offset.
     */
    getBubbleOffset: (timeline) => {
      return timeline.getCtx().getThemeBehavior() === 'alta' || timeline.isFeelerEnabled() ? 20 : 0;
    },

    /**
     * Gets the item bubble spacing.
     * @return {number} The item bubble spacing.
     */
    getBubbleSpacing: () => {
      return 15;
    },

    /**
     * Gets the item bubble padding.
     * @param {DvtTimelineSeriesNode} item The target item.
     * @return {object} The bubble padding of shape { top, bottom, start, end }
     */
    getBubblePadding: (item) => {
      var options = item._timeline.Options;
      var itemStyleDefaults = options.styleDefaults.item;
      var hasColorStripe = item.hasColorStripe();
      var customRenderer = options.itemBubbleContentRenderer;
      if (customRenderer) {
        return {
          top: 0,
          bottom: 0,
          start: 0,
          end: 0
        };
      }
      if (hasColorStripe) {
        return {
          top: Number(
            DvtTimelineStyleUtils.getNumberFromString(itemStyleDefaults._withStripePaddingTop)
          ),
          bottom: Number(
            DvtTimelineStyleUtils.getNumberFromString(itemStyleDefaults._withStripePaddingBottom)
          ),
          start: Number(
            DvtTimelineStyleUtils.getNumberFromString(itemStyleDefaults._withStripePaddingStart)
          ),
          end: Number(
            DvtTimelineStyleUtils.getNumberFromString(itemStyleDefaults._withStripePaddingEnd)
          )
        };
      }
      var padding = Number(DvtTimelineStyleUtils.getNumberFromString(itemStyleDefaults.padding));
      return {
        top: padding,
        bottom: padding,
        start: padding,
        end: padding
      };
    },

    /**
     * Gets the item bubble margin.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The bubble margin.
     */
    getBubbleRadius: (options) => {
      return DvtTimelineStyleUtils.getNumberFromString(
        options['styleDefaults']['item']['borderRadius']
      );
    },

    /**
     * Gets the item content spacing.
     * @return {number} The item content spacing.
     */
    getItemContentSpacing: () => {
      return 2;
    },

    /**
     * Gets the item fill color.
     * @param {DvtTimelineSeriesNode} item The item to be styled.
     * @return {string} The item fill color.
     */
    getItemFillColor: (item) => {
      var style = item.getStyle();
      if (style) {
        var cssStyle = new dvt.CSSStyle(style);
        var fillColor = cssStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
        if (fillColor) return fillColor;
      }
      var options = item._series.getOptions();
      return options['styleDefaults']['item']['backgroundColor'];
    },

    /**
     * Gets the item stroke color.
     * @param {DvtTimelineSeriesNode} item The item to be styled.
     * @return {string} The item stroke color.
     */
    getItemStrokeColor: (item) => {
      var style = item.getStyle();
      if (style) {
        var cssStyle = new dvt.CSSStyle(style);
        var strokeColor = cssStyle.getStyle(dvt.CSSStyle.BORDER_COLOR);
        if (strokeColor) return strokeColor;
      }
      var options = item._series.getOptions();
      return options['styleDefaults']['item']['borderColor'];
    },

    /**
     * Gets the item stroke width.
     * @return {number} The item stroke width.
     */
    getItemStrokeWidth: () => {
      return 1;
    },

    /**
     * Gets the item hover fill color.
     * @param {DvtTimelineSeriesNode} item The item to be styled.
     * @return {string} The item hover fill color.
     */
    getItemHoverFillColor: (item) => {
      var options = item._series.getOptions();
      var hoverDefault = options['styleDefaults']['item']['hoverBackgroundColor'];
      if (hoverDefault) return hoverDefault;
      else return DvtTimelineStyleUtils.getItemFillColor(item);
    },

    /**
     * Gets the item hover stroke color.
     * @param {DvtTimelineSeriesNode} item The item to be styled.
     * @return {string} The item hover stroke color.
     */
    getItemHoverStrokeColor: (item) => {
      var options = item._series.getOptions();
      var hoverDefault = options['styleDefaults']['item']['hoverBorderColor'];
      if (hoverDefault) return hoverDefault;
      else return DvtTimelineStyleUtils.getItemStrokeColor(item);
    },

    /**
     * Gets the item hover stroke width.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The item hover stroke width.
     */
    getItemHoverStrokeWidth: (options) => {
      return DvtTimelineStyleUtils.getNumberFromString(
        options['styleDefaults']['item']['hoverStrokeWidth']
      );
    },

    /**
     * Gets the item selected fill color.
     * @param {DvtTimelineSeriesNode} item The item to be styled.
     * @return {string} The item selected fill color.
     */
    getItemSelectedFillColor: (item) => {
      var options = item._series.getOptions();
      var selectedDefault = options['styleDefaults']['item']['selectedBackgroundColor'];
      if (selectedDefault) return selectedDefault;
      else return DvtTimelineStyleUtils.getItemFillColor(item);
    },

    /**
     * Gets the item selected stroke color.
     * @param {DvtTimelineSeriesNode} item The item to be styled.
     * @return {string} The item selected stroke color.
     */
    getItemSelectedStrokeColor: (item) => {
      var options = item._series.getOptions();
      var selectedDefault = options['styleDefaults']['item']['selectedBorderColor'];
      if (selectedDefault) return selectedDefault;
      else return DvtTimelineStyleUtils.getItemStrokeColor(item);
    },

    /**
     * Gets the item selected stroke width.
     * @return {number} The item selected stroke width.
     */
    getItemSelectedStrokeWidth: () => {
      return 2;
    },

    /**
     * Gets color stripe margin start.
     * @returns {number} The color stripe margin start.
     */
    getColorStripeMarginStart: (options) => {
      return Number(
        DvtTimelineStyleUtils.getNumberFromString(options.styleDefaults.item._stripeMarginStart)
      );
    },

    /**
     * Gets color stripe margin top.
     * @returns {number} The color stripe margin top.
     */
    getColorStripeMarginTop: (options) => {
      return Number(
        DvtTimelineStyleUtils.getNumberFromString(options.styleDefaults.item._stripeMarginTop)
      );
    },

    /**
     * Gets color stripe margin bottom.
     * @returns {number} The color stripe margin bottom.
     */
    getColorStripeMarginBottom: (options) => {
      return Number(
        DvtTimelineStyleUtils.getNumberFromString(options.styleDefaults.item._stripeMarginBottom)
      );
    },

    /**
     * Gets the color stripe width.
     * @return {number} The color stripe width.
     */
    getColorStripeWidth: (options) => {
      return Number(
        DvtTimelineStyleUtils.getNumberFromString(options.styleDefaults.item._stripeWidth)
      );
    },

    /**
     * Gets the color stripe border radius.
     * @return {number} The color stripe border radius.
     */
    getColorStripeBorderRadius: (options) => {
      return Number(
        DvtTimelineStyleUtils.getNumberFromString(options.styleDefaults.item._stripeBorderRadius)
      );
    },

    /**
     * Gets the series style.
     * @return {string} The series style.
     */
    getSeriesStyle: () => {
      return 'background-color:#f9f9f9;';
    },

    /**
     * Gets the series color array.
     * @param {object} options The object containing data and specifications for the component.
     * @return {array} The series color array.
     */
    getColorsArray: (options) => {
      //Style Defaults
      return options['styleDefaults']['series']['colors'];
    },

    /**
     * Gets the duration feeler offset.
     * @return {number} The duration feeler offset.
     */
    getDurationFeelerOffset: () => {
      return 10;
    },

    /**
     * Gets the item thumbnail width.
     * @return {number} The item thumbnail width.
     */
    getThumbnailWidth: () => {
      return 32;
    },

    /**
     * Gets the item thumbnail height.
     * @return {number} The item thumbnail height.
     */
    getThumbnailHeight: () => {
      return 32;
    },

    /**
     * Gets the series axis separator style.
     * @return {string} The series axis separator style.
     */
    getSeriesAxisSeparatorStyle: () => {
      return 'color:#bcc7d2';
    },

    /**
     * Gets the item inner active stroke color.
     * @return {string} The item inner active stroke color.
     */
    getItemInnerActiveStrokeColor: () => {
      return '#e4f0fa';
    },

    /**
     * Gets the item inner fill color.
     * @return {string} The item inner fill color.
     */
    getItemInnerFillColor: () => {
      return 'rgba(249,249,249,0)';
    },

    /**
     * Gets the item inner stroke color.
     * @return {string} The item inner stroke color.
     */
    getItemInnerStrokeColor: () => {
      return 'rgba(249,249,249,0)';
    },

    /**
     * Gets the item inner stroke width.
     * @return {number} The item inner stroke width.
     */
    getItemInnerStrokeWidth: () => {
      return 2;
    },

    /**
     * Gets the timeline style.
     * @return {string} The timeline style.
     */
    getTimelineStyle: () => {
      return 'border:1px #d9dfe3;background-color:#f9f9f9;';
    },

    /**
     * Gets the overview width.
     * @return {number} The overview width.
     */
    getOverviewWidth: () => {
      return 60;
    },

    /**
     * Gets the overview height.
     * @return {number} The overview height.
     */
    getOverviewHeight: () => {
      return 100;
    },

    /**
     * Gets the fixed viewport navigation arrow width.
     * @return {number} The overview height.
     */
    getNavigationArrowWidth: () => {
      return 32;
    },

    /**
     * Gets the fixed viewport navigation arrow padding.
     * @return {number} The overview height.
     */
    getNavigationArrowPadding: () => {
      return 8;
    },

    /**
     * Gets the overview window background color.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The overview window background color.
     */
    getOverviewWindowBackgroundColor: (options) => {
      return options['styleDefaults']['overview']['window']['backgroundColor'];
    },

    /**
     * Gets the overview window border color.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The overview window border color.
     */
    getOverviewWindowBorderColor: (options) => {
      return options['styleDefaults']['overview']['window']['borderColor'];
    },

    /**
     * Gets the overview background color.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The overview background color.
     */
    getOverviewBackgroundColor: (options) => {
      return options['styleDefaults']['overview']['backgroundColor'];
    },

    /**
     * Gets the overview label style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The overview label style.
     */
    getOverviewLabelStyle: (options) => {
      return options['styleDefaults']['overview']['labelStyle'];
    },

    /**
     * Gets the series axis label style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The series axis label style.
     */
    getSeriesAxisLabelStyle: (options) => {
      return options['styleDefaults']['majorAxis']['labelStyle'];
    },

    /**
     * Gets the series axis label background style.
     * @return {string} The series axis label background style.
     */
    getSeriesAxisLabelBackgroundStyle: () => {
      return 'background-color:#f9f9f9';
    },

    /**
     * Gets the series axis label background opacity.
     * @return {number} The series axis label background opacity.
     */
    getSeriesAxisLabelBackgroundOpacity: () => {
      return 0.8;
    },

    /**
     * Gets the axis separator style.
     * @return {string} The axis separator style.
     */
    getAxisSeparatorStyle: () => {
      return 'color:#bcc7d2;';
    },

    /**
     * Gets the series axis label padding.
     * @return {number} The series axis label padding.
     */
    getSeriesAxisLabelPadding: () => {
      return 1;
    },

    /**
     * Returns the animation duration in seconds for the component. This duration is
     * intended to be passed to the animation handler, and is not in the same units
     * as the API.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The animation duration in seconds.
     */
    getAnimationDuration: (options) => {
      return dvt.CSSStyle.getTimeMilliseconds(options['styleDefaults']['animationDuration']) / 1000;
    },

    /**
     * Returns the style object as a dvt.CSSStyle if it is not already one
     * @param {object | dvt.CSSStyle} style the input style object
     * @return {dvt.CSSStyle} The style as a dvt.CSSStyle
     */
    convertToCSSStyle: (style) => {
      if (style != null && !(style instanceof dvt.CSSStyle)) {
        return new dvt.CSSStyle(style);
      }
      return style;
    },

    /**
     * Returns a number parsed from the string css value
     * @param {string} cssString
     * @return {number} The parsed css number value or null if no string provided
     */
    getNumberFromString: (cssString) => {
      if (cssString) {
        var numVal = cssString.match(/(\d+)/)[0];
        return numVal;
      }
      return null;
    },

    /**
     * Returns min width for duration event bubble
     * @return {number} The minimum width of the duration event bubble
     */
    getMinDurationEvent: (item) => {
      var option = item._timeline.Options;
      var hasColorStripe = item.hasColorStripe();
      if (hasColorStripe) {
        return (
          2 * DvtTimelineStyleUtils.getColorStripeMarginStart(option) +
          DvtTimelineStyleUtils.getColorStripeWidth(option)
        );
      }
      return 8;
    },

    /**
     * Returns size for content bubble arrow
     * @return {number} The size of the content bubble arrow
     */
    getContentBubbleArrow: () => {
      return 7.5;
    },

    /**
     * Returns size for content bubble spacing
     * @return {number} The size of the content bubble space
     */
    getContentBubbleSpacing: () => {
      return 15.5;
    },

    /**
     * Returns width/height for the nav arrow button background
     * @return {number} The width/height of the nav arrow button background
     */
    getNavButtonBackgroundWidth: () => {
      return 60;
    },

    /**
     * Returns width/height for the nav arrow button
     * @return {number} The width/height of the nav arrow button
     */
    getNavButtonWidth: () => {
      return 36;
    },

    /**
     * Returns bgcolor for content bubble
     * @return {string} The bgcolor of the content bubble
     */
    getContentBubbleBackgroundColor: (options) => {
      return options['styleDefaults']['durationEventOverflow']['backgroundColor'];
    }
  };

  /**
   * Class representing a TimelineSeries node.
   * @param {object} props The properties for the node.
   * @class
   * @constructor
   *
   * @implements {DvtKeyboardNavigable}
   * @implements {DvtSelectable}
   * @implements {DvtDraggable}
   */
  class DvtTimelineSeriesNode {
    constructor(timeline, seriesIndex, props) {
      this._timeline = timeline;
      this._seriesIndex = seriesIndex;
      this._series = timeline._series[seriesIndex];
      this._props = props;
      this._id = props.id;
      this._rowKey = props.rowKey;

      this._startTime = parseInt(props.startTime);

      // TODO: warn user if endTime is invalid
      if (props.endTime) this._endTime = parseInt(props.endTime);

      this._title = props.title;
      this._desc = props.desc;
      this._thumbnail = props.thumbnail;
      this._shortDesc = props.shortDesc;
      this._background = props.background;

      this._style = props.style;
      this._data = props.data;
      this._durationFillColor = props.durationFillColor;
      this._durationSize = 0;

      //custom marker handling (for ADF)
      this._markerShape = props.markerShape;
      this._markerScaleX = props.markerScaleX;
      this._markerScaleY = props.markerScaleY;
      this._markerShortDesc = props.markerShortDesc;
      this._markerFillColor = props.markerFillColor;
      this._markerGradientFill = props.markerGradientFill;
      this._markerOpacity = props.markerOpacity;
      this._markerSD = props.markerSD;

      this._data = props.data;

      this._state = { focused: false, hovered: false, selected: false };
      this._previousState = { focused: false, hovered: false, selected: false };
    }

    getId() {
      return this._id;
    }

    getSeries() {
      return this._series;
    }

    getSeriesIndex() {
      return this._seriesIndex;
    }

    getRowKey() {
      return this._rowKey;
    }

    getStartTime() {
      return this._startTime;
    }

    setStartTime(startTime) {
      this._startTime = startTime;
    }

    getEndTime() {
      return this._endTime;
    }

    setEndTime(endTime) {
      this._endTime = endTime;
    }

    getTitle() {
      return this._title;
    }

    getDescription() {
      return this._desc;
    }

    getThumbnail() {
      return this._thumbnail;
    }

    getBackground() {
      return this._background;
    }

    getShortDesc() {
      var shortDesc = this._shortDesc;
      return typeof shortDesc === 'function'
        ? shortDesc(DvtTimelineSeriesNode.getShortDescContext(this))
        : shortDesc;
    }

    getStyle() {
      return this._style;
    }

    /**
     * Sets the style of the node.
     * @param {string} style The style of the node.
     */
    setStyle(style) {
      this._style = style;
    }

    /**
     * Sets the background color of the node.
     * @param {string} color The background color of the node.
     * The color enum values are 'red'|'blue'|'orange'|'purple'|'teal'|'green'.
     */
    setBackground(color) {
      this._background = color;
    }

    ///////////////////// association of visual parts with node /////////////////////////

    getBubble() {
      return this._displayable;
    }

    setBubble(displayable) {
      this._displayable = displayable;
    }

    getContentBubble() {
      return this._displayableContent;
    }

    setContentBubble(displayableContent) {
      this._displayableContent = displayableContent;
    }

    getColorStripe() {
      return this._colorStripe;
    }

    setColorStripe(colorStripe) {
      this._colorStripe = colorStripe;
    }

    createColorStripe() {
      let options = this._timeline.getOptions();
      let context = this.getSeries().getCtx();
      let isRTL = dvt.Agent.isRightToLeft(context);
      let nodeWidth = this.getDurationWidth();
      let stripeMarginStart = DvtTimelineStyleUtils.getColorStripeMarginStart(options);
      let stripeMarginTop = DvtTimelineStyleUtils.getColorStripeMarginTop(options);
      let stripeMarginBottom = DvtTimelineStyleUtils.getColorStripeMarginBottom(options);
      let stripeWidth = DvtTimelineStyleUtils.getColorStripeWidth(options);
      let stripeHeight = this.getHeight() - (stripeMarginTop + stripeMarginBottom);
      let stripeX = isRTL ? nodeWidth - stripeMarginStart - stripeWidth : stripeMarginStart;
      let stripeY = stripeMarginTop;
      let stripeBR = DvtTimelineStyleUtils.getColorStripeBorderRadius(options);
      let colorStripe = new dvt.Rect(context, stripeX, stripeY, stripeWidth, stripeHeight);
      colorStripe.setCornerRadius(stripeBR);
      return colorStripe;
    }

    getFeeler() {
      return this._feeler;
    }

    setFeeler(feeler) {
      this._feeler = feeler;
    }

    getDurationBar() {
      return this._durationBar;
    }

    setDurationBar(durationBar) {
      this._durationBar = durationBar;
    }

    getLoc() {
      return this._loc;
    }

    setLoc(loc) {
      this._loc = loc;
    }

    getSpacing() {
      return this._spacing;
    }

    setSpacing(spacing) {
      this._spacing = spacing;
    }

    getEndViewportCollision() {
      return this._endViewportCollision;
    }

    setEndViewportCollision(endViewportCollision) {
      this._endViewportCollision = endViewportCollision;
    }

    getDurationLevel() {
      return this._durationLevel;
    }

    setDurationLevel(durationLevel) {
      this._durationLevel = durationLevel;
    }

    getDurationSize() {
      return this._durationSize;
    }

    setDurationSize(durationSize) {
      this._durationSize = durationSize;
    }

    getDurationFillColor() {
      return this._durationFillColor;
    }

    setDurationFillColor(durationFillColor) {
      this._durationFillColor = durationFillColor;
    }

    getLabel() {
      var translations = this._timeline.getOptions().translations;
      var start = this.getStartTime();
      var formattedStart = this._timeline.getTimeAxis().formatDate(new Date(start), null, 'general');
      var itemDesc = dvt.ResourceUtils.format(translations.accessibleItemStart, [formattedStart]);

      var end = this.getEndTime();
      if (end != null && end !== start) {
        var formattedEnd = this._timeline.getTimeAxis().formatDate(new Date(end), null, 'general');
        itemDesc =
          itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemEnd, [formattedEnd]);
      }

      var title = this.getTitle();
      if (title != null && title !== '')
        itemDesc =
          itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemTitle, [title]);

      var description = this.getDescription();
      if (description != null && description !== '')
        itemDesc =
          itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemDesc, [description]);
      return itemDesc;
    }

    getWidth() {
      return this._w;
    }

    setWidth(w) {
      this._w = w;
    }

    getContentWidth() {
      return this._cw;
    }

    setContentWidth(cw) {
      this._cw = cw;
    }

    getDurationWidth() {
      return this._dw;
    }

    setDurationWidth(dw) {
      this._dw = dw;
    }

    getHeight() {
      return this._h;
    }

    setHeight(h) {
      this._h = h;
    }

    getResizeHandleEnd() {
      return this._resizeHandleEnd;
    }

    setResizeHandleEnd(resizeHandleEnd) {
      this._resizeHandleEnd = resizeHandleEnd;
    }

    getResizeHandleStart() {
      return this._resizeHandleStart;
    }

    setResizeHandleStart(resizeHandleStart) {
      this._resizeHandleStart = resizeHandleStart;
    }

    /**
     * Gets the marker shape for this item.
     * @return {string} The marker shape for this item.
     */
    getMarkerShape() {
      return this._markerShape;
    }

    /**
     * Gets the marker scaleX value for this item.
     * @return {number} The marker scaleX value for this item.
     */
    getMarkerScaleX() {
      return this._markerScaleX;
    }

    /**
     * Gets the marker scaleY value for this item.
     * @return {number} The marker scaleY value for this item.
     */
    getMarkerScaleY() {
      return this._markerScaleY;
    }

    /**
     * Gets the marker short description for this item.
     * @return {string} The marker short description for this item.
     */
    getMarkerShortDesc() {
      return this._markerShortDesc;
    }

    /**
     * Gets the marker fill color for this item.
     * @return {string} The marker fill color for this item.
     */
    getMarkerFillColor() {
      return this._markerFillColor;
    }

    /**
     * Gets the marker gradient fill for this item.
     * @return {string} The marker gradient fill for this item.
     */
    getMarkerGradientFill() {
      return this._markerGradientFill;
    }

    /**
     * Gets the marker opacity for this item.
     * @return {number} The marker opacity for this item.
     */
    getMarkerOpacity() {
      return this._markerOpacity;
    }

    /**
     * Gets the marker default value for this item.
     * @return {number} The marker default value for this item.
     */
    getMarkerSD() {
      return this._markerSD;
    }

    /**
     * Implemented for DvtKeyboardNavigable
     * @override
     */
    getNextNavigable(event) {
      var keyboardHandler = this._timeline.EventManager.getKeyboardHandler();
      if (event.type === dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event)) {
        return this;
      } else if (keyboardHandler.isNavigationEvent(event)) {
        var navigableItems = [];
        for (var i = 0; i < this._timeline._series.length; i++) {
          navigableItems.push(this._timeline._series[i]._items);
        }
        return DvtTimelineKeyboardHandler.getNextNavigable(this, event, navigableItems);
      } else {
        return null;
      }
    }

    /**
     * Implemented for DvtKeyboardNavigable
     * @override
     */
    getTargetElem() {
      return this._displayable.getElem();
    }

    /**
     * Implemented for DvtKeyboardNavigable
     * @override
     */
    getKeyboardBoundingBox(targetCoordinateSpace) {
      return this._displayable.getDimensions(targetCoordinateSpace);
    }

    /**
     * Implemented for DvtKeyboardNavigable
     * @override
     */
    showKeyboardFocusEffect() {
      this._isShowingKeyboardFocusEffect = true;
      this.showHoverEffect();
      this._timeline.updateScrollForItemNavigation(this);
    }

    /**
     * Implemented for DvtKeyboardNavigable
     * @override
     */
    hideKeyboardFocusEffect() {
      this._isShowingKeyboardFocusEffect = false;
      this.hideHoverEffect();

      // turn off actionable mode if it is enabled
      /* TODO https://jira.oraclecorp.com/jira/browse/JET-48114
      if (this._timeline.activeInnerElems) {
        this._timeline.activeInnerElems = null;
        this._disableAllTabElements();
        this._timeline._context._parentDiv.focus();
        this.hasActiveInnerElems = false;
        this._timeline.getEventManager().ShowFocusEffect(null, this);
      }*/
    }

    /**
     * Implemented for DvtKeyboardNavigable
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
      var options = this._timeline.getOptions();
      var translations = options.translations;
      var keyboardUtils = options._keyboardUtils;
      var states = [];
      if (this.isSelectable()) {
        states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
      }
      var actionableElems = keyboardUtils.getActionableElementsInNode(this._displayable.getElem());
      if (actionableElems.length > 0) {
        states.push(translations.accessibleContainsControls);
      }
      var shortDesc = DvtTimelineTooltipUtils.getDatatip(this, false);
      return dvt.Displayable.generateAriaLabel(shortDesc, states);
    }

    /**
     * Gets the data associated with this series node
     * @param {boolean} isPublic Whether to retrieve a cleaned version of the data that would be publicly exposed
     * @return {Object} the data object
     */
    getData(isPublic) {
      if (isPublic) {
        return ojdvtTimecomponent.TimeComponent.sanitizeData(this._data, 'item');
      }
      return this._data;
    }

    /**
     * Gets the data associated with this series node
     * @param {boolean} data node data
     * @return {Object} the data object
     */
    setData(data) {
      this._data = data;
    }

    /**
     * Gets the item type associated with this series node
     * event: item bubble using only the start date
     * duration-bar: item bubble with a bar on the time-axis that matches the duration of the event using the start/end dates
     * duration-event: item bubble with width equal to the duration and edges of the event matching the start/end date (only available on horizontal timeline)
     * auto (default behavior): event item-type if end date not specified, duration-bar if end date specified.
     *
     * @return {string} The string value of the item type
     */
    getItemType() {
      var itemType = this._data.itemType;

      // Default to auto if not specified
      if (!itemType || itemType === 'auto') {
        if (!this._endTime) {
          // no end time so use event
          return 'event';
        } else {
          return DvtTimelineSeriesNode.DURATION_BAR;
        }
      } else {
        if (!this._endTime) {
          // if no end time, just use event
          return 'event';
        }
        if (
          itemType !== 'event' &&
          (this._series.isVertical() || this._timeline.getCtx().getThemeBehavior() === 'alta')
        ) {
          // duration-event not supported in vertical mode or alta
          return DvtTimelineSeriesNode.DURATION_BAR;
        } else {
          return itemType;
        }
      }
    }

    /**
     * Gets the context to be passed into custom renderer callbacks
     * @return {object} The renderer context
     */
    getRendererContext() {
      var data = this.getData();
      var itemData = data['_itemData'];

      // if duration-event item type, provide the duration event width based on
      // difference between end and start time (or min duration event whichever is larger)
      var durationWidth =
        this.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT
          ? Math.max(
              this._timeline.getDatePos(this._endTime) - this._timeline.getDatePos(this._startTime),
              DvtTimelineStyleUtils.getMinDurationEvent(this)
            )
          : null;

      return {
        data: this.getData(true),
        itemData: itemData ? itemData : null,
        seriesData: this._series.getData(true),
        previousState: this._previousState,
        state: this._state,
        durationWidth: durationWidth,
        contentWidth: this.getAvailableContentWidth()
      };
    }

    /**
     * Gets the available width for content in a duration event bubble.
     * @param {number=} durationWidth Optional duration width to use (e.g. in discrete navigation mode, the "duration width" may be clipped by the viewport). Otherwise the item's end - start width is used.
     * @return {number|null} The available width in pixels, or null if not applicable.
     */
    getAvailableContentWidth(durationWidth) {
      var bubbleWidth =
        durationWidth != null
          ? durationWidth
          : this._timeline.getDatePos(this._endTime) - this._timeline.getDatePos(this._startTime);
      var artifactWidth = this.hasColorStripe()
        ? DvtTimelineStyleUtils.getColorStripeMarginStart(this._timeline.Options) +
          DvtTimelineStyleUtils.getColorStripeWidth(this._timeline.Options)
        : 0;
      var contentWidth =
        this.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT
          ? bubbleWidth - artifactWidth
          : null;
      return Math.floor(contentWidth);
    }

    /**
     * Returns the data context (e.g. for passing to tooltip renderer, etc.)
     * @return {object}
     */
    getDataContext() {
      var data = this.getData();
      var itemData = data['_itemData'];
      return {
        data: this.getData(true),
        seriesData: this._series.getData(true),
        itemData: itemData ? itemData : null,
        color: DvtTimelineTooltipUtils.getDatatipColor(this),
        component: this._timeline.getOptions()['_widgetConstructor']
      };
    }
    /**
     * Returns the shortDesc Context of the node.
     * @param {DvtTimelineSeriesNode} node
     * @return {object}
     */
    static getShortDescContext(node) {
      var itemData = node.getData()['_itemData'];
      return {
        data: node.getData(true),
        seriesData: node._series.getData(true),
        itemData: itemData ? itemData : null
      };
    }

    /**
     * Implemented for DvtTooltipSource
     * @override
     */
    getDatatip() {
      return DvtTimelineTooltipUtils.getDatatip(this, true);
    }

    /**
     * Implemented for DvtTooltipSource
     * @override
     */
    getDatatipColor() {
      return DvtTimelineTooltipUtils.getDatatipColor(this);
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    setSelectable(isSelectable) {
      this._isSelectable = isSelectable;
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    isSelectable() {
      return this._isSelectable;
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
    setSelected(isSelected) {
      this._isSelected = isSelected;
      this._displayable.setSelected(isSelected);
      this._updateAriaLabel();
      if (this._timeline._hasOverview && this._timeline._overview) {
        if (isSelected) {
          this.changeState('selected', true, true);
          this._timeline._overview.selSelectItem(this.getId());
        } else {
          this.changeState('selected', false, true);
          this._timeline._overview.selUnselectItem(this.getId());
        }
      }
    }

    /**
     * Returns the data context (e.g. for passing to tooltip renderer, etc.)
     * @param {string} state the state value to be changed
     * @param {boolean} value the new state value
     * @param {boolean} override boolean to determine whether to add value to state
     *                           or change state to previousState and create new state
     */
    changeState(state, value, override) {
      if (override) {
        this._previousState = this._state;
        this._state = { focused: false, hovered: false, selected: false };
        this._state[state] = value;
      } else {
        this._state[state] = value;
      }
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    showHoverEffect(ignoreOverview) {
      var isFocused = this._timeline.EventManager.getFocus() === this;
      this.changeState('focused', isFocused, true);

      this._displayable.showHoverEffect(isFocused);
      this.changeState('hovered', true);

      if (!ignoreOverview && this._timeline._hasOverview)
        this._timeline._overview.highlightItem(this.getId());
      if (this._timeline._isVertical || this._series._isRandomItemLayout) {
        if (!this._index) this._index = this._series._blocks[0].getChildIndex(this.getBubble());
        this._series._blocks[0].addChild(this.getBubble());
      }
    }

    /**
     * Implemented for DvtSelectable
     * @override
     */
    hideHoverEffect(ignoreOverview) {
      var isFocused = this._timeline.EventManager.getFocus() === this;
      this.changeState('focused', isFocused, true);

      this._displayable.hideHoverEffect(isFocused);
      this.changeState('hovered', false);

      if (!ignoreOverview && this._timeline._hasOverview)
        this._timeline._overview.unhighlightItem(this.getId());
      if (
        (this._timeline._isVertical || this._series._isRandomItemLayout) &&
        this._index &&
        !this._isSelected
      )
        this._series._blocks[0].addChildAt(this.getBubble(), this._index);
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
      // return null to not use the default ghost image--show something specific in showDragFeedback method instead.
      return null;
    }

    /**
     * Sets the object dragged during Dnd (e.g. a DvtTimelineSeriesNode).
     * @param {DvtTimelineSeriesNode} draggedObj The dragged object.
     */
    setDraggedObj(draggedObj) {
      this._draggedObj = draggedObj;
    }

    ///

    /**
     * Show the drag feedbacks accordingly; called by DnD handlers.
     * @param {dvt.MouseEvent|dvt.KeyboardEvent|dvt.ComponentTouchEvent} event DnD dragOver event, keyboard, or touch event that triggered the feedback
     * @param {dvt.Point} localPos The position (e.g. the cursor point during drag) in reference to the affordance container coord system
     * @param {object} sourceObj The current source drag target
     * @param {dvt.Point} dropOffset The difference between the position of the start and y of the item and the drag start event position (i.e. (start pos - event pos, y - event y pos)
     * @param {boolean=} autoPanOff Whether to turn edge auto pan off. Default false.
     * @param {boolean=} showTooltip Whether to show tooltip. Default false.
     */
    showDragFeedback(event, localPos, sourceObj, dropOffset, autoPanOff, showTooltip) {
      var eventManager = this._timeline.getEventManager();
      // Don't do anything if the eventManager doesn't exist anymore, which is possible because this method is invoked
      // in requestAnimationFrame, and it's possible a requestAnimationFrame callback is invoked after the timeline is destroyed.
      if (sourceObj && eventManager) {
        var dragSourceType = eventManager.getDnDTaskSubType(sourceObj);

        var isRTL = dvt.Agent.isRightToLeft(this._timeline.getCtx());
        var rtlAdjust = isRTL ? -1 : 1;
        var panDelta, referenceFinalLocalX, adjustedStartPos, adjustedEndPos;
        var panX =
          eventManager._keyboardDnDMode == null
            ? eventManager._dragInitialX - this._timeline.getTimeZoomCanvas().getTranslateX()
            : 0;
        panDelta = { deltaX: panX, deltaY: 0 };
        referenceFinalLocalX = dropOffset.x + localPos.x + panDelta.deltaX;

        switch (dragSourceType) {
          case 'event':
            // Pan to make room if dragging to edge
            //panDelta = !autoPanOff ? this._timeline.autoPanOnEdgeDrag(localPos, DvtTimelineStyleUtils.getAutoPanEdgeThreshold(), false, false) : {deltaX: 0, deltaY: 0};

            var deltaX = sourceObj._displayable._initialDragOffset.offsetX - referenceFinalLocalX;
            var adjustedX = this._displayable._initialPosition.initialX - deltaX;
            // render feedback
            this._displayable.setTranslateX(adjustedX);

            var adjustedStartPos = this._timeline.getDatePos(this._startTime) - deltaX * rtlAdjust;
            var adjustedEndPos = this._timeline.getDatePos(this._endTime) - deltaX * rtlAdjust;

            this._dragStartTime = this._timeline.getPosDate(adjustedStartPos);
            this._dragEndTime = this._timeline.getPosDate(adjustedEndPos);

            if (showTooltip) {
              this._showDragFeedbackTooltip(event, this._displayable, 'center');
            }

            break;
          case 'resize-handle':
            // Pan (horizontally only) to make room if dragging to edge
            panDelta = { deltaX: 0, deltaY: 0 };
            var deltaX = sourceObj._displayable._initialDragOffset.offsetX - referenceFinalLocalX;
            var isEndResize = sourceObj._displayable._resizeEdge === 'end' ? true : false;
            var transX =
              (isRTL && !isEndResize) || (!isRTL && isEndResize)
                ? null
                : this._displayable._initialPosition.initialX - deltaX;

            var adjustedStartPos = this._timeline.getDatePos(this._startTime) - deltaX * rtlAdjust;
            var adjustedEndPos = this._timeline.getDatePos(this._endTime) - deltaX * rtlAdjust;

            var allowedStartPos =
              this._timeline.getDatePos(this._startTime) +
              DvtTimelineStyleUtils.getMinDurationEvent(this);
            var allowedEndPos =
              this._timeline.getDatePos(this._endTime) -
              DvtTimelineStyleUtils.getMinDurationEvent(this);

            if (isEndResize && adjustedEndPos > allowedStartPos) {
              var newEndTime = this._timeline.getPosDate(adjustedEndPos);
              this._dragEndTime = newEndTime;
              this._timeline.getEventManager().handleDurationEventResize(this, this._series, transX);
            } else if (!isEndResize && adjustedStartPos < allowedEndPos) {
              var newStartTime = this._timeline.getPosDate(adjustedStartPos);
              this._dragStartTime = newStartTime;
              this._timeline.getEventManager().handleDurationEventResize(this, this._series, transX);
            }

            // render feedback
            if (showTooltip) {
              this._showDragFeedbackTooltip(event, this._displayable, isEndResize ? 'end' : 'start');
            }
            break;
        }
      }
    }

    /**
     * Shows drag feedback tooltip
     * @param {dvt.MouseEvent|dvt.KeyboardEvent|dvt.ComponentTouchEvent} event DnD dragOver event, keyboard, or touch event that triggered the feedback
     * @param {dvt.Displayable} feedbackObj The feedback displayable associated with the tooltip
     * @param {string} position The position of the tooltip relative to the feedback. One of 'center', 'start', 'end'
     * @private
     */
    _showDragFeedbackTooltip(event, feedbackObj, position) {
      var isRTL = dvt.Agent.isRightToLeft(this._timeline.getCtx());

      var feedbackDimensions = feedbackObj.getDimensions();
      var durationBubbleCenter = feedbackObj.getChildAt(0).getDimensions().getCenter();
      var timelineViewportCanvasHeight = this._timeline.Height - this._timeline._overviewSize;
      var discreteOffset = this._timeline.getDiscreteOffset();
      var tooltipX =
        feedbackObj.getTranslateX() +
        feedbackDimensions.x +
        this._timeline._startPos +
        discreteOffset +
        (isRTL ? 28 : feedbackDimensions.w);
      var tooltipY =
        feedbackObj.getTranslateY() -
        durationBubbleCenter.y +
        feedbackObj._node._series.getTranslateY() +
        feedbackObj._node._series._canvas.getTranslateY() +
        timelineViewportCanvasHeight -
        feedbackDimensions.h;
      this._timeline
        .getEventManager()
        .ProcessObjectTooltip(event, tooltipX, tooltipY, this, feedbackObj.getElem());
    }

    /**
     * Cleanup drag properties
     * @private
     */
    _dropCleanup() {
      if (this._displayable) {
        this._displayable._initialDragOffset = null;
        this._displayable._initialPosition = null;
        this._displayable._resizeEdge = null;
        this._type = null;
      }
      this._dragStartTime = null;
      this._dragEndTime = null;
      this._timeline.getEventManager().handleDurationEventReset(this, this._series);
    }

    /**
     * Get Drag start time
     * @return current drag start time
     * @private
     */
    dragStartSetup(nativeEvent) {
      // if nativeEvent null, this is a rerender and don't need to change the initial
      if (nativeEvent != null) {
        this._displayable._initialDragOffset = {
          offsetX: nativeEvent.offsetX,
          offsetY: nativeEvent.offsetY
        };
      }
      this._displayable._initialPosition = {
        initialX: this._displayable.getTranslateX(),
        initialY: this._displayable.getTranslateY()
      };
    }

    /**
     * Get Drag start time
     * @return current drag start time
     * @private
     */
    getDragStartTime() {
      return this._dragStartTime != null && this._timeline.getEventManager()._isDndDragging
        ? this._dragStartTime
        : this._startTime;
    }

    /**
     * Get Drag end time
     * @return current drag end time
     * @private
     */
    getDragEndTime() {
      return this._dragEndTime != null && this._timeline.getEventManager()._isDndDragging
        ? this._dragEndTime
        : this._endTime;
    }

    /**
     * Updates drag feedback positions on rerender, e.g. the timeline resized when the feedbacks
     * are still present during keyboard DnD, in which case the feedback positions need to be updated
     * under the new time axis.
     * @param {object} sourceObj The current source drag target
     */
    updateDragFeedback(sourceObj) {
      var isRTL = dvt.Agent.isRightToLeft(this._timeline.getCtx());

      var eventManager = this._timeline.getEventManager();
      // Don't do anything if the eventManager doesn't exist anymore, which is possible because this method is invoked
      // in requestAnimationFrame, and it's possible a requestAnimationFrame callback is invoked after the timeline is destroyed.
      if (eventManager) {
        var dragSourceType = eventManager.getDnDTaskSubType(sourceObj);

        var rtlAdjust = isRTL ? -1 : 1;
        var deltaX, adjustedStartPos, adjustedEndPos;

        switch (dragSourceType) {
          case 'event':
            adjustedStartPos = this._timeline.getDatePos(this._dragStartTime);
            deltaX = (this._timeline.getDatePos(this._startTime) - adjustedStartPos) * rtlAdjust;
            var adjustedX = this._displayable.getTranslateX() - deltaX;
            this._displayable.setTranslateX(adjustedX);
            break;
          case 'resize-handle':
            var isEndResize = sourceObj._displayable._resizeEdge === 'end' ? true : false;

            if (isEndResize) {
              adjustedEndPos = this._timeline.getDatePos(this._dragEndTime);
              deltaX = (this._timeline.getDatePos(this._endTime) - adjustedEndPos) * rtlAdjust;
            } else if (!isEndResize) {
              adjustedStartPos = this._timeline.getDatePos(this._dragStartTime);
              deltaX = (this._timeline.getDatePos(this._startTime) - adjustedStartPos) * rtlAdjust;
            }
            var transX =
              (isRTL && !isEndResize) || (!isRTL && isEndResize)
                ? null
                : this._displayable.getTranslateX() - deltaX;
            this._timeline.getEventManager().handleDurationEventResize(this, this._series, transX);
            break;
        }
      }
    }

    /**
     * Gets the affordance type.
     * @return {string} The node type ('event', 'resize-handle').
     */
    getDragType() {
      return this._type;
    }

    /**
     * Sets the affordance type.
     * @param {string} type The node type ('event', 'resize-handle')
     */
    setDragType(type) {
      this._type = type;
    }

    /**
     * Disable the internal tabbable elements
     */
    _disableAllTabElements() {
      this._timeline.getOptions()._keyboardUtils.disableAllFocusable(this._displayable.getElem());
    }

    /**
     * Enable the internal tabbable elements
     */
    _enableAllTabElements() {
      this._timeline.getOptions()._keyboardUtils.enableAllFocusable(this._displayable.getElem());
    }

    /**
     * Returns whether the item has a color stripe.
     * @return {boolean} Whether the item has a color stripe.
     */
    hasColorStripe() {
      return !!(
        this.getBackground() &&
        this.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT &&
        !this._series.isVertical()
      );
    }
  }
  // item-type defs
  DvtTimelineSeriesNode.DURATION_EVENT = 'duration-event';
  DvtTimelineSeriesNode.DURATION_BAR = 'duration-bar';

  /**
   * Timeline automation service.
   * @param {Timeline} timeline The owning Timeline.
   * @class  DvtTimelineAutomation
   * @implements {dvt.Automation}
   * @constructor
   */
  class DvtTimelineAutomation extends dvt.Automation {
    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>timelineItem[seriesIndex][itemIndex]</li>
     * </ul>
     * @override
     */
    GetSubIdForDomElement(displayable) {
      var logicalObj = this._comp.EventManager.GetLogicalObject(displayable);
      if (logicalObj && logicalObj instanceof DvtTimelineSeriesNode) {
        for (var i = 0; i < this._comp._series.length; i++) {
          var series = this._comp._series[i];
          var itemIndex = series._items.indexOf(logicalObj);
          if (itemIndex !== -1) return 'timelineItem[' + i + '][' + itemIndex + ']';
        }
      }
      return null;
    }

    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>timelineItem[seriesIndex][itemIndex]</li>
     * </ul>
     * @override
     */
    getDomElementForSubId(subId) {
      // TOOLTIP
      if (subId === dvt.Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._comp);

      if (subId && this._comp.hasValidOptions()) {
        var parenIndex = subId.indexOf('[');
        if (parenIndex > 0 && subId.substring(0, parenIndex) === 'timelineItem') {
          var endParenIndex = subId.indexOf(']');
          if (endParenIndex > 0) {
            var seriesIndex = parseInt(subId.substring(parenIndex + 1, endParenIndex));
            var itemIndex = parseInt(subId.substring(endParenIndex + 2, subId.length - 1));

            var series = this._comp._series[seriesIndex];
            if (series) {
              var node = series._items[itemIndex];
              if (node) return node.getDisplayables()[0].getElem();
            }
          }
        }
      }
      return null;
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {dvt.BaseComponentDefaults}
   */
  class DvtTimelineDefaults extends dvt.BaseComponentDefaults {
    constructor(context) {
      super({ alta: {} }, context);
    }

    /**
     * @override
     */
    getNoCloneObject() {
      return {
        // Don't clone areas where app may pass in an instance of DvtTimeComponentScales/Converter
        // If the instance is a class, class methods may not be cloned for some reason.
        majorAxis: { converter: true, scale: true },
        minorAxis: { converter: true, scale: true, zoomOrder: true },
        // Don't clone areas where app may pass in an instance of Converter
        // If the instance is a class, class methods may not be cloned for some reason.
        valueFormats: {
          date: { converter: true },
          end: { converter: true },
          start: { converter: true }
        },
        _resources: {
          converter: true,
          converterVert: true,
          defaultDateConverter: true,
          defaultDateTimeConverter: true
        }
      };
    }
  }

  /**
   * Creates an instance of DvtTimelineSeriesItem which extends dvt.Container with hover and selection feedback.
   * @extends {dvt.Container}
   * @param {dvt.Context} context The rendering context
   * @param {string=} id The optional id for the corresponding DOM element.
   * @class
   * @constructor
   */
  class DvtTimelineSeriesItem extends dvt.Container {
    constructor(context, id) {
      super(context, 'g', id);
      // state
      this.SELECTED_STATE_KEY = 'sel';
      this.ACTIVE_SELECTED_STATE_KEY = 'asel';
      this.HOVER_STATE_KEY = 'hl';
    }

    /**
     * Sets whether the timeline series item is currently selected and shows the seleciton effect
     * @param {boolean} bSelected True if the currently selected
     */
    setSelected(isSelected) {
      if (this._isSelected === isSelected) return;

      this._isSelected = isSelected;

      if (isSelected) {
        if (this._isShowingHoverEffect) this.applyState(this.ACTIVE_SELECTED_STATE_KEY);
        else this.applyState(this.SELECTED_STATE_KEY);
      } else this.applyState(DvtTimelineSeriesItem.ENABLED_STATE_KEY);
    }

    /**
     * Shows the hover effect for the timeline series item
     */
    showHoverEffect(isFocused) {
      if (!this._isShowingHoverEffect) {
        this._isShowingHoverEffect = true;
        if (this._isSelected && isFocused) this.applyState(this.ACTIVE_SELECTED_STATE_KEY);
        else if (this._isSelected) this.applyState(this.SELECTED_STATE_KEY);
        else this.applyState(this.HOVER_STATE_KEY);
      }
    }

    /**
     * Hides the hover effect for the timeline series item
     */
    hideHoverEffect(isFocused) {
      if (this._isSelected && isFocused) this.applyState(this.ACTIVE_SELECTED_STATE_KEY);
      else if (this._isSelected) this.applyState(this.SELECTED_STATE_KEY);
      else this.applyState(DvtTimelineSeriesItem.ENABLED_STATE_KEY);
      this._isShowingHoverEffect = false;
    }

    applyState(state) {
      var item = this._node;
      var itemElem = item.getBubble();
      // if it is null the item has not been render yet, this could happen when user
      // hovers over a marker that is not in the viewport
      if (itemElem == null) return;

      var bubble = itemElem.getChildAt(0);
      var bubbleInner = bubble.getChildAt(0);
      var duration = item.getDurationBar();
      var bubbleFillColor;
      var bubbleStrokeColor;
      var bubbleStrokeWidth;
      var bubbleInnerStrokeColor;
      if (state === this.ACTIVE_SELECTED_STATE_KEY) {
        bubbleFillColor = DvtTimelineStyleUtils.getItemSelectedFillColor(item);
        bubbleStrokeColor = DvtTimelineStyleUtils.getItemSelectedStrokeColor(item);
        bubbleStrokeWidth = DvtTimelineStyleUtils.getItemSelectedStrokeWidth();
        bubbleInnerStrokeColor = DvtTimelineStyleUtils.getItemInnerActiveStrokeColor();
      } else if (state === this.SELECTED_STATE_KEY) {
        bubbleFillColor = DvtTimelineStyleUtils.getItemSelectedFillColor(item);
        bubbleStrokeColor = DvtTimelineStyleUtils.getItemSelectedStrokeColor(item);
        bubbleStrokeWidth = DvtTimelineStyleUtils.getItemSelectedStrokeWidth();
        bubbleInnerStrokeColor = DvtTimelineStyleUtils.getItemInnerStrokeColor();
      } else if (state === this.HOVER_STATE_KEY) {
        bubbleFillColor = DvtTimelineStyleUtils.getItemHoverFillColor(item);
        bubbleStrokeColor = DvtTimelineStyleUtils.getItemHoverStrokeColor(item);
        bubbleStrokeWidth = DvtTimelineStyleUtils.getItemHoverStrokeWidth(item._timeline.Options);
        bubbleInnerStrokeColor = DvtTimelineStyleUtils.getItemInnerActiveStrokeColor();
      } else {
        bubbleFillColor = DvtTimelineStyleUtils.getItemFillColor(item);
        bubbleStrokeColor = DvtTimelineStyleUtils.getItemStrokeColor(item);
        bubbleStrokeWidth = DvtTimelineStyleUtils.getItemStrokeWidth();
        bubbleInnerStrokeColor = DvtTimelineStyleUtils.getItemInnerStrokeColor();
      }
      var bubbleInnerStrokeWidth = DvtTimelineStyleUtils.getItemInnerStrokeWidth();

      var bubbleStroke = new dvt.Stroke(bubbleStrokeColor, 1, bubbleStrokeWidth);
      var bubbleInnerStroke = new dvt.Stroke(bubbleInnerStrokeColor, 1, bubbleInnerStrokeWidth);

      bubble.setStroke(bubbleStroke);
      bubbleInner.setStroke(bubbleInnerStroke);
      const hasColorStripe = item.hasColorStripe();
      if (state === this.HOVER_STATE_KEY) {
        // use overflow background color for temporary shading on hover state
        // There is no shading on hover when color stripe is present according to the Timeline Event Template visual spec.
        var bubbleBackFillColor = hasColorStripe
          ? 'transparent'
          : DvtTimelineStyleUtils.getContentBubbleBackgroundColor(item._timeline.Options);
        bubble.setSolidFill(bubbleBackFillColor);
        bubbleInner.setSolidFill(hasColorStripe ? 'transparent' : bubbleFillColor);
      } else {
        bubble.setSolidFill(bubbleFillColor);
        bubbleInner.setSolidFill(DvtTimelineStyleUtils.getItemInnerFillColor());
      }

      // Apply bubble background and color stripe styling
      // Note that any applied "fill" are from CSS classes and will override any fill set on the bubble above.
      const background = item.getBackground();
      if (background) {
        bubble.setClassName(`oj-timeline-item-bubble oj-timeline-item-bubble-bg-${background}`);
        const colorStripe = item.getColorStripe();
        if (hasColorStripe && colorStripe) {
          colorStripe.setClassName(
            `oj-timeline-item-bubble-stripe oj-timeline-item-bubble-bg-${background}`
          );
        }
      } else {
        // Remove any previously applied `oj-timeline-item-bubble oj-timeline-item-bubble-bg-${background}` classes
        bubble.setClassName();
      }

      var feeler = item.getFeeler();
      if (feeler && item._timeline.isFeelerEnabled()) {
        feeler.setStroke(bubbleStroke);
      }

      if (duration) duration.setStroke(bubbleStroke);
    }
  }

  // state
  DvtTimelineSeriesItem.ENABLED_STATE_KEY = 'en';

  /**
   * Renderer for DvtTimelineSeriesItem.
   * @class
   */
  const DvtTimelineSeriesItemRenderer = {
    /**
     * Renders a timeline series item.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {dvt.Container} container The container to render into.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} frAnimationElems The animator.
     * @param {type} mvAnimator The animator.
     */
    renderItem: (item, series, container, overflowOffset, frAnimationElems, mvAnimator) => {
      if (!item.getBubble()) {
        DvtTimelineSeriesItemRenderer._renderBubble(item, series, container, frAnimationElems);
        DvtTimelineSeriesItemRenderer._displayBubble(item, series, overflowOffset, null, false);
      } else {
        series._hasMvAnimations = true;
        DvtTimelineSeriesItemRenderer._displayBubble(item, series, overflowOffset, mvAnimator, true);
      }

      // only render a feeler in horizontal orientation and if feelers are enabled
      if (!series.isVertical() && item._timeline.isFeelerEnabled()) {
        if (item.getFeeler() && series._allowUpdates)
          DvtTimelineSeriesItemRenderer._updateFeeler(item, series, overflowOffset, mvAnimator);
        else
          DvtTimelineSeriesItemRenderer._renderFeeler(
            item,
            series,
            container.feelers,
            overflowOffset,
            frAnimationElems
          );
      }
    },

    /**
     * Initializes a timeline series item.
     * @param {DvtTimelineSeriesItem} item The item being initialized.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {number} index The index of the item.
     * @param {type} mvAnimator optional animator.
     */
    initializeItem: (item, series, index, mvAnimator) => {
      if (item.getBubble() && series._allowUpdates)
        DvtTimelineSeriesItemRenderer._updateBubble(item, series, index, mvAnimator);
      else DvtTimelineSeriesItemRenderer._createBubble(item, series, index);
    },

    /**
     * Creates the item bubble.
     * @param {DvtTimelineSeriesItem} item The item being initialized.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {number} index The index of the item.
     * @private
     */
    _createBubble: (item, series, index) => {
      var content = DvtTimelineSeriesItemRenderer._getBubbleContent(item, series);
      item._content = content;

      DvtTimelineSeriesItemRenderer._setupBubble(item, content, series);

      var spacing = series.calculateSpacing(item, index);
      item.setSpacing(spacing);
    },

    /**
     * Sets up the item bubble.
     * @param {DvtTimelineSeriesItem} item The item being initialized.
     * @param {DvtContainer} content The item content.
     * @param {DvtTimelineSeries} series The series containing this item.
     */
    _setupBubble: (item, content, series) => {
      var width, height, durationWidth;
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      var padding = DvtTimelineStyleUtils.getBubblePadding(item);
      var customRenderer = item._timeline.getOptions().itemBubbleContentRenderer;

      if (customRenderer) {
        // Ensure width is positive
        width = Math.max(0, content._w + content._x + padding.start + padding.end);
        height = content._h + content._y + padding.top + padding.bottom;
      } else {
        width = content._w + padding.start + padding.end;
        height = content._h + padding.top + padding.bottom;
      }

      item.setContentWidth(width);

      var startTime = item.getStartTime();
      var endTime = item.getEndTime();
      var loc = item._timeline.getDatePos(startTime);
      var endLoc = item._timeline.getDatePos(endTime);

      if (item.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT) {
        // special duration-event bubble width matches the duration length with min width applied
        durationWidth = Math.max(endLoc - loc, DvtTimelineStyleUtils.getMinDurationEvent(item));

        if (durationWidth < width) {
          width = durationWidth + width + DvtTimelineStyleUtils.getContentBubbleSpacing();
        } else {
          width = durationWidth;
        }
      }

      // check viewport collision
      DvtTimelineSeriesItemRenderer.checkEndViewportCollision(item, series, isRTL, width);

      // for collision, need the start position to be -contentWidth
      if (item.getEndViewportCollision() && durationWidth === null) {
        width = 2 * width + DvtTimelineStyleUtils.getContentBubbleSpacing();
      }
      item.setWidth(width);
      item.setHeight(height);
      item.setDurationWidth(durationWidth);
    },

    /**
     * Renders a timeline series item bubble.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {dvt.Container} container The container to render into.
     * @param {type} animationElems The animator.
     * @private
     */
    _renderBubble: (item, series, container, animationElems) => {
      var bubble, innerBubble, contentBubble, endViewportCollision, flipContentBubble;
      var bubbleArray, innerBubbleArray, contentBubbleArray;
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      var id = item.getId();
      var options = item._timeline.Options;

      var padding = DvtTimelineStyleUtils.getBubblePadding(item);
      var borderRadius = Number(DvtTimelineStyleUtils.getBubbleRadius(options));
      var content = item._content;

      var overflowContent = DvtTimelineSeriesItemRenderer._isOverflow(item);

      var nodeWidth = item.getWidth();
      var nodeContentWidth = item.getContentWidth();
      var nodeDurationWidth = item.getDurationWidth();
      var nodeHeight = item.getHeight();

      // draw the bubble
      var bubbleId = '_bubble_' + id;
      if (item._timeline.getCtx().getThemeBehavior() === 'alta') {
        // Keep the Alta bubble behavior until we can remove
        if (series.isVertical()) {
          var offset = nodeHeight / 2;
          var startOffset = offset - 6;
          var endOffset = offset + 6;
          if ((!isRTL && series.isInverted()) || (isRTL && !series.isInverted())) {
            bubbleArray = [
              0,
              0,
              0,
              startOffset,
              -6,
              offset,
              0,
              endOffset,
              0,
              nodeHeight,
              nodeWidth,
              nodeHeight,
              nodeWidth,
              0,
              0,
              0
            ];
            innerBubbleArray = [
              2,
              2,
              2,
              startOffset,
              -4,
              offset,
              2,
              endOffset,
              2,
              nodeHeight - 2,
              nodeWidth - 2,
              nodeHeight - 2,
              nodeWidth - 2,
              2,
              2,
              2
            ];
          } else {
            bubbleArray = [
              0,
              0,
              0,
              nodeHeight,
              nodeWidth,
              nodeHeight,
              nodeWidth,
              endOffset,
              nodeWidth + 6,
              offset,
              nodeWidth,
              startOffset,
              nodeWidth,
              0,
              0,
              0
            ];
            innerBubbleArray = [
              2,
              2,
              2,
              nodeHeight - 2,
              nodeWidth - 2,
              nodeHeight - 2,
              nodeWidth - 2,
              endOffset,
              nodeWidth + 4,
              offset,
              nodeWidth - 2,
              startOffset,
              nodeWidth - 2,
              2,
              2,
              2
            ];
          }
        } else {
          if (!isRTL) {
            offset = DvtTimelineStyleUtils.getBubbleOffset(item._timeline);
          } else {
            offset = nodeWidth - DvtTimelineStyleUtils.getBubbleOffset(item._timeline);
          }
          startOffset = offset - 6;
          endOffset = offset + 6;
          if (series.isInverted()) {
            bubbleArray = [
              0,
              0,
              startOffset,
              0,
              offset,
              -6,
              endOffset,
              0,
              nodeWidth,
              0,
              nodeWidth,
              nodeHeight,
              0,
              nodeHeight,
              0,
              0
            ];
            innerBubbleArray = [
              2,
              2,
              startOffset,
              2,
              offset,
              -4,
              endOffset,
              2,
              nodeWidth - 2,
              2,
              nodeWidth - 2,
              nodeHeight - 2,
              2,
              nodeHeight - 2,
              2,
              2
            ];
          } else {
            bubbleArray = [
              0,
              0,
              0,
              nodeHeight,
              startOffset,
              nodeHeight,
              offset,
              nodeHeight + 6,
              endOffset,
              nodeHeight,
              nodeWidth,
              nodeHeight,
              nodeWidth,
              0,
              0,
              0
            ];
            innerBubbleArray = [
              2,
              2,
              2,
              nodeHeight - 2,
              startOffset,
              nodeHeight - 2,
              offset,
              nodeHeight + 4,
              endOffset,
              nodeHeight - 2,
              nodeWidth - 2,
              nodeHeight - 2,
              nodeWidth - 2,
              2,
              2,
              2
            ];
          }
        }
        bubble = new dvt.Polygon(context, bubbleArray, bubbleId);
        innerBubble = new dvt.Polygon(context, innerBubbleArray, bubbleId + '_i');
      } else {
        var triangleIconSize = DvtTimelineStyleUtils.getContentBubbleArrow();
        endViewportCollision = item.getEndViewportCollision();
        flipContentBubble = (isRTL && !endViewportCollision) || (!isRTL && endViewportCollision);
        // Invert not required as top vs bottom priority stacking does not affect bubble point array
        if (flipContentBubble) {
          contentBubbleArray = [
            0,
            0,
            nodeContentWidth,
            0,
            nodeContentWidth,
            nodeHeight / 2 - triangleIconSize,
            nodeContentWidth + triangleIconSize,
            nodeHeight / 2,
            nodeContentWidth,
            nodeHeight / 2 + triangleIconSize,
            nodeContentWidth,
            nodeHeight,
            0,
            nodeHeight,
            0,
            0
          ];
        } else {
          contentBubbleArray = [
            0,
            0,
            0,
            nodeHeight / 2 - triangleIconSize,
            -triangleIconSize,
            nodeHeight / 2,
            0,
            nodeHeight / 2 + triangleIconSize,
            0,
            nodeHeight,
            nodeContentWidth,
            nodeHeight,
            nodeContentWidth,
            0,
            0,
            0
          ];
        }

        contentBubble = new dvt.Polygon(context, contentBubbleArray, bubbleId + '_ct');
        contentBubble.setSolidFill(
          DvtTimelineStyleUtils.getContentBubbleBackgroundColor(item._timeline.getOptions())
        );

        if (nodeDurationWidth) {
          nodeWidth = nodeDurationWidth;
        }
        bubble = new dvt.Rect(context, 0, 0, nodeWidth, nodeHeight, bubbleId);
        innerBubble = new dvt.Rect(context, 2, 2, nodeWidth - 4, nodeHeight - 4, bubbleId + '_i');
        bubble.setCornerRadius(borderRadius);
        innerBubble.setCornerRadius(borderRadius);
      }

      innerBubble.setSolidFill(DvtTimelineStyleUtils.getItemInnerFillColor());
      bubble.addChild(innerBubble);

      // set up bubbleContainer
      var bubbleContainerId = '_bt_' + id;
      var bubbleContainer = new DvtTimelineSeriesItem(context, bubbleContainerId);

      // associate the node with the marker
      bubbleContainer._node = item;

      // associate the displayable with the node
      item.setBubble(bubbleContainer);
      item.setContentBubble(contentBubble);

      if (animationElems) {
        bubbleContainer.setAlpha(0);
        animationElems.push(bubbleContainer);
      }

      // set up padding around content and add to container
      var contentPadding = DvtTimelineSeriesItemRenderer.calcPadding(
        item,
        isRTL,
        padding,
        nodeWidth,
        overflowContent,
        content
      );
      if (
        overflowContent &&
        (item.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT ||
          item._timeline.isDiscreteNavigationMode())
      ) {
        endViewportCollision = item.getEndViewportCollision();
        flipContentBubble = (isRTL && !endViewportCollision) || (!isRTL && endViewportCollision);

        var contentBubbleAdjust = (contentPadding + 15.5) * (flipContentBubble ? -1 : 1);
        // if overflow, use the contentBubble to hold content. Otherwise, use the bubble
        contentBubble.setTranslateX(contentBubbleAdjust);
        contentBubble.addChild(content);
        var customRenderer = item._timeline.getOptions().itemBubbleContentRenderer;
        content.setTranslate(
          isRTL && customRenderer ? item.getContentWidth() : padding.start,
          padding.top
        );
        bubbleContainer.addChild(bubble);
        bubbleContainer.addChild(contentBubble);
      } else {
        // if not in viewport and in navMode using duration event, hide content to prevent overflowing into viewport
        var notInViewport =
          item._timeline._viewStartTime > item.getEndTime() ||
          item._timeline._viewEndTime < item.getStartTime();
        if (
          item._timeline.isDiscreteNavigationMode() &&
          notInViewport &&
          item.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT
        ) {
          content.setVisible();
        }
        content.setTranslate(contentPadding, padding.top);
        bubble.addChild(content);
        bubbleContainer.addChild(bubble);
      }
      if (ojtimeaxisToolkit.TimeAxisUtils.supportsTouch())
        dvt.ToolkitUtils.setAttrNullNS(bubbleContainer._elem, 'id', bubbleContainer._id);

      // Add color stripe
      if (item.hasColorStripe()) {
        var colorStripe = item.createColorStripe();
        item.setColorStripe(colorStripe);
        bubbleContainer.addChild(colorStripe);
      }

      bubbleContainer.applyState(DvtTimelineSeriesItem.ENABLED_STATE_KEY);
      bubbleContainer.setClassName('oj-timeline-item-bubble-container');

      if (item.getLoc() >= 0) container.addChild(bubbleContainer);
      bubbleContainer.setAriaRole('img');
      series._callbackObj.EventManager.associate(bubbleContainer, item);

      // set up move/resize cursor css class.
      if (item._timeline.isDnDResizeEnabled()) {
        var startResizeHandle, endResizeHandle;
        startResizeHandle = new dvt.Rect(
          context,
          0,
          0,
          1,
          nodeHeight,
          'resize-handle-start_' + bubbleId
        );
        endResizeHandle = new dvt.Rect(context, 0, 0, 1, nodeHeight, 'resize-handle-end_' + bubbleId);
        if (isRTL) {
          startResizeHandle.setTranslateX(nodeWidth);
          endResizeHandle.setTranslateX(-1);
        } else {
          startResizeHandle.setTranslateX(-1);
          endResizeHandle.setTranslateX(nodeWidth);
        }
        startResizeHandle.setHollow('#00000000');
        endResizeHandle.setHollow('#00000000');
        bubbleContainer.addChild(startResizeHandle);
        bubbleContainer.addChild(endResizeHandle);

        startResizeHandle.setClassName('oj-timeline-resize-handle-start oj-draggable');
        endResizeHandle.setClassName('oj-timeline-resize-handle-end oj-draggable');

        series._callbackObj.EventManager.associate(startResizeHandle, item);
        series._callbackObj.EventManager.associate(endResizeHandle, item);
        item.setResizeHandleStart(startResizeHandle);
        item.setResizeHandleEnd(endResizeHandle);
      }

      if (item._timeline.isDnDMoveEnabled()) {
        innerBubble.setClassName(
          'oj-timeline-item-inner-bubble oj-timeline-move-handle oj-draggable'
        );
        series._callbackObj.EventManager.associate(innerBubble, item);
      } else {
        innerBubble.setClassName('oj-timeline-item-inner-bubble');
      }
    },

    /**
     * Displays a timeline series item bubble.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} animator The animator.
     * @param {boolean} resetState Whether the item state should be reset.
     * @private
     */
    _displayBubble: (item, series, overflowOffset, animator, resetState) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      var loc = item.getLoc();
      var nodeWidth = item.getWidth();
      var nodeHeight = item.getHeight();
      var spacing = item.getSpacing();
      var bubbleContainer = item.getBubble();
      if (resetState) bubbleContainer.applyState(DvtTimelineSeriesItem.ENABLED_STATE_KEY);

      var transX;
      var transY;
      if (series.isVertical()) {
        transY = loc - nodeHeight / 2;
        if ((isRTL && series.isInverted()) || (!isRTL && !series.isInverted()))
          transX = series._size - (nodeWidth + series._initialSpacing) + overflowOffset;
        else {
          transX = series._initialSpacing;
          overflowOffset = 0;
        }
      } else {
        var bubbleOffsetVal =
          item.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT
            ? 0
            : DvtTimelineStyleUtils.getBubbleOffset(item._timeline);
        if (!isRTL) {
          transX = loc - bubbleOffsetVal;
        } else {
          var length = item._timeline.isDiscreteNavigationMode()
            ? item._timeline._discreteContentLength
            : series._length;
          transX = length - loc - nodeWidth + bubbleOffsetVal;
          if (DvtTimelineSeriesItemRenderer._isOverflow(item)) {
            transX += item.getContentWidth() + 15.5;
          }
        }
        if (!series.isInverted()) {
          if (!series.isTopToBottom()) transY = series.Height - spacing - nodeHeight + overflowOffset;
          else transY = spacing - series._initialSpacing + DvtTimelineStyleUtils.getBubbleSpacing();
        } else {
          if (series.isTopToBottom()) transY = spacing;
          else
            transY =
              series.Height -
              spacing -
              nodeHeight +
              overflowOffset +
              series._initialSpacing -
              DvtTimelineStyleUtils.getBubbleSpacing();
          overflowOffset = 0;
        }
      }
      if (animator) {
        if (!series.isVertical())
          bubbleContainer.setTranslateY(
            bubbleContainer.getTranslateY() + series._canvasOffsetY + overflowOffset
          );
        else
          bubbleContainer.setTranslateX(
            bubbleContainer.getTranslateX() + series._canvasOffsetX + overflowOffset
          );
        animator.addProp(
          dvt.Animator.TYPE_NUMBER,
          bubbleContainer,
          bubbleContainer.getTranslateX,
          bubbleContainer.setTranslateX,
          transX
        );
        animator.addProp(
          dvt.Animator.TYPE_NUMBER,
          bubbleContainer,
          bubbleContainer.getTranslateY,
          bubbleContainer.setTranslateY,
          transY
        );
      } else bubbleContainer.setTranslate(transX, transY);

      // apply the aria label that corresponds to the current zoom level
      item._updateAriaLabel();

      // disable tabbable elements
      item._disableAllTabElements();
    },

    /**
     * Creates the item bubble move drag outline.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @private
     */
    _createEventMoveDragOutline: (item) => {
      var id = item.getId();
      var series = item._series;
      var context = series.getCtx();
      var nodeWidth = item._displayable.getChildAt(0).getWidth() + 2;
      var nodeHeight = item.getHeight() + 2;
      var originalBubble = item._displayable;

      // draw the bubble (make it 2px wider and taller to expose it around the original bubble)
      var bubbleId = '_bubble_move_' + id;
      var borderRadius = Number(DvtTimelineStyleUtils.getBubbleRadius(item._timeline.Options));
      var bubble = new dvt.Rect(context, 0, 0, nodeWidth, nodeHeight, bubbleId);
      bubble.setCornerRadius(borderRadius);
      bubble.setClassName('oj-timeline-move-outline');
      // set translate
      bubble.setTranslateX(originalBubble.getTranslateX() - 1);
      bubble.setTranslateY(originalBubble.getTranslateY() - 1);
      bubble.setSolidFill('transparent');
      var stroke = new dvt.Stroke('#000000', 1, 1, false, { dashArray: '3' });
      bubble.setStroke(stroke);
      item._moveDragOutline = bubble;
    },

    /**
     * Updates the item bubble move drag outline.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @private
     */
    _updateEventMoveDragOutline: (item) => {
      var originalBubble = item._displayable;
      var nodeWidth = originalBubble.getChildAt(0).getWidth();
      var nodeHeight = item.getHeight();
      item._moveDragOutline.setWidth(nodeWidth + 2);
      item._moveDragOutline.setHeight(nodeHeight + 2);

      // set translate
      item._moveDragOutline.setTranslateX(originalBubble.getTranslateX() - 1);
      item._moveDragOutline.setTranslateY(originalBubble.getTranslateY() - 1);
    },

    /**
     * Renders the item bubble move drag outline.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @private
     */
    _renderEventMoveDragOutline: (item) => {
      var series = item._series;
      var container = series._blocks[0];
      if (item._moveDragOutline == null) {
        DvtTimelineSeriesItemRenderer._createEventMoveDragOutline(item);
      } else {
        DvtTimelineSeriesItemRenderer._updateEventMoveDragOutline(item);
      }
      container.addChild(item._moveDragOutline);
    },

    /**
     * Hides the item bubble move drag outline.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @private
     */
    _hideEventMoveDragOutline: (item) => {
      var series = item._series;
      var container = series._blocks[0];
      if (item._moveDragOutline != null) {
        container.removeChild(item._moveDragOutline);
      }
    },

    /**
     * Returns the content of a timeline series item bubble.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @return {dvt.Container} The bubble content for this item.
     * @private
     */
    _getBubbleContent: (item, series) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      var title = item.getTitle();
      var desc = item.getDescription();
      var thumbnail = item.getThumbnail();

      var container = new dvt.Container(context);
      var offsetX = 0;
      var offsetY = 0;
      var maxWidth = 0;
      var maxHeight = 0;
      var textHeight = 0;

      var customRenderer = item._timeline.getOptions().itemBubbleContentRenderer;
      var customContent;
      if (customRenderer) {
        // if custom renderer is provided, just use that instead
        customContent = customRenderer(item.getRendererContext());
        if (customContent) {
          var parentElement = container.getContainerElem();

          if (Array.isArray(customContent)) {
            customContent.forEach((node) => {
              dvt.ToolkitUtils.appendChildElem(parentElement, node);
            });
          } else {
            dvt.ToolkitUtils.appendChildElem(parentElement, customContent);
          }
          // Temporarily add container to block to grab the dimensions
          var block = series._blocks[series._blocks.length - 1];
          block.setClassName('oj-timeline-item-bubble-container');

          block.addChild(container);
          var dimensions = container.getDimensions();
          container._w = dimensions.w;
          container._h = dimensions.h;
          if (isRTL) {
            container._x = dimensions.w + dimensions.x;
          } else {
            container._x = dimensions.x;
          }
          container._y = dimensions.y;

          block.removeChild(container);
          return container;
        }
      }

      if (!isRTL) {
        // left to right rendering
        if (thumbnail) {
          var thumbWidth = DvtTimelineStyleUtils.getThumbnailWidth();
          var thumbHeight = DvtTimelineStyleUtils.getThumbnailHeight();
          var thumbImage = new dvt.Image(context, thumbnail, 0, 0, thumbWidth, thumbHeight, '_tn');
          thumbImage.setMouseEnabled(false);
          container.addChild(thumbImage);
          offsetX = thumbWidth + DvtTimelineStyleUtils.getItemContentSpacing();
          maxHeight = thumbHeight;
        }

        if (title) {
          var titleText = new dvt.OutputText(context, title, offsetX, 0);
          titleText.setCSSStyle(DvtTimelineStyleUtils.getItemTitleStyle(item));
          var dim = titleText.getDimensions();
          maxWidth = dim.w;
          textHeight = dim.h;
          offsetY = textHeight;
          container.addChild(titleText);
          item._titleText = titleText;
        }

        if (desc) {
          var descText = new dvt.OutputText(context, desc, offsetX, offsetY);
          descText.setCSSStyle(DvtTimelineStyleUtils.getItemDescriptionStyle(item));
          dim = descText.getDimensions();
          maxWidth = Math.max(maxWidth, dim.w);
          textHeight = offsetY + dim.h;
          container.addChild(descText);
          item._descText = descText;
        }
        container._w =
          maxWidth === 0
            ? Math.max(offsetX - DvtTimelineStyleUtils.getItemContentSpacing(), 0)
            : offsetX + maxWidth;
      } else {
        // right to left rendering
        if (title) {
          titleText = new dvt.OutputText(context, title, 0, 0);
          titleText.setCSSStyle(DvtTimelineStyleUtils.getItemTitleStyle(item));
          dim = titleText.getDimensions();
          offsetX = dim.w;
          textHeight = dim.h;
          offsetY = textHeight;
          container.addChild(titleText);
          item._titleText = titleText;
        }

        if (desc) {
          descText = new dvt.OutputText(context, desc, 0, offsetY);
          descText.setCSSStyle(DvtTimelineStyleUtils.getItemDescriptionStyle(item));
          dim = descText.getDimensions();
          var width = dim.w;
          if (offsetX !== 0 && width !== offsetX) {
            if (width > offsetX) {
              titleText.setX(width - offsetX);
              offsetX = width;
            } else descText.setX(offsetX - width);
          } else offsetX = width;
          textHeight = offsetY + dim.h;
          container.addChild(descText);
          item._descText = descText;
        }

        if (thumbnail) {
          thumbWidth = DvtTimelineStyleUtils.getThumbnailWidth();
          thumbHeight = DvtTimelineStyleUtils.getThumbnailHeight();
          offsetX = offsetX === 0 ? 0 : offsetX + DvtTimelineStyleUtils.getItemContentSpacing();
          thumbImage = new dvt.Image(context, thumbnail, offsetX, 0, thumbWidth, thumbHeight, '_tn');
          thumbImage.setMouseEnabled(false);
          container.addChild(thumbImage);
          maxWidth = thumbWidth;
          maxHeight = thumbHeight;
        }
        container._w = offsetX + maxWidth;
      }
      container._h = Math.max(maxHeight, textHeight);
      return container;
    },

    /**
     * Updates the rendering of a timeline series item bubble.
     * @param {DvtTimelineSeriesItem} item The item being updated.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {number} index The index of the item.
     * @param {type} mvAnimator optional animator.
     * @private
     */
    _updateBubble: (item, series, index, mvAnimator) => {
      // Need to update the bubble widths before spacing if applicable
      if (item.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT) {
        DvtTimelineSeriesItemRenderer._updateDurationEvent(item, series, null, mvAnimator);
      }
      var spacing = series.calculateSpacing(item, index);
      item.setSpacing(spacing);

      var newTitleStyle = DvtTimelineStyleUtils.getItemTitleStyle(item);
      var newDescStyle = DvtTimelineStyleUtils.getItemDescriptionStyle(item);
      // on item content styles change, update the title/description if applicable
      if (item._titleText && item._titleText.getCSSStyle() !== newTitleStyle) {
        item._titleText.setCSSStyle(newTitleStyle);
      }
      if (item._descText && item._descText.getCSSStyle() !== newDescStyle) {
        item._descText.setCSSStyle(newDescStyle);
      }
    },

    /**
     * Renders a timeline series item feeler.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {dvt.Container} container The container to render into.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} animationElems The animator.
     * @private
     */
    _renderFeeler: (item, series, container, overflowOffset, animationElems) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      var id = item.getId();
      var loc = item.getLoc();
      var spacing = item.getSpacing();
      var length = item._timeline.isDiscreteNavigationMode()
        ? item._timeline._discreteContentLength
        : series._length;

      // clear feeler if duration-event
      if (item.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT) {
        item.setFeeler(null);
        return;
      }

      // draw the feeler
      var feelerId = '_feeler_' + id;
      var durationSize =
        item.getItemType() === DvtTimelineSeriesNode.DURATION_BAR ? item.getDurationSize() : 0;
      if (!series.isInverted()) {
        var feelerY = series.Height + overflowOffset - durationSize;
        if (!series.isTopToBottom()) var feelerHeight = series.Height - spacing + overflowOffset;
        else
          feelerHeight =
            spacing -
            series._initialSpacing +
            DvtTimelineStyleUtils.getBubbleSpacing() +
            item.getHeight();
      } else {
        // only shorten feelerY if duration bar
        feelerY = durationSize;
        if (series.isTopToBottom()) feelerHeight = spacing;
        else
          feelerHeight =
            series.Height -
            spacing -
            item.getHeight() +
            overflowOffset +
            series._initialSpacing -
            DvtTimelineStyleUtils.getBubbleSpacing();
      }
      var feelerX;
      if (isRTL) feelerX = length - loc;
      else feelerX = loc;
      // adjust feelerY by axisSize due to time axis change
      var axisSize = item._timeline.getTimeAxisSize();
      var feeler = new dvt.Line(
        context,
        feelerX,
        feelerY - axisSize,
        feelerX,
        feelerHeight,
        feelerId
      );
      if (animationElems) {
        feeler.setAlpha(0);
        animationElems.push(feeler);
      }

      container.addChild(feeler);
      var feelerWidth = DvtTimelineStyleUtils.getItemStrokeWidth();
      var feelerColor = DvtTimelineStyleUtils.getItemStrokeColor(item);
      var stroke = new dvt.Stroke(feelerColor, 1, feelerWidth);
      feeler.setStroke(stroke);
      feeler._node = item;
      item.setFeeler(feeler);
    },

    /**
     * Updates the rendering of a timeline series item feeler.
     * @param {DvtTimelineSeriesItem} item The item being updated.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} animator The animator.
     * @private
     */
    _updateFeeler: (item, series, overflowOffset, animator) => {
      var length = item._timeline.isDiscreteNavigationMode()
        ? item._timeline._discreteContentLength
        : series._length;
      if (
        series.isVertical() ||
        item.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT ||
        !item._timeline.isFeelerEnabled()
      ) {
        item.setFeeler(null);
        return;
      }

      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      var feeler = item.getFeeler();
      var durationSize =
        item.getItemType() === DvtTimelineSeriesNode.DURATION_BAR ? item.getDurationSize() : 0;
      if (!series.isInverted()) {
        var feelerY = series.Height + overflowOffset - durationSize;
        if (!series.isTopToBottom())
          var feelerHeight = series.Height - item.getSpacing() + overflowOffset;
        else
          feelerHeight =
            item.getSpacing() -
            series._initialSpacing +
            DvtTimelineStyleUtils.getBubbleSpacing() +
            item.getHeight();
      } else {
        feelerY = durationSize;
        if (series.isTopToBottom()) feelerHeight = item.getSpacing();
        else
          feelerHeight =
            series.Height -
            item.getSpacing() -
            item.getHeight() +
            overflowOffset +
            series._initialSpacing -
            DvtTimelineStyleUtils.getBubbleSpacing();
        overflowOffset = 0;
      }
      var feelerX;
      if (isRTL) feelerX = length - item.getLoc();
      else feelerX = item.getLoc();

      if (animator) {
        feeler.setY1(feeler.getY1() + series._canvasOffsetY + overflowOffset);
        feeler.setY2(feeler.getY2() + series._canvasOffsetY + overflowOffset);
        animator.addProp(dvt.Animator.TYPE_NUMBER, feeler, feeler.getX1, feeler.setX1, feelerX);
        animator.addProp(dvt.Animator.TYPE_NUMBER, feeler, feeler.getY1, feeler.setY1, feelerY);
        animator.addProp(dvt.Animator.TYPE_NUMBER, feeler, feeler.getX2, feeler.setX2, feelerX);
        animator.addProp(dvt.Animator.TYPE_NUMBER, feeler, feeler.getY2, feeler.setY2, feelerHeight);
      } else {
        feeler.setX1(feelerX);
        feeler.setY1(feelerY);
        feeler.setX2(feelerX);
        feeler.setY2(feelerHeight);
      }
    },

    /**
     * Renders a timeline series item duration.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {dvt.Container} container The container to render into.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} frAnimationElems The animator.
     * @param {type} mvAnimator The animator.
     */
    renderDuration: (item, series, container, overflowOffset, frAnimationElems, mvAnimator) => {
      if (item.getDurationBar())
        DvtTimelineSeriesItemRenderer._updateDuration(item, series, overflowOffset, mvAnimator);
      else
        DvtTimelineSeriesItemRenderer._renderDuration(
          item,
          series,
          container,
          overflowOffset,
          frAnimationElems
        );
    },

    /**
     * Renders a timeline series item duration.
     * @param {DvtTimelineSeriesItem} item The item being rendered.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {dvt.Container} container The container to render into.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} animationElems The animator.
     * @private
     */
    _renderDuration: (item, series, container, overflowOffset, animationElems) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      var startTime = item.getStartTime();
      var endTime = item.getEndTime();
      var loc = item._timeline.getDatePos(startTime);
      var durationId = '_duration_' + item.getId();
      var durationSize = 22 + 10 * item.getDurationLevel();
      var endLoc = item._timeline.getDatePos(endTime);
      var length = item._timeline.isDiscreteNavigationMode()
        ? item._timeline._discreteContentLength
        : series._length;

      if (series.isVertical()) {
        if ((!isRTL && !series.isInverted()) || (isRTL && series.isInverted()))
          var duration = new dvt.Rect(
            context,
            series._size - durationSize + 5,
            loc,
            durationSize,
            endLoc - loc,
            durationId
          );
        else {
          duration = new dvt.Rect(context, -5, loc, durationSize, endLoc - loc, durationId);
          overflowOffset = 0;
        }
        duration.setTranslateX(overflowOffset);
        duration.setY(loc);
        duration.setWidth(durationSize);
        duration.setHeight(endLoc - loc);
      } else {
        var width = endLoc - loc;
        if (!isRTL) var transX = loc;
        else transX = length - loc - width;
        if (!series.isInverted()) {
          duration = new dvt.Rect(
            context,
            transX,
            series._size - durationSize + 5,
            width,
            durationSize,
            durationId
          );
          duration.setTranslateY(overflowOffset);
        } else {
          duration = new dvt.Rect(context, transX, -5, width, durationSize, durationId);
          duration.setTranslateY(0);
        }
      }
      if (animationElems) {
        duration.setAlpha(0);
        animationElems.push(duration);
      }
      duration.setCornerRadius(5);
      duration.setSolidFill(item.getDurationFillColor());

      var feelerWidth = DvtTimelineStyleUtils.getItemStrokeWidth();
      var feelerColor = DvtTimelineStyleUtils.getItemStrokeColor(item);
      var feelerStroke = new dvt.Stroke(feelerColor, 1, feelerWidth);
      duration.setStroke(feelerStroke);

      duration._node = item;
      series._callbackObj.EventManager.associate(duration, item);
      container.addChild(duration);
      item.setDurationBar(duration);
    },

    /**
     * Updates the rendering of a timeline series item duration.
     * @param {DvtTimelineSeriesItem} item The item being updated.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} animator The animator.
     * @private
     */
    _updateDuration: (item, series, overflowOffset, animator) => {
      var loc, endLoc;
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      var duration = item.getDurationBar();
      var length = item._timeline.isDiscreteNavigationMode()
        ? item._timeline._discreteContentLength
        : series._length;
      if (duration != null) {
        loc = item._timeline.getDatePos(item.getStartTime());
        var durationSize = 22 + 10 * item.getDurationLevel();
        endLoc = item._timeline.getDatePos(item.getEndTime());
        if (series.isVertical()) {
          var durationTransY = 0;
          if ((!isRTL && !series.isInverted()) || (isRTL && series.isInverted()))
            var durationX = series._size - durationSize + 5;
          else {
            durationX = -5;
            overflowOffset = 0;
          }
          var durationTransX = overflowOffset;
          var durationY = loc;
          var durationWidth = durationSize;
          var durationHeight = endLoc - loc;
        } else {
          durationTransX = 0;
          var width = endLoc - loc;
          if (!isRTL) durationX = loc;
          else durationX = length - loc - width;
          if (!series.isInverted()) {
            durationTransY = overflowOffset;
            durationY = series._size - durationSize + 5;
            durationWidth = width;
            durationHeight = durationSize;
          } else {
            overflowOffset = 0;
            durationTransY = 0;
            durationY = -5;
            durationWidth = width;
            durationHeight = durationSize;
          }
        }
        if (animator) {
          if (!series.isVertical())
            duration.setTranslateY(duration.getTranslateY() + series._canvasOffsetY + overflowOffset);
          else
            duration.setTranslateX(duration.getTranslateX() + series._canvasOffsetX + overflowOffset);
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            duration,
            duration.getTranslateX,
            duration.setTranslateX,
            durationTransX
          );
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            duration,
            duration.getTranslateY,
            duration.setTranslateY,
            durationTransY
          );
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            duration,
            duration.getX,
            duration.setX,
            durationX
          );
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            duration,
            duration.getY,
            duration.setY,
            durationY
          );
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            duration,
            duration.getWidth,
            duration.setWidth,
            durationWidth
          );
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            duration,
            duration.getHeight,
            duration.setHeight,
            durationHeight
          );
        } else {
          duration.setTranslateX(durationTransX);
          duration.setTranslateY(durationTransY);
          duration.setX(durationX);
          duration.setY(durationY);
          duration.setWidth(durationWidth);
          duration.setHeight(durationHeight);
        }
      }
    },
    /**
     * Resets the rendering of a timeline series item duration event to its original position before drag.
     * @param {DvtTimelineSeriesItem} bubble The item being updated.
     * @private
     */
    _resetDragPosition: (bubble) => {
      bubble.setTranslate(bubble._initialPosition.initialX, bubble._initialPosition.initialY);
    },

    /**
     * Updates the rendering of a timeline series item duration event.
     * @param {DvtTimelineSeriesItem} item The item being updated.
     * @param {Number} transX optional transX to shift the duration event (resize dnd)
     * @param {type} animator optional animator.
     * @private
     */
    _updateDurationEvent: (item, series, transX, animator) => {
      var customRenderer = item._timeline.getOptions().itemBubbleContentRenderer;
      if (customRenderer) {
        var contentContainer = item._content.getParent();
        contentContainer.removeChild(item._content);
        item._content = DvtTimelineSeriesItemRenderer._getBubbleContent(item, series);
        contentContainer.addChild(item._content);
      }
      DvtTimelineSeriesItemRenderer._setupBubble(item, item._content, series);

      var nodeWidth, content, contentBubbleArray;
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var loc = item._timeline.getDatePos(item.getDragStartTime());
      var endLoc = item._timeline.getDatePos(item.getDragEndTime());
      var bubble = item.getBubble();
      var durationBubble = bubble.getChildAt(0);
      var durationInnerBubble = durationBubble.getChildAt(0);
      var contentBubble = item.getContentBubble();
      var nodeHeight = item.getHeight();
      var durationWidth = Math.max(endLoc - loc, DvtTimelineStyleUtils.getMinDurationEvent(item));
      var contentWidth = item.getContentWidth();
      var triangleIconSize = DvtTimelineStyleUtils.getContentBubbleArrow();
      var navMode = item._timeline.isDiscreteNavigationMode();

      // resize the bubble and address overflow content if needed
      if (animator) {
        animator.addProp(
          dvt.Animator.TYPE_NUMBER,
          durationBubble,
          durationBubble.getWidth,
          durationBubble.setWidth,
          durationWidth
        );
        animator.addProp(
          dvt.Animator.TYPE_NUMBER,
          durationInnerBubble,
          durationInnerBubble.getWidth,
          durationInnerBubble.setWidth,
          durationWidth - 4
        );
      } else {
        durationBubble.setWidth(durationWidth);
        durationInnerBubble.setWidth(durationWidth - 4);
      }

      var resizeHandle = isRTL ? item.getResizeHandleStart() : item.getResizeHandleEnd();
      if (resizeHandle) {
        resizeHandle.setTranslateX(durationWidth);
      }

      // check to use durationWidth or overflow width
      var checkWidth = contentWidth < durationWidth ? durationWidth : durationWidth + contentWidth;
      DvtTimelineSeriesItemRenderer.checkEndViewportCollision(item, series, isRTL, checkWidth);
      var endViewportCollision = item.getEndViewportCollision();
      var flipContentBubble = (isRTL && !endViewportCollision) || (!isRTL && endViewportCollision);

      if (flipContentBubble) {
        contentBubbleArray = [
          0,
          0,
          contentWidth,
          0,
          contentWidth,
          nodeHeight / 2 - triangleIconSize,
          contentWidth + triangleIconSize,
          nodeHeight / 2,
          contentWidth,
          nodeHeight / 2 + triangleIconSize,
          contentWidth,
          nodeHeight,
          0,
          nodeHeight,
          0,
          0
        ];
      } else {
        contentBubbleArray = [
          0,
          0,
          0,
          nodeHeight / 2 - triangleIconSize,
          -triangleIconSize,
          nodeHeight / 2,
          0,
          nodeHeight / 2 + triangleIconSize,
          0,
          nodeHeight,
          contentWidth,
          nodeHeight,
          contentWidth,
          0,
          0,
          0
        ];
      }
      contentBubble.setPoints(contentBubbleArray);

      if (item._timeline.getCtx().getThemeBehavior() !== 'alta') {
        durationBubble.setHeight(nodeHeight);
        durationInnerBubble.setHeight(nodeHeight - 4);
      }

      // Check overflow is true.
      // If overflow false, then this is discrete viewport navigation mode and we need to avoid showing
      // overflow to prevent it from layering into the current viewport.
      var evManager = item._timeline.getEventManager();
      if (
        DvtTimelineSeriesItemRenderer._isOverflow(item) ||
        (evManager._isDndDragging && item === evManager.DragSource.getDragObject())
      ) {
        nodeWidth = durationWidth + contentWidth + DvtTimelineStyleUtils.getContentBubbleSpacing();

        // need to enable overflow if content is still in durationEventBubble
        if (durationBubble.getNumChildren() > 1) {
          content = durationBubble.getChildAt(1);
          contentBubble.addChild(content);
          bubble.addChild(contentBubble);
        } else {
          content = contentBubble.getChildAt(0);
        }
        var padding = DvtTimelineStyleUtils.getBubblePadding(item);
        var contentPadding = DvtTimelineSeriesItemRenderer.calcPadding(
          item,
          isRTL,
          padding,
          durationWidth,
          true,
          content
        );

        var contentBubbleAdjust = (contentPadding + 15.5) * (flipContentBubble ? -1 : 1);
        if (animator) {
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            contentBubble,
            contentBubble.getTranslateX,
            contentBubble.setTranslateX,
            contentBubbleAdjust
          );
        } else {
          contentBubble.setTranslateX(contentBubbleAdjust);
        }

        // set content to visible if in discrete viewport navigation mode since it may have been hidden outside of viewport
        if (navMode) {
          content.setVisible('visible');

          // turn off draggable class (content is outside of bubble)
          if (item._timeline.isDnDMoveEnabled()) {
            bubble.setClassName('oj-timeline-item-bubble-container');
          }
        }

        var contentX = isRTL && customRenderer ? item.getContentWidth() : padding.start;
        var contentY = padding.top;
        if (animator) {
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            content,
            content.getTranslateX,
            content.setTranslateX,
            contentX
          );
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            content,
            content.getTranslateY,
            content.setTranslateY,
            contentY
          );
        } else {
          content.setTranslate(contentX, contentY);
        }
      } else {
        nodeWidth = durationWidth;

        // need to disable overflow if content is still in contentBubble
        if (contentBubble.getNumChildren() > 0) {
          content = contentBubble.getChildAt(0);
          durationBubble.addChild(content);
          bubble.removeChild(contentBubble);
        } else {
          content = durationBubble.getChildAt(1);
        }
        var padding = DvtTimelineStyleUtils.getBubblePadding(item);
        var contentPadding = DvtTimelineSeriesItemRenderer.calcPadding(
          item,
          isRTL,
          padding,
          durationWidth,
          false,
          content
        );

        // hide content if it's not in viewport for discrete viewport navigation mode to prevent layering into current viewport
        var notInViewport =
          item._timeline._viewStartTime > item.getEndTime() ||
          item._timeline._viewEndTime < item.getStartTime();
        if (navMode && notInViewport) {
          content.setVisible();

          // turn off draggable classes (content isn't shown)
          if (item._timeline.isDnDMoveEnabled()) {
            bubble.setClassName('oj-timeline-item-bubble-container');
          }
        } else {
          content.setVisible('visible');
          var contentX = contentPadding;
          var contentY = padding.top;
          if (animator) {
            animator.addProp(
              dvt.Animator.TYPE_NUMBER,
              content,
              content.getTranslateX,
              content.setTranslateX,
              contentX
            );
            animator.addProp(
              dvt.Animator.TYPE_NUMBER,
              content,
              content.getTranslateY,
              content.setTranslateY,
              contentY
            );
          } else {
            content.setTranslate(contentX, contentY);
          }

          // turn on draggable classes (content is inside bubble)
          if (item._timeline.isDnDMoveEnabled()) {
            bubble.setClassName(
              'oj-timeline-item-bubble-container oj-timeline-move-handle oj-draggable'
            );
          }
        }
      }

      var bubbleWidth = Math.max(durationWidth, DvtTimelineStyleUtils.getMinDurationEvent(item));
      var options = item._timeline.Options;
      var stripeMarginStart = DvtTimelineStyleUtils.getColorStripeMarginStart(options);
      var stripeWidth = DvtTimelineStyleUtils.getColorStripeWidth(options);
      var stripeX = isRTL ? bubbleWidth - stripeMarginStart - stripeWidth : stripeMarginStart;
      var colorStripe = item.getColorStripe();
      var bubbleContainer = item.getBubble();
      // Remove previously rendered color stripe if there shouldn't be one
      if (colorStripe && !item.hasColorStripe()) {
        bubbleContainer.removeChild(colorStripe);
        item.setColorStripe(null);
      }
      // If previously rendered background but not color stripe,
      // render color stripe if hascolorstripe is true
      if (!colorStripe && item.hasColorStripe()) {
        let colorStripeRect = item.createColorStripe();
        item.setColorStripe(colorStripeRect);
        bubbleContainer.addChild(colorStripeRect);
      }

      if (animator) {
        if (transX) {
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            bubble,
            bubble.getTranslateX,
            bubble.setTranslateX,
            transX
          );
        }
        if (colorStripe) {
          animator.addProp(
            dvt.Animator.TYPE_NUMBER,
            colorStripe,
            colorStripe.getX,
            colorStripe.setX,
            stripeX
          );
        }
        animator.addProp(dvt.Animator.TYPE_NUMBER, item, item.getWidth, item.setWidth, nodeWidth);
        animator.addProp(
          dvt.Animator.TYPE_NUMBER,
          item,
          item.getDurationWidth,
          item.setDurationWidth,
          bubbleWidth
        );
      } else {
        if (transX) {
          bubble.setTranslateX(transX);
        }
        if (colorStripe) {
          colorStripe.setX(stripeX);
        }
        item.setWidth(nodeWidth);
        item.setDurationWidth(Math.max(durationWidth, bubbleWidth));
      }
    },

    /**
     * Checks if the content is in overflow mode
     * @param {DvtTimelineSeriesItem} item The item being updated.
     * @return {boolean} true if overflow, false otherwise
     * @private
     */
    _isOverflow: (item) => {
      var contentWidth = item.getContentWidth();
      var durationWidth = item.getDurationWidth();
      var navMode = item._timeline.isDiscreteNavigationMode();
      // no overflow behavior if not duration-event right now
      if (item.getItemType() !== DvtTimelineSeriesNode.DURATION_EVENT) {
        return false;
      }

      // ignore items not in current viewport unless it is the current drag object
      var notInViewport =
        item._timeline._viewStartTime > item.getEndTime() ||
        item._timeline._viewEndTime < item.getStartTime();
      if (navMode && notInViewport && item != item._timeline.getEventManager()._keyboardDragObject) {
        return false;
      }

      if (navMode) {
        // edge case in nav mode where the item bubble breaks start viewport edge or end viewport edge
        var loc = item._timeline.getDatePos(
          Math.max(item.getDragStartTime(), item._timeline.getDiscreteViewportStartDate())
        );
        var endLoc = item._timeline.getDatePos(
          Math.min(item.getDragEndTime(), item._timeline.getDiscreteViewportEndDate())
        );
        durationWidth = endLoc - loc;
      }

      // if content is larger than the item, use overflow
      // if item is at viewport edge also use overflow
      var availableWidth = item.getAvailableContentWidth(durationWidth);
      if (availableWidth < contentWidth) {
        return true;
      }
      return false;
    },

    /**
     * Calculate the padding for the content
     * @param {DvtTimelineSeriesItem} item The item being updated.
     * @param {boolean} isRTL RTL boolean value
     * @param {object} padding default value for the bubble padding from the css, of shape {top, bottom, start, end}
     * @param {Number} nodeWidth width of the event bubble (either duration or item)
     * @param {boolean} isOverflow boolean if overflow padding should be calculated
     * @param {Container} content content to grab x position
     * @return {Number} start padding for the content
     * @private
     */
    calcPadding: (item, isRTL, padding, nodeWidth, isOverflow, content) => {
      var startPadding = padding.start;
      if (item.hasColorStripe() && !isOverflow) {
        var options = item._timeline.Options;
        var stripeMarginStart = DvtTimelineStyleUtils.getColorStripeMarginStart(options);
        var stripeWidth = DvtTimelineStyleUtils.getColorStripeWidth(options);
        startPadding += stripeMarginStart + stripeWidth;
      }
      var contentPadding = startPadding;
      var customRenderer = item._timeline.getOptions().itemBubbleContentRenderer;

      if (isRTL && customRenderer) {
        contentPadding = nodeWidth - startPadding - content._x;
      }

      var endViewportCollision = item.getEndViewportCollision();
      // check using isOverflow to determine padding
      if (isOverflow) {
        var flipContentPadding = (isRTL && !endViewportCollision) || (!isRTL && endViewportCollision);
        if (flipContentPadding) {
          nodeWidth = item.getContentWidth();
        }
        if (isRTL && customRenderer) {
          contentPadding = nodeWidth;
        } else {
          contentPadding = contentPadding + (nodeWidth - startPadding);
        }
      } else {
        if (isRTL && !customRenderer) {
          contentPadding = Math.max(padding.start, nodeWidth - startPadding - content._w);
        }
      }

      // if viewport start collision and in discrete nav mode, adjust content to start in the viewport
      if (
        item._timeline.isDiscreteNavigationMode() &&
        !isOverflow &&
        item.getItemType() === DvtTimelineSeriesNode.DURATION_EVENT
      ) {
        var viewStartCollision = DvtTimelineSeriesItemRenderer.checkStartViewportCollision(item);
        if (viewStartCollision) {
          var endLoc = item._timeline.getDiscreteViewportDatePos(
            item._timeline.getDiscreteViewportStartDate()
          );
          var loc = item._timeline.getDatePos(item.getDragStartTime());
          var paddingAdjustment = Math.max(0, endLoc - loc);
          if (isRTL) {
            contentPadding -= paddingAdjustment;
          } else {
            contentPadding += paddingAdjustment;
          }
        }
      }

      return contentPadding;
    },

    /**
     * Checks the start viewport collision parameter.
     * @param {DvtTimelineSeriesItem} item The item being updated.
     * @return {boolean} true if overflow, false otherwise
     * @private
     */
    checkStartViewportCollision: (item) => {
      return (
        item._timeline._viewStartTime >= item.getStartTime() &&
        item._timeline._viewStartTime <= item.getEndTime()
      );
    },

    /**
     * Sets the end viewport collision parameter. Will be used to set the flipped overflow container
     * @param {DvtTimelineSeriesItem} item The item being updated.
     * @param {DvtTimelineSeries} series The series containing this item.
     * @param {boolean} isRTL RTL boolean value
     * @param {Number} width width of the event bubble (either duration or item)
     * @private
     */
    checkEndViewportCollision: (item, series, isRTL, width) => {
      var renderEnd;
      var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
      var startTime = item.getDragStartTime();
      var loc = item._timeline.getDatePos(startTime);
      var navMode = item._timeline.isDiscreteNavigationMode();
      var length = navMode ? item._timeline._discreteContentLength : series._length;
      // use viewport end time vs timeline end time if in discrete navigation mode
      var endViewportDate = item._timeline.getDiscreteViewportEndDate();
      var endViewportPos = item._timeline.getDatePos(item._timeline._viewEndTime);
      item.setEndViewportCollision(false);

      // no collision behavior if not duration-event
      if (item.getItemType() !== DvtTimelineSeriesNode.DURATION_EVENT) {
        return;
      }

      // add half the preview wings to make it look more natural if it would be slightly too long
      var collisionAdjustment = navButtonBackgroundWidth / 2;
      if (!isRTL) {
        renderEnd = loc + DvtTimelineStyleUtils.getContentBubbleSpacing() + width;

        if (renderEnd > endViewportPos + collisionAdjustment) {
          // need to use overflow
          item.setEndViewportCollision(true);
        }
      } else {
        renderEnd = length - loc - width - DvtTimelineStyleUtils.getContentBubbleSpacing();
        var startViewportPos = length - endViewportPos;
        if (navMode) {
          startViewportPos = startViewportPos - navButtonBackgroundWidth;
        }
        if (startViewportPos + collisionAdjustment > renderEnd) {
          item.setEndViewportCollision(true);
        }
      }
    }
  };

  /**
   * Timeline event manager.
   * @param {Timeline} timeline The owning Timeline.
   * @extends {TimeComponentEventManager}
   * @constructor
   */
  class DvtTimelineEventManager extends ojdvtTimecomponent.TimeComponentEventManager {
    constructor(timeline) {
      super(timeline);

      /**
       * Scale jump ramp for high level DnD navigation
       * @type {array}
       * @private
       */
      this._HIGH_LEVEL_DND_NAV_SCALES = [
        'milliseconds',
        'seconds',
        'minutes',
        'hours',
        'days',
        'weeks',
        'months',
        'quarters',
        'years'
      ];
    }

    /**
     * @override
     */
    addListeners(displayable) {
      super.addListeners(displayable);
      if (!dvt.Agent.isTouchDevice()) {
        // IE does not always fire the appropriate mouseover and mouseout events, so use mouseenter instead
        var stage = this.getCtx().getStage();
        if (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') {
          stage.addEvtListener('mouseenter', this.OnMouseEnter, false, this);
          stage.addEvtListener('mouseleave', this.OnMouseLeave, false, this);
        }
        this._component.addEvtListener('focusout', this._handleFocusout, false, this);
        this._component.addEvtListener('focusin', this._handleFocusin, false, this);
      }
    }

    /**
     * @override
     */
    RemoveListeners(displayable) {
      super.RemoveListeners(displayable);
      if (!dvt.Agent.isTouchDevice()) {
        // IE does not always fire the appropriate mouseover and mouseout events, so use mouseenter instead
        var stage = this.getCtx().getStage();
        if (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') {
          stage.removeEvtListener('mouseenter', this.OnMouseEnter, false, this);
          stage.removeEvtListener('mouseleave', this.OnMouseLeave, false, this);
        }
        this._component.removeEvtListener('focusout', this._handleFocusout, false, this);
        this._component.removeEvtListener('focusin', this._handleFocusin, false, this);
        this._clearOpenPopupListeners();
      }
    }

    /**
     * @private
     */
    _clearOpenPopupListeners() {
      if (this._openPopup != null) {
        this._openPopup.removeEventListener('focusin', this._handlePopupFocusinListener);
        this._openPopup.removeEventListener('focusout', this._handlePopupFocusoutListener);
        this._openPopup = null;
      }
      this._handlePopupFocusinListener = null;
      this._handlePopupFocusoutListener = null;
    }

    /**
     * @private
     */
    _handlePopupFocusout(event) {
      this._handleFocusout(event, true);
    }

    /**
     * @private
     */
    _handlePopupFocusin(event) {
      this._handleFocusin(event, true);
    }

    /**
     * Clears any pending focusout timeout.
     * @private
     */
    _clearFocusoutTimeout() {
      if (this._focusoutTimeout) {
        clearTimeout(this._focusoutTimeout);
        this._focusoutTimeout = null;
      }
    }

    /**
     * @private
     */
    _handleFocusout(event, isPopupFocusout) {
      this._clearFocusoutTimeout();

      if (!isPopupFocusout) {
        // Components that open popups (such as ojSelect, ojCombobox, ojInputDate, etc.) will trigger
        // focusout, but we don't want to change mode in those cases since the user is still editing.
        this._clearOpenPopupListeners();
        var openPopup = ojkeyboardfocusUtils.getLogicalChildPopup(this._component.getElem());
        if (openPopup != null) {
          // setup focus listeners on popup
          this._openPopup = openPopup;
          this._handlePopupFocusinListener = this._handlePopupFocusin.bind(this);
          this._handlePopupFocusoutListener = this._handlePopupFocusout.bind(this);
          openPopup.addEventListener('focusin', this._handlePopupFocusinListener);
          openPopup.addEventListener('focusout', this._handlePopupFocusoutListener);
          return;
        }
      }

      // set timeout to stay in editable/actionable mode if focus comes back into the table
      // prettier-ignore
      this._focusoutTimeout = setTimeout( // @HTMLUpdateOK
        function () {
          this._clearOpenPopupListeners();
          var keyboardUtils = this._component.getOptions()._keyboardUtils;
          if (this._component.activeInnerElemsNode) {
            keyboardUtils.disableAllFocusable(
              this._component.activeInnerElemsNode._displayable.getElem()
            );
            this._component.activeInnerElemsNode.hasActiveInnerElems = false;
            this._component.activeInnerElems = null;
            this._component.activeInnerElemsNode = null;
          }
        }.bind(this),
        100
      );
    }

    /**
     * @private
     */
    _handleFocusin(event, isPopupFocusin) {
      // reset focusout timeout and busy state
      this._clearFocusoutTimeout();

      if (!isPopupFocusin) {
        this._clearOpenPopupListeners();
      }
    }

    /**
     * @override
     */
    ProcessKeyboardEvent(event) {
      var eventConsumed = true;
      var keyCode = event.keyCode;
      var focusObj = this.getFocus();

      if (keyCode == dvt.KeyboardEvent.TAB && focusObj) {
        // If there are activeElems, tab between them
        var activeInnerSize = this._component.activeInnerElems
          ? this._component.activeInnerElems.length
          : undefined;
        if (activeInnerSize) {
          var testElement = event.shiftKey
            ? this._component.activeInnerElems[0]
            : this._component.activeInnerElems[activeInnerSize - 1];
          // Want to prevent the tab focus from leaving the focusable elements within the node/link
          if (testElement === document.activeElement) {
            if (event.shiftKey) {
              this._component.activeInnerElems[activeInnerSize - 1].focus();
            } else {
              this._component.activeInnerElems[0].focus();
            }
            event.preventDefault();
          }
          return eventConsumed;
        }
        var keyboardUtils = this._component.Options._keyboardUtils;
        keyboardUtils.disableAllFocusable(this._component.getTimeZoomCanvas().getElem(), true);
      }
      eventConsumed = super.ProcessKeyboardEvent(event);
      return eventConsumed;
    }

    /**
     * @override
     */
    PreOnMouseOver(event) {
      if (this._mouseOutTimer && this._mouseOutTimer.isRunning()) this._mouseOutTimer.stop();
      super.PreOnMouseOver(event);

      if (dvt.Agent.browser !== 'ie' && dvt.Agent.browser !== 'edge' && !this.isMouseOver)
        this.isMouseOver = true;
    }

    /**
     * Handler for the mouseenter event.
     * @param {dvt.MouseEvent} event The mouseenter event.
     */
    OnMouseEnter(event) {
      if (this._mouseOutTimer && this._mouseOutTimer.isRunning()) this._mouseOutTimer.stop();

      if (!this.isMouseOver) this.isMouseOver = true;
    }

    /**
     * Handler for the mouseleave event.
     * @param {dvt.MouseEvent} event The mouseleave event.
     */
    OnMouseLeave(event) {
      if (!this._mouseOutTimer)
        this._mouseOutTimer = new dvt.Timer(this.getCtx(), 10, this._onMouseOutTimerEnd, this, 1);

      this._mouseOutTimer.reset();
      this._mouseOutTimer.start();
    }

    /**
     * @override
     */
    PreOnMouseOut(event) {
      super.PreOnMouseOut(event);
      if (dvt.Agent.browser !== 'ie' && dvt.Agent.browser !== 'edge') {
        if (!this._mouseOutTimer)
          this._mouseOutTimer = new dvt.Timer(this.getCtx(), 10, this._onMouseOutTimerEnd, this, 1);

        this._mouseOutTimer.reset();
        this._mouseOutTimer.start();
      }
    }

    /**
     * Mouse out timer callback function.
     * @private
     */
    _onMouseOutTimerEnd() {
      this.isMouseOver = false;
    }

    /**
     * @override
     */
    OnMouseDown(event) {
      var adjustedEvent = this.setDraggedObj(event);
      super.OnMouseDown(adjustedEvent);
    }

    /**
     *
     */
    setDraggedObj(event) {
      var objAndDisp = this.GetLogicalObjectAndDisplayable(event.target);
      // If draggable, prevent drag panning
      // objAndDisp.displayable is the handle for move/resize
      // objAndDisp.logicalObject._displayable is the reference to the timeline item bubble DvtTimelineSeriesItem
      // that we are dragging.
      if (
        objAndDisp.displayable &&
        objAndDisp.displayable.getClassName() &&
        objAndDisp.displayable.getClassName().indexOf('oj-draggable') !== -1
      ) {
        var dragType = null;
        if (objAndDisp.displayable.getClassName().indexOf('oj-timeline-move-handle') !== -1) {
          dragType = 'event';
        } else if (
          objAndDisp.displayable.getClassName().indexOf('oj-timeline-resize-handle-start') !== -1
        ) {
          dragType = 'resize-handle';
          objAndDisp.logicalObject._displayable._resizeEdge = 'start';
        } else if (
          objAndDisp.displayable.getClassName().indexOf('oj-timeline-resize-handle-end') !== -1
        ) {
          dragType = 'resize-handle';
          objAndDisp.logicalObject._displayable._resizeEdge = 'end';
        }
        // Grab the type.
        objAndDisp.logicalObject.setDragType(dragType);

        if (this.IsDragSupported(objAndDisp.logicalObject.getDragType())) {
          this._component.SetPanningEnabled(false);
          this._component.SetMarqueeEnabled(false);

          // Normally this can be handled on dragstart event, but
          // IE11 is stupid. dragstart events fire after the mouse/touch drags
          // a certain px away from the initiation point, and in all browsers
          // except IE11, the dragstart event targets the element at the initiation point.
          // IE11's dragstart, however, targets the element at the point where dragstart
          // event fires, which can be different from that of the initiation point.
          objAndDisp.logicalObject.setDraggedObj(objAndDisp.logicalObject._displayable);
        }
      }
      return event;
    }

    /**
     * Discrete viewport navigation mode previous page callback
     * @private
     */
    prevPage() {
      var elClass = this._component._prevArrowContainer.getClassName();

      if (elClass.indexOf('oj-timeline-nav-arrow-disabled') === -1) {
        this._component._discreteViewportCurrentIndexOffset--;
        this._component.handlePageChangeDiscreteViewport();
      }
    }

    /**
     * Discrete viewport navigation mode next page callback
     * @private
     */
    nextPage() {
      var elClass = this._component._nextArrowContainer.getClassName();

      if (elClass.indexOf('oj-timeline-nav-arrow-disabled') === -1) {
        this._component._discreteViewportCurrentIndexOffset++;
        this._component.handlePageChangeDiscreteViewport();
      }
    }

    /**
     * Discrete viewport navigation mode next/prev page event handle callback
     * @private
     */
    handleArrowPress(event) {
      var focusObj = this.getFocus();
      if (focusObj._id === 'prevNavArrow') {
        this.prevPage();
      } else if (focusObj._id === 'nextNavArrow') {
        this.nextPage();
      }
      return focusObj;
    }

    /**
     * Pans by the specified amount.
     * @param {number} dx A number from specifying the pan ratio in the x direction, e.g. dx = 0.5 means pan end by 50%..
     * @param {number} dy A number from specifying the pan ratio in the y direction, e.g. dy = 0.5 means pan down by 50%.
     */
    panBy(dx, dy) {
      var focusObj = this.getFocus();
      if (focusObj) this._comp._dragPanSeries = focusObj._series;

      super.panBy(dx, dy);
    }

    /**
     * on drag cancel, reset drag position for the obj.
     */
    _handleDragCancel(obj) {
      this.handleDurationEventReset(obj, obj._series);
    }

    /**
     * update duration event during resize
     * @override
     */
    handleDurationEventResize(item, series, transX) {
      DvtTimelineSeriesItemRenderer._updateDurationEvent(item, series, transX);
    }

    /**
     * reset duration event to original position
     * @override
     */
    handleDurationEventReset(item, series) {
      DvtTimelineSeriesItemRenderer._updateDurationEvent(item, series);
    }

    /**
     * @override
     */
    GetDragSourceType(event) {
      var obj = this.DragSource.getDragObject(); // null or DvtDraggable
      if (obj && obj.getItemType() === 'duration-event') {
        // The drag source should have been set already on mousedown/touchstart.
        // However, if called from dragstart event, and the event is artifically dispatched (e.g. during automated testing),
        // then explicitly set an appropriate drag source.
        if (event && event.getNativeEvent().type === 'dragstart') {
          var nativeEvent = event.getNativeEvent();
          var clientX = nativeEvent.clientX;
          var clientY = nativeEvent.clientY;
          var offsetX = nativeEvent.offsetX;
          var offsetY = nativeEvent.offsetY;
          var isTest =
            (clientX == null && clientY == null) ||
            ((dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') &&
              isNaN(offsetX) &&
              isNaN(offsetY));
          if (isTest) {
            //this.setDraggedObj(nativeEvent);
          }
        }
        return this.getDragType(obj);
      }
      return null;
    }

    /**
     * @override
     */
    GetDropTargetType(event) {
      return 'canvas';
    }

    /**
     * @override
     */
    GetDropEventPayload(event) {
      // Apply the drop offset if the drag source is a DVT component
      // NOTE: The drop offset is stored in dataTransfer, so it's only accessible from "drop" event. It can't be
      //       accessed from "dragEnter", "dragOver", and "dragLeave".
      var dragObj = this.DragSource.getDragObject()
        ? this.DragSource.getDragObject()
        : this._keyboardDragObject;
      var relPosStage = this._context.pageToStageCoords(event.pageX, event.pageY);
      var deltaX = dragObj._displayable._initialDragOffset.offsetX - relPosStage.x;
      var newDropDate = new Date(
        this._component.getPosDate(dragObj._displayable._initialDragOffset.offsetX - deltaX)
      );

      var payload = {
        value: newDropDate.toISOString(),
        start: null,
        end: null
      };

      var dragObj = this.DragSource.getDragObject();

      if (dragObj && dragObj.getItemType() === 'duration-event') {
        var startTime = dragObj._dragStartTime;
        var endTime = dragObj._dragEndTime;

        var dragSourceType = this.getDnDTaskSubType(dragObj);

        if (dragSourceType === 'event') {
          payload['start'] = startTime;
          payload['end'] = endTime;
          payload['start'] = new Date(payload['start']).toISOString();
          payload['end'] = new Date(payload['end']).toISOString();
        } else if (dragSourceType === 'resize-handle') {
          if (dragObj._displayable._resizeEdge === 'start') {
            payload['start'] = new Date(startTime).toISOString();
            payload['end'] = new Date(dragObj._endTime).toISOString();
          } else {
            payload['start'] = new Date(dragObj._startTime).toISOString();
            payload['end'] = new Date(endTime).toISOString();
          }
        }
        return payload;
      }
    }

    /**
     * Helper function that checks if a given source type is draggable
     * @param {string} type
     * @return {boolean} true if the source type can be dragged
     * @protected
     */
    IsDragSupported(type) {
      if (this.isDndSupported()) {
        var options = this._component.getOptions();
        var dragConfig = options['dnd'] && options['dnd']['drag'] ? options['dnd']['drag'] : null;
        return (
          dragConfig &&
          dragConfig[type] &&
          dragConfig[type]['dataTypes'] &&
          dragConfig[type]['dataTypes'].length > 0
        );
      }
      return false;
    }

    /**
     * Helper function that checks if a given source type is draggable
     * @param {Element} target
     * @return {string} draggable source type or null
     * @protected
     */
    getDragType(taskObject) {
      return taskObject ? taskObject.getDragType() : null;
    }

    /**
     * @override
     * @return {boolean} whether DnD dragging is happening
     */
    isDndSupported() {
      return true;
    }

    /**
     * Whether DnD dragging is currently happening
     * @return {boolean} whether DnD dragging is happening
     */
    isDnDDragging() {
      return this._isDndDragging;
    }

    /**
     * Setup upon drag start
     * @private
     */
    _dragStartSetup() {
      // Store current viewport:
      // 1) in case drag canceled later and need to revert back to original state
      // 2) or drag finished, but need to compare with initial viewport to see if viewport change event needs to be fired
      this._dragInitialX = this._component.getTimeZoomCanvas().getTranslateX();
      this._dragInitialY = this._component.getTimeZoomCanvas().getTranslateY();
      this._dragInitialViewportStart = this._component.getViewportStartTime();
      this._dragInitialViewportEnd = this._component.getViewportEndTime();
    }

    /**
     * Show the bubble outlines for a single moved item
     * @param obj the target object to show outline
     * @private
     */
    _setupObjMoveAffordance(obj) {
      DvtTimelineSeriesItemRenderer._renderEventMoveDragOutline(obj);
      obj._series._blocks[0].removeChild(obj._displayable);
      obj._series._blocks[0].addChild(obj._displayable);
    }

    /**
     * Show the bubble outlines for each moved item
     * @param obj the target object being moved
     * @private
     */
    _setupMoveAffordance(obj) {
      if (obj.getDragType() === 'event') {
        this._setupObjMoveAffordance(obj);
        this._applyToSelection((selectionObj) => {
          if (selectionObj && obj != selectionObj) {
            this._setupObjMoveAffordance(selectionObj);
          }
        });
      }
    }

    /**
     * Show the bubble outlines for each moved item
     * @param obj the target object being moved
     * @private
     */
    _hideMoveAffordance(obj) {
      if (obj.getDragType() === 'event') {
        DvtTimelineSeriesItemRenderer._hideEventMoveDragOutline(obj);
        this._applyToSelection((selectionObj) => {
          if (selectionObj && selectionObj != obj) {
            DvtTimelineSeriesItemRenderer._hideEventMoveDragOutline(selectionObj);
          }
        });
      }
    }

    /**
     * Cleanup when drag is happening, but deliberately cancelled, e.g.
     * via Esc key during drag (NOT via event.preventDefault on dragStart event)
     * @private
     */
    _dragCancelCleanup() {
      // Revert viewport to original state
      if (this._dragInitialX) {
        var deltaX = this._component.getTimeZoomCanvas().getTranslateX() - this._dragInitialX;
        var deltaY = this._component.getTimeZoomCanvas().getTranslateY() - this._dragInitialY;
        if (deltaX !== 0 || deltaY !== 0) {
          var dragObj = this._keyboardDragObject
            ? this._keyboardDragObject
            : this.DragSource.getDragObject();
          if (this._component.isDiscreteNavigationMode()) {
            this._component.discreteScrollIntoViewport(dragObj);
          } else {
            this._component.panZoomCanvasBy(deltaX);
            // in case of rounding errors, explictly reset viewport start/end times
            this._component.setViewportStartTime(this._dragInitialViewportStart);
            this._component.setViewportEndTime(this._dragInitialViewportEnd);
          }
        }
      }

      this._dragInitialX = null;
      this._dragInitialY = null;
      this._dragInitialViewportStart = null;
      this._dragInitialViewportEnd = null;
    }

    /**
     * Cleanup on drop
     * @private
     */
    _dropCleanup() {
      // Fire viewport change event if viewport changed
      if (
        this._dragInitialViewportStart != null &&
        (this._dragInitialViewportStart !== this._component.getViewportStartTime() ||
          this._dragInitialViewportEnd !== this._component.getViewportEndTime())
      ) {
        this._component.dispatchEvent(this._component.createViewportChangeEvent());
      }

      this._dragInitialX = null;
      this._dragInitialY = null;
      this._dragInitialViewportStart = null;
      this._dragInitialViewportEnd = null;
      this._isDndDragging = false;
    }

    /**
     * The current keyboard DnD mode.
     * @return {string} The current mode, e.g. 'move'. null if not currently using keyboard for DnD.
     */
    getKeyboardDnDMode() {
      return this._keyboardDnDMode;
    }

    /**
     * Perform an update on the dnd drag object and selection objects.
     */
    updateDnd() {
      if (this._keyboardDnDMode != null) {
        // Update and show feedback
        this._setupMoveAffordance(this._keyboardDragObject);
        this._keyboardDragObject.dragStartSetup();
        this._keyboardDragObject.updateDragFeedback(this._keyboardDragObject);
        this._applyToSelection((selectionObj) => {
          if (selectionObj && selectionObj != this._keyboardDragObject) {
            selectionObj.updateDragFeedback(this._keyboardDragObject);
          }
        });
      } else {
        var obj = this.DragSource.getDragObject();
        this._setupMoveAffordance(obj);
        obj.dragStartSetup();
        obj.updateDragFeedback(obj);
        this._applyToSelection((selectionObj) => {
          if (selectionObj && selectionObj != obj) {
            selectionObj.updateDragFeedback(obj);
          }
        });
      }
    }

    /**
     * @override
     */
    OnDndDragStart(event) {
      super.OnDndDragStart(event);

      // At this point, isDnDDragging should be false. If true, then something else initiated a drag, e.g. keyboard move,
      // There should only be one set of things dragging at any give time, so cancel this one.
      if (this._isDndDragging) {
        event.preventDefault();
      }

      var nativeEvent = event.getNativeEvent();
      if (!nativeEvent.defaultPrevented) {
        this._isDndDragging = true;
        this._dragStartSetup();
        var obj = this.DragSource.getDragObject();
        this._applyToSelection((selectionObj) => {
          if (selectionObj && selectionObj != obj) {
            if (obj.getDragType() === 'event') {
              this._setupMoveAffordance(selectionObj);
            }
            selectionObj.dragStartSetup(nativeEvent);
          }
        });
        if (obj.getDragType() === 'event') {
          this._setupMoveAffordance(obj);
          this._applyToSelection((selectionObj) => {
            if (selectionObj && selectionObj != obj) {
              this._setupMoveAffordance(selectionObj);
            }
          });
        }
        obj.dragStartSetup(nativeEvent);
        this._applyToSelection((selectionObj) => {
          if (selectionObj && selectionObj != obj) {
            selectionObj.dragStartSetup(nativeEvent);
          }
        });

        this._dropOffset = new dvt.Point(0, 0);
      } else {
        // Reenable panning/marquee
        this._component.SetPanningEnabled(true);
        this._component.SetMarqueeEnabled(true);
      }
    }

    /**
     * @override
     */
    OnDndDragOver(event) {
      super.OnDndDragOver(event);
      // Redrawing the drag feedback image every time the dragover event is fired (every 350ms or so, even when the mouse didn't move)
      // affects performance, especially when the viewport refreshes on edge auto panning. Throttle the feedback drawing using
      // requestAnimationFrame similar to the example outlined in https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
      var self = this;
      this._lastKnownDragOverEvent = event;
      self._isDndDragging = true;
      // Only requestAnimationFrame if one is not requested already, and if the mouse moved (no need to update feedback if mouse didn't move).
      if (
        !this._isDragOverTicking &&
        (!this._lastProcessedDragOverEvent ||
          this._lastKnownDragOverEvent.pageX !== this._lastProcessedDragOverEvent.pageX ||
          this._lastKnownDragOverEvent.pageY !== this._lastProcessedDragOverEvent.pageY)
      ) {
        requestAnimationFrame(() => {
          // Need to do this here instead of onDndDrag because the drag event doesn't have pageX/Y on FF for some reason.
          var obj = self.DragSource.getDragObject();
          if (obj && self._isDndDragging) {
            if (self._lastKnownDragOverEvent.getNativeEvent().defaultPrevented) {
              self._handleDndPan(obj);
              self._dragShowFeedback(obj);

              // For touch devices with screenreader, we're using passthru gesture (in iOS VoiceOVer, double tap and hold until tone, then drag) to perform real HTML5 drag and drop.
              // Update the aria live region with position information if the position changed due to drag.
              if (dvt.Agent.isTouchDevice()) {
                // Only update the aria live region if what we want to be read out changed,
                // e.g. the finger may have stopped, but moved 1px by accident and we don't want what's currently being read be interrupted.
                var screenReaderDragText = dvt.AriaUtils.processAriaLabel(
                  DvtTimelineTooltipUtils.getDatatip(obj, false)
                );
                if (self._component.isItemSelectionEnabled() && obj.isSelected()) {
                  var totalSelected = self._component.SelectionHandler.getSelectedCount();
                  if (totalSelected > 1) {
                    screenReaderDragText +=
                      '. ' +
                      dvt.ResourceUtils.format(
                        self._component.getOptions().translations.itemMoveSelectionInfo,
                        [totalSelected - 1]
                      );
                  }
                }

                if (
                  !self._prevScreenReaderDragText ||
                  self._prevScreenReaderDragText !== screenReaderDragText
                ) {
                  self._component.updateLiveRegionText(screenReaderDragText);
                }
                self._prevScreenReaderDragText = screenReaderDragText;
              }
            }
          }
          self._lastProcessedDragOverEvent = self._lastKnownDragOverEvent;
          self._isDragOverTicking = false;
        });
        this._isDragOverTicking = true;
      }
    }

    /**
     * @override
     */
    OnDndDragEnd(event) {
      super.OnDndDragEnd(event);

      var obj = this.DragSource.getDragObject();
      if (obj.getDragType() === 'event') {
        // hide the move outline
        this._hideMoveAffordance(obj);
        this._applyToSelection((selectionObj) => {
          if (selectionObj && selectionObj != obj) {
            this._hideMoveAffordance(obj);
          }
        });
      }
      this._isDndDragging = false;

      // If mouse dragging, but keyboard Esc pressed to cancel, then dropEffect is 'none'
      // This is the recommended way to detect drag cancelling according to MDN:
      // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragend
      // "If the dropEffect property has the value none during a dragend, then the drag was cancelled. Otherwise, the effect specifies which operation was performed."
      if (event.getNativeEvent().dataTransfer.dropEffect === 'none') {
        this.handleKeyboardDnDCancel();
        this._handleDragCancel(obj);
        this._dropCleanup();
      }
      obj._dropCleanup();
      this._applyToSelection((selectionObj) => {
        if (selectionObj && selectionObj != obj) {
          selectionObj._dropCleanup();
        }
      });
      // reenabling panning/marquee on dragend and on mouseup
      // the panning/marquee is disabled on mousedown event to prevent panning/marqueeing before potential drag
      // if draggable source is not dragged, the component will not get dragend event and the panning is reenabled on mouseup
      // if draggable source was dragged, the component will get dragend event, but it might not get mouseup event
      this._component.SetPanningEnabled(true);
      this._component.SetMarqueeEnabled(true);
    }

    /**
     */
    _dragShowFeedback(obj) {
      var stagePos = this._component
        .getCtx()
        .pageToStageCoords(this._lastKnownDragOverEvent.pageX, this._lastKnownDragOverEvent.pageY);
      // Note, "local" here means in the reference of the affordance container coord system
      obj.showDragFeedback(
        this._lastKnownDragOverEvent,
        stagePos,
        obj,
        this._dropOffset,
        false,
        true
      );
      this._applyToSelection((selectionObj) => {
        if (selectionObj && selectionObj != obj) {
          selectionObj.showDragFeedback(
            this._lastKnownDragOverEvent,
            stagePos,
            obj,
            this._dropOffset,
            false,
            false
          );
        }
      });
    }

    /**
     * @override
     */
    OnDndDrop(event) {
      super.OnDndDrop(event);

      // Viewport adjustments need to be done before handling move callback (rerender may happen after move callback)
      var nativeEvent = event.getNativeEvent();
      if (nativeEvent.defaultPrevented) {
        var dragObj = this.DragSource.getDragObject();
        var sourceType = dragObj.getDragType();
        if (this._component.isDnDMoveEnabled() && sourceType === 'event') {
          // For touch devices with screenreader, we're using passthru gesture (in iOS VoiceOVer, double tap and hold until tone, then drag) to perform real HTML5 drag and drop.
          // Update the aria live region when drop happened (i.e. in VO, when the finger is lifted to end passthru gesture);
          if (dvt.Agent.isTouchDevice()) {
            this._component.updateLiveRegionText(
              this._component.getOptions().translations.itemMoveFinalized
            );
          }

          var dropPayload = this.GetDropEventPayload(event);
          var selection = this._component.SelectionHandler.getSelection();
          var itemContexts = [];
          for (var i = 0; i < selection.length; i++) {
            var selectionObj = selection[i];
            itemContexts.push(selectionObj.getDataContext());
          }
          var value = dropPayload['value'];
          var start = dropPayload['start'];
          var end = dropPayload['end'];
          var evt = dvt.EventFactory.newTimelineMoveEvent(itemContexts, value, start, end);
          this._component.dispatchEvent(evt);
        } else if (this._component.isDnDResizeEnabled() && sourceType === 'resize-handle') {
          // Update the aria live region when drop happened (i.e. in VO, when the finger is lifted to end passthru gesture);
          if (dvt.Agent.isTouchDevice()) {
            this._component.updateLiveRegionText(
              this._component.getOptions().translations.itemResizeFinalized
            );
          }
          var dropPayload = this.GetDropEventPayload(event);
          var selection = this._component.SelectionHandler.getSelection();
          var itemContexts = [];
          for (var i = 0; i < selection.length; i++) {
            var selectionObj = selection[i];
            itemContexts.push(selectionObj.getDataContext());
          }
          var value = dropPayload['value'];
          var start = dropPayload['start'];
          var end = dropPayload['end'];
          var evt = dvt.EventFactory.newTimelineResizeEvent(
            itemContexts,
            value,
            start,
            end,
            dragObj._displayable._resizeEdge
          );
          this._component.dispatchEvent(evt);
        }
      }
    }

    /**
     * Gets the specific DnD sub type (e.g. events, handles, etc.) from the DvtTimelineSeriesNode
     * @param {DvtTimelineSeriesNode} taskObject
     * @return {string} The specifc drag source type
     */
    getDnDTaskSubType(taskObject) {
      return this.getDragType(taskObject);
    }

    /**
     * Apply operations to all selection items
     * @param {function} callback the callback function to perform
     * @private
     */
    _applyToSelection(callback) {
      var selection = this._component.SelectionHandler.getSelection();
      for (var i = 0; i < selection.length; i++) {
        var selectionObj = selection[i];
        callback(selectionObj);
      }
    }

    /**
     * Handles keyboard DnD initiation
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
     * @param {DvtTimelineSeriesNode} sourceObj The source object
     * @param {string} feedbackPosReference The feedback's reference point, one of 'start' or 'end
     * @param {Object} translationProperties Translation properties to use for accessibility
     * @private
     */
    _handleKeyboardDnDInitiation(event, sourceObj, feedbackPosReference, translationProperties) {
      if ((sourceObj && sourceObj.getItemType() !== 'duration-event') || this._isDndDragging) {
        // only support dnd for duration-event for now, must not be already dragging
        event.preventDefault();
        return null;
      }

      var isRTL = dvt.Agent.isRightToLeft(this._component.getCtx());
      var orientationFactor = isRTL ? -1 : 1;
      this._isDndDragging = true;
      this._keyboardDragObject = sourceObj;
      this._dragStartSetup();

      // Put up a glass pane to block certain mouse events, in case mouse is over the component during keyboard DnD.
      // E.g. mouseout gets fired when the timeline scrolls during keyboard move such that the row rect underneath the mouse moved away
      // The mouseout event in turn hides the tooltip during keyboard move.
      this._component.registerAndConstructGlassPane();
      var glassPaneAdded = this._component.installGlassPane();

      // Set navigation scale to whatever the scale of the (minor) time axis is
      this._keyboardDnDScaleRampIndex = this._HIGH_LEVEL_DND_NAV_SCALES.indexOf(
        this._component.getTimeAxis().getScale()
      );

      sourceObj.setDraggedObj(sourceObj._displayable);
      if (this._keyboardDnDMode === 'move') {
        sourceObj.setDragType('event');
      } else if (this._keyboardDnDMode === 'resizeStart' || this._keyboardDnDMode === 'resizeEnd') {
        sourceObj.setDragType('resize-handle');
        sourceObj._displayable._resizeEdge = feedbackPosReference;
      }

      this._keyboardDnDFeedbackLocalPos = {
        x:
          sourceObj._displayable.getTranslateX() +
          (feedbackPosReference === 'end') *
            orientationFactor *
            sourceObj._displayable.getDimensions().w,
        y: sourceObj._displayable.getTranslateY()
      };

      var startEvent = {
        offsetX: this._keyboardDnDFeedbackLocalPos.x,
        offsetY: this._keyboardDnDFeedbackLocalPos.y
      };
      sourceObj.dragStartSetup(startEvent);
      this._setupMoveAffordance(sourceObj);
      sourceObj.showDragFeedback(
        event,
        this._keyboardDnDFeedbackLocalPos,
        sourceObj,
        { x: 0, y: 0 },
        true,
        true
      );
      this._applyToSelection((selectionObj) => {
        if (selectionObj && selectionObj != sourceObj) {
          selectionObj.dragStartSetup(startEvent);
          if (this._keyboardDnDMode === 'move') {
            this._setupMoveAffordance(selectionObj);
          }
          selectionObj.showDragFeedback(
            event,
            this._keyboardDnDFeedbackLocalPos,
            sourceObj,
            { x: 0, y: 0 },
            true,
            false
          );
        }
      });
      // As a result of bringing up the glass pane, if the mouse happens to be over the Gantt, a mouseout event is fired, which
      // tries to hide tooltips. Result--the drag tooltip is not shown, which is not desirable.
      // Flag that the feedback tooltip shouldn't be hidden no matter what stray mouse events fired in this scenario.
      if (glassPaneAdded) {
        this._preventHideTooltip = true;
      }

      this._keyboardDnDTargetObj = null;

      var startTime = sourceObj.getStartTime();
      var endTime = sourceObj.getEndTime();

      this._keyboardDnDFeedbackTime = {
        start: startTime,
        end: endTime
      };

      // Update the aria live region with text that the screenreader should read.
      var translations = this._component.getOptions().translations;
      var initiationDesc = translations[translationProperties.initiated];
      if (this._component.isItemSelectionEnabled() && this._keyboardDragObject.isSelected()) {
        var totalSelected = this._component.SelectionHandler.getSelectedCount();
        if (totalSelected > 1) {
          initiationDesc +=
            '. ' +
            dvt.ResourceUtils.format(translations[translationProperties.selectionInfo], [
              totalSelected - 1
            ]);
        }
      }
      initiationDesc += '. ' + translations[translationProperties.instruction] + '.';
      this._component.updateLiveRegionText(initiationDesc);
    }

    /**
     * Handles high level DnD Move initiation via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
     * @param {DvtTimelineSeriesNode} sourceObj The source object
     */
    handleKeyboardMoveInitiation(event, sourceObj) {
      this._keyboardDnDMode = 'move';
      var translationProperties = {
        initiated: 'itemMoveInitiated',
        selectionInfo: 'itemMoveSelectionInfo',
        instruction: 'itemMoveInitiatedInstruction'
      };
      this._handleKeyboardDnDInitiation(event, sourceObj, 'start', translationProperties);
    }

    /**
     * Handles high level DnD Start Resize initiation via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
     * @param {DvtTimelineSeriesNode} sourceObj The source object
     */
    handleKeyboardResizeStartInitiation(event, sourceObj) {
      this._keyboardDnDMode = 'resizeStart';
      var translationProperties = {
        initiated: 'itemResizeStartInitiated',
        selectionInfo: 'itemResizeSelectionInfo',
        instruction: 'itemResizeInitiatedInstruction'
      };
      this._handleKeyboardDnDInitiation(event, sourceObj, 'start', translationProperties);
    }

    /**
     * Handles high level DnD End Resize initiation via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
     * @param {DvtTimelineSeriesNode} sourceObj The source object
     */
    handleKeyboardResizeEndInitiation(event, sourceObj) {
      this._keyboardDnDMode = 'resizeEnd';
      var translationProperties = {
        initiated: 'itemResizeEndInitiated',
        selectionInfo: 'itemResizeSelectionInfo',
        instruction: 'itemResizeInitiatedInstruction'
      };
      this._handleKeyboardDnDInitiation(event, sourceObj, 'end', translationProperties);
    }

    /**
     * Handles high level DnD along time via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered move forward/backward
     * @param {string} direction The direction, either 'forward' or 'backward'
     * @private
     */
    _handleKeyboardDnDChronologically(event, direction) {
      var isRTL = dvt.Agent.isRightToLeft(this._component.getCtx());
      var navigationScale = this.getKeyboardDnDNavigationScale();

      var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
      var timelineMinTime = !this._component.isDiscreteNavigationMode()
        ? this._component._start
        : this._component.getPosDate(
            this._component.getDatePos(this._component._start) + navButtonBackgroundWidth
          );
      var timelineMaxTime = !this._component.isDiscreteNavigationMode()
        ? this._component._end
        : this._component.getPosDate(
            this._component.getDatePos(this._component._end) - navButtonBackgroundWidth
          );
      var length = this._component.isDiscreteNavigationMode()
        ? this._component._discreteContentLength
        : this._component.getContentLength();

      var timeAxis = this._component.getTimeAxis();
      var adjacencyDirection = direction === 'forward' ? 'next' : 'previous';
      var newStart = timeAxis
        .getAdjacentDate(this._keyboardDnDFeedbackTime['start'], navigationScale, adjacencyDirection)
        .getTime();
      var newEnd = timeAxis
        .getAdjacentDate(this._keyboardDnDFeedbackTime['end'], navigationScale, adjacencyDirection)
        .getTime();

      var currentPos,
        previousPos,
        scrollIntoViewXPriority = 'auto';
      switch (this._keyboardDnDMode) {
        case 'move':
          if (
            (direction === 'forward' && newStart <= timelineMaxTime) ||
            (direction === 'backward' && newEnd >= timelineMinTime)
          ) {
            previousPos = this._component.getDatePos(this._keyboardDnDFeedbackTime['start']);
            this._keyboardDnDFeedbackTime['start'] = newStart;
            this._keyboardDnDFeedbackTime['end'] = newEnd;
            currentPos = this._component.getDatePos(this._keyboardDnDFeedbackTime['start']);
          }
          break;
        case 'resizeStart':
          var sourceEndTime = this._keyboardDragObject.getEndTime();
          if (
            (direction === 'forward' && newStart <= sourceEndTime) ||
            (direction === 'backward' && newStart >= timelineMinTime)
          ) {
            previousPos = this._component.getDatePos(this._keyboardDnDFeedbackTime['start']);
            this._keyboardDnDFeedbackTime['start'] = newStart;
            currentPos = this._component.getDatePos(this._keyboardDnDFeedbackTime['start']);
          }
          scrollIntoViewXPriority = 'start';
          break;
        case 'resizeEnd':
          var sourceStartTime = this._keyboardDragObject.getStartTime();
          if (
            (direction === 'forward' && newEnd <= timelineMaxTime) ||
            (direction === 'backward' && newEnd >= sourceStartTime)
          ) {
            previousPos = this._component.getDatePos(this._keyboardDnDFeedbackTime['end']);
            this._keyboardDnDFeedbackTime['end'] = newEnd;
            currentPos = this._component.getDatePos(this._keyboardDnDFeedbackTime['end']);
          }
          scrollIntoViewXPriority = 'end';
          break;
      }
      if (currentPos != null) {
        var adjCurrentPos = isRTL ? length - currentPos : currentPos;
        var adjPreviousPos = isRTL ? length - previousPos : previousPos;
        var posDiff = adjCurrentPos - adjPreviousPos;
        this._keyboardDnDFeedbackLocalPos.x += posDiff;
        if (this._component.isDiscreteNavigationMode()) {
          if (this._component.getPosDate(currentPos) < this._component.getViewportStartTime()) {
            // perform a prev pan
            this.prevPage();
          } else if (this._component.getPosDate(currentPos) > this._component.getViewportEndTime()) {
            // perform a next pan
            this.nextPage();
          }
        } else {
          this._component.panBy(posDiff, 0);
        }
      }

      // Update and show feedback
      this._keyboardDragObject.showDragFeedback(
        event,
        this._keyboardDnDFeedbackLocalPos,
        this._keyboardDragObject,
        { x: 0, y: 0 },
        true,
        true
      );
      this._applyToSelection((selectionObj) => {
        if (selectionObj && selectionObj != this._keyboardDragObject) {
          selectionObj.showDragFeedback(
            event,
            this._keyboardDnDFeedbackLocalPos,
            this._keyboardDragObject,
            { x: 0, y: 0 },
            true,
            false
          );
        }
      });

      // Update the aria live region with text that the screenreader should read.
      this._component.updateLiveRegionText(
        dvt.AriaUtils.processAriaLabel(
          DvtTimelineTooltipUtils.getDatatip(this._keyboardDragObject, false)
        )
      );
    }

    /**
     * Handles high level DnD drag forward in time via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered drag forward
     */
    handleKeyboardDnDForward(event) {
      this._handleKeyboardDnDChronologically(event, 'forward');
    }

    /**
     * Handles high level DnD drag backward in time via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered drag backward
     */
    handleKeyboardDnDBackward(event) {
      this._handleKeyboardDnDChronologically(event, 'backward');
    }

    /**
     * Handles high level DnD scale change via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered move scale increase/decrease
     * @param {string} step The scale ramp index change
     * @private
     */
    _handleKeyboardDnDScaleChange(event, step) {
      this._isKeyboardDnDScaleChanged = true;
      this._keyboardDnDScaleRampIndex = Math.max(
        0,
        Math.min(this._keyboardDnDScaleRampIndex + step, this._HIGH_LEVEL_DND_NAV_SCALES.length - 1)
      );

      // Update and show feedback
      this._keyboardDragObject.showDragFeedback(
        event,
        this._keyboardDnDFeedbackLocalPos,
        this._keyboardDragObject,
        { x: 0, y: 0 },
        true,
        true
      );

      // Update the aria live region with text that the screenreader should read.
      // Tooltip should be showing the navigation scale at this point, so can just grab that text
      this._component.updateLiveRegionText(
        dvt.AriaUtils.processAriaLabel(
          DvtTimelineTooltipUtils.getDatatip(this._keyboardDragObject, false)
        )
      );
      this._isKeyboardDnDScaleChanged = false;
    }

    /**
     * Returns whether the DnD navigation scale just changed via keyboard.
     * @return {boolean} Whether the DnD navigation scale just changed via keyboard.
     */
    isKeyboardDnDScaleChanged() {
      return this._isKeyboardDnDScaleChanged;
    }

    /**
     * Returns the current keyboard DnD navigation scale.
     * @return {string} The current navigation scale.
     */
    getKeyboardDnDNavigationScale() {
      return this._HIGH_LEVEL_DND_NAV_SCALES[this._keyboardDnDScaleRampIndex];
    }

    /**
     * Handles high level DnD increase navigation scale via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered navigation scale increase
     */
    handleKeyboardDnDScaleUp(event) {
      this._handleKeyboardDnDScaleChange(event, 1);
    }

    /**
     * Handles high level DnD Move decrease navigation scale via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered navigation scale decrease
     */
    handleKeyboardDnDScaleDown(event) {
      this._handleKeyboardDnDScaleChange(event, -1);
    }

    /**
     * Handles high level DnD finalize via keyboard
     */
    handleKeyboardDnDFinalize() {
      // Viewport adjustments need to be done before handling move callback (rerender may happen after move callback)
      this._dropCleanup();

      var start, end, value, evt, ariaText;
      var translations = this._component.getOptions().translations;
      var selection = this._component.SelectionHandler.getSelection();
      var itemContexts = [this._keyboardDragObject.getDataContext()];
      if (this._keyboardDnDMode === 'move') {
        for (var i = 0; i < selection.length; i++) {
          var selectionObj = selection[i];
          if (selectionObj !== this._keyboardDragObject)
            itemContexts.push(selectionObj.getDataContext());
        }
        start = new Date(this._keyboardDnDFeedbackTime['start']).toISOString();
        end = new Date(this._keyboardDnDFeedbackTime['end']).toISOString();
        value = start;

        evt = dvt.EventFactory.newTimelineMoveEvent(itemContexts, value, start, end);
        ariaText = translations.itemMoveFinalized;
      } else if (this._keyboardDnDMode === 'resizeEnd' || this._keyboardDnDMode === 'resizeStart') {
        for (var i = 0; i < selection.length; i++) {
          var selectionObj = selection[i];
          itemContexts.push(selectionObj.getDataContext());
        }
        start = new Date(this._keyboardDnDFeedbackTime['start']).toISOString();
        end = new Date(this._keyboardDnDFeedbackTime['end']).toISOString();
        var type;
        if (this._keyboardDnDMode === 'resizeEnd') {
          value = end;
          type = 'end';
        } else if (this._keyboardDnDMode === 'resizeStart') {
          value = start;
          type = 'start';
        }
        evt = dvt.EventFactory.newTimelineResizeEvent(itemContexts, value, start, end, type);
        ariaText = translations.itemResizeFinalized;
      }

      if (evt) {
        this._component.dispatchEvent(evt);
        // Update the aria live region with text that the screenreader should read.
        this._component.updateLiveRegionText(ariaText);
      }
      this._keyboardDnDCleanup();
    }

    /**
     * Handles cancelling of DnD interaction via keyboard (e.g via Esc key during drag)
     */
    handleKeyboardDnDCancel() {
      var translations = this._component.getOptions().translations;
      if (this._keyboardDnDMode === 'move') {
        // Update the aria live region with text that the screenreader should read.
        this._component.updateLiveRegionText(translations.itemMoveCancelled);
      } else if (this._keyboardDnDMode === 'resizeEnd' || this._keyboardDnDMode === 'resizeStart') {
        this._component.updateLiveRegionText(translations.itemResizeCancelled);
      }
      if (this._keyboardDragObject) {
        this._hideMoveAffordance(this._keyboardDragObject);
        this._keyboardDragObject._dropCleanup();
        this._applyToSelection((selectionObj) => {
          if (selectionObj && selectionObj != this._keyboardDragObject) {
            this._hideMoveAffordance(selectionObj);
            selectionObj._dropCleanup();
          }
        });
      }
      this._dragCancelCleanup();
      this._keyboardDnDCleanup();
    }

    /**
     * Cleans up high level keyboard DnD (e.g. called when keyboard DnD cancelled or finalized)
     * @private
     */
    _keyboardDnDCleanup() {
      if (this._keyboardDnDMode != null) {
        //this._keyboardDragObject.dragEndCleanup();
        this._keyboardDnDMode = null;
        this._isDndDragging = false;
        this._keyboardDnDTargetObj = null;
        this._keyboardDnDFeedbackTime = null;
        this._keyboardDnDScaleRampIndex = null;
        this._keyboardDragObject = null;
        this._component.unregisterAndDestroyGlassPane();
      }
    }

    /**
     * Check if the mouse position is inside or past the start preview wing
     * @private
     */
    _isMouseInStartPreview() {
      var isRTL = dvt.Agent.isRightToLeft(this._component.getCtx());
      var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
      var stagePos = this._component
        .getCtx()
        .pageToStageCoords(this._lastKnownDragOverEvent.pageX, this._lastKnownDragOverEvent.pageY);
      var startViewportPos = isRTL ? this._component._backgroundWidth - navButtonBackgroundWidth : 0;
      return (
        stagePos.x > startViewportPos && stagePos.x < startViewportPos + navButtonBackgroundWidth
      );
    }

    /**
     * Check if the mouse position is inside or past the start preview wing
     * @private
     */
    _isMouseInEndPreview() {
      var isRTL = dvt.Agent.isRightToLeft(this._component.getCtx());
      var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
      var stagePos = this._component
        .getCtx()
        .pageToStageCoords(this._lastKnownDragOverEvent.pageX, this._lastKnownDragOverEvent.pageY);
      var endViewportPos = isRTL ? navButtonBackgroundWidth : this._component._backgroundWidth;
      return stagePos.x > endViewportPos - navButtonBackgroundWidth && stagePos.x < endViewportPos;
    }

    /**
     * Handle Panning behavior during dnd move/resize
     * @param {DvtTimelineSeriesNode} item position being checked
     * @private
     */
    _handleDndPan(item) {
      if (this._component.isDiscreteNavigationMode()) {
        this._handleDndDiscretePan(item);
      } else {
        // if dnd moving into start or end, perform a pan immediately
        if (this._isMouseInStartPreview() || this._isMouseInEndPreview()) {
          this._handleIntervalPan(item);

          // clear any waiting pans
          if (this._isDndPanWaiting != null) {
            clearTimeout(this._isDndPanWaiting);
            this._isDndPanWaiting = null;
          }
        }
      }
    }

    /**
     * Handle discrete Panning behavior during dnd move/resize
     * @param {DvtTimelineSeriesNode} item position being checked
     * @private
     */
    _handleDndDiscretePan(item) {
      if (this._component.startPanAllowed() && this._isMouseInStartPreview()) {
        // item is in preview wing
        if (this._isDndStartPanWaiting == null) {
          this._isDndStartPanWaiting = setTimeout(() => {
            this._handleStartPan(item);
          }, 2000);
        }
        // Clear end pan waiting
        clearTimeout(this._isDndEndPanWaiting);
        this._isDndEndPanWaiting = null;
      } else if (this._component.endPanAllowed() && this._isMouseInEndPreview()) {
        // item is in preview wing
        if (this._isDndEndPanWaiting == null) {
          this._isDndEndPanWaiting = setTimeout(() => {
            this._handleEndPan(item);
          }, 2000);
        }
        // Clear start pan waiting
        clearTimeout(this._isDndStartPanWaiting);
        this._isDndStartPanWaiting = null;
      } else {
        // clear any wait times
        clearTimeout(this._isDndEndPanWaiting);
        clearTimeout(this._isDndStartPanWaiting);

        this._isDndStartPanWaiting = null;
        this._isDndEndPanWaiting = null;
      }
    }

    /**
     * Handle start panning behavior during move/resize
     * @param {DvtTimelineSeriesNode} item position being checked
     * @private
     */
    _handleStartPan(item) {
      if (this._component.startPanAllowed() && this._isMouseInStartPreview() && this._isDndDragging) {
        // item is in preview wing
        // perform start viewport pan and reset timer
        this.prevPage();
        this._dragShowFeedback(item);
        this._isDndStartPanWaiting = setTimeout(() => {
          this._handleStartPan(item);
        }, 2000);
      } else {
        clearTimeout(this._isDndStartPanWaiting);
        this._isDndStartPanWaiting = null;
      }
    }

    /**
     * Handle end panning behavior during move/resize
     * @param {DvtTimelineSeriesNode} item position being checked
     * @private
     */
    _handleEndPan(item) {
      if (this._component.endPanAllowed() && this._isMouseInEndPreview() && this._isDndDragging) {
        // item is in preview wing
        // perform end viewport pan and reset timer
        this.nextPage();
        this._dragShowFeedback(item);
        this._isDndEndPanWaiting = setTimeout(() => {
          this._handleEndPan(item);
        }, 2000);
      } else {
        clearTimeout(this._isDndEndPanWaiting);
        this._isDndEndPanWaiting = null;
      }
    }

    /**
     * Handle interval panning behavior during move/resize (non discrete viewport mode)
     * @param {DvtTimelineSeriesNode} item position being checked
     * @private
     */
    _handleIntervalPan(item) {
      if (this._isDndDragging) {
        var adjacencyDirection = null;

        if (this._isMouseInEndPreview(item)) {
          var adjacencyDirection = 'next';
        } else if (this._isMouseInStartPreview(item)) {
          var adjacencyDirection = 'previous';
        }

        if (adjacencyDirection !== null) {
          var timeAxis = this._component.getTimeAxis();
          var navigationScale = this.getKeyboardDnDNavigationScale();
          navigationScale = navigationScale ? navigationScale : this._component._scale;
          var oldStart = item.getDragStartTime();
          var newStart = timeAxis
            .getAdjacentDate(oldStart, navigationScale, adjacencyDirection)
            .getTime();
          var panDiff = this._component.getDatePos(newStart) - this._component.getDatePos(oldStart);

          this._component.panBy(panDiff);
          this._dragShowFeedback(item);
          this._isDndPanWaiting = setTimeout(() => {
            this._handleIntervalPan(item);
          }, 250);

          return;
        }
      }

      clearTimeout(this._isDndPanWaiting);
      this._isDndPanWaiting = null;
    }
  }

  /**
   * Timeline JSON Parser
   * @class
   */
  class DvtTimelineParser {
    /**
     * Parses the specified data options and returns the root node of the timeline
     * @param {object} options The data options describing the component.
     * @return {object} An object containing the parsed properties
     */
    parse(options) {
      var ret = new Object();
      ret.start = new Date(options['start']).getTime();
      ret.end = new Date(options['end']).getTime();

      if (options['viewportStart']) ret.viewStart = new Date(options['viewportStart']).getTime();
      if (options['viewportEnd']) ret.viewEnd = new Date(options['viewportEnd']).getTime();
      if (options['selectionMode']) ret.selectionMode = options['selectionMode'];
      else ret.selectionMode = 'none';
      ret.inlineStyle = options['style'];
      if (options['svgStyle']) ret.inlineStyle = options['svgStyle'];

      var minorAxis = options['minorAxis'];
      if (minorAxis) {
        var scale = minorAxis['scale'];
        ret.scale = scale;
        ret.customFormatScales = minorAxis['_cfs'];
      }
      var majorAxis = options['majorAxis'];
      if (majorAxis) {
        ret.seriesScale = majorAxis['scale'];
        ret.seriesConverter = majorAxis['converter'];
        ret.seriesCustomFormatScales = majorAxis['_cfs'];
      }
      ret.shortDesc = options['shortDesc'];
      ret.orientation = options['orientation'];
      var referenceObjects = options['referenceObjects'];
      if (referenceObjects && referenceObjects.length >= 0) {
        var referenceObjectsValueArray = [];
        for (var i = 0; i < referenceObjects.length; i++) {
          referenceObjectsValueArray.push(new Date(referenceObjects[i]['value']));
        }
        ret.referenceObjects = referenceObjectsValueArray;
      }

      var overview = options['overview'];
      if (overview != null && overview['rendered'] === 'on') ret.hasOverview = true;
      else ret.hasOverview = false;

      ret.itemPosition = options['_ip'];
      ret.customTimeScales = options['_cts'];

      return ret;
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @extends {dvt.BaseComponentDefaults}
   */
  class DvtTimelineOverviewDefaults extends dvt.BaseComponentDefaults {
    constructor() {
      /**
       * Contains overrides for version 1.
       * @const
       */
      const VERSION_1 = {
        overviewPosition: 'below',
        style: {
          borderTopStyle: 'none',
          currentTimeIndicatorColor: '#c000d1',
          handleFillColor: '#ffffff',
          handleTextureColor: '#b3c6db',
          leftFilterPanelAlpha: 0.7,
          leftFilterPanelColor: '#ffffff',
          overviewBackgroundColor: '#e6ecf3',
          rightFilterPanelAlpha: 0.7,
          rightFilterPanelColor: '#ffffff',
          timeAxisBarColor: '#d9dfe3',
          timeAxisBarAlpha: 0,
          timeIndicatorColor: '#bcc7d2',
          windowBackgroundAlpha: 1,
          windowBackgroundColor: '#ffffff',
          windowBorderBottomColor: '#4f4f4f',
          windowBorderBottomStyle: 'solid',
          windowBorderLeftColor: '#4f4f4f',
          windowBorderLeftStyle: 'solid',
          windowBorderRightColor: '#4f4f4f',
          windowBorderRightStyle: 'solid',
          windowBorderTopColor: '#4f4f4f',
          windowBorderTopStyle: 'solid'
        },
        _fc: '#aadd77',
        _do: 0,
        _bc: '#648baf',
        _bof: '0px',
        _bs: 'solid',
        _bw: '1px',
        _dbc: '#648baf',
        _dbs: 'solid',
        _dbw: '1px',
        _hbc: '#85bbe7',
        _hbs: 'solid',
        _hbw: '2px',
        _hbof: '0px',
        _hgc: '#ebeced',
        _hgo: 1,
        _hdbs: 'solid',
        _hdbc: '#85bbe7',
        _hdbw: '2px',
        _sbs: 'solid',
        _sbc: '#000000',
        _sbw: '2px',
        _sbof: '0px',
        _sbo: 1,
        _sdbs: 'solid',
        _sdbc: '#000000',
        _sdbw: '2px',
        _asbs: 'solid',
        _asbc: '#000000',
        _asbw: '2px',
        _asbof: '0px',
        _asbo: 1,
        _asgc: '#e4f0fa',
        _asgo: 1,
        _asdbs: 'solid',
        _asdbc: '#000000',
        _asdbw: '2px',
        _aoc: 'off'
      };
      super({ alta: VERSION_1 });
    }
  }

  /**
   * Class representing a timelineOverview node.
   * @param {TimelineOverview} timelineOverview The owning timelineOverview component.
   * @param {object} props The properties for the node.
   * @class
   * @constructor
   */
  class DvtTimelineOverviewNode {
    constructor(overview, props) {
      this._view = overview;

      this._rowKey = props.rowKey;
      this._id = props.id;
      this._seriesId = props.seriesId;
      this._time = parseInt(props.time);
      this._endTime = props.endTime == null ? null : parseInt(props.endTime);

      this._shape = dvt.SimpleMarker.CIRCLE;
      if (props.shape === 'square') this._shape = dvt.SimpleMarker.RECTANGLE;
      else if (props.shape === 'plus') this._shape = dvt.SimpleMarker.PLUS;
      else if (props.shape === 'diamond') this._shape = dvt.SimpleMarker.DIAMOND;
      else if (props.shape === 'triangleUp') this._shape = dvt.SimpleMarker.TRIANGLE_UP;
      else if (props.shape === 'triangleDown') this._shape = dvt.SimpleMarker.TRIANGLE_DOWN;

      this._desc = props.desc;
      this._color = props.color;
      this._gradient = props.gradient;
      if (props.opacity != null) this._opacity = parseFloat(props.opacity);
      if (props.scaleX != null) this._scaleX = parseFloat(props.scaleX);
      if (props.scaleY != null) this._scaleY = parseFloat(props.scaleY);
      if (props.durationFillColor != null) this._durationFillColor = props.durationFillColor;
    }

    getId() {
      return this._id;
    }

    getSeriesId() {
      return this._seriesId;
    }

    getRowKey() {
      return this._rowKey;
    }

    getTime() {
      return this._time;
    }

    getEndTime() {
      return this._endTime;
    }

    getScaleX() {
      return this._scaleX;
    }

    getScaleY() {
      return this._scaleY;
    }

    getDescription() {
      return this._desc;
    }

    getColor() {
      return this._color;
    }

    isGradient() {
      return this._gradient;
    }

    getShape() {
      return this._shape;
    }

    getOpacity() {
      return this._opacity;
    }

    getDisplayable() {
      return this._displayable;
    }

    setDisplayable(displayable) {
      this._displayable = displayable;
    }

    getX() {
      return this._x;
    }

    setX(x) {
      this._x = x;
    }

    getY() {
      return this._y;
    }

    setY(y) {
      this._y = y;
    }
  }

  /**
   * Style related utility functions for TimelineOverview.
   * @class
   */
  const DvtTimelineOverviewStyleUtils = {
    /**
     * Gets the default marker shape.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The default marker shape.
     */
    getDefaultMarkerShape: (options) => {
      return options['_ds'];
    },

    /**
     * Gets the default marker scale X value.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The default marker scale X value.
     */
    getDefaultMarkerScaleX: (options) => {
      return options['_dsx'];
    },

    /**
     * Gets the default marker scale Y value.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The default marker scale Y value.
     */
    getDefaultMarkerScaleY: (options) => {
      return options['_dsy'];
    },

    /**
     * Gets the default marker opacity.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The default marker opacity.
     */
    getDefaultMarkerOpacity: (options) => {
      return options['_do'];
    },

    /**
     * Gets the default marker fill color.
     * @param {object} options The object containing data and specifications for the component.
     * @return {string} The default marker fill color.
     */
    getDefaultMarkerFillColor: (options) => {
      return options['_fc'];
    },

    /**
     * Gets the default marker pixel hinting value.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The default marker pixel hinting value.
     */
    getDefaultMarkerPixelHinting: (options) => {
      return options['_ph'];
    },

    /**
     * Gets the default marker border styles.
     * @param {object} options The object containing data and specifications for the component.
     * @return {object} The default marker border styles.
     */
    getDefaultMarkerBorderStyles: (options) => {
      var borderStyles = new Object();
      borderStyles['_bs'] = options['_bs'];
      borderStyles['_bc'] = options['_bc'];
      borderStyles['_bw'] = options['_bw'];
      borderStyles['_bof'] = options['_bof'];
      borderStyles['_bo'] = options['_bo'];
      borderStyles['_gc'] = options['_gc'];
      borderStyles['_go'] = options['_go'];
      borderStyles['_dbs'] = options['_dbs'];
      borderStyles['_dbc'] = options['_dbc'];
      borderStyles['_dbw'] = options['_dbw'];

      borderStyles['_hbs'] = options['_hbs'];
      borderStyles['_hbc'] = options['_hbc'];
      borderStyles['_hbw'] = options['_hbw'];
      borderStyles['_hbof'] = options['_hbof'];
      borderStyles['_hbo'] = options['_hbo'];
      borderStyles['_hgc'] = options['_hgc'];
      borderStyles['_hgo'] = options['_hgo'];
      borderStyles['_hdbs'] = options['_hdbs'];
      borderStyles['_hdbc'] = options['_hdbc'];
      borderStyles['_hdbw'] = options['_hdbw'];

      borderStyles['_sbs'] = options['_sbs'];
      borderStyles['_sbc'] = options['_sbc'];
      borderStyles['_sbw'] = options['_sbw'];
      borderStyles['_sbof'] = options['_sbof'];
      borderStyles['_sbo'] = options['_sbo'];
      borderStyles['_sgc'] = options['_sgc'];
      borderStyles['_sgo'] = options['_sgo'];
      borderStyles['_sdbs'] = options['_sdbs'];
      borderStyles['_sdbc'] = options['_sdbc'];
      borderStyles['_sdbw'] = options['_sdbw'];

      borderStyles['_asbs'] = options['_asbs'];
      borderStyles['_asbc'] = options['_asbc'];
      borderStyles['_asbw'] = options['_asbw'];
      borderStyles['_asbof'] = options['_asbof'];
      borderStyles['_asbo'] = options['_asbo'];
      borderStyles['_asgc'] = options['_asgc'];
      borderStyles['_asgo'] = options['_asgo'];
      borderStyles['_asdbs'] = options['_asdbs'];
      borderStyles['_asdbc'] = options['_asdbc'];
      borderStyles['_asdbw'] = options['_asdbw'];

      return borderStyles;
    }
  };

  /**
   * TimelineOverview Parser
   * @param {TimelineOverview} timelineOverview The owning timelineOverview component.
   * @class
   * @constructor
   * @extends {OverviewParser}
   */
  class DvtTimelineOverviewParser extends ojdvtOverview.OverviewParser {
    /**
     * Parses the specified options object and returns the root node of the timelineOverview
     * @param {object} options The options object describing the component.
     * @return {object} An object containing the parsed properties
     */
    parse(options) {
      var ret = this.ParseRootAttributes(options);
      ret.timeAxisInfo = this._parseTimeAxis(options['axisTicks']);
      ret.markers = this._parseDataNode(options['markers'], ret.defaultMarkerStyles);
      ret.formattedTimeRanges = options['formattedTimeRanges'];

      return ret;
    }

    /**
     * Parses the attributes on the root node.
     * @param {object} options The options defining the root
     * @return {object} An object containing the parsed properties
     * @protected
     */
    ParseRootAttributes(options) {
      // The object that will be populated with parsed values and returned
      var ret = super.ParseRootAttributes(options);

      ret.orientation = options['orn'];
      ret.selectionMode = options['selmode'];
      ret.isRtl = options['rtl'].toString();

      ret.seriesIds = options['sid'];
      ret.animationOnClick = options['_aoc'];
      ret.referenceObjects = options['referenceObjects'];

      var defaultMarkerStyles = new Object();
      defaultMarkerStyles.shape = DvtTimelineOverviewStyleUtils.getDefaultMarkerShape(options);
      defaultMarkerStyles.scaleX = DvtTimelineOverviewStyleUtils.getDefaultMarkerScaleX(options);
      defaultMarkerStyles.scaleY = DvtTimelineOverviewStyleUtils.getDefaultMarkerScaleY(options);
      defaultMarkerStyles.opacity = DvtTimelineOverviewStyleUtils.getDefaultMarkerOpacity(options);
      defaultMarkerStyles.color = DvtTimelineOverviewStyleUtils.getDefaultMarkerFillColor(options);
      defaultMarkerStyles.pixelHinting =
        DvtTimelineOverviewStyleUtils.getDefaultMarkerPixelHinting(options);
      ret.defaultMarkerStyles = defaultMarkerStyles;

      ret.labelStyle = options['_ls'];

      return ret;
    }

    /**
     * Recursively parses the data options, creating tree component nodes.
     * @param {object} markers The markers array to parse.
     * @return {DvtBaseTreeNode} The resulting tree component node.
     * @private
     */
    _parseDataNode(markers, defaultMarkerStyles) {
      if (markers) {
        var treeNodes = [];

        for (var i = 0; i < markers.length; i++) {
          // Parse the attributes and create the node
          var props = this.ParseNodeAttributes(markers[i], defaultMarkerStyles);
          var treeNode = new DvtTimelineOverviewNode(this._view, props);

          treeNodes.push(treeNode);
        }

        return treeNodes;
      } else return null;
    }

    /**
     * Parses the attributes on a tree node.
     * @param {object} options The options defining the tree node
     * @return {object} An object containing the parsed properties
     * @protected
     */
    ParseNodeAttributes(options, defaultMarkerStyles) {
      // The object that will be populated with parsed values and returned
      var ret = new Object();

      var useSkinningDefaults = options['_sd'] === 'true';

      // Parse this node's properties
      ret.id = options['tid'];
      ret.seriesId = options['sid'];
      ret.rowKey = options['rk'];
      ret.time = options['t'];
      ret.endTime = options['et'];
      ret.shape = options['s'];
      if (useSkinningDefaults && ret.shape == null) ret.shape = defaultMarkerStyles.shape;
      ret.desc = options['d'];
      ret.color = options['c'];
      ret.durationFillColor = options['dfc'];
      if (useSkinningDefaults && ret.color == null) ret.color = defaultMarkerStyles.color;
      ret.scaleX = options['sx'];
      if (useSkinningDefaults && ret.scaleX == null) ret.scaleX = defaultMarkerStyles.scaleX;
      ret.scaleY = options['sy'];
      if (useSkinningDefaults && ret.scaleY == null) ret.scaleY = defaultMarkerStyles.scaleY;
      ret.gradient = options['g'];
      ret.opacity = options['o'];
      if (useSkinningDefaults && ret.opacity == null) ret.opacity = defaultMarkerStyles.opacity;

      return ret;
    }

    _parseTimeAxis(options) {
      if (options) {
        var ret = new Object();
        ret.width = null;
        ret.height = null;
        ret.ticks = options;

        return ret;
      } else return null;
    }
  }

  /**
   * TimelineOverview component.
   * @param {dvt.Context} context The rendering context.
   * @param {object} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @class TimelineOverview component.
   * @constructor
   * @extends {Overview}
   */
  class TimelineOverview extends ojdvtOverview.Overview {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      // default fills
      var colors = [
        dvt.ColorUtils.getPound(dvt.ColorUtils.getBrighter('#aadd77', 0.35)),
        '#aadd77',
        dvt.ColorUtils.getPound(dvt.ColorUtils.getDarker('#aadd77', 0.5))
      ];
      // get pastel doesn't work too well on ipad
      if (ojdvtOverview.OverviewUtils.supportsTouch()) colors = ['#aadd77'];

      // fill in duration Colors here to pull from style ramp
      // if applicable (used by timeline)
      if (callbackObj != null) {
        this._durationColors = callbackObj.getOptions()['styleDefaults'].series.colors;
      }

      this._defColors = colors;
      this._markerBorderFill = dvt.SolidFill.invisibleFill();

      // default marker size
      this._markerSize = 12;

      // state
      this.ENABLED_STATE = '_';
      this.HOVER_STATE = '_h';
      this.SELECTED_STATE = '_s';
      this.ACTIVE_SELECTED_STATE = '_as';

      // property
      this.BORDER_STYLE = 'bs';
      this.BORDER_COLOR = 'bc';
      this.BORDER_WIDTH = 'bw';
      this.DURATION_BORDER_COLOR = 'dbc';
      this.DURATION_BORDER_WIDTH = 'dbw';
      this.BORDER_OFFSET = 'bof';
      this.BORDER_OPACITY = 'bo';
      this.GLOW_COLOR = 'gc';
      this.GLOW_OPACITY = 'go';
    }

    /**
     * @override
     */
    initDefaults() {
      this.Defaults = new DvtTimelineOverviewDefaults();
    }

    /**
     * @protected
     * @override
     */
    getParser() {
      return new DvtTimelineOverviewParser(this);
    }

    /**
     * Applies the parsed properties to this component.
     * @param {object} props An object containing the parsed properties for this component.
     * @protected
     * @override
     */
    _applyParsedProperties(props) {
      super._applyParsedProperties(props);

      this._selectionMode = props.selectionMode;
      this._markers = props.markers;
      this._seriesIds = props.seriesIds;

      this._defaultMarkerStyles = props.defaultMarkerStyles;
      this._borderStyles = DvtTimelineOverviewStyleUtils.getDefaultMarkerBorderStyles(this.Options);

      if (props.labelStyle) this._labelStyle = new dvt.CSSStyle(props.labelStyle);

      // calculate marker spacing offset value
      var minMarkerSpacing = 1;
      var markerSpacingError = 1;

      if (this.getStyle(this.ENABLED_STATE, this.BORDER_STYLE) === 'solid')
        var _eOffset = parseInt(this.getStyle(this.ENABLED_STATE, this.BORDER_OFFSET), 10);
      else _eOffset = minMarkerSpacing;
      if (this.getStyle(this.ACTIVE_SELECTED_STATE, this.BORDER_STYLE) === 'solid')
        var _asOffset = parseInt(this.getStyle(this.ACTIVE_SELECTED_STATE, this.BORDER_OFFSET), 10);
      else _asOffset = minMarkerSpacing;
      if (this.getStyle(this.SELECTED_STATE, this.BORDER_STYLE) === 'solid')
        var _sOffset = parseInt(this.getStyle(this.SELECTED_STATE, this.BORDER_OFFSET), 10);
      else _sOffset = minMarkerSpacing;

      if (this.isItemSelectionEnabled())
        this._markerSpacingOffset =
          Math.max(_asOffset, _sOffset, _eOffset, minMarkerSpacing) / 2 + markerSpacingError;
      else this._markerSpacingOffset = minMarkerSpacing;

      // some of the defaults depends on orientation
      this._defOpacity = this.isVertical() ? 0 : 0.75;
      this._defAlphas = [this._defOpacity, this._defOpacity, this._defOpacity];
      this._radialFill = new dvt.LinearGradientFill(250, this._defColors, this._defAlphas);
      this._linearFill = new dvt.LinearGradientFill(180, this._defColors, this._defAlphas);
      var borderOpacity = this.isVertical() ? 0 : 1;
      this._border = new dvt.Stroke('#aadd77', borderOpacity);
    }

    /**
     * Retrieves the id of the timeline series associated with the timeline
     * @return {Array} an array of timeline series id
     */
    getSeriesIds() {
      if (this._seriesIds == null) return null;

      return this._seriesIds.split(' ');
    }

    /***************************** common helper methods *********************************************/
    isItemSelectionEnabled() {
      return this._selectionMode !== 'none';
    }

    getDrawableById(id) {
      var numChildren = this.getNumChildren();
      for (var childIndex = 0; childIndex < numChildren; childIndex++) {
        var drawable = this.getChildAt(childIndex);
        if (
          drawable &&
          drawable._node &&
          dvt.Obj.compareValues(this.getCtx(), id, drawable._node.getId())
        )
          return drawable;
      }
      return null;
    }

    getItemId(drawable) {
      if (drawable._node) return drawable._node.getId();
      else return drawable.getId().substr(5);
    }

    getStyle(state, style) {
      return this._borderStyles[state + style];
    }

    getX(drawable) {
      if (drawable._node != null) return drawable._node.getX();
      else return drawable.getMatrix().getTx();
    }

    getY(drawable) {
      if (drawable._node != null) return drawable._node.getY();
      else return drawable.getMatrix().getTy();
    }

    getScaleX(node) {
      var scaleX = node.getScaleX();
      if (scaleX == null) {
        // for vertical the scale factor is calculated by the available space take away border/padding, then divided that by the width of marker
        scaleX = this.isVertical() ? (this.Width - this.getTimeAxisWidth() - 4) / 2 : 1;
      }
      return scaleX;
    }

    getScaleY(node) {
      var scaleY = node.getScaleY();
      if (scaleY == null) scaleY = 1;

      return scaleY;
    }
    /***************************** end common helper methods *********************************************/

    /***************************** marker creation and event handling *********************************************/

    renderData(width, height) {
      super.renderData(width, height);

      if (this._markers == null) return;

      if (this.isVertical()) {
        var start = this._yMin;
        var end = this._yMax;
      } else {
        start = this._xMin;
        end = this._xMax;
      }

      // find the optimal size of the marker
      var opt = this.calculateOptimalSize(start, end, width, height, this._markerSize);
      var durationMarkers = [];
      for (var j = 0; j < this._markers.length; j++) {
        var marker = this._markers[j];
        if (marker._endTime == null) this.addMarker(marker, opt);
        else durationMarkers[durationMarkers.length] = marker;
      }
      this.prepareDurations(durationMarkers);
      this.addDurations(durationMarkers, start, end);

      this._markerSize = opt;
    }

    prepareDurations(durationMarkers) {
      this._maxDurationY = 0;
      var markerSeries = null;
      if (this._durationColorMap == null) this._durationColorMap = new Object();

      for (var i = 0; i < durationMarkers.length; i++) {
        var marker = durationMarkers[i];
        var id = marker.getId();
        var sId = marker.getSeriesId();
        if (sId !== markerSeries) {
          this._colorCount = 0;
          markerSeries = sId;
        }
        marker._durationLevel = this.calculateDurationY(marker, durationMarkers);
        if (marker._durationFillColor == null) {
          if (this._durationColorMap[id] == null) {
            this._durationColorMap[id] = this._colorCount;
            marker._durationFillColor = this._durationColors[this._colorCount];
            this._colorCount++;
            if (this._colorCount === this._durationColors.length) this._colorCount = 0;
          } else marker._durationFillColor = this._durationColors[this._durationColorMap[id]];
        }
      }
    }

    /**
     * Gets the current color mapping of duration bars.
     * @return {Array} the current color mapping of duration bars.
     */
    getDurationColorMap() {
      if (this._durationColorMap) return this._durationColorMap;
      else return null;
    }

    calculateOptimalSize(start, end, width, height, size) {
      var result = new Object();
      result.max = 1;
      result.arr = [];

      var canvasSize = this.isVertical() ? height : width;
      for (var i = 0; i < this._markers.length; i++) {
        var marker = this._markers[i];
        if (marker._endTime != null) {
          var x = ojdvtOverview.OverviewUtils.getDatePosition(start, end, marker.getTime(), canvasSize);
          if (this.isHorizontalRTL()) x = canvasSize - x;
          marker.setX(x);
        } else {
          this.calculateSize(marker, start, end, canvasSize, size / 2, result, height);
          // if max > height, then we'll need to reduce the size of marker and recalculate, so just bail out
          if (result.max > height) break;
        }
      }

      // minimum size is 1 (also to prevent infinite recursion)
      if (result.max > height && size > 1) {
        // adjusted the size and try again.  This could potentially be optimized if
        // the scaleX and scaleY of each marker are identical, then we could calculate
        // the size by determining the size of the stack and use that to calculate the
        // size
        return this.calculateOptimalSize(start, end, width, height, size - 1);
      } else return size;
    }

    addMarker(node, sz) {
      var itemId = '_mrk_' + node.getId();
      var color = node.getColor();
      var isGradient = node.isGradient();
      var opacity = node.getOpacity();
      var fill, stroke;
      if (opacity == null) {
        opacity = this._defOpacity;
        // if default opacity is zero but a custom color is specified, override the opacity to 1
        if (opacity === 0 && color != null) opacity = 1;
      }
      var scaleX = this.getScaleX(node);
      var scaleY = this.getScaleY(node);

      // draw the shapes
      var marker = node.getShape();

      if (this.isVertical()) {
        marker = dvt.SimpleMarker.RECTANGLE;
        var width = 2 * scaleX;
        var height = 2 * scaleY;
        var cx = node.getY() + width / 2;
        var cy = node.getX() + height / 2;
      } else {
        width = sz * scaleX;
        height = sz * scaleY;
        cx = node.getX() + width / 2;
        cy = node.getY() + height / 2;
      }
      var displayable = new dvt.SimpleMarker(
        this.getCtx(),
        marker,
        cx,
        cy,
        width,
        height,
        null,
        null,
        null,
        itemId
      );

      // associate the node with the marker
      displayable._node = node;

      if (color == null && opacity === this._defOpacity && isGradient == null) {
        // use default fills
        if (marker === dvt.SimpleMarker.CIRCLE) fill = this._radialFill;
        else fill = this._linearFill;

        stroke = this._border;
      } else {
        var colors = this._defColors;
        if (color != null) {
          if (ojdvtOverview.OverviewUtils.supportsTouch()) colors = [color];
          else {
            var lighter = dvt.ColorUtils.getBrighter(color, 0.5);
            var darker = dvt.ColorUtils.getDarker(color, 0.5);
            colors = [lighter, color, darker];
          }
        }

        var alphas = [opacity, opacity, opacity];

        if (isGradient == null) {
          if (marker === dvt.SimpleMarker.CIRCLE)
            fill = new dvt.LinearGradientFill(250, colors, alphas);
          else fill = new dvt.LinearGradientFill(180, colors, alphas);
        } else fill = new dvt.SolidFill(color, alphas[0]);

        stroke = new dvt.Stroke(color, opacity);
      }

      displayable.setFill(fill);
      displayable.setStroke(stroke);
      if (this.isItemSelectionEnabled()) displayable.setSelectable(true);

      var count = this.getNumChildren();
      var lastChild = this.getChildAt(count - 1);
      if (count > this._lastChildIndex && (lastChild.getId() === 'tb' || lastChild.getId() === 'arr'))
        this.addChildAt(displayable, count - this._lastChildIndex);
      // insert right before the left handle
      else this.addChild(displayable);

      // associate the displayable with the node
      node.setDisplayable(displayable);
      this.applyState(displayable, this.ENABLED_STATE);

      // Do not antialias markers if specified or vertical
      if (
        (this.isVertical() ||
          marker === dvt.SimpleMarker.RECTANGLE ||
          marker === dvt.SimpleMarker.DIAMOND ||
          marker === dvt.SimpleMarker.TRIANGLE_UP ||
          marker === dvt.SimpleMarker.TRIANGLE_DOWN ||
          marker === dvt.SimpleMarker.PLUS) &&
        this._defaultMarkerStyles.pixelHinting !== 'false'
      ) {
        displayable.setPixelHinting(true);
      }

      return displayable;
    }

    addDurations(durationMarkers, start, end) {
      var context = this.getCtx();
      for (var i = this._maxDurationY; i > 0; i--) {
        for (var j = 0; j < durationMarkers.length; j++) {
          var node = durationMarkers[j];
          if (i === node._durationLevel) {
            var x = ojdvtOverview.OverviewUtils.getDatePosition(
              start,
              end,
              node.getTime(),
              this.isVertical() ? this.Height : this.Width
            );
            var durationId = '_drn_' + node.getId();
            var durationY = 9 + 5 * node._durationLevel;
            var x2 = ojdvtOverview.OverviewUtils.getDatePosition(
              start,
              end,
              node.getEndTime(),
              this.isVertical() ? this.Height : this.Width
            );
            if (this.isVertical()) {
              if (this.isRTL())
                var duration = new dvt.Rect(context, 0, x, durationY, x2 - x, durationId);
              else
                duration = new dvt.Rect(
                  context,
                  this.Width - durationY,
                  x,
                  durationY,
                  x2 - x,
                  durationId
                );
            } else {
              if (this.isRTL())
                duration = new dvt.Rect(
                  context,
                  this.Width - x2,
                  this.Height - durationY - 20,
                  x2 - x,
                  durationY,
                  durationId
                );
              else
                duration = new dvt.Rect(
                  context,
                  x,
                  this.Height - durationY - 20,
                  x2 - x,
                  durationY,
                  durationId
                );
            }
            duration.setFill(new dvt.SolidFill(node._durationFillColor));

            var feelerStroke = new dvt.Stroke(
              this.getStyle(this.ENABLED_STATE, this.DURATION_BORDER_COLOR),
              1,
              1
            );
            duration.setStroke(feelerStroke);
            duration.setPixelHinting(true);

            duration._node = node;
            this.addChild(duration);

            node._durationBar = duration;
            node._durationY = durationY - 2;
          }
        }
      }
      // timeAxisTopBar needs to be rendered after the duration markers to cover the bottom border
      this.removeChild(this._timeAxisTopBar);
      this.addChild(this._timeAxisTopBar);
    }

    calculateSize(node, start, end, size, hsz, result, maxHeight) {
      var hszx = hsz * this.getScaleX(node) + this._markerSpacingOffset;
      var hszy = hsz * this.getScaleY(node) + this._markerSpacingOffset;

      var time = node.getTime();
      var cx = ojdvtOverview.OverviewUtils.getDatePosition(start, end, time, size);
      if (this.isHorizontalRTL()) cx = size - cx - hszx * 2;

      // we only need to calculate y for the non-vertical case
      if (!this.isVertical()) {
        var cy = 3;
        if (this.isOverviewAbove()) cy = cy + this.getTimeAxisHeight();

        var maxy = 0;
        var overlappingMarkers = [];
        for (var i = 0; i < result.arr.length; i++) {
          var prevMarker = result.arr[i];
          var prevX = prevMarker.getX();
          var prevScaleX = this.getScaleX(prevMarker);

          // see if x intersects
          var xDist = Math.abs(cx - prevX);
          var minDist = hsz * prevScaleX + this._markerSpacingOffset + hszx;

          // if x does intersect, add it to the set of overlapping markers
          if (xDist < minDist) overlappingMarkers.push(prevMarker);
        }
        for (i = 0; i < overlappingMarkers.length; i++) {
          var obj = this.calculateY(
            overlappingMarkers,
            node.getShape(),
            cx,
            cy,
            hszx,
            hszy,
            maxy,
            hsz,
            maxHeight
          );
          maxy = obj['maxy'];
          if (obj['cy'] === cy) {
            // cy is the same, so we are done with this marker
            cy = obj['cy'];
            break;
          } else {
            // cy changed, we have to go over the array again with the new value
            // to see if there's new collision
            cy = obj['cy'];
          }
        }
      } else {
        // for vertical timeline, marker is 4 px from the right edge of the overview
        var borderOffset = 0;
        var borderStyle = this.getStyle(this.ENABLED_STATE, this.BORDER_STYLE);
        if (borderStyle === 'solid')
          borderOffset = parseInt(this.getStyle(this.ENABLED_STATE, this.BORDER_WIDTH), 10);
        if (this.isRTL()) cy = borderOffset + 4;
        else cy = this.Width - this.getScaleX(node) * 2 - borderOffset - 4;
      }

      node.setX(cx);
      node.setY(cy);
      result.arr.push(node);

      if (maxy != null && maxy > result.max) result.max = maxy;
    }

    // overlappingMarkers - set of previous markers that may overlap
    // cx - x coord of the marker to be add
    // cy - y coord of the marker to be add
    // hszx - scale adjusted width of marker
    // hszy - scale adjusted height of marker
    // maxy - maximum y of all markers
    calculateY(overlappingMarkers, shape, cx, cy, hszx, hszy, maxy, hsz, maxHeight) {
      // see if y intersects
      for (var i = 0; i < overlappingMarkers.length; i++) {
        var prevMarker = overlappingMarkers[i];
        var prevX = prevMarker.getX();
        var prevY = prevMarker.getY();

        var prevShape = prevMarker.getShape();
        var prevScaleX = this.getScaleX(prevMarker);
        var prevScaleY = this.getScaleY(prevMarker);

        // if the markers are both circles with consistent scaleX and scaleY values, use optimized spacing below
        if (
          shape === dvt.SimpleMarker.CIRCLE &&
          prevShape === dvt.SimpleMarker.CIRCLE &&
          hszx === hszy &&
          prevScaleX === prevScaleY
        ) {
          var xDist = Math.abs(cx - prevX);
          var minDist = hsz * prevScaleX + this._markerSpacingOffset + hszx;
          var height = Math.sqrt(minDist * minDist - xDist * xDist);
        } else height = hsz * prevScaleY + this._markerSpacingOffset + hszy;

        // if required height is greater than current value, update height
        if (height > Math.abs(cy - prevY)) {
          cy = prevY + height;
          maxy = Math.max(maxy, cy + height);

          // if maxy > maxHeight and not minimal size, then we'll need to reduce the size of marker and recalculate, so bail out
          if (hsz >= 1 && maxHeight !== undefined && maxy > maxHeight) break;
        }
      }

      return { cy, maxy };
    }

    calculateDurationY(item, durationMarkers) {
      var index = durationMarkers.length;
      var initialY = 1;

      var startTime = item.getTime();
      var y = item._durationLevel;
      if (y == null) y = initialY;

      for (var i = 0; i < index; i++) {
        var currItem = durationMarkers[i];
        if (currItem !== item) {
          var currEndTime = currItem.getEndTime();
          if (currEndTime != null) {
            var currStartTime = currItem.getTime();

            var curry = currItem._durationLevel;
            if (curry == null) curry = initialY;

            if (startTime >= currStartTime && startTime <= currEndTime && y === curry) {
              y = curry + 1;
              // y changed, do the loop again
              item._durationLevel = y;

              // calculate again from start since y changed and we might have a conflict again
              y = this.calculateDurationY(item, durationMarkers);
            }
          }
        }
      }
      if (y > this._maxDurationY) this._maxDurationY = y;
      return y;
    }

    /************************** event handling *********************************************/
    HandleShapeMouseOver(event) {
      // drawable will be null if it is handled by super
      var drawable = super.HandleShapeMouseOver(event);
      if (drawable == null) return;

      if (drawable._node != null) {
        var tooltip = drawable._node.getDescription();
        if (tooltip != null) {
          // Show the tooltip
          this.getCtx().getTooltipManager().showDatatip(event.pageX, event.pageY, tooltip, '#000000');
        }
      }

      // if selection is disabled in Timeline then return
      if (!this.isItemSelectionEnabled()) return;

      var isSelected = false;

      // only remove stroke if it is not selected
      if (this._selectedMarkers != null) {
        for (var i = 0; i < this._selectedMarkers.length; i++) {
          // found it
          if (drawable === this._selectedMarkers[i]) {
            isSelected = true;
            break;
          }
        }
      }

      // highlight the item also, make sure it's not selected
      if (!isSelected) {
        var itemId = this.getItemId(drawable);

        var evt = dvt.EventFactory.newTimelineOverviewEvent('highlight', itemId);
        // highlight the item in timeline series
        this.dispatchEvent(evt);

        // highlight the marker
        this.highlightMarker(drawable);
      }
    }

    HandleShapeMouseOut(event) {
      // drawable will be null if it is handled by super
      var drawable = super.HandleShapeMouseOut(event);
      if (drawable == null) return;

      if (!this.isMovable(drawable)) {
        // hide the tooltip
        this.getCtx().getTooltipManager().hideTooltip();

        var isSelected = false;

        // only remove stroke if it is not selected
        if (this._selectedMarkers != null) {
          for (var i = 0; i < this._selectedMarkers.length; i++) {
            // found it
            if (drawable === this._selectedMarkers[i]) {
              isSelected = true;
              break;
            }
          }
        }

        if (!isSelected) {
          // unhighlight item also
          var itemId = this.getItemId(drawable);

          var evt = dvt.EventFactory.newTimelineOverviewEvent('unhighlight', itemId);

          // highlight the item in timeline series
          this.dispatchEvent(evt);

          // highlight the marker
          this.unhighlightMarker(drawable);
        }
      }
    }

    HandleShapeClick(event, pageX, pageY) {
      // drawable will be null if it is handled by super
      var drawable = super.HandleShapeClick(event, pageX, pageY);
      if (drawable == null) return;

      // handle click on marker
      this.HandleMarkerClick(drawable, event.ctrlKey || event.shiftKey || dvt.Agent.isTouchDevice());
    }

    HandleMarkerClick(drawable, isMultiSelect) {
      // if selection is disabled in Timeline then return
      if (!this.isItemSelectionEnabled()) return;

      // selects the corresponding item
      this.selectItem(drawable, isMultiSelect);

      var time = drawable._node.getTime();
      if (time != null) {
        // scroll overview
        var slidingWindow = this.getSlidingWindow();
        var newPos;

        if (this.isVertical()) {
          newPos = this.getX(drawable) - slidingWindow.getHeight() / 2;
          this.animateSlidingWindow(null, newPos);
        } else {
          newPos = this.getX(drawable) - slidingWindow.getWidth() / 2;
          this.animateSlidingWindow(newPos);
        }
      }
    }
    /************************** end event handling *********************************************/

    /************************** marker highlight *********************************************/
    highlightItem(itemId) {
      var drawable = this.getDrawableById(itemId);
      if (drawable != null) this.highlightMarker(drawable);
    }

    unhighlightItem(itemId) {
      var drawable = this.getDrawableById(itemId);
      if (drawable != null) this.unhighlightMarker(drawable);
    }

    highlightMarker(drawable) {
      if (this._selectedMarkers != null) {
        for (var i = 0; i < this._selectedMarkers.length; i++) {
          var marker = this._selectedMarkers[i];
          if (drawable === marker) {
            // selected, do nothing
            return;
          }
        }
      }
      // draw border
      this.applyState(drawable, this.HOVER_STATE);
    }

    unhighlightMarker(drawable) {
      if (this._selectedMarkers != null) {
        for (var i = 0; i < this._selectedMarkers.length; i++) {
          var marker = this._selectedMarkers[i];
          if (drawable === marker) {
            // selected, do nothing
            return;
          }
        }
      }
      this.applyState(drawable, this.ENABLED_STATE);
    }
    /************************** end marker highlight *****************************************/

    /************************** marker selection *********************************************/
    selSelectItem(itemId) {
      var drawable = this.getDrawableById(itemId);
      if (drawable != null) this.addSelectedMarker(drawable);
    }

    selUnselectItem(itemId) {
      var drawable = this.getDrawableById(itemId);
      if (drawable != null) this.removeSelectedMarker(drawable);
    }

    selectItem(drawable, isMultiSelect) {
      var itemId = this.getItemId(drawable);

      // scroll timeline
      var evt = dvt.EventFactory.newTimelineOverviewEvent('selection', itemId, isMultiSelect);
      this.dispatchEvent(evt);
    }

    addSelectedMarker(drawable) {
      if (this._selectedMarkers == null) this._selectedMarkers = [];

      var lastSelectedMarker = null;
      if (this._selectedMarkers.length > 0)
        lastSelectedMarker = this._selectedMarkers[this._selectedMarkers.length - 1];

      this._selectedMarkers.push(drawable);

      if (lastSelectedMarker != null) this.applyState(lastSelectedMarker, this.SELECTED_STATE);

      this.applyState(drawable, this.ACTIVE_SELECTED_STATE);
    }

    removeSelectedMarker(drawable) {
      if (this._selectedMarkers != null) {
        var index = -1;
        for (var i = 0; i < this._selectedMarkers.length; i++) {
          var marker = this._selectedMarkers[i];
          if (drawable === marker) {
            index = i;
            break;
          }
        }

        if (index != -1) {
          // remove effect from drawable
          this.applyState(drawable, this.ENABLED_STATE);

          // fix the array
          this._selectedMarkers.splice(index, 1);
        }
      }
    }

    removeAllSelectedMarkers() {
      if (this._selectedMarkers != null) {
        for (var i = 0; i < this._selectedMarkers.length; i++) {
          var drawable = this._selectedMarkers[i];
          this.applyState(drawable, this.ENABLED_STATE);
        }

        delete this._selectedMarkers;
        this._selectedMarkers = null;
      }
    }

    applyState(drawable, state) {
      if (!(drawable instanceof dvt.SimpleMarker)) {
        var id = drawable.getId();
        if (id && id.substring(0, 5) === '_drn_') this.applyDurationState(drawable, state);
        return;
      }

      var requiresBorderMarker = false;
      var requiresGlowMarker = false;

      var borderStyle = this.getStyle(state, this.BORDER_STYLE);
      if (borderStyle === 'solid') {
        requiresBorderMarker = true;
        var borderColor = this.getStyle(state, this.BORDER_COLOR);
        if (borderColor == null) borderColor = '#000000';
        var glowColor = this.getStyle(state, this.GLOW_COLOR);
        if (glowColor != null && glowColor !== 'none') requiresGlowMarker = true;
      }

      var borderMarker = drawable._borderMarker;
      var glowMarker = drawable._glowMarker;

      // Remove current border marker if necessary
      if (!requiresBorderMarker && borderMarker != null) {
        this.removeChild(borderMarker);
        drawable._borderMarker = null;
        if (glowMarker != null) {
          this.removeChild(glowMarker);
          drawable._glowMarker = null;
        }
      } else if (!requiresGlowMarker && glowMarker != null) {
        this.removeChild(glowMarker);
        drawable._glowMarker = null;
      }

      var markerType = drawable.getType();

      // Create or update border marker
      if (requiresBorderMarker) {
        var borderWidth = parseInt(this.getStyle(state, this.BORDER_WIDTH), 10);
        var borderOffset = parseInt(this.getStyle(state, this.BORDER_OFFSET), 10);

        if (borderMarker == null) {
          if (markerType === dvt.SimpleMarker.CIRCLE) {
            var width = (drawable.getDimensions().w + borderOffset * 2) * drawable.getScaleX();
            var height = (drawable.getDimensions().h + borderOffset * 2) * drawable.getScaleY();
            var cx = this.getX(drawable) - borderOffset + width / 2;
            var cy = this.getY(drawable) - borderOffset + height / 2;
          } else {
            if (this.isVertical()) {
              width = (drawable.getDimensions().w + (borderWidth + 1)) * drawable.getScaleX();
              height = (drawable.getDimensions().h + (borderWidth + 1)) * drawable.getScaleY();
              cx = this.getY(drawable) - (borderWidth + 1) / 2 + width / 2;
              cy = this.getX(drawable) - (borderWidth + 1) / 2 + height / 2;
            } else {
              width = (drawable.getDimensions().w + borderOffset * 2) * drawable.getScaleX();
              height = (drawable.getDimensions().h + borderOffset * 2) * drawable.getScaleY();
              cx = this.getX(drawable) - borderOffset + width / 2;
              cy = this.getY(drawable) - borderOffset + height / 2;
            }
          }
          borderMarker = new dvt.SimpleMarker(
            this.getCtx(),
            markerType,
            cx,
            cy,
            width,
            height,
            null,
            null,
            null,
            drawable.getId() + '_border'
          );
          this.addChildAt(borderMarker, this.getChildIndex(drawable));
          drawable._borderMarker = borderMarker;
          borderMarker.setFill(this._markerBorderFill);
        }
        var stroke = new dvt.Stroke(
          borderColor,
          this.getStyle(state, this.BORDER_OPACITY),
          borderWidth
        );
        borderMarker.setStroke(stroke);

        // Do not antialias marker borders if specified or vertical
        if (
          (this.isVertical() ||
            markerType === dvt.SimpleMarker.RECTANGLE ||
            markerType === dvt.SimpleMarker.DIAMOND ||
            markerType === dvt.SimpleMarker.TRIANGLE_UP ||
            markerType === dvt.SimpleMarker.TRIANGLE_DOWN ||
            markerType === dvt.SimpleMarker.PLUS) &&
          this._defaultMarkerStyles.pixelHinting !== 'false'
        ) {
          borderMarker.setPixelHinting(true);
        }

        if (requiresGlowMarker) {
          if (glowMarker == null) {
            var glowOffset = borderOffset - borderWidth;
            if (markerType === dvt.SimpleMarker.CIRCLE) {
              width = (drawable.getDimensions().w + glowOffset * 2) * drawable.getScaleX();
              height = (drawable.getDimensions().h + glowOffset * 2) * drawable.getScaleY();
              cx = this.getX(drawable) - glowOffset + width / 2;
              cy = this.getY(drawable) - glowOffset + height / 2;
            } else {
              if (this.isVertical()) {
                width = (drawable.getDimensions().w + 3) * drawable.getScaleX();
                height = (drawable.getDimensions().h + 3) * drawable.getScaleY();
                cx = this.getY(drawable) + width / 2;
                cy = this.getX(drawable) - 1 + height / 2;
              } else {
                width = (drawable.getDimensions().w + glowOffset * 2) * drawable.getScaleX();
                height = (drawable.getDimensions().h + glowOffset * 2) * drawable.getScaleY();
                cx = this.getX(drawable) - glowOffset + width / 2;
                cy = this.getY(drawable) - glowOffset + height / 2;
              }
            }
            glowMarker = new dvt.SimpleMarker(
              this.getCtx(),
              markerType,
              cx,
              cy,
              width,
              height,
              null,
              null,
              null,
              drawable.getId() + '_glow'
            );
            this.addChildAt(glowMarker, this.getChildIndex(borderMarker));
            drawable._glowMarker = glowMarker;
            glowMarker.setFill(this._markerBorderFill);
          }
          var glowStroke = new dvt.Stroke(glowColor, this.getStyle(state, this.GLOW_OPACITY), 4);
          glowMarker.setStroke(glowStroke);

          // Do not antialias markers if specified or vertical
          if (
            (this.isVertical() ||
              markerType === dvt.SimpleMarker.RECTANGLE ||
              markerType === dvt.SimpleMarker.DIAMOND ||
              markerType === dvt.SimpleMarker.TRIANGLE_UP ||
              markerType === dvt.SimpleMarker.TRIANGLE_DOWN ||
              markerType === dvt.SimpleMarker.PLUS) &&
            this._defaultMarkerStyles.pixelHinting !== 'false'
          ) {
            glowMarker.setPixelHinting(true);
          }
        }
      }
    }

    applyDurationState(drawable, state) {
      var borderColor = this.getStyle(state, this.DURATION_BORDER_COLOR);
      if (borderColor == null) borderColor = '#000000';
      var width = parseInt(this.getStyle(state, this.DURATION_BORDER_WIDTH), 10);
      drawable.setStroke(new dvt.Stroke(borderColor, 1, width));
    }

    /************************** end marker selection *********************************************/

    getMarkers() {
      return this._markers;
    }
  }

  /**
   * DvtTimelineNavigationButton subclass of IconButton
   * @param {Timeline} timeline The parent timeline.
   * @param {dvt.Context} context
   * @param {'outlined'|'borderless'} chroming
   * @param {object} iconOptions supports keys style, size, pos
   * @param {dvt.Shape} background (optional)
   * @param {string} id
   * @param {object=} callback
   * @param {object=} callbackObj
   * @extends {dvt.IconButton}
   * @constructor
   *
   */
  class DvtTimelineNavigationButton extends dvt.IconButton {
    constructor(timeline, context, chroming, iconOptions, background, id, callback, callbackObj) {
      super(context, chroming, iconOptions, background, id, callback, callbackObj);
      this._id = id;
      this._timeline = timeline;
      this._enabledState = true;
      this.setAriaRole('button');
    }
    getNextNavigable(event) {
      var keyboardHandler = this._timeline.EventManager.getKeyboardHandler();
      var isRTL = dvt.Agent.isRightToLeft(this._timeline.getCtx());

      if (event.type === dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event)) {
        return this;
      } else if (keyboardHandler.isNavigationEvent(event)) {
        if (
          (!isRTL && dvt.KeyboardEvent.RIGHT_ARROW === event.keyCode) ||
          (isRTL && dvt.KeyboardEvent.LEFT_ARROW === event.keyCode)
        ) {
          // go forward
          if (this._id === 'prevNavArrow') {
            return this._timeline._nextArrow;
          } else {
            for (var i = 0; i < this._timeline._series.length; i++) {
              var series = this._timeline._series[i];
              if (series._items && series._items.length > 0) {
                return series._items[0];
              }
            }
          }
        } else if (
          (!isRTL && dvt.KeyboardEvent.LEFT_ARROW === event.keyCode) ||
          (isRTL && dvt.KeyboardEvent.RIGHT_ARROW === event.keyCode)
        ) {
          // go backwards
          if (this._id === 'nextNavArrow') {
            return this._timeline._prevArrow;
          } else {
            // don't do anything since you can only go forwards if already prevArrow
            return this;
          }
        }
      } else {
        return null;
      }
    }
    getAriaLabel() {
      var translations = this._callbackObj.getComponent().getOptions().translations;
      var states = !this._enabledState ? [translations['navArrowDisabledState']] : [];
      var label = dvt.Displayable.generateAriaLabel(this.getAriaString(), states);
      return label;
    }

    getAriaString() {
      var translations = this._callbackObj.getComponent().getOptions().translations;
      if (this._id === 'prevNavArrow') return translations['labelAccNavPreviousPage'];
      else if (this._id === 'nextNavArrow') return translations['labelAccNavNextPage'];
    }

    /**
     * Implemented for DvtKeyboardNavigable
     * @override
     */
    getKeyboardBoundingBox(targetCoordinateSpace) {
      return this.getDimensions(targetCoordinateSpace);
    }

    /**
     * Catch the state
     * @override
     */
    setEnabled(enabledState) {
      this._enabledState = enabledState;
      this.setAriaProperty('label', this.getAriaLabel());
      super.setEnabled(enabledState);
    }

    /**
     * Implemented for DvtKeyboardNavigable
     * @override
     */
    getTargetElem() {
      return this.getElem();
    }
  }

  /**
   * Renderer for Timeline.
   * @class
   */
  const DvtTimelineRenderer = {
    /**
     * Renders a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     */
    renderTimeline: (timeline) => {
      var series;
      DvtTimelineRenderer._removeEmptyText(timeline);

      DvtTimelineRenderer._renderBackground(timeline);
      DvtTimelineRenderer._renderScrollableCanvas(timeline);

      if (timeline.hasValidOptions()) {
        timeline.renderTimeZoomCanvas(timeline._canvas);
        var timeZoomCanvas = timeline.getTimeZoomCanvas();
        DvtTimelineRenderer._renderSeries(timeline, timeZoomCanvas);
        DvtTimelineRenderer._renderSeriesLabels(timeline);
        DvtTimelineRenderer._renderAxis(timeline, timeZoomCanvas);
        if (timeline.isDiscreteNavigationMode())
          DvtTimelineRenderer._renderNavigationArrows(timeline, timeZoomCanvas);
        else DvtTimelineRenderer._hideNavigationArrows(timeline, timeZoomCanvas);

        if (timeline._hasOverview) DvtTimelineRenderer._renderOverview(timeline);
        else timeline.clearOverview();

        // just use the first object as the focus
        if (timeline._keyboardHandler) {
          // if navigation mode set focus to prev arrow (removed for now)
          /*
          if (timeline.isDiscreteNavigationMode()) {
            timeline.EventManager.setFocusObj(timeline._prevArrow);
          }
          */
          for (var i = 0; i < timeline._series.length; i++) {
            series = timeline._series[i];
            if (series._items && series._items.length > 0) {
              if (!(timeline.EventManager.getFocus() != null)) {
                timeline.EventManager.setFocusObj(series._items[0]);
                break;
              }
            }
          }
        }
        if (timeline.isTimeDirScrollbarOn() || timeline.isContentDirScrollbarOn())
          DvtTimelineRenderer._renderScrollbars(timeline);

        DvtTimelineRenderer._renderZoomControls(timeline);

        // Initial Selection
        if (timeline.SelectionHandler) timeline.applyInitialSelections();

        if (ojtimeaxisToolkit.TimeAxisUtils.supportsTouch())
          timeline._setAriaProperty('flowto', timeline._series[0].getId());

        for (var j = 0; j < timeline._series.length; j++) {
          series = timeline._series[j];
          series.triggerAnimations();
        }
      } else DvtTimelineRenderer._renderEmptyText(timeline);
    },

    /**
     * Renders the background of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _renderBackground: (timeline) => {
      if (timeline._background) {
        timeline._background.setClipPath(null);
        timeline._background.setWidth(timeline._backgroundWidth);
        timeline._background.setHeight(timeline._backgroundHeight);
      } else
        timeline._background = new dvt.Rect(
          timeline.getCtx(),
          0,
          0,
          timeline._backgroundWidth,
          timeline._backgroundHeight,
          'bg'
        );

      var transX = timeline.getBackgroundXOffset();
      timeline._background.setTranslateX(transX);
      timeline._background.setCSSStyle(timeline._style);
      timeline._background.setPixelHinting(true);

      var cp = new dvt.ClipPath();
      cp.addRect(transX, 0, timeline._backgroundWidth, timeline._backgroundHeight);
      timeline._background.setClipPath(cp);

      if (timeline._background.getParent() !== timeline) timeline.addChild(timeline._background);
    },

    /**
     * Renders the scrollable canvas of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _renderScrollableCanvas: (timeline) => {
      if (timeline._canvas) return;
      timeline._canvas = new dvt.Container(timeline.getCtx(), 'g', 'canvas');
      timeline.addChild(timeline._canvas);
    },

    /**
     * Renders the series of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderSeries: (timeline, container) => {
      var timeAxis = timeline.getTimeAxis();
      if (timeline._series) {
        var context = timeline.getCtx();
        var isRTL = dvt.Agent.isRightToLeft(context);

        var seriesCount = timeline._series.length;
        var axisSize = timeline.getTimeAxisVisibleSize(seriesCount);
        if (!timeline.isVertical()) {
          if (seriesCount > 1 && timeline._canvasSize % 2 != axisSize % 2) {
            timeAxis.setContentSize(timeAxis.getContentSize() + 1);
            axisSize = timeline.getTimeAxisVisibleSize(seriesCount);
          }
        }
        timeline._seriesSize = (timeline._canvasSize - axisSize) / seriesCount;
        for (var i = 0; i < seriesCount; i++) {
          var series = timeline._series[i];

          // setup overflow controls
          series.setClipPath(null);
          var cp = new dvt.ClipPath();
          if (timeline.isVertical()) {
            if (isRTL) var key = Math.abs(i - 1);
            else key = i;
            if (isRTL && timeline._series.length === 1) {
              cp.addRect(axisSize, 0, timeline._seriesSize, timeline.getContentLength());
              var posMatrix = new dvt.Matrix(1, 0, 0, 1, axisSize, 0);
            } else {
              cp.addRect(
                key * (timeline._seriesSize + axisSize),
                0,
                timeline._seriesSize,
                timeline.getContentLength()
              );
              posMatrix = new dvt.Matrix(1, 0, 0, 1, key * (timeline._seriesSize + axisSize), 0);
            }
            var width = timeline._seriesSize;
            var height = timeline.getContentLength();
          } else {
            cp.addRect(
              0,
              i * (timeline._seriesSize + axisSize),
              timeline.getContentLength(),
              timeline._seriesSize
            );
            posMatrix = new dvt.Matrix(1, 0, 0, 1, 0, i * (timeline._seriesSize + axisSize));
            width = timeline.getContentLength();
            height = timeline._seriesSize;
          }
          series.setClipPath(cp);
          series.setMatrix(posMatrix);

          if (series.getParent() !== container) container.addChild(series);
          series.render(timeline._seriesOptions[i], width, height);
        }
      }
    },

    /**
     * Renders the series labels of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _renderSeriesLabels: (timeline) => {
      var dim, posMatrix;
      if (timeline._series) {
        var context = timeline.getCtx();
        var isRTL = dvt.Agent.isRightToLeft(context);

        if (timeline._seriesLabels) {
          for (var j = 0; j < timeline._seriesLabels.length; j++) {
            timeline.removeChild(timeline._seriesLabels[j]);
          }
        }
        timeline._seriesLabels = [];

        var seriesCount = timeline._series.length;
        var labelSpacing = DvtTimelineStyleUtils.getSeriesLabelSpacing();
        //TODO: Update to use zoom control spacing constant rather than '6'
        var zoomControlSpacing = dvt.TransientButton._DEFAULT_RADIUS * 2 + 6;
        var doubleLabelSpacing = labelSpacing * 2;
        for (var i = 0; i < seriesCount; i++) {
          var series = timeline._series[i];
          var seriesLabel = series.getLabel();
          if (seriesLabel != null) {
            var seriesLabelStyle = DvtTimelineStyleUtils.getSeriesLabelStyle(timeline.Options);
            var seriesLabelBackgroundStyle = new dvt.CSSStyle(
              DvtTimelineStyleUtils.getSeriesLabelBackgroundStyle()
            );
            if (series._style) {
              var backgroundColor = series._style.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
              if (backgroundColor)
                seriesLabelBackgroundStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, backgroundColor);
            }
            var seriesLabelElem = new dvt.OutputText(context, seriesLabel, 0, 0, 'sl_s' + i);
            seriesLabelElem.setCSSStyle(seriesLabelStyle);

            dim = seriesLabelElem.getDimensions();
            if (timeline.isVertical()) var totalSpace = timeline._seriesSize;
            else totalSpace = timeline._canvasLength;
            var width = Math.min(
              dim.w,
              totalSpace - (i - 1) * -zoomControlSpacing - doubleLabelSpacing
            );

            var seriesLabelPadding = DvtTimelineStyleUtils.getSeriesLabelPadding();
            var backgroundRect = new dvt.Rect(
              context,
              0,
              0,
              width + seriesLabelPadding * 2,
              dim.h + seriesLabelPadding * 2,
              'slb_s' + i
            );
            backgroundRect.setCSSStyle(seriesLabelBackgroundStyle);
            backgroundRect.setAlpha(DvtTimelineStyleUtils.getSeriesLabelBackgroundOpacity());
            backgroundRect.setCornerRadius(3);

            if (!timeline.isVertical()) {
              if (isRTL)
                var posX =
                  timeline._canvasLength - width - labelSpacing - (i - 1) * -zoomControlSpacing;
              else posX = timeline._startX + labelSpacing + (i - 1) * -zoomControlSpacing;
              var posY =
                i * (timeline._canvasSize - dim.h - doubleLabelSpacing) +
                labelSpacing +
                timeline._startY;
            } else {
              if (isRTL)
                posX =
                  Math.abs(i - 1) * (timeline._canvasSize - width - doubleLabelSpacing) +
                  labelSpacing +
                  timeline._startX +
                  (i - 1) * zoomControlSpacing;
              else
                posX =
                  i * (timeline._canvasSize - width - doubleLabelSpacing) +
                  labelSpacing +
                  timeline._startX +
                  (i - 1) * -zoomControlSpacing;
              posY = timeline._startY + labelSpacing;
            }
            posMatrix = new dvt.Matrix(1, 0, 0, 1, posX, posY);
            seriesLabelElem.setMatrix(posMatrix);
            posMatrix = new dvt.Matrix(
              1,
              0,
              0,
              1,
              posX - seriesLabelPadding,
              posY - seriesLabelPadding
            );
            backgroundRect.setMatrix(posMatrix);

            timeline.addChild(backgroundRect);
            dvt.TextUtils.fitText(seriesLabelElem, width, Infinity, timeline);
            timeline._seriesLabels.push(backgroundRect);
            timeline._seriesLabels.push(seriesLabelElem);
          }
          if (series._isEmpty) {
            var seriesEmptyText = series.getEmptyText();
            if (seriesEmptyText != null) {
              var seriesEmptyTextElem = new dvt.OutputText(
                context,
                seriesEmptyText,
                0,
                0,
                'et_s' + i
              );
              seriesEmptyTextElem.setCSSStyle(
                DvtTimelineStyleUtils.getEmptyTextStyle(timeline.Options)
              );

              dim = seriesEmptyTextElem.getDimensions();
              if (!timeline.isVertical()) {
                var matPosX = (timeline._canvasLength - dim.w) / 2 + timeline._startX;
                var matPosY =
                  i * (timeline._seriesSize + timeline.getTimeAxisVisibleSize(seriesCount)) +
                  (timeline._seriesSize - dim.h) / 2 +
                  timeline._startY;
              } else {
                matPosY = (timeline._canvasLength - dim.h) / 2 + timeline._startY;
                if (isRTL)
                  matPosX =
                    Math.abs(i - 1) *
                      ((seriesCount - 1) * timeline._seriesSize +
                        timeline.getTimeAxisVisibleSize(seriesCount)) +
                    (timeline._seriesSize - dim.w) / 2 +
                    timeline._startX;
                else
                  matPosX =
                    i * (timeline._seriesSize + timeline.getTimeAxisVisibleSize(seriesCount)) +
                    (timeline._seriesSize - dim.w) / 2 +
                    timeline._startX;
              }
              posMatrix = new dvt.Matrix(1, 0, 0, 1, matPosX, matPosY);
              seriesEmptyTextElem.setMatrix(posMatrix);

              timeline.addChild(seriesEmptyTextElem);
              timeline._seriesLabels.push(seriesEmptyTextElem);
            }
          }
        }
      }
    },

    /**
     * Renders the navigation arrows of the timeline
     * @param {Timeline} timeline The timeline being rendered.
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderNavigationArrows: (timeline, container) => {
      var context = timeline.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var length = timeline._discreteContentLength;
      var seriesCount = timeline._series.length;
      var axisVisibleSize = timeline.getTimeAxisVisibleSize(seriesCount);
      var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
      var navButtonWidth = DvtTimelineStyleUtils.getNavButtonWidth();
      var axisStart =
        seriesCount === 1
          ? timeline._canvasSize - axisVisibleSize
          : timeline._canvasSize / seriesCount - axisVisibleSize / 2;
      var timeAxisOffset =
        timeline.getDatePos(timeline._viewStartTime) +
        timeline._discreteOffset -
        navButtonBackgroundWidth;
      var nextTimeAxisOffset = timeline._backgroundWidth + timeAxisOffset - navButtonBackgroundWidth;
      if (isRTL) {
        nextTimeAxisOffset =
          length -
          nextTimeAxisOffset -
          navButtonBackgroundWidth -
          timeline.getScrollbarPadding() +
          timeline._discreteOffset * 2;
        timeAxisOffset =
          length - timeAxisOffset - navButtonBackgroundWidth + timeline._discreteOffset * 2;
      }
      var buttonBorderColor = timeline.Options['styleDefaults']['item']['borderColor'];
      var buttonStroke = new dvt.Stroke(buttonBorderColor, 1, 1);
      var arrowContainerBackFillColor =
        timeline.Options['styleDefaults']['series']['backgroundColor'];

      if (timeline._prevArrowContainer == null) {
        var prevArrowContainer = new dvt.Container(context);
        var prevContainerBackground = new dvt.Rect(
          context,
          0,
          0,
          navButtonBackgroundWidth,
          navButtonBackgroundWidth,
          'prevNavContainer'
        );
        var prevArrowButton = new dvt.Rect(
          context,
          0,
          0,
          navButtonWidth,
          navButtonWidth,
          'prevNavContainer_i'
        );
        prevArrowButton.setCornerRadius(4);
        prevArrowButton.setTranslate(8, 8);
        prevContainerBackground.addChild(prevArrowButton);
        prevArrowContainer.addChild(prevContainerBackground);
        prevArrowContainer.setTranslate(timeAxisOffset, axisStart - navButtonWidth);
        prevArrowContainer.setClassName('oj-timeline-nav-arrow oj-timeline-nav-arrow-previous');
        prevArrowButton.setStroke(buttonStroke);
        prevArrowContainer.setSolidFill(arrowContainerBackFillColor);
        var iconStyle = dvt.ToolkitUtils.getIconStyle(context, timeline._resources.prev);
        var prevButtonIcon = new DvtTimelineNavigationButton(
          timeline,
          context,
          'outlined',
          { style: iconStyle, size: 28 },
          null,
          'prevNavArrow',
          timeline.EventManager.prevPage,
          timeline.EventManager
        );
        prevButtonIcon.setTranslate(4, 4);
        prevArrowButton.addChild(prevButtonIcon);
        container.addChild(prevArrowContainer);
        timeline._prevArrowContainer = prevArrowContainer;
        timeline._prevArrow = prevButtonIcon;
      } else {
        timeline._prevArrowContainer.setVisible('visible');
        timeline._prevArrowContainer.setTranslate(timeAxisOffset, axisStart - navButtonWidth);
        container.removeChild(timeline._prevArrowContainer);
        container.addChild(timeline._prevArrowContainer);
      }

      if (timeline._nextArrowContainer == null) {
        var nextArrowContainer = new dvt.Container(context);
        var nextContainerBackground = new dvt.Rect(
          context,
          0,
          0,
          navButtonBackgroundWidth,
          navButtonBackgroundWidth,
          'nextNavContainer'
        );
        var nextArrowButton = new dvt.Rect(
          context,
          0,
          0,
          navButtonWidth,
          navButtonWidth,
          'nextNavContainer_i'
        );
        nextArrowButton.setCornerRadius(4);
        nextArrowButton.setTranslate(16, 8);
        nextContainerBackground.addChild(nextArrowButton);
        nextArrowContainer.addChild(nextContainerBackground);
        nextArrowContainer.setTranslate(nextTimeAxisOffset, axisStart - navButtonWidth);
        nextArrowContainer.setClassName('oj-timeline-nav-arrow oj-timeline-nav-arrow-next');
        nextArrowButton.setStroke(buttonStroke);
        nextArrowContainer.setSolidFill(arrowContainerBackFillColor);
        var iconStyle = dvt.ToolkitUtils.getIconStyle(context, timeline._resources.next);
        var nextButtonIcon = new DvtTimelineNavigationButton(
          timeline,
          context,
          'outlined',
          { style: iconStyle, size: 28 },
          null,
          'nextNavArrow',
          timeline.EventManager.nextPage,
          timeline.EventManager
        );
        nextButtonIcon.setTranslate(4, 4);
        nextArrowButton.addChild(nextButtonIcon);
        container.addChild(nextArrowContainer);
        timeline._nextArrowContainer = nextArrowContainer;
        timeline._nextArrow = nextButtonIcon;
      } else {
        timeline._nextArrowContainer.setVisible('visible');
        timeline._nextArrowContainer.setTranslate(nextTimeAxisOffset, axisStart - navButtonWidth);
        container.removeChild(timeline._nextArrowContainer);
        container.addChild(timeline._nextArrowContainer);
      }

      DvtTimelineRenderer._checkDisabledArrows(timeline);
    },

    /**
     * Hides the navigation arrows of the timeline if they exist
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _hideNavigationArrows: (timeline) => {
      if (timeline._prevArrowContainer != null) {
        timeline._prevArrowContainer.setVisible();
      }
      if (timeline._nextArrowContainer != null) {
        timeline._nextArrowContainer.setVisible();
      }
    },

    /**
     * Adds disabled state to the arrows if they are at the end of the available range.
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _checkDisabledArrows: (timeline) => {
      if (timeline.startPanAllowed()) {
        timeline._prevArrowContainer.removeClassName('oj-timeline-nav-arrow-disabled');
        timeline._prevArrow.setEnabled(true);
      } else {
        timeline._prevArrowContainer.addClassName('oj-timeline-nav-arrow-disabled');
        timeline._prevArrow.setEnabled(false);
      }

      if (timeline.endPanAllowed()) {
        timeline._nextArrowContainer.removeClassName('oj-timeline-nav-arrow-disabled');
        timeline._nextArrow.setEnabled(true);
      } else {
        timeline._nextArrowContainer.addClassName('oj-timeline-nav-arrow-disabled');
        timeline._nextArrow.setEnabled(false);
      }
    },

    /**
     * Renders the minor time axis of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {boolean=} throttle Whether to throttle the rendering with requestAnimationFrame.
     *   Improves performance especially during high fire rate events such as scroll. Default false.
     * @private
     */
    _renderAxis: (timeline, container, throttle) => {
      var context = timeline.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var timeAxis = timeline.getTimeAxis();

      var seriesCount = timeline._series.length;
      var axisSize = timeline.getTimeAxisSize();
      var axisVisibleSize = timeline.getTimeAxisVisibleSize(seriesCount);
      var axisStart =
        seriesCount === 1
          ? timeline._canvasSize - axisVisibleSize
          : timeline._canvasSize / seriesCount - axisVisibleSize / 2;
      var length = timeline.getContentLength();
      if (isRTL && timeline.isVertical() && timeline._series.length === 1) axisStart = 0;

      if (timeAxis.getParent() !== container) container.addChild(timeAxis);

      if (timeline.isVertical()) {
        var posMatrix = new dvt.Matrix(1, 0, 0, 1, axisStart, 0);
        timeAxis.render(
          {
            _viewStartTime: timeline._viewStartTime,
            _viewEndTime: timeline._viewEndTime,
            _referenceObjects: { referenceObjects: [] },
            _throttle: throttle
          },
          axisSize,
          length
        );
      } else {
        var isDiscreteNavMode = timeline.isDiscreteNavigationMode();
        var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();

        length = isDiscreteNavMode ? timeline._discreteContentLength : length;

        // in navigation mode, grab +/- 60 px extra for beginning and end.
        var startDate = timeline.getDiscreteViewportStartDate();
        var endDate = timeline.getDiscreteViewportEndDate();

        var options = timeline.getOptions();
        var startTime = isDiscreteNavMode ? startDate : timeline._viewStartTime;
        var endTime = isDiscreteNavMode ? endDate : timeline._viewEndTime;
        var axisAdjustment = timeline._seriesScale ? axisSize : 0;
        posMatrix = new dvt.Matrix(
          1,
          0,
          0,
          1,
          timeline.getDiscreteOffset(),
          axisStart - axisAdjustment
        );
        timeAxis.render(
          {
            _viewStartTime: startTime,
            _viewEndTime: endTime,
            _referenceObjects: {
              referenceObjects: options.referenceObjects,
              defaultStyleClass: null,
              defaultStroke: new dvt.Stroke(DvtTimelineStyleUtils.getReferenceObjectColor(options))
            },
            _throttle: throttle
          },
          length,
          axisSize
        );
      }

      timeAxis.setMatrix(posMatrix);

      // Set major and minor axis to be same length
      if (timeline._majorAxis) {
        timeline._majorAxis.setContentLength(timeAxis._contentLength, timeAxis._contentLength);
      }
      timeline._fetchEndPos = timeAxis._contentLength;
      DvtTimelineRenderer._renderSeriesTimeAxis(
        timeline,
        timeline._fetchStartPos,
        timeline._fetchEndPos,
        timeline.getTimeZoomCanvas(),
        length
      );
    },

    /**
     * Renders the major time axis labels of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @param {number} startPos The start position of the rendering.
     * @param {number} endPos The end position of the rendering.
     * @param {dvt.Container} container The container to render into.
     * @param {number} length The length of the axis.
     * @private
     */
    _renderSeriesTimeAxis: (timeline, startPos, endPos, container, length) => {
      var context = timeline.getCtx();
      var axisSize = timeline.getTimeAxisSize();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var offset =
        (timeline.isDiscreteNavigationMode() ? timeline._discreteOffset : 0) * (isRTL ? -1 : 1);

      if (timeline._majorAxisLabels) {
        for (var j = 0; j < timeline._majorAxisLabels.length; j++) {
          container.removeChild(timeline._majorAxisLabels[j]);
        }
      }
      timeline._majorAxisLabels = [];

      if (timeline._seriesScale) {
        var dates;
        var labels;
        var start = timeline._start;
        var end = timeline._end;
        if (timeline._customTimeScales && timeline._customTimeScales[timeline._seriesScale]) {
          var customScale = timeline._customTimeScales[timeline._seriesScale];
          dates = customScale['times'];
          labels = customScale['labels'];
        } else if (
          timeline._seriesCustomFormatScales &&
          timeline._seriesCustomFormatScales[timeline._seriesScale]
        ) {
          var customFormatScale = timeline._seriesCustomFormatScales[timeline._seriesScale];
          dates = customFormatScale['times'];
          labels = customFormatScale['labels'];
        } else {
          dates = [];
          labels = [];

          var startDate = timeline.getPosDate(startPos);
          var currentDate = timeline._seriesTimeAxis.adjustDate(startDate);
          var currentPos = timeline.getDatePos(currentDate);
          dates.push(currentDate.getTime());
          while (currentPos < endPos) {
            labels.push(timeline._seriesTimeAxis.formatDate(currentDate));
            currentDate = timeline._seriesTimeAxis.getNextDate(currentDate.getTime());
            currentPos = timeline.getDatePos(currentDate);
            // the last currentTime added in this loop is outside of the time range, but is needed
            // for the last 'next' date when actually creating the time axis in renderTimeAxis
            dates.push(currentDate.getTime());
          }
        }
        var seriesAxisLabelStyle = DvtTimelineStyleUtils.getSeriesAxisLabelStyle(timeline.Options);
        var seriesAxisLabelPadding = DvtTimelineStyleUtils.getSeriesAxisLabelPadding();
        var seriesAxisLabelBackgroundStyle = new dvt.CSSStyle(
          DvtTimelineStyleUtils.getSeriesAxisLabelBackgroundStyle()
        );
        if (timeline._series[0] && timeline._series[0]._style) {
          var backgroundColor = timeline._series[0]._style.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
          if (backgroundColor)
            seriesAxisLabelBackgroundStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, backgroundColor);
        }
        var seriesAxisLabelBackgroundOpacity =
          DvtTimelineStyleUtils.getSeriesAxisLabelBackgroundOpacity();
        for (var i = 0; i < labels.length; i++) {
          var label = labels[i];
          var currentTime = dates[i];
          currentPos = timeline.getDatePos(currentTime) + offset;

          var next_time_pos = timeline.getDatePos(dates[i + 1]) + offset;
          var maxLength = next_time_pos - currentPos;

          if (!isRTL) {
            if (timeline.isVertical())
              var labelElem = DvtTimelineRenderer._addLabel(
                context,
                container,
                5,
                label,
                maxLength,
                currentPos + 18,
                seriesAxisLabelStyle,
                'o_label' + currentPos + '_s0',
                true,
                seriesAxisLabelBackgroundStyle,
                seriesAxisLabelBackgroundOpacity,
                seriesAxisLabelPadding,
                timeline._majorAxisLabels,
                isRTL
              );
            else
              labelElem = DvtTimelineRenderer._addLabel(
                context,
                container,
                currentPos + 5,
                label,
                maxLength,
                timeline._seriesSize - 2 + axisSize,
                seriesAxisLabelStyle,
                'o_label' + currentPos + '_s0',
                true,
                seriesAxisLabelBackgroundStyle,
                seriesAxisLabelBackgroundOpacity,
                seriesAxisLabelPadding,
                timeline._majorAxisLabels,
                isRTL
              );
          } else {
            if (timeline.isVertical())
              labelElem = DvtTimelineRenderer._addLabel(
                context,
                container,
                timeline._canvasSize - 5,
                label,
                maxLength,
                currentPos + 18,
                seriesAxisLabelStyle,
                'o_label' + currentPos + '_s0',
                true,
                seriesAxisLabelBackgroundStyle,
                seriesAxisLabelBackgroundOpacity,
                seriesAxisLabelPadding,
                timeline._majorAxisLabels,
                isRTL
              );
            else
              labelElem = DvtTimelineRenderer._addLabel(
                context,
                container,
                length - (currentPos + 5),
                label,
                maxLength,
                timeline._seriesSize - 2 + axisSize,
                seriesAxisLabelStyle,
                'o_label' + currentPos + '_s0',
                true,
                seriesAxisLabelBackgroundStyle,
                seriesAxisLabelBackgroundOpacity,
                seriesAxisLabelPadding,
                timeline._majorAxisLabels,
                isRTL
              );
          }
          labelElem.time = dates[i];
        }
      }
    },

    /**
     * Renders the overvie of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _renderOverview: (timeline) => {
      var context = timeline.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      if (timeline._overviewCanvas == null) {
        var addOverviewCanvas = true;
        timeline._overviewCanvas = new dvt.Container(context, 'g', 'oCanvas');
      } else {
        timeline._overviewCanvas.removeChildren();
        timeline._overviewCanvas.setClipPath(null);
      }

      var borderWidth = timeline._style.getBorderWidth();
      var halfBorderWidth = borderWidth / 2;
      var width, height, x, y;
      if (timeline.isVertical()) {
        width = timeline._overviewSize;
        height = timeline._backgroundHeight - borderWidth;
        y = halfBorderWidth;
        if (!isRTL) x = timeline._backgroundWidth - timeline._overviewSize - halfBorderWidth;
        else x = halfBorderWidth;
      } else {
        width = timeline._backgroundWidth - borderWidth;
        height = timeline._overviewSize;
        y = timeline._backgroundHeight - timeline._overviewSize - halfBorderWidth;
        x = halfBorderWidth + timeline.getBackgroundXOffset();
      }
      timeline._overviewCanvas.setTranslateX(x);
      timeline._overviewCanvas.setTranslateY(y);
      var cp = new dvt.ClipPath();
      cp.addRect(x, y, width, height);
      timeline._overviewCanvas.setClipPath(cp);

      if (addOverviewCanvas) timeline.addChild(timeline._overviewCanvas);

      timeline._overview = new TimelineOverview(context, timeline.HandleEvent, timeline);
      timeline._overviewCanvas.addChild(timeline._overview);

      var overviewObject = timeline._getOverviewObject();
      timeline._overview.render(overviewObject, width, height);

      // turn off overview dragging when in discrete viewport navigation mode
      // turn off handle affordances;
      if (timeline.isDiscreteNavigationMode()) {
        timeline._overview.setMouseEnabled(false);
        timeline._overview._windowLeftGrippy.setVisible();
        timeline._overview._windowRightGrippy.setVisible();
      }
    },

    /**
     * Renders the scrollbars.
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _renderScrollbars: (timeline) => {
      var context = timeline.getCtx();
      var scrollbarPadding = timeline.getScrollbarPadding();
      var seriesCount = timeline._series.length;

      if (timeline._scrollbarsCanvas == null) {
        timeline._scrollbarsCanvas = new dvt.Container(context, 'g', 'sbCanvas');
        timeline.addChild(timeline._scrollbarsCanvas);
      } else {
        timeline._scrollbarsCanvas.removeChildren();
        timeline.setTimeDirScrollbar(null);
        timeline.setContentDirScrollbar(null);
      }

      if (timeline.isTimeDirScrollbarOn()) {
        if (timeline.isVertical()) {
          if (dvt.Agent.isRightToLeft(timeline.getCtx()))
            var availSpaceWidth = scrollbarPadding * 2 + 1;
          else availSpaceWidth = timeline.Width - scrollbarPadding * 1.5;
          var availSpaceHeight = timeline.getCanvasLength();
        } else {
          availSpaceWidth = timeline.getCanvasLength();
          availSpaceHeight = timeline.Height - scrollbarPadding * 1.5;
        }
        var timeDirScrollbarDim = DvtTimelineRenderer._prerenderTimeDirScrollbar(
          timeline,
          timeline._scrollbarsCanvas,
          new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight)
        );
      }
      if (timeline.isContentDirScrollbarOn()) {
        if (timeline.isVertical()) {
          availSpaceWidth = timeline._seriesSize;
          availSpaceHeight = timeline.Height - scrollbarPadding * 1.5;
        } else {
          if (dvt.Agent.isRightToLeft(timeline.getCtx())) availSpaceWidth = scrollbarPadding * 2 + 1;
          else availSpaceWidth = timeline.Width - scrollbarPadding * 1.5;
          availSpaceHeight = timeline._seriesSize;
        }

        var contentDirScrollbarDim = [];
        for (var i = 0; i < seriesCount; i++) {
          contentDirScrollbarDim[i] = DvtTimelineRenderer._prerenderContentDirScrollbar(
            timeline,
            timeline._scrollbarsCanvas,
            new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight),
            i
          );
        }
      }

      if (timeline.timeDirScrollbar) {
        var sbOptions = {};
        sbOptions['color'] = timeline.timeDirScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
        sbOptions['backgroundColor'] = timeline.timeDirScrollbarStyles.getStyle(
          dvt.CSSStyle.BACKGROUND_COLOR
        );
        sbOptions['min'] = timeline._start;
        sbOptions['max'] = timeline._end;
        if (timeline.isVertical()) {
          sbOptions['isReversed'] = false;
          sbOptions['isHorizontal'] = false;
          timeline.timeDirScrollbar.setTranslateY(timeline.getStartYOffset());
        } else {
          sbOptions['isReversed'] = dvt.Agent.isRightToLeft(context);
          sbOptions['isHorizontal'] = true;
          timeline.timeDirScrollbar.setTranslateX(timeline.getStartXOffset());
        }
        if (timeDirScrollbarDim != null) {
          timeline.timeDirScrollbar.render(sbOptions, timeDirScrollbarDim.w, timeDirScrollbarDim.h);
          timeline.timeDirScrollbar.setViewportRange(timeline._viewStartTime, timeline._viewEndTime);
        }
      }
      if (timeline.contentDirScrollbar) {
        for (i = 0; i < seriesCount; i++) {
          sbOptions = {};
          sbOptions['color'] = timeline.contentDirScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
          sbOptions['backgroundColor'] = timeline.contentDirScrollbarStyles.getStyle(
            dvt.CSSStyle.BACKGROUND_COLOR
          );
          sbOptions['isHorizontal'] = timeline.isVertical();

          if (i == 0) {
            sbOptions['min'] = 0;
            var contentDirScrollbarH =
              contentDirScrollbarDim != null &&
              contentDirScrollbarDim[i] != null &&
              contentDirScrollbarDim[i].h != null
                ? contentDirScrollbarDim[i].h
                : 0;
            sbOptions['max'] = Math.max(timeline._series[i]._maxOverflowValue, contentDirScrollbarH);
            if (!timeline.isVertical()) {
              sbOptions['isReversed'] = true;
              timeline.contentDirScrollbar[i].setTranslateY(timeline.getStartYOffset());
            } else {
              if (dvt.Agent.isRightToLeft(context)) {
                sbOptions['isReversed'] = false;
                if (seriesCount === 2)
                  timeline.contentDirScrollbar[i].setTranslateX(
                    timeline.getStartXOffset() +
                      timeline._seriesSize +
                      timeline.getTimeAxisVisibleSize(seriesCount)
                  );
                else
                  timeline.contentDirScrollbar[i].setTranslateX(
                    timeline.getStartXOffset() + timeline.getTimeAxisVisibleSize(seriesCount)
                  );
              } else {
                sbOptions['isReversed'] = true;
                timeline.contentDirScrollbar[i].setTranslateX(timeline.getStartXOffset());
              }
            }
          } else {
            sbOptions['min'] = 0;
            sbOptions['max'] = Math.max(
              timeline._series[i]._maxOverflowValue,
              contentDirScrollbarDim[i].h
            );
            if (!timeline.isVertical()) {
              sbOptions['isReversed'] = false;
              timeline.contentDirScrollbar[i].setTranslateY(
                timeline.getStartYOffset() +
                  timeline._seriesSize +
                  timeline.getTimeAxisVisibleSize(seriesCount)
              );
            } else {
              if (dvt.Agent.isRightToLeft(context)) {
                sbOptions['isReversed'] = true;
                timeline.contentDirScrollbar[i].setTranslateX(timeline.getStartXOffset());
              } else {
                sbOptions['isReversed'] = false;
                timeline.contentDirScrollbar[i].setTranslateX(
                  timeline.getStartXOffset() +
                    timeline._seriesSize +
                    timeline.getTimeAxisVisibleSize(seriesCount)
                );
              }
            }
          }
          timeline.contentDirScrollbar[i].render(
            sbOptions,
            contentDirScrollbarDim[i].w,
            contentDirScrollbarDim[i].h
          );
          timeline.contentDirScrollbar[i].setViewportRange(0, timeline._seriesSize);
        }
      }
    },

    /**
     * Prepares the time direction scrollbar for rendering.
     * @param {Timeline} timeline The timeline being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @return {dvt.Dimension} The dimension of the scrollbar.
     * @private
     */
    _prerenderTimeDirScrollbar: (timeline, container, availSpace) => {
      timeline.setTimeDirScrollbar(
        new dvt.SimpleScrollbar(timeline.getCtx(), timeline.HandleEvent, timeline)
      );
      container.addChild(timeline.timeDirScrollbar);
      if (timeline.isVertical()) {
        var location = 'right';
        var width = dvt.CSSStyle.toNumber(timeline.timeDirScrollbarStyles.getWidth());
        var height = availSpace.h;
      } else {
        location = 'bottom';
        width = availSpace.w;
        height = dvt.CSSStyle.toNumber(timeline.timeDirScrollbarStyles.getHeight());
      }
      dvt.LayoutUtils.position(availSpace, location, timeline.timeDirScrollbar, width, height, 0);
      return new dvt.Dimension(width, height);
    },

    /**
     * Prepares the content direction scrollbar for rendering.
     * @param {Timeline} timeline The timeline being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @param {number} index The series index.
     * @return {dvt.Dimension} The dimension of the scrollbar.
     * @private
     */
    _prerenderContentDirScrollbar: (timeline, container, availSpace, index) => {
      timeline.setContentDirScrollbar(
        new dvt.SimpleScrollbar(timeline.getCtx(), timeline.HandleEvent, timeline),
        index
      );
      container.addChild(timeline.contentDirScrollbar[index]);
      if (timeline.isVertical()) {
        var location = 'bottom';
        var width = availSpace.w;
        var height = dvt.CSSStyle.toNumber(timeline.contentDirScrollbarStyles.getHeight());
      } else {
        location = 'right';
        width = dvt.CSSStyle.toNumber(timeline.contentDirScrollbarStyles.getWidth());
        height = availSpace.h;
      }
      dvt.LayoutUtils.position(
        availSpace,
        location,
        timeline.contentDirScrollbar[index],
        width,
        height,
        0
      );
      return new dvt.Dimension(width, height);
    },

    /**
     * Renders the zoom controls of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _renderZoomControls: (timeline) => {
      var context = timeline.getCtx();
      var resources = timeline._resources;
      var isRTL = dvt.Agent.isRightToLeft(context);

      if (!timeline.isDiscreteNavigationMode()) {
        var zoomControlProperties = {
          zoomInProps: {
            imageSize: 16,
            class: resources['zoomIn']
          },
          zoomOutProps: {
            imageSize: 16,
            class: resources['zoomOut']
          }
        };

        var xOffset =
          timeline.getStartXOffset() + DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;
        if (isRTL) {
          // startXOffset includes the overview size when vertical, and the scrollbar region when not
          if (timeline._isVertical && timeline._hasOverview)
            xOffset = xOffset - timeline._overviewSize;
          else xOffset = xOffset - timeline.getBackgroundXOffset();

          xOffset =
            timeline._backgroundWidth -
            xOffset -
            DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER;
        }

        zoomControlProperties['zoomInProps']['posX'] = xOffset;
        zoomControlProperties['zoomOutProps']['posX'] = xOffset;

        var yOffset = timeline._startY + DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;

        zoomControlProperties['zoomInProps']['posY'] = yOffset;
        zoomControlProperties['zoomOutProps']['posY'] =
          yOffset +
          DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER +
          DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING;

        timeline.renderZoomControls(zoomControlProperties);

        // turn them visible if they may be hidden
        timeline.zoomin.setVisible('visible');
        timeline.zoomout.setVisible('visible');
      } else {
        // hide zoom controls if changing from different mode that uses zoom controls.
        if (timeline.zoomin) {
          timeline.zoomin.setVisible();
          timeline.zoomout.setVisible();
        }
      }
    },

    /**
     * Renders the empty text of a timeline.
     * @param {Timeline} timeline The timeline being rendered.
     * @private
     */
    _renderEmptyText: (timeline) => {
      // Get the empty text string
      var series = timeline.Options['series'];
      var seriesItems = series != null && series.length > 0 ? series[0].items : null;

      // If series items is empty or unset, show NoData text instead
      if (series && seriesItems && seriesItems.length > 0)
        var emptyTextStr = timeline.Options.translations.labelInvalidData;
      else emptyTextStr = timeline.Options.translations.labelNoData;

      timeline.clearComponent();
      var emptyText = timeline.renderEmptyText(
        timeline._canvas,
        emptyTextStr,
        new dvt.Rectangle(0, 0, timeline._backgroundWidth, timeline._backgroundHeight),
        timeline.EventManager,
        DvtTimelineStyleUtils.getEmptyTextStyle(timeline.Options)
      );

      DvtTimelineRenderer.setEmptyText(emptyText, timeline);
    },

    /**
     * Sets the empty text.
     * @param {dvt.OutputText} text The new text.
     */
    setEmptyText: (text, timeline) => {
      timeline._emptyText = text;
    },

    /**
     * Removes empty text.
     * @param {Timeline} timeline The timeline being rendered.
     */
    _removeEmptyText: (timeline) => {
      if (timeline._emptyText && timeline._emptyText.getParent()) {
        timeline._emptyText.getParent().removeChild(timeline._emptyText);
        timeline._emptyText = null;
      }
    },

    /**
     * Adds a time interval label.
     * @param {type} context
     * @param {type} container
     * @param {type} pos
     * @param {type} text
     * @param {type} maxLength
     * @param {type} y
     * @param {type} labelStyle
     * @param {type} id
     * @param {type} renderBackground
     * @param {type} backgroundLabelStyle
     * @param {type} backgroundLabelOpacity
     * @param {type} labelPadding
     * @param {type} labelList
     * @param {type} isRTL
     * @private
     * @return {dvt.OutputText}
     */
    _addLabel: (
      context,
      container,
      pos,
      text,
      maxLength,
      y,
      labelStyle,
      id,
      renderBackground,
      backgroundLabelStyle,
      backgroundLabelOpacity,
      labelPadding,
      labelList,
      isRTL
    ) => {
      var label = new dvt.OutputText(context, text, pos, 0, id);
      if (labelStyle != null) label.setCSSStyle(labelStyle);

      var dim = label.getDimensions();
      y = y - dim.h;
      label.setY(y);
      if (isRTL) label.setX(pos - dim.w);

      if (renderBackground) {
        var width = Math.min(dim.w + labelPadding * 2, maxLength);
        if (!isRTL) var x = pos;
        else x = pos - width + 2 * labelPadding;
        var backgroundRect = new dvt.Rect(
          context,
          x - labelPadding,
          y - labelPadding,
          width,
          dim.h + labelPadding * 2,
          'ob_' + id
        );
        backgroundRect.setCSSStyle(backgroundLabelStyle);
        backgroundRect.setCornerRadius(3);
        backgroundRect.setAlpha(backgroundLabelOpacity);
        container.addChild(backgroundRect);
        if (labelList) labelList.push(backgroundRect);
      }
      dvt.TextUtils.fitText(label, maxLength, Infinity, container);
      if (labelList) labelList.push(label);

      return label;
    }
  };

  /**
   * TimelineSeries JSON Parser
   * @param {DvtTimelineSeries} timelineSeries The owning timelineSeries component.
   * @class
   * @constructor
   * @extends {dvt.Obj}
   */
  class DvtTimelineSeriesParser {
    constructor(context) {
      this._context = context;
    }

    /**
     * Parses the specified data options and returns the root node of the timelineSeries
     * @param {object} options The data options describing the component.
     * @return {object} An object containing the parsed properties
     */
    parse(options, oldItems) {
      // Parse the data options and get the root node
      var _data = this.buildData(options);

      var ret = new Object();

      ret.start = new Date(options['start']).getTime();
      ret.end = new Date(options['end']).getTime();

      ret.inlineStyle = options['style'];
      if (options['svgStyle']) ret.inlineStyle = options['svgStyle'];
      // end of stuff from superclass parser...

      ret.scale = options['scale'];
      ret.timeAxis = options['timeAxis'];
      ret.label = options['label'];
      ret.emptyText = options['emptyText'];

      ret.isIRAnimationEnabled = options['animationOnDisplay'] === 'auto';
      ret.isDCAnimationEnabled = options['animationOnDataChange'] === 'auto';

      ret.items = this._parseDataNode(
        options['timeline'],
        options['index'],
        _data.data,
        oldItems,
        ret.start,
        ret.end
      );
      ret.rtl = 'false';

      ret.isRandomItemLayout = options['_isRandomItemLayout'];
      ret.customTimeScales = options['_cts'];
      ret.customFormatScales = options['_cfs'];

      if (options['itemLayout'] == null || options['itemLayout'] === 'auto')
        ret.isTopToBottom = options['inverted'];
      else ret.isTopToBottom = options['itemLayout'] === 'topToBottom';

      ret.data = options['_data'];

      return ret;
    }

    /**
     * Constructs and returns the data array object.
     * @param {object} options The options object.
     * @protected
     */
    buildData(options) {
      var data = {};

      var itemArray = [];
      var seriesItems = options['items'];
      if (seriesItems) {
        for (var j = 0; j < seriesItems.length; j++) {
          var item = seriesItems[j];
          itemArray.push(item);
        }
      }
      data.data = itemArray;
      return data;
    }

    /**
     * Recursively parses the data option nodes, creating tree component nodes.
     * @param {DvtTimeline} timeline The parent Timeline component.
     * @param {number} seriesIndex The index of the series.
     * @param {object} data The data object representing this node.
     * @param {array} oldItems The array of previously created items.
     * @param {number} compStartTime The start time (in ms) of this component.
     * @param {number} compEndTime The end time (in ms) of this component.
     * @return {DvtBaseTreeNode} The resulting tree component node.
     * @private
     */
    _parseDataNode(timeline, seriesIndex, data, oldItems, compStartTime, compEndTime) {
      var treeNodes = [];
      var series = timeline._series[seriesIndex];
      if (data) {
        for (var i = 0; i < data.length; i++) {
          // parse the attributes and create the node
          var props = this.ParseNodeAttributes(data[i], compStartTime, compEndTime);
          if (props) {
            if (series._allowUpdates) {
              var item = this._findExistingItem(props, oldItems);
              if (item) {
                var index = oldItems.indexOf(item);
                oldItems.splice(index, 1);
                item.setSpacing(null);
                item.setDurationLevel(null);
                item.setLoc(null);
                item.setSelected(false);
                item.setStartTime(props.startTime);
                item.setEndTime(props.endTime);
                item.setStyle(props.style);
                item.setData(props.data);
                item.setBackground(props.background);
              } else {
                item = new DvtTimelineSeriesNode(timeline, seriesIndex, props);
                item.setSelectable(true);
              }
            } else {
              item = new DvtTimelineSeriesNode(timeline, seriesIndex, props);
              item.setSelectable(true);
            }
            var startTime = item.getStartTime();
            var add = true;
            for (var j = 0; j < treeNodes.length; j++) {
              // ensure items are sorted in ascending order
              if (startTime < treeNodes[j].getStartTime()) {
                treeNodes.splice(j, 0, item);
                add = false;
                break;
              }
            }
            if (add) treeNodes.push(item);
          }
          // TODO: warn user of invalid data if prop is null
        }
      }
      return treeNodes;
    }

    _findExistingItem(props, items) {
      if (items) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (
            dvt.Obj.compareValues(this._context, props.id, item.getId()) &&
            props.title === item.getTitle() &&
            props.desc === item.getDescription() &&
            props.thumbnail === item.getThumbnail()
          )
            return item;
        }
      }
      return null;
    }

    getDate(date) {
      if (date == null) return null;
      else if (date.getTime)
        // check function reference
        return date.getTime();
      else if (!isNaN(date)) return date;
      else return new Date(date).getTime() + 0 * 60 * 60 * 1000; // for twitter, replace 0 with 5
    }

    /**
     * Parses the attributes on a tree node.
     * @param {object} data The data object defining the tree node
     * @param {number} compStartTime The start time (in ms) of this component.
     * @param {number} compEndTime The end time (in ms) of this component.
     * @return {object} An object containing the parsed properties
     * @protected
     */
    ParseNodeAttributes(data, compStartTime, compEndTime) {
      // The object that will be populated with parsed values and returned
      var ret = new Object();

      ret.id = data['id'];
      ret.rowKey = ret.id;

      ret.startTime = this.getDate(data['start']);
      ret.endTime = this.getDate(data['end']);

      // only return an object if at least part of the event is visible
      var checkTime = ret.endTime ? ret.endTime : ret.startTime;
      if (checkTime < compStartTime || ret.startTime > compEndTime) return null;

      ret.title = data['title'];
      ret.desc = data['description'];
      ret.thumbnail = data['thumbnail'];
      ret.shortDesc = data['shortDesc'];
      ret.background = data['background'];

      ret.data = data;
      ret.style = data['style'];
      if (data['svgStyle']) ret.style = data['svgStyle'];
      ret.durationFillColor = data['durationFillColor'];

      //custom marker handling (for ADF)
      ret.markerShape = data['_markerShape'];
      ret.markerScaleX = data['_markerScaleX'];
      ret.markerScaleY = data['_markerScaleY'];
      ret.markerShortDesc = data['_markerShortDesc'];
      ret.markerFillColor = data['_markerFillColor'];
      ret.markerGradientFill = data['_markerGradientFill'];
      ret.markerOpacity = data['_markerOpacity'];
      if (data['_markerSD'] != null && !data['_markerSD']) ret.markerSD = 'false';
      else ret.markerSD = 'true';

      ret.data = data;

      return ret;
    }
  }

  /**
   * Renderer for DvtTimelineSeries.
   * @class
   */
  const DvtTimelineSeriesRenderer = {
    /**
     * Renders a timeline series.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @param {number} width The width of the series.
     * @param {number} height The height of the series.
     */
    renderSeries: (series, width, height) => {
      DvtTimelineSeriesRenderer._renderBackground(series, width, height);
      DvtTimelineSeriesRenderer._renderScrollableCanvas(series);
      DvtTimelineSeriesRenderer._renderReferenceObjects(series, series._canvas);
      DvtTimelineSeriesRenderer._renderSeriesTicks(series);

      if (series._items == null) return;

      if (series._blocks.length === 0) {
        var context = series.getCtx();

        var block = new dvt.Container(
          context,
          'g',
          'itemBlock_' + series._fetchStartPos + '_' + series._fetchEndPos
        );
        block.startPos = series._fetchStartPos;
        block.endPos = series._fetchEndPos;

        var feelerBlock = new dvt.Container(context, 'g', 'feelers');
        block.addChild(feelerBlock);
        block.feelers = feelerBlock;

        var durationBlock = new dvt.Container(context, 'g', 'durations');
        block.addChild(durationBlock);
        block.durations = durationBlock;

        series._canvas.addChild(block);
        series._blocks.push(block);
      } else block = series._blocks[0];

      if (series._isInitialRender) {
        if (series._isIRAnimationEnabled) series._frAnimationElems = [];
        else series._frAnimationElems = null;
        series._mvAnimator = null;
        series._rmAnimationElems = null;
      } else {
        if (series._allowUpdates && series._isDCAnimationEnabled) {
          series._frAnimationElems = [];
          series._mvAnimator = new dvt.Animator(
            series.getCtx(),
            DvtTimelineStyleUtils.getAnimationDuration(series.Options),
            0,
            dvt.Easing.cubicInOut
          );
          series._rmAnimationElems = [];
        } else {
          series._frAnimationElems = null;
          series._mvAnimator = null;
          series._rmAnimationElems = null;
        }
      }
      series._hasMvAnimations = false;

      series.prepareDurations();
      series.prepareItems(series._items, series._mvAnimator);

      //make sure to take overflow into consideration
      var overflowOffset = Math.max(0, series._maxOverflowValue - series._size);
      series._overflowOffset = overflowOffset;
      DvtTimelineSeriesRenderer._adjustBackground(series, overflowOffset);

      if (series._oldItems)
        DvtTimelineSeriesRenderer._removeItems(
          series._oldItems,
          series,
          block,
          series._rmAnimationElems
        );
      series._oldItems = null;

      if (series.isVertical()) block.feelers.removeChildren();

      DvtTimelineSeriesRenderer._renderItems(
        series._items,
        series,
        block,
        series._fetchStartPos,
        series._fetchEndPos,
        overflowOffset,
        series._frAnimationElems,
        series._mvAnimator
      );
      if (series._callbackObj.SelectionHandler)
        block.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

      //todo: make these update call unnecessary.... although not sure how to put them behind items...
      DvtTimelineSeriesRenderer._updateReferenceObjects(series);
      DvtTimelineSeriesRenderer._updateSeriesTicks(series);
      DvtTimelineSeriesRenderer._updateMinorSeriesTicks(series);
    },

    /**
     * Updates the size and positioning of a timeline series for zooming.
     * @param {DvtTimelineSeries} series The series being updated.
     */
    updateSeriesForZoom: (series) => {
      DvtTimelineSeriesRenderer._updateItemsForZoom(series._items, series);
      DvtTimelineSeriesRenderer._updateReferenceObjects(series);
      DvtTimelineSeriesRenderer._updateSeriesTicks(series);
      DvtTimelineSeriesRenderer._updateMinorSeriesTicks(series);
    },

    /**
     * Renders the background of a timeline series.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @param {number} width The width of the series.
     * @param {number} height The height of the series.
     * @private
     */
    _renderBackground: (series, width, height) => {
      if (series._background) {
        var addBackground = false;
        series._background.setWidth(width);
        series._background.setHeight(height);
      } else {
        addBackground = true;
        series._background = new dvt.Rect(series.getCtx(), 0, 0, width, height, 'bg');
      }
      series._background.setCSSStyle(series._style);
      series._background.setPixelHinting(true);

      if (addBackground) series.addChild(series._background);
    },

    /**
     * Adjusts the size and positioning of the background of a timeline series.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @param {number} overflowOffset The amount of overflow.
     * @private
     */
    _adjustBackground: (series, overflowOffset) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      if (overflowOffset > 0) {
        if (series.isVertical()) series._background.setWidth(series._maxOverflowValue);
        else series._background.setHeight(series._maxOverflowValue);
      }

      if (series.isVertical()) {
        if ((!series.isInverted() && !isRTL) || (series.isInverted() && isRTL)) {
          // Reset translateY
          series._background.setTranslateY(0);

          series._background.setTranslateX(-overflowOffset);
          series.setHScrollPos(overflowOffset);
        }
      } else if (!series.isInverted()) {
        // Reset translateX
        series._background.setTranslateX(0);

        series._background.setTranslateY(-overflowOffset);
        series.setVScrollPos(overflowOffset);
      }
    },

    /**
     * Renders the scrollable canvas of a timeline series.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @private
     */
    _renderScrollableCanvas: (series) => {
      if (series._canvas) {
        series._canvasOffsetX = series._canvas.getTranslateX();
        series._canvasOffsetY = series._canvas.getTranslateY();
        series._canvas.setTranslateX(series._offset);
        series._canvas.setTranslateY(0);
        return;
      }
      series._canvas = new dvt.Container(series.getCtx(), 'g', 'canvas');
      series._canvas.setTranslateX(series._offset);
      series.addChild(series._canvas);
    },

    /**
     * Renders the items of a timeline series.
     * @param {Array<DvtTimelineSeriesItem>} items The items to be rendered.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {number} startPos The start position for rendering.
     * @param {number} endPos The end position for rendering.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} frAnimationElems The animator.
     * @param {type} mvAnimator The animator.
     * @private
     */
    _renderItems: (
      items,
      series,
      container,
      startPos,
      endPos,
      overflowOffset,
      frAnimationElems,
      mvAnimator
    ) => {
      var item;
      for (var i = 0; i < items.length; i++) {
        item = items[i];
        var loc = item._timeline.getDatePos(item.getStartTime());
        if (loc >= startPos && loc <= endPos)
          DvtTimelineSeriesItemRenderer.renderItem(
            item,
            series,
            container,
            overflowOffset,
            frAnimationElems,
            mvAnimator
          );
      }

      if (ojtimeaxisToolkit.TimeAxisUtils.supportsTouch()) {
        for (var j = 0; j < items.length - 1; j++) {
          item = items[j];
          var itemBubble = item.getBubble();
          if (itemBubble) {
            var next = items[j + 1];
            var nextBubble = next.getBubble();
            if (nextBubble) itemBubble._setAriaProperty('flowto', '_bt_' + next.getId());
            else break;
          }
        }
      }
      DvtTimelineSeriesRenderer._renderDurations(
        items,
        series,
        container,
        overflowOffset,
        frAnimationElems,
        mvAnimator
      );
    },

    /**
     * Updates the size and positioning of the items of a timeline series for zooming.
     * @param {Array<DvtTimelineSeriesItem>} items The items to be updated.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @private
     */
    _updateItemsForZoom: (items, series) => {
      var item, i;
      if (items == null || items.length === 0) return;

      var startPos = series._fetchStartPos;
      var endPos = series._fetchEndPos;
      // only one block for now
      var block = series._blocks[0];
      block.startPos = startPos;
      block.endPos = endPos;

      if (series.isVertical())
        series._initialSpacing =
          20 * (series._maxDurationSize > 0 ? 1 : 0) +
          DvtTimelineStyleUtils.getBubbleSpacing() +
          10 * series._maxDurationSize;
      else
        series._initialSpacing =
          20 + DvtTimelineStyleUtils.getBubbleSpacing() + 10 * series._maxDurationSize;

      for (i = 0; i < items.length; i++) {
        item = items[i];
        var startTime = item.getStartTime();
        var loc = item._timeline.getDatePos(startTime);
        // offset position if a duration bar is rendered as well
        var endTime = item.getEndTime();
        if (endTime && endTime !== startTime) {
          var span = item._timeline.getDatePos(endTime) - loc;
          loc = loc + Math.min(DvtTimelineStyleUtils.getDurationFeelerOffset(), span / 2);
        }
        item.setLoc(loc);
        if (!series._isRandomItemLayout) item.setSpacing(null);
      }
      for (i = 0; i < items.length; i++) {
        item = items[i];
        var itemTime = item.getStartTime();
        if (itemTime >= series._start && itemTime <= series._end)
          DvtTimelineSeriesItemRenderer._updateBubble(item, series, i);
      }
      var overflowOffset = Math.max(0, series._maxOverflowValue - series._size);
      DvtTimelineSeriesRenderer._adjustBackground(series, overflowOffset);

      for (i = 0; i < items.length; i++) {
        item = items[i];
        DvtTimelineSeriesItemRenderer._displayBubble(item, series, overflowOffset, null, false);
        DvtTimelineSeriesItemRenderer._updateFeeler(item, series, overflowOffset, null);
        DvtTimelineSeriesItemRenderer._updateDuration(item, series, overflowOffset, null);
      }
    },

    /**
     * Renders the item durations of a timeline series.
     * @param {Array<DvtTimelineSeriesItem>} items The items to be rendered.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {number} overflowOffset The amount of overflow.
     * @param {type} frAnimationElems The animator.
     * @param {type} mvAnimator The animator.
     * @private
     */
    _renderDurations: (items, series, container, overflowOffset, frAnimationElems, mvAnimator) => {
      var durationBlock = container.durations;
      for (var i = series._maxDurationSize; i > 0; i--) {
        for (var j = 0; j < items.length; j++) {
          var item = items[j];
          var startTime = item.getStartTime();
          var endTime = item.getEndTime();
          // Hide duration event if duration-event mode
          if (
            endTime &&
            endTime !== startTime &&
            i === item.getDurationLevel() &&
            item.getItemType() === DvtTimelineSeriesNode.DURATION_BAR
          )
            DvtTimelineSeriesItemRenderer.renderDuration(
              item,
              series,
              durationBlock,
              overflowOffset,
              frAnimationElems,
              mvAnimator
            );
        }
      }
    },

    /**
     * Renders the major time axis intervals of a timeline series.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @private
     */
    _renderSeriesTicks: (series) => {
      if (series._seriesTicks == null) {
        series._seriesTicks = new dvt.Container(series.getCtx());
        series._seriesMinorTicks = new dvt.Container(series.getCtx());
        series._callbackObj._timeZoomCanvas.addChild(series._seriesTicks);
        series._canvas.addChild(series._seriesMinorTicks);
      } else {
        // remove all existing ticks and labels
        series._seriesTicks.removeChildren();
        series._seriesTicksArray = [];
        series._seriesMinorTicks.removeChildren();
        series._seriesMinorTicksArray = [];
      }
      var separatorStyle = new dvt.CSSStyle(DvtTimelineStyleUtils.getSeriesAxisSeparatorStyle());
      if (series._axisStyleDefaults) {
        var separatorColor = series._axisStyleDefaults['separatorColor'];
        if (separatorColor) separatorStyle.parseInlineStyle('color:' + separatorColor + ';');
      }
      series._separatorStroke = new dvt.Stroke(
        separatorStyle.getStyle(dvt.CSSStyle.COLOR),
        1,
        1,
        false,
        { dashArray: '3' }
      );
      series._majorSeparatorStroke = new dvt.Stroke(
        separatorStyle.getStyle(dvt.CSSStyle.COLOR),
        1,
        1,
        false,
        { dashArray: '0' }
      );

      if (series._scale && series._timeAxis) {
        DvtTimelineSeriesRenderer._renderSeriesTimeAxis(
          series,
          series._fetchStartPos,
          series._fetchEndPos,
          series._seriesTicks
        );
      }
      DvtTimelineSeriesRenderer._renderSeriesMinorTimeAxis(
        series,
        series._fetchStartPos,
        series._fetchEndPos,
        series._seriesMinorTicks
      );
    },

    /**
     * Updates the size and positioning of the major axis intervals of a timeline series.
     * @param {DvtTimelineSeries} series The series being updated.
     * @private
     */
    _updateSeriesTicks: (series) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var length = series._callbackObj.isDiscreteNavigationMode()
        ? series._callbackObj._discreteContentLength
        : series._length;
      var axisSize = series._callbackObj.getTimeAxisSize();

      for (var i = 0; i < series._seriesTicksArray.length; i++) {
        var tick = series._seriesTicksArray[i];
        var offset = series._callbackObj.getDiscreteOffset();
        if (!series.isVertical() && isRTL)
          var pos = length - series._callbackObj.getDatePos(tick.time) + offset;
        else pos = series._callbackObj.getDatePos(tick.time) + offset;
        if (series.isVertical()) {
          var verticalAdjustment = isRTL ? axisSize : 0;
          tick.setX1(verticalAdjustment);
          tick.setY1(pos);
          tick.setX2(series._maxOverflowValue + verticalAdjustment);
          tick.setY2(pos);
        } else {
          tick.setX1(pos);
          tick.setY1(series.Height - 2); // need 2 px to align major axis ticks and major axis ticks
          tick.setX2(pos);
          tick.setY2(series.Height + axisSize);
        }
      }
    },

    /**
     * Updates the size and positioning of the minor axis intervals of a timeline series.
     * @param {DvtTimelineSeries} series The series being updated.
     * @private
     */
    _updateMinorSeriesTicks: (series) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var axisSize = series._callbackObj.getTimeAxisSize();
      var axisAdjustment = series._callbackObj._seriesScale ? axisSize : 0;

      // don't render minor ticks if vertical
      if (series.isVertical()) {
        series._seriesMinorTicks.removeChildren();
        series._seriesMinorTicksArray = [];
        return;
      }

      if (DvtTimelineSeriesRenderer._minorTimeAxisScale !== series._callbackObj._timeAxis._scale) {
        // scale has changed so need to recalc ticks
        series._seriesMinorTicks.removeChildren();
        series._seriesMinorTicksArray = [];
        DvtTimelineSeriesRenderer._renderSeriesMinorTimeAxis(
          series,
          series._fetchStartPos,
          series._fetchEndPos,
          series._seriesMinorTicks
        );
      } else {
        for (var i = 0; i < series._seriesMinorTicksArray.length; i++) {
          var tick = series._seriesMinorTicksArray[i];
          if (!series.isVertical() && isRTL)
            var pos =
              series._length -
              ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(series._start, series._end, tick.time, series._length);
          else
            pos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
              series._start,
              series._end,
              tick.time,
              series._length
            );

          tick.setX1(pos);
          tick.setY1(0);
          tick.setX2(pos);
          tick.setY2(series._maxOverflowValue - axisAdjustment);
        }
      }
    },

    /**
     * Renders the minor axis of a timeline series.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @param {number} startPos The start position for rendering.
     * @param {number} endPos The end position for rendering.
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderSeriesMinorTimeAxis: (series, startPos, endPos, container) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var axisSize = series._callbackObj.getTimeAxisSize();
      var axisAdjustment = series._callbackObj._seriesScale ? axisSize : 0;

      // don't render minor axis ticks in vertical mode
      if (series.isVertical()) {
        return;
      }

      var dates;
      var start = series._start;
      var end = series._end;
      var minorTimeAxis = series._callbackObj._timeAxis;
      DvtTimelineSeriesRenderer._minorTimeAxisScale = minorTimeAxis._scale;
      dates = [];
      var startDate = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(start, end, startPos, series._length);
      var currentDate = minorTimeAxis.adjustDate(startDate);
      var currentPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(start, end, currentDate, series._length);
      dates.push(currentDate.getTime());
      while (currentPos < endPos) {
        currentDate = series._callbackObj._timeAxis.getNextDate(currentDate.getTime());
        currentPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(start, end, currentDate, series._length);
        dates.push(currentDate.getTime());
      }
      for (var i = 0; i < dates.length - 1; i++) {
        var currentTime = dates[i];
        currentPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(start, end, currentTime, series._length);
        if (!series.isVertical() && isRTL) var pos = series._length - currentPos;
        else pos = currentPos;

        var x1 = pos;
        var y1 = 0;
        var x2 = pos;
        var y2 = series._maxOverflowValue - axisAdjustment;

        if (
          DvtTimelineSeriesRenderer._majorTickDates != null &&
          DvtTimelineSeriesRenderer._majorTickDates.indexOf(currentTime) !== -1
        ) {
          // if major and minor ticks overlap, use the major dash
          var tickElem = series.addTick(
            container,
            x1,
            x2,
            y1,
            y2,
            series._majorSeparatorStroke,
            'o_minor_tick' + currentPos
          );
        } else {
          var tickElem = series.addTick(
            container,
            x1,
            x2,
            y1,
            y2,
            series._separatorStroke,
            'o_minor_tick' + currentPos
          );
        }
        // save the time associated with the element for dynamic resize
        tickElem.time = currentTime;
        series._seriesMinorTicksArray.push(tickElem);
      }
    },

    /**
     * Renders the major axis of a timeline series.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @param {number} startPos The start position for rendering.
     * @param {number} endPos The end position for rendering.
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderSeriesTimeAxis: (series, startPos, endPos, container) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var axisSize = series._callbackObj.getTimeAxisSize();
      var axisAdjustment = series._callbackObj._seriesScale ? axisSize : 0;

      var dates;
      var length = series._callbackObj.isDiscreteNavigationMode()
        ? series._callbackObj._discreteContentLength
        : series._length;

      if (series._customTimeScales && series._customTimeScales[series._scale]) {
        var customScale = series._customTimeScales[series._scale];
        dates = customScale['times'];
      } else if (series._customFormatScales && series._customFormatScales[series._scale]) {
        var customFormatScale = series._customFormatScales[series._scale];
        dates = customFormatScale['times'];
      } else {
        dates = [];
        var startDate = series._callbackObj.getPosDate(startPos);
        var currentDate = series._timeAxis.adjustDate(startDate);
        var currentPos = series._callbackObj.getDatePos(currentDate);
        dates.push(currentDate.getTime());
        while (currentPos < endPos) {
          currentDate = series._timeAxis.getNextDate(currentDate.getTime());
          currentPos = series._callbackObj.getDatePos(currentDate);
          dates.push(currentDate.getTime());
        }
      }
      DvtTimelineSeriesRenderer._majorTickDates = dates;
      for (var i = 0; i < dates.length - 1; i++) {
        var currentTime = dates[i];
        currentPos = series._callbackObj.getDatePos(currentTime);
        if (!series.isVertical() && isRTL) var pos = length - currentPos;
        else pos = currentPos;
        if (series.isVertical()) {
          var verticalAdjustment = isRTL ? axisSize : 0;
          var x1 = verticalAdjustment;
          var y1 = pos;
          var x2 = series._maxOverflowValue + verticalAdjustment;
          var y2 = pos;
        } else {
          x1 = pos;
          y1 = series.Height - 2; // need 2 px to match the major axis ticks and minor axis ticks
          x2 = pos;
          y2 = series.Height + axisAdjustment;
        }

        var tickElem = series.addTick(
          container,
          x1,
          x2,
          y1,
          y2,
          series._majorSeparatorStroke,
          'o_tick' + currentPos
        );
        // save the time associated with the element for dynamic resize
        tickElem.time = currentTime;
        series._seriesTicksArray.push(tickElem);
      }
    },

    /**
     * Renders the reference objects of a timeline series.
     * @param {DvtTimelineSeries} series The series being rendered.
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderReferenceObjects: (series, container) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var length = series._callbackObj.isDiscreteNavigationMode()
        ? series._callbackObj._discreteContentLength
        : series._length;
      var axisSize = series._callbackObj.getTimeAxisSize();
      var axisAdjustment = series._callbackObj._seriesScale ? axisSize : 0;

      if (series._refObjectsContainer == null) {
        series._refObjectsContainer = new dvt.Container(context);
        container.addChild(series._refObjectsContainer);
      }
      series._refObjectsContainer.removeChildren();
      var referenceObjects = series._referenceObjects;
      if (referenceObjects) {
        var maxRefObjects = referenceObjects.length;
        for (var i = 0; i < maxRefObjects; i++) {
          var refObject = referenceObjects[i];
          if (refObject) {
            var pos = series._callbackObj.getDatePos(refObject);
            if (series.isVertical())
              var ref = new dvt.Line(context, 0, pos, series._maxOverflowValue, pos, 'zoomOrder[i]');
            else {
              if (isRTL) pos = length - pos;
              ref = new dvt.Line(context, pos, 0, pos, series._maxOverflowValue, 'zoomOrder[i]');
            }
            var referenceObjectStroke = new dvt.Stroke(
              DvtTimelineStyleUtils.getReferenceObjectColor(series.Options)
            );
            ref.setStroke(referenceObjectStroke);
            ref.setPixelHinting(true);
            ref.date = refObject;
            series._refObjectsContainer.addChild(ref);
            series._renderedReferenceObjects[i] = ref;
          }
        }
      }
    },

    /**
     * Updates the size and positioning of the reference objects of a timeline series.
     * @param {DvtTimelineSeries} series The series being udpated.
     * @private
     */
    _updateReferenceObjects: (series) => {
      var context = series.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var length = series._callbackObj.isDiscreteNavigationMode()
        ? series._callbackObj._discreteContentLength
        : series._length;
      var axisSize = series._callbackObj.getTimeAxisSize();
      var axisAdjustment = series._callbackObj._seriesScale ? axisSize : 0;

      for (var i = 0; i < series._renderedReferenceObjects.length; i++) {
        var ref = series._renderedReferenceObjects[i];
        var pos = series._callbackObj.getDatePos(ref.date);
        if (series.isVertical()) {
          ref.setX1(0);
          ref.setY1(pos);
          ref.setX2(series._maxOverflowValue);
          ref.setY2(pos);
        } else {
          if (isRTL) pos = length - pos;

          ref.setX1(pos);
          ref.setY1(0);
          ref.setX2(pos);
          ref.setY2(series._maxOverflowValue - axisAdjustment);
        }
      }
    },

    /**
     * Removes the specified items from a timeline series.
     * @param {type} items The items to be removed.
     * @param {DvtTimelineSeries} series The series being updated.
     * @param {dvt.Container} container The container to remove the items from.
     * @param {type} animationElems An array of elements corresponding to items.
     * @private
     */
    _removeItems: (items, series, container, animationElems) => {
      if (animationElems) {
        DvtTimelineSeriesRenderer._animateItemRemoval(items, series, animationElems);
        return;
      }
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var bubble = item.getBubble();
        container.removeChild(bubble);

        if (!series.isVertical() && item._timeline.isFeelerEnabled()) {
          var feelerBlock = container.feelers;
          var feeler = item.getFeeler();
          feelerBlock.removeChild(feeler);
        }

        var startTime = item.getStartTime();
        var endTime = item.getEndTime();
        if (endTime && endTime !== startTime) {
          var durationBlock = container.durations;
          var durationBar = item.getDurationBar();
          durationBlock.removeChild(durationBar);
        }
      }
    },

    /**
     * Animates item removal.
     * @param {type} items
     * @param {type} series
     * @param {type} animationElems
     * @private
     */
    _animateItemRemoval: (items, series, animationElems) => {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var bubble = item.getBubble();
        if (!series.isVertical())
          bubble.setTranslateY(
            bubble.getTranslateY() + series._canvasOffsetY + series._overflowOffset
          );
        else
          bubble.setTranslateX(
            bubble.getTranslateX() + series._canvasOffsetX + series._overflowOffset
          );
        animationElems.push(bubble);

        if (!series.isVertical() && item._timeline.isFeelerEnabled()) {
          var feeler = item.getFeeler();
          feeler.setTranslateY(
            feeler.getTranslateY() + series._canvasOffsetY + series._overflowOffset
          );
          animationElems.push(feeler);
        }

        var startTime = item.getStartTime();
        var endTime = item.getEndTime();
        if (
          endTime &&
          endTime !== startTime &&
          item.getItemType() === DvtTimelineSeriesNode.DURATION_BAR
        ) {
          var durationBar = item.getDurationBar();
          if (!series.isVertical())
            durationBar.setTranslateY(
              durationBar.getTranslateY() + series._canvasOffsetY + series._overflowOffset
            );
          else
            durationBar.setTranslateX(
              durationBar.getTranslateX() + series._canvasOffsetX + series._overflowOffset
            );
          animationElems.push(durationBar);
        }
      }
    }
  };

  /**
   * TimelineSeries component.
   * @param {dvt.Context} context The rendering context.
   * @param {object} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @class TimelineSeries component.
   * @constructor
   * @extends {dvt.BaseComponent}
   */
  class DvtTimelineSeries extends dvt.BaseComponent {
    constructor(context, callback, callbackObj) {
      super(context);
      this._callback = callback;
      this._callbackObj = callbackObj;

      this._blocks = [];
      this._renderedReferenceObjects = [];
      this._seriesTicksArray = [];
      this._seriesMinorTicksArray = [];
    }

    /**
     * Starts the animations.
     */
    triggerAnimations() {
      var context = this.getCtx();
      if (this._rmAnimationElems && this._rmAnimationElems.length !== 0) {
        // Disable event listeners temporarily
        this._callbackObj.EventManager.removeListeners(this._callbackObj);
        var fadeOutAnimator = new dvt.ParallelPlayable(
          context,
          new dvt.AnimFadeOut(
            context,
            this._rmAnimationElems,
            DvtTimelineStyleUtils.getAnimationDuration(this.Options)
          )
        );
        dvt.Playable.appendOnEnd(fadeOutAnimator, this._onRmAnimationEnd, this);
        this._callbackObj.Animation = fadeOutAnimator;
        fadeOutAnimator.play();
      } else if (this._mvAnimator && this._hasMvAnimations) {
        // Disable event listeners temporarily
        this._callbackObj.EventManager.removeListeners(this._callbackObj);
        dvt.Playable.appendOnEnd(this._mvAnimator, this._onMvAnimationEnd, this);
        this._callbackObj.Animation = this._mvAnimator;
        this._mvAnimator.play();
      } else if (this._frAnimationElems && this._frAnimationElems.length !== 0) {
        // Disable event listeners temporarily
        this._callbackObj.EventManager.removeListeners(this._callbackObj);
        var fadeInAnimator = new dvt.ParallelPlayable(
          context,
          new dvt.AnimFadeIn(
            context,
            this._frAnimationElems,
            DvtTimelineStyleUtils.getAnimationDuration(this.Options),
            this._isInitialRender ? 0 : 0
          )
        ); //0.8 : 0));
        dvt.Playable.appendOnEnd(fadeInAnimator, this._onAnimationEnd, this);
        this._callbackObj.Animation = fadeInAnimator;
        fadeInAnimator.play();
      }
    }

    /**
     * Handler for the end of removal animations.
     * @private
     */
    _onRmAnimationEnd() {
      for (var i = 0; i < this._rmAnimationElems.length; i++) {
        var elem = this._rmAnimationElems[i];
        var parent = elem.getParent();
        if (parent) parent.removeChild(elem);
      }
      if (this._mvAnimator && this._hasMvAnimations) {
        this._callbackObj.Animation = this._mvAnimator;
        dvt.Playable.appendOnEnd(this._mvAnimator, this._onMvAnimationEnd, this);
        this._mvAnimator.play();
      } else this._onMvAnimationEnd();
    }

    /**
     * Handler for the end of moving animations.
     * @private
     */
    _onMvAnimationEnd() {
      if (this._frAnimationElems && this._frAnimationElems.length !== 0) {
        var fadeInAnimator = new dvt.ParallelPlayable(
          this.getCtx(),
          new dvt.AnimFadeIn(
            this.getCtx(),
            this._frAnimationElems,
            DvtTimelineStyleUtils.getAnimationDuration(this.Options),
            this._isInitialRender ? 0 : 0
          )
        ); //0.8 : 0));
        dvt.Playable.appendOnEnd(fadeInAnimator, this._onAnimationEnd, this);
        this._callbackObj.Animation = fadeInAnimator;
        fadeInAnimator.play();
      } else this._onAnimationEnd();
    }

    /**
     * Handler for the end of new item animations.
     * @private
     */
    _onAnimationEnd() {
      this._callbackObj.onAnimationEnd();
    }

    /**
     * Renders the component with the specified data.  If no data is supplied to a component
     * that has already been rendered, the component will be rerendered to the specified size.
     * @param {object} options The json object.
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     */
    render(options, width, height) {
      if (options) this.SetOptions(options);
      else {
        this._handleResize(width, height);
        return;
      }

      if (this.Width) this._isInitialRender = false;
      else this._isInitialRender = true;

      // Store the size
      this.Width = width;
      this.Height = height;

      var orientation = this.Options['orientation'];
      if (orientation && orientation === 'vertical') {
        if (!this._isVertical) this._allowUpdates = false;
        else this._allowUpdates = true;

        this._isVertical = true;
      } else {
        if (this._isVertical) this._allowUpdates = false;
        else this._allowUpdates = true;

        this._isVertical = false;
      }
      if (this.Options) {
        var props = this.Parse(this.Options);
        this._applyParsedProperties(props);
      }

      this._fetchStartPos = 0;
      if (this._isVertical) {
        this._fetchEndPos = height;
        this._maxOverflowValue = width;
        this._length = height;
        this._size = width;
        this._offset = 0;
      } else {
        this._maxOverflowValue = height;
        // need to adjust for nav arrows
        if (this._callbackObj.isDiscreteNavigationMode()) {
          this._offset = this._callbackObj._discreteOffset;
          this._length = width - 2 * this._offset;
          this._fetchEndPos = width - 2 * this._offset;
        } else {
          this._length = width;
          this._fetchEndPos = width;
          this._offset = 0;
        }
        this._size = height;
      }

      this._isInverted = this.Options['inverted'];
      this._colorCount = 0;
      this._maxDurationSize = 0;

      DvtTimelineSeriesRenderer.renderSeries(this, width, height);

      if (ojtimeaxisToolkit.TimeAxisUtils.supportsTouch()) {
        if (this._items.length > 0) this._setAriaProperty('flowto', '_bt_' + this._items[0].getId());
      }

      // Apply 'Series' label for accessibility
      var desc = this.GetComponentDescription();
      if (desc) {
        dvt.ToolkitUtils.setAttrNullNS(this.getElem(), 'role', 'group');
        dvt.ToolkitUtils.setAttrNullNS(
          this.getElem(),
          'aria-label',
          dvt.AriaUtils.processAriaLabel(desc)
        );
      }
    }

    /**
     * @override
     */
    GetComponentDescription() {
      var translations = this.Options.translations;
      var seriesDescArray = [translations.labelSeries];
      // Use series label if set, otherwise use series index value
      if (this._label) seriesDescArray.push(this._label);
      else seriesDescArray.push(this.Options['index'] + 1);
      return dvt.ResourceUtils.format(translations.labelAndValue, seriesDescArray);
    }

    /**
     * Resizes the series to match the specified height and width.
     * @param {number} width The new width of the series.
     * @param {number} height The new Height of the series.
     * @private
     */
    _handleResize(width, height) {
      this._canvas.setTranslateY(0);
      if (!this._callbackObj.isDiscreteNavigationMode()) {
        this._canvas.setTranslateX(0);
      }
      this.Width = width;
      this.Height = height;

      this._fetchStartPos = 0;
      if (this._isVertical) {
        this._fetchEndPos = height;
        this._maxOverflowValue = width;
        this._length = height;
        this._size = width;
        this._offset = 0;
      } else {
        this._maxOverflowValue = height;
        // need to adjust for nav arrows
        if (this._callbackObj.isDiscreteNavigationMode()) {
          this._offset = this._callbackObj._discreteOffset;
          this._length = width - 2 * this._offset;
          this._fetchEndPos = width - 2 * this._offset;
          this._canvas.setTranslateX(this._offset);
        } else {
          this._length = width;
          this._fetchEndPos = width;
          this._offset = 0;
        }
        this._size = height;
      }

      this._background.setWidth(width);
      this._background.setHeight(height);

      DvtTimelineSeriesRenderer.updateSeriesForZoom(this);

      if (this._callbackObj.getEventManager()._isDndDragging) {
        // update feedbacks if items being dragged
        this._callbackObj.getEventManager().updateDnd();
      }
    }

    /**
     * Combines style defaults with the styles provided
     */
    applyStyleValues() {
      this._style = new dvt.CSSStyle(DvtTimelineStyleUtils.getSeriesStyle());
      this._seriesStyleDefaults = this.Options['seriesStyleDefaults'];
      this._axisStyleDefaults = this.Options['axisStyleDefaults'];
      this._colors = DvtTimelineStyleUtils.getColorsArray(this.Options);
      this._referenceObjects = this.Options['referenceObjects'];

      if (this._seriesStyleDefaults) {
        var style = this._seriesStyleDefaults['backgroundColor'];
        if (style) this._style.parseInlineStyle('background-color:' + style + ';');
      }
      this._style.parseInlineStyle(this._inlineStyle);
    }

    /**
     * @override
     */
    SetOptions(options) {
      this.Options = options;
    }

    /**
     * Parses the data options describing the component.
     * @param {object} options The data options object.
     * @protected
     */
    Parse(options) {
      this._parser = new DvtTimelineSeriesParser(this.getCtx());
      return this._parser.parse(options, this._items);
    }

    /**
     * Applies the parsed properties to this component.
     * @param {object} props An object containing the parsed properties for this component.
     * @private
     */
    _applyParsedProperties(props) {
      if (this._items) this._oldItems = this._items;
      this._items = props.items;
      if (this._items && this._items.length > 0) this._isEmpty = false;
      else this._isEmpty = true;

      this._isIRAnimationEnabled = props.isIRAnimationEnabled;
      this._isDCAnimationEnabled = props.isDCAnimationEnabled;

      this._label = props.label;
      this._timeAxis = props.timeAxis;
      this._emptyText = props.emptyText;
      if (this._emptyText == null) this._emptyText = this.Options.translations.labelNoData;

      this._isTopToBottom = props.isTopToBottom;
      this._isRandomItemLayout = props.isRandomItemLayout;
      this._customTimeScales = props.customTimeScales;
      this._customFormatScales = props.customFormatScales;

      this._start = props.start;
      this._end = props.end;

      this._inlineStyle = props.inlineStyle;

      this._scale = props.scale;
      this._converter = props.converter;

      this._data = props.data;

      this.applyStyleValues();
    }

    /**
     * Calculates the height value for the item given.
     * @protected
     */
    calculateSpacing(item, index) {
      var i, currItem, currWidth;
      if (this._items == null || this._items.length === 0) return null;

      var maxOverflowValue = this._maxOverflowValue;
      var y = item.getSpacing();
      if (this._isRandomItemLayout) {
        if (y == null) {
          var itemHeight = item.getHeight();
          var bottom = this._initialSpacing;
          var top = this._maxOverflowValue - itemHeight - bottom;
          // If not enough room, default to return bottom value
          if (top < 0) top = 0;
          y = Math.round(Math.random() * top) + bottom; //@RandomNumberOK

          if (this._maxOverflowValue < y + itemHeight)
            this._maxOverflowValue = y + itemHeight + DvtTimelineStyleUtils.getBubbleSpacing();
        }
        return y;
      }

      if (y == null) y = this._initialSpacing;

      if (!this._isVertical) {
        var endViewportCollisionOffset = item.getEndViewportCollision() ? item.getContentWidth() : 0;
        var x = item.getLoc() - endViewportCollisionOffset;
        var width = item.getWidth() + 16;
        var hOffset = DvtTimelineStyleUtils.getBubbleSpacing();
        var overlappingItems = [];
        for (i = 0; i < index; i++) {
          currItem = this._items[i];
          currWidth = currItem.getWidth() + 16;
          endViewportCollisionOffset = currItem.getEndViewportCollision()
            ? currItem.getContentWidth()
            : 0;
          var currX = currItem.getLoc() - endViewportCollisionOffset;

          if ((x >= currX && x <= currX + currWidth) || (currX >= x && currX <= x + width))
            overlappingItems.push(currItem);
        }
        for (i = 0; i < overlappingItems.length; i++) {
          var yChanged = false;
          for (var j = 0; j < overlappingItems.length; j++) {
            currItem = overlappingItems[j];
            var currHeight = currItem.getHeight();
            var currY = currItem.getSpacing();

            if (y >= currY && y <= currY + currHeight) {
              y = currY + currHeight + hOffset;
              // y changed, do the loop again
              item.setSpacing(y);
              yChanged = true;
              break;
            }
          }
          if (!yChanged) break;
        }
        if (maxOverflowValue < y + currHeight) maxOverflowValue = y + currHeight;
      } else {
        for (i = 0; i < index; i++) {
          currItem = this._items[i];
          currWidth = currItem.getWidth() + 10;
          if (maxOverflowValue < y + currWidth) maxOverflowValue = y + currWidth;
        }
      }

      if (maxOverflowValue > this._maxOverflowValue)
        this._maxOverflowValue = maxOverflowValue + DvtTimelineStyleUtils.getBubbleSpacing();

      return y;
    }

    /**
     * Calculates the duration height value for the item given.
     * @protected
     */
    calculateDurationSize(item, index) {
      var i, currItem;
      // if not in duration-bar, skip this step
      if (this._items == null || this._items.length === 0 || item.getItemType() !== 'duration-bar')
        return null;

      var initialY = 1;
      var startTime = item.getStartTime();
      var endTime = item.getEndTime();
      if (!endTime || endTime === startTime) return null;

      var y = item.getDurationLevel();
      if (y == null) y = initialY;

      var overlappingItems = [];
      for (i = 0; i < index; i++) {
        currItem = this._items[i];
        var currStartTime = currItem.getStartTime();
        var currEndTime = currItem.getEndTime();
        if (
          currEndTime &&
          currEndTime !== currStartTime &&
          startTime >= currStartTime &&
          startTime <= currEndTime
        )
          overlappingItems.push(currItem);
      }
      for (i = 0; i < overlappingItems.length; i++) {
        var yChanged = false;
        for (var j = 0; j < overlappingItems.length; j++) {
          currItem = overlappingItems[j];
          var currY = currItem.getDurationLevel();
          if (y === currY) {
            y = currY + 1;
            // y changed, do the loop again
            item.setDurationLevel(y);
            yChanged = true;
            break;
          }
        }
        if (!yChanged) break;
      }
      if (y > this._maxDurationSize) this._maxDurationSize = y;
      return y;
    }

    /**
     * Prepares the duration bars for rendering.
     * @protected
     */
    prepareDurations() {
      for (var i = 0; i < this._items.length; i++) {
        var node = this._items[i];
        var startTime = node.getStartTime();
        var endTime = node.getEndTime();
        if (endTime && endTime !== startTime) {
          node.setDurationLevel(this.calculateDurationSize(node, i));
          node.setDurationSize(22 + 10 * node.getDurationLevel() - 5);
          if (node.getDurationFillColor() == null) {
            node.setDurationFillColor(this._colors[this._colorCount]);
            this._colorCount++;
            if (this._colorCount === this._colors.length) this._colorCount = 0;
          }
        }
      }
    }

    /**
     * Prepares the items for rendering.
     * @param {Array<DvtTimelineSeriesItem>} items The items to be prepared.
     * @param {type} mvAnimator optional animator.
     */
    prepareItems(items, mvAnimator) {
      var i, item, loc;
      if (this.isVertical())
        this._initialSpacing =
          20 * (this._maxDurationSize > 0 ? 1 : 0) +
          DvtTimelineStyleUtils.getBubbleSpacing() +
          10 * this._maxDurationSize;
      else
        this._initialSpacing =
          20 + DvtTimelineStyleUtils.getBubbleSpacing() + 10 * this._maxDurationSize;

      for (i = 0; i < items.length; i++) {
        item = items[i];
        loc = this._callbackObj.getDatePos(item.getStartTime());
        // offset position if a duration bar is rendered as well
        var endTime = item.getEndTime();
        if (endTime && endTime !== item.getStartTime()) {
          var span = this._callbackObj.getDatePos(endTime) - loc;
          // don't adjust if duration-event
          if (item.getItemType() !== DvtTimelineSeriesNode.DURATION_EVENT) {
            loc = loc + Math.min(DvtTimelineStyleUtils.getDurationFeelerOffset(), span / 2);
          }
        }
        item.setLoc(loc);
      }

      for (i = 0; i < this._items.length; i++) {
        item = this._items[i];
        loc = this._callbackObj.getDatePos(item.getStartTime());
        if (loc >= this._fetchStartPos && loc <= this._fetchEndPos)
          DvtTimelineSeriesItemRenderer.initializeItem(item, this, i, mvAnimator);
      }
    }

    /**
     * Gets the data associated with this series
     * @param {boolean} isPublic Whether to retrieve a cleaned version of the data that would be publicly exposed
     * @return {Object} the data object
     */
    getData(isPublic) {
      if (isPublic) {
        var publicData = {
          emptyText: this._data.emptyText,
          id: this._data.id,
          itemLayout: this._data.itemLayout,
          label: this._data.label,
          svgStyle: this._data.svgStyle,
          items: this._data.items
        };
        return ojdvtTimecomponent.TimeComponent.sanitizeData(publicData, 'series');
      }
      return this._data;
    }

    getLabel() {
      return this._label;
    }

    getEmptyText() {
      return this._emptyText;
    }

    findItem(itemId) {
      if (this._items != null) {
        for (var i = 0; i < this._items.length; i++) {
          var item = this._items[i];
          if (dvt.Obj.compareValues(this.getCtx(), item.getId(), itemId)) return item;
        }
      }
      return null;
    }

    isInverted() {
      return this._isInverted;
    }

    isTopToBottom() {
      return this._isTopToBottom;
    }

    isVertical() {
      return this._isVertical;
    }

    addTick(container, x1, x2, y1, y2, stroke, id) {
      var line = new dvt.Line(this.getCtx(), x1, y1, x2, y2, id);
      line.setStroke(stroke);
      line.setPixelHinting(true);

      container.addChild(line);
      return line;
    }

    /////////////////// scrolling ////////////////////////////
    setVScrollPos(pos) {
      if (this._canvas != null) this._canvas.setTranslateY(0 - pos);
    }

    setHScrollPos(pos) {
      if (this._canvas != null) this._canvas.setTranslateX(this._offset - pos);
    }
  }

  /**
   * Timeline component.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @class
   * @constructor
   * @extends {TimeComponent}
   */
  class Timeline extends ojdvtTimecomponent.TimeComponent {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      // Create the defaults object
      this.Defaults = new DvtTimelineDefaults(context);

      // Create the event handler and add event listeners
      this.EventManager = new DvtTimelineEventManager(this);
      this.EventManager.addListeners(this);
      if (!dvt.Agent.isTouchDevice()) {
        this._keyboardHandler = new DvtTimelineKeyboardHandler(this.EventManager);
        this.EventManager.setKeyboardHandler(this._keyboardHandler);
      } else this._keyboardHandler = null;
    }

    Parse(options) {
      this._parser = new DvtTimelineParser();
      return this._parser.parse(options);
    }

    _applyParsedProperties(props) {
      var orientation = this.Options['orientation'];
      if (orientation && orientation === 'vertical') this._isVertical = true;
      else this._isVertical = false;

      this._viewportNavigationMode = this.Options['viewportNavigationMode'];
      this._hasOverview = props.hasOverview;
      this._viewStartTime = props.viewStart;
      this._viewEndTime = props.viewEnd;

      this._initialViewportTimeDuration = this._viewEndTime - this._viewStartTime;
      this._selectionMode = props.selectionMode;
      if (this._selectionMode === 'single')
        this.SelectionHandler = new dvt.SelectionHandler(
          this.getCtx(),
          dvt.SelectionHandler.TYPE_SINGLE
        );
      else if (this._selectionMode === 'multiple')
        this.SelectionHandler = new dvt.SelectionHandler(
          this.getCtx(),
          dvt.SelectionHandler.TYPE_MULTIPLE
        );
      else this.SelectionHandler = null;

      // Pass to event handler
      this.EventManager.setSelectionHandler(this.SelectionHandler);
      var dndMoveEnabled = this.isDnDMoveEnabled();
      var dndResizeEnabled = this.isDnDResizeEnabled();

      if (dndMoveEnabled || dndResizeEnabled) {
        var lowLevelDnD = {
          drag: {
            event: { dataTypes: [] },
            'resize-handle': { dataTypes: [] }
          },
          drop: {
            canvas: { dataTypes: [] }
          }
        };
        this.Options['dnd'] = dvt.JsonUtils.merge(this.Options['dnd'], lowLevelDnD);

        // High level dnd.move or resize enabled is equivalent to enabling items as drag sources and series as drop targets
        var self = this;
        var setupDragDataTypes = (dataType, dragType) => {
          var dragItemsDataTypes = self.Options['dnd']['drag'][dragType]['dataTypes'];
          if (!Array.isArray(dragItemsDataTypes)) {
            self.Options['dnd']['drag'][dragType]['dataTypes'] = [dragItemsDataTypes];
            dragItemsDataTypes = self.Options['dnd']['drag'][dragType]['dataTypes'];
          }
          dragItemsDataTypes.push(dataType);

          var dropRowsDataTypes = self.Options['dnd']['drop']['canvas']['dataTypes'];
          if (!Array.isArray(dropRowsDataTypes)) {
            self.Options['dnd']['drop']['canvas']['dataTypes'] = [dropRowsDataTypes];
            dropRowsDataTypes = self.Options['dnd']['drop']['canvas']['dataTypes'];
          }
          dropRowsDataTypes.push(dataType);
        };

        if (dndResizeEnabled) setupDragDataTypes('text/_dvtdndresizeitems', 'resize-handle');
        if (dndMoveEnabled) setupDragDataTypes('text/_dvtdndmoveitems', 'event');
      }
      this._shortDesc = props.shortDesc ? props.shortDesc : this._shortDesc;
      this._referenceObjects = props.referenceObjects
        ? props.referenceObjects
        : this._referenceObjects;
      this._seriesScale = props.seriesScale ? props.seriesScale : this._seriesScale;

      if (this._seriesScale) {
        this._seriesConverter = props.seriesConverter;
        this._seriesTimeAxis = new ojtimeaxisToolkit.TimeAxis(this.getCtx(), null, null);
        this._seriesTimeAxis.setIsVertical(this._isVertical);
        this._seriesTimeAxis.setScale(this._seriesScale);
        this._seriesTimeAxis.setConverter(this._seriesConverter);
        this._seriesCustomFormatScales = props.seriesCustomFormatScales;

        if (this._isVertical) {
          this._seriesTimeAxis.setDefaultConverter(this._resources['converterVert']);
        } else {
          this._seriesTimeAxis.setDefaultConverter(this._resources['converter']);
        }
      } else this._seriesTimeAxis = null;

      this._defaultInversions = [false, true];
      this._itemPosition = props.itemPosition;
      this._customTimeScales = props.customTimeScales;
      this._customFormatScales = props.customFormatScales;

      this._scale = props.scale;

      super._applyParsedProperties(props);
    }

    /**
     * Returns the minor time axis object.
     * @return {TimeAxis} The time axis object
     */
    getTimeAxis() {
      return this._timeAxis;
    }

    getTimeAxisSize() {
      return this._timeAxis.getSize();
    }

    getTimeAxisVisibleSize(seriesCount) {
      if (!this._hasOverview && seriesCount === 1)
        return this.getTimeAxisSize() - this._timeAxis.getBorderWidth();
      else return this.getTimeAxisSize();
    }

    /**
     * @override
     */
    select(selection) {
      // Update the options
      // TODO: update this for stuff...
      this.Options['selection'] = dvt.JsonUtils.clone(selection);

      // Perform the selection
      if (this.SelectionHandler) this.applyInitialSelections();
    }

    /**
     * Creates TimeAxis compatible options object from component's options object.
     * @param {object} options The object containing specifications and data for this component.
     * @param {string} axis The time axis.
     * @return {object} retOptions containing the time axis options
     * @private
     */
    _bundleTimeAxisOptions(options, axis) {
      var _resources = this._resources;
      if (axis === 'majorAxis') {
        _resources['axisSeparatorClass'] = 'oj-timeline-major-axis-separator';
        _resources['axisLabelClass'] = 'oj-timeline-major-axis-label';
      } else if (axis === 'minorAxis') {
        _resources['axisClass'] = 'oj-timeline-minor-axis';
        _resources['axisSeparatorClass'] = 'oj-timeline-minor-axis-separator';
        _resources['axisLabelClass'] = 'oj-timeline-minor-axis-label';
      }

      var retOptions = {
        start: options['start'],
        end: options['end'],
        _resources: _resources,
        shortDesc: options['shortDesc'],
        _tzo: options['_tzo'],
        _ip: options['_ip'],
        _cts: this._customTimeScales,
        _cfs: this._customFormatScales,
        orientation: options['orientation']
      };

      if (options['styleDefaults'] && options['styleDefaults']['minorAxis']) {
        var minorAxisStyleDefaults = options['styleDefaults']['minorAxis'];
        retOptions['backgroundColor'] = minorAxisStyleDefaults['backgroundColor'];
        retOptions['borderColor'] = minorAxisStyleDefaults['borderColor'];
        retOptions['separatorColor'] = minorAxisStyleDefaults['separatorColor'];
        retOptions['labelStyle'] = minorAxisStyleDefaults['labelStyle'];
      }

      if (options[axis]) {
        var axisOptions = options[axis];
        if (axisOptions['scale']) retOptions['scale'] = axisOptions['scale'];
        if (axisOptions['converter']) retOptions['converter'] = axisOptions['converter'];

        retOptions.zoomOrder = axisOptions.zoomOrder || [axisOptions.scale];
      }

      if (options['minorAxis']) {
        var minorAxisOptions = options['minorAxis'];

        const isAlta = this.getCtx().getThemeBehavior() === 'alta';
        // Default scales label position and alignment
        if (isAlta) {
          // positioning along time direction
          retOptions['_scaleLabelPosition'] = {
            seconds: 'center',
            minutes: 'center',
            hours: 'center',
            days: 'center',
            weeks: 'center',
            months: 'center',
            quarters: 'center',
            years: 'center'
          };
          // alignment along perpendicular axis (keys are time axis type/orientation)
          retOptions['_labelAlignment'] = {
            horizontal: 'middle',
            vertical: 'middle'
          };
        } else {
          // positioning along time direction
          retOptions['_scaleLabelPosition'] = {
            seconds: 'start',
            minutes: 'start',
            hours: 'start',
            days: 'center',
            weeks: 'start',
            months: 'start',
            quarters: 'start',
            years: 'start'
          };
          // alignment along perpendicular axis (keys are time axis type/orientation)
          retOptions['_labelAlignment'] = {
            horizontal: 'middle',
            vertical: 'middle'
          };
        }
        // Custom scales label position
        retOptions['zoomOrder'].forEach((scale) => {
          if (scale && scale.name) {
            const labelPosition = scale.labelPosition || 'auto';
            const effectiveLabelPosition = labelPosition === 'auto' ? 'start' : labelPosition;
            retOptions['_scaleLabelPosition'][scale.name] = effectiveLabelPosition;
          }
        });
        retOptions['style'] = minorAxisOptions['style'];
        if (minorAxisOptions['svgStyle']) retOptions['style'] = minorAxisOptions['svgStyle'];
      }
      return retOptions;
    }

    /**
     * Renders the component with the specified data.  If no data is supplied to a component
     * that has already been rendered, the component will be rerendered to the specified size.
     * @param {object} options The object containing specifications and data for this component.
     * @param {number} width The width of the component.
     * @param {number} height The height of the component.
     */
    render(options, width, height) {
      if (!options) {
        this._handleResize(width, height);
        return;
      }
      super.render(options, width, height);

      // Render an aria live region for accessibility during DnD
      if (this.isDndEnabled()) {
        var context = this.getCtx();
        this.renderAriaLiveRegion('_dvtTimelineAriaLiveRegion' + context.getStage().getId());
      } else {
        this.removeAriaLiveRegion();
      }

      // Animation Support
      // Stop any animation in progress
      this.StopAnimation();

      this._fetchStartPos = 0;
      if (this._isVertical) this._fetchEndPos = height;
      else this._fetchEndPos = width;

      if (this.Options['styleDefaults']) {
        // convert to dvt.CSSStyle objects after pulling from css
        this.Options['styleDefaults']['item']['descriptionStyle'] =
          DvtTimelineStyleUtils.convertToCSSStyle(
            this.Options['styleDefaults']['item']['descriptionStyle']
          );
        this.Options['styleDefaults']['item']['titleStyle'] = DvtTimelineStyleUtils.convertToCSSStyle(
          this.Options['styleDefaults']['item']['titleStyle']
        );
        this.Options['styleDefaults']['majorAxis']['labelStyle'] =
          DvtTimelineStyleUtils.convertToCSSStyle(
            this.Options['styleDefaults']['majorAxis']['labelStyle']
          );
        this.Options['styleDefaults']['minorAxis']['labelStyle'] =
          DvtTimelineStyleUtils.convertToCSSStyle(
            this.Options['styleDefaults']['minorAxis']['labelStyle']
          );
        this.Options['styleDefaults']['overview']['labelStyle'] =
          DvtTimelineStyleUtils.convertToCSSStyle(
            this.Options['styleDefaults']['overview']['labelStyle']
          );
        this.Options['styleDefaults']['series']['emptyTextStyle'] =
          DvtTimelineStyleUtils.convertToCSSStyle(
            this.Options['styleDefaults']['series']['emptyTextStyle']
          );
        this.Options['styleDefaults']['series']['labelStyle'] =
          DvtTimelineStyleUtils.convertToCSSStyle(
            this.Options['styleDefaults']['series']['labelStyle']
          );
        this.Options['styleDefaults']['tooltipLabelStyle'] = DvtTimelineStyleUtils.convertToCSSStyle(
          this.Options['styleDefaults']['tooltipLabelStyle']
        );
        this.Options['styleDefaults']['tooltipValueStyle'] = DvtTimelineStyleUtils.convertToCSSStyle(
          this.Options['styleDefaults']['tooltipValueStyle']
        );

        this._majorAxisStyleDefaults = this.Options['styleDefaults']['majorAxis'];
        this._seriesStyleDefaults = this.Options['styleDefaults']['series'];
      }

      var major = options['majorAxis'];

      if (major) {
        if (major['scale']) {
          var majorAxisOptions = this._bundleTimeAxisOptions(this.Options, 'majorAxis');

          if (this._majorAxis == null) {
            this._majorAxis = new ojtimeaxisToolkit.TimeAxis(this.getCtx(), null, null);
          }

          // TimeComponent's TimeAxis._canvasSize should always be null on initial render
          this._majorAxis.setCanvasSize(null);
          this._majorAxis.getPreferredLength(majorAxisOptions, this._canvasLength);
        } // if there WAS a major axis, but rerender WITHOUT major axis, make sure to set it to null
        else this._majorAxis = null;
      } else {
        // rerender without major axis secondary axis if vertical
        this._majorAxis = null;
      }

      if (this._scale) {
        this._timeAxisOptions = this._bundleTimeAxisOptions(this.Options, 'minorAxis');
        if (this._majorAxis) {
          this._timeAxisOptions._secondaryAxis = this._majorAxis;
        }

        this.applyAxisStyleValues();

        if (!this._timeAxis) this._timeAxis = new ojtimeaxisToolkit.TimeAxis(this.getCtx(), null, null);
        // Axis border visibility needs to be reset in case of orientation changes.
        if (this._isVertical) this._timeAxis.setBorderVisibility(false, true, false, true);
        else this._timeAxis.setBorderVisibility(true, false, true, false);
        // TimeComponent's TimeAxis._canvasSize should always be null on initial render,
        this._timeAxis.setCanvasSize(null);

        if (!this.hasMatchingViewportDates()) {
          var preferredLength = this._timeAxis.getPreferredLength(
            this._timeAxisOptions,
            this._canvasLength
          );
          if (preferredLength) this.setContentLength(preferredLength);
          if (this._timeAxis.hasValidOptions()) this.prepareViewportLength();
        }
      }

      // calc discrete offset that we need to shift scrollable Canvas and time axis to align them in discrete
      // viewport navigation mode.
      if (this.isDiscreteNavigationMode()) {
        // Grab initial start and end times if not already cached
        if (!this.hasMatchingViewportDates()) {
          this._discreteViewportStartIndex = 0;
          this._discreteViewportCurrentIndexOffset = 0;
          this._discreteViewportDatePositions = [this._viewStartTime, this._viewEndTime];
        }

        var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
        this._timeAxisRatio =
          (this._canvasLength - 2 * navButtonBackgroundWidth) / this._canvasLength;
        this._discreteOffset =
          (this.getContentLength() - this.getContentLength() * this._timeAxisRatio) / 2;
        this._discreteContentLength = this.getContentLength() * this._timeAxisRatio;
      }

      this._populateSeries();

      DvtTimelineRenderer.renderTimeline(this);
      if (this.isDiscreteNavigationMode()) {
        this.doInitialPan();
      }
      this.UpdateAriaAttributes();

      // Set the timeline as the only keyboard listener
      // Prevents overview from receiving keyboard events
      if (!ojtimeaxisToolkit.TimeAxisUtils.supportsTouch()) this.getCtx().setKeyboardFocusArray([this]);

      if (!this.Animation)
        // If not animating, that means we're done rendering, so fire the ready event.
        this.RenderComplete();
    }

    /**
     * Helper method to decide whether or not the viewport start and end dates are
     * already in the stored date positions
     * @return {boolean} Whether the viewportStart and viewportEnd dates are already cached
     */
    hasMatchingViewportDates() {
      if (this.isVertical()) {
        // clear discrete viewport dates in vertical mode to reset
        this._discreteViewportDatePositions = null;
        return false;
      }
      return (
        this.isDiscreteNavigationMode() &&
        this._discreteViewportDatePositions != null &&
        this._discreteViewportDatePositions.indexOf(this._viewStartTime) != -1 &&
        this._discreteViewportDatePositions.indexOf(this._viewEndTime) != -1
      );
    }

    /**
     * Helper method to decide whether or not the series.items options are valid.
     * @return {boolean} Whether the series.items options are valid.
     */
    hasValidSeriesItems() {
      for (var i = 0; i < this._seriesOptions.length; i++) {
        var seriesOptions = this._seriesOptions[i];
        if (seriesOptions.items) {
          for (var j = 0; j < seriesOptions.items.length; j++) {
            var item = seriesOptions.items[j];
            var start = new Date(item.start).getTime();
            // JET-46818 fixing issue where start = 0 (1970 - 1 - 1) also returned false
            if (start == null || isNaN(start) || item.start == null) return false;
            if (item.hasOwnProperty('end')) {
              var end = new Date(item.end).getTime();
              if (!isNaN(end) && end < start) return false;
            }
          }
        }
      }
      return true;
    }

    /**
     * Helper method to decide whether or not the options are valid.
     * @return {boolean} Whether this timeline has valid options.
     */
    hasValidOptions() {
      // TODO: warn user why certain options are invalid
      var hasValidScale =
        this._scale &&
        (ojtimeaxisToolkit.TimeAxis.VALID_SCALES.indexOf(this._scale) !== -1 || this.isTimeComponentScale(this._scale));
      var hasValidCustomScale =
        this._scale && this._customTimeScales && this._customTimeScales[this._scale];
      var hasValidStartAndEnd = this._start && this._end && this._end > this._start;
      var hasValidSeries = this._series && this._series.length > 0;
      var hasValidSeriesItems = hasValidSeries ? this.hasValidSeriesItems() : false;
      var hasValidSeriesScale = this._seriesScale
        ? ojtimeaxisToolkit.TimeAxis.VALID_SCALES.indexOf(this._seriesScale) !== -1 ||
          this.isTimeComponentScale(this._seriesScale)
        : true;
      var hasValidCustomSeriesScale = this._seriesScale
        ? this._customTimeScales && this._customTimeScales[this._seriesScale]
        : true;
      var hasValidViewport =
        this._viewStartTime && this._viewEndTime ? this._viewEndTime > this._viewStartTime : true;
      var hasValidViewStart = this._viewStartTime
        ? this._viewStartTime >= this._start && this._viewStartTime < this._end
        : true;
      var hasValidViewEnd = this._viewEndTime
        ? this._viewEndTime > this._start && this._viewEndTime <= this._end
        : true;

      return (
        (hasValidScale || hasValidCustomScale) &&
        (hasValidSeriesScale || hasValidCustomSeriesScale) &&
        hasValidStartAndEnd &&
        hasValidSeries &&
        hasValidSeriesItems &&
        hasValidViewport &&
        hasValidViewStart &&
        hasValidViewEnd
      );
    }

    /**
     * Helper method to decide whether or not the scale is a DvtTimeComponentScale interface
     * @return {boolean} Whether this scale is a valid DvtTimeComponentScale interface.
     */
    isTimeComponentScale(scale) {
      return (
        scale.getNextDate != null &&
        scale.getPreviousDate != null &&
        scale.formatter != null &&
        scale.name != null
      );
    }

    /**
     * @override
     */
    GetComponentDescription() {
      if (this._shortDesc) return this._shortDesc;
      else return this.Options.translations.componentName;
    }

    /**
     * Combines style defaults with the styles provided
     *
     */
    applyStyleValues() {
      this._style = new dvt.CSSStyle(DvtTimelineStyleUtils.getTimelineStyle());
      if (this.Options['styleDefaults']) {
        var style = this.Options['styleDefaults']['borderColor'];
        if (style) this._style.parseInlineStyle('border-color:' + style + ';');
      }
      if (this._hasOverview) {
        this._overviewSize = this._isVertical
          ? DvtTimelineStyleUtils.getOverviewWidth()
          : DvtTimelineStyleUtils.getOverviewHeight();
        var overviewOptions = this.Options['overview'];
        var overviewStyle = overviewOptions['svgStyle']
          ? overviewOptions['svgStyle']
          : overviewOptions['style'];
        if (overviewStyle) {
          var overviewCSSStyle = new dvt.CSSStyle(overviewStyle);
          var overviewSize = this._isVertical
            ? overviewCSSStyle.getWidth()
            : overviewCSSStyle.getHeight();
          if (overviewSize != null) this._overviewSize = dvt.CSSStyle.toNumber(overviewSize);
        }
      }
      super.applyStyleValues();

      // double border width to account for stroke width rendering
      var borderWidth = this._style.getBorderWidth();
      var doubleBorderWidth = borderWidth * 2;
      var borderStyle = 'border:' + doubleBorderWidth + 'px;';
      this._style.parseInlineStyle(borderStyle);

      this.setStartXOffset(borderWidth);
      this.setStartYOffset(borderWidth);
      this.setBackgroundXOffset(0);

      var scrollbarPadding = 3 * this.getScrollbarPadding();

      // we are going to hide the scrollbar
      this.timeDirScrollbarStyles = this.getTimeDirScrollbarStyle();
      this.contentDirScrollbarStyles = this.getContentDirScrollbarStyle();

      this._backgroundWidth = this.Width;
      this._backgroundHeight = this.Height;

      if (this._isVertical) {
        // The size of the canvas viewport
        if (this.isContentDirScrollbarOn())
          this._backgroundHeight =
            this._backgroundHeight -
            dvt.CSSStyle.toNumber(this.contentDirScrollbarStyles.getHeight()) -
            scrollbarPadding;
        this._canvasLength = this._backgroundHeight - doubleBorderWidth;

        if (this._hasOverview) {
          this._canvasSize = this._backgroundWidth - this._overviewSize - doubleBorderWidth;
          if (this.isRTL()) this.setStartXOffset(borderWidth + this._overviewSize);
        } else {
          if (this.isTimeDirScrollbarOn())
            this._backgroundWidth =
              this._backgroundWidth -
              dvt.CSSStyle.toNumber(this.timeDirScrollbarStyles.getWidth()) -
              scrollbarPadding;
          this._canvasSize = this._backgroundWidth - doubleBorderWidth;
          if (this.isRTL()) {
            this.setBackgroundXOffset(this.Width - this._backgroundWidth);
            this.setStartXOffset(this.getStartXOffset() + this.getBackgroundXOffset());
          }
        }
      } else {
        // The size of the canvas viewport
        if (this.isContentDirScrollbarOn())
          this._backgroundWidth =
            this._backgroundWidth -
            dvt.CSSStyle.toNumber(this.contentDirScrollbarStyles.getWidth()) -
            scrollbarPadding;
        this._canvasLength = this._backgroundWidth - doubleBorderWidth;
        if (this.isRTL()) {
          this.setBackgroundXOffset(this.Width - this._backgroundWidth);
          this.setStartXOffset(this.getStartXOffset() + this.getBackgroundXOffset());
        }

        if (this._hasOverview)
          this._canvasSize = this._backgroundHeight - this._overviewSize - doubleBorderWidth;
        else {
          if (this.isTimeDirScrollbarOn())
            this._backgroundHeight =
              this._backgroundHeight -
              dvt.CSSStyle.toNumber(this.timeDirScrollbarStyles.getHeight()) -
              scrollbarPadding;
          this._canvasSize = this._backgroundHeight - doubleBorderWidth;
        }
      }
    }

    /**
     * Combines style defaults with the styles provided
     *
     */
    applyAxisStyleValues() {
      if (this._seriesStyleDefaults && this._seriesStyleDefaults['backgroundColor']) {
        var bgColor = this._seriesStyleDefaults['backgroundColor'];
        var r = dvt.ColorUtils.getRed(bgColor);
        var g = dvt.ColorUtils.getGreen(bgColor);
        var b = dvt.ColorUtils.getBlue(bgColor);
        this._seriesBackgroundOverlayStyle =
          'background-color:rgba(' + r + ',' + g + ',' + b + ',0.8);';
      }
    }

    _populateSeries() {
      var i;
      var series = this.Options['series'];
      if (series) {
        var seriesCount = Math.min(series.length, 2);
        this._seriesOptions = [];
        if (this._series) {
          if (seriesCount !== this._series.length) {
            for (i = 0; i < this._series.length; i++) {
              this._timeZoomCanvas.removeChild(this._series[i]);
            }
            this._series = [];
          } else {
            // check each series to make sure the item-type is consistent
            for (i = 0; i < this._series.length; i++) {
              if (
                this._series[i]._items &&
                series[i].items &&
                this._series[i]._items[0]._data.itemType !== series[i].items[0].itemType
              ) {
                this._timeZoomCanvas.removeChild(this._series[i]);
                this._series[i] = null;
              }
            }
          }
        } else this._series = [];

        for (i = 0; i < seriesCount; i++) {
          var seriesOptions = series[i];
          seriesOptions['start'] = this._start;
          seriesOptions['end'] = this._end;
          seriesOptions['inverted'] = this._defaultInversions[i];
          seriesOptions['orientation'] = this.Options['orientation'];
          seriesOptions['referenceObjects'] = this._referenceObjects;
          seriesOptions['timeline'] = this;
          seriesOptions['index'] = i;
          seriesOptions['animationOnDisplay'] = this.Options['animationOnDisplay'];
          seriesOptions['animationOnDataChange'] = this.Options['animationOnDataChange'];

          if (this.Options['majorAxis']) {
            // if majorAxis scale is undef, but the option was initially set, leave it on the previous value
            seriesOptions['scale'] =
              this.Options['majorAxis']['scale'] === undefined
                ? this._seriesScale
                : this.Options['majorAxis']['scale'];
            seriesOptions['timeAxis'] = this._seriesTimeAxis;
            seriesOptions['_cfs'] = this._seriesCustomFormatScales;
          }

          seriesOptions['styleDefaults'] = this.Options['styleDefaults'];
          if (this.Options['styleDefaults']) {
            seriesOptions['seriesStyleDefaults'] = this._seriesStyleDefaults;
            seriesOptions['axisStyleDefaults'] = this._majorAxisStyleDefaults;
          }

          seriesOptions['_isRandomItemLayout'] = this._itemPosition === 'random';
          seriesOptions['_cts'] = this.Options['_cts'];
          seriesOptions['_data'] = series[i];

          seriesOptions.translations = this.Options.translations;

          this._seriesOptions.push(seriesOptions);

          if (this._series[i] == null) {
            var s = new DvtTimelineSeries(this.getCtx(), this.HandleEvent, this);
            this._series[i] = s;
          }
        }
      } else this._series = [];
    }

    /**
     * Handler for initial animation ending.
     */
    onAnimationEnd() {
      // Fire ready event saying animation is finished.
      if (!this.AnimationStopped) this.RenderComplete();

      // Restore event listeners
      this.EventManager.addListeners(this);

      // Reset animation flags
      this.Animation = null;
      this.AnimationStopped = false;
    }

    _getOverviewObject() {
      var overviewOptions = new Object();
      overviewOptions['width'] = this._contentLength;
      overviewOptions['selmode'] = this._selectionMode;
      overviewOptions['rtl'] = this.isRTL();
      overviewOptions['sid'] = 'ts1';

      var windowBackgroundColor = DvtTimelineStyleUtils.getOverviewWindowBackgroundColor(
        this.Options
      );
      overviewOptions['_wbc'] = windowBackgroundColor;
      overviewOptions['_hfc'] = windowBackgroundColor;

      var windowBorderColor = DvtTimelineStyleUtils.getOverviewWindowBorderColor(this.Options);
      overviewOptions['_wbtc'] = windowBorderColor;
      overviewOptions['_wbrc'] = windowBorderColor;
      overviewOptions['_wbbc'] = windowBorderColor;
      overviewOptions['_wblc'] = windowBorderColor;

      overviewOptions['_ls'] = DvtTimelineStyleUtils.getOverviewLabelStyle(this.Options).toString();
      overviewOptions['_obc'] = DvtTimelineStyleUtils.getOverviewBackgroundColor(this.Options);
      overviewOptions['_ctic'] = DvtTimelineStyleUtils.getReferenceObjectColor(this.Options);

      if (this._referenceObjects && this._referenceObjects.length > 0)
        overviewOptions['referenceObjects'] = this._referenceObjects;

      if (this._isVertical) {
        overviewOptions['orn'] = 'vertical';
        overviewOptions['yMin'] = this._start;
        overviewOptions['yMax'] = this._end;
        overviewOptions['y1'] = this._viewStartTime;
        overviewOptions['y2'] = this._viewEndTime;
      } else {
        overviewOptions['orn'] = 'horizontal';
        overviewOptions['xMin'] = this._start;
        overviewOptions['xMax'] = this._end;
        overviewOptions['x1'] = this._viewStartTime;
        overviewOptions['x2'] = this._viewEndTime;
        overviewOptions['_ds'] = 'square';
        overviewOptions['_dsx'] = '1.3d';
        overviewOptions['_dsy'] = '0.9d';
      }

      if (this._resources['overviewHandleVert']) {
        overviewOptions['_vhbc'] = this._resources['overviewHandleVert'];
        overviewOptions['_vhs'] = 16;
      }
      if (this._resources['overviewHandleHor']) {
        overviewOptions['_hbc'] = this._resources['overviewHandleHor'];
        overviewOptions['_hs'] = 16;
      }

      overviewOptions['axisTicks'] = this._getOverviewAxisOptions();
      overviewOptions['markers'] = this._getOverviewMarkerOptions();

      return overviewOptions;
    }

    _getOverviewAxisOptions() {
      var axisTicks = [];
      if (this._seriesTimeAxis) {
        var dates;
        var labels;
        if (this._customTimeScales && this._customTimeScales[this._seriesScale]) {
          var customScale = this._customTimeScales[this._seriesScale];
          dates = customScale['times'];
          labels = customScale['labels'];
        } else if (
          this._seriesCustomFormatScales &&
          this._seriesCustomFormatScales[this._seriesScale]
        ) {
          var customFormatScale = this._seriesCustomFormatScales[this._seriesScale];
          dates = customFormatScale['times'];
          labels = customFormatScale['labels'];
        } else {
          dates = [];
          labels = [];

          var start = this._start;
          var end = this._end;
          var length = this._isVertical ? this.Height : this.Width;
          var startDate = this.getPosDate(this._fetchStartPos);

          var currentDate = this._seriesTimeAxis.adjustDate(startDate);
          var currentPos = this.getDatePos(currentDate);
          while (currentPos < this._fetchEndPos) {
            labels.push(this._seriesTimeAxis.formatDate(currentDate));
            dates.push(currentDate.getTime());

            currentDate = this._seriesTimeAxis.getNextDate(currentDate.getTime());
            currentPos = this.getDatePos(currentDate);
          }
        }
        for (var i = 0; i < labels.length; i++) {
          var tickOption = new Object();
          tickOption['time'] = dates[i];
          tickOption['label'] = labels[i];
          axisTicks.push(tickOption);
        }
      }
      return axisTicks;
    }

    _getOverviewMarkerOptions() {
      if (this._series) {
        var overviewMarkers = [];
        var seriesCount = this._series.length;
        for (var i = 0; i < seriesCount; i++) {
          var items = this._series[i]._items;
          for (var j = 0; j < items.length; j++) {
            var item = items[j];
            var itemOption = new Object();
            itemOption['rk'] = j;
            itemOption['sid'] = i;
            itemOption['tid'] = item.getId();
            itemOption['t'] = item.getStartTime();
            itemOption['_sd'] = item.getMarkerSD();

            //begin custom marker handling (for ADF)
            if (!this._isVertical) {
              if (item.getMarkerShape()) itemOption['s'] = item.getMarkerShape();
              if (item.getMarkerScaleX()) itemOption['sx'] = item.getMarkerScaleX();
              if (item.getMarkerScaleY()) itemOption['sy'] = item.getMarkerScaleY();
            }
            if (item.getMarkerShortDesc()) itemOption['d'] = item.getMarkerShortDesc();
            if (item.getMarkerFillColor()) itemOption['c'] = item.getMarkerFillColor();
            if (item.getMarkerGradientFill()) itemOption['g'] = item.getMarkerGradientFill();
            if (item.getMarkerOpacity()) itemOption['o'] = item.getMarkerOpacity();
            // end custom marker handling (for ADF)

            var endTime = item.getEndTime();
            if (endTime) {
              itemOption['et'] = endTime;
              var durationFillColor = item.getDurationFillColor();
              // only set duration fill color if duration bar
              if (durationFillColor && item.getItemType() === DvtTimelineSeriesNode.DURATION_BAR)
                itemOption['dfc'] = durationFillColor;
            }
            overviewMarkers.push(itemOption);
          }
        }
        return overviewMarkers;
      }
      return null;
    }

    /**
     * Creates a viewportChange event object
     * @return {object} the viewportChange event object
     */
    createViewportChangeEvent() {
      // if custom scale, we use the name given in the custom scale.
      var scaleName = this._timeAxis.getScale();
      if (typeof scaleName != 'string') {
        scaleName = scaleName.name;
      }
      return dvt.EventFactory.newTimelineViewportChangeEvent(
        this._viewStartTime,
        this._viewEndTime,
        scaleName
      );
    }

    HandleTouchStart(event) {
      var touches = event.touches;
      var elClass = event.target.getClassName();
      // block pan event if target element has class (currently just nav arrows)
      if (touches.length === 1 && !elClass) this._dragPanSeries = this._findSeries(event.target);
    }

    /**
     * Handles mouse wheel event.
     * Disabled in discrete viewport navigation mode
     * @param {event} event The mouse wheel event
     * @protected
     * @override
     */
    HandleMouseWheel(event) {
      super.HandleMouseWheel(event);
      if (this.hasValidOptions() && !this.isDiscreteNavigationMode()) {
        if (event.zoomWheelDelta) {
          // only zoom if mouse inside chart/graphical area
          var relPos = this.getCtx().pageToStageCoords(event.pageX, event.pageY);
          if (this.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y)) {
            var newLength = this.getContentLength() * event.zoomWheelDelta;
            var time = event.zoomTime;
            var compLoc = event.zoomCompLoc;
            this.handleZoomWheel(newLength, time, compLoc, true);
          }
        }
      }
    }

    handleZoomWheel(newLength, time, compLoc, triggerViewportChangeEvent) {
      var minLength;
      if (newLength > this._timeAxis.getMaxContentLength()) {
        newLength = this._timeAxis.getMaxContentLength();
        this.disableZoomButton(true);
      } else this.enableZoomButton(true);
      if (this._canvasLength > newLength) {
        newLength = this._canvasLength;
        this.disableZoomButton(false);
      } else this.enableZoomButton(false);

      var zoomIn = this.getContentLength() <= newLength;
      super.handleZoomWheel(newLength, time, compLoc, triggerViewportChangeEvent);

      var zoomLevelLengths = this._timeAxis.getZoomLevelLengths();
      if (zoomIn) {
        while (this._timeAxis.getZoomLevelOrder() > 0) {
          minLength = zoomLevelLengths[this._timeAxis.getZoomLevelOrder() - 1];
          if (this.getContentLength() >= minLength) {
            this._timeAxis.setZoomLevelOrder(this._timeAxis.getZoomLevelOrder() - 1);
            this._timeAxis.decreaseScale();
          } else break;
        }
      } else {
        while (this._timeAxis.getZoomLevelOrder() < zoomLevelLengths.length - 1) {
          minLength = zoomLevelLengths[this._timeAxis.getZoomLevelOrder()];
          if (this.getContentLength() < minLength) {
            this._timeAxis.setZoomLevelOrder(this._timeAxis.getZoomLevelOrder() + 1);
            this._timeAxis.increaseScale();
          } else break;
        }
      }

      if (this._hasOverview) {
        if (this._isVertical)
          this._overview.setViewportRange(null, null, this._viewStartTime, this._viewEndTime);
        else this._overview.setViewportRange(this._viewStartTime, this._viewEndTime, null, null);
      }
      if (this.isTimeDirScrollbarOn())
        this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

      this.applyAxisStyleValues();
      DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas, true);
      this.updateSeries();

      if (this.isContentDirScrollbarOn()) {
        for (var i = 0; i < this._series.length; i++) {
          this.contentDirScrollbar[i].setViewportRange(
            0,
            this._seriesSize,
            0,
            Math.max(this._series[i]._maxOverflowValue, this._seriesSize)
          );
        }
      }
      if (triggerViewportChangeEvent) this.dispatchEvent(this.createViewportChangeEvent());
    }

    updateSeries() {
      if (this._series) {
        var seriesCount = this._series.length;
        var axisSize = this.getTimeAxisVisibleSize(seriesCount);
        this._seriesSize = (this._canvasSize - axisSize) / seriesCount;
        for (var i = 0; i < seriesCount; i++) {
          var series = this._series[i];

          // setup overflow controls
          series.setClipPath(null);
          var cp = new dvt.ClipPath();
          if (this._isVertical) {
            if (this.isRTL()) var key = Math.abs(i - 1);
            else key = i;
            if (this.isRTL() && this._series.length === 1) {
              cp.addRect(axisSize, 0, this._seriesSize, this.getContentLength());
              var posMatrix = new dvt.Matrix(1, 0, 0, 1, axisSize, 0);
            } else {
              cp.addRect(
                key * (this._seriesSize + axisSize),
                0,
                this._seriesSize,
                this.getContentLength()
              );
              posMatrix = new dvt.Matrix(1, 0, 0, 1, key * (this._seriesSize + axisSize), 0);
            }
            var width = this._seriesSize;
            var height = this.getContentLength();
          } else {
            cp.addRect(
              0,
              i * (this._seriesSize + axisSize),
              this.getContentLength(),
              this._seriesSize
            );
            posMatrix = new dvt.Matrix(1, 0, 0, 1, 0, i * (this._seriesSize + axisSize));
            width = this.getContentLength();
            height = this._seriesSize;
          }
          series.setClipPath(cp);

          series.setMatrix(posMatrix);
          series.render(null, width, height);
        }
      }
    }

    _handleResize(width, height) {
      this.Width = width;
      this.Height = height;

      this.applyStyleValues();

      this._fetchStartPos = 0;
      if (this._isVertical) this._fetchEndPos = height;
      else this._fetchEndPos = width;

      this.prepareViewportLength();
      DvtTimelineRenderer._removeEmptyText(this);

      DvtTimelineRenderer._renderBackground(this);

      // need to recalculate the discrete offset
      if (this.isDiscreteNavigationMode()) {
        var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();

        this._timeAxisRatio =
          (this._canvasLength - 2 * navButtonBackgroundWidth) / this._canvasLength;
        this._discreteOffset =
          (this.getContentLength() - this.getContentLength() * this._timeAxisRatio) / 2;
        this._discreteContentLength = this.getContentLength() * this._timeAxisRatio;
      }

      if (this.hasValidOptions()) {
        this.renderTimeZoomCanvas(this._canvas);
        this.applyAxisStyleValues();
        this.updateSeries();
        DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas);
        DvtTimelineRenderer._renderSeriesLabels(this);
        DvtTimelineRenderer._renderZoomControls(this);
        if (this.isDiscreteNavigationMode()) {
          DvtTimelineRenderer._renderNavigationArrows(this, this._timeZoomCanvas);
          this.doInitialPan();
        }
        if (this._hasOverview) {
          DvtTimelineRenderer._renderOverview(this);

          // Reapply selections to overview region
          if (this.SelectionHandler) {
            var selection = this.SelectionHandler.getSelectedIds();
            if (selection && selection.length !== 0) {
              for (var i = 0; i < selection.length; i++) {
                this._overview.selSelectItem(selection[i]);
              }
            }
          }
        }

        if (this.isTimeDirScrollbarOn() || this.isContentDirScrollbarOn())
          DvtTimelineRenderer._renderScrollbars(this);
      } else DvtTimelineRenderer._renderEmptyText(this);

      // if not animating, we are done rendering
      if (!this.Animation) this.RenderComplete();
    }

    HandleKeyDown(event) {
      if (
        dvt.KeyboardEvent.RIGHT_ARROW === event.keyCode ||
        dvt.KeyboardEvent.LEFT_ARROW === event.keyCode ||
        dvt.KeyboardEvent.DOWN_ARROW === event.keyCode ||
        dvt.KeyboardEvent.UP_ARROW === event.keyCode
      )
        if (!this.getEventManager()._isDndDragging) {
          // block keyboard actions is dnd/keyboard drag operation in effect
          this.updateScrollForItemNavigation(this.EventManager.getFocus());
        }
    }

    HandleMouseDown(event) {
      var elClass = event.target.getClassName();
      // block pan event if target element has class (currently just nav arrows)
      if (!elClass) {
        this._dragPanSeries = this._findSeries(event.target);
      }
    }

    endDragPan() {
      this._dragPanSeries = null;
      this.endPan();
    }

    /**
     * Ends panning.
     */
    endPan() {
      if (this._triggerViewportChange) {
        this._triggerViewportChange = false;
        this.dispatchEvent(this.createViewportChangeEvent());
      }
    }

    /**
     * Pans the Timeline by the specified amount.
     * @param {number} deltaX The number of pixels to pan in the x direction.
     * @param {number} deltaY The number of pixels to pan in the y direction.
     */
    panBy(deltaX, deltaY) {
      var newMin;
      var seriesCount = this._series.length;
      var axisSize = this.getTimeAxisVisibleSize(seriesCount);
      if (this._isVertical) {
        if (this._dragPanSeries) {
          var newTranslateX = this._dragPanSeries.getTranslateX() - deltaX;
          if (
            this._series.length > 1 &&
            ((!this.isRTL() && this._dragPanSeries._isInverted) ||
              (this.isRTL() && !this._dragPanSeries._isInverted))
          ) {
            var minTranslateX =
              axisSize + 2 * this._dragPanSeries.Width - this._dragPanSeries._maxOverflowValue;
            var maxTranslateX = this._dragPanSeries.Width + axisSize;
          } else if (this.isRTL() && !this._dragPanSeries._isInverted) {
            minTranslateX =
              this._dragPanSeries.Width - this._dragPanSeries._maxOverflowValue + axisSize;
            maxTranslateX = axisSize;
          } else {
            minTranslateX = 0;
            maxTranslateX = this._dragPanSeries._maxOverflowValue - this._dragPanSeries.Width;
          }

          if (newTranslateX < minTranslateX) newTranslateX = minTranslateX;
          else if (newTranslateX > maxTranslateX) newTranslateX = maxTranslateX;
          this._dragPanSeries.setTranslateX(newTranslateX);

          if (this.isContentDirScrollbarOn()) {
            if (this._series[0] === this._dragPanSeries) {
              if (this.isRTL()) {
                if (seriesCount === 2)
                  newMin = this.getTimeAxisVisibleSize() + this._seriesSize - newTranslateX;
                else newMin = this.getTimeAxisVisibleSize() - newTranslateX;
                this.contentDirScrollbar[0].setViewportRange(newMin, newMin + this._seriesSize);
              } else
                this.contentDirScrollbar[0].setViewportRange(
                  newTranslateX,
                  newTranslateX + this._seriesSize
                );
            } else {
              if (this.isRTL())
                this.contentDirScrollbar[1].setViewportRange(
                  newTranslateX,
                  newTranslateX + this._seriesSize
                );
              else {
                newMin = this.getTimeAxisVisibleSize() + this._seriesSize - newTranslateX;
                this.contentDirScrollbar[1].setViewportRange(newMin, newMin + this._seriesSize);
              }
            }
          }
        }
        this.panZoomCanvasBy(deltaY);
        if (this._hasOverview)
          this._overview.setViewportRange(null, null, this._viewStartTime, this._viewEndTime);

        if (this.isTimeDirScrollbarOn())
          this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

        // Update time axis due to viewport change
        DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas, true);
      } else {
        // no horizontal pan in nav mode.
        if (!this.isDiscreteNavigationMode()) {
          this.panZoomCanvasBy(deltaX);
          if (this._hasOverview)
            this._overview.setViewportRange(this._viewStartTime, this._viewEndTime, null, null);

          if (this.isTimeDirScrollbarOn())
            this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

          // Update time axis due to viewport change
          DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas, true);
        }

        if (this._dragPanSeries) {
          var newTranslateY = this._dragPanSeries.getTranslateY() - deltaY;
          if (this._dragPanSeries._isInverted) {
            var minTranslateY =
              axisSize + 2 * this._dragPanSeries.Height - this._dragPanSeries._maxOverflowValue;
            var maxTranslateY = this._dragPanSeries.Height + axisSize;
          } else {
            minTranslateY = 0;
            maxTranslateY = this._dragPanSeries._maxOverflowValue - this._dragPanSeries.Height;
          }

          if (newTranslateY < minTranslateY) newTranslateY = minTranslateY;
          else if (newTranslateY > maxTranslateY) newTranslateY = maxTranslateY;
          this._dragPanSeries.setTranslateY(newTranslateY);

          if (this.isContentDirScrollbarOn()) {
            if (this._series[0] === this._dragPanSeries)
              this.contentDirScrollbar[0].setViewportRange(
                newTranslateY,
                newTranslateY + this._seriesSize
              );
            else {
              newMin = this.getTimeAxisVisibleSize() + this._seriesSize - newTranslateY;
              this.contentDirScrollbar[1].setViewportRange(newMin, newMin + this._seriesSize);
            }
          }
        }
      }
    }

    /**
     * Whether item move is enabled. (currently only duration-event item-type supported)
     * @return {boolean} whether item move is enabled.
     */
    isDnDMoveEnabled() {
      var dnd = this.Options['dnd'];
      return dnd && dnd['move']['items'] === 'enabled';
    }

    /**
     * Whether item resize is enabled. (currently only duration-event item-type supported)
     * @return {boolean} whether item resize is enabled.
     */
    isDnDResizeEnabled() {
      var dnd = this.Options['itemDefaults'];
      return dnd && dnd['resizable'] === 'enabled';
    }

    /**
     * @override
     */
    isDndEnabled() {
      var dndMoveEnabled = this.isDnDMoveEnabled();
      var dndResizeEnabled = this.isDnDResizeEnabled();
      return this.getEventManager().isDndSupported() && (dndMoveEnabled || dndResizeEnabled);
    }

    // event callback method
    HandleEvent(event, component) {
      var zoomLevelOrder, minLength, widthFactor, subtype;
      var i, j, s, item, itemId;
      var type = event['type'];
      if (type === 'dvtSimpleScrollbar') {
        event = this.processScrollbarEvent(event, component);
      } else if (type === 'selection') {
        // check for selection event, and handle accordingly
        this.dispatchEvent(event);
      } else if (type === 'overview') {
        subtype = event.subtype;
        if (subtype === 'rangeChanging' || subtype === 'rangeChange') {
          var oldViewTime = this._viewEndTime - this._viewStartTime;
          if (this._isVertical) {
            this._viewStartTime = event.newY1;
            this._viewEndTime = event.newY2;
          } else {
            this._viewStartTime = event.newX1;
            this._viewEndTime = event.newX2;
          }
          var viewTime = this._viewEndTime - this._viewStartTime;
          if (viewTime > 0) {
            widthFactor = this._canvasLength / viewTime;
            this.setContentLength(widthFactor * (this._end - this._start));
            this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
            var zoomLevelLengths = this._timeAxis.getZoomLevelLengths();
            if (oldViewTime > viewTime) {
              zoomLevelOrder = zoomLevelLengths.length;
              minLength = zoomLevelLengths[zoomLevelOrder - 1];
              while (this.getContentLength() >= minLength && zoomLevelOrder > 0) {
                zoomLevelOrder--;
                minLength = zoomLevelLengths[zoomLevelOrder - 1];
              }
              if (zoomLevelOrder === zoomLevelLengths.length) zoomLevelOrder--;
              this._timeAxis.setZoomLevelOrder(zoomLevelOrder);
              this._timeAxis.setScale(this._timeAxis.getZoomOrder()[zoomLevelOrder]);
            } else {
              zoomLevelOrder = 0;
              minLength = zoomLevelLengths[zoomLevelOrder];
              while (
                this.getContentLength() < minLength &&
                zoomLevelOrder < zoomLevelLengths.length - 1
              ) {
                zoomLevelOrder++;
                minLength = zoomLevelLengths[zoomLevelOrder];
              }
              this._timeAxis.setZoomLevelOrder(zoomLevelOrder);
              this._timeAxis.setScale(this._timeAxis.getZoomOrder()[zoomLevelOrder]);
            }
            this.applyAxisStyleValues();
            DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas, true);
            this.updateSeries();
            this.applyTimeZoomCanvasPosition();
          }
          if (subtype === 'rangeChange') this.dispatchEvent(this.createViewportChangeEvent());
        }
        if (subtype === 'scrollPos' || subtype === 'scrollTime') {
          if (this._isVertical) {
            this._viewStartTime = event.newY1;
            this._viewEndTime = event.newY2;
          } else {
            this._viewStartTime = event.newX1;
            this._viewEndTime = event.newX2;
          }
          widthFactor = this.getContentLength() / (this._end - this._start);
          this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
          this.applyTimeZoomCanvasPosition();

          // Update time axis due to viewport change
          DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas, true);

          this.dispatchEvent(this.createViewportChangeEvent());
        }
      } else if (type === 'timeline') {
        subtype = event.subtype;
        if (subtype === 'selection') {
          var selectedItemId = event.itemId;
          var isMultiSelect = event.isMultiSelect && this._selectionMode === 'multiple';
          for (i = 0; i < this._series.length; i++) {
            s = this._series[i];
            for (j = 0; j < s._items.length; j++) {
              item = s._items[j];
              if (dvt.Obj.compareValues(this.getCtx(), item.getId(), selectedItemId)) {
                this.EventManager.setFocusObj(item);
                this.updateScrollForItemSelection(item);
                // fire selection event if selection changed
                if (this.SelectionHandler._addToSelection(item, isMultiSelect))
                  this.EventManager.fireSelectionEvent(item);
                break;
              }
            }
          }
        } else if (subtype === 'highlight') {
          itemId = event.itemId;
          for (i = 0; i < this._series.length; i++) {
            s = this._series[i];
            for (j = 0; j < s._items.length; j++) {
              item = s._items[j];
              if (dvt.Obj.compareValues(this.getCtx(), item.getId(), itemId)) {
                item.showHoverEffect(true);
                break;
              }
            }
          }
        } else if (subtype === 'unhighlight') {
          itemId = event.itemId;
          for (i = 0; i < this._series.length; i++) {
            s = this._series[i];
            for (j = 0; j < s._items.length; j++) {
              item = s._items[j];
              if (dvt.Obj.compareValues(this.getCtx(), item.getId(), itemId)) {
                item.hideHoverEffect(true);
                break;
              }
            }
          }
        }
      }
    }

    /**
     * Adjusts viewport based on scrollbar event.
     * @param {object} event
     * @param {object} component The component that is the source of the event, if available.
     */
    processScrollbarEvent(event, component) {
      super.processScrollbarEvent(event, component);
      if (component === this.timeDirScrollbar) {
        // Update time axis due to viewport change
        DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas, true);
      }

      var newMin = event.newMin;
      if (component === this.contentDirScrollbar[0]) {
        if (this.isVertical()) {
          if (this._series.length === 2)
            this._series[0].setTranslateX(
              this.isRTL() ? this.getTimeAxisVisibleSize() + this._seriesSize - newMin : newMin
            );
          else
            this._series[0].setTranslateX(
              this.isRTL() ? this.getTimeAxisVisibleSize() - newMin : newMin
            );
        } else this._series[0].setTranslateY(newMin);
      } else if (component === this.contentDirScrollbar[1]) {
        if (this.isVertical())
          this._series[1].setTranslateX(
            this.isRTL() ? newMin : this.getTimeAxisVisibleSize() + this._seriesSize - newMin
          );
        else this._series[1].setTranslateY(this.getTimeAxisVisibleSize() + this._seriesSize - newMin);
      }
    }

    discreteScrollIntoViewport(item) {
      if (!this.isDiscreteNavigationMode()) {
        return;
      }
      this._verticalScrollIntoViewPort(item);
      var itemStartTime = item.getStartTime();
      var viewportIndexScroll = Math.floor(
        (itemStartTime - this._viewStartTime) / this._initialViewportTimeDuration
      );
      if (viewportIndexScroll !== 0) {
        this._discreteViewportCurrentIndexOffset += viewportIndexScroll;
        this.handlePageChangeDiscreteViewport();
      }
    }

    /**
     * Vertically scrolls the given item into view.
     * @param {DvtTimelineSeriesNode} item
     * @private
     */
    _verticalScrollIntoViewPort(item) {
      if (!this._isVertical) {
        // panBy() is being invoked and for vertical transalation _dragPanSeries needs to be set.
        this._dragPanSeries = item._series;
        var itemTop = item._displayable.getTranslateY();
        var itemBottom = itemTop + item.getHeight();
        var seriesCount = this._series.length;
        var axisSize = this.getTimeAxisVisibleSize(seriesCount);
        var viewTop = this._dragPanSeries._isInverted
          ? this._dragPanSeries.Height + axisSize - this._dragPanSeries.getTranslateY()
          : this._dragPanSeries._maxOverflowValue -
            (this._dragPanSeries.getTranslateY() + this._dragPanSeries.Height);
        var viewBottom = viewTop + this._dragPanSeries.Height;
        if (itemTop < viewTop) this.panBy(0, itemTop - viewTop);
        else if (itemBottom > viewBottom) this.panBy(0, itemBottom - viewBottom);

        this._dragPanSeries = null;
      }
    }

    updateScrollForItemSelection(item) {
      if (this.isDiscreteNavigationMode()) {
        this.discreteScrollIntoViewport(item);
        return;
      }
      var viewSize = this._viewEndTime - this._viewStartTime;
      this._viewStartTime = item.getStartTime() - viewSize / 2;
      if (this._viewStartTime < this._start) this._viewStartTime = this._start;
      else if (this._viewStartTime + viewSize > this._end) this._viewStartTime = this._end - viewSize;
      this._viewEndTime = this._viewStartTime + viewSize;
      var widthFactor = this.getContentLength() / (this._end - this._start);
      this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
      this.applyTimeZoomCanvasPosition();

      // Update time axis due to viewport change
      DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas);

      this.dispatchEvent(this.createViewportChangeEvent());
    }

    updateScrollForItemNavigation(item) {
      if (!(item instanceof DvtTimelineSeriesNode) || this.getEventManager()._isDndDragging) {
        return;
      }

      if (this.isDiscreteNavigationMode()) {
        this.discreteScrollIntoViewport(item);
        return;
      }

      var itemSize = this._isVertical ? item.getHeight() : item.getWidth();
      var itemHoverStrokeWidth = DvtTimelineStyleUtils.getItemHoverStrokeWidth(
        item._timeline.Options
      );
      var itemStart =
        item.getLoc() -
        (this._isVertical
          ? itemSize / 2 + itemHoverStrokeWidth
          : DvtTimelineStyleUtils.getBubbleOffset(this) + itemHoverStrokeWidth);
      var startPos = this.getRelativeStartPos();
      if (this.isRTL() && !this._isVertical) {
        itemStart = itemStart - itemHoverStrokeWidth;
      }
      var itemEnd = itemStart + itemSize + 2 * itemHoverStrokeWidth;
      var endPos = startPos - this._canvasLength;

      if (-itemStart > startPos) startPos = -itemStart;
      else if (-itemEnd < endPos) startPos = -itemEnd + this._canvasLength;

      var widthFactor = this.getContentLength() / (this._end - this._start);
      var viewTime = this._viewEndTime - this._viewStartTime;
      this._viewStartTime = this._start - startPos / widthFactor;
      if (this._viewStartTime < this._start) {
        this._viewStartTime = this._start;
        startPos = (this._start - this._viewStartTime) * widthFactor;
      }
      this._viewEndTime = this._viewStartTime + viewTime;
      if (this._viewEndTime > this._end) {
        this._viewEndTime = this._end;
        this._viewStartTime = this._viewEndTime - viewTime;
        startPos = (this._start - this._viewStartTime) * widthFactor;
      }
      this.setRelativeStartPos(startPos);
      this.applyTimeZoomCanvasPosition();
      this._verticalScrollIntoViewPort(item);

      if (this._hasOverview) {
        if (this._isVertical)
          this._overview.setViewportRange(null, null, this._viewStartTime, this._viewEndTime);
        else this._overview.setViewportRange(this._viewStartTime, this._viewEndTime, null, null);
      }
      if (this.isTimeDirScrollbarOn())
        this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

      // Update time axis due to viewport change
      DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas);

      this.dispatchEvent(this.createViewportChangeEvent());
    }

    isItemSelectionEnabled() {
      return this._selectionMode !== 'none';
    }

    isFeelerEnabled() {
      return this.Options['itemDefaults'] && this.Options['itemDefaults']['feelers'] === 'on';
    }

    applyInitialSelections() {
      if (this.Options['selection']) {
        var items = [];
        for (var i = 0; i < this._series.length; i++) {
          var s = this._series[i];
          for (var j = 0; j < s._items.length; j++) {
            items.push(s._items[j]);
          }
        }
      }
      this.SelectionHandler.processInitialSelections(this.Options['selection'], items);
    }

    _findSeries(target) {
      if (this.hasValidOptions() && target && target !== this) {
        var id = target.getId();
        if (target === this._series[0] || (this._series.length > 1 && target === this._series[1]))
          return target;
        if (id && id.substring(id.length - 3, id.length) === '_s0') return this._series[0];
        else if (id && id.substring(id.length - 3, id.length) === '_s1') return this._series[1];
        else return this._findSeries(target.getParent());
      }
      return null;
    }

    _findDrawable(target) {
      if (target) {
        var id = target.getId();
        if (id && id.substring(0, 10) === '_duration_' && target._node) return target;

        var parent = target.getParent();
        if (parent) {
          if (id && id.substring(0, 4) === 'zoom') return target;

          if (id && id.substring(0, 8) === '_bubble_' && parent._node) return parent;

          var grandParent = parent.getParent();
          if (grandParent) {
            if (id && id.substring(0, 8) === '_bubble_' && grandParent._node) return grandParent;

            id = grandParent.getId();
            if (id && id.substring(0, 8) === '_bubble_' && grandParent.getParent())
              return grandParent.getParent();
          }
        }
      }
      return null;
    }

    /**
     * Returns the automation object for this timeline
     * @return {dvt.Automation} The automation object
     */
    getAutomation() {
      if (!this.Automation) this.Automation = new DvtTimelineAutomation(this);
      return this.Automation;
    }

    /**
     * @override
     */
    clearComponent() {
      this.getEventManager().RemoveListeners(this);
      super.clearComponent();
      this.clearOverview();
    }

    /**
     * Removes the overview canvas from the timeline.
     */
    clearOverview() {
      if (this._overviewCanvas) {
        this.removeChild(this._overviewCanvas);
        this._overviewCanvas = null;
      }
    }

    /**
     * @override
     */
    isTimeDirScrollbarOn() {
      return !this._hasOverview && !this.isDiscreteNavigationMode();
    }

    /**
     * @override
     */
    isContentDirScrollbarOn() {
      return true;
    }

    /**
     * @override
     */
    isDiscreteNavigationMode() {
      return (
        this._viewportNavigationMode === 'discrete' &&
        this.getCtx().getThemeBehavior() === 'redwood' &&
        !this.isVertical()
      );
    }

    /**
     * Returns the background offset value of this component in the x direction.
     * @return {number} The background offset value of this component in the x direction.
     */
    getBackgroundXOffset() {
      return this._backgroundX;
    }

    /**
     * Sets the background offset value of this component in the x direction.
     * @param {number} backgroundX The background offset value of this component in the x direction.
     */
    setBackgroundXOffset(backgroundX) {
      this._backgroundX = backgroundX;
    }

    /**
     * Returns the discrete offset or 0 if not in discreteNavigationMode
     */
    getDiscreteOffset() {
      return this._discreteOffset ? this._discreteOffset : 0;
    }

    /**
     * Gets the date position for viewport boundary at given offset when using discrete viewport navigation mode.
     * @param {number} targetOffset The offset to check against
     * @return {Object} the viewport date positions in Object {startDate: viewportStart, endDate: viewportEnd}
     */
    getDiscreteViewportDateOffsetPos(targetOffset) {
      var startDate, endDate, newStartDate, newEndDate;
      var newStartIndex = this._discreteViewportStartIndex + targetOffset;

      if (newStartIndex < 0) {
        startDate = this._discreteViewportDatePositions[0];
        endDate = this._discreteViewportDatePositions[1];
        while (newStartIndex < 0) {
          // the start index is before the earliest currently stored start date.
          // need to loop to generate previous dates until we have enough
          var newStartDate = this.getClosestDate(startDate - this._initialViewportTimeDuration);
          this._discreteViewportDatePositions.unshift(newStartDate);
          endDate = startDate;
          startDate = newStartDate;

          // update start index and current offset
          this._discreteViewportStartIndex++;

          newStartIndex++;
        }
      } else if (newStartIndex > this._discreteViewportDatePositions.length - 2) {
        startDate =
          this._discreteViewportDatePositions[this._discreteViewportDatePositions.length - 2];
        endDate = this._discreteViewportDatePositions[this._discreteViewportDatePositions.length - 1];
        while (newStartIndex > this._discreteViewportDatePositions.length - 2) {
          var newEndDate = this.getClosestDate(endDate + this._initialViewportTimeDuration);
          this._discreteViewportDatePositions.push(newEndDate);
          startDate = endDate;
          endDate = newEndDate;
        }
      } else {
        startDate = this._discreteViewportDatePositions[newStartIndex];
        endDate = this._discreteViewportDatePositions[newStartIndex + 1];
      }
      return { startDate: startDate, endDate: endDate };
    }

    /**
     * Gets closest date to target date given the current time axis scale.
     * @param {number} date The date to check against
     */
    getClosestDate(date) {
      var getClosestDate = (date, scale) => {
        var dateBehind = this._timeAxis.adjustDate(date, scale);
        var dateAhead = this._timeAxis.getNextDate(dateBehind, scale);
        var closestDate = Date.parse(date - dateBehind > dateAhead - date ? dateAhead : dateBehind);
        return closestDate;
      };
      var closestMinorDate = getClosestDate(date);
      var closestMajorDate = getClosestDate(date, this.Options['majorAxis']['scale']);
      if (closestMajorDate != null) {
        return Math.abs(date - closestMinorDate) > Math.abs(date - closestMajorDate)
          ? closestMajorDate
          : closestMinorDate;
      }
    }

    /**
     * Gets the current viewport panning length when in discrete viewport navigation mode.
     * This length is shorter than the actual viewport length due to "preview wings"
     * @param {number} oldStartTime the old startTime
     * @param {number} newStartTime the new startTime
     * @return {number} the value: newStartTime - oldStartTime as distance in terms of the viewport
     */
    getDiscreteViewportPanningLength(oldStartTime, newStartTime) {
      var context = this.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var startDatePos = this.getDatePos(oldStartTime);
      var endDatePos = this.getDatePos(newStartTime);
      return (endDatePos - startDatePos) * (isRTL ? -1 : 1);
    }

    /**
     * Gets the position for the input date using discrete or regular content length based on viewport mode
     * @param {number} date the input date
     * @return {number} the position value
     */
    getDatePos(date) {
      var length = this.isDiscreteNavigationMode()
        ? this._discreteContentLength
        : this._contentLength;
      return ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(this._start, this._end, date, length);
    }

    /**
     * Gets the date for the input position using discrete or regular content length based on viewport mode
     * @param {number} position the input position
     * @return {number} the date value
     */
    getPosDate(position) {
      var length = this.isDiscreteNavigationMode()
        ? this._discreteContentLength
        : this._contentLength;
      return ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(this._start, this._end, position, length);
    }

    /**
     * Gets the position for the input date in discrete viewport mode
     * @param {number} date the input date
     * @return {number} the position value
     */
    getDiscreteViewportDatePos(date) {
      return ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(this._start, this._end, date, this._discreteContentLength);
    }

    /**
     * Gets the date for the input position in discrete viewport mode
     * @param {number} position the input position
     * @return {number} the date value
     */
    getDiscreteViewportPosDate(position) {
      return ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
        this._start,
        this._end,
        position,
        this._discreteContentLength
      );
    }

    /**
     * Gets the start date of the discrete viewport (includes preview wings)
     * @return {number} the start date
     */
    getDiscreteViewportStartDate() {
      var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
      var startDatePos = this.getDiscreteViewportDatePos(this._viewStartTime);
      var startDate = Math.max(
        this.getDiscreteViewportPosDate(startDatePos - navButtonBackgroundWidth),
        this._start
      );
      return startDate;
    }

    /**
     * Gets the end date of the discrete viewport (includes preview wings)
     * @return {number} the end date
     */
    getDiscreteViewportEndDate() {
      var navButtonBackgroundWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
      var endDatePos = this.getDiscreteViewportDatePos(this._viewEndTime);
      var endDate = Math.min(
        this.getDiscreteViewportPosDate(endDatePos + navButtonBackgroundWidth),
        this._end
      );
      return endDate;
    }

    /**
     * Update the viewport when in discrete viewport navigation mode.
     */
    updateDiscreteViewport() {
      DvtTimelineRenderer._renderAxis(this, this.getTimeZoomCanvas(), true);
      DvtTimelineRenderer._renderNavigationArrows(this, this.getTimeZoomCanvas());
      if (this._hasOverview) {
        DvtTimelineRenderer._renderOverview(this);
      }
      this.updateSeries();
      DvtTimelineRenderer._renderScrollbars(this);
    }

    /**
     * Handles page change event
     */
    handlePageChangeDiscreteViewport() {
      // calculate new start/end times
      var newDates = this.getDiscreteViewportDateOffsetPos(this._discreteViewportCurrentIndexOffset);

      if (newDates.startDate > this._start && newDates.endDate < this._end) {
        // calculate panning length amount
        var timeAxisLength = this.getDiscreteViewportPanningLength(
          this._viewStartTime,
          newDates.startDate
        );
        this.panZoomCanvasBy(timeAxisLength);

        // fix view start/end times since panZoomCanvasBy messes it up
        this._viewStartTime = newDates.startDate;
        this._viewEndTime = newDates.endDate;

        // update timeline with new viewport
        this.updateDiscreteViewport();

        // fire event
        this.dispatchEvent(this.createViewportChangeEvent());
      }
    }

    /**
     * Perform initial panning
     */
    doInitialPan() {
      var context = this.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      // do initial pan since it's calculated incorrectly using the original width
      var tempStart = this._viewStartTime;
      var tempEnd = this._viewEndTime;
      var adjustedViewStartTime = this.getDiscreteViewportStartDate();
      var initialPanOffset = this.getDiscreteViewportPanningLength(
        this._start,
        adjustedViewStartTime
      );
      if (isRTL) {
        var navButtonWidth = DvtTimelineStyleUtils.getNavButtonBackgroundWidth();
        var endDatePos = this.getDatePos(this._viewEndTime);
        var adjustedViewEndTime = this.getPosDate(endDatePos + navButtonWidth);
        initialPanOffset =
          this._discreteContentLength +
          this.getDiscreteViewportPanningLength(this._start, adjustedViewEndTime);
      }
      var adjustedOffset = initialPanOffset + this.getDiscreteOffset() + this._startPos;
      this.panZoomCanvasBy(adjustedOffset);
      this._viewStartTime = tempStart;
      this._viewEndTime = tempEnd;
    }

    /**
     * Check if viewport allowed to pan towards start
     * @return {boolean} true if viewport allowed to pan
     */
    startPanAllowed() {
      var earlierDates = this.getDiscreteViewportDateOffsetPos(
        this._discreteViewportCurrentIndexOffset - 1
      );
      return earlierDates.startDate > this._start;
    }

    /**
     * Check if viewport allowed to pan towards end
     * @return {boolean} true if viewport allowed to pan
     */
    endPanAllowed() {
      var laterDates = this.getDiscreteViewportDateOffsetPos(
        this._discreteViewportCurrentIndexOffset + 1
      );
      return laterDates.endDate < this._end;
    }
  }

  exports.Timeline = Timeline;
  exports.TimelineOverview = TimelineOverview;

  Object.defineProperty(exports, '__esModule', { value: true });

});
