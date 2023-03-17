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

  test('Debe mostrar todas las regiones', () => {
    expect(Array.isArray(service.getRegiones())).toBe(true)
    // console.log(service.getRegiones()) 
    // expect(service.getRegiones()).toHaveLength(16);
    // expect(service.getRegiones())
  });
});
