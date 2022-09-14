import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  private emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,

    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) { }

  formularioLogin: FormGroup = this.fb.group({
    emailUsuario: ['',
      [
        Validators.required,
        Validators.pattern(this.emailPattern)
      ],
    ],
    contrasenia: ['', Validators.required]
  })

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  login() {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched()
      return
    }

    console.log(this.formularioLogin.value)

    this.AuthService.login(this.formularioLogin.value).subscribe(ok => {
      console.log(ok)
      if (ok === true) {
        this.showMessageToast('success', 'Accediendo');
        this.router.navigate(['/user'])
      } else {
        // mostrar mensaje de error
        this.showMessageToast('error', 'Error', ok);
        this.formularioLogin.reset()
      }
    })

  }

  campoInvalido(campo: string) {
    return this.formularioLogin.controls[campo].errors
      && this.formularioLogin.controls[campo].touched
  }

  showMessageToast(severity : string, summary : string, detail : string = ''){
    this.messageService.add({ severity: severity, summary: summary, detail: detail })
  }
}
