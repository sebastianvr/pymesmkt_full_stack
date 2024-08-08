import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalArchivingComponent } from './modal-archiving.component';

describe('ModalArchivingComponent', () => {
  let component: ModalArchivingComponent;
  let fixture: ComponentFixture<ModalArchivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalArchivingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalArchivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
