/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef, h } from 'preact';
import $ from 'jquery';
import { slideIn } from 'ojs/ojanimation';
import 'ojs/ojcore-base';
import 'ojs/ojpopup';
import { DrawerConstants, DrawerUtils } from 'ojs/ojdrawerutils';

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
let DrawerLayout = DrawerLayout_1 = class DrawerLayout extends Component {
    constructor() {
        super(...arguments);
        this.rootRef = createRef();
        this.startRef = createRef();
        this.endRef = createRef();
        this.mainSectionRef = createRef();
        this.state = {
            startOpened: this.props.startOpened,
            endOpened: this.props.endOpened,
            startDisplay: this.props.startDisplay,
            endDisplay: this.props.endDisplay,
            viewportResolvedDisplayMode: this.getResolvedViewportDisplayMode(),
            startSelfClosed: false,
            endSelfClosed: false,
            lastlyOpenedDrawer: DrawerConstants.stringStart
        };
        this.handleKeyDown = (edge, event) => {
            var _a, _b;
            const drawerDisplayMode = this.getResolvedDrawerDisplayMode(edge);
            if (event.key === DrawerConstants.keys.ESC &&
                (drawerDisplayMode === DrawerConstants.stringOverlay ||
                    drawerDisplayMode === DrawerConstants.stringFullOverlay)) {
                const updatedState = {};
                updatedState[`${edge}Opened`] = false;
                updatedState[`${edge}SelfClosed`] = true;
                this.setState(updatedState);
                (_b = (_a = this.props)[`on${DrawerUtils.capitalizeFirstChar(edge)}OpenedChanged`]) === null || _b === void 0 ? void 0 : _b.call(_a, false);
            }
        };
        this.resizeHandler = () => {
            const resolvedViewportDisplayMode = this.getResolvedViewportDisplayMode();
            if (this.state.viewportResolvedDisplayMode != resolvedViewportDisplayMode) {
                this.setState({ viewportResolvedDisplayMode: resolvedViewportDisplayMode });
            }
        };
    }
    static getDerivedStateFromProps(props, state) {
        const derivedState = {};
        if (state.startSelfClosed === false) {
            if (props.startOpened !== state.startOpened) {
                derivedState.startOpened = props.startOpened;
                if (props.startOpened) {
                    derivedState.lastlyOpenedDrawer = DrawerConstants.stringStart;
                }
            }
        }
        if (state.startOpened === false) {
            derivedState.startSelfClosed = false;
        }
        if (state.endSelfClosed === false) {
            if (props.endOpened !== state.endOpened) {
                derivedState.endOpened = props.endOpened;
                if (props.endOpened) {
                    derivedState.lastlyOpenedDrawer = DrawerConstants.stringEnd;
                }
            }
        }
        if (state.endOpened === false) {
            derivedState.endSelfClosed = false;
        }
        if (props.startDisplay !== state.startDisplay) {
            derivedState.startDisplay = props.startDisplay;
        }
        if (props.endDisplay !== state.endDisplay) {
            derivedState.endDisplay = props.endDisplay;
        }
        return derivedState;
    }
    render(props) {
        let startDrawer = this.getDrawer(DrawerConstants.stringStart);
        let endDrawer = this.getDrawer(DrawerConstants.stringEnd);
        return (h(Root, { ref: this.rootRef },
            startDrawer,
            h("div", { ref: this.mainSectionRef, class: DrawerConstants.mainContentSelector }, props.children),
            endDrawer));
    }
    getDrawer(edge) {
        if (this.isDrawerOpened(edge)) {
            const resolvedMode = this.getResolvedDrawerDisplayMode(edge);
            const isOverlay = resolvedMode === DrawerConstants.stringOverlay ||
                resolvedMode === DrawerConstants.stringFullOverlay;
            const roleAttr = this.props.role || (isOverlay && 'dialog');
            const tabIndexAttr = isOverlay ? -1 : undefined;
            return (h("div", { ref: this.getDrawerRef(edge), key: this.getResolvedDrawerDisplayMode(edge), role: roleAttr, tabIndex: tabIndexAttr, class: this.getDrawerStyleClasses(edge), onKeyDown: (event) => this.handleKeyDown(edge, event) }, this.getDrawerContent(edge)));
        }
        return null;
    }
    getDrawerRef(edge) {
        return edge === DrawerConstants.stringStart ? this.startRef : this.endRef;
    }
    getDrawerContent(edge) {
        return edge === DrawerConstants.stringStart ? this.props.start : this.props.end;
    }
    getDrawerStyleClasses(edge) {
        let customStyleClassMap;
        const displayMode = this.getResolvedDrawerDisplayMode(edge);
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
        return DrawerUtils.getStyleClassesMapAsString(Object.assign(customStyleClassMap, DrawerUtils.getCommonStyleClasses(edge, this.isDrawerOpened(edge))));
    }
    getResolvedDrawerDisplayMode(edge) {
        const edgeDisplay = edge + 'Display';
        if (this.props[edgeDisplay] === 'auto') {
            return this.state.viewportResolvedDisplayMode;
        }
        if (this.props[edgeDisplay] === DrawerConstants.stringReflow) {
            return DrawerConstants.stringReflow;
        }
        if (this.props[edgeDisplay] === DrawerConstants.stringOverlay) {
            return this.state.viewportResolvedDisplayMode === DrawerConstants.stringFullOverlay
                ? DrawerConstants.stringFullOverlay
                : DrawerConstants.stringOverlay;
        }
    }
    getResolvedViewportDisplayMode() {
        const viewportWidth = this.getViewportWidth();
        if (viewportWidth >= DrawerConstants.displayTypeChangeThreshold) {
            return DrawerConstants.stringReflow;
        }
        else if (viewportWidth < DrawerConstants.displayTypeChangeThreshold &&
            viewportWidth >= DrawerConstants.fullWidthDrawerChangeThreshold) {
            return DrawerConstants.stringOverlay;
        }
        return DrawerConstants.stringFullOverlay;
    }
    getViewportWidth() {
        return window.innerWidth;
    }
    handleFocus(prevState) {
        if (this.state.startOpened && prevState.startOpened !== this.state.startOpened) {
            this.setDrawerFocus(DrawerConstants.stringStart);
        }
        if (this.state.endOpened && prevState.endOpened !== this.state.endOpened) {
            this.setDrawerFocus(DrawerConstants.stringEnd);
        }
    }
    setDrawerFocus(edge) {
        const edgeRef = this.getDrawerRef(edge);
        const autofocusItems = edgeRef.current.querySelectorAll('[autofocus]');
        const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
        if (autofocusLength > 0) {
            autofocusFirstItem.focus();
            return;
        }
        const focusableItems = edgeRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video');
        const { length: focusableLength, 0: focusableFirstItem } = focusableItems;
        const firstFocusableElem = focusableLength > 0 ? focusableFirstItem : edgeRef.current;
        firstFocusableElem.focus();
    }
    componentDidUpdate(prevProps, prevState) {
        this.handleComponentUpdate(prevState);
    }
    componentDidMount() {
        window.addEventListener('resize', () => {
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
        window.removeEventListener('resize', () => {
            this.resizeHandler();
        });
    }
    handleComponentUpdate(prevState) {
        const firstDrawerToOpen = this.state.lastlyOpenedDrawer === DrawerConstants.stringStart
            ? DrawerConstants.stringEnd
            : DrawerConstants.stringStart;
        this.openDrawerIfNeeded(firstDrawerToOpen, prevState);
        this.openDrawerIfNeeded(this.state.lastlyOpenedDrawer, prevState);
    }
    openDrawerIfNeeded(edge, prevState) {
        const stateName = this.edgeToStateOpenedName(edge);
        if (this.isDrawerOpened(edge)) {
            const displayMode = this.getResolvedDrawerDisplayMode(edge);
            if (displayMode === DrawerConstants.stringReflow) {
                if (this.state[stateName] != prevState[stateName]) {
                    this.animateSlideIn(edge);
                }
            }
            else {
                this.openOverlayDrawer(edge, prevState);
            }
        }
    }
    edgeToStateOpenedName(edge) {
        return `${edge}${DrawerUtils.capitalizeFirstChar(DrawerConstants.stringOpened)}`;
    }
    openOverlayDrawer(edge, prevState) {
        let drawerExists = false;
        Array.from(document.querySelectorAll(`.${DrawerConstants.DrawerLayoutStyleSurrogate}`)).forEach((surrogate) => {
            if (surrogate.querySelectorAll(`.${DrawerConstants.stringOjDrawer}${DrawerConstants.charDash}${edge}`).length > 0) {
                drawerExists = true;
            }
        });
        const drawerEl = this.getDrawerRef(edge).current;
        if (drawerExists === false && ZOrderUtils.getStatus(drawerEl) === ZOrderUtils.STATUS.OPEN) {
            ZOrderUtils.setStatus($(drawerEl), ZOrderUtils.STATUS.CLOSE);
        }
        const popupServiceInstance = PopupService.getInstance();
        const drawerElement = this.getDrawerRef(edge).current;
        if (drawerElement) {
            const $drawerElement = $(drawerElement);
            const PSOptions = {};
            const PSoption = PopupService.OPTION;
            PSOptions[PSoption.POPUP] = $drawerElement;
            PSOptions[PSoption.LAUNCHER] = $(document.activeElement);
            PSOptions[PSoption.LAYER_SELECTORS] = DrawerConstants.DrawerLayoutStyleSurrogate;
            PSOptions[PSoption.POSITION] = this.getDrawerPosition(edge);
            const PSEvent = PopupService.EVENT;
            PSOptions[PSoption.EVENTS] = {
                [PSEvent.POPUP_BEFORE_OPEN]: () => this.beforeOpenHandler(edge, PSOptions, prevState),
                [PSEvent.POPUP_AFTER_OPEN]: () => this.handleFocus(prevState),
                [PSEvent.POPUP_REFRESH]: () => {
                    $drawerElement.position(this.getDrawerPosition(edge));
                    this.setOverlayDrawersHeight();
                }
            };
            popupServiceInstance.open(PSOptions);
        }
    }
    beforeOpenHandler(edge, PSOptions, prevState) {
        const $drawerElement = PSOptions[PopupService.OPTION.POPUP];
        const position = PSOptions[PopupService.OPTION.POSITION];
        $drawerElement.show();
        $drawerElement.position(position);
        this.setOverlayDrawersHeight();
        const stateName = this.edgeToStateOpenedName(edge);
        if (this.state[stateName] != prevState[stateName]) {
            return this.animateSlideIn(edge);
        }
        return;
    }
    getDrawerPosition(edge) {
        const pos = `${edge} top`;
        let position = {
            my: pos,
            at: pos,
            of: this.rootRef.current,
            collision: 'none'
        };
        return oj.PositionUtils.normalizeHorizontalAlignment(position, DrawerUtils.isRTL());
    }
    animateSlideIn(edge) {
        return slideIn(this.getDrawerRef(edge).current, DrawerUtils.getAnimationOptions(DrawerConstants.stringOpen, edge));
    }
    setOverlayDrawersHeight() {
        const mainContentHeight = DrawerUtils.getElementHeight(this.mainSectionRef.current) + 'px';
        const startDrawerElement = this.startRef.current;
        if (startDrawerElement) {
            startDrawerElement.style.height = mainContentHeight;
        }
        const endDrawerElement = this.endRef.current;
        if (endDrawerElement) {
            endDrawerElement.style.height = mainContentHeight;
        }
    }
    isDrawerOpened(edge) {
        return this.state[this.edgeToStateOpenedName(edge)];
    }
};
DrawerLayout.defaultProps = {
    startOpened: false,
    endOpened: false,
    startDisplay: 'auto',
    endDisplay: 'auto'
};
DrawerLayout.metadata = { "slots": { "": {}, "start": {}, "end": {} }, "properties": { "startOpened": { "type": "boolean", "writeback": true }, "endOpened": { "type": "boolean", "writeback": true }, "startDisplay": { "type": "string", "enumValues": ["reflow", "overlay", "auto"] }, "endDisplay": { "type": "string", "enumValues": ["reflow", "overlay", "auto"] } }, "extension": { "_WRITEBACK_PROPS": ["startOpened", "endOpened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["role"] } };
DrawerLayout = DrawerLayout_1 = __decorate([
    customElement('oj-drawer-layout')
], DrawerLayout);

export { DrawerLayout };
