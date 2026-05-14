import { Injectable, signal } from '@angular/core';

import type { LanguageCode } from '../../languages/language.types';

@Injectable({ providedIn: 'root' })
export class LanguagePreferenceService {
  private static readonly storageKey = 'portfolio-language';
  private readonly currentLanguageCode = signal<LanguageCode>('en');
  private readonly languageConfirmed = signal(true);

  readonly languageCode = this.currentLanguageCode.asReadonly();
  readonly isLanguageConfirmed = this.languageConfirmed.asReadonly();

  initializeFromStorage(): LanguageCode {
    if (typeof window === 'undefined') {
      return this.currentLanguageCode();
    }

    const storedLanguage = window.localStorage.getItem(LanguagePreferenceService.storageKey);
    if (storedLanguage === 'de' || storedLanguage === 'en') {
      this.currentLanguageCode.set(storedLanguage);
    }

    return this.currentLanguageCode();
  }

  confirmLanguage(code: LanguageCode): void {
    this.currentLanguageCode.set(code);
    this.languageConfirmed.set(true);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LanguagePreferenceService.storageKey, code);
    }
  }
}
