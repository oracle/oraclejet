import { MessageSeverity } from '../UNSAFE_Message';
/**
 * A type for a single component message
 */
export declare type ComponentMessageItem = {
    summary?: string;
    detail?: string;
    severity?: Exclude<MessageSeverity, 'none'>;
};
/**
 * Props for the Message Component
 */
declare type Props = {
    /**
     * The error detail text for the component message
     */
    detail?: ComponentMessageItem['detail'];
    /**
     * The label of the field which is showing this error
     */
    fieldLabel?: string;
    /**
     * The severity of the component message
     */
    severity?: ComponentMessageItem['severity'];
};
/**
 * The component that renders an individual message for inline component messaging.
 */
export declare function ComponentMessage({ detail, fieldLabel, severity }: Props): import("preact").JSX.Element;
export {};
