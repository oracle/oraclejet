import { Size } from 'src/utils/UNSAFE_size';
/**
 * Props of the FormContext
 */
declare type FormContextProps = {
    /**
     * Indicates whether the form layout is disabled.
     */
    isDisabled?: boolean;
    /**
     * Indicates whether the component is inside a form layout.
     */
    isFormLayout?: boolean;
    /**
     * Indicates whether the form layout is readonly.
     */
    isReadonly?: boolean;
    /**
     * Specifies the label position.
     */
    labelEdge?: 'inside' | 'start' | 'top';
    /**
     * Specifies the width of the start aligned label, ignored for top aligned.
     */
    labelStartWidth?: Size;
    /**
     * Specifies if start or top label text should wrap or truncate.
     */
    labelWrapping?: 'truncate' | 'wrap';
    /**
     * Specifies the text alignment of the value.
     */
    textAlign?: 'start' | 'end' | 'right';
    /**
     * Specifies the density of the user assistance presentation.
     */
    userAssistanceDensity?: 'reflow' | 'efficient';
};
declare const DefaultFormContext: FormContextProps;
/**
 * Context which the parent component can use to provide various FormLayout related
 * information to descendant form controls.
 */
declare const FormContext: import("preact").Context<FormContextProps>;
export { DefaultFormContext, FormContext, FormContextProps };
