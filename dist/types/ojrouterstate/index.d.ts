/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export interface RouterState {
    canEnter: (() => boolean) | (() => Promise<boolean>);
    canExit: (() => boolean) | (() => Promise<boolean>);
    enter: (() => void) | (() => Promise<void>);
    exit: (() => void) | (() => Promise<void>);
    readonly id: string;
    label: string | undefined;
    parameters: {
        [key: string]: any;
    };
    title: string | (() => string | undefined);
    value: string;
}
export namespace RouterState {
    // tslint:disable-next-line interface-over-type-literal
    type ConfigOptions = {
        label?: string;
        value?: any;
        isDefault?: boolean;
        canEnter?: (() => boolean) | (() => Promise<boolean>);
        enter?: (() => void) | (() => Promise<void>);
        canExit?: (() => boolean) | (() => Promise<boolean>);
        exit?: (() => void) | (() => Promise<void>);
    };
}
declare let RouterState: {
    prototype: RouterState;
    go(): Promise<{
        hasChanged: boolean;
    }>;
    isCurrent(): boolean;
};
