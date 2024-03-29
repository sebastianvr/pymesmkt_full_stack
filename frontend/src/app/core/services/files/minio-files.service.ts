import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MinioFilesService {
  private url: string = environment.baseUrl
  
  constructor(
    private http: HttpClient
  ) { }

  uploadImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.post(`${this.url}/api/minio/uploadUserImage`, formData); 
  }
}
