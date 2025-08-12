import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Filter } from '../types/types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patterns-filter',
  imports: [FormsModule],
  templateUrl: './patterns-filter.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternsFilter implements OnInit {
  patterns = input.required<string[]>();
  filter = input.required<Filter>();
  updatePatternEvent = output<string>();

  pattern = signal('');

  ngOnInit(): void {
    this.pattern.set(this.filter().pattern);
  }

  update(pattern: string) {
    this.pattern.set(pattern);
    this.updatePatternEvent.emit(pattern);
  }
}
