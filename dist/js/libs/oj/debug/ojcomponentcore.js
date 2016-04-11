/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'jqueryui-amd/core', 'jqueryui-amd/widget', 'ojs/ojmessaging'], function(oj, $)
{
/*
** Copyright (c) 2008, 2013, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/


/**
 * @class JET Component services
 * @export
 */
oj.Components = {};


/**
 * Sets default options values for JET components.
 * @param {Object} options - property values that will be merged into the values
 * that were previously set using this method. The options object is expected to have the format demonstrated
 * by the following example:
 * <pre>
 * {
 *   'default': // properties for all JET components 
 *   {
 *     'option1': 'somevalue'
 *   },
 *   'editableValue': // properties for editableValue components 
 *   {
 *     'option1': 'somevalue1',
 *     'option2': oj.Components.createDynamicPropertyGetter(function(context){
 *                                 return context['containers'].indexOf('ojTable') >= 0 ? 'tableValue' : 'normalValue'})
 *   },
 *   'ojText': // properties for instances of ojText 
 *   {
 *     'option1': 'somevalue2'
 *   }
 * }
 * </pre>
 * To specify a dynamic getter for the property, pass your callback to oj.Components.createDynamicPropertyGetter(). Note
 * that dynamic getters nested within a complex property value are not supported
 * @see oj.Components.createDynamicPropertyGetter
 * @export
 */
oj.Components.setDefaultOptions = function(options)
{
  oj.Components._defaultProperties = $.widget.extend(oj.Components._defaultProperties || {}, options);
};

/**
 * Retrieves default option values for JET components.
 * @return {Object} default option values
 * @see oj.Components.setDefaultOptions
 * @export
 */
oj.Components.getDefaultOptions = function()
{
  return (oj.Components._defaultProperties || {});
};


/**
 * Creates a dynamic getter that can be used as a property value in oj.Components.setDefaultOptions()
 * @param {!Function} callback - dynamic property callback. The callback will receive a context object as a parameter.
 * The following properties are currently supported on the context object:
 * <ul>
 * <li>containers - an array of component names of the current component's containers that require special behavior from
 * their children</li>
 * <li>element - component's host DOM element</li>
 * </ul>
 * The callback should return the computed property value
 * 
 * @return {Object} - dynamic property getter
 * @see oj.Components.setDefaultOptions
 * @export
 */
oj.Components.createDynamicPropertyGetter = function(callback)
{
  return new __ojDynamicGetter(callback);
};

/**
 * Retrieves widget constructor associated with the HTML element
 * or null if none is found. The returned constructor is already bound to the associated 
 * JQuery element, so it can be invoked as a function directly. For example:
 * <pre>
 * widgetConstructor("option", "label", "custom"); // sets label option
 * </pre>
 * If widgetName is not specified, and if more than one widget is associated with the element, 
 * the method will a return the widget that was created first.
 * @param {Element} element - HTML element
 * @param {string=} widgetName - optional widget name
 * @return {Function|null} widget constructor
 * @export
 */
oj.Components.getWidgetConstructor = function(element, widgetName)
{
  var jelem = $(element);
  
  var data = jelem.data(_OJ_WIDGET_NAMES_DATA);
  if (data)
  {
    if (widgetName == null)
    {
      widgetName = data[0]; 
    }
    else if (data.indexOf(widgetName) < 0)
    {
      widgetName = undefined;
    }
    
    if (widgetName != null)
    {
      var func = jelem[widgetName];
      if ((typeof func) === "function")
      {
        return func.bind(jelem);
      }
    }
  }
  
  return null;
};

/**
 * Notifies JET framework that a subtree possibly containing JET components has been inserted
 * into the document programmatically.
 *
 * Note that there is no need to call this method when the new DOM is being inserted by the template engine
 * in Knockout.js 
 * @param {!Element} node - the root of the subtree
 * @see oj.Components.subtreeDetached
 * @export
 */
oj.Components.subtreeAttached = function(node)
{
  oj.DomUtils.fixResizeListeners(node);
  _applyToComponents(node,
    function(instance)
    {
      instance._NotifyAttached();
    }
  );
};

/**
 * Notifies JET framework that a subtree possibly containing JET components has been removed
 * from the document programmatically.
 * 
 * Note that calling this method is not needs after calling JQuery's .remove() because all JET components would have been 
 * already destroyed in that case. Similarly, there is no need to call this method after the subtree has been removed by 
 * Knockout.js
 * @param {!Element} node - the root of the subtree
 * @see oj.Components.subtreeAttached
 * @export
 */
oj.Components.subtreeDetached = function(node)
{
  _applyToComponents(node,
    function(instance)
    {
      instance._NotifyDetached();
    }
  );
};

/**
 * Notifies JET framework that a subtree possibly containing JET components is no longer hidden with display:none style
 * This method should be called by the application if the 'display' style is being changed from 'hidden' programmatically,
 * such as when JQuery's .show() method is called
 * 
 * @param {!Element} node - the root of the subtree
 * @see oj.Components.subtreeHidden
 * @export
 */
oj.Components.subtreeShown = function(node)
{
  oj.DomUtils.fixResizeListeners(node);
  
  _applyToComponents(node,
    function(instance)
    {
      instance._NotifyShown();
    }
  );
};


/**
 * Notifies JET framework that a subtree possibly containing JET components has been hidden  with display:none style
 * This method should be called by the application after the subtree has been hidden programmatically, such as 
 * when JQuery's .hide() method is called.
 * 
 * @param {!Element} node - the root of the subtree
 * @see oj.Components.subtreeShown
 * @export
 */
oj.Components.subtreeHidden = function(node)
{
  _applyToComponents(node,
    function(instance)
    {
      instance._NotifyHidden();
    }
  );
};


/**
 * Determines if a component identified by the <code>widgetName</code> has been
 * bound and initialized on a given <code>jelement</code>.
 *
 * @param {jQuery} jelement to which the component is bound
 * @param {string} widgetName constructor name of the target component.
 * @return {boolean} <code>true</code> if the component identified by the widgetName
 *  has be bound and initialized to the target element.
 */
oj.Components.isComponentInitialized = function(jelement, widgetName)
{
  /** @type {?} */ 
  var widgets = jelement.data(_OJ_WIDGET_NAMES_DATA);
  if ($.isArray(widgets) && widgets.indexOf(widgetName) > -1 && jelement.is('.' + _OJ_COMPONENT_NODE_CLASS))
    return true;
  else
    return false;
}

/**
 * @private
 */
function _applyToComponents(subtreeRoot, callback)
{
  var processFunc = function() 
  {
    var jelem =  $(this);
    var names = jelem.data(_OJ_WIDGET_NAMES_DATA);
    if (names != null)
    {
      for (var i=0; i < names.length; i++)
      {
        var instance =  jelem.data("oj-" + names[i]);
        if (instance != null)
        {
          callback(instance);
        }
      }
    }
  };
  
  var locator = $(subtreeRoot);
  
  // Include the root node itself, and not just children ()
  if (locator.hasClass(_OJ_COMPONENT_NODE_CLASS))
  {
    processFunc.call(subtreeRoot);
  }
  
  locator.find('.' + _OJ_COMPONENT_NODE_CLASS).each(processFunc);
}


/**
 * @constructor
 * @param {!Function} callback
 * @private
 */
function __ojDynamicGetter(callback)
{
  this.getCallback = function()
  {
    return callback;
  }
};



/**
 * @private
 */
oj.Components._OJ_CONTAINER_ATTR = "data-oj-container";

/**
 * @private
 */
var _OJ_WIDGET_NAMES_DATA = "oj-component-names";

/**
 * @private
 */
var _OJ_COMPONENT_NODE_CLASS = "oj-component-initnode";
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/

/**
 * @private
 */
var _BASE_COMPONENT = 'baseComponent';

/**
 * @ojcomponent oj.baseComponent
 * @abstract
 * @since 0.6
 */
$.widget('oj.' + _BASE_COMPONENT,
{
  options:
  {
    /**
     * <p>JQ selector identifying the JET Menu that the component should launch as a context menu on right-click, <kbd>Shift-F10</kbd>, <kbd>Press & Hold</kbd>,
     * or component-specific gesture. If specified, the browser's native context menu will be replaced by the specified JET Menu.
     *
     * <p>To specify a JET context menu on a DOM element that is not a JET component, see the <code class="prettyprint">ojContextMenu</code> binding.
     *
     * <p>To make the page semantically accurate from the outset, applications are encouraged to specify the context menu via the standard
     * HTML5 syntax shown in the below example.  When the component is initialized, the context menu thus specified will be set on the component.
     *
     * <p>After create time, the <code class="prettyprint">contextMenu</code> option should be set via this API, not by setting the DOM attribute.
     *
     * @expose
     * @memberof oj.baseComponent
     * @instance
     * @type {Object}
     * @default <code class="prettyprint">null</code>
     *
     * @example <caption>Initialize a JET component with a context menu:</caption>
     * // via recommended HTML5 syntax:
     * &lt;div id="myComponent" contextmenu="myMenu" data-bind="ojComponent: { ... }>
     *
     * // via JET initializer (less preferred) :
     * // Foo is the component, e.g., InputText, InputNumber, Select, etc.
     * $( ".selector" ).ojFoo({ "contextMenu": "#myMenu" });
     *
     * @example <caption>Get or set the <code class="prettyprint">contextMenu</code> option, after initialization:</caption>
     * // getter
     * // Foo is the component, e.g., InputText, InputNumber, Select, etc.
     * var menu = $( ".selector" ).ojFoo( "option", "contextMenu" );
     *
     * // setter
     * // Foo is the component, e.g., InputText, InputNumber, Select, etc.
     * $( ".selector" ).ojFoo( "option", "contextMenu", ".my-marker-class" );
     *
     * @example <caption>Set a JET context menu on an ordinary HTML element:</caption>
     * &lt;a href="#" id="myAnchor" contextmenu="myMenu" data-bind="ojContextMenu: {}">Some text</a>
     */
    contextMenu: null,

    /**
     * <p>Attributes specified here will be set on the component's root DOM element at creation time.
     * This is particularly useful for components like Dialog that wrap themselves in a new root element
     * at creation time.
     *
     * <p>The supported attributes are <code class="prettyprint">id</code>, which overwrites any existing value,
     * and <code class="prettyprint">class</code> and <code class="prettyprint">style</code>, which are appended
     * to the current class and style, if any.
     *
     * <p>Setting this option after component creation has no effect.  At that time, the root element already
     * exists, and can be accessed directly via the <code class="prettyprint">widget</code> method, per the second example below.
     *
     * @example <caption>Initialize a JET component, specifying a set of attributes to be set
     * on the component's root DOM element:</caption>
     * // Foo is the component, e.g., Menu, Button, InputText, InputNumber, Select, etc.
     * $( ".selector" ).ojFoo({ "rootAttributes": {
     *   "id": "myId",
     *   "style": "max-width:100%; color:blue;",
     *   "class": "my-class"
     * }});
     *
     * @example <caption>After initialization, <code class="prettyprint">rootAttributes</code> should not be used.  It is
     * not needed at that time, as attributes of the root DOM element can simply be set directly, using
     * <code class="prettyprint">widget</code>:</caption>
     * // Foo is the component, e.g., Menu, Button, InputText, InputNumber, Select, etc.
     * $( ".selector" ).ojFoo( "widget" ).css( "height", "100px" );
     * $( ".selector" ).ojFoo( "widget" ).addClass( "my-class" );
     *
     * @expose
     * @memberof oj.baseComponent
     * @instance
     * @type {?Object}
     * @default <code class="prettyprint">null</code>
     */
    rootAttributes: null,

    /**
     * <p>A collection of translated resources from the translation bundle, or <code class="prettyprint">null</code> if this
     * component has no resources.  Resources may be accessed and overridden individually or collectively, as seen in the examples.
     *
     * <p>If this component has (or inherits) translations, their documentation immediately follows this doc entry.
     *
     * @member
     * @name translations
     * @memberof oj.baseComponent
     * @instance
     * @type {Object}
     * @default an object containing all resources relevant to the component and all its superclasses, or <code class="prettyprint">null</code> if none
     *
     * @example <caption>Initialize the component, overriding some translated resources.  This syntax leaves the other translations intact at create
     * time, but not if called after create time:</caption>
     * // Foo is InputDate, InputNumber, etc.
     * $( ".selector" ).ojFoo({ "translations": { someKey: "someValue",
     *                                            someOtherKey: "someOtherValue" } });
     *
     * @example <caption>Get or set the <code class="prettyprint">translations</code> option, after initialization:</caption>
     * // Get one.  (Foo is InputDate, InputNumber, etc.)
     * var value = $( ".selector" ).ojFoo( "option", "translations.someResourceKey" );
     *
     * // Get all.  (Foo is InputDate, InputNumber, etc.)
     * var values = $( ".selector" ).ojFoo( "option", "translations" );
     *
     * // Set one, leaving the others intact.  (Foo is InputDate, InputNumber, etc.)
     * $( ".selector" ).ojFoo( "option", "translations.someResourceKey", "someValue" );
     *
     * // Set many.  Any existing resource keys not listed are lost.  (Foo is InputDate, InputNumber, etc.)
     * $( ".selector" ).ojFoo( "option", "translations", { someKey: "someValue",
     *                                                     someOtherKey: "someOtherValue" } );
     *
     */
    // translations option is initialized programmatically, so this top-level API doc lives in this virtual comment.
    // Translations for all components are listed and JSDoc'ed in rt\src\main\resources\nls\root\ojtranslations.js.
    // That JSDoc appears in the same generated doc page as this top-level doc.


    // Events
    /**
     * <p>Triggered when any option changes. The event payload has the following properties:
     *
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} data event payload
     * @property {string} data.option the name of the option that changed.
     * @property {Object} data.previousValue - an Object holding the previous value of the option.
     * When previousValue is not a primitive type, i.e., is an Object, it may hold the same value as
     * the value property.
     * @property {Object} data.value - an Object holding the current value of the option.
     * @property {Object} data.optionMetadata information about the option that changed
     * @property {string} data.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
     *  <code class="prettyprint">"shouldNotWrite"</code>. For use by the JET writeback mechanism;
     *  'shouldWrite' indicates that the value should be written to the observable.
     *
     * @example <caption>Initialize component with the <code class="prettyprint">optionChange</code> callback</caption>
     * // Foo is Button, InputText, etc.
     * $(".selector").ojFoo({
     *   'optionChange': function (event, data) {}
     * });
     * @example <caption>Bind an event listener to the ojoptionchange event</caption>
     * $(".selector").on({
     *   'ojoptionchange': function (event, data) {
     *       window.console.log("option that changed is: " + data['option']);
     *   };
     * });
     *
     * @memberof oj.baseComponent
     * @expose
     * @event
     * @instance
     */
    optionChange: undefined,

    /**
     * <p>Triggered before the component is destroyed. This event cannot be canceled; the
     * component will always be destroyed regardless.
     *
     * @example <caption>Initialize component with the <code class="prettyprint">destroy</code> callback</caption>
     * // Foo is Button, InputText, etc.
     * $(".selector").ojFoo({
     *   'destroy': function (event, data) {}
     * });
     * @example <caption>Bind an event listener to the destroy event</caption>
     * $(".selector").on({
     *   'ojdestroy': function (event, data) {
     *       window.console.log("The DOM node id for the destroyed component is : %s", event.target.id);
     *   };
     * });
     *
     * @memberof oj.baseComponent
     * @expose
     * @event
     * @instance
     */
    destroy: undefined
  },

  // TODO: flesh out JSDoc verbiage, re: call after dom changes underneath component...
  /**
   * <p>Refreshes the component.
   *
   * @expose
   * @memberof oj.baseComponent
   * @instance
   */
  refresh: function()
  {
    this._propertyContext = null;
  },

  /**
   * <p>Overridden to save off component's default options and the options passed into the constructor (to be passed into
   * the _InitOptions() call).
   *
   * <p>This method is final. Components should instead override one or more of the overridable create-time methods
   * listed in <a href="#_ComponentCreate">_ComponentCreate</a>.
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   * @final
   */
  _createWidget: function(options, element)
  {
    // There is no need to clone these objects since they are not modified by the _createWidget() in the base class
    this._originalDefaults = this.options || {};
    this._constructorOptions = options || {};

    this._super(options, element);
    this._AfterCreateEvent();
  },

  /**
   * <p>Reads the <code class="prettyprint">rootAttributes</code> option, and sets the root attributes on the
   * component's root DOM element.  See <a href="#rootAttributes">rootAttributes</a> for the set of supported
   * attributes and how they are handled.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @throws if unsupported attributes are supplied.
   */
  _SetRootAttributes : function ()
  {
    var value = this.options.rootAttributes;
    if (value)
    {
      var widget = this.widget();
      if (widget == null)
        return;

      var classValue = value["class"];

      if (classValue)
      {
        widget.addClass(classValue);
      }

      var styleValue = value["style"];

      if (styleValue)
      {
        var currStyle = widget.attr('style');

        if (currStyle)
        {
          widget.attr('style', currStyle + ';' + styleValue);
        }
        else
        {
          widget.attr('style', styleValue);
        }
      }

      // make shallow copy, remove class and style from the copy, and set all
      // remaining attrs on the element.  Currently id is the only remaining attr
      // that we support.
      value = $.extend({}, value);
      delete value['class'];
      delete value['style'];

      widget.attr(value);

      delete value['id']; // remove the remaining supported value
      var unsupportedAttrs = Object.keys(value);
      if (unsupportedAttrs.length)
        throw new Error("Unsupported values passed to rootAttributes option: " + unsupportedAttrs.toString());
    }
  },

  /**
   * <p>This method is final in JET. Components should instead override one or more of the overridable create-time methods
   * listed in <a href="#_ComponentCreate">_ComponentCreate</a>.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @final
   */
  _create : function()
  {
    this._SaveAttributes(this.element);
    this._InitOptions(this._originalDefaults, this._constructorOptions);

    delete this._originalDefaults;
    delete this._constructorOptions;

    this._ComponentCreate();
    this._AfterCreate();

    // Marker class for all JET components on the init node (as opposed to the outer node)
    // This marker class is used to:
    // 1) find all JET components within a subtree
    // 2) to prevent FOUC:  init nodes NOT yet having this class are hidden.
    this.element.addClass(_OJ_COMPONENT_NODE_CLASS);
  },

  /**
   * <p>This method is not used in JET. Components should instead override <a href="#_InitOptions">_InitOptions</a>.
   *
   * @method
   * @name oj.baseComponent#_getCreateOptions
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @final
   */

  /**
   * <p>This method is called before <a href="#_ComponentCreate">_ComponentCreate</a>, at which point
   * the component has not yet been rendered.  Component options should be initialized in this method,
   * so that their final values are in place when <a href="#_ComponentCreate">_ComponentCreate</a> is called.
   *
   * <p>This includes getting option values from the DOM, where applicable, and coercing option
   * values (however derived) to their appropriate data type if needed.
   *
   * <p>No work other than setting options should be done in this method.  In particular, nothing should be
   * set on the DOM until <a href="#_ComponentCreate">_ComponentCreate</a>, e.g. setting the <code class="prettyprint">disabled</code>
   * DOM attribute from the <code class="prettyprint">disabled</code> option.
   *
   * <p>A given option (like <code class="prettyprint">disabled</code>) appears in the <code class="prettyprint">constructorOptions</code>
   * param iff the app set it in the constructor:
   *
   * <ul>
   *   <li>If it appears in <code class="prettyprint">constructorOptions</code>, it should win over what's in the DOM
   *     (e.g. <code class="prettyprint">disabled</code> DOM attribute).  If for some reason you need to tweak the value
   *     that the app set, then enable writeback when doing so:
   *     <code class="prettyprint">this.option('foo', bar, {'_context': {writeback: true, internalSet: true}})</code>.</li>
   *   <li>If it doesn't appear in <code class="prettyprint">constructorOptions</code>, then that option definitely is not bound,
   *     so writeback is not needed.  So if you need to set the option (e.g. from a DOM attribute), use
   *     <code class="prettyprint">this.option('foo', bar, {'_context': {internalSet: true}})</code>.</li>
   * </ul>
   *
   * <p>Overrides of this method should call <code class="prettyprint">this._super</code> first.
   *
   * @param {!Object} originalDefaults - original default options defined on the component and its ancestors
   * @param {?Object} constructorOptions - options passed into the widget constructor
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _InitOptions : function (originalDefaults, constructorOptions)
  {
    this._setupDefaultOptions(originalDefaults, constructorOptions);
    this._initContextMenuOption(constructorOptions);
  },

  /**
   * <p>All component create-time initialization lives in this method, except the logic that specifically
   * needs to live in <a href="#_InitOptions">_InitOptions</a>, <a href="#_AfterCreate">_AfterCreate</a>,
   * or <a href="#_AfterCreateEvent">_AfterCreateEvent</a>,
   * per the documentation for those methods.  All DOM creation must happen here, since the intent of
   * <a href="#_AfterCreate">_AfterCreate</a>, which is called next, is to contain superclass logic that must
   * run after that DOM is created.
   *
   * <p>Overrides of this method should call <code class="prettyprint">this._super</code> first.
   *
   * <p>Summary of create-time methods that components can override, in the order that they are called:
   *
   * <ol>
   *   <li><a href="#_InitOptions">_InitOptions</a></li>
   *   <li><a href="#_ComponentCreate">_ComponentCreate</a> (this method)</li>
   *   <li><a href="#_AfterCreate">_AfterCreate</a></li>
   *   <li>(The <code class="prettyprint">create</code> event is fired here.)</li>
   *   <li><a href="#_AfterCreateEvent">_AfterCreateEvent</a></li>
   * </ol>
   *
   * <p>For all of these methods, the contract is that overrides must call <code class="prettyprint">this._super</code> <i>first</i>, so e.g., the
   * <code class="prettyprint">_ComponentCreate</code> entry means <code class="prettyprint">baseComponent._ComponentCreate</code>,
   * then <code class="prettyprint">_ComponentCreate</code> in any intermediate subclasses, then
   * <code class="prettyprint">_ComponentCreate</code> in the leaf subclass.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _ComponentCreate : function ()
  {
    // Store widget name, so that oj.Components.getWidgetConstructor() can get widget from the element
    _storeWidgetName(this.element, this.widgetName);
  },

  /**
   * <p>This method is called after <a href="#_ComponentCreate">_ComponentCreate</a>, but before the
   * <code class="prettyprint">create</code> event is fired.  The JET base component does
   * tasks here that must happen after the component (subclass) has created itself in its override of
   * <a href="#_ComponentCreate">_ComponentCreate</a>.  Notably, the base component handles the
   * <a href="#rootAttributes">rootAttributes</a> and <a href="#contextMenu">contextMenu</a> options here,
   * since those options operate on the component root node, which for some components is created in their override
   * of <a href="#_ComponentCreate">_ComponentCreate</a>.
   *
   * <p>Subclasses should override this method only if they have tasks that must happen after a superclass's
   * implementation of this method, e.g. tasks that must happen after the context menu is set on the component.
   *
   * <p>Overrides of this method should call <code class="prettyprint">this._super</code> first.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _AfterCreate : function ()
  {
    this._SetRootAttributes(); // do first, since has no dependencies, but other stuff might care about these attrs

    // namespace facilitates removing contextMenu handlers separately, if app clears the "contextMenu" option
    this.contextMenuEventNamespace = this.eventNamespace + "contextMenu";
    this._setupContextMenu(true);
  },

  /**
   * <p>This method is called after the <code class="prettyprint">create</code> event is fired.
   * Components usually should not override this method, as it is rarely correct to wait until after the
   * <code class="prettyprint">create</code> event to perform a create-time task.
   *
   * <p>An example of a correct usage of this method is [Dialog's auto-open behavior]{@link oj.ojDialog#initialVisibility},
   * which needs to happen after the <code class="prettyprint">create</code> event.
   *
   * <p>Only <i>behaviors</i> (like Dialog auto-open behavior) should occur in this method.  Component <i>initialization</i>
   * must occur earlier, before the <code class="prettyprint">create</code> event is fired, so that
   * <code class="prettyprint">create</code> listeners see a fully inited component.
   *
   * <p>Overrides of this method should call <code class="prettyprint">this._super</code> first.
   *
   * <p>Do not confuse this method with the <a href="#_AfterCreate">_AfterCreate</a> method, which is more commonly used.
   *
   * @method
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _AfterCreateEvent : $.noop,

  /**
   * <p>JET components should almost never implement this JQUI method.  Please consult an architect if you believe you have an exception.  Reasons:
   * <ul>
   *   <li>This method is called at create time, after the <code class="prettyprint">create</code> event is fired.  It is rare
   *       for that to be the appropriate time to perform a create-time task.  For those rare cases, we have the
   *       <a href="#_AfterCreateEvent">_AfterCreateEvent</a> method, which is preferred over this method since it is called only
   *       at that time, not also at re-init time (see next).</li>
   *   <li>This method is also called at "re-init" time, i.e. when the initializer is called after the component has already been created.
   *       JET has not yet identified any desired semantics for re-initing a component.</li>
   * </ul>
   *
   * @method
   * @name oj.baseComponent#_init
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */

  /**
   * <p>Saves the element's attributes. This is called during _create.
   * <a href="#_RestoreAttributes">_RestoreAttributes</a> will restore all these attributes
   * and is called during _destroy.
   * </p>
   * <p> This base class default implementation does nothing.
   * </p>
   * <p>We also have <a href="#_SaveAllAttributes">_SaveAllAttributes</a> and
   * <a href="#_RestoreAllAttributes">_RestoreAllAttributes</a> methods
   *  that save and restore <i>all</i> the attributes on an element.
   *  Component subclasses can opt into these _SaveAllAttributes/_RestoreAllAttributes
   *  implementations by overriding _SaveAttributes and _RestoreAttributes to call
   *  _SaveAllAttributes/_RestoreAllAttributes. If the subclass wants a different implementation
   *  (like save only the 'class' attribute), it can provide the implementation itself in
   *  _SaveAttributes/_RestoreAttributes.
   *
   *
   * @param {Object} element - jQuery selection to save attributes for
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _SaveAttributes : function (element)
  {
    // default implementation does nothing.
  },
  /**
   * <p>Saves all the element's attributes within an internal variable.
   * <a href="#_RestoreAllAttributes">_RestoreAllAttributes</a> will restore the attributes
   * from this internal variable.</p>
   * <p>
   * This method is final in JET.
   * Subclasses can override _RestoreAttributes and call _RestoreAllAttributes.
   * </p>
   *
   * <p>The JSON variable will be held as:
   *
   * <pre class="prettyprint">
   * <code>[
   *   {
   *   "element" : element[i],
   *   "attributes" :
   *     {
   *       attributes[m]["name"] : {"attr": attributes[m]["value"], "prop": $(element[i]).prop(attributes[m]["name"])
   *     }
   *   }
   * ]
   * </code></pre>
   *
   * @param {Object} element - jQuery selection to save attributes for
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @final
   */
  _SaveAllAttributes : function (element)
  {
    var self = this;
    this._savedAttributes = [];

    $.each(element, function (index, ele)
    {
      //need to be able to save for multiple elements
      var saveAttributes = {},
          save = { "element" : ele, "attributes" : saveAttributes },
          attributes = ele.attributes;

      self._savedAttributes.push(save);

      $.each(attributes, function (index, attr)
      {
        // for proper access certain so called attributes should be accessed as properties
        // [i.e. required, disabled] so fetch them initially
        var attrName = attr["name"];

        saveAttributes[attrName] = { "attr" : attr["value"], "prop" : $(ele).prop(attrName) };
      });

    });

  },

  /**
   * <p>Gets the saved attributes for the provided element.
   *
   * <p>If you don't override <a href="#_SaveAttributes">_SaveAttributes</a> and
   * <a href="#_RestoreAttributes">_RestoreAttributes</a>, then this will return null.
   * <p>If you override _SaveAttributes to call <a href="#_SaveAllAttributes">_SaveAllAttributes</a>,
   * then this will return all the attributes.
   * If you override _SaveAttributes/_RestoreAttributes to do your own thing, then you may also have
   * to override _GetSavedAttributes to return whatever you saved if you need access to the saved
   * attributes.
   *
   * @param {Object} element - jQuery selection, should be a single entry
   * @return {Object|null} savedAttributes - attributes that were saved for this element
   * in <a href="#_SaveAttributes">_SaveAttributes</a>, or null if none were saved.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _GetSavedAttributes : function (element)
  {
    var savedAttributes = this._savedAttributes;

    // The component may not have saved any attributes. If so, return.
    if (savedAttributes === undefined)
      return null;

    element = element[0];

    for (var i = 0, j = savedAttributes.length;i < j;i++)
    {
      var curr = savedAttributes[i];

      if (curr["element"] === element)
      {
        return curr["attributes"];
      }
    }

    return {};
  },
  /**
   * <p>Restore the attributes saved in <a href="#_SaveAttributes">_SaveAttributes</a>.</p>
   * <p>
   * _SaveAttributes is called during _create. And _RestoreAttributes is called during _destroy.
   * </p>
   * <p> This base class default implementation does nothing.
   * </p>
   * <p>We also have <a href="#_SaveAllAttributes">_SaveAllAttributes</a> and
   * <a href="#_RestoreAllAttributes">_RestoreAllAttributes</a> methods
   *  that save and restore <i>all</i> the attributes on an element.
   *  Component subclasses can opt into these _SaveAllAttributes/_RestoreAllAttributes
   *  implementations by overriding _SaveAttributes and _RestoreAttributes to call
   *  _SaveAllAttributes/_RestoreAllAttributes. If the subclass wants a different implementation
   *  (like save only the 'class' attribute), it can provide the implementation itself in
   *  _SaveAttributes/_GetSavedAttributes/_RestoreAttributes.
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _RestoreAttributes : function ()
  {
    // default implementation does nothing.
  },
  /**
   * <p>Restores <i>all</i> the element's attributes which were saved in
   * <a href="#_SaveAllAttributes">_SaveAllAttributes</a>.
   * This method is final in JET.</p>
   * <p>
   * If a subclass wants to save/restore all attributes on create/destroy, then the
   * subclass can override <a href="#_SaveAttributes">_SaveAttributes</a>
   *  and call  <a href="#_SaveAllAttributes">_SaveAllAttributes</a> and also
   *  override <a href="#_RestoreAttributes">_RestoreAttributes</a>
   *  and call <a href="#_RestoreAllAttributes">_RestoreAllAttributes</a>.
   *
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @final
   */
  _RestoreAllAttributes : function ()
  {

    $.each(this._savedAttributes, function (index, savedAttr)
    {
      var element = $(savedAttr["element"]),
          attributes = savedAttr["attributes"];

      //sanity check
      if (element.length === 1)
      {
        var currAttr = savedAttr["element"].attributes,
            removeAttr = [];

        //request is to remove any attributes that didn't exist previously
        //need to store the attributes in an array and remove them afterwards as otherwise there are side affects
        for(var i=0, j=currAttr.length; i < j; i++)
        {
          if(!(currAttr[i]["name"] in attributes))
          {
            removeAttr.push(currAttr[i]["name"]);
          }
        }

        for(var i=0, j=removeAttr.length; i < j; i++)
        {
          element.removeAttr(removeAttr[i]);
        }

        for (var attribute in attributes)
        {
          element.attr(attribute, attributes[attribute]["attr"]);
        }
      }

    });

  },


  /**
   * <p>Determines the name of the translation bundle section for this component.
   *
   * @return {string} the name of this component's translations section
   * @memberof oj.baseComponent
   * @protected
   */
  _GetTranslationsSectionName: function()
  {
    return this.widgetFullName;
  },


  /**
   * <p>Compares 2 option values for equality and returns true if they are equal; false otherwise.
   *
   * @param {String} option - the name of the option
   * @param {Object} value1 first value
   * @param {Object} value2 another value
   * @return {boolean}
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _CompareOptionValues : function (option, value1, value2)
  {
    return value1 == value2;
  },


  /**
   * <p>Retrieves a translated string after inserting optional parameters.
   *
   * @param {string} key the translations resource key
   * The key is used to retrieve a format pattern from the component options, or if none
   * is found - from the translated resource bundle.
   * Tokens like {0}, {1}, {name} within the pattern will be used to define placement
   * for the optional parameters.  Token strings should not contain comma (,)
   * or space characters, since they are reserved for future format type enhancements.
   * The reserved characters within a pattern are:
   * $ { } [ ]
   * These characters will not appear in the formatted output unless they are escaped
   * with a dollar character ('$').
   *
   * @param {...string|Object|Array} var_args  - optional parameters to be inserted into the
   * translated pattern.
   *
   * If more than one var_args arguments are passed, they will be treated as an array
   * for replacing positional tokens like {0}, {1}, etc.
   * If a single argument is passed, it will be treated as a Javascript Object whose
   * keys will be matched to tokens within the pattern. Note that an Array is just
   * a special kind of such an Object.
   *
   * For backward compatibility, a var_args argument whose type is neither
   * Object or Array will be used to replace {0} in the pattern.
   *
   * @return formatted translated string or the key argument if the resource for the
   * key was not found
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  // TODO: non-public methods need to start with "_".  Pinged architect, who thinks this
  // method should become protected post-V1, which would imply a capital _GetTranslatedString
  getTranslatedString : function (key, var_args)
  {
    var params = {}, pattern;

    if (arguments.length > 2)
    {
      params = Array.prototype.slice.call(arguments, 1);
    }
    else if (arguments.length == 2)
    {
      params = arguments[1];
      if (typeof params !== 'object' && !(params instanceof Array))
      {
        params = [params];
      }

    }
    pattern = this.option(_OJ_TRANSLATIONS_PREFIX + key);
    // pattern could be undefined
    return (pattern == null) ? key : oj.Translations.applyParameters(pattern.toString(), params);
  },

  /**
   * <p>Returns the component DOM node indicated by the <code class="prettyprint">locator</code> parameter.
   *
   * <p>If the <code class="prettyprint">locator</code> or its <code class="prettyprint">subId</code> is
   * <code class="prettyprint">null</code>, then this method returns the element on which this component was initialized.
   *
   * <p>If a <code class="prettyprint">subId</code> was provided but no corresponding node
   * can be located, then this method returns <code class="prettyprint">null</code>.
   *
   * For more details on subIds, see the <a href="#subids-section">subIds section</a>.
   *
   * @expose
   * @memberof oj.baseComponent
   * @instance
   *
   * @param {Object} locator An Object containing, at minimum, a <code class="prettyprint">subId</code>
   * property, whose value is a string that identifies a particular DOM node in this component.
   *
   * <p>If this component has (or inherits) any subIds, then they are documented in the
   * "Sub-ID's" section of this document.
   *
   * <p>Subclasses of this component may support additional fields of the
   * <code class="prettyprint">locator</code> Object, to further specify the desired node.
   *
   * @returns {Element|null} The DOM node located by the <code class="prettyprint">subId</code> string passed in
   * <code class="prettyprint">locator</code>, or <code class="prettyprint">null</code> if none is found.
   *
   * @example <caption>Get the node for a certain subId:</caption>
   * // Foo is ojInputNumber, ojInputDate, etc.
   * var node = $( ".selector" ).ojFoo( "getNodeBySubId", {'subId': 'oj-some-sub-id'} );
   */
  getNodeBySubId: function(locator)
  {
    if (locator == null || locator['subId'] == null)
    {
      return this.element ? this.element[0] : null;
    }

    // Non-null locators have to be handled by the component subclasses
    return null;
  },

  /**
   * <p>Returns the subId string for the given child DOM node.  For more details, see
   * <a href="#getNodeBySubId">getNodeBySubId</a>.
   *
   * For more details on subIds, see the <a href="#subids-section">subIds section</a>.
   * @expose
   * @memberof oj.baseComponent
   * @instance
   *
   * @param {!Element} node - child DOM node
   * @return {Object|null} The locator for the DOM node, or <code class="prettyprint">null</code> when none is found.
   *
   * @example <caption>Get the subId for a certain DOM node:</caption>
   * // Foo is ojInputNumber, ojInputDate, etc.
   * var locator = $( ".selector" ).ojFoo( "getSubIdByNode", nodeInsideComponent );
   *
   * @private
   */
  getSubIdByNode: function(node)
  {
    return null;
  },

  // Overridden to set oj-hover and oj-focus classes
  // TODO: Move JSDoc from subclasses to here.  Don't include above internal comment.  Make at-final.
  destroy: function()
  {
    // Fire 'destroy' event
    this._trigger('destroy');

    this._super();

    this._removeContextMenuBehavior();

    // clean up states
    this.element.removeClass(_OJ_COMPONENT_NODE_CLASS);
    this.widget().removeClass( "oj-disabled" );
    
    // pass init node (this.element), not root node if different (this.widget()), since all elements in 
    // the root node subtree but not the init node subtree should have been removed by the call to _super.
    this._removeStateClasses( this.element );

    _removeWidgetName(this.element, this.widgetName);

    this._RestoreAttributes();

    // TODO: move this to _RestoreAttributes?
    if (this._initialCmDomAttr)
      this.element.attr("contextmenu", this._initialCmDomAttr);
    else
      this.element.removeAttr("contextmenu");

    this._propertyContext = null;
  },

  /*
   * Internal notes:
   * Overridden to pass extra flags to _setOption
   * param {...Object} var_args - key (or map), value, flags
   */
  /**
   * <p>This method has several overloads, which get and set component options and their fields.  The functionality is unchanged from
   * that provided by JQUI.  See the examples for details on each overload.
   *
   * @expose
   * @memberof oj.baseComponent
   * @instance
   * @final
   *
   * @param {string|Object=} optionName the option name (string, first two overloads), or the map (Object, last overload).
   *        Omitted in the third overload.
   * @param {Object=} value a value to set for the option.  Second overload only.
   * @return {Object|undefined} The getter overloads return the retrieved value(s).  When called via the public jQuery syntax, the setter overloads
   *         return the object on which they were called, to facilitate method chaining.
   *
   * @example <caption>First overload: get one option:
   * <p>This overload accepts a (possibly dot-separated) <code class="prettyprint">optionName</code> param as a string, and returns
   * the current value of that option.</caption>
   * var isDisabled = $( ".selector" ).ojFoo( "option", "disabled" ); // Foo is Button, Menu, etc.
   *
   * // For object-valued options, dot notation can be used to get the value of a field or nested field.
   * var startIcon = $( ".selector" ).ojButton( "option", "icons.start" ); // icons is object with "start" field
   *
   * @example <caption>Second overload: set one option:
   * <p>This overload accepts two params: a (possibly dot-separated) <code class="prettyprint">optionName</code> string, and a new value to
   * which that option will be set.</caption>
   * $( ".selector" ).ojFoo( "option", "disabled", true ); // Foo is Button, Menu, etc.
   *
   * // For object-valued options, dot notation can be used to set the value
   * // of a field or nested field, without altering the rest of the object.
   * $( ".selector" ).ojButton( "option", "icons.start", myStartIcon ); // icons is object with "start" field
   *
   * @example <caption>Third overload: get all options:
   * <p>This overload accepts no params, and returns a map of key/value pairs representing all the component
   * options and their values.</caption>
   * var options = $( ".selector" ).ojFoo( "option" ); // Foo is Button, Menu, etc.
   *
   * @example <caption>Fourth overload: set one or more options:
   * <p>This overload accepts a single map of option-value pairs to set on the component.  Unlike the first two
   * overloads, dot notation cannot be used.</caption>
   * $( ".selector" ).ojFoo( "option", { disabled: true, bar: 42 } ); // Foo is Button, Menu, etc.
   */
  option: function(optionName, value) // actually varArgs per comment above the JSDoc, but GCC warns unless matches the @param that we wish to doc
  {
    if (arguments.length === 0)
    {
      // don't return a reference to the internal hash
      return $.widget.extend({}, this.options);
    }

    var key = arguments[0];

    var options = key;
    var subkey = null;

    var flags = {};

    if (typeof key === "string")
    {
      // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
      options = {};
      var parts = key.split(".");
      key = parts.shift();
      if (parts.length)
      {
        subkey = parts.join(".");

        var curOption;
        try
        {
          // Inform dynamic getters that the subkey is being set
          if (arguments.length > 1)
          {
            this._settingNestedKey = subkey;
          }

          curOption = options[key] = $.widget.extend({}, this.options[key]);
        }
        finally
        {
          this._settingNestedKey = null;
        }

        for (var i = 0; i < parts.length - 1; i++)
        {
          curOption[parts[i]] = curOption[parts[i]] || {};
          curOption = curOption[parts[i]];
        }

        key = parts.pop();
        if (arguments.length === 1)
        {
          return curOption[key] === undefined ? null : curOption[key];
        }

        curOption[key] = value;
      }
      else
      {
        if (arguments.length === 1)
        {
          return this.options[key] === undefined ? null : this.options[key];
        }
        options[key] = value;
      }

      flags = arguments[2] || flags;
    }
    else
    {
      flags = arguments[1] || flags;
    }

    // Store subkey on the flags to let _setOption() know that dot notation was used
    if (subkey != null)
    {
      flags = $.widget.extend({}, flags, {'subkey': subkey});
    }

    var context = flags ? flags['_context'] : null;
    var internalSet = context ? context.internalSet : false;

    // Avoid _setOption() calls for internal sets, since component's _setOption()
    // and setOptions() overrides do not expect to be called in that case
    if (internalSet)
    {
      this._internalSetOptions(options, flags);
    }
    else
    {
      this._setOptions(options, flags);
    }

    return this;

  },

  /**
   * option() calls this rather than _setOption() if the caller was internal.
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _internalSetOptions: function (options, flags)
  {
    for (var key in options)
    {
      var value = options[key];
      var oldValue = this.options[key];
      this.options[key] = value;
      this._optionChanged(key, value, oldValue, flags);
    }
  },

  /**
   * <p>Overridden to pass extra flags to _setOption.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @ignore
   */
  _setOptions : function (options, flags)
  {
    for (var key in options)
    {
      this._setOption(key, options[key], flags);
    }

    return this;
  },

  /**
   * <p>Overridden to set oj-hover and oj-focus classes.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @ignore
   */
  _setOption: function(key, value, flags)
  {
    var originalValue = this.options[key];


    if (key === "disabled" )
    {
      // The JQUI superclass method has hard-coded style classes in the 'if key === "disabled"' block, so unfortunately
      // we must copy that logic here with updated style classes, and NOT call _super() for the disabled case.
      // TBD: keep this logic updated if superclass method changes.
      this.options[ key ] = value;

      // TBD: widget() is not always the thing that should have aria-disabled on it.  E.g. for the checkbox/radio flavors of ojButton,
      // widget() returns the root node, but aria-disabled belongs on the <input>.  We fixed this JQUI bug in ojButton by having ojButton
      // override this method to remove it from the root node and add it to the input.  Would be better for each component to know which
      // element to apply that to, e.g. an overridable method returning that element, or copying "hoverable" paradigm if appropriate.
      // In the cases where this.element is different than widget(), this.element is more likely to be the right thing, so maybe change
      // default to that.
      // Update: this issue is getting even more awkward now that we have "effectively disabled".  Probably need to refactor this code!
      this.widget()
	  .toggleClass( "oj-disabled", !!value )
	  .attr( "aria-disabled", value );

      if (value)
      {
        this._removeStateClasses( this.widget() );
      }
    }
    else {
      try
      {
        var subkey = (flags == null)? null :flags['subkey'];
        if (subkey != null)
        {
          this._settingNestedKey = subkey;
        }

        this._super(key, value);
      }
      finally
      {
        this._settingNestedKey = null;
      }

      if ( key === "contextMenu" )
        this._setupContextMenu(false);
    }

    this._optionChanged(key, value, originalValue, flags);

    return this;
  },

  /**
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _optionChanged: function(key, value, originalValue, flags)
  {
    // TODO: add option change notification
    var changed = false;
    var context = null;

    var writeback = false;
    var originalEvent = null;

    var optionMetadata = null;

    var extraData;

    if (flags)
    {
      changed = flags['changed'];
      context = flags['_context'];

      if (context)
      {
        originalEvent = context.originalEvent;
        writeback = (context.writeback === undefined) ? originalEvent != null : context.writeback;
        optionMetadata = context.optionMetadata;
        extraData = context.extraData;
      }
    }


    if (changed || !this._CompareOptionValues(key, originalValue, value))
    {

      optionMetadata = optionMetadata || {};
      optionMetadata['writeback'] =  writeback ? "shouldWrite" : "shouldNotWrite";

      var optionChangeData =
      {
        "option" : key,
        "previousValue" : originalValue,
        "value" : value,
        "optionMetadata" : optionMetadata
      };

      if (extraData != null)
      {
        optionChangeData = $.extend({}, extraData, optionChangeData);
      }

      this._trigger("optionChange", originalEvent, optionChangeData);
    }
  },

  /**
   * <p>Overridden to change the way the component events are treating original events:
   *
   * 1) preventDefault(), stopPropagation() and stopImmediatePropagation() no longer invoke
   *    the corresponding methods on the .originalEvent
   * 2) Properties of the .originalEvent are no longer copied to the new event being
   *    triggered
   *
   * @param {string} type - component event type
   * @param {?Object} event - original event
   * @param {Object=} data - event data
   * @return {boolean} true if the default action has not been prevented, false otherwise
   *
   * @private
   */
  _trigger : function (type, event, data)
  {
    return this._trigger2(type, event, data)['proceed'];
  },

  /**
   * <p>Same as _trigger(), but returns an object containing both the "prevented" status and the event.
   * 
   * <p>This is useful for event chaining, so that the returned event (e.g. Menu's select event) can be 
   * passed as the originalEvent of a subsequent event caused by the first (e.g. Menu's close event).
   *
   * @param {string} type - component event type
   * @param {?Object} event - original event
   * @param {Object=} data - event data
   * @return {!{proceed: boolean, event: $.Event}} 
   *     proceed is true if the default action has not been prevented, false otherwise
   *     event is the new event that was triggered
   *
   * @private
   */
  _trigger2 : function (type, event, data)
  {
    var prop, orig, callback = this.options[type];

    data = data || {};
    event = $.Event(event, _OJ_COMPONENT_EVENT_OVERRIDES);
    event.type = (this.widgetEventPrefix + type).toLowerCase();

    // the original event may come from any element
    // so we need to reset the target on the new event
    event.target = this.element[0];

    this.element.trigger(event, data);

    return {
      'proceed': !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === false || event.isDefaultPrevented()), 
      'event': event
    }
  },

  /**
   * <p>Sets contextMenu option from DOM if option not set.
   *
   * <p>Do not override.  To be called only from _InitOptions().
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   * @final
   */
  _initContextMenuOption: function(constructorOptions)
  {
    var contextMenu = this.element.attr("contextmenu");

    this._initialCmDomAttr = contextMenu; // TODO: remove this after the _RestoreAttributes() call in destroy() is uncommented

    if (contextMenu && !('contextMenu' in constructorOptions)) // if app set DOM attr but not option, then set the option from the DOM
    {
      this.option("contextMenu",
                  "#" + contextMenu,
                  {'_context': {internalSet: true}}); // writeback not needed since "not in constructorOptions" means "not bound"
    }
  },

  /**
   * <p>Call this method from _AfterCreate() and _setOption("contextMenu").
   *
   * <p>- This method first removes contextMenu listeners/attr from the component root node.
   * <p>- Then, if the component's "contextMenu" option is set, then it sets those things on the component root node.
   *
   * <p>We don't look for the menu until _getContextMenu() is called on the first launch,
   * so that the menu needn't be inited before this component.
   *
   * <p>If needed, override <code class="prettyprint">_NotifyContextMenuGesture()</code>, not this private method.
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _setupContextMenu: function(isCreateTime)
  {
    this._removeContextMenuBehavior();

    if ( this.options.contextMenu )
    {
        var rootNode = this.widget();
        var initNode = this.element;

        // if the context menu was specified via DOM attr of the init node at create time, and if that node is
        // different than the root node (i.e. if this component wraps itself in a new root node in
        // _ComponentCreate()), then remove the attr from the init node.
        if (isCreateTime && !initNode.is(rootNode))
            initNode.removeAttr("contextmenu");

        // if menu elem exists already and has an id, then set id on the *root* node's contextmenu DOM attr
        var id = $(this.options.contextMenu).attr("id");
        if (id)
            rootNode.attr("contextmenu", id);

        var self = this;

        //, on Chrome preventDefault on "keyup" will avoid triggering contextmenu event
        //which will display native contextmenu.This also need to be added on document as event target is not menu launcher.
        this._preventKeyUpEventIfMenuOpen = function(event){
          if (event.which == 121 && event.shiftKey) // Shift-F10
          {
            if (self._getContextMenuNode().is(":visible"))
              event.preventDefault();
          }
        };

        // Note: Whether or not we use Hammer to detect press-hold, this code would need to do the following things seen below:
        //
        // (1) Prevent the compatibility mousedown event from triggering Menu's clickAway logic.
        // (2) Prevent press-hold from also generating a click (unless Hammer does this automatically; I'm guessing it doesn't).
        // (3) Ensure we don't respond to *both* press-hold and contextmenu events on Android.
        //
        // So the only thing that Hammer would replace is:
        //
        // (4) Detecting the press-hold.
        //
        // Not currently using Hammer for (4), since:
        //
        // - This code predates Hammer, and was already stable after extensive iteration / fine-tuning.
        // - We use the same listeners for parts of 1-4. If moved 4 off to Hammer (separate listener), just need to ensure that
        //   we don't introduce any race conditions, etc.  (May be easy or hard, just need to look.)
        // - Hammer only wants to have one instance per DOM node, else they fight to control some things like touch-action. So
        //   a prereq for having this baseComponent logic put Hammer on components is to work out a protocol for super- and sub-
        //   classes to share the same instance and not step on each other.  Not insurmountable; just need to have the conversation.
        //   Tracked by ER 21357133, which links to detailed wiki.

        var pressHoldThreshold = 750; // per UX spec.  Point of reference: JQ Mobile uses 750ms by default.
        var isPressHold = false; // to prevent pressHold from generating a click

        var touchInProgress = false;

        // 5px is Hammer default.  (Didn't check whether they apply that separately to x and y like us, or to the hypotenuse,
        // but it's within a couple px either way -- think 3-4-5 triangle.)
        var maxAllowedMovement = 5;
        var touchPageX;
        var touchPageY;

        var doubleOpenTimer; // to prevent double open.  see usage below.
        var doubleOpenThreshold = 300; // made up this number.  TBD: Tweak as needed to make all platforms happy.
        var doubleOpenType = null; // "touchstart" or "contextmenu"

        var launch = function(event, eventType, pressHold) {
            // ensure that pressHold doesn't result in a click.  Set this before the bailouts below.
            isPressHold = pressHold;

            var menu = self._getContextMenu();

            // In Mobile Safari only, mousedown fires *after* the touchend, which causes at least 2 problems:
            // 1) CM launches after 750ms (good), then disappears when lift finger (bad), because touchend -->
            // mousedown, which calls Menu's "clikAway" mousedown listener, which dismisses Menu.
            // 2) The isPressHold logic needs to reset the isPressHold ivar on any event that can start a click,
            // including mousedown.  This problem causes the mousedown listener to incorrectly clear the ivar
            // after a pressHold, which broke the whole mechanism.
            // SOLUTION FOR 1-2:  On each launch (at 750ms), set a one-time touchend listener that will set a
            // var and clear it 50ms later.  While the var is set, both mousedown listeners can disregard the
            // mousedown.  Make the var a static var in Menu, since Menu's listener is static, and since this
            // launcher component can get/set it via an (effectively static) menu method.
            // NON-SOLUTIONS:  Cancelling touchstart or touchend, via pD() and sP(), doesn't cancel iPad's mousedown.
            // Cancelling mousedown from here doesn't work even if capture phase, since ojMenu's listener is capture phase.
            // TIMING: The following block should be before the doubleOpen bailout.
            if (isPressHold)
            {
                rootNode.one( "touchend" + self.contextMenuEventNamespace, function( event ) {
                    var touchendMousedownThreshold = 50; // 50ms.  Make as small as possible to prevent unwanted side effects.
                    menu.__contextMenuPressHoldJustEnded(true);
                    setTimeout(function() {
                        menu.__contextMenuPressHoldJustEnded(false);
                    }, touchendMousedownThreshold);
                });
            }

            // On platforms like Android Chrome where long presses already fire the contextmenu event, the pressHold
            // logic causes the menu to open twice, once for the pressHold, once for the contextmenu.  There's no
            // guarantee which will happen first, but as long as they happen within doubleOpenThreshold ms
            // of each other, this logic should prevent the double open.
            // Note: Another option is a platform-specific solution where we only use pressHold for platforms that need
            // it (that don't already fire a contextmenu event for pressHold), but architectural preference is to avoid
            // platform-specific solutions if possible.
            if ((doubleOpenType === "touchstart" && event.type === "contextmenu")
                    || (doubleOpenType === "contextmenu" && event.type === "touchstart"))
            {
                doubleOpenType = null;
                clearTimeout(doubleOpenTimer);
                return;
            }

            // If a nested element or component already showed a JET context menu for this event, don't replace it with ours.
            // Hack: must check defaultPrevented on the nested event too, because for touchstart events on iOS7 at least, when
            // the outer component reaches this point, event is a different JQ wrapper event than the one on which the inner
            // component previously called preventDefault, although they both wrap the same native originalEvent.  The new wrapper
            // never had its isDefaultPrevented field set to the returnTrue method, so must check the nested originalEvent.
            // This never seems to happen with right-click and Shift-F10 events.  Has nothing to do with the setTimeout: the events
            // received by the rootNode.on("touchstart"...) code are different (firstWrapper==secondWrapper returns false).
            // TODO: link to JQ bug once filed.
            if (event.isDefaultPrevented() || (event.originalEvent && event.originalEvent.defaultPrevented))
                return;

            // For components like Button where "effectively disabled" --> "not focusable", keyboard CM launch is impossible, so
            // allowing right-click access would be an a11y issue.  If there's ever a need to enable this for focusable effectively
            // disabled components, we can always replace the _IsEffectivelyDisabled() call with a new protected method whose
            // baseComponent impl returns _IsEffectivelyDisabled().
            if (self._IsEffectivelyDisabled())
                return;

            self._NotifyContextMenuGesture(menu, event, eventType);

            // if _NotifyContextMenuGesture() (or subclass override of it) actually opened the CM, and if that launch wasn't
            // cancelled by a beforeOpen listener...
            if (self._getContextMenuNode().is(":visible"))
            {
                event.preventDefault(); // don't show native context menu
                document.addEventListener("keyup", self._preventKeyUpEventIfMenuOpen);

                // see double-open comments above
                if (event.type === "touchstart" || event.type === "contextmenu")
                {
                    doubleOpenType = event.type;
                    doubleOpenTimer = setTimeout(function(){
                        doubleOpenType = null;
                    }, doubleOpenThreshold);
                }
            }
        };

        // At least some of the time, the pressHold gesture also fires a click event same as a short tap.  Prevent that here.
        this._clickListener = function( event ) {
            if (isPressHold) {
                // For Mobile Safari capture phase at least, returning false doesn't work; must use pD() and sP() explicitly.
                event.preventDefault();
                event.stopPropagation();
                isPressHold = false;
            }
        };

        // Use capture phase to make sure we cancel it before any regular bubble listeners hear it.
        rootNode[0].addEventListener("click", this._clickListener, true);

        rootNode
            .on( "touchstart" + this.contextMenuEventNamespace + " " +
                 "mousedown" + this.contextMenuEventNamespace + " " +
                 "keydown" + this.contextMenuEventNamespace + " ", function( event ) {
                // for mousedown-after-touchend Mobile Safari issue explained above where __contextMenuPressHoldJustEnded is set.
                if (event.type === "mousedown" && self._getContextMenu().__contextMenuPressHoldJustEnded())
                    return;

                // reset isPressHold flag for all events that can start a click.
                isPressHold = false;

                // start a pressHold timer on touchstart.  If not cancelled before 750ms by touchend/etc., will launch the CM.
                // isolate the context menu long tap to a single touch point.
                if (event.type === "touchstart" && event.originalEvent["touches"].length === 1) {
                    // note starting position so touchmove handler can tell if touch moved too much
                    var firstTouch = event.originalEvent["touches"][0];
                    touchPageX = firstTouch["pageX"];
                    touchPageY = firstTouch["pageY"];

                    touchInProgress = true;
                    this._contextMenuPressHoldTimer = setTimeout(launch.bind(undefined, event, "touch", true), pressHoldThreshold);
                }

                return true;
            })

            // if the touch moves too much, it's not a pressHold
            .on( "touchmove" + this.contextMenuEventNamespace, function( event ) {
                var firstTouch = event.originalEvent["touches"][0];
                if (Math.abs(touchPageX - firstTouch["pageX"]) > maxAllowedMovement
                    || Math.abs(touchPageY - firstTouch["pageY"]) > maxAllowedMovement)
                {
                    touchInProgress = false;
                    clearTimeout(this._contextMenuPressHoldTimer);
                }
                return true;
            })

            // if the touch ends before the 750ms is up, it's not a long enough pressHold to show the CM
            .on( "touchend" + this.contextMenuEventNamespace + " " +
                 "touchcancel" + this.contextMenuEventNamespace, function( event ) {
                touchInProgress = false;
                clearTimeout(this._contextMenuPressHoldTimer);
                return true;
            })
            .on( "keydown" + this.contextMenuEventNamespace + " " +
                 "contextmenu" + this.contextMenuEventNamespace, function( event ) {
                if (event.type === "contextmenu" // right-click.  pressHold for Android but not iOS
                        || (event.which == 121 && event.shiftKey)) // Shift-F10
                {
                    var eventType = touchInProgress ? "touch" : event.type === "keydown" ? "keyboard" : "mouse";
                    launch(event, eventType, false);
                }

                return true;
            })

            // Does 2 things:
            // 1) Prevents native context menu / callout from appearing in Mobile Safari.  E.g. for links, native CM has "Open in New Tab".
            // 2) In Mobile Safari and Android Chrome, prevents pressHold from selecting the text and showing the selection handles and (in Safari) the Copy/Define callout.
            // In UX discussion, we decided to prevent both of these things for all JET components for now.  If problems, can always, say, add protected method allowing
            // subclass to opt out (e.g. if they need 1 and/or 2 to work).
            // Per discussion with architects, do #2 only for touch devices, so that text selection isn't prevented on desktop.  Since #1
            // is a no-op for non-touch, we can accomplish this by omitting the entire style class, which does 1 and 2, for non-touch.
            // Per comments in scss file, the suppression of 1 and 2 has issues in old versions of Mobile Safari.
            .addClass(oj.DomUtils.isTouchSupported() ? "oj-menu-context-menu-launcher" : undefined);
    }
  },

  /**
   * <p>Sets the ivars used by _getContextMenu() and _getContextMenuNode().  These 2 _ivars should be set/cleared in lockstep.
   *
   * <p>This method should be called only by those 2 methods.
   *
   * @memberof oj.baseComponent
   * @instance
   * @throws if no Menu found, which is app error since Menu should be inited by the time this is called
   * @private
   */
  _setContextMenuIvars: function()
  {
    // JQ obj containing the menu element.  Empty if no element found.
    this._contextMenuNode = $(this.options.contextMenu).first();

    // Menu component.  undefined if _contextMenuNode empty, or if its one node has no JET Menu.
    this._contextMenu = this._contextMenuNode.data( "oj-ojMenu" );

    if (!this._contextMenu)
        throw new Error('"contextMenu" option set to "' + this.options.contextMenu + '", which does not reference a valid JET Menu.');

    var self = this;
    this._contextMenuNode.on( "ojclose" + this.contextMenuEventNamespace , function( event, ui ) {
        document.removeEventListener("keyup", self._preventKeyUpEventIfMenuOpen);
    });
  },

  /**
   * <p>Lazy getter for the context menu.
   *
   * <p>This method should be called only by the "user is launching the context menu" listeners, which should only be registered
   * if the "contextMenu" option is set.  Do not call at create time.
   *
   * <p>We wait until menu-launch time to lazily get the menu, to avoid an init-order dependency.  It should be OK to
   * init the component before its context menu.
   *
   * @return the JET Menu component pointed to by the "contextMenu" option
   * @throws if no Menu found, which is app error since Menu should be inited by the time this is called
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _getContextMenu: function()
  {
    if (!this._contextMenu)
        this._setContextMenuIvars();

    return this._contextMenu;
  },

  /**
   * <p>All _getContextMenu doc applies to this method too, except this method returns
   * the menu node, not the menu itself.
   *
   * @return the root DOM node of the JET Menu
   * @throws if no Menu found, which is app error since Menu should be inited by the time this is called
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _getContextMenuNode: function()
  {
    if (!this._contextMenuNode)
        this._setContextMenuIvars();

    return this._contextMenuNode;
  },

  /**
   * <p>This method removes contextMenu functionality from the component.
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _removeContextMenuBehavior: function()
  {
    this.widget()
        .removeAttr( "contextmenu" )
        .off( this.contextMenuEventNamespace )
        .removeClass("oj-menu-context-menu-launcher")
        [0].removeEventListener("click", this._clickListener, true);

    this._contextMenuNode && this._contextMenuNode.off( this.contextMenuEventNamespace );

    // the other 2 contextMenu timeouts don't need to be cleared here
    clearTimeout(this._contextMenuPressHoldTimer);

    // set/unset these ivars in lockstep
    this._contextMenu = undefined;
    this._contextMenuNode = undefined;
  },

  /**
   * <p>When the <a href="#contextMenu">contextMenu</a> option is set, this method is called when the user invokes the context menu via
   * the default gestures: right-click, <kbd>Press & Hold</kbd>, and <kbd>Shift-F10</kbd>.  Components should not call this method directly.
   *
   * <p>The default implementation simply calls <a href="#_OpenContextMenu">this._OpenContextMenu(event, eventType)</a>.
   * Overrides of this method should call that same method, perhaps with additional params, not [menu.open()]{@link oj.ojMenu#open}.
   *
   * <p>This method may be overridden by components needing to do things like the following:
   *
   * <ul>
   * <li>Customize the [launcher]{@link oj.ojMenu#openOptions.launcher} or [position]{@link oj.ojMenu#openOptions.position} passed to
   * <a href="#_OpenContextMenu">_OpenContextMenu()</a>.  See that method for guidance on these customizations.</li>
   *
   * <li>Customize the menu contents.  E.g. some components need to enable/disable built-in commands like <kbd>Cut</kbd> and <kbd>Paste</kbd>,
   * based on state at launch time.</li>
   *
   * <li>Bail out in some cases.  E.g. components with UX approval to use <kbd>PressHoldRelease</kbd> rather than <kbd>Press & Hold</kbd> can override this method
   * to say <code class="prettyprint">if (eventType !== "touch") this._OpenContextMenu(event, eventType);</code>.  When those components
   * detect the alternate context menu gesture (e.g. <kbd>PressHoldRelease</kbd>), that separate listener should call <a href="#_OpenContextMenu">this._OpenContextMenu()</a>,
   * not this method (<code class="prettyprint">_NotifyContextMenuGesture()</code>), and not [menu.open()]{@link oj.ojMenu#open}.  </li>
   * </ul>
   *
   * <p>Components needing to do per-launch setup like the above tasks should do so in an override of this method, <i>not</i> in
   * a [beforeOpen]{@link oj.ojMenu#event:beforeOpen} listener or an <a href="#_OpenContextMenu">_OpenContextMenu()</a> override.
   * This is discussed more fully <a href="#_OpenContextMenu">here</a>.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   *
   * @param {!Object} menu The JET Menu to open as a context menu.  Always non-<code class="prettyprint">null</code>.
   * @param {!Event} event What triggered the menu launch.  Always non-<code class="prettyprint">null</code>.
   * @param {string} eventType "mouse", "touch", or "keyboard".  Never <code class="prettyprint">null</code>.
   */
  _NotifyContextMenuGesture: function(menu, event, eventType)
  {
    this._OpenContextMenu(event, eventType);
  },

  /**
   * <p>The only correct way for a component to open its context menu is by calling this method, not by calling [Menu.open()]{@link oj.ojMenu#open} or
   * <a href="#_NotifyContextMenuGesture">_NotifyContextMenuGesture()</a>.  This method should be called in two cases:
   *
   * <ul>
   * <li>This method is called by <a href="#_NotifyContextMenuGesture">_NotifyContextMenuGesture()</a> and its overrides.  That method is
   * called when the baseComponent detects the default context menu gestures: right-click, <kbd>Press & Hold</kbd>, and <kbd>Shift-F10</kbd>.</li>
   *
   * <li>Components with UX-approved support for alternate context menu gestures like <kbd>PressHoldRelease</kbd> should call this method directly
   * when those gestures are detected.</li>
   * </ul>
   *
   * <p>Components needing to customize how the context menu is launched, or do any per-launch setup, should do so in the caller of this method,
   * (which is one of the two callers listed above), often by customizing the params passed to this method
   * (<code class="prettyprint">_OpenContextMenu</code>) per the guidance below.  This setup should <i>not</i> be done in the following ways:
   *
   * <ul>
   * <li>Components should not perform setup in a [beforeOpen]{@link oj.ojMenu#event:beforeOpen} listener, as this can cause a race
   * condition where behavior depends on who got their listener registered first: the component or the app.  The only correct component use
   * of a <code class="prettyprint">beforeOpen</code> listener is when there's a need to detect whether <i>something else</i> launched the menu.</li>
   *
   * <li>Components should not override this method (<code class="prettyprint">_OpenContextMenu</code>), as this method is final.  Instead, customize
   * the params that are passed to it.</li>
   * </ul>
   *
   * <p><b>Guidance on setting OpenOptions fields:</b>
   *
   * <p><b>Launcher:</b>
   *
   * <p>Depending on individual component needs, any focusable element within the component can be the appropriate
   * [launcher]{@link oj.ojMenu#openOptions.launcher} for this launch.
   *
   * <p>Browser focus returns to the launcher on menu dismissal, so the launcher must at least be focusable.  Typically a tabbable (not just
   * focusable) element is safer, since it just focuses something the user could have focused on their own.
   *
   * <p>By default (i.e. if <code class="prettyprint">openOptions</code> is not passed, or if it lacks a <code class="prettyprint">launcher</code>
   * field), the component init node is used as the launcher for this launch.  If that is not focusable or is suboptimal for a given
   * component, that component should pass something else.  E.g. components with a "roving tabstop" (like Toolbar) should typically choose the
   * current tabstop as their launcher.
   *
   * <p>The [:focusable]{@link http://api.jqueryui.com/focusable-selector/} and [:tabbable]{@link http://api.jqueryui.com/tabbable-selector/} selectors
   * may come in handy for choosing a launcher, e.g. something like <code class="prettyprint">this.widget().find(".my-class:tabbable").first()</code>.
   *
   * <p><b>Position:</b>
   *
   * <p>By default, this method applies [positioning]{@link oj.ojMenu#openOptions.position} that differs from Menu's default in the following ways:
   * (The specific settings are subject to change.)
   *
   * <ul>
   * <li>For mouse and touch events, the menu is positioned relative to the event, not the launcher.</li>
   *
   * <li>For touch events, <code class="prettyprint">"my"</code> is set to <code class="prettyprint">"start>40 center"</code>,
   * to avoid having the context menu obscured by the user's finger.</li>
   * </ul>
   *
   * <p>Usually, if <code class="prettyprint">position</code> needs to be customized at all, the only thing that needs changing is its
   * <code class="prettyprint">"of"</code> field, and only for keyboard launches (since mouse/touch launches should almost certainly keep
   * the default <code class="prettyprint">"event"</code> positioning).  This situation arises anytime the element relative to which the menu
   * should be positioned for keyboard launches is different than the <code class="prettyprint">launcher</code> element (the element to which
   * focus should be returned upon dismissal).  For this case, <code class="prettyprint">{ "position": {"of": eventType==="keyboard" ? someElement : "event"} }</code>
   * can be passed as the <code class="prettyprint">openOptions</code> param.
   *
   * <p>Be careful not to clobber useful defaults by specifying too much.  E.g. if you only want to customize <code class="prettyprint">"of"</code>,
   * don't pass other fields like <code class="prettyprint">"my"</code>, since your value will be used for all modalities (mouse, touch, keyboard),
   * replacing the modality-specific defaults that are usually correct.  Likewise, don't forget the
   * <code class="prettyprint">eventType==="keyboard"</code> check if you only want to customize <code class="prettyprint">"of"</code> for keyboard launches.
   *
   * <p><b>InitialFocus:</b>
   *
   * <p>This method forces [initialFocus]{@link oj.ojMenu#openOptions.initialFocus} to <code class="prettyprint">"menu"</code> for this
   * launch, so the caller needn't specify it.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @final
   *
   * @param {!Event} event What triggered the context menu launch.  Must be non-<code class="prettyprint">null</code>.
   * @param {string} eventType "mouse", "touch", or "keyboard".  Must be non-<code class="prettyprint">null</code>.  Passed explicitly since caller
   *        knows what it's listening for, and since events like <code class="prettyprint">contextmenu</code> and
   *        <code class="prettyprint">click</code> can be generated by various input modalities, making it potentially error-prone for
   *        this method to determine how they were generated.
   * @param {Object=} openOptions Options to merge with this method's defaults, which are discussed above.  The result will be passed to
   *        [Menu.open()]{@link oj.ojMenu#open}.  May be <code class="prettyprint">null</code> or omitted.  See also the
   *        <code class="prettyprint">shallow</code> param.
   * @param {Object=} submenuOpenOptions Options to be passed through to [Menu.open()]{@link oj.ojMenu#open}.  May be <code class="prettyprint">null</code>
   *        or omitted.
   * @param {boolean=} shallow Whether to perform a deep or shallow merge of <code class="prettyprint">openOptions</code> with this method's default
   *        value.  The default and most commonly correct / useful value is <code class="prettyprint">false</code>.
   *
   *        <ul>
   *        <li>If <code class="prettyprint">true</code>, a shallow merge is performed, meaning that the caller's <code class="prettyprint">position</code>
   *        object, if passed, will completely replace this method's default <code class="prettyprint">position</code> object.</li>
   *
   *        <li>If <code class="prettyprint">false</code> or omitted, a deep merge is performed.  For example, if the caller wishes to tweak
   *        <code class="prettyprint">position.of</code> while keeping this method's defaults for <code class="prettyprint">position.my</code>,
   *        <code class="prettyprint">position.at</code>, etc., it can pass <code class="prettyprint">{"of": anOfValue}</code> as the
   *        <code class="prettyprint">position</code> value.</li>
   *        </ul>
   *
   *        <p>The <code class="prettyprint">shallow</code> param is n/a for <code class="prettyprint">submenuOpenOptions</code>, since this method doesn't
   *        apply any defaults to that.  (It's a direct pass-through.)
   */
  _OpenContextMenu: function(event, eventType, openOptions, submenuOpenOptions, shallow)
  {
    // Note: our touch positioning is similar to that of the iOS touch callout (bubble with "Open in New Tab", etc.), which is offset from the pressHold location as follows:
    // - to the right, vertically centered.  (by default)
    // - to the left, vertically centered.  (if fits better)
    // - above or below, horizontally centered.  (if fits better)
    // An offset like 40 prevents it from opening right under your finger, and is similar to iOS's offset.  It also prevents the issue (on iOS7 at least)
    // where touchend after the pressHold can dismiss the CM b/c the menu gets the touchend.

    var position = {
      "mouse": {
        "my": "start top",
        "at": "start bottom",
        "of": event,
        "collision": "flipfit"
      },
      "touch": {
        "my": "start>40 center",
        "at": "start bottom",
        "of": event,
        "collision": "flipfit"
      },
      "keyboard": {
        "my": "start top",
        "at": "start bottom",
        "of": "launcher",
        "collision": "flipfit"
      }
    };

    var defaults = {"launcher": this.element, "position": position[eventType]}; // used for fields caller omitted
    var forcedOptions = {"initialFocus": "menu"};

    openOptions = (shallow)
      ? $.extend(defaults, openOptions, forcedOptions)
      : $.extend(true, defaults, openOptions, forcedOptions);

    var menu = this._getContextMenu();
    menu.__openingContextMenu = true; // Hack.  See todo on this ivar in Menu.open().
    menu.open(event, openOptions, submenuOpenOptions);
    menu.__openingContextMenu = false;
  },

  /**
   * <p>Removes the <code class="prettyprint">oj-hover</code>, <code class="prettyprint">oj-focus</code>, and 
   * <code class="prettyprint">oj-active</code> classes from the specified element and its subtree.
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   *
   * @param {!jQuery} element The element from whose subtree the 3 classes should be removed
   */
  _removeStateClasses: function( element )
  {
    element.removeClass("oj-hover oj-focus oj-active");
    element.find( ".oj-hover" ).removeClass( "oj-hover" );
    element.find( ".oj-focus" ).removeClass( "oj-focus" );
    element.find( ".oj-active").removeClass( "oj-active" );
  },


  /**
   * <p>Sets the <code class="prettyprint">oj-hover</code> class when the element is hovered and removes it when the hover ends.
   *
   * <p>Overridden to set the <code class="prettyprint">oj-hover</code> class instead of JQUI's hard-coded 
   * <code class="prettyprint">ui-</code> class, and eliminate JQUI's caching.
   * 
   * <p>Typically the specified element should be within the component subtree, in which case the class will 
   * automatically be removed from the element when the component is destroyed, when its <code class="prettyprint">disabled</code>
   * option is set to true, and when <code class="prettyprint">_NotifyDetached()</code> is called.
   * 
   * <p>As a minor exception, for components that wrap themselves in a new root node at create time, if the specified 
   * element is within the root node's subtree but not within the init node's subtree, then at destroy time only, the 
   * class will not be removed, since <code class="prettyprint">destroy()</code> is expected to remove such nodes.
   * 
   * <p>If the element is NOT in the component subtree, then the caller is responsible for removing the class at the 
   * times listed above.
   * 
   * @memberof oj.baseComponent
   * @instance
   * @protected
   *
   * @param {!jQuery} element The element to receive the <code class="prettyprint">oj-hover</code> class on hover
   */
  _hoverable: function( element )
  {
    // Do NOT call _super(). See JSDoc above.
    // TBD: if superclass method changes, evaluate whether to uptake their changes.
    this._on( element, {
      mouseenter: function( event ) {
        if (!$( event.currentTarget ).hasClass( "oj-disabled" ))
        {
          $( event.currentTarget ).addClass( "oj-hover" );
        }
      },
      mouseleave: function( event ) {
        $( event.currentTarget ).removeClass( "oj-hover" );
      }
    });
  },

  /**
   * <p>Sets the <code class="prettyprint">oj-focus</code> class when the element is focused and removes it when focus is lost.
   *
   * <p>Overridden to set the <code class="prettyprint">oj-focus</code> class instead of JQUI's hard-coded 
   * <code class="prettyprint">ui-</code> class, and eliminate JQUI's caching.
   * 
   * <p>Typically the specified element should be within the component subtree, in which case the class will 
   * automatically be removed from the element when the component is destroyed, when its <code class="prettyprint">disabled</code>
   * option is set to true, and when <code class="prettyprint">_NotifyDetached()</code> is called.
   * 
   * <p>As a minor exception, for components that wrap themselves in a new root node at create time, if the specified 
   * element is within the root node's subtree but not within the init node's subtree, then at destroy time only, the 
   * class will not be removed, since <code class="prettyprint">destroy()</code> is expected to remove such nodes.
   * 
   * <p>If the element is NOT in the component subtree, then the caller is responsible for removing the class at the 
   * times listed above.
   * 
   * @memberof oj.baseComponent
   * @instance
   * @protected
   *
   * @param {!jQuery} element The element to receive the <code class="prettyprint">oj-focus</code> class on focus
   */
  _focusable: function( element )
  {
    // Do NOT call _super().
    // TBD: if superclass method changes, evaluate whether to uptake their changes.
    this._on( element, {
      focusin: function( event ) {
	    $( event.currentTarget ).addClass( "oj-focus" );
	  },
	  focusout: function( event ) {
	    $( event.currentTarget ).removeClass( "oj-focus" );
	  }
    });
  },

  /**
   * <p>Sets the <code class="prettyprint">oj-active</code> class on mousedown and removes it on mouseup.
   * <code class="prettyprint">oj-active</code> is one of JET's 'marker' style classes. It emulates
   * the css <code class="prettyprint">:active</code> pseudo-class.
   *
   * <p>Unlike _hoverable() and _focusable(), this is an original JET method not inherited from JQUI.
   * (Obviously inspired by those methods.)
   *
   * <p>Typically the specified element should be within the component subtree, in which case the class will 
   * automatically be removed from the element when the component is destroyed, when its <code class="prettyprint">disabled</code>
   * option is set to true, and when <code class="prettyprint">_NotifyDetached()</code> is called.
   * 
   * <p>As a minor exception, for components that wrap themselves in a new root node at create time, if the specified 
   * element is within the root node's subtree but not within the init node's subtree, then at destroy time only, the 
   * class will not be removed, since <code class="prettyprint">destroy()</code> is expected to remove such nodes.
   * 
   * <p>If the element is NOT in the component subtree, then the caller is responsible for removing the class at the 
   * times listed above.
   * 
   * @memberof oj.baseComponent
   * @instance
   * @protected
   *
   * @param {!jQuery} element The element to receive the <code class="prettyprint">oj-active</code> class when pressed
   */
  _activeable: function( element )
  {
    this._on( element, {
      mousedown: function( event )
      {
        $( event.currentTarget ).addClass( "oj-active" );
      },
      mouseup: function( event )
      {
        $( event.currentTarget ).removeClass( "oj-active" );
      }
    });
  },

  /**
   * Remove all listener references that were attached to the element.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _UnregisterChildNode: function(element)
  {
    if (element) {
      $(element).off(this.eventNamespace);

      var bindings = this['bindings'];
      if (bindings) {
        this['bindings'] = $(bindings.not(element));
      }
    }
  },

  /**
   * <p>Retrieves a translated resource for a given key.
   *
   * @param {string} key
   * @return {Object} resource associated with the key or null if none was found

   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  // TODO: non-public methods need to start with "_".  Pinged architect, who thinks this
  // method should become protected post-V1, which would imply a capital _GetResource
  getResource : function (key)
  {
    return this.option(_OJ_TRANSLATIONS_PREFIX + key);
  },

  /**
   * <p>Determines whether the component is LTR or RTL.
   *
   * <p>Component responsibilities:
   *
   * <ul>
   * <li>All components must determine directionality exclusively by calling this protected superclass method.
   *     (So that any future updates to the logic can be made in this one place.)</li>
   * <li>Components that need to know the directionality must call this method at create-time
   *     and from <code class="prettyprint">refresh()</code>, and cache the value.
   * <li>Components should not call this at other times, and should instead use the cached value.  (This avoids constant DOM
   *     queries, and avoids any future issues with component reparenting (i.e. popups) if support for directional islands is added.)</li>
   * </ul>
   *
   * <p>App responsibilities:
   *
   * <ul>
   * <li>The app specifies directionality by setting the HTML <code class="prettyprint">"dir"</code> attribute on the
   *     <code class="prettyprint">&lt;html></code> node.  When omitted, the default is <code class="prettyprint">"ltr"</code>.
   *     (Per-component directionality / directional islands are not currently supported due to inadequate CSS support.)</li>
   * <li>As with any DOM change, the app must <code class="prettyprint">refresh()</code> the component if the directionality changes dynamically.
   *   (This provides a hook for component housekeeping, and allows caching.)</li>
   * </ul>
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @return {string} the reading direction, either <code class="prettyprint">"ltr"</code> or <code class="prettyprint">"rtl"</code>
   * @default <code class="prettyprint">"ltr"</code>
   */
  _GetReadingDirection: function( )
  {
    return oj.DomUtils.getReadingDirection();
  },

  /**
   * <p>Notifies the component that its subtree has been connected to the document programmatically after the component has
   * been created.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _NotifyAttached: function()
  {
    this._propertyContext = null;
  },

  /**
   * <p>Notifies the component that its subtree has been removed from the document programmatically after the component has
   * been created.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _NotifyDetached: function()
  {
    this._propertyContext = null;
    this._removeStateClasses( this.widget() );
  },

  /**
   * <p>Notifies the component that its subtree has been made visible programmatically after the component has
   * been created.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _NotifyShown: function()
  {

  },

  /**
   * <p>Notifies the component that its subtree has been made hidden programmatically after the component has
   * been created.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   */
  _NotifyHidden: function()
  {

  },

  /**
   * <p>Determines whether this component is effectively disabled, i.e. it has its 'disabled' attribute set to true
   * or it has been disabled by its ancestor component.
   *
   * @memberof oj.baseComponent
   * @instance
   * @protected
   * @return {boolean} true if the component has been effectively disabled, false otherwise
   */
  _IsEffectivelyDisabled: function()
  {
    return (this.options['disabled'] || this._ancestorDisabled) ? true : false;
  },

  /**
   * <p>Sets the ancestor-provided disabled state on this component.
   *
   * @memberof oj.baseComponent
   * @instance
   * @private
   * @param {boolean} disabled - true if this component is being disabled by its ancestor component, false otherwise
   */
  __setAncestorComponentDisabled: function(disabled)
  {
    this._ancestorDisabled = disabled;
  },


  /**
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _getTranslationSectionLoader: function()
  {
    var sectionNames = [];

    var self = this;

    var index = 0;

    this._traverseWidgetHierarchy(
      function(proto)
      {
        // retrive translation section name for the widget and all of its ancestors

        // Since _GetTranslationsSectionName() is a protected method, we can only call it on the widget instance.
        // For superclases, we will assume that their section names can only be their full widget name

        var name = (index == 0) ? self._GetTranslationsSectionName() : proto.widgetFullName;
        index++;

        var section = oj.Translations.getComponentTranslations(name);

        if (section != null && !$.isEmptyObject(section))
        {
          sectionNames.push(name);
        }
      }
    );

    var count = sectionNames.length;

    if (count > 0)
    {
      return function()
            {
              // Optimize for the most common case where superclasses do not define translations
              if (count == 1)
              {
                return oj.Translations.getComponentTranslations(sectionNames[0]);
              }
              else
              {
                var trs = {};

                for (var i = count-1; i>=0; i--)
                {
                  $.widget.extend(trs, oj.Translations.getComponentTranslations(sectionNames[i]));
                }

                return trs;
              }
            };
    }
    return null;
  },

  /**
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _getDynamicPropertyContext: function()
  {
    if (!this._propertyContext)
    {
      var c = {};
      this._propertyContext = c;
      var element = this.element[0];
      c['containers'] = _getSpecialContainerNames(element);
      c['element'] = element;
    }
    return this._propertyContext;
  },

  /**
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _setupDefaultOptions: function(originalDefaults, constructorOptions)
  {
    var options = this.options;

    // Load component translations
    var translationLoader = this._getTranslationSectionLoader();

    var currVal = constructorOptions[_OJ_TRANSLATIONS_OPTION];

    if (translationLoader != null && (currVal === undefined || $.isPlainObject(currVal) ))
    {
      _defineDynamicProperty(this, undefined, constructorOptions[_OJ_TRANSLATIONS_OPTION],
                             options,  _OJ_TRANSLATIONS_OPTION, translationLoader);
    }


    // Load options specified with oj.Components.setDefaultOptions()
    this._loadGlobalDefaultOptions(originalDefaults, constructorOptions)

  },

  /**
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _loadGlobalDefaultOptions: function(originalDefaults, constructorOptions)
  {
    var options = this.options;

    var defaults = {};

    var widgetHierNames = [];

    // walk up the widget hierarchy
    this._traverseWidgetHierarchy(
              function(proto)
              {
                 widgetHierNames.push(proto.widgetName);
              }
    );

    var allProperties = oj.Components.getDefaultOptions();
    widgetHierNames.push('default');


    // merge properties applicable to this component
    for (var i = widgetHierNames.length-1; i>=0; i--)
    {
      var name = widgetHierNames[i];
      var props = allProperties[name];
      if (props !== undefined)
      {
        defaults = $.widget.extend(defaults, props);
      }
    }

    if ($.isEmptyObject(defaults))
    {
      return;
    }

    var self = this;

    var contextCallback = function()
    {
      return self._getDynamicPropertyContext();
    };


    for (var prop in defaults)
    {
      var val = constructorOptions[prop];

      if (val === undefined || $.isPlainObject(val))
      {
        var defaultVal = defaults[prop];

        if (defaultVal != null && defaultVal instanceof __ojDynamicGetter)
        {
          var callback = defaultVal.getCallback();
          if ($.isFunction(callback))
          {
            _defineDynamicProperty(this, originalDefaults[prop], val, options, prop, callback, contextCallback);
          }
          else
          {
            oj.Logger.error("Dynamic getter for property %s is not a function", prop);
          }
        }
        else
        {
          options[prop] = _mergeOptionLayers([originalDefaults[prop], defaultVal, val]);
        }
      }
    }
  },

  /**
   * @memberof oj.baseComponent
   * @instance
   * @private
   */
  _traverseWidgetHierarchy: function(callback)
  {
    var proto = this.constructor.prototype;
    while (proto != null && 'oj' === proto['namespace'])
    {
      callback(proto);
      proto = Object.getPrototypeOf(proto);
    }
  }
});

