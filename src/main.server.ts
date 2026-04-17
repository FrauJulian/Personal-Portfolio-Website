import type { BootstrapContext } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';
import type { ApplicationRef } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap: (context: BootstrapContext) => Promise<ApplicationRef> = (
  context: BootstrapContext,
): Promise<ApplicationRef> =>
  bootstrapApplication(
    AppComponent,
    { ...config, providers: [provideZoneChangeDetection(), ...config.providers] },
    context,
  );

export default bootstrap;
