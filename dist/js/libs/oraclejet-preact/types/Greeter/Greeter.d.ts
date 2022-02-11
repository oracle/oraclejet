import { h, Component } from 'preact';
export declare type Props = {
    /**
     * This is the target property
     */
    target: string;
    /**
     * This is the source property.
     */
    source: string;
};
/**
 * Pure preact based component sample. Renders a welcome message given a target and source properties.
 */
export declare class Greeter extends Component<Props> {
    static defaultProps: {
        target: string;
        source: string;
    };
    constructor(props: Props);
    render(props: Props): h.JSX.Element;
}
