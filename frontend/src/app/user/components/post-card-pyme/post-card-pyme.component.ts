import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    console.log('this.publicaciones', this.publicaciones);
  }

  isIdsIguales(itemId: string): boolean {
    if (this.idUser === itemId) {
      return true;
    }
    return false;
  }

  public openOffer(idOffer: string) {
    console.log({ idOffer });
    const modalRef = this.modalService.open(ModalOfferDetailComponent, { size: 'lg' });
    modalRef.componentInstance.idOffer = idOffer;
    modalRef.componentInstance.respondedUserId = this.idUser;

    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
