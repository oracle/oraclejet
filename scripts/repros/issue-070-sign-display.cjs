#!/usr/bin/env node
const path = require('path');
const requirejs = require('requirejs');

requirejs.config({
  baseUrl: path.resolve(__dirname, '..', '..'),
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

requirejs(['ojs/ojconverter-nativenumber', 'ojs/ojconfig'], (numberModule, ojconfig) => {
  const NumberConverter = numberModule.NumberConverter || numberModule.default?.NumberConverter;
  if (!NumberConverter) {
    console.error('Could not load NumberConverter');
    process.exit(1);
  }

  const locale = typeof ojconfig.getLocale === 'function' ? ojconfig.getLocale() : 'en';
  const converter = new NumberConverter({ signDisplay: 'always' });
  const native = new Intl.NumberFormat(locale, { signDisplay: 'always' });
  const values = [5, 0, -5];
  let failed = false;

  for (const value of values) {
    const actual = converter.format(value);
    const expected = native.format(value);
    if (actual !== expected) {
      failed = true;
      console.error(`Mismatch for ${value}: actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`);
    }
  }

  if (failed) {
    process.exit(1);
  }

  console.log('signDisplay repro passed');
}, (err) => {
  console.error(err);
  process.exit(1);
});
