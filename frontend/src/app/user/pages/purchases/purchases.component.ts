import { Component, OnInit, OnDestroy } from '@angular/core';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { CompraService } from '../../../core/services/compra/compra.service';
import { ReclamoService } from '../../../core/services/reclamo/reclamo.service';
import Swal from 'sweetalert2';
import { CalificacionService } from '../../../core/services/calificacion/calificacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {

  usuario: any
  cards: any
  uploadedFiles: any[] = []

  compras: any

  modalReference!: NgbModalRef
  closeResult = '';


  suscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private modalService: NgbModal,
    private authService: AuthService,
    private publicacionService: PublicacionService,
    private compraService: CompraService,
    private reclamoService: ReclamoService,
    private calificacionService: CalificacionService
  ) {

    // Reseteo el formulario 
    this.formularioReporte.reset({
      titulo: 'Tuve un problema con mis productos ',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam sit quidem molestiae. Magnam sit quidem molestiae. Magnam sit quidem molestiae.',
      archivos: ['archivo.zip', []],
    });

    this.formularioCalificacion.reset({
      // reseña: [null, [Validators.required]],
      calificacion: [0, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.getCompras();
    // this.suscription = this.compraService.refresh$.subscribe(() => {
    //   this.getCompras();
    // })
  }

  getCompras() {
    this.compraService.getAllComprasById(this.authService.usuario.id, 0, 10)
      .subscribe((res) => {
        this.compras = res.content
        console.log('this.compras: ', this.compras)
      })
  }

  formularioReporte: FormGroup = this.fb.group({
    titulo: [null, [Validators.required]],
    descripcion: [null, [Validators.required]],
    archivos: [null, []],
  })

  formularioCalificacion: FormGroup = this.fb.group({
    reseña: [null, [Validators.required]],
    calificacion: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
  })

  onUpload(event: any) {
    console.log('asdasdasd', this.uploadedFiles)
    console.log('event', event)

    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

      //Al quitar el modal, reseteo los formularios
      this.formularioCalificacion.reset()
      this.formularioReporte.reset()
    });


  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  enviarReporte(usuarioId: string, publicacionId: string) {
    // console.log('this.uploadedFiles ', this.uploadedFiles)
    // console.log(this.formularioReporte.value)

    // enviar a la base de datos el reclamo
    const nuevoReclamo = {
      titulo: this.formularioReporte.get('titulo')?.value,
      mensaje: this.formularioReporte.get('descripcion')?.value,
      documento: this.formularioReporte.get('archivos')?.value,
      PublicacionId: publicacionId,
      // id del usuario que RECIBIRÁ el reclamo
      UsuarioId: usuarioId
    }

    console.log(nuevoReclamo)

    this.reclamoService.postReclamo(nuevoReclamo).subscribe(console.log).unsubscribe();


    // cerrar ventana emergente 
    this.modalService.dismissAll()

    // mostrar mensaje Swal de exito
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Tu reclamo ha sido enviado!',
      showConfirmButton: false,
      timer: 4000
    }).then((result) => {
      if (result) {

      }
    })
  }

  enviarCalificacion(UsuarioId: string, CompraId: string) {

    // Capturar de los datos 
    const nuevaCalificacion = {
      reseña: this.formularioCalificacion.get('reseña')?.value,
      puntaje: this.formularioCalificacion.get('calificacion')?.value,

      // Usuario que recibe la calificacion
      UsuarioId,
      // Compra que recibe la calificacion
      CompraId
    }

    console.log('nuevaCalificacion ', nuevaCalificacion)
    this.calificacionService.postCalificacion(nuevaCalificacion).subscribe(console.log)

    // cerrar ventana emergente 
    this.modalService.dismissAll()

    // mostrar mensaje Swal de exito
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Tu reseña ha sido guardada!',
      showConfirmButton: false,
      timer: 3000
    }).then((result) => {
      if (result) {

      }
    })
  }

  // ngOnDestroy(): void {
  //   this.suscription.unsubscribe();
  //   console.log('this.suscription.unsubscribe success')
  // }

  campoInvalidoReporte(campo: string) {
    return this.formularioReporte.get(campo)?.errors
      && this.formularioReporte.get(campo)?.touched
  }

  campoInvalidoCalificacion(campo: string) {
    return this.formularioCalificacion.get(campo)?.errors
      && this.formularioCalificacion.get(campo)?.touched
  }
}
