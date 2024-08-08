import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProblemFormComponent } from './report-problem-form.component';

describe('ReportProblemFormComponent', () => {
  let component: ReportProblemFormComponent;
  let fixture: ComponentFixture<ReportProblemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportProblemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProblemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
