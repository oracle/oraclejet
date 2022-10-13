/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx } from 'preact/jsx-runtime';

import { useCallback } from 'preact/hooks';
import { usePress } from './hooks/UNSAFE_usePress.js';
import { useTranslationBundle } from './hooks/UNSAFE_useTranslationBundle.js';

const ojButtonHeight = '2.75rem'; // TODO: replace this with var(--oj-button-border-radius) once it is available

const ojButtonBorderRadius = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-border-radius-md)'; // TODO: replace this with var(--oj-button-borderless-chrome-text-color) once it is available

const ojButtonBorderlessChromeTextColor = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-text-color-primary)'; // TODO: replace this with var(--oj-button-borderless-chrome-text-color-hover) once it is available

const ojButtonBorderlessChromeTextColorHover = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-text-color-primary)'; // TODO: replace this with var(--oj-button-borderless-chrome-bg-color-hover) once it is available

const ojButtonBorderlessChromeBgColorHover = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-bg-color-hover)'; // TODO: replace this with var(--oj-button-borderless-chrome-border-color-hover) once it is available

const ojButtonBorderlessChromeBorderColorHover = 'transparent';
const clearIconStyles = {
  base: "x4fsae"
};

const noop = () => {};

function ClearIcon({
  onClick
}) {
  const killEvent = useCallback(event => {
    event.preventDefault();
  }, []);
  const {
    pressProps
  } = usePress(onClick !== null && onClick !== void 0 ? onClick : noop);
  const translations = useTranslationBundle('@oracle/oraclejet-preact');
  const clearStr = translations.formControl_clear();
  return jsx("span", Object.assign({
    "aria-hidden": "true",
    class: clearIconStyles.base,
    tabIndex: -1,
    onMouseDown: killEvent,
    title: clearStr
  }, pressProps, {
    children: jsx("svg", Object.assign({
      height: "24",
      viewBox: "0 0 24 24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg"
    }, {
      children: jsx("path", {
        d: "m12 1c6.065 0 11 4.935 11 11s-4.935 11-11 11-11-4.935-11-11 4.935-11 11-11zm3.4979817 6-3.4979817 3.498-3.49798173-3.498-1.50201827 1.50201827 3.498 3.49798173-3.498 3.4979817 1.50201827 1.5020183 3.49798173-3.498 3.4979817 3.498 1.5020183-1.5020183-3.498-3.4979817 3.498-3.49798173z",
        fill: "#100f0e",
        "fill-rule": "evenodd"
      })
    }))
  }));
}

export { ClearIcon as C };
/*  */
//# sourceMappingURL=ClearIcon-2b8fb446.js.map
