import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';

import { LanguagePreferenceService } from './language-preference.service';
import { SeoService } from './seo.service';

@Component({ template: '' })
class EmptyComponent {}

describe('SeoService', (): void => {
  const getHref = (selector: string): string | null =>
    document.head.querySelector(selector)?.getAttribute('href') ?? null;

  beforeEach(async (): Promise<void> => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: EmptyComponent },
          { path: 'imprint', component: EmptyComponent },
        ]),
      ],
    });
    TestBed.inject(SeoService);
    await TestBed.inject(Router).navigateByUrl('/');
    TestBed.tick();
  });

  it('should describe the English start page by default', (): void => {
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toContain('Julian Lechner');
    expect(getHref('link[rel="canonical"]')).toBe('https://fraujulian.xyz/');
    expect(getHref('link[hreflang="de"]')).toBe('https://fraujulian.xyz/?lang=de');
    expect(getHref('link[hreflang="x-default"]')).toBe('https://fraujulian.xyz/');
  });

  it('should switch language, title and canonical URL together', async (): Promise<void> => {
    TestBed.inject(LanguagePreferenceService).confirmLanguage('de');
    await TestBed.inject(Router).navigateByUrl('/imprint');
    TestBed.tick();

    expect(document.documentElement.lang).toBe('de');
    expect(document.title).toContain('Impressum');
    expect(getHref('link[rel="canonical"]')).toBe('https://fraujulian.xyz/imprint?lang=de');
    expect(document.head.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe(
      'de_AT',
    );
  });

  describe('home title', (): void => {
    beforeEach(async (): Promise<void> => {
      TestBed.resetTestingModule();
      vi.useFakeTimers();
      TestBed.configureTestingModule({
        providers: [provideRouter([{ path: '', component: EmptyComponent }])],
      });
      TestBed.inject(SeoService);
      await TestBed.inject(Router).navigateByUrl('/');
      TestBed.tick();
    });

    afterEach((): void => {
      vi.useRealTimers();
    });

    it('should alternate between name and role every 3.5 seconds', (): void => {
      expect(document.title).toBe('Julian Lechner');

      vi.advanceTimersByTime(3500);
      TestBed.tick();
      expect(document.title).toBe('Full Stack Developer');

      vi.advanceTimersByTime(3500);
      TestBed.tick();
      expect(document.title).toBe('Julian Lechner');
    });
  });
});
