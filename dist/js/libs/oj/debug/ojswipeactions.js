/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojoption', 'touchr', 'ojs/ojcore-base', 'jquery', 'ojs/ojdomutils', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojoffcanvas', 'ojs/ojswipetoreveal', 'ojs/ojcustomelement-utils'], function (ojoption, touchr, oj, $, DomUtils, Context, ojconfig, ojoffcanvas, ojswipetoreveal, ojcustomelementUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

  (function () {
var __oj_swipe_actions_metadata = 
{
  "properties": {
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "ariaHideActionsDescription": {
          "type": "string"
        },
        "ariaShowEndActionsDescription": {
          "type": "string"
        },
        "ariaShowStartActionsDescription": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAction": {}
  },
  "extension": {}
};
    __oj_swipe_actions_metadata.extension._WIDGET_NAME = 'ojSwipeActions';
    oj.CustomElementBridge.register('oj-swipe-actions', {
      metadata: __oj_swipe_actions_metadata
    });
  })();

  (function () {
    /*!
     * JET SwipeActions @VERSION
     *
     *
     * Depends:
     *  jquery.ui.widget.js
     */

    /**
     * @ojcomponent oj.ojSwipeActions
     * @augments oj.baseComponent
     * @since 5.1.0
     *
     *
     * @ojshortdesc A swipe actions component adds swipe-to-reveal functionality to elements such as items in ListView.
     *
     * @ojvbdefaultcolumns 12
     * @ojvbmincolumns 12
     *
     * @ojoracleicon 'oj-ux-ico-swipe-to-reveal'
     * @ojuxspecs ['swipe-actions']
     *
     * @classdesc
     * <h3 id="swipeActionsOverview-section">
     *   JET SwipeActions Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#swipeActionsOverview-section"></a>
     * </h3>
     * <p>Description: SwipeActions can be added to an item in ListView to add swipe-to-reveal functionality when user swipes an item.
     *    The SwipeActions contains a <code class="prettyprint">start</code> and/or an <code class="prettyprint">end</code> slot, each represent the action bar to display when
     *    user swipes in a particular direction.  The <code class="prettyprint">oj-option</code> element is used to represent each item in the action bar.
     * </p>
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-list-view>
     *   &lt;template slot='itemTemplate'>
     *     &lt;li class='oj-swipeactions-container'>
     *       &lt;oj-swipe-actions on-oj-action='[[listener]]'>
     *         &lt;-- Content of item goes to the default slot -->
     *         &lt;span>Item content&lt;/span>
     *         &lt;-- Display when user swipes from end to start of the item -->
     *         &lt;template slot='end'>
     *           &lt;oj-option>Action 1&lt;/oj-option>
     *           &lt;oj-option class='oj-swipeactions-default'>Action 2&lt;/oj-option>
     *         &lt;/template>
     *       &lt;/oj-swipe-actions>
     *     &lt;/li>
     *   &lt;/template>
     * &lt;/oj-list-view>
     * </code>
     * </pre>
     *
     * <h3 id="actionIcon-section">
     *   Icon
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#actionIcon-section"></a>
     * </h3>
     *
     * <p>SwipeActions currently supports the rendering of icon for each options. To render the icon, the
     * <code class="prettyprint">startIcon</code> slot of the <code class="prettyprint">oj-option</code>
     * should be specified. See the <code class="prettyprint">oj-option</code> doc for details about accepted children and slots.</p>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>SwipeActions will display skip links that allow users to access swipe actions when the element has focus.  This implies that
     *    when SwipeActions is a child of ListView, the skip links will become accessible when user hits the F2 key.</p>
     * <p>Although the swipe actions are accessible with the keyboard using skip links, it is recommended that applications provide an alternative
     *    way for the users to perform all the swipe actions.
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
     */
    // --------------------------------------------------- oj.ojSwipeActions Styling Start ------------------------------------------------------------
    /**
     * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
     */
    // ---------------- oj-swipeactions-container --------------
    /**
     * Designed for use with item in oj-list-view that contains the oj-swipe-actions element, specifically this will remove the padding around the content of the item so that the swipe actions can take the full height.<br/>
     * Is applied to the root of each item in oj-list-view containing the oj-swipe-actions element.
     * @ojstyleclass oj-swipeactions-container
     * @ojdisplayname No Padding
     * @ojstyleselector oj-list-view li
     * @memberof oj.ojSwipeActions
     */
    // ---------------- oj-swipeactions-[swipe-option] --------------
    /**
     * Designed to tag swipe action items within an oj-list-view.
     * @ojstyletemplate oj-swipeactions-[swipe-option]
     * @ojdisplayname Swipe Action Items
     * @ojstyleselector oj-swipe-actions oj-option
     * @ojstyletemplatetokens ["StylingTemplateTokens.[swipe-option]"]
     * @memberof oj.ojSwipeActions
     */
    // --------------------------------------------------- oj.ojSwipeActions Styling End ------------------------------------------------------------

    oj.__registerWidget('oj.ojSwipeActions', $.oj.baseComponent, {
      version: '1.0.0',
      defaultElement: '<div>',
      widgetEventPrefix: 'oj',

      options: {
        /**
         * <p>Triggered when an action item is selected or when the default action is triggered.
         *
         * @expose
         * @event
         * @memberof oj.ojSwipeActions
         * @instance
         */
        action: null
      },

      _ComponentCreate: function () {
        var self = this;
        var enterPressed = false;
        var defaultActionTriggered = false;
        var offcanvas;
        var actionTarget;

        this._super();

        this.element.uniqueId();
        this.element[0].classList.add('oj-swipeactions', 'oj-component');
        this.element[0].setAttribute('tabIndex', '-1');

        // pass true to catch these events on all menus, not just enabled menus
        this._on(true, {
          keydown: function (event) {
            // ESC key
            if (event.keyCode === 27) {
              offcanvas = event.target.parentNode.parentNode;
              if (offcanvas.classList.contains('oj-offcanvas-open')) {
                self._close({ selector: offcanvas, _animate: false });
                event.preventDefault();
              }
            } else if (event.keyCode === 13) {
              // enter key could have incorrectly propagated from acc links to action
              // use this to ensure enter originates from action
              if (event.target.classList.contains('oj-swipeactions-action-panel')) {
                enterPressed = true;
              }
            }
          },
          keyup: function (event) {
            // ENTER key
            if (event.keyCode === 13 && enterPressed) {
              self._handleAction(event);
            }
            enterPressed = false;
          },
          mousedown: function (event) {
            actionTarget = self._handleMouseDownorTouchStart(event);
          },

          touchstart: function (event) {
            actionTarget = self._handleMouseDownorTouchStart(event);
          },

          click: function (event) {
            // if clicked on an action from the action bar, we would stop the event from bubbling so that its
            // host (ListView) will not try to process the click event (and select the item for example)
            if (self._handleAction(event, actionTarget)) {
              event.stopPropagation();
            }
            actionTarget = null;
          },
          ojdefaultaction: function (event, _offcanvas) {
            var ojOption = $(_offcanvas.selector).children('oj-option.oj-swipetoreveal-default');
            if (ojOption.length > 0) {
              self._fireActionEvent(ojOption[0], null);
              // can't close offcanvas here until it has been opened, set a flag and close it in ojopen handler
              defaultActionTriggered = true;
            }
          },
          ojopen: function (event, _offcanvas) {
            if (defaultActionTriggered) {
              self._close(_offcanvas);
            }
            defaultActionTriggered = false;
            self._updateOptionClass(
              event.target,
              '.oj-sm-align-self-center',
              'oj-flex-bar-center-absolute'
            );
            self._releaseBusyState();
          },
          ojclose: function (event, _offcanvas) {
            // remove any existing hide link
            var accLink = $(_offcanvas.selector).children('.oj-swipeactions-hide-actions-link');
            if (accLink.length > 0) {
              accLink[0].parentNode.removeChild(accLink[0]);
            }
            var className = this._getOptionClass(event.target);
            self._updateOptionClass(event.target, '.oj-flex-bar-center-absolute', className);
            self._releaseBusyState();
          }
        });

        this._focusable({
          applyHighlight: true,
          setupHandlers: function (focusInHandler, focusOutHandler) {
            self._focusInHandler = focusInHandler;
            self._focusOutHandler = focusOutHandler;
          }
        });

        this._setup();
      },

      /**
       * Release busy state
       * @private
       */
      _releaseBusyState: function () {
        if (this.busyStateResolve) {
          this.busyStateResolve();
          this.busyStateResolve = null;
        }
      },

      /**
       * Close an offcanvas
       * @private
       */
      _close: function (offcanvasInfo) {
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        var busyStateResolve = busyContext.addBusyState({ description: 'closing offcanvas' });
        return ojoffcanvas.close(offcanvasInfo).then(function () {
          busyStateResolve();
        });
      },

      /**
       * Handles when mousedown/touchstart occurs on an action/option
       * @private
       */
      _handleMouseDownorTouchStart: function (event) {
        return event.target.closest('oj-option');
      },

      /**
       * Handles when user click or enter on an action/option
       * @private
       */
      _handleAction: function (event, actionTarget) {
        var theOption;
        if (actionTarget) {
          theOption = actionTarget;
        } else {
          var ojOption = $(event.target).parents('oj-option');
          if (ojOption.length > 0) {
            theOption = ojOption[0];
          }
        }
        if (theOption) {
          this._close({ selector: theOption.parentNode }).then(
            function () {
              this._fireActionEvent(theOption, event);
              // case for keyboard, need to restore focus
              if (actionTarget == null) {
                this.element[0].parentNode.focus();
              }
            }.bind(this)
          );
          return true;
        }
        return false;
      },

      /**
       * Sets up resources needed by this SwipeActions
       * @memberof! oj.ojSwipeActions
       * @instance
       * @override
       * @protected
       */
      _SetupResources: function () {
        this._super();
        this._setupOrReleaseOffcanvas(ojswipetoreveal.tearDownSwipeActions);
        this._setupOrReleaseOffcanvas(ojswipetoreveal.setupSwipeActions, {
          callback: () => {
            return this.busyStateResolve != null;
          }
        });
      },

      /**
       * Release resources held by listview
       * @memberof! oj.ojSwipeActions
       * @instance
       * @override
       * @protected
       */
      _ReleaseResources: function () {
        this._super();
        this._setupOrReleaseOffcanvas(ojswipetoreveal.tearDownSwipeActions);
        this._releaseBusyState();
      },

      /**
       * @private
       */
      _setupOrReleaseOffcanvas: function (func, options) {
        this._applyOffcanvas('oj-offcanvas-start', func, options);
        this._applyOffcanvas('oj-offcanvas-end', func, options);
      },

      /**
       * @private
       */
      _closeAllOffcanvas: function () {
        var self = this;

        var closer = function (offcanvas) {
          self._close({ selector: offcanvas });
        };

        this._applyOffcanvas('oj-offcanvas-start', closer);
        this._applyOffcanvas('oj-offcanvas-end', closer);
      },

      /**
       * @private
       */
      _applyOffcanvas: function (selector, func, options) {
        var offcanvas = this.element[0].querySelector('.' + selector);
        if (offcanvas) {
          func(offcanvas, options);
        }
      },

      /**
       * Trigger an action event
       * @private
       */
      _fireActionEvent: function (ojOption, event) {
        var detail = {};
        if (event) {
          detail.originalEvent = event instanceof $.Event ? event.originalEvent : event;
        }

        var params = { detail: detail };
        params.cancelable = true;
        params.bubbles = true;

        DomUtils.dispatchEvent(ojOption, new CustomEvent('ojAction', params));
      },

      /**
       * Re-initialize the swipe actions after having made some external modifications.
       *
       * <p>This method does not accept any arguments.
       *
       * @ojshortdesc Re-initialize the swipe actions.
       * @expose
       * @memberof oj.ojSwipeActions
       * @return {void}
       * @instance
       *
       * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
       * mySwipeActions.refresh();
       */
      refresh: function () {
        this._super();

        this._releaseBusyState();
        this._setupOrReleaseOffcanvas(ojswipetoreveal.tearDownSwipeActions);
        this._setup();
        this._setupOrReleaseOffcanvas(ojswipetoreveal.setupSwipeActions, {
          callback: () => {
            return this.busyStateResolve != null;
          }
        });
      },

      /**
       * @private
       */
      _createOffcanvas: function (slotMap, slot) {
        var template = slotMap[slot];
        if (template && template.length > 0 && template[0].tagName === 'TEMPLATE') {
          var offcanvas = document.createElement('div');
          offcanvas.className = slot === 'start' ? 'oj-offcanvas-start' : 'oj-offcanvas-end';
          this.element[0].appendChild(offcanvas);
          this._renderAccessibleLink(offcanvas);
        }
      },

      /**
       * @private
       */
      _setup: function () {
        var self = this;

        this.element[0].classList.add('oj-offcanvas-inner-wrapper');
        this.element[0].parentNode.classList.add('oj-offcanvas-outer-wrapper');

        var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(this.element[0]);

        // create the offcanvas for the start/end slots
        this._createOffcanvas(slotMap, 'start');
        this._createOffcanvas(slotMap, 'end');

        // listen for pan to happen and only render it when reveal wasn't veto'ed
        $(this.element).on('ojpanstart', function (event) {
          if (!event.isDefaultPrevented()) {
            self._renderOffcanvas(event.target);
          }
        });

        $(this.element).on('ojpanend', function () {
          var busyContext = Context.getContext(self.element[0]).getBusyContext();
          self.busyStateResolve = busyContext.addBusyState({
            description: 'opening or closing offcanvas'
          });
        });
      },

      /**
       * @private
       */
      _renderOffcanvas: function (offcanvas, callback) {
        var self = this;

        offcanvas.setAttribute('role', 'toolbar');
        offcanvas.setAttribute('data-oj-context', '');

        var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(this.element[0]);

        var template = offcanvas.classList.contains('oj-offcanvas-start')
          ? slotMap.start[0]
          : slotMap.end[0];
        var busyContext = Context.getContext(self.element[0]).getBusyContext();
        var busyStateResolve = busyContext.addBusyState({ description: 'rendering ojoptions' });
        const templateOptions = {
          customElement: this._GetCustomElement()
        };
        ojconfig.__getTemplateEngine(templateOptions).then(
          function (engine) {
            self._render(engine, offcanvas, template);
            if (callback) {
              // wait for oj-option to render before invoking callback
              busyContext = Context.getContext(offcanvas).getBusyContext();
              busyContext.whenReady().then(function () {
                callback();
                busyStateResolve();
              });
            } else {
              busyStateResolve();
            }
          },
          function (reason) {
            busyStateResolve();
            throw new Error('Error loading template engine: ' + reason);
          }
        );
      },

      /**
       * Show all accessible links
       * @private
       */
      _showAccessibleLinks: function () {
        var margin = 0;

        var links = this.element[0].querySelectorAll('a.oj-helper-hidden-accessible');
        for (var i = 0; i < links.length; i++) {
          links[i].style.left = margin + 'px';
          links[i].className = 'oj-swipeactions-accessible-link';
          margin = margin + links[i].offsetWidth + 5;
        }
      },

      /**
       * Hide all accessible links
       * @private
       */
      _hideAccessibleLinks: function () {
        var links = this.element[0].querySelectorAll('a.oj-swipeactions-accessible-link');
        for (var i = 0; i < links.length; i++) {
          links[i].className = 'oj-helper-hidden-accessible';
        }
      },

      /**
       * Renders a hidden link that provides an accessible way to show the swipe actions
       * @private
       */
      _renderAccessibleLink: function (offcanvas) {
        var isTriggerByTouch = false;
        var self = this;

        var link = document.createElement('a');
        link.setAttribute('tabIndex', '0');
        link.setAttribute('href', '#');
        link.textContent = this.getTranslatedString(
          offcanvas.classList.contains('oj-offcanvas-start')
            ? 'ariaShowStartActionsDescription'
            : 'ariaShowEndActionsDescription'
        );

        // Due to Chrome bug https://bugs.chromium.org/p/chromium/issues/detail?id=657157
        // Talkback will not be able to activate link/button when it is not visible, so we cannot use oj-helper-hidden-accessible
        // using absoluate will make it invisible within the listview item but activatable when it receive accessible focus
        var isAndroid = oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.ANDROID;
        if (isAndroid) {
          link.style.color = 'transparent';
          link.className = 'oj-swipeactions-accessible-link';
          if (offcanvas.classList.contains('oj-offcanvas-end')) {
            var startLink = this.element[0].querySelector('a.oj-swipeactions-accessible-link');
            if (startLink != null) {
              link.style.right = '0px';
            }
          }

          link.addEventListener(
            'touchstart',
            function (event) {
              // whether the touch event is triggered by a touch or talkback double tap
              isTriggerByTouch = event.touches[0].force > 0;
            },
            { passive: true }
          );
        } else {
          link.className = 'oj-helper-hidden-accessible';
        }

        link.addEventListener('focus', function () {
          // show it when it has focus
          if (!isAndroid) {
            self._showAccessibleLinks();
          }
          // make sure all offcanvas are close
          self._closeAllOffcanvas();
        });

        link.addEventListener('blur', function (event) {
          // VoiceOver will trigger a blur with null relatedTarget
          if (
            event.relatedTarget != null &&
            !event.relatedTarget.classList.contains('oj-swipeactions-accessible-link')
          ) {
            // need this timeout to hide otherwise VoiceOver will not be able to shift focus
            setTimeout(function () {
              if (!isAndroid) {
                self._hideAccessibleLinks();
              }
            }, 0);
          }
        });

        link.addEventListener('click', function (event) {
          // isTriggerByTouch will only be true if user touches the link on Android
          if (isTriggerByTouch) {
            return;
          }

          // to prevent enter key processed by ListView
          event.preventDefault();
          // to prevent selection
          event.stopPropagation();

          self._renderOffcanvas(offcanvas, function () {
            if (offcanvas.childElementCount === 0) {
              return;
            }

            $(offcanvas)
              .children('oj-option')
              .addClass('oj-swipetoreveal-action')
              .children()
              .attr('tabIndex', 0);

            var offcanvasInfo = {};
            offcanvasInfo.selector = offcanvas;
            // we are going to manage dismissal otherwise VoiceOver will close the offcanvas prematurely
            offcanvasInfo.autoDismiss = 'none';
            // turn animation off otherwise Talkback will not be able to focus on the item correctly
            offcanvasInfo._animate = false;
            offcanvasInfo.displayMode = 'push';

            // on Android with TalkBack, click event is not fired when activate
            var isTouchDevice = DomUtils.isTouchSupported();
            var hideLink = null;

            if (isTouchDevice) {
              hideLink = document.createElement('a');
              hideLink.className = 'oj-swipeactions-hide-actions-link';
              hideLink.setAttribute('tabIndex', '0');
              hideLink.setAttribute('href', '#');
              hideLink.setAttribute(
                'aria-label',
                self.getTranslatedString('ariaHideActionsDescription')
              );

              hideLink.addEventListener('touchend', function () {
                self._close(offcanvasInfo);
              });
            }
            var busyContext = Context.getContext(self.element[0]).getBusyContext();
            var busyStateResolve = busyContext.addBusyState({ description: 'opening offcanvas' });
            ojoffcanvas.open(offcanvasInfo).then(function () {
              if (hideLink) {
                offcanvas.appendChild(hideLink);
              }
              busyStateResolve();
            });
          });
        });

        this.element[0].appendChild(link);
      },

      /**
       * @private
       */
      _render: function (templateEngine, offcanvas, template) {
        var self = this;

        // remove any existing oj-options from previous render
        $(offcanvas).children('oj-option').remove();

        var ojOptions = [];
        var nodes = templateEngine.execute(this.element[0], template, null);
        nodes.forEach(function (node) {
          // nodes could contain comments and other artifacts
          if (node.tagName === 'OJ-OPTION') {
            ojOptions.push(node);
          }
        });

        ojOptions.forEach(function (option) {
          // eslint-disable-next-line no-param-reassign
          option.customOptionRenderer = self._customOptionRenderer.bind(self);
          offcanvas.appendChild(option);
        });
      },

      /**
       * @private
       */
      _customOptionRenderer: function (option) {
        var self = this;

        // check if it's alraedy rendered
        var children = $(option).children('div');
        if (children.length > 0) {
          return;
        }

        option.setAttribute('role', 'button');
        // eslint-disable-next-line no-param-reassign
        option.dataset.ojAction = option.value;

        // assign default action (by using SwipeToRevealUtils marker class)
        if (option.classList.contains('oj-swipeactions-default')) {
          option.classList.add('oj-swipetoreveal-default');
        }

        var container = document.createElement('div');
        container.className = 'oj-flex-bar oj-swipeactions-action-panel';
        container.addEventListener('focus', function () {
          self._focusInHandler($(container));
        });

        container.addEventListener('blur', function () {
          self._focusOutHandler($(container));
        });

        var inner = document.createElement('div');
        inner.className = this._getOptionClass(option.parentElement);

        container.appendChild(inner); // @HTMLUpdateOK append trusted new DOM

        var textIconContainer = document.createElement('div');
        textIconContainer.className = 'oj-flex oj-sm-flex-direction-column';
        inner.appendChild(textIconContainer); // @HTMLUpdateOK append trusted new DOM

        var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(option);

        var iconSlot = slotMap.startIcon;
        if (iconSlot) {
          iconSlot.forEach(function (node) {
            textIconContainer.appendChild(node); // @HTMLUpdateOK append trusted new DOM
          });
        }

        var textSlot = slotMap[''];
        if (textSlot) {
          var text = document.createElement('div');
          text.className = 'oj-flex-item oj-swipeactions-action-text';
          textIconContainer.appendChild(text); // @HTMLUpdateOK append trusted new DOM
          textSlot.forEach(function (node) {
            text.appendChild(node); // @HTMLUpdateOK reparent trusted child DOM in menu item
          });
        }

        $(option).prepend(container); // @HTMLUpdateOK append trusted new DOM
      },

      /**
       * @private
       */
      _updateOptionClass: function (element, selectorClass, className) {
        var options = element.querySelectorAll(selectorClass);
        options.forEach(function (el) {
          var option = el;
          option.className = className;
        });
      },

      /**
       * @private
       */
      _getOptionClass: function (element) {
        // determine alignment of icons based on pull direction
        return element.classList.contains('oj-offcanvas-end')
          ? 'oj-flex-bar-start oj-sm-align-self-center'
          : 'oj-flex-bar-end oj-sm-align-self-center';
      },

      /**
       * Used by test adapter to invoke an action
       * @private
       */
      _doAction: function (action) {
        return new Promise(
          function (resolve) {
            var option = this.element[0].querySelector('oj-option[data-oj-action="' + action + '"');
            if (option != null) {
              this._fireActionEvent(option, null);
              resolve();
            } else {
              var offcanvas = this.element[0].querySelector('.oj-offcanvas-start');
              if (
                offcanvas != null &&
                offcanvas.childElementCount === 0 &&
                offcanvas._checked === undefined
              ) {
                offcanvas._checked = true;
                this._renderOffcanvas(
                  offcanvas,
                  function () {
                    this._doAction(action);
                    resolve();
                  }.bind(this)
                );
              } else {
                offcanvas = this.element[0].querySelector('.oj-offcanvas-end');
                if (
                  offcanvas != null &&
                  offcanvas.childElementCount === 0 &&
                  offcanvas._checked === undefined
                ) {
                  offcanvas._checked = true;
                  this._renderOffcanvas(
                    offcanvas,
                    function () {
                      this._doAction(action);
                      resolve();
                    }.bind(this)
                  );
                } else {
                  resolve();
                }
              }
            }
          }.bind(this)
        );
      },

      /**
       * @private
       */
      _destroy: function () {
        // remove touchstart listener
        this.element[0].removeEventListener('touchstart', this._touchstartListener, {
          passive: false
        });
        delete this._touchstartListener;
      }
    });
  })();

  // Slots

  /**
   * <p>When using SwipeActions within ListView, any content for the item in ListView should be added as child element in SwipeActions.
   *
   * @ojchild Default
   * @memberof oj.ojSwipeActions
   *
   * @example <caption>Initialize the SwipeActions to display some text inside the item of ListView:</caption>
   * &lt;oj-list-view>
   *   &lt;template slot='itemTemplate'>
   *     &lt;oj-swipe-actions>
   *       &lt;span>Item content&lt;/span>
   *     &lt;/oj-swipe-actions>
   *   &lt;/template>
   * &lt;/oj-list-view>
   */

  /**
   * <p>The <code class="prettyprint">start</code> slot is used to specify the action bar options that appear when user swipes from start to end on its container. The slot content must be a &lt;template> element.</p>
   *
   * <p>When the template is executed, it will have access to the parent binding context.  For example, in the case of ListView, $current should return the data of the row containing the swipe actions.</p>
   *
   *
   * @ojslot start
   * @ojshortdesc The start slot is used to specify the action bar options that appear when user swipes from start to end on its container. See the Help documentation for more information.
   * @memberof oj.ojSwipeActions
   * @ojpreferredcontent ["OptionElement"]
   *
   * @example <caption>Initialize the SwipeActions with a set of options that appears when user swipes from start to end:</caption>
   * &lt;oj-swipe-actions>
   *   &lt;template slot='start'>
   *     &lt;oj-option value='action1'>Action 1&lt;/oj-option>
   *     &lt;oj-option value='action2'>Action 2&lt;/oj-option>
   *   &lt;template>
   * &lt;/oj-swipe-actions>
   */

  /**
   * <p>The <code class="prettyprint">end</code> slot is used to specify the action bar options that appear when user swipes from end to start on its container. The slot content must be a &lt;template> element.</p>
   *
   * <p>When the template is executed, it will have access to the parent binding context.  For example, in the case of ListView, $current should return the data of the row containing the swipe actions.</p>
   *
   *
   * @ojslot end
   * @ojshortdesc The end slot is used to specify the action bar options that appear when user swipes from end to start on its container. See the Help documentation for more information.
   * @memberof oj.ojSwipeActions
   * @ojpreferredcontent ["OptionElement"]
   *
   * @example <caption>Initialize the SwipeActions with a set of options that appears when user swipes from end to start:</caption>
   * &lt;oj-swipe-actions>
   *   &lt;template slot='end'>
   *     &lt;oj-option value='action1'>Action 1&lt;/oj-option>
   *     &lt;oj-option value='action2'>Action 2&lt;/oj-option>
   *   &lt;template>
   * &lt;/oj-swipe-actions>
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
   *       <td>oj-swipeactions-container element</td>
   *       <td><kbd>Swipe</kbd></td>
   *       <td>Reveals the swipe actions.  Depending on the distance relative to the target is swiped, the oj-swipe-actions will either be closed (swipe distance too short), opened, or the default action is performed (swipe distance passed a certain threshold).</td>
   *     </tr>
   *     <tr>
   *       <td>oj-swipeactions-container element</td>
   *       <td><kbd>Pan</kbd></td>
   *       <td>Reveals the swipe actions.  If a default action is specified, the default action will take over all the space of other action items after the user panned past a certain distance.</td>
   *     </tr>
   *     <tr>
   *       <td>oj-swipe-action element</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Triggers the action associated with the swipe action.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojSwipeActions
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
   *       <td>ListView Item</td>
   *       <td><kbd>F2</kbd></td>
   *       <td>If SwipeActions is a child of ListView, then pressing F2 key on the ListView item will focus on the SwipeActions, which cause it to display the show actions links for the start and end swipe actions.</td>
   *     </tr>
   *     <tr>
   *       <td>Show actions link</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Reveals the start/end swipe actions.</td>
   *     </tr>
   *     <tr>
   *       <td>Hide actions link</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Hides the start/end swipe actions.</td>
   *     </tr>
   *     <tr>
   *       <td rowspan = "3">Swipe action</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Trigger the action associated with the swipe action.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Esc</kbd></td>
   *       <td>Hide the swipe actions.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Tab</kbd></td>
   *       <td>Navigate to the next swipe action.  If it is the last swipe action, navigate to the hide actions link.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojSwipeActions
   */

});
