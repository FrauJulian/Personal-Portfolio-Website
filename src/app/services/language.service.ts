import { Injectable, computed, inject } from '@angular/core';

import { deLanguage } from '../../languages/de';
import { enLanguage } from '../../languages/en';
import type { LanguagePack } from '../../languages/language.types';
import { LanguagePreferenceService } from './language-preference.service';

/** Page content for the lazy-loaded routes; kept apart from the shell texts to stay out of the initial bundle. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly languageCode = inject(LanguagePreferenceService).languageCode;

  readonly content = computed<LanguagePack>(() =>
    this.languageCode() === 'de' ? deLanguage : enLanguage,
  );
}
