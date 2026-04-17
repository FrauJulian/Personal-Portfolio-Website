import { provideServerRendering } from '@angular/ssr';
import type { ApplicationConfig } from '@angular/core';
import { mergeApplicationConfig } from '@angular/core';

import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const config: ApplicationConfig = mergeApplicationConfig(appConfig, serverConfig);
