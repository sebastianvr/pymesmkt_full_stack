import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardPymeComponent } from './post-card-pyme.component';

describe('PostCardPymeComponent', () => {
  let component: PostCardPymeComponent;
  let fixture: ComponentFixture<PostCardPymeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCardPymeComponent ]
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
