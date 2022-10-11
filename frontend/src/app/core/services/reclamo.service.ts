import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {

  private url: string = environment.baseUrl

  constructor(
    private http: HttpClient
  ) { }

  postReclamo(nuevoReclamo: any): Observable<any> {
    return this.http.post(`${this.url}/api/reclamo`, nuevoReclamo)
  }

  getAllReclamos(page: number = 0, size: number = 0) {
    return this.http.get<any>(`${this.url}/api/reclamo/?size=${size}&page=${page}`)
  }

  deleteReclamo(id: any) {
    return this.http.delete<any>(`${this.url}/api/reclamo/${id}`);
  }

  // getPublicacionById(id : string) : Observable<any>{
  //   return this.http.get<any>(`${this.url}/api/publicacion/${id}`)
  // }


  // getAllPublicacionById(id : string) : Observable<any>{
  //   return this.http.get<any>(`${this.url}/api/publicacion/usuario/${id}`)
  // }

  // putPublicacion(){

  // }

}
