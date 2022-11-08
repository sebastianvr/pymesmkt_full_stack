import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { OfertaService } from '../../../core/services/oferta/oferta.service';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
;

@Component({
  selector: 'app-offers-made',
  templateUrl: './offers-made.component.html',
  styleUrls: ['./offers-made.component.css']
})
export class OffersMadeComponent implements OnInit, OnDestroy {


  ofertas: any[] = [];
  token: string = '';
  url: string = '';



  suscription!: Subscription
  constructor(
    private router: Router,
    private ofertaService: OfertaService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // console.log('this.authService.usuario.id : ', this.authService.usuario.id)
    this.getOfertas();
    this.suscription = this.ofertaService.refresh$.subscribe(() => {
      this.getOfertas();
    });
  }

  getOfertas() {
    this.ofertaService.getOfertasRealizadas(this.authService.usuario.id).subscribe((data) => {
      this.ofertas = data.content
      console.log('getOfertasRealizadas: ', data)
      console.log('this.ofertas: ', this.ofertas)
    })
  }


  eliminarOferta(idOferta: string) {
    console.log(idOferta)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de borrar tu oferta?',
      text: "Tu oferta será eliminada, no podrás revertir esto!",
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
        })

        swalWithBootstrapButtons.fire(
          'Oferta eliminada',
          '',
          'success'
        )
      }
    })
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
