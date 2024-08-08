import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReclamoService } from 'src/app/core/services/reclamo/reclamo.service';
import { ModalArchivingComponent } from '../modal-archiving/modal-archiving.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-modal-detail-report',
  templateUrl: './modal-detail-report.component.html',
  styleUrls: ['./modal-detail-report.component.css']
})
export class ModalDetailReportComponent implements OnInit {
  @Input() detailReport: any;
  @ViewChild('downloadLink') downloadLink!: ElementRef;
  isLoadingFile!: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    public reclamoService: ReclamoService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void { }

  public downloadFile(nameFile: string) {
    this.isLoadingFile = true;

    this.reclamoService.getUrlFile(nameFile).
      pipe(catchError((error => {
        this.isLoadingFile = false;
        return of(error);
      }))).
      subscribe((data: any) => {
        const link: HTMLAnchorElement = this.downloadLink.nativeElement;
        link.href = data.url;
        link.download = '';
        link.click();
        this.isLoadingFile = false;
      });
  }

  public async endModalReport(id: string) {
    const modalRef = this.modalService.open(ModalArchivingComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.idReport = id;

    try {
      const resultModalArchiving = await modalRef.result;
      this.activeModal.close(resultModalArchiving);
    } catch (error) {
      // console.error(error);
    }
  }
}
