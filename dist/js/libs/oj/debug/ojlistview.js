/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['require', 'ojs/ojcore-base', 'jquery', 'ojs/ojcustomelement', 'ojs/ojdataproviderscroller', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojdatacollection-common', 'ojs/ojanimation', 'ojs/ojlogger', 'ojs/ojkeyset', 'ojs/ojmap', 'ojs/ojdomutils', 'ojs/ojdataprovideradapter', 'ojs/ojcustomelement-utils', 'ojs/ojkeyboardfocus-utils', 'ojs/ojindexer'], function (require, oj, $, ojcustomelement, DataProviderScroller, Context, Config, ThemeUtils, Components, DataCollectionUtils, AnimationUtils, Logger, ojkeyset, KeyMap, DomUtils, ojdataprovideradapter, ojcustomelementUtils, ojkeyboardfocusUtils, ojindexer) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) { return e; } else {
      var n = {};
      if (e) {
        Object.keys(e).forEach(function (k) {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        });
      }
      n['default'] = e;
      return n;
    }
  }

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  KeyMap = KeyMap && Object.prototype.hasOwnProperty.call(KeyMap, 'default') ? KeyMap['default'] : KeyMap;

  (function () {
var __oj_list_view_metadata = 
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
        "card",
        "list"
      ],
      "value": "list"
    },
    "dnd": {
      "type": "object",
      "properties": {
        "drag": {
          "type": "object",
          "properties": {
            "items": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "drag": {
                  "type": "function"
                },
                "dragEnd": {
                  "type": "function"
                },
                "dragStart": {
                  "type": "function"
                }
              }
            }
          }
        },
        "drop": {
          "type": "object",
          "properties": {
            "items": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragEnter": {
                  "type": "function"
                },
                "dragLeave": {
                  "type": "function"
                },
                "dragOver": {
                  "type": "function"
                },
                "drop": {
                  "type": "function"
                }
              }
            }
          }
        },
        "reorder": {
          "type": "object",
          "properties": {
            "items": {
              "type": "string",
              "enumValues": [
                "disabled",
                "enabled"
              ],
              "value": "disabled"
            }
          }
        }
      }
    },
    "drillMode": {
      "type": "string",
      "enumValues": [
        "collapsible",
        "none"
      ],
      "value": "collapsible"
    },
    "expanded": {
      "type": "KeySet",
      "writeback": true
    },
    "firstSelectedItem": {
      "type": "object",
      "writeback": true,
      "readOnly": true,
      "value": {
        "key": null,
        "data": null
      }
    },
    "gridlines": {
      "type": "object",
      "properties": {
        "item": {
          "type": "string",
          "enumValues": [
            "hidden",
            "visible",
            "visibleExceptLast"
          ],
          "value": "visible"
        }
      }
    },
    "groupHeaderPosition": {
      "type": "string",
      "enumValues": [
        "static",
        "sticky"
      ],
      "value": "sticky"
    },
    "item": {
      "type": "object",
      "properties": {
        "focusable": {
          "type": "boolean|function",
          "value": true
        },
        "renderer": {
          "type": "function"
        },
        "selectable": {
          "type": "boolean|function",
          "value": true
        }
      }
    },
    "scrollPolicy": {
      "type": "string",
      "enumValues": [
        "auto",
        "loadAll",
        "loadMoreOnScroll"
      ],
      "value": "auto"
    },
    "scrollPolicyOptions": {
      "type": "Object<string, number>",
      "properties": {
        "fetchSize": {
          "type": "number",
          "value": 25
        },
        "maxCount": {
          "type": "number",
          "value": 500
        },
        "scroller": {
          "type": "Element|string"
        }
      }
    },
    "scrollPosition": {
      "type": "object",
      "writeback": true,
      "value": {
        "x": 0,
        "y": 0
      },
      "properties": {
        "index": {
          "type": "number"
        },
        "key": {
          "type": "any"
        },
        "offsetX": {
          "type": "number"
        },
        "offsetY": {
          "type": "number"
        },
        "parent": {
          "type": "any"
        },
        "x": {
          "type": "number"
        },
        "y": {
          "type": "number"
        }
      }
    },
    "scrollToKey": {
      "type": "string",
      "enumValues": [
        "always",
        "auto",
        "capability",
        "never"
      ],
      "value": "auto"
    },
    "selected": {
      "type": "KeySet",
      "writeback": true
    },
    "selection": {
      "type": "Array<any>",
      "writeback": true,
      "value": []
    },
    "selectionMode": {
      "type": "string",
      "enumValues": [
        "multiple",
        "none",
        "single"
      ],
      "value": "none"
    },
    "selectionRequired": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleExpandCollapseInstructionText": {
          "type": "string"
        },
        "accessibleGroupCollapse": {
          "type": "string"
        },
        "accessibleGroupExpand": {
          "type": "string"
        },
        "accessibleNavigateSkipItems": {
          "type": "string"
        },
        "accessibleReorderAfterItem": {
          "type": "string"
        },
        "accessibleReorderBeforeItem": {
          "type": "string"
        },
        "accessibleReorderInsideItem": {
          "type": "string"
        },
        "accessibleReorderTouchInstructionText": {
          "type": "string"
        },
        "indexerCharacters": {
          "type": "string"
        },
        "labelCopy": {
          "type": "string"
        },
        "labelCut": {
          "type": "string"
        },
        "labelPaste": {
          "type": "string"
        },
        "labelPasteAfter": {
          "type": "string"
        },
        "labelPasteBefore": {
          "type": "string"
        },
        "msgFetchCompleted": {
          "type": "string"
        },
        "msgFetchingData": {
          "type": "string"
        },
        "msgItemsAppended": {
          "type": "string"
        },
        "msgNoData": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getContextByNode": {},
    "getDataForVisibleItem": {},
    "getIndexerModel": {},
    "getProperty": {},
    "refresh": {},
    "scrollToItem": {},
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
    "ojCollapse": {},
    "ojCopy": {},
    "ojCut": {},
    "ojExpand": {},
    "ojItemAction": {},
    "ojPaste": {},
    "ojReorder": {}
  },
  "extension": {}
};
    __oj_list_view_metadata.extension._WIDGET_NAME = 'ojListView';
    __oj_list_view_metadata.extension._INNER_ELEM = 'ul';
    __oj_list_view_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['aria-label', 'aria-labelledby'];
    oj.CustomElementBridge.register('oj-list-view', { metadata: __oj_list_view_metadata });
  })();

  /**
   * Handler for static HTML content
   * @constructor
   * @ignore
   */
  const StaticContentHandler = function (widget, root) {
    this.m_widget = widget;
    this.m_root = root;
  };

  // Subclass from oj.Object
  oj._registerLegacyNamespaceProp('StaticContentHandler', StaticContentHandler);
  oj.Object.createSubclass(StaticContentHandler, oj.Object, 'oj.StaticContentHandler');

  /**
   * Initializes the instance.
   * @protected
   */
  StaticContentHandler.prototype.Init = function () {
    StaticContentHandler.superclass.Init.call(this);
  };

  /**
   * Destroy the content handler
   * @protected
   */
  StaticContentHandler.prototype.Destroy = function () {
    // check if it's been destroyed or in process
    if (!this.m_root.hasAttribute('role')) {
      return;
    }

    this.restoreContent(this.m_root, 0);
    this.unsetRootAriaProperties();
  };

  /**
   * Determine whether the content handler is ready
   * @return {boolean} returns true there's no outstanding request, false otherwise.
   * @protected
   */
  StaticContentHandler.prototype.IsReady = function () {
    // static content does not fetch
    return true;
  };

  StaticContentHandler.prototype.notifyShown = function () {
    // do nothing since all items are present
  };

  StaticContentHandler.prototype.notifyAttached = function () {
    // do nothing since all items are present
  };

  StaticContentHandler.prototype.RenderContent = function () {
    var root = this.m_root;
    if (
      this.shouldUseGridRole() &&
      this.isCardLayout() &&
      !this.IsHierarchical() &&
      $(root).children('li').length > 0
    ) {
      // in card layout, this is going to be a single row, N columns grid
      // so we'll need to wrap all <li> within a row
      // prettier-ignore
      $(this.m_root)
        .children()
        .wrapAll( // @HTMLUpdateOK
          "<li role='presentation'><ul role='row' class='" +
            this.m_widget.getGroupStyleClass() +
            "'></ul></li>"
        );
      var wrapped = $(this.m_root).children('li').first().get(0);
      wrapped.style.width = '100%';
      wrapped.classList.add('oj-listview-group-container');
      root = wrapped.firstElementChild;
    }
    this.modifyContent(root, 0);
    this.setRootAriaProperties();
    this.m_widget.renderComplete(false);

    var self = this;
    var busyContext = Context.getContext(root).getBusyContext();
    busyContext.whenReady().then(function () {
      if (root != null) {
        var children = $(root).find('li.' + self.m_widget.getItemElementStyleClass());
        for (var i = 0; i < children.length; i++) {
          self.m_widget.disableAllTabbableElements(children[i]);
        }
      }
    });
  };

  StaticContentHandler.prototype.Expand = function (item, successCallback) {
    var selector = '.' + this.m_widget.getGroupStyleClass();
    var groupItem = $(item).children(selector)[0];
    $(groupItem).css('display', '');

    successCallback.call(null, groupItem);
  };

  StaticContentHandler.prototype.Collapse = function (item) {
    var groupItem = item.get(0);
    groupItem.style.display = 'none';
  };

  StaticContentHandler.prototype.IsHierarchical = function () {
    if (this.m_hier == null) {
      this.m_hier = $(this.m_root).children('li').children('ul').length > 0;
    }
    return this.m_hier;
  };

  /**
   * Restore the static content into its original format by removing all ListView specific style classes and attributes.
   * @param {Element} elem the element it is currently restoring
   * @param {number} depth the depth of the element it is currently restoring
   * @private
   */
  StaticContentHandler.prototype.restoreContent = function (elem, depth) {
    var groupStyleClass = this.m_widget.getGroupStyleClass();
    var groupCollapseStyleClass = this.m_widget.getGroupCollapseStyleClass();
    var groupExpandStyleClass = this.m_widget.getGroupExpandStyleClass();
    var groupItemStyleClass = this.m_widget.getGroupItemStyleClass();
    var itemStyleClass = this.m_widget.getItemStyleClass();
    var itemElementStyleClass = this.m_widget.getItemElementStyleClass();
    var itemLayoutStyleClass = null;
    if (this.m_widget.getItemLayoutStyleClass) {
      itemLayoutStyleClass = this.m_widget.getItemLayoutStyleClass();
    }

    var firstChild = elem.firstElementChild;
    if (firstChild && firstChild.classList.contains('oj-listview-group-container')) {
      $(firstChild).children().unwrap().children().unwrap();
    }

    var items = elem.children;
    for (var i = 0; i < items.length; i++) {
      var item = $(items[i]);
      // skip children that are not modified, this could happen if ko:foreach backed by an observable array is used to generate
      // the content, and the observable array has changed
      if (item.hasClass(itemElementStyleClass)) {
        this.unsetAriaProperties(item.get(0));
        if (item.hasClass('oj-listview-card')) {
          item.removeClass('oj-listview-card').removeClass('oj-listview-card-animated');
          item[0].style.opacity = 'unset';
          item[0].style.transform = 'unset';
        }
        item
          .removeClass(itemElementStyleClass)
          .removeClass(itemStyleClass)
          .removeClass(itemLayoutStyleClass)
          .removeClass(this.m_widget.getDepthStyleClass(depth))
          .removeClass('gridline-hidden')
          .removeClass('oj-listview-item')
          .removeClass('oj-listview-item-element')
          .removeClass('oj-skipfocus')
          .removeClass('oj-focus')
          .removeClass('oj-hover')
          .removeClass('oj-expanded')
          .removeClass('oj-collapsed')
          .removeClass('oj-selected');

        var groupItems = item.children('ul');
        if (groupItems.length > 0) {
          item
            .children('.' + groupItemStyleClass)
            .children()
            .unwrap();
          if (this.shouldUseGridRole()) {
            this.unsetGroupAriaProperties(item);
          }
          item.children('.oj-component-icon').remove();

          var groupItem = $(groupItems[0]);
          groupItem
            .removeClass(groupStyleClass)
            .removeClass(groupExpandStyleClass)
            .removeClass(groupCollapseStyleClass)
            .removeAttr('role');
          this.restoreContent(groupItem[0], depth + 1);
        }
      }
    }
  };

  /**
   * Modify the static content to include ListView specific style classes and attributes.
   * @param {Element} elem the element it is currently modifying
   * @param {number} depth the depth of the element it is currently modifying
   * @private
   */
  StaticContentHandler.prototype.modifyContent = function (elem, depth) {
    var itemStyleClass = this.m_widget.getItemStyleClass();
    var itemElementStyleClass = this.m_widget.getItemElementStyleClass();
    var groupStyleClass = this.m_widget.getGroupStyleClass();
    var groupItemStyleClass = this.m_widget.getGroupItemStyleClass(true);
    var groupCollapseStyleClass = this.m_widget.getGroupCollapseStyleClass();
    var collapseClass = this.m_widget.getCollapseIconStyleClass();
    var focusedElementStyleClass = this.m_widget.getFocusedElementStyleClass();

    var items = elem.children;
    var expandable = this.m_widget.isExpandable();

    for (var i = 0; i < items.length; i++) {
      var item = $(items[i]);
      var context = this.createContext(item);

      this.setAriaProperties(item, context);

      item.uniqueId().addClass(itemElementStyleClass);
      if (depth > 0) {
        item.addClass(this.m_widget.getDepthStyleClass(depth));
      }

      // tag it if item is not focusable
      if (!this.isFocusable(context)) {
        item.addClass('oj-skipfocus');
      }

      var groupItems = item.children('ul');
      if (groupItems.length > 0) {
        this.m_hier = true;

        item.children(':not(ul)').wrapAll('<div></div>'); // @HTMLUpdateOK

        var content = item.children().first();
        content.addClass(groupItemStyleClass);

        var count = this.getItemsCount(groupItems[0]);
        if (count > 0) {
          if (item.hasClass(focusedElementStyleClass)) {
            item.removeClass(focusedElementStyleClass);
            content.addClass(focusedElementStyleClass).attr('aria-expanded', 'false');
          } else {
            content.attr('role', 'presentation');
            content.find('.' + focusedElementStyleClass).attr('aria-expanded', 'false');
          }

          // add the expand icon
          if (expandable) {
            item.addClass('oj-collapsed');

            content.uniqueId();

            // add the expand icon
            var icon = document.createElement('a');
            $(icon)
              .attr('role', 'button')
              .attr('aria-labelledby', content.get(0).id)
              .addClass('oj-component-icon oj-clickable-icon-nocontext')
              .addClass(collapseClass);

            content.prepend(icon); // @HTMLUpdateOK
          }
        } else {
          content.addClass('oj-empty');
        }

        if (this.shouldUseGridRole()) {
          this.setGroupAriaProperties(content, count);
        }

        var groupItem = $(groupItems[0]);
        var role;
        if (this.shouldUseGridRole()) {
          if (this.isCardLayout()) {
            role = 'row';
          } else {
            role = 'presentation';
          }
        } else {
          role = 'group';
        }
        groupItem
          .addClass(groupStyleClass)
          .addClass(groupCollapseStyleClass)
          .attr('role', role)
          .css('display', 'none');
        this.modifyContent(groupItem[0], depth + 1);
      } else {
        item.addClass(itemStyleClass);
      }

      if (this.m_widget._isSelectionEnabled() && this.isSelectable(context)) {
        this.m_widget.getFocusItem(item).attr('aria-selected', false);
      }

      this.m_widget.itemRenderComplete(item[0], context);
    }
  };

  /**
   * @private
   */
  StaticContentHandler.prototype.setRootAriaProperties = function () {
    if (this.shouldUseGridRole()) {
      this.m_root.setAttribute('role', 'grid');
    } else if (this.IsHierarchical()) {
      this.m_root.setAttribute('role', 'tree');
    } else {
      this.m_root.setAttribute('role', 'listbox');
    }
  };

  /**
   * @private
   */
  StaticContentHandler.prototype.unsetRootAriaProperties = function () {
    this.m_root.removeAttribute('role');
  };

  /**
   * @private
   */
  StaticContentHandler.prototype.getItemsCount = function (item) {
    return $(item).children('li').length;
  };

  /**
   * Creates the object with context information for the specified item
   * @param {jQuery} item the item to create context info object for
   * @return {Object} the context object
   * @private
   */
  StaticContentHandler.prototype.createContext = function (item) {
    var context = {};
    context.key = item.attr('id');
    context.parentElement = item.children().first()[0];
    context.index = item.index();
    context.data = item[0];
    context.component = this.m_widget.getWidgetConstructor();
    context = this.m_widget._FixRendererContext(context);

    // additional context info for hierarhical data
    if (this.IsHierarchical()) {
      context.leaf = item.children('ul').length === 0;
      var parents = item.parents('li.' + this.m_widget.getItemElementStyleClass());
      context.depth = parents.length;
      if (parents.length === 0) {
        context.parentKey = null;
      } else {
        context.parentKey = parents.first().attr('id');
      }
    }

    return context;
  };

  /**
   * @private
   */
  StaticContentHandler.prototype.setAriaProperties = function (item, context) {
    // if there's only one element inside the item and it is focusable, set
    // the role on it instead
    var elem = this.m_widget.getSingleFocusableElement(item);
    if (this.shouldUseGridRole()) {
      if (context.leaf != null && !context.leaf) {
        // it's a group item
        item.attr('role', 'presentation');
        if (elem !== item) {
          elem.attr('role', 'gridcell');
        }
      } else if (this.isCardLayout()) {
        elem.attr('role', 'gridcell');
      } else {
        item.attr('role', 'row');
        if (elem !== item) {
          elem.attr('role', 'gridcell');
        } else {
          // we'll need to wrap content with a gridcell role
          elem.children().wrapAll("<div role='gridcell' class='oj-listview-cell-element'></div>"); // @HTMLUpdateOK
        }
      }
    } else {
      elem.attr('role', this.IsHierarchical() ? 'treeitem' : 'option');
      if (elem !== item) {
        item.attr('role', 'presentation');
      }
    }

    elem.addClass(this.m_widget.getFocusedElementStyleClass());
  };

  /**
   * @private
   */
  StaticContentHandler.prototype.setGroupAriaProperties = function (group, count) {
    var focusedElementStyleClass = this.m_widget.getFocusedElementStyleClass();

    // aria-expanded should be in the cell
    group.get(0).removeAttribute('aria-expanded');
    group.removeClass(focusedElementStyleClass);
    group.attr('role', 'row');
    // prettier-ignore
    group.children().wrapAll( // @HTMLUpdateOK
      "<div role='gridcell' aria-expanded='false' class='oj-listview-cell-element " +
        focusedElementStyleClass +
        "'></div>"
    );

    if (this.isCardLayout() && count > 1) {
      group.children().first().attr('aria-colspan', count);
    }
  };

  /**
   * @private
   */
  StaticContentHandler.prototype.unsetGroupAriaProperties = function (item) {
    item.children('div').first().children().unwrap();
  };

  /**
   * @private
   */
  StaticContentHandler.prototype.unsetAriaProperties = function (item) {
    DataCollectionUtils.enableAllFocusableElements(item);

    var groupItemStyleClass = this.m_widget.getGroupItemStyleClass(true);
    var focusedElementStyleClass = this.m_widget.getFocusedElementStyleClass();
    var firstElementChild = item.firstElementChild;
    var elem;
    if (firstElementChild && $(firstElementChild).hasClass(groupItemStyleClass)) {
      elem = $(firstElementChild)
        .children('.' + focusedElementStyleClass)
        .first();
      if (elem.length === 0) {
        // should not happen
        return;
      }
    } else {
      elem = this.m_widget.getSingleFocusableElement($(item));
    }

    elem.removeAttr('role');
    elem.removeAttr('aria-selected');
    elem.removeAttr('aria-expanded');
    elem.removeClass(this.m_widget.getFocusedElementStyleClass());

    // need to unwrap since in non-card layout we wrap the content with a div for gridcell role
    if (this.shouldUseGridRole() && !this.isCardLayout()) {
      if (elem !== item) {
        $(item).removeAttr('role');
        elem.children().first().children().unwrap();
      } else {
        elem.children().first().children().unwrap().children().unwrap();
      }
    }
  };

  StaticContentHandler.prototype.GetKey = function (element) {
    return $(element).attr('id');
  };

  StaticContentHandler.prototype.FindElementByKey = function (key) {
    return document.getElementById(key);
  };

  StaticContentHandler.prototype.isFocusable = function (context) {
    return this.m_widget.getItemFocusable(context);
  };

  StaticContentHandler.prototype.isSelectable = function (context) {
    return this.m_widget.getItemSelectable(context);
  };

  StaticContentHandler.prototype.isCardLayout = function () {
    return this.m_widget.isCardLayout();
  };

  StaticContentHandler.prototype.shouldUseGridRole = function () {
    return this.m_widget.ShouldUseGridRole();
  };

  StaticContentHandler.prototype.createKeyMap = function (initialMap) {
    var map = new KeyMap();
    if (initialMap) {
      initialMap.forEach(function (value, key) {
        map.set(key, value);
      });
      return map;
    }
    return map;
  };

  StaticContentHandler.prototype.createKeySet = function (initialSet) {
    return new ojkeyset.KeySet(initialSet);
  };

  /**
   * Handler for TreeDataProvider generated content
   * @constructor
   * @extends oj.DataSourceContentHandler
   * @ignore
   */
  const TreeDataProviderContentHandler = function (widget, root, data) {
    TreeDataProviderContentHandler.superclass.constructor.call(this, widget, root, data);
  };

  // Subclass from oj.DataSourceContentHandler
  oj._registerLegacyNamespaceProp('TreeDataProviderContentHandler', TreeDataProviderContentHandler);
  oj.Object.createSubclass(
    TreeDataProviderContentHandler,
    DataProviderScroller.DataProviderContentHandler,
    'oj.TreeDataProviderContentHandler'
  );

  // number of skeleton items to render for expand node
  TreeDataProviderContentHandler.NUM_CHILD_SKELETONS = 3;

  /**
   * Initializes the instance.
   * @protected
   */
  TreeDataProviderContentHandler.prototype.Init = function () {
    TreeDataProviderContentHandler.superclass.Init.call(this);
    this.m_childDataProviders = new KeyMap();
    this.m_fetchCalls = new Set();
  };

  /**
   * Determines whether the conent is hierarchical.
   * @return {boolean} returns true if content is hierarhical, false otherwise.
   * @protected
   */
  TreeDataProviderContentHandler.prototype.IsHierarchical = function () {
    return true;
  };

  /**
   * @private
   */
  TreeDataProviderContentHandler.prototype._getChildDataProvider = function (key) {
    if (key === null) {
      return this.getDataProvider();
    }

    var childDataProvider = this.m_childDataProviders.get(key);
    if (childDataProvider == null) {
      childDataProvider = this.getDataProvider().getChildDataProvider(key);
      if (childDataProvider) {
        this.m_childDataProviders.set(key, childDataProvider);
      }
    }

    return childDataProvider;
  };

  /**
   * @protected
   */
  TreeDataProviderContentHandler.prototype.fetchRows = function (forceFetch) {
    this.signalTaskStart('fetching rows'); // signal method task start

    TreeDataProviderContentHandler.superclass.fetchRows.call(this, forceFetch);

    this.m_fetchCalls.clear();
    this._fetchChildren(null, this.m_root, null);

    this.signalTaskEnd(); // signal method task end
  };

  /**
   * @private
   */
  TreeDataProviderContentHandler.prototype._fetchChildren = function (
    parent,
    parentElem,
    successCallback,
    errorCallback
  ) {
    var self = this;

    this.signalTaskStart('fetching children from parent: ' + parent); // signal method task start

    // initiate loading of template engine, note it will not load it unless a template has been specified
    var enginePromise = this.loadTemplateEngine();

    // root node would not have expand/collapse icon
    if (parent != null) {
      var anchor = parentElem.parentNode.firstElementChild.firstElementChild.firstElementChild;
      if (anchor) {
        anchor = $(anchor);
        var collapseClass = this.m_widget.getCollapseIconStyleClass();
        // switch to loading icon
        if (anchor.hasClass(collapseClass)) {
          var expandingClass = this.isSkeletonSupport()
            ? this.m_widget.getExpandIconStyleClass()
            : this.m_widget.getExpandingIconStyleClass();
          anchor.removeClass(collapseClass).addClass(expandingClass);
        }
      }
    }

    // no need to check ready since multiple fetch from different parents can occur at the same time
    this.m_fetching = true;
    if (parent != null) {
      this.m_fetchCalls.add(parent);
    }

    // Create a clientId symbol that uniquely identify this consumer so that
    // DataProvider which supports it can optimize resources
    this._clientId = this._clientId || Symbol();

    // use -1 to fetch all child rows
    var options = { clientId: this._clientId, size: -1 };

    this.signalTaskStart('first fetch');

    var dataProvider = this._getChildDataProvider(parent);
    var dataProviderAsyncIterator = dataProvider.fetchFirst(options)[Symbol.asyncIterator]();
    var promise = dataProviderAsyncIterator.next();

    // new helper function to be called in recursion to fetch all data.
    var helperFunction = function (values) {
      // skip additional fetching if done
      if (values[0].done) {
        return values;
      }
      var nextPromise = dataProviderAsyncIterator.next();
      var fetchMoreData = nextPromise.then(
        function (value) {
          // eslint-disable-next-line no-param-reassign
          values[0].done = value.done;
          // eslint-disable-next-line no-param-reassign
          values[0].value.data = values[0].value.data.concat(value.value.data);
          // eslint-disable-next-line no-param-reassign
          values[0].value.metadata = values[0].value.metadata.concat(value.value.metadata);
          return helperFunction(values);
        },
        function (reason) {
          if (parent != null) {
            self.m_fetchCalls.delete(parent);
          }
          if (errorCallback) {
            errorCallback(reason);
          }
          self._handleFetchError(reason, parentElem);
          self.signalTaskEnd(); // first fetch
        }
      );

      return fetchMoreData;
    };

    Promise.all([promise, enginePromise])
      .then(
        function (values) {
          return helperFunction(values);
        },
        function (reason) {
          if (parent != null) {
            self.m_fetchCalls.delete(parent);
          }
          self._handleFetchError(reason, parentElem);
          self.signalTaskEnd(); // first fetch
        }
      )
      .then(function (values) {
        // values would be undefined for error case
        if (values) {
          // check if content handler has been destroyed already
          if (self.m_widget == null) {
            self.signalTaskEnd(); // first fetch
            return;
          }

          var value = values[0];
          var templateEngine = values[1];

          if (templateEngine) {
            // clean nodes generated by templateengine before
            self.cleanItems(templateEngine, parentElem);
          }

          // append loading indicator at the end as needed
          self._handleFetchSuccess(value, parent, parentElem, successCallback, templateEngine);
          self.signalTaskEnd(); // first fetch
        }
      });

    this.signalTaskEnd(); // signal method task end
  };

  /**
   * Promise that is resolved when all fetchChildren calls triggered by a single fetch
   * has been completed.
   * @private
   */
  TreeDataProviderContentHandler.prototype._getAtomicFetchChildPromise = function () {
    var self = this;
    // eslint-disable-next-line no-unused-vars
    return new Promise(function (resolve, reject) {
      self.m_fetchResolve = resolve;
    });
  };

  TreeDataProviderContentHandler.prototype._handleFetchSuccess = function (
    dataObj,
    parent,
    parentElem,
    successCallback,
    templateEngine
  ) {
    var self = this;

    // listview might have been destroyed before fetch success is handled
    if (this.m_widget == null || dataObj.value == null) {
      return;
    }

    this.signalTaskStart('handling successful fetch'); // signal method task start

    // fetch is done
    this.m_fetching = false;
    if (parent != null) {
      this.m_fetchCalls.delete(parent);
    }

    function postProcessing() {
      if (self.m_widget) {
        // if a callback is specified (as it is in the expand case), then invoke it
        if (successCallback != null) {
          successCallback.call(null, parentElem);
        }

        self.m_widget.renderComplete(false);

        // process any outstanding events
        self._processEventQueue();
      }
    }

    var data = dataObj.value.data;
    var metadata = dataObj.value.metadata;
    var suggestions = 0;
    // we only handle suggestions in the root during initial fetch, and non-card view
    if (!this.isCardLayout() && parent == null) {
      suggestions = this.handleSuggestions(metadata);
    }

    var keys = metadata.map(function (value) {
      return value.key;
    });

    if (data.length === keys.length) {
      var index = 0;
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        // passing -1 for opt since we know it will be inserted at the end of the parent
        this.addItem(
          fragment,
          -1,
          row,
          this.getMetadata(index, keys[i], row, parentElem),
          templateEngine,
          null,
          metadata[i]
        );

        index += 1;
      }

      // check whether we are still expanding and therefore hold off appending child nodes
      // also, we'll switch this off for NavList since it breaks the drill replace mode
      if (this.m_fetchResolve != null || !this.shouldUseGridRole()) {
        // subtree of what is currently expanding, so we should just be able to add it immediately
        // (the root is still not attached yet)
        $(parentElem).empty();
        parentElem.appendChild(fragment); // @HTMLUpdateOK
        if (!this.shouldUseGridRole()) {
          // NavList case
          postProcessing();
        } else if (successCallback != null) {
          successCallback.call(null, parentElem);
        }
      } else if (this.m_fetchCalls.size > 0) {
        this.m_widget.signalTaskStart('Animating in content');
        this._getAtomicFetchChildPromise().then(
          function () {
            this.animateShowContent(parentElem, fragment, true).then(
              function () {
                if (this.m_widget) {
                  this.m_widget.signalTaskEnd();
                  this.renderSparkles(this.getItems(parentElem, suggestions));
                }
                postProcessing();
              }.bind(this)
            );
          }.bind(this)
        );
      } else {
        this.m_widget.signalTaskStart('Animating in content');
        this.animateShowContent(parentElem, fragment, true).then(
          function () {
            if (this.m_widget) {
              this.m_widget.signalTaskEnd();
              if (suggestions) {
                this.renderSparkles(this.getItems(parentElem, suggestions));
              }
            }
            postProcessing();
          }.bind(this)
        );
      }

      // update aria-colspan on the gridcell representing the group header
      if (this.shouldUseGridRole() && this.isCardLayout() && parent != null && index > 0) {
        var gridcell = parentElem.parentNode.firstElementChild.firstElementChild;
        $(gridcell).attr('aria-colspan', index + 1);
      }
    }
    // check if there's no more outstanding fetch children calls
    if (this.m_fetchCalls.size === 0) {
      if (this.m_fetchResolve != null) {
        this.m_fetchResolve();
        this.m_fetchResolve = null;
      }
    }

    this.m_initialized = true;

    this.signalTaskEnd(); // signal method task end
  };

  /**
   * Creates the context object containing metadata
   * @param {Element} parent the parent element
   * @param {number} index the index
   * @param {Object} key the key
   * @param {Object} data the data
   * @return {Object} the context object
   * @private
   */
  TreeDataProviderContentHandler.prototype.getMetadata = function (index, key, data, parentElem) {
    var context = TreeDataProviderContentHandler.superclass.getMetadata.call(
      this,
      index,
      key,
      data,
      parentElem
    );

    var childDataProvider = this._getChildDataProvider(key);
    context.leaf = childDataProvider === null;
    context.parentKey = null;
    if (parentElem && parentElem !== this.m_root && parentElem.parentElement) {
      context.parentKey = this.GetKey(parentElem.parentElement);
    }
    // walk up to calculate the depth
    var depth = 0;
    var curr = parentElem;
    while (curr && curr !== this.m_root) {
      curr = curr.parentElement.parentElement;
      depth += 1;
    }
    context.depth = depth;

    return context;
  };

  /**
   * Creates a binding context based on context object
   * To be override by different ContentHandler
   * @protected
   */
  TreeDataProviderContentHandler.prototype.GetBindingContext = function (context) {
    var bindingContext = TreeDataProviderContentHandler.superclass.GetBindingContext.call(
      this,
      context
    );
    bindingContext.depth = context.depth;
    bindingContext.leaf = context.leaf;
    bindingContext.parentKey = context.parentKey;

    return bindingContext;
  };

  TreeDataProviderContentHandler.prototype.afterRenderItem = function (
    item,
    context,
    isCustomizeItem
  ) {
    this.signalTaskStart('after rendering an item'); // signal method task start

    TreeDataProviderContentHandler.superclass.afterRenderItem.call(
      this,
      item,
      context,
      isCustomizeItem
    );

    var groupStyleClass = this.m_widget.getGroupStyleClass();
    var itemStyleClass = this.m_widget.getItemStyleClass();
    var groupItemStyleClass = this.m_widget.getGroupItemStyleClass(true);
    var groupCollapseStyleClass = this.m_widget.getGroupCollapseStyleClass();
    var collapseClass = this.m_widget.getCollapseIconStyleClass();
    var focusedStyleClass = this.m_widget.getFocusedElementStyleClass();

    // eslint-disable-next-line no-param-reassign
    item = $(item);

    if (context.leaf === false) {
      // check if group item already present
      if (item.get(0).querySelector('.' + groupItemStyleClass) == null) {
        item.children().wrapAll('<div></div>'); // @HTMLUpdateOK
      }

      // collapsed by default
      if (item.hasClass(focusedStyleClass)) {
        item
          .removeClass(focusedStyleClass)
          .children()
          .first()
          .addClass(focusedStyleClass)
          .attr('aria-expanded', 'false');
      } else {
        item
          .children()
          .first()
          .attr('role', 'presentation')
          .find('.' + focusedStyleClass)
          .attr('aria-expanded', 'false');
      }

      var content = item.children().first();
      content.uniqueId().addClass(groupItemStyleClass);

      // add the expand icon
      if (
        this.m_widget.isExpandable() &&
        !(item.hasClass('oj-expanded') || item.hasClass('oj-collapsed'))
      ) {
        item.addClass('oj-collapsed');

        var icon = document.createElement('a');
        $(icon).addClass('oj-component-icon oj-clickable-icon-nocontext').addClass(collapseClass);

        content.prepend(icon); // @HTMLUpdateOK
      }

      if (this.shouldUseGridRole()) {
        content.get(0).removeAttribute('aria-expanded');
        content.removeClass(focusedStyleClass);
        content.attr('role', 'row');
        // prettier-ignore
        content.children().wrapAll( // @HTMLUpdateOK
          "<div role='gridcell' aria-expanded='false' class='oj-listview-cell-element " +
            focusedStyleClass +
            "'></div>"
        );
      }

      // the yet to be expand group element
      // check if group already present
      if (item.get(0).querySelector('.' + groupStyleClass) == null) {
        var groupItem = document.createElement('ul');
        var role;
        if (this.shouldUseGridRole()) {
          if (this.isCardLayout()) {
            role = 'row';
          } else {
            role = 'presentation';
          }
        } else {
          role = 'group';
        }
        $(groupItem).addClass(groupStyleClass).addClass(groupCollapseStyleClass).attr('role', role);
        item.append(groupItem); // @HTMLUpdateOK
      }

      if (this.m_widget.isExpandable()) {
        let elem = this.m_widget.getFocusItem(item);
        elem.attr('aria-describedby', this.m_widget.m_accExpdescId);
      }
    } else if (context.leaf === true) {
      item.addClass(itemStyleClass);

      // if item root (<LI>) is not specified, add a default layout class
      if (!isCustomizeItem && this.m_widget.getItemLayoutStyleClass) {
        item.addClass(this.m_widget.getItemLayoutStyleClass());
      }
    }

    if (this.m_widget._isSelectionEnabled() && this.isSelectable(context)) {
      this.m_widget.getFocusItem(item).attr('aria-selected', false);
    }
    // Add group depth class
    if (context.depth > 0) {
      item.addClass(this.m_widget.getDepthStyleClass(context.depth));
    }
    // callback to widget
    this.m_widget.itemRenderComplete(item[0], context);

    this.signalTaskEnd(); // signal method task end
  };

  TreeDataProviderContentHandler.prototype._handleFetchError = function (status, parentElem) {
    // listview might have been destroyed before fetch error is handled
    if (this.m_widget == null) {
      Logger.info('handleFetchError: widget has already been destroyed');
      return;
    }

    // TableDataSource aren't giving me any error message
    Logger.error(status);

    // turn off fetching if there is an error
    this.m_fetching = false;

    if (parentElem) {
      this._destroySkeletons(parentElem);
    }

    // the above might not have remove initial skeleton if the fetch
    // comes from initial expand all
    var skeletons = this.m_root.querySelector('.oj-listview-initial-skeletons');
    if (skeletons != null) {
      skeletons.parentNode.removeChild(skeletons);
    }

    // show whatever we have so far
    if (this.m_fetchCalls.size === 0) {
      if (this.m_fetchResolve != null) {
        this.m_fetchResolve();
        this.m_fetchResolve = null;
      }
    }

    this.m_widget.renderComplete(true);
  };

  TreeDataProviderContentHandler.prototype.Expand = function (item, successCallback) {
    this.signalTaskStart('expanding an item'); // signal method task start

    var parentKey = this.GetKey(item[0]);
    var parentElem = item.children('ul')[0];
    var showSkeletonTimeout;
    if (this.isSkeletonSupport()) {
      // prettier-ignore
      showSkeletonTimeout = setTimeout( // @HTMLUpdateOK
        function () {
          this._renderExpandSkeletons(parentElem);
        }.bind(this),
        this.m_widget._getShowStatusDelay()
      );
    }

    this._fetchChildren(
      parentKey,
      parentElem,
      function (args) {
        if (showSkeletonTimeout) {
          clearTimeout(showSkeletonTimeout);
        }
        successCallback(args);
        parentElem.classList.remove('oj-listview-skeleton-container');
      },
      function () {
        this._handleFetchError();
      }.bind(this)
    );

    this.m_widget.updateStatusGroupExpandCollapse(true);

    this.signalTaskEnd(); // signal method task end
  };

  TreeDataProviderContentHandler.prototype.Collapse = function (item) {
    // template engine should have already been loaded
    var templateEngine = this.getTemplateEngine();
    if (templateEngine) {
      templateEngine.clean(item.get(0));
    }

    // remove all children nodes
    item.empty();

    this.m_widget.updateStatusGroupExpandCollapse(false);
  };

  /**
   * @protected
   */
  TreeDataProviderContentHandler.prototype.addItemsForModelInsert = function (
    data,
    indexes,
    keys,
    parentKeys,
    isBeforeKeys,
    refKeys,
    metadata
  ) {
    // template engine should have already been loaded
    var templateEngine = this.getTemplateEngine();

    for (var i = 0; i < data.length; i++) {
      this.signalTaskStart('handling model add event for item: ' + keys[i]); // signal add item start

      var parentElem = this.m_root;
      if (parentKeys !== undefined) {
        parentElem = parentKeys[i] == null ? this.m_root : this.FindElementByKey(parentKeys[i]);
        if (parentElem && parentElem !== this.m_root) {
          // take the <ul> inside the <li>
          parentElem = parentElem.lastElementChild;
        }
      }

      // indexes takes precedence
      var index;
      if (indexes != null) {
        index = indexes[i];
      } else {
        index = this.getIndex(refKeys, i);
        if (index > -1) {
          index = isBeforeKeys ? index : index + 1;
        }
      }

      this.addItem(
        parentElem,
        index,
        data[i],
        this.getMetadata(index, keys[i], data[i], parentElem),
        templateEngine,
        this.afterRenderItemForInsertEvent.bind(this),
        metadata != null ? metadata[i] : null
      );

      this.signalTaskEnd(); // signal add item end
    }

    this.m_widget.renderComplete(true);
  };

  /**
   * @protected
   */
  TreeDataProviderContentHandler.prototype.afterRenderItemForInsertEvent = function (
    item,
    context,
    isCustomizeItem
  ) {
    if (context.leaf === false) {
      // if it's a group node, we just need to call afterRenderItem
      this.afterRenderItem(item, context, isCustomizeItem);
    } else {
      TreeDataProviderContentHandler.superclass.afterRenderItemForInsertEvent.call(
        this,
        item,
        context,
        isCustomizeItem
      );
    }
  };

  /**
   * @protected
   */
  TreeDataProviderContentHandler.prototype.removeItem = function (elem, isReinsert) {
    var key = elem.key;
    if (key) {
      this.m_childDataProviders.delete(key);
    }
    TreeDataProviderContentHandler.superclass.removeItem.call(this, elem, isReinsert);
  };

  /**
   * @private
   */
  TreeDataProviderContentHandler.prototype._isExpandedGroupItem = function (item) {
    var drillMode = this.m_widget.GetOption('drillMode');
    return drillMode === 'none' || item.classList.contains('oj-expanded');
  };

  /**
   * @private
   */
  TreeDataProviderContentHandler.prototype._replaceGroupItemCallback = function (
    item,
    context,
    isCustomizeItem,
    restoreFocus
  ) {
    // callback to widget
    if (!this.shouldUseGridRole()) {
      this.afterRenderItem(item, context, isCustomizeItem, restoreFocus);
    } else {
      this.m_widget.itemRenderComplete(item, context);
    }
  };

  /**
   * @private
   */
  TreeDataProviderContentHandler.prototype._replaceGroupItem = function (
    item,
    index,
    data,
    metadata,
    templateEngine,
    restoreFocus
  ) {
    var groupItemStyleClass = this.m_widget.getGroupItemStyleClass(false);
    var groupItem = item.querySelector('.' + groupItemStyleClass);
    var shouldUseGridRole = this.shouldUseGridRole();
    if (groupItem) {
      var cellNode = shouldUseGridRole ? groupItem.firstElementChild : groupItem;
      var contentNode = cellNode.lastElementChild;
      if (contentNode) {
        // explicit clean when inline template is used
        if (templateEngine) {
          templateEngine.clean(groupItem);
        }
        cellNode.removeChild(contentNode);

        // now actually replace the item
        var parentElement = item.parentNode;
        var position = $(parentElement).children().index(item);
        var tagName = this.GetChildElementTagName();
        this._addOrReplaceItem(
          item,
          position,
          parentElement,
          index,
          data,
          metadata,
          templateEngine,
          this._replaceGroupItemCallback.bind(this),
          restoreFocus,
          null,
          function (nodes) {
            for (var i = 0; i < nodes.length; i++) {
              // only NavList supports <li> in group node
              if (nodes[i].tagName === tagName && !shouldUseGridRole) {
                groupItem.innerHTML = nodes[i].innerHTML; // @HTMLUpdateOK
                return true;
              }
              cellNode.appendChild(nodes[i]); // @HTMLUpdateOK
            }
            return false;
          }
        );
      }
    }
  };

  /**
   * @protected
   */
  TreeDataProviderContentHandler.prototype.replaceItem = function (
    item,
    index,
    data,
    metadata,
    templateEngine,
    callback,
    restoreFocus
  ) {
    var key = item.key;
    if (key) {
      this.m_childDataProviders.delete(key);
    }

    if (!metadata.leaf && this._isExpandedGroupItem(item)) {
      this._replaceGroupItem(item, index, data, metadata, templateEngine, restoreFocus);
    } else {
      TreeDataProviderContentHandler.superclass.replaceItem.call(
        this,
        item,
        index,
        data,
        metadata,
        templateEngine,
        callback,
        restoreFocus
      );
    }
  };

  /**
   * Handles granular branch refresh
   * @private
   */
  TreeDataProviderContentHandler.prototype._handleChildRefresh = function (keys) {
    var templateEngine = this.getTemplateEngine();
    var groupStyleClass = this.m_widget.getGroupStyleClass();
    var groupItemStyleClass = this.m_widget.getGroupItemStyleClass();

    keys.forEach(
      function (key) {
        var elem = this.FindElementByKey(key);
        if (elem != null && this._isExpandedGroupItem(elem)) {
          var group = elem.querySelector('.' + groupStyleClass);
          var groupItem = elem.querySelector('.' + groupItemStyleClass);
          if (group != null && groupItem != null) {
            if (templateEngine != null) {
              templateEngine.clean(group);
            }
            group.innerHTML = ''; // @HTMLUpdateOK

            this.m_childDataProviders.delete(key);
            // reset aria-expanded so children gets re-populated
            var ariaExpandedNode = groupItem.querySelector('[aria-expanded]');
            if (ariaExpandedNode) {
              ariaExpandedNode.setAttribute('aria-expanded', 'false'); // @HTMLUpdateOK
            }
            this.m_widget.itemRenderComplete(elem, { key: key, data: null });
          }
        }
      }.bind(this)
    );
  };

  /**
   * @protected
   */
  TreeDataProviderContentHandler.prototype.handleModelRefreshEvent = function (event) {
    if (this.m_root == null) {
      return;
    }

    // if listview is busy, hold that off until later, the refresh must be handled in order
    // since we don't know when the results are coming back in
    if (!this.IsReady()) {
      this._pushToEventQueue({ type: event.type, event: event });
      return;
    }

    // granular branch refresh
    if (event.detail && event.detail.keys) {
      this._handleChildRefresh(event.detail.keys);
      return;
    }

    this.signalTaskStart('handling model refresh event'); // signal method task start

    // since we are refetching everything, we should just clear out any outstanding model events
    this._clearEventQueue();

    // empty everything (later) and clear cache
    this.m_widget.ClearCache(true);

    // clear cached child DataProviders
    this.m_childDataProviders.clear();

    // reset focus if needed
    this.m_widget.resetFocusBeforeRefresh();

    // fetch data
    this.fetchRows(true);

    this.signalTaskEnd(); // signal method task end
  };

  TreeDataProviderContentHandler.prototype.renderInitialSkeletons = function () {
    // empty out root element before adding skeletons
    if (this.m_superRoot) {
      this.m_root = this.m_superRoot;
      this.m_superRoot = null;
    }
    $(this.m_root).empty();

    // determines how many items needed to fill the viewport
    var height = this.getRootElementHeight();
    var skeletonDimension = this.getDefaultSkeletonDimension();
    var count = 0;
    if (skeletonDimension.width > 0 && skeletonDimension.height > 0) {
      var skeletonSetHeight =
        skeletonDimension.height * (1 + TreeDataProviderContentHandler.NUM_CHILD_SKELETONS); // one parent + 3 children
      count = Math.ceil(height / skeletonSetHeight);
    }

    var container = document.createElement('li');
    container.setAttribute('role', 'presentation');
    container.classList.add('oj-listview-initial-skeletons');
    var list = document.createElement('ul');
    list.setAttribute('role', 'presentation');
    list.classList.add(this.m_widget.getGroupStyleClass());
    list.classList.add('oj-listview-skeleton-container');
    for (var i = 0; i < count; i++) {
      list.appendChild(this.createSkeletonItem()); // @HTMLUpdateOK
      var parent = document.createElement('li');
      parent.setAttribute('role', 'presentation');
      var children = document.createElement('ul');
      children.setAttribute('role', 'presentation');
      children.classList.add('oj-listview-child-skeleton');
      parent.appendChild(children);
      children.appendChild(this.createSkeletonItem()); // @HTMLUpdateOK
      children.appendChild(this.createSkeletonItem()); // @HTMLUpdateOK
      children.appendChild(this.createSkeletonItem()); // @HTMLUpdateOK
      list.appendChild(parent);
    }
    container.appendChild(list); // @HTMLUpdateOK

    this.m_root.appendChild(container); // @HTMLUpdateOK
  };

  TreeDataProviderContentHandler.prototype._renderExpandSkeletons = function (elem) {
    // make sure maxHeight wasn't set
    // eslint-disable-next-line no-param-reassign
    elem.style.maxHeight = 'none';
    for (var i = 0; i < TreeDataProviderContentHandler.NUM_CHILD_SKELETONS; i++) {
      elem.appendChild(this.createSkeletonItem()); // @HTMLUpdateOK
    }
    elem.classList.add('oj-listview-skeleton-container');
    elem.setAttribute('data-oj-initial-height', this._getExpandSkeletonHeight(elem));
  };

  TreeDataProviderContentHandler.prototype._destroySkeletons = function (elem) {
    $(elem).empty();
    elem.classList.remove('oj-listview-skeleton-container');
  };

  TreeDataProviderContentHandler.prototype._getExpandSkeletonHeight = function (elem) {
    if (this.m_expandSkeletonHeight == null || this.m_expandSkeletonHeight === 0) {
      this.m_expandSkeletonHeight = elem.offsetHeight;
    }
    return this.m_expandSkeletonHeight;
  };

  // mixin to inject createKeyMap and createKeySet functions to ContentHandlers
  var ContentHandlerMixin = function () {
    this.createKeyMap = function (initialMap) {
      var map = new KeyMap();
      if (initialMap) {
        initialMap.forEach(function (value, key) {
          map.set(key, value);
        });
        return map;
      }
      return map;
    };

    this.createKeySet = function (initialSet) {
      return new ojkeyset.KeySet(initialSet);
    };
  };

  ContentHandlerMixin.call(StaticContentHandler.prototype);
  ContentHandlerMixin.call(TreeDataProviderContentHandler.prototype);
  ContentHandlerMixin.call(DataProviderScroller.IteratingDataProviderContentHandler.prototype);

  /**
   * Default ExpandedKeySet class
   * Need a way to distinguish ExpandedKeySet set by application vs default one created by ListView
   * @extends {ExpandedKeySet}
   * @constructor
   * @ignore
   */
  const _ojListViewExpandedKeySet = function () {
    _ojListViewExpandedKeySet.superclass.constructor.call(this);
  };

  // Subclass from KeySet
  oj._registerLegacyNamespaceProp('_ojListViewExpandedKeySet', _ojListViewExpandedKeySet);
  oj.Object.createSubclass(_ojListViewExpandedKeySet, oj.ExpandedKeySet, 'ListViewExpandedKeySet');

  /**
   * todo: create common utility class between combobox and listview
   * @private
   */
  var _ListViewUtils = {
    clazz: function (SuperClass, methods) {
      var constructor = function () {};
      oj.Object.createSubclass(constructor, SuperClass, '');
      constructor.prototype = $.extend(constructor.prototype, methods);
      return constructor;
    }
  };

  /**
   * @export
   * @class oj._ojListView
   * @classdesc Listview
   * @constructor
   * @ignore
   * @private
   */
  const _ojListView = _ListViewUtils.clazz(
    Object,
    /** @lends oj._ojListView.prototype */ {
      // constants for key codes, todo: move to ListViewUtils
      LEFT_KEY: 37,
      RIGHT_KEY: 39,
      DOWN_KEY: 40,
      UP_KEY: 38,
      TAB_KEY: 9,
      ENTER_KEY: 13,
      ESC_KEY: 27,
      F2_KEY: 113,
      SPACE_KEY: 32,

      // constants for disclosure state
      /** @protected **/
      STATE_EXPANDED: 0,
      /** @protected **/
      STATE_COLLAPSED: 1,
      /** @protected **/
      STATE_NONE: 2,

      // minimum height of an item
      MINIMUM_ITEM_HEIGHT: 20,

      /**
       * Initialize the listview at creation
       * Invoked by widget
       */
      init: function (opts) {
        var self = this;

        this.readinessStack = [];
        this.element = opts.element;
        this.ojContext = opts.ojContext;
        this.OuterWrapper = opts.OuterWrapper;
        this.options = opts;

        this.element.uniqueId().addClass(this.GetStyleClass() + ' oj-component-initnode');

        if (this.OuterWrapper) {
          this.element[0].setAttribute('data-oj-context', '');
        }
        this.signalTaskStart('Initializing'); // Move component out of ready state; component is initializing. End in afterCreate()

        this._rootTabIndexSet = false;
        this.SetRootElementTabIndex();
        var dndContext = this.GetDnDContext();
        // listens for dnd events if ListViewDndContext is defined
        if (dndContext) {
          this.m_dndContext = dndContext;

          this.ojContext._on(this.element, {
            dragstart: function (event) {
              return dndContext._handleDragStart(event);
            },
            dragenter: function (event) {
              return dndContext._handleDragEnter(event);
            },
            dragover: function (event) {
              return dndContext._handleDragOver(event);
            },
            dragleave: function (event) {
              return dndContext._handleDragLeave(event);
            },
            dragend: function (event) {
              // mouseup will not be invoked on drag so resetting it to false.
              self.m_preActive = false;
              return dndContext._handleDragEnd(event);
            },
            drag: function (event) {
              return dndContext._handleDrag(event);
            },
            drop: function (event) {
              // mouseup will not be invoked on drag so resetting it to false.
              self.m_preActive = false;
              return dndContext._handleDrop(event);
            }
          });
        }
        this._touchStartListener = function (event) {
          // convert to jQuery event for downstream code expecting it
          if (!event.originalEvent) {
            // eslint-disable-next-line no-param-reassign
            event = $.Event(event);
          }
          self.touchStartEvent = event;
          self.HandleMouseDownOrTouchStart(event);
        };
        if (this.ojContext._IsCustomElement()) {
          this.element[0].addEventListener('touchstart', this._touchStartListener, { passive: true });
        } else {
          this.ojContext._on(this.element, {
            touchstart: this._touchStartListener
          });
        }
        this.ojContext._on(this.element, {
          click: function (event) {
            self.HandleMouseClick(event);
            self.touchStartEvent = null;
          },
          touchend: function (event) {
            if (self.touchStartEvent && event.changedTouches.length) {
              var overElem = document.elementFromPoint(
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY
              );
              if (overElem !== self.touchStartEvent.target) {
                self.touchStartEvent = null;
              }
            }
            self.HandleTouchEndOrCancel(event);
          },
          touchcancel: function (event) {
            self.touchStartEvent = null;
            self.HandleTouchEndOrCancel(event);
          },
          mousedown: function (event) {
            if (event.button === 0) {
              if (!self._recentTouch()) {
                self.HandleMouseDownOrTouchStart(event);
              }
            } else {
              // on right click we should prevent focus from shifting to first item
              self.m_preActive = true;
            }
          },
          mouseup: function (event) {
            self._handleMouseUpOrPanMove(event);
            self.m_preActive = false;
          },
          mouseout: function (event) {
            self._handleMouseOut(event);
          },
          mouseover: function (event) {
            self._handleMouseOver(event);
          },
          keydown: function (event) {
            self.HandleKeyDown(event);
          },
          keyup: function (event) {
            self.HandleKeyUp(event);
          },
          ojpanmove: function (event) {
            self._handleMouseUpOrPanMove(event);
          }
        });
        this.ojContext._on(this.ojContext.element, {
          focus: function (event) {
            self.HandleFocus(event);
          },
          blur: function (event) {
            self.HandleBlur(event);
          }
        });

        // in Firefox, need to explicitly make list container not focusable otherwise first tab will focus on the list container
        if (DataCollectionUtils.isFirefox() && this._isComponentFocusable()) {
          this._rootTabIndexSet = true;
          this.getListContainer().attr('tabIndex', -1);
        }

        // for item focus mode (aka roving focus), we'll need to use focusout handler instead
        // of blur because blur doesn't bubble
        this.ojContext._on(this.ojContext.element, {
          focusin: function (event) {
            self.HandleFocus(event);
          },
          focusout: function (event) {
            self.HandleFocusOut(event);
          }
        });

        this.ojContext._focusable({
          applyHighlight: self.ShouldApplyHighlight(),
          recentPointer: self.RecentPointerCallback(),
          setupHandlers: function (focusInHandler, focusOutHandler) {
            self._focusInHandler = focusInHandler;
            self._focusOutHandler = focusOutHandler;
          }
        });
      },

      /**
       * Whether ListView is available or offline/detached
       * Invoked by widget
       */
      isAvailable: function () {
        return this.m_contentHandler != null;
      },

      /**
       * Initialize ContentHandler and any post processes
       * @private
       */
      _initContentHandler: function () {
        this.signalTaskStart('Initialize ContentHandler'); // signal method task start

        var self = this;
        var postProcess = function (contentHandler) {
          self.m_contentHandler = contentHandler;

          // kick start rendering
          contentHandler.RenderContent();

          self.signalTaskEnd(); // signal method task end

          // register a resize listener
          self._registerResizeListener(self.getListContainer()[0]);
          // register a scroll/scrollwheel listener
          self._registerScrollHandler();
        };

        var data = this.GetOption('data');
        if (data != null) {
          this.CreateDataContentHandler(data).then(postProcess, function () {
            self.signalTaskEnd(); // signal method task end
          });
        } else {
          // remove existing no data content now before StaticContentHandler modifies content
          this._removeNoData();
          // StaticContentHandler will handle cases where children are invalid or empty
          postProcess(new StaticContentHandler(this, this.element[0]));
        }
      },

      /**
       * Setup resources on listview after connect
       * Invoked by widget
       */
      setupResources: function () {
        this.ojContext.document.bind(
          'touchend.ojlistview touchcancel.ojlistview',
          this.HandleTouchEndOrCancel.bind(this)
        );
        // sync selection with KeySet, including the case where selection option
        // was updated after detach
        this._syncSelectionWithKeySet();

        this._initContentHandler();
        this._updateGridlines();
      },

      /**
       * Release resources held by listview after disconnect
       * Invoked by widget
       */
      releaseResources: function () {
        this.ojContext.document.off('.ojlistview');

        this.DestroyContentHandler(true);
        this._unregisterResizeListener(this.getListContainer());
        this._unregisterScrollHandler();
        this.SetRootElementTabIndex();
        this._resetState();
      },

      /**
       * Whether the selected option is exposed at the component
       * @private
       */
      _isSelectedOptionExposed: function () {
        // currently this is override by NavList, always true for ListView
        return this.ShouldUseGridRole();
      },

      /**
       * Sync up legacy selection with KeySet during initialization
       * @private
       */
      _syncSelectionWithKeySet: function () {
        var selection = this.GetOption('selection');
        var selected = this.GetOption('selected');

        // first check if selected is specified and sync that up with selection
        // if selected option is not exposed then we don't need to sync selected with selection
        if (
          this._isSelectedOptionExposed() &&
          selected &&
          (selected.isAddAll() || (selected.values && selected.values().size > 0))
        ) {
          selection = [];
          if (selected.isAddAll()) {
            selection.inverted = true;
            selected.deletedValues().forEach(function (key) {
              selection.push(key);
            });
          } else {
            selected.values().forEach(function (key) {
              selection.push(key);
            });
          }

          this.SetOption('selection', selection, {
            _context: {
              internalSet: true
            },
            changed: true
          });

          return;
        }

        // now sync selected with selection
        var needsUpdate = false;

        // NavList do not have this property, need to initialize it
        if (selected == null) {
          selected = new ojkeyset.KeySetImpl();
          needsUpdate = true;
        }

        // detect if it's out of sync
        if (selection.length > 0 && selected.values && selected.values().size === 0) {
          selected = selected.add(selection);
          needsUpdate = true;
        }

        if (needsUpdate) {
          this.SetOption('selected', selected, {
            _context: {
              internalSet: true
            },
            changed: true
          });
        }
      },

      /**
       * Initialize the listview after creation
       * Invoked by widget
       */
      afterCreate: function () {
        this._buildList();
        this.signalTaskEnd(); // resolve component initializing task. Started in init()
      },

      /**
       * @private
       */
      _isAnimateCards: function () {
        return (
          this.isCardDisplayMode() && this.m_contentHandler && !this.m_contentHandler.IsHierarchical()
        );
      },

      /**
       * Redraw the entire list view after having made some external modifications.
       * Invoked by widget
       */
      refresh: function () {
        var cards = this.element[0].querySelectorAll('.oj-listview-card');
        if (cards.length > 0) {
          var self = this;
          this.signalTaskStart('Exit animation');
          this._applyExitAnimation(cards).then(function () {
            self._refresh();
            self.signalTaskEnd();
          });
        } else {
          this._refresh();
        }
      },

      /**
       * @private
       */
      _applyExitAnimation(cards) {
        var self = this;
        var promise;
        cards.forEach(function (card) {
          promise = self.StartAnimation(card, 'cardExit');
        });

        // promise should never be null since cards must be non-empty
        return promise;
      },

      /**
       * @private
       */
      _refresh: function () {
        // reset content, wai aria properties, and ready state
        this._resetInternal();

        this.signalTaskStart('Refresh'); // signal method task start

        // set the wai aria properties
        this.SetAriaProperties();

        // recreate the content handler
        this._initContentHandler();

        // update top/bottom gridlines
        this._updateGridlines();

        // if active element is inside an item, we'll need to shift focus to
        // the root otherwise focus is lost when all items are removed
        this.resetFocusBeforeRefresh();

        this.signalTaskEnd(); // signal method task end
      },

      /**
       * Invoked before refresh, including DataProviderRefresh event
       */
      resetFocusBeforeRefresh: function () {
        this.m_active = null;
        this.SetRootElementTabIndex();
        if (this.element[0].contains(document.activeElement)) {
          this.element[0].focus();
        }
      },

      /**
       * Returns a Promise that resolves when the component is ready, i.e. after data fetching, rendering, and animations complete.
       * Invoked by widget
       * @return {Promise} A Promise that resolves when the component is ready.
       */
      whenReady: function () {
        return this.readyPromise;
      },

      /**
       * Destroy the list view
       * Invoked by widget
       */
      destroy: function () {
        this.element.removeClass(this.GetStyleClass() + ' oj-component-initnode');

        this._unregisterResizeListener(this.getListContainer());
        this._resetInternal();

        //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
        DomUtils.unwrap(this.element, this.getListContainer());
      },

      /**
       * Returns true if ListView should handle key based scrollPosition, false otherwise.
       */
      _isScrollToKey: function () {
        var scrollToKey = this.GetOption('scrollToKey');
        if (scrollToKey === 'never') {
          return false;
        } else if (scrollToKey === 'always') {
          return true;
        }

        var data = this.GetOption('data');
        if (data == null || !oj.DataProviderFeatureChecker.isDataProvider(data)) {
          return true;
        } else if (data.getCapability) {
          var capability = data.getCapability('fetchFirst');
          if (capability && capability.iterationSpeed === 'immediate') {
            return true;
          }
        }
        return false;
      },

      /**
       * Adjust the value of scrollPosition based on the value from scrollPositionPolicy
       */
      adjustScrollPositionValueOnFetch: function () {
        var scrollPosition =
          this.GetOption('scrollPosition') == null ? {} : this.GetOption('scrollPosition');
        var selection = this.GetOption('selection');

        if (this._isSelectionEnabled() && selection.length > 0 && this._isScrollToKey()) {
          // use selection anchor if available
          if (this.m_selectionFrontier != null && this.m_selectionFrontier.length > 0) {
            scrollPosition.key = this.GetKey(this.m_selectionFrontier[0]);
          } else {
            // selection is programmatically set
            scrollPosition.key = selection[0];
          }
        } else {
          // remain at the top
          scrollPosition.y = 0;
          scrollPosition.key = null;
          scrollPosition.index = 0;
        }
        scrollPosition.x = 0;
        scrollPosition.offsetX = 0;
        scrollPosition.offsetY = 0;

        // explicitly set changed to false so option change will not be triggered, syncScrollPosition after rendered will
        // complete the scrollPosition value and fire the option change event
        this.SetOption('scrollPosition', scrollPosition, {
          _context: {
            internalSet: true
          },
          changed: false
        });
      },

      /**
       * Force busy state to be resolve and flush the readiness stack
       * @private
       */
      _clearBusyState: function () {
        if (this.readinessStack && this.readinessStack.length > 0) {
          Logger.warn(
            'ListView did not end with a clean state, this could happen if ListView is detached before fetch is complete.  State: ' +
              this.readinessStack
          );

          // this should resolve all the Promises, safe to assume the Promises should already been resolve if readinessStack is empty
          while (this.readinessStack.length > 0) {
            this.signalTaskEnd();
          }
        }
      },

      /**
       * Remove any wai-aria properties and listview specific attributes.
       * Reset anything done by the content handler.
       * @private
       */
      _resetInternal: function () {
        this.UnsetAriaProperties();
        this._cleanupTabbableElementProperties(this.element);
        this.DestroyContentHandler();
        this._resetState();
      },

      /**
       * Reset internal state and cache
       * @private
       */
      _resetState: function () {
        this.m_active = null;
        this.m_isExpandAll = null;
        this.m_disclosing = null;
        this.m_itemHeight = null;
        this.m_keyElemMap = null;
        this.m_clientHeight = null;
        this.m_scrollHeight = null;
        this.m_clientWidth = null;
        this.m_scrollWidth = null;
        this.m_closestParent = null;
        this.m_gridlinesVisible = null;
        this.m_gridlinePlaceholder = null;
        this.m_scroller = null;
        this.m_initialSelectionStateValidated = null;
        this.m_validatedSelectedKeyData = null;
        this.m_selectionFrontier = null;

        this.ClearCache();
        this._clearFocusoutTimeout();
        this._clearFocusoutBusyState();
        this._clearScrollPosBusyState();

        // give dnd context a chance to clear internals
        if (this.m_dndContext != null) {
          this.m_dndContext.reset();
        }
      },

      /**
       * Called when listview root element is re-attached to DOM tree.
       * Invoke by widget
       */
      notifyAttached: function () {
        // make sure component is not destroyed and is not fetching
        if (this.m_contentHandler != null && this.m_contentHandler.IsReady()) {
          // restore scroll position as needed since some browsers reset scroll position
          this.syncScrollPosition();

          // call ContentHandler in case for example fetch is needed
          this.m_contentHandler.notifyAttached();
        }
      },

      /**
       * In browsers [Chrome v35, Firefox v24.5, IE9, Safari v6.1.4], blur and mouseleave events are generated for hidden content but not detached content,
       * so for detached content only, we must use this hook to remove the focus and hover classes.
       * Invoke by widget.
       */
      notifyDetached: function () {
        // Remove focus/hover/active style classes when listview element got detached from document.
        // For details see related button .
        this.getListContainer().removeClass('oj-focus-ancestor');

        if (this.m_active != null) {
          $(this.m_active.elem).removeClass('oj-focus oj-focus-highlight');
        }

        if (this.m_hoverItem != null) {
          this._unhighlightElem(this.m_hoverItem, 'oj-hover');
        }
      },

      /**
       * Called when application programmatically change the css style so that the ListView becomes visible
       */
      notifyShown: function () {
        // make sure component is not destroyed and is not fetching
        if (this.m_contentHandler != null && this.m_contentHandler.IsReady()) {
          // restore scroll position as needed since some browsers reset scroll position
          this.syncScrollPosition();
          // clears the accessibility information in status when listviews goes from
          // hidden to shown
          this._clearAccInfoText();
          // call ContentHandler in case for example fetch is needed
          this.m_contentHandler.notifyShown();
        }
      },

      /**
       * Return the subcomponent node represented by the documented locator attribute values.
       * Invoked by widget
       * @param {Object} locator An Object containing at minimum a subId property
       *        whose value is a string, documented by the component, that allows
       *         the component to look up the subcomponent associated with that
       *        string.  It contains:<p>
       *        component: optional - in the future there may be more than one
       *        component contained within a page element<p>
       *        subId: the string, documented by the component, that the component
       *        expects in getNodeBySubId to locate a particular subcomponent
       * @returns {Array.<(Element|null)>|Element|null} the subcomponent located by the subId string passed
       *          in locator, if found.<p>
       */
      getNodeBySubId: function (locator) {
        var key;

        if (locator == null) {
          return this.element[0];
        }

        var subId = locator.subId;
        if (subId === 'oj-listview-disclosure' || subId === 'oj-listview-icon') {
          key = locator.key;
          if (key != null) {
            var item = this.FindElementByKey(key);
            if (item != null) {
              // this should be the anchor
              var anchor = $(item).find('.oj-clickable-icon-nocontext').first();
              if (this._isExpandCollapseIcon(anchor)) {
                return anchor.get(0);
              }
            }
          }
        } else if (subId === 'oj-listview-item') {
          key = locator.key;
          if (key != null) {
            return this.FindElementByKey(key);
          }
        }

        // Non-null locators have to be handled by the component subclasses
        return null;
      },

      /**
       * Returns the subId locator for the given child DOM node.
       * Invoked by widget
       * @param {!Element} node - child DOM node
       * @return {Object|null} The subId for the DOM node, or null when none is found.
       */
      getSubIdByNode: function (node) {
        // check to see if it's expand/collapse icon
        if (node != null && this._isExpandCollapseIcon(node)) {
          var item = this.FindItem(node);
          if (item != null && item.length > 0) {
            var key = this.GetKey(item[0]);
            if (key != null) {
              return { subId: 'oj-listview-disclosure', key: key };
            }
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
        var item = this.FindItem(node);
        if (item != null && item.length > 0) {
          var key = this.GetKey(item[0]);
          if (key != null) {
            var parent = item.parent();
            var index = parent.children('.' + this.getItemElementStyleClass()).index(item);
            var context = { subId: 'oj-listview-item', key: key, index: index };

            // group item should return the li
            if (parent.get(0) !== this.element.get(0)) {
              context.parent = parent.parent().get(0);
            }

            // check if it's a group item
            if (item.children().first().hasClass(this.getGroupItemStyleClass())) {
              context.group = true;
            } else {
              context.group = false;
            }

            return context;
          }
        }

        return null;
      },

      /**
       * Return the raw data for an item in ListView.
       * Invoked by widget
       *
       * @param {Object} context the context of the item to retrieve raw data.
       * @param {any=} context.key The key of the item.  If both index and key are specified, then key takes precedence.
       * @param {number=} context.index the index of the item relative to its parent.
       * @param {Element=} context.parent the parent node, not required if parent is the root.
       * @returns {any} data for the item.  Returns null if the item is not available locally.  Returns the item element if static HTML is used as data.
       */
      getDataForVisibleItem: function (context) {
        var item;
        var key = context.key;

        // key takes precedence
        if (key != null) {
          item = this.FindElementByKey(key);
        }

        // if we can't find the item with key, try to use index, if specified
        if (item == null) {
          var index = context.index;
          var parent = context.parent;

          if (parent == null) {
            // use the root element
            parent = this.element.get(0);
          } else {
            // find the appropriate group element
            parent = $(parent)
              .children('ul.' + this.getGroupStyleClass())
              .first();
          }

          item = $(parent).children('li').get(index);
        }

        if (item != null && $(item).hasClass(this.getItemStyleClass())) {
          return this._getDataForItem(item);
        }

        return null;
      },

      /**
       * Retrieve data stored in dom
       * @param {Element} item
       * @return {any} data for item
       * @private
       */
      _getDataForItem: function (item) {
        // if static HTML, returns the item's dom element
        if (this.GetOption('data') == null) {
          return item;
        }

        return $.data(item, 'data');
      },

      /**
       * Retrieve metadata stored in dom
       * @param {Element} item
       * @return {any} data for item
       * @private
       */
      _getMetadataForItem: function (item) {
        return $.data(item, 'metadata');
      },

      /**
       * To be override by NavList
       * @protected
       */
      ShouldRegisterResizeListener: function (element) {
        return (
          element &&
          this.m_contentHandler &&
          this.m_contentHandler.HandleResize &&
          this.m_contentHandler.shouldHandleResize &&
          this.m_contentHandler.shouldHandleResize()
        );
      },

      /**
       * Unregister event listeners for resize the container DOM element.
       * @param {Element} element  DOM element
       * @private
       */
      _unregisterResizeListener: function (element) {
        if (element && this._resizeHandler) {
          // remove existing listener
          DomUtils.removeResizeListener(element, this._resizeHandler);
        }
      },

      /**
       * Register event listeners for resize the container DOM element.
       * @param {Element} element  DOM element
       * @private
       */
      _registerResizeListener: function (element) {
        this._unregisterResizeListener(element);

        // register resize listener if needed
        if (this.ShouldRegisterResizeListener(element)) {
          if (this._resizeHandler == null) {
            this._resizeHandler = this.HandleResize.bind(this);
          }

          DomUtils.addResizeListener(element, this._resizeHandler);
        }
      },

      /**
       * Invoked by ContentHandler
       */
      disableResizeListener: function () {
        var container = this.getListContainer()[0];
        this._unregisterResizeListener(container);
      },

      /**
       * Invoked by ContentHandler
       */
      enableResizeListener: function () {
        var container = this.getListContainer()[0];
        this._registerResizeListener(container);
      },

      /**
       * Returns DnD Context, needed to override in navigationlist
       * @protected
       */
      GetDnDContext: function () {
        // if dnd is not enabled, we should not do anything also even if ojlistviewdnd is required
        var dndOptions = this.GetOption('dnd');
        if (
          dndOptions === null ||
          (dndOptions.drag === null &&
            dndOptions.drop === null &&
            dndOptions.reorder &&
            dndOptions.reorder.items === 'disabled')
        ) {
          return undefined;
        }

        if (typeof oj.ListViewDndContext !== 'undefined') {
          return new oj.ListViewDndContext(this);
        }
        return undefined;
      },

      /**
       * The resize handler.
       * @param {number} width the new width
       * @param {number} height the new height
       * @private
       */
      HandleResize: function (width, height) {
        if (
          width > 0 &&
          height > 0 &&
          this.m_contentHandler != null &&
          this.m_contentHandler.HandleResize
        ) {
          this.m_contentHandler.HandleResize(width, height);
        }

        this.m_clientHeight = null;
        this.m_scrollHeight = null;
        this.m_clientWidth = null;
        this.m_scrollWidth = null;
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
       * check Whether recent pointer acivity happened or not.
       * Only used for sliding navlist to avoid focus ring on new focusable item
       * after completing expand/collapse animation.
       * @protected
       */
      RecentPointerCallback: function () {
        return function () {
          return false;
        };
      },

      /**
       * Whether ListView should refresh if certain option is updated
       * @param {Object} options the options to check
       * @return {boolean} true if should refresh, false otherwise
       * @protected
       */
      ShouldRefresh: function (options) {
        return (
          options.data != null ||
          options.drillMode != null ||
          options.groupHeaderPosition != null ||
          options.item != null ||
          options.scrollPolicy != null ||
          options.scrollPolicyOptions != null ||
          options.gridlines != null ||
          options.display != null
        );
      },

      /**
       * Returns true if value is a KeySet, false otherwise
       * @private
       */
      _isKeySet: function (value) {
        return (
          value.isAddAll !== undefined &&
          (value.values !== undefined || value.deletedValues !== undefined)
        );
      },

      /**
       * Returns true if key is expandable, false otherwise
       * @private
       */
      _shouldExpand: function (key, expanded) {
        if (this._isKeySet(expanded)) {
          return expanded.has(key);
        } else if (!this.ojContext._IsCustomElement() && expanded === 'all') {
          return true;
        } else if (Array.isArray(expanded)) {
          return expanded.indexOf(key) > -1;
        }
        return false;
      },

      /**
       * Sets multiple options
       * Invoke by widget
       * @param {Object} options the options object
       * @param {Object} flags additional flags for option
       * @return {boolean} true to refresh, false otherwise
       */
      // eslint-disable-next-line no-unused-vars
      setOptions: function (options, flags) {
        if (this.ShouldRefresh(options)) {
          // data updated, need to refresh
          return true;
        }

        if (options.expanded != null) {
          // should only apply if data is hierarchical
          // q: could expanded be change if drillMode is 'expanded'?
          if (this.m_contentHandler.IsHierarchical()) {
            // clear collapsed items var
            this._collapsedKeys = undefined;

            var expanded = options.expanded;

            this.signalTaskStart('Set expanded option'); // signal task start

            // itemRenderComplete would check expanded option to expand nodes as needed
            // however, since options has not been updated yet this will cause previous
            // expanded nodes to expand
            // an option would be to clear the expanded option to null when doing collapseAll
            // but the issue is that optionChange would be fired AND even if we can suppress
            // the optionChange event, when the actual optionChange event is fired, the
            // previousValue param would be wrong (it would be null)
            // so instead we'll use to flag so that itemRenderComplete would detect and ignore
            // the expanded option
            this._ignoreExpanded = true;

            try {
              var selector = '.' + this.getGroupItemStyleClass();
              var groupItems = this.element.find(selector);
              for (var i = 0; i < groupItems.length; i++) {
                var groupItem = groupItems[i];
                var key = this.GetKey(groupItem.parentNode);
                var expand = this._shouldExpand(key, expanded);
                if (expand) {
                  this.expandKey(key, true, true, true, false);
                } else {
                  this.collapseKey(key, true, true, false);
                }
              }
            } finally {
              this._ignoreExpanded = undefined;

              this.signalTaskEnd(); // signal task end
            }
          }
        }

        if (options.currentItem != null) {
          var elem = this.FindElementByKey(options.currentItem);
          if (elem != null) {
            elem = $(elem);
            if (!this.SkipFocus(elem)) {
              var active = document.activeElement;
              // update tab index and focus only if listview currently has focus
              if (active && this.element.get(0).contains(active)) {
                this.ActiveAndFocus(elem, null);
              } else {
                // update internal state only
                this._setActive(elem, null, true);
              }
            }
          }
        } else if (options.currentItem === null) {
          // currentItem is deliberately set to null if this case is entered; deliberately clear active element and its focus
          this.UnhighlightActive();
          if (this.m_active && this.m_active.elem) {
            this.m_active.elem.get(0).classList.remove('oj-listview-current-item');
          }
          this.m_active = null;
          this.SetRootElementTabIndex();
        }
        this.HandleSelectionOption(options);

        if (options.selectionMode != null) {
          // reset wai aria properties
          this.SetAriaProperties();

          // update aria-selected on item
          this.UpdateItemAriaProperties(options.selectionMode);
        }

        if (options.scrollTop != null) {
          var scroller = this._getScroller();
          var pos = options.scrollTop;
          if (pos != null && !isNaN(pos)) {
            scroller.scrollTop = pos;
          }
        }

        if (options.scrollPosition != null) {
          this.syncScrollPosition(options.scrollPosition);
          // remove it so it doesn't trigger an option change
          // eslint-disable-next-line no-param-reassign
          delete options.scrollPosition;
        }

        // if reorder switch to enabled/disabled, we'll need to make sure any reorder styling classes are added/removed from focused item
        if (
          this._shouldDragSelectedItems() &&
          this.m_active != null &&
          options.dnd != null &&
          options.dnd.reorder != null
        ) {
          if (options.dnd.reorder.items === 'enabled') {
            this.m_dndContext._setItemDraggable(this.m_active.elem);
          } else if (options.dnd.reorder.items === 'disabled') {
            this.m_dndContext._unsetItemDraggable(this.m_active.elem);
          }
        }

        return false;
      },
      /**
       * @private
       */
      _isFirstSelectedItem: function (key) {
        var firstSelectedData = this.GetOption('firstSelectedItem');
        return firstSelectedData && oj.KeyUtils.equals(firstSelectedData.key, key);
      },
      /**
       * @private
       */
      _setFirstSelectedItem: function (key, data) {
        var value = {
          key: key,
          data: data
        };

        this.SetOption('firstSelectedItem', value, {
          _context: {
            originalEvent: null,
            internalSet: true
          },
          changed: true
        });
      },
      /**
       * @private
       */
      _updateFirstSelectedItem: function (selected) {
        var key;
        if (selected.isAddAll()) {
          var items = this._getItemsCache();
          for (var j = 0; j < items.length; j++) {
            var currentKey = this.m_contentHandler.GetKey(items[j]);
            if (selected.has(currentKey)) {
              key = currentKey;
              break;
            }
          }
        } else {
          key = selected.values().values().next().value;
        }

        if (key != null) {
          var data = this._getLocalData(key);
          this._setFirstSelectedItem(key, data);
        }
      },
      /**
       * Invoked by ContentHandler on update mutation event
       */
      updateSelectedKeyData: function (key, data) {
        if (this._isFirstSelectedItem(key)) {
          this._setFirstSelectedItem(key, data);
        }

        if (this.m_validatedSelectedKeyData && this.m_validatedSelectedKeyData.has(key)) {
          this.m_validatedSelectedKeyData.set(key, data);
        }
      },
      /**
       * Set Selection option. Overriden by Navlist.
       * @param {Object} options the options object
       * @protected
       */
      HandleSelectionOption: function (options) {
        if (options.selection != null || options.selected != null) {
          var selected = options.selected;
          if (selected != null && selected.isAddAll()) {
            var items = this._getItemsCache();
            for (var j = 0; j < items.length; j++) {
              var key = this.m_contentHandler.GetKey(items[j]);
              if (selected.has(key)) {
                this._applySelection(items[j], key);
              } else {
                this._unhighlightElem(items[j], 'oj-selected');
              }
            }

            // eslint-disable-next-line no-param-reassign
            options.selection = ojkeyset.KeySetUtils.toArray(selected);
          } else {
            var set = selected != null ? selected.values() : options.selection;

            // we used to filter non-selectable items, but not anymore, but we are still
            // cloning by converting iterable into array
            var newSelection = this._cloneSelection(set);
            // validate the selection, invalid keys could get removed from newSelection
            this._validateAndUpdateSelection(newSelection);

            // eslint-disable-next-line no-param-reassign
            options.selection = newSelection;

            // eslint-disable-next-line no-param-reassign
            selected = this.GetOption('selected');
            selected = selected.clear();
            selected = selected.add(newSelection);
            // eslint-disable-next-line no-param-reassign
            options.selected = selected;

            // keep selection frontier if it's part of selection
            var selectionFrontier;
            if (this.m_selectionFrontier) {
              var frontierKey = this.GetKey(this.m_selectionFrontier.get(0));
              selectionFrontier = selected.has(frontierKey) ? this.m_selectionFrontier : undefined;
            }

            // clear selection first
            this._clearSelection(false, selectionFrontier);

            // selects each key
            for (var i = 0; i < newSelection.length; i++) {
              var elem = this.FindElementByKey(newSelection[i]);
              if (elem != null) {
                // check if the selected item is in the process of animation
                if (
                  elem.tagName !== 'LI' &&
                  elem.parentElement &&
                  elem.parentElement.classList.contains('oj-listview-temp-item')
                ) {
                  // eslint-disable-next-line no-param-reassign
                  elem = elem.parentElement;
                }
                this._applySelection(elem, newSelection[i]);
              }
            }
          }

          if (selected != null) {
            this._updateFirstSelectedItem(selected);
          }
        }
      },

      /**
       * Trigger an event to fire.
       * @param {string} type the type of event
       * @param {Object} event the jQuery event to fire
       * @param {Object} ui the ui param
       * @protected
       */
      Trigger: function (type, event, ui) {
        return this.ojContext._trigger(type, event, ui);
      },

      /**
       * Sets an option on the widget
       * @param {string} key the option key
       * @param {Object} value the option value
       * @param {Object=} flags any optional parameters
       * @protected
       */
      SetOption: function (key, value, flags) {
        this.ojContext.option(key, value, flags);
      },

      /**
       * Gets the value of an option from the widget
       * @param {string} key the option key
       * @return {Object} the value of the option
       * @protected
       */
      GetOption: function (key) {
        return this.ojContext.option(key);
      },

      /**
       * Compose a description for busy state
       * @param {string} description the description
       * @return {string} the busy state description
       * @private
       */
      _getBusyDescription: function (description) {
        var id = this.ojContext._IsCustomElement()
          ? this.GetRootElement().attr('id')
          : this.element.attr('id');
        return "The component identified by '" + id + "', " + description;
      },

      /**
       * Invoke whenever a task is started. Moves the component out of the ready state if necessary.
       * @param {string=} description the description of the task
       */
      signalTaskStart: function (description) {
        var self = this;

        if (this.readinessStack) {
          if (this.readinessStack.length === 0) {
            this.readyPromise = new Promise(function (resolve) {
              self.readyResolve = resolve;
            });

            // whenReady is deprecated in favor of page busystate (but we still need to support old syntax)
            var busyContext = Context.getContext(this.element[0]).getBusyContext();
            var options =
              description != null ? { description: this._getBusyDescription(description) } : {};
            self.busyStateResolve = busyContext.addBusyState(options);
          }
          this.readinessStack.push(description != null ? description : 'unknown task');
        }
      },

      /**
       * Invoke whenever a task finishes. Resolves the readyPromise if component is ready to move into ready state.
       */
      signalTaskEnd: function () {
        if (this.readinessStack && this.readinessStack.length > 0) {
          this.readinessStack.pop();
          if (this.readinessStack.length === 0) {
            this.readyResolve(null);

            // whenReady is deprecated in favor of page busystate (but we still need to support old syntax)
            this.busyStateResolve(null);
            this.busyStateResolve = null;
          }
        }
      },

      /**
       * Checks whether ListView is in ready state.  Called by the ContentHandler.
       * @return {boolean} true if ListView is in ready state, false otherwise
       */
      isReady: function () {
        return this.busyStateResolve == null;
      },

      /**
       * Throw an error.  Do any neccessary cleanup.
       */
      throwError: function (err) {
        if (this.readinessStack) {
          while (this.readinessStack.length > 0) {
            this.signalTaskEnd();
          }
        }

        throw err;
      },

      /**
       * Gets an array of items based on specified ids.
       * @param {Array} ids an array of item ids.
       * @return {Array} an array of elements matching the item ids.
       */
      getItems: function (ids) {
        var self = this;
        var items = [];

        $.each(ids, function (index, value) {
          var elem = self.FindElementByKey(value);
          if (elem != null) {
            items.push(elem);
          }
        });

        return items;
      },

      /** ************************************ Core rendering ********************************/
      /**
       * Whether display option is set to 'card'.  Note this is different than isCardLayout which includes
       * the legacy way to switch to card layout mode using marker style class.
       * @private
       */
      isCardDisplayMode: function () {
        return this.GetOption('display') === 'card';
      },

      /**
       * Whether the listview is in card layout mode
       * @return {boolean} true if it is in card layout mode, false otherwise
       */
      isCardLayout: function () {
        var elem = this.ojContext._IsCustomElement() ? this.GetRootElement() : this.element;
        // legacy marker class has precedence to ensure backward compatibility
        if (elem.hasClass('oj-listview-card-layout')) {
          return true;
        }
        return this.isCardDisplayMode();
      },

      /**
       * Whether to use grid role for ListView, to be override by NavList
       * @protected
       */
      ShouldUseGridRole: function () {
        return true;
      },

      /**
       * Whether to scrollPosition is supported, NavList for example do not support this
       * @protected
       */
      ShouldUpdateScrollPosition: function () {
        return this.ShouldUseGridRole() && this.ojContext._IsCustomElement();
      },

      /**
       * Destroy the content handler
       * @protected
       */
      DestroyContentHandler: function (completelyDestroy) {
        if (this.m_contentHandler != null) {
          this.m_contentHandler.Destroy(completelyDestroy);
          delete this.m_contentHandler;
          this.m_contentHandler = null;
        }

        // ensure all busy states caused by outstanding fetch are resolved
        this._clearBusyState();
      },

      /**
       * Create the content handler based on data type
       * @return {Promise} which resolves to a ContentHandler
       * @protected
       */
      CreateDataContentHandler: function (data) {
        this.showStatusText();

        var contentHandler;
        if (typeof oj.TableDataSource !== 'undefined' && data instanceof oj.TableDataSource) {
          // TODO: load the adapter as needed
          contentHandler = new DataProviderScroller.IteratingDataProviderContentHandler(
            this,
            this.element[0],
            new oj.TableDataSourceAdapter(data)
          );
        } else if (typeof oj.TreeDataSource !== 'undefined' && data instanceof oj.TreeDataSource) {
          var adapterPromise = new Promise(function (resolve, reject) { require(['ojs/ojtreedataprovideradapter'], function (m) { resolve(_interopNamespace(m)); }, reject) });
          if (!adapterPromise) {
            throw new Error('Error adapting a TreeDataSource');
          }
          return adapterPromise.then(
            (TreeDataSourceAdapter) =>
              new TreeDataProviderContentHandler(
                this,
                this.element[0],
                // eslint-disable-next-line new-cap
                new TreeDataSourceAdapter.default(data)
              )
          );
        } else if (oj.DataProviderFeatureChecker.isTreeDataProvider(data)) {
          contentHandler = new TreeDataProviderContentHandler(this, this.element[0], data);
        } else if (oj.DataProviderFeatureChecker.isDataProvider(data)) {
          contentHandler = new DataProviderScroller.IteratingDataProviderContentHandler(
            this,
            this.element[0],
            data
          );
        } else {
          this.throwError('Invalid data or missing module');
        }

        return Promise.resolve(contentHandler);
      },

      /**
       * Update active descendant attribute
       * @param {jQuery} elem the active item element
       * @protected
       */
      UpdateActiveDescendant: function (elem) {
        this.element.attr('aria-activedescendant', elem.attr('id'));
      },

      /**
       * Sets wai-aria properties on root element
       * @protected
       */
      SetAriaProperties: function () {
        if (this._isMultipleSelection()) {
          this.element.attr('aria-multiselectable', true);
        } else if (this._isSelectionEnabled()) {
          this.element.attr('aria-multiselectable', false);
        }
      },

      /**
       * Removes wai-aria properties on root element
       * @protected
       */
      UnsetAriaProperties: function () {
        this.element.removeAttr('aria-activedescendant').removeAttr('aria-multiselectable');
      },

      /**
       * When selectionMode option is updated, the aria-selected
       * attribute must be remove or updated
       * @param {string} selectionMode the new selection mode
       * @protected
       */
      UpdateItemAriaProperties: function (selectionMode) {
        var self = this;
        var func;

        if (selectionMode === 'none') {
          this.element.removeAttr('aria-multiselectable');

          func = function (item) {
            self.getFocusItem(item).removeAttr('aria-selected');
          };
        } else {
          if (selectionMode === 'single') {
            this.element.attr('aria-multiselectable', false);
          } else {
            this.element.attr('aria-multiselectable', true);
          }

          func = function (item) {
            var focusElem = self.getFocusItem(item);
            var parentElem = focusElem.parent();
            focusElem.attr('aria-selected', parentElem.hasClass('oj-selected'));
          };
        }

        var items = this._getItemsCache();
        for (var i = 0; i < items.length; i++) {
          func($(items[i]));
        }
      },

      /**
       * Build the elements inside and around the root
       * @param {Element} root the root element
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _buildList: function (root) {
        var container = this.getListContainer();
        this.SetAriaProperties();

        this.m_elementOffset = this.element.get(0).offsetTop;

        var status = this._buildStatus();
        container.append(status); // @HTMLUpdateOK
        this.m_status = status;

        var accInfo = this._buildAccInfo();
        container.append(accInfo); // @HTMLUpdateOK
        this.m_accInfo = accInfo;

        if (this.isExpandable()) {
          const accInfoExpandCollapse = this._buildAccExpdesc();
          container.append(accInfoExpandCollapse); // @HTMLUpdateOK
        }

        this._buildFocusCaptureDiv(container[0]);
      },

      /**
       * Build a status bar div
       * @return {jQuery} the root of the status bar
       * @private
       */
      _buildStatus: function () {
        var icon = $(document.createElement('div'));
        icon.addClass('oj-icon').addClass(this.getLoadingStatusIconStyleClass());

        var root = $(document.createElement('div'));
        root
          .addClass(this.getStatusMessageStyleClass())
          .addClass(this.getStatusStyleClass())
          .attr({
            id: this._createSubId('status'),
            role: 'status'
          });
        root.append(icon); // @HTMLUpdateOK

        return root;
      },

      /**
       * Build the accessible text info div
       * @return {jQuery} the root of the acc info div
       * @private
       */
      _buildAccInfo: function () {
        var root = $(document.createElement('div'));
        root.addClass('oj-helper-hidden-accessible').attr({
          id: this._createSubId('info'),
          role: 'status'
        });
        root.attr({ tabIndex: -1 });

        return root;
      },

      /**
       * Build the accessible text instruction div for expand or collapse
       * @return {jQuery} the root of the acc instruction div
       * @private
       */
      _buildAccExpdesc: function () {
        const root = $(document.createElement('div'));
        const msg = this.ojContext.getTranslatedString('accessibleExpandCollapseInstructionText');
        this.m_accExpdescId = this._createSubId('expdesc');

        root
          .addClass('oj-helper-hidden-accessible')
          .attr({
            id: this.m_accExpdescId
          })
          .html(msg); // @HTMLUpdateOK

        return root;
      },

      /**
       * Build a non-keyboard accessible div used to capture manual focus from JAWS.
       * @private
       */
      _buildFocusCaptureDiv: function (container) {
        if (!DataCollectionUtils.isMobileTouchDevice()) {
          var elem = document.createElement('div');
          elem.setAttribute('tabindex', '-1');
          elem.classList.add('oj-helper-hidden-accessible');
          elem.innerHTML = '&nbsp'; // @HTMLUpdateOK
          container.insertBefore(elem, this.element[0]); // @HTMLUpdateOK
          elem.addEventListener('focus', () => {
            this.element[0].focus();
          });
        }
      },

      /**
       * Sets the accessible text info
       * @param {string} text the text to set on accessible info div
       * @private
       */
      _setAccInfoText: function (text) {
        if (this.m_clearAccInfoTimeout) {
          clearTimeout(this.m_clearAccInfoTimeout);
        }
        if (text !== '' && this.m_accInfo.text() !== text) {
          this.m_accInfo.text(text);
          this.m_clearAccInfoTimeout = setTimeout(() => {
            this._clearAccInfoText();
            this.m_clearAccInfoTimeout = null;
          }, 1000);
        }
      },

      /**
       * Sets the accessible text info to an empty string
       * @private
       */
      _clearAccInfoText: function () {
        this.m_accInfo.text('');
      },

      /**
       * Update role status text to reflect that it is fetching data
       * @private
       */
      updateStatusFetchStart: function () {
        var msg = this.ojContext.getTranslatedString('msgFetchingData');
        this._setAccInfoText(msg);
      },

      /**
       * Update role status text to reflect that fetched items are added to the end
       * @private
       */
      updateStatusFetchEnd: function (count) {
        var msg;
        if (count === 0) {
          msg = this.ojContext.getTranslatedString('msgFetchCompleted');
        } else {
          msg = this.ojContext.getTranslatedString('msgItemsAppended', { count: count });
        }
        this._setAccInfoText(msg);
      },

      /**
       * Update role status text to reflect that group header is expanded
       * @private
       */
      updateStatusGroupExpandCollapse: function (expanded) {
        let msg;
        if (expanded) {
          msg = this.ojContext.getTranslatedString('accessibleGroupExpand');
        } else {
          msg = this.ojContext.getTranslatedString('accessibleGroupCollapse');
        }
        this._setAccInfoText(msg);
      },

      /**
       * Whether skeletons should be shown for initial fetch.  Invoked by ContentHandler
       */
      isSkeletonSupport: function () {
        // don't show for NavList
        if (this.ShouldUseGridRole() && this.m_contentHandler.renderInitialSkeletons) {
          var defaults = this._getOptionDefaults();
          return defaults.loadIndicator === 'skeleton';
        }
        return false;
      },

      /**
       * @private
       */
      _showLoadingIcon: function () {
        var msg = this.ojContext.getTranslatedString('msgFetchingData');

        var container = this.getListContainer();
        this.m_status
          .attr('aria-label', msg)
          .css('left', Math.max(0, container.outerWidth() / 2 - this.m_status.outerWidth() / 2))
          .css('top', Math.max(0, container.outerHeight() / 2 - this.m_status.outerHeight() / 2))
          .show();

        // make sure the container is tall enough to show the indicator
        var statusHeight = this.m_status.get(0).offsetHeight;
        var containerHeight = container.get(0).offsetHeight;
        var minHeightStyle = container.get(0).style.minHeight;
        var minHeight = parseInt(minHeightStyle, 10);
        if (isNaN(minHeight)) {
          minHeight = 0;
        }
        if (containerHeight < statusHeight && minHeight < statusHeight) {
          container.css(
            'minHeight',
            Math.max(containerHeight, statusHeight + this.getListContainerBorderWidth())
          );
          // save it to restore later
          if (!isNaN(minHeight)) {
            container.get(0).setAttribute('data-oj-min-height', minHeightStyle);
          }
        }
      },

      /**
       * @private
       */
      _showLoadingSkeleton: function () {
        this.m_contentHandler.renderInitialSkeletons();
      },

      /**
       * Displays the 'fetching' status message
       * @private
       */
      showStatusText: function () {
        var self = this;

        // it's already shown
        if (this.m_showStatusTimeout) {
          return;
        }

        this.m_showStatusTimeout = setTimeout(function () {
          // remove any empty text div
          $(document.getElementById(self._createSubId('empty'))).remove();

          // listview might have already been destroyed
          if (self.m_contentHandler != null) {
            if (self.isSkeletonSupport()) {
              self._showLoadingSkeleton();
            } else {
              self._showLoadingIcon();
            }
          }
          self.m_showStatusTimeout = null;
        }, this._getShowStatusDelay());
      },

      /**
       * Retrieve the delay before showing status
       * @return {number} the delay in ms
       * @private
       */
      _getShowStatusDelay: function () {
        var defaultOptions = this._getOptionDefaults();
        var delay = DomUtils.getCSSTimeUnitAsMillis(defaultOptions.showIndicatorDelay);

        return isNaN(delay) ? 0 : delay;
      },

      /**
       * Hide the 'fetching' status message
       * @private
       */
      hideStatusText: function () {
        if (this.m_showStatusTimeout) {
          clearTimeout(this.m_showStatusTimeout);
          this.m_showStatusTimeout = null;
        }
        this.m_status.hide();

        var container = this.getListContainer().get(0);
        if (container.hasAttribute('data-oj-min-height')) {
          container.style.minHeight = container.getAttribute('data-oj-min-height');
          container.removeAttribute('data-oj-min-height');
        }
      },

      /**
       * Retrieves the root element
       * Invoke by widget
       * @protected
       * @return {jQuery} root element
       */
      GetRootElement: function () {
        return this.getListContainer();
      },

      /**
       * Retrieves the div around the root element, create one if needed.
       * @return {jQuery} the div around the root element
       */
      getListContainer: function () {
        if (this.m_container == null) {
          this.m_container = this._createListContainer();
        }
        return this.m_container;
      },

      /**
       * Creates the div around the root element.
       * @return {jQuery} the div around the root element
       * @private
       */
      _createListContainer: function () {
        var listContainer;

        if (this.OuterWrapper) {
          listContainer = $(this.OuterWrapper);
        } else {
          listContainer = $(document.createElement('div'));
          this.element.parent()[0].replaceChild(listContainer[0], this.element[0]);
        }

        listContainer.addClass(this.GetContainerStyleClass()).addClass('oj-component');
        listContainer.prepend(this.element); // @HTMLUpdateOK
        return listContainer;
      },

      /**
       * If the empty text option is 'default' return default empty translated text,
       * otherwise return the emptyText set in the options
       * @return {string} the empty text
       * @private
       */
      _getEmptyText: function () {
        return this.ojContext.getTranslatedString('msgNoData');
      },

      /**
       * Build an empty text div and populate it with empty text
       * @return {Element} the empty text element
       * @private
       */
      _buildEmptyText: function () {
        var emptyText = this._getEmptyText();
        var emptyRow = document.createElement('li');
        emptyRow.setAttribute('role', 'row');
        emptyRow.id = this._createSubId('empty');
        emptyRow.classList.add(this.getNoDataItemStyleClass());
        emptyRow.classList.add(this.getEmptyTextStyleClass());
        emptyRow.classList.add(this.getEmptyTextMarkerClass());

        var emptyCell = document.createElement('span');
        emptyCell.setAttribute('role', 'gridcell');
        emptyCell.textContent = emptyText;
        emptyCell.classList.add(this.getNoDataCellElementStyleClass());

        emptyRow.appendChild(emptyCell);

        return emptyRow;
      },

      /**
       * Determines whether the specified item is expanded
       * @param {jQuery} item the item element
       * @return {number} 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
       * @protected
       */
      GetState: function (item) {
        var expanded = this.getFocusItem(item).attr('aria-expanded');
        if (expanded === 'true') {
          return this.STATE_EXPANDED;
        } else if (expanded === 'false') {
          return this.STATE_COLLAPSED;
        }

        return this.STATE_NONE;
      },

      /**
       * Sets the disclosed state of the item
       * @param {jQuery} item the item element
       * @param {number} state 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
       * @protected
       */
      SetState: function (item, state) {
        var expandable = this.isExpandable();

        if (state === this.STATE_EXPANDED) {
          this.getFocusItem(item).attr('aria-expanded', 'true');
          if (expandable) {
            item.removeClass('oj-collapsed').addClass('oj-expanded');
          }
        } else if (state === this.STATE_COLLAPSED) {
          this.getFocusItem(item).attr('aria-expanded', 'false');
          if (expandable) {
            item.removeClass('oj-expanded').addClass('oj-collapsed');
          }
        }
      },

      /**
       * Gets the item option
       * @param {string} name the name of the option
       * @param {Object} context the context object
       * @param {boolean} resolve true evaluate if return value is a function, false otherwise
       * @return {function(Object)|Object|null} returns the item option
       * @private
       */
      _getItemOption: function (name, context, resolve) {
        var option = this.GetOption('item');
        var value = option[name];

        if (typeof value === 'function' && resolve) {
          return value.call(this, context);
        }

        return value;
      },

      /**
       * Gets the item.focusable option.
       * @param {Object} context the context object
       * @return {boolean} true if item.focusable option is derieved to be true, false otherwise
       */
      getItemFocusable: function (context) {
        return this._getItemOption('focusable', context, true);
      },

      /**
       * Gets the item.selectable option.
       * @param {Object} context the context object
       * @return {boolean} true if item.selectable option is derieved to be true, false otherwise
       */
      getItemSelectable: function (context) {
        // if it's not focusable, it's not selectable also
        return this.getItemFocusable(context) && this._getItemOption('selectable', context, true);
      },

      /**
       * Gets the item renderer
       * @return {function(Object)|null} returns the item renderer
       * @private
       */
      _getItemRenderer: function () {
        var renderer = this._getItemOption('renderer', null, false);
        if (typeof renderer !== 'function') {
          // cannot be non-function
          return null;
        }
        return this._WrapCustomElementRenderer(renderer);
      },

      /**
       * Returns the inline template element inside oj-list-view
       * @return {Element|null} the inline template element
       */
      getItemTemplate: function () {
        if (this.m_template === undefined) {
          // cache the template, assuming replacing template will require refresh
          this.m_template = null;
          if (this.ojContext._IsCustomElement()) {
            var slotMap = this.GetSlotMap();
            var slot = slotMap.itemTemplate;
            if (slot && slot.length > 0 && slot[0].tagName.toLowerCase() === 'template') {
              this.m_template = slot[0];
            }
          }
        }
        return this.m_template;
      },

      /**
       * Returns the value of as option
       * @return {string}
       */
      getAs: function () {
        return this.GetOption('as');
      },

      /**
       * Returns the slot map object.
       * @return {object} slot Map
       */
      GetSlotMap: function () {
        return ojcustomelementUtils.CustomElementUtils.getSlotMap(this.GetRootElement()[0]);
      },

      /**
       * Called by content handler once the content of an item is rendered triggered by an insert event
       * @param {Element} elem the item element
       * @param {Object} context the context object used for the item
       */
      // eslint-disable-next-line no-unused-vars
      itemInsertComplete: function (elem, context) {
        // clear cached height
        this.m_clientHeight = null;
        this.m_scrollHeight = null;
      },

      /**
       * Called by content handler once the content of an item is rendered triggered by an insert event
       */
      BeforeInsertItem: function () {
        // hook for NavList
      },

      /**
       * Called by content handler once the content of an item is removed triggered by an remove event
       * @param {Element} elem the item element
       * @param {boolean} restoreFocus true if focus should be restore, false otherwise
       * @param {boolean} isReinsert true if the item is going to be re-insert in the same event
       */
      itemRemoveComplete: function (elem, restoreFocus, isReinsert) {
        var currentItemUpdated = false;

        // if it's the current focus item, try to focus on the next/prev item.  If there are none, then focus on the root element
        if (this.m_active != null && oj.Object.compareValues(this.m_active.key, this.GetKey(elem))) {
          // make sure we exit actionable mode, otherwise focus will be lost
          this._setActionableMode(false, true);

          // do not change currentItem if the item is going to be inserted in the same event
          if (!isReinsert) {
            let next = null;
            let items = this._getItemsCache().toArray();
            items = items.filter((item) => !item.classList.contains('oj-skipfocus'));
            const elemIndex = items.findIndex((item) => elem.contains(item));
            if (elemIndex === -1) {
              this.SetOption('currentItem', null);
            } else {
              // when the next element is from the other group, we set the next element
              // to the last element of current group if there is one
              const elemGroup = elem.closest('ul.oj-listview-group');
              const nextElem = items[elemIndex + 1];
              const prevElem = items[elemIndex - 1];
              if (
                elemGroup &&
                nextElem &&
                prevElem &&
                nextElem.closest('ul') !== elemGroup &&
                prevElem.closest('ul') === elemGroup
              ) {
                next = prevElem;
              } else {
                next = nextElem;
                if (
                  next == null ||
                  (!next.classList.contains(this.getItemElementStyleClass()) &&
                    !next.classList.contains('oj-listview-temp-item'))
                ) {
                  next = prevElem;
                  if (next == null || !next.classList.contains(this.getItemElementStyleClass())) {
                    this.SetOption('currentItem', null);
                  }
                }
              }
            }

            if (
              next != null &&
              (next.classList.contains(this.getItemElementStyleClass()) ||
                next.classList.contains('oj-listview-temp-item'))
            ) {
              this.SetCurrentItem($(next), null, !restoreFocus);
              currentItemUpdated = true;
            }
          }
        }

        // disassociate element from key map
        if (elem != null && elem.id && this.m_keyElemMap != null) {
          this.m_keyElemMap.delete(elem.id);
        }

        // clear cached height
        this.m_clientHeight = null;
        this.m_scrollHeight = null;

        return currentItemUpdated;
      },

      /**
       * Called by content handler once the content of an item is rendered
       * @param {Element} elem the item element
       * @param {Object} context the context object used for the item
       */
      itemRenderComplete: function (elem, context) {
        // dnd
        if (this.m_dndContext != null) {
          this.m_dndContext.itemRenderComplete(elem);
        }

        var key = context.key;

        // update as selected if it is in selection, check if something already selected in single selection
        if (this._isSelectionEnabled()) {
          var selected = this.GetOption('selected');
          var selectedItems;
          var exists = selected.has(key);
          if (this.IsSelectable(elem)) {
            if (exists) {
              this._applySelection(elem, key);

              // if it's single selection, then bail
              if (!this._isMultipleSelection()) {
                if (selected.values().size > 1) {
                  // we'll have to modify the value
                  selectedItems = this.FindElementByKey(key);
                  selected = selected.clear().add([key]);
                  this._setSelectionOption(selected, null, selectedItems, context.data);
                }
              }
            }

            // if selectionRequired is set to true and selection is empty, selects the first selectable item
            // this should be run once since selection won't be empty afterwards
            if (selected.values && selected.values().size === 0 && this._isSelectionRequired()) {
              this._applySelection(elem, key);
              // need to pass data since 1) to avoid unneccesary lookup 2) since item is not in live dom, getDataForVisibleItem would not work
              selected = selected.clear().add([key]);
              this._setSelectionOption(selected, null, [elem], context.data);
            }
          } else if (exists && !selected.isAddAll()) {
            // the selection is invalid, remove it from selection
            selectedItems = [];

            selected = selected.delete([key]);
            selected.values().forEach(function (aKey) {
              selectedItems.push(this.FindElementByKey(aKey));
            }, this);

            this._setSelectionOption(selected, null, selectedItems);
          }
        }

        var self = this;

        // update if it is in expanded, ensure data is hierarchical
        if (this.m_contentHandler.IsHierarchical() && this._ignoreExpanded == null) {
          // checks if it is expandable && is collapsed
          if (this.GetState($(elem)) === this.STATE_COLLAPSED) {
            var expanded = this.GetOption('expanded');
            // checks if expand all
            if (this._isExpandAll(key)) {
              // for legacy syntax, expanded is not real-time in certain cases, i.e. you
              // can have expanded='all' but some itms are collapsed
              // for custom element we don't care about collapsedKeys since KeySet is keeping track of it
              if (this.ojContext._IsCustomElement() || this._collapsedKeys == null) {
                // don't animate
                this.ExpandItem($(elem), null, false, null, false, false, false);
              }
            } else if (!this.ojContext._IsCustomElement() && Array.isArray(expanded)) {
              // legacy syntax array of expanded keys
              // checks if specified expanded
              $.each(expanded, function (_index, value) {
                // if it was explicitly collapsed
                if (
                  value === key &&
                  (self._collapsedKeys == null || self._collapsedKeys.indexOf(value) === -1)
                ) {
                  // don't animate
                  self.ExpandItem($(elem), null, false, null, false, false, false);
                }
              });
            } else if (expanded.has) {
              // KeySet case
              if (expanded.has(key)) {
                // don't animate
                this.ExpandItem($(elem), null, false, null, false, false, false);
              }
            }
          }
        }

        // checks if the active element has changed, this could happen in TreeDataSource, where the element gets remove when collapsed
        // or when the item updated (mutation event) is the current item
        if (
          this.m_active != null &&
          key === this.m_active.key &&
          this.m_active.elem != null &&
          elem !== this.m_active.elem.get(0)
        ) {
          this.m_active.elem = $(elem);
        }
      },

      /**
       * Returns the noData template element inside oj-list-view
       * @return {Element|null} the content of noData slot
       * @private
       */
      _addNoData: function () {
        if (this.ojContext._IsCustomElement()) {
          var slotMap = this.GetSlotMap();
          var slot = slotMap.noData;
          if (slot && slot.length > 0 && slot[0].tagName.toLowerCase() === 'template') {
            var noDataContentRoot = document.createElement('li');
            noDataContentRoot.setAttribute('role', 'row');
            noDataContentRoot.id = this._createSubId('empty');
            noDataContentRoot.classList.add(this.getNoDataItemStyleClass());
            noDataContentRoot.classList.add('oj-listview-no-data-container');

            var noDataContent = document.createElement('div');
            noDataContent.setAttribute('role', 'gridcell');
            noDataContent.setAttribute('tabIndex', '0');
            noDataContent.classList.add(this.getNoDataCellElementStyleClass());
            noDataContent.classList.add('oj-listview-no-data-container');

            noDataContentRoot.appendChild(noDataContent);

            var root = this.element;
            root.addClass('oj-listview-no-data-container');
            root.append(noDataContentRoot); // @HTMLUpdateOK

            var self = this;
            this.signalTaskStart('run no data template');
            const templateOptions = {
              customElement: this._GetCustomElement()
            };
            Config.__getTemplateEngine(templateOptions).then(
              function (engine) {
                var nodes = engine.execute(self.GetRootElement(), slot[0], {}, null);
                nodes.forEach(function (node) {
                  noDataContent.appendChild(node); // @HTMLUpdateOK
                });
                self.m_engine = engine;
                self.signalTaskEnd();
              },
              function (reason) {
                self.signalTaskEnd();
                throw new Error('Error loading template engine: ' + reason);
              }
            );
            return;
          }
        }
        // non-custom element or when noData slot is specified
        this.element.append(this._buildEmptyText()); // @HTMLUpdateOK
      },

      /**
       * Remove empty element artifacts from list
       * @private
       */
      _removeNoData: function () {
        this.element.removeClass('oj-listview-no-data-container');

        var elem = document.getElementById(this._createSubId('empty'));
        if (elem) {
          if (this.m_engine) {
            this.m_engine.clean(elem);
          }
          elem.parentNode.removeChild(elem);
        }
      },

      /**
       * Called by content handler see handleModelRemoveEvent
       */
      resetInitialSelectionStateValidated: function () {
        this.m_initialSelectionStateValidated = false;
      },

      /**
       * Called by content handler once content of all items are rendered
       */
      renderComplete: function (skipSyncScrollPosition) {
        var self = this;

        this.hideStatusText();

        // remove any empty text div
        this._removeNoData();

        // clear items cache
        this.m_items = null;
        this.m_groupItems = null;

        // clear cached scrollHeight
        this.m_scrollHeight = null;

        // if grid role and card layout and non-heirarchical and presentation div is empty, remove presentation div to clear out the element
        if (this._isEmptyGrid()) {
          this.element[0].removeChild(this.element[0].children[0]);
        }

        // check if it's empty
        if (this._isEmpty()) {
          this._addNoData();

          // fire ready event
          this.Trigger('ready', null, {});

          return null;
        }

        // check if current is specified
        var current = this.GetOption('currentItem');
        if (current != null) {
          var elem = this.FindElementByKey(current);
          if (elem == null) {
            // it's not valid anymore, reset current
            this.SetOption('currentItem', null);
          } else if (this.m_active == null && !this.SkipFocus($(elem))) {
            var active = document.activeElement;
            // update tab index and focus only if listview currently has focus
            if (active && this.element.get(0).contains(active)) {
              this.ActiveAndFocus($(elem), null);
            } else {
              // update internal state only
              this._setActive($(elem), null, true);
            }
          }
        }

        // if listview has focus but there's no active element, then set focusable item
        // this could happen after refresh from context menu
        if (
          this.getListContainer().hasClass('oj-focus-ancestor') &&
          this.m_active == null &&
          current == null &&
          !this._isTouchSupport()
        ) {
          this._initFocus();
        }

        // clear the scroll and fetch flag before calling syncScrollPosition
        this.m_scrollAndFetch = undefined;

        // update scroll position if it's not in sync, make sure we are not in the middle of scrolling
        if (this.m_scrollPosition != null || (!skipSyncScrollPosition && !this.m_ticking)) {
          this.syncScrollPosition();
        }

        // validate selection as needed
        // only do the validation once for initial render/refresh
        if (
          !this.m_initialSelectionStateValidated &&
          this._isSelectionEnabled() &&
          this._isSelectionRequired()
        ) {
          // take a snapshot of the value since the value is live and mutable
          var selection = this.GetOption('selection').slice(0);
          this._validateAndUpdateSelection(selection);
          this.m_initialSelectionStateValidated = true;
        }

        // update firstSelectedItem as needed
        if (this._isSelectionEnabled()) {
          var firstSelectedItem = this.GetOption('firstSelectedItem');
          if (firstSelectedItem == null || firstSelectedItem.key == null) {
            var selected = this.GetOption('selected');
            if (selected != null) {
              this._updateFirstSelectedItem(selected);
            }
          }
        }

        // about gridlines for last item
        if (this.m_gridlinePlaceholder != null && this.m_gridlinePlaceholder.parentNode != null) {
          this.m_gridlinePlaceholder.parentNode.removeChild(this.m_gridlinePlaceholder);
        }
        if (
          (this.m_contentHandler.hasMoreToFetch === undefined ||
            (this.m_contentHandler.hasMoreToFetch && !this.m_contentHandler.hasMoreToFetch())) &&
          this._shouldRenderGridlineForLastItem()
        ) {
          var gridlinePlaceholder = document.createElement('li');
          gridlinePlaceholder.setAttribute('role', 'presentation');
          gridlinePlaceholder.className = 'oj-listview-gridline-placeholder';
          this.element[0].appendChild(gridlinePlaceholder);

          this.m_gridlinePlaceholder = gridlinePlaceholder;
        }

        var _animationPromise = null;

        // apply card entrance animation
        if (this._isAnimateCards()) {
          var isInitial = this.element[0].querySelector('.oj-listview-card-animated') == null;
          var delay = 0;
          var increment = this._getCardEntranceAnimationDelay();
          // so that scrollbar would not be shown when slide in
          if (isInitial) {
            this.element[0].classList.add('oj-animation-host-viewport');
          }
          this.element[0]
            .querySelectorAll('.oj-listview-card:not(.oj-listview-card-animated)')
            .forEach(function (card) {
              // mark as animated so we can filter it next time
              card.classList.add('oj-listview-card-animated');
              if (isInitial) {
                var effects = self.getAnimationEffect('cardEntrance');
                if (effects) {
                  effects.forEach(function (effect) {
                    // eslint-disable-next-line no-param-reassign
                    effect.delay = delay + 'ms';
                  });
                }
                _animationPromise = self.StartAnimation(card, 'cardEntrance', effects);
                delay = Math.min(1000, delay + increment);
              } else {
                AnimationUtils.fadeIn(card, { duration: '150ms' });
              }

              if (_animationPromise) {
                _animationPromise.then(function () {
                  self.element[0].classList.remove('oj-animation-host-viewport');
                });
              }
            });
        }

        // fire ready event
        this.Trigger('ready', null, {});

        return _animationPromise;
      },

      /**
       * Retrieve the animation delay between card entrance animation
       * @return {number} the delay in ms
       * @private
       */
      _getCardEntranceAnimationDelay: function () {
        var defaultOptions = this._getOptionDefaults();
        var delay = parseInt(defaultOptions.cardAnimationDelay, 10);

        return isNaN(delay) ? 0 : delay;
      },

      /**
       * Gets all the keys that are already fetched
       * @private
       */
      _getLocalKeys: function () {
        var keys = [];
        var items = this._getItemsCache();
        for (var i = 0; i < items.length; i++) {
          keys.push(this.GetKey(items[i]));
        }
        return keys;
      },

      /**
       * Validate keys and update selection, enforce selection required as needed
       * @private
       */
      _validateAndUpdateSelection: function (selection) {
        if (this._isSelectionRequired() && selection.length > 0) {
          var previousLength = selection.length;
          var validateSelectionPromise = this._validateSelection(selection);
          if (validateSelectionPromise) {
            this.signalTaskStart('validating selection-required keys');
            validateSelectionPromise.then(
              function (validSelection) {
                var newSelected = this.GetOption('selected').clear().add(validSelection);
                this._setSelectionOption(newSelected, null, null, null);
                this.enforceSelectionRequired();
                this.signalTaskEnd();
              }.bind(this)
            );
          } else if (previousLength !== selection.length) {
            var newSelected = this.GetOption('selected').clear().add(selection);
            this._setSelectionOption(newSelected, null, null, null);
            this.enforceSelectionRequired();
          }
        }
      },

      /**
       * Validate keys in selection
       * @private
       */
      _validateSelection: function (selection) {
        this.m_validatedSelectedKeyData = null;

        var validatedKeys = selection;
        var localKeys = this._getLocalKeys();
        var invalidLocalKeys = [];
        selection.forEach(function (key) {
          if (localKeys.indexOf(key) === -1) {
            invalidLocalKeys.push(key);
          }
        });

        // if any keys are not locally available, attempt to validate keys in the data provider
        if (invalidLocalKeys.length > 0) {
          var validRowKeyDataPromise = this._fetchValidRowKeyData(invalidLocalKeys);
          if (validRowKeyDataPromise) {
            var validateSelectionPromise = validRowKeyDataPromise.then(
              function (validRowKeyData) {
                this.m_validatedSelectedKeyData = validRowKeyData.validKeyData;
                validRowKeyData.validKeys.forEach(function (key) {
                  invalidLocalKeys.splice(invalidLocalKeys.indexOf(key), 1);
                });
                for (var i = validatedKeys.length - 1; i >= 0; i--) {
                  if (invalidLocalKeys.indexOf(validatedKeys[i]) > -1) {
                    validatedKeys.splice(i, 1);
                  }
                }
                return validatedKeys;
              }.bind(this)
            );
            return validateSelectionPromise;
          }

          for (var i = validatedKeys.length - 1; i >= 0; i--) {
            if (invalidLocalKeys.indexOf(validatedKeys[i]) > -1) {
              validatedKeys.splice(i, 1);
            }
          }
        }
        return null;
      },

      /**
       * Validate keys in selected
       * @private
       */
      _fetchValidRowKeyData: function (keys) {
        // need to verify keys if we have a DataProvider that supports non-iteration 'fetchByKeys'
        var dataProvider = this.m_contentHandler.getDataProvider();
        if (dataProvider && dataProvider.getCapability) {
          var capability = dataProvider.getCapability('fetchByKeys');
          if (capability && capability.implementation === 'lookup') {
            return new Promise(function (resolve) {
              dataProvider.fetchByKeys({ keys: new Set(keys), scope: 'global' }).then(
                function (fetchResult) {
                  var validKeys = [];
                  var validKeyData = new KeyMap();
                  var validKeysResult = fetchResult.results;
                  validKeysResult.forEach(function (value, key) {
                    validKeys.push(key);
                    validKeyData.set(key, value.data);
                  });
                  resolve({ validKeys: validKeys, validKeyData: validKeyData });
                },
                function () {
                  // something bad happened, treat keys as invalid
                  resolve({ validKeys: [], validData: new Map() });
                }
              );
            });
          }
        }
        // if we can't validate, return null
        return null;
      },

      /**
       * Returns whether or not the li presentation div is present and empty.
       * @private
       * @returns {boolean} true if li presentation div is present and empty.
       */
      _isEmptyGrid: function () {
        return (
          this.ShouldUseGridRole() &&
          this.isCardLayout() &&
          !this.m_contentHandler.IsHierarchical() &&
          this.element[0].children[0] &&
          this.element[0].children[0].children[0].childElementCount === 0
        );
      },

      /**
       * @private
       */
      _setScrollY: function (scroller, y) {
        var initialScrollTop = scroller.scrollTop;
        Logger.info('Setting scroll y: ' + y + ' initial scrollTop: ' + initialScrollTop);

        if (!this._skipScrollUpdate) {
          this._setScrollPosBusyState();
        }

        // flag it so that handleScroll won't do anything
        this._skipScrollUpdate = true;
        // eslint-disable-next-line no-param-reassign
        scroller.scrollTop = y;

        // update sticky header as needed
        this._handlePinGroupHeader();

        // if scroll didn't happen, clear busy state
        Logger.info('scrollTop after updating: ' + scroller.scrollTop);
        if (initialScrollTop === scroller.scrollTop) {
          Logger.info('scrollPosBusyState getting clear');
          this._clearScrollPosBusyState();
          return false;
        }
        return true;
      },

      /**
       * Sets the bidi independent position of the horizontal scroll position that
       * is consistent across all browsers.
       * @private
       */
      _setScrollX: function (scroller, x) {
        // flag it so that handleScroll won't do anything
        this._skipScrollUpdate = true;

        DomUtils.setScrollLeft(scroller, x);
      },

      /**
       * Retrieve the bidi independent position of the horizontal scroll position that
       * is consistent across all browsers.
       * @private
       */
      _getScrollX: function (scroller) {
        return Math.abs(scroller.scrollLeft);
      },

      /**
       * Invoked by ContentHandler
       */
      getScrollToKey: function () {
        var scrollPosition = this.GetOption('scrollPosition');
        if (scrollPosition) {
          var key = scrollPosition.key;
          if (key) {
            var self = this;
            return new Promise(function (resolve) {
              var result = self._validateKeyForScroll(key, true);
              if (result == null) {
                resolve(null);
              } else {
                result.then(function (value) {
                  resolve(value ? key : null);
                });
              }
            });
          }
        }
        return Promise.resolve(null);
      },

      /**
       * Validate a key for scrolling purposes
       * @param {any} key the key to validate
       * @param {boolean} skipLocal whether to skip checking of local cache
       * @return {Promise|null} a Promise that resolves to true if one of the keys specified is valid, false otherwise.
       *                        Returns null if it cannot validate the keys or scrollByKey behavior is set to 'never'.
       * @private
       */
      _validateKeyForScroll: function (key, skipLocal) {
        var self = this;

        // scrollToKey set to never or DataProvider cannot have the right capability
        if (!this._isScrollToKey()) {
          return null;
        }

        // found the key in cache, we are done
        if (!skipLocal && this.FindElementByKey(key) != null) {
          return Promise.resolve(true);
        }

        // need to verify key if we have a DataProvider that supports ContainsKeys
        if (
          this.m_contentHandler instanceof DataProviderScroller.IteratingDataProviderContentHandler
        ) {
          var dataProvider = this.m_contentHandler.getDataProvider();
          if (dataProvider.containsKeys) {
            return new Promise(function (resolve) {
              // IE 11 does not support specifying value in constructor
              var set = new Set();
              set.add(key);

              self.signalTaskStart('Checking for keys');
              dataProvider.containsKeys({ keys: set }).then(
                function (value) {
                  resolve(value.results.size > 0);
                  self.signalTaskEnd();
                },
                function () {
                  // something bad happened, treat it as invalid key
                  self.signalTaskEnd();
                  resolve(false);
                }
              );
            });
          }
        }
        // else we can't verify, so just return null and let syncScrollPosition tries to fetch
        // and find the item
        return null;
      },

      /**
       * @private
       */
      _getScrollHeight: function () {
        if (this.m_scrollHeight == null) {
          this.m_scrollHeight = this._getScroller().scrollHeight;
        }
        return this.m_scrollHeight;
      },

      /**
       * @private
       */
      _getClientHeight: function () {
        if (this.m_clientHeight == null) {
          this.m_clientHeight = this._getScroller().clientHeight;
        }
        return this.m_clientHeight;
      },

      /**
       * @private
       */
      _getScrollWidth: function () {
        if (this.m_scrollWidth == null) {
          this.m_scrollWidth = this._getScroller().scrollWidth;
        }
        return this.m_scrollWidth;
      },

      /**
       * @private
       */
      _getClientWidth: function () {
        if (this.m_clientWidth == null) {
          this.m_clientWidth = this._getScroller().clientWidth;
        }
        return this.m_clientWidth;
      },

      /**
       * @private
       */
      _isScrollable: function () {
        return this._isScrollableY() || this._isScrollableX();
      },

      _isScrollableX: function () {
        return Math.abs(this._getScrollWidth() - this._getClientWidth()) > 1;
      },

      _isScrollableY: function () {
        var adjustments = 0;
        if (this.m_contentHandler.getLoadingIndicator) {
          var loadingIndicator = this.m_contentHandler.getLoadingIndicator();
          if (loadingIndicator != null) {
            adjustments = loadingIndicator.offsetHeight;
          }
        }
        // don't use cache value, since that could be incorrect due to animation and timing
        var scroller = this._getScroller();
        var scrollHeight = scroller.scrollHeight;
        var clientHeight = scroller.clientHeight;
        return Math.abs(scrollHeight - clientHeight) - adjustments > 1;
      },

      /**
       * Synchronize the scroll position
       * @protected
       */
      syncScrollPosition: function (position, validateKey) {
        var self = this;
        var coord;
        var x;
        var y;
        var scrollTop;

        // we do not need to handle scrollPosition for NavList
        if (!this.ShouldUseGridRole()) {
          return;
        }

        // eslint-disable-next-line no-param-reassign
        validateKey = validateKey === undefined ? true : validateKey;

        // check if it's even scrollable, note due to sub-pixel issue, doing
        // an exact match will not work at all times
        if (!this._isScrollable()) {
          return;
        }

        if (this.ShouldUpdateScrollPosition()) {
          if (this.m_scrollPosition != null) {
            // eslint-disable-next-line no-param-reassign
            position = this.m_scrollPosition;
          } else if (position === undefined) {
            // eslint-disable-next-line no-param-reassign
            position = this.GetOption('scrollPosition');
          }

          if (validateKey && position.key != null) {
            var promise = this._validateKeyForScroll(position.key, false);
            if (promise) {
              promise.then(function (valid) {
                if (self.m_contentHandler != null) {
                  if (!valid) {
                    // remove invalid or non-existing key
                    // eslint-disable-next-line no-param-reassign
                    delete position.key;
                  }
                  // try again
                  self.syncScrollPosition(position, false);
                }
              });
            }
            // if _validateKeys returns null it means either 1) the key is not fetched yet and the DataProvider
            // is not capable of supporting fast (immediate) iteration speed on fetchFirst or 2) scrollToKey
            // behavior is set to 'never'
            return;
          }

          // figure out what the final y should be
          coord = this._getScrollCoordinates(position);
          x = coord.x;
          y = coord.y;

          if (isNaN(x) && isNaN(y)) {
            // invalid scroll position
            if (this.m_scrollPosition != null) {
              // we'll still need to report current scroll position, which could have changed because of scroll and fetch
              this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {
                _context: {
                  originalEvent: null,
                  internalSet: true
                }
              });

              // free signalTaskStart from earlier when m_scrollPosition is saved
              this.signalTaskEnd();
              this.m_scrollPosition = null;
            }
            return;
          }
        }

        if (coord === undefined) {
          // legacy scrollTop attribute
          y = this.GetOption('scrollTop');
        }

        var scroller = this._getScroller();
        scrollTop = scroller.scrollTop;
        // check if only x updated
        if (
          (!isNaN(x) && isNaN(y)) ||
          (!isNaN(x) && y === scrollTop && x !== this._getScrollX(scroller, x))
        ) {
          // if not horizontally scrollable then bail
          if (!this._isScrollableX()) {
            this._clearOutstandingScrollPosition();
            return;
          }

          this._setScrollX(scroller, x);
          var scrollPosition = this.GetOption('scrollPosition');
          x = this._getScrollX(scroller);
          var newScrollPosition = {
            x: x,
            y: scrollPosition.y,
            index: scrollPosition.index,
            key: scrollPosition.key,
            offsetX: x,
            offsetY: scrollPosition.offsetY
          };
          if (scrollPosition.parent) {
            newScrollPosition.parent = scrollPosition.parent;
          }
          this.SetOption('scrollPosition', newScrollPosition, {
            _context: {
              originalEvent: null,
              internalSet: true
            }
          });
        } else if (Math.abs(scrollTop - y) >= 1) {
          var scrollUpdated = false;
          // flag it so that handleScroll won't do anything
          if (this._isScrollableY()) {
            scrollUpdated = this._setScrollY(scroller, y);
          }
          if (!isNaN(x) && x !== this._getScrollX(scroller, x) && this._isScrollableX()) {
            this._setScrollX(scroller, x);
            scrollUpdated = true;
          }

          // if nothing is updated, just bail
          if (!scrollUpdated) {
            // still need to update scrollPosition for the scroll and fetch case
            if (this.m_scrollPosition) {
              this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {
                _context: {
                  originalEvent: null,
                  internalSet: true
                }
              });
            }
            this._clearOutstandingScrollPosition();
            return;
          }

          // checks if further scrolling is needed
          scrollTop = scroller.scrollTop;
          // cannot use scrollTop === y, as browser sub-pixel could be off by < 1px
          if (
            Math.abs(scrollTop - y) >= 1 &&
            this.m_contentHandler.hasMoreToFetch &&
            this.m_contentHandler.hasMoreToFetch()
          ) {
            if (this.m_scrollPosition == null) {
              // we don't need to signalTaskStart again if we are already in one
              this.signalTaskStart('Scroll position needs to resolve further');
            }
            this.m_scrollAndFetch = true;

            // yes, save the scrollPosition to set and bail
            this.m_scrollPosition = position;
            return;
          }

          // ok to update scrollPosition option
          this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {
            _context: {
              originalEvent: null,
              internalSet: true
            }
          });
        } else if (position && (position.key == null || isNaN(position.index))) {
          // if x and y is present, but position value is not complete, get it
          // ok to update scrollPosition option
          this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {
            _context: {
              originalEvent: null,
              internalSet: true
            }
          });
        }

        this._clearOutstandingScrollPosition();
      },

      /**
       * Clear the variable for intermediate scrollPosition (that require fetch)
       * @private
       */
      _clearOutstandingScrollPosition: function () {
        if (this.m_scrollPosition != null) {
          // free signalTaskStart from earlier when m_scrollPosition is saved
          this.signalTaskEnd();
          this.m_scrollPosition = null;
        }
      },

      /**
       * When an item is updated, if the item happens to be the current item and it previously has focus, then
       * we'll need to restore focus.
       * @protected
       */
      restoreCurrentItemFocus: function (elem) {
        if (this._isInViewport(elem)) {
          this._setActive($(elem), null, false);
        }
      },
      /**
       * Called by content handler to reset the state of ListView
       * @private
       */
      ClearCache: function (clearKeyMap) {
        // clear any element dependent cache
        this.m_items = null;
        this.m_groupItems = null;
        if (clearKeyMap && this.m_keyElemMap != null) {
          this.m_keyElemMap.clear();
        }
      },

      /**
       * Determine the minimum number of items needed to fill the viewport
       * @protected
       */
      getMinimumCountForViewport: function () {
        var itemHeight = this._getItemHeight();
        var clientHeight = this._getClientHeight();
        if (!isNaN(itemHeight) && itemHeight > 0) {
          var numOfItems = Math.ceil(clientHeight / itemHeight);
          return numOfItems;
        }
        return 1;
      },

      /**
       * Checks whether the specified element is within the viewport
       * @private
       */
      _isInViewport: function (elem) {
        return DataCollectionUtils.isElementIntersectingScrollerBounds(elem, this._getScroller());
      },

      /**
       * Gets a list of actions that supports animation
       * @private
       */
      _getAnimatedActions: function () {
        return ['add', 'remove', 'update', 'expand', 'collapse'];
      },

      /**
       * Utility method to start animation
       * @param {Element} elem element to animate
       * @param {string} action the animation action
       * @param {Object=} effect optional animation effect, if not specified then it will be derived based on action
       * @return {Promise} the promise which will be resolve when animation ends
       * @protected
       */
      StartAnimation: function (elem, action, effect) {
        // if it's not in viewport, don't animate.  Only do this for default animations.
        // For example, do not do this optimization for NavList specific animations.
        if (this._getAnimatedActions().indexOf(action) > -1 && !this._isInViewport(elem)) {
          return Promise.resolve(null);
        }

        if (effect == null) {
          // eslint-disable-next-line no-param-reassign
          effect = this.getAnimationEffect(action);
        }

        var originalHeight;
        var originalMaxHeight;
        if (action === 'expand') {
          var initialHeight = elem.getAttribute('data-oj-initial-height');
          if (initialHeight != null && !isNaN(initialHeight)) {
            // clone it to inject additional effect options
            // eslint-disable-next-line no-param-reassign
            effect = Object.assign({}, effect);
            // eslint-disable-next-line no-param-reassign
            effect.startMaxHeight = initialHeight + 'px';
            var contentHeight = elem.offsetHeight;
            // in the shrink case (skeleton height is taller than actual content height)
            if (contentHeight < initialHeight) {
              originalMaxHeight = elem.style.maxHeight;
              originalHeight = elem.style.height;
              // eslint-disable-next-line no-param-reassign
              elem.style.maxHeight = 'none';
              // eslint-disable-next-line no-param-reassign
              elem.style.height = initialHeight + 'px';
              // eslint-disable-next-line no-param-reassign
              effect.effect = 'collapse';
              // eslint-disable-next-line no-param-reassign
              effect.endMaxHeight = contentHeight + 'px';
            }
            elem.removeAttribute('data-oj-initial-height');
          }
        }

        // eslint-disable-next-line no-undef
        var promise = AnimationUtils.startAnimation(elem, action, effect, this.ojContext);
        if (originalHeight !== undefined) {
          promise.then(function () {
            // eslint-disable-next-line no-param-reassign
            elem.style.height = originalHeight;
            // eslint-disable-next-line no-param-reassign
            elem.style.maxHeight = originalMaxHeight;
          });
        }
        return promise;
      },

      /** ******************* context menu methods *****************/
      /**
       * @param {!Object} menu The JET Menu to open as a context menu.  Always non-<code class="prettyprint">null</code>.
       * @param {!Event} event What triggered the menu launch.  Always non-<code class="prettyprint">null</code>.
       * @param {string} eventType "mouse", "touch", or "keyboard".  Never <code class="prettyprint">null</code>.
       * Invoked by widget
       */
      notifyContextMenuGesture: function (menu, event, eventType) {
        // first check if we are invoking on an editable or clickable element If so bail
        var noData = this.element[0].querySelector('.oj-listview-no-data-item');
        if (noData == null && this.IsNodeEditableOrClickable($(event.target))) {
          return false;
        }

        // set the item right click on active
        var parent = $(event.target).closest('.' + this.getItemElementStyleClass());
        if (parent.length > 0 && !this.SkipFocus($(parent[0]))) {
          this.SetCurrentItem($(parent[0]), null);
        }

        // for Tabbar/NavList, the custom element is the focusable element, so using
        // this.element (<ul>) won't work, use this.ojContext.element instead
        // which works for ListView as well as Tabbar/NavList
        var openOptions = { launcher: this.ojContext.element, initialFocus: 'menu' };

        if (eventType === 'keyboard') {
          var posOf = this.m_active != null ? this.m_active.elem : this.element;
          openOptions.position = { my: 'start top', at: 'start bottom', of: posOf };
        }

        if (this.ojContext._GetContextMenu() == null) {
          // wait for menu to be close first
          Context.getContext(menu)
            .getBusyContext()
            .whenReady()
            .then(
              function () {
                // prepare the context menu that have listview specific menu items
                this.PrepareContextMenu(parent);
                this.ojContext._OpenContextMenu(event, eventType, openOptions);
              }.bind(this)
            );
        } else {
          this.PrepareContextMenu(parent);
          this.ojContext._OpenContextMenu(event, eventType, openOptions);
        }
        return undefined;
      },

      /**
       * Decorates or prepares context menu items. Navlist need overrides this to decorate remove menu item.
       * @param {jQuery} item  Item
       * @protected
       * @ignore
       */
      // eslint-disable-next-line no-unused-vars
      PrepareContextMenu: function (item) {
        var contextMenu = this.ojContext._GetContextMenu();
        if (this.m_dndContext != null && contextMenu) {
          this.m_dndContext.prepareContextMenu(contextMenu);
        }
      },

      /**
       * Override helper for NavList to override checks for whether a node is editable or clickable.
       * @param {jQuery} node  Node
       * @return {boolean} true or false
       * @protected
       */
      IsElementEditableOrClickable: function (node) {
        var nodeName = node.prop('nodeName');
        return nodeName.match(/^INPUT|SELECT|OPTION|BUTTON|^A\b|TEXTAREA/) != null;
      },

      /**
       * Return whether the node is editable or clickable.  Go up the parent node as needed.
       * @param {jQuery} node  Node
       * @return {boolean} true or false
       * @protected
       */
      IsNodeEditableOrClickable: function (node) {
        while (node != null && node[0] !== this.element[0] && node.prop('nodeName') !== 'LI') {
          // If the node is a text node, move up the hierarchy to only operate on elements
          // (on at least the mobile platforms, the node may be a text node)
          if (node[0].nodeType === 3) {
            // 3 is Node.TEXT_NODE
            // eslint-disable-next-line no-param-reassign
            node = node.parent();
          } else {
            var tabIndex = node.attr('tabIndex');
            // listview overrides the tab index, so we should check if the data-oj-tabindex is populated
            var origTabIndex = node.attr('data-oj-tabindex');

            if (
              tabIndex != null &&
              tabIndex >= 0 &&
              !node.hasClass(this.getFocusedElementStyleClass()) &&
              !node.hasClass('oj-listview-cell-element')
            ) {
              return true;
            } else if (this.IsElementEditableOrClickable(node)) {
              // ignore elements with tabIndex === -1
              if (tabIndex !== -1 || origTabIndex !== -1) {
                return true;
              }
            }
            // eslint-disable-next-line no-param-reassign
            node = node.parent();
          }
        }
        return false;
      },

      /** ******************* focusable/editable element related methods *****************/
      /**
       * Make all tabbable elements within the specified cell un-tabbable
       * @param {Element} element
       * @param {boolean=} excludeActiveElement see inline comment for details
       */
      disableAllTabbableElements: function (element, excludeActiveElement) {
        var elem = $(element);

        // if it's a group item, inspect the direct div only so it will skip all children
        if (!elem.hasClass(this.getItemStyleClass())) {
          elem = $(elem.get(0).firstElementChild);
        }

        // a group cell could have contained a cell element, which should be skip also
        if (elem.children().first().hasClass('oj-listview-cell-element')) {
          elem = $(elem.get(0).firstElementChild);
        }

        // should exclude non-visible elements, but doing a visible check here causes re-layout and since it's done
        // on every item on render, it becomes expensive.  Do the filter later in enableTabbableElements, which is only
        // triggered by entering actionable mode.
        if (elem[0]) {
          var elems = $(
            DataCollectionUtils.disableAllFocusableElements(elem[0], excludeActiveElement)
          );

          elems.each(function () {
            $(this).removeAttr('data-first').removeAttr('data-last');
          });
        }
      },

      /**
       * Make all tabbable elements before and include current item un-tabbable
       * @param {Element} item
       * @private
       */
      _disableAllTabbableElementsBeforeItem: function (item) {
        var items = this._getItemsCache();
        var index = items.index(item);

        // if -1 it will just bail
        for (var i = 0; i <= index; i++) {
          this.disableAllTabbableElements(items[i], true);
        }
      },

      /**
       * Make all tabbable elements after and include current item un-tabbable
       * @param {Element} item
       * @private
       */
      _disableAllTabbableElementsAfterItem: function (item) {
        var items = this._getItemsCache();
        var index = items.index(item);

        if (index === -1) {
          return;
        }

        for (var i = index; i <= items.length - 1; i++) {
          this.disableAllTabbableElements(items[i], true);
        }
      },

      /**
       * Make all previously tabbable elements within the element tabbable again
       * @param {jQuery} elem
       * @private
       */
      _enableAllTabbableElements: function (elem) {
        var elems = $(DataCollectionUtils.enableAllFocusableElements(elem[0]));

        // mark first and last tabbable element for fast retrieval later
        elems = elems.filter(':visible');
        elems.first().attr('data-first', 'true');
        elems.last().attr('data-last', 'true');
      },

      /**
       * Cleanup any attributes added by tabbing logic
       * @param {Element} elem the element to cleanup
       * @private
       */
      _cleanupTabbableElementProperties: function (elem) {
        DataCollectionUtils.enableAllFocusableElements(elem[0]).forEach(function (node) {
          node.removeAttribute('data-first');
          node.removeAttribute('data-last');
        });
      },

      /**
       * Checks whether the element is focusable
       * @param {jQuery} item the item to check
       * @return {boolean} true if the item should not be focusable, false otherwise
       * @protected
       */
      SkipFocus: function (item) {
        return item.hasClass('oj-skipfocus');
      },

      /** ************************************* Event handlers *****************************/
      /**
       * Returns the focus element, or the root element if nothing inside ListView has focus
       * @return {Element} the focus element inside ListView or the root element
       * @protected
       */
      GetFocusElement: function () {
        if (this.getListContainer().hasClass('oj-focus-ancestor')) {
          // find the focus item
          if (this.m_active) {
            return this.getFocusItem(this.m_active.elem)[0];
          }

          // empty text could have focus
          var emptyText = this.element.children('.' + this.getEmptyTextStyleClass()).first();
          if (emptyText.length > 0 && emptyText.attr('tabIndex') === 0) {
            return emptyText[0];
          }
        }

        return this.element[0];
      },

      /**
       * Determine whether the event is triggered by interaction with element inside ListView
       * Note that Firefox 48 does not support relatedTarget on blur event, see
       * _supportRelatedTargetOnBlur method
       * @param {Event} event the focus or blur event
       * @return {boolean} true if focus/blur is triggered by interaction with element within listview, false otherwise.
       * @private
       */
      _isFocusBlurTriggeredByDescendent: function (event) {
        if (event.relatedTarget === undefined) {
          return true;
        }

        if (
          event.relatedTarget == null ||
          !$.contains(this.ojContext.element.get(0), /** @type {Element} */ (event.relatedTarget))
        ) {
          return false;
        }
        return true;
      },

      /**
       * Handler for focus event
       * @param {Event} event the focus event
       * @protected
       */
      HandleFocus: function (event) {
        this._clearFocusoutTimeout();
        this._clearFocusoutBusyState();
        this.getListContainer().addClass('oj-focus-ancestor');

        // first time tab into listview, focus on first item
        if (this.m_active == null) {
          // checks whether there's pending click to active, and the focus target is not inside any item (if it is the focus will shift to that item) or it's a unfocusable item
          var item = this.FindItem($(event.target));
          if (
            !this.m_preActive &&
            !this._isFocusBlurTriggeredByDescendent(event) &&
            (item == null || item.length === 0 || this.SkipFocus(item))
          ) {
            this._initFocus(event);
          }
        } else {
          // focus could be caused by pending click to active
          // do not do this on iOS or Android, otherwise VO/talkback will not work correctly
          // Only one exception is when ever root node gets focus we should highlight active element
          // otherwise vo doesn't follow the focus. ex: when offcanvas is opened,
          // focus will be moved to root node
          if (
            !this.m_preActive &&
            event.target === this.ojContext.element[0] &&
            !this._isFocusBlurTriggeredByDescendent(event)
          ) {
            this._makeFocusable(this.m_active.elem);
            this.HighlightActive();
            this._focusItem(this.m_active.elem);
          }

          // remove tab index from root and restore tab index on focus item
          this.RemoveRootElementTabIndex();
          this._setTabIndex(this.m_active.elem);
        }
      },

      /**
       * Invoked by dnd context after drag end
       */
      restoreFocusAfterDrag: function () {
        if (this.m_active == null) {
          this._initFocus(null);
        } else {
          this._makeFocusable(this.m_active.elem);
          this.HighlightActive();
          this._focusItem(this.m_active.elem);
          this.RemoveRootElementTabIndex();
        }

        if (this.m_active) {
          this.m_active.elem.removeClass('oj-focus-highlight');
        }
      },
      /**
       * Initialize focus by finding the first focusable item and set focus on it
       * @private
       */
      _initFocus: function (event) {
        var items = this._getItemsCache();
        for (var i = 0; i < items.length; i++) {
          var item = $(items[i]);
          // make sure item can receive focus
          if (!this.SkipFocus(item)) {
            this.SetCurrentItem(item, event);
            break;
          }
        }

        if (items.length === 0) {
          // we need to focus on empty text
          var emptyText = this.element.children('.' + this.getEmptyTextStyleClass()).first();
          if (emptyText.length === 0) {
            emptyText = this.element.find('.oj-listview-no-data-container[role="row"]').first();
          }
          if (emptyText.length > 0) {
            emptyText.children().first().attr('tabIndex', 0);
            this._highlightElem(emptyText, 'oj-focus');
            emptyText.children().first().focus();

            this.RemoveRootElementTabIndex();
          }
        }
      },

      /**
       * Handler for focus out event
       * @param {Event} event the focusout event
       * @protected
       */
      HandleFocusOut: function (event) {
        this.HandleBlur(event);
      },

      /**
       * Checks whether the browser supports relatedTarget field for blur event
       * @return {boolean} true if supported, false otherwise
       * @private
       */
      _supportRelatedTargetOnBlur: function () {
        if (DataCollectionUtils.isFirefox() && DataCollectionUtils.getBrowserVersion() < 48) {
          return false;
        }

        return true;
      },

      /**
       * Detects whether this is a double blur event fired by IE11
       * @param {Event} event the blur event
       * @private
       */
      _isExtraBlurEvent: function (event) {
        if (
          event.relatedTarget == null &&
          DataCollectionUtils.isIE() &&
          event.target === this.ojContext.element.get(0)
        ) {
          return true;
        }

        return false;
      },

      /**
       * Clears any pending focusout timeout.
       * @private
       */
      _clearFocusoutTimeout: function () {
        if (this._focusoutTimeout) {
          clearTimeout(this._focusoutTimeout);
          this._focusoutTimeout = null;
        }
      },

      /**
       * Sets the 'focusout' busy state.
       * @private
       */
      _setFocusoutBusyState: function () {
        if (!this._focusoutResolveFunc) {
          this._focusoutResolveFunc = this._addComponentBusyState('is handling focusout.');
        }
      },

      /**
       * Sets the 'scrollPos' busy state.
       * @private
       */
      _setScrollPosBusyState: function () {
        if (!this.ojContext._IsCustomElement()) {
          // for widget based ListView, consumers rely on the widget's whenReady method
          // which relies on signalTaskStart/signalTaskEnd, changing it requires a lot of work
          this.signalTaskStart('waiting for scroll handler');
        } else if (!this._scrollPosResolveFunc) {
          this._scrollPosResolveFunc = this._addComponentBusyState('is waiting for scroll handler.');
        }
      },

      /**
       * Called by component to add a busy state and return the resolve function
       * to call when the busy state can be removed.
       * @param {String} msg the description of the busy state
       * @private
       */
      _addComponentBusyState: function (msg) {
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        var options = {
          description: "The component identified by '" + this.element[0].id + "' " + msg
        };
        return busyContext.addBusyState(options);
      },

      /**
       * Clears the 'focusout' busy state.
       * @private
       */
      _clearFocusoutBusyState: function () {
        if (this._focusoutResolveFunc) {
          this._focusoutResolveFunc();
          this._focusoutResolveFunc = null;
        }
      },

      /**
       * Clears the 'scrollPos' busy state.
       * @private
       */
      _clearScrollPosBusyState: function () {
        if (!this.ojContext._IsCustomElement()) {
          this.signalTaskEnd();
        } else if (this._scrollPosResolveFunc) {
          this._scrollPosResolveFunc();
          this._scrollPosResolveFunc = null;
        }
      },

      /**
       * Handler for blur event
       * @param {Event} event the blur event
       * @protected
       */
      HandleBlur: function (event) {
        this._clearFocusoutTimeout();

        // remove focus class on blur of expand/collapse icon
        if (this._isExpandCollapseIcon(event.target)) {
          this._focusOutHandler($(event.target));
        }
        if (this._isActionableMode()) {
          // checks if the focusout event is triggered by popup originated from within listview
          // if it is don't do anything as we do not want to exit actionable mode.
          if (ojkeyboardfocusUtils.getLogicalChildPopup(this.getListContainer()) != null) {
            return;
          }

          this._setFocusoutBusyState();
          // set timeout to stay in editable/actionable mode if focus comes back into the listview
          // prettier-ignore
          this._focusoutTimeout = setTimeout( // @HTMLUpdateOK
            function () {
              if (
                this.m_active == null ||
                !this.m_active.elem.get(0).contains(document.activeElement)
              ) {
                this._doBlur();
              }
              this._clearFocusoutBusyState();
            }.bind(this),
            100
          );

          // event.relatedTarget would be null if focus out of page
          // the other check is to make sure the blur is not caused by shifting focus within listview
        } else if (!this._isFocusBlurTriggeredByDescendent(event) && !this.m_preActive) {
          // when a blur is triggered by switching windows for example
          // the activeElement remains the same, in such case, we don't want to
          // change tabindex to ul as well otherwise when switched back to document
          // the focus will get lost and assigned to body
          if (this.m_active == null || !this.m_active.elem.get(0).contains(document.activeElement)) {
            this._doBlur();
          }
        }
      },

      /**
       * @private
       */
      _doBlur: function () {
        if (this._isActionableMode()) {
          this._exitActionableMode();
        }

        this.getListContainer().removeClass('oj-focus-ancestor');
        this.UnhighlightActive();

        // remove tab index from focus item and restore tab index on list
        // and remove any aria-labelled by set by card navigation
        if (this.m_active != null) {
          this._resetTabIndex(this.m_active.elem);
          this._removeSkipItemAriaLabel(this.m_active.elem);
        } else {
          var emptyText = this.element.children('.' + this.getEmptyTextStyleClass()).first();
          if (emptyText.length === 0) {
            emptyText = this.element.find('.oj-listview-no-data-container[role="row"]').first();
          }
          if (emptyText.length > 0) {
            emptyText.children().first().removeAttr('tabIndex');
            this._unhighlightElem(emptyText, 'oj-focus');
          }
        }
        this.SetRootElementTabIndex();
      },

      /**
       * Event handler for when user exits an item in list
       * @param {Event} event mouseout event
       * @private
       */
      _handleMouseOut: function (event) {
        var item = this.FindItem(event.target);
        if (item != null) {
          this.m_hoverItem = null;
          this._unhighlightElem(item, 'oj-hover');
        }
      },

      /**
       * Event handler for when user hovers over list
       * @param {Event} event mouseover event
       * @private
       */
      _handleMouseOver: function (event) {
        // do this for real mouse enters, but not 300ms after a tap
        // skip if we are in the middle of dnd
        if (
          !this._isShowHover() ||
          this._recentTouch() ||
          (this.m_dndContext && this.m_dndContext.isDndInProgress())
        ) {
          return;
        }

        var item = this.FindItem(event.target);
        if (item != null && !this.SkipFocus(item)) {
          // skip hover if item is not expandable/collapsible group header
          if (
            !this._isSelectionEnabled() &&
            !item.children().first().hasClass(this.getGroupItemStyleClass())
          ) {
            return;
          }
          // have to remember it so we can clear it when listview is detached from DOM
          this.m_hoverItem = item;
          this._highlightElem(item, 'oj-hover');
        }
      },

      /**
       * Whether to show hover or not.  Currently we only show hover if selection is enabled
       * and drag is enabled (without affordance, which requires selection to be enabled)
       * @private
       */
      _isShowHover: function () {
        var isRedWood = ThemeUtils.parseJSONFromFontFamily('oj-theme-json').behavior === 'redwood';
        // Hover only over redwood listview collapsible group header
        return (
          this._isSelectionEnabled() || (isRedWood && this.isExpandable() && this.ShouldUseGridRole())
        );
      },

      _recentTouch: function () {
        return Date.now() - this._lastTouch < 500; // must be at least 300 for the "300ms" delay
      },

      /**
       * Event handler for when user press down a key
       * @param {Event} event keydown event
       * @protected
       */
      HandleKeyDown: function (event) {
        if (this.isExpandable()) {
          var key = event.key || event.keyCode;
          if (
            key === 'ArrowLeft' ||
            key === 'Left' ||
            key === this.LEFT_KEY ||
            key === 'ArrowRight' ||
            key === 'Right' ||
            key === this.RIGHT_KEY
          ) {
            var current = this.m_active.elem;
            var isRTL = this.ojContext._GetReadingDirection() === 'rtl';

            if (key === 'ArrowLeft' || key === 'Left' || key === this.LEFT_KEY) {
              if (this.GetState(current) === this.STATE_EXPANDED && !isRTL) {
                this.CollapseItem(current, event, true, this.m_active.key, true, true);
                return;
              } else if (this.GetState(current) === this.STATE_COLLAPSED && isRTL) {
                this.ExpandItem(current, event, true, this.m_active.key, true, true, true);
                return;
              }
            }
            if (key === 'ArrowRight' || key === 'Right' || key === this.RIGHT_KEY) {
              if (this.GetState(current) === this.STATE_COLLAPSED && !isRTL) {
                this.ExpandItem(current, event, true, this.m_active.key, true, true, true);
                return;
              } else if (this.GetState(current) === this.STATE_EXPANDED && isRTL) {
                this.CollapseItem(current, event, true, this.m_active.key, true, true);
                return;
              }
            }
          }
        }
        var processed = this.HandleSelectionOrActiveKeyDown(event);

        // dnd
        if (this.m_dndContext != null) {
          processed = processed || this.m_dndContext.HandleKeyDown(event);
        }

        if (processed === true) {
          event.preventDefault();
          event.stopPropagation();
        }

        this.m_keyProcessed = processed;
      },

      /**
       * Event handler for whenever press up occurred
       * @param {Event} event keyup event
       * @protected
       */
      HandleKeyUp: function (event) {
        // popup process esc key on keyup so we have to stop keyup from bubbling
        var key = event.key || event.keyCode;
        if ((key === 'Escape' || key === 'Esc' || key === this.ESC_KEY) && this.m_keyProcessed) {
          event.stopPropagation();
        }
        this.m_keyProcessed = undefined;
      },

      /**
       * @private
       */
      _handleMouseUpOrPanMove: function (event) {
        // unhighlight item that got focus in mousedown
        if (this.m_preActiveItem) {
          this._unhighlightElem(this.m_preActiveItem, 'oj-focus');
        }

        // dnd
        if (this.m_dndContext != null && this.m_dragger && this.m_dragger.get(0) !== event.target) {
          this.m_dndContext._unsetDraggable(this.m_dragger);
          this.m_dragger = null;
        }
      },

      /**
       * @private
       */
      _isNodeFocusable: function (node) {
        var itemStyleClass = this.getItemElementStyleClass();
        return DataCollectionUtils.isElementOrAncestorFocusable(node, function (element) {
          return (
            element.classList.contains(itemStyleClass) ||
            element.classList.contains('oj-listview-cell-element')
          );
        });
      },

      /**
       * Event handler for when mouse down or touch start anywhere in the list
       * @param {Event} event mousedown or touchstart event
       * @protected
       */
      HandleMouseDownOrTouchStart: function (event) {
        // click on item
        var target = $(event.target);

        // dnd
        if (this.m_dndContext != null) {
          this.m_dndContext._setDraggable(target);
          this.m_dragger = target;
        }

        var item = this.FindItem(target);
        // bail if clickthrough disabled legacy syntax is detected
        // we'll still need to set the flag so that the focus do not shift
        if (
          item != null &&
          item.length > 0 &&
          this._isLegacyClickthroughDisabled(event, item.get(0))
        ) {
          this.m_preActive = true;
          item = null;
        }

        if (
          item == null ||
          item.length === 0 ||
          this.SkipFocus(item) ||
          target.hasClass('oj-listview-drag-handle')
        ) {
          // one of the following happened:
          // 1) can't find item
          // 2) item cannot be focus
          // 3) target is an oj-component
          // 4) target or one of its ancestors has the oj-clickthrough-disabled marker class
          // 5) target is the drag handle
          return;
        }

        this.m_preActive = true;

        // make sure listview has focus
        if (!this.getListContainer().hasClass('oj-focus-ancestor')) {
          this.getListContainer().addClass('oj-focus-ancestor');
        }

        // we'll need to remove focus in case the actual focus item is different
        this.m_preActiveItem = item;

        // apply focus
        this._highlightElem(item, 'oj-focus');

        // focus on item, we need to do it on mousedown instead of click otherwise click handler will
        // steal focus from popup and causes it to close prematurely
        this._makeFocusable(item);
        // checks whether focus is already inside some in item, if it is don't try to steal focus away from it (combobox)
        // if target is focusable by itself, don't try to steal focus either
        // if active element is outside of the list, as in the case of things inside popup, don't try to steal focus
        if (
          this.element[0].contains(document.activeElement) &&
          !item.get(0).contains(document.activeElement) &&
          !this._isNodeFocusable(target[0])
        ) {
          this._focusItem(item);
        }

        // make sure ul is not tabbable
        this.RemoveRootElementTabIndex();
        // reset tab index must be done after focusing another item
        if (this.m_active != null && this.m_active.elem.get(0) !== item.get(0)) {
          this._resetTabIndex(this.m_active.elem);
        }

        // need this on touchend
        if (event.originalEvent.touches && event.originalEvent.touches.length > 0) {
          this.m_touchPos = {
            x: event.originalEvent.changedTouches[0].pageX,
            y: event.originalEvent.changedTouches[0].pageY
          };
        }

        // mouse down on input element inside item should trigger actionable mode
        if (this._isInputElement(target.get(0))) {
          this._enterActionableMode(item);
        }
      },

      /**
       * Event handler for when touch end/cancel happened
       * @param {Event} event touchend or touchcancel event
       * @protected
       */
      HandleTouchEndOrCancel: function (event) {
        var action = 'pointerUp';

        // unhighlight item that got focus in touchstart
        if (this.m_preActiveItem != null) {
          this._unhighlightElem(this.m_preActiveItem, 'oj-focus');

          // start ripple effect
          if (this.m_touchPos != null) {
            var offset = this.m_preActiveItem.offset();

            // find where to start the ripple effect based on touch location
            var effect = this.getAnimationEffect(action);
            effect.offsetX = this.m_touchPos.x - offset.left + 'px';
            effect.offsetY = this.m_touchPos.y - offset.top + 'px';

            var groupItem = this.m_preActiveItem.children('.' + this.getGroupItemStyleClass());
            var elem;
            if (groupItem.length > 0) {
              elem = /** @type {Element} */ (groupItem.get(0));
            } else {
              elem = /** @type {Element} */ (this.getFocusItem(this.m_preActiveItem).get(0));
            }

            // don't apply ripple effect on the item when target is one of these controls
            var target = event.target;
            if (elem) {
              var nodes = elem.querySelectorAll(
                "input, select, button, a, textarea, object, [tabIndex]:not([tabIndex='-1']), [data-oj-tabmod]"
              );
              for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].contains(target)) {
                  elem = null;
                  break;
                }
              }
            }

            // we don't really care when animation ends
            if (elem != null) {
              this.StartAnimation(elem, action, effect);
            }

            this.m_touchPos = null;
          }
        }

        // need this so that on mouse over handler would not apply the styles if the last touch was within the last n ms
        this._lastTouch = Date.now();
        this._handleMouseOut(event);
      },

      /**
       * Enters actionable mode
       * @private
       */
      _enterActionableMode: function (item) {
        var current = item === undefined ? this.m_active.elem : item;

        if (current) {
          // in case content has been updated under the cover
          this.disableAllTabbableElements(current);

          // re-enable all tabbable elements
          this._enableAllTabbableElements(current);

          // only go into actionable mode if there is something to focus
          var first = current.find('[data-first]');
          if (first.length > 0) {
            this._setActionableMode(true);
          }
        }
      },

      /**
       * Exits actionable mode
       * @private
       */
      _exitActionableMode: function () {
        this._setActionableMode(false);

        // disable all tabbable elements in the item again
        if (this.m_active) {
          this.disableAllTabbableElements(this.m_active.elem);
          this.m_active.elem.removeClass('oj-focus-previous-highlight');
        }
      },

      /**
       * Event handler for when mouse click anywhere in the list
       * @param {Event} event mouseclick event
       * @protected
       */
      HandleMouseClick: function (event) {
        // only perform events on left mouse, (right in rtl culture)
        if (event.button === 0) {
          var collapseIconClass = this.getCollapseIconStyleClass();
          var expandIconClass = this.getExpandIconStyleClass();
          var target = $(event.target);
          if (target.hasClass(expandIconClass)) {
            this._collapse(event);
            event.preventDefault();
          } else if (target.hasClass(collapseIconClass)) {
            this._expand(event);
            event.preventDefault();
          } else {
            // click on item
            var item = this.FindItem(target);
            if (item == null || item.length === 0) {
              // can't find item
              return;
            }

            // bail if legacy clickthrough syntax is detected
            if (this._isLegacyClickthroughDisabled(event, item[0])) {
              return;
            }

            // if item is not focusable
            if (this.SkipFocus(item)) {
              // still need to expand/collapse header
              this._handleHeaderClick(event, target, item);
              return;
            }

            if (
              this._isActionableMode() &&
              this.m_active != null &&
              this.m_active.elem.get(0) !== item.get(0) &&
              !this._isInputElement(target.get(0))
            ) {
              // click on item other than current focus item should exit actionable mode
              this._exitActionableMode();
            }

            // make sure listview has focus
            if (!this.getListContainer().hasClass('oj-focus-ancestor')) {
              this.getListContainer().addClass('oj-focus-ancestor');
            }

            var clickthroughDisabled = this._isClickthroughDisabled(event, item);

            // check if selection is enabled
            if (!clickthroughDisabled && this._isSelectionEnabled() && this.IsSelectable(item[0])) {
              var sourceCapabilityTouch =
                event.originalEvent.sourceCapabilities &&
                event.originalEvent.sourceCapabilities.firesTouchEvents;
              var isTouch =
                this._isTouchSupport() &&
                (sourceCapabilityTouch ||
                  (this.touchStartEvent != null && this.touchStartEvent.target === event.target));

              var processed = true;
              if (isTouch) {
                processed = this._handleTouchSelection(item, event);
              } else {
                processed = this.HandleClickSelection(item, event);
              }

              // if not processed, then we'll still need to make sure it's active
              if (!processed) {
                this.HandleClickActive(item, event);
              }

              // if user hits the padding part of item, since LI does not have tabindex anymore, item will not get focus
              if (this.ShouldUseGridRole() && event.target === item.get(0)) {
                this._focusItem(item);
              }

              // need to make sure every item in the selection have the draggable cursor
              if (this._shouldDragSelectedItems()) {
                this.m_dndContext.setSelectionDraggable();
              }
            } else {
              // if selection or clickthrough is disable, we'll still need to highlight the active item
              this.HandleClickActive(item, event);
            }

            // triger action event
            if (!clickthroughDisabled) {
              this._fireActionEvent(item.get(0), event, true);
              // clicking on header will expand/collapse item
              this._handleHeaderClick(event, target, item);
            }
          }
        }
      },

      /**
       * Handle click on group header
       * @private
       */
      _handleHeaderClick: function (event, target, item) {
        var groupItemClass = this.getGroupItemStyleClass();

        // clicking on header will expand/collapse item
        if (this.isExpandable() && target.closest('.' + groupItemClass)) {
          if (this.GetState(item) === this.STATE_COLLAPSED) {
            this._expand(event);
          } else if (this.GetState(item) === this.STATE_EXPANDED) {
            this._collapse(event);
          }
        }
      },

      /**
       * Fires an item action event
       * @private
       */
      _fireActionEvent: function (item, event, ignoreActionable) {
        if (!ignoreActionable && this._isActionableMode()) {
          return;
        }

        var key = this.GetKey(item);
        var data = this._getDataForItem(item);
        var metadata = this._getMetadataForItem(item);
        var ui = { context: { key: key, data: data, metadata: metadata } };
        this.Trigger('itemAction', event, ui);
      },

      /**
       * Return true if Dnd is supported on selected items only.
       * @private
       * @returns {boolean}
       */
      _shouldDragSelectedItems: function () {
        return this.m_dndContext != null && !this.m_dndContext.shouldDragCurrentItem();
      },
      /** ********************************* end Event handlers *****************************/

      /** ************************************* helper methods *****************************/
      /**
       * Whether touch is supported
       * @return {boolean} true if touch is supported, false otherwise
       * @private
       */
      _isTouchSupport: function () {
        return DomUtils.isTouchSupported();
      },

      /**
       * Whether it is non-window touch device (iOS or Android)
       * @return {boolean} true if it is a non-window touch device
       * @private
       */
      _isNonWindowTouch: function () {
        return this._isTouchSupport() && !DataCollectionUtils.isWindows();
      },

      /**
       * Returns either the ctrl key or the command key in Mac OS
       * @param {!Object} event
       * @private
       */
      _ctrlEquivalent: function (event) {
        return DomUtils.isMetaKeyPressed(event);
      },

      /**
       * Helper method to create subid based on the root element's id
       * @param {string} subId the id to append to the root element id
       * @return {string} the subId to append to the root element id
       * @private
       */
      _createSubId: function (subId) {
        var id = this.element.attr('id');
        return [id, subId].join(':');
      },

      /**
       * Find the item element
       * @param {jQuery} elem
       * @return {jQuery|null}
       * @protected
       */
      FindItem: function (elem) {
        if ($(elem).hasClass(this.getGroupStyleClass())) {
          return null;
        }

        return $(elem).closest('.' + this.getItemElementStyleClass());
      },

      /**
       * Determine if click should be processed based on the element based on legacy syntax (marker class).
       * @param {Event} event
       * @param {Element} item the item element
       * @return {boolean} returns true if the element contains the special marker class, false otherwise.
       * @private
       */
      _isLegacyClickthroughDisabled: function (event, item) {
        var node = event.target;
        while (node != null && node !== item) {
          if (node.classList.contains('oj-clickthrough-disabled')) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      },

      /**
       * Determine if click should be processed based on the element.
       * @param {Event|null} event the event that triggered this check
       * @param {jQuery} elem the element to check
       * @return {boolean} returns true if the element contains the special marker class, false otherwise.
       * @private
       */
      _isClickthroughDisabled: function (event, elem) {
        return elem.length > 0 && DataCollectionUtils.isEventClickthroughDisabled(event, elem.get(0));
      },

      /**
       * Compute the total top and bottom border width of the list container
       * @return {number} the sum of top and bottom border width of the list container
       * @private
       */
      getListContainerBorderWidth: function () {
        if (this.m_borderWidth == null) {
          this.m_borderWidth =
            parseInt(this.getListContainer().css('border-top-width'), 10) +
            parseInt(this.getListContainer().css('border-bottom-width'), 10);
        }

        return this.m_borderWidth;
      },

      /**
       * Scroll as needed to make the specified item visible
       * @param {Object} item the item to make visible
       */
      scrollToItem: function (item) {
        var key = item.key;
        if (key == null) {
          return;
        }

        var elem = this.FindElementByKey(key);
        if (elem == null) {
          return;
        }

        if ($(elem).hasClass(this.getItemStyleClass())) {
          this._scrollToVisible(elem);
        } else {
          // group item
          var group = $(elem)
            .children('.' + this.getGroupItemStyleClass())
            .first();
          this._scrollToGroupHeader(group.get(0));
        }
      },

      /**
       * Scroll as needed to make an element visible in the viewport
       * @param {Element} elem the element to make visible
       * @private
       */
      _scrollToVisible: function (elem) {
        var offset = 0;
        var top;
        var height;
        var container = this.getListContainer()[0];
        var containerScrollTop = container.scrollTop;
        var containerHeight = container.offsetHeight;

        if (elem.classList.contains(this.getItemStyleClass())) {
          top = elem.offsetTop;
          height = elem.offsetHeight;
        } else if (elem.children.length > 0) {
          var groupItemContainer = elem.children[0];
          if (groupItemContainer.classList.contains(this.getGroupItemStyleClass())) {
            top = groupItemContainer.offsetTop;
            height = groupItemContainer.offsetHeight;
          }
        }
        if (isNaN(top) || isNaN(height)) {
          return;
        }

        // if there's sticky header, make sure the elem is not behind it
        if (this.m_groupItemToPin != null) {
          var headerTop = parseInt(this.m_groupItemToPin.style.top, 10);
          var headerHeight = $(this.m_groupItemToPin).outerHeight();
          if (top <= headerTop && headerTop < top + height) {
            offset = (height + top - headerTop) / 2;
          } else if (top >= headerTop && top < headerTop + headerHeight) {
            offset = (headerTop + headerHeight - top) / 2;
          }
        } else if (this.m_closestParent != null) {
          // when native position sticky is used
          var stickyHeader = this.m_closestParent.firstElementChild;
          if (stickyHeader.classList.contains('oj-sticky')) {
            offset = stickyHeader.offsetTop + stickyHeader.offsetHeight - top;
          }
        }

        // if it's within viewport do nothing
        if (top >= containerScrollTop && top + height <= containerScrollTop + containerHeight) {
          if (offset > 0) {
            container.scrollTop = containerScrollTop - offset;
          }
          return;
        }

        // how much need to scroll to see the entire element, and to make sure the element top is always visible
        var scrollTop = Math.max(0, Math.min(top - offset, Math.abs(top + height - containerHeight)));
        if (scrollTop > containerScrollTop) {
          scrollTop += this.getListContainerBorderWidth();
        }
        container.scrollTop = scrollTop;
      },

      /**
       * Get the key associated with an item element
       * @param {Element} elem the item element to retrieve the key
       * @return {Object|null} the key associated with the item element
       * @protected
       */
      GetKey: function (elem) {
        return this.m_contentHandler.GetKey(elem);
      },

      /**
       * Get the element associated with a key
       * @param {Object} key the key to retrieve the item element
       * @return {Element|null} the item element associated with the key
       * @protected
       */
      FindElementByKey: function (key) {
        if (this.m_keyElemMap != null) {
          var id = this.m_keyElemMap.get(key);
          if (id != null) {
            return document.getElementById(id);
          }
        }

        // ask the content handler
        if (this.m_contentHandler) {
          return this.m_contentHandler.FindElementByKey(key);
        }
        // this should not happen
        return null;
      },

      /**
       * Special version of array indexOf to take care of object comparison cases
       * @param {Array} arr the array
       * @param {Object} key the key to find the index for in the array
       * @return {number} the index of the key in the array, or -1 if the key does not exists in the array
       */
      GetIndexOf: function (arr, key) {
        for (var i = 0; i < arr.length; i++) {
          if (key === arr[i] || oj.Object.compareValues(key, arr[i])) {
            return i;
          }
        }

        return -1;
      },

      /**
       * Checks whether element is an expand/collapse icon
       * @param {Element|jQuery} elem the element to check
       * @return {boolean} true if it's an expand/collapse icon, false otherwise
       */
      _isExpandCollapseIcon: function (elem) {
        return (
          $(elem).hasClass(this.getExpandIconStyleClass()) ||
          $(elem).hasClass(this.getCollapseIconStyleClass())
        );
      },

      /**
       * Determine whether gridlines/dividers should be shown
       * @return {boolean} true if visible, false if hidden
       * @private
       */
      _isGridlinesVisible: function () {
        if (this.m_gridlinesVisible == null) {
          var gridlines = this.GetOption('gridlines');
          // would be null for NavList
          if (gridlines == null) {
            return true;
          }
          this.m_gridlinesVisible = gridlines.item !== 'hidden';
        }
        return this.m_gridlinesVisible;
      },

      /**
       * Gets the option defaults for top and bottom border/gridline
       * @private
       */
      _isTopBottomGridlinesVisible: function () {
        var defaultOptions = this._getOptionDefaults();
        var defaultGridlines = defaultOptions.gridlines;
        if (defaultGridlines) {
          return { top: defaultGridlines.top, bottom: defaultGridlines.bottom };
        }
        // like NavList which doesn't have that option defaults
        return { top: true, bottom: true };
      },

      /**
       * Update the style class based on gridline option defaults
       * @private
       */
      _updateGridlines: function () {
        var root = this.GetRootElement()[0];
        if (this._isGridlinesVisible()) {
          root.classList.remove('oj-listview-gridlines-hidden');
        } else {
          root.classList.add('oj-listview-gridlines-hidden');
        }

        var gridlines = this._isTopBottomGridlinesVisible();
        root.classList.remove('gridline-top-hidden');
        root.classList.remove('gridline-bottom-hidden');

        if (gridlines.top === 'hidden') {
          root.classList.add('gridline-top-hidden');
        }

        if (gridlines.bottom === 'hidden') {
          root.classList.add('gridline-bottom-hidden');
        }
      },

      /**
       * Determine whether ListView needs to render a placeholder to show gridline for the last item
       * @private
       */
      _shouldRenderGridlineForLastItem: function () {
        // no effect on card layout
        if (this.isCardLayout()) {
          return false;
        }
        var gridlines = this.GetOption('gridlines');
        if (gridlines != null) {
          var topBottomGridlines = this._isTopBottomGridlinesVisible();
          if (gridlines.item === 'visible' && topBottomGridlines.bottom === 'hidden') {
            return true;
          }
        }
        return false;
      },
      /** ********************************** end helper methods *****************************/

      /** ************************************* Navigation Common **************************/
      /**
       * Determine whether the key code is an arrow key
       * @param {string} key
       * @return {boolean} true if it's an arrow key, false otherwise
       * @protected
       */
      IsArrowKey: function (key) {
        if (this.isCardLayout()) {
          return (
            key === 'ArrowUp' ||
            key === 'Up' ||
            key === this.UP_KEY ||
            key === 'ArrowDown' ||
            key === 'Down' ||
            key === this.DOWN_KEY ||
            key === 'ArrowLeft' ||
            key === 'Left' ||
            key === this.LEFT_KEY ||
            key === 'ArrowRight' ||
            key === 'Right' ||
            key === this.RIGHT_KEY
          );
        }

        return (
          key === 'ArrowUp' ||
          key === 'Up' ||
          key === this.UP_KEY ||
          key === 'ArrowDown' ||
          key === 'Down' ||
          key === this.DOWN_KEY
        );
      },

      /**
       * Retrieve the visible (flattened) items cache, create one if it is null.
       * @return {jQuery} a list of items
       * @private
       */
      _getItemsCache: function () {
        if (this.m_items == null) {
          var disclosureStyleClass = this.getGroupCollapseStyleClass();
          var selector = '.' + this.getItemElementStyleClass() + ':visible';
          this.m_items = this.element
            .find(selector)
            .filter(function () {
              var isGroup = $(this).parent().hasClass(disclosureStyleClass);
              if (isGroup) {
                return !$(this).parent().parent().hasClass('oj-collapsed');
              }
              if (this.tagName !== 'LI') {
                var parentElement = this.parentElement;
                // skip items that are about to be remove
                if (parentElement && parentElement.classList.contains('oj-animate-remove')) {
                  return false;
                }
              }
              return true;
            })
            .map(function (index, elem) {
              var parentElement = elem.parentElement;
              if (
                parentElement &&
                (parentElement.classList.contains('oj-animate-add') ||
                  parentElement.classList.contains('oj-listview-temp-item'))
              ) {
                return parentElement;
              }
              return elem;
            });
        }
        return this.m_items;
      },

      /**
       * Handles when navigate to the last item
       * @param {jQuery} item the item element
       */
      _handleLastItemKeyboardFocus: function (item) {
        var next = item.get(0).nextElementSibling;
        if (next == null || !$(next).hasClass(this.getItemElementStyleClass())) {
          // it could be the last element of the group, if so, make sure it's the last group
          if (
            this.m_contentHandler.IsHierarchical() &&
            item.parent().hasClass(this.getGroupStyleClass())
          ) {
            if (item.parent().parent().get(0).nextElementSibling != null) {
              // bail if it's not the last group
              return;
            }
          }

          // it's the last element, check scroll bar to make sure it scrolls all the way to the bottom
          var scroller = this._getScroller();
          var scrollHeight = this._getScrollHeight();
          if (scroller.scrollTop < scrollHeight) {
            scroller.scrollTop = scrollHeight;
          }
        }
      },

      /**
       * Handles arrow keys navigation on item
       * @param {string} key description
       * @param {boolean} isExtend
       * @param {Event} event the DOM event causing the arrow keys
       * @protected
       */
      HandleArrowKeys: function (key, isExtend, event) {
        // ensure that there's no outstanding fetch requests
        if (!this.m_contentHandler.IsReady()) {
          // act as if processed to prevent page scrolling before fetch done
          return true;
        }

        var current;
        if (!isExtend || this.m_isNavigate) {
          current = this.m_active.elem;
        } else {
          current = this.m_selectionFrontier;
        }

        // invoke different function for handling focusing on active item depending on whether selection is enabled
        var processed = false;

        switch (key) {
          case this.UP_KEY:
          case 'Up':
          case 'ArrowUp':
            if (this.isCardLayout() && $(current).hasClass(this.getItemStyleClass())) {
              this._gotoItemAbove(current, isExtend, event);
            } else {
              this._gotoPrevItem(current, isExtend, event);
            }

            // according to James we should still consume the event even if list view did not perform any action
            processed = true;
            break;
          case this.DOWN_KEY:
          case 'Down':
          case 'ArrowDown':
            if (this.isCardLayout() && $(current).hasClass(this.getItemStyleClass())) {
              this._gotoItemBelow(current, isExtend, event);
            } else {
              this._gotoNextItem(current, isExtend, event);
            }

            // according to James we should still consume the event even if list view did not perform any action
            processed = true;
            break;
          case this.LEFT_KEY:
          case 'Left':
          case 'ArrowLeft':
          case this.RIGHT_KEY:
          case 'Right':
          case 'ArrowRight':
            if (this.isCardLayout()) {
              if (this.ojContext._GetReadingDirection() === 'rtl') {
                // eslint-disable-next-line no-param-reassign
                key =
                  key === 'ArrowLeft' || key === 'Left' || key === this.LEFT_KEY
                    ? 'ArrowRight'
                    : 'ArrowLeft';
              }

              if (key === 'ArrowLeft' || key === 'Left' || key === this.LEFT_KEY) {
                this._gotoPrevItem(current, isExtend, event);
              } else {
                this._gotoNextItem(current, isExtend, event);
              }
              processed = true;
            }
            break;
          default:
            break;
        }

        return processed;
      },

      /**
       * Go to the next item in the list
       * @private
       */
      _gotoNextItem: function (current, isExtend, event) {
        var items = this._getItemsCache();
        var currentIndex = items.index(current) + 1;

        if (currentIndex < items.length) {
          var next = $(items[currentIndex]);
          // make sure it's focusable, otherwise find the next focusable item
          while (this.SkipFocus(next)) {
            currentIndex += 1;
            if (currentIndex === items.length) {
              return;
            }
            next = $(items[currentIndex]);
          }

          if (isExtend) {
            this._extendSelection(next, event);
            this.m_isNavigate = false;
          } else {
            this.SetCurrentItem(next, event);
            this.m_isNavigate = true;
          }

          this._handleLastItemKeyboardFocus(next);
        }
      },

      /**
       * Go to the previous item in the list
       * @private
       */
      _gotoPrevItem: function (current, isExtend, event) {
        var items = this._getItemsCache();
        var currentIndex = items.index(current) - 1;

        if (currentIndex >= 0) {
          var prev = $(items[currentIndex]);
          // make sure it's focusable, otherwise find the next focusable item
          while (this.SkipFocus(prev)) {
            currentIndex -= 1;
            if (currentIndex < 0) {
              return;
            }
            prev = $(items[currentIndex]);
          }

          if (isExtend) {
            this._extendSelection(prev, event);
            this.m_isNavigate = false;
          } else {
            this.SetCurrentItem(prev, event);
            this.m_isNavigate = true;
          }
        }
      },

      /**
       * Calculate the number of the columns in this group
       * @param {jQuery} children the children iterator
       * @return {number} the number of columns
       * @private
       */
      _getColumnCount: function (children) {
        var count;
        var currentOffsetTop;

        children.each(function (index) {
          var offsetTop = this.offsetTop;

          if (currentOffsetTop === undefined) {
            currentOffsetTop = offsetTop;
          } else if (currentOffsetTop !== offsetTop) {
            // on a different row, return immediately
            return false;
          }

          count = index;
          return undefined;
        });

        return count + 1;
      },

      /**
       * Inform screen reader that X number of items have been skipped during up/down arrow key navigation
       * @param {jQuery} next the item to navigate to
       * @param {number} count number of items skipped
       * @private
       */
      _updateSkipItemAriaLabel: function (next, count) {
        var id = this._createSubId('extra_info');
        if (this.m_skipAriaLabelText == null) {
          var root = $(document.createElement('div'));
          root.addClass('oj-helper-hidden-accessible').attr('id', id);
          this.getListContainer().append(root); // @HTMLUpdateOK
          this.m_skipAriaLabelText = root;
        }
        this.m_skipAriaLabelText.text(
          this.ojContext.getTranslatedString('accessibleNavigateSkipItems', { numSkip: count })
        );

        var focusElem = this.getFocusItem(next);
        // make sure it has an id for aria-labelledby
        focusElem.uniqueId().attr('aria-labelledby', id + ' ' + focusElem.prop('id'));
      },

      /**
       * Undo what _updateSkipItemAriaLabel did to active element
       * @param {jQuery} current the item to remove aria property from
       * @private
       */
      _removeSkipItemAriaLabel: function (current) {
        var focusElem = this.getFocusItem(current);
        if (focusElem.length > 0) {
          focusElem.get(0).removeAttribute('aria-labelledby');
        }
      },

      /**
       * Go to the item above the current item in the list
       * @private
       */
      _gotoItemAbove: function (current, isExtend, event) {
        var above;
        var numOfItemSkip;

        // if it's a group, just go to the previous item (which would be the last focusable item in the previous group)
        if (!current.hasClass(this.getItemElementStyleClass())) {
          this._gotoPrevItem(current);
          return;
        }

        var parent = current.parent();
        var items = parent.children('li.' + this.getItemElementStyleClass());
        var numOfCols = this._getColumnCount(items);
        var index = items.index(current);
        var aboveIndex = index - numOfCols;
        if (aboveIndex < 0) {
          // go to header, or stop if there's no header
          if (
            parent.hasClass(this.getGroupStyleClass()) &&
            parent.parent().hasClass(this.getItemElementStyleClass())
          ) {
            above = parent.parent();
            numOfItemSkip = index;
          }
        } else {
          above = $(items.get(aboveIndex));
          numOfItemSkip = numOfCols - 1;
        }

        if (above && above.length > 0) {
          // make sure it's focusable, otherwise no-op
          if (this.SkipFocus(above)) {
            return;
          }

          if (isExtend) {
            this._extendSelection(above, event);
            this.m_isNavigate = false;
          } else {
            if (numOfItemSkip != null && numOfItemSkip > 0) {
              this._updateSkipItemAriaLabel(above, numOfItemSkip);
            }
            this.SetCurrentItem(above, event);
            this.m_isNavigate = true;
          }
        }
      },

      /**
       * Go to the item below the current item in the list
       * @private
       */
      _gotoItemBelow: function (current, isExtend, event) {
        var below;
        var numOfItemSkip;

        // if it's a group, just go to the next item (which would be the first focusable item in the next group)
        if (!current.hasClass(this.getItemElementStyleClass())) {
          this._gotoNextItem(current);
          return;
        }

        var parent = current.parent();
        var items = parent.children('li.' + this.getItemElementStyleClass());
        var numOfCols = this._getColumnCount(items);
        var index = items.index(current);
        var belowIndex = index + numOfCols;
        if (belowIndex >= items.length) {
          var numOfRows = Math.ceil(items.length / numOfCols);
          numOfItemSkip = items.length - 1 - index;
          // if the current item is not on the last row, then go to the last item within group
          if (index < Math.max(0, (numOfRows - 1) * numOfCols)) {
            below = items.last();
            // skip one less since going to an item within the same group
            numOfItemSkip -= 1;
          } else if (parent.hasClass(this.getGroupStyleClass())) {
            // go to header, or stop if there's no header
            below = parent.parent().next('li.' + this.getItemElementStyleClass());
          }
        } else {
          below = $(items.get(belowIndex));
          numOfItemSkip = numOfCols - 1;
        }

        if (below.length > 0) {
          // make sure it's focusable, otherwise no-op
          if (this.SkipFocus(below)) {
            return;
          }

          if (isExtend) {
            this._extendSelection(below, event);
            this.m_isNavigate = false;
          } else {
            if (numOfItemSkip != null && numOfItemSkip > 0) {
              this._updateSkipItemAriaLabel(below, numOfItemSkip);
            }
            this.SetCurrentItem(below, event);
            this.m_isNavigate = true;
          }

          this._handleLastItemKeyboardFocus(below);
        }
      },

      /**
       * Determine if the data grid is in actionable mode.
       * @return {boolean} true if the data grid is in actionable mode, false otherwise.
       * @private
       */
      _isActionableMode: function () {
        return this.m_keyMode === 'actionable';
      },

      /**
       * Sets whether the data grid is in actionable mode
       * @param {boolean} flag true to set grid to actionable mode, false otherwise
       * @param {boolean=} skipFocus true if focus should not shift, if not defined then default to false
       * @private
       */
      _setActionableMode: function (flag, skipFocus) {
        this.m_keyMode = flag ? 'actionable' : 'navigation';

        if (!flag && !skipFocus) {
          // focus should be shift back to active descendant container
          this.element[0].focus();
        }
      },
      /** ********************************** end Navigation Common **************************/

      /** ********************************** Active item ******************************/
      /**
       * Retrieve the focus element
       * @param {jQuery} item the list item
       * @return {jQuery} the focus element
       * @private
       */
      getFocusItem: function (item) {
        if (!item.hasClass(this.getFocusedElementStyleClass())) {
          return $(item.find('.' + this.getFocusedElementStyleClass()).first());
        }

        if (this.ShouldUseGridRole() && item.attr('role') === 'row') {
          var cell = item.children('.oj-listview-cell-element').first();
          return cell.length === 0 ? item.children().first() : cell;
        }

        return item;
      },

      /**
       * Sets the tab index attribute of the root element
       * To be change by NavList
       * @protected
       */
      SetRootElementTabIndex: function () {
        if (this._isComponentFocusable()) {
          this.element.attr('tabIndex', 0);
        }
      },

      /**
       * Removes the tab index attribute of the root element
       * To be change by NavList
       * @protected
       */
      RemoveRootElementTabIndex: function () {
        this.element.removeAttr('tabIndex');
      },

      /**
       * Whether application has mark the component as not focusable in the first place
       * @private
       */
      _isComponentFocusable: function () {
        var root = this.ojContext._IsCustomElement() ? this.GetRootElement() : this.element;
        return this._rootTabIndexSet || parseInt(root.attr('tabIndex'), 10) !== -1;
      },

      /**
       * Sets the tab index on focus item
       * @param {jQuery} item the focus item
       * @private
       */
      _setTabIndex: function (item) {
        // note that page author should not set any tabindex on the item
        if (this._isComponentFocusable()) {
          this.getFocusItem(item).attr('tabIndex', 0);
        }
      },

      /**
       * Resets the tab index set on focus item
       * @param {jQuery} item the focus item
       * @private
       */
      _resetTabIndex: function (item) {
        var removeAttr = true;
        if (item.attr('role') === 'presentation') {
          removeAttr = false;
        }

        var focusItem = this.getFocusItem(item);
        if (removeAttr) {
          focusItem.removeAttr('tabIndex');
        } else {
          focusItem.attr('tabIndex', -1);
        }
      },

      /**
       * Make an item focusable
       * @param {jQuery} item the item to focus
       * @private
       */
      _makeFocusable: function (item) {
        this._setTabIndex(item);
      },

      /**
       * Determine the only focusable element inside an item, if the item does not have any or have
       * more than one focusable element, then just return the item.
       * (Update) Note this method now always returns item since we do not want to change the role of
       * the content specified by application.
       * @param {jQuery} item the list item
       * @return {jQuery} see above for what's get returned
       * @private
       */
      getSingleFocusableElement: function (item) {
        return item;
      },

      /**
       * Sets the selection option with a new value
       * @param {Object} newValue the new value for selection option
       * @param {Event|null} event the DOM event
       * @param {Element} currentElem the current item DOM element
       * @private
       */
      _setCurrentItemOption: function (newValue, event, currentElem) {
        var extra = { item: this.ojContext._IsCustomElement() ? currentElem : $(currentElem) };
        this.SetOption('currentItem', newValue, {
          _context: {
            originalEvent: event,
            internalSet: true,
            extraData: extra
          },
          changed: true
        });
      },

      /**
       * Sets the active item
       * @param {jQuery} item the item to set as active
       * @param {Event} event the event that triggers set active
       * @param {boolean=} skipFocus true if to skip focusing the item
       * @return {boolean} true if item becomes active, false for all other cases
       * @private
       */
      _setActive: function (item, event, skipFocus) {
        var active;

        // set key info
        if (item != null) {
          var elem = item[0];
          var key = this.GetKey(elem);

          if (this.m_active == null || key !== this.m_active.key) {
            // fire beforecurrentItem
            var ui = { key: key, item: item };
            if (this.m_active != null) {
              ui.previousKey = this.m_active.key;
              ui.previousItem = this.m_active.elem;
              // for touch, remove draggable when active item changed
              if (this._shouldDragSelectedItems() && this._isTouchSupport()) {
                this.m_dndContext._unsetDraggable(ui.previousItem);
              }

              // remove aria-labelledby set by arrow key navigation
              this._removeSkipItemAriaLabel(ui.previousItem);
            }

            var cancelled = !this.Trigger('beforeCurrentItem', event, ui);
            if (cancelled) {
              return false;
            }

            if (this.m_active != null && this.m_active.elem) {
              this.m_active.elem.get(0).classList.remove('oj-listview-current-item');
            }

            active = { key: key, elem: item };
            this.m_active = active;

            // for touch, set draggable when item becomes active
            if (this._shouldDragSelectedItems() && this._isTouchSupport()) {
              this.m_dndContext._setDraggable(item);
            }

            item.get(0).classList.add('oj-listview-current-item');

            // update tab index
            if (skipFocus === undefined || !skipFocus) {
              // make item focusable
              this._makeFocusable(item);

              // style should be updated before currentItem change event is fired
              this.HighlightActive();

              // focus on it only for non-click events or when done programmatically
              // the issue is we can't shift focus on click since it will steal focus from the popups
              // the focusing on item is done already on mousedown
              if (event == null || (event.originalEvent && event.originalEvent.type !== 'click')) {
                this._focusItem(item);
              }

              // reset tabindex of previous focus item, note this has to be done after focusing on a new item
              // because in Chrome 57, resetting tabindex on a focus item will cause a blur event
              // note also it seems this only happens when removing tabindex, if you set it to -1 this does not happen
              this.RemoveRootElementTabIndex();
              if (ui.previousItem) {
                this._resetTabIndex(ui.previousItem);
              }
            }

            return true;
          } else if (key === this.m_active.key) {
            active = { key: key, elem: item };
            this.m_active = active;

            // update tab index
            if (skipFocus === undefined || !skipFocus) {
              this._makeFocusable(item);
              // make sure ul is not tabbable
              this.RemoveRootElementTabIndex();
              this._focusItem(item);
            }
          }
        } else {
          // item is null, just clears the current values
          this.m_active = null;
        }

        return false;
      },

      /**
       * Put browser focus on item (or children of item)
       * @private
       */
      _focusItem: function (item) {
        var elem = this.getFocusItem(item).get(0);
        if (elem) {
          elem.focus();
        }
      },

      /**
       * Highlight active element
       * @protected
       */
      HighlightActive: function () {
        // don't highlight and focus item if ancestor does not have focus
        if (this.m_active != null && this.getListContainer().hasClass('oj-focus-ancestor')) {
          var item = this.m_active.elem;
          this._highlightElem(item, 'oj-focus');
        }
      },

      /**
       * Unhighlight the active index, and turn the active index to selected instead if selectActive is true.
       * @protected
       */
      UnhighlightActive: function () {
        if (this.m_active != null) {
          this._unhighlightElem(this.m_active.elem, 'oj-focus');
        }
      },

      HandleClickActive: function (item, event) {
        // if click is triggered by target inside the active item, then do nothing
        var active = this.m_active != null ? this.m_active.elem.get(0) : null;
        // if it's a group, use the group header div instead otherwise active.contains check will not be valid
        if (active != null && !$(active).hasClass(this.getItemStyleClass())) {
          active = active.firstElementChild;
        }

        if (
          event != null &&
          active != null &&
          active !== event.target &&
          active.contains(event.target)
        ) {
          return;
        }

        this.SetCurrentItem(
          item,
          event,
          this.ShouldUseGridRole() ? event.target !== item.get(0) : true
        );
      },

      /**
       * Sets the active item and bring focus to it.  Update the currentItem option.
       * @protected
       */
      SetCurrentItem: function (item, event, skipFocus) {
        var proceed = this.ActiveAndFocus(item, event, skipFocus);
        if (proceed) {
          this._setCurrentItemOption(this.GetKey(item[0]), event, item.get(0));
        }
      },

      /**
       * Sets the active item and bring focus to it.
       * @protected
       */
      ActiveAndFocus: function (item, event, skipFocus) {
        // make sure that it is visible
        this._scrollToVisible(item[0]);

        // unhighlight any previous active item
        this.UnhighlightActive();

        // update active and frontier
        var proceed = this._setActive(item, event, skipFocus);

        // highlight active
        this.HighlightActive();

        return proceed;
      },
      /** ********************************** end Active item ******************************/

      /** *********************************** Selection ***********************************************/
      /**
       * If selection is enabled and at least one item has to be selected, then
       * make sure the first selectable item is selected in the list.
       */
      enforceSelectionRequired: function () {
        if (this._isSelectionEnabled() && this._isSelectionRequired()) {
          var selection = this.GetOption('selection');
          if (selection == null || (selection.length === 0 && selection.inverted !== true)) {
            this._selectFirstSelectableItem();
          }
        }
      },

      /**
       * Returns the first selectable item in the list.
       * @private
       */
      _getFirstSelectableItem: function () {
        // currently, an item will have the aria-selected attribute defined only if it's selectable
        // so we are using that here to find all selectable items.
        var elem = this.element[0].querySelector('.oj-listview-cell-element[aria-selected]');
        return elem == null ? null : elem.parentNode;
      },

      /**
       * Selects the first selectable item
       * @private
       */
      _selectFirstSelectableItem: function () {
        var item = this._getFirstSelectableItem();

        // select the item if found
        if (item) {
          var key = this.m_contentHandler.GetKey(item);
          if (key != null) {
            this._applySelection(item, key);
            var selected = this.GetOption('selected');
            this._setSelectionOption(selected.clear().add([key]), null, [item]);
          }
        }
      },

      /**
       * Check if selection enabled by options on the list
       * @return {boolean} true if selection enabled
       * @private
       */
      _isSelectionEnabled: function () {
        return this.GetOption('selectionMode') !== 'none';
      },

      /**
       * Check if there should be at least one item selected in the list
       * @return {boolean} true if selection is required
       * @private
       */
      _isSelectionRequired: function () {
        return this.GetOption('selectionRequired');
      },

      /**
       * Check whether multiple selection is allowed by options on the list
       * @return {boolean} true if multiple selection enabled
       * @private
       */
      _isMultipleSelection: function () {
        return this.GetOption('selectionMode') === 'multiple';
      },

      /**
       * Check whether the item is selectable
       * @param {Element} item the item element
       * @return {boolean} true if item is selectable
       * @protected
       */
      IsSelectable: function (item) {
        var focusItem = this.getFocusItem($(item)).get(0);
        if (focusItem == null) {
          Logger.log(
            'The focusItem has an unexpected value of null.\nItem classlist: ' +
              item.classList +
              '\nItem role: ' +
              item.role
          );
          return false;
        }
        return focusItem.hasAttribute('aria-selected');
      },

      /**
       * Convert selection as an iterable to an array of selection.
       * We used to remove any items that are not selectable, or if there are more than one items
       * when selectionMode is single, but not anymore.
       * @param {Array|Set} selection array of selected items
       * @return {Array} array of items
       * @private
       */
      _cloneSelection: function (selection) {
        var arr = [];
        // Array.from is not supported in IE11 and we do not have the polyfill
        selection.forEach(function (key) {
          arr.push(key);
        });

        return arr;
      },

      /**
       * @private
       */
      _getLocalData: function (key) {
        var data = this.getDataForVisibleItem({ key: key });
        if (data == null && this.m_validatedSelectedKeyData) {
          data = this.m_validatedSelectedKeyData.get(key);
        }
        return data;
      },

      /**
       * Sets the selection option with a new value
       * @param {Object} newValue the new value for selection option
       * @param {Event|null} event the DOM event
       * @param {Array.<Element>=} selectedElems an array of DOM Elements
       * @param {any=} firstSelectedItemData the data for first selected item
       * @private
       */
      _setSelectionOption: function (newValue, event, selectedElems, firstSelectedItemData) {
        var value = { key: null, data: null };

        var selection = ojkeyset.KeySetUtils.toArray(newValue);

        // check if the value has actually changed, based on key
        // firstSelectedItem should never be null and should always have 'key'
        var firstSelectedItem = this.GetOption('firstSelectedItem');

        // NavList firstSelectedItem would be undefined
        if (firstSelectedItem != null) {
          // first condition is if new value is empty and existing item is non null
          // second condition is if new value is not empty and does not match the existing item
          if (
            (selection.length === 0 && firstSelectedItem.key != null) ||
            !(
              selection[0] === firstSelectedItem.key ||
              oj.Object.compareValues(selection[0], firstSelectedItem.key)
            )
          ) {
            // update firstSelectedItem also
            if (selection.length > 0) {
              value = {
                key: selection[0],
                data:
                  firstSelectedItemData != null
                    ? firstSelectedItemData
                    : this._getLocalData(selection[0])
              };
            }

            this.SetOption('firstSelectedItem', value, {
              _context: {
                originalEvent: event,
                internalSet: true
              },
              changed: true
            });
          } else if (firstSelectedItem.data === undefined) {
            if (firstSelectedItemData == null) {
              // eslint-disable-next-line no-param-reassign
              firstSelectedItemData = this._getLocalData(selection[0]);
            }
            value = { key: firstSelectedItem.key, data: firstSelectedItemData };
            this.SetOption('firstSelectedItem', value, {
              _context: {
                originalEvent: null,
                internalSet: true
              },
              changed: true
            });
          }
        }

        var items;
        if (this.ojContext._IsCustomElement()) {
          items = selectedElems;
        } else if (selectedElems == null) {
          items = $({});
        } else {
          items = $(selectedElems);
        }

        var extra = { items: items };

        this.SetOption('selected', newValue, {
          _context: {
            originalEvent: event,
            internalSet: true,
            extraData: extra
          },
          changed: true
        });

        // update legacy selection last
        this.SetOption('selection', selection, {
          _context: {
            originalEvent: event,
            internalSet: true,
            extraData: extra
          },
          changed: true
        });
      },

      /**
       * Unhighlights the selection.  Does not change selection, focus, anchor, or frontier
       * @private
       */
      _unhighlightSelection: function () {
        if (this.m_keyElemMap == null) {
          return;
        }

        var self = this;
        var selected = this.GetOption('selected');
        if (selected.isAddAll()) {
          var items = this._getItemsCache();
          for (var i = 0; i < items.length; i++) {
            self._unhighlightElem(items[i], 'oj-selected');
          }
        } else {
          selected.values().forEach(function (key) {
            var elem = self.FindElementByKey(key);
            if (elem != null) {
              self._unhighlightElem(elem, 'oj-selected');
            }
          });
        }
      },

      _highlightElem: function (elem, style) {
        this.HighlightUnhighlightElem(elem, style, true);
      },

      _unhighlightElem: function (elem, style) {
        this.HighlightUnhighlightElem(elem, style, false);
      },

      /**
       * Highlight or unhighlight an element
       * @param {jQuery|Element} elem the element the highlight or unhighlight
       * @param {string} style the style to add or remove
       * @param {boolean} highlight true if it's to highlight, false if it's to unhighlight
       * @protected
       */
      HighlightUnhighlightElem: function (elem, style, highlight) {
        var $elem = $(elem);

        if (style === 'oj-selected') {
          this.getFocusItem($elem).attr('aria-selected', highlight ? 'true' : 'false');
        }

        // if item is a group, the highlight should be apply to the group item element
        var group = $elem.children('.' + this.getGroupItemStyleClass());
        if (group.length > 0) {
          $elem = $(group[0]);
        }

        if (style === 'oj-focus') {
          if (highlight) {
            // don't apply focus ring on item if we are in actionable mode
            if (this.m_keyMode !== 'actionable') {
              this._focusInHandler($elem);
            }
          } else {
            this._focusOutHandler($elem);
          }
        } else if (highlight) {
          $elem.addClass(style);
        } else {
          $elem.removeClass(style);
        }
      },

      /**
       * Handles click to select multiple cells/rows
       * @param {jQuery} item the item clicked on
       * @param {Event} event the click event
       * @protected
       */
      HandleClickSelection: function (item, event) {
        // make sure that it is visible
        this._scrollToVisible(item[0]);

        var ctrlKey = this._ctrlEquivalent(event);
        var shiftKey = event.shiftKey;
        var processed = true;
        if (this._isMultipleSelection()) {
          if (!ctrlKey && !shiftKey) {
            processed = this.SelectAndFocus(item, event);
          } else if (!ctrlKey && shiftKey) {
            // active item doesn't change in this case
            processed = this._extendSelection(item, event);
          } else {
            // processed is always true in this case
            this._augmentSelectionAndFocus(item, event);
          }
        } else {
          processed = this.SelectAndFocus(item, event, ctrlKey);
        }

        return processed;
      },

      /**
       * Handles tap to select multiple cells/rows
       * @param {jQuery} item the item clicked on
       * @param {Event} event the click event
       * @private
       */
      _handleTouchSelection: function (item, event) {
        var processed = true;
        if (this._isMultipleSelection()) {
          if (event.shiftKey) {
            // for touch device with keyboard support
            processed = this._extendSelection(item, event);
          } else {
            // treat this as like ctrl+click
            this._augmentSelectionAndFocus(item, event);
          }
        } else {
          processed = this.SelectAndFocus(item, event, true);
        }

        return processed;
      },

      /**
       * Clear the current selection.
       * @param {boolean} updateOption true if the underlying selection option should be updated, false otherwise.
       * @param {jQuery=} newSelectionFrontier new value to set the selection frontier. If none specified, set to null
       * @private
       */
      _clearSelection: function (updateOption, newSelectionFrontier) {
        // unhighlight previous selection
        this._unhighlightSelection();

        if (updateOption) {
          // if the intend is to empty selection option, we have to make sure if
          // selectionRequired is set to true that something is selected
          if (this._isSelectionRequired()) {
            this._selectFirstSelectableItem();
          } else {
            var selected = this.GetOption('selected');
            selected = selected.clear();
            this._setSelectionOption(selected, null, null);
          }
        }

        // clear selection frontier also
        this.m_selectionFrontier = newSelectionFrontier === undefined ? null : newSelectionFrontier;
      },

      /**
       * Selects the focus on the specified element
       * Select and focus is an asynchronus call
       * @param {jQuery} item the item clicked on
       * @param {Event} event the click event
       * @param {isToggle=} isToggle true if this is a toggle selection event
       * @protected
       */
      SelectAndFocus: function (item, event, isToggle) {
        var key = this.GetKey(item[0]);
        var selected = this.GetOption('selected');
        var exists = selected.has(key);

        // check if there's only one item selected and selection is required
        if (
          exists &&
          selected.values &&
          selected.values().size === 1 &&
          this._isSelectionRequired()
        ) {
          return false;
        }

        var isRedwood = ThemeUtils.parseJSONFromFontFamily('oj-theme-json').behavior === 'redwood';
        // if it's already selected, deselect it and update options
        if (exists && (isToggle || !isRedwood)) {
          this._clearSelection(true);
        } else {
          this._clearSelection(false);
          // add the elem to selection
          this._augmentSelectionAndFocus(item, event, selected.clear());
        }

        return true;
      },

      /**
       * Shift+click to extend the selection
       * @param {jQuery} item the item to extend selection to
       * @param {Event} event the key event
       * @private
       */
      _extendSelection: function (item, event) {
        if (this.m_active == null) {
          return false;
        }

        // checks if selection has changed
        var current = this.m_selectionFrontier;
        if (current === item) {
          return false;
        }

        // remove focus style on the item click on
        this._unhighlightElem(item, 'oj-focus');

        this._extendSelectionRange(this.m_active.elem, item, event);

        return true;
      },

      /**
       * Extend the selection
       * @param {jQuery} from the item to extend selection from
       * @param {jQuery} to the item to extend selection to
       * @param {Event} event the event that triggers extend
       * @param {boolean=} keepSelectionFrontier true if we don't want to modify the selectionFrontier
       * @private
       */
      _extendSelectionRange: function (from, to, event, keepSelectionFrontier) {
        if (keepSelectionFrontier === true) {
          // clear selection as we'll be just re-highlight the entire range
          this._clearSelection(false, this.m_selectionFrontier);
        } else {
          this._clearSelection(false, to);
        }

        // highlights the items between active item and new item
        this._highlightRange(from, to, event);
        this.HighlightActive();

        // make sure that it is visible
        this._scrollToVisible(to[0]);
      },

      /**
       * Highlight the specified range
       * @param {jQuery} start the start of the range
       * @param {jQuery} end the end of the range
       * @param {Event} event the event that triggers the highlight
       * @private
       */
      _highlightRange: function (start, end, event) {
        var from;
        var to;
        var selected = this.GetOption('selected').clear();
        var selectedItems = [];
        var items = this._getItemsCache();
        var startIndex = items.index(start);
        var endIndex = items.index(end);

        if (startIndex > endIndex) {
          from = endIndex;
          to = startIndex;
        } else {
          from = startIndex;
          to = endIndex;
        }

        // exclude start and include end
        for (var i = from; i <= to; i++) {
          var item = items[i];
          if (this.IsSelectable(item)) {
            var key = this.m_contentHandler.GetKey(item);

            this._applySelection(item, key);
            selected = selected.add([key]);
            selectedItems.push(item);
          }
        }

        // trigger the optionChange event
        this._setSelectionOption(selected, event, selectedItems);
      },

      /**
       * Apply selection to the element
       * @param {jQuery|Element} element the item to apply selection
       * @param {Object} key the key of the item
       * @private
       */
      _applySelection: function (element, key) {
        // update map that keeps track of key->element
        if (this.m_keyElemMap == null) {
          this.m_keyElemMap = this.m_contentHandler.createKeyMap();
        }
        this.m_keyElemMap.set(key, $(element).attr('id'));

        // highlight selection
        this._highlightElem(element, 'oj-selected');
      },

      /**
       * Ctrl+click to add item to the current selection
       * @param {jQuery} item the item to augment selection to
       * @param {Event} event the event that triggers the selection
       * @param {KeySet=} selected the optional selection to augment, if not specified, use current selection
       * @private
       */
      _augmentSelectionAndFocus: function (item, event, selected) {
        var active = item;
        var key = this.GetKey(item[0]);

        if (selected == null) {
          // eslint-disable-next-line no-param-reassign
          selected = this.GetOption('selected');
        }

        // update active only if target is not inside the active item
        var currentActive = this.m_active != null ? this.m_active.elem.get(0) : null;
        // if it's a group, use the group header div instead otherwise currentActive.contains check will not be valid
        if (currentActive != null && !$(currentActive).hasClass(this.getItemStyleClass())) {
          currentActive = currentActive.firstElementChild;
        }

        if (
          event != null &&
          (currentActive == null ||
            currentActive === event.target ||
            !currentActive.contains(event.target))
        ) {
          this.UnhighlightActive();

          // update active cell and frontier
          var proceed = this._setActive(active, event);
          if (proceed) {
            // update current option
            this._setCurrentItemOption(key, event, active.get(0));
          }

          // highlight index
          this.HighlightActive();
        }

        // checks if setActive was successful
        currentActive = this.m_active != null ? this.m_active.elem.get(0) : null;
        if (currentActive == null || currentActive !== active.get(0)) {
          // update selection if it was cleared
          if (selected != null && selected.values().size === 0) {
            this._setSelectionOption(selected, event, []);
          }
          return;
        }

        if (selected.has(key)) {
          if (selected.values && selected.values().size === 1 && this._isSelectionRequired()) {
            // only one selected item and selection is required, do nothing
            return;
          }

          // it was selected, deselect it
          this._unhighlightElem(item, 'oj-selected');
          // eslint-disable-next-line no-param-reassign
          selected = selected.delete([key]);
        } else {
          this.m_selectionFrontier = item;
          this._applySelection(item, key);
          // eslint-disable-next-line no-param-reassign
          selected = selected.add([key]);
        }

        var selectedItems = [];
        if (selected.values) {
          selected.values().forEach(function (aKey) {
            selectedItems.push(this.FindElementByKey(aKey));
          }, this);
        }

        // trigger option change
        this._setSelectionOption(selected, event, selectedItems);
      },

      /**
       * Toggle selection of an item.  If an item was selected, it deselects it.  If an item was not selected, it selects it.
       * @param {Event} event the event that triggers the selection
       * @param {boolean} keepCurrentSelection true if selecting an item would not deselect other selected items, false otherwise
       * @param {boolean} skipIfNotSelected true if an selected item should not be deselected, false otherwise
       * @protected
       */
      ToggleSelection: function (event, keepCurrentSelection, skipIfNotSelected) {
        // if it's currently selected, deselect it
        var selected = this.GetOption('selected');
        var item = this.m_active.elem;
        var key = this.m_active.key;

        if (selected.has(key)) {
          // do not deselect the item if it's the last selected item and selection is required
          if (skipIfNotSelected || (selected.values().size === 1 && this._isSelectionRequired())) {
            return;
          }

          // it was selected, deselect it
          this._unhighlightElem(item, 'oj-selected');
          selected = selected.delete([key]);

          if (selected.values().size === 0) {
            this.m_selectionFrontier = null;
          }
        } else if (this.IsSelectable(item[0])) {
          // deselect any selected items
          if (!keepCurrentSelection) {
            this._clearSelection(false);
            selected = selected.clear();
          }

          this.m_selectionFrontier = item;

          // select current item
          this._applySelection(item, key);
          selected = selected.add([key]);
        }

        var selectedItems = [];
        selected.values().forEach(function (aKey) {
          selectedItems.push(this.FindElementByKey(aKey));
        }, this);

        // trigger option change
        this._setSelectionOption(selected, event, selectedItems);
      },

      /**
       * Checks whether the element is an input element.
       * @param {Element} elem the element to check
       * @return {boolean} true if it's input, false otherwise
       * @private
       */
      _isInputElement: function (elem) {
        var inputRegExp = /^INPUT|SELECT|OPTION|TEXTAREA/;
        return elem.nodeName.match(inputRegExp) != null && !elem.readOnly;
      },

      /**
       * Handles key event for selection or active
       * @param {Event} event
       * @return {boolean} true if the event is processed
       * @protected
       */
      HandleSelectionOrActiveKeyDown: function (event) {
        var ctrlKey;
        var shiftKey;
        var processed = false;
        var first;

        // this could happen if nothing in the list is focusable
        // or if the key is handled by a descendant already and explicitly do not want parent to handle
        if (this.m_active == null || event.isDefaultPrevented()) {
          return false;
        }

        var key = event.key || event.keyCode;
        var current = this.m_active.elem;

        if (this._isActionableMode()) {
          // Esc key goes to navigation mode
          // F2 key can also be used to exit actionable mode if already in actionable mode
          if (
            key === 'Escape' ||
            key === 'Esc' ||
            key === this.ESC_KEY ||
            key === 'F2' ||
            key === this.F2_KEY
          ) {
            this._exitActionableMode();

            // force focus back on the active cell
            this.HighlightActive();
            this._focusItem(current);

            // make sure active item has tabindex set
            this._setTabIndex(current);
            processed = true;
          } else if (key === 'Tab' || key === this.TAB_KEY) {
            var focusElem = this.getFocusItem(current).get(0);
            if (event.shiftKey) {
              processed = DataCollectionUtils.handleActionablePrevTab(event, focusElem);
            } else {
              processed = DataCollectionUtils.handleActionableTab(event, focusElem);
            }

            if ((!event.shiftKey && processed) || (event.shiftKey && !processed)) {
              var firstFocuasble = DataCollectionUtils.getFocusableElementsInNode(focusElem)[0];
              if (firstFocuasble && this._isExpandCollapseIcon(firstFocuasble)) {
                this._focusInHandler($(firstFocuasble));
              }
            }

            // otherwise don't process and let browser handles tab
          }
        } else if (key === 'F2' || key === this.F2_KEY) {
          // F2 key goes to actionable mode
          event.stopPropagation();
          this._enterActionableMode();

          // focus on first focusable item in the cell
          first = current.find('[data-first]');
          if (first.length > 0) {
            first[0].focus();

            if (this._isExpandCollapseIcon(first)) {
              this._focusInHandler(first);
            }

            // check if it's group item
            if (!current.hasClass(this.getItemStyleClass())) {
              current = current.children('.' + this.getGroupItemStyleClass()).first();
            }
            current.removeClass('oj-focus-highlight').addClass('oj-focus-previous-highlight');
          }
        } else if (
          (key === ' ' || key === 'Spacebar' || key === this.SPACE_KEY) &&
          this._isSelectionEnabled() &&
          !this._isInputElement(event.target)
        ) {
          ctrlKey = this._ctrlEquivalent(event);
          shiftKey = event.shiftKey;
          if (
            shiftKey &&
            !ctrlKey &&
            this.m_selectionFrontier != null &&
            this._isMultipleSelection()
          ) {
            // selects contiguous items from last selected item to current item
            this._extendSelectionRange(this.m_selectionFrontier, this.m_active.elem, event, true);
          } else {
            // toggle selection, deselect previous selected items
            this.ToggleSelection(event, ctrlKey && !shiftKey && this._isMultipleSelection(), false);
          }
          processed = true;
        } else if (key === 'Enter' || key === this.ENTER_KEY) {
          if (this._isSelectionEnabled()) {
            // selects it if it's not selected, do nothing if it's already selected
            this.ToggleSelection(event, false, true);
          }
          this._fireActionEvent(current.get(0), event, false);
        } else if (this.IsArrowKey(key)) {
          ctrlKey = this._ctrlEquivalent(event);
          shiftKey = event.shiftKey;
          if (!ctrlKey) {
            processed = this.HandleArrowKeys(
              key,
              shiftKey && this._isSelectionEnabled() && this._isMultipleSelection(),
              event
            );
          }
        } else if (key === 'Tab' || key === this.TAB_KEY) {
          // content could have changed, disable all elements in items before or after the active item
          if (event.shiftKey) {
            this._disableAllTabbableElementsBeforeItem(current);
          } else {
            this._disableAllTabbableElementsAfterItem(current);
          }
        }

        return processed;
      },

      /** ******************************** End Selection **********************************************/

      /** ******************************** Disclosure **********************************************/
      /**
       * Whether the group item is currently in the middle of expanding/collapsing
       * @param {Object} key the key of the group item
       * @return {boolean} true if it's expanding/collapsing, false otherwise
       * @private
       */
      _isDisclosing: function (key) {
        if (key && this.m_disclosing) {
          return this.m_disclosing.indexOf(key) > -1;
        }

        return false;
      },

      /**
       * Marks a group item as currently in the middle of expanding/collapsing
       * @param {Object} key the key of the group item
       * @param {boolean} flag true or false
       * @private
       */
      _setDisclosing: function (key, flag) {
        if (key == null) {
          return;
        }

        if (this.m_disclosing == null) {
          this.m_disclosing = [];
        }

        if (flag) {
          this.m_disclosing.push(key);
        } else {
          // there should be at most one entry, but just in case remove all occurrences
          var index = this.m_disclosing.indexOf(key);
          while (index > -1) {
            this.m_disclosing.splice(index, 1);
            index = this.m_disclosing.indexOf(key);
          }
        }
      },

      /**
       * Gets the option defaults
       * @private
       */
      _getOptionDefaults: function () {
        if (this.defaultOptions == null) {
          this.defaultOptions = this.getStyleValues();
        }
        if (this.defaultOptions == null) {
          Logger.error(
            'Cannot find oj-list-view option defaults, which might be caused by missing JET css file'
          );
          return {};
        }
        return this.defaultOptions;
      },

      /**
       * Gets the animation effect for the specific action
       * @param {string} action the action to retrieve the effect
       * @return {Object} the animation effect for the action
       */
      getAnimationEffect: function (action) {
        var defaultOptions = this._getOptionDefaults();
        var defaultAnimations = defaultOptions.animation;
        return defaultAnimations == null ? null : defaultAnimations[action];
      },

      /**
       * Whether group items can be expand/collapse.
       * @return {boolean} true if group items can be expand/collapse, false otherwise.
       */
      isExpandable: function () {
        return this.GetOption('drillMode') !== 'none';
      },

      /**
       * Whether ListView should expand all expandable items.
       * @param {any} key the key of the item to check
       * @return {boolean} true if expand all, false otherwise
       * @private
       */
      _isExpandAll: function (key) {
        var expanded = this.GetOption('expanded');
        // for legacy syntax, which supports 'auto' and 'all'
        // TODO: should add check for custom element, but can't do it until NavList also move to KeySet
        if (expanded === 'auto') {
          // if drillMode is none and no expanded state is specified, expand all
          if (!this.isExpandable()) {
            return true;
          }
        } else if (expanded === 'all') {
          return true;
        }

        // for custom element and also legacy syntax that uses the new KeySet"expand
        if (expanded.isAddAll) {
          // if drillMode is none and no expanded state is specified, expand all
          return !this.isExpandable() && expanded instanceof _ojListViewExpandedKeySet
            ? true
            : expanded.isAddAll() && expanded.has(key);
        }

        return false;
      },

      /**
       * Expand an item with specified key.
       * Invoked by widget
       * @param {Object} key the key of the group item to expand
       * @param {boolean} beforeVetoable true if beforeExpand event can be veto, false otherwise
       * @param {boolean} fireBefore true if this should trigger a beforeExpand event
       * @param {boolean} fireAfter true if this should trigger an expand event
       * @param {boolean} animate true if animate the expand operation, false otherwise
       */
      expandKey: function (key, beforeVetoable, fireBefore, fireAfter, animate) {
        var item = this.FindElementByKey(key);
        if (item != null) {
          this.ExpandItem($(item), null, animate, key, beforeVetoable, fireAfter, fireBefore);
        }
      },

      /**
       * Handle expand operation
       * @param {Event} event the event that triggers the expand
       * @private
       */
      _expand: function (event) {
        var item = this.FindItem(event.target);
        if (item != null && item.length > 0) {
          this.SetCurrentItem(item, event);
          this.ExpandItem(item, event, true, null, true, true, true);
        }
      },

      /**
       * Expand an item
       * @param {jQuery} item the item to expand
       * @param {Event} event the event that triggers expand.  Note that event could be null in the case where this is programmatically done by the widget
       * @param {boolean} animate true if animate the expand operation, false otherwise
       * @param {Object|null} key the key of the item, if not specified, the logic will figure it out from the item
       * @param {boolean} beforeVetoable true if beforeExpand event can be veto, false otherwise
       * @param {boolean} fireEvent true if fire expand event, false otherwise
       * @param {boolean} fireBeforeEvent true if fire beforeexpand event, false otherwise
       * @protected
       */
      ExpandItem: function (item, event, animate, key, beforeVetoable, fireEvent, fireBeforeEvent) {
        // checks if it's already collapsed or not collapsible at all
        if (this.GetState(item) !== this.STATE_COLLAPSED) {
          return;
        }

        // if key wasn't specified, find it
        if (key == null) {
          // eslint-disable-next-line no-param-reassign
          key = this.GetKey(item[0]);
        }

        // bail if it's in the middle of expanding/collapsing
        if (animate && this._isDisclosing(key)) {
          return;
        }

        var ui = { item: item, key: key };

        if (fireBeforeEvent) {
          var cancelled = !this.Trigger('beforeExpand', event, ui);
          if (cancelled && beforeVetoable) {
            return;
          }
        }

        this.signalTaskStart('Expand item: ' + key); // signal method task start

        if (animate) {
          this._setDisclosing(key, true);
        }
        this.m_contentHandler.Expand(
          item,
          function (groupItem) {
            this._expandSuccess(groupItem, animate, event, ui, fireEvent);
          }.bind(this)
        );

        // clear items cache
        this.m_items = null;

        // prevent item click handler to trigger
        if (event != null) {
          event.stopPropagation();
        }

        // update var that keeps track of collapsed items
        if (!this.ojContext._IsCustomElement() && this._collapsedKeys != null) {
          var index = this._collapsedKeys.indexOf(key);
          if (index !== -1) {
            this._collapsedKeys.splice(index, 1);
          }
        }

        this.signalTaskEnd(); // signal method task end
      },

      /**
       * @param {Element} groupItem
       * @param {boolean} animate
       * @param {Event} event
       * @param {Object} ui
       * @param {boolean} fireEvent
       * @private
       */
      _expandSuccess: function (groupItem, animate, event, ui, fireEvent) {
        var self = this;

        this.signalTaskStart('Handle results from successful expand'); // signal method task start

        // save the key for use when expand complete
        // eslint-disable-next-line no-param-reassign
        groupItem.key = ui.key;

        var animationPromise = this.AnimateExpand($(groupItem), animate, event);

        var item = groupItem.parentNode;

        item = $(item);
        // update aria expanded
        this.SetState(item, this.STATE_EXPANDED);
        // update icon
        var collapseClass = this.getCollapseIconStyleClass();
        var expandClass = this.getExpandIconStyleClass();
        var expandingClass = this.getExpandingIconStyleClass();
        var groupItemStyleClass = this.getGroupItemStyleClass();
        item
          .children('.' + groupItemStyleClass)
          .find('.' + collapseClass + ', .' + expandingClass)
          .removeClass(collapseClass)
          .removeClass(expandingClass)
          .addClass(expandClass);

        // fire expand event after expand animation completes
        if (fireEvent) {
          animationPromise.then(function () {
            // update option.  As an optimization do it only when fireEvent is true since this is the
            // only time when it's not triggered by API, in which case the value is already current
            if (self.ojContext._IsCustomElement()) {
              var currValue = self.GetOption('expanded');
              if (self._isKeySet(currValue) && !currValue.has(groupItem.key)) {
                var newValue = currValue.add([groupItem.key]);
                self.SetOption('expanded', newValue, {
                  _context: {
                    originalEvent: event,
                    internalSet: true
                  },
                  changed: true
                });
              }
            }

            self.Trigger('expand', event, ui);
          });
        }

        animationPromise.then(function () {
          // clear cached height
          self.m_clientHeight = null;
          self.m_scrollHeight = null;
          self.signalTaskEnd(); // signal method task end
        });
      },

      /**
       * Adjust the max height of ancestors of a group items.
       * @param {jQuery} groupItem the group item where we want to adjust its ancestors max height
       * @param {number} delta the height to increase
       * @private
       */
      _adjustAncestorsMaxHeight: function (groupItem, delta) {
        groupItem
          .parentsUntil('ul.oj-component-initnode', 'ul.' + this.getGroupStyleClass())
          .each(function () {
            var maxHeight = parseInt($(this).css('maxHeight'), 10);
            if (maxHeight > 0) {
              $(this).css('maxHeight', maxHeight + delta + 'px');
            }
          });
      },

      /**
       * Animate expand operation
       * @param {jQuery} groupItem the group item that is expand (todo: not consistent with animateCollapse)
       * @param {boolean} animate true if animate expand, false otherwise
       * @param {Event} event the event that triggers expand.  Note that event could be null in the case where this is programmatically done by the widget
       * @return {Promise} A Promise that resolves when expand animation completes
       * @protected
       */
      // eslint-disable-next-line no-unused-vars
      AnimateExpand: function (groupItem, animate, event) {
        var totalHeight = 0;
        var animationResolve;
        var self = this;
        var action = 'expand';

        var animationPromise = new Promise(function (resolve) {
          animationResolve = resolve;
        });

        if (animate) {
          var elem = /** @type {Element} */ (groupItem.get(0));
          elem.setAttribute('data-oj-context', '');

          // we have to wait for the items content to finish rendering before we calculate the height
          var busyContext = Context.getContext(elem).getBusyContext();
          busyContext.whenReady().then(function () {
            if (!self.isAvailable()) {
              return;
            }

            elem.removeAttribute('data-oj-context');

            self.signalTaskStart('Animate expand of group item'); // signal task start

            // reset max height to 100% first so we can get the correct outerHeight
            groupItem.css('maxHeight', '100%');
            groupItem.children().each(function () {
              totalHeight += $(this).outerHeight(true);
            });

            // for touch we'll need to re-adjust the max height of parent nodes since max height doesn't get remove
            if (self._isNonWindowTouch()) {
              self._adjustAncestorsMaxHeight(groupItem, totalHeight);
            }

            groupItem.css('maxHeight', totalHeight + 'px');

            self.signalTaskStart('Kick off expand animation'); // signal expand animation started. Ends in _handleExpandTransitionEnd()

            // now show it
            var promise = self.StartAnimation(elem, action);
            promise.then(function () {
              self._handleExpandTransitionEnd(groupItem, animationResolve);
            });

            self.signalTaskEnd(); // signal task end
          });
        } else {
          // if we are not animating, then we don't really care about setting max height
          groupItem.css('maxHeight', '');

          this.AnimateExpandComplete(groupItem);
          animationResolve(null); // resolve animationPromise
        }
        return animationPromise;
      },

      _handleExpandTransitionEnd: function (groupItem, animationResolve) {
        // on ios removing max-height will cause double animation
        if (!this._isNonWindowTouch()) {
          groupItem.css('maxHeight', '');
        }

        this.AnimateExpandComplete(groupItem);
        animationResolve(null); // resolve animationPromise

        this.signalTaskEnd(); // signal expand animation ended. Started in this.AnimateExpand()
      },

      /**
       * Invoked when expand animation is completed.  Class who overrides AnimateExpand
       * must call this method upon finish animation.
       * @param {jQuery} groupItem the item to collapse
       * @protected
       */
      AnimateExpandComplete: function (groupItem) {
        groupItem
          .removeClass(this.getGroupCollapseStyleClass())
          .addClass(this.getGroupExpandStyleClass());
        this._setDisclosing(groupItem[0].key, false);
      },

      /**
       * Collapse an item with specified key.
       * Invoked by widget
       * @param {Object} key the key of the group item to collapse
       * @param {boolean} fireBefore true if this should trigger a beforeCollapse event
       * @param {boolean} fireAfter true if this should trigger a collapse event
       * @param {boolean} animate true if animate the collapse operation, false otherwise
       */
      collapseKey: function (key, fireBefore, fireAfter, animate) {
        var item = this.FindElementByKey(key);
        if (item != null) {
          this.CollapseItem($(item), null, animate, key, fireBefore, fireAfter);
        }
      },

      _collapse: function (event) {
        var item = this.FindItem(event.target);
        if (item != null && item.length > 0) {
          this.SetCurrentItem(item, event);
          this.CollapseItem(item, event, true, null, true, true);
        }
      },

      /**
       * Collapse an item
       * @param {jQuery} item the item to expand
       * @param {Event} event the event that triggers collapse.  Note that event could be null in the case where this is programmatically done by the widget
       * @param {boolean} animate true if animate the collapse operation, false otherwise
       * @param {Object|null} key the key of the item, if not specified, the logic will figure it out from the item
       * @param {boolean} beforeVetoable true if beforeCollapse event can be veto, false otherwise
       * @param {boolean} fireEvent true if fire collapse event, false otherwise
       * @protected
       */
      CollapseItem: function (item, event, animate, key, beforeVetoable, fireEvent) {
        var self = this;

        // checks if it's already collapsed or not collapsible at all
        if (this.GetState(item) !== this.STATE_EXPANDED) {
          return;
        }

        // fire beforeCollapse event
        if (key == null) {
          // eslint-disable-next-line no-param-reassign
          key = this.GetKey(item[0]);
        }

        // bail if it is in the middle of expanding/collapsing
        if (animate && this._isDisclosing(key)) {
          return;
        }

        var ui = { item: item, key: key };

        var cancelled = !this.Trigger('beforeCollapse', event, ui);
        if (cancelled && beforeVetoable) {
          return;
        }

        this.signalTaskStart('Collapse item: ' + key); // signal method task start

        if (animate) {
          this._setDisclosing(key, true);
        }

        // animate collapse
        var animationPromise = this.AnimateCollapse(item, key, animate, event);

        // update aria expanded
        this.SetState(item, this.STATE_COLLAPSED);
        // update icon
        var collapseClass = this.getCollapseIconStyleClass();
        var expandClass = this.getExpandIconStyleClass();
        item
          .find('.' + expandClass)
          .first()
          .removeClass(expandClass)
          .addClass(collapseClass);

        // clear items cache
        this.m_items = null;

        // prevent item click handler to trigger
        if (event != null) {
          event.stopPropagation();
        }

        // fire collapse event after collapse animation completes
        if (fireEvent) {
          animationPromise.then(function () {
            // update option.  As an optimization do it only when event is not null since this is the
            // only time when it's not triggered by API, in which case the value is already current
            if (event != null && self.ojContext._IsCustomElement()) {
              var currValue = self.GetOption('expanded');
              if (self._isKeySet(currValue)) {
                var newValue = currValue.delete([key]);
                self.SetOption('expanded', newValue, {
                  _context: {
                    originalEvent: event,
                    internalSet: true
                  },
                  changed: true
                });
              }
            }

            self.Trigger('collapse', event, ui);
          });
        }

        // _collapsedKeys should only be used in the legacy syntax case
        if (!this.ojContext._IsCustomElement()) {
          // keep track of collapsed item
          if (this._collapsedKeys == null) {
            this._collapsedKeys = [];
          }

          if (this._collapsedKeys.indexOf(key) === -1) {
            this._collapsedKeys.push(key);
          }
        }

        animationPromise.then(function () {
          // clear cached height
          self.m_clientHeight = null;
          self.m_scrollHeight = null;
          self.signalTaskEnd(); // signal method task end
        });
      },

      /**
       * Animate collapse operation
       * To be change by NavList
       * @param {jQuery} item the item to collapse
       * @param {Object} key the key of the group item
       * @param {boolean} animate true if animate the collapse operation, false otherwise
       * @param {Event} event the event that triggers collapse.  Note that event could be null in the case where this is programmatically done by the widget
       * @return {Promise} A Promise that resolves when collapse animation completes
       * @protected
       */
      // eslint-disable-next-line no-unused-vars
      AnimateCollapse: function (item, key, animate, event) {
        var totalHeight = 0;
        var animationResolve;
        var self = this;
        var action = 'collapse';

        var animationPromise = new Promise(function (resolve) {
          animationResolve = resolve;
        });

        var groupItem = item.children('ul').first();
        // save the key for collapse animation complete
        groupItem[0].key = key;

        if (animate) {
          this.signalTaskStart('Animate collapse'); // signal task start

          groupItem.children().each(function () {
            totalHeight += $(this).outerHeight();
          });

          groupItem.css('maxHeight', totalHeight + 'px');

          var effect = this.getAnimationEffect(action);
          // max-height = 0 needs to stick around, especially needed for static content
          effect.persist = 'all';

          this.signalTaskStart('Kick off collapse animation'); // signal collapse animation started. Ends in _handleCollapseTransitionEnd()

          // now hide it
          var elem = /** @type {Element} */ (groupItem.get(0));
          var promise = this.StartAnimation(elem, action, effect);
          promise.then(function () {
            self._handleCollapseTransitionEnd(groupItem, animationResolve);
          });

          this.signalTaskEnd(); // signal task end
        } else {
          groupItem.css('maxHeight', '0px');

          this.AnimateCollapseComplete(groupItem);
          animationResolve(null); // resolve animationPromise
        }
        return animationPromise;
      },

      _handleCollapseTransitionEnd: function (groupItem, animationResolve) {
        this.AnimateCollapseComplete(groupItem);

        animationResolve(null); // resolve animationPromise

        this.signalTaskEnd(); // signal collapse animation ended. Started in AnimateCollapse()
      },

      /**
       * Invoked when collapse animation is completed.  Class who overrides AnimateCollapse
       * must call this method upon finish animation.
       * @param {jQuery} groupItem the item to collapse
       * @private
       */
      AnimateCollapseComplete: function (groupItem) {
        groupItem
          .removeClass(this.getGroupExpandStyleClass())
          .addClass(this.getGroupCollapseStyleClass());

        // ask the content handler to do the collapse operation
        // content handler might have been destroyed if animation ended after destroy is called
        if (this.m_contentHandler != null) {
          this.m_contentHandler.Collapse(groupItem);
        }

        this._setDisclosing(groupItem[0].key, false);
      },

      /**
       * Gets the keys of currently expanded items.
       * Invoke by widget
       * @return {Array} array of keys of currently expanded items.
       */
      getExpanded: function () {
        var expanded = [];
        var self = this;
        var items = this._getItemsCache();

        items.each(function () {
          var item = $(this);
          if (self.GetState(item) === self.STATE_EXPANDED) {
            expanded.push(self.GetKey(item[0]));
          }
        });

        return expanded;
      },
      /** ******************************* End Disclosure *******************************************/

      /**
       * Returns widget constructor.  Used by ContentHandler
       */
      getWidgetConstructor: function () {
        return Components.__GetWidgetConstructor(this.element);
      },

      /** ********************************* Style Classes *********************************************/
      /**
       * To be change by NavList
       * @return {string} the container style class
       * @protected
       */
      GetContainerStyleClass: function () {
        // do not set overflow to scroll for windows touch enabled devices
        if (this._isNonWindowTouch()) {
          return 'oj-listview oj-listview-container-touch';
        }

        return 'oj-listview oj-listview-container';
      },

      /**
       * To be change by NavList
       * @return {string} the main element style class
       * @protected
       */
      GetStyleClass: function () {
        return 'oj-listview-element';
      },

      /**
       * To be change by NavList.  Access by ContentHandler.
       * @return {string} the list item style class
       */
      getItemStyleClass: function () {
        if (this.isCardDisplayMode()) {
          return 'oj-listview-card';
        }
        return 'oj-listview-item';
      },

      getNoDataItemStyleClass: function () {
        return 'oj-listview-no-data-item';
      },

      getNoDataCellElementStyleClass: function () {
        return 'oj-listview-no-data-cell-element';
      },

      /**
       * Gets the item layout class
       */
      getItemLayoutStyleClass: function () {
        // we don't have a default layout style class for card yet
        return this.isCardLayout() ? null : 'oj-listview-item-layout';
      },

      /**
       * To be change by NavList.  Access by ContentHandler.
       * @return {string} the focused element style class
       */
      getFocusedElementStyleClass: function () {
        return 'oj-listview-focused-element';
      },

      /**
       * To be change by NavList.  Access by ContentHandler.
       * @return {string} the list item element style class
       */
      getItemElementStyleClass: function () {
        return 'oj-listview-item-element';
      },

      /**
       * To be change by NavList.  Access by ContentHandler.
       * @param {boolean=} includeSupplement optional flag to indicate whether to include any supplement classes
       * @return {string} the group item element style class
       */
      getGroupItemStyleClass: function (includeSupplement) {
        if (includeSupplement && this._isPinGroupHeader() && this._isPositionStickySupported()) {
          return 'oj-listview-group-item oj-sticky';
        }

        return 'oj-listview-group-item';
      },

      /**
       * To be change by NavList.  Access by ContentHandler.
       * @return {string} the group element style class
       */
      getGroupStyleClass: function () {
        return this.isCardDisplayMode() ? 'oj-listview-card-group' : 'oj-listview-group';
      },

      /**
       * To be change by NavList.  Access by ContentHandler.
       * @return {string} the group expand style class
       */
      getGroupExpandStyleClass: function () {
        return '';
      },

      /**
       * To be change by NavList.  Access by ContentHandler.
       * @return {string} the group collapse style class
       */
      getGroupCollapseStyleClass: function () {
        return this.getGroupExpandStyleClass();
      },

      /**
       * To be change by NavList
       * @return {string} the collapse icon style class
       */
      getCollapseIconStyleClass: function () {
        return 'oj-listview-collapse-icon';
      },

      /**
       * To be change by NavList
       * @return {string} the expand icon style class
       */
      getExpandIconStyleClass: function () {
        return 'oj-listview-expand-icon';
      },

      /**
       * To be change by NavList
       * @return {string} the expanding icon style class
       */
      getExpandingIconStyleClass: function () {
        return 'oj-listview-expanding-icon';
      },

      /**
       * To be change by NavList
       * @return {string} the empty text style class
       */
      getEmptyTextStyleClass: function () {
        return 'oj-listview-no-data-message';
      },

      /**
       * To be change by NavList
       * @return {string} the empty text marker class
       */
      getEmptyTextMarkerClass: function () {
        return 'oj-listview-empty-text';
      },

      /**
       * To be change by NavList
       * @return {string} the depth style class
       */
      // eslint-disable-next-line no-unused-vars
      getDepthStyleClass: function (depth) {
        return '';
      },

      /**
       * To be change by NavList
       * @return {Object} default styles values
       */
      getStyleValues: function () {
        const defaultOptions = {};
        Object.entries(_ojListView._CSS_Vars).forEach(([key, value]) => {
          if (key === 'animation' || key === 'gridlines') {
            defaultOptions[key] = _ojListView.getComplexCSSVariable(value);
          } else {
            defaultOptions[key] = ThemeUtils.getCachedCSSVarValues([value])[0];
          }
        });
        return defaultOptions;
      },

      /**
       * To be change by NavList
       * @return {string} Loading status icon style class
       */
      getLoadingStatusIconStyleClass: function () {
        return 'oj-listview-loading-icon';
      },
      /**
       * To be change by NavList
       * @return {string} status message style class
       */
      getStatusMessageStyleClass: function () {
        return 'oj-listview-status-message';
      },
      /**
       * To be change by NavList
       * @return {string} status style class
       */
      getStatusStyleClass: function () {
        return 'oj-listview-status';
      },

      /** ******************************* End Style Classes *******************************************/

      /** ********************************* Pin Header *********************************************/
      _isPositionStickySupported: function () {
        // use native position sticky support for all platforms except IE11
        return !DataCollectionUtils.isIE() && !DataCollectionUtils.isEdge();
      },

      /**
       * Helper method to prevent scroll by mouse wheel causes the page to scroll because it has reached the start/end of the list
       * @param {Element} scroller the scroller
       * @param {Event} event the mouse wheel event
       * @private
       */
      _preventMouseWheelOverscroll: function (scroller, event) {
        var delta = event.originalEvent.deltaY;
        // should only be applicable to TableDataSourceContentHandler for now
        if (isNaN(delta) || this.m_contentHandler.hasMoreToFetch === undefined) {
          return;
        }

        var scrollTop = scroller.scrollTop;
        if (delta > 0) {
          // scroll down
          var scrollHeight = this._getScrollHeight();
          if (
            this.m_contentHandler.hasMoreToFetch() &&
            scrollTop + this._getClientHeight() + Math.abs(delta) >= scrollHeight
          ) {
            // eslint-disable-next-line no-param-reassign
            scroller.scrollTop = scrollHeight;
            event.preventDefault();
          }
        } else if (scrollTop > 0 && scrollTop + delta <= 0) {
          // scroll up
          // eslint-disable-next-line no-param-reassign
          scroller.scrollTop = 0;
          event.preventDefault();
        }
      },

      /**
       * Retrieve the element where the scroll listener is registered on.
       * @private
       */
      _getScrollEventElement: function () {
        var scroller = this._getScroller();

        // if scroller is the body, listen for window scroll event.  This is the only way that works consistently across all browsers.
        if (scroller === document.body || scroller === document.documentElement) {
          return window;
        }

        return scroller;
      },

      /**
       * Find the element closest to the top of the viewport
       * @param {number} currScrollTop the current scrolltop
       * @prarm {boolean} isHierData if this supports hierarchical data
       * @param {number} itemHeight the item height
       * @private
       */
      _findClosestElementToTop: function (currScrollTop, isHierData, itemHeight) {
        // getItemsCache returns a flat view of all expanded items
        var items = isHierData
          ? this._getItemsCache()
          : $(this._getRootNodeForItems()).children('li.' + this.getItemElementStyleClass());
        if (items == null || items.length === 0) {
          return null;
        }

        // if the previous scroll position is relatively close to the current one
        // we'll use the previous index as the starting point
        var index;
        var prevScrollPosition = this.GetOption('scrollPosition');
        if (
          Math.abs(prevScrollPosition.y - currScrollTop) < this.MINIMUM_ITEM_HEIGHT &&
          prevScrollPosition.key != null &&
          !isNaN(prevScrollPosition.index)
        ) {
          if (isHierData) {
            var element = this.FindElementByKey(prevScrollPosition.key);
            if (element != null) {
              index = items.index(element);
            }
          } else {
            index = prevScrollPosition.index;
          }
        }

        // we'll need to approximate the index
        if (isNaN(index)) {
          index = Math.floor(currScrollTop / itemHeight);
        }
        // ensure estimated index is valid
        index = Math.min(Math.max(index, 0), items.length - 1);

        // Sanitize scrollTop values for negative values.
        // This is to address Safari negative scrollTop when scroll "bounces" at the top
        var scrollTop = Math.max(currScrollTop, 0);

        var elem = items[index];
        var offsetTop;
        if (index === 0) {
          offsetTop = 0;
        } else {
          offsetTop = elem.offsetTop;
        }
        var diff = scrollTop - offsetTop;
        var firstInGroup = { index: index, elem: elem, offsetTop: offsetTop, offset: diff };

        // scroll position perfectly line up with the top of item (take sub-pixels into account), we are done
        if (Math.abs(diff) < 1) {
          return firstInGroup;
        }

        // go forward or backward to find the item, keep that fix to avoid
        // potentially going back and forth (shouldn't happen)
        var forward = diff > 0;
        if (forward) {
          index += 1;
        } else {
          index -= 1;
        }
        var found = false;
        while (!found && index >= 0 && index < items.length) {
          elem = items[index];
          offsetTop = elem.offsetTop;
          diff = Math.abs(scrollTop - offsetTop);

          found = diff < 1 || (forward ? scrollTop <= offsetTop : scrollTop >= offsetTop);
          if (found) {
            // the one closer to the top wins
            if (diff < 1 || !forward) {
              // the current one is closer
              firstInGroup = { index: index, elem: elem, offsetTop: offsetTop, offset: diff };
            }
            break;
          }
          // for card layout, we want to return the first item among items that have the same scrollTop (same row)
          // note when scrolling backward, you'll always want the last one encountered
          if (!forward || firstInGroup.offsetTop !== offsetTop) {
            firstInGroup = { index: index, elem: elem, offsetTop: offsetTop, offset: diff };
          }
          if (forward) {
            index += 1;
          } else {
            index -= 1;
          }
        }

        if (!found) {
          // then it's the first/last item in the group/root
          index = forward ? items.length - 1 : 0;
          firstInGroup.index = index;
          firstInGroup.elem = items[index];
        }
        return firstInGroup;
      },

      /**
       * Returns the element which is the direct parent of all item elements.  Only for non-hier data.
       * @private
       */
      _getRootNodeForItems: function () {
        return this.isCardLayout()
          ? this.element.get(0).firstElementChild.firstElementChild
          : this.element.get(0);
      },

      /**
       * Gets the item height. Will set it if it is NaN
       * @return {number} item height
       * @private
       */
      _getItemHeight: function () {
        if (this.m_itemHeight == null) {
          var firstItem;
          var isHierData = this.m_contentHandler.IsHierarchical();
          if (isHierData) {
            // could be a group
            firstItem = this.element.children('li.' + this.getItemElementStyleClass()).first();
            if (firstItem.length > 0) {
              this.m_itemHeight = firstItem.get(0).firstElementChild.offsetHeight;
            }
          } else {
            firstItem = $(this._getRootNodeForItems())
              .children('li.' + this.getItemElementStyleClass())
              .first();
            if (firstItem.length > 0) {
              this.m_itemHeight = firstItem.get(0).offsetHeight;
            }
          }
        }

        return this.m_itemHeight;
      },

      /**
       * Returns the scroll position object containing info about current scroll position.
       * @private
       */
      _getCurrentScrollPosition: function (scrollTop) {
        var scrollPosition = {};
        var scroller = this._getScroller();

        if (scrollTop === undefined) {
          // eslint-disable-next-line no-param-reassign
          scrollTop = scroller.scrollTop;
        }

        scrollPosition.x = this._getScrollX(scroller);
        scrollPosition.y = scrollTop;

        var isHierData = this.m_contentHandler.IsHierarchical();
        var itemHeight = this._getItemHeight();

        // we used the item height to approximate where to begin the search
        // for the top most item.  This var should be populated in renderComplete
        // if there's no data then we should skip
        if (!isNaN(itemHeight) && itemHeight > 0) {
          var result = this._findClosestElementToTop(scrollTop, isHierData, itemHeight);
          if (result != null) {
            var elem = result.elem;
            if (isHierData) {
              var header;
              var parent = elem.parentNode;
              if (parent !== this.element.get(0)) {
                this.m_closestParent = parent.parentNode;
                scrollPosition.parent = this.GetKey(this.m_closestParent);
                header = this.m_closestParent.firstElementChild;
              } else {
                header = result.elem.firstElementChild;
              }
              scrollPosition.key = this.GetKey(result.elem);
              scrollPosition.index = $(parent).children().index(elem);

              // handle sticky header here too
              if (header && header.classList.contains('oj-sticky')) {
                if (this.m_stuckHeader && this.m_stuckHeader !== header) {
                  this.m_stuckHeader.classList.remove('oj-stuck');
                }
                header.classList.add('oj-stuck');
                this.m_stuckHeader = header;
              }
            } else {
              scrollPosition.index = result.index;
              scrollPosition.key = this.GetKey(result.elem);
            }
            scrollPosition.offsetY = result.offset;
            // offsetX is the same as x, even when card layout is used
            // since listview wraps card on space available, there will never be a listview
            // having 2 or more columns with a horizontal scrollbar
            scrollPosition.offsetX = scrollPosition.x;
          }
        }

        return scrollPosition;
      },

      /**
       * @private
       */
      _getOffsetTop: function (elem) {
        var elemOffsetTop = elem.offsetTop;
        if (this.isCardLayout() && this.m_contentHandler.getMargin) {
          var margin = this.m_contentHandler.getMargin();
          if (!isNaN(margin)) {
            elemOffsetTop = Math.max(0, elemOffsetTop - margin);
          }
        }

        var offsetTop = this.element.get(0).offsetTop;
        if (!isNaN(this.m_elementOffset) && this.m_elementOffset !== offsetTop) {
          return Math.max(0, elemOffsetTop - offsetTop);
        }

        return elemOffsetTop;
      },

      /**
       * Retrieve the scroll top value based on item index (optionally with parent key)
       * @private
       */
      _getScrollTopByIndex: function (index, parent) {
        var parentElem;

        if (parent != null) {
          parentElem = this.FindElementByKey(parent);
          if (parentElem != null) {
            // find the ul element
            parentElem = $(parentElem).children('ul').first();
          }
        } else {
          // avoid doing offsetTop
          if (index === 0) {
            return 0;
          }

          parentElem = this.element.get(0);
          if (this.isCardLayout()) {
            parentElem = parentElem.firstElementChild.firstElementChild;
          }
        }

        if (parentElem != null) {
          var elem = $(parentElem).children('.' + this.getItemElementStyleClass())[index];
          if (elem != null) {
            return this._getOffsetTop(elem);
          }
        }

        // we got here because one of the following happened:
        // 1) item has not been fetched yet
        // 2) index is large than the number of items, including reaching maxCount
        // 3) parent key specified does not exists or has not been fetched yet
        if (this.m_contentHandler.hasMoreToFetch && this.m_contentHandler.hasMoreToFetch()) {
          return this._getScrollHeight();
        }

        return undefined;
      },

      /**
       * Retrieve the scroll top value based on item key
       * @private
       */
      _getScrollTopByKey: function (key) {
        var elem = this.FindElementByKey(key);
        if (elem != null) {
          return this._getOffsetTop(elem);
        }

        // we got here because one of the following happened:
        // 1) item has not been fetched yet
        // 2) key does not exists or invalid
        if (this.m_contentHandler.hasMoreToFetch && this.m_contentHandler.hasMoreToFetch()) {
          return this._getScrollHeight();
        }
        return undefined;
      },

      /**
       * Gets the scroll coordinate based on value of scrollPosition.
       * @return {Object} the coordinate to scroll to, see syncScrollPosition
       * @private
       */
      _getScrollCoordinates: function (scrollPosition) {
        var y;
        var x = scrollPosition.x;
        var offsetX = scrollPosition.offsetX;
        if (!isNaN(x) && !isNaN(offsetX)) {
          x += offsetX;
        }

        // key first
        var key = scrollPosition.key;
        if (isNaN(y) && key != null) {
          y = this._getScrollTopByKey(key);
        }

        // then index
        var parent = scrollPosition.parent;
        var index = scrollPosition.index;
        if (isNaN(y) && !isNaN(index)) {
          y = this._getScrollTopByIndex(index, parent);
        }

        var offsetY = scrollPosition.offsetY;
        if (!isNaN(y) && !isNaN(offsetY)) {
          y += offsetY;
        }

        // then pixel position last
        if (isNaN(y) && !isNaN(scrollPosition.y)) {
          y = scrollPosition.y;
        }

        return { x: x, y: y };
      },

      /**
       * Whether there are no items in the list
       */
      _isEmpty: function () {
        // can't just use childElementCount as there could be no data content or skeletons
        var root = this.element[0];
        var item = root.querySelector('li.' + this.getItemElementStyleClass());
        var tempItem = root.querySelector('li.oj-listview-temp-item');
        return item == null && tempItem == null;
      },

      /**
       * Scroll handler
       * @private
       */
      _handleScroll: function (event) {
        // since we are calling it from requestAnimationFrame, ListView could have been destroyed already
        // do not handle scroll for NavList, or when it is empty (could scroll due to rendering of skeletons)
        if (this.m_contentHandler == null || !this.ShouldUseGridRole() || this._isEmpty()) {
          return;
        }

        // update scrollPosition
        var scrollTop = this._getScroller().scrollTop;
        if (!this.ojContext._IsCustomElement()) {
          this.SetOption('scrollTop', scrollTop, {
            _context: {
              originalEvent: event,
              internalSet: true
            }
          });
        }

        if (this.ShouldUpdateScrollPosition()) {
          this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {
            _context: {
              originalEvent: event,
              internalSet: true
            }
          });
        }

        // handle pinning group header, does not need if position sticky is supported
        this._handlePinGroupHeader();
      },

      /**
       * Whether high-watermark scrolling is specified
       * @protected
       */
      isLoadMoreOnScroll: function () {
        // for legacy DataSource, we will maintain the behavior for 'auto'
        var scrollPolicy = this.GetOption('scrollPolicy');
        if (scrollPolicy === 'auto') {
          var data = this.GetOption('data');
          if (
            data != null &&
            ((typeof oj.TableDataSource !== 'undefined' && data instanceof oj.TableDataSource) ||
              (typeof oj.TreeDataSource !== 'undefined' && data instanceof oj.TreeDataSource))
          ) {
            return false;
          }
        }

        return scrollPolicy !== 'loadAll';
      },

      /**
       * Un-register scroll listener
       * @private
       */
      _unregisterScrollHandler: function () {
        var scrollElem = $(this._getScrollEventElement());
        if (this._scrollListener) {
          scrollElem[0].removeEventListener('scroll', this._scrollListener);
        }

        if (this.ojContext._IsCustomElement()) {
          // remove wheel listener add with addEventListener
          scrollElem[0].removeEventListener('wheel', this._wheelListener, { passive: false });
          delete this._wheelListener;
        } else {
          // remove wheel listener added with jQuery
          this.ojContext._off(scrollElem, 'wheel');
        }
        return scrollElem;
      },

      /**
       * Register scroll listener
       * @private
       */
      _registerScrollHandler: function () {
        var self = this;
        var scrollElem = this._unregisterScrollHandler();

        this._scrollListener = function (event) {
          // throttle the event using requestAnimationFrame for performance reason
          // don't update if scroll is triggered by listview internally setting scrollLeft/scrollTop
          if (!self._skipScrollUpdate && !self.m_ticking) {
            window.requestAnimationFrame(function () {
              self._handleScroll(event);
              self.m_ticking = false;
            });

            self.m_ticking = true;
          }

          Logger.info('scroll listener: ' + self._skipScrollUpdate);
          if (self._skipScrollUpdate) {
            Logger.info('clearing scrollPosBusyState');
            self._clearScrollPosBusyState();
          }

          self._skipScrollUpdate = false;
        };
        scrollElem[0].addEventListener('scroll', this._scrollListener);

        // only do this for high-water mark scrolling as other cases we have (and should not care) no knowledge about the scroller
        if (this.isLoadMoreOnScroll() && this._getScroller() !== document.documentElement) {
          this._wheelListener = function (event) {
            // add originalEvent for downstream code expecting it
            if (!event.originalEvent) {
              // eslint-disable-next-line no-param-reassign
              event.originalEvent = event;
            }
            self._preventMouseWheelOverscroll(self._getScroller(), event);
          };
          this._scrollElem = scrollElem;
          if (this.ojContext._IsCustomElement()) {
            this._scrollElem[0].addEventListener('wheel', this._wheelListener, { passive: false });
          } else {
            this.ojContext._on(this._scrollElem, {
              wheel: this._wheelListener
            });
          }
        }
      },

      /**
       * Invoked by ContentHandler
       * Merge scroll event handling with DomScroller so that:
       * 1) we rely on scroll event handling in a certain order, so this gives us more control over that
       * 2) scroll handling happens at the same time
       * @private
       */
      mergeScrollListener: function () {
        if (this._scrollListener) {
          var scrollElem = this._getScrollEventElement();
          scrollElem.removeEventListener('scroll', this._scrollListener);
        }
        return this._scrollListener;
      },

      /**
       * Invoked by ContentHandler
       * Unmerge scroll event handling.  This happens when DomScroller is destroyed.
       * @private
       */
      unmergeScrollListener: function () {
        if (this._scrollListener) {
          var scrollElem = this._getScrollEventElement();
          scrollElem.removeEventListener('scroll', this._scrollListener);
          scrollElem.addEventListener('scroll', this._scrollListener);
        }
      },

      /**
       * Whether group header should be pin
       * @return {boolean} true if group header should be pin or false otherwise
       * @private
       */
      _isPinGroupHeader: function () {
        return (
          this.GetOption('groupHeaderPosition') !== 'static' && this.m_contentHandler.IsHierarchical()
        );
      },

      /**
       * Retrieve the visible (flattened) group items cache, create one if it is null.
       * @return {jQuery} a list of group items
       * @private
       */
      _getGroupItemsCache: function () {
        if (this.m_groupItems == null) {
          var selector = '.' + this.getGroupItemStyleClass() + ':visible';
          this.m_groupItems = this.element.find(selector).filter(function () {
            // if it's expanded and it has children
            if (!$(this).parent().hasClass('oj-collapsed')) {
              if ($(this).next().children().length > 0) {
                return true;
              }
            }

            return false;
          });
        }
        return this.m_groupItems;
      },

      /**
       * Unpin a pinned group header
       * @param {Element} groupItem the group header element to unpin
       * @private
       */
      _unpinGroupItem: function (groupItem) {
        $(groupItem).removeClass('oj-pinned');
        // eslint-disable-next-line no-param-reassign
        groupItem.style.top = 'auto';
        // eslint-disable-next-line no-param-reassign
        groupItem.style.width = 'auto';
      },

      /**
       * Gets the next group item.  This could be a group item from a different parent.
       * @param {Element} groupItem the reference group item.
       * @return {Element|null} the next group item or null if one cannot be found
       * @private
       */
      _getNextGroupItem: function (groupItem) {
        var groupItems = this._getGroupItemsCache();
        var index = groupItems.index(groupItem);
        if (index > -1 && index < groupItems.length - 1) {
          return groupItems[index + 1];
        }

        return null;
      },

      /**
       * Pin a group header
       * @param {Element} groupItem the group header element to pin
       * @param {number} scrollTop the scrolltop position of the listview container
       * @private
       */
      _pinGroupItem: function (groupItem, scrollTop) {
        var width = groupItem.offsetWidth;
        var height = groupItem.offsetHeight;
        var next = this._getNextGroupItem(groupItem);

        // todo: get rid of 5
        if (next != null && next.offsetTop <= scrollTop + height + 5) {
          // eslint-disable-next-line no-param-reassign
          scrollTop -= height;
        }

        $(groupItem).addClass('oj-pinned');
        // eslint-disable-next-line no-param-reassign
        groupItem.style.top = scrollTop + 'px';
        // eslint-disable-next-line no-param-reassign
        groupItem.style.width = width + 'px';
      },

      /**
       * Pin the header as neccessary when user scrolls.
       * @private
       */
      _handlePinGroupHeader: function () {
        var groupItemToPin;

        // if groupHeaderPosition is not sticky or if position:sticky is supported natively in the browser
        if (!this._isPinGroupHeader() || this._isPositionStickySupported()) {
          return;
        }

        var scroller = this._getScroller();
        var scrollTop = scroller.scrollTop;

        // see if we are at the top
        if (this.m_groupItemToPin != null && scrollTop === 0) {
          this._unpinGroupItem(this.m_groupItemToPin);
          this.m_groupItemToPin = null;
          return;
        }

        // find the group item to pin
        var groupItems = this._getGroupItemsCache();
        var pinHeaderHeight = 0;
        if (this.m_groupItemToPin != null) {
          pinHeaderHeight = this.m_groupItemToPin.offsetHeight;
        }

        for (var i = 0; i < groupItems.length; i++) {
          var groupItem = groupItems[i];
          if (this.m_groupItemToPin !== groupItem) {
            var top = groupItems[i].offsetTop;
            var bottom = top + groupItem.parentNode.offsetHeight;

            // if bottom half is in view but not the top half
            if (top < scrollTop && bottom > scrollTop + pinHeaderHeight) {
              groupItemToPin = groupItem;
              break;
            }
          }
        }

        // found the group item to pin
        if (groupItemToPin != null && groupItemToPin !== this.m_groupItemToPin) {
          // unpin the previous item
          if (this.m_groupItemToPin != null) {
            this._unpinGroupItem(this.m_groupItemToPin);
          }

          this._pinGroupItem(groupItemToPin, scrollTop);
          this.m_groupItemToPin = groupItemToPin;
        } else if (this.m_groupItemToPin != null) {
          // is the current pin header touching the next item
          var next = this._getNextGroupItem(this.m_groupItemToPin);
          if (next != null && next.offsetTop <= scrollTop + pinHeaderHeight) {
            // make sure they really touches
            this.m_groupItemToPin.style.top = next.offsetTop - pinHeaderHeight + 'px';
            return;
          }

          this.m_groupItemToPin.style.top = scrollTop + 'px';
        }
      },

      /**
       * Gets the scroller element, which is either the listview container or the scroller element
       * specified in scrollPolicyOptions
       * @return {Element} the scroller element
       */
      _getScroller: function () {
        if (this.m_scroller != null) {
          return this.m_scroller;
        }

        var scroller;
        var options = this.GetOption('scrollPolicyOptions');
        if (options != null) {
          scroller = options.scroller;
          if (scroller != null) {
            if (typeof scroller === 'string') {
              scroller = document.querySelector(scroller);
              if (scroller == null) {
                Logger.error(
                  'the css selector string specified in scroller attribute does not resolve to any element'
                );
              }
            }

            // make sure the scroller is an ancestor
            if (scroller != null && !scroller.contains(this.getListContainer()[0])) {
              Logger.error('the specified scroller must be an ancestor of the component');
              scroller = null;
            }
          }
        }

        this.m_scroller = scroller != null ? scroller : this.getListContainer().get(0);
        return this.m_scroller;
      },

      /**
       * Scroll to the specified group header
       * @param {Element} groupHeader the group header div element
       * @private
       */
      _scrollToGroupHeader: function (groupHeader) {
        var scroller = this._getScroller();
        var currentScrollTop = scroller.scrollTop;

        // unpin any pinned group header first before scroll to header
        if (this.m_groupItemToPin != null) {
          this._unpinGroupItem(this.m_groupItemToPin);
          this.m_groupItemToPin = null;
        }

        var newScrollTop = groupHeader.offsetTop;
        // when scrolling backwards, the offsetTop is going to take position sticky into account, so it will
        // scroll to the minimum where the header is visible, and as a result all children items would not be visible
        if (
          this._isPinGroupHeader() &&
          this._isPositionStickySupported() &&
          newScrollTop < currentScrollTop
        ) {
          newScrollTop = Math.max(
            0,
            newScrollTop - groupHeader.parentNode.offsetHeight + groupHeader.offsetHeight
          );
        }
        scroller.scrollTop = newScrollTop;

        // if it wasn't scroll (ex: already at the end), we'll have to explicitly try to see if we need to pin again
        if (currentScrollTop === scroller.scrollTop) {
          this._handlePinGroupHeader();
        }

        // set the first item in group current
        this._setFirstFocusableItemInGroupCurrent(groupHeader);
      },

      /**
       * Find the first focusable item within the group and make it current
       * @param {Element} groupHeader the group header
       * @private
       */
      _setFirstFocusableItemInGroupCurrent: function (groupHeader) {
        var self = this;
        var items = $(groupHeader).next().children();
        items.each(function () {
          var item = $(this);

          // make sure item can receive focus
          if (!self.SkipFocus(item)) {
            self.SetOption('currentItem', this.key);
            return false;
          }
          return undefined;
        });
      }
      /** ******************************* End Pin Header *******************************************/
    }
  );

  _ojListView._CSS_Vars = {
    animation: {
      add: '--oj-private-list-view-global-add-animation-default',
      remove: '--oj-private-list-view-global-remove-animation-default',
      update: '--oj-private-list-view-global-update-animation-default',
      expand: '--oj-private-list-view-global-expand-animation-default',
      collapse: '--oj-private-list-view-global-collapse-animation-default',
      pointerUp: '--oj-private-list-view-global-pointerUp-animation-default',
      cardEntrance: '--oj-private-list-view-global-card-entrance-animation-default',
      cardExit: '--oj-private-list-view-global-card-exit-animation-default'
    },
    gridlines: {
      item: '--oj-private-list-view-global-gridlines-item-default',
      top: '--oj-private-list-view-global-gridlines-top-default',
      bottom: '--oj-private-list-view-global-gridlines-bottom-default'
    },
    loadIndicator: '--oj-private-list-view-global-load-indicator-default',
    showIndicatorDelay: '--oj-private-core-global-loading-indicator-delay-duration',
    cardAnimationDelay: '--oj-private-animation-global-card-entrance-delay-increment'
  };

  _ojListView.getComplexCSSVariable = function (varsObject) {
    const defaultOptions = {};
    const keys = Object.keys(varsObject);
    const vars = keys.map((key) => varsObject[key]);
    const values = ThemeUtils.getCachedCSSVarValues(vars);
    keys.forEach((key, i) => {
      const value = /^(\[|{)/.test(values[i]) ? JSON.parse(values[i]) : values[i];
      defaultOptions[key] = value;
    });
    return defaultOptions;
  };

  oj._registerLegacyNamespaceProp('_ojListView', _ojListView);

  /**
   * @ojcomponent oj.ojListView
   * @augments oj.baseComponent
   * @since 1.1.0
   * @ojimportmembers oj.ojSharedContextMenu
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "ItemMetadata", "Item"]}
   * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
   * @ojtsimport {module: "ojcommontypes", type: "AMD", importName: ["CommonTypes"]}
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojListView<K, D> extends baseComponent<ojListViewSettableProperties<K,D>>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojListViewSettableProperties<K,D> extends baseComponentSettableProperties",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @ojshortdesc A list view displays data items as a list or a grid with highly interactive features.
   * @ojrole grid
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["selectionMode"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["data", "selected"]}
   * @ojvbdefaultcolumns 12
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-list'
   * @ojuxspecs ['list-view']
   *
   * @classdesc
   * <h3 id="listViewOverview-section">
   *   JET ListView Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#listViewOverview-section"></a>
   * </h3>
   *
   * <p>Description: The JET ListView enhances a HTML list element into a themable, WAI-ARIA compliant, mobile friendly component with advance interactive features.</p>
   *
   * <p>The child content can be configured via inline HTML content or a DataProvider.
   * It is recommended that inline HTML content should only be used for static data and the DataProvider should always be used for mutable data.
   * </p>
   *
   * <h3 id="data-section">
   *   Data
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
   * </h3>
   * <p>The JET ListView gets its data in three different ways.  The first way is from a DataProvider/TableDataSource.  There are several types of DataProvider/TableDataSource
   * that are available out of the box:</p>
   * <ul>
   * <li>ArrayDataProvider</li>
   * <li>CollectionTableDataSource</li>
   * <li>PagingTableDataSource</li>
   * </ul>
   * <p>Note that TableDataSource has been deprecated, please find the equivalent DataProvider implementation.</p>
   *
   * <p><b>oj.ArrayDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, ListView will automatically react
   * when items are added or removed from the array.  See the documentation for oj.ArrayDataProvider for more details on the available options.</p>
   *
   * <p><b>oj.CollectionTableDataSource</b> - Use this when oj.Collection is the model for the underlying data.  Note that the ListView will automatically react to model event from
   * the underlying oj.Collection.  See the documentation for oj.CollectionTableDataSource for more details on the available options.</p>
   *
   * <p><b>PagingTableDataSource</b> - Use this when the ListView is driven by an associating ojPagingControl.  See the documentation for PagingTableDataSource for more
   * details on the available options.</p>
   *
   * <p>The second way is from a TreeDataProvider/TreeDataSource.  This is typically used to display data that are logically categorized in groups.  There are several types
   * of TreeDataProvider/TreeDataSource that are available out of the box:</p>
   * <ul>
   * <li>oj.ArrayTreeDataProvider</li>
   * <li>oj.CollectionTreeDataSource</li>
   * </ul>
   *
   * <p><b>oj.ArrayTreeDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, ListView will automatically react
   * when items are added or removed from the array.  See the documentation of oj.ArrayTreeDataProvider for more details on the available options.</p>
   *
   * <p><b>oj.CollectionTreeDataSource</b> - Use this when oj.Collection is the model for each group of data.  See the documentation for oj.CollectionTableDataSource
   * for more details on the available options.</p>
   *
   * <p>Finally, ListView also supports static HTML content as data.  The structure of the content can be either flat or hierarhical.</p>
   * <p>Any manipulation of static HTML content, including manipulating content generated through Knockout (for example, updating observableArray in a foreach binding), is not supported.<p>
   *
   * <p>A note about hierarchical data, even though ListView supports data with > 2 levels, it is not recommended because it does not render depth, for that case you should look at using ojTreeView<p>
   *
   *
   * <p>Example of flat static content</p>
   * <pre class="prettyprint">
   * <code>&lt;oj-list-view id="listView">
   *   &lt;ul>
   *     &lt;li>&lt;a id="item1" href="#">Item 1&lt;/a>&lt;/li>
   *     &lt;li>&lt;a id="item2" href="#">Item 2&lt;/a>&lt;/li>
   *     &lt;li>&lt;a id="item3" href="#">Item 3&lt;/a>&lt;/li>
   *   &lt;/ul>
   * &lt;/oj-list-view>
   * </code></pre>
   *
   * <p>Example of hierarchical static content</p>
   * <pre class="prettyprint">
   * <code>&lt;oj-list-view id="listView">
   *   &lt;ul>
   *     &lt;li>&lt;a id="group1" href="#">Group 1&lt;/a>
   *       &lt;ul>
   *         &lt;li>&lt;a id="item1-1" href="#">Item 1-1&lt;/a>&lt;/li>
   *         &lt;li>&lt;a id="item1-2" href="#">Item 1-2&lt;/a>&lt;/li>
   *       &lt;/ul>
   *     &lt;/li>
   *     &lt;li>&lt;a id="group2" href="#">Group 2&lt;/a>
   *       &lt;ul>
   *         &lt;li>&lt;a id="item2-1" href="#">Item 2-1&lt;/a>&lt;/li>
   *         &lt;li>&lt;a id="item2-2" href="#">Item 2-2&lt;/a>&lt;/li>
   *       &lt;/ul>
   *     &lt;/li>
   *   &lt;/ul>
   * &lt;/oj-list-view>
   * </code></pre>
   *
   * <p>Example of data provider content</p>
   * <pre class="prettyprint"><code>
   *   &lt;oj-list-view data="[[dataProvider]]">
   *   &lt;/oj-list-view>
   * </code></pre>
   * <p>Check out the Listview Basic demo</a>
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
   * <h3 id="context-section">
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
   *       <td>A reference to the root element of ListView.</td>
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
   *      <tr>
   *       <td><kbd>metadata</kbd></td>
   *       <td>The metadata object for the item.</td>
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
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   *
   * <p>Application should specify a value for the aria-label attribute with a meaningful description of the purpose of this list.</p>
   *
   * <p>To facilitate drag and drop including item reordering using only keyboard, application must ensure that either to expose the functionality using context menu, and/or
   * allow users to perform the functionality with the appropriate keystroke.  You can find examples of how this can be done in the cookbook demos.</p>
   *
   * <p>Note that ListView uses the grid role and follows the <a href="https://www.w3.org/TR/wai-aria-practices/examples/grid/LayoutGrids.html">Layout Grid</a> design as outlined in the <a href="https://www.w3.org/TR/wai-aria-practices/#grid">grid design pattern</a></p>.
   * <p>Nesting collection components such as ListView, Table, TreeView, and ListView inside of ListView is not supported.</p>
   * <h4>Custom Colours</h4>
   * <p>Using colors, including background and text colors, is not accessible if it is the only way information is conveyed.
   * Low vision users may not be able to see the different colors, and in high contrast mode the colors are removed.
   * The Redwood approved way to show status is to use badge.</p>
   *
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <h4>Data Set Size</h4>
   * <p>As a rule of thumb, it's recommended that applications limit the amount of data to display.  Displaying large
   * number of items in ListView makes it hard for user to find what they are looking for, but affects the load time and
   * scrolling performance as well.  If displaying large number of items is neccessary, use a paging control with ListView
   * to limit the number of items to display at a time.  Setting <code class="prettyprint">scrollPolicy</code> to
   * 'loadMoreOnScroll' will also reduce the number of items to display initially.</p>
   *
   * <h4>Item Content</h4>
   * <p>ListView allows developers to specify arbitrary content inside its item. In order to minimize any negative effect on
   * performance, you should avoid putting a large number of heavy-weight components inside because as you add more complexity
   * to the structure, the effect will be multiplied because there can be many items in the ListView.</p>
   *
   * <h4>Expand All</h4>
   * <p>While ListView provides a convenient way to initially expand all group items in the ListView, it might have an impact
   * on the initial rendering performance since expanding each group item might cause a fetch from the server depending on
   * the TreeDataSource.  Other factors that could impact performance includes the depth of the tree, and the number of children
   * in each level.</p>
   *
   * <h3 id="animation-section">
   *   Animation
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#animation-section"></a>
   * </h3>
   *
   * <p>Applications can customize animations triggered by actions in ListView by either listening for <code class="prettyprint">animateStart/animateEnd</code>
   * events or overriding action specific style classes on the animated item.  See the documentation of <a href="AnimationUtils.html">AnimationUtils</a>
   * class for details</p>
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
   *       <td><kbd>add</kbd></td>
   *       <td>When a new item is added to the TableDataSource associated with ListView.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>remove</kbd></td>
   *       <td>When an existing item is removed from the TableDataSource associated with ListView.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>update</kbd></td>
   *       <td>When an existing item is updated in the TableDataSource associated with ListView.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>expand</kbd></td>
   *       <td>When user expands a group item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>collapse</kbd></td>
   *       <td>When user collapses a group item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>pointerUp</kbd></td>
   *       <td>When user finish pressing an item (on touch).</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>cardEntrance</kbd></td>
   *       <td>When a card is initially rendered.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>cardExit</kbd></td>
   *       <td>When a card is removed due to the entire data set being refreshed.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * <h3 id="data-attributes-section">
   *   Custom Data Attributes
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
   * </h3>
   *
   * <p>ListView supports the following custom data attributes.
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Name</th>
   *       <th>Description</th>
   *       <th>Example</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td><kbd>data-oj-as</kbd></td>
   *       <td>Provides an alias for a specific template instance and has the same subproperties as the $current variable.</td>
   *       <td>
   *         <pre class="prettyprint"><code>&lt;oj-list-view id="listView">
   *   &lt;template slot="itemTemplate" data-oj-as="item">
   *   &lt;/template>
   * &lt;/oj-list-view></code></pre>
   *       </td>
   *     </tr>
   *     <tr>
   *       <td><kbd>data-oj-clickthrough</kbd></td>
   *       <td><p>Specify on any element inside an item where you want to control whether ListView should perform actions triggered by
   *           a click event originating from the element or one of its descendants.</p>
   *           <p>For example, if you specify this attribute with a value of "disabled" on a button inside an item, then ListView
   *           will not select or trigger itemAction event to be fired when user clicks on the button. Expand/collapse will also
   *           be ignored if the button is inside the group header.</p>
   *           <p>Note that the currentItem will still be updated to the item that the user clicked on.</p>
   *       </td>
   *       <td>
   *         <pre class="prettyprint"><code>&lt;oj-list-view id="listView">
   *   &lt;template slot="itemTemplate">
   *     &lt;oj-button data-oj-clickthrough="disabled">&lt;/oj-button
   *   &lt;/template>
   * &lt;/oj-list-view></code></pre>
   *       </td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * <h3 id="suggestion-items-section">
   *   Suggestion Items
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#suggestion-items-section"></a>
   * </h3>
   *
   * <p>If <a href="ItemMetadata.html">ItemMetadata</a> returned by the DataProvider contains suggestion field, ListView will apply special visual to those
   *    items. The DataProvider must ensure the suggestion items are the first items returned by the initial fetchFirst call. Suggestion items are only supported
   *    when display is 'item'.  Applications should not allow users to reorder suggestion items.</p>
   */
  // --------------------------------------------------- oj.ojListView Styling Start -----------------------------------------------------------
  // ---------------- oj-clickthrough-disabled --------------
  /**
   * Use on any element inside an item where you do not want ListView to process the click event.
   * @ojstyleclass oj-clickthrough-disabled
   * @ojdisplayname Click Disabled
   * @ojstyleselector oj-list-view, oj-list-view *
   * @ojdeprecated {since: '10.0.0', description: 'Specify data-oj-clickthrough attribute with value disabled instead.'}
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-clickthrough-disabled">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
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
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-focus-highlight">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
   */
  // ---------------- oj-full-width --------------
  /**
   * Use when ListView occupies the entire width of the page. Removes left and right borders in card-layout mode and adjust positioning of cards to improve visual experience.
   * @ojstyleclass oj-full-width
   * @ojdisplayname Full Width
   * @ojdeprecated {since: '10.0.0', description: 'Use oj-listview-full-width instead.'}
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-full-width">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
   */
  // ---------------- oj-group-header-sm --------------
  /**
   * Use to style group headers as small size group headers according to the current theme.
   * @ojstyleclass oj-group-header-sm
   * @ojdisplayname Small Group Header
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-group-header-sm">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
   */
  // ---------------- oj-group-header-md --------------
  /**
   * Use to style group headers as medium size group headers according to the current theme.
   * @ojstyleclass oj-group-header-md
   * @ojdisplayname Medium Group Header
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-group-header-md">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
   */
  // ---------------- oj-group-header-lg --------------
  /**
   * Use to style group headers as large size group headers according to the current theme.
   * @ojstyleclass oj-group-header-lg
   * @ojdisplayname Large Group Header
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-group-header-lg">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
   */
  // ---------------- oj-listview-card-layout --------------
  /**
   * Shows items as cards and lay them out in a grid.
   * @ojstyleclass oj-listview-card-layout
   * @ojdisplayname Card Layout
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-listview-card-layout">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
   */
  // ---------------- oj-listview-drag-handle --------------
  /**
   * Use to show a drag handle in the item to facilitate item reordering or drag and drop.
   * @ojstyleclass oj-listview-drag-handle
   * @ojdisplayname Drag Handle
   * @ojstyleselector oj-list-view *
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view>
   *   &lt;template slot="itemTemplate" data-oj-as="item">
   *     ...
   *     &lt;div class="oj-flex-bar-end oj-sm-align-items-center">
   *      &lt;div role="button" tabindex="0" class="oj-flex-item oj-listview-drag-handle">
   *      &lt;/div>
   *     &lt;/div>
   *   &lt;/template>
   * &lt;/oj-list-view>
   */
  // ---------------- oj-listview-drill-icon --------------
  /**
   * Use to show a drill-to-detail icon in the item.
   * @ojstyleclass oj-listview-drill-icon
   * @ojdisplayname Drill Icon
   * @ojstyleselector oj-list-view *
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-listview-card-layout">
   *   &lt;template slot="itemTemplate" data-oj-as="item">
   *     ...
   *     &lt;div class="oj-flex-bar-end oj-sm-align-items-center">
   *      &lt;div role="presentation" class="oj-flex-item oj-fwk-icon oj-listview-drill-icon">
   *      &lt;/div>
   *     &lt;/div>
   *   &lt;/template>
   * &lt;/oj-list-view>
   */
  // ---------------- oj-listview-full-width --------------
  /**
   * Use when ListView occupies the entire width of the page. Removes left and right borders in card-layout mode and adjust positioning of cards to improve visual experience.
   * @ojstyleclass oj-listview-full-width
   * @ojdisplayname Full Width
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-listview-full-width">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
   */
  // ---------------- oj-listview-item-layout --------------
  /**
   * Use when the page author overrides the default styling on the item root element and wants to apply the item style on some other element.
   * @ojstyleclass oj-listview-item-layout
   * @ojdisplayname Item Layout
   * @ojstyleselector oj-list-view *
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="">
   *   &lt;template slot="itemTemplate" data-oj-as="item">
   *     &lt;div class="oj-listview-item-layout">
   *     ...
   *     &lt;/div>
   *   &lt;/template>
   * &lt;/oj-list-view>
   */
  // ---------------- oj-listview-item-padding-off --------------
  /**
   * Use when the page author wants to remove the default padding around the item.  This is mostly used in the case where the component used inside the
   * itemTemplate already supply its own padding (ex: oj-list-item-layout), and therefore the default padding provided by ListView should be remove.
   * @ojstyleclass oj-listview-item-padding-off
   * @ojdisplayname Item Padding Off
   * @ojstyleselector oj-list-view
   * @memberof oj.ojListView
   * @ojtsexample
   * &lt;oj-list-view class="oj-listview-item-padding-off">
   *   &lt;!-- Content -->
   * &lt;/oj-list-view>
   */
  /**
   * @ojstylevariableset oj-list-view-css-set1
   * @ojdisplayname List view item padding CSS
   * @ojstylevariable oj-list-view-item-padding-horizontal {description: "List view horizontal item padding",formats: ["length"], help: "#oj-list-view-css-set1"}
   * @memberof oj.ojListView
   */
  /**
   * CSS variables that specify list view group header styles
   * @ojstylevariableset oj-list-view-css-set2
   * @ojdisplayname List view group header CSS
   * @ojstylevariable oj-list-view-group-header-bg-color {description: "List view group header background color", formats: ["color"], help: "#oj-list-view-css-set2"}
   * @ojstylevariable oj-list-view-group-header-bg-color-sticky {description: "List view group header sticky background color", formats: ["color"], help: "#oj-list-view-css-set2"}
   * @ojstylevariable oj-list-view-group-header-font-weight {description: "List view group header font weight", formats: ["font_weight"], help: "#oj-list-view-css-set2"}
   * @ojstylevariable oj-list-view-group-header-font-size {description: "List view group header font size", formats: ["length"], help: "#oj-list-view-css-set2"}
   * @ojstylevariable oj-list-view-group-header-line-height {description: "List view group header horizontal line height", formats: ["number"], help: "#oj-list-view-css-set2"}
   * @memberof oj.ojListView
   */
  // --------------------------------------------------- oj.listView Styling End -----------------------------------------------------------

  oj.__registerWidget('oj.ojListView', $.oj.baseComponent, {
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
       * @memberof! oj.ojListView
       * @type {string}
       * @default ''
       * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">as</code> attribute specified:</caption>
       * &lt;oj-list-view as='item'>
       *   &lt;template slot='itemTemplate'>
       *     &lt;p>&lt;oj-bind-text value='[[item.data.name]]'>&lt;/oj-bind-text>&lt;/p>
       *   &lt;/template>
       * &lt;/oj-list-view>
       */
      as: '',
      /**
       * The item that currently have keyboard focus.  Note that if current item
       * is set to an item that is not available in the view (either not fetched in high-water mark scrolling case or
       * hidden inside a collapsed parent node), then the value is not applied.
       *
       * @ojshortdesc Specifies the key of the item that should have keyboard focus. See the Help documentation for more information.
       * @expose
       * @public
       * @instance
       * @memberof! oj.ojListView
       * @type {any}
       * @ojsignature {target:"Type", value:"K"}
       * @default null
       * @ojwriteback
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">current-item</code> attribute specified:</caption>
       * &lt;oj-list-view current-item='{{myCurrentItem}}'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">currentItem</code> property after initialization:</caption>
       * // getter
       * var currentItemValue = myListView.currentItem;
       *
       * // setter
       * myListView.currentItem = "item2";
       */
      currentItem: null,
      /**
       * The data source for ListView.  Must be of type oj.TableDataSource, oj.TreeDataSource, DataProvider
       * See the data source section in the introduction for out of the box data source types.
       * If the data attribute is not specified, the child elements are used as content.  If there's no
       * content specified, then an empty list is rendered.
       *
       * @ojshortdesc Specifies the data for the list. See the Help documentation for more information.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {Object}
       * @default null
       * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
       *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">data</code> attribute specified:</caption>
       * &lt;oj-list-view data='{{myDataSource}}'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
       * // getter
       * var dataValue = myListView.data;
       *
       * // setter
       * myListView.data = myDataSource;
       * @ojsignature [{target: "Type", value: "DataProvider<K, D>"},
       *               {target: "Type", value: "oj.TableDataSource|oj.TreeDataSource|DataProvider", consumedBy:"js"}]
       */
      data: null,
      /**
       * Whether to display items as list items or as cards.
       *
       * @ojshortdesc Specifies how the items should be displayed.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {string}
       * @default "list"
       * @ojvalue {string} "list" Display items as list items.
       * @ojvalue {string} "card" Display items as cards.
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">display</code> attribute specified:</caption>
       * &lt;oj-list-view display='card'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">display</code> property after initialization:</caption>
       * // getter
       * var displayValue = myListView.display;
       *
       * // setter
       * myListView.display = 'card';
       */
      display: 'list',
      /**
       * Enable drag and drop functionality.
       * Note the ojlistviewdnd module must be imported in order to use the dnd functionality.<br><br>
       * JET provides support for HTML5 Drag and Drop events.  Please refer to {@link https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop third party documentation}
       * on HTML5 Drag and Drop to learn how to use it.
       *
       * @ojshortdesc Customizes the drag and drop functionality. See the Help documentation for more information.
       * @expose
       * @memberof! oj.ojListView
       * @type {Object}
       * @instance
       */
      dnd: {
        /**
         * Enables and customizes the drag functionality.
         *
         * @ojshortdesc Customizes the drag functionality.
         * @expose
         * @name dnd.drag
         * @memberof! oj.ojListView
         * @instance
         * @type {Object}
         * @ojsignature { target: "Type",
         *                value: "?"}
         */
        drag: null,
        /**
         * @ojshortdesc Customizes the drop functionality.
         * @expose
         * @name dnd.drop
         * @memberof! oj.ojListView
         * @instance
         * @type {Object}
         * @ojsignature { target: "Type", value: "?"}
         */
        drop: null,
        /**
         * The reorder option contains a subset of options for reordering items.
         *
         * @ojshortdesc Customizes the item reordering functionality.
         * @expose
         * @name dnd.reorder
         * @memberof! oj.ojListView
         * @instance
         * @type {Object}
         * @ojsignature { target: "Type", value: "?"}
         */
        reorder: {
          /**
           * Enable or disable reordering the items within the same listview using drag and drop.<br><br>
           * Specify 'enabled' to enable reordering.  Setting the value 'disabled' or setting the <code class="prettyprint">"dnd"</code> property
           * to <code class="prettyprint">null</code> (or omitting it), disables reordering support.
           *
           * @ojshortdesc Specify the item reordering functionality. See the Help documentation for more information.
           * @expose
           * @name dnd.reorder.items
           * @memberof! oj.ojListView
           * @instance
           * @type {string}
           * @ojvalue {string} "enabled" Item reordering is enabled.
           * @ojvalue {string} "disabled" Item reordering is disabled.
           * @default "disabled"
           *
           * @example <caption>Initialize the ListView with the <code class="prettyprint">reorder</code> attribute specified:</caption>
           * &lt;oj-list-view dnd.reorder.items='enabled'>&lt;/oj-list-view>
           *
           * @example <caption>Get or set the <code class="prettyprint">reorder</code> property after initialization:</caption>
           * // getter
           * var reorderValue = myListView.dnd.reorder.items;
           *
           * // setter
           * myListView.dnd.reorder.items = 'enabled';
           */
          items: 'disabled'
        }
      },
      /**
       * Changes the expand and collapse operations on ListView.  If "none" is specified, then
       * the current expanded state is fixed and user cannot expand or collapse an item.
       *
       * @ojshortdesc Specifies whether expand or collapse operations are allowed.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {string}
       * @default "collapsible"
       * @ojvalue {string} "collapsible" Group item can be expanded or collapsed by user.
       * @ojvalue {string} "none" The expand state of a group item cannot be changed by user.
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">drill-mode</code> attribute specified:</caption>
       * &lt;oj-list-view drill-mode='none'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">drillMode</code> property after initialization:</caption>
       * // getter
       * var drillModeValue = myListView.drillMode;
       *
       * // setter
       * myListView.drillMode = 'none';
       */
      drillMode: 'collapsible',
      /**
       * Specifies the key set containing the keys of the items that should be expanded.
       *
       * Use the <a href="ExpandedKeySet.html">ExpandedKeySet</a> class to specify items to expand.
       * Use the <a href="ExpandAllKeySet.html">ExpandAllKeySet</a> class to expand all items.
       *
       * @ojshortdesc Specifies the key set containing the keys of the items that should be expanded. See the Help documentation for more information.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @default new ExpandedKeySet();
       * @type {KeySet}
       * @ojsignature {target:"Type", value:"oj.KeySet<K>"}
       *
       * @ojwriteback
       *
       * @example <caption>Initialize the ListView with specific items expanded:</caption>
       * myListView.expanded = new ExpandedKeySet(['item1', 'item2']);
       *
       * @example <caption>Initialize the ListView with all items expanded:</caption>
       * myListView.expanded = new ExpandAllKeySet();
       */
      expanded: new _ojListViewExpandedKeySet(),
      /**
       * Gets the key and data of the first selected item.  The first selected item is defined as the first
       * key returned by the <a href="#selection">selection</a> property.  The value of this property contains:
       * <ul>
       * <li>key - the key of the first selected item.</li>
       * <li>data - the data of the first selected item.  If the selected item is not locally available, this will
       *        be null.  If the <a href="#data">data</a> property is not set and that static HTML element is used
       *        as data, then this will be the item element.</li>
       * </ul>
       * If no items are selected then this property will return an object with both key and data properties set to null.
       *
       * @expose
       * @ojshortdesc Specifies the key and data of the first selected item. See the Help documentation for more information.
       * @memberof! oj.ojListView
       * @instance
       * @default {'key': null, 'data': null}
       * @type {Object}
       * @ojsignature {target:"Type", value:"CommonTypes.ItemContext<K,D>", jsdocOverride:true}
       *
       * @ojwriteback
       * @readonly
       *
       * @example <caption>Get the data of the first selected item:</caption>
       * // getter
       * var firstSelectedItemValue = myListView.firstSelectedItem;
       */
      firstSelectedItem: { key: null, data: null },
      /**
       * The gridlines option contains a subset of options for gridlines.
       *
       * @ojshortdesc Customizes the functionality of how gridlines are shown in various parts of the list.
       * @expose
       * @memberof! oj.ojListView
       * @type {Object}
       * @instance
       */
      gridlines: {
        /**
         * Specifies whether the horizontal grid lines should be visible.  Note this attribute has no effect when ListView is in card display mode.
         * <p>The default value varies by theme.
         *
         * @ojshortdesc Specifies whether the grid lines should be visible.
         * @expose
         * @name gridlines.item
         * @memberof! oj.ojListView
         * @instance
         * @default "visible"
         * @type {string}
         * @ojvalue {string} "visible" The horizontal gridlines are visible.
         * @ojvalue {string} "visibleExceptLast" The horizontal gridlines are visible, except for the last item.  Note this will not have an effect for themes that renders a bottom border for the component.
         * @ojvalue {string} "hidden" The horizontal gridlines are hidden.
         *
         * @example <caption>Initialize the ListView with the <code class="prettyprint">gridlines</code> attribute specified:</caption>
         * &lt;oj-list-view gridlines.item='visible'>&lt;/oj-list-view>
         *
         * @example <caption>Get or set the <code class="prettyprint">gridlines</code> property after initialization:</caption>
         * // getter
         * var gridlinesValue = myListView.gridlines.item;
         *
         * // setter
         * myListView.gridlines.item = 'visible';
         *
         */
        item: 'visible'
      },
      /**
       * Specifies how the group header should be positioned.  If "sticky" is specified, then the group header
       * is fixed at the top of the ListView as the user scrolls.
       *
       * @ojshortdesc Specifies whether group header should stick to the top as user scrolls.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @default "sticky"
       * @type {string}
       * @ojvalue {string} "static" The group header position updates as user scrolls.
       * @ojvalue {string} "sticky" The group header is fixed at the top when user scrolls.
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">group-header-position</code> attribute specified:</caption>
       * &lt;oj-list-view group-header-position='static'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">groupHeaderPosition</code> property after initialization:</caption>
       * // getter
       * var groupHeaderPositionValue = myListView.groupHeaderPosition;
       *
       * // setter
       * myListView.groupHeaderPosition = 'static';
       */
      groupHeaderPosition: 'sticky',
      /**
       * The item option contains a subset of options for items.
       *
       * @ojshortdesc Customizes the functionality of each item on the list.
       * @expose
       * @memberof! oj.ojListView
       * @type {Object}
       * @instance
       */
      item: {
        /**
         * @typedef {Object} oj.ojListView.ItemContext
         * @property {DataProvider<K, D>} datasource the data source/data provider
         * @property {number} index the zero based index of the item, relative to its parent during initial rendering.  Note the index is not updated in response to item additions and removals.
         * @property {K} key the key of the item
         * @property {D} data the data object of the item
         * @property {oj.ItemMetadata<K>} metadata the metadata object of the item
         * @property {Element} parentElement the item DOM element
         * @property {number=} depth the depth of the item
         * @property {K=} parentKey the key of the parent item
         * @property {boolean=} leaf whether the item is a leaf
         * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
         */
        /**
         * The knockout template used to render the content of the item.
         *
         * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
         * component option.
         *
         * @ojbindingonly
         * @name item.template
         * @memberof! oj.ojListView
         * @instance
         * @type {string|null}
         * @default null
         *
         * @example <caption>Specify the <code class="prettyprint">template</code> when initializing ListView:</caption>
         * // set the template
         * &lt;ul id="listview" data-bind="ojComponent: {component: 'ojListView', data: dataSource, item: {template: 'my_template'}}"&gt;&lt;/ul&gt;
         */
        /**
         * Whether the item is focusable.  An item that is not focusable cannot be clicked on or navigated to.
         * See <a href="#context-section">itemContext</a> in the introduction to see the object passed into the focusable function.
         *
         * @ojshortdesc Specifies whether the item can receive keyboard focus. See the Help documentation for more information.
         * @expose
         * @name item.focusable
         * @memberof! oj.ojListView
         * @instance
         * @type {boolean|function(Object):boolean}
         * @ojsignature { target: "Type",
         *                value: "?((param0: oj.ojListView.ItemContext<K,D>) => boolean)|boolean",
         *                jsdocOverride: true}
         *  @ojdeprecated {since: '13.0.0', description: 'Not accessible by screen reader.'}
         *  @default true
         *
         * @example <caption>Initialize the ListView with the <code class="prettyprint">focusable</code> attribute specified:</caption>
         * &lt;oj-list-view item.focusable='{{myFocusableFunc}}'>&lt;/oj-list-view>
         *
         * @example <caption>Get or set the <code class="prettyprint">focusable</code> property after initialization:</caption>
         * // getter
         * var focusable = myListView.item.focusable;
         *
         * // setter
         * myListView.item.focusable = myFocusableFunc;
         */
        focusable: true,
        /**
         * The renderer function that renders the content of the item. See <a href="#context-section">itemContext</a>
         * in the introduction to see the object passed into the renderer function.
         * The function should return one of the following:
         * <ul>
         *   <li>An Object with the following property:
         *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the item.</li></ul>
         *   </li>
         *   <li>undefined: If the developer chooses to manipulate the list element directly, the function should return undefined.</li>
         * </ul>
         * If no renderer is specified, ListView will treat the data as a string.
         *
         * @ojshortdesc Specifies the renderer for the item. See the Help documentation for more information.
         * @expose
         * @name item.renderer
         * @memberof! oj.ojListView
         * @instance
         * @type {null|function(Object):Object}
         * @ojsignature { target: "Type",
         *                value: "?((param0: oj.ojListView.ItemContext<K,D>) => {insert: Element|string}|undefined)|null",
         *                jsdocOverride: true}
         * @default null
         *
         * @example <caption>Initialize the ListView with the <code class="prettyprint">renderer</code> attribute specified:</caption>
         * &lt;oj-list-view item.renderer='{{myRendererFunc}}'>&lt;/oj-list-view>
         *
         * @example <caption>Get or set the <code class="prettyprint">renderer</code> property after initialization:</caption>
         * // getter
         * var renderer = myListView.item.renderer;
         *
         * // setter
         * myListView.item.renderer = myRendererFunc;
         */
        renderer: null,
        /**
         * Whether the item is selectable.  Note that if selectionMode is set to "none" this option is ignored.  In addition,
         * if focusable is set to false, then the selectable option is automatically overridden and set to false also.
         * See <a href="#context-section">itemContext</a> in the introduction to see the object passed into the selectable function.
         *
         * @ojshortdesc Specifies whether the item can be selected. See the Help documentation for more information.
         * @expose
         * @name item.selectable
         * @memberof! oj.ojListView
         * @instance
         * @type {boolean|function(Object):boolean}
         * @ojsignature { target: "Type",
         *                value: "?((param0: oj.ojListView.ItemContext<K,D>) => boolean)|boolean",
         *                jsdocOverride: true}
         * @default true
         *
         * @example <caption>Initialize the ListView with the <code class="prettyprint">selectable</code> attribute specified:</caption>
         * &lt;oj-list-view item.selectable='{{mySelectableFunc}}'>&lt;/oj-list-view>
         *
         * @example <caption>Get or set the <code class="prettyprint">selectable</code> property after initialization:</caption>
         * // getter
         * var selectable = myListView.item.selectable;
         *
         * // setter
         * myListView.item.selectable = mySelectableFunc;
         */
        selectable: true
      },
      /**
       * Specifies the behavior when ListView needs to scroll to a position based on an item key.  This includes the case where 1) a value of
       * scrollPosition attribute is specified with a key property, 2) ListView scrolls to the selection anchor after a refresh has occurred.
       *
       * @ojshortdesc Specifies the behavior when ListView needs to scroll to a position based on an item key.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {string|null}
       * @default "auto"
       * @ojvalue {string} "auto" The behavior is determined by the component.  By default the behavior is the same as "capability" except
       *                          when legacy TableDataSource/TreeDataSource is used, in which case the behavior is the same as "always".
       * @ojvalue {string} "capability" ListView will only scroll to a position based on an item key if either the item has already been fetched
       *                                or if the associated DataProvider supports 'immediate' iterationSpeed for 'fetchFirst' capability.
       * @ojvalue {string} "always" ListView will scroll to a position based on an item key as long as the key is valid.
       * @ojvalue {string} "never" ListView will not change the scroll position if the request is based on an item key.
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">scroll-by-key</code> attribute specified:</caption>
       * &lt;oj-list-view scroll-to-key='never'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">scrollToKey</code> property after initialization:</caption>
       * // getter
       * var scrollToKeyBehavior = myListView.scrollToKey;
       *
       * // setter
       * myListView.scrollToKey = 'never';
       */
      scrollToKey: 'auto',
      /**
       * Specifies the mechanism used to scroll the data inside the list view. Possible values are: "auto", "loadMoreOnScroll", and "loadAll".
       * When "loadMoreOnScroll" is specified, additional data is fetched when the user scrolls to the bottom of the ListView.
       * Note that currently this option is only available when non-hierarchical DataProvider is used.
       * When "loadAll" is specified, ListView will fetch all the data when it is initially rendered.
       * If you are using Paging Control with the ListView, please note that "loadMoreOnScroll" scroll-policy is not compatible with
       * Paging Control "loadMore" mode.
       *
       * @ojshortdesc Specifies how data are fetched as user scrolls down the list.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {string|null}
       * @default "auto"
       * @ojvalue {string} "auto" The behavior is determined by the component.  By default the behavior is the same as "loadMoreOnScroll" except
       *                          when legacy TableDataSource is used, in which case the behavior is the same as "loadAll".
       * @ojvalue {string} "loadAll" Fetch and render all data.
       * @ojvalue {string} "loadMoreOnScroll" Additional data is fetched when the user scrolls towards the bottom of the ListView.
       *                    <br/>Not compatible when used with Paging Control "loadMore" mode.
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">scroll-policy</code> attribute specified:</caption>
       * &lt;oj-list-view scroll-policy='loadMoreOnScroll'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">scrollPolicy</code> property after initialization:</caption>
       * // getter
       * var scrollPolicyValue = myListView.scrollPolicy;
       *
       * // setter
       * myListView.scrollPolicy = 'loadMoreOnScroll';
       */
      scrollPolicy: 'auto',
      /**
       * scrollPolicy options.
       * <p>
       * The following options are supported:
       * <ul>
       *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
       *   <li>maxCount: Maximum rows which will be displayed before fetching more rows will be stopped.</li>
       *   <li>scroller: The element which listview uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the widget element of listview is used.</li>
       * </ul>
       * When scrollPolicy is loadMoreOnScroll, the next block of rows is fetched
       * when the user scrolls to the end of the list/scroller. The fetchSize option
       * determines how many rows are fetched in each block.
       * Note that currently this option is only available when non-hierarchical DataProvider or TableDataSource is used.
       *
       * @ojshortdesc Specifies fetch options for scrolling behaviors that trigger data fetches. See the Help documentation for more information.
       * @expose
       * @instance
       * @memberof! oj.ojListView
       * @type {Object.<string, number>|null}
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">scroll-policy-options</code> attribute specified:</caption>
       * &lt;oj-list-view scroll-policy-options.fetch-size='30'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">scroll-policy-options</code> attribute after initialization:</caption>
       * // getter
       * var fetchSizeValue = myListView.scrollPolicyOptions.fetchSize;
       *
       * // setter
       * myListView.scrollPolicyOptions.fetchSize = 30;

       * @example <caption>Initialize the ListView with the <code class="prettyprint">scroll-policy-options</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-list-view scroll-policy-options.fetch-size='30' scroll-policy-options.max-count='1000'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">scrollPolicyOptions</code> property after initialization:</caption>
       * // Get one
       * var fetchSizeValue = myListView.scrollPolicyOptions.fetchSize;
       *
       * // Get all
       * var scrollPolicyOptionsValues = myListView.scrollPolicyOptions;
       *
       * // Set one, leaving the others intact
       * myListView.setProperty('scrollPolicyOptions.fetchSize', 30);
       *
       * // Set all.
       * myListView.scrollPolicyOptions = {fetchSize: 30, maxCount: 1000};
       */
      scrollPolicyOptions: { fetchSize: 25, maxCount: 500 },
      /**
       * The current scroll position of ListView. The scroll position is updated when either the vertical or horizontal scroll position
       * (or its scroller, as specified in scrollPolicyOptions.scroller) has changed.  The value contains the x and y scroll position,
       * the index and key information of the item closest to the top of the viewport, as well as horizontal and vertical offset from the
       * position of the item to the actual scroll position.
       * <p>
       * The default value contains just the scroll position.  Once data is fetched the 'index' and 'key' sub-properties will be added.
       * If there is no data then the 'index' and 'key' sub-properties will not be available.
       * </p>
       * <p>
       * When setting the scrollPosition property, applications can change any combination of the sub-properties.
       * If multiple sub-properties are set at once they will be used in key, index, pixel order where the latter serves as hints.
       * If offsetX or offsetY are specified, they will be used to adjust the scroll position from the position where the key or index
       * of the item is located.
       * </p>
       * <p>
       * If a sparse object is set the other sub-properties will be populated and updated once ListView has scrolled to that position.
       * </p>
       * <p>
       * Also, if <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll' and the scrollPosition is set to a value outside
       * of the currently rendered region, then ListView will attempt to fetch until the specified scrollPosition is satisfied or the end
       * is reached (either at max count or there's no more items to fetch), in which case the scroll position will remain at the end.
       * The only exception to this is when the key specified does not exists and a DataProvider is specified for <a href="#data">data</a>,
       * then the scroll position will not change (unless other sub-properties like index or x/y are specified as well).
       * </p>
       * Lastly, when a re-rendered is triggered by a <a href="DataProviderRefreshEvent.html">refresh event</a> from the DataProvider,
       * or if the value for <a href="#data">data</a> attribute has changed, then the scrollPosition will be adjusted such that the selection
       * anchor (typically the last item selected by the user) prior to refresh will appear at the top of the viewport after refresh.  If
       * selection is disabled or if there is no selected items, then the scrollPosition will remain at the top.
       * </p>
       *
       * @ojshortdesc Specifies the current scroll position of the list. See the Help documentation for more information.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {Object}
       * @default {"x": 0, "y": 0}
       * @property {number=} x The horizontal position in pixels.
       * @property {number=} y The vertical position in pixels.
       * @property {number=} index The zero-based index of the item.  If <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll'
       * and the index is greater than maxCount set in <a href="#scrollPolicyOptions">scrollPolicyOptions</a>, then it will scroll and fetch
       * until the end of the list is reached and there's no more items to fetch.
       * @property {any=} parent The key of the parent where the index is relative to.  If not specified, then the root is assumed
       * @property {any=} key The key of the item.  If DataProvider is used for <a href="#data">data</a> and the key does not exists in the
       * DataProvider, then the value is ignored.  If DataProvider is not used then ListView will fetch and scroll until the item is found
       * or the end of the list is reached and there's no more items to fetch.
       * @property {number=} offsetX The horizontal offset in pixels relative to the item identified by key/index.
       * @property {number=} offsetY The vertical offset in pixels relative to the item identified by key/index.
       *
       * @ojsignature [{target:"Type", value:"K", for:"parent"},
       *               {target:"type", value:"K", for:"key"}]
       * @ojwriteback
       * @example <caption>Initialize the ListView with the <code class="prettyprint">scroll-position</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-list-view scroll-position.index='10'>&lt;/oj-list-view>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-list-view scroll-position='{"index": 10}'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">scrollPosition</code> property after initialization:</caption>
       * // Get one
       * var scrollPositionValue = myListView.scrollPosition.index;
       *
       * // Set one, leaving the others intact
       * myListView.setProperty('scrollPosition.index', 10);
       *
       * // Get all
       * var scrollPositionValues = myListView.scrollPosition;
       *
       * // Set all.  Those not listed will be lost until the scroll completes and the remaining fields are populated.
       * myListView.scrollPosition = {x: 0, y: 150};
       */
      scrollPosition: { x: 0, y: 0 },
      /**
       * The vertical scroll position of ListView.
       *
       * @ignore
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {number}
       * @default 0
       *
       * @example <caption>Initialize the list view to a specific scroll position:</caption>
       * $( ".selector" ).ojListView({ "scrollTop": 100 });
       */
      scrollTop: 0,
      /**
       * The current selected items in the ListView. An empty KeySet indicates nothing is selected.
       * Note that property change event for the deprecated selection property will still be fire when
       * selected property has changed. In addition, <a href="AllKeySetImpl.html">AllKeySetImpl</a> set
       * can be used to represent select all state. In this case, the value for selection would have an
       * 'inverted' property set to true, and would contain the keys of the items that are not selected.
       *
       * @ojshortdesc Specifies the keys of the current selected items. See the Help documentation for more information.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @default new KeySetImpl();
       * @type {KeySet}
       * @ojsignature {target:"Type", value:"oj.KeySet<K>"}
       * @ojwriteback
       * @ojeventgroup common
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">selected</code> attribute specified:</caption>
       * &lt;oj-list-view selected='{{mySelectedItemsKeySet}}'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">selected</code> property after initialization:</caption>
       * // getter
       * var selectedValue = myListView.selected;
       *
       * // setter
       * myListView.selected = ['item1', 'item2', 'item3'];
       */
      selected: new ojkeyset.KeySetImpl(),
      /**
       * The current selections in the ListView. An empty array indicates nothing is selected.
       *
       * @ojshortdesc Specifies the current selections in the list. See the Help documentation for more information.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {Array.<any>}
       * @ojsignature {target:"Type", value:"Array<K>"}
       * @default []
       * @ojwriteback
       * @ojdeprecated {since: '7.0.0', description: 'Use selected attribute instead.'}
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">selection</code> attribute specified:</caption>
       * &lt;oj-list-view selection='{{mySelection}}'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">selection</code> property after initialization:</caption>
       * // getter
       * var selectionValue = myListView.selection;
       *
       * // setter
       * myListView.selection = ['item1', 'item2', 'item3'];
       */
      selection: [],
      /**
       * <p>The type of selection behavior that is enabled on the ListView. This attribute controls the number of selections that can be made via selection gestures at any given time.
       *
       * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the ListView's selection styling will be applied to all items specified by the <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes.
       * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the ListView's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes.
       *
       * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> or <a href="#selected">selected</a> attributes.
       *
       * @ojshortdesc Specifies the selection mode.
       * @expose
       * @memberof! oj.ojListView
       * @instance
       * @type {string}
       * @default "none"
       * @ojvalue {string} "none" Selection is disabled.
       * @ojvalue {string} "single" Only a single item can be selected at a time.
       * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">selection-mode</code> attribute specified:</caption>
       * &lt;oj-list-view selection-mode='multiple'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> property after initialization:</caption>
       * // getter
       * var selectionModeValue = myListView.selectionMode;
       *
       * // setter
       * myListView.selectionMode = 'multiple';
       */
      selectionMode: 'none',
      /**
       * <p>Specifies whether selection is required on the ListView. This attribute will only take effect when selection is enabled and at least
       * one selectable item is present. When <code class="prettyprint">true</code>, the ListView will ensure that at least one valid item is
       * selected at all times. If no items are specified by the <a href="#selection">selection</a> or <a href="#selected">selected</a> attributes,
       * the first selectable item in the ListView will be added to the selection state during initial render. Additionally, selection gestures that
       * would otherwise leave the ListView with no selected items will be disabled.
       *
       * <p>When <code class="prettyprint">true</code>, the ListView will also attempt to validate all items specified by the
       * <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes. If any items specified are not immediately
       * available, the ListView's underlying <a href="DataProvider.html">DataProvider</a> will be queried. This will only occur if the
       * data provider supports <a href="DataProvider.html#getCapability">getCapability</a>, and returns a
       * <a href="FetchByKeysCapability.html#implementation">fetchByKeys capability implementation</a> of <code class="prettyprint">lookup</code>.
       * Any items that fail this validation process will be removed from the <a href="#selection">selection</a> and <a href="#selected">selected</a>
       * attributes. This guarantees that the ListView's <a href="#firstSelectedItem">firstSelectedItem</a> attribute is populated at all times.
       *
       * <p>See <a href="#selectionMode">selectionMode</a> for information on how to enable or disable selection on the ListView.
       * <p>See <a href="#item.selectable">item.selectable</a> for information on how to enable or disable selection for individual items.
       *
       * @ojshortdesc Specifies whether selection is required on the ListView.
       * @expose
       *
       * @memberof! oj.ojListView
       * @instance
       * @type {boolean}
       * @default false
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">selection-required</code> attribute specified:</caption>
       * &lt;oj-list-view selection-required='true'>&lt;/oj-list-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">selectionRequired</code> property after initialization:</caption>
       * // getter
       * var selectionRequiredValue = myListView.selectionRequired;
       *
       * // setter
       * myListView.selectionRequired = true;
       */
      selectionRequired: false,
      /**
       * Triggered when the default animation of a particular action is about to start.  The default animation can be cancelled by calling event.preventDefault.
       *
       * @ojshortdesc Triggered when the default animation of a particular action is about to start.
       * @expose
       * @event
       * @memberof oj.ojListView
       * @instance
       * @property {string} action the action that triggers the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
       * @property {Element} element the target of animation.
       * @property {function():void} endCallback if the event listener calls event.preventDefault to cancel the default animation, it must call the endCallback function when it finishes its own animation handling and when any custom animation ends.
       */
      animateStart: null,
      /**
       * Triggered when the default animation of a particular action has ended. Note this event will not be triggered if application cancelled the default animation on animateStart.
       *
       * @ojshortdesc Triggered when the default animation of a particular action has ended.
       * @expose
       * @event
       * @memberof oj.ojListView
       * @instance
       * @property {string} action the action that triggered the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
       * @property {Element} element the target of animation.
       */
      animateEnd: null,
      /**
       * Triggered before the current item is changed via the <code class="prettyprint">current</code> option or via the UI.
       *
       * @ojshortdesc Triggered before the current item is changed.
       * @ojcancelable
       * @expose
       * @event
       * @memberof oj.ojListView
       * @instance
       * @property {any} previousKey the key of the previous item
       * @property {Element} previousItem the previous item
       * @property {any} key the key of the new current item
       * @property {Element} item the new current item
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"previousKey"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      beforeCurrentItem: null,
      /**
       * Triggered before an item is expanded via the <code class="prettyprint">expanded</code> option,
       * the <code class="prettyprint">expand</code> method, or via the UI.
       *
       * @ojshortdesc Triggered before an item is expanded.
       * @ojcancelable
       * @expose
       * @event
       * @memberof oj.ojListView
       * @instance
       * @property {any} key the key of the item to be expanded
       * @property {Element} item the item to be expanded
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      beforeExpand: null,
      /**
       * Triggered before an item is collapsed via the <code class="prettyprint">expanded</code> option,
       * the <code class="prettyprint">collapse</code> method, or via the UI.
       *
       * @ojshortdesc Triggered before an item is collapsed.
       * @ojcancelable
       * @expose
       * @event
       * @memberof oj.ojListView
       * @instance
       * @property {any} key the key of the item to be collapsed
       * @property {Element} item the item to be collapsed
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      beforeCollapse: null,
      /**
       * Triggered after an item has been collapsed via the <code class="prettyprint">expanded</code> option or via the UI.
       * Note if the collapse is triggered by updating the expanded option, applications should avoid vetoing the beforeCollapse event.
       * In addition, due to internal optimizations, when multiple items are collapsed due to update of expanded option,
       * there is no guarantee that this event will be fired for all the collapsible items.
       *
       * @ojshortdesc Triggered after an item has been collapsed. See the Help documentation for more information.
       * @expose
       * @event
       * @memberof oj.ojListView
       * @instance
       * @property {any} key The key of the item that was just collapsed.
       * @property {Element} item The list item that was just collapsed.
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      collapse: null,
      /**
       * Triggered when the copy action is performed on an item via context menu or keyboard shortcut.
       *
       * @ojshortdesc Triggered when the copy action is performed on an item.
       * @expose
       * @event
       * @ojdeprecated {since: '11.0.0', description: 'Use event from context menu or KeyEvent instead.'}
       * @memberof oj.ojListView
       * @instance
       * @property {Element[]} items an array of items in which the copy action is performed on
       */
      copy: null,
      /**
       * Triggered when the cut action is performed on an item via context menu or keyboard shortcut.
       *
       * @ojshortdesc Triggered when the cut action is performed on an item.
       * @expose
       * @event
       * @ojdeprecated {since: '11.0.0', description: 'Use event from context menu or KeyEvent instead.'}
       * @memberof oj.ojListView
       * @instance
       * @property {Element[]} items an array of items in which the cut action is performed on
       */
      cut: null,
      /**
       * Triggered after an item has been expanded via the <code class="prettyprint">expanded</code> option or via the UI.
       * Note if the expand is triggered by updating the expanded option, applications should avoid vetoing the beforeExpand event.
       * In addition, due to internal optimizations, when multiple items are collapsed due to update of expanded option,
       * there is no guarantee that this event will be fired for all the expandable items.
       *
       * @ojshortdesc Triggered after an item has been expanded. See the Help documentation for more information.
       * @expose
       * @event
       * @memberof oj.ojListView
       * @instance
       * @property {any} key The key of the item that was just expanded.
       * @property {Element} item The list item that was just expanded.
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      expand: null,
      /**
       * Triggered when user performs an action gesture on an item while ListView is in navigation mode.  The action gestures include:
       * <ul>
       *   <li>User clicks anywhere in an item</li>
       *   <li>User taps anywhere in an item</li>
       *   <li>User pressed enter key while an item or its content has focus</li>
       * </ul>
       *
       * @ojshortdesc Triggered when user performs an action gesture on an item.
       * @expose
       * @event
       * @ojbubbles
       * @memberof oj.ojListView
       * @instance
       * @property {any} context the context information about the item where the action gesture is performed on.
       * @property {Event} originalEvent the DOM event that triggers the action.
       * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"},
       *               {target:"Type", value:"CommonTypes.ItemContext<K,D>", for:"context", jsdocOverride:true}]
       */
      itemAction: null,
      /**
       * Triggered when the paste action is performed on an item via context menu or keyboard shortcut.
       *
       * @ojshortdesc Triggered when the paste action is performed on an item.
       * @expose
       * @event
       * @ojdeprecated {since: '11.0.0', description: 'Use event from context menu or KeyEvent instead.'}
       * @memberof oj.ojListView
       * @instance
       * @property {Element} item the element in which the paste action is performed on
       */
      paste: null,
      /**
       * Triggered after all items in the ListView has been rendered.  Note that in the high-water mark scrolling case,
       * all items means the items that are fetched so far.
       *
       * @ignore
       * @event
       * @deprecated 2.0.0 Use the <a href="#whenReady">whenReady</a> method instead.
       * @memberof oj.ojListView
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       *
       * @example <caption>Initialize the ListView with the <code class="prettyprint">ready</code> callback specified:</caption>
       * $( ".selector" ).ojListView({
       *     "ready": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojready</code> event:</caption>
       * $( ".selector" ).on( "ojready", function( event, ui ) {
       *     // verify that the component firing the event is a component of interest
       *     if ($(event.target).is(".mySelector")) {}
       * });
       */
      ready: null,
      /**
       * Triggered after items are reorder within listview via drag and drop or cut and paste.
       *
       * @ojshortdesc Triggered after items are reordered, whether through a drag and drop action or a cut and paste action.
       * @expose
       * @event
       * @memberof oj.ojListView
       * @instance
       * @property {Element[]} items an array of items that are moved
       * @property {string} position the drop position relative to the reference item.  Possible values are "before", "after", "inside"
       * @property {Element} reference the item where the moved items are drop on
       */
      reorder: null
    },

    /**
     * Create the listview
     * @override
     * @memberof! oj.ojListView
     * @protected
     */
    _ComponentCreate: function () {
      this._super();
      this._setup();
    },

    /**
     * Initialize the listview
     * @private
     */
    _setup: function () {
      var opts = {};

      opts.element = this.element;
      opts.OuterWrapper = this.OuterWrapper;
      opts.ojContext = this;

      // for backward compatibility, the default for expanded for legacy syntax
      // should be the same as before
      if (!this._IsCustomElement()) {
        var expanded = this.options.expanded;
        // check if it's been updated by applications
        if (expanded instanceof _ojListViewExpandedKeySet) {
          this.options.expanded = 'auto';
        }
      }

      opts = $.extend(this.options, opts);

      this.listview = new _ojListView();
      this.listview.init(opts);

      DataCollectionUtils.disableDefaultBrowserStyling(this.element[0]);
    },

    /**
     * Initialize the listview after creation
     * @protected
     * @override
     * @memberof! oj.ojListView
     */
    _AfterCreate: function () {
      this._super();

      // inject helper function for ContentHandler and custom renderer to use
      var self = this;
      this.listview._FixRendererContext = function (context) {
        return self._FixRendererContext(context);
      };
      this.listview._WrapCustomElementRenderer = function (renderer) {
        return self._WrapCustomElementRenderer(renderer);
      };
      this.listview._GetCustomElement = function () {
        return self._GetCustomElement();
      };

      this.listview.afterCreate();
    },

    /**
     * Sets up resources needed by listview
     * @memberof! oj.ojListView
     * @instance
     * @override
     * @protected
     */
    _SetupResources: function () {
      this._super();
      this.listview.setupResources();
    },

    /**
     * Release resources held by listview
     * @memberof! oj.ojListView
     * @instance
     * @override
     * @protected
     */
    _ReleaseResources: function () {
      this._super();
      this.listview.releaseResources();
    },

    /**
     * Gets the focus element
     * @override
     * @memberof! oj.ojListView
     * @instance
     * @protected
     * @since 5.0.0
     */
    GetFocusElement: function () {
      return this.listview != null ? this.listview.GetFocusElement() : this._super();
    },

    /**
     * Destroy the list view
     * @memberof! oj.ojListView
     * @private
     */
    _destroy: function () {
      this.listview.destroy();
      this._super();
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
      this.listview.notifyContextMenuGesture(menu, event, eventType);
    },

    /**
     * Sets multiple options
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     * @override
     * @private
     */
    _setOptions: function (options, flags) {
      if (!this.listview.isAvailable()) {
        // ListView might have been detached, just update the options.  When ListView becomes available again, the update options will take effect.
        this._super(options, flags);
        return;
      }

      var needRefresh = this.listview.setOptions(options, flags);

      // updates the options last
      this._super(options, flags);

      if (needRefresh) {
        if (options.data) {
          this.listview.adjustScrollPositionValueOnFetch();
        }
        this.listview.refresh();
      } else if (options.selectionRequired || options.selection || options.selectionMode) {
        // if listview is not refresh, we'll need to ensure selectionRequired is enforced if set to true
        this.listview.enforceSelectionRequired();
      }
    },

    /**
     * Sets a single option
     * @param {Object} key the key for the option
     * @param {Object} value the value for the option
     * @param {Object} flags any flags specified for the option
     * @override
     * @private
     */
    _setOption: function (key, value, flags) {
      // checks whether value is valid for the key
      var valid = true;
      var extraData;

      if (key === 'selectionMode') {
        valid = value === 'none' || value === 'single' || value === 'multiple';
      } else if (key === 'drillMode') {
        valid = value === 'collapsible' || value === 'none';
      } else if (key === 'scrollPolicy') {
        valid = value === 'auto' || value === 'loadMoreOnScroll' || value === 'loadAll';
      } else if (key === 'groupHeaderPosition') {
        valid = value === 'static' || value === 'sticky';
      } else if (key === 'firstSelectedItem') {
        // read only
        valid = false;
      }

      // update option if it's valid otherwise throw an error
      if (valid) {
        if (this.listview.isAvailable()) {
          // inject additional metadata for selection
          if (key === 'selection') {
            extraData = this.listview.getItems(value);
            // eslint-disable-next-line no-param-reassign
            flags = {
              _context: {
                extraData: {
                  items: this._IsCustomElement() ? extraData : $(extraData)
                }
              }
            };
          } else if (key === 'currentItem') {
            extraData = this.listview.getItems([value])[0];
            // eslint-disable-next-line no-param-reassign
            flags = {
              _context: {
                extraData: {
                  items: this._IsCustomElement() ? extraData : $(extraData)
                }
              }
            };
          }
        }
        this._super(key, value, flags);
      } else {
        throw new Error('Invalid value: ' + value + ' for key: ' + key);
      }
    },

    /**
     * Invoked when application calls oj.Components.subtreeAttached.
     * @override
     * @private
     */
    _NotifyAttached: function () {
      this.listview.notifyAttached();
    },

    /**
     * In browsers [Chrome v35, Firefox v24.5, IE9, Safari v6.1.4], blur and mouseleave events are generated for hidden content but not detached content,
     * so for detached content only, we must use this hook to remove the focus and hover classes.
     * @override
     * @private
     */
    _NotifyDetached: function () {
      this.listview.notifyDetached();
    },

    /**
     * Invoked when application calls oj.Components.subtreeShown.
     * @override
     * @private
     */
    _NotifyShown: function () {
      this.listview.notifyShown();
    },

    /**
     * Override to do the delay connect/disconnect
     * @memberof oj.ojListView
     * @override
     * @protected
     */
    _VerifyConnectedForSetup: function () {
      return true;
    },

    /** ******************************* public methods **************************************/
    /**
     * Returns a jQuery object containing the root dom element of the listview.
     *
     * <p>This method does not accept any arguments.
     *
     * @ignore
     * @expose
     * @override
     * @memberof oj.ojListView
     * @instance
     * @return {jQuery} the root DOM element of list
     */
    widget: function () {
      return this.listview.GetRootElement();
    },

    /**
     * Redraw the entire list view after having made some external modifications.
     *
     * <p>This method does not accept any arguments.
     *
     * @ojshortdesc Redraw the entire list.
     * @expose
     * @memberof oj.ojListView
     * @return {void}
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myListView.refresh();
     */
    refresh: function () {
      this._super();
      this.listview.refresh();
    },

    /**
     * Returns a Promise that resolves when the component is ready, i.e. after data fetching, rendering, and animations complete.
     * Note that in the high-water mark scrolling case, component is ready after data fetching, rendering, and associated animations of items fetched so far are complete.
     *
     * <p>This method does not accept any arguments.
     *
     * @ignore
     * @ojshortdesc Returns a Promise that resolves when this component becomes ready.
     * @expose
     * @memberof oj.ojListView
     * @instance
     * @return {Promise} A Promise that resolves when the component is ready.
     */
    whenReady: function () {
      return this.listview.whenReady();
    },

    // @inheritdoc
    getNodeBySubId: function (locator) {
      return this.listview.getNodeBySubId(locator);
    },

    // @inheritdoc
    getSubIdByNode: function (node) {
      return this.listview.getSubIdByNode(node);
    },

    /**
     * @typedef {Object} oj.ojListView.ContextByNode
     * @property {string} subId the sub id that represents the element
     * @property {K} key the key of the item
     * @property {number} index the zero based index of the item, relative to its parent
     * @property {Element=} parent the parent group DOM element
     * @property {boolean=} group whether the item is a group item
     * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"}]
     */
    /**
     * {@ojinclude "name":"nodeContextDoc"}
     * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
     * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
     * @ojsignature { target: "Type",
     *                value: "oj.ojListView.ContextByNode<K>|null",
     *                jsdocOverride: true,
     *                for: "returns"}
     *
     * @example {@ojinclude "name":"nodeContextExample"}
     *
     * @expose
     * @instance
     * @memberof oj.ojListView
     * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
     */
    getContextByNode: function (node) {
      return this.listview.getContextByNode(node);
    },

    /**
     * Return the raw data for an item in ListView.  The item must have been already fetched.
     * @param {Object} context The context of the item to retrieve raw data.
     * @param {any=} context.key The key of the item.  If both index and key are specified, then key takes precedence.
     * @param {number=} context.index The index of the item relative to its parent.
     * @param {Element=} context.parent The parent node, not required if parent is the root.
     * @returns {any} data of the item.  If the item is not found or not yet fetched, returns null.  Also,
     * if static HTML is used as data (data attribute is not specified), then the element for the item is returned.
     * @ojshortdesc Gets the raw data of an item.
     * @export
     * @expose
     * @memberof oj.ojListView
     * @instance
     * @example <caption>Invoke the <code class="prettyprint">getDataForVisibleItem</code> method:</caption>
     * var data = myListView.getDataForVisibleItem( {'index': 2} );
     * @ojsignature [{target:"Type", value:"K", for:"context.key"},
     *               {target:"Type", value:"D", for:"returns"}]
     */
    getDataForVisibleItem: function (context) {
      return this.listview.getDataForVisibleItem(context);
    },

    /**
     * Expand an item.<p>
     * Note when vetoable is set to false, beforeExpand event will still be fired but the event cannot be veto.<p>
     *
     * @ignore
     * @expose
     * @memberof oj.ojListView
     * @instance
     * @param {Object} key the key of the item to expand
     * @param {boolean} vetoable whether the event should be vetoable
     */
    expand: function (key, vetoable) {
      this.listview.expandKey(key, vetoable, true, true);
    },

    /**
     * Collapse an item.<p>
     * Note when vetoable is set to false, beforeCollapse event will still be fired but the event cannot be veto.<p>
     *
     * @ignore
     * @expose
     * @memberof oj.ojListView
     * @instance
     * @param {Object} key the key of the item to collapse
     * @param {boolean} vetoable whether the event should be vetoable
     */
    collapse: function (key, vetoable) {
      this.listview.collapseKey(key, vetoable, true);
    },

    /**
     * Gets the key of currently expanded items.
     *
     * @ignore
     * @expose
     * @memberof oj.ojListView
     * @instance
     * @return {Array} array of keys of currently expanded items
     */
    getExpanded: function () {
      return this.listview.getExpanded();
    },

    /**
     * Gets the IndexerModel which can be used with the ojIndexer.  The IndexerModel provided by ListView
     * by defaults returns a list of locale dependent characters.  See translations for the key used to return
     * all characters.  When a user selects a character in the ojIndexer ListView will scroll to the group
     * header (or the closest one) with the character as its prefix.
     *
     * @expose
     * @ojshortdesc Gets the IndexerModel which can be used with the ojIndexer.
     * @memberof oj.ojListView
     * @ojdeprecated {since:"3.0.0", description:'Implements your own IndexerModel or use the <a href="IndexerModelTreeDataSource.html">IndexerModelTreeDataSource</a> class instead.'}
     * @instance
     * @return {Object} ListView's IndexerModel to be used with the ojIndexer
     */
    getIndexerModel: function () {
      if (this.indexerModel == null && ojindexer.ListViewIndexerModel) {
        this.indexerModel = new ojindexer.ListViewIndexerModel(this.listview);
      }
      return this.indexerModel;
    },

    /**
     * Scrolls the list until the specified item is visible.  If the item is not yet loaded (if scrollPolicy is set to 'loadMoreOnScroll'), then no action is taken.
     *
     * @ojshortdesc Scrolls a loaded item until it is visible.
     * @param {Object} item An object with a 'key' property that identifies the item to scroll to.
     * @property {K} item.key the key of the item to scroll to.
     * @expose
     * @memberof oj.ojListView
     * @return {void}
     * @instance
     * @ojdeprecated {since: "13.0.0", description: "The scrollToItem method is deprecated. Use scrollPosition instead."}
     */
    scrollToItem: function (item) {
      this.listview.scrollToItem(item);
    },

    _CompareOptionValues: function (option, value1, value2) {
      switch (option) {
        case 'currentItem':
        case 'scrollPolicyOptions':
          return oj.Object.compareValues(value1, value2);
        case 'selection':
          if (value1 && value1.inverted === undefined) {
            // eslint-disable-next-line no-param-reassign
            value1.inverted = false;
          }
          if (value2 && value2.inverted === undefined) {
            // eslint-disable-next-line no-param-reassign
            value2.inverted = false;
          }
          if (value1 && value2 && value1.inverted !== value2.inverted) {
            return false;
          }
          return oj.Object.compareValues(value1, value2);
        default:
          return this._super(option, value1, value2);
      }
    }
  });

  //-----------------------------------------------
  //                  Slots
  //-----------------------------------------------
  /**
   * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the list. The slot content must be a &lt;template> element.
   * The content of the template could either include the &lt;li> element, in which case that will be used as
   * the root of the item.  Or it can be just the content which excludes the &lt;li> element.</p>
   * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
   * <ul>
   *   <li>$current - an object that contains information for the current item. (See [oj.ojListView.ItemTemplateContext]{@link oj.ojListView.ItemTemplateContext} or the table below for a list of properties available on $current)</li>
   *  <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
   * </ul>
   *
   * @ojslot itemTemplate
   * @ojshortdesc The itemTemplate slot is used to specify the template for rendering each item in the list. See the Help documentation for more information.
   * @ojmaxitems 1
   * @memberof oj.ojListView
   * @ojtemplateslotprops oj.ojListView.ItemTemplateContext
   *
   * @example <caption>Initialize the ListView with an inline item template specified:</caption>
   * &lt;oj-list-view>
   *   &lt;template slot='itemTemplate'>
   *     &lt;span>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/span>
   *   &lt;template>
   * &lt;/oj-list-view>
   */

  /**
   * <p>The <code class="prettyprint">noData</code> slot is used to specify the content to display when the list is empty.
   * The slot content must be a &lt;template> element.  If not specified then a default no data message will be displayed.
   *
   * @ojslot noData
   * @ojshortdesc The noData slot is used to specify the content to render when the list is empty.
   * @ojmaxitems 1
   * @memberof oj.ojListView
   * @ojtemplateslotprops {}
   *
   * @example <caption>Initialize the ListView with a noData slot specified:</caption>
   * &lt;oj-list-view>
   *   &lt;template slot='noData'>
   *     &lt;span>&lt;oj-button>Add item&lt;/span>
   *   &lt;template>
   * &lt;/oj-list-view>
   */

  //------------------------------------------------
  //                    Fragments
  //------------------------------------------------
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
   *       <td>Focus on the item.  If <code class="prettyprint">selectionMode</code> is enabled, selects the item as well.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Press & Hold</kbd></td>
   *       <td>Display context menu</td>
   *     </tr>
   *     <tr>
   *       <td rowspan="2">Group Item</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Expand or collapse the group item if <code class="prettyprint">drillMode</code> is set to collapsible.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Press & Hold</kbd></td>
   *       <td>Display context menu</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojListView
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
   *       <td rowspan = "20" nowrap>List Item</td>
   *       <td><kbd>F2</kbd></td>
   *       <td>Enters Actionable mode.  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item. It can also be used to exit actionable mode if already in actionable mode.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Esc</kbd></td>
   *       <td>Exits Actionable mode.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Tab</kbd></td>
   *       <td>When in Actionable Mode, navigates to next focusable element within the item.  If the last focusable element is reached, shift focus back to the first focusable element.
   *           When not in Actionable Mode, navigates to next focusable element on page (outside ListView).</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift+Tab</kbd></td>
   *       <td>When in Actionable Mode, navigates to previous focusable element within the item.  If the first focusable element is reached, shift focus back to the last focusable element.
   *           When not in Actionable Mode, navigates to previous focusable element on page (outside ListView).</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>DownArrow</kbd></td>
   *       <td>Move focus to the item below.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>UpArrow</kbd></td>
   *       <td>Move focus to the item above.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>LeftArrow</kbd></td>
   *       <td>When display in card layout, move focus to the item on the left.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>RightArrow</kbd></td>
   *       <td>When display in card layout, move focus to the item on the right.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift+DownArrow</kbd></td>
   *       <td>Extend the selection to the item below.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift+UpArrow</kbd></td>
   *       <td>Extend the selection to the item above.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift+LeftArrow</kbd></td>
   *       <td>When display in card layout, extend the selection to the item on the left.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift+RightArrow</kbd></td>
   *       <td>When display in card layout, extend the selection to the item on the right.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift+F10</kbd></td>
   *       <td>Launch the context menu if there is one associated with the current item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Selects the current item.  No op if the item is already selected.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Space</kbd></td>
   *       <td>Toggles to select and deselect the current item.  If previous items have been selected, deselects them and selects the current item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift+Space</kbd></td>
   *       <td>Selects contiguous items from the last selected item to the current item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl+Space</kbd></td>
   *       <td>Toggles to select and deselect the current item while maintaining previous selected items.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl+X</kbd></td>
   *       <td>Marks the selected items to move if dnd.reorder is enabled.  This has been deprecated.  Applications should designate their own shortcut key and handle the KeyEvent directly.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl+C</kbd></td>
   *       <td>Marks the selected items to copy if dnd.reorder is enabled.  This has been deprecated.  Applications should designate their own shortcut key and handle the KeyEvent directly.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl+V</kbd></td>
   *       <td>Paste the items that are marked to directly before the current item (or as the last item if the current item is a folder).  This has been deprecated.  Applications should designate their own shortcut key and handle the KeyEvent directly.</td>
   *     </tr>
   *     <tr>
   *       <td rowspan = "2" nowrap>Group Item</td>
   *       <td><kbd>LeftArrow (RightArrow in RTL)</kbd></td>
   *       <td>Collapse the current item if it is expanded and is collapsible.  For non-hierarchical data, do nothing.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>RightArrow (LeftArrow in RTL)</kbd></td>
   *       <td>Expand the current item if it has children and is expandable.  For non-hierarchical data, do nothing.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojListView
   */

  //-------------------------------------------------------
  //                  SUB-IDS
  //-------------------------------------------------------

  /**
   * <p>Sub-ID for ListView's disclosure icon in group items.  See the <a href="#getNodeBySubId">getNodeBySubId</a>
   * method for details.</p>
   *
   * @ojdeprecated {since: "2.0.0", description: 'Use the <a href="#oj-listview-disclosure">oj-listview-disclosure</a> option instead.'}
   * @ojsubid oj-listview-icon
   * @memberof oj.ojListView
   *

   * @example <caption>Get the disclosure icon for the group item with key 'foo':</caption>
   * var node = myListView.getNodeBySubId( {'subId': 'oj-listview-icon', 'key': 'foo'} );
   */

  /**
   * <p>Sub-ID for ListView's disclosure icon in group items.  See the <a href="#getNodeBySubId">getNodeBySubId</a>
   * method for details.</p>
   *
   * @ojsubid oj-listview-disclosure
   * @memberof oj.ojListView
   *
   * @example <caption>Get the disclosure icon for the group item with key 'foo':</caption>
   * var node = myListView.getNodeBySubId( {'subId': 'oj-listview-disclosure', 'key': 'foo'} );
   */

  /**
   * <p>Context for items within ListView.</p>
   *
   * @property {number} index the zero based item index relative to its parent
   * @property {Object} key the key of the item
   * @property {Element} parent the parent group item.  Only available if item has a parent.
   * @property {boolean} group whether the item is a group.
   *
   * @ojnodecontext oj-listview-item
   * @memberof oj.ojListView
   */

  // ////////////////     SUB-PROPERTIES (dnd, scrollPolicyOptions)     //////////////////

  /**
   * If this object is specified, listview will initiate drag operation when the user drags on either a drag handle, which is an element with oj-listview-drag-handle class, or
   * selected items if no drag handle is set on the item.
   * @expose
   * @name dnd.drag.items
   * @ojshortdesc An object that describes drag functionality for a selected set of items. See the Help documentation for more information.
   * @memberof! oj.ojListView
   * @instance
   * @type {Object}
   */
  /**
   * The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one
   * type, or an array of strings if multiple types are needed.<br><br>
   * For example, if selected items of employee data are being dragged, dataTypes could be "application/employees+json". Drop targets can examine the data types and decide
   * whether to accept the data. A text input may only accept "text" data type, while a chart for displaying employee data may be configured to accept the "application/employees+json" type.<br><br>
   * For each type in the array, dataTransfer.setData will be called with the specified type and the JSON version of the selected item data as the value. The selected item data
   * is an array of objects, with each object representing a model object from the underlying data source.  For example, if the underlying data is an oj.Collection, then this
   * would be a oj.Model object.  Note that when static HTML is used, then the value would be the html string of the selected item.<br><br>
   * This property is required unless the application calls setData itself in a dragStart callback function.
   * @expose
   * @name dnd.drag.items.dataTypes
   * @ojshortdesc Specifies one or more MIME types to use for the dragged data in the dataTransfer object. See the Help documentation for more information.
   * @memberof! oj.ojListView
   * @instance
   * @type {string|Array.<string>}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * A callback function that receives the "dragstart" event and context information as its arguments.  The ontext information has the following properties:<br>
   * <ul>
   *   <li><code class="prettyprint">items</code>: An array of items being dragged
   *   </li>
   * </ul><br><br>
   * This function can set its own data and drag image as needed. If dataTypes is specified, event.dataTransfer is already populated with the default data when this function is invoked.
   * If dataTypes is not specified, this function must call event.dataTransfer.setData to set the data or else the drag operation will be cancelled.  In either case, the drag image is
   * set to an image of the dragged rows on the listview.
   * @expose
   * @name dnd.drag.items.dragStart
   * @ojshortdesc A callback function that receives the "dragstart" event and context information as its arguments.
   * @memberof! oj.ojListView
   * @instance
   * @type {function(Event, {items: Array.<Element>}):void}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * An optional callback function that receives the "drag" event as its argument.
   * @expose
   * @name dnd.drag.items.drag
   * @memberof! oj.ojListView
   * @instance
   * @type {function(Event)}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * An optional callback function that receives the "dragend" event as its argument.
   * @expose
   * @name dnd.drag.items.dragEnd
   * @memberof! oj.ojListView
   * @instance
   * @type {function(Event)}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * @typedef {Object} oj.ojListView.ItemsDropContext
   * @property {Element} item the item being dropped on
   * @property {'before'|'after'|'inside'} position the drop position relative to the item being dropped on
   * @property {boolean} reorder true if the drop was a reorder in the same listview, false otherwise
   */
  /**
   @typedef {Object} oj.ojListView.ItemTemplateContext
   @property {Element} componentElement The &lt;oj-list-view> custom element
   @property {Object} data The data for the current item being rendered
   @property {Object} item The current item being rendered
   @property {number} index The zero-based index of the current item during initial rendering. Note the index is not updated in response to item additions and removals.
   @property {string} key The key of the current item being rendered
   @property {number} depth The depth of the current item (available when hierarchical data is provided) being rendered. The depth of the first level children under the invisible root is 1.
   @property {boolean} leaf True if the current item is a leaf node (available when hierarchical data is provided).
   @property {string} parentkey The key of the parent item (available when hierarchical data is provided). The parent key is null for root nodes.
   @ojsignature [{target:"Type", value:"<K = any,D = any>", for:"genericTypeParameters"},
   {target:"Type", value:"D", for:"data", jsdocOverride: true},
   {target: "Type", value:"Item<K, D>", for:"item", jsdocOverride: true},
   {target:"Type", value:"K", for:"key", jsdocOverride: true},
  {target:"Type", value:"K", for:"parentkey", jsdocOverride: true}]
   */

  /**
   * An object that specifies callback functions to handle dropping items.
   * @expose
   * @name dnd.drop.items
   * @ojshortdesc An object that describes drop functionality for a selected set of items.
   * @memberof! oj.ojListView
   * @instance
   * @type {Object}
   */
  /**
   * A data type or an array of data types this component can accept.<br><br>
   * This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
   * @expose
   * @name dnd.drop.items.dataTypes
   * @ojshortdesc Specifies one or more data types that this component can accept. See the Help documentation for more information.
   * @memberof! oj.ojListView
   * @instance
   * @type {string | Array.<string>}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * An optional callback function that receives the "dragenter" event and context information as its arguments.  The context information has the following properties:<br>
   * <ul>
   *   <li><code class="prettyprint">item</code>: the item being entered
   *   </li>
   * </ul><br><br>
   * This function should call <code class="prettyprint">event.preventDefault</code> to indicate the dragged data can be accepted.<br><br>
   * @expose
   * @name dnd.drop.items.dragEnter
   * @ojshortdesc An optional callback function that receives the "dragenter" event and context information as its arguments.
   * @memberof! oj.ojListView
   * @instance
   * @type {function(Event, {item: Element}):void}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * An optional callback function that receives the "dragover" event and context information as its arguments.  The context information has the following properties:<br>
   * <ul>
   *   <li><code class="prettyprint">item</code>: the item being dragged over
   *   </li>
   * </ul><br><br>
   * Similar to dragEnter, this function should call <code class="prettyprint">event.preventDefault</code> to indicate the dragged data can be accepted.
   * @expose
   * @name dnd.drop.items.dragOver
   * @ojshortdesc An optional callback function that receives the "dragover" event and context information as its arguments.
   * @memberof! oj.ojListView
   * @instance
   * @type {function(Event, {item: Element}):void}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * An optional callback function that receives the "dragleave" event and context information as its arguments.  The context information has the following properties:<br>
   * <ul>
   *   <li><code class="prettyprint">item</code>: the item that was last entered
   *   </li>
   * </ul><br><br>
   * @expose
   * @name dnd.drop.items.dragLeave
   * @ojshortdesc An optional callback function that receives the "dragleave" event and context information as its arguments.
   * @memberof! oj.ojListView
   * @instance
   * @type {function(Event, {item: Element}):void}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * A callback function that receives the "drop" event and context information as its arguments.  The context information has the following properties:<br>
   * <ul>
   *   <li><code class="prettyprint">item</code>: the item being dropped on
   *   <li><code class="prettyprint">position</code>: the drop position relative to the item being dropped on
   *   <li><code class="prettyprint">reorder</code>: true if the drop was a reorder in the same listview, false otherwise
   *   </li>
   * </ul><br><br>
   * This function should call <code class="prettyprint">event.preventDefault</code> to indicate the dragged data is accepted.<br><br>
   * If the application needs to look at the data for the item being dropped on, it can use the getDataForVisibleItem method.
   * @expose
   * @name dnd.drop.items.drop
   * @ojshortdesc An optional callback function that receives the "drop" event and context information as its arguments.
   * @memberof! oj.ojListView
   * @instance
   * @type {function(Event, Object):void}
   * @default null
   * @ojsignature { target: "Type",
   *                value: "?((param0: Event, param1: oj.ojListView.ItemsDropContext)=> void)",
   *                jsdocOverride: true}
   */
  /**
   * The number of items to fetch in each block
   * @expose
   * @name scrollPolicyOptions.fetchSize
   * @memberof! oj.ojListView
   * @instance
   * @type {number}
   * @default 25
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * The maximum total number of items to fetch
   * @expose
   * @name scrollPolicyOptions.maxCount
   * @memberof! oj.ojListView
   * @instance
   * @type {number}
   * @default 500
   * @ojsignature { target: "Type",
   *                value: "?"}
   */
  /**
   * The element or a CSS selector string to an element which listview uses to determine the scroll position as well as the maximum scroll position.  For example in a lot of mobile use cases where ListView occupies the entire screen, developers should set the scroller option to document.documentElement.
   * @expose
   * @name scrollPolicyOptions.scroller
   * @ojshortdesc The element used to determine the scroll position as well as the maximum scroll position. See the Help documentation for more information.
   * @memberof! oj.ojListView
   * @instance
   * @type {Element|string}
   * @default null
   * @ojsignature {target:"Type", value:"? | Element | keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string"}
   */

  // Set theme-based defaults
  Components.setDefaultOptions({
    ojListView: {
      gridlines: Components.createDynamicPropertyGetter(function () {
        const gridlinesObject = _ojListView._CSS_Vars.gridlines;
        var defaults = {
          gridlines: _ojListView.getComplexCSSVariable(gridlinesObject)
        };
        if (defaults == null) {
          Logger.error(
            'Cannot find oj-list-view option defaults, which might be caused by missing JET css file'
          );
          defaults = { gridlines: {} };
        } else if (defaults.gridlines == null) {
          Logger.error(
            'Cannot find gridlines default option, which might be caused by a mismatch between JET js and css files'
          );
          defaults = { gridlines: {} };
        }
        return { item: defaults.gridlines.item };
      })
    }
  });

});
