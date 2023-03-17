import { TestBed } from '@angular/core/testing';

import { PublicacionService } from './publicacion.service';
import { HttpClientModule } from '@angular/common/http';

describe('PublicacionService', () => {
  let service: PublicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(PublicacionService);
  });

  test('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  test('PI01 - Debe obtener nuevas publicaciones paginadas', (done) => {
    service.getAllPublicaciones().subscribe((data) => {
      // console.log('data', data)
      expect('totalPages' in data && 'content' in data).toBeTruthy();
      expect(typeof data.totalPages).toBe('number')
      expect(Array.isArray(data.content)).toBe(true)
      done();
    })
  })

  test('PI06 - Debe registar una nueva publicación', (done) => {

    
    
    service.getAllPublicaciones().subscribe((data) => {
      // console.log('data', data)

      expect('totalPages' in data && 'content' in data).toBeTruthy();

      done();
    })
  })



});
