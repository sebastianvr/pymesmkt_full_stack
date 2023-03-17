import { TestBed } from '@angular/core/testing';

import { UsuarioService } from './usuario.service';
import { HttpClientModule } from '@angular/common/http';

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [
        HttpClientModule
      ]
    });
    service = TestBed.inject(UsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('PIO8.1 - Debe buscar todos los usuarios registrados', (done) => {
    

    service.getAllUsuarios().subscribe((data) => {
      expect('totalPages' in data && 'content' in data).toBeTruthy();
      expect(typeof data.totalPages).toBe('number')
      expect(Array.isArray(data.content)).toBe(true)
      
      done();
    })
  });
  
  test('PIO8.2 - Debe suspender a un usuario', (done) => {
    
    try {
      const id = 'asdasdasda'
      service.suspenderUsuario(id).subscribe((data) => {
        console.log('data', data);
        done();
      })
    } catch (error) {
      done(error);
    }
  });

  test('PIO8.3 - Debe eliminar un usuario', (done) => {
    
    const id = 'asdasdasda'

    service.suspenderUsuario(id).subscribe((data) => {
      console.log('data', data);
      done();
    })
  });
});
