import { TestBed } from '@angular/core/testing';

import { DayjsAdapterService } from './dayjs-adapter.service';

describe('DayjsAdapterService', () => {
  let service: DayjsAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayjsAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
