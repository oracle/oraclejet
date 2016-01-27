/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery'], function(oj, $)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a message object 
 * .
 * @param {string} summary - Localized summary message text
 * @param {string} detail - Localized detail message text 
 * @param {number|string=} severity - An optional severity for this message. Use constants 
 * oj.Message.SEVERITY_LEVEL for number types and oj.Message.SEVERITY_TYPE for string types. Default 
 * is SEVERITY_ERROR if no severity is specified
 * @constructor
 * @export
 * @since 0.6
 */
oj.Message = function(summary, detail, severity)
{
  this.Init(summary, detail, severity);
};

/**
 * Indicates the type of severity that the message represents. 
 * @enum {string}
 * @export 
 */
oj.Message.SEVERITY_TYPE = {
  /**
   * Indicates a confirmation that an operation or task was completed. This is the lowest severity 
   * level.
   */
  'CONFIRMATION': 'confirmation',

  /**
   * Indicates information or operation messages. This has a lower severity level than warning.
   */
  'INFO':'info',

  /**
   * Indicates an application condition or situation that might require users' attention. This has a 
   * lower severity than error.
   */
  'WARNING': 'warning',

  /**
   * Used when data inaccuracies occur when completing a field and that needs fixing before user can 
   * continue. This has a lower severity level than fatal.
   * fatal.
   */
  'ERROR': 'error',

  /**
   * Used when a critical application error or an unknown failure occurs. This is the highest 
   * severity level. 
   * @const
   * @export 
   */
  'FATAL': 'fatal'
};


/**
 * Message severity level
 * @enum {number}
 * @export
 */
oj.Message.SEVERITY_LEVEL = {
  'FATAL' : 5,
  'ERROR' : 4,
  'WARNING' : 3,
  'INFO' : 2,
  'CONFIRMATION' : 1
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.Message, oj.Object, "oj.Message");

/**
 * Localized summary text.
 * 
 * @member
 * @name summary
 * @memberof oj.Message
 * @instance
 * @type {string}
 * @default <code class="prettyprint">""</code>
 */

/**
 * Localized detail text.
 * 
 * @member
 * @name detail
 * @memberof oj.Message
 * @instance
 * @type {string}
 * @default <code class="prettyprint">""</code>
 */

/**
 * Severity type of message. See oj.Message.SEVERITY_TYPE.
 * 
 * @member
 * @name severity
 * @memberof oj.Message
 * @instance
 * @type {string}
 * @default <code class="prettyprint">oj.Message.SEVERITY_TYPE.ERROR</code>
 */

/**
 * Initializes Message instance with the set options
 * @param {string} summary a localized summary message text
 * @param {string} detail a localized detail message text 
 * @param {number|string=} severity - An optional severity for this message.  Use constants 
 * oj.Message.SEVERITY_LEVEL for number types and oj.Message.SEVERITY_TYPE for string types.
 *                   
 * @export
 */
oj.Message.prototype.Init = function(summary, detail, severity) 
{
  oj.Message.superclass.Init.call(this);
  this['summary'] = summary;
  this['detail'] = detail;
  this['severity'] = severity || oj.Message.SEVERITY_TYPE.ERROR; // defaults to ERROR
};

/**
 * Whether a message can display on the UI. 
 * 
 * @memberof! oj.Message
 * @returns {boolean} always returns true; 
 * @instance
 * @protected 
 * @since 0.7
 */
oj.Message.prototype.canDisplay = function ()
{
  return true;
};

/**
 * Indicates whether some other oj.Message instance - msg,  is "equal to" this one.
 * Method is equivalent to java ".equals()" method.
 * 
 * @param {Object} msg 
 * @memberof oj.Message
 * @export
 */
oj.Message.prototype.equals = function (msg)
{
  if (msg)
  {
    if ((oj.Message.getSeverityLevel(this['severity']) === 
            oj.Message.getSeverityLevel(msg['severity'])) && 
        this['summary'] === msg['summary'] && 
        this['detail'] === msg['detail'])
    {
      return true;
    }
  }
  
  return false;
};

/**
 * Returns an Object that is a clone of this message. 
 * 
 * @return {Object} instance of oj.Message
 * @export
 * @memberof oj.Message
 * @since 0.7
 */
oj.Message.prototype.clone = function ()
{
  return new oj.Message(this['summary'], this['detail'], this['severity']);
};

