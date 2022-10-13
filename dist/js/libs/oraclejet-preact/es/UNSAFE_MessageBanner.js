/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { useMessageFocusManager } from './hooks/UNSAFE_useMessagesFocusManager.js';
import { LiveRegion } from './UNSAFE_LiveRegion.js';
import { MessagesManager, Message, getRenderer } from './UNSAFE_Message.js';
import { useRef, useState, useCallback, useImperativeHandle, useEffect } from 'preact/hooks';
import { Flex } from './UNSAFE_Flex.js';

import './utils/UNSAFE_classNames.js';
import 'preact';
import './utils/UNSAFE_getLocale.js';
import './utils/UNSAFE_stringUtils.js';
import './utils/UNSAFE_arrayUtils.js';
import './UNSAFE_ThemedIcons.js';
import './UNSAFE_Icon.js';
import './tslib.es6-deee4931.js';
import './hooks/UNSAFE_useUser.js';
import './UNSAFE_Environment.js';
import './UNSAFE_Layer.js';
import 'preact/compat';
import './hooks/UNSAFE_useTheme.js';
import './UNSAFE_Icons.js';
import './utils/UNSAFE_logger.js';
import './_curry1-b6f34fc4.js';
import './_curry2-255e04d1.js';
import './utils/UNSAFE_soundUtils.js';
import './UNSAFE_TransitionGroup.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_has-f370c697.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-77d2b8e6.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';

/**
 * Animation config for banner messages.
 * TODO: Get this from theme context provider
 */
const DEFAULT_ANIMATIONS = {
    enter: [{ effect: 'expand', duration: '0.25s', direction: 'height' }],
    exit: [{ effect: 'collapse', duration: '0.25s', direction: 'height' }]
};
/**
 * Default translations for banner messages.
 * TODO: Replace this with preact translations
 */
const DEFAULT_TRANSLATIONS = {
    close: 'Close',
    navigationFromMessagesRegion: 'Entering messages region. Press F6 to navigate back to prior focused element.',
    navigationToMessagesRegion: 'Messages region has new messages. Press F6 to navigate to the most recent message region.',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    confirmation: 'Confirmation'
};
/**
 * Renders individual messages based on the provided data
 */
function MessageBanner({ closeButtonRenderer, detailRendererKey, data, onClose, renderers, startAnimation, translations = DEFAULT_TRANSLATIONS, type = 'section' }) {
    // Keyboard Navigation and Focus Management
    const messagesRef = useRef(new Map());
    const containerDivRef = useRef(null);
    const focusHandleRef = useRef(null);
    const [liveRegionText, setLiveRegionText] = useState();
    const [shouldRender, setShouldRender] = useState(data.length > 0);
    // We need a ref that holds the current & previous data length, as the exiting
    // node will always call handleNextFocus with previous data.
    // As in TransitionGroup, when an item is removed from the data, a new vnode
    // will not be created instead previous vnode will be used. So, the new handleNextFocus
    // will not be called when the old vnode exits. Thus, we will be using a ref
    // to always get the correct current data length.
    const dataLengthRef = useRef(data.length);
    const prevDataLengthRef = useRef(0);
    // Update the data length ref
    dataLengthRef.current = data.length;
    // We will be using a function based ref to store the refs in the Map
    const setMessageRef = useCallback(
    // TODO: use ramda.curry here (currently it is throwing ts error when used with generics)
    (key) => {
        return (ref) => messagesRef.current.set(key, ref);
    }, []);
    // Update the focusHandleRef
    useImperativeHandle(focusHandleRef, () => ({
        focus: () => {
            var _a;
            // Only trigger focus if the component is rendering messages
            if (data.length) {
                const firstItemKey = data[0].key;
                (_a = messagesRef.current.get(firstItemKey)) === null || _a === void 0 ? void 0 : _a.focus();
                return true;
            }
            return false;
        },
        contains: (element) => {
            var _a, _b;
            // Only invoke method if the component is rendering messages
            if (data.length && element) {
                return (_b = (_a = containerDivRef.current) === null || _a === void 0 ? void 0 : _a.contains(element)) !== null && _b !== void 0 ? _b : false;
            }
            return false;
        }
    }), [data, messagesRef]);
    // Register handlers for focus management
    const { controller, handlers } = useMessageFocusManager(focusHandleRef, {
        onFocus: useCallback(() => {
            setLiveRegionText(translations.navigationFromMessagesRegion);
        }, [setLiveRegionText])
    });
    /**
     * Emits onClose event for the provided message.
     * @param item The message which the user tried to close
     */
    const handleClose = useCallback((item) => {
        onClose === null || onClose === void 0 ? void 0 : onClose(item);
    }, [onClose]);
    /**
     * Handles focus when a message is closed and animated away from the DOM
     * @param key The key of the message
     * @param index The index of the message
     */
    const handleNextFocus = useCallback((_key, index, closedMessageNode) => {
        var _a;
        const isClosedMessageFocused = closedMessageNode === null || closedMessageNode === void 0 ? void 0 : closedMessageNode.contains(document.activeElement);
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
            (_a = messagesRef.current.get(nextMessageKey)) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [controller, data]);
    // Prioritize this component whenever the data changes and
    // the new data has at least one message
    useEffect(() => {
        if (data.length) {
            // set state to render content whenever the data is not empty
            setShouldRender(true);
            if (data.length > prevDataLengthRef.current) {
                // Only when having a new message, update the aria-live area with the
                // text to indicate how to get the focus to the new message.
                setLiveRegionText(translations.navigationToMessagesRegion);
            }
            controller.prioritize();
        }
        else {
            // When there are no messages, clear the live region so that
            // the navigation text will be read when a new message appear
            setLiveRegionText('');
        }
        prevDataLengthRef.current = data.length;
    }, [data, controller]);
    // When both shouldRender flag is false and no data to render, do not render
    // anything
    if (!shouldRender && data.length === 0) {
        return null;
    }
    return (jsx("div", Object.assign({ ref: containerDivRef, class: "oj-c-messagebanner", tabIndex: -1 }, handlers, { children: jsxs(Flex, Object.assign({ direction: "column", gap: type === 'section' ? '1x' : undefined }, { children: [jsx(MessagesManager, Object.assign({ animations: DEFAULT_ANIMATIONS, data: data, startAnimation: startAnimation, onMessageWillRemove: handleNextFocus }, { children: ({ index, item }) => {
                        return (jsx(Message, { messageRef: setMessageRef(item.key), item: item, closeButtonRenderer: closeButtonRenderer, detailRenderer: getRenderer(item, detailRendererKey, renderers), index: index, translations: translations, type: type, onClose: handleClose }, item.key));
                    } })), jsx(LiveRegion, { children: liveRegionText })] })) })));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { MessageBanner };
/*  */
//# sourceMappingURL=UNSAFE_MessageBanner.js.map
