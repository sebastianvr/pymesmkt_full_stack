import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageEventService {
  private imageUpdatedSource = new Subject<File | Blob>();
  imageUpdated$ = this.imageUpdatedSource.asObservable();

  emitImageUpdate(image: File | Blob) {
    this.imageUpdatedSource.next(image);
  }
}