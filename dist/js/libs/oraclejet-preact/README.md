# @oracle/oraclejet-preact
Oracle JET components built using Preact

## Usage
For AMD-based projects, import using
```javascript
import { Avatar } from '@oracle/oraclejet-preact/Avatar';
```

For non-AMD projects, the optional shorthand notation will also work
```javascript
import { Avatar } from '@oracle/oraclejet-preact';
```

## Bundling CSS
`oraclejet-preact` components are modular, and each one may have associated CSS
that's needed to make the UI functional.

Depending on the module used, some components may have imports such as
```javascript
// ES module
import './Component.css';
```
or
```javascript
// AMD module
define(['exports', 'css!./Component.css'])
```

When bundling the component within your application, you must configure the
bundler to correct import the CSS.

### Webpack
Webpack can use the [css-loader](https://webpack.js.org/loaders/css-loader/) to
bundle and serve up the CSS. It's recommended to use `oraclejet-preact`'s ES
module distribution.

### RequireJS
If bundling or running with RequireJS, you'll want to use the
[require-css](https://github.com/guybedford/require-css). You must use `oraclejet-preact`'s
AMD distribution for this.
