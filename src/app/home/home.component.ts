import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject, NgZone } from '@angular/core';
import { faArrowRight, faArrowDown, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DomSanitizer } from '@angular/platform-browser';
import type { SafeUrl } from '@angular/platform-browser';
import type { Subscription } from 'rxjs';
import { interval } from 'rxjs';

import type { Global, PortraitHighlight, PortfolioProject } from '../../global.fields';
import { global } from '../../global.fields';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, FaIconComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly zone = inject(NgZone);
  private preloadedImages: HTMLImageElement[] = [];

  protected readonly global: Global = global;
  protected readonly age: number | string = this.calculateAge(global.birthdate);

  protected isLongBioShown: boolean = false;
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
  private sub!: Subscription;

  constructor() {
    this.contactSafeMail = this.sanitizer.bypassSecurityTrustUrl(`mailto:${global.contactMail}`);
  }

  ngOnInit(): void {
    this.preloadImageAssets();

    this.zone.runOutsideAngular((): void => {
      this.sub = interval(1000).subscribe((): void => {
        this.zone.run((): void => {
          this.currentIndex = (this.currentIndex + 1) % this.global.bioTextsList.length;
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  protected toggleBio(): void {
    this.isLongBioShown = !this.isLongBioShown;
  }

  protected get currentPortraitHighlight(): PortraitHighlight | null {
    return this.portraitHighlights[this.currentPortraitHighlightIndex] ?? null;
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
