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

  getAllPublicaciones(){

  }

  getAllPublicacionById(id : string){
    return this.http.get<any>(`${this.url}/api/publicacion/usuario/${id}`)
  }

  putPublicacion(){

  }

  deletePublicacion(){

  }
}
