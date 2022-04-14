define(['exports', 'preact', '@oracle/oraclejet-preact/utils/classNames'], (function (exports, preact, classNames) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    const styles = {
      base: "oj-avatar-base-h7wazt",
      circle: "oj-avatar-circle-10ze69p"
    };

    const StyledAvatar = ({
      background = 'neutral',
      size = 'md',
      shape = 'square',
      children
    }) => {
      const classes = classNames.classNames([styles.base, `oj-avatar-bg-${background}`, `oj-avatar-${size}`, shape === 'circle' && styles.circle]);
      return preact.h("div", {
        class: classes
      }, children);
    };

    const patternStyles = {
      base: "oj-avatar-base-q328hp"
    };

    const StyledAvatarPattern = () => preact.h("div", {
      class: patternStyles.base
    });

    const contentStyles = {
      base: "oj-avatar-base-ehtq2q"
    };

    const StyledAvatarContent = ({
      children,
      backgroundImage
    }) => preact.h("div", {
      class: contentStyles.base,
      style: backgroundImage && {
        backgroundImage: `url("${backgroundImage}")`
      }
    }, children);

    function Avatar(_a) {
      var {
        children,
        backgroundImage
      } = _a,
          styleProps = __rest(_a, ["children", "backgroundImage"]);

      return preact.h(StyledAvatar, Object.assign({}, styleProps), preact.h(StyledAvatarPattern, null), preact.h(StyledAvatarContent, {
        backgroundImage: backgroundImage
      }, children));
    }

    exports.Avatar = Avatar;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
