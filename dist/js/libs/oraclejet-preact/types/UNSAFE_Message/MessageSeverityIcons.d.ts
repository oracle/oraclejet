import { h, JSX } from 'preact';
declare type SvgProps = Pick<JSX.SVGAttributes, 'class' | 'children' | 'height' | 'width'> & {
    /**
     * The accessible title for the SVG icon
     */
    title?: string;
};
declare type SeverityIconProps = Pick<SvgProps, 'class' | 'title' | 'height' | 'width'> & {
    /**
     * The fill prop for the icon path
     */
    fill?: string;
};
declare const ConfirmationIcon: ({ class: className, height, width, title, fill }: SeverityIconProps) => h.JSX.Element;
declare const ErrorIcon: ({ class: className, height, width, title, fill }: SeverityIconProps) => h.JSX.Element;
declare const InfoIcon: ({ class: className, height, width, title, fill }: SeverityIconProps) => h.JSX.Element;
declare const WarningIcon: ({ class: className, height, width, title, fill }: SeverityIconProps) => h.JSX.Element;
export { ConfirmationIcon, ErrorIcon, InfoIcon, WarningIcon };
