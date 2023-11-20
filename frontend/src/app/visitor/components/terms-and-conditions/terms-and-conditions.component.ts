import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  closeModal() {
    this.activeModal.close('Close button clicked');
  }
}
