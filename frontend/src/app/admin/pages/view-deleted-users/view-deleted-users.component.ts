import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-deleted-users',
  templateUrl: './view-deleted-users.component.html',
  styleUrls: ['./view-deleted-users.component.css']
})
export class ViewDeletedUsersComponent implements OnInit, OnDestroy {

  searchText: string = '';
  allUsuariosDeleted: any;

  suscription!: Subscription

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.getAll();

    this.suscription = this.usuarioService.refresh.subscribe(() => {
      this.getAll();
    })
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
    console.log('observable cerrado')
  }


  getAll() {
    this.usuarioService.getAllUsuariosDeleted(0, 10).subscribe((data) => {
      this.allUsuariosDeleted = data.content
      console.log('this.allUsuariosDeleted', this.allUsuariosDeleted)
    })
  }

  activarUsuario(usuario: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de reintegrar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, reintegrar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Reintegrado!',
          'Este usuario ha sido reintegrado al sistema.',
          'success'
        )
        this.usuarioService.activarUsuario(usuario).subscribe((data) => {
          console.log(data)
        })
        // this.router.navigate(['/user/see-publications'])
      }
    })
  }
}
