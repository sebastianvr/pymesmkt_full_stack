import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RutValidatorService implements AsyncValidator{

  private url: string = environment.baseUrl
  constructor(private http: HttpClient) { }
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const rut = control.value
  
    return this.http.get<any>(`${this.url}/api/pyme/rut/${rut}`)
      .pipe(
        map(resp => {
          return (resp.state == false)
            ? null
            : { rutTomado: true }
        })
      );
  }
}
