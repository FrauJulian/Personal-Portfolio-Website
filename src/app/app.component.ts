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
import { ShellLanguageService } from './services/shell-language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly shellLanguageService = inject(ShellLanguageService);

  protected readonly content = this.shellLanguageService.content;
  protected readonly currentLanguageCode = this.shellLanguageService.languageCode;
  protected readonly isLanguageConfirmed = this.shellLanguageService.isLanguageConfirmed;
  protected readonly isLanguageSelectorOpen = signal(false);
  protected readonly selectedLanguage = signal<LanguageCode>('en');
  protected readonly languageOptions: readonly LanguageOption[] = [
    { code: 'en', accent: 'EN' },
    { code: 'de', accent: 'DE' },
  ];
  protected readonly dialogContent = computed(() =>
    this.shellLanguageService.getPack(this.selectedLanguage()),
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
    const initialLanguage = this.shellLanguageService.initializeFromStorage();
    this.selectedLanguage.set(initialLanguage);
  }

  protected chooseLanguage(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    this.confirmLanguage();
  }

  protected confirmLanguage(): void {
    this.shellLanguageService.confirmLanguage(this.selectedLanguage());
    this.isLanguageSelectorOpen.set(false);
  }

  protected reopenLanguageSelector(): void {
    this.selectedLanguage.set(this.currentLanguageCode());
    this.isLanguageSelectorOpen.set(true);
  }

  protected closeLanguageSelector(): void {
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
