import Message = require('../ojmessaging');
/** @deprecated since 20.0.0 - Applications should use native Javascript Error to construct the conversion errors, e.g., "new Error(`error message detail`)." */
export interface ConverterError {
    // constructor(summary: string, detail: string);
    getMessage(): Message;
}
/** @deprecated since 20.0.0 - Applications should use native Javascript Error to construct the validation errors, e.g., "new Error(`error message detail`)." */
export interface ValidatorError {
    // constructor(summary: string, detail: string);
    getMessage(): Message;
}
