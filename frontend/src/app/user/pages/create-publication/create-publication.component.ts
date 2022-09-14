import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.css']
})
export class CreatePublicationComponent implements OnInit {

  // fecha!: Date;
  uploadedFiles: any[] = [];
  // maxPrice!: number;
  // quantity!: number;
  // isTermsAccepted!: boolean;
  // checked2: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private publicacionService : PublicacionService,
    private authService : AuthService
  ) { }

  ngOnInit() {
    
  }

  formularioPublicacion: FormGroup = this.fb.group({
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
    archivos: [,],
  })

  onUpload(event: any) {
    console.log('asdasdasd',this.uploadedFiles)
    
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  // Limpia el formulario dependiendo se es producto o servicio
  limpiarFormulario(res: string) {

    // this.tieneGarantia();


    if (res == 'Producto') {
      // console.log(' Es Producto')
      this.formularioPublicacion.reset()
      
      
      //quitar estas lineas solo test
      this.formularioPublicacion.patchValue({
        titulo: 'Adquisicion de articulos de aseo y ornato',
        descripcion: 'La empresa XXXX necesita articulos para desempeñar sus funciones de aseo en la comuna de san antonio',
        productoOServicio: 'Producto',
        cantidad: 1,
        precioPorUnidad: null,
        totalPrecio: 15000,
        modelo: '1rkAKpJl',
        color: 'azul',
        garantia: true,
        aniosGarantia: 1,
        archivos: 'archivo.zip',
        
        // archivos: 'archivo.zip'
        UsuarioId: 'cb8bcb308b7ccf1'
      })
      
      this.formularioPublicacion.setErrors(null)

      // desabilitar atributos que no son para el formulario de producto
      this.formularioPublicacion.get('fechaInicio')?.disable()
      this.formularioPublicacion.get('fechaTermino')?.disable()
      this.formularioPublicacion.get('horasATrabajar')?.disable()

      // habilito los atributos que pudiesen estar deshabilitados
      this.formularioPublicacion.get('cantidad')?.enable()
      this.formularioPublicacion.get('precioPorUnidad')?.enable()
      this.formularioPublicacion.get('modelo')?.enable()
      this.formularioPublicacion.get('color')?.enable()

      this.formularioPublicacion.patchValue({
        productoOServicio: 'Producto',
        cantidad: 1,
        garantia: false,
        aniosGarantia: null
      });

    }

    if (res == 'Servicio') {
      // console.log(' Es Servicio')
      this.formularioPublicacion.reset()
      this.formularioPublicacion.setErrors(null)

       //quitar estas lineas solo test
       this.formularioPublicacion.patchValue({
        titulo: 'Adquisicion de articulos de aseo y ornato',
        descripcion: 'La empresa XXXX necesita articulos para desempeñar sus funciones de aseo en la comuna de san antonio',
        productoOServicio: 'Servicio',
        totalPrecio: 15000,
        fechaInicio: '',
        fechaTermino: '',
        horasATrabajar: 1,
        garantia: false,
        aniosGarantia: null,
        archivos: 'archivo.zip',
        
        // archivos: 'archivo.zip'
        UsuarioId: 'cb8bcb308b7ccf1'
      })

      // Desabilitar atributos que no son para el formulario de servicio
      this.formularioPublicacion.get('cantidad')?.disable()
      this.formularioPublicacion.get('precioPorUnidad')?.disable()
      this.formularioPublicacion.get('modelo')?.disable()
      this.formularioPublicacion.get('color')?.disable()

      // Habilito los atributos que pudiesen estar deshabilitados
      this.formularioPublicacion.get('fechaInicio')?.enable()
      this.formularioPublicacion.get('fechaTermino')?.enable()
      this.formularioPublicacion.get('horasATrabajar')?.enable()
  

      this.formularioPublicacion.patchValue({
        productoOServicio: 'Servicio',
        cantidad: 1,
        garantia: false,
        aniosGarantia: null
      });
    }
  }

  // Obtiene valor de garantia y habilitar o desabilitar el campo años de garantia
  tieneGarantia() {

    const garantia = this.formularioPublicacion.get('garantia')?.value
    // console.log(garantia)
    if (!garantia) {
      // this.formularioPublicacion.get('aniosGarantia')?.reset()
      // return this.formularioPublicacion.get('aniosGarantia')?.enable()
      return false

    } else {
      // this.formularioPublicacion.get('aniosGarantia')?.reset()
      // return this.formularioPublicacion.get('aniosGarantia')?.disable()
      return true
    }

  }

  // Calcula el total en base el precio por unidad * cantidad
  calcularTotal() {
    const cantidad = this.formularioPublicacion.get('cantidad')?.value
    const precioPorUnidad = this.formularioPublicacion.get('precioPorUnidad')?.value

    return this.formularioPublicacion.patchValue({ 'totalPrecio': cantidad * precioPorUnidad })
  }

  enviarPublicacion() {

    if (this.formularioPublicacion.invalid) {
      this.formularioPublicacion.markAllAsTouched()
      return
    }

    // creacion de objeto para enviar a la petición
    const nuevaPublicacion = {
      titulo : this.formularioPublicacion.get('titulo')?.value,
      descripcion : this.formularioPublicacion.get('descripcion')?.value,
      productoOServicio : this.formularioPublicacion.get('productoOServicio')?.value,
      cantidadElementos : this.formularioPublicacion.get('cantidad')?.value,
      precioPorUnidad : this.formularioPublicacion.get('precioPorUnidad')?.value,
      precioTotal : this.formularioPublicacion.get('totalPrecio')?.value,
      modelo : this.formularioPublicacion.get('modelo')?.value,
      color : this.formularioPublicacion.get('color')?.value,
      fechaInicioServicio : this.formularioPublicacion.get('fechaInicio')?.value,
      fechaFinServicio : this.formularioPublicacion.get('fechaTermino')?.value,
      horasATrabajar : this.formularioPublicacion.get('horasATrabajar')?.value,
      garantia : this.formularioPublicacion.get('garantia')?.value,
      aniosGarantia : this.formularioPublicacion.get('aniosGarantia')?.value,
      archivos : this.formularioPublicacion.get('archivos')?.value,

      // UsuarioId referencia el ususario creador
      UsuarioId : this.authService.usuario.id
    }

    // Parseo la fecha para que la bd la reconozca como valida
    if(nuevaPublicacion.productoOServicio === 'Servicio'){
      nuevaPublicacion.fechaFinServicio = moment(nuevaPublicacion.fechaFinServicio).format()
      nuevaPublicacion.fechaInicioServicio = moment(nuevaPublicacion.fechaInicioServicio).format()
    }

    // Envio de datos con el servicio
    this.publicacionService.postPublicacion(nuevaPublicacion).subscribe(data => console.log( 'suscribe : ', data))
    // console.log(nuevaPublicacion)
    // this.publicacionService.postPublicacion(this.formularioPublicacion.value).subscribe(data => {
    //   console.log(data)
    //   this.router.navigate(['see-publications'])

    //   this.showSuccess('Nuevo usuario', 'Usuario guardado exitosamente!');
    //   setInterval(() => {
    //     this.router.navigate(['/see-publications'])
    //   }, 3000)
    // })

  }

  showSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary: summary, detail: detail });
  }

  campoInvalido(campo: string) {
    return this.formularioPublicacion.get(campo)?.errors
      && this.formularioPublicacion.get(campo)?.touched
  }

}
