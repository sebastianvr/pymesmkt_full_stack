import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private _refresh$ = new Subject<void>();
  private url: string = environment.baseUrl

  constructor(
    private http: HttpClient
  ) { }

  get refresh$() {
    return this._refresh$;
  }

  postCalificacion(calificacion: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/calificacion`, calificacion)
      .pipe(
        tap(() => {
          this.refresh$.next()
        })
      );
  }


}