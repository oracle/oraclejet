import { ItemMetadata } from 'ojs/ojdataprovider';
declare type MessageBannerSeverity = 'error' | 'warning' | 'confirmation' | 'info' | 'none';
export declare type MessageBannerItem = {
    closeAffordance?: 'on' | 'off';
    detail?: string;
    severity?: MessageBannerSeverity;
    sound?: 'default' | 'none' | string;
    summary?: string;
    timestamp?: string;
};
export declare type MessageBannerTemplateContext<K, D> = {
    data: D;
    index: number;
    key: K;
    metadata?: ItemMetadata<K>;
};
