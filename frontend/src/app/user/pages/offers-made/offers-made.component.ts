import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OfertaService } from 'src/app/core/services/oferta/oferta.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-offers-made',
  templateUrl: './offers-made.component.html',
  styleUrls: ['./offers-made.component.css']
})
export class OffersMadeComponent implements OnInit {

  idUser: string = this.authService.usuario.id;

  pageSize: number = 20;
  page: number = 1;

  isLoading: boolean = false;
  isEmptyOffersReceived: boolean = true;
  ofertas: any;
  total: any;
  currentPage!: number;
  totalPages!: number;

  filterForm! : FormGroup;

  // Custom Pipe 
  garantiaMapa = {
    'true': 'Si',
    'false': 'No',
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ofertaService: OfertaService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getOfertasById(this.idUser);
  }

  private buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required]],
      searchOption: ['fecha', Validators.required],
    });

    this.filterForm.get('searchOption')?.valueChanges.subscribe((option) => {
      const searchTermControl = this.filterForm.get('searchTerm');

      searchTermControl?.clearValidators();

      if (option === 'fecha') {
        searchTermControl?.setValidators([Validators.required, this.validateDate]);
      } else if (option === 'mensaje') {
        searchTermControl?.setValidators(Validators.required);
      }

      searchTermControl?.reset();
      searchTermControl?.updateValueAndValidity();
    });
  }

  private getOfertasById(filters: any) {
    this.isLoading = true;
    console.log({ filters });
    this.ofertaService.getOfertasRealizadas(this.idUser, filters).subscribe((data) => {
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
    console.log(idOferta)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de borrar tu oferta?',
      text: "Tu oferta será eliminada, no podrás revertir esto!",
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
          this.ofertas = this.ofertas.filter((oferta: any) => oferta.id !== idOferta);
        });

        swalWithBootstrapButtons.fire(
          'Oferta eliminada',
          '',
          'success',
        );
      }
    });
  }

  public clearFilter() {
    const query = {
      page: 1,
      pageSize: 20,
    };

    this.getOfertasById(query);

    const searchTermControl = this.filterForm.get('searchTerm');
    searchTermControl?.setErrors(null); 
    searchTermControl?.reset(); 
    
    const searchOption = this.filterForm.get('searchOption');
    searchOption?.setErrors(null); 
      
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
    console.log('sendForm()');
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

    console.log({ query });
    this.getOfertasById(query);
  }
}