/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact'], function (exports, preact) { 'use strict';

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
    class Remounter extends preact.Component {
        render(props) {
            let children = preact.toChildArray(props?.children);
            let first = children[0];
            if (this._isVNode(first) &&
                typeof first.type === 'function' &&
                first.type['__ojIsEnvironmentWrapper']) {
                // The node type is a constructor, so assume that this is an EnvironmentWrapper.
                // Lets get its children for cloning.
                children = preact.toChildArray(first.props?.children);
                first = children[0];
            }
            if (children.length !== 1 || !this._isVNode(first) || typeof first.type !== 'string') {
                throw new Error('The only child of the Remounter must be a custom element node');
            }
            const key = this._getElementKey(first);
            // There is no need to clone the EnvironmentWrapper, it is going to be added again
            // at the cloneElement() step.
            return [preact.cloneElement(first, { key })];
        }
        _getElementKey(elem) {
            // toChildArray will return empty array if children are undefined
            const slots = preact.toChildArray(elem.props?.children);
            // String and number are used 'as is', VNodes are turned into objects
            // with 'key', 'slot' and 'type' as keys
            const slotInfos = slots.map((slot) => this._isVNode(slot) ? this._getSlotInfo(slot) : slot);
            return JSON.stringify(slotInfos);
        }
        _getSlotInfo(slot) {
            let type = slot.type;
            // If the type is not a string, try getting 'name' for function or class
            type = typeof type === 'string' ? type : type.name || String(type);
            // object keys that have undefined values will be skipped by JSON.stringify
            return { key: slot.key, type, slot: slot.props?.slot };
        }
        _isVNode(node) {
            // toChildArray() will remove null, undefined and boolean nodes
            return typeof node !== 'string' && isNaN(node);
        }
    }

    exports.Remounter = Remounter;

    Object.defineProperty(exports, '__esModule', { value: true });

});
