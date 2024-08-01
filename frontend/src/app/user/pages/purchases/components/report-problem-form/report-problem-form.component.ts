import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { catchError, finalize, of } from 'rxjs';
import { S3FilesService } from 'src/app/core/services/files/s3-files.service';
import { ReclamoService } from 'src/app/core/services/reclamo/reclamo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-problem-form',
  templateUrl: './report-problem-form.component.html',
  styleUrls: ['./report-problem-form.component.css']
})
export class ReportProblemFormComponent implements OnInit {

  reportForm!: FormGroup;
  uploadedFiles: any[] = [];
  @Input() report!: any;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private reclamoService: ReclamoService,
    private messageService: MessageService,
    private s3FilesService: S3FilesService,

  ) {

    this.buildClaimForm();
    this.setFormClaimExample();
  }

  ngOnInit(): void {
  }

  private buildClaimForm(): FormGroup {
    return this.reportForm = this.fb.group({
      titulo: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      archivos: [null, []],
    });
  }

  private setFormClaimExample() {
    return this.reportForm.reset({
      titulo: 'Tuve un problema con mis productos ',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam sit quidem molestiae. Magnam sit quidem molestiae. Magnam sit quidem molestiae.',
      archivos: 'archivo.zip',
    });
  }

  public sendReport() {
    this.isLoading = true;
    console.log('sendReport()');
    console.log(this.report);
    console.log(this.uploadedFiles);

    const userId = this.report.Ofertum.UsuarioId;
    const compraId = this.report.id;
    const publicationId = this.report.PublicacionId;
    if (!userId || !publicationId) {
      return;
    }

    // Subir los archivos a Minio
    this.s3FilesService.postNewReportFiles(this.uploadedFiles).pipe(
      catchError(error => {
        console.error('Error al subir archivos a Minio:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Hubo un problema al subir los archivos',
          showConfirmButton: true
        });
        return of(null);
      })
    ).subscribe((res: any) => {
      if (res && res.filepaths) {
        const filepathsString = res.filepaths.join(', ');
        const newReport = {
          titulo: this.reportForm.get('titulo')?.value,
          mensaje: this.reportForm.get('descripcion')?.value,
          documentos: filepathsString,
          PublicacionId: publicationId,
          UsuarioId: userId,
          CompraId: compraId 
        };

        console.log({ newReport });

        // Guardar el reporte
        this.reclamoService.postReclamo(newReport).pipe(
          catchError(error => {
            console.error('Error al enviar el reclamo:', error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Hubo un problema al enviar el reclamo',
              showConfirmButton: true
            });
            return of(null);
          }),
          finalize(() => this.isLoading = false)
        ).subscribe(response => {
          if (response) {
            console.log({ response });
            const reportId = response.id;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Tu reclamo ha sido guardado!',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              this.activeModal.close(reportId);
            });
          }
        });
      }
    });
  }

  public fieldInvalidFormReport(field: string) {
    return this.reportForm.get(field)?.errors
      && this.reportForm.get(field)?.touched;
  }

  public onUpload(event: any) {
    const fileList = event.currentFiles;
    for (let file of fileList) {
      this.uploadedFiles.push(file);
    }
  }

  public closeModal() {
    this.activeModal.close();
  }
}
