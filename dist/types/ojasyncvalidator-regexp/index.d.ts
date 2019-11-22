import RegExpValidator = require('../ojvalidator-regexp');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncRegExpValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: RegExpValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncRegExpValidator;
