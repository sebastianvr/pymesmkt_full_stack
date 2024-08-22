import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { S3FilesService } from 'src/app/core/services/files/s3-files.service';
import { ImageEventService } from 'src/app/core/services/image-event/image-event-service.service';

import { MessageService } from 'src/app/core/services/message/message.service';
import { RegionesComunasService } from 'src/app/core/services/regiones-comunas/regiones-comunas.service';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { EmailValidatorService } from 'src/app/core/validations/email-validator/email-validator.service';
import { RunValidatorService } from 'src/app/core/validations/run-validator/run-validator.service';
import { RutValidatorService } from 'src/app/core/validations/rut-validator/rut-validator.service';

interface EditMode {
  infoPropietario: boolean;
  infoLocalidadPropietario: boolean;
  infoEmpresa: boolean;
  infoLocalidadEmpresa: boolean;
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  currentUserId: string = this.authService.usuario.id;
  user!: any;
  userForm!: FormGroup;

  regiones = this.regionesComunas.getRegions();
  selectedRegionCommunes: string[] = [];

  loadingInfoPropietario!: boolean;
  loadingInfoLocalidadPropietario!: boolean;
  loadingInfoEmpresa!: boolean;
  loadingInfoLocalidadEmpresa!: boolean;

  opLineOfBussines: string[] = ["PRODUCTO", "SERVICIO"];

  editMode: EditMode = {
    infoPropietario: true,
    infoLocalidadPropietario: true,
    infoEmpresa: true,
    infoLocalidadEmpresa: true,

  };

