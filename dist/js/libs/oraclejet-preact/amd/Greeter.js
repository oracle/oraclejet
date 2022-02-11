define(['exports', 'preact'], (function (exports, preact) { 'use strict';

  /**
   * Pure preact based component sample. Renders a welcome message given a target and source properties.
   */
  class Greeter extends preact.Component {
      constructor(props) {
          super(props);
      }
      render(props) {
          return (preact.h("div", null,
              preact.h("h3", null,
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

  exports.Greeter = Greeter;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
