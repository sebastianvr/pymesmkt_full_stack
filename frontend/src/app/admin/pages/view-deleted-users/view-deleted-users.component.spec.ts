import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeletedUsersComponent } from './view-deleted-users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewDeletedUsersComponent', () => {
  let component: ViewDeletedUsersComponent;
  let fixture: ComponentFixture<ViewDeletedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeletedUsersComponent ],
      imports : [
        HttpClientTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeletedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
