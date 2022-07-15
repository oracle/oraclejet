import { ComponentProps } from 'preact';
import { Ref } from 'preact/hooks';
import { TextAreaAutosize } from './TextAreaAutosize';
declare type PickedPropsFromTextAreaAutosize = Pick<ComponentProps<typeof TextAreaAutosize>, 'minRows' | 'maxRows' | 'value'>;
declare type Props = PickedPropsFromTextAreaAutosize & {
    isReadonly?: boolean;
    enabledElementRef: Ref<HTMLTextAreaElement>;
    readonlyElementRef: Ref<HTMLTextAreaElement>;
};
export declare const useTextAreaAutosizing: ({ isReadonly, enabledElementRef, readonlyElementRef, minRows, maxRows, value }: Props) => void;
export {};
