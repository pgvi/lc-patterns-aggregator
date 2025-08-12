import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProblemsService } from '../data-access/problems-service';
import { PatternsFrequency } from '../ui/patterns-frequency';
import { Progress } from '../ui/progress';
import { FilterForm } from '../ui/filter';
import { FilterService } from '../data-access/filter-service';
import { FilterUpdate } from '../types/types';
import { Search } from '../ui/search';
import { Sort } from '../ui/sort';

@Component({
  selector: 'app-problems-filter',
  imports: [PatternsFrequency, Progress, FilterForm, Search, Sort],
  templateUrl: './problems-filter.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemsFilter {
  problemsService = inject(ProblemsService);
  filterService = inject(FilterService);
  problemState = this.problemsService.filteredProblems;
  sourceState = this.problemsService.sources;
  companyState = this.problemsService.companies;
  patternState = this.problemsService.patterns;
  isLoading = this.problemsService.isLoading;
  filter = this.filterService.filter;

  updateFilter(filter: FilterUpdate) {
    this.filterService.setFilter(filter);
    if (filter.updatePage) this.problemsService.updatePageNumber(1);
  }
}
