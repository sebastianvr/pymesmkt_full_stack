import { Component, OnInit } from '@angular/core';
import { RegionesComunasService } from '../../../core/services/regiones-comunas/regiones-comunas.service';
import { Router } from '@angular/router';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  allPublicaciones : any[] = []
  regiones : any
  get publicaciones(){
    return {...this.allPublicaciones}
  }  
  constructor(
    private router : Router,
    private regionesComunas : RegionesComunasService,
    private publicacionesService : PublicacionService,
  ) { }



  ngOnInit(): void {
    this.regiones = this.regionesComunas.getRegiones()
    this.publicacionesService.getAllPublicaciones()
      .subscribe( ({content}) => {
        this.allPublicaciones = content
        // console.log(content)
      })
  }

}
