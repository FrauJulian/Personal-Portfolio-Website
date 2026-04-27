import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';
import { global } from '../../global';

describe('FooterComponent', (): void => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;

  interface ComponentAccess {
    currentYear: number;
    global: typeof global;
  }

  let comp: ComponentAccess;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    comp = component as unknown as ComponentAccess;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  describe('currentYear', (): void => {
    it('should equal the current calendar year', (): void => {
      expect(comp.currentYear).toBe(new Date().getFullYear());
    });

    it('should be a four-digit number', (): void => {
      expect(comp.currentYear).toBeGreaterThanOrEqual(2024);
      expect(comp.currentYear).toBeLessThan(2100);
    });
  });

  describe('global data', (): void => {
    it('should reference the shared global object', (): void => {
      expect(comp.global).toBe(global);
    });

    it('should expose a non-empty firstname', (): void => {
      expect(comp.global.firstname.length).toBeGreaterThan(0);
    });

    it('should expose a non-empty lastname', (): void => {
      expect(comp.global.lastname.length).toBeGreaterThan(0);
    });
  });

  describe('Template', (): void => {
    it('should render the current year in the copyright line', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(String(new Date().getFullYear()));
    });

    it('should render the author firstname', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(global.firstname);
    });

    it('should render the author lastname', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain(global.lastname);
    });

    it('should render an imprint link with text "Imprint"', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const links = Array.from(el.querySelectorAll('a'));
      const imprintLink = links.find((a): boolean => a.textContent?.trim() === 'Imprint');
      expect(imprintLink).toBeTruthy();
    });

    it('should contain a footer element', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('footer')).not.toBeNull();
    });
  });

  describe('Performance', (): void => {
    it('should create and detect changes within 50 ms', (): void => {
      const start = performance.now();
      const f = TestBed.createComponent(FooterComponent);
      f.detectChanges();
      expect(performance.now() - start).toBeLessThan(50);
    });

    it('should run 20 consecutive change detection cycles within 100 ms', (): void => {
      const start = performance.now();
      for (let i = 0; i < 20; i++) {
        fixture.detectChanges();
      }
      expect(performance.now() - start).toBeLessThan(100);
    });
  });
});
