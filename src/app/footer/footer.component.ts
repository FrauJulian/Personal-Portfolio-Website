import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Global } from '../../global.fields';
import { global } from '../../global.fields';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  protected readonly global: Global = global;
  protected readonly currentYear: number = new Date().getFullYear();
}
