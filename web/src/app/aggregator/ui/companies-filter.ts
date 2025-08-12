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
  selector: 'app-companies-filter',
  imports: [FormsModule],
  templateUrl: './companies-filter.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesFilter implements OnInit {
  companies = input.required<string[]>();
  filter = input.required<Filter>();
  updateCompanyEvent = output<string>();

  company = signal('');

  ngOnInit(): void {
    this.company.set(this.filter().company);
  }

  update(company: string) {
    this.company.set(company);
    this.updateCompanyEvent.emit(company);
  }
}
