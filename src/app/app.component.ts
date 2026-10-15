import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import type { LanguageCode } from '../languages/language.types';
import type { LanguageOption } from './app.types';
import { LanguagePreferenceService } from './services/language-preference.service';
import { ShellLanguageService } from './services/shell-language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly languagePreferenceService = inject(LanguagePreferenceService);
  private readonly shellLanguageService = inject(ShellLanguageService);
  private readonly languageDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('languageDialog');

  protected readonly content = this.shellLanguageService.content;
  protected readonly currentLanguageCode = this.languagePreferenceService.languageCode;
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

  private readonly syncDialog = afterRenderEffect((): void => {
    const dialog = this.languageDialog().nativeElement;
    if (this.isLanguageSelectorOpen() && !dialog.open) {
      dialog.showModal();
    } else if (!this.isLanguageSelectorOpen() && dialog.open) {
      dialog.close();
    }
  });

  ngOnInit(): void {
    this.selectedLanguage.set(this.languagePreferenceService.initialize());
  }

  protected chooseLanguage(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    this.languagePreferenceService.confirmLanguage(language);
    this.isLanguageSelectorOpen.set(false);
  }

  protected reopenLanguageSelector(): void {
    this.selectedLanguage.set(this.currentLanguageCode());
    this.isLanguageSelectorOpen.set(true);
  }

  /** Also runs when the dialog closes natively, e.g. via Escape. */
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
}
