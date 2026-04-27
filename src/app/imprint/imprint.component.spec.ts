import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { SafeUrl } from '@angular/platform-browser';

import { ImprintComponent } from './imprint.component';
import { global } from '../../global';

describe('ImprintComponent', (): void => {
  let fixture: ComponentFixture<ImprintComponent>;
  let component: ImprintComponent;

  interface ComponentAccess {
    contactSafeMail: SafeUrl;
    abuseSafeMail: SafeUrl;
    displayStreet: string;
    displayCity: string;
    normalizeText(value: string): string;
  }

  let comp: ComponentAccess;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [ImprintComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ImprintComponent);
    component = fixture.componentInstance;
    comp = component as unknown as ComponentAccess;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  describe('SafeUrl initialization (ngOnInit)', (): void => {
    it('should initialize contactSafeMail', (): void => {
      expect(comp.contactSafeMail).toBeDefined();
    });

    it('should initialize abuseSafeMail', (): void => {
      expect(comp.abuseSafeMail).toBeDefined();
    });

    it('should embed the contact email in contactSafeMail', (): void => {
      expect(String(comp.contactSafeMail)).toContain(global.contactMail);
    });

    it('should embed the abuse email in abuseSafeMail', (): void => {
      expect(String(comp.abuseSafeMail)).toContain(global.abuseMail);
    });

    it('should use a mailto: scheme for contactSafeMail', (): void => {
      expect(String(comp.contactSafeMail)).toContain('mailto:');
    });

    it('should use a mailto: scheme for abuseSafeMail', (): void => {
      expect(String(comp.abuseSafeMail)).toContain('mailto:');
    });
  });

  describe('normalizeText', (): void => {
    it('should return a string', (): void => {
      expect(typeof comp.normalizeText('test')).toBe('string');
    });

    it('should leave plain ASCII text unchanged', (): void => {
      expect(comp.normalizeText('Hello World')).toBe('Hello World');
    });

    it('should replace the ß HTML entity', (): void => {
      const result = comp.normalizeText('Stra\u00DFe');
      expect(result).toContain('\u00DF');
    });

    it('should replace the ö HTML entity', (): void => {
      const result = comp.normalizeText('P\u00F6chlarn');
      expect(result).toContain('\u00F6');
    });

    it('should replace the ä HTML entity', (): void => {
      const result = comp.normalizeText('st\u00E4dtisch');
      expect(result).toContain('\u00E4');
    });

    it('should replace the ü HTML entity', (): void => {
      const result = comp.normalizeText('M\u00FCnchen');
      expect(result).toContain('\u00FC');
    });

    it('should replace the Ä HTML entity', (): void => {
      const result = comp.normalizeText('\u00C4gypten');
      expect(result).toContain('\u00C4');
    });

    it('should replace the Ü HTML entity', (): void => {
      const result = comp.normalizeText('\u00DCbung');
      expect(result).toContain('\u00DC');
    });

    it('should handle an empty string', (): void => {
      expect(comp.normalizeText('')).toBe('');
    });
  });

  describe('Address display properties', (): void => {
    it('should produce a displayStreet that is a non-empty string', (): void => {
      expect(comp.displayStreet.length).toBeGreaterThan(0);
    });

    it('should produce a displayCity that is a non-empty string', (): void => {
      expect(comp.displayCity.length).toBeGreaterThan(0);
    });

    it('should not leave unresolved HTML entities in displayStreet', (): void => {
      expect(comp.displayStreet).not.toMatch(/&[a-z]+;/);
    });

    it('should not leave unresolved HTML entities in displayCity', (): void => {
      expect(comp.displayCity).not.toMatch(/&[a-z]+;/);
    });
  });

  describe('Template', (): void => {
    it('should render the author firstname', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(global.firstname);
    });

    it('should render the author lastname', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(global.lastname);
    });

    it('should render the country in the address block', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(global.address.country);
    });

    it('should render the contact email as visible text', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(global.contactMail);
    });

    it('should render the abuse email as visible text', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(global.abuseMail);
    });

    it('should render the phone number', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(global.contactPhone);
    });

    it('should render an "Imprint & Privacy" heading', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const headings = Array.from(el.querySelectorAll('h1'));
      expect(headings.some((h): boolean => h.textContent?.includes('Imprint') === true)).toBeTrue();
    });

    it('should contain a back link to the portfolio root', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const backLink = el.querySelector('a.back-link');
      expect(backLink).not.toBeNull();
    });
  });

  describe('Performance', (): void => {
    it('should create, initialize and run change detection within 100 ms', (): void => {
      const start = performance.now();
      const f = TestBed.createComponent(ImprintComponent);
      f.detectChanges();
      expect(performance.now() - start).toBeLessThan(100);
    });

    it('should complete 500 normalizeText calls within 20 ms', (): void => {
      const input = 'Ulmenstra\u00DFe \u00F6sterreich \u00E4hnlich \u00FCberall \u00C4gypten \u00DCbung';
      const start = performance.now();
      for (let i = 0; i < 500; i++) {
        comp.normalizeText(input);
      }
      expect(performance.now() - start).toBeLessThan(20);
    });
  });
});
