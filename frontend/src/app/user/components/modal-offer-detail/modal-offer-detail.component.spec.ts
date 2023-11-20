import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOfferDetailComponent } from './modal-offer-detail.component';

describe('ModalOfferDetailComponent', () => {
  let component: ModalOfferDetailComponent;
  let fixture: ComponentFixture<ModalOfferDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOfferDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOfferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
