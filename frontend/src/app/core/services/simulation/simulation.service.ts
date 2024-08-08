import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private url: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createSimulation(body: any): Observable<any> {
    return this.http.post(`${this.url}/api/seed/db`, body);
  }
}