declare const directionStyles: {
    row: string;
    column: string;
};
declare const alignStyles: {
    baseline: string;
    center: string;
    end: string;
    start: string;
    inherit: string;
    initial: string;
    stretch: string;
};
declare const justifyStyles: {
    center: string;
    end: string;
    start: string;
    inherit: string;
    initial: string;
    around: string;
    between: string;
    evenly: string;
};
declare const wrapStyles: {
    nowrap: string;
    wrap: string;
    reverse: string;
    inherit: string;
    initial: string;
};
declare const styles: {
    direction: {
        row: string;
        column: string;
    };
    align: {
        baseline: string;
        center: string;
        end: string;
        start: string;
        inherit: string;
        initial: string;
        stretch: string;
    };
    justify: {
        center: string;
        end: string;
        start: string;
        inherit: string;
        initial: string;
        around: string;
        between: string;
        evenly: string;
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
declare const aligns: ("center" | "end" | "start" | "inherit" | "baseline" | "initial" | "stretch")[];
declare const justifies: ("center" | "end" | "start" | "inherit" | "initial" | "around" | "between" | "evenly")[];
declare const wraps: ("reverse" | "inherit" | "initial" | "nowrap" | "wrap")[];
declare const spaces: ("none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl")[];
declare type Space = typeof spaces[number];
declare type Props = {
    direction?: keyof typeof directionStyles;
    align?: keyof typeof alignStyles;
    flex?: string;
    gap?: Space | [Space] | [Space, Space];
    justify?: keyof typeof justifyStyles;
    wrap?: keyof typeof wrapStyles;
};
declare const flexboxInterpolations: {
    direction: ({ direction }: Pick<Props, "direction">) => {
        class?: undefined;
    } | {
        class: string;
    };
    align: ({ align }: Pick<Props, "align">) => {
        class?: undefined;
    } | {
        class: string;
    };
    justify: ({ justify }: Pick<Props, "justify">) => {
        class?: undefined;
    } | {
        class: string;
    };
    wrap: ({ wrap }: Pick<Props, "wrap">) => {
        class?: undefined;
    } | {
        class: string;
    };
    flex: ({ flex }: Pick<Props, "flex">) => {
        flex?: undefined;
    } | {
        flex: string;
    };
    gap: ({ gap }: Pick<Props, "gap">) => {
        gap?: undefined;
    } | {
        gap: string;
    };
};
export { directions, aligns, justifies, wraps, spaces, flexboxInterpolations, styles };
export declare type FlexboxProps = Props;
