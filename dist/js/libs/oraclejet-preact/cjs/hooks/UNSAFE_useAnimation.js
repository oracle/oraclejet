/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var tslib_es6 = require('../tslib.es6-e91f819d.js');

/**
 * Converts shorthand translate props into transform string representation.
 *
 * @param translateX
 * @param translateY
 * @param translateZ
 * @returns Longhand transform string representation.
 */
function convertTranslateShortcuts(translateX, translateY, translateZ) {
    return `${translateX ? ` translateX(${translateX})` : ''}${translateY ? ` translateY(${translateY})` : ''}${translateZ ? ` translateZ(${translateZ})` : ''}`;
}
/**
 * Converts shorthand rotate props into transform string representation.
 *
 * @param rotateX
 * @param rotateY
 * @param rotateZ
 * @returns Longhand transform string representation.
 */
function convertRotateShortcuts(rotateX, rotateY, rotateZ) {
    return `${rotateX ? ` rotateX(${rotateX})` : ''}${rotateY ? ` rotateY(${rotateY})` : ''}${rotateZ ? ` rotateZ(${rotateZ})` : ''}`;
}
/**
 * Converts shorthand scale props into transform string representation.
 *
 * @param scaleX
 * @param scaleY
 * @param scaleZ
 * @returns Longhand transform string representation.
 */
function convertScaleShortcuts(scaleX, scaleY, scaleZ) {
    return `${scaleX || scaleX === 0 ? ` scaleX(${scaleX})` : ''}${scaleY || scaleY === 0 ? ` scaleY(${scaleY})` : ''}${scaleZ || scaleZ === 0 ? ` scaleZ(${scaleZ})` : ''}`;
}
/**
 * Converts shorthand skew props into transform string representation.
 *
 * @param skewX
 * @param skewY
 * @returns Longhand transform string representation.
 */
function convertSkewShortcuts(skewX, skewY) {
    return `${skewX ? ` skewX(${skewX})` : ''}${skewY ? ` skewY(${skewY})` : ''}`;
}
/**
 * Converts animation CSS properties into Regular camel cased CSS properties.
 *
 * @param useAnimationCssProperties This include transform shorthand props.
 * @returns Regular camel cased CSS properties.
 */
function convertUseAnimationCssPropertiesToRegularCSS(useAnimationCssProperties) {
    if (!useAnimationCssProperties) {
        return {};
    }
    const { translateX, translateY, translateZ, rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ, skewX, skewY } = useAnimationCssProperties, otherCssProperties = tslib_es6.__rest(useAnimationCssProperties, ["translateX", "translateY", "translateZ", "rotateX", "rotateY", "rotateZ", "scaleX", "scaleY", "scaleZ", "skewX", "skewY"]);
    const initialTransformValue = useAnimationCssProperties['transform'] || '';
    // Now we just add values pased in shortcuts to transform property, do we want to replace it instead?
    const finalTransformValue = `${initialTransformValue}${convertTranslateShortcuts(translateX, translateY, translateZ)}${convertRotateShortcuts(rotateX, rotateY, rotateZ)}${convertScaleShortcuts(scaleX, scaleY, scaleZ)}${convertSkewShortcuts(skewX, skewY)}`;
    return Object.assign(Object.assign({}, otherCssProperties), (finalTransformValue && { transform: finalTransformValue }));
}
/**
 * Converts animation CSS properties into WAAPI keyframe properties.
 * Since keyframes have a difference between offset and cssOffset this collision is avoided here.
 *
 * @param useAnimationCssProperties This include transform shorthand props.
 * @returns WAAPI keyframe
 */
function convertUseAnimationCssPropertiesToWAAPIKeyframe(useAnimationCssProperties) {
    if (!useAnimationCssProperties) {
        return {};
    }
    const _a = convertUseAnimationCssPropertiesToRegularCSS(useAnimationCssProperties), { offset } = _a, otherCssProperties = tslib_es6.__rest(_a, ["offset"]);
    return Object.assign(Object.assign({}, otherCssProperties), (offset && { cssOffset: offset }));
}

/**
 * Hook to animate single components.
 * It allows n number of animation states.
 * @param animationState
 * @param animationConfig
 * @returns
 */
