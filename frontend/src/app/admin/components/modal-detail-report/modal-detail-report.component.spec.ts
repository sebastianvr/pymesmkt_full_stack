import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailReportComponent } from './modal-detail-report.component';

describe('ModalDetailReportComponent', () => {
  let component: ModalDetailReportComponent;
  let fixture: ComponentFixture<ModalDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
