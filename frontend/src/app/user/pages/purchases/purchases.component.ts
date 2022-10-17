import { Component, OnInit } from '@angular/core';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {

  usuario: any

  cards: any
  constructor(
    private publicacionService: PublicacionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log(this.authService.usuario.id)
    this.publicacionService.getPublicacionesPagadasById(this.authService.usuario.id, 0, 10)
      .subscribe((res) => {
        this.cards = res.content
        console.log('cards', this.cards)
        console.log('res: ', res)
      })
  }

}
