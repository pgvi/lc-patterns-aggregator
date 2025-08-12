import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitcher {
  private theme = signal<string>(localStorage.getItem('theme') ?? 'light');

  constructor() {
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  toggleTheme() {
    const newTheme = this.theme() == 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return newTheme;
  }

  getTheme() {
    return computed(() => this.theme());
  }
}
