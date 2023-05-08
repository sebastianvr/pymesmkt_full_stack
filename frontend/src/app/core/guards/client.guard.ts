import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | boolean {
    // return this.authService.validarToken()
    //   .pipe(tap(valid => {
    //     if (!valid) {
    //       this.router.navigate(['/auth'])
    //     }
    //   }))
    console.log(this.authService.usuario)
    return this.authService.validarToken()
      .pipe(tap(valid => {
        if (valid && this.authService.usuario.rol === 'CLIENT-USER') {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      }));

  }

  canLoad(): Observable<boolean> | boolean {
    // return this.authService.validarToken()
    //   .pipe(tap(valid => {
    //     if (!valid) {
    //       this.router.navigate(['/auth'])
    //     }
    //   }))
    console.log(this.authService.usuario)
    return this.authService.validarToken()
    .pipe(tap(valid => {
      if (valid && this.authService.usuario.rol === 'CLIENT-USER') {
        return true;
      } else {
        this.router.navigate(['/auth']);
        return false;
      }
    }));
    
  }
}
