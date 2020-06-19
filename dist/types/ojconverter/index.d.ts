/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

interface Converter<V> {
    format(value: V): string | null;
    getHint?(): string | null;
    getOptions?(): object;
    parse(value: string): V | null;
    resolvedOptions?(): object;
}
export = Converter;
