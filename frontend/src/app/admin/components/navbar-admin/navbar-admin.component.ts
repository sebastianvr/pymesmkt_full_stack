import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {


  nombreUsuario = this.authService.usuario.nombreUsuario

  constructor(
    private router : Router,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.logOut()
    this.router.navigate(['visitor'])
  }

}
