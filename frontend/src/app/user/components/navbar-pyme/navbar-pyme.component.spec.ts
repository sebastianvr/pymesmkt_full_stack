import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPymeComponent } from './navbar-pyme.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SidebarUserComponent } from '../sidebar-user/sidebar-user.component';

describe('NavbarPymeComponent', () => {
  let component: NavbarPymeComponent;
  let fixture: ComponentFixture<NavbarPymeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NavbarPymeComponent,
        SidebarUserComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarPymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
