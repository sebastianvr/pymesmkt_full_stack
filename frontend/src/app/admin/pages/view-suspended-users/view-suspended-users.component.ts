import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Component({
  selector: 'app-view-suspended-users',
  templateUrl: './view-suspended-users.component.html',
  styleUrls: ['./view-suspended-users.component.css']
})
export class ViewSuspendedUsersComponent implements OnInit, OnDestroy {

  searchText: string = '';
  allUsuariosSuspended: any;
  suscription!: Subscription;

  pageSize: number = 20;
  page: number = 1;
  isLoading: boolean = true;
  isEmptyUsers: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit()');
    this.getAll(this.pageSize, this.page);

    this.suscription = this.usuarioService.refresh.subscribe((data) => {
      console.log({ data });
      this.getAll(this.pageSize, this.page);
    });
  }

  getAll(pageSize: number, page: number) {
    this.isLoading = true;

    this.usuarioService.getAllUsuariosSuspended(page, pageSize).subscribe((data) => {
      this.isLoading = false;
      console.log({ data });
      if (data.usuarios.length === 0) {
        this.isEmptyUsers = true;
      } else {
        this.isEmptyUsers = false;
        this.allUsuariosSuspended = data.usuarios;
        console.log(this.allUsuariosSuspended);
      }
    });
  }

  activarUsuario(usuario: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3',
      },
      buttonsStyling: false,
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de reintegrar este usuario?',
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Reintegrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Reintegrado!',
          'Este usuario ha sido reintegrado al sistema.',
          'success',
        );
        this.usuarioService.activarUsuario(usuario).subscribe((data) => {
          console.log(data);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
