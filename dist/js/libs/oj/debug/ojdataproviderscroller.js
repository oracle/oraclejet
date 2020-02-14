/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'require', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojcomponentcore', 'ojs/ojlogger', 'ojs/ojdatacollection-common', 'ojs/ojdomscroller'], function(oj, $, localRequire, Context, Config, Components, Logger, DataCollectionUtils)
{
  "use strict";


/* global Promise:false, Config:false, Context:false */

/**
 * Base class for IteratingDataProviderContentHandler and TreeDataProviderContentHandler
 * Handler for DataProvider generated content
 * @constructor
 * @ignore
 */
var DataProviderContentHandler = function (widget, root, data) {
  this.m_root = root;
  this.m_widget = widget;

  this.m_fetching = false;

  this.setDataProvider(data);
  this.Init();
};

// Subclass from oj.Object
oj.Object.createSubclass(DataProviderContentHandler, oj.Object, 'DataProviderContentHandler');

/**
 * Initializes the instance.
 * @export
 */
DataProviderContentHandler.prototype.Init = function () {
  DataProviderContentHandler.superclass.Init.call(this);
};

/**
 * Handles when the listview is shown due to for example CSS changes (inside a dialog)
 */
DataProviderContentHandler.prototype.notifyShown = function () {
  // by default do nothing, to be override by subclass
};

/**
 * Handles when the listview is re-attached to the DOM (ex: when a children of CCA gets re-attached from slotting)
 */
DataProviderContentHandler.prototype.notifyAttached = function () {
  // by default do nothing, to be override by subclass
};

/**
 * Cleanse all items under the root node
 */
DataProviderContentHandler.prototype.cleanItems = function (templateEngine, parent) {
  if (templateEngine === undefined) {
    // eslint-disable-next-line no-param-reassign
    templateEngine = this.getTemplateEngine();
  }

  if (parent === undefined) {
    // eslint-disable-next-line no-param-reassign
    parent = this.m_root;
  }

  if (templateEngine && parent) {
    var children = parent.childNodes;
    for (var i = 0; i < children.length; i++) {
      templateEngine.clean(children[i]);
    }
  }
};

/**
 * Destroy the content handler
 * @protected
 */
DataProviderContentHandler.prototype.Destroy = function (completelyDestroy) {
  // this.m_root was changed in RenderContent
  if (this.m_superRoot != null) {
    this.m_root = this.m_superRoot;
  }

  this.cleanItems();
  if (completelyDestroy) {
    $(this.m_root).empty(); // @HTMLUpdateOK
  }
  this.m_widget = null;
  this.m_root = null;
  this.m_superRoot = null;
};

/**
 * Determines whether the content handler is in a ready state
 * @return {boolean} true if there's no outstanding fetch, false otherwise.
 * @protected
 */
DataProviderContentHandler.prototype.IsReady = function () {
  return !this.m_fetching;
};

/**
 * Sets any aria attributes on the root element
 * @protected
 */
DataProviderContentHandler.prototype.setRootAriaProperties = function () {
  if (this.shouldUseGridRole()) {
    this.m_root.setAttribute('role', 'grid');
  } else if (this.IsHierarchical()) {
    this.m_root.setAttribute('role', 'tree');
  } else {
    this.m_root.setAttribute('role', 'listbox');
  }
};

/**
 * Renders the content inside the list
 * @protected
 */
DataProviderContentHandler.prototype.RenderContent = function () {
  this.signalTaskStart('rendering content'); // signal method task start

  this.setRootAriaProperties();
  this.fetchRows(false);
  this.signalTaskEnd(); // signal method task end
};

/**
 * Retrieve the key given the item element
 * @param {Element} element
 * @return {Object|null}
 * @protected
 */
DataProviderContentHandler.prototype.GetKey = function (element) {
  // should be in the element
  return element.key;
};

DataProviderContentHandler.prototype.FindElementByKey = function (key) {
  var children = $(this.m_root).find('.' + this.m_widget.getItemElementStyleClass());
  for (var i = 0; i < children.length; i++) {
    var elem = children[i];
    // use == for the string number compare case
    // eslint-disable-next-line eqeqeq
    if (key == this.GetKey(elem) || oj.Object.compareValues(key, this.GetKey(elem))) {
      return elem;
    }
  }

  return null;
};

DataProviderContentHandler.prototype.getDataProvider = function () {
  return this.m_dataProvider;
};

/**
 * @protected
 */
DataProviderContentHandler.prototype.setDataProvider = function (dataProvider) {
  this._removeDataSourceEventListeners();

  if (dataProvider != null) {
    this.m_handleModelMutateEventListener = this.handleModelMutateEvent.bind(this);
    this.m_handleModelRefreshEventListener = this.handleModelRefreshEvent.bind(this);

    dataProvider.addEventListener('mutate', this.m_handleModelMutateEventListener);
    dataProvider.addEventListener('refresh', this.m_handleModelRefreshEventListener);
  }

  this.m_dataProvider = dataProvider;
};

/**
 * Remove data source event listeners
 * @private
 */
DataProviderContentHandler.prototype._removeDataSourceEventListeners = function () {
  var dataProvider = this.getDataProvider();
  if (dataProvider != null) {
    dataProvider.removeEventListener('mutate', this.m_handleModelMutateEventListener);
    dataProvider.removeEventListener('refresh', this.m_handleModelRefreshEventListener);

    // If dataProvider is a TableDataSourceAdapter, call destroy on it also to remove its listeners
    if (oj.TableDataSourceAdapter && dataProvider instanceof oj.TableDataSourceAdapter) {
      dataProvider.destroy();
    }
  }
};

/**
 * Initiate loading of the template engine.  An error is thrown if the template engine failed to load.
 * @return {Promise} resolves to the template engine, or null if:
 *                   1) there's no need because no item template is specified
 *                   2) a renderer is present which takes precedence
 * @protected
 */
DataProviderContentHandler.prototype.loadTemplateEngine = function () {
  var self = this;

  if (this.m_widget.getItemTemplate() != null && this.m_widget._getItemRenderer() == null) {
    return new Promise(function (resolve) {
      Config.__getTemplateEngine().then(function (engine) {
        self.m_engine = engine;
        resolve(engine);
      }, function (reason) {
        throw new Error('Error loading template engine: ' + reason);
      });
    });
  }

  return Promise.resolve(null);
};

/**
 * Retrieve the template engine, returns null if it has not been loaded yet
 */
DataProviderContentHandler.prototype.getTemplateEngine = function () {
  return this.m_engine;
};

// eslint-disable-next-line no-unused-vars
DataProviderContentHandler.prototype.fetchRows = function (forceFetch) {
  this.m_widget.showStatusText();
};

/**
 * Returns the tag name of the item element.
 * @return {string} the tag name of the item element.
 * @protected
 */
DataProviderContentHandler.prototype.GetChildElementTagName = function () {
  return 'LI';
};

/**
 * Returns the insert before element given the index, or null if insert at the end.
 * @return {Element|null} the reference element.
 * @protected
 */
DataProviderContentHandler.prototype.GetReferenceNode = function (parentElement, index) {
  if (index === -1) {
    return null;
  }

  var childElements =
      $(parentElement).children('.' + this.m_widget.getItemElementStyleClass() +
                                ', .' + this.m_widget.getEmptyTextStyleClass() +
                                ', .oj-listview-temp-item');
  return (index === childElements.length) ? null : childElements[index];
};

/**
 * Create a list item and add it to the list
 * @param {Element|DocumentFragment} parentElement the element to add the list items to
 * @param {number} index the index of the item
 * @param {Object|null} data the data for the item
 * @param {Object} metadata the set of metadata for the item
 * @param {Object} templateEngine the template engine to process inline template
 * @param {function(Element, Object)=} callback optional callback function to invoke after item is added
 * @return {Object} contains the list item and the context object
 * @protected
 */
DataProviderContentHandler.prototype.addItem =
  function (parentElement, index, data, metadata, templateEngine, callback) {
    var item = document.createElement(this.GetChildElementTagName());

    $(item).uniqueId();
    var referenceNode = this.GetReferenceNode(parentElement, index);
    // should be optional
    if (this.m_widget.BeforeInsertItem) {
      this.m_widget.BeforeInsertItem();
    }
    parentElement.insertBefore(item, referenceNode); // @HTMLUpdateOK
    var position = $(parentElement).children().index(item);
    return this._addOrReplaceItem(item, position, parentElement, index, data, metadata,
                                  templateEngine, callback, false);
  };

/**
 * Replace an existing list item in the list
 * @param {Element} item the list item to change
 * @param {number} index the index of the item
 * @param {Object|null} data the data for the item
 * @param {Object} metadata the set of metadata for the item
 * @param {Object} templateEngine the template engine to process inline template
 * @param {function(Element, Object)} callback callback function to invoke after item is added
 * @param {boolean} restoreFocus flag to restore focus on updated item
 * @protected
 */
DataProviderContentHandler.prototype.replaceItem =
  function (item, index, data, metadata, templateEngine, callback, restoreFocus) {
    // animate hiding of existing item first
    this.signalTaskStart('replace item'); // signal replace item animation start. Ends in _handleReplaceTransitionEnd() defined in TableDataSourceContentHandler

    // now actually replace the item
    var parentElement = item.parentNode;
    var position = $(parentElement).children().index(item);
    var newItem = document.createElement(this.GetChildElementTagName());

    // explicit clean when inline template is used
    if (templateEngine) {
      templateEngine.clean(item);
    }

    // this should trigger ko.cleanNode if applicable
    $(item).replaceWith(newItem); // @HTMLUpdateOK newItem is constructed by the component and not yet manipulated by the application

    this._addOrReplaceItem(newItem, position, parentElement, index, data, metadata,
                           templateEngine, callback, restoreFocus);
  };

/**
 * Handles both add and replace item
 * @private
 */
DataProviderContentHandler.prototype._addOrReplaceItem =
  function (item, position, parentElement, index, data, metadata, templateEngine, callback,
    restoreFocus) {
    if (callback == null) {
      // eslint-disable-next-line no-param-reassign
      callback = this.afterRenderItem.bind(this);
    }

    var context = this.createContext(position, data, metadata, item);
    var renderer = this.m_widget._getItemRenderer();
    var templateElement = this.m_widget.getItemTemplate();
    var textWrapper;
    var isCustomizeItem = false;

    if (renderer != null) {
      // if an element is returned from the renderer and the parent of that element is null, we will append
      // the returned element to the parentElement.  If non-null, we won't do anything, assuming that the
      // rendered content has already added into the DOM somewhere.
      var content = renderer.call(this, context);
      if (content != null) {
        // allow return of document fragment from jquery create/js document.createDocumentFragment
        if (content.parentNode === null || content.parentNode instanceof DocumentFragment) {
          item.appendChild(content); // @HTMLUpdateOK
        } else if (content.parentNode != null) {
          // parent node exists, do nothing
        } else if (content.toString) {
          textWrapper = document.createElement('span');
          textWrapper.appendChild(document.createTextNode(content.toString())); // @HTMLUpdateOK
          item.appendChild(textWrapper); // @HTMLUpdateOK
        }
      }
    } else if (templateElement != null && templateEngine != null) {
      var componentElement = this.m_widget.GetRootElement()[0];
      var bindingContext = this.GetBindingContext(context);
      var as = this.m_widget.getAs ? this.m_widget.getAs() : null;
      var nodes = templateEngine.execute(componentElement, templateElement, bindingContext, as);
      var tagName = this.GetChildElementTagName();
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName === tagName) {
          parentElement.replaceChild(nodes[i], item);
          isCustomizeItem = true;
          break;
        } else {
          item.appendChild(nodes[i]);
        }
      }
    } else {
      textWrapper = document.createElement('span');
      textWrapper.appendChild(document.createTextNode(data == null ? '' : data.toString())); // @HTMLUpdateOK
      item.appendChild(textWrapper); // @HTMLUpdateOK
    }

    // get the item from root again as template replaces the item element
    var parentItem = parentElement.children ?
      parentElement.children[position] :
      this._getItemFromDocumentFragment(parentElement, position);
    context.parentElement = parentItem;

    // cache data in item element, this is needed for getDataForVisibleItem.
    $.data(parentItem, 'data', data);

    // do any post processing
    callback(parentItem, context, isCustomizeItem, restoreFocus);

    return { item: parentItem, context: context };
  };

