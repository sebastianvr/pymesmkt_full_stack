import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import moment from 'moment';
import JSZip from 'jszip';

import { AuthService } from 'src/app/core/services/auth/auth.service';
import { S3FilesService } from 'src/app/core/services/files/s3-files.service';
import { PublicacionService } from 'src/app/core/services/publicacion/publicacion.service';
import { MessageService } from 'src/app/core/services/message/message.service';


@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.css'],
  providers: []
})
export class CreatePublicationComponent implements OnInit {
  uploadedFiles: any[] = [];
  selectedOption: string | null = null;
  publicationForm!: FormGroup
  isOpLoading!: boolean;

  maxTitleCharacters = 100;
  maxDescriptionCharacters = 500;
  remainingTitleCharacters!: number;
  remainingDescriptionCharacters!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private s3FilesService: S3FilesService,
    private publicacionService: PublicacionService,
    private messageService: MessageService,
  ) { }

  get titleControl(): AbstractControl | null {
    return this.publicationForm.get('titulo');
  }

  get descriptionControl(): AbstractControl | null {
    return this.publicationForm.get('descripcion');
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.buildForm();
  }

  private buildForm() {
    this.publicationForm = this.fb.group({
      titulo: ['', [
        Validators.required,
        Validators.maxLength(this.maxTitleCharacters)
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.maxLength(this.maxDescriptionCharacters)
      ]],
      productoOServicio: [, Validators.required],
      cantidad: [1, Validators.required],
      precioPorUnidad: [],
      totalPrecio: [, Validators.required],
      color: ['', [Validators.maxLength(50)]],
      modelo: ['', [Validators.maxLength(50)]],
      fechaInicio: [, Validators.required],
      fechaTermino: [, Validators.required],
      horasATrabajar: [,],
      garantia: [true, Validators.required],
      aniosGarantia: [],
      archivos: [],
    });

    this.remainingTitleCharacters = this.maxTitleCharacters;
    this.remainingDescriptionCharacters = this.maxDescriptionCharacters;

    this.publicationForm.get('titulo')?.valueChanges.subscribe(value => {
      this.remainingTitleCharacters = this.maxTitleCharacters - (value ? value.length : 0);
    });

    this.publicationForm.get('descripcion')?.valueChanges.subscribe(value => {
      this.remainingDescriptionCharacters = this.maxDescriptionCharacters - (value ? value.length : 0);
    });

    this.publicationForm.get('garantia')?.valueChanges.subscribe(value => {
      this.toggleGarantia(value);
    });
  }

  public invalidField(campo: string) {
    return this.publicationForm.get(campo)?.errors
      && this.publicationForm.get(campo)?.touched;
  }

  private toggleGarantia(value: boolean) {
    const aniosGarantiaControl = this.publicationForm.get('aniosGarantia');
    if (value) {
      aniosGarantiaControl?.setValidators([Validators.required]);
    } else {
      aniosGarantiaControl?.clearValidators();
    }
    aniosGarantiaControl?.updateValueAndValidity();
  }

  public selectionToggle(option: string) {
    this.selectedOption = option;
    this.publicationForm.reset();
    this.publicationForm.setErrors(null);

    if (option === 'Producto') {
      this.setProductForm();
      // Descomentar para setear valores de ejemplo
      // this.setProductoExampleValues();
    }

    if (option === 'Servicio') {
      this.setServiceForm();
      // Descomentar para setear valores de ejemplo
      // this.setServicioExampleValues();
    }
  }

  private setProductForm() {
    // Deshabilitar atributos que no son para el formulario de producto
    this.publicationForm.get('fechaInicio')?.disable();
    this.publicationForm.get('fechaTermino')?.disable();
    this.publicationForm.get('horasATrabajar')?.disable();

    // Habilitar los atributos que pudiesen estar deshabilitados
    this.publicationForm.get('cantidad')?.enable();
    this.publicationForm.get('precioPorUnidad')?.enable();
    this.publicationForm.get('modelo')?.enable();
    this.publicationForm.get('color')?.enable();

    this.publicationForm.patchValue({
      productoOServicio: 'Producto',
      cantidad: 1,
      garantia: true,
      aniosGarantia: null,
    });
  }

  private setServiceForm() {
    // Deshabilitar atributos que no son para el formulario de servicio
    this.publicationForm.get('cantidad')?.disable();
    this.publicationForm.get('precioPorUnidad')?.disable();
    this.publicationForm.get('modelo')?.disable();
    this.publicationForm.get('color')?.disable();

    // Habilitar los atributos que pudiesen estar deshabilitados
    this.publicationForm.get('fechaInicio')?.enable();
    this.publicationForm.get('fechaTermino')?.enable();
    this.publicationForm.get('horasATrabajar')?.enable();

    this.publicationForm.patchValue({
      productoOServicio: 'Servicio',
      cantidad: 1,
      garantia: true,
      aniosGarantia: null,
    });
  }

  private setProductoExampleValues() {
    this.publicationForm.patchValue({
      titulo: 'Compra de Pasteles Personalizados para Eventos Corporativos',
      descripcion: 'Eventos Corporativos XYZ busca adquirir una selección de pasteles personalizados para sus eventos de fin de año. Estos pasteles deben ser de alta calidad, elaborados con ingredientes frescos y diseñados según las temáticas específicas de cada evento. La empresa requiere un total de 10 pasteles grandes, con opciones de decoración especial y la posibilidad de adaptaciones dietéticas como sin gluten o sin lactosa.',
      productoOServicio: 'Producto',
      cantidad: 8,
      precioPorUnidad: 77340,
      totalPrecio: 77340 * 8,
      modelo: 'Pastel dos pisos XXL',
      color: 'Variedad de Colores según la Temática',
      garantia: false,
    });
  }

  private setServicioExampleValues() {
    this.publicationForm.patchValue({
      titulo: 'Servicio de Repostería Personalizada para Eventos Corporativos de Fin de Año',
      descripcion: 'Eventos Corporativos XYZ busca una pastelería experta para la creación y entrega de postres personalizados en sus eventos de fin de año. Este servicio incluye la elaboración de pasteles temáticos, postres gourmet, y opciones personalizadas según las preferencias dietéticas de los asistentes. Se espera una alta calidad en la presentación y un compromiso con la entrega puntual para cada uno de los eventos programados.',
      productoOServicio: 'Servicio',
      totalPrecio: 15000,
      fechaInicio: '2024-11-01',
      fechaTermino: '2024-12-31',
      horasATrabajar: 150,
      garantia: true,
      aniosGarantia: 1,
    });
  }

  public isGuaranteed() {
    return this.publicationForm.get('garantia')?.value === true;
  }

  public calculateTotalPrice() {
    const cantidad = this.publicationForm.get('cantidad')?.value;
    const precioPorUnidad = this.publicationForm.get('precioPorUnidad')?.value;
    return this.publicationForm.patchValue({ 'totalPrecio': cantidad * precioPorUnidad });
  }

  public onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  public async sendPublication() {
    if (this.publicationForm.invalid) {
      this.publicationForm.markAllAsTouched();
      return;
    }

    this.isOpLoading = true;
    const newPublication = {
      titulo: this.publicationForm.get('titulo')?.value,
      descripcion: this.publicationForm.get('descripcion')?.value,
      productoOServicio: this.publicationForm.get('productoOServicio')?.value,
      cantidadElementos: this.publicationForm.get('cantidad')?.value,
      precioPorUnidad: this.publicationForm.get('precioPorUnidad')?.value,
      precioTotal: this.publicationForm.get('totalPrecio')?.value,
      modelo: this.publicationForm.get('modelo')?.value,
      color: this.publicationForm.get('color')?.value,
      fechaInicioServicio: this.publicationForm.get('fechaInicio')?.value,
      fechaFinServicio: this.publicationForm.get('fechaTermino')?.value,
      horasATrabajar: this.publicationForm.get('horasATrabajar')?.value,
      garantia: this.publicationForm.get('garantia')?.value,
      aniosGarantia: this.publicationForm.get('aniosGarantia')?.value,
      archivoAdjunto: this.publicationForm.get('archivos')?.value,
      UsuarioId: this.authService.usuario.id,
    };

    // Parseo fecha segun formato de la BD
    if (newPublication.productoOServicio === 'Servicio') {
      newPublication.fechaFinServicio = moment(newPublication.fechaFinServicio).format();
      newPublication.fechaInicioServicio = moment(newPublication.fechaInicioServicio).format();
    }

    // Subir archivos a s3
    if (this.uploadedFiles.length > 0) {
      try {
        const filesPath = await this.zipAndUploadFiles();
        newPublication.archivoAdjunto = filesPath;
      } catch (error) {
        this.messageService.showErrorMessage('Error al subir archivos');
        this.isOpLoading = false;
        return;
      }
    }

    this.publicacionService.postPublicacion(newPublication).pipe(
      catchError(error => {
        console.error('Error al crear la publicación:', error);
        this.messageService.showErrorMessage('Error al intentar crear la publicación.');
        this.isOpLoading = false;
        return of(null);
      })
    ).subscribe(data => {
      if (data.ok === true) {
        this.messageService.showSuccessMessage('Publicación creada');
        this.isOpLoading = false;
        this.router.navigate([`user/publication-detail/${data.id}`]);
      }
    });
  }

  private async zipAndUploadFiles() {
    const zip = new JSZip();
    this.uploadedFiles.forEach(file => {
      zip.file(file.name, file);
    });

    return new Promise(async (resolve, reject) => {
      try {
        const zipBlob = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });
        const zipFile = new File([zipBlob], 'archivos.zip', { type: 'application/zip' });

        this.s3FilesService.postNewPublicationFiles(zipFile).pipe(
          catchError(error => {
            console.error('Error al subir archivos a s3:', error);
            this.messageService.showErrorMessage('Error al intentar subir archivos');
            reject(error);
            return of(null);
          })
        ).subscribe((response: any) => {
          if (response && response.filepath) {
            const filePath = response.filepath;
            resolve(filePath);
          } else {
            reject('No se obtuvieron rutas de archivo');
          }
        });
      } catch (error) {
        console.error('Error al crear el archivo zip:', error);
        this.messageService.showErrorMessage('Hubo un problema al comprimir los archivos');
        reject(error);
      }
    });
  }
}
