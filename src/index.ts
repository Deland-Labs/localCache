import { ILocalCache } from './ILocalCache';
//import { IndexedDBCache } from './Providers/IndexedDBProvider';
import { LocalStorageCache } from './Providers/LocalStorageProvider';
import { SessionStorageCache } from './Providers/SessionStorageProvider';

enum CacheType {
  //IndexedDB = 1,
  SessionStorage = 2,
  LocalStorage = 4
}

class LocalCache implements ILocalCache {
  private cache?: ILocalCache;
  private fallbackCache?: ILocalCache;
  constructor(
    ttl?: number,
    cacheType?: CacheType,
    fallbackCacheType?: CacheType
  ) {
    switch (cacheType) {
      case undefined:
      case CacheType.SessionStorage:
        if (sessionStorage) this.cache = new SessionStorageCache(ttl);
        break;
      case CacheType.LocalStorage:
        if (localStorage) this.cache = new LocalStorageCache(ttl);
        break;
      default:
        break;
    }
    switch (fallbackCacheType) {
      case undefined:
      case CacheType.SessionStorage:
        if (sessionStorage) this.fallbackCache = new SessionStorageCache(ttl);
        break;
      default:
        break;
    }
  }
  getCurrentBucket = () => this._cache().getCurrentBucket();
  setCurrentBucket = (bucket: string) => this._cache().setCurrentBucket(bucket);
  set = <T>(key: string, value: any, ttl?: number) =>
    this._cache().set(key, value, ttl);
  get = <T>(key: string) => this._cache().get<T>(key);
  delete = (key: string) => this._cache().delete(key);
  flush = (expired: boolean) => this._cache().flush(expired);
  flushBucket = (expired: boolean, bucket?: string | undefined) =>
    this._cache().flushBucket(expired, bucket);
  buckets = () => this._cache().buckets();

  private _cache = () => {
    const provider = this.cache || this.fallbackCache;
    if (!provider) throw new Error('browser not supported');
    return provider;
  };
}
const CACHE_BUCKET = '__local_cache_bkt';
const cache = new LocalCache();
cache.setCurrentBucket(CACHE_BUCKET);
//cache key generate rule : cacheKey = pageName + uniqueKeyInPage
export const queryWithCache = async <T>(
  query: () => Promise<T>,
  cacheKey: string,
  ttl?: number
) => {
  const cacheItem = await cache.get<T>(cacheKey);
  if (cacheItem != undefined && cacheItem != null) {
    console.debug(`hit cache key ${cacheKey}`, cacheItem);
    return cacheItem;
  }

  const item = await query();
  await cache.set(cacheKey, item, ttl);
  return item as T;
};

export const deleteCache = async (cacheKey: string) => {
  await cache.delete(cacheKey);
};

export const flushCache = async () => {
  await cache.flush(true);
};

export const flushCacheBucket = async (expired: boolean, bucket?: string) => {
  await cache.flushBucket(expired, bucket);
};
