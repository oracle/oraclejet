/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import 'ojs/ojcomponentcore';
import 'ojs/ojoption';
import 'ojs/ojdataprovider';
import { register } from 'ojs/ojcomposite';

/**
 * @ojcomponent oj.ojMenuSelectMany
 * @since 6.0.0
 * @ojdisplayname Menu Multi Select
 * @ojshortdesc A menu select many allows the user to select one or more menu items from a set.
 * @ojrole menuitemcheckbox
 * @ojsignature {target: "Type", value:"class ojMenuSelectMany extends JetElement<ojMenuSelectManySettableProperties>"}
 *
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["disabled"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["value", "options"]}
 * @ojvbdefaultcolumns 2
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-menu-select-many'
 *
 * @classdesc
 * <h3 id="selectOverview-section">
 *   JET Menu Select Many
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#MenuSelectManyOverview-section"></a>
 * </h3>
 * <p>Description: JET Menu Select Many provides support for multiple selection of checkable menu items.
 * The only supported component child element of <code class="prettyprint">oj-menu-select-many</code> is
 * <code class="prettyprint">oj-option</code>. <code class="prettyprint">oj-menu-select-many</code> cannot
 * contain submenus but can be a child of a top-level <code class="prettyprint">oj-menu</code> or submenu.
 * </p>
 *
 * <p>A JET Menu Select Many can be created with the following markup.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- Including oj-option children -->
 * &lt;oj-menu-select-many value="{{selectedColors}}">
 *   &lt;oj-option value="blue">Blue&lt;/oj-option>
 *   &lt;oj-option value="green">Green&lt;/oj-option>
 *   &lt;oj-option value="red">Red&lt;/oj-option>
 * &lt;/oj-menu-select-many>
 *
 * &lt;!-- Collection bound simple syntax, no need to specify oj-option children -->
 * &lt;oj-menu-select-many value="{{selectedColors}}" options="[[colorOptions]]">
 * &lt;/oj-menu-select-many>
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
 */

/**
 * @typedef {Object} oj.ojMenuSelectMany.Option
 * @property {string} [id] menu item id.
 * @property {boolean} [disabled] menu item is disabled.
 * @property {string} label menu item label.
 * @property {any} value menu item value.
 */

/**
 *
 * @name options
 * @ojshortdesc The checkable menu option items.
 * @expose
 * @access public
 * @instance
 * @since 6.0.0
 * @type {Array<Object>|Object|null}
 * @default null
 * @ojsignature { target: "Type",
 *                value: "Array<oj.ojMenuSelectMany.Option>|DataProvider<any, any>|null",
 *                jsdocOverride: true}
 * @memberof oj.ojMenuSelectMany
 *
 * @example <caption>Initialize with a data provider:</caption>
 * &lt;oj-menu-select-many options="[[dataProvider]]">&lt;/oj-menu-select-many>
 *
 * var dataArray = [
 *            {value: 'red', label: 'Red'},
 *            {value: 'blue', label: 'Blue'},
 *            {value: 'green', label: 'Green'}];
 *
 * var dataProvider = new oj.ArrayDataProvider(dataArray, {keyAttributes: 'id'});
 */

/**
 * The value of the element. The value is an array with any type of items.
 *
 * @example <caption>Initialize with the <code class="prettyprint">value</code> attribute specified:</caption>
 * &lt;oj-menu-select-many value="{{val}}">&lt;/oj-menu-select-many>
 * @example var val = ['red', 'green'];
 *
 * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
 * // getter
 * var value = myMenuSelect.value;
 *
 * // setter
 * myMenuSelect.value = ["red", "green"];
 *
 * @member
 * @name value
 * @ojshortdesc The value of the element.
 * @access public
 * @instance
 * @since 6.0.0
 * @default []
 * @ojwriteback
 * @memberof oj.ojMenuSelectMany
 * @type {Array.<any>}
 * @ojeventgroup common
 */

/**
 * Disables all the checkable menu items if set to <code class="prettyprint">true</code>.
 *
 * @member
 * @name disabled
 * @memberof oj.ojMenuSelectMany
 * @access public
 * @instance
 * @since 6.0.0
 * @type {boolean}
 * @default false
 *
 * @example <caption>Initialize with the <code class="prettyprint">disabled</code> attribute specified:</caption>
 * &lt;oj-menu-select-many disabled='true'>&lt;/oj-menu-select-many>
 *
 * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
 * // getter
 * var disabledValue = myMenuSelect.disabled;
 *
 * // setter
 * myMenuSelect.disabled = true;
 */

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 *
 * @function setProperty
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {any} value - The new value to set the property to.
 * @return {void}
 * @expose
 * @memberof! oj.ojMenuSelectMany
 * @instance
 * @since 6.0.0
 *
 * @example <caption>Set a single subproperty of a complex property:</caption>
 * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
 */

