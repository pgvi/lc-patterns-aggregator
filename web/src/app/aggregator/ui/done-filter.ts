import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CheckedFilter, Filter } from '../types/types';

@Component({
  selector: 'app-done-filter',
  imports: [],
  templateUrl: './done-filter.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoneFilter implements OnInit {
  readonly checkedFilter = CheckedFilter;
  filter = input.required<Filter>();
  done = signal<CheckedFilter>(CheckedFilter.ALL);
  updateDoneEvent = output<CheckedFilter>();

  ngOnInit(): void {
    this.done.set(this.filter().done);
  }

  update(checked: CheckedFilter) {
    this.done.set(checked);
    this.updateDoneEvent.emit(checked);
  }
}
