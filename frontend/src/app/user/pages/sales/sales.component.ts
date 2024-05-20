import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PublicacionService } from 'src/app/core/services/publicacion/publicacion.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  idUser: any;
  allCards!: any[];

  pageSize: number = 5;
  page: number = 1;

  isLoading: boolean = false;
  publicaciones: any;
  total: any;
  currentPage!: number;
  totalPages!: number;
  isEmptyPublications!: boolean;

  filterForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private publicacionService: PublicacionService,
  ) {
    this.idUser = this.authService.usuario.id;
  }

  public ngOnInit(): void {
    this.buildForm();
    this.getPublicationsById(this.idUser);
  }

  private buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required]],
      searchOption: ['titulo', Validators.required],
    });

    this.filterForm.get('searchOption')?.valueChanges.subscribe((option) => {
      const searchTermControl = this.filterForm.get('searchTerm');

      searchTermControl?.clearValidators();

      if (option === 'fecha') {
        searchTermControl?.setValidators([Validators.required, this.validateDate]);
      } else if (option === 'titulo') {
        searchTermControl?.setValidators(Validators.required);
      }

      searchTermControl?.reset();
      searchTermControl?.updateValueAndValidity();
    });
  }

  private getPublicationsById(filters: any) {
    this.isLoading = true;
    console.log({ filters });
    this.publicacionService.getAllPublicacionById(this.idUser, filters).subscribe(data => {
      console.log({ data });
      this.isLoading = false;

      if (data.publicaciones.length === 0) {
        this.isEmptyPublications = true;
      } else {
        const {
          publicaciones,
          total,
          currentPage,
          pageSize,
          totalPages,
        } = data;

        this.total = total;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
        this.publicaciones = publicaciones;
        this.isEmptyPublications = false;

        console.log(this.publicaciones);
      }

      this.isLoading = false;
    });
  }

  public onPageChange(newPage: number) {
    const query = {
      page: newPage,
      pageSize: this.pageSize,
    };

    this.getPublicationsById(query);
  }

  public sendForm() {
    console.log('sendForm()');
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

    console.log({ query });
    this.getPublicationsById(query);
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

  public clearFilter() {
    const query = {
      page: 1,
      pageSize: 20,
    };
    this.getPublicationsById(query);

    const searchTermControl = this.filterForm.get('searchTerm');
    searchTermControl?.setValue(null);
    searchTermControl?.reset();
  }

}
