import type { Mock } from 'vitest';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IMAGE_LOADER } from '@angular/common';
import type { ImageLoaderConfig } from '@angular/common';
import { NgZone } from '@angular/core';

import { HomeComponent } from './home.component';
import { global } from '../../global';
import { enLanguage } from '../../languages/en';
import type {
  LanguageBioTextEntry,
  LanguagePortraitHighlight,
} from '../../languages/language.types';

describe('HomeComponent', (): void => {
  beforeEach((): void => {
    // performance stays real so the change detection timing tests keep measuring.
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'requestAnimationFrame',
        'cancelAnimationFrame',
      ],
    });
    // jsdom does not implement matchMedia.
    vi.stubGlobal('matchMedia', (): MediaQueryList => ({ matches: false }) as MediaQueryList);
  });

  afterEach((): void => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  interface ComponentAccess {
    age: number;
    currentIndex: number;
    isLongBioShown: boolean;
    isLongBioMounted: boolean;
    isPortraitSwitching: boolean;
    currentPortraitHighlightIndex: number;
    bioHideTimeoutId: number | null;
    scrollAnimationFrameId: number | null;
    projectEntryAnimationFrameId: number | null;
    aboutSectionAnimationFrameId: number | null;
    scheduleNameGradientUpdate(): void;
    scheduleProjectEntryRevealUpdate(): void;
    scheduleAboutSectionScrollAnimationUpdate(): void;
    shouldEnableScrollEffects(): boolean;
    toggleBio(): void;
    showNextPortraitHighlight(): void;
    scrollToAboutSection(): void;
    scrollToProjectsSection(): void;
    scrollToContactLinks(): void;
    currentBioEntry: LanguageBioTextEntry;
    currentPortraitHighlight: LanguagePortraitHighlight | null;
  }

  let comp: ComponentAccess;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: IMAGE_LOADER,
          useValue: (config: ImageLoaderConfig): string => config.src,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    comp = component as unknown as ComponentAccess;
    fixture.detectChanges();
  });

  afterEach((): void => {
    // Explicitly destroy to stop the interval(1000) subscription started in ngOnInit.
    // Without this, the interval keeps firing after the test has finished.
    fixture.destroy();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  // ── Age ────────────────────────────────────────────────────────────────────

  describe('age', (): void => {
    it('should be a positive number', (): void => {
      expect(comp.age).toBeGreaterThan(0);
    });

    it('should match the expected age derived from the birthdate', (): void => {
      const birth = new Date(global.birthdate);
      const now = new Date();
      let expected = now.getFullYear() - birth.getFullYear();
      const hasPassed =
        now.getMonth() > birth.getMonth() ||
        (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
      if (!hasPassed) expected -= 1;
      expect(comp.age).toBe(expected);
    });
  });

  // ── Bio cycling ────────────────────────────────────────────────────────────

  describe('currentBioEntry getter', (): void => {
    it('should return the first bioTextsList entry at index 0', (): void => {
      comp.currentIndex = 0;
      expect(comp.currentBioEntry).toEqual(enLanguage.bioTextsList[0]);
    });

    it('should return the correct entry when index changes', (): void => {
      comp.currentIndex = 3;
      expect(comp.currentBioEntry).toEqual(enLanguage.bioTextsList[3]);
    });

    it('should return the fallback entry when index is out of range', (): void => {
      comp.currentIndex = 99999;
      expect(comp.currentBioEntry.label).toBeDefined();
      expect(comp.currentBioEntry.value).toBeDefined();
    });
  });

  describe('interval-driven bio cycling', (): void => {
    it('should start with currentIndex 0', (): void => {
      expect(comp.currentIndex).toBe(0);
    });

    it('should expose a valid bio entry for the current index', (): void => {
      expect(comp.currentBioEntry).toEqual(enLanguage.bioTextsList[0]);
    });

    it('should correctly wrap from the last entry back to 0 using modulo', (): void => {
      const last = enLanguage.bioTextsList.length - 1;
      comp.currentIndex = last;
      expect(comp.currentBioEntry).toEqual(enLanguage.bioTextsList[last]);
      comp.currentIndex = (last + 1) % enLanguage.bioTextsList.length;
      expect(comp.currentIndex).toBe(0);
      expect(comp.currentBioEntry).toEqual(enLanguage.bioTextsList[0]);
    });
  });

  // ── Portrait highlight ─────────────────────────────────────────────────────

  describe('currentPortraitHighlight getter', (): void => {
    it('should return the highlight at the current index', (): void => {
      comp.currentPortraitHighlightIndex = 0;
      expect(comp.currentPortraitHighlight).toEqual(enLanguage.portraitHighlights[0]);
    });

    it('should return null when index is out of range', (): void => {
      comp.currentPortraitHighlightIndex = 99999;
      expect(comp.currentPortraitHighlight).toBeNull();
    });
  });

  describe('showNextPortraitHighlight', (): void => {
    // Timer tests run outside Angular zone to prevent NgOptimizedImage from
    // throwing NG02953 when height/width inputs change during re-render.

    it('should set isPortraitSwitching to true immediately', (): void => {
      comp.isPortraitSwitching = false;
      comp.showNextPortraitHighlight();
      expect(comp.isPortraitSwitching).toBe(true);
    });

    it('should not advance index when already switching', (): void => {
      comp.isPortraitSwitching = true;
      comp.showNextPortraitHighlight();
      expect(comp.currentPortraitHighlightIndex).toBe(0);
    });

    it('should not call setTimeout when only one portrait exists', (): void => {
      const highlights = (
        comp as unknown as {
          portraitHighlights: LanguagePortraitHighlight[];
        }
      ).portraitHighlights;
      const saved = [...highlights]; // snapshot before mutation
      highlights.splice(1, saved.length - 1); // reduce to a single entry

      const setSpy = vi.spyOn(window, 'setTimeout');
      comp.showNextPortraitHighlight();
      expect(setSpy).not.toHaveBeenCalled();

      highlights.splice(0, highlights.length, ...saved); // restore from snapshot
    });

    it('should advance the portrait index after 125 ms', async (): Promise<void> => {
      const zone = TestBed.inject(NgZone);
      zone.runOutsideAngular((): void => {
        comp.showNextPortraitHighlight();
      });
      await vi.advanceTimersByTimeAsync(125);
      expect(comp.currentPortraitHighlightIndex).toBe(1);
      await vi.advanceTimersByTimeAsync(125);
    });

    it('should reset isPortraitSwitching to false after 250 ms', async (): Promise<void> => {
      const zone = TestBed.inject(NgZone);
      zone.runOutsideAngular((): void => {
        comp.showNextPortraitHighlight();
      });
      await vi.advanceTimersByTimeAsync(250);
      expect(comp.isPortraitSwitching).toBe(false);
    });

    it('should wrap portrait index from the last position back to 0', async (): Promise<void> => {
      comp.currentPortraitHighlightIndex = enLanguage.portraitHighlights.length - 1;
      const zone = TestBed.inject(NgZone);
      zone.runOutsideAngular((): void => {
        comp.showNextPortraitHighlight();
      });
      await vi.advanceTimersByTimeAsync(125);
      expect(comp.currentPortraitHighlightIndex).toBe(0);
      await vi.advanceTimersByTimeAsync(125);
    });
  });

  // ── Bio toggle ─────────────────────────────────────────────────────────────

  describe('toggleBio', (): void => {
    it('should mount bio immediately on opening', async (): Promise<void> => {
      comp.toggleBio();
      expect(comp.isLongBioMounted).toBe(true);
      await vi.advanceTimersByTimeAsync(100);
    });

    it('should set isLongBioShown to true after the double-rAF delay', async (): Promise<void> => {
      comp.toggleBio();
      await vi.advanceTimersByTimeAsync(50); // allow both nested requestAnimationFrame calls to execute
      fixture.detectChanges();
      expect(comp.isLongBioShown).toBe(true);
    });

    it('should set isLongBioShown to false immediately on close', async (): Promise<void> => {
      // Open first
      comp.toggleBio();
      await vi.advanceTimersByTimeAsync(50);
      fixture.detectChanges();

      // Close
      comp.toggleBio();
      fixture.detectChanges();
      expect(comp.isLongBioShown).toBe(false);
      await vi.advanceTimersByTimeAsync(300);
    });

    it('should keep isLongBioMounted true during the 300 ms close animation', async (): Promise<void> => {
      comp.toggleBio();
      await vi.advanceTimersByTimeAsync(50);
      fixture.detectChanges();

      comp.toggleBio();
      fixture.detectChanges();
      expect(comp.isLongBioMounted).toBe(true);

      await vi.advanceTimersByTimeAsync(299);
      expect(comp.isLongBioMounted).toBe(true);

      await vi.advanceTimersByTimeAsync(1);
      fixture.detectChanges();
      expect(comp.isLongBioMounted).toBe(false);
    });

    it('should cancel pending close timeout when re-opened during animation', async (): Promise<void> => {
      comp.toggleBio();
      await vi.advanceTimersByTimeAsync(50);
      fixture.detectChanges();

      comp.toggleBio(); // start closing
      await vi.advanceTimersByTimeAsync(150); // halfway through 300 ms

      comp.toggleBio(); // re-open before unmount
      await vi.advanceTimersByTimeAsync(50);
      fixture.detectChanges();

      expect(comp.isLongBioMounted).toBe(true);
      expect(comp.isLongBioShown).toBe(true);

      await vi.advanceTimersByTimeAsync(500);
    });
  });

  // ── Scroll helpers ─────────────────────────────────────────────────────────

  describe('scroll helpers', (): void => {
    let scrollSpy: Mock;

    beforeEach((): void => {
      scrollSpy = vi.spyOn(window, 'scrollTo').mockReturnValue(undefined);
    });

    it('should call window.scrollTo when scrolling to the about section', (): void => {
      const el = document.createElement('section');
      el.id = 'about';
      document.body.appendChild(el);
      comp.scrollToAboutSection();
      expect(scrollSpy).toHaveBeenCalled();
      document.body.removeChild(el);
    });

    it('should call window.scrollTo when scrolling to the projects section', (): void => {
      const el = document.createElement('section');
      el.id = 'projects';
      document.body.appendChild(el);
      comp.scrollToProjectsSection();
      expect(scrollSpy).toHaveBeenCalled();
      document.body.removeChild(el);
    });

    it('should call window.scrollTo when scrolling to contact links', (): void => {
      const el = document.createElement('div');
      el.id = 'contact-links';
      document.body.appendChild(el);
      comp.scrollToContactLinks();
      expect(scrollSpy).toHaveBeenCalled();
      document.body.removeChild(el);
    });

    it('should not throw when the target element does not exist', (): void => {
      expect((): void => comp.scrollToAboutSection()).not.toThrow();
    });

    it('"About me" button click should trigger a scrollTo call', (): void => {
      const aboutEl = document.createElement('section');
      aboutEl.id = 'about';
      document.body.appendChild(aboutEl);

      const el = fixture.nativeElement as HTMLElement;
      const btn = Array.from(el.querySelectorAll('button')).find(
        (b): boolean => (b.textContent ?? '').trim() === 'About me',
      );
      btn?.click();
      expect(scrollSpy).toHaveBeenCalled();
      document.body.removeChild(aboutEl);
    });

    it('"View projects" button click should trigger a scrollTo call', (): void => {
      const projectsEl = document.createElement('section');
      projectsEl.id = 'projects';
      document.body.appendChild(projectsEl);

      const el = fixture.nativeElement as HTMLElement;
      const btn = Array.from(el.querySelectorAll('button')).find(
        (b): boolean => (b.textContent ?? '').trim() === 'View projects',
      );
      btn?.click();
      expect(scrollSpy).toHaveBeenCalled();
      document.body.removeChild(projectsEl);
    });
  });

  // ── Lifecycle cleanup ──────────────────────────────────────────────────────

  describe('ngOnDestroy', (): void => {
    it('should clear pending portrait switch timers on destroy', async (): Promise<void> => {
      comp.showNextPortraitHighlight();
      const clearSpy = vi.spyOn(window, 'clearTimeout');

      fixture.destroy();

      expect(clearSpy).toHaveBeenCalled();
    });

    it('should not throw when destroyed', async (): Promise<void> => {
      expect((): void => fixture.destroy()).not.toThrow();
    });
  });

  // ── Template rendering ─────────────────────────────────────────────────────

  describe('Template', (): void => {
    it('should render the hero section', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.hero-section')).not.toBeNull();
    });

    it('should render the author firstname in the h1', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const h1 = el.querySelector('h1');
      expect(h1?.textContent).toContain(global.firstname);
    });

    it('should render the author lastname in the h1', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const h1 = el.querySelector('h1');
      expect(h1?.textContent).toContain(global.lastname);
    });

    it('should render the bio label from the current bioTextsList entry', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.meta-label')).not.toBeNull();
    });

    it('should render a portrait image when a highlight is active', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.portrait-highlight')).not.toBeNull();
    });

    it('should render the about section', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('#about')).not.toBeNull();
    });

    it('should render the projects section', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('#projects')).not.toBeNull();
    });

    it('should render one project entry per localized project entry', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const entries = el.querySelectorAll('.project-entry');
      expect(entries.length).toBe(enLanguage.projects.length);
    });

    it('should render all project titles', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      enLanguage.projects.forEach((project): void => {
        expect(el.textContent).toContain(project.title);
      });
    });

    it('should render contact link anchors in the hero section', (): void => {
      const el = fixture.nativeElement as HTMLElement;
      const contactArea = el.querySelector('#contact-links');
      const links = contactArea?.querySelectorAll('a');
      expect(links?.length).toBeGreaterThan(0);
    });
  });

  // ── RAF debouncing (performance) ───────────────────────────────────────────

  describe('Performance', (): void => {
    it('should keep scroll effects enabled on desktop pointers when motion is allowed', (): void => {
      vi.spyOn(window, 'matchMedia').mockImplementation(
        (query: string): MediaQueryList =>
          ({
            matches:
              query !== '(prefers-reduced-motion: reduce)' &&
              query !== '(hover: none) and (pointer: coarse)',
          }) as MediaQueryList,
      );

      expect(comp.shouldEnableScrollEffects()).toBe(true);
    });

    it('should keep scroll effects enabled on coarse touch pointers when motion is allowed', (): void => {
      vi.spyOn(window, 'matchMedia').mockImplementation(
        (query: string): MediaQueryList =>
          ({
            matches: query === '(hover: none) and (pointer: coarse)',
          }) as MediaQueryList,
      );

      expect(comp.shouldEnableScrollEffects()).toBe(true);
    });

    it('should disable scroll effects when reduced motion is requested', (): void => {
      vi.spyOn(window, 'matchMedia').mockImplementation(
        (query: string): MediaQueryList =>
          ({
            matches: query === '(prefers-reduced-motion: reduce)',
          }) as MediaQueryList,
      );

      expect(comp.shouldEnableScrollEffects()).toBe(false);
    });

    it('should create and run initial change detection within 200 ms', (): void => {
      const start = performance.now();
      const f = TestBed.createComponent(HomeComponent);
      f.detectChanges();
      expect(performance.now() - start).toBeLessThan(200);
      f.destroy();
    });

    it('should run 10 consecutive change detection cycles within 100 ms', (): void => {
      const start = performance.now();
      for (let i = 0; i < 10; i++) {
        fixture.detectChanges();
      }
      expect(performance.now() - start).toBeLessThan(100);
    });

    it('should deduplicate rapid schedule calls to a single requestAnimationFrame', async (): Promise<void> => {
      // The RAF registered during beforeEach's ngOnInit is still pending under fake timers.
      // Resetting the ID to null makes the schedule function treat the slot as free.
      comp.scrollAnimationFrameId = null;

      let rafCallCount = 0;
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((): number => {
        rafCallCount++;
        return rafCallCount; // returns non-null so subsequent calls deduplicate
      });

      comp.scheduleNameGradientUpdate();
      comp.scheduleNameGradientUpdate();
      comp.scheduleNameGradientUpdate();

      expect(rafCallCount).toBe(1);
    });

    it('should deduplicate project-entry reveal scheduling the same way', async (): Promise<void> => {
      comp.projectEntryAnimationFrameId = null;

      let rafCallCount = 0;
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((): number => {
        rafCallCount++;
        return rafCallCount;
      });

      comp.scheduleProjectEntryRevealUpdate();
      comp.scheduleProjectEntryRevealUpdate();
      comp.scheduleProjectEntryRevealUpdate();

      expect(rafCallCount).toBe(1);
    });

    it('should deduplicate about-section scroll scheduling the same way', async (): Promise<void> => {
      comp.aboutSectionAnimationFrameId = null;

      let rafCallCount = 0;
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((): number => {
        rafCallCount++;
        return rafCallCount;
      });

      comp.scheduleAboutSectionScrollAnimationUpdate();
      comp.scheduleAboutSectionScrollAnimationUpdate();
      comp.scheduleAboutSectionScrollAnimationUpdate();

      expect(rafCallCount).toBe(1);
    });
  });
});
