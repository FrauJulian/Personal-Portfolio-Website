import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import type { SafeUrl } from '@angular/platform-browser';
import type { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import type { Global } from '../../global';
import { global } from '../../global';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-imprint',
  imports: [FooterComponent, FaIconComponent, RouterLink],
  templateUrl: './imprint.component.html',
})
export class ImprintComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly global: Global = global;
  protected readonly displayStreet: string = this.normalizeText(global.address.street);
  protected readonly displayCity: string = this.normalizeText(global.address.city);

  protected contactSafeMail!: SafeUrl;
  protected abuseSafeMail!: SafeUrl;

  protected readonly faArrowLeft: IconDefinition = faArrowLeft;

  ngOnInit(): void {
    this.contactSafeMail = this.sanitizer.bypassSecurityTrustUrl(`mailto:${global.contactMail}`);
    this.abuseSafeMail = this.sanitizer.bypassSecurityTrustUrl(`mailto:${this.global.abuseMail}`);
  }

  private normalizeText(value: string): string {
    return value
      .replaceAll('ß', 'ß')
      .replaceAll('ö', 'ö')
      .replaceAll('Ä', 'Ä')
      .replaceAll('ä', 'ä')
      .replaceAll('Ü', 'Ü')
      .replaceAll('ü', 'ü');
  }
}
