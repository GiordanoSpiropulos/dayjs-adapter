import { Inject, InjectionToken, Optional } from '@angular/core';
import { DayJSDateAdapterOptions, NameStyle } from './dayjs-adapter.types';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { range } from './dayjs-adapter.utils';

import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

export function DAYJS_DATE_ADAPTER_OPTIONS_FACTORY(): DayJSDateAdapterOptions {
  return {
    useUtc: false,
    displayFormat: 'MM/DD/YYYY',
  };
}

export const DAYJS_DATE_ADAPTER_OPTIONS =
  new InjectionToken<DayJSDateAdapterOptions>(
    'MAT_DAYJS_DATE_ADAPTER_OPTIONS',
    {
      providedIn: 'root',
      factory: DAYJS_DATE_ADAPTER_OPTIONS_FACTORY,
    }
  );

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
    @Optional() @Inject(MAT_DATE_LOCALE) public dateLocale: string,
    @Optional()
    @Inject(DAYJS_DATE_ADAPTER_OPTIONS)
    private _options: DayJSDateAdapterOptions = {}
  ) {
    super();
    this.initializeDayJSPlugins();
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
    super.setLocale(locale);
    const dayJSLocaleData = this.utcDayjs().localeData();
    this._localeData = {
      firstDayOfWeek: dayJSLocaleData.firstDayOfWeek(),
      longMonths: dayJSLocaleData.months(),
      shortMonths: dayJSLocaleData.monthsShort(),
      narrowMonths: this.getNarrowMonthNames(dayJSLocaleData),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: range(7, (i) =>
        this.utcDayjs().set('day', i).format('dddd')
      ),
      shortDaysOfWeek: dayJSLocaleData.weekdaysShort(),
      narrowDaysOfWeek: dayJSLocaleData.weekdaysMin(),
    };
  }
  override getYear(date: Dayjs): number {
    return this.utcDayjs(date).year();
  }
  override getMonth(date: Dayjs): number {
    return this.utcDayjs(date).month();
  }
  override getDate(date: Dayjs): number {
    return this.utcDayjs(date).date();
  }
  override getDayOfWeek(date: Dayjs): number {
    return this.utcDayjs(date).day();
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
    return this.utcDayjs(date).format('YYYY');
  }
  override getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }
  override getNumDaysInMonth(date: Dayjs): number {
    return this.utcDayjs(date).daysInMonth();
  }
  override clone(date: Dayjs): Dayjs {
    return this.utcDayjs(date).clone();
  }
  override createDate(year: number, month: number, date: number): Dayjs {
    return this.utcDayjs()
      .set('year', year)
      .set('month', month)
      .set('date', date);
  }
  override today(): Dayjs {
    return this.utcDayjs();
  }
  override parse(value: any, parseFormat: any): Dayjs | null {
    if (value && typeof value === 'string') {
      return this.utcDayjs(
        value,
        this.utcDayjs().localeData().longDateFormat(parseFormat),
        this.locale
      );
    }
    return value ? this.utcDayjs(value).locale(this.locale) : null;
  }
  override format(date: Dayjs, displayFormat: any): string {
    if (!this.isValid(date)) {
      throw Error('DayjsDateAdapter: Cannot format invalid date.');
    }
    const localeData = this.utcDayjs().localeData();
    const format = localeData.longDateFormat('L');
    return this.utcDayjs(date).format(format);
  }

  override addCalendarYears(date: Dayjs, years: number): Dayjs {
    return this.utcDayjs(date).add(years, 'year');
  }

  override addCalendarMonths(date: Dayjs, months: number): Dayjs {
    return this.utcDayjs(date).add(months, 'month');
  }

  override addCalendarDays(date: Dayjs, days: number): Dayjs {
    return this.utcDayjs(date).add(days, 'day');
  }

  override toIso8601(date: Dayjs): string {
    return this.utcDayjs(date).toISOString();
  }

  override isDateInstance(obj: any): boolean {
    return dayjs.isDayjs(obj);
  }

  override isValid(date: Dayjs): boolean {
    return this.utcDayjs(date).isValid();
  }

  override invalid(): Dayjs {
    return this.utcDayjs(null);
  }

  private get shouldUseUtc(): boolean {
    return this._options?.useUtc ?? false;
  }

  private get utcDayjs(): (
    config?: string | number | Dayjs | Date | null | undefined,
    format?: string | undefined,
    strict?: boolean | undefined
  ) => Dayjs {
    return this.shouldUseUtc ? dayjs.utc.bind(dayjs) : dayjs.bind(dayjs);
  }
}
