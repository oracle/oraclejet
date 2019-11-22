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