/**
 * Retrieves a value for a property or a single subproperty for complex properties.
 * @function getProperty
 * @param {string} property - The property name to get. Supports dot notation for subproperty access.
 * @return {any}
 * @expose
 * @memberof! oj.ojMenuSelectMany
 * @instance
 * @since 6.0.0
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
 * @memberof! oj.ojMenuSelectMany
 * @instance
 * @since 6.0.0
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 **/
var _MENU_SELECT_MANY_VIEW =
  '<oj-bind-slot></oj-bind-slot>' +
  '<oj-bind-if test="[[$properties.options]]">' +
  '  <oj-bind-for-each data="[[$properties.options]]">' +
  '    <template>' +
  '      <oj-option :id="[[$current.data.id ? $current.data.id : optionIdPrefix + $current.observableIndex()]]" ' +
  '                 value="[[$current.data.value]]" disabled="[[$current.data.disabled]]">' +
  '        <oj-bind-text value="[[$current.data.label]]"></oj-bind-text>' +
  '      </oj-option>' +
  '    </template>' +
  '  </oj-bind-for-each>' +
  '<oj-bind-if>';

function MenuSelectManyViewModel(context) {
  this._composite = context.element;
  this._properties = context.properties;

  this.disconnected = this._disconnected.bind(this);
  this.connected = this._connected.bind(this);
  this.propertyChanged = this._propertyChanged.bind(this);
  this.optionIdPrefix = [context.unique, 'opt'].join('_');

  this.handleAction = this._handleAction.bind(this);
  this.handleOptionMutations = this._handleOptionMutations.bind(this);

  this._composite.setAttribute('role', 'group');
  if (this._properties.disabled) {
    this._composite.setAttribute('aria-disabled', 'true');
  }
}

// eslint-disable-next-line no-unused-vars
MenuSelectManyViewModel.prototype._connected = function (element) {
  this._addEventListener();
};

// eslint-disable-next-line no-unused-vars
MenuSelectManyViewModel.prototype._disconnected = function (element) {
  this._removeEventListener();
};

MenuSelectManyViewModel.prototype._propertyChanged = function (detail) {
  if (
    (detail.updatedFrom === 'external' && detail.property === 'value') ||
    (detail.updatedFrom === 'external' && detail.property === 'disabled') ||
    (detail.updatedFrom === 'external' && detail.property === 'options')
  ) {
    this._handleOptionMutations();

    if (detail.property === 'disabled') {
      if (this._properties.disabled) {
        this._composite.setAttribute('aria-disabled', 'true');
      } else {
        this._composite.removeAttribute('aria-disabled');
      }
    }
  }
};

MenuSelectManyViewModel.prototype._addEventListener = function () {
  var config = { attributes: true, subtree: true, attributeFilter: ['role'] };
  this._optionMutations = new MutationObserver(this.handleOptionMutations);
  this._optionMutations.observe(this._composite, config);
  this._composite.addEventListener('ojAction', this.handleAction, true);
};

MenuSelectManyViewModel.prototype._removeEventListener = function () {
  this._composite.removeEventListener('ojAction', this.handleAction, true);
  if (this._optionMutations) {
    var records = this._optionMutations.takeRecords();
    if (records && records.length > 0) {
      this.handleOptionMutations();
    }
    this._optionMutations.disconnect();
    delete this._optionMutations;
  }
};

MenuSelectManyViewModel.prototype._handleAction = function (event) {
  var option = event.target;
  var optionValue = option.value;
  if (MenuSelectManyViewModel._optionToggleChecked(option)) {
    this._addValue(optionValue);
  } else {
    this._removeValue(optionValue);
  }
};

MenuSelectManyViewModel.prototype._handleOptionMutations = function () {
  // menus defer create initialization until first open. when oj-options are rendered,
  // they mutate the dom and will signal this callback to
  // initialize the checked state of checkbox menu items with the selected value array.

  var value = this._properties.value;
  var children = this._composite.querySelectorAll('oj-option');
  for (var i = 0; i < children.length; i++) {
    var option = children[i];
    // seperators don't have the oj-menu-item selector
    if (option.classList.contains('oj-menu-item')) {
      var optionValue = option.value;
      var isChecked = value.indexOf(optionValue) > -1;
      MenuSelectManyViewModel._optionSetChecked(option, isChecked);
      if (this._properties.disabled) {
        MenuSelectManyViewModel._optionSetDisabled(option, true);
      } else {
        MenuSelectManyViewModel._optionSetDisabled(option, option.disabled);
      }
    }
  }
};

