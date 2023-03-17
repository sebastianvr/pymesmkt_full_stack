import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardPymeComponent } from './post-card-pyme.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OfertaService } from '../../../core/services/oferta/oferta.service';

describe('PostCardPymeComponent', () => {
  let component: PostCardPymeComponent;
  let fixture: ComponentFixture<PostCardPymeComponent>;

  let compiled : HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCardPymeComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NgbModule
      ],
      providers: [
        OfertaService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardPymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    compiled  = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('Debe hacer match con el snapshot', () => { 
    expect(compiled.innerHTML).toMatchSnapshot()
   })
});
