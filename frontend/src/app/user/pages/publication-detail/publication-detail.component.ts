import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2'

import { PublicacionService } from 'src/app/core/services/publicacion/publicacion.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ModalOfferDetailComponent } from '../../components/modal-offer-detail/modal-offer-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-publication-detail',
  templateUrl: './publication-detail.component.html',
  styleUrls: ['./publication-detail.component.css']
})
export class PublicationDetailComponent implements OnInit {
  publication!: any;
  idCurrentUser!: string;
  @ViewChild('downloadLink') downloadLink!: ElementRef;

  garantiaMapa = {
    'true': 'Si',
    'false': 'No'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private publicacionService: PublicacionService,
  ) { }

  public ngOnInit() {
    this.idCurrentUser = this.authService.usuario.id;
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          this.publicacionService.getPublicacionById(id)
        )
      )
      .subscribe(({ publicacion }) => {
        this.publication = publicacion;
      });
  }

  public deletePublication() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar esta publicación?',
      text: "No podrás revertir esto",
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'Tu publicación ha sido eliminada.',
          'success'
        );

        this.publicacionService.deletePublication(this.publication.id).subscribe();
        this.router.navigate(['/user/see-publications']);
      }
    });
  }

  public downloadFile(url: string) {
    const link: HTMLAnchorElement = this.downloadLink.nativeElement;
    link.href = url;
    link.download = ''; // Optional: set the download attribute to force the browser to download the file
    link.click();
  }

  public async openOffer(publication: any) {
    const modalRef = this.modalService.open(ModalOfferDetailComponent, { size: 'lg' });
    modalRef.componentInstance.idOffer = publication.id;
    modalRef.componentInstance.senderUserId = this.idCurrentUser;
    modalRef.componentInstance.recipientdUserId = publication.UsuarioId;

    const result = await modalRef.result;
    if (result) {
      // console.log({ result });
      // this.closeResult = `Closed with: ${result}`;
    }
  }
}