import { TestBed } from '@angular/core/testing';

import { CompraService } from './compra.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CompraService', () => {
  let service: CompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
