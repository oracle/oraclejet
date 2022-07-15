declare const directionStyles: {
    row: string;
    column: string;
};
declare const wrapStyles: {
    nowrap: string;
    wrap: string;
    reverse: string;
    inherit: string;
    initial: string;
};
declare const flexboxStyles: {
    direction: {
        row: string;
        column: string;
    };
    wrap: {
        nowrap: string;
        wrap: string;
        reverse: string;
        inherit: string;
        initial: string;
    };
};
declare const directions: ("column" | "row")[];
declare const wraps: ("inherit" | "initial" | "reverse" | "nowrap" | "wrap")[];
export declare type FlexboxProps = {
    direction?: keyof typeof directionStyles;
    wrap?: keyof typeof wrapStyles;
};
declare const flexboxInterpolations: {
    direction: ({ direction }: Pick<FlexboxProps, 'direction'>) => {
        class?: undefined;
    } | {
        class: string;
    };
    wrap: ({ wrap }: Pick<FlexboxProps, 'wrap'>) => {
        class?: undefined;
    } | {
        class: string;
    };
};
export { directions, wraps, flexboxInterpolations, flexboxStyles };
