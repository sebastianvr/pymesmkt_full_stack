import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-publication',
  templateUrl: './filter-publication.component.html',
  styleUrls: ['./filter-publication.component.css']
})
export class FilterPublicationComponent implements OnInit {

  filterForm!: FormGroup;

  rangePrice : string[] = [
    '100.000 - 500.000',
    '500.000 - 1.000.000',
    '1.000.000 - 5.000.000',
    '5.000.000 - 10.000.000',
  ]
  
  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.filterForm = this.formBuilder.group({
      cantOfertas: [null],
      monto: [null],
      garantia: [false],
      tipo: [false],
    })

  }

  ngOnInit(): void {
  }

  sendForm() {

  }

  
}
