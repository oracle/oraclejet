/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'require', 'ojs/ojcomponentcore', 'ojs/ojdomscroller', 'ojs/ojanimation', 'promise', 'ojs/ojdataprovideradapter', 'ojs/ojkeyset'], function(oj, $, require){
/**
 * Base class for TableDataSourceContentHandler and TreeDataSourceContentHandler
 * Handler for DataSource generated content
 * @constructor
 * @ignore
 */
oj.DataSourceContentHandler = function(widget, root, data)
{
    this.m_root = root;
    this.m_widget = widget;

    this.m_fetching = false;

    this.setDataSource(data);
    this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.DataSourceContentHandler, oj.Object, "oj.DataSourceContentHandler");

/**
 * Initializes the instance.
 * @export
 */
oj.DataSourceContentHandler.prototype.Init = function()
{
    oj.DataSourceContentHandler.superclass.Init.call(this);
};

/**
 * Handles when the container has resize
 * @param {number} width the new width
 * @param {number} height the new height
 * @protected
 */
oj.DataSourceContentHandler.prototype.HandleResize = function(width, height)
{
    // by default do nothing, to be override by subclass
};

/**
 * Handles when the listview is shown due to for example CSS changes (inside a dialog)
 */
oj.DataSourceContentHandler.prototype.notifyShown = function()
{
    // by default do nothing, to be override by subclass
};

/**
 * Handles when the listview is re-attached to the DOM (ex: when a children of CCA gets re-attached from slotting)
 */
oj.DataSourceContentHandler.prototype.notifyAttached = function()
{
    // by default do nothing, to be override by subclass
};

/**
 * Cleanse all items under the root node
 */
oj.DataSourceContentHandler.prototype.cleanItems = function(templateEngine)
{
    var children, i;

    if (templateEngine === undefined)
    {
        templateEngine = this.getTemplateEngine();
    }

    if (templateEngine && this.m_root)
    {
        children = this.m_root.childNodes;
        for (i = 0; i < children.length; i++) 
        {
            templateEngine.clean(children[i]);
        }
    }
};

/**
 * Destroy the content handler
 * @protected
 */
oj.DataSourceContentHandler.prototype.Destroy = function()
{
    // this.m_root was changed in RenderContent
    if (this.m_superRoot != null)
    {
        this.m_root = this.m_superRoot;
    }

    this.cleanItems();
    $(this.m_root).empty(); // @HTMLUpdateOK
    this.m_widget = null;
    this.m_root = null;
    this.m_superRoot = null;
};

/**
 * Determines whether the content handler is in a ready state
 * @return {boolean} true if there's no outstanding fetch, false otherwise.
 * @protected
 */
oj.DataSourceContentHandler.prototype.IsReady = function()
{
    return !this.m_fetching;
};

/**
 * @private
 */
oj.DataSourceContentHandler.prototype.setRootAriaProperties = function()
{
    if (this.shouldUseGridRole())
    {
        this.m_root.setAttribute("role", "grid");
    }
    else
    {
        if (this.IsHierarchical())
        {
            this.m_root.setAttribute("role", "tree");
        }
        else
        {
            this.m_root.setAttribute("role", "listbox");
        }
    }
};

/**
 * Renders the content inside the list
 * @protected
 */
oj.DataSourceContentHandler.prototype.RenderContent = function()
{
    var presentation, row;

    this.signalTaskStart("rendering content"); // signal method task start

    this.setRootAriaProperties();
    if (this.shouldUseGridRole() && this.isCardLayout() && !this.IsHierarchical())
    {
        // in card layout, this is going to be a single row, N columns grid
        // so we'll need to wrap all <li> within a row
        presentation = document.createElement("li");
        row = document.createElement("ul");
        presentation.appendChild(row); //@HTMLUpdateOK 
        $(presentation).attr("role", "presentation")
                       .css("width", "100%");
        $(row).attr("role", "row")
              .addClass(this.m_widget.getGroupStyleClass());

        this.m_root.appendChild(presentation); //@HTMLUpdateOK
        this.m_superRoot = this.m_root;
        this.m_root = row;
    }
    this.fetchRows(false);
    this.signalTaskEnd(); // signal method task end
};

/**
 * Retrieve the key given the item element
 * @param {Element} element
 * @return {Object|null}
 * @protected
 */
oj.DataSourceContentHandler.prototype.GetKey = function(element)
{
    // should be in the element
    return element.key;
};

oj.DataSourceContentHandler.prototype.FindElementByKey = function(key)
{
    var children, i, elem;

    children = $(this.m_root).find("."+this.m_widget.getItemElementStyleClass());
    for (i=0; i<children.length; i++)
    {
        elem = children[i];
        // use == for the string number compare case
        if (key == this.GetKey(elem) || oj.Object.compareValues(key, this.GetKey(elem)))
        {
            return elem;
        }
    }

    return null;
};

oj.DataSourceContentHandler.prototype.getDataSource = function()
{
    return this.m_dataSource;
};

/**
 * @protected
 */
oj.DataSourceContentHandler.prototype.setDataSource = function(dataSource)
{
    this.m_dataSource = dataSource;
};

/**
 * Initiate loading of the template engine.  An error is thrown if the template engine failed to load.
 * @return {Promise} resolves to the template engine, or null if:
 *                   1) there's no need because no item template is specified 
 *                   2) a renderer is present which takes precedence
 * @protected
 */
oj.DataSourceContentHandler.prototype.loadTemplateEngine = function()
{
    var self = this;

    if (this.m_widget.getItemTemplate() != null && this.m_widget._getItemRenderer() == null)
    {
        return new Promise(function(resolve, reject)
        {
            oj.Config.__getTemplateEngine().then(
                function(engine)
                {
                    self.m_engine = engine;
                    resolve(engine);
                },
                function(reason)
                {
                    throw "Error loading template engine: "+reason;
                }
            );
        });
    }

    return Promise.resolve(null);
};

/**
 * Retrieve the template engine, returns null if it has not been loaded yet
 */
oj.DataSourceContentHandler.prototype.getTemplateEngine = function()
{
    return this.m_engine;
};

oj.DataSourceContentHandler.prototype.fetchRows = function(forceFetch)
{
    this.m_widget.showStatusText();
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
oj.DataSourceContentHandler.prototype.addItem = function(parentElement, index, data, metadata, templateEngine, callback)
{
    var item, referenceNode, childElements, position;

    item = document.createElement("li");
    $(item).uniqueId();
    if (index === -1)
    {
        referenceNode = null;
    }
    else
    {
        childElements = $(parentElement).children('.'+this.m_widget.getItemElementStyleClass()+', .'+this.m_widget.getEmptyTextStyleClass()+', .oj-listview-temp-item');
        referenceNode = (index === childElements.length) ? null : childElements[index];
    }
    this.m_widget.BeforeInsertItem();
    parentElement.insertBefore(item, referenceNode); // @HTMLUpdateOK
    position = $(parentElement).children().index(item);
    return this._addOrReplaceItem(item, position, parentElement, index, data, metadata, templateEngine, callback);
};

/**
 * Replace an existing list item in the list
 * @param {Element} item the list item to change
 * @param {number} index the index of the item
 * @param {Object|null} data the data for the item
 * @param {Object} metadata the set of metadata for the item
 * @param {Object} templateEngine the template engine to process inline template
 * @param {function(Element, Object)=} callback optional callback function to invoke after item is added 
 * @protected
 */
oj.DataSourceContentHandler.prototype.replaceItem = function(item, index, data, metadata, templateEngine, callback)
{
    var parentElement, position, newItem;

    // animate hiding of existing item first
    this.signalTaskStart("replace item"); // signal replace item animation start. Ends in _handleReplaceTransitionEnd() defined in TableDataSourceContentHandler

    // now actually replace the item
    parentElement = item.parentNode;
    position = $(parentElement).children().index(item);
    newItem = document.createElement("li");

    // explicit clean when inline template is used
    if (templateEngine)
    {
        templateEngine.clean(item);
    }
 
    // this should trigger ko.cleanNode if applicable
    $(item).replaceWith(newItem); //@HTMLUpdateOK; newItem is constructed by the component and not yet manipulated by the application

    this._addOrReplaceItem(newItem, position, parentElement, index, data, metadata, templateEngine, callback);    
};

/**
 * Handles both add and replace item
 * @private
 */
oj.DataSourceContentHandler.prototype._addOrReplaceItem = function(item, position, parentElement, index, data, metadata, templateEngine, callback)
{
    var contentContainer, context, inlineStyle, styleClass, renderer, templateElement, content, textWrapper, componentElement, bindingContext, nodes, i;

    if (callback == undefined)
    {
        callback = this.afterRenderItem.bind(this);
    }

    context = this.createContext(position, data, metadata, item);
    renderer = this.m_widget._getItemRenderer();
    templateElement = this.m_widget.getItemTemplate();
    if (renderer != null)
    {
        // if an element is returned from the renderer and the parent of that element is null, we will append 
        // the returned element to the parentElement.  If non-null, we won't do anything, assuming that the 
        // rendered content has already added into the DOM somewhere.
        content = renderer.call(this, context);
        if (content != null)
        {
            // allow return of document fragment from jquery create/js document.createDocumentFragment
            if (content['parentNode'] === null || content['parentNode'] instanceof DocumentFragment)
            {
                item.appendChild(content); // @HTMLUpdateOK
            }
            else if (content['parentNode'] != null)
            {
                // parent node exists, do nothing
            }                
            else if (content.toString)
            {
                textWrapper = document.createElement("span");
                textWrapper.appendChild(document.createTextNode(content.toString())); // @HTMLUpdateOK
                item.appendChild(textWrapper); // @HTMLUpdateOK
            }
        }
    }
    else if (templateElement != null && templateEngine != null)
    {
        componentElement = this.m_widget.getRootElement()[0];
        bindingContext = this.GetBindingContext(context);
        nodes = templateEngine.execute(componentElement, templateElement, bindingContext, this.m_widget.GetOption("as"));

        for (i=0; i<nodes.length; i++)
        {
            if (nodes[i].tagName === "LI")
            {
                parentElement.replaceChild(nodes[i], item);
                break;
            }
            else
            {
                item.appendChild(nodes[i]);
            }
        }
    }
    else
    {
        textWrapper = document.createElement("span");
        textWrapper.appendChild(document.createTextNode(data == null ? "" : data.toString())); // @HTMLUpdateOK
        item.appendChild(textWrapper); // @HTMLUpdateOK
    }

    // get the item from root again as template replaces the item element
    item = parentElement.children ? parentElement.children[position] : this._getItemFromDocumentFragment(parentElement, position);
    context['parentElement'] = item;

    // cache data in item element, this is needed for getDataForVisibleItem.
    $.data(item, "data", data);

    // do any post processing
    callback(item, context);

    return {item: item, context: context};
};

/**
 * In IE/Safari, DocumentFragment does not support children property
 * @private
 */
oj.DataSourceContentHandler.prototype._getItemFromDocumentFragment = function(fragment, index)
{
    var nodes, node, i = 0, nodeIndex = 0;

    nodes = fragment.childNodes;
    while (node = nodes[i++]) 
    {
        if (node.nodeType === 1) 
        {
            if (nodeIndex === index)
            {
        	return node;
            }
            nodeIndex++;
        }
    }	
    return null;
}

/**
 * Creates a binding context based on context object
 * To be override by different ContentHandler
 * @protected
 */
oj.DataSourceContentHandler.prototype.GetBindingContext = function(context)
{
    var current = {};
    current['data'] = context['data'];
    current['index'] = context['index'];
    current['key'] = context['key'];
    current['componentElement'] = context['componentElement'];

    return current;
};

oj.DataSourceContentHandler.prototype.afterRenderItem = function(item, context)
{
    var elem;

    // save the key in the element (cannot use data- here since it could be a non-string)
    item.key = context['key'];

    item = $(item);
    item.uniqueId();

    // if there's only one element inside the item and it is focusable, set
    // the role on it instead
    elem = this.m_widget.getSingleFocusableElement(item);

    if (this.shouldUseGridRole())
    {
        if (context['leaf'] != undefined && !context['leaf'])
        {
            // it's a group item
            item.attr("role", "presentation");
        }
        else
        {
            if (this.isCardLayout())
            {
                elem.attr("role", "gridcell");
            }
            else
            {
                item.attr("role", "row");
                if (elem != item)
                {
                    elem.attr("role", "gridcell");
                }
                else 
                {
                    // we'll need to wrap content with a gridcell role
                    elem.children().wrapAll("<div role='gridcell' class='oj-listview-cell-element'></div>"); //@HTMLUpdateOK
                }
            }
        }
    }
    else
    {
        elem.attr("role", this.IsHierarchical() ? "treeitem" : "option");
        if (elem != item)
        {
            item.attr("role", "presentation");
        }
    }

    elem.addClass(this.m_widget.getFocusedElementStyleClass());

    // tag it if item is not focusable
    if (!this.isFocusable(context))
    {
        item.addClass("oj-skipfocus");
    }

    item.addClass(this.m_widget.getItemElementStyleClass());
};

oj.DataSourceContentHandler.prototype.createContext = function(index, data, metadata, elem)
{
    var context, prop;
    
    context = {
    };
    context['parentElement'] = elem;
    context['index'] = index;
    context['data'] = data;
    context['component'] = this.m_widget.getWidgetConstructor();
    context['datasource'] = this.getDataSource();
    context = this.m_widget._FixRendererContext(context);

    // merge properties from metadata into cell context
    // the properties in metadata would have precedence
    for (prop in metadata) 
    {
        if (metadata.hasOwnProperty(prop)) 
        {
            context[prop] = metadata[prop];   
        }
    }

    return context;
};

oj.DataSourceContentHandler.prototype.isFocusable = function(context)
{
    return this.m_widget.getItemFocusable(context);
};

oj.DataSourceContentHandler.prototype.isSelectable = function(context)
{
    return this.m_widget.getItemSelectable(context);
};

oj.DataSourceContentHandler.prototype.isCardLayout = function()
{
    return this.m_widget.isCardLayout();
};

oj.DataSourceContentHandler.prototype.shouldUseGridRole = function()
{
    return this.m_widget.ShouldUseGridRole();
};

oj.DataSourceContentHandler.prototype.isAsyncRendering = function()
{
    return false;
//    return this.m_widget.ojContext._IsCustomElement() && this.shouldUseGridRole();
};

oj.DataSourceContentHandler.prototype.signalTaskStart = function(description)
{
    if (this.m_widget) // check that widget exists (e.g. not destroyed)
    {
        this.m_widget.signalTaskStart("DataSource ContentHandler "+description);
    }
};

oj.DataSourceContentHandler.prototype.signalTaskEnd = function()
{
    if (this.m_widget) // check that widget exists (e.g. not destroyed)
    {
        this.m_widget.signalTaskEnd();
    }
};
/**
 * Handler for TreeDataSource generated content
 * @constructor
 * @extends oj.DataSourceContentHandler
 * @ignore
 */
oj.TreeDataSourceContentHandler = function(widget, root, data)
{
    oj.TreeDataSourceContentHandler.superclass.constructor.call(this, widget, root, data);
};

// Subclass from oj.DataSourceContentHandler 
oj.Object.createSubclass(oj.TreeDataSourceContentHandler, oj.DataSourceContentHandler, "oj.TreeDataSourceContentHandler");

/**
 * Initializes the instance.
 * @protected
 */
oj.TreeDataSourceContentHandler.prototype.Init = function()
{
  oj.TreeDataSourceContentHandler.superclass.Init.call(this);
};

/**
 * Determines whether the conent is hierarchical.
 * @return {boolean} returns true if content is hierarhical, false otherwise.
 * @protected
 */
oj.TreeDataSourceContentHandler.prototype.IsHierarchical = function()
{
    return true;
};

/**
 * @protected
 */
oj.TreeDataSourceContentHandler.prototype.fetchRows = function(forceFetch)
{
    this.signalTaskStart("fetching rows"); // signal method task start

    oj.TreeDataSourceContentHandler.superclass.fetchRows.call(this, forceFetch);

    this.fetchChildren(0, null, this.m_root, null);

    this.signalTaskEnd(); // signal method task end
};

oj.TreeDataSourceContentHandler.prototype.fetchChildren = function(start, parent, parentElem, successCallback)
{
    var promise, anchor, collapseClass, expandingClass, range, self = this;

    this.signalTaskStart("fetching children from index: "+start); // signal method task start

    // initiate loading of template engine, note it will not load it unless a template has been specified
    promise = this.loadTemplateEngine();

    // root node would not have expand/collapse icon
    if (parent != null)
    {
        anchor = parentElem.parentNode.firstElementChild.firstElementChild.firstElementChild;
        if (anchor)
        {
            anchor = $(anchor);
            collapseClass = this.m_widget.getCollapseIconStyleClass();
            // switch to loading icon
            if (anchor.hasClass(collapseClass))
            {
                expandingClass = this.m_widget.getExpandingIconStyleClass();
                anchor.removeClass(collapseClass)
                      .addClass(expandingClass);
            }
        }
    } 

    // no need to check ready since multiple fetch from different parents can occur at the same time
    this.m_fetching = true;

    range = {"start": start, "count": this.m_dataSource.getChildCount(parent)};

    this.signalTaskStart("first fetch"); 

    this.m_dataSource.fetchChildren(parent, range, {"success": function(nodeSet){
        promise.then(function(templateEngine)
        {
            self._handleFetchSuccess(nodeSet, parent, parentElem, successCallback, templateEngine);
            self.signalTaskEnd(); // first fetch
        })
    }, "error": function(status)
    {
        self._handleFetchError(status);
        self.signalTaskEnd(); // first fetch
    }});

    this.signalTaskEnd(); // signal method task end
};

oj.TreeDataSourceContentHandler.prototype._handleFetchSuccess = function(nodeSet, parent, parentElem, successCallback, templateEngine)
{
    var self = this, start, count, endIndex, fragment, i, data, metadata, gridcell, postProcessing, busyContext;

    // listview might have been destroyed before fetch success is handled
    if (this.m_widget == null)
    {
        return;
    }

    this.signalTaskStart("handling successful fetch"); // signal method task start

    start = nodeSet.getStart();
    count = nodeSet.getCount();
    endIndex = start+count;

    // walk the node set
    fragment = document.createDocumentFragment();
    for (i=0; i<count; i++)
    {
        data = nodeSet.getData(start+i);
        metadata = nodeSet.getMetadata(start+i);
        // pass -1 for opt since we know it will be inserted at the end of its parent
        this.addItem(fragment, -1, data, metadata, templateEngine);
    }
    parentElem.appendChild(fragment);

    // update aria-colspan on the gridcell representing the group header
    if (this.shouldUseGridRole() && this.isCardLayout() && parent != null && count > 1)
    {
        gridcell = parentElem.parentNode.firstElementChild.firstElementChild;
        $(gridcell).attr("aria-colspan", count);
    }

    // fetch is done
    this.m_fetching = false;

    postProcessing = function()
    {
        if (self.m_widget)
        {
            // if a callback is specified (as it is in the expand case), then invoke it
            if (successCallback != null)
            {
                successCallback.call(null, parentElem);
            }

            self.m_widget.renderComplete();            
        }
    };

    if (this.isAsyncRendering())
    {
        // custom elements renders async so this is needed.  
        // Also, since the root for non-custom element is <ul>, when application do a whenReady within the context
        // of <ul>, the postProcessing might be called after application's whenReady handler.
        busyContext = oj.Context.getContext(this.m_root).getBusyContext();
        busyContext.whenReady().then(function()
        {
            postProcessing();
        });        
    }
    else
    {
        postProcessing();
    }

    this.m_initialized = true;

    this.signalTaskEnd(); // signal method task end
};

/**
 * Creates a binding context based on context object
 * To be override by different ContentHandler
 * @protected
 */
oj.TreeDataSourceContentHandler.prototype.GetBindingContext = function(context)
{
    var bindingContext = oj.TreeDataSourceContentHandler.superclass.GetBindingContext.call(this, context);
    bindingContext['depth'] = context['depth'];
    bindingContext['leaf'] = context['leaf'];
    bindingContext['parentKey'] = context['parentKey'];

    return bindingContext;
};

oj.TreeDataSourceContentHandler.prototype.afterRenderItem = function(item, context)
{
    var groupStyleClass, itemStyleClass, groupItemStyleClass, groupCollapseStyleClass, focusedStyleClass,
        collapseClass, content, icon, groupItem;

    this.signalTaskStart("after rendering an item"); // signal method task start

    oj.TreeDataSourceContentHandler.superclass.afterRenderItem.call(this, item, context);

    groupStyleClass = this.m_widget.getGroupStyleClass();
    itemStyleClass = this.m_widget.getItemStyleClass();
    groupItemStyleClass = this.m_widget.getGroupItemStyleClass(true);
    groupCollapseStyleClass = this.m_widget.getGroupCollapseStyleClass();
    collapseClass = this.m_widget.getCollapseIconStyleClass();
    focusedStyleClass = this.m_widget.getFocusedElementStyleClass();

    item = $(item);

    if (context['leaf'] == false)
    {
        item.children().wrapAll("<div></div>"); //@HTMLUpdateOK

        // collapsed by default
        if(item.hasClass(focusedStyleClass))
        {
            item.removeClass(focusedStyleClass)
                .children().first()
                .addClass(focusedStyleClass)
                .attr("aria-expanded", "false");
        }
        else{
            item.children().first()
                    .attr("role","presentation")
                    .find("." + focusedStyleClass)
                    .attr("aria-expanded", "false");
        }

        content = item.children().first();
        content.uniqueId()
               .addClass(groupItemStyleClass);

        // add the expand icon
        if (this.m_widget.isExpandable())
        {
            item.addClass("oj-collapsed")

            icon = document.createElement("a");
            $(icon).attr("href", "#")
                   .attr("aria-labelledby", content.get(0).id)
                   .addClass("oj-component-icon oj-clickable-icon-nocontext")
                   .addClass(collapseClass);
        
            content.prepend(icon); //@HTMLUpdateOK               
        }

        if (this.shouldUseGridRole())
        {
            content.get(0).removeAttribute("aria-expanded");
            content.removeClass(focusedStyleClass);
            content.attr("role", "row");
            content.children().wrapAll("<div role='gridcell' aria-expanded='false' class='oj-listview-cell-element "+focusedStyleClass+"'></div>"); //@HTMLUpdateOK
        }

        // the yet to be expand group element
        groupItem = document.createElement("ul");
        $(groupItem).addClass(groupStyleClass)
                    .addClass(groupCollapseStyleClass)
                    .attr("role", this.shouldUseGridRole() ? (this.isCardLayout() ? "row" : "presentation") : "group");
        item.append(groupItem); //@HTMLUpdateOK
    }            
    else if (context['leaf'] == true)
    {
        item.addClass(itemStyleClass);
    }

    if (this.m_widget._isSelectionEnabled() && this.isSelectable(context))
    {
        this.m_widget.getFocusItem(item).attr("aria-selected", false);
    }

    // callback to widget
    this.m_widget.itemRenderComplete(item[0], context);

    this.signalTaskEnd(); // signal method task end
};

oj.TreeDataSourceContentHandler.prototype._handleFetchError = function(status)
{
    // listview might have been destroyed before fetch error is handled
    if (this.m_widget == null)
    {
        oj.Logger.info("handleFetchError: widget has already been destroyed");
        return;
    }

    this.signalTaskStart("handling fetch error: "+status); // signal method task start

    // TableDataSource aren't giving me any error message
    oj.Logger.error(status);

    this.m_widget.renderComplete();

    this.signalTaskEnd(); // signal method task end
};

oj.TreeDataSourceContentHandler.prototype.Expand = function(item, successCallback)
{
    var parentKey, parentElem;

    this.signalTaskStart("expanding an item"); // signal method task start

    parentKey = this.GetKey(item[0]);
    parentElem = item.children("ul")[0];
    this.fetchChildren(0, parentKey, parentElem, successCallback);

    this.signalTaskEnd(); // signal method task end
};

oj.TreeDataSourceContentHandler.prototype.Collapse = function(item)
{
    // template engine should have already been loaded
    var templateEngine = this.getTemplateEngine();
    if (templateEngine)
    {
        templateEngine.clean(item.get(0));
    }

    // remove all children nodes
    item.empty(); //@HTMLUpdateOK
};

/**
 * Handler for static HTML content
 * @constructor
 * @ignore
 */
oj.StaticContentHandler = function(widget, root)
{
    this.m_widget = widget;
    this.m_root = root;
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.StaticContentHandler, oj.Object, "oj.StaticContentHandler");

/**
 * Initializes the instance.
 * @protected
 */
oj.StaticContentHandler.prototype.Init = function()
{
  oj.StaticContentHandler.superclass.Init.call(this);
};

/**
 * Destroy the content handler
 * @protected
 */
oj.StaticContentHandler.prototype.Destroy = function()
{
    // check if it's been destroyed or in process
    if (!this.m_root.hasAttribute("role"))
    {
        return;
    }

    this.restoreContent(this.m_root, 0);
    this.unsetRootAriaProperties();

    if (this.shouldUseGridRole() && this.isCardLayout() && !this.IsHierarchical())
    {
        $(this.m_root).children().first().children().unwrap()
                      .children().unwrap();
    }    
};

/**
 * Determine whether the content handler is ready
 * @return {boolean} returns true there's no outstanding request, false otherwise.
 * @protected
 */
oj.StaticContentHandler.prototype.IsReady = function()
{
    // static content does not fetch
    return true;
};

oj.StaticContentHandler.prototype.HandleResize = function(width, height)
{
    // do nothing since all items are present
};

oj.StaticContentHandler.prototype.notifyShown = function()
{
    // do nothing since all items are present
};

oj.StaticContentHandler.prototype.notifyAttached = function()
{
    // do nothing since all items are present
};

oj.StaticContentHandler.prototype.RenderContent = function()
{
    var root = this.m_root;
    if (this.shouldUseGridRole() && this.isCardLayout() && !this.IsHierarchical() && $(root).children("li").length > 0)
    {
        // in card layout, this is going to be a single row, N columns grid
        // so we'll need to wrap all <li> within a row
        $(this.m_root).children().wrapAll("<li role='presentation' style='width:100%'><ul role='row' class='"+this.m_widget.getGroupStyleClass()+"'></ul></li>"); //@HTMLUpdateOK 
        root = $(this.m_root).children("li").first().children("ul").first().get(0);
    }
    this.modifyContent(root, 0);
    this.setRootAriaProperties();
    this.m_widget.renderComplete();
};

oj.StaticContentHandler.prototype.Expand = function(item, successCallback)
{
    var selector, groupItem;

    selector = "."+this.m_widget.getGroupStyleClass();
    groupItem = $(item).children(selector)[0];
    $(groupItem).css("display", "");

    successCallback.call(null, groupItem);
};

oj.StaticContentHandler.prototype.Collapse = function(item)
{
    // nothing to do
};

oj.StaticContentHandler.prototype.IsHierarchical = function()
{
    if (this.m_hier == null)
    {
        this.m_hier = $(this.m_root).children("li").children("ul").length > 0;
    }
    return this.m_hier;
};

/**
 * Restore the static content into its original format by removing all ListView specific style classes and attributes.
 * @param {Element} elem the element it is currently restoring
 * @param {number} depth the depth of the element it is currently restoring
 * @private
 */
oj.StaticContentHandler.prototype.restoreContent = function(elem, depth)
{
    var groupStyleClass, groupCollapseStyleClass, groupExpandStyleClass, groupItemStyleClass, itemStyleClass, itemElementStyleClass,
        items, i, item, groupItems, groupItem;

    groupStyleClass = this.m_widget.getGroupStyleClass();
    groupCollapseStyleClass = this.m_widget.getGroupCollapseStyleClass();
    groupExpandStyleClass = this.m_widget.getGroupExpandStyleClass();
    groupItemStyleClass = this.m_widget.getGroupItemStyleClass(true);
    itemStyleClass = this.m_widget.getItemStyleClass();
    itemElementStyleClass = this.m_widget.getItemElementStyleClass();

    items = elem.children;
    for (i=0; i<items.length; i++)
    {
        item = $(items[i]);
        // skip children that are not modified, this could happen if ko:foreach backed by an observable array is used to generate
        // the content, and the observable array has changed
        if (!item.hasClass(itemElementStyleClass))
        {
            continue;
        }

        this.unsetAriaProperties(item.get(0));
        item.removeClass(itemElementStyleClass)
            .removeClass(itemStyleClass)
            .removeClass(this.m_widget.getDepthStyleClass(depth))
            .removeClass("oj-skipfocus")
            .removeClass("oj-focus")
            .removeClass("oj-hover")
            .removeClass("oj-expanded")
            .removeClass("oj-collapsed")
            .removeClass("oj-selected");

        groupItems = item.children("ul");
        if (groupItems.length > 0)
        {
            item.children("."+groupItemStyleClass).children().unwrap();      
            if (this.shouldUseGridRole())
            {
                this.unsetGroupAriaProperties(item);
            }
            item.children(".oj-component-icon").remove();

            groupItem = $(groupItems[0]);
            groupItem.removeClass(groupStyleClass)
                     .removeClass(groupExpandStyleClass)
                     .removeClass(groupCollapseStyleClass)
                     .removeAttr("role");
            this.restoreContent(groupItem[0], depth+1);
        }
    }
};

/**
 * Modify the static content to include ListView specific style classes and attributes.
 * @param {Element} elem the element it is currently modifying
 * @param {number} depth the depth of the element it is currently modifying
 * @private
 */
oj.StaticContentHandler.prototype.modifyContent = function(elem, depth)
{
    var itemStyleClass, itemElementStyleClass, groupStyleClass, groupItemStyleClass, groupCollapseStyleClass, collapseClass, focusedElementStyleClass,
        items, expandable, i, item, context, groupItems, content, icon, groupItem, count;

    itemStyleClass = this.m_widget.getItemStyleClass();
    itemElementStyleClass = this.m_widget.getItemElementStyleClass();
    groupStyleClass = this.m_widget.getGroupStyleClass();
    groupItemStyleClass = this.m_widget.getGroupItemStyleClass(true);
    groupCollapseStyleClass = this.m_widget.getGroupCollapseStyleClass();
    collapseClass = this.m_widget.getCollapseIconStyleClass();
    focusedElementStyleClass = this.m_widget.getFocusedElementStyleClass();

    items = elem.children;
    expandable = this.m_widget.isExpandable();

    for (i=0; i<items.length; i++)
    {
        item = $(items[i]);
        context = this.createContext(item);

        this.setAriaProperties(item, context);

        item.uniqueId()
            .addClass(itemElementStyleClass);
        if (depth > 0)
        {
            item.addClass(this.m_widget.getDepthStyleClass(depth));
        }

        // tag it if item is not focusable
        if (!this.isFocusable(context))
        {
            item.addClass("oj-skipfocus");
        }

        groupItems = item.children("ul");
        if (groupItems.length > 0)
        {
            this.m_hier = true;

            item.children(":not(ul)")
                .wrapAll("<div></div>"); //@HTMLUpdateOK

            content = item.children().first();
            content.addClass(groupItemStyleClass);

            count = this.getItemsCount(groupItems[0]);
            if (count > 0)
            {
                if(item.hasClass(focusedElementStyleClass)) 
                {
                    item.removeClass(focusedElementStyleClass);
                    content.addClass(focusedElementStyleClass).attr("aria-expanded", "false");
                } 
                else 
                {
                    content.attr("role","presentation");
                    content.find("."+focusedElementStyleClass).attr("aria-expanded", "false");
                }

                // add the expand icon
                if (expandable)
                {
                    item.addClass("oj-collapsed");

                    content.uniqueId();

                    // add the expand icon
                    icon = document.createElement("a");
                    $(icon).attr("href", "#")
                           .attr("role", "button")
                           .attr("aria-labelledby", content.get(0).id)
                           .addClass("oj-component-icon oj-clickable-icon-nocontext")
                           .addClass(collapseClass);
                                
                    content.prepend(icon); //@HTMLUpdateOK               
                }
            }            

            if (this.shouldUseGridRole())
            {
                this.setGroupAriaProperties(content, count);
            }

            groupItem = $(groupItems[0]);
            groupItem.addClass(groupStyleClass)
                     .addClass(groupCollapseStyleClass)
                     .attr("role", this.shouldUseGridRole() ? (this.isCardLayout() ? "row" : "presentation") : "group")
                     .css("display", "none");
            this.modifyContent(groupItem[0], depth+1);
        }
        else
        {
            item.addClass(itemStyleClass);
        }

        if (this.m_widget._isSelectionEnabled() && this.isSelectable(context))
        {
            this.m_widget.getFocusItem(item).attr("aria-selected", false);
        }

        this.m_widget.itemRenderComplete(item[0], context);
    }    
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.setRootAriaProperties = function()
{
    if (this.shouldUseGridRole())
    {
        this.m_root.setAttribute("role", "grid");
    }
    else
    {
        if (this.IsHierarchical())
        {
            this.m_root.setAttribute("role", "tree");
        }
        else
        {
            this.m_root.setAttribute("role", "listbox");
        }
    }
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.unsetRootAriaProperties = function()
{
    this.m_root.removeAttribute("role");
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.getItemsCount = function(item)
{
    return $(item).children("li").length;
};

/**
 * Creates the object with context information for the specified item
 * @param {jQuery} item the item to create context info object for
 * @return {Object} the context object
 * @private
 */
oj.StaticContentHandler.prototype.createContext = function(item)
{
    var context, parents;

    context = {};
    context['key'] = item.attr('id');
    context['parentElement'] = item.children().first()[0];
    context['index'] = item.index();
    context['data'] = item[0];
    context['component'] = this.m_widget.getWidgetConstructor();
    context = this.m_widget._FixRendererContext(context);

    // additional context info for hierarhical data
    if (this.IsHierarchical())
    {
        context['leaf'] = item.children("ul").length == 0;        
        parents = item.parents("li."+this.m_widget.getItemElementStyleClass());
        context['depth'] = parents.length;
        if (parents.length == 0)
        {
            context['parentKey'] = null;
        }
        else
        {
            context['parentKey'] = parents.first().attr('id');
        }     
    }

    return context;
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.setAriaProperties = function(item, context)
{
    // if there's only one element inside the item and it is focusable, set
    // the role on it instead
    var elem = this.m_widget.getSingleFocusableElement(item);
    if (this.shouldUseGridRole())
    {
        if (context['leaf'] != undefined && !context['leaf'])
        {
            // it's a group item
            item.attr("role", "presentation");
            if (elem != item)
            {
                elem.attr("role", "gridcell");
            }
        }
        else
        {
            if (this.isCardLayout())
            {
                elem.attr("role", "gridcell");
            }
            else
            {
                item.attr("role", "row");
                if (elem != item)
                {
                    elem.attr("role", "gridcell");
                }
                else
                {
                    // we'll need to wrap content with a gridcell role
                    elem.children().wrapAll("<div role='gridcell' class='oj-listview-cell-element'></div>"); //@HTMLUpdateOK
                }     
            }
        }
    }
    else
    {
        elem.attr("role", this.IsHierarchical() ? "treeitem" : "option");
        if (elem != item)
        {
            item.attr("role", "presentation");
        }
    }

    elem.addClass(this.m_widget.getFocusedElementStyleClass());
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.setGroupAriaProperties = function(group, count)
{
    var focusedElementStyleClass = this.m_widget.getFocusedElementStyleClass();

    // aria-expanded should be in the cell
    group.get(0).removeAttribute("aria-expanded");
    group.removeClass(focusedElementStyleClass);
    group.attr("role", "row");
    group.children().wrapAll("<div role='gridcell' aria-expanded='false' class='oj-listview-cell-element "+focusedElementStyleClass+"'></div>"); //@HTMLUpdateOK

    if (this.isCardLayout() && count > 1)
    {
        group.children().first().attr("aria-colspan", count);
    }
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.unsetGroupAriaProperties = function(item)
{
    item.children("div").first().children().unwrap();
};

/**
 * @private
 */
oj.StaticContentHandler.prototype.unsetAriaProperties = function(item)
{
    var elem = this.m_widget.getSingleFocusableElement($(item));
    elem.removeAttr("role");
    elem.removeAttr("aria-selected");
    elem.removeAttr("aria-expanded");
    elem.removeClass(this.m_widget.getFocusedElementStyleClass());

    // need to unwrap since in non-card layout we wrap the content with a div for gridcell role
    if (this.shouldUseGridRole() && !this.isCardLayout())
    {
        if (elem != item)
        {
            $(item).removeAttr("role");
            elem.children().first().children().unwrap();
        }
        else
        {
            elem.children().first().children().unwrap()
                .children().unwrap();
        }
    }
};

oj.StaticContentHandler.prototype.GetKey = function(element)
{
    return $(element).attr("id");
};

oj.StaticContentHandler.prototype.FindElementByKey = function(key)
{
    return document.getElementById(key);
};

oj.StaticContentHandler.prototype.isFocusable = function(context)
{
    return this.m_widget.getItemFocusable(context);
};

oj.StaticContentHandler.prototype.isSelectable = function(context)
{
    return this.m_widget.getItemSelectable(context);
};

oj.StaticContentHandler.prototype.isCardLayout = function()
{
    return this.m_widget.isCardLayout();
};

oj.StaticContentHandler.prototype.shouldUseGridRole = function()
{
    return this.m_widget.ShouldUseGridRole();
};
/**
 * Partial Map impl, replace with ES6 Map when possible.
 * @constructor
 * @ignore
 */
oj.KeyMap = function()
{
};

oj.KeyMap.prototype.set = function(key, value)
{
    var index;

    if (this._mapKeys === undefined && this._mapValues === undefined)
    {
        this._mapKeys = [];
        this._mapValues = [];
    }

    index = this._mapKeys.indexOf(key);
    if (index > -1)
    {
        this._mapValues.splice(index, 1, value);
    }
    else
    {
        this._mapKeys.push(key);
        this._mapValues.push(value);
    }
};

oj.KeyMap.prototype.get = function(key)
{
    var index;
    if (this._mapKeys && this._mapValues)
    {
        index = this._mapKeys.indexOf(key);
        if (index > -1 && this._mapValues.length > index)
        {
            return this._mapValues[index];
        }
    }

    return null;
};

oj.KeyMap.prototype.deleteValue = function(value)
{
    var current = this._mapValues.indexOf(value);
    while (current > -1)
    {
        this._mapValues.splice(current, 1);
        this._mapKeys.splice(current, 1);
        current = this._mapValues.indexOf(value, current);
    }
};

/**
 * Default ExpandedKeySet class
 * Need a way to distinguish ExpandedKeySet set by application vs default one created by ListView
 * @extends {ExpandedKeySet}
 * @constructor
 * @ignore
 */
oj._ojListViewExpandedKeySet = function()
{
    oj._ojListViewExpandedKeySet.superclass.constructor.call(this);
};

// Subclass from KeySet
oj.Object.createSubclass(oj._ojListViewExpandedKeySet, oj.ExpandedKeySet, "ListViewExpandedKeySet");

/**
 * todo: create common utility class between combobox and listview
 * @private
 */
var _ListViewUtils = {
    clazz: function(SuperClass, methods)
    {
        var constructor = function() {};
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
oj._ojListView = _ListViewUtils.clazz(Object, 
/** @lends oj._ojListView.prototype */
{
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
    init: function(opts)
    {
        var self = this, dndContext;

        this.readinessStack = [];
        this.element = opts.element;
        this.ojContext = opts.ojContext;
        this.OuterWrapper = opts.OuterWrapper;
        this.options = opts;

        this.element
            .uniqueId()
            .addClass(this.GetStyleClass()+" oj-component-initnode");

        if (this.OuterWrapper)
        {
            this.element[0].setAttribute("data-oj-context", "");
        }
        this.signalTaskStart("Initializing"); // Move component out of ready state; component is initializing. End in afterCreate()

        this.SetRootElementTabIndex();
        dndContext = this.GetDnDContext();
        // listens for dnd events if ListViewDndContext is defined
        if (dndContext)
        {
            this.m_dndContext = dndContext;

            this.ojContext._on(this.element, {
                "dragstart": function(event) 
                {
                    return dndContext._handleDragStart(event);
                },
                "dragenter": function(event) 
                {
                    return dndContext._handleDragEnter(event);
                },
                "dragover": function(event) 
                {
                    return dndContext._handleDragOver(event);
                },
                "dragleave": function(event) 
                {
                    return dndContext._handleDragLeave(event);
                },
                "dragend": function(event) 
                {
                   //mouseup will not be invoked on drag so resetting it to false.
                    self.m_preActive = false;
                    return dndContext._handleDragEnd(event);
                },
                "drag": function(event) 
                {
                    return dndContext._handleDrag(event);
                },
                "drop": function(event) 
                {
                    //mouseup will not be invoked on drag so resetting it to false.  
                    self.m_preActive = false;
                    return dndContext._handleDrop(event);
                    
                }
            });
        }

        this.ojContext._on(this.element, {
            "click": function(event) 
            {
                self.HandleMouseClick(event);
            },
            "touchstart": function(event)
            {
                self.HandleMouseDownOrTouchStart(event);
            },
            "touchend": function(event)
            {
                self.HandleTouchEndOrCancel(event);
            },
            "touchcancel": function(event)
            {
                self.HandleTouchEndOrCancel(event);
            },
            "mousedown": function(event)
            {
                if (event.button === 0)
                {
                    if (!self._recentTouch())
                    {
                        self.HandleMouseDownOrTouchStart(event);
                    }
                }
                else
                {
                    // on right click we should prevent focus from shifting to first item
                    self.m_preActive = true;
                }
            },
            "mouseup": function(event)
            {
                self._handleMouseUpOrPanMove(event);
                self.m_preActive = false;
            },
            "mouseout": function(event) 
            {
                self._handleMouseOut(event);
            },
            "mouseover": function(event) 
            {
                self._handleMouseOver(event);
            },
            "keydown": function(event) 
            {
                self.HandleKeyDown(event);
            },
            "keyup": function(event) 
            {
                self.HandleKeyUp(event);
            },
            "ojpanmove": function(event)
            {
                self._handleMouseUpOrPanMove(event);
            }
        });
        this.ojContext._on(this.ojContext.element, {
          "focus": function(event)
          {
              self.HandleFocus(event);
          },
          "blur": function(event)
          {
              self.HandleBlur(event);
          },
        });
        
        // in Firefox, need to explicitly make list container not focusable otherwise first tab will focus on the list container
        if (oj.AgentUtils.getAgentInfo()['browser'] === oj.AgentUtils.BROWSER.FIREFOX)
        {
            this._getListContainer().attr("tabIndex", -1);
        }

        // for item focus mode (aka roving focus), we'll need to use focusout handler instead
        // of blur because blur doesn't bubble
        this.ojContext._on(this.ojContext.element, {
            "focusin": function(event)
            {
                self.HandleFocus(event);
            },
            "focusout": function(event)
            {
                self.HandleFocusOut(event);
            }
        });

        this._registerScrollHandler();

        this.ojContext._focusable({
            'applyHighlight': self.ShouldApplyHighlight(),
            'recentPointer' : self.RecentPointerCallback(),
            'setupHandlers': function( focusInHandler, focusOutHandler) {
                self._focusInHandler = focusInHandler;
                self._focusOutHandler = focusOutHandler;
            }
        });
    },
    /**
     * Setup resources on listview after connect
     * Invoked by widget
     */        
    setupResources: function()
    {
        this.ojContext.document.bind("touchend.ojlistview touchcancel.ojlistview", this.HandleTouchEndOrCancel.bind(this));

        this.InitContentHandler();
        // register a resize listener        
        this._registerResizeListener(this._getListContainer()[0]);
    },
    /**
     * Release resources held by listview after disconnect
     * Invoked by widget
     */        
    releaseResources: function()
    {
        this.ojContext.document.off(".ojlistview");

        this.DestroyContentHandler();
        this._unregisterResizeListener(this._getListContainer());
    },
    /**
     * Initialize the listview after creation
     * Invoked by widget
     */        
    afterCreate: function () 
    {     
        this._buildList();
        this.signalTaskEnd(); // resolve component initializing task. Started in init()
    },
    /**
     * Redraw the entire list view after having made some external modifications.
     * Invoked by widget
     */
    refresh: function()
    {
        // reset content, wai aria properties, and ready state
        this._resetInternal();

        this.signalTaskStart("Refresh"); // signal method task start

        // set the wai aria properties 
        this.SetAriaProperties();

        // recreate the content handler
        this.InitContentHandler();

        // reattach scroll listener if neccessary
        this._registerScrollHandler();

        this.signalTaskEnd(); // signal method task end
    },
    /**
     * Returns a Promise that resolves when the component is ready, i.e. after data fetching, rendering, and animations complete.
     * Invoked by widget
     * @return {Promise} A Promise that resolves when the component is ready.
     */
    whenReady: function()
    {
        return this.readyPromise;
    },
    /**
     * Destroy the list view
     * Invoked by widget
     */
    destroy: function()
    {
        this.element.removeClass(this.GetStyleClass()+" oj-component-initnode");

        this._unregisterResizeListener(this._getListContainer());
        this._resetInternal();

        //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
        oj.DomUtils.unwrap(this.element, this._getListContainer()); 
    },

    /**
     * Force busy state to be resolve and flush the readiness stack
     * @private
     */
    _clearBusyState: function()
    {
        if (this.readinessStack && this.readinessStack.length > 0)
        {
            oj.Logger.warn("ListView did not end with a clean state, this could happen if ListView is detached before fetch is complete.  State: "+this.readinessStack);

            // this should resolve all the Promises, safe to assume the Promises should already been resolve if readinessStack is empty
            while (this.readinessStack.length > 0)
            {
                this.signalTaskEnd();
            }
        }
    },

    /**
     * Remove any wai-aria properties and listview specific attributes.
     * Reset anything done by the content handler.
     * @private
     */
    _resetInternal: function()
    {
        var self = this;

        this.UnsetAriaProperties();
        this._cleanupTabbableElementProperties(this.element);
        this.DestroyContentHandler();

        this.m_active = null;
        this.m_isExpandAll = null;
        this.m_disclosing = null;
        this.m_itemHeight = null;

        this.ClearCache();

        // give dnd context a chance to clear internals
        if (this.m_dndContext != null)
        {
            this.m_dndContext.reset();
        }
    },

    /**
     * Called when listview root element is re-attached to DOM tree.
     * Invoke by widget
     */
    notifyAttached: function()
    {
        // call ContentHandler in case action is neccessarily
        if (this.m_contentHandler != null)
        {
            // restore scroll position as needed since some browsers reset scroll position 
            this.syncScrollPosition();

            this.m_contentHandler.notifyAttached();
        }
    },

    /**
     * In browsers [Chrome v35, Firefox v24.5, IE9, Safari v6.1.4], blur and mouseleave events are generated for hidden content but not detached content,
     * so for detached content only, we must use this hook to remove the focus and hover classes.
     * Invoke by widget.
     */
    notifyDetached: function() 
    {
        // Remove focus/hover/active style classes when listview element got detached from document.
        // For details see related button .
        this._getListContainer().removeClass("oj-focus-ancestor");

        if (this.m_active != null)
        {
            $(this.m_active['elem']).removeClass("oj-focus oj-focus-highlight");
        }

        if (this.m_hoverItem != null)
        {
            this._unhighlightElem(this.m_hoverItem, "oj-hover");
        }
    },

    /**
     * Called when application programmatically change the css style so that the ListView becomes visible
     */
    notifyShown: function()
    {
        // call ContentHandler in case action is neccessarily
        if (this.m_contentHandler != null)
        {
            // restore scroll position as needed since some browsers reset scroll position 
            this.syncScrollPosition();

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
    getNodeBySubId: function(locator)
    {
        var subId, key, item, anchor;
 
        if (locator == null)
        {
            return this.element[0];
        }

        subId = locator['subId'];
        if (subId === 'oj-listview-disclosure' || subId === 'oj-listview-icon')
        {
            key = locator['key'];
            if (key != null)
            {
                item = this.FindElementByKey(key);
                if (item != null)
                {
                    // this should be the anchor
                    anchor = $(item).find('.oj-clickable-icon-nocontext').first();
                    if (this._isExpandCollapseIcon(anchor))
                    {
                        return anchor.get(0);
                    }
                }
            }     
        }
        else if (subId === 'oj-listview-item')
        {
            key = locator['key'];
            if (key != null)
            {
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
    getSubIdByNode: function(node)
    {
        var item, key;

        // check to see if it's expand/collapse icon
        if (node != null && this._isExpandCollapseIcon(node))
        {
            item = this.FindItem(node);
            if (item != null && item.length > 0)
            {
                key = this.GetKey(item[0]);            
                if (key != null)
                {
                    return {'subId': 'oj-listview-disclosure', 'key': key};
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
    getContextByNode: function(node)
    {
        var item, key, parent, index, context;

        item = this.FindItem(node);
        if (item != null && item.length > 0)
        {
            key = this.GetKey(item[0]);            
            if (key != null)
            {
                parent = item.parent();
                index = parent.children("."+this.getItemElementStyleClass()).index(item);
                context = {'subId': 'oj-listview-item', 'key': key, 'index': index};

                // group item should return the li
                if (parent.get(0) != this.element.get(0))
                {
                    context['parent'] = parent.parent().get(0);
                }

                // check if it's a group item
                if (item.children().first().hasClass(this.getGroupItemStyleClass()))
                {
                    context['group'] = true;
                }
                else
                {
                    context['group'] = false;
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
    getDataForVisibleItem: function(context)
    {
        var key, index, parent, item;

        key = context['key'];
        // key takes precedence
        if (key != null)
        {
            item = this.FindElementByKey(key);
        }

        // if we can't find the item with key, try to use index, if specified
        if (item == null)
        {
            index = context['index'];
            parent = context['parent'];

            if (parent == null)
            {
                // use the root element
                parent = this.element.get(0);
            }
            else
            {
                // find the appropriate group element
                parent = $(parent).children("ul."+this.getGroupStyleClass()).first();
            }

            item = $(parent).children("li").get(index);
        }

        if (item != null && $(item).hasClass(this.getItemStyleClass()))
        {
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
    _getDataForItem: function(item)
    {
        // if static HTML, returns the item's dom element
        if (this.GetOption("data") == null)
        {
            return item;
        }
        else
        {
            return $.data(item, "data");
        }
    },

    /**
     * Unregister event listeners for resize the container DOM element.
     * @param {Element} element  DOM element
     * @private
     */
    _unregisterResizeListener: function(element)
    {
        if (element && this._resizeHandler)
        {
            // remove existing listener
            oj.DomUtils.removeResizeListener(element, this._resizeHandler);    
        }
    },

    /**
     * Register event listeners for resize the container DOM element.
     * @param {Element} element  DOM element
     * @private
     */
    _registerResizeListener: function(element)
    {         
        if (element)
        {
            if (this._resizeHandler == null)
            {
                this._resizeHandler = this.HandleResize.bind(this);
            }

            oj.DomUtils.addResizeListener(element, this._resizeHandler);
        }
    },
    
    /**
     * Returns DnD Context, needed to override in navigationlist
     * @protected
     */
    GetDnDContext: function()
    {
        if (typeof oj.ListViewDndContext != "undefined")
        {
            return new oj.ListViewDndContext(this);
        }
    },
    
    /**
     * The resize handler.
     * @param {number} width the new width
     * @param {number} height the new height
     * @private
     */
    HandleResize: function(width, height)
    {
        if (width > 0 && height > 0 && this.m_contentHandler != null)
        {
            this.m_contentHandler.HandleResize(width, height);
        }
    },   

    /**
     * Whether focus highlight should be applied
     * @return {boolean} true if should apply focus highlight, false otherwise
     * @protected
     */
    ShouldApplyHighlight: function()
    {
        return true;
    },
    /**
     * check Whether recent pointer acivity happened or not. 
     * Only used for sliding navlist to avoid focus ring on new focusable item
     * after completing expand/collapse animation.
     * @protected
     */
    RecentPointerCallback: function()
    {
      return function(){return false};
    },
    /**
     * Whether ListView should refresh if certain option is updated
     * @param {Object} options the options to check
     * @return {boolean} true if should refresh, false otherwise
     * @protected
     */
    ShouldRefresh: function(options)
    {
        return (options['data'] != null || 
                options['drillMode'] != null || 
                options['groupHeaderPosition'] != null || 
                options['item'] != null || 
                options['scrollPolicy'] != null ||
                options['scrollPolicyOptions'] != null);
    },

    /**
     * Returns true if value is a KeySet, false otherwise
     * @private
     */
    _isKeySet: function(value)
    {
        return (value.values && value.isAddAll);
    },

    /**
     * Sets multiple options 
     * Invoke by widget
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     * @return {boolean} true to refresh, false otherwise
     */
    setOptions: function(options, flags)
    { 
        var self = this, elem, expanded, keys, active, scroller, pos;

        if (this.ShouldRefresh(options))
        {
            // data updated, need to refresh
            return true;
        }

        if (options['expanded'] != null)
        {            
            // should only apply if data is hierarchical 
            // q: could expanded be change if drillMode is 'expanded'?
            if (this.m_contentHandler.IsHierarchical())
            {
                // clear collapsed items var
                this._collapsedKeys = undefined;

                expanded = options['expanded'];

                if (Array.isArray(expanded) || expanded.values)
                {
                    this.signalTaskStart("Set expanded option"); // signal task start

                    // collapse all expanded items first
                    this._collapseAll();

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

                    try
                    {
                        // expand each key, both Set and Array supports forEach
                        keys = this._isKeySet(expanded) ? expanded.values() : expanded;
                        keys.forEach(function(key)
                        {
                            self.expandKey(key, true, true, true);
                        });
                    }
                    finally
                    {
                        this._ignoreExpanded = undefined;

                        this.signalTaskEnd(); // signal task end
                    }
                }
                else if (expanded === "all" || expanded.deletedValues) 
                {
                    // if need to return all, just refresh the view
                    return true;
                }
            }
        }
        
        if (options['currentItem'] != null)
        {            
            elem = this.FindElementByKey(options["currentItem"]);
            if (elem != null)
            {
                elem = $(elem);
                if (!this.SkipFocus(elem))
                {
                    active= document.activeElement;
                    // update tab index and focus only if listview currently has focus
                    if (active && this.element.get(0).contains(active))
                    {
                        this.ActiveAndFocus(elem, null);
                    }
                    else
                    {
                        // update internal state only
                        this._setActive(elem, null, true);
                    }
                }
            }
        }
        else if (options['currentItem'] === null)
        {
            // currentItem is deliberately set to null if this case is entered; deliberately clear active element and its focus
            this.UnhighlightActive();
            this.m_active = null;
            this.SetRootElementTabIndex();
        }
        this.HandleSelectionOption(options);
        
        if (options['selectionMode'] != null)
        {            
            // clear existing selection if selection mode changes
            this._clearSelection(true);

            // reset wai aria properties 
            this.SetAriaProperties();

            // update aria-selected on item
            this.UpdateItemAriaProperties(options['selectionMode']);
        }

        if (options['scrollTop'] != null)
        {
            scroller = this._getScroller();
            pos = options['scrollTop'];
            if (pos != null && !isNaN(pos))
            {
                scroller.scrollTop = pos;
            }
        }

        if (options['scrollPosition'] != null)
        {
            this._setCurrentScrollPosition(options['scrollPosition']);
            // remove it so it doesn't trigger an option change 
            delete options['scrollPosition'];
        }

        // if reorder switch to enabled/disabled, we'll need to make sure any reorder styling classes are added/removed from focused item
        if (this._shouldDragSelectedItems() && this.m_active != null && options['dnd'] != null && options['dnd']['reorder'] != null)
        {
            if (options['dnd']['reorder']['items'] === 'enabled')
            {
                this.m_dndContext._setItemDraggable(this.m_active['elem']);
            }
            else if (options['dnd']['reorder']['items'] === 'disabled')
            {
                this.m_dndContext._unsetItemDraggable(this.m_active['elem']);
            }
        }

        return false;
    },

    /**
     * Set Selection option. Overriden by Navlist.
     * @param {Object} options the options object
     * @protected
     */
    HandleSelectionOption: function(options) 
    {
      var elem, selection, i;
      if (options['selection'] != null)
      {            
          if (this._isSelectionEnabled())
          {
              // remove any non-selectable items, this will effectively clone the selection as well,
              // which we'll need to do
              options['selection'] = this._filterSelection(options['selection']);
              selection = options['selection'];

              // clear selection first
              this._clearSelection(false);

              // selects each key
              for (i=0; i<selection.length; i++)            
              {
                  elem = this.FindElementByKey(selection[i]);
                  if (elem != null)
                  {
                      this._applySelection(elem, selection[i]);
                  }
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
    Trigger: function(type, event, ui)
    {
        return this.ojContext._trigger(type, event, ui);
    },

    /**
     * Sets an option on the widget
     * @param {string} key the option key
     * @param {Object} value the option value
     * @param {Object=} flags any optional parameters 
     * @protected
     */
    SetOption: function(key, value, flags)
    {
        this.ojContext.option(key, value, flags);
    },

    /**
     * Gets the value of an option from the widget
     * @param {string} key the option key
     * @return {Object} the value of the option
     * @protected
     */
    GetOption: function(key)
    {
        return this.ojContext.option(key);
    },

    /**
     * Compose a description for busy state
     * @param {string} description the description
     * @return {string} the busy state description
     * @private
     */
    _getBusyDescription: function(description)
    {
        var id = this.ojContext._IsCustomElement() ? this.getRootElement().attr("id") : this.element.attr("id");
        return "The component identified by '" + id + "', " + description;
    },

    /**
     * Invoke whenever a task is started. Moves the component out of the ready state if necessary.
     * @param {string=} description the description of the task
     */
    signalTaskStart: function(description)
    {
        var self = this, busyContext, options;
        if (this.readinessStack)
        {
            if (this.readinessStack.length == 0)
            {
                this.readyPromise = new Promise(function(resolve, reject)
                {
                    self.readyResolve = resolve;
                });

                // whenReady is deprecated in favor of page busystate (but we still need to support old syntax)
                busyContext = oj.Context.getContext(this.element[0]).getBusyContext();
                options = description != null ? {'description' : this._getBusyDescription(description)} : {};
                self.busyStateResolve = busyContext.addBusyState(options);
            }
            this.readinessStack.push(description != null ? description : "unknown task");
        }
    },

    /**
     * Invoke whenever a task finishes. Resolves the readyPromise if component is ready to move into ready state.
     */
    signalTaskEnd: function()
    {
        if (this.readinessStack && this.readinessStack.length > 0)
        {
            this.readinessStack.pop();
            if (this.readinessStack.length == 0)
            {
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
    isReady: function()
    {
        return (this.busyStateResolve == null);
    },

    /**
     * Throw an error.  Do any neccessary cleanup.
     */
    throwError: function(err)
    {
        if (this.readinessStack)
        {
            while (this.readinessStack.length > 0)
            {
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
    getItems: function(ids)
    {
        var elem, self = this, items = [];

        $.each(ids, function(index, value)
        {
            elem = self.FindElementByKey(value);
            if (elem != null)
            {
                items.push(elem);
            }
        });

        return items;
    },

    /************************************** Core rendering ********************************/
    /**
     * Whether the listview is in card layout mode
     * @return {boolean} true if it is in card layout mode, false otherwise
     */
    isCardLayout: function()
    {
        var elem = this.ojContext._IsCustomElement() ? this.getRootElement() : this.element;
        return elem.hasClass("oj-listview-card-layout");
    },

    /**
     * Whether to use grid role for ListView, to be override by NavList
     * @protected
     */
    ShouldUseGridRole: function()
    {
        return true;
    },

    /**
     * Whether to scrollPosition is supported, NavList for example do not support this
     * @protected
     */
    ShouldUpdateScrollPosition: function()
    {
        return this.ShouldUseGridRole() && this.ojContext._IsCustomElement();
    },

    /**
     * Destroy the content handler
     * @protected
     */
    DestroyContentHandler: function()
    {
        if (this.m_contentHandler != null)
        {
            this.m_contentHandler.Destroy();
            delete this.m_contentHandler;
            this.m_contentHandler = null;
        }

        // ensure all busy states caused by outstanding fetch are resolved
        this._clearBusyState();
    },

    /**
     * Initialize the content handler based on data type
     * @protected
     */
    InitContentHandler: function()
    {
        var data, fetchSize;

        this.signalTaskStart("Initialize ContentHandler"); // signal method task start

        this.showStatusText();

        data = this.GetOption("data");
        if (data != null)
        {
            if (typeof oj.TableDataSource !== "undefined" && data instanceof oj.TableDataSource)
            {
                // TODO: load the adapter as needed
                this.m_contentHandler = new oj.IteratingDataProviderContentHandler(this, this.element[0], new oj.TableDataSourceAdapter(data));
            }
            else if (typeof oj.TreeDataSource !== "undefined" && data instanceof oj.TreeDataSource)
            {
                this.m_contentHandler = new oj.TreeDataSourceContentHandler(this, this.element[0], data);
            }
            else if (oj.DataProviderFeatureChecker.isIteratingDataProvider(data))
            {
                this.m_contentHandler = new oj.IteratingDataProviderContentHandler(this, this.element[0], data);
            }
            else
            {
                this.throwError("Invalid data or missing module");
            }
        }
        else
        {
            // StaticContentHandler will handle cases where children are invalid or empty
            this.m_contentHandler = new oj.StaticContentHandler(this, this.element[0]);
        }

        // kick start rendering
        this.m_contentHandler.RenderContent();

        this.signalTaskEnd(); // signal method task end
    },

    /**
     * Update active descendant attribute
     * @param {jQuery} elem the active item element
     * @protected
     */
    UpdateActiveDescendant: function(elem)
    {
        this.element.attr("aria-activedescendant", elem.attr("id"));
    },

    /**
     * Sets wai-aria properties on root element
     * @protected
     */
    SetAriaProperties: function()
    {
        if (this._isMultipleSelection())
        {
            this.element.attr("aria-multiselectable", true);
        }
        else if (this._isSelectionEnabled())
        {
            this.element.attr("aria-multiselectable", false);
        }
    },

    /**
     * Removes wai-aria properties on root element
     * @protected
     */
    UnsetAriaProperties: function()
    {
        this.element.removeAttr("aria-activedescendant")
                    .removeAttr("aria-multiselectable");
    },

    /**
     * When selectionMode option is updated, the aria-selected
     * attribute must be remove or updated
     * @param {string} selectionMode the new selection mode
     * @protected
     */
    UpdateItemAriaProperties: function(selectionMode)
    {
        var self = this, func, items, i;

        if (selectionMode == "none")
        {
            this.element.removeAttr("aria-multiselectable");

            func = function(item)
            {
                self.getFocusItem(item).removeAttr("aria-selected");
            };
        }
        else
        {
            if (selectionMode == "single")
            {
                this.element.attr("aria-multiselectable", false);
            }
            else
            {
                this.element.attr("aria-multiselectable", true);
            }

            func = function(item)
            {
                self.getFocusItem(item).attr("aria-selected", 'false');
            };
        }

        items = this._getItemsCache();
        for (i=0; i<items.length; i++)
        {
            func($(items[i]));
        }
    },

    /**
     * Build the elements inside and around the root
     * @param {Element} root the root element
     * @private
     */
    _buildList: function(root)
    {
        var container, status, accInfo;

        container = this._getListContainer();
        this.SetAriaProperties();

        this.m_elementOffset = this.element.get(0).offsetTop;

        status = this._buildStatus();
        container.append(status); // @HTMLUpdateOK
        this.m_status = status;

        accInfo = this._buildAccInfo();
        container.append(accInfo); // @HTMLUpdateOK
        this.m_accInfo = accInfo;

        // touch specific instruction text for screen reader for reordering
        if (this._isTouchSupport() && this.m_dndContext != null)
        {
            container.append(this._buildAccInstructionText()); // @HTMLUpdateOK
        }
    },

    /**
     * Build a status bar div
     * @return {jQuery} the root of the status bar
     * @private
     */
    _buildStatus: function()
    {
        var icon, root;

        icon = $(document.createElement("div"));
        icon.addClass("oj-icon oj-listview-loading-icon");

        root = $(document.createElement("div"));        
        root.addClass("oj-listview-status-message oj-listview-status")
            .attr({"id": this._createSubId("status"), 
                   "role": "status"});
        root.append(icon); // @HTMLUpdateOK

        return root;
    },

    /**
     * Build the accessible text info div
     * @return {jQuery} the root of the acc info div
     * @private
     */
    _buildAccInfo: function()
    {
        var root = $(document.createElement("div"));
        root.addClass("oj-helper-hidden-accessible")
            .attr({"id": this._createSubId("info"), 
                   "role": "status"});

        return root;
    },

    /**
     * Build the accessible instruction text for touch devices
     * @return {jQuery} the root of the acc info div
     * @private
     */
    _buildAccInstructionText: function()
    {
        var root = $(document.createElement("div"));
        root.addClass("oj-helper-hidden-accessible")
            .attr({"id": this._createSubId("instr")});
        root.text(this.ojContext.getTranslatedString("accessibleReorderTouchInstructionText"));        

        return root;
    },

    /**
     * Sets the accessible text info
     * @param {string} text the text to set on accessible info div
     * @private
     */
    _setAccInfoText: function(text)
    {
        if (text != "" && this.m_accInfo.text() != text)
        {
            this.m_accInfo.text(text);
        }
    },

    /**
     * Displays the 'fetching' status message
     * @private
     */
    showStatusText: function()
    {
        var msg, self = this, statusHeight, container, containerHeight;

        // it's already shown
        if (this.m_showStatusTimeout)
        {
            return;
        }

        this.m_showStatusTimeout = setTimeout(function()
        {
            // remove any empty text div
            $(document.getElementById(self._createSubId('empty'))).remove();        

            msg = self.ojContext.getTranslatedString("msgFetchingData");

            container = self._getListContainer();
            self.m_status.attr("aria-label", msg)
                         .css("left", Math.max(0, container.outerWidth()/2 - self.m_status.outerWidth()/2))
                         .css("top", Math.max(0, container.outerHeight()/2 - self.m_status.outerHeight()/2))
                         .show();        

            // make sure the container is tall enough to show the indicator
            if (self.m_minHeightSet === undefined)
            {
                statusHeight = self.m_status.get(0).offsetHeight;
                containerHeight = container.get(0).offsetHeight;
                container.css('minHeight', Math.max(containerHeight, statusHeight + self._getListContainerBorderWidth()));
                self.m_minHeightSet = true;
            }

            self.m_showStatusTimeout = null;
        }, this._getShowStatusDelay());
    },

    /**
     * Retrieve the delay before showing status
     * @return {number} the delay in ms
     * @private
     */
    _getShowStatusDelay: function()
    {
        var delay;

        if (this.defaultOptions == null)
        {
            this.defaultOptions = oj.ThemeUtils.parseJSONFromFontFamily(this.getOptionDefaultsStyleClass());
        }
        delay = parseInt(this.defaultOptions['showIndicatorDelay'], 10);

        return isNaN(delay) ? 0 : delay;
    },

    /**
     * Hide the 'fetching' status message
     * @private
     */
    hideStatusText: function()
    {
        if (this.m_showStatusTimeout)
        {
            clearTimeout(this.m_showStatusTimeout);
            this.m_showStatusTimeout = null;
        }
        this.m_status.hide();
    },

    /**
     * Retrieves the root element
     * Invoke by widget
     */
    getRootElement: function()
    {
        return this._getListContainer();
    },

    /**
     * Retrieves the div around the root element, create one if needed.
     * @return {jQuery} the div around the root element 
     * @private
     */    
    _getListContainer: function()
    {
        if (this.m_container == null)
        {
            this.m_container = this._createListContainer();
        }
        return this.m_container;
    },

    /**
     * Creates the div around the root element.
     * @return {jQuery} the div around the root element
     * @private
     */    
    _createListContainer: function()
    {
        var listContainer;
        if (this.OuterWrapper) 
        {
            listContainer = $(this.OuterWrapper);
        } 
        else 
        {
            listContainer = $(document.createElement('div'));
            this.element.parent()[0].replaceChild(listContainer[0], this.element[0]); //@HTMLUpdateOK
        }

        listContainer.addClass(this.GetContainerStyleClass()).addClass("oj-component");
        listContainer.prepend(this.element); //@HTMLUpdateOK
        return listContainer;
    },

    /**
     * If the empty text option is 'default' return default empty translated text, 
     * otherwise return the emptyText set in the options 
     * @return {string} the empty text
     * @private
     */
    _getEmptyText: function()
    {
        return this.ojContext.getTranslatedString("msgNoData");
    },

    /**
     * Build an empty text div and populate it with empty text
     * @return {Element} the empty text element
     * @private 
     */
    _buildEmptyText: function()
    {
        var emptyText, empty;

        emptyText = this._getEmptyText();
        empty = document.createElement("li");
        empty['id'] = this._createSubId("empty");
        empty['className'] = this.getEmptyTextStyleClass() + " "+ this.getEmptyTextMarkerClass();
        empty.textContent = emptyText;

        return empty;
    },

    /**
     * Determines whether the specified item is expanded
     * @param {jQuery} item the item element
     * @return {number} 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
     * @protected
     */
    GetState: function(item)
    {
        var expanded = this.getFocusItem(item).attr("aria-expanded");
        if (expanded == "true")
        {
            return this.STATE_EXPANDED;
        }
        else if (expanded == "false")
        {
            return this.STATE_COLLAPSED;
        }
        else
        {
            return this.STATE_NONE;
        }
    },

    /**
     * Sets the disclosed state of the item
     * @param {jQuery} item the item element
     * @param {number} state 0 if item is expanded, 1 if item is collapsed, 2 if item cannot be expand or collapse.
     * @protected
     */
    SetState: function(item, state)
    {
        var expandable = this.isExpandable();

        if (state == this.STATE_EXPANDED)
        {
            this.getFocusItem(item).attr("aria-expanded", "true");
            if (expandable)
            {
                item.removeClass("oj-collapsed")
                    .addClass("oj-expanded");
            }
        }
        else if (state == this.STATE_COLLAPSED)
        {
            this.getFocusItem(item).attr("aria-expanded", "false");
            if (expandable)
            {
                item.removeClass("oj-expanded")
                    .addClass("oj-collapsed");
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
    _getItemOption: function(name, context, resolve)
    {
        var option, value;

        option = this.GetOption("item");
        value = option[name];

        if (typeof value == 'function' && resolve)
        {
            return value.call(this, context);
        }

        return value;
    },

    /**
     * Gets the item.focusable option.
     * @param {Object} context the context object
     * @return {boolean} true if item.focusable option is derieved to be true, false otherwise
     */
    getItemFocusable: function(context)
    {
        return this._getItemOption("focusable", context, true);
    },

    /**
     * Gets the item.selectable option.
     * @param {Object} context the context object
     * @return {boolean} true if item.selectable option is derieved to be true, false otherwise
     */
    getItemSelectable: function(context)
    {
        // if it's not focusable, it's not selectable also
        return this.getItemFocusable(context) && this._getItemOption("selectable", context, true);
    },

    /**
     * Gets the item renderer
     * @return {function(Object)|null} returns the item renderer
     * @private
     */
    _getItemRenderer: function()
    {
        var renderer = this._getItemOption("renderer", null, false);
        if (typeof renderer != 'function')
        {
            // cannot be non-function
            return null;
        }
        return this._WrapCustomElementRenderer(renderer);
    },

    /**
     * Returns the inline template element inside oj-list-view
     * @return {Element|null} the inline tmeplate element
     */
    getItemTemplate: function()
    {
        var slotMap, slot;

        if (this.m_template === undefined)
        {
            // cache the template, assuming replacing template will require refresh
            this.m_template = null;
            if (this.ojContext._IsCustomElement())
            {
                slotMap = oj.BaseCustomElementBridge.getSlotMap(this.getRootElement()[0]);        
                slot = slotMap['itemTemplate'];
                if (slot && slot.length > 0 && slot[0].tagName.toLowerCase() === "template")
                {
                    this.m_template = slot[0];
                }
            }
        }
        return this.m_template;
    },

    /**
     * Called by content handler once the content of an item is rendered triggered by an insert event
     * @param {Element} elem the item element
     * @param {Object} context the context object used for the item
     */
    itemInsertComplete: function(elem, context)
    {
        // hook for NavList
    },
    
    /**
     * Called by content handler once the content of an item is rendered triggered by an insert event
     */
    BeforeInsertItem: function()
    {
      // hook for NavList
    },

    /**
     * Called by content handler once the content of an item is removed triggered by an remove event
     * @param {Element} elem the item element
     */
    itemRemoveComplete: function(elem)
    {
        // if it's the current focus item, try to focus on the next/prev item.  If there are none, then focus on the root element
        if (this.m_active != null && this.m_active['elem'] && $(this.m_active['elem']).get(0) == elem)
        {
            var next = elem.nextElementSibling;
            if (next == null || !$(next).hasClass(this.getItemElementStyleClass()))
            {
                next = elem.previousElementSibling;
                if (next == null || !$(next).hasClass(this.getItemElementStyleClass()))
                {
                    this.SetOption('currentItem', null);
                }                
            }

            if (next != null && $(next).hasClass(this.getItemElementStyleClass()))
            {
                this.SetOption('currentItem', this.GetKey(next));
            }
        }

        // disassociate element from key map
        if (elem != null && elem.id && this.m_keyElemMap != null)
        {
            this.m_keyElemMap.deleteValue(elem.id);
        }
    },

    /**
     * Called by content handler once the content of an item is rendered
     * @param {Element} elem the item element
     * @param {Object} context the context object used for the item
     */
    itemRenderComplete: function(elem, context)
    {
        var key, selection, selectedItems, i, index, clone, expanded, self, current;

        // dnd
        if (this.m_dndContext != null)
        {
            this.m_dndContext.itemRenderComplete(elem);
        }

        // make all tabbable elements non-tabbable, since we want to manage tab stops
        this._disableAllTabbableElements(elem);

        key = context['key'];

        // update as selected if it is in selection, check if something already selected in single selection
        if (this._isSelectionEnabled())
        {
            selection = this.GetOption("selection");
            if (this.IsSelectable(elem))
            {
                for (i=0; i<selection.length; i++)
                {
                    if (selection[i] == key || oj.Object.compareValues(selection[i], key))
                    {
                        this._applySelection(elem, selection[i]);
                    
                        // if it's single selection, then bail
                        if (!this._isMultipleSelection())
                        {
                            if (selection.length > 1)
                            {
                                // we'll have to modify the value
                                selectedItems = this.FindElementByKey(key);
                                this._setSelectionOption([key], null, selectedItems, context['data']);
                            }
                            break;
                        }
                    }
                }

                // if selectionRequired is set to true and selection is empty, selects the first selectable item
                // this should be run once since selection won't be empty afterwards
                if (selection.length == 0 && this._isSelectionRequired())
                {
                    this._applySelection(elem, key);
                    // need to pass data since 1) to avoid unneccesary lookup 2) since item is not in live dom, getDataForVisibleItem would not work
                    this._setSelectionOption([key], null, [elem], context['data']);
                }
            }
            else
            {
                // the selection is invalid, remove it from selection
                index = this.GetIndexOf(selection, key);
                if (index > -1)
                {
                    // clone before modifying
                    clone = selection.slice(0);
                    clone.splice(index, 1);

                    selectedItems = new Array(clone.length);
                    for (i = 0; i < clone.length; i++)
                    {
                        selectedItems[i] = this.FindElementByKey(clone[i]);
                    }
                    this._setSelectionOption(clone, null, selectedItems);
                }                
            }
        }

        // update if it is in expanded, ensure data is hierarchical
        if (this.m_contentHandler.IsHierarchical() && this._ignoreExpanded == undefined)
        {
            // checks if it is expandable && is collapsed
            if (this.GetState($(elem)) == this.STATE_COLLAPSED)
            {
                expanded = this.GetOption("expanded");
                // checks if expand all
                if (this._isExpandAll())
                {
                    // for legacy syntax, expanded is not real-time in certain cases, i.e. you 
                    // can have expanded='all' but some itms are collapsed
                    // for custom element we don't care about collapsedKeys since KeySet is keeping track of it
                    if (this.ojContext._IsCustomElement() || this._collapsedKeys == undefined)
                    {
                        // don't animate
                        this.ExpandItem($(elem), null, false, null, false, false, false);
                    }
                }
                else if (!this.ojContext._IsCustomElement() && Array.isArray(expanded))
                {
                    // legacy syntax array of expanded keys
                    // checks if specified expanded
                    self = this;
                    $.each(expanded, function(index, value)
                    {
                        // if it was explicitly collapsed
                        if (value == key && (self._collapsedKeys == undefined || self._collapsedKeys.indexOf(value) == -1))
                        {
                            // don't animate
                            self.ExpandItem($(elem), null, false, null, false, false, false);
                        }
                    });
                }
                else if (expanded.has)
                {
                    // KeySet case
                    if (expanded.has(key))
                    {
                        // don't animate
                        this.ExpandItem($(elem), null, false, null, false, false, false);                        
                    }
                }
            }
        }

        // checks if the active element has changed, this could happen in TreeDataSource, where the element gets remove when collapsed
        if (this.m_active != null && key == this.m_active['key'] && this.m_active['elem'] != null && elem != this.m_active['elem'].get(0))
        {
            this.m_active['elem'] = $(elem);
        }
    },

    /**
     * Called by content handler once content of all items are rendered
     */
    renderComplete: function()
    {
        var empty, firstItem, current, elem;

        this.hideStatusText();

        // remove any empty text div
        $(document.getElementById(this._createSubId('empty'))).remove();        

        // clear items cache
        this.m_items = null;
        this.m_groupItems = null;
        
        // if grid role and card layout and non-heirarchical and presentation div is empty, remove presentation div to clear out the element
        if (this._isEmptyGrid())
        {
            this.element[0].removeChild(this.element[0].children[0])
        }

        // check if it's empty
        if (this.element[0].childElementCount == 0)
        {
            empty = this._buildEmptyText();
            this.element.append(empty); // @HTMLUpdateOK

            // fire ready event
            this.Trigger("ready", null, {});
            
            return;
        }
        else
        {
            // figure out the average item height, we'll need that in scroll listener
            if (this.ShouldUpdateScrollPosition() && this.m_itemHeight == null)
            {
                if (this.m_contentHandler.IsHierarchical())
                {
                    // could be a group
                    firstItem = this.element.children("li."+this.getItemElementStyleClass()).first();
                    if (firstItem.length > 0)
                    {
                        this.m_itemHeight = firstItem.get(0).firstElementChild.offsetHeight;
                    }
                }
                else
                {
                    firstItem = $(this._getRootNodeForItems()).children("li."+this.getItemStyleClass()).first();
                    if (firstItem.length > 0)
                    {
                        this.m_itemHeight = firstItem.get(0).offsetHeight;
                    }                    
                }
            }
        }

        // check if current is specified
        current = this.GetOption("currentItem");
        if (current != null)
        {
            elem = this.FindElementByKey(current);
            if (elem == null)
            {
                // it's not valid anymore, reset current
                this.SetOption('currentItem', null);
            }
            else
            {    
                // make sure item is focusable also
                if (this.m_active == null && !this.SkipFocus($(elem)))
                {
                    this.ActiveAndFocus($(elem), null);
                }
            }
        }

        // if listview has focus but there's no active element, then set focusable item
        // this could happen after refresh from context menu
        if (this._getListContainer().hasClass("oj-focus-ancestor") && this.m_active == null && current == null)
        {
            this._initFocus();
        }

        // clear the scroll and fetch flag before calling syncScrollPosition
        this.m_scrollAndFetch = undefined;

        // update scroll position if it's not in sync, make sure we are not in the middle of scrolling
        if (!this.m_ticking || this.m_scrollPosition != null)
        {
            this.syncScrollPosition();
        }

        // fire ready event
        this.Trigger("ready", null, {});
    },

    /**
     * Returns whether or not the li presentation div is present and empty.
     * @private
     * @returns {boolean} true if li presentation div is present and empty.
     */
    _isEmptyGrid: function()
    {
        return (this.ShouldUseGridRole() && this.isCardLayout() && !this.m_contentHandler.IsHierarchical() && this.element[0].children[0] && this.element[0].children[0].children[0].childElementCount == 0)
    },

    /**
     * @private
     */
    _setScrollY: function(scroller, y)
    {
        if (!this._skipScrollUpdate)
        {
            this.signalTaskStart("waiting for scroll handler");
        }

        // flag it so that handleScroll won't do anything
        this._skipScrollUpdate = true;
        scroller.scrollTop = y;

        // update sticky header as needed
        this._handlePinGroupHeader();
    },

    /**
     * Sets the bidi independent position of the horizontal scroll position that
     * is consistent across all browsers.
     * @private
     */
    _setScrollX: function(scroller, x)
    {
        if (!this._skipScrollUpdate)
        {
            this.signalTaskStart("waiting for scroll handler");
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
    _getScrollX: function(scroller)
    {
        return oj.DomUtils.getScrollLeft(scroller);
    },

    /**
     * Synchronize the scroll position
     * @protected
     */
    syncScrollPosition: function(position)
    {
        var scroller, coord, x, y, scrollTop, scrollPosition, newScrollPosition;

        scroller = this._getScroller();
        // check if it's even scrollable
        if (scroller.scrollHeight == scroller.clientHeight)
        {
            return;
        }

        if (this.ShouldUpdateScrollPosition())
        {
            if (this.m_scrollPosition != null)
            {
                position = this.m_scrollPosition;
            }
            else if (position === undefined)
            {
                position = this.GetOption("scrollPosition");
            }

            // figure out what the final y should be
            coord = this._getScrollCoordinates(position);
            x = coord.x;
            y = coord.y;

            if (isNaN(x) && isNaN(y))
            {
                // invalid scroll position
                if (this.m_scrollPosition != null)
                {
                    // we'll still need to report current scroll position, which could have changed because of scroll and fetch
                    this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {'_context': {originalEvent: null, internalSet: true}});

                    // free signalTaskStart from earlier when m_scrollPosition is saved
                    this.signalTaskEnd(); 
                    this.m_scrollPosition = null;
                }
                return;
            }
        }

        if (coord === undefined)
        {
            // legacy scrollTop attribute
            y = this.GetOption("scrollTop");
        }

        scrollTop = scroller.scrollTop;
        // check if only x updated
        if ((!isNaN(x) && isNaN(y)) || (!isNaN(x) && y == scrollTop && x != this._getScrollX(scroller, x)))
        {
            this._setScrollX(scroller, x);
            scrollPosition = this.GetOption("scrollPosition");
            x = this._getScrollX(scroller);
            newScrollPosition = {'x': x, 'y': scrollPosition['y'], 'index': scrollPosition['index'], 'key': scrollPosition['key'], 'offsetX': x, 'offsetY': scrollPosition['offsetY']};
            if (scrollPosition['parent'])
            {
                newScrollPosition['parent'] = scrollPosition['parent'];
            }
            this.SetOption('scrollPosition', newScrollPosition, {'_context': {originalEvent: null, internalSet: true}});
        }
        else if (y != scrollTop)
        {
            // flag it so that handleScroll won't do anything
            this._setScrollY(scroller, y);
            if (!isNaN(x) && x != this._getScrollX(scroller, x))
            {
                this._setScrollX(scroller, x);                
            }

            // checks if further scrolling is needed
            scrollTop = scroller.scrollTop;
            // cannot use scrollTop == y, as browser sub-pixel could be off by < 1px
            if (Math.abs(scrollTop - y) >= 1 && this.m_contentHandler.hasMoreToFetch && this.m_contentHandler.hasMoreToFetch())
            {
                if (this.m_scrollPosition == null)
                {
                    // we don't need to signalTaskStart again if we are already in one
                    this.signalTaskStart("Scroll position needs to resolve further");
                }
                this.m_scrollAndFetch = true;

                // yes, save the scrollPosition to set and bail
                this.m_scrollPosition = position;
                return;
            }
            else
            {
                // ok to update scrollPosition option
                this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {'_context': {originalEvent: null, internalSet: true}});
            }
        }
        else
        {
            // if x and y is present, but position value is not complete, get it
            if (position && (position['key'] == null || isNaN(position['index'])))
            {
                // ok to update scrollPosition option
                this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {'_context': {originalEvent: null, internalSet: true}});
            }
        }

        if (this.m_scrollPosition != null)
        {
            // free signalTaskStart from earlier when m_scrollPosition is saved
            this.signalTaskEnd(); 
            this.m_scrollPosition = null;
        }
    },

    /**
     * When an item is updated, if the item happens to be the current item, the active element needs to be updated.
     * @protected
     */
    restoreCurrentItem: function()
    {
        var current = this.GetOption("currentItem");
        if (current != null)
        {
            var elem = this.FindElementByKey(current);
            // make sure item is focusable also
            if (elem != null && !this.SkipFocus($(elem)))
            {                    
                this.ActiveAndFocus($(elem), null);
            }
        }
    },

    /**
     * Called by content handler to reset the state of ListView
     * @private
     */
    ClearCache: function()
    {
        // clear any element dependent cache
        this.m_items = null;
        this.m_groupItems = null;
    },

    /**
     * Utility method to start animation
     * @param {Element} elem element to animate
     * @param {string} action the animation action
     * @param {Object=} effect optional animation effect, if not specified then it will be derived based on action
     * @return {Promise} the promise which will be resolve when animation ends
     * @protected
     */
    StartAnimation: function(elem, action, effect)
    {
        if (effect == null)
        {
            effect = this.getAnimationEffect(action);
        }
        return oj.AnimationUtils.startAnimation(elem, action, effect, this.ojContext);
    },

    /********************* context menu methods *****************/
    /**
     * @param {!Object} menu The JET Menu to open as a context menu.  Always non-<code class="prettyprint">null</code>.
     * @param {!Event} event What triggered the menu launch.  Always non-<code class="prettyprint">null</code>.
     * @param {string} eventType "mouse", "touch", or "keyboard".  Never <code class="prettyprint">null</code>.
     * Invoked by widget
     */
    notifyContextMenuGesture: function(menu, event, eventType)
    {
        var parent, openOptions, launcher;

        // first check if we are invoking on an editable or clickable element If so bail
        if (this.IsNodeEditableOrClickable($(event['target'])))
        {
            return false;
        }

        // set the item right click on active
        parent = $(event['target']).closest("."+this.getItemElementStyleClass());       
        
        // prepare the context menu that have listview specific menu items
        this.PrepareContextMenu(parent);
        
        if (parent.length > 0 && !this.SkipFocus($(parent[0])))
        {
            this.SetCurrentItem($(parent[0]), null);
        }

        launcher = this.element;
        
        //When user right click on disabled item(non-focusable), this.m_active 
        //will not be updated to disabled item so explicitly setting the launcher from event.target.
        if(event.button === 2) 
        { 
            launcher = this._findItem($(event.target));
        } 
        else if (this.m_active != null)
        {
            launcher = this.m_active['elem'];
        }
        
        openOptions = {"launcher": launcher, "initialFocus": "menu"};

        if (eventType === "keyboard")
        {
            openOptions["position"] = {"my": "start top", "at": "start bottom", "of": this.m_active['elem']};
        }

        this.ojContext._OpenContextMenu(event, eventType, openOptions);
    },
    
    /**
     * Decorates or prepares context menu items. Navlist need overrides this to decorate remove menu item.
     * @param {jQuery} item  Item
     * @protected
     * @ignore
     */
    PrepareContextMenu: function(item)
    {
        if (this.m_dndContext != null)
        {
            this.m_dndContext.prepareContextMenu(this.ojContext._GetContextMenu());
        }
    },
    /**
     * Override helper for NavList to override checks for whether a node is editable or clickable.
     * @param {jQuery} node  Node
     * @return {boolean} true or false
     * @protected
     */
    IsElementEditableOrClickable: function(node)
    {
        var nodeName = node.prop("nodeName");
        return (nodeName.match(/^INPUT|SELECT|OPTION|BUTTON|^A\b|TEXTAREA/) != null);
    },

    /**
     * Return whether the node is editable or clickable.  Go up the parent node as needed.
     * @param {jQuery} node  Node
     * @return {boolean} true or false
     * @protected	 
     */
    IsNodeEditableOrClickable: function(node)
    {
        var nodeName;

        while (null != node && node[0] != this.element[0] && (nodeName = node.prop("nodeName")) != "LI")
        {
            // If the node is a text node, move up the hierarchy to only operate on elements
            // (on at least the mobile platforms, the node may be a text node)
            if (node[0].nodeType == 3) // 3 is Node.TEXT_NODE
            {
                node = node.parent();
                continue;
            }

            var tabIndex = node.attr('tabIndex');
            // listview overrides the tab index, so we should check if the data-oj-tabindex is populated
            var origTabIndex = node.attr('data-oj-tabindex');

            if (tabIndex != null && tabIndex >= 0  && !node.hasClass(this.getFocusedElementStyleClass()) && !node.hasClass("oj-listview-cell-element"))
            {
                return true;
            }
            else if (this.IsElementEditableOrClickable(node))
            {
                // ignore elements with tabIndex == -1
                if (tabIndex != -1 || origTabIndex != -1)
                {
                    return true;
                }
            }
            node = node.parent();
        }
        return false;
    },

    /********************* focusable/editable element related methods *****************/
    /**
     * Make all tabbable elements within the specified cell un-tabbable
     * @param {Element} element
     * @param {boolean=} excludeActiveElement see inline comment for details
     * @private
     */
    _disableAllTabbableElements: function(element, excludeActiveElement)
    {
        var elem, selector, tabIndex;

        elem = $(element);

        // if it's a group item, inspect the direct div only so it will skip all children
        if (!elem.hasClass(this.getItemStyleClass()))
        {
            elem = $(elem.get(0).firstElementChild);            
        }

        // a group cell could have contained a cell element, which should be skip also
        if (elem.children().first().hasClass("oj-listview-cell-element"))
        {
            elem = $(elem.get(0).firstElementChild);            
        }

        // should exclude non-visible elements, but doing a visible check here causes re-layout and since it's done 
        // on every item on render, it becomes expensive.  Do the filter later in enableTabbableElements, which is only 
        // triggered by entering actionable mode.
        selector = "a, input, select, textarea, button, object, .oj-component-initnode, [tabIndex]";
        elem.find(selector).each(function(index)
        {
            $(this).removeAttr("data-first").removeAttr("data-last");

            tabIndex = parseInt($(this).attr("tabIndex"), 10);
            // when disabling elements before/after current item, exclude the activeElement
            // otherwise tab out of component won't work correctly
            // setting tab index to -1 will be taken care of by the component on blur anyways
            if ((isNaN(tabIndex) || tabIndex >= 0) && (excludeActiveElement === undefined || this != document.activeElement))
            {
                $(this).attr("tabIndex", -1)
                       .attr("data-tabmod", isNaN(tabIndex) ? -1 : tabIndex);
            }
        });
    },

    /**
     * Make all tabbable elements before and include current item un-tabbable
     * @param {Element} item
     * @private
     */
    _disableAllTabbableElementsBeforeItem: function(item)
    {
        var items, index, i;

        items = this._getItemsCache();
        index = items.index(item);
        // if -1 it will just bail
        for (i=0; i<=index; i++)
        {
            this._disableAllTabbableElements(items[i], true);
        }
    },

    /**
     * Make all tabbable elements after and include current item un-tabbable
     * @param {Element} item
     * @private
     */
    _disableAllTabbableElementsAfterItem: function(item)
    {
        var items, index, i;

        items = this._getItemsCache();
        index = items.index(item);
        if (index == -1)
        {
            return;
        }

        for (i=index; i<=items.length-1; i++)
        {
            this._disableAllTabbableElements(items[i], true);
        }
    },

    /**
     * Make all previously tabbable elements within the element tabbable again
     * @param {Element} elem
     * @private
     */
    _enableAllTabbableElements: function(elem)
    {
        var elems, tabIndex;

        elems = $(elem).find("[data-tabmod]").each(function(index)
                {
                    tabIndex = parseInt($(this).attr("data-tabmod"), 10);    
                    $(this).removeAttr("data-tabmod");
                    // restore tabIndex as needed
                    if (tabIndex == -1)
                    {
                        $(this).removeAttr("tabIndex");
                    }
                    else
                    {
                        $(this).attr("tabIndex", tabIndex);
                    }
                });

        // mark first and last tabbable element for fast retrieval later
        elems = elems.filter(":visible");
        elems.first().attr("data-first", "true");
        elems.last().attr("data-last", "true");
    },

    /**
     * Cleanup any attributes added by tabbing logic
     * @param {Element} elem the element to cleanup
     * @private
     */
    _cleanupTabbableElementProperties: function(elem)
    {
        $(elem).find("[data-tabmod]")
               .removeAttr("tabIndex")
               .removeAttr("data-tabmod")
               .removeAttr("data-first")
               .removeAttr("data-last");
    },

    /**
     * Checks whether the element is focusable
     * @param {jQuery} item the item to check
     * @return {boolean} true if the item should not be focusable, false otherwise
     * @protected
     */
    SkipFocus: function(item)
    {
        return item.hasClass("oj-skipfocus");
    },

    /*************************************** Event handlers *****************************/
    /**
     * Returns the focus element, or the root element if nothing inside ListView has focus
     * @return {Element} the focus element inside ListView or the root element
     * @protected
     */
    GetFocusElement : function ()
    {
        var emptyText;

        if (this._getListContainer().hasClass("oj-focus-ancestor"))
        {
            // find the focus item
            if (this.m_active)
            {
                return this.getFocusItem(this.m_active['elem'])[0];          
            }
            else
            {
                // empty text could have focus                
                emptyText = this.element.children("."+this.getEmptyTextStyleClass()).first();
                if (emptyText.length > 0 && emptyText.attr("tabIndex") == 0)
                {
                    return emptyText[0];
                }
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
    _isFocusBlurTriggeredByDescendent: function(event)
    {
        if (event.relatedTarget === undefined)
            return true;

        if (event.relatedTarget == null || !$.contains(this.ojContext.element.get(0), /** @type {Element} */ (event.relatedTarget)))
            return false;
        else
            return true;
    },

    /**
     * Handler for focus event
     * @param {Event} event the focus event
     * @protected
     */
    HandleFocus: function(event)
    {
        var item;

        this._getListContainer().addClass("oj-focus-ancestor");

        // first time tab into listview, focus on first item
        if (this.m_active == null)
        {
            // checks whether there's pending click to active, and the focus target is not inside any item (if it is the focus will shift to that item) or it's a unfocusable item
            item = this._findItem($(event.target));
            if (!this.m_preActive && !this._isFocusBlurTriggeredByDescendent(event) && (item == null || this.SkipFocus(item)))
            {
                this._initFocus(event);
            }
        }
        else
        {
            // focus could be caused by pending click to active
            // do not do this on iOS or Android, otherwise VO/talkback will not work correctly
            // Only one exception is when ever root node gets focus we should highlight active element
            // otherwise vo doesn't follow the focus. ex: when offcanvas is opened,
            // focus will be moved to root node
            if (!this.m_preActive && event.target === this.ojContext.element[0]
                 && !this._isFocusBlurTriggeredByDescendent(event))
            {
                this.HighlightActive();
                this._focusItem(this.m_active['elem']);
            }

            // remove tab index from root and restore tab index on focus item
            this.RemoveRootElementTabIndex();
            this._setTabIndex(this.m_active['elem']);
        }
    },

    /**
     * Initialize focus by finding the first focusable item and set focus on it
     * @private
     */
    _initFocus: function(event)
    {
        var items, i, item, emptyText;

        items = this._getItemsCache();
        for (i=0; i<items.length; i++)
        {
            item = $(items[i]);
            // make sure item can receive focus
            if (!this.SkipFocus(item))
            {
                this.SetCurrentItem(item, event);
                break;
            }
        }

        if (items.length == 0)
        {
            // we need to focus on empty text
            emptyText = this.element.children("."+this.getEmptyTextStyleClass()).first();
            if (emptyText.length > 0)
            {
                emptyText.attr("tabIndex", 0);
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
    HandleFocusOut: function(event)
    {
        this.HandleBlur(event);
    },

    /**
     * Checks whether the browser supports relatedTarget field for blur event
     * @return {boolean} true if supported, false otherwise
     * @private
     */
    _supportRelatedTargetOnBlur: function()
    {
        var agent = oj.AgentUtils.getAgentInfo();
        if (agent['browser'] == oj.AgentUtils.BROWSER.FIREFOX && parseInt(agent['browserVersion'], 10) < 48)
        {
            return false;
        }

        return true;
    },

    /**
     * Detects whether this is a double blur event fired by IE11
     * @param {Event} event the blur event
     * @private
     */
    _isExtraBlurEvent: function(event)
    {
        var agent = oj.AgentUtils.getAgentInfo();
        if (event.relatedTarget == null && agent['browser'] == oj.AgentUtils.BROWSER.IE && event.target == this.ojContext.element.get(0))
        {
            return true;
        }

        return false;
    },

    /**
     * Handler for blur event
     * @param {Event} event the blur event
     * @protected
     */
    HandleBlur: function(event)
    {
        var emptyText;

        // NOTE that prior to a fix in Firefox 48, relatedTarget is always null
        // just bail in case if it wasn't supported
        // NOTE also IE11 fires an extra blur event with null relatedTarget, should bail as well
        if (!this._supportRelatedTargetOnBlur() || this._isExtraBlurEvent(event))
        {
            return;
        }

        // event.relatedTarget would be null if focus out of page
        // the other check is to make sure the blur is not caused by shifting focus within listview
        if (!this._isFocusBlurTriggeredByDescendent(event) && !this.m_preActive)
        {
            this._doBlur();
        }

        // remove focus class on blur of expand/collapse icon
        if (this._isExpandCollapseIcon(event.target))
        {
            this._focusOutHandler($(event.target));
        }
    },

    /**
     * @private
     */
    _doBlur: function()
    {
        var emptyText;

        this._getListContainer().removeClass("oj-focus-ancestor");
        this.UnhighlightActive();

        // remove tab index from focus item and restore tab index on list
        // and remove any aria-labelled by set by card navigation
        if (this.m_active != null)
        {
            this._resetTabIndex(this.m_active['elem']);
            this._removeSkipItemAriaLabel(this.m_active['elem']);
        }
        else
        {
            emptyText = this.element.children("."+this.getEmptyTextStyleClass()).first();
            if (emptyText.length > 0)
            {
                emptyText.removeAttr("tabIndex");
            }
        }
        this.SetRootElementTabIndex();
    },

    /**
     * Event handler for when user exits an item in list
     * @param {Event} event mouseout event 
     * @private
     */
    _handleMouseOut: function(event)
    {
        var item = this.FindItem(event.target);
        if (item != null)
        {
            this.m_hoverItem = null;
            this._unhighlightElem(item, "oj-hover");
        }
    },

    /**
     * Event handler for when user hovers over list
     * @param {Event} event mouseover event 
     * @private
     */
    _handleMouseOver: function(event)
    {
        // do this for real mouse enters, but not 300ms after a tap
        if (this._recentTouch())
        {
            return;
        }

        var item = this.FindItem(event.target);        
        if (item != null && !this.SkipFocus(item))
        {
            // have to remember it so we can clear it when listview is detached from DOM
            this.m_hoverItem = item;
            this._highlightElem(item, "oj-hover");         
        }
    },

    _recentTouch: function()
    {
        return Date.now() - this._lastTouch < 500; // must be at least 300 for the "300ms" delay
    },

    /**
     * Event handler for when user press down a key
     * @param {Event} event keydown event
     * @protected
     */
    HandleKeyDown: function(event)
    {
        var keyCode, current, processed;

        if (this.isExpandable())
        {
            keyCode = event.keyCode;
            if (keyCode === this.LEFT_KEY || keyCode === this.RIGHT_KEY)
            {
                current = this.m_active['elem'];
                if (keyCode === this.LEFT_KEY)
                {
                    if (this.GetState(current) == this.STATE_EXPANDED)
                    {
                        this.CollapseItem(current, event, true, this.m_active['key'], true, true);
                        return;
                    }
                }
                else
                {
                    if (this.GetState(current) == this.STATE_COLLAPSED)
                    {
                        this.ExpandItem(current, event, true, this.m_active['key'], true, true, true);
                        return;
                    }
                }
            }
        }

        processed = this.HandleSelectionOrActiveKeyDown(event);

        // dnd
        if (this.m_dndContext != null)
        {
            processed = processed || this.m_dndContext.HandleKeyDown(event);
        }

        if (processed === true)
        {
            event.preventDefault();
        }

        this.m_keyProcessed = processed;
    },

    /**
     * Event handler for whenever press up occurred
     * @param {Event} event keyup event
     * @protected
     */
    HandleKeyUp: function(event)
    {
        // popup process esc key on keyup so we have to stop keyup from bubbling
        if (event.keyCode == this.ESC_KEY && this.m_keyProcessed)
        {
            event.stopPropagation();
        }
        this.m_keyProcessed = undefined;
    },

    /**
     * @private
     */
    _handleMouseUpOrPanMove: function(event)
    {
        // unhighlight item that got focus in mousedown
        if (this.m_preActiveItem)
        {
            this._unhighlightElem(this.m_preActiveItem, "oj-focus");
        }

        // dnd
        if (this.m_dndContext != null)
        {
            this.m_dndContext._unsetDraggable($(event.target));
        }
    },

    /**
     * Event handler for when mouse down or touch start anywhere in the list
     * @param {Event} event mousedown or touchstart event
     * @protected
     */
    HandleMouseDownOrTouchStart: function(event)
    {
        var item, target;

        // click on item
        target = $(event.target);

        // dnd
        if (this.m_dndContext != null)
        {
            this.m_dndContext._setDraggable(target);
        }

        // click on item, explicitly pass true on findItem
        // so that it will return non-null value if clickthrough disabled element is encountered
        item = this._findItem(target, true);
        // we'll still need to set the flag so that the focus do not shift
        if (item != null && this._isClickthroughDisabled(item))
        {
            this.m_preActive = true;
            item = null;
        }

        if (item == null || item.length == 0 || this.SkipFocus(item) || target.hasClass("oj-listview-drag-handle"))
        {
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
        if (!this._getListContainer().hasClass("oj-focus-ancestor"))
        {
            this._getListContainer().addClass("oj-focus-ancestor");
        }

        // we'll need to remove focus in case the actual focus item is different
        this.m_preActiveItem = item;

        // apply focus
        this._highlightElem(item, "oj-focus");

        // focus on item, we need to do it on mousedown instead of click otherwise click handler will
        // steal focus from popup and causes it to close prematurely
        this._makeFocusable(item);
        // checks whether focus is already inside some in item, if it is don't try to steal focus away from it (combobox)
        if (!item.get(0).contains(document.activeElement))
        {
            this._focusItem(item);
        }

        // make sure ul is not tabbable
        this.RemoveRootElementTabIndex();
        // reset tab index must be done after focusing another item
        if (this.m_active != null && this.m_active['elem'].get(0) != item.get(0))
        {
            this._resetTabIndex(this.m_active['elem']);
        }

        // need this on touchend
        if (event.originalEvent.touches && event.originalEvent.touches.length > 0)
        {
            this.m_touchPos = {x: event.originalEvent.changedTouches[0].pageX, y: event.originalEvent.changedTouches[0].pageY};
        }
    },

    /**
     * Event handler for when touch end/cancel happened
     * @param {Event} event touchend or touchcancel event
     * @protected
     */
    HandleTouchEndOrCancel: function(event)
    {
        var offset, action = "pointerUp", effect, elem, groupItem;

        // unhighlight item that got focus in touchstart
        if (this.m_preActiveItem != null)
        {
            this._unhighlightElem(this.m_preActiveItem, "oj-focus");

            // start ripple effect
            if (this.m_touchPos != null)
            {
                offset = this.m_preActiveItem.offset();

                // find where to start the ripple effect based on touch location
                effect = this.getAnimationEffect(action);
                effect['offsetX'] = ((this.m_touchPos.x) - offset['left']) + 'px';
                effect['offsetY'] = ((this.m_touchPos.y) - offset['top']) + 'px';
                groupItem = this.m_preActiveItem.children('.' + this.getGroupItemStyleClass());
                if (groupItem.length > 0)
                {
                  elem = /** @type {Element} */ (groupItem.get(0));
                } 
                else 
                {
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
    _enterActionableMode: function()
    {
        var current, first;

        current = this.m_active['elem'];

        // in case content has been updated under the cover
        this._disableAllTabbableElements(current);

        // re-enable all tabbable elements
        this._enableAllTabbableElements(current);                    

        // only go into actionable mode if there is something to focus
        first = current.find("[data-first]");
        if (first.length > 0)
        {
            this._setActionableMode(true);     
        }
    },

    /**
     * Exits actionable mode
     * @private
     */
    _exitActionableMode: function()
    {
        this._setActionableMode(false);

        // disable all tabbable elements in the item again
        this._disableAllTabbableElements(this.m_active['elem']);
    },

    /**
     * Event handler for when mouse click anywhere in the list
     * @param {Event} event mouseclick event
     * @protected
     */
    HandleMouseClick: function(event)
    {
        var collapseIconClass, expandIconClass, groupItemClass, target, item;

        //only perform events on left mouse, (right in rtl culture)
        if (event.button === 0)
        {
            collapseIconClass = this.getCollapseIconStyleClass();
            expandIconClass = this.getExpandIconStyleClass();
            groupItemClass = this.getGroupItemStyleClass();
            target = $(event.target);
            if (target.hasClass(expandIconClass))
            {
                this._collapse(event);
                event.preventDefault();
            }
            else if (target.hasClass(collapseIconClass))
            {
                this._expand(event);
                event.preventDefault();
            }
            else
            {
                // click on item
                item = this._findItem(target);
                if (item == null || item.length == 0 || this.SkipFocus(item))
                {
                    // one of the following happened:
                    // 1) can't find item 
                    // 2) item cannot be focus
                    // 3) target is an oj-component
                    // 4) target or one of its ancestors has the oj-clickthrough-disabled marker class
                    return;
                }

                if (this._isActionableMode() && this.m_active != null && this.m_active['elem'].get(0) != item.get(0))
                {
                    // click on item other than current focus item should exit actionable mode
                    this._exitActionableMode();
                }

                // make sure listview has focus
                if (!this._getListContainer().hasClass("oj-focus-ancestor"))
                {
                    this._getListContainer().addClass("oj-focus-ancestor");
                }

                // check if selection is enabled
                if (this._isSelectionEnabled() && this.IsSelectable(item[0]))
                {        
                    if (this._isTouchSupport())
                    {
                        this._handleTouchSelection(item, event);
                    }
                    else
                    {
                        this.HandleClickSelection(item, event);
                    }

                    // if user hits the padding part of item, since LI does not have tabindex anymore, item will not get focus
                    if (this.ShouldUseGridRole() && event.target == item.get(0))
                    {
                        this._focusItem(item);
                    }

                    // need to make sure every item in the selection have the draggable cursor
                    if (this._shouldDragSelectedItems())
                    {
                        this.m_dndContext.setSelectionDraggable();
                    }
                }
                else
                {
                    // if selection is disable, we'll still need to highlight the active item
                    this.HandleClickActive(item, event);
                }

                // click on input element inside item should trigger actionable mode
                if (this._isInputElement(target.get(0)))
                {
                    this._enterActionableMode();
                    return;
                }

                // clicking on header will expand/collapse item
                if (this.isExpandable() && target.closest("."+groupItemClass))
                {
                    if (this.GetState(item) == this.STATE_COLLAPSED)
                    {
                        this._expand(event);
                    }
                    else if (this.GetState(item) == this.STATE_EXPANDED)
                    {
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
    _shouldDragSelectedItems: function()
    {
        return this.m_dndContext != null && !this.m_dndContext.shouldDragCurrentItem()
    },
    /*********************************** end Event handlers *****************************/

    /*************************************** helper methods *****************************/
    /**
     * Whether touch is supported
     * @return {boolean} true if touch is supported, false otherwise
     * @private
     */
    _isTouchSupport: function()
    {
        return oj.DomUtils.isTouchSupported();
    },

    /**
     * Whether it is non-window touch device (iOS or Android)
     * @return {boolean} true if it is a non-window touch device
     * @private
     */
    _isNonWindowTouch: function()
    {
        return this._isTouchSupport() && oj.AgentUtils.getAgentInfo()['os'] != oj.AgentUtils.OS.WINDOWS;
    },

    /**
     * Returns either the ctrl key or the command key in Mac OS
     * @param {!Object} event
     * @private
     */
    _ctrlEquivalent: function(event)
    {
        return oj.DomUtils.isMetaKeyPressed(event);
    },

    /**
     * Helper method to create subid based on the root element's id
     * @param {string} subId the id to append to the root element id
     * @return {string} the subId to append to the root element id
     * @private
     */
    _createSubId: function(subId)
    {
        var id = this.element.attr("id");
        return [id, subId].join(":");
    },

    /**
     * Find the item element
     * @param {jQuery} elem
     * @return {jQuery|null}
     * @protected
     */
    FindItem: function(elem)
    {
        return $(elem).closest("."+this.getItemElementStyleClass());
    },

    /** 
     * Determine if click should be processed based on the element.
     * @param {jQuery} elem the element to check
     * @return {boolean} returns true if the element contains the special marker class, false otherwise.
     * @private
     */
    _isClickthroughDisabled: function(elem)
    {
        return elem.hasClass("oj-clickthrough-disabled");
    },

    /**
     * Find the item element from target, if target contains the oj-clickthrough-disabled class then returns null.
     * @param {jQuery} target the element to check
     * @param {boolean=} retElemOnClickthroughDisabled optional, set to true to force non-null value to return when 
     *                   clickthrough-disabled is encountered
     * @return {jQuery|null} the item element or null if click through is disabled for this element or one of its ancestors.
     * @private
     */
    _findItem: function(target, retElemOnClickthroughDisabled)
    {
        var current = target;
        while (current.length > 0)
        {
            if (this._isClickthroughDisabled(current))
            {
                if (retElemOnClickthroughDisabled)
                {
                    return current;
                }
                return null;
            }

            if (current.hasClass(this.getItemElementStyleClass()))
            {
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
    _getListContainerBorderWidth: function()
    {
        if (this.m_borderWidth == null)
        {
            this.m_borderWidth = parseInt(this._getListContainer().css("border-top-width"), 10) + parseInt(this._getListContainer().css("border-bottom-width"), 10);
        }

        return this.m_borderWidth;
    },

    /**
     * Scroll as needed to make the specified item visible
     * @param {Object} item the item to make visible
     */
    scrollToItem: function(item)
    {
        var key, elem, group;

        key = item['key'];
        if (key == null)
        {
            return;
        }

        elem = this.FindElementByKey(key);
        if (elem == null)
        {
            return;
        }

        if ($(elem).hasClass(this.getItemStyleClass()))
        {
            this._scrollToVisible(elem);
        }
        else
        { 
            // group item
            group = $(elem).children("."+this.getGroupItemStyleClass()).first();
            this._scrollToGroupHeader(group.get(0));
        }
    },

    /**
     * Scroll as needed to make an element visible in the viewport
     * @param {Element} elem the element to make visible
     * @private
     */
    _scrollToVisible: function(elem)
    {
        var top, height, container, containerScrollTop, containerHeight, headerTop, headerHeight, offset = 0, scrollTop;

        top = elem.offsetTop;
        height = elem.offsetHeight;
        container = this._getListContainer()[0];
        containerScrollTop = container.scrollTop;
        containerHeight = container.offsetHeight;

        // if there's sticky header, make sure the elem is not behind it
        if (this.m_groupItemToPin != null)
        {
            headerTop = parseInt(this.m_groupItemToPin.style.top, 10);
            headerHeight = $(this.m_groupItemToPin).outerHeight();
            if ((top <= headerTop && headerTop < top + height))
            {
                offset = ((height + top) - headerTop) / 2;    
            }
            else if ((top >= headerTop && top < headerTop + headerHeight))
            {
                offset = ((headerTop + headerHeight) - top) / 2;  
            }                
        }

        // if it's within viewport do nothing
        if (top >= containerScrollTop && top+height <= containerScrollTop+containerHeight)
        {
            if (offset > 0)
            {
                container.scrollTop = containerScrollTop - offset;
            }
            return;
        }

        // how much need to scroll to see the entire element, and to make sure the element top is always visible
        scrollTop = Math.max(0, Math.min(top - offset, Math.abs((top + height) - containerHeight)));
        if (scrollTop > containerScrollTop)
        {
            scrollTop = scrollTop + this._getListContainerBorderWidth();
        }
        container.scrollTop = scrollTop;        
    },

    /**
     * Get the key associated with an item element
     * @param {Element} elem the item element to retrieve the key
     * @return {Object|null} the key associated with the item element
     * @protected
     */
    GetKey: function(elem)
    {
        return this.m_contentHandler.GetKey(elem);
    },

    /**
     * Get the element associated with a key
     * @param {Object} key the key to retrieve the item element
     * @return {Element|null} the item element associated with the key 
     * @protected
     */
    FindElementByKey: function(key)
    {
        var id;

        if (this.m_keyElemMap != null)
        {
            id = this.m_keyElemMap.get(key);
            if (id != null)
            {
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
    GetIndexOf: function(arr, key)
    {
        var i;
        for (i=0; i<arr.length; i++)
        {
            if (key == arr[i] || oj.Object.compareValues(key, arr[i]))
            {
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
    _isExpandCollapseIcon: function(elem)
    {
        return $(elem).hasClass(this.getExpandIconStyleClass()) || $(elem).hasClass(this.getCollapseIconStyleClass());
    },
    /************************************ end helper methods *****************************/

    /*************************************** Navigation Common **************************/
    /**
     * Determine whether the key code is an arrow key
     * @param {number} keyCode
     * @return {boolean} true if it's an arrow key, false otherwise
     * @protected
     */
    IsArrowKey: function(keyCode)
    {
        if (this.isCardLayout())
        {
            return (keyCode == this.UP_KEY || keyCode == this.DOWN_KEY || keyCode == this.LEFT_KEY || keyCode == this.RIGHT_KEY);
        }
        else
        {
            return (keyCode == this.UP_KEY || keyCode == this.DOWN_KEY);
        }
    },

    /**
     * Retrieve the visible (flattened) items cache, create one if it is null.
     * @return {jQuery} a list of items
     * @private 
     */
    _getItemsCache: function()
    {
        var disclosureStyleClass, selector, isGroup;

        if (this.m_items == null)
        {
            disclosureStyleClass = this.getGroupCollapseStyleClass();
            selector = "."+this.getItemElementStyleClass() + ":visible";
            this.m_items = this.element.find(selector).filter(function(index)
            {
                isGroup = $(this).parent().hasClass(disclosureStyleClass);
                if (isGroup)
                {
                    return !($(this).parent().parent().hasClass("oj-collapsed"));
                } 
                return true;
            });
        }
        return this.m_items;
    },

    /**
     * Handles when navigate to the last item 
     * @param {jQuery} item the item element
     */
    _handleLastItemKeyboardFocus: function(item)
    {
        var next = item.get(0).nextElementSibling;
        if (next == null || !$(next).hasClass(this.getItemElementStyleClass()))
        {
           // it could be the last element of the group, if so, make sure it's the last group
           if (this.m_contentHandler.IsHierarchical() && item.parent().hasClass(this.getGroupStyleClass()))
           {
               if (item.parent().parent().get(0).nextElementSibling != null)
               {
                   // bail if it's not the last group
                   return;
               }
           }

           // it's the last element, check scroll bar to make sure it scrolls all the way to the bottom
           var scroller = this._getScroller();
           if (scroller.scrollTop < scroller.scrollHeight)
           {
               scroller.scrollTop = scroller.scrollHeight;
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
    HandleArrowKeys: function(keyCode, isExtend, event)
    {
        var current, processed;

        // ensure that there's no outstanding fetch requests
        if (!this.m_contentHandler.IsReady())
        {
            //act as if processed to prevent page scrolling before fetch done
            return true;
        }

        if (!isExtend || this.m_isNavigate)
        {
            current = this.m_active['elem'];
        }
        else
        {
            current = this.m_selectionFrontier;
        }

        // invoke different function for handling focusing on active item depending on whether selection is enabled
        processed = false;

        switch (keyCode)
        {
            case this.UP_KEY:
                if (this.isCardLayout() && $(current).hasClass(this.getItemStyleClass()))
                {
                    this._gotoItemAbove(current, isExtend, event);
                }
                else
                {
                    this._gotoPrevItem(current, isExtend, event);
                }

                // according to James we should still consume the event even if list view did not perform any action
                processed = true;
                break;
            case this.DOWN_KEY:
                if (this.isCardLayout() && $(current).hasClass(this.getItemStyleClass()))
                {
                    this._gotoItemBelow(current, isExtend, event);
                }
                else
                {
                    this._gotoNextItem(current, isExtend, event);
                }

                // according to James we should still consume the event even if list view did not perform any action
                processed = true;
                break;
            case this.LEFT_KEY:
            case this.RIGHT_KEY:
                if (this.isCardLayout())
                {
                    if (this.ojContext._GetReadingDirection() == "rtl")
                    {
                        keyCode = keyCode == this.LEFT_KEY ? this.RIGHT_KEY : this.LEFT_KEY;
                    }

                    if (keyCode == this.LEFT_KEY) 
                    {
                        this._gotoPrevItem(current, isExtend, event) 
                    }
                    else
                    {
                        this._gotoNextItem(current, isExtend, event);
                    }
                    processed = true;
                }
                break;
	}

        return processed;
    },

    /**
     * Go to the next item in the list
     * @private
     */
    _gotoNextItem: function(current, isExtend, event)
    {
        var items, currentIndex, next;

        items = this._getItemsCache();
        currentIndex = items.index(current);

        currentIndex++;
        if (currentIndex < items.length)
        {
            next = $(items[currentIndex]);
            // make sure it's focusable, otherwise find the next focusable item
            while (this.SkipFocus(next))
            {
                currentIndex++;
                if (currentIndex == items.length)
                {
                    return;
                }
                next = $(items[currentIndex]);
            }

            if (isExtend)
            {
                this._extendSelection(next, event);
                this.m_isNavigate = false;
            }
            else
            {
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
    _gotoPrevItem: function(current, isExtend, event)
    {
        var items, currentIndex, prev;

        items = this._getItemsCache();
        currentIndex = items.index(current);

        currentIndex--;
        if (currentIndex >= 0)
        {
            prev = $(items[currentIndex]);
            // make sure it's focusable, otherwise find the next focusable item
            while (this.SkipFocus(prev))
            {
                currentIndex--;
                if (currentIndex < 0)
                {
                    return;
                }
                prev = $(items[currentIndex]);
            }

            if (isExtend)
            {
                this._extendSelection(prev, event);
                this.m_isNavigate = false;
            }
            else
            {
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
    _getColumnCount: function(children)
    {
        var count, offsetTop, currentOffsetTop;

        children.each(function(index)
        {
            offsetTop = this.offsetTop;

            if (currentOffsetTop === undefined)
            {
                currentOffsetTop = offsetTop;
            }
            else if (currentOffsetTop != offsetTop)
            {
                // on a different row, return immediately
                return false;
            }

            count = index;
        });

        return count + 1;
    },

    /**
     * Inform screen reader that X number of items have been skipped during up/down arrow key navigation
     * @param {jQuery} next the item to navigate to
     * @param {number} count number of items skipped
     * @private
     */
    _updateSkipItemAriaLabel: function(next, count)
    {
        var id, root, focusElem;

        id = this._createSubId("extra_info");
        if (this.m_skipAriaLabelText == null)
        {
            root = $(document.createElement("div"));
            root.addClass("oj-helper-hidden-accessible")
                .attr("id", id); 
            this._getListContainer().append(root); // @HTMLUpdateOK
            this.m_skipAriaLabelText = root;
        }
        this.m_skipAriaLabelText.text(this.ojContext.getTranslatedString("accessibleNavigateSkipItems", {'numSkip': count}));        

        focusElem = this.getFocusItem(next);
        // make sure it has an id for aria-labelledby
        focusElem.uniqueId()
                 .attr("aria-labelledby", id+" "+focusElem.prop("id"));
    },

    /**
     * Undo what _updateSkipItemAriaLabel did to active element
     * @param {jQuery} current the item to remove aria property from
     * @private
     */
    _removeSkipItemAriaLabel: function(current)
    {
        var focusElem = this.getFocusItem(current);
        if (focusElem.length > 0)
        {
            focusElem.get(0).removeAttribute("aria-labelledby");
        }
    },

    /**
     * Go to the item above the current item in the list
     * @private
     */
    _gotoItemAbove: function(current, isExtend, event)
    {
        var parent, items, numOfCols, index, aboveIndex, above, numOfItemSkip;

        // if it's a group, just go to the previous item (which would be the last focusable item in the previous group)
        if (!current.hasClass(this.getItemStyleClass()))
        {
            this._gotoPrevItem(current);
            return;
        }

        parent = current.parent();
        items = parent.children("li."+this.getItemStyleClass())
        numOfCols = this._getColumnCount(items);
        index = items.index(current);
        aboveIndex = index - numOfCols;
        if (aboveIndex < 0)
        {
            // go to header, or stop if there's no header
            if (parent.hasClass(this.getGroupStyleClass()))
            {
                above = parent.parent();
                numOfItemSkip = index;
            }
        }
        else
        {
            above = $(items.get(aboveIndex));
            numOfItemSkip = numOfCols - 1;
        }

        if (above.length > 0)
        {
            // make sure it's focusable, otherwise no-op
            if (this.SkipFocus(above))
            {
                return;
            }

            if (isExtend)
            {
                this._extendSelection(above, event);
                this.m_isNavigate = false;
            }
            else
            {
                if (numOfItemSkip != undefined && numOfItemSkip > 0)
                {
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
    _gotoItemBelow: function(current, isExtend, event)
    {
        var parent, items, numOfCols, index, belowIndex, numOfRows, below, numOfItemSkip;

        // if it's a group, just go to the next item (which would be the first focusable item in the next group)
        if (!current.hasClass(this.getItemStyleClass()))
        {
            this._gotoNextItem(current);
            return;
        }

        parent = current.parent();
        items = parent.children("li."+this.getItemStyleClass())
        numOfCols = this._getColumnCount(items);
        index = items.index(current);
        belowIndex = index + numOfCols;
        if (belowIndex >= items.length)
        {
            numOfRows = Math.ceil(items.length/numOfCols);
            numOfItemSkip = (items.length - 1) - index;
            // if the current item is not on the last row, then go to the last item within group
            if (index < Math.max(0, (numOfRows - 1)*numOfCols))
            {
                below = items.last();
                // skip one less since going to an item within the same group
                numOfItemSkip--;
            }
            else
            {
                // go to header, or stop if there's no header
                if (parent.hasClass(this.getGroupStyleClass()))
                {
                    below = parent.parent().next("li."+this.getItemElementStyleClass());
                }
            }
        }
        else
        {
            below = $(items.get(belowIndex));
            numOfItemSkip = numOfCols - 1;
        }

        if (below.length > 0)
        {
            // make sure it's focusable, otherwise no-op
            if (this.SkipFocus(below))
            {
                return;
            }

            if (isExtend)
            {
                this._extendSelection(below, event);
                this.m_isNavigate = false;
            }
            else
            {
                if (numOfItemSkip != undefined && numOfItemSkip > 0)
                {
                    this._updateSkipItemAriaLabel(below, numOfItemSkip);
                }
                this.SetCurrentItem(below, event);
                this.m_isNavigate = true;
            }
        }
    },

    /**
     * Determine if the data grid is in actionable mode.
     * @return {boolean} true if the data grid is in actionable mode, false otherwise.
     * @private
     */
    _isActionableMode: function()
    {
        return (this.m_keyMode == "actionable");
    },

    /**
     * Sets whether the data grid is in actionable mode
     * @param {boolean} flag true to set grid to actionable mode, false otherwise
     * @private
     */
    _setActionableMode: function(flag)
    {
        this.m_keyMode = flag ? "actionable" : "navigation";

        if (!flag)
        {
            // focus should be shift back to active descendant container
            this.element[0].focus();
        }
    },
    /************************************ end Navigation Common **************************/

    /************************************ Active item ******************************/
    /**
     * Retrieve the focus element
     * @param {jQuery} item the list item
     * @return {jQuery} the focus element
     * @private
     */
    getFocusItem: function(item)
    {
        var cell;

        if (!item.hasClass(this.getFocusedElementStyleClass()))
        {
            return $(item.find('.'+this.getFocusedElementStyleClass()).first());
        }
        else
        {
            if (this.ShouldUseGridRole() && item.attr("role") == "row")
            {
                cell = item.children(".oj-listview-cell-element").first();
                return cell.length == 0 ? item.children().first() : cell;
            }
            else
            {
                return item;
            }
        }
    },

    /**
     * Sets the tab index attribute of the root element
     * To be change by NavList
     * @protected
     */
    SetRootElementTabIndex: function()
    {
        this.element.attr("tabIndex", 0);
    },

    /**
     * Removes the tab index attribute of the root element
     * To be change by NavList
     * @protected
     */
    RemoveRootElementTabIndex: function()
    {
        this.element.removeAttr("tabIndex");
    },

    /**
     * Sets the tab index on focus item
     * @param {jQuery} item the focus item
     * @private
     */
    _setTabIndex: function(item)
    {
        // note that page author should not set any tabindex on the item
        this.getFocusItem(item).attr("tabIndex", 0);
    },

    /**
     * Resets the tab index set on focus item
     * @param {jQuery} item the focus item
     * @private
     */
    _resetTabIndex: function(item)
    {
        var removeAttr, isGroupItem;

        removeAttr = true;
        if (item.attr("role") === "presentation")
        {
            removeAttr = false;
        }

        item = this.getFocusItem(item);
        if (removeAttr)
        {
            item.removeAttr("tabIndex");
        }
        else
        {
            item.attr("tabIndex", -1);
        }

    },

    /**
     * Make an item focusable
     * @param {jQuery} item the item to focus
     * @private
     */
    _makeFocusable: function(item)
    {
        this._setTabIndex(item);
    },

    /**
     * Determine the only focusable element inside an item, if the item does not have any or have 
     * more than one focusable element, then just return the item.
     * @param {jQuery} item the list item
     * @return {jQuery} see above for what's get returned
     * @private
     */
    getSingleFocusableElement: function(item)
    {
        var selector, childElements;

        selector = "a, input, select, textarea, button";
        childElements = item.children(selector);

        if(childElements.length === 1 && // check for only one focusbale child
           childElements.first().find(selector).length === 0)
        {
            //check to ensure no nested focusable elements.
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
    _setCurrentItemOption: function(newValue, event, currentElem)
    {
        var extra = {'item': this.ojContext._IsCustomElement() ? currentElem : $(currentElem)}; 
        this.SetOption("currentItem", newValue, {'_context': {originalEvent: event, internalSet: true, extraData: extra}, 'changed': true});
    },

    /**
     * Sets the active item
     * @param {jQuery} item the item to set as active
     * @param {Event} event the event that triggers set active
     * @param {boolean=} skipFocus true if to skip focusing the item
     * @return {boolean} true if item becomes active, false for all other cases
     * @private
     */
    _setActive: function(item, event, skipFocus)
    {
        var elem, key, ui, cancelled, active;

        // set key info
        if (item != null)
        {
            elem = item[0];
            key = this.GetKey(elem);

            if ((this.m_active == null) || key != this.m_active['key'])
            {
                // fire beforecurrentItem
                ui = {'key': key, 'item': item};
                if (this.m_active != null)
                {
                    ui['previousKey'] = this.m_active['key'];
                    ui['previousItem'] = this.m_active['elem'];
                    // for touch, remove draggable when active item changed
                    if (this._shouldDragSelectedItems() && this._isTouchSupport())
                    {
                        this.m_dndContext._unsetDraggable(ui['previousItem']);                    
                    }

                    // remove aria-labelledby set by arrow key navigation
                    this._removeSkipItemAriaLabel(ui['previousItem']);
                }

                cancelled = !this.Trigger("beforeCurrentItem", event, ui);
                if (cancelled) 
                {
                    return false;
                }

                active = {'key': key, 'elem': item};
                this.m_active = active;

                // for touch, set draggable when item becomes active
                if (this._shouldDragSelectedItems() && this._isTouchSupport())
                {
                    this.m_dndContext._setDraggable(item);
                }

                // update tab index
                if (skipFocus === undefined || !skipFocus)
                {
                    // make item focusable
                    this._makeFocusable(item);

                    // style should be updated before currentItem change event is fired
                    this.HighlightActive();

                    // focus on it only for non-click events or when done programmatically
                    // the issue is we can't shift focus on click since it will steal focus from the popups
                    // the focusing on item is done already on mousedown
                    if (event == null || (event.originalEvent && event.originalEvent.type != "click"))
                    {
                        this._focusItem(item);
                    }

                    // reset tabindex of previous focus item, note this has to be done after focusing on a new item
                    // because in Chrome 57, resetting tabindex on a focus item will cause a blur event
                    // note also it seems this only happens when removing tabindex, if you set it to -1 this does not happen
                    this.RemoveRootElementTabIndex();
                    if (ui['previousItem'])
                    {
                        this._resetTabIndex(ui['previousItem']);
                    }
                }

                return true;
            }
            else if (key == this.m_active['key'])
            {
                active = {'key': key, 'elem': item};
                this.m_active = active;

                // update tab index
                if (skipFocus === undefined || !skipFocus)
                {
                    this._makeFocusable(item);
                    // make sure ul is not tabbable
                    this.RemoveRootElementTabIndex();
                }
            }
        }
        else
        {
            // item is null, just clears the current values
            this.m_active = null;
        }

        return false;
    },

    /**
     * Put browser focus on item (or children of item)
     * @private
     */
    _focusItem: function(item)
    {
        this.getFocusItem(item).focus();
    },

    /**
     * Highlight active element
     * @protected
     */
    HighlightActive: function()
    {
        var item, target;

        // don't highlight and focus item if ancestor does not have focus
        if (this.m_active != null && this._getListContainer().hasClass("oj-focus-ancestor"))
        {   
            item = this.m_active['elem'];
            this._highlightElem(item, "oj-focus");
        }
    },

    /**
     * Unhighlight the active index, and turn the active index to selected instead if selectActive is true.
     * @protected
     */
    UnhighlightActive: function()
    {
        if (this.m_active != null)
        {
            this._unhighlightElem(this.m_active['elem'], "oj-focus");
        }
    },

    HandleClickActive: function(item, event)
    {
        // if click is triggered by target inside the active item, then do nothing
        var active = this.m_active != null ? this.m_active['elem'].get(0) : null;
        // if it's a group, use the group header div instead otherwise active.contains check will not be valid
        if (active != null && !$(active).hasClass(this.getItemStyleClass()))
        {
            active = active.firstElementChild;
        }

        if (event != null && active != null && active != event.target && active.contains(event.target))
        {
            return;
        }

        this.SetCurrentItem(item, event, this.ShouldUseGridRole() ? event.target != item.get(0) : true);
    },

    /**
     * Sets the active item and bring focus to it.  Update the currentItem option.
     * @protected
     */
    SetCurrentItem: function(item, event, skipFocus)
    {
        var proceed = this.ActiveAndFocus(item, event, skipFocus);
        if (proceed)
        {
            this._setCurrentItemOption(this.GetKey(item[0]), event, item.get(0));
        }
    },

    /**
     * Sets the active item and bring focus to it.
     * @protected
     */
    ActiveAndFocus: function(item, event, skipFocus)
    {
        var proceed = false;

        // make sure that it is visible
        this._scrollToVisible(item[0]);

        // unhighlight any previous active item
        this.UnhighlightActive();

        // update active and frontier
        proceed = this._setActive(item, event, skipFocus);

        // highlight active
        this.HighlightActive();

        return proceed;
    },
    /************************************ end Active item ******************************/

    /************************************* Selection ***********************************************/
    /**
     * If selection is enabled and at least one item has to be selected, then
     * make sure the first selectable item is selected in the list.
     */
    enforceSelectionRequired: function()
    {
        var selection;

        if (this._isSelectionEnabled() && this._isSelectionRequired())
        {
            selection = this.GetOption("selection");
            if (selection == null || selection.length == 0)
            {
                this._selectFirstSelectableItem();
            }
        }            
    },

    /**
     * Returns the first selectable item in the list.
     * @private
     */
    _getFirstSelectableItem: function()
    {
        // currently, an item will have the aria-selected attribute defined only if it's selectable
        // so we are using that here to find all selectable items.
        var elem = this.element[0].querySelector(".oj-listview-cell-element[aria-selected]");
        return elem == null ? null : elem.parentNode;
    },

    /**
     * Selects the first selectable item
     * @private
     */
    _selectFirstSelectableItem: function()
    {
        var first, item, selection, key, selectableElems;

        item = this._getFirstSelectableItem();

        // select the item if found
        if (item)
        {
            key = this.m_contentHandler.GetKey(item);
            if (key != null)
            {
                this._applySelection(item, key);
                this._setSelectionOption([key], null, [item]);
            }
        }
    },

    /**
     * Check if selection enabled by options on the list
     * @return {boolean} true if selection enabled
     * @private
     */
    _isSelectionEnabled: function()
    {
        return (this.GetOption("selectionMode") != "none");
    },

    /**
     * Check if there should be at least one item selected in the list
     * @return {boolean} true if selection is required
     * @private
     */
    _isSelectionRequired: function()
    {
        return this.GetOption("selectionRequired");
    },

    /**
     * Check whether multiple selection is allowed by options on the list
     * @return {boolean} true if multiple selection enabled
     * @private
     */
    _isMultipleSelection: function()
    {
        return (this.GetOption("selectionMode") == "multiple");
    },

    /**
     * Check whether the item is selectable
     * @param {Element} item the item element
     * @return {boolean} true if item is selectable
     * @protected
     */
    IsSelectable: function(item)
    {
        item = this.getFocusItem($(item)).get(0);
        return item.hasAttribute("aria-selected");
    },

    /**
     * Filter the array of selection.  Remove any items that are not selectable, or if there are more than one items
     * when selectionMode is single.
     * @param {Array} selection array of selected items
     * @return {Array} filtered array of items
     * @private
     */
    _filterSelection: function(selection)
    {
        var filtered, i, elem;

        filtered = [];
        for (i=0; i<selection.length; i++)
        {
            elem = this.FindElementByKey(selection[i]);
            if (elem == null || (elem != null && this.IsSelectable(elem)))
            {
                filtered.push(selection[i]);

                // if single selection mode, we can stop
                if (!this._isMultipleSelection())
                {
                    break;
                }
            }
        }

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
    _setSelectionOption: function(newValue, event, selectedElems, firstSelectedItemData)
    {
        var firstSelectedItem, value = {'key': null, 'data': null}, extra;

        // check if the value has actually changed, based on key
        // firstSelectedItem should never be null and should always have 'key'
        firstSelectedItem = this.GetOption("firstSelectedItem");

        // NavList firstSelectedItem would be undefined
        if (firstSelectedItem != null)
        {
            // first condition is if new value is empty (should never be null) and existing item is non null
            // second condition is if new value is not empty and does not match the existing item
            if (((newValue == null || newValue.length == 0) && firstSelectedItem['key'] != null) || 
                 (!(newValue[0] == firstSelectedItem['key'] || oj.Object.compareValues(newValue[0], firstSelectedItem['key']))))
            {
                // update firstSelectedItem also
                if (newValue != null && newValue.length > 0)
                {
                    value = {'key': newValue[0], 'data': firstSelectedItemData != undefined ? firstSelectedItemData : this.getDataForVisibleItem({'key': newValue[0]})};
                }

                this.SetOption("firstSelectedItem", value, {'_context': {originalEvent: event, internalSet: true}, 'changed': true});
            }
        }

        extra = {'items': this.ojContext._IsCustomElement() ? selectedElems : (selectedElems == null ? $({}) : $(selectedElems))}; 
        this.SetOption("selection", newValue, {'_context': {originalEvent: event, internalSet: true, extraData: extra}, 'changed': true});
    },

    /**
     * Unhighlights the selection.  Does not change selection, focus, anchor, or frontier
     * @private
     */
    _unhighlightSelection: function()
    {
        var self, elem;

        if (this.m_keyElemMap == null)
        {  
            return;
        }

        self = this;
        $.each(this.GetOption("selection"), function(index, value)
        {
            elem = self.FindElementByKey(value);
            if (elem != null)
            {
                self._unhighlightElem(elem, "oj-selected");
            }
        });
    },

    _highlightElem: function(elem, style)
    {
        this.HighlightUnhighlightElem(elem, style, true);
    },

    _unhighlightElem: function(elem, style)
    {
        this.HighlightUnhighlightElem(elem, style, false);
    },

    /**
     * Highlight or unhighlight an element
     * @param {jQuery|Element} elem the element the highlight or unhighlight
     * @param {string} style the style to add or remove
     * @param {boolean} highlight true if it's to highlight, false if it's to unhighlight
     * @protected
     */
    HighlightUnhighlightElem: function(elem, style, highlight)
    {
        var group;

        elem = $(elem);

        if (style == "oj-selected")
        {
            this.getFocusItem(elem).attr("aria-selected", highlight ? "true" : "false");
        }

        // if item is a group, the highlight should be apply to the group item element
        group = elem.children("."+this.getGroupItemStyleClass());
        if (group.length > 0)
        {
            elem = $(group[0]);
        }

        if (style === "oj-focus")
        {
            if (highlight)
            {
                // don't apply focus ring on item if we are in actionable mode
                if (this.m_keyMode != "actionable")
                {
                    this._focusInHandler(elem);
                }
            }
            else
            {
                this._focusOutHandler(elem);
            }
        }
        else
        {
            if (highlight)
            {
                elem.addClass(style);
            }
            else
            {
                elem.removeClass(style);
            }
        }    
    },

    /**
     * Handles click to select multiple cells/rows
     * @param {jQuery} item the item clicked on
     * @param {Event} event the click event
     * @protected
     */
    HandleClickSelection: function(item, event)
    {
        var ctrlKey, shiftKey;

        // make sure that it is visible
        this._scrollToVisible(item[0]);

        ctrlKey = this._ctrlEquivalent(event);
        shiftKey = event.shiftKey;
        if (this._isMultipleSelection())
        {
            if (!ctrlKey && !shiftKey)
            {
                this.SelectAndFocus(item, event);
            }
            else if (!ctrlKey && shiftKey)
            {
                // active item doesn't change in this case
                this._extendSelection(item, event);
            }
            else
            {
                this._augmentSelectionAndFocus(item, event);
            }
        }
        else
        {
            this.SelectAndFocus(item, event);
        }
    },

    /**
     * Handles tap to select multiple cells/rows
     * @param {jQuery} item the item clicked on
     * @param {Event} event the click event
     * @private
     */
    _handleTouchSelection: function(item, event)
    {
        if (this._isMultipleSelection())
        {
            if (event.shiftKey)
            {
                // for touch device with keyboard support
                this._extendSelection(item, event);
            }
            else
            {
                // treat this as like ctrl+click
                this._augmentSelectionAndFocus(item, event);
            }
        }
        else
        {
            this.SelectAndFocus(item, event);
        }
    },

    /**
     * Clear the current selection.
     * @param {boolean} updateOption true if the underlying selection option should be updated, false otherwise.
     * @param {jQuery=} newSelectionFrontier new value to set the selection frontier. If none specified, set to null
     * @private
     */
    _clearSelection: function(updateOption, newSelectionFrontier)
    {
        // unhighlight previous selection
        this._unhighlightSelection();

        if (updateOption)
        {
            // if the intend is to empty selection option, we have to make sure if
            // selectionRequired is set to true that something is selected
            if (this._isSelectionRequired())
            {
                this._selectFirstSelectableItem();
            }
            else
            {
                this._setSelectionOption([], null, null);
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
    SelectAndFocus: function(item, event)
    {
        var key, selection, index;

        key = this.GetKey(item[0]);
        selection = this.GetOption("selection");
        index = this.GetIndexOf(selection, key);

        // if it's already selected, deselect it and update options
        this._clearSelection(index > -1);

        if (index == -1)
        {
            // add the elem to selection
            this._augmentSelectionAndFocus(item, event, []);            
        }
    },

    /**
     * Shift+click to extend the selection
     * @param {jQuery} item the item to extend selection to
     * @param {Event} event the key event
     * @private
     */
    _extendSelection: function(item, event)
    {
        var current;

        if (this.m_active == null)
        {
            return;
        }
    
        // checks if selection has changed
        current = this.m_selectionFrontier;
        if (current == item)
        {
            return;
        }

        // remove focus style on the item click on
        this._unhighlightElem(item, "oj-focus");

        this._extendSelectionRange(this.m_active['elem'], item, event);
    },

    /**
     * Extend the selection
     * @param {jQuery} from the item to extend selection from
     * @param {jQuery} to the item to extend selection to
     * @param {Event} event the event that triggers extend
     * @param {boolean=} keepSelectionFrontier true if we don't want to modify the selectionFrontier
     * @private
     */
    _extendSelectionRange: function(from, to, event, keepSelectionFrontier)
    {
        if (keepSelectionFrontier === true)
        {
        // clear selection as we'll be just re-highlight the entire range
            this._clearSelection(false, this.m_selectionFrontier);
        }
        else 
        {
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
    _highlightRange: function(start, end, event)
    {
        var selection, selectedItems, items, startIndex, endIndex, from, to, i, item, key;

        selection = [];
        selectedItems = [];
        items = this._getItemsCache();
        startIndex = items.index(start); 
        endIndex = items.index(end);

        if (startIndex > endIndex)
        {
            from = endIndex;
            to = startIndex;
        }
        else
        {
            from = startIndex;
            to = endIndex;
        }

        // exclude start and include end
        for (i=from; i<=to; i++)
        {
            item = items[i];
            if (this.IsSelectable(item))
            {
                key = this.m_contentHandler.GetKey(item);

                this._applySelection(item, key);
                selection.push(key);
                selectedItems.push(item);
            }
        }

        // trigger the optionChange event
        this._setSelectionOption(selection, event, selectedItems);
    },

    /**
     * Apply selection to the element
     * @param {jQuery|Element} element the item to apply selection
     * @param {Object} key the key of the item
     * @private
     */
    _applySelection: function(element, key)
    {
        // update map that keeps track of key->element
        if (this.m_keyElemMap == null)
        {
            this.m_keyElemMap = new oj.KeyMap();
        }
        this.m_keyElemMap.set(key, $(element).attr("id"));

        // highlight selection
        this._highlightElem(element, 'oj-selected');
    },

    /**
     * Ctrl+click to add item to the current selection
     * @param {jQuery} item the item to augment selection to
     * @param {Event} event the event that triggers the selection
     * @param {Array=} selection the optional selection to augment, if not specified, use current selection
     * @private
     */
    _augmentSelectionAndFocus: function(item, event, selection)
    {
        var active, key, currentActive, proceed = false, index, selectedItems, i;

        active = item;
        key = this.GetKey(item[0]);

        if (selection == undefined)
        {
            selection = this.GetOption("selection").slice(0);
        }

        // update active only if target is not inside the active item
        currentActive = this.m_active != null ? this.m_active['elem'].get(0) : null;
        // if it's a group, use the group header div instead otherwise currentActive.contains check will not be valid
        if (currentActive != null && !$(currentActive).hasClass(this.getItemStyleClass()))
        {
            currentActive = currentActive.firstElementChild;
        }

        if (event != null && (currentActive == null || currentActive == event.target || !currentActive.contains(event.target)))
        {
            this.UnhighlightActive();

            // update active cell and frontier
            proceed = this._setActive(active, event);
            if (proceed)
            {
                // update current option
                this._setCurrentItemOption(key, event, active.get(0));
            }

            // highlight index
            this.HighlightActive();
        }

        // checks if setActive was successful
        currentActive = this.m_active != null ? this.m_active['elem'].get(0) : null;
        if (currentActive == null || currentActive != active.get(0))
        {
            // update selection if it was cleared
            if (selection != null && selection.length == 0)
            {
                this._setSelectionOption(selection, event, []);
            }
            return;
        }

        index = this.GetIndexOf(selection, key);
        if (index > -1)
        {
            // it was selected, deselect it
            this._unhighlightElem(item, "oj-selected");
            selection.splice(index, 1);
        }
        else
        {
            this.m_selectionFrontier = item;
            this._applySelection(item, key);
            selection.push(key);
        }

        selectedItems = new Array(selection.length);
        for (i = 0; i < selection.length; i++)
        {
            selectedItems[i] = this.FindElementByKey(selection[i]);
        }

        // trigger option change
        this._setSelectionOption(selection, event, selectedItems);
    },

    /**
     * Toggle selection of an item.  If an item was selected, it deselects it.  If an item was not selected, it selects it.
     * @param {Event} event the event that triggers the selection
     * @param {boolean} keepCurrentSelection true if selecting an item would not deselect other selected items, false otherwise
     * @param {boolean} skipIfNotSelected true if an selected item should not be deselected, false otherwise
     * @protected
     */
    ToggleSelection: function(event, keepCurrentSelection, skipIfNotSelected)
    {
        // if it's currently selected, deselect it
        var selection, selectedItems, item, key, index, i;

        selection = this.GetOption("selection").slice(0);
        item = this.m_active['elem'];
        key = this.m_active['key'];        

        index = this.GetIndexOf(selection, key);
        if (index > -1)
        {
            // do not deselect the item if it's the last selected item and selection is required
            if (skipIfNotSelected || (selection.length == 1 && this._isSelectionRequired()))
            {
                return;
            }

            // it was selected, deselect it
            this._unhighlightElem(item, "oj-selected");
            selection.splice(index, 1);

            if (selection.length == 0)
            {
                this.m_selectionFrontier = null;
            }
        }
        else
        {
            if (this.IsSelectable(item[0]))
            {
                // deselect any selected items
                if (!keepCurrentSelection)
                {
                    this._clearSelection(false);
                    selection.length = 0;
                }

                this.m_selectionFrontier = item;

                // select current item
                this._applySelection(item, key);
                selection.push(key);
            }
        }

        selectedItems = new Array(selection.length);
        for (i = 0; i < selection.length; i++)
        {
            selectedItems[i] = this.FindElementByKey(selection[i]);
        }

        // trigger option change
        this._setSelectionOption(selection, event, selectedItems);
    },

    /**
     * Checks whether the element is an input element. 
     * @param {Element} elem the element to check
     * @return {boolean} true if it's input, false otherwise
     * @private
     */
    _isInputElement: function(elem)
    {
        var inputRegExp = /^INPUT|SELECT|OPTION|TEXTAREA/; 
        return elem.nodeName.match(inputRegExp) != null && !elem.readOnly;  
    },

    /**
     * Handles key event for selection or active
     * @param {Event} event
     * @return {boolean} true if the event is processed
     * @protected
     */
    HandleSelectionOrActiveKeyDown: function(event)
    {
        var keyCode, current, ctrlKey, shiftKey, processed = false, first, last, ui;

        // this could happen if nothing in the list is focusable
        if (this.m_active == null)
        {
            return false;
        }

        keyCode = event.keyCode;
        current = this.m_active['elem'];

        if (this._isActionableMode())
        {
            // Esc key goes to navigation mode
            if (keyCode == this.ESC_KEY)
            {
                this._exitActionableMode();

                // force focus back on the active cell
                this.HighlightActive();
                this._focusItem(current);

                // make sure active item has tabindex set
                this._setTabIndex(current);
                processed = true;
            }
            else if (keyCode === this.TAB_KEY)
            {
                // check if it's the last element in the item
                first = current.find("[data-first]");  
                last = current.find("[data-last]");
                if (event.shiftKey)
                {
                    if (first.length > 0 && last.length > 0 && first != last && event.target == first[0])
                    {
                        // recycle to last focusable element in the cell
                        last[0].focus();
                        processed = true;
                    }
                }
                else
                {
                    if (first.length > 0 && last.length > 0 && first != last && event.target == last[0])
                    {
                        // recycle to first focusable element in the cell
                        first[0].focus();
                        processed = true;
                    }
                } 
                // otherwise don't process and let browser handles tab
            }
        }
        else
        {        
            // F2 key goes to actionable mode
            if (keyCode == this.F2_KEY)
            {
                this._enterActionableMode();

                // focus on first focusable item in the cell
                first = current.find("[data-first]");
                if (first.length > 0)
                {
                    first[0].focus();

                    if (this._isExpandCollapseIcon(first))
                    {
                        this._focusInHandler(first);
                    }

                    // check if it's group item
                    if (!current.hasClass(this.getItemStyleClass()))
                    { 
                        current = current.children("."+this.getGroupItemStyleClass()).first();
                    }
                    current.removeClass("oj-focus-highlight");
                }
            }
            else if (keyCode == this.SPACE_KEY && this._isSelectionEnabled())
            {
                ctrlKey = this._ctrlEquivalent(event);
                shiftKey = event.shiftKey;
                if (shiftKey && !ctrlKey && this.m_selectionFrontier != null && this._isMultipleSelection())
                {
                    // selects contiguous items from last selected item to current item
                    this._extendSelectionRange(this.m_selectionFrontier, this.m_active['elem'], event, true);
                }
                else
                {
                    // toggle selection, deselect previous selected items
                    this.ToggleSelection(event, ctrlKey && !shiftKey && this._isMultipleSelection(), false);
                }
                processed = true;
            }
            else if (keyCode == this.ENTER_KEY && this._isSelectionEnabled())
            {
                // selects it if it's not selected, do nothing if it's already selected
                this.ToggleSelection(event, false, true);
            }
            else if (this.IsArrowKey(keyCode))
            {
                ctrlKey = this._ctrlEquivalent(event);
                shiftKey = event.shiftKey;
                if (!ctrlKey)
                {
                    processed = this.HandleArrowKeys(keyCode, (shiftKey && this._isSelectionEnabled() && this._isMultipleSelection()), event);
                }
            }
            else if (keyCode === this.TAB_KEY)
            {
                // content could have changed, disable all elements in items before or after the active item
                if (event.shiftKey)
                {
                    this._disableAllTabbableElementsBeforeItem(current);
                }
                else
                {
                    this._disableAllTabbableElementsAfterItem(current);
                }
            }
        }

        return processed;
    },
    /********************************** End Selection **********************************************/

    /********************************** Disclosure **********************************************/
    /**
     * Whether the group item is currently in the middle of expanding/collapsing
     * @param {Object} key the key of the group item
     * @return {boolean} true if it's expanding/collapsing, false otherwise
     * @private
     */
    _isDisclosing: function(key)
    {
        if (key && this.m_disclosing)
        {
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
    _setDisclosing: function(key, flag)
    {
        var index;

        if (key == null)
        {
            return;
        }

        if (this.m_disclosing == null)
        {
            this.m_disclosing = [];
        }

        if (flag)
        {
            this.m_disclosing.push(key);
        }
        else
        {
            // there should be at most one entry, but just in case remove all occurrences
            index = this.m_disclosing.indexOf(key);
            while (index > -1)
            {
                this.m_disclosing.splice(index, 1);
                index = this.m_disclosing.indexOf(key);
            }
        }
    },         

    /**
     * Gets the animation effect for the specific action
     * @param {string} action the action to retrieve the effect
     * @return {Object} the animation effect for the action
     */
    getAnimationEffect: function(action)
    {
        var defaultAnimations;

        if (this.defaultOptions == null)
        {
            this.defaultOptions = oj.ThemeUtils.parseJSONFromFontFamily(this.getOptionDefaultsStyleClass());
        }

        defaultAnimations = this.defaultOptions['animation'];
        return defaultAnimations == null ? null : defaultAnimations[action];
    },

    /**
     * Whether group items can be expand/collapse.
     * @return {boolean} true if group items can be expand/collapse, false otherwise.
     */
    isExpandable: function()
    {
        return this.GetOption("drillMode") != "none";
    },
    /**
     * Whether ListView should expand all expandable items.
     * @return {boolean} true if expand all, false otherwise
     * @private
     */
    _isExpandAll: function()
    {
        var expanded = this.GetOption("expanded");
        // for legacy syntax, which supports 'auto' and 'all'
        // TODO: should add check for custom element, but can't do it until NavList also move to KeySet
        if (expanded === 'auto')
        {
            // if drillMode is none and no expanded state is specified, expand all
            if (!this.isExpandable())
            {
                 return true;
            }
        }
        else if (expanded === 'all')
        {
            return true;
        }

        // for custom element and also legacy syntax that uses the new KeySet"expand
        if (expanded.isAddAll)
        {
            // if drillMode is none and no expanded state is specified, expand all
            return (!this.isExpandable() && expanded instanceof oj._ojListViewExpandedKeySet) ? true : expanded.isAddAll();
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
    expandKey: function(key, beforeVetoable, fireBefore, fireAfter, animate)
    {
        var item = this.FindElementByKey(key);
        if (item != null)
        {
            this.ExpandItem($(item), null, animate, key, beforeVetoable, fireAfter, fireBefore);    
        }
    },

    /**
     * Handle expand operation
     * @param {Event} event the event that triggers the expand
     * @private
     */
    _expand: function(event)
    {
        var item = this.FindItem(event.target);
        if (item != null && item.length > 0)
        {
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
    ExpandItem: function(item, event, animate, key, beforeVetoable, fireEvent, fireBeforeEvent)
    {
        var ui, cancelled, index;

        // checks if it's already collapsed or not collapsible at all
        if (this.GetState(item) != this.STATE_COLLAPSED)
        {
            return;
        }

        // if key wasn't specified, find it
        if (key == null)
        {
            key = this.GetKey(item[0]);
        }

        // bail if it's in the middle of expanding/collapsing
        if (animate && this._isDisclosing(key))
        {
            return;
        }

        ui = {"item": item, "key": key};

        if (fireBeforeEvent)
        {
            cancelled = !this.Trigger("beforeExpand", event, ui);
            if (cancelled && beforeVetoable) 
            {
                return;
            }
        }

        this.signalTaskStart("Expand item: "+key); // signal method task start

        if (animate)
        {
            this._setDisclosing(key, true);
        }
        this.m_contentHandler.Expand(item, function(groupItem){this._expandSuccess(groupItem, animate, event, ui, fireEvent)}.bind(this));

        // clear items cache
        this.m_items = null;

        // prevent item click handler to trigger
        if (event != null)
        {
            event.stopPropagation();
        }

        // update var that keeps track of collapsed items
        if (!this.ojContext._IsCustomElement() && this._collapsedKeys != null)
        {
            index = this._collapsedKeys.indexOf(key);
            if (index != -1)
            {
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
    _expandSuccess: function(groupItem, animate, event, ui, fireEvent)
    {
        var animationPromise, item, collapseClass, expandClass, expandingClass, groupItemStyleClass, currValue, newValue, self = this;

        this.signalTaskStart("Handle results from successful expand"); // signal method task start

        // save the key for use when expand complete
        groupItem.key = ui['key'];

        animationPromise = this.AnimateExpand($(groupItem), animate, event);

        item = groupItem.parentNode;

        item = $(item);
        // update aria expanded
        this.SetState(item, this.STATE_EXPANDED);
        // update icon
        collapseClass = this.getCollapseIconStyleClass();
        expandClass = this.getExpandIconStyleClass();
        expandingClass = this.getExpandingIconStyleClass();
        groupItemStyleClass = this.getGroupItemStyleClass();
        item.children("."+groupItemStyleClass).find("."+collapseClass+", ."+expandingClass)
                                              .removeClass(collapseClass)
                                              .removeClass(expandingClass)
                                              .addClass(expandClass);

        // fire expand event after expand animation completes
        if (fireEvent)
        {
            animationPromise.then(function() {
                // update option.  As an optimization do it only when fireEvent is true since this is the
                // only time when it's not triggered by API, in which case the value is already current
                if (self.ojContext._IsCustomElement())
                {
                    currValue = self.GetOption("expanded");
                    if (self._isKeySet(currValue) && !currValue.has(groupItem.key))
                    {
                        newValue = currValue.add([groupItem.key]);
                        self.SetOption("expanded", newValue, {'_context': {originalEvent: event, internalSet: true}, 'changed': true});
                    }
                }

                self.Trigger("expand", event, ui);
            });
        }

        animationPromise.then(function() {
          self.signalTaskEnd(); // signal method task end
        });
    },

    /**
     * Adjust the max height of ancestors of a group items.
     * @param {jQuery} groupItem the group item where we want to adjust its ancestors max height
     * @param {number} delta the height to increase
     * @private
     */
    _adjustAncestorsMaxHeight: function(groupItem, delta)
    {
        var maxHeight;

        groupItem.parentsUntil("ul.oj-component-initnode", "ul."+this.getGroupStyleClass()).each(function(index)
        {
            maxHeight = parseInt($(this).css("maxHeight"), 10);
            if (maxHeight > 0)
            {
                $(this).css("maxHeight", (maxHeight + delta) +"px");
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
    AnimateExpand: function(groupItem, animate, event)
    {
        var totalHeight = 0, animationPromise, animationResolve, self = this, elem, action = "expand", promise;
        
        animationPromise = new Promise(function(resolve, reject) 
        {
            animationResolve = resolve;
        });

        if (animate)
        {
            this.signalTaskStart("Animate expand of group item"); // signal task start

            groupItem.children().each(function()
            {
                totalHeight = totalHeight + $(this).outerHeight(true);
            });

            // for touch we'll need to re-adjust the max height of parent nodes since max height doesn't get remove
            if (this._isTouchSupport())
            {
                this._adjustAncestorsMaxHeight(groupItem, totalHeight);
            }

            groupItem.css("maxHeight", totalHeight+"px");

            this.signalTaskStart("Kick off expand animation"); // signal expand animation started. Ends in _handleExpandTransitionEnd()

            // now show it
            elem = /** @type {Element} */ (groupItem.get(0));
            promise = this.StartAnimation(elem, action);
            promise.then(function(val)
            {
                self._handleExpandTransitionEnd(groupItem, animationResolve);
            });

            this.signalTaskEnd(); // signal task end
        }
        else
        {
            // for touch it will need max height set initially in order for it to animate correctly
            if (this._isTouchSupport())
            {
                groupItem.children().each(function()
                {
                    totalHeight = totalHeight + $(this).outerHeight(true);
                });
                groupItem.css("maxHeight", totalHeight+"px");

                this._adjustAncestorsMaxHeight(groupItem, totalHeight);
            }
            else
            {
                groupItem.css("maxHeight", "");
            }

            this.AnimateExpandComplete(groupItem);
            animationResolve(null); // resolve animationPromise
        }
        return animationPromise;
    },

    _handleExpandTransitionEnd: function(groupItem, animationResolve)
    {
        var item;

        // on ios removing max-height will cause double animation
        if (!this._isTouchSupport())
        {
            groupItem.css("maxHeight", "");
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
    AnimateExpandComplete: function(groupItem)
    {
        groupItem.removeClass(this.getGroupCollapseStyleClass()).addClass(this.getGroupExpandStyleClass());
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
    collapseKey: function(key, fireBefore, fireAfter, animate)
    {
        var item = this.FindElementByKey(key);
        if (item != null)
        {
            this.CollapseItem($(item), null, animate, key, fireBefore, fireAfter);    
        }
    },

    _collapse: function(event)
    {
        var item = this.FindItem(event.target);
        if (item != null && item.length > 0)
        {
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
    CollapseItem: function(item, event, animate, key, beforeVetoable, fireEvent)
    {
        var ui, cancelled, animationPromise, collapseClass, expandClass, currValue, newValue, self = this;

        // checks if it's already collapsed or not collapsible at all
        if (this.GetState(item) != this.STATE_EXPANDED)
        {
            return;
        }

        // fire beforeCollapse event
        if (key == null)
        {
            key = this.GetKey(item[0]);
        }

        // bail if it is in the middle of expanding/collapsing
        if (animate && this._isDisclosing(key))
        {
            return;
        }

        ui = {"item": item, "key": key};

        cancelled = !this.Trigger("beforeCollapse", event, ui);
        if (cancelled && beforeVetoable) 
        {
            return;
        }

        this.signalTaskStart("Collapse item: "+key); // signal method task start

        if (animate)
        {
            this._setDisclosing(key, true);
        }

        // animate collapse
        animationPromise = this.AnimateCollapse(item, key, animate, event);

        // update aria expanded
        this.SetState(item, this.STATE_COLLAPSED);
        // update icon
        collapseClass = this.getCollapseIconStyleClass();
        expandClass = this.getExpandIconStyleClass();
        item.find("."+expandClass).first().removeClass(expandClass).addClass(collapseClass);

        // clear items cache
        this.m_items = null;

        // prevent item click handler to trigger
        if (event != null)
        {
            event.stopPropagation();
        }

        // fire collapse event after collapse animation completes
        if (fireEvent)
        {
            animationPromise.then(function()
            {
                // update option.  As an optimization do it only when fireEvent is true since this is the
                // only time when it's not triggered by API, in which case the value is already current
                if (self.ojContext._IsCustomElement())
                {
                    currValue = self.GetOption("expanded");
                    if (self._isKeySet(currValue))
                    {
                        newValue = currValue.delete([key]);
                        self.SetOption("expanded", newValue, {'_context': {originalEvent: event, internalSet: true}, 'changed': true});
                    }
                }

                self.Trigger("collapse", event, ui);
            })
        }

        // _collapsedKeys should only be used in the legacy syntax case
        if (!this.ojContext._IsCustomElement())
        {
            // keep track of collapsed item
            if (this._collapsedKeys == undefined)
            {
                this._collapsedKeys = [];
            }
            
            if (this._collapsedKeys.indexOf(key) == -1)
            {
                this._collapsedKeys.push(key);
            }
        }

        animationPromise.then(function()
        {
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
    AnimateCollapse: function(item, key, animate, event)
    {
        var totalHeight = 0, groupItem, animationPromise, animationResolve, self = this, effect, elem, action = "collapse", promise;
        
        animationPromise = new Promise(function(resolve, reject) 
        {
            animationResolve = resolve;
        });

        groupItem = item.children("ul").first();
        // save the key for collapse animation complete
        groupItem[0].key = key;

        if (animate)
        {
            this.signalTaskStart("Animate collapse"); // signal task start

            groupItem.children().each(function()
            {
                totalHeight = totalHeight + $(this).outerHeight();
            });

            groupItem.css("maxHeight", totalHeight+"px");

            effect = this.getAnimationEffect(action);
            // max-height = 0 needs to stick around, especially needed for static content
            effect['persist'] = 'all';

            this.signalTaskStart("Kick off collapse animation"); // signal collapse animation started. Ends in _handleCollapseTransitionEnd()

            // now hide it
            elem = /** @type {Element} */ (groupItem.get(0));
            promise = this.StartAnimation(elem, action, effect);
            promise.then(function(val)
            {
                self._handleCollapseTransitionEnd(groupItem, animationResolve);
            });

            this.signalTaskEnd(); // signal task end
        }
        else
        {
            groupItem.css("maxHeight", "0px");

            this.AnimateCollapseComplete(groupItem);
            animationResolve(null); // resolve animationPromise
        }
        return animationPromise
    },

    _handleCollapseTransitionEnd: function(groupItem, animationResolve)
    {
        var item;

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
    AnimateCollapseComplete: function(groupItem)
    {
        groupItem.removeClass(this.getGroupExpandStyleClass()).addClass(this.getGroupCollapseStyleClass());

        // ask the content handler to do the collapse operation
        // content handler might have been destroyed if animation ended after destroy is called
        if (this.m_contentHandler != null)
        {
            this.m_contentHandler.Collapse(groupItem);
        }

        this._setDisclosing(groupItem[0].key, false);
    },

    /**
     * Collapse all currently expanded items
     * @private
     */
    _collapseAll: function()
    {
        var self, items;

        this.signalTaskStart("Collapse all"); // signal method task start

        self = this;
        items = this._getItemsCache();
        items.each(function() 
        {
            // collapseItem checks whether item is expanded
            self.CollapseItem($(this), null, false, null, false, false);                
        });

        this.signalTaskEnd(); // signal method task end
    },

    /**
     * Gets the keys of currently expanded items.
     * Invoke by widget
     * @return {Array} array of keys of currently expanded items.
     */
    getExpanded: function()
    {
        var expanded, self, items, item;

        expanded = [];

        self = this;
        items = this._getItemsCache();
        items.each(function() 
        {
            item = $(this);
            if (self.GetState(item) == self.STATE_EXPANDED)
            {
                expanded.push(self.GetKey(item[0]));
            }
        });

        return expanded;
    },
    /********************************* End Disclosure *******************************************/
    
    /**
     * Returns widget constructor.  Used by ContentHandler
     */
    getWidgetConstructor: function () 
    {
        return oj.Components.__GetWidgetConstructor(this.element);
    },
    
    /*********************************** Style Classes *********************************************/
    /**
     * To be change by NavList
     * @return {string} the container style class
     * @protected
     */
    GetContainerStyleClass: function()
    {
        // do not set overflow to scroll for windows touch enabled devices 
        if (this._isNonWindowTouch())
        {
            return "oj-listview oj-listview-container-touch";
        }
        else
        {
            return "oj-listview oj-listview-container";
        }
    },

    /**
     * To be change by NavList
     * @return {string} the main element style class
     * @protected
     */
    GetStyleClass: function()
    {
        return "oj-listview-element";
    },

    /**
     * To be change by NavList.  Access by ContentHandler.
     * @return {string} the list item style class
     */
    getItemStyleClass: function()
    {
        return "oj-listview-item";
    },

    /**
     * To be change by NavList.  Access by ContentHandler.
     * @return {string} the focused element style class
     */
    getFocusedElementStyleClass: function()
    {
        return "oj-listview-focused-element";
    },

    /**
     * To be change by NavList.  Access by ContentHandler.
     * @return {string} the list item element style class
     */
    getItemElementStyleClass: function()
    {
        return "oj-listview-item-element";
    },

    /**
     * To be change by NavList.  Access by ContentHandler.
     * @param {boolean=} includeSupplement optional flag to indicate whether to include any supplement classes
     * @return {string} the group item element style class
     */
    getGroupItemStyleClass: function(includeSupplement)
    {
        if (includeSupplement && this._isPinGroupHeader() && this._isPositionStickySupported())
        {
            return "oj-listview-group-item oj-sticky";
        }
        else
        {
            return "oj-listview-group-item";
        }
    },

    /**
     * To be change by NavList.  Access by ContentHandler.
     * @return {string} the group element style class
     */
    getGroupStyleClass: function()
    {
        return "oj-listview-group";
    },

    /**
     * To be change by NavList.  Access by ContentHandler.
     * @return {string} the group expand style class
     */
    getGroupExpandStyleClass: function()
    {
        return "oj-listview-collapsible-transition";
    },

    /**
     * To be change by NavList.  Access by ContentHandler.
     * @return {string} the group collapse style class
     */
    getGroupCollapseStyleClass: function()
    {
        return this.getGroupExpandStyleClass();
    },

    /**
     * To be change by NavList
     * @return {string} the collapse icon style class
     */
    getCollapseIconStyleClass: function()
    {
        return "oj-listview-collapse-icon";
    },

    /**
     * To be change by NavList
     * @return {string} the expand icon style class
     */
    getExpandIconStyleClass: function()
    {
        return "oj-listview-expand-icon";
    },

    /**
     * To be change by NavList
     * @return {string} the expanding icon style class
     */
    getExpandingIconStyleClass: function()
    {
        return "oj-listview-expanding-icon";
    },
    
    /**
     * To be change by NavList
     * @return {string} the empty text style class
     */
    getEmptyTextStyleClass: function()
    {
       return "oj-listview-no-data-message";    
    },
    
    /**
     * To be change by NavList
     * @return {string} the empty text marker class
     */
    getEmptyTextMarkerClass: function()
    {
        return "oj-listview-empty-text";
    },
    
    /**
     * To be change by NavList
     * @return {string} the depth style class
     */
    getDepthStyleClass: function(depth)
    {
        return "";
    },

    /**
     * To be change by NavList
     * @return {string} the option defaults style class
     */
    getOptionDefaultsStyleClass: function()
    {
        return "oj-listview-option-defaults";
    },

    /********************************* End Style Classes *******************************************/

    /*********************************** Pin Header *********************************************/
    _isPositionStickySupported: function()
    {
        // use native position sticky support for iOS (Safari and Chrome), see 
        return (this._isTouchSupport() && oj.AgentUtils.getAgentInfo()['os'] === oj.AgentUtils.OS.IOS);
    },

    /**
     * Helper method to prevent scroll by mouse wheel causes the page to scroll because it has reached the start/end of the list
     * @param {Element} scroller the scroller
     * @param {Event} event the mouse wheel event
     * @private
     */
    _preventMouseWheelOverscroll: function(scroller, event)
    {
        var delta = event.originalEvent.wheelDelta;
        // should only be applicable to TableDataSourceContentHandler for now
        if (isNaN(delta) || this.m_contentHandler.hasMoreToFetch === undefined)
        {
            return;
        }

        if (delta < 0)
        {
            // scroll down
            if (this.m_contentHandler.hasMoreToFetch() && (scroller.scrollTop + scroller.clientHeight + Math.abs(delta)) >= scroller.scrollHeight)
            { 
                scroller.scrollTop = scroller.scrollHeight;
                event.preventDefault();
            }
        }
        else
        {
            // scroll up
            if (scroller.scrollTop > 0 && (scroller.scrollTop - delta) <= 0)
            {
                scroller.scrollTop = 0;
                event.preventDefault();
            }
        }
    },

   /**
    * Retrieve the element where the scroll listener is registered on.
    * @private
    */
    _getScrollEventElement: function()
    {
        var scroller = this._getScroller();

        // if scroller is the body, listen for window scroll event.  This is the only way that works consistently across all browsers.
        if (scroller == document.body || scroller == document.documentElement)
        {
            return window;
        }
        else
        {
            return scroller;
        }
    },

    /**
     * Sets the current scrollPosition.  Invoked when programmatically sets
     * the scrollPosition.
     * @private
     */
    _setCurrentScrollPosition: function(scrollPosition)
    {
        var found = true, key, dataProvider, set, self = this;

        key = scrollPosition['key'];

        // if y is not specified.  First search local dom
        if (key && this.FindElementByKey(key) == null)
        {
            // need to verify key if we have a DataProvider that supports FetchByKeys
            if (this.m_contentHandler instanceof oj.IteratingDataProviderContentHandler)
            {
                dataProvider = this.m_contentHandler.getDataSource();
                if (dataProvider.containsKeys)
                {
                    // IE 11 does not support specifying value in constructor
                    set = new Set();
                    set.add(key);
                    dataProvider.containsKeys({'keys': set}).then(function(value)
                    {
                        // if not found, try to find by index or y
                        if (value['results'].size == 0)
                        {
                            delete scrollPosition['key'];
                        }
                        self.syncScrollPosition(scrollPosition);
                    })

                    // syncScrollPosition will be done later
                    found = false;
                }
            }
            // else we can't verify, so just let syncScrollPosition tries to fetch
            // and find the item
        }

        if (found)
        {
            this.syncScrollPosition(scrollPosition);
        }
    },

    /**
     * Find the element closest to the top of the viewport
     * @param {Array.<Element>} items an array of item elements to search for
     * @param {number} index the index relative to the parent to start the search
     * @param {number} scrollTop the current scrolltop
     * @private
     */
    _findClosestElementToTop: function(items, index, scrollTop)
    {
        var elem, offsetTop, diff, firstInGroup, forward, found = false;

        if (items.length == 0 || index >= items.length)
        {
            return;
        }

        elem = items[index];
        offsetTop = elem.offsetTop;
        diff = scrollTop - offsetTop;
        firstInGroup = {'index': index, 'elem': elem, 'offsetTop': offsetTop, 'offset': diff};

        // scroll position perfectly line up with the top of item (take sub-pixels into account), we are done
        if (Math.abs(diff) < 1)
        {
            return firstInGroup;
        }

        // go forward or backward to find the item, keep that fix to avoid
        // potentially going back and forth (shouldn't happen)
        forward = diff > 0;

        forward ? index++ : index--;
        while (!found && index >= 0 && index < items.length)
        {
            elem = items[index];
            offsetTop = elem.offsetTop;
            diff = Math.abs(scrollTop - offsetTop);

            found = (diff < 1) || (forward ? scrollTop <= offsetTop : scrollTop >= offsetTop);
            if (found)
            {
                // the one closer to the top wins
                if (diff < 1 || !forward)
                {
                    // the current one is closer
                    firstInGroup = {'index': index, 'elem': elem, 'offsetTop': offsetTop, 'offset': diff};
                }
                break;
            }

            // for card layout, we want to return the first item among items that have the same scrollTop (same row)
            // note when scrolling backward, you'll always want the last one encountered
            if (!forward || firstInGroup['offsetTop'] != offsetTop)
            {
                firstInGroup = {'index': index, 'elem': elem, 'offsetTop': offsetTop, 'offset': diff};
            }

            forward ? index++ : index--;
        }

        if (!found)
        {
            // then it's the first/last item in the group/root
            index = forward ? items.length-1 : 0;
            firstInGroup['index'] = index;
            firstInGroup['elem'] = items[index];
        }

        return firstInGroup;
    },

    /**
     * Returns the element which is the direct parent of all item elements.  Only for non-hier data.
     * @private
     */
    _getRootNodeForItems: function()
    {
        return this.isCardLayout() ? this.element.get(0).firstElementChild.firstElementChild : this.element.get(0);
    },

    /**
     * Returns the scroll position object containing info about current scroll position.
     * @private
     */
    _getCurrentScrollPosition: function(scrollTop)
    {
        var scroller, scrollPosition = {}, isHierData, items, prevScrollPosition, diff, index, result, elem, parent;

        scroller = this._getScroller();
        if (scrollTop === undefined)
        {
            scrollTop = scroller.scrollTop;
        }

        scrollPosition['x'] = this._getScrollX(scroller);  
        scrollPosition['y'] = scrollTop;

        isHierData = this.m_contentHandler.IsHierarchical();

        // we used the item height to approximate where to begin the search
        // for the top most item.  This var should be populated in renderComplete
        // if there's no data then we should skip
        if (!isNaN(this.m_itemHeight) && this.m_itemHeight > 0)
        {
            // getItemsCache returns a flat view of all expanded items
            items = isHierData ? this._getItemsCache() : $(this._getRootNodeForItems()).children("li."+this.getItemElementStyleClass());

            // if the previous scroll position is relatively close to the current one
            // we'll use the previous index as the starting point
            prevScrollPosition = this.GetOption("scrollPosition");
            diff = Math.abs(prevScrollPosition['y'] - scrollTop);
            if (diff < this.MINIMUM_ITEM_HEIGHT && prevScrollPosition['key'] != null && !isNaN(prevScrollPosition['index']))
            {
                if (isHierData)
                {
                    elem = this.FindElementByKey(prevScrollPosition['key']);
                    if (elem != null)
                    {
                        index = items.index(elem);
                    }
                }
                else
                {
                    index = prevScrollPosition['index'];
                }
            }

            // we'll need to approximate the index
            if (isNaN(index))
            {
                index = Math.floor(scrollTop / this.m_itemHeight);
            }

            result = this._findClosestElementToTop(items, index, scrollTop);
            if (result != null)
            {
                elem = result['elem'];
                if (isHierData)
                {
                    parent = elem.parentNode;
                    if (parent != this.element.get(0))
                    {
                        scrollPosition['parent'] = this.GetKey(parent.parentNode);
                    }
                    scrollPosition['key'] = this.GetKey(result['elem']);
                    scrollPosition['index'] = $(parent).children().index(elem);
                }
                else
                {
                    scrollPosition['index'] = result['index'];
                    scrollPosition['key'] = this.GetKey(result['elem']);                    
                }
                scrollPosition['offsetY'] = result['offset'];
                // offsetX is the same as x, even when card layout is used
                // since listview wraps card on space available, there will never be a listview
                // having 2 or more columns with a horizontal scrollbar
                scrollPosition['offsetX'] = scrollPosition['x'];
            }
        }

        return scrollPosition;      
    },

    /**
     * @private
     */
    _getOffsetTop: function(elem)
    {
        var offsetTop = this.element.get(0).offsetTop;
        if (!isNaN(this.m_elementOffset) && this.m_elementOffset != offsetTop)
        {
            return Math.max(0, elem.offsetTop - offsetTop);
        }
        else
        {
            return elem.offsetTop;
        }
    },

    /**
     * Retrieve the scroll top value based on item index (optionally with parent key)
     * @private
     */
    _getScrollTopByIndex: function(index, parent)
    {
        var parentElem, elem;

        if (parent != null)
        {
            parentElem = this.FindElementByKey(parent);
            if (parentElem != null)
            {
                // find the ul element
                parentElem = $(parentElem).children("ul").first();
            }
        }
        else
        {
            parentElem = this.element.get(0);
            if (this.isCardLayout())
            {
                parentElem = parentElem.firstElementChild.firstElementChild;
            }
        }

        if (parentElem != null)
        {
            elem = $(parentElem).children("."+this.getItemElementStyleClass())[index];
            if (elem != null)
            {
                return this._getOffsetTop(elem);
            }
        }

        // we got here because one of the following happened:
        // 1) item has not been fetched yet
        // 2) index is large than the number of items, including reaching maxCount
        // 3) parent key specified does not exists or has not been fetched yet
        if (this.m_contentHandler.hasMoreToFetch && this.m_contentHandler.hasMoreToFetch())
        {
            return this._getScroller().scrollHeight;
        }
        return;
    },

    /**
     * Retrieve the scroll top value based on item key
     * @private
     */
    _getScrollTopByKey: function(key)
    {
        var elem = this.FindElementByKey(key);
        if (elem != null)
        {
            return this._getOffsetTop(elem);
        }

        // we got here because one of the following happened:
        // 1) item has not been fetched yet
        // 2) key does not exists or invalid
        if (this.m_contentHandler.hasMoreToFetch && this.m_contentHandler.hasMoreToFetch())
        {
            return this._getScroller().scrollHeight;
        }
        return;
    },

    /**
     * Gets the scroll coordinate based on value of scrollPosition.
     * @return {Object} the coordinate to scroll to, see syncScrollPosition
     * @private
     */
    _getScrollCoordinates: function(scrollPosition)
    {
        var scroller, x, y, parent, index, key, offsetX, offsetY;

        scroller = this._getScroller();

        x = scrollPosition['x'];
        offsetX = scrollPosition['offsetX'];
        if (!isNaN(x) && !isNaN(offsetX))
        {
            x = x + offsetX;
        }

        // key first
        key = scrollPosition['key'];
        if (isNaN(y) && key != null)
        {
            y = this._getScrollTopByKey(key);
        }

        // then index
        parent = scrollPosition['parent'];
        index = scrollPosition['index'];
        if (isNaN(y) && !isNaN(index))
        {
            y = this._getScrollTopByIndex(index, parent);
        }

        offsetY = scrollPosition['offsetY'];
        if (!isNaN(y) && !isNaN(offsetY))
        {
            y = y + offsetY;
        }
        
        // then pixel position last
        if (isNaN(y) && !isNaN(scrollPosition['y']))
        {
            y = scrollPosition['y'];            
        }

        return {x: x, y: y};
    },

    /**
     * Scroll handler
     * @private
     */
    _handleScroll: function(event)
    {
        var scrollTop;

        // since we are calling it from requestAnimationFrame, ListView could have been destroyed already
        if (this.m_contentHandler == null)
        {
            return;
        }

        // update scrollPosition
        scrollTop = this._getScroller().scrollTop;
        if (!this.ojContext._IsCustomElement())
        {
            this.SetOption('scrollTop', scrollTop, {'_context': {originalEvent: event, internalSet: true}});
        }

        if (this.ShouldUpdateScrollPosition())
        {
            this.SetOption('scrollPosition', this._getCurrentScrollPosition(scrollTop), {'_context': {originalEvent: event, internalSet: true}});
        }

        // handle pinning group header, does not need if position sticky is supported 
        this._handlePinGroupHeader();
    },

    /**
     * Register scroll listener
     * @private
     */
    _registerScrollHandler: function()
    {
        var self = this, scrollElem;

        scrollElem = $(this._getScrollEventElement());

        this.ojContext._off(scrollElem, "scroll mousewheel");

        this.ojContext._on(scrollElem, {
            "scroll": function(event)
            {
                // throttle the event using requestAnimationFrame for performance reason
                // don't update if scroll is triggered by listview internally setting scrollLeft/scrollTop
                if (!self._skipScrollUpdate && !self.m_ticking)
                {
                    window.requestAnimationFrame(function()
                    {
                        self._handleScroll(event);
                        self.m_ticking = false;
                    });

                    self.m_ticking = true;
                }

                if (self._skipScrollUpdate)
                {
                    self.signalTaskEnd();
                }

                self._skipScrollUpdate = false;
            }
        });

        // only do this for highwatermark scrolling, other cases we have (and should not care) no knowledge about the scroller
        if (this.options['scrollPolicy'] == "loadMoreOnScroll")
        {
            this.ojContext._on(scrollElem, {
                "mousewheel": function(event)
                {
                    self._preventMouseWheelOverscroll(self._getScroller(), event);
                }
            });
        }
    },

    /**
     * Whether group header should be pin
     * @return {boolean} true if group header should be pin or false otherwise
     * @private
     */
    _isPinGroupHeader: function()
    {
        return (this.GetOption("groupHeaderPosition") != "static" && this.m_contentHandler.IsHierarchical());
    },

    /**
     * Retrieve the visible (flattened) group items cache, create one if it is null.
     * @return {jQuery} a list of group items
     * @private
     */
    _getGroupItemsCache: function()
    {
        var selector;

        if (this.m_groupItems == null)
        {
            selector = "."+this.getGroupItemStyleClass() + ":visible";
            this.m_groupItems = this.element.find(selector).filter(function(index)
            {
                // if it's expanded and it has children
                if (!$(this).parent().hasClass("oj-collapsed"))
                {
                    if ($(this).next().children().length > 0)
                    {
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
    _unpinGroupItem: function(groupItem)
    {
        $(groupItem).removeClass("oj-pinned");
        groupItem.style.top = "auto";
        groupItem.style.width = "auto";
    },

    /**
     * Gets the next group item.  This could be a group item from a different parent.
     * @param {Element} groupItem the reference group item.
     * @return {Element|null} the next group item or null if one cannot be found
     * @private
     */
    _getNextGroupItem: function(groupItem)
    {
        var groupItems, index;

        groupItems = this._getGroupItemsCache();
        index = groupItems.index(groupItem);
        if (index > -1 && index < groupItems.length-1)
        {
            return groupItems[index+1];
        }

        return null;
    },

    /**
     * Pin a group header
     * @param {Element} groupItem the group header element to pin
     * @param {number} scrollTop the scrolltop position of the listview container
     * @private
     */
    _pinGroupItem: function(groupItem, scrollTop)
    {
        var width, height, next;

        width = groupItem.offsetWidth;
        height = groupItem.offsetHeight;

        next = this._getNextGroupItem(groupItem);
        // todo: get rid of 5
        if (next != null && next.offsetTop <= scrollTop + height + 5)
        {
            scrollTop = scrollTop - height;
        }

        $(groupItem).addClass("oj-pinned");
        groupItem.style.top = scrollTop + 'px';
        groupItem.style.width = width + 'px';
    },

    /**
     * Pin the header as neccessary when user scrolls.
     * @private
     */
    _handlePinGroupHeader: function()
    {
        var scroller, scrollTop, groupItemToPin, groupItems, pinHeaderHeight, i, groupItem, top, bottom, next;

        // if groupHeaderPosition is not sticky or if position:sticky is supported natively in the browser
        if (!this._isPinGroupHeader() || this._isPositionStickySupported())
        {
            return;
        }

        scroller = this._getScroller();
        scrollTop = scroller.scrollTop;

        // see if we are at the top
        if (this.m_groupItemToPin != null && scrollTop == 0)
        {
            this._unpinGroupItem(this.m_groupItemToPin);
            this.m_groupItemToPin = null;
            return;
        }

        // find the group item to pin
        groupItems = this._getGroupItemsCache();
        pinHeaderHeight = 0;
        if (this.m_groupItemToPin != null)
        {
            pinHeaderHeight = this.m_groupItemToPin.offsetHeight;
        }

        for (i=0; i<groupItems.length; i++)
        {
            groupItem = groupItems[i];
            if (this.m_groupItemToPin == groupItem)
            {
                continue;
            }

            top = groupItems[i].offsetTop;
            bottom = top + groupItem.parentNode.offsetHeight;

            // if bottom half is in view but not the top half
            if (top < scrollTop && bottom > scrollTop + pinHeaderHeight)
            {
                groupItemToPin = groupItem;
                break;
            }
        }

        // found the group item to pin
        if (groupItemToPin != null && groupItemToPin != this.m_groupItemToPin)
        {
            // unpin the previous item
            if (this.m_groupItemToPin != null)
            {
                this._unpinGroupItem(this.m_groupItemToPin);
            }

            this._pinGroupItem(groupItemToPin, scrollTop);
            this.m_groupItemToPin = groupItemToPin;
        }
        else if (this.m_groupItemToPin != null)
        {
            // is the current pin header touching the next item
            next = this._getNextGroupItem(this.m_groupItemToPin);
            if (next != null && next.offsetTop <= scrollTop + pinHeaderHeight)
            {
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
    _getScroller: function()
    {
        var options, scroller;

        options = this.GetOption("scrollPolicyOptions");
        if (options != null)
        {
            scroller = options['scroller'];
            if (scroller != null)
            {
                return scroller;
            }
        }

        return this._getListContainer().get(0);
    },

    /**
     * Scroll to the specified group header
     * @param {Element} groupHeader the group header div element
     * @private
     */
    _scrollToGroupHeader: function(groupHeader)
    {
        var scroller, currentScrollTop, newScrollTop;

        scroller = this._getScroller();
        currentScrollTop = scroller.scrollTop;

        // unpin any pinned group header first before scroll to header
        if (this.m_groupItemToPin != null)
        {
            this._unpinGroupItem(this.m_groupItemToPin);
            this.m_groupItemToPin = null;
        }

        newScrollTop = groupHeader.offsetTop;
        // when scrolling backwards, the offsetTop is going to take position sticky into account, so it will
        // scroll to the minimum where the header is visible, and as a result all children items would not be visible
        if (this._isPinGroupHeader() && this._isPositionStickySupported() && newScrollTop < currentScrollTop)
        {
            newScrollTop = Math.max(0, newScrollTop - groupHeader.parentNode.offsetHeight + groupHeader.offsetHeight);
        }
        scroller.scrollTop = newScrollTop;

        // if it wasn't scroll (ex: already at the end), we'll have to explicitly try to see if we need to pin again
        if (currentScrollTop == scroller.scrollTop)
        {
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
    _setFirstFocusableItemInGroupCurrent: function(groupHeader)
    {
        var self = this, items, item;

        items = $(groupHeader).next().children();
        items.each(function() 
        {
            item = $(this);

            // make sure item can receive focus
            if (!self.SkipFocus(item))
            {
                self.SetOption('currentItem', this.key);
                return false;
            }
        });
    }
    /********************************* End Pin Header *******************************************/
});

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/**
 * @ojcomponent oj.ojListView
 * @augments oj.baseComponent
 * @ojtsimport ojkeyset
 * @since 1.1.0
 * @ojstatus preview
 * @ojtsimport ojdataprovider
 * @ojtsimport ojkeyset
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojListView<K, D> extends baseComponent<ojListViewSettableProperties<K,D>>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojListViewSettableProperties<K,D> extends baseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojshortdesc Displays data items as a list or a grid with highly interactive features.
 * @ojrole grid
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
 * <p>The second way is from a TreeDataSource.  This is typically used to display data that are logically categorized in groups.  There are several types
 * of TreeDataSource that are available out of the box:</p>
 * <ul>
 * <li>oj.JsonTreeDataSource</li>
 * <li>oj.CollectionTreeDataSource</li>
 * </ul>
 *
 * <p><b>oj.JsonTreeDataSource</b> - Use this when the underlying data is a JSON object.  See the documentation for oj.JsonTreeDataSource for more details on the available options.</p>
 *
 * <p><b>oj.CollectionTreeDataSource</b> - Use this when oj.Collection is the model for each group of data.  See the documentation for oj.CollectionTableDataSource
 * for more details on the available options.</p>
 *
 * <p>Finally, ListView also supports static HTML content as data.  The structure of the content can be either flat or hierarhical.</p>
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
oj.__registerWidget('oj.ojListView', $['oj']['baseComponent'],
{
    widgetEventPrefix: 'oj',
    options:
            {
               /**
                * An alias for the current item when referenced inside the item template. This can be especially useful
                * if oj-bind-for-each element is used inside the item template since it has its own scope of data access.
                *
                * @ojshortdesc Gets and sets the alias for the current item when referenced inside the item template.
                * @ojstatus preview
                * @expose
                * @public
                * @instance
                * @memberof! oj.ojListView
                * @type {string}
                * @default ''
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
                * is set to an item that is not available in the view (either not fetched in highwater mark scrolling case or
                * hidden inside a collapsed parent node), then the value is not applied.
                *
                * @ojshortdesc Gets and sets the key of the item that should have keyboard focus.
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
                 * @ojshortdesc Gets and sets the data provider for this list.
                 * @expose
                 * @memberof! oj.ojListView
                 * @instance
                 * @type {oj.TableDataSource|oj.TreeDataSource|oj.DataProvider}
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
				         * @ojsignature {target: "Type", value: "oj.DataProvider<K, D>"}
                 */
                data: null,
                /**
                 * Enable drag and drop functionality.<br><br>
                 * JET provides support for HTML5 Drag and Drop events.  Please refer to {@link https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop third party documentation} 
                 * on HTML5 Drag and Drop to learn how to use it.
                 *
                 * @ojshortdesc Customize the drag and drop features.
                 * @expose
                 * @memberof! oj.ojListView
                 * @type {Object}
                 * @default {"drag": null, "drop": null, "reorder": {"items": "disabled"}}
                 * @instance
                 */
                dnd: {
                   /**
                    * Enables and customize the drag functionalities.
                    * 
                    * @ojshortdesc Customize the drag functionalities.
                    * @expose
                    * @alias dnd.drag
                    * @memberof! oj.ojListView
                    * @instance
                    * @type {Object}
                    * @ojsignature { target: "Type",
                    *                value: "?"}
                    * @default null
                    */
                   drag: null,
                   /**
                    * @ojshortdesc Customize the drop functionalities.
                    * @expose
                    * @alias dnd.drop
                    * @memberof! oj.ojListView
                    * @instance
                    * @type {Object}
                    * @ojsignature { target: "Type", value: "?"}                   
                    * @default null
                    */
                   drop: null,
                   /**
                    * The reorder option contains a subset of options for reordering items.
                    *
                    * @ojshortdesc Customize the item reordering functionalities.
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
                           * @ojshortdesc Enable or disable the item reordering functionalities.
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
                          items:'disabled'
                   }
                },
                /**
                 * Changes the expand and collapse operations on ListView.  If "none" is specified, then
                 * the current expanded state is fixed and user cannot expand or collapse an item.
                 *
                 * @ojshortdesc Gets and sets whether expand or collapse operations are allowed.
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
                drillMode: "collapsible",
                /**
                 * Specifies the key set containing the keys of the items that should be expanded. 
                 *
                 * Use the <a href="ExpandedKeySet.html">ExpandedKeySet</a> class to specify items to expand.
                 * Use the <a href="ExpandAllKeySet.html">ExpandAllKeySet</a> class to expand all items.                 
                 *
                 * @expose
                 * @memberof! oj.ojListView
                 * @instance
                 * @default new ExpandedKeySet();
                 * @type {KeySet}
                 * @ojsignature {target:"Type", value:"KeySet<K>"}
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
                 * @memberof! oj.ojListView
                 * @instance
                 * @default {'key': null, 'data': null}
                 * @property {any} key The key of the first selected item
                 * @property {any} data The data of the first selected item
                 * @type {Object}
                 * @ojsignature {target:"Type", value:"{key: K, data: D}"}
                 *
                 * @ojwriteback
                 * @readonly
                 *
                 * @example <caption>Get the data of the first selected item:</caption>
                 * // getter
                 * var firstSelectedItemValue = myListView.firstSelectedItem;
                 */
                firstSelectedItem: {'key': null, 'data': null},
                /**
                 * Specifies how the group header should be positioned.  If "sticky" is specified, then the group header 
                 * is fixed at the top of the ListView as the user scrolls.
                 *
                 * @ojshortdesc Gets and sets whether group header should stick to the top as user scrolls.
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
                groupHeaderPosition: "sticky",
                /**
                 * The item option contains a subset of options for items.
                 *
                 * @ojshortdesc Customize the functionalities of each item on the list.  
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
                     * @ojshortdesc Gets and sets whether item can receive keyboard focus.
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
                     * @ojshortdesc Gets and sets the renderer for the item.
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
                     * @ojshortdesc Gets and sets whether the item can be selected.
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
                 * Specifies the mechanism used to scroll the data inside the list view. Possible values are: auto and loadMoreOnScroll.
                 * When loadMoreOnScroll is specified, additional data is fetched when the user scrolls to the bottom of the ListView.
                 * Note that currently this option is only available when TableDataSource is used.
                 *
                 * @ojshortdesc Gets and sets how data are fetch as user scrolls down the list.
                 * @expose
                 * @memberof! oj.ojListView
                 * @instance
                 * @type {string|null}
                 * @default "auto"
                 * @ojvalue {string} "auto" The behavior is determined by the component.
                 * @ojvalue {string} "loadMoreOnScroll" Additional data is fetched when the user scrolls to the bottom of the ListView.
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
                scrollPolicy: "auto",
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
                 * @ojshortdesc Gets and sets the fetch options as user scrolls down the list that triggers fetch of data.
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
                scrollPolicyOptions: {'fetchSize': 25, 'maxCount': 500},
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
                 * The only exception to this is when the key specified does not exists and a DataProvider is specified for <a href="data">data</a>,
                 * then the scroll position will not change (unless other sub-properties like index or x/y are specified as well).
                 * </p>
                 *
                 * @ojshortdesc Gets and sets the scroll position of list view.
                 * @expose
                 * @memberof! oj.ojListView
                 * @instance
                 * @type {Object}
                 * @default {"x": 0, "y": 0}
                 * @property {number=} x the horizontal position in pixel
                 * @property {number=} y the vertical position in pixel
                 * @property {number=} index the zero-based index of the item.  If <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll' 
                 * and the index is greater than maxCount set in <a href="#scrollPolicyOptions">scrollPolicyOptions</a>, then it will scroll and fetch
                 * until the end of the list is reached and there's no more items to fetch.
                 * @property {any=} parent the key of the parent where the index is relative to.  If not specified, then the root is assumed
                 * @property {any=} key the key of the item.  If DataProvider is used for <a href="#data">data</a> and the key does not exists in the 
                 * DataProvider, then the value is ignored.  If DataProvider is not used then ListView will fetch and scroll until the item is found
                 * or the end of the list is reached and there's no more items to fetch.
                 * @property {number=} offsetX the horizontal offset in pixel relative to the item identified by key/index.
                 * @property {number=} offsetY the vertical offset in pixel relative to the item identified by key/index.
                 *
                 * @ojsignature [{target:"Type", value:"K", for:"parent"},
                 *               {target:"type", value:"K", for:"key"}]
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
                scrollPosition: {'x': 0, 'y': 0},
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
                 * The current selections in the ListView. An empty array indicates nothing is selected.
                 *
                 * @ojshortdesc Gets and sets the keys of the selected items.
                 * @expose
                 * @memberof! oj.ojListView
                 * @instance
                 * @type {Array.<any>}
                 * @ojsignature {target:"Type", value:"Array<K>"}
                 * @default []
                 * @ojwriteback
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
                 * Specifies whether selection can be made and the cardinality of selection in the ListView.
                 * Selection is initially disabled, but setting the value to null will disable selection.
                 *
                 * @ojshortdesc Gets and sets whether selection can be made and the cardinality of selection.
                 * @expose
                 * @memberof! oj.ojListView
                 * @instance
                 * @type {string}
                 * @default "none"
                 * @ojvalue {string} "none" Selection is disabled.
                 * @ojvalue {string} "single" Only one item can be selected at a time.
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
                selectionMode: "none",
                /**
                 * Specifies whether ListView should enforce that there will always be an item selected when selection is enabled and there are one or 
                 * more selectable items.  Specifically, when this is enabled, then the first selectable item in ListView will be selected. 
                 * Furthermore, users will not be able to toggle selection such that it will result in no selected items.
                 * See <a href="#selectionMode">selectionMode</a> on how to enable/disable selection.  
                 * See <a href="#item.selectable">item.selectable</a> on how to enable/disable selection for individual item.  
                 * 
                 * @ojshortdesc Gets and sets whether there should be at least one item selected when selection is enabled.
                 * @expose
                 * @ojstatus preview
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
                 * @ojshortdesc Event handler for when the default animation of a particular action is about to start.
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
                 * @ojshortdesc Event handler for when the default animation of a particular action has ended.
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
                 * @ojshortdesc Event handler for when before the current item is changed.
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
                 * @ojshortdesc Event handler for when an item is about to expand.
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
                 * @ojshortdesc Event handler for when an item is about to collapse.
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
                 * Triggered after an item has been collapsed via the <code class="prettyprint">expanded</code> option,
                 * the <code class="prettyprint">collapse</code> method, or via the UI.
                 *
                 * @ojshortdesc Event handler for after an item has collapsed.
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
                 * @ojshortdesc Event handler for after the copy action is performed on an item.
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
                 * @ojshortdesc Event handler for after the cut action is performed on an item.
                 * @expose
                 * @event
                 * @memberof oj.ojListView
                 * @instance
                 * @property {Element[]} items an array of items in which the cut action is performed on
                 */
                cut: null,
                /**
                 * Triggered after an item has been expanded via the <code class="prettyprint">expanded</code> option,
                 * the <code class="prettyprint">expand</code> method, or via the UI.
                 *
                 * @ojshortdesc Event handler for after an item has expanded.
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
                 * @ojshortdesc Event handler for after the paste action is performed on an item.
                 * @expose
                 * @event
                 * @memberof oj.ojListView
                 * @instance
                 * @property {Element} item the element in which the paste action is performed on
                 */
                paste: null,
                /**
                 * Triggered after all items in the ListView has been rendered.  Note that in the highwatermark scrolling case,
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
                 * @ojshortdesc Event handler for after the order of the item has changed through drag and drop or cut and paste action.
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
    _ComponentCreate: function()
    {
        this._super();
        this._setup();
    },

    /**
     * Initialize the listview
     * @private
     */
    _setup: function()
    {
        var opts = {}, expanded;

        opts.element = this.element;
        opts.OuterWrapper = this.OuterWrapper;
        opts.ojContext = this;

        // for backward compatibility, the default for expanded for legacy syntax
        // should be the same as before
        if (!this._IsCustomElement())
        {
            expanded = this.options["expanded"];
            // check if it's been updated by applications
            if (expanded instanceof oj._ojListViewExpandedKeySet)
            {
                this.options["expanded"] = "auto";
            }
        }

        opts = $.extend(this.options, opts);

        this.listview = new oj._ojListView();
        this.listview.init(opts);
    },

    /**
     * Initialize the listview after creation
     * @protected
     * @override
     * @memberof! oj.ojListView
     */
    _AfterCreate: function ()
    {
        this._super();

        // inject helper function for ContentHandler and custom renderer to use
        var self = this;
        this.listview._FixRendererContext = function(context) { return self._FixRendererContext(context) };
        this.listview._WrapCustomElementRenderer = function(renderer) { return self._WrapCustomElementRenderer(renderer) };

        this.listview.afterCreate();
    },

    /**
     * Sets up resources needed by listview
     * @memberof! oj.ojListView
     * @instance
     * @override
     * @protected
     */
    _SetupResources: function()
    {
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
    _ReleaseResources: function()
    {
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
    GetFocusElement: function ()
    {
        return this.listview != null ? this.listview.GetFocusElement() : this._super();
    },

    /**
     * Destroy the list view
     * @memberof! oj.ojListView
     * @private
     */
    _destroy: function()
    {
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
    _NotifyContextMenuGesture: function(menu, event, eventType)
    {
        this.listview.notifyContextMenuGesture(menu, event, eventType);
    },

    /**
     * Sets multiple options
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     * @override
     * @private
     */
    _setOptions: function(options, flags)
    {
        var needRefresh = this.listview.setOptions(options, flags);

        // updates the options last
        this._super(options, flags);

        if (needRefresh)
        {
            this.listview.refresh();
        }
        else if (options['selectionRequired'] || options['selection'] || options['selectionMode'])
        {
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
    _setOption: function(key, value, flags)
    {
        // checks whether value is valid for the key
        var valid = true, extraData;

        if (key == "selectionMode")
        {
            valid = (value == "none" || value == "single" || value == "multiple");
        }
        else if (key == "drillMode")
        {
            valid = (value == "collapsible" || value == "none");
        }
        else if (key == "scrollPolicy")
        {
            valid = (value == "auto" || value == "loadMoreOnScroll");
        }
        else if (key == "groupHeaderPosition")
        {
            valid = (value == "static" || value == "sticky");
        }
        else if (key == "firstSelectedItem")
        {
            // read only
            valid = false;
        }

        // update option if it's valid otherwise throw an error
        if (valid)
        {
            // inject additional metadata for selection
            if (key == "selection")
            {
                extraData = this.listview.getItems(value);
                flags = {'_context': {extraData: {'items': this._IsCustomElement() ? extraData : $(extraData)}}};
            }
            else if (key == "currentItem")
            {
                extraData = this.listview.getItems([value])[0];
                flags = {'_context': {extraData: {'items': this._IsCustomElement() ? extraData : $(extraData)}}};
            }

            this._super(key, value, flags);
        }
        else
        {
            throw "Invalid value: "+value+" for key: "+key;
        }
    },

   /**
    * Invoked when application calls oj.Components.subtreeAttached.
    * @override
    * @private
    */
    _NotifyAttached: function()
    {
        this.listview.notifyAttached();
    },

   /**
    * In browsers [Chrome v35, Firefox v24.5, IE9, Safari v6.1.4], blur and mouseleave events are generated for hidden content but not detached content,
    * so for detached content only, we must use this hook to remove the focus and hover classes.
    * @override
    * @private
    */
    _NotifyDetached: function()
    {
        this.listview.notifyDetached();
    },

   /**
    * Invoked when application calls oj.Components.subtreeShown.
    * @override
    * @private
    */
    _NotifyShown: function()
    {
        this.listview.notifyShown();
    },

    /**
     * Override to do the delay connect/disconnect
     * @memberof oj.ojListView
     * @override
     * @protected
     */
    _VerifyConnectedForSetup: function() 
    {
        return true;
    },

    /********************************* public methods **************************************/
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
    'widget' : function ()
    {
        return this.listview.getRootElement();
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
    refresh: function()
    {
        this._super();
        this.listview.refresh();
    },

    /**
     * Returns a Promise that resolves when the component is ready, i.e. after data fetching, rendering, and animations complete. 
     * Note that in the highwatermark scrolling case, component is ready after data fetching, rendering, and associated animations of items fetched so far are complete.
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
    whenReady: function()
    {
        return this.listview.whenReady();
    },

    // @inheritdoc
    getNodeBySubId: function(locator)
    {
        return this.listview.getNodeBySubId(locator);
    },

    // @inheritdoc
    getSubIdByNode: function(node)
    {
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
     */
    getContextByNode: function(node)
    {
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
    getDataForVisibleItem: function(context)
    {
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
    expand: function (key, vetoable)
    {
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
    collapse: function (key, vetoable)
    {
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
    getExpanded: function ()
    {
        return this.listview.getExpanded();
    },

    /**
     * Gets the IndexerModel which can be used with the ojIndexer.  The IndexerModel provided by ListView
     * by defaults returns a list of locale dependent characters.  See translations for the key used to return
     * all characters.  When a user selects a character in the ojIndexer ListView will scroll to the group 
     * header (or the closest one) with the character as its prefix.
     *
     * @expose
     * @memberof oj.ojListView
     * @ojdeprecated {since:"3.0.0", description:'Implements your own IndexerModel or use the <a href="oj.IndexerModelTreeDataSource.html">IndexerModelTreeDataSource</a> class instead.'} 
     * @instance
     * @return {Object} ListView's IndexerModel to be used with the ojIndexer
     */
    getIndexerModel: function ()
    {
        if (this.indexerModel == null && oj.ListViewIndexerModel)
        {
            this.indexerModel = new oj.ListViewIndexerModel(this.listview);
        }
        return this.indexerModel;
    },

    /**
     * Scrolls the list until the specified item is visible.  If the item is not yet loaded (if scrollPolicy is set to 'loadMoreOnScroll'), then no action is taken.
     *
     * @ojshortdesc Scrolls a loaded item to visible.
     * @param {Object} item An object with a 'key' property that identifies the item to scroll to.
     * @property {K} item.key the key of the item to scroll to.
     * @expose
     * @memberof oj.ojListView
     * @return {void}
     * @instance
     */
    scrollToItem: function (item)
    {
        this.listview.scrollToItem(item);
    },

    //** @inheritdoc */
    _CompareOptionValues: function(option, value1, value2)
    {
        switch(option)
        {
            case 'currentItem':
            case 'selection':
                return oj.Object.compareValues(value1, value2);
            default:
                return this._super(option, value1, value2);
        }
    }

    // Slots

    /**
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the list. The slot must be a &lt;template> element.
     * The content of the template could either include the &lt;li> element, in which case that will be used as
     * the root of the item.  Or it can be just the content which excludes the &lt;li> element.</p>
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See the table below for a list of properties available on $current)</li>
     *  <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul> 
     * @ojstatus preview
     * @ojslot itemTemplate
     * @memberof oj.ojListView
     * @property {Element} componentElement The &lt;oj-list-view> custom element
     * @property {Object} data The data for the current item being rendered
     * @property {number} index The zero-based index of the curent item
     * @property {any} key The key of the current item being rendered     
     * @property {number} depth The depth of the current item (available when hierarchical data is provided) being rendered. The depth of the first level children under the invisible root is 1.
     * @property {boolean} leaf True if the current item is a leaf node (available when hierarchical data is provided).
     * @property {any} parentkey The key of the parent item (available when hierarchical data is provided). The parent key is null for root nodes.
     * 
     * @example <caption>Initialize the ListView with an inline item template specified:</caption>
     * &lt;oj-list-view>
     *   &lt;template slot='itemTemplate'>
     *     &lt;span>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/span>
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
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-focus-highlight</td>
 *       <td>{@ojinclude "name":"ojFocusHighlightDoc"}</td>
 *     </tr>
 *     <tr>
 *       <td>oj-full-width</td>
 *       <td>Use when ListView occupies the entire width of the page.</td>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-listview-card-layout</td>
 *       <td>Shows items as cards and lay them out in a grid.</td>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojListView
 */
});

//////////////////     SUB-IDS     //////////////////

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

//////////////////     SUB-PROPERTIES (dnd, scrollPolicyOptions)     //////////////////

/**
 * If this object is specified, listview will initiate drag operation when the user drags on either a drag handle, which is an element with oj-listview-drag-handle class, or
 * selected items if no drag handle is set on the item.
 * @expose
 * @name dnd.drag.items
 * @memberof! oj.ojListView
 * @instance
 * @type {Object}
 * @default null
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
 * @memberof! oj.ojListView
 * @instance
 * @type {string|Array.<string>}
 * @default null
 * @ojsignature { target: "Type",
 *                value: "?"}
 */
/**
 * A callback function that receives the "dragstart" event and context information as arguments.  The ontext information has the following properties:<br>
 * <ul>
 *   <li><code class="prettyprint">items</code>: An array of items being dragged
 *   </li>
 * </ul><br><br>
 * This function can set its own data and drag image as needed. If dataTypes is specified, event.dataTransfer is already populated with the default data when this function is invoked.
 * If dataTypes is not specified, this function must call event.dataTransfer.setData to set the data or else the drag operation will be cancelled.  In either case, the drag image is 
 * set to an image of the dragged rows on the listview.
 * @expose
 * @name dnd.drag.items.dragStart
 * @memberof! oj.ojListView
 * @instance
 * @type {function(Event, {items: Array.<Element>}):void}
 * @default null
 * @ojsignature { target: "Type",
  *                value: "?"}
 */
/**
 * An optional callback function that receives the "drag" event as argument.
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
 * An optional callback function that receives the "dragend" event as argument.         
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
 * An object that specifies callback functions to handle dropping items.
 * @expose
 * @name dnd.drop.items
 * @memberof! oj.ojListView
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * A data type or an array of data types this component can accept.<br><br>
 * This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
 * @expose
 * @name dnd.drop.items.dataTypes
 * @memberof! oj.ojListView
 * @instance
 * @type {string | Array.<string>}
 * @default null
 * @ojsignature { target: "Type",
 *                value: "?"} 
 */
/**
 * An optional callback function that receives the "dragenter" event and context information as arguments.  The context information has the following properties:<br>
 * <ul>
 *   <li><code class="prettyprint">item</code>: the item being entered
 *   </li>
 * </ul><br><br>
 * This function should call <code class="prettyprint">event.preventDefault</code> to indicate the dragged data can be accepted.<br><br>
 * @expose
 * @name dnd.drop.items.dragEnter
 * @memberof! oj.ojListView
 * @instance
 * @type {function(Event, {item: Element}):void}
 * @default null
 * @ojsignature { target: "Type",
 *                value: "?"}
 */
/**
 * An optional callback function that receives the "dragover" event and context information as arguments.  The context information has the following properties:<br>
 * <ul>
 *   <li><code class="prettyprint">item</code>: the item being dragged over
 *   </li>
 * </ul><br><br>
 * Similar to dragEnter, this function should call <code class="prettyprint">event.preventDefault</code> to indicate the dragged data can be accepted.  
 * @expose
 * @name dnd.drop.items.dragOver
 * @memberof! oj.ojListView
 * @instance
 * @type {function(Event, {item: Element}):void}
 * @default null
 * @ojsignature { target: "Type",
 *                value: "?"}
 */
/**
 * An optional callback function that receives the "dragleave" event and context information as arguments.  The context information has the following properties:<br>
 * <ul>
 *   <li><code class="prettyprint">item</code>: the item that was last entered
 *   </li>
 * </ul><br><br>
 * @expose
 * @name dnd.drop.items.dragLeave
 * @memberof! oj.ojListView
 * @instance
 * @type {function(Event, {item: Element}):void}
 * @default null
 * @ojsignature { target: "Type",
 *                value: "?"}
 */
/**
 * A callback function that receives the "drop" event and context information as arguments.  The context information has the following properties:<br>
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
 * @memberof! oj.ojListView
 * @instance
 * @type {Element}
 * @default null
 * @ojsignature { target: "Type",
 *                value: "?"}
 */

/**
 * Handler for IteratingDataProvider generated content
 * @constructor
 * @extends oj.DataSourceContentHandler
 * @ignore
 */
oj.IteratingDataProviderContentHandler = function(widget, root, data)
{
    oj.IteratingDataProviderContentHandler.superclass.constructor.call(this, widget, root, data);
};

// Subclass from oj.DataSourceContentHandler 
oj.Object.createSubclass(oj.IteratingDataProviderContentHandler, oj.DataSourceContentHandler, "oj.IteratingDataProviderContentHandler");

/**
 * Initializes the instance.
 * @protected
 */
oj.IteratingDataProviderContentHandler.prototype.Init = function()
{
  oj.IteratingDataProviderContentHandler.superclass.Init.call(this);
};

oj.IteratingDataProviderContentHandler.prototype.IsHierarchical = function()
{
    return false;
};

/**
 * Destroy the internal DomScroller if there is one.  Called when this ContentHandler is destroyed or on refresh.
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._destroyDomScroller = function()
{
    if (this.m_domScroller != null)
    {
        this.m_domScroller.destroy();

        this.m_domScroller = null;
        this.m_domScrollerMaxCountFunc = null;
    }    
}

/**
 * Destroy the content handler
 * @protected
 */
oj.IteratingDataProviderContentHandler.prototype.Destroy = function()
{
    oj.IteratingDataProviderContentHandler.superclass.Destroy.call(this);
    this._removeDataSourceEventListeners();
    this._destroyDomScroller();

    this.m_loadingIndicator = null;
};

/**
 * @override
 */
oj.IteratingDataProviderContentHandler.prototype.HandleResize = function(width, height)
{
    // we only care about the highwatermark scrolling case, and if height changes
    if (!this._isLoadMoreOnScroll() || this.m_height == undefined || this.m_height == height)
    {
        return;
    }

    this.m_height = height;

    // check viewport
    this.checkViewport();
};

/**
 * @override
 */
oj.IteratingDataProviderContentHandler.prototype.notifyShown = function()
{
    // we only care about the highwatermark scrolling case
    if (!this._isLoadMoreOnScroll())
    {
        return;
    }

    // for loadMoreOnScroll case, we will have to make sure the viewport is satisfied
    this.checkViewport();
};

/**
 * @override
 */
oj.IteratingDataProviderContentHandler.prototype.notifyAttached = function()
{
    var currentFetchTrigger, scroller, fetchTrigger;

    // this should only be populated in highwatermark scrolling case with scroller specified
    currentFetchTrigger = this._getFetchTrigger();
    if (currentFetchTrigger != undefined && this.m_domScroller != null)
    {
        // this should force the fetch trigger to recalculate
        scroller = this._getScroller();
        fetchTrigger = this._getFetchTrigger();
        if (currentFetchTrigger != fetchTrigger)
        {
            // update fetch trigger
            this.m_domScroller.setFetchTrigger(fetchTrigger);
        }

        // check again whether the viewport is satisfied
        this.checkViewport();
    }

};

/**
 * Is loadMoreOnScroll
 * @return {boolean} true or false
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._isLoadMoreOnScroll = function()
{
    return this.m_widget.options['scrollPolicy'] == "loadMoreOnScroll" ? true: false;
};

/**
 * Gets the number of items to return in each fetch
 * @return {number} the fetch size
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._getFetchSize = function()
{
    return Math.max(0, this.m_widget.options['scrollPolicyOptions']['fetchSize']);
};

/**
 * Gets the total size from the DataProvider, if the funcationality is supported
 * @return {number} the total size from the DataProvider, or -1 if DataProvider does not support total size or if the size is unknown.
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._getTotalSize = function()
{
    return -1;
};

/**
 * Gets the scroller element used in DomScroller
 * @return {Element} the scroller element
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._getScroller = function()
{
    var scroller = this.m_widget.options['scrollPolicyOptions']['scroller'];
    if (scroller != null)
    {
       // make sure it's an ancestor
       if ($.contains(scroller, this.m_root))
       {
           // might as well calculate offset here
           if (this._fetchTrigger === undefined)
           {
               this._fetchTrigger = oj.DomScroller.calculateOffsetTop(scroller, this.m_root) + this._getLoadingIndicatorHeight();
           }
           return scroller;
       }
    }

    // if not specified or not an ancestor, use the listview root element
    return this.m_widget.getRootElement();
};

/**
 * Gets the distance from maximum scroll position that triggers a fetch
 * @return {number|undefined} the distance in pixel or undefined if no scroller is specified
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._getFetchTrigger = function()
{
    if (this._fetchTrigger === undefined)
    {
        this._fetchTrigger = this._getLoadingIndicatorHeight();
    }
    return this._fetchTrigger;
};

/**
 * Calculates the height of the loading indicator
 * @return {number} the height of the loading indicator
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._getLoadingIndicatorHeight = function()
{
    var container, icon, height;

    container = $(document.createElement("div"));
    container.addClass(this.m_widget.getItemStyleClass())
             .css({"visibility":"hidden", "overflow":"hidden", "position":"absolute"});
    icon = $(document.createElement("div"));
    icon.addClass("oj-icon oj-listview-loading-icon")
    container.append(icon); // @HTMLUpdateOK

    $(this.m_widget.getRootElement()).append(container); // @HTMLUpdateOK
    height = container.get(0).offsetHeight;
    container.remove();

    return height;
};

/**
 * Gets the maximum number of items that can be retrieved from data source
 * @return {number} the maximum fetch count
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._getMaxCount = function()
{
    return this.m_widget.options['scrollPolicyOptions']['maxCount'];
};

/**
 * @override
 */
oj.IteratingDataProviderContentHandler.prototype.setDataSource = function(dataProvider)
{
    var self;

    this._removeDataSourceEventListeners();
        
    if (dataProvider != null)
    {
        this.m_handleModelMutateEventListener = this.handleModelMutateEvent.bind(this);
        this.m_handleModelRefreshEventListener = this.handleModelRefreshEvent.bind(this);
        
        dataProvider.addEventListener("mutate", this.m_handleModelMutateEventListener);
        dataProvider.addEventListener("refresh", this.m_handleModelRefreshEventListener);
    }

    oj.IteratingDataProviderContentHandler.superclass.setDataSource.call(this, dataProvider);
};

/**
 * Add a loading indicator to the list for high watermark scrolling scenario
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._appendLoadingIndicator = function()
{
    var item, icon;

    // check if it's already added
    if (this.m_loadingIndicator != null)
    {
        return;
    }

    item = $(document.createElement("li"));
    item.uniqueId()
        .attr("role", "presentation")
        .addClass(this.m_widget.getItemStyleClass())
        .addClass("oj-listview-loading-icon-container");

    icon = $(document.createElement("div"));
    icon.addClass("oj-icon oj-listview-loading-icon");
    item.append(icon); // @HtmlUpdateOK

    $(this.m_root).append(item); // @HtmlUpdateOK

    this.m_loadingIndicator = item;
};

/**
 * Remove the loading indicator 
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._removeLoadingIndicator = function()
{
    if (this.m_loadingIndicator != null)
    {
        this.m_loadingIndicator.remove();
    }
    this.m_loadingIndicator = null;
};

/**
 * Whether there are more items to fetch when scroll policy loadMoreOnScroll is used.
 * @return {boolean} true if there are more items to fetch, false otherwise.
 * @protected
 */
oj.IteratingDataProviderContentHandler.prototype.hasMoreToFetch = function()
{
    return (this.m_loadingIndicator != null);
};

/**
 * Add required attributes to item after it is rendered by the renderer
 * @param {Element} item the item element to modify
 * @param {Object} context the item context 
 * @protected
 */
oj.IteratingDataProviderContentHandler.prototype.afterRenderItem = function(item, context)
{
    var size;

    oj.IteratingDataProviderContentHandler.superclass.afterRenderItem.call(this, item, context);

    $(item).addClass(this.m_widget.getItemStyleClass());

    if (this.m_widget._isSelectionEnabled() && this.isSelectable(context))
    {
        this.m_widget.getFocusItem($(item)).attr("aria-selected", false);
    }

    // for highwatermark scrolling, we'll need to add additional wai-aria attribute since not
    // all items are in the DOM
    if (this._isLoadMoreOnScroll())
    {
        size = Math.min(this._getTotalSize(), this._getMaxCount());
        if (size === -1)
        {
            // if count is unknown, then use max count, and re-adjust later as necessary
            size = this._getMaxCount();
        }

        if (size > 0)
        {
            $(item).attr("aria-setsize", size)
                   .attr("aria-posinset", context['index']+1);
        }
    }

    this.m_widget.itemRenderComplete(item, context);
};

/**
 * Add required attributes to item after it is rendered by the renderer, and perform
 * animation for insert
 * @param {Element} item the item element to modify
 * @param {Object} context the item context 
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.afterRenderItemForInsertEvent = function(item, context)
{
    var elem, itemStyleClass, content, self, busyContext, action = "add", promise;

    this.signalTaskStart("after render item from model insert event"); // signal post rendering processing start. Ends at the end of the method.

    item.setAttribute("data-oj-context", "");

    this.afterRenderItem(item, context);

    // hide it before starting animation to show added item
    elem = $(item);

    itemStyleClass = item.className;
    item.className = "oj-listview-temp-item oj-listview-item-add-remove-transition";
    if (!this.shouldUseGridRole())
    {
        elem.children().wrapAll("<div></div>"); //@HTMLUpdateOK
    }

    content = elem.children().first();
    content[0].className = itemStyleClass; 
    // transfer key and role for FindElementByKey lookup that might happen while animating (navlist)
    content[0].key = item.key;

    // transfer aria-selected for selectable checks that might happen while animating (navlist)
    if (!this.shouldUseGridRole())
    {
        content.attr("role", item.getAttribute("role"));
        if (elem[0].hasAttribute("aria-selected"))
        {
            content.attr("aria-selected", item.getAttribute("aria-selected"));
        }
    }

    self = this;
    busyContext = oj.Context.getContext(item).getBusyContext();    
    busyContext.whenReady().then(function()
    {
        if (self.m_widget == null)
        {
            return;
        }

        self.signalTaskStart("kick off animation for insert item"); // signal add animation start. Ends in _handleAddTransitionEnd().

        promise = self.m_widget.StartAnimation(item, action);

        // now show it
        promise.then(function(val)
        {
            item.removeAttribute("data-oj-context");
            self._handleAddTransitionEnd(context, item);
        });

        self.signalTaskEnd(); // signal post rendering processing end. Started at the beginning of the method.
    });
};

/**
 * Callback handler max fetch count.
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._handleScrollerMaxRowCount = function()
{
    // TODO: use resource bundle
    oj.Logger.error("max count reached");
};

/**
 * Remove data source event listeners
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._removeDataSourceEventListeners = function()
{
    var dataProvider = this.getDataSource();
    if (dataProvider != null)
    {
        dataProvider.removeEventListener("mutate", this.m_handleModelMutateEventListener);
        dataProvider.removeEventListener("refresh", this.m_handleModelRefreshEventListener);
    }
};

/**
 * @param {boolean} forceFetch
 * @override
 */
oj.IteratingDataProviderContentHandler.prototype.fetchRows = function(forceFetch)
{
    var options, self, enginePromise, promise, value, templateEngine, dataSource, offset = 0;

    this.signalTaskStart("fetching rows"); // signal method task start

    // checks if we are already fetching cells
    if (this.IsReady())
    {
        this.m_fetching = true;

        oj.IteratingDataProviderContentHandler.superclass.fetchRows.call(this, forceFetch);

        // initiate loading of template engine, note it will not load it unless a template has been specified
        enginePromise = this.loadTemplateEngine();

        // signal fetch started. Ends in fetchEnd() if successful. Otherwise, ends in the reject block of promise below right after _handleFetchError().
        // Cannot end in _handleFetchError() to be consistent with pagingTableDataSource behavior (see comment above)
        this.signalTaskStart("first fetch"); 

        options = {};
        // use fetch size if loadMoreOnScroll, otherwise specify -1 to fetch all rows
        options['size'] = this._isLoadMoreOnScroll() ? this._getFetchSize() : -1;

        self = this;
        this.m_dataProviderAsyncIterator = this.getDataSource().fetchFirst(options)[Symbol.asyncIterator]();
        promise = this.m_dataProviderAsyncIterator.next();
        Promise.all([promise, enginePromise]).then(function(values){
                         // check if content handler has been destroyed already
                         if (self.m_widget == null)
                         {
                             return;
                         }

                         value = values[0];
                         templateEngine = values[1];

                         dataSource = self.getDataSource();
                         if (dataSource instanceof oj.TableDataSourceAdapter)
                         {
                             // paging control loadMore mode, offset will not be 0 after first fetch
                             offset = dataSource['offset'];
                         } 

                         if (offset == 0)
                         {
                            if (templateEngine)
                            {
                                // clean nodes generated by templateengine before
                                self.cleanItems(templateEngine);
                            }

                             // empty content now that we have data
                             $(self.m_root).empty();
                         }

                         // append loading indicator at the end as needed
                         self._handleFetchedData(value, templateEngine);
                     }, 
                     function(reason){ 
                        self._handleFetchError(reason); 
                        self.signalTaskEnd(); // signal fetch stopped. Started above.
                    });
        this.signalTaskEnd(); // signal method task end
        return;
    }
    this.signalTaskEnd(); // signal method task end
};

oj.IteratingDataProviderContentHandler.prototype._handleFetchError = function(msg)
{
    // TableDataSource aren't giving me any error message
    oj.Logger.error(msg);

    // listview might have been destroyed before fetch error is handled
    if (this.m_widget == null)
    {
        oj.Logger.info("handleFetchError: widget has already been destroyed");
        return;
    }

    if (this._isLoadMoreOnScroll())
    {
        this._removeLoadingIndicator();
    }

    this.m_widget.renderComplete();
};

/**
 * Callback for handling fetch success
 * @param {Array} data the array of data
 * @param {Array} keys the array of keys
 * @param {Object} templateEngine the template engine to process inline template
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._handleFetchSuccess = function(data, keys, templateEngine)
{
    var index, parent, i, row;

    // listview might have been destroyed before fetch success is handled
    if (this.m_widget == null)
    {
        return;
    }

    index = this.m_root.childElementCount;

    parent = document.createDocumentFragment();
    for (i=0; i<data.length; i++)
    {
        row = data[i];
        // passing -1 for opt since we know it will be inserted at the end of the parent
        this.addItem(parent, -1, row, this.getMetadata(index, keys[i], row), templateEngine);

        index = index + 1;
    }    
    this.m_root.appendChild(parent);
};

/**
 * Register the DomScroller
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._registerDomScroller = function()
{
  var self = this, options;
  this.m_domScrollerMaxCountFunc = function (result) 
  {
    if (result != null) 
    {
      self.signalTaskStart("handle results when maxCountLimit reached"); // signal task start

      // remove any loading indicator, which is always added to the end after fetch
      self._removeLoadingIndicator();

      if (self.IsReady()) {
        self.signalTaskStart("dummy task"); // start a dummy task to be paired with the fetchEnd() call below if no new data were fetched.
      }
      self._handleFetchedData(result, self.getTemplateEngine()); // will call fetchEnd(), which signals a task end. Started either in fetchRows() or in a dummy task not involving data fetch.

      self.signalTaskEnd(); // signal domscroller fetch end. Started in this.m_domScroller._handleScrollerScrollTop monkey patched below
      self.signalTaskEnd(); // signal task end
    } else 
    {
      // when there's no more data or any other unexpected cases
      self._removeLoadingIndicator();
      self.signalTaskEnd(); // signal domscroller fetch end. Started in this.m_domScroller._handleScrollerScrollTop monkey patched below
    }
  };

  options = {'fetchSize': this._getFetchSize(), 
             'fetchTrigger': this._getFetchTrigger(), 
             'maxCount': this._getMaxCount(), 
             'asyncIterator': this.m_dataProviderAsyncIterator,
             'initialRowCount': this.m_root.childElementCount, 
             'success': this.m_domScrollerMaxCountFunc, 
             'error': this.signalTaskEnd.bind(this)};
  this.m_domScroller = new oj.DomScroller(this._getScroller(), this.getDataSource(), options);

  // Monkey patch this.m_domScroller's _handleScrollerScrollTop() to signal a task start before starting data fetch
  this.m_domScroller._handleScrollerScrollTop = function (scrollTop, maxScrollTop) 
  {
    if (maxScrollTop - scrollTop <= 1 && self.hasMoreToFetch())
      self.signalTaskStart("starts highwatermark scrolling"); // signal domscroller data fetching. Ends either in success call (m_domScrollerMaxCountFunc) or in error call (self.signalTaskEnd)
    oj.DomScroller.prototype._handleScrollerScrollTop.call(this, scrollTop, maxScrollTop);
  }
}

oj.IteratingDataProviderContentHandler.prototype._pushToEventQueue = function(event)
{
    if (this.m_eventQueue == undefined)
    {
        this.m_eventQueue = [];
    };

    this.m_eventQueue.push(event);
};

oj.IteratingDataProviderContentHandler.prototype._clearEventQueue = function()
{
    if (this.m_eventQueue != null)
    {
        this.m_eventQueue.length = 0;
    }
};

oj.IteratingDataProviderContentHandler.prototype._processEventQueue = function()
{
    var i, event;

    if (this.m_eventQueue != null && this.m_eventQueue.length > 0)
    {
        // see if we can find a refresh event
        for (i=0; i<this.m_eventQueue.length; i++)
        {
            event = this.m_eventQueue[i];
            if (event.type == 'refresh')
            {
                this.handleModelRefreshEvent(event.event);
                // we are done
                return;
            }
        }

        // we'll just need to handle one event at a time since processEventQueue will be triggered whenever an event is done processing
        event = this.m_eventQueue.shift();
        if (event.type == 'mutate')
        {
            this.handleModelMutateEvent(event.event);
        }
    }
};

/**
 * Model mutate event handler.  Called on rows mutation.
 * @param {Object} event the mutate model event
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.handleModelMutateEvent = function(event)
{
    if ( event['detail']['remove'] != null)
    {
        this.handleModelRemoveEvent(event);
    }
    if ( event['detail']['add'] != null)
    {
        this.handleModelAddEvent(event);
    }
    if ( event['detail']['update'] != null)
    {
        this.handleModelChangeEvent(event);
    }
};

/**
 * Retrieve the index of the item with the specified key
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._getIndex = function(keys, index)
{
    var key, elem;

    if (keys == null || keys.length == 0 || index >= keys.length)
    {
        return -1;
    }

    key = keys[index];
    elem = this.FindElementByKey(key);
    return (elem != null) ? $(this.m_root).children().index(elem) : -1;
};

/**
 * Model add event handler.  Called when either a new row of data is added to the data source, or a set of rows are added as a result of
 * highwater mark scrolling.
 * @param {Object} event the add model event
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.handleModelAddEvent = function(event)
{
    var addEvent, data, keys, afterKeys, templateEngine, indexes, i, index;

    if (this.m_root == null)
    {
        return;
    }

    // if listview is busy, queue it for processing later
    if (!this.IsReady())
    {
        this._pushToEventQueue({type: event.type, event: event});
        return;
    }

    this.signalTaskStart("handling model add event"); // signal method task start

    addEvent = event['detail']['add'];
    data = addEvent['data'];
    keys = [];
    addEvent['keys'].forEach(function(key) {
        keys.push(key);
    });
    if (addEvent['afterKeys'])
    {
        afterKeys = [];
        addEvent['afterKeys'].forEach(function(key) {
            afterKeys.push(key);
        });
    }

    // template engine should have already been loaded
    templateEngine = this.getTemplateEngine();

    // indexes could be undefined if not supported by DataProvider
    indexes = addEvent['indexes'];

    if (data != null && keys != null && keys.length > 0 && data.length > 0 && keys.length == data.length && (indexes == null || indexes.length == data.length))
    {
        for (i=0; i<data.length; i++)
        {
            this.signalTaskStart("handling model add event for item: "+keys[i]); // signal add item start
            // indexes takes precedence
            index = (indexes == null) ? this._getIndex(afterKeys, i) + 1 : indexes[i];
            this.addItem(this.m_root, index, data[i], this.getMetadata(index, keys[i], data[i]), templateEngine, this.afterRenderItemForInsertEvent.bind(this));
            this.signalTaskEnd(); // signal add item end
        }

        if (this.IsReady())
        {
            this.signalTaskStart("dummy task"); // start a dummy task to be paired with the fetchEnd() call below if no new data were fetched.
        }
        // do whatever post fetch processing
        this.fetchEnd(); // signals a task end. Started either in fetchRows() or in a dummy task not involving data fetch.
    }
    this.signalTaskEnd(); // signal method task end
};

/**
 * Handles when add item animation transition ends
 * @param {Object} context
 * @param {Element} elem
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._handleAddTransitionEnd = function(context, elem)
{
    var itemStyleClass;

    // this could have been called after listview is destroyed
    if (this.m_widget == null)
    {
        this.signalTaskEnd(); 
        return;
    }

    // cleanup
    itemStyleClass = $(elem).children().first().attr("class");
    elem.className = itemStyleClass;

    if (this.shouldUseGridRole())
    {
        $(elem).children().first()[0].className = "oj-listview-cell-element";
    }
    else
    {
        $(elem).children().children().unwrap(); //@HTMLUpdateOK
    }

    this.m_widget.itemInsertComplete(elem, context);

    this.signalTaskEnd(); // signal add animation end. Started in afterRenderItemForInsertEvent();
};

/**
 * Model remove event handler.  Called when a row has been removed from the underlying data.
 * @param {Object} event the model remove event
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.handleModelRemoveEvent = function(event)
{
    var keys, elem, itemStyleClass, self = this, selection, newSelection, index, i, selectedItems;

    keys = event['detail']['remove']['keys'];
    if (this.m_root == null || keys == null || keys.size == 0)
    {
        return;
    }

    // if listview is busy, hold that off until later
    if (!this.IsReady())
    {
        this._pushToEventQueue({type: event.type, event: event});
        return;
    }

    this.signalTaskStart("handling model remove event"); // signal method task start 

    selection = this.m_widget.options['selection'];
    newSelection = selection.slice(0);

    keys.forEach(function(key)
    {
        elem = self.FindElementByKey(key);
        if (elem != null)
        {
            self.signalTaskStart("handling model remove event for item: "+key); // signal removeItem start
            self._removeItem(elem);
            self.signalTaskEnd(); // signal removeItem end
        }

        // checks whether the removed item is selected, and adjust the value as needed
        index = self.m_widget.GetIndexOf(selection, key);
        if (index > -1)
        {
            newSelection.splice(index, 1);
        }
    });

    // update selection option if it did changed
    if (selection.length != newSelection.length)
    {
        selectedItems = new Array(newSelection.length);
        for (i = 0; i < newSelection.length; i++)
        {
            selectedItems[i] = this.FindElementByKey(newSelection[i]);
        }
        this.m_widget._setSelectionOption(newSelection, null, selectedItems);        
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
oj.IteratingDataProviderContentHandler.prototype._removeItem = function(elem)
{
    var active, restoreFocus, itemStyleClass, self = this, action = "remove", item, promise;

    this.signalTaskStart("removing an item"); // signal method task start

    // got to do this before wrapAll since that changes activeElement
    active = document.activeElement;
    restoreFocus = elem.contains(active);

    elem = $(elem);
    itemStyleClass = elem.get(0).className;
    elem.children().wrapAll("<div class='"+itemStyleClass+"'></div>"); // @HtmlUpdateOK
    elem.get(0).className = "oj-listview-item-add-remove-transition";

    this.signalTaskStart("kick off animation to remove an item"); // signal remove item animation start. Ends in _handleRemoveTransitionEnd()

    item = /** @type {Element} */ (elem.get(0));
    promise = this.m_widget.StartAnimation(item, action);

    // now hide it
    promise.then(function(val)
    {
        self._handleRemoveTransitionEnd(elem, restoreFocus);
    });

    this.signalTaskEnd(); // signal method task end
};

/**
 * Handles when remove item animation transition ends
 * @param {Element|jQuery} elem
 * @param {boolean} restoreFocus
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._handleRemoveTransitionEnd = function(elem, restoreFocus)
{
    var parent, templateEngine;

    // this could have been called after listview is destroyed
    if (this.m_widget == null)
    {
        this.signalTaskEnd(); 
        return;
    }

    elem = $(elem);
    parent = elem.parent();
    // could happen if there is a reset right after model update, the content has already been cleared out
    if (parent.length == 0)
    {
        this.signalTaskEnd(); 
        return;
    }

    // invoke hook before actually removing the item
    this.m_widget.itemRemoveComplete(elem.get(0));

    // template engine should have already been loaded
    templateEngine = this.getTemplateEngine();
    if (templateEngine)
    {
        templateEngine.clean(elem.get(0));
    }

    elem.remove();

    // if it's the last item, show empty text
    if (parent.get(0).childElementCount == 0)
    {
        this.m_widget.renderComplete();
    }

    // ensure something is selected if the removed item is the last selected item
    // need to complete after the DOM element is removed 
    this.m_widget.enforceSelectionRequired();

    // this should focus on the current item, set by itemRemoveComplete
    if (restoreFocus)
    {
        this.m_root.focus();
    }

    this.signalTaskEnd(); // signal remove item animation end. Started in _removeItem()
};

/**
 * Model change event handler.  Called when a row has been changed from the underlying data.
 * @param {Object} event the model change event
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.handleModelChangeEvent = function(event)
{
    var changeEvent, keys, data, templateEngine, indexes, i, elem, index;

    if (this.m_root == null)
    {
        return;
    }

    this.signalTaskStart("handling model update event"); // signal method task start

    changeEvent = event['detail']['update'];
    data = changeEvent['data'];
    keys = [];
    changeEvent['keys'].forEach(function(key) {
        keys.push(key);
    });

    // template engine should have already been loaded
    templateEngine = this.getTemplateEngine();

    // indexes could be undefined if not supported by DataProvider
    indexes = changeEvent['indexes'];
    for (i=0; i<keys.length; i++)
    {
        elem = this.FindElementByKey(keys[i]);
        if (elem != null)
        {
            this.signalTaskStart("handling model update event for item: "+keys[i]); // signal replace item start
            index = (indexes == null) ? -1 : indexes[i];
            this.replaceItem(elem, index, data[i], this.getMetadata(index, keys[i], data[i]), templateEngine, this.afterRenderItemForChangeEvent.bind(this));
            this.signalTaskEnd(); // signal replace item end
        }
    }

    // since the item element will change, need to clear cache
    this.m_widget.ClearCache();

    this.signalTaskEnd(); // signal method task end
};

/**
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.afterRenderItemForChangeEvent = function(item, context)
{
    var self = this, action = "update", promise;

    this.signalTaskStart("after render item for model change event"); // signal method task start

    // adds all neccessary wai aria role and classes
    this.afterRenderItem(item, context);

    promise = this.m_widget.StartAnimation(item, action);

    // now hide it
    promise.then(function(val)
    {
        self._handleReplaceTransitionEnd(item);
    });

    this.signalTaskEnd(); // signal method task end
};

/**
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype._handleReplaceTransitionEnd = function(item)
{
    // this could have been called after listview is destroyed
    if (this.m_widget == null)
    {
        this.signalTaskEnd(); 
        return;
    }

    $(item).removeClass("oj-listview-item-add-remove-transition");

    this.m_widget.restoreCurrentItem();

    this.signalTaskEnd(); // signal replace item animation end. Started in replaceItem() from handleModelChangeEvent() (see base class DataSourceContentHandler)
};

/**
 * Model refresh event handler.  Called when all rows has been removed from the underlying data.
 * @param {Object} event the model refresh event
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.handleModelRefreshEvent = function(event)
{
    if (this.m_root == null)
    {
        return;
    }

    // if listview is busy, hold that off until later, the refresh must be handled in order    
    // since we don't know when the results are coming back in
    if (!this.IsReady())
    {
        this._pushToEventQueue({type: event.type, event: event});
        return;
    }

    this.signalTaskStart("handling model reset event"); // signal method task start

    // since we are refetching everything, we should just clear out any outstanding model events
    this._clearEventQueue();

    // empty everything (later) and clear cache
    this.m_widget.ClearCache();

    // it will be recreated with a new asyncIterator
    this._destroyDomScroller();

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
oj.IteratingDataProviderContentHandler.prototype._handleFetchedData = function(dataObj, templateEngine)
{
    var result = false, data, keys;

    // this could happen if destroy comes before fetch completes (note a refresh also causes destroy)
    if (this.m_root == null || dataObj.value == null)
    {
        return result;
    }

    data = dataObj.value['data'];
    keys = dataObj.value['metadata'].map(function(value) {
      return value['key'];
    });

    if (data.length == keys.length)
    {
        this._handleFetchSuccess(data, keys, templateEngine);

        if (this._isLoadMoreOnScroll())
        {
            result = !dataObj['done'] && this._isLoadMoreOnScroll();
            if (result)
            {
                // if number of items returned is zero but result indicates it's not done
                // log it
                if (keys != null && keys.length == 0)
                {
                    oj.Logger.info("handleFetchedData: zero data returned while done flag is false");
                }

                if (this.m_domScroller == null)
                {
                    this._registerDomScroller();
                }

                // always append the loading indicator at the end except the case when max limit has been reached
                if (!dataObj['maxCountLimit']) 
                {
                    this._appendLoadingIndicator();
                }
            }

            if (dataObj['maxCountLimit']) 
            {
                this._handleScrollerMaxRowCount();
            } 
        }

        this.fetchEnd();
    }

    return result;
};

/**
 * Do any logic needed after results from fetch are processed
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.fetchEnd = function()
{
    var self = this, postProcessing, scrollAndFetch, busyContext;

    // fetch is done
    this.m_fetching = false;

    postProcessing = function()
    {
    	if (self.m_widget)
    	{
	        self.m_widget.renderComplete();

	        // process any outstanding events
	        self._processEventQueue();

	        // check viewport 
	        self.checkViewport();                    		
    	}
    };

    if (this.isAsyncRendering())
    {
        // release busyContext added by scroll and fetch
        scrollAndFetch = this.m_widget.m_scrollAndFetch;
        if (scrollAndFetch)
        {
            self.signalTaskEnd();
        }

        // busyContext for async rendering
        busyContext = oj.Context.getContext(this.m_root).getBusyContext();    
        busyContext.whenReady().then(function()
        {
            // put it back to busy state, will be free up by syncScrollPosition
            if (scrollAndFetch)
            {
                self.signalTaskStart("scroll and fetch");
            }        

            postProcessing();
        });
    }
    else
    {
        postProcessing();
    }

    self.signalTaskEnd(); // signal fetch end. Started in either fetchRows() or started as a dummy task whenever this method is called without fetching rows first (e.g. see m_domScrollerMaxCountFunc).
};

/**
 * Checks the viewport to see if additional fetch is needed
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.checkViewport = function()
{
    var self = this, fetchPromise;

    this.signalTaskStart("checking viewport"); // signal method task start

    // if loadMoreOnScroll then check if we have underflow and do a fetch if we do
    if (this.m_domScroller != null && this.IsReady())
    {
        fetchPromise = this.m_domScroller.checkViewport();
        if (fetchPromise != null)
        {
            this.signalTaskStart("got promise from checking viewport"); // signal fetchPromise started. Ends in promise resolution below
            fetchPromise.then(function(result)
            {
                if (result != null)
                {
                    self.m_domScrollerMaxCountFunc(result);
                }
                self.signalTaskEnd(); // signal checkViewport task end. Started above before fetchPromise resolves here;
            }, null);
        }
    }

    this.signalTaskEnd(); // signal method task end
};

/**
 * Creates the context object containing metadata
 * @param {number} index the index
 * @param {Object} key the key
 * @param {Object} data the data
 * @return {Object} the context object
 * @private
 */
oj.IteratingDataProviderContentHandler.prototype.getMetadata = function(index, key, data)
{
    var context = data['context'];
    if (context == null)
    {
        context = {};
    }

    if (context['index'] == null)
    {
        context['index'] = index;
    }

    if (context['key'] == null)
    {
        context['key'] = key;
    }

    return context;
};
(function() {
var ojListViewMeta = {
  "properties": {
    "as": {
      "type": "string"
    },
    "currentItem": {
      "type": "any",
      "writeback": true
    },
    "data": {},
    "dnd": {
      "type": "object",
      "properties": {
        "drag": {
          "type": "object",
          "properties":{
            "items":{
              "type":"object",
              "properties": {
                "dataTypes": {
                  "type": "Array<string>"
                },
                "drag": {},
                "dragEnd": {},
                "dragStart": {}
              }
            }
          }
        },
        "drop": {
          "type": "object",
          "properties":{
            "items" :{
              "type":"object",
              "properties": {
                "dataTypes": {
                  "type": "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            }
          }          
        },
        "reorder": {
          "type": "object",
          "properties":{
            "items" :{
              "type":"string",
              "enumValues": ["disabled", "enabled"]
            }
          }
        }
      }
    },
    "drillMode": {
      "type": "string",
      "enumValues": ["collapsible", "none"]
    },
    "expanded": {
      "type": "object",
      "writeback": true
    },
    "firstSelectedItem": {
      "type": "object",
      "writeback": true,
      "readOnly": true
    },
    "groupHeaderPosition": {
      "type": "string",
      "enumValues": ["sticky", "static"]
    },
    "item": {
      "type": "object",
      "properties": {
        "focusable": {},
        "renderer": {},
        "selectable": {}
      }
    },
    "scrollPolicy": {
      "type": "string"
    },
    "scrollPolicyOptions": {
      "type": "object",
      "properties": {
        "fetchSize": {
          "type": "number"
        },
        "maxCount": {
          "type": "number"
        },
        "scroller": {}
      }
    },
    "scrollPosition": {
      "type": "object",
      "writeback": true,
      "properties": {
        "x": {
          "type": "number"
        },
        "y": {
          "type": "number"
        },
        "offsetX": {
          "type": "number"
        },
        "offsetY": {
          "type": "number"
        },
        "key": {
          "type": "any"
        },
        "index": {
          "type": "number"
        },
        "parent": {
          "type": "any"
        }
      }
    },
    "selection": {
      "type": "Array<any>",
      "writeback": true
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["none", "single", "multiple"]
    },
    "selectionRequired": {
      "type": "boolean"
    },
    "translations": {
      "type": "Object",
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
        "msgNoData": {
          "type": "string"
        }
      }
    }
  },
  "events": {
    "animateEnd": {},
    "animateStart": {},
    "beforeCollapse": {},
    "beforeCurrentItem": {},
    "beforeExpand": {},
    "collapse": {},
    "copy": {},
    "cut": {},
    "expand": {},
    "paste": {},
    "reorder": {}
  },
  "methods": {
    "getContextByNode": {},
    "getDataForVisibleItem": {},
    "getIndexerModel": {},
    "scrollToItem": {}
  },
  "extension": {
    _INNER_ELEM: 'ul',
    _GLOBAL_TRANSFER_ATTRS: ["aria-label"],
    _WIDGET_NAME: "ojListView"
  }
};
oj.CustomElementBridge.registerMetadata('oj-list-view', 'baseComponent', ojListViewMeta);
oj.CustomElementBridge.register('oj-list-view', {'metadata': oj.CustomElementBridge.getMetadata('oj-list-view')});
})();
});