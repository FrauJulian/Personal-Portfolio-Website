import type { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, NgZone } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { faArrowRight, faArrowDown, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import type { Subscription } from 'rxjs';
import { interval } from 'rxjs';

import { global } from '../../global';
import type {
  LanguageBioTextEntry,
  LanguagePortraitHighlight,
  LanguageProject,
} from '../../languages/language.types';
import { FooterComponent } from '../footer/footer.component';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, FaIconComponent, NgOptimizedImage],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly languageService = inject(LanguageService);
  protected readonly content = this.languageService.content;

  private scrollAnimationFrameId: number | null = null;
  private projectEntryAnimationFrameId: number | null = null;
  private aboutSectionAnimationFrameId: number | null = null;
  private readonly scheduleNameGradientUpdate: () => void = (): void => {
    if (this.scrollAnimationFrameId !== null || typeof window === 'undefined') return;
    this.scrollAnimationFrameId = window.requestAnimationFrame((): void => {
      this.scrollAnimationFrameId = null;
      this.updateNameGradientProgress();
    });
  };
  private readonly scheduleProjectEntryRevealUpdate: () => void = (): void => {
    if (this.projectEntryAnimationFrameId !== null || typeof window === 'undefined') return;
    this.projectEntryAnimationFrameId = window.requestAnimationFrame((): void => {
      this.projectEntryAnimationFrameId = null;
      this.updateProjectEntryRevealProgress();
    });
  };
  private readonly scheduleAboutSectionScrollAnimationUpdate: () => void = (): void => {
    if (this.aboutSectionAnimationFrameId !== null || typeof window === 'undefined') return;
    this.aboutSectionAnimationFrameId = window.requestAnimationFrame((): void => {
      this.aboutSectionAnimationFrameId = null;
      this.updateAboutSectionScrollProgress();
    });
  };

  protected readonly global = global;
  protected readonly age = this.calculateAge(global.birthdate);
  protected readonly contactMailHref = `mailto:${global.contactMail}`;
  protected isLongBioShown = false;
  protected isLongBioMounted = false;
  protected readonly faArrowRight: IconDefinition = faArrowRight;
  protected readonly faArrowDown: IconDefinition = faArrowDown;
  protected readonly faEnvelope: IconDefinition = faEnvelope;
  protected readonly faPhone: IconDefinition = faPhone;
  readonly faDiscord: IconDefinition = faDiscord;
  readonly faGithub: IconDefinition = faGithub;
  readonly faLinkedin: IconDefinition = faLinkedin;

  protected currentPortraitHighlightIndex = 0;
  protected isPortraitSwitching = false;
  protected currentIndex = 0;
  protected readonly fallbackBioEntry: LanguageBioTextEntry = { label: 'my stack', value: '' };
  private sub!: Subscription;
  private bioHideTimeoutId: number | null = null;

  protected get portraitHighlights(): LanguagePortraitHighlight[] {
    return this.content().portraitHighlights;
  }
  protected get projects(): LanguageProject[] {
    return this.content().projects;
  }
  protected get currentPortraitHighlight(): LanguagePortraitHighlight | null {
    return this.portraitHighlights[this.currentPortraitHighlightIndex] ?? null;
  }
  protected get currentBioEntry(): LanguageBioTextEntry {
    return (
      this.content().bioTextsList[this.currentIndex] ?? {
        label: this.content().home.fallbackBioLabel,
        value: '',
      }
    );
  }

  protected interpolate(text: string): string {
    return text
      .replaceAll('{{firstname}}', this.global.firstname)
      .replaceAll('{{age}}', String(this.age));
  }

  ngOnInit(): void {
    this.initNameGradientScrollAnimation();
    this.zone.runOutsideAngular((): void => {
      this.sub = interval(1000).subscribe((): void => {
        this.zone.run((): void => {
          const len = this.content().bioTextsList.length;
          this.currentIndex = len > 0 ? (this.currentIndex + 1) % len : 0;
        });
      });
    });
  }

  ngAfterViewInit(): void {
    this.initProjectEntryRevealObserver();
    this.initAboutSectionScrollAnimation();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.bioHideTimeoutId !== null) {
      window.clearTimeout(this.bioHideTimeoutId);
      this.bioHideTimeoutId = null;
    }
    this.destroyNameGradientScrollAnimation();
    this.destroyProjectEntryRevealObserver();
    this.destroyAboutSectionScrollAnimation();
  }

  protected toggleBio(): void {
    if (this.isLongBioShown) {
      this.isLongBioShown = false;
      if (typeof window !== 'undefined') {
        if (this.bioHideTimeoutId !== null) window.clearTimeout(this.bioHideTimeoutId);
        this.bioHideTimeoutId = window.setTimeout((): void => {
          this.isLongBioMounted = false;
          this.bioHideTimeoutId = null;
        }, 300);
      } else {
        this.isLongBioMounted = false;
      }
      return;
    }
    if (this.bioHideTimeoutId !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.bioHideTimeoutId);
      this.bioHideTimeoutId = null;
    }
    this.isLongBioMounted = true;
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame((): void => {
        window.requestAnimationFrame((): void => {
          this.isLongBioShown = true;
        });
      });
    } else {
      this.isLongBioShown = true;
    }
  }
  protected showNextPortraitHighlight(): void {
    if (this.portraitHighlights.length <= 1 || this.isPortraitSwitching) return;
    this.isPortraitSwitching = true;
    setTimeout((): void => {
      this.currentPortraitHighlightIndex =
        (this.currentPortraitHighlightIndex + 1) % this.portraitHighlights.length;
    }, 125);
    setTimeout((): void => {
      this.isPortraitSwitching = false;
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
  private initNameGradientScrollAnimation(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', this.scheduleNameGradientUpdate, { passive: true });
    window.addEventListener('resize', this.scheduleNameGradientUpdate, { passive: true });
    this.scheduleNameGradientUpdate();
  }
  private initProjectEntryRevealObserver(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', this.scheduleProjectEntryRevealUpdate, { passive: true });
    window.addEventListener('resize', this.scheduleProjectEntryRevealUpdate, { passive: true });
    this.scheduleProjectEntryRevealUpdate();
  }
  private destroyProjectEntryRevealObserver(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    window.removeEventListener('scroll', this.scheduleProjectEntryRevealUpdate);
    window.removeEventListener('resize', this.scheduleProjectEntryRevealUpdate);
    if (this.projectEntryAnimationFrameId !== null) {
      window.cancelAnimationFrame(this.projectEntryAnimationFrameId);
      this.projectEntryAnimationFrameId = null;
    }
    document.querySelectorAll<HTMLElement>('.project-entry').forEach((entry: HTMLElement): void => {
      entry.style.removeProperty('--project-entry-progress');
    });
  }
  private initAboutSectionScrollAnimation(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', this.scheduleAboutSectionScrollAnimationUpdate, {
      passive: true,
    });
    window.addEventListener('resize', this.scheduleAboutSectionScrollAnimationUpdate, {
      passive: true,
    });
    this.scheduleAboutSectionScrollAnimationUpdate();
  }
  private destroyAboutSectionScrollAnimation(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    window.removeEventListener('scroll', this.scheduleAboutSectionScrollAnimationUpdate);
    window.removeEventListener('resize', this.scheduleAboutSectionScrollAnimationUpdate);
    if (this.aboutSectionAnimationFrameId !== null) {
      window.cancelAnimationFrame(this.aboutSectionAnimationFrameId);
      this.aboutSectionAnimationFrameId = null;
    }
    document.getElementById('about')?.style.removeProperty('--about-scroll-progress');
  }
  private destroyNameGradientScrollAnimation(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('scroll', this.scheduleNameGradientUpdate);
    window.removeEventListener('resize', this.scheduleNameGradientUpdate);
    if (this.scrollAnimationFrameId !== null) {
      window.cancelAnimationFrame(this.scrollAnimationFrameId);
      this.scrollAnimationFrameId = null;
    }
    document.documentElement.style.removeProperty('--name-pride-progress');
  }
  private updateNameGradientProgress(): void {
    if (typeof window === 'undefined') return;
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
    if (typeof window === 'undefined') return;
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
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
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
