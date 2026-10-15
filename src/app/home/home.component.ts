import type { OnDestroy } from '@angular/core';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { filter, interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { global } from '../../global';
import { FooterComponent } from '../footer/footer.component';
import { LanguageService } from '../services/language.service';
import { IconComponent } from '../shared/icon/icon.component';
import {
  arrowDownIcon,
  arrowRightIcon,
  envelopeIcon,
  giteaIcon,
  linkedinIcon,
  phoneIcon,
  signalIcon,
} from '../shared/icon/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, IconComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnDestroy {
  private static readonly bioTickerIntervalMs = 1250;

  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  protected readonly content = this.languageService.content;

  private scrollEffectsAnimationFrameId: number | null = null;
  private readonly scheduleScrollEffectsUpdate: () => void = (): void => {
    if (this.scrollEffectsAnimationFrameId !== null) return;
    this.scrollEffectsAnimationFrameId = window.requestAnimationFrame((): void => {
      this.scrollEffectsAnimationFrameId = null;
      this.updateNameGradientProgress();
      this.updateAboutSectionScrollProgress();
      this.updateProjectEntryRevealProgress();
    });
  };

  protected readonly global = global;
  protected readonly age = this.calculateAge(global.birthdate);
  protected readonly contactMailHref = `mailto:${global.contactMail}`;
  protected readonly arrowRightIcon = arrowRightIcon;
  protected readonly arrowDownIcon = arrowDownIcon;
  protected readonly envelopeIcon = envelopeIcon;
  protected readonly phoneIcon = phoneIcon;
  protected readonly signalIcon = signalIcon;
  protected readonly giteaIcon = giteaIcon;
  protected readonly linkedinIcon = linkedinIcon;

  protected readonly isLongBioShown = signal(false);
  protected readonly isLongBioMounted = signal(false);
  protected readonly currentPortraitHighlightIndex = signal(0);
  protected readonly isPortraitSwitching = signal(false);
  protected readonly currentIndex = signal(0);
  protected readonly isBioTickerPaused = signal(false);
  private bioHideTimeoutId: number | null = null;
  private portraitSwitchTimeoutId: number | null = null;
  private portraitSwitchDoneTimeoutId: number | null = null;

  protected readonly portraitHighlights = computed(() => this.content().portraitHighlights);
  /** Splits off the last title word so the arrow stays glued to it and never wraps alone. */
  protected readonly projects = computed(() =>
    this.content().projects.map((project) => {
      const tailStart = project.title.lastIndexOf(' ') + 1;
      return {
        ...project,
        titleHead: project.title.slice(0, tailStart),
        titleTail: project.title.slice(tailStart),
      };
    }),
  );
  protected readonly currentPortraitHighlight = computed(
    () => this.portraitHighlights()[this.currentPortraitHighlightIndex()] ?? null,
  );
  protected readonly currentBioText = computed(
    (): string => this.content().bioTextsList[this.currentIndex()] ?? '',
  );

  private readonly startBrowserEffects = afterNextRender((): void => {
    this.preloadPortraitHighlights();
    if (!this.shouldEnableScrollEffects()) return;
    this.startBioTicker();
    window.addEventListener('scroll', this.scheduleScrollEffectsUpdate, { passive: true });
    window.addEventListener('resize', this.scheduleScrollEffectsUpdate, { passive: true });
    this.scheduleScrollEffectsUpdate();
  });

  protected interpolate(text: string): string {
    return text
      .replaceAll('{{firstname}}', this.global.firstname)
      .replaceAll('{{age}}', String(this.age));
  }

  ngOnDestroy(): void {
    if (typeof window === 'undefined') return;
    if (this.bioHideTimeoutId !== null) {
      window.clearTimeout(this.bioHideTimeoutId);
      this.bioHideTimeoutId = null;
    }
    this.clearPortraitSwitchTimeouts();
    this.destroyScrollEffects();
  }

  protected toggleBio(): void {
    if (this.isLongBioShown()) {
      this.isLongBioShown.set(false);
      if (this.bioHideTimeoutId !== null) window.clearTimeout(this.bioHideTimeoutId);
      this.bioHideTimeoutId = window.setTimeout((): void => {
        this.isLongBioMounted.set(false);
        this.bioHideTimeoutId = null;
      }, 300);
      return;
    }
    if (this.bioHideTimeoutId !== null) {
      window.clearTimeout(this.bioHideTimeoutId);
      this.bioHideTimeoutId = null;
    }
    this.isLongBioMounted.set(true);
    window.requestAnimationFrame((): void => {
      window.requestAnimationFrame((): void => {
        this.isLongBioShown.set(true);
      });
    });
  }
  protected showNextPortraitHighlight(): void {
    if (this.portraitHighlights().length <= 1 || this.isPortraitSwitching()) return;
    this.isPortraitSwitching.set(true);
    this.portraitSwitchTimeoutId = window.setTimeout((): void => {
      this.currentPortraitHighlightIndex.update(
        (index: number): number => (index + 1) % this.portraitHighlights().length,
      );
      this.portraitSwitchTimeoutId = null;
    }, 125);
    this.portraitSwitchDoneTimeoutId = window.setTimeout((): void => {
      this.isPortraitSwitching.set(false);
      this.portraitSwitchDoneTimeoutId = null;
    }, 250);
  }
  protected scrollToAboutSection(): void {
    this.scrollToElementById('about', this.getResponsiveScrollOffset(0.035));
  }
  protected scrollToProjectsSection(): void {
    this.scrollToElementById('projects', this.getResponsiveScrollOffset(0.035));
  }
  protected scrollToContactLinks(): void {
    this.scrollToElementById('contact-links', this.getResponsiveScrollOffset(0.05));
  }

  private shouldEnableScrollEffects(): boolean {
    if (typeof window === 'undefined') return false;

    const prefersReducedMotion: boolean = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    return !prefersReducedMotion;
  }

  /** Loads the other highlight images at low priority so a click swaps them without a visible delay. */
  private preloadPortraitHighlights(): void {
    const current = this.currentPortraitHighlight();
    for (const highlight of this.portraitHighlights()) {
      if (highlight === current) continue;
      const image = new Image();
      image.fetchPriority = 'low';
      image.sizes = highlight.imageSizes;
      image.srcset = highlight.imageSrcset;
      image.src = highlight.image;
    }
  }

  private startBioTicker(): void {
    interval(HomeComponent.bioTickerIntervalMs)
      .pipe(
        filter((): boolean => !this.isBioTickerPaused()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((): void => {
        const length = this.content().bioTextsList.length;
        this.currentIndex.update((index: number): number =>
          length > 0 ? (index + 1) % length : 0,
        );
      });
  }

  private destroyScrollEffects(): void {
    window.removeEventListener('scroll', this.scheduleScrollEffectsUpdate);
    window.removeEventListener('resize', this.scheduleScrollEffectsUpdate);
    if (this.scrollEffectsAnimationFrameId !== null) {
      window.cancelAnimationFrame(this.scrollEffectsAnimationFrameId);
      this.scrollEffectsAnimationFrameId = null;
    }
    document.documentElement.style.removeProperty('--name-pride-progress');
    document.getElementById('about')?.style.removeProperty('--about-scroll-progress');
    document.querySelectorAll<HTMLElement>('.project-entry').forEach((entry: HTMLElement): void => {
      entry.style.removeProperty('--project-entry-progress');
    });
  }
  private clearPortraitSwitchTimeouts(): void {
    if (this.portraitSwitchTimeoutId !== null) {
      window.clearTimeout(this.portraitSwitchTimeoutId);
      this.portraitSwitchTimeoutId = null;
    }
    if (this.portraitSwitchDoneTimeoutId !== null) {
      window.clearTimeout(this.portraitSwitchDoneTimeoutId);
      this.portraitSwitchDoneTimeoutId = null;
    }
  }
  private updateNameGradientProgress(): void {
    const root: HTMLElement = document.documentElement;
    const portfolioEyebrow: HTMLElement | null = document.getElementById('portfolio-eyebrow');
    const portfolioTriggerY: number =
      portfolioEyebrow === null
        ? Number.POSITIVE_INFINITY
        : portfolioEyebrow.getBoundingClientRect().top + window.scrollY;
    const isMobileViewport: boolean = window.innerWidth <= 700;
    const mobileRevealDistance: number = window.innerHeight / 15;
    const triggerDistance: number = isMobileViewport
      ? mobileRevealDistance
      : Math.max(portfolioTriggerY, 1);
    const rawProgress: number = Math.min(window.scrollY / triggerDistance, 1);
    const acceleratedProgress: number = Math.pow(rawProgress, isMobileViewport ? 0.48 : 0.66);
    const progress: number =
      window.scrollY > 0
        ? Math.max(acceleratedProgress, isMobileViewport ? 0.18 : 0.05)
        : acceleratedProgress;
    root.style.setProperty('--name-pride-progress', progress.toFixed(4));
  }
  private updateAboutSectionScrollProgress(): void {
    const aboutSection: HTMLElement | null = document.getElementById('about');
    if (aboutSection === null) return;
    const sectionRect: DOMRect = aboutSection.getBoundingClientRect();
    const viewportHeight: number = window.innerHeight || 1;
    const startY: number = viewportHeight * 0.96;
    const endY: number = viewportHeight * 0.46;
    const totalDistance: number = Math.max(startY - endY, 1);
    const rawProgress: number = (startY - sectionRect.top) / totalDistance;
    const clampedProgress: number = Math.min(Math.max(rawProgress, 0), 1);
    aboutSection.style.setProperty('--about-scroll-progress', clampedProgress.toFixed(4));
  }
  private updateProjectEntryRevealProgress(): void {
    const projectEntries: NodeListOf<HTMLElement> = document.querySelectorAll('.project-entry');
    const viewportHeight: number = window.innerHeight || 1;
    const startY: number = viewportHeight * 0.98;
    const endY: number = viewportHeight * 0.56;
    const totalDistance: number = Math.max(startY - endY, 1);
    const entriesWithTop: Array<{ entry: HTMLElement; top: number }> = Array.from(
      projectEntries,
      (entry: HTMLElement) => ({
        entry,
        top: entry.getBoundingClientRect().top,
      }),
    );
    entriesWithTop.forEach(({ entry, top }): void => {
      const rawProgress: number = (startY - top) / totalDistance;
      const clampedProgress: number = Math.min(Math.max(rawProgress, 0), 1);
      entry.style.setProperty('--project-entry-progress', clampedProgress.toFixed(4));
    });
  }
  private calculateAge(birthDateString: string): number {
    const birthDate: Date = new Date(birthDateString);
    const now: Date = new Date();
    let age: number = now.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassedThisYear: boolean =
      now.getMonth() > birthDate.getMonth() ||
      (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
    if (!hasBirthdayPassedThisYear) age -= 1;
    return age;
  }
  private scrollToElementById(elementId: string, offsetPx: number = 0): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const element: HTMLElement | null = document.getElementById(elementId);
    if (element === null) return;
    const targetTop: number = Math.max(
      element.getBoundingClientRect().top + window.scrollY - offsetPx,
      0,
    );
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }
  private getResponsiveScrollOffset(viewportRatio: number = 0.05): number {
    if (typeof window === 'undefined') return 0;
    const minOffsetPx: number = 20;
    const maxOffsetPx: number = 48;
    const responsiveOffsetPx: number = window.innerHeight * viewportRatio;
    return Math.min(Math.max(responsiveOffsetPx, minOffsetPx), maxOffsetPx);
  }
}
