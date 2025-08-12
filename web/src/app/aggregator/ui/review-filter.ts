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
  selector: 'app-review-filter',
  imports: [],
  templateUrl: './review-filter.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFilter implements OnInit {
  readonly checkedFilter = CheckedFilter;
  filter = input.required<Filter>();
  review = signal<CheckedFilter>(CheckedFilter.ALL);
  updateReviewEvent = output<CheckedFilter>();

  ngOnInit(): void {
    this.review.set(this.filter().review);
  }

  update(checked: CheckedFilter) {
    this.review.set(checked);
    this.updateReviewEvent.emit(checked);
  }
}
