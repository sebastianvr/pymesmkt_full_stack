import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeePublicationsComponent } from './see-publications.component';

describe('SeePublicationsComponent', () => {
  let component: SeePublicationsComponent;
  let fixture: ComponentFixture<SeePublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeePublicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeePublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
