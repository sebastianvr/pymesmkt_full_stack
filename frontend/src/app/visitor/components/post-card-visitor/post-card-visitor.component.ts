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

  // data: any[] = []
  publicaciones!: any[]
  empresa!: any
  idUsuario!: string

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
    this.publicacionService.getAllPublicaciones(0, 10)
      .subscribe(({ content, totalPages }) => {
        this.publicaciones = content
        console.log(this.publicaciones)
      })
  }

}
