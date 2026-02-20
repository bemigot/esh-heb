import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DictionaryService } from './dictionary.service';
import { StorageService } from './storage.service';
import { DictionaryEntry } from '../../shared/models/dictionary.model';

describe('DictionaryService', () => {
  let service: DictionaryService;
  let httpMock: HttpTestingController;
  let storageServiceMock: any;

  const mockData: DictionaryEntry[] = [
    { id: 'h1', lemma: 'א', meaning: 'alpha', transliteration: 'a' },
    { id: 'h2', lemma: 'ב', meaning: 'beta', transliteration: 'b' }
  ];

  beforeEach(() => {
    storageServiceMock = {
      getAll: vi.fn(() => Promise.resolve([])),
      put: vi.fn(() => Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        DictionaryService,
        { provide: StorageService, useValue: storageServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(DictionaryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should filter results based on search query', async () => {
    // 1. Trigger init explicitly and handle the HTTP call
    const initPromise = service.init();
    
    const req = httpMock.expectOne('/data/dictionary.json');
    req.flush(mockData);

    await initPromise;

    // 2. Test initial state (no query)
    expect(service.searchResults().length).toBe(2);

    // 3. Search for 'beta' (English meaning)
    service.search('beta');
    expect(service.searchResults().length).toBe(1);
    expect(service.searchResults()[0].id).toBe('h2');

    // 4. Search for 'א' (Hebrew lemma)
    service.search('א');
    expect(service.searchResults().length).toBe(1);
    expect(service.searchResults()[0].id).toBe('h1');
  });
});
