import Message = require('../ojmessaging');
export interface ConverterError {
    // constructor(summary: string, detail: string);
    getMessage(): Message;
}
export interface ValidatorError {
    // constructor(summary: string, detail: string);
    getMessage(): Message;
}
