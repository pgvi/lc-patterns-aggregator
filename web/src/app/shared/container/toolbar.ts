import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ThemeSwitcher } from '../data-access/theme-switcher';
import { GithubIcon } from '../ui/github-icon';

@Component({
  selector: 'app-toolbar',
  imports: [GithubIcon],
  templateUrl: './toolbar.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  themeSwitcherService = inject(ThemeSwitcher);
  theme = this.themeSwitcherService.getTheme();
  isDark = computed(() => this.theme() == 'dark');

  toggleTheme() {
    this.themeSwitcherService.toggleTheme();
  }
}
