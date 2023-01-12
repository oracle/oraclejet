/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojcomponentcore', 'ojs/ojthemeutils', 'jquery', 'ojs/ojdomutils', 'ojs/ojnavigationlistdnd', 'ojs/ojlistview', 'ojs/ojdatacollection-common', 'ojs/ojmenu', 'ojs/ojbutton'], function (oj, Components, ThemeUtils, $, DomUtils, ojnavigationlistdnd, ojlistview, DataCollectionUtils, ojmenu, ojbutton) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  (function () {
var __oj_navigation_list_metadata = 
{
  "properties": {
    "as": {
      "type": "string",
      "value": ""
    },
    "currentItem": {
      "type": "any",
      "writeback": true
    },
    "data": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "unsupported",
              "since": "13.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
    },
    "display": {
      "type": "string",
      "enumValues": [
        "all",
        "icons"
      ],
      "value": "all"
    },
    "drillMode": {
      "type": "string",
      "enumValues": [
        "collapsible",
        "none",
        "sliding"
      ],
      "value": "none"
    },
    "edge": {
      "type": "string",
      "enumValues": [
        "bottom",
        "start",
        "top"
      ],
      "value": "start"
    },
    "expanded": {
      "type": "KeySet",
      "writeback": true
    },
    "hierarchyMenuThreshold": {
      "type": "number",
      "value": 0
    },
    "item": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        },
        "selectable": {
          "type": "function|boolean",
          "value": true
        }
      }
    },
    "overflow": {
      "type": "string",
      "enumValues": [
        "hidden",
        "popup"
      ],
      "value": "hidden"
    },
    "rootLabel": {
      "type": "string",
      "value": "Navigation List"
    },
    "selection": {
      "type": "any",
      "writeback": true
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "defaultRootLabel": {
          "type": "string"
        },
        "hierMenuBtnLabel": {
          "type": "string"
        },
        "msgFetchingData": {
          "type": "string"
        },
        "msgNoData": {
          "type": "string"
        },
        "overflowItemLabel": {
          "type": "string"
        },
        "previousIcon": {
          "type": "string"
        },
        "selectedLabel": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getContextByNode": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {},
    "ojBeforeCollapse": {},
    "ojBeforeCurrentItem": {},
    "ojBeforeExpand": {},
    "ojBeforeSelect": {},
    "ojCollapse": {},
    "ojExpand": {},
    "ojSelectionAction": {}
  },
  "extension": {}
};
    __oj_navigation_list_metadata.extension._WIDGET_NAME = 'ojNavigationList';
    __oj_navigation_list_metadata.extension._ALIASED_PROPS = {
      hierarchyMenuThreshold: 'hierarchyMenuDisplayThresholdLevel'
    };
    oj.CustomElementBridge.register('oj-navigation-list', {
      metadata: __oj_navigation_list_metadata
    });