function useAnimation(animationState, { animationStates, isAnimatedOnMount = false, onAnimationEnd = () => { } }) {
    const didMountRef = hooks.useRef(false);
    const nodeRef = hooks.useRef(null);
    const currentAnimationState = hooks.useRef();
    const currentAnimation = hooks.useRef();
    // We don't allow changing animationStates. Ref to keep "first run" animation states.
    const animationStatesRef = hooks.useRef(animationStates);
    hooks.useLayoutEffect(() => {
        stopAnimation(currentAnimation.current);
        const animatedElement = nodeRef.current;
        if (!animatedElement) {
            return;
        }
        const previousAnimationState = currentAnimationState.current;
        currentAnimationState.current = animationState;
        const animationConfig = getConfig(animationStatesRef.current, animatedElement, animationState, previousAnimationState);
        if (!animationConfig) {
            return;
        }
        if (!didMountRef.current) {
            didMountRef.current = true;
            if (!isAnimatedOnMount) {
                setEndStyle(animatedElement, true, animationConfig);
                return;
            }
        }
        currentAnimation.current = startAnimation(animationConfig, animatedElement, animationState, onAnimationEnd);
    }, [animationState]);
    /**
     * Used to cancel current animation. When animation is canceled node style goes back to style of last finished animation
     * @returns
     */
    const cancelCurrentAnimation = hooks.useCallback(() => {
        const animation = currentAnimation.current;
        if ((animation === null || animation === void 0 ? void 0 : animation.playState) === 'running') {
            animation.currentTime = 0;
            stopAnimation(animation);
        }
    }, []);
    return { nodeRef, controller: { cancel: cancelCurrentAnimation } };
}
/**
 * Stops an animation.
 *
 * @param animation Animation that is going to be stopped.
 * @returns
 */
function stopAnimation(animation) {
    if (animation) {
        // TO DO: rollup-plugin-typescript seems to have an outdated Animation typing. That produces warnings while bulding.
        // Update picked type to get rid of this casting.
        animation.commitStyles();
        animation.cancel();
    }
}
/**
 * Gets animation configuration.
 *
 * @param animationStates Set of animation configurations provided by the user.
 * @param animatedElement Element that is going to be styled.
 * @param animationState Current animation state.
 * @param previousAnimationState Previous animation state.
 * @returns AnimationConfig.
 */
function getConfig(animationStates, animatedElement, animationState, previousAnimationState) {
    const currentAnimationStateConfig = animationStates[`${previousAnimationState} => ${animationState}`] ||
        animationStates[animationState];
    const animationConfig = typeof currentAnimationStateConfig === 'function'
        ? currentAnimationStateConfig(animatedElement)
        : currentAnimationStateConfig;
    return animationConfig && Object.keys(animationConfig).length > 0 ? animationConfig : null;
}
/**
 * Starts an animation.
 *
 * @param animationConfig Animation configuration used by the animation.
 * @param animatedElement Element that is going to be styled.
 * @param animationState Current animation state.
 * @param onAnimationEnd Callback called once the animation is completed.
 * @returns Animation.
 */
function startAnimation(animationConfig, animatedElement, animationState, onAnimationEnd) {
    const { delay, duration, easing } = animationConfig.options || {};
    //Now, if user does not pass a value we override it by hand. We will use theming tools in future.
    const animationOptions = {
        delay: delay || 0,
        duration: duration || 400,
        easing: easing
            ? typeof easing === 'string'
                ? easing
                : `cubic-bezier(${easing[0]}, ${easing[1]}, ${easing[2]}, ${easing[3]})`
            : 'ease'
    };
    // WAAPI animation method. https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
    // TO DO: Check for required browser compatibility in case we need pollyfill.
    // https://github.com/web-animations/web-animations-js/blob/dev/docs/support.md#browser-support
    const startedAnimation = animatedElement.animate([
        convertUseAnimationCssPropertiesToWAAPIKeyframe(animationConfig.from),
        convertUseAnimationCssPropertiesToWAAPIKeyframe(animationConfig.to)
    ], Object.assign(Object.assign({}, animationOptions), { fill: 'forwards' }));
    startedAnimation.onfinish = () => {
        //We commit styles to have an only source of truth.
        stopAnimation(startedAnimation);
        //In case user pass a final style after animation we do that here.
        setEndStyle(animatedElement, false, animationConfig);
        // On animationEnd is only called when animation actually finished. If an animation is interruped by other one
        // the old one will not be finished. Do we want to have a callback for those cases?
        onAnimationEnd === null || onAnimationEnd === void 0 ? void 0 : onAnimationEnd({ animationState });
    };
    return startedAnimation;
}
/**
 * Sets element style.
 *
 * @param animatedElement Element that is going to be styled.
 * @param toAndEndStyle Represents which data will be used to set style. If set to true it uses "to" and "endStyle".
 * If set to false it uses just "endStyle".
 * @param animationConfig Style that is going to be set.
 */
function setEndStyle(animatedElement, toAndEndStyle, animationConfig) {
    const endStyle = toAndEndStyle
        ? Object.assign(Object.assign({}, convertUseAnimationCssPropertiesToRegularCSS(animationConfig.to)), convertUseAnimationCssPropertiesToRegularCSS(animationConfig.end)) : convertUseAnimationCssPropertiesToRegularCSS(animationConfig.end);
    for (const key in endStyle) {
        //TO DO: Look for a better way to handle types.
        animatedElement.style[key] = endStyle[key];
    }
}

exports.useAnimation = useAnimation;
/*  */
//# sourceMappingURL=UNSAFE_useAnimation.js.map
