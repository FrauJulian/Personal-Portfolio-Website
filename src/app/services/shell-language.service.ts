import { Injectable, computed, inject } from '@angular/core';

import { deShellLanguage, enShellLanguage } from '../../languages/shell';
import type { LanguageCode, LanguageShellPack } from '../../languages/language.types';
import { LanguagePreferenceService } from './language-preference.service';

@Injectable({ providedIn: 'root' })
export class ShellLanguageService {
  private readonly languageCode = inject(LanguagePreferenceService).languageCode;

  readonly content = computed<LanguageShellPack>(() => this.getPack(this.languageCode()));

  getPack(code: LanguageCode): LanguageShellPack {
    return code === 'de' ? deShellLanguage : enShellLanguage;
  }
}
