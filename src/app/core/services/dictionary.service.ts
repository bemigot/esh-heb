import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DictionaryEntry } from '../../shared/models/dictionary.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private allEntries = signal<DictionaryEntry[]>([]);
  private searchQuery = signal<string>('');
  
  loading = signal<boolean>(false);

  // Computed signal for filtered results
  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allEntries();
    
    return this.allEntries().filter(entry => 
      entry.lemma.includes(query) || 
      entry.meaning.toLowerCase().includes(query) ||
      entry.transliteration?.toLowerCase().includes(query) ||
      entry.root?.includes(query)
    );
  });

  constructor() {
    // Initial call in constructor, but it will check if already loaded
    this.init();
  }

  private initPromise: Promise<void> | null = null;

  public async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      if (this.allEntries().length > 0) return;
      this.loading.set(true);
      try {
        let entries = await this.storage.getAll<DictionaryEntry>('dictionary');
        if (entries.length === 0) {
          entries = await this.fetchDictionary();
          for (const entry of entries) {
            await this.storage.put(entry, 'dictionary');
          }
        }
        this.allEntries.set(entries);
      } catch (error) {
        console.error('Failed to initialize dictionary:', error);
      } finally {
        this.loading.set(false);
      }
    })();

    return this.initPromise;
  }

  private fetchDictionary(): Promise<DictionaryEntry[]> {
    return new Promise((resolve, reject) => {
      this.http.get<DictionaryEntry[]>('/data/dictionary.json').subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err)
      });
    });
  }

  search(query: string) {
    this.searchQuery.set(query);
  }
}
