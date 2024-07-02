import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
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

  getAllReclamos(filters: any) {
    const queryParams = { ...filters };
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const urlWithQuery = `${this.url}/api/reclamo/?${queryString}`;
    return this.http.get<any>(urlWithQuery);


  }

  deleteReclamo(id: any) {
    return this.http.delete<any>(`${this.url}/api/reclamo/${id}`);
  }
}
