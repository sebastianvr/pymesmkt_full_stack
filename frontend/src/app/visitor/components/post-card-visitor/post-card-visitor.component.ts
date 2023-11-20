import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-card-visitor',
  templateUrl: './post-card-visitor.component.html',
  styleUrls: ['./post-card-visitor.component.css'],
})
export class PostCardVisitorComponent implements OnInit {
  @Input() publicaciones: any;
  @Input() isLoading: any;

  // Custom Pipe 
  garantiaMapa = {
    'true': 'Si',
    'false': 'No',
  };

  constructor() { }

  ngOnInit(): void {
    // console.log('this.publicaciones', this.publicaciones);
    // console.log('this.isLoading', this.isLoading);
  }
}
