import { Property } from 'csstype';
export declare type BorderProps = {
    border?: Property.Border;
    borderBlockStart?: Property.BorderBlockStart;
    borderBlockEnd?: Property.BorderBlockEnd;
    borderInlineStart?: Property.BorderInlineStart;
    borderInlineEnd?: Property.BorderInlineEnd;
    borderRadius?: Property.BorderRadius;
};
declare const borderInterpolations: {
    border: ({ border }: Pick<BorderProps, 'border'>) => {
        border?: undefined;
    } | {
        border: Property.Border<0 | (string & {})>;
    };
    borderBlockStart: ({ borderBlockStart }: Pick<BorderProps, 'borderBlockStart'>) => {
        borderBlockStart?: undefined;
    } | {
        borderBlockStart: Property.BorderBlockStart<0 | (string & {})>;
    };
    borderBlockEnd: ({ borderBlockEnd }: Pick<BorderProps, 'borderBlockEnd'>) => {
        borderBlockEnd?: undefined;
    } | {
        borderBlockEnd: Property.BorderBlockEnd<0 | (string & {})>;
    };
    borderInlineStart: ({ borderInlineStart }: Pick<BorderProps, 'borderInlineStart'>) => {
        borderInlineStart?: undefined;
    } | {
        borderInlineStart: Property.BorderInlineStart<0 | (string & {})>;
    };
    borderInlineEnd: ({ borderInlineEnd }: Pick<BorderProps, 'borderInlineEnd'>) => {
        borderInlineEnd?: undefined;
    } | {
        borderInlineEnd: Property.BorderInlineEnd<0 | (string & {})>;
    };
    borderRadius: ({ borderRadius }: Pick<BorderProps, 'borderRadius'>) => {
        borderRadius?: undefined;
    } | {
        borderRadius: Property.BorderRadius<0 | (string & {})>;
    };
};
export { borderInterpolations };
