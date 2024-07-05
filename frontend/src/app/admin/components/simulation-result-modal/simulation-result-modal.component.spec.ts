import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationResultModalComponent } from './simulation-result-modal.component';

describe('SimulationResultModalComponent', () => {
  let component: SimulationResultModalComponent;
  let fixture: ComponentFixture<SimulationResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationResultModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
