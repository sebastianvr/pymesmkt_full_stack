import { Component, OnInit } from '@angular/core';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';

@Component({
  selector: 'app-post-card-visitor',
  templateUrl: './post-card-visitor.component.html',
  styleUrls: ['./post-card-visitor.component.css'],
})
export class PostCardVisitorComponent implements OnInit {

  publicaciones!: any[];
  idUsuario!: string;
  empresa!: any;

  isEmptyPublicaciones: boolean = false;
  isLoading: boolean = true;

  // Paginación
  page: number = 0;
  size: number = 10;
  totalPublications!: number;
  FILTER_PAG_REGEX: RegExp = /[^0-9]/g;

  // Pipe
  garantiaMapa = {
    'true': 'Si',
    'false': 'No',
  }

  constructor(
    private publicacionService: PublicacionService,
  ) { }

  ngOnInit(): void {
    this.getPublicaciones(this.page, this.size);
  }

  getPublicaciones(page: number, size: number) {
    // console.log('getPublicaciones()');
    
    // OJO QUE CONSULTA 3 VECES NO SE POR QUE
    this.publicacionService.getAllPublicaciones(page, size)
      .subscribe((result) => {
        // console.log({ result });
        const { content, totalPages } = result;
        this.publicaciones = content;
        this.totalPublications = totalPages * this.size;

        this.isEmptyPublicaciones =
          content.length === 0 && totalPages === 0; // Actualiza isEmptyPublicaciones

        this.isLoading = false;
      });
  }

  onPageChange(newPage: number) {
    // console.log('onPageChange()');

    this.page = newPage - 1;
    this.getPublicaciones(this.page, this.size);
  }
}
