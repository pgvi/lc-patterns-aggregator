import { HttpErrorResponse } from '@angular/common/http';
import { FullProblem, Source } from './types';
import { AggregateResponse } from './response';

export interface PatternsState {
  isLoading: boolean;
  error: HttpErrorResponse | null;
  data: any | null;
}

export interface UpdateState {
  isLoading: boolean;
  error: HttpErrorResponse | null;
  data: AggregateResponse | null;
  done: boolean;
}

export interface FullProblemState {
  isLoading: boolean;
  data: FullProblem[];
  error: Error | null;
}

export interface CompanyState {
  isLoading: boolean;
  data: string[];
  error: Error | null;
}

export interface FullSourceState {
  isLoading: boolean;
  data: Source[];
  error: Error | null;
}

export interface PatternState {
  isLoading: boolean;
  data: string[];
  error: Error | null;
}
