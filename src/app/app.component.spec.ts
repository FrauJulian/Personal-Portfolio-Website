import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', (): void => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async (): Promise<void> => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should render the language selector on first visit', (): void => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.language-overlay')).not.toBeNull();
  });

  it('should preselect English by default', (): void => {
    const comp = component as unknown as { selectedLanguage(): string };
    expect(comp.selectedLanguage()).toBe('en');
  });

  it('should always render a router-outlet element', (): void => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).not.toBeNull();
  });

  it('should confirm and persist the selected language', (): void => {
    const comp = component as unknown as {
      chooseLanguage(language: 'en' | 'de'): void;
      currentLanguageCode(): string;
      isLanguageConfirmed(): boolean;
      isLanguageSelectorOpen(): boolean;
    };

    comp.chooseLanguage('de');
    fixture.detectChanges();

    expect(comp.currentLanguageCode()).toBe('de');
    expect(comp.isLanguageConfirmed()).toBeTrue();
    expect(comp.isLanguageSelectorOpen()).toBeFalse();
    expect(localStorage.getItem('portfolio-language')).toBe('de');
  });

  it('should restore a saved language from localStorage', async (): Promise<void> => {
    localStorage.setItem('portfolio-language', 'de');

    const restoredFixture = TestBed.createComponent(AppComponent);
    restoredFixture.detectChanges();
    const restoredComponent = restoredFixture.componentInstance as unknown as {
      currentLanguageCode(): string;
      isLanguageConfirmed(): boolean;
      isLanguageSelectorOpen(): boolean;
    };

    expect(restoredComponent.currentLanguageCode()).toBe('de');
    expect(restoredComponent.isLanguageConfirmed()).toBeTrue();
    expect(restoredComponent.isLanguageSelectorOpen()).toBeFalse();
  });

  it('should reopen the selector after confirmation', (): void => {
    const comp = component as unknown as {
      chooseLanguage(language: 'en' | 'de'): void;
      reopenLanguageSelector(): void;
      isLanguageSelectorOpen(): boolean;
    };

    comp.chooseLanguage('en');
    comp.reopenLanguageSelector();
    fixture.detectChanges();

    expect(comp.isLanguageSelectorOpen()).toBeTrue();
  });
});
