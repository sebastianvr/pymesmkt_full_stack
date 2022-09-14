import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegionesComunasService } from 'src/app/core/services/regiones-comunas/regiones-comunas.service';

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
