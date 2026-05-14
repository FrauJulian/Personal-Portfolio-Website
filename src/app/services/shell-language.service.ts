import { Injectable, computed, inject } from '@angular/core';

import { deShellLanguage, enShellLanguage } from '../../languages/shell';
import type { LanguageCode, LanguageShellPack } from '../../languages/language.types';
import { LanguagePreferenceService } from './language-preference.service';

@Injectable({ providedIn: 'root' })
export class ShellLanguageService {
  private readonly languagePreferenceService = inject(LanguagePreferenceService);

  readonly languageCode = this.languagePreferenceService.languageCode;
  readonly isLanguageConfirmed = this.languagePreferenceService.isLanguageConfirmed;
  readonly content = computed<LanguageShellPack>(() => this.getPack(this.languageCode()));

  initializeFromStorage(): LanguageCode {
    return this.languagePreferenceService.initializeFromStorage();
  }

  confirmLanguage(code: LanguageCode): void {
    this.languagePreferenceService.confirmLanguage(code);
  }

  getPack(code: LanguageCode): LanguageShellPack {
    return code === 'de' ? deShellLanguage : enShellLanguage;
  }
}