MenuSelectManyViewModel.prototype._addValue = function (optionValue) {
  var value = this._properties.value;
  if (value.indexOf(optionValue) < 0) {
    var clone = value.slice();
    clone.push(optionValue);
    this._properties.value = clone;
  }
};

MenuSelectManyViewModel.prototype._removeValue = function (optionValue) {
  var value = this._properties.value;
  var i = value.indexOf(optionValue);
  if (i > -1) {
    var clone = value.slice();
    clone.splice(i, 1);
    this._properties.value = clone;
  }
};

// static utility helper functions

MenuSelectManyViewModel._optionToggleChecked = function (element) {
  var checked = false;
  var anchor = element.firstChild;

  if (anchor) {
    var icon = anchor.querySelector('.oj-menucheckbox-icon');
    if (anchor.getAttribute('aria-checked') === 'true') {
      anchor.setAttribute('aria-checked', 'false');
      if (icon) {
        icon.classList.remove('oj-selected');
      }
    } else {
      anchor.setAttribute('aria-checked', 'true');
      if (icon) {
        icon.classList.add('oj-selected');
      }
    }
    checked = anchor.getAttribute('aria-checked') === 'true';
  }
  return checked;
};

MenuSelectManyViewModel._optionSetChecked = function (element, isChecked) {
  var anchor = element.firstChild;
  if (anchor) {
    anchor.setAttribute('aria-checked', isChecked ? 'true' : 'false');
    var icon = anchor.querySelector('.oj-menucheckbox-icon');
    if (icon) {
      if (isChecked) {
        icon.classList.add('oj-selected');
      } else {
        icon.classList.remove('oj-selected');
      }
    }
  }
};

MenuSelectManyViewModel._optionSetDisabled = function (element, disabled) {
  // overrides option rendering
  var anchor = element.firstChild;
  if (anchor) {
    var icon = anchor.querySelector('.oj-menucheckbox-icon');
    if (disabled) {
      element.classList.add('oj-disabled');
      anchor.setAttribute('aria-disabled', 'true');
      if (icon) {
        icon.classList.add('oj-disabled');
      }
    } else {
      element.classList.remove('oj-disabled');
      anchor.removeAttribute('aria-disabled');
      if (icon) {
        icon.classList.remove('oj-disabled');
      }
    }
  }
};

// Fragments:
/**
 * <p>The &lt;oj-menu-select-many> element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
 * accepted children and slots.</p>
 *
 * @ojchild Default
 * @memberof oj.ojMenuSelectMany
 * @ojshortdesc The oj-menu-select-many element accepts oj-option elements as children.
 * @ojpreferredcontent ["OptionElement"]
 *
 * @example <caption>Initialize the multi-select Menu with child content specified:</caption>
 * &lt;oj-menu-select-many>
 *   &lt;oj-option value="option1">Option 1&lt;/oj-option>
 *   &lt;oj-option value="option2">Option 2&lt;/oj-option>
 *   &lt;oj-option value="option3">Option 3&lt;/oj-option>
 * &lt;/oj-menu-select-many>
 */

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
 *       <td>Menu Item</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Invoke the menu item's action and toggle checked state.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <p>Disabled items do not allow any touch interaction.
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojMenuSelectMany
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
 *       <td rowspan = "5">Menu Item</td>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Invoke the focused menu item's action and toggles the checked state.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move focus to the previous menu item, wrapping around at the top.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus to the next menu item, wrapping around at the bottom.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to the first menu item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to the last menu item.</td>
 *     </tr>
 *     <tr>
 *       <td>Menu Item in Top-level Menu</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the menu and move focus to the launcher.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * <p>Disabled items can receive keyboard focus, but do not allow any other interaction.</p>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojMenuSelectMany
 */

var __oj_menu_select_many_metadata = 
{
  "properties": {
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "options": {
      "type": "Array<Object>|object"
    },
    "value": {
      "type": "Array<any>",
      "writeback": true,
      "value": []
    }
  },
  "methods": {
    "getProperty": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* global __oj_menu_select_many_metadata */
register('oj-menu-select-many', {
  view: _MENU_SELECT_MANY_VIEW,
  viewModel: MenuSelectManyViewModel,
  metadata: __oj_menu_select_many_metadata
});
