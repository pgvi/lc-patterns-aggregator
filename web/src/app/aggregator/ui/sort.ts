import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  Filter,
  FilterUpdate,
  SortDirection,
  SortOption,
} from '../types/types';
import { FormsModule } from '@angular/forms';
import { AscIcon } from '../../shared/ui/asc-icon';
import { DescIcon } from '../../shared/ui/desc-icon';

@Component({
  selector: 'app-sort',
  imports: [FormsModule, AscIcon, DescIcon],
  templateUrl: './sort.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sort implements OnInit {
  readonly options = Object.values(SortOption);
  readonly direction = SortDirection;
  filter = input.required<Filter>();
  updateSortEvent = output<FilterUpdate>();

  sortOption = signal(SortOption.DIFFICULTY);
  sortDirection = signal(SortDirection.ASC);

  ngOnInit(): void {
    this.sortDirection.set(this.filter().sortDirection);
    this.sortOption.set(this.filter().sortOption);
  }

  updateOption(option: SortOption) {
    this.updateSortEvent.emit({
      ...this.filter(),
      sortOption: option,
      updatePage: true,
    });
    this.sortOption.set(option);
  }

  toggleDirection() {
    const dir =
      this.sortDirection() == SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;
    this.updateSortEvent.emit({
      ...this.filter(),
      sortDirection: dir,
      updatePage: true,
    });
    this.sortDirection.set(dir);
  }
}
