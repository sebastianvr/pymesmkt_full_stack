import { TestBed } from '@angular/core/testing';

import { ReclamoService } from './reclamo.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReclamoService', () => {
  let service: ReclamoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ReclamoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
