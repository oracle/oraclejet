import { Property } from 'csstype';
declare type Props = {
    color?: Property.Color;
    backgroundColor?: Property.BackgroundColor;
};
declare const colorInterpolations: {
    color: ({ color }: Pick<Props, 'color'>) => {
        color?: undefined;
    } | {
        color: Property.Color;
    };
    backgroundColor: ({ backgroundColor }: Pick<Props, 'backgroundColor'>) => {
        backgroundColor?: undefined;
    } | {
        backgroundColor: Property.BackgroundColor;
    };
};
export { colorInterpolations };
export declare type ColorProps = Props;
