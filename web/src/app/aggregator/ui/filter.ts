import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  CheckedFilter,
  Difficulty,
  Filter,
  FilterUpdate,
  Source,
} from '../types/types';
import { CompanyState } from '../types/state';
import { PatternsFilter } from './patterns-filter';
import { DifficultyFilter } from './difficulty-filter';
import { DoneFilter } from './done-filter';
import { ReviewFilter } from './review-filter';
import { SourcesFilter } from './sources-filter';
import { CompaniesFilter } from './companies-filter';

@Component({
  selector: 'app-filter',
  imports: [
    PatternsFilter,
    DifficultyFilter,
    DoneFilter,
    ReviewFilter,
    SourcesFilter,
    CompaniesFilter,
  ],
  templateUrl: './filter.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterForm {
  filter = input.required<Filter>();
  patterns = input.required<string[]>();
  sources = input.required<Source[]>();
  companies = input.required<CompanyState>();

  updateFilterEvent = output<FilterUpdate>();

  updateFilter(filter: Filter, updatePage = true) {
    this.updateFilterEvent.emit({ ...filter, updatePage: updatePage });
  }

  updateSource(source: string) {
    this.updateFilter({ ...this.filter(), source: source });
  }

  updateCompany(company: string) {
    this.updateFilter({ ...this.filter(), company: company });
  }

  updatePatternEvent(pattern: string) {
    this.updateFilter({ ...this.filter(), pattern: pattern });
  }

  updateDoneEvent(checked: CheckedFilter) {
    this.updateFilter({ ...this.filter(), done: checked });
  }

  updateReviewEvent(checked: CheckedFilter) {
    this.updateFilter({ ...this.filter(), review: checked });
  }

  updateDifficultyEvent(difficulty: Difficulty[]) {
    this.updateFilter({ ...this.filter(), difficulty: difficulty });
  }

  toggleHidePattern() {
    this.updateFilter(
      {
        ...this.filter(),
        hidePatterns: !this.filter().hidePatterns,
      },
      false,
    );
  }
}
