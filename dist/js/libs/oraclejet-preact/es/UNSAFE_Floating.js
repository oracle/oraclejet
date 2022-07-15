/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx } from 'preact/jsx-runtime';
import { useLayoutEffect, useMemo } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { u as useFloating, o as offset, b, D, N } from './index-8347aa9c.js';
import useOutsideClick from './hooks/UNSAFE_useOutsideClick.js';
import './utils/UNSAFE_arrayUtils.js';

function assignRef(ref, value) {
    if (ref == null)
        return;
    if (typeof ref === 'function') {
        ref(value);
        return;
    }
    try {
        // @ts-ignore
        ref.current = value;
    }
    catch (error) {
        throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
    }
}
function mergeRefs(...refs) {
    return (node) => {
        refs.forEach((ref) => assignRef(ref, node));
    };
}
const Floating = forwardRef(({ children, onClickOutside, placement = 'bottom', anchorRef, offsetValue, class: className }, ref) => {
    const { x, y, reference, floating, refs } = useFloating({
        placement: placement,
        middleware: [offset(offsetValue), b({ mainAxis: true, crossAxis: true }), D()],
        whileElementsMounted: N
    });
    if (onClickOutside) {
        useOutsideClick({ isDisabled: false, ref: refs.floating, handler: onClickOutside });
    }
    useLayoutEffect(() => {
        const coords = anchorRef;
        const element = anchorRef;
        const virtualEl = {
            getBoundingClientRect() {
                return {
                    width: 0,
                    height: 0,
                    x: coords.current.x,
                    y: coords.current.y,
                    top: coords.current.y,
                    left: coords.current.x,
                    right: coords.current.x,
                    bottom: coords.current.y
                };
            }
        };
        const result = coords.current && coords.current.x ? virtualEl : element.current;
        reference(result);
    }, [anchorRef.current]);
    const stableRef = useMemo(() => mergeRefs(ref, floating), [ref, floating]);
    const content = (jsx("div", Object.assign({ class: className, ref: stableRef, style: {
            display: 'block',
            position: 'absolute',
            top: y !== null && y !== void 0 ? y : '',
            left: x !== null && x !== void 0 ? x : ''
        } }, { children: children })));
    return content;
});

export { Floating };
/*  */
//# sourceMappingURL=UNSAFE_Floating.js.map
