import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', (): void => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async (): Promise<void> => {
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

  it('should have title "Lechner Julian"', (): void => {
    expect(component.title).toBe('Lechner Julian');
  });

  it('should render a router-outlet element', (): void => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).not.toBeNull();
  });

  it('should not render any additional root elements besides router-outlet', (): void => {
    const el = fixture.nativeElement as HTMLElement;
    const children = Array.from(el.children);
    expect(children.length).toBe(1);
    expect(children[0].tagName.toLowerCase()).toBe('router-outlet');
  });

  describe('Performance', (): void => {
    it('should create and run initial change detection within 100 ms', (): void => {
      const start = performance.now();
      const f = TestBed.createComponent(AppComponent);
      f.detectChanges();
      expect(performance.now() - start).toBeLessThan(100);
    });
  });
});
