import { Component, h } from 'preact';

/**
 * Pure preact based component sample. Renders a welcome message given a target and source properties.
 */
class Greeter extends Component {
    constructor(props) {
        super(props);
    }
    render(props) {
        return (h("div", null,
            h("h3", null,
                "Hello ",
                props.target,
                " from ",
                props.source)));
    }
}
Greeter.defaultProps = {
    target: 'JET',
    source: 'Greeter',
};

export { Greeter };
