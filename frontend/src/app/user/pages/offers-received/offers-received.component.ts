import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OfertaService } from 'src/app/core/services/oferta/oferta.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-offers-received',
  templateUrl: './offers-received.component.html',
  styleUrls: ['./offers-received.component.css']
})
export class OffersReceivedComponent implements OnInit, OnDestroy {

  idUser: string = this.authService.usuario.id;

  pageSize: number = 20;
  page: number = 1;

  isLoading: boolean = false;
  isEmptyOffersReceived: boolean = true;
  ofertas: any;
  total: any;
  currentPage!: number;
  totalPages!: number;

  closeResult: string = '';

  constructor(
    private router: Router,
    private ofertaService: OfertaService,
    private authService: AuthService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.getOfertasById(this.idUser);
  }

  ngOnDestroy(): void {
  }

  private getOfertasById(filters: any) {
    this.isLoading = true;
    console.log({ filters });
    this.ofertaService.getOfertasById(this.idUser, filters).subscribe((data) => {
      console.log({ data });
      this.isLoading = false;

      if (data.rows.length === 0) {
        this.isEmptyOffersReceived = true;
      } else {
        const {
          rows,
          total,
          currentPage,
          pageSize,
          totalPages,
        } = data;

        this.total = total;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
        this.ofertas = rows;
        this.isEmptyOffersReceived = false;

        console.log(this.ofertas);
      }

      this.isLoading = false;
    });
  }

  eliminarOferta(idOferta: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de rechazar esta oferta?',
      text: "Esta oferta será eliminada, no podrás revertir esto!.",
      icon: 'warning',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ofertaService.deleteOferta(idOferta).subscribe((data) => {
          console.log(data);
        });

        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'La oferta ha sido descartada.',
          'success',
        );
      }
    })
  }

  aceptarOferta() {
    Swal.fire({
      title: 'Aviso de redireccionamiento',
      text: "A continuación serás redirijido a el sistema de pago transbank",
      icon: 'info',

      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ir a pagar!',
      cancelButtonText: 'Salir',
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  open(content: any) {
    this.modalService.open(content,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      }).result.then((result) => {
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

  public clearFilter() {
    const query = {
      page: 1,
      pageSize: 20,
    };
    // this.getPublicationsById(query);

    // const searchTermControl = this.filterForm.get('searchTerm');
    // searchTermControl?.setValue(null);
    // searchTermControl?.reset(); 
  }
}