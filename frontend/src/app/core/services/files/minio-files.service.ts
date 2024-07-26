import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class S3FilesService {
  private url: string = environment.baseUrl;
  
  constructor(
    private http: HttpClient,
  ) { }

  uploadImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.post(`${this.url}/api/s3/uploadUserImage`, formData); 
  }

  postNewReportFiles(files: File[]): Observable<any> {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    return this.http.post(`${this.url}/api/s3/reportFiles`, formData); 
  }
  
  postNewPublicationFiles(files: File[]): Observable<any> {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    return this.http.post(`${this.url}/api/s3/publication`, formData); 
  }
}
