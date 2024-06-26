import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHelpGraphComponent } from './modal-help-graph.component';

describe('ModalHelpGraphComponent', () => {
  let component: ModalHelpGraphComponent;
  let fixture: ComponentFixture<ModalHelpGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalHelpGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHelpGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