/**
 * In IE/Safari, DocumentFragment does not support children property
 * @private
 */
DataProviderContentHandler.prototype._getItemFromDocumentFragment = function (fragment, index) {
  var nodeIndex = 0;
  var nodes = fragment.childNodes;

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (!node) {
      break;
    }

    if (node.nodeType === 1) {
      if (nodeIndex === index) {
        return node;
      }
      nodeIndex += 1;
    }
  }
  return null;
};

/**
 * Creates a binding context based on context object
 * To be override by different ContentHandler
 * @protected
 */
DataProviderContentHandler.prototype.GetBindingContext = function (context) {
  var current = {};
  current.data = context.data;
  current.index = context.index;
  current.key = context.key;
  current.componentElement = context.componentElement;

  return current;
};

DataProviderContentHandler.prototype.afterRenderItem = function (item, context) {
  // save the key in the element (cannot use data- here since it could be a non-string)
  // eslint-disable-next-line no-param-reassign
  item.key = context.key;

  var $item = $(item);
  $item.uniqueId();

  // if there's only one element inside the item and it is focusable, set
  // the role on it instead
  var elem = this.m_widget.getSingleFocusableElement($item);

  if (this.shouldUseGridRole()) {
    if (context.leaf != null && !context.leaf) {
      // it's a group item
      $item.attr('role', 'presentation');
    } else if (this.isCardLayout()) {
      elem.attr('role', 'gridcell');
    } else {
      $item.attr('role', 'row');
      if (elem !== $item) {
        elem.attr('role', 'gridcell');
      } else {
        // we'll need to wrap content with a gridcell role
        var wrapperHTML = "<div role='gridcell' class='oj-listview-cell-element'></div>";
        var children = elem.children();
        if (children.length === 0) {
          elem.get(0).innerHTML = wrapperHTML; // @HTMLUpdateOK
        } else {
          // include comment nodes/ko virtual elements
          var cell = document.createElement('div');
          cell.setAttribute('role', 'gridcell');
          cell.className = 'oj-listview-cell-element';

          while (elem[0].firstChild) {
            // The list is LIVE so it will re-index each call
            cell.appendChild(elem[0].firstChild); // @HTMLUpdateOK
          }
          elem[0].appendChild(cell);
        }
      }
    }
  } else {
    elem.attr('role', this.IsHierarchical() ? 'treeitem' : 'option');
    if (elem !== $item) {
      $item.attr('role', 'presentation');
    }
  }

  elem.addClass(this.m_widget.getFocusedElementStyleClass());

  // tag it if item is not focusable
  if (!this.isFocusable(context)) {
    $item.addClass('oj-skipfocus');
  }

  $item.addClass(this.m_widget.getItemElementStyleClass());
};

/**
 * Creates the context object containing metadata
 * @param {number} index the index
 * @param {Object} key the key
 * @param {Object} data the data
 * @param {Element} parentElem the parent element
 * @return {Object} the context object
 * @private
 */
// eslint-disable-next-line no-unused-vars
DataProviderContentHandler.prototype.getMetadata = function (index, key, data, parentElem) {
  var context = data.context;
  if (context == null) {
    context = {};
  }

  if (context.index == null) {
    context.index = index;
  }

  if (context.key == null) {
    context.key = key;
  }

  return context;
};

/**
 * Model mutate event handler.  Called on rows mutation.
 * @param {Object} event the mutate model event
 * @protected
 */
DataProviderContentHandler.prototype.handleModelMutateEvent = function (event) {
  if (this.m_root == null || !this.m_widget.isAvailable()) {
    return;
  }

  if (event.detail.remove != null) {
    this.handleModelRemoveEvent(event);
  }
  if (event.detail.add != null) {
    this.handleModelAddEvent(event);
  }
  if (event.detail.update != null) {
    this.handleModelChangeEvent(event);
  }
};

/**
 * @protected
 */
// eslint-disable-next-line no-unused-vars
DataProviderContentHandler.prototype.handleModelRefreshEvent = function (event) {
};

/**
 * @private
 */
DataProviderContentHandler.prototype._pushToEventQueue = function (event) {
  if (this.m_eventQueue == null) {
    this.m_eventQueue = [];
  }

  this.m_eventQueue.push(event);
};

DataProviderContentHandler.prototype._processEventQueue = function () {
  var event;

  if (this.m_eventQueue != null && this.m_eventQueue.length > 0) {
    // see if we can find a refresh event
    for (var i = 0; i < this.m_eventQueue.length; i++) {
      event = this.m_eventQueue[i];
      if (event.type === 'refresh') {
        this.handleModelRefreshEvent(event.event);
        // we are done
        return;
      }
    }

    // we'll just need to handle one event at a time since processEventQueue will be triggered whenever an event is done processing
    event = this.m_eventQueue.shift();
    if (event.type === 'mutate') {
      this.handleModelMutateEvent(event.event);
    }
  }
};

DataProviderContentHandler.prototype._clearEventQueue = function () {
  if (this.m_eventQueue != null) {
    this.m_eventQueue.length = 0;
  }
};

/**
 * Override by ContentHandler to do the actual model insert
 * @protected
 */
DataProviderContentHandler.prototype.addItemsForModelInsert =
  // eslint-disable-next-line no-unused-vars
  function (data, indexes, keys, parentKeys, afterKeys) {
  };

/**
 * @private
 */
DataProviderContentHandler.prototype.handleModelAddEvent = function (event) {
  // if listview is busy, queue it for processing later
  if (!this.IsReady()) {
    this._pushToEventQueue({ type: event.type, event: event });
    return;
  }

  this.signalTaskStart('handling model add event'); // signal method task start

  // in card layout mode, the root is an additional element created by ListView, and that will be disassociated by ListView when
  // it is empty, re-append it to the root ul (the superRoot)
  if (this.m_superRoot && this.m_root.childNodes.length === 0) {
    this.m_superRoot.appendChild(this.m_root.parentNode);
  }

  var addEvent = event.detail.add;
  var data = addEvent.data;
  var keys = [];
  var refKeys;

  addEvent.keys.forEach(function (key) {
    keys.push(key);
  });

  var keyIter;
  var isBeforeKeys = true;
  if (addEvent.addBeforeKeys !== undefined) {
    keyIter = addEvent.addBeforeKeys;
  } else if (addEvent.afterKeys !== undefined) {
    // afterKeys is deprecated, but continue to support it until we can remove it.
    // forEach can be called on both array and set.
    keyIter = addEvent.afterKeys;
    isBeforeKeys = false;
  }

  if (keyIter) {
    refKeys = [];
    keyIter.forEach(function (key) {
      refKeys.push(key);
    });
  }

  // parentKeys would be undefined for non-hierarchical DataProvider
  var parentKeys = addEvent.parentKeys;

  // indexes could be undefined if not supported by DataProvider
  var indexes = addEvent.indexes;

  if (data != null && keys != null && keys.length > 0 && data.length > 0 &&
      keys.length === data.length && (indexes == null || indexes.length === data.length)) {
    this.addItemsForModelInsert(data, indexes, keys, parentKeys, isBeforeKeys, refKeys);
  }

  this.signalTaskEnd(); // signal method task end
};

