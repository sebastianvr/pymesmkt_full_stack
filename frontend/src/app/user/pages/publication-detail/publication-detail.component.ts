import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';

@Component({
  selector: 'app-publication-detail',
  templateUrl: './publication-detail.component.html',
  styleUrls: ['./publication-detail.component.css']
})
export class PublicationDetailComponent implements OnInit {
  compras: any
  publicacion!: any

  garantiaMapa = {
    'true': 'Si',
    'false': 'No'
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicacionService: PublicacionService
  ) {


    this.compras = [
      //   {
      //     id: 'fsm2vsgo1pr',
      //     titulo: 'Adquisición de 40 sacos de harina de trigo',
      //     productoOServicio: 'producto',
      //     descripcion: 'La panadería el molino busca proveedoor de sacos de harina marca "XXXXXXX" sin polvos de hornear, para elaboración pan y pasteles',
      //     usado: null,
      //     precio: 1500000,
      //     cantidad: 40,
      //     color: undefined,
      //     modelo: undefined,
      //     horasATrabajar: null,
      //     estado: 'Sé el primero en ofertar',
      //     fechaExpiracion: new Date(),
      //     fechaCreacion: new Date(),
      //     estadoDeCompra: 'Compra finalizada',
      //     fechaActualizacion: new Date(),
      //     nombreEmpresa: 'Heredia Ltda.',
      //     garantia: true,
      //     archivo: 'alskdaASDAJDqqwQJJSskaJANjsAASJskJSNNNBBBnnansnNABWBABbanwwwS',
      //     proveedor: 'Juan Santana Jorquera',
      //   },
      //   {
      //     id: 'aqn5vhgo5ir',
      //     titulo: 'Adquisición 40 kilos de dulce de leche ',
      //     productoOServicio: 'producto',
      //     descripcion: 'La panadería el molino busca proveedoor de dulce de leche, para pasteles y tartas , de preferencia marca "XXXXXXX"',
      //     usado: null,
      //     precio: 4500000,
      //     cantidad: null,
      //     color: undefined,
      //     modelo: undefined,
      //     horasATrabajar: null,
      //     estado: 'Sé el primero en ofertar',
      //     fechaExpiracion: new Date(),
      //     fechaCreacion: new Date(),
      //     estadoDeCompra: 'Compra en proceso',
      //     fechaActualizacion: new Date(),
      //     nombreEmpresa: 'Heredia Ltda.',
      //     garantia: true,
      //     archivo: 'alskdaASDAJDqqwQJJSskaJANjsAASJskJSNNNBBBnnansnNABWBABbanwwwS',
      //     proveedor: 'Juan Santana Jorquera',
      //   }

    ]
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          this.publicacionService.getPublicacionById(id)
        )
      )
      .subscribe(({ publicacion }) => {
        this.publicacion = publicacion
        console.log(this.publicacion)
      })

  }

}
