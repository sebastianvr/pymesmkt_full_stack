import { TestBed } from '@angular/core/testing';

import { PymeServiceService } from './pyme-service.service';

describe('PymeServiceService', () => {
  let service: PymeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PymeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