DataProviderContentHandler.prototype.afterRenderItemForInsertEvent =
  function (item, context, isCustomizeItem) {
    var action = 'add';

    this.signalTaskStart('after render item from model insert event'); // signal post rendering processing start. Ends at the end of the method.

    item.setAttribute('data-oj-context', '');

    this.afterRenderItem(item, context, isCustomizeItem);

    // hide it before starting animation to show added item
    var elem = $(item);

    var itemStyleClass = item.className;
    // eslint-disable-next-line no-param-reassign
    item.className = 'oj-listview-temp-item oj-listview-item-add-remove-transition';
    if (!this.shouldUseGridRole()) {
      elem.children().wrapAll('<div></div>'); // @HTMLUpdateOK
    }

    var content = elem.children().first();
    content[0].className = itemStyleClass;
    // transfer key and role for FindElementByKey lookup that might happen while animating (navlist)
    content[0].key = item.key;

    // transfer aria-selected for selectable checks that might happen while animating (navlist)
    if (!this.shouldUseGridRole()) {
      content.attr('role', item.getAttribute('role'));
      if (elem[0].hasAttribute('aria-selected')) {
        content.attr('aria-selected', item.getAttribute('aria-selected'));
      }
    }

    var self = this;
    var busyContext = Context.getContext(item).getBusyContext();
    busyContext.whenReady().then(function () {
      if (self.m_widget == null) {
        return;
      }

      self.signalTaskStart('kick off animation for insert item'); // signal add animation start. Ends in _handleAddTransitionEnd().

      var promise = self.m_widget.StartAnimation(item, action);

      // now show it
      promise.then(function () {
        item.removeAttribute('data-oj-context');
        self._handleAddTransitionEnd(context, item);
      });

      self.signalTaskEnd(); // signal post rendering processing end. Started at the beginning of the method.
    });
  };

DataProviderContentHandler.prototype._handleAddTransitionEnd =
  function (context, elem) {
    // this could have been called after listview is destroyed
    // or it could have been removed immediately
    if (this.m_widget == null || elem.parentNode == null) {
      this.signalTaskEnd();
      return;
    }

    var hasFocus = elem.classList.contains('oj-focus') &&
      elem.classList.contains('oj-focus-highlight');
    // cleanup
    var itemStyleClass = elem.children[0].className;
    // eslint-disable-next-line no-param-reassign
    elem.className = itemStyleClass;
    if (hasFocus) {
      elem.classList.add('oj-focus');
      elem.classList.add('oj-focus-highlight');
    }

    if (this.shouldUseGridRole()) {
      // eslint-disable-next-line no-param-reassign
      elem.children[0].className = 'oj-listview-cell-element';
    } else {
      $(elem).children().children().unwrap(); // @HTMLUpdateOK
    }

    this.m_widget.itemInsertComplete(elem, context);

    this.signalTaskEnd(); // signal add animation end. Started in afterRenderItemForInsertEvent();
  };

DataProviderContentHandler.prototype.handleModelRemoveEvent = function (event) {
  var self = this;
  var keys = event.detail.remove.keys;

  if (keys == null || keys.size === 0) {
    return;
  }

    // if listview is busy, hold that off until later
  if (!this.IsReady()) {
    this._pushToEventQueue({ type: event.type, event: event });
    return;
  }

  this.signalTaskStart('handling model remove event'); // signal method task start

  keys.forEach(function (key) {
    var elem = self.FindElementByKey(key);
    if (elem != null) {
      self.signalTaskStart('handling model remove event for item: ' + key); // signal removeItem start
      // item remove might have been just added (in insert animation phase)
      if (elem.parentNode.classList.contains('oj-listview-temp-item')) {
        elem = elem.parentNode;
      }
      self._removeItem(elem);
      self.signalTaskEnd(); // signal removeItem end
    }
  });

  // checks whether the removed item is selected, and adjust the value as needed
  if (this.isSelectionEnabled()) {
    var selected = this.m_widget.options.selected;
    var newSelected = selected.delete(keys);

    // update selection option if it did changed
    if (selected !== newSelected) {
      var selectedItems = [];
      if (newSelected.values) {
        newSelected.values().forEach(function (key) {
          selectedItems.push(self.FindElementByKey(key));
        });
      }
      this.m_widget._setSelectionOption(newSelected, null, selectedItems);
    }
  }

  // since the items are removed, need to clear cache
  this.m_widget.ClearCache();

  this.signalTaskEnd(); // signal method task end
};

/**
 * Remove a single item element
 * @param {jQuery|Element} elem the element to remove
 * @private
 */
DataProviderContentHandler.prototype._removeItem = function (elem) {
  var self = this;
  var action = 'remove';

  this.signalTaskStart('removing an item'); // signal method task start

  // got to do this before wrapAll since that changes activeElement
  var active = document.activeElement;
  var restoreFocus = elem.contains(active);

  var item = $(elem).get(0);
  var itemStyleClass = item.className;
  $(item).children().wrapAll("<div class='" + itemStyleClass + "'></div>"); // @HTMLUpdateOK
  item.className = 'oj-listview-item-add-remove-transition';
  item.children[0].key = elem.key;

  this.signalTaskStart('kick off animation to remove an item'); // signal remove item animation start. Ends in handleRemoveTransitionEnd()

  var promise = this.m_widget.StartAnimation(item, action);

  // now hide it
  promise.then(function () {
    self.handleRemoveTransitionEnd(elem, restoreFocus);
  });

  this.signalTaskEnd(); // signal method task end
};

/**
 * Handles when remove item animation transition ends
 * @param {Element|jQuery} elem
 * @param {boolean} restoreFocus
 * @protected
 */
DataProviderContentHandler.prototype.handleRemoveTransitionEnd =
  function (elem, restoreFocus) {
    // this could have been called after listview is destroyed
    if (this.m_widget == null) {
      this.signalTaskEnd();
      return;
    }

    var $elem = $(elem);
    var parent = $elem.parent();
    // could happen if there is a reset right after model update, the content has already been cleared out
    if (parent.length === 0) {
      this.signalTaskEnd();
      return;
    }

    // invoke hook before actually removing the item
    this.m_widget.itemRemoveComplete($elem.get(0), restoreFocus);

    // template engine should have already been loaded
    var templateEngine = this.getTemplateEngine();
    if (templateEngine) {
      templateEngine.clean($elem.get(0));
    }

    $elem.remove();

    // if it's the last item, show empty text
    if (parent.get(0).childElementCount === 0) {
      this.m_widget.renderComplete();
    }

    // ensure something is selected if the removed item is the last selected item
    // need to complete after the DOM element is removed
    if (this.isSelectionEnabled()) {
      this.m_widget.enforceSelectionRequired();
    }

    // this should focus on the current item, set by itemRemoveComplete
    if (restoreFocus) {
      this.m_root.focus();
    }

    this.signalTaskEnd(); // signal remove item animation end. Started in _removeItem()
  };

/**
 * Model change event handler.  Called when a row has been changed from the underlying data.
 * @param {Object} event the model change event
 * @private
 */
DataProviderContentHandler.prototype.handleModelChangeEvent = function (event) {
  this.signalTaskStart('handling model update event'); // signal method task start

  var changeEvent = event.detail.update;
  var data = changeEvent.data;
  var keys = [];
  changeEvent.keys.forEach(function (key) {
    keys.push(key);
  });

  // template engine should have already been loaded
  var templateEngine = this.getTemplateEngine();

  var restoreFocusElem;

  // indexes could be undefined if not supported by DataProvider
  var indexes = changeEvent.indexes;
  for (var i = 0; i < keys.length; i++) {
    var elem = this.FindElementByKey(keys[i]);
    if (elem != null) {
      if (restoreFocusElem === undefined && elem.contains(document.activeElement)) {
        restoreFocusElem = elem;
      }

      this.signalTaskStart('handling model update event for item: ' + keys[i]); // signal replace item start
      var index = (indexes == null) ? -1 : indexes[i];
      this.replaceItem(elem, index, data[i], this.getMetadata(index, keys[i], data[i],
       elem.parentNode), templateEngine, this.afterRenderItemForChangeEvent.bind(this),
       restoreFocusElem != null);
      this.signalTaskEnd(); // signal replace item end

      if (restoreFocusElem != null) {
        restoreFocusElem = null; // doing this will ensure we don't do the check again
      }
    }
  }

  // since the item element will change, need to clear cache
  this.m_widget.ClearCache();

  this.signalTaskEnd(); // signal method task end
};

/**
 * @private
 */
DataProviderContentHandler.prototype.afterRenderItemForChangeEvent =
  function (item, context, isCustomizeItem, restoreFocus) {
    var self = this;
    var action = 'update';

    this.signalTaskStart('after render item for model change event'); // signal method task start

    // adds all neccessary wai aria role and classes
    this.afterRenderItem(item, context);

    var promise = this.m_widget.StartAnimation(item, action);

    // now hide it
    promise.then(function () {
      self._handleReplaceTransitionEnd(item, restoreFocus);
    });

    this.signalTaskEnd(); // signal method task end
  };

/**
 * @private
 */
DataProviderContentHandler.prototype._handleReplaceTransitionEnd = function (item, restoreFocus) {
  // this could have been called after listview is destroyed
  if (this.m_widget == null) {
    this.signalTaskEnd();
    return;
  }

  $(item).removeClass('oj-listview-item-add-remove-transition');

  if (restoreFocus) {
    this.m_widget.restoreCurrentItemFocus(item);
  }

  this.signalTaskEnd(); // signal replace item animation end. Started in replaceItem() from handleModelChangeEvent() (see base class DataSourceContentHandler)
};

