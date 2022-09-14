import { TestBed } from '@angular/core/testing';

import { RegionesComunasService } from './regiones-comunas.service';

describe('RegionesComunasService', () => {
  let service: RegionesComunasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionesComunasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
