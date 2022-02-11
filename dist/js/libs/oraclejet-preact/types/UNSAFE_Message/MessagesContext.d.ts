/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Messages Context
 */
declare type MessagesContextProps = {
    /**
     * An optional function that adds busy state to the root element
     */
    addBusyState?: (description?: string) => () => void;
};
/**
 * Context which the parent custom element components can use for passing down
 * the busy context
 */
declare const MessagesContext: import("preact").Context<MessagesContextProps>;
/**
 * Uses the MessagesContext if one is available.
 *
 * @returns The context from the closes provider
 */
declare function useMessagesContext(): MessagesContextProps;
export { MessagesContext, useMessagesContext };
