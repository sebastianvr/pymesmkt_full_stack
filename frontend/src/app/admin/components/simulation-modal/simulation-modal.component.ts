import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { MessageService } from 'src/app/core/services/message/message.service';
import { SimulationService } from 'src/app/core/services/simulation/simulation.service';
import { SimulationResultModalComponent } from '../simulation-result-modal/simulation-result-modal.component';

@Component({
  selector: 'app-simulation-modal',
  templateUrl: './simulation-modal.component.html',
  styleUrls: ['./simulation-modal.component.css']
})
export class SimulationModalComponent implements OnInit {
  simulationForm!: FormGroup;
  isLoading = false;
  simulationResponse: any;
  private simulationModalRef!: NgbModalRef;
  private integerPattern: RegExp = /^[0-9]+$/;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private simulationService: SimulationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.simulationForm = this.formBuilder.group({
      nroUsuarios: [10, [
        Validators.required,
        Validators.min(10),
        Validators.max(150),
        Validators.pattern(this.integerPattern)]
      ],
      nroAdmins: [0, [
        Validators.min(0),
        Validators.max(20),
        Validators.pattern(this.integerPattern)]
      ],
      nroPublications: [null, [
        Validators.min(0),
        Validators.max(80),
        Validators.pattern(this.integerPattern)]
      ],
      nroOfertas: [null, [
        Validators.min(0),
        Validators.max(80),
        Validators.pattern(this.integerPattern)]
      ],
      nroCompras: [null, [
        Validators.min(0),
        Validators.max(80),
        Validators.pattern(this.integerPattern)]
      ],
      nroReclamos: [null, [
        Validators.min(0),
        Validators.max(80),
        Validators.pattern(this.integerPattern)]
      ],
    });
  }

  public async openSimulationModal(content: any) {
    this.simulationModalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    try {
      const result = await this.simulationModalRef.result;
      this.buildForm(); // Reset form on close or dismiss
    } catch (reason) {
      console.error(reason);
    }
  }

  public simulateDatabase() {
    if (this.isLoading) {
      return; // Salir si ya se está ejecutando la simulación
    }

    if (this.simulationForm.invalid) {
      this.simulationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    // Obtener los valores del formulario sin nulos 
    const formData = this.cleanFormData(this.simulationForm.value);

    this.simulationService.createSimulation(formData).pipe(
      catchError(error => {
        console.error('Error during simulation:', error);
        this.isLoading = false;
        if (error instanceof HttpErrorResponse) {
          this.messageService.showErrorMessage('Error al crear simulación!');
        }
        return [];
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(response => {
      this.simulationResponse = response;
      this.simulationModalRef.close();
      this.messageService.showSuccessMessage('Simulación finalizada');
      this.openResponseModal();
    });
  }

  // Filtrar los valores para eliminar los null
  private cleanFormData(formData: any): any {
    const cleanedData: any = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        cleanedData[key] = formData[key];
      }
    });
    return cleanedData;
  }

  public async openResponseModal() {
    const modalRef = this.modalService.open(SimulationResultModalComponent, {
      centered: true,
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });
    modalRef.componentInstance.simulationResponse = this.simulationResponse;

    await modalRef.result;
  }
}
