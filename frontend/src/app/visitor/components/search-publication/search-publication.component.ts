import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-publication',
  templateUrl: './search-publication.component.html',
  styleUrls: ['./search-publication.component.css']
})
export class SearchPublicationComponent implements OnInit {

  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  filterForm!: FormGroup;
  searchOptions: string[] = ['ID', 'Título'];
  selectedOption: string | null = null;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required, this.idValidator]],
      searchOption: [null, Validators.required]
    });
  }

  sendForm() {
    if (!this.filterForm.valid) {
      this.filterForm.markAllAsTouched();
      this.filterForm.markAsDirty();
      return;
    }

    const formValues = this.filterForm.value;

    console.log({ formValues });
    let filter = {}
    if (formValues.searchOption === 'ID') {
      filter = {
        id: formValues.searchTerm,
      };
    }

    if (formValues.searchOption === 'Título') {
      filter = {
        titulo: formValues.searchTerm,
      };
    }

    console.log('filter search ', { filter });

    this.formSubmitted.emit(filter);
  }

  selectSearchOption(option: string) {
    this.selectedOption = option;
    // this.filterForm.patchValue({ searchOption: option });
     // Cuando cambia la opción, resetea el campo searchTerm y elimina los errores
     this.filterForm.patchValue({ searchOption: option });
     this.filterForm.get('searchTerm')?.setErrors(null);
  }

  idValidator(control: AbstractControl): { [key: string]: any } | null {
    const uuidRegex = /^[0-9a-fA-F]{15}$/;
    const value = control.value;
  
    if (!value || !uuidRegex.test(value)) {
      return { invalidID: true };
    }
    return null;
  }
}
