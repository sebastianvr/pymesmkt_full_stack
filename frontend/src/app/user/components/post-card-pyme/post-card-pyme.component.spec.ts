import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardPymeComponent } from './post-card-pyme.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('PostCardPymeComponent', () => {
  let component: PostCardPymeComponent;
  let fixture: ComponentFixture<PostCardPymeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCardPymeComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NgbModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardPymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
