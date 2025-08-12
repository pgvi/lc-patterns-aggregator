import { Problem, Source } from './types';

export interface UpdateDatesResponse {
  lastUpdate: string;
  lastCompaniesUpdate: string;
}
export interface AggregateResponse {
  problems: Problem[];
  sources: Source[];
  companies: string[];
  topics: string[];
}
