import { ComponentChild } from 'preact';
declare type Props = {
    max: number;
    value: number;
    isReadonly?: boolean;
    isDisabled?: boolean;
    tooltip?: string;
    datatip?: string;
    ariaDescribedBy?: string;
    width: number;
};
export declare function useTooltipOrDatatip({ max, value, isReadonly, isDisabled, tooltip, datatip, ariaDescribedBy, width }: Props): {
    tooltipContent: ComponentChild;
    tooltipProps: Record<string, any>;
};
export {};
