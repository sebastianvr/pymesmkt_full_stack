import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-see-publications',
  templateUrl: './see-publications.component.html',
  styleUrls: ['./see-publications.component.css']
})
export class SeePublicationsComponent implements OnInit {

  fecha!: Date;
  usuario: any
  cards: any[] = [];


  data! : any[]
  constructor(
    private fb: FormBuilder,
    private publicacionService: PublicacionService,
    private authService: AuthService

  ) {
    this.usuario = this.authService.usuario
    
  }



  // crear formulario
  formularioBusqueda: FormGroup = this.fb.group({
    titulo: ['', Validators.required],
    fecha: ['', Validators.required]
  })

  ngOnInit(): void {
    this.publicacionService.getAllPublicacionById(this.usuario.id).subscribe(data => {
      this.cards = data.content
      console.log(this.cards)
    })

    // this.data = [
    //   {
    //     id: 'fsm2vsgo1pr',
    //     titulo: 'Adquisición de 40 sacos de harina de trigo',
    //     fecha: new Date(),
    //     estado: 'Publicación finalizada',
    //     descripcion: 'La panadería el molino busca proveedoor de sacos de harina marca "XXXXXXX" sin polvos de hornear, para elaboración pan y pasteles',
    //     montoDisponible: 159990

    //   },
    //   {
    //     id: 'gkm5zsgo1po',
    //     titulo: 'Adquisición 40 kilos de dulce de leche',
    //     fecha: new Date(),
    //     estado: 'Publicación activa',
    //     descripcion: 'La panadería el molino busca proveedoor de dulce de leche, para pasteles y tartas , de preferencia marca "XXXXXXX"',
    //     montoDisponible: 425000

    //   },
    // ]

  }

  buscar() {
    // console.log(this.cards)
  }

  getPublicacionesPorId() {

  }
}
