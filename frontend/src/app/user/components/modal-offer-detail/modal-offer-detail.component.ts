import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OfertaService } from 'src/app/core/services/oferta/oferta.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { S3FilesService } from 'src/app/core/services/files/s3-files.service';
import JSZip from 'jszip';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-modal-offer-detail',
  templateUrl: './modal-offer-detail.component.html',
  styleUrls: ['./modal-offer-detail.component.css']
})
export class ModalOfferDetailComponent implements OnInit {

  @Input() idOffer!: string;
  @Input() senderUserId!: string;
  @Input() recipientdUserId!: string;

  offerForm!: FormGroup;
  isOpLoading!: boolean;
  public selectedFile: File | null = null;
  uploadedFiles: File[] = [];

  maxMessageCharacters = 600;
  remainingMessageCharacters!: number;

  currentRoute!: any;

  get messageControl(): AbstractControl | null {
    return this.offerForm.get('mensaje');
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private primengConfig: PrimeNGConfig,
    private ofertaService: OfertaService,
    private messageService: MessageService,
    private s3FilesService: S3FilesService,
  ) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.buildForm();
    // this.createMockOffer();
  }

  private buildForm() {
    this.offerForm = this.formBuilder.group({
      mensaje: [null, [
        Validators.required,
        Validators.maxLength(this.maxMessageCharacters)
      ]],
      precioOferta: [null, Validators.required],
      archivo: [null],
    });

    this.remainingMessageCharacters = this.maxMessageCharacters;
    this.offerForm.get('mensaje')?.valueChanges.subscribe(value => {
      this.remainingMessageCharacters = this.maxMessageCharacters - (value ? value.length : 0);
    });
  }

  private createMockOffer() {
    const mockData = {
      mensaje: 'En Pastelería el Molino, entendemos la importancia de contar con ingredientes de la más alta calidad para la elaboración de tartas artesanales excepcionales.\n' +
        'Por eso, hemos preparado una oferta especial para suministrar los ingredientes que necesitas.\n' +
        'Ofrecemos harina de trigo orgánica, azúcar moreno, mantequilla sin sal, cacao en polvo y chocolate belga semiamargo, todos seleccionados cuidadosamente para garantizar el mejor sabor y calidad en tus productos.\n' +
        'Adjunto presupuesto y trabajos anteriores.',
      precioOferta: 550000,
      archivo: null
    };
    this.offerForm.setValue(mockData);
  }

  public async sendOffer() {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }

    this.isOpLoading = true;
    const newOffer: any = {
      mensaje: this.offerForm.get('mensaje')?.value,
      precioOferta: this.offerForm.get('precioOferta')?.value,
      UsuarioId: this.senderUserId,
      usuarioIdReceptor: this.recipientdUserId,
      PublicacionId: this.idOffer,
    };

    // Subir archivos a s3
    if (this.uploadedFiles.length > 0) {
      try {
        const filePath = await this.zipAndUploadFiles();
        newOffer.archivo = filePath;
      } catch (error) {
        this.messageService.showErrorMessage('Error al subir archivos');
        this.isOpLoading = false;
        return;
      }
    }

    this.ofertaService.postOferta(newOffer).pipe(
      catchError(error => {
        console.error('Error al crear la oferta:', error);
        this.messageService.showErrorMessage('Error al intentar crear la oferta.');
        this.isOpLoading = false;
        return of(null);
      })
    ).subscribe(data => {
      if (data.ok === true) {
        this.messageService.showSuccessMessage('Oferta creada');
        this.offerForm.reset();
        this.activeModal.close(true);
        this.isOpLoading = false;

        if (this.router.url !== '/user/home') {
          this.router.navigate(['/user/home']);
        }
      }
    });
  }

  public invalidFormFile(nameField: string) {
    return this.offerForm.get(nameField)?.errors
      && this.offerForm.get(nameField)?.touched;
  }

  public onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  private async zipAndUploadFiles(): Promise<string> {
    const zip = new JSZip();
    this.uploadedFiles.forEach((file: any) => {
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

        this.s3FilesService.postOfferFiles(zipFile).pipe(
          catchError(error => {
            console.error('Error al subir archivos:', error);
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
}
