import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-suspended-users',
  templateUrl: './view-suspended-users.component.html',
  styleUrls: ['./view-suspended-users.component.css']
})
export class ViewSuspendedUsersComponent implements OnInit, OnDestroy {

  searchText: string = '';
  allUsuariosSuspended: any;

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
    this.usuarioService.getAllUsuariosSuspended(0, 10).subscribe((data) => {
      this.allUsuariosSuspended = data.content
      console.log('this.getAllUsuariosSuspended', this.allUsuariosSuspended)
    })
  }

  activarUsuario(usuario: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de reintegrar este usuario?',
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Reintegrar',
      cancelButtonText: 'Cancelar',
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
