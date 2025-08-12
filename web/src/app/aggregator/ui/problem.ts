import {
  Component,
  input,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FullProblem, Solution, Source } from '../types/types';
import dayjs from 'dayjs';
import { LinkIcon } from '../../shared/ui/link-icon';
import { LockIcon } from '../../shared/ui/lock-icon';
import { CompaniesInfo } from './companies-info';
import { SourcesInfo } from './sources-info';

@Component({
  imports: [LinkIcon, LockIcon, CompaniesInfo, SourcesInfo],
  selector: 'app-problem',
  templateUrl: './problem.html',
  styles: ``,
})
export class Problem implements OnInit {
  problem = input.required<FullProblem>();
  sources = input.required<Source[]>();
  hidePattern = input.required<boolean>();
  done: WritableSignal<boolean> = signal(false);
  review: WritableSignal<boolean> = signal(false);
  lastSolved: WritableSignal<string> = signal('');

  updateSolutionEvent = output<Solution>();

  ngOnInit() {
    this.done.set(this.problem().done);
    this.review.set(this.problem().review);
    this.lastSolved.set(this.problem().lastSolved);
  }

  toggleDone() {
    this.done.update((p) => !p);
    this.lastSolved.set(this.done() ? dayjs().format('YYYY-MM-DD') : '');
    this.emitUpdateEvent();
  }

  toggleReview() {
    this.review.update((p) => !p);
    this.emitUpdateEvent();
  }

  emitUpdateEvent() {
    this.updateSolutionEvent.emit({
      id: this.problem().id,
      review: this.review(),
      done: this.done(),
      lastSolved: this.lastSolved(),
    });
  }
}
