/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsxs, jsx } from 'preact/jsx-runtime';
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef } from 'preact';
import $ from 'jquery';
import { expand, slideIn, collapse, slideOut } from 'ojs/ojanimation';
import { removeResizeListener, addResizeListener } from 'ojs/ojdomutils';
import 'ojs/ojcore-base';
import 'ojs/ojpopup';
import { DrawerConstants, DrawerUtils } from 'ojs/ojdrawerutils';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (null && null.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DrawerLayout_1;
const ojet = oj;
const PopupService = ojet.PopupService;
const ZOrderUtils = ojet.ZOrderUtils;
let DrawerLayout = DrawerLayout_1 = class DrawerLayout extends Component {
    constructor() {
        super(...arguments);
        this.rootRef = createRef();
        this.startWrapperRef = createRef();
        this.startRef = createRef();
        this.endWrapperRef = createRef();
        this.endRef = createRef();
        this.bottomWrapperRef = createRef();
        this.bottomRef = createRef();
        this.middleSectionRef = createRef();
        this.mainSectionRef = createRef();
        this.startClosedWithEsc = false;
        this.endClosedWithEsc = false;
        this.bottomClosedWithEsc = false;
        this.overlayDrawerResizeHandler = null;
        this.reflowDrawerResizeHandler = null;
        this.windowResizeHandler = null;
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
            lastlyOpenedDrawer: DrawerConstants.stringStart
        };
        this.handleKeyDown = (edge, event) => {
            const drawerDisplayMode = this.getDrawerResolvedDisplayMode(edge);
            if (event.key === DrawerConstants.keys.ESC &&
                (drawerDisplayMode === DrawerConstants.stringOverlay ||
                    drawerDisplayMode === DrawerConstants.stringFullOverlay)) {
                this[this.edgeToClosedWithEsc(edge)] = true;
                this.selfClose(edge);
            }
        };
        this.getRefToAnimate = (edge) => {
            return this.getDrawerResolvedDisplayMode(edge) === DrawerConstants.stringReflow
                ? this.getDrawerWrapperRef(edge)
                : this.getDrawerRef(edge);
        };
        this.overlayDrawerResizeCallback = (edge) => {
            const $drawerElement = $(this.getDrawerRef(edge).current);
            $drawerElement.position(this.getDrawerPosition(edge));
        };
        this.reflowDrawerResizeCallback = (edge) => {
            if ([DrawerConstants.stringStart, DrawerConstants.stringEnd].indexOf(edge) > -1) {
                this.setBottomOverlayDrawerWidth();
            }
        };
        this.lockResizeListener = () => {
            if (this.handleResize) {
                this.handleResize = false;
                setTimeout(() => {
                    this.handleResize = true;
                    const updatedState = {};
                    if (this.state.viewportResolvedDisplayMode !== this.getViewportResolvedDisplayMode()) {
                        const updatedState = {};
                        [DrawerConstants.stringStart, DrawerConstants.stringEnd].forEach((edge) => {
                            if (this.isDrawerOpened(edge) && this.state[this.edgeToDisplayName(edge)] === 'auto') {
                                updatedState[this.edgeToShouldChangeDisplayMode(edge)] = true;
                            }
                        });
                    }
                    if (this.state.viewportResolvedDisplayModeVertical !==
                        this.getViewportResolvedDisplayModeVertical()) {
                        if (this.isDrawerOpened(DrawerConstants.stringBottom) &&
                            this.state[this.edgeToDisplayName(DrawerConstants.stringBottom)] === 'auto') {
                            updatedState[this.edgeToShouldChangeDisplayMode(DrawerConstants.stringBottom)] = true;
                        }
                    }
                    if (Object.keys(updatedState).length > 0) {
                        this.setState(updatedState);
                    }
                }, DrawerConstants.animationDuration + 50);
            }
        };
        this.refreshHandler = (edge) => {
            const $drawerElement = $(this.getDrawerRef(edge).current);
            $drawerElement.position(this.getDrawerPosition(edge));
            if ([DrawerConstants.stringStart, DrawerConstants.stringEnd].indexOf(edge) > -1) {
                this.setStartEndOverlayDrawersHeight();
            }
            this.setBottomOverlayDrawerWidth();
            PopupService.getInstance().triggerOnDescendents($drawerElement, PopupService.EVENT.POPUP_REFRESH);
        };
        this.destroyHandler = (edge) => {
            const $drawerElement = $(this.getDrawerRef(edge).current);
            const status = ZOrderUtils.getStatus($drawerElement);
            if (status === ZOrderUtils.STATUS.OPEN) {
                ZOrderUtils.removeFromAncestorLayer($drawerElement);
            }
        };
        this.windowResizeCallback = () => {
            if (this.handleResize) {
                const prevViewportResolvedDisplayMode = this.state.viewportResolvedDisplayMode;
                const nextViewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                const prevViewportResolvedDisplayModeVertical = this.state.viewportResolvedDisplayModeVertical;
                const nextViewportResolvedDisplayModeVertical = this.getViewportResolvedDisplayModeVertical();
                this.setBottomOverlayDrawerWidth();
                let atLeastOneOverlayDrawerNeedsToClose = false;
                const updatedState = {};
                if (prevViewportResolvedDisplayMode !== nextViewportResolvedDisplayMode ||
                    prevViewportResolvedDisplayModeVertical !== nextViewportResolvedDisplayModeVertical) {
                    this.lockResizeListener();
                    [DrawerConstants.stringStart, DrawerConstants.stringEnd].forEach((edge) => {
                        if (this.isDrawerOpened(edge) && this.state[this.edgeToDisplayName(edge)] === 'auto') {
                            atLeastOneOverlayDrawerNeedsToClose = true;
                            updatedState[this.edgeToShouldChangeDisplayMode(edge)] = true;
                        }
                    });
                    if (this.isDrawerOpened(DrawerConstants.stringBottom) &&
                        this.state[this.edgeToDisplayName(DrawerConstants.stringBottom)] === 'auto') {
                        atLeastOneOverlayDrawerNeedsToClose = true;
                        updatedState[this.edgeToShouldChangeDisplayMode(DrawerConstants.stringBottom)] = true;
                    }
                    if (atLeastOneOverlayDrawerNeedsToClose === false) {
                        updatedState.viewportResolvedDisplayMode = nextViewportResolvedDisplayMode;
                        updatedState.viewportResolvedDisplayModeVertical =
                            nextViewportResolvedDisplayModeVertical;
                    }
                }
                if (Object.keys(updatedState).length > 0) {
                    this.setState(updatedState);
                }
            }
        };
        this.getDrawerPosition = (edge) => {
            const horizontal = edge === DrawerConstants.stringBottom ? DrawerConstants.stringStart : edge;
            const vertical = edge === DrawerConstants.stringBottom
                ? DrawerConstants.stringBottom
                : DrawerConstants.stringTop;
            const pos = `${horizontal} ${vertical}`;
            let position = {
                my: pos,
                at: pos,
                of: this.mainSectionRef.current,
                collision: 'none'
            };
            return oj.PositionUtils.normalizeHorizontalAlignment(position, DrawerUtils.isRTL());
        };
    }
    static getDerivedStateFromProps(props, state) {
        const derivedState = {};
        if (state.startOpened) {
            if (props.startDisplay !== state.startDisplay) {
                derivedState[`${DrawerConstants.stringStart}${DrawerConstants.stringStateToChangeTo}`] = {
                    startDisplay: props.startDisplay
                };
                return derivedState;
            }
        }
        if (state.endOpened) {
            if (props.endDisplay !== state.endDisplay) {
                derivedState[`${DrawerConstants.stringEnd}${DrawerConstants.stringStateToChangeTo}`] = {
                    endDisplay: props.endDisplay
                };
                return derivedState;
            }
        }
        if (state.bottomOpened) {
            if (props.bottomDisplay !== state.bottomDisplay) {
                derivedState[`${DrawerConstants.stringBottom}${DrawerConstants.stringStateToChangeTo}`] = {
                    bottomDisplay: props.bottomDisplay
                };
                return derivedState;
            }
        }
        if (props.startOpened !== state.startOpened) {
            derivedState.startOpened = props.startOpened;
            if (props.startOpened) {
                derivedState.lastlyOpenedDrawer = DrawerConstants.stringStart;
            }
        }
        if (props.endOpened !== state.endOpened) {
            derivedState.endOpened = props.endOpened;
            if (props.endOpened) {
                derivedState.lastlyOpenedDrawer = DrawerConstants.stringEnd;
            }
        }
        if (props.bottomOpened !== state.bottomOpened) {
            derivedState.bottomOpened = props.bottomOpened;
            if (props.bottomOpened) {
                derivedState.lastlyOpenedDrawer = DrawerConstants.stringBottom;
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
        let startDrawer = this.getDrawer(DrawerConstants.stringStart);
        let endDrawer = this.getDrawer(DrawerConstants.stringEnd);
        let bottomDrawer = this.getDrawer(DrawerConstants.stringBottom);
        return (jsxs(Root, Object.assign({ ref: this.rootRef }, { children: [startDrawer, jsxs("div", Object.assign({ ref: this.middleSectionRef, class: DrawerConstants.middleSectionSelector }, { children: [jsx("div", Object.assign({ ref: this.mainSectionRef, class: DrawerConstants.mainContentSelector }, { children: props.children })), bottomDrawer] })), endDrawer] })));
    }
    getDrawer(edge) {
        const resolvedMode = this.getDrawerResolvedDisplayMode(edge);
        const isOverlay = resolvedMode === DrawerConstants.stringOverlay ||
            resolvedMode === DrawerConstants.stringFullOverlay;
        const roleAttr = this.props.role || (isOverlay ? 'dialog' : undefined);
        const tabIndexAttr = isOverlay ? -1 : undefined;
        if (this.isDrawerOpened(edge) ||
            this.wasDrawerOpenedInPrevState(edge) ||
            this.wasDrawerClosedWithEsc(edge)) {
            return (jsx("div", Object.assign({ ref: this.getDrawerWrapperRef(edge), class: this.getDrawerWrapperStyleClasses(edge) }, { children: jsx("div", Object.assign({ ref: this.getDrawerRef(edge), role: roleAttr, tabIndex: tabIndexAttr, class: this.getDrawerStyleClasses(edge), onKeyDown: (event) => this.handleKeyDown(edge, event) }, { children: this.getDrawerContent(edge) })) })));
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
            case DrawerConstants.stringStart:
                return this.startWrapperRef;
            case DrawerConstants.stringEnd:
                return this.endWrapperRef;
            case DrawerConstants.stringBottom:
                return this.bottomWrapperRef;
        }
    }
    getDrawerRef(edge) {
        switch (edge) {
            case DrawerConstants.stringStart:
                return this.startRef;
            case DrawerConstants.stringEnd:
                return this.endRef;
            case DrawerConstants.stringBottom:
                return this.bottomRef;
        }
    }
    getDrawerContent(edge) {
        switch (edge) {
            case DrawerConstants.stringStart:
                return this.props.start;
            case DrawerConstants.stringEnd:
                return this.props.end;
            case DrawerConstants.stringBottom:
                return this.props.bottom;
        }
    }
    getDrawerWrapperStyleClasses(edge) {
        return (`${DrawerConstants.stringOjDrawer}${DrawerConstants.charDash}${DrawerConstants.stringReflow}-wrapper` +
            ' ' +
            this.getDrawerStyleClasses(edge));
    }
    getDrawerStyleClasses(edge) {
        let customStyleClassMap;
        const displayMode = this.getDrawerResolvedDisplayMode(edge);
        switch (displayMode) {
            case DrawerConstants.stringReflow: {
                customStyleClassMap = {
                    [DrawerConstants.styleDisplayMode(DrawerConstants.stringReflow)]: true
                };
                break;
            }
            case DrawerConstants.stringOverlay: {
                customStyleClassMap = {
                    [DrawerConstants.styleDisplayMode(DrawerConstants.stringOverlay)]: true
                };
                break;
            }
            case DrawerConstants.stringFullOverlay: {
                customStyleClassMap = {
                    [DrawerConstants.styleDisplayMode(DrawerConstants.stringOverlay)]: true,
                    [DrawerConstants.styleDisplayMode(DrawerConstants.stringFullOverlay)]: true
                };
                break;
            }
        }
        return DrawerUtils.getStyleClassesMapAsString(Object.assign(customStyleClassMap, DrawerUtils.getCommonStyleClasses(edge)));
    }
    getDrawerResolvedDisplayMode(edge) {
        const edgeDisplay = this.edgeToDisplayName(edge);
        if (this.state[edgeDisplay] === 'auto') {
            if (edge === DrawerConstants.stringBottom) {
                if (this.state.viewportResolvedDisplayModeVertical === DrawerConstants.stringFullOverlay ||
                    this.state.viewportResolvedDisplayMode === DrawerConstants.stringFullOverlay) {
                    return DrawerConstants.stringFullOverlay;
                }
                if (this.state.viewportResolvedDisplayModeVertical === DrawerConstants.stringOverlay ||
                    this.state.viewportResolvedDisplayMode === DrawerConstants.stringOverlay) {
                    return DrawerConstants.stringOverlay;
                }
                return DrawerConstants.stringReflow;
            }
            return this.state.viewportResolvedDisplayMode;
        }
        if (this.state[edgeDisplay] === DrawerConstants.stringReflow) {
            return DrawerConstants.stringReflow;
        }
        if (this.state[edgeDisplay] === DrawerConstants.stringOverlay) {
            const axisDisplayMode = edge === DrawerConstants.stringBottom
                ? this.state.viewportResolvedDisplayModeVertical
                : this.state.viewportResolvedDisplayMode;
            return axisDisplayMode === DrawerConstants.stringFullOverlay
                ? DrawerConstants.stringFullOverlay
                : DrawerConstants.stringOverlay;
        }
    }
    getViewportResolvedDisplayMode() {
        const viewportWidth = DrawerUtils.getViewportWidth();
        if (viewportWidth >= DrawerConstants.displayTypeChangeThreshold) {
            return DrawerConstants.stringReflow;
        }
        else if (viewportWidth < DrawerConstants.displayTypeChangeThreshold &&
            viewportWidth >= DrawerConstants.fullWidthDrawerChangeThreshold) {
            return DrawerConstants.stringOverlay;
        }
        return DrawerConstants.stringFullOverlay;
    }
    getViewportResolvedDisplayModeVertical() {
        const viewportHeight = DrawerUtils.getViewportHeight();
        if (viewportHeight >= DrawerConstants.fullHeightDrawerChangeThreshold) {
            return DrawerConstants.stringReflow;
        }
        return DrawerConstants.stringFullOverlay;
    }
    selfClose(edge) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ((_b = (_a = this.props).onOjBeforeClose) === null || _b === void 0 ? void 0 : _b.call(_a, { edge }));
            }
            catch (_) {
                return;
            }
            if (edge === DrawerConstants.stringStart) {
                (_d = (_c = this.props).onStartOpenedChanged) === null || _d === void 0 ? void 0 : _d.call(_c, false);
            }
            if (edge === DrawerConstants.stringEnd) {
                (_f = (_e = this.props).onEndOpenedChanged) === null || _f === void 0 ? void 0 : _f.call(_e, false);
            }
            if (edge === DrawerConstants.stringBottom) {
                (_h = (_g = this.props).onBottomOpenedChanged) === null || _h === void 0 ? void 0 : _h.call(_g, false);
            }
        });
    }
    setDrawerFocus(edge) {
        const drawerRef = this.getDrawerRef(edge);
        const autofocusItems = drawerRef.current.querySelectorAll('[autofocus]');
        const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
        if (autofocusLength > 0) {
            autofocusFirstItem.focus({ preventScroll: true });
            return;
        }
        const focusables = DrawerUtils.getFocusables(drawerRef.current);
        let elementToFocus = drawerRef.current;
        if (focusables.length) {
            elementToFocus = focusables[0];
        }
        elementToFocus.focus({ preventScroll: true });
    }
    componentDidUpdate(prevProps, prevState) {
        this.handleComponentUpdate(prevState);
    }
    componentDidMount() {
        this.startOpenedPrevState = this.props.startOpened;
        this.endOpenedPrevState = this.props.endOpened;
        this.bottomOpenedPrevState = this.props.bottomOpened;
        if (this.windowResizeHandler === null) {
            this.windowResizeHandler = this.windowResizeCallback.bind(this);
        }
        window.addEventListener(DrawerConstants.stringResize, this.windowResizeHandler);
        if (DrawerLayout_1.defaultProps.startOpened != this.props.startOpened ||
            DrawerLayout_1.defaultProps.endOpened != this.props.endOpened ||
            DrawerLayout_1.defaultProps.bottomOpened != this.props.bottomOpened) {
            const stateCopy = Object.assign({}, this.state);
            stateCopy.startOpened = false;
            stateCopy.endOpened = false;
            stateCopy.bottomOpened = false;
            this.handleComponentUpdate(stateCopy);
        }
    }
    componentWillUnmount() {
        window.removeEventListener(DrawerConstants.stringResize, this.windowResizeHandler);
        this.windowResizeHandler = null;
    }
    handleComponentUpdate(prevState) {
        let sides = [
            DrawerConstants.stringStart,
            DrawerConstants.stringEnd,
            DrawerConstants.stringBottom
        ];
        sides = sides.filter((side) => side != this.state.lastlyOpenedDrawer);
        this.openOrCloseDrawer(sides[0], prevState);
        this.openOrCloseDrawer(sides[1], prevState);
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
            if (displayMode === DrawerConstants.stringReflow) {
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
            this.elementWithFocusBeforeDrawerCloses = document.activeElement;
            this.animateClose(edge)
                .then(() => {
                removeResizeListener(this.getDrawerRef(edge).current, this.reflowDrawerResizeHandler);
                this.reflowDrawerResizeHandler === null;
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
                    updatedState.viewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                    updatedState.viewportResolvedDisplayModeVertical =
                        this.getViewportResolvedDisplayModeVertical();
                    this.setState(updatedState);
                }
                else {
                    if (!this.wasDrawerOpenedInPrevState(edge)) {
                        this.addHiddenStyle(edge);
                        this.forceUpdate();
                        setTimeout(() => {
                            this.setBottomOverlayDrawerWidth();
                        }, 0);
                    }
                }
            })
                .then(() => {
                this.setBottomOverlayDrawerWidth();
            });
        }
        else {
            if (this.isDrawerOpened(edge)) {
                if (prevState[this.edgeToStateOpenedName(edge)] === false ||
                    prevState[this.edgeToShouldChangeDisplayMode(edge)] ||
                    prevState[this.edgeToDisplayName(edge)] != this.state[this.edgeToDisplayName(edge)]) {
                    if (!prevState[this.edgeToShouldChangeDisplayMode(edge)]) {
                        this.drawerOpener = document.activeElement;
                    }
                    this.removeHiddenStyle(edge);
                    this.animateOpen(edge).then(() => {
                        this.setBottomOverlayDrawerWidth();
                        if (this.reflowDrawerResizeHandler === null) {
                            this.reflowDrawerResizeHandler = this.reflowDrawerResizeCallback.bind(this, edge);
                        }
                        addResizeListener(this.getDrawerRef(edge).current, this.reflowDrawerResizeHandler, 50, true);
                    });
                }
            }
        }
    }
    removeHiddenStyle(edge) {
        var _a;
        (_a = this.getDrawerWrapperRef(edge).current) === null || _a === void 0 ? void 0 : _a.classList.remove(DrawerConstants.styleDrawerHidden);
    }
    addHiddenStyle(edge) {
        this.getDrawerWrapperRef(edge).current.classList.add(DrawerConstants.styleDrawerHidden);
    }
    returnFocus(edge) {
        const drawerElem = this.getDrawerRef(edge).current;
        if (drawerElem && drawerElem.contains(this.elementWithFocusBeforeDrawerCloses)) {
            DrawerUtils.moveFocusToElementOrNearestAncestor(this.drawerOpener);
        }
    }
    animateOpen(edge) {
        if (this.getDrawerResolvedDisplayMode(edge) === DrawerConstants.stringReflow) {
            return expand(this.getRefToAnimate(edge).current, DrawerUtils.getAnimationOptions('expand', edge));
        }
        else {
            return slideIn(this.getRefToAnimate(edge).current, DrawerUtils.getAnimationOptions(DrawerConstants.stringSlideIn, edge));
        }
    }
    animateClose(edge) {
        if (this.getDrawerResolvedDisplayMode(edge) === DrawerConstants.stringReflow) {
            return collapse(this.getRefToAnimate(edge).current, DrawerUtils.getAnimationOptions('collapse', edge));
        }
        else {
            return slideOut(this.getRefToAnimate(edge).current, DrawerUtils.getAnimationOptions(DrawerConstants.stringSlideOut, edge));
        }
    }
    edgeToStateOpenedName(edge) {
        return `${edge}${DrawerUtils.capitalizeFirstChar(DrawerConstants.stringOpened)}`;
    }
    edgeToPrevStateOpenedName(edge) {
        return `${edge}${DrawerUtils.capitalizeFirstChar(DrawerConstants.stringOpened)}${DrawerConstants.stringPrevState}`;
    }
    edgeToShouldChangeDisplayMode(edge) {
        return `${edge}${DrawerConstants.stringShouldChangeDisplayMode}`;
    }
    edgeToClosedWithEsc(edge) {
        return `${edge}${DrawerConstants.stringClosedWithEsc}`;
    }
    edgeToDisplayName(edge) {
        return `${edge}${DrawerConstants.stringDisplay}`;
    }
    edgeToStateToChangeTo(edge) {
        return `${edge}${DrawerConstants.stringStateToChangeTo}`;
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
        const PSOptions = {};
        const PSoption = PopupService.OPTION;
        PSOptions[PSoption.POPUP] = $drawerElement;
        PSOptions[PSoption.LAUNCHER] = $(document.activeElement);
        PSOptions[PSoption.LAYER_SELECTORS] = DrawerConstants.DrawerLayoutStyleSurrogate;
        PSOptions[PSoption.LAYER_LEVEL] = PopupService.LAYER_LEVEL.TOP_LEVEL;
        PSOptions[PSoption.POSITION] = this.getDrawerPosition(edge);
        PSOptions[PSoption.CUSTOM_ELEMENT] = true;
        const PSEvent = PopupService.EVENT;
        PSOptions[PSoption.EVENTS] = {
            [PSEvent.POPUP_BEFORE_OPEN]: () => this.beforeOpenHandler(edge, prevState, PSOptions),
            [PSEvent.POPUP_AFTER_OPEN]: () => this.afterOpenHandler(edge, prevState),
            [PSEvent.POPUP_BEFORE_CLOSE]: () => this.beforeCloseHandler(edge),
            [PSEvent.POPUP_AFTER_CLOSE]: () => this.afterCloseHandler(edge, prevState),
            [PSEvent.POPUP_REFRESH]: () => this.refreshHandler(edge),
            [PSEvent.POPUP_REMOVE]: () => this.destroyHandler(edge)
        };
        return PSOptions;
    }
    beforeOpenHandler(edge, prevState, PSOptions) {
        DrawerUtils.disableBodyOverflow();
        if (!prevState[this.edgeToShouldChangeDisplayMode(edge)]) {
            this.drawerOpener = document.activeElement;
        }
        const $drawerElement = PSOptions[PopupService.OPTION.POPUP];
        const position = PSOptions[PopupService.OPTION.POSITION];
        if (edge === DrawerConstants.stringBottom) {
            this.setBottomOverlayDrawerWidth();
        }
        $drawerElement.show();
        $drawerElement.position(position);
        this.setStartEndOverlayDrawersHeight();
        return this.animateOpen(edge);
    }
    setBottomOverlayDrawerWidth() {
        if (this.isDrawerOpened(DrawerConstants.stringBottom) &&
            this.getDrawerResolvedDisplayMode(DrawerConstants.stringBottom) !=
                DrawerConstants.stringReflow) {
            const width = this.middleSectionRef.current.getBoundingClientRect().width;
            this.bottomRef.current.style.width = `${width}px`;
        }
    }
    afterOpenHandler(edge, prevState) {
        DrawerUtils.enableBodyOverflow();
        this.handleFocus(prevState);
        const $drawerElement = $(this.getDrawerRef(edge).current);
        const status = ZOrderUtils.getStatus($drawerElement);
        if (this.overlayDrawerResizeHandler === null) {
            this.overlayDrawerResizeHandler = this.overlayDrawerResizeCallback.bind(this, edge);
        }
        addResizeListener(this.getDrawerRef(edge).current, this.overlayDrawerResizeHandler, 50, true);
        if (status === ZOrderUtils.STATUS.OPEN && !this.isDrawerOpened(edge)) {
            const popupServiceInstance = PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(edge, prevState);
            popupServiceInstance.close(popupServiceOptions);
        }
    }
    handleFocus(prevState) {
        if (this.state.startOpened && prevState.startOpened !== this.state.startOpened) {
            this.setDrawerFocus(DrawerConstants.stringStart);
        }
        if (this.state.endOpened && prevState.endOpened !== this.state.endOpened) {
            this.setDrawerFocus(DrawerConstants.stringEnd);
        }
        if (this.state.bottomOpened && prevState.bottomOpened !== this.state.bottomOpened) {
            this.setDrawerFocus(DrawerConstants.stringBottom);
        }
    }
    beforeCloseHandler(edge) {
        DrawerUtils.disableBodyOverflow();
        this.elementWithFocusBeforeDrawerCloses = document.activeElement;
        removeResizeListener(this.getDrawerRef(edge).current, this.overlayDrawerResizeHandler);
        this.overlayDrawerResizeHandler === null;
        return this.animateClose(edge);
    }
    afterCloseHandler(edge, prevState) {
        if (this[this.edgeToClosedWithEsc(edge)]) {
            this[this.edgeToClosedWithEsc(edge)] = false;
        }
        DrawerUtils.enableBodyOverflow();
        this.returnFocus(edge);
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
            updatedState.viewportResolvedDisplayModeVertical =
                this.getViewportResolvedDisplayModeVertical();
            this.setState(updatedState);
        }
        else if (status === ZOrderUtils.STATUS.CLOSE && this.isDrawerOpened(edge)) {
            const popupServiceInstance = PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(edge, prevState);
            popupServiceInstance.open(popupServiceOptions);
        }
        else if (!this.wasDrawerOpenedInPrevState(edge)) {
            this.addHiddenStyle(edge);
            this.forceUpdate();
        }
    }
    setStartEndOverlayDrawersHeight() {
        const middleSectionHeight = DrawerUtils.getElementHeight(this.middleSectionRef.current) + 'px';
        const startDrawerElement = this.startRef.current;
        if (startDrawerElement) {
            startDrawerElement.style.height = middleSectionHeight;
        }
        const endDrawerElement = this.endRef.current;
        if (endDrawerElement) {
            endDrawerElement.style.height = middleSectionHeight;
        }
    }
};
DrawerLayout.defaultProps = {
    startOpened: false,
    endOpened: false,
    bottomOpened: false,
    startDisplay: 'auto',
    endDisplay: 'auto',
    bottomDisplay: 'auto'
};
DrawerLayout._metadata = { "slots": { "": {}, "start": {}, "end": {}, "bottom": {} }, "properties": { "startOpened": { "type": "boolean", "writeback": true }, "endOpened": { "type": "boolean", "writeback": true }, "bottomOpened": { "type": "boolean", "writeback": true }, "startDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] }, "endDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] }, "bottomDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] } }, "events": { "ojBeforeClose": { "cancelable": true } }, "extension": { "_WRITEBACK_PROPS": ["startOpened", "endOpened", "bottomOpened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["role"] } };
DrawerLayout = DrawerLayout_1 = __decorate([
    customElement('oj-drawer-layout')
], DrawerLayout);

export { DrawerLayout };
