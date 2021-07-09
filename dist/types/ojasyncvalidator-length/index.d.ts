import LengthValidator = require('../ojvalidator-length');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncLengthValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: LengthValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncLengthValidator;
