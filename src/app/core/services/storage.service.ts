import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbPromise: Promise<IDBPDatabase>;
  private readonly DB_NAME = 'bible-hebrew-db';
  private readonly STORE_NAME = 'keyval';

  constructor() {
    this.dbPromise = openDB(this.DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore('keyval');
        db.createObjectStore('dictionary', { keyPath: 'id' });
        db.createObjectStore('user_entries', { keyPath: 'id' });
      },
    });
  }

  async get<T>(key: string, storeName: string = this.STORE_NAME): Promise<T | undefined> {
    return (await this.dbPromise).get(storeName, key);
  }

  async set(key: string, value: any, storeName: string = this.STORE_NAME): Promise<any> {
    return (await this.dbPromise).put(storeName, value, key);
  }

  async put(value: any, storeName: string): Promise<any> {
    return (await this.dbPromise).put(storeName, value);
  }

  async remove(key: string, storeName: string = this.STORE_NAME): Promise<void> {
    return (await this.dbPromise).delete(storeName, key);
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    return (await this.dbPromise).getAll(storeName);
  }

  async clear(storeName: string): Promise<void> {
    return (await this.dbPromise).clear(storeName);
  }
}
