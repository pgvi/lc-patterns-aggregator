import { Component, computed, input } from '@angular/core';
import { FullProblem } from '../types/types';
import { FullProblemState } from '../types/state';

@Component({
  selector: 'app-progress',
  imports: [],
  templateUrl: './progress.html',
  styles: ``,
})
export class Progress {
  problems = input.required<FullProblemState>();
  progression = computed(() => this.countProgress(this.problems().data));

  countProgress(problems: FullProblem[]) {
    const difficultyToCount = {
      easyTotal: 0,
      easyDone: 0,
      mediumTotal: 0,
      mediumDone: 0,
      hardTotal: 0,
      hardDone: 0,
      total: 0,
      done: 0,
    };
    problems.forEach((p) => {
      switch (p.difficulty) {
        case 'Easy':
          difficultyToCount.easyTotal++;
          difficultyToCount.easyDone += p.done ? 1 : 0;
          break;
        case 'Medium':
          difficultyToCount.mediumTotal++;
          difficultyToCount.mediumDone += p.done ? 1 : 0;
          break;
        case 'Hard':
          difficultyToCount.hardTotal++;
          difficultyToCount.hardDone += p.done ? 1 : 0;
      }
    });

    difficultyToCount.total =
      difficultyToCount.easyTotal +
      difficultyToCount.mediumTotal +
      difficultyToCount.hardTotal;
    difficultyToCount.done =
      difficultyToCount.easyDone +
      difficultyToCount.mediumDone +
      difficultyToCount.hardDone;

    return difficultyToCount;
  }
}
