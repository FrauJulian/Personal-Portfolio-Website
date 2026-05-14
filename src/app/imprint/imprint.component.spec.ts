import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ImprintComponent } from './imprint.component';
import { global } from '../../global';

describe('ImprintComponent', (): void => {
  let fixture: ComponentFixture<ImprintComponent>;
  let component: ImprintComponent;

  interface BindAccess {
    bind(value: string): string;
  }

  const bind = (value: string): string => (component as unknown as BindAccess).bind(value);

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [ImprintComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ImprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  describe('mail links', (): void => {
    it('should render the contact email as a mailto link', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const link = el.querySelector(`a[href="mailto:${global.contactMail}"]`);

      expect(link).not.toBeNull();
      expect(link?.textContent).toContain(global.contactMail);
    });

    it('should render the abuse email as a mailto link', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const link = el.querySelector(`a[href="mailto:${global.abuseMail}"]`);

      expect(link).not.toBeNull();
      expect(link?.textContent).toContain(global.abuseMail);
    });
  });

  describe('bind', (): void => {
    it('should return a string', (): void => {
      expect(typeof bind('test')).toBe('string');
    });

    it('should leave plain ASCII text unchanged', (): void => {
      expect(bind('Hello World')).toBe('Hello World');
    });

    it('should replace the firstname placeholder', (): void => {
      expect(bind('{{firstname}}')).toBe(global.firstname);
    });

    it('should replace the lastname placeholder', (): void => {
      expect(bind('{{lastname}}')).toBe(global.lastname);
    });

    it('should replace the contact mail placeholder', (): void => {
      expect(bind('{{contactMail}}')).toBe(global.contactMail);
    });

    it('should replace the contact phone placeholder', (): void => {
      expect(bind('{{contactPhone}}')).toBe(global.contactPhone);
    });

    it('should replace multiple placeholders in one value', (): void => {
      expect(bind('{{firstname}} {{lastname}}')).toBe(`${global.firstname} ${global.lastname}`);
    });

    it('should handle an empty string', (): void => {
      expect(bind('')).toBe('');
    });
  });

  describe('Address display', (): void => {
    it('should render the street and house number', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(`${global.address.street} ${global.address.houseNumber}`);
    });

    it('should render the zip and city', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(`${global.address.zip} ${global.address.city}`);
    });

    it('should not leave unresolved placeholders in the rendered page', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).not.toContain('{{');
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

    it('should complete 500 bind calls within 20 ms', (): void => {
      const input = '{{firstname}} {{lastname}} {{contactMail}} {{contactPhone}}';
      const start = performance.now();
      for (let i = 0; i < 500; i++) {
        bind(input);
      }
      expect(performance.now() - start).toBeLessThan(20);
    });
  });
});
