#!/usr/bin/env node
const { JSDOM } = require('jsdom');
const requirejs = require('requirejs');

const dom = new JSDOM('<!doctype html><html><head></head><body><input id="x"></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost/'
});

for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (!(key in global)) {
    global[key] = dom.window[key];
  }
}

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

requirejs.config({
  baseUrl: process.cwd(),
  nodeRequire: require,
  paths: {
    ojs: 'dist/js/libs/oj/debug',
    ojL10n: 'dist/js/libs/oj/ojL10n',
    ojtranslations: 'dist/js/libs/oj/resources',
    text: 'node_modules/requirejs-text/text',
    jquery: 'node_modules/jquery/dist/jquery',
    knockout: 'node_modules/knockout/build/output/knockout-latest',
    hammerjs: 'node_modules/hammerjs/hammer',
    signals: 'node_modules/signals/dist/signals',
    'jqueryui-amd': 'node_modules/jquery-ui/ui'
  }
});

requirejs(['jquery', 'ojs/ojinputtext'], ($) => {
  const input = $('#x');
  input.ojInputText();

  const instance = input.data('ojOjInputText');
  if (!instance || typeof instance._AppendInputHelper !== 'function') {
    console.error('Could not access ojInputText instance');
    process.exit(1);
  }

  const helperParent = $('<div id="helper-parent"></div>').appendTo('body');
  instance._INPUT_HELPER_KEY = 'inputHelp';
  instance._DoWrapElement = () => true;
  instance._GetSubId = () => 'helper-id';
  instance._EscapeXSS = (value) => value;
  instance.getTranslatedString = () => 'Help';
  instance._AppendInputHelperParent = () => helperParent;

  input.removeAttr('aria-describedby');
  instance._AppendInputHelper();

  const actual = input.attr('aria-describedby');
  const expected = 'helper-id';
  if (actual !== expected) {
    console.error(`Mismatch: actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`);
    process.exit(1);
  }

  console.log('describedBy repro passed');
}, (err) => {
  console.error(err);
  process.exit(1);
});
