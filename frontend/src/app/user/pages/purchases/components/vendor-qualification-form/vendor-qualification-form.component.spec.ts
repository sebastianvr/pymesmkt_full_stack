import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQualificationFormComponent } from './vendor-qualification-form.component';

describe('VendorQualificationFormComponent', () => {
  let component: VendorQualificationFormComponent;
  let fixture: ComponentFixture<VendorQualificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorQualificationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQualificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
