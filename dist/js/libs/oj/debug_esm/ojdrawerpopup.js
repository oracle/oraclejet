/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef } from 'preact';
import $ from 'jquery';
import { slideIn, slideOut } from 'ojs/ojanimation';
import { addResizeListener, removeResizeListener } from 'ojs/ojdomutils';
import 'ojs/ojcore-base';
import 'ojs/ojpopup';
import { DrawerConstants, DrawerUtils } from 'ojs/ojdrawerutils';
import Hammer from 'hammerjs';

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
var DrawerPopup_1;
const ojet = oj;
const PopupService = oj.PopupService;
const targetElement = window;
const ZOrderUtils = oj.ZOrderUtils;
let DrawerPopup = DrawerPopup_1 = class DrawerPopup extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            opened: this.props.opened,
            viewportResolvedDisplayMode: this.getViewportResolvedDisplayMode(),
            viewportResolvedDisplayModeVertical: this.getViewportResolvedDisplayModeVertical()
        };
        this.rootRef = createRef();
        this.isShiftKeyActive = false;
        this.drawerResizeHandler = null;
        this.windowResizeHandler = null;
        this.handleKeyDown = (event) => {
            if (event.key === DrawerConstants.keys.ESC) {
                this.selfClose();
                return;
            }
            const focusables = DrawerUtils.getFocusables(this.rootRef.current);
            if (event.key === DrawerConstants.keys.TAB && this.props.modality === 'modal') {
                this.isShiftKeyActive = event.shiftKey;
                const { length, 0: firstItem, [length - 1]: lastItem } = focusables;
                if (!length) {
                    event.preventDefault();
                    this.rootRef.current.focus();
                    return;
                }
                if (event.shiftKey) {
                    if (document.activeElement === firstItem) {
                        event.preventDefault();
                        lastItem.focus();
                        return;
                    }
                }
                else {
                    if (document.activeElement === lastItem) {
                        event.preventDefault();
                        firstItem.focus();
                        return;
                    }
                }
            }
        };
        this.autoDismissHandler = (event) => {
            const focusables = DrawerUtils.getFocusables(this.rootRef.current);
            const zorderLayer = this.rootRef.current.parentNode;
            const isTargetWithin = this.isTargetDescendantOfOwnZorderLayerOrItsNextSiblings(zorderLayer, event.target);
            if (this.props.autoDismiss === 'focus-loss') {
                if (event.type === 'focus' && this.props.modality === 'modal' && !isTargetWithin) {
                    event.preventDefault();
                    const elementLosingFocus = event.relatedTarget;
                    const firstFocusableElement = focusables[0];
                    const lastFocusableElement = focusables[focusables.length - 1];
                    if (elementLosingFocus === firstFocusableElement) {
                        lastFocusableElement.focus();
                    }
                    else {
                        firstFocusableElement.focus();
                    }
                    return;
                }
                if (!isTargetWithin) {
                    this.selfClose();
                }
            }
            else if (this.props.autoDismiss === 'none' &&
                this.props.modality === 'modal' &&
                !isTargetWithin) {
                event.preventDefault();
            }
        };
        this.refreshHandler = (edge) => {
            const $drawerElement = $(this.rootRef.current);
            $drawerElement.position(this.getDrawerPosition(edge));
            PopupService.getInstance().triggerOnDescendents($drawerElement, PopupService.EVENT.POPUP_REFRESH);
        };
        this.destroyHandler = () => {
            const $drawerElement = $(this.rootRef.current);
            const status = ZOrderUtils.getStatus($drawerElement);
            if (status === ZOrderUtils.STATUS.OPEN) {
                ZOrderUtils.removeFromAncestorLayer($drawerElement);
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
            if (Object.keys(updatedState).length > 0) {
                this.setState(updatedState);
            }
        };
        this.handleSwipeAction = () => {
            this.selfClose();
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (props.opened !== state.opened) {
            return { opened: props.opened };
        }
        return null;
    }
    render(props) {
        if (this.isDrawerOpened() || this.wasDrawerOpenedInPrevState()) {
            return (jsx(Root, Object.assign({ ref: this.rootRef, class: this.getPopupStyleClasses(this.props.edge), tabIndex: -1, role: this.props.role || 'dialog', onKeyDown: this.handleKeyDown }, { children: jsx("div", Object.assign({ class: "oj-drawer-full-height" }, { children: props.children })) })));
        }
        return jsx(Root, {});
    }
    isDrawerOpened() {
        return this.state[DrawerConstants.stringOpened];
    }
    wasDrawerOpenedInPrevState() {
        return this.openedPrevState;
    }
    selfClose() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ((_b = (_a = this.props).onOjBeforeClose) === null || _b === void 0 ? void 0 : _b.call(_a));
            }
            catch (_) {
                return;
            }
            (_d = (_c = this.props).onOpenedChanged) === null || _d === void 0 ? void 0 : _d.call(_c, false);
        });
    }
    openOrCloseDrawer(prevState) {
        if (this.isDrawerOpened() != prevState.opened) {
            this.openedPrevState = this.isDrawerOpened();
        }
        const $drawerElement = $(this.rootRef.current);
        const popupServiceInstance = PopupService.getInstance();
        const popupServiceOptions = this.getPopupServiceOptions(prevState);
        if (this.isDrawerOpened()) {
            if ([ZOrderUtils.STATUS.CLOSE, ZOrderUtils.STATUS.UNKNOWN].indexOf(ZOrderUtils.getStatus($drawerElement) > -1)) {
                popupServiceInstance.open(popupServiceOptions);
            }
        }
        else {
            if (ZOrderUtils.getStatus($drawerElement) === ZOrderUtils.STATUS.OPEN) {
                popupServiceInstance.close(popupServiceOptions);
            }
        }
    }
    getPopupServiceOptions(prevState) {
        const edge = this.props.edge;
        const $drawerElement = $(this.rootRef.current);
        const PSOptions = {};
        const PSoption = PopupService.OPTION;
        PSOptions[PSoption.POPUP] = $drawerElement;
        PSOptions[PSoption.LAUNCHER] = $(document.activeElement);
        PSOptions[PSoption.MODALITY] = this.props.modality;
        PSOptions[PSoption.LAYER_SELECTORS] = this.getDrawerSurrogateLayerSelectors();
        PSOptions[PSoption.LAYER_LEVEL] = PopupService.LAYER_LEVEL.TOP_LEVEL;
        PSOptions[PSoption.POSITION] = this.getDrawerPosition(edge);
        PSOptions[PSoption.CUSTOM_ELEMENT] = true;
        const PSEvent = PopupService.EVENT;
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
        DrawerUtils.disableBodyOverflow();
        this.drawerOpener = document.activeElement;
        const $drawerElement = PSOptions[PopupService.OPTION.POPUP];
        const position = PSOptions[PopupService.OPTION.POSITION];
        $drawerElement.show();
        $drawerElement.position(position);
        const busyContext = ojet.Context.getContext(this.rootRef.current).getBusyContext();
        const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
        const animationPromise = slideIn(this.rootRef.current, DrawerUtils.getAnimationOptions(DrawerConstants.stringSlideIn, edge));
        animationPromise.then(resolveFunc);
        return animationPromise;
    }
    afterOpenHandler(edge, prevState) {
        DrawerUtils.enableBodyOverflow();
        this.handleFocus(prevState);
        const $drawerElement = $(this.rootRef.current);
        const status = ZOrderUtils.getStatus($drawerElement);
        if (this.drawerResizeHandler === null) {
            this.drawerResizeHandler = this.drawerResizeCallback.bind(this, $drawerElement, edge);
        }
        addResizeListener(this.rootRef.current, this.drawerResizeHandler, 0, true);
        if (status === ZOrderUtils.STATUS.OPEN && !this.isDrawerOpened()) {
            const popupServiceInstance = PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(prevState);
            popupServiceInstance.close(popupServiceOptions);
        }
    }
    drawerResizeCallback($drawerElement, edge) {
        $drawerElement.position(this.getDrawerPosition(edge));
    }
    handleFocus(prevState) {
        if (this.state.opened && prevState.opened !== this.state.opened) {
            const autofocusItems = this.rootRef.current.querySelectorAll('[autofocus]');
            const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
            if (autofocusLength > 0) {
                autofocusFirstItem.focus({ preventScroll: true });
                return;
            }
            const focusables = DrawerUtils.getFocusables(this.rootRef.current);
            let elementToFocus = this.rootRef.current;
            if (focusables.length) {
                elementToFocus = focusables[0];
            }
            elementToFocus.focus({ preventScroll: true });
        }
    }
    beforeCloseHandler(edge) {
        DrawerUtils.disableBodyOverflow();
        this.elementWithFocusBeforeDrawerCloses = document.activeElement;
        removeResizeListener(this.rootRef.current, this.drawerResizeHandler);
        this.drawerResizeHandler = null;
        const busyContext = ojet.Context.getContext(this.rootRef.current).getBusyContext();
        const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
        const animationPromise = slideOut(this.rootRef.current, DrawerUtils.getAnimationOptions(DrawerConstants.stringSlideOut, edge));
        animationPromise.then(resolveFunc);
        return animationPromise;
    }
    afterCloseHandler(prevState) {
        DrawerUtils.enableBodyOverflow();
        const $drawerElement = $(this.rootRef.current);
        const status = ZOrderUtils.getStatus($drawerElement);
        if (this.rootRef.current.contains(this.elementWithFocusBeforeDrawerCloses)) {
            DrawerUtils.moveFocusToElementOrNearestAncestor(this.drawerOpener);
        }
        if (status === ZOrderUtils.STATUS.CLOSE && this.isDrawerOpened()) {
            const popupServiceInstance = PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(prevState);
            popupServiceInstance.open(popupServiceOptions);
        }
        else if (!this.wasDrawerOpenedInPrevState()) {
            this.forceUpdate();
        }
    }
    getDrawerSurrogateLayerSelectors() {
        let surrogateLayerStyles = DrawerConstants.DrawerPopupStyleSurrogate;
        const stringModal = 'modal';
        if (this.props.modality === stringModal) {
            surrogateLayerStyles += ` ${DrawerConstants.stringOjDrawer}${DrawerConstants.charDash}${stringModal}`;
        }
        return surrogateLayerStyles;
    }
    getDrawerPosition(edge) {
        let pos = `${edge} ${edge === 'bottom' ? 'bottom' : 'top'}`;
        let position = {
            my: pos,
            at: pos,
            of: window,
            collision: 'none'
        };
        return oj.PositionUtils.normalizeHorizontalAlignment(position, DrawerUtils.isRTL());
    }
    getPopupStyleClasses(edge) {
        const customStyleClassMap = {};
        if (edge === DrawerConstants.stringBottom) {
            if (this.getViewportResolvedDisplayModeVertical() === DrawerConstants.stringFullOverlay ||
                this.getViewportResolvedDisplayMode() === DrawerConstants.stringFullOverlay) {
                customStyleClassMap[DrawerConstants.styleDisplayMode(DrawerConstants.stringFullOverlay)] =
                    true;
            }
        }
        else {
            if (this.getViewportResolvedDisplayMode() === DrawerConstants.stringFullOverlay) {
                customStyleClassMap[DrawerConstants.styleDisplayMode(DrawerConstants.stringFullOverlay)] =
                    true;
            }
        }
        return DrawerUtils.getStyleClassesMapAsString(Object.assign(customStyleClassMap, DrawerUtils.getCommonStyleClasses(edge)));
    }
    componentDidUpdate(prevProps, prevState) {
        this.handleComponentUpdate(prevState);
    }
    componentDidMount() {
        if (this.windowResizeHandler === null) {
            this.windowResizeHandler = this.windowResizeCallback.bind(this);
        }
        window.addEventListener(DrawerConstants.stringResize, this.windowResizeHandler);
        this.openedPrevState = this.props.opened;
        if (DrawerPopup_1.defaultProps.opened != this.props.opened) {
            const stateCopy = Object.assign({}, this.state);
            stateCopy.opened = false;
            this.handleComponentUpdate(stateCopy);
        }
    }
    componentWillUnmount() {
        window.removeEventListener(DrawerConstants.stringResize, this.windowResizeHandler);
        this.windowResizeHandler = null;
    }
    getViewportResolvedDisplayMode() {
        const viewportWidth = DrawerUtils.getViewportWidth();
        if (viewportWidth >= DrawerConstants.fullWidthDrawerChangeThreshold) {
            return DrawerConstants.stringOverlay;
        }
        return DrawerConstants.stringFullOverlay;
    }
    getViewportResolvedDisplayModeVertical() {
        const viewportHeight = DrawerUtils.getViewportHeight();
        if (viewportHeight >= DrawerConstants.fullHeightDrawerChangeThreshold) {
            return DrawerConstants.stringOverlay;
        }
        return DrawerConstants.stringFullOverlay;
    }
    handleComponentUpdate(prevState) {
        this.openOrCloseDrawer(prevState);
        if (this.isDrawerOpened() && this.props.closeGesture === 'swipe') {
            this.registerCloseWithSwipeListener();
        }
        if (this.isDrawerOpened() === false && prevState.opened) {
            this.unregisterCloseWithSwipeListener();
        }
    }
    registerCloseWithSwipeListener() {
        this.hammerInstance = new Hammer(targetElement);
        if (this.props.edge === DrawerConstants.stringBottom) {
            this.hammerInstance.get('swipe').set({ direction: Hammer.DIRECTION_DOWN });
        }
        this.hammerInstance.on(this.getSwipeCloseDirection(this.props.edge), this.handleSwipeAction);
    }
    getSwipeCloseDirection(edge) {
        const swipeLeft = 'swipeleft';
        const swipeRigth = 'swiperight';
        switch (edge) {
            case DrawerConstants.stringStart: {
                return DrawerUtils.isRTL() ? swipeRigth : swipeLeft;
            }
            case DrawerConstants.stringEnd: {
                return DrawerUtils.isRTL() ? swipeLeft : swipeRigth;
            }
            case DrawerConstants.stringBottom: {
                return 'swipedown';
            }
        }
    }
    unregisterCloseWithSwipeListener() {
        if (this.hammerInstance) {
            this.hammerInstance.off(this.getSwipeCloseDirection(this.props.edge), this.handleSwipeAction);
        }
    }
};
DrawerPopup.defaultProps = {
    autoDismiss: 'focus-loss',
    edge: 'start',
    modality: 'modal',
    opened: false,
    closeGesture: 'swipe'
};
DrawerPopup._metadata = { "slots": { "": {} }, "properties": { "opened": { "type": "boolean", "writeback": true }, "edge": { "type": "string", "enumValues": ["end", "start", "bottom"] }, "modality": { "type": "string", "enumValues": ["modal", "modeless"] }, "autoDismiss": { "type": "string", "enumValues": ["none", "focus-loss"] }, "closeGesture": { "type": "string", "enumValues": ["none", "swipe"] } }, "events": { "ojBeforeClose": { "cancelable": true } }, "extension": { "_WRITEBACK_PROPS": ["opened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["role"] } };
DrawerPopup = DrawerPopup_1 = __decorate([
    customElement('oj-drawer-popup')
], DrawerPopup);

export { DrawerPopup };
