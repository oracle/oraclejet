/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
import { jsx } from 'preact/jsx-runtime';
import { classNames } from './utils/UNSAFE_classNames.js';
import './UNSAFE_Avatar.css';

function Avatar(_a) {
  var {
    children,
    src
  } = _a,
      otherProps = __rest(_a, ["children", "src"]);

  if (src && !children) {
    return jsx(ImageAvatar, Object.assign({
      src: src
    }, otherProps));
  } else {
    return jsx(ContentAvatar, Object.assign({}, otherProps, {
      children: children
    }));
  }
}

const ImageAvatar = _a => {
  var {
    src
  } = _a,
      otherProps = __rest(_a, ["src"]);

  const classes = classNames([contentStyles.base, contentStyles.image]);
  return jsx(AvatarWrapper, Object.assign({}, otherProps, {
    children: jsx("div", {
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
      otherProps = __rest(_a, ["children", "initials"]);

  const classes = [contentStyles.base, contentStyles.content, initials ? contentStyles.initials : contentStyles.icon];
  const childContent = initials || children;
  return jsx(AvatarWrapper, Object.assign({}, otherProps, {
    children: jsx("div", Object.assign({
      "aria-hidden": "true",
      class: classNames(classes)
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
  const classes = classNames([styles.base, `oj-c-avatar-bg-${background}`, `oj-c-avatar-${size}`, shape === 'circle' && styles.circle]);

  if (accessibleLabel) {
    return jsx("div", Object.assign({
      "aria-label": accessibleLabel,
      role: "img",
      class: classes
    }, {
      children: children
    }));
  } else {
    return jsx("div", Object.assign({
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

export { Avatar };
/*  */
//# sourceMappingURL=UNSAFE_Avatar.js.map
