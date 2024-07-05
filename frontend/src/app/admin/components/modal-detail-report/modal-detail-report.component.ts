import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-detail-report',
  templateUrl: './modal-detail-report.component.html',
  styleUrls: ['./modal-detail-report.component.css']
})
export class ModalDetailReportComponent implements OnInit {
  @Input() detailReport: any;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}
