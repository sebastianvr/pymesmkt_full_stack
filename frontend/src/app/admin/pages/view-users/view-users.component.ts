import { Component, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit, OnDestroy {

  searchText: string = '';
  allUsuarios: any

  suscription!: Subscription;


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
    this.usuarioService.getAllUsuarios(0, 10).subscribe((data) => {
      this.allUsuarios = data.content
    })
  }

  suspenderUsuario(idUsuario: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de suspender a este usuario?',
      icon: 'warning',
      iconColor: '#ffc108',
      showCancelButton: true,
      confirmButtonText: 'Suspender',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Usuario suspendido',
          'Usuario añadido a la sección de usuarios suspendidos.',
          'success'
        )
        this.usuarioService.suspenderUsuario(idUsuario).subscribe()
        // this.usuarioService.refresh.subscribe(response => {
        //   this.getAll();
        // })
        // this.router.navigate(['/user/see-publications']; 
      }
    })
  }


  eliminarUsuario(idUsuario: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar este usuario?',
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      this.usuarioService.deleteUsuario(idUsuario).subscribe()

      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado',
          'Este usuario ha sido eliminado del sistema.',
          'success'
        )

      }
    })
  }

  OnDestroy() {
    this.usuarioService.refresh.unsubscribe()
  }
}
