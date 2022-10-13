/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var utils_UNSAFE_arrayUtils = require('../utils/UNSAFE_arrayUtils.js');

const isPointOutside = (event, ref) => {
    const target = event.target;
    if (target) {
        const doc = getDocument(target);
        if (!doc.contains(target))
            return false;
    }
    return ref.every((elRef) => { var _a; return !((_a = elRef.current) === null || _a === void 0 ? void 0 : _a.contains(target)); });
};
const getDocument = (node) => { var _a; return (_a = node === null || node === void 0 ? void 0 : node.ownerDocument) !== null && _a !== void 0 ? _a : document; };
const useOutsideClick = ({ isDisabled: disabled = false, ref, handler }) => {
    // use ref to store mutable data and not cause a re-render
    const stateRef = hooks.useRef({
        isMouseDown: false
    });
    const state = stateRef.current;
    hooks.useEffect(() => {
        const refs = utils_UNSAFE_arrayUtils.coerceArray(ref);
        if (disabled || (refs.length > 0 && refs.findIndex((elRef) => elRef.current === null) > -1))
            return;
        const onMouseDown = () => {
            state.isMouseDown = true;
        };
        const onMouseUp = (event) => {
            if (state.isMouseDown && isPointOutside(event, refs)) {
                state.isMouseDown = false;
                handler === null || handler === void 0 ? void 0 : handler(event);
            }
        };
        const firstElRef = refs[0];
        const doc = getDocument(firstElRef.current);
        if (doc) {
            doc.addEventListener('mousedown', onMouseDown, true);
            doc.addEventListener('mouseup', onMouseUp, true);
            return () => {
                doc.removeEventListener('mousedown', onMouseDown, true);
                doc.removeEventListener('mouseup', onMouseUp, true);
            };
        }
        return undefined;
    }, [disabled, handler, ref]);
};

exports["default"] = useOutsideClick;
/*  */
//# sourceMappingURL=UNSAFE_useOutsideClick.js.map