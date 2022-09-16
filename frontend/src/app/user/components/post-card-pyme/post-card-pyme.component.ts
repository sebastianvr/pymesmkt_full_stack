import { Component, Input, OnInit } from '@angular/core';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';

@Component({
  selector: 'app-post-card-pyme',
  templateUrl: './post-card-pyme.component.html',
  styleUrls: ['./post-card-pyme.component.css']
})
export class PostCardPymeComponent implements OnInit {

  publicaciones! : any[]
  data: any[] = [];

  garantiaMapa = {
    'true': 'Si',
    'false': 'No'
  }

  // para realizar oferta
  maxPrice!: number;
  mensaje!: string;

  constructor(
    private publicacionService : PublicacionService 
  ) {
    this.data = [
      {
        id: 'fsm2vsgo1pr',
        titulo: 'ADQ. BASTÓN RETRÁCTIL',
        productoOServicio: 'producto',
        descripcion: 'NECESIDAD DE MATERIALIZAR LA ADQUISICIÓN DE BASTÓN RETRÁCTIL PARA EMPRESA DE SEGURIDAD, CON LA FINALIDAD QUE EL PERSONAL DE LA INSTITUCIÓN CUENTE CON LOS ELEMENTOS NECESARIOS PARA DESARROLLAR DE BUENA MANERA SUS FUNCIONES.',
        usado: null,
        precioMax: 1500000,
        cantidad: 5,
        color: undefined,
        modelo: undefined,
        horasATrabajar: null,
        ofertasRecibidas: 'Sé el primero en ofertar',
        fechaExpiracion: new Date(),
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        nombreEmpresa: 'MaxSecuity Ltda',
        calificacion: 5,
        garantia: true,
        aniosGarantia : 3,
        archivo: 'alskdaASDAJDqqwQJJSskaJANjsAASJskJSNNNBBBnnansnNABWBABbanwwwS',
      },
      {
        id: 'fsm2vsgo1pr',
        titulo: 'ADQ. BASTÓN RETRÁCTIL',
        productoOServicio: 'producto',
        descripcion: 'NECESIDAD DE MATERIALIZAR LA ADQUISICIÓN DE BASTÓN RETRÁCTIL PARA EMPRESA DE SEGURIDAD, CON LA FINALIDAD QUE EL PERSONAL DE LA INSTITUCIÓN CUENTE CON LOS ELEMENTOS NECESARIOS PARA DESARROLLAR DE BUENA MANERA SUS FUNCIONES.',
        usado: null,
        precioMax: 450000,
        cantidad: 5,
        color: undefined,
        modelo: undefined,
        horasATrabajar: null, 
        ofertasRecibidas: '2 ofertas recibidas',
        fechaExpiracion: new Date(),
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        nombreEmpresa: 'MaxSecuity Ltda',
        calificacion: 5,
        garantia: true,
        aniosGarantia : 3,
        archivo: null,
      }
    ]
  }
  
  ngOnInit(): void {
    this.publicacionService.getAllPublicaciones()
      .subscribe(({content, totalPages}) => {
        this.publicaciones = content
        console.log(this.publicaciones)
      })
  }

  

  

}
