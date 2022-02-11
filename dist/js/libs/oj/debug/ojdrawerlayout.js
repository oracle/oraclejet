/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojvcomponent', 'preact', 'jquery', 'ojs/ojanimation', 'ojs/ojdomutils', 'ojs/ojcore-base', 'ojs/ojpopup', 'ojs/ojdrawerutils'], function (exports, ojvcomponent, preact, $, AnimationUtils, DomUtils, ojcoreBase, ojpopup, ojdrawerutils) { 'use strict';

    $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var DrawerLayout_1;
    const ojet = oj;
    const PopupService = ojet.PopupService;
    const ZOrderUtils = ojet.ZOrderUtils;
    exports.DrawerLayout = DrawerLayout_1 = class DrawerLayout extends preact.Component {
        constructor() {
            super(...arguments);
            this.rootRef = preact.createRef();
            this.startWrapperRef = preact.createRef();
            this.startRef = preact.createRef();
            this.endWrapperRef = preact.createRef();
            this.endRef = preact.createRef();
            this.mainSectionRef = preact.createRef();
            this.startClosedWithEsc = false;
            this.endClosedWithEsc = false;
            this.drawerResizeHandler = null;
            this.handleResize = true;
            this.state = {
                startOpened: this.props.startOpened,
                endOpened: this.props.endOpened,
                startDisplay: this.props.startDisplay,
                endDisplay: this.props.endDisplay,
                startShouldChangeDisplayMode: false,
                endShouldChangeDisplayMode: false,
                startStateToChangeTo: null,
                endStateToChangeTo: null,
                viewportResolvedDisplayMode: this.getViewportResolvedDisplayMode(),
                lastlyOpenedDrawer: ojdrawerutils.DrawerConstants.stringStart
            };
            this.handleKeyDown = (edge, event) => {
                const drawerDisplayMode = this.getDrawerResolvedDisplayMode(edge);
                if (event.key === ojdrawerutils.DrawerConstants.keys.ESC &&
                    (drawerDisplayMode === ojdrawerutils.DrawerConstants.stringOverlay ||
                        drawerDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay)) {
                    this[this.edgeToClosedWithEsc(edge)] = true;
                    this.selfClose(edge);
                }
            };
            this.getRefToAnimate = (edge) => {
                return this.getDrawerResolvedDisplayMode(edge) === ojdrawerutils.DrawerConstants.stringReflow
                    ? this.getDrawerWrapperRef(edge)
                    : this.getDrawerRef(edge);
            };
            this.lockResizeListener = () => {
                if (this.handleResize) {
                    this.handleResize = false;
                    setTimeout(() => {
                        this.handleResize = true;
                        if (this.state.viewportResolvedDisplayMode !== this.getViewportResolvedDisplayMode()) {
                            const updatedState = {};
                            [ojdrawerutils.DrawerConstants.stringStart, ojdrawerutils.DrawerConstants.stringEnd].forEach((edge) => {
                                if (this.isDrawerOpened(edge) && this.state[this.edgeToDisplayName(edge)] === 'auto') {
                                    updatedState[this.edgeToShouldChangeDisplayMode(edge)] = true;
                                }
                            });
                            if (Object.keys(updatedState).length > 0) {
                                this.setState(updatedState);
                            }
                        }
                    }, ojdrawerutils.DrawerConstants.animationDuration + 50);
                }
            };
            this.resizeHandler = () => {
                if (this.handleResize) {
                    const prevViewportResolvedDisplayMode = this.state.viewportResolvedDisplayMode;
                    const nextViewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                    let atLeastOneOverlayDrawerNeedsToClose = false;
                    const updatedState = {};
                    if (prevViewportResolvedDisplayMode !== nextViewportResolvedDisplayMode) {
                        this.lockResizeListener();
                        [ojdrawerutils.DrawerConstants.stringStart, ojdrawerutils.DrawerConstants.stringEnd].forEach((edge) => {
                            if (this.isDrawerOpened(edge) && this.state[this.edgeToDisplayName(edge)] === 'auto') {
                                atLeastOneOverlayDrawerNeedsToClose = true;
                                updatedState[this.edgeToShouldChangeDisplayMode(edge)] = true;
                            }
                        });
                        if (atLeastOneOverlayDrawerNeedsToClose === false) {
                            updatedState.viewportResolvedDisplayMode = nextViewportResolvedDisplayMode;
                        }
                    }
                    if (Object.keys(updatedState).length > 0) {
                        this.setState(updatedState);
                    }
                }
            };
        }
        static getDerivedStateFromProps(props, state) {
            const derivedState = {};
            if (state.startOpened) {
                if (props.startDisplay !== state.startDisplay) {
                    derivedState[`${ojdrawerutils.DrawerConstants.stringStart}${ojdrawerutils.DrawerConstants.stringStateToChangeTo}`] = {
                        startDisplay: props.startDisplay
                    };
                    return derivedState;
                }
            }
            const endStateToChangeTo = `${ojdrawerutils.DrawerConstants.stringEnd}${ojdrawerutils.DrawerConstants.stringStateToChangeTo}`;
            if (state.endOpened && state[endStateToChangeTo] === null) {
                if (props.endDisplay !== state.endDisplay) {
                    derivedState[endStateToChangeTo] = { endDisplay: props.endDisplay };
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
            if (props.startDisplay !== state.startDisplay) {
                derivedState.startDisplay = props.startDisplay;
            }
            if (props.endDisplay !== state.endDisplay) {
                derivedState.endDisplay = props.endDisplay;
            }
            return Object.keys(derivedState).length === 0 ? null : derivedState;
        }
        render(props) {
            let startDrawer = this.getDrawer(ojdrawerutils.DrawerConstants.stringStart);
            let endDrawer = this.getDrawer(ojdrawerutils.DrawerConstants.stringEnd);
            return (preact.h(ojvcomponent.Root, { ref: this.rootRef },
                startDrawer,
                preact.h("div", { ref: this.mainSectionRef, class: ojdrawerutils.DrawerConstants.mainContentSelector }, props.children),
                endDrawer));
        }
        getDrawer(edge) {
            const resolvedMode = this.getDrawerResolvedDisplayMode(edge);
            const isOverlay = resolvedMode === ojdrawerutils.DrawerConstants.stringOverlay ||
                resolvedMode === ojdrawerutils.DrawerConstants.stringFullOverlay;
            const roleAttr = this.props.role || (isOverlay && 'dialog');
            const tabIndexAttr = isOverlay ? -1 : undefined;
            if (this.isDrawerOpened(edge) ||
                this.wasDrawerOpenedInPrevState(edge) ||
                this.wasDrawerClosedWithEsc(edge)) {
                return (preact.h("div", { ref: this.getDrawerWrapperRef(edge), class: this.getDrawerWrapperStyleClasses(edge) },
                    preact.h("div", { ref: this.getDrawerRef(edge), role: roleAttr, tabIndex: tabIndexAttr, class: this.getDrawerStyleClasses(edge), onKeyDown: (event) => this.handleKeyDown(edge, event) }, this.getDrawerContent(edge))));
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
            return edge === ojdrawerutils.DrawerConstants.stringStart ? this.startWrapperRef : this.endWrapperRef;
        }
        getDrawerRef(edge) {
            return edge === ojdrawerutils.DrawerConstants.stringStart ? this.startRef : this.endRef;
        }
        getDrawerContent(edge) {
            return edge === ojdrawerutils.DrawerConstants.stringStart ? this.props.start : this.props.end;
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
            return ojdrawerutils.DrawerUtils.getStyleClassesMapAsString(Object.assign(customStyleClassMap, ojdrawerutils.DrawerUtils.getCommonStyleClasses(edge)));
        }
        getDrawerResolvedDisplayMode(edge) {
            const edgeDisplay = this.edgeToDisplayName(edge);
            if (this.state[edgeDisplay] === 'auto') {
                return this.state.viewportResolvedDisplayMode;
            }
            if (this.state[edgeDisplay] === ojdrawerutils.DrawerConstants.stringReflow) {
                return ojdrawerutils.DrawerConstants.stringReflow;
            }
            if (this.state[edgeDisplay] === ojdrawerutils.DrawerConstants.stringOverlay) {
                return this.state.viewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay
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
        selfClose(edge) {
            var _a, _b, _c, _d;
            if (edge === ojdrawerutils.DrawerConstants.stringStart) {
                (_b = (_a = this.props).onStartOpenedChanged) === null || _b === void 0 ? void 0 : _b.call(_a, false);
            }
            if (edge === ojdrawerutils.DrawerConstants.stringEnd) {
                (_d = (_c = this.props).onEndOpenedChanged) === null || _d === void 0 ? void 0 : _d.call(_c, false);
            }
        }
        setDrawerFocus(edge) {
            const drawerRef = this.getDrawerRef(edge);
            const autofocusItems = drawerRef.current.querySelectorAll('[autofocus]');
            const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
            if (autofocusLength > 0) {
                autofocusFirstItem.focus();
                return;
            }
            const focusables = drawerRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video');
            let elementToFocus = drawerRef.current;
            if (focusables.length) {
                for (let i = 0; i < focusables.length; i++) {
                    if (focusables[i].disabled !== true) {
                        elementToFocus = focusables[i];
                        break;
                    }
                }
            }
            elementToFocus.focus();
        }
        componentDidUpdate(prevProps, prevState) {
            this.handleComponentUpdate(prevState);
        }
        componentDidMount() {
            this.startOpenedPrevState = this.props.startOpened;
            this.endOpenedPrevState = this.props.endOpened;
            window.addEventListener(ojdrawerutils.DrawerConstants.stringResize, () => {
                this.resizeHandler();
            });
            if (DrawerLayout_1.defaultProps.startOpened != this.props.startOpened ||
                DrawerLayout_1.defaultProps.endOpened != this.props.endOpened) {
                const stateCopy = Object.assign({}, this.state);
                stateCopy.startOpened = false;
                stateCopy.endOpened = false;
                this.handleComponentUpdate(stateCopy);
            }
        }
        componentWillUnmount() {
            window.removeEventListener(ojdrawerutils.DrawerConstants.stringResize, () => {
                this.resizeHandler();
            });
        }
        handleComponentUpdate(prevState) {
            const firstDrawerToOpen = this.state.lastlyOpenedDrawer === ojdrawerutils.DrawerConstants.stringStart
                ? ojdrawerutils.DrawerConstants.stringEnd
                : ojdrawerutils.DrawerConstants.stringStart;
            this.openOrCloseDrawer(firstDrawerToOpen, prevState);
            this.openOrCloseDrawer(this.state.lastlyOpenedDrawer, prevState);
        }
        openOrCloseDrawer(edge, prevState) {
            const openedStateName = this.edgeToStateOpenedName(edge);
            if (this.isDrawerOpened(edge) != prevState[openedStateName] ||
                this.shouldDrawerChangeDisplayMode(edge) ||
                (this.isDrawerOpened(edge) && prevState[openedStateName])) {
                if (this.isDrawerOpened(edge) != prevState[openedStateName]) {
                    this[this.edgeToPrevStateOpenedName(edge)] = this.isDrawerOpened(edge);
                }
                const displayMode = this.getDrawerResolvedDisplayMode(edge);
                if (displayMode === ojdrawerutils.DrawerConstants.stringReflow) {
                    this.openOrCloseReflowDrawer(edge, prevState);
                }
                else {
                    this.openOrClosePopupDrawer(edge, prevState);
                }
            }
        }
        openOrCloseReflowDrawer(edge, prevState) {
            if (this.isDrawerOpened(edge) === false ||
                this.shouldDrawerChangeDisplayMode(edge) ||
                this.getStateToChangeTo(edge)) {
                this.animateClose(edge).then(() => {
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
                        updatedState.viewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                        this.setState(updatedState);
                    }
                    else {
                        if (!this.wasDrawerOpenedInPrevState(edge)) {
                            this.forceUpdate();
                        }
                    }
                });
            }
            else {
                if (this.isDrawerOpened(edge)) {
                    if (prevState[this.edgeToStateOpenedName(edge)] === false ||
                        prevState[this.edgeToShouldChangeDisplayMode(edge)] ||
                        prevState[this.edgeToDisplayName(edge)] != this.state[this.edgeToDisplayName(edge)]) {
                        this.animateOpen(edge);
                    }
                }
            }
        }
        animateOpen(edge) {
            if (this.getDrawerResolvedDisplayMode(edge) === ojdrawerutils.DrawerConstants.stringReflow) {
                return AnimationUtils.expand(this.getRefToAnimate(edge).current, ojdrawerutils.DrawerUtils.getAnimationOptions('expand', edge));
            }
            else {
                return AnimationUtils.slideIn(this.getRefToAnimate(edge).current, ojdrawerutils.DrawerUtils.getAnimationOptions(ojdrawerutils.DrawerConstants.stringSlideIn, edge));
            }
        }
        animateClose(edge) {
            if (this.getDrawerResolvedDisplayMode(edge) === ojdrawerutils.DrawerConstants.stringReflow) {
                return AnimationUtils.collapse(this.getRefToAnimate(edge).current, ojdrawerutils.DrawerUtils.getAnimationOptions('collapse', edge));
            }
            else {
                return AnimationUtils.slideOut(this.getRefToAnimate(edge).current, ojdrawerutils.DrawerUtils.getAnimationOptions(ojdrawerutils.DrawerConstants.stringSlideOut, edge));
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
            const popupServiceInstance = PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(edge, prevState);
            if (this.isDrawerOpened(edge) === false ||
                this.shouldDrawerChangeDisplayMode(edge) ||
                this.getStateToChangeTo(edge)) {
                if (ZOrderUtils.getStatus($drawerElement) === ZOrderUtils.STATUS.OPEN) {
                    popupServiceInstance.close(popupServiceOptions);
                }
            }
            else if (this.isDrawerOpened(edge)) {
                if ([ZOrderUtils.STATUS.CLOSE, ZOrderUtils.STATUS.UNKNOWN].indexOf(ZOrderUtils.getStatus($drawerElement) > -1)) {
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
            const PSOptions = {};
            const PSoption = PopupService.OPTION;
            PSOptions[PSoption.POPUP] = $drawerElement;
            PSOptions[PSoption.LAUNCHER] = $(document.activeElement);
            PSOptions[PSoption.LAYER_SELECTORS] = ojdrawerutils.DrawerConstants.DrawerLayoutStyleSurrogate;
            PSOptions[PSoption.LAYER_LEVEL] = PopupService.LAYER_LEVEL.TOP_LEVEL;
            PSOptions[PSoption.POSITION] = this.getDrawerPosition(edge);
            const PSEvent = PopupService.EVENT;
            PSOptions[PSoption.EVENTS] = {
                [PSEvent.POPUP_BEFORE_OPEN]: () => this.beforeOpenHandler(edge, PSOptions),
                [PSEvent.POPUP_AFTER_OPEN]: () => this.afterOpenHandler(edge, prevState),
                [PSEvent.POPUP_BEFORE_CLOSE]: () => this.beforeCloseHandler(edge),
                [PSEvent.POPUP_AFTER_CLOSE]: () => this.afterCloseHandler(edge, prevState),
                [PSEvent.POPUP_REFRESH]: () => {
                    $drawerElement.position(this.getDrawerPosition(edge));
                    this.setOverlayDrawersHeight();
                }
            };
            return PSOptions;
        }
        beforeOpenHandler(edge, PSOptions) {
            ojdrawerutils.DrawerUtils.disableBodyOverflow();
            const $drawerElement = PSOptions[PopupService.OPTION.POPUP];
            const position = PSOptions[PopupService.OPTION.POSITION];
            $drawerElement.show();
            $drawerElement.position(position);
            this.setOverlayDrawersHeight();
            return this.animateOpen(edge);
        }
        afterOpenHandler(edge, prevState) {
            ojdrawerutils.DrawerUtils.enableBodyOverflow();
            this.handleFocus(prevState);
            const $drawerElement = $(this.getDrawerRef(edge).current);
            const status = ZOrderUtils.getStatus($drawerElement);
            if (this.drawerResizeHandler === null) {
                this.drawerResizeHandler = this.drawerResizeCallback.bind(this, $drawerElement, edge);
            }
            DomUtils.addResizeListener(this.getDrawerRef(edge).current, this.drawerResizeHandler, 0, true);
            if (status === ZOrderUtils.STATUS.OPEN && !this.isDrawerOpened(edge)) {
                const popupServiceInstance = PopupService.getInstance();
                const popupServiceOptions = this.getPopupServiceOptions(edge, prevState);
                popupServiceInstance.close(popupServiceOptions);
            }
        }
        drawerResizeCallback($drawerElement, edge) {
            $drawerElement.position(this.getDrawerPosition(edge));
        }
        handleFocus(prevState) {
            if (this.state.startOpened && prevState.startOpened !== this.state.startOpened) {
                this.setDrawerFocus(ojdrawerutils.DrawerConstants.stringStart);
            }
            if (this.state.endOpened && prevState.endOpened !== this.state.endOpened) {
                this.setDrawerFocus(ojdrawerutils.DrawerConstants.stringEnd);
            }
        }
        beforeCloseHandler(edge) {
            ojdrawerutils.DrawerUtils.disableBodyOverflow();
            DomUtils.removeResizeListener(this.rootRef.current, this.drawerResizeHandler);
            return this.animateClose(edge);
        }
        afterCloseHandler(edge, prevState) {
            if (this[this.edgeToClosedWithEsc(edge)]) {
                this[this.edgeToClosedWithEsc(edge)] = false;
            }
            ojdrawerutils.DrawerUtils.enableBodyOverflow();
            const $drawerElement = $(this.getDrawerRef(edge).current);
            const status = ZOrderUtils.getStatus($drawerElement);
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
                const updatedState = {};
                updatedState[this.edgeToShouldChangeDisplayMode(edge)] = false;
                updatedState.viewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                this.setState(updatedState);
            }
            else if (status === ZOrderUtils.STATUS.CLOSE && this.isDrawerOpened(edge)) {
                const popupServiceInstance = PopupService.getInstance();
                const popupServiceOptions = this.getPopupServiceOptions(edge, prevState);
                popupServiceInstance.open(popupServiceOptions);
            }
            else if (!this.wasDrawerOpenedInPrevState(edge)) {
                this.forceUpdate();
            }
        }
        getDrawerPosition(edge) {
            const pos = `${edge} top`;
            let position = {
                my: pos,
                at: pos,
                of: this.rootRef.current,
                collision: 'none'
            };
            return oj.PositionUtils.normalizeHorizontalAlignment(position, ojdrawerutils.DrawerUtils.isRTL());
        }
        setOverlayDrawersHeight() {
            const mainContentHeight = ojdrawerutils.DrawerUtils.getElementHeight(this.mainSectionRef.current) + 'px';
            const startDrawerElement = this.startRef.current;
            if (startDrawerElement) {
                startDrawerElement.style.height = mainContentHeight;
            }
            const endDrawerElement = this.endRef.current;
            if (endDrawerElement) {
                endDrawerElement.style.height = mainContentHeight;
            }
        }
    };
    exports.DrawerLayout.defaultProps = {
        startOpened: false,
        endOpened: false,
        startDisplay: 'auto',
        endDisplay: 'auto'
    };
    exports.DrawerLayout.metadata = { "slots": { "": {}, "start": {}, "end": {} }, "properties": { "startOpened": { "type": "boolean", "writeback": true }, "endOpened": { "type": "boolean", "writeback": true }, "startDisplay": { "type": "string", "enumValues": ["reflow", "overlay", "auto"] }, "endDisplay": { "type": "string", "enumValues": ["reflow", "overlay", "auto"] } }, "extension": { "_WRITEBACK_PROPS": ["startOpened", "endOpened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["role"] } };
    exports.DrawerLayout = DrawerLayout_1 = __decorate([
        ojvcomponent.customElement('oj-drawer-layout')
    ], exports.DrawerLayout);

    Object.defineProperty(exports, '__esModule', { value: true });

});
