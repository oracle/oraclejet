import { StyledComponentProps } from '../utils/UNSAFE_typeUtils';
export declare type StyleProps = {
    hasInsideLabel?: boolean;
};
declare type Props = StyledComponentProps<'div', StyleProps>;
export declare const StyledTextField: ({ hasInsideLabel, ...props }: Props) => import("preact").JSX.Element;
export {};