  public imageUrl!: string;
  private emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  private allowedFilesExtention: string[] = ['jpg', 'jpeg', 'png', 'svg'];
  // 2 MB como tamaño máximo de archivo
  private fileSize: number = (2 * 1024 * 1024);
  public selectedFile: File | null = null;
  loadingFile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private emailValidator: EmailValidatorService,
    // private runValidator: RunValidatorService,
    // private rutValidator: RutValidatorService,
    private regionesComunas: RegionesComunasService,
    private messageService: MessageService,
    private s3FilesService: S3FilesService,
    private imageEventService: ImageEventService,
  ) {
    this.userForm = this.buildForm();
  }

  ngOnInit(): void {
    this.usuarioService.getUsuario(this.currentUserId)
      .subscribe((user) => {
        this.user = user;
        // Setea valores del formulario con los datos del usuario
        this.setForm(user);
      });
  }

  private setForm(user: any, formName?: string) {
    const formMappings: { [key: string]: any } = {
      infoPropietario: {
        nombre: user.nombreUsuario,
        apellidos: user.apellidos,
        run: user.run,
        email: user.emailUsuario,
        imagen: user.imagen,
      },
      infoLocalidadPropietario: {
        opRegion: user.region,
        opCommune: user.comuna,
        direccionPropietario: user.dir1Propietario,
        direccionPropietario2: user.dir2Propietario,
        descripcion: user.descripcion,
      },
      infoEmpresa: {
        nombreEmpresa: user.Pyme.nombrePyme,
        rut: user.Pyme.rut,
        tipoEmpresa: user.Pyme.tipoEmpresa,
        rubro: user.Pyme.rubro,
      },
      infoLocalidadEmpresa: {
        regionEmpresa: user.Pyme.regionEmpresa,
        communeEmpresa: user.Pyme.comunaEmpresa,
        direccionEmpresa: user.Pyme.dirEmpresa,
        descripcionEmpresa: user.Pyme.descripcionEmpresa,
      }
    };

    const formValues = formName ? { [formName]: formMappings[formName] } : formMappings;
    this.userForm.patchValue(formValues);
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      infoPropietario: this.fb.group({
        nombre: [{ value: undefined, disabled: true },
        [Validators.required, Validators.minLength(3)]
        ],
        apellidos: [
          { value: undefined, disabled: true },
          [Validators.required]
        ],
        run: [
          { value: undefined, disabled: true },
          [Validators.required],
          // [this.runValidator],
        ],
        email: [
          { value: undefined, disabled: true },
          [Validators.required, Validators.pattern(this.emailPattern)],
          [this.emailValidator],
        ],
        imagen: [null, []],
      }),
      infoLocalidadPropietario: this.fb.group({
        opRegion: [
          { value: undefined, disabled: true },
          [Validators.required]],
        opCommune: [
          { value: undefined, disabled: true },
          [Validators.required]],
        direccionPropietario: [
          { value: undefined, disabled: true },
          [Validators.required]
        ],
        direccionPropietario2: [{ value: undefined, disabled: true }],
        descripcion: [{ value: undefined, disabled: true }],
      }),
      infoEmpresa: this.fb.group({
        nombreEmpresa: [
          { value: undefined, disabled: true },
          [Validators.required]
        ],
        rut: [
          { value: undefined, disabled: true },
          [Validators.required],
          // [this.rutValidator],
        ],
        tipoEmpresa: [
          { value: undefined, disabled: true },
          [Validators.required]
        ],
        rubro: [{ value: undefined, disabled: true },
        [Validators.required]
        ],
      }),
      infoLocalidadEmpresa: this.fb.group({
        regionEmpresa: [{ value: undefined, disabled: true },
        [Validators.required]
        ],
        communeEmpresa: [
          { value: undefined, disabled: true },
          [Validators.required]
        ],
        direccionEmpresa: [
          { value: undefined, disabled: true },
          [Validators.required]
        ],
        descripcionEmpresa: [
          { value: undefined, disabled: true }],
      }),
    });
  }

  // Cambiar el estado de edición solo para el grupo del form específico
  public toggleEditMode(groupName: keyof EditMode) {
    const group = this.userForm.get(groupName);
    if (group instanceof FormGroup) {
      const groupControls = group.controls;
      for (const controlName in groupControls) {
        if (groupControls.hasOwnProperty(controlName)) {
          const control = groupControls[controlName];
          if (this.editMode[groupName]) {
            // Si el control es el run ,rut o el correo electrónico, no habilitarlo nunca
            if (controlName === 'run' || controlName === 'rut' || controlName === 'email' || controlName === 'imagen' || controlName === 'url') {
              control.disable();
            } else {
              control.enable();
            }
          } else {
            control.disable();
          }
        }
      }
    }

    this.editMode[groupName] = !this.editMode[groupName];
    // Si se está cancelando la edición, restaurar los valores iniciales del formulario
    if (this.editMode[groupName]) {
      this.setForm(this.user, groupName); //Actualizar solo el formulario especificado
    }
  }

  public updateUser(formName: string) {
    this.loadingInfoPropietario = false;
    this.loadingInfoLocalidadPropietario = false;
    this.loadingInfoEmpresa = false;
    this.loadingInfoLocalidadEmpresa = false;
    // Activar el indicador de carga específico para el formulario correspondiente
    switch (formName) {
      case 'infoPropietario':
        this.loadingInfoPropietario = true;
        break;
      case 'infoLocalidadPropietario':
        this.loadingInfoLocalidadPropietario = true;
        break;
      case 'infoEmpresa':
        this.loadingInfoEmpresa = true;
        break;
      case 'infoLocalidadEmpresa':
        this.loadingInfoLocalidadEmpresa = true;
        break;
      default:
        break;
    }

    // Obtener los datos del formulario específico
    const updateData = this.userForm.get(formName)?.value;

    // Verificar si la imagen ha cambiado
    if (formName === 'infoPropietario') {
      const newImageUrl = this.userForm.get('infoPropietario.imagen')?.value;
      if (newImageUrl instanceof File) {
        // Si es un archivo, no incluir la imagen en los datos de actualización
        delete updateData.imagen;
      }

    }

    this.usuarioService.updateUser(this.currentUserId, updateData)
      .subscribe((res: any) => {
        switch (formName) {
          case 'infoPropietario':
            // Desactivar el loader específico después de completar la operación
            this.loadingInfoPropietario = false;
            // Close btn guardar
            this.editMode.infoPropietario = true;
            this.userForm.get('infoPropietario')?.disable();
            this.messageService.showSuccessMessage('Información actualizada!')
            this.setForm(res.usuario);
            break;
          case 'infoLocalidadPropietario':
            this.loadingInfoLocalidadPropietario = false;
            this.editMode.infoLocalidadPropietario = true;
            this.userForm.get('infoLocalidadPropietario')?.disable();
            this.messageService.showSuccessMessage('Información actualizada!')
            this.setForm(res.usuario);
            break;
          case 'infoEmpresa':
            this.loadingInfoEmpresa = false;
            this.editMode.infoEmpresa = true;
            this.userForm.get('infoEmpresa')?.disable();
            this.messageService.showSuccessMessage('Información actualizada!')
            this.setForm(res.usuario);
            break;
          case 'infoLocalidadEmpresa':
            this.loadingInfoLocalidadEmpresa = false;
            this.editMode.infoLocalidadEmpresa = true;
            this.userForm.get('infoLocalidadEmpresa')?.disable();
            this.messageService.showSuccessMessage('Información actualizada!')
            this.setForm(res.usuario);
            break;
          default:
            break;
        }
      });
  }

  public onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {
      const fileControl = this.userForm.get('infoPropietario.imagen');
      if (!fileControl) {
        return;
      }

      fileControl.setValue(file.name);
      fileControl.markAsDirty();
      fileControl.markAsTouched();

      // Verificar si el control tiene errores antes de continuar
      if (fileControl.errors) {
        return;
      }

      const fileName = file.name || '';
      const fileExt = fileName.split('.').pop()?.toLowerCase() as string;
      if (!this.allowedFilesExtention.includes(fileExt)) {
        fileControl.setErrors({ invalidExtension: true });
        return;
      }

      // Validar el tamaño máximo (2 MB)
      if (file.size <= this.fileSize) {
        this.selectedFile = file;
        fileControl.setErrors(null);
      } else {
        fileControl.setErrors({ maxSizeExceeded: true })
        return;
      }

      this.loadingFile = true;
      this.s3FilesService.uploadImage(file).pipe(
        catchError((error: any) => {
          console.error({ error });
          this.messageService.showErrorMessage('Error al subir imagen');
          this.loadingFile = false;
          return of(null);
        })
      ).subscribe((response: any) => {
        if (response && response.filePath) {
          this.imageUrl = response.filePath;

          this.usuarioService.updateUser(this.currentUserId, { imagen: this.imageUrl })
            .subscribe((data) => {
              this.user.imagen = data.usuario.imagen;
              this.messageService.showSuccessMessage('Imagen actualizada')

              // Emitir el evento con la imagen al navbar
              this.imageEventService.emitImageUpdate(file);

            });
          this.loadingFile = false;
        }
      });
    }
  }

  public campoInvalido(field: string, arrayForm: string) {
    return this.userForm.get(arrayForm)?.get(field)?.errors
      && this.userForm.get(arrayForm)?.get(field)?.touched;
  }

  public onRegionChange(event: Event, formControlName: string) {
    const selectedRegion = (event.target as HTMLSelectElement).value;
    if (selectedRegion) {
      const communes = this.regionesComunas.getComunas(selectedRegion);
      if (communes) {
        this.selectedRegionCommunes = communes;
        this.userForm.get(formControlName)?.setValue(null); // Reiniciar la selección de comuna        
      } else {
        this.selectedRegionCommunes = [];
      }
    } else {
      this.selectedRegionCommunes = [];
    }
  }
}