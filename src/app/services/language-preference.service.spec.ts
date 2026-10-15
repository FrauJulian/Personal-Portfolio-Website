import { TestBed } from '@angular/core/testing';

import { LanguagePreferenceService } from './language-preference.service';

describe('LanguagePreferenceService', (): void => {
  let service: LanguagePreferenceService;

  beforeEach((): void => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
    service = TestBed.inject(LanguagePreferenceService);
  });

  afterEach((): void => {
    vi.restoreAllMocks();
    window.history.replaceState(null, '', '/');
  });

  it('should fall back to English for unsupported browser languages', (): void => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR');
    expect(service.initialize()).toBe('en');
  });

  it('should use the browser language on the first visit', (): void => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-AT');
    expect(service.initialize()).toBe('de');
  });

  it('should prefer a stored choice over the browser language', (): void => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-AT');
    localStorage.setItem('portfolio-language', 'en');
    expect(service.initialize()).toBe('en');
  });

  it('should prefer the lang query parameter over everything else', (): void => {
    localStorage.setItem('portfolio-language', 'en');
    window.history.replaceState(null, '', '/?lang=de');
    expect(service.initialize()).toBe('de');
  });

  it('should ignore an unsupported lang query parameter', (): void => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    window.history.replaceState(null, '', '/?lang=fr');
    expect(service.initialize()).toBe('en');
  });

  it('should persist a confirmed language', (): void => {
    service.confirmLanguage('de');
    expect(service.languageCode()).toBe('de');
    expect(localStorage.getItem('portfolio-language')).toBe('de');
  });
});
