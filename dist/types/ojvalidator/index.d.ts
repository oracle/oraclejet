interface Validator<V> {
    getHint?(): string | null;
    validate(value: V): void;
}
export = Validator;
