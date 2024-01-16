import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OfertaService {

  private _refresh$ = new Subject<void>();
  private url: string = environment.baseUrl

  constructor(
    private http: HttpClient,
  ) { }

  get refresh$() {
    return this._refresh$;
  }

  postOferta(oferta: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/oferta/`, oferta);
  }

  getOfertaById(idOferta: string): Observable<any> {
    return this.http.get<any>(`${this.url}/api/oferta/${idOferta}`);
  }

  deleteOferta(idOferta: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/api/oferta/${idOferta}`)
      .pipe(
        tap(() => {
          this.refresh$.next()
        })
      );
  }

  aceptaOferta(oferta: any): Observable<any> {
    return this.http.put<any>(`${this.url}/api/oferta/aceptar/${oferta}`, null);
  }

  getOfertasRecibidas(id: string, filters: any): Observable<any> {
    const queryParams = { ...filters };
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
      
    const urlWithQuery = `${this.url}/api/oferta/received/${id}?${queryString}`;
    return this.http.get<any>(urlWithQuery);
  }
 
  getOfertasRealizadas(id: string, filters: any): Observable<any> {
    console.log({id, filters})
    const queryParams = { ...filters };
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
      
    const urlWithQuery = `${this.url}/api/oferta/created/${id}?${queryString}`;
    return this.http.get<any>(urlWithQuery);
  }
}