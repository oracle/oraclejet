/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'preact', 'jquery', 'ojs/ojanimation', 'ojs/ojcore-base', 'ojs/ojpopup', 'ojs/ojpopupcore', 'ojs/ojdrawerutils', 'hammerjs', 'ojs/ojcustomelement-utils', 'ojs/ojcontext'], function (exports, jsxRuntime, ojvcomponent, preact, $, AnimationUtils, oj, ojpopup, ojpopupcore, ojdrawerutils, Hammer, ojcustomelementUtils, Context) { 'use strict';

    $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    Hammer = Hammer && Object.prototype.hasOwnProperty.call(Hammer, 'default') ? Hammer['default'] : Hammer;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var DrawerPopup_1;
    const targetElement = window;
    /**
     * @classdesc
     * <h3 id="drawerPopupOverview-section">
     *   JET Drawer Popup
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#drawerPopupOverview-section"></a>
     * </h3>
     * <p>Description: A drawer popup is an isolated element. A drawer is a panel that slides into the viewport.</p>
     * <pre class="prettyprint">
     * <code>
     *&lt;oj-drawer-popup>
     *    Start drawer content
     * &lt;/oj-drawer-popup>
     *
     *&lt;oj-drawer-popup edge="end" opened="true">
     *    End drawer content
     * &lt;/oj-drawer-popup>
     *
     *&lt;oj-drawer-popup edge="bottom">
     *    Bottom drawer content
     * &lt;/oj-drawer-popup>
     *
     * Main section content
     *</code></pre>
     *
     * <p id="drawer-layout-popup-section">JET DrawerPopup and DrawerLayout look similar, but are intended to be used
     * for different purposes.</p>
     * <p>Use DrawerPopup when you need to always show 'overlay' drawers.</p>
     * <p>Use DrawerLayout when you need to switch from 'reflow' display mode (big screens) to 'overlay' (small screens).</p>
     *
     * <h3 id="migration-section">
     *   Migration
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
     * </h3>
     *  To migrate from oj-drawer-popup to oj-c-drawer-popup, you need to revise the import statement and references to oj-c-drawer-popup in your app.
     *  In addition, please note the changes between the two components below.
     *  <h5>role attribute</h5>
     *  <p>The <code class="prettyprint">role</code> attribute custom value is no longer supported and the drawer will always have the ‘dialog’ role.
     *  </p>
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     * <table class="keyboard-table">
     *  <thead>
     *    <tr>
     *      <th>Target</th>
     *      <th>Key</th>
     *      <th>Action</th>
     *    </tr>
     *  </thead>
     *  <tbody>
     *    <tr>
     *      <td>Drawer element</td>
     *      <td><kbd>Esc</kbd></td>
     *      <td>Close the drawer</td>
     *    </tr>
     *  </tbody>
     * </table>
     *
     *  <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     *  </h3>
     *
     * <h4> role </h4>
     * <p>By default, the 'dialog' role will be set to Drawer Popup.
     * The dialog role is used to mark up an application window that separates content from the rest of the page.
     * This can be changed using custom role attribute.</p>
     *
     * <p>However, adding <code class="prettyprint">role="dialog"</code> alone is not sufficient to make a drawer accessible.
     * It must be properly labeled. It is developer’s responsibility to define respective aria properties to meet accessibility requirements.</p>
     *
     * <h4>aria-labelledby </h4>
     * If a drawer already has a visible title bar, the text inside that bar can be used to label the dialog itself.
     * Set the value of the <code class="prettyprint">aria-labelledby</code> attribute to be the id of the element used to title the drawer.
     * If there isn't appropriate text visible in the DOM that could be referenced with <code class="prettyprint">aria-labelledby</code>
     * use the <code class="prettyprint">aria-label</code> attribute to define the accessible name of an element.
     *
     * <h4> aria-describedby </h4>
     * If the drawer contains additional descriptive text besides the drawer title,
     * this text can be associated with the drawer using the <code class="prettyprint">aria-describedby</code> attribute.
     *
     * <h3 id="sizing">
     *   Sizing
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sizing"></a>
     * </h3>
     *
     * <p>Side drawers always stretch to viewport's height and the bottom one to its width.
     * The other axis dimension is not predefined. This dimension's size is determined by its content.
     * If you want to set a custom size you can use units like px, rem, etc.
     * However because there is no fixed-size parent percentages (%) won’t work,
     * but you can use vw (viewport width) or vh (viewport height) units to achieve a similar effect.</p>
     * <ul>
     *   <li>Note the built-in minimal and maximal width of side drawers.</li>
     *   <li>Note that DrawerPopup animates opening and closing. However, it is app developer's responsibility to add animations for custom runtime changes to a drawer size. See the 'Sizing' cookbook demo for an example.</li>
     * </ul>
     *
     * @ojmetadata description 'A Drawer Popup is a panel that slides into the viewport.'
     * @ojmetadata displayName "Drawer Popup"
     * @ojmetadata main "ojs/ojdrawerpopup"
     * @ojmetadata status [
     *   {
     *     "type": "maintenance",
     *     "since": "17.0.0",
     *     "value": ["oj-c-drawer-popup"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "oracle": {
     *     "icon": "oj-ux-ico-drawer-popup",
     *     "uxSpecs": ["drawer-popup"]
     *   },
     *   "themes": {
     *     "unsupportedThemes": [
     *       "Alta"
     *     ]
     *   },
     *   "vbdt": {
     *     "module": "ojs/ojdrawerpopup"
     *   }
     * }
     * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojDrawerPopup.html"
     * @ojmetadata since "11.0.0"
     */
    exports.DrawerPopup = DrawerPopup_1 = class DrawerPopup extends preact.Component {
        constructor() {
            super(...arguments);
            this.state = {
                opened: this.props.opened,
                viewportResolvedDisplayMode: this.getViewportResolvedDisplayMode(),
                viewportResolvedDisplayModeVertical: this.getViewportResolvedDisplayModeVertical()
            };
            this.rootRef = preact.createRef();
            this.windowResizeHandler = null;
            // Flag to ignore updates on a destroyed drawer instance after popup removal
            this.ignoreUpdate = false;
            this.handleGuardFocus = (guardPosition, event) => {
                // Drawer handles focus only in modal cases
                // In modeless, regarding focus, we do nothing
                if (this.props.modality === 'modal') {
                    // Analyze focusables - lenght, first item, last item
                    const focusables = ojdrawerutils.DrawerUtils.getFocusables(this.rootRef.current);
                    const { length, 0: firstFocusableItem, [length - 1]: lastFocusableItem } = focusables;
                    event.preventDefault();
                    // If no focusables present, focus the Drawer panel
                    if (!length) {
                        this.rootRef.current.focus();
                        return;
                    }
                    if (guardPosition === 'start') {
                        // Loop from end
                        lastFocusableItem.focus();
                    }
                    else {
                        // Loop from start
                        firstFocusableItem.focus();
                    }
                }
            };
            this.handleOnStartGuardFocus = (event) => {
                this.handleGuardFocus('start', event);
            };
            this.handleOnEndGuardFocus = (event) => {
                this.handleGuardFocus('end', event);
            };
            this.handleKeyDown = (event) => {
                // JET-62891: do nothing if the key has already been handled
                if (event.defaultPrevented) {
                    return;
                }
                if (event.key === ojdrawerutils.DrawerConstants.keys.ESC) {
                    this.selfClose();
                    return;
                }
            };
            this.autoDismissHandler = (event) => {
                const focusables = ojdrawerutils.DrawerUtils.getFocusables(this.rootRef.current);
                // Popup Service root layer
                const zorderLayer = this.rootRef.current.parentNode;
                const zorderLayerParent = zorderLayer.parentElement;
                const isTargetWithin = this.isTargetDescendantOfOwnZorderLayerOrItsNextSiblings(zorderLayer, event.target);
                const isTargetWithinLayerParent = zorderLayerParent.contains(event.target);
                const isTargetWithinLauncher = this.drawerOpener !== document.body && this.drawerOpener.contains(event.target);
                if (this.props.autoDismiss === 'focus-loss') {
                    if (this.props.modality === 'modal' && !isTargetWithinLayerParent) {
                        // JET-66608: Drawer is modal and the target is outside of the modal container -> ignore
                        return;
                    }
                    else if (!(isTargetWithin || isTargetWithinLauncher)) {
                        // Close the Drawer with click/touch out of the Drawer or other elements created by the PopupService
                        // unless the click occurs on the launcher (JET-61339)
                        this.selfClose();
                    }
                }
                else if (this.props.autoDismiss === 'none' &&
                    this.props.modality === 'modal' &&
                    !isTargetWithin) {
                    // If autodismiss is disabled we do not allow to focus the scrim layer.
                    // The reason is that if the scrim layer receives the focus, closing with ESC does not work.
                    // That's because the keydown listener is registered on the Drawer element, a sibling to the scrim layer.
                    // "<Root onKeyDown={this.handleKeyDown} ... ></Root>"
                    event.preventDefault();
                }
            };
            this.refreshHandler = (edge) => {
                // Trigger refresh of descendants (popups opened from the drawer)
                ojpopupcore.PopupService.getInstance().triggerOnDescendents($(this.rootRef.current), ojpopupcore.PopupService.EVENT.POPUP_REFRESH);
            };
            this.destroyHandler = () => {
                const $drawerElement = $(this.rootRef.current);
                const status = ojpopupcore.ZOrderUtils.getStatus($drawerElement);
                if (status === ojpopupcore.ZOrderUtils.STATUS.OPEN) {
                    ojcustomelementUtils.CustomElementUtils.cleanComponentBindings($drawerElement[0]);
                    $drawerElement.remove();
                    const psOptions = {};
                    psOptions[ojpopupcore.PopupService.OPTION.POPUP] = $drawerElement;
                    // close without animating and invalidate this drawer instance
                    this.ignoreUpdate = true;
                    ojpopupcore.PopupService.getInstance().close(psOptions);
                }
            };
            this.isTargetDescendantOfOwnZorderLayerOrItsNextSiblings = (zorderLayer, target) => {
                const zorderLayersBuffer = [zorderLayer];
                let nextZorderLayer = zorderLayer.nextSibling;
                while (nextZorderLayer) {
                    zorderLayersBuffer.push(nextZorderLayer);
                    nextZorderLayer = nextZorderLayer.nextSibling;
                }
                return zorderLayersBuffer.some((zorderLayerItem) => {
                    return zorderLayerItem.contains(target);
                });
            };
            this.windowResizeCallback = () => {
                // In <oj-drawer-layout> we need to close and open to switch between display mode
                // because 'overlay' vs. 'reflow' differs not only in styling, but also in how
                // DOM is structured (Popup layer vs. flex layout).
                //
                // We do not need to do the same here in <oj-drawer-popup>
                // because 'overlay' and 'full-overlay' differ only in one css style (width: 100%)
                //
                // For the same reason we do not need a resize lock that we use in DrawerLayout
                // because there's no delay (animation duration) when display mode change is applied
                const updatedState = {};
                const prevViewportResolvedDisplayMode = this.state.viewportResolvedDisplayMode;
                const nextViewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                if (prevViewportResolvedDisplayMode !== nextViewportResolvedDisplayMode) {
                    updatedState['viewportResolvedDisplayMode'] = nextViewportResolvedDisplayMode;
                }
                const prevViewportResolvedDisplayModeVertical = this.state.viewportResolvedDisplayModeVertical;
                const nextViewportResolvedDisplayModeVertical = this.getViewportResolvedDisplayModeVertical();
                if (prevViewportResolvedDisplayModeVertical !== nextViewportResolvedDisplayModeVertical) {
                    updatedState['viewportResolvedDisplayModeVertical'] = nextViewportResolvedDisplayModeVertical;
                }
                // If drawer got open in full-width mode, scrolling is disabled on body until drawer closes.
                // If viewport is made wider, modeless drawer can transform to non-full-width mode and
                // should allow scrolling on body.
                if (this.isDrawerOpened() &&
                    prevViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay &&
                    nextViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringOverlay) {
                    if (this.isIOSspecificScrollCase()) {
                        // Removing modal and its ability to block body scroll on IOS
                        this.applyPopupServiceModalChanges('modeless');
                    }
                    else if (this.isAndroidSpecificScrollCase()) {
                        ojdrawerutils.DrawerUtils.enableBodyOverflow();
                    }
                }
                // Vice-versa (see above)
                if (this.isDrawerOpened() &&
                    prevViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringOverlay &&
                    nextViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                    if (this.isIOSspecificScrollCase()) {
                        // Blocking body scroll on IOS is tricky
                        // That's why we are reusing modal layer ability to do that under certain conditions
                        this.applyPopupServiceModalChanges('modal');
                    }
                    else if (this.isAndroidSpecificScrollCase()) {
                        ojdrawerutils.DrawerUtils.disableBodyOverflow();
                    }
                }
                if (Object.keys(updatedState).length > 0) {
                    this.setState(updatedState);
                }
            };
            this.handleSwipeAction = () => {
                this.selfClose();
            };
        }
        static getDerivedStateFromProps(props, state) {
            // Our 'opened' prop is mutable
            // https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
            // This method exists for rare use cases where the state depends on changes in props over time.
            if (props.opened !== state.opened) {
                return { opened: props.opened };
            }
            return null;
        }
        render(props) {
            if (!this.ignoreUpdate && (this.isDrawerOpened() || this.wasDrawerOpenedInPrevState())) {
                return (jsxRuntime.jsx(ojvcomponent.Root, { ref: this.rootRef, class: this.getPopupStyleClasses(this.props.edge), tabIndex: -1, role: this.props.role || 'dialog', onKeyDown: this.handleKeyDown, children: jsxRuntime.jsxs("div", { class: "oj-drawer-full-height", children: [jsxRuntime.jsx("div", { class: "oj-drawer-focus-guard", onFocus: this.handleOnStartGuardFocus, tabIndex: 0 }), props.children, jsxRuntime.jsx("div", { class: "oj-drawer-focus-guard", onFocus: this.handleOnEndGuardFocus, tabIndex: 0 })] }) }));
            }
            return jsxRuntime.jsx(ojvcomponent.Root, {});
        }
        // Value of the 'opened' property
        isDrawerOpened() {
            return this.state[ojdrawerutils.DrawerConstants.stringOpened];
        }
        // Previous value of the 'opened' property
        wasDrawerOpenedInPrevState() {
            return this.openedPrevState;
        }
        async selfClose() {
            try {
                // Cancelable ojBeforeClose event
                await this.props.onOjBeforeClose?.();
            }
            catch (_) {
                // Closing was canceled so short circuit out here
                return;
            }
            // Trigger a writeback event to inform ancestors about internal change of the state
            this.props.onOpenedChanged?.(false);
        }
        // Render a single drawer using Popup Service
        openOrCloseDrawer(prevState) {
            // Save previous state of the 'opened' property
            // Previous state is not available in render() function
            if (this.isDrawerOpened() != prevState.opened) {
                this.openedPrevState = this.isDrawerOpened();
            }
            const $drawerElement = $(this.rootRef.current);
            const popupServiceInstance = ojpopupcore.PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(prevState);
            if (this.isDrawerOpened()) {
                // Open
                // Even the PopupService ignores any calls before the previous one has finished,
                // we can limit these calls here
                if ([ojpopupcore.ZOrderUtils.STATUS.CLOSE, ojpopupcore.ZOrderUtils.STATUS.UNKNOWN].indexOf(ojpopupcore.ZOrderUtils.getStatus($drawerElement) > -1)) {
                    popupServiceInstance.open(popupServiceOptions);
                }
            }
            else {
                // Close
                // Even the PopupService ignores any calls before the previous one has finished,
                // we can limit these calls here
                if (ojpopupcore.ZOrderUtils.getStatus($drawerElement) === ojpopupcore.ZOrderUtils.STATUS.OPEN) {
                    // Remove modal layer that was used to block scrolls on IOS
                    if (this.isIOSspecificScrollCase() &&
                        this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                        this.applyPopupServiceModalChanges('modeless');
                    }
                    popupServiceInstance.close(popupServiceOptions);
                }
            }
        }
        getPopupServiceOptions(prevState) {
            const edge = this.props.edge;
            const $drawerElement = $(this.rootRef.current);
            // PopupService
            const PSOptions = {};
            const PSoption = ojpopupcore.PopupService.OPTION;
            PSOptions[PSoption.POPUP] = $drawerElement;
            PSOptions[PSoption.LAUNCHER] = $(document.activeElement);
            PSOptions[PSoption.MODALITY] = this.props.modality;
            PSOptions[PSoption.LAYER_SELECTORS] = this.getDrawerSurrogateLayerSelectors();
            PSOptions[PSoption.LAYER_LEVEL] = ojpopupcore.PopupService.LAYER_LEVEL.TOP_LEVEL;
            // Positioning is maintained by Drawer itself (fixed position)
            // Setting 'null' as Position option makes PopupService not handling it
            PSOptions[PSoption.POSITION] = null;
            PSOptions[PSoption.CUSTOM_ELEMENT] = true;
            const PSEvent = ojpopupcore.PopupService.EVENT;
            PSOptions[PSoption.EVENTS] = {
                [PSEvent.POPUP_BEFORE_OPEN]: () => this.beforeOpenHandler(edge, PSOptions),
                [PSEvent.POPUP_AFTER_OPEN]: () => this.afterOpenHandler(edge, prevState),
                [PSEvent.POPUP_BEFORE_CLOSE]: () => this.beforeCloseHandler(edge),
                [PSEvent.POPUP_AFTER_CLOSE]: () => this.afterCloseHandler(prevState),
                [PSEvent.POPUP_AUTODISMISS]: (event) => this.autoDismissHandler(event),
                [PSEvent.POPUP_REFRESH]: () => this.refreshHandler(edge),
                [PSEvent.POPUP_REMOVE]: () => this.destroyHandler()
            };
            return PSOptions;
        }
        beforeOpenHandler(edge, PSOptions) {
            // Disable body overflow during animation so that gaps for scrollbars do not appear
            ojdrawerutils.DrawerUtils.disableBodyOverflow();
            // Remember element to return focus to
            this.drawerOpener = document.activeElement;
            // Remove display: none
            PSOptions[ojpopupcore.PopupService.OPTION.POPUP].show();
            const busyContext = Context.getContext(this.rootRef.current).getBusyContext();
            const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
            const animationPromise = AnimationUtils.slideIn(this.rootRef.current, ojdrawerutils.DrawerUtils.getAnimationOptions(ojdrawerutils.DrawerConstants.stringSlideIn, edge));
            animationPromise.then(resolveFunc);
            return animationPromise;
        }
        afterOpenHandler(edge, prevState) {
            // Enable body overflow disabled in 'beforeOpen'
            ojdrawerutils.DrawerUtils.enableBodyOverflow();
            // Blocking body scroll on IOS is tricky
            // That's why we are reusing modal layer ability to do that under certain conditions
            if (this.isIOSspecificScrollCase() &&
                this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                this.applyPopupServiceModalChanges('modal');
            }
            // Android allows body scroll over 'fixed' positioned layer
            // That's why we are keeping scrolling of the body disabled under certain conditions
            if (this.isAndroidSpecificScrollCase() &&
                this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                ojdrawerutils.DrawerUtils.disableBodyOverflow();
            }
            this.handleFocus(prevState);
            const $drawerElement = $(this.rootRef.current);
            const status = ojpopupcore.ZOrderUtils.getStatus($drawerElement);
            // If the opened property was set to false during the opening animation we will close the drawer
            if (status === ojpopupcore.ZOrderUtils.STATUS.OPEN && !this.isDrawerOpened()) {
                const popupServiceInstance = ojpopupcore.PopupService.getInstance();
                const popupServiceOptions = this.getPopupServiceOptions(prevState);
                popupServiceInstance.close(popupServiceOptions);
            }
        }
        handleFocus(prevState) {
            if (this.state.opened && prevState.opened !== this.state.opened) {
                // Set focus to the first match:
                // 1. First element inside the drawer matching [autofocus]
                // 2. Tabbable element inside the content element
                // 3. The drawer itself
                // 4. Client executes its default focus() implementation
                //    e.g. Chrome focuses the last known focusable element.
                const rootRef = this.rootRef.current;
                const autofocusItems = ojdrawerutils.DrawerUtils.getAutofocusFocusables(rootRef);
                const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
                if (autofocusLength > 0) {
                    autofocusFirstItem.focus({ preventScroll: true });
                    return;
                }
                const focusables = ojdrawerutils.DrawerUtils.getFocusables(rootRef);
                let elementToFocus = rootRef;
                if (focusables.length) {
                    // Focus the first focusable element
                    elementToFocus = focusables[0];
                }
                elementToFocus.focus({ preventScroll: true });
            }
        }
        beforeCloseHandler(edge) {
            // Disable body overflow during animation so that gaps for scrollbars do not appear
            ojdrawerutils.DrawerUtils.disableBodyOverflow();
            // Remember element that had focus when closing initiated
            this.elementWithFocusBeforeDrawerCloses = document.activeElement;
            // skip animation if closing on popup removal
            if (this.ignoreUpdate) {
                return null;
            }
            const busyContext = Context.getContext(this.rootRef.current).getBusyContext();
            const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
            const animationPromise = AnimationUtils.slideOut(this.rootRef.current, ojdrawerutils.DrawerUtils.getAnimationOptions(ojdrawerutils.DrawerConstants.stringSlideOut, edge));
            return animationPromise.then(resolveFunc);
        }
        afterCloseHandler(prevState) {
            // Enable body overflow disabled in 'beforeOpen'
            ojdrawerutils.DrawerUtils.enableBodyOverflow();
            // Return the focus to the drawer's launcher only if the focus
            // is currently living within a drawer.
            // As we do not apply focus-trap in modeless mode, user is able to
            // get the focus out of the drawer. In this case we do not want to handle it.
            if (this.rootRef.current.contains(this.elementWithFocusBeforeDrawerCloses)) {
                ojdrawerutils.DrawerUtils.moveFocusToElementOrNearestAncestor(this.drawerOpener);
            }
            // skip re-render if closing on popup removal
            if (this.ignoreUpdate) {
                return;
            }
            const $drawerElement = $(this.rootRef.current);
            const status = ojpopupcore.ZOrderUtils.getStatus($drawerElement);
            if (status === ojpopupcore.ZOrderUtils.STATUS.CLOSE && this.isDrawerOpened()) {
                // If the opened property was set to true during the closing animation we will re-open the drawer
                const popupServiceInstance = ojpopupcore.PopupService.getInstance();
                const popupServiceOptions = this.getPopupServiceOptions(prevState);
                popupServiceInstance.open(popupServiceOptions);
            }
            else if (!this.wasDrawerOpenedInPrevState()) {
                // Force update to 'park' the node to the hidden div at the end of the DOM
                // (conditional rendering mechanism)
                // JET-60536 - wrapping with queueMicrotask
                window.queueMicrotask(() => {
                    this.forceUpdate();
                });
            }
            // fire the 'close' event
            this.props.onOjClose?.();
        }
        getDrawerSurrogateLayerSelectors() {
            let surrogateLayerStyles = ojdrawerutils.DrawerConstants.DrawerPopupStyleSurrogate;
            const stringModal = 'modal';
            if (this.props.modality === stringModal) {
                surrogateLayerStyles += ` ${ojdrawerutils.DrawerConstants.stringOjDrawer}${ojdrawerutils.DrawerConstants.charDash}${stringModal}`;
            }
            return surrogateLayerStyles;
        }
        getPopupStyleClasses(edge) {
            const customStyleClassMap = {};
            if (edge === ojdrawerutils.DrawerConstants.stringBottom) {
                if (this.getViewportResolvedDisplayModeVertical() === ojdrawerutils.DrawerConstants.stringFullOverlay ||
                    this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                    customStyleClassMap[ojdrawerutils.DrawerConstants.styleDisplayMode(ojdrawerutils.DrawerConstants.stringFullOverlay)] =
                        true;
                }
            }
            else {
                if (this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                    customStyleClassMap[ojdrawerutils.DrawerConstants.styleDisplayMode(ojdrawerutils.DrawerConstants.stringFullOverlay)] =
                        true;
                }
            }
            return ojdrawerutils.DrawerUtils.getStyleClassesMapAsString(Object.assign(customStyleClassMap, ojdrawerutils.DrawerUtils.getCommonStyleClasses(edge)));
        }
        componentDidUpdate(prevProps, prevState) {
            if (!this.ignoreUpdate) {
                this.handleComponentUpdate(prevState);
            }
        }
        componentDidMount() {
            // Register window resize observer
            if (this.windowResizeHandler === null) {
                this.windowResizeHandler = this.windowResizeCallback.bind(this);
            }
            // Note: Can not use DomUtils.addEventListner as it can not handle 'window'
            window.addEventListener(ojdrawerutils.DrawerConstants.stringResize, this.windowResizeHandler);
            // Save PrevState on init
            this.openedPrevState = this.props.opened;
            // componentDidUpdate() is not triggered if the initial value of 'opened'
            // differs from defaultProps 'false' value.
            // Case: User opens drawer immediately on init: <oj-drawer-popup opened="true">...
            if (DrawerPopup_1.defaultProps.opened != this.props.opened) {
                // Create artificial 'prevState' (on first render there's no previous state) needed when
                // handleComponentUpdate() is called from componentDidUpdate() on second and every other render
                const stateCopy = Object.assign({}, this.state);
                stateCopy.opened = false;
                this.handleComponentUpdate(stateCopy);
            }
        }
        componentWillUnmount() {
            window.removeEventListener(ojdrawerutils.DrawerConstants.stringResize, this.windowResizeHandler);
            this.windowResizeHandler = null;
        }
        getViewportResolvedDisplayMode() {
            const viewportWidth = ojdrawerutils.DrawerUtils.getViewportWidth();
            if (viewportWidth >= ojdrawerutils.DrawerConstants.fullWidthDrawerChangeThreshold) {
                return ojdrawerutils.DrawerConstants.stringOverlay;
            }
            return ojdrawerutils.DrawerConstants.stringFullOverlay;
        }
        getViewportResolvedDisplayModeVertical() {
            const viewportHeight = ojdrawerutils.DrawerUtils.getViewportHeight();
            if (viewportHeight >= ojdrawerutils.DrawerConstants.fullHeightDrawerChangeThreshold) {
                return ojdrawerutils.DrawerConstants.stringOverlay;
            }
            return ojdrawerutils.DrawerConstants.stringFullOverlay;
        }
        handleComponentUpdate(prevState) {
            this.openOrCloseDrawer(prevState);
            // Swipe listeners un/register
            if (this.isDrawerOpened() && this.props.closeGesture === 'swipe') {
                this.registerCloseWithSwipeListener();
            }
            if (this.isDrawerOpened() === false && prevState.opened) {
                this.unregisterCloseWithSwipeListener();
            }
        }
        registerCloseWithSwipeListener() {
            // @ts-ignore
            this.hammerInstance = new Hammer(targetElement);
            if (this.props.edge === ojdrawerutils.DrawerConstants.stringBottom) {
                // Swipe down needs to be purposely activated as it might be in conflict with page scroll.
                this.hammerInstance.get('swipe').set({ direction: Hammer.DIRECTION_DOWN });
            }
            this.hammerInstance.on(this.getSwipeCloseDirection(this.props.edge), this.handleSwipeAction);
        }
        getSwipeCloseDirection(edge) {
            const swipeLeft = 'swipeleft';
            const swipeRigth = 'swiperight';
            switch (edge) {
                case ojdrawerutils.DrawerConstants.stringStart: {
                    return ojdrawerutils.DrawerUtils.isRTL() ? swipeRigth : swipeLeft;
                }
                case ojdrawerutils.DrawerConstants.stringEnd: {
                    return ojdrawerutils.DrawerUtils.isRTL() ? swipeLeft : swipeRigth;
                }
                case ojdrawerutils.DrawerConstants.stringBottom: {
                    return 'swipedown';
                }
            }
        }
        unregisterCloseWithSwipeListener() {
            if (this.hammerInstance) {
                this.hammerInstance.off(this.getSwipeCloseDirection(this.props.edge), this.handleSwipeAction);
                this.hammerInstance.destroy();
                this.hammerInstance = null;
            }
        }
        // Blocking body scroll on IOS is tricky
        // Modal layer allows it and this ability is reused here.
        // If drawer is modeless and full-width, we are adding modal layer under it after drawer gets open
        // and removing it before it gets closed. That makes it unvisible for a user.
        isIOSspecificScrollCase() {
            return (oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS && this.props.modality === 'modeless');
        }
        isAndroidSpecificScrollCase() {
            return (oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.ANDROID &&
                this.props.modality === 'modeless');
        }
        applyPopupServiceModalChanges(modalValue) {
            // Modal has built-in ability to disable scroll on body
            // PopupService allows to change modality on already opened popup
            const PSOptions = {};
            const PSoption = ojpopupcore.PopupService.OPTION;
            PSOptions[PSoption.POPUP] = $(this.rootRef.current);
            PSOptions[PSoption.MODALITY] = modalValue;
            ojpopupcore.PopupService.getInstance().changeOptions(PSOptions);
        }
    };
    exports.DrawerPopup.defaultProps = {
        autoDismiss: 'focus-loss',
        edge: 'start',
        modality: 'modal',
        opened: false,
        closeGesture: 'swipe'
    };
    exports.DrawerPopup._metadata = { "slots": { "": {} }, "properties": { "opened": { "type": "boolean", "writeback": true }, "edge": { "type": "string", "enumValues": ["end", "start", "bottom"] }, "modality": { "type": "string", "enumValues": ["modal", "modeless"] }, "autoDismiss": { "type": "string", "enumValues": ["none", "focus-loss"] }, "closeGesture": { "type": "string", "enumValues": ["none", "swipe"] } }, "events": { "ojBeforeClose": { "cancelable": true }, "ojClose": {} }, "extension": { "_WRITEBACK_PROPS": ["opened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["role"] } };
    exports.DrawerPopup = DrawerPopup_1 = __decorate([
        ojvcomponent.customElement('oj-drawer-popup')
    ], exports.DrawerPopup);

    Object.defineProperty(exports, '__esModule', { value: true });

});
