import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'svg[asc-icon]',
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
      />
    </svg>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': 'viewBox()',
  },
})
export class AscIcon {
  readonly viewBox = input<string>('0 0 24 24');
}