// Remove base component from the jQuery prototype, so it could not be created
// directly by page authors

delete $['fn'][_BASE_COMPONENT];


/**
 * <p>This method is our version of $.widget, i.e. the static initializer of a component such as ojButton.
 * It calls that method, plus does any other static init we need.
 *
 * TODO:
 * - Consider moving this method into its own file.
 * - For base param, make the type oj.baseComponent rather than Object, but need to declare that as a type first.  Review how that's done.
 *
 * @private
 * @param {string} name typically of the form "oj.ojMenu"
 * @param {Object} base NOT optional (unlike JQUI)
 * @param {Object} prototype
 * @param {boolean=} isHidden - if true, indicates that the component name should not
 * be available on jQuery prototype
 */
oj.__registerWidget = function(name, base, prototype, isHidden)
{
  $.widget( name, base, prototype );

  if (isHidden)
  {
    var globalName = name.split('.')[1];
    delete $['fn'][globalName];
  }

  // create single-OJ pseudo-selector for component, e.g. ":oj-menu", in addition to the ":oj-ojMenu" that $.widget() creates.
  // for private components it will begin with an underscore, e.g.,  ":_oj-radio"
  if (name.substring(0, 5) === "oj.oj" || name.substring(0, 6) === "oj._oj")
  {
    var nameArray = name.split( "." ); // ["oj", "ojMenu"], ["oj", "_ojRadio"]
    var namespace = nameArray[ 0 ];    // "oj"
    var simpleName = nameArray [ 1 ];  // "ojMenu", "_ojRadio"
    var fullName = namespace + "-" + simpleName; // "oj-ojMenu", "oj-_ojRadio"
    var isPrivate = simpleName.substring(0, 1) === "_";
    // if private, make the single-oj pseudo-selector start with an underscore, like this -> "_oj-radio"
    var modifiedFullName; // "oj-Menu", "_oj-Radio".  Lowercased below.
    if (isPrivate)
    {
      modifiedFullName = "_" + namespace + "-" + simpleName.substring(3);
    }
    else
    {
      modifiedFullName = namespace + "-" + simpleName.substring(2);
    }

    // Capitalization doesn't seem to matter with JQ pseudos, e.g. for the existing double-oj pseudo, both $(":oj-ojMenu") and $(":oj-ojmenu") work.
    // So, follow JQUI's pattern of using toLowerCase here, which will lowercase not only the "M' in "Menu", but also any camelcased chars after that.
    $.expr[ ":" ][ modifiedFullName.toLowerCase() ] = function( elem ) {
      return !!$.data( elem, fullName );
    };
  }
};



