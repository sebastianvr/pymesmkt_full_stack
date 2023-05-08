import { TestBed } from '@angular/core/testing';

import { ClientGuard } from './client.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ValidarTokenGuard', () => {
  let guard: ClientGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });
    guard = TestBed.inject(ClientGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
