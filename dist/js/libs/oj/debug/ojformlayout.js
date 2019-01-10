/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'ojs/ojcontext', 'ojs/ojcomponentcore', 'ojs/ojlabel'], 
       /*
        * @param {Object} oj 
        */
       function(oj, Context)
{
var __oj_form_layout_metadata = 
{
  "properties": {
    "direction": {
      "type": "string",
      "enumValues": [
        "column",
        "row"
      ],
      "value": "column"
    },
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "start",
        "top"
      ],
      "value": "top"
    },
    "labelWidth": {
      "type": "string",
      "value": "33%"
    },
    "labelWrapping": {
      "type": "string",
      "enumValues": [
        "truncate",
        "wrap"
      ],
      "value": "wrap"
    },
    "maxColumns": {
      "type": "number",
      "value": 1
    }
  },
  "methods": {
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "refresh": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */
/* global Context:false */
/**
 * @ojcomponent oj.ojFormLayout
 * @since 4.1.0
 * @ojshortdesc Used to group child elements in an organized layout that can be optimized for multiple display sizes.
 * @ojstatus preview
 * @ojsignature {target: "Type", value:"class ojFormLayout extends JetElement<ojFormLayoutSettableProperties>"}
 *
 * @classdesc
 * <h3 id="optionOverview-section">
 *   JET FormLayout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#optionOverview-section"></a>
 * </h3>
 * <p>The oj-form-layout element is used to layout groups of label/value pairs in an organized layout that
 * can be optimized for multiple display sizes via attribute value settings.  The following describes how child
 * elements are handled:<br><br>
 * - The following JET components have a label-hint attribute that allows them to be treated as a
 * label/value pair with an oj-label element dynamically created from the label-hint and help-hints:<br>
 * oj-checkboxset, oj-color-palette, oj-color-spectrum, oj-input-date, oj-input-date-time, oj-input-time,
 * oj-input-number, oj-input-text, oj-text-area, oj-input-password, oj-combobox-one, oj-combobox-many,
 * oj-radioset, oj-select-one, oj-select-many, oj-slider, oj-switch<br>
 * - An oj-label element, followed by any element. The oj-label element will be in the label area
 * and the next element will be in the value area<br>
 * - An oj-label-value child component allows the developer to place elements in the label and/or value area as 'label' and 'value' slot chilren.<br>
 * - All other elements will span the entire width of a single label/value pair.
 *
 * <p>For example:
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-form-layout max-columns='2' label-edge='start' label-width="50%">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 *   &lt;oj-input-text id="inputcontrol2" value="text" label-hint="input 2">&lt;/oj-input-text>
 *   &lt;oj-input-text id="inputcontrol3" value="text" label-hint="input 3 longer label">&lt;/oj-input-text>
 *   &lt;oj-label>oj-label in label area&lt;/oj-label>
 *   &lt;p>Next element in value area&lt;/p>
 *   &lt;oj-label-value id="labelonly">
 *     &lt;p slot="label">Some text in the label area&lt;/p>
 *   &lt;/oj-label-value>
 *   &lt;oj-label-value id="valueonly">
 *     &lt;p slot="value">Some text in the value area&lt;/p>
 *   &lt;/oj-label-value>
 *   &lt;p>Some text that spans the label/value area&lt;/p>
 * &lt;/oj-form-layout>
 * </code></pre>
 *
 * <p>The oj-form-layout element currently supports custom element children that support the label-hint
 * and help-hints attributes (oj-input-text, oj-text-area, etc.).
 * For each custom element child with label-hint, FormLayout will generate an oj-label element and pair
 * them together in the layout.
 * </p>
 */

/**
 * @member
 * @name direction
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @default "column"
 * @ojvalue {string} "column" Components are laid out in columns
 * @ojvalue {string} "row" Components are laid out in rows
 * @desc Specifies the layout direction of the form layout children.
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">direction</code> attribute specified:</caption>
 * &lt;oj-form-layout direction="row">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
 * // getter
 * var dir = myFormLayout.direction;
 *
 * // setter
 * myFormLayout.direction = "column";
 */

/**
 * @member
 * @name labelEdge
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @default "top"
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
 * @default "33%"
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
 * @name labelWrapping
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @default "wrap"
 * @ojvalue {string} "truncate" Label will trunctate if needed
 * @ojvalue {string} "wrap" Label will wrap if needed
 * @desc Specifies if the label text should wrap or truncate.
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">label-wrapping</code> attribute specified:</caption>
 * &lt;oj-form-layout label-wrapping="truncate">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">labelWrapping</code> property after initialization:</caption>
 * // getter
 * var wrap = myFormLayout.labelWrapping;
 *
 * // setter
 * myFormLayout.labelWrapping = 'wrap';
 */

/**
 * @member
 * @name maxColumns
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {number}
 * @default 1
 * @ojmin 1
 * @desc Specifies the maximum number of columns.  The actual number of columns may be less, depending on the
 * [direction]{@link oj.ojFormLayout#direction} attribute.
 * <p>If direction is "column", the layout is responsive and browsers automatically reduce the number of columns to fit the width of the viewport.<p>
 * <p>If direction is "row", the number of columns is fixed to the max-columns value.  Applications can choose to make
 * it responsive by using ResponsiveKnockoutUtils to adjust the value.
 * See the <a href="../jetCookbook.html?component=ojFormLayout&demo=form2colsacrossofl">oj-form-layout - Across</a> demo for an example.
 * </p>
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
 * @param {any} value - The new value to set the property to.
 * @return {void}
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
 * @return {any}
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
 * @return {void}
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
 * @return {void}
 * @instance
 */

/* global __oj_form_layout_metadata */
Object.freeze(__oj_form_layout_metadata);

// counter for the generation of unique ids.
var _uidCounter = 0;

/**
 * The _ojFormLayout constructor function.  This function adds a wrapper div with
 * an oj-form class.
 *
 * @constructor
 * @private
 */
// eslint-disable-next-line no-unused-vars
function ojFormLayout(context) {
  var self = this;
  var element = context.element;
  var LABEL_ELEMENT_ID = '-labelled-by';
  // We need to mark every element we add so that we can remove it during a refresh/re-render.
  var BONUS_DOM_ATTR = 'data-oj-formlayout-bonus-dom';
  var BONUS_DOM_SELECTOR = '[' + BONUS_DOM_ATTR + ']';
  var ojFormReadyResolveFunc;
  var readyResolveFunc;
  var ojForm;
  var isInitialRender = true;
  var unresolvedChildren;
  var labelWidth;
  var labelFlexItemWidth;
  var updatePending = false;

  // Our version of GCC has a bug where the second param of MutationObserver.observe must be of
  // type MutationObserverInit which isn't a real class that we can instantiate. Work around is to
  // create the MutationObserver on an alias of 'this' and call observe in a different function.
  // TODO Cleanup when we replace GCC with uglify in 5.0.0.
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
    if (document.body.contains(element)) {
      // Check attribute mutations to see if any of our unresolved children have finish upgrading.
      // If so, add the associated oj-label and then add the bonus dom around the oj-label/component
      // pair.
      _processUnresolvedChildren(mutations);
      // Move any added direct children to the ojForm div.
      _moveNewDirectChildrenToOjFormDiv(mutations);
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
      if (!_ignoreMutations(mutations)) {
        _removeEventListenersFromRemovedChildren(mutations);
        element.refresh();
      }
    } else {
      this.disconnect();
    }
  });

  this.createDOM = function () {
    element.classList.add('oj-form-layout');

    // Create wrapper div
    ojForm = document.createElement('div');
    ojForm.classList.add('oj-form');
    ojForm.setAttribute('data-oj-context', '');
    ojForm.setAttribute('data-oj-internal', '');
    ojForm.setAttribute(BONUS_DOM_ATTR, '');

    // wrap the children with the div
    // we use .firstChild and not .firstElementChild so that comment
    // nodes will be copied
    while (element.firstChild) {
      ojForm.appendChild(element.firstChild); // @HTMLUpdateOK reparenting child nodes
    }

    element.appendChild(ojForm); // @HTMLUpdateOK appending internally created DOM element
  };

  /**
   * The main render function.  This function gets called on initial render,
   * when oj-form-layout attributes are modified, and when mutations occur
   * (child nodes are added or deleted).  If the render is not the initial
   * render, all of the bonus dom elements are removed.  Then the bonus dom
   * elements are added (for both initial and non-initial cases).  The bonus dom
   * are the elements like oj-flex/oj-flex-item DIVs and oj-label elements that
   * get added and these are marked with "data-oj-formlayout-bonus-dom".
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  this.updateDOM = function () {
    function doUpdate() {
      _notReady();

      unresolvedChildren = []; // start with an empty list

      labelFlexItemWidth = null;
      labelWidth = element.labelEdge === 'start' ? element.labelWidth : '100%';


      // Wait until child elements have finished upgrading before performing DOM
      // manipulations so we can access child properties, like label-hint and help-hints.
      // The new oj-form div element has a data-oj-context attribute so we can get
      // the correctly scoped busy context  for the oj-form div subtree. When custom
      // elements are reparented, they reregister their busy state if they haven't
      // finished upgrading. Also, if the oj-form itself is being rendered, wait for
      // that as well.
      var busyContext = Context.getContext(ojForm).getBusyContext();
      busyContext.whenReady().then(function () {
        // add a busy state for the oj-form div so we don't have multiple threads
        // modifying the oj-form div at the same time.
        _ojFormNotReady();
        // we don't want the observer being called when we are making modifications to dom subtree elements.
        self._rootElementMutationObserver.disconnect();

        _updateOjFormDiv();

        if (!isInitialRender) {
          _removeAllBonusDomElements();
        }

        _addLabelsFromHints();
        _addAllFlexDivs();

        // We are done making modifications to dom subtree elements so we should start paying attention
        // to mutations of the oj-form DIV subtree.  The mutations we care about are added elements and
        // removed elements. For the added elements, we should only see them added next to an existing
        // original child element, which is always a child of a bonus dom DIV element, so we ignore all
        // other added elements. For removed elements, we only care about removed original children.
        // All other removed elements are ignored by the observer.
        //
        // We also need to track custom element upgrade status. We do this by observing attribute
        // mutations and if the 'class' attribute gets "oj-complete" added, we know the custom element
        // is finished upgrading.
        self._rootElementMutationObserver
          .observe(element, { childList: true, subtree: true, attributes: true });
        _ojFormMakeReady();
        _makeReady();

        if (isInitialRender) {
          isInitialRender = false;
        }
      });
    }

    // Dynamic form could set the busy state on the oj-form-layout element
    // when it's inserting children to oj-form-layout.  In this case we want
    // to delay the update until the busy state is clear.
    // The only other time the oj-form-layout can be busy when updateDOM is called is
    // during initial render, when busy state is set by DefinitionalElementBridge.
    // In that case we don't want to delay the update.
    // No need to do anything if an update is already pending.
    if (!updatePending) {
      var delayUpdate;
      var outerBusyContext;
      if (!isInitialRender && element.hasAttribute('data-oj-context')) {
        outerBusyContext = Context.getContext(element).getBusyContext();
        delayUpdate = !outerBusyContext.isReady();
      } else {
        delayUpdate = false;
      }
      if (delayUpdate) {
        updatePending = true;
        outerBusyContext.whenReady().then(function () {
          updatePending = false;
          doUpdate();
        });
      } else {
        doUpdate();
      }
    }
  };

  /*
   * Called to set the component busy during rendering
   */
  function _notReady() {
    if (!readyResolveFunc) {
      var busyContext = Context.getContext(element).getBusyContext();
      var options = {
        description: "The oj-form-layout component with id = '" + element.id +
          "' is being rendered." };
      readyResolveFunc = busyContext.addBusyState(options);
    }
  }

  /*
   * Called to set the component not busy after rendering is finished
   */
  function _makeReady() {
    if (readyResolveFunc) {
      readyResolveFunc();
      readyResolveFunc = null;
    }
  }

  /*
   * Called to make the oj-form div busy during rendering
   */
  function _ojFormNotReady() {
    if (!ojFormReadyResolveFunc) {
      var busyContext = Context.getContext(ojForm).getBusyContext();
      var options = {
        description: "The oj-form div for oj-form-layout component with id = '" + element.id +
          "' is being rendered."
      };
      ojFormReadyResolveFunc = busyContext.addBusyState(options);
    }
  }

  /*
   * Called to make the oj-form div not busy after rendering is finished
   */
  function _ojFormMakeReady() {
    if (ojFormReadyResolveFunc) {
      ojFormReadyResolveFunc();
      ojFormReadyResolveFunc = null;
    }
  }

  /**
   * Updates the oj-form div with the appropriate styles and column count.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _updateOjFormDiv() {
    var maxCols = element.maxColumns;

    if (element.labelEdge === 'start') {
      // If labelWidth is set to 0 (including "0", "0px", "0%", etc.), we don't need the
      // oj-form-cols-labels-inline class because the labels are not visible.
      var width = parseInt(element.labelWidth, 10);
      if (isNaN(width) || width > 0) {
        ojForm.classList.add('oj-form-cols-labels-inline');
      }
      ojForm.classList.add('oj-formlayout-labels-inline');
      ojForm.classList.remove('oj-form-cols');
    } else {
      ojForm.classList.add('oj-form-cols');
      ojForm.classList.remove('oj-form-cols-labels-inline');
      ojForm.classList.remove('oj-formlayout-labels-inline');
    }

    if (element.labelWrapping === 'truncate') {
      ojForm.classList.add('oj-formlayout-labels-nowrap');
    } else {
      ojForm.classList.remove('oj-formlayout-labels-nowrap');
    }

    // When direction === "row", we need to set the columns to 1, as we use the
    // oj-flex and oj-flex-item divs to control the number of columns.
    // Also, we need to add the 'oj-formlayout-form-across' class to get the buffer between the
    // label/value pairs.
    if (element.direction === 'row') {
      maxCols = 1;
      ojForm.classList.add('oj-formlayout-form-across');
    } else {
      maxCols = element.maxColumns;
      ojForm.classList.remove('oj-formlayout-form-across');
    }

    ojForm.style.columnCount = maxCols;
    ojForm.style.webkitColumnCount = maxCols;
    ojForm.style.MozColumnCount = maxCols;
  }

  /**
   * This method goes through and removes all of the bonus dom elements, those that
   * have been marked with the 'data-oj-formlayout-bonus-dom' attribute. For oj-label bonus
   * dom elements, we just remove the element as we don't need to preserve the children.
   * For the oj-flex and oj-flex-item DIVs, we need to preserve the children as they
   * contain the original child elements that we don't want removed.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _removeAllBonusDomElements() {
    var bonusDomElems = ojForm.querySelectorAll(BONUS_DOM_SELECTOR);
    var length = bonusDomElems.length;

    for (var i = 0; i < length; ++i) {
      var bonusDomElem = bonusDomElems[i];

      // don't remove bonus dom elems owned by child oj-form-layouts
      if (_isNodeOfThisFormLayout(bonusDomElem)) {
        if (bonusDomElem.tagName === 'OJ-LABEL') {
          // For the oj-label elements we create, we can just remove them safely
          // as none of their children are the original child elements we are preserving
          bonusDomElem.parentElement.removeChild(bonusDomElem);
        } else {
          // for all other elements, remove the element preserving the children
          _removeElementAndReparentChildren(bonusDomElem);
        }
      }
    }
  }

  /**
   * For each editable value child with a label hint, add an oj-label.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _addLabelsFromHints() {
    var child = ojForm.firstElementChild;
    var childCnt = 0;
    var directionIsColumn = element.direction === 'column';

    // for all of the direct children, add a label for any child element supports "labelHint"
    while (child) {
      var tagName = child.tagName.toLowerCase();
      // check for custom element
      if (tagName.indexOf('-') !== -1) {
        if (tagName === 'oj-label') {
          // if we find an oj-label component, then skip it and the next sibling element.
          // If there is no next sibling element, throw an error.  We don't need to know
          // if they are completely upgraded as we are excepting all element types for the child
          // that follows an oj-label.  The assumption is that the app developer has correctly
          // associated the oj-label with and element of some kind.
          var label = child;
          child = child.nextElementSibling; // move to the next child element

          // an oj-label should always be followed by an element
          if (!child) {
            _ensureUniqueId(element);
            _ensureUniqueId(label);

            // make the component ready before throwing an error so the page won't hang
            _ojFormMakeReady();
            _makeReady();

            throw new Error("oj-form-layout component with id='" + element.id +
                            "' has an oj-label child element with id='" + label.id +
                            "' but has no next sibling element that it is associated with.");
          }
        } else if (tagName === 'oj-label-value') {
          // if were are being re-rendered, then we need to refresh any oj-label-value children.
          if (!isInitialRender) {
            child.refresh();
          }
        } else if (child.classList.contains('oj-complete')) {
          _addLabelFromHint(child);
        } else {
          // we need to tell this child if it needs an oj-flex div created for it.
          if (directionIsColumn || childCnt % element.maxColumns === 0) {
            child.setAttribute('data-oj-needs-oj-flex-div', '');
          }
          // This custom element child hasn't been upgraded so add it to the unresolved children
          unresolvedChildren.push(child);
        }
      }

      childCnt += 1;
      child = child.nextElementSibling; // move to the next child element
    }
  }

  /**
   * For one child, add an oj-label if it supports label-hint.
   *
   * @param {EventTarget} child The element that may need an oj-label created
   * @memberof oj.ojFormLayout
   * @returns {Element|null} the oj-label element or null if no label was created
   * @instance
   * @private
   */
  function _addLabelFromHint(child) {
    var ojLabel = null;

    if (child instanceof Element && 'labelHint' in child) {
      _ensureUniqueId(child);
      ojLabel = _createOjLabelAndInitialize(child);

      // the label should preceed the input element it is associated with
      child.parentElement.insertBefore(ojLabel, child); // @HTMLUpdateOK insert oj-label containing trusted content.

      _updateLabelHelpAndShowRequired(child, ojLabel);
      // JET's custom element's property change events,
      // e.g., labelHintChanged,
      // do not bubble and component events do bubble.
      // Therefore, we can't listen on the
      // oj-form-layout for child property change events.
      // We add them to the component themselves.
      _addChildEventListeners(child);
    }

    return ojLabel;
  }

  /**
   * create the oj-label and initialize it
   *
   * @param {Element} editableElem the element associated with the oj-label element
   * @returns {Element} the oj-label element
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _createOjLabelAndInitialize(editableElem) {
    var tagName = editableElem.tagName.toLowerCase();
    var ojLabel = document.createElement('oj-label');
    ojLabel.setAttribute(BONUS_DOM_ATTR, '');
    ojLabel.setAttribute('data-oj-internal', '');

    // programmatically created elements not managed by a binding stratagy like knockout
    // needs this attribute to signal the component should be created.
    ojLabel.setAttribute('data-oj-binding-provider', 'none');
    ojLabel.setAttribute('data-oj-context', '');

    // for alignment purposes, we need to add label alignment classes for labels of
    // oj-checkboxset and oj-radioset. These are for inline labels only.
    if (element.labelEdge === 'start' && (tagName === 'oj-checkboxset' || tagName === 'oj-radioset')) {
      ojLabel.classList.add(tagName + '-label');
    }

    // Note: the hint might be null, but that is fine, we still want a label for this case to hang the required and help icons off of
    // and allow for programatic changes to label-hint, help-hints, required.
    var span = document.createElement('span');
    span.id = editableElem.id + '|hint';
    span.textContent = editableElem.labelHint;
    ojLabel.appendChild(span); // @HTMLUpdateOK append span containing trusted content.

    _linkLabelAndElement(ojLabel, editableElem);

    return ojLabel;
  }

  /**
   * for editable value components that have a labelled-by attribute, we need to
   * give the oj-label an ID and then set the labelled-by to that ID. Otherwise
   * we set the for attribute of the oj-label to the ID of the editable value component
   *
   * @param {Element} _ojLabel
   * @param {Element} _editableElem element to link with the oj-label
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _linkLabelAndElement(_ojLabel, _editableElem) {
    var ojLabel = _ojLabel;
    var editableElem = _editableElem;
    if ('labelledBy' in editableElem) {
      ojLabel.id = editableElem.id + LABEL_ELEMENT_ID;
      editableElem.labelledBy = ojLabel.id;
    } else {
      ojLabel.setAttribute('for', editableElem.id);
    }
  }

  /**
   * listener for labelHintChanged events.
   *
   * @param {Event} event the change event object
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _childLabelHintChanged(event) {
    var editable = event.target;
    // Get the hint span and update its innerText
    var span = document.getElementById(editable.id + '|hint');

    if (span) {
      span.innerText = event.detail.value;
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
  function _childHelpHintsChanged(event) {
    var editable = event.target;
    var ojLabel = _getOjLabelForChildElement(editable);

    if (ojLabel) {
      ojLabel.help = event.detail.value;
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
  function _childRequiredChanged(event) {
    var editable = event.target;
    var ojLabel = _getOjLabelForChildElement(editable);

    if (ojLabel) {
      ojLabel.showRequired = event.detail.value;
    }
  }

  /**
   * If the child element doesn't have listeners yet, add them.
   * Only the component events bubble and not the property change events,
   * so it doesn't work to listen on the oj-form-layout for
   * these property change events. Instead we
   * put them on the child component themselves, and we share the listener.
   *
   * @param {Element} child
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _addChildEventListeners(child) {
    child.addEventListener('labelHintChanged', _childLabelHintChanged);
    child.addEventListener('helpHintsChanged', _childHelpHintsChanged);
    child.addEventListener('requiredChanged', _childRequiredChanged);
  }

  /**
   * This function moves any new direct children under the ojForm node, which is where the
   * oj-form-layout component expects these children to be.
   * @param {Array.<MutationRecord>} mutations the mustation list passed in to the mutation observer function
   * @returns {undefined}
   */
  function _moveNewDirectChildrenToOjFormDiv(mutations) {
    var mutationsLength = mutations.length;

    for (var i = 0; i < mutationsLength; i++) {
      var mutation = mutations[i];

      if (mutation.type === 'childList') {
        var addedNodesLength = mutation.addedNodes.length;

        for (var j = 0; j < addedNodesLength; j++) {
          var child = mutation.addedNodes[j];

          // check to see if it was added as a direct child
          if (child.parentNode === element) {
            ojForm.appendChild(child);
          }
        }
      }
    }
  }

  /**
   * Process any component that has been upgraded and was placed on the unresolved children list
   * during a previous render adding the label and flex divs.
   * @param {Array.<MutationRecord>} mutations the mustation list passed in to the mutation observer function
   * @returns {undefined}
   */
  function _processUnresolvedChildren(mutations) {
    var mutationsLength = mutations.length;

    for (var i = 0; i < mutationsLength; i++) {
      var mutation = mutations[i];

      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        var index = unresolvedChildren.indexOf(mutation.target);
        if (index !== -1 && mutation.target.classList.contains('oj-complete')) {
          unresolvedChildren.splice(index, 1);
          var ojLabel = _addLabelFromHint(mutation.target);
          // If a label was created, add the flex divs
          if (ojLabel) {
            _addFlexDivs(ojLabel, mutation.target,
                         mutation.target.hasAttribute('data-oj-needs-oj-flex-div'));
          }
        }
      }
    }
  }

  /**
   * if the removed child nodes have event listeners we've added, remove them
   * Only the component events bubble and not the property change events,
   * so it doesn't work to listen on the oj-form-layout
   * for these property change events. We add/remove the listener from the
   * child JET component itself.
   *
   * @param {Array.<MutationRecord>} mutations the array of MutationRecords from the observer
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _removeEventListenersFromRemovedChildren(mutations) {
    var mutationsLength = mutations.length;

    for (var i = 0; i < mutationsLength; i++) {
      var mutation = mutations[i];

      if (mutation.type === 'childList') {
        var removedNodesLength = mutation.removedNodes.length;

        for (var j = 0; j < removedNodesLength; j++) {
          var child = mutation.removedNodes[j];

          if (child.nodeType === 1) {
            child.removeEventListener('labelHintChanged', _childLabelHintChanged);
            child.removeEventListener('helpHintsChanged', _childHelpHintsChanged);
            child.removeEventListener('requiredChanged', _childRequiredChanged);
          }
        }
      }
    }
  }

  /**
   * Return the oj-label element for a component. This may be the oj-label with a for attribute
   * for the component, or may be the oj-label that this component's labelled-by points to.
   *
   * @param {EventTarget} child The child element whose label we want to return
   * @memberof oj.ojFormLayout
   * @instance
   * @return {Element} The oj-label element.
   * @private
   */
  function _getOjLabelForChildElement(child) {
    var ojLabel;
    // for editable value components that have a labelled-by attribute, we need to
    // retrieve the oj-label by the labelledBy ID. Otherwise
    // we query for it by the for attribute.
    if ('labelledBy' in child) {
      // For some reason, element is undefined in this case, so using document
      ojLabel = document.getElementById(child.labelledBy);
    } else {
      ojLabel = element.querySelector('oj-label[for="' + child.id + '"]');
    }

    return ojLabel;
  }

  /**
   * Update the help and showRequired from the form component's helpHints and
   * required attributes.  This needs to be done after the label is no longer
   * busy.
   *
   * @param {Element} comp
   * @param {Element} _ojLabel
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _updateLabelHelpAndShowRequired(comp, _ojLabel) {
    var ojLabel = _ojLabel;
    var busyContext = Context.getContext(ojLabel).getBusyContext();
    busyContext.whenReady().then(function () {
      var helpHints = comp.helpHints;

      if (helpHints) {
        // if either of these has a value, set the help property of ojLabel.
        // This is a work around for the fact that oj-label doesn't correctly
        // handle the default value for help.definition or help.source (i.e. when
        // the value is "").  If we have the default value, null or undefined
        // for both of them, we don't set the help attribute on the oj-label.
        if (helpHints.definition || helpHints.source) {
          ojLabel.help = helpHints;
        }
      }

      ojLabel.showRequired = comp.required;
    });
  }

  /**
   * Add an oj-flex div for each label/input pair and add an oj-flex-item div
   * for each label and each input.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _addAllFlexDivs() {
    var childArray = []; // copy array
    var arrayLength = ojForm.children.length;
    var directionIsColumn = element.direction === 'column';
    var j = 0;
    var pairCnt = 0; // counter of label/element count

    _appendChildrenToArray(ojForm.children, childArray);

    var currentRow;

    // each iteration should process a label/input pair
    while (j < arrayLength) {
      var label = childArray[j];

      // if the current child element is on the unresolvedChildren list, skip it
      if (unresolvedChildren.indexOf(label) === -1) {
        var tagName = label.tagName.toLowerCase();
        if (tagName === 'oj-label') {
          j += 1; // skip to the next element
          var elem = childArray[j];

          // for direction === "row", we only render the oj-flex div once per row.
          currentRow = _addFlexDivs(label, elem,
                                    directionIsColumn || pairCnt % element.maxColumns === 0);
        } else {
          // handle oj-label-value child

          currentRow = _addFlexDivs(label, null,
                                    directionIsColumn || pairCnt % element.maxColumns === 0);
        }
      }
      pairCnt += 1;
      j += 1;
    }
    _addMissingFlexItems(currentRow, pairCnt);
  }

  function _getFullFlexItemWidth() {
    // For direction === 'column', we want the width to be 100%.  For 'row', we want it to be
    // the 100% divided by the number of columns.
    if (element.direction === 'column') { return '100%'; }

    return (Math.floor(100000 / element.maxColumns) / 1000) + '%';
  }

  // for direction=='row' && labelEdge=='start', use labelWidth/max-columns for any relative units,
  // otherwise labelWidth
  function _getLabelFlexItemWidth() {
    // Is value cached?
    if (!labelFlexItemWidth) {
      labelFlexItemWidth = labelWidth;

      // no need to adjust labelEdge == 'top', it will always be '100%'
      // no need to adjust direction == 'column'
      if (element.labelEdge === 'start' && element.direction === 'row') {
        // We need to split apart the number and unit parts of the css unit
        var CssUnitsRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/;
        var parts = element.labelWidth.match(CssUnitsRegex);

        // only adjust for units that are (or can be) relative to horizontal screen size.
        switch (parts[2]) {
          case 'vw':
          case 'vmin':
          case 'vmax':
          case '%':
            labelFlexItemWidth = (parts[1] / element.maxColumns) + parts[2];
            break;
          default:
            break;
        }
      }
    }

    return labelFlexItemWidth;
  }

  function _addEmptyFlexItem(flexContainer, width) {
    var flexItem = _createDivElement('oj-flex-item');

    flexItem.style.webkitFlex = '0 1 ' + width;
    flexItem.style.flex = '0 1 ' + width;
    flexItem.style.maxWidth = width;
    flexItem.style.width = width;

    flexContainer.appendChild(flexItem);
    return flexItem;
  }

  function _addMissingFlexItems(flexContainer, count) {
    var cols = element.maxColumns;
    var last = count % cols;
    var flexItemWidth = _getFullFlexItemWidth();

    if (element.direction !== 'column' && flexContainer && last > 0) {
      for (var i = last; i < cols; i++) {
        _addEmptyFlexItem(flexContainer, flexItemWidth);
      }
    }
  }

  function _addFlexDivs(label, elem, createOjFlex) {
    var ojFlex;
    var emptyLabelFlexItem;

    if (createOjFlex) {
      ojFlex = _createDivElement('oj-flex');
    } else {
      ojFlex = label.previousElementSibling;
    } // This will be the oj-flex div for a row

    var slotWidth = elem ? _getLabelFlexItemWidth() : _getFullFlexItemWidth();

    if (!elem) {
      // We need this zero width flex-item because we need to have pairs of flex-items
      // or the scss selectors for inline labels won't get picked up correctly.
      emptyLabelFlexItem = _addEmptyFlexItem(ojFlex, '0px'); // create a zero width label flex-item div
    }

    var labelOjFlexItem = _createDivElement('oj-flex-item');
    ojFlex.appendChild(labelOjFlexItem); // @HTMLUpdateOK append div containing trusted content.

    label.parentElement.insertBefore(ojFlex, label); // @HTMLUpdateOK insert div containing trusted content.
    labelOjFlexItem.appendChild(label); // @HTMLUpdateOK append oj-label containing trusted content.

    // set the width of the label flex item
    labelOjFlexItem.style.flex = '0 0 ' + slotWidth;
    labelOjFlexItem.style.maxWidth = slotWidth;
    labelOjFlexItem.style.width = slotWidth;

    // create the component flex-item and append the element as a child
    if (elem) {
      var elementOjFlexItem = _createDivElement('oj-flex-item');
      ojFlex.appendChild(elementOjFlexItem); // @HTMLUpdateOK append div containing trusted content.

      if (element.direction === 'row' && element.labelEdge === 'top') {
        // For the direction row case when labels are on top, we move the label into the value part,
        // and make the label flex item 0px width and add the 'oj-formlayout-no-label-flex-item class
        // to get the correct padding
        elementOjFlexItem.appendChild(label);
        labelOjFlexItem.style.webkitFlex = '0 1 0px';
        labelOjFlexItem.style.flex = '0 1 0px';
        labelOjFlexItem.style.maxWidth = '0px';
        labelOjFlexItem.style.width = '0px';
        labelOjFlexItem.classList.add('oj-formlayout-no-label-flex-item');
        elementOjFlexItem.classList.add('oj-formlayout-no-label-flex-item');
      }
      elementOjFlexItem.appendChild(elem); // @HTMLUpdateOK append element containing trusted content.

      // Set the flex style of the value flex item.
      // Set a flex-grow factor of 1 and a flex-basis of 0 so that all "value" flex items share the
      // remaining space left over by "label" flex items equally.
      elementOjFlexItem.style.webkitFlex = '1 1 0';
      elementOjFlexItem.style.flex = '1 1 0';
    } else {
      // for the case where there is an empty label flex item with 0px width, we need to add this class
      // so that we get the correct padding on the flex items
      emptyLabelFlexItem.classList.add('oj-formlayout-no-label-flex-item');
      labelOjFlexItem.classList.add('oj-formlayout-no-label-flex-item'); // This is actually the element
    }

    return ojFlex;
  }

  /**
   * Append a children list to an array.
   *
   * @param {NodeList} children the child element list to copy
   * @param {Array.<Element>} _childArray the array to copy to
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _appendChildrenToArray(children, _childArray) {
    var childArray = _childArray;
    for (var i = children.length - 1; i >= 0; i--) {
      childArray[i] = children[i];
    }
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
  function _createDivElement(className) {
    var div = document.createElement('div');
    div.setAttribute(BONUS_DOM_ATTR, '');
    div.setAttribute('data-oj-internal', '');
    div.classList.add(className);
    return div;
  }

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
   * @private
   * @returns {boolean} true if we should ignore these mutations
   */
  function _ignoreMutations(mutations) {
    var ignore = true;
    var mutationsLength = mutations.length;

    for (var i = 0; i < mutationsLength; i++) {
      var mutation = mutations[i];

      if (mutation.type === 'childList' && _isBonusDomDivOrSelf(mutation.target)
                                        && _isNodeOfThisFormLayout(mutation.target)) {
        ignore = false;
        break;
      }
    }

    return ignore;
  }

  /**
   * Checks to see if the node is a DIV with our bonus dom attribute on it or if it is the
   * oj-form-layout itself.
   *
   * @param {Node} node Node to check.
   * @returns {boolean|null} true if we have a parent DIV with the bonus dom attribute
   */
  function _isBonusDomDivOrSelf(node) {
    return node === element || (node &&
                                node.tagName === 'DIV' &&
                                node.hasAttribute(BONUS_DOM_ATTR));
  }
  /**
   * Checks to make sure that this node belongs to this oj-form-layout rather than a nested -oj-form-layout
   * @param {Node} node
   * @returns {boolean}
   */
  function _isNodeOfThisFormLayout(_node) {
    var node = _node;
    var result = true;

    while (node !== element) {
      if (node.tagName === 'OJ-FORM-LAYOUT') {
        result = false;
        break;
      }

      node = node.parentElement;

      // must be a deleted node so ignore it
      if (node == null) {
        result = false;
        break;
      }
    }

    return result;
  }
  /**
   * Remove a dom element preserving all of its children
   *
   * @param {Element} elem
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _removeElementAndReparentChildren(elem) {
    while (elem.firstElementChild) {
      elem.parentNode.insertBefore(elem.firstElementChild, elem); // @HTMLUpdateOK reparenting existing element.
    }

    elem.parentNode.removeChild(elem);
  }

  /**
   * If an element doesn't have an ID, generate a unique ID for it.
   *
   * @param {Element} _elem
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _ensureUniqueId(_elem) {
    var elem = _elem;
    if (!elem.id) {
      elem.id = 'oflId_' + _uidCounter;
      _uidCounter += 1;
    }
  }
}

/* global __oj_form_layout_metadata:false */
/* global ojFormLayout */
(function () {
  __oj_form_layout_metadata.extension._CONSTRUCTOR = ojFormLayout;
  oj.CustomElementBridge.register('oj-form-layout', { metadata: __oj_form_layout_metadata });
}());

});