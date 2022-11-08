import { TestBed } from '@angular/core/testing';

import { PublicacionService } from './publicacion.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PublicacionService', () => {
  let service: PublicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(PublicacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
