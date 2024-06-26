import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'component-modal-help-graph',
  templateUrl: './modal-help-graph.component.html',
  styleUrls: ['./modal-help-graph.component.css']
})
export class ModalHelpGraphComponent {

  constructor(private modalService: NgbModal) { }

  openHelpModal(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    });
  }

}
