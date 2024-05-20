import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'user-filter-publication',
  templateUrl: './filter-publication.component.html',
  styleUrls: ['./filter-publication.component.css']
})
export class FilterPublicationComponent implements OnInit {

  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  filterForm!: FormGroup;
  rangePrice: number[] = [1000, 10000, 50000, 100000, 100000000,];
  nroOfertasPattern: RegExp = /^[0-9]*$/;
  montoPattern: RegExp = /^[1-9][0-9]*$/;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit(): void { }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      cantOfertas: [null, [Validators.pattern(this.nroOfertasPattern)]],
      monto: [null, [Validators.pattern(this.montoPattern)]],
      garantia: [false],
      tipo: [false],
    });
  }

  public sendForm() {
    if (!this.filterForm.valid) {
      return;
    }

    const formValues = this.filterForm.value;
    const filters = this.buildFilters(formValues);
    const cleanedFilters = this.cleanFilters(filters);

    // console.log({ cleanedFilters });
    this.formSubmitted.emit(cleanedFilters);
  }

  private buildFilters(formValues: any) {
    const cantidadOfertasRecibidas =
      formValues.cantOfertas && formValues.cantOfertas !== "" ?
        parseInt(formValues.cantOfertas) :
        null;

    const precioTotal =
      formValues.monto && formValues.monto !== "" ?
        parseInt(formValues.monto) :
        null;

    const productoOServicio = formValues.tipo ?
      'PRODUCTO' : 'SERVICIO';

    const garantia = formValues.garantia;

    return {
      cantidadOfertasRecibidas,
      precioTotal,
      garantia,
      productoOServicio,
    };
  }

  private cleanFilters(filters: any) {
    for (const key in filters) {
      if (filters[key] === null || filters[key] === undefined) {
        delete filters[key];
      }
    }
    return filters;
  }
}
