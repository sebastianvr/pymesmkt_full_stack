import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | boolean {
    return this.authService.validarToken()
      .pipe(map(valid => {
        if (valid && this.authService.usuario.rol === 'ADMIN-USER') {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      }));
  }

  canLoad(): Observable<boolean> | boolean {
    console.log(this.authService.usuario)
    return this.authService.validarToken()
      .pipe(map(valid => {
        if (valid && this.authService.usuario.rol === 'ADMIN-USER') {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      }));
  }
}
