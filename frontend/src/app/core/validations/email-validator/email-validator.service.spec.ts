import { TestBed } from '@angular/core/testing';

import { EmailValidatorService } from './email-validator.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmailValidatorService', () => {
  let service: EmailValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(EmailValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
