/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

declare class BusyContext {
    addBusyState(options: {
        description: {
            toString: () => string;
            [propName: string]: any;
        } | (() => string) | string;
    }): (() => void);
    applicationBootstrapComplete(): undefined;
    clear(): undefined;
    dump(message?: string): undefined;
    getBusyStates(): Array<{
        id: string;
        description: string;
    }>;
    isReady(): boolean;
    toString(): string;
    whenReady(timeout?: number): Promise<(boolean | Error)>;
}
declare namespace Context {
    interface BusyContext {
        addBusyState(options: {
            description: {
                toString: () => string;
                [propName: string]: any;
            } | (() => string) | string;
        }): (() => void);
        applicationBootstrapComplete(): undefined;
        clear(): undefined;
        dump(message?: string): undefined;
        getBusyStates(): Array<{
            id: string;
            description: string;
        }>;
        isReady(): boolean;
        toString(): string;
        whenReady(timeout?: number): Promise<(boolean | Error)>;
    }
}
declare class Context {
    static getContext(node: Element): Context;
    static getPageContext(): Context;
    static setBusyContextDefaultTimeout(timeout: number): any;
    getBusyContext(): BusyContext;
}
export = Context;
