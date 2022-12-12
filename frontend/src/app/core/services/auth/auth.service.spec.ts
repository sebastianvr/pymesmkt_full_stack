import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('Debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  test('PI04 - Debe registrar un nuevo usuario', (done) => {
    const mockNewUser: any =  {
      nombreUsuario: "Alan",
      apellidos: "Vidal Ramirez",
      run: "13.234.567-34",
      emailUsuario: "sebaea@mail.com",
      contrasenia: "1234.asd",
      region: "Valparaiso",
      comuna: "San Antonio",
      dir1Propietario: "Alfonso XIII #738, Cerro Alegre",
      dir2Propietario: null,
      descripcion: "Cerca de la esquina de la plaza principal"
  }
    service.registerUser(mockNewUser).subscribe((data) => {
      console.log(data)

      done();
    });
  });

  test('PI02 - Debe iniciar sesión', (done) => {
    const mockLogIn = {
      email: "",
      contrasenia: "",
    }
    service.login(mockLogIn).subscribe((data) => {
      console.log(data)

      done();
    })
  });

});
