import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReclamoService } from '../../../core/services/reclamo/reclamo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css']
})
export class NewReportComponent implements OnInit {

  allReclamos: any;
  searchText: string = '';
  closeResult = '';

  constructor(
    private reclamoService: ReclamoService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.reclamoService.getAllReclamos(0, 10).subscribe((data) => {
      this.allReclamos = data.content
      console.log('data', data)
      console.log('this.allReclamos', this.allReclamos)
    })
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  finalizarReclamo(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary mx-3',
        cancelButton: 'btn btn-primary mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Quieres finalizar este reclamo?',
      text: 'Este reclamo se moverá a la sección de reclamos finalizados',
      icon: 'info',
      iconColor: '#0e6ffd',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        // cambiar estado de reclamo a finalizado

        // actualizar tabla

        // swalWithBootstrapButtons.fire(
        //   'Reclamo finalizado',
        //   '',
        //   'success'
        // )
        // this.usuarioService.deleteUsuario(idUsuario).subscribe()
        // this.usuarioService.refresh.subscribe(response => {
        //   this.getAll();
        // })
        // this.router.navigate(['/user/see-publications']; 
      }
    })
  }
}
