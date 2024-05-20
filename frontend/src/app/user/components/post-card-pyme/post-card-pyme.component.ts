import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOfferDetailComponent } from '../modal-offer-detail/modal-offer-detail.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-post-card-pyme',
  templateUrl: './post-card-pyme.component.html',
  styleUrls: ['./post-card-pyme.component.css'],
})
export class PostCardPymeComponent implements OnInit {
  @Input() publicaciones: any;
  @Input() isLoading: any;

  offerForm!: FormGroup;
  idUser: string = this.authService.usuario.id;
  closeResult!: string;

  garantiaMapa = {
    'true': 'Si',
    'false': 'No',
  };

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // console.log('this.publicaciones', this.publicaciones);
  }

  isIdsIguales(itemId: string): boolean {
    if (this.idUser === itemId) {
      return true;
    }
    return false;
  }

  public async openOffer(offer: any) {
    // console.log({ offer });
    const modalRef = this.modalService.open(ModalOfferDetailComponent, { size: 'lg' });
    modalRef.componentInstance.idOffer = offer.id;
    modalRef.componentInstance.senderUserId = this.idUser;
    modalRef.componentInstance.recipientdUserId = offer.UsuarioId;

    const result = await modalRef.result;
    if (result) {
      // console.log({ result });
      this.closeResult = `Closed with: ${result}`;
    }
  }
}
