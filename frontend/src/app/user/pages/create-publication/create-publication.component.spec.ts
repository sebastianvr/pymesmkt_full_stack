import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePublicationComponent } from './create-publication.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PrimeNgModule } from '../../../shared/modules/prime-ng/prime-ng.module';

describe('CreatePublicationComponent', () => {
  let component: CreatePublicationComponent;
  let fixture: ComponentFixture<CreatePublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePublicationComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        PrimeNgModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  
  it('PU Debe comprobar si la publicacion tiene garantia o no', () => {
    expect(component).toBeTruthy();
  });
  
  test('PU Debe calcular el precio total', () => {
    expect(component).toBeTruthy();
  });
  
  test('PU Debe validar formulario de creacion de publicacion', () => {
    expect(component).toBeTruthy();
  });
});
