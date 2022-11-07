import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private url: string = environment.baseUrl
  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  get refresh$() {
    return this._refresh$;
  }

  postCompra(compra: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/compra`, compra)
      
  }

  getAllComprasById(UsuarioId: string, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.url}/api/compra/usuario/${UsuarioId}?size=${size}&page=${page}`)
    .pipe(
      tap(() => {
        this.refresh$.next()
      })
    );
  }

}
