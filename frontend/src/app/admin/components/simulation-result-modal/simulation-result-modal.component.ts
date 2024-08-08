import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-simulation-result-modal',
  templateUrl: './simulation-result-modal.component.html',
  styleUrls: ['./simulation-result-modal.component.css']
})
export class SimulationResultModalComponent implements OnInit {
  @Input() simulationResponse: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
