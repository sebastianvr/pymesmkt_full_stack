import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private showMessage(type: 'success' | 'warning' | 'error', message: string) {
    Swal.fire({
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  public showSuccessMessage(message: string) {
    this.showMessage('success', message);
  }

  public showWarningMessage(message: string) {
    this.showMessage('warning', message);
  }
  
  public showErrorMessage(message: string) {
    this.showMessage('error', message);
  }
}
