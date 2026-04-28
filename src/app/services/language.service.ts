import { Injectable, computed, signal } from '@angular/core';

import type { LanguageCode, LanguageShellPack } from '../../languages/language.types';

const enShellLanguage: LanguageShellPack = {
  app: {
    selectorTitle: 'Select language',
    changeLanguage: 'Language',
    changeLanguageAriaLabel: 'Change language',
    closeSelector: 'Close language selection',
    languageEnglish: 'English',
    languageGerman: 'German',
  },
  footer: {
    noscriptMessage: 'Please enable JavaScript for the full experience.',
    imprintLink: 'Imprint',
  },
};

const deShellLanguage: LanguageShellPack = {
  app: {
    selectorTitle: 'Sprache wählen',
    changeLanguage: 'Sprache',
    changeLanguageAriaLabel: 'Sprache wechseln',
    closeSelector: 'Sprachauswahl schliessen',
    languageEnglish: 'Englisch',
    languageGerman: 'Deutsch',
  },
  footer: {
    noscriptMessage: 'Bitte aktiviere JavaScript für die volle Darstellung.',
    imprintLink: 'Impressum',
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private static readonly storageKey = 'portfolio-language';
  private readonly currentLanguageCode = signal<LanguageCode>('en');
  private readonly languageConfirmed = signal(false);

  readonly languageCode = this.currentLanguageCode.asReadonly();
  readonly isLanguageConfirmed = this.languageConfirmed.asReadonly();
  readonly content = computed<LanguageShellPack>(() =>
    this.getShellPack(this.currentLanguageCode()),
  );

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

  getShellPack(code: LanguageCode): LanguageShellPack {
    return code === 'de' ? deShellLanguage : enShellLanguage;
  }
}
