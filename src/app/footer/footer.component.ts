import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { global } from '../../global';
import { ShellLanguageService } from '../services/shell-language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly shellLanguageService = inject(ShellLanguageService);

  protected readonly content = this.shellLanguageService.content;
  protected readonly global = global;
  protected readonly currentYear = new Date().getFullYear();
}
