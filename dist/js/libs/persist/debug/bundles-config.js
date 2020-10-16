(function(){
  requirejs.config({
    bundles:
    {
      'persist/offline-persistence-toolkit-core-1.5.0': [
        'persist/persistenceUtils',
        'persist/impl/logger',
        'persist/impl/PersistenceXMLHttpRequest',
        'persist/persistenceStoreManager',
        'persist/impl/defaultCacheHandler',
        'persist/impl/PersistenceSyncManager',
        'persist/impl/OfflineCache',
        'persist/impl/offlineCacheManager',
        'persist/impl/fetch',
        'persist/persistenceManager'
      ],
      'persist/offline-persistence-toolkit-pouchdbstore-1.5.0': [
        'persist/PersistenceStore',
        'persist/impl/storageUtils',
        'persist/pouchdb-browser-7.0.0',
        'persist/impl/pouchDBPersistenceStore',
        'persist/pouchDBPersistenceStoreFactory',
        'persist/configurablePouchDBStoreFactory',
        'persist/persistenceStoreFactory'
      ],
      'persist/offline-persistence-toolkit-arraystore-1.5.0': [
        'persist/PersistenceStore',
        'persist/impl/storageUtils',
        'persist/impl/keyValuePersistenceStore',
        'persist/impl/arrayPersistenceStore',
        'persist/arrayPersistenceStoreFactory',
        'persist/persistenceStoreFactory'
      ],
      'persist/offline-persistence-toolkit-localstore-1.5.0': [
        'persist/PersistenceStore',
        'persist/impl/storageUtils',
        'persist/impl/keyValuePersistenceStore',
        'persist/impl/localPersistenceStore',
        'persist/localPersistenceStoreFactory',
        'persist/persistenceStoreFactory'
      ],
      'persist/offline-persistence-toolkit-filesystemstore-1.5.0': [
        'persist/impl/storageUtils',
        'persist/impl/keyValuePersistenceStore',
        'persist/impl/fileSystemPersistenceStore',
        'persist/fileSystemPersistenceStoreFactory'
      ],
      'persist/offline-persistence-toolkit-responseproxy-1.5.0': [
        'persist/fetchStrategies',
        'persist/cacheStrategies',
        'persist/defaultResponseProxy',
        'persist/simpleJsonShredding',
        'persist/oracleRestJsonShredding',
        'persist/simpleBinaryDataShredding',
        'persist/queryHandlers'
      ]
    }
  })
})()
