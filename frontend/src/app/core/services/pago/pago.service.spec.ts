import { TestBed } from '@angular/core/testing';

import { PagoService } from './pago.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PagoService', () => {
  let service: PagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(PagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
