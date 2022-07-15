declare type StylePropsWithOutTruncate = {
    /**
     * Specifies the color of the text.
     */
    variant?: 'primary' | 'secondary' | 'disabled' | 'danger' | 'warning' | 'success' | 'inherit';
    /**
     * Specifies the text "style". Sets font size and line height.
     */
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inherit';
    /**
     * Specifies the font weight.
     */
    weight?: 'normal' | 'semiBold' | 'bold' | 'inherit';
    /**
     * Specifies if hyphens should be included when handling long words with no spaces.
     */
    hyphens?: 'auto' | 'none';
};
declare type TruncateProps = {
    lineClamp?: number;
    truncation?: never;
} | {
    lineClamp?: never;
    truncation?: 'none' | 'clip' | 'ellipsis';
};
declare type AdditionalProps = {
    /**
     * Supports String
     */
    children?: string;
};
declare type Props = StylePropsWithOutTruncate & TruncateProps & AdditionalProps;
export declare function Text({ children, ...props }: Props): import("preact").JSX.Element;
export {};
