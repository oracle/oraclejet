import { Size } from '../../../utils/UNSAFE_size';
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
export declare type BoxAlignmentProps = {
    align?: keyof typeof alignStyles;
    gap?: Size | [Size] | [Size, Size];
    justify?: keyof typeof justifyStyles;
};
declare const boxAlignmentInterpolations: {
    align: ({ align }: Pick<BoxAlignmentProps, 'align'>) => {
        class?: undefined;
    } | {
        class: string;
    };
    justify: ({ justify }: Pick<BoxAlignmentProps, 'justify'>) => {
        class?: undefined;
    } | {
        class: string;
    };
    gap: ({ gap }: Pick<BoxAlignmentProps, 'gap'>) => {
        gap?: undefined;
    } | {
        gap: string;
    };
};
declare const aligns: ("inherit" | "initial" | "stretch" | "center" | "end" | "start" | "baseline")[];
declare const justifies: ("inherit" | "initial" | "center" | "end" | "start" | "around" | "between" | "evenly")[];
export { aligns, justifies, boxAlignmentInterpolations };