/**
 * @param {Object} self
 * @param {Object|undefined} originalDefaultValue
 * @param {?Object} constructorValue
 * @param {!Object} options
 * @param {string} prop
 * @param {Function} getter
 * @param {Function=} contextCallback
 * @private
 */
 function _defineDynamicProperty(self, originalDefaultValue, constructorValue, options, prop, getter, contextCallback)
 {
   var override = constructorValue;
   var replaced = false;
   var overriddenSubkeys = {};

   delete options[prop];

   Object.defineProperty(options, prop,
     {
       'get': function()
              {
                // Once the option is replaced, we no longer merge in defaults
                if (replaced)
                {
                  return override;
                }

                if (self._settingNestedKey != null)
                {
                  // The getter is getting called from the option() method that will be mutating the current
                  // object. We need to return only the override portion in this case to avoid the defaults being
                  // reapplied as an override

                  return override;

                }

                var defaultVal = getter(contextCallback? contextCallback() : prop);

                return _mergeOptionLayers([originalDefaultValue, defaultVal, override], overriddenSubkeys)
              },
       'set': function(value)
              {
                override = value;

                if (self._settingNestedKey != null)
                {
                  overriddenSubkeys[self._settingNestedKey] = true;
                }
                else // The entire option has been replaced
                {
                  replaced = true;
                }
              },
       'enumerable' : true
     }
   );
 };

 /**
  * @private
  */
 function _getSpecialContainerNames(elem)
 {
    var containers = [];
    while (elem)
    {
      var ga =  elem.getAttribute;
      var name = ga ? ga.call(elem, oj.Components._OJ_CONTAINER_ATTR) : null;
      if (name != null)
      {
        containers.push(name);
      }
      elem = elem.parentNode;
    }

    return containers;
 };

 /**
  * @private
  */
 function _storeWidgetName(element, widgetName)
 {
   var data = element.data(_OJ_WIDGET_NAMES_DATA);
   if (!data)
   {
     data = [];
     element.data(_OJ_WIDGET_NAMES_DATA, data);
   }
   if (data.indexOf(widgetName) < 0)
   {
     data.push(widgetName);
   }
 }

 /**
  * @private
  */
 function _removeWidgetName(element, widgetName)
 {
   var data = element.data(_OJ_WIDGET_NAMES_DATA);
   if (data)
   {
     var index = data.indexOf(widgetName);
     if (index >= 0)
     {
       data.splice(index, 1);
       if (data.length === 0)
       {
         element.removeData(_OJ_WIDGET_NAMES_DATA);
       }
     }
   }
 }

 /**
  * @private
  * @param {Array} values - values to merge
  * @param {Object=} overriddenSubkeys subkeys where the merging should not occur, i.e.
  * the value from corresponsing subkey on the last element of values array should win
  */
 function _mergeOptionLayers(values, overriddenSubkeys)
 {
   var result = undefined;
   for (var i=0; i<values.length; i++)
   {
      var value = values[i];
      if (value !== undefined )
      {
        if ($.isPlainObject(value))
        {
          var input =  $.isPlainObject(result) ? [result, value] : [value];
          // The last object (overrides) is always fully merged in
          result = _mergeObjectsWithExclusions({}, input, (i == values.length - 1)? null: overriddenSubkeys, null);
        }
        else
        {
          result = value;
        }
      }
    }
    return result;
 }

 /**
 * @private
 */
