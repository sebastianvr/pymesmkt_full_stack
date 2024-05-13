import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-navbar-pyme',
  templateUrl: './navbar-pyme.component.html',
  styleUrls: ['./navbar-pyme.component.css']
})
export class NavbarPymeComponent implements OnInit {
  userName: string = this.authService.usuario.nombreUsuario;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // console.log(this.userName);
  }

  public logOut() {
    this.authService.logOut();
    this.router.navigate(['visitor']);
  }
}
