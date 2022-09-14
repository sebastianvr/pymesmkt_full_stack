import { Component, OnInit } from '@angular/core';
import { RegionesComunasService } from '../../../core/services/regiones-comunas/regiones-comunas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  regiones : any
    
  constructor(
    private regionesComunas : RegionesComunasService,
    private router : Router
  ) { }



  ngOnInit(): void {
    this.regiones = this.regionesComunas.getRegiones()
    
  }

}
