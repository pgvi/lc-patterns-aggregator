import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'svg[desc-icon]',
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  `,
  host: {
    '[attr.viewBox]': 'viewBox()',
  },
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescIcon {
  readonly viewBox = input<string>('0 0 24 24');
}
