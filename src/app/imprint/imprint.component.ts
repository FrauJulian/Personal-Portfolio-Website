import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { global } from '../../global';
import { FooterComponent } from '../footer/footer.component';
import { LanguageService } from '../services/language.service';
import { IconComponent } from '../shared/icon/icon.component';
import { arrowLeftIcon } from '../shared/icon/icons';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [FooterComponent, IconComponent, RouterLink],
  templateUrl: './imprint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImprintComponent {
  private readonly languageService = inject(LanguageService);

  protected readonly content = this.languageService.content;
  protected readonly global = global;
  protected readonly arrowLeftIcon = arrowLeftIcon;
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
