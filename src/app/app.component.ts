import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import type { LanguageCode } from '../languages/language.types';
import type { LanguageOption } from './app.types';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly languageService = inject(LanguageService);

  protected readonly content = this.languageService.content;
  protected readonly currentLanguageCode = this.languageService.languageCode;
  protected readonly isLanguageConfirmed = this.languageService.isLanguageConfirmed;
  protected readonly isLanguageSelectorOpen = signal(true);
  protected readonly selectedLanguage = signal<LanguageCode>('en');
  protected readonly languageOptions: readonly LanguageOption[] = [
    { code: 'en', accent: 'EN' },
    { code: 'de', accent: 'DE' },
  ];
  protected readonly dialogContent = computed(() =>
    this.languageService.getPack(this.selectedLanguage()),
  );
  protected readonly languageSwitcherLabel = computed(() =>
    this.getLanguageLabel(this.currentLanguageCode(), this.content()),
  );

  constructor() {
    effect((): void => {
      const overflowValue = this.isLanguageSelectorOpen() ? 'hidden' : '';
      this.document.body.style.overflow = overflowValue;
      this.document.documentElement.style.overflow = overflowValue;
    });
  }

  ngOnInit(): void {
    const initialLanguage = this.languageService.initializeFromStorage();
    this.selectedLanguage.set(initialLanguage);
    this.isLanguageSelectorOpen.set(!this.isLanguageConfirmed());
  }

  protected chooseLanguage(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    this.confirmLanguage();
  }

  protected confirmLanguage(): void {
    this.languageService.confirmLanguage(this.selectedLanguage());
    this.isLanguageSelectorOpen.set(false);
  }

  protected reopenLanguageSelector(): void {
    this.selectedLanguage.set(this.currentLanguageCode());
    this.isLanguageSelectorOpen.set(true);
  }

  protected closeLanguageSelector(): void {
    if (!this.isLanguageConfirmed()) {
      return;
    }

    this.selectedLanguage.set(this.currentLanguageCode());
    this.isLanguageSelectorOpen.set(false);
  }

  protected closeLanguageSelectorOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeLanguageSelector();
    }
  }

  protected getLanguageLabel(language: LanguageCode, content = this.dialogContent()): string {
    return language === 'de' ? content.app.languageGerman : content.app.languageEnglish;
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
    this.document.documentElement.style.overflow = '';
  }
}
