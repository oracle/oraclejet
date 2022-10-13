import { MessageAnimation } from '../UNSAFE_Message';
import { ComponentMessageItem } from './ComponentMessage';
/**
 * Props for the ComponentMessaging component
 */
declare type Props = {
    /**
     * An object of various animation effects for the transitions.
     */
    animations?: Record<string, MessageAnimation[]>;
    /**
     * The label of the field which is showing this error
     */
    fieldLabel?: string;
    /**
     * Data for the messages. This data is used for rendering each message.
     */
    messages?: ComponentMessageItem[];
};
export declare function ComponentMessageContainer({ animations, fieldLabel, messages }: Props): import("preact").JSX.Element;
export {};
