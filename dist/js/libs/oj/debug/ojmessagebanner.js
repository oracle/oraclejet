/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact/hooks', 'preact', 'ojs/ojconfig', 'ojs/ojcore-base', 'ojs/ojlogger', 'ojs/ojsoundutils', 'ojs/ojanimation', 'ojs/ojtranslation', 'ojs/ojcontext', 'ojs/ojdataproviderhandler', 'ojs/ojvcomponent', 'ojs/ojbutton'], function (exports, jsxRuntime, hooks, preact, ojconfig, oj, Logger, ojsoundutils, AnimationUtils, Translations, Context, ojdataproviderhandler, ojvcomponent, ojbutton) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    function MessageCloseButton({ onAction, title = 'Close' }) {
        return (jsxRuntime.jsx("div", { class: "oj-messagebanner-close-button", "data-oj-message-close-button": "", children: jsxRuntime.jsxs("oj-button", { class: "oj-button-sm", display: "icons", chroming: "borderless", title: title, onojAction: onAction, children: [jsxRuntime.jsx("span", { slot: "startIcon", class: "oj-fwk-icon oj-fwk-icon-cross" }), jsxRuntime.jsx("span", { children: title })] }) }));
    }

    const severities = ['error', 'warning', 'confirmation', 'info', 'none'];

    const DATE_FORMAT_OPTIONS = Object.freeze({
        TODAY: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        },
        DEFAULT: {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }
    });
    const ISO_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
    function isDateToday(isoDate) {
        const today = new Date();
        const provided = new Date(isoDate);
        return (today.getUTCFullYear() === provided.getUTCFullYear() &&
            today.getUTCMonth() === provided.getUTCMonth() &&
            today.getUTCDate() === provided.getUTCDate());
    }
    function getDateTimeFormatter(isToday) {
        const locale = ojconfig.getLocale();
        const { DateTimeFormat } = Intl;
        if (isToday) {
            return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.TODAY);
        }
        return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.DEFAULT);
    }
    function isValidValueForProp(value, prop = 'string') {
        switch (prop) {
            case 'severity':
                return typeof value === 'string' && severities.includes(value);
            case 'timestamp':
                return typeof value === 'string' && ISO_DATE_REGEX.test(value);
            case 'string':
            default:
                return typeof value === 'string' && !oj.StringUtils.isEmptyOrUndefined(value);
        }
    }
    function formatTimestamp(isoTime) {
        const isToday = isDateToday(isoTime);
        const formatter = getDateTimeFormatter(isToday);
        return formatter.format(new Date(isoTime));
    }

    function defaultDetailRenderer(item) {
        const { detail } = item.data;
        if (!isValidValueForProp(detail)) {
            return null;
        }
        return jsxRuntime.jsx(preact.Fragment, { children: detail });
    }
    function MessageDetail({ item, renderer }) {
        const isCustomRendered = renderer != null;
        const renderedContent = (renderer ?? defaultDetailRenderer)(item);
        return renderedContent == null ? null : (jsxRuntime.jsx("div", { class: "oj-messagebanner-detail", ...(isCustomRendered ? { 'data-oj-message-custom-detail': '' } : {}), children: renderedContent }));
    }

    function MessageHeader({ children }) {
        return (jsxRuntime.jsx("div", { role: "presentation", class: "oj-messagebanner-header", children: children }));
    }

    const Icon = ({ children }) => (jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", height: "1em", width: "1em", style: { fontSize: '1em', color: 'currentColor' }, children: children }));
    const SuccessIcon = () => (jsxRuntime.jsx(Icon, { children: jsxRuntime.jsx("g", { fill: "none", children: jsxRuntime.jsx("path", { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm5.707-13.293L10 16.414l-3.707-3.707 1.414-1.414L10 13.586l6.293-6.293z", fill: "currentcolor" }) }) }));
    const ErrorIcon = () => (jsxRuntime.jsx(Icon, { children: jsxRuntime.jsx("g", { fill: "none", children: jsxRuntime.jsx("path", { d: "M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12zm5.293-3.293 1.414-1.414 8 8-1.414 1.414z", fill: "currentcolor" }) }) }));
    const InformationIcon = () => (jsxRuntime.jsx(Icon, { children: jsxRuntime.jsx("g", { fill: "none", children: jsxRuntime.jsx("path", { d: "M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-9-4V6h-2v2zm0 10v-8h-2v8z", fill: "currentcolor" }) }) }));
    const WarningIcon = () => (jsxRuntime.jsx(Icon, { children: jsxRuntime.jsx("g", { fill: "none", children: jsxRuntime.jsx("path", { d: "M2 22 12 2l10 20zm9-11v4h2v-4zm0 6v2h2v-2z", fill: "currentcolor" }) }) }));

    const severityIcons = {
        confirmation: SuccessIcon,
        error: ErrorIcon,
        info: InformationIcon,
        warning: WarningIcon
    };
    function MessageStartIcon({ severity, translations }) {
        const IconComponent = severityIcons[severity];
        return (jsxRuntime.jsx("div", { class: "oj-messagebanner-start-icon-container", role: "presentation", children: jsxRuntime.jsx("div", { class: "oj-flex oj-sm-align-items-center", height: "100%", children: jsxRuntime.jsx("span", { class: "oj-messagebanner-start-icon", role: "img", title: translations?.[severity], children: jsxRuntime.jsx(IconComponent, {}) }) }) }));
    }

    function MessageSummary({ text }) {
        return (jsxRuntime.jsx("div", { role: "heading", class: "oj-messagebanner-summary", children: text }));
    }

    function MessageTimestamp({ value }) {
        const formattedTimestamp = formatTimestamp(value);
        return jsxRuntime.jsx("div", { class: "oj-messagebanner-timestamp", children: formattedTimestamp });
    }

    const MessageLogger = {
        error: (message) => Logger.error(`JET oj-message-banner: ${message}`),
        warn: (message) => Logger.warn(`JET Oj-message-banner: ${message}`),
        info: (message) => Logger.info(`JET Oj-message-banner: ${message}`),
        log: (message) => Logger.log(`JET Oj-message-banner: ${message}`)
    };
    async function playSound(sound) {
        if (sound === 'none') {
            return;
        }
        if (sound === 'default') {
            try {
                ojsoundutils.SoundUtils.playDefaultNotificationSound();
            }
            catch (error) {
                MessageLogger.warn(`Failed to play the default sound. ${error}.`);
            }
            return;
        }
        try {
            await ojsoundutils.SoundUtils.playAudioFromURL(sound);
        }
        catch (error) {
            MessageLogger.warn(`Failed to play the audio from the url ${sound}. ${error}.`);
        }
    }
    function throwError(message) {
        throw new Error(`JET oj-message-banner - ${message}`);
    }
    function getRenderer(message, rendererIdentifier, renderers) {
        if (!rendererIdentifier || !renderers) {
            return undefined;
        }
        const rendererKey = typeof rendererIdentifier === 'function' ? rendererIdentifier(message) : rendererIdentifier;
        if (rendererKey == null) {
            return undefined;
        }
        if (!(rendererKey in renderers)) {
            throwError(`${rendererKey} is not a valid template name for the message with key=${message.key}`);
        }
        return renderers[rendererKey];
    }
    function severityBasedStyleClass(severity) {
        const isValidSeverity = isValidValueForProp(severity, 'severity');
        return isValidSeverity && severity !== 'none' ? `oj-messagebanner-${severity}` : '';
    }
    function isSeverityIconNeeded(severity) {
        const isValidSeverity = isValidValueForProp(severity, 'severity');
        return isValidSeverity && severity !== 'none';
    }
    function classNames(values) {
        return values.filter(Boolean).join(' ');
    }

    function isSeverityIconNeeded$1(severity) {
        const isValidSeverity = isValidValueForProp(severity, 'severity');
        return isValidSeverity && severity !== 'none';
    }
    const MIN_SECONDS = 5;
    const DEFAULT_TIMEOUT = MIN_SECONDS * 1000;
    function Message({ detailRenderer, index = -1, item, onClose, messageRef = () => { }, variant = 'section', translations }) {
        const { closeAffordance = 'on', severity = 'error', sound, summary, timestamp } = item.data;
        const handleClose = hooks.useCallback(() => {
            onClose?.(item);
        }, [item, onClose]);
        const handleCloseOnEsc = hooks.useCallback((event) => {
            if (event.key === 'Escape' && closeAffordance === 'on') {
                onClose?.(item);
            }
        }, [closeAffordance, item, onClose]);
        hooks.useEffect(() => {
            if (isValidValueForProp(sound)) {
                playSound(sound);
            }
        }, []);
        const rootClasses = classNames([
            'oj-messagebanner-item',
            severityBasedStyleClass(severity),
            variant === 'section' && 'oj-messagebanner-section'
        ]);
        return (jsxRuntime.jsx("div", { ref: messageRef, class: rootClasses, role: "alert", "aria-atomic": "true", "data-oj-key": `${typeof item.key}-${item.key}`, tabIndex: 0, onKeyUp: handleCloseOnEsc, children: jsxRuntime.jsxs("div", { class: "oj-messagebanner-content", children: [isSeverityIconNeeded$1(severity) ? (jsxRuntime.jsx(MessageStartIcon, { severity: severity, translations: translations })) : null, jsxRuntime.jsxs("div", { class: "oj-flex oj-sm-flex-direction-column oj-sm-flex-1 oj-messagebanner-content-gap", children: [jsxRuntime.jsxs(MessageHeader, { children: [jsxRuntime.jsx(MessageSummary, { text: summary }), isValidValueForProp(timestamp, 'timestamp') && jsxRuntime.jsx(MessageTimestamp, { value: timestamp })] }), jsxRuntime.jsx(MessageDetail, { item: { ...item, index }, renderer: detailRenderer })] }), closeAffordance === 'on' && (jsxRuntime.jsx(MessageCloseButton, { title: translations?.close, onAction: handleClose }))] }) }));
    }

    function MessageLiveRegion({ atomic = 'false', children = '', timeout = 100, type = 'polite' }) {
        const ariaLiveText = useLiveText(children, timeout);
        return (jsxRuntime.jsx("span", { "aria-live": type, "aria-atomic": atomic, class: "oj-helper-hidden-accessible", children: ariaLiveText }));
    }
    function useLiveText(text, timeout) {
        const [liveText, setLiveText] = hooks.useState('');
        const updateText = hooks.useCallback(() => setLiveText(text), [text]);
        const updateTextAsync = hooks.useCallback(() => setTimeout(function () {
            updateText();
        }, timeout), [updateText, timeout]);
        hooks.useEffect(() => {
            const timeoutId = updateTextAsync();
            return () => clearTimeout(timeoutId);
        }, [updateTextAsync]);
        return liveText;
    }

    class Transition extends preact.Component {
        constructor(props) {
            super(props);
            let appearStatus;
            if (props.in) {
                appearStatus = 'entering';
            }
            else {
                appearStatus = null;
            }
            this._appearStatus = appearStatus;
            this.state = { status: 'exited' };
            this._nextCallback = null;
        }
        componentDidMount() {
            this._updateStatus(this._appearStatus);
        }
        componentDidUpdate(prevProps) {
            let nextStatus = null;
            if (prevProps !== this.props) {
                const { status } = this.state;
                if (this.props.in) {
                    if (status !== 'entering' && status !== 'entered') {
                        nextStatus = 'entering';
                    }
                }
                else {
                    if (status === 'entering' || status === 'entered') {
                        nextStatus = 'exiting';
                    }
                }
            }
            this._updateStatus(nextStatus);
        }
        componentWillUnmount() {
            this._cancelNextCallback();
        }
        render(props) {
            return props?.children;
        }
        _setNextCallback(callback) {
            let active = true;
            this._nextCallback = (...args) => {
                if (active) {
                    active = false;
                    this._nextCallback = null;
                    callback(...args);
                }
            };
            this._nextCallback.cancel = () => {
                active = false;
            };
            return this._nextCallback;
        }
        _cancelNextCallback() {
            this._nextCallback?.cancel?.();
            this._nextCallback = null;
        }
        _updateStatus(nextStatus) {
            if (nextStatus != null) {
                this._cancelNextCallback();
                if (nextStatus === 'entering') {
                    this._performEnter(this.base);
                }
                else {
                    this._performExit(this.base);
                }
            }
        }
        _performEnter(node) {
            this.props.onEnter?.(node, this.props.metadata);
            this.setState({ status: 'entering' }, () => {
                this.props.onEntering?.(node, this._setNextCallback(() => {
                    this.setState({ status: 'entered' }, () => {
                        this.props.onEntered?.(node, this.props.metadata);
                    });
                }), this.props.metadata);
            });
        }
        _performExit(node) {
            this.props.onExit?.(node, this.props.metadata);
            this.setState({ status: 'exiting' }, () => {
                this.props.onExiting?.(node, this._setNextCallback(() => {
                    this.setState({ status: 'exited' }, () => {
                        this.props.onExited?.(node, this.props.metadata);
                    });
                }), this.props.metadata);
            });
        }
    }

    const MessagesContext = preact.createContext({});
    function useMessagesContext() {
        return hooks.useContext(MessagesContext);
    }

    const DEFAULT_ANIMATIONS = {
        enter: [{ effect: 'expand', duration: '0.25s', direction: 'height' }],
        exit: [{ effect: 'collapse', duration: '0.25s', direction: 'height' }]
    };
    function MessageTransition({ onEntering, onExiting, ...transitionProps }) {
        const animationCallbackRef = hooks.useRef();
        const busyStateResolveRef = hooks.useRef();
        const { addBusyState } = useMessagesContext();
        const onEnteringCallback = hooks.useCallback(async (node, callback, metadata) => {
            onEntering?.(node, undefined, metadata);
            const busyStateResolver = addBusyState?.('messages animating');
            await AnimationUtils.startAnimation(node, 'enter', DEFAULT_ANIMATIONS['enter']);
            busyStateResolver();
            callback();
        }, [addBusyState, onEntering]);
        const onExitingCallback = hooks.useCallback(async (node, callback, metadata) => {
            onExiting?.(node, undefined, metadata);
            const busyStateResolver = addBusyState?.('messages animating');
            await AnimationUtils.startAnimation(node, 'exit', DEFAULT_ANIMATIONS['exit']);
            busyStateResolver();
            callback();
        }, [addBusyState, onExiting]);
        hooks.useLayoutEffect(() => () => busyStateResolveRef.current?.(), []);
        return (jsxRuntime.jsx("div", { children: jsxRuntime.jsx(Transition, { ...transitionProps, onEntering: onEnteringCallback, onExiting: onExitingCallback }) }));
    }

    class TransitionUtils {
        static getChildMapping(children, prevChildMapping = new Map(), onExited = () => { }) {
            const TRAILING = Symbol();
            let mappedDeletions = {};
            if (prevChildMapping.size !== 0) {
                mappedDeletions = TransitionUtils._getMappedDeletions(children, prevChildMapping, TRAILING);
            }
            const mergedChildrenMap = children.reduce((accumulator, currentChild) => {
                if (mappedDeletions[currentChild.key]) {
                    const deletedChildren = mappedDeletions[currentChild.key];
                    for (const key of deletedChildren) {
                        const previousChild = prevChildMapping.get(key);
                        accumulator.set(key, preact.cloneElement(previousChild, { in: false }));
                    }
                    const previousChild = prevChildMapping.get(currentChild.key);
                    accumulator.set(currentChild.key, preact.cloneElement(currentChild, {
                        onExited: previousChild.props.onExited,
                        in: previousChild.props.in
                    }));
                }
                else {
                    const newChild = preact.cloneElement(currentChild, {
                        onExited: onExited.bind(null, currentChild),
                        in: true
                    });
                    accumulator.set(currentChild.key, newChild);
                }
                return accumulator;
            }, new Map());
            for (const key of mappedDeletions[TRAILING] || []) {
                const previousChild = prevChildMapping.get(key);
                mergedChildrenMap.set(key, preact.cloneElement(previousChild, { in: false }));
            }
            return mergedChildrenMap;
        }
        static _getMappedDeletions(children, prevChildMapping, TRAILING) {
            const nextChildrenKeys = new Set(children.map((children) => children.key));
            return [...prevChildMapping.keys()].reduce((accumulator, currentKey) => {
                if (nextChildrenKeys.has(currentKey)) {
                    accumulator[currentKey] = accumulator[TRAILING];
                    delete accumulator[TRAILING];
                }
                else {
                    const trailingChildren = accumulator[TRAILING]
                        ? [...accumulator[TRAILING], currentKey]
                        : [currentKey];
                    accumulator[TRAILING] = trailingChildren;
                }
                return accumulator;
            }, {});
        }
    }

    class TransitionGroup extends preact.Component {
        static getDerivedStateFromProps(props, state) {
            const { childMapping, handleExited } = state;
            return {
                childMapping: TransitionUtils.getChildMapping(props.children, childMapping, handleExited)
            };
        }
        constructor(props) {
            super(props);
            this._handleExited = (child, node, metadata) => {
                const { children } = this.props;
                const currentChildMapping = TransitionUtils.getChildMapping(children);
                if (currentChildMapping.has(child.key))
                    return;
                child.props.onExited?.(node, metadata);
                if (this._mounted) {
                    this.setState((state) => {
                        const childMapping = new Map(state.childMapping);
                        childMapping.delete(child.key);
                        return { childMapping };
                    });
                }
            };
            this.state = {
                childMapping: undefined,
                handleExited: this._handleExited
            };
            this._mounted = false;
        }
        componentDidMount() {
            this._mounted = true;
        }
        componentWillUnmount() {
            this._mounted = false;
        }
        render() {
            const WrapperComponent = this.props.elementType;
            const { childMapping } = this.state;
            const children = [...childMapping.values()];
            return jsxRuntime.jsx(WrapperComponent, { children: children });
        }
    }
    TransitionGroup.defaultProps = {
        elementType: 'div'
    };

    function MessagesManager({ data, children, onMessageWillRemove }) {
        const handleExited = hooks.useCallback(async (node, metadata) => {
            metadata && onMessageWillRemove?.(metadata.key, metadata.index, node);
        }, [onMessageWillRemove]);
        return (jsxRuntime.jsx(TransitionGroup, { elementType: preact.Fragment, children: data.map((item, index) => (jsxRuntime.jsx(MessageTransition, { metadata: { index, key: item.key }, onExited: handleExited, children: children?.({ index, item }) }, item.key))) }));
    }

    const componentsMap = new Map();
    const componentsOrder = [];
    const priorFocusCache = new Map();
    let hasDocumentListener = false;
    let priorFocusedElement;
    let currentFocusedMessage;
    function handleDocumentKeyDownCapture(event) {
        if (componentsMap.size === 0 || event.key !== 'F6' || event.defaultPrevented) {
            return;
        }
        if (!cycleFocusThroughMessages(event)) {
            currentFocusedMessage && togglePreviousFocus(currentFocusedMessage, event);
        }
    }
    function handleDocumentBlurCapture(event) {
        priorFocusedElement = event.target;
    }
    function handleComponentKeyUp(id, event) {
        if (!componentsMap.has(id) || event.defaultPrevented) {
            return;
        }
        if (event.type === 'keyup' && ['Escape'].includes(event.key)) {
            togglePreviousFocus(id, event);
        }
    }
    function handleComponentFocus(id, event) {
        if (!componentsMap.has(id) || event.defaultPrevented) {
            return;
        }
        currentFocusedMessage = id;
        const { callbacks } = componentsMap.get(id);
        if (priorFocusedElement && !isPartOfRegisteredMessages(priorFocusedElement)) {
            priorFocusCache.set(id, priorFocusedElement);
            callbacks?.onFocus?.();
        }
    }
    function handleComponentBlur(id, event) {
        if (!componentsMap.has(id) || event.defaultPrevented) {
            return;
        }
        currentFocusedMessage = undefined;
    }
    function cycleFocusThroughMessages(event) {
        const nextPosition = indexOfOrDefaultTo(componentsOrder, currentFocusedMessage, componentsOrder.length) - 1;
        for (let i = nextPosition; i > -1; i--) {
            const id = componentsOrder[i];
            const { ref } = componentsMap.get(id) ?? {};
            if (ref?.current?.focus?.()) {
                event.preventDefault();
                if (currentFocusedMessage) {
                    const { callbacks } = componentsMap.get(currentFocusedMessage) ?? {};
                    callbacks?.onFocusLeave?.();
                }
                return true;
            }
        }
        return false;
    }
    function isPartOfRegisteredMessages(element) {
        for (const { ref } of componentsMap.values()) {
            if (ref.current?.contains(element)) {
                return true;
            }
        }
        return false;
    }
    function indexOfOrDefaultTo(arr, search, defaultIndex = -1) {
        const index = arr.indexOf(search);
        if (index !== -1)
            return index;
        return defaultIndex;
    }
    function getClosestPriorFocusedElement(id) {
        const index = componentsOrder.indexOf(id);
        for (let i = index; i < componentsOrder.length; i++) {
            if (priorFocusCache.has(componentsOrder[i])) {
                return priorFocusCache.get(componentsOrder[i]);
            }
        }
        return null;
    }
    function addComponent(id, options) {
        componentsMap.set(id, options);
        componentsOrder.push(id);
    }
    function removeComponent(id) {
        if (!componentsMap.has(id)) {
            return;
        }
        componentsMap.delete(id);
        componentsOrder.splice(componentsOrder.indexOf(id), 1);
    }
    function clearFocusCache(id) {
        priorFocusCache.delete(id);
    }
    function addDocumentListeners() {
        document.documentElement.addEventListener('keydown', handleDocumentKeyDownCapture, true);
        document.documentElement.addEventListener('blur', handleDocumentBlurCapture, true);
        hasDocumentListener = true;
    }
    function removeDocumentListeners() {
        document.documentElement.removeEventListener('keydown', handleDocumentKeyDownCapture, true);
        document.documentElement.removeEventListener('blur', handleDocumentBlurCapture, true);
        hasDocumentListener = false;
    }
    function register(id, componentOptions, focusManagerOptions = { handleEscapeKey: true }) {
        if (!hasDocumentListener) {
            addDocumentListeners();
        }
        addComponent(id, componentOptions);
        const handlers = {
            onfocusin: (event) => handleComponentFocus(id, event),
            onfocusout: (event) => handleComponentBlur(id, event)
        };
        if (focusManagerOptions.handleEscapeKey) {
            handlers['onKeyUp'] = (event) => handleComponentKeyUp(id, event);
        }
        return handlers;
    }
    function togglePreviousFocus(id, event) {
        const target = getClosestPriorFocusedElement(id);
        const { callbacks } = componentsMap.get(id) ?? {};
        if (target && document.body.contains(target)) {
            target.focus();
            callbacks?.onFocusLeave?.();
            priorFocusCache.clear();
            event?.preventDefault();
            return true;
        }
        return false;
    }
    function unregister(id) {
        removeComponent(id);
        clearFocusCache(id);
        if (hasDocumentListener && componentsMap.size === 0) {
            removeDocumentListeners();
        }
    }
    function prioritize(id) {
        if (!componentsMap.has(id)) {
            return;
        }
        const options = componentsMap.get(id);
        removeComponent(id);
        addComponent(id, options);
    }
    const messagesFocusManager = {
        prioritize,
        register,
        togglePreviousFocus,
        unregister
    };
    function useMessageFocusManager(ref, callbacks, options) {
        const id = hooks.useRef(Symbol());
        const focusManager = hooks.useRef(messagesFocusManager);
        const [handlers, setHandlers] = hooks.useState({});
        const controller = hooks.useMemo(() => ({
            prioritize: () => focusManager.current.prioritize(id.current),
            restorePriorFocus: () => focusManager.current.togglePreviousFocus(id.current)
        }), []);
        hooks.useEffect(() => {
            const currentFocusManager = focusManager.current;
            const currentId = id.current;
            setHandlers(currentFocusManager.register(currentId, { ref, callbacks }, options));
            return () => currentFocusManager.unregister(currentId);
        }, []);
        return {
            handlers,
            controller
        };
    }

    function MessageBanner({ detailRendererKey, data, onClose, renderers, translations, type = 'section' }) {
        const messagesRef = hooks.useRef(new Map());
        const containerDivRef = hooks.useRef(null);
        const focusHandleRef = hooks.useRef(null);
        const [liveRegionText, setLiveRegionText] = hooks.useState();
        const [shouldRender, setShouldRender] = hooks.useState(data.length > 0);
        const dataLengthRef = hooks.useRef(data.length);
        const prevDataLengthRef = hooks.useRef(0);
        dataLengthRef.current = data.length;
        const setMessageRef = hooks.useCallback((key) => {
            return (ref) => messagesRef.current.set(key, ref);
        }, []);
        hooks.useImperativeHandle(focusHandleRef, () => ({
            focus: () => {
                const isVisible = containerDivRef.current?.checkVisibility() ?? false;
                if (data.length && isVisible) {
                    const firstItemKey = data[0].key;
                    messagesRef.current.get(firstItemKey)?.focus();
                    return true;
                }
                return false;
            },
            contains: (element) => {
                if (data.length && element) {
                    return containerDivRef.current?.contains(element) ?? false;
                }
                return false;
            }
        }), [data]);
        const { controller, handlers } = useMessageFocusManager(focusHandleRef, {
            onFocus: hooks.useCallback(() => {
                setLiveRegionText(translations?.navigationFromMessagesRegion);
            }, [setLiveRegionText, translations])
        });
        const handleClose = hooks.useCallback((item) => {
            onClose?.(item);
        }, [onClose]);
        const handleNextFocus = hooks.useCallback((_key, index, closedMessageNode) => {
            const isClosedMessageFocused = closedMessageNode?.contains(document.activeElement);
            if (dataLengthRef.current === 0) {
                setShouldRender(false);
                if (isClosedMessageFocused) {
                    controller.restorePriorFocus();
                }
                return;
            }
            const renderedMessagesCount = data.length;
            const nextMessageIndexToFocus = index + 1 < renderedMessagesCount ? index + 1 : index - 1;
            if (nextMessageIndexToFocus > -1 && isClosedMessageFocused) {
                const nextMessageKey = data[nextMessageIndexToFocus].key;
                messagesRef.current.get(nextMessageKey)?.focus();
            }
        }, [controller, data]);
        hooks.useEffect(() => {
            if (data.length) {
                setShouldRender(true);
                if (data.length > prevDataLengthRef.current) {
                    setLiveRegionText(translations?.navigationToMessagesRegion);
                }
                controller.prioritize();
            }
            else {
                setLiveRegionText('');
            }
            prevDataLengthRef.current = data.length;
        }, [controller, data, translations]);
        if (!shouldRender && data.length === 0) {
            return null;
        }
        const rootClasses = classNames([
            'oj-flex',
            'oj-sm-flex-direction-column',
            type === 'section' && 'oj-messagebanner-container-gap'
        ]);
        return (jsxRuntime.jsx("div", { ref: containerDivRef, class: "oj-messagebanner", tabIndex: -1, ...handlers, children: jsxRuntime.jsxs("div", { class: rootClasses, children: [jsxRuntime.jsx(MessagesManager, { data: data, onMessageWillRemove: handleNextFocus, children: ({ index, item }) => (jsxRuntime.jsx(Message, { messageRef: setMessageRef(item.key), item: item, detailRenderer: getRenderer(item, detailRendererKey, renderers), index: index, variant: type, onClose: handleClose, translations: translations }, item.key)) }), jsxRuntime.jsx(MessageLiveRegion, { children: liveRegionText })] }) }));
    }

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    exports.MessageBanner = class MessageBanner$1 extends preact.Component {
        static getDerivedStateFromProps(props, state) {
            const { data } = props;
            const { dataProviderCount, previousDataProvider } = state;
            if (data !== previousDataProvider) {
                return {
                    dataProviderCount: dataProviderCount + 1,
                    previousDataProvider: data
                };
            }
            return null;
        }
        constructor(props) {
            super(props);
            this._addBusyState = (description) => {
                const busyContext = Context.getContext(this._rootRef.current).getBusyContext();
                return busyContext.addBusyState({ description });
            };
            this._handleCloseMessage = (context) => {
                this.props.onOjClose?.(context);
            };
            this._rootRef = preact.createRef();
            this.state = { dataProviderCount: 0, previousDataProvider: props.data };
            this.WrapperMessagesContainer = ojdataproviderhandler.withDataProvider(MessageBanner, 'data');
        }
        render(props) {
            const { data, detailTemplateValue, messageTemplates, type } = props;
            const { dataProviderCount } = this.state;
            const messagesContext = { addBusyState: this._addBusyState };
            return (jsxRuntime.jsx(ojvcomponent.Root, { ref: this._rootRef, children: jsxRuntime.jsx(MessagesContext.Provider, { value: messagesContext, children: jsxRuntime.jsx(this.WrapperMessagesContainer, { addBusyState: this._addBusyState, data: data, type: type, detailRendererKey: detailTemplateValue, renderers: messageTemplates, onClose: this._handleCloseMessage, translations: {
                            close: Translations.getTranslatedString('oj-ojMessageBanner.close'),
                            navigationFromMessagesRegion: Translations.getTranslatedString('oj-ojMessageBanner.navigationFromMessagesRegion'),
                            navigationToMessagesRegion: Translations.getTranslatedString('oj-ojMessageBanner.navigationToMessagesRegion'),
                            error: Translations.getTranslatedString('oj-ojMessageBanner.error'),
                            warning: Translations.getTranslatedString('oj-ojMessageBanner.warning'),
                            info: Translations.getTranslatedString('oj-ojMessageBanner.info'),
                            confirmation: Translations.getTranslatedString('oj-ojMessageBanner.confirmation')
                        } }, `dataProvider${dataProviderCount}`) }) }));
        }
    };
    exports.MessageBanner.defaultProps = {
        type: 'section'
    };
    exports.MessageBanner._metadata = { "properties": { "data": { "type": "object" }, "type": { "type": "string", "enumValues": ["page", "section"] }, "detailTemplateValue": { "type": "string|function" } }, "extension": { "_DYNAMIC_SLOT": { "prop": "messageTemplates", "isTemplate": 1 } }, "events": { "ojClose": {} } };
    exports.MessageBanner = __decorate([
        ojvcomponent.customElement('oj-message-banner')
    ], exports.MessageBanner);

    Object.defineProperty(exports, '__esModule', { value: true });

});
