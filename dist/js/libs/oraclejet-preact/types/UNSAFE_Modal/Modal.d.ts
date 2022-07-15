import { JSX } from 'preact';
import { useModal } from './hooks/useModal';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
declare type UseModalProps = Parameters<typeof useModal>[0];
declare type Props = UseModalProps & IntrinsicProps;
declare const Modal: ({ children, isOpen, onBackdropClick }: Props) => JSX.Element | null;
export default Modal;
