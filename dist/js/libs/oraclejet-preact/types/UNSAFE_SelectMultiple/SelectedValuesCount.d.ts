import { ComponentProps } from 'preact';
import { Chip } from '../UNSAFE_Chip';
declare type PickedPropsFromChip = Pick<ComponentProps<typeof Chip>, 'accessibleLabel' | 'isDisabled' | 'isSelected' | 'onToggle'>;
declare type Props = PickedPropsFromChip & {
    count?: number;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
};
export declare function SelectedValuesCount({ accessibleLabel, count, onKeyDown, onKeyUp, onMouseDown, ...passThroughProps }: Props): import("preact").JSX.Element;
export {};
