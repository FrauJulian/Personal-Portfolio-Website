import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  protected readonly content = this.languageService.shellContent;
  protected readonly currentLanguageCode = this.languageService.languageCode;
  protected readonly isLanguageConfirmed = this.languageService.isLanguageConfirmed;
  protected readonly isLanguageSelectorOpen = signal(false);
  protected readonly selectedLanguage = signal<LanguageCode>('en');
  protected readonly languageOptions: readonly LanguageOption[] = [
    { code: 'en', accent: 'EN' },
    { code: 'de', accent: 'DE' },
  ];
  protected readonly dialogContent = computed(() =>
    this.languageService.getShellPack(this.selectedLanguage()),
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

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event: NavigationEnd): void => this.scrollToTopAfterRouteChange(event));
  }

  ngOnInit(): void {
    const initialLanguage = this.languageService.initializeFromStorage();
    this.selectedLanguage.set(initialLanguage);
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

  protected scrollToTopAfterOutletActivation(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.scrollDocumentToTop();
    this.document.defaultView?.requestAnimationFrame((): void => this.scrollDocumentToTop());
    this.document.defaultView?.setTimeout((): void => this.scrollDocumentToTop(), 0);
    this.document.defaultView?.setTimeout((): void => this.scrollDocumentToTop(), 100);
  }

  private scrollToTopAfterRouteChange(event: NavigationEnd): void {
    if (!isPlatformBrowser(this.platformId) || event.urlAfterRedirects.includes('#')) {
      return;
    }

    this.scrollToTopAfterOutletActivation();
  }

  private scrollDocumentToTop(): void {
    const scrollingElement = this.document.scrollingElement ?? this.document.documentElement;

    scrollingElement.scrollTop = 0;
    scrollingElement.scrollLeft = 0;
    this.document.documentElement.scrollTop = 0;
    this.document.documentElement.scrollLeft = 0;
    this.document.body.scrollTop = 0;
    this.document.body.scrollLeft = 0;
    this.document.defaultView?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
    this.document.documentElement.style.overflow = '';
  }
}
