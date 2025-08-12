/**
 * The Remounter component should be used to remount a custom element when its slot layout
 * chnages. This is useful for cases when (1) a custom element does not use shadow DOM, and
 * (2) parent component's re-render may rearrange slots in a way that would affect their patching
 * and distribution
 * Example:
 * <pre class="prettyprint">
 * <code>
 * &lt;Remounter>
 *   <oj-button>
 *    &lt;span slot="startIcon" class="start">&lt;/span>
 *    {props.showEnd &&
 *      &lt;span slot="endIcon" class>="end"&lt;/span>
 *    }
 *  &lt;/oj-button>
 * &lt;/Remounter>
 * </code>
 * </pre>
 * In the example above, the "endIcon" slot is rendered conditionally, and the Remounter is responsible for remounting
 * the <oj-button> element whenever the condition changes.
 *
 * Note that the Remounter will not be tracking slots produced by the custom element's class-based component or
 * functional component children.
 *
 * The Remounter will throw an error if its number of children is not equal to one, or if its child is not an element node.
 * @ignore
 */
import { Component, VNode, RenderableProps } from 'preact';
type Props = {};
export declare class Remounter extends Component<Props> {
    render(props: RenderableProps<Props>): VNode<any>[];
    private _getElementKey;
    private _getSlotInfo;
    private _isVNode;
}
export {};
