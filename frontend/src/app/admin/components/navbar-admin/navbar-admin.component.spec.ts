import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAdminComponent } from './navbar-admin.component';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';

describe('NavbarAdminComponent', () => {
  let component: NavbarAdminComponent;
  let fixture: ComponentFixture<NavbarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        NavbarAdminComponent,
        SidebarAdminComponent
       ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
