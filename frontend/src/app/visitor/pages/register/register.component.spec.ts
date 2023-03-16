import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports : [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('PU Debe retornar una cadena de caracteres', () => {
    component.bar = 20;
    expect(typeof component.getPercent()).toBe('string')
  })
  
  test('Debe retornar un porcentaje', () => {
    component.bar = 20;
    expect(component.getPercent()).toContain('%')
  })


  test('PU Debe validar formulario de registro', () => {
    component.bar = 20;
    
  })

});
