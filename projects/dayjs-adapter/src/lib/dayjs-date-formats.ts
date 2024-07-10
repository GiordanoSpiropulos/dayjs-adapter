import { MatDateFormats } from '@angular/material/core';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(localeData);
dayjs.extend(LocalizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
/**
 * Custom Date-Formats and Adapter (using https://github.com/iamkun/dayjs)
 */
export const DAYJS_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ({ dateLocale }: { dateLocale: string }) => {
      dayjs.locale(dateLocale);
      console.log(dateLocale, 'No format');
      const dayJsLocaleData = dayjs.localeData();
      const format = dayJsLocaleData.longDateFormat('L');
      return format;
    },
  },
  display: {
    dateInput: ({ dateLocale }: { dateLocale: string }) => {
      dayjs.locale(dateLocale);
      console.log(dateLocale, 'No format');

      const dayJsLocaleData = dayjs.localeData();
      const format = dayJsLocaleData.longDateFormat('L');
      return format;
    },
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export default DAYJS_DATE_FORMATS;
