/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var hooks = require('preact/hooks');
var compat = require('preact/compat');
var hooks_UNSAFE_useFloating = require('./index-a5277960.js');
var hooks_UNSAFE_useOutsideClick = require('./hooks/UNSAFE_useOutsideClick.js');

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
function isElement(value) {
    return value instanceof Element;
}
const Floating = compat.forwardRef(({ children, onClickOutside, placement = 'bottom', anchorRef, offsetValue, class: className }, ref) => {
    const { x, y, reference, floating, refs } = hooks_UNSAFE_useFloating.useFloating({
        placement: placement,
        middleware: [hooks_UNSAFE_useFloating.offset(offsetValue), hooks_UNSAFE_useFloating.b({ mainAxis: true, crossAxis: true }), hooks_UNSAFE_useFloating.D({ limiter: hooks_UNSAFE_useFloating.L() })],
        whileElementsMounted: hooks_UNSAFE_useFloating.N
    });
    if (onClickOutside) {
        hooks_UNSAFE_useOutsideClick["default"]({ isDisabled: false, ref: refs.floating, handler: onClickOutside });
    }
    hooks.useLayoutEffect(() => {
        if (isElement(anchorRef.current)) {
            const element = anchorRef;
            reference(element.current);
            return;
        }
        const coords = anchorRef;
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
        if (coords.current && coords.current.x != null) {
            reference(virtualEl);
        }
    }, [anchorRef.current]);
    const stableRef = hooks.useMemo(() => mergeRefs(ref, floating), [ref, floating]);
    const content = (jsxRuntime.jsx("div", Object.assign({ class: className, ref: stableRef, style: {
            display: 'block',
            position: 'absolute',
            top: y !== null && y !== void 0 ? y : '',
            left: x !== null && x !== void 0 ? x : ''
        } }, { children: children })));
    return content;
});

exports.Floating = Floating;
/*  */
//# sourceMappingURL=Floating-3d10c829.js.map
