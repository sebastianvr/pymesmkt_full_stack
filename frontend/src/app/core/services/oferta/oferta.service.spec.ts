import { TestBed } from '@angular/core/testing';

import { OfertaService } from './oferta.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OfertaService', () => {
  let service: OfertaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(OfertaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
