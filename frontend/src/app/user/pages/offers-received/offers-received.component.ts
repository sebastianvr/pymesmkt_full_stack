import { Component, OnInit } from '@angular/core';
import { OfertaService } from '../../../core/services/oferta/oferta.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers-received',
  templateUrl: './offers-received.component.html',
  styleUrls: ['./offers-received.component.css']
})
export class OffersReceivedComponent implements OnInit {

  publicaciones: any;

  constructor(
    private router: Router,
    private ofertaService: OfertaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.ofertaService.getOfertas(this.authService.usuario.id).subscribe((data) => {
      this.publicaciones = data.ofertas
      console.log(data)
    })
  }

  // eliminarOferta(idOferta : string){

  // }

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
      title: '¿Estás seguro de eliminar la publicación?',
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
          'Tu publicación ha sido eliminada.',
          'success'
        )
        // this.publicacionService.deletePublicacion(this.publicacion.id).subscribe()
        
        this.ofertaService.deleteOferta(idOferta).subscribe((data) => {
          console.log(data)
          // this.router.navigate(['/user/offers-received'])
          window.location.reload()
        })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          '',
          'error'
        )
      }
    })
  }

  acceptarOferta() {

  }

}
