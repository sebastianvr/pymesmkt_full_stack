import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutValidatorService } from '../../../core/validations/rut-validator/rut-validator.service';
import { RunValidatorService } from '../../../core/validations/run-validator/run-validator.service';
import { PassValidatorService } from '../../../core/validations/pass-validator/pass-validator.service';
import { EmailValidatorService } from '../../../core/validations/email-validator/email-validator.service';
import { RegionesComunasService } from '../../../core/services/regiones-comunas/regiones-comunas.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  regionesEmpresa: any;
  regionesPropietario: any;

  comunasEmpresa: any;
  comunasPropietario: any;

  step: number = 1;
  bar: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private messageService: MessageService,
    private runValidator: RunValidatorService,
    private rutValidator: RutValidatorService,
    private passValidator: PassValidatorService,
    private emailValidator: EmailValidatorService,
    private regionesComunas: RegionesComunasService,
    private authService: AuthService

  ) {

    // Obtiene del servicio de regionesComunas las regiones al iniciar el componente
    this.regionesEmpresa = this.regionesComunas.getRegiones()
    this.regionesPropietario = this.regionesComunas.getRegiones()

    // Reseteo el formulario para evitar llevar desde el cliente
    this.formulario.reset({

      infoPropietario: {
        nombre: 'Sebastian',
        apellidos: 'Vidal',
        run: '12.321.233-1',
        correoPropietario: 'sebastian.vi@gmail.com',
        contrasenia: '123.123',
        contrasenia2: '123.123'
      },
      infoLocalidadPropietario: {
        opRegion: 'Antofagasta',
        opCommune: 'Mejillones',
        direccionPropietario: 'Av. Lorem ipsum #123',
        direccionPropietario2: '',
        descripcion: 'Cerca de la plaza, Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, nostrum.',
      },

      infoEmpresa: {
        nombreEmpresa: 'El Molino ',
        rut: '123.321.324-1',
        tipoEmpresa: 'Empresa comercial',
        rubro: 'Panadería, Pastelería',
      },

      infoLocalidadEmpresa: {
        usarDireccionPersonal: true,
        regionEmpresa: '',
        communeEmpresa: '',
        direccionEmpresa: '',
        descripcionEmpresa: '',
      },

      terminosYCondiciones: true
    });
  }

  getPercent() {
    return `${this.bar}%`
  }

  ngOnInit(): void {
  }

  formulario: FormGroup = this.fb.group({

    infoPropietario: this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required]],
      run: ['', [Validators.required], [this.runValidator]],
      correoPropietario: ['', [Validators.required, Validators.pattern(this.emailPattern)], [this.emailValidator]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      contrasenia2: ['', [Validators.required]],
    }),

    infoLocalidadPropietario: this.fb.group({
      opRegion: ['', [Validators.required]],
      opCommune: ['', [Validators.required]],
      direccionPropietario: ['', [Validators.required]],
      direccionPropietario2: [''],
      descripcion: [''],
    }),

    infoEmpresa: this.fb.group({
      nombreEmpresa: ['', [Validators.required]],
      rut: ['', [Validators.required], [this.rutValidator]],
      tipoEmpresa: ['', [Validators.required]],
      rubro: ['', [Validators.required]],
    }),

    infoLocalidadEmpresa: this.fb.group({
      usarDireccionPersonal: [false, []],
      regionEmpresa: ['', [Validators.required]],
      communeEmpresa: ['', [Validators.required]],
      direccionEmpresa: ['', [Validators.required]],
      descripcionEmpresa: ['', []],
    }),

    terminosYCondiciones: [false, [Validators.requiredTrue]],
  }, {
    validators: [
      this.passValidator.contraseñasIguales('contrasenia', 'contrasenia2'),
    ]
  })

  onSelectedRegionPropietario(campo: string, formulario: string = '') {
    //  Obtener region seleccionada
    const opSelected = this.formulario.get(formulario)?.get(campo)?.value;

    if (opSelected) {
      this.comunasPropietario = this.regionesComunas.getComunas(opSelected)
      return
    }

    // limpio comuna, cuando cambio de region 
    this.formulario.get(formulario)?.patchValue({ opCommune: '' })
  }

  onSelectedRegionEmpresa(campo: string, formulario: string = '') {
    //  Obtener region seleccionada
    const opSelected = this.formulario.get(formulario)?.get(campo)?.value;
    this.comunasEmpresa = this.regionesComunas.getComunas(opSelected)

    // limpio comuna, cuando cambio de region 
    this.formulario.get(formulario)?.patchValue({ communeEmpresa: '' })
  }

  campoInvalido(campo: string, formulario: string = '') {
    return this.formulario.get(formulario)?.get(campo)?.errors
      && this.formulario.get(formulario)?.get(campo)?.touched
  }

  aceptarTerminosYCondiciones(campo: string) {
    return this.formulario.get(campo)?.errors
      && this.formulario.get(campo)?.touched
  }

  copiarCampos() {

    const copiar = this.formulario.get('infoLocalidadEmpresa')?.get('usarDireccionPersonal')?.value;

    // TODO: VER PORQUE LA COMUNA DE LA EMPRESA NO SETEA BIEN AL ACTUALIZAR
    // problemas al copiar campos revisar!!
    // console.log(this.formulario.get('infoLocalidadPropietario')?.get('opCommune')?.value)
    if (!copiar) {
      // this.formulario.get('infoLocalidadEmpresa')?.get('usarDireccionPersonal')?.patchValue({usarDireccionPersonal : false});
      this.formulario.get('infoLocalidadEmpresa')?.patchValue({
        regionEmpresa: this.formulario.get('infoLocalidadPropietario')?.get('opRegion')?.value
      });

      this.formulario.get('infoLocalidadEmpresa')?.patchValue({
        communeEmpresa: this.formulario.get('infoLocalidadPropietario')?.get('opCommune')?.value
      });

      this.formulario.get('infoLocalidadEmpresa')?.patchValue({
        direccionEmpresa: this.formulario.get('infoLocalidadPropietario')?.get('direccionPropietario')?.value
      })

      this.formulario.get('infoLocalidadEmpresa')?.patchValue({
        descripcionEmpresa: this.formulario.get('infoLocalidadPropietario')?.get('descripcion')?.value
      })
      return
    } else {
      // this.formulario.get('infoLocalidadEmpresa')?.get('usarDireccionPersonal')?.patchValue({usarDireccionPersonal : true});
      this.formulario.get('infoLocalidadEmpresa')?.reset()
      // this.formulario.get('infoLocalidadEmpresa')?.patchValue({
      //   regionEmpresa: '',
      //   communeEmpresa: '',
      //   direccionEmpresa: '',
      //   descripcionEmpresa: '',
      //   usarDireccionPersonal : false
      // })
    }
  }

  showSuccess(summary: string, detail: string) {
    // this.messageService.add({ severity: 'success', summary: summary, detail: detail });
  }

  previous() {
    this.step = this.step - 1
    this.bar = this.bar - 25

    // if(this.step == 1){
    //   this.bar = 0
    //   return
    // }

  }

  next() {
    if (this.step == 1 && this.formulario.get('infoPropietario')?.invalid) {
      this.formulario.get('infoPropietario')?.markAllAsTouched()
      return
    }

    if (this.step == 2 && this.formulario.get('infoLocalidadPropietario')?.invalid) {
      this.formulario.get('infoLocalidadPropietario')?.markAllAsTouched()
      return
    }

    if (this.step == 3 && this.formulario.get('infoEmpresa')?.invalid) {
      this.formulario.get('infoEmpresa')?.markAllAsTouched()
      return
    }

    this.step = this.step + 1
    this.bar = this.bar + 25
  }

  enviarFormulario() {

    if (this.step == 4
      && this.formulario.get('infoLocalidadEmpresa')?.invalid
      || this.formulario.get('terminosYCondiciones')?.invalid
    ) {
      this.formulario.get('infoLocalidadEmpresa')?.markAllAsTouched()
      this.formulario.get('terminosYCondiciones')?.markAsTouched()
      return
    }

    this.bar = this.bar + 25

    const nuevoUsuario = {
      nombreUsuario:
        this.formulario.get('infoPropietario')?.get('nombre')?.value,
      apellidos:
        this.formulario.get('infoPropietario')?.get('apellidos')?.value,
      run:
        this.formulario.get('infoPropietario')?.get('run')?.value,
      emailUsuario:
        this.formulario.get('infoPropietario')?.get('correoPropietario')?.value,
      contrasenia:
        this.formulario.get('infoPropietario')?.get('contrasenia')?.value,
      region:
        this.formulario.get('infoLocalidadPropietario')?.get('opRegion')?.value,
      comuna:
        this.formulario.get('infoLocalidadPropietario')?.get('opCommune')?.value,
      dir1Propietario:
        this.formulario.get('infoLocalidadPropietario')?.get('direccionPropietario')?.value,
      dir2Propietario:
        this.formulario.get('infoLocalidadPropietario')?.get('direccionPropietario2')?.value,
      descripcion:
        this.formulario.get('infoLocalidadPropietario')?.get('descripcion')?.value,
      nombrePyme:
        this.formulario.get('infoEmpresa')?.get('nombreEmpresa')?.value,
      rut:
        this.formulario.get('infoEmpresa')?.get('rut')?.value,
      rubro:
        this.formulario.get('infoEmpresa')?.get('rubro')?.value,
      tipoEmpresa:
        this.formulario.get('infoEmpresa')?.get('tipoEmpresa')?.value,
      regionEmpresa:
        this.formulario.get('infoLocalidadEmpresa')?.get('regionEmpresa')?.value,
      comunaEmpresa:
        this.formulario.get('infoLocalidadEmpresa')?.get('communeEmpresa')?.value,
      dirEmpresa:
        this.formulario.get('infoLocalidadEmpresa')?.get('direccionEmpresa')?.value,
      descripcionEmpresa:
        this.formulario.get('infoLocalidadEmpresa')?.get('descripcionEmpresa')?.value,
    }

    console.log(nuevoUsuario)

    this.authService.registerUser(nuevoUsuario).subscribe(ok => {

      if (ok === true) {
         Swal.fire({
          // position: 'top-start',
          icon: 'success',
          title: 'Nuevo usuario creado',
          showConfirmButton: false,
          timer: 1500,
        })
        
        this.router.navigate(['/visitor/login'])
      
        
      } else {
        // mostrar mensaje de error
        
      }
    })

  }
}