DataProviderContentHandler.prototype.createContext = function (index, data, metadata, elem) {
  var context = {};

  context.parentElement = elem;
  context.index = index;
  context.data = data;
  context.component = this.m_widget.getWidgetConstructor();
  context.datasource = this.getDataProvider();
  context = this.m_widget._FixRendererContext(context);

  // merge properties from metadata into cell context
  // the properties in metadata would have precedence
  var props = Object.keys(metadata);
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    context[prop] = metadata[prop];
  }

  return context;
};

DataProviderContentHandler.prototype.isSelectionEnabled = function () {
  return this.m_widget._isSelectionEnabled();
};

DataProviderContentHandler.prototype.isFocusable = function (context) {
  return this.m_widget.getItemFocusable(context);
};

DataProviderContentHandler.prototype.isSelectable = function (context) {
  return this.m_widget.getItemSelectable(context);
};

DataProviderContentHandler.prototype.isCardLayout = function () {
  return this.m_widget.isCardLayout();
};

DataProviderContentHandler.prototype.shouldUseGridRole = function () {
  return this.m_widget.ShouldUseGridRole();
};

DataProviderContentHandler.prototype.isAsyncRendering = function () {
  return false;
  //    return this.m_widget.ojContext._IsCustomElement() && this.shouldUseGridRole();
};

DataProviderContentHandler.prototype.signalTaskStart = function (description) {
  if (this.m_widget) { // check that widget exists (e.g. not destroyed)
    this.m_widget.signalTaskStart('DataSource ContentHandler ' + description);
  }
};

DataProviderContentHandler.prototype.signalTaskEnd = function () {
  if (this.m_widget) { // check that widget exists (e.g. not destroyed)
    this.m_widget.signalTaskEnd();
  }
};


/* global Promise:false, Symbol:false, Logger:false, Context:false, DataProviderContentHandler:false, DataCollectionUtils:false */

/**
 * Handler for IteratingDataProvider generated content
 * @constructor
 * @extends DataProviderContentHandler
 * @ignore
 */
var IteratingDataProviderContentHandler = function (widget, root, data) {
  IteratingDataProviderContentHandler.superclass.constructor.call(this, widget, root, data);
};

// Subclass from oj.DataSourceContentHandler
oj.Object.createSubclass(IteratingDataProviderContentHandler, DataProviderContentHandler,
                         'IteratingDataProviderContentHandler');

/**
 * Initializes the instance.
 * @protected
 */
IteratingDataProviderContentHandler.prototype.Init = function () {
  IteratingDataProviderContentHandler.superclass.Init.call(this);
};

IteratingDataProviderContentHandler.prototype.IsHierarchical = function () {
  return false;
};

/**
 * Determines whether the content handler is in a ready state
 * @return {boolean} true if there's no outstanding fetch or outstanding item in render queue, false otherwise.
 * @protected
 */
IteratingDataProviderContentHandler.prototype.IsReady = function () {
  return !this.m_fetching && this.m_idleCallback == null;
};

/**
 * Destroy the internal DomScroller if there is one.  Called when this ContentHandler is destroyed or on refresh.
 * @private
 */
IteratingDataProviderContentHandler.prototype._destroyDomScroller = function () {
  if (this.m_domScroller != null) {
    this.m_domScroller.destroy();

    this.m_domScroller = null;
  }

  // remove loading indicator if it still exists:
  this._removeLoadingIndicator();
};

/**
 * Destroy the content handler
 * @protected
 */
IteratingDataProviderContentHandler.prototype.Destroy = function (completelyDestroy) {
  IteratingDataProviderContentHandler.superclass.Destroy.call(this, completelyDestroy);
  this._removeDataSourceEventListeners();
  this._destroyDomScroller();
  this._cancelIdleCallback();

  this.m_loadingIndicator = null;
  this.m_viewportCheckPromise = null;
  this.m_checkViewportPromise = null;
};

/**
 * @private
 */
IteratingDataProviderContentHandler.prototype._cancelIdleCallback = function () {
  if (this.m_idleCallback != null) {
    if (!window.requestIdleCallback || !window.cancelIdleCallback) {
      window.cancelAnimationFrame(this.m_idleCallback);
    } else {
      window.cancelIdleCallback(this.m_idleCallback);
      // requestAnimationFrame might have been used
      window.cancelAnimationFrame(this.m_idleCallback);
    }
    this.m_idleCallback = null;
  }
};

IteratingDataProviderContentHandler.prototype.shouldHandleResize = function () {
  // we only care about the high-water mark scrolling case
  return this._isLoadMoreOnScroll();
};

IteratingDataProviderContentHandler.prototype.HandleResize = function (width, height) {
  // we only care about the high-water mark scrolling case, and if height changes
  if (!this._isLoadMoreOnScroll()) {
    return;
  }

  var currentWidth = this.m_width;
  var currentHeight = this.m_height;
  this.m_height = height;
  this.m_width = width;
  // reset column count so it can be re-calculated again
  this.m_colCount = undefined;

  // the number of skeletons needs to be adjusted because the number of columns might change
  var isCardLayout = this.isCardLayout();
  if (isCardLayout && this._isSkeletonSupport() && currentWidth !== width) {
    // adjust load more skeletons
    if (this.m_loadingIndicator != null) {
      this._adjustLoadMoreSkeletons(this._getRootElementWidth(true));
    } else {
      var container = this.m_root.querySelector('.oj-listview-skeleton-container');
      if (container != null) {
        // this must be the initial skeleton, just re-render them
        this.renderInitialSkeletons();
      }
    }
  }

  // check viewport if the height increased (or also width change if it's card layout)
  if (height > currentHeight || (isCardLayout && width > currentWidth)) {
    this.checkViewport();
  }
};

/**
 * @override
 */
IteratingDataProviderContentHandler.prototype.notifyShown = function () {
  // we only care about the high-water mark scrolling case
  if (!this._isLoadMoreOnScroll()) {
    return;
  }

  // for loadMoreOnScroll case, we will have to make sure the viewport is satisfied
  this.checkViewport();
};

/**
 * @override
 */
IteratingDataProviderContentHandler.prototype.notifyAttached = function () {
  // this should only be populated in high-water mark scrolling case with scroller specified
  var currentFetchTrigger = this._getFetchTrigger();
  if (currentFetchTrigger != null && this.m_domScroller != null) {
    // this should force the fetch trigger to recalculate
    var fetchTrigger = this._getFetchTrigger();
    if (currentFetchTrigger !== fetchTrigger) {
      // update fetch trigger
      this.m_domScroller.setFetchTrigger(fetchTrigger);
    }

    // check again whether the viewport is satisfied
    this.checkViewport();
  }
};

/**
 * Sets aria properties on root
 * @override
 */
IteratingDataProviderContentHandler.prototype.setRootAriaProperties = function () {
  IteratingDataProviderContentHandler.superclass.setRootAriaProperties.call(this);

  // for high-water mark scrolling, we'll need to add additional wai-aria attribute since not
  // all items are in the DOM
  var self = this;
  if (this.shouldUseGridRole() && this._isLoadMoreOnScroll()) {
    this.getDataProvider().getTotalSize().then(function (size) {
      // if count is unknown, then use max count
      self.m_root.setAttribute('aria-rowcount', size === -1 ? self._getMaxCount() : size);
    });
  }
};

/**
 * Unsets aria properties on root
 * @override
 */
IteratingDataProviderContentHandler.prototype.unsetRootAriaProperties = function () {
  IteratingDataProviderContentHandler.superclass.unsetRootAriaProperties.call(this);
  this.m_root.removeAttribute('aria-rowcount');
};

/**
 * Is loadMoreOnScroll
 * @return {boolean} true or false
 * @private
 */
IteratingDataProviderContentHandler.prototype._isLoadMoreOnScroll = function () {
  return this.m_widget.isLoadMoreOnScroll();
};

/**
 * Gets the number of items to return in each fetch
 * @return {number} the fetch size
 * @private
 */
IteratingDataProviderContentHandler.prototype._getFetchSize = function () {
  return Math.max(0, this.m_widget.options.scrollPolicyOptions.fetchSize);
};

/**
 * Gets the scroller element used in DomScroller
 * @return {Element} the scroller element
 * @private
 */
IteratingDataProviderContentHandler.prototype._getScroller = function () {
  var scroller = this.m_widget.options.scrollPolicyOptions.scroller;
  if (scroller != null) {
    // make sure it's an ancestor
    if ($.contains(scroller, this.m_root)) {
      // might as well calculate offset here
      if (this._fetchTrigger === undefined) {
        this._fetchTrigger = oj.DomScroller.calculateOffsetTop(scroller, this.m_root) +
          this._getLoadingIndicatorHeight();
      }
      return scroller;
    }
  }

  // if not specified or not an ancestor, use the listview root element
  return this.m_widget.GetRootElement()[0];
};

/**
 * Gets the distance from maximum scroll position that triggers a fetch
 * @return {number|undefined} the distance in pixel or undefined if no scroller is specified
 * @private
 */
IteratingDataProviderContentHandler.prototype._getFetchTrigger = function () {
  if (this._fetchTrigger === undefined) {
    this._fetchTrigger = this._getLoadingIndicatorHeight();
  }
  return this._fetchTrigger;
};

/**
 * Calculates the height of the loading indicator
 * @return {number} the height of the loading indicator
 * @private
 */
IteratingDataProviderContentHandler.prototype._getLoadingIndicatorHeight = function () {
  var height;
  if (this._isSkeletonSupport()) {
    height = this._getDefaultSkeletonDimension().height;
  } else {
    var container = $(document.createElement('div'));
    container.addClass(this.m_widget.getItemStyleClass())
      .css({ visibility: 'hidden', overflow: 'hidden', position: 'absolute' });
    var icon = $(document.createElement('div'));
    icon.addClass('oj-icon oj-listview-loading-icon');
    container.append(icon); // @HTMLUpdateOK

    $(this.m_widget.GetRootElement()).append(container); // @HTMLUpdateOK
    height = container.get(0).offsetHeight;
    container.remove();
  }
  return height;
};

