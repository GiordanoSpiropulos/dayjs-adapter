import { Inject, InjectionToken, Optional } from '@angular/core';
import { DayJSDateAdapterOptions, NameStyle } from './dayjs-adapter.types';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { range } from './dayjs-adapter.utils';

import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/en';

export function DAYJS_DATE_ADAPTER_OPTIONS_FACTORY(): DayJSDateAdapterOptions {
  return {
    useUtc: false,
  };
}

export const DAYJS_DATE_ADAPTER_OPTIONS =
  new InjectionToken<DayJSDateAdapterOptions>('DAYJS_DATE_ADAPTER_OPTIONS', {
    providedIn: 'root',
    factory: DAYJS_DATE_ADAPTER_OPTIONS_FACTORY,
  });

export class DayJSDateAdapter extends DateAdapter<Dayjs> {
  private _localeData!: {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    narrowMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
  };

  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) public dateLocale: string = 'en',
    @Optional()
    @Inject(DAYJS_DATE_ADAPTER_OPTIONS)
    private _options: DayJSDateAdapterOptions
  ) {
    super();
    this.initializeDayJSPlugins();
    this.setLocale(dateLocale);
  }

  private initializeDayJSPlugins() {
    if (this.shouldUseUtc) dayjs.extend(utc);
    dayjs.extend(localeData);
    dayjs.extend(LocalizedFormat);
    dayjs.extend(customParseFormat);
  }

  private getNarrowMonthNames(localeInstance: dayjs.InstanceLocaleDataReturn) {
    const months = localeInstance.months();
    return months.map((month) => {
      return month.substring(0, 1);
    });
  }

  override setLocale(locale: string) {
    if (!locale)
      throw Error(
        'DayJSDateAdapter: A locale is necessary for DayJSDateAdapter inicialization.'
      );

    dayjs.locale(locale);
    super.setLocale(locale);
    const dayJSLocaleData = this.customDayjs().localeData();
    this._localeData = {
      firstDayOfWeek: dayJSLocaleData.firstDayOfWeek(),
      longMonths: dayJSLocaleData.months(),
      shortMonths: dayJSLocaleData.monthsShort(),
      narrowMonths: this.getNarrowMonthNames(dayJSLocaleData),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: range(7, (i) =>
        this.customDayjs().set('day', i).format('dddd')
      ),
      shortDaysOfWeek: dayJSLocaleData.weekdaysShort(),
      narrowDaysOfWeek: dayJSLocaleData.weekdaysMin(),
    };
  }
  override getYear(date: Dayjs): number {
    return this.customDayjs(date).year();
  }
  override getMonth(date: Dayjs): number {
    return this.customDayjs(date).month();
  }
  override getDate(date: Dayjs): number {
    return this.customDayjs(date).date();
  }
  override getDayOfWeek(date: Dayjs): number {
    return this.customDayjs(date).day();
  }
  override getMonthNames(style: NameStyle): string[] {
    if (style == 'short') return this._localeData.shortMonths;
    if (style == 'long') return this._localeData.longMonths;
    return this._localeData.narrowMonths;
  }
  override getDateNames(): string[] {
    return this._localeData.dates;
  }
  override getDayOfWeekNames(style: NameStyle): string[] {
    if (style === 'long') {
      return this._localeData.longDaysOfWeek;
    }
    if (style === 'short') {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }
  override getYearName(date: Dayjs): string {
    return this.customDayjs(date).format('YYYY');
  }
  override getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }
  override getNumDaysInMonth(date: Dayjs): number {
    return this.customDayjs(date).daysInMonth();
  }
  override clone(date: Dayjs): Dayjs {
    return this.customDayjs(date).clone();
  }
  override createDate(year: number, month: number, date: number): Dayjs {
    return this.customDayjs()
      .set('year', year)
      .set('month', month)
      .set('date', date);
  }
  override today(): Dayjs {
    return this.customDayjs();
  }
  override parse(value: any, parseFormat: any): Dayjs | null {
    if (value && typeof value === 'string') {
      return this.customDayjs(
        value,
        this.customDayjs().localeData().longDateFormat(parseFormat),
        this.locale
      );
    }
    return value ? this.customDayjs(value).locale(this.locale) : null;
  }
  override format(date: Dayjs, _: any): string {
    if (!this.isValid(date)) {
      throw Error('DayjsDateAdapter: Cannot format invalid date.');
    }
    const localeData = this.customDayjs().localeData();
    const format = localeData.longDateFormat('L');
    return this.customDayjs(date).format(format);
  }

  override addCalendarYears(date: Dayjs, years: number): Dayjs {
    return this.customDayjs(date).add(years, 'year');
  }

  override addCalendarMonths(date: Dayjs, months: number): Dayjs {
    return this.customDayjs(date).add(months, 'month');
  }

  override addCalendarDays(date: Dayjs, days: number): Dayjs {
    return this.customDayjs(date).add(days, 'day');
  }

  override toIso8601(date: Dayjs): string {
    return this.customDayjs(date).toISOString();
  }

  override isDateInstance(obj: any): boolean {
    return dayjs.isDayjs(obj);
  }

  override isValid(date: Dayjs): boolean {
    return this.customDayjs(date).isValid();
  }

  override invalid(): Dayjs {
    return this.customDayjs(null);
  }

  override deserialize(value: any): Dayjs | null {
    let date: any;
    if (value instanceof Date) {
      date = this.customDayjs(value);
    } else if (this.isDateInstance(value)) {
      // NOTE: assumes that cloning also sets the correct locale.
      return this.clone(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = this.customDayjs(value).toISOString();
    }
    if (date && this.isValid(date)) {
      return this.customDayjs(date); // NOTE: Is this necessary since Dayjs is immutable and Moment was not?
    }
    return super.deserialize(value);
  }

  private get shouldUseUtc(): boolean {
    return this._options?.useUtc ?? false;
  }

  private customDayjs(
    input?: string | number | Date | Dayjs | null,
    format?: string,
    locale?: string
  ): Dayjs {
    if (!this.shouldUseUtc) {
      return this.createDayjs(input, format, locale);
    }
    return this.createUtcDayjs(input, format, locale);
  }

  private createDayjs(
    input?: string | number | Date | Dayjs | null,
    format?: string,
    locale?: string
  ): Dayjs {
    return dayjs(input, { format, locale }, locale);
  }

  private createUtcDayjs(
    input?: string | number | Date | Dayjs | null,
    format?: string,
    locale?: string
  ): Dayjs {
    return dayjs(input, { format, locale, utc: true }, locale).utc();
  }
}
