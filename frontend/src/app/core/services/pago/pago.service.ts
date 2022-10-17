import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private url: string = environment.baseUrl

  constructor(
    private http: HttpClient
  ) { }

  getTransaccion(data: any): Observable<any> {
    return this.http.get(`${this.url}/api/pago/create?amount=${data.amount}&returnUrl=${data.returnUrl}`)
  }

  getCommitPago(token: any): Observable<any> {
    return this.http.get(`${this.url}/api/pago/commit?token_ws=${token}`)
  }
} 
