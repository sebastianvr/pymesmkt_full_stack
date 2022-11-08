import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReportComponent } from './new-report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('NewReportComponent', () => {
  let component: NewReportComponent;
  let fixture: ComponentFixture<NewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewReportComponent ],
      imports : [
        HttpClientTestingModule,
        NgbModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
