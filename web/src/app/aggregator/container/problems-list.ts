import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProblemsService } from '../data-access/problems-service';
import { Problem } from '../ui/problem';
import { Solution } from '../types/types';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-problems-list',
  imports: [Problem, InfiniteScrollDirective],
  templateUrl: './problems-list.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemsList {
  readonly problemsPerPage = 18;
  problemsService = inject(ProblemsService);
  problemState = this.problemsService.filteredProblems;
  sourcesState = this.problemsService.sources;
  isLoading = this.problemsService.isLoading;
  hidePattern = this.problemsService.hidePattern;
  pageNumber = this.problemsService.page;

  updateSolution(s: Solution) {
    this.problemsService.updateSolution(s);
  }

  increasePageNumber() {
    this.problemsService.updatePageNumber(this.pageNumber() + 1);
  }
}
