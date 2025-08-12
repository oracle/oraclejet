/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'preact', 'jquery', 'ojs/ojanimation', 'ojs/ojdomutils', 'ojs/ojcore-base', 'ojs/ojpopup', 'ojs/ojpopupcore', 'ojs/ojdrawerutils', 'ojs/ojcontext'], function (exports, jsxRuntime, ojvcomponent, preact, $, AnimationUtils, DomUtils, ojcoreBase, ojpopup, ojpopupcore, ojdrawerutils, Context) { 'use strict';

    $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var DrawerLayout_1;
    /**
     * @classdesc
     * <h3 id="drawerLayoutOverview-section">
     *   JET Drawer Layout
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#drawerLayoutOverview-section"></a>
     * </h3>
     * <p>Description: A drawer layout can be used for managing content with one or more drawers. A drawer is a panel that can
     * slide from the layout edges into it. Depending on the drawer layout size and configuration, the main content can be re-arranged
     * (reflow mode) or overlaid when the drawer is opened.</p>
     * <pre class="prettyprint">
     * <code>
     *&lt;oj-drawer-layout end-opened="true">
     *
     *    &lt;div slot="start">Start drawer content &lt;/div>
     *    &lt;div slot="end">End drawer content &lt;/div>
     *
     *    Main section content
     *
     * &lt;/oj-drawer-layout>
     *</code></pre>
     *
     * <p id="drawer-layout-popup-section">JET DrawerLayout and DrawerPopup look similar, but are intended to be used
     * for different purposes.</p>
     * <p>Use DrawerLayout when you need to switch from 'reflow' display mode (big screens) to 'overlay' (small screens).</p>
     * <p>Use DrawerPopup when you need to always show 'overlay' drawers.</p>
     *
     * <h3 id="migration-section">
     *   Migration
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
     * </h3>
     *  To migrate from oj-drawer-layout to oj-c-drawer-layout, you need to revise the import statement and references to oj-c-drawer-layout in your app.
     *
     * <h3 id="sizing">
     *   Drawer sizing
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sizing"></a>
     * </h3>
     * Side drawers stretch to Drawer Layout container's height and the bottom one to its width. The
     * other axis dimension is not predefined. This dimension's size is determined by its content.
     * If you want to set a custom size, you need to specify it using absolute units (px, rem, etc.).
     * Relative unit size (%) will not work, because there is no fixed-size parent.
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
     * <h3 id="a11y-section">
     *  Accessibility
     *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * It is developer’s responsibility to define respective aria properties to meet accessibility requirements.
     * Use <code class="prettyprint">aria-labelledby</code>, <code class="prettyprint">aria-describedby</code> or <code class="prettyprint">aria-label</code> attributes
     * on drawer elements (slots of the Drawer Layout) to make them accessible.
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
     * <h3 id="rtl-section">
     *   Reading direction
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
     * </h3>
     *
     * <h3 id="sizing">
     *   Sizing
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sizing"></a>
     * </h3>
     *
     * <p>Side drawers stretch to Drawer Layout container's height and the bottom one to its width.
     * The other axis dimension is not predefined. This dimension's size is determined by its content.
     * If you want to set a custom size you can use units like px, rem, etc.
     * However because there is no fixed-size parent percentages (%) won’t work,
     * but you can use vw (viewport width) or vh (viewport height) units to achieve a similar effect.</p>
     * <ul>
     *   <li>Note the side drawer's built-in minimal width limit in the 'Overlay' mode.</li>
     *   <li>Note that DrawerLayout animates opening and closing. However, it is app developer's responsibility to add animations for custom runtime changes to a drawer size. See the 'Sizing' cookbook demo for an example.</li>
     * </ul>
     *
     * <p> Setting the reading direction (LTR or RTL) is supported by setting the <code class="prettyprint">"dir"</code> attribute on the
     * <code class="prettyprint">&lt;html></code> element of the page. As with any JET component, in the unusual case that the reading direction
     * is changed post-init, the page must be reloaded.
     *
     * @ojmetadata description "A Drawer Layout adds expandable side contents (drawers) alongside some primary content."
     * @ojmetadata displayName "Drawer Layout"
     * @ojmetadata main "ojs/ojdrawerlayout"
     * @ojmetadata status [
     *   {
     *     "type": "maintenance",
     *     "since": "17.0.0",
     *     "value": ["oj-c-drawer-layout"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "oracle": {
     *     "icon": "oj-ux-ico-drawer",
     *     "uxSpecs": ["drawer-layout"]
     *   },
     *   "themes": {
     *     "unsupportedThemes": [
     *       "Alta"
     *     ]
     *   },
     *   "vbdt": {
     *     "module": "ojs/ojdrawerlayout"
     *   }
     * }
     * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojDrawerLayout.html"
     * @ojmetadata since "11.0.0"
     */
    exports.DrawerLayout = DrawerLayout_1 = class DrawerLayout extends preact.Component {
        constructor() {
            super(...arguments);
            this.rootRef = preact.createRef();
            this.startWrapperRef = preact.createRef();
            this.startRef = preact.createRef();
            this.endWrapperRef = preact.createRef();
            this.endRef = preact.createRef();
            this.bottomWrapperRef = preact.createRef();
            this.bottomRef = preact.createRef();
            this.middleSectionRef = preact.createRef();
            this.mainSectionRef = preact.createRef();
            this.startClosedWithEsc = false;
            this.endClosedWithEsc = false;
            this.bottomClosedWithEsc = false;
            this.startOverlayDrawerResizeHandler = null;
            this.endOverlayDrawerResizeHandler = null;
            this.bottomOverlayDrawerResizeHandler = null;
            this.startReflowDrawerResizeHandler = null;
            this.endReflowDrawerResizeHandler = null;
            this.drawerLayoutResizeHandler = null;
            this.windowResizeHandler = null;
            // Resize handler lock
            this.handleResize = true;
            this.state = {
                startOpened: this.props.startOpened,
                endOpened: this.props.endOpened,
                bottomOpened: this.props.bottomOpened,
                startDisplay: this.props.startDisplay,
                endDisplay: this.props.endDisplay,
                bottomDisplay: this.props.bottomDisplay,
                startShouldChangeDisplayMode: false,
                endShouldChangeDisplayMode: false,
                bottomShouldChangeDisplayMode: false,
                startStateToChangeTo: null,
                endStateToChangeTo: null,
                bottomStateToChangeTo: null,
                viewportResolvedDisplayMode: this.getViewportResolvedDisplayMode(),
                viewportResolvedDisplayModeVertical: this.getViewportResolvedDisplayModeVertical(),
                lastlyOpenedDrawer: ojdrawerutils.DrawerConstants.stringStart
            };
            this.handleKeyDown = (edge, event) => {
                // JET-62891: do nothing if the key has already been handled
                if (event.defaultPrevented) {
                    return;
                }
                const drawerDisplayMode = this.getDrawerResolvedDisplayMode(edge);
                if (event.key === ojdrawerutils.DrawerConstants.keys.ESC &&
                    (drawerDisplayMode === ojdrawerutils.DrawerConstants.stringOverlay ||
                        drawerDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay)) {
                    this[this.edgeToClosedWithEsc(edge)] = true;
                    this.selfClose(edge);
                }
            };
            this.getRefToAnimate = (edge) => {
                // In case we are animating in 'reflow' mode, we animate the wrapper
                // In case we are animating in 'overlay' mode, we animate inner wrapper content (due to reconciliation issue)
                return this.getDrawerResolvedDisplayMode(edge) === ojdrawerutils.DrawerConstants.stringReflow
                    ? this.getDrawerWrapperRef(edge)
                    : this.getDrawerRef(edge);
            };
            this.overlayDrawerResizeCallback = (edge) => {
                const $drawerElement = $(this.getDrawerRef(edge).current);
                // @ts-ignore
                $drawerElement.position(this.getDrawerPosition(edge));
            };
            this.reflowDrawerResizeCallback = () => {
                // If a reflow side drawer (start/end) changes size, adjust bottom overlay drawer size to fit
                // Note that the function below checks that 'overlay' condition is fulfilled
                this.setBottomOverlayDrawerWidth();
            };
            this.drawerLayoutResizeCallback = () => {
                // If the DrawerLayout (page content) changes size,
                // adjust OVERLAY side drawers (start/end) height to fit the drawer
                // Note that these two functions checks that 'overlay' condition is fulfilled
                this.setStartEndOverlayDrawersHeight();
                this.setBottomOverlayDrawerWidth();
            };
            this.lockResizeListener = () => {
                if (this.handleResize) {
                    this.handleResize = false;
                    setTimeout(() => {
                        // Release lock
                        this.handleResize = true;
                        // Resize handling is locked during closing animation.
                        // Check if the user resized viewport and crossed the size breakpoint during opening animation.
                        const updatedState = {};
                        if (this.state.viewportResolvedDisplayMode !== this.getViewportResolvedDisplayMode()) {
                            const edges = [ojdrawerutils.DrawerConstants.stringStart, ojdrawerutils.DrawerConstants.stringEnd];
                            for (let i = 0; i < edges.length; i++) {
                                const edge = edges[i];
                                if (this.isDrawerOpened(edge) && this.state[this.edgeToDisplayName(edge)] === 'auto') {
                                    updatedState[this.edgeToShouldChangeDisplayMode(edge)] = true;
                                }
                            }
                        }
                        // Redundant. See notes above.
                        // Not removing as this is legacy code.
                        if (this.state.viewportResolvedDisplayModeVertical !==
                            this.getViewportResolvedDisplayModeVertical()) {
                            if (this.isDrawerOpened(ojdrawerutils.DrawerConstants.stringBottom) &&
                                this.state[this.edgeToDisplayName(ojdrawerutils.DrawerConstants.stringBottom)] === 'auto') {
                                updatedState[this.edgeToShouldChangeDisplayMode(ojdrawerutils.DrawerConstants.stringBottom)] = true;
                            }
                        }
                        if (Object.keys(updatedState).length > 0) {
                            this.setState(updatedState);
                        }
                        else {
                            // If there's no need closing a drawer, store the new display mode value
                            updatedState.viewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                            this.setState(updatedState);
                        }
                    }, ojdrawerutils.DrawerConstants.animationDuration + 50);
                }
            };
            this.refreshHandler = (edge) => {
                const $drawerElement = $(this.getDrawerRef(edge).current);
                // @ts-ignore
                $drawerElement.position(this.getDrawerPosition(edge));
                if ([ojdrawerutils.DrawerConstants.stringStart, ojdrawerutils.DrawerConstants.stringEnd].indexOf(edge) > -1) {
                    this.setStartEndOverlayDrawersHeight();
                }
                this.setBottomOverlayDrawerWidth();
                // Trigger refresh of descendants (popups opened from the drawer)
                ojpopupcore.PopupService.getInstance().triggerOnDescendents($drawerElement, ojpopupcore.PopupService.EVENT.POPUP_REFRESH);
            };
            this.destroyHandler = (edge) => {
                const $drawerElement = $(this.getDrawerRef(edge).current);
                const status = ojpopupcore.ZOrderUtils.getStatus($drawerElement);
                if (status === ojpopupcore.ZOrderUtils.STATUS.OPEN) {
                    ojpopupcore.ZOrderUtils.removeFromAncestorLayer($drawerElement);
                }
            };
            this.windowResizeCallback = () => {
                if (this.handleResize) {
                    // Returns saved display mode (state)
                    const prevViewportResolvedDisplayMode = this.state.viewportResolvedDisplayMode;
                    // Returns current (not saved!) display mode.
                    const nextViewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                    // Redundant. Final UX+Spectra agreement was to allow 100vh
                    // of the bottom drawer for any screen size. See css rules.
                    // Not removing as this is legacy code.
                    const prevViewportResolvedDisplayModeVertical = this.state.viewportResolvedDisplayModeVertical;
                    const nextViewportResolvedDisplayModeVertical = this.getViewportResolvedDisplayModeVertical();
                    // If bottom is opened, always adjust width
                    // Bottom drawer should adjust even to a pixel change
                    this.setBottomOverlayDrawerWidth();
                    let atLeastOneOverlayDrawerNeedsToClose = false;
                    const updatedState = {};
                    // Redundant. See notes above.
                    // Not removing as this is legacy code.
                    const checkBottomDrawerDisplayModeChange = () => {
                        if (this.isDrawerOpened(ojdrawerutils.DrawerConstants.stringBottom) &&
                            this.state[this.edgeToDisplayName(ojdrawerutils.DrawerConstants.stringBottom)] === 'auto') {
                            atLeastOneOverlayDrawerNeedsToClose = true;
                            updatedState[this.edgeToShouldChangeDisplayMode(ojdrawerutils.DrawerConstants.stringBottom)] = true;
                        }
                    };
                    // FullOverlay <> Overlay <> Reflow
                    // Horizontal viewport change
                    if (prevViewportResolvedDisplayMode !== nextViewportResolvedDisplayMode) {
                        // Throttles processing of resize changes to let animations finish
                        // Sets this.handleResize to false
                        this.lockResizeListener();
                        // Resize processing in case drawers are open
                        // Check if there's a drawer that should change its display mode
                        // Start/End
                        const edges = [ojdrawerutils.DrawerConstants.stringStart, ojdrawerutils.DrawerConstants.stringEnd];
                        for (let i = 0; i < edges.length; i++) {
                            const edge = edges[i];
                            if (this.isDrawerOpened(edge) && this.state[this.edgeToDisplayName(edge)] === 'auto') {
                                atLeastOneOverlayDrawerNeedsToClose = true;
                                updatedState[this.edgeToShouldChangeDisplayMode(edge)] = true;
                            }
                        }
                        // Bottom
                        // Bottom drawer changes display mode when crossing 1024 horizontal threshold.
                        const reflowOverlay = [ojdrawerutils.DrawerConstants.stringReflow, ojdrawerutils.DrawerConstants.stringOverlay];
                        if (reflowOverlay.indexOf(prevViewportResolvedDisplayMode) > -1 &&
                            reflowOverlay.indexOf(nextViewportResolvedDisplayMode) > -1) {
                            checkBottomDrawerDisplayModeChange();
                        }
                    }
                    // Vertical change
                    // Redundant. See notes above.
                    // Not removing as this is legacy code.
                    // If horizontal viewport display mode resolves to overlay or full-overlay,
                    // bottom drawer is already displayed in overlay mode.
                    // Apply only if horizontal display mode resolves to 'reflow'.
                    // In all other cases bottom drawer does not change display mode
                    if (prevViewportResolvedDisplayModeVertical !== nextViewportResolvedDisplayModeVertical &&
                        prevViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringReflow) {
                        // Bottom
                        checkBottomDrawerDisplayModeChange();
                    }
                    if (atLeastOneOverlayDrawerNeedsToClose === false) {
                        // If we need to change display mode for at least one drawer
                        // we firstly need to wait for drawers to close.
                        // We are not changing viewPortResolvedDisplayMode immediately
                        // because styles of 'reflow vs. overlay' drawer would not be calculated properly
                        // We set that viewport display mode value in the
                        // * afterClose handler of the Popup Drawer
                        // * after slideOut animation of the Layout Drawer
                        // Then, it is safe to re-render and recalculate styles
                        // But if there's no need closing previous version of the drawer, set the value immediately
                        updatedState.viewportResolvedDisplayMode = nextViewportResolvedDisplayMode;
                        updatedState.viewportResolvedDisplayModeVertical = nextViewportResolvedDisplayModeVertical;
                    }
                    // Do not trigger render with every change to viewport size
                    // Update only if there's any property in updatesState object.
                    if (Object.keys(updatedState).length > 0) {
                        this.setState(updatedState);
                    }
                }
            };
            this.getDrawerPosition = (edge) => {
                // https://www.oracle.com/webfolder/technetwork/jet/jsdocs/oj.ojPopup.html#Position
                const horizontal = edge === ojdrawerutils.DrawerConstants.stringBottom ? ojdrawerutils.DrawerConstants.stringStart : edge;
                const vertical = edge === ojdrawerutils.DrawerConstants.stringBottom
                    ? ojdrawerutils.DrawerConstants.stringBottom
                    : ojdrawerutils.DrawerConstants.stringTop;
                const pos = `${horizontal} ${vertical}`;
                let position = {
                    my: pos,
                    at: pos,
                    of: this.mainSectionRef.current,
                    collision: 'none'
                };
                return ojpopupcore.PositionUtils.normalizeHorizontalAlignment(position, ojdrawerutils.DrawerUtils.isRTL());
            };
        }
        static getDerivedStateFromProps(props, state) {
            // Our props are mutable
            // https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
            // This method exists for rare use cases where the state depends on changes in props over time.
            const derivedState = {};
            // Something changed while the drawer is opened
            // We need to close the drawer using the current state (to preserve styles during closing)
            // and re-open using a new state
            // Therefore we are saving requested state in '<Edge>StateToChangeTo' for the next render cycle
            if (state.startOpened) {
                // Display mode changed
                if (props.startDisplay !== state.startDisplay) {
                    derivedState[`${ojdrawerutils.DrawerConstants.stringStart}${ojdrawerutils.DrawerConstants.stringStateToChangeTo}`] = {
                        startDisplay: props.startDisplay
                    };
                    return derivedState;
                }
            }
            if (state.endOpened) {
                // Display mode changed
                if (props.endDisplay !== state.endDisplay) {
                    derivedState[`${ojdrawerutils.DrawerConstants.stringEnd}${ojdrawerutils.DrawerConstants.stringStateToChangeTo}`] = {
                        endDisplay: props.endDisplay
                    };
                    return derivedState;
                }
            }
            if (state.bottomOpened) {
                // Display mode changed
                if (props.bottomDisplay !== state.bottomDisplay) {
                    derivedState[`${ojdrawerutils.DrawerConstants.stringBottom}${ojdrawerutils.DrawerConstants.stringStateToChangeTo}`] = {
                        bottomDisplay: props.bottomDisplay
                    };
                    return derivedState;
                }
            }
            if (props.startOpened !== state.startOpened) {
                derivedState.startOpened = props.startOpened;
                if (props.startOpened) {
                    derivedState.lastlyOpenedDrawer = ojdrawerutils.DrawerConstants.stringStart;
                }
            }
            if (props.endOpened !== state.endOpened) {
                derivedState.endOpened = props.endOpened;
                if (props.endOpened) {
                    derivedState.lastlyOpenedDrawer = ojdrawerutils.DrawerConstants.stringEnd;
                }
            }
            if (props.bottomOpened !== state.bottomOpened) {
                derivedState.bottomOpened = props.bottomOpened;
                if (props.bottomOpened) {
                    derivedState.lastlyOpenedDrawer = ojdrawerutils.DrawerConstants.stringBottom;
                }
            }
            if (props.startDisplay !== state.startDisplay) {
                derivedState.startDisplay = props.startDisplay;
            }
            if (props.endDisplay !== state.endDisplay) {
                derivedState.endDisplay = props.endDisplay;
            }
            if (props.bottomDisplay !== state.bottomDisplay) {
                derivedState.bottomDisplay = props.bottomDisplay;
            }
            return Object.keys(derivedState).length === 0 ? null : derivedState;
        }
        render(props) {
            let startDrawer = this.getDrawer(ojdrawerutils.DrawerConstants.stringStart);
            let endDrawer = this.getDrawer(ojdrawerutils.DrawerConstants.stringEnd);
            let bottomDrawer = this.getDrawer(ojdrawerutils.DrawerConstants.stringBottom);
            return (jsxRuntime.jsxs(ojvcomponent.Root, { ref: this.rootRef, children: [startDrawer, jsxRuntime.jsxs("div", { ref: this.middleSectionRef, class: ojdrawerutils.DrawerConstants.middleSectionSelector, children: [jsxRuntime.jsx("div", { ref: this.mainSectionRef, class: ojdrawerutils.DrawerConstants.mainContentSelector, children: props.children }), bottomDrawer] }), endDrawer] }));
        }
        getDrawer(edge) {
            const resolvedMode = this.getDrawerResolvedDisplayMode(edge);
            const isOverlay = resolvedMode === ojdrawerutils.DrawerConstants.stringOverlay ||
                resolvedMode === ojdrawerutils.DrawerConstants.stringFullOverlay;
            const tabIndexAttr = isOverlay ? -1 : undefined;
            if (this.isDrawerOpened(edge) ||
                this.wasDrawerOpenedInPrevState(edge) ||
                this.wasDrawerClosedWithEsc(edge)) {
                return (
                // Wrapper - workaround for VDOM Reconciliation issue:
                jsxRuntime.jsx("div", { ref: this.getDrawerWrapperRef(edge), class: this.getDrawerWrapperStyleClasses(edge), children: jsxRuntime.jsx("div", { ref: this.getDrawerRef(edge), tabIndex: tabIndexAttr, class: this.getDrawerStyleClasses(edge), onKeyDown: (event) => this.handleKeyDown(edge, event), children: this.getDrawerContent(edge) }) }));
            }
            return null;
        }
        isDrawerOpened(edge) {
            return this.state[this.edgeToStateOpenedName(edge)];
        }
        wasDrawerOpenedInPrevState(edge) {
            return this[this.edgeToPrevStateOpenedName(edge)];
        }
        wasDrawerClosedWithEsc(edge) {
            return this[this.edgeToClosedWithEsc(edge)];
        }
        getDrawerWrapperRef(edge) {
            switch (edge) {
                case ojdrawerutils.DrawerConstants.stringStart:
                    return this.startWrapperRef;
                case ojdrawerutils.DrawerConstants.stringEnd:
                    return this.endWrapperRef;
                case ojdrawerutils.DrawerConstants.stringBottom:
                    return this.bottomWrapperRef;
            }
        }
        getDrawerRef(edge) {
            switch (edge) {
                case ojdrawerutils.DrawerConstants.stringStart:
                    return this.startRef;
                case ojdrawerutils.DrawerConstants.stringEnd:
                    return this.endRef;
                case ojdrawerutils.DrawerConstants.stringBottom:
                    return this.bottomRef;
            }
        }
        getDrawerContent(edge) {
            switch (edge) {
                case ojdrawerutils.DrawerConstants.stringStart:
                    return this.props.start;
                case ojdrawerutils.DrawerConstants.stringEnd:
                    return this.props.end;
                case ojdrawerutils.DrawerConstants.stringBottom:
                    return this.props.bottom;
            }
        }
        getDrawerWrapperStyleClasses(edge) {
            return (`${ojdrawerutils.DrawerConstants.stringOjDrawer}${ojdrawerutils.DrawerConstants.charDash}${ojdrawerutils.DrawerConstants.stringReflow}-wrapper` +
                ' ' +
                this.getDrawerStyleClasses(edge));
        }
        getDrawerStyleClasses(edge) {
            let customStyleClassMap;
            const displayMode = this.getDrawerResolvedDisplayMode(edge);
            switch (displayMode) {
                case ojdrawerutils.DrawerConstants.stringReflow: {
                    customStyleClassMap = {
                        [ojdrawerutils.DrawerConstants.styleDisplayMode(ojdrawerutils.DrawerConstants.stringReflow)]: true
                    };
                    break;
                }
                case ojdrawerutils.DrawerConstants.stringOverlay: {
                    customStyleClassMap = {
                        [ojdrawerutils.DrawerConstants.styleDisplayMode(ojdrawerutils.DrawerConstants.stringOverlay)]: true
                    };
                    break;
                }
                case ojdrawerutils.DrawerConstants.stringFullOverlay: {
                    customStyleClassMap = {
                        [ojdrawerutils.DrawerConstants.styleDisplayMode(ojdrawerutils.DrawerConstants.stringOverlay)]: true,
                        [ojdrawerutils.DrawerConstants.styleDisplayMode(ojdrawerutils.DrawerConstants.stringFullOverlay)]: true
                    };
                    break;
                }
            }
            return ojdrawerutils.DrawerUtils.getStyleClassesMapAsString(
            // Add common style classes
            Object.assign(customStyleClassMap, ojdrawerutils.DrawerUtils.getCommonStyleClasses(edge)));
        }
        getDrawerResolvedDisplayMode(edge) {
            const edgeDisplay = this.edgeToDisplayName(edge);
            if (this.state[edgeDisplay] === 'auto') {
                if (edge === ojdrawerutils.DrawerConstants.stringBottom) {
                    // Full overlay
                    if (this.state.viewportResolvedDisplayModeVertical === ojdrawerutils.DrawerConstants.stringFullOverlay ||
                        this.state.viewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                        return ojdrawerutils.DrawerConstants.stringFullOverlay;
                    }
                    // Overlay
                    if (this.state.viewportResolvedDisplayModeVertical === ojdrawerutils.DrawerConstants.stringOverlay ||
                        this.state.viewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringOverlay) {
                        return ojdrawerutils.DrawerConstants.stringOverlay;
                    }
                    // Reflow
                    return ojdrawerutils.DrawerConstants.stringReflow;
                }
                return this.state.viewportResolvedDisplayMode;
            }
            if (this.state[edgeDisplay] === ojdrawerutils.DrawerConstants.stringReflow) {
                return ojdrawerutils.DrawerConstants.stringReflow;
            }
            if (this.state[edgeDisplay] === ojdrawerutils.DrawerConstants.stringOverlay) {
                const axisDisplayMode = edge === ojdrawerutils.DrawerConstants.stringBottom
                    ? this.state.viewportResolvedDisplayModeVertical
                    : this.state.viewportResolvedDisplayMode;
                return axisDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay
                    ? ojdrawerutils.DrawerConstants.stringFullOverlay
                    : ojdrawerutils.DrawerConstants.stringOverlay;
            }
        }
        getViewportResolvedDisplayMode() {
            const viewportWidth = ojdrawerutils.DrawerUtils.getViewportWidth();
            if (viewportWidth >= ojdrawerutils.DrawerConstants.displayTypeChangeThreshold) {
                return ojdrawerutils.DrawerConstants.stringReflow;
            }
            else if (viewportWidth < ojdrawerutils.DrawerConstants.displayTypeChangeThreshold &&
                viewportWidth >= ojdrawerutils.DrawerConstants.fullWidthDrawerChangeThreshold) {
                return ojdrawerutils.DrawerConstants.stringOverlay;
            }
            return ojdrawerutils.DrawerConstants.stringFullOverlay;
        }
        getViewportResolvedDisplayModeVertical() {
            const viewportHeight = ojdrawerutils.DrawerUtils.getViewportHeight();
            if (viewportHeight >= ojdrawerutils.DrawerConstants.fullHeightDrawerChangeThreshold) {
                return ojdrawerutils.DrawerConstants.stringReflow;
            }
            return ojdrawerutils.DrawerConstants.stringFullOverlay;
        }
        async selfClose(edge) {
            try {
                // Cancelable ojBeforeClose event
                await this.props.onOjBeforeClose?.({ edge });
            }
            catch (_) {
                // Closing was canceled so short circuit out here
                return;
            }
            // Trigger a writeback event to inform ancestors about internal change of the state
            if (edge === ojdrawerutils.DrawerConstants.stringStart) {
                this.props.onStartOpenedChanged?.(false);
            }
            if (edge === ojdrawerutils.DrawerConstants.stringEnd) {
                this.props.onEndOpenedChanged?.(false);
            }
            if (edge === ojdrawerutils.DrawerConstants.stringBottom) {
                this.props.onBottomOpenedChanged?.(false);
            }
        }
        setDrawerFocus(edge) {
            // Set focus to the first match:
            // 1. First element inside the drawer matching [autofocus]
            // 2. Tabbable element inside the content element
            // 3. The drawer itself
            // 4. Client executes its default focus() implementation
            //    e.g. Chrome focuses the last known focusable element.
            const drawerRef = this.getDrawerRef(edge);
            const autofocusItems = ojdrawerutils.DrawerUtils.getAutofocusFocusables(drawerRef.current);
            const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
            if (autofocusLength > 0) {
                autofocusFirstItem.focus({ preventScroll: true });
                return;
            }
            const focusables = ojdrawerutils.DrawerUtils.getFocusables(drawerRef.current);
            let elementToFocus = drawerRef.current;
            if (focusables.length) {
                // Focus the first focusable element
                elementToFocus = focusables[0];
            }
            elementToFocus.focus({ preventScroll: true });
        }
        componentDidUpdate(prevProps, prevState) {
            this.handleComponentUpdate(prevState);
        }
        componentDidMount() {
            // Save 'opened<Edge>' PrevState on init
            this.startOpenedPrevState = this.props.startOpened;
            this.endOpenedPrevState = this.props.endOpened;
            this.bottomOpenedPrevState = this.props.bottomOpened;
            // Register window resize observer
            if (this.windowResizeHandler === null) {
                this.windowResizeHandler = this.windowResizeCallback.bind(this);
            }
            // Note: Can not use DomUtils.addEventListner as it can not handle 'window'
            window.addEventListener(ojdrawerutils.DrawerConstants.stringResize, this.windowResizeHandler);
            // componentDidUpdate() is not triggered if the initial value of 'startOpened || endOpened'
            // differ from defaultProps 'false' values.
            // Case: User opens drawer immediately on init: <oj-drawer-layout startOpened="true">...
            if (DrawerLayout_1.defaultProps.startOpened != this.props.startOpened ||
                DrawerLayout_1.defaultProps.endOpened != this.props.endOpened ||
                DrawerLayout_1.defaultProps.bottomOpened != this.props.bottomOpened) {
                // Create artificial 'prevState' (on first render there's no previous state) needed when
                // handleComponentUpdate() is called from componentDidUpdate() on second and every other render
                const stateCopy = Object.assign({}, this.state);
                stateCopy.startOpened = false;
                stateCopy.endOpened = false;
                stateCopy.bottomOpened = false;
                this.handleComponentUpdate(stateCopy);
            }
        }
        componentWillUnmount() {
            window.removeEventListener(ojdrawerutils.DrawerConstants.stringResize, this.windowResizeHandler);
            this.windowResizeHandler = null;
            // Remove DrawerLayout (main content) resize observer
            // In standard scenarios we remove this size observer in beforeClose handler.
            // We need to do this also here due to case when drawerLayout was destroyed
            this.removeDrawerLayoutResizeListener();
        }
        removeDrawerLayoutResizeListener() {
            if (this.drawerLayoutResizeHandler) {
                DomUtils.removeResizeListener(this.rootRef.current, this.drawerLayoutResizeHandler);
                this.drawerLayoutResizeHandler = null;
            }
        }
        handleComponentUpdate(prevState) {
            let sides = [
                ojdrawerutils.DrawerConstants.stringStart,
                ojdrawerutils.DrawerConstants.stringEnd,
                ojdrawerutils.DrawerConstants.stringBottom
            ];
            sides = sides.filter((side) => side != this.state.lastlyOpenedDrawer);
            this.openOrCloseDrawer(sides[0], prevState);
            this.openOrCloseDrawer(sides[1], prevState);
            this.openOrCloseDrawer(this.state.lastlyOpenedDrawer, prevState);
        }
        openOrCloseDrawer(edge, prevState) {
            const openedStateName = this.edgeToStateOpenedName(edge);
            if (
            // Case: Controlled component, props has changed. Open or close 'reflow' or 'overlay' drawer.
            this.isDrawerOpened(edge) != prevState[openedStateName] ||
                // Case: Window resize 'overlay > reflow'. Waiting for 'overlay' to close.
                this.shouldDrawerChangeDisplayMode(edge) ||
                // Case: Window resize other cases - drawers are open and have display mode set (other than auto)
                // Render cycle was triggerd by the change of 'viewportResolvedDisplayMode' state value
                (this.isDrawerOpened(edge) && prevState[openedStateName])) {
                // Save previous state of the 'opened<Edge>' property
                // Previous state is not available in render() function
                if (this.isDrawerOpened(edge) != prevState[openedStateName]) {
                    this[this.edgeToPrevStateOpenedName(edge)] = this.isDrawerOpened(edge);
                }
                const displayMode = this.getDrawerResolvedDisplayMode(edge);
                if (displayMode === ojdrawerutils.DrawerConstants.stringReflow) {
                    // A.) Render 'Reflow' drawer
                    this.openOrCloseReflowDrawer(edge, prevState);
                }
                else {
                    // B.) Render 'Overlay' drawer using PopupService
                    this.openOrClosePopupDrawer(edge, prevState);
                }
            }
        }
        openOrCloseReflowDrawer(edge, prevState) {
            if (this.isDrawerOpened(edge) === false ||
                this.shouldDrawerChangeDisplayMode(edge) ||
                this.getStateToChangeTo(edge)) {
                // Remember element that had focus when closing initiated
                this.elementWithFocusBeforeDrawerCloses = document.activeElement;
                // Close
                this.animateClose(edge)
                    .then(() => {
                    // Remove drawer resize observer
                    const drawerRef = this.getDrawerRef(edge).current;
                    if (drawerRef) {
                        if (edge === ojdrawerutils.DrawerConstants.stringStart) {
                            DomUtils.removeResizeListener(drawerRef, this.startReflowDrawerResizeHandler);
                            this.startReflowDrawerResizeHandler = null;
                        }
                        else if (edge === ojdrawerutils.DrawerConstants.stringEnd) {
                            DomUtils.removeResizeListener(drawerRef, this.endReflowDrawerResizeHandler);
                            this.endReflowDrawerResizeHandler = null;
                        }
                    }
                    // Return the focus to the drawer's launcher
                    this.returnFocus(edge);
                    if (this.getStateToChangeTo(edge)) {
                        const updatedState = {};
                        const resetStateToChangeTo = {};
                        resetStateToChangeTo[this.edgeToStateToChangeTo(edge)] = null;
                        Object.assign(updatedState, this.getStateToChangeTo(edge), resetStateToChangeTo);
                        this.setState(updatedState);
                    }
                    else if (this.shouldDrawerChangeDisplayMode(edge)) {
                        const updatedState = {};
                        updatedState[this.edgeToShouldChangeDisplayMode(edge)] = false;
                        // New value of the viewport display mode must be set in afterClose handler
                        // Otherwise styles for 'reflow vs. overlay' are calculated before
                        // closing animation of the overlay drawer has finished closing
                        // Would be enough to set it only with the first drawer, but makes no difference
                        // if we reset it with updating other drawers too. It's value won't change.
                        updatedState.viewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                        updatedState.viewportResolvedDisplayModeVertical =
                            this.getViewportResolvedDisplayModeVertical();
                        this.setState(updatedState);
                    }
                    else {
                        // We need to check if the drawer was open in the previous state.
                        // Case: when display mode switches 'overlay' <> 'reflow' state changes, hence render cycle is triggered
                        // but we do not want to trigger another one.
                        // forceUpdate below only cares of situation when drawer gets finally close and needs to be 'parked'
                        if (!this.wasDrawerOpenedInPrevState(edge)) {
                            // Fix of flickering occurring since Preact10.10
                            this.addHiddenStyle(edge);
                            // Force update to 'park' the node to the hidden div at the end of the DOM
                            // (conditional rendering mechanism)
                            this.forceUpdate();
                            // Case: a side drawer is in reflow mode while bottom drawer in overlay mode
                            // When side drawer closes, we need to reset the width of the bottom drawer
                            // to match the width of the main content
                            // We need to defer it using setTimeout because we are waiting for an async VDOM
                            // manipulation that removes the drawer from the DOM
                            setTimeout(() => {
                                this.setBottomOverlayDrawerWidth();
                            }, 0);
                        }
                    }
                })
                    .then(() => {
                    // After reflow side drawers gets closed, re-set the bottom drawer width, if open
                    this.setBottomOverlayDrawerWidth();
                });
            }
            else {
                if (this.isDrawerOpened(edge)) {
                    if (
                    // Do not animate if already opened
                    // Animate only if the drawer was previously closed
                    prevState[this.edgeToStateOpenedName(edge)] === false ||
                        // Case: Resizing window when display mode is 'auto'
                        prevState[this.edgeToShouldChangeDisplayMode(edge)] ||
                        // Case: Different display mode was set
                        prevState[this.edgeToDisplayName(edge)] != this.state[this.edgeToDisplayName(edge)]) {
                        // Remember element to return the focus to after drawer closes
                        // Do not override when switching 'overlay' <> 'reflow'
                        if (!prevState[this.edgeToShouldChangeDisplayMode(edge)]) {
                            this.drawerOpener = document.activeElement;
                        }
                        this.removeHiddenStyle(edge);
                        this.animateOpen(edge).then(() => {
                            // If the bottom drawer is opened in overlay mode,
                            // re-set its width to adjust to main section size
                            this.setBottomOverlayDrawerWidth();
                            // Register drawer resize observer
                            const drawerRef = this.getDrawerRef(edge).current;
                            if (drawerRef) {
                                if (edge === ojdrawerutils.DrawerConstants.stringStart &&
                                    this.startReflowDrawerResizeHandler === null) {
                                    this.startReflowDrawerResizeHandler = this.reflowDrawerResizeCallback.bind(this);
                                    DomUtils.addResizeListener(drawerRef, this.startReflowDrawerResizeHandler, 50, true);
                                }
                                else if (edge === ojdrawerutils.DrawerConstants.stringEnd &&
                                    this.endReflowDrawerResizeHandler === null) {
                                    this.endReflowDrawerResizeHandler = this.reflowDrawerResizeCallback.bind(this);
                                    DomUtils.addResizeListener(drawerRef, this.endReflowDrawerResizeHandler, 50, true);
                                }
                            }
                        });
                    }
                }
            }
        }
        removeHiddenStyle(edge) {
            // See comments when adding this class for more details
            this.getDrawerWrapperRef(edge).current?.classList.remove(ojdrawerutils.DrawerConstants.styleDrawerHidden);
        }
        addHiddenStyle(edge) {
            // Fix of flickering occurring since Preact10.10
            // In the future Drawer's state should be handled as 'closed-opening-opened-closing' state.
            // Visibility should be derived from this state.
            this.getDrawerWrapperRef(edge).current?.classList.add(ojdrawerutils.DrawerConstants.styleDrawerHidden);
        }
        returnFocus(edge) {
            // Return the focus to the drawer's launcher only if the focus
            // is currently living within a drawer.
            // As we do not apply focus-trap in DrawerLayout, user is able to
            // get the focus out of the drawer. In this case we do not want to handle it.
            // Note that the drawerRef(edge).current can be null (JET-54388)
            const drawerElem = this.getDrawerRef(edge).current;
            if (drawerElem && drawerElem.contains(this.elementWithFocusBeforeDrawerCloses)) {
                ojdrawerutils.DrawerUtils.moveFocusToElementOrNearestAncestor(this.drawerOpener);
            }
        }
        animateOpen(edge) {
            const busyContext = Context.getContext(this.rootRef.current).getBusyContext();
            const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
            if (this.getDrawerResolvedDisplayMode(edge) === ojdrawerutils.DrawerConstants.stringReflow) {
                return AnimationUtils.expand(this.getRefToAnimate(edge).current, ojdrawerutils.DrawerUtils.getAnimationOptions('expand', edge)).then(resolveFunc);
            }
            else {
                // overlay | full-overlay
                return AnimationUtils.slideIn(this.getRefToAnimate(edge).current, ojdrawerutils.DrawerUtils.getAnimationOptions(ojdrawerutils.DrawerConstants.stringSlideIn, edge))
                    .then(() => {
                    // Remove clipping area of overlay Popups.
                    // It was masking overlays of the drawer during the animation (see beforeOpen hook)
                    ojdrawerutils.DrawerUtils.unwrapDrawerClippingArea(this.getDrawerRef(edge).current);
                })
                    .then(resolveFunc);
            }
        }
        animateClose(edge) {
            const busyContext = Context.getContext(this.rootRef.current).getBusyContext();
            const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
            if (this.getDrawerResolvedDisplayMode(edge) === ojdrawerutils.DrawerConstants.stringReflow) {
                // reflow drawer
                return AnimationUtils.collapse(this.getRefToAnimate(edge).current, ojdrawerutils.DrawerUtils.getAnimationOptions('collapse', edge)).then(resolveFunc);
            }
            else {
                // overlay | full-overlay drawer
                // JET-64924 - We need the reference to the drawer element before animation begins.
                // Case: Spectra app has a hook in router. If browser's back arrow is clicked,
                // the router triggers closing of a drawer. Preact re-render and destroy action immediately follow.
                // When destroy happens during animation, Preact cleans drawerRef.
                // If drawerRef is null, clipping div that wraps the popup element is not removed.
                // If clipping wrapper is not removed, PopupService considers it popup's z-layer
                // as it simply calls parent() when cleaning z-layers up.
                const drawerEl = this.getDrawerRef(edge).current;
                return AnimationUtils.slideOut(this.getRefToAnimate(edge).current, ojdrawerutils.DrawerUtils.getAnimationOptions(ojdrawerutils.DrawerConstants.stringSlideOut, edge))
                    .then(() => {
                    // Remove clipping area of overlay Popups
                    // It was masking overlays of the drawer during the animation (see beforeClose hook)
                    ojdrawerutils.DrawerUtils.unwrapDrawerClippingArea(drawerEl);
                })
                    .then(resolveFunc);
            }
        }
        edgeToStateOpenedName(edge) {
            return `${edge}${ojdrawerutils.DrawerUtils.capitalizeFirstChar(ojdrawerutils.DrawerConstants.stringOpened)}`;
        }
        edgeToPrevStateOpenedName(edge) {
            return `${edge}${ojdrawerutils.DrawerUtils.capitalizeFirstChar(ojdrawerutils.DrawerConstants.stringOpened)}${ojdrawerutils.DrawerConstants.stringPrevState}`;
        }
        edgeToShouldChangeDisplayMode(edge) {
            return `${edge}${ojdrawerutils.DrawerConstants.stringShouldChangeDisplayMode}`;
        }
        edgeToClosedWithEsc(edge) {
            return `${edge}${ojdrawerutils.DrawerConstants.stringClosedWithEsc}`;
        }
        edgeToDisplayName(edge) {
            return `${edge}${ojdrawerutils.DrawerConstants.stringDisplay}`;
        }
        edgeToStateToChangeTo(edge) {
            return `${edge}${ojdrawerutils.DrawerConstants.stringStateToChangeTo}`;
        }
        openOrClosePopupDrawer(edge, prevState) {
            const $drawerElement = $(this.getDrawerRef(edge).current);
            const popupServiceInstance = ojpopupcore.PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(edge, prevState);
            if (this.isDrawerOpened(edge) === false ||
                this.shouldDrawerChangeDisplayMode(edge) ||
                this.getStateToChangeTo(edge)) {
                // Close
                // Even the PopupService ignores any calls before the previous one has finished,
                // we can limit these calls here
                if (ojpopupcore.ZOrderUtils.getStatus($drawerElement) === ojpopupcore.ZOrderUtils.STATUS.OPEN) {
                    popupServiceInstance.close(popupServiceOptions);
                }
            }
            else if (this.isDrawerOpened(edge)) {
                // Open
                // Even the PopupService ignores any calls before the previous one has finished,
                // we can limit these calls here
                if ([ojpopupcore.ZOrderUtils.STATUS.CLOSE, ojpopupcore.ZOrderUtils.STATUS.UNKNOWN].indexOf(ojpopupcore.ZOrderUtils.getStatus($drawerElement) > -1)) {
                    this.removeHiddenStyle(edge);
                    popupServiceInstance.open(popupServiceOptions);
                }
            }
        }
        shouldDrawerChangeDisplayMode(edge) {
            return this.state[this.edgeToShouldChangeDisplayMode(edge)];
        }
        getStateToChangeTo(edge) {
            return this.state[this.edgeToStateToChangeTo(edge)];
        }
        getPopupServiceOptions(edge, prevState) {
            const $drawerElement = $(this.getDrawerRef(edge).current);
            // PopupService
            const PSOptions = {};
            const PSoption = ojpopupcore.PopupService.OPTION;
            PSOptions[PSoption.POPUP] = $drawerElement;
            PSOptions[PSoption.LAUNCHER] = $(document.activeElement);
            PSOptions[PSoption.LAYER_SELECTORS] = ojdrawerutils.DrawerConstants.DrawerLayoutStyleSurrogate;
            PSOptions[PSoption.LAYER_LEVEL] = ojpopupcore.PopupService.LAYER_LEVEL.TOP_LEVEL;
            PSOptions[PSoption.POSITION] = this.getDrawerPosition(edge);
            PSOptions[PSoption.CUSTOM_ELEMENT] = true;
            const PSEvent = ojpopupcore.PopupService.EVENT;
            PSOptions[PSoption.EVENTS] = {
                [PSEvent.POPUP_BEFORE_OPEN]: () => this.beforeOpenHandler(edge, prevState),
                [PSEvent.POPUP_AFTER_OPEN]: () => this.afterOpenHandler(edge, prevState),
                [PSEvent.POPUP_BEFORE_CLOSE]: () => this.beforeCloseHandler(edge),
                [PSEvent.POPUP_AFTER_CLOSE]: () => this.afterCloseHandler(edge, prevState),
                [PSEvent.POPUP_REFRESH]: () => this.refreshHandler(edge),
                [PSEvent.POPUP_REMOVE]: () => this.destroyHandler(edge)
            };
            return PSOptions;
        }
        beforeOpenHandler(edge, prevState) {
            // Disable body overflow during animation so that gaps for scrollbars do not appear
            ojdrawerutils.DrawerUtils.disableBodyOverflow();
            // Remember element to return the focus to after drawer closes
            // Do not override when switching 'overlay' <> 'reflow'
            if (!prevState[this.edgeToShouldChangeDisplayMode(edge)]) {
                this.drawerOpener = document.activeElement;
            }
            const drawerElement = this.getDrawerRef(edge).current;
            const $drawerElement = $(drawerElement);
            const position = this.getDrawerPosition(edge);
            // Bottom drawer always has the width of the middle section
            if (edge === ojdrawerutils.DrawerConstants.stringBottom) {
                this.setBottomOverlayDrawerWidth();
            }
            // Remove display: none and set the starting position for Animation
            $drawerElement.show();
            // @ts-ignore
            $drawerElement.position(position);
            // By default PopupElements have no predefined height.
            // For the drawer purpose, we want them to match the height of its parent
            this.setStartEndOverlayDrawersHeight();
            // Add clipping area
            ojdrawerutils.DrawerUtils.wrapDrawerWithClippingArea(drawerElement, position);
            // Register DrawerLayout (main content) resize observer
            if (this.drawerLayoutResizeHandler === null) {
                this.drawerLayoutResizeHandler = this.drawerLayoutResizeCallback.bind(this);
            }
            DomUtils.addResizeListener(this.rootRef.current, this.drawerLayoutResizeHandler, 50, true);
            return this.animateOpen(edge);
        }
        setBottomOverlayDrawerWidth() {
            if (this.isDrawerOpened(ojdrawerutils.DrawerConstants.stringBottom) &&
                this.getDrawerResolvedDisplayMode(ojdrawerutils.DrawerConstants.stringBottom) !=
                    ojdrawerutils.DrawerConstants.stringReflow) {
                const width = this.middleSectionRef.current.getBoundingClientRect().width;
                this.bottomRef.current.style.width = `${width}px`;
            }
        }
        afterOpenHandler(edge, prevState) {
            // Enable body overflow disabled in 'beforeOpen'
            ojdrawerutils.DrawerUtils.enableBodyOverflow();
            this.handleFocus(prevState);
            const drawerElement = this.getDrawerRef(edge).current;
            const $drawerElement = $(drawerElement);
            const status = ojpopupcore.ZOrderUtils.getStatus($drawerElement);
            // Register overlay drawer resize observer
            if (edge === ojdrawerutils.DrawerConstants.stringStart && this.startOverlayDrawerResizeHandler === null) {
                this.startOverlayDrawerResizeHandler = this.overlayDrawerResizeCallback.bind(this, ojdrawerutils.DrawerConstants.stringStart);
                DomUtils.addResizeListener(drawerElement, this.startOverlayDrawerResizeHandler, 50, true);
            }
            else if (edge === ojdrawerutils.DrawerConstants.stringEnd && this.endOverlayDrawerResizeHandler === null) {
                this.endOverlayDrawerResizeHandler = this.overlayDrawerResizeCallback.bind(this, ojdrawerutils.DrawerConstants.stringEnd);
                DomUtils.addResizeListener(drawerElement, this.endOverlayDrawerResizeHandler, 50, true);
            }
            else if (edge === ojdrawerutils.DrawerConstants.stringBottom &&
                this.bottomOverlayDrawerResizeHandler === null) {
                this.bottomOverlayDrawerResizeHandler = this.overlayDrawerResizeCallback.bind(this, ojdrawerutils.DrawerConstants.stringBottom);
                DomUtils.addResizeListener(drawerElement, this.bottomOverlayDrawerResizeHandler, 50, true);
            }
            // If the <Edge>-opened property was set to false during the opening animation we will close the drawer
            if (status === ojpopupcore.ZOrderUtils.STATUS.OPEN && !this.isDrawerOpened(edge)) {
                const popupServiceInstance = ojpopupcore.PopupService.getInstance();
                const popupServiceOptions = this.getPopupServiceOptions(edge, prevState);
                popupServiceInstance.close(popupServiceOptions);
            }
        }
        handleFocus(prevState) {
            if (this.state.startOpened && prevState.startOpened !== this.state.startOpened) {
                this.setDrawerFocus(ojdrawerutils.DrawerConstants.stringStart);
            }
            if (this.state.endOpened && prevState.endOpened !== this.state.endOpened) {
                this.setDrawerFocus(ojdrawerutils.DrawerConstants.stringEnd);
            }
            if (this.state.bottomOpened && prevState.bottomOpened !== this.state.bottomOpened) {
                this.setDrawerFocus(ojdrawerutils.DrawerConstants.stringBottom);
            }
        }
        beforeCloseHandler(edge) {
            // Disable body overflow during animation so that gaps for scrollbars do not appear
            ojdrawerutils.DrawerUtils.disableBodyOverflow();
            // Remember element that had focus when closing initiated
            this.elementWithFocusBeforeDrawerCloses = document.activeElement;
            // Remove overlay drawer resize observer
            if (edge === ojdrawerutils.DrawerConstants.stringStart) {
                DomUtils.removeResizeListener(this.getDrawerRef(edge).current, this.startOverlayDrawerResizeHandler);
                this.startOverlayDrawerResizeHandler = null;
            }
            else if (edge === ojdrawerutils.DrawerConstants.stringEnd) {
                DomUtils.removeResizeListener(this.getDrawerRef(edge).current, this.endOverlayDrawerResizeHandler);
                this.endOverlayDrawerResizeHandler = null;
            }
            else if (edge === ojdrawerutils.DrawerConstants.stringBottom) {
                DomUtils.removeResizeListener(this.getDrawerRef(edge).current, this.bottomOverlayDrawerResizeHandler);
                this.bottomOverlayDrawerResizeHandler = null;
            }
            // Remove DrawerLayout (main content) resize observer
            this.removeDrawerLayoutResizeListener();
            // Add clipping area
            // It masks overlays of the drawer during animation
            ojdrawerutils.DrawerUtils.wrapDrawerWithClippingArea(this.getDrawerRef(edge).current, this.getDrawerPosition(edge));
            return this.animateClose(edge);
        }
        afterCloseHandler(edge, prevState) {
            // If the drawer was closed using ESC key, forget this information
            if (this[this.edgeToClosedWithEsc(edge)]) {
                this[this.edgeToClosedWithEsc(edge)] = false;
            }
            // Enable body overflow disabled in 'beforeOpen'
            ojdrawerutils.DrawerUtils.enableBodyOverflow();
            // Return the focus to the drawer's launcher
            this.returnFocus(edge);
            const $drawerElement = $(this.getDrawerRef(edge).current);
            const status = ojpopupcore.ZOrderUtils.getStatus($drawerElement);
            // Remove inline styles kept on the drawer by the PopupService
            // In case we open it in reflow mode next time, these styles are not wanted.
            if (this.getDrawerRef(edge).current) {
                this.getDrawerRef(edge).current.removeAttribute('style');
            }
            if (this.getStateToChangeTo(edge)) {
                const updatedState = {};
                const resetStateToChangeTo = {};
                resetStateToChangeTo[this.edgeToStateToChangeTo(edge)] = null;
                Object.assign(updatedState, this.getStateToChangeTo(edge), resetStateToChangeTo);
                this.setState(updatedState);
            }
            else if (this.shouldDrawerChangeDisplayMode(edge)) {
                // We closed the drawer because of 'overlay' <> 'reflow' change
                const updatedState = {};
                updatedState[this.edgeToShouldChangeDisplayMode(edge)] = false;
                // New value of the viewport display mode must be set in afterClose handler
                // Otherwise styles for 'reflow vs. overlay' are calculated before
                // closing animation of the overlay drawer has finished closing
                // Would be enough to set it only with the first drawer, but makes no difference
                // if we reset it with updating other drawers too. Its value won't change.
                updatedState.viewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                updatedState.viewportResolvedDisplayModeVertical =
                    this.getViewportResolvedDisplayModeVertical();
                this.setState(updatedState);
            }
            else if (status === ojpopupcore.ZOrderUtils.STATUS.CLOSE && this.isDrawerOpened(edge)) {
                // If the opened property was set to true during the closing animation we will re-open the drawer
                const popupServiceInstance = ojpopupcore.PopupService.getInstance();
                const popupServiceOptions = this.getPopupServiceOptions(edge, prevState);
                popupServiceInstance.open(popupServiceOptions);
            }
            else if (!this.wasDrawerOpenedInPrevState(edge)) {
                // We need to check if the drawer was open in the previous state.
                // Case: when display mode switches 'overlay' <> 'reflow' state changes, hence render cycle is triggered
                // but we do not want to trigger another one.
                // forceUpdate below only cares of situation when drawer gets finally close and needs to be 'parked'
                // Fix of flickering occurring since Preact10.10
                this.addHiddenStyle(edge);
                // Force update to 'park' the node to the hidden div at the end of the DOM
                // (conditional rendering mechanism)
                this.forceUpdate();
            }
            // fire the ojClose event
            this.props.onOjClose?.({ edge });
        }
        setStartEndOverlayDrawersHeight() {
            // By default PopupElements have no predefined height.
            // In 'overlay' mode drawers should be
            // of the same height as their parent <oj-drawer-layout>
            const middleSectionHeight = ojdrawerutils.DrawerUtils.getElementHeight(this.middleSectionRef.current) + 'px';
            const startDrawerElement = this.startRef.current;
            if (startDrawerElement &&
                this.getDrawerResolvedDisplayMode(ojdrawerutils.DrawerConstants.stringStart) != ojdrawerutils.DrawerConstants.stringReflow) {
                startDrawerElement.style.height = middleSectionHeight;
            }
            const endDrawerElement = this.endRef.current;
            if (endDrawerElement &&
                this.getDrawerResolvedDisplayMode(ojdrawerutils.DrawerConstants.stringEnd) != ojdrawerutils.DrawerConstants.stringReflow) {
                endDrawerElement.style.height = middleSectionHeight;
            }
        }
    };
    exports.DrawerLayout.defaultProps = {
        startOpened: false,
        endOpened: false,
        bottomOpened: false,
        startDisplay: 'auto',
        endDisplay: 'auto',
        bottomDisplay: 'auto'
    };
    exports.DrawerLayout._metadata = { "slots": { "": {}, "start": {}, "end": {}, "bottom": {} }, "properties": { "startOpened": { "type": "boolean", "writeback": true }, "endOpened": { "type": "boolean", "writeback": true }, "bottomOpened": { "type": "boolean", "writeback": true }, "startDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] }, "endDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] }, "bottomDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] } }, "events": { "ojBeforeClose": { "cancelable": true }, "ojClose": {} }, "extension": { "_WRITEBACK_PROPS": ["startOpened", "endOpened", "bottomOpened"], "_READ_ONLY_PROPS": [] } };
    exports.DrawerLayout = DrawerLayout_1 = __decorate([
        ojvcomponent.customElement('oj-drawer-layout')
    ], exports.DrawerLayout);

    Object.defineProperty(exports, '__esModule', { value: true });

});