/**
 * Gets the maximum number of items that can be retrieved from data source
 * @return {number} the maximum fetch count
 * @private
 */
IteratingDataProviderContentHandler.prototype._getMaxCount = function () {
  return this.m_widget.options.scrollPolicyOptions.maxCount;
};

/**
 * Whether skeleton is supported (current only in Redwood)
 * @private
 */
IteratingDataProviderContentHandler.prototype._isSkeletonSupport = function () {
  return this.m_widget.isSkeletonSupport();
};

/**
 * Adjust the dimension of the default skeleton and the content inside it
 * @private
 */
IteratingDataProviderContentHandler.prototype._adjustSkeletonCardContent = function
  (item, width, height) {
  // eslint-disable-next-line no-param-reassign
  item.style.width = width + 'px';
  // eslint-disable-next-line no-param-reassign
  item.style.height = height + 'px';
};

/**
 * Creates a skeleton representing a single card.
 * @private
 */
IteratingDataProviderContentHandler.prototype._createSkeletonCard = function () {
  var card = document.createElement('li');
  var content = document.createElement('div');
  card.className = 'oj-listview-skeleton-card';
  // oj-listview-skeleton is a marker class to identify this is an item skeleton and not skeleton from other component
  content.className = 'oj-listview-skeleton oj-listview-skeleton-card-content oj-animation-skeleton';

  card.appendChild(content); // @HTMLUpdateOK
  return card;
};

/**
 * Creates a skeleton representing a single item.
 * @private
 */
IteratingDataProviderContentHandler.prototype._createSkeletonItem = function () {
  var item = document.createElement('li');
  var content = document.createElement('div');
  item.className = 'oj-listview-skeleton-item';
  if (!this.m_widget._isGridlinesVisible()) {
    item.classList.add('gridline-hidden');
  }
  // oj-listview-skeleton is a marker class to identify this is an item skeleton and not skeleton from other component
  content.className = 'oj-listview-skeleton oj-listview-skeleton-single-line oj-animation-skeleton';
  item.appendChild(content); // @HTMLUpdateOK
  return item;
};

/**
 * Creates a skeleton representing a single item/card.
 * @private
 */
IteratingDataProviderContentHandler.prototype._createSkeleton = function (initial) {
  var defaultSkeleton;
  if (this.isCardLayout()) {
    if (initial) {
      if (this.m_defaultItemSkeleton === undefined) {
        this.m_defaultItemSkeleton = this._createSkeletonCard();
      }
      defaultSkeleton = this.m_defaultItemSkeleton;
    } else {
      if (this.m_defaultLoadMoreSkeleton === undefined) {
        var card = this._createSkeletonCard();
        var dim = this._getCardDimension();
        this._adjustSkeletonCardContent(card, dim.width, dim.height);
        this.m_defaultLoadMoreSkeleton = card;
      }
      defaultSkeleton = this.m_defaultLoadMoreSkeleton;
    }
  } else {
    if (this.m_defaultItemSkeleton === undefined) {
      this.m_defaultItemSkeleton = this._createSkeletonItem();
    }
    defaultSkeleton = this.m_defaultItemSkeleton;
  }

  return defaultSkeleton.cloneNode(true);
};

/**
 * Get the dimension of the default skeleton
 * @private
 */
IteratingDataProviderContentHandler.prototype._getDefaultSkeletonDimension = function () {
  if (this.m_defaultSkeletonDim == null) {
    var root = this.m_widget.GetRootElement()[0];
    var skeleton = this._createSkeleton(true);
    skeleton.style.display = 'block';
    skeleton.style.visibility = 'hidden';
    root.appendChild(skeleton); // @HTMLUpdateOK
    var dim = { width: skeleton.offsetWidth, height: skeleton.offsetHeight };
    root.removeChild(skeleton); // @HTMLUpdateOK
    if (dim.height > 0 && dim.width > 0) {
      // cache the value only if it's valid
      this.m_defaultSkeletonDim = dim;
    }
    return dim;
  }
  return this.m_defaultSkeletonDim;
};

/**
 * Gets the width of the browser scrollbar
 * @private
 */
IteratingDataProviderContentHandler.prototype._getScrollbarWidth = function () {
  if (isNaN(this.m_scrollbarWidth)) {
    var root = this.m_widget.GetRootElement()[0];
    var dummy = document.createElement('div');
    root.appendChild(dummy); // @HTMLUpdateOK
    this.m_scrollbarWidth = Math.max(0, DataCollectionUtils.getDefaultScrollBarWidth(dummy));
    root.removeChild(dummy); // @HTMLUpdateOK
  }
  return this.m_scrollbarWidth;
};

/**
 * Gets the height of the root (UL)
 * @private
 */
IteratingDataProviderContentHandler.prototype._getRootElementHeight = function () {
  if (isNaN(this.m_height)) {
    this.m_height = this.m_widget.GetRootElement()[0].offsetHeight;
  }
  return this.m_height;
};

/**
 * Gets the width of the root (UL)
 * @private
 */
IteratingDataProviderContentHandler.prototype._getRootElementWidth = function (excludeScrollbar) {
  if (isNaN(this.m_width)) {
    this.m_width = this.m_widget.GetRootElement()[0].offsetWidth;
  }
  return excludeScrollbar ? this.m_width - this._getScrollbarWidth() : this.m_width;
};

/**
 * Displays skeletons for initial fetch.  Invoked by the widget.
 */
IteratingDataProviderContentHandler.prototype.renderInitialSkeletons = function () {
  // empty out root element before adding skeletons
  if (this.m_superRoot) {
    this.m_root = this.m_superRoot;
    this.m_superRoot = null;
  }
  $(this.m_root).empty();

  // determines how many items needed to fill the viewport
  var height = this._getRootElementHeight();

  // figure out how many item/card are needed to fill the viewport
  // use floor to avoid triggering overflow
  var count = 0;
  var skeletonDimension = this._getDefaultSkeletonDimension();
  if (skeletonDimension.width > 0 && skeletonDimension.height > 0) {
    if (this.isCardLayout()) {
      var margin = this._getMargin();
      var width = this._getRootElementWidth();
      var colCount = Math.max(1, Math.floor(width / (skeletonDimension.width + margin)));
      var rowCount = Math.max(1, Math.floor(height / (skeletonDimension.height + margin)));
      count = rowCount * colCount;
    } else {
      count = Math.max(1, Math.floor(height / skeletonDimension.height));
    }
  }

  var container = document.createElement('li');
  container.setAttribute('role', 'presentation');
  var list = document.createElement('ul');
  list.setAttribute('role', 'presentation');
  list.className = 'oj-listview-group oj-listview-skeleton-container';
  for (var i = 0; i < count; i++) {
    list.appendChild(this._createSkeleton(true)); // @HTMLUpdateOK
  }
  container.appendChild(list); // @HTMLUpdateOK

  this.m_root.appendChild(container); // @HTMLUpdateOK
};

IteratingDataProviderContentHandler.LOAD_MORE_SKELETONS_ROW_COUNT = 3;

/**
 * Adjust the load more skeleton in the case of component resize/reattach
 * @private
 */
IteratingDataProviderContentHandler.prototype._adjustLoadMoreSkeletons = function (width) {
  var margin = this._getMargin();
  var newColCount = Math.floor(width / (this._getCardDimension().width + margin));
  var container = this.m_loadingIndicator.get(0).firstElementChild;
  var currentColCount = container.childElementCount;
  var diff = newColCount - currentColCount;
  if (diff === 0) {
    return;
  }

  // remove all skeletons.  note it's better to just recreate the skeletons instead of maniulate them
  // because we have to make sure the animation is synchrionize
  this.m_loadingIndicator.get(0).parentNode.removeChild(this.m_loadingIndicator.get(0));
  if (this.m_fillerSkeletons != null) {
    this.m_fillerSkeletons.parentNode.removeChild(this.m_fillerSkeletons);
  }
  this.m_loadingIndicator = null;
  this.m_fillerSkeletons = null;

  // repopulate the skeletons
  this._appendLoadingIndicator();
};

/**
 * Calculate what the margin is between cards
 * @private
 */
IteratingDataProviderContentHandler.prototype._getMargin = function () {
  if (this.m_margin === undefined) {
    var elem = document.createElement('li');
    elem.className = this.m_widget.getItemStyleClass();
    this.m_root.appendChild(elem); // @HTMLUpdateOK
    var style = window.getComputedStyle(elem);
    this.m_margin = parseInt(style.marginRight, 10);
    this.m_root.removeChild(elem); // @HTMLUpdateOK
  }
  return this.m_margin;
};

/**
 * Gets the dimension of a card (actual not skeleton)
 * @private
 */
IteratingDataProviderContentHandler.prototype._getCardDimension = function () {
  if (this.m_cardDim === undefined) {
    var elem = this.m_root.querySelector('.' + this.m_widget.getItemElementStyleClass());
    if (elem) {
      this.m_cardDim = { width: elem.offsetWidth, height: elem.offsetHeight };
    }
  }
  return this.m_cardDim;
};

/**
 * Calculate the number of cards in a row
 * @private
 */
IteratingDataProviderContentHandler.prototype._getColCount = function () {
  if (this.m_colCount === undefined) {
    var cardWidthWithMargin = this._getCardDimension().width + this._getMargin();
    this.m_colCount = Math.max(1, Math.floor(this._getRootElementWidth() / cardWidthWithMargin));
  }
  return this.m_colCount;
};

/**
 * Renders a group of skeleton cards/items
 * @private
 */
IteratingDataProviderContentHandler.prototype._renderSkeletons = function (count) {
  var container = this.createLoadingIndicator();
  var group = document.createElement('ul');
  group.className = this.isCardLayout() ? 'oj-listview-skeleton-card-group' : 'oj-listview-group';
  container.appendChild(group); // @HTMLUpdateOK

  for (var i = 0; i < count; i++) {
    group.appendChild(this._createSkeleton(false)); // @HTMLUpdateOK
  }

  return container;
};

