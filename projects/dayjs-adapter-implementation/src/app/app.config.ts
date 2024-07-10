import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DAYJS_DATE_ADAPTER_OPTIONS } from 'dayjs-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    { provide: DAYJS_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    //You can inject any language
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en',
    },
  ],
};
