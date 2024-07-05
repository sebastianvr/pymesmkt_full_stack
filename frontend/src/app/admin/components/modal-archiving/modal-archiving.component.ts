import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of } from 'rxjs';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ReclamoService } from 'src/app/core/services/reclamo/reclamo.service';


@Component({
  selector: 'app-modal-archiving',
  templateUrl: './modal-archiving.component.html',
  styleUrls: ['./modal-archiving.component.css']
})
export class ModalArchivingComponent implements OnInit {
  @Input() idReport!: string;
  @Output() idReportDeleted: EventEmitter<string> = new EventEmitter<string>();
  reportForm!: FormGroup;

  maxCharacters = 300;
  remainingCharacters!: number;

  isLoading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private reclamoService: ReclamoService,
    private messageService: MessageService,
  ) { }

  get mensajeControl(): AbstractControl | null {
    return this.reportForm.get('mensaje');
  }

  ngOnInit(): void {
    this.buildForm();
    // this.setExampleMessage();
  }

  private buildForm() {
    this.reportForm = this.fb.group({
      mensaje: ['', [
        Validators.required,
        Validators.maxLength(this.maxCharacters)
      ]]
    });
    this.remainingCharacters = this.maxCharacters;
    this.reportForm.get('mensaje')?.valueChanges.subscribe(value => {
      this.remainingCharacters = this.maxCharacters - (value ? value.length : 0);
    });
  }

  private setExampleMessage(): void {
    const exampleMessage = 'Este es un mensaje de ejemplo para la resolución del reclamo.';
    this.reportForm.get('mensaje')?.setValue(exampleMessage);
  }

  public onMessageInput(): void {
    const mensajeControl = this.reportForm.get('mensaje');
    this.remainingCharacters = this.maxCharacters - (mensajeControl?.value ? mensajeControl.value.length : 0);
  }

  public onSubmit(): void {
    if (this.reportForm.valid && !this.isLoading) { // Evitar enviar múltiples veces mientras se carga
      const mensajeAdmin = this.reportForm.value.mensaje;
      this.isLoading = true;

      this.reclamoService.updateAdminMessage(this.idReport, mensajeAdmin)
        .pipe(
          catchError(error => {
            console.error('Error:', error);
            this.messageService.showErrorMessage('Error al archivar el reclamo.');
            return of(null); // Retorna un observable vacío para continuar el flujo
          }),
          finalize(() => {
            this.isLoading = false; // Finaliza la carga, independientemente del resultado
          })
        )
        .subscribe((response) => {
          if (response && response.ok) {
            this.messageService.showSuccessMessage('Reclamo archivado.');
            this.idReportDeleted.emit(this.idReport); // Emitir el ID del reclamo eliminado
            this.activeModal.close(this.reportForm.value);
          }
        });
    }
  }
}
