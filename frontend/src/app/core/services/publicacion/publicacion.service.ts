import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {


  private url: string = environment.baseUrl

  constructor(
    private http: HttpClient
  ) { }

  postPublicacion(nuevaPublicacion: any): Observable<any> {
    return this.http.post(`${this.url}/api/publicacion`, nuevaPublicacion)
  }

  getPublicacionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/api/publicacion/${id}`)
  }

  getPublicacionesPagadasById(id: string, page: number = 0, size: number = 0): Observable<any> {
    return this.http.get<any>(`${this.url}/api/publicacion/usuario/paid/${id}?size=${size}&page=${page}`)
  }

  getAllPublicaciones(page: number = 0, size: number = 0): Observable<any> {
    return this.http.get<any>(`${this.url}/api/publicacion/?size=${size}&page=${page}`)

  }

  getAllPublicacionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/api/publicacion/usuario/${id}`)
  }

  deletePublicacion(id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/api/publicacion/${id}`);
  }

  putPublicacion() {

  }
}
