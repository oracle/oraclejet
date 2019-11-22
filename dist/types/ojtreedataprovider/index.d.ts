import { DataProvider } from '../ojdataprovider';
interface TreeDataProvider<K, D> extends DataProvider<K, D> {
    getChildDataProvider(parentKey: K): TreeDataProvider<K, D> | null;
}
export = TreeDataProvider;
