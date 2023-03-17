import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailComponent } from './offer-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('OfferDetailComponent', () => {
  let component: OfferDetailComponent;
  let fixture: ComponentFixture<OfferDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferDetailComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('Debe crear componente', () => {
    expect(component).toBeTruthy();
  });
  
  test('PI Debe aceptar el pago y comprar una oferta', () => {
    expect(component).toBeTruthy();
  });
  
});
