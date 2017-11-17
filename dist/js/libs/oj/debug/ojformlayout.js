/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'ojs/ojcomponentcore', 'ojs/ojlabel'], 
       /*
        * @param {Object} oj 
        */
       function(oj)
{

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojFormLayout
 * @since 4.1.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="optionOverview-section">
 *   JET FormLayout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#optionOverview-section"></a>
 * </h3>
 * <p>The oj-form-layout element is used to group custom element children in an organized layout that
 * can be optimized for multiple display sizes.  Legal child components are: oj-checkboxset, oj-color-palette
 * oj-color-spectrum, oj-input-date, oj-input-date-time, oj-input-time, oj-input-number, oj-input-text,
 * oj-text-area, oj-input-password, oj-combobox-one, oj-combobox-many, oj-radioset, oj-select-one, oj-select-many,
 * oj-slider, oj-switch
 * 
 * <p>For example:
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-form-layout max-columns='2' label-edge='start' label-width="50%">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 *   &lt;oj-input-text id="inputcontrol2" value="text" label-hint="input 2">&lt;/oj-input-text>
 *   &lt;oj-input-text id="inputcontrol3" value="text" label-hint="input 3 longer label">&lt;/oj-input-text>
 * &lt;/oj-form-layout> 
 * </code></pre>
 *
 * <p>The oj-form-layout element currently suuports custom element children that support the label-hint 
 * and help-hints attributes (oj-input-text, oj-text-area, etc.).
 * For each custom element child with label-hint, FormLayout will generate an oj-label element and pair
 * them together in the layout.
 * </p>
 */

/**
 * @member
 * @name labelEdge
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @default <code class="prettyprint">"top"</code>
 * @ojvalue {string} "start" Label is inline with the start of its editable value component
 * @ojvalue {string} "top" Label is on top of its editable value component
 * @desc Specifies how the label is aligned with its editable value component.
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">label-edge</code> attribute specified:</caption>
 * &lt;oj-form-layout label-edge="top">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">labelEdge</code> property after initialization:</caption>
 * // getter
 * var edge = myFormLayout.labelEdge;
 *
 * // setter
 * myFormLayout.labelEdge = 'start';
 */

/**
 * @member
 * @name labelWidth
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @default <code class="prettyprint">"33%"</code>
 * @desc Specifies the label width.
 * <p>This specifies the width of the oj-label elements.  This can be any legal <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/width">CSS width</a>.</p>
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">label-width</code> attribute specified:</caption>
 * &lt;oj-form-layout label-width="50%">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">labelWidth</code> property after initialization:</caption>
 * // getter
 * var width = myFormLayout.labelWidth;
 *
 * // setter
 * myFormLayout.labelWidth = '60px';
 */

/**
 * @member
 * @name maxColumns
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {number}
 * @default <code class="prettyprint">1</code>
 * @desc Specifies the maximum number of columns.
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">max-columns</code> attribute specified:</caption>
 * &lt;oj-form-layout max-columns="2">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">maxColumns</code> property after initialization:</caption>
 * // getter
 * var maxCol = myFormLayout.maxColumns;
 *
 * // setter
 * myFormLayout.maxColumns = 2;
 */

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 * 
 * @function setProperty
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {*} value - The new value to set the property to.
 * 
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * 
 * @example <caption>Set a single subproperty of a complex property:</caption>
 * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
 */ 
/**
 * Retrieves a value for a property or a single subproperty for complex properties.
 * @function getProperty
 * @param {string} property - The property name to get. Supports dot notation for subproperty access.
 * @return {*}
 * 
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * 
 * @example <caption>Get a single subproperty of a complex property:</caption>
 * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
 */ 
/**
 * Performs a batch set of properties.
 * @function setProperties
 * @param {Object} properties - An object containing the property and value pairs to set.
 * 
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * 
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */ 
/**
 * Refreshes the visual state of the component.
 * 
 * @function refresh
 * 
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 */ 

function ojFormLayoutRenderer(ele) {
  var ojFormLayout = ele['_ojFormLayout'];
  var isInitialRender = false;
  
  if (!ojFormLayout) {
    isInitialRender = true;
    ojFormLayout = new _ojFormLayout(ele);
    ojFormLayout.init();
    Object.defineProperty(ele, '_ojFormLayout', {'value': ojFormLayout});
    ele.classList.add("oj-form-layout");
  }
  
  ojFormLayout.render(isInitialRender);
};


var ojFormLayoutMeta = {
  "properties": {
    "labelEdge": {
      "type": "string",
      "enumValues": ["start", "top"],
      "value": "top"
    },
    "labelWidth": {
      "type": "string",
      "value": "33%"
    },
    "maxColumns": {
      "type": "number",
      "value": 1
    }
  },
  "extension": {
    _RENDER_FUNC: ojFormLayoutRenderer
  }
};
Object.freeze(ojFormLayoutMeta);

// counter for the generation of unique ids.
var _uidCounter = 0;

/**
 * The _ojFormLayout constructor function.  This function adds a wrapper div with
 * an oj-form class.
 * 
 * @constructor
 * @private
 */
function _ojFormLayout(element) {
  var self = this;
  self._LABEL_ELEMENT_ID = "-labelled-by";
  // We need to mark every element we add so that we can remove it during a refresh/re-render.
  self._BONUS_DOM_ATTR = "data-oj-ofl-bonus-dom";
  self._BONUS_DOM_SELECTOR = "["+self._BONUS_DOM_ATTR+"]";
  
  self.init = function () {
    var ojForm = document.createElement("div");
    ojForm.classList.add("oj-form");
    ojForm.setAttribute("data-oj-context","");
    ojForm.setAttribute("data-oj-internal","");
    
    // wrap the children with the div
    while(element.firstElementChild) {
      ojForm.appendChild(element.firstElementChild); // @HTMLUpdateOK reparenting child nodes
    }
    
    element.appendChild(ojForm); // @HTMLUpdateOK appending internally created DOM element
    self._ojForm = ojForm;
  };
  
  /**
   * The main render function.  This function gets called on initial render,
   * when oj-form-layout attributes are modified, and when mutations occur
   * (child nodes are added or deleted).  If the render is not the initial
   * render, all of the bonus dom elements are removed.  Then the bonus dom
   * elements are added (for both initial and non-initial cases).  The bonus dom
   * are the elements like oj-flex/oj-flex-item DIVs and oj-label elements that
   * get added and these are marked with "data-oj-ofl-bonus-dom".
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self.render = function (isInitialRender)
  {
    self._notReady();

    // Wait until child elements have finished upgrading before performing DOM 
    // manipulations so we can access child properties, like label-hint and help-hints.
    // The new oj-form div element has a data-oj-context attribute so we can get 
    // the correctly scoped busy context  for the oj-form div subtree. When custom 
    // elements are reparented, they reregister their busy state if they haven't 
    // finished upgrading. Also, if the oj-form itself is being rendered, wait for 
    // that as well.
    var busyContext = oj.Context.getContext(self._ojForm).getBusyContext();
    busyContext.whenReady().then(function()
    {
      // add a busy state for the oj-form div so we don't have multiple threads
      // modifying the oj-form div at the same time.
      self._ojFormNotReady();
      // we don't want the observer being called when we are making modifications to dom subtree elements.
      self._rootElementMutationObserver.disconnect();

      self._updateOjFormDiv();

      if (!isInitialRender)
        self._removeAllBonusDomElements();

      self._addLabelsFromHints();
      self._addFlexDivs();

      // We are done making modifications to dom subtree elements so we should start paying attention
      // to mutations of the oj-form DIV subtree.  The mutations we care about are added elements and
      // removed elements. For the added elements, we should only see them added next to an existing
      // original child element, which is always a child of a bonus dom DIV element, so we ignore all
      // other added elements. For removed elements, we only care about removed original children.
      // All other removed elements are ignored by the observer.
      self._rootElementMutationObserver.observe(self._ojForm, 
                                                {"childList": true, "subtree": true});
      self._ojFormMakeReady();
      self._makeReady();
    });
  };

  /**
   * Called to set the component busy during rendering
   */
  self._notReady = function()
  {
    if (!self._readyResolveFunc) {
      var busyContext = oj.Context.getContext(element).getBusyContext();
      var options = {'description' : "The oj-form-layout component with id = '"+element["id"]+"' is being rendered."};
      self._readyResolveFunc = busyContext.addBusyState(options);
    }
  };
  
  /**
   * Called to set the component not busy after rendering is finished
   */
  self._makeReady = function()
  {
    if (self._readyResolveFunc) {
      self._readyResolveFunc();
      self._readyResolveFunc = null;
    }
  };
  
  /**
   * Called to make the oj-form div busy during rendering
   */
  self._ojFormNotReady = function()
  {
    if (!self._ojFormReadyResolveFunc) {
      var busyContext = oj.Context.getContext(self._ojForm).getBusyContext();
      var options = {'description' : "The oj-form div for oj-form-layout component with id = '"+element["id"]+"' is being rendered."};
      self._ojFormReadyResolveFunc = busyContext.addBusyState(options);
    }
  };
  
  /**
   * Called to make the oj-form div not busy after rendering is finished
   */
  self._ojFormMakeReady = function()
  {
    if (self._ojFormReadyResolveFunc) {
      self._ojFormReadyResolveFunc();
      self._ojFormReadyResolveFunc = null;
    }
  };
  
  /**
   * Updates the oj-form div with the appropriate styles and column count.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._updateOjFormDiv = function ()
  {
    var ojForm = self._ojForm;
    var maxCols = element["maxColumns"];
    
    if (element["labelEdge"] === "start")
    {
      // ie11 doesn't support adding multiple classes so we add these one at a time.
      ojForm.classList.add("oj-form-cols-labels-inline");
      ojForm.classList.add("oj-ofl-labels-inline");
      ojForm.classList.remove("oj-form-cols");
    }
    else
    {
      ojForm.classList.add("oj-form-cols");
      ojForm.classList.remove("oj-form-cols-labels-inline");
      ojForm.classList.remove("oj-ofl-labels-inline");
    }


    ojForm["style"]["columnCount"] = maxCols;
    ojForm["style"]["webkitColumnCount"] = maxCols;
    ojForm["style"]["MozColumnCount"] = maxCols;    
  }
  
  /**
   * This method goes through and removes all of the bonus dom elements, those that
   * have been marked with the 'data-oj-ofl-bonus-dom' attribute. For oj-label bonus
   * dom elements, we just remove the element as we don't need to preserve the children.
   * For the oj-flex and oj-flex-item DIVs, we need to preserve the children as they
   * contain the original child elements that we don't want removed. 
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._removeAllBonusDomElements = function ()
  {
    var ojForm = self._ojForm;
    var bonusDomElems = ojForm.querySelectorAll(self._BONUS_DOM_SELECTOR);
    var length = bonusDomElems.length;

    for (var i = 0; i < length; ++i)
    {
      var bonusDomElem = bonusDomElems[i];
      
      if (bonusDomElem.tagName === "OJ-LABEL")
      {
        // For the oj-label elements we create, we can just remove them safely
        // as none of their children are the original child elements we are preserving
        bonusDomElem.parentElement.removeChild(bonusDomElem);
      }
      else
      {
        // for all other elements, remove the element preserving the children
        self._removeElementAndReparentChildren(bonusDomElem);
      }
    }
  };
  
  /**
   * For each editable value child with a label hint, add an oj-label.
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._addLabelsFromHints = function()
  {
    var child = self._ojForm.firstElementChild;
    var ojLabel;

    // for all of the direct children, add a label for any child element supports "labelHint"
    while (child) {
      // We allow child components that have the label hint
      // even if it isn't specified:
      if ("labelHint" in child)
      {
        self._ensureUniqueId(child);
        ojLabel = self._createOjLabelAndInitialize(child);

        // the label should preceed the input element it is associated with
        child.parentElement.insertBefore(ojLabel, child); // @HTMLUpdateOK insert oj-label containing trusted content.

        self._updateLabelHelpAndShowRequired(child, ojLabel);
        self._addChildEventListeners(child);
      }
      else
      {
        // not a valid element with either label-hint or help-hints, so throw an exception
        self._ensureUniqueId(element);
        self._ensureUniqueId(child);
        
        // make the component ready before throwing an error so the page won't hang
        self._ojFormMakeReady();
        self._makeReady();
        
        throw new Error("oj-form-layout component with id='"+element["id"]+"' has a child element "+child.tagName+" with id='"+child["id"]+
                "' that is not a supported child type.  See oj-form-layout tag documentation for more information.");
      }
      
      child = child.nextElementSibling; // move to the next child element
    }   
  };

  /**
   * create the oj-label and initialize it
   * 
   * @param {Element} element the element associated with the oj-label element
   * @returns {Element} the oj-label element
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._createOjLabelAndInitialize = function(element)
  {
    var ojLabel = document.createElement("oj-label");
    ojLabel.setAttribute(self._BONUS_DOM_ATTR,"");
    ojLabel.setAttribute("data-oj-internal","");

    // programmatically created elements not managed by a binding stratagy like knockout
    // needs this attribute to signal the component should be created.
    ojLabel.setAttribute("data-oj-binding-provider", "none");
    ojLabel.setAttribute("data-oj-context","");
        
    // Note: the hint might be null, but that is fine, we still want a label for this case to hang the required and help icons off of
    // and allow for programatic changes to label-hint, help-hints, required.
    var span = document.createElement("span");
    span["id"] = element["id"]+"|hint";
    span["textContent"] = element["labelHint"];
    ojLabel.appendChild(span); // @HTMLUpdateOK append span containing trusted content.
    
    self._linkLabelAndElement(ojLabel, element);
    
    return ojLabel;
  };
  
  /**
   * for editable value components that have a labelled-by attribute, we need to
   * give the oj-label an ID and then set the labelled-by to that ID. Otherwise
   * we set the for attribute of the oj-label to the ID of the editable value component
   * 
   * @param {Element} ojLabel
   * @param {Element} element to link with the oj-label
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._linkLabelAndElement = function(ojLabel, element)
  {
    if ("labelledBy" in element)
    {
      ojLabel["id"] = element.id+self._LABEL_ELEMENT_ID;
      element["labelledBy"] = ojLabel.id;
    }
    else
      ojLabel.setAttribute("for", element.id);
  };
  
  /**
   * listener for labelHintChanged events.
   * 
   * @param {Event} event the change event object
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._childLabelHintChanged = function(event)
  {
    var editable = event.target;
    // Get the hint span and update its innerText
    var span = document.getElementById(editable["id"]+"|hint");

    if (span)
    {
      span["innerText"] = event.detail.value;
    }
  }

  /**
   * listener for helpHintsChanged events.
   * 
   * @param {Event} event the change event object
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._childHelpHintsChanged = function(event)
  {
    var editable = event.target;
    var ojLabel = self._getOjLabelForChildElement(editable);

    if (ojLabel)
    {
      ojLabel["help"] = event.detail.value;
    }
  }

  /**
   * listener for requiredChanged events.
   * 
   * @param {Event} event the change event object
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._childRequiredChanged = function(event) {
    var editable = event.target;
    var ojLabel = self._getOjLabelForChildElement(editable);

    if (ojLabel)
    {
      ojLabel["showRequired"] = event.detail.value;
    }
  }

  /**
   * If the child element doesn't have listeners yet, add them.
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._addChildEventListeners = function(child)
  {
    if (!child.getAttribute("data-oj-has-event-listeners"))
    {
      child.setAttribute("data-oj-has-event-listeners",""); // so we can tell if we already set listeners
      child.addEventListener("labelHintChanged", self._childLabelHintChanged);
      child.addEventListener("helpHintsChanged", self._childHelpHintsChanged);
      child.addEventListener("requiredChanged", self._childRequiredChanged);
    }
  };
  
  /**
   * if the removed child nodes have event listeners we've added, remove them
   * 
   * @param {Array.<MutationRecord>} mutations the array of MutationRecords from the observer
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._removeEventListenersFromRemovedChildren = function(mutations)
  {
    var mutationsLength = mutations.length
    
    for (var i = 0; i < mutationsLength; i++)
    {
      var mutation = mutations[i];
      var removedNodesLength = mutation.removedNodes.length;
      
      for (var j = 0; j < removedNodesLength; j++)
      {
        var child = mutation.removedNodes[j];

        if (child.nodeType === 1 && child.getAttribute("data-oj-has-event-listeners") != null)
        {
          child.removeEventListener("labelHintChanged", self._childLabelHintChanged);
          child.removeEventListener("helpHintsChanged", self._childHelpHintsChanged);
          child.removeEventListener("requiredChanged", self._childRequiredChanged);
          child.removeAttribute("data-oj-has-event-listeners");
        }
      }
    }    
  }
  
  /**
   * Return the oj-label element for a component. This may be the oj-label with a for attribute
   * for the component, or may be the oj-label that this component's labelled-by points to.
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @return {Element} The oj-label element.
   * @private
   */
  self._getOjLabelForChildElement = function(child)
  {
    var ojLabel;
    // for editable value components that have a labelled-by attribute, we need to
    // retrieve the oj-label by the labelledBy ID. Otherwise
    // we query for it by the for attribute.
    if ("labelledBy" in child)
      ojLabel = element.getElementById(child["labelledBy"]);
    else
      ojLabel = element.querySelector('oj-label[for="'+child["id"]+'"]');
    
    return ojLabel;
  };
  
  /**
   * Update the help and showRequired from the form component's helpHints and
   * required attributes.  This needs to be done after the label is no longer
   * busy.
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._updateLabelHelpAndShowRequired = function(comp, ojLabel)
  {
    var busyContext = oj.Context.getContext(ojLabel).getBusyContext();
    busyContext.whenReady().then(function()
    {
      var helpHints = comp["helpHints"];
  
      if (helpHints)
      {
        // if either of these has a value, set the help property of ojLabel.
        // This is a work around for the fact that oj-label doesn't correctly
        // handle the default value for help.definition or help.source (i.e. when
        // the value is "").  If we have the default value, null or undefined
        // for both of them, we don't set the help attribute on the oj-label.
        if (helpHints.definition || helpHints.source)
          ojLabel["help"] = comp["helpHints"];
      }

      ojLabel["showRequired"] = comp["required"];
    });
  };
    
  /**
   * Add an oj-flex div for each label/input pair and add an oj-flex-item div
   * for each label and each input.
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._addFlexDivs = function()
  {
    var childArray = []; // copy array
    var label;
    var elem;
    var ojFlex;
    var labelOjFlexItem;
    var elementOjFlexItem
    var arrayLength = self._ojForm.children.length;
    var labelWidth = element["labelEdge"] === "start" ? element["labelWidth"] : "100%";
    var j = 0;
    self._appendChildrenToArray(self._ojForm.children, childArray)
    
    // each iteration should process a label/input pair
    while(j < arrayLength) {
      label = childArray[j];

      ojFlex = self._createDivElement("oj-flex");
      labelOjFlexItem = self._createDivElement("oj-flex-item");
      ojFlex.appendChild(labelOjFlexItem); // @HTMLUpdateOK append div containing trusted content.

      labelOjFlexItem.appendChild(label); // @HTMLUpdateOK append oj-label containing trusted content.
      j++; // skip to the next element
      elem = childArray[j];

      // set the width of the label flex item
      labelOjFlexItem.style.webkitFlex = "0 1 "+labelWidth;
      labelOjFlexItem.style.flex = "0 1 "+labelWidth;
      labelOjFlexItem.style.maxWidth = labelWidth;
      labelOjFlexItem.style.width = labelWidth;

      // create the component flex-item and append the element as a child
      elementOjFlexItem = self._createDivElement("oj-flex-item");
      ojFlex.appendChild(elementOjFlexItem); // @HTMLUpdateOK append div containing trusted content.
      elem.parentElement.insertBefore(ojFlex, elem); // @HTMLUpdateOK insert div containing trusted content.
      elementOjFlexItem.appendChild(elem); // @HTMLUpdateOK append element containing trusted content.
      j++;
    }   
  };
  
  /**
   * Append a children list to an array.
   * 
   * @param {HTMLCollection} children the child element list to copy
   * @param {Array.<Element>} childArray the array to copy to
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._appendChildrenToArray = function(children, childArray)
  {
    var i = children.length;
    while (i--) childArray[i] = children[i];
  }
  /**
   * Create a div element and initialize it.
   * 
   * @param {string} className the style class name of the div
   * @returns {Element} the created div element
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._createDivElement = function(className)
  {
    var div = document.createElement("div");
    div.setAttribute(self._BONUS_DOM_ATTR,"");
    div.setAttribute("data-oj-internal","");
    div.classList.add(className);
    return div;
  };
  
  /**
   * If the dom is mutated, call refresh to allow for added or deleted editable
   * value components.
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._rootElementMutationObserver = new MutationObserver(function (mutations) {
    // if the oj-form-layout has been removed from the body element's subtree,
    // no need to remove event listeners or refresh.  Just disconnect the observer.
    // This can happen when you press apply in the cookbook demo.
    if (document.body.contains(element))
    {
      // Ignore mutations that aren't direct children of bonus dom div elements as those
      // are not generated by application program logic and the should't require
      // a refresh. Examples of mutations that we care about: an application
      // adding a new editable value element; removing an existing original
      // child element.  Example of mutations that we don't care about: dom 
      // elements added or removed inside of the editable value child elements 
      // or oj-label elements.
      // In theory, we shouldn't get mutaion events if we wait until a component is ready
      // but are are still seeing mutations sometimes even though the we waited on the busyContext
      // for the component. See 
      if (!self._ignoreMutations(mutations))
      {
        self._removeEventListenersFromRemovedChildren(mutations); 
        element.refresh();
      }
    }
    else
    {
      this.disconnect();
    }
  });

  /**
   * The target element of a mutation should be a DIV with the bonus dom attribute
   * set on it.  Otherwise ignore the mutations.  We never have to worry about bonus
   * dom being inserted or removed.  The only time bonus dom elements are added
   * or removed, the mutation observer is disconnected.  The application developer
   * should never manipulate generated dom elements.  What this is checking for
   * is if there are any nodes being added or removed from our bonus dom divs while
   * the observer is active.  Specific examples would be adding a new
   * oj-input-text element, or removing an existing editable value element. These
   * should always be add to, or removed from one of the bonus dom DIV elements. 
   * Any set of mutations that doesn't contain at least one node added or removed 
   * from a bonus dom div will be ignored.
   * 
   * @param {Array.<MutationRecord>} mutations the array of MutationRecords from the observer
   * @returns {boolean} true if we should ignore these mutations
   */
  self._ignoreMutations = function(mutations)
  {
    var ignore = true;
    var mutationsLength = mutations.length

    for (var i = 0; i < mutationsLength; i++)
    {
      var mutation = mutations[i];
      
      if (self._isBonusDomDiv(mutation.target))
      {
        ignore = false;
        break;
      }
    }

    return ignore;
  };
  
  /**
   * Checks to see if the node is a DIV with our bonus dom attribute on it
   * 
   * @param {Node} node Node to check.
   * @returns {boolean|null} true if we have a parent DIV with the bonus dom attribute
   */
  self._isBonusDomDiv = function(node)
  {
    return node &&
           node.tagName === "DIV" &&
           node.hasAttribute(self._BONUS_DOM_ATTR);
  }
  
  /**
   * Remove a dom element preserving all of its children
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._removeElementAndReparentChildren = function(elem)
  {
    while (elem.firstElementChild)
    {
      elem.parentNode.insertBefore(elem.firstElementChild, elem); // @HTMLUpdateOK reparenting existing element.
    }

    elem.parentNode.removeChild(elem);    
  };
  
  /**
   * If an element doesn't have an ID, generate a unique ID for it.
   * 
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._ensureUniqueId = function(element) {
    if (!element["id"]) {
      element["id"] = 'oflId_' + _uidCounter++;
    }
  };
};

oj.CustomElementBridge.registerMetadata('oj-form-layout', null, ojFormLayoutMeta);
oj.CustomElementBridge.register('oj-form-layout', {'metadata': oj.CustomElementBridge.getMetadata('oj-form-layout')});

});
