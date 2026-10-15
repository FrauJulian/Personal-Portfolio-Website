import { Injectable, signal } from '@angular/core';

import type { LanguageCode } from '../../languages/language.types';

const isLanguageCode = (value: string | null): value is LanguageCode =>
  value === 'en' || value === 'de';

@Injectable({ providedIn: 'root' })
export class LanguagePreferenceService {
  private static readonly storageKey = 'portfolio-language';
  private readonly currentLanguageCode = signal<LanguageCode>('en');

  readonly languageCode = this.currentLanguageCode.asReadonly();

  /** Picks the language from `?lang=`, then the stored choice, then the browser language. */
  initialize(): LanguageCode {
    if (typeof window === 'undefined') {
      return this.currentLanguageCode();
    }

    const candidates = [
      new URLSearchParams(window.location.search).get('lang'),
      window.localStorage.getItem(LanguagePreferenceService.storageKey),
      window.navigator.language.slice(0, 2).toLowerCase(),
    ];
    const language = candidates.find(isLanguageCode) ?? 'en';
    this.currentLanguageCode.set(language);

    return language;
  }

  confirmLanguage(code: LanguageCode): void {
    this.currentLanguageCode.set(code);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LanguagePreferenceService.storageKey, code);
    }
  }
}
