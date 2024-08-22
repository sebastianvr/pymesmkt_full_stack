import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OfertaService } from '../../../core/services/oferta/oferta.service';
import { PagoService } from '../../../core/services/pago/pago.service';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';
import { CompraService } from '../../../core/services/compra/compra.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.css']
})
export class OfferDetailComponent implements OnInit {

  garantiaMapa = {
    'true': 'Si',
    'false': 'No'
  };

  idUser!: string;
  oferta: any
  transactionButton: any = {};
  compra: any = {};
  pago: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private ofertaService: OfertaService,
    private publicacionService: PublicacionService,
    private pagoService: PagoService,
    private compraService: CompraService
  ) { }

  ngOnInit(): void {
    this.idUser = this.authService.usuario.id;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          this.ofertaService.getOfertaById(id)
            .pipe(
              tap(({ oferta }) => {
                this.pago = {
                  amount: oferta.precioOferta,
                  returnUrl: location.href.toString()
                };

                this.pagoService.getTransaccion(this.pago).subscribe((res2) => {
                  this.transactionButton = res2;
                })
              })
            )
        ),

      )
      .subscribe((res) => {
        this.oferta = res.oferta;
      });

    this.activatedRoute.queryParams.
      subscribe(({ token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION }) => {

        /**
         * *Si ocurre un error en el formulario de pago, y hace click en el link de "volver al sitio" de la pantalla 
         * de error: (replicable solo en producción si inicias una transacción, abres el formulario de pago, cierras el 
         * tab de Chrome y luego lo recuperas) Llegará token_ws, TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA.
         */
        if (token_ws && TBK_TOKEN && TBK_ID_SESION && TBK_ORDEN_COMPRA) {
          return console.log('Algo extraño pasó');
        }

        /**
        * Pago abortado (con botón anular compra en el formulario de Webpay):
        *  Llegará TBK_TOKEN (notar que no se llama token_ws, pero igualmente 
        * contiene el token de la transacción), TBK_ID_SESION, TBK_ORDEN_COMPRA
        */
        if (TBK_TOKEN && TBK_ID_SESION && TBK_ORDEN_COMPRA) {
          return console.log('Pago abortado');
        }

        /**
         * Timeout (más de 10 minutos en el formulario de Transbank): Llegará 
         * solamente TBK_ID_SESION que contiene el session_id enviado al crear la 
         * transacción, TBK_ORDEN_COMPRA que representa el buy_order enviado. 
         * No llegará token.
         */
        if (TBK_ID_SESION && TBK_ORDEN_COMPRA) {
          return console.log('TIME OUT');
        }

        /**
        * Flujo normal: El usuario al finalizar la transacción (tanto si es 
        * un rechazo o una aprobación) llegará solamente token_ws.
        */
        if (token_ws) {
          return this.pagoService.getCommitPago(token_ws).subscribe(({ viewData }) => {
            if (viewData.commitResponse.details[0].status === 'AUTHORIZED') {
              // Cambiar publicacion a FINALIZADA
              this.publicacionService.aceptarPublicacion(this.oferta.PublicacionId).subscribe((res) => {
                console.log('aceptarPublicacion', res)
              });

              // Cambiar proceso de oferta a FINALIZADA
              this.ofertaService.aceptaOferta(this.oferta.id).subscribe((res) => {
                console.log('aceptaOferta', res);
              })

              // Crear nueva compra en la tabla compras
              this.compra = {
                precio: viewData.commitResponse.details[0].amount,
                codAutorizacion: viewData.commitResponse.details[0].authorization_code,
                PublicacionId: this.oferta.PublicacionId,
                UsuarioId: this.idUser,
                OfertumId: this.oferta.id

              }

              // Hacer peticion post con la compra creada
              this.compraService.postCompra(this.compra)
                .subscribe((data) => {
                  console.log('postCompra', data);
                  if (!data) {
                    console.log('data existe');
                  }
                });

              // Mostrar pago aceptado
              Swal.fire({
                icon: 'success',
                title: 'Tu pago se ha realizado con exito',
                showConfirmButton: true,
                confirmButtonText: 'Continuar',
                customClass: {
                  confirmButton: 'btn btn-success px-4',
                },
                buttonsStyling: false
              })

              // Desplegar modal con detalles de la compra
              this.router.navigate([`user/purchases/`])
            }

            if (viewData.commitResponse.details[0].status === 'FAILED') {
              // Mostrar pago fallido
              Swal.fire({
                icon: 'warning',
                iconColor: 'red',
                title: 'Tu pago falló, intentalo más tarde',
                showConfirmButton: true,
                confirmButtonText: 'Cerrar',
                customClass: {
                  confirmButton: 'btn btn-primary px-4',
                },
                buttonsStyling: false
              });
              this.router.navigate(['/user/offers-received'])
            }

          });
        }
      });
  }
}