/**
 * A convenience method that returns the severity level when given either a severity level of type 
 * number or a severity type of string. 
 * If severity level is not provided or is not valid this returns a severity error.
 * @param {string|number|undefined} severity 
 * @return {number}
 * @export
 */
oj.Message.getSeverityLevel = function (severity)
{
  var index;
  if (severity)
  {
    if (typeof severity === "string")
    {
      index = oj.Message._LEVEL_TO_TYPE.indexOf(severity, 1);
      if (index === -1)
      {
        severity = oj.Message.SEVERITY_LEVEL['ERROR'];
      }
      else
      {
        severity = index;
      }
    }
    else if (typeof severity === "number" && (severity < oj.Message.SEVERITY_LEVEL['CONFIRMATION'] && 
          severity > oj.Message.SEVERITY_LEVEL['FATAL']))
    {
      severity = oj.Message.SEVERITY_LEVEL['ERROR'];
    }
  }
  
  return !severity ? oj.Message.SEVERITY_LEVEL['ERROR'] : severity;
};

/**
 * A convenience method that returns the severity type when given either a severity level of type 
 * number or a severity type of string. 
 * If severity level is not provided or is not valid this return a severity error.
 * @param {string|number|undefined} level 
 * @return {string}
 * @export
 */
oj.Message.getSeverityType = function (level) 
{
  var index;
  if (level)
  {
    if (typeof level === "string")
    {
      index = oj.Message._LEVEL_TO_TYPE.indexOf(level, 1);
      if (index === -1)
      {
        // when given an unrecognized type return "error"
        level = oj.Message.SEVERITY_TYPE['ERROR'];
      }
    }
    else if (typeof level === "number")
    {
      if (level < oj.Message.SEVERITY_LEVEL['CONFIRMATION'] && 
          level > oj.Message.SEVERITY_LEVEL['FATAL'])
      {
        level = oj.Message.SEVERITY_TYPE['ERROR'];
      }
      else
      {
        level = oj.Message._LEVEL_TO_TYPE[level];
      }
    }
  }
  return level || oj.Message.SEVERITY_TYPE['ERROR'];
};

/**
 * Returns the max severity level in a array of message objects. 
 * 
 * @param {Array} messages an array of message instances
 * @returns {number} -1 if none can be determined; otherwise a severity level as defined by 
 * oj.Message.SEVERITY_LEVEL.
 * @export
 */
oj.Message.getMaxSeverity = function (messages)
{
  var maxLevel = -1, currLevel, message, i;
  if (messages && messages.length > 0)
  {
    $.each(messages, function (i, message)
      {
        if (message)
        {
          currLevel = oj.Message.getSeverityLevel(message['severity']);
        }
        maxLevel = maxLevel < currLevel ? currLevel : maxLevel;
      });
    
  }
  
  return maxLevel;
};

/**
 * Returns false if messages are of severity error or greater.
 * 
 * @param {Array} messages an array of message instances
 * @returns {boolean} true if none of the messages are of severity error or greater. false otherwise
 * @export
 */
oj.Message.isValid = function (messages)
{
  var maxSeverity = oj.Message.getMaxSeverity(messages);
  if (maxSeverity >= oj.Message.SEVERITY_LEVEL.ERROR)
  {
    return false;
  }
  
  return true;
};

/**
 * @private
 * @type Array
 */
oj.Message._LEVEL_TO_TYPE = ['none', // this can never be set
                             oj.Message.SEVERITY_TYPE['CONFIRMATION'], 
                             oj.Message.SEVERITY_TYPE['INFO'],
                             oj.Message.SEVERITY_TYPE['WARNING'],
                             oj.Message.SEVERITY_TYPE['ERROR'],
                             oj.Message.SEVERITY_TYPE['FATAL']];

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Extends oj.Message to represent a component specific message, this defines options that control 
 * how the message will display.
 * 
 * @param {string} summary - Localized summary message text
 * @param {string} detail - Localized detail message text 
 * @param {number|string} severity - An optional severity for this message. Use constants 
 * oj.Message.SEVERITY_LEVEL for number types and oj.Message.SEVERITY_TYPE for string types. Default 
 * is SEVERITY_ERROR if no severity is specified
 * @param {Object} options - an Object literal that defines the following properties
 * @property {string} display - whether the message needs to be displayed immediately or not. 
 * Accepted values are 'immediate', 'deferred'. The default is 'immediate'.
 * @property {string} context - the context the component was in when the validation messages was 
 * added.<p>
 * 
 * NOTE: messages added to the component directly by applications are unknown context and always 
 * shown {display: 'immediate', context: ''}. </p>
 * @private
 * @constructor
 * @since 0.7
 */
