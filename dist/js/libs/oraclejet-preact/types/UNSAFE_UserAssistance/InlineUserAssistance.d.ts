import { ComponentMessageItem } from '../UNSAFE_ComponentMessage';
export declare type UserAssistanceDensityType = 'reflow' | 'efficient';
declare type Props = {
    assistiveText?: string;
    helpSourceLink?: string;
    helpSourceText?: string;
    id?: string;
    isRequiredShown?: boolean;
    messages?: ComponentMessageItem[];
    userAssistanceDensity?: UserAssistanceDensityType;
};
export declare function InlineUserAssistance({ assistiveText, helpSourceLink, helpSourceText, id, isRequiredShown, messages, userAssistanceDensity }: Props): import("preact").JSX.Element | null;
export {};
