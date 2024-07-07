import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayjsAdapterComponent } from './dayjs-adapter.component';

describe('DayjsAdapterComponent', () => {
  let component: DayjsAdapterComponent;
  let fixture: ComponentFixture<DayjsAdapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayjsAdapterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayjsAdapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