var __oj_tab_bar_metadata = 
{
  "properties": {
    "as": {
      "type": "string",
      "value": ""
    },
    "currentItem": {
      "type": "any",
      "writeback": true
    },
    "data": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "deprecated",
              "since": "14.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
    },
    "display": {
      "type": "string",
      "enumValues": [
        "all",
        "icons",
        "stacked"
      ],
      "value": "all"
    },
    "edge": {
      "type": "string",
      "enumValues": [
        "bottom",
        "end",
        "start",
        "top"
      ],
      "value": "start"
    },
    "item": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        },
        "selectable": {
          "type": "function|boolean",
          "value": true
        }
      }
    },
    "layout": {
      "type": "string",
      "enumValues": [
        "condense",
        "stretch"
      ],
      "value": "stretch"
    },
    "overflow": {
      "type": "string",
      "enumValues": [
        "hidden",
        "popup"
      ],
      "value": "hidden"
    },
    "reorderable": {
      "type": "string",
      "enumValues": [
        "disabled",
        "enabled"
      ],
      "value": "disabled"
    },
    "selection": {
      "type": "any",
      "writeback": true
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleReorderAfterItem": {
          "type": "string"
        },
        "accessibleReorderBeforeItem": {
          "type": "string"
        },
        "accessibleReorderTouchInstructionText": {
          "type": "string"
        },
        "labelCut": {
          "type": "string"
        },
        "labelPasteAfter": {
          "type": "string"
        },
        "labelPasteBefore": {
          "type": "string"
        },
        "labelRemove": {
          "type": "string"
        },
        "msgFetchingData": {
          "type": "string"
        },
        "msgNoData": {
          "type": "string"
        },
        "overflowItemLabel": {
          "type": "string"
        },
        "removeCueText": {
          "type": "string"
        },
        "selectedLabel": {
          "type": "string"
        }
      }
    },
    "truncation": {
      "type": "string",
      "enumValues": [
        "none",
        "progressive"
      ],
      "value": "none"
    }
  },
  "methods": {
    "getContextByNode": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {},
    "ojBeforeCurrentItem": {},
    "ojBeforeDeselect": {},
    "ojBeforeRemove": {},
    "ojBeforeSelect": {},
    "ojDeselect": {},
    "ojRemove": {},
    "ojReorder": {}
  },
  "extension": {}
};
    /* global __oj_tab_bar_metadata */
    __oj_tab_bar_metadata.extension._WIDGET_NAME = 'ojNavigationList';
    oj.CustomElementBridge.register('oj-tab-bar', {
      metadata: __oj_tab_bar_metadata
    });
  })();

  const _ARIA_HIDDEN = 'aria-hidden';
  const _ARIA_LABEL = 'aria-label';
  const _OJ_DEFAULT = 'oj-default';
  const _OJ_DISABLED = 'oj-disabled';

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
  const _ojNavigationListView = _NavigationListUtils.clazz(
    oj._ojListView,
    /** @lends _ojNavigationListView.prototype */
    {
      OPTION_DRILL_MODE: 'drillMode',
      OPTION_DRILL_MODE_NONE: 'none',
      OPTION_DRILL_MODE_COLLAPSIBLE: 'collapsible',
      OPTION_DRILL_MODE_SLIDING: 'sliding',
      OPTION_DISPLAY: 'display',
      OPTION_DISPLAY_ICONS: 'icons',
      OPTION_DISPLAY_ALL: 'all',
      OPTION_DISPLAY_STACKED: 'stacked',
      OPTION_LAYOUT_STRETCH: 'stretch',
      OPTION_LAYOUT_CONDENSE: 'condense',
      OPTION_EDGE: 'edge',
      OPTION_EDGE_TOP: 'top',
      OPTION_EDGE_END: 'end',
      OPTION_EDGE_START: 'start',
      OPTION_EDGE_BOTTOM: 'bottom',
      OPTION_SELECTION: 'selection',
      OPTION_CURRENT_ITEM: 'currentItem',
      OPTION_ITEM: 'item',
      TAG_NAME_TAB_BAR: 'oj-tab-bar',
      NAVLIST_ITEM_SUBID_KEY: {
        navlist: 'oj-navigationlist-item',
        tabbar: 'oj-tabbar-item'
      },
      NAVLIST_EXPANDED_STYLE_CLASS: {
        navlist: 'oj-navigationlist-expanded',
        tabbar: 'oj-tabbar-expanded'
      },
      NAVLIST_COLLAPSIBLE_STYLE_CLASS: {
        navlist: 'oj-navigationlist-collapsible',
        tabbar: 'oj-tabbar-collapsible'
      },
      NAVLIST_VERTICAL_STYLE_CLASS: {
        navlist: 'oj-navigationlist-vertical',
        tabbar: 'oj-tabbar-vertical'
      },

      ITEM_CONTENT_STYLE_CLASS: {
        navlist: 'oj-navigationlist-item-content',
        tabbar: 'oj-tabbar-item-content'
      },
      NAVLIST_DIVIDERS_STYLE_CLASS: {
        navlist: 'oj-navigationlist-item-dividers',
        tabbar: 'oj-tabbar-item-dividers'
      },
      LAST_ITEM_STYLE_CLASS: {
        navlist: 'oj-navigationlist-item-last-child',
        tabbar: 'oj-tabbar-item-last-child'
      },
      EXPANDED_STYLE_CLASS: 'oj-expanded',
      COLLAPSED_STYLE_CLASS: 'oj-collapsed',
      CONDENSE_STYLE_CLASS: 'oj-condense',
      SLIDING_NAVLIST_CURRENT_STYLE_CLASS: 'oj-navigationlist-current',
      DIVIDER_STYLE_CLASS: {
        navlist: 'oj-navigationlist-divider',
        tabbar: 'oj-tabbar-divider'
      },
      NAVLIST_OVERFLOW_MENU_ITEM: {
        navlist: 'oj-navigationlist-overflow-menu-item',
        tabbar: 'oj-tabbar-overflow-menu-item'
      },
      NAVLIST_OVERFLOW_MENU: {
        navlist: 'oj-navigationlist-overflow-menu',
        tabbar: 'oj-tabbar-overflow-menu'
      },
      NAVLIST_OVERFLOW_ITEM_ICON: {
        navlist: 'oj-navigationlist-overflow-item-icon',
        tabbar: 'oj-tabbar-overflow-item-icon'
      },
      _CATEGORY_DIVIDER_STYLE_CLASS: {
        navlist: 'oj-navigationlist-category-divider',
        tabbar: 'oj-tabbar-category-divider'
      },
      _ITEM_LABEL_STYLE_CLASS: {
        navlist: 'oj-navigationlist-item-label',
        tabbar: 'oj-tabbar-item-label'
      },
      _ICON_ONLY_STYLE_CLASS: {
        navlist: 'oj-navigationlist-icon-only',
        tabbar: 'oj-tabbar-icon-only'
      },
      _STACK_ICON_STYLE_CLASS: {
        navlist: 'oj-navigationlist-stack-icon-label',
        tabbar: 'oj-tabbar-stack-icon-label'
      },
      _ITEM_ICON_STYLE_CLASS: {
        navlist: 'oj-navigationlist-item-icon',
        tabbar: 'oj-tabbar-item-icon'
      },
      _ITEM_BADGE_STYLE_CLASS: {
        navlist: 'oj-navigationlist-item-end',
        tabbar: 'oj-tabbar-item-end'
      },
      _HORIZONTAL_NAVLIST_STYLE_CLASS: {
        navlist: 'oj-navigationlist-horizontal',
        tabbar: 'oj-tabbar-horizontal'
      },
      _NAVLIST_END_EDGE_STYLE_CLASS: {
        navlist: 'oj-navigationlist-vertical-end',
        tabbar: 'oj-tabbar-vertical-end'
      },
      _NAVLIST_BOTTOM_EDGE_STYLE_CLASS: {
        navlist: 'oj-navigationlist-horizontal-bottom',
        tabbar: 'oj-tabbar-horizontal-bottom'
      },
      _NAVLIST_HAS_ICONS: {
        navlist: 'oj-navigationlist-has-icons',
        tabbar: 'oj-tabbar-has-icons'
      },
      _NAVLIST_ITEM_HAS_NO_ICON: {
        navlist: 'oj-navigationlist-item-no-icon',
        tabbar: 'oj-tabbar-item-no-icon'
      },
      _NAVLIST_ITEM_TITLE: {
        navlist: 'oj-navigationlist-item-title',
        tabbar: 'oj-tabbar-item-title'
      },
      _NAVLIST_STYLE_CLASS: {
        navlist: 'oj-navigationlist',
        tabbar: 'oj-tabbar'
      },
      _NAVLIST_TOUCH_STYLE_CLASS: {
        navlist: 'oj-navigationlist-touch',
        tabbar: 'oj-tabbar-touch'
      },
      _NAVLIST_LISTVIEW_CONTAINER_STYLE_CLASS: {
        navlist: 'oj-navigationlist-listview-container',
        tabbar: 'oj-tabbar-listview-container'
      },
      _IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION: 'IsTitleAttrDueToTruncation',
      _APPLICATION_LEVEL_NAV_STYLE_CLASS: 'oj-navigationlist-app-level',
      _PAGE_LEVEL_NAV_STYLE_CLASS: 'oj-navigationlist-page-level',
      _NAVLIST_ITEM_ICON_HAS_TITLE: 'navigationListItemIconHastitle',
      _NAVLIST_NO_FOLLOW_LINK_CLASS: {
        navlist: 'oj-navigationlist-nofollow-link',
        tabbar: 'oj-tabbar-nofollow-link'
      },
      _CONTAINER_STYLE_CLASS: {
        navlist: 'oj-navigationlist-listview',
        tabbar: 'oj-tabbar-listview'
      },
      _ELEMENT_STYLE_CLASS: {
        navlist: 'oj-navigationlist-element',
        tabbar: 'oj-tabbar-element'
      },
      _ELEMENT_EMPTY_TEXT_STYLE_CLASS: {
        navlist: 'oj-navigationlist-empty-text',
        tabbar: 'oj-tabbar-empty-text'
      },
      _ELEMENT_NO_DATA_MSG_STYLE_CLASS: {
        navlist: 'oj-navigationlist-no-data-message',
        tabbar: 'oj-tabbar-no-data-message'
      },
      _FOCUSED_ELEMENT_STYLE_CLASS: {
        navlist: 'oj-navigationlist-focused-element',
        tabbar: 'oj-tabbar-focused-element'
      },
      _ITEM_ELEMENT_STYLE_CLASS: {
        navlist: 'oj-navigationlist-item-element',
        tabbar: 'oj-tabbar-item-element'
      },
      _ITEM_STYLE_CLASS: {
        navlist: 'oj-navigationlist-item',
        tabbar: 'oj-tabbar-item'
      },
      _OPTION_DEFAULT_STYLE_CLASS: {
        navlist: 'oj-navigationlist-option-defaults',
        tabbar: 'oj-tabbar-option-defaults'
      },
      _LOADING_STATUS_ICON_STYLE_CLASS: {
        navlist: 'oj-navigationlist-loading-icon',
        tabbar: 'oj-tabbar-loading-icon'
      },
      _STATUS_MSG_STYLE_CLASS: {
        navlist: 'oj-navigationlist-status-message',
        tabbar: 'oj-tabbar-status-message'
      },
      _STATUS_STYLE_CLASS: {
        navlist: 'oj-navigationlist-status',
        tabbar: 'oj-tabbar-status'
      },
      /**
       * Returns Item label text
       * @returns {string|null} Item label
       */
      getItemLabel: function (target) {
        var itemContent = this.getItemContentElement(target);
        if (itemContent.is('a')) {
          // When using simple <a> markup
          return $.trim(itemContent.text()).replace('CORE PACK', '');
        }
        // When using arbitrary content, extract item title from element having marker class .oj-navigationlist-item-title.
        return $.trim(itemContent.find('.' + this.getItemTitleStyleClass()).text());
      },

      /**
       * Returns Item content root element.
       * @returns {Object} Returns jquery object for item content root
       */
      getItemContentElement: function (item) {
        var itemContent = item.children('.' + this.getItemContentStyleClass());
        if (itemContent.length === 0) {
          itemContent = item
            .children('.' + this.getGroupItemStyleClass())
            .children('.' + this.getItemContentStyleClass());
          if (itemContent.length === 0) {
            // This case is when item label is invoked before complete initialization of listview
            itemContent = item
              .children('.' + this.getGroupItemStyleClass())
              .children(
                ':not(.' +
                  this.getExpandIconStyleClass() +
                  '):not(.' +
                  this.getCollapseIconStyleClass() +
                  ')'
              );
          }
        }
        return itemContent;
      },

      /**
       * Return true when page is in rtl mode otherwise false.
       * @returns {boolean} true if page is in rtl mode
       */
      isRtl: function () {
        return this.ojContext._GetReadingDirection() === 'rtl';
      },

      _initNavigationMode: function (rootElement) {
        var tagName = rootElement[0].tagName.toLowerCase();

        if (tagName === this.TAG_NAME_TAB_BAR) {
          this._navigationMode = 'tabbar';
        } else {
          this._navigationMode = 'navlist'; // if user uses div jquery widget continue with application level
        }
      },

      _getNavigationMode: function () {
        return this._navigationMode;
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
        _ojNavigationListView.superclass.itemInsertComplete.apply(this, arguments);
      },

      /**
       * Called by content handler once the content of an item is removed triggered by an remove event
       * @param {Element} elem the item element
       * @param {boolean} restoreFocus true if focus should be restore, false otherwise
       */
      // eslint-disable-next-line no-unused-vars
      itemRemoveComplete: function (elem, restoreFocus) {
        this.m_listHandler.ItemRemoveComplete(elem);
        return _ojNavigationListView.superclass.itemRemoveComplete.apply(this, arguments);
      },
      /**
       * Restore content while restroying list
       * @private
       */
      _restoreContent: function (list) {
        var items = list.children();
        list.removeAttr('style').removeClass(this.getHasIconsStyleClass()).removeAttr(_ARIA_HIDDEN);
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          item = $(item);
          if (item.hasClass(this.getDividerStyleClass())) {
            item.remove();
          } else {
            var itemContent = this.getItemContentElement(item);
            itemContent
              .removeClass(this.getItemContentStyleClass())
              .removeClass(this.getHasNoIconStyleClass())
              .removeAttr('aria-haspopup');
            var itemIcon = itemContent.children('.' + this.getItemIconStyleClass());
            if (itemIcon && itemIcon.length > 0) {
              itemIcon.removeAttr('role');
              itemIcon.removeAttr(_ARIA_LABEL);
              this._removeToolTipOnIcon(itemIcon);
            }

            item
              .removeClass(_OJ_DEFAULT)
              .removeAttr('role')
              .removeAttr('aria-disabled')
              .removeAttr('aria-expanded')
              .removeAttr(_ARIA_HIDDEN)
              .removeAttr('aria-pressed');
            var focusableItem = this.getFocusItem(item);
            focusableItem.removeAttr('role').removeAttr(_ARIA_HIDDEN).removeAttr('aria-pressed');
            itemContent
              .children('.' + this.getItemLabelStyleClass())
              .contents()
              .unwrap();
            item.find('.' + this.getNavListRemoveIcon()).remove();
            if (focusableItem.data(this._IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION)) {
              focusableItem.removeAttr('title');
            }
            var sublist = item.children('ul');
            if (sublist.length > 0) {
              this.m_listHandler.RestoreItem(item, itemContent, sublist);
              this._restoreContent(sublist);
            } else {
              this.m_listHandler.RestoreItem(item, itemContent);
            }
          }
        }
      },

      /**
       * Returns DnD Context
       * @private
       * @override
       */
      GetDnDContext: function () {
        if (
          typeof ojnavigationlistdnd.NavigationListDndContext !== 'undefined' &&
          this.ojContext.element[0].tagName.toLowerCase() === this.TAG_NAME_TAB_BAR
        ) {
          return new ojnavigationlistdnd.NavigationListDndContext(this);
        }
        return undefined;
      },

      /**
       * Overriding to exclude oj-navigationlist-item-content from clickable components.
       * @override
       * @protected
       */
      IsNodeEditableOrClickable: function (node) {
        if (
          node.hasClass(this.getItemContentStyleClass()) ||
          node.hasClass(this.getExpandIconStyleClass()) ||
          node.hasClass(this.getCollapseIconStyleClass())
        ) {
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
        var nodeName = node.prop('nodeName');
        // Exclude navlist item content <a> tag from below list and also checking for oj-component class as it is needed for toggle button.
        return (
          (nodeName.match(/^INPUT|SELECT|OPTION|BUTTON|^A\b|TEXTAREA/) &&
            !node.hasClass(this.getItemContentStyleClass())) ||
          node.hasClass('oj-component')
        );
      },

      _focusable: function (context) {
        if ($(context.data).is('li')) {
          return !$(context.data).hasClass(_OJ_DISABLED);
        }
        return !$(context.parentElement).hasClass(_OJ_DISABLED);
      },

      /**
       * Prepare options to initialize ListView base class
       * @private
       */
      _prepareListViewOptions: function (navlistOptions) {
        var opts = $.extend({}, navlistOptions);

        opts.drillMode = navlistOptions.drillMode !== 'none' ? 'collapsible' : 'none';
        opts.selection = navlistOptions.selection !== null ? [navlistOptions.selection] : [];
        opts.selectionMode = 'single';
        opts.item = $.extend(
          {
            focusable: this._focusable
          },
          navlistOptions.item
        );

        opts.element = this._list;
        return opts;
      },

      /**
       * Update cloned option to make it compatible with listview
       * @private
       */
      updateListViewOption: function (key, value) {
        switch (key) {
          case this.OPTION_DRILL_MODE:
            this.options[this.OPTION_DRILL_MODE] = value !== 'none' ? 'collapsible' : 'none';
            break;
          case this.OPTION_SELECTION:
            this.options[this.OPTION_SELECTION] = value !== null ? [value] : [];
            break;
          case this.OPTION_ITEM:
            this.options[this.OPTION_ITEM] = $.extend(
              {
                focusable: this._focusable
              },
              value
            );
            break;
          default:
            this.options[key] = value;
            break;
        }
      },

      /**
       * Returns root label for navigation list.
       * otherwise return the emptyText set in the options
       * @return {string} Label for navigation list
       */
      getRootLabel: function () {
        if (this.ojContext.options.rootLabel) {
          return this.ojContext.options.rootLabel;
        }

        return this.ojContext.getTranslatedString('defaultRootLabel');
      },

      /**
       * Sets wai-aria properties on root element
       * @override
       * @protected
       */
      SetAriaProperties: function () {
        // add aria-multiselectable attribute only on tabbar
        if (this._getNavigationMode() === 'tabbar') {
          this.ojContext.element.attr('aria-multiselectable', false);
        }
      },

      /**
       * Handler for focus event
       * @param {Event} event the focus event
       * @protected
       * @override
       */
      HandleFocus: function (event) {
        return this.m_listHandler.HandleFocus(event);
      },

      /**
       * Handler for blur event
       * @param {Event} event the blur event
       * @protected
       * @override
       */
      HandleBlur: function (event) {
        return this.m_listHandler.HandleBlur(event);
      },

      /**
       * Sets the tab index attribute of the root element
       * @override
       */
      SetRootElementTabIndex: function () {
        this.ojContext.element.attr('tabIndex', 0);
      },

      /**
       * Removes the tab index attribute of the root element
       * @override
       */
      RemoveRootElementTabIndex: function () {
        this.ojContext.element.removeAttr('tabIndex');
      },

      /**
       * Removes wai-aria properties on root element
       * @override
       * @protected
       */
      UnsetAriaProperties: function () {
        this.ojContext.element.removeAttr('aria-activedescendant').removeAttr('aria-multiselectable');
      },

      /**
       * Whether high-watermark scrolling is specified
       * @override
       */
      isLoadMoreOnScroll: function () {
        return false;
      },

      /**
       * Whether to use grid role
       * @override
       */
      ShouldUseGridRole: function () {
        return false;
      },

      /**
       * Overriding init to initialize list with respective List handler.
       * @override
       */
      init: function (navlistopts) {
        var self = this;
        var element = navlistopts.ojContext.element;

        this._initNavigationMode(element);

        element.addClass(this.getNavListStyleClass());

        if (DomUtils.isTouchSupported()) {
          element.addClass(this.getNavListTouchStyleClass());
        }

        this._list = element.children('ul:first');
        if (this._list.length === 0) {
          this._list = $(document.createElement('ul'));
          element.append(this._list); // @HTMLUpdateOK
        }

        var listViewContainer = $(document.createElement('div'));
        listViewContainer.addClass(this.getNavListContainerStyleClass());
        listViewContainer.attr('role', 'presentation');

        this._list.wrap(listViewContainer); // @HTMLUpdateOK
        var opts = this._prepareListViewOptions(navlistopts);

        _ojNavigationListView.superclass.init.call(this, opts);
        this.getListContainer().attr('role', 'presentation');
        this.element.removeClass('oj-component-initnode');
        this.ojContext._on(this.ojContext.element, {
          click: function (event) {
            self.m_listHandler.HandleClick(event);
          },

          keydown: function (event) {
            self.m_listHandler.HandleKeydown(event);
          },

          mouseup: function (event) {
            self._clearActiveState(event);
          },

          mouseover: function (event) {
            if ($(event.target).closest('a.' + self.getItemContentStyleClass()).length > 0) {
              var $itemLink = $(event.target).closest('a.' + self.getItemContentStyleClass());
              var $label = $itemLink.find('.' + self.getItemLabelStyleClass());
              // Add title attribute only when the text is truncated.
              if ($label[0].offsetWidth < $label[0].scrollWidth && !$itemLink.attr('title')) {
                $itemLink.attr('title', $label.text().trim());
                $itemLink.data(self._IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION, 'true');
              }
            }
          },

          mouseout: function (event) {
            if ($(event.target).closest('a.' + self.getItemContentStyleClass()).length > 0) {
              // Remove title attribute on mouseleave.
              var $itemLink = $(event.target).closest('a.' + self.getItemContentStyleClass());
              if ($itemLink.data(self._IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION)) {
                $itemLink.removeData(self._IS_TITLE_ATTR_ADDED_DUE_TO_TRUNCATION);
                $itemLink.removeAttr('title');
              }
              self._clearActiveState(event);
            }
          }
        });
      },

      _initListHandler: function () {
        var drillMode = this.ojContext.options.drillMode;
        var edge = this.ojContext.options.edge;

        if (drillMode === this.OPTION_DRILL_MODE_SLIDING) {
          this.m_listHandler = new oj.SlidingNavListHandler(
            this,
            this.ojContext.element,
            this.ojContext
          );
        } else if (drillMode === this.OPTION_DRILL_MODE_COLLAPSIBLE) {
          this.m_listHandler = new oj.CollapsibleNavListHandler(
            this,
            this.ojContext.element,
            this.ojContext
          );
        } else if (
          drillMode === this.OPTION_DRILL_MODE_NONE &&
          (edge === this.OPTION_EDGE_TOP || edge === this.OPTION_EDGE_BOTTOM)
        ) {
          this.m_listHandler = new oj.HorizontalNavListHandler(
            this,
            this.ojContext.element,
            this.ojContext
          );
        } else {
          this.m_listHandler = new oj.DefaultNavListHandler(
            this,
            this.ojContext.element,
            this.ojContext
          );
        }

        this.m_listHandler.Init(this.options);
        var navigationLevel = this.ojContext.options.navigationLevel;
        this._setNavigationLevel(navigationLevel);
      },

      _setNavigationLevel: function (navigationLevel) {
        var drillMode = this.ojContext.options.drillMode;
        if (drillMode === 'none') {
          if (
            navigationLevel === 'application' ||
            this.ojContext.element[0].tagName.toLowerCase() === 'oj-navigation-list'
          ) {
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
          this.HighlightUnhighlightElem(item, 'oj-active', false);
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
       * Gets the animation effect for the specific action
       * @param {string} action the action to retrieve the effect
       * @return {Object} the animation effect for the action
       */
      getAnimationEffect: function (action) {
        return this.m_listHandler.GetAnimationEffect(action);
      },

      notifyAttached: function () {
        _ojNavigationListView.superclass.notifyAttached.apply(this, arguments);
        this.m_listHandler.NotifyAttached();
      },

      ShouldRegisterResizeListener: function () {
        return true;
      },

      HandleResize: function (width, height) {
        var self = this;
        _ojNavigationListView.superclass.HandleResize.apply(this, arguments);
        if (width > 0 && height > 0 && this.m_listHandler != null) {
          self.m_listHandler.HandleResize(width, height);
        }
      },

      BeforeInsertItem: function () {
        this.m_listHandler.BeforeInsertItem();
      },

      /**
       * Event handler for when mouse down or touch start anywhere in the list
       * @param {Event} event mousedown or touchstart event
       * @protected
       */
      HandleMouseDownOrTouchStart: function (event) {
        _ojNavigationListView.superclass.HandleMouseDownOrTouchStart.apply(this, arguments);
        var item = this.FindItem($(event.target));
        if (item && !item.hasClass(_OJ_DISABLED)) {
          this.HighlightUnhighlightElem(item, 'oj-active', true);
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
      getItemContentStyleClass: function () {
        return this.ITEM_CONTENT_STYLE_CLASS[this._getNavigationMode()];
      },
      getNavListExpandedStyleClass: function () {
        return this.NAVLIST_EXPANDED_STYLE_CLASS[this._getNavigationMode()];
      },
      getNavListCollapsibleStyleClass: function () {
        return this.NAVLIST_COLLAPSIBLE_STYLE_CLASS[this._getNavigationMode()];
      },
      getNavListVerticalStyleClass: function () {
        return this.NAVLIST_VERTICAL_STYLE_CLASS[this._getNavigationMode()];
      },
      getNavListItemsDividerStyleClass: function () {
        return this.NAVLIST_DIVIDERS_STYLE_CLASS[this._getNavigationMode()];
      },
      getLastItemStyleClass: function () {
        return this.LAST_ITEM_STYLE_CLASS[this._getNavigationMode()];
      },
      getItemBadgeStyleClass: function () {
        return this._ITEM_BADGE_STYLE_CLASS[this._getNavigationMode()];
      },
      getDividerStyleClass: function () {
        return this.DIVIDER_STYLE_CLASS[this._getNavigationMode()];
      },
      getOverflowItemStyleClass: function () {
        return this.NAVLIST_OVERFLOW_MENU_ITEM[this._getNavigationMode()];
      },
      getOverflowMenuStyleClass: function () {
        return this.NAVLIST_OVERFLOW_MENU[this._getNavigationMode()];
      },
      getOverflowItemIconStyleClass: function () {
        return this.NAVLIST_OVERFLOW_ITEM_ICON[this._getNavigationMode()];
      },
      getCategoryDividerStyleClass: function () {
        return this._CATEGORY_DIVIDER_STYLE_CLASS[this._getNavigationMode()];
      },
      getItemLabelStyleClass: function () {
        return this._ITEM_LABEL_STYLE_CLASS[this._getNavigationMode()];
      },
      getIconOnlyStyleClass: function () {
        return this._ICON_ONLY_STYLE_CLASS[this._getNavigationMode()];
      },
      getStackedIconStyleClass: function () {
        return this._STACK_ICON_STYLE_CLASS[this._getNavigationMode()];
      },
      getItemIconStyleClass: function () {
        return this._ITEM_ICON_STYLE_CLASS[this._getNavigationMode()];
      },
      getHorizontalNavListStyleClass: function () {
        return this._HORIZONTAL_NAVLIST_STYLE_CLASS[this._getNavigationMode()];
      },
      getNavListEndEdgeStyleClass: function () {
        return this._NAVLIST_END_EDGE_STYLE_CLASS[this._getNavigationMode()];
      },
      getNavListBottomEdgeStyleClass: function () {
        return this._NAVLIST_BOTTOM_EDGE_STYLE_CLASS[this._getNavigationMode()];
      },
      getHasIconsStyleClass: function () {
        return this._NAVLIST_HAS_ICONS[this._getNavigationMode()];
      },
      getHasNoIconStyleClass: function () {
        return this._NAVLIST_ITEM_HAS_NO_ICON[this._getNavigationMode()];
      },
      getItemTitleStyleClass: function () {
        return this._NAVLIST_ITEM_TITLE[this._getNavigationMode()];
      },
      getNavListStyleClass: function () {
        return this._NAVLIST_STYLE_CLASS[this._getNavigationMode()];
      },
      getNavListTouchStyleClass: function () {
        return this._NAVLIST_TOUCH_STYLE_CLASS[this._getNavigationMode()];
      },
      getNavListContainerStyleClass: function () {
        return this._NAVLIST_LISTVIEW_CONTAINER_STYLE_CLASS[this._getNavigationMode()];
      },
      getNoFollowLinkStyleClass: function () {
        return this._NAVLIST_NO_FOLLOW_LINK_CLASS[this._getNavigationMode()];
      },
      getCondenseStyleClass: function () {
        return this.CONDENSE_STYLE_CLASS;
      },

      getItemSubIdKey: function () {
        if (this.isTabBar()) {
          return this.NAVLIST_ITEM_SUBID_KEY.tabbar;
        }
        return this.NAVLIST_ITEM_SUBID_KEY.navlist;
      },

      /**
       * Returns Navlist specific container style class
       * @override
       * @protected
       */
      GetContainerStyleClass: function () {
        return this._CONTAINER_STYLE_CLASS[this._getNavigationMode()];
      },

      /**
       * Returns Navlist specific root element style class
       * @override
       * @protected
       */
      GetStyleClass: function () {
        return this._ELEMENT_STYLE_CLASS[this._getNavigationMode()];
      },

      /**
       * Returns Navlist specific Item style class
       * @override
       */
      getEmptyTextMarkerClass: function () {
        return this._ELEMENT_EMPTY_TEXT_STYLE_CLASS[this._getNavigationMode()];
      },

      /**
       * Returns Navlist specific Item style class
       * @override
       */
      getEmptyTextStyleClass: function () {
        return this._ELEMENT_NO_DATA_MSG_STYLE_CLASS[this._getNavigationMode()];
      },

      getNavListRemoveIcon: function () {
        return 'oj-tabbar-remove-icon';
      },

      getNavListRemoveCommand: function () {
        return 'oj-tabbar-remove';
      },

      getRemovableStyleClass: function () {
        return 'oj-removable';
      },

      /**
       * Returns Navlist specific Item style class
       * @override
       */
      getItemStyleClass: function () {
        return this._ITEM_STYLE_CLASS[this._getNavigationMode()];
      },

      /**
       * NavList doesn't have item layout style class
       * @override
       */
      getItemLayoutStyleClass: function () {
        return this.getItemStyleClass();
      },

      getFocusedElementStyleClass: function () {
        return this._FOCUSED_ELEMENT_STYLE_CLASS[this._getNavigationMode()];
      },

      /**
       * Returns Navlist specific Item element style class
       * @override
       */
      getItemElementStyleClass: function () {
        return this._ITEM_ELEMENT_STYLE_CLASS[this._getNavigationMode()];
      },

      /**
       * Returns Navlist specific collapse icon style class
       * @override
       */
      getCollapseIconStyleClass: function () {
        return 'oj-navigationlist-collapse-icon';
      },

      /**
       * Returns Navlist specific expand icon style class
       * @override
       */
      getExpandIconStyleClass: function () {
        return 'oj-navigationlist-expand-icon';
      },

      /**
       * Returns Navlist specific depth style class
       * @override
       */
      getDepthStyleClass: function (depth) {
        return 'oj-navigationlist-depth-' + depth;
      },

      /**
       * Returns Navlist specific Group Item style class
       * @override
       */
      getGroupItemStyleClass: function () {
        return 'oj-navigationlist-group-item';
      },

      /**
       * Returns Navlist specific Group style class
       * @override
       */
      getGroupStyleClass: function () {
        return 'oj-navigationlist-group';
      },

      /**
       * Returns Navlist specific group expand style class
       * @override
       */
      getGroupExpandStyleClass: function () {
        return 'oj-navigationlist-collapsible-transition';
      },

      /**
       * Returns Navlist specific group collapse style class
       * @override
       */
      getGroupCollapseStyleClass: function () {
        return this.getGroupExpandStyleClass();
      },

      /**
       * Override default styles values
       * @return {Object} default styles values
       */
      getStyleValues: function () {
        const defaultOptions = {};
        Object.entries(_ojNavigationListView._CSS_Vars[this._getNavigationMode()]).forEach(
          ([key, value]) => {
            if (key === 'animation') {
              defaultOptions.animation = oj._ojListView.getComplexCSSVariable(value);
            } else {
              defaultOptions[key] = ThemeUtils.getCachedCSSVarValues([value])[0];
            }
          }
        );
        return defaultOptions;
      },
      /**
       * Returns Navlist specific Loaidng status icon style class
       * @override
       * @return {string} Loading status icon style class
       */
      getLoadingStatusIconStyleClass: function () {
        return this._LOADING_STATUS_ICON_STYLE_CLASS[this._getNavigationMode()];
      },

      /**
       * Returns Navlist specific status message style class
       * @override
       * @return {string} status message style class
       */
      getStatusMessageStyleClass: function () {
        return this._STATUS_MSG_STYLE_CLASS[this._getNavigationMode()];
      },

      /**
       * Returns Navlist specific status style class
       * @override
       * @return {string} status style class
       */
      getStatusStyleClass: function () {
        return this._STATUS_STYLE_CLASS[this._getNavigationMode()];
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
        // Arrow key's should work independent of Alt key
        return !event.altKey && this.m_listHandler.HandleArrowKeys(keyCode, isExtend, event);
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
        var $target = $(event.target);
        var parentNode = $target[0].parentNode;
        var item = this.FindItem($target);
        if (item == null || item.length === 0) {
          // can't find item or if item cannot be focus
          return;
        }
        if ($target.hasClass(this.getNavListRemoveIcon()) && this.isTabBar()) {
          this._handleRemove(event, item);
          return;
        }
        if (this.SkipFocus(item)) {
          event.preventDefault();
          return;
        }

        // For Mobile mode only: if the target is a div of animation check it's parent contains the expand/collapse icon and reset target
        if (parentNode.classList.contains('oj-animate-pointerUp')) {
          $target = $(parentNode);
        }

        // TODO , once it is fixd in listview probably don't need to override HandleMouseClick

        if (this.IsNodeEditableOrClickable($target)) {
          return;
        }

        var itemContent = this.getItemContentElement(item);
        var url = itemContent.attr('href');
        if (url && url !== '#') {
          if (event.button === 0 && (event.shiftKey || event.ctrlKey)) {
            return; // Do nothing, as Browser will launch  target it in new tab or browser
          }
        }

        var previousKey = this.GetOption('selection')[0];

        _ojNavigationListView.superclass.HandleMouseClick.apply(this, arguments);

        if (!this.isTabBar() && !this._skipSelectionAction) {
          this.FireSelectionAction(event, item, previousKey);
        }

        event.preventDefault();
      },

      /**
       * Override to support flip left/right arrows for expand and collapse actions.
       * @override
       * @protected
       */
      HandleKeyDown: function (event) {
        if (!this.m_active) {
          // If there is no active item, generally happes when user click on disabled item
          // and immediately press a key.
          return;
        }
        var keyCode = event.keyCode;
        var current = this.m_active.elem;
        var currentItemKey = this.m_active.key;

        if (keyCode === $.ui.keyCode.HOME || keyCode === $.ui.keyCode.END) {
          var item;
          if (keyCode === $.ui.keyCode.HOME) {
            item = this.element
              .find('.' + this.getItemContentStyleClass() + ':visible')
              .first()
              .closest('.' + this.getItemElementStyleClass());
          } else {
            item = this.element
              .find('.' + this.getItemContentStyleClass() + ':visible')
              .last()
              .closest('.' + this.getItemElementStyleClass());
          }
          this.SetCurrentItem(item, event);
          event.preventDefault();
        } else if (keyCode === $.ui.keyCode.DELETE && this.isTabBar()) {
          this._handleRemove(event, current);
        } else {
          var previousKey = this.GetOption('selection')[0];

          var processed = this.HandleSelectionOrActiveKeyDown(event);
          var processExpansion = this.m_listHandler.HandleExpandAndCollapseKeys(
            event,
            keyCode,
            current,
            currentItemKey
          );
          processed =
            processed ||
            processExpansion ||
            (this.m_dndContext != null && this.m_dndContext.HandleKeyDown(event));

          if (
            !this.isTabBar() &&
            (event.keyCode === $.ui.keyCode.ENTER || event.keyCode === $.ui.keyCode.SPACE)
          ) {
            this.FireSelectionAction(event, current, previousKey);
            this._skipSelectionAction = event.keyCode === $.ui.keyCode.ENTER;
            window.requestAnimationFrame(() => {
              this._skipSelectionAction = false;
            });
          }

          if (processed) {
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
          return !!self._avoidFocusHighLight;
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
      // eslint-disable-next-line no-unused-vars
      ToggleSelection: function (event, keepCurrentSelection, skipIfNotSelected) {
        var item = this.m_active.elem;

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
        var jqElem = $(elem);

        if (style === 'oj-selected') {
          this.m_listHandler.UpdateAriaPropertiesOnSelectedItem(this.getFocusItem(jqElem), highlight);
        }

        // if item is a group, the highlight should be apply to the group item element
        var group = jqElem.children('.' + this.getGroupItemStyleClass());
        if (group.length > 0) {
          jqElem = $(group[0]);
        }

        if (style === 'oj-focus') {
          if (highlight) {
            this._focusInHandler(jqElem);
          } else {
            this._focusOutHandler(jqElem);
          }
        } else if (highlight) {
          jqElem.addClass(style);
        } else {
          jqElem.removeClass(style);
        }

        if (
          jqElem.hasClass('oj-selected') ||
          jqElem.hasClass('oj-hover') ||
          jqElem.hasClass('oj-active') ||
          jqElem.hasClass(_OJ_DISABLED)
        ) {
          // show trailing icon on tabbar only when state is active, hover & selected
          if (jqElem.hasClass(this.getRemovableStyleClass()) && this.isTabBar()) {
            jqElem.find('.' + this.getNavListRemoveIcon()).css('visibility', 'visible');
          }
          jqElem.removeClass(_OJ_DEFAULT);
        } else {
          // remove trailing icon on tabbar  when state is not active, hover & selected
          if (this.isTabBar() && !DomUtils.isTouchSupported()) {
            jqElem.find('.' + this.getNavListRemoveIcon()).css('visibility', 'hidden');
          }
          jqElem.addClass(_OJ_DEFAULT);
        }
      },

      /**
       * In Navlist,it is not gaurenteed that item will have aria-selected. So overriding it to make all items selectable.
       * @override
       * @protected
       */
      IsSelectable: function (item) {
        return !$(item).hasClass(_OJ_DISABLED) && this.m_listHandler.IsSelectable($(item));
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
        if (this.m_listHandler.IsOptionUpdateAllowed(key, value, flags)) {
          var modifiedValue = null;
          if (key === 'selection') {
            // selection Data type is different for listview and navlist
            // change items to item as navlist does't allow multiple selection.
            var context = flags._context;
            var selectedItem = context && context.extraData && context.extraData.items;

            if (selectedItem) {
              // extraData['items'] is a jquery object(not an array) and in case of navlist it will always have single item.
              if (this.ojContext._IsCustomElement()) {
                if (selectedItem.length === 0) {
                  context.extraData.item = null;
                } else {
                  context.extraData.item = selectedItem[0];
                }
              } else {
                context.extraData.item = selectedItem;
              }
              context.extraData.items = undefined;
            }

            if (value && value.length > 0) {
              modifiedValue = value[0];
            }
            this._fireDeselectEvent(context.originalEvent, selectedItem, value);
          } else {
            modifiedValue = value;
          }

          // Common options
          this.ojContext.option(key, modifiedValue, flags);
          this.options[key] = value;
          this.m_listHandler.OptionUpdated(key, modifiedValue, flags);
        }
      },

      /**
       * Whether ListView should refresh if certain option is updated
       * @param {Object} options the options to check
       * @return {boolean} true if should refresh, false otherwise
       * @override
       * @protected
       */
      ShouldRefresh: function (options) {
        return (
          options.data != null ||
          options.drillMode != null ||
          options.item != null ||
          options.display != null ||
          options.layout != null ||
          options.edge != null
        );
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
        };
        var newSelectionValue;

        this.m_listHandler.SetOptions(options);

        if (options.navigationLevel !== undefined) {
          this._setNavigationLevel(options.navigationLevel);
        }
        if (options.selection !== undefined) {
          newSelectionValue = options.selection;
        }
        result.needRefresh = _ojNavigationListView.superclass.setOptions.call(this, options, flags);
        if (newSelectionValue !== undefined && options.selection === undefined) {
          result.skipOptions.push('selection');
        }
        // Restore original user provided selection value
        if (newSelectionValue !== undefined) {
          // eslint-disable-next-line no-param-reassign
          options.selection = newSelectionValue;
        }
        return result;
      },

      compareValues: function (value1, value2) {
        return value1 === value2 || oj.Object.compareValues(value1, value2);
      },

      /**
       * Set Selection option.
       * @param {Object} options the options object
       * @override
       */
      HandleSelectionOption: function (options) {
        if (options.selection !== undefined) {
          var newSelectionValue = options.selection;
          if (newSelectionValue !== null) {
            var selection = this.GetOption('selection');
            if (
              !selection ||
              selection.length === 0 ||
              !this.compareValues(selection[0], newSelectionValue)
            ) {
              var item = this.FindElementByKey(newSelectionValue);
              if (!item || this.IsSelectable(item)) {
                var shouldSelect = this._fireBeforeSelectEvent(null, $(item), newSelectionValue);
                if (shouldSelect) {
                  this._fireDeselectEvent(null, item, newSelectionValue);
                  // eslint-disable-next-line no-param-reassign
                  options.selection = [newSelectionValue];
                  this.m_listHandler.HandleSelectionChange(item);
                  if (item) {
                    this._initiateNavigation($(item));
                  }
                } else {
                  // eslint-disable-next-line no-param-reassign
                  delete options.selection;
                }
              } else {
                // eslint-disable-next-line no-param-reassign
                delete options.selection;
              }
            } else {
              // When new value is same as existing one, no need to update it on listview.
              // eslint-disable-next-line no-param-reassign
              delete options.selection;
            }
          } else {
            // eslint-disable-next-line no-param-reassign
            options.selection = [];
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
        if (key === 'selection') {
          // selection Data type is different for listview and navlist
          if (optionValue != null) {
            // in navlist & tabbar item with index 0 is not getting selected
            return [optionValue];
          }
          return [];
        }

        if (key === 'item' && !optionValue.focusable) {
          optionValue.focusable = this._focusable;
        }

        if (optionValue === null) {
          // if the option is only applicable to listview
          return this.options[key];
        }
        return optionValue;
      },

      /**
       * Override to return widget constructor
       * @override
       */
      getWidgetConstructor: function () {
        return Components.__GetWidgetConstructor(this.ojContext.element);
      },

      /**
       * Override to skip intermediate nodes(only in case of collapsible) and disabled items from selection.
       * @override
       * @protected
       */
      SelectAndFocus: function (item, event) {
        // Disabled items are not selectable and focuable.
        if (item.hasClass(_OJ_DISABLED)) {
          return;
        }

        if (!this.IsSelectable(item[0])) {
          return;
        }

        if (!this._isSelected(item) && this._fireBeforeSelectEvent(event, item)) {
          _ojNavigationListView.superclass.SelectAndFocus.apply(this, arguments);
          this._initiateNavigation(item);
        } else {
          // clicking on selected item/item whose selection is prevented should also get focus.
          this.HandleClickActive(item, event);
        }
      },

      isTabBar: function () {
        return this.ojContext.element[0].tagName.toLowerCase() === this.TAG_NAME_TAB_BAR;
      },

      _fireBeforeDeselectEvent: function (event, item, key) {
        if (!key) {
          // eslint-disable-next-line no-param-reassign
          key = this.GetKey(item[0]);
        }

        var fromKey = this.GetOption('selection');
        var fromItem = this.FindElementByKey(fromKey);
        return this.Trigger('beforeDeselect', event, {
          toItem: item,
          toKey: key,
          fromItem: fromItem,
          fromKey: fromKey
        });
      },

      _fireBeforeSelectEvent: function (event, item, key) {
        var beforeDeselect = true;

        if (!key) {
          // eslint-disable-next-line no-param-reassign
          key = this.GetKey(item[0]);
        }

        if (this.isTabBar()) {
          beforeDeselect = this._fireBeforeDeselectEvent(event, item, key);
        }
        return (
          beforeDeselect &&
          this.Trigger('beforeSelect', event, {
            item: item,
            key: key
          })
        );
      },

      _fireRemoveEvent: function (event, item) {
        var key = this.GetKey(item[0]);
        var beforeRemove = this.Trigger('beforeRemove', event, {
          item: item,
          key: key
        });
        return (
          beforeRemove &&
          this.Trigger('remove', event, {
            item: item,
            key: key
          })
        );
      },

      _fireDeselectEvent: function (event, item, key) {
        var fromKey = this.GetOption('selection');
        var fromItem = this.FindElementByKey(fromKey);
        this.Trigger('deselect', event, {
          toItem: item,
          toKey: key,
          fromItem: fromItem,
          fromKey: fromKey
        });
      },

      FireSelectionAction: function (event, item, previousKey) {
        var key = this.GetKey(item[0] || item);
        this.Trigger('selectionAction', event, {
          value: key,
          previousValue: previousKey
        });
      },

      _initiateNavigation: function (item) {
        if (this.ojContext.element.hasClass(this.getNoFollowLinkStyleClass())) {
          return false;
        }

        var itemContent = this.getItemContentElement(item);
        var url = itemContent.attr('href');
        var target = itemContent.attr('target');
        if (url && url !== '#') {
          // In case of javascript uri, javascript will get executed on assigning it to href.
          // Ideally user can use beforeSelect/optionChange events to do this,Will there be any issue in supporting this?
          if (!target || target === '_self') {
            window.location.href = url;
          } else {
            window.open(url, target);
          }

          return true;
        }
        return false;
      },

      _isSelected: function (item) {
        var selection = this.GetOption('selection');
        var key = this.GetKey(item[0]);
        if (selection && selection.length === 1 && this.compareValues(selection[0], key)) {
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
       * Retrieves the root element
       * @override
       * @return {jQuery} root element
       */
      GetRootElement: function () {
        return this.ojContext.element;
      },

      /**
       * Override to ignore remove icon link.
       * @param {jQuery} item  Item
       * @override
       * @private
       * @ignore
       */
      getSingleFocusableElement: function (item) {
        var self = this;
        var selector = 'a, input, select, textarea, button';
        var childElements = item.children(selector).filter(function () {
          return !(
            $(this).hasClass(self.getNavListRemoveIcon()) ||
            $(this).hasClass(self.getExpandIconStyleClass())
          );
        });

        if (
          childElements.length === 1 && // check for only one focusbale child
          childElements.first().find(selector).length === 0
        ) {
          // check to ensure no nested focusable elements.
          return childElements.first();
        }
        return item;
      },

      /**
       * Override to decorate remove menu item
       * @param {jQuery} item  Item
       * @override
       * @ignore
       */
      PrepareContextMenu: function (item) {
        var contextMenu = this.ojContext._GetContextMenu();

        if (this.m_dndContext != null && contextMenu) {
          this.m_dndContext.prepareContextMenu(contextMenu);
        }

        if (item.hasClass(this.getRemovableStyleClass()) && contextMenu) {
          if (this.m_contextMenu !== contextMenu) {
            this.m_contextMenu = contextMenu;
            contextMenu.addEventListener(
              'ojBeforeOpen',
              this._handleContextMenuBeforeOpen.bind(this)
            );
            contextMenu.addEventListener('ojAction', this._handleContextMenuSelect.bind(this));
          }
          var removeItem = $(contextMenu).find(
            '[data-oj-command=' + this.getNavListRemoveCommand() + ']'
          );
          var textNode = this.ojContext.getTranslatedString('labelRemove');
          if (!this.ojContext._IsCustomElement()) {
            removeItem.empty().append($('<a href="#"></a>').text(textNode)); // @HTMLUpdateOK
          } else {
            removeItem.empty().append(document.createTextNode(textNode)); // @HTMLUpdateOK
          }
          contextMenu.refresh();
        }
      },

      _handleContextMenuSelect: function (event) {
        var item = $(event.target);
        if (item.attr('data-oj-command') === this.getNavListRemoveCommand()) {
          this._handleRemove(event, this.m_contextMenuItem);
        }
      },

      _handleContextMenuBeforeOpen: function (event) {
        this.m_contextMenuItem = event.detail.openOptions.launcher;
      },

      _handleRemove: function (event, item) {
        if (item.hasClass(this.getRemovableStyleClass())) {
          this._fireRemoveEvent(event, item);
        }
      },

      _wrapInner: function (ele, wrapper) {
        var children = ele.childNodes;
        while (children.length > 0) {
          wrapper.appendChild(children[0]);
        }
        ele.appendChild(wrapper);
      },

      /**
       * Called by content handler once the content of an item is rendered
       * @param {Element} elem the item element
       * @param {Object} context the context object used for the item
       */
      // eslint-disable-next-line no-unused-vars
      itemRenderComplete: function (elem, context) {
        var $item = $(elem);
        var self = this;

        if ($item.hasClass(this.getCategoryDividerStyleClass())) {
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
        var itemIconClass = this.getItemIconStyleClass();
        var itemBadgeClass = this.getItemBadgeStyleClass();
        var groupItem = $item.children('.' + groupItemClass);
        var itemContent;

        if (groupItem.length > 0) {
          // Adding oj-navigationlist-item class on group node. Listview does't add this any more.
          groupItem.addClass(this.getItemStyleClass());
          itemContent = groupItem.children(
            ':not(.' + expandIconClass + '):not(.' + collapseIconClass + ')'
          );
          var groupIcon = groupItem.children('.' + expandIconClass);
          if (groupIcon.length === 0) {
            groupIcon = groupItem.children('.' + collapseIconClass);
          }
          groupIcon.attr('role', 'presentation');
          groupIcon.attr('tabindex', '-1'); // @HTMLUpdateOK
          groupIcon.removeAttr('aria-labelledby');
          if ($item.hasClass(_OJ_DISABLED)) {
            groupItem.addClass(_OJ_DISABLED);
          }
        } else {
          itemContent = $item.children().first();
        }

        if (itemContent.length > 0) {
          itemContent.addClass(this.getItemContentStyleClass());
          var itemLabelClass = this.getItemLabelStyleClass();
          var itemLabelElement = itemContent[0].querySelector('.' + itemLabelClass);
          var icon = itemContent.find('.' + itemIconClass);
          // if element with label style class already exists, no need to create wrapper
          // or rearrange the icon/badge
          if (itemLabelElement == null) {
            itemLabelElement = document.createElement('span');
            itemLabelElement.classList.add(itemLabelClass);
            this._wrapInner(itemContent[0], itemLabelElement);

            var badge = itemContent.find('.' + itemBadgeClass);
            if (badge.length > 0) {
              badge.insertAfter(itemLabelElement); // @HTMLUpdateOK
            }

            if (icon.length > 0) {
              icon.insertBefore(itemLabelElement); // @HTMLUpdateOK
            }
          }
          if (icon.length > 0) {
            if (icon.attr('title')) {
              // preserve the title to restore it after destroy.
              icon.data(this._NAVLIST_ITEM_ICON_HAS_TITLE, icon.attr('title'));
            }

            if (this.ojContext.options.display === 'icons') {
              this.ojContext.element.addClass(this.getIconOnlyStyleClass());
              var itemLabel = this.getItemLabel($item);
              icon.attr(_ARIA_LABEL, itemLabel); // @HTMLUpdateOK
              icon.attr('role', 'img');
              this._setToolTipOnIcon(icon, itemLabel);
            }

            if (this.ojContext.options.display === 'stacked') {
              if (!this.ojContext.element.hasClass(this.getStackedIconStyleClass())) {
                this.ojContext.element.addClass(this.getStackedIconStyleClass());
                this.isStackedIconClassAdded = true;
              }
              var iconLabel = this.getItemLabel($item);
              icon.attr(_ARIA_LABEL, iconLabel); // @HTMLUpdateOK
              icon.attr('role', 'img');
              this._setToolTipOnIcon(icon, iconLabel);
            }
            this.element.closest('ul').addClass(self.getHasIconsStyleClass());
          } else {
            itemContent.addClass(this.getHasNoIconStyleClass());
          }
        }

        if ($item.hasClass(_OJ_DISABLED)) {
          this.getFocusItem($item).attr('aria-disabled', 'true');
        } else if (groupItem.length > 0) {
          groupItem.addClass(_OJ_DEFAULT);
        } else {
          $item.addClass(_OJ_DEFAULT);
        }

        if ($item.hasClass(this.getRemovableStyleClass()) && this.isTabBar()) {
          var removableLink = $('<a>');
          removableLink
            .addClass(this.getNavListRemoveIcon())
            .addClass('oj-clickable-icon-nocontext oj-component-icon')
            .attr(_ARIA_LABEL, this.ojContext.getTranslatedString('removeCueText')) // @HTMLUpdateOK
            .attr('role', 'presentation')
            .attr(_ARIA_HIDDEN, 'true'); // @HTMLUpdateOK
          // Touch devices, the trailing icon will be always visible
          if (DomUtils.isTouchSupported() || $item.hasClass(_OJ_DISABLED)) {
            removableLink.css('visibility', 'visible');
          } else {
            removableLink.css('visibility', 'hidden');
          }
          $item.append(removableLink); // @HTMLUpdateOK
          itemContent.attr('aria-describedby', removableLink.uniqueId().attr('id'));
        }

        this.m_listHandler.ModifyListItem($item, itemContent);
        _ojNavigationListView.superclass.itemRenderComplete.apply(this, arguments);
      },

      /**
       * Destroy the content handler
       * @protected
       * @override
       */
      // eslint-disable-next-line no-unused-vars
      DestroyContentHandler: function (completelyDestroy) {
        var data = this.GetOption('data');
        if (data === null) {
          this._restoreContent(this.element);
        }
        _ojNavigationListView.superclass.DestroyContentHandler.apply(this, arguments);
      },

      /**
       * Return node for given locator
       *
       * @override
       */
      getNodeBySubId: function (locator) {
        if (locator == null) {
          return this.ojContext.element ? this.ojContext.element[0] : null;
        }

        var item = this.m_listHandler.GetNodeBySubId(locator);

        if (!item) {
          var subId = locator.subId;
          if (subId === this.getItemSubIdKey()) {
            var key = locator.key;
            item = this.FindElementByKey(key);
          }
        }

        return item;
      },

      /**
       * Returns the subId locator for the given child DOM node.
       * Invoked by widget
       * @param {!Element} node - child DOM node
       * @return {Object|null} The locator for the DOM node, or <code class="prettyprint">null</code> when none is found.
       */
      getSubIdByNode: function (node) {
        var subId = null;

        if (node != null) {
          subId = this.m_listHandler.GetSubIdByNode(node);

          if (!subId) {
            var item = this.FindItem(node);
            if (item != null && item.length > 0) {
              var key = this.GetKey(item[0]);
              if (key != null) {
                subId = {
                  subId: this.getItemSubIdKey(),
                  key: key
                };
              }
            }
          }
        }

        return subId;
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
        if (context && context.subId === 'oj-listview-item') {
          context.subId = this.getItemSubIdKey();
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
        this.ojContext.element.removeClass(this.getIconOnlyStyleClass());
        if (this.isStackedIconClassAdded) {
          this.ojContext.element.removeClass(this.getStackedIconStyleClass());
        }
        this.ojContext.element.removeClass(this.getCondenseStyleClass());
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
        // for data source, this will be empty.
        if (this._list.is(':empty')) {
          this._list.remove();
        }
        this.ojContext.element.removeClass(
          this.getNavListStyleClass() + ' ' + this.getNavListTouchStyleClass()
        );
        this.ojContext._off(this.element, 'click');
        this.ojContext._off(this.element, 'focus');
        this.ojContext._off(this.element, 'blur');
        this.ojContext._off(this.element, 'mouseover');
        this.ojContext._off(this.element, 'mousein');
        this.ojContext._off(this.element, 'mouseout');
        this.ojContext._off(this.element, 'keydown');
      }
    }
  );

  _ojNavigationListView._CSS_Vars = {
    navlist: {
      animation: {
        addHorizontalItem: '--oj-private-navigation-list-global-horizontal-add-animation-default',
        removeHorizontalItem:
          '--oj-private-navigation-list-global-horizontal-remove-animation-default',
        add: '--oj-private-navigation-list-global-add-animation-default',
        remove: '--oj-private-navigation-list-global-remove-animation-default',
        update: '--oj-private-navigation-list-global-update-animation-default',
        expand: '--oj-private-navigation-list-global-expand-animation-default',
        collapse: '--oj-private-navigation-list-global-collapse-animation-default',
        sliderExpand: '--oj-private-navigation-list-global-slider-expand-animation-default',
        sliderCollapse: '--oj-private-navigation-list-global-slider-collapse-animation-default',
        pointerUp: '--oj-private-navigation-list-global-pointer-up-animation-default'
      },
      hierarchyMenuDisplayThresholdLevel:
        '--oj-private-navigation-list-global-hierarchy-menu-threshold-default',
      showIndicatorDelay: '--oj-private-core-global-loading-indicator-delay-duration'
    },
    tabbar: {
      animation: {
        addHorizontalItem: '--oj-private-tab-bar-global-horizontal-add-animation-default',
        removeHorizontalItem: '--oj-private-tab-bar-global-horizontal-remove-animation-default',
        add: '--oj-private-tab-bar-global-add-animation-default',
        remove: '--oj-private-tab-bar-global-remove-animation-default',
        update: '--oj-private-tab-bar-global-update-animation-default',
        pointerUp: '--oj-private-tab-bar-global-pointerUp-animation-default'
      },
      showIndicatorDelay: '--oj-private-core-global-loading-indicator-delay-duration'
    }
  };

  (function () {
    /**
     * @ojcomponent oj.ojNavigationList
     * @augments oj.baseComponent
     * @since 1.1.0
     *
     * @ojrole menu
     * @ojrole tree
     * @ojrole listbox
     * @ojrole toolbar
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
     * @ojtsimport {module: "ojkeyset", type: "AMD", imported:["KeySet"]}
     * @ojsignature [{
     *                target: "Type",
     *                value: "class ojNavigationList<K, D> extends baseComponent<ojNavigationListSettableProperties<K,D>>",
     *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
     *               },
     *               {
     *                target: "Type",
     *                value: "ojNavigationListSettableProperties<K,D> extends baseComponentSettableProperties",
     *                for: "SettableProperties"
     *               }
     *              ]
     * @ojshortdesc A navigation list allows navigation between different content sections.
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["display", "edge", "drillMode", "overflow", "rootLabel"]}
     * @ojpropertylayout {propertyGroup: "data", items: ["data", "selection"]}
     * @ojvbdefaultcolumns 2
     * @ojvbmincolumns 1
     *
     * @ojoracleicon 'oj-ux-ico-navigation'
     * @ojuxspecs ['nav-list']
     *
     * @classdesc
     * <h3 id="navlistOverview-section">
     *   JET Navigation List
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#navlistOverview-section"></a>
     * </h3>
     *
     * <p>Description: JET Navigation List enhances a HTML list element into a themable, WAI-ARIA compliant, mobile friendly component with advance interactive features.
     * <h3 id="data-section">
     *   Data
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
     * </h3>
     * <p>The JET NavigationList gets its data in three different ways.  The first way is from a DataProvider/TableDataSource.  There are several types of DataProvider/TableDataSource
     * that are available out of the box:</p>
     * <ul>
     * <li>oj.ArrayDataProvider</li>
     * <li>oj.CollectionTableDataSource</li>
     * </ul>
     *
     * <p><b>oj.ArrayDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, Navigation List will automatically react
     * when items are added or removed from the array.  See the documentation for <a href="ArrayDataProvider.html">ArrayDataProvider</a> for more details on the available options.</p>
     *
     * <p><b>oj.CollectionTableDataSource</b> - Use this when oj.Collection is the model for the underlying data.  Note that the Navigation List will automatically react to model event from
     * the underlying oj.Collection.  See the documentation for <a href="CollectionTableDataSource.html">CollectionTableDataSource</a> for more details on the available options.</p>
     *
     * <p> NOTE: PagingTableDataSource is not supported by Navigation List.
     *
     * <p>The second way is from a TreeDataProvider/TreeDataSource.  This is typically used to display data that are logically categorized in groups.  There are several types
     * of TreeDataProvider/TreeDataSource that are available out of the box:</p>
     * <ul>
     * <li>oj.ArrayTreeDataProvider</li>
     * <li>oj.CollectionTreeDataSource</li>
     * </ul>
     *
     * <p><b>oj.ArrayTreeDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, NavigationList will
     * automatically  react when items are added or removed from the array.  See the documentation of <a href="ArrayTreeDataProvider.html">oj.ArrayTreeDataProvider</a> for more details on the available options.</p>
     *
     * <p><b>oj.CollectionTreeDataSource</b> - Use this when oj.Collection is the model for each group of data.  See the documentation for <a href="CollectionTreeDataSource.html">oj.CollectionTreeDataSource</a>
     * for more details on the available options.</p>
     *
     * <p>Finally, Navigation List also supports static HTML content as data.  The structure of the content can be either flat or hierarhical. Note: <code class="prettyprint">data</code> attribute should not be set when static HTML content is used.</p>
     * <p>Note that any manipulation of static HTML content, including manipulating content generated through Knockout (for example, updating observableArray in a foreach binding), is not supported.<p>
     *
     * <p>Example of flat static content</p>
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-navigation-list>
     *  &lt;ul>
     *   &lt;li>&lt;a href="#">Item 1&lt;/a>&lt;/li>
     *   &lt;li>&lt;a href="#">Item 2&lt;/a>&lt;/li>
     *   &lt;li>&lt;a href="#">Item 3&lt;/a>&lt;/li>
     *  &lt;/ul>
     * &lt;/oj-navigation-list>
     * </code></pre>
     *
     * <p>Example of hierarchical static content</p>
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-navigation-list>
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
     * &lt;/oj-navigation-list>
     * </code></pre>
     *
     * <p>Example of data provider content</p>
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-navigation-list data="[[dataProvider]]">&lt;/oj-navigation-list>
     * </code></pre>
     *
     * <p>The child content can be configured via inline HTML content or a DataProvider.
     * It is recommended that inline HTML content should only be used for static data and the DataProvider should always be used for mutable data.
     * </p>
     *
     * <h4 id="treeJSON-section"> JSON Tree Node Format</h4>
     * </br>
     * Each node object typically have an
     * <code class="prettyprint">attr</code> property. This attr value will be provided as <code class="prettyprint">itemContext.data</code> to renderer function. See <a href="#context-section">itemContext</a> section. Any node can be defined as a parent by supplying
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
     * requires a <code class="prettyprint">refresh()</code> of the element.
     *
     * <h3 id="key-section">
     *   Key
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#key-section"></a>
     * </h3>
     * <p>Key is an identifier which uniquely identifies an item in Navigation List.
     *  <ul>
     *  <li>When static html is used, it will be the <code class="prettyprint">id</code> attribute of <code class="prettyprint">&lt;li></code>. If no <code class="prettyprint">id</code> is specified then component will generate an id and will use it as key.</li>
     *  <li>When data source is used, it will be the <code class="prettyprint">id</code> attribute of item's data object.
     *  </ul>
     * <h3 id="icons-section">
     *   Icons
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#icons-section"></a>
     * </h3>
     *
     * <p>Sublist icons are inserted automatically.  To add other icons to list items, include them in the markup and include the <code class="prettyprint">oj-navigationlist-item-icon</code> class, as follows:
     *
     * <pre class="prettyprint">
     * <code>&lt;oj-navigation-list>
     *   &lt;ul>
     *     &lt;li id="foo">&lt;a href="#">&lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">&lt;/span>Foo&lt;/a>&lt;/li>
     *   &lt;/ul>
     *  &lt;/oj-navigation-list>
     * </code></pre>
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
     *       <td><kbd>componentElement</kbd></td>
     *       <td>oj-navigation-list element.</td>
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
     *       <td>The <a href="#key-section">Key</a> of the item.</td>
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
     *       <td>The <a href="#key-section">Key</a> of the parent item.  The parent key is null for root node.</td>
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
     * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET custom element, in the unusual case that the reading direction
     * is changed post-init, the navigation list must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
     *
     *
     * <h3 id="animation-section">
     *   Animation
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#animation-section"></a>
     * </h3>
     *
     * <p>Applications can customize animations triggered by actions in Navigation List by overriding action specific style classes on the animated item.  See the documentation of <a href="AnimationUtils.html">AnimationUtils</a>
     *    class for details.</p>
     *
     * <p>The following are actions in which applications can use to customize animation effects.
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Action</th>
     *       <th>Description</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>horizontal add</kbd></td>
     *       <td>When a new item is added to the TableDataSource associated with Horizontal Navigation List.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>add</kbd></td>
     *       <td>When a new item is added to the TableDataSource associated with Vertical Navigation List.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>horizontal remove</kbd></td>
     *       <td>When an existing item is removed from the TableDataSource associated with Horizontal Navigation List.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>remove</kbd></td>
     *       <td>When an existing item is removed from the TableDataSource associated with Vertical Navigation List.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>update</kbd></td>
     *       <td>When an existing item is updated in the TableDataSource associated with Navigation List.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>expand</kbd></td>
     *       <td>When user expands a group item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>slider expand</kbd></td>
     *       <td>When user expands a group item in sliding navigation list.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>collapse</kbd></td>
     *       <td>When user collapses a group item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>slider collapse</kbd></td>
     *       <td>When user collapses a group item in sliding navigation list.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>pointerUp</kbd></td>
     *       <td>When user finish pressing an item (on touch).</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     */

    //-----------------------------------------------------
    //                   Slots
    //-----------------------------------------------------

    /**
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the list. The slot content must be a &lt;template> element.
     * The content of the template could either include the &lt;li> element, in which case that will be used as
     * the root of the item.  Or it can be just the content which excludes the &lt;li> element.</p>
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See [oj.ojNavigationList.ItemTemplateContext]{@link oj.ojNavigationList.ItemTemplateContext} or the table below for a list of properties available on $current)</li>
     *  <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @ojslot itemTemplate
     * @ojmaxitems 1
     * @memberof oj.ojNavigationList
     * @ojshortdesc The itemTemplate slot is used to specify the template for rendering each item in the list. See the Help documentation for more information.
     * @ojtemplateslotprops oj.ojNavigationList.ItemTemplateContext
     *
     * @example <caption>Initialize the ListView with an inline item template specified:</caption>
     * &lt;oj-navigation-list>
     *   &lt;template slot='itemTemplate' data-oj-as='item'>
     *     &lt;li>&lt;a href="#">&lt;oj-bind-text value='[[item.data.name]]'>&lt;/oj-bind-text>&lt;/a>&lt;/li>
     *   &lt;/template>
     * &lt;/oj-navigation-list>
     */
    /**
     * @typedef {Object} oj.ojNavigationList.ItemTemplateContext
     * @property {Element} componentElement The &lt;oj-navigation-list> custom element
     * @property {Object} data The data for the current item being rendered
     * @property {number} index The zero-based index of the current item
     * @property {any} key The key of the current item being rendered
     * @property {number} depth The depth of the current item (available when hierarchical data is provided) being rendered. The depth of the first level children under the invisible root is 1.
     * @property {boolean} leaf True if the current item is a leaf node (available when hierarchical data is provided).
     * @property {any} parentkey The key of the parent item (available when hierarchical data is provided). The parent key is null for root nodes.
     */

    //-----------------------------------------------------
    //                   Fragments
    //-----------------------------------------------------

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
     *       <td>Overflow Menu button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Open menu. Refer <a href="oj.ojButton.html#touch-section">menu button</a> touch documentation. Note: This is applicable only for Horizontal Navigation List when <code class="prettyprint">overflow</code> is set to <code class="prettyprint">popup</code>. </td>
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
     *       <td>If focus is on a list item, pressing F2 will make its contents accessible using TAB. It can also be used to exit actionable mode if already in actionable mode.</td>
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
     *       <td>Overflow Menu button</td>
     *       <td><kbd>Enter or Space</kbd></td>
     *       <td>Open menu. Refer <a href="oj.ojButton.html#touch-section">menu button</a> touch documentation. Note: This is applicable only for Horizontal Navigation List when <code class="prettyprint">overflow</code> is set to <code class="prettyprint">popup</code>. </td>
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

    //-----------------------------------------------------
    //                   Sub-ids
    //-----------------------------------------------------

    /**
     * <p>Sub-ID for the oj-navigtion-list component's list item element.</p>
     *
     * <p>
     * To lookup the list items the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-navigationlist-item'</li>
     * <li><b>key</b>: the <a href="#key-section">Key</a> of the item</li>
     * </ul>
     *
     * @ojsubid oj-navigationlist-item
     * @memberof oj.ojNavigationList
     *
     * @example <caption>Get the list item element with key 'foo':</caption>
     * var node = myNavList.getNodeBySubId({'subId': 'oj-navigationlist-item', 'key': 'foo'} );
     */
    /**
     * <p>Sub-ID for the oj-navigtion-list component's previous link element.</p>
     *
     * To lookup the previous link the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-navigationlist-previous-link'</li>
     * </ul>
     * @ojsubid oj-navigationlist-previous-link
     * @memberof oj.ojNavigationList
     *
     * @example <caption>Get the previous link element:</caption>
     * var node = myNavList.getNodeBySubId({'subId': 'oj-navigationlist-previous-link'} );
     */
    /**
     * <p>Sub-ID for the oj-navigtion-list component's hierarchical menu button element.
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
     * var node = myNavList.getNodeBySubId({'subId': 'oj-navigationlist-hierarchical-button'} );
     */
    /**
     * <p>Sub-ID for the oj-navigation-list component's hierarchical menu element.</p>
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
     * var node = myNavList.getNodeBySubId({'subId': 'oj-navigationlist-hierarchical-menu'} );
     */

    // Node Context Objects *********************************************
    /**
     * <p>Context for the oj-navigation-list component's items.</p>
     *
     * @property {number} index the zero based item index relative to its parent
     * @property {Object|string} key the <a href="#key-section">Key</a> of the item
     * @property {Element} parent the parent group item.  Only available if item has a parent.
     * @property {boolean} group whether the item is a group.
     *
     * @ojnodecontext oj-navigationlist-item
     * @memberof oj.ojNavigationList
     */

    //-----------------------------------------------------
    //                   Styling
    //-----------------------------------------------------

    // ---------------- oj-navigationlist-stack-icon-label --------------
    /**
     * Use this class to display a horizontal Navigation List with icons and labels stacked. Applicable only when edge is top.
     * @ojstyleclass oj-navigationlist-stack-icon-label
     * @ojdisplayname Stack Icon
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list class="oj-navigationlist-stack-icon-label" >
     *   &lt;ul>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-navigationlist-category-divider --------------
    /**
     * Use this class to add a horizontal divider line between two categories of items.
     * @ojstyleclass oj-navigationlist-category-divider
     * @ojdisplayname Category Divider
     * @ojstyleselector "oj-navigation-list li"
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list>
     *   &lt;ul>
     *     &lt;li ...>&lt;/li>
     *     &lt;li class="oj-navigationlist-category-divider">&lt;/li>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-navigationlist-item-icon --------------
    /**
     * Use this class to add an icon to a list item.
     * @ojstyleclass oj-navigationlist-item-icon
     * @ojdisplayname Icon
     * @ojstyleselector "oj-navigation-list span"
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list class="oj-navigationlist-stack-icon-label" >
     *   &lt;ul>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-navigationlist-item-end --------------
    /**
     * Use this class to add an badge/metadata/icon to a list item.
     * @ojstyleclass oj-navigationlist-item-end
     * @ojdisplayname Icon
     * @ojstyleselector "oj-navigation-list span"
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list>
     *   &lt;ul>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-end">
     *            &lt;span class="oj-badge oj-badge-subtle">3
     *            &lt;/span>
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-navigationlist-item-title --------------
    /**
     * When arbitrary content is placed inside an item's content area, its title text can be marked using this style class. This helps the component in identifying the Item's label.
     * @ojstyleclass oj-navigationlist-item-title
     * @ojdisplayname Title
     * @ojstyleselector "oj-navigation-list span"
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;li id="foo">
     *   &lt;div>
     *     &lt;span class="oj-navigationlist-item-title">Play&lt;/span>
     *       &lt;button>Button&lt;/button>
     *   &lt;/div>
     * &lt;/li>
     */
    // ---------------- oj-navigationlist-item-text-wrap --------------
    /**
     * Use this class to wrap item label text. Note: On IE11, this is not supported when overflow attribute is set to 'popup'. This style class is not supported when edge is 'top' or 'bottom'.
     * @ojstyleclass oj-navigationlist-item-text-wrap
     * @ojdisplayname Text Wrap
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list class="oj-navigationlist-item-text-wrap" >
     *   &lt;ul>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-navigationlist-item-dividers --------------
    /**
     * Use this class to render a divider between list items. Note: On IE11, this is not supported when overflow attribute is set to 'popup'.
     * @ojstyleclass oj-navigationlist-item-dividers
     * @ojdisplayname Item Dividers
     * @memberof oj.ojNavigationList
     * @ojunsupportedthemes ["Redwood"]
     * @ojtsexample
     * &lt;oj-navigation-list class="oj-navigationlist-item-dividers" >
     *   &lt;ul>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-[size]-condense --------------
    /**
     * Use this class to condense horizontal navigation list items depending on screen size.
     * @ojstyletemplate oj-[size]-condense
     * @ojstyletemplatetokens ["StylingTemplateTokens.[size]"]
     * @ojdisplayname Condense
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list class="oj-sm-condense" >
     *   &lt;ul>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-navigationlist-nofollow-link --------------
    /**
     * Use this class to prevent automatic navigation to the url specified on an &lt;a> tag's href attribute. <br/>
     * In this case, navigation can be handled programmatically by using selectionChanged event. <br/>
     * This is useful to execute some custom logic before browser triggers navigation.
     * @ojstyleclass oj-navigationlist-nofollow-link
     * @ojdisplayname No Follow Link
     * @ojshortdesc Use this class to prevent automatic navigation to a URL within a list item. See the Help documentation for more information.
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list class="oj-navigationlist-nofollow-link" >
     *   &lt;ul>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-navigationlist-item-label --------------
    /**
     * Use this class to specify the element with the label.  This will eliminate the need for NavigationList to automatically
     * wrap any child element that is not an icon or a badge with this class.  Note the content must have the correct
     * order (icon element first, then the label element, then the badge element) as NavigationList in this case will not attempt
     * to reorder the content.
     * @ojstyleclass oj-navigationlist-item-label
     * @ojdisplayname Label
     * @ojstyleselector "oj-navigation-list span"
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list class="oj-navigationlist-stack-icon-label" >
     *   &lt;ul>
     *     &lt;li id="foo">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         &lt;span class="oj-navigationlist-item-label">
     *         Foo
     *         &lt;/span>
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-focus-highlight --------------
    /**
     * Under normal circumstances this class is applied automatically.
     * It is documented here for the rare cases that an app developer needs per-instance control.<br/><br/>
     * The oj-focus-highlight class applies focus styling that may not be desirable when the focus results from pointer interaction (touch or mouse), but which is needed for accessibility when the focus occurs by a non-pointer mechanism, for example keyboard or initial page load.<br/><br/>
     * The application-level behavior for this component is controlled in the theme by the <code class="prettyprint"><span class="pln">$focusHighlightPolicy </span></code>SASS variable; however, note that this same variable controls the focus highlight policy of many components and patterns. The values for the variable are:<br/><br/>
     * <code class="prettyprint"><span class="pln">nonPointer: </span></code>oj-focus-highlight is applied only when focus is not the result of pointer interaction. Most themes default to this value.<br/>
     * <code class="prettyprint"><span class="pln">all: </span></code> oj-focus-highlight is applied regardless of the focus mechanism.<br/>
     * <code class="prettyprint"><span class="pln">none: </span></code> oj-focus-highlight is never applied. This behavior is not accessible, and is intended for use when the application wishes to use its own event listener to precisely control when the class is applied (see below). The application must ensure the accessibility of the result.<br/><br/>
     * To change the behavior on a per-instance basis, the application can set the SASS variable as desired and then use event listeners to toggle this class as needed.<br/>
     * @ojstyleclass oj-focus-highlight
     * @ojdisplayname Focus Styling
     * @ojshortdesc Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information.
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list class="oj-focus-highlight">
     *   &lt;!-- Content -->
     * &lt;/oj-navigation-list>
     */
    // ---------------- oj-disabled --------------
    /**
     * Any list item can be disabled by adding the oj-disabled class to that element
     * @ojstyleclass oj-disabled
     * @ojdisplayname Disabled Item
     * @ojstyleselector "oj-navigation-list li"
     * @memberof oj.ojNavigationList
     * @ojtsexample
     * &lt;oj-navigation-list>
     *   &lt;ul>
     *     &lt;li id="foo" class="oj-disabled">
     *       &lt;a href="#">
     *         &lt;span class="oj-navigationlist-item-icon demo-icon-font-24 demo-palette-icon-24">
     *         &lt;/span>
     *         Foo
     *       &lt;/a>
     *     &lt;/li>
     *   &lt;/ul>
     * &lt;/oj-navigation-list>
     */
    /**
     * @ojstylevariableset oj-navigation-list-css-set1
     * @ojstylevariable oj-navigation-list-font-size {description: "Navigation list font size", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-navigation-list-font-weight {description: "Navigation list font weight", formats: ["font_weight"], help: "#css-variables"}
     * @ojstylevariable oj-navigation-list-icon-margin {description: "Navigation list icon margin", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-navigation-list-icon-to-text-padding {description: "Padding between icon and text", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-navigation-list-icon-size {description: "Navigation list icon size", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-navigation-list-item-min-height {description: "Navigation list item minimum height", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-navigation-list-item-margin {description: "Navigation list item margin", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-navigation-list-item-padding {description: "Navigation list item padding", formats: ["length"], help: "#css-variables"}
     * @memberof oj.ojNavigationList
     */
    /**
     * @ojstylevariableset oj-navigation-list-css-set2
     * @ojdisplayname Default
     * @ojstylevariable oj-navigation-list-item-label-color {description: "Default navigation list item label color", formats: ["color"], help: "#oj-navigation-list-css-set2"}
     * @memberof oj.ojNavigationList
     */
    /**
     * @ojstylevariableset oj-navigation-list-css-set3
     * @ojdisplayname Hovered
     * @ojstylevariable oj-navigation-list-item-label-color-hover {description: "Navigation list item label color when hovered", formats: ["color"], help: "#oj-navigation-list-css-set3"}
     * @ojstylevariable oj-navigation-list-item-bg-color-hover {description: "Navigation list item background color when hovered",formats: ["color"], help: "#oj-navigation-list-css-set3"}
     * @memberof oj.ojNavigationList
     */
    /**
     * @ojstylevariableset oj-navigation-list-css-set4
     * @ojdisplayname Selected
     * @ojstylevariable oj-navigation-list-item-label-color-selected {description: "Navigation list item label color when selected", formats: ["color"], help: "#oj-navigation-list-css-set4"}
     * @ojstylevariable oj-navigation-list-item-bg-color-selected {description: "Navigation list item background color when selected", formats: ["color"], help: "#oj-navigation-list-css-set4"}
     * @ojstylevariable oj-navigation-list-item-border-color-selected {description: "Navigation list item border color when selected", formats: ["color"], help: "#oj-navigation-list-css-set4"}
     * @memberof oj.ojNavigationList
     */
    /**
     * @ojstylevariableset oj-navigation-list-css-set5
     * @ojdisplayname Sliding navigation list
     * @ojstylevariable oj-navigation-list-sliding-heading-font-size {description: "Sliding navigation list heading font size", formats: ["length"], help: "#oj-navigation-list-css-set5"}
     * @ojstylevariable oj-navigation-list-sliding-heading-font-weight {description: "Sliding navigation list heading font weight", formats: ["font_weight"], help: "#oj-navigation-list-css-set5"}
     * @ojstylevariable oj-navigation-list-sliding-heading-line-height {description: "Sliding navigation list heading line height", formats: ["number"], help: "#oj-navigation-list-css-set5"}
     * @memberof oj.ojNavigationList
     */
    // --------------------------------------------------- oj.ojNavigationList Styling End -----------------------------------------------------------

    oj.__registerWidget('oj.ojNavigationList', $.oj.baseComponent, {
      widgetEventPrefix: 'oj',
      options: {
        /**
         * An alias for the current item when referenced inside the item template. This can be especially useful
         * if oj-bind-for-each element is used inside the item template since it has its own scope of data access.
         *
         * @ojshortdesc Specifies the alias for the current item when referenced inside the item template.
         *
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojNavigationList
         * @type {string}
         * @default ''
         * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
         *
         * @example <caption>Initialize the NavigationList with the <code class="prettyprint">as</code> attribute specified:</caption>
         * &lt;oj-navigation-list as='item'>
         *   &lt;template slot='itemTemplate'>
         *     &lt;li>
         *     &lt;a href='#'>&lt;oj-bind-text value='[[item.data.name]]'>&lt;/oj-bind-text>&lt;/a>
         *     &lt;/li>
         *   &lt;/template>
         * &lt;/oj-navigation-list>
         */
        as: '',
        /**
         * <a href="#key-section">Key</a> of the current item.  Current item is the list item which is having active focus.  Note that if currentItem
         * is set to an item that is currently not available (not fetched or
         * inside a collapsed parent node), then the value is ignored.
         * <p>
         * When the current item is changed, the <code class="prettyprint">event.detail</code> of the <code class="prettyprint">currentItemChanged</code> event will contain the following additional properties:<br><br>
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
         *       <td class="name"><code>item</code></td>
         *       <td class="type">Element</td>
         *       <td class="description">Current Item element</td>
         *     </tr>
         *   </tbody>
         * </table>
         *
         * @expose
         * @ojshortdesc Specifies the key of the item that should have keyboard focus. See the Help documentation for more information.
         * @public
         * @instance
         * @memberof! oj.ojNavigationList
         * @type {any}
         * @ojsignature {target:"Type", value:"K"}
         * @default null
         * @ojwriteback
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">current-item</code> attribute specified:</caption>
         *  &lt;oj-navigation-list current-item='settings'> ... &lt;/oj-navigation-list>
         * @example <caption>Get the current item:</caption>
         * var currentItem = myNavList.currentItem;
         *
         * @example <caption>Set the current item on the NavigationList during initialization:</caption>
         * myNavList.currentItem = "newItem";
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
         * @ojshortdesc Specifies whether expand/collapse or sliding operations are allowed.
         * @expose
         * @memberof oj.ojNavigationList
         * @instance
         * @type {string}
         * @default none
         * @ojvalue {string} "none" All group items are expanded by default and user not allowed to collapse them.
         * @ojvalue {string} "collapsible" Allows user to expand and collapse group items. If there are more than two levels in hierarchy, <code class="prettyprint">sliding</code> is preferred drill mode.
         * @ojvalue {string} "sliding" This is typically used for hierarchical lists. This allows user to view one level at a time.
         *
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">drill-mode</code> attribute specified:</caption>
         *  &lt;oj-navigation-list drill-mode='collapsible'> ... &lt;/oj-navigation-list>
         *
         * @example <caption>Set <code class="prettyprint">drillMode</code> property:</caption>
         * myNavList.drillMode = "collapsible";
         *
         * @example <caption>Get the <code class="prettyprint">drillMode</code> property:</caption>
         * // getter
         * var drillMode = myNavList.drillMode;
         */
        drillMode: 'none',
        reorderable: 'disabled',
        truncation: 'none',
        /**
         * The position of the Navigation List. Valid Values: top, bottom and start.
         * <p> NOTE: when value is <code class="prettyprint">top</code>,<code class="prettyprint">"none"</code> is the only supported drillMode and it also does't support hierarchical items. That means TreeDataProvider/TreeDataSource are not supported as data source.
         * @ojshortdesc Specifies the edge position of the Navigation List.
         * @expose
         * @name edge
         * @memberof oj.ojNavigationList
         * @instance
         * @type {string}
         * @ojvalue {string} "top" This renders list items horizontally. Generally used when navlist placed on top of content section.
         * @ojvalue {string} "bottom" This renders list items horizontally. Generally used when navlist placed on bottom of content section.
         * @ojvalue {string} "start" This renders list items vertically. Generally used when navlist placed on left/start of content section.
         * @default start
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">edge</code> attribute specified:</caption>
         *  &lt;oj-navigation-list edge='top'> ... &lt;/oj-navigation-list>
         *
         * @example <caption>Get the edge:</caption>
         * var edge = myNavList.edge;
         *
         * @example <caption>Set the edge on the Navigation List:</caption>
         * myNavList.edge = "top";
         */
        edge: 'start',
        /**
         * Specifies the level at which user can see hiearchical menu button. This is only valid when <code class="prettyprint">drillMode</code> set to <code class="prettyprint">sliding</code>.
         * Default value is 0, shows hiearchical menu always. If value is -1, then it will never be shown.
         *
         * <p>The default value for hierarchyMenuThreshold varies by theme.
         *
         * @ojshortdesc Specifies the level at which the user can see hierarchical menu button. See the Help documentation for more information.
         * @expose
         * @name hierarchyMenuThreshold
         * @memberof oj.ojNavigationList
         * @instance
         * @type {number}
         * @default 0
         * @ojdeprecated {since: "13.0.0", description: "The hierarchyMenuThreshold property is deprecated as it is not supported in the Redwood theme."}
         *
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">hierarchy-menu-threshold</code> attribute specified:</caption>
         *  &lt;oj-navigation-list hierarchy-menu-threshold='4'> ... &lt;/oj-navigation-list>
         *
         * @example <caption>Get or set the <code class="prettyprint">hierarchyMenuThreshold</code> property:</caption>
         * // getter
         * var hierarchyMenuThreshold = myNavList.hierarchyMenuThreshold;
         *
         * // setter
         * myNavList.hierarchyMenuThreshold = "4";
         *
         */
        hierarchyMenuDisplayThresholdLevel: 0,
        /**
         * Label for top level list items.
         * <p>NOTE: This is needed only for sliding navigation list where
         * this will be used as title for the top level list elements.
         *
         * @ojshortdesc Specifies the label for top level list items.
         * @type {?string}
         * @default Navigation List
         * @expose
         * @instance
         * @memberof oj.ojNavigationList
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">root-label</code> attribute specified:</caption>
         *  &lt;oj-navigation-list root-label='Global Navigation'> ... &lt;/oj-navigation-list>
         *
         * @example <caption>Get or set the <code class="prettyprint">rootLabel</code> property:</caption>
         * // getter
         * var rootLabel = myNavList.rootLabel;
         *
         * // setter
         * myNavList.rootLabel = "4";
         */
        rootLabel: null,
        /**
         * Item <a href="#key-section">Key</a> of currently selected list item. If the value is modified
         * by an application, navigation list UI is modified to match the new value and the <code class="prettyprint">event.detail</code> of the <code class="prettyprint">selectionChanged</code> event will contain the following additional properties:<br><br>
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
         *       <td class="name"><code>item</code></td>
         *       <td class="type">Element</td>
         *       <td class="description">Selected Item element</td>
         *     </tr>
         *   </tbody>
         * </table>
         * @ojshortdesc Specifies the key of the selected item. See the Help documentation for more information.
         * @type {any}
         * @ojsignature {target:"Type", value:"K"}
         * @default null
         * @expose
         * @instance
         * @ojeventgroup common
         * @memberof oj.ojNavigationList
         * @ojwriteback
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">selection</code> attribute specified:</caption>
         *  &lt;oj-navigation-list selection='settings'> ... &lt;/oj-navigation-list>
         *
         * @example <caption>Get the selection:</caption>
         * var selection = myNavList.selection;
         *
         * @example <caption>Set the selection on the Navigation List:</caption>
         * myNavList.selection = "settings";
         */
        selection: null,

        /**
         * Specifies the key set containing the keys of the items that should be expanded.
         *
         * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify items to expand.
         * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all items.
         *
         * @expose
         * @ojshortdesc Specifies the key set containing the keys of the items that should be expanded. See the Help documentation for more information.
         * @memberof! oj.ojNavigationList
         * @instance
         * @default new AllKeySetImpl();
         * @type {KeySet}
         * @ojsignature {target:"Type", value:"oj.KeySet<K>"}
         * @ojwriteback
         *
         * @example <caption>Initialize the NavigationList with specific items expanded:</caption>
         * myNavList.expanded = new KeySetImpl(['item1', 'item2']);
         *
         * @example <caption>Initialize the NavigationList with all items expanded:</caption>
         * myNavList.expanded = new AllKeySetImpl();
         */
        expanded: new oj._ojListViewExpandedKeySet(),
        /**
         * The data source for the NavigationList accepts either a TableDataSource or oj.TreeDataSource.
         * See the data source section in the introduction for out of the box data source types.
         * If the data attribute is not specified, the child elements are used as content.  If there's no
         * content specified, then an empty list is rendered.
         *
         * @ojshortdesc Specifies the data provider for the Navigation List. See the Help documentation for more information.
         * @expose
         * @memberof! oj.ojNavigationList
         * @instance
         * @type {Object|null}
         * @default null
         * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
         *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
         *
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">data</code> attribute specified:</caption>
         *  &lt;oj-navigation-list data='[[tableDataSource]]'> ... &lt;/oj-navigation-list>
         * @example <caption>Get the data:</caption>
         * var dataSource = myNavList.data;
         *
         * @example <caption>Set the data attribute using one-dimensional array:</caption>
         * myNavList.data = new oj.ArrayTableDataSource([1,2,3]);
         *
         * @example <caption>Set the data attribute using oj.Collection:</caption>
         * myNavList.data = new oj.CollectionTableDataSource(collection);
         * @ojsignature [{target: "Type", value: "DataProvider<K, D>|null"},
         *               {target: "Type", value: "TableDataSource|oj.TreeDataSource|DataProvider|null", consumedBy:"js"}]
         */
        data: null,
        /**
         * Whether to display both the label and icons (<code class="prettyprint">"all"</code>) or just the icons (<code class="prettyprint">"icons"</code>).
         * In the latter case, the label is displayed in a tooltip instead, unless a tooltip was already supplied at create time.
         * Note: <code class="prettyprint">display="icons"</code> is valid only when <code class="prettyprint">drillMode=none</code> and navigation list is a flat list.
         * It is also mandatory to provide icons for each item as stated in <a href="#icons-section">icons section</a>.
         *
         * @ojshortdesc Specifies what needs to be displayed. See the Help documentation for more information.
         * @expose
         * @memberof oj.ojNavigationList
         * @instance
         * @type {string}
         * @ojvalue {string} "all" Display both the label and icons.
         * @ojvalue {string} "icons" Display only the icons.
         * @default all
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">display</code> attribute specified:</caption>
         *  &lt;oj-navigation-list display='icons'> ... &lt;/oj-navigation-list>
         *
         * @example <caption>Get or set the <code class="prettyprint">display</code> property:</caption>
         * // getter
         * var display = myNavList.display;
         *
         * // setter
         * myNavList.display = "icons";
         */
        display: 'all',
        /**
         * Navigation List supports two different look-and-feel depends on its usage level, one is <code class="prettyprint">application</code> level and other is <code class="prettyprint">page</code> level.
         *
         * @expose
         * @ignore
         * @deprecated 4.0.0 Use oj-tab-bar custom element for page level navigation list. In future ojNavigationList will only support application level by default.
         * @memberof oj.ojNavigationList
         * @instance
         * @type {string}
         * @ojvalue {string} "application" Render Navigation List for application level navigation.
         * @ojvalue {string} "page" Render Navigation List for page level navigation.
         * @default page
         *
         * @example <caption>Initialize the NavigationList with the <code class="prettyprint">navigationLevel</code> option specified:</caption>
         *  &lt;oj-navigation-list navigation-level='application'> ... &lt;/oj-navigation-list>
         *
         * @example <caption>Get or set the <code class="prettyprint">navigationLevel</code> option, after initialization:</caption>
         * // getter
         * var display = navList.navigationLevel;
         *
         * // setter
         * navList.navigationLevel = "application";
         */
        navigationLevel: 'page',
        /**
         * Specifies the overflow behaviour.
         * NOTE: This is only applicable when <code class="prettyprint">edge</code> attribute set to <code class="prettyprint">top</code>
         *
         * @ojshortdesc Specifies overflow behaviour for the Navigation List.
         * @expose
         * @memberof oj.ojNavigationList
         * @instance
         * @type {string}
         * @ojvalue {string} "popup" Popup menu will be shown with overflowed items.<p> Note that setting <code class="prettyprint">overflow</code> to <code class="prettyprint">popup</code> can trigger browser reflow, so only set it when it is actually required.
         * @ojvalue {string} "hidden" Overflow is clipped, and the rest of the content will be invisible.
         * @default hidden
         * @since 3.0.0
         * @example <caption>Initialize the Navigation List with the <code class="prettyprint">overflow</code> attribute specified:</caption>
         *  &lt;oj-navigation-list overflow='popup'> ... &lt;/oj-navigation-list>
         * @example <caption>Get or set the <code class="prettyprint">overflow</code> property:</caption>
         * // getter
         * var overflow = myNavList.overflow;
         *
         * // setter
         * myNavList.overflow = "hidden";
         */
        overflow: 'hidden',

        /**
         * @typedef {Object} oj.ojNavigationList.ItemContext
         * @property {Element} componentElement oj-navigation-list element
         * @property {DataProvider<K, D>} [datasource] A reference to the data source object. (Not available for static content)
         * @property {number} index The index of the item, where 0 is the index of the first item.
         * @property {any} key The Key of the item.
         * @property {any} data The data object for the item.
         * @property {Element} parentElement The list item element. The renderer can use this to directly append content.
         * @property {number=} depth the depth of the item
         * @property {K=} parentKey the key of the parent item
         * @property {boolean=} leaf whether the item is a leaf
         * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
         */

        /**
         * The item property contains a subset of properties for items.
         *
         * @ojshortdesc Customize the functionality of each item in Navigation List.
         * @expose
         * @memberof oj.ojNavigationList
         * @instance
         * @name item
         * @type {Object}
         */
        item: {
          /**
           * The renderer function that renders the content of the item. See <a href="#context-section">itemContext</a>
           * in the introduction to see the object passed into the renderer function.
           * The function should return one of the following:
           * <ul>
           *   <li>An Object with the following property:
           *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the item.</li></ul>
           *   </li>
           *   <li>undefined: If the developer chooses to manipulate the item element directly, the function should return undefined.</li>
           * </ul>
           * If no renderer is specified, Navigation List will treat the data as a String.
           *
           * @ojshortdesc Specifies the renderer for the item. See the Help documentation for more information.
           * @expose
           * @name item.renderer
           * @memberof! oj.ojNavigationList
           * @instance
           * @type {function(Object)|null}
           * @ojsignature { target: "Type",
           *                value: "?(((context: oj.ojNavigationList.ItemContext<K,D>) => void)|null)",
           *                jsdocOverride: true}
           * @default null
           * @example <caption>Initialize the Navigation List with the <code class="prettyprint">item.renderer</code> attribute specified:</caption>
           *  &lt;oj-navigation-list item.renderer="{{oj.KnockoutTemplateUtils.getRenderer('template', true)}}"> ... &lt;/oj-navigation-list>
           *
           * @example <caption>Get or set the <code class="prettyprint">renderer</code> property:</caption>
           * // set the renderer function
           * myNavList.item.renderer = rendererFn;
           *
           * // get the renderer function
           * var rendererFn = myNavList.item.renderer;
           */
          renderer: null,
          /**
           * Whether the item is selectable.
           * See <a href="#context-section">itemContext</a> in the introduction to see the object passed into the selectable function.
           *
           * @ojshortdesc Specifies whether the item can be selected. See the Help documentation for more information.
           * @expose
           * @name item.selectable
           * @memberof! oj.ojNavigationList
           * @instance
           * @ojsignature { target: "Type",
           *                value: "?(((context: oj.ojNavigationList.ItemContext<K,D>) => boolean)|boolean)",
           *                jsdocOverride: true}
           * @type {function(Object)|boolean}
           * @default true
           *
           * @example <caption>Initialize the NavigationList such that the first 3 items are not selectable:</caption>
           *  <oj-navigation-list item.selectable="[[skipFirstThreeElementsFn]]"></oj-navigation-list>
           *
           *  var skipFirstThreeElementsFn = function(itemContext) {
           *                                      return itemContext['index'] > 3;
           *                                 }
           */
          selectable: true
        },
        // Events
        /**
         * Triggered when the default animation of a particular action is about to start.  The default animation can be cancelled by calling event.preventDefault.
         * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
         *
         * @ojshortdesc Event handler for when the default animation of a particular action is about to start.
         * @expose
         * @event
         * @memberof oj.ojNavigationList
         * @instance
         * @property {string} action the action that triggers the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
         * @property {Element} element the target of animation.
         * @property {function():void} endCallback if the event listener calls event.preventDefault to cancel the default animation, it must call the endCallback function when it finishes its own animation handling and when any custom animation ends.
         */
        animateStart: null,
        /**
         * Triggered when the default animation of a particular action has ended.  Note this event will not be triggered if application cancelled the default animation on animateStart.
         * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
         *
         * @ojshortdesc Event handler for when the default animation of a particular action has ended.
         * @expose
         * @event
         * @memberof oj.ojNavigationList
         * @instance
         * @property {string} action the action that triggered the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
         * @property {Element} element the target of animation.
         */
        animateEnd: null,
        /**
         * <p>Triggered before this list item is selected.
         * To prevent the item selection, invoke <code class="prettyprint">event.preventDefault()</code>.
         *
         * @ojshortdesc Event handler for when before the selection is changed.
         * @expose
         * @event
         * @ojcancelable
         * @memberof oj.ojNavigationList
         * @instance
         * @property {any} key Selected list item <a href="#key-section">Key</a>.
         * @property {Element} item Selected list item.
         */
        beforeSelect: null,
        /**
         * Triggered before an item is collapse via the <code class="prettyprint">expanded</code> property,
         * the <code class="prettyprint">collapse</code> method, or via the UI.
         * To prevent the item being collapsed, invoke <code class="prettyprint">event.preventDefault()</code>.
         *
         * @ojshortdesc Event handler for when an item is about to collapse.
         * @expose
         * @event
         * @memberof oj.ojNavigationList
         * @instance
         * @ojcancelable
         * @property {any} key the <a href="#key-section">Key</a> of the item to be collapse
         * @property {Element} item the item to be collapse
         */
        beforeCollapse: null,
        /**
         * Triggered before the current item is changed via the <code class="prettyprint">currentItem</code> property or via the UI.
         * To prevent the item being focused, invoke <code class="prettyprint">event.preventDefault()</code>.
         *
         * @ojshortdesc Event handler for when before the current item is changed.
         * @expose
         * @event
         * @memberof oj.ojNavigationList
         * @instance
         * @ojcancelable
         * @property {any} previousKey the <a href="#key-section">Key</a> of the previous item
         * @property {Element} previousItem the previous item
         * @property {any} key the <a href="#key-section">Key</a> of the new current item
         * @property {Element} item the new current item
         */
        beforeCurrentItem: null,
        beforeDeselect: null,
        /**
         * Triggered after an item has been collapsed via the <code class="prettyprint">expanded</code> property,
         * the <code class="prettyprint">collapse</code> method, or via the UI.
         *
         * @ojshortdesc Event handler for after an item has collapsed.
         * @expose
         * @event
         * @memberof oj.ojNavigationList
         * @instance
         * @property {any} key The <a href="#key-section">Key</a> of the item that was just collapsed.
         * @property {Element} item The list item that was just collapsed.
         */
        collapse: null,
        deselect: null,
        /**
         * Triggered before an item is expand via the <code class="prettyprint">expanded</code> property,
         * the <code class="prettyprint">expand</code> method, or via the UI.
         * To prevent the item being expanded, invoke <code class="prettyprint">event.preventDefault()</code>.
         *
         * @ojshortdesc Event handler for when an item is about to expand.
         * @expose
         * @event
         * @memberof oj.ojNavigationList
         * @instance
         * @ojcancelable
         * @property {any} key the <a href="#key-section">Key</a> of the item to be expand
         * @property {Element} item the item to be expand
         */
        beforeExpand: null,
        /**
         * Triggered after an item has been expanded via the <code class="prettyprint">expanded</code> property,
         * the <code class="prettyprint">expand</code> method, or via the UI.
         *
         * @ojshortdesc Event handler for after an item has expanded.
         * @expose
         * @event
         * @memberof oj.ojNavigationList
         * @instance
         * @property {any} key The <a href="#key-section">Key</a> of the item that was just expanded.
         * @property {Element} item The list item that was just expanded.
         */
        expand: null,
        reorder: null,
        /**
         * Triggered anytime when user performs an action gesture on a tab, no matter the tab is selected or not. The action gestures include:
         * <ul>
         *   <li>User clicks anywhere in a tab</li>
         *   <li>User taps anywhere in a tab</li>
         *   <li>User pressed enter key while a tab or its content has focus</li>
         * </ul>
         *
         * @ojshortdesc Triggered when user performs an action gesture on a tab.
         * @expose
         * @event
         * @ojbubbles
         * @memberof oj.ojNavigationList
         * @instance
         * @property {any} value the value of new selection.
         * @property {any} previousValue the value of previous selection, which can have the same as key if user selects the same tab/item.
         * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
         *               {target:"Type", value:"K", for:"value", jsdocOverride:true},
         *               {target:"Type", value:"K", for:"previousValue", jsdocOverride:true}]
         */
        selectionAction: null
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

        // inject helper functions for ContentHandler and custom renderer to use
        var self = this;
        this.navlist._FixRendererContext = function (context) {
          return self._FixRendererContext(context);
        };
        this.navlist._WrapCustomElementRenderer = function (renderer) {
          return self._WrapCustomElementRenderer(renderer);
        };
        this.navlist._GetCustomElement = function () {
          return self._GetCustomElement();
        };
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
        this.navlist = new _ojNavigationListView();

        var keys = Object.keys(this.options);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          this._validateOptionValues(key, this.options[key]);
        }

        this._validateOptionsForIconsOnlyAndHorizontalList(
          this.options[this.navlist.OPTION_DRILL_MODE],
          this.options[this.navlist.OPTION_DISPLAY],
          this.options[this.navlist.OPTION_EDGE]
        );

        var opts = { ojContext: this };
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
       * @typedef {Object} oj.ojNavigationList.NodeContext
       * @property {string} subId Sub-id string to identify a particular dom node.
       * @property {number} index The index of the item, where 0 is the index of the first item.
       * @property {K} key The Key of the item.
       * @property {boolean} group whether the item is a group.
       * @property {Element} [parent] the parent group item. Only available if item has a parent.
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"}]
       */

      /**
       * {@ojinclude "name":"nodeContextDoc"}
       * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
       * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
       * @ojsignature { target: "Type", for:"returns",
       *                value: "oj.ojNavigationList.NodeContext<K>|null",
       *                jsdocOverride: true}
       * @example {@ojinclude "name":"nodeContextExample"}
       *
       * @expose
       * @instance
       * @memberof oj.ojNavigationList
       * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
       */
      getContextByNode: function (node) {
        return this.navlist.getContextByNode(node);
      },

      /**
       * Expand an item.<p>
       * Note when vetoable is set to false, beforeExpand event will still be fired but the event cannot be veto.<p>
       *
       * @ignore
       * @expose
       * @memberof oj.ojNavigationList
       * @instance
       * @param {Object|string} key the <a href="#key-section">Key</a> of the item to expand
       * @param {boolean} vetoable if event is vetoable
       * @param {boolean} animate true if animate the expand operation, false otherwise
       * @export
       */
      expand: function (key, vetoable, animate) {
        this.navlist.expandKey(key, vetoable, true, true, animate);
      },

      /**
       * Collapse an item.<p>
       * Note when vetoable is set to false, beforeCollapse event will still be fired but the event cannot be veto.<p>
       *
       * @ignore
       * @expose
       * @memberof oj.ojNavigationList
       * @instance
       * @param {Object|string} key the <a href="#key-section">Key</a> of the item to collapse
       * @param {boolean} vetoable if event is vetoable
       * @param {boolean} animate true if animate the collapse operation, false otherwise
       * @export
       */
      collapse: function (key, vetoable, animate) {
        this.navlist.collapseKey(key, vetoable, true, animate);
      },

      /**
       * Gets the key of currently expanded items.
       *
       * @ignore
       * @expose
       * @memberof oj.ojNavigationList
       * @instance
       * @return {Array} array of keys of currently expanded items
       * @export
       */
      getExpanded: function () {
        return this.navlist.getExpanded();
      },

      _validateOptionsForIconsOnlyAndHorizontalList: function (drillMode, display, edge) {
        if (drillMode !== this.navlist.OPTION_DRILL_MODE_NONE) {
          if (display === this.navlist.OPTION_DISPLAY_ICONS) {
            throw new Error("Icon only navigation list should have drillMode set to 'none'.");
          }
          if (display === this.navlist.OPTION_DISPLAY_STACKED) {
            throw new Error("Stack only navigation list should have drillMode set to 'none'.");
          }
          if (edge === this.navlist.OPTION_EDGE_TOP) {
            throw new Error("Horizontal navigation list should have drillMode set to 'none'.");
          }
        }
      },

      _validateOptionValues: function (key, value) {
        var valid = true;
        if (key === this.navlist.OPTION_DRILL_MODE) {
          valid =
            value === this.navlist.OPTION_DRILL_MODE_NONE ||
            value === this.navlist.OPTION_DRILL_MODE_COLLAPSIBLE ||
            value === this.navlist.OPTION_DRILL_MODE_SLIDING;
        } else if (key === this.navlist.OPTION_DISPLAY) {
          valid =
            value === this.navlist.OPTION_DISPLAY_ALL ||
            value === this.navlist.OPTION_DISPLAY_ICONS ||
            value === this.navlist.OPTION_DISPLAY_STACKED;
        } else if (key === this.navlist.OPTION_EDGE) {
          if (this.element[0].tagName.toLowerCase() === this.navlist.TAG_NAME_TAB_BAR) {
            valid =
              value === this.navlist.OPTION_EDGE_TOP ||
              value === this.navlist.OPTION_EDGE_START ||
              value === this.navlist.OPTION_EDGE_END ||
              value === this.navlist.OPTION_EDGE_BOTTOM;
          } else {
            valid =
              value === this.navlist.OPTION_EDGE_TOP ||
              value === this.navlist.OPTION_EDGE_BOTTOM ||
              value === this.navlist.OPTION_EDGE_START;
          }
        }
        if (!valid) {
          throw new Error('Invalid value: ' + value + ' for key: ' + key);
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
        var flags;
        var extraData;
        this._validateOptionValues(key, value);
        switch (key) {
          case this.navlist.OPTION_DRILL_MODE:
            this._validateOptionsForIconsOnlyAndHorizontalList(
              value,
              this.options[this.navlist.OPTION_DISPLAY],
              this.options[this.navlist.OPTION_EDGE]
            );
            break;
          case this.navlist.OPTION_DISPLAY:
            this._validateOptionsForIconsOnlyAndHorizontalList(
              this.options[this.navlist.OPTION_DRILL_MODE],
              value,
              this.options[this.navlist.OPTION_EDGE]
            );
            break;
          case this.navlist.OPTION_EDGE:
            this._validateOptionsForIconsOnlyAndHorizontalList(
              this.options[this.navlist.OPTION_DRILL_MODE],
              this.options[this.navlist.OPTION_DISPLAY],
              value
            );
            break;
          case this.navlist.OPTION_SELECTION:
          case this.navlist.OPTION_CURRENT_ITEM:
            if (this.navlist.isAvailable()) {
              extraData = this.navlist.getItems([value])[0];
              flags = {
                _context: {
                  extraData: {
                    item: this._IsCustomElement() ? extraData : $(extraData)
                  }
                }
              };
            }
            break;
          default:
            break;
        }
        this.navlist.updateListViewOption(key, value);
        if (flags) {
          return this._super(key, value, flags);
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
        if (!this.navlist.isAvailable()) {
          // NavList might have been detached, just update the options.  When NavList becomes available again, the update options will take effect.
          this._super(options, flags);
          return this;
        }

        var result = this.navlist.setOptions(options, flags);

        var nonSkippedOptions = {};
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (result.skipOptions.indexOf(key) < 0) {
            nonSkippedOptions[key] = options[key];
          }
        }
        // Should call _super as that's where the old and new option value checking
        // logic lives. _setOption should not be called directly.
        this._super(nonSkippedOptions, flags);

        if (result.needRefresh) {
          this.navlist.refresh();
        }
        return this;
      },

      /**
       * Invoked when application calls oj.Components.subtreeAttached.
       * @override
       * @private
       */
      _NotifyAttached: function () {
        this.navlist.notifyAttached();
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
       * Override to do the delay connect/disconnect
       * @memberof oj.ojNavigationList
       * @override
       * @protected
       */
      _VerifyConnectedForSetup: function () {
        return true;
      },

      /**
       * Refreshes the visual state of the Navigation List. JET components require a <code class="prettyprint">refresh()</code> after the DOM is
       * programmatically changed underneath the component.
       * <p>This method does not accept any arguments.
       *
       * @expose
       * @ojshortdesc Refreshes the visual state of the Navigation List.
       * @memberof! oj.ojNavigationList
       * @instance
       * @return {void}
       *
       * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
       *  myNavList.refresh();
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
       * @ignore
       * @memberof oj.ojNavigationList
       * @instance
       * @return {Promise} A Promise that resolves when the component is ready.
       */
      whenReady: function () {
        return this.navlist.whenReady();
      },

      /**
       * Sets up resources needed by navlist
       * @memberof! oj.ojNavigationList
       * @instance
       * @override
       * @protected
       */
      _SetupResources: function () {
        this._super();
        this.navlist.setupResources();
      },

      /**
       * Release resources held by navlist
       * @memberof! oj.ojNavigationList
       * @instance
       * @override
       * @protected
       */
      _ReleaseResources: function () {
        this._super();
        this.navlist.releaseResources();
      },

      /**
       * Destroy the Navigation List
       * @memberof! oj.ojNavigationList
       * @private
       */
      _destroy: function () {
        this.navlist.destroy();
        this._super();
      },

      _CompareOptionValues: function (option, value1, value2) {
        switch (option) {
          case 'currentItem':
          case 'selection':
            return oj.Object.compareValues(value1, value2);
          default:
            return this._super(option, value1, value2);
        }
      }
    });

    // Add custom getters for properties from theming file
    Components.setDefaultOptions({
      ojNavigationList: {
        hierarchyMenuDisplayThresholdLevel: Components.createDynamicPropertyGetter(function () {
          const cssVarsObject = _ojNavigationListView._CSS_Vars.navlist;
          const cssVarH = cssVarsObject.hierarchyMenuDisplayThresholdLevel;
          return +ThemeUtils.getCachedCSSVarValues([cssVarH])[0];
        })
      }
    });
  })();

  // DOCLETS
  /**
   * @ojcomponent oj.ojTabBar
   * @augments oj.baseComponent
   * @ojimportmembers oj.ojSharedContextMenu
   * @since 4.0.0
   * @ojrole tablist
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojTabBar<K, D> extends baseComponent<ojTabBarSettableProperties<K,D>>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojTabBarSettableProperties<K,D> extends baseComponentSettableProperties",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @ojshortdesc A tab bar allows navigation between different content sections.
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["selection", "edge", "display", "truncation", "overflow"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["data"]}
   * @ojvbdefaultcolumns 12
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-tab-bar'
   * @ojuxspecs ['tab-bar']
   *
   * @classdesc
   * <h3 id="navlistOverview-section">
   *   JET Tab Bar
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#navlistOverview-section"></a>
   * </h3>
   *
   * <p>Description: JET Tab Bar enhances a HTML list element into a themable, WAI-ARIA compliant, mobile friendly component with advance interactive features.
   *
   * <h3 id="data-section">
   *   Data
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
   * </h3>
   * <p>The JET Tab Bar gets its data in two different ways.  The first way is from a DataProvider/TableDataSource.  There are several types of DataProvider/TableDataSource
   * that are available out of the box:</p>
   * <ul>
   * <li>oj.ArrayDataProvider</li>
   * <li>oj.CollectionTableDataSource</li>
   * </ul>
   *
   * <p><b>oj.ArrayDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, Tab Bar will automatically react
   * when items are added or removed from the array.  See the documentation for oj.ArrayDataProvider for more details on the available options.</p>
   *
   * <p><b>oj.CollectionTableDataSource</b> - Use this when oj.Collection is the model for the underlying data.  Note that the Tab Bar will automatically react to model event from
   * the underlying oj.Collection.  See the documentation for oj.CollectionTableDataSource for more details on the available options.</p>
   *
   * <p> NOTE: PagingTableDataSource is not supported by Tab Bar.
   * <p>Second way is using static HTML content as data.</p>
   * <p>Note that any manipulation of static HTML content, including manipulating content generated through Knockout (for example, updating observableArray in a foreach binding), is not supported.<p>
   *
   * <p>Example of static content</p>
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-tab-bar>
   *  &lt;ul>
   *   &lt;li>&lt;a href="#">Item 1&lt;/a>&lt;/li>
   *   &lt;li>&lt;a href="#">Item 2&lt;/a>&lt;/li>
   *   &lt;li>&lt;a href="#">Item 3&lt;/a>&lt;/li>
   *  &lt;/ul>
   * &lt;/oj-tab-bar>
   * </code></pre>
   * <p>Any list item can be disabled by adding the <code class="prettyprint">oj-disabled</code> class to that element.  As with any DOM change, doing so post-init
   * requires a <code class="prettyprint">refresh()</code> of the element.
   *
   * <h3 id="key-section">
   *   Key
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#key-section"></a>
   * </h3>
   * <p>Key is an identifier which uniquely identifies an item in tabbar.
   *  <ul>
   *  <li>When static html is used, it will be the <code class="prettyprint">id</code> attribute of <code class="prettyprint">&lt;li></code>. If no <code class="prettyprint">id</code> is specified then component will generate an id and will use it as key.</li>
   *  <li>When data source is used, it will be the <code class="prettyprint">id</code> attribute of item's data object.
   *  </ul>
   * <h3 id="icons-section">
   *   Icons
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#icons-section"></a>
   * </h3>
   *
   * <p>Sublist icons are inserted automatically.  To add other icons to list items, include them in the markup and include the <code class="prettyprint">oj-tabbar-item-icon</code> class, as follows:
   *
   * <pre class="prettyprint">
   * <code>&lt;oj-tab-bar>
   *   &lt;ul>
   *     &lt;li id="foo">&lt;a href="#">&lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">&lt;/span>Foo&lt;/a>&lt;/li>
   *   &lt;/ul>
   *  &lt;/oj-tab-bar>
   * </code></pre>
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
   *       <td><kbd>componentElement</kbd></td>
   *       <td>oj-tab-bar element.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>datasource</kbd></td>
   *       <td>A reference to the data source object. (Not available for static content)</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>index</kbd></td>
   *       <td>The index of the item, where 0 is the index of the first item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>key</kbd></td>
   *       <td>The <a href="#key-section">Key</a> of the item.</td>
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
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <h4>Data Set Size</h4>
   * <p>As a rule of thumb, it's recommended that applications limit the amount of data to display.  Displaying large
   * number of items in Tab Bar makes it hard for user to find what they are looking for, but affects the load time.
   *
   * <h4>Item Content</h4>
   * <p>Tab Bar allows developers to specify arbitrary content inside its item. In order to minimize any negative effect on
   * performance, you should avoid putting a large number of heavy-weight components inside because as you add more complexity
   * to the structure, the effect will be multiplied because there can be many items in the Tab Bar.</p>
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
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
   * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET custom element, in the unusual case that the reading direction
   * is changed post-init, the tab bar must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
   *
   *
   * <h3 id="animation-section">
   *   Animation
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#animation-section"></a>
   * </h3>
   *
   * <p>Applications can customize animations triggered by actions in Tab Bar by overriding action specific style classes on the animated item.  See the documentation of <a href="AnimationUtils.html">AnimationUtils</a>
   *    class for details.</p>
   *
   * <p>The following are actions in which applications can use to customize animation effects.
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Action</th>
   *       <th>Description</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td><kbd>horizontal add</kbd></td>
   *       <td>When a new item is added to the TableDataSource associated with Horizontal Tab Bar.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>add</kbd></td>
   *       <td>When a new item is added to the TableDataSource associated with Vertical Tab Bar.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>horizontal remove</kbd></td>
   *       <td>When an existing item is removed from the TableDataSource associated with Horizontal Tab Bar.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>remove</kbd></td>
   *       <td>When an existing item is removed from the TableDataSource associated with Vertical Tab Bar.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>update</kbd></td>
   *       <td>When an existing item is updated in the TableDataSource associated with TabBar.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>pointerUp</kbd></td>
   *       <td>When user finish pressing an item (on touch).</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   */
  // --------------------------------------------------- oj.ojTabBar Styling Start -----------------------------------------------------------
  // ---------------- oj-tabbar-stack-icon-label --------------
  /**
   * Use this class to display a horizontal Tab Bar with icons and labels stacked. Applicable only when edge is top.
   * @ojstyleclass oj-tabbar-stack-icon-label
   * @ojdisplayname Stack Icon
   * @memberof oj.ojTabBar
   * @ojdeprecated {since: '9.0.0', description: 'Use display attribute instead.'}
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-tabbar-stack-icon-label" >
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-tabbar-category-divider --------------
  /**
   * Use this class to add a horizontal divider line between two categories of items.
   * @ojstyleclass oj-tabbar-category-divider
   * @ojdisplayname CategoryDivider
   * @ojstyleselector "oj-tab-bar li"
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar>
   *   &lt;ul>
   *     &lt;li ...>&lt;/li>
   *     &lt;li class="oj-tabbar-category-divider">&lt;/li>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-tabbar-item-icon --------------
  /**
   * Use this class to add an icon to a list item.
   * @ojstyleclass oj-tabbar-item-icon
   * @ojdisplayname Icons
   * @ojstyleselector "oj-tab-bar span"
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-tabbar-stack-icon-label" >
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-tabbar-item-title --------------
  /**
   * When arbitrary content is placed inside an item's content area, its title text can be marked using this style class. This helps the component in identifying the Item's label.
   * @ojstyleclass oj-tabbar-item-title
   * @ojdisplayname Title
   * @memberof oj.ojTabBar
   * @ojstyleselector "oj-tab-bar span"
   * @ojtsexample
   * &lt;li id="foo">
   *   &lt;div>
   *     &lt;span class="oj-tabbar-item-title">Play&lt;/span>
   *       &lt;button>Button&lt;/button>
   *   &lt;/div>
   * &lt;/li>
   */
  // ---------------- oj-tabbar-item-text-wrap --------------
  /**
   * Use this class to wrap item label text. Note: On IE11, this is not supported when overflow attribute is set to 'popup'. This style class is not supported when edge is 'top' or 'bottom'.
   * @ojstyleclass oj-tabbar-item-text-wrap
   * @ojdisplayname Text Wrap
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-tabbar-item-text-wrap" >
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-tabbar-item-dividers --------------
  /**
   * Use this class  to render a divider between tab items. Note: On IE11, this is not supported when overflow attribute is set to 'popup'.
   * @ojstyleclass oj-tabbar-item-dividers
   * @ojdisplayname ItemDividers
   * @memberof oj.ojTabBar
   * @ojunsupportedthemes ["Redwood"]
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-tabbar-item-dividers">
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-[size]-condense --------------
  /**
   * Use this class to wrap item label text. Note: On IE11, this is not supported when overflow attribute is set to 'popup'.
   * @ojstyletemplate oj-[size]-condense
   * @ojstyletemplatetokens ["StylingTemplateTokens.[size]"]
   * @ojdisplayname Condense
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-sm-condense" >
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-tabbar-nofollow-link --------------
  /**
   * Use this class to prevent automatic navigation to the url specified on an &lt;a> tag's href attribute. <br/>
   * In this case, navigation can be handled programmatically by using selectionChanged event. <br/>
   * This is useful to execute some custom logic before browser triggers navigation.
   * @ojstyleclass oj-tabbar-nofollow-link
   * @ojdisplayname No Follow Link
   * @ojshortdesc Use this class to prevent automatic navigation to a URL within a tab item. See the Help documentation for more information.
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-tabbar-nofollow-link" >
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-tabbar-item-label --------------
  /**
   * Use this class to specify the element with the label.  This will eliminate the need for Tabbar to automatically
   * wrap any child element that is not an icon or a badge with this class.  Note the content must have the correct
   * order (icon element first, then the label element, then the badge element) as Tabbar in this case will not attempt
   * to reorder the content.
   * @ojstyleclass oj-tabbar-item-label
   * @ojdisplayname Label
   * @ojstyleselector "oj-tabbar span"
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-tabbar-stack-icon-label" >
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         &lt;span class="oj-tabbar-item-label">
   *         Foo
   *         &lt;/span>
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-removable --------------
  /**
   * Use this class to make an item removable.
   * @ojstyleclass oj-removable
   * @ojdisplayname Item Removable
   * @ojstyleselector "oj-tab-bar li"
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar>
   *   &lt;ul>
   *     &lt;li id="foo" class="oj-removable" >
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-tabbar-hide-remove-icon --------------
  /**
   * Use this class to hide the remove icon. In this case, Item can be removed using context menu.
   * @ojstyleclass oj-tabbar-hide-remove-icon
   * @ojdisplayname Hide Remove Icon
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-tabbar-hide-remove-icon" >
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-tabbar-item-end --------------
  /**
   * Use this class to add an badge/metadata/icon to a list item.
   * @ojstyleclass oj-tabbar-item-end
   * @ojdisplayname Icon
   * @memberof oj.ojTabBar
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-tabbar-item-end" >
   *   &lt;ul>
   *     &lt;li id="foo">
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-end>
   *            &lt;span class="oj-badge oj-badge-subtle">3
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-disabled --------------
  /**
   * Any list item can be disabled by adding the oj-disabled class to that element
   * @ojstyleclass oj-disabled
   * @ojdisplayname Disabled Item
   * @ojstyleselector "oj-tab-bar li"
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar>
   *   &lt;ul>
   *     &lt;li id="foo" class="oj-disabled" >
   *       &lt;a href="#">
   *         &lt;span class="oj-tabbar-item-icon demo-icon-font-24 demo-palette-icon-24">
   *         &lt;/span>
   *         Foo
   *       &lt;/a>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-tab-bar>
   */
  // ---------------- oj-focus-highlight --------------
  /**
   * Under normal circumstances this class is applied automatically.
   * It is documented here for the rare cases that an app developer needs per-instance control.<br/><br/>
   * The oj-focus-highlight class applies focus styling that may not be desirable when the focus results from pointer interaction (touch or mouse), but which is needed for accessibility when the focus occurs by a non-pointer mechanism, for example keyboard or initial page load.<br/><br/>
   * The application-level behavior for this component is controlled in the theme by the <code class="prettyprint"><span class="pln">$focusHighlightPolicy </span></code>SASS variable; however, note that this same variable controls the focus highlight policy of many components and patterns. The values for the variable are:<br/><br/>
   * <code class="prettyprint"><span class="pln">nonPointer: </span></code>oj-focus-highlight is applied only when focus is not the result of pointer interaction. Most themes default to this value.<br/>
   * <code class="prettyprint"><span class="pln">all: </span></code> oj-focus-highlight is applied regardless of the focus mechanism.<br/>
   * <code class="prettyprint"><span class="pln">none: </span></code> oj-focus-highlight is never applied. This behavior is not accessible, and is intended for use when the application wishes to use its own event listener to precisely control when the class is applied (see below). The application must ensure the accessibility of the result.<br/><br/>
   * To change the behavior on a per-instance basis, the application can set the SASS variable as desired and then use event listeners to toggle this class as needed.<br/>
   * @ojstyleclass oj-focus-highlight
   * @ojdisplayname Focus Styling
   * @ojshortdesc Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information.
   * @memberof oj.ojTabBar
   * @ojtsexample
   * &lt;oj-tab-bar class="oj-focus-highlight">
   *   &lt;!-- Content -->
   * &lt;/oj-tab-bar>
   */
  /**
   * @ojstylevariableset oj-tab-bar-css-set1
   * @ojstylevariable oj-tab-bar-icon-to-text-padding {description: "Padding between icon and text", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-tab-bar-icon-margin {description: "Tab bar icon margin", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-tab-bar-icon-size {description: "Tab bar icon size", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-tab-bar-item-margin {description: "Tab bar item margin", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-tab-bar-item-padding {description: "Tab bar item padding", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-tab-bar-item-min-height {description: "Tab bar item minimum height", formats: ["length"], help: "#css-variables"}
   * @ojstylevariable oj-tab-bar-item-line-height {description: "Tab bar item line height", formats: ["number"], help: "#css-variables"}
   * @ojstylevariable oj-tab-bar-item-font-size {description: "Tab bar item font size", formats: ["length"], help: "#css-variables"}
   * @memberof oj.ojTabBar
   */
  /**
   * @ojstylevariableset oj-tab-bar-css-set2
   * @ojdisplayname Default
   * @ojstylevariable oj-tab-bar-item-font-weight {description: "Default tab bar item font weight", formats: ["font_weight"], help: "#oj-tab-bar-css-set2"}
   * @ojstylevariable oj-tab-bar-item-label-color {description: "Default tab bar item label color", formats: ["color"], help: "#oj-tab-bar-css-set2"}
   * @memberof oj.ojTabBar
   */
  /**
   * @ojstylevariableset oj-tab-bar-css-set3
   * @ojdisplayname Hovered
   * @ojstylevariable oj-tab-bar-item-label-color-hover {description: "Tab bar item label color when hovered", formats: ["color"], help: "#oj-tab-bar-css-set3"}
   * @ojstylevariable oj-tab-bar-item-bg-color-hover {description: "Tab bar item background color when hovered",formats: ["color"], help: "#oj-tab-bar-css-set3"}
   * @memberof oj.ojTabBar
   */
  /**
   * @ojstylevariableset oj-tab-bar-css-set4
   * @ojdisplayname Active
   * @ojstylevariable oj-tab-bar-item-bg-color-active {description: "Tab bar item background color when active", formats: ["color"], help: "#oj-tab-bar-css-set4"}
   * @ojstylevariable oj-tab-bar-item-border-color-active {description: "Tab bar item border color when active", formats: ["color"], help: "#oj-tab-bar-css-set4"}
   * @memberof oj.ojTabBar
   */
  /**
   * @ojstylevariableset oj-tab-bar-css-set5
   * @ojdisplayname Selected
   * @ojstylevariable oj-tab-bar-item-font-weight-selected {description: "Tab bar item font weight when selected", formats: ["font_weight"], help: "#oj-tab-bar-css-set5"}
   * @ojstylevariable oj-tab-bar-item-label-color-selected {description: "Tab bar item label color when selected", formats: ["color"], help: "#oj-tab-bar-css-set5"}
   * @ojstylevariable oj-tab-bar-item-bg-color-selected {description: "Tab bar item background color when selected", formats: ["color"], help: "#oj-tab-bar-css-set5"}
   * @ojstylevariable oj-tab-bar-item-border-color-selected {description: "Tab bar item border color when selected", formats: ["color"], help: "#oj-tab-bar-css-set5"}
   * @memberof oj.ojTabBar
   */
  // --------------------------------------------------- oj.ojTabBar Styling End -----------------------------------------------------------
  /**
   * An alias for the current item when referenced inside the item template. This can be especially useful
   * if oj-bind-for-each element is used inside the item template since it has its own scope of data access.
   *
   * @ojshortdesc Specifies the alias for the current item when referenced inside the item template.
   *
   * @name as
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTabBar
   * @type {string}
   * @default ''
   * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
   *
   * @example <caption>Initialize the Tabbar with the <code class="prettyprint">as</code> attribute specified:</caption>
   * &lt;oj-tab-bar as='item'>
   *   &lt;template slot='itemTemplate'>
   *     &lt;li>
   *     &lt;a href='#'>&lt;oj-bind-text value='[[item.data.name]]'>&lt;/oj-bind-text>&lt;/a>
   *     &lt;/li>
   *   &lt;/template>
   * &lt;/oj-tab-bar>
   */
  /**
   * <a href="#key-section">Key</a> of the current item.  Current item is the list item which is having active focus.  Note that if currentItem
   * is set to an item that is currently not available (not fetched or
   * inside a collapsed parent node), then the value is ignored.
   * <p>
   * When the current item is changed, the <code class="prettyprint">event.detail</code> of the <code class="prettyprint">currentItemChanged</code> event will contain the following additional properties:<br><br>
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
   *       <td class="name"><code>item</code></td>
   *       <td class="type">Element</td>
   *       <td class="description">Current Item element</td>
   *     </tr>
   *   </tbody>
   * </table>
   * @expose
   * @public
   * @instance
   * @name currentItem
   * @memberof oj.ojTabBar
   * @type {any}
   * @default null
   * @ojshortdesc Specifies the key of the item that should have keyboard focus. See the Help documentation for more information.
   * @ojwriteback
   *
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">current-item</code> attribute specified:</caption>
   *  &lt;oj-tab-bar current-item='settings'> ... &lt;/oj-tab-bar>
   * @example <caption>Get the current item:</caption>
   * var currentItem = myTabBar.currentItem;
   *
   * @example <caption>Set the current item on the tabbar:</caption>
   * myTabBar.currentItem = "newItem";
   */

  /**
   * The position of the Tab Bar. Valid Values: top, bottom, start and end.
   * @expose
   * @name edge
   * @memberof oj.ojTabBar
   * @instance
   * @type {string}
   * @ojvalue {string} "top" This renders list items horizontally. Generally used when tab bar placed on top of content section.
   * @ojvalue {string} "bottom" This renders list items horizontally. Generally used when tab bar placed on bottom of content section.
   * @ojvalue {string} "start" This renders list items vertically. Generally used when tab bar placed on left/start of content section.
   * @ojvalue {string} "end" This renders list items vertically. Generally used when tab bar placed on right/end of content section.
   * @default start
   * @ojshortdesc Specifies the edge position of the Tab Bar.
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">edge</code> attribute specified:</caption>
   *  &lt;oj-tab-bar edge='top'> ... &lt;/oj-tab-bar>
   * @example <caption>Get the edge:</caption>
   * var edge = myTabBar.edge;
   *
   * @example <caption>Set the edge on the tabbar:</caption>
   * myTabBar.edge = "top";
   */
  /**
   * Specifies if the tabs can be reordered within the tab bar by drag-and-drop.
   * @expose
   * @name reorderable
   * @memberof oj.ojTabBar
   * @instance
   * @ojshortdesc Specifies whether tabs can be reordered.
   *
   * @since 4.1.0
   * @type {string}
   * @ojvalue {string} "enabled" Enables reordering of items in tabbar.
   * @ojvalue {string} "disabled" Disables reordering of items in tabbar.
   * @default disabled
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">reorderable</code> attribute specified:</caption>
   *  &lt;oj-tab-bar reorderable='enabled'> ... &lt;/oj-tab-bar>
   * @example <caption>Get the reorderable:</caption>
   * var reorderable = myTabBar.reorderable;
   *
   * @example <caption>Set the edge on the tabbar:</caption>
   * myTabBar.reorderable = "enabled";
   */
  /**
   * Truncation applies to the tab titles when there is not enough room to display all tabs.
   * @expose
   * @name truncation
   * @memberof oj.ojTabBar
   * @instance
   *
   * @ojshortdesc Specifies whether truncation needs to be applied.
   * @since 4.1.0
   * @type {string}
   * @ojvalue {string} "none" tabs always take up the space needed by the title texts.
   * @ojvalue {string} "progressive"  If not enough space is available to display all of the tabs, then the width of each tab title is restricted just enough to allow all tabs to fit. All tab titles that are truncated are displayed with ellipses. However the width of each tab title will not be truncated below $tabBarTruncatedLabelMinWidth.
   * @default none
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">truncation</code> attribute specified:</caption>
   *  &lt;oj-tab-bar truncation='progressive'> ... &lt;/oj-tab-bar>
   * @example <caption>Get the truncation property:</caption>
   * var truncation = myTabBar.truncation;
   *
   * @example <caption>Set the truncation on the tabbar:</caption>
   * myTabBar.truncation = "progressive";
   */

  /**
   * Item <a href="#key-section">Key</a> of currently selected list item. If the value is modified
   * by an application, tab bar UI is modified to match the new value and the <code class="prettyprint">event.detail</code> of the <code class="prettyprint">selectionChanged</code> event will contain the following additional properties:<br><br>
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
   *       <td class="name"><code>item</code></td>
   *       <td class="type">Element</td>
   *       <td class="description">Selected Item element</td>
   *     </tr>
   *   </tbody>
   * </table>
   * @type {any}
   * @name selection
   * @ojshortdesc Specifies the key of the selected item. See the Help documentation for more information.
   * @default null
   * @ojwriteback
   * @expose
   * @instance
   * @ojeventgroup common
   * @memberof oj.ojTabBar
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">selection</code> attribute specified:</caption>
   *  &lt;oj-tab-bar selection='settings'> ... &lt;/oj-tab-bar>
   *
   * @example <caption>Get the selection:</caption>
   * var selection = myTabBar.selection;
   *
   * @example <caption>Set the selection on the tabbar:</caption>
   * myTabBar.selection = "settings";
   */

  /**
   * The data source for the Tab Bar accepts either a TableDataSource or DataProvider.
   * See the data source section in the introduction for out of the box data source types.
   * If the data attribute is not specified, the child elements are used as content.  If there's no
   * content specified, then an empty list is rendered.
   *
   * @expose
   * @name data
   * @memberof oj.ojTabBar
   * @instance
   * @ojshortdesc Specifies the data provider for the Tab Bar. See the Help documentation for more information.
   * @type {Object|null}
   * @ojsignature [{target: "Type", value: "DataProvider<K, D>|null"},
   *               {target: "Type", value: "TableDataSource|DataProvider|null", consumedBy:"js"}]
   * @default null
   * @ojwebelementstatus {type: "deprecated", since: "14.0.0",
   *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">data</code> attribute specified:</caption>
   *  &lt;oj-tab-bar data='[[tableDataSource]]'> ... &lt;/oj-tab-bar>
   * @example <caption>Get the data:</caption>
   * var dataSource = myTabBar.data;
   *
   * @example <caption>Set the data attribute using one-dimensional array:</caption>
   * myTabBar.data = new oj.ArrayTableDataSource([1,2,3]);
   *
   * @example <caption>Set the data attribute using oj.Collection:</caption>
   * myTabBar.data = new oj.CollectionTableDataSource(collection);
   */

  /**
   * Whether to display both the label and icons (<code class="prettyprint">"all"</code>) or just the icons (<code class="prettyprint">"icons"</code>).
   * In the latter case, the label is displayed in a tooltip instead, unless a tooltip was already supplied at create time.
   * Note: <code class="prettyprint">display="icons"</code> is valid only when <code class="prettyprint">drillMode=none</code> and tab bar is a flat list,
   * <code class="prettyprint">display="stacked"</code> is not supported in vertical tabbar layout where the edge is end or start.
   * It is also mandatory to provide icons for each item as stated in <a href="#icons-section">icons section</a>.
   *
   * @expose
   * @memberof oj.ojTabBar
   * @instance
   * @name display
   * @type {string}
   * @ojvalue {string} "all" Display both the label and icons.
   * @ojvalue {string} "icons" Display only the icons.
   * @ojvalue {string} "stacked" Display icons with stacked label.
   * @default all
   * @ojshortdesc Specifies what needs to be displayed. See the Help documentation for more information.
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">display</code> attribute specified:</caption>
   *  &lt;oj-tab-bar display='icons'> ... &lt;/oj-tab-bar>
   *
   * @example <caption>Get or set the <code class="prettyprint">display</code> property:</caption>
   * // getter
   * var display = myTabBar.display;
   *
   * // setter
   * myTabBar.display = "icons";
   */

  /**
   * Whether to stretch the tab bar items to occupy available space or to condense items
   *
   * @expose
   * @memberof oj.ojTabBar
   * @instance
   * @name layout
   * @type {string}
   * @ojvalue {string} "stretch" all items are stretched
   * @ojvalue {string} "condense" all items are condense
   * @default stretch
   * @ojshortdesc Specifies whether to stretch the tab bar items to occupy available space or to condense items.
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">layout</code> attribute specified:</caption>
   *  &lt;oj-tab-bar layout='condense'> ... &lt;/oj-tab-bar>
   *
   * @example <caption>Get or set the <code class="prettyprint">layout</code> property:</caption>
   * // getter
   * var layout = myTabBar.layout;
   *
   * // setter
   * myTabBar.layout = "stretch";
   */

  /**
   * Specifies the overflow behaviour.
   * NOTE: This is only applicable when <code class="prettyprint">edge</code> attribute set to <code class="prettyprint">top</code>
   * @expose
   * @memberof oj.ojTabBar
   * @name overflow
   * @instance
   * @type {string}
   * @ojvalue {string} "popup" Popup menu will be shown with overflowed items. <p> Note that setting <code class="prettyprint">overflow</code> to <code class="prettyprint">popup</code> can trigger browser reflow, so only set it when it is actually required.
   * @ojvalue {string} "hidden" Overflow is clipped, and the rest of the content will be invisible.
   * @default hidden
   * @ojshortdesc Specifies overflow behaviour for the Tab Bar.
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">overflow</code> attribute specified:</caption>
   *  &lt;oj-tab-bar overflow='popup'> ... &lt;/oj-tab-bar>
   * @example <caption>Get or set the <code class="prettyprint">overflow</code> property:</caption>
   * // getter
   * var overflow = myTabBar.overflow;
   *
   * // setter
   * myTabBar.overflow = "popup";
   */

  /**
   * @typedef {Object} oj.ojTabBar.ItemContext
   * @property {Element} componentElement oj-tab-bar element
   * @property {DataProvider<K, D>} [datasource] A reference to the data source object. (Not available for static content)
   * @property {number} index The index of the item, where 0 is the index of the first item.
   * @property {K} key The Key of the item.
   * @property {D} data The data object for the item.
   * @property {Element} parentElement The list item element. The renderer can use this to directly append content.
   * @ojsignature [{target:"Type", value:"<K, D>", for:"genericTypeParameters"}]
   */

  /**
   * The item property contains a subset of properties for items.
   * @ojshortdesc Customize the functionality of each tab on Tab Bar.
   * @expose
   * @memberof oj.ojTabBar
   * @instance
   * @name item
   * @type {Object}
   */
  /**
   * The renderer function that renders the content of the item. See <a href="#context-section">itemContext</a>
   * in the introduction to see the object passed into the renderer function.
   * The function should return one of the following:
   * <ul>
   *   <li>An Object with the following property:
   *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the item.</li></ul>
   *   </li>
   *   <li>undefined: If the developer chooses to manipulate the item element directly, the function should return undefined.</li>
   * </ul>
   * If no renderer is specified, Tab Bar will treat the data as a String.
   *
   * @expose
   * @ojshortdesc Specifies the renderer for the tab item. See the Help documentation for more information.
   * @name item.renderer
   * @memberof! oj.ojTabBar
   * @instance
   * @ojsignature { target: "Type",
   *                value: "?(((context: oj.ojTabBar.ItemContext<K, D>) => void)|null)",
   *                jsdocOverride: true}
   * @type {function(Object)|null}
   * @default null
   * @example <caption>Initialize the Tab Bar with the <code class="prettyprint">item.renderer</code> attribute specified:</caption>
   *  &lt;oj-tab-bar item.renderer="{{oj.KnockoutTemplateUtils.getRenderer('template', true)}}"> ... &lt;/oj-tab-bar>
   *
   * @example <caption>Get or set the <code class="prettyprint">renderer</code> property:</caption>
   * // set the renderer function
   * myTabBar.item.renderer = rendererFn;
   *
   * // get the renderer function
   * var rendererFn = myTabBar.item.renderer;
   */
  /**
   * Whether the item is selectable.
   * See <a href="#context-section">itemContext</a> in the introduction to see the object passed into the selectable function.
   *
   * @expose
   * @ojshortdesc Specifies whether the tab can be selected. See the Help documentation for more information.
   * @name item.selectable
   * @memberof! oj.ojTabBar
   * @instance
   * @ojsignature { target: "Type",
   *                value: "?(((context: oj.ojTabBar.ItemContext<K, D>) => boolean)|boolean)",
   *                jsdocOverride: true}
   * @type {function(Object)|boolean}
   * @default true
   *
   * @example <caption>Initialize the Tab Bar such that the first 3 items are not selectable:</caption>
   *  &lt;oj-tab-bar item.selectable="[[skipFirstThreeElementsFn]]">&lt;/oj-tab-bar>
   *
   *  var skipFirstThreeElementsFn = function(itemContext) {
   *                                      return itemContext['index'] > 3;
   *                                 }
   */
  // Events
  /**
   * Triggered when the default animation of a particular action is about to start.  The default animation can be cancelled by calling event.preventDefault.
   * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
   *
   * @expose
   * @ojshortdesc Event handler for when the default animation of a particular action is about to start.
   * @event
   * @name animateStart
   * @memberof oj.ojTabBar
   * @instance
   * @property {string} action the action that triggers the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
   * @property {Element} element the target of animation.
   * @property {function():void} endCallback if the event listener calls event.preventDefault to cancel the default animation, it must call the endCallback function when it finishes its own animation handling and when any custom animation ends.
   */
  /**
   * Triggered when the default animation of a particular action has ended.  Note this event will not be triggered if application cancelled the default animation on animateStart.
   * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
   *
   * @expose
   * @ojshortdesc Event handler for when the default animation of a particular action has ended.
   * @event
   * @name animateEnd
   * @memberof oj.ojTabBar
   * @instance
   * @property {string} action the action that triggered the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
   * @property {Element} element the target of animation.
   */

  /**
   * <p>Triggered before this list item is selected.
   * To prevent the item selection, invoke <code class="prettyprint">event.preventDefault()</code>.
   * @ojshortdesc Event handler for when before the selection is changed.
   * @expose
   * @event
   * @ojcancelable
   * @name beforeSelect
   * @memberof oj.ojTabBar
   * @instance
   * @property {any} key Selected list item <a href="#key-section">Key</a>.
   * @property {Element} item Selected list item.
   */

  /**
   * Triggered before the current item is changed via the <code class="prettyprint">currentItem</code> property or via the UI.
   * To prevent the item being focused, invoke <code class="prettyprint">event.preventDefault()</code>.
   * @ojshortdesc Event handler for when before the current item is changed.
   * @expose
   * @event
   * @memberof oj.ojTabBar
   * @ojcancelable
   * @name beforeCurrentItem
   * @instance
   * @property {any} previousKey the <a href="#key-section">Key</a> of the previous item
   * @property {Element} previousItem the previous item
   * @property {any} key the <a href="#key-section">Key</a> of the new current item
   * @property {Element} item the new current item
   */
  /**
   * Triggered immediately before a tab is deselected.
   * To prevent the item being deselected, invoke <code class="prettyprint">event.preventDefault()</code>.
   * @ojshortdesc Event handler for when before tab is deselected.
   * @expose
   * @event
   * @ojcancelable
   * @memberof oj.ojTabBar
   * @name beforeDeselect
   *
   * @since 4.1.0
   * @instance
   * @property {any} fromKey the <a href="#key-section">Key</a> of the tab item being navigated from
   * @property {Element} fromItem the tab item being navigated from
   * @property {any} toKey the <a href="#key-section">Key</a> of the tab item being navigated to
   * @property {Element} toItem the tab item being navigated to
   */
  /**
   * Triggered after a tab has been deselected.
   * @ojshortdesc Event handler for when a tab is deselected.
   * @expose
   * @event
   * @memberof oj.ojTabBar
   * @name deselect
   *
   * @since 4.1.0
   * @instance
   * @property {any} fromKey the <a href="#key-section">Key</a> of the tab item being navigated from
   * @property {Element} fromItem the tab item being navigated from
   * @property {any} toKey the <a href="#key-section">Key</a> of the tab item being navigated to
   * @property {Element} toItem the tab item being navigated to
   */
  /**
   * Triggered before the item is removed via the UI.
   * To prevent the item being removed, invoke <code class="prettyprint">event.preventDefault()</code>.
   * @ojshortdesc Event handler for when a tab is about to be removed.
   * @expose
   * @event
   * @ojcancelable
   * @memberof oj.ojTabBar
   * @name beforeRemove
   *
   * @since 4.1.0
   * @instance
   * @property {Element} item Item being removed
   * @property {any} key <a href="#key-section">Key</a> of the item being removed
   */
  /**
   * Triggered immediately after a tab is removed. This should be used to remove item from dom or from data source.
   * @ojshortdesc Event handler for when a tab is removed.
   * @expose
   * @event
   * @memberof oj.ojTabBar
   * @name remove
   *
   * @since 4.1.0
   * @instance
   * @property {Element} item Item removed
   * @property {any} key <a href="#key-section">Key</a> of the item removed
   */
  /**
   * Triggered after reordering items within tabbar via drag and drop or cut and paste. This should be used to reorder item in dom or data source.
   * @ojshortdesc Event handler for when a tab is reordered.
   * @expose
   * @event
   * @memberof oj.ojTabBar
   * @name reorder
   *
   * @since 4.1.0
   * @instance
   * @property {Element} item Item to be moved
   * @property {('before'|'after')} position the drop position relative to the reference item. Possible values are "before" and "after".
   * @property {Element} reference the item where the moved items are drop on.
   */
  /**
   * @typedef {Object} oj.ojTabBar.NodeContext
   * @property {string} subId Sub-id string to identify a particular dom node.
   * @property {number} index The index of the item, where 0 is the index of the first item.
   * @property {K} key The Key of the item.
   * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"}]
   */
  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   * @ojsignature { target: "Type", for: "returns",
   *                value: "oj.ojTabBar.NodeContext<K>|null",
   *                jsdocOverride: true}
   * @example {@ojinclude "name":"nodeContextExample"}
   * @method
   * @expose
   * @name getContextByNode
   * @instance
   * @memberof oj.ojTabBar
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
   */

  /**
   * Refreshes the visual state of the Tab Bar. JET components require a <code class="prettyprint">refresh()</code> after the DOM is
   * programmatically changed underneath the component.
   * <p>This method does not accept any arguments.
   *
   * @ojshortdesc Refreshes the visual state of the Tab Bar.
   * @expose
   * @memberof oj.ojTabBar
   * @instance
   * @name refresh
   * @return {void}
   * @method
   * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
   *  myTabBar.refresh();
   */

  // Slots
  /**
   * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the list. The slot content must be a &lt;template> element.
   * The content of the template could either include the &lt;li> element, in which case that will be used as
   * the root of the item.  Or it can be just the content which excludes the &lt;li> element.</p>
   * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
   * <ul>
   *   <li>$current - an object that contains information for the current item. (See [oj.ojTabBar.ItemTemplateContext]{@link oj.ojTabBar.ItemTemplateContext} or the table below for a list of properties available on $current)</li>
   *  <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
   * </ul>
   *
   * @ojslot itemTemplate
   * @ojmaxitems 1
   * @memberof oj.ojTabBar
   * @ojshortdesc The itemTemplate slot is used to specify the template for rendering each item in the list. See the Help documentation for more information.
   * @ojtemplateslotprops oj.ojTabBar.ItemTemplateContext
   * @example <caption>Initialize the ListView with an inline item template specified:</caption>
   * &lt;oj-tab-bar>
   *   &lt;template slot='itemTemplate' data-oj-as='item'>
   *     &lt;li>&lt;a href="#">&lt;oj-bind-text value='[[item.data.name]]'>&lt;/oj-bind-text>&lt;/a>&lt;/li>
   *   &lt;/template>
   * &lt;/oj-tab-bar>
   */
  /**
   * @typedef {Object} oj.ojTabBar.ItemTemplateContext
   * @property {Element} componentElement The &lt;oj-tab-bar> custom element
   * @property {Object} data The data for the current item being rendered
   * @property {number} index The zero-based index of the current item
   * @property {any} key The key of the current item being rendered
   */
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
   *       <td>Overflow Menu button</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Open menu. Refer <a href="oj.ojButton.html#touch-section">menu button</a> touch documentation. Note: This is applicable only for Horizontal Tab Bar when <code class="prettyprint">overflow</code> is set to <code class="prettyprint">popup</code>. </td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojTabBar
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
   *       <td rowspan="12">List Item</td>
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
   *       <td>For horizontal tab bar,focus will be moved to next visible item.
   *       </td>
   *     </tr>
   *     <tr>
   *       <td><kbd>LeftArrow</kbd> (<kbd>RightArrow</kbd> in RTL)</td>
   *       <td>For horizontal tab bar,focus will be moved to previous visible item.</td>
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
   *       <td>If focus is on a list item, pressing F2 will make its contents accessible using TAB. It can also be used to exit actionable mode if already in actionable mode.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Esc</kbd></td>
   *       <td>When F2 mode is enabled, press Esc to exit F2 mode.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl+X</kbd></td>
   *       <td>Marks the current item to move if reorderable is enabled.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl+V</kbd></td>
   *       <td>Paste the item that are marked to directly before the current item</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>DELETE</kbd></td>
   *       <td>Delete the current item. </td>
   *     </tr>
   *     <tr>
   *       <td>Overflow Menu button</td>
   *       <td><kbd>Enter or Space</kbd></td>
   *       <td>Open menu. Refer <a href="oj.ojButton.html#touch-section">menu button</a> touch documentation. Note: This is applicable only for Horizontal Tab Bar when <code class="prettyprint">overflow</code> is set to <code class="prettyprint">popup</code>. </td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojTabBar
   */

  // SubId Locators *****************************************************

  /**
   * <p>Sub-ID for the oj-tab-bar component's list item element.</p>
   *
   * <p>
   * To lookup the list items the locator object should have the following:
   * <ul>
   * <li><b>subId</b>: 'oj-tabbar-item'</li>
   * <li><b>key</b>: the <a href="#key-section">Key</a> of the item</li>
   * </ul>
   *
   * @ojsubid oj-tabbar-item
   * @memberof oj.ojTabBar
   *
   * @example <caption>Get the list item element with key 'foo':</caption>
   * var node = myTabBar.getNodeBySubId({'subId': 'oj-tabbar-item', 'key': 'foo'} );
   */
  /**
   * <p>Sub-ID for the oj-tab-bar items's removable icon.</p>
   *
   * <p>
   * To lookup the list items the locator object should have the following:
   * <ul>
   * <li><b>subId</b>: 'oj-tabbar-removable-icon'</li>
   * <li><b>key</b>: the key of the item</li>
   * </ul>
   *
   * @ojsubid oj-tabbar-item
   * @memberof oj.ojTabBar
   *
   * @example <caption>Get the remove icon of item with key 'foo':</caption>
   * var node = myTabBar.getNodeBySubId({'subId': 'oj-tabbar-removable-icon', 'key': 'foo'} );
   */

  // Node Context Objects *********************************************
  /**
   * <p>Context for the oj-tab-bar component's items.</p>
   *
   * @property {number} index the zero based item index
   * @property {Object|string} key the <a href="#key-section">Key</a> of the item
   *
   * @ojnodecontext oj-tabbar-item
   * @memberof oj.ojTabBar
   */

  /**
   * Handler for Expanded Navigation List
   * @constructor
   * @ignore
   */
  const DefaultNavListHandler = function (widget, root, component) {
    this.m_widget = widget;
    this.m_root = root;
    this.m_component = component;
    if (this.m_widget.GetOption(this.m_widget.OPTION_EDGE) === this.m_widget.OPTION_EDGE_END) {
      this.m_root.addClass(this.m_widget.getNavListEndEdgeStyleClass());
    }
  };
  oj._registerLegacyNamespaceProp('DefaultNavListHandler', DefaultNavListHandler);

  /**
   * Restore Listview element
   * @private
   */
  DefaultNavListHandler.prototype.Destroy = function () {
    this.m_root
      .removeClass(this.m_widget.getNavListExpandedStyleClass())
      .removeClass(this.m_widget.getNavListVerticalStyleClass())
      .removeClass(this.m_widget.getNavListEndEdgeStyleClass());
  };

  /**
   * Expand group Item
   * @param {jQuery} groupItem  Group Item
   * @param {boolean} animate true if animate the expand operation, false otherwise
   * @param {Event} event the event that triggers expand.  Note that event could be null in the case where this is programmatically done by the widget
   * @return {Promise} A Promise that resolves when expand animation completes
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.Expand = function (groupItem, animate, event) {
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
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.Collapse = function (item, key, animate, event) {
    return Promise.resolve(null);
  };

  /**
   * Handle keyboard events for expand and collapse
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.HandleExpandAndCollapseKeys =
    // eslint-disable-next-line no-unused-vars
    function (event, keyCode, current, currentItemKey) {
      return false;
    };

  /**
   * Mofify List item
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.ModifyListItem = function ($item, itemContent) {
    if (this.m_widget.isTabBar()) {
      var focusableElement = this.m_widget.getSingleFocusableElement($item);
      focusableElement.attr('role', 'tab');
    }
  };

  /**
   * Update aria properties when an item is selected.
   * @private
   */
  DefaultNavListHandler.prototype.UpdateAriaPropertiesOnSelectedItem = function (elem, highlight) {
    elem.attr('aria-selected', highlight ? 'true' : 'false');
  };

  /**
   * Placeholder to override or update generated dom after completing rendering
   * @private
   */
  DefaultNavListHandler.prototype.BeforeRenderComplete = function () {
    var role = this.m_widget.element.attr('role');
    if (role && role !== 'presentation') {
      this.m_widget.element.attr('role', 'presentation');
      if (!this.m_widget.isTabBar()) {
        this.m_root.attr('role', role);
      } else {
        this.m_root.attr('role', 'tablist');
      }
    }
  };

  /**
   * Called by content handler once the content of an item is rendered triggered by an insert event
   * @param {Element} elem the item element
   * @param {Object} context the context object used for the item
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.ItemInsertComplete = function (elem, context) {};

  /**
   * Called by content handler once the content of an item is removed triggered by an remove event
   * @param {Element} elem the item element
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.ItemRemoveComplete = function (elem) {};

  /**
   * Handles arrow keys navigation on item
   * @param {number} keyCode description
   * @param {boolean} isExtend
   * @param {Event} event the DOM event causing the arrow keys
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.HandleArrowKeys = function (keyCode, isExtend, event) {
    return _ojNavigationListView.superclass.HandleArrowKeys.apply(this.m_widget, arguments);
  };

  /**
   * Determine whether the key code is an arrow key
   * @param {number} keyCode
   * @return {boolean} true if it's an arrow key, false otherwise
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.IsArrowKey = function (keyCode) {
    return _ojNavigationListView.superclass.IsArrowKey.apply(this.m_widget, arguments);
  };

  /**
   * Determines whether the specified item is expanded
   * @param {jQuery} item the item element
   * @return {number} 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.GetState = function (item) {
    return _ojNavigationListView.superclass.GetState.apply(this.m_widget, arguments);
  };

  /**
   * Sets the disclosed state of the item
   * @param {jQuery} item the item element
   * @param {number} state 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.SetState = function (item, state) {
    _ojNavigationListView.superclass.SetState.apply(this.m_widget, arguments);
  };

  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.Init = function (opts) {
    this.m_root
      .addClass(this.m_widget.getNavListExpandedStyleClass())
      .addClass(this.m_widget.getNavListVerticalStyleClass());
  };

  /**
   * Check whether the item is selectable
   * @param {Element} item the item element
   * @return {boolean} true if item is selectable
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.IsSelectable = function (item) {
    return _ojNavigationListView.superclass.IsSelectable.apply(this.m_widget, arguments);
  };

  /**
   * Restore Item
   * @param {jQuery} item, List item
   * @param {jQuery} itemContent, Item contentelement
   * @param {jQuery} sublist, sub list when item is a group item.
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.RestoreItem = function (item, itemContent, sublist) {};

  /**
   * Invoked when an option was updated after component initialization.
   * Note: This will be invoked only for specifc options. see setOptions method in NavigationList.js.
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.SetOptions = function (options) {
    // DO Nothing
  };

  /**
   * Handler for blur event
   * @param {Event} event the blur event
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.HandleBlur = function (event) {
    return _ojNavigationListView.superclass.HandleBlur.apply(this.m_widget, arguments);
  };

  /**
   * Handler for focus event
   * @param {Event} event the focus event
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.HandleFocus = function (event) {
    return _ojNavigationListView.superclass.HandleFocus.apply(this.m_widget, arguments);
  };

  /**
   * Return node for the given subid
   * @param {Object} locator
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.GetNodeBySubId = function (locator) {
    return null;
  };

  /**
   * Return subid for the given node
   * @param {Element} node
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.GetSubIdByNode = function (node) {
    return null;
  };

  /**
   * Handle resize event
   * @param {number} width
   * @param {number} height
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.HandleResize = function (width, height) {};

  /**
   * Invoked when root node is attached
   * @protected
   */
  DefaultNavListHandler.prototype.NotifyAttached = function () {};

  /**
   * Return subid for the given node
   * @param {string} action
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.GetAnimationEffect = function (action) {
    return _ojNavigationListView.superclass.getAnimationEffect.apply(this.m_widget, arguments);
  };

  /**
   * Return true if option update allowed.
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.IsOptionUpdateAllowed = function (key, value, flags) {
    return true;
  };

  /**
   * Triggered when an option is updated
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.OptionUpdated = function (key, value, flags) {};
  /**
   * Invoked before inserting an item in to nav list
   * @protected
   */
  DefaultNavListHandler.prototype.BeforeInsertItem = function () {};

  /**
   * Invoked when click event fired
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.HandleClick = function (event) {};

  /**
   * Invoked when click event fired
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.HandleKeydown = function (event) {};
  /**
   * Invoked when item selection changed.
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  DefaultNavListHandler.prototype.HandleSelectionChange = function (item) {};

  /**
   * Handler for Collapsible Navigation List
   * @constructor
   * @extends DefaultNavListHandler
   * @ignore
   */
  const CollapsibleNavListHandler = function (widget, root, component) {
    CollapsibleNavListHandler.superclass.constructor.call(this, widget, root, component);
  };
  // Subclass from oj.Object
  oj.Object.createSubclass(
    CollapsibleNavListHandler,
    DefaultNavListHandler,
    'oj.CollapsibleNavListHandler'
  );

  oj._registerLegacyNamespaceProp('CollapsibleNavListHandler', CollapsibleNavListHandler);

  CollapsibleNavListHandler.prototype.Destroy = function () {
    this.m_root
      .removeClass(this.m_widget.getNavListCollapsibleStyleClass())
      .removeClass(this.m_widget.getNavListVerticalStyleClass());
  };

  // eslint-disable-next-line no-unused-vars
  CollapsibleNavListHandler.prototype.Init = function (opts) {
    this.m_root
      .addClass(this.m_widget.getNavListCollapsibleStyleClass())
      .addClass(this.m_widget.getNavListVerticalStyleClass());
  };

  // eslint-disable-next-line no-unused-vars
  CollapsibleNavListHandler.prototype.Expand = function (groupItem, animate, event) {
    return _ojNavigationListView.superclass.AnimateExpand.apply(this.m_widget, arguments);
  };

  // eslint-disable-next-line no-unused-vars
  CollapsibleNavListHandler.prototype.Collapse = function (item, key, animate, event) {
    return _ojNavigationListView.superclass.AnimateCollapse.apply(this.m_widget, arguments);
  };

  CollapsibleNavListHandler.prototype.HandleExpandAndCollapseKeys = function (
    event,
    keyCode,
    current,
    currentItemKey
  ) {
    var isGroupItem = current.children('.' + this.m_widget.getGroupStyleClass()).length > 0;
    if (keyCode === this.m_widget.LEFT_KEY || keyCode === this.m_widget.RIGHT_KEY) {
      // Need to reverse left/right functionality  in rtl case
      if (
        (keyCode === this.m_widget.LEFT_KEY && !this.m_widget.isRtl()) ||
        (keyCode === this.m_widget.RIGHT_KEY && this.m_widget.isRtl())
      ) {
        if (this.m_widget.GetState(current) === this.m_widget.STATE_EXPANDED) {
          this.m_widget.CollapseItem(current, event, true, currentItemKey, true, true);
        }
      } else if (this.m_widget.GetState(current) === this.m_widget.STATE_COLLAPSED) {
        this.m_widget.ExpandItem(current, event, true, currentItemKey, true, true, true);
      }
      return true;
    }

    if (isGroupItem && (keyCode === $.ui.keyCode.ENTER || keyCode === $.ui.keyCode.SPACE)) {
      if (current.length <= 0) {
        return false;
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

  const _ARIA_SELECTED = 'aria-selected';
  const _OJ_DEFAULT$1 = 'oj-default';

  /**
   * Handler for Horizontal Navigation List
   * @constructor
   * @extends DefaultNavListHandler
   * @ignore
   */

  const HorizontalNavListHandler = function (widget, root, component) {
    this.m_duringInit = true;
    HorizontalNavListHandler.superclass.constructor.call(this, widget, root, component);
    if (this.m_widget.GetOption(this.m_widget.OPTION_EDGE) === this.m_widget.OPTION_EDGE_BOTTOM) {
      this.m_root.addClass(this.m_widget.getNavListBottomEdgeStyleClass());
    }
  };

  // Subclass from oj.Object
  oj.Object.createSubclass(
    HorizontalNavListHandler,
    DefaultNavListHandler,
    'oj.HorizontalNavListHandler'
  );

  oj._registerLegacyNamespaceProp('HorizontalNavListHandler', HorizontalNavListHandler);

  HorizontalNavListHandler.prototype.Destroy = function () {
    this.m_root
      .removeClass(this.m_widget.getNavListExpandedStyleClass())
      .removeClass(this.m_widget.getHorizontalNavListStyleClass())
      .removeClass(this.m_widget.getNavListBottomEdgeStyleClass());
    this.m_root.find('.' + this.m_widget.getDividerStyleClass()).remove();

    this._destroyOverflowMenu();

    if (this.m_overflowMenuItem != null) {
      this.m_overflowMenuItem.remove();
      this.m_overflowMenuItem = null;
    }
    this.m_overflowMenuItems = [];
    this.m_duringInit = true;
  };

  HorizontalNavListHandler.prototype.UpdateAriaPropertiesOnSelectedItem = function (elem, highlight) {
    // prettier-ignore
    elem.attr( // @HTMLUpdateOK
      _ARIA_SELECTED,
      highlight ? 'true' : 'false'
    );
  };

  HorizontalNavListHandler.prototype._isTabBar = function () {
    return this.m_widget.isTabBar();
  };

  /**
   * Handles arrow keys navigation on item
   * @param {number} keyCode description
   * @param {boolean} isExtend
   * @param {Event} event the DOM event causing the arrow keys
   * @private
   */
  HorizontalNavListHandler.prototype.HandleArrowKeys = function (keyCode, isExtend, event) {
    // Change keyCode to reverse left/right arrow keys for rtl case.
    if (keyCode === 'ArrowLeft' || keyCode === 'Left' || keyCode === $.ui.keyCode.LEFT) {
      // eslint-disable-next-line no-param-reassign
      keyCode = this.m_widget.isRtl() ? $.ui.keyCode.DOWN : $.ui.keyCode.UP;
    } else if (keyCode === 'ArrowRight' || keyCode === 'Right' || keyCode === $.ui.keyCode.RIGHT) {
      // eslint-disable-next-line no-param-reassign
      keyCode = this.m_widget.isRtl() ? $.ui.keyCode.UP : $.ui.keyCode.DOWN;
    }

    var processed = _ojNavigationListView.superclass.HandleArrowKeys.call(
      this.m_widget,
      keyCode,
      isExtend,
      event
    );
    var current = this.m_widget.m_active.elem;
    if (
      !DataCollectionUtils.isElementIntersectingScrollerBounds(
        this.m_root[0],
        document.documentElement
      )
    ) {
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
  HorizontalNavListHandler.prototype.IsArrowKey = function (keyCode) {
    return (
      keyCode === 'ArrowUp' ||
      keyCode === 'Up' ||
      keyCode === this.m_widget.UP_KEY ||
      keyCode === 'ArrowDown' ||
      keyCode === 'Down' ||
      keyCode === this.m_widget.DOWN_KEY ||
      keyCode === 'ArrowLeft' ||
      keyCode === 'Left' ||
      keyCode === this.m_widget.LEFT_KEY ||
      keyCode === 'ArrowRight' ||
      keyCode === 'Right' ||
      keyCode === this.m_widget.RIGHT_KEY
    );
  };

  // eslint-disable-next-line no-unused-vars
  HorizontalNavListHandler.prototype.ModifyListItem = function ($item, itemContent) {
    var focusableElement = this.m_widget.getSingleFocusableElement($item);
    focusableElement.attr('role', 'tab');
  };

  HorizontalNavListHandler.prototype.BeforeRenderComplete = function () {
    var self = this;
    this.m_root.attr('role', 'tablist');
    this.m_widget.element.attr('role', 'presentation');

    if (this.m_widget.GetOption('layout') === 'condense') {
      if (!this.m_root.hasClass(this.m_widget.getCondenseStyleClass())) {
        this.m_root.addClass(this.m_widget.getCondenseStyleClass());
      }
    }
    var visibleItems = this.m_widget.element.find(
      '.' + this.m_widget.getItemElementStyleClass() + ':visible'
    );
    visibleItems.each(function (index) {
      var ele = $(this);
      if (index > 0) {
        self._addSeparator(this, index);
      }

      if (index === visibleItems.length - 1) {
        ele.addClass(self.m_widget.getLastItemStyleClass());
      } else {
        ele.removeClass(self.m_widget.getLastItemStyleClass());
      }
    });
    if (this.m_duringInit) {
      this.m_duringInit = false;
      this._handleOverflow();
    }
  };

  HorizontalNavListHandler.prototype._addSeparator = function (elem, index) {
    var $elem = $(elem);
    var previousElement = $elem.prev();
    if (
      index > 0 &&
      previousElement.length &&
      !previousElement.is('li.' + this.m_widget.getDividerStyleClass())
    ) {
      // prettier-ignore
      $elem.before( // @HTMLUpdateOK
        '<li role="separator" class="' + this.m_widget.getDividerStyleClass() + '"></li>'
      );
    }
  };

  HorizontalNavListHandler.prototype.ItemInsertComplete = function (elem, context) {
    this._addSeparator(elem, context.index);
    this._handleOverflow();
  };

  HorizontalNavListHandler.prototype.ItemRemoveComplete = function (elem) {
    var $elem = $(elem);
    var previousElement = $elem.prev();

    if (previousElement.length && previousElement.is('li.' + this.m_widget.getDividerStyleClass())) {
      previousElement.remove();
    } else {
      // Means,this could be the first element,
      // so ensure that divider is not present on next element which is going to be the first one.
      // This is needed because when complete observable array is updated with new set of records, first new records will be added before removing old ones.
      var nextElement = $elem.next();
      if (nextElement.is('li.' + this.m_widget.getDividerStyleClass())) {
        nextElement.remove();
      }
    }
    this._handleOverflow();
  };

  HorizontalNavListHandler.prototype.IsSelectable = function (item) {
    var itemSelectionMarkerAttr = _ARIA_SELECTED;
    return (
      !(this.m_overflowMenuItem && this.m_overflowMenuItem[0] === $(item)[0]) &&
      this.m_widget.getFocusItem($(item))[0].hasAttribute(itemSelectionMarkerAttr)
    );
  };

  // eslint-disable-next-line no-unused-vars
  HorizontalNavListHandler.prototype.Init = function (opts) {
    this.m_root
      .addClass(this.m_widget.getNavListExpandedStyleClass())
      .addClass(this.m_widget.getHorizontalNavListStyleClass());
    this.m_overflowMenuItems = [];
  };

  HorizontalNavListHandler.prototype.HandleClick = function (event) {
    if (
      $(event.target).closest(
        '.' +
          this.m_widget.getOverflowItemStyleClass() +
          ' a.' +
          this.m_widget.getItemContentStyleClass()
      ).length > 0
    ) {
      this._launchOverflowMenu(event);
    }
  };

  HorizontalNavListHandler.prototype.HandleKeydown = function (event) {
    if (
      $(event.target).closest(
        '.' +
          this.m_widget.getOverflowItemStyleClass() +
          ' a.' +
          this.m_widget.getItemContentStyleClass()
      ).length > 0
    ) {
      if (event.keyCode === $.ui.keyCode.SPACE) {
        this._launchOverflowMenu(event);
      }
    }
  };

  HorizontalNavListHandler.prototype.NotifyAttached = function () {
    this._handleOverflow();
  };

  // eslint-disable-next-line no-unused-vars
  HorizontalNavListHandler.prototype.HandleResize = function (width, height) {
    if (this.m_ignoreNextResize) {
      this.m_ignoreNextResize = false;
      return;
    }
    this._handleOverflow();
  };

  HorizontalNavListHandler.prototype.SetOptions = function (options) {
    var overflow;
    var truncation;
    var currentOverflow = this.m_widget.GetOption('overflow');
    var currentTruncation = this.m_widget.GetOption('truncation');

    if (options.overflow && currentOverflow !== options.overflow) {
      overflow = options.overflow;
    }
    if (options.truncation && currentTruncation !== options.truncation) {
      truncation = options.truncation;
    }
    if (overflow || truncation) {
      this._handleOverflow(overflow, truncation);
    }
  };

  HorizontalNavListHandler.prototype.HandleSelectionChange = function (item) {
    if (this.m_overflowMenuItem) {
      if (item != null && item.style.display === 'none') {
        this._highlightUnhighlightMoreItem(true);
      } else {
        this._highlightUnhighlightMoreItem(false);
      }
    }
  };

  HorizontalNavListHandler.prototype.GetAnimationEffect = function (action) {
    if (action === 'add' || action === 'remove') {
      return _ojNavigationListView.superclass.getAnimationEffect.call(
        this.m_widget,
        action + 'HorizontalItem'
      );
    }
    return _ojNavigationListView.superclass.getAnimationEffect.apply(this.m_widget, arguments);
  };

  HorizontalNavListHandler.prototype.GetNodeBySubId = function (locator) {
    var item = null;
    var subId = locator.subId;

    if (subId === this.m_widget.getItemSubIdKey() && this.m_overflowMenuItems.length > 0) {
      var overflowMenu = this._getOverflowMenu();
      var key = locator.key;
      var menuItems = overflowMenu.find('.oj-menu-item');

      for (var index = 0; index < menuItems.length; index++) {
        if (this.m_widget.compareValues($(menuItems[index]).data('key'), key)) {
          item = menuItems[index];
          this._launchOverflowMenu(null);
          break;
        }
      }
    }
    return item;
  };

  HorizontalNavListHandler.prototype.GetSubIdByNode = function (node) {
    var subId = null;
    var item = $(node).closest('.oj-menu-item');

    if (
      this._getOverflowMenu() !== null &&
      item.closest('.' + this.m_widget.getOverflowMenuStyleClass())[0] !== this._getOverflowMenu()[0]
    ) {
      return null;
    }

    if (item != null && item.length > 0) {
      var key = item.data('key');
      if (key != null) {
        subId = {
          subId: this.m_widget.getItemSubIdKey(),
          key: key
        };
      }
    }
    return subId;
  };

  // eslint-disable-next-line no-unused-vars
  HorizontalNavListHandler.prototype.OptionUpdated = function (key, value, flags) {
    if (key === 'selection') {
      this._toggleOverflowBtnSelection(value);
    }
  };

  // eslint-disable-next-line no-unused-vars
  HorizontalNavListHandler.prototype.IsOptionUpdateAllowed = function (key, value, flags) {
    if (key === 'currentItem') {
      if (this.m_overflowMenuItem && this.m_overflowMenuItem.attr('id') === value) {
        // ignore as this happens only for navigationlist more item and
        // we should not change currentItem
        return false;
      }
    }
    return true;
  };

  /**
   * Overflow handler for horizontal navigation list
   * @constructor
   * @ignore
   * @private
   */
  var _HorizontalNavListOverflowHandler = function (items, overflow, truncation, navlistHandler) {
    this._overflow = overflow;
    this._truncation = truncation;
    this._items = items;
    this._navlistHandler = navlistHandler;
  };

  /**
   * Handle overflow.
   * @param {string=} overflow optional overflow behaviour, if not specified component overflow option will be used.
   * @param {string=} truncation optional truncation behaviour, if not specified component truncation option will be used.
   */
  HorizontalNavListHandler.prototype._handleOverflow = function (overflow, truncation) {
    var threshold = -1;
    var items = this._getItems();

    // return if there are no items
    if (items.length === 0) {
      return;
    }

    if (!overflow) {
      // eslint-disable-next-line no-param-reassign
      overflow = this.m_widget.GetOption('overflow');
    }
    if (!truncation) {
      // eslint-disable-next-line no-param-reassign
      truncation = this.m_widget.GetOption('truncation');
    }

    var overflowHandler = new _HorizontalNavListOverflowHandler(items, overflow, truncation, this);

    // Return if there is no truncation or overflow handling needed
    if (!overflowHandler.shouldHandleOverflow()) {
      overflowHandler.unApplyTruncation();
      this._releaseContainerWidth();
      return;
    }

    this.showAllItems(items, overflow);
    overflowHandler.unApplyTruncation(); // unpply truncation if anything applied previously
    if (overflowHandler.checkForOverflow() && overflowHandler.applyTruncation()) {
      threshold = overflowHandler.getOverflowThreshold(); // caclulate threhsold only when it still overflow after truncation.
    }
    this._applyThreshold(threshold);
    this._releaseContainerWidth();
  };

  HorizontalNavListHandler.prototype.BeforeInsertItem = function () {
    this._fixContainerWidth();
  };

  HorizontalNavListHandler.prototype._fixContainerWidth = function () {
    var root = this.m_widget.getListContainer();
    var width = root[0].getBoundingClientRect().width;
    if (width !== 0) {
      // it will be 0 when there are no elements in the list.
      this.m_freezedContainerWidth = width;
      root.css('maxWidth', width);
    }
  };

  HorizontalNavListHandler.prototype._releaseContainerWidth = function () {
    var root = this.m_widget.getListContainer();
    root.css('maxWidth', 'none');

    if (this.m_freezedContainerWidth) {
      // Already applied truncation logic but still overflows
      // then no need to run overflow logic again, in case of conveyor belt this helps to show left/right buttons
      this.m_ignoreNextResize = true;
      this.m_freezedContainerWidth = null;
    }
  };

  HorizontalNavListHandler.prototype.showAllItems = function (items, overflow) {
    var self = this;
    // show all the items including overflow button
    if (overflow === 'popup') {
      this._showOrHideItem(this._getOverflowMenuButton(), true);
    }

    items.each(function (index, item) {
      self._showOrHideItem($(item), true);
    });
  };

  HorizontalNavListHandler.prototype._getItems = function () {
    return this.m_root.find(
      '.' +
        this.m_widget.getItemElementStyleClass() +
        ':not(.' +
        this.m_widget.getOverflowItemStyleClass() +
        ')'
    );
  };

  HorizontalNavListHandler.prototype._hasSeparators = function () {
    return this.m_root.hasClass(this.m_widget.getNavListItemsDividerStyleClass());
  };

  HorizontalNavListHandler.prototype._showOrHideItem = function (item, show) {
    var separator;
    if (this._hasSeparators()) {
      separator = item.prev('.' + this.m_widget.getDividerStyleClass());
    }
    if (show) {
      item.show();
      if (separator) {
        separator.show(); // show separator when hiding overflow item
      }
    } else {
      item.hide();
      if (separator) {
        separator.hide(); // hide separator when hiding item
      }
    }
  };

  HorizontalNavListHandler.prototype._applyThreshold = function (threshold) {
    var self = this;
    var items = this._getItems();
    var overflowMenuDataArray = [];
    var lastVisibleChild;
    var isOverflowItemVisible;

    if (items.length === 0) {
      return;
    }

    this.m_root
      .find('.' + this.m_widget.getLastItemStyleClass())
      .removeClass(this.m_widget.getLastItemStyleClass());

    if (threshold === -1 || threshold >= items.length) {
      if (this.m_overflowMenuItem) {
        // if overflow item is already added need to hide it
        this._showOrHideItem(this.m_overflowMenuItem, false);
      }
    } else {
      // As listview always inserts item using index means it will insert new item before index+1 item
      // some time it is possible that new item is inserted between overflow item  and it's separator,
      // so ensuring that separator is added if it's not already there.
      this._addSeparator(this._getOverflowMenuButton(), items.length);

      this._showOrHideItem(this._getOverflowMenuButton(), true);
      isOverflowItemVisible = true;
    }

    items.each(function (index, item) {
      var $item = $(item);
      if (threshold !== -1 && threshold <= index) {
        if ($item.hasClass('oj-focus')) {
          self.m_widget.ActiveAndFocus(self._getOverflowMenuButton(), null);
        }

        if ($item.hasClass('oj-selected')) {
          self._highlightUnhighlightMoreItem(true);
        }

        self._showOrHideItem($item, false);
        var overflowMenuData = {};
        overflowMenuDataArray.push(overflowMenuData);
        overflowMenuData.key = self.m_widget.GetKey(item);
        overflowMenuData.label = self._getItemLabel($item);
        if ($item.hasClass('oj-disabled')) {
          overflowMenuData.disabled = true;
        }
      } else {
        lastVisibleChild = $item;
        self._showOrHideItem($item, true);
        if ($item.hasClass('oj-selected') && self.m_overflowMenuItem) {
          self._highlightUnhighlightMoreItem(false);
        }
        if (
          self.m_overflowMenuItem &&
          self.m_overflowMenuItem.hasClass('oj-focus') &&
          self.m_widget.compareValues(
            self.m_widget.GetKey(item),
            self.m_widget.GetOption('currentItem')
          )
        ) {
          self.m_widget.ActiveAndFocus(lastVisibleChild, null);
        }
      }
    });

    if (isOverflowItemVisible) {
      this._getOverflowMenuButton().addClass(this.m_widget.getLastItemStyleClass());
    } else {
      lastVisibleChild.addClass(this.m_widget.getLastItemStyleClass());
    }

    this.m_overflowMenuItems = overflowMenuDataArray;
    this.m_widget.ClearCache();

    var isOverflowMenuVisible = this.m_overflowMenu && this.m_overflowMenu.is(':visible');
    this._destroyOverflowMenu();

    // launching sheetmenu some times make scrollbars visible which is triggering resize event.
    // So relaunching menu if it is already launched.
    if (isOverflowMenuVisible) {
      this._launchOverflowMenu(null);
    }
  };

  HorizontalNavListHandler.prototype._highlightUnhighlightMoreItem = function (highlight) {
    var overflowBtn = this._getOverflowMenuButton();
    if (highlight) {
      overflowBtn.addClass('oj-selected').removeClass(_OJ_DEFAULT$1);
    } else {
      overflowBtn.removeClass('oj-selected').addClass(_OJ_DEFAULT$1);
    }
  };

  HorizontalNavListHandler.prototype._destroyOverflowMenu = function () {
    if (this.m_overflowMenu) {
      this.m_overflowMenu.ojMenu('destroy');
      this.m_overflowMenu.remove();
      this.m_overflowMenu = null;
    }
  };

  HorizontalNavListHandler.prototype._getOverflowMenuButton = function () {
    if (!this.m_overflowMenuItem) {
      var overflowMenuItem = $(document.createElement('li'));
      var anchorElement = $(document.createElement('a'));
      var labelElement = $(document.createElement('span'));
      var iconElement = $(document.createElement('span'));
      var items = this._getItems();
      overflowMenuItem
        .uniqueId()
        .attr('role', 'presentation')
        .addClass(this.m_widget.getItemElementStyleClass())
        .addClass(this.m_widget.getItemStyleClass())
        .addClass(this.m_widget.getOverflowItemStyleClass())
        .addClass(_OJ_DEFAULT$1)
        .append(anchorElement); // @HTMLUpdateOK constructed by component and not using string passed through any API
      anchorElement
        .addClass(this.m_widget.getFocusedElementStyleClass())
        .addClass(this.m_widget.getItemContentStyleClass());
      anchorElement
        .attr('role', 'button')
        .attr('aria-haspopup', 'true')
        .attr(_ARIA_SELECTED, 'false') // @HTMLUpdateOK
        .attr('tabindex', '-1')
        .attr('href', '#')
        .append(iconElement) // @HTMLUpdateOK constructed by component and not using string passed through any API
        .append(labelElement); // @HTMLUpdateOK label text is read from resource bundle and it was properly escaped
      DataCollectionUtils.disableElement(anchorElement[0]);

      if (!this.m_root.find('ul:first').hasClass(this.m_widget.getHasIconsStyleClass())) {
        anchorElement.addClass(this.m_widget.getHasNoIconStyleClass());
      }

      labelElement
        .text(this.m_widget.ojContext.getTranslatedString('overflowItemLabel'))
        .addClass(this.m_widget.getItemLabelStyleClass());

      iconElement
        .addClass(this.m_widget.getItemIconStyleClass())
        .addClass('oj-fwk-icon')
        .addClass(this.m_widget.getOverflowItemIconStyleClass());

      overflowMenuItem[0].key = overflowMenuItem.attr('id');
      this.m_root.find('.' + this.m_widget.GetStyleClass()).append(overflowMenuItem); // @HTMLUpdateOK constructed by component and not using string passed through any API
      this._addSeparator(overflowMenuItem, items.length);
      this.m_overflowMenuItem = overflowMenuItem;
    }
    return this.m_overflowMenuItem;
  };

  HorizontalNavListHandler.prototype._getOverflowMenu = function () {
    var self = this;
    var data = this.m_overflowMenuItems;

    if (data.length === 0) {
      return null;
    }

    if (!this.m_overflowMenu) {
      var overflowMenu = $(document.createElement('ul'));
      overflowMenu.addClass(this.m_widget.getOverflowMenuStyleClass()).hide();
      this.m_root.append(overflowMenu); // @HTMLUpdateOK constructed by component and not using string passed through any API

      // create menu markup
      for (var i = 0; i < data.length; i++) {
        var menuListItem = $(document.createElement('li'));
        var menuItem = $(document.createElement('a'));

        menuItem.attr('href', '#').text(data[i].label);

        menuListItem.data('key', data[i].key);

        if (data[i].disabled) {
          menuListItem.addClass('oj-disabled');
        }

        menuListItem.append(menuItem); // @HTMLUpdateOK menuItem's label text is read from dataSource and it was properly escaped
        overflowMenu.append(menuListItem); // @HTMLUpdateOK constructed by component and not using string passed through any API
      }

      // initialize ojmenu
      overflowMenu.ojMenu({
        openOptions: {
          display: 'auto'
        },
        open: self.__handleOverflowMenuOpen.bind(self),
        close: self.__handleOverflowMenuClose.bind(self),
        select: self.__handleOverflowMenuSelection.bind(self)
      });
      this.m_overflowMenu = overflowMenu;
    }

    return this.m_overflowMenu;
  };

  HorizontalNavListHandler.prototype._launchOverflowMenu = function (event) {
    var self = this;

    if (this._getOverflowMenu().is(':visible')) {
      return; // ignore if overflow menu already launched
    }
    this._highlightUnhighlightMoreItem(true);
    this._getOverflowMenu().ojMenu('open', event, {
      launcher: self._getOverflowMenuButton(),
      initialFocus: 'firstItem',
      position: {
        my: 'end bottom',
        at: 'end top',
        collision: 'flipfit'
      }
    });
  };

  HorizontalNavListHandler.prototype._toggleOverflowBtnSelection = function (selectedItem) {
    var overflowItemSelected;
    if (this.m_overflowMenuItem && this.m_overflowMenuItems.length > 0) {
      if (selectedItem) {
        for (var i = 0; i < this.m_overflowMenuItems.length; i++) {
          if (this.m_widget.compareValues(this.m_overflowMenuItems[i].key, selectedItem)) {
            overflowItemSelected = true;
            break;
          }
        }
      }

      if (!overflowItemSelected) {
        this._highlightUnhighlightMoreItem(false);
      } else {
        // other items should not be visually selected since an overflow item is already selected
        const visibleItems = this.m_widget.element[0].querySelectorAll(
          '.' + this.m_widget.getItemElementStyleClass() + '.oj-selected'
        );
        for (let j = 0; j < visibleItems.length - 1; j++) {
          if (!this.m_widget.compareValues(visibleItems[j].key, selectedItem)) {
            visibleItems[j].classList.remove('oj-selected');
          }
        }
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  HorizontalNavListHandler.prototype.__handleOverflowMenuOpen = function (event) {
    this._getOverflowMenuButton()
      .find('.' + this.m_widget.getItemContentStyleClass())
      .attr('tabindex', '0');
  };

  // eslint-disable-next-line no-unused-vars
  HorizontalNavListHandler.prototype.__handleOverflowMenuClose = function (event) {
    var selectedItem = this.m_widget.ojContext.option('selection');
    this._toggleOverflowBtnSelection(selectedItem);
    this._getOverflowMenuButton()
      .find('.' + this.m_widget.getItemContentStyleClass())
      .focus();
  };

  HorizontalNavListHandler.prototype.__handleOverflowMenuSelection = function (event, ui) {
    var key = ui.item.data('key');
    var options = {
      selection: key
    };
    var item = this.m_widget.FindElementByKey(key);

    if (!this.m_widget.isTabBar()) {
      var previousKey = this.m_widget.GetOption('selection')[0];
      this.m_widget.FireSelectionAction(event, item, previousKey);
    }

    this.m_widget.HandleSelectionOption(options);
    var selectedItemKey = options.selection;
    if (selectedItemKey) {
      // trigger the optionChange event
      this.m_widget.SetOption('selection', selectedItemKey, {
        _context: {
          originalEvent: event,
          internalSet: true,
          extraData: {
            items: $(item)
          }
        },
        changed: true
      });
    }
  };

  HorizontalNavListHandler.prototype._getItemLabel = function (item) {
    var titleElement = item.find('.' + this.m_widget.getItemTitleStyleClass() + ':first');
    if (titleElement.length > 0) {
      return titleElement.text();
    }
    return item.find('.' + this.m_widget.getItemLabelStyleClass() + ':first').text();
  };

  _HorizontalNavListOverflowHandler.prototype._TEXT_WIDTH_KEY = 'textWidth';
  _HorizontalNavListOverflowHandler.prototype._ITEM_WIDTH_KEY = 'itemWidth';

  _HorizontalNavListOverflowHandler.prototype._getOverflowMenuButton = function () {
    return this._navlistHandler._getOverflowMenuButton();
  };

  _HorizontalNavListOverflowHandler.prototype._getWidget = function () {
    return this._navlistHandler.m_widget;
  };

  _HorizontalNavListOverflowHandler.prototype.shouldHandleOverflow = function () {
    return this._overflow === 'popup' || this._truncation === 'progressive';
  };

  _HorizontalNavListOverflowHandler.prototype.unApplyTruncation = function () {
    var self = this;
    this._items.each(function (index, item) {
      $(item)
        .find('.' + self._getWidget().getItemLabelStyleClass())
        .css('max-width', '');
    });
  };

  _HorizontalNavListOverflowHandler.prototype.checkForOverflow = function () {
    if (!this.shouldHandleOverflow()) {
      return false;
    }

    // Get overflow data together for performance
    if (!this._overflowData) {
      this._overflowData = this._collectOverflowData();
    }
    return this._isOverflowed(this._overflowData.containerEdgePos, this._overflowData.itemEdgePos, 0);
  };

  _HorizontalNavListOverflowHandler.prototype.applyTruncation = function () {
    // apply truncation
    if (this._truncation === 'progressive') {
      this._applyLabelMaxWidth(this._overflowData);
    }
    var item = this._items.last();
    var itemEdge =
      item[0].getBoundingClientRect()[DomUtils.getReadingDirection() === 'ltr' ? 'right' : 'left'];
    return this._isOverflowed(this._overflowData.containerEdgePos, itemEdge, 0);
  };

  _HorizontalNavListOverflowHandler.prototype.getOverflowThreshold = function () {
    var threshold = -1;
    if (this._overflow === 'popup') {
      threshold = this._calculateThreshold(this._overflowData) - 1;
    }
    return threshold;
  };

  _HorizontalNavListOverflowHandler.prototype._collectOverflowData = function () {
    var itemNonTextWidth;
    var overflowItemWidth;
    var edge = DomUtils.getReadingDirection() === 'ltr' ? 'right' : 'left';
    var container = this._getWidget().ojContext.element;

    var item = this._items.last();
    if (this._truncation === 'progressive') {
      this._calculateItemWidths();
      itemNonTextWidth = this._calculateItemNonTextWidth();
    }

    var edgePosition = container[0].getBoundingClientRect()[edge];
    var containerWidth = container[0].getBoundingClientRect().width;

    if (this._overflow === 'popup') {
      var overFlowMenuButton = this._getOverflowMenuButton()[0];
      var rect = overFlowMenuButton.getBoundingClientRect();
      let margin = 0;
      if (DomUtils.getReadingDirection() === 'ltr') {
        margin = window.getComputedStyle(overFlowMenuButton).marginRight;
      } else {
        margin = window.getComputedStyle(overFlowMenuButton).marginLeft;
      }
      overflowItemWidth = rect.width + parseInt(margin, 10);
    }
    var itemEdge = item[0].getBoundingClientRect()[edge];

    return {
      containerEdgePos: edgePosition,
      containerWidth: containerWidth,
      overflowItemWidth: overflowItemWidth,
      itemEdgePos: itemEdge,
      itemNonTextWidth: itemNonTextWidth
    };
  };

  _HorizontalNavListOverflowHandler.prototype._calculateItemWidths = function () {
    var self = this;
    var items = this._items;

    items.each(function (index, item) {
      var $item = $(item);
      var textWidth = $item
        .find('.' + self._getWidget().getItemLabelStyleClass())[0]
        .getBoundingClientRect().width;
      $item.data(self._TEXT_WIDTH_KEY, textWidth);
      $item.data(self._ITEM_WIDTH_KEY, item.getBoundingClientRect().width);
    });
  };

  _HorizontalNavListOverflowHandler.prototype._calculateItemNonTextWidth = function () {
    var items = this._items;
    var self = this;
    if (
      this._getWidget()
        .GetRootElement()
        .find('.' + this._getWidget().getHasIconsStyleClass()).lenght > 0
    ) {
      items = items.filter(function (index, item) {
        return $(item).find('.' + self._getWidget().getItemIconStyleClass()).length > 0;
      });
    }
    var itemsWithRemovable = items.filter(function (index, item) {
      return $(item).find('.' + self._getWidget().getRemovableStyleClass()).length > 0;
    });
    var pickItem =
      itemsWithRemovable && itemsWithRemovable.length > 0 ? itemsWithRemovable.last() : items.last();
    var textWidth = pickItem.data(self._TEXT_WIDTH_KEY);
    return pickItem.data(self._ITEM_WIDTH_KEY) - textWidth;
  };

  _HorizontalNavListOverflowHandler.prototype._isOverflowed = function (
    containerEdge,
    itemEdge,
    overflowItemWidth
  ) {
    var isLtr = DomUtils.getReadingDirection() === 'ltr';
    var _overflowItemWidth = overflowItemWidth || 0;
    if (isLtr) {
      // Even after using edge position, some times there is a fraction of pixel
      // difference which is being considered as overflow, so having 0.1 as buffer.
      return itemEdge - containerEdge + _overflowItemWidth > 0.1;
    }
    return containerEdge - itemEdge + _overflowItemWidth > 0.1;
  };

  _HorizontalNavListOverflowHandler.prototype._calculateThreshold = function (overflowData) {
    var items = this._items;
    var edge = DomUtils.getReadingDirection() === 'ltr' ? 'right' : 'left';
    var index = items.length - 1;
    var itemEdge = items[index].getBoundingClientRect()[edge];

    // Need to check for overflow including overflow item to avoid overflow item truncation.
    while (
      this._isOverflowed(overflowData.containerEdgePos, itemEdge, overflowData.overflowItemWidth) &&
      index > 0
    ) {
      index -= 1;
      itemEdge = items[index].getBoundingClientRect()[edge];
    }

    return index + 1;
  };

  _HorizontalNavListOverflowHandler.prototype._applyLabelMaxWidth = function (overflowData) {
    var items = this._items;
    var self = this;
    var minLabelWidth = this._getMinLabelWidth(this._items);
    var labelMaxWidth = overflowData.containerWidth / items.length - overflowData.itemNonTextWidth;

    if (labelMaxWidth < minLabelWidth) {
      labelMaxWidth = minLabelWidth; // use min width when it reaches threshold minimum
      // return; //Restore to original width when maxwidth reaches threshold minimum.
    }
    var surplusWidth = 0;
    var sumOfLongItemsWidth = 0;
    items.each(function (index, item) {
      var $item = $(item);
      var textWidth = $item.data(self._TEXT_WIDTH_KEY);
      if (textWidth < labelMaxWidth) {
        surplusWidth += labelMaxWidth - textWidth;
      } else {
        sumOfLongItemsWidth += textWidth;
      }
    });

    items.each(function (index, item) {
      var $item = $(item);
      var textWidth = $item.data(self._TEXT_WIDTH_KEY);
      var calcWidth = textWidth;
      if (textWidth > labelMaxWidth) {
        calcWidth = labelMaxWidth + (surplusWidth * textWidth) / sumOfLongItemsWidth;
      }
      $(item)
        .find('.' + self._getWidget().getItemLabelStyleClass())
        .css({ 'max-width': calcWidth + 'px' });
    });
  };

  _HorizontalNavListOverflowHandler.prototype._getMinLabelWidth = function (items) {
    var computedMinWidth = window
      .getComputedStyle(items.first().find('.' + this._getWidget().getItemLabelStyleClass())[0], null)
      .getPropertyValue('min-width');
    if (computedMinWidth.indexOf('px') > 0) {
      return parseInt(computedMinWidth.substring(0, computedMinWidth.length - 2), 10);
    }
    // This should never happen unless it was overriden intentionally
    return 0;
  };

  const _OJ_FOCUS_ANCESTOR = 'oj-focus-ancestor';
  const _ARIA_HIDDEN$1 = 'aria-hidden';
  const _ARIA_DESCRIBEDBY = 'aria-describedby';
  const _ARIA_EXPANDED = 'aria-expanded';
  const _OJ_NAV_HIER_BUTTON = 'oj-navigationlist-hierarchical-button';
  const _OJ_NAV_HIER_MENU = 'oj-navigationlist-hierarchical-menu';
  const _OJ_NAV_PREV_LINK = 'oj-navigationlist-previous-link';

  /**
   * Handler for Sliding Navigation List
   * @constructor
   * @extends CollapsibleNavListHandler
   * @ignore
   */
  const SlidingNavListHandler = function (widget, root, component) {
    SlidingNavListHandler.superclass.constructor.call(this, widget, root, component);
    // this keeps a stack of expanded items in top to bottom order
    this.m_expanded = [];
  };

  // Subclass from oj.Object
  oj.Object.createSubclass(
    SlidingNavListHandler,
    CollapsibleNavListHandler,
    'oj.SlidingNavListHandler'
  );

  oj._registerLegacyNamespaceProp('SlidingNavListHandler', SlidingNavListHandler);

  SlidingNavListHandler.prototype.Destroy = function () {
    this.m_root
      .removeClass('oj-navigationlist-slider')
      .removeClass(this.m_widget.getNavListVerticalStyleClass());
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
  SlidingNavListHandler.prototype._slideAnimation = function (
    item,
    isMovingNext,
    focusableElement,
    event,
    animationResolve
  ) {
    var self = this;
    var listRoot = this.m_widget.getListContainer();
    var hasFocusAncestor = listRoot.hasClass(_OJ_FOCUS_ANCESTOR);

    // After loading child items, listview tries to move focus to first visible
    // element, if there is no active element set. So, temporarily removing focus ancestor and
    // setting focus to first element after animation. This will avoid jittering in animation.
    if (hasFocusAncestor && isMovingNext) {
      listRoot.removeClass(_OJ_FOCUS_ANCESTOR);
    }

    var action = isMovingNext ? 'sliderExpand' : 'sliderCollapse';
    var promise = this.m_widget.StartAnimation(
      /** @type {Element} */ (listRoot.get(0)),
      action,
      this.m_widget.getAnimationEffect(action)
    );
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
  SlidingNavListHandler.prototype._slideAnimationComplete = function (
    item,
    isMovingNext,
    focusableElement,
    event,
    needFocusAncestor
  ) {
    if (this.m_widget.m_contentHandler === null) {
      return;
    }

    if (focusableElement) {
      if (needFocusAncestor) {
        this.m_widget.getListContainer().addClass(_OJ_FOCUS_ANCESTOR); // during animation oj-focus-ancestor is being removed due triggering of focusout event. probably this is due to hiding of element user clicked on.
      }
      if (event && event.button === 0) {
        this.m_widget.AvoidFocusHighLight(true);
      }
      if (focusableElement.length > 0) {
        this.m_widget.SetCurrentItem(focusableElement, event);
      }
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
  SlidingNavListHandler.prototype.Expand = function (groupItem, animate, event) {
    var animationResolve;
    var animationPromise = new Promise(function (resolve) {
      animationResolve = resolve;
    });

    var target = $(groupItem).parents('.oj-navigationlist-item-element:first');
    var sublist = target.children('.' + this.m_widget.getGroupStyleClass());
    var nextFocusableItem = null;

    var currentListRoot = target.closest('.' + this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
    if (currentListRoot.length > 0) {
      // Move marker style class to expanded node only when it is child of an already expanded node.
      // It is possible that child is expanded before parent, in which we need should not remove marker class from child.
      // Ref , During initialization, listview expands child before parent which is causing the issue.
      currentListRoot.removeClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
      target.addClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
      nextFocusableItem = sublist.find('.' + this.m_widget.getItemElementStyleClass() + ':eq(0)');
      this._updateHMenuOnExpand(target);
    }

    if (animate) {
      this._slideAnimation(target, true, nextFocusableItem, event, animationResolve);
    } else {
      this._slideAnimationComplete(target, true, nextFocusableItem, event, false);
      animationResolve(null);
    }

    // For ios, it is needed to set aria-hidden.
    target.siblings().attr(_ARIA_HIDDEN$1, 'true'); // @HTMLUpdateOK
    target
      .children('.' + this.m_widget.getGroupItemStyleClass())
      .children('.' + this.m_widget.getItemContentStyleClass())
      .attr(_ARIA_HIDDEN$1, 'true'); // @HTMLUpdateOK
    sublist.removeAttr(_ARIA_HIDDEN$1);

    // undo any display set by ListView
    groupItem.css('display', '');
    // Skip focus for group element
    target.addClass('oj-skipfocus');

    return animationPromise;
  };

  SlidingNavListHandler.prototype._updateHMenuOnExpand = function (target) {
    var listOfParents = target.parentsUntil(
      this.m_widget.element,
      '.' + this.m_widget.getItemElementStyleClass()
    );
    listOfParents = listOfParents.get().reverse(); // get list of parent nodes from top to bottom order
    listOfParents = $(listOfParents.concat(target));

    // clear the hierarchical menu items
    this.m_expanded = [];
    this._emptyHviewMenu();

    listOfParents.each(
      function (i, parentItem) {
        var parentLabel;
        if (i === 0) {
          // Use root label for the first item
          parentLabel = this.m_widget.getRootLabel();
        } else {
          parentLabel = this.m_widget.getItemLabel(this.m_expanded[i - 1]);
        }
        var itemNode = $(parentItem);
        this._addItemToHviewMenu(
          this.m_widget.GetKey(itemNode[0]),
          this.m_widget.getItemLabel(itemNode),
          parentLabel
        );
        this.m_expanded.push(itemNode);
      }.bind(this)
    );
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
  SlidingNavListHandler.prototype.Collapse = function (target, key, animate, event) {
    var animationResolve;
    var animationPromise = new Promise(function (resolve) {
      animationResolve = resolve;
    });

    var currentList = target.children('.' + this.m_widget.getGroupStyleClass());
    var parentlist = target.parent();

    target
      .children('.' + this.m_widget.getGroupItemStyleClass())
      .children('.' + this.m_widget.getItemContentStyleClass())
      .removeAttr(_ARIA_HIDDEN$1);
    currentList.attr(_ARIA_HIDDEN$1, 'true'); // @HTMLUpdateOK
    target.siblings().removeAttr(_ARIA_HIDDEN$1);

    // Enable focus for group element
    target.removeClass('oj-skipfocus');

    target.removeClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
    // While collapsing node, if any of parent is already having current style class then don't add again
    if (target.closest('.' + this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS).length === 0) {
      parentlist
        .closest('.' + this.m_widget.getItemElementStyleClass())
        .addClass(this.m_widget.SLIDING_NAVLIST_CURRENT_STYLE_CLASS);
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

    this._updateHMenuOnCollapse(key);

    return animationPromise;
  };

  SlidingNavListHandler.prototype._updateHMenuOnCollapse = function (key) {
    var collapsingItemIndex = -1;
    this.m_expanded.forEach(
      function (item, index) {
        var itemKey = this.m_widget.GetKey(item[0]);
        if (key === itemKey) {
          collapsingItemIndex = index;
        }
      }.bind(this)
    );
    // Remove all items under/after the collapsing item
    if (collapsingItemIndex > -1) {
      this.m_expanded.splice(collapsingItemIndex);
    }

    this._removeItemFromHviewMenu(key);
  };

  SlidingNavListHandler.prototype.UpdateAriaPropertiesOnSelectedItem = function (elem, highlight) {
    if (highlight) {
      elem.attr(_ARIA_DESCRIBEDBY, this._selectedLabelId); // @HTMLUpdateOK
    } else {
      elem.removeAttr(_ARIA_DESCRIBEDBY);
    }
  };
  /**
   * Determines whether the specified item is expanded
   * @param {jQuery} item the item element
   * @return {number} 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
   * @private
   */
  SlidingNavListHandler.prototype.GetState = function (item) {
    var expanded = this.m_widget.getFocusItem(item).attr(_ARIA_EXPANDED);
    if (expanded === 'true') {
      return this.m_widget.STATE_EXPANDED;
    }

    if (expanded === 'false') {
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
  SlidingNavListHandler.prototype.SetState = function (item, state) {
    if (state === this.m_widget.STATE_EXPANDED) {
      this.m_widget.getFocusItem(item).attr(_ARIA_EXPANDED, 'true'); // @HTMLUpdateOK
      item
        .removeClass(this.m_widget.COLLAPSED_STYLE_CLASS)
        .addClass(this.m_widget.EXPANDED_STYLE_CLASS);
    } else if (state === this.m_widget.STATE_COLLAPSED) {
      this.m_widget.getFocusItem(item).attr(_ARIA_EXPANDED, 'false'); // @HTMLUpdateOK
      item
        .removeClass(this.m_widget.EXPANDED_STYLE_CLASS)
        .addClass(this.m_widget.COLLAPSED_STYLE_CLASS);
    }
  };

  SlidingNavListHandler.prototype.ModifyListItem = function ($item, itemContent) {
    var focusableElement = this.m_widget.getFocusItem($item);
    $item.attr('role', 'presentation');
    focusableElement.attr('role', 'menuitem');
    if (!itemContent.attr('id')) {
      itemContent.uniqueId();
    }
    // JET:34729 remove aria-selected from menuitem elements, invalid tag for role menu
    focusableElement.removeAttr('aria-selected');

    // Ensure that it collapses all nodes.
    var groupItems = $item.children('.' + this.m_widget.getGroupStyleClass());
    if (groupItems.length > 0) {
      focusableElement.attr('aria-haspopup', 'true');
      groupItems.attr('role', 'menu');
      groupItems.css('display', '');
      $item.removeAttr(_ARIA_EXPANDED);
      focusableElement.attr(_ARIA_EXPANDED, 'false'); // @HTMLUpdateOK
    }
  };

  SlidingNavListHandler.prototype.BeforeRenderComplete = function () {
    this.m_root.attr('role', 'menu');
    this.m_widget.element.attr('role', 'presentation');
  };

  SlidingNavListHandler.prototype.Init = function (opts) {
    this.m_root
      .addClass('oj-navigationlist-slider')
      .addClass(this.m_widget.getNavListVerticalStyleClass());
    opts.element.addClass('oj-navigationlist-current');
    this._buildSlidingNavListHeader(opts);
    this._initializeHierarchicalView();
  };

  SlidingNavListHandler.prototype.HandleClick = function (event) {
    if (
      $(event.target).closest('.oj-navigationlist-previous-link, .oj-navigationlist-previous-button')
        .length > 0
    ) {
      this.CollapseCurrentList(event);
    }
  };

  SlidingNavListHandler.prototype.IsSelectable = function (item) {
    // Slider items don't have Aria-selected tag, overrding selction for slider navlist

    var itemSelectionMarkerAttr = 'aria-selected';
    var prevAnchorTag;
    var anchor = this.m_widget.getFocusItem($(item))[0];
    var collapseClass = this.m_widget.getCollapseIconStyleClass();
    prevAnchorTag = anchor.previousElementSibling;
    if (prevAnchorTag && prevAnchorTag.classList.contains(collapseClass)) {
      return false;
    }
    return (
      this.m_widget.getFocusItem($(item))[0].getAttribute('role') === 'menuitem' &&
      !this.m_widget.getFocusItem($(item))[0].hasAttribute(itemSelectionMarkerAttr)
    );
  };

  SlidingNavListHandler.prototype.HandleKeydown = function (event) {
    if (
      $(event.target).closest('.oj-navigationlist-previous-link, .oj-navigationlist-previous-button')
        .length > 0
    ) {
      if (event.keyCode === $.ui.keyCode.ENTER) {
        this.CollapseCurrentList(event);
      }
    }

    if ($(event.target).closest('.' + this.m_widget.GetStyleClass()).length > 0) {
      // check for default prevented as it might have already processed for quiting f2 mode
      if (event.keyCode === $.ui.keyCode.ESCAPE && !event.isDefaultPrevented()) {
        this.CollapseCurrentList(event);
      }
    }
  };
  /**
   * Initialize sliding navigation list header .
   * @private
   * @memberof! ojNavigationList
   */
  SlidingNavListHandler.prototype._buildSlidingNavListHeader = function (opts) {
    this._toolbar = $(document.createElement('div'));
    this._toolbar.addClass('oj-navigationlist-toolbar');
    this._previousLink = $(document.createElement('a'));
    this._prevButton = $(document.createElement('a'));
    this._prevButton.addClass('oj-navigationlist-previous-button');
    this._prevButton.css('visibility', 'hidden').attr('tabindex', '-1'); // @HTMLUpdateOK
    this._previousLink.addClass(_OJ_NAV_PREV_LINK).attr('tabindex', '-1'); // @HTMLUpdateOK
    this._headerLabel = $(document.createElement('label'));
    this._headerLabel.addClass('oj-navigationlist-current-header').text(this.m_widget.getRootLabel());
    this._vSeparator = $(document.createElement('span'));
    this._vSeparator
      .attr('role', 'separator') // @HTMLUpdateOK
      .attr('aria-orientation', 'vertical') // @HTMLUpdateOK
      .addClass('oj-navigationlist-toolbar-separator');
    this._hviewBtn = $(document.createElement('button'));
    this._hviewBtn.addClass(_OJ_NAV_HIER_BUTTON).attr('tabindex', '-1'); // @HTMLUpdateOK
    this._hviewMenu = $(document.createElement('ul'));
    this._hviewMenu.addClass(_OJ_NAV_HIER_MENU).hide();
    var selectedLabel = $(document.createElement('label'));
    selectedLabel.uniqueId().addClass('oj-helper-hidden-accessible').attr(_ARIA_HIDDEN$1, 'true'); // @HTMLUpdateOK
    this._selectedLabelId = selectedLabel.attr('id');
    selectedLabel.text(this.m_component.getTranslatedString('selectedLabel'));
    this._previousLink.append(this._headerLabel); // @HTMLUpdateOK
    this._toolbar.append(this._prevButton); // @HTMLUpdateOK
    this._toolbar
      .append(this._previousLink) // @HTMLUpdateOK
      .append(this._vSeparator) // @HTMLUpdateOK
      .append(this._hviewBtn) // @HTMLUpdateOK
      .append(this._hviewMenu) // @HTMLUpdateOK
      .append(selectedLabel); // @HTMLUpdateOK
    this.m_root.prepend(this._toolbar); // @HTMLUpdateOK
    this._showOrHideHierarchyMenu(opts.hierarchyMenuDisplayThresholdLevel);
  };

  /**
   * Collapses the current visible list if it is not the top level list
   * @private
   */
  SlidingNavListHandler.prototype.CollapseCurrentList = function (event) {
    // pop the expanded item stack
    var current = this.m_expanded[this.m_expanded.length - 1];
    if (current) {
      this.m_widget.CollapseItem(current, event, true, null, true, true);
    }
  };

  /**
   * Initialize hierarchical view for sliding navlist.
   * @private
   * @memberof! ojNavigationList
   */
  SlidingNavListHandler.prototype._initializeHierarchicalView = function () {
    var self = this;
    var menuid = this._hviewMenu.uniqueId().attr('id');
    this._hviewMenu.ojMenu({
      openOptions: {
        position: {
          my: 'end top',
          at: 'end bottom'
        }
      },
      select: function (event, ui) {
        var itemsToRemove = ui.item.nextAll();
        var expandedItems = self.m_expanded;
        var targetItemKey = ui.item.data('key');

        self.m_widget.signalTaskStart(); // signal method task start
        // collapse all child lists untill target list is visible
        while (expandedItems.length > 0) {
          var item = expandedItems[expandedItems.length - 1]; // remove item from list
          var currentKey = self.m_widget.GetKey(item[0]);
          self.m_widget.CollapseItem($(item), event, true, currentKey, true, true);
          if (self.m_widget.compareValues(targetItemKey, currentKey)) {
            break;
          }
        }
        itemsToRemove.remove();
        ui.item.remove();
        self._hviewMenu.ojMenu('refresh');
        self.m_widget.signalTaskEnd(); // signal method task end
      }
    });
    this._hviewBtn.ojButton({
      label: this.m_component.getTranslatedString('hierMenuBtnLabel'),
      display: 'icons',
      icons: {
        start: 'oj-fwk-icon oj-hier-icon'
      },
      menu: '#' + menuid,
      disabled: true,
      chroming: 'half'
    });
    this._prevButton.ojButton({
      label: this.m_component.getTranslatedString('previousIcon'),
      display: 'icons',
      icons: {
        start: 'oj-navigationlist-previous-icon oj-component-icon oj-clickable-icon-nocontext'
      },
      chroming: 'half'
    });
  };

  /**
   * Empty hierarchical menu items.
   * @private
   */
  SlidingNavListHandler.prototype._emptyHviewMenu = function () {
    if (this._hviewMenu) {
      var menuItems = this._hviewMenu.find('li');
      menuItems.remove();
    }
  };

  /**
   * Add current visible group item to hierarchical menu and update header text with new list's label.
   * @param {string} itemKey key of the group item whose list will be displayed
   * @param {string} label current list's label
   * @param {string} parentLabel parent list's label
   * @private
   */
  SlidingNavListHandler.prototype._addItemToHviewMenu = function (itemKey, label, parentLabel) {
    var i;
    if (this._hviewBtn) {
      var itemsinTree = this._hviewMenu.find('li').length;
      var menuListItem = $(document.createElement('li'));
      var menuItem = $(document.createElement('a'));
      menuItem.attr('href', '#'); // @HTMLUpdateOK
      menuListItem.append(menuItem); // @HTMLUpdateOK
      if (itemsinTree > 0) {
        for (i = 0; i < itemsinTree; i++) {
          if (i > 0) {
            // prettier-ignore
            menuItem.append( // @HTMLUpdateOK
              $(document.createElement('span')).addClass('oj-navigationlist-hvitem-space')
            );
          }
        }
        // prettier-ignore
        menuItem.append( // @HTMLUpdateOK
          $(document.createElement('span')).addClass(
            'oj-menu-item-icon oj-icon oj-navigationlist-level-indicator'
          )
        );
      }
      var menuItemLabel = $(document.createElement('span')).addClass(
        'oj-navigationlist-hierarchical-menu-label'
      );
      menuItemLabel.text(parentLabel);
      menuItem.append(menuItemLabel); // @HTMLUpdateOK

      // Store item key reference to refresh the list when user clicks on  hiearchical menu item.
      menuListItem.data('key', itemKey);
      this._hviewMenu.append(menuListItem); // @HTMLUpdateOK

      this._hviewMenu.ojMenu('refresh');
      this._showOrHideHierarchyMenu(this.m_widget.GetOption('hierarchyMenuDisplayThresholdLevel'));
      this._hviewBtn.ojButton('option', 'disabled', false);
      this._prevButton.css('visibility', 'visible');
      if (this.m_widget.getListContainer().hasClass(_OJ_FOCUS_ANCESTOR)) {
        this._prevButton.attr('tabindex', '0'); // @HTMLUpdateOK
      }
      this._headerLabel.text(label);
    }
  };

  SlidingNavListHandler.prototype.SetOptions = function (options) {
    if (options.hierarchyMenuDisplayThresholdLevel === undefined) {
      return;
    }

    var currentHMenuDisplayThreshold = this.m_widget.GetOption('hierarchyMenuDisplayThresholdLevel');
    if (currentHMenuDisplayThreshold !== options.hierarchyMenuDisplayThresholdLevel) {
      this._showOrHideHierarchyMenu(options.hierarchyMenuDisplayThresholdLevel);
    }
  };

  SlidingNavListHandler.prototype._showOrHideHierarchyMenu = function (
    hierarchyMenuDisplayThresholdLevel
  ) {
    var itemsinTree = this._hviewMenu.find('li').length;
    if (
      hierarchyMenuDisplayThresholdLevel === -1 ||
      itemsinTree < hierarchyMenuDisplayThresholdLevel
    ) {
      this._vSeparator.css('visibility', 'hidden');
      if (this._hviewBtn[0] === document.activeElement) {
        // is(:focus) failing during test cases so using document.activeElement.
        // tried by moving focus to <ul> using  this.m_widget.focus() but listview listen for focusin event.
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
  SlidingNavListHandler.prototype._removeItemFromHviewMenu = function (key) {
    if (this._hviewBtn) {
      var menuItems = this._hviewMenu.find('li');
      var removeAfter;
      var restoreLabel;
      menuItems.each(function (index, item) {
        var $item = $(item);
        if ($item.data('key') === key) {
          $item.remove();
          restoreLabel = $item.children('a').text();
          removeAfter = true;
        } else if (removeAfter) {
          $item.remove();
        }
      });
      this._hviewMenu.ojMenu('refresh');
      this._showOrHideHierarchyMenu(this.m_widget.GetOption('hierarchyMenuDisplayThresholdLevel'));
      if (this._hviewMenu.children('li').length === 0) {
        this._hviewBtn.ojButton('option', 'disabled', true);
        this._prevButton.css('visibility', 'hidden');
        this._prevButton.attr('tabindex', '-1'); // @HTMLUpdateOK
        this._headerLabel.text(this.m_widget.getRootLabel());
      } else {
        this._headerLabel.text(restoreLabel);
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  SlidingNavListHandler.prototype.RestoreItem = function (item, itemContent, sublist) {
    itemContent
      .removeAttr('role')
      .removeAttr(_ARIA_EXPANDED)
      .removeAttr(_ARIA_DESCRIBEDBY)
      .removeAttr(_ARIA_HIDDEN$1);
  };

  SlidingNavListHandler.prototype._makeToolbarItemsFocusable = function (enable) {
    if (enable) {
      var itemsinTree = this._hviewMenu.find('li').length;
      if (itemsinTree) {
        this._prevButton.attr('tabindex', '0');
      }
      this._hviewBtn.attr('tabindex', '0');
    } else {
      this._prevButton.attr('tabindex', '-1');
      this._hviewBtn.attr('tabindex', '-1');
    }
  };

  /**
   * Handler for focus event
   * @param {Event} event the focus event
   * @protected
   * @override
   */
  SlidingNavListHandler.prototype.HandleFocus = function (event) {
    // If focus is on navlist or items but not on toolbar
    if (
      !(
        $.contains(this._toolbar.get(0), /** @type {Element} */ (event.target)) ||
        this._hviewMenu.get(0) === /** @type {Element} */ (event.relatedTarget)
      )
    ) {
      // make toolbar items focusable
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
  SlidingNavListHandler.prototype.HandleBlur = function (event) {
    // If focus going to toolbar remove focus ancestor and unhighlight the active one
    if (
      $.contains(this._toolbar.get(0), /** @type {Element} */ (event.relatedTarget)) ||
      this._hviewMenu.get(0) === /** @type {Element} */ (event.relatedTarget)
    ) {
      this.m_widget.UnhighlightActive();
    } else {
      // if focus moves out side navlist make toolbar items not focusable
      if (
        event.relatedTarget == null ||
        !$.contains(this.m_root.get(0), /** @type {Element} */ (event.relatedTarget))
      ) {
        this._makeToolbarItemsFocusable(false);
      }
      _ojNavigationListView.superclass.HandleBlur.apply(this.m_widget, arguments);
    }
  };

  SlidingNavListHandler.prototype.GetNodeBySubId = function (locator) {
    if (locator.subId === _OJ_NAV_PREV_LINK) {
      return this._prevButton ? this._prevButton[0] : null;
    }

    if (locator.subId === _OJ_NAV_HIER_BUTTON) {
      return this._hviewBtn ? this._hviewBtn[0] : null;
    }

    if (locator.subId === _OJ_NAV_HIER_MENU) {
      return this._hviewMenu ? this._hviewMenu[0] : null;
    }

    return null;
  };

  SlidingNavListHandler.prototype.GetSubIdByNode = function (node) {
    if ($(node).closest(this._prevButton).length > 0) {
      return {
        subId: _OJ_NAV_PREV_LINK
      };
    }

    if ($(node).closest(this._hviewBtn).length > 0) {
      return {
        subId: _OJ_NAV_HIER_BUTTON
      };
    }

    if ($(node).closest(this._hviewMenu).length > 0) {
      return {
        subId: _OJ_NAV_HIER_MENU
      };
    }

    return null;
  };

});
