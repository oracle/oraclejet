export declare type AriaProps = {
    ariaLabel?: string;
    labelledBy?: string;
};
declare const ariaInterpolations: {
    ariaLabel: ({ ariaLabel }: Pick<AriaProps, 'ariaLabel'>) => {
        ariaLabel?: undefined;
    } | {
        ariaLabel: string;
    };
    labelledBy: ({ labelledBy }: Pick<AriaProps, 'labelledBy'>) => {
        ariaLabelledBy?: undefined;
    } | {
        ariaLabelledBy: string;
    };
};
export { ariaInterpolations };
