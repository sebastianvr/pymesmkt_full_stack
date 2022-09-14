import { TestBed } from '@angular/core/testing';

import { PassValidatorService } from './pass-validator.service';

describe('PassValidatorService', () => {
  let service: PassValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
