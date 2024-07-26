import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import Swal from 'sweetalert2';
import moment from 'moment';

import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PublicacionService } from 'src/app/core/services/publicacion/publicacion.service';
import { S3FilesService } from 'src/app/core/services/files/minio-files.service';
import { catchError, of } from 'rxjs';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private s3FilesService: S3FilesService,
    private publicacionService: PublicacionService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.buildForm();
    // console.log(this.authService.usuario.id);
  }

  private buildForm() {
    this.publicationForm = this.fb.group({
      titulo: [, Validators.required],
      descripcion: [, Validators.required],
      productoOServicio: [, Validators.required],
      cantidad: [1, Validators.required],
      precioPorUnidad: [,],
      totalPrecio: [, Validators.required],
      modelo: [,],
      color: [,],
      fechaInicio: [, Validators.required],
      fechaTermino: [, Validators.required],
      horasATrabajar: [,],
      garantia: [false, Validators.required],
      aniosGarantia: [,
        // {value :null ,disabled: true}
      ],
      archivos: [null, []],
    });
  }

  public invalidField(campo: string) {
    return this.publicationForm.get(campo)?.errors
      && this.publicationForm.get(campo)?.touched;
  }

  public selectionToggle(option: string) {
    this.selectedOption = option;
    if (option == 'Producto') {
      this.publicationForm.reset();

      this.publicationForm.patchValue({
        titulo: 'Adquisición de articulos de aseo y ornato',
        descripcion: 'La empresa XXXX necesita articulos para desempeñar sus funciones de aseo en la comuna de san antonio',
        productoOServicio: 'Producto',
        cantidad: 1,
        precioPorUnidad: null,
        totalPrecio: 15000,
        modelo: 'XL-Z22-4D1A-K',
        color: 'Azul',
        garantia: true,
        aniosGarantia: 1,
      });

      this.publicationForm.setErrors(null);

      // desabilitar atributos que no son para el formulario de producto
      this.publicationForm.get('fechaInicio')?.disable();
      this.publicationForm.get('fechaTermino')?.disable();
      this.publicationForm.get('horasATrabajar')?.disable();

      // habilito los atributos que pudiesen estar deshabilitados
      this.publicationForm.get('cantidad')?.enable();
      this.publicationForm.get('precioPorUnidad')?.enable();
      this.publicationForm.get('modelo')?.enable();
      this.publicationForm.get('color')?.enable();

      this.publicationForm.patchValue({
        productoOServicio: 'Producto',
        cantidad: 1,
        garantia: false,
        aniosGarantia: null,
      });
    }

    if (option == 'Servicio') {
      // console.log(' Es Servicio')
      this.publicationForm.reset();
      this.publicationForm.setErrors(null);

      //quitar estas lineas solo test
      // this.formularioPublicacion.patchValue({
      //   titulo: 'Adquisicion de articulos de aseo y ornato',
      //   descripcion: 'La empresa XXXX necesita articulos para desempeñar sus funciones de aseo en la comuna de san antonio',
      //   productoOServicio: 'Servicio',
      //   totalPrecio: 15000,
      //   fechaInicio: '',
      //   fechaTermino: '',
      //   horasATrabajar: 1,
      //   garantia: false,
      //   aniosGarantia: null,
      //   archivos: 'archivo.zip',
      //   UsuarioId: 'cb8bcb308b7ccf1',
      // });

      // Desabilitar atributos que no son para el formulario de servicio
      this.publicationForm.get('cantidad')?.disable();
      this.publicationForm.get('precioPorUnidad')?.disable();
      this.publicationForm.get('modelo')?.disable();
      this.publicationForm.get('color')?.disable();

      // Habilito los atributos que pudiesen estar deshabilitados
      this.publicationForm.get('fechaInicio')?.enable();
      this.publicationForm.get('fechaTermino')?.enable();
      this.publicationForm.get('horasATrabajar')?.enable();

      this.publicationForm.patchValue({
        productoOServicio: 'Servicio',
        cantidad: 1,
        garantia: false,
        aniosGarantia: null,
      });
    }
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
    // console.log('this.uploadedFiles', this.uploadedFiles);
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  public sendPublication() {
    if (this.publicationForm.invalid) {
      this.publicationForm.markAllAsTouched();
      return;
    }

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
      archivos: this.publicationForm.get('archivos')?.value,
      UsuarioId: this.authService.usuario.id,
    };

    // Parseo fecha segun formato de la BD
    if (newPublication.productoOServicio === 'Servicio') {
      newPublication.fechaFinServicio = moment(newPublication.fechaFinServicio).format();
      newPublication.fechaInicioServicio = moment(newPublication.fechaInicioServicio).format();
    }

    // Subir archivos a s3
    if (this.uploadedFiles.length > 0) {
      console.log(this.uploadedFiles);
      this.sendFiles();
    }

    // this.publicacionService.postPublicacion(newPublication).subscribe(data => {
    //   // console.log(data)
    //   if (data.ok === true) {
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Publicación creada!',
    //       showConfirmButton: false,
    //       timer: 1200,
    //     });
    //     this.router.navigate([`user/publication-detail/${data.id}`]);
    //   }
    // });
  }

  private sendFiles() {
    // Subir los archivos a Minio
    this.s3FilesService.postNewPublicationFiles(this.uploadedFiles).pipe(
      catchError(error => {
        console.error('Error al subir archivos a Minio:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Hubo un problema al subir los archivos',
          showConfirmButton: true
        });
        return of(null);
      })
    ).subscribe((res: any) => {
      console.log({ res });
      if (res && res.filepaths) {
        // const filepathsString = res.filepaths.join(', ');
        // const newReport = {
        //   titulo: this.reportForm.get('titulo')?.value,
        //   mensaje: this.reportForm.get('descripcion')?.value,
        //   documentos: filepathsString,
        //   PublicacionId: publicationId,
        //   UsuarioId: userId,
        //   CompraId: compraId 
        // };

        // console.log({ newReport });

        // Guardar el reporte

      }
    });
  }
}
