/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'require', 'ojs/ojdataproviderscroller', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojthemeutils', 'ojs/ojkeysetimpl', 'ojs/ojcomponentcore', 'ojs/ojdatacollection-common', 'ojs/ojanimation', 'ojs/ojlogger', 'ojs/ojkeyset', 'ojs/ojmap', 'ojs/ojdomscroller', 'ojs/ojdataprovideradapter'], function(oj, $, localRequire, List, Context, Config, ThemeUtils, KeySetImpl, Components, DataCollectionUtils, AnimationUtils, Logger, KeySet, KeyMap)
{
  "use strict";

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
      "type": "object"
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
          "type": "Element"
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
        "x": {
          "type": "number"
        },
        "y": {
          "type": "number"
        },
        "index": {
          "type": "number"
        },
        "parent": {
          "type": "any"
        },
        "key": {
          "type": "any"
        },
        "offsetX": {
          "type": "number"
        },
        "offsetY": {
          "type": "number"
        }
      }
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
    "refresh": {},
    "getContextByNode": {},
    "getDataForVisibleItem": {},
    "getIndexerModel": {},
    "scrollToItem": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {},
    "ojBeforeCurrentItem": {},
    "ojBeforeExpand": {},
    "ojBeforeCollapse": {},
    "ojCollapse": {},
    "ojCopy": {},
    "ojCut": {},
    "ojExpand": {},
    "ojPaste": {},
    "ojReorder": {}
  },
  "extension": {}
};

/* global List:false, Promise:false, Symbol:false, Logger:false, Context:false, KeyMap:false */
/**
 * Handler for TreeDataProvider generated content
 * @constructor
 * @extends oj.DataSourceContentHandler
 * @ignore
 */
oj.TreeDataProviderContentHandler = function (widget, root, data) {
  oj.TreeDataProviderContentHandler.superclass.constructor.call(this, widget, root, data);
};

// Subclass from oj.DataSourceContentHandler
oj.Object.createSubclass(oj.TreeDataProviderContentHandler, List.DataProviderContentHandler,
                         'oj.TreeDataProviderContentHandler');

/**
 * Initializes the instance.
 * @protected
 */
oj.TreeDataProviderContentHandler.prototype.Init = function () {
  oj.TreeDataProviderContentHandler.superclass.Init.call(this);
  this.m_childDataProviders = new KeyMap();
};

/**
 * Determines whether the conent is hierarchical.
 * @return {boolean} returns true if content is hierarhical, false otherwise.
 * @protected
 */
oj.TreeDataProviderContentHandler.prototype.IsHierarchical = function () {
  return true;
};

/**
 * @private
 */
oj.TreeDataProviderContentHandler.prototype._getChildDataProvider = function (key) {
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
oj.TreeDataProviderContentHandler.prototype.fetchRows = function (forceFetch) {
  this.signalTaskStart('fetching rows'); // signal method task start

  oj.TreeDataProviderContentHandler.superclass.fetchRows.call(this, forceFetch);

  this._fetchChildren(null, this.m_root, null);

  this.signalTaskEnd(); // signal method task end
};

/**
 * @private
 */
oj.TreeDataProviderContentHandler.prototype._fetchChildren =
  function (parent, parentElem, successCallback) {
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
          var expandingClass = this.m_widget.getExpandingIconStyleClass();
          anchor.removeClass(collapseClass)
            .addClass(expandingClass);
        }
      }
    }

    // no need to check ready since multiple fetch from different parents can occur at the same time
    this.m_fetching = true;

    // use -1 to fetch all child rows
    var options = { size: -1 };

    this.signalTaskStart('first fetch');

    var dataProvider = this._getChildDataProvider(parent);
    var dataProviderAsyncIterator =
      dataProvider.fetchFirst(options)[Symbol.asyncIterator]();
    var promise = dataProviderAsyncIterator.next();

    // new helper function to be called in recursion to fetch all data.
    var helperFunction = function (values) {
      // skip additional fetching if done
      if (values[0].done) {
        return values;
      }
      var nextPromise = dataProviderAsyncIterator.next();
      var fetchMoreData = nextPromise.then(function (value) {
        // eslint-disable-next-line no-param-reassign
        values[0].done = value.done;
        // eslint-disable-next-line no-param-reassign
        values[0].value.data = values[0].value.data.concat(value.value.data);
        // eslint-disable-next-line no-param-reassign
        values[0].value.metadata = values[0].value.metadata.concat(value.value.metadata);
        return helperFunction(values);
      }, function (reason) {
        self._handleFetchError(reason);
        self.signalTaskEnd(); // first fetch
      });

      return (fetchMoreData);
    };

    Promise.all([promise, enginePromise]).then(function (values) {
      return helperFunction(values);
    }, function (reason) {
      self._handleFetchError(reason);
      self.signalTaskEnd(); // first fetch
    }).then(function (values) {
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

      // empty content now that we have data
      $(parentElem).empty();

      // append loading indicator at the end as needed
      self._handleFetchSuccess(value, parent, parentElem, successCallback, templateEngine);
      self.signalTaskEnd(); // first fetch
    });

    this.signalTaskEnd(); // signal method task end
  };

