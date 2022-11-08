import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {

  private url: string = environment.baseUrl
  constructor(private http: HttpClient) { }
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const correo = control.value
  
    return this.http.get<any>(`${this.url}/api/sign-in/correo/${correo}`)
      .pipe(
        map(resp => {
          return (resp.state == false)
            ? null
            : { emailTomado: true }
        })
      );
  }
}
