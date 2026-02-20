import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DictionaryService } from '../../core/services/dictionary.service';
import { DictionaryEntry } from '../../shared/models/dictionary.model';
import { KeyboardComponent } from '../keyboard/keyboard.component';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, FormsModule, KeyboardComponent],
  templateUrl: './dictionary.component.html',
  styleUrl: './dictionary.component.css'
})
export class DictionaryComponent {
  dictionaryService = inject(DictionaryService);
  
  searchQuery = signal('');
  results = this.dictionaryService.searchResults;
  isSearchActive = computed(() => this.searchQuery().trim().length > 0);
  selectedEntry = signal<DictionaryEntry | null>(null);
  showKeyboard = signal(false);

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.dictionaryService.search(query);
  }

  onKeyInput(char: string) {
    const newQuery = this.searchQuery() + char;
    this.onSearch(newQuery);
  }

  onBackspace() {
    const current = this.searchQuery();
    if (current.length === 0) return;

    let bk = 1;
    if (current.length > 1) {
      const lastChar = current.charCodeAt(current.length - 1);
      if (lastChar === 0x05C1 || lastChar === 0x05C2) {
        bk = 2;
      }
    }
    
    const newQuery = current.substring(0, current.length - bk);
    this.onSearch(newQuery);
  }

  selectEntry(entry: DictionaryEntry) {
    this.selectedEntry.set(entry);
  }
}
