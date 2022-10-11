import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  searchText: string = '';
  allUsuarios: any
  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios(0, 10).subscribe((data) => {
      this.allUsuarios = data.content
      console.log('data', data)
      console.log('this.allReclamos', this.allUsuarios)
    })
  }

  eliminarUsuario(idUsuario : string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'Este usuario ha sido eliminado del sistema.',
          'success'
        )
        this.usuarioService.deleteUsuario(idUsuario).subscribe()
        // this.router.navigate(['/user/see-publications'])

      
      } 
    })
  }

}
