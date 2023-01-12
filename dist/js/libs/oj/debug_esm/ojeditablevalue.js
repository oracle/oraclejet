/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { __GetWidgetConstructor, setDefaultOptions, createDynamicPropertyGetter, isComponentInitialized } from 'ojs/ojcomponentcore';
import $ from 'jquery';
import 'ojs/ojlabel';
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';
import FocusUtils from 'ojs/ojfocusutils';
import Context from 'ojs/ojcontext';
import { error, info, warn } from 'ojs/ojlogger';
import RequiredValidator from 'ojs/ojvalidator-required';
import LabelledByUtils from 'ojs/ojlabelledbyutils';
import { getTranslatedString } from 'ojs/ojtranslation';
import Message from 'ojs/ojmessaging';
import ConverterUtils from 'ojs/ojconverterutils';
import { ConverterError, ValidatorError } from 'ojs/ojvalidation-error';
import 'ojs/ojpopup';
import { Press } from 'hammerjs';
import 'ojs/ojjquery-hammer';
import { isTouchSupported, isHTMLContent, cleanHtml, validateURL, makeFocusable } from 'ojs/ojdomutils';
import { startAnimation } from 'ojs/ojanimation';

/**
 * Base class for rendering the 'inside' labels. This is so InsideLabelStrategy
 * and InsideFormControlLabelStrategy can share code.
 * Extends the MessagingStrategy which does more now than messages. It now
 * is also for rendering the form component's label in one of many positions.
 *
 * @extends {oj.MessagingStrategy}
 * @protected
 * @constructor
 * @since 8.0.0
 * @class BaseInsideLabelStrategy
 * @ignore
 * @ojtsignore
 * @param {Array.<string>} options an array of messaging artifacts that are
 * displayed as an inside label for non-text field form controls.
 * For LabelStrategies this is always only labelEdge.
 */
const BaseInsideLabelStrategy = function (options) {
  this.Init(options);
};

// Subclass from oj.MessagingStrategy
oj.Object.createSubclass(BaseInsideLabelStrategy, oj.MessagingStrategy, 'BaseInsideLabelStrategy');

/**
 * Adds a hook for subclass to use its own styleclass on root dom element.
 * @memberof BaseInsideLabelStrategy
 * @instance
 * @protected
 */
BaseInsideLabelStrategy.prototype._GetFormControlLabelStyleClass = function () {
  return 'oj-form-control-label-inside';
};

/**
 * Creates the label adding associated event listeners for applying
 * marker selectors to the root and responding to label-hint
 * and other component property changes.
 * @memberof BaseInsideLabelStrategy
 * @instance
 * @protected
 */
BaseInsideLabelStrategy.prototype._CreateLabel = function () {
  var component = this.GetComponent();
  var container = this._GetContainer(component); // could be overwritten. InsideLabelStrategy.
  if (!container) return;

  var options = component.options;
  var element = component._getRootElement();
  // could be overwritten ,e.g., _getBaseLabelSelector
  var labelStyleClass = this._GetFormControlLabelStyleClass();
  element.classList.add(labelStyleClass);
  this.GenerateIdIfNeeded(element);

  this._showUserAssistanceNotInline = component._showUserAssistanceNotInline();
  let renderRequiredIcon = options.required && this._showUserAssistanceNotInline;
  // for 'inside labels' we do not show help on the label.
  this._createOjLabelElement(
    element,
    component,
    container,
    options.labelHint,
    renderRequiredIcon,
    options.helpHints,
    this._showUserAssistanceNotInline
  );
};

/**
 * @memberof BaseInsideLabelStrategy
 * @instance
 * @private
 * @param {Element} label oj-label element
 * @param {CustomEvent} event requiredChanged event
 */
BaseInsideLabelStrategy.prototype._createOjLabelElement = function (
  element,
  component,
  container,
  labelHint,
  showRequired,
  helpHintsAttrValue,
  showUserAssistanceOnLabel
) {
  var ojlabel = document.createElement('oj-label');
  ojlabel.id = BaseInsideLabelStrategy._getLabelId(element);
  ojlabel.setAttribute('data-oj-binding-provider', 'none');
  ojlabel.setAttribute('data-oj-internal', '');

  // associate with form component
  ojlabel.setAttribute('for', element.id);
  var defaultLabelStyleClass = [component._GetDefaultStyleClass(), 'label'].join('-');
  ojlabel.classList.add(defaultLabelStyleClass);
  if (showRequired) {
    ojlabel.setAttribute('show-required', showRequired);
  }
  if (showUserAssistanceOnLabel && helpHintsAttrValue) {
    ojlabel.help = helpHintsAttrValue;
  }

  // add labelHint
  var span = document.createElement('span');
  span.id = [element.id, '|hint'].join('');
  span.textContent = labelHint;

  // add to dom and create event handlers
  ojlabel.appendChild(span);
  this._InsertOjLabel(ojlabel, container, component);
  this._CreateEventHandlers(span, element, ojlabel, component);
};

/**
 * Gets the form component's container. Could be overwritten to have more
 * logic to get the container.
 * @memberof BaseInsideLabelStrategy
 * @instance
 * @protected
 */
BaseInsideLabelStrategy.prototype._GetContainer = function (component) {
  return component._GetFormControlContainer();
};

/**
 * Creates event handlers
 * Override if there are more event listeners to create
 * Components with label-hint and label-edge of none or inside create
 * their own labels in this strategy, and when they do we listen for
 * attribute changes so we can deal with them and update the label accordingly.
 * If the oj-form-layout creates the label (top/start), then similar event listeners
 * are created there in ojformlayout.
 * @param {Element} span span around the label where we use innerText to set the labelHint
 * @param {Element} element root custom element
 * @param {Element} ojlabel ojlabel custom element
 * @param {Element} component form component
 * @memberof BaseInsideLabelStrategy
 * @instance
 * @protected
 */
BaseInsideLabelStrategy.prototype._CreateEventHandlers = function (
  span,
  element,
  ojlabel,
  component
) {
  this._labelHintChangedCallback = BaseInsideLabelStrategy._labelHintChangedHandler.bind(
    this,
    span
  );
  element.addEventListener('labelHintChanged', this._labelHintChangedCallback);
  this._requiredChangedCallback = BaseInsideLabelStrategy._requiredChangedHandler.bind(
    this,
    ojlabel,
    component
  );
  element.addEventListener('requiredChanged', this._requiredChangedCallback);
  this._helpHintsChangedCallback = BaseInsideLabelStrategy._helpHintsChangedHandler.bind(
    this,
    ojlabel,
    component
  );
  element.addEventListener('helpHintsChanged', this._helpHintsChangedCallback);
};

/**
 * Removes the fixed label unregistering associated event listeners.
 * @memberof BaseInsideLabelStrategy
 * @instance
 * @private
 */
BaseInsideLabelStrategy.prototype._DestroyLabel = function () {
  var component = this.GetComponent();
  var options = component.options;
  var element = component._getRootElement();
  var labelStyleClass = this._GetFormControlLabelStyleClass(); // override
  element.classList.remove(labelStyleClass);

  var labelId = BaseInsideLabelStrategy._getLabelId(element); // no need to override
  // find inside label. inside labels are rendered inside the form element, so
  // start the query there. We were using document.getElementById to find the label,
  // but in the case where we toggle from top to inside, we find the top label
  // that has not yet been destroyed by the oj-form-layout at this point.
  const ojlabel = element.querySelector(`[id='${labelId}']`);
  if (ojlabel) {
    ojlabel.for = ''; // Triggers code to unlink the oj-label from its form component
    ojlabel.parentElement.removeChild(ojlabel);
  }
  options.labelledBy = undefined;
  this._DeleteEventHandlers(element);
};

/**
 * Removes the event handlers
 * Override if there are more event handlers to delete
 * @param {Element} element root custom element
 * @memberof BaseInsideLabelStrategy
 * @instance
 * @protected
 */
BaseInsideLabelStrategy.prototype._DeleteEventHandlers = function (element) {
  element.removeEventListener('labelHintChanged', this._labelHintChangedCallback);
  element.removeEventListener('requiredChanged', this._requiredChangedCallback);
  element.removeEventListener('helpHintsChanged', this._helpHintsChangedCallback);
  delete this._helpHintsChangedCallback;
  delete this._labelHintChangedCallback;
  delete this._requiredChangedCallback;
};

/**
 * @static
 * @private
 * @param {Element} element root custom element
 * @return {string} fixed label id
 */
BaseInsideLabelStrategy._getLabelId = function (element) {
  return [element.id, '-labelled-by'].join('');
};

/**
 * @static
 * @private
 * @param {Element} span holding label text
 * @param {CustomEvent} event labelChanged event
 */
BaseInsideLabelStrategy._labelHintChangedHandler = function (span, event) {
  // eslint-disable-next-line no-param-reassign
  span.textContent = event.detail.value;
};

/**
 * @static
 * @private
 * @param {Element} label oj-label element
 * @param {CustomEvent} event requiredChanged event
 */
BaseInsideLabelStrategy._requiredChangedHandler = function (label, component, event) {
  // we show required on label if compact and not when inline, for example.
  // get it here and cache it if it doesn't exist.
  if (this._showUserAssistanceNotInline == null) {
    this._showUserAssistanceNotInline = component._showUserAssistanceNotInline();
  }
  // eslint-disable-next-line no-param-reassign
  label.showRequired = event.detail.value && this._showUserAssistanceNotInline;
};

/**
 * helpHints attribute changed on form component, so update help icon on label if it is there.
 * (it could be inline to the component and not on label, if so, see InlineHelpHintsStrategy)
 * @static
 * @private
 * @param {Element} label oj-label element
 * @param {CustomEvent} event helpHintsChanged event
 */
BaseInsideLabelStrategy._helpHintsChangedHandler = function (label, component, event) {
  this._showUserAssistanceNotInline = component._showUserAssistanceNotInline();
  if (this._showUserAssistanceNotInline) {
    // eslint-disable-next-line no-param-reassign
    label.help = event.detail.value;
  }
};

/**
 * @class oj.EditableValueUtils
 * @classdesc JET Editable Component Utils
 * @export
 * @since 0.6.0
 * @hideconstructor
 * @ignore
 *
 */
const EditableValueUtils = {};

// S T A T I C    V A R S
/**
 * The various contexts under which validation can be run by component.
 * @ignore
 */
EditableValueUtils.validationContext = {
  COMPONENT_CREATE: 1,
  CONVERTER_OPTION_CHANGE: 2,
  DISABLED_OPTION_CHANGE: 3,
  READONLY_OPTION_CHANGE: 4,
  REFRESH_METHOD: 5,
  REQUIRED_OPTION_CHANGE: 6,
  RESET_METHOD: 7,
  USER_ACTION: 8,
  VALIDATE_METHOD: 9,
  VALIDATORS_OPTION_CHANGE: 10,
  VALUE_OPTION_CHANGE: 11
};

/**
 * Default validation options used by validate method.
 * @ignore
 */
EditableValueUtils.validateMethodOptions = {
  doValueChangeCheck: false,
  validationContext: EditableValueUtils.validationContext.VALIDATE_METHOD
};

/**
 * Default validation options used when converter option changes
 * @ignore
 */
EditableValueUtils.converterOptionOptions = {
  doValueChangeCheck: false,
  doNotClearMessages: true,
  validationContext: EditableValueUtils.validationContext.CONVERTER_OPTION_CHANGE
};

/**
 * Default validation options used when disabled option changes
 * @ignore
 */
EditableValueUtils.disabledOptionOptions = {
  doValueChangeCheck: false,
  doNotClearMessages: true,
  validationContext: EditableValueUtils.validationContext.DISABLED_OPTION_CHANGE
};

/**
 * Default validation options used when required option changes
 * @ignore
 */
EditableValueUtils.requiredOptionOptions = {
  doValueChangeCheck: false,
  doNotClearMessages: true,
  validationContext: EditableValueUtils.validationContext.REQUIRED_OPTION_CHANGE
};

/**
 * Default validation options used when readOnly option changes
 * @ignore
 */
EditableValueUtils.readOnlyOptionOptions = {
  doValueChangeCheck: false,
  doNotClearMessages: true,
  validationContext: EditableValueUtils.validationContext.READONLY_OPTION_CHANGE
};

/**
 * Default validation options used when refresh method is called.
 * @ignore
 */
EditableValueUtils.refreshMethodOptions = {
  doValueChangeCheck: false,
  doNotClearMessages: true,
  validationContext: EditableValueUtils.validationContext.REFRESH_METHOD
};
/**
 * Default validation options used when validators option changes
 * @ignore
 *  */
EditableValueUtils.validatorsOptionOptions = {
  doValueChangeCheck: false,
  doNotClearMessages: true,
  validationContext: EditableValueUtils.validationContext.VALIDATORS_OPTION_CHANGE
};

/**
 * String used in the id on the span that surrounds the help icon.
 * @const
 * @private
 * @ignore
 * @type {string}
 */
var _REQUIRED_ICON_ID = '_requiredIcon';

/**
 * Enum for validate() return values
 * @const
 * @ignore
 */
EditableValueUtils.VALIDATE_VALUES = {
  VALID: 'valid',
  INVALID: 'invalid'
};

/**
 * This method is called during _InitOptions() to initialize a component option value from DOM. This
 * uusally is the case when the option value is undefined,
 * i.e., this.options.optionName === undefined.
 * <br/>
 * Returns the attribute value for the given attribute on the element appropriately converted, or
 * the default, if the attribute isn't set on the element.<br/>
 *
 * @param {Object} element the element the component is initialized with.
 * @param {string} attribute the name of the element's attribtue. Example, value, disabled etc.
 *
 * @returns {Object} a JSON object containing the following properties - <br/>
 * <ul>
 * <li><b>fromDom</b> - whether the option value was initialized from DOM. When true the option's
 * value is written back (to observable).</li>
 * <li><b>value</b> - the option value. the attribute value or the default if the attribute isn't
 * set on the element.</li>
 * </ul>
 *
 * @private
 */
EditableValueUtils.getAttributeValue = function (element, attribute) {
  var result;
  var returnVal = {};

  if (element && attribute) {
    var elem = element[0];
    switch (attribute) {
      case 'disabled':
        result = elem.hasAttribute('disabled') ? !!elem.disabled : undefined;
        break;

      case 'pattern':
        result = elem.pattern || undefined;
        break;

      case 'placeholder':
        result = elem.placeholder || undefined;
        break;

      case 'readonly':
        result = elem.hasAttribute('readonly') ? !!elem.readOnly : undefined;
        break;

      case 'required':
        // If attribute is present
        //   - if the required property is undefined then return true since the attribute is set.
        //   - Otherwise set to !!propVal
        if (elem.hasAttribute('required')) {
          var propVal = elem.required;
          if (propVal !== undefined) {
            result = !!propVal;
          } else {
            result = true; // any attribute value indicates true, even required='false'
          }
        } else {
          result = undefined;
        }
        break;

      case 'title':
        result = elem.hasAttribute('title') ? elem.title : undefined;
        break;

      case 'value':
        // element attribute may not be set, in which case default to null
        result = element.val() || undefined;
        break;

      case 'min':
      case 'max':
      default:
        // same logic for min + max as in default
        result = elem.getAttribute(attribute) || undefined;
        break;
    }
  }

  if (result !== undefined) {
    returnVal.fromDom = true;
    returnVal.value = result;
  } else {
    returnVal.fromDom = false;
    // returnVal.value = defaultValue;
  }
  return returnVal;
};

/**
 * NOTE: This is unnecessary to call for custom elements.
 * Called from component._InitOptions() with an array of options
 * that the component might need to initialize from DOM (e.g.,
 * disabled, required, title, etc). This function loops through each of these and if the
 * constructorOptions[option] is undefined, it tries to get the option from DOM.
 * The constructorOptions hold the options that the page author sets on the component, usually via
 * knockout bindings, and that takes precedence over DOM.
 * e.g., <input id="id" type="text" required data-bind="ojComponent: {component: 'ojInputText',
                                  value: value}"/>
 * value is a constructorOption and required is a DOM option in this example. If you have:
 * e.g., <input id="id" type="text" required data-bind="ojComponent: {component: 'ojInputText',
                                  value: value, required: false}"/>
 * required is both a constructorOption of false and a DOM of true. The constructorOption takes
 * precedence.
 * <p>
 * IMPORTANT: Do not call this method after component has been created, since option values are
 * mutated directly after that point.</p>
 *
 * The 'final' value an option uses/initializes from, can come from these places (in order of least
 * to most likely) - <br/>
 * <ol>
 * <li>component default - this is the widget default </li><br/>
 * <li>app default - this is what a page author defines for the value in the page/app</li> <br/>
 * <li>dom value - if your option also has a dom attribute, this is the value set on element for
 * component. </li> <br/>
 * <li>constructor value - this is the value page author sets on the component binding </li><br/>
 * </ol>
 *
 * At the time _InitOptions is called, (1), (2) and (4) are merged, but this may not be the value a
 * component wants for the option, especially when (4) is undefined. For example, if these values
 * were set for a component - <br/>
 * (1) - 'foo'<br/>
 * (2) - 'bar'<br/>
 * (3) - 'lucy'<br/>
 * (4) - undefined<br/>
 * <p>
 * at the time _InitOptions is called, this.options.option is set to 'bar'. But because DOM value
 * wins over app default or component default, the component needs to check if the constructor value was
 * undefined and if so, set option to the dom value which is 'lucy' in this example. This is what
 * this function does.<br/>
 * This method always defaults the value to be - this.options.option -
 * because we think if neither (3) nor (4) is set, then the value from (2) should win. <br/>
 * </p>
 *
 * @param {Object} props Array holding Object-literal that a component provides
 * with the following properties that helps determine the final value for one or more options.
 *
 * @property {string} props.attribute - name of DOM attribute
 * @property {string|undefined} props.option - name of the option if different from attribute name.
 *
 * @property {Function|boolean|undefined} props.coerceDomValue - if the DOM value is set and
 * coercing the dom value is needed, then either set to boolean true, which uses the default
 * coercion rules for common attributes (a), or provide a custom callback (b). <p>
 * E.g., 'value' option for input number, input date etc. have special rules for coercing the value,
 *  so thse provide a custom callback. For common attributes like required and disabled, set the
 *  value to true so the default oj.EditableValueUtils#coerceDomValueForOption method gets used.
 *
 * @property {boolean|undefined} props.validateOption - if set to true, then it calls
 * EditableValueUtils.validateValueForOption method to validate the option.
 *
 * @param {Object} constructorOptions the options set on the component instance, often using
 * component binding. (this is the value page author sets on the component binding)
 * @param {Object} comp component instance.
 * @param {Function=} postprocessCallback - optional callback that will receive a map of initialized
 * options for post-processing
 * @ignore
 * @public
 */
EditableValueUtils.initializeOptionsFromDom = function (
  props,
  constructorOptions,
  comp,
  postprocessCallback
) {
  var initializedOptions = {};

  // Loop through props to initialize option
  for (var i = 0; i < props.length; i++) {
    var finalValue;
    var result;
    var prop = props[i];
    var attribute = prop.attribute;
    var option = prop.option || attribute;
    var coerceDomValue = prop.coerceDomValue;
    var validateOption = prop.validateOption;
    var element = comp.element;
    var previousValue = comp.options[option];

    /* The precedence for the value that an option uses is as follows from lowest to highest -
     *
     * (1) component default - this is the widget default, already merged in to comp.options
     * (2) app default - this is what a page author defines for the value in the page / app,
     * already merged in to comp.options
     * (3) dom value - if your option also has a dom attribute, this is the value set on element.
     * (4) constructor value - this is the value page author sets on the component binding, already
     * merged in to comp.options.
     *
     * When (4) is undefined then attempt to default from (3).
     */

    // Step 1: use DOM value
    if (constructorOptions[option] === undefined) {
      previousValue = comp.options[option];
      result = EditableValueUtils.getAttributeValue(element, attribute);

      // if we are using domValue then coerce the dom value before writing to options and trigegr
      // option change so the value is written back (to ko)
      if (result.fromDom) {
        finalValue = result.value;

        // only required needs coercing so not bad
        if (coerceDomValue) {
          if (typeof coerceDomValue === 'boolean') {
            finalValue = EditableValueUtils.coerceDomValueForOption(option, finalValue);
          } else if (typeof coerceDomValue === 'function') {
            finalValue = coerceDomValue.call(comp, finalValue);
          }
        }
        initializedOptions[option] = finalValue;
      }
    }

    var valueToValidate = option in initializedOptions ? initializedOptions[option] : previousValue;

    // Step 2: validate the option value if needed
    if (validateOption) {
      if (typeof validateOption === 'boolean') {
        EditableValueUtils.validateValueForOption(option, valueToValidate);
      }
    }
  }

  if (postprocessCallback != null) {
    postprocessCallback(initializedOptions);
  }

  comp.option(initializedOptions, { _context: { writeback: true, internalSet: true } });
};

/**
 * Validates value set for the option and throws error if invalid.
 *
 * @param {string} option name of the option. Validates options common to all edtiableValue
 * holders.
 * @param {string|Object|boolean|number|undefined} value of the option that is validated
 *
 * @throws {Error} if option value is invalid
 * @public
 * @ignore
 */
EditableValueUtils.validateValueForOption = function (option, value) {
  var error = false;

  switch (option) {
    case 'required':
      if (value !== null && typeof value !== 'boolean') {
        error = true;
      }
      break;

    case 'readOnly':
    case 'disabled':
      if (value !== null && typeof value !== 'boolean') {
        error = true;
      }
      break;
    default:
      break;
  }

  if (error) {
    throw new Error("Option '" + option + "' has invalid value set: " + value);
  }
};

/**
 * Coerces the dom value being used for the option, and throws error if invalid.
 *
 * @param {string} option name of the option.
 * @param {string|Object|boolean|number|null} domValue dom value that is being coerced to the
 * option value
 * @throws {Error} if domValue cannot be coerced appropriately
 * @public
 * @ignore
 */
EditableValueUtils.coerceDomValueForOption = function (option, domValue) {
  var coerced = domValue;
  switch (option) {
    case 'required':
      coerced = !!domValue;
      break;
    default:
      break;
  }

  return coerced;
};

/**
 * set pickerAttributes on a popup picker
 *
 * @param {jQuery} picker popup picker
 * @param {Object} pickerAttributes supported attributes are class and style, which are appended to the picker class and style, if any.
 *
 * @ignore
 */
EditableValueUtils.setPickerAttributes = function (picker, pickerAttributes) {
  //  - let the popup picker accept the custom css class name from the component
  if (picker && pickerAttributes) {
    var classValue = pickerAttributes.class;
    if (classValue) {
      var classes = classValue.split(' ');
      // IE11 doesn't support destructured parameters so we need to iterate across the list
      // of classes
      for (var i = 0, len = classes.length; i < len; ++i) {
        picker[0].classList.add(classes[i]);
      }
    }

    var styleValue = pickerAttributes.style;
    if (styleValue) {
      error(`picker-attributes.style attribute violates the recommended
        Content Security Policy which disallows inline styles and is therefore ignored.
        Use the picker-attributes.class attribute instead.`);
    }
  }
};

/**
 * Helper to see if a special property was set to indicate we definitely have no label.
 * This is a performance enhancement for the corner case where input components are rendered in a
 * ojTable. Input components rendered in an ojTable have no label so we don't need to waste time
 * looking for labels.
 * @param {jQuery} widget The component widget.
 * @return {boolean}
 * @ignore
 * @private
 */
EditableValueUtils.hasNoLabelFlag = function (widget) {
  return widget[0].hasAttribute('data-oj-no-labelledby');
};

/**
 * Given the labelledBy (e.g., this.options.labelledBy), use this to
 * get the oj-label's label element's id when there is a for/id relationship
 * between the oj-label and the form component, but the form component wants to
 * write aria-labelledby on a div instead of using the for/id relationship in dom.
 * Some components need this information to
 * use as their aria-labelledby on their dom element(s) that takes focus. An example
 * is oj-switch and oj-slider which put display:none on its input and uses aria-labelledby
 * on its thumb.
 * This is the preferred way rather than using a 'for' attribute search to find the oj-label.
 * @param labelledBy
 * @param defaultLabelId
 * @return {string|null} return the string to use as the aria-labelledby on the form component's
 * focusable element. If oj-label doesn't exist, this will return null.
 * @ignore
 * @private
 */
EditableValueUtils._getOjLabelAriaLabelledBy = function (labelledBy, defaultLabelId) {
  var ariaLabelledBy;
  var ojlabels = EditableValueUtils._getCustomOjLabelElements(labelledBy);
  if (ojlabels) {
    ariaLabelledBy = '';
    for (var j = 0; j < ojlabels.length; j++) {
      var ojlabel = ojlabels[j];
      var oneLabelElementId = ojlabel.getAttribute('label-id');
      if (!oneLabelElementId) {
        var labelElement = ojlabel.querySelector('label');
        if (labelElement) {
          oneLabelElementId = labelElement.getAttribute('id');
        } else {
          // this is the case where the form component has
          // labelled-by pointing to oj-label that hasn't been
          // upgraded yet and doesn't have label-id on it.
          // this isn't the way the form component and its label
          // should be linked, but it is possible.
          ojlabel.setAttribute('label-id', defaultLabelId);
          oneLabelElementId = defaultLabelId;
        }
      }
      ariaLabelledBy += oneLabelElementId;
      if (j + 1 < ojlabels.length) {
        ariaLabelledBy += ' ';
      }
    }
  }
  return ariaLabelledBy;
};

/**
 * @ignore
 * @private
 */
EditableValueUtils._getCustomOjLabelElements = function (labelledBy) {
  var labelElements = [];

  if (labelledBy) {
    // split into individual ids
    var split = labelledBy.split(/\s+/);
    for (var i = 0; i < split.length; i++) {
      var labelId = split[i];
      var labelElement = document.getElementById(labelId);
      // don't push any null elements. it's possible labelled-by element can't be found.
      if (labelElement) {
        labelElements.push(labelElement);
      } else {
        info('Cannot find oj-label with id ' + labelElement);
      }
    }
  }
  return labelElements;
};

/**
 * Called during component initialization for Custom form components so that
 * they will be associated with their oj-label element correctly.
 * It links oj-label and form control for accessibility reasons.
 *
 * Background of how oj-label and 'input' components are linked together for accessibility:
 * --------------------------------------------------------------------------------------
 * An application developer links oj-label with a 'form' component like this:
 * <oj-label id='foo' for='myinput'> to <oj-input-text id='myinput'>
 *
 * We render the aria and data-oj- attributes on the correct dom like this:
 * <oj-label id='foo' for='myinput' data-oj-input-id='myinput|input'>
 * <span id="foo|label_helpIcon"<label id='foo|label' for='myinput|input'>
 * <oj-input-text id='myinput' labelled-by='foo' described-by='foo|label_helpIcon'>
 * <input aria-describedby='foo|label_helpIcon'>
 * ---------------------------------------------------------------------------------------
 * Note: See also _labelledByUpdatedForInputComp. We need both this function
 * and that one because
 * we cannot guarantee the upgrade order of the oj-label and form component.
 * If oj-label is not upgraded at the time the form component is, then it is
 * possible that the labels cannot be found. If that's the case, then the oj-label will
 * write labelledBy on the form component, and the  _labelledByUpdatedForInputComp
 * will get called which calls _setDataOjInputIdAttrOnLabel.
 * @ignore
 * @private
 */
EditableValueUtils._initInputIdLabelForConnection = function (
  contentElement,
  componentId,
  labelledBy
) {
  if (componentId) {
    contentElement.setAttribute('id', componentId + '|input');
    if (labelledBy) {
      this._linkLabelForInputComp(labelledBy, contentElement.id);
    }
  }
  if (labelledBy) {
    this._setReadonlyDivLabelledBy(labelledBy);
  }
};

/**
 * This function is called when labelledBy option is changed
 * on the form components with inputs, like
 * oj-input-text. It links oj-label's internal for and input form control's id
 * without relying on property dom searches.
 * Note: See also _initInputIdLabelForConnection. We need both this function
 * and that one because
 * we cannot guarantee the upgrade order of the oj-label and form component.
 * @ignore
 * @private
 */
EditableValueUtils._labelledByUpdatedForInputComp = function (labelledBy, contentElementId) {
  if (labelledBy) {
    if (contentElementId) {
      this._linkLabelForInputComp(labelledBy, contentElementId);
    }
    this._setReadonlyDivLabelledBy(labelledBy);
  }
  // update the required translation text since it could use label text
  // and if labelledBy changes, label text would have changed.
  if (this._IsRequired() && this.options.translations.required) {
    this._implicitReqValidator = null;
    this._getImplicitRequiredValidator();
  }
};

/**
 * @ignore
 * @private
 */
EditableValueUtils._linkLabelForInputComp = function (labelledBy, contentElementId) {
  var ojlabels = EditableValueUtils._getCustomOjLabelElements(labelledBy);
  if (ojlabels) {
    EditableValueUtils._setDataOjInputIdAttrOnLabel(contentElementId, ojlabels);
  }
};

/**
 * This function is called when labelledBy option is changed
 * on the form components with inputs, like
 * oj-input-text, and during component init, to set aria-labelledby
 * on the readonly div, if the component has a readonly div.
 * @ignore
 * @private
 */
EditableValueUtils._setReadonlyDivLabelledBy = function (labelledBy) {
  // don't call this function if labelledBy doesn't have a value.
  oj.Assert.assert(labelledBy);
  let readonlyElem = this._getReadonlyDiv();
  if (readonlyElem) {
    readonlyElem.setAttribute('aria-labelledby', labelledBy + '|label');
  }
};

/**
 * This function is called when readonly option changes from false to true
 * for readonly input components, or when the component is created.
 * @ignore
 * @private
 */
EditableValueUtils._createOrUpdateReadonlyDiv = function (input, createConditions = true) {
  // create readonly div if it doesn't exist.
  let readonlyElem = this._getReadonlyDiv();
  if (!readonlyElem && createConditions) {
    readonlyElem = this._createReadonlyDiv(input);
    if (!readonlyElem) {
      return;
    }
    if (this.options.labelledBy) {
      this._setReadonlyDivLabelledBy(this.options.labelledBy);
    }
    this._setAriaLabelFromLabelHint();
  }

  if (readonlyElem) {
    readonlyElem.textContent = this._GetDisplayValue();
    EditableValueUtils._setTabIndex(input, readonlyElem);
  }
};

/**
 * @ignore
 * @private
 */
EditableValueUtils._setTabIndex = function (input, readonlyElem) {
  let tabIndex = input.tabIndex;
  let readonlyElemToSet = readonlyElem;
  if (tabIndex !== null) {
    readonlyElemToSet.tabIndex = tabIndex;
  }
};

/**
 * @ignore
 * @private
 */
EditableValueUtils._setDataOjInputIdAttrOnLabel = function (contentElementId, ojlabels) {
  if (ojlabels) {
    for (var i = 0; i < ojlabels.length; i++) {
      var ojlabel = ojlabels[i];
      // setting this will cause ojlabel to set its internal label element's for to this id.
      ojlabel.setAttribute('data-oj-input-id', contentElementId);
    }
  }
};

/**
 * Validates the component's display value using the converter and all validators registered on
 * the component and updates the <code class="prettyprint">value</code> option by performing the
 * following steps.
 *
 * <p>
 * <ol>
 * <li>All messages are cleared, including custom messages added by the app. </li>
 * <li>If no converter is present then processing continues to next step. If a converter is
 * present, the UI value is first converted (i.e., parsed). If there is a parse error then
 * messages are shown.</li>
 * <li>If there are no validators setup for the component the <code class="prettyprint">value</code>
 * option is updated using the display value. Otherwise all
 * validators are run in sequence using the parsed value from the previous step. The implicit
 * required validator is run first if the component is marked required. When a validation error is
 * encountered it is remembered and the next validator in the sequence is run. </li>
 * <li>At the end of validation if there are errors, the messages are shown.
 * If there were no errors, then the
 * <code class="prettyprint">value</code> option is updated.</li>
 * </ol>
 *
 * @example <caption>Validate component using its current value.</caption>
 * myComp.validate();
 *
 * @example <caption>Validate component and use the Promise's resolved state.</caption>
 * myComp.validate().then(
 *  function(result) {
 *    if(result === "valid")
 *    {
 *      submitForm();
 *    }
 *  });
 *
 *
 * @return {Promise} Promise resolves to "valid" if there were no converter parse errors and
 * the component passed all validations.
 * The Promise resolves to "invalid" if there were converter parse errors or
 * if there were validation errors.
 *
 * @ignore
 * @private
 */
EditableValueUtils.validate = function () {
  var returnValue;

  // clear all messages; run full validation on display value
  // _SetValue returns boolean or Promise that resolves to a Boolean.
  returnValue = this._SetValue(this._GetDisplayValue(), null, this._VALIDATE_METHOD_OPTIONS);

  if (this._IsCustomElement()) {
    if (!(returnValue instanceof Promise)) {
      returnValue = Promise.resolve(returnValue ? 'valid' : 'invalid');
    } else {
      // convert true to 'valid' and false to 'invalid'
      return returnValue.then(function (booleanSetValueReturn) {
        return Promise.resolve(booleanSetValueReturn ? 'valid' : 'invalid');
      });
    }
  } else if (returnValue instanceof Promise) {
    return returnValue.then(function (booleanSetValueReturn) {
      return Promise.resolve(booleanSetValueReturn ? 'valid' : 'invalid');
    });
  }
  return returnValue;
};

/**
 * Refresh everything that needs refreshing when the required option is toggled:
 * refreshes theming, aria-required, label.
 *
 * Used by EditableValue components that support the required option.
 * The component links to this function like this:
 *   _refreshRequired : EditableValueUtils._refreshRequired,
 * @param {Object=} value the current value of the required option
 * @private
 * @ignore
 */
EditableValueUtils._refreshRequired = function (value) {
  var id;
  var contentNode;
  var ariaValue;
  var ariaRequiredUnsupported = this._AriaRequiredUnsupported();

  this._refreshTheming('required', value);
  // refresh aria-required
  // Most inputs/selects need aria-required on the input element (aka 'content')
  // But it is not legal to have aria-required on radio/checkboxes.
  if (!ariaRequiredUnsupported) {
    contentNode = this._GetContentElement();

    ariaValue = value; // (value == "required") ? true : false;
    if (ariaValue && contentNode) {
      contentNode[0].setAttribute('aria-required', ariaValue);
    } else {
      contentNode[0].removeAttribute('aria-required');
    }
  }

  if (!this._IsCustomElement()) {
    if (!this.$label) {
      this._createOjLabel();
    }

    // need to keep the label's required in sync with the input's required
    if (this.$label) {
      this.$label.ojLabel('option', 'showRequired', value);
      // in most cases aria-required is supported and that is what we do to get JAWS to say
      // "Required" on focus of the input. But in the case of a 'set' of items where one is required,
      // say radioset/checkboxset, what do we do? aria-required doesn't make sense (nor is it valid
      // as it fails validation in some accessibility validators) on each input, when really it is
      // one in the set that is required, not each one. This is what we are doing from v1 on: we
      // put aria-describedby to point to the required icon text.
      if (ariaRequiredUnsupported) {
        // if aria-labelledby is set,
        // add/remove aria-describedby to the inputs pointing to
        // the label+"_requiredIcon".
        var ariaLabelledByElem = this._getAriaLabelledByElement(this.element);
        if (ariaLabelledByElem !== null && ariaLabelledByElem.length !== 0) {
          id = ariaLabelledByElem[0].getAttribute('id');
        }

        if (id) {
          let ariaId = id + _REQUIRED_ICON_ID;
          if (value) {
            // adds
            this._describedByUpdated(null, ariaId);
          } else {
            // removes
            this._describedByUpdated(ariaId, null);
          }
        }
      }
    }
  }
};

/**
 * Performs post processing after required option is set by taking the following steps.
 *
 * - if component is invalid and has messgesShown -> required: false/true -> clear component errors;
 * run full validation with UI value (we don't know if the UI error is from a required validator
 * or something else);<br/>
 * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is
 * updated<br/>
 * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to
 * listen to optionChange(value) to clear custom errors.<br/>
 *
 * - if component is invalid and has messagesHidden -> required: false -> clear component
 * errors; no deferred validation is run.<br/>
 * - if component has no error -> required: true -> run deferred validation (we don't want to flag
 * errors unnecessarily)<br/>
 * - messagesCustom is never cleared<br/>
 *
 * @param {string} option
 *
 * @private
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
EditableValueUtils._AfterSetOptionRequired = function (option) {
  // refresh hints, theming and aria to reflect new state
  this._refreshRequired(this._IsRequired());
  this._runMixedValidationAfterSetOption(EditableValueUtils.requiredOptionOptions);
};

/**
 * When validators option changes, take the following steps.
 *
 * - Clear the cached normalized list of all validator instances. push new hints to messaging.<br/>
 * - if component is valid -> validators changes -> no change<br/>
 * - if component is invalid has messagesShown -> validators changes -> clear all component
 * messages and re-run full validation on displayValue. if there are no errors push value to
 * model;<br/>
 * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change
 * the required-ness of component <br/>
 * - messagesCustom is not cleared.<br/>
 *
 * NOTE: The behavior applies to any option that creates implicit validators - min, max, pattern,
 * etc. Components can call this method when these options change.
 *
 * @returns {undefined}
 * @private
 * @ignore
 */
EditableValueUtils._AfterSetOptionValidators = function () {
  var displayValue;
  // resets all validators and pushes new hints to messaging
  this._ResetAllValidators();

  if (this._hasInvalidMessagesShowing()) {
    this._clearComponentMessages();
    displayValue = this._GetDisplayValue();
    // runs full validation on the display value. May be async
    this._SetValue(displayValue, null, EditableValueUtils.validatorsOptionOptions);
  }
};

/**
 * When async-validators property changes, take the following steps.
 *
 * - Clear the cached normalized list of all async and sync validator instances.
 *  push new hints to messaging.<br/>
 * - if component is valid -> validators changes -> no change<br/>
 * - if component is invalid has messagesShown -> validators changes -> clear all component
 * messages and re-run full validation on displayValue. if there are no errors push value to
 * model;<br/>
 * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change
 * the required-ness of component <br/>
 * - messagesCustom is not cleared.<br/>
 *
 *
 * @returns {undefined}
 * @private
 * @ignore
 */
EditableValueUtils._AfterSetOptionAsyncValidators = function () {
  // resets validators and pushes new hints to messaging
  this._AfterSetOptionValidators();
};

/**
 * Performs post processing after converter option changes by taking the following steps.
 *
 * - always push new converter hint to messaging <br/>
 * - if component has no errors -> refresh UI value<br/>
 * - if component is invalid has messagesShown -> clear all component errors and run full
 * validation using display value. <br/>
 * &nbsp;&nbsp;- if there are validation errors, value is not pushed to model; messagesShown is
 * updated.<br/>
 * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to
 * listen to optionChange(value) to clear custom errors.<br/>
 * - if component is invalid has messagesHidden -> refresh UI value. no need to run deferred
 * validations. <br/>
 * - messagesCustom is never cleared<br/>
 *
 * @param {String} option
 *
 * @returns {undefined}
 * @private
 * @ignore
 */
// called when 'converter' option changed, usually from option/setOption calls
EditableValueUtils._AfterSetOptionConverter = function () {
  // clear the cached converter instance and push new hint to messaging
  this._converter = null;
  this._converterChangedCounter += 1;

  var converter = this._GetConverter();
  if (converter instanceof Promise) {
    var self = this;
    this._setBusyStateAsyncConverterLoading();
    var converterCounter = this._converterChangedCounter;
    this._loadingConverter(converter).then(function () {
      if (converterCounter === self._converterChangedCounter) {
        self._ResetConverter();
      }
      self._clearBusyStateAsyncConverterLoading();
    });
  } else {
    this._ResetConverter();
  }
};

/**
 * Performs post processing after we have the loaded converter
 * during component initialization.
 *
 * @returns {undefined}
 * @private
 * @ignore
 */
EditableValueUtils._AfterCreateConverterCached = function () {
  // we do this here for a couple reasons
  // 1. because here we have the final value; an empty placeholder
  // shows up if data changed after first binding. 
  // 2. we do not want the placeholder displayed while the loading
  // indication is showing.
  if (this._HasPlaceholderSet()) {
    // update element placeholder
    this._SetPlaceholder(this.options.placeholder);
    this._customPlaceholderSet = true;
  }
  // can't show validator hints or converter hints until we have the converter
  // because some validators have the converter as an option.
  this._initComponentMessaging(this._MESSAGING_CONTENT_UPDATE_TYPE.ALL);
  // need a converter to format the value
  this._Refresh('value', this.options.value, false);
  // trigger messagesShownChanged for messagesShown if it's non-empty.
  // this.options['messagesShown'] would have been
  // updated in _ComponentCreate if messagesCustom was non-empty. Because we are setting
  // the 'changed' flag to true, the messagesShownChanged event will be fired, and that's what we want.
  if (this.options.messagesShown.length > 0) {
    this._setMessagesOption('messagesShown', this.options.messagesShown, null, true);
  }
};
/**
 * Called when converter option changes and we have the new converter.
 *
 * @private
 * @ignore
 */
EditableValueUtils._ResetConverter = function () {
  var displayValue;

  this._getComponentMessaging().update(
    this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.CONVERTER_HINT)
  );

  if (this._hasInvalidMessagesShowing()) {
    this._clearComponentMessages();
    displayValue = this._GetDisplayValue();
    // runs full validation on the display value. May be async
    this._SetValue(displayValue, null, EditableValueUtils.converterOptionOptions);
  } else {
    // refresh UI display value when there was no need to run full validation
    this._Refresh('converter', this.options.converter, true);
  }
};

/**
 * Returns an array of all validators built by merging the validators option set on the component
 * and the implicit validators setup by the component. <br/>
 * This does not include the implicit required validator. Components can override to add to this
 * array of validators.
 *
 * @return {Array} of validators
 *
 * @private
 * @ignore
 */
EditableValueUtils._GetNormalizedValidatorsFromOption = function () {
  var i;
  var isValidatorInstance = true;
  var normalizedValidators = [];
  var validator;
  var validatorsOption;
  var vOptions;
  var vType;
  var vTypeStr;

  validatorsOption = this.options.validators;

  if (validatorsOption) {
    // Normalize validators
    for (i = 0; i < validatorsOption.length; i++) {
      validator = validatorsOption[i];
      if (typeof validator === 'object') {
        // check if we have an actual validator instance that implements the validate() method
        // oj.Validation.__doImplementsCheck(validator, oj.Validator);
        if (!(validator.validate && typeof validator.validate === 'function')) {
          isValidatorInstance = false;
        }

        if (!isValidatorInstance) {
          // we maybe dealing with an object literal
          // {'type': 'numberRange', 'options': { 'min': 100, 'max': 1000,
          //                                    'hint': {'min': 'some hint about min'}}}
          vTypeStr = validator.type;
          if (vTypeStr && typeof vTypeStr === 'string') {
            if (oj.Validation && oj.Validation.validatorFactory) {
              vType = oj.Validation.validatorFactory(vTypeStr);
            } else {
              error(
                'oj.Validation.validatorFactory is not available and it is needed to support the deprecated json format for validators property. Please include the backward compatibility "ojvalidation-base" module.'
              );
            }
            if (vType) {
              vOptions = oj.CollectionUtils.copyInto({}, validator.options) || {};
              // we push converter into the options if not provided explicitly. This is to allow
              // validators to format values shown in the hint and messages
              vOptions.converter = vOptions.converter || this._GetConverter();
              vOptions.label = vOptions.label || this._getLabelText();
              validator = vType.createValidator(vOptions);
            }
          }
        }

        normalizedValidators.push(validator);
      } else {
        error('Unable to parse the validator provided:' + validator);
      }
    }
  }
  return normalizedValidators;
};
/**
 * Returns an array of all async validators built by the async-validators attribute
 * set on the component. In this release, Objects that have validate method (
 * and also they could have a hint property) are considered AsyncValidators and
 * AsyncValidator Objects. In future releases we will allow Objects with types, like
 * {'type': 'numberRange',
 * 'options': { 'min': 100, 'max': 1000, 'hint': {'min': 'some hint about min'}}}
 *
 * @return {Array} of async validators
 *
 * @private
 * @ignore
 */
EditableValueUtils._GetNormalizedAsyncValidatorsFromOption = function () {
  var i;
  var normalizedValidators = [];
  var validator;
  var validatorsOption;

  validatorsOption = this.options.asyncValidators;

  // Normalize validators
  for (i = 0; i < validatorsOption.length; i++) {
    validator = validatorsOption[i];
    if (typeof validator === 'object') {
      // check if we have an actual asyncvalidator object that implements the validate() method
      if (validator.validate && typeof validator.validate === 'function') {
        normalizedValidators.push(validator);
      }
    } else {
      error('Unable to parse the validator provided:' + validator);
    }
  }

  return normalizedValidators;
};
/**
 * Returns the normalized converter instance.
 * This could return a Promise during component initialization or when changing the
 * component's converter property.
 *
 * @return {Object|null|Promise<Object>|Promise<null>} a converter instance or null
 * or a Promise to a converter instance or null.
 *
 * @private
 * @ignore
 */
EditableValueUtils._GetConverter = function () {
  var converterOption;
  var converterInstanceReturn;
  var self = this;
  var converterPromise;

  // this._converter holds the instance
  if (!this._converter) {
    converterOption = this.options.converter;
    if (converterOption instanceof Promise) {
      converterPromise = converterOption;
    } else {
      converterInstanceReturn = ConverterUtils.getConverterInstance(converterOption);
    }

    if (converterPromise) {
      return converterPromise.then(function (ci) {
        self._converter = ci;
        return self._converter || null;
      });
    }
    this._converter = converterInstanceReturn;
  }

  return this._converter || null;
};

/**
 * Set busy state for component for async validators for the displayValue.
 * We want to clear busy state for the same displayValue, not for a different displayValue.
 * I suppose if they type in 111, then 222, then 111, we may clear for second 111 before first,
 * but that seems incredibly unlikely.
 * @param {string} displayValue the displayValue busystate we want to set
 *
 * @private
 * @ignore
 */
EditableValueUtils._SetBusyState = function (displayValue) {
  if (this._resolveBusyStateAsyncMap === undefined) {
    // eslint-disable-next-line no-undef
    this._resolveBusyStateAsyncMap = new Map();
  }

  var resolveBusyStateAsync = this._resolveBusyStateAsyncMap.get(displayValue);

  // Set a page-level busy state if not already set for this displayValue
  if (!resolveBusyStateAsync) {
    var domElem = this.element[0];
    var busyContext = Context.getContext(domElem).getBusyContext();
    var description = 'The page is waiting for async validators for displayValue ' + displayValue;

    if (domElem && domElem.id) {
      description += ' for "' + domElem.id + '" ';
    }
    description += 'to finish.';

    resolveBusyStateAsync = busyContext.addBusyState({ description: description });
    this._resolveBusyStateAsyncMap.set(displayValue, resolveBusyStateAsync);
  }
};

/**
 * Clear busy state for async validators for the displayValue.
 * @param {string} displayValue the displayValue busystate we want to clear
 * @private
 * @ignore
 */
EditableValueUtils._ClearBusyState = function (displayValue) {
  var resolveBusyStateAsync;
  if (this._resolveBusyStateAsyncMap !== undefined) {
    resolveBusyStateAsync = this._resolveBusyStateAsyncMap.get(displayValue);
    if (resolveBusyStateAsync) {
      resolveBusyStateAsync();
      this._resolveBusyStateAsyncMap.delete(displayValue);
    }
  }
};

/**
 * Set busy state for component for async validators hint.
 * We want to clear busy state for the same hint not for a different hint.
 * I use a counter here.
 * @param {number} counter the counter for the busystate we want to set
 *
 * @private
 * @ignore
 */
EditableValueUtils._SetBusyStateAsyncValidatorHint = function (counter) {
  if (this._resolveBusyStateAsyncValidatorHintMap === undefined) {
    // eslint-disable-next-line no-undef
    this._resolveBusyStateAsyncValidatorHintMap = new Map();
  }

  var resolveBusyStateAsyncHint = this._resolveBusyStateAsyncValidatorHintMap.get(counter);

  // Set a page-level busy state if not already set for this counter
  if (!resolveBusyStateAsyncHint) {
    var domElem = this.element[0];
    var busyContext = Context.getContext(domElem).getBusyContext();
    var description = 'The page is waiting for async validator hint for counter ' + counter;

    if (domElem && domElem.id) {
      description += ' for "' + domElem.id + '" ';
    }
    description += 'to finish.';

    resolveBusyStateAsyncHint = busyContext.addBusyState({ description: description });
    this._resolveBusyStateAsyncValidatorHintMap.set(counter, resolveBusyStateAsyncHint);
  }
};

/**
 * Clear busy state for async validators hint for the counter
 * @param {number} counter the counter for the busystate we want to clear
 * @private
 * @ignore
 */
EditableValueUtils._ClearBusyStateAsyncValidatorHint = function (counter) {
  var resolveBusyStateAsyncHint;
  if (this._resolveBusyStateAsyncValidatorHintMap !== undefined) {
    resolveBusyStateAsyncHint = this._resolveBusyStateAsyncValidatorHintMap.get(counter);
    if (resolveBusyStateAsyncHint) {
      resolveBusyStateAsyncHint();
      this._resolveBusyStateAsyncValidatorHintMap.delete(counter);
    }
  }
};

/**
 * Set busy state for component for async converter loading.
 *
 * @private
 * @ignore
 */
EditableValueUtils._SetBusyStateAsyncConverterLoading = function () {
  // Set a page-level busy state if not already set for async converter loading
  if (!this._resolveBusyStateAsyncConverterLoading) {
    var domElem = this.element[0];
    var busyContext = Context.getContext(domElem).getBusyContext();
    var description = 'The page is waiting for async converter loading ';

    if (domElem && domElem.id) {
      description += 'for "' + domElem.id + '" ';
    }
    description += 'to finish.';

    this._resolveBusyStateAsyncConverterLoading = busyContext.addBusyState({
      description: description
    });
  }
};

/**
 * Clear busy state for async converter loading
 * @private
 * @ignore
 */
EditableValueUtils._ClearBusyStateAsyncConverterLoading = function () {
  if (this._resolveBusyStateAsyncConverterLoading !== undefined) {
    this._resolveBusyStateAsyncConverterLoading();
    delete this._resolveBusyStateAsyncConverterLoading;
  }
};

/**
 * Retrieve the delay before showing status
 * @return {number} the delay in ms
 * @private
 * @ignore
 */
EditableValueUtils._getShowLoadingDelay = function () {
  if (this._defaultOptions == null) {
    this._defaultOptions = parseJSONFromFontFamily('oj-form-control-option-defaults');
  }
  var delay = parseInt(this._defaultOptions.showIndicatorDelay, 10);

  return isNaN(delay) ? 0 : delay;
};

/**
 * Set the type of the input element based on virtualKeyboard option.
 *
 * @param {Array.<string>} allowedTypes an array of allowed types
 *
 * @protected
 * @ignore
 */
EditableValueUtils._SetInputType = function (allowedTypes) {
  // Default input type is text
  var inputType = 'text';
  var agentInfo = oj.AgentUtils.getAgentInfo();

  // Only change the type on mobile browsers
  if (
    agentInfo.os === oj.AgentUtils.OS.ANDROID ||
    agentInfo.os === oj.AgentUtils.OS.IOS ||
    agentInfo.os === oj.AgentUtils.OS.WINDOWSPHONE
  ) {
    // Get input type from component's virtualKeyboard option
    if (allowedTypes.indexOf(this.options.virtualKeyboard) >= 0) {
      inputType = this.options.virtualKeyboard;
    } else {
      // Get input type from converter's virtualKeyboardHint option
      var converter = this._GetConverter();
      if (converter && converter.resolvedOptions) {
        var resOptions = converter.resolvedOptions();
        if (allowedTypes.indexOf(resOptions.virtualKeyboardHint) >= 0) {
          inputType = resOptions.virtualKeyboardHint;
        }
      }
    }
  }

  if (inputType == null) {
    this.element[0].removeAttribute('type');
  } else {
    this.element[0].setAttribute('type', inputType);
  }
};

/**
 * Draw a readonly div. When readonly, this div is shown and
 * the input has display:none on it through theming, and vice versa.
 * We set the textContent in _SetDisplayValue() if readonly
 * @param {HTMLElement} pass in this.element[0]
 * @return {HTMLElement|null} the readonlyDivElem or null if we don't want
 * to use a readonly div.
 * @private
 * @ignore
 */
EditableValueUtils._createReadonlyDiv = function (element) {
  if (this._UseReadonlyDiv()) {
    var readonlyElem = document.createElement('div');
    readonlyElem.classList.add('oj-text-field-readonly-div');

    // create this inner element that holds the text.  This is needed
    // so that we can put flexbox styles on the oj-text-field-readonly-div
    // to have the text vertically centered in the div.
    var readonlyInnerElem = document.createElement('div');
    readonlyInnerElem.classList.add('oj-text-field-readonly');
    readonlyInnerElem.setAttribute('role', 'textbox');
    readonlyInnerElem.setAttribute('aria-readonly', true);

    readonlyElem.appendChild(readonlyInnerElem);

    element.parentNode.insertBefore(readonlyElem, element); // @HTMLUpdateOK
    // return the element that we need to set textContent, aria-labelledby, etc.
    return readonlyInnerElem;
  }
  return null;
};

/**
 * Returns the inner readonly div HTMLElement that we need to set textContent,
 * aria-labelledby, etc.
 * @private
 * @ignore
 */
EditableValueUtils._getReadonlyDiv = function () {
  return this.widget()[0].querySelector('.oj-text-field-readonly');
};

/**
 * The various validation modes
 * @ignore
 */

var _sValidationMode = {
  FULL: 1,
  VALIDATORS_ONLY: 2,
  REQUIRED_VALIDATOR_ONLY: 3
};

/**
 * The displayOptions property default options when theme is Redwood
 * @ignore
 */
var _sDisplayOptionsRedwoodDefaults = {
  MESSAGES: 'display',
  VALIDATOR_HINT: 'display',
  CONVERTER_HINT: 'display'
};

/**
 * The displayOptions property default options when theme is Alta
 * As of v9.0, the Alta theme is deprecated.
 * @ignore
 */
var _sDisplayOptionsAltaDefaults = {
  MESSAGES: ['inline'],
  VALIDATOR_HINT: ['notewindow'],
  CONVERTER_HINT: ['placeholder', 'notewindow']
};

/**
 * String used in the id on the span that surrounds the help icon.
 * @const
 * @private
 * @type {string}
 */
var _HELP_ICON_ID = '_helpIcon';

/**
 * valid state constants
 * @const
 * @private
 * @type {string}
 */
var _VALID = 'valid';

/**
 * valid state constants
 * @const
 * @private
 * @type {string}
 */
var _INVALID_HIDDEN = 'invalidHidden';

/**
 * valid state constants
 * @const
 * @private
 * @type {string}
 */
var _INVALID_SHOWN = 'invalidShown';

/**
 * valid state constants
 * @const
 * @private
 * @type {string}
 */
var _PENDING = 'pending';

// E D I T A B L E V A L U E    A B S T R A C T   W I D G E T
/**
 * @ojcomponent oj.editableValue
 * @augments oj.baseComponent
 * @ojsignature [{
 *                target: "Type",
 *                value: "abstract class editableValue<V, SP extends editableValueSettableProperties<V, SV, RV>, SV= V, RV= V> extends baseComponent<SP>"
 *               },
 *               {
 *                target: "Type",
 *                value: "editableValueSettableProperties<V, SV=V, RV=V> extends baseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojtsimport {module: "ojmessaging", type:"AMD", importName: "Message"}
 * @abstract
 * @since 0.6.0
 * @ojshortdesc Abstract EditableValue element
 * @ojrole input
 * @hideconstructor
 *
 * @classdesc
 * Abstract base class for all editable components that are value holders and that require
 * validation and messaging capabilities. <br/>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
 *  * <p>
 * Note: The <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>,
 * <code class="prettyprint">converter</code> properties and the <code class="prettyprint">validate</code>
 * method are not on all EditableValue components so they are not on the EditableValue class.
 * See the EditableValue subclasses for which ones have which of these properties. For example,
 * oj-switch, oj-slider, oj-color-palette, and oj-color-spectrum do not have the
 * <code class="prettyprint">validate</code> method nor do they have the
 * <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>,
 * <code class="prettyprint">converter</code> properties since the components
 * wouldn't do anything with these properties anyway. A user can't type into these components and there
 * is no visual representation for 'nothing is set' on these components. Whereas InputBase, inputNumber,
 * inputSearch and combobox do have these properties since a user can type into the field (so you may
 * need to convert it and validate it) and also blank it out (so you may need to mark it required and
 * run the required validator).
 * </p>

 * <p>
 * <h3 id="declarative-binding-section">
 * Declarative Binding
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#declarative-binding-section"></a>
 * </h3>
 * When the component's <code class="prettyprint">value</code> property is bound to a Knockout
 * observable and when the value changes, whether the observable is updated or not, and whether a
 * 'writeback' to the observable happens or not, depends on the action that caused the value to
 * change.
 * <ul>
 * <li>when the value changes as a result of user interaction </li>
 * <li>when the value changes because normal validation was run as a result of these properties
 * being changed by the app - <code class="prettyprint">converter</code>, <code class="prettyprint">disabled</code>,
 * <code class="prettyprint">required</code>, <code class="prettyprint">validators</code>, then the
 * value is written to the observable. See the specific property docs for details.</li>
 * <li>when the value changes because normal validation was run as a result of these methods being
 * called by the app -
 * <code class="prettyprint">refresh</code>, <code class="prettyprint">validate</code>,
 * then the value is written to the observable. See the specific method docs for details.</li>
 * <li>when the value changes due to programmatic intervention by app then the value is not written
 * back to observable. This is based on the assumption that the app has mutated the observable
 * already. In this case updating the component's <code class="prettyprint">value</code> property
 * alone will not propagate the change automatically to the observable. Updating the observable is
 * recommended as this will propagate the change automatically to the component.
 * </li>
 * </ul>
 * </p>
 *
 * @example <caption>Initialize component</caption>
 * &lt;oj-input-text id="foo" value="abc"/&gt;
 * @example <caption>Initialize component value using two way data binding</caption>
 * &lt;oj-input-text id="foo" value="{{salary}}"/&gt;
 * &lt;script&gt;
 * &nbsp;&nbsp;var salary = ko.observable('abc');
 * &lt;/script&gt;
 */
oj.__registerWidget(
  'oj.editableValue',
  $.oj.baseComponent,
  {
    widgetEventPrefix: 'oj',

    options: {
      /**
       * The oj-label sets the described-by attribute programmatically on the form component.
       * This attribute is not meant to be set by an application developer directly.
       * The described-by is copied to the aria-describedby
       * attribute on the component's inner dom element, and it is needed
       * for accessibility.
       * @example <caption>Initialize component with the <code class="prettyprint">described-by</code> attribute specified:</caption>
       * &lt;oj-some-element described-by="someId">&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">describedBy</code> property after initialization:</caption>
       * // getter
       * var descById = myComp.describedBy;
       *
       * // setter
       * myComp.describedBy = "someId";
       *
       * @ojshortdesc The form component's oj-label automatically sets described-by
       * to make it accessible. It is not meant to be set by application developer.
       * @expose
       * @type {?string}
       * @public
       * @instance
       * @memberof oj.editableValue
       * @since 4.0.0
       */
      describedBy: null,
      /**
       * Whether the component is disabled. The default is false.
       *
       * <p>
       * When the <code class="prettyprint">disabled</code> property changes due to programmatic
       * intervention, the component may clear messages and run validation in some cases. </br>
       * <ul>
       * <li>when a required component is initialized as disabled
       * <code class="prettyprint">value="{{currentValue}}" required disabled</code>,
       * deferred validation is skipped.</li>
       * <li>when a disabled component is enabled,
       *  <ul>
       *  <li>if component is invalid and showing messages then all component messages are cleared,
       *  and full validation run using the display value.
       *   <ul>
       *    <li>if there are validation errors, they are shown.</li>
       *    <li>if no errors result from the validation, the <code class="prettyprint">value</code>
       *    property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
       *    event to clear custom errors.</li>
       *   </ul>
       *  </li>
       *
       *  <li>if component is valid and has no errors then deferred validation is run.
       *    <ul>
       *    <li>if there is a deferred validation error, then the valid property is updated. </li>
       *    </ul>
       *  </li>
       *  <li>if component is invalid and deferred errors then component messages are cleared and
       *  deferred validation re-run.
       *    <ul>
       *    <li>if there is a deferred validation error, then the valid property is updated.</li>
       *    </ul>
       *  </li>
       *  </ul>
       * </li>
       * <li>when enabled component is disabled then no validation is run and the component appears
       * disabled.</li>
       * </ul>
       * </p>
       *
       * @example <caption>Initialize component with <code class="prettyprint">disabled</code> attribute:</caption>
       * &lt;oj-some-element disabled>&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
       * // getter
       * var disabled = myComp.disabled;
       *
       * // setter
       * myComp.disabled = false;
       *
       * @ojshortdesc Specifies whether the component is disabled. The default is false.
       * @expose
       * @type {boolean}
       * @default false
       * @public
       * @instance
       * @memberof oj.editableValue
       * @since 0.7.0
       */
      disabled: false,
      displayOptions: {},
      /**
       * Form component help information.
       * @expose
       * @memberof oj.editableValue
       * @instance
       * @public
       * @type {Object}
       * @since 0.7.0
       */
      help: undefined,
      /**
       * <p>help definition text.  See the top-level <code class="prettyprint">help</code> option for details.
       *
       * @expose
       * @name help.definition
       * @memberof! oj.editableValue
       * @instance
       * @type {?string}
       * @ignore
       * @default null
       *
       * @example <caption>Get or set the <code class="prettyprint">help.definition</code> sub-option, after initialization:</caption>
       * // getter
       * var definitionText = myInputComp.help.definition;
       *
       * // setter:
       * myInputComp.help.definition = "Enter your name";
       */
      /**
       * <p>help source url.  See the top-level <code class="prettyprint">help</code> option for details.
       *
       * @expose
       * @name help.source
       * @memberof! oj.editableValue
       * @instance
       * @ignore
       * @type {?string}
       * @default null
       *
       * @example <caption>Get or set the <code class="prettyprint">help.source</code> sub-option, after initialization:</caption>
       * // getter
       * var helpSource = myInputComp.help.source;
       *
       * // setter:
       * myInputComp.help.source = "www.abc.com";
       */
      /**
       * <p>
       * The helpHints object contains a definition property and a source property.
       * </p>
       * <ul>
       * <li><code class="prettyprint">definition</code> - hint for help definition text.</li>
       * <li><code class="prettyprint">source</code> - hint for help source URL.</li>
       * </ul>
       *
       * @example <caption>Initialize the component with help hints:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-some-element help-hints.definition='some value' help-hints.source='some-url'>&lt;/oj-some-element>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-some-element help-hints='{"definition":"some value", "source":"some-url"}'>&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">helpHints</code> property after
       * initialization:</caption>
       *
       * // Get one
       * var value = myComponent.helpHints.definition;
       *
       * // Set one, leaving the others intact. Always use the setProperty API for
       * // subproperties rather than setting a subproperty directly.
       * myComponent.setProperty('helpHints.definition', 'some new value');
       *
       * // Get all
       * var values = myComponent.helpHints;
       *
       * // Set all.  Must list every subproperty, as those not listed are lost.
       * myComponent.helpHints = {
       *     definition: 'some new value',
       *     source: 'some-new-url'
       * };
       *
       * @ojshortdesc Represents hints for an oj-form-layout element to render help information on the label of the editable component.
       * @expose
       * @access public
       * @memberof oj.editableValue
       * @ojtranslatable
       * @instance
       * @type {Object}
       * @since 4.1.0
       */
      helpHints: {
        /**
         * A type of user assistance text. User assistance text is used to provide
         * guidance to help the user understand what data to enter or select. help-hints could
         * come from a help system.
         * <p>In the Redwood theme for clarity only one user assistance text shows to the user.
         * The precedence rules are:
         * <ul>
         * <li>help.instruction shows;</li>
         * <li>if no help.instruction, then validator hint shows;</li>
         * <li>if no help.instruction or validator hint, then help-hints.definition shows;</li>
         * <li>if no help.instruction, validator hint, or help-hints.definition, then converter hint shows.</li>
         * <li>help-hints.source always shows along side the above.</li>
         * </ul>
         * </p>
         * <p>
         * In the Redwood theme, by default all user assistance text shows inline.
         * For input components, it shows when the field takes focus. In other components it
         * shows all the time. See the user-assistance-density property for other ways the user
         * assistance text can render.
         * </p>
         * <p>In the Alta theme the help-hint.definition shows up when
         * the user hovers over the help icon on the label,
         * or tabs into the help icon, or press and holds the help icon on a mobile device.
         * </p>
         * <p>No formatted text is available for help definition attribute.</p>
         *
         * <p>See the <a href="#helpHints">help-hints</a> attribute for usage examples.</p>
         *
         * @ojshortdesc Hint for help definition text associated with the label.
         * @expose
         * @name helpHints.definition
         * @memberof! oj.editableValue
         * @instance
         * @type {string}
         * @ojsignature {target:"Type", value: "?"}
         * @default ""
         * @since 4.1.0
         */
        definition: '',
        /**
         * Help source URL associated with the component.
         * <p>In the Redwood theme, the help-hints.source will show as a link inline to the field.
         * For input components, it shows when the field takes focus. For other components,
         * it shows all the time.
         * </p>
         * <p>In the Alta theme, the help-hints.source will show as a a help icon
         *  next to the label. When clicked the page will navigate to the source url.
         * </p>
         * <p>
         * For security reasons we only support urls with protocol 'http:' or 'https:'.
         * If the url doesn't comply we ignore it and throw an error.
         * Pass in an encoded URL since we do not encode the URL.</p>
         *
         * <p>See the <a href="#helpHints">help-hints</a> attribute for usage examples.</p>
         *
         * @ojshortdesc Help source URL associated with the component.
         * @expose
         * @name helpHints.source
         * @memberof! oj.editableValue
         * @instance
         * @type {string}
         * @ojsignature {target:"Type", value: "?"}
         * @default ""
         * @since 4.1.0
         */
        source: ''
      },
      /**
       * Represents a hint for rendering a label on the component.
       * <p>This is used in combination with the <a href="#labelEdge">label-edge</a> attribute to control how the label should be rendered.</p>
       *
       * <p>
       * When label-edge is "provided", it gives a hint to oj-form-layout parent element to create an oj-label element for the component.
       * When the <code class="prettyprint">label-hint</code> attribute changes, oj-form-layout element refreshes to
       * display the updated label information.
       * </p>
       * <p>
       * When label-edge is "inside", it gives a hint to the component itself to render a label.
       * </p>
       * <p>
       * When label-edge is "none", and if the component has no labelled-by, aria-label, or aria-labelledby attribute, the label-hint value will be used as the aria-label.
       * </p>
       *
       * @example <caption>Add the component as a direct child of oj-form-layout. Initialize the component with the <code class="prettyprint">label-hint</code> attribute specified.</caption>
       * &lt;oj-form-layout id= 'someId'>
       * &lt;/oj-some-element label-hint='input label'>&lt;/oj-some-element>
       * &lt;/oj-form-layout>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelHint</code> property after
       * initialization:</caption>
       *
       * // getter
       * var value = myComponent.labelHint;
       *
       * // setter
       * myComponent.labelHint = 'some new value'
       *
       * @ojshortdesc Represents a hint for oj-form-layout element to render a label on the editable component.
       * @expose
       * @access public
       * @instance
       * @name labelHint
       * @ojtranslatable
       * @default ""
       * @memberof oj.editableValue
       * @type {string}
       * @since 4.1.0
       */
      labelHint: '',

      /**
       * Specifies how the label of the component is created when the <code class="prettyprint">label-hint</code> attribute is set on the component.
       * <p>The default value varies by theme, and it works well for the theme in most cases.
       *  If the component is in an oj-form-layout, the label-edge attribute could come from the oj-form-layout's label-edge attribute.
       * The oj-form-layout component uses the <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
       * <code class="prettyprint">provide</code> property to provide and uses the <a href="MetadataTypes.html#ProvideProperty">MetadataTypes.ProvideProperty</a>
       * <code class="prettyprint">transform</code> property to transform its <code class="prettyprint">label-edge</code>
       * attribute to any descendent components that are configured to consume it.
       * For example, if the oj-form-layout's label-edge attribute is set to "top" or "start", and a descendent form component does
       * not have its label-edge attribute set, the form component's label-edge will be the transformed value "provided".</p>
       * @ojshortdesc Defines how the label of a component is created. See the Help documentation for more information.
       * @access public
       * @expose
       * @name labelEdge
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "'inside'|'none'|'provided'",  jsdocOverride: true}
       * @memberof! oj.editableValue
       * @ojvalue {string} "inside" The component creates the label using the <code class="prettyprint">label-hint</code> attribute.
       * <p>For text input components (such as oj-input-text), the label floats over the input element but moves up on focus or when the component has a value.</p>
       * <p>For non-text input components (such as oj-checkboxset), the label is created at the top of the component and doesn't move.</p>
       * @ojvalue {string} "none" The component will not have a label, regardless of whether it's in an oj-form-layout or not.
       * <p>If the component has a <code class="prettyprint">label-hint</code> attribute but no labelled-by, aria-label, or aria-labelledby attribute, the label-hint value will be used as the aria-label.</p>
       * <p>Note that if the component already has an external label, "none" should not be specified and "provided" should be used instead.
       * Otherwise it may end up with conflicting label information.</p>
       * @ojvalue {string} "provided" Label is provided by the parent if the parent is an oj-form-layout.
       * <p>oj-form-layout provides the label using the label-hint from the form control and the <a href="oj.ojFormLayout.html#labelEdge">label-edge</a> from oj-form-layout.</p>
       * <p>If there is no oj-form-layout, use an oj-label.</p>
       * @since 8.0.0
       */
      labelEdge: undefined,

      /**
       * List of messages an app would add to the component when it has business/custom validation
       * errors that it wants the component to show. This allows the app to perform further validation
       * before sending data to the server. When this option is set the message shows to the
       * user right away. To clear the custom message, set <code class="prettyprint">messagesCustom</code>
       * back to an empty array.<br/>
       * <p>Each message in the array is an object that duck types oj.Message.
       * See {@link Message} for details.
       * message detail text can include formatted HTML text, whereas
       * hints and message summary text cannot. If you use formatted text, it should be accessible
       * and make sense to the user if formatting wasn't there.
       * The allowed html tags are: span, b, i, em, br, hr, li, ol, ul, p, small, pre.
       * To format the message detail, you could do this:
       * <pre class="prettyprint"><code>&lt;html>Enter &lt;b>at least&lt;/b> 6 characters&lt;/html></code></pre>
       * </p>
       * <p>
       * See the <a href="#validation-section">Validation and Messages</a> section
       * for details on when the component clears <code class="prettyprint">messagesCustom</code>;
       * for example, when full validation is run.
       * </p>
       * <p>In the Redwood theme, the Message summary is not displayed to the user, so make sure to have a Message detail
       * set in your Message object.
       * </p>
       *
       *
       * @example <caption>Get or set the <code class="prettyprint">messagesCustom</code> property after initialization:</caption>
       * // getter
       * var customMsgs = myComp.messagesCustom;
       *
       * // setter
       * myComp.messagesCustom = [{summary:"hello", detail:"detail", severity:Message.SEVERITY_LEVEL.INFO}];
       *
       * @example <caption>Set messagesCustom when there are cross-validation errors:</caption>
       * --- HTML ---
       * &lt;oj-some-element messages-custom='{{messagesCustom}}'>&lt;/oj-some-element>
       *
       * --- ViewModel code ---
       * self.messagesCustom = ko.observableArray([]);
       *
       * // the app's function that gets called when the user presses the submit button
       * if (!myValidateCrossValidationFields())
       * {
       *   // the app adds a custom messages to the component and it is displayed right away
       *   var msgs = [];
       *   msgs.push({'summary':'Cross field error', 'detail':'Field 1 needs to be less than Field 2'});
       *   self.messagesCustom(msgs);
       * }
       * else
       * {
       *   // submit data to the server
       * }
       *
       * @ojshortdesc A list of messages added by an application to the component. See the Help documentation for more information.
       * @expose
       * @access public
       * @instance
       * @memberof oj.editableValue
       * @default []
       * @type {Array.<Object>}
       * @ojsignature {target: "Type", value: "Array<oj.Message>"}
       * @since 0.7.0
       * @ojwriteback
       */
      messagesCustom: [],

      /**
       * List of messages currently hidden on component, these are added by component when it runs
       * deferred validation. Each message in the array is an object that duck types oj.Message.
       * See {@link Message} for
       * details. <br/>
       *
       * <p>
       * This is a read-only option so page authors cannot set or change it directly.
       * </p>
       *
       * <p>
       * These messages are not shown to the end-user by default, but page author
       * can show hidden messages using the {@link showMessages} method.
       * </p>
       *
       * @example <caption>Get <code class="prettyprint">messagesShown</code> for the component:</caption>
       * // Foo is InputText, InputNumber, Select, etc.
       * var messages = myInputComp.messagesShown;
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.editableValue
       * @default []
       * @type {Array.<Object>|undefined}
       * @since 0.7.0
       * @see #showMessages
       * @readonly
       * @ignore
       * @ojwriteback
       */
      messagesHidden: undefined,

      /**
       * List of messages currently shown on component, these include messages generated both by the
       * component and ones provided by app using <code class="prettyprint">messagesCustom</code>.
       * Each message in the array is an object that duck types oj.Message.
       * See {@link Message} for details. <br/>
       *
       * <p>
       * This is a read-only option so page authors cannot set or change it directly.
       * </p>
       *
       * <p>
       * Messages retrieved using the <code class="prettyprint">messagesShown</code> option are by
       * default shown inline, but this can be controlled using the 'messages' property of
       * the <code class="prettyprint">displayOptions</code> option.
       * </p>
       *
       * @example <caption>Get <code class="prettyprint">messagesShown</code> for the component:</caption>
       * // Foo is InputText, InputNumber, Select, etc.
       * var messages = myInputComp.messagesShown;
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.editableValue
       * @default []
       * @type {Array.<Object>|undefined}
       * @since 0.7.0
       * @readonly
       * @ignore
       * @ojwriteback
       */
      messagesShown: undefined,
      /**
       * A type of user assistance text. User assistance text is used to provide
       * guidance to help the user understand what data to enter or select.
       * <p> In the Redwood theme for clarity only one user assistance text shows to the user.
       *  The precedence rules are:
       * <ul>
       * <li>help.instruction shows;</li>
       * <li>if no help.instruction, then validator hint shows;</li>
       * <li>if no help.instruction or validator hint, then help-hints.definition shows;</li>
       * <li>if no help.instruction, validator hint, or help-hints.definition, then converter hint shows.</li>
       * <li>help-hints.source always shows along side the above.</li>
       * </ul>
       * </p>
       * <p>In the Redwood theme, by default all user assistance text shows inline.
       * For input components, it shows when the field takes focus. In other components
       * it shows all the time. See the user-assistance-density property for other ways
       * the user assistance text can render.
       * <p>
       *  In Alta theme, help.instruction
       * displays in a notewindow when the field takes focus. How is help.instruction better than the html 'title' attribute?
       * The html 'title' attribute only shows up as a tooltip on mouse over, not on keyboard and not in a mobile
       * device. So the html 'title' would only be for text that is not important enough to show all users, or
       * for text that you show the users in another way as well, like in the label.
       * Also you cannot theme the native browser's title window like you can the JET
       * notewindow, so low vision users may have a hard time seeing the 'title' window.
       * For these reasons, the JET EditableValue components do not use the HTML's 'title'
       * attribute and instead use the help.instruction attribute.
       * </p>
       *
       * <p>
       * To include formatted text in the help.instruction, format the string using html tags.
       * The allowed html tags are: span, b, i, em, br, hr, li, ol, ul, p, small, pre.
       * For example the
       * help.instruction might look like:
       * <pre class="prettyprint"><code>&lt;oj-some-element help.instruction="&lt;html>Enter &lt;b>at least&lt;/b> 6 characters&lt;/html>">&lt;/oj-some-element></code></pre>
       * If you use formatted text, it should be accessible
       * and make sense to the user if formatting wasn't there.
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">help.instruction</code> sub-attribute:</caption>
       * &lt;oj-some-element help.instruction="some tooltip">&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">help.instruction</code> property after initialization:</caption>
       * // Get one subproperty
       * var instr = myComp.help.instruction;
       *
       * // Set one subproperty, leaving the others intact. Use the setProperty API for
       * // subproperties so that a property change event is fired.
       * myComponent.setProperty('help.instruction', 'some new value');
       *
       * // Get all
       * var values = myComponent.help;
       *
       * // Set all.  Must list every resource key, as those not listed are lost.
       * myComponent.help = {
       *   instruction: 'some new value'
       * };
       *
       * @ojshortdesc Represents advisory information for the component, such as would be appropriate for a tooltip.
       * @expose
       * @access public
       * @instance
       * @name help.instruction
       * @ojtranslatable
       * @default ""
       * @memberof! oj.editableValue
       * @type {string=}
       * @since 4.0.0
       */
      title: '',
      /**
       * <p>
       * Specifies the density of the form component's user assistance presentation.
       * It can be shown inline with reserved rows to prevent reflow if
       * a user assistance text shows up, inline without reserved rows that would reflow if
       * a user assistance text shows up,
       * or it can be shown compactly in a popup instead.</p>
       * <p>
       * The default value is 'reflow' when the form component is not a descendent of an oj-form-layout
       * component. When the form component is a descendent of an oj-form-layout, the default value comes from the
       * oj-form-layout's <code class="prettyprint">user-assistance-density</code> attribute value.
       * </p>
       * <p>
       * The oj-form-layout component uses the
       * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
       * <code class="prettyprint">provide</code> property to provide its
       * <code class="prettyprint">user-assistance-density</code>
       * attribute value to be consumed by descendent components.
       * The form components are configured to consume the
       * <code class="prettyprint">user-assistance-density</code> property if an
       * ancestor provides it and it is not explicitly set on the form component.
       * Example, oj-form-layout defaults user-assistance-density='efficient', so all its
       * form components descendents will have user-assistance-density='efficient' by default.
       * </p>
       * @ojshortdesc Specifies the density of the form component's user assistance presentation.
       * @access public
       * @expose
       * @name userAssistanceDensity
       * @ojunsupportedthemes ["Alta"]
       * @default "reflow"
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "'reflow'|'efficient'|'compact'",  jsdocOverride: true}
       * @memberof oj.editableValue
       * @ojvalue {string} "reflow" Messages, help, hints, and required are all shown inline under the field with no reserved space.
       * @ojvalue {string} "efficient" Messages, help, hints, and required are all shown inline under the field with reserved space.
       * @ojvalue {string} "compact" Messages, help, hints, and required will not be shown inline; they will show in a mode that keeps the screen more compact, like
       * a popup for the messages, and a required icon to indicate Required.
       * @since 9.0.0
       */
      userAssistanceDensity: 'reflow',
      /**
       * <p>
       * The current valid state of the component. It is evaluated on initial render.
       * It is re-evaluated
       * <ul>
       *   <li>after each validator (validators or async-validators) is run (full or deferred)</li>
       *   <li>when messagesCustom is updated,
       *   since messagesCustom can be added by the app developer any time.</li>
       *   <li>when showMessages() is called. Since showMessages() moves the
       *   hidden messages into messages shown,
       *   if the valid state was "invalidHidden" then it would become "invalidShown".</li>
       *   <li>when the required property has changed. If a component is empty and has required
       *   set, the valid state may be "invalidHidden" (if no invalid messages are being shown as well).
       *   If required property is removed, the valid state would change to "valid".</li>
       * </ul>
       * </p>
       * <p>
       *  Note: New valid states may be added to the list of valid values in future releases.
       *  Any new values will start with "invalid"
       *  if it is an invalid state, "pending" if it is pending state,
       *  and "valid" if it is a valid state.
       * </p>
       * @example <caption>Get <code class="prettyprint">valid</code> attribute, after initialization:</caption>
       * // Getter:
       * var valid = myComp.valid;
       * @example <caption>Set the <code class="prettyprint">on-valid-changed</code>
       *  listener so you can do work in the ViewModel based on the
       *  <code class="prettyprint">valid</code> property:</caption>
       * &lt;oj-some-element id='username' on-valid-changed='[[validChangedListener]]'>
       * &lt;/oj-some-element>
       * &lt;oj-some-element id='password' on-valid-changed='[[validChangedListener]]'>
       * &lt;/oj-some-element>
       * &lt;oj-button disabled='[[componentDisabled]]' on-click='[[submit]]'>Submit&lt;/oj-button>
       * -- ViewModel --
       * self.validChangedListener = function (event) {
       *   var enableButton;
       *   var usernameValidState;
       *   var passwordValidState;
       *
       *   // update the button's disabled state.
       *   usernameValidState = document.getElementById("username").valid;
       *   passwordValidState = document.getElementById("password").valid;
       *
       *   // this updates the Submit button's disabled property's observable based
       *   // on the valid state of two components, username and password.
       *   // It is up to the application how it wants to handle the “pending�? state
       *   // but we think that in general buttons don’t need to be
       *   // enabled / disabled based on the "pending" state.
       *   enableButton =
       *    (usernameValidState !== "invalidShown") &&
       *    (passwordValidState !== "invalidShown");
       *   self.componentDisabled(!enableButton);;
       * };
       *
       * @ojshortdesc The validity state of the component
       * @expose
       * @access public
       * @instance
       * @type {string}
       * @ojvalue {string} "valid" The component is valid
       * @ojvalue {string} "pending" The component is waiting for the validation state to be determined.
       * The "pending" state is set at the start of the convert/validate process.
       * @ojvalue {string} "invalidHidden" The component has invalid messages hidden
       *    and no invalid messages showing. An invalid message is one with severity "error" or higher.
       * @ojvalue {string} "invalidShown" The component has invalid messages showing.
       *  An invalid message is one with severity "error" or higher.
       * @ojwriteback
       * @readonly
       * @memberof oj.editableValue
       * @since 4.2.0
       *
       */
      valid: undefined,

      /**
       * The value of the component.
       *
       * <p>
       * When <code class="prettyprint">value</code> property changes due to programmatic
       * intervention, the component always clears all messages
       * including <code class="prettyprint">messagesCustom</code>, runs deferred validation, and
       * always refreshes UI display value.</br>
       *
       * <h4>Running Validation</h4>
       * <ul>
       * <li>component always runs deferred validation; the
       * <code class="prettyprint">valid</code> property is updated with the result.</li>
       * </ul>
       * </p>
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &lt;oj-some-element value='10'>&lt;/oj-some-element>
       * @example <caption>Get or set <code class="prettyprint">value</code> attribute, after initialization:</caption>
       * // Getter: returns '10'
       * var val = myComp.value;
       * // Setter: sets '20'
       * myComp.value = '20';
       *
       * @ojshortdesc The value of the component.
       * @expose
       * @access public
       * @instance
       * @default null
       * @ojwriteback
       * @ojeventgroup common
       * @memberof oj.editableValue
       * @since 0.6.0
       * @type {any}
       * @ojsignature {
       *                 target: "Accessor",
       *                 value: {
       *                          GetterType: "V|null",
       *                          SetterType: "SV|null"}
       *              }
       */
      value: undefined,

      // Events
      /**
       * Triggered when a default animation is about to start on an element owned by the component.
       *
       * <p>The default animation can be cancelled by calling <code class="prettyprint">event.preventDefault</code>, followed by
       * a call to <code class="prettyprint">event.detail.endCallback</code>.  <code class="prettyprint">event.detail.endCallback</code> should be
       * called immediately after <code class="prettyprint">event.preventDefault</code> if the application merely wants to cancel animation,
       * or it should be called when the custom animation ends if the application is invoking another animation function.  Failure to
       * call <code class="prettyprint">event.detail.endCallback</code> may prevent the component from working properly.</p>
       * <p>For more information on customizing animations, see the documentation of
       * <a href="AnimationUtils.html">AnimationUtils</a>.</p>
       *
       * <caption>The default animations are controlled via the theme:</caption>
       * <pre class="prettyprint"><code>
       * // default animations for notewindow help and hints and messages
       * $popupTailOpenAnimation: (effect: "zoomIn", transformOrigin: "#myPosition") !default;
       * $popupTailCloseAnimation: (effect: "none") !default;
       *
       * // default animations for Redwood's inline messages shown when userAssistanceDensity
       * // is reflow or efficient.
       * $messageComponentInlineOpenAnimation: (effect: "fadeIn", duration: "100ms", timingFunction: "linear") !default;
       * $messageComponentInlineCloseAnimation: (effect: "fadeOut", duration: "100ms", timingFunction: "linear") !default;
       *
       * // default animations for Alta's "inline" display option
       * $messageComponentInlineOpenAnimation: (effect: "expand", startMaxHeight: "#oldHeight") !default;
       * $messageComponentInlineCloseAnimation: (effect: "collapse", endMaxHeight: "#newHeight") !default;
       * </code></pre>
       * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
       *
       * @ojshortdesc Triggered when a default animation is about to start, such as when the component is being opened/closed or a child item is being added/removed.
       *
       * @expose
       * @event
       * @memberof oj.editableValue
       * @since 4.0.0
       * @ojbubbles
       * @ojcancelable
       * @instance
       * @property {string} action The action that triggers the animation.</br></br>
       *                           Supported values are:
       *                              <ul>
       *                                <li>"inline-hints-open" - when an inline helphints container opens</li>
       *                                <li>"inline-hints-close" - when an inline helphints container closes</li>
       *                                <li>"inline-open" - when an inline message container opens or increases in size</li>
       *                                <li>"inline-close" - when an inline message container closes or decreases in size</li>
       *                                <li>"notewindow-open" - when a note window opens</li>
       *                                <li>"notewindow-close" - when a note window closes</li>
       *                              </ul>
       * @property {Element} element The element being animated.
       * @property {function():void} endCallback If the event listener calls event.preventDefault to
       *            cancel the default animation, it must call the endCallback function when it
       *            finishes its own animation handling and any custom animation has ended.
       *
       * @example <caption>Define an event listener for the
       *          <code class="prettyprint">ojAnimateStart</code> event to override the default
       *          "inline-open" animation:</caption>
       * var listener = function( event )
       *   {
       *     // Change the "inline-open" animation for inline message
       *     if (event.detail.action == "inline-open") {
       *       // Cancel default animation
       *       event.preventDefault();
       *       // Invoke new animation and call endCallback when the animation ends
       *       oj.AnimationUtils.fadeIn(event.detail.element).then(event.detail.endCallback);
       *     }
       *   };
       *
       * @example <caption>Define an event listener for the
       *          <code class="prettyprint">ojAnimateStart</code> event to cancel the default
       *          "notewindow-close" animation:</caption>
       * var listener = function( event )
       *   {
       *     // Change the "notewindow-close" animation for note window
       *     if (ui.action == "notewindow-close") {
       *       // Cancel default animation
       *       event.preventDefault();
       *       // Call endCallback immediately to indicate no more animation
       *       event.detail.endCallback();
       *     }
       *   };
       */
      animateStart: null,
      /**
       * Triggered when a default animation has ended.
       * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
       *
       * @expose
       * @event
       * @ojbubbles
       * @ojcancelable
       * @memberof oj.editableValue
       * @since 4.0.0
       * @instance
       * @property {string} action The action that triggered the animation.</br></br>
       *                           Supported values are:
       *                              <ul>
       *                                <li>"inline-open" - when an inline message container opens or increases in size</li>
       *                                <li>"inline-close" - when an inline message container closes or decreases in size</li>
       *                                <li>"notewindow-open" - when a note window opens</li>
       *                                <li>"notewindow-close" - when a note window closes</li>
       *                              </ul>
       * @property {Element} element The element being animated.
       * @example <caption>Define an event listener for the
       *          <code class="prettyprint">ojAnimateEnd</code> event to add any processing after the end of
       *          "inline-open" animation:</caption>
       * var listener = function( event )
       * {
       *   // Check if this is the end of "inline-open" animation for inline message
       *   if (event.detail.action == "inline-open") {
       *     // Add any processing here
       *   }
       * };
       */
      animateEnd: null
    },

    // P U B L I C    M E T H O D S

    // @inheritdoc
    getNodeBySubId: function (locator) {
      var node;
      var subId;

      node = this._super(locator);

      // this subId is only for non-custom element components so skip if custom element
      if (!node && !this._IsCustomElement()) {
        subId = locator.subId;

        if (subId === 'oj-label-help-icon') {
          var label = this._GetLabelElement();

          if (label) {
            node = label.parent().find('.oj-label-help-icon');
          }
        }
      }
      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },

    getSubIdByNode: function (elem) {
      var $node;
      var anchor;
      var div;
      var label;
      var subId = null;

      if (elem != null) {
        $node = $(elem);
        anchor = $node.closest('a.oj-label-help-icon');

        if (anchor != null) {
          // Go up to the top level element of the label
          div = anchor.closest('.oj-label');

          if (div != null) {
            // Now find the actual label
            label = div.find('label')[0];

            if (label) {
              // Make sure the label is the one associated with this component
              if (label === this._GetLabelElement()[0]) {
                subId = { subId: 'oj-label-help-icon' };
              }
            }
          }
        }
      }

      return subId;
    },
    /**
     * whether the component is currently valid.  It is valid if it doesn't have any errors.
     * This method is final; do not override.
     * Currently this is for the widget components and not custom elements.
     * @example <caption>Check whether the component is valid:</caption>
     * var valid = myInputElement.isValid();
     * @returns {boolean}
     * @access public
     * @instance
     * @expose
     * @memberof oj.editableValue
     * @final
     * @ignore
     */
    isValid: function () {
      if (this._valid === undefined) {
        this._valid = !this._hasInvalidMessages();
      }

      return this._valid;
    },

    /**
     * Called when the DOM underneath the component changes requiring a re-render of the component. An
     * example is when the <code class="prettyprint">id</code> for the input changes. <br/>
     * <p>
     * Another time when refresh might be called is when the locale for the page changes. When it
     * changes, attributes used by its converter and validator that are locale specific, its hints,
     * messages and translations will be updated.
     * </p>
     *
     * <p>
     * When <code class="prettyprint">refresh</code> method is called, the component may take various
     * steps such as clearing messages, running validation etc., based on the state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The converter and validators used by the component are reset, and new converter and
     * validator hints is pushed to messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when refresh() is called, the display value is refreshed if component
     * has a converter set.</li>
     * <li>if component is invalid and is showing messages when
     * <code class="prettyprint">refresh()</code> is called, then all component messages are cleared
     * and full validation run using the display value on the component.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   attribute is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   attribute is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when <code class="prettyprint">refresh()</code>
     * is called, then all component messages are cleared and deferred validation is run.</li>
     * </ul>
     * </p>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>If clearing messages only those created by the component are cleared.
     * <li><code class="prettyprint">messagesCustom</code> attribute is not cleared.</li>
     * </ul>
     * </p>
     *
     * @example <caption>Redraw the component element.</caption>
     * myComp.refresh();
     *
     * @access public
     * @instance
     * @expose
     * @return {void}
     * @memberof oj.editableValue
     * @ojshortdesc Called when the DOM underneath the component changes, requiring a re-render of the component.
     * @since 0.7.0
     */
    refresh: function () {
      this._super();
      // doRefresh refreshes value and disabled
      this._doRefresh();
    },

    /**
     * Resets the component by clearing all messages and messages attributes -
     * <code class="prettyprint">messagesCustom</code> -
     * and updates the component's display value using the attribute value. User entered values will be
     * erased when this method is called.
     *
     * @example <caption>Reset component</caption>
     * myComp.reset(); <br/>
     *
     * @access public
     * @instance
     * @expose
     * @return {void}
     * @memberof oj.editableValue
     * @ojshortdesc Resets the component by clearing all messages and messages attributes, and updates the component's display value using the attribute value.
     * @since 0.7.0
     */
    reset: function () {
      this._clearAllMessages();
      // since we are pushing component value to UI, only deferred validation need to be run; this is
      // same as setting value option.
      this._runDeferredValidation(this._VALIDATION_CONTEXT.RESET_METHOD);
      this._refreshComponentDisplayValue(this.options.value, true);
    },

    /**
     * Takes all deferred messages and shows them.
     * It then updates the valid property; e.g.,
     * if the valid state was "invalidHidden"
     * before showMessages(), the valid state will become "invalidShown" after showMessages().
     * <p>
     * If there were no deferred messages this method simply returns.
     * </p>
     *
     *
     * @example <caption>Display all messages including deferred ones.</caption>
     * myComp.showMessages();
     * @access public
     * @instance
     * @return {void}
     * @expose
     * @memberof oj.editableValue
     * @ojshortdesc Takes all deferred messages and shows them.
     * @since 0.7.0
     */
    showMessages: function () {
      var clonedMsgs = [];
      var i;
      var msgHidden;
      var msgsHidden = this.options.messagesHidden;
      var hasMessagesHidden = msgsHidden.length > 0;
      var clonedMsg;

      // showMessages() copies messagesHidden into clonedMsgs,
      // then clears messagesHidden, and updates messagesShown with the clonedMsgs.
      // It then updates the valid property; e.g.,
      // if the valid state was "invalidHidden"
      // before showMessages(), the valid state will become "invalidShown" after showMessages().
      for (i = 0; i < msgsHidden.length; i++) {
        msgHidden = msgsHidden[i];

        // The Message and ComponentMessage distinction is important in a few places in
        // the EV code. For example, when messagesCustom property changes, we keep existing
        // messagesShown only if they are ComponentMessage added by component.
        // if (msg instanceof ComponentMessage && msg._isMessageAddedByComponent())
        if (msgHidden instanceof Message.ComponentMessage) {
          // change ComponentMessage's display state to ComponentMessage.DISPLAY.SHOWN
          msgHidden._forceDisplayToShown();

          //
          // .clone() clones the message and the options that were passed in when the message
          // was originally created.
          clonedMsg = msgHidden.clone();
        } else {
          // NOTE: Message is a public class and ComponentMessage is private.
          // Message's .clone is deprecated, so we purposely don't call it here.
          clonedMsg = new Message(msgHidden.summary, msgHidden.detail, msgHidden.severity);
        }

        clonedMsgs.push(clonedMsg);
      }

      if (hasMessagesHidden) {
        this._clearMessages('messagesHidden');

        this._updateMessagesOption('messagesShown', clonedMsgs);

        this._setValidOption(_INVALID_SHOWN, null);
      }
    },

    // P R O T E C T E D    C O N S T A N T S   A N D   M E T H O D S

    // *********** START WIDGET FACTORY METHODS (they retain _camelcase naming convention) **********

    /**
     * Validation mode specifying the kind of validation that gets run.
     * <ul>
     *   <li>FULL - the default and runs both the converter and all validators. </li>
     *   <li>VALIDATORS_ONLY - runs all validators including the required validator is run.</li>
     *   <li>REQUIRED_VALIDATOR_ONLY - runs just the required validator. </li>
     * </ul>
     * @protected
     * @const
     * @type {Object}
     * @memberof oj.editableValue
     */
    _VALIDATION_MODE: _sValidationMode,

    /**
     * The context the component can be in when validation is run.
     * <ul>
     * <li>COMPONENT_CREATE - when component is created and we run validators. usually messages are
     * not displayed right away, i.e, are 'deferred'. </li>
     * <li>VALUE_OPTION_CHANGE - when component's value is updated programmatically. messages are
     * deferred.</li>
     * <li>REQUIRED_OPTION_CHANGE - when component's required option is updated programmatically. messages are
     * deferred.</li>
     * <li>USER_ACTION - when component runs validation as a result of user interating with component.
     * messages are displayed immediately.</li>
     * <li>VALIDATE_METHOD - when component's validate() method is called explicitly. messages are
     * displayed immediately.</li>
     * </ul>
     *
     * @protected
     * @const
     * @type {Object}
     * @memberof oj.editableValue
     *
     */
    _VALIDATION_CONTEXT: EditableValueUtils.validationContext,

    /**
     * Default options used by validate method.
     *
     * @protected
     * @const
     * @type {Object}
     * @memberof oj.editableValue
     * @see #validate
     */
    _VALIDATE_METHOD_OPTIONS: EditableValueUtils.validateMethodOptions,

    /**
     * Called at component create time primarily to initialize options, often using DOM values. This
     * method is called before _ComponentCreate is called, so components that override this method
     * should be aware that the component has not been rendered yet. The element DOM is available and
     * can be relied on to retrieve any default values. <p>
     *
     * This method sets defaults for its options that have a DOM namesake. E.g., value, required,
     * disabled etc. Subclasses can override this method to set their own defaults for these options.
     * Example, the value option is often not set on this.element for components like radioset, which
     * walk the sub-tree to determine the value.
     *
     * @param {!Object} originalDefaults - original default options defined on the widget and its ancestors
     * @param {?Object} constructorOptions - options passed into the wiget constructor
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _InitOptions: function (originalDefaults, constructorOptions) {
      this._super(originalDefaults, constructorOptions);
    },

    /**
     * Initializes options defined by this base class.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _ComponentCreate: function () {
      // remove attributes that trigger html5 validation + inline bubble
      var attrsToRemove = ['required', 'title', 'pattern'];
      var node = this.element;
      var savedAttributes = this._GetSavedAttributes(node);

      this._super();

      this.options.messagesCustom = this.options.messagesCustom || [];
      this.options.messagesHidden = [];
      this.options.messagesShown =
        this.options.messagesCustom.length > 0
          ? this._cloneMessagesBeforeSet(this.options.messagesCustom)
          : [];

      // update element DOM for disabled. TODO: say why
      this._SetDisabledDom(node);

      // remove html5 validation attributes; it's safe to remove these here because components should
      // have already initialized options based on DOM in _InitOptions().
      // Only need to do for <input> elements
      // custom elements create their input/textarea dom, so no need to do that for them.
      if (savedAttributes && !this._IsCustomElement()) {
        var tagName = node[0].tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
          attrsToRemove.forEach(function (value) {
            if (value in savedAttributes) {
              node.removeAttr(value);
            }
          });
        }
      }
    },

    /**
     * The value option alone is initialized here since it requires the component to be fully
     * created. Calling this.options.value before this method does not guarantee the correct
     * value to be returned.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _AfterCreate: function () {
      var describedBy;
      var self = this;

      this._super();

      this._refreshTheming('disabled', this.options.disabled);
      this.widget()[0].classList.add('oj-form-control');
      if (this._IsTextFieldComponent()) {
        if (this._IsCustomElement()) {
          this._getRootElement().classList.add('oj-text-field');
        } else {
          this.widget()[0].classList.add('oj-text-field');
        }
      }
      this._toggleOjHasNoValueClass(this.options.value);
      // We need to make sure the form component has an id since oj-form-layout
      // creates the label and associates them via for/id. Adding an id from ojformlayout
      // after the component is created does not create the form component's internal id.
      this.widget().uniqueId();

      // create an ojLabel only if this isn't a custom element. For example, ojInputText will
      // create an ojLabel, but <oj-input-text> will not. Instead the app dev uses <oj-label>.
      if (!this._IsCustomElement()) {
        this._createOjLabel();
      } else if (this.options.labelledBy) {
        this._labelledByUpdated(this.options.labelledBy);
      } else {
        this._setAriaLabelFromLabelHint();
      }

      // set describedby on the element as aria-describedby
      describedBy = this.options.describedBy;
      if (describedBy) {
        this._describedByUpdated(null, describedBy);
      }

      // run deferred validation
      this._runDeferredValidation(this._VALIDATION_CONTEXT.COMPONENT_CREATE);

      // Validators can have a dependency on the converter, so don't do anything with a validator
      // until the converter is loaded. That includes don't show a validator hint.
      var converter = this._GetConverter();
      this._converterChangedCounter = 0;
      if (converter instanceof Promise) {
        this._setBusyStateAsyncConverterLoading();
        // generally, the label edge is derived during the component messaging initialization.
        // but, in this case we are delaying the messaging init.
        // this will be a problem when we deal with deriving the label edge from a form layout.
        // because converter could resolve while the form layout is reparenting the children and
        // look up of parent might not work as expected. So we should just call the label edge
        // derivation logic here. That method internally caches the derived label-edge and we should be
        // fine delaying the label creation until the component is ready.
        this._ResolveLabelEdgeStrategyType();
        this._loadingConverter(converter).then(function () {
          self._AfterCreateConverterCached();
          self._clearBusyStateAsyncConverterLoading();
        });
      } else {
        // this code gets called if you have a synchronous converter
        // or no converter at all.
        this._AfterCreateConverterCached();
        this._setValidOption(this._determineValidFromMessagesOptions(), null);
      }
    },

    /**
     * Override to release resources held by this component.
     * It is important to unregister Hammer events
     * since they live outside of the component's DOM and would cause Detached Dom nodes
     * when the component is removed.
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _ReleaseResources: function () {
      this._super();
      if (this._IsCustomElement()) {
        // componentMessaging#releaseResources removes any resources that would
        // otherwise cause a memory leak, like Hammer.
        // We do not deactivate component messaging because that is a bigger change, and
        // more risky to backport.
        this._getComponentMessaging().releaseResources();
        this._hammerIsUnregistered = true;
      }
    },
    /**
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _SetupResources: function () {
      this._super();
      // Since initComponentMessaging gets called during component creation, and that activates
      // all the component strategies which in turn sets up listeners, we only want to
      // re-set up resources and when we have
      // released them in ReleaseResources.
      if (this._IsCustomElement() && this._hammerIsUnregistered) {
        const messaging = this._getComponentMessaging();
        messaging.setupResources();
        this._hammerIsUnregistered = false;
      }
    },

    /**
     * If we have asynchronous converter loading, the input is readonly and a loading indicator
     * is shown to the user.
     * When the converter is 100% loaded, then the field is set back to how it was.
     * That is when we do the tasks that either need a converter or need the field to be enabled,
     * like showing messagesCustom. Those tasks are done in this method.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */

    /**
     * <p>Saves all the element's attributes. In _destroy all attributes will be restored.
     * </p>
     *
     * @param {Object} element - jQuery selection to save attributes for
     * @protected
     * @memberof oj.editableValue
     * @instance
     * @override
     */
    _SaveAttributes: function (element) {
      if (!this._IsCustomElement()) {
        this._SaveAllAttributes(element);
      }
    },

    /**
     * @protected
     * @memberof oj.editableValue
     * @instance
     * @override
     */
    _RestoreAttributes: function (element) {
      if (!this._IsCustomElement()) {
        this._RestoreAllAttributes(element);
      }
    },

    /**
     * Performs post processing after _SetOption() calls _superApply(). Different options, when changed, perform
     * different tasks.
     *
     * @param {string} option
     * @param {Object=} flags
     * @protected
     * @memberof oj.editableValue
     * @instance
     */
    _AfterSetOption: function (option, flags) {
      switch (option) {
        case 'disabled':
          this._AfterSetOptionDisabledReadOnly(option, EditableValueUtils.disabledOptionOptions);
          break;

        case 'displayOptions':
          // clear the cached merged options; the getter setup for this.options['displayOptions']
          // will merge the new value with the defaults
          this._initComponentMessaging();
          break;

        case 'labelEdge':
          // if the labelEdge of the component changed, we need to recreate or move the label
          this._initComponentMessaging();
          this._setAriaLabelFromLabelHint();
          break;

        case 'labelHint':
          this._setAriaLabelFromLabelHint();
          break;

        case 'help':
          if (!this._IsCustomElement()) {
            // For non custom element components, help has definition and source, and if those
            // change, the component needs to be refreshed.
            this._Refresh(option, this.options[option]);
          } else {
            // For custom element components, when the help option changes, we have to assume that
            // help.instruction changed. When help.instruction changes push new value to messaging.
            this._getComponentMessaging().update(
              this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.TITLE)
            );
          }

          break;

        case 'messagesCustom':
          this._messagesCustomOptionChanged(flags);
          this._setValidOption(this._determineValidFromMessagesOptions(), null);
          break;

        case 'placeholder':
          this._SetPlaceholder(this.options.placeholder);
          this._placeholderOptionChanged(flags);
          break;

        case 'readOnly':
          if (this._retainFocusOnReadonlyChange) {
            // This setTimeout call is needed to allow the dom to update before we
            // get the focus element (or the element will still be hidden).
            setTimeout(() => {
              this.GetFocusElement().focus();
              if (this._resolveBusyStateFocusRestore) {
                this._resolveBusyStateFocusRestore();
                delete this._resolveBusyStateFocusRestore;
              }
            }, 0);
          }
          break;

        case 'title':
          // Ignore title attribute for custom element components.
          if (!this._IsCustomElement()) {
            // no reason to refresh component when title changes just push new value to messaging.
            this._getComponentMessaging().update(
              this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.TITLE)
            );
          }
          break;

        case 'translations':
          this.refresh();
          break;

        case 'userAssistanceDensity':
          // if the userAssistanceDensity of the component changed,
          // we need to create or remove the user assistance display strategy.
          this._initComponentMessaging();
          break;

        case 'value':
          this._AfterSetOptionValue(option, flags);
          break;

        default:
          break;
      }
    },

    /**
     * Performs post processing after disabled or readOnly option changes by taking the following
     * steps. (Steps are same for readOnly option).
     * <p>
     * if disabled component is enabled then, <br/>
     * - if there are no errors, run deferred validation. component could have been initialized with
     * empty value and disabled.<br/>
     * - if component is invalid and showing messages clear component error, grab UI value and run
     * full validation.<br/>
     * - if component is invalid and has hidden messages; do nothing. <br/>
     * </p>
     * <p>
     * if enabled component is disabled no validation is run.<br/>
     * </p>
     *
     * @param {String} option
     * @param {Object} validationOptions
     *
     * @protected
     * @memberof oj.editableValue
     * @instance
     */
    _AfterSetOptionDisabledReadOnly: function (option, validationOptions) {
      var isEnabled = !(this.options[option] || false);

      // always refresh
      this._Refresh(option, this.options[option]);
      if (isEnabled) {
        this._runMixedValidationAfterSetOption(validationOptions);
      }
    },

    /**
     * Performs post processing after value option changes by taking the following steps.
     *
     * - triggers a valueChanged event and does writeback if required.<br/>
     * - if setOption was from programmatic intervention, <br/>
     * &nbsp;&nbsp;- clear custom messages and component messages; <br/>
     * &nbsp;&nbsp;- run deferred validation. if there is an error, updates messagesHidden. <br/>
     * - always refreshes UI display by formatting the value option<br/>
     *
     * @param {string} option
     * @param {Object=} flags
     *
     * @protected
     * @memberof oj.editableValue
     * @instance
     *
     */
    _AfterSetOptionValue: function (option, flags) {
      var context = flags ? flags._context : null;
      var doNotClearMessages;
      var isUIValueChange = false;

      if (context) {
        isUIValueChange = !!context.originalEvent;
        doNotClearMessages = context.doNotClearMessages || false;
      }

      if (!isUIValueChange) {
        // value option can be updated directly (i.e., programmatically or through user interaction)
        // or updated indirectly as a result of some other option changing - e.g., converter,
        // validators, required etc.
        // When value changes directly due to programatic intervention (usually page author does this)
        // then clear all messages and run deferred validation.
        // If value changes indirectly do not clear custom messages (component messages are already
        // cleared) and run deferred validation.
        if (!doNotClearMessages) {
          this._clearAllMessages(null);
        }
        this._runDeferredValidation(this._VALIDATION_CONTEXT.VALUE_OPTION_CHANGE);
      }

      // refresh UI display value
      this._Refresh(option, this.options[option], true);
    },

    /**
     * Whether the a value can be set on the component. For example, if the component is
     * disabled then setting value on component is a no-op.
     *
     * @see #_SetValue
     * @return {boolean}
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _CanSetValue: function () {
      var disabled = this.options.disabled || false;

      return !disabled;
    },

    /**
     * Override to do the delay connect/disconnect
     * This should improve performance when a lot of editable value components are in an
     * oj-form-layout component, which does a lot of reparenting of elements which would
     * trigger multiple (and unneeded) _ReleaseResources/_SetupResources calls.
     * @memberof oj.editableValue
     * @override
     * @protected
     */
    _VerifyConnectedForSetup: function () {
      return true;
    },

    /**
     * Detaches the widget from the element and restores element exactly like it was before the widget
     * was attached.
     * @protected
     * @expose
     * @memberof oj.editableValue
     * @instance
     *
     */
    _destroy: function () {
      var labelIndex;
      var labelLength;
      var ret = this._super();

      this._clearAllMessages(null, true);
      this.widget().removeUniqueId();
      if (this._getComponentMessaging()._isActive()) {
        this._getComponentMessaging().deactivate();
      }

      // make sure the label is still "alive". Otherwise we could get error when we try to
      // destroy it if the dom was removed first and ojLabel was destroyed directly.
      // also make sure to check if there is more than one label and destroy them individually.
      if (this.$label) {
        labelLength = this.$label.length;
        for (labelIndex = 0; labelIndex < labelLength; labelIndex++) {
          if (
            this.$label[labelIndex] &&
            __GetWidgetConstructor(this.$label[labelIndex]) != null
          ) {
            $(this.$label[labelIndex]).ojLabel('destroy');
          }
        }
      }

      return ret;
    },

    /**
     * JET-48463 - If we are in readonly mode, we call _GetReadonlyFocusElement, and fall back to
     * _GetContentElement()[0] if _GetReadonlyFocusElement happens to return null.
     * If not readonly, we just return _GetContentElement()[0]
     * @memberof oj.editableValue
     * @instance
     * @override
     * @protected
     * @since 5.0.0
     */
    GetFocusElement: function () {
      return this.options.readOnly === true
        ? this._GetReadonlyFocusElement() || this._GetContentElement()[0]
        : this._GetContentElement()[0];
    },

    /**
     * Returns the readonly focus element if there is a readonly specific element, otherwise null
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @return {Element|null}
     */
    _GetReadonlyFocusElement: function () {
      return this._getReadonlyDiv();
    },

    /**
     * Called (by the widget factory) when the option changes, this method responds to the change
     * by refreshing the component if needed. This method is not called for the options passed in
     * during the creation of the widget.
     *
     * @param {string} name of the option
     * @param {Object|string} value
     * @param {Object?} flags - optional flags. The following flags are currently supported:
     * <ul>
     *  <li>changed - true if the caller wants to indicate the value has changed, so no comparison is necessary</li>
     * </ul>
     *
     * @expose
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _setOption: function (name, value, flags) {
      var retVal;
      var skipSetOption = false;
      var oldValue;
      var newValue;

      switch (name) {
        case 'messagesHidden':
          // this option can never be set programmatically by page author
          skipSetOption = true;
          break;

        case 'messagesShown':
          // this option can never be set programmatically by page author
          skipSetOption = true;
          break;

        case 'rawValue':
          // rawValue is readOnly, so throw an error here.
          skipSetOption = true;
          break;

        case 'describedBy':
          // This sets the aria-describedby on the correct dom node
          oldValue = this.options.describedBy;
          newValue = value;
          this._describedByUpdated(oldValue, newValue);
          break;
        case 'labelledBy':
          if (value) {
            this._labelledByUpdated(value);
          }
          break;
        case 'readOnly':
          this._retainFocusOnReadonlyChange = FocusUtils.containsFocus(this.widget()[0]);
          if (this._retainFocusOnReadonlyChange) {
            if (!this._resolveBusyStateFocusRestore) {
              var domElem = this.element[0];
              var busyContext = Context.getContext(domElem).getBusyContext();
              var description = 'Waiting for focus on the component ';

              if (domElem && domElem.id) {
                description += `with id="${domElem.id}" `;
              }
              description += 'to be restored.';
              this._resolveBusyStateFocusRestore = busyContext.addBusyState({
                description: description
              });
            }
          }
          this._addRemoveOjReadOnlyClassOnLabel(
            document.getElementById(this.options.labelledBy),
            value
          );
          break;
        case 'displayOptions':
          // since the displayOptions defaults are theme-dependent
          // (except for displayOptions.helpInstruction), we
          // need to set the defaults ourselves when displayOptions
          // or any of its subproperties is set to undefined.
          // For displayOptions we never want to blow away any of the sub-properties,
          // so for the case where the app dev doesn't set all the sub-properties, we
          // default the others. e.g., formComponent.displayOptions = {messages:'none'}
          // Also, in Redwood theme, we use 'display' and 'none'. Anything that isn't 'none'
          // works the same as 'display'.
          // In Alta, it must be one of the accepted options that Alta supports.
          // Setting to null doesn't reset.
          var displayOptions = value;
          var resetNeeded =
            value !== null &&
            (value.validatorHint === undefined ||
              value.converterHint === undefined ||
              value.messages === undefined);
          if (resetNeeded) {
            // this will change any of the sub-properties not set back to the defaults,
            // and when super is called at the end of the method, the displayOptions option will
            // be set with defaults if necessary.
            let useUserAssistanceDensity =
              (parseJSONFromFontFamily('oj-form-control-option-defaults') || {})
                .useUserAssistanceOptionDefault === 'use';
            const displayOptionsDefaults = useUserAssistanceDensity
              ? _sDisplayOptionsRedwoodDefaults
              : _sDisplayOptionsAltaDefaults;
            if (value.validatorHint === undefined) {
              displayOptions.validatorHint = displayOptionsDefaults.VALIDATOR_HINT;
            }
            if (value.converterHint === undefined) {
              displayOptions.converterHint = displayOptionsDefaults.CONVERTER_HINT;
            }
            if (value.messages === undefined) {
              displayOptions.messages = displayOptionsDefaults.MESSAGES;
            }
          }

          break;
        default:
          break;
      }

      if (skipSetOption) {
        error(name + ' option cannot be set');
        return this;
      }

      // Step 2: Update option value
      retVal = this._superApply(arguments);

      // Step 3: Do post processing like triggering events, refreshing component DOM etc.
      this._AfterSetOption(name, flags);

      return retVal;
    },

    // *********** END WIDGET FACTORY METHODS **********

    /**
     * Returns a jquery object of the element(s) representing the content node. This could be a jQuery
     * object of the element the widget was invoked on - typically this is an input or select or
     * textarea element for which a value can be set. It could be more than one dom node.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @return {jQuery} the jquery element that represents the editable content. E.g., an input
     */
    _GetContentElement: function () {
      return this.element;
    },

    /**
     * Returns a jquery object of the element(s) representing the label node(s) for the input
     * component.
     * First we look for the aria-labelledby attribute on the input.
     * If that's not found, we look for the label with 'for' attribute
     * pointing to input.
     * If that's not found, we walk up the dom looking for aria-labelledby.
     * Note: multiple labels for one input is legal in html-5.
     * This is called for widget components, not custom components.
     * We check as well inside this function and return if a custom component.
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @return {Object} the jquery element that represents the input component's label.
     *  return null if it can't find anything.
     */
    _GetLabelElement: function () {
      if (this._IsCustomElement()) {
        return null;
      }
      var ariaElement;
      var labelQuery;

      if (this.$label) {
        return this.$label;
      }

      if (EditableValueUtils.hasNoLabelFlag(this.widget())) {
        return null;
      }

      // If input has aria-labelledby set, then look for label it is referring to.
      var queryResult = this._getAriaLabelledByElement(this.element);
      if (queryResult !== null && queryResult.length !== 0) {
        return queryResult;
      }

      // if no aria-labelledby is on the input, then look for a label with 'for'
      // set.
      var id = this.element[0].id;
      if (id !== undefined) {
        labelQuery = "label[for='" + id + "']";
        queryResult = $(labelQuery);
        if (queryResult.length !== 0) {
          return queryResult;
        }
      }

      // if no aria-labelledby on input and no label with 'for' pointing to input,
      // then as a final step we walk up the dom to see if aria-labelledby is set.
      // If so, then we find the label it is referring to.
      // This would be the case when you have multiple inputs grouped in a div
      // <label id="grouplabel">Address</label>
      // <div aria-labelledby="grouplabel"><input/><input/><input/></div>
      ariaElement = this.element.closest('[aria-labelledby]');
      if (ariaElement.length !== 0) {
        // Element has aria-labelledby set, so look for label it is referring to.
        queryResult = this._getAriaLabelledByElement(ariaElement);
        if (queryResult !== null && queryResult.length !== 0) {
          return queryResult;
        }
      }
      return null;
    },

    /**
     * Returns the element's value. Normally, this is a call to this.element.val(), but for some
     * components, it could be something else. E.g., for ojRadioset the element's value is really the
     * value of the selected radio in the set.
     *
     * @override
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetElementValue: function () {
      return this.element.val();
    },

    /**
     * Returns a jquery object of the element that triggers messaging behavior. The trigger element
     * is usually an input or select or textarea element for which a value can be set/retrieved and
     * validated.
     *
     * @return {jQuery} jquery object
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetMessagingLauncherElement: function () {
      return this._GetContentElement();
    },
    /**
     * Returns the dom element that should be used for positioning popup messages.
     *
     * @return {HTMLElement}
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetMessagingPositionElement: function () {
      let formCtrl = this._GetFormControlContainer();
      // if this component has a text field container, return that element
      if (formCtrl) {
        return formCtrl;
      }
      // otherwise, return the content element.
      return this._GetMessagingLauncherElement()[0];
    },

    /**
     * Returns the normalized converter instance. Since EditableValue does not have a converter
     * option, this returns null.
     *
     * @return {Object} null
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetConverter: function () {
      return null;
    },

    /**
     * Returns an array of implicit validators setup by component. This list contains validators for
     * the internal use of the component and are not a part of this.options.validators. <br/>
     * E.g., if the pattern attribute or option is set, a RegExpValidator instance is automatically
     * created and added to this list. <br/>
     * RequiredValidator is tracked separately from the default validators.
     *
     * @return {Object} a map of string name to the validator instance.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetImplicitValidators: function () {
      if (!this._implicitSyncValidators) {
        this._implicitSyncValidators = {};
      }

      return this._implicitSyncValidators;
    },

    /**
     * Returns the display value that is ready to be passed to the converter.
     *
     * @param {Object} value the stored value if available that needs to be formatted for display
     * @return {string} usually a string display value
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _GetDisplayValue: function (value) {
      return this._GetContentElement().val();
    },

    /**
     * For components that have the 'validators' option,
     * this returns an array of all validators
     * normalized from the validators option set on the component. <br/>
     * Since EditableValue does not include the 'validators' option, this returns [].
     *
     * @return {Array} of validators.
     * Since EditableValue does not include the 'validators' option, this returns [].
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetNormalizedValidatorsFromOption: function () {
      return [];
    },
    /**
     * For components that have the 'async-validators' attribute,
     * this returns an array of all validators
     * normalized from the async-validators property set on the component. <br/>
     * Since EditableValue does not include the 'validators' option, this returns [].
     *
     * @return {Array} of validators.
     * Since EditableValue does not include the 'validators' option, this returns [].
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetNormalizedAsyncValidatorsFromOption: function () {
      return [];
    },

    /**
     * Returns an array of all validators built by merging the validators
     * option set on the component and the implicit validators
     * setup by the component. As of v8.0, these can be async or sync.<br/>
     * This does not include the implicit required validator.
     * Components can override to add to this
     * array of validators.
     *
     * @return {Array} of validators
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetAllValidatorsFromValidatorsOptionAndImplicit: function () {
      var allValidators = [];
      var idx;
      var implicitValidatorMap;
      var implicitValidators;
      var normalizedValidators;
      // this flag helps us only get or create the validators once, not every time
      // we want to get a hint or validate.
      if (!this._allValidators) {
        implicitValidatorMap = this._GetImplicitValidators();
        implicitValidators = [];

        // combine public and implicit validators to get the combined list
        var keys = Object.keys(implicitValidatorMap);
        var valType;
        var len = keys.length;
        if (len > 0) {
          for (idx = 0; idx < len; idx++) {
            valType = keys[idx];
            implicitValidators.push(implicitValidatorMap[valType]);
          }
          allValidators = allValidators.concat(implicitValidators);
        }

        normalizedValidators = this._GetNormalizedValidatorsFromOption();
        if (normalizedValidators.length > 0) {
          // Add normalize validators
          normalizedValidators.forEach(function (normalizedValidator) {
            allValidators.push(normalizedValidator);
          });
        }
        this._allValidators = allValidators;
      }
      return this._allValidators;
    },

    /**
     * This method also updates the messaging strategies as hints associated with validators could
     * have changed.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _ResetAllValidators: function () {
      if (this._allValidators) {
        this._allValidators.length = 0;
      }
      this._allValidators = null;

      if (this._IsCustomElement()) {
        // This gets sync and async validator hints.
        // nothing should be waiting on this, so no need to return a Promise.
        this._updateValidatorMessagingHint();
      } else {
        // update messagingstrategy as hints associated with validators could have changed
        this._getComponentMessaging().update(this._getValidatorHintsMC());
      }
    },

    /**
     * Return the element on which aria-label can be found.
     * Usually this is the root element, but some components have aria-label as a transfer attribute,
     * and aria-label set on the root element is transferred to the inner element.
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _GetAriaLabelElement: function () {
      return this._getRootElement();
    },

    /**
     * Sets or removes oj-read-only class on element based on readonly value.
     *
     *
     * @param {HTMLElement|undefined} element
     * @param {boolean|undefined} readonly Could be undefined in component does not have readonly
     * option at all.
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _addRemoveOjReadOnlyClassOnLabel: function (element, readonly) {
      if (element && readonly !== undefined) {
        const readonlystyleclass = 'oj-read-only';
        if (readonly) {
          element.classList.add(readonlystyleclass);
        } else {
          element.classList.remove(readonlystyleclass);
        }
      }
    },

    /**
     * This is used to set the aria label from the label hint, and also
     * updates the readonly div from aria-label if specified.
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _setAriaLabelFromLabelHint: function () {
      if (this._IsCustomElement()) {
        var ariaLabelElem = this._GetAriaLabelElement();
        var ariaLabel = ariaLabelElem.getAttribute('aria-label');
        let readonlyDiv = this._getReadonlyDiv();

        if (
          !this.options.labelledBy &&
          this.options.labelHint &&
          this.options.labelEdge === 'none' &&
          (!ariaLabel || ariaLabel === this._ariaLabelFromHint) &&
          !this._getRootElement().getAttribute('aria-labelledby')
        ) {
          // Set aria-label if all of the followings are true:
          // 1. This is a custom element.
          // 2. There is no labelledBy option.
          // 3. There is a labelHint option.
          // 4. labelEdge option is set to 'none' (this will only be set by app)
          // 5. There is no aria-label attribute or the aria-label was set by us.
          // 6. There is no aria-labelledby attribute.
          ariaLabelElem.setAttribute('aria-label', this.options.labelHint);
          // Set on the readonly div if it exists as well.
          if (readonlyDiv) {
            readonlyDiv.setAttribute('aria-label', this.options.labelHint);
          }

          // Remember what we set aria-label to
          this._ariaLabelFromHint = this.options.labelHint;
        } else if (this._ariaLabelFromHint && this._ariaLabelFromHint === ariaLabel) {
          // If we have set aria-label previously and no one has changed it, remove it
          // if the current condition no longer need to set aria-label.
          ariaLabelElem.removeAttribute('aria-label');
          // remove from the readonly div as well.
          if (readonlyDiv) {
            readonlyDiv.removeAttribute('aria-label');
          }
        } else if (ariaLabel) {
          // The app dev specified 'aria-label' explicitly.
          if (readonlyDiv) {
            readonlyDiv.setAttribute('aria-label', ariaLabel);
          }
        } else if (readonlyDiv) {
          // No ariaLabel, so remove it from the readonly div
          readonlyDiv.removeAttribute('aria-label');
        }
      }
    },

    /**
     * Returns an array of all validators with a hint property. We
     * look on the attributes validators and async-validators as well
     * as in the implicit validators.
     * Having a 'hint' property means they are async validators since
     * the AsyncValidator interface has  an optional 'hint' property
     * whereas the Validator interface has an optional getHint function.
     *
     * @return {Array} of async validators that have hints, [] if none
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _getAllAsyncValidatorsWithHint: function () {
      var allAsyncValidators = this._GetNormalizedAsyncValidatorsFromOption();
      var allAsyncValidatorsWithHints = [];
      var i;
      var validator;

      if (this._IsRequired()) {
        // get the hint for the default required validator and push into array
        validator = this._getImplicitRequiredValidator();
        if ('hint' in validator) {
          allAsyncValidatorsWithHints.push(validator);
        }
      }

      if (allAsyncValidators.length > 0) {
        for (i = 0; i < allAsyncValidators.length; i++) {
          validator = allAsyncValidators[i];
          if ('hint' in validator) {
            allAsyncValidatorsWithHints.push(validator);
          }
        }
      }
      // gets implicit validators and all validators from the validators option.
      var allValidators = this._GetAllValidatorsFromValidatorsOptionAndImplicit();
      if (allValidators.length > 0) {
        for (i = 0; i < allValidators.length; i++) {
          validator = allValidators[i];
          if ('hint' in validator) {
            allAsyncValidatorsWithHints.push(validator);
          }
        }
      }

      return allAsyncValidatorsWithHints;
    },

    /**
     * Initialize async validator messaging hints, if any.
     * This is called from the ComponentMessaging, not during component
     * initialization.
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _initAsyncValidatorMessagingHint: function () {
      var allAsyncValidatorsWithHint = this._getAllAsyncValidatorsWithHint();
      var currentCounter;
      var syncValidatorHintMC;
      var self = this;

      this._asyncValidatorHintCounter = 0;

      if (allAsyncValidatorsWithHint.length > 0) {
        // get the sync validators hints  we are already showing so we can show it with
        // the async validators hints
        syncValidatorHintMC = this._getValidatorHintsMC();
        // we use a counter to keep track of the busycontext
        // if we get a more recent update async validators hint requests
        // i.e., asyncValidators property is changed, and we want to ignore any previous
        // hints Promise results. See _updateValidatorMessagingHint.
        currentCounter = this._asyncValidatorHintCounter;
        this._setBusyStateAsyncValidatorHint(currentCounter);
        // get the async validators hints and show them as well as they resolve
        this._addAsyncValidatorsHintsMessagingContent(
          allAsyncValidatorsWithHint,
          syncValidatorHintMC
        ).then(function () {
          self._clearBusyStateAsyncValidatorHint(currentCounter);
        });
      }
    },

    /*
    Called from ComponentMessaging as well.
    * @memberof oj.editableValue
    * @instance
    * @private
    */
    _getValidatorHintsMC: function () {
      return this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDATOR_HINTS);
    },

    /**
     * This gets all asyncValidators that have hints,
     * asynchronously updates the component messaging validator hints with BOTH
     * synchronous and async validators' hints.
     * If there are no asyncValidators with hints, it updates validator hints with sync hints.
     * This is called when asyncValidators property changes or when validators property changes.
     * See #_ResetAllValidators. Not called now from ResetAllValidators.
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _updateValidatorMessagingHint: function () {
      var allAsyncValidatorsWithHint = this._getAllAsyncValidatorsWithHint();
      var compMessagings = this._getComponentMessaging();
      var currentCounter;
      var self = this;

      // this gets all validators with getHint (these are sync validators)
      var syncValidatorHintMC = this._getValidatorHintsMC();

      if (allAsyncValidatorsWithHint.length > 0) {
        // we use a counter to keep track of the busycontext
        // if we get a more recent update async validators hint requests
        // i.e., asyncValidators property is changed.
        this._asyncValidatorHintCounter += 1;
        currentCounter = this._asyncValidatorHintCounter;
        this._setBusyStateAsyncValidatorHint(currentCounter);
        this._addAsyncValidatorsHintsMessagingContent(
          allAsyncValidatorsWithHint,
          syncValidatorHintMC
        ).then(function () {
          self._clearBusyStateAsyncValidatorHint(currentCounter);
        });
      } else {
        // if this is [], this causes the notewindow to close if it was open.
        // and we don't want to close/reopen if possible, so don't do this before
        // updating async validator hints. Do it in updating async validator hints.
        compMessagings.update(syncValidatorHintMC);
      }
    },

    /**
     * This is called when we have async validators and we want to add
     * their hints, if any, to the componentMessaging. It also adds
     * the sync validator hints as well.
     * This function will also return a Promise that will resolve when we have updated
     * the componentMessaging with all the hints, async and sync.
     *
     * @param {Array} asyncValidatorsWithHints
     *  Array of asyncValidators that are in the async-validators attribute and have hints
     * @param {string} syncValidatorHintMC
     *  hint messaging content from sync validators.
     * @return {Promise} Promise that when resolves will have the hints
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _addAsyncValidatorsHintsMessagingContent: function (
      asyncValidatorsWithHint,
      syncValidatorHintMC
    ) {
      var i;
      // use counter to ignore if we get a more recent update async validators hint requests
      // i.e., asyncValidators property is changed.
      var asyncValidatorHintCounter = this._asyncValidatorHintCounter;
      var compMessagings = this._getComponentMessaging();
      var hintArray = [];
      var self = this;

      // We kick off all the async validators.hint simultaneously. When they all resolve/reject,
      // then we can move on.
      var promiseArray = [];
      for (i = 0; i < asyncValidatorsWithHint.length; i++) {
        promiseArray.push(asyncValidatorsWithHint[i].hint);
      }

      function reflect(promise) {
        return promise.then(
          function (v) {
            var status;

            var validatorHintMessagingContent = {};

            // update hint as we get it
            // use counter to ignore if we get a more recent update async validators hint requests
            // i.e., asyncValidators property is changed.
            if (self._asyncValidatorHintCounter === asyncValidatorHintCounter) {
              if (v !== null) {
                hintArray.push(v);
                validatorHintMessagingContent.validatorHint =
                  syncValidatorHintMC.validatorHint.concat(hintArray);
                compMessagings.update(validatorHintMessagingContent);
              }
              status = 'resolved';
            } else {
              status = 'ignore';
            }
            return { v: v, status: status };
          },
          function (e) {
            // we don't update the hintArray when the hint Promise rejects.
            // No need to check the counter in this case because there is nothing
            // to 'ignore'.
            return { e: e, status: 'rejected' };
          }
        );
      }
      return new Promise(function (resolve) {
        // Promise.all will end as soon as it gets its first rejection. We don't want that.
        // We want to wait until all promises either resolve or reject. Then we can resolve this
        // outer promise. We do this using the reflect function defined above.
        Promise.all(promiseArray.map(reflect)).then(function () {
          resolve(hintArray);
        });
      });
    },

    /**
     * Whether the component is required. EditableValue doesn't support the required option,
     * so return false.  This allows us to keep some of the required code in EditableValue.
     *
     * @return {boolean} true if required; false
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _IsRequired: function () {
      return false;
    },

    /**
     * Convenience handler for the DOM 'change' event. Subclasses are expected to wire up event
     * handlers for DOM events that they wish to handle.<br/>
     *
     * The implementation retrieves the display value for the component by calling _GetDisplayValue()
     * and calls _SetValue(), with full validation.
     *
     * @param {Event} event DOM event
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _HandleChangeEvent: function (event) {
      var submittedValue = this._GetDisplayValue();
      // run full validation
      this._SetValue(submittedValue, event);
    },
    /**
     * Convenience function to set the rawValue option. Called by subclasses
     *
     * @param {String} val value to set rawValue to
     * @param {Event} event DOM event
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _SetRawValue: function (val, event) {
      var flags = {};
      flags._context = { originalEvent: event, writeback: true, internalSet: true, readOnly: true };

      if (!this._CompareOptionValues('rawValue', this.options.rawValue, val)) {
        this.option('rawValue', val, flags);
      }
    },

    /**
     * This method takes a value from a value change listener
     * and determines if it is 'empty'. This is used to toggle a
     * 'oj-has-no-value' style class.
     * This method is generic enough to be used by all EditableValue components,
     * but can be overridden by component if needed.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _IsValueEmpty: function (value) {
      if (value === undefined || value === null) {
        return true;
      } else if (typeof value === 'string') {
        return oj.StringUtils.isEmptyOrUndefined(value);
      } else if (typeof value === 'number') {
        return isNaN(value);
      } else if (Array.isArray(value)) {
        // oj-select-many setting observable(undefined) returns an array with
        // an undefined value versus an undefined value
        return (
          value.length === 0 ||
          (value.length === 1 && (value[0] === null || value[0] === undefined))
        );
      }
      return false;
    },
    /**
     * This method toggles a 'oj-has-no-value' style class as needed.
     * The styleclass is used to position the inside label.
     * This method also updates component messaging (specifically InlineRequiredStrategy),
     * because the Required dom is created when the component is required and
     * there is no value displayed to the user and the Required dom is removed
     * when there is a value, as per the Redwood UX spec.
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _toggleOjHasNoValueClass: function (value) {
      let element = this._getRootElement();
      const ojHasNoValueClass = 'oj-has-no-value';
      const hasOjHasNoValueClass = element.classList.contains(ojHasNoValueClass);
      const isValueEmpty = this._IsValueEmpty(value);
      const addClass = isValueEmpty && !hasOjHasNoValueClass;
      const removeClass = !isValueEmpty && hasOjHasNoValueClass;

      if (addClass) {
        element.classList.add(ojHasNoValueClass);
      } else if (removeClass) {
        element.classList.remove(ojHasNoValueClass);
      }
      // only bother to do this if required option is true and the class was added or removed,
      // since this is only used in the InlineRequiredStrategy right now.
      if (this.options.required && (addClass || removeClass)) {
        this._getComponentMessaging().update({ hasNoValueToggled: true });
      }
    },

    /**
     * Called in response to a change in the options set for this component, this method refreshes the
     * component display value. Subclasses can override to provide custom refresh behavior.
     *
     * @param {String=} name the name of the option that was changed
     * @param {Object=} value the current value of the option
     * @param {boolean=} forceDisplayValueRefresh
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _Refresh: function (name, value, forceDisplayValueRefresh) {
      var helpDef;
      var helpSource;

      switch (name) {
        case 'converter':
          var _value = this.options.value;
          this._refreshComponentDisplayValue(_value, forceDisplayValueRefresh);
          break;

        case 'disabled':
          this._refreshTheming('disabled', this.options.disabled);
          break;

        case 'help':
          if (!this._IsCustomElement()) {
            // refresh the help - need to keep the label in sync with the input.
            if (this.$label) {
              helpDef = this.options.help.definition;
              helpSource = this.options.help.source;
              this.$label.ojLabel('option', 'help', { definition: helpDef, source: helpSource });
              var label = this.$label[0];
              if (label) {
                let labelId = label.id;
                if (labelId) {
                  let ariaId = labelId + _HELP_ICON_ID;
                  if (helpSource != null || helpDef != null) {
                    this._describedByUpdated(null, ariaId);
                  } else {
                    this._describedByUpdated(ariaId, null);
                  }
                }
              }
            }
          }
          break;

        case 'value':
          this._refreshComponentDisplayValue(value, forceDisplayValueRefresh);
          break;

        default:
          break;
      }
    },

    /**
     * <p>Notifies the component that its subtree has been made hidden programmatically
     * after the component has been created.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _NotifyHidden: function () {
      this._superApply(arguments);
      this._getComponentMessaging().close();
    },
    /**
     * <p>Notifies the component that its subtree has been removed from the
     * document programmatically after the component has
     * been created.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _NotifyDetached: function () {
      this._superApply(arguments);
      this._getComponentMessaging().close();
    },
    /**
     * Called anytime the label DOM changes requiring a reset of any dependent feature that caches the
     * label, including all validators.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _ResetComponentState: function () {
      // the DOM for the label and its text could have changed.
      if (this.$label) {
        this.$label.ojLabel('refresh');
      }

      // reset all validators when label changes
      this._implicitReqValidator = null;
      this._converter = null;
      this._ResetAllValidators();
    },

    /**
     * Called when the display value on the element needs to be updated. This method updates the
     * (content) element value. Widgets can override this method to update the element appropriately.
     *
     * @param {String} displayValue of the new string to be displayed
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _SetDisplayValue: function (displayValue) {
      var contentElem = this._GetContentElement();
      if (contentElem.val() !== displayValue) {
        contentElem.val(displayValue);
      }
    },
    /**
     * Sets the disabled option onto the dom.
     * Component subclasses can override this method to not do this in cases where it is invalid,
     * like on a div (e.g., radioset's root dom element is a div).
     * @param {Object} node - dom node
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @since 1.0.0
     */
    _SetDisabledDom: function (node) {
      if (typeof this.options.disabled === 'boolean') {
        node[0].disabled = this.options.disabled; // eslint-disable-line no-param-reassign
      }
    },

    /**
     * Sets the placeholder text on the content element by default. It sets the placeholder attribute
     * on the element. Component subclasses can override this method to control where placeholder text
     * gets set.
     * @param {string} value
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _SetPlaceholder: function (value) {
      var contentElem = this._GetContentElement()[0];
      if (contentElem) {
        if (value == null) {
          contentElem.removeAttribute('placeholder');
        } else {
          contentElem.setAttribute('placeholder', value);
        }
      }
    },

    /**
     * Sets the placeholder option with the value.
     *
     * @param {string} value
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _SetPlaceholderOption: function (value) {
      this.options.placeholder = value;
    },

    /**
     * whether the placeholder option is set
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _HasPlaceholderSet: function () {
      //  - an empty placeholder shows up if data changed after first binding
      return this.options.placeholder;
    },

    /**
     * Clear the placeholder option
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _ClearPlaceholder: function () {
      //  - an empty placeholder shows up if data changed after first binding
      this._SetPlaceholderOption('');
      this._SetPlaceholder('');
    },
    /**
     * Runs full validation on the newValue (usually the display value) and sets the parsed value on
     * the component if value passes basic checks and there are no validation errors. <br/>
     * If the newValue is undefined or if it is the same as the last saved displayValue this method
     * skips validation and does not set value (same as ADF). It also updates messages shown
     * if there are errors, and it updates the 'valid' property on the component.<br/>
     * This method returns a Promise if there are async validators
     *  on the component (introduced in v5.2 for custom elements), so if you call this method,
     * and you do work after this method returns that cares about
     * what the value option is, if there are error messages showing, or what the 'valid' state is,
     * then you need to see if the return value is an instanceof Promise,
     * and if so, then you need to wait until it resolves before moving on.
     *
     * @param {string|Object} newValue the ui value that needs to be parsed before it's set.
     * @param {Object=} event an optional event if this was a result of ui interaction. For user
     * initiated actions that trigger a DOM event, passing this event is required. E.g., if user action
     * causes a 'blur' event.
     * @param {Object=} options - an Object literal that callers pass in to determine how validation
     * gets run.
     * @param {boolean=} options.doValueChangeCheck - if set to true compare newValue with last
     * displayValue before running validation; if false, always run validation. E.g., set to false
     * when validate() is called.
     * @param {boolean=} options.doNotClearMessages - if set method will not clear all messages. This
     * is provided for callers that may want to clear only some of the messages. E.g., when required
     * option changes, it clears only component messages, not custom.
     * @param {Array<string>=} options.targetOptions - if specified, only the options specified in
     * this array will be set. If not specified, the "value" option will be set.
     * @param {number=} options.validationMode - accepted values (defined in _VALIDATION_MODE) are:
     * <ul>
     *   <li>FULL - the default and runs both the converter and all validators. </li>
     *   <li>VALIDATORS_ONLY - runs all validators including the required validator is run.</li>
     *   <li>REQUIRED_VALIDATOR_ONLY - runs just the required validator. </li>
     * </ul>
     * @return {Promise|boolean} Promise that resolves to false
     * if value was not set due to validation error,
     * else true, or for widget code or components that do not have async validators or
     * converters, boolean false if value was not set, true otherwise.
     * @example  <caption>Widget subclasses can use this convention to run full validation</caption>
     * this._SetValue(value, event);
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     *
     */
    _SetValue: function (newValue, event, options) {
      var clearBusyStateKey;
      var doValueChangeCheck =
        options && typeof options.doValueChangeCheck === 'boolean'
          ? options.doValueChangeCheck
          : true;
      var self = this;
      var resolvedState = false;
      var validateReturn;
      var fulfilledNewValue;

      // we want to add/remove the oj-has-no-value styleclass so we can style based on
      // if there is something in the field.
      // this is where we validate what the user has typed in, so it is a good place
      // to check this styleclass.
      this._toggleOjHasNoValueClass(newValue);

      // disallow setting a value of undefined by widgets
      if (newValue === undefined) {
        warn('Attempt to set a value of undefined');
        return false;
      }

      if (!doValueChangeCheck || newValue !== self._getLastDisplayValue()) {
        // AsyncValidate returns a promise if the component has async validators
        // that will be resolved to the successfully parsed value
        // if successful or undefined if not successful or was ignored because a newer _AsyncValidate
        // came in.
        // for non-async, it returns the parsed value or undefined if validation failed or
        // was ignored.
        clearBusyStateKey = '' + newValue + '_' + (this._asyncValidatorValidateCounter + 1);
        validateReturn = this._AsyncValidate(newValue, event, options, clearBusyStateKey);

        if (!(validateReturn instanceof Promise)) {
          // Synchronous validation only.
          this._afterAsyncValidateUpdateValue(validateReturn, event, options);
          resolvedState = validateReturn !== undefined;
        } else {
          resolvedState = validateReturn
            .then(function (fnv) {
              fulfilledNewValue = fnv;
              return self._afterAsyncValidateUpdateValue(fnv, event, options);
            })
            .then(function () {
              self._clearBusyState(clearBusyStateKey);
              return fulfilledNewValue !== undefined;
            });
        }
      }
      return resolvedState;
    },

    /**
     * Parses the value and shows an error, if any.
     * </p>
     *
     * @param {string|Object} newValue the value to parse. Usually this is the string display value
     * @param {Object=} event an optional event if this was a result of ui interaction. For user
     * initiated actions that trigger a DOM event, passing this event is required. E.g., if user action
     * causes a 'blur' event.
     *
     * @return {Object|string|undefined} the parsed value or undefined if parse failed.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _ParseValueShowErrors: function (newValue, event) {
      var newMsgs;
      var parsedValueReturn;
      var self = this;

      this._clearAllMessages(event);
      try {
        // Step1: Parse value using converter.

        parsedValueReturn = this._parseValue(newValue, event);
        // It's the successfully parsed value from
        // a synchronous converter.
        return parsedValueReturn;
      } catch (ve) {
        // _parseValue failed
        // turn this into Array of ComponentMessage instances.
        // This is what we set on 'messagesShown'
        newMsgs = self._processValidationErrors(ve);
        self._updateMessagesOption('messagesShown', newMsgs, event);
        self._setValidOption(_INVALID_SHOWN, event);
      }
      return undefined;
    },

    /**
     * Runs full validation on the value. If value fails basic checks
     * (see <a href="#_CanSetValue">_CanSetValue</a>, or if value failed validation, this method
     * returns undefined. Otherwise it returns the successfully parsed value. If validation
     * is async, this returns a Promise that resolves to the successfully parsed and
     * validated value, or undefined if unsuccessful or ignored. As soon as we know that something
     * has failed, we set valid to INVALID_SHOWN, when all pass we set valid to VALID.
     * <p>
     * Components should call this method if they know UI value has changed and want to set the
     * new component value.
     * </p>
     * <p>
     * This method works with any combination of synchronous and asynchronous validators.
     * <p>
     *
     * @param {string|Object} newValue the actual value to be set. Usually this is the string display value
     * @param {Object=} event an optional event if this was a result of ui interaction. For user
     * initiated actions that trigger a DOM event, passing this event is required. E.g., if user action
     * causes a 'blur' event.
     * @param {{doNotClearMessages:boolean,validationContext:number,validationMode:number}=} options
     * an Object literal that callers pass in to determine how validation gets run.
     * @param {boolean=} options.doNotClearMessages - if set method will not clear all messages. This
     * is provided for callers that may want to clear only some of the messages. E.g., when required
     * option changes, it clears only component messages, not custom.
     * @param {number=} options.validationContext - the context this method was called. When not set it
     * defaults to _VALIDATION_CONTEXT.USER_ACTION.
     * @param {number=} options.validationMode - accepted values defined in _VALIDATION_MODE
     * @param {string=} busyStateKey key used to set the busy context. The calling function will
     * clear it.
     *
     * @return {Promise.<Object|string|undefined>|Object|string|undefined}
     * A promise if the component has async validators
     * that will be resolved to the successfully parsed value
     * if successful or undefined if not successful or to be ignored due to a newer validation
     * request coming in.
     * the parsed value or undefined if validation failed.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _AsyncValidate: function (newValue, event, options, busyStateKey) {
      var mode =
        options && options.validationMode ? options.validationMode : this._VALIDATION_MODE.FULL;
      var context =
        options && options.validationContext
          ? options.validationContext
          : this._VALIDATION_CONTEXT.USER_ACTION;
      var doNotClearMessages = (options && options.doNotClearMessages) || false;
      var newMsgs;
      var successfullyParsedValue;
      var self = this;
      var validateReturn;

      // disallow setting a value of undefined by widgets
      if (newValue === undefined) {
        warn('Attempt to set a value of undefined');
        return undefined;
      } else if (this._CanSetValue()) {
        if (!doNotClearMessages) {
          this._clearAllMessages(event);
        }
        // Stores the newValue we are validating. This is consulted to decide whether or
        // not we skip _SetValue
        // if newValue !== self._getLastDisplayValue()
        try {
          // update the validate counter here, before we call _asyncValidateValue,
          // because we refer to it there to know if we need to ignore a validation result if a new
          // async one came in after.
          this._asyncValidatorValidateCounter += 1;

          // Step 1: only when "full" validation is requested converters get run
          if (mode === self._VALIDATION_MODE.FULL) {
            this._setLastDisplayValue(newValue);
            // Step1: Parse value using converter. set valid state to pending in here.
            successfullyParsedValue = this._parseValue(newValue, event, true);
          } else {
            successfullyParsedValue = newValue;
          }

          // Step 2: Parse didn't throw an error.
          // Run validators and set valid state
          // asyncValidateValue will return a Promise if the component has async validators,
          // otherwise it returns the value if successful or undefined if not.
          validateReturn = self._asyncValidateValue(successfullyParsedValue, event, context);
          if (!(validateReturn instanceof Promise)) {
            return validateReturn;
          }
          // validateReturn Promise resolves to 'valid' if all validators pass.
          // Resolves to 'invalidShown' if any validator fails.
          // Resolves to 'ignoreValidation' if we are to ignore validation results.
          self._setBusyState(busyStateKey);
          return validateReturn.then(function (valid) {
            if (valid === _VALID) {
              return successfullyParsedValue;
            }
            return undefined;
          });
        } catch (ve) {
          // SYNCHRONOUS _parseValue failed
          // turn this into Array of ComponentMessage instances.
          // This is what we set on 'messagesShown'
          newMsgs = self._processValidationErrors(ve, context);
          self._updateMessagesOption('messagesShown', newMsgs, event);
          self._setValidOption(_INVALID_SHOWN, event);
        }
      }
      return validateReturn;
    },

    /**
     * After _AsyncValidate, we normally update the value option and format the value to display
     * it, if no errors are showing.
     * This method does nothing if fulfilledNewValue is undefined. It returns false.
     *
     * @param {string|Object} fulfilledNewValue the parsed value. If undefined, this method returns
     * false.
     * @param {Object=} event an optional event if this was a result of ui interaction. For user
     * initiated actions that trigger a DOM event, passing this event is required. E.g., if user action
     * causes a 'blur' event.
     * @param {Object=} options - an Object literal that callers pass in to determine how validation
     * gets run.
     * @param {boolean=} options.doValueChangeCheck - if set to true compare newValue with last
     * displayValue before running validation; if false, always run validation. E.g., set to false
     * when validate() is called.
     * @param {boolean=} options.doNotClearMessages - if set method will not clear all messages. This
     * is provided for callers that may want to clear only some of the messages. E.g., when required
     * option changes, it clears only component messages, not custom.
     * @param {number=} options.validationMode - accepted values (defined in _VALIDATION_MODE) are:
     * <ul>
     *   <li>FULL - the default and runs both the converter and all validators. </li>
     *   <li>VALIDATORS_ONLY - runs all validators including the required validator is run.</li>
     *   <li>REQUIRED_VALIDATOR_ONLY - runs just the required validator. </li>
     * </ul>
     * @return {boolean} true if value was updated, false otherwise.
     *  This method returns false if fulfilledNewValue is undefined.
     * @example  <caption>Widget subclasses can use this convention to run full validation</caption>
     * this._SetValue(value, event);
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     *
     */
    _afterAsyncValidateUpdateValue: function (fulfilledNewValue, event, options) {
      var resolvedState = false;
      var updateContext;
      var doUpdateValueOption;

      if (fulfilledNewValue !== undefined) {
        if (options && options.doNotClearMessages === true) {
          doUpdateValueOption = this.isValid() || !this._hasInvalidComponentMessagesShowing();
        } else {
          doUpdateValueOption = this.isValid();
        }
        if (doUpdateValueOption) {
          if (options && options._context) {
            updateContext = options._context;
          }
          // update value option and then format the value and update display value.
          this._updateValueOption(
            fulfilledNewValue,
            event,
            options && options.validationContext,
            updateContext,
            options
          );
          resolvedState = true;
        }
      }
      return resolvedState;
    },

    _CompareOptionValues: function (option, value1, value2) {
      if (option === 'value' || option === 'rawValue') {
        return oj.Object.compareValues(value1, value2);
      } else if (option.indexOf('messages') === 0) {
        return this._messagesEquals(value1, value2);
      }

      return this._superApply(arguments);
    },

    /**
     * Returns the default styleclass for the component. All input components must override.
     *
     * @return {string}
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @abstract
     */
    _GetDefaultStyleClass: function () {
      oj.Assert.failedInAbstractFunction();
      return '';
    },

    // I N T E R N A L   P R I V A T E   C O N S T A N T S    A N D   M E T H O D S
    // Subclasses should not override or call these methods

    /**
     * Types of messaging content to update.
     * <ul>
     * <li>'INIT' - builds all messaging content needed for component initialization</li>
     * <li>'VALIDITY_STATE' - updates only validityState every time validation runs and there are
     * new messages or when the messages option changes.</li>
     * <li>'CONVERTER_HINT' - updates only converter hints, this is used when converter option
     * changes</li>
     * <li>'VALIDATOR_HINTS' - updates only validator hints, this is used when validators option
     * changes or when validator hints are first shown the the user.</li>
     * <li>'TITLE' - updates only title, when the title property changes</li>
     * </ul>
     * @private
     * @memberof oj.editableValue
     */
    _MESSAGING_CONTENT_UPDATE_TYPE: {
      INIT: 1,
      VALIDITY_STATE: 2,
      CONVERTER_HINT: 3,
      VALIDATOR_HINTS: 4,
      TITLE: 5
    },

    /**
     * when below listed options are passed to the component, corresponding CSS will be toggled
     * @private
     * @const
     * @type {Object}
     * @memberof oj.editableValue
     */
    _OPTION_TO_CSS_MAPPING: {
      disabled: 'oj-disabled',
      required: 'oj-required'
    },

    /**
     * Clears all messages for this component. Today this only happens when <br/>
     *  - the component's value changes as a result of user interaction, <br/>
     *  - the reset method is called, <br/>
     *  - component is destroyed.<br/>
     *
     * @param {Event=} event the original event (for user initiated actions that trigger a DOM event,
     * like blur) or undefined.
     * @param {boolean=} doNotSetOption default value is false; a true value clears the option
     * directly without using the public option method, causing no events to be fired.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _clearAllMessages: function (event, doNotSetOption) {
      if (!doNotSetOption) {
        this._clearMessages('messagesHidden', event);
        this._clearMessages('messagesShown', event);
        this._clearMessages('messagesCustom', event);
      } else {
        this.options.messagesHidden = [];
        this.options.messagesShown = [];
        this.options.messagesCustom = [];
      }
    },

    /**
     * Clears all messages that were added by component. These includes all messages in messagesHidden
     * option and all messages except custom in messagesShown.
     *
     * Called when these options change - validators, disabled, readonly, required, and methods -
     * refresh are called.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _clearComponentMessages: function () {
      var beforeLen;
      var msg;
      var shownMsgs = this.options.messagesShown;

      beforeLen = shownMsgs.length;
      this._clearMessages('messagesHidden');

      // remove component messages in messagesShown. Custom messges are kept intact.
      for (var i = beforeLen - 1; i >= 0; i--) {
        // NOTE: shownMsgs is this.options['messagesShown']
        // so we are modifying this.options['messagesShown'] here.
        msg = shownMsgs[i];
        if (msg instanceof Message.ComponentMessage) {
          shownMsgs.splice(i, 1);
        }
      }

      if (shownMsgs.length !== beforeLen) {
        // Setting 'changed' flag to true means that although we have already
        // updated this.options['messagesShown'], we still want to fire a messagesShownChanged event.
        this._setMessagesOption('messagesShown', shownMsgs, null, true);
      }
    },

    /**
     * Sets the messages option with the new value.
     * Setting 'changed' flag to true means we want to fire a property changed event
     * without checking that the option value to what you are setting it to. Useful
     * if the option is an array or we have already updated the option directly.
     *
     * This method updates the option directly without invoking setOption() method. This is done by
     * setting the following property in flags parameter of the option() method -
     * <code class="prettyprint">{'_context': {internalSet: true}}</code>
     *
     * @param {string} key
     * @param {Array} value
     * @param {Event=} event the event like the user blurred to trigger a messages option change
     * or undefined.
     * @param {Boolean=} changed when this is true, then we set the 'changed' flag to true, and having
     * the changed flag be true will guarantee that the property changed event is fired even if the
     * the property value is equal to what you are setting it to.
     * @private
     * @memberof oj.editableValue
     */
    _setMessagesOption: function (key, value, event, changed) {
      var flags = {};

      // Optimize for the common 'clear' operation
      var bothEmpty = value.length === 0 && this.options[key].length === 0;

      if (changed || !bothEmpty) {
        // 'messagesCustom' is not read-only, but 'messagesShown' and 'messagesHidden' are
        flags._context = { originalEvent: event, writeback: true, internalSet: true };
        if (key !== 'messagesCustom') {
          flags._context.readOnly = true;
        }

        flags.changed = changed || !bothEmpty;

        this._resetValid();

        this.option(key, value, flags);

        this._updateMessagingContent();
      }
    },

    /**
     * Sets the valid option with the new value.
     *
     * This method updates the option directly without invoking setOption() method. This is done by
     * setting the following property in flags parameter of the option() method -
     * <code class="prettyprint">{'_context': {internalSet: true}}</code>
     *
     * @param {string} newValidState The new valid state to set on the valid option
     *   e.g., "pending", "valid", "invalidShown", "invalidHidden"
     * @param {Event=} event the original event (for user initiated actions that trigger a DOM event,
     * like blur) or undefined. The custom element bridge creates a CustomEvent out of this when
     * it sends the property changed event.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _setValidOption: function (newValidState, event) {
      var flags = {};

      // We do not want to set valid state to PENDING if we are already showing messages, e.g., messages-custom.
      if (!(newValidState === _PENDING && this._determineValidFromMessagesOptions() !== _VALID)) {
        // do not set if it is already set to that
        if (newValidState !== this.options.valid) {
          // 'valid' is read-only
          flags._context = {
            originalEvent: event,
            writeback: true,
            internalSet: true,
            readOnly: true
          };

          this.option('valid', newValidState, flags);
        }
      }
    },

    /**
     * Clears the messages and message options - <code class="prettyprint">messagesHidden</code>,
     * <code class="prettyprint">messagesShown</code>, <code class="prettyprint">messagesCustom</code>.
     *
     * @param {String} option messages option that is being cleared.
     * @param {Event=} event the original event (for user initiated actions that trigger a DOM event,
     * like blur) or undefined.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _clearMessages: function (option, event) {
      this._setMessagesOption(option, [], event);
    },

    /**
     * Clones messages before it's set. <br/>
     *
     * @param {Array=} value
     * @returns {Array} of cloned messages
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _cloneMessagesBeforeSet: function (value) {
      var i;
      var msg;
      var msgsClone = [];
      var val;

      // we want all messages to be an instance of Message. So clone array
      if (value && value.length > 0) {
        for (i = 0; i < value.length; i++) {
          val = value[i];
          msg = new Message(val.summary, val.detail, val.severity);
          msg = Object.freeze ? Object.freeze(msg) : msg;
          msgsClone.push(msg);
        }
      }

      return msgsClone;
    },

    /**
     * Create the ojLabel component with help (required is done in the components that support
     * required) see EditableValueUtils._refreshRequired.
     * This is not supported for custom elements. For pages with custom elements, the app dev
     * uses the public &lt;oj-label> component.
     * @private
     * @memberof oj.editableValue
     * @instance
     *
     */
    _createOjLabel: function () {
      var helpDef;
      var helpSource;

      if (this._IsCustomElement()) {
        return;
      }

      this.$label = this._GetLabelElement();
      if (this.$label) {
        helpDef = this.options.help.definition;
        helpSource = this.options.help.source;

        // create the ojLabel component
        this.$label.ojLabel({
          rootAttributes: { class: this._GetDefaultStyleClass() + '-label' },
          help: { definition: helpDef, source: helpSource }
        });
        this._createDescribedByForLabel();
      }
    },
    /**
     * Refreshes the aria-describedby for label element's helpIcon
     * @protected
     * @memberof oj.editableValue
     * @instance
     */
    _createDescribedByForLabel: function () {
      var helpDef = this.options.help.definition;
      var helpSource = this.options.help.source;
      var labelId;

      if (helpSource != null || helpDef != null) {
        var label = this.$label[0];

        // get label's helpIconSpan get the id and add it here.
        if (label) {
          labelId = label.id;
        }

        if (labelId) {
          this._describedByUpdated(null, labelId + _HELP_ICON_ID);
        }
      }
    },

    /**
     * Refreshes the component to respond to DOM changes, in which case fullRefresh=true.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _doRefresh: function () {
      var runFullValidation = false;
      var displayValue;

      // reset state and re-initialize component messaging, since refresh() can be called when
      // locale changes, requiring component to show messaging artifactsthis._ for current locale.
      this._ResetComponentState();
      this._initComponentMessaging();
      this._Refresh('disabled', this.options.disabled);

      // runFullValidation, if needed, does a full validation
      // which in turn updates value option and converted display value
      if (this._hasInvalidMessagesShowing()) {
        runFullValidation = true;
      }

      this._clearComponentMessages();

      if (runFullValidation) {
        // this may return a Promise
        displayValue = this._GetDisplayValue();
        // runs full validation on the display value. May be async
        this._SetValue(displayValue, null, EditableValueUtils.refreshMethodOptions);
      } else {
        // run deferred validation if comp is either showing a deferred error or has no errors.
        // But only when required is true.
        if (this._IsRequired()) {
          this._runDeferredValidation(EditableValueUtils.refreshMethodOptions.validationContext);
        }
        // refresh UI display value when there are no errors or where there are only deferred errors
        this._Refresh('value', this.options.value, true);
      }
    },

    /**
     * Gets the last stored model value
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getLastModelValue: function () {
      return this._oj_lastModelValue;
    },

    /**
     * Gets the last display value
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getLastDisplayValue: function () {
      // initially, _oj_lastElementValue is undefined. But the browser returns "" for the
      // displayValue.
      if (this._oj_lastElementValue === undefined) {
        this._oj_lastElementValue = '';
      }
      return this._oj_lastElementValue;
    },
    /**
     * Get the element whose id matches the elem's aria-labelledby value, if any.
     * @param {Object} elem the dom element from which you want to get the
     * aria-labelledby property value
     * @return {jQuery|null} if element does not have aria-labelledby defined, then
     *    returns null. If it  does, then return a new jQuery object with the
     *    label with an id equal to the aria-labelledby value. If no match, then
     *    the jQuery object will be empty.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getAriaLabelledByElement: function (elem) {
      // this is the widget way of doing things, so return if custom element.
      if (this._IsCustomElement()) {
        return null;
      }
      // look for a label with an id equal to the value of aria-labelledby.
      // .prop does not work for aria-labelledby. Need to use .attr to find
      // aria-labelledby.
      var ariaId = elem[0].getAttribute('aria-labelledby');
      var labelQuery;

      if (ariaId !== undefined) {
        labelQuery = "label[id='" + ariaId + "']";
        return $(labelQuery);
      }
      return null;
    },

    /**
     * Returns a concat of messagesShown and messagesHidden.
     *
     * @returns {Array}
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getMessages: function () {
      var messages = [];
      // messagesShown and messagesHidden could be undefined
      if (this.options.messagesShown) {
        messages = messages.concat(this.options.messagesShown);
      }
      if (this.options.messagesHidden) {
        messages = messages.concat(this.options.messagesHidden);
      }
      return messages; // todo: revisit
    },
    /**
     * Helper method to retrieve the label text. Needed for required translation.
     * Returns the form component's label or oj-label's textContent, if the label was found.
     *
     * @return {string|null}
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getLabelText: function () {
      if (this.$label) {
        return this.$label[0].textContent;
      }

      var ojlabels = EditableValueUtils._getCustomOjLabelElements(this.options.labelledBy);
      var labelTextContent = null;
      if (ojlabels) {
        for (var i = 0; i < ojlabels.length; i++) {
          if (i > 0) {
            labelTextContent += ' ';
          }
          var ojlabel = ojlabels[i];
          labelTextContent = ojlabel.textContent;
        }
      }
      return labelTextContent;
    },

    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getValidityState: function () {
      if (this._validityState) {
        return this._validityState;
      }

      this._validityState = new oj.ComponentValidity(this.isValid(), this._getMessages());

      return this._validityState;
    },

    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _hasValidityState: function () {
      if (this._validityState) {
        return true;
      }
      return false;
    },

    /**
     * Whether component has invalid messages.
     *
     * @return {boolean} true if invalid; false otherwise
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _hasInvalidMessages: function () {
      return !Message.isValid(this._getMessages());
    },

    /**
     * Whether there are invalid messages, that are currently showing.
     *
     * @return {boolean}
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _hasInvalidMessagesShowing: function () {
      return !this.isValid() && this.options.messagesShown.length > 0;
    },

    /**
     * Whether component has invalid messages added by component, that are currently showing.
     *
     * @return {boolean}
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _hasInvalidComponentMessagesShowing: function () {
      var compMsgs;
      var msg;
      var shown = this.options.messagesShown;

      for (var i = 0; i < shown.length; i++) {
        msg = shown[i];
        if (msg instanceof Message.ComponentMessage && msg._isMessageAddedByComponent()) {
          compMsgs = compMsgs || [];
          compMsgs.push(msg);
        }
      }

      return compMsgs === undefined ? false : !Message.isValid(compMsgs);
    },

    /**
     * Initializes component messaging both when component is initialized or when displayOptions is
     * set/changed. Call this only when you know the converter has resolved.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _initComponentMessaging: function () {
      var compMessaging = this._getComponentMessaging();
      var messagingLauncher = this._GetMessagingLauncherElement();
      var compContentElement = this._GetContentElement();
      var messagingContent = this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.INIT);

      // if default placeholder is currently set then it needs to be cleared here. This is needed for
      // the following reasons
      // i. a component is reinitialized when the locale changed, requiring the converter hint for
      // new locale to be set as placeholder.
      // ii. or a component's placeholder option or displayOptions option, could have changed
      // requiring the placeholder to be reset if it's currently set to the default.
      if (!this._customPlaceholderSet) {
        this._ClearPlaceholder();
      }

      // this sets all messaging content other than messaging content not needed until the user
      // does something to see them. e.g, validator hints are shown until focus on the field.
      // we do this to help initial render performance.
      compMessaging.activate(messagingLauncher, compContentElement, messagingContent);

      // Async validators hints are retrieved only when they are needed to be shown to the user.
      // See PopupComponentMessaging.js
      // initialize this counter when we initialize the component.
      // It is used to decide whether or not to ignore async validate resolutions.
      this._asyncValidatorValidateCounter = 0;
    },

    /**
     * Called after messagesCustom option changed. This method pushes custom messages to the
     * messagesShown option.
     *
     * @param {Object} flags
     * @returns {undefined}
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _messagesCustomOptionChanged: function (flags) {
      var context = flags ? flags._context : null;
      var customMsgs = this.options.messagesCustom;
      var i;
      var msg;
      var previousShown = this.options.messagesShown;
      var shownMsgs = [];

      // remove old custom messages from messagesShown array
      for (i = 0; i < previousShown.length; i++) {
        msg = previousShown[i];
        if (msg instanceof Message.ComponentMessage && msg._isMessageAddedByComponent()) {
          shownMsgs.push(msg);
        }
      }

      // add new customMsgs to messagesShown
      for (i = 0; i < customMsgs.length; i++) {
        shownMsgs.push(customMsgs[i]);
      }

      // set 'messagesShown' option as an internal set
      this._setMessagesOption(
        'messagesShown',
        shownMsgs,
        context ? context.originalEvent : null,
        flags && flags.changed
      );
    },
    /**
     * This is only needed when we use the
     * deprecated display-options.converter-hint=['placeholder','notewindow'] api that is used
     * in the Alta theme and not the Redwood theme.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _placeholderOptionChanged: function (flags) {
      if (this._getResolvedUserAssistance() !== 'displayOptions') {
        return;
      }
      var context = (flags && flags._context) || {};
      var refreshMessagingOptions =
        //  internalMessagingSet indicates whether the current change is from the messaging module.
        // see ComponentMessaging for details
        !context.internalMessagingSet;
      if (refreshMessagingOptions) {
        // if placeholder was set and it's not from messaging code, then the messaging display options
        // may need to re-evaluated. E.g., the default display for
        // converterHint: ['placeholder', 'notewindow'] is 'placeholder', but if user were to set a
        // custom placeholder, this changes the default display for convererHint from 'placeholder'
        // to 'notewindow'.
        this._customPlaceholderSet = true;
        if (this._GetConverter()) {
          this._initComponentMessaging();
        }
      } else {
        this._customPlaceholderSet = false;
      }
    },
    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _setLastModelValue: function (value) {
      this._oj_lastModelValue = value;
    },
    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _setLastDisplayValue: function (value) {
      this._oj_lastElementValue = value;
    },

    /**
     * Adds messages to the option specified - <code class="prettyprint">messagesShown</code> or
     * <code class="prettyprint">messagesHidden</code>.
     *
     * @param {String} option name of the option
     * @param {Object|Array} newMsgs an Array of one or more Message object.
     * @param {Event=} event - the event like the user blurred to trigger a messages option change
     * or undefined.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _updateMessagesOption: function (option, newMsgs, event) {
      var i;
      var len;
      var msgs;

      if (typeof newMsgs === 'object' && Array.isArray(newMsgs)) {
        // update this.options[option] directly by pushing any new messages into it.
        msgs = this.options[option];

        len = newMsgs.length;
        for (i = 0; i < len; i++) {
          msgs.push(newMsgs[i]);
        }
      }
      // Setting 'changed' flag to true means that although we have already
      // updated this.options[option], we still want to fire a property changed event.
      this._setMessagesOption(option, msgs, event, true);
    },

    /**
     * Called after the messages* option (messagesShown, etc)
     * has changed to update messaging content
     * display.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _updateMessagingContent: function () {
      // update component messaging
      this._getComponentMessaging().update(
        this._getMessagingContent(this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDITY_STATE)
      );
    },

    /**
     * Writes the value into the option by calling the option method.
     *
     * @param {Object|string} newValue the new value to be written to option
     * @param {Object=} event the original event that triggered this
     * @param {number=} validationContext the context in which validation was run that resulted in
     * value being updated.
     * @param {Object=} updateContext the context for updating the value option.
     * @param {Object=} options options for updating the value.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     * @see #_setOption
     * @see #_AfterSetOptionValue
     */
    _updateValueOption: function (newValue, event, validationContext, updateContext, options) {
      var context = updateContext || {};

      // set dom event
      if (event) {
        context.originalEvent = event;
      }

      // set writeback flag that determines whether value is written back.
      switch (validationContext) {
        // value is written back outside of normal UI interaction in the following cases.
        case this._VALIDATION_CONTEXT.CONVERTER_OPTION_CHANGE:
        case this._VALIDATION_CONTEXT.DISABLED_OPTION_CHANGE:
        case this._VALIDATION_CONTEXT.READONLY_OPTION_CHANGE:
        case this._VALIDATION_CONTEXT.REFRESH_METHOD:
        case this._VALIDATION_CONTEXT.REQUIRED_OPTION_CHANGE:
        case this._VALIDATION_CONTEXT.VALIDATE_METHOD:
        case this._VALIDATION_CONTEXT.VALIDATORS_OPTION_CHANGE:
          context.writeback = true;

          // when the above options change or methods are called, and full validation is run the
          // current display value is parsed, and set on the value option if all validations pass.
          // Typically when the value option changes - either programmatically or user changes it, we
          // end up clearing all 3 messages options.
          // But when value changes indirectly as a result of the above cases, then we do not clear
          // custom messages. So a special flag is set so _AfterSetOptionValue can do the right
          // thing. Component messages are already cleared when this method is called.
          context.doNotClearMessages = true;
          break;

        default:
          break;
      }

      context.internalSet = true;

      var valueMap;
      var isValueChanged;
      if (options && options.targetOptions) {
        // If targetOptions is specified, update all options in the array
        valueMap = {};
        isValueChanged = false;
        for (var i = 0; i < options.targetOptions.length; i++) {
          valueMap[options.targetOptions[i]] = newValue;
          isValueChanged = isValueChanged || options.targetOptions[i] === 'value';
        }
      } else {
        // If no targetOptions is specified, just update the "value" option
        valueMap = { value: newValue };
        isValueChanged = true;
      }
      this.option(valueMap, { _context: context });

      if (isValueChanged) {
        // When internalSet is true _setOption->_AfterSetOptionValue->_Refresh isn't called.
        // We still need the converter to run and the displayValue to be refreshed, so we
        // call this._AfterSetOptionValue ourselves
        this._AfterSetOptionValue('value', { _context: context });
      }
    },

    /**
     * Resets the internal property so that the next call to this.isValid() re-evaluates the correct
     * value.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _resetValid: function () {
      this._valid = undefined;
    },

    /**
     * Determines the validity of component based on current value of the messages* options.
     * This is what the 'valid' property should be set to.
     *
     * Now when we start the lifecycle we clearAllMessages, then we continue with validation, etc.
     * But we don't want to update the valid property on clearAllMessages and again when validation
     * has failed. We want to update it only once.
     * @return {string} "valid", "invalidShown", "invalidHidden"
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _determineValidFromMessagesOptions: function () {
      var msgsHidden = this.options.messagesHidden;
      var msgsShown = this.options.messagesShown;

      var valid = _VALID;

      // When new messages are written update the valid property
      if (msgsShown && msgsShown.length !== 0 && !Message.isValid(msgsShown)) {
        valid = _INVALID_SHOWN;
      } else if (msgsHidden && msgsHidden.length !== 0 && !Message.isValid(msgsHidden)) {
        valid = _INVALID_HIDDEN;
      }

      return valid;
    },

    /**
     * Formats the value for display, based on the converter options. If no converter is set then
     * returns the value as is.
     *
     * @param {string} value value to be formatted
     *
     * @return {string} formatted value
     * @throws {Error} when an error occurs during formatting
     * @protected
     * @memberof oj.editableValue
     * @instance
     */
    _formatValue: function (value) {
      var formattedValue = value;
      var converter = this._GetConverter();

      // don't clear messages here because we clear messages only when direct user interaction with
      // component changes value. All other usecases we expect page authors to clear messages.

      if (converter) {
        // Check if we have a converter instance
        if (typeof converter === 'object') {
          if (converter.format && typeof converter.format === 'function') {
            formattedValue = converter.format(value);
          }
        }
      }

      return formattedValue;
    },

    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getComponentMessaging: function () {
      if (!this._componentMessaging) {
        this._componentMessaging = new oj.ComponentMessaging(this);
      }

      return this._componentMessaging;
    },

    /**
     * Returns an array of validator hints from any validator with getHint() function.
     * @param {Array} allValidators these are from the validators option
     * and from the GetImplicitValidators function.
     * These can be sync validators only since async validators api does not have getHint(),
     * it has .hint property.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getHintsFromAllValidatorsWithGetHintFunction: function (allValidators) {
      var i;
      var validator;
      var validatorHints = [];
      var vHint = '';

      if (this._IsRequired()) {
        // get the hint for the default required validator and push into array if it's not already
        // present in the validators array
        validator = this._getImplicitRequiredValidator();
        if (validator.getHint && typeof validator.getHint === 'function') {
          vHint = validator.getHint();
          if (vHint) {
            validatorHints.push(vHint);
          }
        }
      }

      // loop through all remaining validators to gather hints.
      // this will get sync validators only since sync validators have getHint() api
      // and async validators have .hint property.
      for (i = 0; i < allValidators.length; i++) {
        validator = allValidators[i];
        vHint = '';
        if (typeof validator === 'object') {
          if (validator.getHint && typeof validator.getHint === 'function') {
            vHint = validator.getHint();
            if (vHint) {
              validatorHints.push(vHint);
            }
          }
        }
      }

      return validatorHints;
    },

    /**
     * Returns the required validator instance or creates it if needed and caches it.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getImplicitRequiredValidator: function () {
      var reqTrans = {};
      var reqValOptions;

      if (this._implicitReqValidator == null) {
        // falsey check
        reqTrans = this.options.translations ? this.options.translations.required || {} : {};

        // TODO: cache required validator; purged when its options change, i.e., translations or label
        // DOM changes
        reqValOptions = {
          hint: reqTrans.hint || null,
          label: this._getLabelText(),
          messageSummary: reqTrans.messageSummary || null,
          messageDetail: reqTrans.messageDetail || null
        };
        this._implicitReqValidator = new RequiredValidator(reqValOptions);
      }
      return this._implicitReqValidator;
    },

    /**
     * In the Alta theme, we want to continue to use the display-options properties to decide
     * where to render help-instruction, messages, validation-hint, etc. For example, if
     * display-options.messages = 'notewindow' then the messages will show up in a popup on focus.
     *
     * In the Redwood theme, we instead use the user-assistance attribute set on the component
     * to decide whether to show the user assistance (this includes Required)
     * inline or in compact mode which is where the user assistance is shown via a popup,
     * like in the ? icon on the label or a (x) icon in the field.
     * We need a way to say 'use' the user-assistance-density attribute or 'ignore'
     * the user-assistance-density attribute and instead use the 'old' way
     * of doing things based on the theme.
     * And if you are 'using' the user-assistance-density attribute what is it,
     * reflow or efficient or compact?
     * @return {'reflow'|'efficient'|'compact'|'displayOptions'} If 'displayOptions' it uses
     * the 'old' way of doing things which is to look at all the displayOptions for where to display
     * things. If 'efficient' or 'reflow' it renders all the user assistance inline,
     * and if compact it renders everything in the 'compact' ux design which is in notewindows.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getResolvedUserAssistance: function () {
      // ThemeUtils caches the result so no need to do it here.
      let defaultOptions = parseJSONFromFontFamily('oj-form-control-option-defaults');

      // this will return 'use' or 'ignore'. This tells us whether we should use the
      // user-assistance-density attribute or ignore it. If we ignore it, we will
      // use the displayOptions attribute.
      if (defaultOptions) {
        let useUserAssistanceOption = defaultOptions.useUserAssistanceOptionDefault;
        return useUserAssistanceOption === 'use'
          ? this.options.userAssistanceDensity
          : 'displayOptions';
      }
      // if no theme return displayOptions for bw compatibility.
      return 'displayOptions';
    },
    /**
     * In the Alta theme, we show required on the label with an * icon,
     * and help on label with a ? icon.
     * In the Redwood theme, we show 'Required'/help as text inline if
     * user-assistance-density attribute is not 'compact',
     * else we show it as an * on the icon.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _showUserAssistanceNotInline: function () {
      let resolvedUserAssistance = this._getResolvedUserAssistance();

      return resolvedUserAssistance === 'compact' || resolvedUserAssistance === 'displayOptions';
    },

    /**
     * Returns content that will be used by messaging strategies.
     *
     * @param {number} updateType of messaging content to update. Accepted values are defined by
     * this._MESSAGING_CONTENT_UPDATE_TYPE.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getMessagingContent: function (updateType) {
      var messagingContent = {};

      var allValidators;
      var converter;
      var converterHint = '';

      // eslint-disable-next-line no-param-reassign
      updateType = updateType || this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDITY_STATE;

      // Add validityState which includes messages, valid and severity.
      // These are shown to the user right away on initialization if they are there.
      if (
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.INIT ||
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDITY_STATE
      ) {
        // get messages from messagesShown and messagesHidden
        messagingContent.validityState = this._getMessagingContentValidityState();
      }

      if (
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.INIT ||
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.CONVERTER_HINT
      ) {
        converter = this._GetConverter();
        if (converter) {
          if (typeof converter === 'object') {
            if (converter.getHint && typeof converter.getHint === 'function') {
              converterHint = converter.getHint() || '';
            }
          }
        }
        messagingContent.converterHint = converterHint;
      }

      // Do not get validator hints on component initialization. Instead we get them
      // when the user first needs them, like when they focus in the input.
      // We do this to help initial render performance.
      if (updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.VALIDATOR_HINTS) {
        // gets implicit validators and all validators from the validators option.
        allValidators = this._GetAllValidatorsFromValidatorsOptionAndImplicit();
        // sync validators have getHint() function.
        // async validators do not; they have hint property.
        // so this will get sync validators' hints
        let syncValidatorHints =
          this._getHintsFromAllValidatorsWithGetHintFunction(allValidators) || [];
        messagingContent.validatorHint = syncValidatorHints;
      }

      if (
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.INIT ||
        updateType === this._MESSAGING_CONTENT_UPDATE_TYPE.TITLE
      ) {
        // For custom element components, we use help.instruction option value for the
        // messageContent title, otherwise, use the title option value.  help.instruction
        // is used by custom element components, and title is used by non-custom element components.
        var title;

        if (this._IsCustomElement()) {
          var help = this.options.help;

          if (help != null) {
            title = help.instruction;
          }
        } else {
          title = this.options.title;
        }

        messagingContent.title = title || '';
      }

      return messagingContent;
    },

    /**
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _getMessagingContentValidityState: function () {
      let validityState;
      if (!this._hasValidityState()) {
        // this will create the validity state.
        validityState = this._getValidityState();
      } else {
        // update validityState before packaging it
        validityState = this._getValidityState();
        validityState.update(this.isValid(), this._getMessages());
      }
      return validityState;
    },

    /**
     * Compares the messages arrays for equality.
     *
     * @param {Array} pm previous messages
     * @param {Array} m new messages
     * @returns {boolean} true if equal false otherwise
     * @private
     * @memberof oj.editableValue
     * @instance
     *
     */
    _messagesEquals: function (pm, m) {
      var match = -1;
      var pmo;
      var passed = true;
      // $.extend merges the contents of two or more objects together into the first object
      var previousMsgs = $.extend([], pm);
      var msgs = $.extend([], m);

      if (previousMsgs.length !== msgs.length) {
        return false;
      }

      // one way it gets here is if there is one messages-custom message on initialization and
      // after the busyContext is complete meaning the page is rendered, we set a different
      // messages-custom message.
      previousMsgs.forEach(function (pMsg) {
        if (!(pMsg instanceof Message)) {
          // freeze message instance once its created
          pmo = new Message(pMsg.summary, pMsg.detail, pMsg.severity);
          pmo = Object.freeze ? Object.freeze(pmo) : pmo;
        } else {
          pmo = pMsg;
        }

        match = -1;
        msgs.forEach(function (msg, j) {
          if (
            Message.getSeverityLevel(pmo.severity) === Message.getSeverityLevel(msg.severity) &&
            pmo.summary === msg.summary &&
            pmo.detail === msg.detail
          ) {
            match = j;
            // found a match, so break out of loop
          }
        });

        // remove entry at 'match' index from msgs
        if (match > -1) {
          msgs.splice(match, 1);
        } else {
          // we found no match so no need to loop
          passed = false;
        }
      });

      return passed;
    },

    /**
     * Parses the value using the converter set and returns the parsed value. If parsing fails the
     * error is written into the element. This function sets the valid state to PENDING before it tries
     * to parse.
     *
     * @param {string=} submittedValue to parse
     * @param {Object=} event an optional event if this was a result of ui interaction. For user
     * initiated actions that trigger a DOM event, passing this event is required. E.g., if user action
     * causes a 'blur' event.
     * @param {boolean?} setValid true if you want to set the valid state to pending->invalid
     * @return {Object} parsed value
     * @throws {Error} an Object with message
     * @protected
     * @memberof oj.editableValue
     * @instance
     */
    _parseValue: function (submittedValue, event, setValid) {
      var converter = this._GetConverter();
      var parsedValue = submittedValue;

      if (converter) {
        if (typeof converter === 'object') {
          if (converter.parse && typeof converter.parse === 'function') {
            try {
              // we are dealing with a converter instance
              if (setValid) {
                this._setValidOption(_PENDING, event);
              }
              parsedValue = converter.parse(submittedValue);
              // caller will set valid option, since usually we go on to call validators after
              // converters and don't want to set pending->valid->pending again.
            } catch (error) {
              throw error;
            }
          }
        }
      }

      return parsedValue;
    },
    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _addValidationError: function (e, msgs) {
      var detail;
      var severity;
      var ojmessage;
      var summary;

      if (e instanceof ConverterError || e instanceof ValidatorError) {
        ojmessage = e.getMessage();

        severity = ojmessage.severity || Message.SEVERITY_LEVEL.ERROR;
        summary = ojmessage.summary || getTranslatedString('oj-message.error');
        detail = ojmessage.detail || getTranslatedString('oj-converter.detail');
      } else if (e.summary || e.detail) {
        severity = Message.SEVERITY_LEVEL.ERROR;
        summary = e.summary || getTranslatedString('oj-message.error');
        detail = e.detail || getTranslatedString('oj-converter.detail');
      } else {
        // TODO: is this error message generic enough to use for both converter and validator errors?
        severity = Message.SEVERITY_LEVEL.ERROR;
        summary = getTranslatedString('oj-message.error');
        detail = e.message || getTranslatedString('oj-converter.detail');
      }

      msgs.push({ summary: summary, detail: detail, severity: severity });
    },

    /**
     * Processes the error information for one or more errors and returns an Array of
     * ComponentMessage instances.
     *
     * @param {Error} e instance of Error
     * @param {number=} context the context in which the validation error was thrown
     * @param {String=} display whether message is shown or hidden
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _processValidationErrors: function (e, context, display) {
      var componentMsgs = [];
      var msg;
      var msgs = e._messages || [];
      var options = {};

      options.context = context || 0;
      options.display = display || Message.ComponentMessage.DISPLAY.SHOWN;

      if (msgs.length === 0) {
        this._addValidationError(e, msgs);
      }

      for (var i = 0; i < msgs.length; i++) {
        msg = msgs[i];
        componentMsgs.push(
          this._createComponentMessage(msg.summary, msg.detail, msg.severity, options)
        );
      }

      return componentMsgs || null;
    },
    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _createComponentMessage: function (summary, detail, severity, options) {
      var cMsg;
      // new properties can't be added but existing properties can be changed
      cMsg = new Message.ComponentMessage(summary, detail, severity, options);
      cMsg = Object.seal ? Object.seal(cMsg) : cMsg;
      return cMsg;
    },

    /**
     * Formats and refreshes the component display value,
     * only when the current value is different from the last
     * saved value, unless asked to always refresh the display value.
     *
     * @param {Object|undefined} value the changed value that needs to be updated on UI
     * @param {boolean=} fullRefresh false is the default; true means always refresh component
     * display value using the current option value. This overwrites any UI value, the user may have
     * entered.
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _refreshComponentDisplayValue: function (value, fullRefresh) {
      var displayValueReturn;

      // when we change the display value via value change we want to
      // update the 'oj-has-no-value' class.
      this._toggleOjHasNoValueClass(value);

      // We set the last model value after the format, so this is saying,
      // has the value about to be formatted different than the one we last formatted?
      if (fullRefresh || value !== this._getLastModelValue()) {
        // this formats the value and displays it.
        displayValueReturn = this._UpdateElementDisplayValue(value);
      }
      return displayValueReturn;
    },

    /**
     * Toggles css selector on the widget. E.g., when required option changes, the oj-required
     * selector needs to be toggled.
     * @param {string} option
     * @param {Object|string} value
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _refreshTheming: function (option, value) {
      if (Object.keys(this._OPTION_TO_CSS_MAPPING).indexOf(option) !== -1) {
        if (value) {
          this.widget()[0].classList.add(this._OPTION_TO_CSS_MAPPING[option]);
        } else {
          this.widget()[0].classList.remove(this._OPTION_TO_CSS_MAPPING[option]);
        }
      }
    },

    /**
     * Runs validators in deferred mode using the option value. Any validation error thrown is
     * deferred, or hidden by component, until explicitly asked to show them (see showMessages()).
     * Deferred error is pushed to <code class="prettyprint">messagesHidden</code> option.
     *
     * @param {number} context in which validation was run.
     * @see #showMessages
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _runDeferredValidation: function (context) {
      var self = this;

      if (this._CanSetValue()) {
        if (!this._resolveBusyStateDeferredValidation) {
          var domElem = this.element[0];
          var busyContext = Context.getContext(domElem).getBusyContext();
          var description = 'The page is waiting for async deferred validation ';

          if (domElem && domElem.id) {
            description += 'for "' + domElem.id + '" ';
          }
          description += 'to finish.';
          this._resolveBusyStateDeferredValidation = busyContext.addBusyState({
            description: description
          });
        }
        var resultPromise = this._validateValueForRequiredOnly(this.options.value, context);
        if (resultPromise instanceof Promise) {
          resultPromise.then(function () {
            if (self._resolveBusyStateDeferredValidation) {
              self._resolveBusyStateDeferredValidation();
              delete self._resolveBusyStateDeferredValidation;
            }
            self._setValidOption(self._determineValidFromMessagesOptions(), null);
          });
        } else {
          this._setValidOption(this._determineValidFromMessagesOptions(), null);
          if (this._resolveBusyStateDeferredValidation) {
            this._resolveBusyStateDeferredValidation();
            delete this._resolveBusyStateDeferredValidation;
          }
          return;
        }
      }
      this._setValidOption(this._determineValidFromMessagesOptions(), null);
    },

    /**
     * Runs either deferred or normal validation based on the state component is in. This method is
     * called when certain options change - required, disabled etc.
     *
     * <p>
     * - if component is invalid and has messgesShown -> required: false/true -> clear component errors;
     * run full validation with UI value (we don't know if the UI error is from a required validator
     * or something else);<br/>
     * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is
     * updated<br/>
     * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to
     * listen to valueChanged to clear custom errors.<br/>
     *
     * - if component is invalid and has messagesHidden -> required: false -> clear component
     * errors; no deferred validation is run.<br/>
     * - if component has no error -> required: true -> run deferred validation (we don't want to flag
     * errors unnecessarily)<br/>
     * - messagesCustom is never cleared<br/>
     * </p>
     *
     * @param {Object} validationOptions
     *
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _runMixedValidationAfterSetOption: function (validationOptions) {
      var runFullValidation = false;
      var displayValue;

      // runFullValidation, if needed, does a full validation
      // which in turn updates value option and converted display value

      if (this._hasInvalidMessagesShowing()) {
        runFullValidation = true;
      }

      this._clearComponentMessages();

      if (runFullValidation) {
        // this may return a Promise
        displayValue = this._GetDisplayValue();
        // runs full validation on the display value. May be async
        this._SetValue(displayValue, null, validationOptions);
      }

      if (!runFullValidation && this._IsRequired()) {
        // run deferred validation if we didn't run full validation
        // (e.g., comp is either showing a deferred error or has no errors.)
        // But only when required is true do
        // we update the valid option within _runDeferredValidation
        this._runDeferredValidation(validationOptions.validationContext);
      } else {
        this._setValidOption(this._determineValidFromMessagesOptions(), null);
      }
    },

    /**
     * Formats the modelValue and updates the display value.
     * @param modelValue
     * @param ignoreAfterError boolean defaults to false.
     * If true, do not do anything after format error, like
     * do not show messages, do not change valid state.
     * @return {undefined|string} if formatting threw an error, return undefined.
     * if formatting was successful and no other errors occur, return formatted
     * value.
     * @throw {Error} converter.format error if the converter is synchronous.
     * @protected
     * @memberof oj.editableValue
     * @instance
     */
    _UpdateElementDisplayValue: function (modelValue, ignoreAfterError) {
      var displayValue;
      var parsedReturnValue;

      displayValue = modelValue;

      try {
        // returns the converter formatted value, and if there is no converter, it returns
        // the value as is.
        displayValue = this._formatValue(modelValue);
        // synchronous converter's format succeeded or no converter
        try {
          this._setLastModelValue(modelValue);
          this._afterConverterFormat(displayValue);
        } catch (e) {
          // rethrow error in case _SetDisplayValue() threw an error. See ojcheckboxset,
          // it throws error if it isn't an array or if it is null.
          throw e;
        }
        parsedReturnValue = displayValue;
      } catch (e) {
        if (!ignoreAfterError) {
          this._afterConverterFormatFailure(e);
        }
        this._setLastModelValue(modelValue);
        // displayValue is modelValue if we get here.
        this._afterConverterFormat(displayValue);
        parsedReturnValue = undefined;
      }
      return parsedReturnValue;
    },

    /**
     * This gets called while the converter module is loading asynchronously
     * @protected
     * @memberof oj.editableValue
     * @instance
     */
    _SetLoading: function () {
      var widgetElem = this.widget()[0];
      var focusElem = this.GetFocusElement();
      widgetElem.classList.add('oj-loading');
      this._saveAriaLabel = focusElem.getAttribute('aria-label');
      var loadingText = getTranslatedString('oj-ojEditableValue.loading');
      focusElem.setAttribute('aria-label', loadingText);
    },

    /**
     * This gets called when the converter was loading asynchronously
     * and now it is loaded.
     * @protected
     * @memberof oj.editableValue
     * @instance
     */
    _ClearLoading: function () {
      var widgetElem = this.widget()[0];
      var focusElem = this.GetFocusElement();
      widgetElem.classList.remove('oj-loading');
      if (this._saveAriaLabel) {
        focusElem.setAttribute('aria-label', this._saveAriaLabel);
      } else {
        focusElem.removeAttribute('aria-label');
      }
    },

    /**
     * @ignore
     * @protected
     * @memberof oj.editableValue
     * @return {boolean}
     */
    _UseReadonlyDiv: function () {
      // ThemeUtils caches the result so no need to do it here.
      let defaultOptions = parseJSONFromFontFamily('oj-form-control-option-defaults');
      return defaultOptions.readonlyElem === 'div';
    },

    /**
     * This is called from InlineHelpHintsStrategy to determine if the
     * component should show help hints on focus or always. Set
     * components show it always.
     * @ignore
     * @protected
     * @memberof oj.editableValue
     * @return {'focus'|'always'}
     */
    _ShowHelpHints: function () {
      return this._IsTextFieldComponent() ? 'focus' : 'always';
    },
    /**
     * This is called from InlineHelpHintsStrategy to determine
     * the location of the inline help hints, above the component
     * or below inline.
     * @ignore
     * @protected
     * @memberof oj.editableValue
     * @return {'above'|'inline'}
     */
    _ShowHelpHintsLocation: function () {
      return 'inline';
    },

    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _afterConverterFormat: function (displayValue) {
      var actualDisplayValue;

      this._SetDisplayValue(displayValue);
      // getting the display value right after we set it is probably not necessary,  but just in
      // case a subclass did something to it, we do.
      actualDisplayValue = this._GetDisplayValue();
      this._setLastDisplayValue(actualDisplayValue);
      // update rawValue option to keep it in sync with the display value
      this._SetRawValue(actualDisplayValue, null);
    },

    /**
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _afterConverterFormatFailure: function (e) {
      var newMsgs;

      // Turn this into Array of ComponentMessage instances.
      // This is what we set on 'messagesShown'
      newMsgs = this._processValidationErrors(e);
      this._updateMessagesOption('messagesShown', newMsgs);
      // update valid option to INVALID_SHOWN
      this._setValidOption(_INVALID_SHOWN, null);
    },

    /**
     * When we are asynchronously loading a converter we show a loading indication
     * and make the input (not the component) readonly.
     * @param converterPromise {Promise<Converter>}
     * @return {Promise<Object|null>} a Promise to a converter instance or null
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _loadingConverter: function (converterPromise) {
      var self = this;
      var showLoadingIndicatorDelay = EditableValueUtils._getShowLoadingDelay();
      var converterCounter = this._converterChangedCounter;
      var loadingTimeout = setTimeout(function () {
        // _converterChangedCounter is incremented if we get a change of converter option.
        if (converterCounter === self._converterChangedCounter) {
          self._SetLoading();
        }
      }, showLoadingIndicatorDelay);

      return converterPromise.then(function (ci) {
        self._ClearLoading();
        clearTimeout(loadingTimeout);
        return ci;
      });
    },
    /**
     * @param {Object|undefined} value
     * @param {number} context in which validation was run.
     * @return {Promise<null> | null} a Promise to indicate validation has finished or null if sync
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _validateValueForRequiredOnly: function (value, context) {
      var newMsgs;
      var validator;
      var self = this;

      // run required validation if component is required
      // SYNCHRONOUS OR ASYNCHRONOUS
      if (this._IsRequired()) {
        validator = this._getImplicitRequiredValidator();
        try {
          // check if trimmed value is empty. See AdfUIEditableValue.prototype.ValidateValue
          this._setValidOption(_PENDING, null);
          var validateReturned = validator.validate(oj.StringUtils.trim(value));
          if (validateReturned instanceof Promise) {
            return validateReturned.then(
              function () {},
              function (e) {
                newMsgs = self._processValidationErrors(
                  e,
                  context,
                  Message.ComponentMessage.DISPLAY.HIDDEN
                );
                if (newMsgs) {
                  self._updateMessagesOption('messagesHidden', newMsgs);
                }
              }
            );
          }
        } catch (e) {
          // this is a messagesHidden message
          // turn this into Array of ComponentMessage instances. This is what we set on 'messagesHidden'
          newMsgs = this._processValidationErrors(
            e,
            context,
            Message.ComponentMessage.DISPLAY.HIDDEN
          );
          if (newMsgs) {
            this._updateMessagesOption('messagesHidden', newMsgs);
          }
        }
      }
      return null;
    },

    /**
     * This is called from both _SetValue and when we need to re-validate due to
     * property changes, like converters, required, etc.
     * This validates the value by running through the list of all registered validators and
     * async-validators. The algorithm is as follows -
     * 1. if isRequired, run required validator.
     * 2. get all the rest of the validators and validate in sequence.
     * 3. get async-validators and kick them all off simultaneously, and show errors as we get them.
     * 4. update valid state immediately if it turns for the worse.
     * 5. will ignore validation results if we get a new call to this method with a different value
     *  before we get back the async validate results from a previous value.
     * results.
     *
     * Callers can rely on the 'valid' options property to determine the validity state of the
     * component after calling this method
     *
     * @param {Object|string} value to be validated
     * @param {Event?} event the original event (for user initiated actions that trigger a DOM event,
     * like blur) or undefined. The custom element bridge creates a CustomEvent out of this when
     * it sends the property changed event.
     * @param {number=} context determines when validation is being run. Used when creating Messages
     * @return {Promise|Object|string|undefined}
     * Promise resolves to 'valid' if all validators pass. Resolves to 'invalidShown'
     * if any validator fails. Resolves to 'ignoreValidation' if we are to ignore validation results.
     * If no async validators are on the component, it returns the value we validated if
     * validation passed or undefined if validation failed.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _asyncValidateValue: function (value, event, context) {
      // we get validators from async-validators option. This is not cached, but
      // it is fast to get. TODO cache.
      var normalizedAsyncValidators = this._GetNormalizedAsyncValidatorsFromOption();
      // gets implicit validators and validators from validators option.
      // these can be sync or async validators. This is cached.
      var normalizedValidators = this._GetAllValidatorsFromValidatorsOptionAndImplicit();
      var i;
      var isInvalidShownSet = false;
      var finalValidState;
      var newMsgs;
      var self = this;
      var implicitRequiredValidator;
      var valMsgs = [];

      // this to be used to decide whether or not to ignore async validate resolutions.
      // if we use the value to decide whether or not to ignore async validate resolutions, it
      // would not work if the user types in an invalid value, then another value, then the
      // invalid value again. He would see two identical error messages if the async validators
      // are slow. We talked about using a queue, and decided a counter would work just as well.
      var asyncValidatorValidateCounter = this._asyncValidatorValidateCounter;
      var promiseArray = [];
      // run required validator first, push to promiseArray if it is a Promise
      var isRequired = this._IsRequired();
      if (isRequired) {
        implicitRequiredValidator = this._getImplicitRequiredValidator();
      }
      if (isRequired || normalizedAsyncValidators.length > 0 || normalizedValidators.length > 0) {
        this._setValidOption(_PENDING, event);
      }
      if (implicitRequiredValidator) {
        try {
          var requiredValidatorPromise = implicitRequiredValidator.validate(
            oj.StringUtils.trim(value)
          );
          if (requiredValidatorPromise) {
            promiseArray.push(requiredValidatorPromise);
          }
        } catch (e) {
          // save all validation errors
          this._addValidationError(e, valMsgs);
          this._setValidOption(_INVALID_SHOWN, event);
          isInvalidShownSet = true;
        }
      }

      var result;
      for (i = 0; i < normalizedAsyncValidators.length; i++) {
        try {
          result = normalizedAsyncValidators[i].validate(value);
        } catch (e) {
          // async validators should not throw errors, they should just reject
          // so we should treat this as a reject
          result = Promise.reject(e);
        }
        if (!(result instanceof Promise)) {
          result = Promise.resolve(result);
        }
        promiseArray.push(result);
      }

      // run through all validators on the validators option + implicit ones.
      // could be sync or async
      for (i = 0; i < normalizedValidators.length; i++) {
        try {
          result = normalizedValidators[i].validate(value);
          if (result instanceof Promise) {
            promiseArray.push(result);
          }
        } catch (e) {
          // save all validation errors
          this._addValidationError(e, valMsgs);
          this._setValidOption(_INVALID_SHOWN, event);
          isInvalidShownSet = true;
        }
      }

      // show sync validator messages, if any
      if (valMsgs.length > 0) {
        let ve = new Error();
        ve._messages = valMsgs;
        newMsgs = this._processValidationErrors(ve, context);
        // turn this into Array of ComponentMessage instances.
        // This is what we set on 'messagesShown'
        this._updateMessagesOption('messagesShown', newMsgs, event);
      }

      // when a promise resolves or errors out, we return an Object with the value or error state,
      // and the status.
      // We want to show error messages right away, as we get them.
      // We also want to ignore any error messages or valid state changes if we get
      // a new value to validate while the current async validate methods haven't returned yet.
      // This could happen if we kick off a slow validator and the user types into the field
      // and blurs to cause a new _SetValue->validation before this one returns.
      function reflect(promise) {
        return promise.then(
          function (v) {
            var status;

            // Ignore validate Promise results if it is for a value that isn't the most current value
            // we are validating. The only con is if they are in the process of typing in the field,
            // errors might show up for value when they last pressed Enter|Blur.
            // We decided this is fine, and we will show the value in the error message in our demos
            // so the user won't get confused, and we'll doc that this is what the app dev should do.
            if (self._asyncValidatorValidateCounter === asyncValidatorValidateCounter) {
              status = 'resolved';
            } else {
              status = 'ignore';
            }
            return { v: v, status: status };
          },
          function (e) {
            var status;
            if (self._asyncValidatorValidateCounter === asyncValidatorValidateCounter) {
              // turn this into Array of ComponentMessage instances.
              // This is what we set on 'messagesShown'
              newMsgs = self._processValidationErrors(e, context);
              self._updateMessagesOption('messagesShown', newMsgs, event);
              if (!isInvalidShownSet) {
                self._setValidOption(_INVALID_SHOWN, event);
                isInvalidShownSet = true;
              }
              status = 'rejected';
            } else {
              status = 'ignore';
            }
            return { e: e, status: status };
          }
        );
      }

      if (promiseArray.length > 0) {
        return new Promise(function (resolve) {
          // Promise.all will end as soon as it gets its first rejection. We don't want that.
          // We want to wait until all promises either resolve or reject. Then we can resolve this
          // outer promise. We do this using the reflect function defined above.
          Promise.all(promiseArray.map(reflect)).then(function (results) {
            var ignoreList = results.filter(function (x) {
              return x.status === 'ignore';
            });
            if (ignoreList.length > 0) {
              finalValidState = 'ignoreValidation';
            } else {
              finalValidState = !isInvalidShownSet ? _VALID : _INVALID_SHOWN;
              // we could be showing messages, like 'messagesCustom'. If so, valid is invalidShown,
              // even if all validators passed.
              self._setValidOption(self._determineValidFromMessagesOptions(), event);
            }
            resolve(finalValidState);
          });
        });
      }

      // only sync validators were found
      if (valMsgs.length === 0) {
        // we could be showing messages, like 'messagesCustom'. If so, valid is invalidShown,
        // even if all validators passed.
        this._setValidOption(self._determineValidFromMessagesOptions(), event);
      }
      // if no error messages returned from validating the value, return newValue
      return valMsgs.length === 0 ? value : undefined;
    },

    /**
     * This is called when we have a labelledBy attribute during component initialization
     * or the attribute updates.
     *
     * @param {string} labelledBy The labelledBy attribute value. Can be a space delimited value.
     * @private
     * @memberof oj.editableValue
     * @instance
     */
    _labelledByUpdated: function (labelledBy) {
      var ojlabels = EditableValueUtils._getCustomOjLabelElements(labelledBy);
      if (ojlabels) {
        for (let i = 0; i < ojlabels.length; i++) {
          var ojlabel = ojlabels[i];
          ojlabel.classList.add(this._GetDefaultStyleClass() + '-label');
          if (
            this.widget().attr('data-oj-internal') === undefined &&
            this.options.readOnly !== undefined
          ) {
            this._addRemoveOjReadOnlyClassOnLabel(ojlabel, this.options.readOnly);
          }
        }
      }
    },

    /**
     * propogate described-by to aria-describedby
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _describedByUpdated: LabelledByUtils._describedByUpdated,
    /**
     * Set busy state for async validators
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _setBusyState: EditableValueUtils._SetBusyState,
    /**
     * Clear  busy state for async validators
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _clearBusyState: EditableValueUtils._ClearBusyState,
    /**
     * Set busy state for async validators hint
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _setBusyStateAsyncValidatorHint: EditableValueUtils._SetBusyStateAsyncValidatorHint,
    /**
     * Clear  busy state for async validators hint
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _clearBusyStateAsyncValidatorHint: EditableValueUtils._ClearBusyStateAsyncValidatorHint,
    /**
     * Set busy state for async converter loading
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _setBusyStateAsyncConverterLoading: EditableValueUtils._SetBusyStateAsyncConverterLoading,
    /**
     * Clear  busy state for async converter loading
     *
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _clearBusyStateAsyncConverterLoading: EditableValueUtils._ClearBusyStateAsyncConverterLoading,
    /**
     * If we have asynchronous converter loading, the input is readonly and a loading indicator
     * is shown to the user.
     * When the converter is 100% loaded, then the field is set back to how it was.
     * That is when we do the tasks that either need a converter or need the field to be enabled,
     * like showing messagesCustom. Those tasks are done in this method.
     *
     * @memberof oj.editableValue
     * @instance
     * @protected
     */
    _AfterCreateConverterCached: EditableValueUtils._AfterCreateConverterCached,

    /**
     * Returns the readonly div HTMLElement.
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _getReadonlyDiv: EditableValueUtils._getReadonlyDiv,

    /**
     * Creates or updates the readonly div. This is called when the
     * component is initially enabled and becomes readonly.
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _createOrUpdateReadonlyDiv: EditableValueUtils._createOrUpdateReadonlyDiv,

    /**
     * Creates the readonly div. This is called when the
     * component is initially enabled and becomes readonly.
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _createReadonlyDiv: EditableValueUtils._createReadonlyDiv,

    /**
     * @memberof oj.editableValue
     * @instance
     * @private
     */
    _setReadonlyDivLabelledBy: EditableValueUtils._setReadonlyDivLabelledBy,

    /**
     * Returns the associated input container needed for component managed labels.  Subclasses can
     * override if the container is not marked with the '.oj-text-field-container' or
     * '.oj-form-control-container' selector. The
     * input elements are children of the container and a sibling to the inline messages container.
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @return {Element|undefined}
     */
    _GetFormControlContainer: function () {
      if (this._IsCustomElement()) {
        var selector =
          '.' + [this._GetComponentManagedBaseLabelStyleClass(), 'container'].join('-');
        return this._getRootElement().querySelector(selector);
      }
      return undefined;
    },

    /**
     * Returns if the element is a text field element or not.
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @return {string}
     */
    _IsTextFieldComponent: function () {
      return false;
    },

    /**
     * Returns the base selector name used to define the input container.
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @return {string}
     */
    _GetComponentManagedBaseLabelStyleClass: function () {
      if (this._IsTextFieldComponent()) {
        return 'oj-text-field';
      }
      return 'oj-form-control';
    },

    /**
     * For components like input number/ input date etc, where we have some icon or button beside the input text:
     * Previously, we set flex =1 on the input and the input's width will autogrow based on buttons width.
     * But in case of an inside label, the label also should grow and shrink exactly as the input
     * We can make this to work only by wrapping the input (and label in case of inside) in to a div and
     * set the flex for the div to 1.
     * Now the button or icon becomes a sibling of this div and not the input.
     *
     * @protected
     * @instance
     * @ignore
     * @return {Element}
     */
    _CreateMiddleWrapper: function () {
      // For the inside label to be assigned with the same width as input,
      // We need to put the label and the input together in a div and set flex=1 for the div.
      // This way, they both will occupy the same space as avialble after the buttons.
      var innerDivElem = document.createElement('div');
      innerDivElem.className = 'oj-text-field-middle';
      return innerDivElem;
    },

    /**
     * Resolves the labelEdge strategy type from the labelEdge property.
     * Called from the ComponentMessaging
     * class which picks which label strategy to use. For example,
     * oj-radioset with label-edge='inside' uses the InsideFormControlLabelStrategy
     * which has type 'insideformcontrol'.
     * whereas the oj-input-text with label-edige='inside' uses the InsideLabelStrategy
     * which has type 'inside'.
     * @memberof oj.editableValue
     * @instance
     * @protected
     * @return {string}
     */
    _ResolveLabelEdgeStrategyType: function () {
      var labelEdge = this.options.labelEdge;
      if (this._IsCustomElement()) {
        if (labelEdge === 'inside') {
          // Resolve the 'inside' labelEdge to 'insideformcontrol' for
          // non-text fields.
          // An 'insideformcontrol' label renders on top of the component with
          // the smaller font that matches a text-field's 'inside' label.
          if (!this._IsTextFieldComponent()) {
            labelEdge = oj.ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE_FORM_CNTRL;
          }
        }
      }
      return labelEdge;
    }
  },
  true
);

setDefaultOptions({
  // properties for all editableValue components
  editableValue: {
    displayOptions: createDynamicPropertyGetter(function (context) {
      // displayOptions defaults are theme dependent
      // See also _setOption when displayOptions is changed. Need to handle
      // defaulting there as well.
      let useUserAssistanceDensity =
        (parseJSONFromFontFamily('oj-form-control-option-defaults') || {})
          .useUserAssistanceOptionDefault === 'use';
      var displayOptions;
      if (useUserAssistanceDensity) {
        displayOptions = {
          messages: _sDisplayOptionsRedwoodDefaults.MESSAGES,
          converterHint: _sDisplayOptionsRedwoodDefaults.CONVERTER_HINT,
          validatorHint: _sDisplayOptionsRedwoodDefaults.VALIDATOR_HINT
        };
      } else {
        displayOptions = {
          messages:
            context.containers.indexOf('ojDataGrid') >= 0 ||
            context.containers.indexOf('ojTable') >= 0
              ? ['notewindow']
              : _sDisplayOptionsAltaDefaults.MESSAGES,
          converterHint: _sDisplayOptionsAltaDefaults.CONVERTER_HINT,
          validatorHint: _sDisplayOptionsAltaDefaults.VALIDATOR_HINT
        };
      }
      displayOptions[context.isCustomElement ? 'helpInstruction' : 'title'] = ['notewindow'];
      return displayOptions;
    }),
    help: createDynamicPropertyGetter(function (context) {
      // Conditionally set the defaults for custom element vs widget syntax since we expose different APIs
      if (context.isCustomElement) {
        return { instruction: '' };
      }
      return { definition: null, source: null };
    }),
    labelEdge: createDynamicPropertyGetter(function (context) {
      // update the labelEdge value to theme based.
      if (context.isCustomElement) {
        return (parseJSONFromFontFamily('oj-form-control-option-defaults') || {}).labelEdge;
      }
      return undefined;
    }),
    userAssistanceDensity: createDynamicPropertyGetter(function (context) {
      var userAssistanceDensityVar =
        context.containers.indexOf('ojDataGrid') >= 0 || context.containers.indexOf('ojTable') >= 0
          ? 'compact'
          : 'reflow';
      return userAssistanceDensityVar;
    })
  }
});

// ////////////////     SUB-IDS     //////////////////
/**
 * <p>Sub-ID for the help icon element used by EditableValue components.</p>
 *
 * @ojsubid oj-label-help-icon
 * @memberof oj.editableValue
 * @ignore
 *
 * @example <caption>Get the help icon element associated with an editable value component:</caption>
 * var node = myComp.getNodeBySubId("oj-label-help-icon");
 */

// ////////////// fragments /////////////////
/**
 * <p>
 * <h3 id="validation-section">
 * Validation and Messaging
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#validation-section"></a>
 * </h3>
 * An editable component runs validation (normal or deferred) based on the action performed on it
 * (either by end-user or page author), and the state it was in when the action occurred. Examples
 * of actions are - creating a component, user changing the value of the component by interacting
 * with it, the app setting a value programmatically, the app calling the validate() method etc. At
 * the time the action occurs, the component could already be showing errors, or can have a deferred
 * error or have no errors.
 * <p>
 * These factors also determine whether validation errors/messages get shown to the user immediately
 * or get deferred. The following sections highlight the kinds of validation that are run and how
 * messages get handled.
 * </p>
 * <h4 id="normal-validation-section">Normal Validation
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#normal-validation-section"></a></h4>
 * Normal validation is run in the following cases on the display value, using the converter and
 * validators (this includes async-validators) set on the component,
 * and validation errors are reported to user immediately.
 * <ul>
 * <li>When value changes as a result of user interaction all messages are cleared, including custom
 * messages added by the app, and full validation is run on the UI value. The steps performed are
 * outlined below.
 * <ol>
 * <li>All messages are cleared and <code class="prettyprint">messagesCustom</code> property is cleared</li>
 * <li>If no converter is present then processing continues to next step. If a converter is
 * present, the UI value is first converted (i.e., parsed). If there is a parse error then
 * the messages are shown and processing returns.</li>
 * <li>If there are no validators setup for the component then the value is set on the component.
 * Otherwise all validators are run in sequence using the parsed value from the previous step. The
 * implicit required is run first if the component is marked required. When a validation error is
 * encountered it is remembered and the next validator in the sequence is run.
 * <ul><li>NOTE: The value is trimmed before required validation is run</li></ul>
 * </li>
 * <li>At the end of the validation run if there are errors, the messages are shown
 * and processing returns. If there are async-validators, those errors are shown as soon as they
 * come in, and not until all validators, sync and async validators, are complete, does processing
 * return, that is, value and valid are updated. If there are no errors, then the
 * <code class="prettyprint">value</code> property is updated and the formatted value displayed on the
 * UI.</li>
 * </ol>
 * </li>
 * <li>When the <code class="prettyprint">validate</code> method is called by app, all messages are
 * cleared and full validation run using the display value. See <code class="prettyprint">validate</code>
 * method on the sub-classes for details. Note: JET validation is designed to catch user input errors, and not invalid
 * data passed from the server; this should be caught on the server.</li>
 * <li>When certain properties change through programmatic intervention by app, the component
 * determines whether it needs to run normal validation based on the state the component is in.
 * Refer to the <a href="#mixed-validation-section">Mixed Validation</a> section below for details. </li>
 * </ul>
 *
 * <h4 id="deferred-validation-section">Deferred Validation
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-validation-section"></a>
 * </h4>
 * Deferred validation is run in the following cases on the component value using the implicit
 * required validator if required is true, and validation errors are deferred, i.e., not shown to user immediately.
 * Refer to the <a href="#deferred-messages-section">Showing Deferred Messages</a> section to
 * understand how deferred messages can be shown.
 * <ul>
 *  <li>When a component is created and it is required deferred validation is run and no messages are cleared
 *  prior to running validation.
 *  Refer to the <a href="#deferred-validators-section">Validators
 *  Participating in Deferred Validation</a> section for details.</li>
 *  <li>When the <code class="prettyprint">value</code> property changes due to programmatic
 *  intervention deferred validation is run, after all messages and messagesCustom property are cleared.</li>
 *  <li>When the <code class="prettyprint">reset</code> method is called, deferred validation is run
 *   after all messages and messagesCustom property are cleared.</li>
 *  <li>When certain properties change through programmatic intervention by app, the component
 *  determines whether it needs to run deferred validation based on the state the component is in.
 *  Refer to the <a href="#mixed-validation-section">Mixed Validation</a> section below for details.</li>
 * </ul>
 *
 * <h4 id="mixed-validation-section">Mixed Validation
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#mixed-validation-section"></a>
 * </h4>
 * Either deferred or normal validation is run in the following cases based on the state the
 * component is in and any validation errors encountered are either hidden or shown to user.
 * <ul>
 *  <li>when disabled property changes. See <a href="#disabled">disabled</a> property for details.</li>
 *  <li>when refresh method is called. See <a href="#refresh">refresh</a> method for details.</li>
 *  <li>when converter property changes. Not all EditableValue components have the converter property. See
 *  the sub-classes that have the converter property for details, e.g., {@link oj.ojInputText#converter}.</li>
 *  <li>when required property changes. Not all EditableValue components have the required property. See
 *  the sub-classes that have the required property for details, e.g., {@link oj.inputBase#required}.</li>
 *  <li>when validators property changes. Not all EditableValue components have the validators property. See
 *  the sub-classes that have the validators property for details, e.g., {@link oj.inputBase#validators}.</li>
 *  <li>when asyncValidators property changes. Not all EditableValue components have the asyncValidators property. See
 *  the sub-classes that have the asyncValidators property for details, e.g., {@link oj.inputBase#asyncValidators}.</li>
 *
 * </ul>
 * </p>
 *
 * <p>
 * <h3 id="deferred-messages-section">
 * Showing Deferred Messages
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-messages-section"></a>
 * </h3>
 * Deferred validation messages are displayed only when page author requests for it explicitly in
 * one of the following ways:
 * <ul>
 * <li>calls the <a href="#showMessages"><code class="prettyprint">showMessages</code></a> method on the component</li>
 * </ul>
 * </p>
 *
 * <p>
 * <h3 id="deferred-validators-section">
 * Validators Participating in Deferred Validation
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-validators-section"></a>
 * </h3>
 * The required validator is the only validator type that participates in deferred validation.
 * The required property needs to be set to true for the required validator to run.
 * </p>
 * <p>
 * <h3 id="user-assistance-text-section">
 * User Assistance Text
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#user-assistance-text-section"></a>
 * </h3>
 * <p>
 * User assistive text provides guidance to help the user understand what data to enter or select.
 * </p>
 * <p>In the Redwood theme, by default all user assistance text shows inline.
 * For input components, it shows when the field takes focus. In other components
 * it shows all the time. See the user-assistance-density property for other ways
 * the user assistance text can render, like in 'compact' mode, it will render as an icon on the label
 * which when clicked will show the user assistance text in a notewindow.
 * <p>
 * <p>The JET form component properties that are used for user assistance text are help.instruction,
 * validator and converter hints, and help-hints.
 * In the Redwood theme for clarity only one user assistance text shows to the user.
 * The precedence rules are:
 * <ul>
 * <li>help.instruction shows;</li>
 * <li>if no help.instruction, then validator hint shows;</li>
 * <li>if no help.instruction or validator hint, then help-hints.definition shows;</li>
 * <li>if no help.instruction, validator hint, or help-hints.definition, then converter hint shows.</li>
 * <li>help-hints.source always shows along side the above.</li>
 * </ul>
 * </p>
 * <p>In the Alta theme all the user assistance text are displayed to the user. By default
 * help.instruction and the validator/converter hints show in a notewindow that is displayed
 * when the field takes focus. The help-hints render as a help icon on the label and when clicked
 * show in a notewindow. Note: If there is no label, help-hints help icon will not show.
 * </p>
 * <p>Sometimes a validator or converter hints shows that you do not want. To not show it,
 *  set the display-options.validator-hint and/or display-options.converter-hint property to 'none'.
 * </p>
 * <p>required and placeholder properties also can be used to guide the user.
 * In Redwood, a required field shows the word Required under the field
 * when the field is empty and does not have focus.
 * Placeholder is shown when the field is empty and has focus.
 * </p>
 * @ojfragment validationAndMessagingDoc - Used in the general section of classdesc
 * @memberof oj.editableValue
 */
/**
 * <p>
 * For accessibility, set label-hint or associate an oj-label with the form component.
 * If there is no visible label, then to make this accessible to screen reader users,
 * set the label-hint and label-edge='none'
 * which renders an aria-label with the label-hint text.
 * If using an oj-label instead of the <code class="prettyprint">label-hint</code> attribute, then
 * put an <code>id</code> on the form component element, and set the oj-label's
 * <code>for</code> attribute to be the form component's id.
 * </p>
 *
 * @ojfragment accessibilityLabelEditableValue
 * @memberof oj.editableValue
 * @instance
 */
/**
 * <p>
 * For accessibility, set label-hint or associate an oj-label with the form component.
 * If there is no visible label, then to make this accessible to screen reader users,
 * set the label-hint and label-edge='none' which renders an aria-label with the label-hint text.
 * If using an oj-label instead of the <code class="prettyprint">label-hint</code> attribute,
 * then put an <code>id</code> on the oj-label component element, and set the form component's
 * <code>labelled-by</code> attribute to be the oj-label component's id.
 * </p>
 *
 * @ojfragment accessibilitySetLabelEditableValue
 * @memberof oj.editableValue
 * @instance
 */
/**
 * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
 * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
 * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
 * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
 * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
 * required of enabled content, it cannot be used to convey meaningful information.<p>
 *
 * @ojfragment accessibilityDisabledEditableValue
 * @memberof oj.editableValue
 * @instance
 */
/**
 * <p>The placeholder text is not read reliably by the screen reader. For accessibility reasons, you need to associate the text to its
 * JET form component using aria-describedby.
 * <p>
 *
 * @ojfragment accessibilityPlaceholderEditableValue
 * @memberof oj.editableValue
 * @instance
 */

/**
 * A messaging strategy that uses an instance of ojPopup component to show and hide messaging content.
 *
 * @param {Array.<string>} displayOptions an array of messaging artifacts displayed in the popup. e.g,
 * 'messages', 'converterHints', 'validationHints', 'title'.
 * @constructor
 * @extends {oj.MessagingStrategy}
 * @private
 */
const PopupMessagingStrategy = function (displayOptions) {
  this.Init(displayOptions);
};

// Classes defined here to avoid ESLint no-use-before-define requirement
/**
 * @ignore
 */
const PopupMessagingStrategyPoolUtils = {};

/**
 * @ignore
 */
const PopupMessagingStrategyUtils = {};

/**
 * Registers the PopupMessagingStrategy constructor function with ComponentMessaging.
 *
 * @private
 */
oj.ComponentMessaging.registerMessagingStrategy(
  oj.ComponentMessaging._STRATEGY_TYPE.NOTEWINDOW,
  PopupMessagingStrategy
);

// Subclass from MessagingStrategy
oj.Object.createSubclass(PopupMessagingStrategy, oj.MessagingStrategy, 'oj.PopupMessagingStrategy');

/**
 * Messaging popup defaults for components, by component type. A special 'default' type defines the
 * defaults for most editableValue components.
 * The following properties are available -
 * 'events' - these specify the on handlers for events that are setup to open and close popups
 * 'position' - specifies the type of element the popup is positioned against.
 * @private
 */
PopupMessagingStrategy._DEFAULTS_BY_COMPONENT = {
  // mouseenter and mouseleave is what you want instead of mouseover/mouseout when the launcher
  // isn't a simple input. In the case of radioset and checkboxset, the launcher is the widget
  // which is the div that contains all the rows, inputs and labels. If we use mouseover/mouseout
  // in this case we are constantly opening and closing the popup (not really visible to the user,
  // but still not good for performance I'm sure) if the user moves the mouse around the different
  // dom elements within the widget.
  //
  // on touch devices: the "press" event name maps to Hammer's press event, so a touch and hold
  // will open the popup.
  ojRadioset: {
    position: 'launcher',
    // when press opens popup, the user taps elsewhere to dismiss popup
    events: { open: 'focusin mouseenter press', close: 'mouseleave' }
  },
  ojCheckboxset: {
    position: 'launcher',
    // when press opens popup, the user taps elsewhere to dismiss popup
    events: { open: 'focusin mouseenter press', close: 'mouseleave' }
  },
  // Since we now add extra dom on the input components for inline messages, we don't want to
  // position on the tip of the component root. Instead we want to position on the main part of the
  // component, which is in a lot of cases the launcher. In the case of inputDate/Time/Number,
  // it's the launcher's parent (inputDate/Time/Number wrap input and buttons with a parent).
  ojInputText: {
    position: 'launcher',
    events: { open: 'focusin' }
  },
  ojTextArea: {
    position: 'launcher',
    events: { open: 'focusin' }
  },
  ojInputPassword: {
    position: 'launcher',
    events: { open: 'focusin' }
  },
  ojSwitch: {
    position: 'launcher',
    events: { open: 'focusin mouseenter', close: 'mouseleave' }
  },
  ojSlider: {
    position: 'launcher',
    events: { open: 'focusin mouseenter', close: 'mouseleave' }
  },
  ojColorSpectrum: {
    position: 'launcher',
    events: { open: 'focusin mouseenter', close: 'mouseleave' }
  },
  ojColorPalette: {
    position: 'launcher',
    events: { open: 'focusin mouseenter', close: 'mouseleave' }
  },
  default: {
    position: 'launcher-wrapper',
    events: { open: 'focusin' }
  }
};

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT = 'oj-form-control-hint';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_CONVERTER = 'oj-form-control-hint-converter';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_VALIDATOR = 'oj-form-control-hint-validator';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_TITLE = 'oj-form-control-hint-title';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategy._OPEN_NAMESPACE = '.ojPopupMessagingOpen';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategy._CLOSE_NAMESPACE = '.ojPopupMessagingClose';

/**
 * Sets up a tooltip for the component instance using the messaging content provided.
 *
 * @param {Object} cm a reference to an instance of ComponentMessaging that provides access to
 * the latest messaging content.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @override
 * @instance
 */
PopupMessagingStrategy.prototype.activate = function (cm) {
  PopupMessagingStrategy.superclass.activate.call(this, cm);
  this._initMessagingPopup();
};

/**
 * Reinitializes with the new display options and updates component messaging using the new content.
 *
 * @param {Array.<string>} newDisplayOptions
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 * @override
 */
PopupMessagingStrategy.prototype.reactivate = function (newDisplayOptions) {
  PopupMessagingStrategy.superclass.reactivate.call(this, newDisplayOptions);
  this._updatePopupIfOpenOrComponentHasFocus();
};

PopupMessagingStrategy.prototype.update = function () {
  PopupMessagingStrategy.superclass.update.call(this);
  this._updatePopupIfOpenOrComponentHasFocus();
};

/**
 * Cleans up messages on the component and destroys any widgets it created.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 * @override
 */
PopupMessagingStrategy.prototype.deactivate = function () {
  this._unregisterLauncherEvents();
  this._destroyTooltip();
  PopupMessagingStrategy.superclass.deactivate.call(this);
};
/**
 * Close the popup if it is open. EditableValue calls this from _NotifyHidden and _NotifyDetached
 * so that we don't have an open popup if the app dev hides a subtree the component is within.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype.close = function () {
  this._closePopup();
};

/**
 * Closes the associated notewindow popup
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._closePopup = function () {
  function doClose(resolve) {
    if (this._isPopupInitialized()) {
      if (resolve) {
        // Add an event listener to resolve the promise
        this._setActionResolver(this.$messagingContentRoot, 'close', resolve);
      }

      this.$messagingContentRoot.ojPopup('close');

      // Just return if we call ojPopup close.  The promise will be resolved
      // by the ojclose event listener.
      return;
    }

    if (resolve) {
      // Resolve the promise immediately if we didn't call ojPopup close
      resolve(true);
    }
  }

  this._queueAction(doClose.bind(this));
};

/**
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._initMessagingPopup = function () {
  if (!this._openPopupCallback) {
    this._registerLauncherEvents();
  }
};

/**
 * Add listeners for animation events.
 * We use this to delegate animation events to the editableValue component since
 * the original events are triggered on the popup, which is created internally
 * and the application cannot bind listeners to it.  By delegating the events,
 * application can bind the listeners to the component.
 *
 * @param {jQuery} messagingContentRoot - The jQuery object for the messaging root node
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._addAnimateEventListeners = function (messagingContentRoot) {
  var delegateEvent = function (newEventType, event, ui) {
    var component = this.GetComponent();
    if (component && component._trigger) {
      // always stop propagation if we have a component to delegate to
      event.stopPropagation();

      // prevent default only if the component handler says so, as indicated by
      // a return value of false.
      if (!component._trigger(newEventType, null, ui)) {
        event.preventDefault();
      }
    }
  };

  // Add animation event listeners to delegate the events to the component
  messagingContentRoot.on('ojanimatestart.notewindow', delegateEvent.bind(this, 'animateStart'));
  messagingContentRoot.on('ojanimateend.notewindow', delegateEvent.bind(this, 'animateEnd'));
};

/**
 * Remove listeners for animation events.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._removeAnimateEventListeners = function (messagingContentRoot) {
  messagingContentRoot.off('ojanimatestart.notewindow');
  messagingContentRoot.off('ojanimateend.notewindow');
};

/**
 * Set busy state on the component that invokes the notewindow.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._setBusyState = function (eventType) {
  var component = this.GetComponent();
  var jElem = component ? component.element : null;
  var domElem = jElem ? jElem[0] : null;
  var busyContext = Context.getContext(domElem).getBusyContext();
  var description = 'The page is waiting for note window ';

  if (domElem && domElem.id) {
    description += 'for "' + domElem.id + '" ';
  }
  description += 'to ' + eventType;

  return busyContext.addBusyState({ description: description });
};

/**
 * Set an event listener to resolve promise when popup open/close action ends.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._setActionResolver = function (
  messagingContentRoot,
  eventType,
  resolvePromise
) {
  var animationOption;

  // Disable animation if there are other queued actions.  Otherwise we will end
  // up with too many animation since the messaging framework keeps clearing and
  // updating the message display during validation, etc.
  if (this._actionCount > 1) {
    // Remember the original animation so that we can restore it later
    animationOption = messagingContentRoot.ojPopup('option', 'animation');
    messagingContentRoot.ojPopup('option', 'animation', null);
  }

  // Add a busy state for the component.  Even though ojpopup add busy state,
  // it is in the scope of the popup element.
  var resolveBusyState = this._setBusyState(eventType);

  // Add an one-time listener to resolve the promise
  messagingContentRoot.one('oj' + eventType, function () {
    // Restore any saved animation option
    if (animationOption) {
      messagingContentRoot.ojPopup('option', 'animation', animationOption);
    }

    resolveBusyState();
    resolvePromise(true);
  });
};

/**
 * Queue up popup open and close actions so that they are executed in the
 * correct order.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._queueAction = function (task) {
  if (this.GetComponent()._IsCustomElement()) {
    // Queue up the action for custom elements to avoid animation overlapping each other
    var self = this;

    var createActionPromise = function (_task) {
      var promise = new Promise(_task);
      promise.then(function () {
        self._actionCount -= 1;
      });
      return promise;
    };

    if (!this._actionCount) {
      // If there is no action in progress, create a new promise directly instead
      // of chaining to any resolved promise to avoid an extra wait state.
      this._actionCount = 1;
      this._actionPromise = createActionPromise(task);
    } else {
      this._actionCount += 1;
      this._actionPromise = this._actionPromise.then(function () {
        return createActionPromise(task);
      });
    }
  } else {
    // Invoke the action immediately for legacy components since there is no animation
    task(null);
  }
};

/**
 * Opens a popup. This handler is called in the context of the launcher usually the this.element or
 * some relevant node the messaging popup is associated to.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._openPopup = function (event) {
  function doOpen(resolve) {
    var domNode;
    var latestContent;
    var $launcher;

    if (this._canOpenPopup()) {
      latestContent = this._buildPopupHtml();
      if (!oj.StringUtils.isEmptyOrUndefined(latestContent)) {
        var messagingContentRoot = this._getPopupElement();
        var isPopupOpen = messagingContentRoot.ojPopup('isOpen');

        // replace popup messaging content with new content
        domNode = PopupMessagingStrategyPoolUtils.getPopupContentNode(messagingContentRoot);

        // latestContent is includes content that may come from app. It is scrubbed for illegal tags
        // before setting to innerHTML
        domNode.innerHTML = ''; // @HTMLUpdateOK
        domNode.innerHTML = latestContent; // @HTMLUpdateOK

        if (!isPopupOpen) {
          $launcher = this.GetLauncher();
          const $position = $(this.GetComponent()._GetMessagingPositionElement());
          if (event && event.type === 'press') {
            this._openPopupOnPressEvent($launcher);
          }

          if (resolve) {
            // Add an event listener to resolve the promise
            this._setActionResolver(messagingContentRoot, 'open', resolve);
          }

          messagingContentRoot.ojPopup('open', $launcher, { of: $position });

          // Just return if we call ojPopup open.  The promise will be resolved
          // by the ojopen event listener.
          return;
        } else if (isPopupOpen) {
          messagingContentRoot.ojPopup('refresh');
        }
      }
    }

    if (resolve) {
      // Resolve the promise immediately if we didn't call ojPopup open
      resolve(true);
    }
  }

  this._queueAction(doOpen.bind(this));
};

/**
 * This is called to open the popup on the 'press' event. E.g., ojCheckboxset and ojRadioset
 * use press to open the popup.
 * @param {Object|null} jqLauncher
 */
PopupMessagingStrategy.prototype._openPopupOnPressEvent = function (jqLauncher) {
  this._inPressEvent = true;

  // We add these event listeners when we open the popup as a result of the 'press' event
  // and we are going to remove them when we close the popup, as well as when we unregister
  // launcher events to make doubly sure they aren't lying around.
  // / Use capture phase to make sure we cancel it before any regular bubble listeners hear it.
  jqLauncher[0].addEventListener('click', this._eatChangeAndClickOnPress, true);
  // need to eat 'change' as well. Otherwise the dialog will close on press up, and the input
  // stays unchecked.
  // This is because when the input  gets the 'change' event, it calls validate,
  // which then updates messages, and if there is no message,
  // then calls _updatePopupIfOpen, contentToShow = "", then it closes the popup.
  jqLauncher[0].addEventListener('change', this._eatChangeAndClickOnPress, true);

  // touchend/mousedown/change/click happen in fast succession on tap or press.
  // Android never fires a click event on press up, so after 50ms we clear the inPressEvent flag
  // since the _eatChangeAndClickOnPress callback never gets called for Android.
  jqLauncher.one('touchend', function () {
    // 50ms.  Make as small as possible to prevent unwanted side effects.
    setTimeout(function () {
      this._inPressEvent = false;
    }, 50);
  });
};

/**
 * The pressHold gesture fires a click and change event on ios after touchend.  Prevent that here.
 * @private
 */
PopupMessagingStrategy.prototype._eatChangeAndClickOnPress = function (event) {
  // on ios:
  // if I tap quickly on an input, I get on div: touchstart/touchend/mousedown/change/click
  // if I tap and hold on an input, I get: touchstart
  // when I let up, I get: touchend/mousedown/change/click
  // on android:
  // if I tap quickly on an input, I get touchstart touchend mousedown click change
  // if I tap and hold on an input, I get touchstart/mousedown
  // when I let up, I get touchend. (no change or click like I do for ios)

  // After 'press' release of a radio or checkbox if we do not eat the the click and change events,
  // the dialog closes.
  if (this._inPressEvent) {
    // For Mobile Safari capture phase at least,
    // returning false doesn't work; must use pD() and sP() explicitly.
    event.preventDefault();
    event.stopPropagation();
    // the event order is first change, then click.
    // so when we get the click, clear the inPressEvent flag.
    if (event.type === 'click') {
      this._inPressEvent = false;
    }
  }
};

/**
 * Determines whether the messaging popup can be opened.
 * @return {boolean}
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._canOpenPopup = function () {
  var options = this.GetComponent().options;
  var isDisabled = options.disabled || false;
  var isReadOnly = options.readOnly || false;

  return !(isDisabled || isReadOnly);
};

/**
 * If the popup is already open or if component has focus,
 * its contents need to updated when update() or reactivate() is called.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._updatePopupIfOpenOrComponentHasFocus = function () {
  var contentToShow;
  var domNode;
  var isLauncherActiveElement;
  var isPopupOpen = false;
  var launcher;
  var messagingContentRoot;

  launcher = this.GetLauncher();
  if (launcher == null) {
    return;
  }
  // See if launcher contains activeElement
  isLauncherActiveElement = this.GetLauncher()[0].contains(document.activeElement);
  if (this._isPopupInitialized()) {
    messagingContentRoot = this._getPopupElement();
    isPopupOpen = messagingContentRoot.ojPopup('isOpen');
    if (isPopupOpen) {
      contentToShow = this._buildPopupHtml();
      if (contentToShow) {
        // push new content into popup
        domNode = PopupMessagingStrategyPoolUtils.getPopupContentNode(messagingContentRoot);

        // contentToShow is includes content that may come from app. It is scrubbed for illegal tags
        // before setting to innerHTML
        domNode.innerHTML = ''; // @HTMLUpdateOK
        domNode.innerHTML = contentToShow; // @HTMLUpdateOK
        messagingContentRoot.ojPopup('refresh');
      } else {
        // if there is no content to show and popup is currently open, close it.
        messagingContentRoot.ojPopup('close');
      }
    }
  } else if (isLauncherActiveElement) {
    contentToShow = this._buildPopupHtml();
    if (contentToShow) {
      // if popup is closed but focus is on activeElement re-open it
      this._openPopup(undefined);
    }
  }
};

/**
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._unregisterLauncherEvents = function () {
  var jqLauncher = this.GetLauncher();

  // Remove event handlers setup on launcher
  jqLauncher.off(PopupMessagingStrategy._OPEN_NAMESPACE);
  jqLauncher.off(PopupMessagingStrategy._CLOSE_NAMESPACE);
  jqLauncher[0].removeEventListener('click', this._eatChangeAndClickOnPress, true);
  jqLauncher[0].removeEventListener('change', this._eatChangeAndClickOnPress, true);

  if (isTouchSupported()) {
    this.releaseResources();
    jqLauncher.off('contextmenu', this._eatContextMenuOnOpenPopupListener);
    this._eatContextMenuOnOpenPopupListener = null;
    this._inPressEvent = null;
  }
  this._openPopupCallback = null;
  this._closePopupCallback = null;
};

/**
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._registerLauncherEvents = function () {
  var closeEvents;
  var closePopupCallback;
  var jqLauncher = this.GetLauncher();
  var nonPressOpenEvents;

  const events = this._getPopupEventNamesToRegisterForComp();

  // 1. associate the ojPopup component to wrapper <div> for popup content
  // 2. wire up on() event handlers for registered events that open and close popup. E.g., focusin.
  // 3. autoDismissal happens automatically when focus leaves component. For other events like
  // mouseover it's required to call off()
  if (events.open) {
    if (!this._openPopupCallback) {
      this._openPopupCallback = this._openPopup.bind(this);
    }

    // separate out press event, namespace the events string, and attach event handler
    const needsPressEvent = this._needsPressEvent(events);
    nonPressOpenEvents = this._getNamespacedEvents(
      events.open.replace('press', ''),
      PopupMessagingStrategy._OPEN_NAMESPACE
    );
    jqLauncher.on(nonPressOpenEvents, this._openPopupCallback);

    // The pressHold gesture also fires a contextmenu event on Windows 10 touch.
    // Prevent that here for components that use 'press' for popup messaging as
    // the context menu causes the popup message window to close. Note that this
    // means the context menu will be disabled for these components.
    if (isTouchSupported() && needsPressEvent) {
      this._eatContextMenuOnOpenPopupListener = function () {
        return false;
      };

      jqLauncher.on('contextmenu', this._eatContextMenuOnOpenPopupListener);

      this.registerHammerOpenCallbackOnLauncher();
    }
  }

  if (events.close) {
    closePopupCallback = this._closePopupCallback;
    if (!closePopupCallback) {
      closePopupCallback = this._closePopup.bind(this);
      this._closePopupCallback = closePopupCallback;
    }

    closeEvents = this._getNamespacedEvents(events.close, PopupMessagingStrategy._CLOSE_NAMESPACE);
    jqLauncher.on(closeEvents, closePopupCallback);
  }
};

/**
 * Symmetrical method to releaseResources. Sets up resources that get
 * removed in releaseResources.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype.setupResources = function () {
  const events = this._getPopupEventNamesToRegisterForComp();
  const needsPressEvent = this._needsPressEvent(events);
  if (isTouchSupported() && needsPressEvent) {
    this.registerHammerOpenCallbackOnLauncher();
  }
};

/**
 * Register Hammer Press Event. Make sure you are on touch and you
 * need the press event before calling this function.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype.registerHammerOpenCallbackOnLauncher = function () {
  const jqLauncher = this.GetLauncher();
  if (jqLauncher == null) {
    return;
  }
  // for radios and checkboxes, on ios, press hold brings up popup, but release closes it
  // and checks it, so in this case we have to eat the click/change events. this happens
  // in the openPopupCallback
  const hammerOptions = {
    recognizers: [[Press, { time: 750 }]]
  };
  jqLauncher.ojHammer(hammerOptions).on('press', this._openPopupCallback);
};

/**
 * Releases resources that would otherwise leak memory if they were not released
 * when the component's dom is removed.
 * For example, Hammer events are put on the document and will result in
 * detached dom memory leak if not removed.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype.releaseResources = function () {
  PopupMessagingStrategy.superclass.update.call(this);
  const events = this._getPopupEventNamesToRegisterForComp();
  const needsPressEvent = this._needsPressEvent(events);
  if (isTouchSupported() && needsPressEvent) {
    const jqLauncher = this.GetLauncher();
    jqLauncher.off('press').ojHammer('destroy');
  }
};

/**
 * Turn the events string into an array, add namespace, and turn it back into a string.
 * @param {string} events e.g., "focusin mousedown"
 * @param {string} namespace the namespace that starts with a dot
 * @return {string|null} the events string that is namespaced.
 * e.g., "focusin.ojPopupMessagingOpen mousedown.ojPopupMessagingOpen"
 * @private
 */
PopupMessagingStrategy.prototype._getNamespacedEvents = function (events, namespace) {
  var eventsArray;
  var namespacedEventsArray;
  var length;

  if (events === '' || namespace === '') {
    return events;
  }

  eventsArray = events.split(' ');
  length = eventsArray.length;
  namespacedEventsArray = [];

  for (var i = 0; i < length; i++) {
    // ignore ""
    if (eventsArray[i]) {
      namespacedEventsArray.push(eventsArray[i] + namespace);
    }
  }

  return namespacedEventsArray.join(' ');
};

/**
 * Returns the popup position options.
 * Components like radio and checkboxset use the launcher, which is the inputs.
 * Since we now add extra dom for inline messages, we don't want to position
 * on the tip of the component root. Instead we want to position on the main part of the component,
 * which is in a lot of cases the launcher. In the case of inputDate/Time/Number, it's the launcher's
 * parent.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._getPopupPosition = function () {
  var compDefaultPosition;
  var compDefaults;
  var launcher;
  var popupPositionOptions;

  compDefaults = PopupMessagingStrategy._DEFAULTS_BY_COMPONENT[this.GetComponent().widgetName];
  compDefaultPosition = compDefaults
    ? compDefaults.position
    : PopupMessagingStrategy._DEFAULTS_BY_COMPONENT.default.position;

  if (compDefaultPosition) {
    if (compDefaultPosition === 'launcher') {
      launcher = this.GetLauncher();
    } else if (compDefaultPosition === 'launcher-wrapper') {
      launcher = this.GetLauncher().parent();
    }
  }
  // should never get here since the _DEFAULTS_BY_COMPONENTS["default"] should cover it.
  if (!launcher) {
    launcher = this.GetComponent().widget();
  }

  popupPositionOptions = {
    my: 'start bottom',
    at: 'end top',
    collision: 'flipcenter',
    of: launcher
  };
  return popupPositionOptions;
};

/**
 * Returns the events
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._getPopupEventNamesToRegisterForComp = function () {
  const compDefaults =
    PopupMessagingStrategy._DEFAULTS_BY_COMPONENT[this.GetComponent().widgetName];
  return compDefaults
    ? compDefaults.events
    : PopupMessagingStrategy._DEFAULTS_BY_COMPONENT.default.events;
};

/**
 * Returns true if it needs a press event.
 *
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._needsPressEvent = function (events) {
  if (events && events.open) {
    return events.open.indexOf('press') !== -1;
  }
  return false;
};

/**
 * Returns a jquery element that a messaging popup is bound to.
 *
 * @return {jQuery!} messaging popup pool container
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._getPopupElement = function () {
  var popup;
  var position;

  if (this.$messagingContentRoot) {
    return this.$messagingContentRoot;
  }

  popup = PopupMessagingStrategyPoolUtils.getNextFreePopup();
  position = this._getPopupPosition();
  popup.ojPopup('option', 'position', position);
  popup.ojPopup('option', 'beforeClose', this._popupBeforeCloseCallback.bind(this));
  popup.ojPopup('option', 'close', this._popupCloseCallback.bind(this));
  popup.ojPopup('option', 'open', this._popupOpenCallback.bind(this));

  // Use default animation only for custom elements
  if (this.GetComponent()._IsCustomElement()) {
    // Get the default animation
    var defaultAnimations = (parseJSONFromFontFamily('oj-messaging-popup-option-defaults') || {})
      .animation;
    defaultAnimations.actionPrefix = 'notewindow';
    popup.ojPopup('option', 'animation', defaultAnimations);

    this._addAnimateEventListeners(popup);
  } else {
    popup.ojPopup('option', 'animation', null);
  }

  this.$messagingContentRoot = popup;
  return this.$messagingContentRoot;
};

/**
 * Popup open event listener that changes the popups autoDismiss to focusLoss
 * in a timeout of 10ms.  This timeout period gives the browser time to fire
 * events that might follow a click such as a focus event.  This is to allow
 * validation by a button versus a component instance.
 *
 * @param {jQuery.event=} event
 * @memberof! oj.PopupMessagingStrategy
 * @private
 */
PopupMessagingStrategy.prototype._popupOpenCallback = function (event) {
  var target = $(event.target);
  var self = this;
  window.setTimeout(function () {
    if (isComponentInitialized(target, 'ojPopup')) {
      target.ojPopup('option', 'autoDismiss', 'focusLoss');
    } else {
      delete self.$messagingContentRoot;
    }
  }, 10);
};

/**
 * Popup beforeClose event listener that will add busy state to the component
 * @param {jQuery.event=} event
 * @memberof! oj.PopupMessagingStrategy
 * @private
 */
PopupMessagingStrategy.prototype._popupBeforeCloseCallback = function () {
  this._resolveBusyState = this._setBusyState('close');
};

/**
 * Popup closed event listener that will reset the popups state and free it into the
 * pool of available messaging popups.
 * @param {jQuery.event=} event
 * @memberof! oj.PopupMessagingStrategy
 * @private
 */
PopupMessagingStrategy.prototype._popupCloseCallback = function (event) {
  var jqLauncher = this.GetLauncher();
  var target = $(event.target);

  this._removeAnimateEventListeners(target);

  if (isComponentInitialized(target, 'ojPopup')) {
    target.ojPopup('option', 'autoDismiss', 'none');
    target.ojPopup('option', 'open', null);
    target.ojPopup('option', 'close', null);
    target.ojPopup('option', 'beforeClose', null);
  }

  // Check that the launcher is still there when removing listeners
  if (jqLauncher && jqLauncher[0]) {
    jqLauncher[0].removeEventListener('click', this._eatChangeAndClickOnPress, true);
    jqLauncher[0].removeEventListener('change', this._eatChangeAndClickOnPress, true);
  }

  this.$messagingContentRoot = null;
  this._inPressEvent = null;

  var popupContent = PopupMessagingStrategyPoolUtils.getPopupContentNode(target);
  popupContent.innerHTML = ''; // @HTMLUpdateOK

  if (this._resolveBusyState) {
    this._resolveBusyState();
    this._resolveBusyState = null;
  }
};

/**
 * @memberof! oj.PopupMessagingStrategy
 * @private
 * @instance
 */
PopupMessagingStrategy.prototype._destroyTooltip = function () {
  this._closePopup();
  PopupMessagingStrategyPoolUtils.destroyFreePopup();
};

/**
 * Returns the content to show inside popup.
 * @private
 * @return {String|string} content
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._buildPopupHtml = function () {
  var addSeparator = false;
  var document = this.GetComponent().document[0];
  var nwContent = [];
  var nwHtml = '';

  if (this.ShowMessages()) {
    nwContent.push(this._buildMessagesHtml(document));
  }

  if (this.ShowConverterHint() || this.ShowValidatorHint() || this.ShowTitle()) {
    nwContent.push(this._buildHintsHtml(document));
  }

  nwContent.forEach(function (content) {
    if (content) {
      if (addSeparator) {
        nwHtml = nwHtml.concat(PopupMessagingStrategyUtils.getSeparatorHtml(document));
      } else {
        addSeparator = true;
      }

      nwHtml = nwHtml.concat(content);
    }
  });

  return nwHtml;
};

/**
 * Returns the messages html (e.g., error messages, confirmation messages), not hints
 * @param {Document} document
 * @return {string} content
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._buildMessagesHtml = function (document) {
  var content = '';
  var maxSeverity = this.GetMaxSeverity();
  var messages;
  var renderSeveritySelectors = false;

  if (this.HasMessages()) {
    messages = this.GetMessages();
    content = PopupMessagingStrategyUtils.buildMessagesHtml(
      document,
      messages,
      maxSeverity,
      renderSeveritySelectors
    );
  }
  return content;
};

/**
 * All hints including title
 * @param {Document} document
 * @return {string} html content for all hints.
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._buildHintsHtml = function (document) {
  var hint;
  var hints = [];
  var hintsHtml = '';
  var i;

  if (this.ShowConverterHint()) {
    hints = this.GetConverterHint();
    hint = hints.length ? hints[0] : '';
    hintsHtml += PopupMessagingStrategyUtils.buildHintHtml(
      document,
      PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_CONVERTER,
      hint,
      false,
      PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT
    );
  }

  if (this.ShowValidatorHint()) {
    hints = this.GetValidatorHints();
    for (i = 0; i < hints.length; i++) {
      hintsHtml += PopupMessagingStrategyUtils.buildHintHtml(
        document,
        PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_VALIDATOR,
        hints[i],
        false,
        PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT
      );
    }
  }

  if (this.ShowTitle()) {
    hintsHtml += PopupMessagingStrategyUtils.buildHintHtml(
      document,
      PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT_TITLE,
      this.GetTitle(),
      true,
      PopupMessagingStrategy._SELECTOR_FORMCONTROL_HINT
    );
  }

  return hintsHtml ? "<div class='oj-form-control-hints'>" + hintsHtml + '</div>' : '';
};

/**
 * Determines if there is a message popup currently associated with the component
 * strategy.
 * @return {boolean}
 * @private
 * @memberof oj.PopupMessagingStrategy
 * @instance
 */
PopupMessagingStrategy.prototype._isPopupInitialized = function () {
  // is(":oj-popup") finds the popup component if it exists
  return this.$messagingContentRoot
    ? isComponentInitialized(this.$messagingContentRoot, 'ojPopup')
    : false;
};

/**
 * Renders the html content for a single hint.
 * @param {Document} document
 * @param {string} selector
 * @param {string} hintText
 * @param {boolean} htmlAllowed
 * @param {string} formControlSelectors
 *
 * @return {string} html content for a single hint.
 * @public
 */
PopupMessagingStrategyUtils.buildHintHtml = function (
  document,
  selector,
  hintText,
  htmlAllowed,
  formControlSelectors
) {
  var titleDom;

  if (hintText) {
    titleDom = document.createElement('div');
    var selectors = formControlSelectors.split(' ');

    for (var i = 0, len = selectors.length; i < len; ++i) {
      titleDom.classList.add(selectors[i]);
    }

    titleDom.classList.add(selector);
    PopupMessagingStrategyUtils._appendTextDom(
      titleDom,
      PopupMessagingStrategyUtils.GetTextDom(document, hintText, htmlAllowed)
    );
  }

  return titleDom ? titleDom.outerHTML : ''; // @HTMLUpdateOK
};

/**
 * @param {number} severity
 * @returns (string} translated string for the severity
 * @public
 */
PopupMessagingStrategyUtils.getSeverityTranslatedString = function (severity) {
  var sevTypeStr;
  // get the translated string for the severity
  switch (severity) {
    case Message.SEVERITY_LEVEL.FATAL:
      sevTypeStr = getTranslatedString('oj-message.fatal');
      break;
    case Message.SEVERITY_LEVEL.ERROR:
      sevTypeStr = getTranslatedString('oj-message.error');
      break;
    case Message.SEVERITY_LEVEL.WARNING:
      sevTypeStr = getTranslatedString('oj-message.warning');
      break;
    case Message.SEVERITY_LEVEL.INFO:
      sevTypeStr = getTranslatedString('oj-message.info');
      break;
    case Message.SEVERITY_LEVEL.CONFIRMATION:
      sevTypeStr = getTranslatedString('oj-message.confirmation');
      break;
    default:
      break;
  }

  return sevTypeStr;
};

/**
 * @param {Document} document
 * @returns {string}
 * @public
 */
PopupMessagingStrategyUtils.getSeparatorHtml = function (document) {
  var jSeparatorDom;
  jSeparatorDom = $(document.createElement('hr'));

  return jSeparatorDom ? jSeparatorDom.get(0).outerHTML : ''; // @HTMLUpdateOK
};

/**
 * Returns the messages html (e.g., error messages, confirmation messages), not hints
 * @param {Document} document
 * @param {Array} messages
 * @param {number} maxSeverity
 * @param {boolean} renderSeveritySelectors
 * @return {string} content
 * @private
 * @memberof oj.PopupMessagingStrategyUtils
 * @instance
 */
PopupMessagingStrategyUtils.buildMessagesHtml = function (
  document,
  messages,
  maxSeverity,
  renderSeveritySelectors
) {
  var content = '';
  var detail;
  var i;
  var j;
  var message;
  var messagesByType = [];
  var messagesByTypes = {};
  var messageObj;
  var severityLevel;
  var severityStr;
  var summary;

  // Step1: build an indexed array of messages by severity level.
  for (i = 0; i < messages.length; i++) {
    message = messages[i];

    if (!(message instanceof Message)) {
      messageObj = new Message(message.summary, message.detail, message.severity);
    } else {
      messageObj = message;
    }

    severityLevel = Message.getSeverityLevel(messageObj.severity);
    if (!messagesByTypes[severityLevel]) {
      messagesByTypes[severityLevel] = [];
    }

    messagesByTypes[severityLevel].push(messageObj);
  }

  // Step 2: starting with maxSeverity level build messages with decreasing severity
  for (i = maxSeverity; i >= Message.SEVERITY_LEVEL.CONFIRMATION; i--) {
    messagesByType = messagesByTypes[i] || [];

    for (j = 0; j < messagesByType.length; j++) {
      message = messagesByType[j];

      severityLevel = Message.getSeverityLevel(message.severity);
      severityStr = PopupMessagingStrategyUtils.getSeverityTranslatedString(severityLevel);
      summary = message.summary || severityStr;

      // if detail is empty we don't care to duplicate summary. also detail if present can be
      // formatted html content (ADF feature)
      detail = message.detail || '';
      content = content.concat(
        PopupMessagingStrategyUtils.buildMessageHtml(
          document,
          summary,
          detail,
          severityLevel,
          renderSeveritySelectors
        )
      );
    }
  }
  return content;
};

/**
 * Builds the HTML content for a single message
 * @param {Document} document
 * @param {string} summary
 * @param {string} detail
 * @param {number} severityLevel
 * @returns {string}
 * @public
 */
PopupMessagingStrategyUtils.buildMessageHtml = function (
  document,
  summary,
  detail,
  severityLevel,
  addSeverityClass
) {
  var msgContent;
  var msgDetail;
  var msgDom;
  var msgIcon;
  var msgSummary;
  var severityStr = PopupMessagingStrategyUtils.getSeverityTranslatedString(severityLevel);

  // build message
  // (x) <Summary Text>
  // <Detail Text>
  msgDom = document.createElement('div');
  msgDom.classList.add(PopupMessagingStrategyUtils._SELECTOR_MESSAGE);

  if (addSeverityClass) {
    var severityClasses =
      PopupMessagingStrategyUtils._getSeveritySelector(severityLevel).split(' ');

    for (var i = 0, slen = severityClasses.length; i < slen; ++i) {
      msgDom.classList.add(severityClasses[i]);
    }
  }

  // build msg icon
  msgIcon = document.createElement('span');
  var severityIconClasses =
    PopupMessagingStrategyUtils._getSeverityIconSelector(severityLevel).split(' ');

  for (var j = 0, silen = severityIconClasses.length; j < silen; ++j) {
    msgIcon.classList.add(severityIconClasses[j]);
  }

  if (severityStr == null) {
    msgIcon.removeAttribute('title');
  } else {
    msgIcon.setAttribute('title', severityStr);
  }

  msgIcon.setAttribute('role', 'img');

  msgDom.appendChild(msgIcon); // @HTMLUpdateOK

  // build msg content which includes summary and detail
  msgContent = document.createElement('span');
  msgContent.classList.add(PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONTENT);

  if (
    (parseJSONFromFontFamily('oj-messaging-popup-option-defaults') || {})
      .messageSummaryOptionDefault === 'header'
  ) {
    msgSummary = document.createElement('div');
    msgSummary.classList.add(PopupMessagingStrategyUtils._SELECTOR_MESSAGE_SUMMARY);
    msgSummary.textContent = summary;

    msgContent.appendChild(msgSummary); // @HTMLUpdateOK
  }

  if (detail) {
    // detail text allows html content. So scrub it before setting it.
    var detailDom = PopupMessagingStrategyUtils.GetTextDom(document, detail, true);
    msgDetail = document.createElement('div');

    msgDetail.classList.add(PopupMessagingStrategyUtils._SELECTOR_MESSAGE_DETAIL);
    PopupMessagingStrategyUtils._appendTextDom(msgDetail, detailDom);
    msgContent.appendChild(msgDetail); // @HTMLUpdateOK
  }

  msgDom.appendChild(msgContent); // @HTMLUpdateOK

  return msgDom.outerHTML; // @HTMLUpdateOK
};

/**
 * @param {number} severity
 * @return {string} the icon selector for the severity
 * @private
 */
PopupMessagingStrategyUtils._getSeverityIconSelector = function (severity) {
  var sevIconStr;
  // get the icon selector for the severity
  switch (severity) {
    case Message.SEVERITY_LEVEL.FATAL:
      sevIconStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR_ICON;
      break;
    case Message.SEVERITY_LEVEL.ERROR:
      sevIconStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR_ICON;
      break;
    case Message.SEVERITY_LEVEL.WARNING:
      sevIconStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_WARNING_ICON;
      break;
    case Message.SEVERITY_LEVEL.INFO:
      sevIconStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_INFO_ICON;
      break;
    case Message.SEVERITY_LEVEL.CONFIRMATION:
      sevIconStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONFIRMATION_ICON;
      break;
    default:
      break;
  }

  return PopupMessagingStrategyUtils._DEFAULT_STATUS_ICON_SELECTORS + sevIconStr;
};

/**
 * @param {number} severity
 * @return {string} the style selector for the severity
 * @private
 */
PopupMessagingStrategyUtils._getSeveritySelector = function (severity) {
  var sevSelectorStr;
  // get the icon selector for the severity
  switch (severity) {
    case Message.SEVERITY_LEVEL.FATAL:
      sevSelectorStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR;
      break;
    case Message.SEVERITY_LEVEL.ERROR:
      sevSelectorStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR;
      break;
    case Message.SEVERITY_LEVEL.WARNING:
      sevSelectorStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_WARNING;
      break;
    case Message.SEVERITY_LEVEL.INFO:
      sevSelectorStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_INFO;
      break;
    case Message.SEVERITY_LEVEL.CONFIRMATION:
    default:
      sevSelectorStr = PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONFIRMATION;
      break;
  }

  return sevSelectorStr;
};

/**
 *  if content is html clean html by allowing only legal tags before returning, to safeguard from
 *  script injection errors.
 *
 * @param {Document} document
 * @param {string} value
 * @param {boolean=} htmlAllowed if value can have html content
 *
 * @return {Element} dom node containing the scrubbed hint
 * @public
 */
PopupMessagingStrategyUtils.GetTextDom = function (document, value, htmlAllowed) {
  var textDom = null;

  if (oj.StringUtils.isString(value)) {
    if (htmlAllowed && isHTMLContent(value)) {
      // strip out html start/end tags
      textDom = cleanHtml(value.substring(6, value.length - 7));
    } else {
      textDom = document.createElement('span');
      textDom.textContent = value;
    }
  }

  return textDom;
};

/**
 * This function can append dom elements or HTML text, similar to how jquery append() works.  It assumes that the html
 * has already been cleaned.
 * @param {Element} parentElement The parent dom element that the dom element or html text is appended to.
 * @param {String|Element} textDom The dom element or HTML text to append
 * @private
 */
PopupMessagingStrategyUtils._appendTextDom = function (parentElement, textDom) {
  if (oj.StringUtils.isString(textDom)) {
    // eslint-disable-next-line no-param-reassign
    parentElement.innerHTML = textDom; // @HTMLUpdateOK
  } else {
    parentElement.appendChild(textDom);
  }
};

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._DEFAULT_STATUS_ICON_SELECTORS =
  'oj-component-icon oj-message-status-icon ';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE = 'oj-message';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_SUMMARY = 'oj-message-summary';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_DETAIL = 'oj-message-detail';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONTENT = 'oj-message-content';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR_ICON = 'oj-message-error-icon';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_WARNING_ICON = 'oj-message-warning-icon';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_INFO_ICON = 'oj-message-info-icon';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONFIRMATION_ICON = 'oj-message-confirmation-icon';

// new theming keys so that we can style the different types of messages differently. Like,
// the background-color can be light red for error. This style will go on the same dom node
// as the oj-message selector.
/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_ERROR = 'oj-message-error';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_WARNING = 'oj-message-warning';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_INFO = 'oj-message-info';

/**
 * @private
 * @const
 * @type {string}
 */
PopupMessagingStrategyUtils._SELECTOR_MESSAGE_CONFIRMATION = 'oj-message-confirmation';

/**
 * @public
 * @returns {jQuery} popup taken or created from the free pool
 */
PopupMessagingStrategyPoolUtils.getNextFreePopup = function () {
  var pool = PopupMessagingStrategyPoolUtils._getPool();
  var popups = pool.find('.' + PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING);
  var popup;

  if (popups.length === 0) {
    popup = $(PopupMessagingStrategyPoolUtils._getPopupContentHtml());
    popup[0].style.display = 'none';
    // popup is an empty div
    popup.appendTo(pool); // @HTMLUpdateOK
    var popupOptions = {
      initialFocus: 'none',
      tail: 'simple',
      autoDismiss: 'none',
      modality: 'modeless',
      animation: { open: null, close: null }
    };
    popup.ojPopup(popupOptions);
  } else {
    popup = $(popups[0]);
  }

  return popup;
};

/**
 * Passed in the root dom element of the message popup and returns the content element.
 *
 * @param {jQuery} popup root element
 * @returns {Element} content element of message popup
 */
PopupMessagingStrategyPoolUtils.getPopupContentNode = function (popup) {
  return popup.find('.' + PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING_CONTAINER)[0];
};

/**
 * @public
 */
PopupMessagingStrategyPoolUtils.destroyFreePopup = function () {
  var popup;
  if (PopupMessagingStrategyPoolUtils._getFreePoolCount() > 0) {
    // if the message popup is open, remove it.
    // if there is at least one popup in the pool, remove it.
    popup = PopupMessagingStrategyPoolUtils.getNextFreePopup();
    var el = popup[0];
    popup.ojPopup('destroy');
    el.parentNode.removeChild(el);
  }
};

/**
 * Returns a div appended to the body that is a common pool of notewindow popups
 * used internally by editable value holders.
 *
 * @return {jQuery!} messaging popup pool container
 * @private
 */
PopupMessagingStrategyPoolUtils._getPool = function () {
  /** @type {jQuery!} */
  var pool = $('#' + PopupMessagingStrategyPoolUtils._MESSAGING_POPUP_POOL_ID);
  if (pool.length > 0) {
    return pool;
  }

  pool = $('<div>');
  var poolElem = pool[0];
  poolElem.setAttribute('id', PopupMessagingStrategyPoolUtils._MESSAGING_POPUP_POOL_ID);
  poolElem.setAttribute('role', 'presentation');
  document.body.appendChild(poolElem); // @HTMLUpdateOK

  return pool;
};

/**
 * @return {number} number of unused popup in the pool
 * @private
 */
PopupMessagingStrategyPoolUtils._getFreePoolCount = function () {
  var pool = PopupMessagingStrategyPoolUtils._getPool();
  var popups = pool.find('.' + PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING);
  return popups.length;
};

/**
 * @return {string} messaging popup html
 * @private
 */
PopupMessagingStrategyPoolUtils._getPopupContentHtml = function () {
  return (
    '<div class="' +
    PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING +
    '">' +
    '<div class="' +
    PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING_CONTAINER +
    '"></div>' +
    '</div>'
  );
};

/**
 * @const
 * @private
 * @type {string}
 */
PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING_CONTAINER = 'oj-messaging-popup-container';

/**
 * @const
 * @private
 * @type {string}
 */
PopupMessagingStrategyPoolUtils._SELECTOR_MESSAGING = 'oj-messaging-popup';

/**
 * @const
 * @private
 * @type {string}
 */
PopupMessagingStrategyPoolUtils._MESSAGING_POPUP_POOL_ID = '__oj_messaging_popup_pool';

/**
 * Adapter for handling inline Help and Hints text.
 * Extends the MessagingStrategy which does more now than messages.
 *
 * @extends {oj.MessagingStrategy}
 * @protected
 * @constructor
 * @since 9.0.0
 * @class InlineHelpHintsStrategy
 * @ignore
 * @ojtsignore
 * @param {Array.<string>} displayOptions an array of messaging artifacts that are
 * displayed as an inside label for text fields.
 * For LabelStrategies this is always only labelEdge.
 */
const InlineHelpHintsStrategy = function (displayOptions, parentElement) {
  this.Init(displayOptions);
  this._userAssistanceDivElement = parentElement;
};

const OJ_HAS_HELPHINTS_STYLECLASS = 'oj-has-helphints';

/**
 * Registers the InlineHelpHintsStrategy constructor function with ComponentMessaging.
 * No need to register since we are not creating this strategy on from ComponentMessaging.
 * InlineUserAssistanceStrategy creates it.
 * @private
 */
// ComponentMessaging
//    .registerMessagingStrategy('inlinehelphints',
//     InlineHelpHintsStrategy);

// Subclass from MessagingStrategy
oj.Object.createSubclass(InlineHelpHintsStrategy, oj.MessagingStrategy, 'InlineHelpHintsStrategy');

/**
 * @param {Object} cm a reference to an instance of ComponentMessaging that provides access to
 * the latest messaging content.
 * @public
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @override
 */
InlineHelpHintsStrategy.prototype.activate = function (cm) {
  InlineHelpHintsStrategy.superclass.activate.call(this, cm);
  this._createInlineHelpHints();
};

/**
 * This gets called when display-options changes. It may be that they set
 * display-options.validator-hints='none', so then if validator hints were
 * showing they won't show anymore.
 * @param {Array.<string>} newOptions
 * @public
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @override
 */
InlineHelpHintsStrategy.prototype.reactivate = function (newOptions, parentElement) {
  InlineHelpHintsStrategy.superclass.reactivate.call(this, newOptions);
  this._userAssistanceDivElement = parentElement;
  // sets up dom and focusin handlers
  var containerRootExists = this._isContainerRootDomInDocument();
  if (!containerRootExists) {
    this._createInlineHelpHints();
  }
};

/**
 * @param {Object=} content the messaging content object. If it contains validityState, then
 * this means the component has messaging content.
 * @return {boolean}
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @oublic
 * @override
 */
// eslint-disable-next-line no-unused-vars
InlineHelpHintsStrategy.prototype.shouldUpdate = function (content) {
  // EditableValue updates messaging when help.instruction (aka title), validator hint,
  // and converter hint are changed.
  // for help-hints, we have set a helpHintsChanged listener, see
  // InlineHelpHintsStrategy.prototype._createHelpHintsAttributeEventHandlers
  let updateTitle = !!(content && content.title !== undefined);
  let updateValidatorHint = !!(content && content.validatorHint !== undefined);
  let updateConverterHint = !!(content && content.converterHint !== undefined);
  return updateTitle || updateValidatorHint || updateConverterHint;
};

/**
 * Updates component with instance using the content provided. One condition when this gets called
 * is when we fetch the async validator hint to show it, but since it is async, it doesn't come back
 * serially, so instead update is called when it is ready. Go ahead and update the inline help hints
 * right away since you could already be in the focusinhandler at that point.
 * this also gets called from EditableValue when help.instruction attribute changes.
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @public
 * @override
 */
InlineHelpHintsStrategy.prototype.update = function () {
  InlineHelpHintsStrategy.superclass.update.call(this);
  this._updateInlineHelpHints();
};

/**
 * Cleans up dom on the component and removes any event listeners it created.
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @public
 * @override
 */
InlineHelpHintsStrategy.prototype.deactivate = function () {
  var component = this.GetComponent();
  var element = component._getRootElement();
  this._removeHelpHintsContainerAndContent();

  // if we created a event handler then we know we have to delete them here.
  if (this._focusinCallback) {
    this._deleteFocusEventHandlers(element);
  }

  this._deleteHelpHintsAttributeEventHandlers(element);

  InlineHelpHintsStrategy.superclass.deactivate.call(this);
};

/**
 * Creates the dom if showHelpHints is 'always' (like for radioset)
 * and adds focus/helpHints attributes event listeners on the component.
 * Focus in will create the dom and focus out will remove the dom.
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @private
 */
InlineHelpHintsStrategy.prototype._createInlineHelpHints = function () {
  var component = this.GetComponent();

  let showHelpHints = component._ShowHelpHints();
  // always is for form comps like radioset/checkboxset, focus is for
  // inputtext, etc.
  if (showHelpHints === 'always') {
    // if showHelpHints is 'focus', then we create the content on the first focusin so that
    // we can delay getting validation hints.
    // otherwise add content now.
    // It is possible there is no content to show.
    this._addHelpHintsContent(component);
  }

  if (showHelpHints === 'focus') {
    // the help container gets created in focusin and removed in focusout
    this._createFocusEventHandlers(component);
  }
  this._createHelpHintsAttributeEventHandlers(component);
};

/**
 * Creates the focusevent handlers.
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @private
 */
InlineHelpHintsStrategy.prototype._createFocusEventHandlers = function (component) {
  var element = component._getRootElement();
  this._focusinCallback = InlineHelpHintsStrategy._focusinHandler.bind(this, component);
  element.addEventListener('focusin', this._focusinCallback);
  this._focusoutCallback = InlineHelpHintsStrategy._focusoutHandler.bind(this);
  element.addEventListener('focusout', this._focusoutCallback);
};

InlineHelpHintsStrategy.prototype._deleteFocusEventHandlers = function (element) {
  element.removeEventListener('focusin', this._focusinCallback);
  delete this._focusinCallback;
  element.removeEventListener('focusout', this._focusoutCallback);
  delete this._focusoutCallback;
};

/**
 * Creates the helpHints handlers for help-hints.definition and help-hints.source changes
 * @param {Object} component form component
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @private
 */
InlineHelpHintsStrategy.prototype._createHelpHintsAttributeEventHandlers = function (component) {
  var element = component._getRootElement();
  this._helpHintsChangedCallback = InlineHelpHintsStrategy._helpHintsChangedHandler.bind(this);
  element.addEventListener('helpHintsChanged', this._helpHintsChangedCallback);
};

InlineHelpHintsStrategy.prototype._deleteHelpHintsAttributeEventHandlers = function (element) {
  element.removeEventListener('helpHintsChanged', this._helpHintsChangedCallback);
  delete this._helpHintsChangedCallback;
};

/**
 * @return {Element} help hints inline container dom element, if it exists,
 * null otherwise. It is the oj-helphints-inline-container dom element.
 * This may be a child of the user assistance dom element or not because
 * radioset/checkboxset it is not since it is under the label, so start
 * with root
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @private
 */
InlineHelpHintsStrategy.prototype._getHelpHintsInlineContainer = function (rootElem) {
  return rootElem.querySelector('.oj-helphints-inline-container');
};

/**
 * Returns true if the div exists. This is needed
 * because it is possible that components delete their dom, including
 * the inline dom, which means the this.containerRoot is not
 * null.
 * @return {boolean} true if this.containerRoot exists in the dom
 * @private
 * @memberof InlineHelpHintsStrategy
 * @instance
 */
InlineHelpHintsStrategy.prototype._isContainerRootDomInDocument = function () {
  let containerRootExistsInDocument = false;
  if (this.containerRoot) {
    let id = this.containerRoot.id;
    containerRootExistsInDocument = document.getElementById(id);
  }
  return containerRootExistsInDocument !== null;
};

/**
 * @static
 * @private
 * @param {CustomEvent} event helpChanged event
 */
// eslint-disable-next-line no-unused-vars
InlineHelpHintsStrategy._helpHintsChangedHandler = function (event) {
  this._updateInlineHelpHints();
};

/**
 * Removes the helphints container and its content.
 * @param {Object} component the form component
 * @return {boolean} Returns true if content was added
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @private
 */
InlineHelpHintsStrategy.prototype._removeHelpHintsContainerAndContent = function () {
  var component = this.GetComponent();
  var element = component._getRootElement();
  var container = this._getHelpHintsInlineContainer(element);
  if (container) {
    this.RemoveAriaDescribedByForInlineMessaging(container);
    container.parentElement.removeChild(container);
    if (this._userAssistanceDivElement) {
      this._userAssistanceDivElement.classList.remove(OJ_HAS_HELPHINTS_STYLECLASS);
      this.containerRoot = null;
    }
  }
};

/**
 * Creates the content, if any.
 * @param {Object} component the form component
 * @return {boolean} Returns true if content was added
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @private
 */
InlineHelpHintsStrategy.prototype._addHelpHintsContent = function (component) {
  let hintsHtml;
  let helpOptions = component.options.help;
  let helpInstruction = helpOptions ? helpOptions.instruction : null;
  let helpHints = component.options.helpHints;

  if (helpInstruction) {
    let helpInstructionDom = PopupMessagingStrategyUtils.GetTextDom(
      document,
      helpInstruction,
      true
    );
    // turn it into a string
    let helpInstructionDomString = helpInstructionDom ? helpInstructionDom.outerHTML : ''; // @HTMLUpdateOK
    hintsHtml = helpInstructionDomString;
  }
  if (!hintsHtml && this.ShowValidatorHint()) {
    // helpInstruction takes priority. If it is not set, check validator hints.
    // This involves loading the validators if they are not set.
    // ShowValidatorHint may be null if the display-options.validatorHint = 'none',
    // otherwise we show the validator hint.
    // no helpInstruction, so try to get validation hint
    // we do the same thing that we do in PopupComponentMessages
    let hints = this.GetValidatorHints();
    if (hints.length > 0) {
      hintsHtml = hints.join('<br/>');
    }
  }
  if (!hintsHtml) {
    // try to get help definition
    // We get notified of changes to help-hints in
    // InlineHelpHintsStrategy.prototype._createHelpHintsAttributeEventHandlers
    let definition = helpHints ? helpHints.definition : null;
    if (definition) {
      hintsHtml = definition;
    }
  }
  // try to get the converterHint
  if (!hintsHtml && this.ShowConverterHint()) {
    let hints = this.GetConverterHint();
    if (hints.length > 0) {
      hintsHtml = hints.join('<br/>');
    }
  }

  let source = helpHints ? helpHints.source : null;
  let helpSourceDom;
  if (source) {
    helpSourceDom = this._getHelpSourceDom(source);
  }

  // create container if needed
  if ((hintsHtml || helpSourceDom) && !this.containerRoot) {
    this.containerRoot = document.createElement('div');
    this.containerRoot.classList.add('oj-helphints-inline-container');
    $(this.containerRoot).uniqueId();
    this.AddAriaDescribedByForInlineMessaging(this.containerRoot);
    let showHelpHintsLocation = component._ShowHelpHintsLocation();
    if (showHelpHintsLocation === 'inline') {
      this._userAssistanceDivElement.appendChild(this.containerRoot);
    } else {
      let formControlContainerDom = component._GetFormControlContainer();
      formControlContainerDom.parentElement.insertBefore(
        this.containerRoot,
        formControlContainerDom
      );
    }
  }
  // Now we have created the container root, we can add the hintsHtml
  // This function is also called when updateHelpHintsContent, so it is possible
  // that there is no more help and hintsHtml is '',
  // in which case we want to clear out textContent.
  if (this.containerRoot) {
    if (hintsHtml) {
      hintsHtml = '<div>' + hintsHtml + '</div>';
      this.containerRoot.innerHTML = hintsHtml; // @HTMLUpdateOK
    }
    if (helpSourceDom) {
      this.containerRoot.appendChild(helpSourceDom);
    }
    if (!(hintsHtml || helpSourceDom)) {
      this.containerRoot.innerHTML = ''; // @HTMLUpdateOK
    }
  }

  // only when the help/required/messages are all inline does the styleclass matter.
  const showInline = component._ShowHelpHintsLocation() === 'inline';
  if (this._userAssistanceDivElement && showInline) {
    // add this selector the first time we have hints. then use
    // theming to hide/show it or hide/show required dom according to UX rules.
    if (hintsHtml || helpSourceDom) {
      this._userAssistanceDivElement.classList.add(OJ_HAS_HELPHINTS_STYLECLASS);
    } else {
      this._userAssistanceDivElement.classList.remove(OJ_HAS_HELPHINTS_STYLECLASS);
    }
  }
  return hintsHtml || helpSourceDom;
};

/**
 * @private
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @param {String} source
 */
InlineHelpHintsStrategy.prototype._getHelpSourceDom = function (source) {
  oj.Assert.assertString(source);
  let helpAnchorDiv = document.createElement('div');
  let helpSourceAnchor = document.createElement('a');
  helpSourceAnchor.classList.add('oj-helphints-anchor');

  helpSourceAnchor.setAttribute('tabindex', '0');
  helpSourceAnchor.setAttribute('target', '_blank');
  try {
    validateURL(source);
    helpSourceAnchor.setAttribute('href', source);
  } catch (e) {
    throw new Error(e + '. The source option (' + source + ') is invalid.');
  }
  // add Learn more... text on the link
  let helpSourceText = getTranslatedString('oj-ojEditableValue.helpSourceText');
  helpSourceAnchor.textContent = helpSourceText;
  helpAnchorDiv.appendChild(helpSourceAnchor);
  makeFocusable({
    element: helpSourceAnchor,
    applyHighlight: true,
    component: this.GetComponent()
  });
  return helpAnchorDiv;
};

/**
 * This gets called when a component property changes that will affect the
 * inline help hints content or when mc.update is called
 * // (like when an async validator hint resolves)
 * This also gets called from EditableValue when help.instruction attribute changes.
 * Help Hints are only shown on focus for some components, and always for others.
 * This won't change the content unless it is in focus or we always want to show the hints.
 * @param {boolean} showRightAway true if we need to add the content right away
 * which is the case when the update method is called.
 * @private
 * @memberof InlineHelpHintsStrategy
 * @instance
 */
InlineHelpHintsStrategy.prototype._updateInlineHelpHints = function () {
  const component = this.GetComponent();

  if (this.containerRoot) {
    // clear out the containerRoot's innerHTML since we need to create the content
    // again.
    this.containerRoot.innerHTML = ''; // @HTMLUpdateOK
  }
  let showHelpHints = component._ShowHelpHints();
  // if the component is one that always shows the help hints, like oj-checkboxset, or
  // if it is one that shows on focus and it has focus, then add help hints content.
  // if the component already has focus when an update occurs, add the help content
  if (showHelpHints === 'always' || this._focusIn) {
    // if showHelpHints is 'focus', then we create the content on the first focusin so that
    // we can delay getting validation hints.
    // otherwise add content now.
    let hasContent = this._addHelpHintsContent(component);
    if (!hasContent) {
      this._removeHelpHintsContainerAndContent();
    }
  }
};

/**
 * Show the help hint message on focus. We remove it on focusout.
 * We show helpInstruction and if that's not there validaton hint and
 * if that is not there help definition. And on whichever of these, we show
 * Learn more... for help.source if that is there.
 * @static
 * @private
 * @param {Object} component form component root element
 * @param {CustomEvent} event focus event
 */
// eslint-disable-next-line no-unused-vars
InlineHelpHintsStrategy._focusinHandler = function (component, event) {
  let rootElem = event.currentTarget;
  // if we are focusing in from already within the component, return
  // e.g., when we tab from the input to the help source anchor;
  // relatedTarget would be the input in this case.
  let relatedTarget = event.relatedTarget;
  if (relatedTarget && rootElem.contains(relatedTarget)) {
    return;
  }

  if (this.containerRoot) {
    // clear out the containerRoot's innerHTML since need to create the content
    // again.
    this.containerRoot.innerHTML = ''; // @HTMLUpdateOK
  }

  // flag needed to know if we are back in focusin in the focusout
  // handler during the animation promise resolution.
  this._focusIn = true;

  let hasContent = this._addHelpHintsContent(component);
  if (hasContent) {
    this._animateOpen();
  } else {
    // it is possible that when the component has focus, something is changed,
    // that causes the help to no longer hae content, like the app dev
    // removes the help property from the component.
    // if that's the case, then remove it.
    this._removeHelpHintsContainerAndContent();
  }
};

/**
 * @static
 * @private
 * @param {Object} component the form component
 * @param {CustomEvent} event focus event
 */
InlineHelpHintsStrategy._focusoutHandler = function (event) {
  // make this focusout since focusout bubbles and blur does not.
  // This way you can put the event handler on the component's root
  // element and if any child element that can get focus loses focus,
  // this handler will be called. But we need to check if we are still
  // within the element or not. This way the inline hint won't disappear
  // if we focus on the help source Learn more... link.
  // The currentTarget read-only property of the Event interface identifies
  // the current target for the event, as the event traverses the DOM.
  // It always refers to the element to which the event handler has been attached.
  let rootElem = event.currentTarget;
  let relatedTarget = event.relatedTarget;
  if (relatedTarget && rootElem.contains(relatedTarget)) {
    return;
  }
  this._focusIn = false;

  // if we have helphint content, then animate it closed on focusout.
  if (this.containerRoot && this.containerRoot.hasChildNodes()) {
    // animate it closed.
    let action = 'close';
    let defaults = this._getDefaultAnimation();
    let effect = defaults.close; // e.g., {effect: 'fadeOut', duration: '200ms'}
    this._setBusyState();
    let self = this;
    startAnimation(
      this.containerRoot,
      'inline-hints-' + action,
      effect,
      this.GetComponent()
    ).then(() => {
      // As of v12.0.0 we are removing the dom instead of using css.
      this._removeHelpHintsContainerAndContent();
      self._clearBusyState();
    });
  }
};

/**
 * Get the default animation.
 * To save from sending unnecessary theming variables to the client, we hardcode.
 *
 * @private
 * @memberof InlineHelpHintsStrategy
 * @instance
 * @return {Object} Object with open and close key for the default animation.
 */
InlineHelpHintsStrategy.prototype._getDefaultAnimation = function () {
  // Load the default animation once per page scope
  if (!InlineHelpHintsStrategy._defaultAnimation) {
    InlineHelpHintsStrategy._defaultAnimation = {
      open: {
        effect: 'fadeIn',
        duration: '200ms',
        timingFunction: 'cubic-bezier(0.4,0,0.2,1)'
      },
      close: {
        effect: 'fadeOut',
        duration: '200ms',
        timingFunction: 'cubic-bezier(0.4,0,0.2,1)'
      }
    };
  }

  return InlineHelpHintsStrategy._defaultAnimation;
};

/**
 * Animate the help hints container open
 *
 * @private
 * @memberof InlineHelpHintsStrategy
 * @instance
 */
InlineHelpHintsStrategy.prototype._animateOpen = function () {
  if (this.containerRoot && this.containerRoot.hasChildNodes()) {
    // animate it in.
    let defaults = this._getDefaultAnimation();
    let effect = defaults.open; // e.g., {effect: 'fadeIn', duration: '200ms'}
    let action = 'open';
    startAnimation(
      this.containerRoot,
      'inline-hints-' + action,
      effect,
      this.GetComponent()
    );
  }
};

/**
 * Set busy state before opening or closing inline message.
 *
 * @private
 * @memberof InlineHelpHintsStrategy
 * @instance
 */
InlineHelpHintsStrategy.prototype._setBusyState = function () {
  // Set a page-level busy state if not already set
  if (!this._resolveBusyState) {
    let component = this.GetComponent();
    let domElem = component._getRootElement();
    let busyContext = Context.getContext(domElem).getBusyContext();
    let description = 'The page is waiting for inline help hints ';

    if (domElem && domElem.id) {
      description += 'for "' + domElem.id + '" ';
    }
    description += 'to open/close';

    this._resolveBusyState = busyContext.addBusyState({ description: description });
  }
};

/**
 * Clear busy state after opening or closing inline helphints.
 *
 * @private
 * @memberof InlineHelpHintsStrategy
 * @instance
 */
InlineHelpHintsStrategy.prototype._clearBusyState = function () {
  if (this._resolveBusyState) {
    this._resolveBusyState();
    this._resolveBusyState = null;
  }
};

/**
 * A messaging strategy that places the messaging content inline (underneath) the editableValue
 * component.
 *
 * @param {Array.<string>} displayOptions an array of messaging artifacts displayed inline. e.g,
 * 'messages' (for now only 'messages' are supported inline, not converterHints, and others)
 * @constructor
 * @extends {oj.MessagingStrategy}
 * @private
 */
const InlineMessagingStrategy = function (displayOptions, parentElement) {
  this.Init(displayOptions);
  this._parentElement = parentElement;
};

/**
 * Registers the InlineMessagingStrategy constructor function with ComponentMessaging.
 *
 * @private
 */
oj.ComponentMessaging.registerMessagingStrategy(
  oj.ComponentMessaging._STRATEGY_TYPE.INLINE,
  InlineMessagingStrategy
);

// Subclass from MessagingStrategy
oj.Object.createSubclass(
  InlineMessagingStrategy,
  oj.MessagingStrategy,
  'oj.InlineMessagingStrategy'
);

/**
 * Does nothing; We do not create the inline messaging dom until we get messages to show.
 *
 * @param {Object} cm a reference to an instance of ComponentMessaging that provides access to
 * the latest messaging content. * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @override
 *
 */
InlineMessagingStrategy.prototype.activate = function (cm) {
  InlineMessagingStrategy.superclass.activate.call(this, cm);
  // We do not create the inline messaging dom until we get messages to show.
};

/**
 * Reinitializes with the new display options and updates component messaging using the new content.
 *
 * @param {Array.<string>} newDisplayOptions
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @override
 *
 */
InlineMessagingStrategy.prototype.reactivate = function (newDisplayOptions, parentElement) {
  InlineMessagingStrategy.superclass.reactivate.call(this, newDisplayOptions);
  this._parentElement = parentElement;
  this._updateInlineMessage();
};

/**
 * Returns true if the messaging content should update. This method is an
 * optimization because the update() method is called too often and any time any content changes.
 * The only time InlineMessagingStrategy#update needs to execute is when the ComponentValidity
 * object is in the content because we don't add this unless there are messages.
 *
 * @param {Object=} content the messaging content object. If it contains validityState, then
 * this means the component has messaging content.
 * @return {boolean}
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 * @override
 */
InlineMessagingStrategy.prototype.shouldUpdate = function (content) {
  // content is messaging content, and in EditableValue we add a validityState for
  // messages, valid, and severity, so if validityState is there, we know messages are there.
  return !!(content && content.validityState !== undefined);
};

/**
 * Updates component with instance using the content provided.
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 * @override
 */
InlineMessagingStrategy.prototype.update = function () {
  InlineMessagingStrategy.superclass.update.call(this);
  this._updateInlineMessage();
};

/**
 * Cleans up messages on the component and destroys any widgets it created.
 *
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 * @override
 */
InlineMessagingStrategy.prototype.deactivate = function () {
  this._removeMessagingContentRootDom();
  InlineMessagingStrategy.superclass.deactivate.call(this);
};

/**
 * Get the default animation.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._getDefaultAnimation = function () {
  // Load the default animation once per page scope
  if (!InlineMessagingStrategy._defaultAnimation) {
    var animation = (parseJSONFromFontFamily('oj-messaging-inline-option-defaults') || {})
      .animation;
    animation = animation || {};
    InlineMessagingStrategy._defaultAnimation = animation;
  }

  return InlineMessagingStrategy._defaultAnimation;
};

/**
 * Replace animation options with runtime values, such as oldHeight and
 * newHeight, which are specified as placeholders in the default animations
 * but their values are not known until runtime.
 *
 * @param {string|Object|Array} effects - The animation options.
 * @param {Object} map - An object containing the runtime property key-value map.
 * @return {string|Object|Array} The resolved animation effects
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._replaceAnimationOptions = function (effects, map) {
  var effectsAsString;
  var isEffectsTypeofString;

  if (!oj.StringUtils.isString(effects)) {
    isEffectsTypeofString = false;
    effectsAsString = JSON.stringify(effects);
  } else {
    isEffectsTypeofString = true;
    effectsAsString = effects + ''; // append "" to get around a closure compiler warning
  }

  var keys = Object.keys(map);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    effectsAsString = effectsAsString.replace(new RegExp(key, 'g'), map[key]);
  }

  var _effects = isEffectsTypeofString
    ? effectsAsString
    : /** @type {Object} */ (JSON.parse(effectsAsString));

  return _effects;
};

/**
 * Determine the animation for displaying new messaging content.
 * returns 'open' if the inline message is getting bigger with the new content
 * returns 'close' if the inline message is getting smaller with the new content
 * else returns 'noanimation' if the inline message size is the same
 *
 * @param {jQuery} rootElem - The root element for inline message.
 * @param {string} newContent - The new content to display.
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._determineAnimation = function (rootElem, newContent) {
  var action;
  var effect;
  var parsedEffect;
  var defaults = this._getDefaultAnimation();
  if (defaults) {
    var el = rootElem[0];
    var oldContent = el.innerHTML; // @HTMLUpdateOK
    var oldHeight = el.offsetHeight;
    var newHeight;

    el.innerHTML = newContent; // @HTMLUpdateOK
    newHeight = el.offsetHeight;
    el.innerHTML = oldContent; // @HTMLUpdateOK

    if (newHeight > oldHeight) {
      action = 'open';
    } else if (newHeight < oldHeight) {
      action = 'close';
    } else {
      action = 'noanimation';
    }

    if (action !== 'noanimation') {
      effect = defaults[action];
      // An example of effect is 'fadeIn' or 'expand',
      // and not all effects take oldHeight and newHeight
      if (effect) {
        parsedEffect = this._replaceAnimationOptions(effect, {
          '#oldHeight': oldHeight + 'px',
          '#newHeight': newHeight + 'px'
        });
      }
    }
  }

  return { action: action, effect: parsedEffect };
};

/**
 * Set busy state before opening or closing inline message.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._setBusyState = function () {
  // Set a page-level busy state if not already set
  if (!this._resolveBusyState) {
    var component = this.GetComponent();
    var jElem = component ? component.element : null;
    var domElem = jElem ? jElem[0] : null;
    var busyContext = Context.getContext(domElem).getBusyContext();
    var description = 'The page is waiting for inline message ';

    if (domElem && domElem.id) {
      description += 'for "' + domElem.id + '" ';
    }
    description += 'to open/close';

    this._resolveBusyState = busyContext.addBusyState({ description: description });
  }
};

/**
 * Clear busy state after opening or closing inline message.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._clearBusyState = function () {
  if (this._resolveBusyState) {
    this._resolveBusyState();
    this._resolveBusyState = null;
  }
};

/**
 * Queue up inline messaging open/close actions so that it only animate once
 * for multiple updates within the same tick.
 *
 * @param {string} contentToShow - The messaging content to show.
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._queueAction = function (contentToShow) {
  var self = this;
  var rootElem = this.$messagingContentRoot;

  // Return if we are animating. This flag is set right before we
  // start animating. When animation is done, it will call _queueAction
  // again with this._currentContentToShow. That way we only show the latest content.
  // Otherwise we may start a new animation or we may swap content
  //  while we are still animating a previous contentToShow.
  if (self._inInlineMessagingAnimation) {
    this._currentContentToShow = contentToShow;
    return;
  }
  this._currentContentToShow = null;
  this._setBusyState();

  // add styleclass as soon as we start animating open so that
  // if there are inline help-hints, they are hidden with the
  // oj-helphints.oj-has-messages {display:none} selector.
  if (contentToShow !== '') {
    this._addRemoveOjHasMessagesClass(contentToShow);
  }

  // If there is a pending timeout, clear it and set a new one so that only the
  // last animation queued within the same tick will be run.  Otherwise we will
  // end up with too many animation since the messaging framework keeps clearing
  // and updating the message display during validation, etc.
  if (this._timeoutId) {
    clearTimeout(this._timeoutId);
  }

  // JET-46567 - JAWS is reading out error message even after selecting correct value
  // allow a component to opt-in to receive notification before and after the timer fires
  // so that it can wait until after messages have been updated to finish processing,
  // for example to change focus after screen reader text has been updated
  var component = this.GetComponent();
  if (component && component._NotifyMessagingStrategyQueueAction) {
    if (!this._notifyQueueActionPromise) {
      var promiseResolve;
      this._notifyQueueActionPromise = new Promise(function (resolve) {
        promiseResolve = resolve;
      });
      this._notifyQueueActionPromiseResolve = function () {
        this._notifyQueueActionPromise = null;
        this._notifyQueueActionPromiseResolve = null;
        promiseResolve();
      }.bind(this);
    }
    component._NotifyMessagingStrategyQueueAction(this._notifyQueueActionPromise);
  }

  this._timeoutId = setTimeout(function () {
    self._timeoutId = null;

    // Make sure $messagingContentRoot is still there.  It could have been
    // removed by the time the timeout function is run.
    if (rootElem && rootElem[0]) {
      // Parse and substitute runtime values in animation options
      var actionEffect = self._determineAnimation(rootElem, contentToShow);
      // action 'close' means the message container is getting smaller
      // (may be a new, smaller message), if it is 'open' it is
      // getting larger. If it is 'noanimation' the size hasn't changed and
      // we don't animate in this case.
      var action = actionEffect.action;
      var effect = actionEffect.effect;

      if (action === 'noanimation') {
        rootElem[0].innerHTML = contentToShow; // @HTMLUpdateOK
        self._addRemoveOjHasMessagesClass(contentToShow);
        self._clearBusyState();

        if (self._notifyQueueActionPromiseResolve) {
          self._notifyQueueActionPromiseResolve();
        }
      } else {
        // aria-live polite is needed so a screen reader will read the inline message without the
        // user needing to set focus to the input field. aria-live: 'off' is needed before
        // content animates otherwise JAWS will re-read the message.
        // We think JAWS re-reads when the dom changes, even if that is with css.
        // This still doesn't work in Chrome because Chrome or JAWS on Chrome
        // seem to buffer the aria-live: polite and not read the aria-live: off.
        // The accessibility team agrees that because it works in
        // Firefox this is either a JAWS or Chrome bug, not a JET bug.
        if (action === 'close') {
          rootElem[0].setAttribute('aria-live', 'off');
        } else {
          rootElem[0].setAttribute('aria-live', 'polite');
        }

        // Set the new content first if we're opening.
        if (action === 'open') {
          rootElem[0].innerHTML = contentToShow; // @HTMLUpdateOK
        }
        // Invoke animation
        self._inInlineMessagingAnimation = true;
        startAnimation(
          rootElem[0],
          'inline-' + action,
          effect,
          self.GetComponent()
        ).then(function () {
          var afterAnimateContentToShow;
          self._inInlineMessagingAnimation = false;

          // Set the new content last if we're closing; in other words,
          // if we are closing we are animating
          // the old content before we switch in the new content, and to prevent a JAWS re-read,
          // we set aria-live to 'off' above. Now that we are done animating set it to
          // polite so JAWS will read the new message.
          if (action === 'close') {
            rootElem[0].setAttribute('aria-live', 'polite');
            rootElem[0].innerHTML = contentToShow; // @HTMLUpdateOK
          }
          // Clear busy state when animation ends. If _queueAction was called
          // while we were animating the previous _queueAction request,
          // we saved the _currentContentToShow and returned. Now go
          // ahead a call _queueAction with that new content now that the
          // animation from the previous contentToShow has ended.
          if (self._currentContentToShow !== null) {
            afterAnimateContentToShow = self._currentContentToShow;
            self._currentContentToShow = null;
            self._queueAction(afterAnimateContentToShow);
          } else {
            if (contentToShow === '') {
              self._addRemoveOjHasMessagesClass(contentToShow);
            }
            self._clearBusyState();

            if (self._notifyQueueActionPromiseResolve) {
              self._notifyQueueActionPromiseResolve();
            }
          }
        });
      }
    } else {
      // Just clear the busy state if $messagingContentRoot no longer exists
      self._addRemoveOjHasMessagesClass('');
      self._clearBusyState();

      if (self._notifyQueueActionPromiseResolve) {
        self._notifyQueueActionPromiseResolve();
      }
    }
  }, 0);
};

/**
 * Adds oj-has-messages styleclass if there is contentToShow otherwise
 * removes oj-has-messages and removes messaging dom.
 *  add/remove oj-has-messages on this._parentElement if it exists;
 * if the animation is opening, add 'oj-has-messages' right away.
 * if the animation is closing, then don't remove 'oj-has-messages' until the messages is
 * closed completely. The help-hints that are also inline only displays when 'oj-has-messages' is
 * not there. So if we remove oj-has-messages too fast, both will show at the same time.
 * This is why this is method called in the AnimationUtils.startAnimation callback.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._addRemoveOjHasMessagesClass = function (contentToShow) {
  if (this._parentElement) {
    if (contentToShow) {
      this._parentElement.classList.add('oj-has-messages');
    } else {
      this._parentElement.classList.remove('oj-has-messages');
      this._removeMessagingContentRootDom();
    }
  }
};

/**
 * If the inline message is already open its contents need to updated when update() or
 * reactivate() is called.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._updateInlineMessage = function () {
  var contentToShow;
  var domNode;

  // contentToShow will be "" (a falsey) if there are no messages to show.
  contentToShow = this._buildInlineHtml();

  // create the inline messaging dom if there is content to show and the dom hasn't been created.
  // We do not create the inline messaging dom until the first content is shown.
  var messagingRootExists = this._isMessagingContentRootDomInDocument();
  if (contentToShow && !messagingRootExists) {
    this._createInlineMessage();
  }

  if (this.$messagingContentRoot && this.$messagingContentRoot[0]) {
    // Only enable default animation for custom elements so that automated tests
    // for legacy components are not affected
    if (this.GetComponent()._IsCustomElement()) {
      // This may be called multiple times within the same event cycle because the
      // old message is cleared before validation and the message is
      // reconstructed.  Since we now have animation for inline message, we don't
      // want to update the DOM every single time.  Instead we queue up the
      // updates and will only show the last one within the same event cyle.
      this._queueAction(contentToShow);
    } else {
      // Legacy components don't have animation so just update the DOM
      // push new content into inline message dom
      domNode = this.$messagingContentRoot[0];

      // contentToShow includes content that may come from app. It is scrubbed for illegal tags
      // before setting to innerHTML
      domNode.innerHTML = contentToShow; // @HTMLUpdateOK
    }
  }
};

InlineMessagingStrategy.prototype._createInlineMessage = function () {
  var widget;

  this.$messagingContentRoot = $(this._getInlineContentHtml());
  this.AddAriaDescribedByForInlineMessaging(this.$messagingContentRoot[0]);
  this._addAriaLive(this.$messagingContentRoot);
  // append content that goes in inline messaging div

  if (this._parentElement) {
    this._parentElement.appendChild(this.$messagingContentRoot[0]); // @HTMLUpdateOK
  } else {
    // make it the very LAST child of the widget.
    widget = this.GetComponent().widget();
    widget[0].appendChild(this.$messagingContentRoot[0]); // @HTMLUpdateOK
  }
};

/**
 * Returns the dom for the messaging-inline-container.
 *
 * @return {string}
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._getInlineContentHtml = function () {
  return "<div class='oj-messaging-inline-container'></div>";
};

/**
 * Removes the messaging content root dom and anything else that was adding during the
 * creation of the messaging content root dom.
 *
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._removeMessagingContentRootDom = function () {
  var messagingRootExists = this._isMessagingContentRootDomInDocument();
  if (messagingRootExists) {
    this.RemoveAriaDescribedByForInlineMessaging(this.$messagingContentRoot[0]);
    let parentNode = this.$messagingContentRoot[0].parentNode;
    if (parentNode) {
      parentNode.removeChild(this.$messagingContentRoot[0]);
    }
  }
  this.$messagingContentRoot = null;
};

/**
 * aria-live: polite
 * This is needed so a screen reader will read the inline message without the user needing to
 * set focus to the input field.
 * @param {jQuery} messagingRoot
 * @memberof oj.InlineMessagingStrategy
 * @instance
 * @private
 */
InlineMessagingStrategy.prototype._addAriaLive = function (messagingRoot) {
  oj.Assert.assertPrototype(messagingRoot, $);
  messagingRoot[0].setAttribute('aria-live', 'polite');
};

/**
 * Returns the content to show inside the inline message html.
 * @return {string} content to show, else "". "" is a falsey.
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._buildInlineHtml = function () {
  var document;

  // For now anyway, ShowMessages is always true since the inlineMessaging case is for messaging.
  if (this.ShowMessages()) {
    document = this.GetComponent().document[0];
    // returns messages or "" if there are none
    return this._buildMessagesHtml(document);
  }
  return '';
};

/**
 * Returns the content to show inside messages (not hints)
 * @param {Document} document
 * @return {string} content if there are messages, else "". "" is a falsey.
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._buildMessagesHtml = function (document) {
  var content = '';
  var maxSeverity;
  var messages;
  var renderSeveritySelectors = true;

  if (this.HasMessages()) {
    messages = this.GetMessages();
    maxSeverity = this.GetMaxSeverity();
    content = PopupMessagingStrategyUtils.buildMessagesHtml(
      document,
      messages,
      maxSeverity,
      renderSeveritySelectors
    );
  }
  return content;
};

/**
 * Returns true if the inline messaging div exists. This is needed
 * because it is possible that components delete their dom, including
 * the inline message dom, which means the this.$messagingContentRoot is not
 * null.
 * @return {boolean} true if this.$messagingContentRoot exists in the dom
 * @private
 * @memberof oj.InlineMessagingStrategy
 * @instance
 */
InlineMessagingStrategy.prototype._isMessagingContentRootDomInDocument = function () {
  var messagingRootExistsInDocument = false;
  if (this.$messagingContentRoot) {
    let id = this.$messagingContentRoot[0].id;
    messagingRootExistsInDocument = document.getElementById(id);
  } else {
    return false;
  }
  return messagingRootExistsInDocument !== null;
};

/**
 * Adapter for handling inline Required text.
 * Extends the MessagingStrategy which does more now than messages.
 *
 * @extends {oj.MessagingStrategy}
 * @protected
 * @constructor
 * @since 9.0.0
 * @class InlineRequiredStrategy
 * @ignore
 * @ojtsignore
 * @param {Array.<string>} displayOptions an array of messaging artifacts that are
 * displayed as an inside label for text fields.
 * For LabelStrategies this is always only labelEdge.
 */
const InlineRequiredStrategy = function (displayOptions, parentElement) {
  this.Init(displayOptions);
  this._parentElement = parentElement;
};

/**
 * Registers the InlineRequiredStrategy constructor function with ComponentMessaging.
 * No need to register since we are not creating this strategy on from ComponentMessaging.
 * InlineUserAssistanceStrategy creates it.
 * @private
 */
// ComponentMessaging
//    .registerMessagingStrategy('required',
//     InlineRequiredStrategy);

// Subclass from MessagingStrategy
oj.Object.createSubclass(InlineRequiredStrategy, oj.MessagingStrategy, 'InlineRequiredStrategy');

/**
 * @param {Object} cm a reference to an instance of ComponentMessaging that provides access to
 * the latest messaging content.
 * @public
 * @memberof InlineRequiredStrategy
 * @instance
 * @override
 */
InlineRequiredStrategy.prototype.activate = function (cm) {
  InlineRequiredStrategy.superclass.activate.call(this, cm);
  if (this.containerRoot == null) {
    this._createOrUpdateInlineRequired();
  }
};

/**
 * @param {Array.<string>} newOptions
 * @public
 * @memberof InlineRequiredStrategy
 * @instance
 * @override
 */
InlineRequiredStrategy.prototype.reactivate = function (newOptions, parentElement) {
  InlineRequiredStrategy.superclass.reactivate.call(this, newOptions);
  this._parentElement = parentElement;
  // select/combobox on refresh destroys all its contents, including
  // the oj-required-inline-container, and then reactivate is called.
  var containerRootExists = this._isContainerRootDomInDocument();
  if (!containerRootExists) {
    this._createOrUpdateInlineRequired();
  }
};

/**
 * @param {Object=} content the messaging content object. If it contains hasNoValueToggled, then
 * this means the component's oj-has-no-value styleclass was toggled. And the Redwood UX Required
 * rule is, if the field has no value, show the inline Required dom. Else, do not show it.
 * @return {boolean}
 * @memberof InlineRequiredStrategy
 * @instance
 * @oublic
 * @override
 */
// eslint-disable-next-line no-unused-vars
InlineRequiredStrategy.prototype.shouldUpdate = function (content) {
  // This gets sent from EditableValue when oj-has-no-value styleclass
  // is toggled. This is how we know we need to add or remove the Required dom.
  if (content && 'hasNoValueToggled' in content) {
    return true;
  }
  // We are registering a requiredChanged listener that
  // will cause an update when the required prop changes, so that is why this returns false.
  return false;
};

/**
 * Updates component with instance using the content provided.
 * @memberof InlineRequiredStrategy
 * @instance
 * @public
 * @override
 */
InlineRequiredStrategy.prototype.update = function () {
  this._createOrUpdateInlineRequired();
  InlineRequiredStrategy.superclass.update.call(this);
};

/**
 * Cleans up dom on the component and removes any event listeners it created.
 * @memberof InlineRequiredStrategy
 * @instance
 * @public
 * @override
 */
InlineRequiredStrategy.prototype.deactivate = function () {
  this._removeInlineRequired();
  var component = this.GetComponent();
  var element = component._getRootElement();
  element.removeEventListener('requiredChanged', this._requiredChangedCallback);
  delete this._requiredChangedCallback;
  element.removeEventListener('focusout', this._focusoutCallback);
  delete this._focusoutCallback;
  this._parentElement = null;
  InlineRequiredStrategy.superclass.deactivate.call(this);
};

/**
 * @memberof InlineRequiredStrategy
 * @instance
 * @private
 */
InlineRequiredStrategy.prototype._createOrUpdateInlineRequired = function () {
  var component = this.GetComponent();

  const options = component.options;
  const element = component._getRootElement();

  const hasNoValue = element.classList.contains('oj-has-no-value');
  const container = this._getRequiredInlineContainer();
  if (options.required && hasNoValue && !container) {
    this.containerRoot = document.createElement('div');
    this.containerRoot.classList.add('oj-required-inline-container');
    let requiredText = getTranslatedString('oj-ojEditableValue.requiredText');
    this.containerRoot.textContent = requiredText;
    $(this.containerRoot).uniqueId();
    this._parentElement.appendChild(this.containerRoot);
    if (component._AriaRequiredUnsupported()) {
      this.AddDescribedByToElement(element, this.containerRoot.id);
    }
    // focusout will check if there is a value and if so remove required dom
    this._focusoutCallback = this._focusoutHandler.bind(this, component);
    element.addEventListener('focusout', this._focusoutCallback);
  }

  // if value was programmatically changed to have a value, will need to remove
  if (options.required && !hasNoValue && container) {
    this._removeInlineRequired();
  }

  if (!this._requiredChangedCallback) {
    // whether or not we create the required dom we need to add an event listener so if required attribute
    // changes on the component, we create the required dom.
    // if required changed, we will remove or add the required dom
    this._requiredChangedCallback = this._requiredChangedHandler.bind(this, component);
    element.addEventListener('requiredChanged', this._requiredChangedCallback);
  }
};

/**
 * Removes the Required dom. Keeps the associated event listeners
 * which respond to required property changes.
 * @memberof InlineRequiredStrategy
 * @instance
 * @private
 */
InlineRequiredStrategy.prototype._removeInlineRequired = function () {
  const component = this.GetComponent();
  let container = this._getRequiredInlineContainer();
  if (container && component._AriaRequiredUnsupported()) {
    this.RemoveDescribedByFromElement(component._getRootElement(), container.id);
  }
  if (container && this._parentElement) {
    this._parentElement.removeChild(container);
    this.containerRoot = null;
  }
};

/**
 * @memberof InlineRequiredStrategy
 * @instance
 * @private
 */
InlineRequiredStrategy.prototype._getRequiredInlineContainer = function () {
  return this._parentElement.querySelector('.oj-required-inline-container');
};

/**
 * This is where we delete the required dom if required changes from true to false.
 * Remove anything else we may have added, like aria-described by.
 * @memberof InlineRequiredStrategy
 * @instance
 * @private
 * @param {Component} the component
 * @param {CustomEvent} event requiredChanged event
 */
InlineRequiredStrategy.prototype._requiredChangedHandler = function (component, event) {
  let requiredOptionValue = event.detail.value;
  let container = this._getRequiredInlineContainer();
  const element = component._getRootElement();
  const hasNoValue = element.classList.contains('oj-has-no-value');
  if (requiredOptionValue && hasNoValue && container === null) {
    this._createOrUpdateInlineRequired();
  } else if (!requiredOptionValue && container !== null) {
    // not required
    // remove the dom if it is there
    this._removeInlineRequired();
  }
};

/**
 * Required text is shown on initial render if the field doesn't have a value.
 * When the user focuses out of the field, check if the comp is required
 * and the field has a value, and in that case, remove the inline required text (animate out first).
 * messages take precedence in the css.
 * @memberof InlineRequiredStrategy
 * @instance
 * @private
 * @param {Component} the component
 */
InlineRequiredStrategy.prototype._focusoutHandler = function (component) {
  const container = this._getRequiredInlineContainer();
  const element = component._getRootElement();
  const requiredOptionValue = component.options.required;

  const hasNoValue = element.classList.contains('oj-has-no-value');
  if (requiredOptionValue && !hasNoValue && container !== null) {
    // if we have required content, then animate it closed on focusout.
    let action = 'close';
    let defaults = this._getDefaultAnimation();
    let effect = defaults.close; // e.g., {effect: 'fadeOut', duration: '200ms'}
    this._setBusyState();
    let self = this;
    startAnimation(
      this.containerRoot,
      'inline-required-' + action,
      effect,
      this.GetComponent()
    ).then(() => {
      // As of v12.0.0 we are removing the dom
      this._removeInlineRequired();
      self._clearBusyState();
    });
  }
};

/**
 * Returns true if the div exists. This is needed
 * because it is possible that components delete their dom, including
 * the inline dom, which means the this.containerRoot is not
 * null.
 * @return {boolean} true if this.containerRoot exists in the dom
 * @private
 * @memberof InlineRequiredStrategy
 * @instance
 */
InlineRequiredStrategy.prototype._isContainerRootDomInDocument = function () {
  let containerRootExistsInDocument = false;
  if (this.containerRoot) {
    let id = this.containerRoot.id;
    containerRootExistsInDocument = document.getElementById(id);
  }
  return containerRootExistsInDocument !== null;
};

/**
 * Get the default animation.
 * To save from sending unnecessary theming variables to the client, we hardcode.
 * @private
 * @memberof InlineRequiredStrategy
 * @instance
 * @return {Object} Object with open and close key for the default animation.
 */
InlineRequiredStrategy.prototype._getDefaultAnimation = function () {
  // Load the default animation once per page scope
  if (!InlineRequiredStrategy._defaultAnimation) {
    InlineRequiredStrategy._defaultAnimation = {
      open: {
        effect: 'fadeIn',
        duration: '200ms',
        timingFunction: 'cubic-bezier(0.4,0,0.2,1)'
      },
      close: {
        effect: 'fadeOut',
        duration: '200ms',
        timingFunction: 'cubic-bezier(0.4,0,0.2,1)'
      }
    };
  }

  return InlineRequiredStrategy._defaultAnimation;
};

/**
 * Set busy state before opening or closing inline message.
 *
 * @private
 * @memberof InlineRequiredStrategy
 * @instance
 */
InlineRequiredStrategy.prototype._setBusyState = function () {
  // Set a page-level busy state if not already set
  if (!this._resolveBusyState) {
    let component = this.GetComponent();
    let domElem = component._getRootElement();
    let busyContext = Context.getContext(domElem).getBusyContext();
    let description = 'The page is waiting for inline required ';

    if (domElem && domElem.id) {
      description += 'for "' + domElem.id + '" ';
    }
    description += 'to open/close';

    this._resolveBusyState = busyContext.addBusyState({ description: description });
  }
};

/**
 * Clear busy state after opening or closing inline required.
 *
 * @private
 * @memberof InlineRequiredStrategy
 * @instance
 */
InlineRequiredStrategy.prototype._clearBusyState = function () {
  if (this._resolveBusyState) {
    this._resolveBusyState();
    this._resolveBusyState = null;
  }
};

/**
 * Redwood wants messages to always show up inline, nowhere else.
 * A user assistance strategy that places the user assistance content inline (underneath) the editableValue
 * component. This does not look at displayOptions, but passes it on to its contained strategies.
 * For example if display-options.validatorHint='none', we do not want to show it.
 * Note: This is confusing because displayOptions is what is displayed in each strategy.
 * But for Redwood we want displayOptions to be ['messages', 'validationHint', 'required', 'title']
 * @since 9.0.0
 * @constructor
 * @extends {oj.MessagingStrategy}
 * @private
 */
var InlineUserAssistanceStrategy = function (displayOptions) {
  this.Init(displayOptions);
  this._displayOptions = displayOptions;
};

/**
 * Registers the InlineUserAssistanceStrategy constructor function with ComponentMessaging.
 *
 * @private
 */
oj.ComponentMessaging.registerMessagingStrategy(
  oj.ComponentMessaging._STRATEGY_TYPE.USER_ASSISTANCE_INLINE,
  InlineUserAssistanceStrategy
);

// Subclass from MessagingStrategy
oj.Object.createSubclass(
  InlineUserAssistanceStrategy,
  oj.MessagingStrategy,
  'InlineUserAssistanceStrategy'
);

/**
 * Activate by writing an empty div and by activating the sub-strategies
 *
 * @param {Object} cm a reference to an instance of ComponentMessaging that provides access to
 * the latest messaging content.
 * @private
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @override
 *
 */
InlineUserAssistanceStrategy.prototype.activate = function (cm) {
  InlineUserAssistanceStrategy.superclass.activate.call(this, cm);

  this._componentMessaging = cm;
  const component = this.GetComponent();
  const options = component.options;
  const element = component._getRootElement();

  // set readonly and disabled event listeners
  this._readonlyChangedCallback = this._readonlyChangedHandler.bind(this, component);
  element.addEventListener('readonlyChanged', this._readonlyChangedCallback);
  this._disabledChangedCallback = this._disabledChangedHandler.bind(this, component);
  element.addEventListener('disabledChanged', this._disabledChangedCallback);

  // set userAssistanceDensity event listener to change styleclass
  this._userAssistanceDensityChangedCallback = this._userAssistanceDensityChangedHandler.bind(
    this,
    component
  );
  element.addEventListener(
    'userAssistanceDensityChanged',
    this._userAssistanceDensityChangedCallback
  );

  // create the user assistance dom. It is needed in readonly, disabled and enabled modes
  // so that in form layout mixed mode the fields all have this dom with a min-height
  // to keep the fields lined up.
  if (this.containerRoot == null) {
    this._createInlineContainer();
  }

  // Do not create any dom for sub-dom if readonly or disabled is true
  // since we do not want to show Required, Inline messages, nor help hints in
  // readonly or disabled modes.
  if (this._isDisabledOrReadonly()) {
    return;
  }

  this._activateContainerStrategies(cm, options);
};

/**
 * Reinitializes with the new display options and updates component messaging using the new content.
 * newDisplayOptions are the strategies for InlineUserAssistanceStrategy.
 * During Init we save the original displayOptions.
 *
 * @param {Array.<string>} newDisplayOptions
 * @private
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @override
 *
 */
InlineUserAssistanceStrategy.prototype.reactivate = function (newDisplayOptions) {
  InlineUserAssistanceStrategy.superclass.reactivate.call(this, newDisplayOptions);
  const options = this.GetComponent().options;
  if (this._isDisabledOrReadonly(options)) {
    return;
  }

  // select/combobox on refresh destroys all its contents, including
  // the inline containers, and then reactivate is called.
  var containerRootExists = this._isContainerRootDomInDocument();
  if (!containerRootExists) {
    this._createInlineContainer();
  }

  // if we have already activated our sub-strategies,
  // this._inlineMessagingStrategy will not be undefined
  if (this._inlineMessagingStrategy) {
    // delegate to contained strategies.
    this._inlineMessagingStrategy.reactivate(newDisplayOptions, this.containerRoot);
    if (this._inlineRequiredStrategy) {
      this._inlineRequiredStrategy.reactivate(newDisplayOptions, this.containerRoot);
    }
    if (this._inlineHelpHintsStrategy) {
      this._inlineHelpHintsStrategy.reactivate(newDisplayOptions, this.containerRoot);
    }
  } else {
    // we haven't activated the sub-strategies yet, so do it now.
    this._activateContainerStrategies(this._componentMessaging, options);
  }
};

/**
 * Returns true if the messaging content should update. This method is an
 * optimization because the update() method is called too often and any time any content changes.
 * The only time InlineUserAssistanceStrategy#update needs to execute is when the ComponentValidity
 * object is in the content because we don't add this unless there are messages.
 *
 * @param {Object=} content the messaging content object. If it contains validityState, then
 * this means the component has messaging content.
 * @return {boolean}
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @private
 * @override
 */
InlineUserAssistanceStrategy.prototype.shouldUpdate = function (content) {
  if (this._isDisabledOrReadonly()) {
    return false;
  }
  // return true and check in update per strategy we are delegating to.
  this._shouldUpdateContent = content;
  return true;
};

/**
 * Updates component with instance using the content provided.
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @private
 * @override
 */
InlineUserAssistanceStrategy.prototype.update = function () {
  InlineUserAssistanceStrategy.superclass.update.call(this);

  if (!this._inlineMessagingStrategy) {
    // if we haven't created the sub-strategies yet, return.
    return;
  }

  // if readonly or disabled, return
  if (this._isDisabledOrReadonly()) {
    return;
  }

  if (this._inlineMessagingStrategy.shouldUpdate(this._shouldUpdateContent)) {
    this._inlineMessagingStrategy.update();
  }
  if (
    this._inlineRequiredStrategy &&
    this._inlineRequiredStrategy.shouldUpdate(this._shouldUpdateContent)
  ) {
    this._inlineRequiredStrategy.update();
  }
  if (
    this._inlineHelpHintsStrategy &&
    this._inlineHelpHintsStrategy.shouldUpdate(this._shouldUpdateContent)
  ) {
    this._inlineHelpHintsStrategy.update();
  }
};

/**
 * Cleans up messages on the component and destroys any widgets it created.
 *
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @private
 * @override
 */
InlineUserAssistanceStrategy.prototype.deactivate = function () {
  this._inlineMessagingStrategy.deactivate();
  if (this._inlineRequiredStrategy) {
    this._inlineRequiredStrategy.deactivate();
  }
  if (this._inlineHelpHintsStrategy) {
    this._inlineHelpHintsStrategy.deactivate();
  }
  this._removeContainerRootDom();

  delete this._inlineMessagingStrategy;
  delete this._inlineRequiredStrategy;
  delete this._inlineHelpHintsStrategy;

  // Remove event handlers
  const component = this.GetComponent();
  const element = component._getRootElement();
  element.removeEventListener('readonlyChanged', this._readonlyChangedCallback);
  delete this._readonlyChangedCallback;
  element.removeEventListener('disabledChanged', this._disabledChangedCallback);
  delete this._disabledChangedCallback;
  element.removeEventListener(
    'userAssistanceDensityChanged',
    this._userAssistanceDensityChangedCallback
  );
  delete this._userAssistanceDensityChangedCallback;

  InlineUserAssistanceStrategy.superclass.deactivate.call(this);
};

InlineUserAssistanceStrategy.prototype._createInlineContainer = function () {
  this.containerRoot = document.createElement('div');
  this.containerRoot.classList.add('oj-user-assistance-inline-container');

  // this will be oj-efficient or oj-reflow and will be used in theming to
  // either reserve space with min-height or not reserve space.
  const component = this.GetComponent();
  const userAssistanceOptionValue = component.options.userAssistanceDensity;
  if (userAssistanceOptionValue === 'efficient') {
    this.containerRoot.classList.add('oj-efficient');
  } else if (userAssistanceOptionValue === 'reflow') {
    this.containerRoot.classList.add('oj-reflow');
  }

  $(this.containerRoot).uniqueId();

  // append content that goes in inline user assistance div
  // make it the very LAST child of the widget.
  component.widget()[0].appendChild(this.containerRoot); // @HTMLUpdateOK
};

/**
 * Removes the messaging content root dom and anything else that was adding during the
 * creation of the messaging content root dom.
 *
 * @private
 * @memberof InlineUserAssistanceStrategy
 * @instance
 */
InlineUserAssistanceStrategy.prototype._removeContainerRootDom = function () {
  if (this._isContainerRootDomInDocument()) {
    let parentNode = this.containerRoot.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.containerRoot);
    }
  }
  this.containerRoot = null;
};

/**
 * Returns true if the inline div exists. This is needed
 * because it is possible that components delete their dom, including
 * the inline dom, which means the this.containerRoot is not
 * null.
 * @return {boolean} true if this.containerRoot exists in the dom
 * @private
 * @memberof InlineUserAssistanceStrategy
 * @instance
 */
InlineUserAssistanceStrategy.prototype._isContainerRootDomInDocument = function () {
  var containerRootExistsInDocument = false;
  if (this.containerRoot) {
    let id = this.containerRoot.id;
    containerRootExistsInDocument = document.getElementById(id);
  }
  return containerRootExistsInDocument !== null;
};

/**
 * activate the Container Strategies if they have not already been activated.
 *
 * @private
 * @memberof InlineUserAssistanceStrategy
 * @instance
 */
InlineUserAssistanceStrategy.prototype._activateContainerStrategies = function (cm, options) {
  // instantiate and activate the strategy objects this strategy delegates to
  // we wait until this function to instantiate because we want to have the containerRoot
  // created, and we wait until activate to do that in our strategies.
  if (this._inlineMessagingStrategy === undefined) {
    this._inlineMessagingStrategy = new InlineMessagingStrategy(
      this._displayOptions,
      this.containerRoot
    );
    this._inlineMessagingStrategy.activate(cm);
  }

  // Set up the strategy if the component has a required attribute. It doesn't have to be
  // set to required, but it needs to have a required attribute in its api.
  if (options.required !== undefined && this._inlineRequiredStrategy === undefined) {
    this._inlineRequiredStrategy = new InlineRequiredStrategy(
      this._displayOptions,
      this.containerRoot
    );
    this._inlineRequiredStrategy.activate(cm);
  }
  if (this._inlineHelpHintsStrategy === undefined) {
    // setup InlineHelpHintsStrategy
    this._inlineHelpHintsStrategy = new InlineHelpHintsStrategy(
      this._displayOptions,
      this.containerRoot
    );
    this._inlineHelpHintsStrategy.activate(cm);
  }
};

/**
 * If user-assistance-density property is changed
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @private
 * @param {Component} the component
 * @param {CustomEvent} event readonlyChanged event
 */
InlineUserAssistanceStrategy.prototype._userAssistanceDensityChangedHandler = function (
  component,
  event
) {
  let userAssistanceOptionValue = event.detail.value;

  const _OJ_REFLOW = 'oj-reflow';
  const _OJ_EFFICIENT = 'oj-efficient';

  if (userAssistanceOptionValue === 'efficient') {
    this.containerRoot.classList.add(_OJ_EFFICIENT);
    this.containerRoot.classList.remove(_OJ_REFLOW);
  } else if (userAssistanceOptionValue === 'reflow') {
    this.containerRoot.classList.add(_OJ_REFLOW);
    this.containerRoot.classList.remove(_OJ_EFFICIENT);
  } else {
    this.containerRoot.classList.remove(_OJ_EFFICIENT);
    this.containerRoot.classList.remove(_OJ_REFLOW);
  }
};

/**
 * If readonly is true, then delete the user-assistance-display dom
 * and deactivate all the sub-strategies, otherwise activate them.
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @private
 * @param {Component} the component
 * @param {CustomEvent} event readonlyChanged event
 */
InlineUserAssistanceStrategy.prototype._readonlyChangedHandler = function (component, event) {
  let readonlyOptionValue = event.detail.value;

  if (readonlyOptionValue) {
    this._deactivateContainerStrategies();
  } else {
    const options = component.options;
    this._activateContainerStrategies(this._componentMessaging, options);
  }
};

/**
 * If disabled is true, then delete the user-assistance-display dom
 * and deactivate all the sub-strategies, otherwise activate them.
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @private
 * @param {Component} the component
 * @param {CustomEvent} event disabledChanged event
 */
InlineUserAssistanceStrategy.prototype._disabledChangedHandler = function (component, event) {
  let disabledOptionValue = event.detail.value;

  if (disabledOptionValue) {
    this._deactivateContainerStrategies();
  } else {
    const options = component.options;
    this._activateContainerStrategies(this._componentMessaging, options);
  }
};

/**
 * Deactivate all the sub-strategies.
 * @memberof InlineUserAssistanceStrategy
 * @instance
 * @private
 */
InlineUserAssistanceStrategy.prototype._deactivateContainerStrategies = function () {
  if (this._inlineMessagingStrategy) {
    this._inlineMessagingStrategy.deactivate();
  }
  if (this._inlineRequiredStrategy) {
    this._inlineRequiredStrategy.deactivate();
  }
  if (this._inlineHelpHintsStrategy) {
    this._inlineHelpHintsStrategy.deactivate();
  }

  delete this._inlineMessagingStrategy;
  delete this._inlineRequiredStrategy;
  delete this._inlineHelpHintsStrategy;
};

/**
 * If component readOnly or disabled.
 * @return {boolean}
 * @private
 * @memberof InlineUserAssistanceStrategy
 * @instance
 */
InlineUserAssistanceStrategy.prototype._isDisabledOrReadonly = function (
  options = this.GetComponent().options
) {
  var isDisabled = options.disabled || false;
  var isReadOnly = options.readOnly || false;

  return isDisabled || isReadOnly;
};

/**
 * Adapter for rendering fixed labels within the form component's root dom node as the first
 * child of the root dom element,
 * and smaller to match a text field's 'inside' label.
 * This is used for non-text-field components like
 * radioset/checkboxset/slider/switch/datepicker/colorpicker, etc.
 *
 * @extends BaseInsideLabelStrategy
 * @protected
 * @constructor
 * @since 8.0.0
 * @class InsideFormControlLabelStrategy
 * @ignore
 * @ojtsignore
 * @param {Array.<string>} options an array of messaging artifacts that are
 * displayed as an inside label for non-text field form controls.
 * For LabelStrategies this is always only labelEdge.
 */
const InsideFormControlLabelStrategy = function (options) {
  this.Init(options);
};

/**
 * Registers the LabelStrategy constructor function with ComponentMessaging.
 *
 * @private
 */
oj.ComponentMessaging.registerMessagingStrategy(
  oj.ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE_FORM_CNTRL,
  InsideFormControlLabelStrategy
);

// Subclass from BaseInsideLabelStrategy
oj.Object.createSubclass(
  InsideFormControlLabelStrategy,
  BaseInsideLabelStrategy,
  'InsideFormControlLabelStrategy'
);

/**
 * @param {Object} cm a reference to an instance of ComponentMessaging that provides access to
 * the latest messaging content.
 * @public
 * @memberof InsideFormControlLabelStrategy
 * @instance
 * @override
 */
InsideFormControlLabelStrategy.prototype.activate = function (cm) {
  InsideFormControlLabelStrategy.superclass.activate.call(this, cm);
  this._CreateLabel();
};

/**
 * @param {Array.<string>} newOptions
 * @public
 * @memberof InsideFormControlLabelStrategy
 * @instance
 * @override
 */
InsideFormControlLabelStrategy.prototype.reactivate = function (newOptions) {
  InsideFormControlLabelStrategy.superclass.reactivate.call(this, newOptions);
  this._DestroyLabel();
  this._CreateLabel();
};

/**
 * @param {Object=} content the messaging content object. If it contains validityState, then
 * this means the component has messaging content.
 * @return {boolean}
 * @memberof InsideFormControlLabelStrategy
 * @instance
 * @oublic
 * @override
 */
InsideFormControlLabelStrategy.prototype.shouldUpdate = function () {
  return false;
};

/**
 * Updates component with instance using the content provided.
 * @memberof InsideFormControlLabelStrategy
 * @instance
 * @public
 * @override
 */
InsideFormControlLabelStrategy.prototype.update = function () {
  InsideFormControlLabelStrategy.superclass.update.call(this);
};

/**
 * Cleans up messages on the component and destroys any widgets it created.
 * @memberof InsideFormControlLabelStrategy
 * @instance
 * @public
 * @override
 */
InsideFormControlLabelStrategy.prototype.deactivate = function () {
  this._DestroyLabel();
  InsideFormControlLabelStrategy.superclass.deactivate.call(this);
};

/**
 * Adds a hook for subclass to use its own styleclass on root dom element.
 * @memberof InsideFormControlLabelStrategy
 * @instance
 * @protected
 */
InsideFormControlLabelStrategy.prototype._GetFormControlLabelStyleClass = function () {
  return 'oj-form-control-label-inside';
};

/**
 * Insert the ojLabel
 * @memberof InsideFormControlLabelStrategy
 * @protected
 * @override
 * @param {Element} ojlabel
 * @param {Element} container
 * @param {Object} component
 * @return {string}
 */
InsideFormControlLabelStrategy.prototype._InsertOjLabel = function (
  ojlabel,
  _container,
  component
) {
  // node.insertBefore(newnode, existingnode);
  // insert the new ojlabel element as first child of the root
  let root = component._getRootElement();
  root.insertBefore(ojlabel, root.firstElementChild);
};

/**
 * Creates event handlers
 * Override to add helpHints.
 * @param {Element} span span around the label where we use innerText to set the labelHint
 * @param {Element} element root custom element
 * @param {Element} ojlabel ojlabel custom element
 * @param {Element} component form component
 * @memberof InsideFormControlLabelStrategy
 * @instance
 * @protected
 * @override
 */
InsideFormControlLabelStrategy.prototype._CreateEventHandlers = function (
  span,
  element,
  ojlabel,
  component
) {
  InsideFormControlLabelStrategy.superclass._CreateEventHandlers.call(
    this,
    span,
    element,
    ojlabel,
    component
  );
};

/**
 * @static
 * @private
 * @param {Element} span holding label text
 * @param {CustomEvent} event labelChanged event
 */
InsideFormControlLabelStrategy._labelHintChangedHandler = function (span, event) {
  // eslint-disable-next-line no-param-reassign
  span.textContent = event.detail.value;
};

/**
 * Adapter for handling dynamically setting the inputs placeholder attribute
 *
 * @extends {oj.MessagingStrategy}
 * @protected
 * @constructor
 * @since 8.0.0
 * @class oj.InsideLabelPlaceholderStrategy
 * @ignore
 * @ojtsignore
 * @param {Array.<string>} options an array of messaging artifacts displayed inline. e.g,
 */
const InsideLabelPlaceholderStrategy = function (options) {
  this.Init(options);
};

// Subclass from MessagingStrategy
oj.Object.createSubclass(
  InsideLabelPlaceholderStrategy,
  oj.MessagingStrategy,
  'oj.InsideLabelPlaceholderStrategy'
);

/**
 * Sets up a placeholder for the component instance using the converter hint.
 *
 * @param {Object} cm a reference to an instance of ComponentMessaging that provides access to
 * the latest messaging content.
 * @public
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @instance
 * @override
 */
InsideLabelPlaceholderStrategy.prototype.activate = function (cm) {
  InsideLabelPlaceholderStrategy.superclass.activate.call(this, cm);
  this._createPlaceholderToggle();
};

/**
 * @param {Array.<string>} newOptions
 * @public
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @instance
 * @override
 */
InsideLabelPlaceholderStrategy.prototype.reactivate = function (newOptions) {
  InsideLabelPlaceholderStrategy.superclass.reactivate.call(this, newOptions);
  this._destroyPlaceholderToggle();
  this._createPlaceholderToggle();
};

/**
 * @public
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @instance
 * @override
 */
InsideLabelPlaceholderStrategy.prototype.deactivate = function () {
  this._destroyPlaceholderToggle();
  InsideLabelPlaceholderStrategy.superclass.deactivate.call(this);
};

/**
 *
 * @param {Object=} content the messaging content that is being updated
 * @return {boolean}
 * @public
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @instance
 * @override
 */
InsideLabelPlaceholderStrategy.prototype.shouldUpdate = function (content) {
  return (
    (content && content.converterHint !== undefined) || this.GetComponent().options.placeholder
  );
};

/**
 * @public
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @instance
 * @override
 */
InsideLabelPlaceholderStrategy.prototype.update = function () {
  InsideLabelPlaceholderStrategy.superclass.update.call(this);
  this._placeholderChanged();
};

/**
 * @private
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @instance
 */
InsideLabelPlaceholderStrategy.prototype._destroyPlaceholderToggle = function () {
  var component = this.GetComponent();
  var element = component._GetContentElement()[0];
  var rootElement = component._getRootElement();

  this._blurCallback();
  element.removeEventListener('focusout', this._blurCallback, false);
  delete this._blurCallback;

  element.removeEventListener('focusin', this._focusCallback, false);
  delete this._focusCallback;

  rootElement.removeEventListener('placeholderChanged', this._placeholderChangedCallback, false);
  delete this._placeholderChangedCallback;

  if (component._HasPlaceholderSet()) {
    component._SetPlaceholder(component.options.placeholder);
    component._customPlaceholderSet = true;
  }
};

/**
 * @private
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @instance
 */
InsideLabelPlaceholderStrategy.prototype._createPlaceholderToggle = function () {
  var component = this.GetComponent();
  var element = component._GetContentElement()[0];
  var rootElement = component._getRootElement();

  component._customPlaceholderSet = true;
  this._blurCallback = InsideLabelPlaceholderStrategy._blurHandler.bind(this, element);
  element.addEventListener('focusout', this._blurCallback, false);

  this._focusCallback = InsideLabelPlaceholderStrategy._focusHandler.bind(this);
  element.addEventListener('focusin', this._focusCallback, false);

  this._placeholderChangedCallback = this._placeholderChanged.bind(this);
  rootElement.addEventListener('placeholderChanged', this._placeholderChangedCallback, false);

  this._placeholderChanged();
};

/**
 * @private
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @instance
 */
InsideLabelPlaceholderStrategy.prototype._placeholderChanged = function () {
  var component = this.GetComponent();
  var element = component._GetContentElement()[0];

  var callback;
  if (FocusUtils.containsFocus(element)) {
    callback = this._focusCallback;
  } else {
    callback = this._blurCallback;
  }
  // Allow the component to complete default processing. setPlaceholder will
  // following after the value changed from _AfterSetOption - invoke micro next-tick.
  Promise.resolve(true).then(function () {
    callback();
  });
};

/**
 * Returns true if the converter hint should be shown in the placeholder area.
 * If displayOptions are to be ignored, like in Redwood theme, then this returns false.
 * If displayOptions.converter-hint is 'none', then this returns false;
 * @public
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @param {Object} component
 * @return {boolean}
 * @static
 */
InsideLabelPlaceholderStrategy.ShowConverterHintAsPlaceholder = function (component) {
  var displayOptions = component.options.displayOptions;
  if (!displayOptions || component._getResolvedUserAssistance() !== 'displayOptions') {
    return false;
  }
  var converterHint = displayOptions.converterHint;
  if (converterHint instanceof Array) {
    return converterHint[0] === 'placeholder';
  }
  return converterHint === 'placeholder';
};

/**
 * @private
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @static
 */
InsideLabelPlaceholderStrategy._focusHandler = function () {
  var component = this.GetComponent();

  var placeholder;
  if (InsideLabelPlaceholderStrategy.ShowConverterHintAsPlaceholder(component)) {
    var hints = this.GetConverterHint();
    placeholder = hints.length > 0 ? hints[0] : null;
  }
  if (!placeholder) {
    placeholder = component.options.placeholder;
  }

  component._SetPlaceholder(placeholder);
};

/**
 * @private
 * @memberof oj.InsideLabelPlaceholderStrategy
 * @static
 */
InsideLabelPlaceholderStrategy._blurHandler = function (element) {
  if (element.hasAttribute('aria-haspopup')) {
    // ignore blur handling if the component has a popup and the popup has focus
    var popupId = element.getAttribute('aria-owns');
    var popupDom = document.getElementById(popupId);
    if (FocusUtils.containsFocus(popupDom)) {
      return;
    }
  }

  var placeholder;
  var component = this.GetComponent();
  if (InsideLabelPlaceholderStrategy.ShowConverterHintAsPlaceholder(component)) {
    var hints = this.GetConverterHint();
    placeholder = hints.length > 0 ? hints[0] : null;
  }
  if (!placeholder) {
    placeholder = component.options.placeholder;
  }

  // if the component legally has a placeholder we cant set it to null.
  // if we do that, select components will choke. Because they rely on placeholder
  // to decide if it should render a empty option etc.
  // So if there is a legal placeholder, we will just set its value to empty on blur.
  if (placeholder === null || placeholder === undefined) {
    component._SetPlaceholder(null);
  } else {
    component._SetPlaceholder('');
  }
};

/**
 * Adapter for handling aspects of floating labels.
 * Extends the MessagingStrategy which does more now than messages. It now
 * is also for rendering the form component's label in one of many positions.
 *
 * @extends BaseInsideLabelStrategy
 * @protected
 * @constructor
 * @since 7.0.0
 * @class oj.InsideLabelStrategy
 * @ignore
 * @ojtsignore
 * @param {Array.<string>} displayOptions an array of messaging artifacts that are
 * displayed as an inside label for text fields.
 * For LabelStrategies this is always only labelEdge.
 */
const InsideLabelStrategy = function (displayOptions) {
  this.Init(displayOptions);
  this._displayOptions = displayOptions;
};

/**
 * Registers the LabelStrategy constructor function with ComponentMessaging.
 *
 * @private
 */
oj.ComponentMessaging.registerMessagingStrategy(
  oj.ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE,
  InsideLabelStrategy
);

// Subclass from BaseInsideLabelStrategy
oj.Object.createSubclass(InsideLabelStrategy, BaseInsideLabelStrategy, 'oj.InsideLabelStrategy');

/**
 * @param {Object} cm a reference to an instance of ComponentMessaging that provides access to
 * the latest messaging content.
 * @public
 * @memberof oj.InsideLabelStrategy
 * @instance
 * @override
 */
InsideLabelStrategy.prototype.activate = function (cm) {
  InsideLabelStrategy.superclass.activate.call(this, cm);
  this._componentMessaging = cm;

  const component = this.GetComponent();
  const element = component._getRootElement();
  this._placeholderChangedCallback = this._placeholderChangedHandler.bind(this);
  element.addEventListener('placeholderChanged', this._placeholderChangedCallback);
  this._activatePlaceholderStrategyIfNeeded(cm);
  this._CreateLabel();
};

/**
 * @param {Array.<string>} newOptions
 * @public
 * @memberof oj.InsideLabelStrategy
 * @instance
 * @override
 */
InsideLabelStrategy.prototype.reactivate = function (newDisplayOptions) {
  InsideLabelStrategy.superclass.reactivate.call(this, newDisplayOptions);

  this._DestroyLabel();
  this._CreateLabel();
  if (this._placeholderStrategy) {
    this._placeholderStrategy.reactivate(newDisplayOptions);
  } else {
    // we haven't activated the placeholder yet, so do it now.
    this._activatePlaceholderStrategyIfNeeded(this._componentMessaging);
  }
};

/**
 * @param {Object=} content the messaging content object. If it contains validityState, then
 * this means the component has messaging content.
 * @return {boolean}
 * @memberof oj.InsideLabelStrategy
 * @instance
 * @oublic
 * @override
 */
InsideLabelStrategy.prototype.shouldUpdate = function (content) {
  if (this._placeholderStrategy) {
    return this._placeholderStrategy.shouldUpdate(content);
  }
  return false;
};

/**
 * Updates component with instance using the content provided.
 * @memberof oj.InsideLabelStrategy
 * @instance
 * @public
 * @override
 */
InsideLabelStrategy.prototype.update = function () {
  if (this._placeholderStrategy) {
    this._placeholderStrategy.update();
  }
};

/**
 * Cleans up messages on the component and destroys any widgets it created.
 * @memberof oj.InsideLabelStrategy
 * @instance
 * @public
 * @override
 */
InsideLabelStrategy.prototype.deactivate = function () {
  if (this._placeholderStrategy) {
    this._placeholderStrategy.deactivate();
    delete this._placeholderStrategy;
  }
  // Remove event handlers
  const component = this.GetComponent();
  const element = component._getRootElement();
  element.removeEventListener('placeholderChanged', this._placeholderChangedCallback);
  delete this._placeholderChangedCallback;
  this._DestroyLabel();
  InsideLabelStrategy.superclass.deactivate.call(this);
};

/**
 * activate the PlaceholderStrategy if they have not already been activated.
 *
 * @private
 * @memberof oj.InsideLabelStrategy
 * @instance
 */
InsideLabelStrategy.prototype._activatePlaceholderStrategyIfNeeded = function (cm) {
  if (this._placeholderStrategy === undefined) {
    let createInsideLabelPlaceholderStrategy = () => {
      let Callback = InsideLabelPlaceholderStrategy;
      this._placeholderStrategy = new Callback(this._displayOptions);
      this._placeholderStrategy.activate(cm);
    };
    const component = this.GetComponent();
    const compOptions = component.options;
    // If the component has a placeholder or if it uses displayOptions+
    // has it set so that converter is shown as a placeholder.
    // Note: the Redwood theme does not use displayOptions.
    let needsInsidePlaceholder =
      compOptions.placeholder ||
      (component._getResolvedUserAssistance() === 'displayOptions' &&
        InsideLabelPlaceholderStrategy.ShowConverterHintAsPlaceholder(component));
    if (needsInsidePlaceholder) {
      createInsideLabelPlaceholderStrategy();
    }
  }
};

/**
 * If placeholder has a value, then activate the sub-strategy if it isn't
 * yet activated.
 * @memberof oj.InsideLabelStrategy
 * @instance
 * @private
 */
InsideLabelStrategy.prototype._placeholderChangedHandler = function () {
  this._activatePlaceholderStrategyIfNeeded(this._componentMessaging);
};

/**
 * Gets the form component's container.
 * @memberof oj.InsideLabelStrategy
 * @instance
 * @protected
 * @override
 */
InsideLabelStrategy.prototype._GetContainer = function (component) {
  let container = component._GetFormControlContainer();
  if (!container) {
    return null;
  }

  // look for a component container override
  let fname = '_GetContentWrapper';
  if (component[fname]) {
    container = component[fname]();
  }
  return container;
};
/**
 * @memberof oj.InsideLabelStrategy
 * @protected
 * @override
 * @param {string} labelEdgeValue
 * @return {string}
 */
InsideLabelStrategy.prototype._GetFormControlLabelStyleClass = function () {
  let labelEdgeValue = 'inside';
  return [InsideLabelStrategy._BASE_STYLE_CLASS, 'label', labelEdgeValue.toLowerCase()].join('-');
};

/**
 * @memberof oj.InsideLabelStrategy
 * @protected
 * @override
 * @param {Element} ojlabel
 * @param {Element} container
 * @param {Object} component
 * @return {string}
 */
// eslint-disable-next-line no-unused-vars
InsideLabelStrategy.prototype._InsertOjLabel = function (ojlabel, container) {
  // node.insertBefore(newnode, existingnode);
  // insert the new ojlabel element before the existing firstChildElement.
  container.insertBefore(ojlabel, container.firstElementChild);
};

/**
 * Base selector (prefix) for styling floating labels
 * @const
 * @private
 * @type {string}
 */
InsideLabelStrategy._BASE_STYLE_CLASS = 'oj-text-field';

export { EditableValueUtils };