function _mergeObjectsWithExclusions(target, input, ignoreSubkeys, basePath)
{
  var inputLength = input.length;

  for (var inputIndex = 0; inputIndex < inputLength; inputIndex++)
  {
    var source = input[inputIndex];
    var keys = Object.keys(source);
    for (var i=0; i<keys.length; i++)
    {
      var key = keys[i];
      var path = (ignoreSubkeys == null)? null:  (basePath == null ? key : basePath + '.' + key);
      // Ignore all sources when the current path is registered in ignoreSubkeys
      if (ignoreSubkeys == null || !ignoreSubkeys[path])
      {
        var value = source[key];
        if (value !== undefined)
        {
          if ($.isPlainObject(value))
          {
            var params = $.isPlainObject(target[key])? [target[key], value]: [value];
            target[key] = _mergeObjectsWithExclusions({}, params, ignoreSubkeys, path);
          }
          else
          {
            target[key] = value;
          }
        }
      }
    }
  }
  return target;
}


 /**
  * @private
  */
  var _OJ_TRANSLATIONS_OPTION = "translations";

  /**
   * @private
   */
  var _OJ_TRANSLATIONS_PREFIX = _OJ_TRANSLATIONS_OPTION + ".";


  /**
   * @private
   */
  function _returnTrue()
  {
    return true;
  };


  /**
   * @private
   */
  var _OJ_COMPONENT_EVENT_OVERRIDES =
  {
    preventDefault : function ()
    {
      this.isDefaultPrevented = _returnTrue;
    },
    stopPropagation : function ()
    {
      this.isPropagationStopped = _returnTrue;
    },
    stopImmediatePropagation : function ()
    {
      this.isImmediatePropagationStopped = _returnTrue;
    }
  };

