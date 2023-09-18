import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) { }
  userId = this.authService.usuario.id;

  ngOnInit(): void {
    console.log(this.userId);
    this.usuarioService.getUsuario(this.userId)
      .subscribe(console.log);
  }

}
