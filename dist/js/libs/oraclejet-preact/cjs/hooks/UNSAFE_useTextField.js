/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var hooks_UNSAFE_useId = require('./UNSAFE_useId.js');

const rankedSeverities = ['error', 'warning', 'confirmation', 'info', 'none'];
/**
 * A custom hook to determine the props for a component that renders
 * a text field
 */
function useTextField({ id: propId, isDisabled, isFocused, isLoading, isReadonly, labelEdge, messages, value, variant }) {
    const baseId = hooks_UNSAFE_useId.useId();
    const id = propId || baseId;
    const labelId = labelEdge !== 'none' ? `${baseId}-label` : undefined;
    const inputId = !isReadonly ? `${baseId}-input` : undefined;
    const uaId = !(isDisabled || isReadonly) ? `${baseId}-ua` : undefined;
    // Create the form field context
    const formFieldContext = hooks.useMemo(() => {
        const hasValue = value !== undefined && (typeof value !== 'string' || value !== '');
        return isReadonly
            ? {
                hasValue: hasValue,
                isFocused: isFocused,
                isLoading,
                isReadonly: true
            }
            : isDisabled
                ? {
                    hasValue: hasValue,
                    isDisabled: true,
                    isLoading
                }
                : {
                    hasValue: hasValue,
                    isFocused: isFocused,
                    isLoading
                };
    }, [isDisabled, isFocused, isLoading, isReadonly, value]);
    // Determine the highest severity from the messages
    const messageSeverity = hooks.useMemo(() => {
        return messages === undefined
            ? undefined
            : messages.reduce((accSeverity, currMessage) => {
                const currSeverity = currMessage.severity || 'error';
                return rankedSeverities.indexOf(accSeverity) < rankedSeverities.indexOf(currSeverity)
                    ? accSeverity
                    : currSeverity;
            }, 'none');
    }, [messages]);
    // Determine the label variant
    const labelVariant = labelEdge === 'inside'
        ? messageSeverity === 'error'
            ? 'insideError'
            : messageSeverity === 'warning'
                ? 'insideWarning'
                : labelEdge
        : labelEdge !== 'none'
            ? labelEdge
            : undefined;
    const textFieldVariant = messageSeverity
        ? messageSeverity === 'error'
            ? variant
                ? `${variant}Error`
                : messageSeverity
            : messageSeverity === 'warning'
                ? variant
                    ? `${variant}Warning`
                    : messageSeverity
                : variant
        : variant;
    return {
        baseId,
        formFieldContext,
        inputProps: {
            id: inputId,
            ariaDescribedby: uaId,
            ariaInvalid: messageSeverity === 'error' ? 'true' : undefined
        },
        labelProps: {
            forId: inputId,
            id: labelId,
            variant: labelVariant
        },
        textFieldProps: {
            id,
            variant: textFieldVariant
        },
        userAssistanceProps: {
            id: uaId
        }
    };
}

exports.useTextField = useTextField;
/*  */
//# sourceMappingURL=UNSAFE_useTextField.js.map
