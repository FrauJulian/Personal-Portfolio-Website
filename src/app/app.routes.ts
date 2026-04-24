import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () =>
      (await import('./home/home.component')).HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'imprint',
    loadComponent: async () =>
      (await import('./imprint/imprint.component')).ImprintComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
