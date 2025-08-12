import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Source } from '../types/types';
import { InfoIcon } from '../../shared/ui/info-icon';
import { LinkIcon } from '../../shared/ui/link-icon';

@Component({
  selector: 'app-sources-info',
  imports: [InfoIcon, LinkIcon],
  templateUrl: './sources-info.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcesInfo {
  sourceIds = input.required<string[]>();
  availableSources = input.required<Source[]>();

  sources = computed(() => {
    return this.availableSources().filter((s) =>
      this.sourceIds().includes(s.id),
    );
  });
}
