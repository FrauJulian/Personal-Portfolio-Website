import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { SvgIcon, SvgIconSize } from './icon.types';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      class="app-icon"
      [class.app-icon-lg]="size() === 'lg'"
      [attr.viewBox]="icon().viewBox"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="currentColor" [attr.d]="icon().path" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 1;
      }

      .app-icon {
        box-sizing: content-box;
        display: inline-block;
        width: 1.25em;
        height: 1em;
        overflow: visible;
        vertical-align: -0.125em;
      }

      .app-icon-lg {
        font-size: 1.25em;
        vertical-align: -0.2em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly icon = input.required<SvgIcon>();
  readonly size = input<SvgIconSize>('base');
}
