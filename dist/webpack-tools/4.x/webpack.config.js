/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

const path = require('path');
const webpack = require('webpack');
const WebpackRequireFixupPlugin = require('./plugins/WebpackRequireFixupPlugin');

module.exports = {
  entry: './web/js/main.js', // this is the entry point for the Webpack build
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './web') // generate bundles in the same directory where the config file is located
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolveLoader: {
    // This adds ./loaders/ to the list of folders where Webpack is looking for loaders
    modules: ['node_modules', path.resolve(__dirname, './loaders')],
    alias: {
      ojL10n: "ojL10n-loader",
      text: "text-loader",
      css: 'noop-loader',
      ojcss: 'noop-loader',
      'ojs/ojcss': 'noop-loader'
    }
  },
  resolve: {
    alias: {
      // path mappings go here
      'knockout': path.resolve(__dirname, './web/js/libs/knockout/knockout-3.5.1.debug'),
      'jquery': path.resolve(__dirname, './web/js/libs/jquery/jquery-3.6.1'),
      'jqueryui-amd': path.resolve(__dirname, './web/js/libs/jquery/jqueryui-amd-1.13.2'),
      'hammerjs': path.resolve(__dirname, './web/js/libs/hammer/hammer-2.0.8'),
      'ojdnd': path.resolve(__dirname, './web/js/libs/dnd-polyfill/dnd-polyfill-1.0.2'),
      'ojs': path.resolve(__dirname, './web/js/libs/oj/14.1.0/debug'),
      'ojtranslations': path.resolve(__dirname, './web/js/libs/oj/14.1.0/resources'),
      'oj-c': '@oracle/oraclejet-core-pack/oj-c',
      // Webpack 4 doesn't read oraclejet-preact's package exports, so point it
      // to the AMD distribution. For projects also using oj-c, the imports start
      // as RequireJS so we want to continue using that format (instead of ES),
      // otherwise, the CSS imports won't be read.
      '@oracle/oraclejet-preact': '@oracle/oraclejet-preact/amd',
      'signals': path.resolve(__dirname, './web/js/libs/js-signals/signals'),
      'touchr': path.resolve(__dirname, './web/js/libs/touchr/touchr'),
      'appController': path.resolve(__dirname, './web/js/appController')
    }
  },
  plugins: [
    // This plugin sets options for the ojL10n-loader (in this case, just the locale name)
    new webpack.LoaderOptionsPlugin({
      options: {
        ojL10nLoader: {
          locale: "en-US"
        }
      }
    }
    ),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // This plugin performs certain fixups to enable the use of Webpack with JET
    new WebpackRequireFixupPlugin(
      {
        ojModuleResources: {
          // The path to the root folder where the application-level (as opposed to relative) ojModule/<oj-module> views and viewModels are located
          root: path.join(__dirname, "./web/js/"),

          // view settings for ojModule and <oj-module>
          view: {
            prefix: 'text!',
            match: "^\\./views/.+\\.html$" // regular expression for locating all views under the root folder
          },
          // viewModel sttings for ojModule and <oj-module>
          viewModel: {
            match: "^\\./viewModels/.+\\.js$", // regular expression for locating all viewModels under the root folder
            addExtension: ".js" // Webpack search for lazy modules does not add '.js' extension automatically, so we need to specify it explicitly
          }
        },
        // Point this setting to the root folder for the associated JET distribution (could be a CDN). Used by the oj.Config.getResourceUri() call
        baseResourceUrl: "./web/js/libs/oj/14.1.0"
      }
    )

  ]
};
