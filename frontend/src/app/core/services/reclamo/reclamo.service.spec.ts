import { TestBed } from '@angular/core/testing';

import { ReclamoService } from './reclamo.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

describe('ReclamoService', () => {
  let service: ReclamoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(ReclamoService);
  });

  test('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  test('PIO5 - Debe crear un nuevo reclamo', (done) => {
    
    const nuevoReclamo = {
      titulo: '',
      mensaje: '',
      documento: '',
      PublicacionId: '',
      // id del usuario que RECIBIRÁ el reclamo
      UsuarioId: '',
    }

    service.postReclamo(nuevoReclamo).subscribe((data) => {
      console.log('data', data);
      done();
    })
    expect(service).toBeTruthy();
    
  });
  
  test('PIO9.1 - Debe actualizar un reclamo', (done) => {
    
    const nuevoReclamo = {
      titulo: '',
      mensaje: '',
      documento: '',
      PublicacionId: '',
      // id del usuario que RECIBIRÁ el reclamo
      UsuarioId: '',
    }

    service.postReclamo(nuevoReclamo).subscribe((data) => {
      console.log('data', data);
      done();
    })
  });
  
  test('PIO9.2 - Debe buscar un reclamo', (done) => {
    
    const nuevoReclamo = {
      titulo: '',
      mensaje: '',
      documento: '',
      PublicacionId: '',
      // id del usuario que RECIBIRÁ el reclamo
      UsuarioId: '',
    }

    service.postReclamo(nuevoReclamo).subscribe((data) => {
      console.log('data', data);
      done();
    })
  });
  
  test('PIO9.2 - Debe eliminar un reclamo', (done) => {
    
    const nuevoReclamo = {
      titulo: '',
      mensaje: '',
      documento: '',
      PublicacionId: '',
      // id del usuario que RECIBIRÁ el reclamo
      UsuarioId: '',
    }

    service.postReclamo(nuevoReclamo).subscribe((data) => {
      console.log('data', data);
      done();
    })
  });



});
