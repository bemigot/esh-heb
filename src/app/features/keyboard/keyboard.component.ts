import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="keyboard-grid" dir="rtl">
      @for (row of keyRows; track $index) {
        @for (key of row; track key) {
          <button
            type="button"
            (click)="onKeyClick(key)"
            [class.vowel]="isVowel(key)"
            [class.special]="isSpecial(key)"
          >
            {{ key === ' ' ? '␣' : key }}
          </button>
        }
      }
    </div>
  `,
  styles: [`
    .keyboard-grid {
      display: grid;
      grid-template-columns: repeat(15, 1fr);
      gap: 4px;
      padding: 10px;
      background: #f0f0f0;
      border-radius: 8px;
      user-select: none;
      touch-action: manipulation;
    }
    button {
      height: 45px;
      font-size: 1.2rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    button:active {
      background: #e0e0e0;
      transform: translateY(1px);
    }
    .vowel {
      color: #0066cc;
      background: #f9f9f9;
      font-size: 1.4rem;
    }
    .special {
      background: #eee;
      font-weight: bold;
    }
    
    @media (max-width: 600px) {
      .keyboard-grid {
        gap: 2px;
        padding: 5px;
      }
      button {
        height: 38px;
        font-size: 1rem;
      }
    }
  `]
})
export class KeyboardComponent {
  keyClicked = output<string>();
  backspaceClicked = output<void>();

  // Constants for characters
  readonly aco = '\u05AB'; // Accent Ole
  readonly sva = '\u05B0'; // Sheva
  readonly hsg = '\u05B1'; // Hataf Segol
  readonly hpt = '\u05B2'; // Hataf Patah
  readonly hqz = '\u05B3'; // Hataf Qamats
  readonly hir = '\u05B4'; // Hiriq
  readonly zre = '\u05B5'; // Tsere
  readonly sgl = '\u05B6'; // Segol
  readonly pth = '\u05B7'; // Patah
  readonly qmz = '\u05B8'; // Qamats
  readonly hlm = '\u05B9'; // Holam
  readonly qbz = '\u05BB'; // Qubuts
  readonly dmq = '\u05BC'; // Dagesh or Mapiq
  readonly mtg = '\u05BD'; // Meteg
  readonly mqf = '\u05BE'; // Maqaf

  // Grid definition: 15 columns x 3 rows
  // Right-most keys come first in the array due to dir="rtl"
  readonly keyRows = [
    // Row 1: Backspace, Alef, Bet, then rest of oskb row 1 reversed
    ['⌫', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', this.aco, 'ך', 'ם', 'ן', 'ף', 'ץ'],
    // Row 2: Middle keys from oskb, adjusted to 15 keys
    [this.dmq, 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', this.mtg, this.hlm, this.hqz, this.zre, this.sgl, this.hsg, this.sva],
    // Row 3: Space, Ain, Pe, then rest of oskb row 3 reversed
    [' ', 'ע', 'פ', 'צ', 'ק', 'ר', 'שׁ', 'שׂ', 'ת', this.mqf, this.qbz, this.hir, this.hpt, this.qmz, this.pth],
  ];

  onKeyClick(key: string) {
    if (key === '⌫') {
      this.backspaceClicked.emit();
    } else {
      this.keyClicked.emit(key);
    }
  }

  isVowel(key: string): boolean {
    const code = key.charCodeAt(0);
    return code >= 0x05B0 && code <= 0x05BD;
  }

  isSpecial(key: string): boolean {
    return key === '⌫' || key === ' ';
  }
}
