import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url: string = environment.baseUrl
  private refreshUsuarios = new Subject<void>();

  constructor(
    private http: HttpClient,
  ) { }

  get refresh() {
    return this.refreshUsuarios;
  }

  getUsuario(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/api/usuario/${id}`);
  }

  getAllUsersById(filters: any): Observable<any> {
    const queryParams = { ...filters };
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const urlWithQuery = `${this.url}/api/usuario?${queryString}`;
    return this.http.get<any>(urlWithQuery);
  }

  getAllUsuariosSuspended(filters: any) {
    const queryParams = { ...filters };
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const urlWithQuery = `${this.url}/api/usuario/suspended/?${queryString}`;
    return this.http.get<any>(urlWithQuery);
  }

  getAllUsuariosDeleted(filters: any) {
    const queryParams = { ...filters };
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const urlWithQuery = `${this.url}/api/usuario/deleted/?${queryString}`;
    return this.http.get<any>(urlWithQuery);
  }

  updateUser(id: string, userUpdate: any) {
    return this.http.put<any>(`${this.url}/api/usuario/${id}`, userUpdate);
  }

  suspenderUsuario(id: any) {
    return this.http.put<any>(`${this.url}/api/usuario/suspend/${id}`, {})
      .pipe(
        tap(() => {
          this.refresh.next();
        }),
      );
  }

  deleteUsuario(id: any) {
    return this.http.delete<any>(`${this.url}/api/usuario/delete/${id}`, {})
      .pipe(
        tap(() => {
          this.refresh.next();
        }),
      );
  }

  activarUsuario(id: string) {
    return this.http.put<any>(`${this.url}/api/usuario/activate/${id}`, id)
      .pipe(
        tap(() => {
          this.refresh.next();
        }),
      );
  }
}
