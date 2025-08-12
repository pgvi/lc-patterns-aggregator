import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Filter, Source } from '../types/types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sources-filter',
  imports: [FormsModule],
  templateUrl: './sources-filter.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcesFilter implements OnInit {
  sources = input.required<Source[]>();
  filter = input.required<Filter>();
  updateSourceEvent = output<string>();

  source = signal('');

  ngOnInit(): void {
    this.source.set(this.filter().source);
  }

  update(source: string) {
    this.source.set(source);
    this.updateSourceEvent.emit(source);
  }
}
