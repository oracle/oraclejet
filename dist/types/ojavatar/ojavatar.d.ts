import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChild } from 'preact';
type Props = {
    background?: 'neutral' | 'orange' | 'green' | 'teal' | 'blue' | 'slate' | 'mauve' | 'pink' | 'purple' | 'lilac' | 'gray' | 'red' | 'forest';
    initials?: string | null;
    size?: '2xs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'xxl';
    src?: string | null;
    iconClass?: string;
    shape?: 'square' | 'circle';
};
export declare class Avatar extends Component<ExtendGlobalProps<Props>> {
    static defaultProps: Props;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
    private _getClasses;
    private _getInnerContent;
    private _getSecondaryInnerContent;
}
export {};
export interface AvatarElement extends JetElement<AvatarElementSettableProperties>, AvatarElementSettableProperties {
    addEventListener<T extends keyof AvatarElementEventMap>(type: T, listener: (this: HTMLElement, ev: AvatarElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof AvatarElementSettableProperties>(property: T): AvatarElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof AvatarElementSettableProperties>(property: T, value: AvatarElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, AvatarElementSettableProperties>): void;
    setProperties(properties: AvatarElementSettablePropertiesLenient): void;
}
export namespace AvatarElement {
    type backgroundChanged = JetElementCustomEventStrict<AvatarElement['background']>;
    type iconClassChanged = JetElementCustomEventStrict<AvatarElement['iconClass']>;
    type initialsChanged = JetElementCustomEventStrict<AvatarElement['initials']>;
    type shapeChanged = JetElementCustomEventStrict<AvatarElement['shape']>;
    type sizeChanged = JetElementCustomEventStrict<AvatarElement['size']>;
    type srcChanged = JetElementCustomEventStrict<AvatarElement['src']>;
}
export interface AvatarElementEventMap extends HTMLElementEventMap {
    'backgroundChanged': JetElementCustomEventStrict<AvatarElement['background']>;
    'iconClassChanged': JetElementCustomEventStrict<AvatarElement['iconClass']>;
    'initialsChanged': JetElementCustomEventStrict<AvatarElement['initials']>;
    'shapeChanged': JetElementCustomEventStrict<AvatarElement['shape']>;
    'sizeChanged': JetElementCustomEventStrict<AvatarElement['size']>;
    'srcChanged': JetElementCustomEventStrict<AvatarElement['src']>;
}
export interface AvatarElementSettableProperties extends JetSettableProperties {
    background?: Props['background'];
    iconClass?: Props['iconClass'];
    initials?: Props['initials'];
    shape?: Props['shape'];
    size?: Props['size'];
    src?: Props['src'];
}
export interface AvatarElementSettablePropertiesLenient extends Partial<AvatarElementSettableProperties> {
    [key: string]: any;
}
export type ojAvatar = AvatarElement;
export namespace ojAvatar {
    type backgroundChanged = JetElementCustomEventStrict<ojAvatar['background']>;
    type iconClassChanged = JetElementCustomEventStrict<ojAvatar['iconClass']>;
    type initialsChanged = JetElementCustomEventStrict<ojAvatar['initials']>;
    type shapeChanged = JetElementCustomEventStrict<ojAvatar['shape']>;
    type sizeChanged = JetElementCustomEventStrict<ojAvatar['size']>;
    type srcChanged = JetElementCustomEventStrict<ojAvatar['src']>;
}
export type ojAvatarEventMap = AvatarElementEventMap;
export type ojAvatarSettableProperties = AvatarElementSettableProperties;
export type ojAvatarSettablePropertiesLenient = AvatarElementSettablePropertiesLenient;
export interface AvatarIntrinsicProps extends Partial<Readonly<AvatarElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onbackgroundChanged?: (value: AvatarElementEventMap['backgroundChanged']) => void;
    oniconClassChanged?: (value: AvatarElementEventMap['iconClassChanged']) => void;
    oninitialsChanged?: (value: AvatarElementEventMap['initialsChanged']) => void;
    onshapeChanged?: (value: AvatarElementEventMap['shapeChanged']) => void;
    onsizeChanged?: (value: AvatarElementEventMap['sizeChanged']) => void;
    onsrcChanged?: (value: AvatarElementEventMap['srcChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-avatar': AvatarIntrinsicProps;
        }
    }
}
