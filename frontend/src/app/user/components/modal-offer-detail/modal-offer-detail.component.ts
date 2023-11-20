import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfertaService } from 'src/app/core/services/oferta/oferta.service';

@Component({
  selector: 'app-modal-offer-detail',
  templateUrl: './modal-offer-detail.component.html',
  styleUrls: ['./modal-offer-detail.component.css']
})
export class ModalOfferDetailComponent implements OnInit {

  @Input() idOffer!: string;
  @Input() respondedUserId!: string; /**Id del usuario "ofertante" */
  offerForm!: FormGroup;


  // 2 MB como tamaño máximo de archivo
  private fileSize: number = (2 * 1024 * 1024);
  public selectedFile: File | null = null;
  private allowedFilesExtention: string[] = ['jpg', 'jpeg', 'png', 'svg'];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private ofertaService: OfertaService,
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
    console.log(this.idOffer);
  }

  private buildForm() {
    return this.offerForm = this.formBuilder.group({
      mensaje: [null, Validators.required],
      precioOferta: [null, Validators.required],
      archivo: [null],
    });
  }

  sendOffer() {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }

    const newOffer = {
      mensaje: this.offerForm.get('mensaje')?.value,
      precioOferta: this.offerForm.get('precioOferta')?.value,
      UsuarioId: this.respondedUserId,
      PublicacionId: this.idOffer,
    };

    console.log({ newOffer });

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tu oferta ha sido enviada!',
      showConfirmButton: false,
      timer: 2000
    }).then((result) => {
      if (result) {
        this.ofertaService.postOferta(newOffer).subscribe();
        this.offerForm.reset();
        this.activeModal.close(true);
      }
    })
    console.log(this.offerForm.value);
  }

  public campoInvalido(campo: string) {
    return this.offerForm.get(campo)?.errors
      && this.offerForm.get(campo)?.touched;
  }

  public onFileInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files as FileList;
    const imagenControl = this.offerForm.get('infoPropietario.imagen');

    if (files && files.length === 1 && imagenControl) {
      const file = files[0] as File;

      // Validar la extensión del archivo
      const fileName = file.name || '';
      const fileExt = fileName.split('.').pop()?.toLowerCase() as string;
      if (!this.allowedFilesExtention.includes(fileExt)) {
        imagenControl.setErrors({ invalidExtension: true });
        return;
      }

      // Validar el tamaño máximo (2 MB)
      if (file.size <= this.fileSize) {
        this.selectedFile = file;
        imagenControl.setErrors(null);
      } else {
        imagenControl.setErrors({ maxSizeExceeded: true });
      }
    }

    if (files.length > 1 && imagenControl) {
      imagenControl.setErrors({ invalidFileCount: true });
    }
  }
}
