import { ComponentProps } from 'preact';
import { Icon } from './Icon';
declare type Props = Omit<ComponentProps<typeof Icon>, 'viewBox'>;
export declare const withDirectionIcon: (LtrIcon: typeof Icon, RtlIcon: typeof Icon) => (props: Props) => import("preact").JSX.Element;
export {};
