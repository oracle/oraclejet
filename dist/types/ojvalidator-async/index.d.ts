interface AsyncValidator<V> {
    hint?: Promise<(string | null)>;
    validate(value: V): Promise<void>;
}
export = AsyncValidator;