/**
 * Returns an object with context for the given child DOM node. This will always contain the subid for the node,
 * defined as the 'subId' property on the context object. Additional component specific information may also be included.
 *
 * For more details on returned objects, see <a href="#contextobjects-section">context objects</a>.
 *
 * @ojfragment nodeContextDoc
 * @memberof oj.baseComponent
 */

/**
 * The child DOM node
 *
 * @ojfragment nodeContextParam
 * @memberof oj.baseComponent
 */

/**
 * The context for the DOM node, or <code class="prettyprint">null</code> when none is found.
 *
 * @ojfragment nodeContextReturn
 * @memberof oj.baseComponent
 */

/**
 * // Foo is ojInputNumber, ojInputDate, etc.
 * // Returns {'subId': oj-foo-subid, 'property1': componentSpecificProperty, ...}
 * var context = $( ".selector" ).ojFoo( "getContextByNode", nodeInsideComponent );
 *
 * @ojfragment nodeContextExample
 * @memberof oj.baseComponent
 */
/*jslint browser: true*/
/**
 * in some OS/browser combinations you can attempt to detect high contrast mode
 * in javascript, go to the url below and look for "High Contrast"
 * http://www.w3.org/TR/wai-aria-practices/
 * 
 * This function uses a variation of the code in the "High Contrast" section of  
 * the site above to try and detect high contrast mode
 * by script, but it by no means definitively tells you whether or not you
 * are actually in high contrast mode. As discussed at the url above you 
 * may need to have a user preference setting for high contrast.
 * 
 * If the script is able to detect high contrast mode it sets the class 
 * "oj-hicontrast" on the body tag. When "oj-high-contrast" is present 
 * JET provides alternate informational images that are specially designed 
 * for high contrast users. 
 * @private
 */
function _ojHighContrast()
{
  // using a data uri, I googled for shortest uri to get this one since 
  // I don't care about the actual image, but I do want a legit image
  // otherwise I see an error in chrome and I don't want users to be
  // confused by seeing any error.

  var div = $("<div style='border: 1px solid;border-color:red green;position: absolute;top: -999px;background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=);'></div>"), bki;
  div.appendTo("body");

  bki = div.css("backgroundImage");
  //console.log("background-image:" + bki);
  //console.log("borderTopColor == borderRightColor: ", div.css("borderTopColor") == div.css("borderRightColor"));
  if (div.css("borderTopColor") == div.css("borderRightColor") ||
      (bki != null && (bki == 'none' || bki == 'url (invalid-url:)')))
  {
    $('body').addClass("oj-hicontrast");
  }

  div.remove();
}

$(document).ready(function() {
  _ojHighContrast();
});
/*jslint browser: true*/
/**
 * @private
 */
function _ojSlowCSS()
{
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    $('html').addClass("oj-slow-borderradius oj-slow-cssgradients oj-slow-boxshadow");

  }

}

$(document).ready(function() {
  _ojSlowCSS();
});
/*jslint browser: true*/
/*
** Copyright (c) 2004, 2012, Oracle and/or its affiliates. All rights reserved.
*/
/**
 * DOM utilities.
 * @ignore
 */
oj.DomUtils = {};

oj.DomUtils._HTML_START_TAG = "\x3chtml\x3e";
oj.DomUtils._HTML_END_TAG = "\x3c/html\x3e";
oj.DomUtils._LEGAL_ELEMENTS = {"SPAN":1, "B":1, "I":1, "EM":1, "BR":1, "HR":1, "LI":1, "OL":1, "UL":1, "P":1, "TT":1, "BIG":1, "SMALL":1, "PRE":1};
oj.DomUtils._LEGAL_ATTRIBUTES = {"class":1, "style":1};

/**
 * Returns true if the value is null or if the trimmed value is of zero length.
 *
 * @param {string|null} content
 * @return {boolean} true if the string is wrapped in <html> tag.
 */
oj.DomUtils.isHTMLContent = function(content)
{
  if (content.indexOf(oj.DomUtils._HTML_START_TAG) === 0 &&
      content.lastIndexOf(oj.DomUtils._HTML_END_TAG) === content.length - 7)
  {
    return true;
  }

  return false;
};

oj.DomUtils.cleanHtml = function (value)
{
  var offSpan = $(document.createElement("span")).get(0);
  offSpan.innerHTML = value;
  if (value && value.indexOf("\x3c") >= 0)
  {
    oj.DomUtils._cleanElementHtml(offSpan);
  }
  return offSpan;
};

oj.DomUtils._cleanElementHtml = function(node)
{
  var children = node.childNodes, child, attrs, attr, childHasAttr, i;
  var count = children.length - 1;
  while (count >= 0)
  {
    child = children.item(count);
    if (child && child.nodeType === 1)
    {
      if (oj.DomUtils._LEGAL_ELEMENTS[child.nodeName])
      {
        attrs = child.attributes;
        for (i = attrs.length - 1;i >= 0;i--)
        {
          attr = attrs[i];
          // jquery - the .attr() method returns undefined for attributes that have not been set.
          childHasAttr = $(child).attr(attr.name) !== undefined;
          if (childHasAttr)
          {
            if (!oj.DomUtils._LEGAL_ATTRIBUTES[attr.name])
            {
              child.removeAttribute(attr.nodeName);
            }
          }
        }
        oj.DomUtils._cleanElementHtml(child);
      }
      else
      {
        if (child)
        {
          node.removeChild(child);
        }
      }
    }

    count--;
  }
};

/**
 * Checks to see if the "ancestorNode" is a ancestor of "node".
 *
 * @param {!Element} ancestorNode dom subtree to check to see if the target node exists
 * @param {!Element} node target node to check to see if it exists within a subtree rooted at the ancestorNode
 * @return {boolean} <code>true</code> if the "ancestorNode" is a ancestor of "node".
 */
oj.DomUtils.isAncestor = function (ancestorNode, node)
{
  // These can cause problems in IE11: sometimes the node is just an "empty" object
  //oj.Assert.assertDomElement(ancestorNode);
  //oj.Assert.assertDomElement(node);

  var parentNode = node.parentNode;

  while (parentNode)
  {
    if (parentNode == ancestorNode)
      return true;

    parentNode = parentNode.parentNode;
  }

  return false;
}

/**
 * Checks to see if the "ancestorNode" is a ancestor of "node" or if they are the same.
 *
 * @param {!Element} ancestorNode dom subtree to check to see if the target node exists
 * @param {!Element} node target node to check to see if it exists within a subtree rooted at the ancestorNode
 * @return {boolean} <code>true</code> if the "ancestorNode" is a ancestor of "node" or if they are the same
 */
