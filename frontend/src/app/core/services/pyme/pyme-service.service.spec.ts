import { TestBed } from '@angular/core/testing';

import { PymeServiceService } from './pyme-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PymeServiceService', () => {
  let service: PymeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(PymeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
