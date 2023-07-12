import { Component, OnInit } from '@angular/core';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';


@Component({
  selector: 'app-post-card-visitor',
  templateUrl: './post-card-visitor.component.html',
  styleUrls: ['./post-card-visitor.component.css']
})
export class PostCardVisitorComponent implements OnInit {

  publicaciones!: any[]
  empresa!: any
  idUsuario!: string

  isEmptyPublicaciones : boolean = true
  isLoading : boolean = true

  // Pagina actual
  page = 0;
  // Tamaño de elementos por página
  size = 5;
  // Representa a la cantidad total de publicaciones creadas
  numElement!: number;

  // pipe personalizado
  garantiaMapa = {
    'true': 'Si',
    'false': 'No'
  }

  constructor(
    private publicacionService: PublicacionService,
  ) { }

  ngOnInit(): void {
    this.getPublicaciones();
  }

  getPublicaciones() {
    this.publicacionService.getAllPublicaciones(this.page, this.size)
      .subscribe(({ content, totalPages }) => {
        this.publicaciones = content;
        this.numElement = totalPages * this.size;
        this.isEmptyPublicaciones = content.length === 0;
        this.isLoading = false;
      })
  }

  done() {
    this.getPublicaciones();
  }

  selectPage(page: any) {
    // Validar que la página sea un número válido
    if (Number.isInteger(Number(page))) {
      this.page = Number(page);
      this.getPublicaciones();
    }
  }

  formatInput(target: any) {
    // Validar y formatear el valor ingresado en el campo de entrada de paginación
    const value = target.value.trim();
    if (value !== '') {
      target.value = Math.max(1, Math.min(value, this.numElement));
    }
  }
}
