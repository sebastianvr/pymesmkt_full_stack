import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuspendedUsersComponent } from './view-suspended-users.component';

describe('ViewSuspendedUsersComponent', () => {
  let component: ViewSuspendedUsersComponent;
  let fixture: ComponentFixture<ViewSuspendedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSuspendedUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSuspendedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
