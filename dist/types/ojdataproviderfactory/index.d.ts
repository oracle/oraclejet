import TreeDataProvider = require('../ojtreedataprovider');
import { DataProvider } from '../ojdataprovider';
export function getEnhancedDataProvider<K, D>(dataProvider: DataProvider<K, D>, capabilityConfigurations: CapabilityConfigurations): DataProvider<K, D>;
// tslint:disable-next-line interface-over-type-literal
export type CapabilityConfigurations = {
    eventFiltering?: {
        type?: "iterator";
    };
    fetchByOffset?: {
        caching?: "visitedByOffset";
    };
    fetchFirst?: {
        caching?: "visitedByCurrentIterator";
        forceLocalCaching?: "enabled";
        totalFilteredRowCount?: "exact";
    };
};
