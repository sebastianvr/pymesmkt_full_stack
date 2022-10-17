import { Component, OnInit, OnDestroy } from '@angular/core';
import { OfertaService } from '../../../core/services/oferta/oferta.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { PagoService } from '../../../core/services/pago/pago.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers-received',
  templateUrl: './offers-received.component.html',
  styleUrls: ['./offers-received.component.css']
})
export class OffersReceivedComponent implements OnInit, OnDestroy {

  publicaciones: any[] = [];
  token: string = '';
  url: string = '';

  closeResult: string = ''

  suscription!: Subscription;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ofertaService: OfertaService,
    private authService: AuthService,
    private pagoService: PagoService,
    private modalService: NgbModal



  ) {

    // this.activatedRoute.queryParams.subscribe(({ token_ws }) => {

    //   if (token_ws) {
    //     this.pagoService.getCommitPago(this.token).subscribe((data)=>{
    //       console.log(data)
    //     })

    //     // console.log('data', token_ws)
    //     // Mostrar pago aceptado
    //     // Swal.fire({
    //     //   icon: 'success',
    //     //   title: 'Tu pago se ha realizado con exito',
    //     //   text: "Revisa tus compras en el menú principal",
    //     //   showConfirmButton: true,
    //     //   // timer: 2500
    //     // })
    //   }
    // })
  }

  ngOnInit(): void {
    this.getOfertas();
    this.suscription = this.ofertaService.refresh$.subscribe(() => {
      this.getOfertas();
    })

    // this.pagoService.getTransaccion(this.data).subscribe((data) => {
    //   // console.log(data)
    //   this.token = data.token
    //   this.url = data.url
    //   // console.log('location.href', location.xhref)
    // })
  }

  ngOnDestroy(): void {
      this.suscription.unsubscribe();
  }

  getOfertas() {
    this.ofertaService.getOfertasRecibidas(this.authService.usuario.id).subscribe((data) => {
      this.publicaciones = data.ofertas
      console.log('this.publicaciones : ', this.publicaciones)
    })
  }

  eliminarOferta(idOferta: string) {
    // console.log(idOferta)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de rechazar esta oferta?',
      text: "Esta oferta será eliminada, no podrás revertir esto!.",
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.ofertaService.deleteOferta(idOferta).subscribe((data) => {
          console.log(data)
          // window.location.reload()
        })

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'La oferta ha sido descartada.',
          'success'
        )

      }
    })
  }


  data = {
    amount: 70000,
    address: location.href
  }

  aceptarOferta() {
    Swal.fire({
      title: 'Aviso de redireccionamiento',
      text: "A continuación serás redirijido a el sistema de pago transbank",
      icon: 'info',

      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ir a pagar!',
      cancelButtonText: 'Salir'
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )

        // 
      }
    })
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

}
