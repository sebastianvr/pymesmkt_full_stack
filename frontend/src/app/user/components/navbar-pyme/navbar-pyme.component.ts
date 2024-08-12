import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ImageEventService } from 'src/app/core/services/image-event/image-event-service.service';
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
    private imageEventService: ImageEventService,
  ) { }

  ngOnInit(): void {
    this.loadUserImage();

    // Suscribirse al evento para actualizar la imagen en la navbar
    this.imageEventService.imageUpdated$.subscribe((image: File | Blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.userImageUrl = reader.result as string;
      };
      reader.readAsDataURL(image);
    });
  }

  public logOut() {
    this.authService.logOut();
    this.router.navigate(['visitor']);
  }

  private loadUserImage(): void {
    this.usuarioService.getUsuario(this.authService.usuario.id)
      .pipe(catchError((error) => {
        console.log({error});
        return of(error)
      }))
      .subscribe((response: any) => {
        this.userImageUrl = response.imagen || null;
      });
  }

}
