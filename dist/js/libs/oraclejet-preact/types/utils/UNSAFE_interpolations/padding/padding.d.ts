import { Size } from '../../UNSAFE_size';
declare const paddingstartends: ("paddingBlockEnd" | "paddingBlockStart" | "paddingInlineEnd" | "paddingInlineStart")[];
declare type PaddingStartEnd = typeof paddingstartends[number];
declare type PaddingStartEndProps = {
    [key in PaddingStartEnd]?: Size;
};
export declare type PaddingProps = {
    padding?: Size | [Size] | [Size, Size] | [Size, Size, Size] | [Size, Size, Size, Size];
} & PaddingStartEndProps;
declare const paddingInterpolations: {
    padding: ({ padding }: Pick<PaddingProps, 'padding'>) => {
        padding?: undefined;
    } | {
        padding: string;
    };
    paddingBlockStart: ({ paddingBlockStart }: Pick<PaddingProps, 'paddingBlockStart'>) => {
        paddingBlockStart?: undefined;
    } | {
        paddingBlockStart: string;
    };
    paddingBlockEnd: ({ paddingBlockEnd }: Pick<PaddingProps, 'paddingBlockEnd'>) => {
        paddingBlockEnd?: undefined;
    } | {
        paddingBlockEnd: string;
    };
    paddingInlineStart: ({ paddingInlineStart }: Pick<PaddingProps, 'paddingInlineStart'>) => {
        paddingInlineStart?: undefined;
    } | {
        paddingInlineStart: string;
    };
    paddingInlineEnd: ({ paddingInlineEnd }: Pick<PaddingProps, 'paddingInlineEnd'>) => {
        paddingInlineEnd?: undefined;
    } | {
        paddingInlineEnd: string;
    };
};
export { paddingInterpolations };
