import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter, interval, map } from 'rxjs';

import { global } from '../../global';
import type { LanguageCode } from '../../languages/language.types';
import { LanguagePreferenceService } from './language-preference.service';
import { ShellLanguageService } from './shell-language.service';

const languageCodes: readonly LanguageCode[] = ['en', 'de'];
const ogLocales: Readonly<Record<LanguageCode, string>> = { en: 'en_US', de: 'de_AT' };
const homeTitles: readonly string[] = ['Julian Lechner', 'Full Stack Developer'];
const homeTitleSwitchMs = 3500;

/** Keeps `<html lang>`, title, description, canonical, hreflang and Open Graph tags in sync. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly languageCode = inject(LanguagePreferenceService).languageCode;
  private readonly content = inject(ShellLanguageService).content;
  private readonly path = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd): string => event.urlAfterRedirects.split(/[?#]/u)[0] ?? '/'),
    ),
    { initialValue: '/' },
  );
  private readonly titleTick = toSignal(interval(homeTitleSwitchMs), { initialValue: -1 });

  private readonly syncHead = effect((): void => {
    this.update(this.languageCode(), this.path());
  });

  /** The start page title alternates in the browser tab; other pages keep a fixed title. */
  private readonly syncTitle = effect((): void => {
    const homeTitle = homeTitles[(this.titleTick() + 1) % homeTitles.length] ?? global.firstname;
    this.title.setTitle(this.path() === '/imprint' ? this.content().meta.imprintTitle : homeTitle);
  });

  private update(language: LanguageCode, path: string): void {
    const { meta } = this.content();
    const pageTitle = path === '/imprint' ? meta.imprintTitle : meta.homeTitle;
    const pageUrl = this.getPageUrl(path, language);

    this.document.documentElement.lang = language;
    this.meta.updateTag({ name: 'description', content: meta.description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: meta.description });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:locale', content: ogLocales[language] });
    this.setLink('link[rel="canonical"]', { rel: 'canonical', href: pageUrl });

    for (const code of languageCodes) {
      this.setLink(`link[rel="alternate"][hreflang="${code}"]`, {
        rel: 'alternate',
        hreflang: code,
        href: this.getPageUrl(path, code),
      });
    }
    this.setLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: this.getPageUrl(path, 'en'),
    });
  }

  /** English is the default and lives on the plain URL; other languages use `?lang=`. */
  private getPageUrl(path: string, language: LanguageCode): string {
    const pageUrl = `${global.siteUrl}${path}`;
    return language === 'en' ? pageUrl : `${pageUrl}?lang=${language}`;
  }

  private setLink(selector: string, attributes: Readonly<Record<string, string>>): void {
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (link === null) {
      link = this.document.createElement('link');
      this.document.head.appendChild(link);
    }
    for (const [name, value] of Object.entries(attributes)) {
      link.setAttribute(name, value);
    }
  }
}
