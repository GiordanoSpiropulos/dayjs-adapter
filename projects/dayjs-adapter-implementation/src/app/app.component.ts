import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import dayjs, { Dayjs } from 'dayjs';
import { MatDayjsDateModule } from 'dayjs-adapter';

import 'dayjs/locale/nl';
import 'dayjs/locale/pt-br';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDayjsDateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dayjs-adapter-implementation';
  constructor(private dateAdapter: DateAdapter<Dayjs>) {
    dayjs.locale('en');
  }

  setLocale(locale: string) {
    this.dateAdapter.setLocale(locale);
  }
}
