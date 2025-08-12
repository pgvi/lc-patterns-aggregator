export interface Source {
  id: string;
  title: string;
  url: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  premium: boolean;
  url: string;
  topics: string[];
  lists: string[];
  companies: Company[];
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Solution {
  id: number;
  review: boolean;
  done: boolean;
  lastSolved: string;
}

export type FullProblem = Problem & Solution;

export interface DatesInfo {
  lastUpdate: Date;
  lastCompaniesUpdate: Date;
  lastCheck: Date;
}

export interface Company {
  name: string;
  frequency: Frequency[];
}

export type Frequency =
  | 'all'
  | 'moreThan180days'
  | 'last180days'
  | 'last90days'
  | 'last30days';

export enum CheckedFilter {
  ALL = 'all',
  YES = 'yes',
  NO = 'no',
}

export interface Filter {
  company: string;
  difficulty: Difficulty[];
  review: CheckedFilter;
  done: CheckedFilter;
  source: string;
  pattern: string;
  hidePatterns: boolean;
  lastSearch: string;
  sortOption: SortOption;
  sortDirection: SortDirection;
}

export interface FilterUpdate extends Filter {
  updatePage: boolean;
}

export enum SortOption {
  LAST_SOLVED = 'lastSolved',
  DIFFICULTY = 'difficulty',
  REVIEW = 'review',
  DONE = 'done',
  TITLE = 'title',
  ID = 'id',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
