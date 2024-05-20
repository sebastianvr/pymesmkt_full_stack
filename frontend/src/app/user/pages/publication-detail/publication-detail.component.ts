import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2'

import { PublicacionService } from 'src/app/core/services/publicacion/publicacion.service';


@Component({
  selector: 'app-publication-detail',
  templateUrl: './publication-detail.component.html',
  styleUrls: ['./publication-detail.component.css']
})
export class PublicationDetailComponent implements OnInit {
  publication!: any;

  garantiaMapa = {
    'true': 'Si',
    'false': 'No'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private publicacionService: PublicacionService,
  ) { }

  public ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          this.publicacionService.getPublicacionById(id)
        )
      )
      .subscribe(({ publicacion }) => {
        this.publication = publicacion;
        // console.log(this.publication);
      });
  }

  public deletePublication() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar esta publicación?',
      text: "No podrás revertir esto",
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'Tu publicación ha sido eliminada.',
          'success'
        );

        this.publicacionService.deletePublication(this.publication.id).subscribe();
        this.router.navigate(['/user/see-publications']);
      }
    });
  }

}