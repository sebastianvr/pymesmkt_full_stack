import { TestBed } from '@angular/core/testing';

import { RunValidatorService } from './run-validator.service';

describe('RunValidatorService', () => {
  let service: RunValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RunValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
