import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  get usuario(){
    return this.authService.usuario
  }
  constructor(
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    // console.log('asdasd', this.usuario)
  }



}
