import { TestBed } from '@angular/core/testing';

import { RutValidatorService } from './rut-validator.service';

describe('RutValidatorService', () => {
  let service: RutValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
