import { Component, OnInit } from '@angular/core';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PymeServiceService } from '../../../core/services/pyme/pyme-service.service';

@Component({
  selector: 'app-post-card-visitor',
  templateUrl: './post-card-visitor.component.html',
  styleUrls: ['./post-card-visitor.component.css']
})
export class PostCardVisitorComponent implements OnInit {

  publicaciones!: any[]
  empresa!: any
  idUsuario!: string


  // Pagina actual
  page = 0;
  // Tamaño de elementos por página
  size = 2;
  // Representa a la cantidad total de publicaciones creadas
  numElement!: number;

  garantiaMapa = {
    'true': 'Si',
    'false': 'No'
  }

  // para realizar oferta
  maxPrice!: number;
  mensaje!: string;

  constructor(
    private publicacionService: PublicacionService,
    private authService: AuthService,
    private pymeService: PymeServiceService
  ) { }

  ngOnInit(): void {
    this.getPublicaciones();
  }

  getPublicaciones() {
    this.publicacionService.getAllPublicaciones(this.page - 1, this.size)
      .subscribe(({ content, totalPages }) => {
        
        this.publicaciones = content;
        this.numElement = totalPages * this.size;
      })
  }

  done() {
    this.getPublicaciones();
  }
}
