import { effect, inject, Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { FullProblem, Problem, Solution, Source } from '../types/types';
import { UpdateService } from './update-service';

@Injectable({
  providedIn: 'root',
})
export default class AppDb extends Dexie {
  problems!: Table<Problem, string>;
  solutions!: Table<Solution, string>;
  companies!: Table<string, string>;
  sources!: Table<Source, string>;
  topics!: Table<string>;

  private readonly updateService = inject(UpdateService);
  private readonly updateState = this.updateService.updateState;

  constructor() {
    super('leetcode');
    this.version(1).stores({
      problems: '&id, title, difficulty, topics*, lists*, companies*',
      solutions: '&id, lastSolved',
      companies: '++',
      sources: '&id',
      topics: '++',
    });

    effect(() => {
      const aggregate = this.updateState();
      if (aggregate.done && aggregate.data != null) {
        this.problems.bulkPut(aggregate.data.problems);
        this.companies.bulkPut(aggregate.data.companies);
        this.sources.bulkPut(aggregate.data.sources);
        this.topics.bulkPut(aggregate.data.topics);
      }
    });
  }

  async getProblems(): Promise<FullProblem[]> {
    const problems = await this.problems.toArray();
    const solutions = new Map(
      (await this.solutions.toArray()).map((s) => [s.id, s]),
    );
    return problems.map((p) => {
      const s = solutions.get(p.id) ?? {
        id: p.id,
        review: false,
        done: false,
        lastSolved: '',
      };
      return { ...p, ...s };
    });
  }

  async getPatterns(): Promise<string[]> {
    return await this.topics.toArray();
  }

  async getSources(): Promise<Source[]> {
    return await this.sources.toArray();
  }

  async getCompanies(): Promise<string[]> {
    return await this.companies.toArray();
  }

  updateSolution(s: Solution) {
    this.solutions.put(s);
  }
}
