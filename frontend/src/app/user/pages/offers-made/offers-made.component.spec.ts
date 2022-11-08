import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersMadeComponent } from './offers-made.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OffersMadeComponent', () => {
  let component: OffersMadeComponent;
  let fixture: ComponentFixture<OffersMadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OffersMadeComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersMadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
