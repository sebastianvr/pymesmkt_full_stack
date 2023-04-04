import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url: string = environment.baseUrl
  private refreshUsuarios = new Subject<void>()


  constructor(
    private http: HttpClient
  ) { }

  get refresh() {
    return this.refreshUsuarios
  }

  getAllUsuarios(page: number = 0, size: number = 0): Observable<any> {
    return this.http.get<any>(`${this.url}/api/usuario/?size=${size}&page=${page}`)

  }

  getAllUsuariosSuspended(page: number = 0, size: number = 0) {
    return this.http.get<any>(`${this.url}/api/usuario/suspended/?size=${size}&page=${page}`)
  }

  getAllUsuariosDeleted(page: number = 0, size: number = 0) {
    return this.http.get<any>(`${this.url}/api/usuario/deleted/?size=${size}&page=${page}`)
  }

  suspenderUsuario(id: any) {
    return this.http.put<any>(`${this.url}/api/usuario/suspend/${id}`, {})
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  deleteUsuario(id: any) {
    return this.http.delete<any>(`${this.url}/api/usuario/delete/${id}`, {})
    .pipe(
      tap(() => {
        this.refresh.next();
      })
    );
  }

  activarUsuario(usuario: any) {
    return this.http.put<any>(`${this.url}/api/usuario/activate/${usuario.id}`, usuario)
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }
}