/**
 * Fills any empty space in the last row with skeleton cards
 * @private
 */
IteratingDataProviderContentHandler.prototype._fillEmptySpaceWithSkeletons = function () {
  // first check how many do we need
  var lastItem = this.m_root.lastElementChild;
  var cardWidthWithMargin = this._getCardDimension().width + this._getMargin();
  var width = this._getRootElementWidth(true);
  var count = Math.floor((width - lastItem.offsetLeft - cardWidthWithMargin)
    / cardWidthWithMargin);
  if (count > 0) {
    var container = this._renderSkeletons(count);
    this.m_root.appendChild(container); // @HTMLUpdateOK
    this.m_fillerSkeletons = container;
  }
};

/**
 * Creates the load more skeletons
 * @private
 */
IteratingDataProviderContentHandler.prototype._createLoadMoreSkeletons = function () {
  var count;
  if (this.isCardLayout()) {
    var width = this._getRootElementWidth(true);
    var cardDimension = this._getCardDimension();
    var cardWidth = cardDimension === undefined ? this._getDefaultSkeletonDimension().width :
      cardDimension.width;
    count = cardWidth === 0 ? 0 : Math.floor(width / (cardWidth + this._getMargin()));
  } else {
    count = IteratingDataProviderContentHandler.LOAD_MORE_SKELETONS_ROW_COUNT;
  }
  return this._renderSkeletons(count);
};

/**
 * Creates the load more indicator icon
 * @private
 */
IteratingDataProviderContentHandler.prototype._createLoadMoreIcon = function () {
  var item = $(this.createLoadingIndicator());
  item.uniqueId()
    .attr('role', 'presentation')
    .addClass(this.m_widget.getItemStyleClass())
    .addClass('oj-listview-loading-icon-container');

  var icon = $(document.createElement('div'));
  icon.addClass('oj-icon oj-listview-loading-icon');
  item.append(icon); // @HTMLUpdateOK

  return item.get(0);
};

/**
 * @return {Element} the loading indicator element
 */
IteratingDataProviderContentHandler.prototype.createLoadingIndicator = function () {
  return document.createElement('li');
};

/**
 * Add a loading indicator to the list for high-water mark scrolling scenario
 * @private
 */
IteratingDataProviderContentHandler.prototype._appendLoadingIndicator = function () {
  // check if it's already added
  if (this.m_loadingIndicator != null) {
    return;
  }

  // for the card layout case, we might need to fill empty space in the last row with skeletons
  if (this._isSkeletonSupport() && this.isCardLayout()) {
    this._fillEmptySpaceWithSkeletons();
  }

  var loadMoreIndicator = this._isSkeletonSupport() ? this._createLoadMoreSkeletons() :
    this._createLoadMoreIcon();
  this.m_root.appendChild(loadMoreIndicator); // @HTMLUpdateOK

  this.m_loadingIndicator = $(loadMoreIndicator);
};

/**
 * Remove the loading indicator
 * @private
 */
IteratingDataProviderContentHandler.prototype._removeLoadingIndicator = function () {
  if (this.m_loadingIndicator != null) {
    this.m_loadingIndicator.remove();
  }
  this.m_loadingIndicator = null;

  if (this.m_fillerSkeletons != null) {
    this.m_fillerSkeletons.remove();
  }
  this.m_fillerSkeletons = null;
};

/**
 * Whether there are more items to fetch when scroll policy loadMoreOnScroll is used.
 * @return {boolean} true if there are more items to fetch, false otherwise.
 * @protected
 */
IteratingDataProviderContentHandler.prototype.hasMoreToFetch = function () {
  return (this.m_loadingIndicator != null);
};

/**
 * Add required attributes to item after it is rendered by the renderer
 * @param {Element} item the item element to modify
 * @param {Object} context the item context
 * @protected
 */
IteratingDataProviderContentHandler.prototype.afterRenderItem =
  function (item, context, isCustomizeItem) {
    IteratingDataProviderContentHandler.superclass.afterRenderItem.call(this, item, context,
      isCustomizeItem);

    $(item).addClass(this.m_widget.getItemStyleClass());

    // if item root (<LI>) is not specified, add a default layout class if it's supported
    if (!isCustomizeItem && this.m_widget.getItemLayoutStyleClass) {
      item.classList.add(this.m_widget.getItemLayoutStyleClass());
    }

    if (this.isSelectionEnabled() && this.isSelectable(context)) {
      this.m_widget.getFocusItem($(item)).attr('aria-selected', false);
    }

    // for high-water mark scrolling, we'll need to add additional wai-aria attribute since not
    // all items are in the DOM
    if (this._isLoadMoreOnScroll()) {
      $(item).attr('aria-rowindex', context.index + 1);
    }

    this.m_widget.itemRenderComplete(item, context);
  };

/**
 * Callback handler max fetch count.
 * @private
 */
IteratingDataProviderContentHandler.prototype._handleScrollerMaxRowCount = function () {
  // TODO: use resource bundle
  Logger.error('max count reached');
};

/**
 * Empty out root element and create any necessary artifacts before rendering items
 * @private
 */
IteratingDataProviderContentHandler.prototype._prepareRootElement = function () {
  // reset root if it was manipulated prior
  if (this.m_superRoot) {
    this.m_root = this.m_superRoot;
    this.m_superRoot = null;
  }

  // empty out root element
  $(this.m_root).empty();

  if (this.shouldUseGridRole() && this.isCardLayout()) {
    // in card layout, this is going to be a single row, N columns grid
    // so we'll need to wrap all <li> within a row
    var presentation = document.createElement('li');
    var row = document.createElement('ul');
    presentation.appendChild(row); // @HTMLUpdateOK
    $(presentation).attr('role', 'presentation')
      .css('width', '100%');
    $(row).attr('role', 'row')
      .addClass(this.m_widget.getGroupStyleClass());

    this.m_root.appendChild(presentation); // @HTMLUpdateOK
    this.m_superRoot = this.m_root;
    this.m_root = row;
  }
};

/**
 * @private
 */
IteratingDataProviderContentHandler.prototype._setFetching = function (fetching) {
  this.m_root.setAttribute('aria-busy', fetching);
  this.m_fetching = fetching;
};

/**
 * @param {boolean} forceFetch
 * @override
 */
IteratingDataProviderContentHandler.prototype.fetchRows = function (forceFetch) {
  var offset = 0;

  this.signalTaskStart('fetching rows'); // signal method task start

  // checks if we are already fetching cells
  if (this.IsReady()) {
    var self = this;

    this._setFetching(true);

    IteratingDataProviderContentHandler.superclass.fetchRows.call(this, forceFetch);

    // initiate loading of template engine, note it will not load it unless a template has been specified
    var enginePromise = this.loadTemplateEngine();

    // signal fetch started. Ends in fetchEnd() if successful. Otherwise, ends in the reject block of promise below right after _handleFetchError().
    // Cannot end in _handleFetchError() to be consistent with pagingTableDataSource behavior (see comment above)
    this.signalTaskStart('first fetch');

    var options = {};
    // use fetch size if loadMoreOnScroll, otherwise specify -1 to fetch all rows
    options.size = this._isLoadMoreOnScroll() ? this._getFetchSize() : -1;

    this.m_dataProviderAsyncIterator =
      this.getDataProvider().fetchFirst(options)[Symbol.asyncIterator]();
    var promise = this.m_dataProviderAsyncIterator.next();
    self.fetchSize = options.size;

    // new helper function to be called in recursion to fetch all data.
    var helperFunction = function (values) {
      // skip additional fetching if done, or if fetchSize is not -1.
      // if it has getPageCount method, it is a pagingTableDataSource so skip this fetch process.
      if (values[0].done || self.fetchSize !== -1 ||
          typeof self.getDataProvider().getPageCount === 'function') {
        return values;
      }
      var nextPromise = self.m_dataProviderAsyncIterator.next();
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
        self.signalTaskEnd(); // signal fetch stopped. Started above.
      });

      return (fetchMoreData);
    };

    Promise.all([promise, enginePromise]).then(function (values) {
      return helperFunction(values);
    }, function (reason) {
      self._handleFetchError(reason);
      self.signalTaskEnd(); // signal fetch stopped. Started above.
    }).then(function (values) {
      // if not fetching, stop b/c fetch error happened earlier
      // Previous _handleFetchError will pass the reason value into
      // values for this then call, so ignore if m_fetching is false.
      if (self.m_fetching) {
        // check if content handler has been destroyed already
        if (self.m_widget == null) {
          return;
        }

        var value = values[0];
        var templateEngine = values[1];

        var dataProvider = self.getDataProvider();
        if (oj.TableDataSourceAdapter && dataProvider instanceof oj.TableDataSourceAdapter) {
          // paging control loadMore mode, offset will not be 0 after first fetch
          offset = dataProvider.offset;
        }

        if (offset === 0) {
          if (templateEngine) {
            // clean nodes generated by templateengine before
            self.cleanItems(templateEngine);
          }

          if (self._isSkeletonSupport()) {
            // fade out skeletons
            var elem = self.m_root.querySelector('.oj-animation-skeleton');
            // make sure the skeletons are showing (it might not if the data is loaded quickly)
            if (elem != null) {
              elem.addEventListener('animationiteration', function () {
                // need the check here since listview might have been destroyed
                if (self.m_widget != null) {
                  var container = self.m_root.querySelector('.oj-listview-skeleton-container');
                  container.addEventListener('animationend', function () {
                    if (self.m_widget != null) {
                      // empty content now that we have data
                      self._prepareRootElement();

                      // append loading indicator at the end as needed
                      self._handleFetchedData(value, templateEngine);
                    }
                  });
                  container.classList.add('oj-animation-skeleton-fade-out');
                }
              });
              return;
            }
          }

          // empty content now that we have data
          self._prepareRootElement();
        }

        // append loading indicator at the end as needed
        self._handleFetchedData(value, templateEngine);
      }
    }, function (reason) {
      self._handleFetchError(reason);
      self.signalTaskEnd(); // signal fetch stopped. Started above.
    });
    this.signalTaskEnd(); // signal method task end
    return;
  }
  this.signalTaskEnd(); // signal method task end
};


