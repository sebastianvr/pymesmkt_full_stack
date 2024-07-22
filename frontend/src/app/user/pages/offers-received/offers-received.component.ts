import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OfertaService } from 'src/app/core/services/oferta/oferta.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-offers-received',
  templateUrl: './offers-received.component.html',
  styleUrls: ['./offers-received.component.css']
})
export class OffersReceivedComponent implements OnInit {

  idUser: string = this.authService.usuario.id;

  pageSize: number = 20;
  page: number = 1;

  isLoading: boolean = false;
  isEmptyOffersReceived: boolean = true;
  ofertas: any;
  total: any;
  currentPage!: number;
  totalPages!: number;
  noSearchMatch!: boolean;
  closeResult: string = '';

  filterForm!: FormGroup;

  constructor(
    private router: Router,
    private ofertaService: OfertaService,
    private authService: AuthService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.getOfertasById(this.idUser);
  }

  private buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required]],
      searchOption: ['titulo', Validators.required],
    });

    this.filterForm.get('searchOption')?.valueChanges.subscribe((option) => {
      const searchTermControl = this.filterForm.get('searchTerm');

      searchTermControl?.clearValidators();

      if (option === 'fecha') {
        searchTermControl?.setValidators([Validators.required, this.validateDate]);
      } else if (option === 'titulo') {
        searchTermControl?.setValidators(Validators.required);
      } else if (option === 'pyme') {
        searchTermControl?.setValidators(Validators.required);
      }

      searchTermControl?.reset();
      searchTermControl?.updateValueAndValidity();
    });
  }

  private getOfertasById(filters: any) {
    this.isLoading = true;
    // console.log({ filters });
    this.ofertaService.getOfertasRecibidas(this.idUser, filters)
      .subscribe((data) => {
        // console.log({ data });
        this.isLoading = false;

        if (data.noSearchMatch) {
          this.noSearchMatch = true;
          this.isEmptyOffersReceived = false;
        } else {
          const {
            ofertas,
            total,
            currentPage,
            pageSize,
            totalPages,
          } = data;

          
          if (ofertas.length === 0) {
            this.isEmptyOffersReceived = true;
            this.noSearchMatch = false;
          } else {
            this.isEmptyOffersReceived = false;
            this.total = total;
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.totalPages = totalPages;
            this.ofertas = ofertas;
            this.noSearchMatch = false;
          }
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
          // console.log(data);
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

  public clearFilter() {
    const query = {
      idUser: this.idUser,
      page: 1,
      pageSize: 20,
    };
    this.getOfertasById(query);

    const searchTermControl = this.filterForm.get('searchTerm');
    searchTermControl?.setValue(null);
    searchTermControl?.reset();
  }

  private validateDate(control: AbstractControl): { [key: string]: boolean } | null {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (dateRegex.test(control.value)) {
      const parts = control.value.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      // Verificar si el día, mes y año son válidos
      if (
        day >= 1 &&
        day <= 31 &&
        month >= 1 &&
        month <= 12 &&
        year >= 1900 && // Ajusta el rango de años según tus necesidades
        year <= 2099 // Ajusta el rango de años según tus necesidades
      ) {
        return null; // Fecha válida
      }
    }

    return { invalidDate: true };
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
      page: this.page,
      pageSize: this.pageSize,
    };

    // console.log({ query });
    this.getOfertasById(query);
  }
}