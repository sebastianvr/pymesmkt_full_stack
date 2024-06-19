import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
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
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
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
    console.log({ filters });
    this.usuarioService.getAllUsersById(filters).subscribe(res => {
      console.log({ res });
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

  public suspendUser(idUsuario: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3',
      },
      buttonsStyling: false,
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de suspender a este usuario?',
      icon: 'warning',
      iconColor: '#ffc108',
      showCancelButton: true,
      confirmButtonText: 'Suspender',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Usuario suspendido',
          'Usuario añadido a la sección de usuarios suspendidos.',
          'success',
        );
        this.usuarioService.suspenderUsuario(idUsuario).subscribe();
      }
    })
  }

  public deleteUser(idUsuario: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3',
      },
      buttonsStyling: false,
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar este usuario?',
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      this.usuarioService.deleteUsuario(idUsuario).subscribe();

      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado',
          'Este usuario ha sido eliminado del sistema.',
          'success',
        );
      }
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
