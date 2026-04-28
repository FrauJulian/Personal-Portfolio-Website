import { Injectable, computed, signal } from '@angular/core';

import { deLanguage } from '../../languages/de';
import { enLanguage } from '../../languages/en';
import type { LanguageCode, LanguagePack } from '../../languages/language.types';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private static readonly storageKey = 'portfolio-language';
  private readonly currentLanguageCode = signal<LanguageCode>('en');
  private readonly languageConfirmed = signal(false);

  readonly languageCode = this.currentLanguageCode.asReadonly();
  readonly isLanguageConfirmed = this.languageConfirmed.asReadonly();
  readonly content = computed<LanguagePack>(() => this.getPack(this.currentLanguageCode()));

  initializeFromStorage(): LanguageCode {
    if (typeof window === 'undefined') {
      return this.currentLanguageCode();
    }

    const storedLanguage = window.localStorage.getItem(LanguageService.storageKey);
    if (storedLanguage === 'de' || storedLanguage === 'en') {
      this.currentLanguageCode.set(storedLanguage);
      this.languageConfirmed.set(true);
    }

    return this.currentLanguageCode();
  }

  confirmLanguage(code: LanguageCode): void {
    this.currentLanguageCode.set(code);
    this.languageConfirmed.set(true);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LanguageService.storageKey, code);
    }
  }

  getPack(code: LanguageCode): LanguagePack {
    return code === 'de' ? deLanguage : enLanguage;
  }
}
