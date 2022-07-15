/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
var compat = require('preact/compat');
var UNSAFE_Layer = require('./UNSAFE_Layer.js');
require('identity-obj-proxy');
require('preact');

/**
 *
 * @param props
 */
const useModal = (props) => {
    const { isOpen, onBackdropClick: onBackdropClickProp, } = props;
    const modalRef = compat.useRef(null);
    const mouseDownTarget = compat.useRef(null);
    const onMouseDown = compat.useCallback((event) => {
        if (modalRef.current === event.target) {
            mouseDownTarget.current = event.target;
        }
    }, []);
    const onBackdropClick = compat.useCallback((event) => {
        if (modalRef.current === event.target) {
            event.stopPropagation();
            // event should originate on the same target
            if (mouseDownTarget.current === event.target) {
                onBackdropClickProp === null || onBackdropClickProp === void 0 ? void 0 : onBackdropClickProp();
            }
        }
    }, [onBackdropClickProp]);
    compat.useEffect(() => {
        const modal = modalRef.current;
        if (modal) {
            modal.addEventListener('mousedown', onMouseDown);
            modal.addEventListener('click', onBackdropClick);
            return () => {
                modal.removeEventListener('mousedown', onMouseDown);
                modal.removeEventListener('click', onBackdropClick);
            };
        }
        return () => { };
    }, [isOpen, onMouseDown, onBackdropClick]);
    return {
        modalRef,
    };
};

const styles$2 = {
  base: "b2xv9nu"
};

const ModalBackdrop = () => jsxRuntime.jsx("div", {
  class: styles$2.base
});

const styles$1 = {
  base: "b96nxck"
};
const ModalContainer = compat.forwardRef(({
  children
}, ref) => jsxRuntime.jsx("div", Object.assign({
  class: styles$1.base,
  ref: ref
}, {
  children: children
})));
ModalContainer.displayName = 'Forwarded<ModalContainer>';

const styles = {
  base: "bdv30a5"
};

const ModalWrapper = ({
  children
}) => jsxRuntime.jsx("div", Object.assign({
  class: styles.base
}, {
  children: children
}));

const Modal = ({
  children,
  isOpen,
  onBackdropClick
}) => {
  const {
    modalRef
  } = useModal({
    isOpen,
    onBackdropClick
  });
  return isOpen ? jsxRuntime.jsx(UNSAFE_Layer.Layer, {
    children: jsxRuntime.jsxs(ModalWrapper, {
      children: [jsxRuntime.jsx(ModalBackdrop, {}), jsxRuntime.jsx(ModalContainer, Object.assign({
        ref: modalRef
      }, {
        children: children
      }))]
    })
  }) : null;
};

exports.Modal = Modal;
/*  */
//# sourceMappingURL=UNSAFE_Modal.js.map
