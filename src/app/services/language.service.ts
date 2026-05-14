import { Injectable, computed, signal } from '@angular/core';

import { deLanguage } from '../../languages/de';
import { enLanguage } from '../../languages/en';
import type { LanguageCode, LanguagePack, LanguageShellPack } from '../../languages/language.types';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private static readonly storageKey = 'portfolio-language';
  private readonly currentLanguageCode = signal<LanguageCode>('en');
  private readonly languageConfirmed = signal(true);

  readonly languageCode = this.currentLanguageCode.asReadonly();
  readonly isLanguageConfirmed = this.languageConfirmed.asReadonly();
  readonly content = computed<LanguagePack>(() => this.getPack(this.currentLanguageCode()));
  readonly shellContent = computed<LanguageShellPack>(() => this.toShellPack(this.content()));

  initializeFromStorage(): LanguageCode {
    if (typeof window === 'undefined') {
      return this.currentLanguageCode();
    }

    const storedLanguage = window.localStorage.getItem(LanguageService.storageKey);
    if (storedLanguage === 'de' || storedLanguage === 'en') {
      this.currentLanguageCode.set(storedLanguage);
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
    return this.toShellPack(this.getPack(code));
  }

  getPack(code: LanguageCode): LanguagePack {
    return code === 'de' ? deLanguage : enLanguage;
  }

  private toShellPack(pack: LanguagePack): LanguageShellPack {
    return {
      app: pack.app,
      footer: pack.footer,
    };
  }
}
