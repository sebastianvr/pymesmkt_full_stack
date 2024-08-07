import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReclamoService } from 'src/app/core/services/reclamo/reclamo.service';
import { ModalArchivingComponent } from '../../components/modal-archiving/modal-archiving.component';
import { ModalDetailReportComponent } from '../../components/modal-detail-report/modal-detail-report.component';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css']
})
export class NewReportComponent implements OnInit {
  pageSize: number = 10;
  page: number = 1;

  initQuery = {
    pageSize: this.pageSize,
    page: this.page
  };

  currentPage!: number;
  total!: number;
  totalPages!: number;

  isLoading: boolean = false;
  filterForm!: FormGroup;
  noSearchMatch!: boolean;
  isEmptyReports!: boolean;
  reports: any;

  constructor(
    private formBuilder: FormBuilder,
    private reclamoService: ReclamoService,
    private modalService: NgbModal
  ) { }

  public ngOnInit(): void {
    this.buildForm();
    this.getReportsByFilters(this.initQuery);
  }

  private buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required]],
      searchOption: ['nombre', Validators.required],
    });

    this.filterForm.get('searchOption')?.valueChanges.subscribe((option) => {
      const searchTermControl = this.filterForm.get('searchTerm');

      searchTermControl?.clearValidators();

      if (option === 'fecha') {
        searchTermControl?.setValidators([Validators.required, this.validateDate]);
      } else if (option === 'nombre') {
        searchTermControl?.setValidators(Validators.required);
      }

      searchTermControl?.reset();
      searchTermControl?.updateValueAndValidity();
    });
  }

  private getReportsByFilters(filters: any) {
    this.isLoading = true;
    this.reclamoService.getAllReclamos(filters).subscribe(res => {
      this.isLoading = false;

      if (res.noSearchMatch) {
        this.noSearchMatch = true;
        this.isEmptyReports = false;
      } else {
        const {
          reclamos,
          total,
          currentPage,
          pageSize,
          totalPages,
        } = res;

        if (reclamos.length === 0) {
          this.isEmptyReports = true;
          this.noSearchMatch = false;
        } else {
          this.isEmptyReports = false;
          this.total = total;
          this.currentPage = currentPage;
          this.pageSize = pageSize;
          this.totalPages = totalPages;
          this.reports = reclamos;
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

    this.getReportsByFilters(query);
  }

  public sendForm() {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    const formValues = this.filterForm.value;
    const query = {
      [formValues.searchOption]: formValues.searchTerm,
      ...this.initQuery
    };
    
    this.getReportsByFilters(query);
  }

  public clearFilter() {
    this.getReportsByFilters(this.initQuery);

    const searchTermControl = this.filterForm.get('searchTerm');
    searchTermControl?.setValue(null);
    searchTermControl?.reset();
  }

  public async openReportDetailModal(report: any) {
    const modalRef = this.modalService.open(ModalDetailReportComponent, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });

    modalRef.componentInstance.detailReport = report;

    try {
      const resultModelDetail = await modalRef.result;
      if (resultModelDetail)
        this.reports =
          this.reports.filter((report: any) => report.id !== resultModelDetail.idReport);

    } catch (error) {
      // console.error(error);
    }
  }

  public async endModalReport(id: string) {
    const modalRef = this.modalService.open(ModalArchivingComponent, {
      centered: true,
      size: 'md',
      ariaLabelledBy: 'modal-basic-title',
    });
    modalRef.componentInstance.idReport = id;

    modalRef.componentInstance.idReportDeleted.subscribe((idDeleted: any) => {
      // Filtrar la lista de reclamos para remover el reclamo eliminado
      this.reports = this.reports.filter((report: any) => report.id !== idDeleted);
    });

    try {
      await modalRef.result;
    } catch (error) {
      // console.error(error);
    }
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
        year >= 1900 && // Ajusta el rango de años según tus necesidades
        year <= 2099 // Ajusta el rango de años según tus necesidades
      ) {
        return null; // Fecha válida
      }
    }

    return { invalidDate: true };
  }

  public getPlaceholder(): string {
    const selectedOption = this.filterForm.get('searchOption')?.value;

    if (selectedOption === 'nombre') {
      return 'Nombre de empresa';
    } else if (selectedOption === 'fecha') {
      return 'Ej: 01-05-2022';
    } else {
      return '';
    }
  }
}