oj.DomUtils.isAncestorOrSelf = function (ancestorNode, node)
{
  // These can cause problems in IE11: sometimes the node is just an "empty" object
  //oj.Assert.assertDomElement(ancestorNode);
  //oj.Assert.assertDomElement(node);

  return (node == ancestorNode) ?
          true :
          oj.DomUtils.isAncestor(ancestorNode, node);
};


/**
 * Adds a resize listener for a block or inline-block element
 * @param {!Element} elem - node where the listener should be added
 * @param {!Function} listener - listener to be added. The listener will receive
 * two parameters: 1) the new width in pixels; 2) the new height in pixels
 * @param {number=} collapseEventTimeout - timeout in milliseconds for collapsing
 * multiple resize events into one
 */
oj.DomUtils.addResizeListener = function(elem, listener, collapseEventTimeout)
{
  var jelem = $(elem);
  var tracker = jelem.data(oj.DomUtils._RESIZE_TRACKER_KEY);
  if (tracker == null)
  {
    tracker = new oj.DomUtils._ResizeTracker(elem);
    jelem.data(oj.DomUtils._RESIZE_TRACKER_KEY, tracker);
    tracker.start();
  }
  tracker.addListener(listener, collapseEventTimeout);
}

/**
 * Removes a resize listener
 * @param {!Element} elem - node whose listener should be removed
 * @param {!Function} listener - listener to be removed
 */
oj.DomUtils.removeResizeListener = function(elem, listener)
{
  var jelem = $(elem);
  var tracker = jelem.data(oj.DomUtils._RESIZE_TRACKER_KEY);
  if (tracker != null)
  {
    tracker.removeListener(listener);
    if (tracker.isEmpty())
    {
      tracker.stop();
      jelem.removeData(oj.DomUtils._RESIZE_TRACKER_KEY);
    }
  }
};


/**
 * Fixes resize listeners after a subtree has been connected to the DOM or after
 * its display:none stayle has been removed
 * @param {!Element} subtreeRoot - subtree root
 */
oj.DomUtils.fixResizeListeners = function(subtreeRoot)
{
  $(subtreeRoot).find(".oj-helper-detect-expansion").parent().each(
    function(index, div)
    {
      var tracker = $(div).data(oj.DomUtils._RESIZE_TRACKER_KEY);
      if (tracker != null)
      {
        tracker.init(true);
      }
    }
  );
};

/**
 * Determines whether a special 'meta' key was pressed when the event was fired.
 * For Mac OS, the 'meta' key is mapped to the 'Command' key, for all other platforms it is mapped
 * to the 'Control' key.
 * Note that this method will only work for the events that support .ctrlKey and .metaKey fields.
 * @param {!Object} evt - the event
 * @return true if the meta key is pressed, false otherwise
 */
oj.DomUtils.isMetaKeyPressed = function(evt)
{
  var agentInfo = oj.AgentUtils.getAgentInfo();
  return (oj.AgentUtils.OS.MAC === agentInfo["os"] ? evt.metaKey : evt.ctrlKey);
};

/**
 * @private
 */
oj.DomUtils._invokeAfterPaint =  (window['requestAnimationFrame'] || window['mozRequestAnimationFrame'] ||
                                  window['webkitRequestAnimationFrame'] ||
                                  function(fn){ return window.setTimeout(fn, 0); }
                                  ).bind(window);

/**
 * @private
 */
oj.DomUtils._cancelInvokeAfterPaint =  (window['cancelAnimationFrame'] || window['mozCancelAnimationFrame'] ||
                                  window['webkitCancelAnimationFrame'] ||
                                  function(id){ return window.clearTimeout(id); }
                                  ).bind(window);

/**
 * Utility class for tracking resize events for a given element and  sispatching them
 * to listeners
 * @constructor
 * @ignore
 */
oj.DomUtils._ResizeTracker = function(div)
{
  var _listeners = $.Callbacks();
  var _collapsingManagers = [];
  var _collapsingListeners = [];

  var _RETRY_MAX_COUNT = 2;
  var _retrySetScroll = 0;
  var _invokeId = null;
  var _oldWidth  = null;
  var _oldHeight = null;
  var _detectExpansion = null;
  var _detectContraction = null;
  var _resizeListener = null;
  var _scrollListener = null;

  this.addListener = function(listener, collapseEventTimeout)
  {
    if (collapseEventTimeout === undefined || collapseEventTimeout === 0)
    {
      _listeners.add(listener);
    }
    else
    {
      _collapsingManagers.push(
              new oj.DomUtils._collapsingListenerManager(listener, collapseEventTimeout));
      _collapsingListeners.push(listener);
    }
  };

  this.removeListener = function(listener)
  {
    var index = _collapsingListeners.indexOf(listener);
    if (index >=0 )
    {
      _collapsingListeners.splice(index, 1);
      var removed = _collapsingManagers.splice(index, 1);
      removed[0].stop();
    }
    else
    {
      _listeners.remove(listener);
    }
  };

  this.isEmpty = function()
  {
    return !_listeners.has() && _collapsingListeners.length == 0;
  };

  this.start = function()
  {
    _scrollListener = _handleScroll.bind(this);

    // : Use native onresize support on teh DIV in IE9/10 and  since no scroll events are fired on the
    // contraction/expansion DIVs in IE9
    if (div.attachEvent)
    {
      _resizeListener = _handleResize.bind(this);
      div.attachEvent('onresize', _resizeListener);
    }

    else
    {
      var firstChild = div.childNodes[0];

      // This child DIV will track expansion events. It is meant to be 1px taller and wider than the DIV
      // whose resize events we are tracking. After we set its scrollTop and scrollLeft to 1, any increate in size
      // will fire a scroll event
      _detectExpansion = document.createElement("div");
      _detectExpansion.className = "oj-helper-detect-expansion";
      var expansionChild = document.createElement("div");
      _detectExpansion.appendChild(expansionChild);
      if (firstChild != null)
      {
        div.insertBefore(_detectExpansion, firstChild);
      }
      else
      {
        div.appendChild(_detectExpansion);
      }

      _detectExpansion.addEventListener("scroll", _scrollListener, false);

      // This child DIV will track contraction events. Its height and width are set to 200%. After we set its scrollTop and
      // scrollLeft to the current height and width of its parent, any decrease in size will fire a scroll event
      _detectContraction = document.createElement("div");
      _detectContraction.className = "oj-helper-detect-contraction";

      var contractionChild = document.createElement("div");
      contractionChild.style.width = "200%";
      contractionChild.style.height = "200%";
      _detectContraction.appendChild(contractionChild);
      div.insertBefore(_detectContraction, _detectExpansion);

      _detectContraction.addEventListener("scroll", _scrollListener, false);

      this.init(false);
      }
  };

  this.stop = function()
  {
    if (_invokeId != null)
    {
      oj.DomUtils._cancelInvokeAfterPaint(_invokeId);
      _invokeId = null;
    }
    if (_detectExpansion != null)
    {
      _detectExpansion.removeEventListener("scroll", _scrollListener);
      _detectContraction.removeEventListener("scroll", _scrollListener);
      div.removeChild(_detectExpansion);
      div.removeChild(_detectContraction);
    }
    else
    {
      // assume IE9/10
      div.detachEvent('onresize', _resizeListener);
    }
  };

  this.init = function(isFixup)
  {
    var adjusted = _checkSize(isFixup);
    if (isFixup && !adjusted && _detectExpansion.offsetParent != null)
    {
      _adjust(_oldWidth, _oldHeight);
    }
  };


  function _checkSize(fireEvent)
    {
    var adjusted = false;
    if (_detectExpansion.offsetParent != null)
    {
      var newWidth = _detectExpansion.offsetWidth;
      var newHeight = _detectExpansion.offsetHeight;

      if (_oldWidth !== newWidth || _oldHeight !== newHeight)
    {
        _retrySetScroll = _RETRY_MAX_COUNT;
        _adjust(newWidth, newHeight);
        adjusted = true;

        if (fireEvent)
      {
          _notifyListeners(true);
      }
      }
    }

    return adjusted;
  };

  function _notifyListeners(useAfterPaint)
  {
    var newWidth = div.offsetWidth;
    var newHeight = div.offsetHeight;
    if (_listeners.has())
    {
      if (!useAfterPaint)
      {
        _listeners.fire(newWidth, newHeight);
    }
      else
    {
        if (_invokeId !== null)
      {
          oj.DomUtils._cancelInvokeAfterPaint(_invokeId);
      }

        _invokeId = oj.DomUtils._invokeAfterPaint(
        function()
        {
            _invokeId = null;
            _listeners.fire(newWidth, newHeight);
        }
      );
    }
    }

    for (var i=0; i < _collapsingManagers.length; i++)
    {
      _collapsingManagers[i].getCallback()(newWidth, newHeight);
    }
  };

  function _handleScroll(evt)
  {
    evt.stopPropagation();
    if (!_checkSize(true))
    {
      // Workaround for the WebKit issue where scrollLeft gets reset to 0 without the DIV being expanded
      // We will retry to the set the scrollTop only twice to avoid infinite loops
      if (_retrySetScroll > 0 && _detectExpansion.offsetParent != null &&
            (_detectExpansion.scrollLeft == 0 || _detectExpansion.scrollTop == 0))
      {
        _retrySetScroll--;
        _adjust(_oldWidth, _oldHeight);
      }
    }
  };

  function _handleResize()
  {
     _notifyListeners(false);
  };

  function _adjust(width, height)
  {
    _oldWidth = width;
    _oldHeight = height;

    var expansionChildStyle = _detectExpansion.firstChild.style;

    var delta = 1;

    // The following loop is a workaround for the WebKit issue with zoom < 100% -
    // the scrollTop/Left gets reset to 0 because it gets computed to a value less than 1px.
    // We will try up to the delta of 5 to support scaling down to 20% of the original size
    do
    {
      expansionChildStyle.width = width + delta + 'px';
      expansionChildStyle.height = height + delta + 'px';
      _detectExpansion.scrollLeft = _detectExpansion.scrollTop = delta;
      delta++;
    } while ((_detectExpansion.scrollTop == 0 || _detectExpansion.scrollLeft == 0) && delta <= 5);


    _detectContraction.scrollLeft = width;
    _detectContraction.scrollTop = height;
  };
}

oj.DomUtils._RESIZE_TRACKER_KEY = "_ojResizeTracker";


/**
 * Returns true if the name is a valid identifier
 *
 * @param {string} name
 * @return {boolean} true if the name is a valid identifier
 */
oj.DomUtils.isValidIdentifier = function (name)
{
  return /^[A-Za-z][0-9A-Z_a-z-]*$/.test(name);
};


/**
 * @constructor
 * @ignore
 */

oj.DomUtils._collapsingListenerManager = function(originalCallback, timeout)
{
  var _lastArgs = null;
  var _timerId = null;

  var _timerCallback = function()
  {
    originalCallback.apply(null, _lastArgs);
    _timerId = null;
  };

  var _callback = function()
  {
    _lastArgs = Array.prototype.slice.call(arguments);
    if (_timerId == null)
    {
      _timerId = window.setTimeout(_timerCallback, timeout);
    }
  };

  this.getCallback = function()
  {
    return _callback;
  };

  this.stop = function()
  {
    if (_timerId != null)
    {
      window.clearTimeout(_timerId);
      _timerId = null;
    }
  }

};

/**
 * @return {boolean} true if touch is supported
 */
oj.DomUtils.isTouchSupported = function ()
{
  return ('ontouchstart' in window) // C, FF, Safari, Edge
    || (navigator.msMaxTouchPoints > 0) // IE10
    || (navigator.maxTouchPoints > 0);  // IE11
};

/**
 * @ignore
 */
oj.DomUtils.setInKoRemoveNode = function(node)
{
  oj.DomUtils._koRemoveNode = node;
};

/**
 * Delegates to JQuery's unwrap() if the component's node is not currently
 * being removed by Knockout
 * @param {Object} locator
 * @param {Object=} replaceLocator - locator to be replaced. I fthis parameter is ommitted,
 * the parent node will be replaced
 * @ignore
 */
oj.DomUtils.unwrap = function(locator, replaceLocator)
{
  var koRemoveNode = oj.DomUtils._koRemoveNode;
  if (!(koRemoveNode && koRemoveNode == locator.parent().get(0)))
  {
    if (arguments.length > 1)
    {
      replaceLocator.replaceWith(locator);
    }
    else
    {
      locator.unwrap();
    }
  }
};

/**
 * Determines if the mouse event target is on browser chrome - i.e. "scrollbar".
 * If the event is not a mouse event with a clientX and clientY, the resultant will
 * be false.
 *
 * @param {Event} event native dom event
 * @returns {boolean} <code>true</code> if the target of the mouse event is browser
 *          chrome such as scrollbars.
 * @public
 */
oj.DomUtils.isChromeEvent = function(event)
{

  /**
   * @param {Event} event
   * @return {boolean}
   */
  function _isChromeEventGecko(event) {
    // assume that if we can't access the original target of the event, then it's because
    // the target was implemented in XUL and is part of the chrome;
    try
    {
      return event.originalTarget.localName ? false : true;
    }
    catch (e)
    {
      return true;
    }
  };

  /**
   * @param {Event} event
   * @return {boolean}
   */
  function _isChromeEventIE(event)
  {
    /*
      //IE has a specific API for this but doesn't seem to want to work in automation.
      //The webkit method works in IE too.  Using that over componentFromPoint but leaving
      //the code for future reference.
      //
      var target = event.target;
      var chromePart = target.componentFromPoint(event.clientX, event.clientY);
      if (oj.StringUtils.isEmpty(chromePart))
        return false;
      else
        return true;
    */
    return _isChromeEventWebkit(event);
  };

  /**
   * @param {Event} event
   * @return {boolean}
   */
  function _isChromeEventWebkit(event)
  {
    var domTarget = event.target;
    var target = $(domTarget);


    var pos = domTarget.getBoundingClientRect();
    var sbw = oj.DomUtils.getScrollBarWidth();
    var isLTR = oj.DomUtils.getReadingDirection() === "ltr";
    if (isLTR && (("HTML" === domTarget.nodeName || "visible" !== target.css("overflow-x")) && event.clientX > (pos["right"] - sbw)))
      return true; // ltr scrollbar is always on the right
    else if (!isLTR && "HTML" === domTarget.nodeName  && event.clientX > (pos["left"] - sbw))
      return true; // RTL scrollbar on the document is still on the right
    else if (!isLTR && "visible" !== target.css("overflow-x") && event.clientX < (pos["left"] + sbw))
      return true; // RTL scrollbar not on the document is on the left
    else if (("HTML" === domTarget.nodeName || "visible" !== target.css("overflow-y")) && event.clientY > (pos["bottom"] - sbw))
      return true; // below the scrollbar
    else
      return false;
  };

  // verify event is a mouse event
  if (!('clientX' in event) || !("clientY" in event))
    return false;

  var agentInfo = oj.AgentUtils.getAgentInfo();

  if (oj.AgentUtils.OS.ANDROID === agentInfo["os"] || oj.AgentUtils.OS.IOS === agentInfo["os"])
    return false;

  if (oj.AgentUtils.ENGINE.GECKO === agentInfo["engine"])
    return _isChromeEventGecko(event);
  else if (oj.AgentUtils.ENGINE.WEBKIT === agentInfo["engine"])
    return _isChromeEventWebkit(event);
  if (oj.AgentUtils.BROWSER.IE === agentInfo["browser"])
    return _isChromeEventIE(event);
  else
    return false;
};

/**
 * @returns {number} width of the browser scrollbar
 */
oj.DomUtils.getScrollBarWidth = function()
{
  var scrollBarWidth = oj.DomUtils._scrollBarWidth;
  if ($.isNumeric(scrollBarWidth))
    return scrollBarWidth;

  /** @type {jQuery} **/
  var scrollBarMeasure = $("<div />");
  $(document.body).append(scrollBarMeasure);
  scrollBarMeasure.width(50).height(50)
    .css({
            'overflow': 'scroll',
            'visibility': 'hidden',
            'position': 'absolute'
        });

  /** @type {jQuery} **/
  var scrollBarMeasureContent = $("<div />");
  scrollBarMeasureContent.height(1);
  scrollBarMeasure.append(scrollBarMeasureContent);

  var insideWidth = scrollBarMeasureContent.width();
  var outsideWitdh = scrollBarMeasure.width();
  scrollBarMeasure.remove();

  scrollBarWidth = oj.DomUtils._scrollBarWidth = outsideWitdh - insideWidth;
  return scrollBarWidth;
};

/**
 * @returns {string!} "rtl" or "ltr"
 */
oj.DomUtils.getReadingDirection = function()
{
  var dir = document.documentElement.getAttribute("dir");
  if (dir)
    dir = dir.toLowerCase();
  return (dir === "rtl") ? "rtl" : "ltr";
};

/**
 * Converts a CSS length attribute into a integer value.
 * Conversion errors or non-number will result in a zero
 * resultant.
 *
 * @param {?} cssLength style attribute
 * @return {number} value as integer
 */
oj.DomUtils.getCSSLengthAsInt = function(cssLength)
{
  if (!isNaN(cssLength))
    return cssLength;

  if (cssLength && cssLength.length > 0 && cssLength != "auto")
  {
    var intLength = parseInt(cssLength, 10);

    if (isNaN(intLength))
      intLength = 0;

    return intLength;
  }
  else
  {
    return 0;
  }
};

/**
 * Converts a CSS attribute into a float value.
 * Conversion errors or non-number will result in a zero
 * resultant.
 *
 * @param {?} cssLength style attribute
 * @return {number} value as integer
 */
oj.DomUtils.getCSSLengthAsFloat = function(cssLength)
{
  if (!isNaN(cssLength))
    return cssLength;

  if (cssLength && cssLength.length > 0)
  {
    var floatLength = parseFloat(cssLength);

    if (isNaN(floatLength))
      floatLength = 0;

    return floatLength;
  }
  else
  {
    return 0;
  }
};

/**
 * Returns <code>true</code> if the jquery element is visible within overflow
 * areas. The check only considers statically positioned elements.  The first positioned
 * ancestor is treated as the root viewport. Positioned elements would need to be
 * compared with the window viewport versus its ancestors.  Visibility of positioned
 * elements would also need to compare the stacking context of the document to determine
 * what is visible.
 *
 * The second argument extends the check to the browser viewport.  The second argument
 * is not enabled by default as it plays havic qunit tests that position the "qunit-fixture"
 * off screen. This is also another reason for not trying to consider positioned elements.
 *
 * @param {jQuery} element jquery element to test
 * @param {boolean=} checkBrowserViewport if <code>true</code> the check will include the
 *                   browser viewport.
 * @returns {boolean}
 */
