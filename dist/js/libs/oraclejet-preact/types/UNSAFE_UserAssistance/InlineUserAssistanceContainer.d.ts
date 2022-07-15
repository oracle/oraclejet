import { ComponentChildren } from 'preact';
import { UserAssistanceDensityType } from './InlineUserAssistance';
declare type Props = {
    children?: ComponentChildren;
    id?: string;
    variant?: UserAssistanceDensityType;
};
export declare function InlineUserAssistanceContainer({ variant, children, id }: Props): import("preact").JSX.Element;
export {};
