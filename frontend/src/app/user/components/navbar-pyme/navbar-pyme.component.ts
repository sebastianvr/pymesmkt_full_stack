import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Component({
  selector: 'app-navbar-pyme',
  templateUrl: './navbar-pyme.component.html',
  styleUrls: ['./navbar-pyme.component.css']
})
export class NavbarPymeComponent implements OnInit {
  userName: string = this.authService.usuario.nombreUsuario;
  userImageUrl: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.loadUserImage();
  }

  public logOut() {
    this.authService.logOut();
    this.router.navigate(['visitor']);
  }

  private loadUserImage(): void {
    this.usuarioService.getUsuario(this.authService.usuario.id).subscribe((response: any) => {
      this.userImageUrl = response.imagen || null;
    });
  }

}