oj.DomUtils.isWithinViewport = function(element, checkBrowserViewport)
{

  function isVisible(alignBox, containerBox)
  {
    // 1px fudge factor for rounding errors
    if ((alignBox["bottom"] - containerBox["top"]) < -1)
      return false;

    var scrollBarWidth = (containerBox["overflowY"] === "auto" || containerBox["overflowY"] === "scroll") ?
                          oj.DomUtils.getScrollBarWidth() : 0;
    if ((containerBox["bottom"] - scrollBarWidth) - alignBox["top"] < 1)
      return false;

    scrollBarWidth = ((containerBox["overflowX"] === "auto" || containerBox["overflowX"] === "scroll") &&
                       oj.DomUtils.getReadingDirection() === "rtl") ? oj.DomUtils.getScrollBarWidth() : 0;
    if ((alignBox["right"] - (containerBox["left"] + scrollBarWidth)) < -1)
      return false;

    scrollBarWidth = ((containerBox["overflowX"] === "auto" || containerBox["overflowX"] === "scroll") &&
                       oj.DomUtils.getReadingDirection() === "ltr") ? oj.DomUtils.getScrollBarWidth() : 0;
    if ((alignBox["left"] - (containerBox["right"] - scrollBarWidth)) > -1)
      return false;

    return true;
  };

  function hasOverflow(element)
  {
    return "visible" !== element.css("overflow-x") ||
           "visible" !== element.css("overflow-y");
  };

  function getRect(element)
  {
    var domElement = element[0];
    if (domElement.nodeType === 1)
    {
      var rec = domElement.getBoundingClientRect();
      rec["overflowX"] = element.css("overflow-x");
      rec["overflowY"] = element.css("overflow-y");
      return rec;
    }
    else if ($.isWindow(domElement))
    {
      var rec =
        {
          'width': domElement['innerWidth'],
			    'height': domElement['innerHeight'],
          'top': 0,
          'bottom': domElement['innerHeight'],
          'left': 0,
          'right': domElement['innerWidth']
        };
      return rec;
    }
    return {'height': 0, 'width': 0};
  };

  function isPositioned(element)
  {
    return ["fixed", "absolute", "relative"].indexOf(element.css("position")) > -1 &&
           (Math.abs(oj.DomUtils.getCSSLengthAsInt(element.css("top"))) > 0 ||
            Math.abs(oj.DomUtils.getCSSLengthAsInt(element.css("bottom"))) > 0 ||
            Math.abs(oj.DomUtils.getCSSLengthAsInt(element.css("left"))) > 0 ||
            Math.abs(oj.DomUtils.getCSSLengthAsInt(element.css("right"))) > 0);
  };

  if (!element)
    return false;

  var alignBox = getRect(element);

  // is the element visible in the browser viewport.
  if (checkBrowserViewport && !isVisible(alignBox, getRect($(window))))
    return false;

  // check that the element is not hidden in overflow
  var isWithinViewPort = true;
  var parent = element.parent();
  while (isWithinViewPort && parent && parent.length > 0 && parent[0].nodeType === 1 && !isPositioned(parent))
  {
    if (hasOverflow(parent))
    {
      var parentBox = getRect(parent);
      // ignore elements with empty border-boxes
      if (parentBox['height'] > 0 && parentBox['width'] > 0)
      {
        isWithinViewPort = isVisible(alignBox, parentBox);
      }
    }
    parent = parent.parent();
  }

  return isWithinViewPort;
};

/**
 * Key used to store the logical parent of the popup element
 * as a jQuery data property. The logical parent refers the launcher of a popup.
 * @const
 * @private
 * @type {string}
 */
oj.DomUtils._LOGICAL_PARENT_DATA = "oj-logical-parent";

/**
 * This method returns the launcher of a popup when it's open.
 * Returns undefined otherwise.
 *
 * @param {jQuery} element jquery element
 * @returns {*}
 * @see #setLogicalParent
 */
oj.DomUtils.getLogicalParent = function(element)
{
  if (element)
    return element.data(oj.DomUtils._LOGICAL_PARENT_DATA);

  return undefined;
};

/**
 * Set the logical parent as a jQuery data property
 *
 * @param {jQuery} element jquery element
 * @param {jQuery | null} parent jquery element
 * @see #getLogicalParent
 */
oj.DomUtils.setLogicalParent = function(element, parent)
{
  if (! element)
    return;

  if (parent === null)
    element.removeData(oj.DomUtils._LOGICAL_PARENT_DATA);
  else
    element.data(oj.DomUtils._LOGICAL_PARENT_DATA, parent);
};

/**
 * Checks to see if the "ancestorNode" is a logical ancestor of "node"
 *
 * @param {!Element} ancestorNode dom subtree to check to see if the target node exists
 * @param {!Element} node target node to check to see if it exists within a subtree rooted at the ancestorNode
 * @return {boolean} <code>true</code> if the "ancestorNode" is a logical ancestor of "node" or if they are the same
 */
oj.DomUtils.isLogicalAncestorOrSelf = function (ancestorNode, node)
{
  oj.Assert.assertDomElement(ancestorNode);
  oj.Assert.assertDomElement(node);

  var parentNode = node;
  while (parentNode)
  {
    if (parentNode == ancestorNode)
      return true;

    var logicalParent = oj.DomUtils.getLogicalParent($(parentNode));
    if (logicalParent)
      parentNode = logicalParent[0];
    else
      parentNode = parentNode.parentNode;
  }

  return false;

};


/**
 * Checks whether the href represents a safe URL
 * @param {!string} href - HREF to test
 * @param {Array=} whitelist - optional list of the allowed protocols. Protocol name has to use lowercase latters and
 * be followed by a ':'. If the parameter is ommitted, ['http:', 'https:'] will be used
 * @throws {Exception} an error if the HREF represents an invalid URL
 * @ignore
 */
oj.DomUtils.validateURL = function(href, whitelist)
{
  var allowed = whitelist || ['http:', 'https:'];

  var link = document.createElement('a');
  link.href = href;

  var protocol = link.protocol;
  if (protocol != null)
  {
    protocol = protocol.toLowerCase();
  }

  if (allowed.indexOf(protocol) < 0)
  {
    throw protocol + " is not a valid URL protocol";
  }
}

/**
 * Cancels native context menu events for hybrid mobile applications.
 * @private
 */
oj.DomUtils._supressNativeContextMenu = function()
{
  if ($(document.body).hasClass("oj-hybrid")) {
    document.body.addEventListener('contextmenu',
      function(event) {
        event.preventDefault();
      }, true);
  }
}
oj.DomUtils._supressNativeContextMenu();

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Component Messaging Utilities.
 * @param {Object} component instance
 * @protected
 * @constructor
 * @since 0.6
 * @ignore
 */
oj.ComponentMessaging = function (component) 
{
  this.Init(component);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.ComponentMessaging, oj.Object, "oj.ComponentMessaging");

/**
 * Default display types supported for component messaging.
 * @memberof! oj.ComponentMessaging
 * @const
 * @protected
 * @ignore
 */
oj.ComponentMessaging._DISPLAY_TYPE = {
  NONE: "none",
  NOTEWINDOW: "notewindow", 
  PLACEHOLDER: "placeholder",
  INLINE: "inline"
};

/**
 * Tracks the messaging strategy callback function by type, used to instantiate messaging strategies.
 * Implementations register by type. 
 * @memberof! oj.ComponentMessaging
 * @const
 * @protected
 * @ignore
 */
oj.ComponentMessaging._DISPLAY_TYPE_TO_CALLBACK = {};
  
/**
 * Stores the constructor function callback object used to constuct a strategy object for the 
 * specified type.
 * 
 * @param {string} type
 * @param {Function} strategyConstructorCallback a constructor callback that can be used to constuct
 * a strategy object for the specified type
 * @ignore
 */
oj.ComponentMessaging.registerMessagingStrategy = function (type, strategyConstructorCallback)
{
  if (type && typeof strategyConstructorCallback === "function")
  {
    oj.ComponentMessaging._DISPLAY_TYPE_TO_CALLBACK[type] = strategyConstructorCallback;
  }
};

/**
 * Initializes the strategy based on the display options that specify the messaging artifacts that 
 * will be displayed by this strategy.
 * 
 * @param {Object} component widget instance
 * @memberof! oj.ComponentMessaging
 * @instance
 * @protected
 */
oj.ComponentMessaging.prototype.Init = function (component)
{
  oj.ComponentMessaging.superclass.Init.call(this);
  
  this._component = component;
  this._activated = false;
  
  // sets up this._strategies, which is a list of what we will display in each type of 
  // displayOption. E.g., 'inline': 'messages', 'notewindow': converterHint, validatorHint, etc.
  // See EditableValues displayOption attribute jsdoc for more details.
  this._initializeMessagingStrategies();
};

/**
 * Utility function that activates messaging on the component using the strategy provided.
 * @param {Object} launcher element(s) to which messaging applies
 * @param {Object} content 
 * @private
 */
oj.ComponentMessaging.prototype.activate = function (launcher, content)
{
  var that = this;
  oj.Assert.assertObject(content);
  this._launcher = launcher;
  
  this._messagingContent = oj.CollectionUtils.copyInto(this._messagingContent || {}, content);
  
  // if already active, reinitialize strategies based on new messagingDisplay preferences.
  if (!this._isActive())
  {
    // for each 'messaging strategy' (e.g., inline == InlineMessagingStrategy, 
    // notewindow == PopupMessagingStrategy, etc), call .activate which initializes
    // the strategy.
    $.each(this._strategies, function(i, strategy) 
    {
      strategy.activate(that);
    });
    this._activated = true;
  }
  else
  {
    this._reactivate();
  }
};

/**
 * Utility function that updates messaging on the component for the content provided, using the 
 * strategies.
 * 
 * @param {Object} content 
 * @private
 */
// TODO: component messaging could take the component instance
oj.ComponentMessaging.prototype.update = function (content)
{
  oj.Assert.assertObject(content);
  oj.Assert.assertBoolean(this._activated);
  
  this._messagingContent = oj.CollectionUtils.copyInto(this._messagingContent || {}, content);

  if (this._activated)
  {
    $.each(this._strategies, function(i, strategy) 
      {
        if (strategy.shouldUpdate(content))
          strategy.update();
      });
  }
};

/**
 * Utility function that deactivates messaging on the component using the strategy provided.
 * @private
 */
oj.ComponentMessaging.prototype.deactivate = function ()
{
  $.each(this._strategies, function(i, strategy) 
    {
      strategy.deactivate();
    });
    
  this._activated = false;
  this._component = null;
  this._launcher = null;
  this._strategies = {};
};

/**
 * Creates a messaging strategy for the specified type, initializing it with the options provided.
 * @param {string|number} type defined by oj.ComponentMessaging._DISPLAY_TYPE. For example,
 * a displayType of 'notewindow' creates a PopupComponentMessaging strategy. See 
 * registerMessagingStrategy where we register the type and the callback to call for a given type.
 * We currently have PopupMessagingStrategy, DefaultMessagingStrategy, PlaceholderMessagingStrategy,
 * and InlineComponentStrategy.
 * e.g., In PopupComponentMessaging.js:
 *  oj.ComponentMessaging.registerMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.NOTEWINDOW, 
 *                              oj.PopupMessagingStrategy
 * @param {Array|undefined} artifactsForType (e.g., 'messages', 'title', 'validatorHints')
 * 
 * @private
 * @instance
 * @memberOf !oj.ComponentMessaging
 */
oj.ComponentMessaging.prototype._createMessagingStrategy = function (type, artifactsForType)
{
  var callback = oj.ComponentMessaging._DISPLAY_TYPE_TO_CALLBACK[type] || 
          oj.ComponentMessaging._DISPLAY_TYPE_TO_CALLBACK[oj.ComponentMessaging._DISPLAY_TYPE.NONE];
  
  // dynamically instantiate the strategy objects.
  return new callback(artifactsForType);
},

/**
 * Returns the component instance or null
 * 
 * @return {Object|null} 
 * @private
 * @instance
 * @memberOf !oj.ComponentMessaging
 */
oj.ComponentMessaging.prototype._getComponent = function ()     
{
  return this._component || null;
};

/**
 * Returns the launcher jquery element. This is the element on the component to which messaging 
 * applies. 
 * 
 * @return {Object|null} null if messaging is not activated.
 * @private
 * @instance
 * @memberOf !oj.ComponentMessaging
 */
oj.ComponentMessaging.prototype._getLauncher = function ()     
{
  return this._launcher || null;
};

/**
 * Returns the last saved messagingContent object.
 * 
 * @return {Object} 
 * @private
 * @instance
 * @memberOf !oj.ComponentMessaging
 */
oj.ComponentMessaging.prototype._getMessagingContent = function ()     
{
  return this._messagingContent || {};
};

/**
 * Whether the component messaging is activated. 
 * @return {boolean}
 * @private
 */
oj.ComponentMessaging.prototype._isActive = function ()
{
  return this._activated;
};

/**
 * Returns a key/value array: displayTypes -> array of artifacts using that displayType.
 * where artifacts is 'messages', 'converterHint', 'validatorHint', 'title'; 
 * e.g., 
 * artifactsByDisplayType[oj.ComponentMessaging._DISPLAY_TYPE.NOTEWINDOW] = ['messages', 'converterHints']
 * artifactsByDisplayType[oj.ComponentMessaging._DISPLAY_TYPE.NONE] = ['validatorHints']
 * The types of messaging content for which displayOptions can be configured include 
 * messages, converterHint, validatorHint and title.
 * The displayOptions for each type is specified either as an array of strings or a string. 
 * When an array is specified the first display option takes precedence over the second and so on,
 * so we will only have ONE display type per artifact.
 */
oj.ComponentMessaging.prototype._getResolvedMessagingDisplayOptions = function ()
{
    var artifactsByDisplayType = {}, artifactDisplayTypeResolved = false, displayTypes, displayType,
      compPH = this._component.options['placeholder'], artifact, keys, key, i, j,
      messagingPreferences = this._component.options['displayOptions'] || {},
      $messagingPreferences = {}, self = this;
      
    // first resolve primary display options for each artifact.
    // E.g. at the end of this loop you should have something like this
    // {messages: 'notewindow', converterHint: 'placeholder', validatorHint: 'notewindow', title: 'none'}
    keys = Object.keys(messagingPreferences);
    for (i = 0; i < keys.length; i++)
    {
      key = keys[i];
      displayTypes = messagingPreferences[key];
      // loop over array of displayTypes preferred for artifact.
      // artifacts are 'messages', 'converterHint', 'validatorHint', 'title'
      artifactDisplayTypeResolved = false;
      artifact = key + "";
      // we take either array or string values for displayOptions.
      if (Array.isArray(displayTypes))
      {
        for (j = 0; j < displayTypes.length; j++) 
        {
          displayType = displayTypes[j];
          if (!artifactDisplayTypeResolved)
          {
            artifactDisplayTypeResolved = 
              self._resolveDisplayTypeForArtifact(artifact, displayType, compPH, $messagingPreferences);
          }
        }
      }
      else if (typeof displayTypes === "string")
      {
        if (!artifactDisplayTypeResolved)
        {
          artifactDisplayTypeResolved = 
            self._resolveDisplayTypeForArtifact(artifact, displayTypes, compPH, $messagingPreferences);
        }
      }

      // if we couldn't resolve then use "none". E.g., validationHint: ['none']
      if (!artifactDisplayTypeResolved)
      {
        $messagingPreferences[artifact] = oj.ComponentMessaging._DISPLAY_TYPE.NONE;
      }
    }
    
    // collate by displayType -> artifact. but first reset 
    $.each(oj.ComponentMessaging._DISPLAY_TYPE, function(type, name){
      artifactsByDisplayType[name] = [];
    });
    
    $.each($messagingPreferences, function(artifact, displayType)
    {
      // an artifact eventually resolves to one displayType. 
      artifactsByDisplayType[displayType].push(artifact);        
    });
    
    return artifactsByDisplayType;
},
        
oj.ComponentMessaging.prototype._resolveDisplayTypeForArtifact = function(
  artifact, 
  displayType, 
  compPH,
  $messagingPreferences)
{
  var artifactDisplayTypeResolved = false;
  switch (displayType)
  {
    // placeholder display is special in that it's only supported on 'converterHint'.
    case oj.ComponentMessaging._DISPLAY_TYPE.PLACEHOLDER :

      if (artifact === "converterHint")
      {
        // if placeholder is the first preference for converterHint, it's used under certain 
        // conditions
        // if options.placeholder is not set then use 'converterHint' as the default 
        // 'placeholder'
        // alternately if (options.placeholder), i.e., a custom placeholder is set, then 
        // ignore the placeholder displayType and use the next display type as the default 
        // for the artifact. We may have a fallback displayType in which case we use it, 
        // otherwise we use 'none'. E.g., 
        // {'converterHint': ['placeholder', 'notewindow']} // use notewindow
        // {'converterHint': ['placeholder']}               // use none

        if (!artifactDisplayTypeResolved)
        {
          if (!compPH)
          {
            $messagingPreferences[artifact] = displayType;
            artifactDisplayTypeResolved = true;
            
          }
        }
      }
      else
      {
        // displayType 'placeholder' is not supported on other artifacts
        // ignore if present
        // TODO: In the future we may want to support configuring validatorHint ot title as 
        // placeholder as well.
      }

      break;
    // inline display is special in that it's only supported on 'messages'.
    case oj.ComponentMessaging._DISPLAY_TYPE.INLINE :

      if (artifact === "messages")
      {

        if (!artifactDisplayTypeResolved)
        {
          $messagingPreferences[artifact] = displayType;
          artifactDisplayTypeResolved = true;
        }
      }
      else
      {
        // displayType 'inline' is not supported on other artifacts
        // ignore if present
      }

      break;

    default:
      if (!artifactDisplayTypeResolved)
      {
        $messagingPreferences[artifact] = displayType;
        artifactDisplayTypeResolved = true;
      }
      break;
  }
  
  return artifactDisplayTypeResolved;
  
},

/**
 * Creates messaging strategies for the component based on the displayOptions.
 * @private
 */
oj.ComponentMessaging.prototype._initializeMessagingStrategies = function ()
{
  var artifactsByDisplayType = this._getResolvedMessagingDisplayOptions(), 
    displayInNoteWindow = artifactsByDisplayType[oj.ComponentMessaging._DISPLAY_TYPE.NOTEWINDOW], 
    displayNone = artifactsByDisplayType[oj.ComponentMessaging._DISPLAY_TYPE.NONE], 
    displayInPlaceholder = artifactsByDisplayType[oj.ComponentMessaging._DISPLAY_TYPE.PLACEHOLDER],
    displayInline = artifactsByDisplayType[oj.ComponentMessaging._DISPLAY_TYPE.INLINE],
    messagingStrategies = {};
    
  if (displayInNoteWindow.length > 0)
  {
    // displayInNoteWindow is an array of the artifacts that want to be displayed in the note window
    // e.g., 'messages', 'converterHints', etc.
    messagingStrategies[oj.ComponentMessaging._DISPLAY_TYPE.NOTEWINDOW] = 
      this._createMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.NOTEWINDOW, displayInNoteWindow);
  }
  
  if (displayInPlaceholder.length > 0)
  {
    // displayInPlaceholder is an array of the artifacts that want to be displayed in placeholder
    // e.g., 'converterHints'
    messagingStrategies[oj.ComponentMessaging._DISPLAY_TYPE.PLACEHOLDER] = 
      this._createMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.PLACEHOLDER, displayInPlaceholder);
  }
  
  if (displayInline.length > 0)
  {
    // displayInPlaceholder is an array of the artifacts that want to be displayed in placeholder
    // e.g., 'converterHints'
    messagingStrategies[oj.ComponentMessaging._DISPLAY_TYPE.INLINE] = 
      this._createMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.INLINE, displayInline);
  }
  
  messagingStrategies[oj.ComponentMessaging._DISPLAY_TYPE.NONE] = 
    this._createMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.NONE, displayNone);

  this._strategies = messagingStrategies;
};

/**
 * Reinitializes component messaging with new messagingDisplayOptions.
 * 
 * @private
 */
oj.ComponentMessaging.prototype._reactivate = function ()
{
  var artifactsByDisplayType = this._getResolvedMessagingDisplayOptions(), strategy, cm = this; 
  
  // for every displayType being requested either create the messaging strategy for the type or 
  // reuse existing strategy if it has already been created. 
  $.each(artifactsByDisplayType, function(type, artifactsForType) 
    {
      type = type + ""; // coerce to avoid GCC warning
      strategy = cm._strategies[type];
      if (artifactsForType && artifactsForType.length > 0)
      {
        if (!strategy)
        {
          // create a strategy if one doesn't exist for the type
          strategy = cm._createMessagingStrategy(type, artifactsForType);
          cm._strategies[type] = strategy;
          strategy.activate(cm);
        }
        else if (strategy)
        {
          // update strategy with the latest displayOptions if already present. we don;t 
          // want to remove it once activated.
          strategy.reactivate(artifactsForType);
        }
      }
      else
      {
        if (strategy && oj.ComponentMessaging._DISPLAY_TYPE.NONE !== type)
        {
          // if we have no artifacts to show for a type, then remove the strategy.
          // only if its other than the DefaultMessagingStrategy as it's always needed to theme 
          // component.
          strategy.deactivate();
          delete cm._strategies[type];
        }
      }
    });
};

