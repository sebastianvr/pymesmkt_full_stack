import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedReportsComponent } from './finished-reports.component';

describe('FinishedReportsComponent', () => {
  let component: FinishedReportsComponent;
  let fixture: ComponentFixture<FinishedReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
