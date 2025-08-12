import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Filter, FilterUpdate } from '../types/types';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './search.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search implements OnInit, OnDestroy {
  private searchSubscription$ = new Subject<void>();
  filter = input.required<Filter>();
  updateSearchEvent = output<FilterUpdate>();
  search = new FormControl('', {
    nonNullable: true,
  });

  ngOnInit(): void {
    this.search.setValue(this.filter().lastSearch);
    this.search.valueChanges
      .pipe(
        takeUntil(this.searchSubscription$),
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.updateSearch();
        }),
      )
      .subscribe();
  }

  updateSearch() {
    this.updateSearchEvent.emit({
      ...this.filter(),
      updatePage: true,
      lastSearch: this.search.getRawValue(),
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription$.unsubscribe();
  }
}
