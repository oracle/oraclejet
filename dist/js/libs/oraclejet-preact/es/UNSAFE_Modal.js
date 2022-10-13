/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { useRef, useCallback, useEffect, forwardRef } from 'preact/compat';
import { Layer } from './UNSAFE_Layer.js';
import './UNSAFE_Modal.css';
import 'preact';

/**
 *
 * @param props
 */
const useModal = (props) => {
    const { isOpen, onBackdropClick: onBackdropClickProp, } = props;
    const modalRef = useRef(null);
    const mouseDownTarget = useRef(null);
    const onMouseDown = useCallback((event) => {
        if (modalRef.current === event.target) {
            mouseDownTarget.current = event.target;
        }
    }, []);
    const onBackdropClick = useCallback((event) => {
        if (modalRef.current === event.target) {
            event.stopPropagation();
            // event should originate on the same target
            if (mouseDownTarget.current === event.target) {
                onBackdropClickProp === null || onBackdropClickProp === void 0 ? void 0 : onBackdropClickProp();
            }
        }
    }, [onBackdropClickProp]);
    useEffect(() => {
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
  base: "_rcy23c"
};

const ModalBackdrop = () => jsx("div", {
  class: styles$2.base
});

const styles$1 = {
  base: "_euu00p"
};
const ModalContainer = forwardRef(({
  children
}, ref) => jsx("div", Object.assign({
  class: styles$1.base,
  ref: ref
}, {
  children: children
})));
ModalContainer.displayName = 'Forwarded<ModalContainer>';

const styles = {
  base: "r70myy"
};

const ModalWrapper = ({
  children
}) => jsx("div", Object.assign({
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
  return isOpen ? jsx(Layer, {
    children: jsxs(ModalWrapper, {
      children: [jsx(ModalBackdrop, {}), jsx(ModalContainer, Object.assign({
        ref: modalRef
      }, {
        children: children
      }))]
    })
  }) : null;
};

export { Modal };
/*  */
//# sourceMappingURL=UNSAFE_Modal.js.map
