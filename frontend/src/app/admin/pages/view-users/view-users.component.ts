import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit, OnDestroy {

  searchText: string = '';
  allUsuarios: any;
  suscription!: Subscription;

  pageSize: number = 20;
  page: number = 1;
  currentPage!: number;
  total!: number;
  totalPages!: number;

  isEmptyUsers: boolean = false;
  isLoading: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.getAll(this.pageSize, this.page);

    this.suscription = this.usuarioService.refresh.subscribe(() => {
      this.getAll(this.pageSize, this.page);
    })
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  getAll(pageSize: number, page: number) {
    console.log('getAll()');
    this.isLoading = true;
    this.usuarioService.getAllUsuarios(page, pageSize).subscribe((data) => {
      console.log({ data });

      this.isLoading = false;

      if (data.total === 0) {
        this.isEmptyUsers = true;
      }else{
        const {
          usuarios,
          total,
          currentPage,
          pageSize,
          totalPages,
        } = data;
      
        this.total = total;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
        this.allUsuarios = usuarios;
        this.isEmptyUsers = false;
        
        console.log(this.allUsuarios);
      }
    });
  }

  suspenderUsuario(idUsuario: string) {
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

  eliminarUsuario(idUsuario: string) {
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

  OnDestroy() {
    this.usuarioService.refresh.unsubscribe();
  }

  onPageChange(newPage: number) {
    console.log({newPage});
    this.getAll(this.pageSize, newPage);
  }
}
