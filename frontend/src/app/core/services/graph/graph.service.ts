import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private url: string = environment.baseUrl
  
  constructor(
    private http : HttpClient
  ) { }

  getDataGraph(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/compra/graph`);
  }
}
