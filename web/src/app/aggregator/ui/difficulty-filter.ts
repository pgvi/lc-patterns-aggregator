import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Difficulty, Filter } from '../types/types';

@Component({
  selector: 'app-difficulty-filter',
  imports: [],
  templateUrl: './difficulty-filter.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifficultyFilter implements OnInit {
  filter = input.required<Filter>();
  difficulty = signal<Set<Difficulty>>(new Set(['Easy', 'Medium', 'Hard']));
  updateDifficultyEvent = output<Difficulty[]>();

  ngOnInit(): void {
    this.difficulty.set(new Set(this.filter().difficulty));
  }

  update(d: Difficulty) {
    const selected = this.difficulty();
    if (selected.has(d)) selected.delete(d);
    else selected.add(d);

    this.difficulty.set(selected);
    this.updateDifficultyEvent.emit(Array.from(selected));
  }
}
