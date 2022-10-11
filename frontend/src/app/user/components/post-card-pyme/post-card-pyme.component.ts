import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PublicacionService } from '../../../core/services/publicacion/publicacion.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PymeServiceService } from '../../../core/services/pyme/pyme-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OfertaService } from '../../../core/services/oferta/oferta.service';


@Component({
  selector: 'app-post-card-pyme',
  templateUrl: './post-card-pyme.component.html',
  styleUrls: ['./post-card-pyme.component.css']
})
export class PostCardPymeComponent implements OnInit {

  publicaciones!: any[]
  empresa!: any
  idUsuario!: string
 
  // @ViewChild('closebutton') closebutton! : ElementRef;
 

  garantiaMapa = {
    'true': 'Si',
    'false': 'No'
  }

  // para realizar oferta
  maxPrice!: number;
  mensaje!: string;

  // Pagina actual
  page = 0;
  // Tamaño de elementos por página
  size = 2;
  // Representa a la cantidad total de publicaciones creadas
  numElement!: number;

  id = this.authService.usuario.id



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private publicacionService: PublicacionService,
    private ofertaService: OfertaService
  ) {
  }

  formularioOferta: FormGroup = this.fb.group({
    mensaje: [, Validators.required],
    precioOferta: [, Validators.required],
  })

  ngOnInit(): void {
    this.getPublicaciones()
  }
  
  getPublicaciones(){
    this.publicacionService.getAllPublicaciones(this.page - 1, this.size)
      .subscribe(({ content, totalPages }) => {
        this.publicaciones = content
        this.numElement = totalPages * this.size;
        console.log(this.publicaciones)
      })
  }

  isIdsIguales(itemId: string): boolean {
    if (this.id === itemId) {
      return false
    }
    return true
  }


  enviarOferta(publicacionId: string) {
    if (this.formularioOferta.invalid) {
      this.formularioOferta.markAllAsTouched()
      return
    }

    const nuevaOferta = {
      mensaje: this.formularioOferta.get('mensaje')?.value,
      precioOferta: this.formularioOferta.get('precioOferta')?.value,
      UsuarioId: this.id,
      PublicacionId: publicacionId
    }

    console.log(nuevaOferta)
    //conectar el servicio

    // if(this.closebutton.nativeElement.click()){
    //   console.log('dentro del close')
    // }
    
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tu oferta ha sido enviada!',
      showConfirmButton: false,
      timer: 2000
    }).then((result) => {
      if (result) {
        
        this.ofertaService.postOferta(nuevaOferta).subscribe();
        this.formularioOferta.reset();
        
        // Mensaje de oferta Swal
        // window.location.reload()
        this.router.navigate(['/user/home']);
      }
    }
    )


    
    // console.log(this.formularioOferta.value)
  }


  campoInvalido(campo: string) {
    return this.formularioOferta.get(campo)?.errors
      && this.formularioOferta.get(campo)?.touched
  }


  done() {
    this.getPublicaciones();
  }



}
