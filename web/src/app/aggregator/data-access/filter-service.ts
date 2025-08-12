import { Injectable, signal } from '@angular/core';
import {
  CheckedFilter,
  Filter,
  SortDirection,
  SortOption,
} from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private readonly filterKey = 'filter';
  private readonly defaultFilter: Filter = {
    company: '',
    difficulty: ['Easy', 'Medium', 'Hard'],
    review: CheckedFilter.ALL,
    done: CheckedFilter.ALL,
    source: '',
    pattern: '',
    hidePatterns: false,
    lastSearch: '',
    sortOption: SortOption.DIFFICULTY,
    sortDirection: SortDirection.ASC,
  };

  private filter$ = signal<Filter>(this.getFilter());
  filter = this.filter$.asReadonly();

  resetFilter() {
    this.filter$.set(this.defaultFilter);
    localStorage.setItem(this.filterKey, JSON.stringify(this.defaultFilter));
  }

  setFilter(filter: Filter) {
    this.filter$.set(filter);
    localStorage.setItem(this.filterKey, JSON.stringify(filter));
  }

  private getFilter() {
    const filter = localStorage.getItem(this.filterKey);
    return filter == null ? this.defaultFilter : JSON.parse(filter);
  }
}
