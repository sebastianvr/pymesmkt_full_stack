import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';

@Component({
  selector: 'app-filter-publication',
  templateUrl: './filter-publication.component.html',
  styleUrls: ['./filter-publication.component.css']
})
export class FilterPublicationComponent implements OnInit {

  filterForm!: FormGroup;
  rangePrice: number[] = [
    1000,
    10000,
    50000,
    100000,
    100000000,
  ];

  constructor(
    private formBuilder: FormBuilder,
    private publicacionService: PublicacionService,

  ) {
    this.buildForm();
  }

  ngOnInit(): void { }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      cantOfertas: [null, [Validators.pattern(/^[0-9]*$/)]],
      monto: [null, [Validators.pattern(/^[1-9][0-9]*$/)]],
      garantia: [false],
      tipo: [false],
    });
  }

  sendForm() {
    if (!this.filterForm.valid) {
      return
    }

    const formValues = this.filterForm.value;

    // Construir los filtros en función de los valores del formulario
    const filters: any = {
      cantidadOfertasRecibidas:
        formValues.cantOfertas && (formValues.cantOfertas !== "") ?
          parseInt(formValues.cantOfertas) : null,
      precioTotal:
        formValues.monto  && (formValues.monto !== "") ?
          parseInt(formValues.monto) : null,
      garantia: formValues.garantia,
      productoOServicio: formValues.tipo ? 'PRODUCTO' : 'SERVICIO'
    };
    console.log('before', { filters });

    for (const key in filters) {
      if (filters[key] === null || filters[key] === undefined) {
        delete filters[key];
      }
    }

    console.log('after', { filters });
    // Llamar al servicio para obtener los resultados con los filtros
    this.getQueryPublications(filters)
  }

  getQueryPublications(filters: any) {
    this.publicacionService.getQueryPublications(filters)
      .subscribe(data => {
        console.log('filtros:', data);
      });
  }
}
