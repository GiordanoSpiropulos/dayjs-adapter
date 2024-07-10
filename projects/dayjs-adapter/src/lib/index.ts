import { NgModule } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import { DAYJS_DATE_FORMATS } from './dayjs-date-formats';
import { DAYJS_DATE_ADAPTER_OPTIONS, DayJSDateAdapter } from './dayjs-adapter';

@NgModule({
  providers: [
    {
      provide: DateAdapter,
      useClass: DayJSDateAdapter,
      deps: [MAT_DATE_LOCALE, DAYJS_DATE_ADAPTER_OPTIONS],
    },
  ],
})
export class DayjsDateModule {}

@NgModule({
  imports: [DayjsDateModule],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DAYJS_DATE_FORMATS }],
})
export class MatDayjsDateModule {}
