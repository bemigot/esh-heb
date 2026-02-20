import { Routes } from '@angular/router';
import { DictionaryComponent } from './features/dictionary/dictionary.component';

export const routes: Routes = [
  { path: '', component: DictionaryComponent },
  { path: 'dictionary', component: DictionaryComponent },
];
