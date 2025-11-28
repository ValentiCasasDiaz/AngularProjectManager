// theme.service.ts
// Servei per gestionar el tema Light/Dark amb persistència a localStorage
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'app-theme';

  constructor() {
    this.loadInitialTheme();
  }

  // Carrega el tema en iniciar l'app
  private loadInitialTheme(): void {
    const saved = localStorage.getItem(this.storageKey);
    const theme = saved ?? 'light';
    document.body.setAttribute('data-theme', theme);
  }

  // Canvia entre light i dark
  toggleTheme(): void {
    const current = document.body.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  // Aplica i guarda el tema
  setTheme(theme: 'light' | 'dark'): void {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
  }

  // Retorna el tema actual
  get currentTheme(): string {
    return document.body.getAttribute('data-theme') || 'light';
  }
}
