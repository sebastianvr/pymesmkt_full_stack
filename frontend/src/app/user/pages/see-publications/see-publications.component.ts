import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-see-publications',
  templateUrl: './see-publications.component.html',
  styleUrls: ['./see-publications.component.css']
})
export class SeePublicationsComponent implements OnInit {

  fecha!: Date;
  usuario: any
  cards: any[] = [];


  data!: any[]
  constructor(
    private fb: FormBuilder,
    private publicacionService: PublicacionService,
    private authService: AuthService
  ) {
    this.usuario = this.authService.usuario
    // console.log('this.usuario :', this.usuario)

  }

  // crear formulario
  formularioBusqueda: FormGroup = this.fb.group({
    titulo: ['', Validators.required],
    fecha: ['', Validators.required]
  })

  ngOnInit(): void {
    this.publicacionService.getAllPublicacionById(this.usuario.id).subscribe(data => {
      console.log('data ',data)
      
      this.cards = data.content
      console.log('this.cards', this.cards)
      
      // if(!this.cards){

      // }
    })
  }

  buscar() {
    // console.log(this.cards)
  }

  getPublicacionesPorId() {

  }
}
