declare type Obj = Record<string, unknown>;
declare type Interpolation<P> = (props: P) => Record<string, string> | {};
declare const mergeInterpolations: <P extends Obj>(interpolations: Interpolation<P>[]) => (props: P) => Record<string, string>;
export { mergeInterpolations };
