import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { OfertaService } from '../../../core/services/oferta/oferta.service';
import { tap } from 'rxjs/operators';
import { PagoService } from '../../../core/services/pago/pago.service';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.css']
})
export class OfferDetailComponent implements OnInit, OnDestroy {

  oferta: any
  transactionButton : any = {}
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ofertaService: OfertaService,
    private pagoService: PagoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          this.ofertaService.getOfertaById(id)
            .pipe(
              tap(({ oferta }) => {
                // console.log('tap res: ', oferta)
                const pago = {
                  amount: oferta.precioOferta,
                  returnUrl: location.href.toString()
                }

                // console.log('pago :', pago)
                this.pagoService.getTransaccion(pago).subscribe((res2) => {
                  console.log('res2 ', res2)
                  this.transactionButton = res2
                  console.log(this.transactionButton)
                })
              })
            )
        ),
      )
      .subscribe((res) => {
        this.oferta = res
        console.log('this.oferta : ',this.oferta)
      })
  }

  ngOnDestroy(): void {

  }

}