IteratingDataProviderContentHandler.prototype._handleFetchError = function (msg) {
  // TableDataSource aren't giving me any error message
  Logger.error(msg);

  // turn off fetching if there is an error
  this._setFetching(false);

  // listview might have been destroyed before fetch error is handled
  if (this.m_widget == null) {
    Logger.info('handleFetchError: widget has already been destroyed');
    return;
  }

  if (this._isLoadMoreOnScroll()) {
    this._removeLoadingIndicator();
  }

  this.m_widget.renderComplete();
};

/**
 * Renders items when browser is idle (if not support, then fallback to requestAnimationFrame)
 * @private
 */
IteratingDataProviderContentHandler.prototype._renderItemsWhenIdle =
  function (data, keys, index, templateEngine, isMouseWheel) {
    var self = this;

    if (data.length === 0 || keys.length === 0) {
      window.requestAnimationFrame(function () {
        // idle callback might have been cancelled
        if (self.m_idleCallback) {
          self._appendLoadingIndicator();
          self.afterItemsInserted();
          self.signalTaskEnd(); // started in initial renderItemsWhenIdle call
        }
        self.m_idleCallback = null;
      });
      return;
    }

    function addFragmentOnRequestAnimationFrame(fragment) {
      window.requestAnimationFrame(function () {
        // need the check here since listview might have been destroyed before idleCallback is cancelled
        if (self.m_widget != null) {
          self.m_root.appendChild(fragment); // @HTMLUpdateOK
        }

        // schedule next idle callback until all items from the current fetch are rendered
        self._renderItemsWhenIdle(data, keys, index, templateEngine, isMouseWheel);
      });
    }

    // IE/Edge/Safari do not support requestIdleCallback, use requestAnimationFrame as fall back
    // also Chrome has an issue with requestIdleCallback when mouse wheel is used, see Chrome :
    // https://bugs.chromium.org/p/chromium/issues/detail?id=822269
    if (isMouseWheel || !window.requestIdleCallback || !window.cancelIdleCallback) {
      this.m_idleCallback = window.requestAnimationFrame(function () {
        var fragment = document.createDocumentFragment();
        var oneData = data.shift();
        var oneKey = keys.shift();
        self.addItem(fragment, -1, oneData, self.getMetadata(index, oneKey, oneData),
          templateEngine);

        // eslint-disable-next-line no-param-reassign
        index += 1;
        addFragmentOnRequestAnimationFrame(fragment);
      });
    } else {
      this.m_idleCallback = window.requestIdleCallback(function (idleDeadline) {
        // no need to check for whether listview has been destroyed yet since we cancel the callback on destroy
        var timeRemaining = idleDeadline.timeRemaining();
        var lastTimeTaken = 0;
        var fragment = document.createDocumentFragment();
        while (timeRemaining > lastTimeTaken) {
          if (data.length === 0 || keys.length === 0) {
            break;
          }

          var oneData = data.shift();
          var oneKey = keys.shift();
          self.addItem(fragment, -1, oneData, self.getMetadata(index, oneKey, oneData),
            templateEngine);

          // eslint-disable-next-line no-param-reassign
          index += 1;
          lastTimeTaken = timeRemaining - idleDeadline.timeRemaining();
          timeRemaining = idleDeadline.timeRemaining();
        }

        addFragmentOnRequestAnimationFrame(fragment);
      });
    }
  };

/**
 * Checks whether content is overflowed
 * @private
 */
IteratingDataProviderContentHandler.prototype._isOverflow = function () {
  return this._isLoadMoreOnScroll() && this.m_domScroller && this.m_domScroller.isOverflow();
};

/**
 * Callback for handling fetch success
 * @param {Array} data the array of data
 * @param {Array} keys the array of keys
 * @param {boolean} doneOrMaxLimitReached true if there are no more data or max count limit reached, false otherwise
 * @param {Object} templateEngine the template engine to process inline template
 * @return {boolean} true if items are rendered when idle, false otherwise
 * @private
 */
IteratingDataProviderContentHandler.prototype._handleFetchSuccess =
  function (data, keys, doneOrMaxLimitReached, templateEngine, isMouseWheel) {
    // listview might have been destroyed before fetch success is handled
    if (this.m_widget == null) {
      return true;
    }

    var index = this.m_root.childElementCount;
    if (index > 0 && !doneOrMaxLimitReached && this._isOverflow() &&
      this.m_widget.m_scrollPosition == null) {
      // clone the data since we are going to manipulate the array
      // just in case the DataProvider returns something that references internal structure
      this.signalTaskStart('render items during idle time'); // signal task start
      this._renderItemsWhenIdle(data.slice(0), keys.slice(0), index, templateEngine, isMouseWheel);
      return true;
    }

    var parent = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      // passing -1 for opt since we know it will be inserted at the end of the parent
      this.addItem(parent, -1, row, this.getMetadata(index, keys[i], row), templateEngine);
      index += 1;
    }
    this.m_root.appendChild(parent); // @HTMLUpdateOK
    return false;
  };

/**
 * Handles fetched data initiated by the DomScroller (scroll and fetch, or checkViewport)
 * @protected
 */
IteratingDataProviderContentHandler.prototype.handleDomScrollerFetchedData =
  function (result) {
    if (result != null) {
      this.signalTaskStart('handle results from DomScroller'); // signal task start

      // remove any loading indicator, which is always added to the end after fetch
      this._removeLoadingIndicator();

      if (this.IsReady()) {
        this.signalTaskStart('dummy task'); // start a dummy task to be paired with the fetchEnd() call below if no new data were fetched.
      }

      this._handleFetchedData(result, this.getTemplateEngine()); // will call fetchEnd(), which signals a task end. Started either in fetchRows() or in a dummy task not involving data fetch.

      if (result.value && result.value.data) {
        this.m_widget.updateStatusFetchEnd(result.value.data.length);
      }

      // reset cached scroll height
      this.m_widget.m_scrollHeight = null;

      this.signalTaskEnd(); // signal domscroller fetch end. Started in beforeFetch callback below
      this.signalTaskEnd(); // signal task end
    } else {
      // when there's no more data or any other unexpected cases
      this._removeLoadingIndicator();
      this.signalTaskEnd(); // signal domscroller fetch end. Started in beforeFetch callback below
    }
  };

/**
 * Register the DomScroller
 * @private
 */
IteratingDataProviderContentHandler.prototype._registerDomScroller = function () {
  var self = this;

  var options = {
    fetchSize: this._getFetchSize(),
    fetchTrigger: this._getFetchTrigger(),
    maxCount: this._getMaxCount(),
    asyncIterator: this.m_dataProviderAsyncIterator,
    initialRowCount: this.m_root.childElementCount,
    success: function (result) {
      self.handleDomScrollerFetchedData(result);
      if (self.m_root == null || result.value == null) {
        // in this case fetchEnd will not be called so we will need to clean up for signalTaskStart in scrollFetch callback
        self.signalTaskEnd();
        if (self.m_root != null) {
          // this is called as part of fetchEnd, see 
          self.m_widget.renderComplete();
        }
      }
    },
    error: this.signalTaskEnd.bind(this),
    localKeyValidator: function (key) {
      if (self.m_widget) {
        return (self.m_widget.FindElementByKey(key) != null);
      }
      return false;
    },
    beforeFetch: function () {
      self.handleBeforeFetch();
      self.m_viewportCheckPromise = null;
      if (self.m_idleCallback != null) {
        return false;
      }
      self.m_widget.updateStatusFetchStart();
      self.signalTaskStart('starts high-water mark scrolling'); // signal domscroller data fetching. Ends either in success call (m_domScrollerMaxCountFunc) or in error call (self.signalTaskEnd)
      return true;
    }
  };
  this.m_domScroller = new oj.DomScroller(this._getScroller(), this.getDataProvider(), options);
};

IteratingDataProviderContentHandler.prototype.handleBeforeFetch = function () {
};

IteratingDataProviderContentHandler.prototype._clearEventQueue = function () {
  if (this.m_eventQueue != null) {
    this.m_eventQueue.length = 0;
  }
};

/**
 * Retrieve the index of the item with the specified key
 * @private
 */
IteratingDataProviderContentHandler.prototype._getIndex = function (keys, index) {
  if (keys == null || keys.length === 0 || index >= keys.length) {
    return -1;
  }

  var key = keys[index];
  var elem = this.FindElementByKey(key);
  return (elem != null) ? $(this.m_root).children().index(elem) : -1;
};

/**
 * Returns the insert before element given the index, or null if insert at the end.
 * @return {Element|null} the reference element.
 * @protected
 * @override
 */
IteratingDataProviderContentHandler.prototype.GetReferenceNode = function (parentElement, index) {
  var referenceNode = IteratingDataProviderContentHandler.superclass.GetReferenceNode.call(this,
    parentElement, index);
  if (referenceNode == null && this.m_loadingIndicator != null) {
    return this.m_loadingIndicator.get(0);
  }
  return referenceNode;
};

/**
 * Gets the maximum index for insert event
 * @private
 */
