define(['exports', 'preact'], (function (exports, preact) { 'use strict';

  function Sample({ preferredGreeting = "Hello" }) {
      const greeting = preferredGreeting;
      return preact.h("p", null,
          greeting,
          ", World!");
  }

  exports.Sample = Sample;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
