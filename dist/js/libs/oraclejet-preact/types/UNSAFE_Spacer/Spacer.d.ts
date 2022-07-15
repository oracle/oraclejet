import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
import type { FlexitemProps } from '../utils/UNSAFE_interpolations/flexitem';
declare type StyleProps = DimensionProps & Pick<FlexitemProps, 'flex'>;
declare type Props = StyleProps;
export declare const Spacer: ({ ...props }: Props) => import("preact").JSX.Element;
export {};
