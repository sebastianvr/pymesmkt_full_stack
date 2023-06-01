import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | boolean {
    return this.authService.validarToken()
      .pipe(
        map(valid => {
          if (valid && this.authService.usuario.rol === 'CLIENT-USER') {
            return true;
          } else {
            this.router.navigate(['/auth']);
            return false;
          }
        })
      );
  }

  canLoad(): Observable<boolean> | boolean {
    return this.authService.validarToken()
      .pipe(
        map(valid => {
          if (valid && this.authService.usuario.rol === 'CLIENT-USER') {
            return true;
          } else {
            this.router.navigate(['/auth']);
            return false;
          }
        })
      );
  }
}
