declare type Props = {
    /**
     * The text to be used for the label
     */
    children?: string;
    /**
     * The id to set on the label
     */
    id?: string;
    /**
     * The id of the form control for which this label will be used
     */
    forId?: string;
    /**
     * Determines how the label is going to be styled
     */
    variant?: 'inside' | 'start' | 'top' | 'insideError' | 'insideWarning';
};
export declare const Label: ({ forId, ...props }: Props) => import("preact").JSX.Element;
export {};