/**
 * A base messaging strategy class that is initialized with a set of displayOptions. This object 
 * also provides helper methods for its subclasses.
 * 
 * @param {Array} displayOptions an array of messaging artifacts displayed.
 * 
 * @constructor
 * @class oj.MessagingStrategy
 * @private
 */
oj.MessagingStrategy = function (displayOptions)
{
  this.Init(displayOptions);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.MessagingStrategy, oj.Object, "oj.MessagingStrategy");

/**
 * Initializes the strategy based on the display options that specify the messaging artifacts that 
 * will be displayed by this strategy.
 * 
 * @param {Array} displayOptions an array of messaging artifacts displayed.
 * @private
 */
oj.MessagingStrategy.prototype.Init = function (displayOptions)
{
  oj.Assert.assertArray(displayOptions);
  oj.MessagingStrategy.superclass.Init.call(this);
  
  this._displayOptions = displayOptions;
};

oj.MessagingStrategy.prototype.activate = function (cm)
{
  this._componentMessaging = cm;
};

/**
 * Cleans up messaging artifacts that were created on the component instance. E.g., destroys any 
 * widgets it created, removes styles added etc.
 * 
 * @private
 */
oj.MessagingStrategy.prototype.deactivate = function ()
{
};

/**
 * Reinitializes with the new display options and updates component messaging using the new content. 
 * 
 * @param {Array} newDisplayOptions
 * @private
 */
oj.MessagingStrategy.prototype.reactivate = function (newDisplayOptions)
{
  this.Init(newDisplayOptions);
};

/**
 * Returns true always. Subclasses can override to ignore updates. 
 * 
 * @param {Object=} content the messaging content that is being updated 
 * @return {boolean} 
 * 
 * @private
 */
oj.MessagingStrategy.prototype.shouldUpdate = function (content)
{
  return true;
};


/**
 * Updates component with instance using the content provided.
 * 
 * @private
 */
oj.MessagingStrategy.prototype.update = function ()
{
};

// P R O T E C T E D  M E T H O D S 
/**
 * Gets the launcher element for which the messaging is applied.
 * @return {Object} the jquery element of the form element.
 * @private
 */
oj.MessagingStrategy.prototype.GetLauncher = function ()
{
  return this._componentMessaging._getLauncher();
};

/**
 * Gets the component (widget).
 * @return {Object} the jet component instance
 * @private
 */
oj.MessagingStrategy.prototype.GetComponent = function ()
{
  return this._componentMessaging._getComponent();
};

/**
 * Returns an array of messages.
 * 
 * @return {Array} of messages each an instance of oj.Message
 * @private
 */
oj.MessagingStrategy.prototype.GetMessages = function ()
{
  return this.GetValidityState().getMessages();
};

oj.MessagingStrategy.prototype.GetMaxSeverity = function ()
{
  return this.GetValidityState().getMaxSeverity();
};

/**
 * Gets the converter hint.
 * 
 * @return {Array} an array of hints, each a string.
 * @private
 */
oj.MessagingStrategy.prototype.GetConverterHint = function ()
{
  var hints = [], mc = this._getMessagingContent(), converterHint = mc && mc.converterHint;
  if (converterHint)
  {
    hints.push(converterHint);
  }
  
  return hints;
};

oj.MessagingStrategy.prototype.GetValidatorHints = function ()
{
  var hints = [], mc = this._getMessagingContent(), vHints = mc && mc.validatorHint || [], 
      index, hint;
  $.each(vHints, function (index, hint)
    {
      hints.push(hint);
    }
  );
  
  return hints;
};


/**
 * Gets the short description.
 * @return {string} title or ""
 * @private
 */
oj.MessagingStrategy.prototype.GetTitle = function ()
{
  var mc = this._getMessagingContent();
  return mc && mc.title || ""; 
};

/**
 * Gets the validityState, an instance of oj.ComponentValidity or null.
 * @private
 */
oj.MessagingStrategy.prototype.GetValidityState = function ()
{
  var mc = this._getMessagingContent(); 
  return mc && mc.validityState || null;
};

/**
 * Whether the strategy is displaying messages or not.
 * @return {boolean} true if strategy has messages to display
 * @private
 */
oj.MessagingStrategy.prototype.HasMessages = function ()
{
  var messages = this.GetMessages();
  return (messages && messages.length > 0) ? true: false;
};

oj.MessagingStrategy.prototype.ShowMessages = function ()
{
  return this._displayOptions.indexOf('messages') !== -1 ? true : false;
};

oj.MessagingStrategy.prototype.ShowConverterHint = function ()
{
  return this._displayOptions.indexOf('converterHint') !== -1 ? true : false;
};

oj.MessagingStrategy.prototype.ShowValidatorHint = function ()
{
  return this._displayOptions.indexOf('validatorHint') !== -1 ? true : false;
};

oj.MessagingStrategy.prototype.ShowTitle = function ()
{
  return this._displayOptions.indexOf('title') !== -1 ? true : false;
};

/**
 * Returns true if we have invalid messages; false otherwise.
 * 
 * @return {boolean}
 * @private
 */
oj.MessagingStrategy.prototype.IsInvalid = function ()
{
  return this.GetValidityState().isInvalid();
};


/**
 * Gets the messagingContent stored in ComponentMessaging instance
 * @return {Object}
 * @private
 */
oj.MessagingStrategy.prototype._getMessagingContent = function ()
{
  if (this._componentMessaging)
  {
    return this._componentMessaging._getMessagingContent();
  }
  
  return {};
};


/**
 * A messaging strategy that updates the component theming and accessibility attributes.
 * 
 * @param {Array} displayOptions .
 * @constructor
 * @extends {oj.MessagingStrategy}
 * @private
 */
oj.DefaultMessagingStrategy = function(displayOptions)
{
  this.Init(displayOptions);
};

oj.ComponentMessaging.registerMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.NONE, 
                                                oj.DefaultMessagingStrategy);

// TODO: Need to retrieve style selectors from a Style Manager
oj.DefaultMessagingStrategy._SELECTOR_STATE_INVALID = "oj-invalid";
oj.DefaultMessagingStrategy._SELECTOR_STATE_WARNING = "oj-warning";

oj.Object.createSubclass(oj.DefaultMessagingStrategy, oj.MessagingStrategy, "oj.DefaultMessagingStrategy");

/**
 * Updates component theming, a11y attributes using the latest component state and its messaging 
 * content.
 * 
 * @private
 */
oj.DefaultMessagingStrategy.prototype.update = function ()
{
  oj.DefaultMessagingStrategy.superclass.update.call(this);

  var launcher = this.GetLauncher(), maxSeverity = this.GetMaxSeverity(), removeClasses = [], 
      addClasses=[], invalid = false, component = this.GetComponent(), jqRoot = component.widget();
  
  if (!launcher)
  {
    return;
  }
  
  // apply element error styling if invalid
  if (this.IsInvalid())
  {
    // enable tooltip; set invalid class and aria invalid
    // TODO: oj classes should be set on the root DOM
    removeClasses.push(oj.DefaultMessagingStrategy._SELECTOR_STATE_WARNING);
    addClasses.push(oj.DefaultMessagingStrategy._SELECTOR_STATE_INVALID);
    invalid = true;
  }
  else
  {
    // TODO: add warning or other severity state
    if (this.HasMessages() && maxSeverity === oj.Message.SEVERITY_LEVEL['WARNING'])
    {
      removeClasses.push(oj.DefaultMessagingStrategy._SELECTOR_STATE_INVALID);
      addClasses.push(oj.DefaultMessagingStrategy._SELECTOR_STATE_WARNING);
    }
    else
    {
      // for all other messages we remove selectors
      removeClasses.push(oj.DefaultMessagingStrategy._SELECTOR_STATE_INVALID);
      removeClasses.push(oj.DefaultMessagingStrategy._SELECTOR_STATE_WARNING);
    }
  }
  
  jqRoot.removeClass(removeClasses.join(" "))
          .addClass(addClasses.join(" ")); // classes added to root
  launcher.attr({"aria-invalid": invalid}); // aria attrs added to the launcher element
  
};

/**
 * Cleans up messaging artifacts that were created on the component instance. E.g., destroys any 
 * widgets it created, removes styles added etc.
 * 
 * @private
 */
oj.DefaultMessagingStrategy.prototype.deactivate = function ()
{
  var jqRoot = this.GetComponent().widget();
  
  jqRoot.removeClass(oj.DefaultMessagingStrategy._SELECTOR_STATE_INVALID)
                  .removeClass(oj.DefaultMessagingStrategy._SELECTOR_STATE_WARNING);
  this.GetLauncher().removeAttr("aria-invalid");
  oj.DefaultMessagingStrategy.superclass.deactivate.call(this);
};


/**
 * A messaging strategy that uses html5 placeholder (for now) to set/remove placeholder content.
 * 
 * @param {Array} displayOptions an array of messaging artifacts displayed in the placeholder.
 * @constructor
 * @extends {oj.MessagingStrategy}
 * @private
 */
oj.PlaceholderMessagingStrategy = function(displayOptions)
{
  this.Init(displayOptions);
};

oj.ComponentMessaging.registerMessagingStrategy(oj.ComponentMessaging._DISPLAY_TYPE.PLACEHOLDER, 
                                                oj.PlaceholderMessagingStrategy);

// Subclass from oj.MessagingStrategy 
oj.Object.createSubclass(oj.PlaceholderMessagingStrategy, oj.MessagingStrategy, "oj.PlaceholderMessagingStrategy");

/**
 * Initializer
 *  
 * @param {Array} displayOptions an array of messaging artifacts displayed in the notewindow.
 * @private
 */
oj.PlaceholderMessagingStrategy.prototype.Init = function (displayOptions) 
{
  oj.PlaceholderMessagingStrategy.superclass.Init.call(this, displayOptions);
};

/**
 * Sets up a placeholder for the component instance using the converter hint.
 * 
 * @param {Object} cm a reference to an instance of oj.ComponentMessaging that provides access to 
 * the latest messaging content.
 * 
 * @private
 */
oj.PlaceholderMessagingStrategy.prototype.activate = function (cm)
{
  oj.PlaceholderMessagingStrategy.superclass.activate.call(this, cm);
  this._refreshPlaceholder();
};

oj.PlaceholderMessagingStrategy.prototype.reactivate = function (newDisplayOptions)
{
  oj.PlaceholderMessagingStrategy.superclass.reactivate.call(this, newDisplayOptions);
  this._refreshPlaceholder();
};

/**
 * Returns true if the content being updated includes converterHint prop. This method is an 
 * optimization because the update() method is called too often and any time any content changes. 
 * The only time PlaceholderMessagingStrategy#update needs to execute is when the converter hint 
 * changes.
 * 
 * @param {Object=} content the messaging content that is being updated 
 * @return {boolean} 
 * 
 * @private
 */
oj.PlaceholderMessagingStrategy.prototype.shouldUpdate = function (content)
{
  return content && content.converterHint !== undefined ? true : false;
};

oj.PlaceholderMessagingStrategy.prototype.update = function ()
{
  oj.PlaceholderMessagingStrategy.superclass.update.call(this);
  this._refreshPlaceholder();
};

// a default placeholder is set on the component, and that is typically the converter hint
oj.PlaceholderMessagingStrategy.prototype._refreshPlaceholder = function()
{
  var launcher = this.GetLauncher(), content, hints;
  
  if (this.ShowPlaceholderContent() && launcher)
  {
    hints = this.GetConverterHint();
    content = hints.length ? hints[0] : "";
    var context = {};
    context.internalMessagingSet = true; // to indicate to component that placeholder is being 
                                       	 // set from messaging module 
    this.GetComponent().option({'placeholder': content}, {'_context': context});
  }
};

oj.PlaceholderMessagingStrategy.prototype.ShowPlaceholderContent = function ()
{
  // we have a placeholder to set/show if we have converterHint set.
  return this.ShowConverterHint();
};

/**
 * The ComponentValidity object represent a component's current validity state. The instance 
 * provides specific methods to retrieve info such as <p>
 *  - whether the component is valid <p>
 *  - the messages currently tracked on the component.<p>
 *  - the max severity level of the messages, e.g., fatal, error etc. See oj.Message for details
 * 
 * @param {boolean} valid
 * @param {Array} messages
 * @constructor
 * @private
 */
oj.ComponentValidity = function(valid, messages)
{
  // TODO: provide methods that allow model implementations to instruct the elements to showMessages, 
  // especially the ones marked for 'lazy' notification. 
  this.Init(valid, messages);
};

/**
 * whether there are invalid messages among the list of messages.
 * 
 * @param {Array} messages list of messages
 * @returns {boolean} true if we have invalid messages; false otherwise
 */
oj.ComponentValidity.isInvalid = function (messages)
{
  var maxLevel = oj.Message.getMaxSeverity(messages);
  if (maxLevel >= oj.Message.SEVERITY_LEVEL['ERROR'])
  {
    return true;
  }

  return false;
  
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.ComponentValidity, oj.Object, "oj.ComponentValidity");

/**
 * The jquery element whose validity this object describes
 * @param {boolean} valid
 * @param {Array} messages instances of oj.Message
 */
oj.ComponentValidity.prototype.Init = function (valid, messages) 
{
  oj.ComponentValidity.superclass.Init.call(this);
  this._initialize(valid, messages);
};

/**
 * Returns a boolean true if valid; false if element not valid
 * @returns {boolean}
 * @private
 */
oj.ComponentValidity.prototype.isInvalid = function () 
{
  return this._invalid;
};

/**
 * Returns a boolean true if has messages to show; false if no messages to show
 * @returns {boolean}
 * @private
 */
oj.ComponentValidity.prototype.hasMessages = function () 
{
  return this._messages.length > 0;
};

/**
 * Returns an Array or messages that we are marked for immediate display or an empty array.
 * @private
 * @returns {Array}
 */
oj.ComponentValidity.prototype.getMessages = function () 
{
  return this._messages;
};

/**
 * Returns the max severity level.
 * @return {number}
 * @private
 */
oj.ComponentValidity.prototype.getMaxSeverity = function () 
{
  return this._maxSeverity;
};

/**
 * Updates the validity state for the component.
 * 
 * @param {boolean} valid
 * @param {Array} messages instances of oj.Message
 * @private
 */
oj.ComponentValidity.prototype.update = function (valid, messages)
{
  this._initialize(valid, messages);
};

oj.ComponentValidity.prototype._initialize = function (valid, messages)
{
  this._compValid = valid;
  this._compMessages = messages;
  
  this._messages = this._getImmediateMessages(); // messages currently showing
  this._maxSeverity = oj.Message.getMaxSeverity(this._messages); // max severity of messages currently showing
  this._invalid = oj.ComponentValidity.isInvalid(this._messages); 
};

/**
 * Returns an array of messages that are marked for immediate display.
 * 
 * @return {Array} of messages each an instance of oj.Message
 * @private
 */
oj.ComponentValidity.prototype._getImmediateMessages = function ()
{
  var messages = this._compMessages || [], immediateMsgs = [], msg;
  for (var index = 0; index < messages.length; index++)
  {
    msg = messages[index];
    // gather component messages marked for immediate display 
    if (msg instanceof oj.ComponentMessage && !msg.canDisplay())
    {
      continue;
    }
    immediateMsgs.push(msg);
  }
  
  return immediateMsgs;
};

/*jslint browser: true*/
/*
** Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved.
*/
/**
 * Focus utilities.
 * @ignore
 */
oj.FocusUtils = {};

oj.FocusUtils._TABBABLE = ":tabbable";

//These functions inspired by AdfFocusUtils

/**
 * Tests whether the specified element contains the keyboard focus.
 * @param {!Element} element Element for which to check if it contains focus.
 * @returns {boolean} True if the element contains focus, false otherwise.
 */
oj.FocusUtils.containsFocus = function(element)
{
  var activeElem = document.activeElement;
  //FIX : if either elem is undefined, just return false
  if (!element || !activeElem)
    return false;
  
  return oj.DomUtils.isAncestorOrSelf(element, activeElem);
};

/**
 * Sets focus to the specified element.
 * @param {!Element} element Element to focus.
 */
oj.FocusUtils.focusElement = function(element)
{
  element.focus();
};

/**
 * Sets focus to the first tabbable element inside the given element, which
 * may be the given element itself.
 * @param {!Element} element Element to start searching for a tabbable element in.
 * @returns {Element} The DOM element that was focused, if any.
 */
oj.FocusUtils.focusFirstTabStop = function(element)
{
  var focusElement = oj.FocusUtils.getFirstTabStop(element);

  if (focusElement)
    oj.FocusUtils.focusElement(focusElement);

  return focusElement;
};

/**
 * Get the first tabbable element inside the given element, which may be the
 * given element itself.
 * @param {!Element} element Element to start searching for a tabbable element in.
 * @returns {Element} The first tabbable element inside the given element.
 */
oj.FocusUtils.getFirstTabStop = function(element)
{
  var jqElem = $(element);
  if (jqElem.is(oj.FocusUtils._TABBABLE))
    return element;
  
  var jqFocusables = jqElem.find(oj.FocusUtils._TABBABLE);
  if (jqFocusables && jqFocusables.length > 0)
    return jqFocusables[0];

  return null;
};
// Copyright (c) 2013, Oracle and/or its affiliates.
// All rights reserved.

/*jslint browser: true*/

/**
 * @export
 * @class
 * Common test support in JavaScript
 */
oj.Test = {};


/**
 * @export
 * @type {boolean}
 * A global application flag that can be set by a test to indicate that all page startup processing is done
 * and an external automated test can begin
 */
oj.Test.ready = false;

/**
 * @export
 * Return the node found given the locator
 * @param {Object|string} locator A locator which is either a JSON string (to be parsed using $.parseJSON), or an Object with the following properties:
 *                                             element: the component's selector, determined by the test author when laying out the page
 *                                             component: optional - in the future there may be more than one component contained within a page element
 *                                             subId: the string, documented by the component, that the component expects in getNodeBySubId to locate a particular subcomponent
 *  @returns {Object} the subcomponent located by the subId string passed in locator, if found.
 */
oj.Test.domNodeForLocator = function (locator) {
  var locObj = locator;
  if (oj.StringUtils.isString(locator)) {
    var locStr = /** @type {string} */ (locator);
    try {
      locObj = $.parseJSON(locStr);
    }
    catch (e) {
      return null;
    }
  }
  if (locObj && locObj['element']) {
    var element = $(locObj['element']);
    if (element) {
      var widgetConst = oj.Components.getWidgetConstructor(element[0], locObj['component']);
      delete locObj['element'];
      return widgetConst("getNodeBySubId", locObj);
    }
  }
  return null;
};


/**
 * @return {number} total number of open popups
 * @export
 * @since 1.1.0
 */
oj.Test.getOpenPopupCount = function ()
{
  return oj.ZOrderUtils.getOpenPopupCount();
};

/**
 * Returns a jQuery set of popup root elements that are open and actively
 * managed by the popup framework.
 *
 * @return {!jQuery}
 * @export
 * @since 1.1.0
 */
oj.Test.findOpenPopups = function ()
{
  return oj.ZOrderUtils.findOpenPopups();
};

/**
 * Utility used for testing. Compares two jQuery singleton wappered elements
 * determining which element has the greatest stacking context.
 *
 * @export
 * @param {jQuery} el1 first element to compare
 * @param {jQuery} el2 second element to compare
 * @return {number} 0 if elements have the same stacking context;
 *                  1 if the first element has a greater stacking context;
 *                 -1 when the second element has a greater stacking context;
 * @since 1.1.0
 */
oj.Test.compareStackingContexts = function (el1, el2)
{
  return oj.ZOrderUtils.compareStackingContexts(el1, el2);
};
});
