import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of } from 'rxjs';
import { CalificacionService } from 'src/app/core/services/calificacion/calificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-qualification-form',
  templateUrl: './vendor-qualification-form.component.html',
  styleUrls: ['./vendor-qualification-form.component.css']
})
export class VendorQualificationFormComponent implements OnInit {
  calificationForm: any;
  @Input() purchase!: any;
  isLoading: boolean = false;

  constructor(
    private calificacionService: CalificacionService,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) {
    this.buildCalificationForm();
    // this.setFormCalificationExample();
  }

  ngOnInit(): void {
    // console.log(this.purchase);
  }

  private buildCalificationForm(): FormGroup {
    return this.calificationForm = this.fb.group({
      reseña: [null, [Validators.required]],
      calificacion: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  private setFormCalificationExample() {
    return this.calificationForm.reset({
      reseña: 'Lorem Ipsum dolor dolor dolor lorem lorem lorem',
      calificacion: 3,
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
          console.log({ response });
          const idCalification = response.id;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tu reseña ha sido guardada!',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.activeModal.close(idCalification); // Cierra el modal con éxito
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