IteratingDataProviderContentHandler.prototype._getMaxIndexForInsert = function () {
  var max = Number.MAX_VALUE;
  // only care about child count if there's more to fetch
  if (this._isLoadMoreOnScroll() && this.hasMoreToFetch()) {
    max = $(this.m_root).children('li.' + this.m_widget.getItemElementStyleClass()).length;
    var fetchSize = this._getFetchSize();
    var min = fetchSize;
    if (this.m_widget.getMinimumCountForViewport) {
      min = Math.ceil(this.m_widget.getMinimumCountForViewport() / fetchSize) * fetchSize;
    }
    max = Math.max(max, min);
  }

  return max;
};

/**
 * Do the actual adding items to DOM based on model insert event
 * @protected
 */
IteratingDataProviderContentHandler.prototype.addItemsForModelInsert =
  function (data, indexes, keys, parentKeys, isBeforeKeys, refKeys) {
    // index to determine whether it's outside of range of not
    var max = this._getMaxIndexForInsert();

    // template engine should have already been loaded
    var templateEngine = this.getTemplateEngine();

    for (var i = 0; i < data.length; i++) {
      this.signalTaskStart('handling model add event for item: ' + keys[i]); // signal add item start
      // indexes takes precedence
      var index;
      if (indexes != null) {
        index = indexes[i];
      } else {
        index = this._getIndex(refKeys, i);
        if (index > -1) {
          index = isBeforeKeys ? index : index + 1;
        } else if (this._isLoadMoreOnScroll() && this.hasMoreToFetch()) {
          // if append to the end but not everything has been fetched yet
          index = max;
        }
      }
      // we skip any insert/append outside of range if there's still more to fetch
      if (index < max) {
        this.addItem(this.m_root, index, data[i],
                     this.getMetadata(index, keys[i], data[i]),
                     templateEngine,
                     this.afterRenderItemForInsertEvent.bind(this));
      }
      this.signalTaskEnd(); // signal add item end
    }

    if (this.IsReady()) {
      this.signalTaskStart('dummy task'); // start a dummy task to be paired with the fetchEnd() call below if no new data were fetched.
    }
    // do whatever post fetch processing
    this.fetchEnd(); // signals a task end. Started either in fetchRows() or in a dummy task not involving data fetch.
  };

/**
 * Model refresh event handler.  Called when all rows has been removed from the underlying data.
 * @param {Object} event the model refresh event
 * @private
 */
IteratingDataProviderContentHandler.prototype.handleModelRefreshEvent = function (event) {
  if (this.m_root == null) {
    return;
  }

  // any outstanding idle-time rendering should immediately be stopped
  this._cancelIdleCallback();

  // if listview is busy, hold that off until later, the refresh must be handled in order
  // since we don't know when the results are coming back in
  if (!this.IsReady()) {
    this._pushToEventQueue({ type: event.type, event: event });
    return;
  }

  this.signalTaskStart('handling model reset event'); // signal method task start

  // since we are refetching everything, we should just clear out any outstanding model events
  this._clearEventQueue();

  // empty everything (later) and clear cache
  this.m_widget.ClearCache();

  // it will be recreated with a new asyncIterator
  this._destroyDomScroller();

  // handle scrollPositionPolicy on refresh
  if (this.m_widget.adjustScrollPositionValueOnRefresh) {
    this.m_widget.adjustScrollPositionValueOnRefresh();
  }

  // fetch data
  this.fetchRows(true);

  this.signalTaskEnd(); // signal method task end
};

/**
 * Handle fetched data, either from a fetch call or from a sync event
 * @param {Object} dataObj the fetched data object
 * @return {boolean} true if a loading indicator should be appended, false otherwise
 * @private
 */
IteratingDataProviderContentHandler.prototype._handleFetchedData =
  function (dataObj, templateEngine) {
    var result = false;

    // this could happen if destroy comes before fetch completes (note a refresh also causes destroy)
    if (this.m_root == null || dataObj.value == null) {
      return result;
    }

    var data = dataObj.value.data;
    var keys = dataObj.value.metadata.map(function (value) {
      return value.key;
    });

    if (data.length === keys.length) {
      var skipPostProcessing = this._handleFetchSuccess(data, keys,
        (dataObj.done || dataObj.maxCountLimit), templateEngine, dataObj.isMouseWheel);

      if (this._isLoadMoreOnScroll()) {
        if (!dataObj.done) {
          // if number of items returned is zero but result indicates it's not done
          // log it
          if (keys != null && keys.length === 0) {
            Logger.info('handleFetchedData: zero data returned while done flag is false');
          }

          // always append the loading indicator at the end except the case when max limit has been reached
          if (!skipPostProcessing && !dataObj.maxCountLimit) {
            if (this.m_domScroller == null) {
              this._registerDomScroller();

              // in Safari, handleResize would not get invoked with the initial width/height
              // call getRootElementHeight method to trigger height caching
              this._getRootElementHeight();
            }
            this._appendLoadingIndicator();
          }
        }

        if (dataObj.maxCountLimit) {
          this._handleScrollerMaxRowCount();
        }
      }

      this.fetchEnd(skipPostProcessing);

      // disable tabbable elements once the fetched items are rendered
      this.disableAllTabbableElements();
    }

    return result;
  };

IteratingDataProviderContentHandler.prototype.disableAllTabbableElements = function () {
  var lastItemIndex = this.m_root.childElementCount;
  if (this.m_root.lastElementChild && this.m_root.lastElementChild.getAttribute('role') === 'presentation') {
    lastItemIndex -= 1;
  }

  var self = this;
  var busyContext = Context.getContext(this.m_root).getBusyContext();
  busyContext.whenReady().then(function () {
    if (self.m_root != null) {
      var children = self.m_root.children;
      for (var i = lastItemIndex; i < children.length; i++) {
        self.m_widget.disableAllTabbableElements(children[i]);
      }
    }
  });
};

/**
 * Do any logic after items are inserted into the DOM
 * @private
 */
IteratingDataProviderContentHandler.prototype.afterItemsInserted = function () {
  if (this.m_widget) {
    this.m_widget.renderComplete();

    // process any outstanding events
    this._processEventQueue();

    // check viewport
    var self = this;
    var promise = this.checkViewport();
    if (promise && this._isLoadMoreOnScroll()) {
      promise.then(function (result) {
        // the height of the stamp could be contracted and if that's the case we could
        // potentially have an underflow
        if (result == null) {
          var busyContext = Context.getContext(self.m_root).getBusyContext();
          var viewportCheckPromise = busyContext.whenReady();
          viewportCheckPromise.then(function () {
            if (self.m_viewportCheckPromise != null) {
              self.checkViewport();
            }
          });
          self.m_viewportCheckPromise = viewportCheckPromise;
        }
      });
    }
  }
};

/**
 * Do any logic needed after results from fetch are processed
 * @private
 */
IteratingDataProviderContentHandler.prototype.fetchEnd = function (skipPostProcessing) {
  // fetch is done
  this._setFetching(false);

  if (!skipPostProcessing) {
    this.afterItemsInserted();
  }

  this.signalTaskEnd(); // signal fetch end. Started in either fetchRows() or started as a dummy task whenever this method is called without fetching rows first (e.g. see m_domScrollerMaxCountFunc).
};

/**
 * Checks the viewport for card layout case
 * @private
 */
IteratingDataProviderContentHandler.prototype._checkHorizontalViewport = function () {
  if (this.isCardLayout()) {
    var items = this.m_root.children;
    var styleClass = this.m_widget.getItemElementStyleClass();
    var lastItem;
    for (var i = items.length - 1; i >= 0; i--) {
      if (items[i].classList.contains(styleClass)) {
        lastItem = items[i];
        break;
      }
    }

    if (lastItem) {
      var scroller = this._getScroller();
      var offsetHeight = (scroller === this.m_root) ? this._getRootElementHeight()
        : scroller.offsetHeight;
      var scrollTop = scroller.scrollTop;
      var offsetTop = lastItem.offsetTop;
      if (offsetTop > scrollTop && offsetTop < scrollTop + offsetHeight) {
        return this.m_domScroller._fetchMoreRows();
      }
    }
  }
  return null;
};

/**
 * Checks the viewport to see if additional fetch is needed
 * @protected
 */
IteratingDataProviderContentHandler.prototype.checkViewport = function () {
  var self = this;

  // if we are already in the process of fetch due to checkViewport, bail
  if (this.m_checkViewportPromise) {
    return null;
  }

  this.signalTaskStart('checking viewport'); // signal method task start

  // if loadMoreOnScroll then check if we have underflow and do a fetch if we do
  var fetchPromise;
  if (this.m_domScroller != null && this.IsReady()) {
    fetchPromise = this.m_domScroller.checkViewport();
    if (fetchPromise != null) {
      this.signalTaskStart('got promise from checking viewport'); // signal fetchPromise started. Ends in promise resolution below
      fetchPromise.then(function (result) {
        // make sure listview is not destroyed yet
        if (self.m_widget != null) {
          if (result != null) {
            self.m_checkViewportPromise = null;
            self.handleDomScrollerFetchedData(result);
          } else {
            fetchPromise = self._checkHorizontalViewport();
            if (fetchPromise != null) {
              self.signalTaskStart('got promise from checking horizontal viewport');
              fetchPromise.then(function (moreResult) {
                self.m_checkViewportPromise = null;
                if (self.m_widget != null && moreResult != null) {
                  self.handleDomScrollerFetchedData(moreResult);
                }
                self.signalTaskEnd();
              }, null);
            } else {
              self.m_checkViewportPromise = null;
            }
          }
          self.signalTaskEnd(); // signal checkViewport task end. Started above before fetchPromise resolves here;
        }
      }, null);
    }

    this.m_checkViewportPromise = fetchPromise;
  }

  this.signalTaskEnd(); // signal method task end

  return fetchPromise;
};

;return {
  'DataProviderContentHandler': DataProviderContentHandler,
  'IteratingDataProviderContentHandler': IteratingDataProviderContentHandler
};
});