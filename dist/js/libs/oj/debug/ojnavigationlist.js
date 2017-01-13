/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore','ojs/ojbutton','ojs/ojmenu','ojs/ojlistview'], 
       function(oj, $)
{

/**
 * Handler for Expanded Navigation List
 * @constructor
 * @ignore
 */
oj.DefaultNavListHandler = function (widget, root, component) {
  this.m_widget = widget;
  this.m_root = root;
  this.m_component = component;
};
/**
 * Restore Listview element
 * @private
 */
oj.DefaultNavListHandler.prototype.Destroy = function () {
  this.m_root.removeClass('oj-navigationlist-expanded oj-navigationlist-vertical');
};
/**
 * Expand group Item
 * @param {jQuery} groupItem  Group Item
 * @param {boolean} animate true if animate the expand operation, false otherwise
 * @param {Event} event the event that triggers expand.  Note that event could be null in the case where this is programmatically done by the widget
 * @return {Promise} A Promise that resolves when expand animation completes
 * @private
 */
oj.DefaultNavListHandler.prototype.Expand = function (groupItem, animate, event) {
  return Promise.resolve(null);
};

/**
 * Collapse group Item
 * @param {jQuery} item  Group Item
 * @param {Object} key key of Group item
 * @param {boolean} animate true if animate the collapse operation, false otherwise
 * @param {Event} event the event that triggers collapse.  Note that event could be null in the case where this is programmatically done by the widget
 * @return {Promise} A Promise that resolves when collapse animation completes
 * @private
 */
oj.DefaultNavListHandler.prototype.Collapse = function (item, key, animate, event) {
  return Promise.resolve(null);
};

/**
 * Handle keyboard events for expand and collapse
 * @private
 */
oj.DefaultNavListHandler.prototype.HandleExpandAndCollapseKeys = function (event, keyCode, current, currentItemKey) {
  return false;
};

/**
 * Mofify List item
 * @private
 */
oj.DefaultNavListHandler.prototype.ModifyListItem = function ($item, itemContent) {
  //Do nothing
};

/**
 * Update aria properties when an item is selected.
 * @private
 */
oj.DefaultNavListHandler.prototype.UpdateAriaPropertiesOnSelectedItem = function (elem, highlight) {
  elem.attr("aria-selected", highlight ? 'true' : 'false');
};

/**
 * Placeholder to override or update generated dom after completing rendering
 * @private
 */
oj.DefaultNavListHandler.prototype.BeforeRenderComplete = function () {
  var role = this.m_widget.element.attr("role"),
      roleOnRootNode = this.m_root.attr("role");
  if( role && role != "presentaion" && !roleOnRootNode ) {
    this.m_widget.element.attr('role','presentation');
    this.m_root.attr("role", role);
  }
};
/**
 * Called by content handler once the content of an item is rendered triggered by an insert event
 * @param {Element} elem the item element
 * @param {Object} context the context object used for the item
 * @private
 */
oj.DefaultNavListHandler.prototype.ItemInsertComplete = function (elem, context) {

};

/**
 * Called by content handler once the content of an item is removed triggered by an remove event
 * @param {Element} elem the item element
 * @private
 */
oj.DefaultNavListHandler.prototype.ItemRemoveComplete = function (elem) {

};
/**
 * Handles arrow keys navigation on item
 * @param {number} keyCode description
 * @param {boolean} isExtend
 * @param {Event} event the DOM event causing the arrow keys
 * @private
 */
oj.DefaultNavListHandler.prototype.HandleArrowKeys = function (keyCode, isExtend, event) {
  return _ojNavigationListView.superclass.HandleArrowKeys.apply(this.m_widget, arguments);
};

/**
 * Determine whether the key code is an arrow key
 * @param {number} keyCode
 * @return {boolean} true if it's an arrow key, false otherwise
 * @private
 */
oj.DefaultNavListHandler.prototype.IsArrowKey = function (keyCode) {
  return _ojNavigationListView.superclass.IsArrowKey.apply(this.m_widget, arguments);
};
/**
 * Determines whether the specified item is expanded
 * @param {jQuery} item the item element
 * @return {number} 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
 * @private
 */
oj.DefaultNavListHandler.prototype.GetState = function (item) {
  return _ojNavigationListView.superclass.GetState.apply(this.m_widget, arguments);
};
/**
 * Sets the disclosed state of the item
 * @param {jQuery} item the item element
 * @param {number} state 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
 * @private
 */
oj.DefaultNavListHandler.prototype.SetState = function (item, state) {
  _ojNavigationListView.superclass.SetState.apply(this.m_widget, arguments);
};

oj.DefaultNavListHandler.prototype.Init = function (opts) {
  this.m_root.addClass('oj-navigationlist-expanded oj-navigationlist-vertical');
};

/**
 * Check whether the item is selectable
 * @param {Element} item the item element
 * @return {boolean} true if item is selectable
 * @private
 */
oj.DefaultNavListHandler.prototype.IsSelectable = function (item) {
  return _ojNavigationListView.superclass.IsSelectable.apply(this.m_widget, arguments);
};

/**
 * Restore Item
 * @param {jQuery} item, List item
 * @param {jQuery} itemContent, Item contentelement
 * @param {jQuery} sublist, sub list when item is a group item.
 * @private
 */
oj.DefaultNavListHandler.prototype.RestoreItem = function (item, itemContent, sublist) {

};

/**
 * In case of sliding navigation List, Collapses the current visible list if it is not the top level list
 * @private
 */
oj.DefaultNavListHandler.prototype.CollapseCurrentList = function (event) {
  //DO Nothing
};

/**
 * Invoked when an option was updated after component initialization.
 * Note: This will be invoked only for specifc options. see setOptions method in NavigationList.js.
 * @private
 */
oj.DefaultNavListHandler.prototype.setOptions = function (options) {
  //DO Nothing
};

/**
 * Handler for blur event
 * @param {Event} event the blur event
 * @protected
 */
oj.DefaultNavListHandler.prototype.HandleBlur = function(event)
{
  return _ojNavigationListView.superclass.HandleBlur.apply(this.m_widget, arguments);
};

/**
 * Handler for focus event
 * @param {Event} event the focus event
 * @protected
 */
oj.DefaultNavListHandler.prototype.HandleFocus = function(event)
{
  return _ojNavigationListView.superclass.HandleFocus.apply(this.m_widget, arguments);
};

/**
 * Handler for Horizontal Navigation List
 * @constructor
 * @extends oj.DefaultNavListHandler
 * @ignore
 */

oj.HorizontalNavListHandler = function (widget, root, component) {
  oj.HorizontalNavListHandler.superclass.constructor.call(this, widget, root, component);
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.HorizontalNavListHandler, oj.DefaultNavListHandler, "oj.HorizontalNavListHandler");

oj.HorizontalNavListHandler.prototype.Destroy = function () {
  this.m_root.removeClass('oj-navigationlist-expanded oj-navigationlist-horizontal');
  this.m_root.find('.' + this.m_widget.DIVIDER_STYLE_CLASS).remove();
};

oj.HorizontalNavListHandler.prototype.UpdateAriaPropertiesOnSelectedItem = function (elem, highlight) {
  elem.attr('aria-pressed', highlight ? 'true' : 'false');
};

/**
 * Handles arrow keys navigation on item
 * @param {number} keyCode description
 * @param {boolean} isExtend
 * @param {Event} event the DOM event causing the arrow keys
 * @private
 */
oj.HorizontalNavListHandler.prototype.HandleArrowKeys = function (keyCode, isExtend, event) {
  //Change keyCode to reverse left/right arrow keys for rtl case.
  if (keyCode === $.ui.keyCode.LEFT) {
    keyCode = this.m_widget.isRtl() ? $.ui.keyCode.DOWN : $.ui.keyCode.UP;
  } else if (keyCode === $.ui.keyCode.RIGHT) {
    keyCode = this.m_widget.isRtl() ? $.ui.keyCode.UP : $.ui.keyCode.DOWN;
  }

  var processed = _ojNavigationListView.superclass.HandleArrowKeys.call(this.m_widget, keyCode, isExtend, event);
  if (this.m_widget.ojContext.options['edge'] === 'top') {
    var current = this.m_widget.m_active['elem'];
    current[0].scrollIntoView(false);
  }
  return processed;
};

/**
 *
 * @param {number} keyCode
 * @return {boolean}
 * @private
 */
oj.HorizontalNavListHandler.prototype.IsArrowKey = function (keyCode) {
  return (keyCode === this.m_widget.UP_KEY || keyCode === this.m_widget.DOWN_KEY || keyCode === this.m_widget.LEFT_KEY || keyCode === this.m_widget.RIGHT_KEY);
};

oj.HorizontalNavListHandler.prototype.ModifyListItem = function ($item, itemContent) {
  var focusableElement = this.m_widget.getSingleFocusableElement($item);
  focusableElement.attr('role', 'button');
  if (focusableElement[0].hasAttribute('aria-selected')) {
    focusableElement.attr('aria-pressed', 'false');
    focusableElement.removeAttr('aria-selected');
  }
};

oj.HorizontalNavListHandler.prototype.BeforeRenderComplete = function () {
  var self = this;
  this.m_root.attr('role', 'toolbar');
  this.m_widget.element.attr('role','presentation');
  this.m_widget.element.find('.' + this.m_widget.getItemElementStyleClass() + ':visible').each(function (index) {
    if (index > 0) {
      self._addSeparator(this, index);
    }
  });
};

oj.HorizontalNavListHandler.prototype._addSeparator = function (elem, index) {
  var $elem = $(elem);
  var previousElement = $elem.prev();
  if (index > 0 && $elem.is(':visible') && previousElement.length && !previousElement.is("li." + this.m_widget.DIVIDER_STYLE_CLASS)) {
    $elem.before('<li role="separator" class="' + this.m_widget.DIVIDER_STYLE_CLASS + '"></li>'); //@HTMLUpdateOK
  }

};

oj.HorizontalNavListHandler.prototype.ItemInsertComplete = function (elem, context) {
  this._addSeparator(elem, context.index);
};

oj.HorizontalNavListHandler.prototype.ItemRemoveComplete = function (elem) {
  var $elem = $(elem),
    previousElement = $elem.prev();
  if (previousElement.length && previousElement.is("li." + this.m_widget.DIVIDER_STYLE_CLASS)) {
    previousElement.remove();
  } else {
    // Means,this could be the first element,
    //so ensure that divider is not present on next element which is going to be the first one.
    //This is needed because when complete observable array is updated with new set of records, first new records will be added before removing old ones.
    var nextElement = $elem.next();
    if (nextElement.is("li." + this.m_widget.DIVIDER_STYLE_CLASS)) {
      nextElement.remove();
    }
  }
};

oj.HorizontalNavListHandler.prototype.IsSelectable = function (item) {
  return this.m_widget.getFocusItem($(item))[0].hasAttribute("aria-pressed");
};

oj.HorizontalNavListHandler.prototype.Init = function (opts) {
  this.m_root.addClass('oj-navigationlist-expanded oj-navigationlist-horizontal');
};

oj.HorizontalNavListHandler.prototype.RestoreItem = function (item, itemContent, sublist) {

};

/**
 * Handler for Collapsible Navigation List
 * @constructor
 * @extends oj.DefaultNavListHandler
 * @ignore
 */
oj.CollapsibleNavListHandler = function (widget, root, component) {
  oj.CollapsibleNavListHandler.superclass.constructor.call(this, widget, root, component);
};
// Subclass from oj.Object 
oj.Object.createSubclass(oj.CollapsibleNavListHandler, oj.DefaultNavListHandler, "oj.CollapsibleNavListHandler");

oj.CollapsibleNavListHandler.prototype.Destroy = function () {
  this.m_root.removeClass('oj-navigationlist-collapsible oj-navigationlist-vertical');
};

oj.CollapsibleNavListHandler.prototype.Init = function (opts) {
  this.m_root.addClass('oj-navigationlist-collapsible oj-navigationlist-vertical');
};

oj.CollapsibleNavListHandler.prototype.Expand = function (groupItem, animate, event) {
  return _ojNavigationListView.superclass.AnimateExpand.apply(this.m_widget, arguments);
};

oj.CollapsibleNavListHandler.prototype.Collapse = function (item, key, animate, event) {
  return _ojNavigationListView.superclass.AnimateCollapse.apply(this.m_widget, arguments);
};

oj.CollapsibleNavListHandler.prototype.HandleExpandAndCollapseKeys = function (event, keyCode, current, currentItemKey) {
  var isGroupItem = current.children('.' + this.m_widget.getGroupStyleClass()).length > 0;
  if (keyCode === this.m_widget.LEFT_KEY || keyCode === this.m_widget.RIGHT_KEY) {
    //Need to reverse left/right functionality  in rtl case
    if ((keyCode === this.m_widget.LEFT_KEY && !this.m_widget.isRtl()) || (keyCode === this.m_widget.RIGHT_KEY && this.m_widget.isRtl())) {
      if (this.m_widget.GetState(current) === this.m_widget.STATE_EXPANDED) {
        this.m_widget.CollapseItem(current, event, true, currentItemKey, true, true);
      }
    } else {
      if (this.m_widget.GetState(current) === this.m_widget.STATE_COLLAPSED) {
        this.m_widget.ExpandItem(current, event, true, currentItemKey, true, true, true);
      }
    }
    return true;
  }

  if (isGroupItem && (keyCode === $.ui.keyCode.ENTER || keyCode === $.ui.keyCode.SPACE)) {
    if (current.length <= 0) {
      return;
    }
    if (this.m_widget.GetState(current) === this.m_widget.STATE_COLLAPSED) {
      this.m_widget.ExpandItem(current, null, true, currentItemKey, true, true, true);
    } else if (this.m_widget.GetState(current) === this.m_widget.STATE_EXPANDED) {
      this.m_widget.CollapseItem(current, null, true, currentItemKey, true, true);
    }
    return true;
  }
  return false;
};

oj.CollapsibleNavListHandler.prototype.RestoreItem = function (item, itemContent, sublist) {

};

/**
 * Handler for Sliding Navigation List
 * @constructor
 * @extends oj.CollapsibleNavListHandler
 * @ignore
 */
oj.SlidingNavListHandler = function (widget, root, component) {
  oj.SlidingNavListHandler.superclass.constructor.call(this, widget, root, component);
  this.m_expanded = [];
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.SlidingNavListHandler, oj.CollapsibleNavListHandler, "oj.SlidingNavListHandler");

oj.SlidingNavListHandler.prototype.Destroy = function () {
  this.m_root.removeClass('oj-navigationlist-slider oj-navigationlist-vertical');
  this._toolbar.remove();
};
/**
 * Intiate Expand/collapse animation.
 *
 * @param {Object} item, item which is going to be expanded.
 * @param {boolean} isMovingNext true for expand animation and false for collapse animation.
 * @param {Object} focusableElement, focusable element after animation.
 * @param {Event} event the event that triggers sliding.  Note that event could be null in the case where this is programmatically done by the widget
 * @param {Function} animationResolve the resolve function that resolves the animation Promise
 */
oj.SlidingNavListHandler.prototype._slideAnimation = function (item, isMovingNext, focusableElement, event, animationResolve) {
  var self = this;
  var list_root = this.m_widget.getRootElement();
  var isRtl = this.m_widget.isRtl();
  var hasFocusAncestor = this.m_widget.getRootElement().hasClass("oj-focus-ancestor");
  var action, promise;

  action = isMovingNext ? "sliderExpand" : "sliderCollapse";
  promise = oj.AnimationUtils.startAnimation(list_root, action, this.m_widget.getAnimationEffect(action));
  promise.then(function () {
    self._slideAnimationComplete(item, isMovingNext, focusableElement, event, hasFocusAncestor);
    animationResolve(null);
  });
};

/**
 * Update ui after animation.
 *
 * @param {Object} item, item which is going to be expanded.
 * @param {boolean} isMovingNext true for expand animation and false for collapse animation
 * @param {Object|null} focusableElement, focusable element after animation.
 * @param {Event} event the event that triggers sliding.  Note that event could be null in the case where this is programmatically done by the widget
 * @param {boolean} needFocusAncestor, true if oj-focus-ancestor needs to be added after slide animation.
 * @private
 */
oj.SlidingNavListHandler.prototype._slideAnimationComplete = function (item, isMovingNext, focusableElement, event, needFocusAncestor) {
  if (this.m_widget.m_contentHandler === null) {
    return;
  }

  if (focusableElement) {
    if (needFocusAncestor) {
      this.m_widget.getRootElement().addClass("oj-focus-ancestor"); // during animation oj-focus-ancestor is being removed due triggering of focusout event. probably this is due to hiding of element user clicked on.
    }
    if (event && event.button === 0) {
      this.m_widget.AvoidFocusHighLight(true);
    }
    this.m_widget.HandleClickActive(focusableElement, event);
    this.m_widget.AvoidFocusHighLight(false);
  }
  if (!isMovingNext) {
    this.m_widget.AnimateCollapseComplete(item.children('.' + this.m_widget.getGroupStyleClass()));
  } else {
    this.m_widget.AnimateExpandComplete(item.children('.' + this.m_widget.getGroupStyleClass()));
  }
};

/**
 * Expand item in sliding navigation list
 * @param {Object} groupItem group item to be expanded
 * @param {boolean} animate flag to trigger animation or not
 * @param {Event} event the event that triggers expand.  Note that event could be null in the case where this is programmatically done by the widget
 * @return {Promise} A Promise that resolves when expand animation completes
 * @private
 */
oj.SlidingNavListHandler.prototype.Expand = function (groupItem, animate, event) {
  var animationResolve;
  var animationPromise = new Promise(function (resolve, reject) {
    animationResolve = resolve;
  });

  var target = $(groupItem).parents('.oj-navigationlist-item-element:first');
  var sublist = target.children('.' + this.m_widget.getGroupStyleClass()),
    parentLabel,
    nextFocusableItem = null;

  var currentListRoot = target.closest('.' + this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
  if (currentListRoot.length > 0) {
    //Move marker style class to expanded node only when it is child of an already expanded node.
    //It is possible that child is expanded before parent, in which we need should not remove marker class from child.
    //Ref , During initialization, listview expands child before parent which is causing the issue.
    currentListRoot.removeClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
    target.addClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
    nextFocusableItem = sublist.find('.' + this.m_widget.getItemElementStyleClass() + ':eq(0)');
    var listOfParents = target.parentsUntil(currentListRoot, 'ul');
    if (currentListRoot.is(this.m_widget.element)) {
      listOfParents = listOfParents.get().concat(currentListRoot.get());
    } else {
      listOfParents = listOfParents.get();
    }

    var self = this,
      itemNode;
    listOfParents = $(listOfParents.reverse());
    listOfParents.each(function (i, parentList) {
      if ($(parentList).is(self.m_widget.element)) {
        parentLabel = self.m_widget.getRootLabel();
      } else {
        parentLabel = self.m_widget.getItemLabel($(parentList).parent());
      }
      if (i === listOfParents.length - 1) {
        itemNode = target;
      } else {
        itemNode = $(listOfParents.get(i + 1)).parent();
      }
      self._addItemToHviewMenu(self.m_widget.GetKey(itemNode[0]), self.m_widget.getItemLabel(itemNode), parentLabel);
      // this var keeps a stack of expanded items
      self.m_expanded.push(itemNode);
    });
  }

  if (animate) {
    this._slideAnimation(target, true, nextFocusableItem, event, animationResolve);
  } else {
    this._slideAnimationComplete(target, true, nextFocusableItem, event, false);
    animationResolve(null);
  }

  //For ios, it is needed to set aria-hidden.
  target.siblings().attr('aria-hidden', 'true');
  target.children('.' + this.m_widget.getGroupItemStyleClass())
    .children('.' + this.m_widget.ITEM_CONTENT_STYLE_CLASS)
    .attr('aria-hidden', 'true');
  sublist.removeAttr('aria-hidden');

  // undo any display set by ListView
  groupItem.css("display", "");
  //Skip focus for group element
  target.addClass('oj-skipfocus');

  return animationPromise;
};

/**
 * Collapse item in sliding navigation list
 * @param {Object} target target list root
 * @param {Object} key the key of the group item
 * @param {boolean} animate flag to trigger animation or not
 * @param {Event} event the event that triggers collapse.  Note that event could be null in the case where this is programmatically done by the widget
 * @return {Promise} A Promise that resolves when collapse animation completes
 * @private
 */
oj.SlidingNavListHandler.prototype.Collapse = function (target, key, animate, event) {
  var animationResolve;
  var animationPromise = new Promise(function (resolve, reject) {
    animationResolve = resolve;
  });

  var currentList = target.children('.' + this.m_widget.getGroupStyleClass()),
    parentlist = target.parent();

  target.children('.' + this.m_widget.getGroupItemStyleClass())
    .children('.' + this.m_widget.ITEM_CONTENT_STYLE_CLASS)
    .removeAttr('aria-hidden');
  currentList.attr('aria-hidden', 'true');
  target.siblings().removeAttr('aria-hidden');

  //Enable focus for group element
  target.removeClass('oj-skipfocus');

  target.removeClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
  //While collapsing node, if any of parent is already having current style class then don't add again
  if (target.closest('.' + this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS).length === 0) {
    parentlist.closest('.' + this.m_widget.getItemElementStyleClass()).addClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
    if (this.m_widget.element.is(parentlist)) {
      this.m_widget.element.addClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
    }
  }

  if (animate) {
    this._slideAnimation(target, false, currentList.parent(), event, animationResolve);
  } else {
    this._slideAnimationComplete(target, false, currentList.parent(), event, false);
    animationResolve(null);
  }

  this._removeItemFromHviewMenu();

  return animationPromise;
};

oj.SlidingNavListHandler.prototype.UpdateAriaPropertiesOnSelectedItem = function (elem, highlight) {
  if (highlight) {
    elem.attr('aria-describedby', 'selectedLabel');
  } else {
    elem.removeAttr('aria-describedby');
  }
};
/**
 * Determines whether the specified item is expanded
 * @param {jQuery} item the item element
 * @return {number} 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
 * @private
 */
oj.SlidingNavListHandler.prototype.GetState = function (item) {
  var expanded = this.m_widget.getFocusItem(item).attr("aria-expanded");
  if (expanded === "true") {
    return this.m_widget.STATE_EXPANDED;
  }

  if (expanded === "false") {
    return this.m_widget.STATE_COLLAPSED;
  }
  return this.m_widget.STATE_NONE;
};
/**
 * Sets the disclosed state of the item
 * @param {jQuery} item the item element
 * @param {number} state 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
 * @private
 */
oj.SlidingNavListHandler.prototype.SetState = function (item, state) {
  if (state === this.m_widget.STATE_EXPANDED) {
    this.m_widget.getFocusItem(item)
      .attr("aria-expanded", "true");
    item.removeClass(this.m_widget.COLLAPSED_STYLE_CLASS)
      .addClass(this.m_widget.EXPANDED_STYLE_CLASS);

  } else if (state === this.m_widget.STATE_COLLAPSED) {
    this.m_widget.getFocusItem(item)
      .attr("aria-expanded", "false");
    item.removeClass(this.m_widget.EXPANDED_STYLE_CLASS)
      .addClass(this.m_widget.COLLAPSED_STYLE_CLASS);
  }
};

oj.SlidingNavListHandler.prototype.ModifyListItem = function ($item, itemContent) {
  var focusableElement = this.m_widget.getFocusItem($item);

  focusableElement.attr('role', 'menuitem');
  if (!itemContent.attr('id')) {
    itemContent.uniqueId();
  }
  // Ensure that it collapses all nodes.
  var groupItems = $item.children('.' + this.m_widget.getGroupStyleClass());
  if (groupItems.length > 0) {
    focusableElement.attr('aria-haspopup', 'true');
    groupItems.attr('role', 'menu');
    groupItems.css("display", "");
    $item.removeAttr('aria-expanded');
    focusableElement.attr('aria-expanded', 'false');
  }
};

oj.SlidingNavListHandler.prototype.BeforeRenderComplete = function () {
  this.m_root.attr('role', 'menu');
  this.m_widget.element.attr('role','presentation');
};

oj.SlidingNavListHandler.prototype.Init = function (opts) {
  this.m_root.addClass('oj-navigationlist-slider oj-navigationlist-vertical');
  opts.element.addClass('oj-navigationlist-current');
  this._buildSlidingNavListHeader(opts);
  this._initializeHierarchicalView();
};
/**
 * Initialize sliding navigation list header .
 * @private
 * @memberof! oj.ojNavigationList
 */
oj.SlidingNavListHandler.prototype._buildSlidingNavListHeader = function (opts) {
  var selectedLabel;
  this._toolbar = $(document.createElement('div'));
  this._toolbar.addClass('oj-navigationlist-toolbar');
  this._previousLink = $(document.createElement('a'));
  this._prevButton = $(document.createElement('a'));
  this._prevButton.addClass('oj-navigationlist-previous-button');
  this._prevButton.css('visibility', 'hidden')
                  .attr('tabindex', '-1'); // @HTMLUpdateOK
  this._previousLink.addClass('oj-navigationlist-previous-link')
    .attr('tabindex', '-1'); // @HTMLUpdateOK
  this._headerLabel = $(document.createElement('label'));
  this._headerLabel.addClass('oj-navigationlist-current-header')
    .text(this.m_widget.getRootLabel());
  this._vSeparator = $(document.createElement('span'));
  this._vSeparator.attr('role', 'separator')// @HTMLUpdateOK
    .attr('aria-orientation', 'vertical')// @HTMLUpdateOK
    .addClass('oj-navigationlist-toolbar-separator');
  this._hviewBtn = $(document.createElement('button'));
  this._hviewBtn.addClass('oj-navigationlist-hierarchical-button')
                .attr('tabindex', '-1');// @HTMLUpdateOK
  this._hviewMenu = $(document.createElement('ul'));
  this._hviewMenu.addClass('oj-navigationlist-hierarchical-menu').hide();
  selectedLabel = $(document.createElement('label'));
  selectedLabel.addClass('oj-helper-hidden-accessible')
    .attr('aria-hidden', 'true')// @HTMLUpdateOK
    .attr('id', 'selectedLabel');// @HTMLUpdateOK
  selectedLabel.text(this.m_component.getTranslatedString('selectedLabel'));
  this._previousLink.append(this._headerLabel); // @HTMLUpdateOK
  this._toolbar.append(this._prevButton); // @HTMLUpdateOK
  this._toolbar.append(this._previousLink) // @HTMLUpdateOK
    .append(this._vSeparator) // @HTMLUpdateOK
    .append(this._hviewBtn) // @HTMLUpdateOK
    .append(this._hviewMenu) // @HTMLUpdateOK
    .append(selectedLabel); // @HTMLUpdateOK
  this.m_root.prepend(this._toolbar); // @HTMLUpdateOK
  this._showOrHideHierarchyMenu(opts.hierarchyMenuDisplayThresholdLevel);
};

/**
 * In case of sliding navigation List, Collapses the current visible list if it is not the top level list
 * @private
 */
oj.SlidingNavListHandler.prototype.CollapseCurrentList = function (event) {
  // pop the expanded item stack
  var current = this.m_expanded.pop();
  if (current) {
    this.m_widget.CollapseItem(current, event, true, null, true, true);
  }
};



/**
 * Initialize hierarchical view for sliding navlist.
 * @private
 * @memberof! oj.ojNavigationList
 */
oj.SlidingNavListHandler.prototype._initializeHierarchicalView = function () {
  var self = this,
    menuid = this._hviewMenu.uniqueId().attr('id');
  this._hviewMenu.ojMenu({
    openOptions: {
      position: {
        "my": "end top",
        "at": "end bottom"
      }
    },
    select: function (event, ui) {
      var itemsToRemove = ui.item.nextAll(),
        currentKey,
        item,
        expandedItems = self.m_expanded,
        targetItemKey = ui.item.data('key');
      //collapse all child lists untill target list is visible
      while (expandedItems.length > 0) {
        item = expandedItems.pop(); // remove item from list
        currentKey = self.m_widget.GetKey(item[0]);
        self.m_widget.CollapseItem($(item), event, true, currentKey, true, true);
        if (targetItemKey === currentKey) {
          break;
        }
      }
      itemsToRemove.remove();
      ui.item.remove();
      self._hviewMenu.ojMenu('refresh');
    }
  });
  this._hviewBtn.ojButton({
    'label': this.m_component.getTranslatedString('hierMenuBtnLabel'),
    'display': 'icons',
    'icons': {
      start: 'oj-fwk-icon oj-hier-icon'
    },
    'menu': '#' + menuid,
    'disabled': true,
    'chroming': 'half'
  });

  this._prevButton.ojButton({
    'label': this.m_component.getTranslatedString('previousIcon'),
    'display': 'icons',
    'icons': {
      start: 'oj-navigationlist-previous-icon oj-component-icon oj-clickable-icon-nocontext'
    },
    'chroming': 'half'
  });
};

/**
 * Add current visible group item to hierarchical menu and update header text with new list's label.
 * @param {string} itemKey key of the group item whose list will be displayed
 * @param {string} label current list's label
 * @param {string} parentLabel parent list's label
 * @private
 */
oj.SlidingNavListHandler.prototype._addItemToHviewMenu = function (itemKey, label, parentLabel) {
  var i;
  if (this._hviewBtn) {
    var itemsinTree = this._hviewMenu.find('li').length;
    var menuListItem = $(document.createElement('li'));
    var menuItem = $(document.createElement('a'));
    menuItem.attr('href', '#');// @HTMLUpdateOK
    menuListItem.append(menuItem); // @HTMLUpdateOK
    if (itemsinTree > 0) {
      for (i = 0; i < itemsinTree; i++) {
        if (i > 0) {
          menuItem.append($(document.createElement('span')) // @HTMLUpdateOK
            .addClass('oj-navigationlist-hvitem-space'));
        }
      }
      menuItem.append($(document.createElement('span')) // @HTMLUpdateOK
        .addClass('oj-menu-item-icon oj-icon oj-navigationlist-level-indicator'));
    }
    var menuItemLabel = $(document.createElement('span'))
      .addClass('oj-navigationlist-hierarchical-menu-label');
    menuItemLabel.text(parentLabel);
    menuItem.append(menuItemLabel); // @HTMLUpdateOK

    //Store item key reference to refresh the list when user clicks on  hiearchical menu item.
    menuListItem.data('key', itemKey);
    this._hviewMenu.append(menuListItem); // @HTMLUpdateOK

    this._hviewMenu.ojMenu('refresh');
    this._showOrHideHierarchyMenu(this.m_widget.GetOption('hierarchyMenuDisplayThresholdLevel'));
    this._hviewBtn.ojButton("option", "disabled", false);
    this._prevButton.css('visibility', 'visible');
    if (this.m_widget.getRootElement().hasClass('oj-focus-ancestor')) {
       this._prevButton.attr('tabindex', '0');// @HTMLUpdateOK
    }
    this._headerLabel.text(label);
  }
};
oj.SlidingNavListHandler.prototype.setOptions = function (options) {
  var currentHMenuDisplayThreshold = this.m_widget.GetOption('hierarchyMenuDisplayThresholdLevel');
  if (currentHMenuDisplayThreshold !== options['hierarchyMenuDisplayThresholdLevel']) {
    this._showOrHideHierarchyMenu(options.hierarchyMenuDisplayThresholdLevel);
  }
};
oj.SlidingNavListHandler.prototype._showOrHideHierarchyMenu = function (hierarchyMenuDisplayThresholdLevel) {
  var itemsinTree = this._hviewMenu.find('li').length;
  if (hierarchyMenuDisplayThresholdLevel === -1 || itemsinTree < hierarchyMenuDisplayThresholdLevel) {
    this._vSeparator.css('visibility', 'hidden');
    if(this._hviewBtn[0] === document.activeElement) { // is(:focus) failing during test cases so using document.activeElement.
      //tried by moving focus to <ul> using  this.m_widget.focus() but listview listen for focusin event.
      this.m_root.focusin();
    }
    this._hviewBtn.css('visibility', 'hidden');
  } else if (itemsinTree >= hierarchyMenuDisplayThresholdLevel) {
    this._vSeparator.css('visibility', 'visible');
    this._hviewBtn.css('visibility', 'visible');
  }
};
/**
 * Removes parent item of current list from hierarchical menu
 * otherwise return the emptyText set in the options
 * @private
 */
oj.SlidingNavListHandler.prototype._removeItemFromHviewMenu = function () {
  if (this._hviewBtn) {
    var removed = this._hviewMenu.find('li').last().remove();
    this._hviewMenu.ojMenu('refresh');
    this._showOrHideHierarchyMenu(this.m_widget.GetOption('hierarchyMenuDisplayThresholdLevel'));
    if (this._hviewMenu.children('li').length === 0) {
      this._hviewBtn.ojButton("option", "disabled", true);
      this._prevButton.css('visibility', 'hidden');
      this._prevButton.attr('tabindex', '-1');// @HTMLUpdateOK
      this._headerLabel.text(this.m_widget.getRootLabel());
    } else {
      this._headerLabel.text(removed.children('a').text());
    }
  }
};

oj.SlidingNavListHandler.prototype.RestoreItem = function (item, itemContent, sublist) {
  item.removeClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
  itemContent.removeAttr('role')
    .removeAttr('aria-expanded')
    .removeAttr('aria-describedby')
    .removeAttr('aria-hidden');
};

oj.SlidingNavListHandler.prototype._makeToolbarItemsFocusable = function (enable) {
  var itemsinTree;
  if (enable) {
    itemsinTree = this._hviewMenu.find('li').length;
    if (itemsinTree) {
      this._prevButton.attr('tabindex', '0');// @HTMLUpdateOK
    }
    this._hviewBtn.attr('tabindex', '0');// @HTMLUpdateOK
  } else {
    this._prevButton.attr('tabindex', '-1');// @HTMLUpdateOK
    this._hviewBtn.attr('tabindex', '-1');// @HTMLUpdateOK
  }
};
/**
 * Handler for focus event
 * @param {Event} event the focus event
 * @protected
 * @override
 */
oj.SlidingNavListHandler.prototype.HandleFocus = function (event) {
  //If focus is on navlist or items but not on toolbar
  if (!($.contains(this._toolbar.get(0), /** @type {Element} */ (event.target)) ||
      this._hviewMenu.get(0) === /** @type {Element} */ (event.relatedTarget))) {
    //make toolbar items focusable
    this._makeToolbarItemsFocusable(true);
    _ojNavigationListView.superclass.HandleFocus.apply(this.m_widget, arguments);
  }

};

/**
 * Handler for blur event
 * @param {Event} event the blur event
 * @protected
 * @override
 */
oj.SlidingNavListHandler.prototype.HandleBlur = function (event) {
  //If focus going to toolbar remove focus ancestor and unhighlight the active one
  if ($.contains(this._toolbar.get(0), /** @type {Element} */ (event.relatedTarget)) ||
    this._hviewMenu.get(0) === /** @type {Element} */ (event.relatedTarget)) {
    this.m_widget.UnhighlightActive();
  } else {
    // if focus moves out side navlist make toolbar items not focusable
    if (event.relatedTarget == null || !$.contains(this.m_root.get(0), /** @type {Element} */ (event.relatedTarget))) {
      this._makeToolbarItemsFocusable(false);
    }
    _ojNavigationListView.superclass.HandleBlur.apply(this.m_widget, arguments);

  }
};

/**
 * todo: create common utility class between combobox, listview and navlist
 * @private
 */
var _NavigationListUtils = {
  clazz: function (SuperClass, methods) {
    var constructor = function () {};
    oj.Object.createSubclass(constructor, SuperClass, '');
    $.extend(constructor.prototype, methods);
    return constructor;
  }
};
/**
 * @export
 * @class _ojNavigationListView
 * @classdesc NavigationList
 * @constructor
 * @ignore
 */
var _ojNavigationListView = _NavigationListUtils.clazz(oj._ojListView,
  /** @lends _ojNavigationListView.prototype */
  {

    ITEM_CONTENT_STYLE_CLASS: 'oj-navigationlist-item-content',
    EXPANDED_STYLE_CLASS: 'oj-expanded',
    COLLAPSED_STYLE_CLASS: 'oj-collapsed',
    SLIDING_NAVLIST_CURRENT_STYLE_CLASS: 'oj-navigationlist-current',
    DIVIDER_STYLE_CLASS: 'oj-navigationlist-divider',
    _CATEGORY_DIVIDER_STYLE_CLASS: 'oj-navigationlist-category-divider',
    _ITEM_LABEL_STYLE_CLASS: 'oj-navigationlist-item-label',
    _ICON_ONLY_STYLE_CLASS: 'oj-navigationlist-icon-only',
    _ITEM_ICON_STYLE_CLASS: 'oj-navigationlist-item-icon',
    _HORIZONTAL_NAVLIST_STYLE_CLASS: 'oj-navigationlist-horizontal',
    _NAVLIST_HAS_ICONS: 'oj-navigationlist-has-icons',
    _NAVLIST_ITEM_HAS_NO_ICON: 'oj-navigationlist-item-no-icon',
    _NAVLIST_ITEM_TITLE: 'oj-navigationlist-item-title',
    _NAVLIST_STYLE_CLASS: 'oj-navigationlist',
    _NAVLIST_TOUCH_STYLE_CLASS: 'oj-navigationlist-touch',
    _NAVLIST_LISTVIEW_CONTAINER_STYLE_CLASS: 'oj-navigationlist-listview-container',
    _IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION: 'IsTitleAttrDueToTruncation',
    _APPLICATION_LEVEL_NAV_STYLE_CLASS: 'oj-navigationlist-app-level',
    _PAGE_LEVEL_NAV_STYLE_CLASS: 'oj-navigationlist-page-level',
    _NAVLIST_ITEM_ICON_HAS_TITLE: 'navigationListItemIconHastitle',
    _NAVLIST_NO_FOLLOW_LINK_CLASS: 'oj-navigationlist-nofollow-link',
    /**
     * Returns Item label text
     * @returns {string|null} Item label
     */
    getItemLabel: function (target) {
      var itemContent = this.getItemContentElement(target);
      if (itemContent.is('a')) { // When using simple <a> markup
        return $.trim(itemContent.text());
      }
      //When using arbitrary content, extract item title from element having marker class .oj-navigationlist-item-title.
      return $.trim(itemContent.find('.' + this._NAVLIST_ITEM_TITLE).text());
    },
    /**
     * Returns Item content root element.
     * @returns {Object} Returns jquery object for item content root
     */
    getItemContentElement: function (item) {
      var itemContent = item.children('.' + this.ITEM_CONTENT_STYLE_CLASS);
      if (itemContent.length === 0) {
        itemContent = item.children('.' + this.getGroupItemStyleClass()).children('.' + this.ITEM_CONTENT_STYLE_CLASS);
        if (itemContent.length === 0) { //This case is when item label is invoked before complete initialization of listview
          itemContent = item.children('.' + this.getGroupItemStyleClass()).children(':not(.' + this.getExpandIconStyleClass() + '):not(.' + this.getCollapseIconStyleClass() + ')');
        }
      }
      return itemContent;
    },
    /**
     * Return true when page is in rtl mode otherwise false.
     * @returns {boolean} true if page is in rtl mode
     */
    isRtl: function () {
      return this.ojContext._GetReadingDirection() === "rtl";
    },
    /**
     * Called by content handler once content of all items are rendered
     * @override
     */
    renderComplete: function () {
      this.m_listHandler.BeforeRenderComplete();
      _ojNavigationListView.superclass.renderComplete.apply(this, arguments);
    },
    /**
     * Called by content handler once the content of an item is rendered triggered by an insert event
     * @param {Element} elem the item element
     * @param {Object} context the context object used for the item
     */
    itemInsertComplete: function (elem, context) {
      this.m_listHandler.ItemInsertComplete(elem, context);
    },

    /**
     * Called by content handler once the content of an item is removed triggered by an remove event
     * @param {Element} elem the item element
     */
    itemRemoveComplete: function (elem) {
      this.m_listHandler.ItemRemoveComplete(elem);
      _ojNavigationListView.superclass.itemRemoveComplete.apply(this, arguments);
    },
    /**
     * Restore content while restroying list
     * @private
     */
    _restoreContent: function (list) {
      var i, item, itemContent, itemIcon, focusableItem, sublist, items = list.children();
      list.removeAttr('style')
        .removeClass(this._NAVLIST_HAS_ICONS)
        .removeAttr('aria-hidden');
      for (i = 0; i < items.length; i++) {
        item = items[i];
        item = $(item);
        if (item.hasClass(this.DIVIDER_STYLE_CLASS)) {
          item.remove();
          continue;
        }
        itemContent = this.getItemContentElement(item);
        itemContent.removeClass(this.ITEM_CONTENT_STYLE_CLASS)
          .removeClass(this._NAVLIST_ITEM_HAS_NO_ICON)
          .removeAttr('aria-haspopup');
        itemIcon = itemContent.children('.' + this._ITEM_ICON_STYLE_CLASS);
        if (itemIcon && itemIcon.length > 0) {
          itemIcon.removeAttr('role');
          itemIcon.removeAttr('aria-label');
          this._removeToolTipOnIcon(itemIcon);
        }

        item.removeClass('oj-default')
          .removeAttr('role')
          .removeAttr('aria-disabled')
          .removeAttr('aria-expanded')
          .removeAttr('aria-hidden')
          .removeAttr('aria-pressed');
        focusableItem = this.getFocusItem(item);
        focusableItem.removeAttr('role')
          .removeAttr('aria-hidden')
          .removeAttr('aria-pressed');
        itemContent.children('.' + this._ITEM_LABEL_STYLE_CLASS)
          .contents().unwrap();
        if (focusableItem.data(this._IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION)) {
          focusableItem.removeAttr('title');
        }
        sublist = item.children('ul');
        if (sublist.length > 0) {
          this.m_listHandler.RestoreItem(item, itemContent, sublist);
          this._restoreContent(sublist);
        } else {
          this.m_listHandler.RestoreItem(item, itemContent);
        }
      }
    },
    /**
     * Overriding to exclude oj-navigationlist-item-content from clickable components.
     * @override
     * @protected
     */
    IsNodeEditableOrClickable: function (node) {
      if (node.hasClass(this.ITEM_CONTENT_STYLE_CLASS) || node.hasClass(this.getExpandIconStyleClass()) || node.hasClass(this.getCollapseIconStyleClass())) {
        return false;
      }
      return _ojNavigationListView.superclass.IsNodeEditableOrClickable.apply(this, arguments);
    },
    /**
     * checks for whether a node is editable or clickable.
     * @param {jQuery} node  Node
     * @return {boolean} true or false
     * @override
     * @protected
     */
    IsElementEditableOrClickable: function (node) {
      var nodeName = node.prop("nodeName");
      //Exclude navlist item content <a> tag from below list and also checking for oj-component class as it is needed for toggle button.
      return (nodeName.match(/^INPUT|SELECT|OPTION|BUTTON|^A\b|TEXTAREA/) && !node.hasClass(this.ITEM_CONTENT_STYLE_CLASS)) || node.hasClass('oj-component');
    },
    /**
     * Prepare options to initialize List
     * @private
     */
    _prepareListViewOptions: function (navlistOptions) {

      var opts = {
        drillMode: navlistOptions['drillMode'] !== 'none' ? 'collapsible' : 'none',
        selection: navlistOptions['selection'] !== null ? [navlistOptions['selection']] : [],
        item: navlistOptions['item'],
        data: navlistOptions['data'],
        selectionMode: 'single'
      };
      opts.element = this._list;
      opts.item.focusable = function (context) {
        if ($(context['data']).is('li')) {
          return !$(context['data']).hasClass('oj-disabled');
        }
        return !$(context['parentElement']).hasClass('oj-disabled');
      };
      opts = $.extend($.extend({}, navlistOptions), opts);
      return opts;
    },
    /**
     * Returns root label for navigation list.
     * otherwise return the emptyText set in the options
     * @return {string} Label for navigation list
     */
    getRootLabel: function () {
      if (this.ojContext.options['rootLabel']) {
        return this.ojContext.options['rootLabel'];
      }

      return this.ojContext.getTranslatedString('defaultRootLabel');
    },

    /**
     * Sets wai-aria properties on root element
     * @override
     * @protected
     */
     SetAriaProperties: function () {
        this.ojContext.element.attr("aria-multiselectable", false);
     },

    /**
    * Handler for focus event
    * @param {Event} event the focus event
    * @protected
    * @override
    */
   HandleFocus: function(event)
   {
     return this.m_listHandler.HandleFocus(event);
   },

   /**
    * Handler for blur event
    * @param {Event} event the blur event
    * @protected
    * @override
    */
   HandleBlur: function(event)
   {
     return this.m_listHandler.HandleBlur(event);
   },

   /**
    * Sets the tab index attribute of the root element
    * @override
    */
   SetRootElementTabIndex: function()
   {
       this.ojContext.element.attr("tabIndex", 0);
   },

   /**
    * Removes the tab index attribute of the root element
    * @override
    */
   RemoveRootElementTabIndex: function()
   {
       this.ojContext.element.removeAttr("tabIndex");

   },

    /**
     * Removes wai-aria properties on root element
     * @override
     * @protected
     */
     UnsetAriaProperties: function () {
       this.ojContext.element.removeAttr("aria-activedescendant")
                   .removeAttr("aria-multiselectable");
     },

    /**
     * Overriding init to initialize list with respective List handler.
     * @override
     */
    init: function (navlistopts) {
      var opts,
        self = this,
        element = navlistopts.ojContext.element;
      element.addClass(this._NAVLIST_STYLE_CLASS);

      if (oj.DomUtils.isTouchSupported()) {
        element.addClass(this._NAVLIST_TOUCH_STYLE_CLASS);
      }

      this._list = element.children('ul:first');
      if (this._list.length === 0) {
        this._list = $(document.createElement("ul"));
        element.append(this._list); //@HTMLUpdateOK
      }
      var listViewContainer = $(document.createElement("div"));
      listViewContainer.addClass(this._NAVLIST_LISTVIEW_CONTAINER_STYLE_CLASS);
      this._list.wrap(listViewContainer); // @HTMLUpdateOK
      opts = this._prepareListViewOptions(navlistopts);

      _ojNavigationListView.superclass.init.call(this, opts);
      this.element.removeClass('oj-component-initnode');
      this.ojContext._on(this.ojContext.element, {
        "mouseup": function (event) {
          self._clearActiveState(event);
        },
        "click .oj-navigationlist-previous-link": function (event) {
          self._collapseCurrentList(event);
        },
        "keydown .oj-navigationlist-previous-link": function (event) {
          if (event.keyCode === $.ui.keyCode.ENTER) {
            self._collapseCurrentList(event);
          }
        },
        "click .oj-navigationlist-previous-button": function (event) {
          self._collapseCurrentList(event);
        },
        "keydown .oj-navigationlist-previous-button": function (event) {
          if (event.keyCode === $.ui.keyCode.ENTER) {
            self._collapseCurrentList(event);
          }
        },
        "keydown .oj-navigationlist-element": function (event) {
          //check for default prevented as it might have already processed for quiting f2 mode
          if (event.keyCode === $.ui.keyCode.ESCAPE && !event.isDefaultPrevented()) {
            self._collapseCurrentList(event);
          }
        },
        "mouseenter a.oj-navigationlist-item-content": function (event) {
          var $itemLink = $(event.currentTarget);
          var $label = $itemLink.find('.' + self._ITEM_LABEL_STYLE_CLASS);
          //Add title attribute only when the text is truncated.
          if ($label[0].offsetWidth < $label[0].scrollWidth && !$itemLink.attr('title')) {
            $itemLink.attr('title', $label.text().trim());
            $itemLink.data(self._IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION, 'true');
          }
        },
        "mouseleave a.oj-navigationlist-item-content": function (event) {
          //Remove title attribute on mouseleave.
          var $itemLink = $(event.currentTarget);
          if ($itemLink.data(self._IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION)) {
            $itemLink.removeData(self._IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION);
            $itemLink.removeAttr('title');
          }
          self._clearActiveState(event);
        }
      });
    },
    _collapseCurrentList: function (event) {
      this.m_listHandler.CollapseCurrentList(event);
    },
    _initListHandler: function () {
      var drillMode = this.ojContext.options['drillMode'];
      var edge = this.ojContext.options['edge'];
      if (drillMode === 'sliding') {
        this.m_listHandler = new oj.SlidingNavListHandler(this, this.ojContext.element, this.ojContext);
      } else if (drillMode === 'collapsible') {
        this.m_listHandler = new oj.CollapsibleNavListHandler(this, this.ojContext.element, this.ojContext);
      } else if (drillMode === 'none' && edge === 'top') {
        this.m_listHandler = new oj.HorizontalNavListHandler(this, this.ojContext.element, this.ojContext);
      } else {
        this.m_listHandler = new oj.DefaultNavListHandler(this, this.ojContext.element, this.ojContext);
      }
      this.m_listHandler.Init(this.options);
      var navigationLevel = this.ojContext.options['navigationLevel'];
      this._setNavigationLevel(navigationLevel);
    },
    _setNavigationLevel: function (navigationLevel) {
      var drillMode = this.ojContext.options['drillMode'];
      if (drillMode === 'none') {
        if (navigationLevel === 'application') {
          this.ojContext.element.addClass(this._APPLICATION_LEVEL_NAV_STYLE_CLASS);
          this.ojContext.element.removeClass(this._PAGE_LEVEL_NAV_STYLE_CLASS);
        } else if (navigationLevel === 'page') {
          this.ojContext.element.addClass(this._PAGE_LEVEL_NAV_STYLE_CLASS);
          this.ojContext.element.removeClass(this._APPLICATION_LEVEL_NAV_STYLE_CLASS);
        }
      }
    },
    _clearActiveState: function (event) {
      var item = this.FindItem($(event.target));
      if (item != null) {
        this.HighlightUnhighlightElem(item, "oj-active", false);
      }
    },
    /**
     * Initialize the listview after creation
     * @override
     */
    afterCreate: function () {
      this._initListHandler();
      _ojNavigationListView.superclass.afterCreate.apply(this, arguments);
    },
    /**
     * Event handler for when mouse down or touch start anywhere in the list
     * @param {Event} event mousedown or touchstart event
     * @protected
     */
    HandleMouseDownOrTouchStart: function (event) {
      _ojNavigationListView.superclass.HandleMouseDownOrTouchStart.apply(this, arguments);
      var item = this.FindItem($(event.target));
      if (item && !item.hasClass("oj-disabled")) {
        this.HighlightUnhighlightElem(item, "oj-active", true);
      }
    },

    /**
     * Event handler for when touch end/cancel happened
     * @param {Event} event touchend or touchcancel event
     * @protected
     */
    HandleTouchEndOrCancel: function (event) {
      this._clearActiveState(event);
      _ojNavigationListView.superclass.HandleTouchEndOrCancel.apply(this, arguments);
    },
    /**
     * Returns Navlist specific container style class
     * @override
     * @protected
     */
    GetContainerStyleClass: function () {
      return "oj-navigationlist-listview";
    },
    /**
     * Returns Navlist specific root element style class
     * @override
     * @protected
     */
    GetStyleClass: function () {
      return "oj-navigationlist-element";
    },
    /**
     * Returns Navlist specific Item style class
     * @override
     */
    getItemStyleClass: function () {
      return "oj-navigationlist-item";
    },
    getFocusedElementStyleClass: function () {
      return "oj-navigationlist-focused-element";
    },
    /**
     * Returns Navlist specific Item element style class
     * @override
     */
    getItemElementStyleClass: function () {
      return "oj-navigationlist-item-element";
    },
    /**
     * Returns Navlist specific collapse icon style class
     * @override
     */
    getCollapseIconStyleClass: function () {
      return "oj-navigationlist-collapse-icon";
    },
    /**
     * Returns Navlist specific expand icon style class
     * @override
     */
    getExpandIconStyleClass: function () {
      return "oj-navigationlist-expand-icon";
    },
    /**
     * Returns Navlist specific depth style class
     * @override
     */
    getDepthStyleClass: function (depth) {
      return "oj-navigationlist-depth-" + depth;
    },
    /**
     * Returns Navlist specific Group Item style class
     * @override
     */
    getGroupItemStyleClass: function () {
      return "oj-navigationlist-group-item";
    },
    /**
     * Returns Navlist specific Group style class
     * @override
     */
    getGroupStyleClass: function () {
      return "oj-navigationlist-group";
    },
    /**
     * Returns Navlist specific group expand style class
     * @override
     */
    getGroupExpandStyleClass: function () {
      return "oj-navigationlist-collapsible-transition";
    },
    /**
     * Returns Navlist specific group collapse style class
     * @override
     */
    getGroupCollapseStyleClass: function () {
      return this.getGroupExpandStyleClass();
    },
    /**
     * Override expand animation behaviour to support differnet types of navlists.
     * Returns a Promise that resolves when animation completes
     * @override
     * @protected
     */
    AnimateExpand: function (groupItem, animate, event) {
      return this.m_listHandler.Expand(groupItem, animate, event);
    },
    /**
     * Override collapse animation behaviour to support differnet types of navlists.
     * Returns a Promise that resolves when animation completes
     * @override
     * @protected
     */
    AnimateCollapse: function (item, key, animate, event) {
      return this.m_listHandler.Collapse(item, key, animate, event);
    },
    /**
     * Handles arrow keys navigation on item
     * @param {number} keyCode description
     * @param {boolean} isExtend
     * @param {Event} event the DOM event causing the arrow keys
     * @override
     * @protected
     */
    HandleArrowKeys: function (keyCode, isExtend, event) {
      return this.m_listHandler.HandleArrowKeys(keyCode, isExtend, event);
    },
    /**
     * Determine whether the key code is an arrow key
     * @param {number} keyCode
     * @return {boolean} true if it's an arrow key, false otherwise
     * @override
     * @protected
     */
    IsArrowKey: function (keyCode) {
      return this.m_listHandler.IsArrowKey(keyCode);
    },
    /**
     * Determines whether the specified item is expanded
     * @param {jQuery} item the item element
     * @return {number} 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
     * @override
     * @protected
     */
    GetState: function (item) {
      return this.m_listHandler.GetState(item);
    },
    /**
     * Sets the disclosed state of the item
     * @param {jQuery} item the item element
     * @param {number} state 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
     * @override
     * @protected
     */
    SetState: function (item, state) {
      this.m_listHandler.SetState(item, state);
    },

    /**
     * Override to expand and collapse events on clicking item instead of icon. Also avoids expand/collapse when user click on arbitrary clickable elements.
     * @override
     * @protected
     */
    HandleMouseClick: function (event) {
      var item = this.FindItem($(event.target));
      if (item == null || item.length === 0) {
        // can't find item or if item cannot be focus
        return;
      }
      if (this.SkipFocus(item)) {
        event.preventDefault();
        return;
      }

      //TODO , once it is fixd in listview probably don't need to override HandleMouseClick

      if (this.IsNodeEditableOrClickable($(event.target))) {
        return;
      }

      var itemContent = this.getItemContentElement(item);
      var url = itemContent.attr('href');
      if (url && url !== "#") {
        if (event.button === 0 && (event.shiftKey || event.ctrlKey)) {
          return; // Do nothing, as Browser will launch  target it in new tab or browser
        }
      }

      _ojNavigationListView.superclass.HandleMouseClick.apply(this, arguments);
      event.preventDefault();
    },
    /**
     * Override to support flip left/right arrows for expand and collapse actions.
     * @override
     * @protected
     */
    HandleKeyDown: function (event) {
      var keyCode, current, currentItemKey;
      if (!this.m_active) {
        //If there is no active item, generally happes when user click on disabled item 
        //and immediately press a key.
        return;
      }
      keyCode = event.keyCode;
      current = this.m_active['elem'];
      currentItemKey = this.m_active['key'];

      if (keyCode === $.ui.keyCode.HOME || keyCode === $.ui.keyCode.END) {
        var item;
        if (keyCode === $.ui.keyCode.HOME) {
          item = this.element.find('.' + this.ITEM_CONTENT_STYLE_CLASS + ':visible').first().closest('.' + this.getItemElementStyleClass());
        } else {
          item = this.element.find('.' + this.ITEM_CONTENT_STYLE_CLASS + ':visible').last().closest('.' + this.getItemElementStyleClass());
        }
        this.HandleClickActive(item, event);
        event.preventDefault();
      } else {
        var processed = this.HandleSelectionOrActiveKeyDown(event);
        var processExpansion = this.m_listHandler.HandleExpandAndCollapseKeys(event, keyCode, current, currentItemKey);
        if (processed === true || processExpansion === true) {
          event.preventDefault();
        }
      }
    },
    AvoidFocusHighLight: function (flag) {
      this._avoidFocusHighLight = flag;
    },
    /**
     * check Whether recent pointer acivity happened or not. 
     * Only used for sliding navlist to avoid focus ring on new focusable item
     * after completing expand/collapse animation.
     * @protected
     * @override
     */
    RecentPointerCallback: function () {
      var self = this;
      return function () {
        return !!(self._avoidFocusHighLight);
      };
    },
    /**
     * Whether focus highlight should be applied
     * @return {boolean} true if should apply focus highlight, false otherwise
     * @protected
     */
    ShouldApplyHighlight: function () {
      return true;
    },
    /**
     * Override to trigger beforeSelect event when user selecets an item.
     * @override
     * @protected
     */
    ToggleSelection: function (event, keepCurrentSelection, skipIfNotSelected) {
      var item = this.m_active['elem'];

      if (!this.IsSelectable(item[0])) {
        return;
      }
      if (this._isSelected(item)) {
        return;
      }
      var shouldSelect = this._fireBeforeSelectEvent(event, item);
      if (shouldSelect) {
        _ojNavigationListView.superclass.ToggleSelection.apply(this, arguments);
        this._initiateNavigation(item);
      }
    },
    /**
     * Highlight or unhighlight an element
     * @param {jQuery|Element} elem the element the highlight or unhighlight
     * @param {string} style the style to add or remove
     * @param {boolean} highlight true if it's to highlight, false if it's to unhighlight
     * @override
     * @protected
     */
    HighlightUnhighlightElem: function (elem, style, highlight) {
      var group;

      elem = $(elem);

      if (style === "oj-selected") {
        this.m_listHandler.UpdateAriaPropertiesOnSelectedItem(this.getFocusItem(elem), highlight);
      }

      // if item is a group, the highlight should be apply to the group item element
      group = elem.children("." + this.getGroupItemStyleClass());
      if (group.length > 0) {
        elem = $(group[0]);
      }

      if (style === "oj-focus") {
        if (highlight) {
          this._focusInHandler(elem);
        } else {
          this._focusOutHandler(elem);
        }
      } else {
        if (highlight) {
          elem.addClass(style);
        } else {
          elem.removeClass(style);
        }
      }

      if (elem.hasClass('oj-selected') || elem.hasClass('oj-hover') || elem.hasClass('oj-active') || elem.hasClass('oj-disabled')) {
        elem.removeClass('oj-default');
      } else {
        elem.addClass('oj-default');
      }
    },
    /**
     * In Navlist,it is not gaurenteed that item will have aria-selected. So overriding it to make all items selectable.
     * @override
     * @protected
     */
    IsSelectable: function (item) {
      return !$(item).hasClass('oj-disabled') && this.m_listHandler.IsSelectable($(item));
    },
    /**
     * Override to skip firing events like ready which are not needed for navlist.
     * @override
     * @protected
     */
    Trigger: function (type, event, ui) {
      if (type !== 'ready') {
        return this.ojContext._trigger(type, event, ui);
      }
      return true;
    },
    /**
     * Override to convert selection option value from array to string before setting on component.
     * @override
     * @protected
     */
    SetOption: function (key, value, flags) {
      if (key === 'selection') { // selection Data type is different for listview and navlist
        //change items to item as navlist does't allow multiple selection.
        var context = flags['_context'],
          selectedItem = context && context.extraData && context.extraData['items'];
        if (selectedItem) {
          //extraData['items'] is a jquery object(not an array) and in case of navlist it will always have single item.
          context.extraData['item'] = selectedItem;
          context.extraData['items'] = undefined;
        }
        if (value && value.length > 0) {
          this.ojContext.option(key, value[0], flags);
        } else {
          this.ojContext.option(key, null, flags);
        }
      } else { // Common options
        this.ojContext.option(key, value, flags);
      }
      this.options[key] = value;
    },
    /**
     * Whether ListView should refresh if certain option is updated
     * @param {Object} options the options to check
     * @return {boolean} true if should refresh, false otherwise
     * @override
     * @protected
     */
    ShouldRefresh: function (options) {
      return (options['data'] != null ||
        options['drillMode'] != null ||
        options['item'] != null ||
        options['display'] != null ||
        options['edge'] != null);
    },

    /**
     * Override options default style class
     * @return {string} the option defaults style class
     */
    getOptionDefaultsStyleClass: function()
    {
        return "oj-navigationlist-option-defaults";
    },
    /**
     * Sets multiple options
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     * @return {Object} result result object holding skipUpdate and needRefresh flags.
     * @override
     */
    setOptions: function (options, flags) {
      var result = {
          skipOptions: []
        },
        newSelectionValue;

      if (options['hierarchyMenuDisplayThresholdLevel'] !== undefined) {
        this.m_listHandler.setOptions(options);
      }

      if (options['navigationLevel'] !== undefined) {
        this._setNavigationLevel(options['navigationLevel']);
      }
      if (options['selection'] !== undefined) {
        newSelectionValue = options['selection'];
      }
      result.needRefresh = _ojNavigationListView.superclass.setOptions.call(this, options, flags);
      if (newSelectionValue !==  undefined && options['selection'] === undefined) {
        result.skipOptions.push('selection');
      }
      //Restore original user provided selection value
      if (newSelectionValue !== undefined) {
        options['selection'] = newSelectionValue;
      }
      return result;
    },
    /**
     * Set Selection option.
     * @param {Object} options the options object
     * @override
     */
    HandleSelectionOption: function (options) {
      var newSelectionValue;
      if (options['selection'] !== undefined) {
        newSelectionValue = options['selection'];
        if (!!newSelectionValue) {
          var selection = this.GetOption('selection');
          if (!selection || selection.length === 0 || selection[0] !== newSelectionValue) {
            var item = this.FindElementByKey(newSelectionValue);
            if (item && this.IsSelectable(item)) {
              var shouldSelect = this._fireBeforeSelectEvent(null, $(item));
              if (shouldSelect) {
                options['selection'] = [newSelectionValue];
                this._initiateNavigation($(item));
              } else {
                delete options['selection'];
              }
            } else {
              delete options['selection'];
            }
          } else {
            //When new value is same as existing one, no need to update it on listview. 
            delete options['selection'];
          }
        } else {
          options['selection'] = [];
        }
      }
      _ojNavigationListView.superclass.HandleSelectionOption.call(this, options);
    },
    /**
     * Override to convert selection option value from string to array before setting on component.
     * @override
     * @protected
     */
    GetOption: function (key) {
      var optionValue = this.ojContext.option(key);
      if (key === 'selection') { // selection Data type is different for listview and navlist
        if (optionValue) {
          return [optionValue];
        }
        return [];
      }
      if (optionValue === null) { // if the option is only applicable to listview
        return this.options[key];
      }
      return optionValue;
    },
    /**
     * Override to return widget constructor
     * @override
     */
    getWidgetConstructor: function () {
      return oj.Components.getWidgetConstructor(this.ojContext.element);
    },
    /**
     * Override to skip intermediate nodes(only in case of collapsible) and disabled items from selection.
     * @override
     * @protected
     */
    SelectAndFocus: function (item, event) {
      //Disabled items are not selectable and focuable.
      if (item.hasClass('oj-disabled')) {
        return;
      }

      if (!this.IsSelectable(item[0])) {
        return;
      }

      if (!this._isSelected(item) && this._fireBeforeSelectEvent(event, item)) {
        _ojNavigationListView.superclass.SelectAndFocus.apply(this, arguments);
        this._initiateNavigation(item);
      } else {
        //clicking on selected item/item whose selection is prevented should also get focus.
        this.HandleClickActive(item, event);

      }
    },
    _fireBeforeSelectEvent: function (event, item) {
      var key = this.GetKey(item[0]);
      return this.Trigger("beforeSelect", event, {
        item: item,
        key: key
      });
    },
    _initiateNavigation: function (item) {

      if (this.ojContext.element.hasClass(this._NAVLIST_NO_FOLLOW_LINK_CLASS)) {
        return false;
      }

      var itemContent = this.getItemContentElement(item);
      var url = itemContent.attr('href');
      var target = itemContent.attr('target');;
      if (url && url !== "#") {
        //In case of javascript uri, javascript will get executed on assigning it to href.
        //Ideally user can use beforeSelect/optionChange events to do this,Will there be any issue in supporting this?
         if(!target || target === '_self') {
            window.location.href = url;
         } else {
            window.open(url, target);
         }
         
        return true;
      }
      return false;
    },
    _isSelected: function (item) {
      var selection, key, index;

      selection = this.GetOption("selection");
      key = this.GetKey(item[0]);

      index = selection.indexOf(key);
      if (index > -1) {
        return true;
      }
      return false;
    },
    _setToolTipOnIcon: function (icon, itemLabel) {
      if (!icon.attr('title')) {
        icon.attr('title', itemLabel);
      }
    },
    _removeToolTipOnIcon: function (icon) {
      if (!icon.data(this._NAVLIST_ITEM_ICON_HAS_TITLE)) {
        icon.removeAttr('title');
      } else {
        icon.removeData(this._NAVLIST_ITEM_ICON_HAS_TITLE);
      }
    },
    /**
     * Called by content handler once the content of an item is rendered
     * @param {Element} elem the item element
     * @param {Object} context the context object used for the item
     */
    itemRenderComplete: function (elem, context) {
      var $item = $(elem);
      if ($item.hasClass(this._CATEGORY_DIVIDER_STYLE_CLASS)) {
        $item.removeClass(this.getItemElementStyleClass());
        $item.removeClass(this.getFocusedElementStyleClass());
        $item.removeClass(this.getItemStyleClass());
        $item.removeAttr('aria-selected');
        $item.children().remove();
        $item.attr('role', 'separator');
        return;
      }
      var groupItemClass = this.getGroupItemStyleClass();
      var collapseIconClass = this.getCollapseIconStyleClass();
      var expandIconClass = this.getExpandIconStyleClass();
      var itemIconClass = this._ITEM_ICON_STYLE_CLASS;
      var groupItem = $item.children('.' + groupItemClass);
      var itemContent;
      if (groupItem.length > 0) {
        //Adding oj-navigationlist-item class on group node. Listview does't add this any more.
        groupItem.addClass(this.getItemStyleClass());
        itemContent = groupItem.children(':not(.' + expandIconClass + '):not(.' + collapseIconClass + ')');
        var groupIcon = groupItem.children('.' + expandIconClass);
        if (groupIcon.length === 0) {
          groupIcon = groupItem.children('.' + collapseIconClass);
        }
        groupIcon.attr('role', 'presentation');
        groupIcon.removeAttr('aria-labelledby');
        if ($item.hasClass('oj-disabled')) {
          groupItem.addClass('oj-disabled');
        }
      } else {
        itemContent = $item.children().first();
      }
      itemContent.addClass(this.ITEM_CONTENT_STYLE_CLASS);
      var icon = itemContent.wrapInner('<span class="' + this._ITEM_LABEL_STYLE_CLASS + '"></span>').find('.' + itemIconClass); //@HTMLUpdateOK
      if (icon.length > 0) {
        icon.insertBefore(icon.parent()); // @HTMLUpdateOK

        if (icon.attr('title')) { // preserve the title to restore it after destroy.
          icon.data(this._NAVLIST_ITEM_ICON_HAS_TITLE, icon.attr('title'));
        }

        if (this.ojContext.options['display'] === 'icons') {
          this.ojContext.element.addClass(this._ICON_ONLY_STYLE_CLASS);
          var itemLabel = this.getItemLabel($item);
          icon.attr('aria-label', itemLabel);
          icon.attr('role', 'img');
          this._setToolTipOnIcon(icon, itemLabel);
        }

        $item.closest('ul').addClass(this._NAVLIST_HAS_ICONS);
      } else {
        itemContent.addClass(this._NAVLIST_ITEM_HAS_NO_ICON);
      }

      if ($item.hasClass('oj-disabled')) {
        this.getFocusItem($item).attr('aria-disabled', 'true');
      } else {
        if (groupItem.length > 0) {
          groupItem.addClass('oj-default');
        } else {
          $item.addClass('oj-default');
        }
      }
      this.m_listHandler.ModifyListItem($item, itemContent);
      _ojNavigationListView.superclass.itemRenderComplete.apply(this, arguments);

    },


    /**
     * Return node for given locator
     *
     * @override
     */
    getNodeBySubId: function (locator) {
      var subId, key, item;

      if (locator === null) {
        return this.element ? this.element[0] : null;
      }

      subId = locator['subId'];
      if (subId === 'oj-navigationlist-item') {
        key = locator['key'];
        item = this.FindElementByKey(key);
        return item;
      }

      if (subId === 'oj-navigationlist-previous-link') {
        return this.m_listHandler._prevButton ? this.m_listHandler._prevButton[0] : null;
      }

      if (subId === 'oj-navigationlist-hierarchical-button') {
        return this.m_listHandler._hviewBtn ? this.m_listHandler._hviewBtn[0] : null;
      }

      if (subId === 'oj-navigationlist-hierarchical-menu') {
        return this.m_listHandler._hviewMenu ? this.m_listHandler._hviewMenu[0] : null;
      }

      // Non-null locators have to be handled by the component subclasses
      return null;
    },
    /**
     * Returns the subId locator for the given child DOM node.
     * Invoked by widget
     * @param {!Element} node - child DOM node
     * @return {Object|null} The locator for the DOM node, or <code class="prettyprint">null</code> when none is found.
     */
    getSubIdByNode: function (node) {
      var item, key;
      if (this.m_listHandler._prevButton && this.m_listHandler._prevButton[0] === node) {
        return {
          'subId': 'oj-navigationlist-previous-link'
        };
      }
      if (this.m_listHandler._hviewBtn && this.m_listHandler._hviewBtn[0] === node) {
        return {
          'subId': 'oj-navigationlist-hierarchical-button'
        };
      }
      if (this.m_listHandler._hviewMenu && this.m_listHandler._hviewMenu[0] === node) {
        return {
          'subId': 'oj-navigationlist-hierarchical-menu'
        };
      }

      item = this.FindItem(node);
      if (item != null && item.length > 0) {
        key = this.GetKey(item[0]);
        if (key != null) {
          return {
            'subId': 'oj-navigationlist-item',
            'key': key
          };
        }
      }

      return null;
    },
    /**
     * Returns an object with context for the given child DOM node. 
     * This will always contain the subid for the node, defined as the 'subId' property on the context object. 
     * Additional component specific information may also be included. For more details on returned objects, see context objects.
     * Invoked by widget
     *
     * @param {!Element} node the child DOM node
     * @returns {Object|null} the context for the DOM node, or null when none is found.
     */
    getContextByNode: function (node) {
      var context = _ojNavigationListView.superclass.getContextByNode.call(this, node);
      if (context && context['subId'] == 'oj-listview-item') {
        context['subId'] = 'oj-navigationlist-item';
        return context;
      }
      return null;
    },
    /**
     * Refresh navlist
     * @override
     */
    refresh: function () {
      this._resetNavlist();
      this._initListHandler();
      _ojNavigationListView.superclass.refresh.apply(this, arguments);
    },
    /**
     * Uninitialize dom.
     * @private
     */
    _resetNavlist: function () {
      this.ojContext.element.removeClass(this._ICON_ONLY_STYLE_CLASS);
      this.ojContext.element.removeClass(this._APPLICATION_LEVEL_NAV_STYLE_CLASS);
      this.ojContext.element.removeClass(this._PAGE_LEVEL_NAV_STYLE_CLASS);
      this._restoreContent(this.element);
      this.m_listHandler.Destroy();
    },
    /**
     * Destroy the Navigation List
     * @override
     */
    destroy: function () {
      this._resetNavlist();
      _ojNavigationListView.superclass.destroy.apply(this, arguments);
      this._list.unwrap();
      //for data source, this will be empty.
      if (this._list.is(':empty')) {
        this._list.remove();
      }
      this.ojContext.element.removeClass(this._NAVLIST_STYLE_CLASS + ' ' + this._NAVLIST_TOUCH_STYLE_CLASS);
      this.ojContext._off(this.element, "click");
      this.ojContext._off(this.element, "focus");
      this.ojContext._off(this.element, "blur");
      this.ojContext._off(this.element, "mouseover");
      this.ojContext._off(this.element, "mousein");
      this.ojContext._off(this.element, "mouseout");
      this.ojContext._off(this.element, "keydown");
    }

  });

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
(function () {
  /**
   * @ojcomponent oj.ojNavigationList
   * @augments oj.baseComponent
   * @since 1.1.0
   *
   * @classdesc
   * <h3 id="navlistOverview-section">
   *   JET Navigation List Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#navlistOverview-section"></a>
   * </h3>
   *
   * <p>Description:  The JET Navigation List enhances a HTML list element into a themable, WAI-ARIA compliant, mobile friendly component with advance interactive features.
   *
   * <p>The JET Navigation List gets its data in following ways. </p>
   * <ul>
   * <li><b>Using table datasource</b>. This is typically used in case of flat list.There are several types of TableDataSource that
   * are available out of the box like oj.ArrayTableDataSource,oj.CollectionTableDataSource.NOTE: oj.PagingTableDataSource is not supported by navigation list.
   * For large amount of data, It is recommended to use hierarhcial navigation list with tree data source.</li>
   * <li><b>Using TreeDataSource</b>.  This is typically used to display hierarchical navigation list.  There are several types
   * of TreeDataSource that are available out of the box like oj.JsonTreeDataSource, oj.CollectionTreeDataSource </li>
   * <li><b>Using static content </b>. The structure of the content can be either flat or hierarhical.</li>
   * </ul>
   * <p>Example of flat static content</p>
   * <pre class="prettyprint">
   * <code>
   * &lt;div id="navigationlist">
   *  &lt;ul>
   *   &lt;li>&lt;a href="#">Item 1&lt;/a>&lt;/li>
   *   &lt;li>&lt;a href="#">Item 2&lt;/a>&lt;/li>
   *   &lt;li>&lt;a href="#">Item 3&lt;/a>&lt;/li>
   *  &lt;/ul>
   * &lt;/div>
   * </code></pre>
   *
   * <p>Example of hierarchical static content</p>
   * <pre class="prettyprint">
   * <code>
   * &lt;div id="navigationlist">
   *  &lt;ul >
   *   &lt;li>&lt;a href="#">Item 1&lt;/a>&lt;/li>
   *   &lt;li>&lt;a href="#">Item 2&lt;/a>&lt;/li>
   *   &lt;li>&lt;a href="#">Item 3&lt;/a>
   *     &lt;ul>
   *       &lt;li>&lt;a href="#">Item 3-1&lt;/a>&lt;/li>
   *       &lt;li>&lt;a href="#">Item 3-2&lt;/a>&lt;/li>
   *       &lt;li>&lt;a href="#">Item 3-3&lt;/a>&lt;/li>
   *       &lt;li>&lt;a href="#">Item 3-4&lt;/a>&lt;/li>
   *       &lt;li>&lt;a href="#">Item 3-5&lt;/a>&lt;/li>
   *     &lt;/ul>
   *   &lt;/li>
   *   &lt;li>&lt;a href="#">Item 4&lt;/a>&lt;/li>
   *   &lt;li>&lt;a href="#">Item 5&lt;/a>&lt;/li>
   *  &lt;/ul>
   * &lt;/div>
   * </code></pre>
   * <h4 id="treeJSON-section"> JSON Tree Node Format</h4>
   * </br>
   * Each node object typically have an
   * <code class="prettyprint">attr</code> property. This attr value will be provided as <code class="prettyprint">itemContext.data</code> to renderer function. See <a href="#itemContext">itemContext</a> section. Any node can be defined as a parent by supplying
   * a <code class="prettyprint">children</code> property, which is an array of one or more node definitions.
   * (Note: lazy-loading is not supported in navigation list so <code class="prettyprint">children</code> property should be a non empty array)
   * <p>Example: Basic JSON Tree definition
   * <pre class="prettyprint">
   * <code>
   *[
   *   {
   *     "attr": {
   *               "id": "home",
   *               "title": "Home"
   *             },
   *   },
   *   {
   *     "attr": {
   *               "id": "news",
   *               "title": "News"
   *             }
   *   },
   *   {
   *      "attr": {
   *                "id": "blogs",
   *                "title": "Blogs"
   *              },
   *      "children": [ {
   *
   *                       "attr": {
   *                                   "id": "today",
   *                                   "title": "Today"
   *                               }
   *                    },
   *                    {
   *                       "attr": {
   *                                   "id": "yesterday",
   *                                   "title": "Yesterday"
   *                               }
   *                    }
   *                  ]
   *   }
   *]
   *</code></pre>
   *</p></br>
   * <p>Any list item can be disabled by adding the <code class="prettyprint">oj-disabled</code> class to that element.  As with any DOM change, doing so post-init
   * requires a <code class="prettyprint">refresh()</code> of the component.
   *
   *
   * <h3 id="icons-section">
   *   Icons
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#icons-section"></a>
   * </h3>
   *
   * <p>Sublist icons are inserted automatically.  To add other icons to list items, include them in the markup and include the <code class="prettyprint">oj-navigationlist-item-icon</code> class, as follows:
   *
   * <pre class="prettyprint">
   * <code>&lt;ul id="navigationlist">
   *   &lt;li id="foo">&lt;a href="#">&lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">&lt;/span>Foo&lt;/a>&lt;/li>
   * &lt;/ul>
   * </code></pre>
   *
   * <h3 id="styling-section">
   *   Styling
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
   * </h3>
   *
   * <table class="generic-table styling-table">
   *   <thead>
   *     <tr>
   *       <th>Class(es)</th>
   *       <th>Description</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>oj-navigationlist-stack-icon-label</td>
   *       <td>Add this class to display Navigation List with Stacked icon and label. Applicable only when edge is top.</td>
   *     </tr>
   *     <tr>
   *       <td>oj-navigationlist-category-divider</td>
   *       <td>Use this class to add horizontal divider line between two categories of items.</td>
   *     </tr>
   *     <tr>
   *       <td>oj-navigationlist-item-icon</td>
   *       <td>Use this class to add icon to list item.</td>
   *     </tr>
   *     <tr>
   *       <td>oj-navigationlist-item-title</td>
   *       <td>When arbitrary content is placed in side item, mark item title using this marker class.
   *       <p>Example of item markup with arbitrary content.
   *        <pre class="prettyprint">
   *        <code>
   *&lt;li>
   *  &lt;div>
   *      &lt;span class="oj-navigationlist-item-title">Play&lt;/span>
   *      &lt;button>Button&lt;/button>
   *  &lt;/div>
   *&lt;/li>
   *        </code>
   *        </pre>
   *        </p>
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-navigationlist-item-text-wrap</td>
   *       <td>Use this class to wrap item label text.</td>
   *     </tr>
   *     <tr>
   *       <td>oj-navigationlist-item-dividers</td>
   *       <td>Use this class to show dividers between horizontal navigation list items.</td>
   *     </tr>
   *     <tr>
   *       <td>oj-sm-condense</td>
   *       <td>Use this class to condense horizontal navigation list items on small and up screens.
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-md-condense</td>
   *       <td>Use this class to condense horizontal navigation list items on medium and up screens.
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-lg-condense</td>
   *       <td>Use this class to condense horizontal navigation list items on large and up screens.
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-xl-condense</td>
   *       <td>Use this class to condense horizontal navigation list items on extra large and up screens.
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-navigationlist-nofollow-link</td>
   *       <td> Use this class to prevent automatic navigation to the url specified on &lt;a> tag's <code class="prettyprint">href</code> attribute. In this case, navigation can be handled programmatically by using <a href="#event:optionChange">optionChange</a> event.
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-focus-highlight</td>
   *       <td>{@ojinclude "name":"ojFocusHighlightDoc"}</td>
   *     </tr>
   *   </tbody>
   * </table>
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
   * {@ojinclude "name":"keyboardDoc"}
   *
   * <p>Disabled items will not receive keyboard focus and do not allow any interaction.
   *
   *<h3 id="context-section">
   *   Item Context
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#context-section"></a>
   * </h3>
   *
   * <p>For all item options, developers can specify a function as the return value.  The function takes a single argument, which is an object that contains contextual information about the particular item.  This gives developers the flexibility to return different value depending on the context.</p>
   *
   * <p>The context paramter contains the following keys:</p>
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Key</th>
   *       <th>Description</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td><kbd>component</kbd></td>
   *       <td>A reference to the NavigationList widget constructor.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>datasource</kbd></td>
   *       <td>A reference to the data source object. (Not available for static content)</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>index</kbd></td>
   *       <td>The index of the item, where 0 is the index of the first item.  In the hierarchical case the index is relative to its parent.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>key</kbd></td>
   *       <td>The key of the item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>data</kbd></td>
   *       <td>The data object for the item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>parentElement</kbd></td>
   *       <td>The list item element.  The renderer can use this to directly append content.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * <p></p>
   * <p>If the data is hierarchical, the following additional contextual information are available:</p>
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Key</th>
   *       <th>Description</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td><kbd>depth</kbd></td>
   *       <td>The depth of the item.  The depth of the first level children under the invisible root is 1.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>parentKey</kbd></td>
   *       <td>The key of the parent item.  The parent key is null for root node.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>leaf</kbd></td>
   *       <td>Whether the item is a leaf or a group item.</td>
   *     </tr>
   *   </tbody>
   * </table>
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <h4>Data Set Size</h4>
   * <p>As a rule of thumb, it's recommended that applications limit the amount of data to display.  Displaying large
   * number of items in Navigation List makes it hard for user to find what they are looking for, but affects the load time.
   * If displaying large number of items is neccessary, it is recommended to group the items in to hierarchial navigation list.
   *
   * <h4>Item Content</h4>
   * <p>Navigation List allows developers to specify arbitrary content inside its item. In order to minimize any negative effect on
   * performance, you should avoid putting a large number of heavy-weight components inside because as you add more complexity
   * to the structure, the effect will be multiplied because there can be many items in the Navigation List.</p>
   *
   * <h4>Expand All</h4>
   * <p>While Navigation List provides a convenient way to initially expand all group items, it might have an impact
   * on the initial rendering performance since expanding each group item might cause a fetch from the server depending on
   * the TreeDataSource.  Other factors that could impact performance includes the depth of the tree, and the number of children
   * in each level.</p>
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   * <p>See also the <a href="#styling-section">oj-focus-highlight</a> discussion.
   * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
   * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
   * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
   * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
   * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
   * required of enabled content, it cannot be used to convey meaningful information.<p>
   *
   *
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>The only supported way to set the reading direction (LTR or RTL) is to set the <code class="prettyprint">"dir"</code> attribute on the
   * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET component, in the unusual case that the reading direction
   * is changed post-init, the navigation list must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
   *
   *
   * <h3 id="pseudos-section">
   *   Pseudo-selectors
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
   * </h3>
   *
   * <p>The <code class="prettyprint">:oj-navigationlist</code> pseudo-selector can be used in jQuery expressions to select JET Navigation Lists.  For example:
   *
   * <pre class="prettyprint">
   * <code>$( ":oj-navigationlist" ) // selects all JET Navigation lists on the page
   * $myEventTarget.closest( ":oj-navigationlist" ) // selects the closest ancestor that is a JET Navigation lists
   * </code></pre>
   *
   * <!-- - - - - Above this point, the tags are for the class.
   *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
   *
   *
   * @desc Creates a JET Navigation List.
   *
   * @param {Object=} options a map of option-value pairs to set on the component
   *
   * @example <caption>Initialize the Navigation list with no options specified:</caption>
   * $( ".selector" ).ojNavigationList();
   *
   * @example <caption>Initialize the Navigation list with some options and callbacks specified:</caption>
   * $( ".selector" ).ojNavigationList( { "drillMode": "none", "beforeSelect": function( event, ui ) {} } );
   *
   * @example <caption>Initialize the Navigation list via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
   * &lt;div id="navigationlist" data-bind="ojComponent: { component: 'ojNavigationList',
   *                                         drillMode: 'none',
   *                                         beforeSelect: beforeSelectItem }">
   */
  oj.__registerWidget("oj.ojNavigationList", $['oj']['baseComponent'], {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * Key of the current item.  Current item is the list item which is having active focus.  Note that if currentItem
       * is set to an item that is currently not available (not fetched or
       * inside a collapsed parent node), then the value is ignored.
       *
       * @expose
       * @public
       * @instance
       * @memberof! oj.ojNavigationList
       * @type {Object}
       * @default <code class="prettyprint">null</code>
       *
       * @example <caption>Get the current item:</caption>
       * $( ".selector" ).ojNavigationList("option", "currentItem");
       *
       * @example <caption>Set the current item on the NavigationList during initialization:</caption>
       * $(".selector").ojNavigationList({"currentItem", "item2"});
       */
      currentItem: null,
      /**
       * Defines style of navigation used to drill down hierarchical list items.
       * <ul>
       * <li>none</li>
       * <li>collapsible</li>
       * <li>sliding</li>
       * </ul>
       *
       * @expose
       * @memberof oj.ojNavigationList
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"none"</code>
       * @ojvalue {string} "none" All group items are expanded by default and user not allowed to collapse them.
       * @ojvalue {string} "collapsible" Allows user to expand and collapse group items. If there are more than two levels in hierarchy, <code class="prettyprint">sliding</code> is preferered drill mode.
       * @ojvalue {string} "sliding" This is typically used for hierarchical lists. This allows user to view one level at a time.
       *
       * @example <caption>Initialize the menu with the <code class="prettyprint">drillMode</code> option specified:</caption>
       * $( ".selector" ).ojNavigationList({ drillMode: "collapsible" });
       *
       * @example <caption>Get the <code class="prettyprint">drillMode</code> option, after initialization:</caption>
       * // getter
       * var drillMode = $( ".selector" ).ojNavigationList( "option", "drillMode" );
       */
      drillMode: "none",
      /**
       * The position of the Navigation List. Valid Values: top and start.
       * <p> NOTE: when value is <code class="prettyprint">top</code>,<code class="prettyprint">"none"</code> is the only supported drillMode and it also does't support hierarchical items.
       * @expose
       * @name edge
       * @memberof oj.ojNavigationList
       * @instance
       * @type {string|null}
       * @ojvalue {string} "top" This renders list items horizontally.
       * @ojvalue {string} "start" This renders list items vertically.
       * @default <code class="prettyprint">"start"</code>
       */
      edge: "start",
      /**
       * Specifies the level at which user can see hiearchical menu button.This is only valid when <code class="prettyprint">drillMode</code> set to <code class="prettyprint">sliding</code>.
       * Default value is 0, shows hiearchical menu always. If value is -1, then it will never be shown.
       *
       * <p>The default value for hierarchyMenuDisplayThresholdLevel varies by theme.  Each theme can set its default by setting
       * <code class="prettyprint">$navigationListHierarchyMenuDisplayThresholdLevelOptionDefault</code> as seen in the example below.
       *
       * @expose
       * @name hierarchyMenuDisplayThresholdLevel
       * @memberof oj.ojNavigationList
       * @instance
       * @type {number|null}
       * @default Varies by theme. <code class="prettyprint">"0"</code> if not specified in theme.
       *
       * @example <caption>Initialize the navigation list with the <code class="prettyprint">hierarchyMenuDisplayThresholdLevel</code> option specified:</caption>
       * $( ".selector" ).ojNavigationList( { "hierarchyMenuDisplayThresholdLevel": "4" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">hierarchyMenuDisplayThresholdLevel</code> option, after initialization:</caption>
       * // getter
       * var display = $( ".selector" ).ojNavigationList( "option", "hierarchyMenuDisplayThresholdLevel" );
       *
       * // setter
       * $( ".selector" ).ojNavigationList( "option", "hierarchyMenuDisplayThresholdLevel", "4" );
       *
       * @example <caption>Set the default in the theme (SCSS) :</caption>
       * $navigationListHierarchyMenuDisplayThresholdLevelOptionDefault: -1 !default;
       */
      hierarchyMenuDisplayThresholdLevel: 0,
      /**
       * Label for top level list items.
       * <p>NOTE: This is needed only for sliding navigation list where
       * this will be used as title for the top level list elements.
       * @type {?string}
       * @default <code class="prettyprint">Navigation List</code>
       * @expose
       * @instance
       * @memberof oj.ojNavigationList
       */
      rootLabel: null,
      /**
       * Item key of currently selected list item. If the value is modified
       * by an application, navigation list UI is modified to match the new value.
       * @type {string|null}
       * @default <code class="prettyprint">null</code>
       * @expose
       * @instance
       * @memberof oj.ojNavigationList
       */
      selection: null,
      /**
       * Specifies which items in NavigationList should be expanded. Specifies "all" value to expand all items.  Specifies
       * an array of keys to expand specific items.
       *
       * The default value is "auto", which means that NavigationList will determine which items are expanded by default.
       * Specifically, if drillMode is set to "none", then all items are expanded, any other values for
       * drillMode will not cause any items to expand by default.
       *
       * Note that expanded does not return the currently expanded items.  This only returns what is specified
       * by default.  To retrieve the keys of currently expanded items, use the <code class="prettyprint">getExpanded</code>
       * method.
       * @type {Array|string}
       * @default <code class="prettyprint">[]</code>
       * @expose
       * @instance
       * @memberof oj.ojNavigationList
       */
      expanded: "auto",
      /**
       * The data source for the NavigationList accepts either a oj.TableDataSource or oj.TreeDataSource.
       * See the data source section in the introduction for out of the box data source types.
       * If the data attribute is not specified, the child elements are used as content.  If there's no
       * content specified, then an empty list is rendered.
       *
       * @expose
       * @memberof! oj.ojNavigationList
       * @instance
       * @type {oj.TableDataSource|oj.TreeDataSource}
       * @default <code class="prettyprint">null</code>
       *
       * @example <caption>Initialize the NavigationList with a one-dimensional array:</caption>
       * $( ".selector" ).ojNavigationList({ "data": new oj.ArrayTableDataSource([1,2,3])});
       *
       * @example <caption>Initialize the NavigationList with an oj.Collection:</caption>
       * $( ".selector" ).ojNavigationList({ "data": new oj.CollectionTableDataSource(collection)});
       */
      data: null,
      /**
       * Whether to display both the label and icons (<code class="prettyprint">"all"</code>) or just the icons (<code class="prettyprint">"icons"</code>).
       * In the latter case, the label is displayed in a tooltip instead, unless a tooltip was already supplied at create time.
       * Note: <code class="prettyprint">display="icons"</code> is valid only when <code class="prettyprint">drillMode=none</code> and navigation list is a flat list.
       * It is also mandatory to provide icons for each item as stated in <a href="#icons-section">icons section</a>.
       *
       * @expose
       * @memberof oj.ojNavigationList
       * @instance
       * @type {string}
       * @ojvalue {string} "all" Display both the label and icons.
       * @ojvalue {string} "icons" Display only the icons.This option
       * @default <code class="prettyprint">"all"</code>
       *
       * @example <caption>Initialize the NavigationList with the <code class="prettyprint">display</code> option specified:</caption>
       * $( ".selector" ).ojNavigationList( { "display": "icons" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">display</code> option, after initialization:</caption>
       * // getter
       * var display = $( ".selector" ).ojNavigationList( "option", "display" );
       *
       * // setter
       * $( ".selector" ).ojNavigationList( "option", "display", "icons" );
       */
      display: "all",
      /**
       * Navigation List supports two different look-and-feel depends on its usage level, one is <code class="prettyprint">application</code> level and other is <code class="prettyprint">page</code> level.
       *
       * @expose
       * @memberof oj.ojNavigationList
       * @instance
       * @type {string}
       * @ojvalue {string} "application" Render Navigation List for application level navigation.
       * @ojvalue {string} "page" Render Navigation List for page level navigation.
       * @default <code class="prettyprint">"page"</code>
       *
       * @example <caption>Initialize the NavigationList with the <code class="prettyprint">navigationLevel</code> option specified:</caption>
       * $( ".selector" ).ojNavigationList( { "navigationLevel": "application" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">navigationLevel</code> option, after initialization:</caption>
       * // getter
       * var display = $( ".selector" ).ojNavigationList( "option", "navigationLevel" );
       *
       * // setter
       * $( ".selector" ).ojNavigationList( "option", "navigationLevel", "application" );
       */
      navigationLevel: "page",
      /**
       * The item option contains a subset of options for items.
       *
       * @expose
       * @memberof! oj.ojNavigationList
       * @instance
       */
      item: {
        /**
         * The renderer function that renders the content of the item. See <a href="#context-section">itemContext</a>
         * in the introduction to see the object passed into the renderer function.
         * The function returns either a String or a DOM element of the content inside the item.
         * If the developer chooses to manipulate the list element directly, the function should return
         * nothing. If no renderer is specified, Navigation List will treat the data as a String.
         *
         * @expose
         * @alias item.renderer
         * @memberof! oj.ojNavigationList
         * @instance
         * @type {function(Object)|null}
         * @default <code class="prettyprint">null</code>
         *
         * @example <caption>Initialize the NavigationList with a renderer:</caption>
         * $( ".selector" ).ojNavigationList({ "data":data, "item": { "renderer": function(itemContext) {
         *                                            return itemContext['data'].get('FIRST_NAME');}}});
         *
         * @example <caption>Get or set the <code class="prettyprint">renderer</code> option, after initialization:</caption>
         * // set the renderer function
         * $( ".selector" ).ojNavigationList( "option", "item.renderer", myFunction});
         */
        renderer: null,
        /**
         * Whether the item is selectable.
         * See <a href="#context-section">itemContext</a> in the introduction to see the object passed into the selectable function.
         *
         * @expose
         * @alias item.selectable
         * @memberof! oj.ojNavigationList
         * @instance
         * @type {function(Object)|boolean}
         * @default <code class="prettyprint">true</code>
         *
         * @example <caption>Initialize the NavigationList such that the first 3 items are not selectable:</caption>
         * $( ".selector" ).ojNavigationList({ "data":data, "item": { "selectable": function(itemContext) {
         *                                            return itemContext['index'] > 3;}}});
         */
        selectable: true
          /**
           * The knockout template used to render the content of the item.
           *
           * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
           * component option.
           *
           * @ojbindingonly
           * @name item.template
           * @memberof! oj.ojNavigationList
           * @instance
           * @type {string|null}
           * @default <code class="prettyprint">null</code>
           *
           * @example <caption>Specify the <code class="prettyprint">template</code> when initializing NavigationList:</caption>
           * // set the template
           * &lt;div id="navlist" data-bind="ojComponent: {component: 'ojNavigationList', data: dataSource, template: 'my_template'}"&gt;&lt;/div&gt;
           */
      },
      //Events
      /**
       * <p>Triggered before this list item is selected.
       * To prevent the item selection, return <code class="prettyprint">false</code> from event handler or invoke <code class="prettyprint">event.preventDefault()</code>.
       * <p>The <code class="prettyprint">ui.key</code> contains item key which uniquely identifies the item.
       * <code class="prettyprint">ui.item</code> payload field contains item element being selected.
       *
       * @expose
       * @event
       * @memberof! oj.ojNavigationList
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.key Selected list item key.
       * @property {jQuery} ui.item Selected list item.
       *
       * @example <caption>Initialize the Navigation List with the <code class="prettyprint">beforeSelect</code> callback specified:</caption>
       * $( ".selector" ).ojNavigationList({
       *     "beforeSelect": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeselect</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeselect", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
       */
      beforeSelect: null,
      /**
       * Triggered before an item is collapse via the <code class="prettyprint">expanded</code> option,
       * the <code class="prettyprint">collapse</code> method, or via the UI.
       * To prevent the item being collapsed, return <code class="prettyprint">false</code> from event handler or invoke <code class="prettyprint">event.preventDefault()</code>.
       *
       * @expose
       * @event
       * @memberof! oj.ojNavigationList
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.key the key of the item to be collapse
       * @property {jQuery} ui.item the item to be collapse
       *
       * @example <caption>Initialize the NavigationList with the <code class="prettyprint">beforeCollapse</code> callback specified:</caption>
       * $( ".selector" ).ojNavigationList({
       *     "beforeCollapse": function( event, ui ) {
       *         // return false to veto the event, which prevents the item to collapse
       *     }
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforecollapse</code> event:</caption>
       * $( ".selector" ).on( "ojbeforecollapse", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
       */
      beforeCollapse: null,
      /**
       * Triggered before the current item is changed via the <code class="prettyprint">currentItem</code> option or via the UI.
       * To prevent the item being focused, return <code class="prettyprint">false</code> from event handler or invoke <code class="prettyprint">event.preventDefault()</code>.
       * @expose
       * @event
       * @memberof! oj.ojNavigationList
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.previousKey the key of the previous item
       * @property {jQuery} ui.previousItem the previous item
       * @property {Object} ui.key the key of the new current item
       * @property {jQuery} ui.item the new current item
       *
       * @example <caption>Initialize the NavigationList with the <code class="prettyprint">beforeCurrentItem</code> callback specified:</caption>
       * $( ".selector" ).ojNavigationList({
       *     "beforeCurrentItem": function( event, ui ) {
       *         // return false to veto the event, which prevents the item to become focus
       *     }
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforecurrentitem</code> event:</caption>
       * $( ".selector" ).on( "ojbeforecurrentitem", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
       */
      beforeCurrentItem: null,
      /**
       * Triggered after an item has been collapsed via the <code class="prettyprint">expanded</code> option,
       * the <code class="prettyprint">collapse</code> method, or via the UI.
       *
       * @expose
       * @event
       * @memberof! oj.ojNavigationList
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.key The key of the item that was just collapsed.
       * @property {jQuery} ui.item The list item that was just collapsed.
       *
       * @example <caption>Initialize the NavigationList with the <code class="prettyprint">expand</code> callback specified:</caption>
       * $( ".selector" ).ojNavigationList({
       *     "collapse": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcollapse</code> event:</caption>
       * $( ".selector" ).on( "ojcollapse", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
       */
      collapse: null,
      /**
       * Triggered before an item is expand via the <code class="prettyprint">expanded</code> option,
       * the <code class="prettyprint">expand</code> method, or via the UI.
       * To prevent the item being expanded, return <code class="prettyprint">false</code> from event handler or invoke <code class="prettyprint">event.preventDefault()</code>.
       * @expose
       * @event
       * @memberof! oj.ojNavigationList
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.key the key of the item to be expand
       * @property {jQuery} ui.item the item to be expand
       *
       * @example <caption>Initialize the NavigationList with the <code class="prettyprint">beforeExpand</code> callback specified:</caption>
       * $( ".selector" ).ojNavigationList({
       *     "beforeExpand": function( event, ui ) {
       *         // return false to veto the event, which prevents the item to expand
       *     }
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeexpand</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeexpand", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
       */
      beforeExpand: null,
      /**
       * Triggered after an item has been expanded via the <code class="prettyprint">expanded</code> option,
       * the <code class="prettyprint">expand</code> method, or via the UI.
       *
       * @expose
       * @event
       * @memberof! oj.ojNavigationList
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.key The key of the item that was just expanded.
       * @property {jQuery} ui.item The list item that was just expanded.
       *
       * @example <caption>Initialize the NavigationList with the <code class="prettyprint">expand</code> callback specified:</caption>
       * $( ".selector" ).ojNavigationList({
       *     "expand": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojexpand</code> event:</caption>
       * $( ".selector" ).on( "ojexpand", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
       */
      expand: null,
      /**
       * Fired whenever a supported component option changes, whether due to user interaction or programmatic
       * intervention.  If the new value is the same as the previous value, no event will be fired.
       *
       * @expose
       * @event
       * @memberof! oj.ojNavigationList
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {string} ui.option the name of the option that is changing
       * @property {boolean} ui.previousValue the previous value of the option
       * @property {boolean} ui.value the current value of the option
       * @property {Object} ui.optionMetadata information about the option that is changing
       * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
       *           <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
       * @property {jQuery} ui.item For <code class="prettyprint">selection</code> option change, this will be the selected list item. Otherwise it is <code class="prettyprint">undefined</code>.
       *
       * @example <caption>Initialize component with the <code class="prettyprint">optionChange</code> callback</caption>
       * $(".selector").ojNavigationList({
       *   'optionChange': function (event, data) {
       *        if (data['option'] === 'selection') { // handle selection change }
       *    }
       * });
       * @example <caption>Bind an event listener to the ojoptionchange event</caption>
       * $(".selector").on({
       *   'ojoptionchange': function (event, data) {
       *        // verify that the component firing the event is a component of interest 
       *        if ($(event.target).is(".mySelector")) { 
       *          window.console.log("option that changed is: " + data['option']);
       *        }
       *   };
       * });
       */
      optionChange: null
    },
    /**
     * Create the Navigation List
     * @override
     * @memberof! oj.ojNavigationList
     * @protected
     */
    _ComponentCreate: function () {
      this._super();
      this._setup();
    },
    /**
     * Initialize the NavigationList after creation
     * @protected
     * @override
     * @memberof! oj.ojNavigationList
     */
    _AfterCreate: function () {
      this._super();
      this.navlist.afterCreate();
    },
    /**
     * When the <a href="#contextMenu">contextMenu</a> option is set, this method is called when the user invokes the context menu via
     * the default gestures: right-click, pressHold, and <kbd>Shift-F10</kbd>.  Components should not call this method directly.
     *
     * @param {!Object} menu The JET Menu to open as a context menu.  Always non-<code class="prettyprint">null</code>.
     * @param {!Event} event What triggered the menu launch.  Always non-<code class="prettyprint">null</code>.
     * @param {string} eventType "mouse", "touch", or "keyboard".  Never <code class="prettyprint">null</code>.
     * @private
     */
    _NotifyContextMenuGesture: function (menu, event, eventType) {
      this.navlist.notifyContextMenuGesture(menu, event, eventType);
    },
    /**
     * Initialize DOM structure for navigation list.
     * @private
     * @memberof! oj.ojNavigationList
     */
    _setup: function () {
      var key, opts;
      for (key in this.options) {
        this._validateOptionValues(key, this.options[key]);
      }
      this._validateOptionsForIconsOnlyAndHorizontalList(this.options['drillMode'], this.options['display'], this.options['edge']);

      this.navlist = new _ojNavigationListView();

      opts = {};
      opts.ojContext = this;
      opts = $.extend(this.options, opts);
      this.navlist.init(opts);
    },

    getNodeBySubId: function (locator) {
      return this.navlist.getNodeBySubId(locator);
    },
    getSubIdByNode: function (node) {
      return this.navlist.getSubIdByNode(node);
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
     * @memberof oj.ojNavigationList
     */
    getContextByNode: function (node) {
      return this.navlist.getContextByNode(node);
    },
    /**
     * Expand an item.<p>
     * Note when vetoable is set to false, beforeExpand event will still be fired but the event cannot be veto.<p>
     *
     * @expose
     * @memberof oj.ojNavigationList
     * @instance
     * @param {Object} key the key of the item to expand
     * @param {boolean} vetoable if event is vetoable
     */
    expand: function (key, vetoable) {
      this.navlist.expandKey(key, vetoable, true, true);
    },
    /**
     * Collapse an item.<p>
     * Note when vetoable is set to false, beforeCollapse event will still be fired but the event cannot be veto.<p>
     *
     * @expose
     * @memberof oj.ojNavigationList
     * @instance
     * @param {Object} key the key of the item to collapse
     * @param {boolean} vetoable if event is vetoable
     */
    collapse: function (key, vetoable) {
      this.navlist.collapseKey(key, vetoable, true);
    },
    /**
     * Gets the key of currently expanded items.
     *
     * @expose
     * @memberof oj.ojNavigationList
     * @instance
     * @return {Array} array of keys of currently expanded items
     */
    getExpanded: function () {
      return this.navlist.getExpanded();
    },
    _validateOptionsForIconsOnlyAndHorizontalList: function (drillMode, display, edge) {
      if (drillMode !== 'none') {
        if (display === 'icons') {
          throw "Icon only navigation list should have drillMode set to 'none'.";
        }
        if (edge === 'top') {
          throw "Horizontal navigation list should have drillMode set to 'none'.";
        }
      }
    },
    _validateOptionValues: function (key, value) {
      var valid = true;
      if (key === "drillMode") {
        valid = (value === 'none' || value === 'collapsible' || value === 'sliding');
      } else if (key === "display") {
        valid = (value === 'all' || value === 'icons');
      } else if (key === "edge") {
        valid = (value === 'top' || value === 'start');
      }

      if (!valid) {
        throw "Invalid value: " + value + " for key: " + key;
      }

    },
    /**
     * Set single option
     * @param {string} key the option key
     * @param {Object} value value for option
     * @override
     * @memberof oj.ojNavigationList
     * @instance
     * @private
     */
    _setOption: function (key, value) {
      this._validateOptionValues(key, value);
      switch (key) {
      case "drillMode":
        this._validateOptionsForIconsOnlyAndHorizontalList(value, this.options['display'], this.options['edge']);
        break;
      case "display":
        this._validateOptionsForIconsOnlyAndHorizontalList(this.options['drillMode'], value, this.options['edge']);
        break;
      case "edge":
        this._validateOptionsForIconsOnlyAndHorizontalList(this.options['drillMode'], this.options['display'], value);
        break;
      }
      return this._super(key, value);
    },
    /**
     * Sets multiple options
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     * @override
     * @private
     */
    _setOptions: function (options, flags) {
      var key, result = this.navlist.setOptions(options, flags);

      for (key in options) {
        if (result.skipOptions.indexOf(key) < 0) {
          this._setOption(key, options[key], flags);
        }
      }

      if (result.needRefresh) {
        this.navlist.refresh();
      }
      return this;
    },
    /**
     * In browsers [Chrome v35, Firefox v24.5, IE9, Safari v6.1.4], blur and mouseleave events are generated for hidden content but not detached content,
     * so for detached content only, we must use this hook to remove the focus and hover classes.
     * @override
     * @private
     */
    _NotifyDetached: function () {
      this.navlist.notifyDetached();
    },
    /**
     * Invoked when application calls oj.Components.subtreeShown.
     * @override
     * @private
     */
    _NotifyShown: function () {
      this.navlist.notifyShown();
    },
    /**
     * Refreshes the visual state of the Navigation List. JET components require a <code class="prettyprint">refresh()</code> after the DOM is
     * programmatically changed underneath the component.
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojNavigationList
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojNavigationList( "refresh" );
     */
    refresh: function () {
      this._super();
      this.navlist.refresh();

    },
    /**
     * Returns a Promise that resolves when the component is ready, i.e. after data fetching, rendering, and animations complete. 
     * Note that in the highwatermark scrolling case, component is ready after data fetching, rendering, and associated animations of items fetched so far are complete.
     *
     * <p>This method does not accept any arguments.
     * 
     * @expose
     * @memberof oj.ojNavigationList
     * @instance
     * @return {Promise} A Promise that resolves when the component is ready.
     */
    whenReady: function () {
      return this.navlist.whenReady();
    },
    /**
     * Destroy the Navigation List
     * @memberof! oj.ojNavigationList
     * @private
     */
    _destroy: function () {
      this.navlist.destroy();
      this._super();
      delete this.navlist;
    }

    // Fragments:

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
     *       <td rowspan="2">List Item</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Selects the item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Press & Hold</kbd></td>
     *       <td>Display context menu</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="2">Group Item</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Expand or collapse the group item if <code class="prettyprint">drillMode</code> is set to collapsible.
     *       When <code class="prettyprint">drillMode</code> is set to sliding, sublist will silde in.
     *       When <code class="prettyprint">drillMode</code> is set to none, group item will be selecetd.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Press & Hold</kbd></td>
     *       <td>Display context menu</td>
     *     </tr>
     *     <tr>
     *       <td>Hierarchical Menu button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Open menu. Refer <a href="oj.ojButton.html#touch-section">menu button</a> touch documentation. Note: This is applicable only for Sliding Navigation List. </td>
     *     </tr>
     *     <tr>
     *       <td>Previous Icon or List Header</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Collapses the sublist and slides to parent list. Note: This is applicable only for Sliding Navigation List. </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojNavigationList
     */

    /**
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td rowspan="10">List Item</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Selects list item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Moves focus to the previous visible list item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to the next  visible list item</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd> (<kbd>LeftArrow</kbd> in RTL)</td>
     *       <td>For horizontal navigation list,focus will be moved to next visible item.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd> (<kbd>RightArrow</kbd> in RTL)</td>
     *       <td>For horizontal navigation list,focus will be moved to previous visible item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Moves focus to the first visible list item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Moves focus to the last visible list item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>F2</kbd></td>
     *       <td>If focus is on a list item, pressing F2 will make its contents accessible using TAB.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Esc</kbd></td>
     *       <td>When F2 mode is enabled, press Esc to exit F2 mode.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Tab</kbd></td>
     *       <td>Move fous to hierarchical menu button.Only applicable for sliding navigation list and when hierarchial menu button is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="2">Group Item</td>
     *       <td><kbd>RightArrow</kbd> (<kbd>LeftArrow</kbd> in RTL)</td>
     *       <td>If focus is on collapsed node, expands the sub list.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd> (<kbd>RightArrow</kbd> in RTL)</td>
     *       <td>If focus is on expanded node, collapses the sub list.</td>
     *     </tr>
     *     <tr>
     *       <td>List Item in sublist</td>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Applicable only for sliding navigation list. If focus is in a sub list, closes the sublist and moves focus to the parent list item.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="3">Hierarchical Menu button</td>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Open menu. Refer <a href="oj.ojButton.html#keyboard-section">menu button</a> keyboard documentation. Note: This target is visible only for Sliding Navigation List.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tab</kbd></td>
     *       <td>Moves focus to current list item. Note: This target is visible only for Sliding Navigation List. </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Tab</kbd></td>
     *       <td>Moves focus to Previous Icon. Note: This target is visible only for Sliding Navigation List.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="2">Previous Icon or List Header</td>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Collapses the sublist and slides to parent list.Note: This target is visible only for Sliding Navigation List. </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tab</kbd></td>
     *       <td>Moves focus to Hierarchical Menu button. Note: This target is visible only for Sliding Navigation List. </td>
     *     </tr>
     *
     *   </tbody>
     * </table>
     *
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojNavigationList
     */

    // SubId Locators *****************************************************

    /**
     * <p>Sub-ID for the ojNavigationList component's list item element.</p>
     *
     * <p>
     * To lookup the list items the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-navigationlist-item'</li>
     * <li><b>key</b>: the key of the item</li>
     * </ul>
     *
     * @ojsubid oj-navigationlist-item
     * @memberof oj.ojNavigationList
     *
     * @example <caption>Get the list item element with key 'foo':</caption>
     * var node = $( ".selector" ).ojNavigationList( "getNodeBySubId", {'subId': 'oj-navigationlist-item', 'key': 'foo'} );
     */
    /**
     * <p>Sub-ID for the ojNavigationList component's previous link element.</p>
     *
     * To lookup the previous link the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-navigationlist-previous-link'</li>
     * </ul>
     * @ojsubid oj-navigationlist-previous-link
     * @memberof oj.ojNavigationList
     *
     * @example <caption>Get the previous link element:</caption>
     * var node = $( ".selector" ).ojNavigationList( "getNodeBySubId", {'subId': 'oj-navigationlist-previous-link'} );
     */
    /**
     * <p>Sub-ID for the ojNavigationList component's hierarchical menu button element.
     * See the <a href="#getNodeBySubId">getNodeBySubId</a> method for details.</p>
     *
     * To lookup the hierarchical menu button the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-navigationlist-hierarchical-button'</li>
     * </ul>
     * @ojsubid
     * @name oj-navigationlist-hierarchical-button
     * @memberof oj.ojNavigationList
     *
     * @example <caption>Get the hierarchical menu button element:</caption>
     * var node = $( ".selector" ).ojNavigationList( "getNodeBySubId", {'subId': 'oj-navigationlist-hierarchical-button'} );
     */
    /**
     * <p>Sub-ID for the ojNavigationList component's hierarchical menu element.</p>
     *
     * To lookup the hierarchical menu the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-navigationlist-hierarchical-menu'</li>
     * </ul>
     * @ojsubid
     * @name oj-navigationlist-hierarchical-menu
     * @memberof oj.ojNavigationList
     *
     * @example <caption>Get the hierarchical menu element:</caption>
     * var node = $( ".selector" ).ojNavigationList( "getNodeBySubId", {'subId': 'oj-navigationlist-hierarchical-menu'} );
     */

    // Node Context Objects *********************************************
    /**
     * <p>Context for the ojNavigationList component's items.</p>
     *
     * @property {number} index the zero based item index relative to its parent
     * @property {Object} key the key of the item
     * @property {Element} parent the parent group item.  Only available if item has a parent.
     * @property {boolean} group whether the item is a group.
     *
     * @ojnodecontext oj-navigationlist-item
     * @memberof oj.ojNavigationList
     */
  });

  // Add custom getters for properties from theming file
  oj.Components.setDefaultOptions({
    'ojNavigationList': {
      'hierarchyMenuDisplayThresholdLevel': oj.Components.createDynamicPropertyGetter(
        function () {
          return (oj.ThemeUtils.parseJSONFromFontFamily('oj-navigationlist-option-defaults') || {})["hierarchyMenuDisplayThresholdLevel"];
        }
      )
    }
  });
}());

(function() {
var ojNavigationListMeta = {
  "properties": {
    "currentItem": {
      "type": "Object"
    },
    "data": {},
    "display": {
      "type": "string"
    },
    "drillMode": {
      "type": "string"
    },
    "edge": {
      "type": "string"
    },
    "expanded": {
      "type": "Array|string"
    },
    "hierarchyMenuDisplayThresholdLevel": {
      "type": "number"
    },
    "item": {},
    "navigationLevel": {
      "type": "string"
    },
    "rootLabel": {
      "type": "string"
    },
    "selection": {
      "type": "string"
    }
  },
  "methods": {
    "collapse": {},
    "expand": {},
    "getContextByNode": {},
    "getExpanded": {},
    "refresh": {},
    "whenReady": {}
  },
  "extension": {
    "_widgetName": "ojNavigationList"
  }
};
oj.Components.registerMetadata('ojNavigationList', 'baseComponent', ojNavigationListMeta);
oj.Components.register('oj-navigation-list', oj.Components.getMetadata('ojNavigationList'));
})();
});
