import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrimeNGConfig } from 'primeng/api';

import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CompraService } from 'src/app/core/services/compra/compra.service';
import { ReportProblemFormComponent } from './components/report-problem-form/report-problem-form.component';
import { VendorQualificationFormComponent } from './components/vendor-qualification-form/vendor-qualification-form.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {
  purchases: any;

  page: number = 1;
  pageSize: number = 5;
  isLoading!: boolean;
  total: any;
  currentPage!: number;
  totalPages!: number;
  isEmptyPurchases!: boolean;
  idUser: string;

  initQuery = {
    pageSize: this.pageSize,
    page: this.page
  };

  noSearchMatch!: boolean;

  filterForm!: FormGroup;

  constructor(
    private primengConfig: PrimeNGConfig,
    private modalService: NgbModal,
    private authService: AuthService,
    private compraService: CompraService,
    private formBuilder: FormBuilder,
  ) {
    this.idUser = this.authService.usuario.id;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.buildForm();
    this.getUserPurchases(this.initQuery);
  }

  private buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required]],
      searchOption: ['empresa', Validators.required],
    });

    this.filterForm.get('searchOption')?.valueChanges.subscribe((option) => {
      const searchTermControl = this.filterForm.get('searchTerm');

      searchTermControl?.clearValidators();

      if (option === 'fecha') {
        searchTermControl?.setValidators([Validators.required, this.validateDate]);
      } else if (option === 'empresa') {
        searchTermControl?.setValidators(Validators.required);
      }

      searchTermControl?.reset();
      searchTermControl?.updateValueAndValidity();
    });
  }

  private getUserPurchases(filters: any) {
    this.isLoading = true;
    this.compraService.getAllComprasById(this.authService.usuario.id, filters)
      .subscribe((res) => {
        // console.log({ filters });
        // console.log({ res });
        this.isLoading = false;

        if (res.noSearchMatch) {
          this.noSearchMatch = true;
          this.isEmptyPurchases = true;
        } else {
          const {
            compras,
            total,
            currentPage,
            pageSize,
            totalPages,
          } = res;

          if (compras.length === 0) {
            this.isEmptyPurchases = true;
          } else {
            this.isEmptyPurchases = false;
            this.total = total;
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.totalPages = totalPages;
            this.purchases = compras;
            this.noSearchMatch = false;
          }
        }

        this.isLoading = false;
      });
  }

  public onPageChange(newPage: number) {
    const query = {
      page: newPage,
      pageSize: this.pageSize,
    };

    this.getUserPurchases(query);
  }

  public clearFilter() {
    const query = {
      page: 1,
      pageSize: 20,
    };
    this.getUserPurchases(query);

    const searchTermControl = this.filterForm.get('searchTerm');
    searchTermControl?.setValue(null);
    searchTermControl?.reset();
  }

  public sendForm() {
    // console.log('sendForm()');
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    const formValues = this.filterForm.value;
    const query = {
      [formValues.searchOption]: formValues.searchTerm,
      page: this.page,
      pageSize: this.pageSize,
    };

    // console.log({ query });
    this.getUserPurchases(query);
  }

  private validateDate(control: AbstractControl): { [key: string]: boolean } | null {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (dateRegex.test(control.value)) {
      const parts = control.value.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      // Verificar si el día, mes y año son válidos
      if (
        day >= 1 &&
        day <= 31 &&
        month >= 1 &&
        month <= 12 &&
        year >= 1900 && // Ajustar el rango de años según necesidades
        year <= 2099 // Ajustar el rango de años según necesidades
      ) {
        return null; // Fecha válida
      }
    }

    return { invalidDate: true };
  }

  public async openReportProblemModal(report: any, index: number) {
    const modalRef = this.modalService.open(
      ReportProblemFormComponent,
      {
        centered: true,
        size: 'xl',
        backdrop: 'static'
      });
    modalRef.componentInstance.report = report;

    try {
      const resultReport = await modalRef.result;
      if (resultReport) {
        console.log({ resultReport });
        this.purchases[index].Reclamo = { id: report };
      }
    } catch (error) {
      if (error !== 'Cross click' && error !== 1) {
        console.error('Error inesperado:', error);
      }
    }
  }

  public async openQualifySeller(purchase: any, index: number) {
    const modalRef = this.modalService.open(
      VendorQualificationFormComponent,
      {
        centered: true,
        backdrop: 'static',
        size: 'xl',
      });
    modalRef.componentInstance.purchase = purchase;

    try {

      const calificationId = await modalRef.result;
      if (calificationId) {
        this.purchases[index].CalificacionId = calificationId;
      }

    } catch (error) {
      if (error !== 'Cross click' && error !== 1) {
        console.error('Error inesperado:', error);
      }
    }
  }
}
