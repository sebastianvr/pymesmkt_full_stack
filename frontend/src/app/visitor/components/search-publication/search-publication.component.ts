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
  selectedOption: string = 'titulo';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      searchTerm: [null, [Validators.required]],
      searchOption: ['titulo', Validators.required],
    });

    // Custom validator when option selected is 'id'.
    this.filterForm.get('searchOption')?.valueChanges.subscribe(option => {
      const searchTermControl = this.filterForm.get('searchTerm');
      searchTermControl?.setValidators(option === 'id' ? [Validators.required, this.idValidator] : Validators.required);
      searchTermControl?.updateValueAndValidity();
    });
  }

  sendForm() {
    // console.log('sendForm()');
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    const formValues = this.filterForm.value;
    const filter = {
      [formValues.searchOption]: formValues.searchTerm
    };

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
