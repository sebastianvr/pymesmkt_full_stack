import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardVisitorComponent } from './post-card-visitor.component';

describe('PostCardVisitorComponent', () => {
  let component: PostCardVisitorComponent;
  let fixture: ComponentFixture<PostCardVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCardVisitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
