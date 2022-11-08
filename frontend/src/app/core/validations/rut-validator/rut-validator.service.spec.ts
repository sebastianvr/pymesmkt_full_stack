import { TestBed } from '@angular/core/testing';

import { RutValidatorService } from './rut-validator.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RutValidatorService', () => {
  let service: RutValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(RutValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
