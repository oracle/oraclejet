export declare type UseModalProps = Readonly<{
    /**
     * Determines whether the Modal is open.
     */
    isOpen: boolean;
    /**
     * On backdrop click callback.
     */
    onBackdropClick?: () => void;
}>;
/**
 *
 * @param props
 */
export declare const useModal: (props: UseModalProps) => {
    modalRef: import("preact/hooks").Ref<HTMLDivElement>;
};
export default useModal;
