import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardVisitorComponent } from './post-card-visitor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('PostCardVisitorComponent', () => {
  let component: PostCardVisitorComponent;
  let fixture: ComponentFixture<PostCardVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PostCardVisitorComponent,
      ],
      imports: [
        NgbModule,
        HttpClientTestingModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente debería crearse', () => {
    expect(component).toBeTruthy();
  });

  test('deberia obtener un numero', ()=>{
 
    // expect()
  })
});
