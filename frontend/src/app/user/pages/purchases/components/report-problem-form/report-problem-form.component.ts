import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import JSZip from 'jszip';
import { catchError, of } from 'rxjs';
import { S3FilesService } from 'src/app/core/services/files/s3-files.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ReclamoService } from 'src/app/core/services/reclamo/reclamo.service';

@Component({
  selector: 'app-report-problem-form',
  templateUrl: './report-problem-form.component.html',
  styleUrls: ['./report-problem-form.component.css']
})
export class ReportProblemFormComponent {

  reportForm!: FormGroup;
  uploadedFiles: any[] = [];
  @Input() report!: any;
  isLoading: boolean = false;

  maxTitleCharacters = 150;
  maxDescriptionCharacters = 900;
  remainingTitleCharacters!: number;
  remainingDescriptionCharacters!: number;
  fileNames!: string[];

  get titleControl(): AbstractControl | null {
    return this.reportForm.get('titulo');
  }

  get descriptionControl(): AbstractControl | null {
    return this.reportForm.get('descripcion');
  }

  get archivosControl(): AbstractControl | null {
    return this.reportForm.get('archivos');
  }

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private reclamoService: ReclamoService,
    private messageService: MessageService,
    private s3FilesService: S3FilesService,
  ) {
    this.buildClaimForm();
    // this.setFormReportExample();
  }

  private buildClaimForm() {
    this.reportForm = this.fb.group({
      titulo: [null, [
        Validators.required,
        Validators.maxLength(this.maxTitleCharacters)
      ]],
      descripcion: [null, [
        Validators.required,
        Validators.maxLength(this.maxDescriptionCharacters)
      ]],
      archivos: [[],
      [Validators.required]
      ],
    });

    this.remainingTitleCharacters = this.maxTitleCharacters;
    this.remainingDescriptionCharacters = this.maxDescriptionCharacters;

    this.reportForm.get('titulo')?.valueChanges.subscribe(value => {
      this.remainingTitleCharacters = this.maxTitleCharacters - (value ? value.length : 0);
    });

    this.reportForm.get('descripcion')?.valueChanges.subscribe(value => {
      this.remainingDescriptionCharacters = this.maxDescriptionCharacters - (value ? value.length : 0);
    });
  }

  private setFormReportExample() {
    return this.reportForm.reset({
      titulo: 'Problemas con la compra de pasteles personalizados',
      descripcion: 'Compré pasteles personalizados para un evento corporativo, pero varios no coincidieron con la temática acordada y dos presentaron daños en su estructura. Además, uno tenía un sabor extraño. Estos problemas generaron inconvenientes durante el evento, y espero una pronta solución. Adjunto imágenes y detalles.',
      archivos: null,
    });
  }

  public async sendReport() {

    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const userId = this.report.Ofertum.UsuarioId;
    const compraId = this.report.id;
    const publicationId = this.report.PublicacionId;
    if (!userId || !publicationId) {
      return;
    }

    try {
      // Subir archivos a s3
      let nameFile;
      if (this.uploadedFiles.length > 0) {
        nameFile = await this.zipAndUploadFiles();
      }

      // Crear el reclamo con la URL del archivo (si existe)
      const newReport: any = {
        titulo: this.reportForm.get('titulo')?.value,
        mensaje: this.reportForm.get('descripcion')?.value,
        PublicacionId: publicationId,
        UsuarioId: userId,
        CompraId: compraId
      };

      // Solo agregar el campo documentos si nameFile no es null
      if (nameFile) {
        newReport.documentos = nameFile;
      }

      this.reclamoService.postReclamo(newReport).pipe(
        catchError(error => {
          console.error('Error al crear el reclamo:', error);
          this.messageService.showErrorMessage('Error al intentar crear el reclamo.');
          this.isLoading = false;
          return of(null);
        })
      ).subscribe(data => {
        if (data.ok === true) {
          this.messageService.showSuccessMessage('Reclamo enviado');
          this.isLoading = false;
          this.activeModal.close(data);
        }
      });
    } catch (error) {
      console.error(error);
      this.messageService.showErrorMessage('Error al subir archivos');
      this.isLoading = false;
    }
  }

  private async zipAndUploadFiles() {
    const zip = new JSZip();
    this.uploadedFiles.forEach(file => {
      zip.file(file.name, file);
    });

    return new Promise(async (resolve, reject) => {
      try {
        const zipBlob = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });
        const zipFile = new File([zipBlob], 'archivos.zip', { type: 'application/zip' });

        this.s3FilesService.postNewReportFiles(zipFile).pipe(
          catchError(error => {
            console.error('Error al subir archivos a s3:', error);
            this.messageService.showErrorMessage('Error al intentar subir archivos');
            reject(error);
            return of(null);
          })
        ).subscribe((response: any) => {
          if (response && response.filepath) {
            const filePath = response.filepath;
            resolve(filePath);
          } else {
            reject('No se obtuvieron rutas de archivo');
          }
        });
      } catch (error) {
        console.error('Error al crear el archivo zip:', error);
        this.messageService.showErrorMessage('Hubo un problema al comprimir los archivos');
        reject(error);
      }
    });
  }

  public fieldInvalidFormReport(field: string) {
    return this.reportForm.get(field)?.errors
      && this.reportForm.get(field)?.touched;
  }

  public onUpload(event: any) {
    const fileList = event.currentFiles;
    fileList.map((file: File) => this.uploadedFiles.push(file));
    this.updateFileNamesInForm();
  }

  public onRemove(event: any) {
    const removedFile = event.file;
    this.uploadedFiles = this.uploadedFiles.filter(file => file !== removedFile);
    this.updateFileNamesInForm();
  }

  private updateFileNamesInForm() {
    const arrayFileNames = this.uploadedFiles.map((file: File) => file.name);
    this.reportForm.get('archivos')?.setValue(arrayFileNames);
    this.validateFiles();
  }

  // ToDo: Mostrar en pantalla el error cuando se requieren archivos.
  private validateFiles() {
    const archivosControl = this.reportForm.get('archivos');
    if (this.uploadedFiles.length === 0) {
      archivosControl?.setErrors({ required: true });
    } else {
      archivosControl?.setErrors(null);
    }
    archivosControl?.updateValueAndValidity(); // Forzar reevaluación del control
  }

  public closeModal() {
    this.activeModal.close();
  }
}
