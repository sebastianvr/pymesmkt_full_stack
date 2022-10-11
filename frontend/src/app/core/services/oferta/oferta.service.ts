import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class OfertaService {

  private url: string = environment.baseUrl

  constructor(
    private http: HttpClient
  ) { }


  postOferta(oferta: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/oferta/`, oferta)
  }


  getOfertasRecibidas(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.url}/api/oferta/${idUsuario}`)
  }
  
  getOfertasRealizadas(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.url}/api/oferta/created/${idUsuario}`)
  }

  deleteOferta(idOferta: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/api/oferta/${idOferta}`)
  }
  // getPymeById(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.url}/api/pyme/${id}`)
  // }

  // getAllPymes(page: number = 0, size: number = 10) {
  //   return this.http.get<any>(`${this.url}/api/publicacion/?size=${size}&page=${page}`)
  // }


  // putPyme() {
  // }

  // deletePyme() {
  // }

}
