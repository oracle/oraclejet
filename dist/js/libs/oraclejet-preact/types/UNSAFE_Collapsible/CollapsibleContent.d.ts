import { h, JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
declare type ContentProps = IntrinsicProps & {
    id: string;
    expanded: boolean;
    onTransitionEnd: (event: TransitionEvent) => void;
};
/**
 * Content subcomponent - expand/collapse animation is implemented using a CSS
 * transition on the max-height style property.
 *
 * The transition from collapsed to expanded works as follows:
 * 1. When the component is initially rendered in the collapsed state, we
 *    explicitly set the max-height to 0.
 * 2. When the expanded prop changes from false to true, we trigger the
 *    transition by setting manually setting the max-height to match the
 *    component's scroll height.
 * 3. Once the transition has completed, we no longer want to constriain
 *    the max-height, since the component content should be free to reflow
 *    as needed. As such, we reset the max-height to "none" on transition end.
 *
 * The transition from expanded to collapsed is similar:
 * 1. When detect that the expanded prop is changing from true to to false,
 *    we pin the max-height to the current scroll height during render.
 * 2. Then max-height is manually set to 0 in an effect callback.
 * 3. Unlike in the expanded case, we don't bother resetting the max-height
 *    after the transition completes, as the collapsed content is not visible
 *    and thus does not reflow.
 */
export declare const CollapsibleContent: ({ children, id, expanded, onTransitionEnd }: ContentProps) => h.JSX.Element;
export {};
