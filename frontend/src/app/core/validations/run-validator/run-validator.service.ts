import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidator } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RunValidatorService implements AsyncValidator {

  private url: string = environment.baseUrl
  constructor(private http: HttpClient) { }
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const run = control.value

    return this.http.get<any>(`${this.url}/api/sign-in/run/${run}`)
      .pipe(
        map(resp => {
          return (resp.state == false)
            ? null
            : { runTomado: true }
        })
      );
  }
}
