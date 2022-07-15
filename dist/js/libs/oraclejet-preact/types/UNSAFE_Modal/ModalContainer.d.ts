import { JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
declare const ModalContainer: import("preact").FunctionalComponent<Omit<IntrinsicProps, "ref"> & {
    ref?: import("preact").Ref<HTMLDivElement> | undefined;
}>;
export default ModalContainer;
