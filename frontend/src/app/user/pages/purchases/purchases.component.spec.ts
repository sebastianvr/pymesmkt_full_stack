import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesComponent } from './purchases.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { NgModule } from '@angular/core';

describe('PurchasesComponent', () => {
  let component: PurchasesComponent;
  let fixture: ComponentFixture<PurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        PurchasesComponent,
      ],
      imports : [
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers : [
        MessageService,
        NgModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('Debe crear componente', () => {
    expect(component).toBeTruthy();
  });
  
  test('PU Debe validar formulario de reclamo', () => {
    expect(component).toBeTruthy();
  });
  
  test('PU Debe validar formulario de calificación', () => {
    expect(component).toBeTruthy();
  });
});
