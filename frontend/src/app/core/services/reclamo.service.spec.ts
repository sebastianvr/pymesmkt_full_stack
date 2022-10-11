import { TestBed } from '@angular/core/testing';
import { ReclamoService } from './reclamo.service';



describe('UsuariosService', () => {
  let service: ReclamoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReclamoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
