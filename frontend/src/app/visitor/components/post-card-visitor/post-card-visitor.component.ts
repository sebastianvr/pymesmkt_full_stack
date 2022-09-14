import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-card-visitor',
  templateUrl: './post-card-visitor.component.html',
  styleUrls: ['./post-card-visitor.component.css']
})
export class PostCardVisitorComponent implements OnInit {

  data: any[] = []
  
  constructor() { }

  ngOnInit(): void {
    this.data = [
      {
        id: 'fsm2vsgo1pr',
        titulo: 'ADQ. BASTÓN RETRÁCTIL',
        productoOServicio: 'producto',
        descripcion: 'NECESIDAD DE MATERIALIZAR LA ADQUISICIÓN DE BASTÓN RETRÁCTIL PARA EMPRESA DE SEGURIDAD, CON LA FINALIDAD QUE EL PERSONAL DE LA INSTITUCIÓN CUENTE CON LOS ELEMENTOS NECESARIOS PARA DESARROLLAR DE BUENA MANERA SUS FUNCIONES.',
        usado: null,
        precioMax: 150000,
        cantidad: 5,
        color: undefined,
        modelo: undefined,
        horasATrabajar: null,
        estado: 'Sé el primero en ofertar',
        fechaExpiracion: new Date(),
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        nombreEmpresa: 'MaxSecuity Ltda',
        garantia: true,
        archivo: 'alskdaASDAJDqqwQJJSskaJANjsAASJskJSNNNBBBnnansnNABWBABbanwwwS',
      },
      {
        id: 'fsm2vsgo1pr',
        titulo: 'ADQ. BASTÓN RETRÁCTIL',
        productoOServicio: 'producto',
        descripcion: 'NECESIDAD DE MATERIALIZAR LA ADQUISICIÓN DE BASTÓN RETRÁCTIL PARA EMPRESA DE SEGURIDAD, CON LA FINALIDAD QUE EL PERSONAL DE LA INSTITUCIÓN CUENTE CON LOS ELEMENTOS NECESARIOS PARA DESARROLLAR DE BUENA MANERA SUS FUNCIONES.',
        usado: null,
        precioMax: 150000,
        cantidad: 5,
        color: undefined,
        modelo: undefined,
        horasATrabajar: null,
        estado: '2 ofertas realizadas',
        fechaExpiracion: new Date(),
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        nombreEmpresa: 'MaxSecuity Ltda',
        garantia: true,
        archivo: 'alskdaASDAJDqqwQJJSskaJANjsAASJskJSNNNBBBnnansnNABWBABbanwwwS',
      }
    ]
  }

}
