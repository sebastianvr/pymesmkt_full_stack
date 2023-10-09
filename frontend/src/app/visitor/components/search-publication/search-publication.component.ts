import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-publication',
  templateUrl: './search-publication.component.html',
  styleUrls: ['./search-publication.component.css']
})
export class SearchPublicationComponent implements OnInit {

  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  filterForm!: FormGroup;
  searchOptions: string[] = ['id', 'título'];
  selectedOption: string = 'título';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required]],
      searchOption: ['título', Validators.required],
    });

    // Aplicar la validación personalizada solo cuando la opción seleccionada es 'id'
    this.filterForm.get('searchOption')?.valueChanges.subscribe(option => {
      if (option === 'id') {
        this.filterForm.get('searchTerm')?.setValidators([Validators.required, this.idValidator]);
      } else {
        this.filterForm.get('searchTerm')?.setValidators(Validators.required);
      }
      this.filterForm.get('searchTerm')?.updateValueAndValidity();
    });
  }

  sendForm() {
    console.log('sendForm()');
    if (!this.filterForm.valid) {
      this.filterForm.markAllAsTouched();
      this.filterForm.markAsDirty();
      return;
    }

    const formValues = this.filterForm.value;

    console.log({ formValues });
    let filter = {}
    if (formValues.searchOption === 'id') {
      filter = {
        id: formValues.searchTerm,
      };
    }

    if (formValues.searchOption === 'título') {
      filter = {
        titulo: formValues.searchTerm,
      };
    }

    console.log('filter search ', { filter });

    this.formSubmitted.emit(filter);
  }

  selectSearchOption(event: any) {
    const selectedOption = (event.target as HTMLSelectElement).value;
    this.selectedOption = selectedOption;
    
    this.filterForm.patchValue({ searchOption: selectedOption });
    this.filterForm.patchValue({ searchTerm: null });

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
