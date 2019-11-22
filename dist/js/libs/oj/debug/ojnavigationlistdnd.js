/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojnavigationlist', 'ojs/ojlistviewdnd'], function(oj, $)
{
  "use strict";

/**
 * @ignore
 * @export
 * @class oj.NavigationListDndContext
 * @classdesc Drag and Drop Utils for ojNavigationList
 * @param {Object} navlist the NavigationList instance
 * @constructor
 */
  oj.NavigationListDndContext = function (navlist) {
    oj.NavigationListDndContext.superclass.constructor.call(this, navlist);
  };

  // Subclass from oj.ListViewDndContext
  oj.Object.createSubclass(oj.NavigationListDndContext,
                           oj.ListViewDndContext,
                           'oj.NavigationListDndContext');

  /**
   * Gets the default drag affordance marker class
   * @return {string} affordance marker class
   * @override
   * @protected
   */
  oj.NavigationListDndContext.prototype.GetDragAffordanceClass = function () {
    return 'oj-tabbar-drag-handle';
  };

  /**
   * Gets the drag Image class
   * @return {string} drag image class
   * @override
   * @protected
   */
  oj.NavigationListDndContext.prototype.GetDragImageClass = function () {
    return 'oj-tabbar-drag-image';
  };

  /**
   * Gets the drag Item class
   * @return {string} drag Item class
   * @override
   * @protected
   */
  oj.NavigationListDndContext.prototype.GetDragItemClass = function () {
    return 'oj-tabbar-drag-item';
  };

  /**
   * Gets the cut command style class
   * @return {string} cut command style class
   * @override
   * @protected
   */
  oj.NavigationListDndContext.prototype.GetCutStyleClass = function () {
    return 'oj-tabbar-cut';
  };

  /**
   * Gets the style class prefix
   * @return {string} style class prefix
   * @override
   * @protected
   */
  oj.NavigationListDndContext.prototype.GetCommandPrefix = function () {
    return 'oj-tabbar-';
  };

  /**
   * Return true to drag current item.
   * @return {boolean} true to drag current item.
   * @override
   */
  oj.NavigationListDndContext.prototype.shouldDragCurrentItem = function () {
    return true;
  };

  /**
   * Override to return the Drag image width.
   * @return {string} width
   * @protected
   * @override
   */
  oj.NavigationListDndContext.prototype.GetDragImageWidth = function (item) {
    var edge = this.listview.GetOption('edge');
    return (edge === 'top' || edge === 'bottom') ?
      item.offsetWidth :
      oj.NavigationListDndContext.superclass.GetDragImageWidth.call(this, item);
  };

  /**
   * overide to return drag source type.
   * @return {string} drag source type.
   * @protected
   * @ignore
   * @override
   */
  oj.NavigationListDndContext.prototype.GetDragSourceType = function () {
    return 'text/ojnavigationlist-dragsource-id';
  };

  /**
 * Returns payload object for reorder event.
 * @param {Array} items, items to be moved.
 * @param {string} position, the drop position relative to the reference item.
 * @param {Element} reference, the item where the moved items are drop on.
 * @returns {Object} payload object
 * @protected
 * @override
 */
  oj.NavigationListDndContext.prototype.CreateReorderPayload =
    function (items, position, reference) {
      return {
        item: items[0],
        position: position,
        reference: reference
      };
      // ignore other events
    };

  /**
   * Override to verify whether item reordering enabled or not
   * @protected
   * @override
   */
  oj.NavigationListDndContext.prototype.IsItemReOrdering = function () {
    var option = this.listview.GetOption('reorderable');
    return (option === 'enabled');
  };

  /**
   * Returns the default data type. Need to be overriden by navlist
   * @return {string} the default data type
   * @protected
   */
  oj.NavigationListDndContext.prototype.GetDefaultDataType = function () {
    return 'text/ojnavigationlist-items-data';
  };

  /**
   * Create and sets the drag image into the dataTransfer object
   * @param {Event} nativeEvent  DOM event object
   * @param {Array.<Element>} items array of row data
   * @protected
   */
  oj.NavigationListDndContext.prototype.SetDragItemImage = function (nativeEvent, items) {
    var left = Math.max(0, nativeEvent.offsetX);
    var top = Math.max(0, nativeEvent.offsetY);
    var clone = $(items[0].cloneNode(true));

    clone.removeClass('oj-selected oj-focus oj-focus-highlight  oj-hover')
      .addClass('oj-drag');
    var dragImage = $(document.createElement('div'));
    dragImage.get(0).className = this.listview.ojContext.element.get(0).className;
    dragImage.addClass(this.GetDragImageClass())
            .css({ width: this.GetDragImageWidth(items[0]),
              height: items[0].offsetHeight,
            })
            .append(clone); // @HTMLUpdateOK
    $('body').append(dragImage); // @HTMLUpdateOK
    this.m_dragImage = dragImage;
    nativeEvent.dataTransfer.setDragImage(dragImage.get(0), left, top);
  };

  /**
   * Returns cut items. Navlist overrides this.
   * @param {Event} event jQuery event
   * @returns {Array} array of items to be moved
   */
  // eslint-disable-next-line no-unused-vars
  oj.NavigationListDndContext.prototype.GetCutItems = function (event) {
    var items = [];
    items.push(this.m_contextMenuItem && this.m_contextMenuItem.length > 0 ?
               this.m_contextMenuItem[0] :
               this._getActiveItem());
    return items;
  };


});