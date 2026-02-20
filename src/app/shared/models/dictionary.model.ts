export interface DictionaryEntry {
  id: string;
  lemma: string;
  transliteration?: string;
  meaning: string;
  root?: string;
}

export interface UserEntry {
  id: string;
  text: string;
  notes?: string;
  updatedAt: number;
}
