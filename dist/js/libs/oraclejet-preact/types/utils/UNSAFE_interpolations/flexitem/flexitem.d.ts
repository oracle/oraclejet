import { Property } from 'csstype';
declare const alignSelfStyles: {
    baseline: string;
    center: string;
    end: string;
    start: string;
    inherit: string;
    initial: string;
    stretch: string;
};
declare const flexitemStyles: {
    alignSelf: {
        baseline: string;
        center: string;
        end: string;
        start: string;
        inherit: string;
        initial: string;
        stretch: string;
    };
};
declare const alignSelfs: ("inherit" | "initial" | "stretch" | "center" | "end" | "start" | "baseline")[];
export declare type FlexitemProps = {
    alignSelf?: keyof typeof alignSelfStyles;
    flex?: Property.Flex;
    order?: Property.Order;
};
declare const flexitemInterpolations: {
    alignSelf: ({ alignSelf }: Pick<FlexitemProps, 'alignSelf'>) => {
        class?: undefined;
    } | {
        class: string;
    };
    flex: ({ flex }: Pick<FlexitemProps, 'flex'>) => {
        flex?: undefined;
    } | {
        flex: Property.Flex<0 | (string & {})>;
    };
    order: ({ order }: Pick<FlexitemProps, 'order'>) => {
        order?: undefined;
    } | {
        order: Property.Order;
    };
};
export { alignSelfs, flexitemInterpolations, flexitemStyles };
