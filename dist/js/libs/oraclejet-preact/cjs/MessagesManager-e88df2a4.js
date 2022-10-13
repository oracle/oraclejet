/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var preact = require('preact');
var hooks = require('preact/hooks');
var UNSAFE_TransitionGroup = require('./UNSAFE_TransitionGroup.js');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
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
 * The component that renders individual messages for the provided data.
 */
function MessagesManager(props) {
    const { children, data } = props;
    const { handleEntering, handleExiting } = useMessagesManager(props);
    return (jsxRuntime.jsx(UNSAFE_TransitionGroup.TransitionGroup, Object.assign({ elementType: preact.Fragment }, { children: data.map((item, index) => (jsxRuntime.jsx(UNSAFE_TransitionGroup.Transition, Object.assign({ metadata: { index, key: item.key }, onEntering: handleEntering, onExiting: handleExiting }, { children: children === null || children === void 0 ? void 0 : children({ index, item }) }), item.key))) })));
}
/**
 * A custom hook for creating the listeners for the MessagesManager
 *
 * @param param0 The props for the messages
 * @returns The transition listeners
 */
function useMessagesManager({ animations, startAnimation = () => Promise.resolve(false), onMessageWillRemove }) {
    const { addBusyState } = useMessagesContext();
    /**
     * Adds busy state if available in the context
     *
     * @param description The description of the busyState
     * @returns The busyState resolver
     */
    const _addBusyState = hooks.useCallback((description) => {
        var _a;
        return (_a = addBusyState === null || addBusyState === void 0 ? void 0 : addBusyState(description)) !== null && _a !== void 0 ? _a : (() => { });
    }, [addBusyState]);
    /**
     * Performs animation.
     *
     * @param type The type of the animation
     * @param base The root DOM element
     */
    const performAnimation = hooks.useCallback(async (type, base) => {
        if (!base) {
            return;
        }
        const animation = animations === null || animations === void 0 ? void 0 : animations[type];
        if (animation) {
            const busyStateResolver = _addBusyState(`performing message animation - ${type}`);
            // If an animation is provided for the current transition, perform the animation
            await startAnimation(base, type, animation);
            busyStateResolver();
        }
    }, [animations, startAnimation, _addBusyState]);
    /**
     * Handles when a message is successfully entered.
     *
     * @param node The corresponding message element
     * @param callback A callback function to be called after the animation is complete
     */
    const handleEntering = hooks.useCallback(async (node, callback) => {
        await performAnimation('enter', node);
        callback === null || callback === void 0 ? void 0 : callback();
    }, [performAnimation]);
    /**
     * Handles when a message has started to exit.
     *
     * @param node The corresponding message element
     * @param callback A callback function to be called after the animation is complete
     */
    const handleExiting = hooks.useCallback(async (node, callback, metadata) => {
        await performAnimation('exit', node);
        metadata && (onMessageWillRemove === null || onMessageWillRemove === void 0 ? void 0 : onMessageWillRemove(metadata.key, metadata.index, node));
        callback === null || callback === void 0 ? void 0 : callback();
    }, [performAnimation, onMessageWillRemove]);
    return { handleEntering, handleExiting };
}

exports.MessagesContext = MessagesContext;
exports.MessagesManager = MessagesManager;
/*  */
//# sourceMappingURL=MessagesManager-e88df2a4.js.map
