/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component, ComponentChild, ComponentType, VNode } from 'preact';
import { TransitionProps } from './Transition';
import { ChildKey, ChildMapping } from './TransitionUtils';
/**
 * Props for the TransitionGroup Component
 */
declare type TransitionGroupProps = {
    /**
     * @description
     * <TransitionGroup> renders a '<div>' by default. You can change this
     * behavior by providing a different value to this prop.
     */
    elementType?: string | ComponentType;
    /**
     * @description
     * Children component should be a collection of TransitionComponent. The child
     * components should be a Transition Component.
     */
    children: VNode<TransitionProps>[];
};
/**
 * State for the TransitionGroup component
 */
declare type State = {
    childMapping?: ChildMapping;
    handleExited?: (child: VNode<TransitionProps>, node: Element, key?: ChildKey) => void;
};
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
export declare class TransitionGroup extends Component<TransitionGroupProps, State> {
    static defaultProps: Partial<TransitionGroupProps>;
    /**
     * Derives state from the current props
     *
     * @param props The current Props that will be used to get the new state
     * @param state The current state
     *
     * @returns The new state
     */
    static getDerivedStateFromProps(props: Readonly<TransitionGroupProps>, state: Readonly<State>): State | null;
    private _mounted;
    /**
     * Handles when a transition component exits
     *
     * @param child The child instance that exited
     * @param node The corresponding transition element
     * @param key The key of the corresponding transition component
     */
    private readonly _handleExited;
    /**
     * Instantiates Component
     *
     * @param props The component properties
     */
    constructor(props: Readonly<TransitionGroupProps>);
    /**
     * Life cycle hook that gets called when the component is mounted on to
     * the DOM
     */
    componentDidMount(): void;
    /**
     * Life cycle hook that gets called when the component is unmounted from
     * the DOM
     */
    componentWillUnmount(): void;
    /**
     * Renders the transition components
     */
    render(): ComponentChild;
}
export {};
