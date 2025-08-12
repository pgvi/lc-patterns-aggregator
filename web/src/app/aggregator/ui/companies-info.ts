import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Company, Frequency } from '../types/types';
import { InfoIcon } from '../../shared/ui/info-icon';

@Component({
  selector: 'app-companies-info',
  imports: [InfoIcon],
  templateUrl: './companies-info.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesInfo {
  companies = input.required<Company[]>();
  companiesParsed = computed(() => {
    return this.companies().map((c) => {
      return {
        ...c,
        frequency: c.frequency.map(this.mapFrequency),
      };
    });
  });

  mapFrequency(f: Frequency) {
    switch (f) {
      case 'all':
        return 'All';
      case 'moreThan180days':
        return 'More than 6 months';
      case 'last180days':
        return 'Last 6 months';
      case 'last90days':
        return 'Last 3 months';
      case 'last30days':
        return 'Last month';
    }
  }
}
