import { ComponentProps } from 'preact';
import { Icon } from '../UNSAFE_Icon';
declare type Props = Omit<ComponentProps<typeof Icon>, 'viewBox'>;
declare const SvgIcoView: (props: Props) => import("preact").JSX.Element;
export default SvgIcoView;
