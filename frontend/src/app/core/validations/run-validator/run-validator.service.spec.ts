import { TestBed } from '@angular/core/testing';

import { RunValidatorService } from './run-validator.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RunValidatorService', () => {
  let service: RunValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(RunValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
