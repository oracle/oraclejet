/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
var hooks = require('preact/hooks');
var compat = require('preact/compat');
var hooks_UNSAFE_useFloating = require('./index-d49bf124.js');
var hooks_UNSAFE_useOutsideClick = require('./hooks/UNSAFE_useOutsideClick.js');
require('./utils/UNSAFE_arrayUtils.js');

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
const Floating = compat.forwardRef(({ children, onClickOutside, placement = 'bottom', anchorRef, offsetValue, class: className }, ref) => {
    const { x, y, reference, floating, refs } = hooks_UNSAFE_useFloating.useFloating({
        placement: placement,
        middleware: [hooks_UNSAFE_useFloating.offset(offsetValue), hooks_UNSAFE_useFloating.b({ mainAxis: true, crossAxis: true }), hooks_UNSAFE_useFloating.D()],
        whileElementsMounted: hooks_UNSAFE_useFloating.N
    });
    if (onClickOutside) {
        hooks_UNSAFE_useOutsideClick["default"]({ isDisabled: false, ref: refs.floating, handler: onClickOutside });
    }
    hooks.useLayoutEffect(() => {
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
//# sourceMappingURL=UNSAFE_Floating.js.map
