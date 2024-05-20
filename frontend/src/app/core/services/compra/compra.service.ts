import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private url: string = environment.baseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  postCompra(compra: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/compra`, compra);
  }

  getAllComprasById(UsuarioId: string, filters: any): Observable<any> {
    const queryParams = { ...filters };
    if (!queryParams) {
      return this.http.get<any>(`${this.url}/api/compra/usuario/${UsuarioId}`);
    }

    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const urlWithQuery = `${this.url}/api/compra/usuario/${UsuarioId}?${queryString}`;
    return this.http.get<any>(urlWithQuery);
  }

}
