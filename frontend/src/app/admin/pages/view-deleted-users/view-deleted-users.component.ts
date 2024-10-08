import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Component({
  selector: 'app-view-deleted-users',
  templateUrl: './view-deleted-users.component.html',
  styleUrls: ['./view-deleted-users.component.css']
})
export class ViewDeletedUsersComponent implements OnInit {
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
  isEmptyUsers!: boolean;
  usuarios: any;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getUsersByFilters(this.initQuery);
  }

  private buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required]],
      searchOption: ['nombre', Validators.required],
    });

    this.filterForm.get('searchOption')?.valueChanges.subscribe((option) => {
      const searchTermControl = this.filterForm.get('searchTerm');

      searchTermControl?.clearValidators();

      if (option === 'email') {
        searchTermControl?.setValidators(Validators.required);
      } else if (option === 'nombre') {
        searchTermControl?.setValidators(Validators.required);
      }

      searchTermControl?.reset();
      searchTermControl?.updateValueAndValidity();
    });
  }
  
  private getUsersByFilters(filters: any) {
    this.isLoading = true;
    // console.log({ filters });
    this.usuarioService.getAllUsuariosDeleted(filters).subscribe(res => {
      // console.log({ res });
      this.isLoading = false;

      if (res.noSearchMatch) {
        this.noSearchMatch = true;
        this.isEmptyUsers = true;
      } else {
        const {
          usuarios,
          total,
          currentPage,
          pageSize,
          totalPages,
        } = res;

        if (usuarios.length === 0) {
          this.isEmptyUsers = true;
        } else {
          this.isEmptyUsers = false;
          this.total = total;
          this.currentPage = currentPage;
          this.pageSize = pageSize;
          this.totalPages = totalPages;
          this.usuarios = usuarios;
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

    this.getUsersByFilters(query);
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
      ...this.initQuery
    };

    // console.log({ query });
    this.getUsersByFilters(query);
  }

  public clearFilter() {
    this.getUsersByFilters(this.initQuery);

    const searchTermControl = this.filterForm.get('searchTerm');
    searchTermControl?.setValue(null);
    searchTermControl?.reset();
  }
}
