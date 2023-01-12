/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'jqueryui-amd/widget', 'jqueryui-amd/unique-id', 'jqueryui-amd/keycode', 'jqueryui-amd/focusable', 'jqueryui-amd/tabbable', 'ojs/ojcore', 'jquery', 'ojs/ojmessaging', 'ojs/ojmetadatautils', 'ojs/ojcore-base', 'ojs/ojdomutils', 'ojs/ojcustomelement', 'ojs/ojcustomelement-utils', 'ojs/ojlogger', 'ojs/ojdefaultsutils', 'ojs/ojtranslation', 'ojs/ojfocusutils', 'ojs/ojgestureutils'], function (exports, widget, uniqueId, keycode, focusable, tabbable, oj, $, Message, MetadataUtils, oj$1, DomUtils, ojcustomelement, ojcustomelementUtils, Logger, ojdefaultsutils, Translations, ojfocusutils, GestureUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Message = Message && Object.prototype.hasOwnProperty.call(Message, 'default') ? Message['default'] : Message;
  oj$1 = oj$1 && Object.prototype.hasOwnProperty.call(oj$1, 'default') ? oj$1['default'] : oj$1;

  /**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */

  /* jslint browser: true,devel:true*/
  /**
   * Utilities for getting DataProvider features.
   * @ignore
   */

  // end of jsdoc

  /**
   * This picks a strategy for where to put each piece of information
   * that is on a component. It started out being messaging pieces: like
   * placeholder, converter hints, validator hints, error messages. In v8.0
   * we added labelEdge which could be top or inside the text field or inside
   * a non-text-field (like a radioset).
   * @param {Object} component instance
   * @protected
   * @constructor
   * @since 0.6.0
   * @ignore
   */
  const ComponentMessaging = function (component) {
    this.Init(component);
  };

  // Subclass from oj.Object
  oj.Object.createSubclass(ComponentMessaging, oj.Object, 'oj.ComponentMessaging');
  oj._registerLegacyNamespaceProp('ComponentMessaging', ComponentMessaging);

  /**
   * Default strategy types supported for component messaging.
   * Think of these as places in the dom you want things.
   * Labels are the only things you put into the 'label-edge' positions,
   * so you will have only one of these at a time.
   * @memberof! oj.ComponentMessaging
   * @const
   * @protected
   * @ignore
   */
  ComponentMessaging._STRATEGY_TYPE = {
    NONE: 'none',
    NOTEWINDOW: 'notewindow',
    PLACEHOLDER: 'placeholder',
    INLINE: 'inline',
    LABEL_EDGE_INSIDE: 'inside',
    LABEL_EDGE_INSIDE_FORM_CNTRL: 'insideformcontrol',
    USER_ASSISTANCE_INLINE: 'userassistanceinline'
  };

  /**
   * Tracks the messaging strategy callback function by type, used to instantiate messaging strategies.
   * Implementations register by type.
   * @memberof! oj.ComponentMessaging
   * @const
   * @protected
   * @ignore
   */
  ComponentMessaging._STRATEGY_TYPE_TO_CALLBACK = {};

  /**
   * @private
   */
  const _DESCBY = 'aria-describedby';

  /**
   * Stores the constructor function callback object used to constuct a strategy object for the
   * specified type.
   *
   * @param {string} type
   * @param {Function} strategyConstructorCallback a constructor callback that can be used to constuct
   * a strategy object for the specified type
   * @ignore
   */
  ComponentMessaging.registerMessagingStrategy = function (type, strategyConstructorCallback) {
    if (type && typeof strategyConstructorCallback === 'function') {
      ComponentMessaging._STRATEGY_TYPE_TO_CALLBACK[type] = strategyConstructorCallback;
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
  ComponentMessaging.prototype.Init = function (component) {
    ComponentMessaging.superclass.Init.call(this);

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
  ComponentMessaging.prototype.activate = function (launcher, contentElement, content) {
    var that = this;
    oj.Assert.assertObject(content);
    this._launcher = launcher;
    this._contentElement = contentElement;

    this._messagingContent = oj.CollectionUtils.copyInto(this._messagingContent || {}, content);

    // if already active, reinitialize strategies based on new messagingDisplay
    // and labelEdge preferences.
    if (!this._isActive()) {
      // for each 'messaging strategy' (e.g., inline == InlineMessagingStrategy,
      // notewindow == PopupMessagingStrategy, etc), call .activate which initializes
      // the strategy.
      $.each(this._strategies, function (i, strategy) {
        strategy.activate(that);
      });
      this._activated = true;
    } else {
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
  ComponentMessaging.prototype.update = function (content) {
    oj.Assert.assertObject(content);
    oj.Assert.assertBoolean(this._activated);

    this._messagingContent = oj.CollectionUtils.copyInto(this._messagingContent || {}, content);

    if (this._activated) {
      $.each(this._strategies, function (i, strategy) {
        if (strategy.shouldUpdate(content)) {
          strategy.update();
        }
      });
    }
  };

  /**
   * Utility function that deactivates messaging on the component using the strategy provided.
   * @private
   */
  ComponentMessaging.prototype.deactivate = function () {
    $.each(this._strategies, function (i, strategy) {
      strategy.deactivate();
    });

    this._activated = false;
    this._component = null;
    this._launcher = null;
    this._contentElement = null;
    this._strategies = {};
  };

  /**
   * Utility function that closes anything that needs to be closed when oj.Components.subtreeHidden
   * is called. e.g, popup.
   * @private
   */
  ComponentMessaging.prototype.close = function () {
    if (this._activated) {
      $.each(this._strategies, function (i, strategy) {
        strategy.close();
      });
    }
  };

  /**
   * Releases resources that would otherwise leak memory if they were not released
   * when the component's dom is removed.
   * For example, Hammer events are put on the document and will result in
   * detached dom memory leak if not removed.
   * @private
   */
  ComponentMessaging.prototype.releaseResources = function () {
    if (this._activated) {
      $.each(this._strategies, function (i, strategy) {
        strategy.releaseResources();
      });
    }
  };

  /**
   * Symmetrical method to releaseResources. Sets up resources that get
   * removed in releaseResources.
   * @private
   */
  ComponentMessaging.prototype.setupResources = function () {
    if (this._activated) {
      $.each(this._strategies, function (i, strategy) {
        strategy.setupResources();
      });
    }
  };

  /**
   * Creates a messaging strategy for the specified type, initializing it with the options provided.
   * @param {string|number} type defined by oj.ComponentMessaging._STRATEGY_TYPE. For example,
   * a strategyType of 'notewindow' creates a PopupComponentMessaging strategy. See
   * registerMessagingStrategy where we register the type and the callback to call for a given type.
   * We currently have PopupMessagingStrategy, DefaultMessagingStrategy, PlaceholderMessagingStrategy,
   * and InlineComponentStrategy.
   * e.g., In PopupComponentMessaging.js:
   *  oj.ComponentMessaging.registerMessagingStrategy(oj.ComponentMessaging._STRATEGY_TYPE.NOTEWINDOW,
   *                              oj.PopupMessagingStrategy
   * @param {Array.<string>|undefined} artifactsForType (e.g., 'messages', 'helpInstruction', 'validatorHints')
   *
   * @private
   * @instance
   * @memberof !oj.ComponentMessaging
   */
  ComponentMessaging.prototype._createMessagingStrategy = function (type, artifactsForType) {
    var Callback =
      ComponentMessaging._STRATEGY_TYPE_TO_CALLBACK[type] ||
      ComponentMessaging._STRATEGY_TYPE_TO_CALLBACK[ComponentMessaging._STRATEGY_TYPE.NONE];

    // dynamically instantiate the strategy objects.
    return new Callback(artifactsForType);
  };

  /**
   * Returns the component instance or null
   *
   * @return {Object|null}
   * @private
   * @instance
   * @memberof !oj.ComponentMessaging
   */
  ComponentMessaging.prototype._getComponent = function () {
    return this._component || null;
  };

  /**
   * Returns the launcher jquery element. This is the element on the component to which messaging
   * applies.
   *
   * @return {Object|null} null if messaging is not activated.
   * @private
   * @instance
   * @memberof !oj.ComponentMessaging
   */
  ComponentMessaging.prototype._getLauncher = function () {
    return this._launcher || null;
  };

  /**
   * Returns the jquery element on the component to which aria-invalid
   * applies. This is either the launcher itself or the inputs
   * within the launcher dom.  JAWS only reads aria-invalid when it is on the input/textara/select.
   * <p>
   * In the case of radioset/checkboxset, for example, where the launcher
   * is the root dom element and the inputs are with it, we return the inputs.
   *
   * </p>
   *
   * @return {Object|null} null if launcher is null
   * @private
   * @instance
   * @memberof !oj.ComponentMessaging
   */
  ComponentMessaging.prototype._getContentElement = function () {
    return this._contentElement || null;
  };

  /**
   * Returns the last saved messagingContent object.
   *
   * @return {Object}
   * @private
   * @instance
   * @memberof !oj.ComponentMessaging
   */
  ComponentMessaging.prototype._getMessagingContent = function () {
    return this._messagingContent || {};
  };

  /**
   * Useful for on-demand messaging content, like validation hints.
   *
   * @param {Object} content
   * @private
   * @memberof !oj.ComponentMessaging
   */
  ComponentMessaging.prototype._setMessagingContent = function (content) {
    oj.Assert.assertObject(content);
    this._messagingContent = oj.CollectionUtils.copyInto(this._messagingContent || {}, content);
  };

  /**
   * Whether the component messaging is activated.
   * @return {boolean}
   * @private
   */
  ComponentMessaging.prototype._isActive = function () {
    return this._activated;
  };

  /**
   * Returns a key/value array: strategyTypes -> array of artifacts using that strategyType.
   * where artifacts is 'messages', 'converterHint', 'validatorHint', 'helpInstruction';
   * e.g.,
   * strategyToArtifacts[oj.ComponentMessaging._STRATEGY_TYPE.NOTEWINDOW] = ['messages', 'converterHints']
   * strategyToArtifacts[oj.ComponentMessaging._STRATEGY_TYPE.NONE] = ['validatorHints']
   * The types of messaging content for which displayOptions can be configured include
   * messages, converterHint, validatorHint and helpInstruction.
   * The displayOptions for each type is specified either as an array of strings or a string.
   * When an array is specified the first display option takes precedence over the second and so on,
   * so we will only have ONE display type per artifact.
   */
  ComponentMessaging.prototype._getResolvedMessagingDisplayOptions = function (messagingPreferences) {
    var strategyToArtifacts = {};
    var artifactStrategyTypeResolved = false;
    var options = this._component.options;
    var $messagingPreferences = {};
    var self = this;

    // first resolve primary display options for each artifact.
    // E.g. at the end of this loop you should have something like this
    // {messages: 'notewindow', converterHint: 'placeholder', validatorHint: 'notewindow', helpInstruction: 'none'}
    var keys = Object.keys(messagingPreferences);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var strategyTypes = messagingPreferences[key];
      // loop over array of strategyTypes preferred for artifact.
      // artifacts are 'messages', 'converterHint', 'validatorHint', 'helpInstruction'
      artifactStrategyTypeResolved = false;
      var artifact = key + '';
      // we take either array or string values for displayOptions.
      if (Array.isArray(strategyTypes)) {
        for (var j = 0; j < strategyTypes.length; j++) {
          var strategyType = strategyTypes[j];
          if (!artifactStrategyTypeResolved) {
            artifactStrategyTypeResolved = self._resolveStrategyTypeForArtifact(
              artifact,
              strategyType,
              options,
              $messagingPreferences
            );
          }
        }
      } else if (typeof strategyTypes === 'string') {
        if (!artifactStrategyTypeResolved) {
          artifactStrategyTypeResolved = self._resolveStrategyTypeForArtifact(
            artifact,
            strategyTypes,
            options,
            $messagingPreferences
          );
        }
      }

      // if we couldn't resolve then use "none". E.g., validationHint: ['none']
      if (!artifactStrategyTypeResolved) {
        $messagingPreferences[artifact] = ComponentMessaging._STRATEGY_TYPE.NONE;
      }
    }

    // update the label creation strategy
    // at this point, $messagingPreferences may have an Object like:
    // {converterHint:'notewindow',
    // helpInstruction:'notewindow', messages:'inline', validatorHint:'notewindow}
    // After the call to _addLabelStrategy, it might be added
    // labelEdge:'top'
    self._addLabelStrategy($messagingPreferences);

    // collate by strategyType -> artifact. but first reset
    $.each(ComponentMessaging._STRATEGY_TYPE, function (type, name) {
      strategyToArtifacts[name] = [];
    });

    $.each($messagingPreferences, function (_artifact, _strategyType) {
      // an artifact eventually resolves to one strategyType.
      strategyToArtifacts[_strategyType].push(_artifact);
    });
    // The keys to the object is the DisplayType, like inline, inside,
    // insideFormControl, none, notewindow, placeholder.
    // The artifacts are things like converterHint, label.
    return strategyToArtifacts;
  };

  /**
   * This function is used when the component's user assistance option should be used.
   * The component.display-options is used only to see if 'none' is specified.
   * display-options is ignored otherwise for the Redwood theme (via a theming variable).
   *
   * This function returns a key/value array: strategyTypes -> array of artifacts
   * using that strategyType. where artifacts is
   * 'messages', 'converterHint', 'validatorHint', 'helpInstruction';
   * e.g., {userAssistanceInline: ['messages', 'helpInstruction'],
   *        none: ['validationHint']
   * Note: the only strategies for inline are userAssistanceInline and none (and the label strategies)
   * The types of messaging content that can be configured include
   * messages, converterHint, validatorHint and helpInstruction.
   */
  ComponentMessaging.prototype._getUserAssistanceStrategyToArtifactsObj = function () {
    var strategyToArtifacts = {};
    var options = this._component.options;
    var componentDisplayOptions = options.displayOptions || {};
    var artifactPiecesToStrategyObj = {};
    var self = this;

    // componentDisplayOptions will be an Object like this:
    // {messages:['inline'], converterHint:['placeholder','notewindow'],
    // validatorHint:['notewindow], helpInstruction:['notewindow']
    // If we are looking at the user-assistance-density attribute on the component,
    // then all we care about from the displayOptions attribute is whether or not there
    // is a 'none' for any of these 'artifacts'. Like, is validatorHint:'none'? If so, do not
    // render the validatorHint. Otherwise render it how the user-assistance-density says to.
    //
    // first resolve primary display options for each artifact.
    // E.g. at the end of this loop you should have something like this
    // {messages: 'userassistanceinline', validatorHint:
    // 'userassistanceinline', helpInstruction: 'none'}
    var keys = Object.keys(componentDisplayOptions);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let strategyTypes = componentDisplayOptions[key];
      // loop over array of strategyTypes preferred for artifact.
      // artifacts are 'messages', 'converterHint', 'validatorHint', 'helpInstruction'
      let artifact = key + '';
      // we only look at 'string' for 'none'.
      if (typeof strategyTypes === 'string' && strategyTypes === 'none') {
        artifactPiecesToStrategyObj[artifact] = ComponentMessaging._STRATEGY_TYPE.NONE;
      } else {
        // put it in the user assistance inline
        artifactPiecesToStrategyObj[artifact] =
          ComponentMessaging._STRATEGY_TYPE.USER_ASSISTANCE_INLINE;
      }
    }

    // update the label creation strategy
    // at this point, artifactPiecesToStrategyObj may have an Object like:
    // {converterHint:'none',
    // helpInstruction:'userassistanceinline', messages:'userassistanceinline', validatorHint:'none'}
    // After the call to _addLabelStrategy, it might be added
    // labelEdge:'top'
    self._addLabelStrategy(artifactPiecesToStrategyObj);

    // collate by strategyType -> artifact. but first reset
    Object.keys(ComponentMessaging._STRATEGY_TYPE).forEach(function (key) {
      let value = ComponentMessaging._STRATEGY_TYPE[key];
      strategyToArtifacts[value] = [];
    });

    Object.keys(artifactPiecesToStrategyObj).forEach(function (key) {
      let _strategyType = artifactPiecesToStrategyObj[key];
      strategyToArtifacts[_strategyType].push(key);
    });

    // This returns an Object with all the StrategyTypes as keys and the
    // 'artifacts' as values, like {none:['validationHint'], 'userAssistanceInline':['messages', 'helpInstruction']
    // inside:['labelEdge']}
    return strategyToArtifacts;
  };

  // Note:
  // Each LabelStrategy is self-registering., e.g., InsideFormControlLabelStrategy registers itself
  // by calling oj.ComponentMessaging.registerMessagingStrategy.
  // this adds the label strategy for the component by the same type.
  ComponentMessaging.prototype._addLabelStrategy = function ($messagingPreferences) {
    var self = this;
    var artifactKey = 'labelEdge';
    // The strategyTypeLabelEdge will be one of these: oj.ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE*
    var strategyTypeLabelEdge = this._component._ResolveLabelEdgeStrategyType();
    var artifactStrategyTypeResolved = self._resolveStrategyTypeForArtifact(
      artifactKey,
      strategyTypeLabelEdge,
      this._component.options,
      $messagingPreferences
    );

    if (!artifactStrategyTypeResolved) {
      // eslint-disable-next-line no-param-reassign
      $messagingPreferences[artifactKey] = ComponentMessaging._STRATEGY_TYPE.NONE;
    }
  };

  ComponentMessaging.prototype._resolveStrategyTypeForArtifact = function (
    artifact,
    strategyType,
    options,
    $messagingPreferences
  ) {
    var artifactStrategyTypeResolved = false;
    var compPH = options.placeholder;
    switch (strategyType) {
      // placeholder display is special in that it's only supported on 'converterHint'.
      case ComponentMessaging._STRATEGY_TYPE.PLACEHOLDER:
        if (artifact === 'converterHint') {
          // if placeholder is the first preference for converterHint, it's used under certain
          // conditions
          // if options.placeholder is not set then use 'converterHint' as the default
          // 'placeholder'
          // alternately if (options.placeholder), i.e., a custom placeholder is set, then
          // ignore the placeholder strategyType and use the next display type as the default
          // for the artifact. We may have a fallback strategyType in which case we use it,
          // otherwise we use 'none'. E.g.,
          // {'converterHint': ['placeholder', 'notewindow']} // use notewindow
          // {'converterHint': ['placeholder']}               // use none

          if (!artifactStrategyTypeResolved) {
            if (!compPH) {
              // eslint-disable-next-line no-param-reassign
              $messagingPreferences[artifact] = strategyType;
              artifactStrategyTypeResolved = true;
            }
          }
        } else {
          // strategyType 'placeholder' is not supported on other artifacts
          // ignore if present
        }

        break;
      // inline display is special in that it's only supported on 'messages'.
      case ComponentMessaging._STRATEGY_TYPE.INLINE:
        if (artifact === 'messages') {
          if (!artifactStrategyTypeResolved) {
            // eslint-disable-next-line no-param-reassign
            $messagingPreferences[artifact] = strategyType;
            artifactStrategyTypeResolved = true;
          }
        } else {
          // strategyType 'inline' is not supported on other artifacts
          // ignore if present
        }

        break;

      case ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE:
      case ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE_FORM_CNTRL:
        if (
          artifact === 'labelEdge' &&
          !artifactStrategyTypeResolved &&
          !oj.StringUtils.isEmptyOrUndefined(options.labelHint)
        ) {
          // eslint-disable-next-line no-param-reassign
          $messagingPreferences[artifact] = strategyType;
          artifactStrategyTypeResolved = true;
        }

        break;

      default:
        if (!artifactStrategyTypeResolved && artifact !== 'labelEdge') {
          // eslint-disable-next-line no-param-reassign
          $messagingPreferences[artifact] = strategyType;
          artifactStrategyTypeResolved = true;
        }
        break;
    }

    return artifactStrategyTypeResolved;
  };

  /**
   * Creates messaging strategies for the component.
   * As of v9.0 form components have a user-assistance-density attribute in addition
   * to the existing display-options. For Redwood UX we look at the user-assistance-density
   * which is efficient or compact and the app will have all its 'user assistance' (i.e., help instruction,
   * hint, messages) inline, or if compact it is in popups.
   * For bw compatibility/Alta we continue to look at display-options
   * like display-options.help-instruction that could be notewindow,
   * and for display-options.messages that could be inline, etc.
   * BOTH will look at display-options for validationHint/messages for 'none'
   * because we still want to be able to turn these off.
   * @private
   */
  ComponentMessaging.prototype._initializeMessagingStrategies = function () {
    var strategyToArtifacts = this._strategyToArtifacts();
    var displayInNoteWindow = strategyToArtifacts[ComponentMessaging._STRATEGY_TYPE.NOTEWINDOW];
    var displayNone = strategyToArtifacts[ComponentMessaging._STRATEGY_TYPE.NONE];
    var displayInPlaceholder = strategyToArtifacts[ComponentMessaging._STRATEGY_TYPE.PLACEHOLDER];
    var displayInline = strategyToArtifacts[ComponentMessaging._STRATEGY_TYPE.INLINE];
    // these are input components
    var displayLabelEdgeInsideTextField =
      strategyToArtifacts[ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE];
    // these are form controls that aren't inputs, like radioset
    var displayLabelEdgeInsideFormControl =
      strategyToArtifacts[ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE_FORM_CNTRL];
    // these are for user assistance inline that is used in the Redwood theme
    var displayUserAssistanceInline =
      strategyToArtifacts[ComponentMessaging._STRATEGY_TYPE.USER_ASSISTANCE_INLINE];

    var messagingStrategies = {};

    if (displayInNoteWindow.length > 0) {
      // displayInNoteWindow is an array of the artifacts that want to be displayed in the note window
      // e.g., 'messages', 'converterHints', etc.
      messagingStrategies[ComponentMessaging._STRATEGY_TYPE.NOTEWINDOW] =
        this._createMessagingStrategy(
          ComponentMessaging._STRATEGY_TYPE.NOTEWINDOW,
          displayInNoteWindow
        );
    }

    if (displayInPlaceholder.length > 0 && displayLabelEdgeInsideTextField.length === 0) {
      // displayInPlaceholder is an array of the artifacts that want to be displayed in placeholder
      // e.g., 'converterHints'
      messagingStrategies[ComponentMessaging._STRATEGY_TYPE.PLACEHOLDER] =
        this._createMessagingStrategy(
          ComponentMessaging._STRATEGY_TYPE.PLACEHOLDER,
          displayInPlaceholder
        );
    }

    if (displayInline.length > 0) {
      // displayInline is an array of the artifacts that want to be displayed in inline
      // e.g., 'messages'
      messagingStrategies[ComponentMessaging._STRATEGY_TYPE.INLINE] = this._createMessagingStrategy(
        ComponentMessaging._STRATEGY_TYPE.INLINE,
        displayInline
      );
    }

    if (displayUserAssistanceInline.length > 0) {
      messagingStrategies[ComponentMessaging._STRATEGY_TYPE.USER_ASSISTANCE_INLINE] =
        this._createMessagingStrategy(
          ComponentMessaging._STRATEGY_TYPE.USER_ASSISTANCE_INLINE,
          displayUserAssistanceInline
        );
    }

    // Create one of these strategies for whatever labelEdge we are using currently
    if (displayLabelEdgeInsideTextField.length > 0) {
      messagingStrategies[ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE] =
        this._createMessagingStrategy(
          ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE,
          displayLabelEdgeInsideTextField
        );
    } else if (displayLabelEdgeInsideFormControl.length > 0) {
      messagingStrategies[ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE_FORM_CNTRL] =
        this._createMessagingStrategy(
          ComponentMessaging._STRATEGY_TYPE.LABEL_EDGE_INSIDE_FORM_CNTRL,
          displayLabelEdgeInsideFormControl
        );
    }

    messagingStrategies[ComponentMessaging._STRATEGY_TYPE.NONE] = this._createMessagingStrategy(
      ComponentMessaging._STRATEGY_TYPE.NONE,
      displayNone
    );

    this._strategies = messagingStrategies;
  };

  /**
   * Reinitializes component messaging.
   *
   * @private
   */
  ComponentMessaging.prototype._reactivate = function () {
    var strategyToArtifacts = this._strategyToArtifacts();

    var strategy;
    var cm = this;

    // for every strategyType being requested either create the messaging strategy for the type or
    // reuse existing strategy if it has already been created.
    $.each(strategyToArtifacts, function (type, artifactsForType) {
      // eslint-disable-next-line no-param-reassign
      type += ''; // coerce to avoid GCC warning
      strategy = cm._strategies[type];
      if (artifactsForType && artifactsForType.length > 0) {
        if (!strategy) {
          // create a strategy if one doesn't exist for the type
          strategy = cm._createMessagingStrategy(type, artifactsForType);
          cm._strategies[type] = strategy;
          strategy.activate(cm);
        } else if (strategy) {
          // update strategy with the latest displayOptions if already present. we don;t
          // want to remove it once activated.
          strategy.reactivate(artifactsForType);
        }
      } else if (strategy && ComponentMessaging._STRATEGY_TYPE.NONE !== type) {
        // if we have no artifacts to show for a type, then remove the strategy.
        // only if its other than the DefaultMessagingStrategy as it's always needed to theme
        // component.
        strategy.deactivate();
        delete cm._strategies[type];
      }
    });
  };

  /**
   * get strategy to artifacts
   * we do different things depending on whether we are using displayOptions
   * or the user-assistance-density attribute.
   *
   * @private
   */
  ComponentMessaging.prototype._strategyToArtifacts = function () {
    let strategyToArtifacts;
    let resolvedUserAssistance = this._component._getResolvedUserAssistance();

    if (resolvedUserAssistance !== 'compact' && resolvedUserAssistance !== 'displayOptions') {
      strategyToArtifacts = this._getUserAssistanceStrategyToArtifactsObj();
    } else {
      let options = this._component.options;
      let messagingPreferences = options.displayOptions || {};
      if (resolvedUserAssistance === 'compact') {
        // for 'compact' set displayOptions.messages, validator-hint and converter hint to notewindow.
        messagingPreferences.messages = 'notewindow';
        messagingPreferences.validatorHint = 'notewindow';
        messagingPreferences.converterHint = 'notewindow';
        strategyToArtifacts = this._getResolvedMessagingDisplayOptions(messagingPreferences);
      } else {
        strategyToArtifacts = this._getResolvedMessagingDisplayOptions(messagingPreferences);
      }
    }
    return strategyToArtifacts;
  };

  /**
   * A base messaging strategy class that is initialized with a set of displayOptions. This object
   * also provides helper methods for its subclasses.
   *
   * @param {Array.<string>} displayOptions an array of messaging artifacts displayed.
   *
   * @constructor
   * @class oj.MessagingStrategy
   * @private
   */
  const MessagingStrategy = function (displayOptions) {
    this.Init(displayOptions);
  };

  // Subclass from oj.Object
  oj.Object.createSubclass(MessagingStrategy, oj.Object, 'oj.MessagingStrategy');
  oj._registerLegacyNamespaceProp('MessagingStrategy', MessagingStrategy);

  /**
   * Initializes the strategy based on the display options that specify the messaging artifacts that
   * will be displayed by this strategy.
   *
   * @param {Array.<string>} displayOptions an array of messaging artifacts displayed.
   * @private
   */
  MessagingStrategy.prototype.Init = function (displayOptions) {
    oj.Assert.assertArray(displayOptions);
    MessagingStrategy.superclass.Init.call(this);

    this._displayOptions = displayOptions;
  };

  MessagingStrategy.prototype.activate = function (cm) {
    this._componentMessaging = cm;
  };

  /**
   * Cleans up messaging artifacts that were created on the component instance. E.g., destroys any
   * widgets it created, removes styles added etc.
   *
   * @private
   */
  MessagingStrategy.prototype.deactivate = function () {};

  /**
   * Utility function that closes anything that needs to be closed when oj.Components.subtreeHidden
   * is called. e.g, popup.
   *
   * @private
   */
  MessagingStrategy.prototype.close = function () {};

  /**
   *
   * @private
   */
  MessagingStrategy.prototype.setupResources = function () {};

  /**
   *
   * @private
   */
  MessagingStrategy.prototype.releaseResources = function () {};

  /**
   * Reinitializes with the new display options and updates component messaging using the new content.
   *
   * @param {Array.<string>} newDisplayOptions
   * @private
   */
  MessagingStrategy.prototype.reactivate = function (newDisplayOptions) {
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
  // eslint-disable-next-line no-unused-vars
  MessagingStrategy.prototype.shouldUpdate = function (content) {
    return true;
  };

  /**
   * Updates component with instance using the content provided.
   *
   * @private
   */
  MessagingStrategy.prototype.update = function () {};

  // P R O T E C T E D  M E T H O D S
  /**
   * Gets the launcher element for which the messaging is applied.
   * @return {Object} the jquery element of the form element.
   * @private
   */
  MessagingStrategy.prototype.GetLauncher = function () {
    return this._componentMessaging._getLauncher();
  };

  /**
   * @return {Object} the jquery element of the form element.
   * @private
   */
  MessagingStrategy.prototype.GetContentElement = function () {
    return this._componentMessaging._getContentElement();
  };

  /**
   * Gets the component (widget).
   * @return {Object} the jet component instance
   * @private
   */
  MessagingStrategy.prototype.GetComponent = function () {
    return this._componentMessaging._getComponent();
  };

  /**
   * This is simply a flag.
   * Set to true when we get the validator hints from the component the first time.
   * Then use getHasValidatorHints to check if it is true. If so we
   * know we've already gotten the validator hints the first time and
   * won't get them from the component again.
   * @param {boolean} hasValidatorHints true if we have the validator hints
   * @private
   */
  MessagingStrategy.prototype.setHasValidatorHints = function (hasValidatorHints) {
    this._hasValidatorHints = hasValidatorHints;
  };

  /**
   * If true, it means we have already retrieved the validator hints from the
   * component.
   * @private
   * @return {boolean} true if we already have the validator hints, else false
   */
  MessagingStrategy.prototype.getHasValidatorHints = function () {
    return this._hasValidatorHints === true;
  };

  /**
   * Generates a unique id if the element doesn't have one already assigned.
   * @param {Element} element requiring an id
   * @private
   */
  MessagingStrategy.prototype.GenerateIdIfNeeded = function (element) {
    if (isNaN(MessagingStrategy._uidCounter)) {
      MessagingStrategy._uidCounter = 0;
    }

    var e = element;
    if (!e.id) {
      e.id = 'ojms_' + MessagingStrategy._uidCounter;
      MessagingStrategy._uidCounter += 1;
    }
  };

  /**
   * Returns an array of messages.
   *
   * @return {Array} of messages each an instance of oj.Message
   * @private
   */
  MessagingStrategy.prototype.GetMessages = function () {
    return this.GetValidityState().getMessages();
  };

  MessagingStrategy.prototype.GetMaxSeverity = function () {
    return this.GetValidityState().getMaxSeverity();
  };

  /**
   * Gets the converter hint.
   *
   * @return {Array} an array of hints, each a string.
   * @private
   */
  MessagingStrategy.prototype.GetConverterHint = function () {
    var hints = [];
    var mc = this._getMessagingContent();
    var converterHint = mc && mc.converterHint;
    if (converterHint) {
      hints.push(converterHint);
    }

    return hints;
  };

  /**
   * ValidatorHints are retrieved on-demand. The first time they are requested,
   * we get them and set the mc.validatorHints.
   * @return {string} helpInstruction or ""
   * @private
   */
  MessagingStrategy.prototype.GetValidatorHints = function () {
    if (!this.getHasValidatorHints()) {
      this.setHasValidatorHints(true);
      let component = this.GetComponent();
      // get the sync validator hints from the component, then set the messaging content.
      this._setMessagingContent(component._getValidatorHintsMC());

      component._initAsyncValidatorMessagingHint();
    }

    // Eventually the messagingContent will have all the validatorHints, even the async ones.
    // The async validators call componentMessaging.update(cm) when each hint Promise resolves with
    // all the validator hints it has so far, sync/async.
    // The first time through, before update, this will return the sync validator hints.
    // Every time the componentMessaging.update(cm) is called after, it will have the sync hints
    // plus any new async hints. The most common use case is to have only one validator per
    // form component but this supports multiple and sync and async.
    var mc = this._getMessagingContent();
    return (mc && mc.validatorHint) || [];
  };

  /**
   * Gets the short description.
   * @return {string} helpInstruction or ""
   * @private
   */
  MessagingStrategy.prototype.GetTitle = function () {
    var mc = this._getMessagingContent();
    return (mc && mc.title) || '';
  };

  /**
   * Gets the validityState, an instance of oj.ComponentValidity or null.
   * @private
   */
  MessagingStrategy.prototype.GetValidityState = function () {
    var mc = this._getMessagingContent();
    return (mc && mc.validityState) || null;
  };

  /**
   * Whether the strategy is displaying messages or not.
   * @return {boolean} true if strategy has messages to display
   * @private
   */
  MessagingStrategy.prototype.HasMessages = function () {
    var messages = this.GetMessages();
    return !!(messages && messages.length > 0);
  };

  /**
   * The following explains what this._displayOptions is in the following methods --
   * When the Strategy is created, like the PopupComponentMessaging strategy, it gets passed
   * in what artifacts it needs to display, like 'messages' or 'validatorHint'.
   * The default in alta is to show 'helpInstruction' and 'validatorHint' in 'notewindow'.
   * The api is displayOptions.helpInstruction = 'notewindow' and
   * displayOptions.validatorHint = 'notewindow', and this gets consolidated the other way,
   * notewindow: [helpInstruction, validatorHint], where notewindow is the PopupComponentStrategy.
   * For Redwood, we look at the user-assistance-density attribute, and by default the displayOptions
   * will be 'messages', 'helpInstruction' and 'validatorHint'.
   * 'helpInstruction', 'helpDefinition' and 'helpSource' are
   * shown if the attributes are set.
   * The user can turn off helpInstruction by not having a help instruction option.
   * The user can turn off messages and/or validationHint by setting its display-options to none, like
   * display-options.validatorHint = 'none'.
   */
  MessagingStrategy.prototype.ShowMessages = function () {
    return this._displayOptions.indexOf('messages') !== -1;
  };

  MessagingStrategy.prototype.ShowConverterHint = function () {
    return this._displayOptions.indexOf('converterHint') !== -1;
  };

  MessagingStrategy.prototype.ShowValidatorHint = function () {
    return this._displayOptions.indexOf('validatorHint') !== -1;
  };

  MessagingStrategy.prototype.ShowTitle = function () {
    return (
      this._displayOptions.indexOf('title') !== -1 ||
      this._displayOptions.indexOf('helpInstruction') !== -1
    );
  };

  /**
   * Returns true if we have invalid messages; false otherwise.
   *
   * @return {boolean}
   * @private
   */
  MessagingStrategy.prototype.IsInvalid = function () {
    return this.GetValidityState().isInvalid();
  };

  /**
   * Create an id to put on the root dom element that holds the inline messaging content,
   * then add aria-describedby on the component on the appropriate dom node(s).
   * This makes it so the screen reader user knows the messaging content is connected to the launcher.
   * @memberof oj.MessagingStrategy
   * @param {Element} containerRoot
   * @instance
   * @private
   */
  MessagingStrategy.prototype.AddAriaDescribedByForInlineMessaging = function (containerRoot) {
    // create an id on the div holding the inline messaging.
    // add aria-describedby to the launcher to associate the launcher and the inline message
    let $contentElems = this.GetContentElement();

    oj.Assert.assertPrototype($contentElems, $);

    let containerRootId = $(containerRoot).uniqueId()[0].getAttribute('id');

    $contentElems.each(function () {
      // get ariaAttr that is on the content element(s)
      let ariaAttributeValue = this.getAttribute(_DESCBY);
      // split into tokens
      let tokens = ariaAttributeValue ? ariaAttributeValue.split(/\s+/) : [];
      // Get index that id is in the tokens, if at all.
      let index = tokens.indexOf(containerRootId);
      // push id into tokens if it isn't already there
      if (index === -1) {
        tokens.push(containerRootId);
      }
      // join the tokens together
      let newValue = tokens.join(' ').trim();
      this.setAttribute(_DESCBY, newValue); // @HTMLUpdateOK
    });
  };

  /**
   * @memberof oj.MessagingStrategy
   * @param {Element} containerRoot
   * @instance
   * @private
   */
  MessagingStrategy.prototype.AddDescribedByToElement = function (elem, id) {
    const attr = 'described-by';
    const currentAttributeValue = elem.getAttribute(attr);
    let newAttributeValue;

    let tokens = currentAttributeValue ? currentAttributeValue.split(/\s+/) : [];
    // Get index that id is in the tokens, if at all.
    let index = tokens.indexOf(id);
    // add id if it isn't already there
    if (index === -1) {
      tokens.push(id);
    }
    newAttributeValue = tokens.join(' ').trim();
    elem.setAttribute(attr, newAttributeValue); // @HTMLUpdateOK
  };

  /**
   * @memberof oj.MessagingStrategy
   * @param {Element} containerRoot
   * @instance
   * @private
   */
  MessagingStrategy.prototype.RemoveDescribedByFromElement = function (elem, id) {
    const attr = 'described-by';
    const currentAttributeValue = elem.getAttribute(attr);

    // space deliminated string.
    let tokens = currentAttributeValue ? currentAttributeValue.split(/\s+/) : [];

    // remove id if it is already there
    const filteredArray = tokens.filter((token) => token !== id);
    let newValue = filteredArray.join(' ').trim();
    if (newValue) {
      elem.setAttribute(attr, newValue); // @HTMLUpdateOK
    } else {
      elem.removeAttribute(attr);
    }
  };

  /**
   * Removes the aria-describedby from the launcher that was added by AddAriaDescribedByForInlineMessaging
   * @param {Element} containerRoot
   * @memberof oj.MessagingStrategy
   * @instance
   * @private
   */
  MessagingStrategy.prototype.RemoveAriaDescribedByForInlineMessaging = function (containerRoot) {
    let $contentElems = this.GetContentElement();
    oj.Assert.assertPrototype($contentElems, $);

    let containerRootId = containerRoot.getAttribute('id');

    $contentElems.each(function () {
      // get ariaAttr that is on the content element(s)
      let ariaAttributeValue = this.getAttribute(_DESCBY);
      // split into tokens
      let tokens = ariaAttributeValue ? ariaAttributeValue.split(/\s+/) : [];
      // Get index that id is in the tokens, if at all.
      let index = tokens.indexOf(containerRootId);
      // remove id if it is there.
      if (index !== -1) {
        // remove that from the tokens array
        tokens.splice(index, 1);
      }
      let newValue = tokens.join(' ').trim();
      if (newValue) {
        this.setAttribute(_DESCBY, newValue); // @HTMLUpdateOK
      } else {
        this.removeAttribute(_DESCBY);
      }
    });
  };

  /**
   * Gets the messagingContent stored in ComponentMessaging instance
   * @return {Object}
   * @private
   */
  MessagingStrategy.prototype._getMessagingContent = function () {
    if (this._componentMessaging) {
      return this._componentMessaging._getMessagingContent();
    }

    return {};
  };

  /**
   * Gets the messagingContent stored in ComponentMessaging instance
   * @param {Object} messaging content.
   * @private
   */
  MessagingStrategy.prototype._setMessagingContent = function (content) {
    if (this._componentMessaging) {
      return this._componentMessaging._setMessagingContent(content);
    }

    return {};
  };

  /**
   * A messaging strategy that updates the component theming and accessibility attributes.
   *
   * @param {Array.<string>} displayOptions .
   * @constructor
   * @extends {oj.MessagingStrategy}
   * @private
   */
  const DefaultMessagingStrategy = function (displayOptions) {
    this.Init(displayOptions);
  };

  ComponentMessaging.registerMessagingStrategy(
    ComponentMessaging._STRATEGY_TYPE.NONE,
    DefaultMessagingStrategy
  );

  // TODO: Need to retrieve style selectors from a Style Manager
  DefaultMessagingStrategy._SELECTOR_STATE_INVALID = 'oj-invalid';
  DefaultMessagingStrategy._SELECTOR_STATE_WARNING = 'oj-warning';

  oj.Object.createSubclass(
    DefaultMessagingStrategy,
    MessagingStrategy,
    'oj.DefaultMessagingStrategy'
  );
  oj._registerLegacyNamespaceProp('DefaultMessagingStrategy', DefaultMessagingStrategy);

  /**
   * Updates component theming, a11y attributes using the latest component state and its messaging
   * content.
   *
   * @private
   */
  DefaultMessagingStrategy.prototype.update = function () {
    DefaultMessagingStrategy.superclass.update.call(this);

    var launcher = this.GetLauncher();
    var maxSeverity = this.GetMaxSeverity();
    var removeClasses = [];
    var addClasses = [];
    var invalid = false;
    var component = this.GetComponent();
    var jqRoot = component.widget();

    if (!launcher) {
      return;
    }

    // apply element error styling if invalid
    if (this.IsInvalid()) {
      // enable tooltip; set invalid class and aria invalid
      // TODO: oj classes should be set on the root DOM
      removeClasses.push(DefaultMessagingStrategy._SELECTOR_STATE_WARNING);
      addClasses.push(DefaultMessagingStrategy._SELECTOR_STATE_INVALID);
      invalid = true;
    } else if (this.HasMessages() && maxSeverity === Message.SEVERITY_LEVEL.WARNING) {
      // TODO: add warning or other severity state
      removeClasses.push(DefaultMessagingStrategy._SELECTOR_STATE_INVALID);
      addClasses.push(DefaultMessagingStrategy._SELECTOR_STATE_WARNING);
    } else {
      // for all other messages we remove selectors
      removeClasses.push(DefaultMessagingStrategy._SELECTOR_STATE_INVALID);
      removeClasses.push(DefaultMessagingStrategy._SELECTOR_STATE_WARNING);
    }

    jqRoot.removeClass(removeClasses.join(' ')).addClass(addClasses.join(' ')); // classes added to root
    // aria-invalid needs to be on an input/textarea
    this.GetContentElement().attr({ 'aria-invalid': invalid });
  };

  /**
   * Cleans up messaging artifacts that were created on the component instance. E.g., destroys any
   * widgets it created, removes styles added etc.
   *
   * @private
   */
  DefaultMessagingStrategy.prototype.deactivate = function () {
    var jqRoot = this.GetComponent().widget();

    jqRoot
      .removeClass(DefaultMessagingStrategy._SELECTOR_STATE_INVALID)
      .removeClass(DefaultMessagingStrategy._SELECTOR_STATE_WARNING);
    this.GetContentElement().removeAttr('aria-invalid');
    DefaultMessagingStrategy.superclass.deactivate.call(this);
  };

  /**
   * A messaging strategy that uses html5 placeholder (for now) to set/remove placeholder content.
   *
   * @param {Array.<string>} displayOptions an array of messaging artifacts displayed in the placeholder.
   * @constructor
   * @extends {oj.MessagingStrategy}
   * @private
   */
  const PlaceholderMessagingStrategy = function (displayOptions) {
    this.Init(displayOptions);
  };

  ComponentMessaging.registerMessagingStrategy(
    ComponentMessaging._STRATEGY_TYPE.PLACEHOLDER,
    PlaceholderMessagingStrategy
  );

  // Subclass from oj.MessagingStrategy
  oj.Object.createSubclass(
    PlaceholderMessagingStrategy,
    MessagingStrategy,
    'oj.PlaceholderMessagingStrategy'
  );
  oj._registerLegacyNamespaceProp('PlaceholderMessagingStrategy', PlaceholderMessagingStrategy);

  /**
   * Initializer
   *
   * @param {Array.<string>} displayOptions an array of messaging artifacts displayed in the notewindow.
   * @private
   */
  PlaceholderMessagingStrategy.prototype.Init = function (displayOptions) {
    PlaceholderMessagingStrategy.superclass.Init.call(this, displayOptions);
  };

  /**
   * Sets up a placeholder for the component instance using the converter hint.
   *
   * @param {Object} cm a reference to an instance of oj.ComponentMessaging that provides access to
   * the latest messaging content.
   *
   * @private
   */
  PlaceholderMessagingStrategy.prototype.activate = function (cm) {
    PlaceholderMessagingStrategy.superclass.activate.call(this, cm);
    this._refreshPlaceholder();
  };

  PlaceholderMessagingStrategy.prototype.reactivate = function (newDisplayOptions) {
    PlaceholderMessagingStrategy.superclass.reactivate.call(this, newDisplayOptions);
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
  PlaceholderMessagingStrategy.prototype.shouldUpdate = function (content) {
    return !!(content && content.converterHint !== undefined);
  };

  PlaceholderMessagingStrategy.prototype.update = function () {
    PlaceholderMessagingStrategy.superclass.update.call(this);
    this._refreshPlaceholder();
  };

  // a default placeholder is set on the component, and that is typically the converter hint
  PlaceholderMessagingStrategy.prototype._refreshPlaceholder = function () {
    var launcher = this.GetLauncher();

    if (this.ShowPlaceholderContent() && launcher) {
      var hints = this.GetConverterHint();
      var content = hints.length ? hints[0] : '';

      // don't override the placeholder with the converter hint if it's empty
      if (oj.StringUtils.isEmptyOrUndefined(content)) return;

      var context = { internalMessagingSet: true };
      // set from messaging module
      this.GetComponent().option({ placeholder: content }, { _context: context });
    }
  };

  PlaceholderMessagingStrategy.prototype.ShowPlaceholderContent = function () {
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
  const ComponentValidity = function (valid, messages) {
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
  ComponentValidity.isInvalid = function (messages) {
    var maxLevel = Message.getMaxSeverity(messages);
    if (maxLevel >= Message.SEVERITY_LEVEL.ERROR) {
      return true;
    }

    return false;
  };

  // Subclass from oj.Object
  oj.Object.createSubclass(ComponentValidity, oj.Object, 'oj.ComponentValidity');
  oj._registerLegacyNamespaceProp('ComponentValidity', ComponentValidity);

  /**
   * The jquery element whose validity this object describes
   * @param {boolean} valid
   * @param {Array} messages instances of oj.Message
   */
  ComponentValidity.prototype.Init = function (valid, messages) {
    ComponentValidity.superclass.Init.call(this);
    this._initialize(valid, messages);
  };

  /**
   * Returns a boolean true if valid; false if element not valid
   * @returns {boolean}
   * @private
   */
  ComponentValidity.prototype.isInvalid = function () {
    return this._invalid;
  };

  /**
   * Returns an Array or messages that we are marked for immediate display or an empty array.
   * @private
   * @returns {Array}
   */
  ComponentValidity.prototype.getMessages = function () {
    return this._messages;
  };

  /**
   * Returns the max severity level.
   * @return {number}
   * @private
   */
  ComponentValidity.prototype.getMaxSeverity = function () {
    return this._maxSeverity;
  };

  /**
   * Updates the validity state for the component.
   *
   * @param {boolean} valid
   * @param {Array} messages instances of oj.Message
   * @private
   */
  ComponentValidity.prototype.update = function (valid, messages) {
    this._initialize(valid, messages);
  };

  ComponentValidity.prototype._initialize = function (valid, messages) {
    this._compValid = valid;
    this._compMessages = messages;

    this._messages = this._getImmediateMessages(); // messages currently showing
    this._maxSeverity = Message.getMaxSeverity(this._messages); // max severity of messages currently showing
    this._invalid = ComponentValidity.isInvalid(this._messages);
  };

  /**
   * Returns an array of messages that are marked for immediate display.
   *
   * @return {Array} of messages each an instance of oj.Message
   * @private
   */
  ComponentValidity.prototype._getImmediateMessages = function () {
    var messages = this._compMessages || [];
    var immediateMsgs = [];
    for (var index = 0; index < messages.length; index++) {
      var msg = messages[index];
      // gather component messages marked for immediate display
      if (!(msg instanceof Message.ComponentMessage) || msg.canDisplay()) {
        immediateMsgs.push(msg);
      }
    }

    return immediateMsgs;
  };

  /**
   * @namespace Components
   * @classdesc JET Component services
   * @since 1.0
   * @export
   * @ojtsmodule
   * @hideconstructor
   */
  const Components = {};
  oj$1._registerLegacyNamespaceProp('Components', Components);

  /**
   * @private
   */
  Components._OJ_CONTAINER_ATTR = 'data-oj-container';

  /**
   * @private
   */
  const _OJ_WIDGET_NAMES_DATA = 'oj-component-names';

  /**
   * Marks the element which is a jQueryUI component
   * @private
   */
  const _OJ_COMPONENT_NODE_CLASS = 'oj-component-initnode';

  /**
   * Marks an element as being hidden.
   *
   * @private
   */
  var _OJ_SUBTREE_HIDDEN_CLASS = 'oj-subtree-hidden';

  /**
   * Marks an element as a container that will control hidden of its children
   * once it finishes initializing
   *
   * @private
   */
  var _OJ_PENDING_SUBTREE_HIDDEN_CLASS = 'oj-pending-subtree-hidden';

  /**
   * @private
   */
  const _NOT_COMP = 'node is not a component element';

  /**
   * Sets default options values for JET components.
   * @param {!Object} options - property values that will be merged into the values
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
   *     'option2': Components.createDynamicPropertyGetter(function(context){
   *                                 return context['containers'].indexOf('ojTable') >= 0 ? 'tableValue' : 'normalValue'})
   *   },
   *   'ojText': // properties for instances of ojText
   *   {
   *     'option1': 'somevalue2'
   *   }
   * }
   * </pre>
   * To specify a dynamic getter for the property, pass your callback to Components.createDynamicPropertyGetter(). Note
   * that dynamic getters nested within a complex property value are not supported
   * @see Components.createDynamicPropertyGetter
   * @return {void}
   * @export
   * @ojtsignore
   */
  Components.setDefaultOptions = function (options) {
    var props = Components._defaultProperties || {};

    var keys = Object.keys(options);

    keys.forEach(function (key) {
      var value = options[key];
      if (!oj$1.CollectionUtils.isPlainObject(value)) {
        throw new Error('Invalid default options');
      }
      props[key] = _accumulateValues(props[key] || {}, value, false);
    });

    Components._defaultProperties = props;
  };

  /**
   * Retrieves default option values for JET components. This method should only be used internally by JET.
   * @deprecated since version 2.2
   * @ignore
   * @return {Object} default option values
   * @see Components.setDefaultOptions
   * @export
   */
  Components.getDefaultOptions = function () {
    return Components._defaultProperties || {};
  };

  /**
   * Creates a dynamic getter that can be used as a property value in Components.setDefaultOptions()
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
   * @see Components.setDefaultOptions
   * @export
   * @ojtsignore
   */
  Components.createDynamicPropertyGetter = function (callback) {
    return new __ojDynamicGetter(callback);
  };

  /**
   * This method should only be used for JQueryUI components and will return null if used
   * with a custom element. Retrieves widget constructor associated with the HTML element
   * or null if none is found. The returned constructor is already bound to the associated
   * JQuery element, so it can be invoked as a function directly. For example:
   * <pre>
   * widgetConstructor("option", "label", "custom"); // sets label option
   * </pre>
   * If widgetName is not specified, and if more than one widget is associated with the element,
   * the method will a return the widget that was created first.
   * @param {?(Element|Node)} element - HTML element
   * @param {string=} widgetName - optional widget name
   * @return {Function|null} widget constructor
   * @export
   * @ojtsignore
   */
  Components.getWidgetConstructor = function (element, widgetName) {
    if (element && !ojcustomelementUtils.CustomElementUtils.isElementRegistered(element.tagName)) {
      return Components.__GetWidgetConstructor(element, widgetName);
    }
    return null;
  };

  /**
   * Internal version for components to call which won't return null for
   * custom elements. See public method for jsDoc.
   * @param {?(Element|Node)} element - HTML element
   * @param {string=} widgetName - optional widget name
   * @return {Function|null} widget constructor
   * @ignore
   */
  Components.__GetWidgetConstructor = function (element, widgetName) {
    var jelem = $(element);

    var data = jelem.data(_OJ_WIDGET_NAMES_DATA);
    if (data) {
      if (widgetName == null) {
        // eslint-disable-next-line no-param-reassign
        widgetName = data[0];
      } else if (data.indexOf(widgetName) < 0) {
        // eslint-disable-next-line no-param-reassign
        widgetName = undefined;
      }

      if (widgetName != null) {
        var func = jelem[widgetName];
        if (typeof func === 'function') {
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
   * @see Components.subtreeDetached
   * @return {void}
   * @export
   * @alias Components.subtreeAttached
   */
  Components.subtreeAttached = function (node) {
    DomUtils.fixResizeListeners(node);
    _applyToComponents(node, function (instance) {
      instance.__handleSubtreeAttached();
    });
  };

  /**
   * Notifies JET framework that a subtree possibly containing JET components has been removed
   * from the document programmatically.
   *
   * Note that calling this method is not needs after calling JQuery's .remove() because all JET components would have been
   * already destroyed in that case. Similarly, there is no need to call this method after the subtree has been removed by
   * Knockout.js
   * @param {!Element} node - the root of the subtree
   * @see Components.subtreeAttached
   * @return {void}
   * @export
   * @alias Components.subtreeDetached
   */
  Components.subtreeDetached = function (node) {
    _applyToComponents(node, function (instance) {
      instance.__handleSubtreeDetached();
    });
  };

  /**
   * Notifies JET framework that a subtree possibly containing JET components is no longer hidden with display:none style
   * This method should be called by the application if the 'display' style is being changed from 'hidden' programmatically,
   * such as when JQuery's .show() method is called.
   * For cases where subtree is shown on initial render, this method should be called with the options parameter set to
   * {'initialRender':true}, that will result in _NotifyInitShown() calls to the subtree components.
   * All oj-defer elements in the entire subtree will be activated. Note that subtreeShown currently notifies the entire
   * subtree as well. This generally means that only non-nested oj-defer elements make sense in a subtree.
   *
   * @param {!Node} node - the root of the subtree
   * @param {Object=} options Options to control subtreeShown
   * @param {boolean} options.initialRender The index at which to start fetching records.
   * @see Components.subtreeHidden
   * @return {void}
   * @export
   * @alias Components.subtreeShown
   */
  Components.subtreeShown = function (node, options) {
    var _node = $(node)[0]; // Strip possible jQuery wrapper
    if (_node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    var _options = options || {};
    var isInitialRender = _options.initialRender;
    if (!isInitialRender) {
      DomUtils.fixResizeListeners(_node);
    }

    unmarkSubtreeHidden(_node);

    _applyHideShowToComponents(
      _node,
      function (instance) {
        ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);
        try {
          if (isInitialRender) {
            instance._NotifyInitShown();
          } else {
            instance._NotifyShown();
          }
        } finally {
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
        }
      },
      true
    );
  };

  /**
   * Notifies JET framework that a subtree possibly containing JET components has been hidden  with display:none style
   * This method should be called by the application after the subtree has been hidden programmatically, such as
   * when JQuery's .hide() method is called.
   *
   * @param {!Node} node - the root of the subtree
   * @see Components.subtreeShown
   * @return {void}
   * @export
   * @alias Components.subtreeHidden
   */
  Components.subtreeHidden = function (node) {
    var _node = $(node)[0]; // Strip possible jQuery wrapper
    if (_node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    _applyHideShowToComponents(
      _node,
      function (instance) {
        ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);
        try {
          instance._NotifyHidden();
        } finally {
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
        }
      },
      false
    );

    markSubtreeHidden(_node);
  };

  /**
   * Add a marker class indicating that this subtree is hidden.
   *
   * @ignore
   */
  function markSubtreeHidden(element) {
    element.classList.add(_OJ_SUBTREE_HIDDEN_CLASS);
  }

  /**
   * Remove the marker class indicating that this subtree is hidden.
   *
   * @ignore
   */
  function unmarkSubtreeHidden(element) {
    element.classList.remove(_OJ_SUBTREE_HIDDEN_CLASS);
  }

  /**
   * Called by CCAs and certain custom elements when they are first connected
   * to indicate that this component is initializing and will control
   * whether its child subtrees are hidden.
   *
   * @ignore
   */
  Components.markPendingSubtreeHidden = function (element) {
    element.classList.add(_OJ_PENDING_SUBTREE_HIDDEN_CLASS);
  };

  /**
   * Called by CCAs and certain custom elements right before they are first rendered.
   * This component will control whether its child subtrees are hidden.
   *
   * @ignore
   */
  Components.unmarkPendingSubtreeHidden = function (element) {
    element.classList.remove(_OJ_PENDING_SUBTREE_HIDDEN_CLASS);
  };

  /**
   * Determines if a component identified by the <code>widgetName</code> has been
   * bound and initialized on a given <code>jelement</code>.
   *
   * @param {jQuery} jelement to which the component is bound
   * @param {string} widgetName constructor name of the target component.
   * @return {boolean} <code>true</code> if the component identified by the widgetName
   *  has be bound and initialized to the target element.
   * @ojtsignore
   */
  Components.isComponentInitialized = function (jelement, widgetName) {
    /** @type {?} */
    var widgets = jelement.data(_OJ_WIDGET_NAMES_DATA);
    if (
      $.isArray(widgets) &&
      widgets.indexOf(widgetName) > -1 &&
      jelement.is('.' + _OJ_COMPONENT_NODE_CLASS)
    ) {
      return true;
    }
    return false;
  };

  /**
   * @ignore
   */
  Components.__getDefaultOptions = function (hierarchyNames) {
    var defaults = {};
    var allProperties = Components.getDefaultOptions();

    for (var i = hierarchyNames.length - 1; i >= 0; i--) {
      var name = hierarchyNames[i];
      var props = allProperties[name];
      if (props !== undefined) {
        defaults = _accumulateValues(defaults, props, true);
      }
    }

    return defaults;
  };

  /**
   * Retrieves the JET component element that
   * the node is in.
   * @param {?(Element|Node)} node - DOM node
   * @return {?(Element|Node)} componentElement - JET component element
   * A component element is the DOM element on which the JET component is
   * initialized.
   * @export
   * @ojtsignore
   */
  Components.getComponentElementByNode = function (node) {
    // Temporarily exposing this private flag in order to allow
    // MonkeyTalk to access JET components that are part of the
    // composite's implementation. We are not exposing this flag
    // as a public API as a) accessing composite implementation
    // components is bad and b) the need for this method will soon
    // go away. Once our new automation API (recording adapters) are
    // in place, even MonkeyTalk will no longer need this flag. Adding
    // this as a stop-gap measure to allow MonkeyTalk to carry on in the
    // meantime. Callers other than MonkeyTalk must avoid specifying this flag.
    var mtAccessCompositeInternals = !!(arguments.length > 1 && arguments[1]);
    return _getComponentElementByNode(node, mtAccessCompositeInternals);
  };

  /**
   * Private method implementing the functionality of
   * getComponentElementByNode. This was done because Closure
   * throws an error when the private, undocumented flag (mtAccessCompositeInternals)
   * is passed to recursive calls of getComponentElementByNode.
   * @private
   */
  function _getComponentElementByNode(node, mtAccessCompositeInternals) {
    if (node == null) {
      return null;
    }
    // node can be a Node or Element but we call some Element only APIs
    // so we need to do an additional isElement check first
    var isElement = node.nodeType === 1;
    // for upstream or indirect dependency we will still rely components being registered on the oj namespace.
    var containingComposite =
      oj$1.Composite && !mtAccessCompositeInternals ? oj$1.Composite.getContainingComposite(node) : null;
    if (containingComposite) {
      // node is in or is a composite, return composite
      return containingComposite;
    } else if (isElement && node.hasAttribute('data-oj-internal')) {
      // node is an internal component
      if (
        node.parentNode instanceof Element &&
        node.parentNode.hasAttribute('data-oj-surrogate-id')
      ) {
        // internal component is a popup
        // eslint-disable-next-line no-param-reassign
        node = document.querySelector('[data-oj-popup-' + node.id + '-parent]'); // retrieves popups parent element
        return _getComponentElementByNode(node, mtAccessCompositeInternals);
      }
      return _getComponentElementByNode(node.parentNode, mtAccessCompositeInternals);
    } else if (_isComponentElement(node)) {
      // node is a component element
      return node;
    } else if (isElement && node.classList.contains('oj-component')) {
      // node is component wrapper
      // eslint-disable-next-line no-param-reassign
      node = node.querySelector('.oj-component-initnode:not([data-oj-internal])') || node;
      if (_isJQueryUI(node)) {
        return node;
      }
    } else if (isElement && node.hasAttribute('data-oj-containerid')) {
      // node is non-internal component popup e.g listbox
      // eslint-disable-next-line no-param-reassign
      node = document.getElementById(node.getAttribute('data-oj-containerid'));
      return _getComponentElementByNode(node, mtAccessCompositeInternals);
    }
    return _getComponentElementByNode(node.parentNode, mtAccessCompositeInternals);
  }

  /**
   * Retrieves the subId of the node as
   * as part of a locator object i.e. at least
   * {subId: subIdOfNode}
   * @param {?Element} componentElement - JET component element
   * @param {?Element} node - DOM node
   * @return {any} locator - object with at least a subId
   * or null if the node does not have a subId
   * @export
   * @ojtsignore
   */
  Components.getSubIdByNode = function (componentElement, node) {
    return Components.callComponentMethod(componentElement, 'getSubIdByNode', node);
  };

  /**
   * Returns the component DOM node indicated
   * by the locator parameter.
   * @param {?Element} componentElement - JET component element
   * @param {Object} locator - Object containing, at minimum,
   * a subId property, whose value is a string that identifies
   * a particular DOM node in this component.
   * @return {any} node - The DOM node located by
   * the locator, or null if none is found
   * @export
   * @ojtsignore
   */
  Components.getNodeBySubId = function (componentElement, locator) {
    return Components.callComponentMethod(componentElement, 'getNodeBySubId', locator);
  };

  /**
   * Retrieves the specified option of
   * the specified JET component element
   * @param {?Element} componentElement - JET component element
   * @param {string} option - option to retrieve
   * @return {any} value of option
   * @export
   * @ojtsignore
   */
  Components.getComponentOption = function (componentElement, option) {
    if (!_isComponentElement(componentElement)) {
      throw new Error(_NOT_COMP);
    } else if (_isCompositeOrCustom(componentElement)) {
      if (componentElement.getProperty) {
        return componentElement.getProperty.call(componentElement, option);
      }
    } else {
      return Components.__GetWidgetConstructor(componentElement)('option', option);
    }
    return undefined;
  };

  /**
   * Sets the specified option of the specified
   * JET component element to the specified value
   * @param {?Element} componentElement - JET component element
   * @param {string} option - option to set
   * @param {any} value - value to set option to
   * @return {void}
   * @export
   * @ojtsignore
   */
  Components.setComponentOption = function (componentElement, option, value) {
    if (!_isComponentElement(componentElement)) {
      throw new Error(_NOT_COMP);
    } else if (_isCompositeOrCustom(componentElement)) {
      if (componentElement.setProperty) {
        componentElement.setProperty.call(componentElement, option, value);
      }
    } else {
      Components.__GetWidgetConstructor(componentElement)('option', option, value);
    }
  };

  /**
   * Calls the specified JET component element's method
   * with the given arguments
   * @param {?Element} componentElement - JET component element
   * @param {string} method - name of JET component element method to call
   * @param {...*} methodArguments - list of arguments to pass to method call
   * @return {any}
   * @export
   * @ojtsignore
   */
  // eslint-disable-next-line no-unused-vars
  Components.callComponentMethod = function (componentElement, method, methodArguments) {
    if (!_isComponentElement(componentElement)) {
      throw new Error(_NOT_COMP);
    } else if (_isCompositeOrCustom(componentElement)) {
      if (componentElement[method]) {
        return componentElement[method].apply(componentElement, [].slice.call(arguments, 2));
      }
    } else {
      return Components.__GetWidgetConstructor(componentElement).apply(
        $(componentElement),
        [].slice.call(arguments, 1)
      );
    }
    return undefined;
  };

  /**
   * @private
   */
  function _applyToComponents(subtreeRoot, jqCallback) {
    var processFunc = function () {
      var jelem = $(this);
      var names = jelem.data(_OJ_WIDGET_NAMES_DATA);
      if (names != null) {
        for (var i = 0; i < names.length; i++) {
          var instance = jelem.data('oj-' + names[i]);
          if (instance != null) {
            jqCallback(instance);
          }
        }
      }
    };

    var locator = $(subtreeRoot);

    // Include the root node itself, and not just children ()
    if (locator.hasClass(_OJ_COMPONENT_NODE_CLASS)) {
      processFunc.call(subtreeRoot);
    }

    locator.find('.' + _OJ_COMPONENT_NODE_CLASS).each(processFunc);
  }

  /**
   * @private
   */
  function _applyHideShowToComponents(subtreeRoot, jqCallback, activateDefer) {
    // Detect hidden without forcing a layout.
    function isHidden(_node) {
      var node = _node;
      while (node) {
        if (node.nodeType === Node.DOCUMENT_NODE) {
          return false; // Walked up to document.  Not hidden
        }
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.classList.contains(_OJ_SUBTREE_HIDDEN_CLASS)
        ) {
          return true;
        }
        node = node.parentNode;
      }
      return true; // Didn't find document, so it must be detached and therefore hidden.
    }

    /**
     * Both node lists must be in document order.
     * Return new array containing nodes in 'allNodes' that are not in 'hiddenNodes'
     * @private
     */
    function filterHidden(allNodes, hiddenNodes) {
      var shownNodes = [];
      var j = 0;
      for (var i = 0; i < hiddenNodes.length; i++) {
        var hidden = hiddenNodes[i];
        while (j < allNodes.length && allNodes[j] !== hidden) {
          shownNodes.push(allNodes[j]);
          j += 1;
        }
        j += 1;
      }
      while (j < allNodes.length) {
        shownNodes.push(allNodes[j]);
        j += 1;
      }
      return shownNodes;
    }

    function processFunc(element) {
      if (jqCallback && element.classList.contains(_OJ_COMPONENT_NODE_CLASS)) {
        var jelem = $(element);
        var names = jelem.data(_OJ_WIDGET_NAMES_DATA);
        if (names != null) {
          for (var i = 0; i < names.length; i++) {
            var instance = jelem.data('oj-' + names[i]);
            if (instance != null) {
              jqCallback(instance);
            }
          }
        }
      }

      if (activateDefer && element.tagName.toLowerCase() === 'oj-defer') {
        if (element._activate) {
          element._activate();
        } else {
          throw new Error('subtreeShown called before module ojs/ojdefer was loaded');
        }
      }
    }

    if (!isHidden(subtreeRoot)) {
      processFunc(subtreeRoot);

      // Create selectors for jquery components and oj-defer as needed.
      var selectors = ['.' + _OJ_COMPONENT_NODE_CLASS];

      if (activateDefer) {
        selectors.push('oj-defer');
      }

      var hiddenSelectors = [];
      selectors.forEach(function (s) {
        hiddenSelectors.push('.' + _OJ_SUBTREE_HIDDEN_CLASS + ' ' + s);
        hiddenSelectors.push('.' + _OJ_PENDING_SUBTREE_HIDDEN_CLASS + ' ' + s);
      });

      // Create assemble a selector that gets all matches and the subset that are hidden
      var selector = selectors.join(',');
      var hiddenSelector = hiddenSelectors.join(',');

      // Fetch all matching elements and those that are hidden.
      // Use the second list to filter out hidden elements.
      var allNodes = subtreeRoot.querySelectorAll(selector);
      var hiddenNodes = subtreeRoot.querySelectorAll(hiddenSelector);
      var shownNodes = filterHidden(allNodes, hiddenNodes);

      for (var i = 0; i < shownNodes.length; i++) {
        processFunc(shownNodes[i]);
      }
    }
  }

  /**
   * @constructor
   * @param {!Function} callback
   * @private
   */
  function __ojDynamicGetter(callback) {
    this.getCallback = function () {
      return callback;
    };
  }

  /**
   * @ignore
   */
  function _accumulateValues(target, source, valueInArray) {
    var keys = Object.keys(source);

    keys.forEach(function (key) {
      var holder = target[key] || [];
      var sourceVal = source[key];
      if (valueInArray) {
        holder = holder.concat(sourceVal);
      } else {
        holder.push(sourceVal);
      }
      // eslint-disable-next-line no-param-reassign
      target[key] = holder;
    });
    return target;
  }

  /**
   * @ignore
   */
  function _isCompositeOrCustom(node) {
    return ojcustomelementUtils.CustomElementUtils.isElementRegistered(node.tagName);
  }

  /**
   * @ignore
   */
  function _isJQueryUI(node) {
    return !!Components.__GetWidgetConstructor(node);
  }

  /**
   * @ignore
   */
  function _isComponentElement(node) {
    return _isCompositeOrCustom(node) || _isJQueryUI(node);
  }

  /**
   * A bridge for a custom element that renders using a constructor
   * function. Note that when a constructor function is provided, the new instance isn't
   * created until the CreateComponent method so property changes that occur before the
   * component instance is created will no-op.
   *
   * Components that provide a constructor function should implement the following methods:
   * createDOM - Called when the component is instantiated
   * updateDOM - Called after createDOM and when the component needs to do a full render on
   * refresh and property changes if the component is not handling them separately.
   * handlePropertyChanged - (optional) Called when properties change and should return true if
   * the component has handled the property change and does not need to do a full render. If
   * false is returned, updateDOM will be called to do a full render.
   * static getDynamicDefaults - (optional) An optional method that can return an object with
   * non JSON compatible default values or getters for properties with dynamic default values,
   * e.g. theme dependent properties. If a default for a property is also found in metadata,
   * the dynamic value will be ignored.
   *
   * When the constructor function is called, the bridge will pass a context object
   * with the following keys:
   * element - The custom element
   * props - A proxy for the element properties with setter/getter and setProperty APIs allowing the
   *         component to control writeback.
   * unique - A unique ID that the component can append to the custom element ID to generate unique IDs
   *
   * Note that components supporting the constructor function approach may eventually
   * be refactored into composites once composites support non template rendering.
   *
   * This bridge ensures that JET components with child JET custom elements
   * can access child properties before the child busy state resolves.
   * This bridge does not guarantee that all properties for the child
   * will be available to the application before its busy states resolves,
   * e.g data bound attribute values.
   *
   * Applications should still wait on the element or page level
   * busy context before accessing properties or methods.
   *
   * @class
   * @ignore
   */
  const DefinitionalElementBridge = {};

  /**
   * Prototype for the JET component definitional bridge instance
   */
  DefinitionalElementBridge.proto = Object.create(oj.BaseCustomElementBridge.proto);
  oj.CollectionUtils.copyInto(DefinitionalElementBridge.proto, {
    beforePropertyChangedEvent: function (element, property, detail) {
      // Call the renderer function so the definitional element can refresh its UI
      var changedProp = property;
      var value = detail.value;
      if (detail.subproperty) {
        changedProp = detail.subproperty.path;
        value = detail.subproperty.value;
      }
      this._partialRender(element, changedProp, value);
    },

    AddComponentMethods: function (proto) {
      // Add refresh and subproperty getter/setter methods for all definitional elements
      // eslint-disable-next-line no-param-reassign
      proto.refresh = function () {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        bridge._fullRender(this);
      };
      // eslint-disable-next-line no-param-reassign
      proto.setProperty = function (prop, value) {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        if (!bridge.SaveEarlyPropertySet(this, prop, value)) {
          bridge.SetProperty(this, prop, value, this, true);
        }
      };
      // eslint-disable-next-line no-param-reassign
      proto.getProperty = function (prop) {
        // 'this' is the property object we pass to the definitional element contructor to track internal property changes
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        return bridge.GetProperty(this, prop, this);
      };
      // eslint-disable-next-line no-param-reassign
      proto._propsProto.setProperty = function (prop, value) {
        // 'this' is the property object we pass to the definitional element contructor to track internal property changes
        this._BRIDGE.SetProperty(this._ELEMENT, prop, value, this, false);
      };
      // eslint-disable-next-line no-param-reassign
      proto._propsProto.getProperty = function (prop) {
        return this._BRIDGE.GetProperty(this, prop, this);
      };
    },

    CreateComponent: function (element) {
      Components.unmarkPendingSubtreeHidden(element);

      if (!this._INSTANCE && this._EXTENSION._CONSTRUCTOR) {
        // We expose a similar set of properties as composites except that props is
        // not a Promise and we don't expose any slot information.
        // At the moment some definitional elements have mutation observers so they don't need
        // to rely on refresh being called to be alerted of new children so any cached slotMap
        // can become out of sync. We should add this once we build in support to auto detect
        // added/removed children to custom elements.
        var unique = ojcustomelementUtils.ElementUtils.getUniqueId();
        this._CONTEXT = {
          element: element,
          props: this._PROPS_PROXY,
          unique: unique
        };
        this._CONTEXT.uniqueId = element.id ? element.id : unique;
        this._INSTANCE = new this._EXTENSION._CONSTRUCTOR(this._CONTEXT);
        // Let the component initialize any additional DOM and then do a full render
        if (this._INSTANCE.createDOM) {
          this._INSTANCE.createDOM();
        }
        if (this._INSTANCE.updateDOM) {
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);
          try {
            this._INSTANCE.updateDOM();
          } finally {
            ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
          }
        }
      }
    },

    DefineMethodCallback: function (proto, method, methodMeta) {
      // eslint-disable-next-line no-param-reassign
      proto[method] = function () {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        if (bridge._INSTANCE) {
          var methodName = methodMeta.internalName || method;
          return bridge._INSTANCE[methodName].apply(bridge._INSTANCE, arguments);
        }
        return undefined;
      };
    },

    DefinePropertyCallback: function (proto, property, propertyMeta) {
      function set(value, bOuterSet) {
        // Properties can be set before the component is created. These early
        // sets are actually saved until after component creation and played back.
        if (!this._BRIDGE.SaveEarlyPropertySet(this._ELEMENT, property, value)) {
          if (bOuterSet) {
            // eslint-disable-next-line no-param-reassign
            value = ojcustomelementUtils.transformPreactValue(this._ELEMENT, propertyMeta, value);
          }
          var previousValue = this._BRIDGE._PROPS[property];
          if (!ojcustomelementUtils.ElementUtils.comparePropertyValues(propertyMeta.writeback, value, previousValue)) {
            // Skip validation for inner sets so we don't throw an error when updating readOnly writeable properties
            if (bOuterSet) {
              // eslint-disable-next-line no-param-reassign
              value = this._BRIDGE.ValidatePropertySet(this._ELEMENT, property, value);
            }
            if (propertyMeta._eventListener) {
              this._BRIDGE.SetEventListenerProperty(this._ELEMENT, property, value);
              this._BRIDGE._PROPS[property] = value;
            } else {
              this._BRIDGE._PROPS[property] = value;
              oj.BaseCustomElementBridge.__FirePropertyChangeEvent(
                this._ELEMENT,
                property,
                value,
                previousValue,
                bOuterSet ? 'external' : 'internal'
              );
              this._BRIDGE.State.dirtyProps.add(property);
            }
          } else {
            Logger.info(
              ojcustomelementUtils.CustomElementUtils.getElementInfo(this._ELEMENT) +
                ": Ignoring property set for property '" +
                property +
                "' with same value."
            );
          }
        }
      }

      function innerSet(value) {
        set.bind(this)(value, false);
      }

      // Called on the custom element
      function outerSet(value) {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        set.bind(bridge._PROPS_PROXY)(value, true);
      }

      function get() {
        var value = this._BRIDGE._PROPS[property];
        // If the attribute has not been set, return the default value
        if (value === undefined) {
          value = this._BRIDGE._getDefaultValue(property, propertyMeta);
          this._BRIDGE._PROPS[property] = value;
        }
        return value;
      }

      function innerGet() {
        return get.bind(this)();
      }

      // Called on the custom element
      function outerGet() {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        return get.bind(bridge._PROPS_PROXY)();
      }

      // Don't add event listener properties for inner props
      if (!propertyMeta._derived) {
        oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(
          proto._propsProto,
          property,
          innerGet,
          innerSet
        );
      }
      oj.BaseCustomElementBridge.__DefineDynamicObjectProperty(proto, property, outerGet, outerSet);
    },

    InitializeElement: function (element) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.InitializeElement.call(this, element);

      if (this._EXTENSION._CONTROLS_SUBTREE_HIDDEN) {
        Components.markPendingSubtreeHidden(element);
      }

      oj.BaseCustomElementBridge.__InitProperties(element, element);
    },

    InitializePrototype: function (proto) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.InitializePrototype.call(this, proto);

      Object.defineProperty(proto, '_propsProto', { value: {} });
    },

    initializeBridge: function (element, descriptor) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.initializeBridge.call(this, element, descriptor);

      this._EXTENSION = this.METADATA.extension || {};

      // For tracking outer property sets
      this._PROPS = {};

      // / For tracking inner property sets
      if (element._propsProto) {
        this._PROPS_PROXY = Object.create(element._propsProto);
        this._PROPS_PROXY._BRIDGE = this;
        this._PROPS_PROXY._ELEMENT = element;
      }
    },

    ShouldRemoveDisabled: function () {
      // Definitional components can opt in to have their disabled attribute removed.
      return this._EXTENSION._SHOULD_REMOVE_DISABLED === true;
    },

    // eslint-disable-next-line no-unused-vars
    _fullRender: function (element) {
      if (this._INSTANCE && this._INSTANCE.updateDOM) {
        ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);
        try {
          this._INSTANCE.updateDOM();
        } finally {
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
        }
      }
    },

    _partialRender: function (element, property, value) {
      if (this._INSTANCE) {
        // For partial renders, check to see if the component is handling the property change
        // or if it should do a full render
        var handlePropChangedFun = this._INSTANCE.handlePropertyChanged;
        var fullRender = !handlePropChangedFun || !handlePropChangedFun(property, value);
        if (fullRender && this._INSTANCE.updateDOM) {
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);
          try {
            this._INSTANCE.updateDOM();
          } finally {
            ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
          }
        }
      }
    },

    _getDefaultValue: function (property, propertyMeta) {
      if (this._EXTENSION._CONSTRUCTOR) {
        // The defaults object contains metadata and dynamic defaults
        var defaults = ojdefaultsutils.DefaultsUtils.getDefaults(this._EXTENSION._CONSTRUCTOR, this.METADATA, false);
        return defaults[property];
      }
      return MetadataUtils.getDefaultValue(propertyMeta);
    }
  });
  oj._registerLegacyNamespaceProp('DefinitionElementBridge', DefinitionalElementBridge);

  class WidgetState extends ojcustomelementUtils.ElementState {
      IsTransferAttribute(attrName) {
          const bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this.Element);
          const transferAttrs = bridge._EXTENSION._GLOBAL_TRANSFER_ATTRS;
          return bridge._WIDGET_ELEM && transferAttrs && transferAttrs.includes(attrName);
      }
      GetDescriptiveTransferAttributeValue(name) {
          const bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this.Element);
          return bridge._WIDGET_ELEM.getAttribute(name);
      }
  }

  const CustomElementBridge = {};

  /**
   * Prototype for the JET component custom element bridge instance
   */
  CustomElementBridge.proto = Object.create(oj.BaseCustomElementBridge.proto);
  oj._registerLegacyNamespaceProp('CustomElementBridge', CustomElementBridge);

  const getFocusEventPropagator = function (element, type) {
    return function (event) {
      // Ensure that the target is the custom element, not the inner element, so create
      // a new event and dispatch on the custom element.
      element.dispatchEvent(new FocusEvent(type, { relatedTarget: event.relatedTarget }));
    };
  };

  const getTeardownFunction = function (element, focusPropagator, blurPropagator) {
    return function () {
      element.removeEventListener('focus', focusPropagator);
      element.removeEventListener('blur', blurPropagator);
    };
  };

  oj.CollectionUtils.copyInto(CustomElementBridge.proto, {
    // Provides a promise for JET's Knockout throttling timeout
    // when knockout is used for the component
    getThrottlePromise: function () {
      var throttlePromise = this.State.getBindingProviderPromise();
      throttlePromise = throttlePromise.then(function (bindingProvider) {
        return bindingProvider ? bindingProvider.__GetThrottlePromise() : null;
      });
      return throttlePromise;
    },

    AddComponentMethods: function (proto) {
      // Add subproperty getter/setter
      // eslint-disable-next-line no-param-reassign
      proto.setProperty = function (prop, value) {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        if (!bridge.SaveEarlyPropertySet(this, prop, value)) {
          if (
            !bridge._setEventProperty(this, prop, value) &&
            !bridge._validateAndSetCopyProperty(this, prop, value, null)
          ) {
            // If not an event or copy property, check to see if it's a component specific property
            var meta = MetadataUtils.getPropertyMetadata(
              prop,
              ojcustomelementUtils.CustomElementUtils.getElementProperties(this)
            );
            // For non component specific properties, just set directly on the element instead.
            if (!meta) {
              this[prop] = value;
            } else {
              bridge._setOption(prop, value, meta, this);
              bridge.State.dirtyProps.add(prop.split('.')[0]);
            }
          }
        }
      };
      // eslint-disable-next-line no-param-reassign
      proto.getProperty = function (prop) {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        var meta = MetadataUtils.getPropertyMetadata(
          prop,
          ojcustomelementUtils.CustomElementUtils.getElementProperties(this)
        );

        // For event listeners and non component specific properties, return the property from the element.
        // Otherwise, return the widget property and let the widget handle dot notation for subproperties.
        if (ojcustomelementUtils.AttributeUtils.isEventListenerProperty(prop) || !meta) {
          return this[prop];
        }

        var ext = meta ? meta.extension : null;

        if (ext && ext._COPY_TO_INNER_ELEM) {
          return bridge._getCopyProperty(this, prop, meta);
        }
        return CustomElementBridge._getPropertyAccessor(this, prop)();
      };
      // Override HTMLELement's focus/blur methods so we can call focus/blur on an inner element if needed.
      // eslint-disable-next-line no-param-reassign
      proto.focus = function () {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        // If focus is called before the component has been created there
        // will be no saved widget instance yet so call the HTMLElement
        // focus instead.
        if (bridge._WIDGET_INSTANCE) {
          var focusElem = bridge._WIDGET_INSTANCE.__getFocusElement();
          if (focusElem) {
            if (focusElem !== this) {
              focusElem.focus();
            } else {
              HTMLElement.prototype.focus.call(this);
            }
          }
        } else {
          HTMLElement.prototype.focus.call(this);
        }
      };
      // eslint-disable-next-line no-param-reassign
      proto.blur = function () {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        if (bridge._WIDGET_INSTANCE) {
          var focusElem = bridge._WIDGET_INSTANCE.__getFocusElement();
          if (focusElem) {
            if (focusElem !== this) {
              focusElem.blur();
            } else {
              HTMLElement.prototype.blur.call(this);
            }
          }
        } else {
          HTMLElement.prototype.blur.call(this);
        }
      };
    },

    BatchedPropertySet: function (elem, props) {
      var keys = Object.keys(props);
      var processedMap = {};
      var i;

      for (i = 0; i < keys.length; i++) {
        var property = keys[i];
        var value = props[property];

        // exclude event proprties and transfer attributes from batch updates
        if (
          !this._setEventProperty(elem, property, value) &&
          !this._validateAndSetCopyProperty(elem, property, value, null)
        ) {
          value = this.ValidatePropertySet(elem, property, value);

          property = this.GetAliasForProperty(property);
          processedMap[property] = value;
        }
      }
      // Skip batched property sets if widget constructor isn't available meaning
      // the widget wasn't instantiated due to an error on creation or destroyed.
      var widgetConstructor = Components.__GetWidgetConstructor(this._WIDGET_ELEM);
      if (widgetConstructor) {
        widgetConstructor('option', processedMap);
      } else {
        for (i = 0; i < keys.length; i++) {
          var key = keys[i];
          elem.setProperty(key, props[key]);
        }
      }
    },

    CreateComponent: function (element) {
      var innerDomFun = this._INNER_DOM_FUNCTION;
      this._WIDGET_ELEM = CustomElementBridge._getWidgetElement(
        element,
        innerDomFun ? innerDomFun(element) : this._EXTENSION._INNER_ELEM
      );

      // Transfer global attributes and copy tagged properties to child element if one exists
      if (this._WIDGET_ELEM !== element) {
        var transferAttrs = this._EXTENSION._GLOBAL_TRANSFER_ATTRS || [];
        for (var i = 0; i < transferAttrs.length; i++) {
          var attr = transferAttrs[i];
          if (element.hasAttribute(attr)) {
            this._WIDGET_ELEM.setAttribute(attr, element.getAttribute(attr)); // @HTMLUpdateOK
            // Remove attribute from custom element after transfering value to inner element
            // Set a flag so we know that we're removing the attribute, not app so
            // that on attribute changed we don't remove it again
            this._removingTransfer = true;
            element.removeAttribute(attr);
          }
        }

        this._copyProperties();
      }

      Components.unmarkPendingSubtreeHidden(element);

      // Initialize jQuery object with options and pass element as wrapper if needed
      var locator = $(this._WIDGET_ELEM);
      var widgetConstructor = $(this._WIDGET_ELEM)[this._EXTENSION._WIDGET_NAME].bind(locator);
      widgetConstructor(this._PROPS);
      this._WIDGET = widgetConstructor;
      this._WIDGET_INSTANCE = widgetConstructor('instance');

      if (this._WRITEBACK_PROPS) {
        this._WIDGET_INSTANCE.__saveWritebackOptions(this._WRITEBACK_PROPS);
      }

      // Setup blur/focus listeners on inner element so we can trigger on the root custom element for 
      this._setupFocusPropagation(element);
    },

    DefineMethodCallback: function (proto, method, methodMeta) {
      // eslint-disable-next-line no-param-reassign
      proto[method] = function () {
        var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
        var methodName = methodMeta.internalName || method;
        ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);
        try {
          // Pass in null as thisArg to apply since the widget constructor is prebound to the jQuery element
          return bridge._WIDGET.apply(null, [methodName].concat([].slice.call(arguments)));
        } finally {
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
        }
      };
    },

    DefinePropertyCallback: function (proto, property, propertyMeta) {
      var ext = propertyMeta.extension;
      Object.defineProperty(proto, property, {
        enumerable: true,
        get: function () {
          var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
          if (propertyMeta._eventListener) {
            return bridge.GetEventListenerProperty(property);
          } else if (ext && ext._COPY_TO_INNER_ELEM) {
            return bridge._getCopyProperty(this, property, propertyMeta);
          }

          return CustomElementBridge._getPropertyAccessor(this, property)();
        },
        set: function (value) {
          var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(this);
          // Properties can be set before the component is created. These early
          // sets are actually saved until after component creation and played back.
          if (!bridge.SaveEarlyPropertySet(this, property, value)) {
            // eslint-disable-next-line no-param-reassign
            value = ojcustomelementUtils.transformPreactValue(this, propertyMeta, value);
            if (propertyMeta._eventListener) {
              bridge.SetEventListenerProperty(this, property, value);
            } else if (!bridge._validateAndSetCopyProperty(this, property, value, propertyMeta)) {
              bridge._setOption(property, value, propertyMeta, this);
              bridge.State.dirtyProps.add(property);
            }
          }
        }
      });
    },

    GetAttributes: function (metadata) {
      var attrs = MetadataUtils.getFlattenedAttributes(metadata.properties);
      if (metadata.extension._GLOBAL_TRANSFER_ATTRS) {
        attrs = attrs.concat(metadata.extension._GLOBAL_TRANSFER_ATTRS);
      }
      // Private array based API to allow widget based components to specify any
      // additional attributes they want to get notified about, e.g. data-oj-input-id.
      // These attributes will get passed through to the widget via the
      // __handleWatchedAttribute method.
      if (metadata.extension._WATCHED_ATTRS) {
        attrs = attrs.concat(metadata.extension._WATCHED_ATTRS);
      }
      return attrs;
    },

    GetAliasForProperty: function (property) {
      // Aliasing only supported for top level properties
      var alias = this._EXTENSION._ALIASED_PROPS;
      if (alias && alias[property]) {
        return alias[property];
      }
      return property;
    },

    InitializeElement: function (element) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.InitializeElement.call(this, element);

      if (this._EXTENSION._CONTROLS_SUBTREE_HIDDEN) {
        Components.markPendingSubtreeHidden(element);
      }

      oj.BaseCustomElementBridge.__InitProperties(element, this._PROPS);
    },

    HandleAttributeChanged: function (element, attr, oldValue, newValue) {
      var transferAttrs = this._EXTENSION._GLOBAL_TRANSFER_ATTRS;
      var bTransfer = transferAttrs && transferAttrs.indexOf(attr) !== -1;
      var watchedAttrs = this._EXTENSION._WATCHED_ATTRS;
      var bWatchedAttr = watchedAttrs && watchedAttrs.indexOf(attr) !== -1;
      if (bTransfer && this._WIDGET_ELEM) {
        if (!this._removingTransfer) {
          // When we transfer the attribute the app will not be able to remove the
          // attribute from the DOM, we will recommend binding the value if the value
          // needs to be toggled.
          this._WIDGET_ELEM.setAttribute(attr, newValue); // @HTMLUpdateOK
          // Remove attribute from custom element after transfering value to inner element
          // Set a flag so we know that we're removing the attribute, not app so
          // that on attribute changed we don't remove it again
          this._removingTransfer = true;
          element.removeAttribute(attr);
        } else if (this._removingTransfer) {
          this._removingTransfer = false;
        }
      } else if (bWatchedAttr && oldValue !== newValue && this._WIDGET_INSTANCE) {
        // Check to see if this is attribute is being watched by the component
        // in which case we will just pass this through as is without converting
        // the attribute to a property name. Components are responsible for retrieving
        // attribute values on component initialization. This method only handles changes
        // after the fact.
        this._WIDGET_INSTANCE.__handleWatchedAttribute(attr, oldValue, newValue);
      }
    },

    HandleDetached: function (element) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.HandleDetached.call(this, element);

      // Only call __handleDisconnected if the component hasn't previously
      // been destroyed which we can check by seeing if the widget constructor is null
      if (Components.__GetWidgetConstructor(this._WIDGET_ELEM) && this._WIDGET_INSTANCE) {
        this._WIDGET_INSTANCE.__handleDisconnected();
      }

      this._teardownFocusPropagation(element);
    },

    HandleReattached: function (element) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.HandleReattached.call(this, element);

      this._setupFocusPropagation(element);

      if (this._WIDGET_INSTANCE) {
        this._WIDGET_INSTANCE.__handleConnected();
      }
    },

    initializeBridge: function (element, descriptor) {
      // Invoke callback on the superclass
      oj.BaseCustomElementBridge.proto.initializeBridge.call(this, element, descriptor);

      this._INNER_DOM_FUNCTION = descriptor.innerDomFunction;

      this._EXTENSION = this.METADATA.extension || {};

      this._PROPS =
        this._EXTENSION._INNER_ELEM || this._INNER_DOM_FUNCTION ? { _wrapper: element } : {};
      this._setupPropertyAccumulator(element, this._PROPS);

      // Checks metadata for copy and writeback properties
      this._processProperties(element);
    },

    /**
     * Sets an option value on the widget, handling default values when undefined is set.
     * @param {string} property
     * @param {any} value
     * @param {object} meta
     * @param {HTMLElement} element
     * @private
     */
    _setOption: function (property, value, meta, element) {
      // For widget based components, see if there is a default value assigned in the
      // metadata if application tries to unset the property. Property unsetting is only
      // supported for top level properties and not subproperties. For composites and
      // definitional elements, this is handled in the getter since the bridge handles
      // sets/gets, but for widget based components the bridge only calls through to the
      // widget code which initializes the component to the default value (which should match
      // the metadata default)
      let flags = {};
      if (value === undefined && property.indexOf('.') === -1) {
        flags = { _context: { skipEvent: true } };
        // eslint-disable-next-line no-param-reassign
        value = MetadataUtils.getDefaultValue(meta);
        // Usually the widget logic fires the property changed events, but in this case
        // the app has set undefined, but we're setting the default value on the widget so
        // we'll handle firing the property changed from the bridge code for this case
        // and skip the event in the widget code.
        if (this.State.isComplete()) {
          const previousValue = element[property];
          oj.BaseCustomElementBridge.__FirePropertyChangeEvent(
            element,
            property,
            undefined,
            previousValue,
            'external'
          );
        }
      }
      CustomElementBridge._getPropertyAccessor(element, property, flags)(value);
    },

    _copyProperties: function () {
      // Copies properties from the bridge _PROPS before the widget is instantiated
      // removing copied props from the object
      if (this._COPY_ATTRS) {
        for (var i = 0; i < this._COPY_ATTRS.length; i++) {
          var attr = this._COPY_ATTRS[i];
          var propName = ojcustomelementUtils.AttributeUtils.attributeToPropertyName(attr);
          if (Object.prototype.hasOwnProperty.call(this._PROPS, propName)) {
            var value = this._PROPS[propName];
            this._setCopyProperty(attr, value);
            // Delete the attribute we just copied from the options that we
            // instantiate the widget with
            delete this._PROPS[propName];
          }
        }
      }
    },

    _getCopyProperty: function (elem, prop, propMeta) {
      var attrName = ojcustomelementUtils.AttributeUtils.propertyNameToAttribute(prop);
      var ext = propMeta.extension;
      if (ext._ATTRIBUTE_ONLY) {
        if (this._WIDGET_ELEM.hasAttribute(attrName)) {
          var value = this._WIDGET_ELEM.getAttribute(attrName);
          return ojcustomelementUtils.AttributeUtils.attributeToPropertyValue(elem, attrName, value, propMeta);
        }
        return null;
      }
      return this._WIDGET_ELEM[prop];
    },

    _processProperties: function (element) {
      var props = ojcustomelementUtils.CustomElementUtils.getElementProperties(element);
      if (props) {
        var propKeys = Object.keys(props);
        for (var i = 0; i < propKeys.length; i++) {
          var propName = propKeys[i];
          var propMeta = props[propName];
          // Store writeback properties on the bridge and set on widget when we instantiate it later
          if (propMeta.writeback) {
            if (!this._WRITEBACK_PROPS) {
              this._WRITEBACK_PROPS = {};
            }
            this._WRITEBACK_PROPS[propName] = true;
          }
          // Store properties to copy to inner element for easy lookup
          var ext = propMeta.extension;
          if (ext && ext._COPY_TO_INNER_ELEM) {
            if (!this._COPY_ATTRS) {
              this._COPY_ATTRS = [];
            }
            this._COPY_ATTRS.push(propName);
          }
        }
      }
    },

    _setCopyProperty: function (attribute, value) {
      if (value == null || value === false) {
        this._WIDGET_ELEM.removeAttribute(attribute);
      } else if (value === true) {
        this._WIDGET_ELEM.setAttribute(attribute, ''); // @HTMLUpdateOK
      } else {
        this._WIDGET_ELEM.setAttribute(attribute, value); // @HTMLUpdateOK
      }
    },

    _setupPropertyAccumulator: function (element, widgetOptions) {
      // Add an element function that will track property values until expressions are all evaluated.
      // This object will be replaced with the actual widget constructor.
      this._WIDGET = function (method, prop, value) {
        // Allow property access before widget is created for element binding and dynamic element creation
        if (method === 'option') {
          oj.BaseCustomElementBridge.__SetProperty(
            this.GetAliasForProperty.bind(this),
            widgetOptions,
            prop,
            value
          );
          return widgetOptions[prop];
        }

        // throw is eslint hack to fix consistent-return
        throw new ojcustomelementUtils.JetElementError(element, 'Cannot access methods before element is upgraded.');
      };
    },

    _validateAndSetCopyProperty: function (elem, prop, value, propMeta) {
      // propMeta is could be null so we should retrieve it if not passed in

      var attrName = ojcustomelementUtils.AttributeUtils.propertyNameToAttribute(prop);
      var isCopy = this._COPY_ATTRS && this._COPY_ATTRS.indexOf(attrName) !== -1;
      // If widget hasn't been instantiated skip setting until CreateComponent
      if (isCopy) {
        // We need to validate the value so that we don't copy an invalid value.
        // eslint-disable-next-line no-param-reassign
        value = this.ValidatePropertySet(elem, prop, value);

        if (this._WIDGET_ELEM) {
          if (!propMeta) {
            // eslint-disable-next-line no-param-reassign
            propMeta = MetadataUtils.getPropertyMetadata(
              prop,
              ojcustomelementUtils.CustomElementUtils.getElementProperties(elem)
            );
          }

          var previousValue = this._getCopyProperty(elem, prop, propMeta);
          this._setCopyProperty(attrName, value);
          // Fire a property change event for the copy properties since we don't actually pass
          // these to the widget. The widget will never update these properties themselves so
          // all updates are external.
          oj.BaseCustomElementBridge.__FirePropertyChangeEvent(
            elem,
            prop,
            this._getCopyProperty(elem, prop, propMeta),
            previousValue,
            'external'
          );
        } else {
          // Save the value until inner widget is created and we can copy them over
          this._PROPS[attrName] = value;
        }
      }
      return isCopy;
    },

    _setEventProperty: function (elem, prop, value) {
      var isEvent = ojcustomelementUtils.AttributeUtils.isEventListenerProperty(prop);
      if (isEvent) {
        // eslint-disable-next-line no-param-reassign
        elem[prop] = value;
      }
      return isEvent;
    },

    _setupFocusPropagation: function (element) {
      // Setup blur/focus listeners on inner element so we can trigger on the root custom element for 
      const focusElem = this._WIDGET_INSTANCE.__getFocusElement();
      if (focusElem && focusElem !== element) {
        const focusPropagator = getFocusEventPropagator(element, 'focus');
        const blurPropagator = getFocusEventPropagator(element, 'blur');
        focusElem.addEventListener('focus', focusPropagator);
        focusElem.addEventListener('blur', blurPropagator);
        this._teardownFocus = getTeardownFunction(focusElem, focusPropagator, blurPropagator);
      }
    },

    _teardownFocusPropagation: function () {
      if (this._teardownFocus) {
        this._teardownFocus();
        this._teardownFocus = null;
      }
    }
  });

  /** ***********************/
  /* PUBLIC STATIC METHODS */
  /** ***********************/

  /**
   * Returns the metadata object for the given component.
   * @param  {string} tagName        The component tag name
   * @return {Object}                The component metadata object
   * @ignore
   */
  CustomElementBridge.getMetadata = function (tagName) {
    return CustomElementBridge._METADATA_MAP[tagName.toLowerCase()];
  };

  /**
   * Checks whether the specified event type was declared in the metadata for this custom element
   * @param {Element} element the custom element
   * @param {string} type the event type (e.g. "beforeExpand")
   * @return {boolean} true if the event type was declared in the metadata, false otherwise
   * @ignore
   */
  CustomElementBridge.isKnownEvent = function (element, type) {
    var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(element);
    return (bridge.METADATA.events && bridge.METADATA.events[type]) != null;
  };

  /**
   * Checks whether the specified property was declared in the metadata for this custom element
   * @param {Element} element the custom element
   * @param {string} prop the property name (e.g. "selection")
   * @return {boolean} true if the property was declared in the metadata, false otherwise
   * @ignore
   */
  CustomElementBridge.isKnownProperty = function (element, prop) {
    var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(element);
    return (bridge.METADATA.properties && bridge.METADATA.properties[prop]) != null;
  };

  /**
   * Returns the custom element property for a given aliased component property which can be used
   * for converting an internal optionChange event, e.g. returning readonly for oj-switch's readOnly
   * property so we can fire a readonly-changed event instead of readOnly-changed.
   * Will return the original property if there is no aliasing.
   * @param {Element} element The custom element
   * @param {string} property The component property
   * @return {string}
   * @ignore
   */
  CustomElementBridge.getPropertyForAlias = function (element, property) {
    // Aliasing only supported for top level properties
    var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(element);
    var alias = bridge._EXTENSION._COMPONENT_TO_ELEMENT_ALIASES;
    if (alias && alias[property]) {
      return alias[property];
    }
    return property;
  };

  /**
   * Registers a component as a custom element.
   * @param {string} tagName The component tag name (all lower case), which should contain a dash '-' and not be a reserved tag name.
   * @param {Object} descriptor The registration descriptor. The descriptor will contain keys for metadata and other component overrides.
   * @param {Object} descriptor.metadata The JSON object containing info like the widget name, whether component has an inner element, an outer wrapper, and the component metadata.
   * @param {function(string, string, Object, function(string))} descriptor.parseFunction The function that will be called to parse attribute values.
   * Note that this function is only called for non bound attributes. The parseFunction will take the following parameters:
   * <ul>
   *  <li>{string} value: The value to parse.</li>
   *  <li>{string} name: The name of the attribute.</li>
   *  <li>{Object} meta: The metadata object for the property which can include its type, default value,
   *      and any extensions that the composite has provided on top of the required metadata.</li>
   *  <li>{function(string)} defaultParseFunction: The default parse function for the given attribute
   *      type which is used when a custom parse function isn't provided and takes as its parameters
   *      the value to parse.</li>
   * </ul>
   * @param {Element} descriptor.innerDomFunction The function that will be called to return the tag name of the inner DOM element, e.g. 'button' or 'a'
   * The innerDomFunction will take the following parameters:
   * <ul>
   *  <li>{Element} element: The component custom element.</li>
   * </ul>
   * @ignore
   */
  CustomElementBridge.register = function (tagName, descriptor) {
    var meta = descriptor[oj.BaseCustomElementBridge.DESC_KEY_META];
    meta = oj.BaseCustomElementBridge.__ProcessEventListeners(meta);
    // eslint-disable-next-line no-param-reassign
    descriptor[oj.BaseCustomElementBridge.DESC_KEY_META] = meta;
    CustomElementBridge._METADATA_MAP[tagName.toLowerCase()] = meta;

    var ext = meta.extension;
    // Use the simple definitional element prototype if no real widget is associated with this custom element
    var bridgeProto =
      ext && ext._WIDGET_NAME ? CustomElementBridge.proto : DefinitionalElementBridge.proto;
    const stateClass = ext && ext._WIDGET_NAME ? WidgetState : ojcustomelementUtils.ElementState;

    // Create component to element property alias mapping for easy optionChange lookup and stash it in the extension object
    var aliasMap = ext._ALIASED_PROPS;
    if (aliasMap) {
      ext._COMPONENT_TO_ELEMENT_ALIASES = {};
      var aliases = Object.keys(aliasMap);
      aliases.forEach(function (alias) {
        ext._COMPONENT_TO_ELEMENT_ALIASES[aliasMap[alias]] = alias;
      });
    }

    const registration = { descriptor, bridgeProto, stateClass };
    ojcustomelementUtils.CustomElementUtils.registerElement(tagName, registration, bridgeProto.getClass(descriptor));
  };

  /** ***************************/
  /* NON PUBLIC STATIC METHODS */
  /** ***************************/

  /**
   * Returns a property accessor for setting/getting options
   * @private
   */
  CustomElementBridge._getPropertyAccessor = function (element, property, flags) {
    function optionAccessor(value) {
      var bridge = ojcustomelementUtils.CustomElementUtils.getElementBridge(element);
      // option set case
      if (arguments.length === 1) {
        // eslint-disable-next-line no-param-reassign
        value = bridge.ValidatePropertySet(element, property, value);
        // eslint-disable-next-line no-param-reassign
        property = bridge.GetAliasForProperty(property);
        bridge._WIDGET('option', property, value, flags);
        return undefined;
      }
      // option get case
      // eslint-disable-next-line no-param-reassign
      property = bridge.GetAliasForProperty(property);
      return bridge._WIDGET('option', property);
    }

    return optionAccessor.bind(element);
  };

  /**
   * Returns the element that the widget constructor will be instantiated on which can be the custom element or a child element.
   * @private
   */
  CustomElementBridge._getWidgetElement = function (element, innerTagName) {
    // If component widget is bound to an inner child element like <ul> for <oj-list-view>,
    // create one only if the application does not provide it.
    var widgetElem = element;
    if (innerTagName) {
      var firstChild = element.firstElementChild;
      if (firstChild && firstChild.tagName.toLowerCase() === innerTagName) {
        widgetElem = firstChild;
      } else {
        widgetElem = document.createElement(innerTagName); // @HTMLUpdateOK
        // Make a copy of the custom element children before appending the inner element
        var children = [];
        var nodeList = element.childNodes;
        for (var i = 0; i < nodeList.length; i++) {
          children.push(nodeList[i]);
        }

        element.appendChild(widgetElem); // @HTMLUpdateOK
        // If we create the inner child element, check to see if there are any children
        // to move like for <oj-button> which can have a child elements that should be moved to
        // the newly created inner <button> element.
        while (children.length) {
          var child = children.shift();
          // Only move default slot children to inner child element. Default slot children are those
          // that do not explictly set a slot attribute (or have one passed from a composite) or have slot=''.
          // The component will be responsible for moving all named slot children.
          // For example, it does not make sense for <oj-list-view> to move contextMenu slot to its inner <ul> element.
          if (!ojcustomelementUtils.CustomElementUtils.getSlotAssignment(child)) {
            widgetElem.appendChild(child);
          }
        }
      }
      // add data-oj-internal attribute for automation tests
      widgetElem.setAttribute('data-oj-internal', '');
    }
    return widgetElem;
  };

  /**
   * Map of registered custom element names
   * @private
   */
  CustomElementBridge._METADATA_MAP = {};

  class DataProviderFeatureChecker {
      static isDataProvider(dataprovider) {
          if (dataprovider && dataprovider['fetchFirst']) {
              return true;
          }
          return false;
      }
      static isTreeDataProvider(dataprovider) {
          if (dataprovider && dataprovider['getChildDataProvider']) {
              return true;
          }
          return false;
      }
  }
  oj$1._registerLegacyNamespaceProp('DataProviderFeatureChecker', DataProviderFeatureChecker);

  /**
   * @private
   */
  var _OJ_TRANSLATIONS_OPTION = 'translations';

  /**
   * @private
   */
  var _OJ_TRANSLATIONS_PREFIX = _OJ_TRANSLATIONS_OPTION + '.';

  /**
   * @private
   */
  const _DISABLED = 'oj-disabled';

  /**
   * @private
   */
  const _START_BOTTOM = 'start bottom';

  /**
   * @private
   */
  var _OJ_COMPONENT_EVENT_OVERRIDES = {
    isDefaultPrevented: function () {
      return false;
    },
    preventDefault: function () {
      this.isDefaultPrevented = _returnTrue;
    },
    stopPropagation: function () {
      this.isPropagationStopped = _returnTrue;
    },
    stopImmediatePropagation: function () {
      this.isImmediatePropagationStopped = _returnTrue;
    }
  };

  (function () {
    // BaseComponent wrapper function, to keep "private static members" private
    /**
     * @private
     */
    var _BASE_COMPONENT = 'baseComponent';
    var _STATE_CONNECTED = 0;
    var _STATE_DISCONNECTED = 1;

    // -----------------------------------------------------------------------------
    // "private static members" shared by all components
    // -----------------------------------------------------------------------------

    var _lastActiveElement;

    /**
     * @ojcomponent oj.baseComponent
     * @abstract
     * @since 0.6.0
     */
    $.widget('oj.' + _BASE_COMPONENT, {
      options: {
        /**
         * <p>There is no restriction on the order in which the JET Menu and the referencing component are initialized.  However, when specifying
         * the Menu via the HTML attribute, the referenced DOM element must be in the document at the time that the referencing component is
         * initialized.
         *
         * @ojfragment contextMenuInitOrderDoc - Decomped to fragment so Tabs, Tree, and MasonryLayout can override the fragment to convey their init order restrictions.
         * @memberof oj.baseComponent
         */
        /**
         * <p>To help determine whether it's appropriate to cancel the launch or customize the menu, the <code class="prettyprint">beforeOpen</code>
         * listener can use component API's to determine which table cell, chart item, etc., is the target of the context menu. See the JSDoc and
         * demos of the individual components for details.  Keep in mind that any such logic must work whether the context menu was launched via right-click,
         * <kbd>Shift-F10</kbd>, <kbd>Press & Hold</kbd>, or component-specific touch gesture.
         *
         * @ojfragment contextMenuTargetDoc - Decomped to fragment so components can override the fragment to convey their specific API's for this.
         * @memberof oj.baseComponent
         */
        /**
         * <p>Identifies the [JET Menu]{@link oj.ojMenu} that the component should launch as a context menu on right-click, <kbd>Shift-F10</kbd>, <kbd>Press & Hold</kbd>,
         * or component-specific gesture. If specified, the browser's native context menu will be replaced by the specified JET Menu.
         *
         * <p>The value can be an HTML element, JQ selector, JQ object, NodeList, or array of elements.  In all cases, the first indicated element is used.
         *
         * <p>To specify a JET context menu on a DOM element that is not a JET component, see the <code class="prettyprint">ojContextMenu</code> binding.
         *
         * <p>To make the page semantically accurate from the outset, applications are encouraged to specify the context menu via the standard
         * HTML5 syntax shown in the below example.  When the component is initialized, the context menu thus specified will be set on the component.
         *
         * {@ojinclude "name":"contextMenuInitOrderDoc"}
         *
         * <p>After create time, the <code class="prettyprint">contextMenu</code> option should be set via this API, not by setting the DOM attribute.
         *
         * <p>The application can register a listener for the Menu's [beforeOpen]{@link oj.ojMenu#event:beforeOpen} event.  The listener can cancel the
         * launch via <code class="prettyprint">event.preventDefault()</code>, or it can customize the menu contents by editing the menu DOM directly,
         * and then calling [refresh()]{@link oj.ojMenu#refresh} on the Menu.
         *
         * {@ojinclude "name":"contextMenuTargetDoc"}
         *
         * @ojfragment contextMenuDoc - Decomped to fragment so subclasses can extend the verbiage as needed, by ojinclude'ing this fragment and then adding their own verbiage.
         * @memberof oj.baseComponent
         */
        /**
         * {@ojinclude "name":"contextMenuDoc"}
         *
         * @ignore
         * @expose
         * @memberof oj.baseComponent
         * @instance
         * @type {Element|Array.<Element>|string|jQuery|NodeList}
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
         * @ignore
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
         * <p> If the component does not contain any translatable resource, the default value of this attribute will be
         * <code class="prettyprint">null</code>. If not, an object containing all resources relevant to the component.
         *
         * <p>If this component has translations, their documentation immediately follows this doc entry.
         *
         * @member
         * @name translations
         * @ojshortdesc A collection of translated resources from the translation bundle, or null if this component has no resources.
         * @memberof oj.baseComponent
         * @instance
         * @ojtranslatable
         * @type {object|null}
         *
         *
         * @example <caption>Initialize the component, overriding some translated resources and leaving the others intact:</caption>
         * &lt;!-- Using dot notation -->
         * &lt;oj-some-element translations.some-key='some value' translations.some-other-key='some other value'>&lt;/oj-some-element>
         *
         * &lt;!-- Using JSON notation -->
         * &lt;oj-some-element translations='{"someKey":"some value", "someOtherKey":"some other value"}'>&lt;/oj-some-element>
         *
         * @example <caption>Get or set the <code class="prettyprint">translations</code> property after initialization:</caption>
         * // Get one
         * var value = myComponent.translations.someKey;
         *
         * // Set one, leaving the others intact. Always use the setProperty API for
         * // subproperties rather than setting a subproperty directly.
         * myComponent.setProperty('translations.someKey', 'some value');
         *
         * // Get all
         * var values = myComponent.translations;
         *
         * // Set all.  Must list every resource key, as those not listed are lost.
         * myComponent.translations = {
         *     someKey: 'some value',
         *     someOtherKey: 'some other value'
         * };
         *
         */
        // translations property is initialized programmatically, so this top-level API doc lives in this virtual comment.
        // Translations for all components are listed and JSDoc'ed in rt\src\main\resources\nls\root\ojtranslations.js.
        // That JSDoc appears in the same generated doc page as this top-level doc.

        // Events
        /**
         * Fired whenever a supported component option changes, whether due to user interaction or programmatic
         * intervention.  If the new value is the same as the previous value, no event will be fired.  The event
         * listener will receive two parameters described below:
         *
         * @property {Event} event <code class="prettyprint">jQuery</code> event object
         * @property {Object} ui event payload
         * @property {string} ui.option the name of the option that changed.
         * @property {Object} ui.previousValue - an Object holding the previous value of the option.
         * When previousValue is not a primitive type, i.e., is an Object, it may hold the same value as
         * the value property.
         * @property {Object} ui.value - an Object holding the current value of the option.
         * @property {?Object} ui.subproperty - an Object holding information about the subproperty that changed.
         * @property {string} ui.subproperty.path - the subproperty path that changed.
         * @property {Object} ui.subproperty.previousValue - an Object holding the previous value of the subproperty.
         * @property {Object} ui.subproperty.value - an Object holding the current value of the subproperty.
         * @property {Object} ui.optionMetadata information about the option that changed
         * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
         *  <code class="prettyprint">"shouldNotWrite"</code>. For use by the JET writeback mechanism;
         *  'shouldWrite' indicates that the value should be written to the observable.
         *
         * @example <caption>Initialize component with the <code class="prettyprint">optionChange</code> callback</caption>
         * // Foo is Button, InputText, etc.
         * $(".selector").ojFoo({
         *   'optionChange': function (event, ui) {}
         * });
         * @example <caption>Bind an event listener to the ojoptionchange event</caption>
         * $(".selector").on({
         *   'ojoptionchange': function (event, ui) {
         *       // verify that the component firing the event is a component of interest
         *       if ($(event.target).is(".mySelector")) {
         *           window.console.log("option that changed is: " + ui['option']);
         *       }
         *   };
         * });
         *
         * @ignore
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
         *       // verify that the component firing the event is a component of interest
         *       if ($(event.target).is(".mySelector")) {
         *           window.console.log("The DOM node id for the destroyed component is : %s", event.target.id);
         *       }
         *   };
         * });
         *
         * @ignore
         * @memberof oj.baseComponent
         * @expose
         * @event
         * @instance
         */
        destroy: undefined
      },

      // TODO: flesh out JSDoc verbiage, re: call after dom changes underneath component...
      /**
       * Refreshes the component.
       * @return {void}
       * @expose
       * @memberof oj.baseComponent
       * @instance
       */
      refresh: function () {
        this._propertyContext = null;
        // if application sets the context menu after initialization, it must refresh the component
        this._SetupContextMenu();
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
      _createWidget: function (options, element) {
        // Save wrapper element
        if (options) {
          this.OuterWrapper = options._wrapper;
        }

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
      _SetRootAttributes: function () {
        var value = this.options.rootAttributes;
        if (value) {
          var widget = this.widget();
          if (widget == null) {
            return;
          }

          var classValue = value.class;

          if (classValue) {
            widget.addClass(classValue);
          }

          var styleValue = value.style;

          if (styleValue) {
            Logger.error(`The rootAttributes.style option violates the recommended
          Content Security Policy which disallows inline styles and is therefore ignored.
          Use the rootAttributes.class option instead.`);
          }

          // make shallow copy, remove class and style from the copy, and set all
          // remaining attrs on the element.  Currently id is the only remaining attr
          // that we support.
          value = $.extend({}, value);
          delete value.class;
          delete value.style;

          widget.attr(value);

          delete value.id; // remove the remaining supported value
          var unsupportedAttrs = Object.keys(value);
          if (unsupportedAttrs.length) {
            throw new Error(
              'Unsupported values passed to rootAttributes option: ' + unsupportedAttrs.toString()
            );
          }
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
      _create: function () {
        this._SaveAttributes(this.element);
        this._InitOptions(this._originalDefaults, this._constructorOptions);

        delete this._originalDefaults;
        delete this._constructorOptions;

        this._ComponentCreate();
        this._AfterCreate();

        // allow subcomponent to setup needed resources
        // after the component is created.
        this._SetupResources();

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
      _InitOptions: function (originalDefaults, constructorOptions) {
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
      _ComponentCreate: function () {
        // Store widget name, so that oj.Components.__GetWidgetConstructor() can get widget from the element
        _storeWidgetName(this.element, this.widgetName);

        // namespace facilitates removing activeable and hoverable handlers handlers separately
        this.activeableEventNamespace = this.eventNamespace + 'activeable';
        this.hoverableEventNamespace = this.eventNamespace + 'hoverable';
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
      _AfterCreate: function () {
        this._SetRootAttributes(); // do first, since has no dependencies, but other stuff might care about these attrs

        // namespace facilitates removing contextMenu handlers separately, if app clears the "contextMenu" option
        this.contextMenuEventNamespace = this.eventNamespace + 'contextMenu';
        // same for activeable and hoverable handlers
        this.activeableEventNamespace = this.eventNamespace + 'activeable';
        this.hoverableEventNamespace = this.eventNamespace + 'hoverable';
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
      _AfterCreateEvent: $.noop,

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

      //  - remove JQUI memory leaks and CSS cruft introduced in 1.12 and 1.12.1
      _setOptionClasses: function () {},
      _setOptionDisabled: function () {},
      _classes: function () {
        return '';
      },
      _removeClass: function () {
        return this;
      },
      _addClass: function () {
        return this;
      },
      _toggleClass: function () {
        return this;
      },

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
      // eslint-disable-next-line no-unused-vars
      _SaveAttributes: function (element) {
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
       *       attributes[m]["name"] : {"attr": attributes[m]["value"]
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
      _SaveAllAttributes: function (element) {
        var self = this;
        this._savedAttributes = [];

        $.each(element, function (index, ele) {
          // need to be able to save for multiple elements
          var saveAttributes = {};
          var save = { element: ele, attributes: saveAttributes };
          var attributes = ele.attributes;

          self._savedAttributes.push(save);

          $.each(attributes, function (index2, attr) {
            // for proper access certain so called attributes should be accessed as properties
            // [i.e. required, disabled] so fetch them initially
            var attrName = attr.name;

            saveAttributes[attrName] = { attr: attr.value };
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
      _GetSavedAttributes: function (element) {
        var savedAttributes = this._savedAttributes;

        // The component may not have saved any attributes. If so, return.
        if (savedAttributes === undefined) {
          return null;
        }

        var domElement = element[0];

        for (var i = 0, j = savedAttributes.length; i < j; i++) {
          var curr = savedAttributes[i];

          if (curr.element === domElement) {
            return curr.attributes;
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
      _RestoreAttributes: function () {
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
      _RestoreAllAttributes: function () {
        $.each(this._savedAttributes, function (index, savedAttr) {
          var element = $(savedAttr.element);
          var attributes = savedAttr.attributes;

          // sanity check
          if (element.length === 1) {
            var currAttr = savedAttr.element.attributes;
            var removeAttr = [];
            var i;
            var j;

            // request is to remove any attributes that didn't exist previously
            // need to store the attributes in an array and remove them afterwards as otherwise there are side affects
            for (i = 0, j = currAttr.length; i < j; i++) {
              if (!(currAttr[i].name in attributes)) {
                removeAttr.push(currAttr[i].name);
              }
            }

            for (i = 0, j = removeAttr.length; i < j; i++) {
              // csp error to removeAttribute('style') (which element.removeAttr will do),
              // so instead set it to null
              if (removeAttr[i] === 'style') {
                element[0].style = null;
              } else {
                element.removeAttr(removeAttr[i]);
              }
            }

            var attributeKeys = Object.keys(attributes);
            for (i = 0; i < attributeKeys.length; i++) {
              var attribute = attributeKeys[i];
              var emptyStyle = attribute === 'style' && attributes[attribute].attr === '';
              if (!emptyStyle) {
                element.attr(attribute, attributes[attribute].attr); // @HTMLUpdateOK
              } else {
                // csp error to setAttribute('style', '') (which element.attr will do),
                // so instead set it to null
                element[0].style = null;
              }
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
      _GetTranslationsSectionName: function () {
        return this.widgetFullName;
      },

      /**
       * Compares 2 option values for equality and returns true if they are equal; false otherwise.
       * This method is called before _setOptions()/_internalSetOptions() to prevent an extra call
       * with the same values when observables are written back. Components should override this
       * method for options with non primitive writeback values like Arrays or Objects and ensure
       * their metadata has writeback properties correctly indicated.
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
      _CompareOptionValues: function (option, value1, value2) {
        // We process the metadata for custom elements for writeback properties and save them on the component.
        // For jQuery syntax, components are expected to override this method to check writeback values since
        // there's not always a straightforward mapping of custom element to jQuery widget name.
        if (this._IsCustomElement() && this._getWritebackOption(option)) {
          return oj.Object.compareValues(value1, value2);
        }

        return value1 === value2;
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
      // eslint-disable-next-line no-unused-vars, camelcase
      getTranslatedString: function (key, var_args) {
        var params = {};

        if (arguments.length > 2) {
          params = Array.prototype.slice.call(arguments, 1);
        } else if (arguments.length === 2) {
          params = arguments[1];
          if (typeof params !== 'object' && !(params instanceof Array)) {
            params = [params];
          }
        }
        var pattern = this.option(_OJ_TRANSLATIONS_PREFIX + key);
        // pattern could be undefined
        return pattern == null ? key : Translations.applyParameters(pattern.toString(), params);
      },

      // Subclasses should doc their sub-id's in the Sub-ID's section, via the ojsubid tag, not by overriding
      // and extending this method doc, which should remain general purpose.
      /**
       * <p>Returns the DOM node indicated by the <code class="prettyprint">locator</code> parameter.
       *
       * <p>If the <code class="prettyprint">locator</code> or its <code class="prettyprint">subId</code> is
       * <code class="prettyprint">null</code>, then this method returns this element.
       *
       * <p>If a non-null <code class="prettyprint">subId</code> is provided but no corresponding node
       * can be located, then this method returns <code class="prettyprint">null</code>.
       *
       * <p>This method is intended for use in test automation only, and should not be used in a production environment.
       *
       * @expose
       * @memberof oj.baseComponent
       * @instance
       * @ignore
       *
       * @param {Object} locator An Object containing, at minimum, a <code class="prettyprint">subId</code>
       * property, whose value is a string that identifies a particular DOM node in this element.
       *
       * <p>If this component has any subIds, then they are documented in the
       * <a href="#subids-section">Sub-ID's</a> section of this document.
       *
       * <p>Some components may support additional fields of the
       * <code class="prettyprint">locator</code> Object, to further specify the desired node.
       *
       * @returns {Element|null} The DOM node located by the
       * <code class="prettyprint">locator</code>, or <code class="prettyprint">null</code> if none is found.
       *
       * @example <caption>Get the node for a certain subId:</caption>
       * var node = myComponent.getNodeBySubId({'subId': 'oj-some-sub-id'});
       */
      getNodeBySubId: function (locator) {
        if (locator == null || locator.subId == null) {
          return this.element ? this.element[0] : null;
        }

        // Non-null locators have to be handled by the component subclasses
        return null;
      },

      /**
       * <p>Returns the subId string for the given DOM node in this element.  For details, see
       * <a href="#getNodeBySubId">getNodeBySubId</a> and the <a href="#subids-section">Sub-ID's</a>
       * section of this document.
       *
       * <p>This method is intended for use in test automation only, and should not be used in a production environment.
       *
       * @ojfragment getSubIdByNodeDesc
       * @memberof oj.baseComponent
       */
      /**
       * DOM node in this element
       *
       * @ojfragment getSubIdByNodeNodeParam
       * @memberof oj.baseComponent
       */
      /**
       * The subId for the DOM node, or <code class="prettyprint">null</code> if none is found.
       *
       * @ojfragment getSubIdByNodeReturn
       * @memberof oj.baseComponent
       */
      /**
       * Get the subId for a certain DOM node:
       *
       * @ojfragment getSubIdByNodeCaption
       * @memberof oj.baseComponent
       */
      /**
       * var locator = myComponent.getSubIdByNode(nodeInsideElement);
       *
       * @ojfragment getSubIdByNodeExample
       * @memberof oj.baseComponent
       */

      // While a subclass could technically extend the verbiage by adding its own verbiage after the ojinclude,
      // please doc sub-id's in the subid's section, not by extending this method doc.
      /**
       * {@ojinclude "name":"getSubIdByNodeDesc"}
       *
       * @expose
       * @memberof oj.baseComponent
       * @instance
       * @ignore
       *
       * @param {!Element} node {@ojinclude "name":"getSubIdByNodeNodeParam"}
       * @returns {Object|null} {@ojinclude "name":"getSubIdByNodeReturn"}
       *
       * @example <caption>{@ojinclude "name":"getSubIdByNodeCaption"}</caption>
       * {@ojinclude "name":"getSubIdByNodeExample"}
       */
      // eslint-disable-next-line no-unused-vars
      getSubIdByNode: function (node) {
        return null;
      },

      // Overridden to set oj-hover and oj-focus classes
      // TODO: Move JSDoc from subclasses to here.  Don't include above internal comment.  Make at-final.
      destroy: function () {
        if (this._IsCustomElement()) {
          throw new Error('destroy cannot be called on a custom element');
        }

        // Fire 'destroy' event
        this._trigger('destroy');

        // Since jQuery event listeners get removed before the destroy() method whne jQuery.clean() cleans up the subtree,
        // we need to fire a custom DOM event as well. This will allow component binding to execute destroy callbacks for
        // custom bindings and managed attributes.

        DomUtils.dispatchEvent(this.element[0], new CustomEvent('_ojDestroy'));

        // allow subcomponent to release resources they hold.
        this._ReleaseResources();

        this._super();

        // remove hover and active listeners
        //    this.widget().off(this.eventNamespace);

        // clean up states
        this.element.removeClass(_OJ_COMPONENT_NODE_CLASS);
        this.widget().removeClass(_DISABLED);

        // pass init node (this.element), not root node if different (this.widget()), since all elements in
        // the root node subtree but not the init node subtree should have been removed by the call to _super.
        this._removeStateClasses(this.element);

        _removeWidgetName(this.element, this.widgetName);

        this._RestoreAttributes();

        // TODO: move this to _RestoreAttributes?
        if (this._initialCmDomAttr) {
          this.element.attr('contextmenu', this._initialCmDomAttr);
        } else {
          this.element.removeAttr('contextmenu');
        }

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
       * @ignore
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
      option: function (optionName, value) {
        // actually varArgs per comment above the JSDoc, but GCC warns unless matches the @param that we wish to doc
        if (arguments.length === 0) {
          // don't return a reference to the internal hash
          return $.widget.extend({}, this.options);
        }

        var key = arguments[0];

        var options = key;
        var subkey = null;

        var flags = {};
        var i;

        if (typeof key === 'string') {
          // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
          options = {};
          var parts = key.split('.');
          key = parts.shift();
          if (parts.length) {
            subkey = parts.join('.');

            var curOption;
            try {
              // Inform dynamic getters that the subkey is being set
              if (arguments.length > 1) {
                this._settingNestedKey = subkey;
              }

              curOption = $.widget.extend({}, this.options[key]);
              options[key] = curOption;
            } finally {
              this._settingNestedKey = null;
            }

            for (i = 0; i < parts.length - 1; i++) {
              curOption[parts[i]] = curOption[parts[i]] || {};
              curOption = curOption[parts[i]];
            }

            key = parts.pop();
            if (arguments.length === 1) {
              return curOption[key] === undefined ? null : curOption[key];
            }

            curOption[key] = value;
          } else {
            if (arguments.length === 1) {
              return this.options[key] === undefined ? null : this.options[key];
            }
            options[key] = value;
          }

          flags = arguments[2] || flags;
        } else {
          flags = arguments[1] || flags;
        }

        // Store subkey on the flags to let _setOption() know that dot notation was used
        if (subkey != null) {
          var subprop = {
            path: optionName,
            value: value
          };
          flags = $.widget.extend({}, flags, { subkey: subkey, subproperty: subprop });
        }

        var context = flags ? flags._context : null;
        var internalSet = context ? context.internalSet : false;

        // This method can be called twice with the same value for writeback properties
        // so we need to go through the options object and only pass through the changed values
        var newOptions = {};
        var optionKeys = Object.keys(options);
        for (i = 0; i < optionKeys.length; i++) {
          var option = optionKeys[i];
          var newValue = options[option];
          var oldValue = this.options[option];
          // The changed flag is set when components have updated an object or array value in place
          var changed = flags && flags.changed;
          if (changed || !this._CompareOptionValues(option, oldValue, newValue)) {
            newOptions[option] = newValue;
          } else if (this._IsCustomElement()) {
            Logger.info(
              ojcustomelementUtils.CustomElementUtils.getElementInfo(this.element[0]) +
                ": Ignoring property set for property '" +
                option +
                "' with same value."
            );
          }
        }

        if (Object.keys(newOptions).length > 0) {
          // Avoid _setOption() calls for internal sets, since component's _setOption()
          // and setOptions() overrides do not expect to be called in that case
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);
          try {
            if (internalSet) {
              this._internalSetOptions(newOptions, flags);
            } else {
              this._setOptions(newOptions, flags);
            }
          } finally {
            ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
          }
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
      _internalSetOptions: function (options, flags) {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
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
      _setOptions: function (options, flags) {
        ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);
        try {
          var keys = Object.keys(options);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = options[key];
            this._setOption(key, value, flags);
          }
        } finally {
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
        }
        return this;
      },

      /**
       * Overridden to set oj-hover and oj-focus classes.
       * Components should not call this method directly, but instead call option().
       * @memberof oj.baseComponent
       * @instance
       * @protected
       * @ignore
       */
      _setOption: function (key, value, flags) {
        var originalValue = this.options[key];

        if (key === 'disabled') {
          // The JQUI superclass method has hard-coded style classes in the 'if key === "disabled"' block, so unfortunately
          // we must copy that logic here with updated style classes, and NOT call _super() for the disabled case.
          // TBD: keep this logic updated if superclass method changes.
          this.options[key] = value;

          // TBD: widget() is not always the thing that should have aria-disabled on it.  E.g. for the checkbox/radio flavors of ojButton,
          // widget() returns the root node, but aria-disabled belongs on the <input>.  We fixed this JQUI bug in ojButton by having ojButton
          // override this method to remove it from the root node and add it to the input.  Would be better for each component to know which
          // element to apply that to, e.g. an overridable method returning that element, or copying "hoverable" paradigm if appropriate.
          // In the cases where this.element is different than widget(), this.element is more likely to be the right thing, so maybe change
          // default to that.
          // Update: this issue is getting even more awkward now that we have "effectively disabled".  Probably need to refactor this code!
          this.widget().toggleClass(_DISABLED, !!value).attr('aria-disabled', value);

          if (value) {
            this._removeStateClasses(this.widget());
          }
        } else {
          try {
            var subkey = flags == null ? null : flags.subkey;
            if (subkey != null) {
              this._settingNestedKey = subkey;
            }

            this._super(key, value);
          } finally {
            this._settingNestedKey = null;
          }

          // if contextMenu option wasn't set before, we'll need to start detect gesture
          if (key === 'contextMenu') {
            this._SetupContextMenu();
          }
        }

        this._optionChanged(key, value, originalValue, flags);

        return this;
      },

      /**
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _optionChanged: function (key, value, originalValue, flags) {
        // Assume that all values are different from originalValues as we do equality
        // checking before calling this method or trust components that have set the
        // 'changed' flag to indicate that they updated in place for an Object or Array
        // since we won't see any difference for those cases.
        // var changed = false;
        var context = null;

        var writeback = false;
        var readOnly = false;
        var originalEvent = null;
        var updatedFrom = 'external';

        var optionMetadata = null;

        var extraData;

        if (flags) {
          context = flags._context;

          if (context) {
            // Skip firing an option changed event for certain cases like
            // custom element default value sets where the bridge interprets an
            // application undefined value set to the property default defined in the
            // metadata.
            if (context.skipEvent) {
              return;
            }

            originalEvent = context.originalEvent;
            writeback = context.writeback === undefined ? originalEvent != null : context.writeback;
            readOnly = context.readOnly;
            optionMetadata = context.optionMetadata;
            extraData = context.extraData;
            if (context.internalSet) {
              updatedFrom = 'internal';
            }
          }
        }

        optionMetadata = optionMetadata || {};
        optionMetadata.writeback = writeback ? 'shouldWrite' : 'shouldNotWrite';

        if (readOnly) {
          optionMetadata.readOnly = true;
        }

        var optionChangeData = {
          option: key,
          previousValue: originalValue,
          value: value,
          optionMetadata: optionMetadata,
          updatedFrom: updatedFrom
        };

        var subkey = flags == null ? null : flags.subkey;
        // Walk previousValue object and find the subproperty previousValue
        if (subkey) {
          var subprops = subkey.split('.');
          var originalSubpropValue = originalValue;
          subprops.forEach(function (subprop) {
            if (!originalSubpropValue) {
              return;
            }
            originalSubpropValue = originalSubpropValue[subprop];
          });
          var subproperty = flags.subproperty;
          subproperty.previousValue = originalSubpropValue;
          optionChangeData.subproperty = subproperty;
        }

        if (extraData != null) {
          optionChangeData = $.extend({}, extraData, optionChangeData);
        }

        this._trigger('optionChange', originalEvent, optionChangeData);
      },

      /**
       * <p>Sets up needed resources for this component, for example, add
       * listeners. This is called during _create.
       * <a href="#_ReleaseResources">_ReleaseResources</a> will release resources
       * help by this component, and is called during destroy.
       * </p>
       *  Component subclasses can opt in by overriding _SetupResources and
       *   _ReleaseResources.
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _SetupResources: function () {
        this._SetupContextMenu();
      },

      /**
       * <p>Release resources held by this component, for example, remove
       * listeners. This is called during destroy.
       * <a href="#_SetupResources">_SetupResources</a> will set up resources
       * needed by this component, and is called during _create.
       * </p>
       *  Component subclasses can opt in by overriding _SetupResources and
       *   _ReleaseResources.
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _ReleaseResources: function () {
        this._ReleaseContextMenu();
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
      _trigger: function (type, event, data) {
        return this._trigger2(type, event, data).proceed;
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
       * @return {!{proceed: boolean, event: ($.Event|CustomEvent)}}
       *     proceed is true if the default action has not been prevented, false otherwise
       *     event is the new event that was triggered
       *
       * @private
       */
      _trigger2: function (type, event, data) {
        var eventData = data || {};

        if (this._IsCustomElement()) {
          return this._triggerCustomEvent(type, event, eventData);
        }

        var callback = this.options[type];

        var jqEvent = $.Event(event, _OJ_COMPONENT_EVENT_OVERRIDES);
        jqEvent.type = (this.widgetEventPrefix + type).toLowerCase();

        // the original event may come from any element
        // so we need to reset the target on the new event
        jqEvent.target = this.element[0];

        this.element.trigger(jqEvent, eventData);

        return {
          proceed: !(
            ($.isFunction(callback) &&
              callback.apply(this.element[0], [jqEvent].concat(eventData)) === false) ||
            jqEvent.isDefaultPrevented()
          ),
          event: jqEvent
        };
      },

      /**
       * <p>Fires a CustomEvent instead of a jQuery event for when this component is created as a custom element.
       *
       * @param {string} type - component event type
       * @param {?Object} event - original event
       * @param {Object} data - event data
       * @return {!{proceed: boolean, event: CustomEvent}}
       *     proceed is true if the default action has not been prevented, false otherwise
       *     event is the new event that was triggered
       *
       * @private
       */
      _triggerCustomEvent: function (type, event, data) {
        var eventName;
        var detail = {};
        var bubbles;
        var cancelable;
        var rootElement = this._getRootElement();

        if (type === 'optionChange') {
          var property = CustomElementBridge.getPropertyForAlias(rootElement, data.option);
          if (!CustomElementBridge.isKnownProperty(rootElement, property)) {
            return { proceed: true, event: null };
          }
          eventName = ojcustomelementUtils.AttributeUtils.propertyNameToChangeEventType(property);

          // Copy over component specific optionChange event properties, promoting those exposed
          // in the optionMetadata to the top level alongside value/previousValue/subproperty.
          var keys = Object.keys(data);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== 'option') {
              if (key === 'optionMetadata') {
                // Do not expose optionMetadata for custom element property change events
                // Instead, promote any component specific metadata to the top level.
                var metaKeys = Object.keys(data[key]);
                for (var j = 0; j < metaKeys.length; j++) {
                  var metaKey = metaKeys[j];
                  if (metaKey !== 'writeback' && metaKey !== 'component') {
                    detail[metaKey] = data[key][metaKey];
                  }
                }
              } else {
                detail[key] = data[key];
              }
            }
          }
        } else {
          eventName = ojcustomelementUtils.AttributeUtils.eventTriggerToEventType(type);
          if (!CustomElementBridge.isKnownEvent(rootElement, eventName)) {
            return { proceed: true, event: null };
          }
          bubbles = true;
          cancelable = true;
          detail = this._resolveJQueryObjects(data);
        }
        if (event) {
          detail.originalEvent = event instanceof $.Event ? event.originalEvent : event;
        }
        var params = { detail: detail };
        if (bubbles) {
          params.bubbles = true;
        }
        if (cancelable) {
          params.cancelable = true;
        }

        var customEvent = new CustomEvent(eventName, params);
        rootElement.dispatchEvent(customEvent);
        return { proceed: !customEvent.defaultPrevented, event: customEvent };
      },

      /**
       * <p>Creates a shallow copy of the passed in object where any top-level JQuery objects have been resolved to their underlying objects.
       * @param {Object} data the original object
       * @return {Object} the resolved object copy
       *
       * @private
       */
      _resolveJQueryObjects: function (data) {
        var resolved = oj.CollectionUtils.copyInto({}, data);
        var keys = Object.keys(resolved);
        for (var k = 0; k < keys.length; k++) {
          var key = keys[k];
          var val = resolved[key];
          if (val && val instanceof $) {
            if (val.length === 0) {
              resolved[key] = null;
            } else if (val.length === 1) {
              resolved[key] = val[0];
            } else {
              resolved = val.toArray();
            }
          }
        }
        return resolved;
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
      _initContextMenuOption: function (constructorOptions) {
        var contextMenu = this.element.attr('contextmenu');

        this._initialCmDomAttr = contextMenu; // TODO: remove this after the _RestoreAttributes() call in destroy() is uncommented

        if (contextMenu && !('contextMenu' in constructorOptions)) {
          // if app set DOM attr but not option, then set the option from the DOM
          this.option('contextMenu', document.getElementById(contextMenu), {
            _context: { internalSet: true }
          }); // writeback not needed since "not in constructorOptions" means "not bound"
        }
      },

      /**
       * Handler
       * @param {Element} contextMenu root element of context menu
       * @param {Event} event the dom event
       * @param {string} eventType the type of event
       * @private
       */
      _handleContextMenuGesture: function (contextMenu, event, eventType) {
        // For components like Button where "effectively disabled" --> "not focusable", keyboard CM launch is impossible, so
        // allowing right-click access would be an a11y issue.  If there's ever a need to enable this for focusable effectively
        // disabled components, we can always replace the _IsEffectivelyDisabled() call with a new protected method whose
        // baseComponent impl returns _IsEffectivelyDisabled().
        if (this._IsEffectivelyDisabled()) {
          return;
        }

        // contextMenu should reference the latest one from the scope
        var menu;
        if (contextMenu.tagName === 'OJ-MENU') {
          menu = contextMenu;
        } else {
          var constructor = Components.__GetWidgetConstructor(contextMenu, 'ojMenu');
          menu = constructor && constructor('instance');
          if (!menu) {
            throw new Error('Invalid JET Menu.'); // keeping old behavior
          }
        }

        this._NotifyContextMenuGesture(menu, event, eventType);

        // todo: modify NotifyContextMenuGesture contract so we don't need to check visible
        if ($(contextMenu).is(':visible')) {
          event.preventDefault(); // don't show native context menu
        }
      },

      /**
       * <p>Call this method from _SetupResources().  It sets up listeners needed to detect context menu gestures.
       *
       * <p>We don't look for the menu until context menu gesture has been detected on the first launch,
       * so that the menu needn't be inited before this component.
       *
       * <p>If needed, override <code class="prettyprint">_NotifyContextMenuGesture()</code>, not this private method.
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _SetupContextMenu: function () {
        var contextMenu = this._GetContextMenu();
        if (!contextMenu) {
          contextMenu = this._GetDefaultContextMenu();
        }

        if (contextMenu && this._contextMenuGestureInit === undefined) {
          this._contextMenuGestureInit = contextMenu;

          var self = this;
          GestureUtils.startDetectContextMenuGesture(this.widget()[0], function (event, eventType) {
            self._handleContextMenuGesture(contextMenu, event, eventType);
          });
        }
      },

      /**
       * <p>This method removes contextMenu functionality from the component and specified menu.
       *
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _ReleaseContextMenu: function () {
        this._contextMenuGestureInit = undefined;

        // access menu elem directly, rather than using the widget() of the Menu component, so listener is cleared even if component no longer exists.
        // $(contextMenuOption).off( this.contextMenuEventNamespace );
        GestureUtils.stopDetectContextMenuGesture(this.widget()[0]);
      },

      /**
       * Helper method to retrieve the context menu element
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _GetContextMenu: function () {
        if (this._IsCustomElement()) {
          var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(this._getRootElement());
          var slot = slotMap.contextMenu;
          if (slot && slot.length > 0) {
            return slot[0];
          }
        } else if (this.options.contextMenu) {
          return $(this.options.contextMenu).first()[0];
        }

        return null;
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
      _NotifyContextMenuGesture: function (menu, event, eventType) {
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
      _OpenContextMenu: function (event, eventType, openOptions, submenuOpenOptions, shallow) {
        var contextMenuNode = this._GetContextMenu();
        if (!contextMenuNode) {
          // the context menu node could have been currently opened with another launcher
          if (this._contextMenuGestureInit && $(this._contextMenuGestureInit).is(':visible')) {
            contextMenuNode = this._contextMenuGestureInit;
          } else {
            contextMenuNode = this._GetDefaultContextMenu();
          }
        }

        if (contextMenuNode) {
          // Note: our touch positioning is similar to that of the iOS touch callout (bubble with "Open in New Tab", etc.), which is offset from the pressHold location as follows:
          // - to the right, vertically centered.  (by default)
          // - to the left, vertically centered.  (if fits better)
          // - above or below, horizontally centered.  (if fits better)
          // An offset like 40 prevents it from opening right under your finger, and is similar to iOS's offset.  It also prevents the issue (on iOS7 at least)
          // where touchend after the pressHold can dismiss the CM b/c the menu gets the touchend.

          var position = {
            mouse: {
              my: 'start top',
              at: _START_BOTTOM,
              of: event,
              collision: 'flipfit'
            },
            touch: {
              my: 'start>40 center',
              at: _START_BOTTOM,
              of: event,
              collision: 'flipfit'
            },
            keyboard: {
              my: 'start top',
              at: _START_BOTTOM,
              of: 'launcher',
              collision: 'flipfit'
            }
          };

          var defaults = { launcher: this.element, position: position[eventType] }; // used for fields caller omitted
          var forcedOptions = { initialFocus: 'menu' };

          var mergedOpenOptions = shallow
            ? $.extend(defaults, openOptions, forcedOptions)
            : $.extend(true, defaults, openOptions, forcedOptions);

          contextMenuNode.__openingContextMenu = true; // Hack.  See todo on this ivar in Menu.open().
          if (contextMenuNode.tagName === 'OJ-MENU') {
            contextMenuNode.open(event, mergedOpenOptions, submenuOpenOptions);
          } else {
            var constructor = Components.__GetWidgetConstructor(contextMenuNode, 'ojMenu');
            var menu = constructor && constructor('instance');
            menu.open(event, mergedOpenOptions, submenuOpenOptions);
            // Open is immediate for jquery UI menus.
            // Win FF will fire a contextmenu event on shift+F10 long after the keypress was prevented.
            // jquery ui needs immediate focus to the menu on open. The contextmenu event is fired on
            // the menu versus the launcher. This logic prevents the context menu event within a 50ms
            // window after the menu is open.
            var eatEventHandler = function (e) {
              e.preventDefault();
            };
            contextMenuNode.addEventListener('contextmenu', eatEventHandler);
            window.setTimeout(function () {
              contextMenuNode.removeEventListener('contextmenu', eatEventHandler);
            }, 50);
          }
          contextMenuNode.__openingContextMenu = false;
        }
      },

      /**
       * Retrieve the default context menu.
       * @return {Element|null} the root element for the default context menu, or null if there is no default context menu.  The default is null.
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _GetDefaultContextMenu: function () {
        return null;
      },

      /**
       * <p>Removes the <code class="prettyprint">oj-hover</code>, <code class="prettyprint">oj-focus</code>,
       * <code class="prettyprint">oj-focus-highlight</code>, and
       * <code class="prettyprint">oj-active</code> classes from the specified element and its subtree.
       *
       * @memberof oj.baseComponent
       * @instance
       * @private
       *
       * @param {!jQuery} element The element from whose subtree the 3 classes should be removed
       */
      _removeStateClasses: function (element) {
        element.removeClass('oj-hover oj-focus oj-focus-highlight oj-active');
        element.find('.oj-hover').removeClass('oj-hover');
        element.find('.oj-focus').removeClass('oj-focus');
        element.find('.oj-focus-highlight').removeClass('oj-focus-highlight');
        element.find('.oj-active').removeClass('oj-active');
      },

      /**
       * @private
       * @return {boolean} true if there is no touch detected within the last 500 ms
       */
      _isRealMouseEvent: function () {
        return !DomUtils.recentTouchEnd();
      },

      /**
       * Add mouse listners to toggle oj-hover class
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected

       * @param {(!Object|!jQuery)} options This param can either be the element
       * (convenience syntax for callers needing to
       *   specify only the element(s) that would
       *   otherwise have been passed as <code class="prettyprint">options.element</code>)
       *   or an object supporting the following fields:
       * @param {jQuery} options.element The element(s) to receive the <code class="prettyprint">oj-hover</code> class on hover
       *   Required if <code class="prettyprint">afterToggle</code> is specified.
       * @param {?function(string)} options.afterToggle Optional callback function called each time the hover classes have been toggled,
       *   after the toggle.  The string "mouseenter" or "mouseleave" is passed, indicating whether the classes were added or removed.
       *   Components with consistency requirements, such as "<code class="prettyprint">oj-default</code> must be applied iff no state classes
       *   such as <code class="prettyprint">oj-hover</code> are applied," can enforce those rules in this callback.
       * @see #_RemoveHoverable
       */
      _AddHoverable: function (options) {
        var element;

        if ($.isPlainObject(options)) {
          element = options.element;
        } else {
          element = options;
          // eslint-disable-next-line no-param-reassign
          options = {};
        }

        var afterToggle = options.afterToggle || $.noop;
        var markerClass = 'oj-hover';

        element
          .on(
            'mouseenter' + this.hoverableEventNamespace,
            this._hoverStartHandler.bind(this, afterToggle)
          )
          .on(
            'mouseleave' + this.hoverableEventNamespace,
            this._hoverAndActiveEndHandler.bind(this, markerClass, afterToggle)
          );
      },

      /**
       * Remove mouse listners that were registered in _AddHoverable
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       * @param {!jQuery} element The same element passed to _AddHoverable
       * @see #_AddHoverable
       */
      _RemoveHoverable: function (element) {
        if (element) {
          element.off(this.hoverableEventNamespace);
        }
      },

      /**
       * Add touch and mouse listeners to toggle oj-active class
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected

       * @param {(!Object|!jQuery)} options This parameter can either be the element
       * (convenience syntax for callers needing to
       *   specify only the element(s) that would
       *   otherwise have been passed as <code class="prettyprint">options.element</code>)
       *   or an object supporting the following fields:
       * @param {jQuery} options.element The element(s) to receive the
       * <code class="prettyprint">oj-active</code> class on active
       *   Required if <code class="prettyprint">afterToggle</code> is specified.
       * @param {?function(string)} options.afterToggle Optional callback function called each time
       *   the active classes have been toggled, after the toggle.  The event.type string is passed
       *   and indicates whether the classes were added or removed. The active classes are added on
       *   "touchstart" or "mousedown" or "mouseenter" and the active classes are removed on
       *   "touchend" or "touchcancel" or "mouseup" or "mouseleave".
       *   Components with consistency requirements, such as
       *   "<code class="prettyprint">oj-default</code> must be applied iff no state classes
       *   such as <code class="prettyprint">oj-active</code> are applied,"
       *   can enforce those rules in this callback.
       * @see #_RemoveActiveable
       */
      _AddActiveable: function (options) {
        var element;

        if ($.isPlainObject(options)) {
          element = options.element;
        } else {
          element = options;
          // eslint-disable-next-line no-param-reassign
          options = {};
        }

        var afterToggle = options.afterToggle || $.noop;
        var markerClass = 'oj-active';

        if (DomUtils.isTouchSupported()) {
          // make sure native element exists
          if (element[0]) {
            // register touchstart with passive option
            this._touchstartListener = this._activeStartHandler.bind(this, afterToggle);
            element[0].addEventListener('touchstart', this._touchstartListener, { passive: true });
          }
          element.on(
            'touchend' +
              this.activeableEventNamespace +
              ' ' +
              'touchcancel' +
              this.activeableEventNamespace,
            this._hoverAndActiveEndHandler.bind(this, markerClass, afterToggle)
          );
        }

        element
          .on(
            'mousedown' + this.activeableEventNamespace,
            this._activeStartHandler.bind(this, afterToggle)
          )
          .on(
            'mouseup' + this.activeableEventNamespace,
            this._hoverAndActiveEndHandler.bind(this, markerClass, afterToggle)
          )
          // mouseenter/mouseleave is for the case where you mousedown, then move mouse
          // out of element, then move mouse back. We want oj-active to disappear when you move
          // outside and reappear when you move back.
          .on(
            'mouseenter' + this.activeableEventNamespace,
            this._activeStartHandler.bind(this, afterToggle)
          )
          .on(
            'mouseleave' + this.activeableEventNamespace,
            this._hoverAndActiveEndHandler.bind(this, markerClass, afterToggle)
          );
      },

      /**
       * Remove touch and mouse listeners that were registered in _AddActiveable
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       * @param {!jQuery} element The same element passed to _AddActiveable
       * @see #_AddActiveable
       */
      _RemoveActiveable: function (element) {
        if (element) {
          // make sure native element exists
          if (element[0]) {
            // remove touchstart registered with passive option
            element[0].removeEventListener('touchstart', this._touchstartListener, { passive: true });
            delete this._touchstartListener;
          }
          element.off(this.activeableEventNamespace);
          _lastActiveElement = null;
        }
      },

      /**
       * Add oj-active style class and call the afterToggleFunction.
       * Set _lastActiveElement to event.currentTarget on mousedown. Clear it on mouseup.
       * _lastActiveElement is used to remove and add back oj-active on mouseleave and mouseenter
       * if the mouse stays down.
       * @private
       */
      _activeStartHandler: function (afterToggleFunction, event) {
        var elem = $(event.currentTarget);

        // do nothing on mouseenter if _lastActiveElement ivar is not the currentTarget or child of
        // currentTarget. Checking for the child is needed in case there are two nested
        // dom nodes that have set_AddActiveable. Since events bubble, the _lastActiveElement will
        // be the outermost dom that got the mousedown event.
        if (event.type === 'mouseenter' && !this._isTargetInActiveElement(event.currentTarget)) {
          return;
        }

        // do this for either touchstart or real mouse events, but not mouse compatibility event
        if (
          !elem.hasClass(_DISABLED) &&
          (event.type === 'touchstart' || this._isRealMouseEvent(event))
        ) {
          elem.addClass('oj-active');
          afterToggleFunction(event.type);

          // If we get mousedown on the element, we want oj-active to be removed on mouseleave
          // and added back on mouseenter if the mouse stays down.
          if (event.type === 'mousedown') {
            _lastActiveElement = event.currentTarget;

            this.document.one('mouseup', function () {
              _lastActiveElement = null;
            });
          }
        }
      },

      /**
       * @private
       */
      _hoverStartHandler: function (afterToggleFunction, event) {
        // do this for real mouseenter, but not mouse compatibility event
        var elem = $(event.currentTarget);
        if (!elem.hasClass(_DISABLED) && this._isRealMouseEvent(event)) {
          elem.addClass('oj-hover');
          afterToggleFunction(event.type);
        }
      },

      /**
       * Remove markerClass and call the afterToggleFunction.
       * @private
       */
      _hoverAndActiveEndHandler: function (markerClass, afterToggleFunction, event) {
        // for oj-active we don't care about mouseleave unless it was triggered when _lastActiveElement
        // was set on the currentTarget. (see _activeStartHandler). If that's not the case, return.
        if (
          markerClass === 'oj-active' &&
          event.type === 'mouseleave' &&
          !this._isTargetInActiveElement(event.currentTarget)
        ) {
          return;
        }
        $(event.currentTarget).removeClass(markerClass);
        afterToggleFunction(event.type);
      },
      /**
       * Returns true if the event target is _lastActiveElement or a child of _lastActiveElement.
       * Checking for the child is needed in case there are two nested dom nodes that have set
       * _AddActiveable. For example, inputDateTime -> the trigger root container and the trigger icon.
       * We are only keeping track of the _lastActiveElement, which means the ancestor element will
       * be stored in _lastActiveElement because the mouseleave event bubbles.
       * @private
       */
      _isTargetInActiveElement: function (currentTarget) {
        return (
          _lastActiveElement === currentTarget ||
          (_lastActiveElement != null && $.contains(_lastActiveElement, currentTarget))
        );
      },

      // We no longer use _hoverable, but should still override it to ensure the JQUI impl is not called.
      _hoverable: function () {},

      // The internal JSDoc of the DomUtils version of this API refers to this doc, so if changes are made here, that doc
      // must be updated as needed.
      /**
       * <p>Sets JET's "focus" CSS classes when the element is focused and removes them when focus is lost.
       *
       * <p>The <code class="prettyprint">oj-focus</code> class is set on all focuses.
       *
       * <p>Some components additionally have an <code class="prettyprint">oj-focus-highlight</code> class, which applies a focus
       * indicator that is appropriate on a subset of the occasions that <code class="prettyprint">oj-focus</code> is appropriate.
       * Those components should pass <code class="prettyprint">true</code> for the <code class="prettyprint">applyHighlight</code>
       * param, in which case the <code class="prettyprint">oj-focus-highlight</code> class is set if appropriate given the
       * current focus highlight policy.
       *
       * <h5>Focus highlight policy</h5>
       *
       * <p>The focus highlight policy supports the 3 values listed below.  By default, it is retrieved from the
       * <code class="prettyprint">$focusHighlightPolicy</code> SASS variable, shared by many components and patterns.  Components
       * with different needs, including those exposing a component-specific SASS variable or other API for this, should see the
       * <code class="prettyprint">getFocusHighlightPolicy</code> parameter below.
       *
       * Valid focus highlight policies:
       *
       * <table class="generic-table">
       *   <thead>
       *     <tr>
       *       <th>Policy</th>
       *       <th>Description</th>
       *     </tr>
       *   </thead>
       *   <tbody>
       *     <tr>
       *       <td>"nonPointer"</td>
       *       <td>Indicates that the component should apply the <code class="prettyprint">oj-focus-highlight</code>
       *           class only for focuses not resulting from pointer (touch or mouse) interaction.  (In the built-in themes, the
       *           SASS variable defaults to this value.)</td>
       *     </tr>
       *     <tr>
       *       <td>"all"</td>
       *       <td>Indicates that the component should apply the class for all focuses.</td>
       *     </tr>
       *     <tr>
       *       <td>"none"</td>
       *       <td>Indicates that the component should never apply the class, because the application has taken responsibility
       *           for applying the class when needed for accessibility.</td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * <h5>Toggling the classes</h5>
       *
       * <p>Components that toggle these focus classes outside of this API must maintain the invariant that
       * <code class="prettyprint">oj-focus-highlight</code> is applied to a given element in a (not necessarily strict) subset
       * of cases that <code class="prettyprint">oj-focus</code> is applied to that element.
       *
       * <p>Typically the specified element should be within the component subtree, in which case the classes will
       * automatically be removed from the element when the component is destroyed, when its <code class="prettyprint">disabled</code>
       * option is set to true, and when <code class="prettyprint">_NotifyDetached()</code> is called.
       *
       * <p>As a minor exception, for components that wrap themselves in a new root node at create time, if the specified
       * element is within the root node's subtree but not within the init node's subtree, then at destroy time only, the
       * classes will not be removed, since <code class="prettyprint">destroy()</code> is expected to remove such nodes.
       *
       * <p>If the element is NOT in the component subtree, then the caller is responsible for removing the classes at the
       * times listed above.
       *
       * <h5>Listeners</h5>
       *
       * <p>If <code class="prettyprint">setupHandlers</code> is not passed, or if <code class="prettyprint">setupHandlers</code>
       * is passed and uses <code class="prettyprint">_on</code> to register its listeners as seen in the example, then
       * the listeners are not invoked when the component is disabled, and the listeners are automatically cleaned up when the
       * component is destroyed.  Otherwise, the caller is responsible for ensuring that the disabled state is handled correctly,
       * and removing the listeners at destroy time.
       *
       * <h5>Related API's</h5>
       *
       * <p>Non-component internal callers should see DomUtils.makeFocusable().  Per its JSDoc (unpublished; see the source), it
       * has a couple of additional usage considerations.
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       *
       * @param {(!Object|!jQuery)} options This param can either be the element (convenience syntax for callers needing to
       *   specify only the element(s) that would otherwise have been passed as <code class="prettyprint">options.element</code>)
       *   or an object supporting the following fields:
       * @param {jQuery} options.element The element(s) to receive the <code class="prettyprint">oj-focus</code> classes on focus.
       *   Required if <code class="prettyprint">setupHandlers</code> not passed; ignored otherwise.
       * @param {boolean} options.applyHighlight <code class="prettyprint">true</code> if the <code class="prettyprint">oj-focus-highlight</code>
       *   class should be applied when appropriate.  <code class="prettyprint">false</code> or omitted if that class should never be applied.
       * @param {?function(string)} options.afterToggle Optional callback function called each time the focus classes have been toggled,
       *   after the toggle.  The
       *   string "focusin" or "focusout" is passed, indicating whether the classes were added or removed.  Components
       *   with consistency requirements, such as "<code class="prettyprint">oj-default</code> must be applied iff no state classes such
       *   as <code class="prettyprint">oj-focus</code> are applied," can enforce those rules in this callback.
       * @param {?function()} options.getFocusHighlightPolicy Optional if <code class="prettyprint">applyHighlight</code> is
       *   <code class="prettyprint">true</code>; ignored otherwise.  Components with a component-specific focus policy
       *   mechanism should pass a function that always returns one of the three valid values listed above, keeping in mind
       *   that this method can be called on every focus.  See the example.
       * @param {?function()} options.recentPointer Relevant iff <code class="prettyprint">applyHighlight</code> is
       *   <code class="prettyprint">true</code> and the focus highlight policy is <code class="prettyprint">"nonPointer"</code>;
       *   ignored otherwise.  Recent pointer activity is considered to have occurred if (a) a mouse button or finger has
       *   recently been down or up, or (b) this optional callback function returns true.  Components wishing to additionally take into
       *   account (say) recent pointer <i>movements</i> can supply a function returning true if those movements have been detected,
       *   keeping in mind that this method can be called on every focus.  See the example.
       * @param {?function(function(!jQuery),function(!jQuery))} options.setupHandlers Can be omitted by components whose focus
       *   classes need to be added and removed on focusin and focusout, respectively.  Components needing to add/remove those
       *   classes in response to other events should specify this parameter, which is called once, immediately.  See the examples.
       *
       * @example <caption>Opt into the highlight behavior, and specify a function to be called every time the classes are toggled:</caption>
       * var self = this;
       * this._focusable({
       *     'element': this.element,
       *     'applyHighlight': true,
       *     'afterToggle' : function() {
       *         self._toggleDefaultClasses();
       *     }
       * });
       *
       * @example <caption>Arrange for mouse movement to be considered <u>in addition to</u> mouse/finger up/down.
       *   Also supply a component-specific focusHighlightPolicy:</caption>
       * var self = this;
       * this._focusable({
       *     'element': someElement,
       *     'applyHighlight': true,
       *     'recentPointer' : function() {
       *         // A timestamp-based approach avoids the risk of getting stuck in an inaccessible
       *         // state if (say) mouseenter is not followed by mouseleave for some reason.
       *         var millisSincePointerMove = Date.now() - _myPointerMoveTimestamp;
       *         var isRecent = millisSincePointerMove < myThreshold;
       *         return isRecent;
       *     },
       *     'getFocusHighlightPolicy' : function() {
       *         // Return the value of a component-specific SASS $variable, component option, or other
       *         // component-specific mechanism, either "all", "none", or "nonPointer".  SASS variables
       *         // should be pulled into JS once statically on load, not per-instance or per-focus.
       *     }
       * });
       *
       * @example <caption>Add/remove the focus classes in response to events other than focusin/focusout:</caption>
       * var self = this;
       * this._focusable({
       *     'applyHighlight': myBooleanValue,
       *     'setupHandlers': function( focusInHandler, focusOutHandler) {
       *         self._on( self.element, {
       *             // This example uses focus/blur listeners, which don't bubble, rather than the
       *             // default focusin/focusout (which bubble).  This is useful when one focusable
       *             // element is a descendant of another.
       *             focus: function( event ) {
       *                 focusInHandler($( event.currentTarget ));
       *             },
       *             blur: function( event ) {
       *                 focusOutHandler($( event.currentTarget ));
       *             }
       *         });
       *     }
       * });
       *
       * @example <caption>Alternate usage of <code class="prettyprint">setupHandlers</code>, which simply stashes the
       *   handlers so they can be called from the component's existing handlers:</caption>
       * var self = this;
       * this._focusable({
       *     'applyHighlight': myBooleanValue,
       *     'setupHandlers': function( focusInHandler, focusOutHandler) {
       *         self._focusInHandler = focusInHandler;
       *         self._focusOutHandler = focusOutHandler;
       *     }
       * });
       */
      _focusable: function (options) {
        if (!$.isPlainObject(options)) {
          // eslint-disable-next-line no-param-reassign
          options = { element: options };
        }

        // eslint-disable-next-line no-param-reassign
        options.component = this;
        DomUtils.makeFocusable(options);
      },

      /**
       * Remove all listener references that were attached to the element.
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _UnregisterChildNode: function (element) {
        if (element) {
          $(element).off(this.eventNamespace);
          var bindings = this.bindings;
          if (bindings) {
            this.bindings = $(bindings.not(element));
          }
        }
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
      _GetReadingDirection: function () {
        return DomUtils.getReadingDirection();
      },

      /**
       * <p>Notifies the component that its subtree has been connected to the document programmatically after the component has
       * been created.
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _NotifyAttached: function () {
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
      _NotifyDetached: function () {
        this._propertyContext = null;
        this._removeStateClasses(this.widget());
      },

      /**
       * <p>Notifies the component that its subtree is initially visible after the component has
       * been created.
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _NotifyInitShown: function () {},

      /**
       * <p>Notifies the component that its subtree has been made visible programmatically after the component has
       * been created.
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _NotifyShown: function () {},

      /**
       * <p>Notifies the component that its subtree has been made hidden programmatically after the component has
       * been created.
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _NotifyHidden: function () {},

      /**
       * <p>Determines whether this component is effectively disabled, i.e. it has its 'disabled' attribute set to true
       * or it has been disabled by its ancestor component.
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       * @return {boolean} true if the component has been effectively disabled, false otherwise
       */
      _IsEffectivelyDisabled: function () {
        return !!(this.options.disabled || this._ancestorDisabled);
      },

      /**
       * <p>Sets the ancestor-provided disabled state on this component.
       *
       * @memberof oj.baseComponent
       * @instance
       * @private
       * @param {boolean} disabled - true if this component is being disabled by its ancestor component, false otherwise
       */
      __setAncestorComponentDisabled: function (disabled) {
        this._ancestorDisabled = disabled;
      },

      /**
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _getTranslationSectionLoader: function () {
        var sectionNames = [];

        var self = this;

        var index = 0;

        this._traverseWidgetHierarchy(function (proto) {
          // retrive translation section name for the widget and all of its ancestors

          // Since _GetTranslationsSectionName() is a protected method, we can only call it on the widget instance.
          // For superclases, we will assume that their section names can only be their full widget name

          var name = index === 0 ? self._GetTranslationsSectionName() : proto.widgetFullName;
          index += 1;

          var section = Translations.getComponentTranslations(name);

          if (section != null && !$.isEmptyObject(section)) {
            sectionNames.push(name);
          }
        });

        var count = sectionNames.length;

        if (count > 0) {
          return function () {
            // Optimize for the most common case where superclasses do not define translations
            if (count === 1) {
              return Translations.getComponentTranslations(sectionNames[0]);
            }

            var trs = {};

            for (var i = count - 1; i >= 0; i--) {
              $.widget.extend(trs, Translations.getComponentTranslations(sectionNames[i]));
            }

            return trs;
          };
        }
        return null;
      },

      /**
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _getDynamicPropertyContext: function () {
        if (!this._propertyContext) {
          var c = {};
          this._propertyContext = c;
          var element = this.element[0];
          c.containers = _getSpecialContainerNames(element);
          c.element = element;
          c.isCustomElement = this._IsCustomElement();
          if (c.isCustomElement) c.customElement = this._getRootElement();
        }
        return this._propertyContext;
      },

      /**
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _setupDefaultOptions: function (originalDefaults, constructorOptions) {
        var options = this.options;

        // Load component translations
        var translationLoader = this._getTranslationSectionLoader();

        var currVal = constructorOptions[_OJ_TRANSLATIONS_OPTION];

        if (translationLoader != null && (currVal === undefined || $.isPlainObject(currVal))) {
          _defineDynamicProperty(
            this,
            undefined,
            constructorOptions[_OJ_TRANSLATIONS_OPTION],
            options,
            _OJ_TRANSLATIONS_OPTION,
            translationLoader
          );
        }

        // Load options specified with oj.Components.setDefaultOptions()
        this._loadGlobalDefaultOptions(originalDefaults, constructorOptions);
      },

      /**
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _loadGlobalDefaultOptions: function (originalDefaults, constructorOptions) {
        var options = this.options;

        var widgetHierNames = [];

        // walk up the widget hierarchy
        this._traverseWidgetHierarchy(function (proto) {
          widgetHierNames.push(proto.widgetName);
        });

        widgetHierNames.push('default');

        // get properties applicable to this component
        var defaults = Components.__getDefaultOptions(widgetHierNames);

        if ($.isEmptyObject(defaults)) {
          return;
        }

        var self = this;

        var contextCallback = function () {
          return self._getDynamicPropertyContext();
        };

        var props = Object.keys(defaults);
        for (var i = 0; i < props.length; i++) {
          var prop = props[i];
          var val = constructorOptions[prop];

          if (val === undefined || $.isPlainObject(val)) {
            var defaultValueList = defaults[prop];
            if (defaultValueList) {
              var callback = _getCompoundDynamicGetter(defaultValueList);
              if (callback) {
                _defineDynamicProperty(
                  this,
                  originalDefaults[prop],
                  val,
                  options,
                  prop,
                  callback,
                  contextCallback
                );
              } else {
                var list = [originalDefaults[prop]].concat(defaultValueList);
                list.push(val);
                options[prop] = _mergeOptionLayers(list);
              }
            }
          }
        }
      },

      /**
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _traverseWidgetHierarchy: function (callback) {
        var proto = this.constructor.prototype;
        while (proto != null && proto.namespace === 'oj') {
          callback(proto);
          proto = Object.getPrototypeOf(proto);
        }
      },

      /**
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _getRootElement: function () {
        return this.OuterWrapper || this.element[0];
      },

      /**
       * Determines whether the component is being rendered as a custom element.
       * @return {boolean} True if the component is being rendered as a custom element
       *
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _IsCustomElement: function () {
        return ojcustomelementUtils.CustomElementUtils.isElementRegistered(this._getRootElement().tagName);
      },

      /**
       * Provides a promise for JET's Knockout throttling timeout
       * @return {Promise} a promise for JET's Knockout throttling timeout completing or a promise that will be resolved immediately for the case
       * when there is no outstanding throttling timeout
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _GetThrottlePromise: function () {
        if (this._IsCustomElement()) {
          var elem = this._getRootElement();
          return ojcustomelementUtils.CustomElementUtils.getElementBridge(elem).getThrottlePromise();
        }
        return Promise.resolve(null);
      },

      /**
       * Prepares a custom renderer context object for either the JQuery or custom element syntax,
       * removing and exposing keys as needed.
       * @param {Object} context The renderer context object.
       * @return {Object} The cleaned up renderer context.
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      _FixRendererContext: function (context) {
        if (this._IsCustomElement()) {
          // Do a shallow copy to avoid setter/getters from being lost
          var contextCopy = oj.CollectionUtils.copyInto({}, context);
          // remove component or widget constructor references and expose element reference instead
          delete contextCopy.component;
          contextCopy.componentElement = this._getRootElement();
          return contextCopy;
        }
        return context;
      },

      /**
       * This method retrieves root custom element that is used by TemplateEngine
       * loader to determine the type of template engine to load - legacy or preact with or without knockout.
       *
       * @returns {Element}
       * @protected
       * @instance
       * @memberof oj.baseComponent
       */
      _GetCustomElement: function () {
        return this._getRootElement();
      },

      /**
       * Returns a wrapper function for custom elements that converts an object
       * returned by a custom renderer into an old format supported by widgets
       * @param {Function} origRenderer Renderer function called to create custom content
       * @return {Function} A wrapper function that will used to convert result into toolkit format
       * @protected
       * @memberof oj.baseComponent
       */
      _WrapCustomElementRenderer: function (origRenderer) {
        if (this._IsCustomElement() && typeof origRenderer === 'function') {
          return function (context) {
            var obj = origRenderer(context);
            return obj && obj.insert ? obj.insert : null;
          };
        }
        return origRenderer;
      },

      /**
       * Stores a map of writeback options that we reference during option comparison.
       * Package private method called from the CustomElementBridge.
       * @param  {Object} options The writeback options map
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      __saveWritebackOptions: function (options) {
        this._writebackOptions = options;
      },

      /**
       * Returns true if an option should be written back.
       * @param  {string} option The option to lookup
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      _getWritebackOption: function (option) {
        if (this._writebackOptions && this._writebackOptions[option]) {
          return true;
        }
        return false;
      },

      /**
       * Called by oj.Components.subtreeAttached and will only call _NotifyAttached
       * for non custom elements. Custom elements are notified when they are
       * attached from the DOM so oj.Components.subtreeAttached is unnecessary.
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      __handleSubtreeAttached: function () {
        if (!this._IsCustomElement()) {
          this._NotifyAttached();
        }
      },

      /**
       * Called by oj.Components.subtreeAttached and will only call _NotifyDetached
       * for non custom elements. Custom elements are notified when they are
       * detached from the DOM so oj.Components.subtreeDetached is unnecessary.
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      __handleSubtreeDetached: function () {
        if (!this._IsCustomElement()) {
          this._NotifyDetached();
        }
      },

      /**
       * Whether special handling is needed for connected and disconnected ops
       * @return {boolean} returns true if the component wants to suppress disconnect and connect operations that happened
       *                   in quick succession, since they can be very expensive.  Returns false otherwise, which is the default.
       * @memberof oj.baseComponent
       * @protected
       */
      _VerifyConnectedForSetup: function () {
        return false;
      },

      /**
       * Called by the CustomElementBridge when the custom element is attached
       * to the DOM.
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      __handleConnected: function () {
        this._NotifyAttached();
        if (!this.__delayConnectDisconnect(_STATE_CONNECTED)) {
          this._SetupResources();
        }
      },

      /**
       * Called by the CustomElementBridge when the custom element is detached
       * from the DOM.
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      __handleDisconnected: function () {
        // note that when it is delayed, then NotifyDetached would be called before ReleaseResources
        // this is fine for all the components that will use delayed disconnect, will need to re-visit if that is not the case.
        if (!this.__delayConnectDisconnect(_STATE_DISCONNECTED)) {
          this._ReleaseResources();
        }
        this._NotifyDetached();
      },

      /**
       * Delay the call to SetupResources and ReleaseResources as part of connected and disconnected.
       * See _verifyConnectedForSetup method for details.
       * @return {boolean} true if SetupResources/ReleaseResources has been delayed, false otherwise.
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      __delayConnectDisconnect: function (state) {
        if (!this._VerifyConnectedForSetup()) {
          return false;
        }

        if (this.connectedState === undefined) {
          window.queueMicrotask(
            function () {
              if (this.connectedState === state) {
                if (state === _STATE_CONNECTED) {
                  this._SetupResources();
                } else {
                  this._ReleaseResources();
                }
              }
              this.connectedState = undefined;
            }.bind(this)
          );
        }
        this.connectedState = state;

        return true;
      },

      /**
       * Method called by the CustomElementBridge to notify the component of changes to
       * any watched attributes registered in its metadata extension._WATCHED_ATTRS property.
       * @param {string} attr The name of the watched attribute
       * @param {string} oldValue The old attribute value
       * @param {string} newValue The new attribute value
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      __handleWatchedAttribute: function (attr, oldValue, newValue) {
        this._WatchedAttributeChanged(attr, oldValue, newValue);
      },

      /**
       * Method for components to override in order to handle changes to watched attributes.
       * @param {string} attr The name of the watched attribute
       * @param {string} oldValue The old attribute value
       * @param {string} newValue The new attribute value
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      // eslint-disable-next-line no-unused-vars
      _WatchedAttributeChanged: function (attr, oldValue, newValue) {},

      /**
       * Method called by the CustomElementBridge to get the element to call focus on for this custom element
       * which can be the root custom element or an HTML element like an input or select.
       * @return {Element}
       * @memberof oj.baseComponent
       * @instance
       * @private
       */
      __getFocusElement: function () {
        return this.GetFocusElement();
      },

      /**
       * Returns the current focusable element for this component which can be the root custom element
       * or an HTML element like an input or select.
       * @return {Element}
       * @memberof oj.baseComponent
       * @instance
       * @protected
       */
      GetFocusElement: function () {
        return this.element[0];
      }

      /**
       * Under normal circumstances this class is applied automatically. It is documented here for the rare cases that an app
       * developer needs per-instance control.
       *
       * <p>The <code class="prettyprint">oj-focus-highlight</code> class applies focus styling that may not be desirable when
       * the focus results from pointer interaction (touch or mouse), but which is needed for accessibility when the focus
       * occurs by a non-pointer mechanism, for example keyboard or initial page load.
       *
       * <p>The application-level behavior for this component is controlled in the theme by the
       * <code class="prettyprint">$focusHighlightPolicy</code> SASS variable; however, note that this same variable controls
       * the focus highlight policy of many components and patterns. The values for the variable are:
       *
       * <ul>
       *   <li><code class="prettyprint">nonPointer</code>: <code class="prettyprint">oj-focus-highlight</code> is applied only
       *       when focus is not the result of pointer interaction. Most themes default to this value.</li>
       *   <li><code class="prettyprint">all</code>: <code class="prettyprint">oj-focus-highlight</code> is applied regardless
       *       of the focus mechanism.</li>
       *   <li><code class="prettyprint">none</code>: <code class="prettyprint">oj-focus-highlight</code> is never applied. This
       *       behavior is not accessible, and is intended for use when the application wishes to use its own event listener to
       *       precisely control when the class is applied (see below). The application must ensure the accessibility of the result.</li>
       * </ul>
       *
       * <p>To change the behavior on a per-instance basis, the application can set the SASS variable as desired and then use
       * event listeners to toggle this class as needed.
       *
       * @ojfragment ojFocusHighlightDoc - For use in the Styling table of components using the oj-focus-highlight class with the
       *    $focusHighlightPolicy var.  Components using that class with a component-specific mechanism instead of that $var will need
       *    different verbiage, which could be decomped to another baseComponent fragment if shareable by multiple components.
       * @memberof oj.baseComponent
       */
    });

    // Remove base component from the jQuery prototype, so it could not be created
    // directly by page authors

    delete $.fn[_BASE_COMPONENT];
  })(); // end of BaseComponent wrapper function

  // -----------------------------------------------------------------------------
  // End of baseComponent, start of other content
  // -----------------------------------------------------------------------------

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
  oj.__registerWidget = function (name, base, prototype, isHidden) {
    $.widget(name, base, prototype);

    if (isHidden) {
      var globalName = name.split('.')[1];
      delete $.fn[globalName];
    }

    // create single-OJ pseudo-selector for component, e.g. ":oj-menu", in addition to the ":oj-ojMenu" that $.widget() creates.
    // for private components it will begin with an underscore, e.g.,  ":_oj-radio"
    if (name.substring(0, 5) === 'oj.oj' || name.substring(0, 6) === 'oj._oj') {
      var nameArray = name.split('.'); // ["oj", "ojMenu"], ["oj", "_ojRadio"]
      var namespace = nameArray[0]; // "oj"
      var simpleName = nameArray[1]; // "ojMenu", "_ojRadio"
      var fullName = namespace + '-' + simpleName; // "oj-ojMenu", "oj-_ojRadio"
      var isPrivate = simpleName.substring(0, 1) === '_';
      // if private, make the single-oj pseudo-selector start with an underscore, like this -> "_oj-radio"
      var modifiedFullName; // "oj-Menu", "_oj-Radio".  Lowercased below.
      if (isPrivate) {
        modifiedFullName = '_' + namespace + '-' + simpleName.substring(3);
      } else {
        modifiedFullName = namespace + '-' + simpleName.substring(2);
      }

      // Capitalization doesn't seem to matter with JQ pseudos, e.g. for the existing double-oj pseudo, both $(":oj-ojMenu") and $(":oj-ojmenu") work.
      // So, follow JQUI's pattern of using toLowerCase here, which will lowercase not only the "M' in "Menu", but also any camelcased chars after that.
      $.expr.pseudos[modifiedFullName.toLowerCase()] = function (elem) {
        return !!$.data(elem, fullName);
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
  function _defineDynamicProperty(
    self,
    originalDefaultValue,
    constructorValue,
    options,
    prop,
    getter,
    contextCallback
  ) {
    var override = constructorValue;
    var replaced = false;
    var overriddenSubkeys = {};

    // eslint-disable-next-line no-param-reassign
    delete options[prop];

    Object.defineProperty(options, prop, {
      get: function () {
        // Once the option is replaced, we no longer merge in defaults
        if (replaced) {
          return override;
        }

        if (self._settingNestedKey != null) {
          // The getter is getting called from the option() method that will be mutating the current
          // object. We need to return only the override portion in this case to avoid the defaults being
          // reapplied as an override

          return override;
        }

        var defaultVal = getter(contextCallback ? contextCallback() : prop);

        return _mergeOptionLayers([originalDefaultValue, defaultVal, override], overriddenSubkeys);
      },
      set: function (value) {
        override = value;

        if (self._settingNestedKey != null) {
          overriddenSubkeys[self._settingNestedKey] = true;
        } else {
          // The entire option has been replaced
          replaced = true;
        }
      },
      enumerable: true
    });
  }

  /**
   * @ignore
   */
  function _getCompoundDynamicGetter(values) {
    if (values.length === 1) {
      var val = values[0];
      return val instanceof __ojDynamicGetter ? val.getCallback() : null;
    }

    var hasGetters = false;
    for (var i = 0; i < values.length && !hasGetters; i++) {
      var value = values[i];
      if (value != null && value instanceof __ojDynamicGetter) {
        hasGetters = true;
      }
    }

    if (hasGetters) {
      return function (context) {
        var resolvedVals = [];
        values.forEach(function (_value) {
          if (_value != null && _value instanceof __ojDynamicGetter) {
            resolvedVals.push(_value.getCallback()(context));
          } else {
            resolvedVals.push(_value);
          }
        });

        return _mergeOptionLayers(resolvedVals);
      };
    }

    return null;
  }

  /**
   * @private
   */
  function _getSpecialContainerNames(element) {
    var elem = element;
    var containers = [];
    while (elem) {
      var ga = elem.getAttribute;
      var name = ga ? ga.call(elem, Components._OJ_CONTAINER_ATTR) : null;
      if (name != null) {
        containers.push(name);
      }
      elem = elem.parentNode;
    }

    return containers;
  }

  /**
   * @private
   */
  function _storeWidgetName(element, widgetName) {
    var data = element.data(_OJ_WIDGET_NAMES_DATA);
    if (!data) {
      data = [];
      element.data(_OJ_WIDGET_NAMES_DATA, data);
    }
    if (data.indexOf(widgetName) < 0) {
      data.push(widgetName);
    }
  }

  /**
   * @private
   */
  function _removeWidgetName(element, widgetName) {
    var data = element.data(_OJ_WIDGET_NAMES_DATA);
    if (data) {
      var index = data.indexOf(widgetName);
      if (index >= 0) {
        data.splice(index, 1);
        if (data.length === 0) {
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
  function _mergeOptionLayers(values, overriddenSubkeys) {
    var result;
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      if (value !== undefined) {
        if ($.isPlainObject(value)) {
          var input = $.isPlainObject(result) ? [result, value] : [value];
          // The last object (overrides) is always fully merged in
          result = _mergeObjectsWithExclusions(
            {},
            input,
            i === values.length - 1 ? null : overriddenSubkeys,
            null
          );
        } else {
          result = value;
        }
      }
    }
    return result;
  }

  /**
   * @private
   */
  function _mergeObjectsWithExclusions(target, input, ignoreSubkeys, basePath) {
    var inputLength = input.length;

    for (var inputIndex = 0; inputIndex < inputLength; inputIndex++) {
      var source = input[inputIndex];
      var keys = Object.keys(source);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var path;
        if (ignoreSubkeys == null) {
          path = null;
        } else if (basePath == null) {
          path = key;
        } else {
          path = basePath + '.' + key;
        }
        // Ignore all sources when the current path is registered in ignoreSubkeys
        if (ignoreSubkeys == null || !ignoreSubkeys[path]) {
          var value = source[key];
          if (value !== undefined) {
            if ($.isPlainObject(value)) {
              var params = $.isPlainObject(target[key]) ? [target[key], value] : [value];
              // eslint-disable-next-line no-param-reassign
              target[key] = _mergeObjectsWithExclusions({}, params, ignoreSubkeys, path);
            } else {
              // eslint-disable-next-line no-param-reassign
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
  function _returnTrue() {
    return true;
  }

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
   * // Returns {'subId': 'oj-some-sub-id', 'componentSpecificProperty': someValue, ...}
   * var context = myComponent.getContextByNode(nodeInsideElement);
   *
   * @ojfragment nodeContextExample
   * @memberof oj.baseComponent
   */

  /**
   * <p>The contextMenu slot is set on the <code class="prettyprint">oj-menu</code> within this element.
   * This is used to designate the JET Menu that this component should launch as a context menu on right-click, Shift-F10, Press & Hold, or component-specific gesture.
   * If specified, the browser's native context menu will be replaced by the JET Menu specified in this slot.
   * <p>
   * The application can register a listener for the Menu's ojBeforeOpen event. The listener can cancel the launch via event.preventDefault(),
   * or it can customize the menu contents by editing the menu DOM directly, and then calling refresh() on the Menu.
   * <p>
   * To help determine whether it's appropriate to cancel the launch or customize the menu, the ojBeforeOpen listener can use component API's to determine which
   * table cell, chart item, etc., is the target of the context menu. See the JSDoc of the individual components for details.
   * <p>
   * Keep in mind that any such logic must work whether the context menu was launched via right-click, Shift-F10, Press & Hold, or component-specific touch gesture.
   *
   * @ojslot contextMenu
   * @memberof oj.baseComponent
   * @ojpreferredcontent ["MenuElement"]
   * @ojdeprecated {since: '13.0.0', description: 'This web component no longer supports launching a context menu.'}
   * @ojshortdesc The contextMenu slot is set on the oj-menu instance within this element.  It designates the JET Menu to launch as a context menu.
   * @ojmaxitems 1
   *
   * @example <caption>Initialize the component with a context menu:</caption>
   * &lt;oj-some-element>
   *     &lt;-- use the contextMenu slot to designate this as the context menu for this component -->
   *     &lt;oj-menu slot="contextMenu" style="display:none" aria-label="Some element's context menu">
   * ...
   *     &lt;/oj-menu>
   * &lt;/oj-some-element>
   */

  /**
   * Sets a property or a subproperty (of a complex property) and notifies the component
   * of the change, triggering a [property]Changed event.
   * The value should be of the same type as the type of the attribute mentioned in this API document.
   *
   * @function setProperty
   * @since 4.0.0
   * @param {string} property - The property name to set. Supports dot notation for subproperty access.
   * @param {any} value - The new value to set the property to.
   * @return {void}
   *
   * @expose
   * @memberof oj.baseComponent
   * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
   * @instance
   *
   * @ojtsexample <caption>Set a single subproperty of a complex property:</caption>
   * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
   */
  /**
   * Retrieves the value of a property or a subproperty.
   * The return type will be the same as the type of the property as specified in this API document.
   * If the method is invoked with an incorrect property/subproperty name, it returns undefined.
   * @function getProperty
   * @since 4.0.0
   * @param {string} property - The property name to get. Supports dot notation for subproperty access.
   * @return {any}
   *
   * @expose
   * @memberof oj.baseComponent
   * @ojshortdesc Retrieves the value of a property or a subproperty.
   * @instance
   *
   * @ojtsexample <caption>Get a single subproperty of a complex property:</caption>
   * let subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
   */
  /**
   * Performs a batch set of properties.
   * The type of value for each property being set must match the type of the property as specified in this
   * API document.
   * @function setProperties
   * @since 4.0.0
   * @param {Object} properties - An object containing the property and value pairs to set.
   * @return {void}
   *
   * @expose
   * @memberof oj.baseComponent
   * @ojshortdesc Performs a batch set of properties.
   * @instance
   *
   * @ojtsexample <caption>Set a batch of properties:</caption>
   * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
   */

  // override jQuery's cleanData method to bypass cleanup of custom elements and composites
  $.cleanData = (function (orig) {
    return function (elems) {
      var nonCustomElements = [];
      for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem == null) {
          break;
        }

        // Skip cleaning any elements that are custom elements or are created by a custom element
        var bSkip = false;
        var constr = Components.__GetWidgetConstructor(elem);
        if (constr) {
          bSkip = constr('instance')._IsCustomElement();
          if (!bSkip) {
            var parent = Components.getComponentElementByNode(elem);
            bSkip = parent && ojcustomelementUtils.CustomElementUtils.isElementRegistered(parent.tagName);
          }
        }
        if (!bSkip) {
          nonCustomElements.push(elem);
        }
      }
      if (nonCustomElements.length > 0) {
        orig(nonCustomElements);
      }
    };
  })($.cleanData);

  // Override addClass + removeClass to use classList instead of add/removeAttribute in order
  // to avoid conflicting with fixes to work with Preact's class patching logic

  // Copied from jQuery
  function getClass(elem) {
    return (elem.getAttribute && elem.getAttribute('class')) || '';
  }

  $.fn.addClass = function (value) {
    if (typeof value === 'function') {
      return this.each(function (j) {
        $(this).addClass(value.call(this, j, getClass(this)));
      });
    }

    const iterableClasses = Array.isArray(value) ? value : ojcustomelementUtils.CustomElementUtils.getClassSet(value);
    this.each(function () {
      if (this.nodeType === 1) {
        this.classList.add(...iterableClasses);
      }
    });
    return this;
  };

  $.fn.removeClass = function (value) {
    if (typeof value === 'function') {
      return this.each(function (j) {
        $(this).removeClass(value.call(this, j, getClass(this)));
      });
    }

    if (!arguments.length) {
      return this.attr('class', '');
    }

    const iterableClasses = Array.isArray(value) ? value : ojcustomelementUtils.CustomElementUtils.getClassSet(value);
    this.each(function () {
      if (this.nodeType === 1) {
        this.classList.remove(...iterableClasses);
      }
    });
    return this;
  };

  /**
   * @export
   * @class
   * @since 1.0
   * @classdesc Common test support in JavaScript
   * @ojtsignore
   */
  const Test = {};
  oj._registerLegacyNamespaceProp('Test', Test);

  /**
   * A global application flag that can be set by a test to indicate that all page startup processing is done
   * and an external automated test can begin
   * @export
   * @type {boolean}
   */
  Test.ready = false;

  /**
   * @export
   * Return the node found given the locator
   * @param {Object|string} locator A locator which is either a JSON string (to be parsed using $.parseJSON), or an Object with the following properties:
   *                                             element: the component's selector, determined by the test author when laying out the page
   *                                             subId: the string, documented by the component, that the component expects in getNodeBySubId to locate a particular subcomponent
   *  @returns {any} the subcomponent located by the subId string passed in locator, if found.
   */
  Test.domNodeForLocator = function (locator) {
    var locObj = locator;
    if (oj.StringUtils.isString(locator)) {
      var locStr = /** @type {string} */ (locator);
      try {
        locObj = JSON.parse(locStr);
      } catch (e) {
        return null;
      }
    }
    if (locObj && locObj.element) {
      var element = $(locObj.element);
      if (element && element.length > 0) {
        delete locObj.element;
        var id = /** @type {Object} */ (locObj);
        return Components.getNodeBySubId(element[0], id);
      }
    }
    return null;
  };

  /**
   * @return {number} total number of open popups
   * @export
   * @since 1.1.0
   */
  Test.getOpenPopupCount = function () {
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
  Test.findOpenPopups = function () {
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
  Test.compareStackingContexts = function (el1, el2) {
    return oj.ZOrderUtils.compareStackingContexts(el1, el2);
  };

  const subtreeAttached = Components.subtreeAttached;
  const subtreeDetached = Components.subtreeDetached;
  const subtreeHidden = Components.subtreeHidden;
  const subtreeShown = Components.subtreeShown;
  const createDynamicPropertyGetter = Components.createDynamicPropertyGetter;
  const setDefaultOptions = Components.setDefaultOptions;
  const getDefaultOptions = Components.getDefaultOptions;
  const __GetWidgetConstructor = Components.__GetWidgetConstructor;
  const setComponentOption = Components.setComponentOption;
  const getComponentOption = Components.getComponentOption;
  const getWidgetConstructor = Components.getWidgetConstructor;
  const isComponentInitialized = Components.isComponentInitialized;
  const markPendingSubtreeHidden = Components.markPendingSubtreeHidden;
  const unmarkPendingSubtreeHidden = Components.unmarkPendingSubtreeHidden;
  const __getDefaultOptions = Components.__getDefaultOptions;
  const getComponentElementByNode = Components.getComponentElementByNode;
  const getSubIdByNode = Components.getSubIdByNode;
  const getNodeBySubId = Components.getNodeBySubId;
  const callComponentMethod = Components.callComponentMethod;
  const _OJ_CONTAINER_ATTR = Components._OJ_CONTAINER_ATTR;

  exports.DataProviderFeatureChecker = DataProviderFeatureChecker;
  exports._OJ_CONTAINER_ATTR = _OJ_CONTAINER_ATTR;
  exports.__GetWidgetConstructor = __GetWidgetConstructor;
  exports.__getDefaultOptions = __getDefaultOptions;
  exports.callComponentMethod = callComponentMethod;
  exports.createDynamicPropertyGetter = createDynamicPropertyGetter;
  exports.getComponentElementByNode = getComponentElementByNode;
  exports.getComponentOption = getComponentOption;
  exports.getDefaultOptions = getDefaultOptions;
  exports.getNodeBySubId = getNodeBySubId;
  exports.getSubIdByNode = getSubIdByNode;
  exports.getWidgetConstructor = getWidgetConstructor;
  exports.isComponentInitialized = isComponentInitialized;
  exports.markPendingSubtreeHidden = markPendingSubtreeHidden;
  exports.setComponentOption = setComponentOption;
  exports.setDefaultOptions = setDefaultOptions;
  exports.subtreeAttached = subtreeAttached;
  exports.subtreeDetached = subtreeDetached;
  exports.subtreeHidden = subtreeHidden;
  exports.subtreeShown = subtreeShown;
  exports.unmarkPendingSubtreeHidden = unmarkPendingSubtreeHidden;

  Object.defineProperty(exports, '__esModule', { value: true });

});
