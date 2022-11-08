import { TestBed } from '@angular/core/testing';

import { ValidarTokenGuard } from './validar-token.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ValidarTokenGuard', () => {
  let guard: ValidarTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });
    guard = TestBed.inject(ValidarTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
