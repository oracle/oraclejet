import { CommitDetail, InputDetail } from './useEvents';
/**
 * Props for the RatingGauge
 */
declare type Props = {
    /**
     * Defines whether the rating gauge should be read only. User interaction is prevented if set to true.
     */
    isReadonly?: boolean;
    /**
     * Defines whether the gauge is disabled or not. User interaction is prevented and the rating gauge is hidden from screen readers if set to true.
     */
    isDisabled?: boolean;
    /**
     * The size of the individual rating gauge items.
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * The value of the rating gauge.
     */
    value: number;
    /**
     * Specifies the increment by which values can be changed.
     */
    step?: number;
    /**
     * Integer value specifying the maximum value of the gauge, which determines the number of items that are displayed
     */
    max?: number;
    /**
     * The callback called in response to hover or focus interactions with the rating gauge items.
     */
    onInput?: (detail: InputDetail) => void;
    /**
     * The callback called when value of gauge changes on blur or Enter or click.
     */
    onCommit?: (detail: CommitDetail) => void;
    /**
     * The rating gauge tooltip. Tooltip is only used for read only rating gauges. If accessibleLabel is not specified, tooltip will be used as the accessible label.
     */
    tooltip?: string;
    /**
     * The rating gauge datatip string. Datatip is used for interactive rating gauges.
     */
    datatip?: string;
    /**
     * A label to be used for accessibility purposes. Default label will be used if not provided.
     */
    accessibleLabel?: string;
    /**
     * The id of the element that labels the gauge.
     */
    ariaLabelledBy?: string;
    /**
     * The id of the element that describes the gauge.
     */
    ariaDescribedBy?: string;
};
export declare function RatingGauge({ max, value, size, step, isReadonly, isDisabled, ...props }: Props): import("preact").JSX.Element;
export {};
