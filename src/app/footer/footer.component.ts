import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Global } from '../../global';
import { global } from '../../global';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  protected readonly global: Global = global;
  protected readonly currentYear: number = new Date().getFullYear();
}
