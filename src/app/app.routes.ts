import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((module) => module.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'imprint',
    loadComponent: () =>
      import('./imprint/imprint.component').then((module) => module.ImprintComponent),
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
