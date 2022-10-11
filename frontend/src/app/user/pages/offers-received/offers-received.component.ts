import { Component, OnInit } from '@angular/core';
import { OfertaService } from '../../../core/services/oferta/oferta.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { PagoService } from '../../../core/services/pago/pago.service';
import { query } from '@angular/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-offers-received',
  templateUrl: './offers-received.component.html',
  styleUrls: ['./offers-received.component.css']
})
export class OffersReceivedComponent implements OnInit {

  publicaciones: any;
  token: string = '';
  url: string = '';

  closeResult: string = ''

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
    this.ofertaService.getOfertasRecibidas(this.authService.usuario.id).subscribe((data) => {
      this.publicaciones = data.ofertas
      console.log(data)

      // this.pagoService.getTransaccion(data).subscribe((data) => {
      //   console.log(data)
      //   this.token = data.token
      //   this.url = data.url
      // })



    })

    // this.pagoService.getTransaccion(this.data).subscribe((data) => {
    //   // console.log(data)
    //   this.token = data.token
    //   this.url = data.url
    //   // console.log('location.href', location.xhref)
    // })

  }

  eliminarOferta(idOferta: string) {
    console.log(idOferta)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar esta oferta?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'Tu oferta ha sido eliminada.',
          'success'
        )
        // this.publicacionService.deletePublicacion(this.publicacion.id).subscribe()

        this.ofertaService.deleteOferta(idOferta).subscribe((data) => {
          console.log(data)
          // this.router.navigate(['/user/offers-received'])
          window.location.reload()
        })

        // } else if (result.dismiss === Swal.DismissReason.cancel) {
        //   swalWithBootstrapButtons.fire(
        //     'Cancelado',
        //     '',
        //     'error'
        //   )
      }
    })
  }


  data = {
    amount: 70000,
    address: location.href
  }

  acceptarOferta() {

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
