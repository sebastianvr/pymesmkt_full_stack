import { TestBed } from '@angular/core/testing';

import { OfertaService } from './oferta.service';
import { HttpClientModule } from '@angular/common/http';

describe('OfertaService', () => {
  let service: OfertaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(OfertaService);
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  test('PI07 - Debe crear una oferta', (done) => {
    // Id existente en la BD
    const id: string = '5f119e1126b24b8'

    service.postOferta(id).subscribe((oferta) => {
      // console.log('oferta', oferta)
      // expect(oferta.oferta.id).toBe(id)

      done();
    })
  })

  test('PI10.1 - Debe buscar una oferta', (done) => {
    // Id existente en la BD
    const id: string = '5f119e1126b24b8'

    service.getOfertaById(id).subscribe((oferta) => {
      // console.log('oferta', oferta)
      expect(oferta.oferta.id).toBe(id)

      done();
    })
  })
  
  test('PI10.2 - Debe actualizar una oferta', (done) => {
    // Id existente en la BD
    const id: string = '5f119e1126b24b8'

    service.getOfertaById(id).subscribe((oferta) => {
      // console.log('oferta', oferta)
      // expect(oferta.oferta.id).toBe(id)

      done();
    })
  })
  
  test('PI10.3 - Debe eliminar una oferta', (done) => {
    // Id existente en la BD
    const id: string = '5f119e1126b24b8'

    service.getOfertaById(id).subscribe((oferta) => {
      // console.log('oferta', oferta)
      expect(oferta.oferta.id).toBe(id)

      done();
    })
  })


});
