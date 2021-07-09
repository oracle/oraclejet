import RequiredValidator = require('../ojvalidator-required');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncRequiredValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: RequiredValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncRequiredValidator;
