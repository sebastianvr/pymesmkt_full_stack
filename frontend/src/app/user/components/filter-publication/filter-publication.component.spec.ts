import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPublicationComponent } from './filter-publication.component';

describe('FilterPublicationComponent', () => {
  let component: FilterPublicationComponent;
  let fixture: ComponentFixture<FilterPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPublicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
