import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FullProblem } from '../types/types';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-patterns-frequency',
  imports: [NgClass],
  templateUrl: './patterns-frequency.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternsFrequency {
  problems = input.required<FullProblem[]>();
  frequency = computed(() => this.countPatternsFrequency(this.problems()));

  countPatternsFrequency(problems: FullProblem[]) {
    const patternCount = new Map<string, number>();
    problems.forEach((p) =>
      p.topics.forEach((pattern) =>
        patternCount.set(pattern, 1 + (patternCount.get(pattern) ?? 0)),
      ),
    );

    return Array.from(patternCount.entries()).sort((a, b) => {
      const count = b[1] - a[1];
      return count == 0 ? a[0].localeCompare(b[0]) : count;
    });
  }
}
