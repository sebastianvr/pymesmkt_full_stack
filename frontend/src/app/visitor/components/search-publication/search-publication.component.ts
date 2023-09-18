import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-publication',
  templateUrl: './search-publication.component.html',
  styleUrls: ['./search-publication.component.css']
})
export class SearchPublicationComponent implements OnInit {
  filterForm!: FormGroup;
  searchOptions: string[] = ['ID', 'Título'];
  selectedOption: string | null = null;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      searchOption: [null],
      searchTerm: [null],
    });
  }

  searchPublication() {
    if (!this.filterForm.valid) {
      return;
    }

    const formValues = this.filterForm.value;

    // Realiza la búsqueda en función de formValues.searchOption y formValues.searchTerm
    // Puedes implementar la lógica de búsqueda aquí y mostrar los resultados
    console.log('Opción de búsqueda:', formValues.searchOption);
    console.log('Término de búsqueda:', formValues.searchTerm);
  }

   selectSearchOption(option: string) {
    this.selectedOption = option;
    this.filterForm.patchValue({ searchOption: option });
  }
}
