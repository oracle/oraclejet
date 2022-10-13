/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');
require('./utils/UNSAFE_classNames.js');
require('identity-obj-proxy');
var classNames = require('./classNames-82bfab52.js');

function Avatar(_a) {
  var {
    children,
    src
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["children", "src"]);

  if (src && !children) {
    return jsxRuntime.jsx(ImageAvatar, Object.assign({
      src: src
    }, otherProps));
  } else {
    return jsxRuntime.jsx(ContentAvatar, Object.assign({}, otherProps, {
      children: children
    }));
  }
}

const ImageAvatar = _a => {
  var {
    src
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["src"]);

  const classes = classNames.classNames([contentStyles.base, contentStyles.image]);
  return jsxRuntime.jsx(AvatarWrapper, Object.assign({}, otherProps, {
    children: jsxRuntime.jsx("div", {
      class: classes,
      style: {
        backgroundImage: `url(${src})`
      }
    })
  }));
};

const ContentAvatar = _a => {
  var {
    children,
    initials
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["children", "initials"]);

  const classes = [contentStyles.base, contentStyles.content, initials ? contentStyles.initials : contentStyles.icon];
  const childContent = initials || children;
  return jsxRuntime.jsx(AvatarWrapper, Object.assign({}, otherProps, {
    children: jsxRuntime.jsx("div", Object.assign({
      "aria-hidden": "true",
      class: classNames.classNames(classes)
    }, {
      children: childContent
    }))
  }));
};

const AvatarWrapper = ({
  background = 'neutral',
  size = 'md',
  shape = 'square',
  children,
  accessibleLabel
}) => {
  const classes = classNames.classNames([styles.base, `oj-c-avatar-bg-${background}`, `oj-c-avatar-${size}`, shape === 'circle' && styles.circle]);

  if (accessibleLabel) {
    return jsxRuntime.jsx("div", Object.assign({
      "aria-label": accessibleLabel,
      role: "img",
      class: classes
    }, {
      children: children
    }));
  } else {
    return jsxRuntime.jsx("div", Object.assign({
      class: classes
    }, {
      children: children
    }));
  }
};

const styles = {
  base: "_1bu6wv",
  circle: "_0f93l"
};
const contentStyles = {
  base: "y6dkls",
  content: "_7b3rpj",
  image: "jduz12",
  initials: "goml2v",
  icon: "_dpb87j"
};

exports.Avatar = Avatar;
/*  */
//# sourceMappingURL=UNSAFE_Avatar.js.map
