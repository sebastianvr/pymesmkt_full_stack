import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, concatMap, of } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/core/services/auth/auth.service';
import { S3FilesService } from 'src/app/core/services/files/minio-files.service';
import { RegionesComunasService } from 'src/app/core/services/regiones-comunas/regiones-comunas.service';
import { RunValidatorService } from 'src/app/core/validations/run-validator/run-validator.service';
import { RutValidatorService } from 'src/app/core/validations/rut-validator/rut-validator.service';
import { PassValidatorService } from 'src/app/core/validations/pass-validator/pass-validator.service';
import { EmailValidatorService } from 'src/app/core/validations/email-validator/email-validator.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsAndConditionsComponent } from '../../components/terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public formulario: FormGroup;

  public regionesEmpresa: any;
  public regionesPropietario: any;

  public comunasEmpresa: any;
  public comunasPropietario: any;

  public step: number = 1;
  public bar: number = 0;

  // 2 MB como tamaño máximo de archivo
  private fileSize: number = (2 * 1024 * 1024);
  public selectedFile: File | null = null;
  private allowedFilesExtention: string[] = ['jpg', 'jpeg', 'png', 'svg'];

  closeResult = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private runValidator: RunValidatorService,
    private rutValidator: RutValidatorService,
    private passValidator: PassValidatorService,
    private emailValidator: EmailValidatorService,
    private regionesComunas: RegionesComunasService,
    private authService: AuthService,
    private s3FilesService: S3FilesService,
    private modalService: NgbModal,
  ) {
    this.regionesEmpresa = this.regionesComunas.getRegions();
    this.regionesPropietario = this.regionesComunas.getRegions();
    this.formulario = this.buildForm();

    /* Debug - set mock of new user */
    // this.setUser();
  }

  ngOnInit(): void {
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      infoPropietario: this.fb.group({
        nombre: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
          ],
        ],
        apellidos: [
          null,
          [Validators.required],
        ],
        run: [null,
          [
            Validators.required,
          ],
          [
            this.runValidator,
          ],
        ],
        imagen: [null, [],],
        correoPropietario: [
          null,
          [
            Validators.required,
            Validators.pattern(this.emailPattern),
          ],
          [
            this.emailValidator,
          ],
        ],
        contrasenia: [null,
          [
            Validators.required,
            Validators.minLength(6),
          ],
        ],
        contrasenia2: [null,
          [
            Validators.required,
          ],
        ],
      }),

      infoLocalidadPropietario: this.fb.group({
        opRegion: [null, [Validators.required]],
        opCommune: [null, [Validators.required]],
        direccionPropietario: [null, [Validators.required]],
        direccionPropietario2: [null],
        descripcion: [null],
      }),

      infoEmpresa: this.fb.group({
        nombreEmpresa: ['', [Validators.required]],
        rut: ['',
          [
            Validators.required,
          ],
          [
            this.rutValidator,
          ],
        ],
        tipoEmpresa: [null, [Validators.required]],
        rubro: [null, [Validators.required]],
      }),

      infoLocalidadEmpresa: this.fb.group({
        usarDireccionPersonal: [false, []],
        regionEmpresa: [null, [Validators.required]],
        communeEmpresa: [null, [Validators.required]],
        direccionEmpresa: [null, [Validators.required]],
        descripcionEmpresa: [null, []],
      }),
      terminosYCondiciones: [false, [Validators.requiredTrue]],
    }, {
      validators: [
        this.passValidator.contraseñasIguales('contrasenia', 'contrasenia2'),
      ]
    });
  }

  public sendForm() {
    console.log('sendForm()');
    if (this.step !== 4) {
      return;
    }

    const infoLocalidadEmpresa = this.formulario.get('infoLocalidadEmpresa');
    const terminosYCondiciones = this.formulario.get('terminosYCondiciones');
    const infoPropietario = this.formulario.get('infoPropietario');
    const infoLocalidadPropietario = this.formulario.get('infoLocalidadPropietario');
    const infoEmpresa = this.formulario.get('infoEmpresa');

    if (infoLocalidadEmpresa?.invalid || terminosYCondiciones?.invalid) {
      infoLocalidadEmpresa?.markAllAsTouched();
      terminosYCondiciones?.markAsTouched();
      return;
    }

    this.bar += 25;

    const nuevoUsuario = {
      nombreUsuario: infoPropietario?.get('nombre')?.value,
      apellidos: infoPropietario?.get('apellidos')?.value,
      run: infoPropietario?.get('run')?.value,
      rol: 'CLIENT-USER',
      emailUsuario: infoPropietario?.get('correoPropietario')?.value,
      imagen: infoPropietario?.get('imagen')?.value,
      contrasenia: infoPropietario?.get('contrasenia')?.value,
      region: infoLocalidadPropietario?.get('opRegion')?.value,
      comuna: infoLocalidadPropietario?.get('opCommune')?.value,
      dir1Propietario: infoLocalidadPropietario?.get('direccionPropietario')?.value,
      dir2Propietario: infoLocalidadPropietario?.get('direccionPropietario2')?.value,
      descripcion: infoLocalidadPropietario?.get('descripcion')?.value,
      nombrePyme: infoEmpresa?.get('nombreEmpresa')?.value,
      rut: infoEmpresa?.get('rut')?.value,
      rubro: infoEmpresa?.get('rubro')?.value,
      tipoEmpresa: infoEmpresa?.get('tipoEmpresa')?.value,
      regionEmpresa: infoLocalidadEmpresa?.get('regionEmpresa')?.value,
      comunaEmpresa: infoLocalidadEmpresa?.get('communeEmpresa')?.value,
      dirEmpresa: infoLocalidadEmpresa?.get('direccionEmpresa')?.value,
      descripcionEmpresa: infoLocalidadEmpresa?.get('descripcionEmpresa')?.value,
    };

    // console.log({ nuevoUsuario });
    const imageFile = this.selectedFile;

    if (imageFile) {
      this.s3FilesService
        .uploadImage(imageFile)
        .pipe(
          concatMap((imagePath) => {
            nuevoUsuario.imagen = imagePath.filePath;
            return this.authService.registerUser(nuevoUsuario).pipe(
              catchError(() => {
                return of(false);
              })
            );
          })
        )
        .subscribe((ok: boolean) => {
          const successMessage = 'Nuevo usuario creado';
          const errorMessage = 'Error al crear usuario';

          Swal.fire({
            icon: ok ? 'success' : 'warning',
            title: ok ? successMessage : errorMessage,
            showConfirmButton: false,
            timer: 1500,
          });

          this.router.navigate([ok ? '/visitor/login' : '/visitor/']);
        });
    } else {
      // Si no hay imagen para subir, registramos al usuario sin esperar la subida de la imagen
      this.authService.registerUser(nuevoUsuario).subscribe((ok: boolean) => {
        const successMessage = 'Nuevo usuario creado';
        const errorMessage = 'Error al crear usuario';

        Swal.fire({
          icon: ok ? 'success' : 'warning',
          title: ok ? successMessage : errorMessage,
          showConfirmButton: false,
          timer: 1500,
        });

        this.router.navigate([ok ? '/visitor/login' : '/visitor/']);
      });
    }
  }

  public onFileInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files as FileList;
    const imagenControl = this.formulario.get('infoPropietario.imagen');

    if (files && files.length === 1 && imagenControl) {
      const file = files[0] as File;

      // Validar la extensión del archivo
      const fileName = file.name || '';
      const fileExt = fileName.split('.').pop()?.toLowerCase() as string;
      if (!this.allowedFilesExtention.includes(fileExt)) {
        imagenControl.setErrors({ invalidExtension: true });
        return;
      }

      // Validar el tamaño máximo (2 MB)
      if (file.size <= this.fileSize) {
        this.selectedFile = file;
        imagenControl.setErrors(null);
      } else {
        imagenControl.setErrors({ maxSizeExceeded: true });
      }
    }

    if (files.length > 1 && imagenControl) {
      imagenControl.setErrors({ invalidFileCount: true });
    }
  }

  public getPercent(): string {
    return `${this.bar}%`
  }

  public previous() {
    this.step = this.step - 1;
    this.bar = this.bar - 25;
  }

  public next() {
    if (this.step == 1 && this.formulario.get('infoPropietario')?.invalid) {
      this.formulario.get('infoPropietario')?.markAllAsTouched();
      return;
    }

    if (this.step == 2 && this.formulario.get('infoLocalidadPropietario')?.invalid) {
      this.formulario.get('infoLocalidadPropietario')?.markAllAsTouched();
      return;
    }

    if (this.step == 3 && this.formulario.get('infoEmpresa')?.invalid) {
      this.formulario.get('infoEmpresa')?.markAllAsTouched();
      return;
    }

    this.step = this.step + 1;
    this.bar = this.bar + 25;
  }

  public onSelectedRegionPropietario(campo: string, formulario: string) {
    const opSelected = this.formulario.get(formulario)?.get(campo)?.value;
    if (opSelected) {
      this.comunasPropietario = this.regionesComunas.getComunas(opSelected);
      return;
    }

    this.formulario.get(formulario)?.patchValue({ opCommune: null });
  }

  public onSelectedRegionEmpresa(campo: string, formulario: string) {
    const opSelected = this.formulario.get(formulario)?.get(campo)?.value;
    this.comunasEmpresa = this.regionesComunas.getComunas(opSelected);

    this.formulario.get(formulario)?.patchValue({ communeEmpresa: null });
  }

  public campoInvalido(campo: string, formulario: string) {
    return this.formulario.get(formulario)?.get(campo)?.errors
      && this.formulario.get(formulario)?.get(campo)?.touched;
  }

  public aceptarTerminosYCondiciones(campo: string) {
    return this.formulario.get(campo)?.errors
      && this.formulario.get(campo)?.touched;
  }

  public copiarCampos() {
    const infoLocalidadEmpresa = this.formulario.get('infoLocalidadEmpresa');
    const infoLocalidadPropietario = this.formulario.get('infoLocalidadPropietario');
    
    if (!infoLocalidadEmpresa || !infoLocalidadPropietario) {
      return;
    }
    
    const copiar = infoLocalidadEmpresa.get('usarDireccionPersonal')?.value;
    
    if (!copiar) {
      const patchValues = {
        regionEmpresa: infoLocalidadPropietario.get('opRegion')?.value,
        communeEmpresa: infoLocalidadPropietario.get('opCommune')?.value,
        direccionEmpresa: infoLocalidadPropietario.get('direccionPropietario')?.value,
        descripcionEmpresa: infoLocalidadPropietario.get('descripcion')?.value
      };
    
      infoLocalidadEmpresa.patchValue(patchValues);
    } else {
      infoLocalidadEmpresa.patchValue({
        regionEmpresa: null,
        communeEmpresa: null,
        direccionEmpresa: null,
        descripcionEmpresa: null
      });
    }
  }
  
  private setUser() {
    this.formulario.reset({
      infoPropietario: {
        nombre: 'Sebastián',
        apellidos: 'Vidal',
        run: '12.321.233-21',
        correoPropietario: 'sebastian.vid@gmail.com',
        contrasenia: '123.123',
        contrasenia2: '123.123'
      },
      infoLocalidadPropietario: {
        opRegion: 'Antofagasta',
        opCommune: 'Mejillones',
        direccionPropietario: 'Av. Lorem ipsum #123',
        direccionPropietario2: null,
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
        regionEmpresa: null,
        communeEmpresa: null,
        direccionEmpresa: null,
        descripcionEmpresa: null,
      },
      terminosYCondiciones: true,
    });
  }

  public openTermsAndConditionsModal() {
    this.modalService
      .open(TermsAndConditionsComponent, {size : 'lg'})
      .result.then(
        (result) => {
          console.log({ result });
        },
        (reason) => {
          console.log({ reason });
        }
      );
  }
}