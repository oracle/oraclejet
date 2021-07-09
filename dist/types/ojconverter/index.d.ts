interface Converter<V> {
    format(value: V): string | null;
    getHint?(): string | null;
    getOptions?(): object;
    parse(value: string): V | null;
    resolvedOptions?(): object;
}
export = Converter;
