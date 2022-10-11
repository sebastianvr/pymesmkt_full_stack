import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReclamoService } from '../../../core/services/reclamo.service';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css']
})
export class NewReportComponent implements OnInit {

  allReclamos: any;
  searchText: string = '';
  closeResult = '';

  constructor(
    private reclamoService: ReclamoService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.reclamoService.getAllReclamos(0, 10).subscribe((data) => {
      this.allReclamos = data.content
      console.log('data', data)
      console.log('this.allReclamos', this.allReclamos)
    })
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
