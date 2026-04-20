import type { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Component, inject, NgZone } from '@angular/core';
import { faArrowRight, faArrowDown, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DomSanitizer } from '@angular/platform-browser';
import type { SafeUrl } from '@angular/platform-browser';
import type { Subscription } from 'rxjs';
import { interval } from 'rxjs';

import type { BioTextEntry, Global, PortraitHighlight, PortfolioProject } from '../../global';
import { global } from '../../global';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, FaIconComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly zone = inject(NgZone);
  private preloadedImages: HTMLImageElement[] = [];
  private tallestPortraitAspectRatio: number | null = null;
  private lockedHeroSectionMinHeight: number = 0;
  private projectEntryObserver: IntersectionObserver | null = null;
  private aboutSectionObserver: IntersectionObserver | null = null;
  private scrollAnimationFrameId: number | null = null;
  private heroHeightAnimationFrameId: number | null = null;
  private readonly scheduleNameGradientUpdate: () => void = (): void => {
    if (this.scrollAnimationFrameId !== null || typeof window === 'undefined') {
      return;
    }

    this.scrollAnimationFrameId = window.requestAnimationFrame((): void => {
      this.scrollAnimationFrameId = null;
      this.updateNameGradientProgress();
    });
  };
  private readonly scheduleHeroSectionHeightUpdate: () => void = (): void => {
    if (this.heroHeightAnimationFrameId !== null || typeof window === 'undefined') {
      return;
    }

    this.heroHeightAnimationFrameId = window.requestAnimationFrame((): void => {
      this.heroHeightAnimationFrameId = null;
      this.lockedHeroSectionMinHeight = 0;
      this.updateHeroSectionMinHeight();
    });
  };

  protected readonly global: Global = global;
  protected readonly age: number | string = this.calculateAge(global.birthdate);

  protected isLongBioShown: boolean = false;
  protected isLongBioMounted: boolean = false;
  protected isAboutSectionInView: boolean = true;
  protected isAboutSectionAnimationReady: boolean = true;
  protected readonly faArrowRight: IconDefinition = faArrowRight;
  protected readonly faArrowDown: IconDefinition = faArrowDown;
  protected readonly faEnvelope: IconDefinition = faEnvelope;
  protected readonly faPhone: IconDefinition = faPhone;
  readonly faDiscord: IconDefinition = faDiscord;
  readonly faGithub: IconDefinition = faGithub;
  readonly faLinkedin: IconDefinition = faLinkedin;

  protected readonly contactSafeMail: SafeUrl;
  protected readonly portraitHighlights: PortraitHighlight[] = global.portraitHighlights;
  protected currentPortraitHighlightIndex: number = 0;
  protected isPortraitSwitching: boolean = false;

  protected currentIndex = 0;
  protected readonly projects: PortfolioProject[] = global.projects;
  protected readonly fallbackBioEntry: BioTextEntry = { label: 'my stack', value: '' };
  private sub!: Subscription;
  private bioHideTimeoutId: number | null = null;

  constructor() {
    this.contactSafeMail = this.sanitizer.bypassSecurityTrustUrl(`mailto:${global.contactMail}`);
  }

  ngOnInit(): void {
    this.preloadImageAssets();
    this.initNameGradientScrollAnimation();

    this.zone.runOutsideAngular((): void => {
      this.sub = interval(1000).subscribe((): void => {
        this.zone.run((): void => {
          this.currentIndex = (this.currentIndex + 1) % this.global.bioTextsList.length;
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
        if (this.bioHideTimeoutId !== null) {
          window.clearTimeout(this.bioHideTimeoutId);
        }
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

  protected get currentPortraitHighlight(): PortraitHighlight | null {
    return this.portraitHighlights[this.currentPortraitHighlightIndex] ?? null;
  }

  protected get currentBioEntry(): BioTextEntry {
    return this.global.bioTextsList[this.currentIndex] ?? this.fallbackBioEntry;
  }

  protected showNextPortraitHighlight(): void {
    if (this.portraitHighlights.length <= 1 || this.isPortraitSwitching) {
      return;
    }

    this.isPortraitSwitching = true;

    setTimeout((): void => {
      this.currentPortraitHighlightIndex =
        (this.currentPortraitHighlightIndex + 1) % this.portraitHighlights.length;
    }, 125);

    setTimeout((): void => {
      this.isPortraitSwitching = false;
    }, 250);
  }

  private preloadImageAssets(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const projectIcons: string[] = this.projects
      .map((project: PortfolioProject): string | undefined => project.icon)
      .filter((icon: string | undefined): icon is string => Boolean(icon));

    const uniqueImageUrls: string[] = Array.from(
      new Set<string>([
        ...this.portraitHighlights.map((highlight: PortraitHighlight): string => highlight.image),
        ...projectIcons,
      ]),
    );

    this.preloadedImages = uniqueImageUrls.map((url: string): HTMLImageElement => {
      const image = new Image();
      image.decoding = 'async';
      image.loading = 'eager';
      image.src = url;
      return image;
    });

    this.syncHeroHeightToLargestPortraitImage();
  }

  private syncHeroHeightToLargestPortraitImage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const portraitImageUrls: Set<string> = new Set<string>(
      this.portraitHighlights.map(
        (highlight: PortraitHighlight): string =>
          new URL(highlight.image, window.location.href).href,
      ),
    );

    const portraitImages: HTMLImageElement[] = this.preloadedImages.filter(
      (image: HTMLImageElement): boolean => portraitImageUrls.has(image.src),
    );

    if (portraitImages.length === 0) {
      return;
    }

    const finalizeAspectRatio = (): void => {
      const minAspectRatio: number = portraitImages.reduce(
        (minRatio: number, image: HTMLImageElement): number => {
          if (image.naturalWidth === 0 || image.naturalHeight === 0) {
            return minRatio;
          }

          const currentRatio: number = image.naturalWidth / image.naturalHeight;
          return minRatio === 0 ? currentRatio : Math.min(minRatio, currentRatio);
        },
        0,
      );

      if (minAspectRatio > 0) {
        this.tallestPortraitAspectRatio = minAspectRatio;
        this.scheduleHeroSectionHeightUpdate();
      }
    };

    let pendingLoads: number = portraitImages.length;
    const onImageSettled = (): void => {
      pendingLoads -= 1;
      if (pendingLoads === 0) {
        finalizeAspectRatio();
      }
    };

    for (const image of portraitImages) {
      if (image.complete) {
        onImageSettled();
        continue;
      }

      image.addEventListener('load', onImageSettled, { once: true });
      image.addEventListener('error', onImageSettled, { once: true });
    }
  }

  private initNameGradientScrollAnimation(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('scroll', this.scheduleNameGradientUpdate, { passive: true });
    window.addEventListener('resize', this.scheduleNameGradientUpdate, { passive: true });
    window.addEventListener('resize', this.scheduleHeroSectionHeightUpdate, { passive: true });
    this.scheduleNameGradientUpdate();
    this.scheduleHeroSectionHeightUpdate();
  }

  private initProjectEntryRevealObserver(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const projectEntries: NodeListOf<Element> = document.querySelectorAll('.project-entry');
    projectEntries.forEach((entry: Element): void => {
      entry.classList.add('project-entry-reveal-pending');
    });

    if (typeof IntersectionObserver === 'undefined') {
      projectEntries.forEach((entry: Element): void => {
        entry.classList.add('project-entry-visible');
        entry.classList.remove('project-entry-reveal-pending');
      });
      return;
    }

    this.projectEntryObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        for (const entry of entries) {
          const element: Element = entry.target;
          if (entry.isIntersecting) {
            window.requestAnimationFrame((): void => {
              element.classList.add('project-entry-visible');
              element.classList.remove('project-entry-reveal-pending');
            });
            continue;
          }

          element.classList.add('project-entry-reveal-pending');
          element.classList.remove('project-entry-visible');
        }
      },
      {
        root: null,
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    projectEntries.forEach((entry: Element): void => {
      this.projectEntryObserver?.observe(entry);
    });
  }

  private destroyProjectEntryRevealObserver(): void {
    this.projectEntryObserver?.disconnect();
    this.projectEntryObserver = null;
  }

  private initAboutSectionScrollAnimation(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const aboutSection: HTMLElement | null = document.getElementById('about');
    if (aboutSection === null) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.aboutSectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            this.zone.run((): void => {
              this.isAboutSectionInView = false;
            });
            continue;
          }

          this.zone.run((): void => {
            this.isAboutSectionInView = false;
          });

          window.requestAnimationFrame((): void => {
            this.zone.run((): void => {
              this.isAboutSectionInView = true;
            });
          });
        }
      },
      {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -6% 0px',
      },
    );

    this.aboutSectionObserver.observe(aboutSection);
  }

  private destroyAboutSectionScrollAnimation(): void {
    this.aboutSectionObserver?.disconnect();
    this.aboutSectionObserver = null;
  }

  private destroyNameGradientScrollAnimation(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('scroll', this.scheduleNameGradientUpdate);
    window.removeEventListener('resize', this.scheduleNameGradientUpdate);
    window.removeEventListener('resize', this.scheduleHeroSectionHeightUpdate);

    if (this.scrollAnimationFrameId !== null) {
      window.cancelAnimationFrame(this.scrollAnimationFrameId);
      this.scrollAnimationFrameId = null;
    }
    if (this.heroHeightAnimationFrameId !== null) {
      window.cancelAnimationFrame(this.heroHeightAnimationFrameId);
      this.heroHeightAnimationFrameId = null;
    }

    document.documentElement.style.removeProperty('--name-pride-progress');
    document.documentElement.style.removeProperty('--hero-section-min-height');
    this.lockedHeroSectionMinHeight = 0;
  }

  private updateNameGradientProgress(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const root: HTMLElement = document.documentElement;
    const portfolioEyebrow: HTMLElement | null = document.getElementById('portfolio-eyebrow');
    const portfolioTriggerY: number =
      portfolioEyebrow === null
        ? Number.POSITIVE_INFINITY
        : portfolioEyebrow.getBoundingClientRect().top + window.scrollY;

    const triggerDistance: number = Math.max(portfolioTriggerY, 1);
    const rawProgress: number = Math.min(window.scrollY / triggerDistance, 1);
    const acceleratedProgress: number = Math.pow(rawProgress, 0.66);
    const progress: number =
      window.scrollY > 0 ? Math.max(acceleratedProgress, 0.05) : acceleratedProgress;

    root.style.setProperty('--name-pride-progress', progress.toFixed(4));
  }

  private updateHeroSectionMinHeight(): void {
    if (typeof window === 'undefined' || this.tallestPortraitAspectRatio === null) {
      return;
    }

    const heroSection: HTMLElement | null = document.querySelector('.hero-section');
    const heroCopy: HTMLElement | null = document.querySelector('.hero-copy');
    const portraitHighlight: HTMLElement | null = document.querySelector('.portrait-highlight');
    const portraitButton: HTMLElement | null = document.querySelector('.portrait-highlight-button');

    if (
      heroSection === null ||
      heroCopy === null ||
      portraitHighlight === null ||
      portraitButton === null
    ) {
      return;
    }

    const buttonWidth: number = portraitButton.getBoundingClientRect().width;
    if (buttonWidth <= 0) {
      return;
    }

    const maxMediaHeight: number = buttonWidth / this.tallestPortraitAspectRatio;
    const currentButtonHeight: number = portraitButton.getBoundingClientRect().height;
    const currentHighlightHeight: number = portraitHighlight.getBoundingClientRect().height;
    const staticHighlightOverhead: number = Math.max(
      currentHighlightHeight - currentButtonHeight,
      0,
    );
    const requiredHighlightHeight: number = maxMediaHeight + staticHighlightOverhead;
    const requiredContentHeight: number = Math.max(
      heroCopy.getBoundingClientRect().height,
      requiredHighlightHeight,
    );
    const heroSectionStyles: CSSStyleDeclaration = window.getComputedStyle(heroSection);
    const paddingTop: number = Number.parseFloat(heroSectionStyles.paddingTop) || 0;
    const paddingBottom: number = Number.parseFloat(heroSectionStyles.paddingBottom) || 0;
    const requiredSectionMinHeight: number = requiredContentHeight + paddingTop + paddingBottom;
    this.lockedHeroSectionMinHeight = Math.max(
      this.lockedHeroSectionMinHeight,
      requiredSectionMinHeight,
    );

    document.documentElement.style.setProperty(
      '--hero-section-min-height',
      `${Math.ceil(this.lockedHeroSectionMinHeight)}px`,
    );
  }

  private calculateAge(birthDateString: string): number | string {
    let birthDate: Date = new Date(birthDateString);
    let now: Date = new Date();
    let diffMs: number = now.getTime() - birthDate.getTime();
    let diffYears: number = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    let tempAge: string = diffYears.toFixed(1);
    return tempAge.endsWith('.0') ? Math.round(diffYears) : tempAge;
  }
}
