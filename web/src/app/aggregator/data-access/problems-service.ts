import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  CheckedFilter,
  Difficulty,
  FullProblem,
  Solution,
  SortDirection,
  SortOption,
} from '../types/types';
import {
  CompanyState,
  FullProblemState,
  FullSourceState,
  PatternState,
} from '../types/state';
import AppDb from './db';
import { UpdateService } from './update-service';
import { FilterService } from './filter-service';

@Injectable({
  providedIn: 'root',
})
export class ProblemsService {
  private db = inject(AppDb);
  private updateService = inject(UpdateService);
  private filterService = inject(FilterService);
  private readonly difficultyOrder = new Map<Difficulty, number>([
    ['Easy', 0],
    ['Medium', 1],
    ['Hard', 2],
  ]);
  private readonly initialState = {
    isLoading: false,
    error: null,
    data: [],
  };

  private updateState = this.updateService.updateState;

  private problems$ = signal<FullProblemState>(this.initialState);
  problems = this.problems$.asReadonly();
  filteredProblems = computed(() => this.filterProblems());

  private page$ = signal<number>(1);
  page = this.page$.asReadonly();

  private sources$ = signal<FullSourceState>(this.initialState);
  sources = this.sources$.asReadonly();

  private patterns$ = signal<PatternState>(this.initialState);
  patterns = this.patterns$.asReadonly();

  private companies$ = signal<CompanyState>(this.initialState);
  companies = this.companies$.asReadonly();

  private filter = this.filterService.filter;
  hidePattern = computed(() => this.filter().hidePatterns);

  isLoading = computed(
    () =>
      this.updateState().isLoading ||
      this.problems$().isLoading ||
      this.sources$().isLoading ||
      this.patterns$().isLoading ||
      this.companies$().isLoading,
  );

  constructor() {
    this.updateService.checkUpdate();
    effect(() => {
      if (this.updateState().done) {
        this.fetchProblems();
        this.fetchCompanies();
        this.fetchSources();
        this.fetchPatterns();
      }
    });
  }

  fetchProblems() {
    this.problems$.set({ ...this.initialState, isLoading: true });
    this.db
      .getProblems()
      .then((f) => {
        this.problems$.set({ ...this.initialState, data: f });
      })
      .catch((e) => {
        this.problems$.set({ ...this.initialState, error: e });
      });
  }

  private sortProblems(
    a: FullProblem,
    b: FullProblem,
    o: SortOption,
    d: SortDirection,
  ): number {
    let cmp = 0;
    const idCmp = a.id - b.id;
    switch (o) {
      case SortOption.DIFFICULTY:
        cmp =
          (this.difficultyOrder.get(a.difficulty) ?? 0) -
          (this.difficultyOrder.get(b.difficulty) ?? 0);
        break;
      case SortOption.TITLE:
        cmp = a.title.localeCompare(b.title);
        break;
      case SortOption.LAST_SOLVED:
        cmp = a.lastSolved.localeCompare(b.lastSolved);
        break;
      case SortOption.DONE:
        cmp = (a.done ? 0 : 1) - (b.review ? 0 : 1);
        break;
      case SortOption.REVIEW:
        cmp = (a.review ? 0 : 1) - (b.review ? 0 : 1);
        break;
      case SortOption.ID:
      default:
        cmp = idCmp;
    }

    if (d == SortDirection.DESC) cmp *= -1;

    return cmp != 0 ? cmp : idCmp;
  }

  fetchSources() {
    this.sources$.set({ ...this.initialState, isLoading: true });
    this.db
      .getSources()
      .then((s) => this.sources$.set({ ...this.initialState, data: s }))
      .catch((e) => this.sources$.set({ ...this.initialState, error: e }));
  }

  fetchCompanies() {
    this.companies$.set({ ...this.initialState, isLoading: true });
    this.db
      .getCompanies()
      .then((c) => this.companies$.set({ ...this.initialState, data: c }))
      .catch((e) => this.companies$.set({ ...this.initialState, error: e }));
  }

  fetchPatterns() {
    this.patterns$.set({ ...this.initialState, isLoading: true });
    this.db
      .getPatterns()
      .then((p) => this.patterns$.set({ ...this.initialState, data: p }))
      .catch((e) => this.patterns$.set({ ...this.initialState, error: e }));
  }

  updateSolution(s: Solution) {
    this.db.updateSolution(s);

    this.problems$.update((state) => {
      if (state.data == null) return state;
      const index = state.data.findIndex((p) => p.id == s.id);
      if (index >= 0) state.data[index] = { ...state.data[index], ...s };

      return { ...state };
    });
  }

  updatePageNumber(n: number) {
    this.page$.set(Math.max(1, n));
  }

  filterProblems(): FullProblemState {
    const s = this.problems();
    if (s.data == null) return s;

    const f = this.filter();
    const conditions: ((p: FullProblem) => boolean)[] = [];

    if (f.pattern.length > 0)
      conditions.push((p: FullProblem) => p.topics.includes(f.pattern));

    if (f.source.length > 0)
      conditions.push((p: FullProblem) => p.lists.includes(f.source));

    if (f.company.length > 0)
      conditions.push((p: FullProblem) =>
        p.companies.some((c) => c.name == f.company),
      );

    if (f.done != CheckedFilter.ALL)
      conditions.push((p: FullProblem) =>
        f.done == CheckedFilter.YES ? p.done : !p.done,
      );

    if (f.review != CheckedFilter.ALL)
      conditions.push((p: FullProblem) =>
        f.review == CheckedFilter.YES ? p.review : !p.review,
      );

    if (f.difficulty.length < 3)
      conditions.push((p) => f.difficulty.includes(p.difficulty))
        ? true
        : false;

    if (f.lastSearch.length > 0)
      conditions.push((p) =>
        p.title.toLowerCase().includes(f.lastSearch.toLowerCase()),
      );

    const problems = s.data.filter((d) => conditions.every((c) => c(d)));

    problems.sort((a, b) =>
      this.sortProblems(a, b, f.sortOption, f.sortDirection),
    );
    return { ...s, data: problems };
  }
}
