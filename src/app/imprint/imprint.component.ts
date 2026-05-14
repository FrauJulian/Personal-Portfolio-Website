import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { global } from '../../global';
import { FooterComponent } from '../footer/footer.component';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [FooterComponent, FaIconComponent, RouterLink],
  templateUrl: './imprint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImprintComponent {
  private readonly languageService = inject(LanguageService);

  protected readonly content = this.languageService.content;
  protected readonly global = global;
  protected readonly faArrowLeft: IconDefinition = faArrowLeft;
  protected readonly contactMailHref = `mailto:${global.contactMail}`;
  protected readonly abuseMailHref = `mailto:${global.abuseMail}`;

  protected bind(text: string): string {
    return text
      .replaceAll('{{firstname}}', this.global.firstname)
      .replaceAll('{{lastname}}', this.global.lastname)
      .replaceAll('{{contactMail}}', this.global.contactMail)
      .replaceAll('{{contactPhone}}', this.global.contactPhone);
  }
}
