declare const textAlignStyles: {
    start: string;
    end: string;
    right: string;
};
declare const textStyles: {
    textAlign: {
        start: string;
        end: string;
        right: string;
    };
};
declare const textAligns: ("end" | "start" | "right")[];
export declare type TextProps = {
    textAlign?: keyof typeof textAlignStyles;
};
declare const textInterpolations: {
    textAlign: ({ textAlign }: Pick<TextProps, 'textAlign'>) => {
        class?: undefined;
    } | {
        class: string;
    };
};
export { textAligns, textAlignStyles, textInterpolations, textStyles };