oj.TreeDataProviderContentHandler.prototype._handleFetchSuccess =
  function (dataObj, parent, parentElem, successCallback, templateEngine) {
    var self = this;

    // listview might have been destroyed before fetch success is handled
    if (this.m_widget == null || dataObj.value == null) {
      return;
    }

    this.signalTaskStart('handling successful fetch'); // signal method task start

    var data = dataObj.value.data;
    var keys = dataObj.value.metadata.map(function (value) {
      return value.key;
    });

    if (data.length === keys.length) {
      var index = 0;
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        // passing -1 for opt since we know it will be inserted at the end of the parent
        this.addItem(fragment, -1, row, this.getMetadata(index, keys[i], row, parentElem),
          templateEngine);

        index += 1;
      }
      parentElem.appendChild(fragment);

      // update aria-colspan on the gridcell representing the group header
      if (this.shouldUseGridRole() && this.isCardLayout() && parent != null && index > 0) {
        var gridcell = parentElem.parentNode.firstElementChild.firstElementChild;
        $(gridcell).attr('aria-colspan', index + 1);
      }
    }

    // fetch is done
    this.m_fetching = false;

    function postProcessing() {
      if (self.m_widget) {
        // if a callback is specified (as it is in the expand case), then invoke it
        if (successCallback != null) {
          successCallback.call(null, parentElem);
        }

        self.m_widget.renderComplete();

        // process any outstanding events
        self._processEventQueue();
      }
    }

    if (this.isAsyncRendering()) {
      // custom elements renders async so this is needed.
      // Also, since the root for non-custom element is <ul>, when application do a whenReady within the context
      // of <ul>, the postProcessing might be called after application's whenReady handler.
      var busyContext = Context.getContext(this.m_root).getBusyContext();
      busyContext.whenReady().then(function () {
        postProcessing();
      });
    } else {
      postProcessing();
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
oj.TreeDataProviderContentHandler.prototype.getMetadata =
  function (index, key, data, parentElem) {
    var context = oj.TreeDataProviderContentHandler.superclass.getMetadata.call(this, index, key,
      data, parentElem);

    var childDataProvider = this._getChildDataProvider(key);
    context.leaf = (childDataProvider === null);
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
oj.TreeDataProviderContentHandler.prototype.GetBindingContext = function (context) {
  var bindingContext = oj.TreeDataProviderContentHandler.superclass
      .GetBindingContext.call(this, context);
  bindingContext.depth = context.depth;
  bindingContext.leaf = context.leaf;
  bindingContext.parentKey = context.parentKey;

  return bindingContext;
};

oj.TreeDataProviderContentHandler.prototype.afterRenderItem =
  function (item, context, isCustomizeItem) {
    this.signalTaskStart('after rendering an item'); // signal method task start

    oj.TreeDataProviderContentHandler.superclass.afterRenderItem.call(this, item, context,
      isCustomizeItem);

    var groupStyleClass = this.m_widget.getGroupStyleClass();
    var itemStyleClass = this.m_widget.getItemStyleClass();
    var groupItemStyleClass = this.m_widget.getGroupItemStyleClass(true);
    var groupCollapseStyleClass = this.m_widget.getGroupCollapseStyleClass();
    var collapseClass = this.m_widget.getCollapseIconStyleClass();
    var focusedStyleClass = this.m_widget.getFocusedElementStyleClass();

    // eslint-disable-next-line no-param-reassign
    item = $(item);

    if (context.leaf === false) {
      item.children().wrapAll('<div></div>'); // @HTMLUpdateOK

      // collapsed by default
      if (item.hasClass(focusedStyleClass)) {
        item.removeClass(focusedStyleClass)
          .children().first()
          .addClass(focusedStyleClass)
          .attr('aria-expanded', 'false');
      } else {
        item.children().first()
          .attr('role', 'presentation')
          .find('.' + focusedStyleClass)
          .attr('aria-expanded', 'false');
      }

      var content = item.children().first();
      content.uniqueId()
        .addClass(groupItemStyleClass);

      // add the expand icon
      if (this.m_widget.isExpandable()) {
        item.addClass('oj-collapsed');

        var icon = document.createElement('a');
        $(icon).attr('href', '#')
          .attr('aria-labelledby', content.get(0).id)
          .addClass('oj-component-icon oj-clickable-icon-nocontext')
          .addClass(collapseClass);

        content.prepend(icon); // @HTMLUpdateOK
      }

      if (this.shouldUseGridRole()) {
        content.get(0).removeAttribute('aria-expanded');
        content.removeClass(focusedStyleClass);
        content.attr('role', 'row');
        content.children()
          .wrapAll("<div role='gridcell' aria-expanded='false' class='oj-listview-cell-element " +
                   focusedStyleClass + "'></div>"); // @HTMLUpdateOK
      }

      // the yet to be expand group element
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
      $(groupItem).addClass(groupStyleClass)
        .addClass(groupCollapseStyleClass)
        .attr('role', role);
      item.append(groupItem); // @HTMLUpdateOK
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

    // callback to widget
    this.m_widget.itemRenderComplete(item[0], context);

    this.signalTaskEnd(); // signal method task end
  };

oj.TreeDataProviderContentHandler.prototype._handleFetchError = function (status) {
  // listview might have been destroyed before fetch error is handled
  if (this.m_widget == null) {
    Logger.info('handleFetchError: widget has already been destroyed');
    return;
  }

  this.signalTaskStart('handling fetch error: ' + status); // signal method task start

  // TableDataSource aren't giving me any error message
  Logger.error(status);

  this.m_widget.renderComplete();

  this.signalTaskEnd(); // signal method task end
};

oj.TreeDataProviderContentHandler.prototype.Expand = function (item, successCallback) {
  this.signalTaskStart('expanding an item'); // signal method task start

  var parentKey = this.GetKey(item[0]);
  var parentElem = item.children('ul')[0];
  this._fetchChildren(parentKey, parentElem, successCallback);

  this.signalTaskEnd(); // signal method task end
};

oj.TreeDataProviderContentHandler.prototype.Collapse = function (item) {
  // template engine should have already been loaded
  var templateEngine = this.getTemplateEngine();
  if (templateEngine) {
    templateEngine.clean(item.get(0));
  }

  // remove all children nodes
  item.empty(); // @HTMLUpdateOK
};

/**
 * @protected
 */
oj.TreeDataProviderContentHandler.prototype.addItemsForModelInsert =
  function (data, indexes, keys, parentKeys, isBeforeKeys, refKeys) {
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
        index = this._getIndex(refKeys, i);
        if (index > -1) {
          index = isBeforeKeys ? index : index + 1;
        }
      }

      this.addItem(parentElem, index, data[i],
                   this.getMetadata(index, keys[i], data[i], parentElem),
                   templateEngine,
                   this.afterRenderItemForInsertEvent.bind(this));

      this.signalTaskEnd(); // signal add item end
    }
  };

/**
 * @protected
 */
oj.TreeDataProviderContentHandler.prototype.afterRenderItemForInsertEvent =
  function (item, context, isCustomizeItem) {
    if (context.leaf === false) {
      // if it's a group node, we just need to call afterRenderItem
      this.afterRenderItem(item, context, isCustomizeItem);
    } else {
      oj.TreeDataProviderContentHandler.superclass.afterRenderItemForInsertEvent
        .call(this, item, context, isCustomizeItem);
    }
  };

/**
 * @protected
 */
oj.TreeDataProviderContentHandler.prototype.handleModelRefreshEvent = function (event) {
  if (this.m_root == null) {
    return;
  }

  // if listview is busy, hold that off until later, the refresh must be handled in order
  // since we don't know when the results are coming back in
  if (!this.IsReady()) {
    this._pushToEventQueue({ type: event.type, event: event });
    return;
  }

  this.signalTaskStart('handling model refresh event'); // signal method task start

  // since we are refetching everything, we should just clear out any outstanding model events
  this._clearEventQueue();

  // empty everything (later) and clear cache
  this.m_widget.ClearCache();

  // clear cached child DataProviders
  this.m_childDataProviders.clear();

  // fetch data
  this.fetchRows(true);

  this.signalTaskEnd(); // signal method task end
};


/* global Context:false, KeyMap:false, KeySet:false, DataCollectionUtils:false */

/**
 * Handler for static HTML content
 * @constructor
 * @ignore
 */
oj.StaticContentHandler = function (widget, root) {
  this.m_widget = widget;
  this.m_root = root;
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.StaticContentHandler, oj.Object, 'oj.StaticContentHandler');

/**
 * Initializes the instance.
 * @protected
 */
oj.StaticContentHandler.prototype.Init = function () {
  oj.StaticContentHandler.superclass.Init.call(this);
};

/**
 * Destroy the content handler
 * @protected
 */
oj.StaticContentHandler.prototype.Destroy = function () {
  // check if it's been destroyed or in process
  if (!this.m_root.hasAttribute('role')) {
    return;
  }

  this.restoreContent(this.m_root, 0);
  this.unsetRootAriaProperties();

  if (this.shouldUseGridRole() && this.isCardLayout() && !this.IsHierarchical()) {
    $(this.m_root).children()
      .first()
      .children()
      .unwrap()
      .children()
      .unwrap();
  }
};

/**
 * Determine whether the content handler is ready
 * @return {boolean} returns true there's no outstanding request, false otherwise.
 * @protected
 */
oj.StaticContentHandler.prototype.IsReady = function () {
  // static content does not fetch
  return true;
};

oj.StaticContentHandler.prototype.notifyShown = function () {
  // do nothing since all items are present
};

oj.StaticContentHandler.prototype.notifyAttached = function () {
  // do nothing since all items are present
};

oj.StaticContentHandler.prototype.RenderContent = function () {
  var root = this.m_root;
  if (this.shouldUseGridRole() && this.isCardLayout() &&
      !this.IsHierarchical() && $(root).children('li').length > 0) {
    // in card layout, this is going to be a single row, N columns grid
    // so we'll need to wrap all <li> within a row
    $(this.m_root).children()
      .wrapAll("<li role='presentation'><ul role='row' class='" +
               this.m_widget.getGroupStyleClass() + "'></ul></li>"); // @HTMLUpdateOK
    var wrapped = $(this.m_root).children('li').first().get(0);
    wrapped.style.width = '100%';
    root = wrapped.firstElementChild;
  }
  this.modifyContent(root, 0);
  this.setRootAriaProperties();
  this.m_widget.renderComplete();

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

oj.StaticContentHandler.prototype.Expand = function (item, successCallback) {
  var selector = '.' + this.m_widget.getGroupStyleClass();
  var groupItem = $(item).children(selector)[0];
  $(groupItem).css('display', '');

  successCallback.call(null, groupItem);
};

// eslint-disable-next-line no-unused-vars
oj.StaticContentHandler.prototype.Collapse = function (item) {
  // nothing to do
};

oj.StaticContentHandler.prototype.IsHierarchical = function () {
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
oj.StaticContentHandler.prototype.restoreContent = function (elem, depth) {
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

  var items = elem.children;
  for (var i = 0; i < items.length; i++) {
    var item = $(items[i]);
    // skip children that are not modified, this could happen if ko:foreach backed by an observable array is used to generate
    // the content, and the observable array has changed
    if (item.hasClass(itemElementStyleClass)) {
      this.unsetAriaProperties(item.get(0));
      item.removeClass(itemElementStyleClass)
        .removeClass(itemStyleClass)
        .removeClass(itemLayoutStyleClass)
        .removeClass(this.m_widget.getDepthStyleClass(depth))
        .removeClass('oj-skipfocus')
        .removeClass('oj-focus')
        .removeClass('oj-hover')
        .removeClass('oj-expanded')
        .removeClass('oj-collapsed')
        .removeClass('oj-selected');

      var groupItems = item.children('ul');
      if (groupItems.length > 0) {
        item.children('.' + groupItemStyleClass).children().unwrap();
        if (this.shouldUseGridRole()) {
          this.unsetGroupAriaProperties(item);
        }
        item.children('.oj-component-icon').remove();

        var groupItem = $(groupItems[0]);
        groupItem.removeClass(groupStyleClass)
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
oj.StaticContentHandler.prototype.modifyContent = function (elem, depth) {
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

    item.uniqueId()
      .addClass(itemElementStyleClass);
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

      item.children(':not(ul)')
        .wrapAll('<div></div>'); // @HTMLUpdateOK

      var content = item.children().first();
      content.addClass(groupItemStyleClass);

      var count = this.getItemsCount(groupItems[0]);
      if (count > 0) {
        if (item.hasClass(focusedElementStyleClass)) {
          item.removeClass(focusedElementStyleClass);
          content.addClass(focusedElementStyleClass)
            .attr('aria-expanded', 'false');
        } else {
          content.attr('role', 'presentation');
          content.find('.' + focusedElementStyleClass)
            .attr('aria-expanded', 'false');
        }

        // add the expand icon
        if (expandable) {
          item.addClass('oj-collapsed');

          content.uniqueId();

          // add the expand icon
          var icon = document.createElement('a');
          $(icon).attr('href', '#')
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
      groupItem.addClass(groupStyleClass)
        .addClass(groupCollapseStyleClass)
        .attr('role', role)
        .css('display', 'none');
      this.modifyContent(groupItem[0], depth + 1);
    } else {
      item.addClass(itemStyleClass);
      if (this.m_widget.getItemLayoutStyleClass) {
        item.addClass(this.m_widget.getItemLayoutStyleClass());
      }
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
oj.StaticContentHandler.prototype.setRootAriaProperties = function () {
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
oj.StaticContentHandler.prototype.unsetRootAriaProperties = function () {
  this.m_root.removeAttribute('role');
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.getItemsCount = function (item) {
  return $(item).children('li').length;
};

/**
 * Creates the object with context information for the specified item
 * @param {jQuery} item the item to create context info object for
 * @return {Object} the context object
 * @private
 */
oj.StaticContentHandler.prototype.createContext = function (item) {
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
oj.StaticContentHandler.prototype.setAriaProperties = function (item, context) {
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
        elem.children()
          .wrapAll("<div role='gridcell' class='oj-listview-cell-element'></div>"); // @HTMLUpdateOK
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
oj.StaticContentHandler.prototype.setGroupAriaProperties = function (group, count) {
  var focusedElementStyleClass = this.m_widget.getFocusedElementStyleClass();

  // aria-expanded should be in the cell
  group.get(0).removeAttribute('aria-expanded');
  group.removeClass(focusedElementStyleClass);
  group.attr('role', 'row');
  group.children()
    .wrapAll("<div role='gridcell' aria-expanded='false' class='oj-listview-cell-element " +
             focusedElementStyleClass + "'></div>"); // @HTMLUpdateOK

  if (this.isCardLayout() && count > 1) {
    group.children().first().attr('aria-colspan', count);
  }
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.unsetGroupAriaProperties = function (item) {
  item.children('div').first().children().unwrap();
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.unsetAriaProperties = function (item) {
  DataCollectionUtils.enableAllFocusableElements(item);

  var groupItemStyleClass = this.m_widget.getGroupItemStyleClass(true);
  var focusedElementStyleClass = this.m_widget.getFocusedElementStyleClass();
  var firstElementChild = item.firstElementChild;
  var elem;
  if (firstElementChild && $(firstElementChild).hasClass(groupItemStyleClass)) {
    elem = $(firstElementChild).children('.' + focusedElementStyleClass).first();
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
      elem.children()
        .first()
        .children()
        .unwrap()
        .children()
        .unwrap();
    }
  }
};

oj.StaticContentHandler.prototype.GetKey = function (element) {
  return $(element).attr('id');
};

oj.StaticContentHandler.prototype.FindElementByKey = function (key) {
  return document.getElementById(key);
};

oj.StaticContentHandler.prototype.isFocusable = function (context) {
  return this.m_widget.getItemFocusable(context);
};

oj.StaticContentHandler.prototype.isSelectable = function (context) {
  return this.m_widget.getItemSelectable(context);
};

oj.StaticContentHandler.prototype.isCardLayout = function () {
  return this.m_widget.isCardLayout();
};

oj.StaticContentHandler.prototype.shouldUseGridRole = function () {
  return this.m_widget.ShouldUseGridRole();
};

oj.StaticContentHandler.prototype.createKeyMap = function (initialMap) {
  var map = new KeyMap();
  if (initialMap) {
    initialMap.forEach(function (value, key) {
      map.set(key, value);
    });
    return map;
  }
  return map;
};

oj.StaticContentHandler.prototype.createKeySet = function (initialSet) {
  return new KeySet(initialSet);
};


/* global List:false, Context:false, ThemeUtils:false, Promise:false, KeySetImpl:false, Set:false, Components:false, DataCollectionUtils:false, Logger:false, KeySet:false, KeyMap:false, localRequire:false, Config:false */

/**
 * Partial Map impl, replace with ES6 Map when possible.
 * @constructor
 * @ignore
 */
oj.KeyMap = function () {
};

oj.KeyMap.prototype.set = function (key, value) {
  if (this._mapKeys === undefined && this._mapValues === undefined) {
    this._mapKeys = [];
    this._mapValues = [];
  }

  var index = this._mapKeys.indexOf(key);
  if (index > -1) {
    this._mapValues.splice(index, 1, value);
  } else {
    this._mapKeys.push(key);
    this._mapValues.push(value);
  }
};

oj.KeyMap.prototype.get = function (key) {
  if (this._mapKeys && this._mapValues) {
    var index = this._mapKeys.indexOf(key);
    if (index > -1 && this._mapValues.length > index) {
      return this._mapValues[index];
    }
  }

  return null;
};

oj.KeyMap.prototype.deleteValue = function (value) {
  var current = this._mapValues.indexOf(value);
  while (current > -1) {
    this._mapValues.splice(current, 1);
    this._mapKeys.splice(current, 1);
    current = this._mapValues.indexOf(value, current);
  }
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
    return new KeySet(initialSet);
  };
};

ContentHandlerMixin.call(oj.StaticContentHandler.prototype);
ContentHandlerMixin.call(oj.TreeDataProviderContentHandler.prototype);
ContentHandlerMixin.call(List.IteratingDataProviderContentHandler.prototype);

/**
 * Default ExpandedKeySet class
 * Need a way to distinguish ExpandedKeySet set by application vs default one created by ListView
 * @extends {ExpandedKeySet}
 * @constructor
 * @ignore
 */
oj._ojListViewExpandedKeySet = function () {
  oj._ojListViewExpandedKeySet.superclass.constructor.call(this);
};

// Subclass from KeySet
oj.Object.createSubclass(oj._ojListViewExpandedKeySet, oj.ExpandedKeySet,
                         'ListViewExpandedKeySet');

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
oj._ojListView = _ListViewUtils.clazz(Object, /** @lends oj._ojListView.prototype */ {
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

    this.element
      .uniqueId()
      .addClass(this.GetStyleClass() + ' oj-component-initnode');

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
        touchstart: this._touchStartListener,
      });
    }
    this.ojContext._on(this.element, {
      click: function (event) {
        self.HandleMouseClick(event);
        self.touchStartEvent = null;
      },
      touchend: function (event) {
        if (self.touchStartEvent && event.changedTouches.length) {
          var overElem = document.elementFromPoint(event.changedTouches[0].clientX,
            event.changedTouches[0].clientY);
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
      },
    });

    // in Firefox, need to explicitly make list container not focusable otherwise first tab will focus on the list container
    if (oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.FIREFOX &&
      this._isComponentFocusable()) {
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
      // StaticContentHandler will handle cases where children are invalid or empty
      postProcess(new oj.StaticContentHandler(this, this.element[0]));
    }
  },

  /**
   * Setup resources on listview after connect
   * Invoked by widget
   */
  setupResources: function () {
    this.ojContext.document.bind('touchend.ojlistview touchcancel.ojlistview',
                                 this.HandleTouchEndOrCancel.bind(this));
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
  },

  /**
   * Sync up legacy selection with KeySet during initialization
   * @private
   */
  _syncSelectionWithKeySet: function () {
    var selection = this.GetOption('selection');
    var selected = this.GetOption('selected');
    var needsUpdate = false;

    // NavList do not have this property, need to initialize it
    if (selected == null) {
      selected = new oj.KeySetImpl();
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
          internalSet: true,
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
   * Redraw the entire list view after having made some external modifications.
   * Invoked by widget
   */
  refresh: function () {
    // reset content, wai aria properties, and ready state
    this._resetInternal();

    this.signalTaskStart('Refresh'); // signal method task start

    // set the wai aria properties
    this.SetAriaProperties();

    // recreate the content handler
    this._initContentHandler();

    // update top/bottom gridlines
    this._updateGridlines();

    this.signalTaskEnd(); // signal method task end
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
    oj.DomUtils.unwrap(this.element, this.getListContainer());
  },

  /**
   * Adjust the value of scrollPosition based on the value from scrollPositionPolicy
   */
  adjustScrollPositionValueOnRefresh: function () {
    var scrollPosition = this.GetOption('scrollPosition') == null ?
        {} : this.GetOption('scrollPosition');
    var selection = this.GetOption('selection');

    if (this._isSelectionEnabled() && selection.length > 0) {
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
      Logger.warn('ListView did not end with a clean state, this could happen if ListView is detached before fetch is complete.  State: ' +
                     this.readinessStack);

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
    this.m_noDataContent = null;
    this.m_gridlinesVisible = null;
    this.m_gridlinePlaceholder = null;

    this.ClearCache();

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
    // make sure component is not destroyed
    if (this.m_contentHandler != null) {
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
    // make sure component is not destroyed
    if (this.m_contentHandler != null) {
      // restore scroll position as needed since some browsers reset scroll position
      this.syncScrollPosition();

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
        parent = $(parent).children('ul.' + this.getGroupStyleClass()).first();
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
   * To be override by NavList
   * @protected
   */
  ShouldRegisterResizeListener: function (element) {
    return (element && this.m_contentHandler &&
            this.m_contentHandler.HandleResize &&
            this.m_contentHandler.shouldHandleResize &&
            this.m_contentHandler.shouldHandleResize());
  },

  /**
   * Unregister event listeners for resize the container DOM element.
   * @param {Element} element  DOM element
   * @private
   */
  _unregisterResizeListener: function (element) {
    if (element && this._resizeHandler) {
      // remove existing listener
      oj.DomUtils.removeResizeListener(element, this._resizeHandler);
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

      oj.DomUtils.addResizeListener(element, this._resizeHandler);
    }
  },

  /**
   * Returns DnD Context, needed to override in navigationlist
   * @protected
   */
  GetDnDContext: function () {
    // if dnd is not enabled, we should not do anything also even if ojlistviewdnd is required
    var dndOptions = this.GetOption('dnd');
    if (dndOptions === null || (dndOptions.drag === null && dndOptions.drop === null &&
      dndOptions.reorder && dndOptions.reorder.items === 'disabled')) {
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
    if (width > 0 && height > 0 && this.m_contentHandler != null &&
        this.m_contentHandler.HandleResize) {
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
    return (options.data != null ||
            options.drillMode != null ||
            options.groupHeaderPosition != null ||
            options.item != null ||
            options.scrollPolicy != null ||
            options.scrollPolicyOptions != null ||
            options.gridlines != null);
  },

  /**
   * Returns true if value is a KeySet, false otherwise
   * @private
   */
  _isKeySet: function (value) {
    return value.isAddAll !== undefined && (value.values !== undefined ||
     value.deletedValues !== undefined);
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
    if (this._shouldDragSelectedItems() && this.m_active != null &&
        options.dnd != null && options.dnd.reorder != null) {
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
      var value = {
        key: key,
        data: this.getDataForVisibleItem({ key: key })
      };

      this.SetOption('firstSelectedItem', value, {
        _context: {
          originalEvent: null,
          internalSet: true
        },
        changed: true
      });
    }
  },

  /**
   * Set Selection option. Overriden by Navlist.
   * @param {Object} options the options object
   * @protected
   */
  HandleSelectionOption: function (options) {
    if (options.selection != null || options.selected != null) {
      if (this._isSelectionEnabled()) {
        var selected = options.selected;
        if (selected != null && selected.isAddAll()) {
          var items = this._getItemsCache();
          for (var j = 0; j < items.length; j++) {
            this._applySelection(items[j], this.m_contentHandler.GetKey(items[j]));
          }

          // eslint-disable-next-line no-param-reassign
          options.selection = KeySet.KeySetUtils.toArray(selected);
        } else {
          var set = selected != null ? selected.values() : options.selection;

          // remove any non-selectable items, this will effectively clone the selection as well,
          // which we'll need to do.  filterSelection takes an iterable
          var filteredSelection = this._filterSelection(set);
          // eslint-disable-next-line no-param-reassign
          options.selection = filteredSelection;

          // eslint-disable-next-line no-param-reassign
          selected = this.GetOption('selected');
          selected = selected.clear();
          selected = selected.add(filteredSelection);
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
          for (var i = 0; i < filteredSelection.length; i++) {
            var elem = this.FindElementByKey(filteredSelection[i]);
            if (elem != null) {
              this._applySelection(elem, filteredSelection[i]);
            }
          }
        }

        if (selected != null) {
          this._updateFirstSelectedItem(selected);
        }
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
    var id = this.ojContext._IsCustomElement() ?
        this.GetRootElement().attr('id') : this.element.attr('id');
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
        var options = description != null ?
            { description: this._getBusyDescription(description) } : {};
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
    return (this.busyStateResolve == null);
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
   * Whether the listview is in card layout mode
   * @return {boolean} true if it is in card layout mode, false otherwise
   */
  isCardLayout: function () {
    var elem = this.ojContext._IsCustomElement() ? this.GetRootElement() : this.element;
    return elem.hasClass('oj-listview-card-layout');
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
      contentHandler =
          new List.IteratingDataProviderContentHandler(this,
                                                     this.element[0],
                                                     new oj.TableDataSourceAdapter(data));
    } else if (typeof oj.TreeDataSource !== 'undefined' && data instanceof oj.TreeDataSource) {
      var adapterPromise = oj.__getRequirePromise('./ojtreedataprovideradapter', localRequire);
      if (!adapterPromise) {
        throw new Error('Cannot adapt a TreeDataSource if require() is not available');
      }

      var self = this;
      return adapterPromise.then(function (TreeDataSourceAdapter) {
        return new oj.TreeDataProviderContentHandler(self,
                                              self.element[0],
                                              new TreeDataSourceAdapter(data));
      });
    } else if (oj.DataProviderFeatureChecker.isTreeDataProvider(data)) {
      contentHandler = new oj.TreeDataProviderContentHandler(this, this.element[0], data);
    } else if (oj.DataProviderFeatureChecker.isDataProvider(data)) {
      contentHandler = new List.IteratingDataProviderContentHandler(this, this.element[0], data);
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
    this.element.removeAttr('aria-activedescendant')
      .removeAttr('aria-multiselectable');
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

    // touch specific instruction text for screen reader for reordering
    if (this._isTouchSupport() && this.m_dndContext != null) {
      container.append(this._buildAccInstructionText()); // @HTMLUpdateOK
    }
  },

  /**
   * Build a status bar div
   * @return {jQuery} the root of the status bar
   * @private
   */
  _buildStatus: function () {
    var icon = $(document.createElement('div'));
    icon.addClass('oj-icon')
        .addClass(this.getLoadingStatusIconStyleClass());

    var root = $(document.createElement('div'));
    root.addClass(this.getStatusMessageStyleClass())
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
    root.addClass('oj-helper-hidden-accessible')
      .attr({
        id: this._createSubId('info'),
        role: 'status'
      });

    return root;
  },

  /**
   * Build the accessible instruction text for touch devices
   * @return {jQuery} the root of the acc info div
   * @private
   */
  _buildAccInstructionText: function () {
    var root = $(document.createElement('div'));
    root.addClass('oj-helper-hidden-accessible')
      .attr({ id: this._createSubId('instr') });
    root.text(this.ojContext.getTranslatedString('accessibleReorderTouchInstructionText'));

    return root;
  },

  /**
   * Sets the accessible text info
   * @param {string} text the text to set on accessible info div
   * @private
   */
  _setAccInfoText: function (text) {
    if (text !== '' && this.m_accInfo.text() !== text) {
      this.m_accInfo.text(text);
    }
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
    var msg = this.ojContext.getTranslatedString('msgItemsAppended', { count: count });
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
    this.m_status.attr('aria-label', msg)
      .css('left', Math.max(0, (container.outerWidth() / 2) - (this.m_status.outerWidth() / 2)))
      .css('top', Math.max(0, (container.outerHeight() / 2) - (this.m_status.outerHeight() / 2)))
      .show();

    // make sure the container is tall enough to show the indicator
    if (this.m_minHeightSet === undefined) {
      var statusHeight = this.m_status.get(0).offsetHeight;
      var containerHeight = container.get(0).offsetHeight;
      container.css('minHeight', Math.max(containerHeight,
                                          statusHeight + this.getListContainerBorderWidth()));
      this.m_minHeightSet = true;
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
    var delay = parseInt(defaultOptions.showIndicatorDelay, 10);

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
      this.element.parent()[0].replaceChild(listContainer[0], this.element[0]); // @HTMLUpdateOK
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
    var empty = document.createElement('li');
    empty.id = this._createSubId('empty');
    empty.className = this.getEmptyTextStyleClass() + ' ' + this.getEmptyTextMarkerClass();
    empty.textContent = emptyText;

    return empty;
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
        item.removeClass('oj-collapsed')
          .addClass('oj-expanded');
      }
    } else if (state === this.STATE_COLLAPSED) {
      this.getFocusItem(item).attr('aria-expanded', 'false');
      if (expandable) {
        item.removeClass('oj-expanded')
          .addClass('oj-collapsed');
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
    return oj.BaseCustomElementBridge.getSlotMap(this.GetRootElement()[0]);
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
   */
  itemRemoveComplete: function (elem, restoreFocus) {
    // if it's the current focus item, try to focus on the next/prev item.  If there are none, then focus on the root element
    if (this.m_active != null && oj.Object.compareValues(this.m_active.key, this.GetKey(elem))) {
      // make sure we exit actionable mode, otherwise focus will be lost
      this._setActionableMode(false, true);

      var next = elem.nextElementSibling;
      if (next == null || !$(next).hasClass(this.getItemElementStyleClass())) {
        next = elem.previousElementSibling;
        if (next == null || !$(next).hasClass(this.getItemElementStyleClass())) {
          this.SetOption('currentItem', null);
        }
      }

      if (next != null && $(next).hasClass(this.getItemElementStyleClass())) {
        this.SetCurrentItem($(next), null, !restoreFocus);
      }
    }

    // disassociate element from key map
    if (elem != null && elem.id && this.m_keyElemMap != null) {
      this.m_keyElemMap.delete(elem.id);
    }

    // clear cached height
    this.m_clientHeight = null;
    this.m_scrollHeight = null;
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
            if (value === key && (self._collapsedKeys == null ||
                                  self._collapsedKeys.indexOf(value) === -1)) {
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
    if (this.m_active != null && key === this.m_active.key && this.m_active.elem != null &&
        elem !== this.m_active.elem.get(0)) {
      this.m_active.elem = $(elem);
    }
  },

  /**
   * Returns the noData template element inside oj-list-view
   * @return {Element|null} the content of noData slot
   * @private
   */
  _addNoData: function () {
    if (this.m_noDataContent == null) {
      if (this.ojContext._IsCustomElement()) {
        var slotMap = this.GetSlotMap();
        var slot = slotMap.noData;
        if (slot && slot.length > 0 && slot[0].tagName.toLowerCase() === 'template') {
          var noDataContentRoot = document.createElement('div');
          noDataContentRoot.id = this._createSubId('empty');
          noDataContentRoot.className = 'oj-listview-no-data-container';
          var self = this;
          this.signalTaskStart('run no data template');
          Config.__getTemplateEngine().then(function (engine) {
            var root = self.GetRootElement();
            var nodes = engine.execute(root, slot[0], {}, null);
            nodes.forEach(function (node) {
              noDataContentRoot.appendChild(node);
            });
            root.append(noDataContentRoot);
            self.m_noDataContent = noDataContentRoot;
            self.m_engine = engine;
            self.signalTaskEnd();
          }, function (reason) {
            self.signalTaskEnd();
            throw new Error('Error loading template engine: ' + reason);
          });
          return;
        }
      }
      // non-custom element or when noData slot is specified
      this.element.append(this._buildEmptyText()); // @HTMLUpdateOK
    } else {
      // cached
      this.GetRootElement().append(this.m_noDataContent); // @HTMLUpdateOK
    }
  },

  /**
   * Remove empty element artifacts from list
   * @private
   */
  _removeNoData: function () {
    var elem = document.getElementById(this._createSubId('empty'));
    if (elem) {
      if (this.m_engine) {
        this.m_engine.clean(elem);
      }
      elem.parentNode.removeChild(elem);
    }
  },

  /**
   * Called by content handler once content of all items are rendered
   */
  renderComplete: function () {
    var self = this;

    this.hideStatusText();

    // remove any empty text div
    this._removeNoData();

    // clear items cache
    this.m_items = null;
    this.m_groupItems = null;

    // if grid role and card layout and non-heirarchical and presentation div is empty, remove presentation div to clear out the element
    if (this._isEmptyGrid()) {
      this.element[0].removeChild(this.element[0].children[0]);
    }

    // check if it's empty
    if (this.element[0].childElementCount === 0) {
      this._addNoData();

      // fire ready event
      this.Trigger('ready', null, {});

      return;
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
    if (this.getListContainer().hasClass('oj-focus-ancestor') &&
        this.m_active == null &&
        current == null && !this._isTouchSupport()) {
      this._initFocus();
    }

    // clear the scroll and fetch flag before calling syncScrollPosition
    this.m_scrollAndFetch = undefined;

    // update scroll position if it's not in sync, make sure we are not in the middle of scrolling
    if (!this.m_ticking || this.m_scrollPosition != null) {
      this.syncScrollPosition();
    }

    // validate selection as needed
    // only do the validation once for initial render/refresh
    if (this.m_keyElemMap == null && this._isSelectionEnabled() &&
        this._isSelectionRequired()) {
      this.signalTaskStart('validating selection entries');

      // take a snapshot of the value since the value is live and mutable
      var selection = this.GetOption('selection').slice(0);
      if (selection.length > 0) {
        this._validateSelection(selection).then(function (valid) {
          // if all of the selection are invalid, then we'll need to select the first item
          // and update the selection
          if (!valid) {
            self._selectFirstSelectableItem();

            // ... and fire ready event (legacy)
            self.Trigger('ready', null, {});
          }

          self.signalTaskEnd();
        });
      }
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
    if (this.m_gridlinePlaceholder != null) {
      this.m_gridlinePlaceholder.parentNode.removeChild(this.m_gridlinePlaceholder);
    }
    if ((this.m_contentHandler.hasMoreToFetch === undefined ||
      (this.m_contentHandler.hasMoreToFetch && !this.m_contentHandler.hasMoreToFetch()))
      && this._shouldRenderGridlineForLastItem()) {
      var gridlinePlaceholder = document.createElement('li');
      gridlinePlaceholder.setAttribute('role', 'presentation');
      gridlinePlaceholder.className = 'oj-listview-gridline-placeholder';
      this.element[0].appendChild(gridlinePlaceholder);

      this.m_gridlinePlaceholder = gridlinePlaceholder;
    }

    // fire ready event
    this.Trigger('ready', null, {});
  },

  /**
   * Validate keys in selection
   * @private
   */
  _validateSelection: function (selection) {
    var promise = this._validateKeys(selection);
    // if it cannot validate, treat it as a valid key and return a Promise that resolves to true so that the key does not get remove.
    return promise === null ? Promise.resolve(true) : promise;
  },

  /**
   * Returns whether or not the li presentation div is present and empty.
   * @private
   * @returns {boolean} true if li presentation div is present and empty.
   */
  _isEmptyGrid: function () {
    return (this.ShouldUseGridRole() && this.isCardLayout() &&
            !this.m_contentHandler.IsHierarchical() && this.element[0].children[0] &&
            this.element[0].children[0].children[0].childElementCount === 0);
  },

  /**
   * @private
   */
  _setScrollY: function (scroller, y) {
    if (!this._skipScrollUpdate) {
      this.signalTaskStart('waiting for scroll handler');
    }

    // flag it so that handleScroll won't do anything
    this._skipScrollUpdate = true;
    // eslint-disable-next-line no-param-reassign
    scroller.scrollTop = y;

    // update sticky header as needed
    this._handlePinGroupHeader();
  },

  /**
   * Sets the bidi independent position of the horizontal scroll position that
   * is consistent across all browsers.
   * @private
   */
  _setScrollX: function (scroller, x) {
    if (!this._skipScrollUpdate) {
      this.signalTaskStart('waiting for scroll handler');
    }

    // flag it so that handleScroll won't do anything
    this._skipScrollUpdate = true;

    oj.DomUtils.setScrollLeft(scroller, x);
  },

  /**
   * Retrieve the bidi independent position of the horizontal scroll position that
   * is consistent across all browsers.
   * @private
   */
  _getScrollX: function (scroller) {
    return oj.DomUtils.getScrollLeft(scroller);
  },

    /**
     * Validate a set of keys
     * @return {Promise|null} a Promise that resolves to true if one of the keys specified is valid, false otherwise.
     *                        Returns null if it cannot validate the keys.
     * @private
     */
  _validateKeys: function (keys) {
    var self = this;

    for (var i = 0; i < keys.length; i++) {
      // found one of the keys in cache, we are done
      if (this.FindElementByKey(keys[i]) != null) {
        return Promise.resolve(true);
      }
    }

    // need to verify key if we have a DataProvider that supports FetchByKeys
    if (this.m_contentHandler instanceof List.IteratingDataProviderContentHandler) {
      var dataProvider = this.m_contentHandler.getDataProvider();
      if (dataProvider.containsKeys) {
        return new Promise(function (resolve) {
          // IE 11 does not support specifying value in constructor
          var set = new Set();
          keys.forEach(function (key) {
            set.add(key);
          });

          self.signalTaskStart('Checking for keys');
          dataProvider.containsKeys({ keys: set }).then(function (value) {
            resolve(value.results.size > 0);
            self.signalTaskEnd();
          }, function () {
            // something bad happened, treat it as invalid key
            self.signalTaskEnd();
            resolve(false);
          });
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
    return (Math.abs(this._getScrollHeight() - this._getClientHeight()) >= 1 ||
      Math.abs(this._getScrollWidth() - this._getClientWidth()) >= 1);
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
    validateKey = (validateKey === undefined) ? true : validateKey;

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
        var promise = this._validateKeys([position.key]);
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

          return;
        }
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
    if ((!isNaN(x) && isNaN(y)) ||
        (!isNaN(x) && y === scrollTop && x !== this._getScrollX(scroller, x))) {
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
    } else if (y !== scrollTop) {
      // flag it so that handleScroll won't do anything
      this._setScrollY(scroller, y);
      if (!isNaN(x) && x !== this._getScrollX(scroller, x)) {
        this._setScrollX(scroller, x);
      }

      // checks if further scrolling is needed
      scrollTop = scroller.scrollTop;
      // cannot use scrollTop === y, as browser sub-pixel could be off by < 1px
      if (Math.abs(scrollTop - y) >= 1 &&
          this.m_contentHandler.hasMoreToFetch &&
          this.m_contentHandler.hasMoreToFetch()) {
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
      this._setActive($(elem), null, true);
    }
  },
  /**
   * Called by content handler to reset the state of ListView
   * @private
   */
  ClearCache: function () {
    // clear any element dependent cache
    this.m_items = null;
    this.m_groupItems = null;
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
    var top = elem.offsetTop;
    // using average height is good enough to avoid offsetHeight
    var itemHeight = this._getItemHeight();
    var height = isNaN(itemHeight) ? elem.offsetHeight : itemHeight;
    var scrollPosition = this.GetOption('scrollPosition');
    var scrollTop = (scrollPosition == null || isNaN(scrollPosition.y)) ? 0 : scrollPosition.y;
    if (top + height < scrollTop || top > scrollTop + this._getClientHeight()) {
      return false;
    }
    return true;
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
    // eslint-disable-next-line no-undef
    return AnimationUtils.startAnimation(elem, action, effect, this.ojContext);
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
    if (this.m_noDataContent == null && this.IsNodeEditableOrClickable($(event.target))) {
      return false;
    }

    // set the item right click on active
    var parent = $(event.target).closest('.' + this.getItemElementStyleClass());

    // prepare the context menu that have listview specific menu items
    this.PrepareContextMenu(parent);

    if (parent.length > 0 && !this.SkipFocus($(parent[0]))) {
      this.SetCurrentItem($(parent[0]), null);
    }

    var launcher;

    // When user right click on disabled item(non-focusable), this.m_active
    // will not be updated to disabled item so explicitly setting the launcher from event.target.
    if (event.button === 2) {
      launcher = this._findItem($(event.target));
    } else if (this.m_active != null) {
      launcher = this.m_active.elem;
    }

    // if not on any item, then launcher is the root element
    if (launcher == null) {
      launcher = this.element;
    }

    var openOptions = { launcher: launcher, initialFocus: 'menu' };

    if (eventType === 'keyboard') {
      openOptions.position = { my: 'start top', at: 'start bottom', of: launcher };
    }

    this.ojContext._OpenContextMenu(event, eventType, openOptions);
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
    if (this.m_dndContext != null) {
      this.m_dndContext.prepareContextMenu(this.ojContext._GetContextMenu());
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
    return (nodeName.match(/^INPUT|SELECT|OPTION|BUTTON|^A\b|TEXTAREA/) != null);
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
      if (node[0].nodeType === 3) { // 3 is Node.TEXT_NODE
        // eslint-disable-next-line no-param-reassign
        node = node.parent();
      } else {
        var tabIndex = node.attr('tabIndex');
        // listview overrides the tab index, so we should check if the data-oj-tabindex is populated
        var origTabIndex = node.attr('data-oj-tabindex');

        if (tabIndex != null && tabIndex >= 0 &&
            !node.hasClass(this.getFocusedElementStyleClass()) &&
            !node.hasClass('oj-listview-cell-element')) {
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
      var elems = $(DataCollectionUtils.disableAllFocusableElements(elem[0], true,
        excludeActiveElement));

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
    $(elem).find('[' + DataCollectionUtils._DATA_OJ_TABMOD + ']')
      .removeAttr('tabIndex')
      .removeAttr(DataCollectionUtils._DATA_OJ_TABMOD)
      .removeAttr('data-first')
      .removeAttr('data-last');
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

    if (event.relatedTarget == null ||
        !$.contains(this.ojContext.element.get(0),
                    /** @type {Element} */ (event.relatedTarget))) {
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
    this.getListContainer().addClass('oj-focus-ancestor');

    // first time tab into listview, focus on first item
    if (this.m_active == null) {
      // checks whether there's pending click to active, and the focus target is not inside any item (if it is the focus will shift to that item) or it's a unfocusable item
      var item = this._findItem($(event.target));
      if (!this.m_preActive && !this._isFocusBlurTriggeredByDescendent(event) &&
          (item == null || this.SkipFocus(item))) {
        this._initFocus(event);
      }
    } else {
      // focus could be caused by pending click to active
      // do not do this on iOS or Android, otherwise VO/talkback will not work correctly
      // Only one exception is when ever root node gets focus we should highlight active element
      // otherwise vo doesn't follow the focus. ex: when offcanvas is opened,
      // focus will be moved to root node
      if (!this.m_preActive && event.target === this.ojContext.element[0]
          && !this._isFocusBlurTriggeredByDescendent(event)) {
        this.HighlightActive();
        this._focusItem(this.m_active.elem);
      }

      // remove tab index from root and restore tab index on focus item
      this.RemoveRootElementTabIndex();
      this._setTabIndex(this.m_active.elem);
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
      if (emptyText.length > 0) {
        emptyText.attr('tabIndex', 0);
        emptyText.focus();

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
    var agent = oj.AgentUtils.getAgentInfo();
    if (agent.browser === oj.AgentUtils.BROWSER.FIREFOX &&
        parseInt(agent.browserVersion, 10) < 48) {
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
    var agent = oj.AgentUtils.getAgentInfo();
    if (event.relatedTarget == null &&
        agent.browser === oj.AgentUtils.BROWSER.IE &&
        event.target === this.ojContext.element.get(0)) {
      return true;
    }

    return false;
  },

  /**
   * Handler for blur event
   * @param {Event} event the blur event
   * @protected
   */
  HandleBlur: function (event) {
    // NOTE that prior to a fix in Firefox 48, relatedTarget is always null
    // just bail in case if it wasn't supported
    // NOTE also IE11 fires an extra blur event with null relatedTarget, should bail as well
    if (!this._supportRelatedTargetOnBlur() || this._isExtraBlurEvent(event)) {
      return;
    }

    // event.relatedTarget would be null if focus out of page
    // the other check is to make sure the blur is not caused by shifting focus within listview
    if (!this._isFocusBlurTriggeredByDescendent(event) && !this.m_preActive) {
      this._doBlur();
    }

    // remove focus class on blur of expand/collapse icon
    if (this._isExpandCollapseIcon(event.target)) {
      this._focusOutHandler($(event.target));
    }
  },

  /**
   * @private
   */
  _doBlur: function () {
    this.getListContainer().removeClass('oj-focus-ancestor');
    this.UnhighlightActive();

    // remove tab index from focus item and restore tab index on list
    // and remove any aria-labelled by set by card navigation
    if (this.m_active != null) {
      this._resetTabIndex(this.m_active.elem);
      this._removeSkipItemAriaLabel(this.m_active.elem);
    } else {
      var emptyText = this.element.children('.' + this.getEmptyTextStyleClass()).first();
      if (emptyText.length > 0) {
        emptyText.removeAttr('tabIndex');
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
    if (this._recentTouch() || (this.m_dndContext && this.m_dndContext.isDndInProgress())) {
      return;
    }

    var item = this.FindItem(event.target);
    if (item != null && !this.SkipFocus(item)) {
      // have to remember it so we can clear it when listview is detached from DOM
      this.m_hoverItem = item;
      this._highlightElem(item, 'oj-hover');
    }
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
      var keyCode = event.keyCode;
      if (keyCode === this.LEFT_KEY || keyCode === this.RIGHT_KEY) {
        var current = this.m_active.elem;
        if (keyCode === this.LEFT_KEY) {
          if (this.GetState(current) === this.STATE_EXPANDED) {
            this.CollapseItem(current, event, true, this.m_active.key, true, true);
            return;
          }
        } else if (this.GetState(current) === this.STATE_COLLAPSED) {
          this.ExpandItem(current, event, true, this.m_active.key, true, true, true);
          return;
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
    if (event.keyCode === this.ESC_KEY && this.m_keyProcessed) {
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
    if (this.m_dndContext != null && this.m_dragger && (this.m_dragger.get(0) !== event.target)) {
      this.m_dndContext._unsetDraggable(this.m_dragger);
      this.m_dragger = null;
    }
  },

  /**
   * @private
   */
  _isNodeFocusable: function (node) {
    var focusables = ['a', 'input', 'select', 'textarea', 'button', 'object'];

    if (node === null) {
      return false;
    } else if (node.hasAttribute(DataCollectionUtils._DATA_OJ_TABMOD)) {
      return true;
    } else if (focusables.indexOf(node.tagName.toLowerCase()) > -1) {
      return true;
    } else if ($(node).hasClass(this.getItemElementStyleClass())) {
      return false;
    }
    return this._isNodeFocusable(node.parentNode);
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

    // click on item, explicitly pass true on findItem
    // so that it will return non-null value if clickthrough disabled element is encountered
    var item = this._findItem(target, true);
    // we'll still need to set the flag so that the focus do not shift
    if (item != null && this._isClickthroughDisabled(item)) {
      this.m_preActive = true;
      item = null;
    }

    if (item == null || item.length === 0 || this.SkipFocus(item) ||
        target.hasClass('oj-listview-drag-handle')) {
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
    if (this.element[0].contains(document.activeElement) &&
      !item.get(0).contains(document.activeElement) && !this._isNodeFocusable(target[0])) {
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
        effect.offsetX = ((this.m_touchPos.x) - offset.left) + 'px';
        effect.offsetY = ((this.m_touchPos.y) - offset.top) + 'px';
        var groupItem = this.m_preActiveItem.children('.' + this.getGroupItemStyleClass());
        var elem;
        if (groupItem.length > 0) {
          elem = /** @type {Element} */ (groupItem.get(0));
        } else {
          elem = /** @type {Element} */ (this.getFocusItem(this.m_preActiveItem).get(0));
        }
        // we don't really care when animation ends
        this.StartAnimation(elem, action, effect);

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
  _enterActionableMode: function () {
    var current = this.m_active.elem;

    // in case content has been updated under the cover
    this.disableAllTabbableElements(current);

    // re-enable all tabbable elements
    this._enableAllTabbableElements(current);

    // only go into actionable mode if there is something to focus
    var first = current.find('[data-first]');
    if (first.length > 0) {
      this._setActionableMode(true);
    }
  },

  /**
   * Exits actionable mode
   * @private
   */
  _exitActionableMode: function () {
    this._setActionableMode(false);

    // disable all tabbable elements in the item again
    this.disableAllTabbableElements(this.m_active.elem);
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
      var groupItemClass = this.getGroupItemStyleClass();
      var target = $(event.target);
      if (target.hasClass(expandIconClass)) {
        this._collapse(event);
        event.preventDefault();
      } else if (target.hasClass(collapseIconClass)) {
        this._expand(event);
        event.preventDefault();
      } else {
        // click on item
        var item = this._findItem(target);
        if (item == null || item.length === 0 || this.SkipFocus(item)) {
          // one of the following happened:
          // 1) can't find item
          // 2) item cannot be focus
          // 3) target is an oj-component
          // 4) target or one of its ancestors has the oj-clickthrough-disabled marker class
          return;
        }

        if (this._isActionableMode() && this.m_active != null &&
            this.m_active.elem.get(0) !== item.get(0)) {
          // click on item other than current focus item should exit actionable mode
          this._exitActionableMode();
        }

        // make sure listview has focus
        if (!this.getListContainer().hasClass('oj-focus-ancestor')) {
          this.getListContainer().addClass('oj-focus-ancestor');
        }

        // check if selection is enabled
        if (this._isSelectionEnabled() && this.IsSelectable(item[0])) {
          var sourceCapabilityTouch = event.originalEvent.sourceCapabilities &&
            event.originalEvent.sourceCapabilities.firesTouchEvents;
          var isTouch = this._isTouchSupport() && (sourceCapabilityTouch ||
            (this.touchStartEvent != null && this.touchStartEvent.target === event.target));

          if (isTouch) {
            this._handleTouchSelection(item, event);
          } else {
            this.HandleClickSelection(item, event);
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
          // if selection is disable, we'll still need to highlight the active item
          this.HandleClickActive(item, event);
        }

        // click on input element inside item should trigger actionable mode
        if (this._isInputElement(target.get(0))) {
          this._enterActionableMode();
          return;
        }

        // clicking on header will expand/collapse item
        if (this.isExpandable() && target.closest('.' + groupItemClass)) {
          if (this.GetState(item) === this.STATE_COLLAPSED) {
            this._expand(event);
          } else if (this.GetState(item) === this.STATE_EXPANDED) {
            this._collapse(event);
          }
        }
      }
    }
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
    return oj.DomUtils.isTouchSupported();
  },

  /**
   * Whether it is non-window touch device (iOS or Android)
   * @return {boolean} true if it is a non-window touch device
   * @private
   */
  _isNonWindowTouch: function () {
    return this._isTouchSupport() &&
      oj.AgentUtils.getAgentInfo().os !== oj.AgentUtils.OS.WINDOWS;
  },

  /**
   * Returns either the ctrl key or the command key in Mac OS
   * @param {!Object} event
   * @private
   */
  _ctrlEquivalent: function (event) {
    return oj.DomUtils.isMetaKeyPressed(event);
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
   * Determine if click should be processed based on the element.
   * @param {jQuery} elem the element to check
   * @return {boolean} returns true if the element contains the special marker class, false otherwise.
   * @private
   */
  _isClickthroughDisabled: function (elem) {
    return elem.hasClass('oj-clickthrough-disabled');
  },

  /**
   * Find the item element from target, if target contains the oj-clickthrough-disabled class then returns null.
   * @param {jQuery} target the element to check
   * @param {boolean=} retElemOnClickthroughDisabled optional, set to true to force non-null value to return when
   *                   clickthrough-disabled is encountered
   * @return {jQuery|null} the item element or null if click through is disabled for this element or one of its ancestors.
   * @private
   */
  _findItem: function (target, retElemOnClickthroughDisabled) {
    if (target.hasClass(this.getGroupStyleClass())) {
      return null;
    }

    var current = target;
    while (current.length > 0) {
      if (this._isClickthroughDisabled(current)) {
        if (retElemOnClickthroughDisabled) {
          return current;
        }
        return null;
      }

      if (current.hasClass(this.getItemElementStyleClass())) {
        return current;
      }

      current = current.parent();
    }

    return null;
  },

  /**
   * Compute the total top and bottom border width of the list container
   * @return {number} the sum of top and bottom border width of the list container
   * @private
   */
  getListContainerBorderWidth: function () {
    if (this.m_borderWidth == null) {
      this.m_borderWidth = parseInt(this.getListContainer().css('border-top-width'), 10) +
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
      var group = $(elem).children('.' + this.getGroupItemStyleClass()).first();
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
    var top = elem.offsetTop;
    var height = elem.offsetHeight;
    var container = this.getListContainer()[0];
    var containerScrollTop = container.scrollTop;
    var containerHeight = container.offsetHeight;

    // if there's sticky header, make sure the elem is not behind it
    if (this.m_groupItemToPin != null) {
      var headerTop = parseInt(this.m_groupItemToPin.style.top, 10);
      var headerHeight = $(this.m_groupItemToPin).outerHeight();
      if ((top <= headerTop && headerTop < top + height)) {
        offset = ((height + top) - headerTop) / 2;
      } else if ((top >= headerTop && top < headerTop + headerHeight)) {
        offset = ((headerTop + headerHeight) - top) / 2;
      }
    } else if (this.m_closestParent != null) {
      // when native position sticky is used
      var stickyHeader = this.m_closestParent.firstElementChild;
      if (stickyHeader.classList.contains('oj-sticky')) {
        offset = (stickyHeader.offsetTop + stickyHeader.offsetHeight) - top;
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
    var scrollTop = Math.max(0, Math.min(top - offset,
                                         Math.abs((top + height) - containerHeight)));
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
    return this.m_contentHandler.FindElementByKey(key);
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
    return $(elem).hasClass(this.getExpandIconStyleClass()) ||
      $(elem).hasClass(this.getCollapseIconStyleClass());
  },

 /**
  * Determine whether gridlines/dividers should be shown
  * @return {boolean} true if visible, false if hidden
  * @private
  */
  _isGridlinesVisible: function () {
    if (this.m_gridlinesVisible == null) {
      var gridlines = this.GetOption('gridlines');
      this.m_gridlinesVisible = (gridlines.item !== 'hidden');
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
    var gridlines = this._isTopBottomGridlinesVisible();
    var root = this.GetRootElement()[0];
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
   * @param {number} keyCode
   * @return {boolean} true if it's an arrow key, false otherwise
   * @protected
   */
  IsArrowKey: function (keyCode) {
    if (this.isCardLayout()) {
      return (keyCode === this.UP_KEY || keyCode === this.DOWN_KEY ||
              keyCode === this.LEFT_KEY || keyCode === this.RIGHT_KEY);
    }

    return (keyCode === this.UP_KEY || keyCode === this.DOWN_KEY);
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
      this.m_items = this.element.find(selector).filter(function () {
        var isGroup = $(this).parent().hasClass(disclosureStyleClass);
        if (isGroup) {
          return !($(this).parent().parent().hasClass('oj-collapsed'));
        }
        return true;
      }).map(function (index, elem) {
        var parentElement = elem.parentElement;
        if (parentElement && parentElement.classList.contains('oj-animate-add')) {
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
      if (this.m_contentHandler.IsHierarchical() &&
          item.parent().hasClass(this.getGroupStyleClass())) {
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
   * @param {number} keyCode description
   * @param {boolean} isExtend
   * @param {Event} event the DOM event causing the arrow keys
   * @protected
   */
  HandleArrowKeys: function (keyCode, isExtend, event) {
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

    switch (keyCode) {
      case this.UP_KEY:
        if (this.isCardLayout() && $(current).hasClass(this.getItemStyleClass())) {
          this._gotoItemAbove(current, isExtend, event);
        } else {
          this._gotoPrevItem(current, isExtend, event);
        }

        // according to James we should still consume the event even if list view did not perform any action
        processed = true;
        break;
      case this.DOWN_KEY:
        if (this.isCardLayout() && $(current).hasClass(this.getItemStyleClass())) {
          this._gotoItemBelow(current, isExtend, event);
        } else {
          this._gotoNextItem(current, isExtend, event);
        }

        // according to James we should still consume the event even if list view did not perform any action
        processed = true;
        break;
      case this.LEFT_KEY:
      case this.RIGHT_KEY:
        if (this.isCardLayout()) {
          if (this.ojContext._GetReadingDirection() === 'rtl') {
            // eslint-disable-next-line no-param-reassign
            keyCode = (keyCode === this.LEFT_KEY) ? this.RIGHT_KEY : this.LEFT_KEY;
          }

          if (keyCode === this.LEFT_KEY) {
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
      root.addClass('oj-helper-hidden-accessible')
        .attr('id', id);
      this.getListContainer().append(root); // @HTMLUpdateOK
      this.m_skipAriaLabelText = root;
    }
    this.m_skipAriaLabelText.text(this.ojContext
                                  .getTranslatedString('accessibleNavigateSkipItems',
                                                       { numSkip: count }));

    var focusElem = this.getFocusItem(next);
    // make sure it has an id for aria-labelledby
    focusElem.uniqueId()
      .attr('aria-labelledby', id + ' ' + focusElem.prop('id'));
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
      if (parent.hasClass(this.getGroupStyleClass()) &&
          parent.parent().hasClass(this.getItemElementStyleClass())) {
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
      numOfItemSkip = (items.length - 1) - index;
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
    return (this.m_keyMode === 'actionable');
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
    return (this._rootTabIndexSet || parseInt(root.attr('tabIndex'), 10) !== -1);
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
   * @param {jQuery} item the list item
   * @return {jQuery} see above for what's get returned
   * @private
   */
  getSingleFocusableElement: function (item) {
    var selector = 'a, input, select, textarea, button';
    var childElements = item.children(selector);

    if (childElements.length === 1 && // check for only one focusbale child
        childElements.first().find(selector).length === 0) {
      // check to ensure no nested focusable elements.
      return childElements.first();
    }
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

      if ((this.m_active == null) || key !== this.m_active.key) {
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

        active = { key: key, elem: item };
        this.m_active = active;

        // for touch, set draggable when item becomes active
        if (this._shouldDragSelectedItems() && this._isTouchSupport()) {
          this.m_dndContext._setDraggable(item);
        }

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
    this.getFocusItem(item).focus();
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

    if (event != null && active != null && active !== event.target &&
        active.contains(event.target)) {
      return;
    }

    this.SetCurrentItem(item, event,
                        this.ShouldUseGridRole() ? event.target !== item.get(0) : true);
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
      if (selection == null || selection.length === 0) {
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
    return (this.GetOption('selectionMode') !== 'none');
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
    return (this.GetOption('selectionMode') === 'multiple');
  },

  /**
   * Check whether the item is selectable
   * @param {Element} item the item element
   * @return {boolean} true if item is selectable
   * @protected
   */
  IsSelectable: function (item) {
    var focusItem = this.getFocusItem($(item)).get(0);
    return focusItem.hasAttribute('aria-selected');
  },

  /**
   * Filter the array of selection.  Remove any items that are not selectable, or if there are more than one items
   * when selectionMode is single.
   * @param {Array|Set} selection array of selected items
   * @return {Array} filtered array of items
   * @private
   */
  _filterSelection: function (selection) {
    var filtered = [];
    selection.forEach(function (key) {
      var elem = this.FindElementByKey(key);
      if (elem == null || (elem != null && this.IsSelectable(elem))) {
        filtered.push(key);
      }
    }, this);

    return filtered;
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

    var selection = KeySet.KeySetUtils.toArray(newValue);

    // check if the value has actually changed, based on key
    // firstSelectedItem should never be null and should always have 'key'
    var firstSelectedItem = this.GetOption('firstSelectedItem');

    // NavList firstSelectedItem would be undefined
    if (firstSelectedItem != null) {
      // first condition is if new value is empty and existing item is non null
      // second condition is if new value is not empty and does not match the existing item
      if ((selection.length === 0 && firstSelectedItem.key != null) ||
          (!(selection[0] === firstSelectedItem.key ||
             oj.Object.compareValues(selection[0], firstSelectedItem.key)))) {
        // update firstSelectedItem also
        if (selection.length > 0) {
          value = {
            key: selection[0],
            data: firstSelectedItemData != null ?
              firstSelectedItemData : this.getDataForVisibleItem({ key: selection[0] })
          };
        }

        this.SetOption('firstSelectedItem', value, {
          _context: {
            originalEvent: event,
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
    if (this._isMultipleSelection()) {
      if (!ctrlKey && !shiftKey) {
        this.SelectAndFocus(item, event);
      } else if (!ctrlKey && shiftKey) {
        // active item doesn't change in this case
        this._extendSelection(item, event);
      } else {
        this._augmentSelectionAndFocus(item, event);
      }
    } else {
      this.SelectAndFocus(item, event);
    }
  },

  /**
   * Handles tap to select multiple cells/rows
   * @param {jQuery} item the item clicked on
   * @param {Event} event the click event
   * @private
   */
  _handleTouchSelection: function (item, event) {
    if (this._isMultipleSelection()) {
      if (event.shiftKey) {
        // for touch device with keyboard support
        this._extendSelection(item, event);
      } else {
        // treat this as like ctrl+click
        this._augmentSelectionAndFocus(item, event);
      }
    } else {
      this.SelectAndFocus(item, event);
    }
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
    this.m_selectionFrontier = (newSelectionFrontier === undefined) ? null : newSelectionFrontier;
  },

  /**
   * Selects the focus on the specified element
   * Select and focus is an asynchronus call
   * @param {jQuery} item the item clicked on
   * @param {Event} event the click event
   * @protected
   */
  SelectAndFocus: function (item, event) {
    var key = this.GetKey(item[0]);
    var selected = this.GetOption('selected');
    var exists = selected.has(key);

    // check if there's only one item selected and selection is required
    if (exists && selected.values && selected.values().size === 1 && this._isSelectionRequired()) {
      return;
    }

    // if it's already selected, deselect it and update options
    this._clearSelection(exists);

    if (!exists) {
      // add the elem to selection
      this._augmentSelectionAndFocus(item, event, selected.clear());
    }
  },

  /**
   * Shift+click to extend the selection
   * @param {jQuery} item the item to extend selection to
   * @param {Event} event the key event
   * @private
   */
  _extendSelection: function (item, event) {
    if (this.m_active == null) {
      return;
    }

    // checks if selection has changed
    var current = this.m_selectionFrontier;
    if (current === item) {
      return;
    }

    // remove focus style on the item click on
    this._unhighlightElem(item, 'oj-focus');

    this._extendSelectionRange(this.m_active.elem, item, event);
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

    if (event != null && (currentActive == null || currentActive === event.target ||
                          !currentActive.contains(event.target))) {
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

    var keyCode = event.keyCode;
    var current = this.m_active.elem;

    if (this._isActionableMode()) {
      // Esc key goes to navigation mode
      if (keyCode === this.ESC_KEY) {
        this._exitActionableMode();

        // force focus back on the active cell
        this.HighlightActive();
        this._focusItem(current);

        // make sure active item has tabindex set
        this._setTabIndex(current);
        processed = true;
      } else if (keyCode === this.TAB_KEY) {
        var focusElem = this.getFocusItem(current).get(0);
        if (event.shiftKey) {
          processed = DataCollectionUtils.handleActionablePrevTab(event, focusElem);
        } else {
          processed = DataCollectionUtils.handleActionableTab(event, focusElem);
        }
        // otherwise don't process and let browser handles tab
      }
    } else if (keyCode === this.F2_KEY) {
      // F2 key goes to actionable mode
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
        current.removeClass('oj-focus-highlight');
      }
    } else if (keyCode === this.SPACE_KEY && this._isSelectionEnabled()) {
      ctrlKey = this._ctrlEquivalent(event);
      shiftKey = event.shiftKey;
      if (shiftKey && !ctrlKey && this.m_selectionFrontier != null &&
          this._isMultipleSelection()) {
        // selects contiguous items from last selected item to current item
        this._extendSelectionRange(this.m_selectionFrontier, this.m_active.elem, event, true);
      } else {
        // toggle selection, deselect previous selected items
        this.ToggleSelection(event, ctrlKey && !shiftKey && this._isMultipleSelection(), false);
      }
      processed = true;
    } else if (keyCode === this.ENTER_KEY && this._isSelectionEnabled()) {
      // selects it if it's not selected, do nothing if it's already selected
      this.ToggleSelection(event, false, true);
    } else if (this.IsArrowKey(keyCode)) {
      ctrlKey = this._ctrlEquivalent(event);
      shiftKey = event.shiftKey;
      if (!ctrlKey) {
        processed = this.HandleArrowKeys(keyCode,
                                         (shiftKey && this._isSelectionEnabled() &&
                                          this._isMultipleSelection()),
                                         event);
      }
    } else if (keyCode === this.TAB_KEY) {
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
      return (this.m_disclosing.indexOf(key) > -1);
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
      this.defaultOptions =
        ThemeUtils.parseJSONFromFontFamily(this.getOptionDefaultsStyleClass());
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
      return (!this.isExpandable() &&
              expanded instanceof oj._ojListViewExpandedKeySet) ? true :
              (expanded.isAddAll() && expanded.has(key));
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
    this.m_contentHandler.Expand(item, function (groupItem) {
      this._expandSuccess(groupItem, animate, event, ui, fireEvent);
    }.bind(this));

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
    item.children('.' + groupItemStyleClass)
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
    groupItem.parentsUntil('ul.oj-component-initnode', 'ul.' + this.getGroupStyleClass())
      .each(function () {
        var maxHeight = parseInt($(this).css('maxHeight'), 10);
        if (maxHeight > 0) {
          $(this).css('maxHeight', (maxHeight + delta) + 'px');
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
    groupItem.removeClass(this.getGroupCollapseStyleClass())
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
    item.find('.' + expandClass).first().removeClass(expandClass).addClass(collapseClass);

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
    groupItem.removeClass(this.getGroupExpandStyleClass())
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
    return this._isGridlinesVisible() ? 'oj-listview-item' : 'oj-listview-item gridline-hidden';
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
    return 'oj-listview-group';
  },

  /**
   * To be change by NavList.  Access by ContentHandler.
   * @return {string} the group expand style class
   */
  getGroupExpandStyleClass: function () {
    return 'oj-listview-collapsible-transition';
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
   * @return {string} the option defaults style class
   */
  getOptionDefaultsStyleClass: function () {
    return 'oj-listview-option-defaults';
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
    var browser = oj.AgentUtils.getAgentInfo().browser;
    return (browser !== oj.AgentUtils.BROWSER.IE && browser !== oj.AgentUtils.BROWSER.EDGE);
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
      if (this.m_contentHandler.hasMoreToFetch() &&
          ((scrollTop + this._getClientHeight() + Math.abs(delta)) >= scrollHeight)) {
        // eslint-disable-next-line no-param-reassign
        scroller.scrollTop = scrollHeight;
        event.preventDefault();
      }
    } else if (scrollTop > 0 && (scrollTop + delta) <= 0) {
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
    var items = isHierData ? this._getItemsCache() :
      $(this._getRootNodeForItems()).children('li.' + this.getItemElementStyleClass());
    if (items == null || items.length === 0) {
      return null;
    }

    // if the previous scroll position is relatively close to the current one
    // we'll use the previous index as the starting point
    var index;
    var prevScrollPosition = this.GetOption('scrollPosition');
    if (Math.abs(prevScrollPosition.y - currScrollTop) < this.MINIMUM_ITEM_HEIGHT &&
        prevScrollPosition.key != null && !isNaN(prevScrollPosition.index)) {
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

      found = (diff < 1) || (forward ? scrollTop <= offsetTop : scrollTop >= offsetTop);
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
    return this.isCardLayout() ?
      this.element.get(0).firstElementChild.firstElementChild :
      this.element.get(0);
  },

  /**
   * Gets the item height. Will set it if it is NaN
   * @return {number} item height
   * @private
   */
  _getItemHeight: function () {
    if (isNaN(this.m_itemHeight)) {
      var firstItem;
      var isHierData = this.m_contentHandler.IsHierarchical();
      if (isHierData) {
        // could be a group
        firstItem = this.element.children('li.' + this.getItemElementStyleClass()).first();
        if (firstItem.length > 0) {
          this.m_itemHeight = firstItem.get(0).firstElementChild.offsetHeight;
        }
      } else {
        firstItem =
          $(this._getRootNodeForItems()).children('li.' + this.getItemStyleClass()).first();
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
          var parent = elem.parentNode;
          if (parent !== this.element.get(0)) {
            this.m_closestParent = parent.parentNode;
            scrollPosition.parent = this.GetKey(this.m_closestParent);
          }
          scrollPosition.key = this.GetKey(result.elem);
          scrollPosition.index = $(parent).children().index(elem);
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
    var offsetTop = this.element.get(0).offsetTop;
    if (!isNaN(this.m_elementOffset) && this.m_elementOffset !== offsetTop) {
      return Math.max(0, elem.offsetTop - offsetTop);
    }

    return elem.offsetTop;
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
   * Scroll handler
   * @private
   */
  _handleScroll: function (event) {
    // since we are calling it from requestAnimationFrame, ListView could have been destroyed already
    // do not handle scroll for NavList
    if (this.m_contentHandler == null || !this.ShouldUseGridRole()) {
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
      if (data != null && ((typeof oj.TableDataSource !== 'undefined' && data instanceof oj.TableDataSource) ||
        (typeof oj.TreeDataSource !== 'undefined' && data instanceof oj.TreeDataSource))) {
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
    this.ojContext._off(scrollElem, 'scroll');
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

    this.ojContext._on(scrollElem, {
      scroll: function (event) {
        // throttle the event using requestAnimationFrame for performance reason
        // don't update if scroll is triggered by listview internally setting scrollLeft/scrollTop
        if (!self._skipScrollUpdate && !self.m_ticking) {
          window.requestAnimationFrame(function () {
            self._handleScroll(event);
            self.m_ticking = false;
          });

          self.m_ticking = true;
        }

        if (self._skipScrollUpdate) {
          self.signalTaskEnd();
        }

        self._skipScrollUpdate = false;
      }
    });

    // only do this for high-water mark scrolling, other cases we have (and should not care) no knowledge about the scroller
    if (this.isLoadMoreOnScroll()) {
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
   * Whether group header should be pin
   * @return {boolean} true if group header should be pin or false otherwise
   * @private
   */
  _isPinGroupHeader: function () {
    return (this.GetOption('groupHeaderPosition') !== 'static' &&
            this.m_contentHandler.IsHierarchical());
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
        this.m_groupItemToPin.style.top = (next.offsetTop - pinHeaderHeight) + 'px';
        return;
      }

      this.m_groupItemToPin.style.top = scrollTop + 'px';
    }
  },

  /**
   * Gets the scroller element, which is either the listview container or the scroller element
   * specified in scrollPolicyOptions
   * @return {Element} the scroller element
   * @private
   */
  _getScroller: function () {
    var options = this.GetOption('scrollPolicyOptions');
    if (options != null) {
      var scroller = options.scroller;
      if (scroller != null) {
        return scroller;
      }
    }

    return this.getListContainer().get(0);
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
    if (this._isPinGroupHeader() &&
        this._isPositionStickySupported() &&
        newScrollTop < currentScrollTop) {
      newScrollTop = Math.max(0, ((newScrollTop - groupHeader.parentNode.offsetHeight) +
                                  groupHeader.offsetHeight));
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
});


/* global KeySet:false, DataCollectionUtils:false, Components:false, ThemeUtils:false */

/**
 * @ojcomponent oj.ojListView
 * @augments oj.baseComponent
 * @since 1.1.0
 *
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
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
 * @classdesc
 * <h3 id="listViewOverview-section">
 *   JET ListView Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#listViewOverview-section"></a>
 * </h3>
 *
 * <p>Description: The JET ListView enhances a HTML list element into a themable, WAI-ARIA compliant, mobile friendly component with advance interactive features.</p>
 *
 * <h3 id="data-section">
 *   Data
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
 * </h3>
 * <p>The JET ListView gets its data in three different ways.  The first way is from a DataProvider/TableDataSource.  There are several types of DataProvider/TableDataSource
 * that are available out of the box:</p>
 * <ul>
 * <li>oj.ArrayDataProvider</li>
 * <li>oj.CollectionTableDataSource</li>
 * <li>oj.PagingTableDataSource</li>
 * </ul>
 * <p>Note that TableDataSource has been deprecated, please find the equivalent DataProvider implementation.</p>
 *
 * <p><b>oj.ArrayDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, ListView will automatically react
 * when items are added or removed from the array.  See the documentation for oj.ArrayDataProvider for more details on the available options.</p>
 *
 * <p><b>oj.CollectionTableDataSource</b> - Use this when oj.Collection is the model for the underlying data.  Note that the ListView will automatically react to model event from
 * the underlying oj.Collection.  See the documentation for oj.CollectionTableDataSource for more details on the available options.</p>
 *
 * <p><b>oj.PagingTableDataSource</b> - Use this when the ListView is driven by an associating ojPagingControl.  See the documentation for oj.PagingTableDataSource for more
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
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 *
 * <p>Application should specify a value for the aria-label attribute with a meaningful description of the purpose of this list.
 *
 * <p>Application must ensure that the context menu is available and setup with the
 * appropriate clipboard menu items so that keyboard-only users are able to reorder items
 * just by using the keyboard.
 *
 * <p>Note that ListView uses the grid role and follows the <a href="https://www.w3.org/TR/wai-aria-practices/examples/grid/LayoutGrids.html">Layout Grid</a> design as outlined in the <a href="https://www.w3.org/TR/wai-aria-practices/#grid">grid design pattern</a>.
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
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
 *    events or overriding action specific style classes on the animated item.  See the documentation of <a href="oj.AnimationUtils.html">oj.AnimationUtils</a>
 *    class for details.</p>
 *
 * <p>The following are actions and their corresponding sass variables in which applications can use to customize animation effects.
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Action</th>
 *       <th>Sass Variable</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>add</kbd></td>
 *       <td>$listViewAddAnimation</td>
 *       <td>When a new item is added to the oj.TableDataSource associated with ListView.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>remove</kbd></td>
 *       <td>$listViewRemoveAnimation</td>
 *       <td>When an existing item is removed from the oj.TableDataSource associated with ListView.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>update</kbd></td>
 *       <td>$listViewUpdateAnimation</td>
 *       <td>When an existing item is updated in the oj.TableDataSource associated with ListView.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>expand</kbd></td>
 *       <td>$listViewExpandAnimation</td>
 *       <td>When user expands a group item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>collapse</kbd></td>
 *       <td>$listViewCollapseAnimation</td>
 *       <td>When user collapses a group item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>pointerUp</kbd></td>
 *       <td>$listViewPointerUpAnimation</td>
 *       <td>When user finish pressing an item (on touch).</td>
 *     </tr>
 *   </tbody>
 * </table>
 */
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
     * The data source for ListView.  Must be of type oj.TableDataSource, oj.TreeDataSource, oj.DataProvider
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
     * @ojsignature [{target: "Type", value: "oj.DataProvider<K, D>"},
     *               {target: "Type", value: "oj.TableDataSource|oj.TreeDataSource|oj.DataProvider", consumedBy:"js"}]
     */
    data: null,
    /**
     * Enable drag and drop functionality.<br><br>
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
       * @alias dnd.drag
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
       * @alias dnd.drop
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
       * @alias dnd.reorder
       * @memberof! oj.ojListView
       * @instance
       * @type {Object}
       */
      reorder: {
        /**
         * Enable or disable reordering the items within the same listview using drag and drop.<br><br>
         * Specify 'enabled' to enable reordering.  Setting the value 'disabled' or setting the <code class="prettyprint">"dnd"</code> property
         * to <code class="prettyprint">null</code> (or omitting it), disables reordering support.
         *
         * @ojshortdesc Specify the item reordering functionality. See the Help documentation for more information.
         * @expose
         * @alias dnd.reorder.items
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
    expanded: new oj._ojListViewExpandedKeySet(),
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
       * <p>The default value varies by theme and is determined as follows:
       * <ul>
       *   <li>if <code class="prettyprint">$listViewGridlinesItemOptionDefault</code> is set in the current theme as seen in the example below, then that value is the gridlines default.</li>
       *   <li>Else, the default value is <code class="prettyprint">"visible"</code>.</li>
       * </ul>
       * <p>Once a value has been set on this attribute, that value applies regardless of theme.
       *
       * @ojshortdesc Specifies whether the grid lines should be visible.
       * @expose
       * @alias gridlines.item
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
       * @example <caption>Set the default in the theme (SCSS) :</caption>
       * $listViewGridlinesItemOptionDefault: hidden !default;
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
       * @property {oj.DataProvider<K, D>} datasource the data source/data provider
       * @property {number} index the zero based index of the item, relative to its parent
       * @property {K} key the key of the item
       * @property {D} data the data object of the item
       * @property {Element} parentElement the item DOM element
       * @property {number=} depth the depth of the item
       * @property {K=} parentKey the key of the parent item
       * @property {boolean=} leaf whether the item is a leaf
       * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
       */
      /**
       * Whether the item is focusable.  An item that is not focusable cannot be clicked on or navigated to.
       * See <a href="#context-section">itemContext</a> in the introduction to see the object passed into the focusable function.
       *
       * @ojshortdesc Specifies whether the item can receive keyboard focus. See the Help documentation for more information.
       * @expose
       * @alias item.focusable
       * @memberof! oj.ojListView
       * @instance
       * @type {boolean|function(Object):boolean}
       * @ojsignature { target: "Type",
       *                value: "?((param0: oj.ojListView.ItemContext<K,D>) => boolean)|boolean",
       *                jsdocOverride: true}
       * @default true
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
       * @alias item.renderer
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
       * @alias item.selectable
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
    },
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
     * Lastly, when a re-rendered is triggered by a <a href="oj.DataProviderRefreshEvent.html">refresh event</a> from the DataProvider,
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
     * @property {number=} x the horizontal position in pixels
     * @property {number=} y the vertical position in pixels
     * @property {number=} index the zero-based index of the item.  If <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll'
     * and the index is greater than maxCount set in <a href="#scrollPolicyOptions">scrollPolicyOptions</a>, then it will scroll and fetch
     * until the end of the list is reached and there's no more items to fetch.
     * @property {any=} parent the key of the parent where the index is relative to.  If not specified, then the root is assumed
     * @property {any=} key the key of the item.  If DataProvider is used for <a href="#data">data</a> and the key does not exists in the
     * DataProvider, then the value is ignored.  If DataProvider is not used then ListView will fetch and scroll until the item is found
     * or the end of the list is reached and there's no more items to fetch.
     * @property {number=} offsetX the horizontal offset in pixels relative to the item identified by key/index.
     * @property {number=} offsetY the vertical offset in pixels relative to the item identified by key/index.
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
    selected: new oj.KeySetImpl(),
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
     * available, the ListView's underlying <a href="oj.DataProvider.html">DataProvider</a> will be queried. This will only occur if the
     * data provider supports <a href="oj.DataProvider.html#getCapability">getCapability</a>, and returns a
     * <a href="oj.FetchByKeysCapability.html#implementation">fetchByKeys capability implementation</a> of <code class="prettyprint">lookup</code>.
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
     * @property {string} action the action that starts the animation.  See <a href="#animation-section">animation</a> section for a list of actions.
     * @property {Element} element the target of animation.
     * @property {function():void} endCallback if the event listener calls event.preventDefault to cancel the default animation, it must call the endCallback function when it finishes its own animation handling and when any custom animation ends.
     */
    animateStart: null,
    /**
     * Triggered when the default animation of a particular action has ended.  Note this event will not be triggered if application cancelled the default animation on animateStart.
     *
     * @ojshortdesc Triggered when the default animation of a particular action has ended.
     * @expose
     * @event
     * @memberof oj.ojListView
     * @instance
     * @property {string} action the action that started the animation.  See <a href="#animation-section">animation</a> section for a list of actions.
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
     * Triggered when the paste action is performed on an item via context menu or keyboard shortcut.
     *
     * @ojshortdesc Triggered when the paste action is performed on an item.
     * @expose
     * @event
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
      if (expanded instanceof oj._ojListViewExpandedKeySet) {
        this.options.expanded = 'auto';
      }
    }

    opts = $.extend(this.options, opts);

    this.listview = new oj._ojListView();
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
        this.listview.adjustScrollPositionValueOnRefresh();
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
      valid = (value === 'none' || value === 'single' || value === 'multiple');
    } else if (key === 'drillMode') {
      valid = (value === 'collapsible' || value === 'none');
    } else if (key === 'scrollPolicy') {
      valid = (value === 'auto' || value === 'loadMoreOnScroll' || value === 'loadAll');
    } else if (key === 'groupHeaderPosition') {
      valid = (value === 'static' || value === 'sticky');
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
   * @ojdeprecated {since:"3.0.0", description:'Implements your own IndexerModel or use the <a href="oj.IndexerModelTreeDataSource.html">IndexerModelTreeDataSource</a> class instead.'}
   * @instance
   * @return {Object} ListView's IndexerModel to be used with the ojIndexer
   */
  getIndexerModel: function () {
    if (this.indexerModel == null && oj.ListViewIndexerModel) {
      this.indexerModel = new oj.ListViewIndexerModel(this.listview);
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
   */
  scrollToItem: function (item) {
    this.listview.scrollToItem(item);
  },

  //* * @inheritdoc */
  _CompareOptionValues: function (option, value1, value2) {
    switch (option) {
      case 'currentItem':
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

  // Slots

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
   * @ojslotitemprops oj.ojListView.ItemTemplateContext
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
   *
   * @example <caption>Initialize the ListView with a noData slot specified:</caption>
   * &lt;oj-list-view>
   *   &lt;template slot='noData'>
   *     &lt;span>&lt;oj-button>Add item&lt;/span>
   *   &lt;template>
   * &lt;/oj-list-view>
   */

    // Fragments
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
 *       <td>Enters Actionable mode.  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item.</td>
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
 *       <td>Marks the selected items to move if dnd.reorder is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl+C</kbd></td>
 *       <td>Marks the selected items to copy if dnd.reorder is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl+V</kbd></td>
 *       <td>Paste the items that are marked to directly before the current item (or as the last item if the current item is a folder).</td>
 *     </tr>
 *     <tr>
 *       <td rowspan = "2" nowrap>Group Item</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Collapse the current item if it is expanded and is collapsible.  For non-hierarchical data, do nothing.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Expand the current item if it has children and is expandable.  For non-hierarchical data, do nothing.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojListView
 */

/**
 * {@ojinclude "name":"ojStylingDocIntro"}
 *
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
 *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-clickthrough-disabled</td>
 *       <td>Use on any element inside an item where you do not want ListView to process the click event.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-focus-highlight</td>
 *       <td>{@ojinclude "name":"ojFocusHighlightDoc"}</td>
 *     </tr>
 *     <tr>
 *       <td>oj-full-width</td>
 *       <td>Use when ListView occupies the entire width of the page.
 *           Removes left and right borders in card-layout mode and adjust positioning of cards to improve visual experience.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-listview-card-layout</td>
 *       <td>Shows items as cards and lay them out in a grid.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-listview-item-layout</td>
 *       <td>Use when the page author overrides the default styling on the item root element (&lt;LI&gt;) and wants to apply the item style on some other element.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojListView
 */
});

// ////////////////     SUB-IDS     //////////////////

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
 * @typedef {Object} oj.ojListView.ItemTemplateContext
 * @property {Element} componentElement The &lt;oj-list-view> custom element
 * @property {Object} data The data for the current item being rendered
 * @property {number} index The zero-based index of the current item
 * @property {any} key The key of the current item being rendered
 * @property {number} depth The depth of the current item (available when hierarchical data is provided) being rendered. The depth of the first level children under the invisible root is 1.
 * @property {boolean} leaf True if the current item is a leaf node (available when hierarchical data is provided).
 * @property {any} parentkey The key of the parent item (available when hierarchical data is provided). The parent key is null for root nodes.
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
 * The element which listview uses to determine the scroll position as well as the maximum scroll position.  For example in a lot of mobile use cases where ListView occupies the entire screen, developers should set the scroller option to document.documentElement.
 * @expose
 * @name scrollPolicyOptions.scroller
 * @ojshortdesc The element used to determine the scroll position as well as the maximum scroll position. See the Help documentation for more information.
 * @memberof! oj.ojListView
 * @instance
 * @type {Element}
 * @default null
 * @ojsignature { target: "Type",
 *                value: "?"}
 */

// Set theme-based defaults
Components.setDefaultOptions({
  ojListView: {
    gridlines: Components.createDynamicPropertyGetter(function () {
      return { item: (ThemeUtils.parseJSONFromFontFamily('oj-listview-option-defaults') || {}).gridlines.item };
    })
  }
});


/* global __oj_list_view_metadata:false */

(function () {
  __oj_list_view_metadata.extension._WIDGET_NAME = 'ojListView';
  __oj_list_view_metadata.extension._INNER_ELEM = 'ul';
  __oj_list_view_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['aria-label', 'aria-labelledby'];
  oj.CustomElementBridge.register('oj-list-view', { metadata: __oj_list_view_metadata });
}());

});