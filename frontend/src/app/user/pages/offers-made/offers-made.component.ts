import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { OfertaService } from 'src/app/core/services/oferta/oferta.service';
import { PagoService } from 'src/app/core/services/pago/pago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offers-made',
  templateUrl: './offers-made.component.html',
  styleUrls: ['./offers-made.component.css']
})
export class OffersMadeComponent implements OnInit {
  ofertas: any;
  token: string = '';
  url: string = '';

  constructor(
    private router: Router,
    private ofertaService: OfertaService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    console.log('this.authService.usuario.id : ', this.authService.usuario.id)
    this.ofertaService.getOfertasRealizadas(this.authService.usuario.id).subscribe((data) => {
      this.ofertas = data.content
      console.log(data)

      // this.pagoService.getTransaccion(data).subscribe((data) => {
      //   console.log(data)
      //   this.token = data.token
      //   this.url = data.url
      // })
    })

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

}
