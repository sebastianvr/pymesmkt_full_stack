import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of } from 'rxjs';
import { CalificacionService } from 'src/app/core/services/calificacion/calificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-qualification-form',
  templateUrl: './vendor-qualification-form.component.html',
  styleUrls: ['./vendor-qualification-form.component.css']
})
export class VendorQualificationFormComponent {
  calificationForm: any;
  @Input() purchase!: any;
  isLoading: boolean = false;

  maxCharacters = 300;
  remainingCharacters!: number;

  get messageControl(): AbstractControl | null {
    return this.calificationForm.get('reseña');
  }

  constructor(
    private calificacionService: CalificacionService,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) {
    this.buildCalificationForm();
    // this.setFormCalificationExample();
  }

  private buildCalificationForm() {
    this.calificationForm = this.fb.group({
      reseña: [null, [
        Validators.required,
        Validators.maxLength(this.maxCharacters)
      ]],
      calificacion: [null, [
        Validators.required,
        Validators.min(1), Validators.max(5)
      ]],
    });

    this.remainingCharacters = this.maxCharacters;
    this.calificationForm.get('reseña')?.valueChanges.subscribe((value: string) => {
      this.remainingCharacters = this.maxCharacters - (value ? value.length : 0);
    });

  }

  private setFormCalificationExample() {
    return this.calificationForm.reset({
      reseña: 'El producto llegó en perfecto estado y a tiempo. La calidad de las computadoras es excelente y ha superado mis expectativas. El rendimiento es excepcional y el tiempo de espera para la entrega fue muy breve. Estoy muy satisfecho con la compra y definitivamente recomendaría este producto a otros.',
      calificacion: 5,
    });
  }

  public sendCalification() {
    const userId = this.purchase.Ofertum.UsuarioId;
    const publicationId = this.purchase.id;
    if (!userId || !publicationId) {
      return;
    }

    const newCalification = {
      reseña: this.calificationForm.get('reseña')?.value,
      puntaje: this.calificationForm.get('calificacion')?.value,
      // Usuario que recibe la calificacion
      UsuarioId: userId,
      // Compra que recibe la calificacion
      CompraId: publicationId,
    };

    this.isLoading = true;
    this.calificacionService.postCalificacion(newCalification)
      .pipe(
        catchError(error => {
          // Manejo de errores
          console.error('Error al enviar calificación:', error);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Hubo un problema al enviar la calificación',
            showConfirmButton: true
          });
          return of(null); // Retorna un observable nulo para que el flujo continue
        }),
        finalize(() => this.isLoading = false) // Finaliza el indicador de carga
      )
      .subscribe(response => {
        if (response) {
          const idCalification = response.id;
          this.activeModal.close(idCalification); // Cierra el modal con éxito
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tu reseña ha sido guardada!',
            showConfirmButton: false,
            timer: 3000
          });
        }
      });
  }

  public fieldInvalidFormCalification(field: string) {
    return this.calificationForm.get(field)?.errors
      && this.calificationForm.get(field)?.touched;
  }

  public closeModal() {
    this.activeModal.close();
  }
}