oj.ComponentMessage = function (summary, detail, severity, options) 
{
  this.Init(summary, detail, severity, options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.ComponentMessage, oj.Message, "oj.ComponentMessage");

/**
 * Determines whether the message is displayed immediately or not. Deferred messages are not shown 
 * to the user right away but are deferred until component explicitly does. See 
 * {@link oj.editableValue#showMessages}.
 * @private
 * @const
 * @type {Object}
 */
oj.ComponentMessage.DISPLAY = {SHOWN: 'shown', HIDDEN: 'hidden'};

/**
 * The default display options to use when none set.
 * 
 * @type {Object}
 * @private
 */
oj.ComponentMessage._DEFAULT_OPTIONS = {
  'display': oj.ComponentMessage.DISPLAY.SHOWN, 
  'context' : ''};

/**
 * Initializes the strategy based on the display options that specify the messaging artifacts that 
 * will be displayed by this strategy.
 * 
 * @param {string} summary - Localized summary message text
 * @param {string} detail - Localized detail message text 
 * @param {number|string} severity - An optional severity for this message. Use constants 
 * oj.Message.SEVERITY_LEVEL for number types and oj.Message.SEVERITY_TYPE for string types. Default 
 * is SEVERITY_ERROR if no severity is specified
 * @param {Object} options - an Object literal that defines the following properties
 * @memberof! oj.ComponentMessage
 * @instance
 * @protected
 * @ignore
 */
oj.ComponentMessage.prototype.Init = function (summary, detail, severity, options)
{
  oj.ComponentMessage.superclass.Init.call(this, summary, detail, severity);
  
  this._options = $.extend({}, oj.ComponentMessage._DEFAULT_OPTIONS, options);
};
  
/**
 * Indicates whether some other oj.Message instance - msg,  is "equal to" this one.
 * Method is equivalent to java ".equals()" method.
 * 
 * @param {Object} msg 
 * @memberof! oj.ComponentMessage
 * @instance
 * @protected
 * @ignore
 */
oj.ComponentMessage.prototype.equals = function (msg)
{
  var result = oj.ComponentMessage.superclass.equals.call(this, msg);

  // we don;t care what context the messages was added in, as long as they are the same display type
  return result && (this._options['display'] === msg._options['display']);
};

/**
 * Clones this and returns the new instance.
 * 
 * @memberof! oj.ComponentMessage
 * @instance
 * @protected
 * @ignore
 * @returns {Object} 
 */
oj.ComponentMessage.prototype.clone = function ()
{
  return new oj.ComponentMessage(this['summary'], this['detail'], this['severity'], this._options);
};

/**
 * Whether a message can display on the UI.
 * 
 * @memberof! oj.ComponentMessage
 * @returns {boolean} true if messages can be displayed; false if marked as deferred by component.
 * @instance
 * @protected 
 * @ignore
 */
oj.ComponentMessage.prototype.canDisplay = function ()
{
  return !(this._options && this._options['display'] ? 
            this._options['display'] === oj.ComponentMessage.DISPLAY.HIDDEN : false);
};

/**
 * 
 * Called by framework when the message needs to be shown
 * 
 * @returns {boolean} true if shown; false if message display was already shown
 * 
 * @memberof! oj.ComponentMessage
 * @instance
 * @private
 */
oj.ComponentMessage.prototype._forceDisplayToShown = function ()
{
  if (this._options && oj.ComponentMessage.DISPLAY.HIDDEN === this._options['display'])
  {
    this._options['display'] = oj.ComponentMessage.DISPLAY.SHOWN;
    return true;
  }
  
  return false;
};

/**
 * Called by framework to determine if message was added by component versus app.
 * 
 * @returns {boolean} true if messages was added by component. Usually the context is set.
 * 
 * @memberof! oj.ComponentMessage
 * @instance
 * @private
 */
oj.ComponentMessage.prototype._isMessageAddedByComponent = function ()
{
  if (this._options && this._options['context'])
  {
    return true;
  }
  
  return false;
};
});
