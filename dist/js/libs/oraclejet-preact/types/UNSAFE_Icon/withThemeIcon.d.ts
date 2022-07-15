import { ComponentProps } from 'preact';
import { Icon } from './Icon';
import { RootTheme } from '../UNSAFE_Environment';
declare type Props = Omit<ComponentProps<typeof Icon>, 'viewBox'>;
declare type ThemeIcons = Record<RootTheme['name'], typeof Icon>;
export declare const withThemeIcon: (themeIcons: ThemeIcons) => (props: Props) => import("preact").JSX.Element;
export {};
