/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact/hooks', 'preact', 'ojs/ojconfig', 'ojs/ojcore-base', 'ojs/ojlogger', 'ojs/ojsoundutils', 'ojs/ojanimation', 'ojs/ojtranslation', 'ojs/ojcontext', 'ojs/ojdataproviderhandler', 'ojs/ojvcomponent', 'ojs/ojbutton'], function (exports, jsxRuntime, hooks, preact, Config, oj, Logger, ojsoundutils, AnimationUtils, Translations, Context, ojdataproviderhandler, ojvcomponent, ojbutton) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    /**
     * A Component for rendering the message close button
     */
    function MessageCloseButton({ onAction, title = 'Close' }) {
        // Otherwise, render the close button
        return (jsxRuntime.jsx("div", { class: "oj-messagebanner-close-button", "data-oj-message-close-button": "", children: jsxRuntime.jsxs("oj-button", { class: "oj-button-sm", display: "icons", chroming: "borderless", title: title, onojAction: onAction, children: [jsxRuntime.jsx("span", { slot: "startIcon", class: "oj-fwk-icon oj-fwk-icon-cross" }), jsxRuntime.jsx("span", { children: title })] }) }));
    }

    const severities = ['error', 'warning', 'confirmation', 'info', 'none'];

    /**
     * Options for creating an Intl.DateTimeFormat instance.
     */
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
    /**
     * Regex for validating ISO timestamp
     */
    const ISO_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
    /**
     * Checks if the provided date is today
     *
     * @param isoDate Date to be tested for today
     *
     * @returns boolean indicating if the provided date is today
     */
    function isDateToday(isoDate) {
        const today = new Date();
        const provided = new Date(isoDate);
        return (today.getUTCFullYear() === provided.getUTCFullYear() &&
            today.getUTCMonth() === provided.getUTCMonth() &&
            today.getUTCDate() === provided.getUTCDate());
    }
    /**
     * Creates an instance of Intl.DateTimeFormat
     *
     * @param isToday A boolean to indicate whether a formatter is needed for the date
     *                that is the current day.
     *
     * @returns the formatter instance
     */
    function getDateTimeFormatter(isToday) {
        const locale = Config.getLocale();
        const { DateTimeFormat } = Intl;
        if (isToday) {
            return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.TODAY);
        }
        return new DateTimeFormat(locale, DATE_FORMAT_OPTIONS.DEFAULT);
    }
    /**
     * Checks if the provided value is valid for the prop specified.
     * By default, this method just checks for the value to be a valid string.
     *
     * @param value The value to be checked
     * @param prop The property for which the value needs to be evaluated
     *
     * @returns the result of the validation
     */
    function isValidValueForProp(value, prop = 'string') {
        switch (prop) {
            case 'severity':
                // Should be one of the allowed severity
                return typeof value === 'string' && severities.includes(value);
            case 'timestamp':
                // Should be a valid ISO Datetime string
                return typeof value === 'string' && ISO_DATE_REGEX.test(value);
            case 'string':
            default:
                // anything other than null, undefined and '' is a valid string
                return typeof value === 'string' && !oj.StringUtils.isEmptyOrUndefined(value);
        }
    }
    /**
     * Formats the timestamp in the required format based on the current
     * locale.
     *
     * @param isoTime Timestamp in ISO format
     */
    function formatTimestamp(isoTime) {
        const isToday = isDateToday(isoTime);
        const formatter = getDateTimeFormatter(isToday);
        return formatter.format(new Date(isoTime));
    }

    /**
     * Default renderer for rendering the detail content.
     *
     * @param item The data item object
     * @returns Rendered detail content
     */
    function defaultDetailRenderer(item) {
        const { detail } = item.data;
        // If the detail is null or an empty string, do not render the
        // content row
        if (!isValidValueForProp(detail)) {
            return null;
        }
        return jsxRuntime.jsx(preact.Fragment, { children: detail });
    }
    /**
     * Detail Component for rendering the detail content of the Message
     */
    function MessageDetail({ item, renderer }) {
        const isCustomRendered = renderer != null;
        const renderedContent = (renderer ?? defaultDetailRenderer)(item);
        return renderedContent == null ? null : (jsxRuntime.jsx("div", { class: "oj-messagebanner-detail", ...(isCustomRendered ? { 'data-oj-message-custom-detail': '' } : {}), children: renderedContent }));
    }

    /**
     * A component that styles the header for the message component
     * @param param0 Props
     * @returns MessageHeader component instance
     */
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
    /**
     * StartIcon Component for rendering the severity based icon in Message
     */
    function MessageStartIcon({ severity, translations }) {
        const IconComponent = severityIcons[severity];
        return (jsxRuntime.jsx("div", { class: "oj-messagebanner-start-icon-container", role: "presentation", children: jsxRuntime.jsx("div", { class: "oj-flex oj-sm-align-items-center", style: { height: '100%' }, children: jsxRuntime.jsx("span", { class: "oj-messagebanner-start-icon", role: "img", title: translations?.[severity], children: jsxRuntime.jsx(IconComponent, {}) }) }) }));
    }

    /**
     * Summary Component for rendering the summary text of the Message
     */
    function MessageSummary({ text }) {
        return (jsxRuntime.jsx("div", { role: "heading", "aria-level": 2, class: "oj-messagebanner-summary", children: text }));
    }

    /**
     * Timestamp Component for rendering timestamp in Message
     */
    function MessageTimestamp({ value }) {
        const formattedTimestamp = formatTimestamp(value);
        return jsxRuntime.jsx("div", { class: "oj-messagebanner-timestamp", children: formattedTimestamp });
    }

    /**
     * Logger that prepends the component name to the message
     */
    const MessageLogger = {
        error: (message) => Logger.error(`JET oj-message-banner: ${message}`),
        warn: (message) => Logger.warn(`JET Oj-message-banner: ${message}`),
        info: (message) => Logger.info(`JET Oj-message-banner: ${message}`),
        log: (message) => Logger.log(`JET Oj-message-banner: ${message}`)
    };
    /**
     * Plays a sound based on the provided argument. Supported keywords:
     * 1. default - plays the default beep sound
     * 2. none - no sound will be played
     *
     * @param sound Supported keywords or URL to an audio file
     */
    async function playSound(sound) {
        if (sound === 'none') {
            // no need to play any audio
            return;
        }
        // For default, we play a beep sound using WebAudio API
        if (sound === 'default') {
            try {
                ojsoundutils.SoundUtils.playDefaultNotificationSound();
            }
            catch (error) {
                // Default sound is not played due to some error
                // Log a message and return doing nothing else
                MessageLogger.warn(`Failed to play the default sound. ${error}.`);
            }
            return;
        }
        // If it is not a key word, then it is an URL
        try {
            await ojsoundutils.SoundUtils.playAudioFromURL(sound);
        }
        catch (error) {
            // Playing audio using the URL failed.
            MessageLogger.warn(`Failed to play the audio from the url ${sound}. ${error}.`);
        }
    }
    /**
     * A helper function that throws an error
     *
     * @param message The error message
     * @throws {Error}
     */
    function throwError(message) {
        throw new Error(`JET oj-message-banner - ${message}`);
    }
    /**
     * Fetches a renderer for the current message if one is provided
     *
     * @param message The item context for the current message
     * @param rendererIdentifier Identifier of the current renderer
     * @param renderers All available renderers
     * @returns The renderer for rendering the custom content
     */
    function getRenderer(message, rendererIdentifier, renderers) {
        // If either detailRenderer function or record of renderers are not available,
        // return null
        if (!rendererIdentifier || !renderers) {
            return undefined;
        }
        const rendererKey = typeof rendererIdentifier === 'function' ? rendererIdentifier(message) : rendererIdentifier;
        // If rendererKey is null or undefined, then we need to use default rendering
        // so return null
        if (rendererKey == null) {
            return undefined;
        }
        // If the returned render key is a string but does not exist in the provided
        // record of renderers, throw an error
        if (!(rendererKey in renderers)) {
            throwError(`${rendererKey} is not a valid template name for the message with key=${message.key}`);
        }
        // Else, fetch and return the renderer
        return renderers[rendererKey];
    }
    /**
     * Generates a root style class based on the severity. For invalid severity and severity=none
     * no specific style class exists.
     *
     * @param severity The message severity
     * @returns calculated style class based on the severity
     */
    function severityBasedStyleClass(severity) {
        const isValidSeverity = isValidValueForProp(severity, 'severity');
        return isValidSeverity && severity !== 'none' ? `oj-messagebanner-${severity}` : '';
    }
    /**
     * Determines if a severity icon is needed based on the component severity
     *
     * @param severity The component severity
     * @returns Whether or not to render the severity icon
     */
    function isSeverityIconNeeded(severity) {
        const isValidSeverity = isValidValueForProp(severity, 'severity');
        return isValidSeverity && severity !== 'none';
    }
    /**
     * Given a set of string arguments, join the values together into a string with
     * spaces. Falsey values will be omitted,
     * e.g. classNames(['A', 'B', false, 'D', false]) --> 'A B D'
     * @param values The set of values
     * @returns The values joined as a string, or blank string if no values
     */
    function classNames(values) {
        return values.filter(Boolean).join(' ');
    }

    /**
     * Determines if a severity icon is needed based on the component severity
     *
     * @param severity The component severity
     * @returns Whether or not to render the severity icon
     */
    function isSeverityIconNeeded$1(severity) {
        const isValidSeverity = isValidValueForProp(severity, 'severity');
        return isValidSeverity && severity !== 'none';
    }
    /**
     * Default timeout duration for autoTimeout in milliseconds
     */
    const MIN_SECONDS = 5;
    const DEFAULT_TIMEOUT = MIN_SECONDS * 1000;
    /**
     * Component that renders an individual message
     */
    function Message({ detailRenderer, index = -1, item, onClose, messageRef = () => { }, variant = 'section', translations }) {
        const { closeAffordance = 'on', severity = 'error', sound, summary, timestamp } = item.data;
        /**
         * Handles clicking on the close icon of the message
         */
        const handleClose = hooks.useCallback(() => {
            onClose?.(item);
        }, [item, onClose]);
        /**
         * Handles closing the message on pressing Esc
         */
        const handleCloseOnEsc = hooks.useCallback((event) => {
            // Close the message only when closeAffordance is on
            if (event.key === 'Escape' && closeAffordance === 'on') {
                onClose?.(item);
            }
        }, [closeAffordance, item, onClose]);
        hooks.useEffect(() => {
            if (isValidValueForProp(sound)) {
                // It is sufficient to check for the value to be a
                // non-empty string. The playSound method takes care of the rest.
                playSound(sound);
            }
            // eslint-disable-next-line
        }, []); // No deps to run this only on mount
        const rootClasses = classNames([
            'oj-messagebanner-item',
            severityBasedStyleClass(severity),
            variant === 'section' && 'oj-messagebanner-section'
        ]);
        // We will be animating the root div, so add padding to an inner wrapper div so that
        // when animating height looks smooth. If padding were to be added to the root
        // div, the animation will not be smooth as height will never reach 0 due to the
        // padding.
        return (jsxRuntime.jsx("div", { ref: messageRef, class: rootClasses, role: "alert", "aria-atomic": "true", "data-oj-key": `${typeof item.key}-${item.key}`, tabIndex: 0, onKeyUp: handleCloseOnEsc, children: jsxRuntime.jsxs("div", { class: "oj-messagebanner-content", children: [isSeverityIconNeeded$1(severity) ? (jsxRuntime.jsx(MessageStartIcon, { severity: severity, translations: translations })) : null, jsxRuntime.jsxs("div", { class: "oj-flex oj-sm-flex-direction-column oj-sm-flex-1 oj-messagebanner-content-gap", children: [jsxRuntime.jsxs(MessageHeader, { children: [jsxRuntime.jsx(MessageSummary, { text: summary }), isValidValueForProp(timestamp, 'timestamp') && jsxRuntime.jsx(MessageTimestamp, { value: timestamp })] }), jsxRuntime.jsx(MessageDetail, { item: { ...item, index }, renderer: detailRenderer })] }), closeAffordance === 'on' && (jsxRuntime.jsx(MessageCloseButton, { title: translations?.close, onAction: handleClose }))] }) }));
    }

    /**
     * A helper component that renders an aria-live region
     */
    function MessageLiveRegion({ atomic = 'false', children = '', timeout = 100, type = 'polite' }) {
        const ariaLiveText = useLiveText(children, timeout);
        return (jsxRuntime.jsx("span", { "aria-live": type, "aria-atomic": atomic, class: "oj-helper-hidden-accessible", children: ariaLiveText }));
    }
    /**
     * A custom hook for handling the aria-live region
     *
     * @param text The aria-live text to use
     * @param timeout The timeout for setting the aria-live text async
     * @returns The aria-live text
     */
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

    /**
     * @classdesc
     * The component that acts as a layer for handing transitions.
     *
     * @ignore
     */
    class Transition extends preact.Component {
        ////////////////////////////////////////////////////////////////////////
        // Handler functions are created as members to have them 'this' bound //
        ////////////////////////////////////////////////////////////////////////
        ///////////////////////////
        // Handler functions end //
        ///////////////////////////
        /**
         * Instantiates Component
         *
         * @param props The component properties
         */
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
        //////////////////////////////////////
        // Component Life Cycle Hooks Start //
        //////////////////////////////////////
        /**
         * Lifecycle hook that gets called when the component is mounted to the DOM
         */
        componentDidMount() {
            this._updateStatus(this._appearStatus);
        }
        /**
         * Lifecycle hook that gets called after each update to the component
         *
         * @param prevProps The props of the component before last update
         */
        componentDidUpdate(prevProps) {
            let nextStatus = null;
            if (prevProps !== this.props) {
                const { status } = this.state;
                if (this.props.in) {
                    if (status !== 'entering' && status !== 'entered') {
                        // The component is just entering, so set the next status as Entering
                        nextStatus = 'entering';
                    }
                }
                else {
                    if (status === 'entering' || status === 'entered') {
                        // The component is not in the data anymore, so we need to do exit animation
                        // So, set the next status as Exiting
                        nextStatus = 'exiting';
                    }
                }
            }
            this._updateStatus(nextStatus);
        }
        /**
         * Lifecycle hook that gets called right before the component unmounts
         */
        componentWillUnmount() {
            this._cancelNextCallback();
        }
        ////////////////////////////////////
        // Component Life Cycle Hooks End //
        ////////////////////////////////////
        /**
         * Renders the Transition component
         *
         * @param props The current props
         * @returns The rendered component child
         */
        render(props) {
            return props?.children;
        }
        ////////////////////////////
        // Private helper methods //
        ////////////////////////////
        /**
         * Creates a wrapper callback function, which can be cancelled.
         *
         * @param callback The current callback function
         * @returns The created cancellable callback
         */
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
        /**
         * Cancels the scheduled next callback
         */
        _cancelNextCallback() {
            this._nextCallback?.cancel?.();
            this._nextCallback = null;
        }
        /**
         * Updates the status of the component. Performs corresponding Transitions.
         */
        _updateStatus(nextStatus) {
            if (nextStatus != null) {
                this._cancelNextCallback();
                if (nextStatus === 'entering') {
                    this._performEnter(this.base); // In our component, base is always Element
                }
                else {
                    this._performExit(this.base); // In our component, base is always Element
                }
            }
        }
        /**
         * Perform Entering transitions
         *
         * @param node The root DOM element of this component
         */
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
        /**
         * Perform Exiting transitions
         *
         * @param node The root DOM element of this component
         */
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

    /**
     * Context which the parent custom element components can use for passing down
     * the busy context
     */
    const MessagesContext = preact.createContext({});
    /**
     * Uses the MessagesContext if one is available.
     *
     * @returns The context from the closes provider
     */
    function useMessagesContext() {
        return hooks.useContext(MessagesContext);
    }

    /**
     * Animation config for banner messages.
     */
    const DEFAULT_ANIMATIONS = {
        enter: [{ effect: 'expand', duration: '0.25s', direction: 'height' }],
        exit: [{ effect: 'collapse', duration: '0.25s', direction: 'height' }]
    };
    /**
     * A intermediary component that handles animation for the messages component.
     *
     * The expected flow is as follows:
     * 1. message removed from the data
     * 2. onExiting called and a callback is passed which needs to be called to complete the transition
     * 3. state set to "exiting" in this component
     * 4. triggers useAnimation to perform the exit animation
     * 5. onAnimationEnd is called after the animation, which invokes the callback provided earlier
     * 6. onExited is called (done when the callback mentioned above is called)
     * 7. message is removed from the UI
     *
     * @param param0 Props of the message component
     */
    function MessageTransition({ onEntering, onExiting, ...transitionProps }) {
        const animationCallbackRef = hooks.useRef();
        const busyStateResolveRef = hooks.useRef();
        const { addBusyState } = useMessagesContext();
        const onEnteringCallback = hooks.useCallback(async (node, callback, metadata) => {
            onEntering?.(node, undefined, metadata);
            // set the busyState and start the animation
            const busyStateResolver = addBusyState?.('messages animating');
            await AnimationUtils.startAnimation(node, 'enter', DEFAULT_ANIMATIONS['enter']);
            // resolve animation callback and busy state
            busyStateResolver();
            callback();
        }, [addBusyState, onEntering]);
        const onExitingCallback = hooks.useCallback(async (node, callback, metadata) => {
            onExiting?.(node, undefined, metadata);
            // set the busyState and start the animation
            const busyStateResolver = addBusyState?.('messages animating');
            await AnimationUtils.startAnimation(node, 'exit', DEFAULT_ANIMATIONS['exit']);
            // resolve animation callback and busy state
            busyStateResolver();
            callback();
        }, [addBusyState, onExiting]);
        // if animation is interrupted, the busyState may be left hanging. So clear that on unmount
        // Note: When using a class-based component inside a functional component, the timings of
        // componentDidMount and useEffect might differ. So, in order to guarantee the registration
        // of the cleanup function, use useLayoutEffect instead of useEffect. This way we can make sure
        // the cleanup registers at all times.
        hooks.useLayoutEffect(() => () => busyStateResolveRef.current?.(), []);
        return (jsxRuntime.jsx("div", { children: jsxRuntime.jsx(Transition, { ...transitionProps, onEntering: onEnteringCallback, onExiting: onExitingCallback }) }));
    }

    /**
     * @classdesc
     * A utility class consisting of helper functions for handling transitions
     * related operations.
     */
    class TransitionUtils {
        /**
         * Creates a map of the children array with the calculated in prop
         *
         * @param children The newly received children
         * @param prevChildMapping The previous child mapping
         * @returns the newly created child mapping
         */
        static getChildMapping(children, prevChildMapping = new Map(), onExited = () => { }) {
            // A symbol to store trailing children
            const TRAILING = Symbol();
            let mappedDeletions = {};
            if (prevChildMapping.size !== 0) {
                // If previous children exists, get the mapped deleted children
                mappedDeletions = TransitionUtils._getMappedDeletions(children, prevChildMapping, TRAILING);
            }
            // Create a new Map with the new children along with the deletions inserted in their
            // respective positions
            const mergedChildrenMap = children.reduce((accumulator, currentChild) => {
                if (mappedDeletions[currentChild.key]) {
                    // There are keys from prev that are deleted before the current
                    // next key, so add them first
                    const deletedChildren = mappedDeletions[currentChild.key];
                    for (const key of deletedChildren) {
                        const previousChild = prevChildMapping.get(key);
                        // Set the in property to false, as this is children is removed
                        accumulator.set(key, preact.cloneElement(previousChild, { in: false }));
                    }
                    // Then add the current key. Do not change the 'in' or 'onExited' properties as this is a
                    // retained child.
                    const previousChild = prevChildMapping.get(currentChild.key);
                    accumulator.set(currentChild.key, preact.cloneElement(currentChild, {
                        onExited: previousChild.props.onExited,
                        in: previousChild.props.in
                    }));
                }
                else {
                    // This is a new children. Set the in property to true
                    const newChild = preact.cloneElement(currentChild, {
                        // bind the original child so that the original callbacks can be
                        // called in the onExited callback from the argument.
                        onExited: onExited.bind(null, currentChild),
                        in: true
                    });
                    accumulator.set(currentChild.key, newChild);
                }
                return accumulator;
            }, new Map());
            // Finally add any trailing deleted children present in the mappedDeletions[TRAILING]
            for (const key of mappedDeletions[TRAILING] || []) {
                const previousChild = prevChildMapping.get(key);
                // Set the in property to false, as this is children is removed
                mergedChildrenMap.set(key, preact.cloneElement(previousChild, { in: false }));
            }
            // Finally return the merged children map
            return mergedChildrenMap;
        }
        ////////////////////////////
        // Private helper methods //
        ////////////////////////////
        /**
         * Creates a map of deleted children wrt to the keys in the new data.
         *
         * @param children The newly received children
         * @param prevChildMapping The previous child mapping
         * @param TRAILING A unique symbol to be used for storing the trailing children
         * @returns A map containing deleted children
         */
        static _getMappedDeletions(children, prevChildMapping, TRAILING) {
            // Create a set with keys of next children
            const nextChildrenKeys = new Set(children.map((children) => children.key));
            return [...prevChildMapping.keys()].reduce((accumulator, currentKey) => {
                if (nextChildrenKeys.has(currentKey)) {
                    // We have reached a point where the closest prevKey that
                    // is in the next, so if there are any pending keys add them
                    // to this key in mappedDeletions so that the pending keys will
                    // be added before the current next key
                    accumulator[currentKey] = accumulator[TRAILING];
                    delete accumulator[TRAILING];
                }
                else {
                    // If key is not found in next, then add it to the trailing keys.
                    const trailingChildren = accumulator[TRAILING]
                        ? [...accumulator[TRAILING], currentKey]
                        : [currentKey];
                    accumulator[TRAILING] = trailingChildren;
                }
                return accumulator;
            }, {});
        }
    }

    /**
     * @classdesc
     * The <TransitionGroup> component manages a set of components that involves animations.
     * This component does not handle any animation, rather just a state machine that manages
     * the mounting and unmounting of the components over the time. The actual animation needs
     * to be handled by the content component.
     *
     * Consider the example below:
     * <TransitionGroup>
     *   {
     *      messages.map(message => {
     *        <Transition key={message.key}>
     *          <Message
     *            type={type}
     *            index={index}
     *            item={data.message}
     *            onOjClose={onOjClose}
     *          />
     *        </Transition>
     *      });
     *   }
     * </TransitionGroup>
     * As the messages are added/removed, the TransitionGroup Component automatically
     * toggles the 'in' prop of the Transition Component.
     *
     * @ignore
     */
    class TransitionGroup extends preact.Component {
        /**
         * Derives state from the current props
         *
         * @param props The current Props that will be used to get the new state
         * @param state The current state
         *
         * @returns The new state
         */
        static getDerivedStateFromProps(props, state) {
            const { childMapping, handleExited } = state;
            return {
                childMapping: TransitionUtils.getChildMapping(props.children, childMapping, handleExited)
            };
        }
        ///////////////////////////
        // Handler functions end //
        ///////////////////////////
        /**
         * Instantiates Component
         *
         * @param props The component properties
         */
        constructor(props) {
            super(props);
            ////////////////////////////////////////////////////////////////////////
            // Handler functions are created as members to have them 'this' bound //
            ////////////////////////////////////////////////////////////////////////
            /**
             * Handles when a transition component exits
             *
             * @param child The child instance that exited
             * @param node The corresponding transition element
             * @param metadata The metadata of the corresponding transition component
             */
            this._handleExited = (child, node, metadata) => {
                const { children } = this.props;
                // get the child mapping for the current children
                const currentChildMapping = TransitionUtils.getChildMapping(children);
                // if the exited child is added again, do nothing here
                if (currentChildMapping.has(child.key))
                    return;
                // The child component has exited, call the original onExited callback
                child.props.onExited?.(node, metadata);
                // Check if this component is still mounted, if so update the state
                if (this._mounted) {
                    this.setState((state) => {
                        const childMapping = new Map(state.childMapping);
                        // delete the exited child
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
        //////////////////////////////////////
        // Component Life Cycle Hooks Start //
        //////////////////////////////////////
        /**
         * Life cycle hook that gets called when the component is mounted on to
         * the DOM
         */
        componentDidMount() {
            this._mounted = true;
        }
        /**
         * Life cycle hook that gets called when the component is unmounted from
         * the DOM
         */
        componentWillUnmount() {
            this._mounted = false;
        }
        ////////////////////////////////////
        // Component Life Cycle Hooks End //
        ////////////////////////////////////
        /**
         * Renders the transition components
         */
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

    /**
     * The component that renders individual messages for the provided data.
     */
    function MessagesManager({ data, children, onMessageWillRemove }) {
        /**
         * Handles when a message has finished to exit.
         *
         * @param node The corresponding message element
         * @param callback A callback function to be called after the animation is complete
         */
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
    /**
     * Handles KeyDown event in the document element during the capture phase.
     *
     * @param event The keydown event object
     */
    function handleDocumentKeyDownCapture(event) {
        // Do nothing if any of the following is true:
        // 1. No components are registered
        // 2. Pressed key is not F6
        // 3. Event is defaultPrevented
        if (componentsMap.size === 0 || event.key !== 'F6' || event.defaultPrevented) {
            return;
        }
        // Try cycling focus through the messages and if that fails
        // set the focus to the prior focused element.
        if (!cycleFocusThroughMessages(event)) {
            currentFocusedMessage && togglePreviousFocus(currentFocusedMessage, event);
        }
    }
    /**
     * Handles the blur event captured on the document
     * @param event Blur event object
     */
    function handleDocumentBlurCapture(event) {
        priorFocusedElement = event.target;
    }
    /**
     * Handles the keyup event in the component
     * @param id A unique symbol that ids the component to be registered for managing focus
     * @param event The keyup event object
     */
    function handleComponentKeyUp(id, event) {
        // Ignore the call if the comp is not registered anymore or event default is prevented
        if (!componentsMap.has(id) || event.defaultPrevented) {
            return;
        }
        // Additional checks for keyup event and recognized keys
        if (event.type === 'keyup' && ['Escape'].includes(event.key)) {
            // toggle focus to the previously focused element
            togglePreviousFocus(id, event);
        }
    }
    /**
     * Handles the focus event in the component
     * @param id A unique symbol that ids the component to be registered for managing focus
     * @param event The focus event object
     */
    function handleComponentFocus(id, event) {
        // Ignore the call if the comp is not registered anymore or event default is prevented
        if (!componentsMap.has(id) || event.defaultPrevented) {
            return;
        }
        // Store the id of the current focused message
        currentFocusedMessage = id;
        // Track previous focus if the priorFocused element is not a part of this or any other
        // registered component
        const { callbacks } = componentsMap.get(id);
        if (priorFocusedElement && !isPartOfRegisteredMessages(priorFocusedElement)) {
            priorFocusCache.set(id, priorFocusedElement);
            // since the focus moved to this component from outside, call the
            // onFocus callbacks if available
            callbacks?.onFocus?.();
        }
    }
    /**
     * Handles the blur event in the component
     * @param id A unique symbol that ids the component to be registered for managing focus
     * @param event The focus event object
     */
    function handleComponentBlur(id, event) {
        // Ignore the call if the comp is not registered anymore or event default is prevented
        if (!componentsMap.has(id) || event.defaultPrevented) {
            return;
        }
        // reset the current focus message ID
        currentFocusedMessage = undefined;
    }
    /**
     * Cycles the focus through the registered messages component from the previous message of current focused
     * message to the top of the hierarchy.
     *
     * @param event The event that initiated this action
     * @returns boolean indicating the result of this action
     */
    function cycleFocusThroughMessages(event) {
        // At this point, we need to focus the previous message from the current focused
        // message
        const nextPosition = indexOfOrDefaultTo(componentsOrder, currentFocusedMessage, componentsOrder.length) - 1;
        for (let i = nextPosition; i > -1; i--) {
            const id = componentsOrder[i];
            const { ref } = componentsMap.get(id) ?? {};
            if (ref?.current?.focus?.()) {
                // prevent default action as the event has transferred focus
                event.preventDefault();
                // invoke callback to let the current component know the focus is left
                if (currentFocusedMessage) {
                    const { callbacks } = componentsMap.get(currentFocusedMessage) ?? {};
                    callbacks?.onFocusLeave?.();
                }
                // Focus is set, so break the loop
                return true;
            }
        }
        return false;
    }
    /**
     * Checks if the provided element is a part of any of the registered messages
     *
     * @param element The candidate element
     * @returns true if is inside any of the registered messages
     */
    function isPartOfRegisteredMessages(element) {
        for (const { ref } of componentsMap.values()) {
            if (ref.current?.contains(element)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Finds the index of the item in the array, if it does not exist returns the
     * default value instead
     *
     * @param arr The array to perform the search
     * @param search The item to be searched
     * @param defaultIndex The default value if the item is not found
     * @returns The index of the item or the default value
     */
    function indexOfOrDefaultTo(arr, search, defaultIndex = -1) {
        const index = arr.indexOf(search);
        if (index !== -1)
            return index;
        return defaultIndex;
    }
    /**
     * Traverses through the priorFocusCache to fetch the last focused
     * element outside of the messages region.
     *
     * @param id The current focused message's ID
     * @returns The closest prior focused element, null if not found
     */
    function getClosestPriorFocusedElement(id) {
        // F6 navigation cycles through messages in reverse order
        // so to get the closest prior focused element we need to
        // traverse in natural order from the current message
        const index = componentsOrder.indexOf(id);
        for (let i = index; i < componentsOrder.length; i++) {
            if (priorFocusCache.has(componentsOrder[i])) {
                return priorFocusCache.get(componentsOrder[i]);
            }
        }
        // No prior cache found, so return null
        return null;
    }
    /**
     * Adds the component to the internal members.
     *
     * @param id A unique symbol that ids the component to be registered for managing focus
     * @param ref A ref handle to the focusable component
     * @param callbacks Optional callbacks
     */
    function addComponent(id, options) {
        componentsMap.set(id, options);
        componentsOrder.push(id);
    }
    /**
     * Removes the component from the internal members
     *
     * @param id A unique symbol that ids the component to be registered for managing focus
     */
    function removeComponent(id) {
        if (!componentsMap.has(id)) {
            return;
        }
        componentsMap.delete(id);
        componentsOrder.splice(componentsOrder.indexOf(id), 1);
    }
    /**
     * Clears the priorFocusCache of the specified component
     *
     * @param id The id of the component whose cache is to be cleared
     */
    function clearFocusCache(id) {
        priorFocusCache.delete(id);
    }
    /**
     * Adds event listeners to the document element
     */
    function addDocumentListeners() {
        // Add the events in capture phase, as we do not want this to be stopped by the elements
        // in the DOM tree.
        // make sure to use keydown as we need to prevent the default behavior which is moving to
        // the address bar in some browsers & OS.
        document.documentElement.addEventListener('keydown', handleDocumentKeyDownCapture, true);
        document.documentElement.addEventListener('blur', handleDocumentBlurCapture, true);
        hasDocumentListener = true;
    }
    /**
     * Removes event listeners from the document element
     */
    function removeDocumentListeners() {
        document.documentElement.removeEventListener('keydown', handleDocumentKeyDownCapture, true);
        document.documentElement.removeEventListener('blur', handleDocumentBlurCapture, true);
        hasDocumentListener = false;
    }
    /**
     * Registers a component for its focus to be managed.
     *
     * @param id A unique symbol that ids the component to be registered for managing focus
     * @param componentOptions An object containing component options
     * @param focusManagerOptions An object containing focus manager options
     *
     * @returns An object containing focus event listeners
     */
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
    /**
     * Focuses the element which was focused prior to the passed component.
     * @param id A unique symbol that ids the component to be registered for managing focus
     * @param event The event that initiated the focus transfer. The event will be default prevented if the focus
     *              is transferred successfully.
     * @returns true, if focus is restored. false otherwise.
     */
    function togglePreviousFocus(id, event) {
        const target = getClosestPriorFocusedElement(id);
        const { callbacks } = componentsMap.get(id) ?? {};
        if (target && document.body.contains(target)) {
            target.focus();
            // invoke callback to let the component know the focus is left
            callbacks?.onFocusLeave?.();
            // As the prior focus is restored, empty the focus cache
            priorFocusCache.clear();
            event?.preventDefault();
            return true;
        }
        // Prior focused element does not exist or
        // Element does not exist in DOM.
        return false;
    }
    /**
     * Unregisters a component from focus management
     *
     * @param id A unique symbol that ids the component to be registered for managing focus
     */
    function unregister(id) {
        removeComponent(id);
        clearFocusCache(id);
        if (hasDocumentListener && componentsMap.size === 0) {
            // no component is registered, so remove the document listeners
            removeDocumentListeners();
        }
    }
    /**
     * Moves the priority of the component with the specified id
     *
     * @param id A unique symbol that ids the component to be registered for managing focus
     */
    function prioritize(id) {
        if (!componentsMap.has(id)) {
            // Do nothing if the component is not registered
            return;
        }
        // Remove and add the component with the same ref
        // to move it in the priority queue
        const options = componentsMap.get(id);
        removeComponent(id);
        addComponent(id, options);
    }
    /**
     * The focus manager object
     */
    const messagesFocusManager = {
        prioritize,
        register,
        togglePreviousFocus,
        unregister
    };
    /**
     * A custom hook that handles focus management for the messages component.
     * @param ref The custom ref handle for the component
     * @param callbacks Optional callbacks
     * @returns The handlers and a controller
     */
    function useMessageFocusManager(ref, callbacks, options) {
        const id = hooks.useRef(Symbol());
        const focusManager = hooks.useRef(messagesFocusManager);
        const [handlers, setHandlers] = hooks.useState({});
        const controller = hooks.useMemo(() => ({
            prioritize: () => focusManager.current.prioritize(id.current),
            restorePriorFocus: () => focusManager.current.togglePreviousFocus(id.current)
        }), []);
        // Register handlers for focus management
        hooks.useEffect(() => {
            const currentFocusManager = focusManager.current;
            const currentId = id.current;
            setHandlers(currentFocusManager.register(currentId, { ref, callbacks }, options));
            return () => currentFocusManager.unregister(currentId);
            // eslint-disable-next-line
        }, []); // we only want this to run on mount
        return {
            handlers,
            controller
        };
    }

    // Function to get the appropriate live region text wrt device type.
    const getLiveRegionTextByDevice = (context, translations) => {
        // 'others' is returned if not 'phone' or 'tablet', which are both touch devices.
        const deviceType = Config.getDeviceType() === 'others' ? 'keyboard' : 'touch';
        const keys = {
            toMessages: {
                touch: 'navigationToTouch',
                keyboard: 'navigationToMessagesRegion'
            },
            fromMessages: {
                touch: '',
                keyboard: 'navigationFromMessagesRegion'
            }
        };
        return translations?.[keys[context][deviceType]] || ''; // Default fallback
    };
    /**
     * Renders individual messages based on the provided data
     */
    function MessageBanner({ detailRendererKey, data, onClose, renderers, translations, type = 'section' }) {
        // Keyboard Navigation and Focus Management
        const messagesRef = hooks.useRef(new Map());
        const containerDivRef = hooks.useRef(null);
        const focusHandleRef = hooks.useRef(null);
        const [liveRegionText, setLiveRegionText] = hooks.useState();
        const [shouldRender, setShouldRender] = hooks.useState(data.length > 0);
        // We need a ref that holds the current & previous data length, as the exiting
        // node will always call handleNextFocus with previous data.
        // As in TransitionGroup, when an item is removed from the data, a new vnode
        // will not be created instead previous vnode will be used. So, the new handleNextFocus
        // will not be called when the old vnode exits. Thus, we will be using a ref
        // to always get the correct current data length.
        const dataLengthRef = hooks.useRef(data.length);
        const prevDataLengthRef = hooks.useRef(0);
        // Update the data length ref
        dataLengthRef.current = data.length;
        // We will be using a function based ref to store the refs in the Map
        const setMessageRef = hooks.useCallback(
        // TODO: use ramda.curry here (currently it is throwing ts error when used with generics)
        (key) => {
            return (ref) => messagesRef.current.set(key, ref);
        }, []);
        // Update the focusHandleRef
        hooks.useImperativeHandle(focusHandleRef, () => ({
            focus: () => {
                // Only trigger focus if the component is rendering messages and is visible in the DOM.
                // Note: we only care if they consume space in the page layout. We consider elements
                // that are "opacity: 0" or "visibility: hidden" as visible, as they both consume space in the page
                // layout. And this is the way we did things in oj-messages.
                const isVisible = containerDivRef.current
                    ? // this API is available only on Safari 17.4 (Mar 2024) or greater (https://developer.mozilla.org/en-US/docs/Web/API/Element/checkVisibility#browser_compatibility)
                        // other browsers have support for a long time (since 2022).
                        containerDivRef.current.checkVisibility
                            ? containerDivRef.current.checkVisibility()
                            : // if checkVisibility is not available, fallback to checking offsetParent.
                                // This property will be `null` if this or any of the ancestor has display: 'none'.
                                // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
                                containerDivRef.current.offsetParent != null // if checkVisibility
                    : false;
                if (data.length && isVisible) {
                    const firstItemKey = data[0].key;
                    messagesRef.current.get(firstItemKey)?.focus();
                    return true;
                }
                return false;
            },
            contains: (element) => {
                // Only invoke method if the component is rendering messages
                if (data.length && element) {
                    return containerDivRef.current?.contains(element) ?? false;
                }
                return false;
            }
        }), [data]);
        // Register handlers for focus management
        const { controller, handlers } = useMessageFocusManager(focusHandleRef, {
            onFocus: hooks.useCallback(() => {
                setLiveRegionText(getLiveRegionTextByDevice('fromMessages', translations));
            }, [setLiveRegionText, translations])
        });
        /**
         * Emits onClose event for the provided message.
         * @param item The message which the user tried to close
         */
        const handleClose = hooks.useCallback((item) => {
            onClose?.(item);
        }, [onClose]);
        /**
         * Handles focus when a message is closed and animated away from the DOM
         * @param key The key of the message
         * @param index The index of the message
         */
        const handleNextFocus = hooks.useCallback((_key, index, closedMessageNode) => {
            const isClosedMessageFocused = closedMessageNode?.contains(document.activeElement);
            // If there are no messages, do not render anything. As the old messages
            // are still in the DOM, use the data count to determine what to do next as it
            // represents the next state.
            if (dataLengthRef.current === 0) {
                setShouldRender(false);
                // If the current message holds focus, then restore previous focus
                if (isClosedMessageFocused) {
                    controller.restorePriorFocus();
                }
                return;
            }
            // In TransitionGroup, when an item is removed from the data, a new vnode
            // will not be created instead previous vnode will be used. So, the new handleNextFocus
            // will not be called when the old vnode exits. Thus, all the deps will not be pointing to
            // the current references, rather they will be pointing to the ones where this vnode
            // last existed in the data.
            // This means, the data will contain the closing message as well. But, all the ref objects
            // still point to the most up-to-date values. With that in mind, we will be evaluating the
            // following values.
            const renderedMessagesCount = data.length;
            // Now that this message is closed, focus the next message that will take this index. If no
            // message will take this message's index, then it means that this is the last message. If
            // that is the case, focus the message at the previous index.
            // Use the count of the messages that are currently shown in the UI (current state including
            // the message that will be removed). This way we can get the correct item from the data
            // as it will contain the closing message as well.
            const nextMessageIndexToFocus = index + 1 < renderedMessagesCount ? index + 1 : index - 1;
            // if next message is available then transfer the focus to the next element
            if (nextMessageIndexToFocus > -1 && isClosedMessageFocused) {
                const nextMessageKey = data[nextMessageIndexToFocus].key;
                messagesRef.current.get(nextMessageKey)?.focus();
            }
        }, [controller, data]);
        // Prioritize this component whenever the data changes and
        // the new data has at least one message
        hooks.useEffect(() => {
            if (data.length) {
                // set state to render content whenever the data is not empty
                setShouldRender(true);
                if (data.length > prevDataLengthRef.current) {
                    // Only when having a new message, update the aria-live area with the
                    // text to indicate how to get the focus to the new message.
                    setLiveRegionText(getLiveRegionTextByDevice('toMessages', translations));
                }
                controller.prioritize();
            }
            else {
                // When there are no messages, clear the live region so that
                // the navigation text will be read when a new message appear
                setLiveRegionText('');
            }
            prevDataLengthRef.current = data.length;
        }, [controller, data, translations]);
        // When both shouldRender flag is false and no data to render, do not render
        // anything
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
    /**
     * @classdesc
     * <h3 id="bannerOverview-section">
     *   JET Message Banner
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#bannerOverview-section"></a>
     * </h3>
     * <p>Description:</p>
     * <p>Message banners are brief, moderately disruptive, semi-permanent messages that help communicate
     * relevant and useful information in the context of the current page or actions in progress,
     * without blocking the interaction on that page.</p>
     *
     * <h4 id="messages-syntax-section">
     *  Syntax
     *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-syntax-section"></a>
     * </h4>
     * Message Banner can be created with the following markup.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-message-banner data="[[messages]]" type="page">
     * &lt;/oj-message-banner>
     * </code></pre>
     *
     * <p>The Message Banner component will show messages based on the data provided keeping it as a single
     * source of truth. Applications should register a listener for the ojClose event to be notified
     * when one performs an action that requires a message to be closed. The application then should use the
     * event payload to identify and remove the corresponding row from the data which would then close the
     * message.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-message-banner data="[[messages]]" type="page" on-oj-close="[[handleClose]]">
     * &lt;/oj-message-banner>
     * </code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>The <code class="prettyprint">MessageBannerItem["sound"]</code> property is an accessibility
     * feature for playing a sound when a message is opened. This property defaults to "none", and can
     * be enabled by setting it to "default" or by providing a URL to an audio file of a format that the
     * browser supports. An accessible application must provide a way for users to enable sound on a
     * settings or preferences page. Some browsers will have auto-play disabled by default, enabling
     * it may require adjusting the browser settings.</p>
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     *
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
     *       <td rowspan = "3">Focus within Messages</td>
     *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
     *       <td>Navigate the content of the messages region.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>F6</kbd></td>
     *       <td>Cycles the focus through all the messages sections on the page starting from the most recent one.
     *           Then finally, moves the focus back to the last focused element outside the messages region.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Moves focus back to the last focused element outside the messages region and closes the current message if it is closable.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Activates the currently focused element in the message.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan = "1">Focus outside Messages</td>
     *       <td><kbd>F6</kbd></td>
     *       <td>Move focus to the first message within the more recently disclosed messages region.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="migration-section">
     *   Migration
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
     * </h3>
     *
     * <p>
     * To migrate from oj-message-banner to oj-c-message-banner, you need to revise the import statement
     * and references to oj-c-message-banner in your app. Please note the changes between the two
     * components below.
     * </p>
     *
     * <h5>detail-template-value</h5>
     * <p>
     * When using a function for the detail-template-value attribute, you now need to return <code>undefined</code> to
     * have the component render the default detail content. Returning <code>null</code> is not supported in the
     * oj-c-message-banner component.
     * </p>
     *
     * <h5>MessageBannerTemplateContext</h5>
     * <p>
     * The template context provided for the template slots will not have the <code>index</code> property in the
     * oj-c-message-banner component. If needed, applications can still use the <code>key</code> property to
     * identify the message being rendered.
     * </p>
     *
     * <h5>Sorting</h5>
     * <p>
     * The oj-c-message-banner sorts the messages by default based on the decreasing order of severity. The messages of the
     * same severity are then sorted in reverse chronological order. Set the sorting attribute to "off" to show the
     * messages in the order that they appear in the data.
     *
     * @typeparam {object} K Type of key of the dataprovider. It can either be a string or a number.
     * @typeparam {object} D Type of the data from the dataprovider. It must extend the MessageBannerItem type.
     * @ojmetadata description "Message Banners are brief, moderately disruptive, semi-permanent messages that help communicate relevant and useful information."
     * @ojmetadata displayName "Message Banner"
     * @ojmetadata main "ojs/ojmessagebanner"
     * @ojmetadata extension {
     *   "oracle": {
     *     "icon": "oj-ux-ico-message-banner",
     *     "uxSpecs": ["bannerMessages"]
     *   },
     *   "themes": {
     *     "unsupportedThemes": ["Alta"]
     *   },
     *   "vbdt": {
     *     "module": "ojs/ojmessagebanner",
     *     "defaultColumns": "6",
     *     "minColumns": "2"
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "type"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data"
     *     ]
     *   }
     * ]
     * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojMessageBanner.html"
     * @ojmetadata since "12.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "maintenance",
     *     "since": "16.0.0",
     *     "value": ["oj-c-message-banner"]
     *   }
     * ]
     */
    exports.MessageBanner = class MessageBanner$1 extends preact.Component {
        /**
         * Derives state from the current props
         *
         * @param props The current Props that will be used to get the new state
         * @param state The current state
         *
         * @returns The new state
         */
        static getDerivedStateFromProps(props, state) {
            const { data } = props;
            const { dataProviderCount, previousDataProvider } = state;
            if (data !== previousDataProvider) {
                // DP is updated, so update the counter
                return {
                    dataProviderCount: dataProviderCount + 1,
                    previousDataProvider: data
                };
            }
            // DP is not changed, so return null to use the same state.
            return null;
        }
        ///////////////////////////
        // Handler functions end //
        ///////////////////////////
        /**
         * Instantiates Banner Component
         *
         * @param props The component properties
         */
        constructor(props) {
            super(props);
            ////////////////////////////////////////////////////////////////////////
            // Handler functions are created as members to have them 'this' bound //
            ////////////////////////////////////////////////////////////////////////
            /**
             * Set the busy state on the component element and returns a resolver function
             * for the same.
             *
             * @param description The description for the current action
             *
             * @returns The resolver for the set busyState
             */
            this._addBusyState = (description) => {
                const busyContext = Context.getContext(this._rootRef.current).getBusyContext();
                return busyContext.addBusyState({ description });
            };
            /**
             * Emits onOjClose event for the provided message.
             *
             * @param context The message which the user tried to close
             */
            this._handleCloseMessage = (context) => {
                this.props.onOjClose?.(context);
            };
            this._rootRef = preact.createRef();
            this.state = { dataProviderCount: 0, previousDataProvider: props.data };
            this.WrapperMessagesContainer = ojdataproviderhandler.withDataProvider(MessageBanner, 'data');
        }
        //////////////////////////////////////
        // Component Life Cycle Hooks Start //
        //////////////////////////////////////
        ////////////////////////////////////
        // Component Life Cycle Hooks End //
        ////////////////////////////////////
        /**
         * Renders the Message Banner component
         * @returns The rendered oj-message-banner component
         */
        render(props) {
            const { data, detailTemplateValue, messageTemplates, type } = props;
            const { dataProviderCount } = this.state;
            const messagesContext = { addBusyState: this._addBusyState };
            return (jsxRuntime.jsx(ojvcomponent.Root, { ref: this._rootRef, children: jsxRuntime.jsx(MessagesContext.Provider, { value: messagesContext, children: jsxRuntime.jsx(this.WrapperMessagesContainer, { addBusyState: this._addBusyState, data: data, type: type, detailRendererKey: detailTemplateValue, renderers: messageTemplates, onClose: this._handleCloseMessage, translations: {
                            close: Translations.getTranslatedString('oj-ojMessageBanner.close'),
                            navigationFromMessagesRegion: Translations.getTranslatedString('oj-ojMessageBanner.navigationFromMessagesRegion'),
                            navigationToMessagesRegion: Translations.getTranslatedString('oj-ojMessageBanner.navigationToMessagesRegion'),
                            navigationToTouch: Translations.getTranslatedString('oj-ojMessageBanner.navigationToTouch'),
                            error: Translations.getTranslatedString('oj-ojMessageBanner.error'),
                            warning: Translations.getTranslatedString('oj-ojMessageBanner.warning'),
                            info: Translations.getTranslatedString('oj-ojMessageBanner.info'),
                            confirmation: Translations.getTranslatedString('oj-ojMessageBanner.confirmation')
                        } }, `dataProvider${dataProviderCount}`) }) }));
        }
    };
    /**
     * Default values for Props
     */
    exports.MessageBanner.defaultProps = {
        /**
         * By default the messages are rendered for the section-level messaging.
         */
        type: 'section'
    };
    exports.MessageBanner._metadata = { "properties": { "data": { "type": "object" }, "type": { "type": "string", "enumValues": ["page", "section"] }, "detailTemplateValue": { "type": "string|function" } }, "extension": { "_DYNAMIC_SLOT": { "prop": "messageTemplates", "isTemplate": 1 } }, "events": { "ojClose": {} } };
    exports.MessageBanner = __decorate([
        ojvcomponent.customElement('oj-message-banner')
    ], exports.MessageBanner);

    Object.defineProperty(exports, '__esModule', { value: true });

});
