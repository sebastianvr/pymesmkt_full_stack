import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CompraService } from 'src/app/core/services/compra/compra.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ReportProblemFormComponent } from './components/report-problem-form/report-problem-form.component';
import { VendorQualificationFormComponent } from './components/vendor-qualification-form/vendor-qualification-form.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {
  purchases: any;

  get hasReportCreated() {
    return
  }

  constructor(
    private primengConfig: PrimeNGConfig,
    private modalService: NgbModal,
    private authService: AuthService,
    private compraService: CompraService,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getUserPurchases();
  }

  private getUserPurchases() {
    this.compraService.getAllComprasById(this.authService.usuario.id, 0, 10)
      .subscribe((res) => {
        console.log({ res });
        this.purchases = res.content;
      });
  }

  public async openReportProblemModal(report: any, index: number) {
    console.log({ report });
    const modalRef = this.modalService.open(ReportProblemFormComponent,
      { centered: true, size: 'xl' }
    );
    modalRef.componentInstance.report = report;

    const resultReport = await modalRef.result;
    if (resultReport) {
      this.purchases[index].Reclamo = { id: report };
    }
  }

  public async openQualifySeller(purchase: any, index: number) {
    const modalRef = this.modalService.open(VendorQualificationFormComponent,
      { centered: true }
    );
    modalRef.componentInstance.purchase = purchase;

    const calificationId = await modalRef.result;
    if (calificationId) {
      this.purchases[index].CalificacionId = calificationId;
    }
  }
}
