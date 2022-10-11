import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url: string = environment.baseUrl
  constructor(
    private http: HttpClient
  ) { }


  getAllUsuarios(page: number = 0, size: number = 0) {
    return this.http.get<any>(`${this.url}/api/usuario/?size=${size}&page=${page}`)
  }

  getAllUsuariosDeleted(page: number = 0, size: number = 0) {
    return this.http.get<any>(`${this.url}/api/usuario/deleted/?size=${size}&page=${page}`)
  }

  deleteUsuario(id: any) {
    return this.http.delete<any>(`${this.url}/api/usuario/${id}`);
  }

  activarUsuario(usuario: any) {
    return this.http.put<any>(`${this.url}/api/usuario/activate/${usuario.id}`, usuario);
  }
}
