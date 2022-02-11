/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component, ComponentChild, RenderableProps } from 'preact';
/**
 * Supported transitions
 */
declare type TransitionCompleteStatus = 'entered' | 'exited';
declare type TransitionIntermediateStatus = 'entering' | 'exiting' | null;
declare type TransitionStatus = TransitionCompleteStatus | TransitionIntermediateStatus;
/**
 * State for the Transition component
 */
declare type State = {
    status: TransitionStatus;
};
/**
 * Props for the Transition Component
 */
export declare type TransitionProps<M = any> = {
    /**
     * A boolean for whether or not to the show the child content. Usually, this represents
     * whether or the current item existing in the data.
     */
    in?: boolean;
    /**
     * An optional metadata that will be passed along on all callbacks
     */
    metadata?: M;
    /**
     * Called when the component enters for the first time.
     */
    onEnter?: (node?: Element, metadata?: M) => void;
    /**
     * Called when the component enters for the first time and right after onEnter call.
     */
    onEntering?: (node?: Element, callback?: () => void, metadata?: M) => void;
    /**
     * Called when the component enters for the first time and all the enter transitions are over.
     */
    onEntered?: (node?: Element, metadata?: M) => void;
    /**
     * Called when the component exits.
     */
    onExit?: (node?: Element, metadata?: M) => void;
    /**
     * Called when the component exits and right after the onExit call.
     */
    onExiting?: (node?: Element, callback?: () => void, metadata?: M) => void;
    /**
     * Called when the component exits and all the transitions are over.
     */
    onExited?: (node?: Element, metadata?: M) => void;
};
/**
 * @classdesc
 * The component that acts as a layer for handing transitions.
 *
 * @ignore
 */
export declare class Transition<M = any> extends Component<TransitionProps<M>, State> {
    private readonly _appearStatus;
    private _nextCallback;
    /**
     * Instantiates Component
     *
     * @param props The component properties
     */
    constructor(props: Readonly<TransitionProps<M>>);
    /**
     * Lifecycle hook that gets called when the component is mounted to the DOM
     */
    componentDidMount(): void;
    /**
     * Lifecycle hook that gets called after each update to the component
     *
     * @param prevProps The props of the component before last update
     */
    componentDidUpdate(prevProps: Readonly<TransitionProps<M>>): void;
    /**
     * Lifecycle hook that gets called right before the component unmounts
     */
    componentWillUnmount(): void;
    /**
     * Renders the Transition component
     *
     * @param props The current props
     * @returns The rendered component child
     */
    render(props?: RenderableProps<TransitionProps<M>>): ComponentChild;
    /**
     * Creates a wrapper callback function, which can be cancelled.
     *
     * @param callback The current callback function
     * @returns The created cancellable callback
     */
    private _setNextCallback;
    /**
     * Cancels the scheduled next callback
     */
    private _cancelNextCallback;
    /**
     * Updates the status of the component. Performs corresponding Transitions.
     */
    private _updateStatus;
    /**
     * Perform Entering transitions
     *
     * @param node The root DOM element of this component
     */
    private _performEnter;
    /**
     * Perform Exiting transitions
     *
     * @param node The root DOM element of this component
     */
    private _performExit;
}
export {};
